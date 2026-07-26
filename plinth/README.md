# Plinth — app store screenshots that sell the tap

Plinth is a screenshot studio for indie developers: dress raw app captures in
device frames, marketing copy and on-brand backgrounds, then export every
size the App Store and Google Play require in one batch, per locale. The
editor renders entirely **client-side** via Canvas — screenshots never leave
the browser unless a signed-in user chooses to save a set.

**Business model:** freemium SaaS. Free plan (1 saved set, 3 frames, iPhone
6.9″ export only, small watermark, single locale) → Pro at £12/month
(unlimited sets/frames, every device preset, batch zip export, multi-locale
copy, AI Headline Assist) via Stripe subscription with self-serve
cancellation through the Customer Portal.

**Architecture: one deploy.** Fully self-contained — SQLite for accounts and
saved sets, built-in auth (bcrypt + signed session cookie). No external
database, no auth provider. One Railway service with a volume and it's live.

## Stack

| Layer      | Tech                                                      |
| ---------- | ---------------------------------------------------------- |
| App        | Next.js 15 (App Router) + TypeScript + Tailwind 4          |
| Rendering  | Canvas 2D (device bezels, backgrounds, type) — fully client-side |
| Batch export | JSZip (client-side) — one zip per set, per device × locale |
| AI         | Real calls to the Anthropic API (`claude-opus-5`) with the signed-in user's own key — see `src/lib/ai.ts` |
| Database   | SQLite via `better-sqlite3` (`users`, `sets` tables)        |
| Auth       | bcrypt password hashes + JWT session cookie (`jose`)        |
| Payments   | Stripe Checkout + Customer Portal + one webhook             |
| Hosting    | Railway (single service + volume)                            |

## How it works

1. `/app` is the studio (public, no signup needed). A server wrapper reads
   the user's plan (and a saved set, via `?set=<id>`) and passes limits to the
   client component.
2. The user uploads, pastes, or drags in a raw screenshot per frame, sets a
   background, type pairing and headline/subheadline copy (optionally
   drafted by Headline Assist), and previews across every device preset.
3. Export renders each frame to a `<canvas>` at the exact target device's
   pixel dimensions (`src/lib/render.ts`) and downloads a PNG, or a zip of
   every device × locale combination for a whole set.
4. Signed-in users can save a set (compact JSON + a small JPEG thumbnail —
   never the original screenshot files) and reopen it from `/history`.

The database schema is created automatically on first run (`src/lib/db.ts`).

## Local development

```bash
npm install
cp .env.example .env.local   # set AUTH_SECRET; DATABASE_PATH can be omitted locally
npm run dev
```

The SQLite file defaults to `./data/plinth.db` (gitignored). Sign up at
`/signup` — accounts work immediately, no email confirmation.

### Stripe setup (~5 min)

1. Create a product "Plinth Pro" with a recurring monthly price (e.g. £12).
   Copy the price ID into `STRIPE_PRICE_ID`.
2. Add a webhook endpoint at `https://<your-domain>/api/stripe/webhook` with
   events `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`; copy the signing secret into
   `STRIPE_WEBHOOK_SECRET`.
   Local testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
3. Enable the Customer Portal (Settings → Billing → Customer portal).

### Headline Assist (real AI, bring-your-own-key)

There is no shared Anthropic key. Each Pro user pastes their own key into
Account → Headline Assist; `src/app/api/ai/headline/route.ts` calls
`client.messages.create` with `output_config.format` (structured JSON output)
so the three headline options always parse, with retry-with-backoff on rate
limits/5xx and a clear error surfaced to the UI on auth failures or timeouts.

## Deploying to Railway (the whole deployment)

1. New Project → Deploy from GitHub repo. Set **Root Directory** to this
   folder if the repo contains multiple apps.
2. Attach a **Volume** mounted at `/data`.
3. Set the env vars below (`DATABASE_PATH=/data/plinth.db`, `AUTH_SECRET`
   from `openssl rand -hex 32`, `NEXT_PUBLIC_SITE_URL` to your Railway domain).
4. Point the Stripe webhook at the deployed URL.

## Environment variables

| Variable                | Required | Purpose                                    |
| ------------------------ | -------- | ------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`   | yes      | Public app URL (redirects, SEO)            |
| `DATABASE_PATH`          | prod     | SQLite file path (`/data/plinth.db` on Railway) |
| `AUTH_SECRET`            | yes      | Signs session cookies (`openssl rand -hex 32`) |
| `STRIPE_SECRET_KEY`      | yes      | Stripe API key                             |
| `STRIPE_PRICE_ID`        | yes      | Price ID of the Pro subscription           |
| `STRIPE_WEBHOOK_SECRET`  | yes      | Webhook signature verification             |

Anthropic API keys for Headline Assist are supplied per-user in Account
settings — there is no server-side `ANTHROPIC_API_KEY` to configure.

## Codebase map

```
src/lib/db.ts                       # SQLite users + sets tables and queries
src/lib/auth.ts                     # sessions (jose JWT cookie) + bcrypt passwords
src/lib/plans.ts                    # plan limits — change pricing here
src/lib/devices.ts                  # device export presets, backgrounds, fonts, locales
src/lib/render.ts                   # THE product: canvas rendering (device bezel, type, export)
src/lib/ai.ts                       # real Anthropic API call for Headline Assist
src/components/studio.tsx           # the editor UI wrapping render.ts
src/app/app/page.tsx                # server wrapper (auth → plan → saved set → props)
src/app/page.tsx                    # landing page
src/app/history/page.tsx            # saved sets
src/app/account/page.tsx            # billing + Headline Assist key
src/app/compare/                    # SEO comparison pages
src/app/api/stripe/                 # checkout, portal, webhook
src/app/api/sets/                   # save/list/delete sets
src/app/api/ai/headline/            # Headline Assist endpoint
```

## Notes for a buyer

- **Running costs:** one Railway service (~$5/month) + Stripe's cut. No
  storage or compute per screenshot render — that happens in visitors'
  browsers. Headline Assist costs nothing to run since users bring their own
  Anthropic key.
- **Maintenance surface:** the canvas renderer and a Stripe webhook. No
  third-party API in the core render path.
- **Plan limits live in `src/lib/plans.ts`** — one file to change pricing.
- **Not built (by design), easy to add:** password reset / email
  confirmation, custom background image uploads, saved custom colour
  palettes, team seats, a shared (metered) Anthropic key for Headline Assist.

## SEO keywords being targeted

1. "app store screenshot generator"
2. "google play screenshot generator"
3. "app store screenshot sizes"
4. "app store screenshot template"
5. "applaunchpad alternative", "shotbot alternative", "previewed alternative"
