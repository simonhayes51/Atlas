import type { Metadata } from "next";
import Link from "next/link";
import { COMPARISONS } from "@/lib/comparisons";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Best app store screenshot generator (2026 round-up) — Plinth",
  description:
    "An honest round-up of the best App Store and Google Play screenshot generators in 2026, including where Plinth fits and where a template-based tool is the better call.",
  openGraph: {
    title: "Best app store screenshot generator (2026 round-up)",
    description: "An honest round-up of App Store and Google Play screenshot tools in 2026.",
    type: "article",
  },
};

const faqs = [
  {
    q: "Do I need a designer to make good app store screenshots?",
    a: "No. Every tool in this round-up, including Plinth, is built so a solo developer can produce a polished set without design experience — the tools differ mainly in how much of the visual decision-making they make for you versus leave open.",
  },
  {
    q: "What image sizes does the App Store actually require?",
    a: "As of the current App Store Connect requirements, you need at minimum the 6.9\" iPhone size (1320×2868); most listings also include the 6.5\" and 5.5\" sizes and, for universal apps, an iPad size. Google Play asks for a 1080×1920 phone screenshot at minimum. Always confirm against the current App Store Connect / Play Console upload screen before submitting.",
  },
  {
    q: "Is a template-based generator or a from-scratch design tool better?",
    a: "Template-based tools (AppLaunchpad, Shotbot, Previewed) get you to a finished set faster if their gallery already matches your taste. A from-scratch tool like Plinth takes a little longer per set but avoids the 'this looks like every other app in that gallery' problem.",
  },
];

export default function BestAppStoreScreenshotGeneratorPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: base },
        { "@type": "ListItem", position: 2, name: "Compare", item: `${base}/compare` },
        {
          "@type": "ListItem",
          position: 3,
          name: "Best app store screenshot generator",
          item: `${base}/compare/best-app-store-screenshot-generator`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="bg-[var(--paper)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="eyebrow mb-4">
          <Link href="/compare" className="hover:text-[var(--ink)]">
            Compare
          </Link>{" "}
          / Round-up
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Best app store screenshot generator, 2026
        </h1>
        <p className="mt-5 text-[17px] leading-relaxed text-[var(--ink-soft)]">
          There isn&apos;t one right tool — there&apos;s a right tool for how much
          control you want over the result. Here&apos;s how we&apos;d sort the options.
        </p>

        <ol className="mt-10 space-y-8">
          <li className="plinth-card p-6" style={{ borderBottomColor: "var(--brass)" }}>
            <p className="eyebrow mb-1 text-[var(--brass)]">For full design control</p>
            <h2 className="font-display text-xl font-semibold">Plinth</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
              Composable backgrounds, type pairings and device frames rather
              than a fixed theme gallery, exact export sizes for every current
              App Store Connect and Play Console requirement, batch export
              across devices and locales, and an optional real AI headline
              drafting step powered by your own Anthropic key.
            </p>
          </li>
          {COMPARISONS.map((c) => (
            <li key={c.slug} className="plinth-card p-6">
              <p className="eyebrow mb-1">For a template gallery</p>
              <h2 className="font-display text-xl font-semibold">{c.competitor}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{c.summary}</p>
              <Link
                href={`/compare/${c.slug}`}
                className="mt-3 inline-block text-sm font-medium underline underline-offset-4"
              >
                Full Plinth vs {c.competitor} comparison →
              </Link>
            </li>
          ))}
        </ol>

        <section className="mt-12">
          <h2 className="font-display mb-4 text-xl font-semibold">FAQ</h2>
          <div className="divide-y divide-[var(--line)]">
            {faqs.map((f) => (
              <div key={f.q} className="py-4">
                <p className="font-medium">{f.q}</p>
                <p className="mt-1.5 text-sm text-[var(--muted)]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 border-t border-[var(--line)] pt-8">
          <Link href="/app">
            <Button>Try Plinth free</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
