# ReplyCraft — AI review response generator

ReplyCraft turns customer reviews into thoughtful, human-sounding owner
responses. Paste a review (Google, Yelp, Trustpilot, TripAdvisor — any
platform, any language), pick a tone, and get a ready-to-post reply in
seconds. Powered by Claude.

**Business model:** freemium SaaS. Free plan (10 replies/month) → Pro at
£9/month (500 replies/month) via Stripe subscription with self-serve
cancellation through the Customer Portal. Cost per reply is well under 1p,
so Pro margins are ~99%.

## Stack

| Layer     | Tech                                              |
| --------- | ------------------------------------------------- |
| App       | Next.js 15 (App Router) + TypeScript + Tailwind 4 |
| AI        | Anthropic Claude API (`@anthropic-ai/sdk`)        |
| Database  | Supabase (Postgres + Row Level Security)          |
| Auth      | Supabase Auth (email + password)                  |
| Payments  | Stripe Checkout + Customer Portal + one webhook   |
| Hosting   | Vercel (zero config)                              |

No scrapers, no review-platform APIs, no OAuth integrations. The user
pastes text in and copies text out — nothing external can break.

## How it works

1. `/app` (auth required) renders the generator. A server action validates
   input, checks the user's monthly usage against their plan, then calls
   Claude with a tightly-scoped system prompt (`src/lib/claude.ts`).
2. The prompt enforces: match the review's language, sound human, never
   invent facts/compensation, 2–5 sentences, output only the reply.
3. Each generation is stored in `generations` (usage metering + history).
4. Stripe webhook keeps `profiles.plan` in sync with the subscription.

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

### 2. Anthropic setup (~2 min)

Create an API key at [platform.claude.com](https://platform.claude.com) and
set `ANTHROPIC_API_KEY`. The model defaults to `claude-opus-5`; set
`CLAUDE_MODEL` to change it (e.g. a cheaper model) without touching code.

### 3. Stripe setup (~5 min)

1. Create a product "ReplyCraft Pro" with a recurring monthly price (e.g.
   £9). Copy the price ID into `STRIPE_PRICE_ID`.
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
| `ANTHROPIC_API_KEY`             | yes      | Claude API key                             |
| `CLAUDE_MODEL`                  | no       | Model override (default `claude-opus-5`)   |
| `STRIPE_SECRET_KEY`             | yes      | Stripe API key                             |
| `STRIPE_PRICE_ID`               | yes      | Price ID of the Pro subscription           |
| `STRIPE_WEBHOOK_SECRET`         | yes      | Webhook signature verification             |

## Deploying to Vercel

1. Import the repo into Vercel; set the root directory to this folder.
2. Add all env vars; set `NEXT_PUBLIC_SITE_URL` to the production URL.
3. Point the Stripe webhook at the production URL.

## Codebase map

```
supabase/migrations/001_init.sql  # profiles + generations, RLS, signup trigger
src/lib/plans.ts                  # plan limits & tones — change pricing here
src/lib/claude.ts                 # THE core feature: prompt + Claude call
src/app/app/actions.ts            # generate server action (auth, limits, store)
src/components/generator.tsx      # generator form + result
src/app/page.tsx                  # landing page
src/app/account/page.tsx          # billing / upgrade
src/app/api/stripe/               # checkout, portal, webhook
```

## Notes for a buyer

- **Running costs:** Supabase + Vercel free tiers, plus Claude usage. A Pro
  user maxing out 500 replies costs well under £1/month in API spend against
  £9 revenue.
- **Maintenance surface:** one prompt and one API call. No review-platform
  integrations to break. If Anthropic deprecates a model, change one env var.
- **All limits live in `src/lib/plans.ts`**; the prompt lives in
  `src/lib/claude.ts` — the two files that define the product.
- Obvious upsell roadmap (deliberately not built): Chrome extension that
  injects a "Generate reply" button on Google/Yelp review pages, saved
  business profiles (multiple locations), bulk paste, custom signature,
  team seats.

## SEO keywords being targeted

1. "AI review response generator"
2. "how to respond to negative reviews"
3. "Google review reply generator"
4. "respond to Yelp reviews"
5. "review reply examples for business owners"
