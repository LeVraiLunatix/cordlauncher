import { motion } from "motion/react";
import type { CatalogApp } from "../../lib/catalog/types";
import { cn } from "../../lib/cn";

type AppIconProps = {
  app: CatalogApp;
  size?: number;
  /** Version éteinte (apps pas encore sorties). Se rallume au survol du parent `.group`. */
  dim?: boolean;
  /** Halo coloré sous l'icône, tiré de l'icône elle-même. */
  glow?: boolean;
  /** Transition partagée carte → fiche (même `layoutId` des deux côtés). */
  layoutId?: string;
  className?: string;
};

/**
 * Logo d'une app : le PNG officiel (dégradé diagonal + coins arrondis déjà
 * dans l'image), un voile de brillance par-dessus pour l'effet « verre
 * bombé », et un halo flou de la même image dessous. Sans logo, on dessine
 * le dégradé de l'app avec son initiale.
 */
export function AppIcon({ app, size = 56, dim = false, glow = true, layoutId, className }: AppIconProps) {
  const radius = size * 0.225;
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      {glow && app.icon && (
        <img
          src={app.icon}
          alt=""
          aria-hidden
          draggable={false}
          className={cn(
            "pointer-events-none absolute inset-0 size-full translate-y-[16%] scale-[0.86] blur-[14px] transition-opacity duration-500",
            dim ? "opacity-0 group-hover:opacity-40" : "opacity-60",
          )}
        />
      )}
      <motion.div
        layoutId={layoutId}
        className="relative size-full"
        style={{ borderRadius: radius }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {app.icon ? (
          <img
            src={app.icon}
            alt=""
            draggable={false}
            className={cn(
              "size-full transition-[filter] duration-500",
              dim && "grayscale-[0.9] brightness-[0.85] group-hover:grayscale-[0.25] group-hover:brightness-100",
            )}
            style={{ borderRadius: radius }}
          />
        ) : (
          <div
            className="grid size-full place-items-center font-display font-bold text-white"
            style={{
              borderRadius: radius,
              background: `linear-gradient(135deg, ${app.iconGradient[0]}, ${app.iconGradient[1]})`,
              fontSize: size * 0.42,
            }}
          >
            {app.name.charAt(0)}
          </div>
        )}
        {/* Brillance : haut éclairé, liseré intérieur — le logo devient une pastille de verre. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/28 via-white/0 via-45% to-transparent ring-1 ring-white/20 ring-inset"
          style={{ borderRadius: radius }}
        />
      </motion.div>
    </div>
  );
}
