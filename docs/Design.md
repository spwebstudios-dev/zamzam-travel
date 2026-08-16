# Design — ZamZam Travel Website

Brand reference: `logo-reference.jpeg` (in this folder).

## Brand identity

- **Name:** Zam Zam Travel
- **Tagline:** "Your Journey, Our Priority"
- **Direction:** Luxury / premium — elegant, understated. Not loud, not
  playful. Think a boutique travel agency, not a budget booking app.
- **Logo motif:** globe with a plane taking off, wrapped in a gold
  ribbon/wing shape — conveys international travel + premium service.

## Color palette (approximate — pull exact hex from the logo asset
when building)

| Role | Color | Approx hex |
|---|---|---|
| Primary (deep, trustworthy) | Forest green | `#123524` – `#1B4D3E` |
| Accent (premium, warm) | Gold / bronze | `#B8860B` – `#C9A227` |
| Background | Off-white / white | `#FFFFFF` / `#FAF9F6` |
| Text (primary) | Near-black | `#1A1A1A` |
| Text (muted) | Warm gray | `#6B6B63` |

Use green as the dominant structural color (headers, buttons, nav),
gold as an accent for highlights, dividers, and premium details (prices,
"Book Now" emphasis) — not as a dominant fill color, to avoid it reading
as gaudy rather than premium.

## Typography

- **Headings / wordmark feel:** a serif with weight and presence
  (the logo's "Zam Zam" is a bold serif) — for page titles and the
  hero. Something like Playfair Display or a similar elegant serif.
- **Body / UI text:** a clean, legible sans-serif for forms, booking
  flow, and admin panel — readability matters more than character here
  (e.g. Inter, or similar).
- **Tagline-style accents:** the logo's "TRAVEL" wordmark uses wide
  letter-spacing in gold — this letter-spaced-caps treatment works well
  for section labels ("OUR PACKAGES", "WHY ZAM ZAM") but should stay
  rare/special, not used everywhere.

## Layout principles

- **Mobile-first.** Design and build for phone screens first; expand up.
  Booking is likely to happen on a phone, often via a WhatsApp-shared
  link.
- **Generous whitespace.** Premium brands breathe — avoid cramming.
- **Large, high-quality package imagery** — destinations should feel
  aspirational, not like stock-photo clutter.
- **Gold used sparingly**: dividers, icon accents, price emphasis, not
  large color blocks.
- **Trust signals near booking/payment**: PayFast badge, "secure
  payment" messaging, airline partner logos (as shown in the brand
  asset — Saudia, Emirates, Qatar Airways, Turkish Airlines, Etihad,
  IATA) reinforce legitimacy at the point of highest hesitation
  (entering passport details, paying).

## Components needing explicit design attention

- Package card (browse grid) — image, destination, from-price, badge
  for domestic/international
- Package detail page — gallery, description, date picker, group-size
  selector, live price calculation
- Booking form — multi-traveler input (needs to feel manageable for
  groups, not a wall of repeated fields)
- Booking status states — pending / confirmed / cancelled, visually
  distinct but calm (avoid alarming reds for "pending")
- Admin dashboard — dense but scannable, since Irfan will use this daily

## Contact/footer details (from brand asset)

- Irfan — 072 199 9999
- Fordsburg, Johannesburg, 2092
- info@zamzamtravel.co.za
- www.zamzamtravel.co.za
