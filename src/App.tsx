import { AnimatePresence, LayoutGroup, MotionConfig } from "motion/react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { AppDetail } from "./components/apps/AppDetail";
import { InstallSheet } from "./components/apps/InstallSheet";
import { AppleVerification } from "./components/apps/AppleAccount";
import { BetaKeySheet } from "./components/apps/BetaKeySheet";
import { cordSnapshot, publishLauncherStatus, refreshCord } from "./lib/account";
import { NAVIGATE_EVENT } from "./lib/beta";
import { refreshIphoneApps, runIphoneAuto } from "./lib/iphone-apps";
import { runAppUpdates } from "./lib/updates";
import { IphoneView } from "./views/IphoneView";
import { IphoneInstallSheet } from "./components/apps/IphoneInstallSheet";
import { AnimatedGradientBackground } from "./components/glass";
import { LAUNCHER_VERSION, Sidebar, type Route } from "./components/shell/Sidebar";
import { SplashIntro } from "./components/shell/SplashIntro";
import { TitleBar } from "./components/shell/TitleBar";
import { Toaster } from "./components/shell/Toaster";
import { AmbientProvider, useAmbient } from "./lib/ambient";
import { loadCatalog, useCatalog } from "./lib/catalog/load";
import type { CatalogApp } from "./lib/catalog/types";
import { detectInstalled, installedSnapshot } from "./lib/installer";
import { useSettings } from "./lib/settings";
import { DiscoverView } from "./views/DiscoverView";
import { LibraryView } from "./views/LibraryView";
import { SettingsView } from "./views/SettingsView";
import { AccountView } from "./views/AccountView";

/** `?intro=0` saute l'animation d'ouverture (pratique en développement). */
const SKIP_INTRO = new URLSearchParams(window.location.search).get("intro") === "0";
const NO_APPS: CatalogApp[] = [];

async function boot() {
  // Session Cord chargée dès le lancement : elle ouvre les bêtas (Passcord) dans le catalogue.
  const cord = refreshCord().catch(() => {});
  // Registre des apps iPhone : la pastille « à renouveler » de la barre latérale.
  void refreshIphoneApps().catch(() => {});
  const catalog = await loadCatalog();
  if (catalog) await detectInstalled(catalog.apps);
  // Le Compte Cord montre ce que ce PC a installé (tuile CordLauncher du hub).
  await cord;
  if (catalog) void publishLauncherStatus(catalog.apps, installedSnapshot(), LAUNCHER_VERSION).catch(() => {});
  // iPhone : nouvelles versions et renouvellements automatiques (si activés),
  // au lancement puis toutes les 10 minutes (dès que l'iPhone est branché).
  if (catalog) {
    const tick = () => {
      void runIphoneAuto(catalog.apps, cordSnapshot().user).catch(() => {});
      void runAppUpdates(catalog.apps).catch(() => {});
    };
    tick();
    setInterval(tick, 10 * 60_000);
  }
}

export default function App() {
  const reduceMotion = useSettings((s) => s.reduceMotion);
  const [phase, setPhase] = useState<"splash" | "ready">(SKIP_INTRO ? "ready" : "splash");
  const endSplash = useCallback(() => setPhase("ready"), []);

  useEffect(() => {
    void boot();
  }, []);

  return (
    <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>
      <AmbientProvider>
        <LayoutGroup>
          <Stage phase={phase} onSplashDone={endSplash} />
        </LayoutGroup>
      </AmbientProvider>
    </MotionConfig>
  );
}

function Stage({ phase, onSplashDone }: { phase: "splash" | "ready"; onSplashDone: () => void }) {
  const { tint } = useAmbient();
  // La teinte de l'ambiance descend dans tout l'arbre : barre latérale,
  // titres, pastille de navigation se colorent avec l'app sélectionnée.
  const tintStyle = {
    "--tint-a": tint[0],
    "--tint-b": tint[1],
    transition: "--tint-a 1.2s var(--ease-glass), --tint-b 1.2s var(--ease-glass)",
  } as CSSProperties;

  return (
    <div className="relative h-full w-full overflow-hidden" style={tintStyle}>
      <AnimatedGradientBackground />
      <AnimatePresence>
        {phase === "splash" && <SplashIntro key="splash" onDone={onSplashDone} />}
      </AnimatePresence>
      {phase === "ready" && <Shell />}
      <Toaster />
    </div>
  );
}

function Shell() {
  const catalog = useCatalog();
  const apps = catalog.status === "ready" ? catalog.catalog.apps : NO_APPS;
  const { scrollY } = useAmbient();

  const [route, setRoute] = useState<Route>("discover");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  // Ctrl+K : droit à la recherche, depuis n'importe quel écran.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setRoute("discover");
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Navigation demandée depuis une fenêtre (ex. « Se connecter au Compte Cord »).
  useEffect(() => {
    const onNavigate = (e: Event) => setRoute((e as CustomEvent<Route>).detail);
    window.addEventListener(NAVIGATE_EVENT, onNavigate);
    return () => window.removeEventListener(NAVIGATE_EVENT, onNavigate);
  }, []);

  const onQuery = (q: string) => {
    setQuery(q);
    if (q && route !== "discover") setRoute("discover");
  };

  const selected = apps.find((a) => a.id === selectedId) ?? null;
  const closeDetail = useCallback(() => setSelectedId(null), []);

  return (
    <div className="relative z-10 flex h-full flex-col">
      <TitleBar query={query} onQuery={onQuery} searchRef={searchRef} />
      <div className="flex min-h-0 flex-1 gap-3 px-3 pb-3">
        <Sidebar route={route} onRoute={setRoute} apps={apps} />
        <main
          ref={mainRef}
          onScroll={(e) => scrollY.set(e.currentTarget.scrollTop)}
          className="scroll-glass relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-[28px]"
        >
          <AnimatePresence
            mode="wait"
            onExitComplete={() => {
              mainRef.current?.scrollTo({ top: 0 });
              scrollY.set(0);
            }}
          >
            {route === "discover" && (
              <DiscoverView
                key="discover"
                catalog={catalog}
                query={query}
                onClearQuery={() => setQuery("")}
                onOpen={setSelectedId}
                onRetry={() => void boot()}
              />
            )}
            {route === "library" && (
              <LibraryView key="library" apps={apps} onOpen={setSelectedId} onDiscover={() => setRoute("discover")} />
            )}
            {route === "iphone" && <IphoneView key="iphone" apps={apps} onDiscover={() => setRoute("discover")} />}
            {route === "settings" && <SettingsView key="settings" />}
            {route === "account" && <AccountView key="account" />}
          </AnimatePresence>
        </main>
      </div>
      <AppDetail app={selected} onClose={closeDetail} />
      <IphoneInstallSheet apps={apps} />
      <InstallSheet />
      <BetaKeySheet apps={apps} />
      <AppleVerification />
    </div>
  );
}
