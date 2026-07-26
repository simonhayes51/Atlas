import Link from "next/link";
import { signup } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = { title: "Create an account" };

export default async function SignupPage({
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

        <h1 className="font-display mb-1 text-2xl font-semibold tracking-tight">
          Save your work
        </h1>
        <p className="mb-8 text-sm text-[var(--muted)]">
          Free — one set, three frames, no card required.
        </p>

        {error && (
          <p className="mb-5 rounded-md border border-[var(--terracotta)]/40 bg-[var(--terracotta)]/10 px-4 py-3 text-sm text-[var(--terracotta)]">
            {error}
          </p>
        )}

        <form action={signup} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@studio.com" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="At least 6 characters"
            />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-sm text-[var(--muted)]">
          Already have one?{" "}
          <Link href="/login" className="font-medium text-[var(--ink)] underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
