import Link from "next/link";
import { PLANS } from "@/lib/plans";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="text-lg font-bold tracking-tight">ReplyCraft</span>
        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-md px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Try it free
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Answer every customer review
          <br />
          in seconds, not Sunday evenings.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-zinc-600">
          Paste a review — glowing or brutal — and ReplyCraft writes a
          thoughtful, human response in your business&apos;s voice. Works for
          Google, Yelp, Trustpilot and TripAdvisor, in any language.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-md bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-700"
          >
            Get 10 free replies a month
          </Link>
          <a
            href="#pricing"
            className="rounded-md border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            View pricing
          </a>
        </div>

        {/* Example */}
        <div className="mx-auto mt-14 grid max-w-3xl gap-4 text-left sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              The review ★☆☆☆☆
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              “Waited 40 minutes for food that arrived cold. Server was
              apologetic but honestly a really disappointing anniversary
              dinner.”
            </p>
          </div>
          <div className="rounded-lg border-2 border-zinc-900 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Your reply, 5 seconds later
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-800">
              “I’m so sorry we let you down on your anniversary — that’s
              exactly the night we should have been at our best. Cold food
              after a 40-minute wait isn’t our standard. I’d love the chance
              to make it right; please email me directly and dinner’s on us.”
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-100 bg-zinc-50 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 sm:grid-cols-3">
          {[
            {
              title: "Handles the hard ones",
              body: "Angry one-star reviews get calm, gracious replies that acknowledge the problem without arguing — the kind that make future customers trust you more.",
            },
            {
              title: "Any platform, any language",
              body: "It's just text — paste from Google, Yelp, Trustpilot, TripAdvisor, Facebook or anywhere else. Replies come back in the reviewer's language.",
            },
            {
              title: "Your voice, your facts",
              body: "Set the tone, add context (“we were short-staffed”, “offer a free coffee”), and it never invents policies or compensation you didn't approve.",
            },
          ].map((f) => (
            <div key={f.title}>
              <h3 className="font-semibold text-zinc-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight text-zinc-900">
            Simple pricing
          </h2>
          <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 bg-white p-8">
              <h3 className="font-semibold text-zinc-900">Free</h3>
              <p className="mt-2 text-3xl font-bold text-zinc-900">
                {PLANS.free.priceLabel}
              </p>
              <ul className="mt-6 space-y-3 text-sm text-zinc-600">
                <li>✓ {PLANS.free.repliesPerMonth} replies / month</li>
                <li>✓ All three tones</li>
                <li>✓ Any language</li>
                <li>✓ Reply history</li>
              </ul>
              <Link
                href="/signup"
                className="mt-8 block rounded-md border border-zinc-300 py-2.5 text-center text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                Start free
              </Link>
            </div>
            <div className="rounded-xl border-2 border-zinc-900 bg-white p-8">
              <h3 className="font-semibold text-zinc-900">Pro</h3>
              <p className="mt-2 text-3xl font-bold text-zinc-900">
                {PLANS.pro.priceLabel}
              </p>
              <ul className="mt-6 space-y-3 text-sm text-zinc-600">
                <li>✓ {PLANS.pro.repliesPerMonth} replies / month</li>
                <li>✓ Everything in Free</li>
                <li>✓ Enough for multiple locations</li>
                <li>✓ Cancel any time</li>
              </ul>
              <Link
                href="/signup"
                className="mt-8 block rounded-md bg-zinc-900 py-2.5 text-center text-sm font-semibold text-white hover:bg-zinc-700"
              >
                Get Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-zinc-100 bg-zinc-50 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-2xl font-bold text-zinc-900">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-8">
            {[
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
            ].map((item) => (
              <div key={item.q}>
                <dt className="font-semibold text-zinc-900">{item.q}</dt>
                <dd className="mt-2 text-sm leading-6 text-zinc-600">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <footer className="border-t border-zinc-100 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} ReplyCraft · AI review response generator
      </footer>
    </div>
  );
}
