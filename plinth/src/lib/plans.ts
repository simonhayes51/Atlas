export type Plan = "free" | "pro";

export const PLANS: Record<
  Plan,
  {
    name: string;
    watermark: boolean;
    maxSets: number;
    maxFramesPerSet: number;
    allDevices: boolean;
    batchExport: boolean;
    multiLocale: boolean;
    aiAssist: boolean;
    priceLabel: string;
  }
> = {
  free: {
    name: "Free",
    watermark: true,
    maxSets: 1,
    maxFramesPerSet: 3,
    allDevices: false,
    batchExport: false,
    multiLocale: false,
    aiAssist: false,
    priceLabel: "£0",
  },
  pro: {
    name: "Pro",
    watermark: false,
    maxSets: Infinity,
    maxFramesPerSet: Infinity,
    allDevices: true,
    batchExport: true,
    multiLocale: true,
    aiAssist: true,
    priceLabel: "£12/mo",
  },
};

export type PlanLimits = (typeof PLANS)[Plan];

export function planFor(plan: string | null | undefined): PlanLimits {
  return PLANS[plan === "pro" ? "pro" : "free"];
}
