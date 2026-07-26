import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";
import { planFor } from "@/lib/plans";
import { Badge } from "@/components/ui/badge";
import { Generator } from "@/components/generator";
import { HistoryList } from "@/components/history-list";

export const metadata = { title: "Generator" };

export default async function AppPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();
  const plan = planFor(profile?.plan);

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const [{ count: used }, { data: history }] = await Promise.all([
    supabase
      .from("generations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", monthStart.toISOString()),
    supabase
      .from("generations")
      .select("id, review, reply, tone, business_name, created_at")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-bold tracking-tight">
              ReplyCraft
            </Link>
            <Badge tone={plan.name === "Pro" ? "success" : "neutral"}>
              {plan.name}
            </Badge>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <span className="text-zinc-500">
              {used ?? 0}/{plan.repliesPerMonth} this month
            </span>
            <Link href="/account" className="text-zinc-600 hover:text-zinc-900">
              Account
            </Link>
            <form action={logout}>
              <button className="text-zinc-400 hover:text-zinc-900" type="submit">
                Log out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-8 px-6 py-8">
        <Generator
          atLimit={(used ?? 0) >= plan.repliesPerMonth}
          isFree={plan.name === "Free"}
        />
        <HistoryList items={history ?? []} />
      </main>
    </div>
  );
}
