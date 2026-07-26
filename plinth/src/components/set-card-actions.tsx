"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DeleteSetButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <Button
      variant="danger"
      size="sm"
      disabled={busy}
      onClick={async () => {
        if (!confirm("Delete this set? This can't be undone.")) return;
        setBusy(true);
        await fetch(`/api/sets/${id}`, { method: "DELETE" });
        router.refresh();
      }}
    >
      {busy ? "Deleting…" : "Delete"}
    </Button>
  );
}
