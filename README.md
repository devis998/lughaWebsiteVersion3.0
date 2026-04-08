# Lugha Website v3.0

Marketing website for Lugha translation services, built with React + TypeScript + Vite, with secure form handling via Supabase Edge Functions.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend APIs: Supabase Edge Functions (Deno)
- Database: Supabase Postgres (RLS enabled)
- Bot protection: Cloudflare Turnstile
- Email notifications: Resend

## Features

- Modern responsive landing page
- Contact form and quote request form
- Server-side form validation and sanitization
- CAPTCHA verification (Turnstile)
- Rate limiting and submission cooldown protection
- Secure backend inserts (no direct public DB writes)
- Email notifications on valid submissions

## Project Structure

- `src/components/` - UI sections and forms
- `src/lib/supabase.ts` - frontend Supabase client
- `supabase/functions/submit-contact-inquiry/` - secure contact submission API
- `supabase/functions/submit-quote-request/` - secure quote submission API
- `supabase/migrations/` - schema, RLS, and throttling migrations

## Local Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Configure frontend env

Create or update `.env` in project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_TURNSTILE_SITE_KEY=your_turnstile_site_key
```

### 3) Run the app

```bash
npm run dev
```

App usually runs at `http://localhost:5173`.

## Supabase Setup

### 1) Link project

```bash
npx supabase login
npx supabase link --project-ref <your_project_ref>
```

### 2) Set Edge Function secrets

```bash
npx supabase secrets set TURNSTILE_SECRET_KEY=<your_turnstile_secret>
npx supabase secrets set RESEND_API_KEY=<your_resend_api_key>
npx supabase secrets set RESEND_TO_EMAIL=<recipient_email>
```

Notes:
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided by Supabase runtime inside Edge Functions.
- Do not expose service role keys in frontend env.

### 3) Apply migrations

```bash
npx supabase db push
```

### 4) Deploy functions

```bash
npx supabase functions deploy submit-contact-inquiry
npx supabase functions deploy submit-quote-request
```

## Security Model

Form requests follow this backend flow:

1. Extract request metadata (IP/email normalization)
2. Enforce rate limits and cooldowns
3. Verify Cloudflare Turnstile token
4. Validate and sanitize payload fields
5. Insert validated data into DB using service role (server-side)
6. Send owner notification email via Resend

This prevents direct client abuse and bot spam by using layered controls.

## Rate Limiting and Cooldowns

Implemented in Edge Functions using DB-backed throttle keys:

- Per-IP limit: `5 requests / minute`
- Per-email limit: `1 request / minute`
- Per email+IP limit: `3 requests / 10 minutes`

## Verification Commands

```bash
npm run lint
npm run typecheck
npm run build
```

## Troubleshooting

### Resend `403` in dashboard (`POST /emails`)

If using `onboarding@resend.dev`, Resend applies testing restrictions:
- You can only send to allowed/test recipients for that workspace.
- For production, verify your own domain in Resend and use a sender on that domain.

Recommended production sender format:
- `Lugha Notifications <notifications@yourdomain.com>`

### Form submits but no email

Check:
- `RESEND_API_KEY` is set in Supabase secrets
- `RESEND_TO_EMAIL` is set correctly
- Both functions are deployed after recent changes
- Resend dashboard shows sending activity/errors

### CAPTCHA passes but request rejected

Check:
- `TURNSTILE_SECRET_KEY` (Supabase secret)
- `VITE_TURNSTILE_SITE_KEY` (frontend env)

## Production Recommendations

- Verify a custom sending domain in Resend
- Use a dedicated sender mailbox (e.g. `notifications@...`)
- Set strong CSP/security headers on hosting platform
- Monitor Edge Function errors and email delivery metrics

## Pending Production Reminder

The core secure form flow is implemented, but one production step is still pending:

- **Switch Resend from testing sender to custom domain sender**
  - Current testing sender (`onboarding@resend.dev`) has recipient restrictions and may return `403`.
  - Verify your domain in Resend (`Domains` tab).
  - Update both Edge Functions `from` address to a verified sender, e.g.:
    - `Lugha Notifications <notifications@getlugha.com>`
  - Redeploy functions:
    - `npx supabase functions deploy submit-contact-inquiry`
    - `npx supabase functions deploy submit-quote-request`
  - Keep recipient configured via `RESEND_TO_EMAIL` secret (set to `getlugha@gmail.com` for production).