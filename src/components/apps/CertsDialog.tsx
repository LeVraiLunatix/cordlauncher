import { ShieldAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { initApple, respondCerts, useApple, type CertInfo } from "../../lib/apple";
import { cn } from "../../lib/cn";
import { toast } from "../../lib/toast";
import { GlassButton, GlassModal } from "../glass";

/**
 * Apple limite un compte gratuit à 2 certificats de développement. Quand il est
 * plein et qu'aucun ne vient de CordLauncher, on montre la liste et l'utilisateur
 * choisit lesquels révoquer : rien n'est révoqué à son insu.
 */
export function CertsDialog() {
  const { certPrompt } = useApple();
  useEffect(() => { void initApple().catch(error => toast({ tone: "error", title: "Certificats Apple indisponibles", description: String(error) })); }, []);
  // Garde le contenu pendant l'animation de fermeture.
  const last = useRef<CertInfo[] | null>(certPrompt);
  if (certPrompt) last.current = certPrompt;
  const shown = certPrompt ?? last.current;

  return (
    <GlassModal open={!!certPrompt} onClose={() => void respondCerts(null)} width={520} labelledBy="certs-title">
      {shown && <Body certs={shown} />}
    </GlassModal>
  );
}

function Body({ certs }: { certs: CertInfo[] }) {
  const [picked, setPicked] = useState<Set<string>>(() => new Set());
  const toggle = (serial: string) =>
    setPicked(prev => { const next = new Set(prev); if (next.has(serial)) next.delete(serial); else next.add(serial); return next; });

  return (
    <div className="relative z-[3] flex flex-col gap-5 px-8 pt-9 pb-7">
      <div className="space-y-2 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[var(--control)]"><ShieldAlert className="size-6 text-fg-muted" /></div>
        <h2 id="certs-title" className="font-display text-[22px] font-semibold tracking-[-0.02em]">Ton compte Apple est plein</h2>
        <p className="mx-auto max-w-[400px] text-sm leading-relaxed text-fg-muted">
          Un compte gratuit n’a droit qu’à 2 certificats, et aucun ne vient de CordLauncher (AltStore, Sideloadly…). Pour signer tes apps, il faut en révoquer un.
          Les apps signées avec ce certificat ne s’ouvriront plus tant que l’outil d’origine ne les aura pas re-signées.
        </p>
      </div>

      <ul className="space-y-2">
        {certs.map(c => (
          <li key={c.serial}>
            <button
              type="button"
              onClick={() => toggle(c.serial)}
              aria-pressed={picked.has(c.serial)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors",
                picked.has(c.serial) ? "border-[var(--tint-a)] bg-[var(--control)]" : "border-[var(--hairline,rgba(255,255,255,0.12))] hover:bg-[var(--control)]",
              )}
            >
              <span className={cn("grid size-5 shrink-0 place-items-center rounded-md border text-[11px]", picked.has(c.serial) ? "border-transparent bg-[var(--tint-a)] text-white" : "border-current opacity-40")}>
                {picked.has(c.serial) ? "✓" : ""}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{c.machine || c.name || "Certificat sans nom"}</span>
                <span className="block truncate font-mono text-[11px] text-fg-subtle">{c.name ? `${c.name} · ` : ""}n° {c.serial.slice(-8)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-end gap-2">
        <GlassButton onClick={() => void respondCerts(null)}>Annuler</GlassButton>
        <GlassButton variant="primary" disabled={picked.size === 0} onClick={() => void respondCerts([...picked])}>
          Révoquer et continuer
        </GlassButton>
      </div>
    </div>
  );
}
