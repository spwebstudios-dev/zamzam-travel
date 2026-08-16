# Progress — ZamZam Travel Website

Running log. Update after each feature is built and verified — short
entries, not essays.

## Status: Data model deployed ✓ — next: Auth (signup/login)

## Completed
- [x] Requirements gathered (PRD.md)
- [x] Tech stack decided (Tech_Stack.md)
- [x] Data model + architecture sketched (Architecture.md)
- [x] Route map drafted (Routes.md)
- [x] Design direction set from brand logo (Design.md)
- [x] Agent working rules set (Agents.md)
- [x] **Project scaffold (2026-08-16)**
  - `@supabase/supabase-js` installed
  - `lib/supabase.ts` — singleton Supabase client (anon key, env-var driven)
  - `app/globals.css` — full brand token system via Tailwind v4 `@theme`
    (all colors/fonts/spacing from `design/brand/palette-notes.md`)
  - `app/layout.tsx` — root layout with `<Header>` + `<Footer>`
  - `components/layout/Header.tsx` — brand header (glassmorphism, mobile
    hamburger, "Book Now" CTA, desktop nav)
  - `components/layout/Footer.tsx` — brand footer (contact, WhatsApp link,
    policy links, gold divider)
  - All 13 public + traveler route shells created per `Routes.md`
    (not admin — deferred to later step)
  - `npm run dev` starts clean, all routes reachable
  - `.env.local` confirmed not tracked by git
- [x] **Data model & RLS migration (2026-08-16)**
  - `supabase/migrations/001_data_model_and_rls.sql` — written and **run successfully** in Supabase SQL Editor
  - 6 tables live: `profiles`, `packages`, `package_dates`, `bookings`,
    `travelers`, `payments`
  - `handle_new_user()` trigger auto-creates profile on signup
  - `is_admin()` helper function for RLS policy checks
  - 19 RLS policies active across all tables
  - `SUPABASE_SERVICE_ROLE_KEY` added to `.env.local` (server-side only)
  - `tsconfig.json` — added `"types": ["node"]` to fix `process.env` error
  - Git remote configured + pushed to GitHub

## In Progress
- [ ] (nothing yet — start next step)

## Next Up (suggested order)
1. ~~Project scaffold~~ ✓
2. ~~Data model~~ ✓
3. Auth: traveler signup/login, admin role
4. Package browsing: `/packages`, `/packages/[slug]` (read-only, seeded
   test data)
5. Admin: package management (create/edit packages + dates/capacity)
6. Booking form: date + group size + traveler details + document upload
7. PayFast integration: sandbox payment, ITN webhook, signature
   verification
8. Confirmation flow: email + WhatsApp notification on payment success
9. Admin: booking review (confirm / cannot-fulfill + refund)
10. Traveler account: booking history/status view
11. Policy pages: refund policy, privacy policy (POPIA)
12. Mobile QA pass + luxury/premium styling polish
13. Domain + production PayFast credentials + go live

## Decisions Log
See `PRD.md` for the full decision history from planning. Add new
decisions here as they come up during the build, with a one-line date +
summary.
