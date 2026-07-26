"use server";

import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { setAnthropicKey } from "@/lib/db";

export async function saveAnthropicKey(formData: FormData) {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  const key = String(formData.get("anthropic_api_key") ?? "").trim();
  setAnthropicKey(session.id, key || null);
  redirect("/account?keySaved=1");
}
