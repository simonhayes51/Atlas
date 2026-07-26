import Link from "next/link";
import { PLANS } from "@/lib/plans";

const snippet = `<form action="https://formsink.com/f/your-form-id" method="POST">
  <input type="email" name="email" required>
  <textarea name="message"></textarea>
  <button type="submit">Send</button>
</form>`;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="text-lg font-bold tracking-tight">FormSink</span>
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
            Get started free
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-16 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          A form backend for static sites.
          <br />
          No server. No code. No maintenance.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-zinc-600">
          Point your HTML form at a FormSink endpoint and every submission lands
          in your dashboard and your inbox. Works with any static site — plain
          HTML, Astro, Hugo, Jekyll, Next.js, Webflow exports.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-md bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-700"
          >
            Create your first form — free
          </Link>
          <a
            href="#pricing"
            className="rounded-md border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            View pricing
          </a>
        </div>

        <div className="mx-auto mt-14 max-w-2xl overflow-hidden rounded-lg border border-zinc-200 bg-zinc-950 text-left shadow-lg">
          <div className="flex items-center gap-1.5 border-b border-zinc-800 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="ml-2 text-xs text-zinc-500">
              index.html — that&apos;s the whole integration
            </span>
          </div>
          <pre className="overflow-x-auto p-4 text-sm leading-6 text-zinc-100">
            <code>{snippet}</code>
          </pre>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-100 bg-zinc-50 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 sm:grid-cols-3">
          {[
            {
              title: "Email notifications",
              body: "Every submission is delivered to your inbox instantly, with all fields formatted. Toggle per form.",
            },
            {
              title: "Spam honeypot built in",
              body: "Add one hidden field and bots filter themselves out. No CAPTCHA hoops for your real visitors.",
            },
            {
              title: "Dashboard + CSV export",
              body: "Browse every submission, watch monthly usage, and export any form's data to CSV in one click.",
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
          <p className="mt-3 text-center text-zinc-600">
            Start free. Upgrade when your forms take off.
          </p>
          <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 bg-white p-8">
              <h3 className="font-semibold text-zinc-900">Free</h3>
              <p className="mt-2 text-3xl font-bold text-zinc-900">
                {PLANS.free.priceLabel}
              </p>
              <ul className="mt-6 space-y-3 text-sm text-zinc-600">
                <li>✓ {PLANS.free.maxForms} forms</li>
                <li>✓ {PLANS.free.maxSubmissionsPerMonth} submissions / month</li>
                <li>✓ Email notifications</li>
                <li>✓ Spam honeypot</li>
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
                <li>✓ Unlimited forms</li>
                <li>
                  ✓ {PLANS.pro.maxSubmissionsPerMonth.toLocaleString()} submissions
                  / month
                </li>
                <li>✓ Email notifications</li>
                <li>✓ CSV export</li>
                <li>✓ Custom redirect URLs</li>
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
                q: "How does it work without a server?",
                a: "Your form's action attribute points at your FormSink endpoint. We receive the POST, store the submission, email you, and redirect the visitor to a thank-you page (or any URL you choose).",
              },
              {
                q: "Does it work with JavaScript / fetch?",
                a: "Yes — send JSON or FormData to the same endpoint with fetch() and you'll get a JSON response back. CORS is enabled.",
              },
              {
                q: "How do you stop spam?",
                a: "Add a hidden field named _gotcha to your form. Humans leave it empty; bots fill it in and those submissions are dropped silently.",
              },
              {
                q: "Can I redirect to my own thank-you page?",
                a: "Yes. Add a hidden field named _next with the URL, or set a default redirect per form in the dashboard.",
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
        © {new Date().getFullYear()} FormSink · Form backend for static websites
      </footer>
    </div>
  );
}
