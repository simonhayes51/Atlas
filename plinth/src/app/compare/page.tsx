import type { Metadata } from "next";
import Link from "next/link";
import { COMPARISONS } from "@/lib/comparisons";

export const metadata: Metadata = {
  title: "Compare — Plinth vs. other screenshot generators",
  description:
    "Honest, detailed comparisons between Plinth and other App Store and Google Play screenshot generators — features, pricing and verdicts.",
};

export default function CompareIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="eyebrow mb-4">Compare</p>
      <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
        How Plinth stacks up
      </h1>
      <p className="mt-5 text-[17px] leading-relaxed text-[var(--ink-soft)]">
        We&apos;d rather point out where another tool genuinely fits better than
        pretend Plinth is the right choice for everyone. Here&apos;s the honest
        breakdown, plus a round-up if you&apos;re still comparing options.
      </p>

      <div className="mt-10 space-y-4">
        <Link
          href="/compare/best-app-store-screenshot-generator"
          className="block rounded-lg border border-[var(--line-strong)] bg-[var(--paper-raised)] p-5 hover:border-[var(--ink)]"
        >
          <p className="font-medium">Best app store screenshot generator, 2026</p>
          <p className="mt-1 text-sm text-[var(--muted)]">A round-up of the tools worth considering</p>
        </Link>
        {COMPARISONS.map((c) => (
          <Link
            key={c.slug}
            href={`/compare/${c.slug}`}
            className="block rounded-lg border border-[var(--line)] p-5 hover:border-[var(--ink)]"
          >
            <p className="font-medium">Plinth vs {c.competitor}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{c.metaDescription}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
