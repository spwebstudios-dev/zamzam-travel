# Routes — ZamZam Travel Website

## Public pages

| Route | Purpose | Auth |
|---|---|---|
| `/` | Homepage — brand, featured packages, CTA to browse | Public |
| `/packages` | Browse all packages (filter: domestic/international) | Public |
| `/packages/[slug]` | Package detail — description, dates, pricing, "Book Now" | Public |
| `/login` | Traveler login | Public |
| `/signup` | Traveler account creation | Public |
| `/about` | About ZamZam Travel | Public |
| `/policies/refund` | Refund/cancellation policy | Public |
| `/policies/privacy` | Privacy policy (POPIA) | Public |

## Traveler (authenticated) pages

| Route | Purpose | Auth |
|---|---|---|
| `/account` | Profile, contact details | Traveler |
| `/account/bookings` | Booking history + status | Traveler |
| `/book/[packageId]` | Booking form — date, group size, traveler details, uploads | Traveler |
| `/book/[packageId]/pay` | Redirect step to PayFast | Traveler |
| `/book/confirmation/[bookingId]` | Post-payment confirmation screen | Traveler |

## Admin pages (Irfan only)

| Route | Purpose | Auth |
|---|---|---|
| `/admin` | Dashboard — pending bookings needing review | Admin |
| `/admin/packages` | List/manage packages | Admin |
| `/admin/packages/new` | Create package | Admin |
| `/admin/packages/[id]/edit` | Edit package + its dates/capacity | Admin |
| `/admin/bookings` | All bookings, filter by status | Admin |
| `/admin/bookings/[id]` | Booking detail — confirm / cannot-fulfill (refund) | Admin |
| `/admin/customers` | Customer records | Admin |

## API routes

| Route | Purpose | Auth |
|---|---|---|
| `POST /api/bookings` | Create a booking (pre-payment) | Traveler |
| `POST /api/payfast/webhook` | PayFast ITN listener — verifies signature, updates booking | PayFast server only |
| `POST /api/bookings/[id]/confirm` | Admin confirms a pending booking | Admin |
| `POST /api/bookings/[id]/reject` | Admin marks cannot-fulfill, triggers refund | Admin |
| `GET /api/packages/[id]/availability` | Check remaining seats for a date | Public |
| `POST /api/uploads/document` | Upload passport/ID scan to private storage | Traveler |

Route naming/structure may shift slightly once we're in Next.js's actual
App Router folder conventions — this is the logical map, not the literal
file tree.
