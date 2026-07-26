import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getUserForm, listAllSubmissions } from "@/lib/db";

// CSV export of a form's submissions. Ownership enforced by the
// user-scoped lookup — other people's forms simply aren't found.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = getUserForm(session.id, id);
  if (!form) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const rows = listAllSubmissions(id).map((r) => ({
    created_at: r.created_at,
    fields: JSON.parse(r.data) as Record<string, string>,
  }));
  const columns = Array.from(
    new Set(rows.flatMap((r) => Object.keys(r.fields)))
  );

  const header = ["submitted_at", ...columns].map(csvEscape).join(",");
  const body = rows
    .map((r) =>
      [r.created_at, ...columns.map((c) => r.fields[c] ?? "")]
        .map(csvEscape)
        .join(",")
    )
    .join("\n");

  const filename = `${form.name.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase()}-submissions.csv`;

  return new NextResponse(`${header}\n${body}\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}
