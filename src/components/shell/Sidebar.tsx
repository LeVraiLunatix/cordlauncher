import { ArrowUpRight, Compass, LayoutGrid, Settings2, Smartphone, UserRound, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { CatalogApp } from "../../lib/catalog/types";
import { cn } from "../../lib/cn";
import { useIphoneBadge } from "../../lib/iphone-apps";
import { launchApp, useInstalledMap, useActiveJobCount, useJob, useUpdateCount } from "../../lib/installer";
import { springSoft } from "../../lib/motion";
import { openExternal } from "../../lib/platform";
import { JobProgress } from "../apps/AppAction";
import { AppIcon } from "../apps/AppIcon";
import { GlassCard } from "../glass";

export type Route = "discover" | "library" | "iphone" | "settings" | "account";

const NAV: { id: Route; label: string; icon: LucideIcon }[] = [
  { id: "discover", label: "Découvrir", icon: Compass },
  { id: "library", label: "Bibliothèque", icon: LayoutGrid },
  { id: "iphone", label: "iPhone", icon: Smartphone },
  { id: "account", label: "Compte Cord", icon: UserRound },
  { id: "settings", label: "Réglages", icon: Settings2 },
];

export const LAUNCHER_VERSION = __APP_VERSION__;

type SidebarProps = {
  route: Route;
  onRoute: (r: Route) => void;
  apps: CatalogApp[];
};

/**
 * Panneau de navigation flottant. La pastille de l'onglet actif glisse d'un
 * item à l'autre (layoutId) ; les téléchargements en cours s'y empilent pour
 * rester visibles quel que soit l'écran.
 */
export function Sidebar({ route, onRoute, apps }: SidebarProps) {
  const updates = useUpdateCount(apps);
  const activeJobs = useActiveJobCount();
  const installed = useInstalledMap();
  const renew = useIphoneBadge();

  return (
    <GlassCard
      rimAngle={170}
      className="scroll-glass flex w-[236px] shrink-0 flex-col overflow-y-auto rounded-[28px] p-3"
      initial={{ opacity: 0, x: -28, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1, transition: { ...springSoft, delay: 0.12 } }}
    >
      <nav className="relative z-[3] flex flex-col gap-1" aria-label="Navigation principale">
        <p className="px-3 pt-2 pb-2 text-[10.5px] font-semibold tracking-[0.14em] text-fg-subtle uppercase">Menu</p>
        {NAV.map((item, i) => {
          const active = item.id === route;
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              type="button"
              aria-current={active ? "page" : undefined}
              onClick={() => onRoute(item.id)}
              className={cn(
                "group relative flex h-11 items-center gap-3 rounded-[15px] px-3 text-[13.5px] font-medium transition-colors duration-300",
                active ? "text-fg" : "text-fg-muted hover:bg-[var(--control)] hover:text-fg",
              )}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0, transition: { ...springSoft, delay: 0.22 + i * 0.05 } }}
              whileTap={{ scale: 0.97 }}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  aria-hidden
                  className="absolute inset-0 rounded-[15px] bg-[var(--glass-fill-hover)] shadow-[inset_0_1px_0_var(--glass-inner),inset_0_0_0_1px_var(--glass-stroke),0_8px_20px_-10px_rgb(0_0_0/0.5)]"
                  style={{
                    backgroundImage:
                      "linear-gradient(120deg, color-mix(in oklab, var(--tint-a) 26%, transparent), color-mix(in oklab, var(--tint-b) 10%, transparent))",
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span
                className={cn(
                  "relative grid size-7 place-items-center rounded-[9px] transition-all duration-300",
                  active ? "tint-fill text-white" : "bg-[var(--control)] group-hover:scale-110",
                )}
              >
                <Icon className="size-[15px]" strokeWidth={2} />
              </span>
              <span className="relative flex-1 text-left">{item.label}</span>
              <AnimatePresence>
                {item.id === "library" && updates > 0 && (
                  <motion.span
                    className="tint-fill relative grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-bold text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    title={`${updates} mise(s) à jour disponible(s)`}
                  >
                    {updates}
                  </motion.span>
                )}
                {item.id === "iphone" && renew > 0 && (
                  <motion.span
                    className="relative grid h-5 min-w-5 place-items-center rounded-full bg-warn px-1.5 text-[11px] font-bold text-[#1a1206]"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    title={`${renew} app(s) à mettre à jour ou à renouveler`}
                  >
                    {renew}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>

      <section className="relative z-[3] my-5" aria-label="Apps installées">
        <p className="px-3 pb-2 text-[10.5px] font-semibold tracking-[0.14em] text-fg-subtle uppercase">Mes apps</p>
        {apps.filter(app => installed[app.id]).map(app => <SidebarApp key={app.id} app={app} />)}
        {!apps.some(app => installed[app.id]) && <p className="px-3 text-xs text-fg-subtle">Tes apps apparaîtront ici après installation.</p>}
      </section>

      <AnimatePresence>
        {activeJobs > 0 && (
          <motion.div
            className="relative z-[3] mt-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <p className="px-3 pb-2 text-[10.5px] font-semibold tracking-[0.14em] text-fg-subtle uppercase">
              En cours
            </p>
            <div className="flex flex-col gap-2">
              {apps.map((app) => (
                <SidebarJob key={app.id} app={app} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-[3] mt-auto flex flex-col gap-2">
        <motion.button
          type="button"
          onClick={() => void openExternal("https://cordsuite.app")}
          className="group flex items-center gap-3 rounded-[18px] bg-[var(--control)] p-2.5 text-left ring-1 ring-[var(--line)] transition-colors ring-inset hover:bg-[var(--control-hover)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { ...springSoft, delay: 0.4 } }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <img src="/logos/cordsuite.png" alt="" draggable={false} className="size-9 rounded-[10px]" />
          <span className="min-w-0 flex-1">
            <span className="block text-[12.5px] font-semibold">La suite Cord</span>
            <span className="block text-[11.5px] text-fg-subtle">cordsuite.app</span>
          </span>
          <ArrowUpRight className="size-4 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg" />
        </motion.button>
        <p className="flex items-center gap-1.5 px-2.5 pt-1 pb-0.5 font-mono text-[10.5px] text-fg-subtle">
          <span className="size-1.5 rounded-full bg-ok" />
          CordLauncher {LAUNCHER_VERSION}
        </p>
      </div>
    </GlassCard>
  );
}

function SidebarJob({ app }: { app: CatalogApp }) {
  const job = useJob(app.id);
  if (!job) return null;
  return (
    <div className="flex items-center gap-2.5 rounded-[16px] bg-[var(--control)] p-2.5 ring-1 ring-[var(--line)] ring-inset">
      <AppIcon app={app} size={30} glow={false} />
      <div className="min-w-0 flex-1">
        <JobProgress app={app} job={job} compact />
      </div>
    </div>
  );
}

function SidebarApp({ app }: { app: CatalogApp }) {
  const job = useJob(app.id);
  return <button type="button" disabled={!!job} onClick={() => void launchApp(app)} title={`Ouvrir ${app.name}`} className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left text-sm hover:bg-[var(--control)] disabled:opacity-50">
    <AppIcon app={app} size={30} glow={false} /><span className="truncate">{app.name}</span>
  </button>;
}
