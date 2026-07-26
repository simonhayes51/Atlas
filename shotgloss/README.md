# ShotGloss — beautiful screenshot & code images

ShotGloss turns plain screenshots and code snippets into polished,
share-ready images: gradient background, macOS-style window frame, shadow,
and size presets for Twitter/X, Open Graph and Instagram. The entire editor
runs **client-side in the browser** — images are never uploaded anywhere.

**Business model:** freemium SaaS. Free plan (full editor, 1280px exports,
small watermark) → Pro at £5/month (no watermark, exports up to 3840px) via
Stripe subscription with self-serve cancellation through the Customer Portal.

**Architecture: one deploy.** Fully self-contained — SQLite for accounts,
built-in auth (bcrypt + signed session cookie). No external database, no
auth provider. One Railway service with a volume and you're live.

## Stack

| Layer     | Tech                                                    |
| --------- | ------------------------------------------------------- |
| App       | Next.js 15 (App Router) + TypeScript + Tailwind 4       |
| Rendering | `html-to-image` (DOM → PNG, fully client-side)          |
| Code mode | `highlight.js` (auto language detection, GitHub Dark)   |
| Database  | SQLite via `better-sqlite3` (one table: `users`)        |
| Auth      | bcrypt password hashes + JWT session cookie (`jose`)    |
| Payments  | Stripe Checkout + Customer Portal + one webhook         |
| Hosting   | Railway (single service + volume)                       |

There is **no server-side image processing**. The server's only jobs are
auth, knowing whether a user is Pro, and syncing that flag from Stripe.

## How it works

1. `/app` is the editor (public, no signup needed). A server wrapper reads
   the user's plan and passes `isPro` / `maxExportScale` / `watermark` to
   the client component.
2. The user pastes (Ctrl+V), drops, or uploads a screenshot — or switches to
   code mode and pastes a snippet, which is syntax-highlighted automatically.
3. The styled DOM node is rendered to PNG locally with `html-to-image`
   (`pixelRatio` controls export resolution) and downloaded or copied to
   the clipboard.
4. Free users get a small corner watermark and 1280px exports; Pro unlocks
   2560px/3840px and removes the watermark.

The database schema is created automatically on first run (`src/lib/db.ts`).

## Local development

```bash
npm install
cp .env.example .env.local   # set AUTH_SECRET; DATABASE_PATH can be omitted locally
npm run dev
```

The SQLite file defaults to `./data/shotgloss.db` (gitignored). Sign up at
`/signup` — accounts work immediately, no email confirmation.

### Stripe setup (~5 min)

1. Create a product "ShotGloss Pro" with a recurring monthly price (e.g. £5).
   Copy the price ID into `STRIPE_PRICE_ID`.
2. Add a webhook endpoint at `https://<your-domain>/api/stripe/webhook` with
   events `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`; copy the signing secret into
   `STRIPE_WEBHOOK_SECRET`.
   Local testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
3. Enable the Customer Portal (Settings → Billing → Customer portal).

## Deploying to Railway (the whole deployment)

1. New Project → Deploy from GitHub repo. Set **Root Directory** to this
   folder if the repo contains multiple apps.
2. Attach a **Volume** mounted at `/data`.
3. Set the env vars below (`DATABASE_PATH=/data/shotgloss.db`, `AUTH_SECRET`
   from `openssl rand -hex 32`, `NEXT_PUBLIC_SITE_URL` to your Railway domain).
4. Point the Stripe webhook at the deployed URL.

## Environment variables

| Variable                | Required | Purpose                                    |
| ----------------------- | -------- | ------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`  | yes      | Public app URL (redirects, SEO)            |
| `DATABASE_PATH`         | prod     | SQLite file path (`/data/shotgloss.db` on Railway) |
| `AUTH_SECRET`           | yes      | Signs session cookies (`openssl rand -hex 32`) |
| `STRIPE_SECRET_KEY`     | yes      | Stripe API key                             |
| `STRIPE_PRICE_ID`       | yes      | Price ID of the Pro subscription           |
| `STRIPE_WEBHOOK_SECRET` | yes      | Webhook signature verification             |

## Codebase map

```
src/lib/db.ts                     # SQLite users table + queries
src/lib/auth.ts                   # sessions (jose JWT cookie) + bcrypt passwords
src/lib/plans.ts                  # plan limits — change pricing here
src/components/editor.tsx         # THE product: the whole editor lives here
src/app/app/page.tsx              # server wrapper (auth → plan → props)
src/app/page.tsx                  # landing page
src/app/account/page.tsx          # billing / upgrade
src/app/api/stripe/               # checkout, portal, webhook
```

## Notes for a buyer

- **Running costs:** one Railway service (~$5/month) + Stripe's cut. No
  storage or compute per use — rendering happens in visitors' browsers.
- **Maintenance surface:** one client component and a Stripe webhook. No
  third-party API in the render path at all.
- **Plan limits live in `src/lib/plans.ts`** — one file to change pricing.
- **Not built (by design), easy to add:** password reset / email confirmation,
  custom background uploads, annotations/arrows, more code themes, saved
  templates, browser-extension capture, team seats.

## SEO keywords being targeted

1. "screenshot beautifier"
2. "make screenshots look good"
3. "code screenshot generator"
4. "carbon alternative code image"
5. "twitter screenshot background"
