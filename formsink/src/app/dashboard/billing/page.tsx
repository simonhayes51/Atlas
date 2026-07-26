import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PLANS, planFor } from "@/lib/plans";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Billing" };

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ limit?: string; success?: string }>;
}) {
  const { limit, success } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, stripe_customer_id")
    .eq("id", user.id)
    .single();
  const plan = planFor(profile?.plan);
  const isPro = plan.name === "Pro";

  return (
    <div className="mx-auto max-w-lg space-y-4">
      {limit === "forms" && (
        <p className="rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You&apos;ve hit the free plan&apos;s form limit. Upgrade for unlimited
          forms.
        </p>
      )}
      {success && (
        <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          You&apos;re on Pro! It can take a few seconds for the upgrade to show
          here — refresh if needed.
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm text-zinc-600">
            Current plan:{" "}
            <span className="font-semibold text-zinc-900">{plan.name}</span>
            {" · "}
            {plan.maxForms === null ? "Unlimited forms" : `${plan.maxForms} forms`}
            {" · "}
            {plan.maxSubmissionsPerMonth.toLocaleString()} submissions / month
          </p>

          {isPro ? (
            <form action="/api/stripe/portal" method="POST">
              <Button type="submit" variant="outline">
                Manage subscription
              </Button>
              <p className="mt-2 text-xs text-zinc-500">
                Update card, download invoices, or cancel via Stripe.
              </p>
            </form>
          ) : (
            <form action="/api/stripe/checkout" method="POST">
              <Button type="submit">
                Upgrade to Pro — {PLANS.pro.priceLabel}
              </Button>
              <p className="mt-2 text-xs text-zinc-500">
                Unlimited forms, {PLANS.pro.maxSubmissionsPerMonth.toLocaleString()}{" "}
                submissions a month. Cancel any time.
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
