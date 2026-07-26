import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";
import { PLANS, planFor } from "@/lib/plans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Account" };

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, email, stripe_customer_id")
    .eq("id", user.id)
    .single();
  const plan = planFor(profile?.plan);
  const isPro = plan.name === "Pro";

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-3">
          <Link href="/" className="font-bold tracking-tight">
            ShotGloss
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/app" className="text-zinc-600 hover:text-zinc-900">
              Editor
            </Link>
            <form action={logout}>
              <button className="text-zinc-400 hover:text-zinc-900" type="submit">
                Log out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-4 px-6 py-10">
        {success && (
          <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            You&apos;re on Pro! Watermark is gone and hi-res exports are
            unlocked. It can take a few seconds to show — refresh if needed.
          </p>
        )}

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Account</CardTitle>
            <Badge tone={isPro ? "success" : "neutral"}>{plan.name}</Badge>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-zinc-600">
              Signed in as{" "}
              <span className="font-medium text-zinc-900">
                {profile?.email ?? user.email}
              </span>
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
                  No watermark, exports up to 3840px. Cancel any time.
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
