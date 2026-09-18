import { generateKeyPairSync } from 'node:crypto';

/**
 * Configuration lue depuis l'environnement, partagée entre l'entrée locale
 * (`server.mjs`) et la fonction Vercel (`api/index.mjs`).
 */

export function readClients() {
  try {
    return JSON.parse(process.env.CORD_CLIENTS ?? '{}');
  } catch {
    console.error('CORD_CLIENTS n’est pas un JSON valide — aucun client OAuth chargé.');
    return {};
  }
}

/**
 * Clé de signature OIDC (PEM privé RSA). En production elle vient de
 * `CORD_OIDC_KEY` (posée une fois pour toutes) : sans ça, deux instances
 * serverless signeraient avec des clés différentes. En développement, si la
 * variable manque, on en génère une éphémère.
 */
export function readOidcKey({ allowEphemeral = false } = {}) {
  const raw = process.env.CORD_OIDC_KEY;
  if (raw && raw.trim()) {
    // Acceptée telle quelle (PEM) ou encodée en base64 (plus simple à stocker).
    return raw.includes('BEGIN') ? raw : Buffer.from(raw, 'base64').toString('utf8');
  }
  if (!allowEphemeral) throw new Error('CORD_OIDC_KEY manquante.');
  console.warn('CORD_OIDC_KEY manquante : clé éphémère générée (développement uniquement).');
  return generateKeyPairSync('rsa', {
    modulusLength: 2048,
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    publicKeyEncoding: { type: 'spki', format: 'pem' },
  }).privateKey;
}

/** Envoi d'email via Resend, si configuré ; sinon lien affiché (dev local). */
export function makeSendVerification({ localDev }) {
  if (process.env.RESEND_API_KEY && process.env.CORD_MAIL_FROM) {
    return async ({ email, url }) => {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        signal: AbortSignal.timeout(15_000),
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.CORD_MAIL_FROM,
          to: [email],
          subject: 'Confirme ton compte Cord',
          text: `Confirme ton adresse en ouvrant ce lien (valable 15 minutes) :\n${url}\n\nSi tu n’as pas demandé cette confirmation, ignore cet email.`,
        }),
      });
      if (!response.ok) throw new Error('Email delivery failed');
    };
  }
  if (localDev) {
    return async ({ url }) => {
      console.log(`Confirmation locale (développement uniquement) : ${url}`);
      return { devUrl: url };
    };
  }
  return undefined;
}
