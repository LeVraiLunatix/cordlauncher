import { createContext, useContext } from "react";
import type { CordDashboard } from "../../lib/account";
import type { ModalSpec } from "./kit";

export type AccountTab = "apercu" | "securite" | "appareils" | "apps" | "profil" | "activite" | "confidentialite" | "admin";

/** Ce que chaque page du compte reçoit : les données et de quoi agir. */
export type AccountCtx = {
  d: CordDashboard;
  /** Recharge le tableau de bord (après une action). */
  reload: () => Promise<void>;
  /** Ouvre une modale d'action. */
  openModal: (spec: ModalSpec) => void;
  /** Demande le mot de passe (mode sudo) ; `null` si annulé. */
  askPassword: () => Promise<string | null>;
  go: (tab: AccountTab) => void;
};

export const AccountContext = createContext<AccountCtx | null>(null);
export function useAccount(): AccountCtx {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount hors de AccountContext");
  return ctx;
}
