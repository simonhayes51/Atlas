# FormSink — form backend for static sites

FormSink gives static websites a working `<form>` without any server code.
Users create a form in the dashboard, point their HTML form's `action` at the
generated endpoint (`/f/<id>`), and every submission is stored in Postgres,
emailed to them, and exportable as CSV.

**Business model:** freemium SaaS. Free plan (2 forms, 50 submissions/month) →
Pro at £9/month (unlimited forms, 2,000 submissions/month) via Stripe
subscription with self-serve cancellation through the Stripe Customer Portal.

## Stack

| Layer     | Tech                                              |
| --------- | ------------------------------------------------- |
| App       | Next.js 15 (App Router) + TypeScript + Tailwind 4 |
| Database  | Supabase (Postgres + Row Level Security)          |
| Auth      | Supabase Auth (email + password)                  |
| Payments  | Stripe Checkout + Customer Portal + one webhook   |
| Email     | Resend (plain HTTP API, optional)                 |
| Hosting   | Vercel (zero config)                              |

No cron jobs, no queues, no scrapers, no background workers. The only moving
parts are the Next.js app, Supabase, and one Stripe webhook.

## How it works

1. `POST /f/<formId>` accepts HTML form posts (urlencoded/multipart) and JSON.
2. The honeypot field `_gotcha`, if filled, silently drops the submission.
3. The owner's monthly submission count is checked against their plan.
4. The submission is stored in `submissions` (JSONB) and optionally emailed
   to the owner via Resend.
5. Browser posts get a 303 redirect to `_next` → the form's redirect URL →
   the hosted `/thanks` page. JSON posts get `{ "ok": true }`. CORS is open.

Reserved form fields: `_gotcha` (honeypot), `_next` (per-submission redirect).

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the values (see below)
npm run dev
```

### 1. Supabase setup (~5 min)

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run `supabase/migrations/001_init.sql`.
3. (Recommended) Authentication → Sign In / Up → Email → disable
   **Confirm email** for friction-free signup, or leave it on — the
   `/auth/callback` route handles confirmation links either way.
4. Copy the project URL, anon key, and service-role key into `.env.local`.

### 2. Stripe setup (~5 min)

1. Create a product "FormSink Pro" with a recurring monthly price (e.g. £9).
   Copy the price ID into `STRIPE_PRICE_ID`.
2. Add a webhook endpoint pointing at `https://<your-domain>/api/stripe/webhook`
   with events: `checkout.session.completed`,
   `customer.subscription.updated`, `customer.subscription.deleted`.
   Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
   For local testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
3. Enable the Customer Portal (Settings → Billing → Customer portal).

### 3. Resend setup (optional, ~5 min)

Verify a sending domain at [resend.com](https://resend.com), create an API
key, and set `RESEND_API_KEY` + `EMAIL_FROM`. Without these, everything works
except notification emails.

## Environment variables

| Variable                        | Required | Purpose                                        |
| ------------------------------- | -------- | ---------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | yes      | Public app URL (redirects, snippets, SEO)      |
| `NEXT_PUBLIC_SUPABASE_URL`      | yes      | Supabase project URL                           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes      | Supabase anon key (RLS-scoped)                 |
| `SUPABASE_SERVICE_ROLE_KEY`     | yes      | Server-only; submission endpoint + webhook     |
| `STRIPE_SECRET_KEY`             | yes      | Stripe API key                                 |
| `STRIPE_PRICE_ID`               | yes      | Price ID of the Pro subscription               |
| `STRIPE_WEBHOOK_SECRET`         | yes      | Webhook signature verification                 |
| `RESEND_API_KEY`                | no       | Email notifications                            |
| `EMAIL_FROM`                    | no       | Verified sender, e.g. `FormSink <n@dom.com>`   |

## Deploying to Vercel

1. Import the repo into Vercel (framework auto-detected).
2. Add all env vars above; set `NEXT_PUBLIC_SITE_URL` to the production URL.
3. Point the Stripe webhook at the production URL.

## Codebase map

```
supabase/migrations/001_init.sql   # full schema, RLS policies, signup trigger
src/middleware.ts                  # session refresh + /dashboard guard
src/lib/plans.ts                   # plan limits — change pricing here
src/lib/supabase/                  # user-scoped + service-role clients
src/lib/email.ts                   # Resend notification (plain fetch)
src/app/page.tsx                   # landing page
src/app/f/[id]/route.ts            # THE core feature: submission endpoint
src/app/dashboard/                 # forms list, form detail, billing
src/app/api/stripe/                # checkout, portal, webhook
src/app/api/forms/[id]/export/     # CSV export
```

## Notes for a buyer

- **Running costs:** Supabase free tier + Vercel free tier + Resend free tier
  cover this comfortably until well past £100 MRR. Stripe takes its normal cut.
- **Maintenance surface:** effectively zero. No third-party API can silently
  break the core flow (Resend failures are swallowed; submissions still store).
- **All limits live in `src/lib/plans.ts`** — change pricing/quotas in one file.
- **Data model is 3 tables** (`profiles`, `forms`, `submissions`) with RLS, so
  the dashboard cannot leak data across accounts even if a query is sloppy.
- Obvious upsell roadmap (not built, by design): file uploads, webhooks/Zapier,
  auto-responders, teams, custom domains, reCAPTCHA, submission search.

## SEO keywords being targeted

1. "form backend for static sites"
2. "html form to email without backend"
3. "formspree alternative"
4. "contact form for static website"
5. "form endpoint API"
