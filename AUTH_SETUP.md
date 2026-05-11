# Auth + Invite Codes — Setup Guide

This guide walks you through turning on **closed-beta registration with invite codes** for The Owl's Postoffice. Everything is wired in the codebase already; you just need to apply a SQL migration, deploy one Edge Function, and paste two env vars.

> **Once-only checklist** (≈ 15 minutes if you already have a Supabase project)

---

## 0. Prerequisites

- A Supabase project (free tier is fine). Note its **Project URL** and **anon public key** from Project Settings → API.
- The Supabase CLI (`brew install supabase/tap/supabase`) — only needed for deploying the Edge Function. The SQL migration can also be run by pasting into the SQL editor.

---

## 1. Apply the database migration

The migration file lives at:

```10:14:supabase/migrations/20260511120000_create_auth_and_invites.sql
  1. New tables
    - `profiles`            — 1:1 with `auth.users`, app-level fields
    - `invite_codes`        — invite codes (admin-issued or user-generated, ≤ 3 per user)
    - `invite_redemptions`  — audit trail; each user can redeem exactly one code
```

Run it one of two ways:

**Option A — Supabase CLI**

```bash
supabase link --project-ref YOUR-PROJECT-REF
supabase db push
```

**Option B — SQL editor**

Copy the contents of `supabase/migrations/20260511120000_create_auth_and_invites.sql` and paste it into Supabase → SQL editor → Run.

---

## 2. Seed the first invite code (bootstrap)

Without at least one code, nobody can sign up. In the SQL editor:

```sql
insert into invite_codes (code, created_by, max_uses)
values ('BOOTSTRAP', null, 50);
```

- `created_by = null` marks it as admin-issued (not counted against any user's 3-per-user quota).
- `max_uses` lets multiple early testers redeem the same code; lower it as you like.

Hand `BOOTSTRAP` to the first round of testers. From then on, registered users can generate their own codes (3 each) from **Settings → Invites**.

---

## 3. Configure the Edge Function

The closed-beta signup runs inside a Supabase Edge Function so the invite check happens with the service role (which the browser must never see).

```bash
supabase functions deploy signup-with-invite --no-verify-jwt
```

> `--no-verify-jwt` is correct here: unauthenticated users are calling this *to* register.

The function reads two secrets that already exist for the `gemini-proxy` function — verify they're set:

```bash
supabase secrets set SUPABASE_URL="https://YOUR-PROJECT-REF.supabase.co"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="YOUR-SERVICE-ROLE-KEY"
```

---

## 4. Configure auth providers + redirect URLs

In Supabase → Authentication:

1. **Providers → Email** — make sure "Enable Email provider" is on.
2. **URL Configuration** — add your dev URL (`http://localhost:3000`) and any production URL to **Site URL** and **Redirect URLs**. Magic-link emails will only work for whitelisted origins.
3. **Email templates** (optional) — customize the "Confirm signup", "Magic link", and "Invite user" templates if you want them on-brand. Defaults are fine for closed beta.
4. **SMTP** — Supabase ships a built-in mailer (low volume). For production, plug in SendGrid/Postmark/Resend via Authentication → SMTP Settings.

---

## 5. Wire the frontend env vars

Copy `.env.example` to `.env.local` and fill in:

```bash
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-PUBLIC-ANON-KEY
```

Then:

```bash
npm install
npm run dev
```

If the env vars are missing the app still runs (in preview mode) but auth/invite flows are disabled with a banner.

---

## 6. How users experience it

| Flow                       | Where                       | Notes                                                                   |
|----------------------------|-----------------------------|--------------------------------------------------------------------------|
| Sign in (existing user)    | Top-right menu → Login      | Password **or** magic link. Magic link emails the user a one-tap login. |
| Sign up (new user)         | Top-right menu → Login → Sign up tab | Requires invite code. Server validates before creating account. |
| Email confirmation         | Inbox                       | Password signups must click the confirmation link before they can sign in. |
| Generate your own invites  | Settings → Invites          | Up to 3 per user. Quota enforced by DB trigger. Copy → share.            |
| See who used your code     | Settings → Invites          | Each row shows `n redeemed`.                                             |
| Sign out                   | Top-right menu → Sign out   |                                                                          |

---

## 7. What about the dev console warning?

If you see `Supabase env vars missing — auth and invite-code flows are disabled.`, it just means `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` aren't set. The app falls back to preview mode (anonymous device-id only). Fix by completing step 5.

---

## 8. Production checklist

- [ ] Migration applied (`profiles`, `invite_codes`, `invite_redemptions` exist with RLS on).
- [ ] `signup-with-invite` Edge Function deployed.
- [ ] Bootstrap invite code inserted.
- [ ] Production URL added to Auth → URL Configuration.
- [ ] Custom SMTP configured (replace Supabase's low-volume default).
- [ ] `.env.local` (or your hosting provider's env tab) has both VITE_ vars.
- [ ] Smoke test: sign up with the bootstrap code on a clean browser profile.
