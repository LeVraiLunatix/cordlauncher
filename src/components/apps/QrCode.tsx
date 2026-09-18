import { useId, useMemo } from "react";
import { encode } from "uqr";
import type { Gradient } from "../../lib/catalog/types";

/** Valeur de `QrCodeDataType.Position` dans uqr : les trois repères de coin. */
const POSITION = 2;

type QrCodeProps = {
  value: string;
  /** Couleurs de l'app — assombries pour garder un contraste lisible par l'appareil photo. */
  colors: Gradient;
  /** Logo posé au centre (la correction d'erreur compense les modules masqués). */
  logo?: string;
  className?: string;
};

/**
 * QR code dessiné à la main en SVG : modules en points arrondis, repères de
 * coin en carrés arrondis, dégradé de l'app, logo au centre. Les points
 * apparaissent en vague depuis le centre à chaque nouveau contenu (la clé
 * `value` remonte le SVG).
 */
export function QrCode({ value, colors, logo, className }: QrCodeProps) {
  const gradientId = useId();
  // Niveau Q (25 % de redondance) : assez pour le logo, qui masque ~6 % des
  // modules, sans densifier le code autant que le niveau H.
  const qr = useMemo(() => encode(value, { ecc: logo ? "Q" : "M", border: 0 }), [value, logo]);
  const n = qr.size;

  // Zone réservée au logo : ~22 % de la largeur, impaire pour rester centrée.
  const logoSpan = logo ? Math.floor(n * 0.22) | 1 : 0;
  const logoStart = (n - logoSpan) / 2;
  const underLogo = (x: number, y: number) =>
    logoSpan > 0 &&
    x >= logoStart - 1 &&
    x < logoStart + logoSpan + 1 &&
    y >= logoStart - 1 &&
    y < logoStart + logoSpan + 1;

  const center = (n - 1) / 2;
  const maxDist = Math.hypot(center, center);

  const dots: { x: number; y: number; delay: number }[] = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!qr.data[y][x] || qr.types[y][x] === POSITION || underLogo(x, y)) continue;
      dots.push({ x, y, delay: (Math.hypot(x - center, y - center) / maxDist) * 0.55 });
    }
  }

  const finders: [number, number][] = [
    [0, 0],
    [n - 7, 0],
    [0, n - 7],
  ];

  return (
    <svg
      key={value}
      viewBox={`0 0 ${n} ${n}`}
      className={className}
      role="img"
      aria-label="QR code à scanner avec l'iPhone"
      shapeRendering="geometricPrecision"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={shade(colors[0], 0.5)} />
          <stop offset="100%" stopColor={shade(colors[1], 0.58)} />
        </linearGradient>
      </defs>

      <g fill={`url(#${gradientId})`}>
        {/* Carrés arrondis, pas des ronds : vérifié au décodeur (jsQR), des
            points ronds ne se lisent plus en petit, ceux-ci passent à toutes
            les tailles — logo et dégradé compris. */}
        {dots.map((d) => (
          <rect
            key={`${d.x}-${d.y}`}
            className="qr-dot"
            x={d.x + 0.03}
            y={d.y + 0.03}
            width={0.94}
            height={0.94}
            rx={0.3}
            style={{ animationDelay: `${d.delay.toFixed(3)}s` }}
          />
        ))}
      </g>

      {finders.map(([fx, fy], i) => (
        <g key={i} className="qr-finder" style={{ animationDelay: `${0.05 * i}s` }}>
          <rect
            x={fx + 0.5}
            y={fy + 0.5}
            width={6}
            height={6}
            rx={1.9}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={1}
          />
          <rect x={fx + 2} y={fy + 2} width={3} height={3} rx={0.95} fill={`url(#${gradientId})`} />
        </g>
      ))}

      {logo && (
        <g className="qr-finder" style={{ animationDelay: "0.3s" }}>
          <image
            href={logo}
            x={logoStart}
            y={logoStart}
            width={logoSpan}
            height={logoSpan}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      )}
    </svg>
  );
}

/** Assombrit une couleur hexadécimale (`amount` = part de noir, 0 → 1). */
function shade(hex: string, amount: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return "#111111";
  const v = Number.parseInt(m[1], 16);
  const k = 1 - amount;
  const r = Math.round(((v >> 16) & 255) * k);
  const g = Math.round(((v >> 8) & 255) * k);
  const b = Math.round((v & 255) * k);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
