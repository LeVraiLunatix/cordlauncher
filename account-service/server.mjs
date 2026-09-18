import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, randomUUID, scrypt as rawScrypt, timingSafeEqual, createHash, createPublicKey, verify, generateKeyPairSync, sign } from 'node:crypto';
import { promisify } from 'node:util';
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scrypt = promisify(rawScrypt);
const secret = () => randomBytes(32).toString('base64url');
const hash = value => createHash('sha256').update(value).digest('base64url');
const now = () => Date.now();
const ttl = 7 * 86400_000;
const challengeTtl = 3 * 60_000;
const error = (status, message) => Object.assign(new Error(message), { status });
const publicUser = u => ({ id: u.id, email: u.email, name: u.name, createdAt: u.created_at, emailVerified: Boolean(u.email_verified_at) });
const safeEqual = (a, b) => { const aa = Buffer.from(a); const bb = Buffer.from(b); return aa.length === bb.length && timingSafeEqual(aa, bb); };

export function createAccountService({ database = ':memory:', issuer = 'http://127.0.0.1:4319', clients = {}, sendVerification, trustProxy = false } = {}) {
  const origin = new URL(issuer);
  if (origin.protocol !== 'https:' && !['127.0.0.1', 'localhost', '[::1]'].includes(origin.hostname)) throw new Error('HTTPS obligatoire hors localhost.');
  if (origin.pathname !== '/' || origin.search || origin.hash || origin.username || origin.password) throw new Error('L’issuer doit être une origine sans chemin.');
  issuer = origin.origin;
  if (database !== ':memory:') mkdirSync(dirname(resolve(database)), { recursive: true });
  const db = new DatabaseSync(database);
  db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, salt TEXT NOT NULL, password_hash TEXT NOT NULL, created_at INTEGER NOT NULL, email_verified_at INTEGER);
    CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), expires INTEGER NOT NULL, purpose TEXT NOT NULL DEFAULT 'account');
    CREATE TABLE IF NOT EXISTS passcord_keys (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), name TEXT NOT NULL, public_key TEXT NOT NULL, created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS challenges (id TEXT PRIMARY KEY, kind TEXT NOT NULL, user_id TEXT REFERENCES users(id), poll_hash TEXT, challenge TEXT NOT NULL, expires INTEGER NOT NULL, approved INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS codes (hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), client_id TEXT NOT NULL, redirect_uri TEXT NOT NULL, challenge TEXT NOT NULL, nonce TEXT, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS config (name TEXT PRIMARY KEY, value TEXT NOT NULL);`);
  if (!db.prepare('PRAGMA table_info(users)').all().some(c => c.name === 'email_verified_at')) db.exec('ALTER TABLE users ADD COLUMN email_verified_at INTEGER');
  if (!db.prepare('PRAGMA table_info(sessions)').all().some(c => c.name === 'purpose')) db.exec("ALTER TABLE sessions ADD COLUMN purpose TEXT NOT NULL DEFAULT 'account'");
  let pem = db.prepare('SELECT value FROM config WHERE name=?').get('oidc-key')?.value;
  if (!pem) {
    pem = generateKeyPairSync('rsa', { modulusLength: 2048, privateKeyEncoding: { type: 'pkcs8', format: 'pem' }, publicKeyEncoding: { type: 'spki', format: 'pem' } }).privateKey;
    db.prepare('INSERT INTO config VALUES (?,?)').run('oidc-key', pem);
  }
  const jwk = { ...createPublicKey(pem).export({ format: 'jwk' }), kid: 'cord-1', use: 'sig', alg: 'RS256' };
  const buckets = new Map();
  function cleanup() {
    for (const table of ['sessions', 'challenges', 'codes']) db.prepare(`DELETE FROM ${table} WHERE expires < ?`).run(now());
    for (const [key, value] of buckets) if (value.expires < now()) buckets.delete(key);
  }
  function session(req, purpose = 'account') {
    const bearer = req.headers.authorization?.match(/^Bearer ([A-Za-z0-9_-]+)$/)?.[1];
    const cookie = req.headers.cookie?.split(';').map(s => s.trim()).find(s => s.startsWith('cord_session='))?.slice(13);
    const token = bearer ?? cookie;
    if (!token) throw error(401, 'Connecte-toi à ton compte Cord.');
    const u = db.prepare('SELECT users.* FROM users JOIN sessions ON users.id=sessions.user_id WHERE sessions.hash=? AND sessions.expires>? AND sessions.purpose=?').get(hash(token), now(), purpose);
    if (!u) throw error(401, 'Session expirée. Reconnecte-toi.');
    return { user: u, token };
  }
  function newSession(user, purpose = 'account') {
    const token = secret();
    db.prepare('INSERT INTO sessions VALUES (?,?,?,?)').run(hash(token), user.id, now() + ttl, purpose);
    return { user: publicUser(user), token };
  }
  const sessionCookie = (token, age = ttl / 1000) => `cord_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${origin.protocol === 'https:' ? '; Secure' : ''}`;
  function issue(res, user) {
    const result = newSession(user);
    res.setHeader('Set-Cookie', sessionCookie(result.token));
    return result;
  }
  function jwt(user, clientId, nonce) {
    const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
    const data = `${encode({ alg: 'RS256', typ: 'JWT', kid: jwk.kid })}.${encode({ iss: issuer, sub: user.id, aud: clientId, iat: Math.floor(now()/1000), exp: Math.floor(now()/1000)+300, email: user.email, email_verified: Boolean(user.email_verified_at), name: user.name, ...(nonce ? { nonce } : {}) })}`;
    return `${data}.${sign('RSA-SHA256', Buffer.from(data), pem).toString('base64url')}`;
  }
  async function body(req) {
    let data = ''; let length = 0;
    for await (const chunk of req) { length += chunk.length; if (length > 16384) throw error(413, 'Requête trop volumineuse.'); data += chunk; }
    try { return req.headers['content-type']?.includes('application/x-www-form-urlencoded') ? Object.fromEntries(new URLSearchParams(data)) : JSON.parse(data || '{}'); }
    catch { throw error(400, 'Requête invalide.'); }
  }
  function field(data, name, max = 200) { const v = data[name]; if (typeof v !== 'string' || !v.trim() || v.length > max) throw error(400, `Champ ${name} invalide.`); return v.trim(); }
  function challenge(id, kind) { const c = db.prepare('SELECT * FROM challenges WHERE id=? AND kind=? AND expires>?').get(id, kind, now()); if (!c) throw error(410, 'Demande expirée ou déjà utilisée.'); return c; }
  const server = http.createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
    const json = (data, status = 200) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(data)); };
    try {
      cleanup();
      const url = new URL(req.url, issuer); const path = url.pathname; const method = req.method;
      if (req.headers.origin && req.headers.origin !== issuer) throw error(403, 'Origine refusée.');
      if (method === 'GET' && ['/', '/authorize', '/portal.js', '/portal.css'].includes(path)) {
        const name = path === '/portal.js' ? 'portal.js' : path === '/portal.css' ? 'portal.css' : 'portal.html';
        res.writeHead(200, { 'Content-Type': name.endsWith('.js') ? 'text/javascript; charset=utf-8' : name.endsWith('.css') ? 'text/css; charset=utf-8' : 'text/html; charset=utf-8' });
        res.end(readFileSync(new URL(`./${name}`, import.meta.url))); return;
      }
      if (method === 'GET' && path === '/health') return json({ service: 'cord-account', status: 'ok' });
      if (method === 'GET' && path === '/.well-known/openid-configuration') return json({ issuer, authorization_endpoint: `${issuer}/authorize`, token_endpoint: `${issuer}/oauth/token`, userinfo_endpoint: `${issuer}/oauth/userinfo`, jwks_uri: `${issuer}/.well-known/jwks.json`, response_types_supported: ['code'], subject_types_supported: ['public'], id_token_signing_alg_values_supported: ['RS256'], token_endpoint_auth_methods_supported: ['client_secret_post', 'client_secret_basic'], scopes_supported: ['openid', 'profile', 'email'], code_challenge_methods_supported: ['S256'], grant_types_supported: ['authorization_code'] });
      if (method === 'GET' && path === '/.well-known/jwks.json') return json({ keys: [jwk] });
      if (method === 'GET' && path === '/oauth/userinfo') { const { user } = session(req, 'userinfo'); return json({ sub: user.id, name: user.name, email: user.email, email_verified: Boolean(user.email_verified_at) }); }
      if (method === 'GET' && path === '/api/client') { const client = clients[url.searchParams.get('id')]; if (!client) throw error(404, 'Application inconnue.'); return json({ name: client.name }); }
      if (method === 'GET' && path === '/api/me') { const { user } = session(req); return json({ user: publicUser(user), keys: db.prepare('SELECT id, name, created_at AS createdAt FROM passcord_keys WHERE user_id=?').all(user.id) }); }
      if (!['POST', 'PATCH', 'DELETE'].includes(method)) throw error(404, 'Introuvable.');
      // Derrière Caddy, toutes les requêtes arrivent de 127.0.0.1 : sans l'IP
      // transmise par le proxy, tout le monde partagerait le même compteur.
      // On ne lit X-Forwarded-For que si on a été configuré derrière un proxy.
      const forwarded = trustProxy ? req.headers['x-forwarded-for']?.split(',')[0]?.trim() : undefined;
      const ip = forwarded || req.socket.remoteAddress || 'unknown';
      const bucket = buckets.get(ip) ?? { count: 0, expires: now() + 60_000 };
      buckets.set(ip, bucket);
      if (++bucket.count > 120) throw error(429, 'Trop de demandes. Réessaie dans une minute.');
      const data = await body(req);
      if (['/api/register', '/api/login'].includes(path) && method === 'POST') {
        const authBucket = buckets.get(`auth:${ip}`) ?? { count: 0, expires: now() + 600_000 };
        buckets.set(`auth:${ip}`, authBucket); if (++authBucket.count > 20) throw error(429, 'Trop de tentatives. Réessaie dans dix minutes.');
        const email = field(data, 'email', 254).toLowerCase();
        if (typeof data.password !== 'string' || !data.password.length || data.password.length > 512) throw error(400, 'Mot de passe invalide.');
        const password = data.password;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw error(400, 'Adresse email invalide.');
        if (path === '/api/register') {
          if (password.length < 12) throw error(400, 'Choisis un mot de passe d’au moins 12 caractères.');
          const name = field(data, 'name', 60); const salt = secret();
          const derived = await scrypt(password, salt, 64, { N: 32768, maxmem: 64 * 1024 * 1024 });
          const u = { id: `cord_${randomUUID()}`, email, name, salt, password_hash: derived.toString('hex'), created_at: now() };
          try { db.prepare('INSERT INTO users (id,email,name,salt,password_hash,created_at) VALUES (?,?,?,?,?,?)').run(u.id, email, name, salt, u.password_hash, u.created_at); }
          catch (e) { if (e.code?.includes('SQLITE') || String(e).includes('UNIQUE')) throw error(409, 'Un compte utilise déjà cette adresse.'); throw e; }
          return json(issue(res, u), 201);
        }
        const u = db.prepare('SELECT * FROM users WHERE email=?').get(email);
        const derived = await scrypt(password, u?.salt ?? 'invalid-account-salt', 64, { N: 32768, maxmem: 64 * 1024 * 1024 });
        if (!u || !safeEqual(derived.toString('hex'), u.password_hash)) throw error(401, 'Email ou mot de passe incorrect.');
        return json(issue(res, u));
      }
      if (path === '/api/logout' && method === 'POST') { const { token } = session(req); db.prepare('DELETE FROM sessions WHERE hash=?').run(hash(token)); res.setHeader('Set-Cookie', sessionCookie('', 0)); return json({ ok: true }); }
      if (path === '/api/email/send' && method === 'POST') {
        const { user } = session(req);
        if (user.email_verified_at) return json({ ok: true });
        if (!sendVerification) throw error(503, 'L’envoi des emails doit être configuré sur le service Cord.');
        const previous = db.prepare("SELECT expires FROM challenges WHERE kind='email' AND user_id=? ORDER BY expires DESC LIMIT 1").get(user.id);
        if (previous && previous.expires > now()+14*60_000) throw error(429, 'Attends une minute avant de renvoyer l’email.');
        const token = secret(); const id = hash(token);
        db.prepare('INSERT INTO challenges (id,kind,user_id,challenge,expires) VALUES (?,?,?,?,?)').run(id, 'email', user.id, '', now()+15*60_000);
        let delivery;
        try { delivery = await sendVerification({ email: user.email, url: `${issuer}/?verify=${token}` }); }
        catch { db.prepare('DELETE FROM challenges WHERE id=?').run(id); throw error(503, 'Envoi impossible. Réessaie plus tard.'); }
        return json({ ok: true, ...(delivery?.devUrl ? { devUrl: delivery.devUrl } : {}) });
      }
      if (path === '/api/email/verify' && method === 'POST') {
        const c = challenge(hash(field(data, 'token')), 'email');
        db.prepare('UPDATE users SET email_verified_at=? WHERE id=?').run(now(), c.user_id);
        db.prepare("DELETE FROM challenges WHERE kind='email' AND user_id=?").run(c.user_id);
        return json({ ok: true });
      }
      if (path === '/api/me' && method === 'PATCH') { const { user } = session(req); db.prepare('UPDATE users SET name=? WHERE id=?').run(field(data, 'name', 60), user.id); return json({ user: publicUser(db.prepare('SELECT * FROM users WHERE id=?').get(user.id)) }); }
      if (path === '/api/passcord/pair' && method === 'POST') {
        const { user } = session(req); const id = secret(); const challengeText = secret();
        db.prepare('INSERT INTO challenges (id,kind,user_id,challenge,expires) VALUES (?,?,?,?,?)').run(id, 'pair', user.id, challengeText, now()+challengeTtl);
        return json({ id, challenge: challengeText, expiresAt: now()+challengeTtl, url: `passcord://cord/pair?server=${encodeURIComponent(issuer)}&id=${id}&challenge=${challengeText}` });
      }
      if (path === '/api/passcord/claim' && method === 'POST') {
        const { user } = session(req); const c = challenge(field(data, 'id'), 'pair');
        if (c.user_id !== user.id || !safeEqual(c.challenge, field(data, 'challenge'))) throw error(403, 'Cette association appartient à un autre compte.');
        const key = data.publicKey;
        if (key?.kty !== 'OKP' || key?.crv !== 'Ed25519' || typeof key.x !== 'string' || key.d) throw error(400, 'Clé publique Ed25519 attendue.');
        const normalized = { kty: 'OKP', crv: 'Ed25519', x: key.x };
        const message = `cord-pair-v1:${issuer}:${c.id}:${c.challenge}`;
        let valid = false;
        try { valid = verify(null, Buffer.from(message), createPublicKey({ key: normalized, format: 'jwk' }), Buffer.from(field(data, 'signature'), 'base64url')); } catch { /* reject malformed key */ }
        if (!valid) throw error(403, 'Signature invalide.');
        const keyId = randomUUID(); const name = field(data, 'name', 60);
        db.prepare('INSERT INTO passcord_keys VALUES (?,?,?,?,?)').run(keyId, user.id, name, JSON.stringify(normalized), now());
        db.prepare('DELETE FROM challenges WHERE id=?').run(c.id);
        return json({ keyId, user: publicUser(user) });
      }
      if (path === '/api/passcord/keys' && method === 'DELETE') { const { user } = session(req); db.prepare('DELETE FROM passcord_keys WHERE id=? AND user_id=?').run(field(data, 'id'), user.id); return json({ ok: true }); }
      if (path === '/api/passcord/login' && method === 'POST') {
        const id = secret(); const pollToken = secret(); const challengeText = secret();
        db.prepare('INSERT INTO challenges (id,kind,poll_hash,challenge,expires) VALUES (?,?,?,?,?)').run(id, 'login', hash(pollToken), challengeText, now()+challengeTtl);
        return json({ id, pollToken, challenge: challengeText, expiresAt: now()+challengeTtl, url: `passcord://cord/login?server=${encodeURIComponent(issuer)}&id=${id}&challenge=${challengeText}` });
      }
      if (path === '/api/passcord/approve' && method === 'POST') {
        const c = challenge(field(data, 'id'), 'login');
        if (c.approved) throw error(409, 'Demande déjà validée.');
        const k = db.prepare('SELECT * FROM passcord_keys WHERE id=?').get(field(data, 'keyId'));
        const message = `cord-login-v1:${issuer}:${c.id}:${c.challenge}`;
        if (!k || !verify(null, Buffer.from(message), createPublicKey({ key: JSON.parse(k.public_key), format: 'jwk' }), Buffer.from(field(data, 'signature'), 'base64url'))) throw error(403, 'Signature invalide ou appareil révoqué.');
        db.prepare('UPDATE challenges SET approved=1,user_id=? WHERE id=?').run(k.user_id, c.id);
        return json({ ok: true });
      }
      if (path === '/api/passcord/poll' && method === 'POST') {
        const c = challenge(field(data, 'id'), 'login');
        if (!safeEqual(c.poll_hash, hash(field(data, 'pollToken')))) throw error(403, 'Demande refusée.');
        if (!c.approved) return json({ pending: true });
        db.prepare('DELETE FROM challenges WHERE id=?').run(c.id);
        return json(issue(res, db.prepare('SELECT * FROM users WHERE id=?').get(c.user_id)));
      }
      if (path === '/api/authorize' && method === 'POST') {
        const { user } = session(req); const client = clients[data.client_id];
        if (!user.email_verified_at) throw error(403, 'Confirme ton adresse email avant de connecter une app.');
        if (!client || !client.redirectUris.includes(data.redirect_uri)) throw error(400, 'Application ou adresse de retour inconnue.');
        if (data.response_type !== 'code' || data.code_challenge_method !== 'S256' || !/^[A-Za-z0-9_-]{43}$/.test(data.code_challenge ?? '')) throw error(400, 'Connexion PKCE S256 requise.');
        const scope = field(data, 'scope').split(' ');
        if (!scope.includes('openid') || scope.some(s => !['openid', 'profile', 'email'].includes(s))) throw error(400, 'Portée refusée.');
        const code = secret();
        db.prepare('INSERT INTO codes VALUES (?,?,?,?,?,?,?)').run(hash(code), user.id, data.client_id, data.redirect_uri, data.code_challenge, typeof data.nonce === 'string' ? data.nonce : null, now()+60_000);
        const redirect = new URL(data.redirect_uri); redirect.searchParams.set('code', code); if (typeof data.state === 'string') redirect.searchParams.set('state', data.state);
        return json({ redirect: redirect.toString() });
      }
      if (path === '/oauth/token' && method === 'POST') {
        let clientId = data.client_id; let clientSecret = data.client_secret;
        if (req.headers.authorization?.startsWith('Basic ')) {
          const basic = Buffer.from(req.headers.authorization.slice(6), 'base64').toString(); const colon = basic.indexOf(':');
          clientId = decodeURIComponent(basic.slice(0, colon)); clientSecret = decodeURIComponent(basic.slice(colon+1));
        }
        const client = clients[clientId];
        if (!client?.secret || typeof clientSecret !== 'string' || !safeEqual(client.secret, clientSecret)) throw error(401, 'Client OAuth inconnu.');
        const code = db.prepare('SELECT * FROM codes WHERE hash=? AND expires>?').get(hash(field(data, 'code')), now());
        if (data.grant_type !== 'authorization_code' || !code || code.client_id !== clientId || data.redirect_uri !== code.redirect_uri || !/^[A-Za-z0-9._~-]{43,128}$/.test(data.code_verifier ?? '') || !safeEqual(code.challenge, hash(data.code_verifier))) throw error(400, 'Code OAuth invalide ou expiré.');
        db.prepare('DELETE FROM codes WHERE hash=?').run(code.hash);
        const user = db.prepare('SELECT * FROM users WHERE id=?').get(code.user_id);
        const access = newSession(user, 'userinfo');
        db.prepare('UPDATE sessions SET expires=? WHERE hash=?').run(now()+300_000, hash(access.token));
        return json({ access_token: access.token, token_type: 'Bearer', expires_in: 300, id_token: jwt(user, clientId, code.nonce), scope: 'openid profile email' });
      }
      throw error(404, 'Introuvable.');
    } catch (e) { json({ error: e.status ? e.message : 'Erreur du service Cord.' }, e.status ?? 500); }
  });
  return { server, close: () => { server.close(); db.close(); } };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 4319);
  const host = process.env.HOST ?? '127.0.0.1';
  const issuer = process.env.CORD_ISSUER ?? `http://127.0.0.1:${port}`;
  const clients = JSON.parse(process.env.CORD_CLIENTS ?? '{}');
  let sendVerification;
  if (process.env.RESEND_API_KEY && process.env.CORD_MAIL_FROM) {
    sendVerification = async ({ email, url }) => {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST', signal: AbortSignal.timeout(15_000),
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: process.env.CORD_MAIL_FROM, to: [email], subject: 'Confirme ton compte Cord', text: `Confirme ton adresse en ouvrant ce lien (valable 15 minutes) :\n${url}\n\nSi tu n’as pas demandé cette confirmation, ignore cet email.` }),
      });
      if (!response.ok) throw new Error('Email delivery failed');
    };
  } else if (['127.0.0.1', 'localhost'].includes(new URL(issuer).hostname) && ['127.0.0.1', 'localhost'].includes(host)) {
    sendVerification = async ({ url }) => {
      console.log(`Confirmation locale (développement uniquement) : ${url}`);
      return { devUrl: url };
    };
  }
  const app = createAccountService({ database: process.env.CORD_DATABASE ?? fileURLToPath(new URL('./data/cord.sqlite', import.meta.url)), issuer, clients, sendVerification, trustProxy: process.env.CORD_TRUST_PROXY === '1' });
  app.server.listen(port, host, () => console.log(`Compte Cord : ${issuer}`));
}
