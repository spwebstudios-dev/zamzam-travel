# PRD — ZamZam Travel Website

## 1. Overview

ZamZam Travel (Fordsburg, Johannesburg) currently takes bookings manually
over WhatsApp. This project adds a self-service website where travelers can
browse packages, create an account, book, and pay online — with WhatsApp
staying as the support channel, not the booking channel.

**Owner/Admin:** Irfan — sole admin, reviews and confirms every booking,
maintains the package catalog.

**Brand:** Zam Zam Travel — "Your Journey, Our Priority." Luxury/premium,
elegant, understated. See `Design.md`.

## 2. Users

| Role | Who | Access |
|---|---|---|
| Traveler | Public, creates an account to book | Own profile, own bookings only |
| Admin | Irfan only | Full backend: packages, bookings, customers |

There is no "staff" role in v1 — Irfan is the only backend user.

## 3. Core Flow (v1)

1. Traveler browses packages (domestic + international, <10 at launch).
2. Traveler opens a package, picks a date (fixed departure or open-calendar
   depending on the package) and group size (single / duo / group, with
   adult/child counts).
3. Traveler creates an account (or logs in) — required to book.
4. Traveler fills in per-traveler details: name, email, phone, WhatsApp
   number, passport number, ID number, emergency contact, and uploads a
   passport/ID scan per traveler.
5. Price is calculated: per-person rate (adult/child tiers) × group size.
   No deposits — full payment only.
6. Traveler pays via PayFast.
7. On successful payment:
   - Booking status → **Pending Confirmation**
   - Traveler sees on-screen confirmation
   - Automated email + WhatsApp message sent: *"Booking Request Received!
     We are issuing your tickets and will send your full travel itinerary
     shortly."*
8. Irfan reviews the pending booking in the admin panel and confirms it
   (or cannot confirm — see below).
9. Traveler can view booking status/history in their account at any time.

## 4. Business Rules

- **Pricing:** fixed per person, separate adult/child rates per package.
  No date/season-based price variation in v1.
- **Capacity:** each package date has a seat limit (recommended default,
  Irfan can adjust per package). Booking decrements available seats;
  a full date shows as sold out before payment is attempted.
- **If Irfan can't confirm a paid booking** (e.g. trip fills up between
  payment and review): refund issued minus a processing fee.
- **No partial/deposit payments** — one payment covers the full booking.
- **Support:** WhatsApp click-to-chat button (Irfan's number), not live
  chat or a bot, for v1.

## 5. Data Collected Per Traveler

Name, email, phone, WhatsApp number, passport number, ID number,
emergency contact, passport/ID document upload (image/PDF).

This is sensitive personal data — see `Architecture.md` §Security and the
POPIA note below.

## 6. In Scope — v1

- Public package browsing (domestic + international)
- Customer accounts (signup/login, booking history)
- Booking flow with date + group size selection
- PayFast payment integration (full payment, no deposits)
- Automated email + WhatsApp booking confirmations
- Admin panel: manage packages, review/confirm bookings, view customers
- WhatsApp click-to-chat support button
- Mobile-first responsive design, luxury/premium brand styling

## 7. Explicitly Out of Scope — v1 (backlog for v2+)

- AI chat bot (deferred — WhatsApp button covers this for now)
- Additional payment gateways (Capitec Pay etc.) beyond PayFast
- Deposit / partial payment bookings
- Multiple admin/staff accounts with permission tiers
- Multi-language site

## 8. Compliance Notes (not legal advice)

- **POPIA:** the site collects passport numbers, ID numbers, and document
  scans — this is sensitive personal information under South Africa's
  POPIA. The site needs a real privacy policy, and Irfan should have it
  reviewed properly, not just take this doc as sufficient.
- **Refund/cancellation policy:** needs to be drafted and published on the
  site (referenced in booking flow before payment).
- **Tourism industry registration** (e.g. TBCSA): still unconfirmed —
  Irfan to check whether this affects what must be disclosed on-site.

## 9. Timeline & Constraints

- Target launch: 1–2 months
- Solo builder (Shahid), using Antigravity as AI coding agent
- Free-tier hosting/services (Supabase, Vercel) for v1
- Git + GitHub, using git worktrees for parallel feature work
