import Link from "next/link";
import { signup } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata = { title: "Sign up" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 block text-center text-lg font-bold">
          ReplyCraft
        </Link>
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-zinc-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Free plan — no card required.
          </p>
          {error && (
            <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <form action={signup} className="mt-4 space-y-3">
            <Input name="email" type="email" placeholder="you@example.com" required />
            <Input
              name="password"
              type="password"
              placeholder="Password (min 6 characters)"
              minLength={6}
              required
            />
            <Button className="w-full" type="submit">
              Sign up
            </Button>
          </form>
        </div>
        <p className="mt-4 text-center text-sm text-zinc-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-zinc-900 underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
