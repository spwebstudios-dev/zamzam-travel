# 01 — Project Scaffold

Before starting, re-confirm you've read docs/Routes.md, docs/Architecture.md,
docs/Design.md, and docs/Tech_Stack.md — this prompt builds the skeleton
those files describe. Do not invent routes, colors, or data model choices
that aren't in those docs.

## Goal

Set up the project's structure and configuration only. No auth, no
booking logic, no database queries yet — just the shell everything else
gets built into.

## 1. Install dependencies

Install the Supabase client library:

    npm install @supabase/supabase-js

## 2. Supabase client utility

Create `src/lib/supabase.ts` — a single exported Supabase client instance,
reading the URL and anon key from environment variables
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`). This file
is the only place the client is instantiated — every other file imports
from here.

## 3. Tailwind theme — brand colors and fonts

Update the Tailwind config to extend the theme with the colors and fonts
from docs/Design.md (use the real values from design/brand/palette-notes.md
if that's been filled in, not the estimates). Name them semantically, e.g.:

    colors: {
      brand: {
        green: '...',
        gold: '...',
      }
    }

so components reference `bg-brand-green` etc., not raw hex codes scattered
through the codebase.

## 4. Route shells

Per docs/Routes.md, create the folder structure under `src/app/` for every
public and traveler route (not admin yet — that's a later step). Each page
should be a minimal placeholder — a heading naming the page and nothing
else. Goal here is the URL structure existing and navigable, not the
content.

Public routes to scaffold: `/`, `/packages`, `/packages/[slug]`, `/login`,
`/signup`, `/about`, `/policies/refund`, `/policies/privacy`.

Traveler routes to scaffold: `/account`, `/account/bookings`,
`/book/[packageId]`, `/book/[packageId]/pay`,
`/book/confirmation/[bookingId]`.

## 5. Base layout

Build the shared layout (`src/app/layout.tsx`) with:
- A header: logo (design/brand/logo-reference.jpeg for now), site name,
  basic nav placeholder
- A footer: contact info (Irfan, phone, Fordsburg address, email,
  website), links to the two policy pages, matching docs/Design.md's
  footer content

Reference design/stitch-export/homepage-mobile and homepage-desktop for
visual structure of header/footer, but rebuild as React components with
Tailwind — do not copy the static HTML directly.

## 6. Verify

- `npm run dev` runs without errors
- Every scaffolded route is reachable and shows its placeholder heading
- Confirm `.env.local` is not tracked by git (`git status` should not
  show it)

## Explicitly do not do in this step

- No Supabase Auth setup yet
- No database tables/queries yet
- No admin routes yet
- No real package data — placeholders only