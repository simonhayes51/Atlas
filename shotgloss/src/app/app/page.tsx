import { createClient } from "@/lib/supabase/server";
import { planFor } from "@/lib/plans";
import { Editor } from "@/components/editor";

export const metadata = { title: "Editor" };

// Server wrapper: resolves auth + plan, hands the client editor its limits.
export default async function EditorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let plan = planFor(null);
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();
    plan = planFor(profile?.plan);
  }

  return (
    <Editor
      isLoggedIn={Boolean(user)}
      isPro={plan.name === "Pro"}
      maxExportScale={plan.maxExportScale}
      watermark={plan.watermark}
    />
  );
}
