import Link from "next/link";
import { login } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-sm animate-rise">
        <Link href="/" className="font-display mb-10 block text-xl font-semibold tracking-tight">
          Plinth
        </Link>

        <h1 className="font-display mb-1 text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mb-8 text-sm text-[var(--muted)]">
          Sign in to pick up your saved sets.
        </p>

        {error && (
          <p className="mb-5 rounded-md border border-[var(--terracotta)]/40 bg-[var(--terracotta)]/10 px-4 py-3 text-sm text-[var(--terracotta)]">
            {error}
          </p>
        )}

        <form action={login} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@studio.com" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Log in
          </Button>
        </form>

        <p className="mt-6 text-sm text-[var(--muted)]">
          New to Plinth?{" "}
          <Link href="/signup" className="font-medium text-[var(--ink)] underline underline-offset-4">
            Create an account
          </Link>
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Or just{" "}
          <Link href="/app" className="font-medium text-[var(--ink)] underline underline-offset-4">
            open the studio
          </Link>{" "}
          — no account needed to start.
        </p>
      </div>
    </div>
  );
}
