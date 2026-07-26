import Link from "next/link";
import { PLANS } from "@/lib/plans";

// The gradients shown in the gallery are the real presets from the editor
// (see BACKGROUNDS in src/components/editor.tsx).
const GALLERY = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)",
];

// ⚠️ PLACEHOLDER TESTIMONIALS — replace with real quotes before launch.
// Publishing invented endorsements as if they were real is misleading.
const TESTIMONIALS = [
  {
    quote:
      "Replace this with a real quote from an early user — ideally about how long it used to take them to make a screenshot presentable.",
    name: "Your first customer",
    role: "Product designer",
  },
  {
    quote:
      "Replace this with a real quote. Mentions of a specific workflow (changelogs, launch tweets, docs) convert better than generic praise.",
    name: "Your second customer",
    role: "Developer advocate",
  },
  {
    quote:
      "Replace this with a real quote. Ask permission to use their name, role, and avatar.",
    name: "Your third customer",
    role: "Indie maker",
  },
];

const FAQS = [
  {
    q: "Are my screenshots uploaded anywhere?",
    a: "No. The editor runs entirely in your browser — the image is rendered to PNG locally and never touches a server.",
  },
  {
    q: "What sizes can I export?",
    a: "Presets for Twitter/X (16:9), Open Graph (1.91:1), square, and portrait 4:5, plus an auto mode that fits your image. Free exports at 1280px wide; Pro goes up to 3840px.",
  },
  {
    q: "Does it work for code?",
    a: "Yes — switch to code mode, paste a snippet, and it's syntax-highlighted automatically inside the same frames and backgrounds.",
  },
  {
    q: "Can I use it without an account?",
    a: "Yes, the free editor needs no signup. An account is only needed for Pro (watermark-free, hi-res exports).",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-900/5 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <LogoMark />
            ShotGloss
          </span>
          <nav className="flex items-center gap-1 sm:gap-2">
            <a
              href="#gallery"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 sm:block"
            >
              Gallery
            </a>
            <a
              href="#pricing"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 sm:block"
            >
              Pricing
            </a>
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            >
              Log in
            </Link>
            <Link
              href="/app"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-zinc-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            >
              Open the editor
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Soft colour wash — this product's whole point is gradients */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-[0.18]"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 20% 0%, #764ba2 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 80% 10%, #f5576c 0%, transparent 55%), radial-gradient(ellipse 50% 50% at 50% 0%, #4facfe 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-16 text-center sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-900/10 bg-white/80 px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm backdrop-blur">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #f5576c 100%)",
              }}
            />
            Runs entirely in your browser
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Make your screenshots look
            <br />
            like you hired a designer.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Paste a screenshot or a code snippet. Get a polished image with a
            gradient background, window frame and shadow — sized perfectly for
            Twitter/X, Open Graph, or Instagram. No signup needed to try it.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/app"
              className="w-full rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-zinc-900/15 transition-all duration-200 hover:bg-zinc-700 hover:shadow-xl motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 sm:w-auto"
            >
              Beautify a screenshot — free
            </Link>
            <a
              href="#pricing"
              className="w-full rounded-xl border border-zinc-300 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-700 transition-all duration-200 hover:border-zinc-400 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 sm:w-auto"
            >
              View pricing
            </a>
          </div>

          {/* Live-preview mock — the editor's actual output style */}
          <div className="relative mx-auto mt-16 max-w-3xl">
            {/* Floating chips */}
            <span
              aria-hidden="true"
              className="absolute -left-10 top-12 hidden rounded-xl border border-zinc-900/10 bg-white/90 px-3 py-2 text-xs font-medium text-zinc-600 shadow-lg backdrop-blur lg:block"
            >
              ⌘V to paste
            </span>
            <span
              aria-hidden="true"
              className="absolute -right-10 bottom-16 hidden rounded-xl border border-zinc-900/10 bg-white/90 px-3 py-2 text-xs font-medium text-zinc-600 shadow-lg backdrop-blur lg:block"
            >
              PNG · 3840px
            </span>

            <div className="overflow-hidden rounded-2xl border border-zinc-900/10 bg-white shadow-2xl shadow-zinc-900/20">
              {/* Editor chrome */}
              <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50/80 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                <span className="ml-2 text-xs font-medium text-zinc-400">
                  ShotGloss editor
                </span>
                <span className="ml-auto hidden items-center gap-1.5 sm:flex">
                  {GALLERY.slice(0, 4).map((g, i) => (
                    <span
                      key={g}
                      aria-hidden="true"
                      className={`h-4 w-4 rounded-md ${
                        i === 0 ? "ring-2 ring-zinc-900 ring-offset-1" : ""
                      }`}
                      style={{ background: g }}
                    />
                  ))}
                </span>
              </div>
              {/* Canvas */}
              <div
                className="p-8 sm:p-12"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                <div className="overflow-hidden rounded-lg bg-zinc-900 text-left shadow-2xl">
                  <div className="flex items-center gap-1.5 px-4 py-3">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <pre className="overflow-x-auto px-6 pb-6 font-mono text-xs leading-6 text-zinc-100 sm:text-sm">
                    <code>
                      <span className="text-violet-400">function</span>{" "}
                      <span className="text-sky-400">share</span>
                      <span className="text-zinc-400">(screenshot) {"{"}</span>
                      {"\n  "}
                      <span className="text-violet-400">return</span>{" "}
                      <span className="text-sky-400">polish</span>
                      <span className="text-zinc-400">(screenshot, {"{"}</span>
                      {"\n    "}
                      <span className="text-zinc-300">background</span>
                      <span className="text-zinc-400">: </span>
                      <span className="text-emerald-400">
                        &quot;gradient&quot;
                      </span>
                      <span className="text-zinc-400">,</span>
                      {"\n    "}
                      <span className="text-zinc-300">frame</span>
                      <span className="text-zinc-400">: </span>
                      <span className="text-emerald-400">&quot;macos&quot;</span>
                      <span className="text-zinc-400">,</span>
                      {"\n    "}
                      <span className="text-zinc-300">shadow</span>
                      <span className="text-zinc-400">: </span>
                      <span className="text-emerald-400">&quot;soft&quot;</span>
                      <span className="text-zinc-400">,</span>
                      {"\n  "}
                      <span className="text-zinc-400">{"}"});</span>{" "}
                      <span className="text-zinc-500">
                        {"// ✨ ready to post"}
                      </span>
                      {"\n"}
                      <span className="text-zinc-400">{"}"}</span>
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before / after */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-600">
            Before / after
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Same screenshot. Ten seconds apart.
          </h2>

          <div className="mt-12 grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
            {/* Before */}
            <figure>
              <figcaption className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
                Raw screenshot
              </figcaption>
              <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4">
                <div className="overflow-hidden rounded border border-zinc-200 bg-white">
                  <div className="border-b border-zinc-100 px-3 py-2">
                    <span className="text-[10px] font-medium text-zinc-400">
                      Untitled-1.png
                    </span>
                  </div>
                  <div className="space-y-2 p-4">
                    <span className="block h-2 w-3/4 rounded bg-zinc-200" />
                    <span className="block h-2 w-full rounded bg-zinc-200" />
                    <span className="block h-2 w-2/3 rounded bg-zinc-200" />
                    <span className="block h-2 w-1/2 rounded bg-zinc-200" />
                  </div>
                </div>
              </div>
            </figure>

            <div
              aria-hidden="true"
              className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 shadow-sm lg:rotate-0"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
                <path
                  d="M3 8h10m0 0-3.5-3.5M13 8l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* After */}
            <figure>
              <figcaption className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-violet-600">
                After ShotGloss
              </figcaption>
              <div
                className="rounded-xl p-6 shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                }}
              >
                <div className="overflow-hidden rounded-lg bg-white shadow-2xl">
                  <div className="flex items-center gap-1.5 border-b border-zinc-100 px-3 py-2.5">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    <span className="h-2 w-2 rounded-full bg-yellow-400" />
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                  </div>
                  <div className="space-y-2 p-4">
                    <span className="block h-2 w-3/4 rounded bg-zinc-200" />
                    <span className="block h-2 w-full rounded bg-zinc-200" />
                    <span className="block h-2 w-2/3 rounded bg-zinc-200" />
                    <span className="block h-2 w-1/2 rounded bg-zinc-200" />
                  </div>
                </div>
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-zinc-900/5 bg-zinc-50/70 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-600">
            How it works
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Three steps, no learning curve.
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Paste, tweak, export",
                body: "Ctrl+V a screenshot straight from your clipboard. Pick a background, padding, and frame. Download or copy the PNG.",
                icon: <IconClipboard />,
                tint: "from-violet-500 to-indigo-500",
              },
              {
                title: "Code snippets too",
                body: "Paste code and get a syntax-highlighted, Carbon-style image using the same backgrounds and frames.",
                icon: <IconCode />,
                tint: "from-sky-500 to-cyan-400",
              },
              {
                title: "100% in your browser",
                body: "Images never leave your machine — rendering happens locally. Nothing is uploaded, ever.",
                icon: <IconLock />,
                tint: "from-pink-500 to-rose-500",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-zinc-900/10 bg-white p-6 shadow-sm transition-all duration-200 hover:border-zinc-900/20 hover:shadow-lg motion-safe:hover:-translate-y-0.5"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${f.tint} text-white shadow-sm`}
                >
                  {f.icon}
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="scroll-mt-20 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-600">
            Backgrounds
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Twelve presets. Every one of them tasteful.
          </h2>
          <p className="mt-4 max-w-2xl text-zinc-600">
            Hand-picked gradients and solids, plus padding, corner radius, shadow
            depth and an optional macOS window bar.
          </p>

          <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {GALLERY.map((g, i) => (
              <li key={g}>
                <div
                  className="group aspect-[4/3] rounded-2xl p-5 shadow-md transition-all duration-200 hover:shadow-xl motion-safe:hover:-translate-y-1"
                  style={{ background: g }}
                >
                  <div className="flex h-full w-full flex-col overflow-hidden rounded-lg bg-white/95 shadow-lg">
                    <div className="flex items-center gap-1 border-b border-zinc-100 px-2.5 py-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 space-y-1.5 p-3">
                      <span className="block h-1.5 w-2/3 rounded bg-zinc-200" />
                      <span className="block h-1.5 w-full rounded bg-zinc-200" />
                      <span className="block h-1.5 w-1/2 rounded bg-zinc-200" />
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-center font-mono text-[11px] text-zinc-400">
                  Preset {String(i + 1).padStart(2, "0")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-zinc-900/5 bg-zinc-50/70 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-600">
            Testimonials
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Made for people who post their work.
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <figure
                key={t.name}
                className="flex h-full flex-col rounded-2xl border border-zinc-900/10 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <blockquote className="flex-1 text-sm leading-6 text-zinc-700">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-zinc-100 pt-4">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white shadow-sm"
                    style={{ background: GALLERY[i % GALLERY.length] }}
                  >
                    {t.name.slice(0, 1)}
                  </span>
                  <span className="text-sm">
                    <span className="block font-semibold text-zinc-900">
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
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-600">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Simple pricing
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
            {/* Free */}
            <div className="flex flex-col rounded-2xl border border-zinc-900/10 bg-white p-8 shadow-sm transition-shadow duration-200 hover:shadow-md">
              <h3 className="font-semibold text-zinc-900">Free</h3>
              <p className="mt-2 text-4xl font-bold tabular-nums tracking-tight text-zinc-900">
                {PLANS.free.priceLabel}
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-zinc-600">
                <Check>Full editor, all backgrounds</Check>
                <Check>Screenshot &amp; code modes</Check>
                <Check>1280px exports</Check>
                <Check>Small ShotGloss watermark</Check>
              </ul>
              <Link
                href="/app"
                className="mt-8 block rounded-xl border border-zinc-300 py-3 text-center text-sm font-semibold text-zinc-800 transition-all duration-200 hover:border-zinc-400 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
              >
                Start free
              </Link>
            </div>

            {/* Pro */}
            <div className="relative flex flex-col rounded-2xl border-2 border-zinc-900 bg-white p-8 shadow-xl shadow-zinc-900/5">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 rounded-t-xl"
                style={{
                  background:
                    "linear-gradient(90deg, #667eea, #f093fb, #f5576c)",
                }}
              />
              <span className="absolute -top-3 right-8 rounded-full bg-zinc-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
                Most popular
              </span>
              <h3 className="font-semibold text-zinc-900">Pro</h3>
              <p className="mt-2 text-4xl font-bold tabular-nums tracking-tight text-zinc-900">
                {PLANS.pro.priceLabel}
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-zinc-600">
                <Check>Everything in Free</Check>
                <Check>No watermark</Check>
                <Check>2x / 3x hi-res exports (up to 3840px)</Check>
                <Check>Cancel any time</Check>
              </ul>
              <Link
                href="/signup"
                className="mt-8 block rounded-xl bg-zinc-900 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-zinc-900/15 transition-all duration-200 hover:bg-zinc-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
              >
                Get Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-zinc-900/5 bg-zinc-50/70 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mt-12 divide-y divide-zinc-200 border-y border-zinc-200">
            {FAQS.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-zinc-900 transition-colors hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-4">
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
          <div
            className="relative overflow-hidden rounded-3xl px-6 py-16 text-center shadow-2xl sm:px-16"
            style={{
              background:
                "linear-gradient(135deg, #667eea 0%, #764ba2 55%, #f5576c 100%)",
            }}
          >
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Your next screenshot could look great.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/80">
                No signup, no upload, no watermark on the editor. Paste something
                and see.
              </p>
              <Link
                href="/app"
                className="mt-8 inline-block rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-zinc-900 shadow-lg transition-all duration-200 hover:bg-zinc-100 motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-violet-600"
              >
                Beautify a screenshot — free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900/5">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="flex items-center gap-2 font-bold tracking-tight text-zinc-900">
                <LogoMark />
                ShotGloss
              </span>
              <p className="mt-2 max-w-xs text-sm text-zinc-500">
                Beautiful screenshot &amp; code images, rendered in your browser.
              </p>
            </div>
            <nav className="flex gap-12 text-sm" aria-label="Footer">
              <div>
                <h3 className="font-semibold text-zinc-900">Product</h3>
                <ul className="mt-3 space-y-2 text-zinc-500">
                  <li>
                    <Link href="/app" className="transition-colors hover:text-zinc-900">
                      Editor
                    </Link>
                  </li>
                  <li>
                    <a href="#gallery" className="transition-colors hover:text-zinc-900">
                      Gallery
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="transition-colors hover:text-zinc-900">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">Account</h3>
                <ul className="mt-3 space-y-2 text-zinc-500">
                  <li>
                    <Link href="/login" className="transition-colors hover:text-zinc-900">
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup" className="transition-colors hover:text-zinc-900">
                      Sign up
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          <p className="mt-10 border-t border-zinc-100 pt-6 text-sm text-zinc-500">
            © {new Date().getFullYear()} ShotGloss · Beautiful screenshot &amp;
            code images
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
      className="flex h-7 w-7 items-center justify-center rounded-lg shadow-sm"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #f5576c 100%)" }}
    >
      <svg viewBox="0 0 16 16" className="h-4 w-4 text-white" fill="none">
        <rect
          x="2.5"
          y="3.5"
          width="11"
          height="9"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="6" cy="7" r="1" fill="currentColor" />
        <path
          d="m3.5 11 3-2.5 3 2 2-1.5 2 1.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
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

function IconClipboard() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M7.5 4H6a1.5 1.5 0 0 0-1.5 1.5v10A1.5 1.5 0 0 0 6 17h8a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 14 4h-1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        x="7.5"
        y="2.5"
        width="5"
        height="3"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function IconCode() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="m7 6.5-4 3.5 4 3.5M13 6.5l4 3.5-4 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLock() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect
        x="4.5"
        y="8.5"
        width="11"
        height="8"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 8.5V6.75a3 3 0 0 1 6 0V8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
