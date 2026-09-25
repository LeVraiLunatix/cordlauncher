import { Check, Download, KeyRound, Play, RefreshCw, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { CSSProperties, MouseEvent } from "react";
import type { CatalogApp } from "../../lib/catalog/types";
import { formatBytes, formatEta, formatPercent, formatSpeed } from "../../lib/format";
import { cancelJob, installApp, launchApp, useAppAction, type Job } from "../../lib/installer";
import { GlassButton, GlassProgress, Skeleton } from "../glass";
import { openBetaSheet } from "../../lib/beta";
import { requestInstall } from "./InstallSheet";

type Size = "sm" | "md" | "lg";

/** Les boutons vivent souvent dans une carte cliquable : on isole leur clic. */
function stop(fn: () => void) {
  return (e: MouseEvent) => {
    e.stopPropagation();
    fn();
  };
}

/**
 * Bouton principal d'une app, qui change selon son état :
 * Installer → (progression) → Ouvrir, ou Mettre à jour, ou Rejoindre la bêta.
 * Pendant une opération, c'est <JobProgress> qui prend la place (voir
 * `useAppAction().kind === "busy"`).
 */
export function AppActionButton({
  app,
  size = "sm",
  className,
}: {
  app: CatalogApp;
  size?: Size;
  className?: string;
}) {
  const action = useAppAction(app);

  switch (action.kind) {
    case "loading":
      return <Skeleton className={size === "sm" ? "h-8 w-[104px]" : "h-10 w-32"} />;
    case "none":
    case "busy":
      return null;
    case "join-beta":
      return (
        <GlassButton
          variant="glass"
          size={size}
          className={className}
          tint={app.iconGradient}
          icon={<KeyRound className="size-3.5 transition-transform duration-300 group-hover:-rotate-12" />}
          onClick={stop(() => openBetaSheet(app.id))}
        >
          Rejoindre la bêta
        </GlassButton>
      );
    case "install":
      return (
        <GlassButton
          variant="primary"
          size={size}
          className={className}
          tint={app.iconGradient}
          icon={<Download className="size-4" />}
          onClick={stop(() => requestInstall(app))}
        >
          Installer
        </GlassButton>
      );
    case "update":
      return (
        <GlassButton
          variant="primary"
          size={size}
          className={className}
          tint={app.iconGradient}
          icon={<RefreshCw className="size-3.5 transition-transform duration-500 group-hover:rotate-180" />}
          onClick={stop(() => void installApp(app))}
        >
          Mettre à jour
        </GlassButton>
      );
    case "open":
      return (
        <GlassButton
          variant="glass"
          size={size}
          className={className}
          tint={app.iconGradient}
          icon={<Play className="size-3.5 fill-current" />}
          onClick={stop(() => void launchApp(app))}
        >
          Ouvrir
        </GlassButton>
      );
  }
}

const PHASE_LABEL: Record<Job["phase"], string> = {
  downloading: "Téléchargement",
  verifying: "Vérification de l'intégrité",
  installing: "Installation",
  uninstalling: "Désinstallation",
  done: "Terminé",
  error: "Échec",
};

/** Progression d'une opération : barre, pourcentage, débit, temps restant. */
export function JobProgress({ app, job, compact = false }: { app: CatalogApp; job: Job; compact?: boolean }) {
  const downloading = job.phase === "downloading";
  const ratio = downloading && job.total > 0 ? job.received / job.total : null;
  const done = job.phase === "done";
  const canCancel = downloading || job.phase === "verifying";

  return (
    <div className="w-full" style={{ "--tint-a": app.iconGradient[0], "--tint-b": app.iconGradient[1] } as CSSProperties}>
      <div className="mb-2 flex items-center justify-between gap-3 text-[12px]">
        <span className="flex min-w-0 items-center gap-1.5 font-medium text-fg">
          <AnimatePresence mode="popLayout" initial={false}>
            {done ? (
              <motion.span
                key="done"
                className="grid size-4 place-items-center rounded-full bg-ok text-[var(--bg)]"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                <Check className="size-3" strokeWidth={3.5} />
              </motion.span>
            ) : null}
          </AnimatePresence>
          <span className="truncate">
            {job.kind === "update" && downloading ? "Mise à jour" : PHASE_LABEL[job.phase]}
            {!done && job.phase !== "error" && <span className="text-fg-subtle">…</span>}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2 font-mono text-[11.5px] text-fg-muted tabular-nums">
          {ratio != null && formatPercent(ratio)}
          {canCancel && (
            <motion.button
              type="button"
              aria-label="Annuler"
              onClick={stop(() => cancelJob(app.id))}
              className="grid size-5 place-items-center rounded-full bg-[var(--control)] text-fg-muted hover:bg-danger/20 hover:text-danger"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
            >
              <X className="size-3" strokeWidth={2.5} />
            </motion.button>
          )}
        </span>
      </div>
      <GlassProgress value={done ? 1 : ratio} label={`${PHASE_LABEL[job.phase]} de ${app.name}`} />
      {!compact && (
        <div className="mt-1.5 flex h-4 items-center justify-between font-mono text-[11px] text-fg-subtle tabular-nums">
          {downloading ? (
            <>
              <span>
                {formatBytes(job.received)} / {formatBytes(job.total)} · {formatSpeed(job.speed)}
              </span>
              <span>{formatEta(job.eta)}</span>
            </>
          ) : (
            <span>{job.phase === "installing" ? "Installation silencieuse, sans droits admin" : ""}</span>
          )}
        </div>
      )}
    </div>
  );
}
