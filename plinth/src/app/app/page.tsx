import { getSessionUser } from "@/lib/auth";
import { getUserById, getSet } from "@/lib/db";
import { planFor } from "@/lib/plans";
import { Studio } from "@/components/studio";
import type { Frame } from "@/lib/render";

export const metadata = { title: "Studio" };

export default async function StudioPage({
  searchParams,
}: {
  searchParams: Promise<{ set?: string }>;
}) {
  const { set: setId } = await searchParams;
  const session = await getSessionUser();
  const user = session ? getUserById(session.id) : undefined;
  const plan = planFor(user?.plan);

  let initialSet = null;
  if (user && setId) {
    const row = getSet(user.id, setId);
    if (row) {
      initialSet = {
        id: row.id,
        name: row.name,
        frames: JSON.parse(row.data) as Frame[],
      };
    }
  }

  return <Studio isLoggedIn={Boolean(user)} plan={plan} initialSet={initialSet} />;
}
