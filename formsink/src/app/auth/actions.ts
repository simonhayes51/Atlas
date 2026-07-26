"use server";

import { redirect } from "next/navigation";
import {
  createSession,
  destroySession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { createUser, getUserByEmail } from "@/lib/db";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = email ? getUserByEmail(email) : undefined;
  if (!user || !verifyPassword(password, user.password_hash)) {
    redirect(`/login?error=${encodeURIComponent("Invalid email or password")}`);
  }

  await createSession(user);
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect(`/signup?error=${encodeURIComponent("Enter a valid email address")}`);
  }
  if (password.length < 6) {
    redirect(
      `/signup?error=${encodeURIComponent("Password must be at least 6 characters")}`
    );
  }
  if (getUserByEmail(email)) {
    redirect(
      `/signup?error=${encodeURIComponent("An account with that email already exists")}`
    );
  }

  const user = createUser(email, hashPassword(password));
  await createSession(user);
  redirect("/dashboard");
}

export async function logout() {
  await destroySession();
  redirect("/");
}
