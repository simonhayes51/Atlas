# ShotGloss — beautiful screenshot & code images

ShotGloss turns plain screenshots and code snippets into polished,
share-ready images: gradient background, macOS-style window frame, shadow,
and size presets for Twitter/X, Open Graph and Instagram. The entire editor
runs **client-side in the browser** — images are never uploaded anywhere.

**Business model:** freemium SaaS. Free plan (full editor, 1280px exports,
small watermark) → Pro at £5/month (no watermark, exports up to 3840px) via
Stripe subscription with self-serve cancellation through the Customer Portal.

## Stack

| Layer     | Tech                                                    |
| --------- | ------------------------------------------------------- |
| App       | Next.js 15 (App Router) + TypeScript + Tailwind 4       |
| Rendering | `html-to-image` (DOM → PNG, fully client-side)          |
| Code mode | `highlight.js` (auto language detection, GitHub Dark)   |
| Database  | Supabase (one table: `profiles`)                        |
| Auth      | Supabase Auth (email + password)                        |
| Payments  | Stripe Checkout + Customer Portal + one webhook         |
| Hosting   | Vercel (zero config)                                    |

There is **no server-side image processing**. The server's only jobs are
auth, knowing whether a user is Pro, and syncing that flag from Stripe.
That makes the maintenance surface close to zero.

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

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the values (see below)
npm run dev
```

### 1. Supabase setup (~5 min)

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/migrations/001_init.sql` in the SQL editor.
3. (Recommended) Authentication → Sign In / Up → Email → disable
   **Confirm email**, or leave it on — `/auth/callback` handles the links.
4. Copy the project URL, anon key and service-role key into `.env.local`.

### 2. Stripe setup (~5 min)

1. Create a product "ShotGloss Pro" with a recurring monthly price (e.g. £5).
   Copy the price ID into `STRIPE_PRICE_ID`.
2. Add a webhook endpoint at `https://<your-domain>/api/stripe/webhook` with
   events `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`; copy the signing secret into
   `STRIPE_WEBHOOK_SECRET`.
   Local testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
3. Enable the Customer Portal (Settings → Billing → Customer portal).

## Environment variables

| Variable                        | Required | Purpose                                    |
| ------------------------------- | -------- | ------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`          | yes      | Public app URL (redirects, SEO)            |
| `NEXT_PUBLIC_SUPABASE_URL`      | yes      | Supabase project URL                       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes      | Supabase anon key (RLS-scoped)             |
| `SUPABASE_SERVICE_ROLE_KEY`     | yes      | Server-only; Stripe webhook plan sync      |
| `STRIPE_SECRET_KEY`             | yes      | Stripe API key                             |
| `STRIPE_PRICE_ID`               | yes      | Price ID of the Pro subscription           |
| `STRIPE_WEBHOOK_SECRET`         | yes      | Webhook signature verification             |

## Deploying to Vercel

1. Import the repo into Vercel; set the root directory to this folder.
2. Add all env vars; set `NEXT_PUBLIC_SITE_URL` to the production URL.
3. Point the Stripe webhook at the production URL.

## Codebase map

```
supabase/migrations/001_init.sql  # profiles table + RLS + signup trigger
src/lib/plans.ts                  # plan limits — change pricing here
src/components/editor.tsx         # THE product: the whole editor lives here
src/app/app/page.tsx              # server wrapper (auth → plan → props)
src/app/page.tsx                  # landing page
src/app/account/page.tsx          # billing / upgrade
src/app/api/stripe/               # checkout, portal, webhook
```

## Notes for a buyer

- **Running costs:** effectively £0 — Supabase and Vercel free tiers cover it
  far past £100 MRR because there's no storage and no server compute per use.
- **Maintenance surface:** one client component and a Stripe webhook. No
  third-party API in the render path at all.
- **Plan limits live in `src/lib/plans.ts`** — one file to change pricing.
- Obvious upsell roadmap (deliberately not built): custom background uploads,
  annotations/arrows, more code themes, saved templates, browser-extension
  capture, team seats.

## SEO keywords being targeted

1. "screenshot beautifier"
2. "make screenshots look good"
3. "code screenshot generator"
4. "carbon alternative code image"
5. "twitter screenshot background"
