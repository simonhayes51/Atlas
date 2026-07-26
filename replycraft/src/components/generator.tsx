"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { generateReply, type GenerateState } from "@/app/app/actions";
import { TONES } from "@/lib/plans";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function Generator({
  atLimit,
  isFree,
}: {
  atLimit: boolean;
  isFree: boolean;
}) {
  const [state, formAction, pending] = useActionState<GenerateState, FormData>(
    generateReply,
    {}
  );
  const [tone, setTone] = useState<string>(TONES[0]);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!state.reply) return;
    await navigator.clipboard.writeText(state.reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Generate a review response</CardTitle>
        </CardHeader>
        <CardContent>
          {atLimit ? (
            <p className="text-sm text-zinc-600">
              You&apos;ve used this month&apos;s replies.{" "}
              {isFree && (
                <>
                  <Link
                    href="/account"
                    className="font-medium text-zinc-900 underline underline-offset-4"
                  >
                    Upgrade to Pro
                  </Link>{" "}
                  for 500 replies a month.
                </>
              )}
            </p>
          ) : (
            <form action={formAction} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  Customer review
                </label>
                <textarea
                  name="review"
                  required
                  rows={5}
                  maxLength={5000}
                  placeholder="Paste the review here — positive or negative, any language"
                  className="w-full rounded-md border border-zinc-300 bg-white p-3 text-sm focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">
                    Business name
                  </label>
                  <Input
                    name="business_name"
                    required
                    placeholder="e.g. The Corner Café"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">
                    Tone
                  </label>
                  <input type="hidden" name="tone" value={tone} />
                  <div className="flex gap-2">
                    {TONES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTone(t)}
                        className={cn(
                          "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                          tone === t
                            ? "border-zinc-900 bg-zinc-900 text-white"
                            : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  Extra context{" "}
                  <span className="font-normal text-zinc-400">(optional)</span>
                </label>
                <Input
                  name="context"
                  placeholder="e.g. We were short-staffed that night; offer them a free coffee"
                />
              </div>

              <Button type="submit" disabled={pending}>
                {pending ? "Writing reply…" : "Generate reply"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {state.error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      {state.reply && (
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Your reply</CardTitle>
            <button
              type="button"
              onClick={copy}
              className="text-sm font-medium text-zinc-600 underline underline-offset-4 hover:text-zinc-900"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-800">
              {state.reply}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
