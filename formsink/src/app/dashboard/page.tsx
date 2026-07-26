import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import {
  countSubmissionsThisMonth,
  getUserById,
  listFormsWithCounts,
} from "@/lib/db";
import { planFor } from "@/lib/plans";
import { createForm } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  const user = getUserById(session.id);
  if (!user) redirect("/login");

  const plan = planFor(user.plan);
  const forms = listFormsWithCounts(user.id);
  const used = countSubmissionsThisMonth(user.id);
  const limit = plan.maxSubmissionsPerMonth;
  const atFormLimit = plan.maxForms !== null && forms.length >= plan.maxForms;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">Your forms</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {used} / {limit} submissions used this month
          </p>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
        <div
          className="h-full rounded-full bg-zinc-900"
          style={{ width: `${Math.min(100, (used / limit) * 100)}%` }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create a form</CardTitle>
        </CardHeader>
        <CardContent>
          {atFormLimit ? (
            <p className="text-sm text-zinc-600">
              The free plan includes {plan.maxForms} forms.{" "}
              <Link
                href="/dashboard/billing"
                className="font-medium text-zinc-900 underline underline-offset-4"
              >
                Upgrade to Pro
              </Link>{" "}
              for unlimited forms.
            </p>
          ) : (
            <form action={createForm} className="flex gap-3">
              <Input
                name="name"
                placeholder="e.g. Portfolio contact form"
                required
                className="max-w-sm"
              />
              <Button type="submit">Create form</Button>
            </form>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {forms.map((form) => (
          <Link
            key={form.id}
            href={`/dashboard/forms/${form.id}`}
            className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-5 py-4 shadow-sm transition-colors hover:border-zinc-400"
          >
            <div>
              <p className="font-medium text-zinc-900">{form.name}</p>
              <p className="mt-0.5 font-mono text-xs text-zinc-500">
                /f/{form.id}
              </p>
            </div>
            <span className="text-sm text-zinc-500">
              {form.submission_count} submission
              {form.submission_count === 1 ? "" : "s"}
            </span>
          </Link>
        ))}
        {forms.length === 0 && (
          <p className="py-8 text-center text-sm text-zinc-500">
            No forms yet — create your first one above.
          </p>
        )}
      </div>
    </div>
  );
}
