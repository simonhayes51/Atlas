"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type HistoryItem = {
  id: string;
  review: string;
  reply: string;
  tone: string;
  business_name: string;
  created_at: string;
};

export function HistoryList({ items }: { items: HistoryItem[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (items.length === 0) return null;

  const copy = async (item: HistoryItem) => {
    await navigator.clipboard.writeText(item.reply);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Recent replies{" "}
          <span className="font-normal text-zinc-400">(last {items.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-zinc-100 px-0 py-0">
        {items.map((item) => (
          <div key={item.id} className="px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <p className="truncate text-xs text-zinc-400">
                “{item.review.slice(0, 90)}
                {item.review.length > 90 ? "…" : ""}”
              </p>
              <div className="flex shrink-0 items-center gap-3">
                <Badge>{item.tone}</Badge>
                <button
                  type="button"
                  onClick={() => copy(item)}
                  className="text-xs font-medium text-zinc-500 underline underline-offset-4 hover:text-zinc-900"
                >
                  {copiedId === item.id ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-800">
              {item.reply}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
