import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-[var(--line-strong)] bg-[var(--paper-raised)] px-3.5 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] transition-colors focus:border-[var(--brass)] disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
