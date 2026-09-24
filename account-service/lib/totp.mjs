import { createHmac, randomBytes } from 'node:crypto';
import { hash, safeEqual } from './util.mjs';

/** TOTP (RFC 6238, SHA-1, 6 chiffres, 30 s) et codes de secours. */

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const STEP_MS = 30_000;

export function base32Encode(bytes) {
  let bits = 0;
  let value = 0;
  let out = '';
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) out += ALPHABET[(value >>> (bits -= 5)) & 31];
  }
  if (bits) out += ALPHABET[(value << (5 - bits)) & 31];
  return out;
}

export function base32Decode(text) {
  let bits = 0;
  let value = 0;
  const out = [];
  for (const char of text.replace(/[\s=]+/g, '').toUpperCase()) {
    const n = ALPHABET.indexOf(char);
    if (n < 0) throw new Error('Secret TOTP invalide.');
    value = (value << 5) | n;
    bits += 5;
    if (bits >= 8) out.push((value >>> (bits -= 8)) & 255);
  }
  return Buffer.from(out);
}

export const generateTotpSecret = () => base32Encode(randomBytes(20));

export function totpAt(secretText, step) {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(step));
  const mac = createHmac('sha1', base32Decode(secretText)).update(msg).digest();
  const offset = mac[mac.length - 1] & 15;
  return String((mac.readUInt32BE(offset) & 0x7fffffff) % 1_000_000).padStart(6, '0');
}

/**
 * Renvoie le pas de temps validé, ou `null`. `lastStep` interdit de rejouer
 * un code déjà consommé (ou plus ancien) ; tolérance de ±1 pas (dérive d'horloge).
 */
export function verifyTotp(secretText, code, lastStep = 0, at = Date.now()) {
  const clean = String(code ?? '').replace(/\s+/g, '');
  if (!/^\d{6}$/.test(clean)) return null;
  const current = Math.floor(at / STEP_MS);
  for (const delta of [0, -1, 1]) {
    const step = current + delta;
    if (step > lastStep && safeEqual(totpAt(secretText, step), clean)) return step;
  }
  return null;
}

export function otpauthUri({ secret: secretText, account, issuer = 'Cord' }) {
  const label = `${encodeURIComponent(issuer)}:${encodeURIComponent(account)}`;
  return `otpauth://totp/${label}?secret=${secretText}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
}

/** Codes de secours : `xxxxx-xxxxx` (hex). On ne stocke que leur empreinte. */
export const generateRecoveryCodes = (count = 10) =>
  Array.from({ length: count }, () => {
    const hex = randomBytes(5).toString('hex');
    return `${hex.slice(0, 5)}-${hex.slice(5)}`;
  });
export const normalizeRecoveryCode = (code) => String(code ?? '').toLowerCase().replace(/[^a-f0-9]/g, '');
export const hashRecoveryCode = (code) => hash(`recovery:${normalizeRecoveryCode(code)}`);
