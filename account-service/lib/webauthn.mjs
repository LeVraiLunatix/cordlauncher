import { createHash, createPublicKey, verify } from 'node:crypto';

/**
 * Passkeys (WebAuthn niveau 2) sans dépendance : décodage CBOR minimal,
 * lecture des authenticatorData, conversion COSE → JWK et vérification de la
 * signature d'assertion. On demande l'attestation « none » : on ne vérifie
 * donc pas la provenance du matériel, seulement la possession de la clé.
 */

const sha256 = (data) => createHash('sha256').update(data).digest();

/** Décodeur CBOR (RFC 8949) limité à ce qu'utilise WebAuthn. Renvoie { value, end }. */
export function decodeCbor(buf, start = 0, depth = 0) {
  if (depth > 16) throw new Error('CBOR trop imbriqué.');
  let pos = start;
  const need = (n) => {
    if (pos + n > buf.length) throw new Error('CBOR tronqué.');
  };
  need(1);
  const initial = buf[pos++];
  const major = initial >> 5;
  const info = initial & 31;
  let length;
  if (info < 24) length = info;
  else if (info === 24) { need(1); length = buf[pos]; pos += 1; }
  else if (info === 25) { need(2); length = buf.readUInt16BE(pos); pos += 2; }
  else if (info === 26) { need(4); length = buf.readUInt32BE(pos); pos += 4; }
  else if (info === 27) {
    need(8);
    const big = buf.readBigUInt64BE(pos);
    if (big > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('Entier CBOR trop grand.');
    length = Number(big);
    pos += 8;
  } else throw new Error('CBOR indéfini non pris en charge.');

  switch (major) {
    case 0: return { value: length, end: pos };
    case 1: return { value: -1 - length, end: pos };
    case 2: need(length); return { value: buf.subarray(pos, pos + length), end: pos + length };
    case 3: need(length); return { value: buf.subarray(pos, pos + length).toString('utf8'), end: pos + length };
    case 4: {
      const out = [];
      for (let i = 0; i < length; i++) {
        const item = decodeCbor(buf, pos, depth + 1);
        out.push(item.value);
        pos = item.end;
      }
      return { value: out, end: pos };
    }
    case 5: {
      const out = new Map();
      for (let i = 0; i < length; i++) {
        const key = decodeCbor(buf, pos, depth + 1);
        const val = decodeCbor(buf, key.end, depth + 1);
        out.set(key.value, val.value);
        pos = val.end;
      }
      return { value: out, end: pos };
    }
    case 7:
      if (info === 20) return { value: false, end: pos };
      if (info === 21) return { value: true, end: pos };
      if (info === 22) return { value: null, end: pos };
      throw new Error('Valeur CBOR non prise en charge.');
    default:
      throw new Error('Type CBOR non pris en charge.');
  }
}

/** Analyse des authenticatorData (§6.1). */
export function parseAuthData(data) {
  if (data.length < 37) throw new Error('authenticatorData trop court.');
  const flags = data[32];
  const out = {
    rpIdHash: data.subarray(0, 32),
    up: Boolean(flags & 0x01),
    uv: Boolean(flags & 0x04),
    backupEligible: Boolean(flags & 0x08),
    backedUp: Boolean(flags & 0x10),
    hasCredential: Boolean(flags & 0x40),
    signCount: data.readUInt32BE(33),
  };
  if (out.hasCredential) {
    if (data.length < 55) throw new Error('Données de clé manquantes.');
    const idLength = data.readUInt16BE(53);
    if (idLength > 1023 || data.length < 55 + idLength) throw new Error('Identifiant de clé invalide.');
    out.aaguid = data.subarray(37, 53);
    out.credentialId = data.subarray(55, 55 + idLength);
    const key = decodeCbor(data, 55 + idLength);
    out.cosePublicKey = key.value;
  }
  return out;
}

/** Clé COSE → { jwk, alg } utilisable par node:crypto. */
export function coseToJwk(cose) {
  if (!(cose instanceof Map)) throw new Error('Clé COSE invalide.');
  const kty = cose.get(1);
  const alg = cose.get(3);
  const b64 = (v) => Buffer.from(v).toString('base64url');
  if (kty === 2 && alg === -7 && cose.get(-1) === 1) {
    return { alg, jwk: { kty: 'EC', crv: 'P-256', x: b64(cose.get(-2)), y: b64(cose.get(-3)) } };
  }
  if (kty === 1 && alg === -8 && cose.get(-1) === 6) {
    return { alg, jwk: { kty: 'OKP', crv: 'Ed25519', x: b64(cose.get(-2)) } };
  }
  if (kty === 3 && alg === -257) {
    return { alg, jwk: { kty: 'RSA', n: b64(cose.get(-1)), e: b64(cose.get(-2)) } };
  }
  throw new Error('Algorithme de clé non pris en charge.');
}

function checkClientData(raw, { type, challenge, origin }) {
  let client;
  try {
    client = JSON.parse(Buffer.from(raw).toString('utf8'));
  } catch {
    throw new Error('clientDataJSON illisible.');
  }
  if (client.type !== type) throw new Error('Type de cérémonie inattendu.');
  if (client.challenge !== challenge) throw new Error('Défi WebAuthn incorrect.');
  if (client.origin !== origin) throw new Error('Origine WebAuthn incorrecte.');
  if (client.crossOrigin === true) throw new Error('Cérémonie inter-origines refusée.');
  return client;
}

/** Vérifie une création de passkey (navigator.credentials.create). */
export function verifyRegistration({ clientDataJSON, attestationObject, challenge, origin, rpId }) {
  checkClientData(clientDataJSON, { type: 'webauthn.create', challenge, origin });
  const attestation = decodeCbor(Buffer.from(attestationObject)).value;
  if (!(attestation instanceof Map) || !Buffer.isBuffer(attestation.get('authData'))) throw new Error('Attestation invalide.');
  const auth = parseAuthData(attestation.get('authData'));
  if (!auth.rpIdHash.equals(sha256(rpId))) throw new Error('Domaine de la passkey incorrect.');
  if (!auth.up) throw new Error('Présence de l’utilisateur non confirmée.');
  if (!auth.uv) throw new Error('Vérification de l’utilisateur (Face ID, code…) requise.');
  if (!auth.hasCredential) throw new Error('Aucune clé dans la réponse.');
  const { jwk, alg } = coseToJwk(auth.cosePublicKey);
  createPublicKey({ key: jwk, format: 'jwk' }); // rejette une clé mal formée
  return {
    credentialId: auth.credentialId.toString('base64url'),
    jwk,
    alg,
    signCount: auth.signCount,
    backedUp: auth.backedUp,
    aaguid: auth.aaguid.toString('hex'),
  };
}

/** Vérifie une assertion (navigator.credentials.get) avec la clé enregistrée. */
export function verifyAssertion({ clientDataJSON, authenticatorData, signature, challenge, origin, rpId, jwk, alg, storedSignCount = 0 }) {
  checkClientData(clientDataJSON, { type: 'webauthn.get', challenge, origin });
  const authData = Buffer.from(authenticatorData);
  const auth = parseAuthData(authData);
  if (!auth.rpIdHash.equals(sha256(rpId))) throw new Error('Domaine de la passkey incorrect.');
  if (!auth.up) throw new Error('Présence de l’utilisateur non confirmée.');
  if (!auth.uv) throw new Error('Vérification de l’utilisateur (Face ID, code…) requise.');
  const signed = Buffer.concat([authData, sha256(Buffer.from(clientDataJSON))]);
  const key = createPublicKey({ key: jwk, format: 'jwk' });
  const ok = verify(alg === -8 ? null : 'sha256', signed, key, Buffer.from(signature));
  if (!ok) throw new Error('Signature de la passkey invalide.');
  // Compteur : 0 partout = authentificateur synchronisé (iCloud, Google…) ;
  // sinon il doit croître, faute de quoi la clé a peut-être été clonée.
  if ((auth.signCount || storedSignCount) && auth.signCount <= storedSignCount) throw new Error('Compteur de la passkey incohérent.');
  return { signCount: auth.signCount, backedUp: auth.backedUp };
}
