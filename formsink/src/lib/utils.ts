// Minimal class joiner — enough for this codebase without pulling in
// clsx/tailwind-merge.
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
