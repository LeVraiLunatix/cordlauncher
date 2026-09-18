import { ArrowDown, Check, Clock3, LockKeyhole } from "lucide-react";
import type { CatalogApp } from "../../lib/catalog/types";
import { useAppAction } from "../../lib/installer";
import { useCordAccount } from "../../lib/account";
import { hasBetaAdminAccess } from "../../lib/catalog/access";
import { Badge } from "../glass";

/** Pastille d'état d'une app (coin haut-droit des cartes, en-tête de fiche). */
export function StatusBadge({ app }: { app: CatalogApp }) {
  const action = useAppAction(app);
  const account = useCordAccount();

  if (app.status === "coming-soon") {
    return (
      <Badge tone="neutral" icon={<Clock3 className="size-3" />}>
        Bientôt
      </Badge>
    );
  }
  if (app.status === "closed-beta") {
    return (
      <Badge tone="info" icon={<LockKeyhole className="size-3" />}>
        {hasBetaAdminAccess(app, account.user?.email) ? "Bêta · accès admin" : "Bêta fermée"}
      </Badge>
    );
  }
  if (action.kind === "update") {
    return (
      <Badge tone="tint" shine icon={<ArrowDown className="size-3 animate-bounce" />}>
        Mise à jour
      </Badge>
    );
  }
  if (action.kind === "open") {
    return (
      <Badge tone="ok" icon={<Check className="size-3" strokeWidth={3} />}>
        Installée
      </Badge>
    );
  }
  return (
    <Badge tone="ok" pulse>
      Disponible
    </Badge>
  );
}
