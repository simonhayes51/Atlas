import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import { logout } from "@/app/auth/actions";
import { planFor } from "@/lib/plans";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Dashboard" };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  const user = getUserById(session.id);
  if (!user) redirect("/login");

  const plan = planFor(user.plan);

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="font-bold tracking-tight">
              FormSink
            </Link>
            <Badge tone={plan.name === "Pro" ? "success" : "neutral"}>
              {plan.name}
            </Badge>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-zinc-600 hover:text-zinc-900">
              Forms
            </Link>
            <Link
              href="/dashboard/billing"
              className="text-zinc-600 hover:text-zinc-900"
            >
              Billing
            </Link>
            <form action={logout}>
              <button className="text-zinc-400 hover:text-zinc-900" type="submit">
                Log out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
    </div>
  );
}
