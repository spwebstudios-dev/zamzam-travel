# Agents.md — Instructions for AI Coding Agents (Antigravity)

This file tells any AI coding agent working in this repo how to behave.
Read `PRD.md`, `Tech_Stack.md`, `Architecture.md`, `Routes.md`, and
`Design.md` before making changes — this file is the *rules*, those are
the *spec*.

## Project context

ZamZam Travel booking website. Next.js + Supabase + PayFast + Vercel.
Solo-maintained by a non-full-time developer (Shahid) — code must stay
readable and well-commented, not just functional.

## Ground rules

1. **Never commit secrets.** PayFast credentials, Supabase service-role
   keys, and any API keys go in `.env.local` (gitignored), never in
   source files or committed history.
2. **Never touch payment logic without flagging it clearly.** Any change
   to the PayFast webhook handler, ITN signature verification, or
   payment status transitions must be called out explicitly — this is
   the highest-risk part of the app.
3. **Respect row-level security.** Don't bypass Supabase RLS with the
   service-role key from client-facing code paths. Service-role key use
   is restricted to trusted server-side operations (e.g. the webhook).
4. **One feature per change.** Build and verify one vertical slice
   (e.g. "package browsing," "booking form," "admin confirm flow") at a
   time — don't sprawl across unrelated features in one pass.
5. **Comment business logic heavily**, especially: price calculation,
   capacity checks, refund logic, booking status transitions. A future
   reader without React fluency should be able to follow *why*, not
   just *what*.
6. **Mobile-first CSS.** Base styles target small screens; use
   breakpoints to expand up, not the reverse.
7. **Follow `Design.md`** for colors, type, and layout tone — don't
   default to generic template styling.
8. **Match `Routes.md`** for page/route structure — if a route needs to
   change, update `Routes.md` in the same change, not after.
9. **Update `Progress.md`** after completing a feature — short entry:
   what was built, what's next.

## Workflow

- Git + GitHub, using **git worktrees** for parallel feature branches.
- Test each feature manually after building, before merging.
- PayFast: always test against **sandbox/test mode** first; live
  credentials only after a successful sandbox run-through.

## What NOT to do

- Don't introduce a new database/hosting service outside the stack in
  `Tech_Stack.md` without discussing it first.
- Don't store card details, ever, anywhere.
- Don't make passport/ID storage public, even temporarily "to test."
- Don't skip the PayFast ITN signature check "to save time."
