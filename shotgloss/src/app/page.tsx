import Link from "next/link";
import { PLANS } from "@/lib/plans";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="text-lg font-bold tracking-tight">ShotGloss</span>
        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-md px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Log in
          </Link>
          <Link
            href="/app"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Open the editor
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Make your screenshots look
          <br />
          like you hired a designer.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-zinc-600">
          Paste a screenshot or a code snippet. Get a polished image with a
          gradient background, window frame and shadow — sized perfectly for
          Twitter/X, Open Graph, or Instagram. No signup needed to try it.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/app"
            className="rounded-md bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-700"
          >
            Beautify a screenshot — free
          </Link>
          <a
            href="#pricing"
            className="rounded-md border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            View pricing
          </a>
        </div>

        {/* Static mock of the output style */}
        <div
          className="mx-auto mt-14 max-w-2xl rounded-xl p-10"
          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
        >
          <div className="overflow-hidden rounded-lg bg-zinc-900 text-left shadow-2xl">
            <div className="flex items-center gap-1.5 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <pre className="overflow-x-auto px-6 pb-6 font-mono text-sm leading-6 text-zinc-100">
              <code>{`function share(screenshot) {
  return polish(screenshot, {
    background: "gradient",
    frame: "macos",
    shadow: "soft",
  }); // ✨ ready to post
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-100 bg-zinc-50 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 sm:grid-cols-3">
          {[
            {
              title: "Paste, tweak, export",
              body: "Ctrl+V a screenshot straight from your clipboard. Pick a background, padding, and frame. Download or copy the PNG.",
            },
            {
              title: "Code snippets too",
              body: "Paste code and get a syntax-highlighted, Carbon-style image using the same backgrounds and frames.",
            },
            {
              title: "100% in your browser",
              body: "Images never leave your machine — rendering happens locally. Nothing is uploaded, ever.",
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
                <li>✓ Full editor, all backgrounds</li>
                <li>✓ Screenshot & code modes</li>
                <li>✓ 1280px exports</li>
                <li>✓ Small ShotGloss watermark</li>
              </ul>
              <Link
                href="/app"
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
                <li>✓ Everything in Free</li>
                <li>✓ No watermark</li>
                <li>✓ 2x / 3x hi-res exports (up to 3840px)</li>
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
        © {new Date().getFullYear()} ShotGloss · Beautiful screenshot & code
        images
      </footer>
    </div>
  );
}
