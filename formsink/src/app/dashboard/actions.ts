"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { planFor } from "@/lib/plans";

export async function createForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Enforce the plan's form limit.
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();
  const plan = planFor(profile?.plan);

  if (plan.maxForms !== null) {
    const { count } = await supabase
      .from("forms")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    if ((count ?? 0) >= plan.maxForms) {
      redirect("/dashboard/billing?limit=forms");
    }
  }

  const { data: form } = await supabase
    .from("forms")
    .insert({ user_id: user.id, name })
    .select("id")
    .single();

  revalidatePath("/dashboard");
  if (form) redirect(`/dashboard/forms/${form.id}`);
}

export async function updateForm(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();

  await supabase
    .from("forms")
    .update({
      notify: formData.get("notify") === "on",
      redirect_url: String(formData.get("redirect_url") ?? "").trim() || null,
    })
    .eq("id", id); // RLS restricts to the owner

  revalidatePath(`/dashboard/forms/${id}`);
}

export async function deleteForm(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("forms").delete().eq("id", id); // RLS restricts to the owner
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
