export type Plan = "free" | "pro";

export const PLANS: Record<
  Plan,
  { name: string; maxForms: number | null; maxSubmissionsPerMonth: number; priceLabel: string }
> = {
  free: {
    name: "Free",
    maxForms: 2,
    maxSubmissionsPerMonth: 50,
    priceLabel: "£0",
  },
  pro: {
    name: "Pro",
    maxForms: null, // unlimited
    maxSubmissionsPerMonth: 2000,
    priceLabel: "£9/mo",
  },
};

export function planFor(plan: string | null | undefined) {
  return PLANS[plan === "pro" ? "pro" : "free"];
}
