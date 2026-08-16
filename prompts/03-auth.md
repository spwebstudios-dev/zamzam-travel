# 03 — Authentication (Traveler & Admin)

Re-read docs/Architecture.md (§Security model) and docs/Routes.md before
starting. This prompt wires up real Supabase Auth against the profiles
table and RLS policies built in 02-data-model.md — no new tables, no
booking logic yet.

## Goal

Working signup, login, logout, and a route-protection pattern that
distinguishes traveler pages from admin pages, based on the
`profiles.role` column.

## 1. Signup page — `/signup`

Build a real form: email, password, phone, WhatsApp number. On submit:
- Create the Supabase Auth user
- Confirm the `profiles` row was auto-created by the trigger from
  02-data-model.md, then update it with phone/whatsapp_number
- Role defaults to `'traveler'` — there is no signup path that lets a
  user set their own role to admin

## 2. Login page — `/login`

Standard email + password form against Supabase Auth. On success,
redirect to `/account`. On failure, show a clear, non-technical error
(don't leak whether the email exists or the password was wrong —
just "Invalid email or password").

## 3. Logout

A logout action (can live in the header/nav) that clears the session
and redirects to `/`.

## 4. Session handling

Set up Supabase's Next.js session/middleware pattern so the logged-in
state is available across server and client components consistently
(cookie-based session, not just client-side state) — this matters
because both traveler pages and the PayFast webhook flow later depend
on knowing who's logged in reliably.

## 5. Route protection

Create a reusable check (e.g. a server-side helper or middleware) for
two protection levels:

- **Traveler-protected**: `/account`, `/account/bookings`,
  `/book/[packageId]`, `/book/[packageId]/pay`,
  `/book/confirmation/[bookingId]` — redirect to `/login` if no session.

- **Admin-protected**: any future `/admin/*` route — redirect to `/`
  (not just `/login`) if the logged-in user's `profiles.role` isn't
  `'admin'`. Do not expose *why* access was denied to the user — just
  redirect, don't show "you're not an admin."

Admin routes don't exist yet (that's a later prompt) — just build the
protection helper now so it's ready to apply.

## 6. Account page — `/account`

Minimal for now: show the logged-in user's email, phone, WhatsApp
number, with an edit form that updates the `profiles` row. This is the
first real authenticated page, so it's also your test case for the
whole flow.

## 7. Verify

- Sign up a new traveler account — confirm a `profiles` row exists
  with `role = 'traveler'`
- Log out, log back in — session persists correctly
- Visiting `/account` while logged out redirects to `/login`
- Manually flip one test user's role to `'admin'` in the Supabase
  dashboard, confirm the admin-check helper correctly identifies them
  as admin (even though there's no admin page to visit yet)
- Confirm RLS still holds: a logged-in traveler querying `bookings`
  gets zero rows (there are none yet), not an error — the policy
  should just correctly scope to nothing rather than fail

## Explicitly do not do in this step

- No admin pages/dashboard yet
- No booking form yet
- No password reset flow yet (note it as a backlog item if you want,
  but not required for v1 launch per PRD.md)
- No email verification requirement beyond Supabase Auth's defaults
  (don't build custom verification UI)