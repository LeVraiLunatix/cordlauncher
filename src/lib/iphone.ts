import type { CatalogApp, IosSpec } from "./catalog/types";
import { IS_TAURI } from "./platform";
import { createStore, useStore } from "./store";

/**
 * Installation sur iPhone.
 *
 * iOS refuse toute app qui n'est pas signée par Apple ou par le compte de
 * l'utilisateur. Plutôt que de réimplémenter la signature (identifiants
 * Apple dans CordLauncher, apps qui expirent au bout de 7 jours sans
 * personne pour les renouveler), on s'appuie sur AltStore :
 *
 *   CordLauncher affiche un QR code  →  l'iPhone le scanne  →  AltStore
 *   s'ouvre, télécharge l'IPA et la signe via AltServer (sur ce PC)  →
 *   installée, puis re-signée toute seule tous les 7 jours.
 *
 * C'est aussi la seule méthode qui garde les droits de partage dont
 * Passcord a besoin (Sideloadly les retire).
 */

export type IosInstallMode = "install" | "source";

/** L'app a-t-elle une version iPhone installable dès maintenant ? */
export function canInstallOnIphone(ios: IosSpec | undefined): ios is IosSpec {
  return !!ios && ios.status === "available" && !!(ios.ipaUrl || ios.altstoreSource);
}

/**
 * Lien profond ouvert par l'appareil photo de l'iPhone.
 *  - `install` : AltStore télécharge et installe l'IPA tout de suite ;
 *  - `source`  : AltStore ajoute la source, et proposera chaque mise à jour.
 */
export function altstoreLink(ios: IosSpec, mode: IosInstallMode): string | null {
  if (mode === "install" && ios.ipaUrl) return `altstore://install?url=${encodeQueryValue(ios.ipaUrl)}`;
  if (mode === "source" && ios.altstoreSource) return `altstore://source?url=${encodeQueryValue(ios.altstoreSource)}`;
  return null;
}

/**
 * N'échappe que ce qui casserait la lecture du paramètre (`&`, `#`, `%`,
 * `+`, espaces). `encodeURIComponent` transformerait aussi chaque `/` et `:`
 * en `%2F`/`%3A` : lien plus long, QR code plus dense, plus dur à scanner —
 * et AltStore lit très bien l'URL telle quelle.
 */
function encodeQueryValue(url: string): string {
  return url.replace(/[%&#+\s]/g, (c) => encodeURIComponent(c));
}

// ── AltServer (côté PC) ────────────────────────────────────────────────────

/** `null` = impossible à savoir (front ouvert dans un navigateur). */
export type AltServerStatus = { installed: boolean; running: boolean } | null;

export async function getAltServerStatus(): Promise<AltServerStatus> {
  if (!IS_TAURI) return null;
  const { invoke } = await import("@tauri-apps/api/core");
  return invoke<{ installed: boolean; running: boolean }>("altserver_status");
}

export async function launchAltServer(): Promise<void> {
  if (!IS_TAURI) return;
  const { invoke } = await import("@tauri-apps/api/core");
  await invoke("altserver_launch");
}

// ── Fenêtre d'installation (ouverte depuis la carte, le bandeau, la fiche) ─

const sheetStore = createStore<string | null>(null);

export function openIphoneInstall(app: CatalogApp): void {
  sheetStore.set(app.id);
}

export function closeIphoneInstall(): void {
  sheetStore.set(null);
}

export function useIphoneSheet(): string | null {
  return useStore(sheetStore, (s) => s);
}
