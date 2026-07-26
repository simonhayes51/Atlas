export type Plan = "free" | "pro";

export const PLANS: Record<
  Plan,
  { name: string; watermark: boolean; maxExportScale: number; priceLabel: string }
> = {
  free: {
    name: "Free",
    watermark: true,
    maxExportScale: 1, // 1280px wide
    priceLabel: "£0",
  },
  pro: {
    name: "Pro",
    watermark: false,
    maxExportScale: 3, // up to 3840px wide
    priceLabel: "£5/mo",
  },
};

export function planFor(plan: string | null | undefined) {
  return PLANS[plan === "pro" ? "pro" : "free"];
}
