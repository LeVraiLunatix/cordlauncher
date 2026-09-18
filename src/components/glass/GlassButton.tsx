import { LoaderCircle } from "lucide-react";
import { motion, type HTMLMotionProps, type MotionStyle } from "motion/react";
import { useState, type PointerEvent, type ReactNode, type Ref } from "react";
import type { Gradient } from "../../lib/catalog/types";
import { cn } from "../../lib/cn";
import { springSnappy } from "../../lib/motion";

type Variant = "primary" | "glass" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "icon" | "icon-sm";

export type GlassButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  ref?: Ref<HTMLButtonElement>;
  variant?: Variant;
  size?: Size;
  /** Icône avant le libellé (remplacée par un spinner pendant `loading`). */
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  loading?: boolean;
  /** Couleurs du bouton primaire (dégradé de l'app). */
  tint?: Gradient;
  children?: ReactNode;
};

const SIZES: Record<Size, string> = {
  sm: "h-8 gap-1.5 px-3.5 text-[12.5px]",
  md: "h-10 gap-2 px-[18px] text-[13.5px]",
  lg: "h-12 gap-2.5 px-6 text-[14.5px]",
  icon: "size-9",
  "icon-sm": "size-7",
};

const VARIANTS: Record<Variant, string> = {
  primary: "tint-fill text-white font-semibold [text-shadow:0_1px_1px_rgb(0_0_0/0.18)]",
  glass: "glass glass-rim glass-sheen glass-interactive text-fg font-medium [--sheen-size:140px]",
  ghost: "text-fg-muted font-medium hover:bg-[var(--control-hover)] hover:text-fg",
  danger: "text-danger font-medium hover:bg-danger/12",
};

type Ripple = { id: number; x: number; y: number; size: number };
let rippleId = 0;

/**
 * Bouton de l'app. Réagit à tout : grossit au survol, s'enfonce au clic, et
 * une onde part du point de contact. Le primaire porte en plus un reflet qui
 * balaie sa surface au survol, comme une lumière qui glisse sur du verre.
 */
export function GlassButton({
  ref,
  variant = "glass",
  size = "md",
  icon,
  trailingIcon,
  loading = false,
  tint,
  className,
  style,
  disabled,
  onPointerDown,
  children,
  ...rest
}: GlassButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const sz = Math.max(r.width, r.height) * 2.4;
    const ripple = { id: rippleId++, x: e.clientX - r.left, y: e.clientY - r.top, size: sz };
    setRipples((list) => [...list, ripple]);
    onPointerDown?.(e);
  };

  const tintVars = tint ? { "--tint-a": tint[0], "--tint-b": tint[1] } : null;
  const inert = disabled || loading;

  return (
    <motion.button
      ref={ref}
      type="button"
      disabled={inert}
      className={cn(
        "group relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full whitespace-nowrap outline-none select-none",
        "transition-[background-color,color,box-shadow,opacity] duration-300 ease-(--ease-glass)",
        "disabled:opacity-50",
        variant === "primary" && "hover:shadow-[0_10px_34px_-10px_color-mix(in_oklab,var(--tint-a)_95%,transparent)]",
        SIZES[size],
        VARIANTS[variant],
        className,
      )}
      style={{ ...tintVars, ...style } as MotionStyle}
      whileHover={inert ? undefined : { scale: 1.035 }}
      whileTap={inert ? undefined : { scale: 0.955 }}
      transition={springSnappy}
      onPointerDown={handlePointerDown}
      {...rest}
    >
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:animate-sweep group-hover:opacity-100"
        />
      )}

      {ripples.map((r) => (
        <motion.span
          key={r.id}
          aria-hidden
          className={cn(
            "pointer-events-none absolute rounded-full",
            variant === "primary" ? "bg-white/45" : "bg-[color-mix(in_oklab,var(--fg)_22%,transparent)]",
          )}
          style={{ left: r.x - r.size / 2, top: r.y - r.size / 2, width: r.size, height: r.size }}
          initial={{ scale: 0, opacity: 0.55 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => setRipples((list) => list.filter((x) => x.id !== r.id))}
        />
      ))}

      <span className="relative z-[3] inline-flex items-center gap-[inherit]">
        {loading ? <LoaderCircle className="size-4 animate-spin" /> : icon}
        {children}
        {trailingIcon}
      </span>
    </motion.button>
  );
}
