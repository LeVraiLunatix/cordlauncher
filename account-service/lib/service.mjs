import { randomBytes, randomInt, randomUUID, scrypt as rawScrypt, createPublicKey, verify, sign } from 'node:crypto';
import { promisify } from 'node:util';
import * as PORTAL from './portal.mjs';
import { secret, hash, now, b64u, error, safeEqual, maskIp, SESSION_TTL, CHALLENGE_TTL, DAY } from './util.mjs';
import { createVault } from './vault.mjs';
import { generateTotpSecret, verifyTotp, otpauthUri, generateRecoveryCodes, hashRecoveryCode } from './totp.mjs';
import { describeDevice, deviceKey } from './ua.mjs';
import { verifyRegistration, verifyAssertion } from './webauthn.mjs';
import { renderMail } from './mail.mjs';
import { SUITE, describeClient } from './catalog.mjs';
import { BETA_PRODUCTS, generateBetaCode, githubReleases, normalizeBetaCode } from './beta.mjs';
import { generateVapidKeys, sendPush } from './push.mjs';
import { CATALOG } from './catalog-apps.mjs';

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
 *
 * Aucun état partagé entre requêtes n'est gardé en mémoire : limites de débit,
 * défis, sessions et journal vivent en base.
 */

const scrypt = promisify(rawScrypt);
const derive = async (password, salt) =>
  (await scrypt(password, salt, 64, { N: 32768, maxmem: 64 * 1024 * 1024 })).toString('hex');
const publicUser = (u) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  createdAt: Number(u.created_at),
  emailVerified: Boolean(u.email_verified_at),
});
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AVATAR_RE = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+=*)$/;
const AVATAR_MAX = 180_000;
const STRONG_METHODS = ['passcord', 'passkey', 'reset'];
const METHOD_LABELS = { password: 'Mot de passe', passcord: 'Passcord (iPhone)', passkey: 'Passkey', reset: 'Lien de réinitialisation', register: 'Création du compte' };
const maskEmail = (email) => {
  const [local, domain] = String(email).split('@');
  return `${local.slice(0, 1)}${'•'.repeat(Math.max(2, Math.min(6, local.length - 1)))}@${domain}`;
};

export const SCHEMA_VERSION = 7;

export const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, salt TEXT NOT NULL, password_hash TEXT NOT NULL, created_at BIGINT NOT NULL, email_verified_at BIGINT);
  CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), expires BIGINT NOT NULL, purpose TEXT NOT NULL DEFAULT 'account');
  CREATE TABLE IF NOT EXISTS passcord_keys (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), name TEXT NOT NULL, public_key TEXT NOT NULL, created_at BIGINT NOT NULL);
  CREATE TABLE IF NOT EXISTS challenges (id TEXT PRIMARY KEY, kind TEXT NOT NULL, user_id TEXT REFERENCES users(id), poll_hash TEXT, challenge TEXT NOT NULL, expires BIGINT NOT NULL, approved INTEGER NOT NULL DEFAULT 0);
  CREATE TABLE IF NOT EXISTS codes (hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), client_id TEXT NOT NULL, redirect_uri TEXT NOT NULL, challenge TEXT NOT NULL, nonce TEXT, expires BIGINT NOT NULL);
  CREATE TABLE IF NOT EXISTS rate_limits (bucket TEXT PRIMARY KEY, count INTEGER NOT NULL, expires BIGINT NOT NULL);
  CREATE TABLE IF NOT EXISTS oauth_consents (user_id TEXT NOT NULL REFERENCES users(id), client_id TEXT NOT NULL, granted_at BIGINT NOT NULL, last_used_at BIGINT NOT NULL, PRIMARY KEY (user_id, client_id));
  CREATE TABLE IF NOT EXISTS passkeys (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), name TEXT NOT NULL, public_key TEXT NOT NULL, alg INTEGER NOT NULL, sign_count BIGINT NOT NULL DEFAULT 0, transports TEXT, backed_up INTEGER NOT NULL DEFAULT 0, created_at BIGINT NOT NULL, last_used_at BIGINT);
  CREATE TABLE IF NOT EXISTS recovery_codes (user_id TEXT NOT NULL REFERENCES users(id), hash TEXT NOT NULL, used_at BIGINT, PRIMARY KEY (user_id, hash));
  CREATE TABLE IF NOT EXISTS account_events (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), kind TEXT NOT NULL, at BIGINT NOT NULL, ip TEXT, user_agent TEXT, device TEXT, detail TEXT);
  CREATE TABLE IF NOT EXISTS schema_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL)
`;

/** Migrations additives et idempotentes (jamais de DROP ni de réécriture). */
const MIGRATIONS = [
  "ALTER TABLE users ADD COLUMN IF NOT EXISTS theme TEXT NOT NULL DEFAULT 'system'",
  "ALTER TABLE users ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'fr'",
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT',
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS alerts INTEGER NOT NULL DEFAULT 1',
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS password_changed_at BIGINT',
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_secret TEXT',
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_pending TEXT',
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_enabled_at BIGINT',
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_last_step BIGINT NOT NULL DEFAULT 0',
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at BIGINT',
  'ALTER TABLE sessions ADD COLUMN IF NOT EXISTS created_at BIGINT NOT NULL DEFAULT 0',
  'ALTER TABLE sessions ADD COLUMN IF NOT EXISTS user_agent TEXT',
  'ALTER TABLE sessions ADD COLUMN IF NOT EXISTS ip TEXT',
  'ALTER TABLE sessions ADD COLUMN IF NOT EXISTS last_seen_at BIGINT',
  'ALTER TABLE sessions ADD COLUMN IF NOT EXISTS method TEXT',
  'ALTER TABLE sessions ADD COLUMN IF NOT EXISTS client_id TEXT',
  'ALTER TABLE passcord_keys ADD COLUMN IF NOT EXISTS last_used_at BIGINT',
  'ALTER TABLE challenges ADD COLUMN IF NOT EXISTS payload TEXT',
  'ALTER TABLE oauth_consents ADD COLUMN IF NOT EXISTS scope TEXT',
  'CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions (user_id)',
  'CREATE INDEX IF NOT EXISTS events_user_idx ON account_events (user_id, at)',
  'CREATE INDEX IF NOT EXISTS passkeys_user_idx ON passkeys (user_id)',
  // v4 : bêtas fermées (clés d'accès hachées + testeurs).
  'CREATE TABLE IF NOT EXISTS beta_keys (id TEXT PRIMARY KEY, product TEXT NOT NULL, code_hash TEXT UNIQUE NOT NULL, hint TEXT NOT NULL, label TEXT, max_uses INTEGER NOT NULL DEFAULT 1, uses INTEGER NOT NULL DEFAULT 0, expires_at BIGINT, created_by TEXT, created_at BIGINT NOT NULL, revoked_at BIGINT)',
  'CREATE TABLE IF NOT EXISTS beta_access (user_id TEXT NOT NULL REFERENCES users(id), product TEXT NOT NULL, key_id TEXT, granted_at BIGINT NOT NULL, PRIMARY KEY (user_id, product))',
  'CREATE INDEX IF NOT EXISTS beta_keys_product_idx ON beta_keys (product, created_at)',
  // v5 : réglages du service posés depuis l'administration (secrets chiffrés).
  'CREATE TABLE IF NOT EXISTS service_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at BIGINT NOT NULL, updated_by TEXT)',
  // v6 : suite interconnectée (état remonté par chaque app, notifications).
  'CREATE TABLE IF NOT EXISTS app_status (user_id TEXT NOT NULL REFERENCES users(id), app TEXT NOT NULL, data TEXT NOT NULL, updated_at BIGINT NOT NULL, PRIMARY KEY (user_id, app))',
  'CREATE TABLE IF NOT EXISTS notifications (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), app TEXT NOT NULL, title TEXT NOT NULL, body TEXT, url TEXT, created_at BIGINT NOT NULL, read_at BIGINT)',
  'CREATE INDEX IF NOT EXISTS notifications_user_idx ON notifications (user_id, created_at)',
  // v7 : notifications push (web app) et boîte de réception de Passcord.
  'CREATE TABLE IF NOT EXISTS push_subscriptions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), endpoint TEXT NOT NULL, p256dh TEXT NOT NULL, auth TEXT NOT NULL, device TEXT, created_at BIGINT NOT NULL)',
  'CREATE INDEX IF NOT EXISTS push_subscriptions_user_idx ON push_subscriptions (user_id)',
  'ALTER TABLE passcord_keys ADD COLUMN IF NOT EXISTS inbox_hash TEXT',
];

/** Applique le schéma. À appeler une fois au démarrage (idempotent). */
export async function migrate(sql) {
  // Démarrage à froid rapide : si la base est déjà à jour, une seule requête.
  try {
    const [row] = await sql("SELECT value FROM schema_meta WHERE key = 'version'", []);
    if (row && Number(row.value) >= SCHEMA_VERSION) return;
  } catch {
    /* table absente : première migration */
  }
  for (const statement of SCHEMA.split(';')) {
    const trimmed = statement.trim();
    if (trimmed) await sql(trimmed, []);
  }
  for (const statement of MIGRATIONS) await sql(statement, []);
  await sql(
    "INSERT INTO schema_meta (key, value) VALUES ('version', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
    [String(SCHEMA_VERSION)],
  );
}

export function createService({
  sql,
  issuer,
  clients = {},
  sendMail,
  sendVerification,
  oidcKey,
  admins = [],
  dataKey,
  /** Builds privés par produit de bêta : `{ passcord: githubReleases(...) }` (voir beta.mjs). */
  betaReleases = {},
  /** `fetch` utilisé pour GitHub (remplaçable dans les tests). */
  githubFetch = fetch,
  /** `fetch` utilisé pour les notifications push (remplaçable dans les tests). */
  pushFetch = fetch,
  portal = PORTAL,
}) {
  const origin = new URL(issuer);
  if (origin.protocol !== 'https:' && !['127.0.0.1', 'localhost', '[::1]'].includes(origin.hostname)) {
    throw new Error('HTTPS obligatoire hors localhost.');
  }
  if (origin.pathname !== '/' || origin.search || origin.hash || origin.username || origin.password) {
    throw new Error('L’issuer doit être une origine sans chemin.');
  }
  issuer = origin.origin;
  const rpId = origin.hostname;
  if (!oidcKey) throw new Error('Clé de signature OIDC manquante (oidcKey).');
  const pem = oidcKey;
  const jwk = { ...createPublicKey(pem).export({ format: 'jwk' }), kid: 'cord-1', use: 'sig', alg: 'RS256' };
  const vault = createVault(dataKey, pem);
  const adminEmails = new Set(admins.map((e) => String(e).trim().toLowerCase()).filter(Boolean));

  // `sendMail({ to, kind, subject, html, text, url })` ; `sendVerification`
  // ({ email, url }) reste accepté pour les intégrations existantes.
  const deliver =
    sendMail ?? (sendVerification ? (m) => sendVerification({ email: m.to, url: m.url, kind: m.kind }) : undefined);

  const one = async (text, params) => (await sql(text, params))[0];
  const isAdmin = (u) => Boolean(u.email_verified_at) && adminEmails.has(String(u.email).toLowerCase());
  /** Produits de bêta ouverts à ce compte (tous pour l'administration). */
  async function betaAccess(u) {
    if (isAdmin(u)) return Object.keys(BETA_PRODUCTS);
    const rows = await sql('SELECT product FROM beta_access WHERE user_id = $1 ORDER BY granted_at', [u.id]);
    return rows.map((r) => r.product).filter((p) => Object.hasOwn(BETA_PRODUCTS, p));
  }
  const betaProduct = (value) => {
    if (typeof value !== 'string' || !Object.hasOwn(BETA_PRODUCTS, value)) throw error(400, 'Bêta inconnue.');
    return value;
  };
  const describeBetaKey = (k) => {
    const t = now();
    const status = k.revoked_at ? 'revoked' : k.expires_at && Number(k.expires_at) <= t ? 'expired' : Number(k.uses) >= Number(k.max_uses) ? 'used' : 'active';
    return {
      id: k.id,
      product: k.product,
      label: k.label ?? null,
      hint: k.hint,
      maxUses: Number(k.max_uses),
      uses: Number(k.uses),
      expiresAt: k.expires_at ? Number(k.expires_at) : null,
      createdAt: Number(k.created_at),
      revokedAt: k.revoked_at ? Number(k.revoked_at) : null,
      status,
    };
  };
  // Jeton GitHub des builds privés : variable d'environnement, sinon collé
  // depuis l'administration (chiffré au repos avec le coffre du service).
  const releaseCache = new Map();
  async function storedReleaseToken(product) {
    const row = await one('SELECT value FROM service_settings WHERE key = $1', [`releases_token:${product}`]);
    return row ? vault.open(row.value) : null;
  }
  async function releasesFor(product) {
    if (betaReleases[product]) return betaReleases[product];
    const repo = BETA_PRODUCTS[product]?.repo;
    const token = repo ? await storedReleaseToken(product) : null;
    if (!token) return null;
    const cached = releaseCache.get(product);
    if (cached?.token === token) return cached.source;
    const source = githubReleases({ token, repo, fetchImpl: githubFetch });
    releaseCache.set(product, { token, source });
    return source;
  }
  async function downloadsSource(product) {
    if (betaReleases[product]) return 'env';
    return (await storedReleaseToken(product)) ? 'admin' : null;
  }
  async function releaseInfo(product) {
    const source = await releasesFor(product);
    if (!source) return null;
    try {
      const r = await source.latest();
      return r && { build: r.build, tag: r.tag, publishedAt: r.publishedAt, assets: r.assets.map((a) => ({ name: a.name, size: a.size })) };
    } catch (e) {
      console.error('[cord-account] releases', e);
      return null;
    }
  }
  // ── Suite interconnectée : état des apps, notifications, hub ─────────────
  const FIRST_PARTY_STATUS = ['cordlauncher', 'passcord'];
  const APP_NAMES = { cordlauncher: 'CordLauncher', passcord: 'Passcord' };
  const emailCodeHash = (userId, code) => hash(`email-code:${userId}:${code}`);
  const appMeta = (app) => {
    const d = describeClient(app, clients[app]);
    return { name: APP_NAMES[app] ?? d.name, logo: app === 'cordlauncher' ? '/assets/icon-180.png' : d.logo };
  };
  /** Lien fourni par une app : HTTPS, et sur un domaine de ses adresses de retour. */
  function appUrl(value, client) {
    let parsed;
    try {
      parsed = new URL(String(value));
    } catch {
      throw error(400, 'Lien invalide.');
    }
    const hosts = (client?.redirectUris ?? []).map((u) => { try { return new URL(u).host; } catch { return null; } });
    const local = ['localhost', '127.0.0.1'].includes(parsed.hostname);
    if ((parsed.protocol !== 'https:' && !local) || String(value).length > 300 || (client && !hosts.includes(parsed.host)))
      throw error(400, 'Le lien doit pointer vers le site de l’app, en HTTPS.');
    return parsed.href;
  }
  function cleanStatus(input, client) {
    const s = input && typeof input === 'object' ? input : {};
    const text = (v, max) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);
    const headline = text(s.headline, 80);
    if (!headline) throw error(400, 'Il faut au moins un titre (headline).');
    const metrics = Array.isArray(s.metrics)
      ? s.metrics.slice(0, 4).map((m) => ({ label: text(m?.label, 24), value: text(String(m?.value ?? ''), 24) })).filter((m) => m.label && m.value)
      : [];
    return {
      headline,
      detail: text(s.detail, 140),
      metrics,
      tone: ['ok', 'warn', 'danger', 'info'].includes(s.tone) ? s.tone : null,
      url: s.url == null ? null : appUrl(s.url, client),
    };
  }
  async function saveStatus(userId, app, status) {
    await sql(
      `INSERT INTO app_status (user_id, app, data, updated_at) VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, app) DO UPDATE SET data = $3, updated_at = $4`,
      [userId, app, JSON.stringify(status), now()],
    );
  }
  function authenticateClient(req, data) {
    let clientId = data.client_id;
    let clientSecret = data.client_secret;
    if (req.headers.authorization?.startsWith('Basic ')) {
      const basic = Buffer.from(req.headers.authorization.slice(6), 'base64').toString();
      const colon = basic.indexOf(':');
      clientId = decodeURIComponent(basic.slice(0, colon));
      clientSecret = decodeURIComponent(basic.slice(colon + 1));
    }
    const client = Object.hasOwn(clients, clientId ?? '') ? clients[clientId] : undefined;
    if (!client?.secret || typeof clientSecret !== 'string' || !safeEqual(client.secret, clientSecret))
      throw error(401, 'Client OAuth inconnu.');
    return { clientId, client };
  }
  const describeNotification = (n) => ({
    id: n.id,
    app: n.app,
    ...appMeta(n.app),
    title: n.title,
    body: n.body ?? null,
    url: n.url ?? null,
    createdAt: Number(n.created_at),
    readAt: n.read_at ? Number(n.read_at) : null,
  });
  /** Le hub : chaque app de la suite avec ce que le compte en sait. */
  async function hub(u) {
    const [consents, statuses, unread, beta] = await Promise.all([
      sql('SELECT client_id, granted_at, last_used_at FROM oauth_consents WHERE user_id = $1', [u.id]),
      sql('SELECT app, data, updated_at FROM app_status WHERE user_id = $1', [u.id]),
      one('SELECT COUNT(*) AS n FROM notifications WHERE user_id = $1 AND read_at IS NULL', [u.id]),
      betaAccess(u),
    ]);
    const consentOf = new Map(consents.map((c) => [c.client_id, c]));
    const statusOf = new Map(statuses.map((s) => [s.app, { ...JSON.parse(s.data), updatedAt: Number(s.updated_at) }]));
    const passcordPaired = await one('SELECT COUNT(*) AS n FROM passcord_keys WHERE user_id = $1', [u.id]);
    return {
      apps: SUITE.map((a) => {
        const consent = consentOf.get(a.slug);
        return {
          slug: a.slug,
          name: a.name,
          status: a.status,
          tagline: a.tagline,
          description: a.description,
          url: a.url,
          launch: a.launch ?? a.url,
          accent: a.accent,
          logo: `/assets/logos/${a.slug}.png`,
          connected: Boolean(consent) || (a.slug === 'passcord' && Number(passcordPaired?.n ?? 0) > 0),
          connectedAt: consent ? Number(consent.granted_at) : null,
          lastUsedAt: consent ? Number(consent.last_used_at) : null,
          appStatus: statusOf.get(a.slug) ?? null,
          beta: Object.hasOwn(BETA_PRODUCTS, a.slug) ? { access: beta.includes(a.slug) } : null,
        };
      }),
      launcher: statusOf.get('cordlauncher') ?? null,
      unread: Number(unread?.n ?? 0),
    };
  }
  const avatarUrl = (u) => (u.avatar ? `${issuer}/avatar/${u.id}?v=${hash(u.avatar).slice(0, 10)}` : null);

  let lastCleanup = 0;
  async function cleanup() {
    // Simple optimisation (le ménage n'est pas nécessaire à la justesse : toutes
    // les requêtes filtrent déjà sur `expires`).
    const t = now();
    if (t - lastCleanup < 60_000) return;
    lastCleanup = t;
    await sql('DELETE FROM sessions WHERE expires < $1', [t]);
    await sql('DELETE FROM challenges WHERE expires < $1', [t]);
    await sql('DELETE FROM codes WHERE expires < $1', [t]);
    await sql('DELETE FROM rate_limits WHERE expires < $1', [t]);
    await sql('DELETE FROM account_events WHERE at < $1', [t - 180 * DAY]);
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

  function clientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length) return forwarded.split(',')[0].trim();
    return req.socket?.remoteAddress ?? 'unknown';
  }
  const userAgent = (req) => String(req.headers['user-agent'] ?? '').slice(0, 400);

  function readToken(req) {
    const bearer = req.headers.authorization?.match(/^Bearer ([A-Za-z0-9_-]+)$/)?.[1];
    const cookie = req.headers.cookie
      ?.split(';')
      .map((s) => s.trim())
      .find((s) => s.startsWith('cord_session='))
      ?.slice(13);
    return bearer ?? cookie;
  }

  async function session(req, purpose = 'account') {
    const token = readToken(req);
    if (!token) throw error(401, 'Connecte-toi à ton compte Cord.');
    const u = await one(
      `SELECT users.*, sessions.hash AS s_hash, sessions.created_at AS s_created, sessions.method AS s_method,
              sessions.last_seen_at AS s_seen, sessions.client_id AS s_client
         FROM users JOIN sessions ON users.id = sessions.user_id
        WHERE sessions.hash = $1 AND sessions.expires > $2 AND sessions.purpose = $3`,
      [hash(token), now(), purpose],
    );
    if (!u) throw error(401, 'Session expirée. Reconnecte-toi.');
    if (purpose === 'account' && now() - Number(u.s_seen ?? 0) > 5 * 60_000) {
      // Le User-Agent est aussi complété s'il manquait (anciennes sessions d'apps muettes).
      await sql("UPDATE sessions SET last_seen_at = $1, ip = $2, user_agent = COALESCE(NULLIF(user_agent, ''), $4) WHERE hash = $3", [now(), clientIp(req), u.s_hash, userAgent(req) || null]);
    }
    return { user: u, token };
  }
  async function optionalSession(req) {
    try {
      return await session(req);
    } catch {
      return null;
    }
  }
  /** Session ouverte il y a peu par une méthode forte (Passcord, passkey, lien). */
  const recentlyStrong = (u) => STRONG_METHODS.includes(u.s_method) && now() - Number(u.s_created) < 15 * 60_000;
  /**
   * « Mode sudo » : ajouter un facteur (2FA, passkey) exige une connexion de
   * moins de 15 minutes ou le mot de passe. Sinon un cookie volé suffirait à
   * verrouiller le compte avec le secret 2FA de l'attaquant.
   */
  async function requireReauth(u, data) {
    if (now() - Number(u.s_created) < 15 * 60_000) return;
    if (typeof data.password !== 'string' || !data.password) throw error(401, 'Confirme ton mot de passe pour continuer.', 'reauth_required');
    if (await overLimit(`password:${u.id}`, 10, 3600_000)) throw error(429, 'Trop de tentatives. Réessaie dans une heure.');
    if (!safeEqual(await derive(data.password, u.salt), u.password_hash)) throw error(403, 'Mot de passe incorrect.', 'password_invalid');
  }

  async function newSession(user, purpose = 'account', { req, method, clientId } = {}) {
    const token = secret();
    const t = now();
    await sql(
      `INSERT INTO sessions (hash, user_id, expires, purpose, created_at, last_seen_at, user_agent, ip, method, client_id)
       VALUES ($1, $2, $3, $4, $5, $5, $6, $7, $8, $9)`,
      [hash(token), user.id, t + SESSION_TTL, purpose, t, req ? userAgent(req) : null, req ? clientIp(req) : null, method ?? null, clientId ?? null],
    );
    return { user: publicUser(user), token };
  }
  const sessionCookie = (token, age = SESSION_TTL / 1000) =>
    `cord_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${origin.protocol === 'https:' ? '; Secure' : ''}`;
  async function issue(res, user, meta) {
    const result = await newSession(user, 'account', meta);
    res.setHeader('Set-Cookie', sessionCookie(result.token));
    return result;
  }

  async function record(userId, kind, req, detail) {
    const ua = req ? userAgent(req) : null;
    await sql(
      'INSERT INTO account_events (id, user_id, kind, at, ip, user_agent, device, detail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [randomUUID(), userId, kind, now(), req ? clientIp(req) : null, ua, ua === null ? null : deviceKey(ua), detail == null ? null : String(detail).slice(0, 200)],
    );
  }

  /** Envoie un email du gabarit `kind`. `required` : l'échec remonte à l'appelant. */
  async function mail(to, kind, data = {}, { required = false } = {}) {
    if (!deliver) {
      if (required) throw error(503, 'L’envoi des emails doit être configuré sur le service Cord.');
      return undefined;
    }
    try {
      const rendered = renderMail(kind, data, { issuer });
      return await deliver({ to, kind, url: data.url, ...rendered });
    } catch (e) {
      if (required) throw error(503, 'Envoi impossible. Réessaie plus tard.');
      console.error(`[cord-account] email « ${kind} » non envoyé :`, e?.message ?? e);
      return undefined;
    }
  }

  /** Connexion réussie : session, journal, alerte si l'appareil est nouveau. */
  async function completeLogin(req, res, user, method) {
    const device = deviceKey(userAgent(req));
    const [seen, any] = await Promise.all([
      one("SELECT 1 AS x FROM account_events WHERE user_id = $1 AND kind IN ('login', 'register') AND device = $2 LIMIT 1", [user.id, device]),
      one("SELECT 1 AS x FROM account_events WHERE user_id = $1 AND kind IN ('login', 'register') LIMIT 1", [user.id]),
    ]);
    const result = await issue(res, user, { req, method });
    await record(user.id, method === 'register' ? 'register' : 'login', req, method);
    await sql('UPDATE users SET last_login_at = $1 WHERE id = $2', [now(), user.id]);
    if (any && !seen && Number(user.alerts ?? 1) && user.email_verified_at) {
      await mail(user.email, 'new-login', {
        device: describeDevice(userAgent(req)).label,
        ip: clientIp(req),
        method: METHOD_LABELS[method] ?? method,
      });
    }
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

  async function readBody(req, limit = 16384) {
    // Vercel a déjà pu analyser le corps (req.body) ; sinon on lit le flux.
    if (req.body !== undefined && req.body !== null) {
      if (typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
        if (JSON.stringify(req.body).length > limit) throw error(413, 'Requête trop volumineuse.');
        return req.body;
      }
      const text = String(req.body);
      if (text.length > limit) throw error(413, 'Requête trop volumineuse.');
      try {
        return req.headers['content-type']?.includes('application/x-www-form-urlencoded')
          ? Object.fromEntries(new URLSearchParams(text))
          : JSON.parse(text || '{}');
      } catch {
        throw error(400, 'Requête invalide.');
      }
    }
    let data = '';
    let length = 0;
    for await (const chunk of req) {
      length += chunk.length;
      if (length > limit) throw error(413, 'Requête trop volumineuse.');
      data += chunk;
    }
    try {
      const parsed = req.headers['content-type']?.includes('application/x-www-form-urlencoded')
        ? Object.fromEntries(new URLSearchParams(data))
        : JSON.parse(data || '{}');
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('shape');
      return parsed;
    } catch {
      throw error(400, 'Requête invalide.');
    }
  }
  function field(data, name, max = 200) {
    const v = data[name];
    if (typeof v !== 'string' || !v.trim() || v.length > max) throw error(400, `Champ ${name} invalide.`);
    return v.trim();
  }
  function newPassword(data, name = 'password') {
    const password = data[name];
    if (typeof password !== 'string' || password.length > 512) throw error(400, 'Mot de passe invalide.');
    if (password.length < 12) throw error(400, 'Choisis un mot de passe d’au moins 12 caractères.');
    return password;
  }
  async function challenge(id, kind) {
    const c = await one('SELECT * FROM challenges WHERE id = $1 AND kind = $2 AND expires > $3', [id, kind, now()]);
    if (!c) throw error(410, 'Demande expirée ou déjà utilisée.');
    return c;
  }
  /** Consomme un défi de façon atomique (usage unique, même en concurrence). */
  async function consumeChallenge(id, kind) {
    const c = await one('DELETE FROM challenges WHERE id = $1 AND kind = $2 AND expires > $3 RETURNING *', [id, kind, now()]);
    if (!c) throw error(410, 'Demande expirée ou déjà utilisée.');
    return c;
  }

  /**
   * Second facteur : code TOTP (anti-rejeu par pas de temps) ou code de
   * secours (usage unique). Renvoie 'totp' | 'recovery' | null.
   */
  async function checkSecondFactor(user, code) {
    if (!user.mfa_secret) return null;
    if (await overLimit(`mfa:${user.id}`, 10, 600_000)) throw error(429, 'Trop de codes essayés. Réessaie dans dix minutes.');
    const text = String(code ?? '').trim();
    if (/^\d{3}\s?\d{3}$/.test(text)) {
      const secretText = vault.open(user.mfa_secret);
      if (!secretText) {
        // Clé de chiffrement changée : les codes de secours (hachés) restent valables.
        console.error(`[cord-account] secret TOTP illisible pour ${user.id} (clé de chiffrement modifiée ?)`);
        throw error(409, 'Ton application d’authentification ne peut pas être vérifiée pour le moment : utilise un code de secours.', 'mfa_unreadable');
      }
      const step = verifyTotp(secretText, text, Number(user.mfa_last_step ?? 0));
      if (step === null) return null;
      const claimed = await one('UPDATE users SET mfa_last_step = $1 WHERE id = $2 AND mfa_last_step < $1 RETURNING id', [step, user.id]);
      return claimed ? 'totp' : null;
    }
    if (text.length >= 10 && text.length <= 24) {
      const used = await one(
        'UPDATE recovery_codes SET used_at = $1 WHERE user_id = $2 AND hash = $3 AND used_at IS NULL RETURNING hash',
        [now(), user.id, hashRecoveryCode(text)],
      );
      return used ? 'recovery' : null;
    }
    return null;
  }
  async function requireSecondFactor(user, code, req) {
    if (!code) throw error(401, 'Saisis le code de ton application d’authentification.', 'mfa_required');
    const factor = await checkSecondFactor(user, code);
    if (!factor) {
      await record(user.id, 'login_failed', req, 'mfa');
      throw error(401, 'Code de vérification incorrect.', 'mfa_invalid');
    }
    if (factor === 'recovery') await record(user.id, 'recovery_used', req);
    return factor;
  }
  async function storeRecoveryCodes(userId) {
    const codes = generateRecoveryCodes();
    await sql('DELETE FROM recovery_codes WHERE user_id = $1', [userId]);
    for (const code of codes) {
      await sql('INSERT INTO recovery_codes (user_id, hash) VALUES ($1, $2)', [userId, hashRecoveryCode(code)]);
    }
    return codes;
  }

  async function setPassword(userId, password) {
    const salt = secret();
    await sql('UPDATE users SET salt = $1, password_hash = $2, password_changed_at = $3 WHERE id = $4', [
      salt,
      await derive(password, salt),
      now(),
      userId,
    ]);
  }

  // ── Vues (réponses JSON) ────────────────────────────────────────────────
  const describeSession = (s, currentHash) => {
    const device = describeDevice(s.user_agent ?? '');
    return {
      id: s.hash,
      current: s.hash === currentHash,
      createdAt: Number(s.created_at) || null,
      lastSeenAt: Number(s.last_seen_at) || null,
      expiresAt: Number(s.expires),
      method: s.method ?? null,
      device: { label: device.label, kind: device.kind, browser: device.browser, os: device.os, app: device.app, logo: device.logo },
      ip: maskIp(s.ip),
    };
  };
  const describeEvent = (e) => {
    const device = e.user_agent ? describeDevice(e.user_agent) : null;
    return { id: e.id, kind: e.kind, at: Number(e.at), detail: e.detail ?? null, device: device ? { label: device.label, kind: device.kind, app: device.app, logo: device.logo } : null, ip: maskIp(e.ip) };
  };
  const describePasskey = (p) => ({
    id: p.id,
    name: p.name,
    createdAt: Number(p.created_at),
    lastUsedAt: p.last_used_at ? Number(p.last_used_at) : null,
    backedUp: Boolean(p.backed_up),
    transports: p.transports ? JSON.parse(p.transports) : [],
  });
  const describePasscord = (k) => ({
    id: k.id,
    name: k.name,
    createdAt: Number(k.created_at),
    lastUsedAt: k.last_used_at ? Number(k.last_used_at) : null,
  });
  const profile = (u) => ({
    ...publicUser(u),
    theme: u.theme ?? 'system',
    locale: u.locale ?? 'fr',
    alerts: Boolean(Number(u.alerts ?? 1)),
    avatarUrl: avatarUrl(u),
    mfa: Boolean(u.mfa_enabled_at),
    admin: isAdmin(u),
    lastLoginAt: u.last_login_at ? Number(u.last_login_at) : null,
    passwordChangedAt: u.password_changed_at ? Number(u.password_changed_at) : null,
  });

  async function dashboard(u) {
    const [passcord, passkeys, sessions, consents, events, codes, beta] = await Promise.all([
      sql('SELECT * FROM passcord_keys WHERE user_id = $1 ORDER BY created_at', [u.id]),
      sql('SELECT * FROM passkeys WHERE user_id = $1 ORDER BY created_at', [u.id]),
      sql("SELECT * FROM sessions WHERE user_id = $1 AND purpose = 'account' AND expires > $2 ORDER BY last_seen_at DESC NULLS LAST", [u.id, now()]),
      sql('SELECT * FROM oauth_consents WHERE user_id = $1 ORDER BY last_used_at DESC', [u.id]),
      sql('SELECT * FROM account_events WHERE user_id = $1 ORDER BY at DESC LIMIT 40', [u.id]),
      one('SELECT COUNT(*) AS n FROM recovery_codes WHERE user_id = $1 AND used_at IS NULL', [u.id]),
      betaAccess(u),
    ]);
    const unread = await one('SELECT COUNT(*) AS n FROM notifications WHERE user_id = $1 AND read_at IS NULL', [u.id]);
    const pushDevices = await sql('SELECT id, device, endpoint, created_at FROM push_subscriptions WHERE user_id = $1 ORDER BY created_at DESC', [u.id]);
    return {
      user: { ...profile(u), beta },
      unread: Number(unread?.n ?? 0),
      security: {
        mfa: Boolean(u.mfa_enabled_at),
        mfaSince: u.mfa_enabled_at ? Number(u.mfa_enabled_at) : null,
        recoveryCodesLeft: Number(codes?.n ?? 0),
        passwordChangedAt: u.password_changed_at ? Number(u.password_changed_at) : null,
        mailConfigured: Boolean(deliver),
      },
      passcord: passcord.map(describePasscord),
      passkeys: passkeys.map(describePasskey),
      sessions: sessions.map((s) => describeSession(s, u.s_hash)),
      apps: consents.map((c) => ({
        ...describeClient(c.client_id, clients[c.client_id]),
        grantedAt: Number(c.granted_at),
        lastUsedAt: Number(c.last_used_at),
        scope: c.scope ?? 'openid profile email',
      })),
      activity: events.map(describeEvent),
      pushDevices: pushDevices.map((p) => ({ id: p.id, device: p.device ?? null, service: new URL(p.endpoint).host, createdAt: Number(p.created_at) })),
    };
  }

  // ── Notifications push (web app installée) ──────────────────────────────
  // Clés VAPID générées au premier besoin et gardées chiffrées avec le coffre.
  let vapidCache = null;
  async function vapidKeys() {
    if (vapidCache) return vapidCache;
    const read = async () => {
      const row = await one("SELECT value FROM service_settings WHERE key = 'vapid'", []);
      return row ? JSON.parse(vault.open(row.value)) : null;
    };
    let keys = await read();
    if (!keys) {
      await sql("INSERT INTO service_settings (key, value, updated_at) VALUES ('vapid', $1, $2) ON CONFLICT (key) DO NOTHING", [vault.seal(JSON.stringify(generateVapidKeys())), now()]);
      keys = await read();
    }
    vapidCache = keys;
    return keys;
  }
  /** Envoie une notification à tous les appareils abonnés du compte (sans jamais faire échouer l'appel). */
  async function pushTo(userId, message) {
    try {
      const subs = await sql('SELECT * FROM push_subscriptions WHERE user_id = $1', [userId]);
      if (!subs.length) return 0;
      const keys = await vapidKeys();
      const results = await Promise.all(subs.map((sub) => sendPush({ endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth }, message, { keys, subject: 'mailto:contact@cordsuite.app', fetchImpl: pushFetch })));
      const gone = subs.filter((_, i) => results[i] === 'gone').map((sub) => sub.id);
      for (const id of gone) await sql('DELETE FROM push_subscriptions WHERE id = $1', [id]);
      return results.filter((r) => r === 'sent').length;
    } catch {
      return 0;
    }
  }

  /**
   * Notification de la suite pour un compte (fil + push). `id` fixe = pas de
   * doublon : renvoie false si elle existait déjà.
   */
  async function notifyUser(userId, { app, title, body = null, url = null, id = randomUUID() }) {
    const inserted = await one(
      'INSERT INTO notifications (id, user_id, app, title, body, url, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING RETURNING id',
      [id, userId, app, title, body, url, now()],
    );
    if (!inserted) return false;
    await sql('DELETE FROM notifications WHERE user_id = $1 AND id NOT IN (SELECT id FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100)', [userId]);
    await pushTo(userId, { title, body: body ?? '', url: url ?? '/#/inbox', tag: `n-${id}` });
    return true;
  }

  /**
   * Nouveau build de bêta : annoncé une seule fois à tous ses testeurs (et à
   * l'administration). Le premier build vu sert de point de départ, sans annonce.
   */
  const buildNumber = (tag) => Number(String(tag ?? '').replace(/\D+/g, '')) || 0;
  async function announceRelease(product, release) {
    if (!release?.tag) return;
    const key = `announced:${product}`;
    const row = await one('SELECT value FROM service_settings WHERE key = $1', [key]);
    if (!row) {
      await sql('INSERT INTO service_settings (key, value, updated_at) VALUES ($1, $2, $3) ON CONFLICT (key) DO NOTHING', [key, release.tag, now()]);
      return;
    }
    if (buildNumber(release.tag) <= buildNumber(row.value)) return;
    // Plusieurs fonctions en parallèle : une seule gagne le droit d'annoncer.
    const claimed = await one('UPDATE service_settings SET value = $2, updated_at = $3 WHERE key = $1 AND value = $4 RETURNING key', [key, release.tag, now(), row.value]);
    if (!claimed) return;
    const testers = new Set((await sql('SELECT user_id FROM beta_access WHERE product = $1', [product])).map((r) => r.user_id));
    for (const email of adminEmails) {
      const admin = await one('SELECT id, email_verified_at FROM users WHERE email = $1', [email]);
      if (admin?.email_verified_at) testers.add(admin.id);
    }
    const name = BETA_PRODUCTS[product].name;
    for (const userId of testers) {
      await notifyUser(userId, {
        id: `release:${product}:${release.tag}:${userId}`,
        app: product,
        title: `${name} ${release.build} est disponible`,
        body: 'CordLauncher l’installe sur ton iPhone dès qu’il est branché (ou en Wi-Fi).',
        url: '/#/apps',
      });
    }
  }

  // ── Passcord : demandes envoyées à l'iPhone ────────────────────────────
  const loginLink = (c, payload) =>
    `passcord://cord/login?server=${encodeURIComponent(issuer)}&id=${c.id}&challenge=${c.challenge}` +
    (payload?.choices?.length ? `&choices=${payload.choices.join(',')}` : '') +
    (payload?.device ? `&device=${encodeURIComponent(payload.device)}` : '');
  const challengePayload = (c) => {
    try {
      return c.payload ? JSON.parse(c.payload) : null;
    } catch {
      return null;
    }
  };
  /** Clé Passcord authentifiée par son jeton de boîte de réception (sans Face ID). */
  async function inboxKey(data) {
    const k = await one('SELECT * FROM passcord_keys WHERE id = $1', [field(data, 'keyId', 64)]);
    if (!k?.inbox_hash || !safeEqual(k.inbox_hash, hash(field(data, 'token', 128)))) throw error(403, 'Clé Passcord inconnue ou révoquée.', 'inbox_denied');
    return k;
  }
  function verifyPasscordSignature(k, message, signature) {
    try {
      return Boolean(k) && verify(null, Buffer.from(message), createPublicKey({ key: JSON.parse(k.public_key), format: 'jwk' }), Buffer.from(String(signature ?? ''), 'base64url'));
    } catch {
      return false;
    }
  }

  // ── Portail : fichiers servis depuis le module généré ───────────────────
  function serveAsset(res, path, url) {
    if (path === '/sw.js' && portal.PORTAL_SW) {
      res.setHeader('Cache-Control', 'no-cache');
      res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' });
      res.end(portal.PORTAL_SW);
      return true;
    }
    if (path === '/portal.js' || path === '/portal.css') {
      const js = path === '/portal.js';
      const versioned = url.searchParams.get('v') === portal.PORTAL_VERSION;
      res.setHeader('Cache-Control', versioned ? 'public, max-age=31536000, immutable' : 'no-cache');
      res.writeHead(200, { 'Content-Type': js ? 'text/javascript; charset=utf-8' : 'text/css; charset=utf-8' });
      res.end(js ? portal.PORTAL_JS : portal.PORTAL_CSS);
      return true;
    }
    const assetPath = path === '/favicon.ico' ? '/assets/icon-32.png' : path === '/apple-touch-icon.png' ? '/assets/icon-180.png' : path;
    const asset = portal.PORTAL_ASSETS?.[assetPath];
    if (!asset) return false;
    res.setHeader('Cache-Control', 'public, max-age=604800');
    res.writeHead(200, { 'Content-Type': asset[0] });
    res.end(Buffer.from(asset[1], 'base64'));
    return true;
  }

  async function handle(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), publickey-credentials-get=(self), publickey-credentials-create=(self)');
    if (origin.protocol === 'https:') res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
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
      // Catalogue public de la suite, lu par CordLauncher (fenêtre d'une autre origine).
      if (path === '/api/catalog' && ['GET', 'HEAD', 'OPTIONS'].includes(method)) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'public, max-age=300');
        if (method === 'OPTIONS') {
          res.writeHead(204);
          return res.end();
        }
        return json(CATALOG);
      }
      if (req.headers.origin && req.headers.origin !== issuer) throw error(403, 'Origine refusée.');

      if (method === 'GET' || method === 'HEAD') {
        if (path === '/' || path === '/authorize') return send(portal.PORTAL_HTML, 'text/html; charset=utf-8');
        if (serveAsset(res, path, url)) return;
      }
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
          claims_supported: ['sub', 'name', 'email', 'email_verified', 'picture'],
          code_challenge_methods_supported: ['S256'],
          prompt_values_supported: ['consent', 'login', 'create'],
          grant_types_supported: ['authorization_code'],
        });
      if (method === 'GET' && path === '/.well-known/jwks.json') return json({ keys: [jwk] });
      if (method === 'GET' && path === '/oauth/userinfo') {
        const { user } = await session(req, 'userinfo');
        const picture = avatarUrl(user);
        return json({
          sub: user.id,
          name: user.name,
          email: user.email,
          email_verified: Boolean(user.email_verified_at),
          ...(picture ? { picture } : {}),
        });
      }
      if (method === 'GET' && path.startsWith('/avatar/')) {
        const u = await one('SELECT avatar FROM users WHERE id = $1', [path.slice(8)]);
        const match = u?.avatar?.match(AVATAR_RE);
        if (!match) throw error(404, 'Introuvable.');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
        return send(Buffer.from(match[2], 'base64'), `image/${match[1]}`);
      }
      if (method === 'GET' && path === '/api/client') {
        const id = url.searchParams.get('id');
        const client = Object.hasOwn(clients, id ?? '') ? clients[id] : undefined;
        if (!client) throw error(404, 'Application inconnue.');
        return json(describeClient(id, client));
      }
      if (method === 'GET' && path === '/api/suite') {
        return json({ apps: SUITE.map((a) => ({ ...a, logo: `/assets/logos/${a.slug}.png` })), features: { mail: Boolean(deliver) } });
      }
      if (method === 'GET' && path === '/api/authorize/context') {
        const id = url.searchParams.get('client_id') ?? '';
        const client = Object.hasOwn(clients, id) ? clients[id] : undefined;
        if (!client) throw error(400, 'Application inconnue.');
        const redirectValid = client.redirectUris.includes(url.searchParams.get('redirect_uri'));
        const current = await optionalSession(req);
        const consent = current
          ? await one('SELECT granted_at FROM oauth_consents WHERE user_id = $1 AND client_id = $2', [current.user.id, id])
          : null;
        return json({
          client: describeClient(id, client),
          redirectValid,
          consented: Boolean(consent),
          user: current ? profile(current.user) : null,
        });
      }
      if (method === 'GET' && path === '/api/me') {
        const { user } = await session(req);
        const keys = await sql('SELECT * FROM passcord_keys WHERE user_id = $1 ORDER BY created_at', [user.id]);
        return json({ user: { ...profile(user), beta: await betaAccess(user) }, keys: keys.map(describePasscord) });
      }
      if (method === 'GET' && path === '/api/account') {
        const { user } = await session(req);
        return json(await dashboard(user));
      }
      if (method === 'GET' && path === '/api/sessions') {
        const { user } = await session(req);
        const rows = await sql(
          "SELECT * FROM sessions WHERE user_id = $1 AND purpose = 'account' AND expires > $2 ORDER BY last_seen_at DESC NULLS LAST",
          [user.id, now()],
        );
        return json({ sessions: rows.map((s) => describeSession(s, user.s_hash)) });
      }
      if (method === 'GET' && path === '/api/activity') {
        const { user } = await session(req);
        const before = Number(url.searchParams.get('before')) || now() + 1;
        const rows = await sql('SELECT * FROM account_events WHERE user_id = $1 AND at < $2 ORDER BY at DESC LIMIT 50', [user.id, before]);
        return json({ events: rows.map(describeEvent), more: rows.length === 50 });
      }
      if (method === 'GET' && path === '/api/connected-apps') {
        const { user } = await session(req);
        return json({ apps: (await dashboard(user)).apps });
      }
      if (method === 'GET' && path === '/api/account/export') {
        const { user } = await session(req);
        const [passcord, passkeys, sessions, consents, events, codes, pushes] = await Promise.all([
          sql('SELECT id, name, public_key, created_at, last_used_at FROM passcord_keys WHERE user_id = $1 ORDER BY created_at', [user.id]),
          sql('SELECT id, name, alg, transports, backed_up, created_at, last_used_at FROM passkeys WHERE user_id = $1 ORDER BY created_at', [user.id]),
          sql('SELECT created_at, last_seen_at, expires, purpose, method, client_id, user_agent, ip FROM sessions WHERE user_id = $1 ORDER BY created_at DESC', [user.id]),
          sql('SELECT client_id, scope, granted_at, last_used_at FROM oauth_consents WHERE user_id = $1 ORDER BY last_used_at DESC', [user.id]),
          sql('SELECT kind, at, detail, ip, user_agent FROM account_events WHERE user_id = $1 ORDER BY at DESC', [user.id]),
          one('SELECT COUNT(*) AS n FROM recovery_codes WHERE user_id = $1 AND used_at IS NULL', [user.id]),
          sql('SELECT device, endpoint, created_at FROM push_subscriptions WHERE user_id = $1 ORDER BY created_at', [user.id]),
        ]);
        const iso = (v) => (v ? new Date(Number(v)).toISOString() : null);
        const body = {
          format: 'cord-account-export/1',
          exportedAt: new Date().toISOString(),
          issuer,
          note: 'Ton mot de passe, ton secret TOTP et tes codes de secours ne sont jamais exportés : on ne les connaît que sous forme chiffrée ou hachée.',
          profile: {
            id: user.id,
            email: user.email,
            emailVerifiedAt: iso(user.email_verified_at),
            name: user.name,
            createdAt: iso(user.created_at),
            lastLoginAt: iso(user.last_login_at),
            passwordChangedAt: iso(user.password_changed_at),
            hasAvatar: Boolean(user.avatar),
            preferences: { theme: user.theme, locale: user.locale, loginAlerts: Boolean(Number(user.alerts ?? 1)) },
          },
          security: { twoFactor: Boolean(user.mfa_enabled_at), twoFactorSince: iso(user.mfa_enabled_at), recoveryCodesLeft: Number(codes?.n ?? 0) },
          passcordDevices: passcord.map((k) => ({ id: k.id, name: k.name, publicKey: JSON.parse(k.public_key), createdAt: iso(k.created_at), lastUsedAt: iso(k.last_used_at) })),
          pushDevices: pushes.map((p) => ({ device: p.device, service: new URL(p.endpoint).host, createdAt: iso(p.created_at) })),
          passkeys: passkeys.map((p) => ({ id: p.id, name: p.name, algorithm: p.alg, transports: p.transports ? JSON.parse(p.transports) : [], synced: Boolean(p.backed_up), createdAt: iso(p.created_at), lastUsedAt: iso(p.last_used_at) })),
          sessions: sessions.map((s) => ({ kind: s.purpose === 'account' ? 'compte' : `app:${s.client_id ?? '?'}`, method: s.method, createdAt: iso(s.created_at), lastSeenAt: iso(s.last_seen_at), expiresAt: iso(s.expires), userAgent: s.user_agent, ip: s.ip })),
          connectedApps: consents.map((c) => ({ clientId: c.client_id, name: describeClient(c.client_id, clients[c.client_id]).name, scope: c.scope ?? 'openid profile email', grantedAt: iso(c.granted_at), lastUsedAt: iso(c.last_used_at) })),
          activity: events.map((e) => ({ kind: e.kind, at: iso(e.at), detail: e.detail, ip: e.ip, userAgent: e.user_agent })),
        };
        res.setHeader('Content-Disposition', `attachment; filename="compte-cord-${new Date().toISOString().slice(0, 10)}.json"`);
        return json(body);
      }
      if (method === 'GET' && path === '/api/hub') {
        const { user } = await session(req);
        return json(await hub(user));
      }
      if (method === 'GET' && path === '/api/notifications') {
        const { user } = await session(req);
        const before = Number(url.searchParams.get('before')) || now() + 1;
        const [rows, unread] = await Promise.all([
          sql('SELECT * FROM notifications WHERE user_id = $1 AND created_at < $2 ORDER BY created_at DESC LIMIT 30', [user.id, before]),
          one('SELECT COUNT(*) AS n FROM notifications WHERE user_id = $1 AND read_at IS NULL', [user.id]),
        ]);
        return json({ items: rows.map(describeNotification), unread: Number(unread?.n ?? 0), more: rows.length === 30 });
      }
      if (method === 'GET' && path.startsWith('/api/beta/')) {
        const { user } = await session(req);
        const product = betaProduct(path.slice('/api/beta/'.length));
        const access = (await betaAccess(user)).includes(product);
        const release = access ? await releaseInfo(product) : null;
        if (release) await announceRelease(product, release).catch((e) => console.error('[cord-account] annonce', e));
        return json({ product, name: BETA_PRODUCTS[product].name, access, downloads: Boolean(await releasesFor(product)), release });
      }
      if (method === 'GET' && path === '/api/admin/beta') {
        const { user } = await session(req);
        if (!isAdmin(user)) throw error(403, 'Réservé à l’administration du Compte Cord.');
        const product = betaProduct(url.searchParams.get('product') ?? 'passcord');
        const [keys, testers] = await Promise.all([
          sql('SELECT * FROM beta_keys WHERE product = $1 ORDER BY created_at DESC LIMIT 500', [product]),
          sql(
            `SELECT beta_access.user_id, beta_access.granted_at, users.name, users.email, beta_keys.label, beta_keys.hint
               FROM beta_access JOIN users ON users.id = beta_access.user_id
               LEFT JOIN beta_keys ON beta_keys.id = beta_access.key_id
              WHERE beta_access.product = $1 ORDER BY beta_access.granted_at DESC`,
            [product],
          ),
        ]);
        return json({
          product,
          name: BETA_PRODUCTS[product].name,
          downloads: Boolean(await releasesFor(product)),
          downloadsSource: await downloadsSource(product),
          repo: BETA_PRODUCTS[product].repo,
          release: await releaseInfo(product),
          keys: keys.map(describeBetaKey),
          testers: testers.map((r) => ({ userId: r.user_id, name: r.name, email: r.email, grantedAt: Number(r.granted_at), keyLabel: r.label ?? null, keyHint: r.hint ?? null })),
        });
      }
      if (method === 'GET' && path === '/api/admin/overview') {
        const { user } = await session(req);
        if (!isAdmin(user)) throw error(403, 'Réservé à l’administration du Compte Cord.');
        const t = now();
        const [totals, byDay, consents] = await Promise.all([
          one(
            `SELECT
               (SELECT COUNT(*) FROM users) AS users,
               (SELECT COUNT(*) FROM users WHERE email_verified_at IS NOT NULL) AS verified,
               (SELECT COUNT(*) FROM users WHERE mfa_enabled_at IS NOT NULL) AS mfa,
               (SELECT COUNT(DISTINCT user_id) FROM passkeys) AS passkey_users,
               (SELECT COUNT(DISTINCT user_id) FROM passcord_keys) AS passcord_users,
               (SELECT COUNT(*) FROM sessions WHERE purpose = 'account' AND expires > $1) AS sessions,
               (SELECT COUNT(*) FROM users WHERE created_at > $2) AS signups7,
               (SELECT COUNT(*) FROM users WHERE created_at > $3) AS signups30,
               (SELECT COUNT(*) FROM account_events WHERE kind = 'login' AND at > $4) AS logins24,
               (SELECT COUNT(*) FROM account_events WHERE kind = 'login_failed' AND at > $4) AS failures24`,
            [t, t - 7 * DAY, t - 30 * DAY, t - DAY],
          ),
          sql('SELECT FLOOR(created_at / 86400000) AS day, COUNT(*) AS n FROM users WHERE created_at > $1 GROUP BY 1 ORDER BY 1', [t - 30 * DAY]),
          sql('SELECT client_id, COUNT(*) AS n, MAX(last_used_at) AS last FROM oauth_consents GROUP BY client_id', []),
        ]);
        const consentMap = new Map(consents.map((c) => [c.client_id, c]));
        return json({
          totals: Object.fromEntries(Object.entries(totals).map(([k, v]) => [k, Number(v)])),
          signups: byDay.map((d) => ({ day: Number(d.day) * DAY, count: Number(d.n) })),
          clients: Object.entries(clients).map(([id, c]) => ({
            ...describeClient(id, c),
            redirectUris: c.redirectUris ?? [],
            users: Number(consentMap.get(id)?.n ?? 0),
            lastUsedAt: consentMap.get(id)?.last ? Number(consentMap.get(id).last) : null,
          })),
          mail: Boolean(deliver),
        });
      }
      if (method === 'GET' && path === '/api/push/key') return json({ publicKey: (await vapidKeys()).publicKey });
      if (!['POST', 'PATCH', 'DELETE'].includes(method)) throw error(404, 'Introuvable.');

      const ip = clientIp(req);
      if (await overLimit(`ip:${ip}`, 120, 60_000)) throw error(429, 'Trop de demandes. Réessaie dans une minute.');
      const data = await readBody(req, path === '/api/me' && method === 'PATCH' ? 256 * 1024 : 16384);

      // ── Inscription / connexion ────────────────────────────────────────
      if (['/api/register', '/api/login'].includes(path) && method === 'POST') {
        if (await overLimit(`auth:${ip}`, 20, 600_000))
          throw error(429, 'Trop de tentatives. Réessaie dans dix minutes.');
        const email = field(data, 'email', 254).toLowerCase();
        if (typeof data.password !== 'string' || !data.password.length || data.password.length > 512)
          throw error(400, 'Mot de passe invalide.');
        const password = data.password;
        if (!EMAIL_RE.test(email)) throw error(400, 'Adresse email invalide.');
        if (path === '/api/register') {
          if (password.length < 12) throw error(400, 'Choisis un mot de passe d’au moins 12 caractères.');
          const name = field(data, 'name', 60);
          const salt = secret();
          const t = now();
          const u = { id: `cord_${randomUUID()}`, email, name, salt, password_hash: await derive(password, salt), created_at: t, alerts: 1 };
          try {
            await sql(
              'INSERT INTO users (id, email, name, salt, password_hash, created_at, password_changed_at) VALUES ($1, $2, $3, $4, $5, $6, $6)',
              [u.id, email, name, salt, u.password_hash, t],
            );
          } catch (e) {
            if (String(e).includes('duplicate') || String(e).toLowerCase().includes('unique'))
              throw error(409, 'Un compte utilise déjà cette adresse.');
            throw e;
          }
          return json(await completeLogin(req, res, u, 'register'), 201);
        }
        const u = await one('SELECT * FROM users WHERE email = $1', [email]);
        const derived = await derive(password, u?.salt ?? 'invalid-account-salt');
        if (!u || !safeEqual(derived, u.password_hash)) {
          if (u) await record(u.id, 'login_failed', req, 'password');
          throw error(401, 'Email ou mot de passe incorrect.');
        }
        if (u.mfa_enabled_at) await requireSecondFactor(u, data.otp, req);
        return json(await completeLogin(req, res, u, 'password'));
      }
      if (path === '/api/logout' && method === 'POST') {
        const { token } = await session(req);
        await sql('DELETE FROM sessions WHERE hash = $1', [hash(token)]);
        res.setHeader('Set-Cookie', sessionCookie('', 0));
        return json({ ok: true });
      }

      // ── Email ──────────────────────────────────────────────────────────
      if (path === '/api/email/send' && method === 'POST') {
        const { user } = await session(req);
        if (user.email_verified_at) return json({ ok: true });
        if (!deliver) throw error(503, 'L’envoi des emails doit être configuré sur le service Cord.');
        const previous = await one(
          "SELECT expires FROM challenges WHERE kind = 'email' AND user_id = $1 ORDER BY expires DESC LIMIT 1",
          [user.id],
        );
        if (previous && Number(previous.expires) > now() + 14 * 60_000)
          throw error(429, 'Attends une minute avant de renvoyer l’email.');
        const token = secret();
        const id = hash(token);
        // Lien ET code à 6 chiffres : le code se tape sans quitter l'app en cours
        // (inscription depuis Drivecord, etc.). Seule son empreinte est gardée.
        const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
        await sql('INSERT INTO challenges (id, kind, user_id, challenge, expires) VALUES ($1, $2, $3, $4, $5)', [
          id,
          'email',
          user.id,
          emailCodeHash(user.id, code),
          now() + 15 * 60_000,
        ]);
        let delivery;
        try {
          delivery = await mail(user.email, 'verify', { url: `${issuer}/?verify=${token}`, code }, { required: true });
        } catch (e) {
          await sql('DELETE FROM challenges WHERE id = $1', [id]);
          throw e;
        }
        return json({ ok: true, ...(delivery?.devUrl ? { devUrl: delivery.devUrl, devCode: code } : {}) });
      }
      if (path === '/api/email/verify-code' && method === 'POST') {
        const { user } = await session(req);
        if (user.email_verified_at) return json({ ok: true });
        if (await overLimit(`email-code:${user.id}`, 8, 15 * 60_000)) throw error(429, 'Trop d’essais. Demande un nouveau code dans quelques minutes.');
        const code = String(data.code ?? '').replace(/\D/g, '');
        const match = code.length === 6
          ? await one("SELECT id FROM challenges WHERE kind = 'email' AND user_id = $1 AND challenge = $2 AND expires > $3", [user.id, emailCodeHash(user.id, code), now()])
          : null;
        if (!match) throw error(400, 'Code incorrect ou expiré.', 'code_invalid');
        await sql('UPDATE users SET email_verified_at = $1 WHERE id = $2', [now(), user.id]);
        await sql("DELETE FROM challenges WHERE kind = 'email' AND user_id = $1", [user.id]);
        await record(user.id, 'email_verified', req);
        return json({ ok: true });
      }
      if (path === '/api/email/verify' && method === 'POST') {
        const c = await challenge(hash(field(data, 'token')), 'email');
        await sql('UPDATE users SET email_verified_at = $1 WHERE id = $2', [now(), c.user_id]);
        await sql("DELETE FROM challenges WHERE kind = 'email' AND user_id = $1", [c.user_id]);
        await record(c.user_id, 'email_verified', req);
        return json({ ok: true });
      }
      if (path === '/api/email/change' && method === 'POST') {
        const { user } = await session(req);
        const email = field(data, 'email', 254).toLowerCase();
        if (!EMAIL_RE.test(email)) throw error(400, 'Adresse email invalide.');
        if (email === user.email) throw error(400, 'C’est déjà ton adresse.');
        if (!recentlyStrong(user)) {
          if (typeof data.password !== 'string' || !safeEqual(await derive(data.password, user.salt), user.password_hash))
            throw error(403, 'Mot de passe incorrect.', 'password_invalid');
        }
        if (await overLimit(`email-change:${user.id}`, 5, 3600_000)) throw error(429, 'Trop de demandes. Réessaie dans une heure.');
        if (await one('SELECT 1 AS x FROM users WHERE email = $1', [email])) throw error(409, 'Un compte utilise déjà cette adresse.');
        const token = secret();
        await sql("DELETE FROM challenges WHERE kind = 'email-change' AND user_id = $1", [user.id]);
        await sql('INSERT INTO challenges (id, kind, user_id, challenge, expires, payload) VALUES ($1, $2, $3, $4, $5, $6)', [
          hash(token),
          'email-change',
          user.id,
          '',
          now() + 30 * 60_000,
          email,
        ]);
        const delivery = await mail(email, 'email-change', { url: `${issuer}/?email-change=${token}`, newEmail: email }, { required: true }).catch(async (e) => {
          await sql('DELETE FROM challenges WHERE id = $1', [hash(token)]);
          throw e;
        });
        return json({ ok: true, ...(delivery?.devUrl ? { devUrl: delivery.devUrl } : {}) });
      }
      if (path === '/api/email/change/confirm' && method === 'POST') {
        const c = await consumeChallenge(hash(field(data, 'token')), 'email-change');
        const user = await one('SELECT * FROM users WHERE id = $1', [c.user_id]);
        try {
          await sql('UPDATE users SET email = $1, email_verified_at = $2 WHERE id = $3', [c.payload, now(), c.user_id]);
        } catch (e) {
          if (String(e).includes('duplicate') || String(e).toLowerCase().includes('unique'))
            throw error(409, 'Un compte utilise déjà cette adresse.');
          throw e;
        }
        await record(c.user_id, 'email_changed', req, `${maskEmail(user.email)} → ${maskEmail(c.payload)}`);
        if (user.email_verified_at) await mail(user.email, 'email-changed', { newEmail: c.payload });
        return json({ ok: true, email: c.payload });
      }

      // ── Mot de passe oublié ────────────────────────────────────────────
      if (path === '/api/password/forgot' && method === 'POST') {
        if (await overLimit(`forgot:${ip}`, 5, 900_000)) throw error(429, 'Trop de demandes. Réessaie dans un quart d’heure.');
        const email = field(data, 'email', 254).toLowerCase();
        if (!EMAIL_RE.test(email)) throw error(400, 'Adresse email invalide.');
        if (!deliver) throw error(503, 'L’envoi des emails doit être configuré sur le service Cord.');
        const u = await one('SELECT * FROM users WHERE email = $1', [email]);
        // Même réponse que le compte existe ou non (pas d'énumération).
        if (!u || (await overLimit(`forgot-user:${u.id}`, 3, 3600_000))) return json({ ok: true });
        const token = secret();
        await sql("DELETE FROM challenges WHERE kind = 'reset' AND user_id = $1", [u.id]);
        await sql('INSERT INTO challenges (id, kind, user_id, challenge, expires) VALUES ($1, $2, $3, $4, $5)', [
          hash(token),
          'reset',
          u.id,
          '',
          now() + 30 * 60_000,
        ]);
        const delivery = await mail(u.email, 'reset', { url: `${issuer}/?reset=${token}`, device: describeDevice(userAgent(req)).label });
        await record(u.id, 'password_reset_requested', req);
        return json({ ok: true, ...(delivery?.devUrl ? { devUrl: delivery.devUrl } : {}) });
      }
      if (path === '/api/password/reset/check' && method === 'POST') {
        const c = await challenge(hash(field(data, 'token')), 'reset');
        const u = await one('SELECT email, mfa_enabled_at FROM users WHERE id = $1', [c.user_id]);
        return json({ email: maskEmail(u.email), mfa: Boolean(u.mfa_enabled_at), expiresAt: Number(c.expires) });
      }
      if (path === '/api/password/reset' && method === 'POST') {
        const id = hash(field(data, 'token'));
        const c = await challenge(id, 'reset');
        const password = newPassword(data);
        const u = await one('SELECT * FROM users WHERE id = $1', [c.user_id]);
        if (u.mfa_enabled_at) await requireSecondFactor(u, data.otp, req);
        await consumeChallenge(id, 'reset');
        await setPassword(u.id, password);
        await sql('UPDATE users SET email_verified_at = COALESCE(email_verified_at, $1) WHERE id = $2', [now(), u.id]);
        await sql('DELETE FROM sessions WHERE user_id = $1', [u.id]);
        await record(u.id, 'password_reset', req);
        await mail(u.email, 'password-changed', { device: describeDevice(userAgent(req)).label });
        const fresh = await one('SELECT * FROM users WHERE id = $1', [u.id]);
        return json(await completeLogin(req, res, fresh, 'reset'));
      }

      // ── Profil ─────────────────────────────────────────────────────────
      if (path === '/api/me' && method === 'PATCH') {
        const { user } = await session(req);
        const name = data.name === undefined ? user.name : field(data, 'name', 60);
        const theme = ['system', 'dark', 'light'].includes(data.theme) ? data.theme : user.theme ?? 'system';
        const locale = ['fr', 'en'].includes(data.locale) ? data.locale : user.locale ?? 'fr';
        const alerts = typeof data.alerts === 'boolean' ? Number(data.alerts) : Number(user.alerts ?? 1);
        let avatar = user.avatar ?? null;
        if (data.avatar === null) avatar = null;
        else if (data.avatar !== undefined) {
          const match = typeof data.avatar === 'string' && data.avatar.length <= AVATAR_MAX ? data.avatar.match(AVATAR_RE) : null;
          const bytes = match ? Buffer.from(match[2], 'base64') : null;
          const magic =
            bytes &&
            ((match[1] === 'png' && bytes.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))) ||
              (match[1] === 'jpeg' && bytes[0] === 0xff && bytes[1] === 0xd8) ||
              (match[1] === 'webp' && bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP'));
          if (!magic) throw error(400, 'Image refusée : PNG, JPEG ou WebP de moins de 130 Ko.');
          avatar = data.avatar;
        }
        await sql('UPDATE users SET name = $1, theme = $2, locale = $3, avatar = $4, alerts = $5 WHERE id = $6', [name, theme, locale, avatar, alerts, user.id]);
        if (name !== user.name) await record(user.id, 'profile_updated', req, 'name');
        if (avatar !== (user.avatar ?? null)) await record(user.id, 'profile_updated', req, 'avatar');
        return json({ user: profile(await one('SELECT * FROM users WHERE id = $1', [user.id])) });
      }
      if (path === '/api/me' && method === 'DELETE') {
        const { user } = await session(req);
        for (const table of ['sessions', 'challenges', 'codes', 'passcord_keys', 'passkeys', 'oauth_consents', 'recovery_codes', 'account_events', 'beta_access', 'app_status', 'notifications', 'push_subscriptions']) {
          await sql(`DELETE FROM ${table} WHERE user_id = $1`, [user.id]);
        }
        await sql('DELETE FROM users WHERE id = $1', [user.id]);
        res.setHeader('Set-Cookie', sessionCookie('', 0));
        if (user.email_verified_at) await mail(user.email, 'account-deleted', {});
        return json({ ok: true });
      }

      // ── Sécurité ───────────────────────────────────────────────────────
      if (path === '/api/security/password' && method === 'POST') {
        const { user } = await session(req);
        if (await overLimit(`password:${user.id}`, 10, 3600_000)) throw error(429, 'Trop de tentatives. Réessaie dans une heure.');
        if (!recentlyStrong(user)) {
          if (typeof data.current !== 'string' || !safeEqual(await derive(data.current, user.salt), user.password_hash))
            throw error(403, 'Mot de passe actuel incorrect.', 'password_invalid');
        }
        const password = newPassword(data);
        if (safeEqual(await derive(password, user.salt), user.password_hash)) throw error(400, 'Choisis un mot de passe différent de l’actuel.');
        await setPassword(user.id, password);
        const closed = await sql("DELETE FROM sessions WHERE user_id = $1 AND hash <> $2 RETURNING hash", [user.id, user.s_hash]);
        await record(user.id, 'password_changed', req);
        await mail(user.email, 'password-changed', { device: describeDevice(userAgent(req)).label });
        return json({ ok: true, closedSessions: closed.length });
      }
      if (path === '/api/security/totp' && method === 'POST') {
        const { user } = await session(req);
        const action = field(data, 'action', 20);
        if (action === 'setup') {
          if (user.mfa_enabled_at) throw error(409, 'La double authentification est déjà active.');
          await requireReauth(user, data);
          const secretText = generateTotpSecret();
          await sql('UPDATE users SET mfa_pending = $1 WHERE id = $2', [vault.seal(secretText), user.id]);
          return json({ secret: secretText, otpauth: otpauthUri({ secret: secretText, account: user.email, issuer: 'Cord' }) });
        }
        if (action === 'enable') {
          if (user.mfa_enabled_at) throw error(409, 'La double authentification est déjà active.');
          if (!user.mfa_pending) throw error(400, 'Commence par scanner le QR code.');
          if (await overLimit(`mfa:${user.id}`, 10, 600_000)) throw error(429, 'Trop de codes essayés. Réessaie dans dix minutes.');
          const pending = vault.open(user.mfa_pending);
          if (!pending) throw error(400, 'Recommence la configuration : scanne le nouveau QR code.');
          const step = verifyTotp(pending, data.code);
          if (step === null) throw error(403, 'Code de vérification incorrect.', 'mfa_invalid');
          await sql('UPDATE users SET mfa_secret = mfa_pending, mfa_pending = NULL, mfa_enabled_at = $1, mfa_last_step = $2 WHERE id = $3', [now(), step, user.id]);
          const recoveryCodes = await storeRecoveryCodes(user.id);
          await record(user.id, 'mfa_enabled', req);
          await mail(user.email, 'mfa-enabled', {});
          return json({ enabled: true, recoveryCodes });
        }
        if (!user.mfa_enabled_at) throw error(400, 'La double authentification n’est pas active.');
        if (action === 'disable') {
          if (!(await checkSecondFactor(user, data.code))) throw error(403, 'Code de vérification incorrect.', 'mfa_invalid');
          await sql('UPDATE users SET mfa_secret = NULL, mfa_pending = NULL, mfa_enabled_at = NULL, mfa_last_step = 0 WHERE id = $1', [user.id]);
          await sql('DELETE FROM recovery_codes WHERE user_id = $1', [user.id]);
          await record(user.id, 'mfa_disabled', req);
          await mail(user.email, 'mfa-disabled', {});
          return json({ enabled: false });
        }
        if (action === 'regenerate') {
          if ((await checkSecondFactor(user, data.code)) !== 'totp') throw error(403, 'Code de vérification incorrect.', 'mfa_invalid');
          const recoveryCodes = await storeRecoveryCodes(user.id);
          await record(user.id, 'recovery_regenerated', req);
          return json({ recoveryCodes });
        }
        throw error(400, 'Action TOTP inconnue.');
      }
      if (path === '/api/sessions' && method === 'DELETE') {
        const { user } = await session(req);
        const closed = await sql("DELETE FROM sessions WHERE hash = $1 AND user_id = $2 AND purpose = 'account' RETURNING hash", [field(data, 'id', 64), user.id]);
        if (closed.length) await record(user.id, 'session_revoked', req);
        return json({ ok: true });
      }
      if (path === '/api/sessions/revoke-others' && method === 'POST') {
        const { user } = await session(req);
        const closed = await sql("DELETE FROM sessions WHERE user_id = $1 AND purpose = 'account' AND hash <> $2 RETURNING hash", [user.id, user.s_hash]);
        if (closed.length) await record(user.id, 'sessions_revoked', req, closed.length);
        return json({ ok: true, closed: closed.length });
      }
      if (path === '/api/connected-apps' && method === 'DELETE') {
        const { user } = await session(req);
        const clientId = field(data, 'clientId', 100);
        const removed = await sql('DELETE FROM oauth_consents WHERE user_id = $1 AND client_id = $2 RETURNING client_id', [user.id, clientId]);
        await sql("DELETE FROM sessions WHERE user_id = $1 AND purpose = 'userinfo' AND client_id = $2", [user.id, clientId]);
        await sql('DELETE FROM codes WHERE user_id = $1 AND client_id = $2', [user.id, clientId]);
        if (removed.length) await record(user.id, 'app_revoked', req, describeClient(clientId, clients[clientId]).name);
        return json({ ok: true });
      }

      // ── Passkeys (WebAuthn) ────────────────────────────────────────────
      if (path === '/api/passkeys/register/options' && method === 'POST') {
        const { user } = await session(req);
        const existing = await sql('SELECT id, transports FROM passkeys WHERE user_id = $1', [user.id]);
        if (existing.length >= 20) throw error(400, 'Vingt passkeys maximum : supprimes-en une d’abord.');
        await requireReauth(user, data);
        const id = secret();
        const challengeText = secret();
        await sql('INSERT INTO challenges (id, kind, user_id, challenge, expires) VALUES ($1, $2, $3, $4, $5)', [
          id,
          'passkey-reg',
          user.id,
          challengeText,
          now() + 5 * 60_000,
        ]);
        return json({
          id,
          publicKey: {
            challenge: challengeText,
            rp: { id: rpId, name: 'Compte Cord' },
            user: { id: b64u(user.id), name: user.email, displayName: user.name },
            pubKeyCredParams: [
              { type: 'public-key', alg: -8 },
              { type: 'public-key', alg: -7 },
              { type: 'public-key', alg: -257 },
            ],
            timeout: 300_000,
            attestation: 'none',
            authenticatorSelection: { residentKey: 'required', requireResidentKey: true, userVerification: 'required' },
            excludeCredentials: existing.map((p) => ({ type: 'public-key', id: p.id, ...(p.transports ? { transports: JSON.parse(p.transports) } : {}) })),
          },
        });
      }
      if (path === '/api/passkeys/register' && method === 'POST') {
        const { user } = await session(req);
        const c = await consumeChallenge(field(data, 'id'), 'passkey-reg');
        if (c.user_id !== user.id) throw error(403, 'Cette demande appartient à un autre compte.');
        const credential = data.credential ?? {};
        let result;
        try {
          result = verifyRegistration({
            clientDataJSON: Buffer.from(field(credential, 'clientDataJSON', 4096), 'base64url'),
            attestationObject: Buffer.from(field(credential, 'attestationObject', 8192), 'base64url'),
            challenge: c.challenge,
            origin: issuer,
            rpId,
          });
        } catch (e) {
          throw error(400, e.message || 'Passkey refusée.');
        }
        if (result.credentialId !== credential.id) throw error(400, 'Identifiant de passkey incohérent.');
        const transports = Array.isArray(credential.transports)
          ? credential.transports.filter((x) => typeof x === 'string' && /^[a-z-]{2,16}$/.test(x)).slice(0, 6)
          : [];
        const name = typeof data.name === 'string' && data.name.trim() ? data.name.trim().slice(0, 60) : 'Passkey';
        try {
          await sql(
            'INSERT INTO passkeys (id, user_id, name, public_key, alg, sign_count, transports, backed_up, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [result.credentialId, user.id, name, JSON.stringify(result.jwk), result.alg, result.signCount, JSON.stringify(transports), Number(result.backedUp), now()],
          );
        } catch (e) {
          if (String(e).includes('duplicate') || String(e).toLowerCase().includes('unique')) throw error(409, 'Cette passkey est déjà enregistrée.');
          throw e;
        }
        await record(user.id, 'passkey_added', req, name);
        await mail(user.email, 'passkey-added', { name });
        return json({ passkey: describePasskey(await one('SELECT * FROM passkeys WHERE id = $1', [result.credentialId])) }, 201);
      }
      if (path === '/api/passkeys' && method === 'PATCH') {
        const { user } = await session(req);
        await sql('UPDATE passkeys SET name = $1 WHERE id = $2 AND user_id = $3', [field(data, 'name', 60), field(data, 'id', 1400), user.id]);
        return json({ ok: true });
      }
      if (path === '/api/passkeys' && method === 'DELETE') {
        const { user } = await session(req);
        const removed = await sql('DELETE FROM passkeys WHERE id = $1 AND user_id = $2 RETURNING name', [field(data, 'id', 1400), user.id]);
        if (removed.length) await record(user.id, 'passkey_removed', req, removed[0].name);
        return json({ ok: true });
      }
      if (path === '/api/passkeys/login/options' && method === 'POST') {
        const id = secret();
        const challengeText = secret();
        await sql('INSERT INTO challenges (id, kind, challenge, expires) VALUES ($1, $2, $3, $4)', [id, 'passkey-auth', challengeText, now() + 5 * 60_000]);
        return json({ id, publicKey: { challenge: challengeText, rpId, timeout: 300_000, userVerification: 'required', allowCredentials: [] } });
      }
      if (path === '/api/passkeys/login' && method === 'POST') {
        if (await overLimit(`auth:${ip}`, 20, 600_000)) throw error(429, 'Trop de tentatives. Réessaie dans dix minutes.');
        const c = await consumeChallenge(field(data, 'id'), 'passkey-auth');
        const credential = data.credential ?? {};
        const pk = await one('SELECT * FROM passkeys WHERE id = $1', [field(credential, 'id', 1400)]);
        if (!pk) throw error(401, 'Passkey inconnue : elle a peut-être été supprimée de ton compte.', 'passkey_unknown');
        if (credential.userHandle && credential.userHandle !== b64u(pk.user_id)) throw error(401, 'Passkey refusée.');
        let result;
        try {
          result = verifyAssertion({
            clientDataJSON: Buffer.from(field(credential, 'clientDataJSON', 4096), 'base64url'),
            authenticatorData: Buffer.from(field(credential, 'authenticatorData', 4096), 'base64url'),
            signature: Buffer.from(field(credential, 'signature', 2048), 'base64url'),
            challenge: c.challenge,
            origin: issuer,
            rpId,
            jwk: JSON.parse(pk.public_key),
            alg: Number(pk.alg),
            storedSignCount: Number(pk.sign_count),
          });
        } catch (e) {
          throw error(401, e.message || 'Passkey refusée.');
        }
        await sql('UPDATE passkeys SET sign_count = $1, last_used_at = $2, backed_up = $3 WHERE id = $4', [result.signCount, now(), Number(result.backedUp), pk.id]);
        const u = await one('SELECT * FROM users WHERE id = $1', [pk.user_id]);
        return json(await completeLogin(req, res, u, 'passkey'));
      }

      // ── Suite interconnectée ───────────────────────────────────────────
      if (path === '/api/notifications/read' && method === 'POST') {
        const { user } = await session(req);
        const ids = Array.isArray(data.ids) ? data.ids.filter((x) => typeof x === 'string').slice(0, 100) : [];
        if (data.all === true) await sql('UPDATE notifications SET read_at = $1 WHERE user_id = $2 AND read_at IS NULL', [now(), user.id]);
        else for (const id of ids) await sql('UPDATE notifications SET read_at = $1 WHERE id = $2 AND user_id = $3 AND read_at IS NULL', [now(), id, user.id]);
        return json({ ok: true });
      }
      if (path === '/api/notifications' && method === 'DELETE') {
        const { user } = await session(req);
        await sql('DELETE FROM notifications WHERE id = $1 AND user_id = $2', [field(data, 'id', 64), user.id]);
        return json({ ok: true });
      }
      // Apps de la suite sans client OAuth (CordLauncher, Passcord) : elles
      // publient leur état avec la session de l'utilisateur.
      if (path === '/api/me/app-status' && method === 'POST') {
        const { user } = await session(req);
        const app = typeof data.app === 'string' && FIRST_PARTY_STATUS.includes(data.app) ? data.app : null;
        if (!app) throw error(400, 'App inconnue.');
        if (await overLimit(`status:${user.id}:${app}`, 60, 3600_000)) throw error(429, 'Trop de mises à jour.');
        await saveStatus(user.id, app, cleanStatus(data.status, null));
        return json({ ok: true });
      }
      // Serveur d'une app (client OAuth) → Compte Cord : état et notifications
      // d'un utilisateur qui a autorisé cette app. Authentifié par le secret du client.
      if (['/api/apps/status', '/api/apps/notify'].includes(path) && ['POST', 'DELETE'].includes(method)) {
        const { clientId, client } = authenticateClient(req, data);
        const sub = field(data, 'sub', 80);
        const consent = await one('SELECT 1 AS x FROM oauth_consents WHERE user_id = $1 AND client_id = $2', [sub, clientId]);
        if (!consent) throw error(404, 'Cet utilisateur n’a pas autorisé cette app.', 'not_connected');
        if (path === '/api/apps/status') {
          if (method === 'DELETE') {
            await sql('DELETE FROM app_status WHERE user_id = $1 AND app = $2', [sub, clientId]);
            return json({ ok: true });
          }
          if (await overLimit(`status:${sub}:${clientId}`, 120, 3600_000)) throw error(429, 'Trop de mises à jour.');
          await saveStatus(sub, clientId, cleanStatus(data.status, client));
          return json({ ok: true });
        }
        if (method !== 'POST') throw error(404, 'Introuvable.');
        if (await overLimit(`notify:${sub}:${clientId}`, 30, 3600_000)) throw error(429, 'Trop de notifications pour cet utilisateur.');
        const title = field(data, 'title', 80);
        const body = typeof data.body === 'string' && data.body.trim() ? data.body.trim().slice(0, 240) : null;
        const link = data.url == null ? null : appUrl(data.url, client);
        const id = randomUUID();
        await sql('INSERT INTO notifications (id, user_id, app, title, body, url, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id, sub, clientId, title, body, link, now()]);
        await pushTo(sub, { title, body: body ?? '', url: link ?? '/#/inbox', tag: `app-${id}` });
        // On garde les 100 plus récentes par compte.
        await sql('DELETE FROM notifications WHERE user_id = $1 AND id NOT IN (SELECT id FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100)', [sub]);
        return json({ ok: true, id }, 201);
      }

      // ── Bêtas fermées ──────────────────────────────────────────────────
      if (path === '/api/beta/redeem' && method === 'POST') {
        const { user } = await session(req);
        if (await overLimit(`beta:${user.id}`, 10, 3600_000)) throw error(429, 'Trop d’essais. Réessaie dans une heure.');
        if (!user.email_verified_at) throw error(403, 'Confirme d’abord ton adresse email.', 'email_unverified');
        const parsed = normalizeBetaCode(data.code);
        if (!parsed) throw error(400, 'Cette clé n’a pas le bon format (ex. PASS-7KQM-2XVD-9HRT).', 'beta_key_invalid');
        const { name } = BETA_PRODUCTS[parsed.product];
        if ((await betaAccess(user)).includes(parsed.product)) return json({ product: parsed.product, name, already: true });
        const key = await one('SELECT * FROM beta_keys WHERE code_hash = $1 AND product = $2', [hash(parsed.body), parsed.product]);
        if (!key) throw error(404, 'Clé inconnue. Vérifie-la caractère par caractère.', 'beta_key_invalid');
        const state = describeBetaKey(key).status;
        if (state === 'revoked') throw error(410, 'Cette clé a été désactivée.', 'beta_key_revoked');
        if (state === 'expired') throw error(410, 'Cette clé a expiré.', 'beta_key_expired');
        // Consommation atomique : deux utilisations simultanées ne dépassent pas le quota.
        const taken = await one(
          'UPDATE beta_keys SET uses = uses + 1 WHERE id = $1 AND revoked_at IS NULL AND uses < max_uses AND (expires_at IS NULL OR expires_at > $2) RETURNING id',
          [key.id, now()],
        );
        if (!taken) throw error(410, 'Cette clé a déjà été utilisée.', 'beta_key_used');
        await sql('INSERT INTO beta_access (user_id, product, key_id, granted_at) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, product) DO NOTHING', [user.id, parsed.product, key.id, now()]);
        await record(user.id, 'beta_joined', req, name);
        return json({ product: parsed.product, name, already: false }, 201);
      }
      if (path.startsWith('/api/beta/') && path.endsWith('/download') && method === 'POST') {
        const { user } = await session(req);
        const product = betaProduct(path.slice('/api/beta/'.length, -'/download'.length));
        if (!(await betaAccess(user)).includes(product)) throw error(403, 'Cette bêta demande une clé d’accès.', 'beta_required');
        const source = await releasesFor(product);
        if (!source) throw error(503, 'Les téléchargements de cette bêta ne sont pas encore configurés.', 'downloads_unconfigured');
        if (await overLimit(`download:${user.id}`, 30, 3600_000)) throw error(429, 'Trop de téléchargements. Réessaie dans une heure.');
        let release;
        try {
          release = await source.latest();
        } catch (e) {
          console.error('[cord-account] releases', e);
          throw error(502, 'Le serveur des builds ne répond pas. Réessaie dans un instant.', 'downloads_unavailable');
        }
        if (!release) throw error(404, 'Aucun build publié pour le moment.', 'no_build');
        const wanted = typeof data.asset === 'string' ? data.asset : null;
        const asset = wanted
          ? release.assets.find((a) => a.name === wanted)
          : release.assets.find((a) => a.name === `${BETA_PRODUCTS[product].name}.ipa`) ?? release.assets[0];
        if (!asset) throw error(404, 'Ce fichier n’existe pas dans le dernier build.');
        let downloadUrl;
        try {
          downloadUrl = await source.downloadUrl(asset);
        } catch (e) {
          console.error('[cord-account] releases', e);
          throw error(502, 'Le serveur des builds ne répond pas. Réessaie dans un instant.', 'downloads_unavailable');
        }
        await record(user.id, 'beta_download', req, `${asset.name} · ${release.build}`);
        return json({ url: downloadUrl, name: asset.name, size: asset.size, build: release.build });
      }
      if (path === '/api/admin/beta/keys' && method === 'POST') {
        const { user } = await session(req);
        if (!isAdmin(user)) throw error(403, 'Réservé à l’administration du Compte Cord.');
        const product = betaProduct(data.product ?? 'passcord');
        const count = Number(data.count ?? 1);
        const maxUses = Number(data.maxUses ?? 1);
        const days = Number(data.expiresInDays ?? 0);
        if (!Number.isInteger(count) || count < 1 || count > 50) throw error(400, 'Entre 1 et 50 clés à la fois.');
        if (!Number.isInteger(maxUses) || maxUses < 1 || maxUses > 1000) throw error(400, 'Entre 1 et 1000 utilisations par clé.');
        if (!Number.isInteger(days) || days < 0 || days > 365) throw error(400, 'Durée de validité entre 0 (illimitée) et 365 jours.');
        const label = typeof data.label === 'string' && data.label.trim() ? data.label.trim().slice(0, 60) : null;
        const t = now();
        const created = [];
        for (let i = 0; i < count; i++) {
          const code = generateBetaCode(product);
          const { body } = normalizeBetaCode(code);
          const row = await one(
            `INSERT INTO beta_keys (id, product, code_hash, hint, label, max_uses, expires_at, created_by, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [randomUUID(), product, hash(body), body.slice(-4), label, maxUses, days ? t + days * DAY : null, user.id, t],
          );
          created.push({ ...describeBetaKey(row), code });
        }
        await record(user.id, 'beta_keys_created', req, `${count} × ${BETA_PRODUCTS[product].name}`);
        return json({ keys: created }, 201);
      }
      if (path === '/api/admin/beta/keys' && method === 'DELETE') {
        const { user } = await session(req);
        if (!isAdmin(user)) throw error(403, 'Réservé à l’administration du Compte Cord.');
        await sql('UPDATE beta_keys SET revoked_at = $1 WHERE id = $2 AND revoked_at IS NULL', [now(), field(data, 'id', 64)]);
        return json({ ok: true });
      }
      if (path === '/api/admin/beta/token' && method === 'POST') {
        const { user } = await session(req);
        if (!isAdmin(user)) throw error(403, 'Réservé à l’administration du Compte Cord.');
        const product = betaProduct(data.product ?? 'passcord');
        if (betaReleases[product]) throw error(409, 'Le jeton est déjà fourni par une variable d’environnement du serveur.', 'token_from_env');
        await requireReauth(user, data);
        const token = typeof data.token === 'string' ? data.token.trim() : '';
        if (!/^(github_pat_|ghp_)[A-Za-z0-9_]{20,255}$/.test(token)) throw error(400, 'Ce n’est pas un jeton GitHub (il commence par github_pat_).', 'token_invalid');
        let release;
        try {
          release = await githubReleases({ token, repo: BETA_PRODUCTS[product].repo, fetchImpl: githubFetch }).latest();
        } catch {
          throw error(400, `GitHub refuse ce jeton pour ${BETA_PRODUCTS[product].repo} : vérifie qu’il a accès à ce dépôt, avec la permission Contents en lecture.`, 'token_rejected');
        }
        await sql(
          `INSERT INTO service_settings (key, value, updated_at, updated_by) VALUES ($1, $2, $3, $4)
           ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = $3, updated_by = $4`,
          [`releases_token:${product}`, vault.seal(token), now(), user.id],
        );
        releaseCache.delete(product);
        await record(user.id, 'beta_downloads_configured', req, BETA_PRODUCTS[product].name);
        return json({ ok: true, release: release && { build: release.build, tag: release.tag, publishedAt: release.publishedAt, assets: release.assets.map((a) => ({ name: a.name, size: a.size })) } });
      }
      if (path === '/api/admin/beta/token' && method === 'DELETE') {
        const { user } = await session(req);
        if (!isAdmin(user)) throw error(403, 'Réservé à l’administration du Compte Cord.');
        const product = betaProduct(data.product ?? 'passcord');
        await sql('DELETE FROM service_settings WHERE key = $1', [`releases_token:${product}`]);
        releaseCache.delete(product);
        return json({ ok: true });
      }
      if (path === '/api/admin/beta/testers' && method === 'DELETE') {
        const { user } = await session(req);
        if (!isAdmin(user)) throw error(403, 'Réservé à l’administration du Compte Cord.');
        await sql('DELETE FROM beta_access WHERE user_id = $1 AND product = $2', [field(data, 'userId', 64), betaProduct(data.product ?? 'passcord')]);
        return json({ ok: true });
      }

      // ── Notifications push ─────────────────────────────────────────────
      if (path === '/api/push/subscribe' && method === 'POST') {
        const { user } = await session(req);
        const endpoint = field(data, 'endpoint', 1000);
        const keys = data.keys ?? {};
        let parsed;
        try {
          parsed = new URL(endpoint);
        } catch {
          throw error(400, 'Abonnement invalide.');
        }
        if (parsed.protocol !== 'https:' || typeof keys.p256dh !== 'string' || typeof keys.auth !== 'string'
          || Buffer.from(keys.p256dh, 'base64url').length !== 65 || Buffer.from(keys.auth, 'base64url').length !== 16)
          throw error(400, 'Abonnement invalide.');
        const id = hash(`push:${endpoint}`);
        await sql(
          `INSERT INTO push_subscriptions (id, user_id, endpoint, p256dh, auth, device, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO UPDATE SET user_id = $2, p256dh = $4, auth = $5, device = $6`,
          [id, user.id, endpoint, keys.p256dh, keys.auth, describeDevice(userAgent(req)).label, now()],
        );
        // Dix appareils au plus : les plus anciens sont oubliés.
        await sql('DELETE FROM push_subscriptions WHERE user_id = $1 AND id NOT IN (SELECT id FROM push_subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10)', [user.id]);
        const sent = await pushTo(user.id, { title: 'Notifications activées', body: 'Les demandes Passcord et les nouvelles de la suite arriveront ici.', url: '/', tag: 'push-welcome' });
        return json({ ok: true, sent });
      }
      if (path === '/api/push/devices' && method === 'DELETE') {
        const { user } = await session(req);
        await sql('DELETE FROM push_subscriptions WHERE id = $1 AND user_id = $2', [field(data, 'id', 100), user.id]);
        return json({ ok: true });
      }
      if (path === '/api/me/notify' && method === 'POST') {
        // Rappels envoyés par les apps de la suite connectées au compte
        // (CordLauncher : « Drivecord expire dans 5 h »). `tag` évite les doublons.
        const { user } = await session(req);
        if (await overLimit(`me-notify:${user.id}`, 20, 3600_000)) throw error(429, 'Trop de rappels.');
        const app = FIRST_PARTY_STATUS.includes(data.app) ? data.app : 'cordlauncher';
        const tag = typeof data.tag === 'string' && data.tag.trim() ? data.tag.trim().slice(0, 120) : randomUUID();
        const sent = await notifyUser(user.id, {
          id: `me:${hash(`${user.id}:${tag}`)}`,
          app,
          title: field(data, 'title', 80),
          body: typeof data.body === 'string' && data.body.trim() ? data.body.trim().slice(0, 240) : null,
          url: typeof data.url === 'string' && data.url.startsWith('/') && !data.url.startsWith('//') ? data.url.slice(0, 200) : null,
        });
        return json({ ok: true, sent });
      }
      if (path === '/api/passcord/history' && method === 'POST') {
        // Historique affiché dans Passcord : ce que cet iPhone (et le compte) a validé ou refusé.
        const k = await inboxKey(data);
        const rows = await sql(
          "SELECT kind, at, detail FROM account_events WHERE user_id = $1 AND kind IN ('passcord_approved', 'passcord_denied', 'passcord_wrong_code', 'passcord_paired') ORDER BY at DESC LIMIT 30",
          [k.user_id],
        );
        return json({ events: rows.map((r) => ({ kind: r.kind, at: Number(r.at), device: r.detail ?? null })) });
      }
      if (path === '/api/push/unsubscribe' && method === 'POST') {
        const { user } = await session(req);
        await sql('DELETE FROM push_subscriptions WHERE id = $1 AND user_id = $2', [hash(`push:${field(data, 'endpoint', 1000)}`), user.id]);
        return json({ ok: true });
      }

      // ── Passcord ───────────────────────────────────────────────────────
      if (path === '/api/passcord/pair' && method === 'POST') {
        const { user } = await session(req);
        const id = secret();
        const challengeText = secret();
        await sql('INSERT INTO challenges (id, kind, user_id, challenge, expires) VALUES ($1, $2, $3, $4, $5)', [
          id,
          'pair',
          user.id,
          challengeText,
          now() + CHALLENGE_TTL,
        ]);
        return json({
          id,
          challenge: challengeText,
          expiresAt: now() + CHALLENGE_TTL,
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
        const inboxToken = secret();
        await sql('INSERT INTO passcord_keys (id, user_id, name, public_key, created_at, inbox_hash) VALUES ($1, $2, $3, $4, $5, $6)', [
          keyId,
          user.id,
          name,
          JSON.stringify(normalized),
          now(),
          hash(inboxToken),
        ]);
        await sql('DELETE FROM challenges WHERE id = $1', [c.id]);
        await record(user.id, 'passcord_paired', req, name);
        return json({ keyId, inboxToken, user: publicUser(user) });
      }
      if (path === '/api/passcord/pair/status' && method === 'POST') {
        // Le portail attend l'iPhone : la demande a-t-elle été consommée ?
        const { user } = await session(req);
        const pending = await one("SELECT 1 AS x FROM challenges WHERE id = $1 AND kind = 'pair' AND user_id = $2 AND expires > $3", [field(data, 'id'), user.id, now()]);
        return json({ pending: Boolean(pending) });
      }
      if (path === '/api/passcord/keys' && method === 'PATCH') {
        const { user } = await session(req);
        await sql('UPDATE passcord_keys SET name = $1 WHERE id = $2 AND user_id = $3', [field(data, 'name', 60), field(data, 'id'), user.id]);
        return json({ ok: true });
      }
      if (path === '/api/passcord/keys' && method === 'DELETE') {
        const { user } = await session(req);
        const removed = await sql('DELETE FROM passcord_keys WHERE id = $1 AND user_id = $2 RETURNING name', [field(data, 'id'), user.id]);
        if (removed.length) await record(user.id, 'passcord_revoked', req, removed[0].name);
        return json({ ok: true });
      }
      if (path === '/api/passcord/login' && method === 'POST') {
        const id = secret();
        const pollToken = secret();
        const challengeText = secret();
        await sql(
          'INSERT INTO challenges (id, kind, poll_hash, challenge, expires, payload) VALUES ($1, $2, $3, $4, $5, $6)',
          [id, 'login', hash(pollToken), challengeText, now() + CHALLENGE_TTL, JSON.stringify({ device: describeDevice(userAgent(req)).label, at: now() })],
        );
        return json({
          id,
          pollToken,
          challenge: challengeText,
          expiresAt: now() + CHALLENGE_TTL,
          url: `passcord://cord/login?server=${encodeURIComponent(issuer)}&id=${id}&challenge=${challengeText}`,
        });
      }
      if (path === '/api/passcord/notify' && method === 'POST') {
        // « Envoyer à mon iPhone » : la demande part dans Passcord (et en
        // notification sur les appareils abonnés), avec un nombre à retrouver.
        const c = await challenge(field(data, 'id'), 'login');
        if (!safeEqual(c.poll_hash, hash(field(data, 'pollToken')))) throw error(403, 'Demande refusée.');
        const email = field(data, 'email', 254).toLowerCase();
        if (await overLimit(`passcord-notify:${email}`, 6, 600_000)) throw error(429, 'Trop de demandes envoyées à cet iPhone. Réessaie dans quelques minutes, ou scanne le QR code.');
        const payload = challengePayload(c) ?? {};
        if (!payload.code) {
          const code = randomInt(10, 100);
          const choices = new Set([code]);
          while (choices.size < 3) choices.add(randomInt(10, 100));
          const shuffled = [...choices];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = randomInt(0, i + 1);
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          payload.code = String(code);
          payload.choices = shuffled.map(String);
        }
        const u = await one('SELECT * FROM users WHERE email = $1', [email]);
        const paired = u ? await one('SELECT COUNT(*) AS n FROM passcord_keys WHERE user_id = $1', [u.id]) : null;
        if (u && Number(paired?.n ?? 0) > 0 && !c.approved) {
          await sql('UPDATE challenges SET user_id = $1, payload = $2 WHERE id = $3 AND approved = 0', [u.id, JSON.stringify(payload), c.id]);
          await pushTo(u.id, {
            title: 'Demande de connexion Cord',
            body: `${payload.device ?? 'Un appareil'} veut se connecter. Choisis ${payload.code} dans Passcord.`,
            url: `/?passcord=${encodeURIComponent(loginLink(c, payload))}`,
            tag: `passcord-${c.id}`,
          });
        }
        // Même réponse que le compte existe ou non (pas d'énumération).
        return json({ code: payload.code });
      }
      if (path === '/api/passcord/inbox' && method === 'POST') {
        // Passcord ouvert : les demandes qui attendent cet iPhone, sans scanner.
        const k = await inboxKey(data);
        const rows = await sql("SELECT * FROM challenges WHERE kind = 'login' AND user_id = $1 AND approved = 0 AND expires > $2 ORDER BY expires DESC LIMIT 5", [k.user_id, now()]);
        return json({
          requests: rows.map((c) => {
            const p = challengePayload(c);
            return { id: c.id, url: loginLink(c, p), device: p?.device ?? null, createdAt: p?.at ?? null, expiresAt: Number(c.expires) };
          }),
        });
      }
      if (path === '/api/passcord/inbox/token' && method === 'POST') {
        // Clé associée avant la boîte de réception : un jeton contre une signature.
        const k = await one('SELECT * FROM passcord_keys WHERE id = $1', [field(data, 'keyId', 64)]);
        const ts = Number(data.ts);
        if (!k || !Number.isFinite(ts) || Math.abs(now() - ts) > 300_000 || !verifyPasscordSignature(k, `cord-inbox-v1:${issuer}:${k.id}:${ts}`, data.signature))
          throw error(403, 'Signature invalide ou appareil révoqué.');
        const token = secret();
        await sql('UPDATE passcord_keys SET inbox_hash = $1 WHERE id = $2', [hash(token), k.id]);
        return json({ token });
      }
      if (path === '/api/passcord/deny' && method === 'POST') {
        const k = await inboxKey(data);
        const denied = await one("UPDATE challenges SET approved = -1 WHERE id = $1 AND kind = 'login' AND user_id = $2 AND approved = 0 RETURNING payload", [field(data, 'id'), k.user_id]);
        if (denied) await record(k.user_id, 'passcord_denied', null, challengePayload(denied)?.device ?? null);
        return json({ ok: true });
      }
      if (path === '/api/passcord/approve' && method === 'POST') {
        const c = await challenge(field(data, 'id'), 'login');
        if (c.approved) throw error(409, 'Demande déjà validée.');
        const k = await one('SELECT * FROM passcord_keys WHERE id = $1', [field(data, 'keyId')]);
        const message = `cord-login-v1:${issuer}:${c.id}:${c.challenge}`;
        let valid = false;
        try {
          valid = Boolean(k) && verify(
            null,
            Buffer.from(message),
            createPublicKey({ key: JSON.parse(k.public_key), format: 'jwk' }),
            Buffer.from(field(data, 'signature'), 'base64url'),
          );
        } catch {
          /* signature malformée : refusée */
        }
        if (!valid) throw error(403, 'Signature invalide ou appareil révoqué.');
        if (c.user_id && c.user_id !== k.user_id) throw error(403, 'Cette demande est destinée à un autre compte.');
        // Demande envoyée à l'iPhone : le nombre choisi doit être celui affiché.
        const p = challengePayload(c);
        if (p?.code && data.code != null && String(data.code) !== p.code) {
          await sql('UPDATE challenges SET approved = -1 WHERE id = $1 AND approved = 0', [c.id]);
          await record(k.user_id, 'passcord_wrong_code', null, p.device ?? null);
          throw error(403, 'Ce n’est pas le bon nombre : la demande est annulée par sécurité.', 'wrong_code');
        }
        const approved = await one('UPDATE challenges SET approved = 1, user_id = $1 WHERE id = $2 AND approved = 0 AND (user_id IS NULL OR user_id = $1) RETURNING id', [k.user_id, c.id]);
        if (!approved) throw error(409, 'Demande déjà validée.');
        await sql('UPDATE passcord_keys SET last_used_at = $1 WHERE id = $2', [now(), k.id]);
        await record(k.user_id, 'passcord_approved', null, p?.device ?? null);
        return json({ ok: true });
      }
      if (path === '/api/passcord/poll' && method === 'POST') {
        const c = await challenge(field(data, 'id'), 'login');
        if (!safeEqual(c.poll_hash, hash(field(data, 'pollToken')))) throw error(403, 'Demande refusée.');
        if (Number(c.approved) < 0) {
          await sql('DELETE FROM challenges WHERE id = $1', [c.id]);
          throw error(410, 'Demande refusée sur l’iPhone.', 'denied');
        }
        if (!c.approved) return json({ pending: true });
        const consumed = await one('DELETE FROM challenges WHERE id = $1 RETURNING id', [c.id]);
        if (!consumed) throw error(410, 'Demande expirée ou déjà utilisée.');
        return json(await completeLogin(req, res, await one('SELECT * FROM users WHERE id = $1', [c.user_id]), 'passcord'));
      }

      // ── OIDC ───────────────────────────────────────────────────────────
      if (path === '/api/authorize' && method === 'POST') {
        const { user } = await session(req);
        const client = Object.hasOwn(clients, data.client_id ?? '') ? clients[data.client_id] : undefined;
        if (!user.email_verified_at) throw error(403, 'Confirme ton adresse email avant de connecter une app.');
        if (!client || !client.redirectUris.includes(data.redirect_uri))
          throw error(400, 'Application ou adresse de retour inconnue.');
        if (data.response_type !== 'code' || data.code_challenge_method !== 'S256' || !/^[A-Za-z0-9_-]{43}$/.test(data.code_challenge ?? ''))
          throw error(400, 'Connexion PKCE S256 requise.');
        const scopeText = field(data, 'scope');
        const scope = scopeText.split(' ');
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
        const t = now();
        const updated = await sql('UPDATE oauth_consents SET last_used_at = $1, scope = $2 WHERE user_id = $3 AND client_id = $4 RETURNING client_id', [t, scopeText, user.id, data.client_id]);
        if (!updated.length) {
          await sql(
            'INSERT INTO oauth_consents (user_id, client_id, granted_at, last_used_at, scope) VALUES ($1, $2, $3, $3, $4) ON CONFLICT (user_id, client_id) DO UPDATE SET last_used_at = $3',
            [user.id, data.client_id, t, scopeText],
          );
          await record(user.id, 'app_authorized', req, client.name ?? data.client_id);
        }
        const redirect = new URL(data.redirect_uri);
        redirect.searchParams.set('code', code);
        if (typeof data.state === 'string') redirect.searchParams.set('state', data.state);
        return json({ redirect: redirect.toString() });
      }
      if (path === '/api/authorize/deny' && method === 'POST') {
        const client = Object.hasOwn(clients, data.client_id ?? '') ? clients[data.client_id] : undefined;
        if (!client || !client.redirectUris.includes(data.redirect_uri))
          throw error(400, 'Application ou adresse de retour inconnue.');
        const redirect = new URL(data.redirect_uri);
        redirect.searchParams.set('error', 'access_denied');
        redirect.searchParams.set('error_description', 'La personne a refusé la connexion.');
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
        const client = Object.hasOwn(clients, clientId ?? '') ? clients[clientId] : undefined;
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
        const access = await newSession(user, 'userinfo', { clientId });
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
      if (!e.status) console.error('[cord-account]', e);
      json({ error: e.status ? e.message : 'Erreur du service Cord.', ...(e.status && e.code ? { reason: e.code } : {}) }, e.status ?? 500);
    }
  }

  return { handle };
}
