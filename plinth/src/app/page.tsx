import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DEVICE_PRESETS } from "@/lib/devices";

export default function LandingPage() {
  return (
    <div className="bg-[var(--paper)] text-[var(--ink)]">
      <Nav />
      <Hero />
      <Problem />
      <HowItWorks />
      <DeviceCoverage />
      <Locales />
      <AiAssist />
      <Pricing />
      <Faq />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          Plinth
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-[var(--ink-soft)] md:flex">
          <a href="#how" className="hover:text-[var(--ink)]">
            How it works
          </a>
          <a href="#pricing" className="hover:text-[var(--ink)]">
            Pricing
          </a>
          <Link href="/compare" className="hover:text-[var(--ink)]">
            Compare
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] sm:block">
            Log in
          </Link>
          <Link href="/app">
            <Button size="sm">Open the studio</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="grid items-center gap-14 md:grid-cols-2">
        <div className="animate-rise">
          <p className="eyebrow mb-5">App store screenshot studio</p>
          <h1 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance md:text-5xl">
            Store screenshots that sell <em className="text-[var(--brass)] not-italic font-serif italic">the tap.</em>
          </h1>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-[var(--ink-soft)]">
            Drop in your raw captures. Plinth frames them, sets the copy, and
            exports every size the App Store and Google Play actually require
            — in one pass, in every language you ship.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/app">
              <Button size="lg">Open the studio — free</Button>
            </Link>
            <a href="#pricing" className="text-sm font-medium text-[var(--ink-soft)] underline underline-offset-4 hover:text-[var(--ink)]">
              See pricing
            </a>
          </div>
          <p className="mt-6 text-xs text-[var(--muted)]">
            No account needed to start. No screenshots ever leave your browser
            until you choose to save a set.
          </p>
        </div>
        <HeroMock />
      </div>
    </section>
  );
}

function HeroMock() {
  return (
    <div
      className="relative flex items-center justify-center rounded-2xl border border-[var(--line)] p-10 md:p-14"
      style={{ background: "linear-gradient(150deg, #241E2E, #7A2E3B)" }}
    >
      <div className="flex items-end gap-4">
        <MockPhone offset className="hidden sm:block" />
        <MockPhone primary />
        <MockPhone offset className="hidden sm:block" />
      </div>
    </div>
  );
}

function MockPhone({ primary, offset, className }: { primary?: boolean; offset?: boolean; className?: string }) {
  return (
    <div
      className={`${className ?? ""} w-28 rounded-[1.4rem] border-4 border-[#141014] bg-[#141014] shadow-2xl md:w-36 ${
        offset ? "mb-[-1.5rem] scale-90 opacity-70" : ""
      }`}
      style={{ aspectRatio: "1320 / 2868" }}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[1rem] bg-[var(--paper)]">
        <div className="mx-auto mt-2 h-2 w-10 rounded-full bg-[#141014]" />
        {primary ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-3 text-center">
            <p className="font-display text-[10px] leading-tight font-semibold md:text-xs">
              Track every habit, in seconds
            </p>
            <div className="mt-1 h-16 w-full rounded-md bg-[var(--brass)]/25 md:h-24" />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-16 w-[85%] rounded-md bg-[var(--ink)]/10 md:h-24" />
          </div>
        )}
      </div>
    </div>
  );
}

function Problem() {
  return (
    <section className="border-t border-[var(--line)] bg-[var(--paper-raised)]">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="eyebrow mb-5">Why this matters</p>
        <p className="font-display text-2xl leading-snug font-medium tracking-tight md:text-3xl">
          A store listing is a cold pitch. Most developers ship the raw
          simulator capture and hope the icon does the work.
        </p>
        <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-[var(--muted)]">
          Screenshots are the highest-leverage, lowest-effort lever on your
          conversion rate — and the one most likely to be an afterthought.
          Plinth exists so dressing them properly takes minutes, not a
          freelance design brief.
        </p>
      </div>
    </section>
  );
}

const steps = [
  {
    n: "01",
    title: "Drop in your captures",
    body: "Paste, drag, or upload raw screenshots straight from the simulator or your device. Nothing uploads to a server until you choose to save.",
  },
  {
    n: "02",
    title: "Dress each frame",
    body: "Set a background, a headline and subheadline, and a device bezel. Reuse the same look across every frame in the set, or vary it per screen.",
  },
  {
    n: "03",
    title: "Export every size, every language",
    body: "One click renders every required App Store and Google Play dimension, per locale, packed into a zip ready to upload.",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-6 py-20">
      <p className="eyebrow mb-4 text-center">How it works</p>
      <h2 className="font-display mx-auto max-w-xl text-center text-3xl font-semibold tracking-tight">
        Three steps between a raw capture and a submitted listing.
      </h2>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="plinth-card p-7">
            <span className="font-mono text-sm text-[var(--brass)]">{s.n}</span>
            <h3 className="font-display mt-3 text-lg font-semibold tracking-tight">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function DeviceCoverage() {
  return (
    <section className="border-t border-[var(--line)] bg-[var(--paper-raised)]">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <p className="eyebrow mb-4 text-center">Every required size</p>
        <h2 className="font-display mx-auto max-w-xl text-center text-3xl font-semibold tracking-tight">
          Sized to what App Store Connect and Play Console actually ask for.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-sm text-[var(--muted)]">
          Pick a preset and Plinth renders at the exact pixel dimensions —
          no guessing, no rejected uploads over a stray pixel.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-4">
          {DEVICE_PRESETS.map((d) => (
            <div key={d.id} className="bg-[var(--paper)] px-4 py-6 text-center">
              <p className="text-sm font-medium">{d.label}</p>
              <p className="eyebrow mt-2">{d.store}</p>
              <p className="font-mono mt-3 text-xs text-[var(--brass)]">
                {d.width}×{d.height}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Locales() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <p className="eyebrow mb-4">Ship globally</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            One set. Every storefront language.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
            Add a translated headline per locale on the same frame — the
            layout, background and device frame stay identical. Batch export
            writes one folder per language, so your localisation pass doesn&apos;t
            mean rebuilding the whole set six times.
          </p>
        </div>
        <div className="plinth-card p-6">
          <p className="eyebrow mb-4">Export folder</p>
          <div className="font-mono space-y-1.5 text-sm text-[var(--ink-soft)]">
            <p>habit-tracker-set/</p>
            <p className="pl-4">en/iphone-6.9-01.png</p>
            <p className="pl-4">es/iphone-6.9-01.png</p>
            <p className="pl-4">fr/iphone-6.9-01.png</p>
            <p className="pl-4">de/iphone-6.9-01.png</p>
            <p className="pl-4 text-[var(--muted)]">…</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AiAssist() {
  return (
    <section className="border-t border-[var(--line)] bg-[var(--paper-raised)]">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <div className="plinth-card p-6">
              <p className="eyebrow mb-4">Headline Assist</p>
              <div className="space-y-3">
                <div className="rounded-md border border-[var(--line)] bg-[var(--paper)] p-3">
                  <p className="text-sm font-medium">Every habit, tracked in seconds</p>
                  <p className="text-xs text-[var(--muted)]">Benefit-led</p>
                </div>
                <div className="rounded-md border border-[var(--line)] bg-[var(--paper)] p-3">
                  <p className="text-sm font-medium">Streaks, reminders, one tap logging</p>
                  <p className="text-xs text-[var(--muted)]">Feature-led</p>
                </div>
                <div className="rounded-md border border-[var(--line)] bg-[var(--paper)] p-3">
                  <p className="text-sm font-medium">Joined by 40,000 people rebuilding routines</p>
                  <p className="text-xs text-[var(--muted)]">Outcome-led</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <p className="eyebrow mb-4">Pro · real Claude API calls</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              Stuck on the headline? Ask for three angles.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
              Give Headline Assist your app name and a one-line description
              and it drafts three distinct headline and subheadline pairs —
              benefit, feature and outcome led — using your own Anthropic API
              key. Nothing is pre-written or templated; every draft is a real
              model call you can regenerate.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-5xl px-6 py-20">
      <p className="eyebrow mb-4 text-center">Pricing</p>
      <h2 className="font-display mx-auto max-w-xl text-center text-3xl font-semibold tracking-tight">
        Free while you&apos;re figuring out the set. Pro when you&apos;re shipping it.
      </h2>
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <div className="plinth-card p-8">
          <p className="eyebrow mb-2">Free</p>
          <p className="font-display text-3xl font-semibold">£0</p>
          <ul className="mt-6 space-y-3 text-sm text-[var(--ink-soft)]">
            <li>· 1 saved set, up to 3 frames</li>
            <li>· iPhone 6.9″ export preset</li>
            <li>· Small corner watermark on export</li>
            <li>· Single-locale copy</li>
          </ul>
          <Link href="/app" className="mt-8 block">
            <Button variant="secondary" className="w-full">
              Start free
            </Button>
          </Link>
        </div>
        <div className="plinth-card p-8" style={{ borderBottomColor: "var(--brass)" }}>
          <p className="eyebrow mb-2 text-[var(--brass)]">Pro</p>
          <p className="font-display text-3xl font-semibold">
            £12<span className="text-base font-normal text-[var(--muted)]">/mo</span>
          </p>
          <ul className="mt-6 space-y-3 text-sm text-[var(--ink-soft)]">
            <li>· Unlimited sets and frames</li>
            <li>· Every device preset, batch zip export</li>
            <li>· No watermark</li>
            <li>· Multi-locale copy per frame</li>
            <li>· Headline Assist (bring your own Claude key)</li>
          </ul>
          <Link href="/signup" className="mt-8 block">
            <Button className="w-full">Upgrade to Pro</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

const faqs = [
  {
    q: "Do I need an account to try it?",
    a: "No. The studio at /app is open — build a set, export a single frame, and see the whole workflow before you sign up for anything.",
  },
  {
    q: "Where do my screenshots go?",
    a: "Rendering happens entirely in your browser via Canvas. Nothing is uploaded unless you're signed in and choose to save a set, in which case only the compact project data and a small thumbnail are stored — never a copy of the original image files.",
  },
  {
    q: "What does Headline Assist actually call?",
    a: "It's a real request to the Anthropic Claude API using an API key you provide in Account settings. There's no shared key and no canned response — if the key is missing or invalid, the button tells you so.",
  },
  {
    q: "Can I cancel Pro any time?",
    a: "Yes, from Account → Manage subscription, handled by Stripe's customer portal. No email required.",
  },
];

function Faq() {
  return (
    <section className="border-t border-[var(--line)] bg-[var(--paper-raised)]">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <p className="eyebrow mb-4 text-center">Questions</p>
        <div className="mt-10 divide-y divide-[var(--line)]">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                {f.q}
                <span className="ml-4 text-[var(--muted)] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-6 py-14">
      <div className="flex flex-col items-center justify-between gap-6 border-t border-[var(--line)] pt-10 text-sm text-[var(--muted)] md:flex-row">
        <span className="font-display font-semibold text-[var(--ink)]">Plinth</span>
        <nav className="flex flex-wrap items-center justify-center gap-6">
          <Link href="/app" className="hover:text-[var(--ink)]">
            Studio
          </Link>
          <Link href="/compare" className="hover:text-[var(--ink)]">
            Compare
          </Link>
          <Link href="/login" className="hover:text-[var(--ink)]">
            Log in
          </Link>
        </nav>
        <span>© {new Date().getFullYear()} Plinth</span>
      </div>
    </footer>
  );
}
