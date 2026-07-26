import Link from "next/link";
import { PLANS } from "@/lib/plans";

// ⚠️ PLACEHOLDER TESTIMONIALS — replace with real quotes before launch.
// Publishing invented endorsements as if they were real is misleading.
const TESTIMONIALS = [
  {
    quote:
      "Replace this with a real quote from an early customer — ideally about how much time they used to spend replying to reviews.",
    name: "Your first customer",
    role: "Independent restaurant",
  },
  {
    quote:
      "Replace this with a real quote. Specific numbers (reviews per week, minutes saved) convert far better than general praise.",
    name: "Your second customer",
    role: "Dental practice",
  },
  {
    quote:
      "Replace this with a real quote. Ask permission to use their name, business, and photo.",
    name: "Your third customer",
    role: "Hotel manager",
  },
];

const PLATFORMS = ["Google", "Yelp", "Trustpilot", "TripAdvisor", "Facebook"];

const FAQS = [
  {
    q: "Will the replies sound like AI wrote them?",
    a: "No corporate boilerplate, no “We value your feedback.” Replies are short, specific to what the reviewer actually said, and written like a real owner typed them.",
  },
  {
    q: "Does it work for negative reviews?",
    a: "That's where it shines. Replies acknowledge the specific complaint, never argue, and offer to make things right — without inventing compensation you didn't approve.",
  },
  {
    q: "Which review platforms are supported?",
    a: "All of them, because you simply paste the review text. Google, Yelp, Trustpilot, TripAdvisor, Facebook, App Store — anything.",
  },
  {
    q: "Do replies work in other languages?",
    a: "Yes. The reply automatically matches the language the review was written in.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-900/5 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <LogoMark />
            ReplyCraft
          </span>
          <nav className="flex items-center gap-1 sm:gap-2">
            <a
              href="#how"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 sm:block"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 sm:block"
            >
              Pricing
            </a>
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-slate-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            >
              Try it free
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px]"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% -5%, rgb(124 58 237 / 0.10) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-16 text-center sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
            <span className="flex" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-3 w-3 text-amber-400" />
              ))}
            </span>
            Replies for every review, good or bad
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Answer every customer review
            <br />
            in seconds, not Sunday evenings.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            Paste a review — glowing or brutal — and ReplyCraft writes a
            thoughtful, human response in your business&apos;s voice. Works for
            Google, Yelp, Trustpilot and TripAdvisor, in any language.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="w-full rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all duration-200 hover:bg-violet-700 hover:shadow-xl hover:shadow-violet-600/30 motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 sm:w-auto"
            >
              Get 10 free replies a month
            </Link>
            <a
              href="#pricing"
              className="w-full rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 sm:w-auto"
            >
              View pricing
            </a>
          </div>

          {/* Example: review → reply */}
          <div className="mx-auto mt-16 grid max-w-3xl gap-4 text-left sm:grid-cols-2 sm:gap-5">
            {/* The review */}
            <figure className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-500"
                >
                  D
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    Dana R.
                  </p>
                  <div className="flex items-center gap-1" aria-label="1 out of 5 stars">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i === 0 ? "text-amber-400" : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                The review ★☆☆☆☆
              </p>
              <blockquote className="mb-4 mt-2 text-sm leading-6 text-slate-700">
                “Waited 40 minutes for food that arrived cold. Server was
                apologetic but honestly a really disappointing anniversary
                dinner.”
              </blockquote>
              <p className="mt-auto flex items-center gap-1.5 border-t border-slate-200/70 pt-3 text-[11px] text-slate-400">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5"
                  fill="none"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <path
                    d="M8 5.5v2.8l1.8 1.1"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
                Posted 2 days ago · still unanswered
              </p>
            </figure>

            {/* The reply */}
            <figure className="relative rounded-2xl border-2 border-violet-600 bg-white p-5 shadow-xl shadow-violet-600/10">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white shadow-sm"
                >
                  <LogoGlyph />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    Owner response
                  </p>
                  <p className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Ready to post
                  </p>
                </div>
              </div>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-violet-600">
                Your reply, 5 seconds later
              </p>
              <blockquote className="mt-2 text-sm leading-6 text-slate-800">
                “I&rsquo;m so sorry we let you down on your anniversary — that&rsquo;s
                exactly the night we should have been at our best. Cold food
                after a 40-minute wait isn&rsquo;t our standard. I&rsquo;d love the chance
                to make it right; please email me directly and dinner&rsquo;s on us.”
              </blockquote>
              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
                {["Acknowledges the issue", "No excuses", "Offers a fix"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700"
                    >
                      ✓ {tag}
                    </span>
                  )
                )}
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* Platform bar */}
      <section aria-labelledby="platforms" className="border-y border-slate-900/5 bg-slate-50/70 py-8">
        <div className="mx-auto max-w-6xl px-6">
          <h2
            id="platforms"
            className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-400"
          >
            Paste a review from anywhere
          </h2>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-slate-500 sm:gap-x-12">
            {PLATFORMS.map((p) => (
              <li key={p} className="transition-colors hover:text-slate-800">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-20 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-600">
            How it works
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Three steps between a bad review and a good reply.
          </h2>

          <ol className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Paste the review",
                body: "Copy it from Google, Yelp, or wherever it landed. Any language, any length.",
              },
              {
                step: "02",
                title: "Pick a tone",
                body: "Professional, friendly or apologetic — plus any context only you know.",
              },
              {
                step: "03",
                title: "Copy and post",
                body: "A reply that reads like you wrote it, ready to paste straight back.",
              },
            ].map((s) => (
              <li
                key={s.step}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-violet-300 hover:shadow-md"
              >
                <span className="font-mono text-xs font-semibold text-violet-600">
                  {s.step}
                </span>
                <h3 className="mt-3 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-slate-900/5 bg-slate-50/70 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-600">
            Why it works
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Written for the reviews you dread.
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Handles the hard ones",
                body: "Angry one-star reviews get calm, gracious replies that acknowledge the problem without arguing — the kind that make future customers trust you more.",
                icon: <IconShield />,
              },
              {
                title: "Any platform, any language",
                body: "It's just text — paste from Google, Yelp, Trustpilot, TripAdvisor, Facebook or anywhere else. Replies come back in the reviewer's language.",
                icon: <IconGlobe />,
              },
              {
                title: "Your voice, your facts",
                body: "Set the tone, add context (“we were short-staffed”, “offer a free coffee”), and it never invents policies or compensation you didn't approve.",
                icon: <IconSliders />,
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-lg motion-safe:hover:-translate-y-0.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white transition-colors group-hover:bg-violet-600">
                  {f.icon}
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-600">
            Testimonials
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            For owners who&apos;d rather be running the business.
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-6 text-slate-700">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-semibold text-white shadow-sm"
                  >
                    {t.name.slice(0, 1)}
                  </span>
                  <span className="text-sm">
                    <span className="block font-semibold text-slate-900">
                      {t.name}
                    </span>
                    <span className="block text-slate-500">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-20 border-t border-slate-900/5 bg-slate-50/70 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-600">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Simple pricing
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
            {/* Free */}
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow duration-200 hover:shadow-md">
              <h3 className="font-semibold text-slate-900">Free</h3>
              <p className="mt-2 text-4xl font-bold tabular-nums tracking-tight text-slate-900">
                {PLANS.free.priceLabel}
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-600">
                <Check>{PLANS.free.repliesPerMonth} replies / month</Check>
                <Check>All three tones</Check>
                <Check>Any language</Check>
                <Check>Reply history</Check>
              </ul>
              <Link
                href="/signup"
                className="mt-8 block rounded-xl border border-slate-300 py-3 text-center text-sm font-semibold text-slate-800 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
              >
                Start free
              </Link>
            </div>

            {/* Pro */}
            <div className="relative flex flex-col rounded-2xl border-2 border-violet-600 bg-white p-8 shadow-xl shadow-violet-600/10">
              <span className="absolute -top-3 right-8 rounded-full bg-violet-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
                Most popular
              </span>
              <h3 className="font-semibold text-slate-900">Pro</h3>
              <p className="mt-2 text-4xl font-bold tabular-nums tracking-tight text-slate-900">
                {PLANS.pro.priceLabel}
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-600">
                <Check>{PLANS.pro.repliesPerMonth} replies / month</Check>
                <Check>Everything in Free</Check>
                <Check>Enough for multiple locations</Check>
                <Check>Cancel any time</Check>
              </ul>
              <Link
                href="/signup"
                className="mt-8 block rounded-xl bg-violet-600 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all duration-200 hover:bg-violet-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
              >
                Get Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200">
            {FAQS.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900 transition-colors hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-4">
                  {item.q}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-45"
                  >
                    <path
                      d="M8 3.5v9M3.5 8h9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-16 text-center shadow-2xl shadow-slate-900/20 sm:px-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 60% 80% at 50% 0%, rgb(139 92 246 / 0.35) 0%, transparent 70%)",
              }}
            />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Clear your review backlog tonight.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-300">
                Ten free replies a month, no card required. Paste your worst
                review and see what comes back.
              </p>
              <Link
                href="/signup"
                className="mt-8 inline-block rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition-all duration-200 hover:bg-slate-100 motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                Get 10 free replies a month
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900/5">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="flex items-center gap-2 font-bold tracking-tight text-slate-900">
                <LogoMark />
                ReplyCraft
              </span>
              <p className="mt-2 max-w-xs text-sm text-slate-500">
                AI review responses for busy business owners.
              </p>
            </div>
            <nav className="flex gap-12 text-sm" aria-label="Footer">
              <div>
                <h3 className="font-semibold text-slate-900">Product</h3>
                <ul className="mt-3 space-y-2 text-slate-500">
                  <li>
                    <a href="#how" className="transition-colors hover:text-slate-900">
                      How it works
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="transition-colors hover:text-slate-900">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Account</h3>
                <ul className="mt-3 space-y-2 text-slate-500">
                  <li>
                    <Link href="/login" className="transition-colors hover:text-slate-900">
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup" className="transition-colors hover:text-slate-900">
                      Sign up
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          <p className="mt-10 border-t border-slate-100 pt-6 text-sm text-slate-500">
            © {new Date().getFullYear()} ReplyCraft · AI review response
            generator
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ---------------------------------------------------------------- helpers */

function LogoGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M2.5 4.5A2 2 0 0 1 4.5 2.5h7a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H7l-3.5 2.5V11.5a2 2 0 0 1-1-1.7v-5.3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoMark() {
  return (
    <span
      aria-hidden="true"
      className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-sm"
    >
      <LogoGlyph />
    </span>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="currentColor" aria-hidden="true">
      <path d="M10 1.8l2.4 5 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L2.2 7.6l5.4-.8 2.4-5Z" />
    </svg>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="mt-0.5 h-4 w-4 shrink-0 text-violet-600"
        fill="none"
      >
        <path
          d="m3.5 8.5 3 3 6-7"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{children}</span>
    </li>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M10 2.5 4 5v4.5c0 3.5 2.4 6.6 6 8 3.6-1.4 6-4.5 6-8V5l-6-2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 7v3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="10" cy="13" r="0.9" fill="currentColor" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2.5 10h15M10 2.5c2 2.2 3 4.7 3 7.5s-1 5.3-3 7.5c-2-2.2-3-4.7-3-7.5s1-5.3 3-7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function IconSliders() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M4 6h12M4 10h12M4 14h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="6" r="1.75" fill="currentColor" />
      <circle cx="13" cy="10" r="1.75" fill="currentColor" />
      <circle cx="7" cy="14" r="1.75" fill="currentColor" />
    </svg>
  );
}
