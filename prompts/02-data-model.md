# 02 — Data Model & Row-Level Security

Re-read docs/Architecture.md before starting — this prompt implements
the tables and security rules described in its "Data model" and
"Security model" sections exactly. Do not add columns, tables, or
relax security rules that aren't specified there.

## Goal

Create the actual Supabase tables, relationships, and row-level
security (RLS) policies. No UI, no booking logic yet — just the data
layer everything else will read/write against.

## 1. Extend the auth-linked profile table

Supabase Auth already creates a `auth.users` table we don't touch
directly. Create a `public.profiles` table:

- `id` (uuid, references `auth.users.id`, primary key)
- `email` (text)
- `phone` (text, nullable)
- `whatsapp_number` (text, nullable)
- `role` (text, either `'traveler'` or `'admin'`, default `'traveler'`)
- `created_at` (timestamptz, default now())

Set up a trigger so a `profiles` row is auto-created whenever a new
user signs up via Supabase Auth — the app should never have to
manually insert into `profiles` after signup.

## 2. Packages

`public.packages`:
- `id` (uuid, primary key, default gen_random_uuid())
- `title` (text)
- `slug` (text, unique — used in the /packages/[slug] route)
- `description` (text)
- `destination` (text)
- `type` (text: `'domestic'` or `'international'`)
- `base_price_adult` (numeric)
- `base_price_child` (numeric)
- `images` (text array, or a separate images table if you prefer —
  keep it simple as an array for v1)
- `is_active` (boolean, default true)
- `created_at` (timestamptz, default now())

## 3. Package dates

`public.package_dates`:
- `id` (uuid, primary key)
- `package_id` (uuid, references packages.id, on delete cascade)
- `date_type` (text: `'fixed'` or `'open_range'`)
- `start_date` (date)
- `end_date` (date, nullable — used for open_range)
- `capacity` (integer)
- `seats_booked` (integer, default 0)

Add a check constraint: `seats_booked <= capacity` should never be
violated by a direct write — but the actual enforcement of "don't allow
booking past capacity" happens in application logic during booking
creation (flag this as a note, don't try to solve it with only a DB
constraint here).

## 4. Bookings

`public.bookings`:
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles.id)
- `package_id` (uuid, references packages.id)
- `package_date_id` (uuid, references package_dates.id)
- `num_adults` (integer)
- `num_children` (integer, default 0)
- `total_price` (numeric)
- `status` (text: `'pending_payment'`, `'pending_confirmation'`,
  `'confirmed'`, `'cancelled_refunded'` — default `'pending_payment'`)
- `payfast_payment_id` (text, nullable)
- `created_at` (timestamptz, default now())

## 5. Travelers (per-person details on a booking)

`public.travelers`:
- `id` (uuid, primary key)
- `booking_id` (uuid, references bookings.id, on delete cascade)
- `full_name` (text)
- `passport_number` (text)
- `id_number` (text)
- `phone` (text)
- `emergency_contact` (text)
- `document_url` (text — a reference/path into Supabase Storage, not
  a public URL)

## 6. Payments

`public.payments`:
- `id` (uuid, primary key)
- `booking_id` (uuid, references bookings.id)
- `payfast_reference` (text)
- `amount` (numeric)
- `status` (text)
- `raw_itn_payload` (jsonb — store the full webhook payload for
  auditing/debugging)
- `created_at` (timestamptz, default now())

## 7. Row-Level Security — enable on every table above

General pattern, per docs/Architecture.md §Security model:

- **profiles**: a user can `SELECT`/`UPDATE` only their own row
  (`id = auth.uid()`). Admins can `SELECT` all rows.
- **packages**: `SELECT` is public (anyone can browse, including
  logged-out visitors). `INSERT`/`UPDATE`/`DELETE` restricted to
  `role = 'admin'`.
- **package_dates**: same pattern as packages — public read, admin
  write.
- **bookings**: a user can `SELECT`/`INSERT` only rows where
  `user_id = auth.uid()`. `UPDATE` (e.g. status changes) restricted to
  admin only — a traveler should never be able to mark their own
  booking as confirmed.
- **travelers**: readable/writable only by the owning user (via a join
  back to bookings.user_id) or an admin.
- **payments**: readable only by admin and the owning user (via join to
  bookings); writes restricted to the service role only (the webhook
  handler), never from client-side code.

Write these as actual Postgres RLS policies, not just application-level
checks — the point is that even a compromised or buggy frontend can't
bypass them.

## 8. Verify

- Create a test traveler account and a test admin account (manually
  set one profile's role to 'admin' via the Supabase dashboard for
  testing).
- Confirm: traveler account can read packages but cannot insert one.
- Confirm: traveler account can see only their own bookings, not
  another test user's.
- Confirm: admin account can read across all tables.

## Explicitly do not do in this step

- No Supabase Storage bucket setup yet (that's part of the booking
  form step, when uploads are actually needed)
- No PayFast webhook code yet
- No admin UI yet — this is database + policies only, verified via the
  Supabase dashboard's SQL editor / table view, not through the app