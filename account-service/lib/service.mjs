import {
  randomBytes,
  randomUUID,
  scrypt as rawScrypt,
  timingSafeEqual,
  createHash,
  createPublicKey,
  verify,
  sign,
} from 'node:crypto';
import { promisify } from 'node:util';
import { PORTAL_HTML, PORTAL_JS, PORTAL_CSS } from './portal.mjs';

/**
 * Cœur du service Compte Cord — sans dépendance à un moteur de base précis.
 *
 * `sql(text, params) => Promise<row[]>` est fourni par l'appelant : PGlite en
 * développement et pour les tests (Postgres en mémoire), Neon en production
 * sur Vercel. Le SQL est du Postgres dans les deux cas — même dialecte, même
 * comportement.
 *
 * La clé de signature OIDC (`oidcKey`, PEM privé RSA) est passée par
 * l'appelant plutôt que générée ici : en serverless, deux démarrages à froid
 * simultanés en généreraient deux différentes.
 */

const scrypt = promisify(rawScrypt);
const secret = () => randomBytes(32).toString('base64url');
const hash = (value) => createHash('sha256').update(value).digest('base64url');
const now = () => Date.now();
const ttl = 7 * 86400_000;
const challengeTtl = 3 * 60_000;
const error = (status, message) => Object.assign(new Error(message), { status });
const publicUser = (u) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  createdAt: Number(u.created_at),
  emailVerified: Boolean(u.email_verified_at),
});
const safeEqual = (a, b) => {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return aa.length === bb.length && timingSafeEqual(aa, bb);
};

export const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, salt TEXT NOT NULL, password_hash TEXT NOT NULL, created_at BIGINT NOT NULL, email_verified_at BIGINT);
  CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), expires BIGINT NOT NULL, purpose TEXT NOT NULL DEFAULT 'account');
  CREATE TABLE IF NOT EXISTS passcord_keys (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), name TEXT NOT NULL, public_key TEXT NOT NULL, created_at BIGINT NOT NULL);
  CREATE TABLE IF NOT EXISTS challenges (id TEXT PRIMARY KEY, kind TEXT NOT NULL, user_id TEXT REFERENCES users(id), poll_hash TEXT, challenge TEXT NOT NULL, expires BIGINT NOT NULL, approved INTEGER NOT NULL DEFAULT 0);
  CREATE TABLE IF NOT EXISTS codes (hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), client_id TEXT NOT NULL, redirect_uri TEXT NOT NULL, challenge TEXT NOT NULL, nonce TEXT, expires BIGINT NOT NULL);
  CREATE TABLE IF NOT EXISTS rate_limits (bucket TEXT PRIMARY KEY, count INTEGER NOT NULL, expires BIGINT NOT NULL);
`;

/** Applique le schéma. À appeler une fois au démarrage (idempotent). */
export async function migrate(sql) {
  for (const statement of SCHEMA.split(';')) {
    const trimmed = statement.trim();
    if (trimmed) await sql(trimmed, []);
  }
}

export function createService({ sql, issuer, clients = {}, sendVerification, oidcKey }) {
  const origin = new URL(issuer);
  if (origin.protocol !== 'https:' && !['127.0.0.1', 'localhost', '[::1]'].includes(origin.hostname)) {
    throw new Error('HTTPS obligatoire hors localhost.');
  }
  if (origin.pathname !== '/' || origin.search || origin.hash || origin.username || origin.password) {
    throw new Error('L’issuer doit être une origine sans chemin.');
  }
  issuer = origin.origin;
  if (!oidcKey) throw new Error('Clé de signature OIDC manquante (oidcKey).');
  const pem = oidcKey;
  const jwk = { ...createPublicKey(pem).export({ format: 'jwk' }), kid: 'cord-1', use: 'sig', alg: 'RS256' };

  const one = async (text, params) => (await sql(text, params))[0];

  async function cleanup() {
    const t = now();
    await sql('DELETE FROM sessions WHERE expires < $1', [t]);
    await sql('DELETE FROM challenges WHERE expires < $1', [t]);
    await sql('DELETE FROM codes WHERE expires < $1', [t]);
    await sql('DELETE FROM rate_limits WHERE expires < $1', [t]);
  }

  /** Compteur de limite par fenêtre glissante, en base (serverless-safe). */
  async function overLimit(bucket, limit, windowMs) {
    const t = now();
    const row = await one(
      `INSERT INTO rate_limits (bucket, count, expires) VALUES ($1, 1, $2)
       ON CONFLICT (bucket) DO UPDATE SET
         count = CASE WHEN rate_limits.expires < $3 THEN 1 ELSE rate_limits.count + 1 END,
         expires = CASE WHEN rate_limits.expires < $3 THEN $2 ELSE rate_limits.expires END
       RETURNING count`,
      [bucket, t + windowMs, t],
    );
    return Number(row.count) > limit;
  }

  async function session(req, purpose = 'account') {
    const bearer = req.headers.authorization?.match(/^Bearer ([A-Za-z0-9_-]+)$/)?.[1];
    const cookie = req.headers.cookie
      ?.split(';')
      .map((s) => s.trim())
      .find((s) => s.startsWith('cord_session='))
      ?.slice(13);
    const token = bearer ?? cookie;
    if (!token) throw error(401, 'Connecte-toi à ton compte Cord.');
    const u = await one(
      'SELECT users.* FROM users JOIN sessions ON users.id = sessions.user_id WHERE sessions.hash = $1 AND sessions.expires > $2 AND sessions.purpose = $3',
      [hash(token), now(), purpose],
    );
    if (!u) throw error(401, 'Session expirée. Reconnecte-toi.');
    return { user: u, token };
  }
  async function newSession(user, purpose = 'account') {
    const token = secret();
    await sql('INSERT INTO sessions (hash, user_id, expires, purpose) VALUES ($1, $2, $3, $4)', [
      hash(token),
      user.id,
      now() + ttl,
      purpose,
    ]);
    return { user: publicUser(user), token };
  }
  const sessionCookie = (token, age = ttl / 1000) =>
    `cord_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${origin.protocol === 'https:' ? '; Secure' : ''}`;
  async function issue(res, user) {
    const result = await newSession(user);
    res.setHeader('Set-Cookie', sessionCookie(result.token));
    return result;
  }
  function jwt(user, clientId, nonce) {
    const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
    const data = `${encode({ alg: 'RS256', typ: 'JWT', kid: jwk.kid })}.${encode({
      iss: issuer,
      sub: user.id,
      aud: clientId,
      iat: Math.floor(now() / 1000),
      exp: Math.floor(now() / 1000) + 300,
      email: user.email,
      email_verified: Boolean(user.email_verified_at),
      name: user.name,
      ...(nonce ? { nonce } : {}),
    })}`;
    return `${data}.${sign('RSA-SHA256', Buffer.from(data), pem).toString('base64url')}`;
  }
  async function readBody(req) {
    // Vercel a déjà pu analyser le corps (req.body) ; sinon on lit le flux.
    if (req.body !== undefined && req.body !== null) {
      if (typeof req.body === 'object') return req.body;
      if (typeof req.body === 'string') {
        try {
          return req.headers['content-type']?.includes('application/x-www-form-urlencoded')
            ? Object.fromEntries(new URLSearchParams(req.body))
            : JSON.parse(req.body || '{}');
        } catch {
          throw error(400, 'Requête invalide.');
        }
      }
    }
    let data = '';
    let length = 0;
    for await (const chunk of req) {
      length += chunk.length;
      if (length > 16384) throw error(413, 'Requête trop volumineuse.');
      data += chunk;
    }
    try {
      return req.headers['content-type']?.includes('application/x-www-form-urlencoded')
        ? Object.fromEntries(new URLSearchParams(data))
        : JSON.parse(data || '{}');
    } catch {
      throw error(400, 'Requête invalide.');
    }
  }
  function field(data, name, max = 200) {
    const v = data[name];
    if (typeof v !== 'string' || !v.trim() || v.length > max) throw error(400, `Champ ${name} invalide.`);
    return v.trim();
  }
  async function challenge(id, kind) {
    const c = await one('SELECT * FROM challenges WHERE id = $1 AND kind = $2 AND expires > $3', [id, kind, now()]);
    if (!c) throw error(410, 'Demande expirée ou déjà utilisée.');
    return c;
  }

  function clientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length) return forwarded.split(',')[0].trim();
    return req.socket?.remoteAddress ?? 'unknown';
  }

  async function handle(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
    );
    const json = (data, status = 200) => {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(data));
    };
    const send = (body, type) => {
      res.writeHead(200, { 'Content-Type': type });
      res.end(body);
    };
    try {
      await cleanup();
      const url = new URL(req.url, issuer);
      const path = url.pathname;
      const method = req.method;
      if (req.headers.origin && req.headers.origin !== issuer) throw error(403, 'Origine refusée.');

      if (method === 'GET' && (path === '/' || path === '/authorize')) return send(PORTAL_HTML, 'text/html; charset=utf-8');
      if (method === 'GET' && path === '/portal.js') return send(PORTAL_JS, 'text/javascript; charset=utf-8');
      if (method === 'GET' && path === '/portal.css') return send(PORTAL_CSS, 'text/css; charset=utf-8');
      if (method === 'GET' && path === '/health') return json({ service: 'cord-account', status: 'ok' });
      if (method === 'GET' && path === '/.well-known/openid-configuration')
        return json({
          issuer,
          authorization_endpoint: `${issuer}/authorize`,
          token_endpoint: `${issuer}/oauth/token`,
          userinfo_endpoint: `${issuer}/oauth/userinfo`,
          jwks_uri: `${issuer}/.well-known/jwks.json`,
          response_types_supported: ['code'],
          subject_types_supported: ['public'],
          id_token_signing_alg_values_supported: ['RS256'],
          token_endpoint_auth_methods_supported: ['client_secret_post', 'client_secret_basic'],
          scopes_supported: ['openid', 'profile', 'email'],
          code_challenge_methods_supported: ['S256'],
          grant_types_supported: ['authorization_code'],
        });
      if (method === 'GET' && path === '/.well-known/jwks.json') return json({ keys: [jwk] });
      if (method === 'GET' && path === '/oauth/userinfo') {
        const { user } = await session(req, 'userinfo');
        return json({ sub: user.id, name: user.name, email: user.email, email_verified: Boolean(user.email_verified_at) });
      }
      if (method === 'GET' && path === '/api/client') {
        const client = clients[url.searchParams.get('id')];
        if (!client) throw error(404, 'Application inconnue.');
        return json({ name: client.name });
      }
      if (method === 'GET' && path === '/api/me') {
        const { user } = await session(req);
        const keys = await sql(
          'SELECT id, name, created_at AS "createdAt" FROM passcord_keys WHERE user_id = $1 ORDER BY created_at',
          [user.id],
        );
        return json({ user: publicUser(user), keys: keys.map((k) => ({ ...k, createdAt: Number(k.createdAt) })) });
      }
      if (!['POST', 'PATCH', 'DELETE'].includes(method)) throw error(404, 'Introuvable.');

      const ip = clientIp(req);
      if (await overLimit(`ip:${ip}`, 120, 60_000)) throw error(429, 'Trop de demandes. Réessaie dans une minute.');
      const data = await readBody(req);

      if (['/api/register', '/api/login'].includes(path) && method === 'POST') {
        if (await overLimit(`auth:${ip}`, 20, 600_000))
          throw error(429, 'Trop de tentatives. Réessaie dans dix minutes.');
        const email = field(data, 'email', 254).toLowerCase();
        if (typeof data.password !== 'string' || !data.password.length || data.password.length > 512)
          throw error(400, 'Mot de passe invalide.');
        const password = data.password;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw error(400, 'Adresse email invalide.');
        if (path === '/api/register') {
          if (password.length < 12) throw error(400, 'Choisis un mot de passe d’au moins 12 caractères.');
          const name = field(data, 'name', 60);
          const salt = secret();
          const derived = await scrypt(password, salt, 64, { N: 32768, maxmem: 64 * 1024 * 1024 });
          const u = { id: `cord_${randomUUID()}`, email, name, salt, password_hash: derived.toString('hex'), created_at: now() };
          try {
            await sql(
              'INSERT INTO users (id, email, name, salt, password_hash, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
              [u.id, email, name, salt, u.password_hash, u.created_at],
            );
          } catch (e) {
            if (String(e).includes('duplicate') || String(e).toLowerCase().includes('unique'))
              throw error(409, 'Un compte utilise déjà cette adresse.');
            throw e;
          }
          return json(await issue(res, u), 201);
        }
        const u = await one('SELECT * FROM users WHERE email = $1', [email]);
        const derived = await scrypt(password, u?.salt ?? 'invalid-account-salt', 64, { N: 32768, maxmem: 64 * 1024 * 1024 });
        if (!u || !safeEqual(derived.toString('hex'), u.password_hash)) throw error(401, 'Email ou mot de passe incorrect.');
        return json(await issue(res, u));
      }
      if (path === '/api/logout' && method === 'POST') {
        const { token } = await session(req);
        await sql('DELETE FROM sessions WHERE hash = $1', [hash(token)]);
        res.setHeader('Set-Cookie', sessionCookie('', 0));
        return json({ ok: true });
      }
      if (path === '/api/email/send' && method === 'POST') {
        const { user } = await session(req);
        if (user.email_verified_at) return json({ ok: true });
        if (!sendVerification) throw error(503, 'L’envoi des emails doit être configuré sur le service Cord.');
        const previous = await one(
          "SELECT expires FROM challenges WHERE kind = 'email' AND user_id = $1 ORDER BY expires DESC LIMIT 1",
          [user.id],
        );
        if (previous && Number(previous.expires) > now() + 14 * 60_000)
          throw error(429, 'Attends une minute avant de renvoyer l’email.');
        const token = secret();
        const id = hash(token);
        await sql('INSERT INTO challenges (id, kind, user_id, challenge, expires) VALUES ($1, $2, $3, $4, $5)', [
          id,
          'email',
          user.id,
          '',
          now() + 15 * 60_000,
        ]);
        let delivery;
        try {
          delivery = await sendVerification({ email: user.email, url: `${issuer}/?verify=${token}` });
        } catch {
          await sql('DELETE FROM challenges WHERE id = $1', [id]);
          throw error(503, 'Envoi impossible. Réessaie plus tard.');
        }
        return json({ ok: true, ...(delivery?.devUrl ? { devUrl: delivery.devUrl } : {}) });
      }
      if (path === '/api/email/verify' && method === 'POST') {
        const c = await challenge(hash(field(data, 'token')), 'email');
        await sql('UPDATE users SET email_verified_at = $1 WHERE id = $2', [now(), c.user_id]);
        await sql("DELETE FROM challenges WHERE kind = 'email' AND user_id = $1", [c.user_id]);
        return json({ ok: true });
      }
      if (path === '/api/me' && method === 'PATCH') {
        const { user } = await session(req);
        await sql('UPDATE users SET name = $1 WHERE id = $2', [field(data, 'name', 60), user.id]);
        return json({ user: publicUser(await one('SELECT * FROM users WHERE id = $1', [user.id])) });
      }
      if (path === '/api/me' && method === 'DELETE') {
        const { user } = await session(req);
        for (const table of ['sessions', 'challenges', 'codes', 'passcord_keys']) {
          await sql(`DELETE FROM ${table} WHERE user_id = $1`, [user.id]);
        }
        await sql('DELETE FROM users WHERE id = $1', [user.id]);
        res.setHeader('Set-Cookie', sessionCookie('', 0));
        return json({ ok: true });
      }
      if (path === '/api/passcord/pair' && method === 'POST') {
        const { user } = await session(req);
        const id = secret();
        const challengeText = secret();
        await sql('INSERT INTO challenges (id, kind, user_id, challenge, expires) VALUES ($1, $2, $3, $4, $5)', [
          id,
          'pair',
          user.id,
          challengeText,
          now() + challengeTtl,
        ]);
        return json({
          id,
          challenge: challengeText,
          expiresAt: now() + challengeTtl,
          url: `passcord://cord/pair?server=${encodeURIComponent(issuer)}&id=${id}&challenge=${challengeText}`,
        });
      }
      if (path === '/api/passcord/claim' && method === 'POST') {
        const { user } = await session(req);
        const c = await challenge(field(data, 'id'), 'pair');
        if (c.user_id !== user.id || !safeEqual(c.challenge, field(data, 'challenge')))
          throw error(403, 'Cette association appartient à un autre compte.');
        const key = data.publicKey;
        if (key?.kty !== 'OKP' || key?.crv !== 'Ed25519' || typeof key.x !== 'string' || key.d)
          throw error(400, 'Clé publique Ed25519 attendue.');
        const normalized = { kty: 'OKP', crv: 'Ed25519', x: key.x };
        const message = `cord-pair-v1:${issuer}:${c.id}:${c.challenge}`;
        let valid = false;
        try {
          valid = verify(
            null,
            Buffer.from(message),
            createPublicKey({ key: normalized, format: 'jwk' }),
            Buffer.from(field(data, 'signature'), 'base64url'),
          );
        } catch {
          /* clé malformée : refusée */
        }
        if (!valid) throw error(403, 'Signature invalide.');
        const keyId = randomUUID();
        const name = field(data, 'name', 60);
        await sql('INSERT INTO passcord_keys (id, user_id, name, public_key, created_at) VALUES ($1, $2, $3, $4, $5)', [
          keyId,
          user.id,
          name,
          JSON.stringify(normalized),
          now(),
        ]);
        await sql('DELETE FROM challenges WHERE id = $1', [c.id]);
        return json({ keyId, user: publicUser(user) });
      }
      if (path === '/api/passcord/keys' && method === 'DELETE') {
        const { user } = await session(req);
        await sql('DELETE FROM passcord_keys WHERE id = $1 AND user_id = $2', [field(data, 'id'), user.id]);
        return json({ ok: true });
      }
      if (path === '/api/passcord/login' && method === 'POST') {
        const id = secret();
        const pollToken = secret();
        const challengeText = secret();
        await sql(
          'INSERT INTO challenges (id, kind, poll_hash, challenge, expires) VALUES ($1, $2, $3, $4, $5)',
          [id, 'login', hash(pollToken), challengeText, now() + challengeTtl],
        );
        return json({
          id,
          pollToken,
          challenge: challengeText,
          expiresAt: now() + challengeTtl,
          url: `passcord://cord/login?server=${encodeURIComponent(issuer)}&id=${id}&challenge=${challengeText}`,
        });
      }
      if (path === '/api/passcord/approve' && method === 'POST') {
        const c = await challenge(field(data, 'id'), 'login');
        if (c.approved) throw error(409, 'Demande déjà validée.');
        const k = await one('SELECT * FROM passcord_keys WHERE id = $1', [field(data, 'keyId')]);
        const message = `cord-login-v1:${issuer}:${c.id}:${c.challenge}`;
        if (
          !k ||
          !verify(
            null,
            Buffer.from(message),
            createPublicKey({ key: JSON.parse(k.public_key), format: 'jwk' }),
            Buffer.from(field(data, 'signature'), 'base64url'),
          )
        )
          throw error(403, 'Signature invalide ou appareil révoqué.');
        await sql('UPDATE challenges SET approved = 1, user_id = $1 WHERE id = $2', [k.user_id, c.id]);
        return json({ ok: true });
      }
      if (path === '/api/passcord/poll' && method === 'POST') {
        const c = await challenge(field(data, 'id'), 'login');
        if (!safeEqual(c.poll_hash, hash(field(data, 'pollToken')))) throw error(403, 'Demande refusée.');
        if (!c.approved) return json({ pending: true });
        await sql('DELETE FROM challenges WHERE id = $1', [c.id]);
        return json(await issue(res, await one('SELECT * FROM users WHERE id = $1', [c.user_id])));
      }
      if (path === '/api/authorize' && method === 'POST') {
        const { user } = await session(req);
        const client = clients[data.client_id];
        if (!user.email_verified_at) throw error(403, 'Confirme ton adresse email avant de connecter une app.');
        if (!client || !client.redirectUris.includes(data.redirect_uri))
          throw error(400, 'Application ou adresse de retour inconnue.');
        if (data.response_type !== 'code' || data.code_challenge_method !== 'S256' || !/^[A-Za-z0-9_-]{43}$/.test(data.code_challenge ?? ''))
          throw error(400, 'Connexion PKCE S256 requise.');
        const scope = field(data, 'scope').split(' ');
        if (!scope.includes('openid') || scope.some((s) => !['openid', 'profile', 'email'].includes(s)))
          throw error(400, 'Portée refusée.');
        const code = secret();
        await sql(
          'INSERT INTO codes (hash, user_id, client_id, redirect_uri, challenge, nonce, expires) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [
            hash(code),
            user.id,
            data.client_id,
            data.redirect_uri,
            data.code_challenge,
            typeof data.nonce === 'string' ? data.nonce : null,
            now() + 60_000,
          ],
        );
        const redirect = new URL(data.redirect_uri);
        redirect.searchParams.set('code', code);
        if (typeof data.state === 'string') redirect.searchParams.set('state', data.state);
        return json({ redirect: redirect.toString() });
      }
      if (path === '/oauth/token' && method === 'POST') {
        let clientId = data.client_id;
        let clientSecret = data.client_secret;
        if (req.headers.authorization?.startsWith('Basic ')) {
          const basic = Buffer.from(req.headers.authorization.slice(6), 'base64').toString();
          const colon = basic.indexOf(':');
          clientId = decodeURIComponent(basic.slice(0, colon));
          clientSecret = decodeURIComponent(basic.slice(colon + 1));
        }
        const client = clients[clientId];
        if (!client?.secret || typeof clientSecret !== 'string' || !safeEqual(client.secret, clientSecret))
          throw error(401, 'Client OAuth inconnu.');
        const code = await one('SELECT * FROM codes WHERE hash = $1 AND expires > $2', [hash(field(data, 'code')), now()]);
        if (
          data.grant_type !== 'authorization_code' ||
          !code ||
          code.client_id !== clientId ||
          data.redirect_uri !== code.redirect_uri ||
          !/^[A-Za-z0-9._~-]{43,128}$/.test(data.code_verifier ?? '') ||
          !safeEqual(code.challenge, hash(data.code_verifier))
        )
          throw error(400, 'Code OAuth invalide ou expiré.');
        // Consommation atomique APRÈS validation (usage unique + course entre
        // deux échanges concurrents) : un mauvais code_verifier ne brûle pas
        // le code, mais un second échange valide n'obtient rien.
        const consumed = await one('DELETE FROM codes WHERE hash = $1 RETURNING hash', [code.hash]);
        if (!consumed) throw error(400, 'Code OAuth invalide ou expiré.');
        const user = await one('SELECT * FROM users WHERE id = $1', [code.user_id]);
        const access = await newSession(user, 'userinfo');
        await sql('UPDATE sessions SET expires = $1 WHERE hash = $2', [now() + 300_000, hash(access.token)]);
        return json({
          access_token: access.token,
          token_type: 'Bearer',
          expires_in: 300,
          id_token: jwt(user, clientId, code.nonce),
          scope: 'openid profile email',
        });
      }
      throw error(404, 'Introuvable.');
    } catch (e) {
      json({ error: e.status ? e.message : 'Erreur du service Cord.' }, e.status ?? 500);
    }
  }

  return { handle };
}
