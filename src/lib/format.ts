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
 * Compare deux versions « x.y.z » (suffixes de pré-version ignorés).
 * > 0 si `a` est plus récente que `b`.
 */
export function compareVersions(a: string, b: string): number {
  const parse = (v: string) =>
    v
      .replace(/^v/i, "")
      .split(/[-+]/)[0]
      .split(".")
      .map((n) => Number.parseInt(n, 10) || 0);
  const pa = parse(a);
  const pb = parse(b);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}
