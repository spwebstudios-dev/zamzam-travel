# Architecture — ZamZam Travel Website

## 1. High-level system

```
Traveler (browser, mobile-first)
   |
   v
Next.js frontend  <-->  Next.js API routes  <-->  Supabase (Postgres, Auth, Storage)
                              |
                              v
                          PayFast (redirect to pay + ITN webhook back to our API)
                              |
                              v
                    Email + WhatsApp notification services
```

Admin (Irfan) uses the same Next.js app, at admin-only routes, gated by
a `role = admin` check on top of Supabase Auth.

## 2. Data model (core tables)

**users** (managed by Supabase Auth, extended with a profile table)
- id, email, phone, whatsapp_number, role (`traveler` | `admin`), created_at

**packages**
- id, title, description, destination, domestic_or_international,
  base_price_adult, base_price_child, images, is_active

**package_dates**
- id, package_id, date_type (`fixed` | `open_range`), start_date,
  end_date (for open range), capacity, seats_booked

**bookings**
- id, user_id, package_id, package_date_id, num_adults, num_children,
  total_price, status (`pending_payment` | `pending_confirmation` |
  `confirmed` | `cancelled_refunded`), payfast_payment_id, created_at

**travelers** (one row per person on a booking, since group bookings
collect details per traveler)
- id, booking_id, full_name, passport_number, id_number, phone,
  emergency_contact, document_url (private storage reference)

**payments**
- id, booking_id, payfast_reference, amount, status, raw_itn_payload,
  created_at

## 3. Booking + payment flow (detail)

1. Traveler submits booking form → row created in `bookings` with status
   `pending_payment`, plus one row per `travelers`.
2. Server checks `package_dates.seats_booked < capacity` before allowing
   this — if full, booking is rejected before payment starts.
3. Traveler is redirected to PayFast to pay.
4. PayFast sends a server-to-server **ITN (Instant Transaction
   Notification)** to our API route once payment completes.
5. Our API route:
   - **Verifies the ITN signature** (critical — never trust an
     unverified webhook call).
   - Confirms payment amount matches the booking total.
   - Updates `bookings.status` → `pending_confirmation`.
   - Increments `package_dates.seats_booked`.
   - Triggers email + WhatsApp confirmation to the traveler.
6. Irfan reviews pending bookings in the admin panel:
   - **Confirm** → status → `confirmed`, traveler notified.
   - **Cannot fulfill** → status → `cancelled_refunded`, refund
     (minus processing fee) triggered, traveler notified.

## 4. Security model

- **Row-level security (RLS)** in Supabase:
  - Travelers can only `SELECT`/`UPDATE` their own `bookings` and
    `travelers` rows.
  - Only `role = admin` can read/write across all bookings, packages,
    and customer records.
- **Passport/ID documents**: stored in a private Supabase Storage bucket.
  No public URLs. Admin views them via a signed URL generated
  server-side, expiring after a short window.
- **PayFast ITN endpoint**: signature-verified on every call; also
  validates the source IP/domain per PayFast's documented requirements.
- **No card data** ever touches our servers or database — PayFast's
  hosted payment page handles that entirely.
- **Passwords**: never stored directly — handled by Supabase Auth.
- **Transport**: HTTPS enforced everywhere (default on Vercel).

## 5. Open items to resolve before/while building

- Finalize WhatsApp sending provider (Twilio vs Meta Cloud API) —
  affects setup steps and cost once past free tier.
- Confirm capacity default per package with Irfan (recommended: set per
  package, not a single global default).
- Confirm refund processing fee amount/percentage for the policy text.
