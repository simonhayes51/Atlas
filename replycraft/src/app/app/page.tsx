import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import {
  countGenerationsThisMonth,
  getUserById,
  listRecentGenerations,
} from "@/lib/db";
import { logout } from "@/app/auth/actions";
import { planFor } from "@/lib/plans";
import { Badge } from "@/components/ui/badge";
import { Generator } from "@/components/generator";
import { HistoryList } from "@/components/history-list";

export const metadata = { title: "Generator" };

export default async function AppPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  const user = getUserById(session.id);
  if (!user) redirect("/login");

  const plan = planFor(user.plan);
  const used = countGenerationsThisMonth(user.id);
  const history = listRecentGenerations(user.id, 20);

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
              {used}/{plan.repliesPerMonth} this month
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
          atLimit={used >= plan.repliesPerMonth}
          isFree={plan.name === "Free"}
        />
        <HistoryList items={history} />
      </main>
    </div>
  );
}
