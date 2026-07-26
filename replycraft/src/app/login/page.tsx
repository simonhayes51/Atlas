import Link from "next/link";
import { login } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata = { title: "Log in" };

export default async function LoginPage({
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
          <h1 className="text-lg font-semibold text-zinc-900">Log in</h1>
          {error && (
            <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <form action={login} className="mt-4 space-y-3">
            <Input name="email" type="email" placeholder="you@example.com" required />
            <Input name="password" type="password" placeholder="Password" required />
            <Button className="w-full" type="submit">
              Log in
            </Button>
          </form>
        </div>
        <p className="mt-4 text-center text-sm text-zinc-600">
          No account?{" "}
          <Link href="/signup" className="font-medium text-zinc-900 underline underline-offset-4">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
