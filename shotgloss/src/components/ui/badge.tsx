import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "success" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "success"
          ? "bg-emerald-100 text-emerald-800"
          : "bg-zinc-100 text-zinc-700",
        className
      )}
      {...props}
    />
  );
}
