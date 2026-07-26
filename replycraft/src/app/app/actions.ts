"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateReviewReply } from "@/lib/claude";
import { planFor, TONES } from "@/lib/plans";

export type GenerateState = {
  reply?: string;
  error?: string;
};

export async function generateReply(
  _prev: GenerateState,
  formData: FormData
): Promise<GenerateState> {
  const review = String(formData.get("review") ?? "").trim();
  const businessName = String(formData.get("business_name") ?? "").trim();
  const tone = String(formData.get("tone") ?? "Professional");
  const context = String(formData.get("context") ?? "").trim();

  if (!review || !businessName) {
    return { error: "Paste a review and enter your business name." };
  }
  if (review.length > 5000) {
    return { error: "That review is too long (5,000 character limit)." };
  }
  if (!(TONES as readonly string[]).includes(tone)) {
    return { error: "Pick a valid tone." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Please log in again." };
  }

  // Enforce the monthly limit before spending API credits.
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();
  const plan = planFor(profile?.plan);

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);
  const { count } = await supabase
    .from("generations")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", monthStart.toISOString());

  if ((count ?? 0) >= plan.repliesPerMonth) {
    return {
      error:
        plan.name === "Free"
          ? "You've used all 10 free replies this month. Upgrade to Pro for 500/month."
          : "You've reached this month's reply limit.",
    };
  }

  let reply: string;
  try {
    reply = await generateReviewReply({ review, businessName, tone, context });
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "Generation failed. Please try again.",
    };
  }

  await supabase.from("generations").insert({
    user_id: user.id,
    review,
    reply,
    tone,
    business_name: businessName,
  });

  revalidatePath("/app");
  return { reply };
}
