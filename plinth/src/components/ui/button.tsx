import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--brass)] hover:text-[var(--brass-ink)] disabled:hover:bg-[var(--ink)] disabled:hover:text-[var(--paper)]",
  secondary:
    "bg-transparent text-[var(--ink)] border border-[var(--line-strong)] hover:border-[var(--ink)]",
  ghost: "bg-transparent text-[var(--ink)] hover:bg-[var(--line)]/40",
  danger:
    "bg-transparent text-[var(--terracotta)] border border-[var(--terracotta)]/50 hover:bg-[var(--terracotta)] hover:text-white",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2.5 text-sm rounded-md",
  lg: "px-6 py-3.5 text-base rounded-lg",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cn(
        "font-medium tracking-tight transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}
