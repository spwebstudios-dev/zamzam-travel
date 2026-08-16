# Tech Stack — ZamZam Travel Website

## Summary

| Layer | Choice | Why |
|---|---|---|
| Frontend + Backend | **Next.js** (App Router, TypeScript) | One framework for pages + API routes. Huge documentation/training coverage, so Antigravity makes fewer mistakes with it than with less common frameworks. |
| Database | **PostgreSQL via Supabase** | Relational data fits bookings/packages/travelers well. Supabase bundles auth, storage, and row-level security so we're not wiring five separate services together. |
| Auth | **Supabase Auth** | Handles password hashing, sessions, email verification out of the box. Traveler accounts and Irfan's admin login both live here, distinguished by a role field. |
| File storage | **Supabase Storage** (private bucket) | Passport/ID uploads — private by default, accessed only via short-lived signed URLs generated server-side. |
| Payments | **PayFast** | Client's choice. Integrated via redirect-to-pay + server-to-server ITN (Instant Transaction Notification) webhook — we never touch card details. |
| Styling | **Tailwind CSS** | Fast to build mobile-first, responsive, on-brand UI; works well with Next.js and with AI-agent-generated code. |
| Hosting | **Vercel** | Native Next.js support, deploys straight from GitHub, generous free tier, automatic HTTPS. |
| Notifications | **Email**: Resend or Supabase's built-in email; **WhatsApp**: WhatsApp Business API (via a provider like Twilio or Meta Cloud API — to be finalized) | Both confirmations are triggered from the same backend event (payment success). |
| Version control | **GitHub**, using git worktrees | Already the client's/your preferred workflow. |

## Why not WebStudio (for this project)

WebStudio is great for visual, content-driven sites, but this project needs
custom auth, a real relational data model, a payment webhook, and
role-based admin access — all things a hand-coded (AI-agent-assisted)
Next.js app handles more directly than a visual builder would.

## Free-tier constraints to keep in mind

- **Supabase free tier**: fine for launch scale (<10 packages, modest
  booking volume). Watch storage limits once passport/ID uploads
  accumulate — may need to revisit before heavy growth.
- **Vercel free tier**: fine for this traffic level; watch serverless
  function execution limits if the PayFast webhook or email/WhatsApp
  sending gets heavy.
- No cost commitment needed to start — upgrade only if/when usage
  demands it.

## Environments

- **Local dev**: Next.js dev server + Supabase local/dev project (or a
  shared dev Supabase project, to be decided).
- **Production**: Vercel deployment, connected to production Supabase
  project, PayFast live credentials (only switched on once tested against
  PayFast sandbox).

## Testing approach

- Each feature tested manually after building (per your stated workflow),
  before merging via git worktrees.
- PayFast integration tested against PayFast's **sandbox/test mode**
  before any live credentials are used.
