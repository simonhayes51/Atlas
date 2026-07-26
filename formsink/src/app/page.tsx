import Link from "next/link";
import { PLANS } from "@/lib/plans";

const snippet = `<form action="https://formsink.com/f/your-form-id" method="POST">
  <input type="email" name="email" required>
  <textarea name="message"></textarea>
  <button type="submit">Send</button>
</form>`;

// ⚠️ PLACEHOLDER TESTIMONIALS — replace with real quotes before launch.
// Publishing invented endorsements as if they were real is misleading.
const TESTIMONIALS = [
  {
    quote:
      "Replace this with a real quote from an early user. Keep it to one or two sentences about the problem FormSink solved for them.",
    name: "Your first customer",
    role: "Freelance developer",
  },
  {
    quote:
      "Replace this with a real quote. Specific outcomes convert better than praise — how long setup took, what it replaced.",
    name: "Your second customer",
    role: "Agency owner",
  },
  {
    quote:
      "Replace this with a real quote. Ask permission to use their name and role, and link to their site if they have one.",
    name: "Your third customer",
    role: "Indie hacker",
  },
];

const FLOW = [
  { label: "Browser", sub: "visitor submits" },
  { label: "POST", sub: "/f/your-form-id" },
  { label: "FormSink", sub: "validate + store" },
  { label: "Dashboard", sub: "browse + export" },
  { label: "Email", sub: "instant notification" },
];

const FAQS = [
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
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-950 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-950/5 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <LogoMark />
            FormSink
          </span>
          <nav className="flex items-center gap-1 sm:gap-2">
            <a
              href="#pricing"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 sm:block"
            >
              Pricing
            </a>
            <a
              href="#docs"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 sm:block"
            >
              Docs
            </a>
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-zinc-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Get started free
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Grid texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-size:56px_56px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgb(9 9 11 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(9 9 11 / 0.05) 1px, transparent 1px)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-16 text-center sm:pt-24">
          <a
            href="#docs"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-950/10 bg-white px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm transition-colors hover:border-zinc-950/20 hover:text-zinc-950"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-600" />
            </span>
            One endpoint. Zero backend code.
            <svg
              aria-hidden="true"
              viewBox="0 0 12 12"
              className="h-3 w-3 text-zinc-400"
            >
              <path
                d="M4.5 2.5 8 6l-3.5 3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          <h1 className="mx-auto mt-6 max-w-4xl text-balance text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
            A form backend for static sites.
            <br />
            No server. No code. No maintenance.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Point your HTML form at a FormSink endpoint and every submission lands
            in your dashboard and your inbox. Works with any static site — plain
            HTML, Astro, Hugo, Jekyll, Next.js, Webflow exports.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="w-full rounded-xl bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-zinc-950/10 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-950/15 motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:w-auto"
            >
              Create your first form — free
            </Link>
            <a
              href="#pricing"
              className="w-full rounded-xl border border-zinc-300 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-700 transition-all duration-200 hover:border-zinc-400 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:w-auto"
            >
              View pricing
            </a>
          </div>

          {/* Terminal */}
          <div className="mx-auto mt-14 max-w-2xl overflow-hidden rounded-xl border border-zinc-950/10 bg-zinc-950 text-left shadow-2xl shadow-zinc-950/20 ring-1 ring-inset ring-white/10">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="ml-2 font-mono text-xs text-zinc-500">
                index.html — that&apos;s the whole integration
              </span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-6 text-zinc-300 sm:text-sm">
              <code>
                <span className="text-zinc-500">&lt;</span>
                <span className="text-sky-400">form</span>{" "}
                <span className="text-violet-400">action</span>
                <span className="text-zinc-500">=</span>
                <span className="text-emerald-400">
                  &quot;https://formsink.com/f/your-form-id&quot;
                </span>{" "}
                <span className="text-violet-400">method</span>
                <span className="text-zinc-500">=</span>
                <span className="text-emerald-400">&quot;POST&quot;</span>
                <span className="text-zinc-500">&gt;</span>
                {"\n  "}
                <span className="text-zinc-500">&lt;</span>
                <span className="text-sky-400">input</span>{" "}
                <span className="text-violet-400">type</span>
                <span className="text-zinc-500">=</span>
                <span className="text-emerald-400">&quot;email&quot;</span>{" "}
                <span className="text-violet-400">name</span>
                <span className="text-zinc-500">=</span>
                <span className="text-emerald-400">&quot;email&quot;</span>{" "}
                <span className="text-violet-400">required</span>
                <span className="text-zinc-500">&gt;</span>
                {"\n  "}
                <span className="text-zinc-500">&lt;</span>
                <span className="text-sky-400">textarea</span>{" "}
                <span className="text-violet-400">name</span>
                <span className="text-zinc-500">=</span>
                <span className="text-emerald-400">&quot;message&quot;</span>
                <span className="text-zinc-500">&gt;&lt;/</span>
                <span className="text-sky-400">textarea</span>
                <span className="text-zinc-500">&gt;</span>
                {"\n  "}
                <span className="text-zinc-500">&lt;</span>
                <span className="text-sky-400">button</span>{" "}
                <span className="text-violet-400">type</span>
                <span className="text-zinc-500">=</span>
                <span className="text-emerald-400">&quot;submit&quot;</span>
                <span className="text-zinc-500">&gt;</span>Send
                <span className="text-zinc-500">&lt;/</span>
                <span className="text-sky-400">button</span>
                <span className="text-zinc-500">&gt;</span>
                {"\n"}
                <span className="text-zinc-500">&lt;/</span>
                <span className="text-sky-400">form</span>
                <span className="text-zinc-500">&gt;</span>
              </code>
            </pre>
          </div>
          <p className="sr-only">{snippet}</p>
        </div>
      </section>

      {/* Works-with bar */}
      <section aria-labelledby="works-with" className="border-y border-zinc-950/5 bg-zinc-50/60 py-8">
        <div className="mx-auto max-w-6xl px-6">
          <h2
            id="works-with"
            className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400"
          >
            Drops into any static site
          </h2>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-zinc-500 sm:gap-x-12">
            {["HTML", "Astro", "Hugo", "Jekyll", "Next.js", "Webflow"].map((n) => (
              <li key={n} className="transition-colors hover:text-zinc-800">
                {n}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Request flow */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
            The request lifecycle
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            One POST. Four things happen.
          </h2>
          <p className="mt-4 max-w-2xl text-zinc-600">
            No queues, no workers, no cold starts to reason about — the path a
            submission takes is short enough to hold in your head.
          </p>

          <ol className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {FLOW.map((step, i) => (
              <li key={step.label} className="relative">
                <div className="group h-full rounded-xl border border-zinc-950/10 bg-white p-5 shadow-sm transition-all duration-200 hover:border-blue-600/30 hover:shadow-md">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-950 font-mono text-[11px] font-semibold text-white">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-zinc-950">
                      {step.label}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-xs text-zinc-500">
                    {step.sub}
                  </p>
                </div>
                {i < FLOW.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-2.5 left-1/2 h-3 w-px -translate-x-1/2 bg-zinc-300 sm:hidden"
                  />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-950/5 bg-zinc-50/60 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
            What you get
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            Everything a contact form needs. Nothing it doesn&apos;t.
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Email notifications",
                body: "Every submission is delivered to your inbox instantly, with all fields formatted. Toggle per form.",
                icon: <IconMail />,
              },
              {
                title: "Spam honeypot built in",
                body: "Add one hidden field and bots filter themselves out. No CAPTCHA hoops for your real visitors.",
                icon: <IconShield />,
              },
              {
                title: "Dashboard + CSV export",
                body: "Browse every submission, watch monthly usage, and export any form's data to CSV in one click.",
                icon: <IconTable />,
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-zinc-950/10 bg-white p-6 shadow-sm transition-all duration-200 hover:border-zinc-950/20 hover:shadow-lg motion-safe:hover:-translate-y-0.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-950 text-white transition-colors group-hover:bg-blue-600">
                  {f.icon}
                </div>
                <h3 className="mt-4 font-semibold text-zinc-950">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Docs-style API section */}
      <section id="docs" className="scroll-mt-20 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
            API
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            Plain HTML or fetch — same endpoint.
          </h2>
          <p className="mt-4 max-w-2xl text-zinc-600">
            Browser posts get a redirect. JSON posts get JSON back. CORS is open,
            so it works from anywhere.
          </p>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <CodePanel
              method="POST"
              path="/f/:formId"
              caption="fetch — JSON in, JSON out"
            >
              <span className="text-violet-400">await</span>{" "}
              <span className="text-sky-400">fetch</span>
              <span className="text-zinc-500">(</span>
              <span className="text-emerald-400">
                &quot;https://formsink.com/f/abc123&quot;
              </span>
              <span className="text-zinc-500">, {"{"}</span>
              {"\n  "}
              <span className="text-violet-400">method</span>
              <span className="text-zinc-500">: </span>
              <span className="text-emerald-400">&quot;POST&quot;</span>
              <span className="text-zinc-500">,</span>
              {"\n  "}
              <span className="text-violet-400">headers</span>
              <span className="text-zinc-500">: {"{"} </span>
              <span className="text-emerald-400">
                &quot;Content-Type&quot;
              </span>
              <span className="text-zinc-500">: </span>
              <span className="text-emerald-400">
                &quot;application/json&quot;
              </span>
              <span className="text-zinc-500"> {"}"},</span>
              {"\n  "}
              <span className="text-violet-400">body</span>
              <span className="text-zinc-500">: </span>
              <span className="text-sky-400">JSON</span>
              <span className="text-zinc-500">.</span>
              <span className="text-sky-400">stringify</span>
              <span className="text-zinc-500">({"{"} </span>
              <span className="text-violet-400">email</span>
              <span className="text-zinc-500">, </span>
              <span className="text-violet-400">message</span>
              <span className="text-zinc-500"> {"}"}),</span>
              {"\n"}
              <span className="text-zinc-500">{"}"});</span>
              {"\n\n"}
              <span className="text-zinc-600">{"// → { \"ok\": true }"}</span>
            </CodePanel>

            <CodePanel
              method="POST"
              path="/f/:formId"
              caption="hidden fields — spam + redirect"
            >
              <span className="text-zinc-600">
                {"<!-- bots fill this in, humans don't -->"}
              </span>
              {"\n"}
              <span className="text-zinc-500">&lt;</span>
              <span className="text-sky-400">input</span>{" "}
              <span className="text-violet-400">type</span>
              <span className="text-zinc-500">=</span>
              <span className="text-emerald-400">&quot;text&quot;</span>{" "}
              <span className="text-violet-400">name</span>
              <span className="text-zinc-500">=</span>
              <span className="text-emerald-400">&quot;_gotcha&quot;</span>
              <span className="text-zinc-500">&gt;</span>
              {"\n\n"}
              <span className="text-zinc-600">
                {"<!-- send them anywhere after submit -->"}
              </span>
              {"\n"}
              <span className="text-zinc-500">&lt;</span>
              <span className="text-sky-400">input</span>{" "}
              <span className="text-violet-400">type</span>
              <span className="text-zinc-500">=</span>
              <span className="text-emerald-400">&quot;hidden&quot;</span>{" "}
              <span className="text-violet-400">name</span>
              <span className="text-zinc-500">=</span>
              <span className="text-emerald-400">&quot;_next&quot;</span>
              {"\n       "}
              <span className="text-violet-400">value</span>
              <span className="text-zinc-500">=</span>
              <span className="text-emerald-400">
                &quot;https://yoursite.com/thanks&quot;
              </span>
              <span className="text-zinc-500">&gt;</span>
            </CodePanel>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-zinc-950/5 bg-zinc-50/60 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
            Testimonials
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            Built for people who ship static sites.
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="flex h-full flex-col rounded-2xl border border-zinc-950/10 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 text-zinc-300"
                  fill="currentColor"
                >
                  <path d="M9.5 5C6.5 6.7 4.6 9.7 4.6 13.2c0 3.3 1.9 5.8 4.6 5.8 2.1 0 3.7-1.6 3.7-3.6 0-2-1.4-3.5-3.3-3.5-.4 0-.8.1-1 .2.3-1.8 1.7-3.4 3.5-4.4L9.5 5Zm9.1 0c-3 1.7-4.9 4.7-4.9 8.2 0 3.3 1.9 5.8 4.6 5.8 2.1 0 3.7-1.6 3.7-3.6 0-2-1.4-3.5-3.3-3.5-.4 0-.8.1-1 .2.3-1.8 1.7-3.4 3.5-4.4L18.6 5Z" />
                </svg>
                <blockquote className="mt-4 flex-1 text-sm leading-6 text-zinc-700">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-zinc-100 pt-4">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-500"
                  >
                    {t.name.slice(0, 1)}
                  </span>
                  <span className="text-sm">
                    <span className="block font-semibold text-zinc-950">
                      {t.name}
                    </span>
                    <span className="block text-zinc-500">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-20 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
              Simple pricing
            </h2>
            <p className="mt-3 text-zinc-600">
              Start free. Upgrade when your forms take off.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
            {/* Free */}
            <div className="flex flex-col rounded-2xl border border-zinc-950/10 bg-white p-8 shadow-sm transition-shadow duration-200 hover:shadow-md">
              <h3 className="font-semibold text-zinc-950">Free</h3>
              <p className="mt-2 text-4xl font-bold tabular-nums tracking-tight text-zinc-950">
                {PLANS.free.priceLabel}
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-zinc-600">
                <Check>{PLANS.free.maxForms} forms</Check>
                <Check>
                  {PLANS.free.maxSubmissionsPerMonth} submissions / month
                </Check>
                <Check>Email notifications</Check>
                <Check>Spam honeypot</Check>
              </ul>
              <Link
                href="/signup"
                className="mt-8 block rounded-xl border border-zinc-300 py-3 text-center text-sm font-semibold text-zinc-800 transition-all duration-200 hover:border-zinc-400 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                Start free
              </Link>
            </div>

            {/* Pro */}
            <div className="relative flex flex-col rounded-2xl border-2 border-zinc-950 bg-white p-8 shadow-xl shadow-zinc-950/5">
              <span className="absolute -top-3 left-8 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
                Most popular
              </span>
              <h3 className="font-semibold text-zinc-950">Pro</h3>
              <p className="mt-2 text-4xl font-bold tabular-nums tracking-tight text-zinc-950">
                {PLANS.pro.priceLabel}
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-zinc-600">
                <Check>Unlimited forms</Check>
                <Check>
                  {PLANS.pro.maxSubmissionsPerMonth.toLocaleString()} submissions
                  / month
                </Check>
                <Check>Email notifications</Check>
                <Check>CSV export</Check>
                <Check>Custom redirect URLs</Check>
              </ul>
              <Link
                href="/signup"
                className="mt-8 block rounded-xl bg-zinc-950 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-zinc-950/10 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                Get Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-zinc-950/5 bg-zinc-50/60 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mt-12 divide-y divide-zinc-200 border-y border-zinc-200">
            {FAQS.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-zinc-950 transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4">
                  {item.q}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-200 group-open:rotate-45"
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
                <p className="mt-3 text-sm leading-6 text-zinc-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-950 px-6 py-16 text-center shadow-2xl shadow-zinc-950/20 sm:px-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 [background-size:40px_40px] opacity-60"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgb(255 255 255 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.04) 1px, transparent 1px)",
              }}
            />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Your form could be live in two minutes.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-zinc-400">
                Paste one line into your HTML. That&apos;s the whole integration.
              </p>
              <Link
                href="/signup"
                className="mt-8 inline-block rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-zinc-950 shadow-lg transition-all duration-200 hover:bg-zinc-100 motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              >
                Create your first form — free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-950/5">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="flex items-center gap-2 font-bold tracking-tight text-zinc-950">
                <LogoMark />
                FormSink
              </span>
              <p className="mt-2 max-w-xs text-sm text-zinc-500">
                Form backend for static websites.
              </p>
            </div>
            <nav className="flex gap-12 text-sm" aria-label="Footer">
              <div>
                <h3 className="font-semibold text-zinc-950">Product</h3>
                <ul className="mt-3 space-y-2 text-zinc-500">
                  <li>
                    <a href="#pricing" className="transition-colors hover:text-zinc-950">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#docs" className="transition-colors hover:text-zinc-950">
                      Docs
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-950">Account</h3>
                <ul className="mt-3 space-y-2 text-zinc-500">
                  <li>
                    <Link href="/login" className="transition-colors hover:text-zinc-950">
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup" className="transition-colors hover:text-zinc-950">
                      Sign up
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          <p className="mt-10 border-t border-zinc-100 pt-6 text-sm text-zinc-500">
            © {new Date().getFullYear()} FormSink · Form backend for static
            websites
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ---------------------------------------------------------------- helpers */

function LogoMark() {
  return (
    <span
      aria-hidden="true"
      className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-950"
    >
      <svg viewBox="0 0 16 16" className="h-4 w-4 text-white" fill="none">
        <path
          d="M3 4h10M3 8h10M3 12h5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="mt-0.5 h-4 w-4 shrink-0 text-blue-600"
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

function CodePanel({
  method,
  path,
  caption,
  children,
}: {
  method: string;
  path: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-950/10 bg-zinc-950 shadow-lg ring-1 ring-inset ring-white/10">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="rounded bg-blue-600/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-blue-400">
          {method}
        </span>
        <span className="font-mono text-xs text-zinc-300">{path}</span>
        <span className="ml-auto text-xs text-zinc-500">{caption}</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-6 text-zinc-300">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect
        x="2.5"
        y="4.5"
        width="15"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="m3.5 6 6.5 4.5L16.5 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
        d="m7.5 10 1.8 1.8L13 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTable() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect
        x="2.5"
        y="3.5"
        width="15"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M2.5 8h15M8 8v8.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
