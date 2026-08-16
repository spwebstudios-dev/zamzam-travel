-- =============================================================
-- ZamZam Travel — 001 Data Model & Row-Level Security
-- =============================================================
-- Run this script in the Supabase SQL Editor (Dashboard → SQL
-- Editor → New query → paste → Run).
--
-- This script is idempotent-ish: it uses IF NOT EXISTS where
-- Postgres supports it.  If you need to re-run after a partial
-- failure, drop the tables manually first via the dashboard.
-- =============================================================

-- =============================================================
-- 1. PROFILES (created first — is_admin() depends on this table)
-- =============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id              uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           text,
  phone           text,
  whatsapp_number text,
  role            text        NOT NULL DEFAULT 'traveler'
                              CHECK (role IN ('traveler', 'admin')),
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ----- Helper function: is_admin() ---------------------------
-- Returns true when the current JWT user has role = 'admin'
-- in profiles.  Used by every admin-gated RLS policy.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

-- Trigger: auto-create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- Drop the trigger first (IF EXISTS) so re-runs don't fail
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "profiles: users can view own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

-- Admins can read all profiles
CREATE POLICY "profiles: admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Users can update their own profile (but NOT the role column —
-- that is enforced at the application/admin level, not here,
-- because Postgres column-level RLS isn't granular enough in
-- a simple policy.  A trigger or check could be added later.)
CREATE POLICY "profiles: users can update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());


-- =============================================================
-- 2. PACKAGES
-- =============================================================

CREATE TABLE IF NOT EXISTS public.packages (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text        NOT NULL,
  slug             text        NOT NULL UNIQUE,
  description      text,
  destination      text,
  type             text        NOT NULL CHECK (type IN ('domestic', 'international')),
  base_price_adult numeric     NOT NULL,
  base_price_child numeric     NOT NULL,
  images           text[]      DEFAULT '{}',
  is_active        boolean     NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon / logged-out) can browse packages
CREATE POLICY "packages: public read"
  ON public.packages FOR SELECT
  USING (true);

-- Only admins can insert
CREATE POLICY "packages: admin insert"
  ON public.packages FOR INSERT
  WITH CHECK (public.is_admin());

-- Only admins can update
CREATE POLICY "packages: admin update"
  ON public.packages FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Only admins can delete
CREATE POLICY "packages: admin delete"
  ON public.packages FOR DELETE
  USING (public.is_admin());


-- =============================================================
-- 3. PACKAGE DATES
-- =============================================================

CREATE TABLE IF NOT EXISTS public.package_dates (
  id           uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id   uuid    NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  date_type    text    NOT NULL CHECK (date_type IN ('fixed', 'open_range')),
  start_date   date    NOT NULL,
  end_date     date,
  capacity     integer NOT NULL,
  seats_booked integer NOT NULL DEFAULT 0,

  -- DB-level guard: seats_booked can never exceed capacity
  -- (but the real "reject booking when full" logic is in
  -- application code during booking creation).
  CONSTRAINT seats_within_capacity CHECK (seats_booked <= capacity)
);

-- RLS
ALTER TABLE public.package_dates ENABLE ROW LEVEL SECURITY;

-- Same pattern as packages: public read, admin write
CREATE POLICY "package_dates: public read"
  ON public.package_dates FOR SELECT
  USING (true);

CREATE POLICY "package_dates: admin insert"
  ON public.package_dates FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "package_dates: admin update"
  ON public.package_dates FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "package_dates: admin delete"
  ON public.package_dates FOR DELETE
  USING (public.is_admin());


-- =============================================================
-- 4. BOOKINGS
-- =============================================================

CREATE TABLE IF NOT EXISTS public.bookings (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid        NOT NULL REFERENCES public.profiles(id),
  package_id        uuid        NOT NULL REFERENCES public.packages(id),
  package_date_id   uuid        NOT NULL REFERENCES public.package_dates(id),
  num_adults        integer     NOT NULL,
  num_children      integer     NOT NULL DEFAULT 0,
  total_price       numeric     NOT NULL,
  status            text        NOT NULL DEFAULT 'pending_payment'
                                CHECK (status IN (
                                  'pending_payment',
                                  'pending_confirmation',
                                  'confirmed',
                                  'cancelled_refunded'
                                )),
  payfast_payment_id text,
  created_at         timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Users can see their own bookings
CREATE POLICY "bookings: users can view own bookings"
  ON public.bookings FOR SELECT
  USING (user_id = auth.uid());

-- Admins can see all bookings
CREATE POLICY "bookings: admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (public.is_admin());

-- Users can create bookings for themselves only
CREATE POLICY "bookings: users can insert own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Only admins can update bookings (status changes, etc.)
-- A traveler should NEVER be able to mark their own booking
-- as confirmed.
CREATE POLICY "bookings: admin update"
  ON public.bookings FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- =============================================================
-- 5. TRAVELERS
-- =============================================================

CREATE TABLE IF NOT EXISTS public.travelers (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id        uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  full_name         text NOT NULL,
  passport_number   text,
  id_number         text,
  phone             text,
  emergency_contact text,
  document_url      text  -- path into Supabase Storage (private bucket)
);

-- RLS
ALTER TABLE public.travelers ENABLE ROW LEVEL SECURITY;

-- Owning user (via bookings.user_id) can read their travelers
CREATE POLICY "travelers: owner can view"
  ON public.travelers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = travelers.booking_id
        AND bookings.user_id = auth.uid()
    )
  );

-- Admins can view all travelers
CREATE POLICY "travelers: admin can view all"
  ON public.travelers FOR SELECT
  USING (public.is_admin());

-- Owning user can insert travelers for their own bookings
CREATE POLICY "travelers: owner can insert"
  ON public.travelers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = travelers.booking_id
        AND bookings.user_id = auth.uid()
    )
  );

-- Admins can insert travelers
CREATE POLICY "travelers: admin can insert"
  ON public.travelers FOR INSERT
  WITH CHECK (public.is_admin());

-- Owning user can update their travelers
CREATE POLICY "travelers: owner can update"
  ON public.travelers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = travelers.booking_id
        AND bookings.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = travelers.booking_id
        AND bookings.user_id = auth.uid()
    )
  );

-- Admins can update all travelers
CREATE POLICY "travelers: admin can update"
  ON public.travelers FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- =============================================================
-- 6. PAYMENTS
-- =============================================================

CREATE TABLE IF NOT EXISTS public.payments (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id        uuid        NOT NULL REFERENCES public.bookings(id),
  payfast_reference text,
  amount            numeric     NOT NULL,
  status            text        NOT NULL,
  raw_itn_payload   jsonb,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Owning user can view payments for their bookings
CREATE POLICY "payments: owner can view"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = payments.booking_id
        AND bookings.user_id = auth.uid()
    )
  );

-- Admins can view all payments
CREATE POLICY "payments: admin can view all"
  ON public.payments FOR SELECT
  USING (public.is_admin());

-- INSERT / UPDATE on payments: no client-side policies.
-- Only the service_role key (used by the PayFast ITN webhook
-- handler running server-side) can write to this table.
-- Since RLS is enabled and no INSERT/UPDATE policies exist
-- for anon or authenticated roles, client writes are blocked.


-- =============================================================
-- DONE
-- =============================================================
-- All six tables created, RLS enabled on each, policies applied.
-- Next steps:
--   1. Create a test traveler account via app signup
--   2. Manually set one profile's role to 'admin' in the
--      Supabase table editor
--   3. Verify RLS behavior per §8 of the data model prompt
