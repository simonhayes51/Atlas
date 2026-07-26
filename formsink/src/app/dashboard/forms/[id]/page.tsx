import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getUserForm, listSubmissions } from "@/lib/db";
import { deleteForm, updateForm } from "@/app/dashboard/actions";
import { siteUrl } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function FormDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSessionUser();
  if (!session) redirect("/login");

  const form = getUserForm(session.id, id);
  if (!form) notFound();

  const submissions = listSubmissions(id, 100).map((s) => ({
    ...s,
    fields: JSON.parse(s.data) as Record<string, string>,
  }));

  const endpoint = `${siteUrl()}/f/${form.id}`;
  const snippet = `<form action="${endpoint}" method="POST">
  <input type="email" name="email" required>
  <textarea name="message"></textarea>
  <!-- honeypot: leave this in, keep it hidden -->
  <input type="text" name="_gotcha" style="display:none">
  <button type="submit">Send</button>
</form>`;

  // Union of keys across recent submissions → table columns.
  const columns = Array.from(
    new Set(submissions.flatMap((s) => Object.keys(s.fields)))
  ).slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">{form.name}</h1>
          <p className="mt-1 font-mono text-sm text-zinc-500">{endpoint}</p>
        </div>
        <form action={deleteForm}>
          <input type="hidden" name="id" value={form.id} />
          <Button variant="danger" type="submit">
            Delete form
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-zinc-600">
            Paste this into any HTML page. Submissions appear below and land in
            your inbox.
          </p>
          <pre className="overflow-x-auto rounded-md bg-zinc-950 p-4 text-xs leading-5 text-zinc-100">
            <code>{snippet}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateForm} className="space-y-4">
            <input type="hidden" name="id" value={form.id} />
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                name="notify"
                defaultChecked={form.notify === 1}
                className="h-4 w-4 rounded border-zinc-300"
              />
              Email me each submission
            </label>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Redirect after submit (optional)
              </label>
              <Input
                name="redirect_url"
                type="url"
                placeholder="https://yoursite.com/thanks"
                defaultValue={form.redirect_url ?? ""}
                className="max-w-md"
              />
            </div>
            <Button type="submit" variant="outline">
              Save settings
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>
            Submissions{" "}
            <span className="font-normal text-zinc-400">
              (latest {submissions.length})
            </span>
          </CardTitle>
          <a
            href={`/api/forms/${form.id}/export`}
            className="text-sm font-medium text-zinc-600 underline underline-offset-4 hover:text-zinc-900"
          >
            Export CSV
          </a>
        </CardHeader>
        <CardContent className="px-0">
          {submissions.length === 0 ? (
            <p className="px-5 py-6 text-center text-sm text-zinc-500">
              No submissions yet. Send a test one with the snippet above.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 text-left text-xs uppercase tracking-wide text-zinc-400">
                    <th className="px-5 py-2 font-medium">Received</th>
                    {columns.map((c) => (
                      <th key={c} className="px-5 py-2 font-medium">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s) => (
                    <tr key={s.id} className="border-b border-zinc-50">
                      <td className="whitespace-nowrap px-5 py-3 text-zinc-500">
                        {new Date(`${s.created_at}Z`).toLocaleString("en-GB", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      {columns.map((c) => (
                        <td
                          key={c}
                          className="max-w-xs truncate px-5 py-3 text-zinc-800"
                        >
                          {s.fields[c] ?? ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
