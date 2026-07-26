import { getSessionUser } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import { planFor } from "@/lib/plans";
import { Editor } from "@/components/editor";

export const metadata = { title: "Editor" };

// Server wrapper: resolves auth + plan, hands the client editor its limits.
export default async function EditorPage() {
  const session = await getSessionUser();
  const user = session ? getUserById(session.id) : undefined;
  const plan = planFor(user?.plan);

  return (
    <Editor
      isLoggedIn={Boolean(user)}
      isPro={plan.name === "Pro"}
      maxExportScale={plan.maxExportScale}
      watermark={plan.watermark}
    />
  );
}
