import { Compass, PackageOpen, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Ref } from "react";
import { AppActionButton, JobProgress } from "../components/apps/AppAction";
import { AppIcon } from "../components/apps/AppIcon";
import { StatusBadge } from "../components/apps/StatusBadge";
import { GlassButton, GlassCard, Skeleton } from "../components/glass";
import type { CatalogApp } from "../lib/catalog/types";
import {
  hasUpdate,
  installApp,
  useAppAction,
  useDetecting,
  useInstalled,
  useInstalledMap,
} from "../lib/installer";
import { itemVariants, viewVariants } from "../lib/motion";

type LibraryViewProps = {
  apps: CatalogApp[];
  onOpen: (id: string) => void;
  onDiscover: () => void;
};

/**
 * Ce qui est installé sur ce PC. En tête, les mises à jour en attente avec
 * un « Tout mettre à jour » ; si rien n'est installé, un état vide qui
 * renvoie vers Découvrir.
 */
export function LibraryView({ apps, onOpen, onDiscover }: LibraryViewProps) {
  const detecting = useDetecting();
  const installedMap = useInstalledMap();
  const installable = apps.filter((a) => a.status === "available");
  const installed = installable.filter((a) => !!installedMap[a.id]);
  const updatable = installed.filter((a) => hasUpdate(a, installedMap[a.id]));

  return (
    <motion.div
      variants={viewVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="mx-auto flex w-full max-w-[1000px] flex-col gap-6 px-8 pt-4 pb-14"
    >
      <motion.header variants={itemVariants}>
        <p className="text-[11.5px] font-semibold tracking-[0.14em] text-fg-subtle uppercase">Bibliothèque</p>
        <h1 className="mt-1.5 font-display text-[32px] leading-tight font-semibold tracking-[-0.03em]">
          Installées sur ce PC
        </h1>
        <p className="mt-1.5 text-[14px] text-fg-muted">
          Tes apps Cord, leurs versions et leurs mises à jour, au même endroit.
        </p>
      </motion.header>

      <AnimatePresence>
        {updatable.length > 0 && (
          <GlassCard
            key="updates"
            variants={itemVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            interactive
            className="flex items-center gap-5 rounded-[24px] p-5 [--tint-mix:24%]"
          >
            <div className="tint-fill relative z-[3] grid size-11 shrink-0 place-items-center rounded-[14px] text-white">
              <RefreshCw className="size-5" />
            </div>
            <div className="relative z-[3] flex-1">
              <p className="font-display text-[16px] font-semibold">
                {updatable.length > 1
                  ? `${updatable.length} mises à jour disponibles`
                  : "1 mise à jour disponible"}
              </p>
              <p className="text-[13px] text-fg-muted">{updatable.map((a) => a.name).join(", ")}</p>
            </div>
            <GlassButton
              variant="primary"
              className="relative z-[3]"
              icon={<RefreshCw className="size-4 transition-transform duration-500 group-hover:rotate-180" />}
              onClick={() => updatable.forEach((a) => void installApp(a))}
            >
              Tout mettre à jour
            </GlassButton>
          </GlassCard>
        )}
      </AnimatePresence>

      {detecting ? (
        <div className="flex flex-col gap-3">
          {[0, 1].map((i) => (
            <GlassCard key={i} variants={itemVariants} className="flex items-center gap-4 rounded-[22px] p-4">
              <div className="skeleton size-12 rounded-[12px]" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-9 w-28" />
            </GlassCard>
          ))}
        </div>
      ) : installed.length > 0 ? (
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {installed.map((app) => (
              <InstalledRow key={app.id} app={app} onOpen={onOpen} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <GlassCard
          variants={itemVariants}
          className="flex flex-col items-center rounded-[30px] px-8 py-16 text-center"
        >
          <motion.div
            className="relative z-[3] grid size-16 place-items-center rounded-[20px] bg-[var(--control)] text-fg-muted ring-1 ring-[var(--line)] ring-inset"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <PackageOpen className="size-7" />
          </motion.div>
          <p className="relative z-[3] mt-5 font-display text-[20px] font-semibold tracking-tight">
            Rien d'installé pour l'instant
          </p>
          <p className="relative z-[3] mt-1.5 max-w-[380px] text-[13.5px] text-fg-muted">
            {installable.length > 0
              ? `${installable.map((a) => a.name).join(", ")} ${installable.length > 1 ? "sont prêtes" : "est prête"} à être installée${installable.length > 1 ? "s" : ""}, en un clic et sans droits admin.`
              : "Les apps de la suite apparaîtront ici dès leur sortie."}
          </p>
          <GlassButton
            variant="primary"
            size="md"
            className="relative z-[3] mt-6"
            icon={<Compass className="size-4" />}
            onClick={onDiscover}
          >
            Découvrir la suite
          </GlassButton>
        </GlassCard>
      )}
    </motion.div>
  );
}

function InstalledRow({
  ref,
  app,
  onOpen,
}: {
  ref?: Ref<HTMLDivElement>;
  app: CatalogApp;
  onOpen: (id: string) => void;
}) {
  const action = useAppAction(app);
  const installed = useInstalled(app.id);
  return (
    <GlassCard
      ref={ref}
      layout="position"
      variants={itemVariants}
      interactive
      tint={app.iconGradient}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(app.id)}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && e.key === "Enter") onOpen(app.id);
      }}
      whileHover={{ y: -2 }}
      className="group flex items-center gap-4 rounded-[22px] p-4 pr-5"
    >
      <AppIcon app={app} size={50} layoutId={`icon-${app.id}`} className="relative z-[3]" />
      <div className="relative z-[3] min-w-0 flex-1">
        <div className="flex items-center gap-2.5">
          <p className="font-display text-[16px] font-semibold">{app.name}</p>
          <StatusBadge app={app} />
        </div>
        <p className="mt-0.5 truncate font-mono text-[11.5px] text-fg-subtle">
          v{installed?.version}
          {installed?.location && `  ·  ${installed.location}`}
        </p>
      </div>
      <div className="relative z-[3] flex w-[300px] shrink-0 justify-end">
        {action.kind === "busy" ? <JobProgress app={app} job={action.job} /> : <AppActionButton app={app} size="md" />}
      </div>
    </GlassCard>
  );
}
