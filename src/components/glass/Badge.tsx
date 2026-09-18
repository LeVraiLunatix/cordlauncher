import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type BadgeTone = "ok" | "info" | "neutral" | "warn" | "tint";

const TONES: Record<BadgeTone, string> = {
  ok: "text-ok bg-ok/12 ring-ok/25",
  info: "text-info bg-info/12 ring-info/25",
  warn: "text-warn bg-warn/12 ring-warn/25",
  neutral: "text-fg-muted bg-[var(--control)] ring-[var(--line)]",
  tint: "tint-fill text-white ring-white/20",
};

type BadgeProps = {
  tone?: BadgeTone;
  icon?: ReactNode;
  /** Pastille lumineuse qui pulse (statut « vivant »). */
  pulse?: boolean;
  /** Reflet qui balaie le badge (mise à jour disponible). */
  shine?: boolean;
  className?: string;
  children: ReactNode;
};

export function Badge({ tone = "neutral", icon, pulse, shine, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "relative inline-flex h-6 shrink-0 items-center gap-1.5 overflow-hidden rounded-full px-2.5 text-[11.5px] font-semibold tracking-[0.01em] whitespace-nowrap ring-1 ring-inset",
        TONES[tone],
        className,
      )}
    >
      {shine && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/2 animate-sweep bg-gradient-to-r from-transparent via-white/45 to-transparent"
        />
      )}
      {pulse && <span aria-hidden className="size-1.5 animate-pulse-dot rounded-full bg-current" />}
      {icon}
      <span className="relative">{children}</span>
    </span>
  );
}
