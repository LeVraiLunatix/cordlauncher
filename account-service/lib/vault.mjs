import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from 'node:crypto';

/**
 * Chiffrement au repos des secrets (TOTP) : AES-256-GCM, clé dérivée par HKDF.
 *
 * `materials` = matériaux de clé par ordre de préférence : `CORD_DATA_KEY` si
 * elle existe, puis la clé OIDC (déjà secrète et stable). On chiffre toujours
 * avec le premier, on sait déchiffrer avec tous : poser `CORD_DATA_KEY` plus
 * tard ne rend donc pas illisibles les secrets déjà enregistrés. Une fuite de
 * la base seule n'expose pas les secrets TOTP.
 */
export function createVault(...materials) {
  const keys = materials
    .filter(Boolean)
    .map((material) => Buffer.from(hkdfSync('sha256', Buffer.from(material), 'cord-account', 'cord-vault-v1', 32)));
  if (!keys.length) throw new Error('Aucune clé de chiffrement.');
  return {
    seal(plain) {
      const iv = randomBytes(12);
      const cipher = createCipheriv('aes-256-gcm', keys[0], iv);
      const body = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()]);
      return ['v1', iv.toString('base64url'), cipher.getAuthTag().toString('base64url'), body.toString('base64url')].join('.');
    },
    /** Renvoie le texte clair, ou `null` si aucune clé ne l'ouvre. */
    open(sealed) {
      const [version, iv, tag, body] = String(sealed).split('.');
      if (version !== 'v1' || !body) return null;
      for (const key of keys) {
        try {
          const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'base64url'));
          decipher.setAuthTag(Buffer.from(tag, 'base64url'));
          return Buffer.concat([decipher.update(Buffer.from(body, 'base64url')), decipher.final()]).toString('utf8');
        } catch {
          /* clé suivante */
        }
      }
      return null;
    },
  };
}
