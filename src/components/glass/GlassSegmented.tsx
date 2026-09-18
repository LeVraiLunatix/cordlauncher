import { motion } from "motion/react";
import { useId, type ReactNode } from "react";
import { cn } from "../../lib/cn";

type Option<T extends string> = { value: T; label: string; icon?: ReactNode };

type GlassSegmentedProps<T extends string> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  label: string;
  className?: string;
};

/** Sélecteur segmenté : une pastille de verre glisse sous l'option active. */
export function GlassSegmented<T extends string>({
  value,
  options,
  onChange,
  label,
  className,
}: GlassSegmentedProps<T>) {
  const pillId = useId();
  return (
    <div role="radiogroup" aria-label={label} className={cn("glass-inset inline-flex rounded-full p-1", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[12.5px] font-medium transition-colors duration-300",
              active ? "text-fg" : "text-fg-muted hover:text-fg",
            )}
          >
            {active && (
              <motion.span
                layoutId={pillId}
                aria-hidden
                className="absolute inset-0 rounded-full bg-[var(--glass-fill-hover)] shadow-[inset_0_1px_0_var(--glass-inner),inset_0_0_0_1px_var(--glass-stroke),0_4px_12px_-4px_rgb(0_0_0/0.35)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative inline-flex items-center gap-1.5">
              {o.icon}
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
