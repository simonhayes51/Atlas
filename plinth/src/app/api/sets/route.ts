import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { countSets, createSet, getSet, getUserById, listSets, updateSet } from "@/lib/db";
import { planFor } from "@/lib/plans";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  return NextResponse.json({ sets: listSets(session.id) });
}

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const user = getUserById(session.id);
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const body = (await request.json()) as {
    id?: string | null;
    name?: string;
    data?: string;
    thumbnail?: string | null;
  };
  if (!body.data) return NextResponse.json({ error: "Missing set data." }, { status: 400 });

  const plan = planFor(user.plan);
  const name = (body.name ?? "Untitled set").slice(0, 120);

  if (body.id) {
    const existing = getSet(user.id, body.id);
    if (!existing) return NextResponse.json({ error: "Set not found." }, { status: 404 });
    const updated = updateSet(user.id, body.id, { name, data: body.data, thumbnail: body.thumbnail ?? null });
    return NextResponse.json({ id: updated!.id });
  }

  if (countSets(user.id) >= plan.maxSets) {
    return NextResponse.json(
      { error: `Free is capped at ${plan.maxSets} saved set. Upgrade to Pro for unlimited sets.` },
      { status: 403 }
    );
  }

  const created = createSet(user.id, name, body.data, body.thumbnail ?? null);
  return NextResponse.json({ id: created.id });
}
