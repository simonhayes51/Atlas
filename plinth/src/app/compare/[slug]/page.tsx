import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COMPARISONS, comparisonBySlug } from "@/lib/comparisons";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = comparisonBySlug(slug);
  if (!c) return {};
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    openGraph: { title: c.metaTitle, description: c.metaDescription, type: "article" },
    alternates: { canonical: `/compare/${c.slug}` },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = comparisonBySlug(slug);
  if (!c) notFound();

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: base },
        { "@type": "ListItem", position: 2, name: "Compare", item: `${base}/compare` },
        { "@type": "ListItem", position: 3, name: c.metaTitle, item: `${base}/compare/${c.slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Plinth",
      description: c.metaDescription,
      brand: { "@type": "Brand", name: "Plinth" },
      offers: [
        { "@type": "Offer", name: "Free", price: "0", priceCurrency: "GBP" },
        { "@type": "Offer", name: "Pro", price: "12", priceCurrency: "GBP" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: c.faqs.map((f) => ({
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
          / {c.competitor}
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Plinth vs {c.competitor}
        </h1>
        <p className="mt-5 text-[17px] leading-relaxed text-[var(--ink-soft)]">{c.summary}</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="plinth-card p-6">
            <h2 className="font-display mb-3 font-semibold">{c.competitor}</h2>
            <p className="eyebrow mb-2 text-[var(--spruce)]">Strengths</p>
            <ul className="mb-4 space-y-1.5 text-sm text-[var(--ink-soft)]">
              {c.competitorStrengths.map((s) => (
                <li key={s}>· {s}</li>
              ))}
            </ul>
            <p className="eyebrow mb-2 text-[var(--terracotta)]">Weaknesses</p>
            <ul className="space-y-1.5 text-sm text-[var(--ink-soft)]">
              {c.competitorWeaknesses.map((s) => (
                <li key={s}>· {s}</li>
              ))}
            </ul>
          </div>
          <div className="plinth-card p-6" style={{ borderBottomColor: "var(--brass)" }}>
            <h2 className="font-display mb-3 font-semibold">Plinth</h2>
            <p className="eyebrow mb-2 text-[var(--spruce)]">Strengths</p>
            <ul className="mb-4 space-y-1.5 text-sm text-[var(--ink-soft)]">
              {c.plinthStrengths.map((s) => (
                <li key={s}>· {s}</li>
              ))}
            </ul>
            <p className="eyebrow mb-2 text-[var(--terracotta)]">Weaknesses</p>
            <ul className="space-y-1.5 text-sm text-[var(--ink-soft)]">
              {c.plinthWeaknesses.map((s) => (
                <li key={s}>· {s}</li>
              ))}
            </ul>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="font-display mb-2 text-xl font-semibold">Pricing</h2>
          <p className="text-sm leading-relaxed text-[var(--ink-soft)]">{c.pricingNote}</p>
        </section>

        <section className="mt-10 rounded-lg border border-[var(--line)] bg-[var(--paper-raised)] p-6">
          <h2 className="font-display mb-2 text-xl font-semibold">Verdict</h2>
          <p className="text-sm leading-relaxed text-[var(--ink-soft)]">{c.verdict}</p>
        </section>

        <section className="mt-10">
          <h2 className="font-display mb-4 text-xl font-semibold">FAQ</h2>
          <div className="divide-y divide-[var(--line)]">
            {c.faqs.map((f) => (
              <div key={f.q} className="py-4">
                <p className="font-medium">{f.q}</p>
                <p className="mt-1.5 text-sm text-[var(--muted)]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-[var(--line)] pt-8">
          <Link href="/app">
            <Button>Try Plinth free</Button>
          </Link>
          <Link href="/compare" className="text-sm text-[var(--ink-soft)] underline underline-offset-4">
            See all comparisons
          </Link>
        </div>
      </div>
    </div>
  );
}
