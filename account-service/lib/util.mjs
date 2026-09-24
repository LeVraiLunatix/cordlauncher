import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';

/** Petits utilitaires partagés par le service (aucun état). */

export const secret = () => randomBytes(32).toString('base64url');
export const hash = (value) => createHash('sha256').update(value).digest('base64url');
export const now = () => Date.now();
export const b64u = (buf) => Buffer.from(buf).toString('base64url');

export const DAY = 86400_000;
export const SESSION_TTL = 7 * DAY;
export const CHALLENGE_TTL = 3 * 60_000;

/** Erreur HTTP renvoyée telle quelle au client (`code` = clé de traduction du portail). */
export const error = (status, message, code) => Object.assign(new Error(message), { status, ...(code ? { code } : {}) });

export const safeEqual = (a, b) => {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return aa.length === bb.length && timingSafeEqual(aa, bb);
};

/** IP tronquée pour l'affichage (la valeur complète reste en base, exportable). */
export function maskIp(ip) {
  if (!ip) return null;
  if (ip.includes(':')) return `${ip.split(':').slice(0, 3).join(':')}::`;
  const parts = ip.split('.');
  return parts.length === 4 ? `${parts[0]}.${parts[1]}.•.•` : null;
}
