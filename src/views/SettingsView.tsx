import {
  ArrowUpRight,
  BellRing,
  Droplets,
  FolderDown,
  Gauge,
  Monitor,
  Moon,
  Power,
  RefreshCw,
  Sun,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { GlassButton, GlassCard, GlassSegmented, GlassToggle } from "../components/glass";
import { LAUNCHER_VERSION } from "../components/shell/Sidebar";
import { itemVariants, viewVariants } from "../lib/motion";
import { IS_TAURI, openExternal, pickFolder } from "../lib/platform";
import { AppleAccount } from "../components/apps/AppleAccount";
import { updateSettings, useSettings, type ThemePref } from "../lib/settings";
import { toast } from "../lib/toast";
import type { LauncherRelease } from "../lib/catalog/types";
import { checkLauncherUpdate, installLauncherUpdate } from "../lib/updates";

/**
 * Réglages. Apparence et animations agissent tout de suite ; « Lancer avec
 * Windows » passe par le plugin autostart ; les mises à jour des apps sont
 * vérifiées au lancement puis toutes les 10 minutes (lib/updates.ts).
 */
export function SettingsView() {
  const s = useSettings((x) => x);
  const [checking, setChecking] = useState(false);
  const [release, setRelease] = useState<LauncherRelease | null>(null);
  const [installing, setInstalling] = useState(false);

  const checkNow = async () => {
    setChecking(true);
    const result = await checkLauncherUpdate();
    setChecking(false);
    if (result.status === "available") {
      setRelease(result.release);
      toast({ tone: "info", title: `CordLauncher ${result.release.version} est disponible`, description: result.release.notes ?? "Installe-la quand tu veux, en un clic." });
    } else if (result.status === "latest") {
      setRelease(null);
      toast({ tone: "ok", title: "CordLauncher est à jour", description: `Tu as la dernière version (${LAUNCHER_VERSION}).` });
    } else {
      toast({ tone: "error", title: "Vérification impossible", description: "Pas de connexion au Compte Cord pour le moment. Réessaie plus tard." });
    }
  };
  const install = async () => {
    if (!release) return;
    setInstalling(true);
    try {
      await installLauncherUpdate(release);
    } catch (error) {
      setInstalling(false);
      toast({ tone: "error", title: "Mise à jour impossible", description: String(error) });
    }
  };

  return (
    <motion.div
      variants={viewVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="mx-auto flex w-full max-w-[860px] flex-col gap-6 px-8 pt-4 pb-14"
    >
      <motion.header variants={itemVariants}>
        <p className="text-[11.5px] font-semibold tracking-[0.14em] text-fg-subtle uppercase">Réglages</p>
        <h1 className="mt-1.5 font-display text-[32px] leading-tight font-semibold tracking-[-0.03em]">
          À ta façon
        </h1>
      </motion.header>

      <Group title="Apparence">
        <Row icon={Droplets} title="Thème" description="Le verre se teinte différemment en clair et en sombre.">
          <GlassSegmented<ThemePref>
            label="Thème"
            value={s.theme}
            onChange={(theme) => updateSettings({ theme })}
            options={[
              { value: "system", label: "Système", icon: <Monitor className="size-3.5" /> },
              { value: "dark", label: "Sombre", icon: <Moon className="size-3.5" /> },
              { value: "light", label: "Clair", icon: <Sun className="size-3.5" /> },
            ]}
          />
        </Row>
        <Row
          icon={Gauge}
          title="Réduire la transparence"
          description="Verre plus opaque et moins flouté : plus lisible, plus léger pour les petites cartes graphiques."
        >
          <GlassToggle
            label="Réduire la transparence"
            checked={s.reduceTransparency}
            onChange={(v) => updateSettings({ reduceTransparency: v })}
          />
        </Row>
        <Row icon={Wand2} title="Réduire les animations" description="Coupe les mouvements décoratifs et les transitions longues.">
          <GlassToggle
            label="Réduire les animations"
            checked={s.reduceMotion}
            onChange={(v) => updateSettings({ reduceMotion: v })}
          />
        </Row>
      </Group>

      <Group title="Démarrage">
        <Row icon={Power} title="Lancer avec Windows" description="CordLauncher s'ouvre à l'ouverture de ta session.">
          <GlassToggle
            label="Lancer avec Windows"
            checked={s.launchAtStartup}
            onChange={(v) => updateSettings({ launchAtStartup: v })}
          />
        </Row>
        <AnimatePresence initial={false}>
          {s.launchAtStartup && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="overflow-hidden"
            >
              <Row nested title="Démarrer réduit" description="S’ouvre réduit dans la barre des tâches.">
                <GlassToggle
                  label="Démarrer réduit"
                  checked={s.startMinimized}
                  onChange={(v) => updateSettings({ startMinimized: v })}
                />
              </Row>
            </motion.div>
          )}
        </AnimatePresence>
      </Group>

      <Group title="Mises à jour">
        <Row
          icon={BellRing}
          title="Me prévenir des mises à jour"
          description="CordLauncher vérifie tes apps Windows en arrière-plan et te prévient quand une nouvelle version sort."
        >
          <GlassToggle
            label="Vérifier automatiquement les mises à jour"
            checked={s.autoCheckUpdates}
            onChange={(v) => updateSettings({ autoCheckUpdates: v })}
          />
        </Row>
        <Row
          icon={RefreshCw}
          title="Les installer toutes seules"
          description="Les nouvelles versions s’installent dès qu’elles sortent, sans te demander."
        >
          <GlassToggle
            label="Installer les mises à jour sans demander"
            checked={s.autoInstallUpdates}
            disabled={!s.autoCheckUpdates}
            onChange={(v) => updateSettings({ autoInstallUpdates: v })}
          />
        </Row>
        <Row icon={FolderDown} title="Dossier des nouvelles apps" description={s.installBase ?? "Emplacement par défaut : ton profil Windows. Tu peux le modifier à chaque installation."}>
          <GlassButton variant="glass" disabled={!IS_TAURI} onClick={() => void pickFolder("Dossier des apps Cord", s.installBase ?? undefined).then(installBase => { if (installBase) updateSettings({ installBase }); }).catch(error => toast({ tone: "error", title: "Dossier inaccessible", description: String(error) }))}>Choisir…</GlassButton>
          {s.installBase && <GlassButton variant="ghost" onClick={() => updateSettings({ installBase: null })}>Réinitialiser</GlassButton>}
        </Row>
      </Group>

      <GlassCard variants={itemVariants} className="rounded-[26px] p-6"><div className="relative z-[3]"><AppleAccount /></div></GlassCard>

      <GlassCard variants={itemVariants} className="flex items-center gap-5 rounded-[26px] p-5">
        <img src="/logos/cordsuite.png" alt="" draggable={false} className="relative z-[3] size-14 rounded-[16px]" />
        <div className="relative z-[3] flex-1">
          <p className="font-display text-[17px] font-semibold">CordLauncher</p>
          <p className="font-mono text-[12px] text-fg-subtle">Version {LAUNCHER_VERSION} · bêta publique</p>
        </div>
        <div className="relative z-[3] flex gap-2">
          {release ? (
            <GlassButton variant="primary" icon={<ArrowUpRight className="size-4" />} disabled={installing} onClick={() => void install()}>
              {installing ? "Téléchargement…" : `Installer la ${release.version}`}
            </GlassButton>
          ) : (
            <GlassButton
              variant="glass"
              icon={<RefreshCw className={checking ? "size-4 animate-spin" : "size-4"} />}
              disabled={checking || !IS_TAURI}
              onClick={() => void checkNow()}
            >
              {checking ? "Recherche…" : "Rechercher une mise à jour"}
            </GlassButton>
          )}
          <GlassButton variant="ghost" onClick={() => { try { localStorage.removeItem("cordlauncher:welcome-done"); } catch { /* rien */ } window.location.reload(); }}>
            Revoir l’accueil
          </GlassButton>
          <GlassButton
            variant="ghost"
            trailingIcon={<ArrowUpRight className="size-4" />}
            onClick={() => void openExternal("https://cordsuite.app")}
          >
            cordsuite.app
          </GlassButton>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <motion.h2
        variants={itemVariants}
        className="mb-2.5 px-1 text-[11.5px] font-semibold tracking-[0.12em] text-fg-subtle uppercase"
      >
        {title}
      </motion.h2>
      <GlassCard variants={itemVariants} className="rounded-[26px] p-1.5">
        <div className="relative z-[3] flex flex-col">{children}</div>
      </GlassCard>
    </section>
  );
}

function Row({
  icon: Icon,
  title,
  description,
  nested,
  children,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  nested?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={
        "flex items-center gap-4 rounded-[20px] px-4 py-3.5 transition-colors duration-300 hover:bg-[var(--control)] " +
        (nested ? "pl-[60px]" : "")
      }
    >
      {Icon && (
        <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-[var(--control)] text-fg-muted ring-1 ring-[var(--line)] ring-inset">
          <Icon className="size-[17px]" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium">{title}</p>
        {description && <p className="mt-0.5 text-[12.5px] text-fg-subtle">{description}</p>}
      </div>
      {children}
    </div>
  );
}
