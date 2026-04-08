# Secure Forms Implementation Plan

## Goal
Implement production-grade secure form submission for the Lugha website so that every valid submission triggers an owner email to `getlugha@gmail.com` without requiring manual database checks.

## Scope
- Frontend: `src/components/Contact.tsx`, `src/components/Comparisons.tsx`
- Backend: `supabase/functions/submit-contact-inquiry/index.ts`, `supabase/functions/submit-quote-request/index.ts`
- DB/RLS: new migration under `supabase/migrations`
- Cleanup: remove `src/lib/notify.ts` usage and file

## Implementation Steps

### 1) Lock down database writes (RLS hardening)
1. Create a migration that removes public insert policies from:
   - `contact_inquiries`
   - `quote_requests`
2. Keep RLS enabled and deny direct `anon` inserts.
3. Validate by attempting direct client insert and confirming rejection.

### 2) Add CAPTCHA to frontend forms
1. Install `@marsidev/react-turnstile`.
2. Add Turnstile widget to both form UIs.
3. Prevent submit until token is present.
4. Send Turnstile token with payload to Edge Functions.

### 3) Move all writes to Edge Functions only
1. Update frontend form submit handlers to call:
   - `submit-contact-inquiry`
   - `submit-quote-request`
   via `supabase.functions.invoke(...)`.
2. Remove direct `.from(...).insert(...)` calls from the browser.

### 4) Add layered abuse protection in Edge Functions
Order of checks (must be enforced in this sequence):
1. Extract request metadata (IP, user-agent, normalized email).
2. Rate limit by IP (target: max 5 requests per minute).
3. Cooldown by email (target: 1 request per 60 seconds per email).
4. Verify Turnstile token with Cloudflare `siteverify`.
5. Run strict payload schema validation and sanitization.
6. Insert into DB using service role client.
7. Send notification email.

If any check fails, stop processing immediately and return sanitized error response.

### 5) Strict server-side input validation and sanitization
1. Add typed validation schema for each endpoint.
2. Enforce max lengths and allowlists:
   - Name, email, phone, message, subject/category, language fields.
3. Normalize and trim text values.
4. Reject suspicious content:
   - script tags
   - inline event handlers
   - javascript URIs
   - malformed payload structures
5. Return `400` for invalid input with safe, non-sensitive error messages.

### 6) Secure service role usage
1. Use `SUPABASE_SERVICE_ROLE_KEY` only in Edge Functions.
2. Never expose secrets to frontend env.
3. Never log secrets or include them in responses.
4. Keep responses minimal (`success`, message/request id).

### 7) Send owner email notification (Resend)
1. Keep email logic inside Edge Functions (server-side only).
2. Send notification to (once a user submmits a form then send those details to this email using resend):
   - `getlugha@gmail.com`
3. Set `reply_to` as the submitter's email.
4. Trigger send only after successful DB insert.
5. If email fails, keep DB insert and log failure as non-critical.

### 8) Remove insecure/legacy client email path
1. Delete `src/lib/notify.ts`.
2. Remove all imports/usages from frontend components.
3. Confirm no client-side email API calls remain.

### 9) Environment and secrets setup

#### Supabase Edge Function secrets
- `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_URL`

#### Frontend `.env`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_TURNSTILE_SITE_KEY`

## Verification Plan

### Functional checks
1. Submit each form with valid CAPTCHA:
   - DB row inserted.
   - Email received at `getlugha@gmail.com`.
2. Confirm `reply_to` points to submitter email.

### Security checks
1. Direct client insert attempt should fail due to RLS.
2. Invalid or missing CAPTCHA should fail.
3. Rapid burst from same IP should hit `429`.
4. Repeated submissions from same email inside cooldown should hit `429`.
5. Malformed and suspicious payloads should return `400`.

### Build and quality checks
1. Run `npm run lint`
2. Run `npm run typecheck`
3. Run `npm run build`

## Deliverables
- Migration removing public insert policies
- Updated secure frontend form submission flow
- Hardened Edge Functions with layered defenses
- Resend email notifications to `getlugha@gmail.com`
- Removal of legacy client-side notify module
