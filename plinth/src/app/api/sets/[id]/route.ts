import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { deleteSet, getSet } from "@/lib/db";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await params;

  const existing = getSet(session.id, id);
  if (!existing) return NextResponse.json({ error: "Set not found." }, { status: 404 });

  deleteSet(session.id, id);
  return NextResponse.json({ ok: true });
}
