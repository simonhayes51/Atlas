import Link from "next/link";

export const metadata = { title: "Thanks" };

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ over?: string }>;
}) {
  const { over } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      {over ? (
        <>
          <h1 className="text-3xl font-bold text-zinc-900">
            This form is temporarily unavailable
          </h1>
          <p className="mt-3 max-w-md text-zinc-600">
            It has reached its monthly submission limit. Please try again later
            or contact the site owner directly.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-zinc-900">Thank you!</h1>
          <p className="mt-3 max-w-md text-zinc-600">
            Your message has been sent. You can close this page now.
          </p>
        </>
      )}
      <Link
        href="/"
        className="mt-8 text-sm font-medium text-zinc-500 underline-offset-4 hover:text-zinc-900 hover:underline"
      >
        Powered by FormSink — forms for static sites
      </Link>
    </div>
  );
}
