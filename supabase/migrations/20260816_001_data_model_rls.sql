-- =============================================================
-- ZamZam Travel — Data Model & Row-Level Security
-- Migration: 20260816_001_data_model_rls.sql
-- =============================================================

-- ─────────────────────────────────────────
-- 1. PROFILES  (extends auth.users)
-- ─────────────────────────────────────────
create table if not exists public.profiles (
  id               uuid primary key references auth.users (id) on delete cascade,
  email            text not null,
  phone            text,
  whatsapp_number  text,
  role             text not null default 'traveler'
                     check (role in ('traveler', 'admin')),
  created_at       timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth.users row is inserted
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ─────────────────────────────────────────
-- 2. PACKAGES
-- ─────────────────────────────────────────
create table if not exists public.packages (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null,
  slug                text not null unique,
  description         text not null,
  destination         text not null,
  type                text not null check (type in ('domestic', 'international')),
  base_price_adult    numeric not null check (base_price_adult >= 0),
  base_price_child    numeric not null check (base_price_child >= 0),
  images              text[] not null default '{}',
  is_active           boolean not null default true,
  created_at          timestamptz not null default now()
);


-- ─────────────────────────────────────────
-- 3. PACKAGE DATES
-- ─────────────────────────────────────────
create table if not exists public.package_dates (
  id           uuid primary key default gen_random_uuid(),
  package_id   uuid not null references public.packages (id) on delete cascade,
  date_type    text not null check (date_type in ('fixed', 'open_range')),
  start_date   date not null,
  end_date     date,
  capacity     integer not null check (capacity > 0),
  seats_booked integer not null default 0,
  constraint seats_not_exceed_capacity check (seats_booked <= capacity)
);


-- ─────────────────────────────────────────
-- 4. BOOKINGS
-- ─────────────────────────────────────────
create table if not exists public.bookings (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles (id),
  package_id          uuid not null references public.packages (id),
  package_date_id     uuid not null references public.package_dates (id),
  num_adults          integer not null check (num_adults > 0),
  num_children        integer not null default 0 check (num_children >= 0),
  total_price         numeric not null check (total_price >= 0),
  status              text not null default 'pending_payment'
                        check (status in (
                          'pending_payment',
                          'pending_confirmation',
                          'confirmed',
                          'cancelled_refunded'
                        )),
  payfast_payment_id  text,
  created_at          timestamptz not null default now()
);


-- ─────────────────────────────────────────
-- 5. TRAVELERS (per-person details)
-- ─────────────────────────────────────────
create table if not exists public.travelers (
  id                uuid primary key default gen_random_uuid(),
  booking_id        uuid not null references public.bookings (id) on delete cascade,
  full_name         text not null,
  passport_number   text,
  id_number         text,
  phone             text,
  emergency_contact text,
  document_url      text
);


-- ─────────────────────────────────────────
-- 6. PAYMENTS
-- ─────────────────────────────────────────
create table if not exists public.payments (
  id                  uuid primary key default gen_random_uuid(),
  booking_id          uuid not null references public.bookings (id),
  payfast_reference   text,
  amount              numeric not null check (amount >= 0),
  status              text not null,
  raw_itn_payload     jsonb,
  created_at          timestamptz not null default now()
);


-- =============================================================
-- 7. ROW-LEVEL SECURITY
-- =============================================================

create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;


-- ── profiles ──────────────────────────────
alter table public.profiles enable row level security;

create policy "profiles: own row select"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles: own row update"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());


-- ── packages ──────────────────────────────
alter table public.packages enable row level security;

create policy "packages: public read"
  on public.packages for select
  using (true);

create policy "packages: admin insert"
  on public.packages for insert
  with check (public.is_admin());

create policy "packages: admin update"
  on public.packages for update
  using (public.is_admin());

create policy "packages: admin delete"
  on public.packages for delete
  using (public.is_admin());


-- ── package_dates ─────────────────────────
alter table public.package_dates enable row level security;

create policy "package_dates: public read"
  on public.package_dates for select
  using (true);

create policy "package_dates: admin insert"
  on public.package_dates for insert
  with check (public.is_admin());

create policy "package_dates: admin update"
  on public.package_dates for update
  using (public.is_admin());

create policy "package_dates: admin delete"
  on public.package_dates for delete
  using (public.is_admin());


-- ── bookings ──────────────────────────────
alter table public.bookings enable row level security;

create policy "bookings: own select"
  on public.bookings for select
  using (user_id = auth.uid() or public.is_admin());

create policy "bookings: own insert"
  on public.bookings for insert
  with check (user_id = auth.uid());

create policy "bookings: admin update"
  on public.bookings for update
  using (public.is_admin());

create policy "bookings: admin delete"
  on public.bookings for delete
  using (public.is_admin());


-- ── travelers ─────────────────────────────
alter table public.travelers enable row level security;

create policy "travelers: owner or admin select"
  on public.travelers for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.bookings b
      where b.id = travelers.booking_id
        and b.user_id = auth.uid()
    )
  );

create policy "travelers: owner insert"
  on public.travelers for insert
  with check (
    exists (
      select 1 from public.bookings b
      where b.id = travelers.booking_id
        and b.user_id = auth.uid()
    )
  );

create policy "travelers: owner update"
  on public.travelers for update
  using (
    public.is_admin()
    or exists (
      select 1 from public.bookings b
      where b.id = travelers.booking_id
        and b.user_id = auth.uid()
    )
  );

create policy "travelers: admin delete"
  on public.travelers for delete
  using (public.is_admin());


-- ── payments ──────────────────────────────
alter table public.payments enable row level security;

create policy "payments: owner or admin select"
  on public.payments for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.bookings b
      where b.id = payments.booking_id
        and b.user_id = auth.uid()
    )
  );

-- No INSERT/UPDATE/DELETE policies = only service_role can write payments.
