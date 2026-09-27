/**
 * Formats français. Les tailles sont en base 1000 (« 4,6 Mo ») pour coller
 * aux notes de version publiées, qui comptent comme ça.
 */

const nf1 = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });
const nf0 = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1000) return `${nf0.format(bytes)} o`;
  const units = ["Ko", "Mo", "Go", "To"];
  let value = bytes / 1000;
  let i = 0;
  while (value >= 1000 && i < units.length - 1) {
    value /= 1000;
    i++;
  }
  return `${value >= 100 ? nf0.format(value) : nf1.format(value)} ${units[i]}`;
}

export function formatSpeed(bytesPerSecond: number): string {
  return `${formatBytes(bytesPerSecond)}/s`;
}

export function formatEta(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds)) return "";
  if (seconds < 1) return "moins d'une seconde";
  if (seconds < 60) return `~${Math.ceil(seconds)} s restantes`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `~${m} min ${String(s).padStart(2, "0")} restantes`;
}

export function formatDate(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dateFmt.format(d);
}

export function formatPercent(ratio: number): string {
  return `${nf0.format(Math.max(0, Math.min(1, ratio)) * 100)} %`;
}

/**
 * Compare deux versions « x.y.z[-suffixe][+build] ».
 * > 0 si `a` est plus récente que `b`. Suit la règle semver : à numéros
 * égaux, une version sans suffixe (« 1.2.0 ») est plus récente que la même
 * avec un suffixe de pré-version ou de build (« 1.2.0-rc1 », « 1.2.0+42 »).
 */
export function compareVersions(a: string, b: string): number {
  const parse = (v: string) => {
    const clean = v.replace(/^v/i, "");
    const core = clean.split(/[-+]/)[0];
    return {
      parts: core.split(".").map((n) => Number.parseInt(n, 10) || 0),
      hasSuffix: clean.length > core.length,
    };
  };
  const pa = parse(a);
  const pb = parse(b);
  for (let i = 0; i < Math.max(pa.parts.length, pb.parts.length); i++) {
    const d = (pa.parts[i] ?? 0) - (pb.parts[i] ?? 0);
    if (d !== 0) return d;
  }
  if (pa.hasSuffix !== pb.hasSuffix) return pa.hasSuffix ? -1 : 1;
  return 0;
}
