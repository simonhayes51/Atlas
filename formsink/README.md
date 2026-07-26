# FormSink — form backend for static sites

FormSink gives static websites a working `<form>` without any server code.
Users create a form in the dashboard, point their HTML form's `action` at the
generated endpoint (`/f/<id>`), and every submission is stored, emailed to
them, and exportable as CSV.

**Business model:** freemium SaaS. Free plan (2 forms, 50 submissions/month) →
Pro at £9/month (unlimited forms, 2,000 submissions/month) via Stripe
subscription with self-serve cancellation through the Stripe Customer Portal.

**Architecture: one deploy.** The app is fully self-contained — SQLite for
data, built-in auth (bcrypt + signed session cookie). No external database,
no auth provider. Deploy it as a single Railway service with a volume and
you're live.

## Stack

| Layer     | Tech                                              |
| --------- | ------------------------------------------------- |
| App       | Next.js 15 (App Router) + TypeScript + Tailwind 4 |
| Database  | SQLite via `better-sqlite3` (single file on disk) |
| Auth      | bcrypt password hashes + JWT session cookie (`jose`) |
| Payments  | Stripe Checkout + Customer Portal + one webhook   |
| Email     | Resend (plain HTTP API, optional)                 |
| Hosting   | Railway (single service + volume)                 |

No cron jobs, no queues, no scrapers, no background workers, no second
service. The only moving parts are this app, Stripe, and (optionally) Resend.

## How it works

1. `POST /f/<formId>` accepts HTML form posts (urlencoded/multipart) and JSON.
2. The honeypot field `_gotcha`, if filled, silently drops the submission.
3. The owner's monthly submission count is checked against their plan.
4. The submission is stored in SQLite (JSON column) and optionally emailed
   to the owner via Resend.
5. Browser posts get a 303 redirect to `_next` → the form's redirect URL →
   the hosted `/thanks` page. JSON posts get `{ "ok": true }`. CORS is open.

Reserved form fields: `_gotcha` (honeypot), `_next` (per-submission redirect).

The database schema is created automatically on first run
(`src/lib/db.ts`) — there is no migration step.

## Local development

```bash
npm install
cp .env.example .env.local   # set AUTH_SECRET; DATABASE_PATH can be omitted locally
npm run dev
```

The SQLite file defaults to `./data/formsink.db` (gitignored). Sign up at
`/signup` — accounts work immediately, no email confirmation.

### Stripe setup (~5 min)

1. Create a product "FormSink Pro" with a recurring monthly price (e.g. £9).
   Copy the price ID into `STRIPE_PRICE_ID`.
2. Add a webhook endpoint pointing at `https://<your-domain>/api/stripe/webhook`
   with events: `checkout.session.completed`,
   `customer.subscription.updated`, `customer.subscription.deleted`.
   Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
   For local testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
3. Enable the Customer Portal (Settings → Billing → Customer portal).

### Resend setup (optional, ~5 min)

Verify a sending domain at [resend.com](https://resend.com), create an API
key, and set `RESEND_API_KEY` + `EMAIL_FROM`. Without these, everything works
except notification emails.

## Deploying to Railway (the whole deployment)

1. New Project → Deploy from GitHub repo. Set **Root Directory** to this
   folder if the repo contains multiple apps.
2. Attach a **Volume** to the service, mounted at `/data`.
3. Set the environment variables below (`DATABASE_PATH=/data/formsink.db`,
   `AUTH_SECRET` from `openssl rand -hex 32`, `NEXT_PUBLIC_SITE_URL` to your
   Railway domain).
4. Point the Stripe webhook at the deployed URL.

That's it — one service, one volume. Backups = Railway volume snapshots (or
just download the single `.db` file).

## Environment variables

| Variable                | Required | Purpose                                        |
| ----------------------- | -------- | ---------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`  | yes      | Public app URL (redirects, snippets, SEO)      |
| `DATABASE_PATH`         | prod     | SQLite file path (`/data/formsink.db` on Railway; defaults to `./data/formsink.db` locally) |
| `AUTH_SECRET`           | yes      | Signs session cookies (`openssl rand -hex 32`) |
| `STRIPE_SECRET_KEY`     | yes      | Stripe API key                                 |
| `STRIPE_PRICE_ID`       | yes      | Price ID of the Pro subscription               |
| `STRIPE_WEBHOOK_SECRET` | yes      | Webhook signature verification                 |
| `RESEND_API_KEY`        | no       | Email notifications                            |
| `EMAIL_FROM`            | no       | Verified sender, e.g. `FormSink <n@dom.com>`   |

## Codebase map

```
src/lib/db.ts                      # SQLite schema + all queries — the data layer
src/lib/auth.ts                    # sessions (jose JWT cookie) + bcrypt passwords
src/middleware.ts                  # /dashboard guard (cookie signature check)
src/lib/plans.ts                   # plan limits — change pricing here
src/lib/email.ts                   # Resend notification (plain fetch)
src/app/page.tsx                   # landing page
src/app/f/[id]/route.ts            # THE core feature: submission endpoint
src/app/dashboard/                 # forms list, form detail, billing
src/app/api/stripe/                # checkout, portal, webhook
src/app/api/forms/[id]/export/     # CSV export
```

## Notes for a buyer

- **Running costs:** one Railway service (~$5/month) + Stripe's cut. Nothing
  else. No Supabase/Neon/PlanetScale account to inherit.
- **Maintenance surface:** effectively zero. No third-party API can silently
  break the core flow (Resend failures are swallowed; submissions still store).
- **All limits live in `src/lib/plans.ts`** — change pricing/quotas in one file.
- **Data model is 3 tables** (`users`, `forms`, `submissions`), all defined in
  `src/lib/db.ts`; every query filters by the session user's ID.
- **Not built (by design), easy to add:** password reset / email confirmation
  (wire Resend into `auth/actions.ts`), file uploads, webhooks/Zapier,
  auto-responders, teams, custom domains, reCAPTCHA, submission search.

## SEO keywords being targeted

1. "form backend for static sites"
2. "html form to email without backend"
3. "formspree alternative"
4. "contact form for static website"
5. "form endpoint API"
