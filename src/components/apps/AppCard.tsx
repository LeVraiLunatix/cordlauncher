import { Check, Clock3 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { KeyboardEvent, Ref } from "react";
import type { CatalogApp } from "../../lib/catalog/types";
import { cn } from "../../lib/cn";
import { formatBytes } from "../../lib/format";
import { useAppAction, type AppAction } from "../../lib/installer";
import { itemVariants } from "../../lib/motion";
import { GlassCard, Skeleton } from "../glass";
import { AppActionButton, JobProgress } from "./AppAction";
import { AppIcon } from "./AppIcon";
import { StatusBadge } from "./StatusBadge";

type AppCardProps = {
  /** Posée par AnimatePresence (mode popLayout) pour mesurer la carte qui sort. */
  ref?: Ref<HTMLDivElement>;
  app: CatalogApp;
  onOpen: (id: string) => void;
};

/**
 * Carte d'une app dans la grille. Toute la carte ouvre la fiche ; le bouton
 * d'action fait sa vie à part (son clic ne remonte pas).
 *
 * Au survol : légère inclinaison 3D vers le curseur, la carte se soulève,
 * son verre prend la couleur de l'app et un reflet suit la souris.
 */
export function AppCard({ ref, app, onOpen }: AppCardProps) {
  const soon = app.status === "coming-soon";
  const action = useAppAction(app);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(app.id);
    }
  };

  return (
    <GlassCard
      ref={ref}
      layout="position"
      variants={itemVariants}
      interactive
      tilt={soon ? 2.5 : 5}
      tint={app.iconGradient}
      role="button"
      tabIndex={0}
      aria-label={`${app.name} — ouvrir la fiche`}
      onClick={() => onOpen(app.id)}
      onKeyDown={onKeyDown}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.985 }}
      className={cn("group flex min-h-[238px] flex-col rounded-[24px] p-5", soon && "[--tint-mix:7%]")}
    >
      <div className="relative z-[3] flex items-start justify-between gap-3">
        <AppIcon app={app} size={54} dim={soon} layoutId={`icon-${app.id}`} />
        <StatusBadge app={app} />
      </div>

      <div className="relative z-[3] mt-4">
        <h3 className="font-display text-[17px] leading-tight font-semibold tracking-[-0.01em]">{app.name}</h3>
        {app.tagline && <p className="mt-0.5 text-[12.5px] font-medium text-fg-muted">{app.tagline}</p>}
        <p className={cn("mt-2 clamp-2 text-[13px] leading-relaxed", soon ? "text-fg-subtle" : "text-fg-muted")}>
          {app.description}
        </p>
      </div>

      <div className="relative z-[3] mt-auto pt-4">
        <div className="mb-3.5 h-px bg-[var(--line)]" />
        <div className="flex h-[52px] items-center">
          <AnimatePresence mode="popLayout" initial={false}>
            {action.kind === "busy" ? (
              <motion.div
                key="busy"
                className="w-full"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <JobProgress app={app} job={action.job} />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                className="flex w-full items-center justify-between gap-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                {action.kind === "join-beta" ? (
                  // Bêta : pas de version à montrer, le bouton prend la ligne
                  // (à côté de « Sur invitation », il faisait passer le texte sur deux lignes).
                  <AppActionButton app={app} className="w-full" />
                ) : (
                  <>
                    <FooterMeta app={app} action={action} />
                    <AppActionButton app={app} />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GlassCard>
  );
}

/** Ligne d'info à gauche du bouton : version, taille, état. */
function FooterMeta({ app, action }: { app: CatalogApp; action: AppAction }) {
  const mono = "font-mono text-[11.5px] tabular-nums";
  switch (action.kind) {
    case "loading":
      return (
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-2.5 w-24" />
        </div>
      );
    case "install":
      return (
        <div className={cn(mono, "leading-tight text-fg-muted")}>
          <div className="text-fg">v{app.version}</div>
          {app.downloadSize ? <div className="text-fg-subtle">{formatBytes(app.downloadSize)}</div> : null}
        </div>
      );
    case "update":
      return (
        <div className={cn(mono, "leading-tight")}>
          <div className="text-fg-subtle line-through decoration-1">v{action.from}</div>
          <div className="text-fg">v{app.version}</div>
        </div>
      );
    case "open":
      return (
        <div className={cn(mono, "flex items-center gap-1.5 text-fg-muted")}>
          <Check className="size-3.5 text-ok" strokeWidth={2.5} />v{action.version} · à jour
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-1.5 text-[12px] text-fg-subtle">
          <Clock3 className="size-3.5" />
          Bientôt disponible
        </div>
      );
  }
}

/** Carte fantôme pendant le chargement du catalogue. */
export function AppCardSkeleton() {
  return (
    <GlassCard variants={itemVariants} className="flex min-h-[238px] flex-col rounded-[24px] p-5">
      <div className="flex items-start justify-between">
        <div className="skeleton size-[54px] rounded-[12px]" />
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="mt-5 h-4 w-28" />
      <Skeleton className="mt-2 h-3 w-20" />
      <Skeleton className="mt-4 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-4/5" />
      <div className="mt-auto flex items-center justify-between pt-6">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-8 w-24" />
      </div>
    </GlassCard>
  );
}
