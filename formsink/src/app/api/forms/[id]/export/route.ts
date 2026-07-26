import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// CSV export of a form's submissions. Auth + ownership enforced by RLS:
// the user-scoped client simply can't see other people's forms.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: form } = await supabase
    .from("forms")
    .select("id, name")
    .eq("id", id)
    .single();
  if (!form) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: submissions } = await supabase
    .from("submissions")
    .select("data, created_at")
    .eq("form_id", id)
    .order("created_at", { ascending: true });

  const rows = submissions ?? [];
  const columns = Array.from(
    new Set(rows.flatMap((r) => Object.keys(r.data as Record<string, string>)))
  );

  const header = ["submitted_at", ...columns].map(csvEscape).join(",");
  const body = rows
    .map((r) => {
      const data = r.data as Record<string, string>;
      return [r.created_at, ...columns.map((c) => data[c] ?? "")]
        .map(csvEscape)
        .join(",");
    })
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
