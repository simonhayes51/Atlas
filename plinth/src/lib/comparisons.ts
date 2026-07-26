export type Comparison = {
  slug: string;
  competitor: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  competitorStrengths: string[];
  competitorWeaknesses: string[];
  plinthStrengths: string[];
  plinthWeaknesses: string[];
  pricingNote: string;
  verdict: string;
  faqs: { q: string; a: string }[];
};

export const COMPARISONS: Comparison[] = [
  {
    slug: "applaunchpad-alternative",
    competitor: "AppLaunchpad",
    metaTitle: "AppLaunchpad alternative — Plinth",
    metaDescription:
      "Comparing Plinth to AppLaunchpad for App Store and Google Play screenshot generation: templates vs. a from-scratch design system, localisation workflow, and pricing.",
    summary:
      "AppLaunchpad's strength is breadth — a large gallery of pre-built screenshot themes you drop text into and go. Plinth takes the opposite bet: a small set of composable building blocks (device frame, background, type) you assemble yourself, so the result doesn't read as a template.",
    competitorStrengths: [
      "Large library of pre-designed themes to start from",
      "Established product with a long track record in the App Store screenshot space",
      "Handles marketing copy translation workflows across many locales",
    ],
    competitorWeaknesses: [
      "Template-first workflow means many submissions end up looking similar",
      "Customisation beyond the template's own knobs is limited",
    ],
    plinthStrengths: [
      "Composable design system — background, type and device frame are independent choices, not a fixed theme",
      "Exact App Store Connect / Play Console pixel dimensions per preset, no manual resizing",
      "Real AI headline drafting via your own Anthropic key, not canned copy blocks",
      "Renders entirely client-side — screenshots never leave your browser unless you choose to save",
    ],
    plinthWeaknesses: [
      "Fewer pre-made themes — you build the look rather than pick one off the shelf",
      "Newer product, smaller preset library for now",
    ],
    pricingNote:
      "AppLaunchpad has historically priced around a template-gallery subscription model — check their current site for exact figures. Plinth is free for a single set of up to 3 frames, then £12/mo for unlimited sets, every device size and batch export.",
    verdict:
      "Pick AppLaunchpad if you want a theme gallery and are happy inside its presets. Pick Plinth if you want full control over the look and a workflow built around exact export sizes and per-locale copy.",
    faqs: [
      {
        q: "Can I import an existing AppLaunchpad design into Plinth?",
        a: "Not automatically — Plinth's frames are built from device, background and copy rather than a theme file. Recreating a set from scratch typically takes a few minutes per frame.",
      },
      {
        q: "Does Plinth support the same store locales?",
        a: "Yes. Add a headline and subheadline per locale on each frame, then batch export writes one folder per language.",
      },
    ],
  },
  {
    slug: "shotbot-alternative",
    competitor: "Shotbot",
    metaTitle: "Shotbot alternative — Plinth",
    metaDescription:
      "Comparing Plinth to Shotbot for generating App Store and Google Play screenshots: workflow speed, device coverage, and batch export.",
    summary:
      "Shotbot is built for speed — pick a layout, drop in a capture, export. Plinth asks for one extra minute of setup (background, type pairing, per-locale copy) in exchange for a set that's fully yours to reuse across every future release.",
    competitorStrengths: [
      "Very fast for a single one-off screenshot",
      "Simple, low-friction interface",
    ],
    competitorWeaknesses: [
      "Limited device size coverage compared to the full App Store Connect / Play Console requirement list",
      "No built-in multi-locale copy handling",
    ],
    plinthStrengths: [
      "Covers every current App Store and Google Play required export size in one preset list",
      "Saved sets persist — update copy or swap a screenshot without rebuilding the layout",
      "Batch zip export across every device and language in one click on Pro",
    ],
    plinthWeaknesses: [
      "A single quick screenshot takes slightly longer to set up than a one-shot tool",
    ],
    pricingNote:
      "Shotbot's pricing has generally sat at the lower end for single-use exports — check their current site for exact figures. Plinth's free tier covers a full 3-frame set before you'd need Pro.",
    verdict:
      "Shotbot is fine for a single quick export you'll never touch again. Plinth is built for developers shipping updates regularly, where the set gets reused release after release.",
    faqs: [
      {
        q: "Is Plinth slower than Shotbot for a single screenshot?",
        a: "Marginally — the first frame takes a little longer because you're setting a background and font pairing. Every frame after that reuses the same look instantly.",
      },
      {
        q: "Does Plinth do one-off exports without an account?",
        a: "Yes, the studio at /app is open with no signup — export a single frame free, any time.",
      },
    ],
  },
  {
    slug: "previewed-alternative",
    competitor: "Previewed",
    metaTitle: "Previewed alternative — Plinth",
    metaDescription:
      "Comparing Plinth to Previewed for App Store and Google Play screenshot sets: scope, pricing model, and export accuracy.",
    summary:
      "Previewed bundles screenshot generation into a broader app-marketing-asset toolkit. Plinth is deliberately narrower — it does one job, generating store-accurate screenshot sets, and tries to do it better than a bundled feature can.",
    competitorStrengths: [
      "Bundles screenshots alongside other marketing asset types in one subscription",
      "Established template gallery",
    ],
    competitorWeaknesses: [
      "Screenshot-specific features can feel secondary to the broader toolkit",
    ],
    plinthStrengths: [
      "Single-purpose focus on store screenshots — every feature serves that one workflow",
      "Real Anthropic-powered headline drafting rather than static copy templates",
      "Transparent, single-tier Pro pricing rather than a bundled suite price",
    ],
    plinthWeaknesses: [
      "No app preview video generation or wider marketing asset suite",
    ],
    pricingNote:
      "Previewed generally prices as part of a broader marketing-suite subscription — check their current site for exact figures. Plinth charges only for the screenshot workflow: free for one set, £12/mo for everything else.",
    verdict:
      "If you need preview videos and a full marketing asset suite in one subscription, Previewed's bundle may suit you better. If screenshots are the job, Plinth is built around nothing else.",
    faqs: [
      {
        q: "Does Plinth generate App Store preview videos?",
        a: "No — Plinth is focused entirely on static screenshot sets. If you need preview video generation, that's outside its scope today.",
      },
    ],
  },
];

export function comparisonBySlug(slug: string) {
  return COMPARISONS.find((c) => c.slug === slug);
}
