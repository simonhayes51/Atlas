import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Tone = "neutral" | "success" | "brass";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-[var(--line)]/60 text-[var(--muted)]",
  success: "bg-[var(--spruce)]/15 text-[var(--spruce)]",
  brass: "bg-[var(--brass)]/15 text-[var(--brass)]",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "font-mono inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.6875rem] font-medium uppercase tracking-wider",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
