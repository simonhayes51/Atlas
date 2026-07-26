import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { listSets } from "@/lib/db";
import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteSetButton } from "@/components/set-card-actions";

export const metadata = { title: "History" };

export default async function HistoryPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  const sets = listSets(session.id);

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <header className="border-b border-[var(--line)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-lg font-semibold tracking-tight">
            Plinth
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/app" className="text-[var(--ink-soft)] hover:text-[var(--ink)]">
              Studio
            </Link>
            <Link href="/account" className="text-[var(--ink-soft)] hover:text-[var(--ink)]">
              Account
            </Link>
            <form action={logout}>
              <button className="text-[var(--muted)] hover:text-[var(--ink)]">Log out</button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold tracking-tight">Your sets</h1>
          <Link href="/app">
            <Button size="sm">New set</Button>
          </Link>
        </div>

        {sets.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="font-display text-lg font-medium">No sets yet</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--muted)]">
              Everything you save from the studio shows up here — screenshot data
              and a small preview only, never the original image files.
            </p>
            <Link href="/app" className="mt-6 inline-block">
              <Button>Open the studio</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sets.map((s) => (
              <Card key={s.id} className="overflow-hidden">
                <div className="flex aspect-[4/3] items-center justify-center bg-[var(--paper-raised)]">
                  {s.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element -- data-URL thumbnail, not an optimizable remote asset
                    <img src={s.thumbnail} alt={s.name} className="h-full w-auto object-contain py-4" />
                  ) : (
                    <span className="text-xs text-[var(--muted)]">No preview</span>
                  )}
                </div>
                <CardContent className="space-y-3">
                  <div>
                    <p className="truncate font-medium">{s.name}</p>
                    <p className="text-xs text-[var(--muted)]">
                      Updated {new Date(s.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/app?set=${s.id}`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full">
                        Open
                      </Button>
                    </Link>
                    <DeleteSetButton id={s.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
