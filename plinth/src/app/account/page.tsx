import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import { logout } from "@/app/auth/actions";
import { saveAnthropicKey } from "@/app/account/actions";
import { PLANS, planFor } from "@/lib/plans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = { title: "Account" };

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; keySaved?: string; error?: string }>;
}) {
  const { success, keySaved, error } = await searchParams;
  const session = await getSessionUser();
  if (!session) redirect("/login");
  const user = getUserById(session.id);
  if (!user) redirect("/login");

  const plan = planFor(user.plan);
  const isPro = plan.name === "Pro";

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <header className="border-b border-[var(--line)]">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-lg font-semibold tracking-tight">
            Plinth
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/app" className="text-[var(--ink-soft)] hover:text-[var(--ink)]">
              Studio
            </Link>
            <Link href="/history" className="text-[var(--ink-soft)] hover:text-[var(--ink)]">
              History
            </Link>
            <form action={logout}>
              <button className="text-[var(--muted)] hover:text-[var(--ink)]">Log out</button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-6 py-10">
        {success && (
          <p className="rounded-md border border-[var(--spruce)]/40 bg-[var(--spruce)]/10 px-4 py-3 text-sm text-[var(--spruce)]">
            You&apos;re on Pro. Unlimited sets, every device, no watermark. It can
            take a few seconds to reflect — refresh if needed.
          </p>
        )}
        {keySaved && (
          <p className="rounded-md border border-[var(--spruce)]/40 bg-[var(--spruce)]/10 px-4 py-3 text-sm text-[var(--spruce)]">
            API key saved.
          </p>
        )}
        {error && (
          <p className="rounded-md border border-[var(--terracotta)]/40 bg-[var(--terracotta)]/10 px-4 py-3 text-sm text-[var(--terracotta)]">
            {error}
          </p>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <Badge tone={isPro ? "brass" : "neutral"}>{plan.name}</Badge>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-[var(--muted)]">
              Signed in as <span className="font-medium text-[var(--ink)]">{user.email}</span>
            </p>

            {isPro ? (
              <form action="/api/stripe/portal" method="POST">
                <Button type="submit" variant="secondary">
                  Manage subscription
                </Button>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Update card, download invoices, or cancel via Stripe.
                </p>
              </form>
            ) : (
              <form action="/api/stripe/checkout" method="POST">
                <Button type="submit">Upgrade to Pro — {PLANS.pro.priceLabel}</Button>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Unlimited sets, every device, no watermark. Cancel any time.
                </p>
              </form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Headline Assist</CardTitle>
            {!isPro && <Badge tone="brass">Pro</Badge>}
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-[var(--muted)]">
              Headline Assist calls the Anthropic API directly with your own
              key — Plinth never sees your prompts or stores them anywhere but
              this field.
            </p>
            <form action={saveAnthropicKey} className="space-y-3">
              <div>
                <Label htmlFor="anthropic_api_key">Anthropic API key</Label>
                <Input
                  id="anthropic_api_key"
                  name="anthropic_api_key"
                  type="password"
                  placeholder={user.anthropic_api_key ? "•••••••••••••••••••• (saved)" : "sk-ant-…"}
                />
              </div>
              <Button type="submit" variant="secondary" size="sm">
                Save key
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
