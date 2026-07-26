"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import {
  countForms,
  createForm as dbCreateForm,
  deleteForm as dbDeleteForm,
  getUserById,
  updateForm as dbUpdateForm,
} from "@/lib/db";
import { planFor } from "@/lib/plans";

export async function createForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const session = await getSessionUser();
  if (!session) redirect("/login");

  // Enforce the plan's form limit.
  const user = getUserById(session.id);
  const plan = planFor(user?.plan);
  if (plan.maxForms !== null && countForms(session.id) >= plan.maxForms) {
    redirect("/dashboard/billing?limit=forms");
  }

  const form = dbCreateForm(session.id, name);
  revalidatePath("/dashboard");
  redirect(`/dashboard/forms/${form.id}`);
}

export async function updateForm(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const session = await getSessionUser();
  if (!session) redirect("/login");

  dbUpdateForm(session.id, id, {
    notify: formData.get("notify") === "on",
    redirect_url: String(formData.get("redirect_url") ?? "").trim() || null,
  });
  revalidatePath(`/dashboard/forms/${id}`);
}

export async function deleteForm(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const session = await getSessionUser();
  if (!session) redirect("/login");

  dbDeleteForm(session.id, id);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
