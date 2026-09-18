import { cn } from "../../lib/cn";

/** Barre éteinte balayée par un reflet, en attendant la vraie donnée. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("skeleton rounded-full", className)} />;
}
