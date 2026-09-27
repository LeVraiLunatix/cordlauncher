/**
 * Web Push (RFC 8030 / 8291 / 8292) sans dépendance : notifications envoyées
 * au Compte Cord installé comme app web (écran d'accueil de l'iPhone, Chrome,
 * Edge…). iOS refuse les notifications natives aux apps signées avec un compte
 * Apple gratuit ; la web app, elle, les reçoit comme n'importe quelle app.
 *
 *   const keys = generateVapidKeys();               // une fois, gardées chiffrées
 *   await sendPush(subscription, { title, body, url }, { keys, subject, fetchImpl });
 */
import { createCipheriv, createECDH, createPrivateKey, hkdfSync, randomBytes, sign } from 'node:crypto';

const b64u = (buf) => Buffer.from(buf).toString('base64url');
const fromB64u = (text) => Buffer.from(String(text), 'base64url');

/** Paire VAPID P-256 : `publicKey` (point non compressé, base64url) et `privateKey` (d, base64url). */
export function generateVapidKeys() {
  const ecdh = createECDH('prime256v1');
  ecdh.generateKeys();
  return { publicKey: b64u(ecdh.getPublicKey()), privateKey: b64u(ecdh.getPrivateKey()) };
}

function vapidKey({ publicKey, privateKey }) {
  const point = fromB64u(publicKey);
  return createPrivateKey({
    format: 'jwk',
    key: { kty: 'EC', crv: 'P-256', x: b64u(point.subarray(1, 33)), y: b64u(point.subarray(33, 65)), d: privateKey },
  });
}

/** Jeton VAPID (JWT ES256) pour l'origine du service de push. */
export function vapidHeader(endpoint, keys, subject, now = Date.now()) {
  const header = b64u(JSON.stringify({ typ: 'JWT', alg: 'ES256' }));
  // Une heure : le service de push d'Apple refuse les jetons trop longs.
  const claims = b64u(JSON.stringify({ aud: new URL(endpoint).origin, exp: Math.floor(now / 1000) + 3600, sub: subject }));
  const signature = sign('sha256', Buffer.from(`${header}.${claims}`), { key: vapidKey(keys), dsaEncoding: 'ieee-p1363' });
  return `vapid t=${header}.${claims}.${b64u(signature)}, k=${keys.publicKey}`;
}

/** Chiffre le contenu pour un abonnement (aes128gcm, un seul enregistrement). */
export function encryptPayload(payload, { p256dh, auth }, { salt = randomBytes(16), ecdh } = {}) {
  const uaPublic = fromB64u(p256dh);
  const authSecret = fromB64u(auth);
  if (uaPublic.length !== 65 || authSecret.length !== 16) throw new Error('Abonnement push invalide.');
  if (!ecdh) {
    ecdh = createECDH('prime256v1');
    ecdh.generateKeys();
  }
  const asPublic = ecdh.getPublicKey();
  const shared = ecdh.computeSecret(uaPublic);
  const keyInfo = Buffer.concat([Buffer.from('WebPush: info\0'), uaPublic, asPublic]);
  const ikm = Buffer.from(hkdfSync('sha256', shared, authSecret, keyInfo, 32));
  const cek = Buffer.from(hkdfSync('sha256', ikm, salt, Buffer.from('Content-Encoding: aes128gcm\0'), 16));
  const nonce = Buffer.from(hkdfSync('sha256', ikm, salt, Buffer.from('Content-Encoding: nonce\0'), 12));
  const cipher = createCipheriv('aes-128-gcm', cek, nonce);
  // 0x02 : délimiteur du dernier (et seul) enregistrement.
  const body = Buffer.concat([cipher.update(Buffer.concat([Buffer.from(payload), Buffer.from([2])])), cipher.final(), cipher.getAuthTag()]);
  const header = Buffer.alloc(21);
  salt.copy(header, 0);
  header.writeUInt32BE(4096, 16);
  header.writeUInt8(asPublic.length, 20);
  return Buffer.concat([header, asPublic, body]);
}

/**
 * Envoie une notification. Renvoie `'sent'`, `'gone'` (abonnement mort : à
 * supprimer) ou `'failed'`.
 */
export async function sendPush(subscription, message, { keys, subject, fetchImpl = fetch, ttl = 300, urgency = 'high' }) {
  const endpoint = new URL(subscription.endpoint);
  if (endpoint.protocol !== 'https:') return 'gone';
  try {
    const res = await fetchImpl(endpoint.href, {
      method: 'POST',
      headers: {
        Authorization: vapidHeader(endpoint.href, keys, subject),
        TTL: String(ttl),
        Urgency: urgency,
        'Content-Encoding': 'aes128gcm',
        'Content-Type': 'application/octet-stream',
      },
      body: encryptPayload(JSON.stringify(message), subscription),
      signal: AbortSignal.timeout(8000),
    });
    if (res.status === 404 || res.status === 410) return 'gone';
    return res.ok ? 'sent' : 'failed';
  } catch {
    return 'failed';
  }
}
