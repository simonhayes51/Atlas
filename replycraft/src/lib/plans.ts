export type Plan = "free" | "pro";

export const PLANS: Record<
  Plan,
  { name: string; repliesPerMonth: number; priceLabel: string }
> = {
  free: {
    name: "Free",
    repliesPerMonth: 10,
    priceLabel: "£0",
  },
  pro: {
    name: "Pro",
    repliesPerMonth: 500,
    priceLabel: "£9/mo",
  },
};

export function planFor(plan: string | null | undefined) {
  return PLANS[plan === "pro" ? "pro" : "free"];
}

export const TONES = ["Professional", "Friendly", "Apologetic"] as const;
export type Tone = (typeof TONES)[number];
