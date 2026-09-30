import test from 'node:test';
import { githubReleases, normalizeBetaCode, generateBetaCode } from './lib/beta.mjs';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createHash, generateKeyPairSync, randomBytes, sign } from 'node:crypto';
import { createService, migrate } from './lib/service.mjs';
import { pgliteSql } from './lib/db-pglite.mjs';
import { totpAt } from './lib/totp.mjs';

/**
 * Fonctionnalités du portail : 2FA, passkeys, récupération, sessions, apps
 * connectées, export RGPD, avatar, alertes, administration.
 * (Le contrat historique est couvert par server.test.mjs, laissé intact.)
 */

const issuer = 'http://127.0.0.1:4319';
const rpId = '127.0.0.1';
const oidcKey = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' },
}).privateKey;
const sha256 = (data) => createHash('sha256').update(data).digest();
const UA_MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15';
const UA_PHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

async function setup(t, { admins = [], betaReleases, githubFetch, pushFetch } = {}) {
  const sql = await pgliteSql(undefined);
  await migrate(sql);
  await migrate(sql); // idempotente
  const mails = [];
  const { handle } = createService({
    sql,
    issuer,
    oidcKey,
    admins,
    betaReleases,
    githubFetch,
    pushFetch,
    sendMail: async (m) => {
      mails.push(m);
    },
    clients: {
      drivecord: { name: 'Drivecord', secret: 'test-client-secret', redirectUris: ['http://localhost:3000/api/auth/callback/cord'] },
      sharecord: { name: 'Sharecord', secret: 'test-sharecord-secret', redirectUris: ['https://share.cordsuite.app/api/auth/callback/cord', 'http://localhost:3100/api/auth/callback/cord'] },
    },
  });
  const server = http.createServer(handle);
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  t.after(() => new Promise((r) => server.close(r)));
  const base = `http://127.0.0.1:${server.address().port}`;
  async function request(path, { body, token, method = body ? 'POST' : 'GET', ua = UA_MAC } = {}) {
    const response = await fetch(base + path, {
      method,
      headers: {
        'User-Agent': ua,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const type = response.headers.get('content-type') ?? '';
    return {
      status: response.status,
      headers: response.headers,
      data: type.includes('json') ? await response.json() : Buffer.from(await response.arrayBuffer()),
    };
  }
  const lastMail = (kind) => mails.filter((m) => m.kind === kind).at(-1);
  const credentials = { name: 'Luna', email: 'luna@example.test', password: 'Un mot de passe Cord' };
  const registered = await request('/api/register', { body: credentials });
  assert.equal(registered.status, 201);
  await request('/api/email/send', { token: registered.data.token, body: {} });
  const verifyToken = new URL(lastMail('verify').url).searchParams.get('verify');
  assert.equal((await request('/api/email/verify', { body: { token: verifyToken } })).status, 200);
  return { request, mails, lastMail, credentials, token: registered.data.token, user: registered.data.user, sql };
}

// ── CBOR minimal (côté « authentificateur » simulé) ──────────────────────
function cbor(value) {
  const head = (major, n) => {
    if (n < 24) return Buffer.from([(major << 5) | n]);
    if (n < 256) return Buffer.from([(major << 5) | 24, n]);
    const b = Buffer.alloc(3);
    b[0] = (major << 5) | 25;
    b.writeUInt16BE(n, 1);
    return b;
  };
  if (Buffer.isBuffer(value)) return Buffer.concat([head(2, value.length), value]);
  if (typeof value === 'string') return Buffer.concat([head(3, Buffer.byteLength(value)), Buffer.from(value)]);
  if (typeof value === 'number') return value >= 0 ? head(0, value) : head(1, -1 - value);
  if (value instanceof Map) return Buffer.concat([head(5, value.size), ...[...value].flatMap(([k, v]) => [cbor(k), cbor(v)])]);
  throw new Error('type CBOR non géré');
}
function authenticator() {
  const { privateKey, publicKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
  const jwk = publicKey.export({ format: 'jwk' });
  const credentialId = randomBytes(16);
  let counter = 0;
  const cose = new Map([[1, 2], [3, -7], [-1, 1], [-2, Buffer.from(jwk.x, 'base64url')], [-3, Buffer.from(jwk.y, 'base64url')]]);
  return {
    id: credentialId.toString('base64url'),
    create(challenge, { origin = issuer, flags = 0x45 } = {}) {
      const len = Buffer.alloc(2);
      len.writeUInt16BE(credentialId.length);
      const authData = Buffer.concat([sha256(rpId), Buffer.from([flags]), Buffer.alloc(4), Buffer.alloc(16), len, credentialId, cbor(cose)]);
      const clientDataJSON = Buffer.from(JSON.stringify({ type: 'webauthn.create', challenge, origin }));
      return {
        id: credentialId.toString('base64url'),
        clientDataJSON: clientDataJSON.toString('base64url'),
        attestationObject: cbor(new Map([['fmt', 'none'], ['attStmt', new Map()], ['authData', authData]])).toString('base64url'),
        transports: ['internal', 'hybrid'],
      };
    },
    get(challenge, { userId, origin = issuer } = {}) {
      counter += 1;
      const count = Buffer.alloc(4);
      count.writeUInt32BE(counter);
      const authData = Buffer.concat([sha256(rpId), Buffer.from([0x05]), count]);
      const clientDataJSON = Buffer.from(JSON.stringify({ type: 'webauthn.get', challenge, origin }));
      return {
        id: credentialId.toString('base64url'),
        clientDataJSON: clientDataJSON.toString('base64url'),
        authenticatorData: authData.toString('base64url'),
        signature: sign('sha256', Buffer.concat([authData, sha256(clientDataJSON)]), privateKey).toString('base64url'),
        ...(userId ? { userHandle: Buffer.from(userId).toString('base64url') } : {}),
      };
    },
  };
}

test('TOTP two-factor: setup, enforced at login, replay-proof, recovery codes are single-use', async (t) => {
  const { request, token, credentials, lastMail } = await setup(t);
  const setupResult = await request('/api/security/totp', { token, body: { action: 'setup' } });
  assert.equal(setupResult.status, 200);
  assert.match(setupResult.data.otpauth, /^otpauth:\/\/totp\/Cord:/);
  const secret = setupResult.data.secret;
  const step = Math.floor(Date.now() / 30000);
  assert.equal((await request('/api/security/totp', { token, body: { action: 'enable', code: '000000' === totpAt(secret, step) ? '111111' : '000000' } })).status, 403);
  const enabled = await request('/api/security/totp', { token, body: { action: 'enable', code: totpAt(secret, step) } });
  assert.equal(enabled.status, 200);
  assert.equal(enabled.data.recoveryCodes.length, 10);
  assert.ok(lastMail('mfa-enabled'), 'alerte envoyée');

  const noCode = await request('/api/login', { body: credentials });
  assert.equal(noCode.status, 401);
  assert.equal(noCode.data.reason, 'mfa_required');
  assert.equal(noCode.data.token, undefined, 'aucune session sans second facteur');
  assert.equal((await request('/api/login', { body: { ...credentials, otp: totpAt(secret, step) } })).data.reason, 'mfa_invalid', 'code déjà consommé : rejeu refusé');
  const withCode = await request('/api/login', { body: { ...credentials, otp: totpAt(secret, step + 1) } });
  assert.equal(withCode.status, 200);
  assert.ok(withCode.data.token);

  const recovery = enabled.data.recoveryCodes[0];
  assert.equal((await request('/api/login', { body: { ...credentials, otp: recovery.toUpperCase() } })).status, 200);
  assert.equal((await request('/api/login', { body: { ...credentials, otp: recovery } })).status, 401, 'code de secours à usage unique');
  const account = await request('/api/account', { token });
  assert.equal(account.data.security.mfa, true);
  assert.equal(account.data.security.recoveryCodesLeft, 9);
  assert.ok(account.data.activity.some((e) => e.kind === 'recovery_used'));

  assert.equal((await request('/api/security/totp', { token, body: { action: 'disable', code: '123' } })).status, 403);
  assert.equal((await request('/api/security/totp', { token, body: { action: 'disable', code: enabled.data.recoveryCodes[1] } })).status, 200);
  assert.equal((await request('/api/login', { body: credentials })).status, 200, 'mot de passe seul à nouveau suffisant');
});

test('TOTP secrets are encrypted at rest and never exported', async (t) => {
  const { request, token, sql, user } = await setup(t);
  const { data } = await request('/api/security/totp', { token, body: { action: 'setup' } });
  await request('/api/security/totp', { token, body: { action: 'enable', code: totpAt(data.secret, Math.floor(Date.now() / 30000)) } });
  const [stored] = await sql('SELECT mfa_secret FROM users WHERE id = $1', [user.id]);
  assert.ok(stored.mfa_secret.startsWith('v1.'));
  assert.ok(!stored.mfa_secret.includes(data.secret));
  const exported = await request('/api/account/export', { token });
  assert.equal(exported.status, 200);
  assert.match(exported.headers.get('content-disposition'), /attachment; filename="compte-cord-/);
  const text = JSON.stringify(exported.data);
  for (const forbidden of [data.secret, 'password_hash', 'salt', 'mfa_secret', stored.mfa_secret]) assert.ok(!text.includes(forbidden), `export sans ${forbidden}`);
  assert.equal(exported.data.profile.email, 'luna@example.test');
  assert.equal(exported.data.security.twoFactor, true);
});

test('passkeys: registration and usernameless login verify origin, challenge and signature', async (t) => {
  const { request, token, user, lastMail } = await setup(t);
  const device = authenticator();
  const options = (await request('/api/passkeys/register/options', { token, body: {} })).data;
  assert.equal(options.publicKey.authenticatorSelection.userVerification, 'required');
  assert.equal(options.publicKey.rp.id, rpId);
  const bad = await request('/api/passkeys/register', { token, body: { id: options.id, name: 'Piège', credential: device.create(options.publicKey.challenge, { origin: 'https://evil.example' }) } });
  assert.equal(bad.status, 400);
  assert.equal((await request('/api/passkeys/register', { token, body: { id: options.id, credential: device.create(options.publicKey.challenge) } })).status, 410, 'défi consommé');

  const retry = (await request('/api/passkeys/register/options', { token, body: {} })).data;
  const noUv = await request('/api/passkeys/register', { token, body: { id: retry.id, credential: device.create(retry.publicKey.challenge, { flags: 0x41 }) } });
  assert.equal(noUv.status, 400, 'vérification de l’utilisateur exigée');

  const again = (await request('/api/passkeys/register/options', { token, body: {} })).data;
  const created = await request('/api/passkeys/register', { token, body: { id: again.id, name: 'MacBook', credential: device.create(again.publicKey.challenge) } });
  assert.equal(created.status, 201);
  assert.equal(created.data.passkey.name, 'MacBook');
  assert.ok(lastMail('passkey-added'));
  const excluded = (await request('/api/passkeys/register/options', { token, body: {} })).data.publicKey.excludeCredentials;
  assert.deepEqual(excluded.map((c) => c.id), [device.id]);

  const login = (await request('/api/passkeys/login/options', { body: {} })).data;
  const forged = device.get(login.publicKey.challenge, { userId: user.id });
  forged.signature = Buffer.from(forged.signature, 'base64url').reverse().toString('base64url');
  assert.equal((await request('/api/passkeys/login', { body: { id: login.id, credential: forged } })).status, 401);
  const login2 = (await request('/api/passkeys/login/options', { body: {} })).data;
  const assertion = device.get(login2.publicKey.challenge, { userId: user.id });
  const ok = await request('/api/passkeys/login', { body: { id: login2.id, credential: assertion } });
  assert.equal(ok.status, 200);
  assert.equal(ok.data.user.id, user.id);
  assert.equal((await request('/api/me', { token: ok.data.token })).status, 200);
  assert.equal((await request('/api/passkeys/login', { body: { id: login2.id, credential: assertion } })).status, 410, 'pas de rejeu');

  await request('/api/passkeys', { token, method: 'PATCH', body: { id: device.id, name: 'Mac de Luna' } });
  const account = (await request('/api/account', { token })).data;
  assert.equal(account.passkeys[0].name, 'Mac de Luna');
  assert.ok(account.passkeys[0].lastUsedAt);
  await request('/api/passkeys', { token, method: 'DELETE', body: { id: device.id } });
  const login3 = (await request('/api/passkeys/login/options', { body: {} })).data;
  const revoked = await request('/api/passkeys/login', { body: { id: login3.id, credential: device.get(login3.publicKey.challenge) } });
  assert.equal(revoked.status, 401);
  assert.equal(revoked.data.reason, 'passkey_unknown');
});

test('password reset by email: no enumeration, single-use link, closes every session', async (t) => {
  const { request, token, credentials, mails, lastMail } = await setup(t);
  const before = mails.length;
  assert.equal((await request('/api/password/forgot', { body: { email: 'nobody@example.test' } })).status, 200);
  assert.equal(mails.length, before, 'aucun email pour un compte inconnu, même réponse');
  assert.equal((await request('/api/password/forgot', { body: { email: credentials.email } })).status, 200);
  const resetToken = new URL(lastMail('reset').url).searchParams.get('reset');
  const check = await request('/api/password/reset/check', { body: { token: resetToken } });
  assert.equal(check.data.mfa, false);
  assert.match(check.data.email, /^l•+@example\.test$/);
  assert.equal((await request('/api/password/reset', { body: { token: resetToken, password: 'court' } })).status, 400);
  const reset = await request('/api/password/reset', { body: { token: resetToken, password: 'Un tout nouveau secret' } });
  assert.equal(reset.status, 200);
  assert.ok(reset.data.token);
  assert.equal((await request('/api/me', { token })).status, 401, 'anciennes sessions fermées');
  assert.equal((await request('/api/password/reset', { body: { token: resetToken, password: 'Encore un autre secret' } })).status, 410);
  assert.equal((await request('/api/login', { body: credentials })).status, 401);
  assert.equal((await request('/api/login', { body: { ...credentials, password: 'Un tout nouveau secret' } })).status, 200);
  assert.ok(lastMail('password-changed'));
});

test('password change needs the current password (or a fresh strong login) and signs out other devices', async (t) => {
  const { request, token, credentials } = await setup(t);
  const other = (await request('/api/login', { body: credentials, ua: UA_PHONE })).data.token;
  assert.equal((await request('/api/security/password', { token, body: { current: 'faux', password: 'Nouveau mot de passe sûr' } })).status, 403);
  const changed = await request('/api/security/password', { token, body: { current: credentials.password, password: 'Nouveau mot de passe sûr' } });
  assert.equal(changed.status, 200);
  assert.equal(changed.data.closedSessions, 1);
  assert.equal((await request('/api/me', { token })).status, 200, 'la session courante reste ouverte');
  assert.equal((await request('/api/me', { token: other })).status, 401);
});

test('sessions: listed with device, revocable one by one or all but the current one; new devices trigger an alert', async (t) => {
  const { request, token, credentials, lastMail } = await setup(t);
  assert.equal(lastMail('new-login'), undefined);
  const phone = (await request('/api/login', { body: credentials, ua: UA_PHONE })).data.token;
  const alert = lastMail('new-login');
  assert.ok(alert, 'alerte de nouvelle connexion');
  assert.match(alert.html, /Safari · iOS/);
  const list = (await request('/api/sessions', { token })).data.sessions;
  assert.equal(list.length, 2);
  const mine = list.find((s) => s.current);
  assert.equal(mine.device.label, 'Safari · macOS');
  const theirs = list.find((s) => !s.current);
  assert.equal(theirs.device.kind, 'mobile');
  assert.equal((await request('/api/sessions', { token, method: 'DELETE', body: { id: theirs.id } })).status, 200);
  assert.equal((await request('/api/me', { token: phone })).status, 401);
  await request('/api/login', { body: credentials, ua: UA_PHONE });
  await request('/api/login', { body: credentials, ua: UA_PHONE });
  const revoked = await request('/api/sessions/revoke-others', { token, body: {} });
  assert.equal(revoked.data.closed, 2);
  assert.equal((await request('/api/sessions', { token })).data.sessions.length, 1);
  // Désactiver les alertes
  await request('/api/me', { token, method: 'PATCH', body: { alerts: false } });
  const count = (await request('/api/account', { token })).data.activity.length;
  assert.ok(count >= 4);
});

test('email change goes through a confirmation link and warns the old address', async (t) => {
  const { request, token, credentials, lastMail } = await setup(t);
  assert.equal((await request('/api/email/change', { token, body: { email: 'nova@example.test', password: 'faux' } })).status, 403);
  assert.equal((await request('/api/email/change', { token, body: { email: 'nova@example.test', password: credentials.password } })).status, 200);
  const mail = lastMail('email-change');
  assert.equal(mail.to, 'nova@example.test');
  const changeToken = new URL(mail.url).searchParams.get('email-change');
  assert.equal((await request('/api/email/change/confirm', { body: { token: changeToken } })).status, 200);
  assert.equal((await request('/api/email/change/confirm', { body: { token: changeToken } })).status, 410);
  const me = (await request('/api/me', { token })).data.user;
  assert.equal(me.email, 'nova@example.test');
  assert.equal(me.emailVerified, true);
  assert.equal(lastMail('email-changed').to, credentials.email);
  assert.equal((await request('/api/login', { body: { ...credentials, email: 'nova@example.test' } })).status, 200);
});

test('Sharecord signs in over OIDC (PKCE, nonce, client_secret_post) and publishes only to its own domain', async (t) => {
  const { request, token, user } = await setup(t);
  const secret = 'test-sharecord-secret';
  const callback = 'https://share.cordsuite.app/api/auth/callback/cord';
  const verifier = randomBytes(32).toString('base64url');
  const params = {
    client_id: 'sharecord', redirect_uri: callback, scope: 'openid profile email', response_type: 'code',
    code_challenge_method: 'S256', code_challenge: createHash('sha256').update(verifier).digest('base64url'), state: 's', nonce: 'n-1',
  };

  // Adresses de retour strictes : ni wildcard, ni sous-domaine, ni chemin voisin, ni celle d'un autre client.
  for (const redirect_uri of ['https://evil.example/api/auth/callback/cord', 'https://x.share.cordsuite.app/api/auth/callback/cord', 'https://share.cordsuite.app/api/auth/callback/cord/', 'http://localhost:3000/api/auth/callback/cord'])
    assert.equal((await request('/api/authorize', { token, body: { ...params, redirect_uri } })).status, 400, redirect_uri);
  assert.equal((await request('/api/authorize', { token, body: { ...params, code_challenge_method: 'plain' } })).status, 400, 'PKCE S256 obligatoire');
  assert.equal((await request('/api/authorize', { token, body: { ...params, redirect_uri: 'http://localhost:3100/api/auth/callback/cord' } })).status, 200, 'retour de dev local');

  const redirect = new URL((await request('/api/authorize', { token, body: params })).data.redirect);
  assert.equal(redirect.origin + redirect.pathname, callback);
  assert.equal(redirect.searchParams.get('state'), 's');
  const grant = { client_id: 'sharecord', client_secret: secret, grant_type: 'authorization_code', redirect_uri: callback, code: redirect.searchParams.get('code'), code_verifier: verifier };
  assert.equal((await request('/oauth/token', { body: { ...grant, client_secret: 'test-client-secret' } })).status, 401, 'le secret de Drivecord ne vaut pas pour Sharecord');
  const result = await request('/oauth/token', { body: grant });
  assert.equal(result.status, 200);
  const claims = JSON.parse(Buffer.from(result.data.id_token.split('.')[1], 'base64url'));
  assert.equal(claims.aud, 'sharecord');
  assert.equal(claims.nonce, 'n-1');

  // Sharecord lit le profil sur /oauth/userinfo (idToken: false).
  const profile = (await request('/oauth/userinfo', { token: result.data.access_token })).data;
  assert.equal(profile.sub, user.id);
  assert.equal(typeof profile.name, 'string');
  assert.equal(typeof profile.email, 'string');
  assert.equal(typeof profile.email_verified, 'boolean');
  await request('/api/me', { token, method: 'PATCH', body: { avatar: 'data:image/png;base64,iVBORw0KGgo=' } });
  assert.match((await request('/oauth/userinfo', { token: result.data.access_token })).data.picture ?? '', /\/avatar\//);

  // Interconnexion : le hub reçoit la tuile, avec les mêmes limites que Drivecord.
  const status = { headline: 'h'.repeat(100), detail: 'd'.repeat(200), metrics: [1, 2, 3, 4, 5].map((i) => ({ label: `L${i}`.repeat(20), value: 'v'.repeat(40) })), url: 'https://share.cordsuite.app/dashboard' };
  const publish = (client_id, client_secret, s = status) => request('/api/apps/status', { body: { client_id, client_secret, sub: user.id, status: s } });
  assert.equal((await publish('sharecord', 'faux')).status, 401);
  assert.equal((await publish('sharecord', secret)).status, 200);
  const tile = (await request('/api/hub', { token })).data.apps.find((a) => a.slug === 'sharecord');
  assert.equal(tile.connected, true);
  assert.equal(tile.launch, 'https://share.cordsuite.app/dashboard');
  assert.equal(tile.logo, '/assets/logos/sharecord.png');
  assert.equal(tile.appStatus.headline.length, 80);
  assert.equal(tile.appStatus.detail.length, 140);
  assert.equal(tile.appStatus.metrics.length, 4);
  assert.ok(tile.appStatus.metrics.every((m) => m.label.length <= 24 && m.value.length <= 24));

  // Un client ne peut publier que vers son propre domaine.
  for (const url of ['https://drivecord.app/drive', 'https://share.cordsuite.app.evil.example/', 'https://evil.example/', 'http://share.cordsuite.app/dashboard', 'https://share.cordsuite.app:8443/dashboard', 'https://cordsuite.app/'])
    assert.equal((await publish('sharecord', secret, { ...status, url })).status, 400, url);
  // Et Drivecord ne peut pas pointer vers Sharecord : chaque client a sa propre règle.
  assert.equal((await request('/api/apps/status', { body: { client_id: 'drivecord', client_secret: 'test-client-secret', sub: user.id, status: { headline: 'x', url: 'https://share.cordsuite.app/dashboard' } } })).status, 404, 'Drivecord non autorisé par cet utilisateur');
  await request('/api/authorize', { token, body: { ...params, client_id: 'drivecord', redirect_uri: 'http://localhost:3000/api/auth/callback/cord' } });
  assert.equal((await request('/api/apps/status', { body: { client_id: 'drivecord', client_secret: 'test-client-secret', sub: user.id, status: { headline: 'x', url: 'https://share.cordsuite.app/dashboard' } } })).status, 400);
  assert.equal((await request('/api/apps/status', { body: { client_id: 'drivecord', client_secret: 'test-client-secret', sub: user.id, status: { headline: 'x', url: 'http://localhost:3000/drive' } } })).status, 200, 'Drivecord inchangé');

  // DELETE retire la tuile.
  assert.equal((await request('/api/apps/status', { method: 'DELETE', body: { client_id: 'sharecord', client_secret: secret, sub: user.id } })).status, 200);
  assert.equal((await request('/api/hub', { token })).data.apps.find((a) => a.slug === 'sharecord').appStatus, null);
});

test('connected apps are recorded on consent and revocation kills their tokens', async (t) => {
  const { request, token, user } = await setup(t);
  const verifier = randomBytes(32).toString('base64url');
  const params = {
    client_id: 'drivecord',
    redirect_uri: 'http://localhost:3000/api/auth/callback/cord',
    scope: 'openid profile email',
    response_type: 'code',
    code_challenge_method: 'S256',
    code_challenge: createHash('sha256').update(verifier).digest('base64url'),
    state: 's',
  };
  const context = await request(`/api/authorize/context?client_id=drivecord&redirect_uri=${encodeURIComponent(params.redirect_uri)}`, { token });
  assert.equal(context.data.consented, false);
  assert.equal(context.data.redirectValid, true);
  assert.equal(context.data.client.logo, '/assets/logos/drivecord.png');
  const redirect = new URL((await request('/api/authorize', { token, body: params })).data.redirect);
  const grant = { client_id: 'drivecord', client_secret: 'test-client-secret', grant_type: 'authorization_code', redirect_uri: params.redirect_uri, code: redirect.searchParams.get('code'), code_verifier: verifier };
  const access = (await request('/oauth/token', { body: grant })).data.access_token;
  assert.equal((await request('/oauth/userinfo', { token: access })).data.sub, user.id);
  assert.equal((await request(`/api/authorize/context?client_id=drivecord&redirect_uri=x`, { token })).data.consented, true);
  const apps = (await request('/api/connected-apps', { token })).data.apps;
  assert.equal(apps.length, 1);
  assert.equal(apps[0].name, 'Drivecord');
  assert.equal((await request('/api/connected-apps', { token, method: 'DELETE', body: { clientId: 'drivecord' } })).status, 200);
  assert.equal((await request('/api/connected-apps', { token })).data.apps.length, 0);
  assert.equal((await request('/oauth/userinfo', { token: access })).status, 401, 'jeton de l’app révoqué');
  const denied = await request('/api/authorize/deny', { body: { client_id: 'drivecord', redirect_uri: params.redirect_uri, state: 's' } });
  assert.equal(new URL(denied.data.redirect).searchParams.get('error'), 'access_denied');
  assert.equal((await request('/api/authorize/deny', { body: { client_id: 'drivecord', redirect_uri: 'https://evil.example' } })).status, 400);
});

test('avatars are validated, served as images and exposed to apps', async (t) => {
  const { request, token, user } = await setup(t);
  assert.equal((await request('/api/me', { token, method: 'PATCH', body: { avatar: 'data:image/svg+xml;base64,PHN2Zz4=' } })).status, 400);
  assert.equal((await request('/api/me', { token, method: 'PATCH', body: { avatar: `data:image/png;base64,${Buffer.from('<script>').toString('base64')}` } })).status, 400, 'contenu non PNG refusé');
  const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), randomBytes(64)]);
  const updated = await request('/api/me', { token, method: 'PATCH', body: { avatar: `data:image/png;base64,${png.toString('base64')}`, theme: 'light', locale: 'en' } });
  assert.equal(updated.status, 200);
  assert.equal(updated.data.user.theme, 'light');
  assert.equal(updated.data.user.locale, 'en');
  const image = await request(new URL(updated.data.user.avatarUrl).pathname);
  assert.equal(image.headers.get('content-type'), 'image/png');
  assert.ok(image.data.equals(png));
  assert.equal((await request('/api/me', { token, method: 'PATCH', body: { avatar: null } })).data.user.avatarUrl, null);
  assert.equal((await request(`/avatar/${user.id}`)).status, 404);
});

test('admin overview is limited to configured, verified owners', async (t) => {
  const { request, token } = await setup(t, { admins: ['luna@example.test'] });
  const overview = await request('/api/admin/overview', { token });
  assert.equal(overview.status, 200);
  assert.equal(overview.data.totals.users, 1);
  assert.equal(overview.data.totals.verified, 1);
  assert.equal(overview.data.clients[0].id, 'drivecord');
  assert.equal(overview.data.clients[0].secret, undefined, 'aucun secret exposé');
  assert.equal((await request('/api/me', { token })).data.user.admin, true);

  const other = await setup(t);
  assert.equal((await other.request('/api/admin/overview', { token: other.token })).status, 403);
});

test('deleting an account removes every trace, including apps, passkeys and history', async (t) => {
  const { request, token, credentials, sql, user, lastMail } = await setup(t);
  const params = {
    client_id: 'drivecord',
    redirect_uri: 'http://localhost:3000/api/auth/callback/cord',
    scope: 'openid email',
    response_type: 'code',
    code_challenge_method: 'S256',
    code_challenge: createHash('sha256').update(randomBytes(32).toString('base64url')).digest('base64url'),
  };
  await request('/api/authorize', { token, body: params });
  const device = authenticator();
  const options = (await request('/api/passkeys/register/options', { token, body: {} })).data;
  await request('/api/passkeys/register', { token, body: { id: options.id, credential: device.create(options.publicKey.challenge) } });
  const { data } = await request('/api/security/totp', { token, body: { action: 'setup' } });
  await request('/api/security/totp', { token, body: { action: 'enable', code: totpAt(data.secret, Math.floor(Date.now() / 30000)) } });
  assert.equal((await request('/api/me', { token, method: 'DELETE', body: {} })).status, 200);
  for (const table of ['users', 'sessions', 'passkeys', 'oauth_consents', 'recovery_codes', 'account_events']) {
    const column = table === 'users' ? 'id' : 'user_id';
    const [row] = await sql(`SELECT COUNT(*) AS n FROM ${table} WHERE ${column} = $1`, [user.id]);
    assert.equal(Number(row.n), 0, `${table} vidée`);
  }
  assert.ok(lastMail('account-deleted'));
  assert.equal((await request('/api/login', { body: credentials })).status, 401);
});

test('the portal is served with a strict CSP, versioned assets and no source file', async (t) => {
  const { request } = await setup(t);
  const page = await request('/');
  assert.equal(page.status, 200);
  assert.match(page.headers.get('content-security-policy'), /script-src 'self';/);
  assert.doesNotMatch(page.headers.get('content-security-policy'), /unsafe-inline/);
  const html = page.data.toString();
  const js = html.match(/src="(\/portal\.js\?v=[^"]+)"/)?.[1];
  assert.ok(js, 'script versionné');
  assert.doesNotMatch(html, /<script>|<script\s+(?![^>]*src=)/, 'aucun script en ligne');
  assert.doesNotMatch(html, /\sstyle="/, 'aucun style en ligne');
  const script = await request(js);
  assert.equal(script.status, 200);
  assert.match(script.headers.get('cache-control'), /immutable/);
  assert.equal((await request('/portal.js')).headers.get('cache-control'), 'no-cache');
  const font = await request('/assets/fonts/inter.woff2');
  assert.equal(font.headers.get('content-type'), 'font/woff2');
  assert.equal((await request('/assets/logos/drivecord.png')).headers.get('content-type'), 'image/png');
  for (const path of ['/portal.html', '/lib/service.mjs', '/package.json', '/.env', '/api/index.mjs']) {
    assert.equal((await request(path)).status, 404, `${path} non exposé`);
  }
  const suite = await request('/api/suite');
  assert.ok(suite.data.apps.some((a) => a.slug === 'passcord'));
});

test('2FA survives a data-key change: CORD_DATA_KEY can be added later, recovery codes still work if the key is lost', async (t) => {
  const sql = await pgliteSql(undefined);
  await migrate(sql);
  const clients = {};
  const serve = async (options) => {
    const { handle } = createService({ sql, issuer, clients, ...options });
    const server = http.createServer(handle);
    await new Promise((r) => server.listen(0, '127.0.0.1', r));
    t.after(() => new Promise((r) => server.close(r)));
    const base = `http://127.0.0.1:${server.address().port}`;
    return async (path, body, token) => {
      const response = await fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) });
      return { status: response.status, data: await response.json() };
    };
  };
  const credentials = { name: 'Nova', email: 'nova@example.test', password: 'Un mot de passe Cord' };
  const first = await serve({ oidcKey });
  const { token } = (await first('/api/register', credentials)).data;
  const { secret: totpSecret } = (await first('/api/security/totp', { action: 'setup' }, token)).data;
  const step = Math.floor(Date.now() / 30000);
  const { recoveryCodes } = (await first('/api/security/totp', { action: 'enable', code: totpAt(totpSecret, step) }, token)).data;

  const withDataKey = await serve({ oidcKey, dataKey: 'une clé de données ajoutée plus tard' });
  assert.equal((await withDataKey('/api/login', { ...credentials, otp: totpAt(totpSecret, step + 1) })).status, 200, 'ancien secret toujours lisible');

  const otherKey = generateKeyPairSync('rsa', { modulusLength: 2048, privateKeyEncoding: { type: 'pkcs8', format: 'pem' }, publicKeyEncoding: { type: 'spki', format: 'pem' } }).privateKey;
  const lostKey = await serve({ oidcKey: otherKey });
  const refused = await lostKey('/api/login', { ...credentials, otp: totpAt(totpSecret, step + 1) });
  assert.equal(refused.status, 409, 'pas d’erreur 500');
  assert.equal(refused.data.reason, 'mfa_unreadable');
  assert.equal((await lostKey('/api/login', { ...credentials, otp: recoveryCodes[0] })).status, 200, 'les codes de secours restent valables');
});

test('adding a factor to an old session requires the password again (stolen-cookie lockout guard)', async (t) => {
  const { request, token, credentials, sql, user } = await setup(t);
  await sql('UPDATE sessions SET created_at = $1 WHERE user_id = $2', [Date.now() - 3600_000, user.id]);
  const noPassword = await request('/api/security/totp', { token, body: { action: 'setup' } });
  assert.equal(noPassword.status, 401);
  assert.equal(noPassword.data.reason, 'reauth_required');
  assert.equal((await request('/api/me', { token })).status, 200, 'la session reste valide');
  assert.equal((await request('/api/security/totp', { token, body: { action: 'setup', password: 'faux' } })).data.reason, 'password_invalid');
  assert.equal((await request('/api/security/totp', { token, body: { action: 'setup', password: credentials.password } })).status, 200);
  assert.equal((await request('/api/passkeys/register/options', { token, body: {} })).data.reason, 'reauth_required');
  assert.equal((await request('/api/passkeys/register/options', { token, body: { password: credentials.password } })).status, 200);
});

// ── Bêtas fermées ─────────────────────────────────────────────────────────
async function tester(ctx, email, { verify = true } = {}) {
  const r = await ctx.request('/api/register', { body: { name: 'Testeur', email, password: 'Un mot de passe testeur' } });
  assert.equal(r.status, 201);
  if (verify) {
    await ctx.request('/api/email/send', { token: r.data.token, body: {} });
    const token = new URL(ctx.lastMail('verify').url).searchParams.get('verify');
    assert.equal((await ctx.request('/api/email/verify', { body: { token } })).status, 200);
  }
  return r.data.token;
}

test('beta keys: well-formed, unambiguous and tolerant to how they are typed', () => {
  const code = generateBetaCode('passcord');
  assert.match(code, /^PASS-[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}$/);
  const parsed = normalizeBetaCode(code);
  assert.equal(parsed.product, 'passcord');
  assert.deepEqual(normalizeBetaCode(` ${code.toLowerCase().replaceAll('-', ' ')} `), parsed);
  assert.equal(normalizeBetaCode('PASS-0000-1111-OOOO'), null, 'caractères hors alphabet refusés');
  assert.equal(normalizeBetaCode('NOPE-AAAA-BBBB-CCCC'), null);
  assert.notEqual(generateBetaCode('passcord'), generateBetaCode('passcord'));
});

test('beta keys: only admins generate them, they are shown once and stored hashed', async (t) => {
  const ctx = await setup(t, { admins: ['luna@example.test'] });
  const { request, token, sql } = ctx;
  const created = await request('/api/admin/beta/keys', { token, body: { product: 'passcord', count: 3, maxUses: 2, expiresInDays: 30, label: 'Discord' } });
  assert.equal(created.status, 201);
  assert.equal(created.data.keys.length, 3);
  const [key] = created.data.keys;
  assert.equal(key.status, 'active');
  assert.equal(key.maxUses, 2);
  assert.equal(key.label, 'Discord');
  assert.ok(key.expiresAt > Date.now());
  assert.equal(key.hint, key.code.replaceAll('-', '').slice(-4));
  const rows = await sql('SELECT code_hash FROM beta_keys', []);
  assert.ok(rows.every((r) => !created.data.keys.some((k) => r.code_hash.includes(k.code.replaceAll('-', '').slice(4)))), 'jamais en clair');
  const listed = await request('/api/admin/beta?product=passcord', { token });
  assert.equal(listed.data.keys.length, 3);
  assert.ok(listed.data.keys.every((k) => k.code === undefined), 'la liste ne remontre pas les clés');
  assert.equal((await request('/api/admin/beta/keys', { token, body: { count: 51 } })).status, 400);
  assert.equal((await request('/api/admin/beta/keys', { token, body: { product: 'inconnu' } })).status, 400);

  const outsider = await tester(ctx, 'outsider@example.test');
  assert.equal((await request('/api/admin/beta/keys', { token: outsider, body: { count: 1 } })).status, 403);
  assert.equal((await request('/api/admin/beta', { token: outsider })).status, 403);
});

test('beta keys: redeeming grants access once per quota, revocation and expiry are enforced', async (t) => {
  const ctx = await setup(t, { admins: ['luna@example.test'] });
  const { request, token: admin, sql } = ctx;
  const [single, revoked, expired] = (await request('/api/admin/beta/keys', { token: admin, body: { count: 3, maxUses: 1 } })).data.keys;

  const unverified = await tester(ctx, 'pending@example.test', { verify: false });
  assert.equal((await request('/api/beta/redeem', { token: unverified, body: { code: single.code } })).data.reason, 'email_unverified');

  const alice = await tester(ctx, 'alice@example.test');
  assert.deepEqual((await request('/api/me', { token: alice })).data.user.beta, []);
  assert.equal((await request('/api/beta/passcord', { token: alice })).data.access, false);
  assert.equal((await request('/api/beta/redeem', { token: alice, body: { code: 'PASS-AAAA-BBBB-CCCC' } })).data.reason, 'beta_key_invalid');
  assert.equal((await request('/api/beta/redeem', { token: alice, body: { code: 'bonjour' } })).status, 400);
  const redeemed = await request('/api/beta/redeem', { token: alice, body: { code: single.code.toLowerCase() } });
  assert.equal(redeemed.status, 201);
  assert.equal(redeemed.data.name, 'Passcord');
  assert.deepEqual((await request('/api/me', { token: alice })).data.user.beta, ['passcord']);
  assert.deepEqual((await request('/api/account', { token: alice })).data.user.beta, ['passcord']);
  assert.equal((await request('/api/beta/redeem', { token: alice, body: { code: single.code } })).data.already, true, 'déjà testeur : la clé n\'est pas re-consommée');

  const bob = await tester(ctx, 'bob@example.test');
  assert.equal((await request('/api/beta/redeem', { token: bob, body: { code: single.code } })).data.reason, 'beta_key_used');
  await request('/api/admin/beta/keys', { token: admin, method: 'DELETE', body: { id: revoked.id } });
  assert.equal((await request('/api/beta/redeem', { token: bob, body: { code: revoked.code } })).data.reason, 'beta_key_revoked');
  await sql('UPDATE beta_keys SET expires_at = $1 WHERE id = $2', [Date.now() - 1000, expired.id]);
  assert.equal((await request('/api/beta/redeem', { token: bob, body: { code: expired.code } })).data.reason, 'beta_key_expired');

  const overview = await request('/api/admin/beta', { token: admin });
  assert.deepEqual(overview.data.keys.map((k) => k.status).sort(), ['expired', 'revoked', 'used']);
  assert.equal(overview.data.testers.length, 1);
  assert.equal(overview.data.testers[0].email, 'alice@example.test');
  assert.equal(overview.data.testers[0].keyHint, single.hint);
  assert.deepEqual((await request('/api/me', { token: admin })).data.user.beta, ['passcord'], 'les admins ont toutes les bêtas');

  await request('/api/admin/beta/testers', { token: admin, method: 'DELETE', body: { userId: overview.data.testers[0].userId, product: 'passcord' } });
  assert.deepEqual((await request('/api/me', { token: alice })).data.user.beta, []);

  // La suppression du compte efface aussi l'accès.
  const carol = await tester(ctx, 'carol@example.test');
  const [key] = (await request('/api/admin/beta/keys', { token: admin, body: { count: 1 } })).data.keys;
  await request('/api/beta/redeem', { token: carol, body: { code: key.code } });
  const me = (await request('/api/me', { token: carol })).data.user;
  await request('/api/me', { token: carol, method: 'DELETE', body: {} });
  assert.equal(Number((await sql('SELECT COUNT(*) AS n FROM beta_access WHERE user_id = $1', [me.id]))[0].n), 0);
});

test('beta downloads: private builds are handed out only to testers, as short-lived links', async (t) => {
  const calls = [];
  const fakeFetch = async (url, init) => {
    calls.push([url, init.headers.Accept]);
    if (url.includes('/releases?')) {
      return new Response(JSON.stringify([
        { draft: true, name: 'Brouillon', tag_name: 'build-11', assets: [{ id: 9, name: 'Passcord.ipa', size: 1, url: 'https://api.github.com/assets/9' }] },
        { draft: false, name: 'Build 10', tag_name: 'build-10', published_at: '2026-09-25T16:05:10Z', assets: [
          { id: 1, name: 'Passcord-autofill.ipa', size: 2255032, url: 'https://api.github.com/assets/1' },
          { id: 2, name: 'Passcord.ipa', size: 1832796, url: 'https://api.github.com/assets/2' },
          { id: 3, name: 'notes.txt', size: 10, url: 'https://api.github.com/assets/3' },
        ] },
      ]), { status: 200 });
    }
    return new Response(null, { status: 302, headers: { Location: `https://objects.example/signed/${url.split('/').pop()}?sig=abc` } });
  };
  const releases = githubReleases({ token: 'jeton-de-test', repo: 'owner/passcord', fetchImpl: fakeFetch });
  const ctx = await setup(t, { admins: ['luna@example.test'], betaReleases: { passcord: releases } });
  const { request, token: admin } = ctx;
  const user = await tester(ctx, 'dave@example.test');

  const refused = await request('/api/beta/passcord/download', { token: user, body: {} });
  assert.equal(refused.data.reason, 'beta_required');
  assert.equal(calls.length, 0, 'GitHub n\'est pas contacté sans accès');

  const [key] = (await request('/api/admin/beta/keys', { token: admin, body: { count: 1 } })).data.keys;
  await request('/api/beta/redeem', { token: user, body: { code: key.code } });
  const info = await request('/api/beta/passcord', { token: user });
  assert.equal(info.data.access, true);
  assert.equal(info.data.release.build, 'Build 10');
  assert.deepEqual(info.data.release.assets.map((a) => a.name), ['Passcord-autofill.ipa', 'Passcord.ipa']);

  const standard = await request('/api/beta/passcord/download', { token: user, body: {} });
  assert.equal(standard.status, 200);
  assert.equal(standard.data.name, 'Passcord.ipa', 'Passcord.ipa par défaut');
  assert.equal(standard.data.url, 'https://objects.example/signed/2?sig=abc');
  assert.ok(calls.every(([, accept]) => accept), 'en-têtes GitHub posés');
  assert.equal(JSON.stringify(standard.data).includes('jeton-de-test'), false, 'le jeton ne sort jamais');
  const autofill = await request('/api/beta/passcord/download', { token: user, body: { asset: 'Passcord-autofill.ipa' } });
  assert.equal(autofill.data.url, 'https://objects.example/signed/1?sig=abc');
  assert.equal((await request('/api/beta/passcord/download', { token: user, body: { asset: 'notes.txt' } })).status, 404);

  const unconfigured = await setup(t, { admins: ['luna@example.test'] });
  assert.equal((await unconfigured.request('/api/beta/passcord/download', { token: unconfigured.token, body: {} })).data.reason, 'downloads_unconfigured');
});

test('beta downloads can be configured from the admin: the GitHub token is checked, then stored encrypted', async (t) => {
  const seen = [];
  const githubFetch = async (url, init) => {
    seen.push(init.headers.Authorization);
    if (init.headers.Authorization !== 'Bearer github_pat_bon_jeton_de_test_123456') return new Response('{}', { status: 404 });
    if (url.includes('/releases?')) {
      return new Response(JSON.stringify([{ draft: false, name: 'Build 10', tag_name: 'build-10', published_at: '2026-09-25T16:05:10Z', assets: [{ id: 2, name: 'Passcord.ipa', size: 1832796, url: 'https://api.github.com/assets/2' }] }]), { status: 200 });
    }
    return new Response(null, { status: 302, headers: { Location: 'https://objects.example/signed/2?sig=abc' } });
  };
  const ctx = await setup(t, { admins: ['luna@example.test'], githubFetch });
  const { request, token: admin, sql } = ctx;
  assert.equal((await request('/api/admin/beta', { token: admin })).data.downloads, false);

  const tester = await ctx.request('/api/register', { body: { name: 'T', email: 't@example.test', password: 'Un mot de passe testeur' } });
  assert.equal((await request('/api/admin/beta/token', { token: tester.data.token, body: { token: 'github_pat_bon_jeton_de_test_123456' } })).status, 403);
  assert.equal((await request('/api/admin/beta/token', { token: admin, body: { token: 'pas-un-jeton' } })).data.reason, 'token_invalid');
  assert.equal((await request('/api/admin/beta/token', { token: admin, body: { token: 'github_pat_mauvais_jeton_de_test_1234' } })).data.reason, 'token_rejected');

  const saved = await request('/api/admin/beta/token', { token: admin, body: { token: 'github_pat_bon_jeton_de_test_123456' } });
  assert.equal(saved.status, 200);
  assert.equal(saved.data.release.build, 'Build 10');
  const [row] = await sql("SELECT value FROM service_settings WHERE key = 'releases_token:passcord'", []);
  assert.ok(row.value.startsWith('v1.') && !row.value.includes('bon_jeton'), 'chiffré au repos');

  const overview = await request('/api/admin/beta', { token: admin });
  assert.equal(overview.data.downloads, true);
  assert.equal(overview.data.downloadsSource, 'admin');
  assert.equal(JSON.stringify(overview.data).includes('bon_jeton'), false, 'jamais renvoyé');
  const link = await request('/api/beta/passcord/download', { token: admin, body: {} });
  assert.equal(link.data.url, 'https://objects.example/signed/2?sig=abc');

  await request('/api/admin/beta/token', { token: admin, method: 'DELETE', body: { product: 'passcord' } });
  assert.equal((await request('/api/admin/beta', { token: admin })).data.downloads, false);
});

// ── Inscription express et suite interconnectée ──────────────────────────
test('email can be confirmed with the 6-digit code from the email, attempts are limited', async (t) => {
  const ctx = await setup(t);
  const r = await ctx.request('/api/register', { body: { name: 'Nova', email: 'nova@example.test', password: 'Un mot de passe Nova' } });
  const token = r.data.token;
  await ctx.request('/api/email/send', { token, body: {} });
  const mail = ctx.lastMail('verify');
  const code = mail.html.match(/>(\d{3})&nbsp;(\d{3})</).slice(1).join('');
  assert.match(mail.subject, /^\d{3} \d{3} — ton code Compte Cord$/);
  assert.ok(mail.text.includes(`Ton code : ${code}`));
  const wrong = code === '000000' ? '111111' : '000000';
  assert.equal((await ctx.request('/api/email/verify-code', { token, body: { code: wrong } })).data.reason, 'code_invalid');
  assert.equal((await ctx.request('/api/me', { token })).data.user.emailVerified, false);
  assert.equal((await ctx.request('/api/email/verify-code', { token, body: { code: `${code.slice(0, 3)} ${code.slice(3)}` } })).status, 200);
  assert.equal((await ctx.request('/api/me', { token })).data.user.emailVerified, true);
  // Brute force : bloqué après 8 essais.
  const other = await ctx.request('/api/register', { body: { name: 'Bruno', email: 'bruno@example.test', password: 'Un mot de passe Bruno' } });
  await ctx.request('/api/email/send', { token: other.data.token, body: {} });
  let last;
  for (let i = 0; i < 9; i++) last = await ctx.request('/api/email/verify-code', { token: other.data.token, body: { code: String(100000 + i) } });
  assert.equal(last.status, 429);
});

test('apps publish a status card and notifications for users who authorized them, the hub shows it all', async (t) => {
  const ctx = await setup(t);
  const { request, token, user } = ctx;
  const secret = 'test-client-secret';
  const status = { headline: '12,4 Go stockés', detail: '3 drives · dernière sauvegarde hier', metrics: [{ label: 'Fichiers', value: 1834 }], url: 'http://localhost:3000/drive' };

  // Pas encore autorisée : refus.
  assert.equal((await request('/api/apps/status', { body: { client_id: 'drivecord', client_secret: secret, sub: user.id, status } })).data.reason, 'not_connected');
  const params = {
    client_id: 'drivecord', redirect_uri: 'http://localhost:3000/api/auth/callback/cord', scope: 'openid email', response_type: 'code',
    code_challenge_method: 'S256', code_challenge: createHash('sha256').update(randomBytes(32).toString('base64url')).digest('base64url'),
  };
  await request('/api/authorize', { token, body: params });

  assert.equal((await request('/api/apps/status', { body: { client_id: 'drivecord', client_secret: 'faux', sub: user.id, status } })).status, 401);
  assert.equal((await request('/api/apps/status', { body: { client_id: 'drivecord', client_secret: secret, sub: user.id, status: { ...status, url: 'https://phishing.example/login' } } })).status, 400, 'lien hors du domaine de l’app refusé');
  assert.equal((await request('/api/apps/status', { body: { client_id: 'drivecord', client_secret: secret, sub: user.id, status } })).status, 200);
  assert.equal((await request('/api/apps/notify', { body: { client_id: 'drivecord', client_secret: secret, sub: user.id, title: 'Sauvegarde terminée', body: '248 photos envoyées', url: 'http://localhost:3000/backup' } })).status, 201);

  const hub = (await request('/api/hub', { token })).data;
  const drivecord = hub.apps.find((a) => a.slug === 'drivecord');
  assert.equal(drivecord.connected, true);
  assert.equal(drivecord.appStatus.headline, '12,4 Go stockés');
  assert.deepEqual(drivecord.appStatus.metrics, [{ label: 'Fichiers', value: '1834' }]);
  assert.equal(drivecord.launch, 'https://drivecord.app/login?via=cord');
  assert.equal(hub.apps.find((a) => a.slug === 'passcord').beta.access, false);
  assert.equal(hub.unread, 1);
  assert.equal((await request('/api/account', { token })).data.unread, 1);

  // CordLauncher publie avec la session (app sans client OAuth).
  assert.equal((await request('/api/me/app-status', { token, body: { app: 'cordlauncher', status: { headline: 'PC de Luna', metrics: [{ label: 'Apps', value: 2 }] } } })).status, 200);
  assert.equal((await request('/api/me/app-status', { token, body: { app: 'drivecord', status: { headline: 'usurpation' } } })).status, 400);
  assert.equal((await request('/api/hub', { token })).data.launcher.headline, 'PC de Luna');

  const inbox = (await request('/api/notifications', { token })).data;
  assert.equal(inbox.items[0].title, 'Sauvegarde terminée');
  assert.equal(inbox.items[0].name, 'Drivecord');
  await request('/api/notifications/read', { token, body: { all: true } });
  assert.equal((await request('/api/notifications', { token })).data.unread, 0);
  await request('/api/notifications', { token, method: 'DELETE', body: { id: inbox.items[0].id } });
  assert.equal((await request('/api/notifications', { token })).data.items.length, 0);

  // Révoquer l'app coupe ses remontées ; supprimer le compte efface tout.
  await request('/api/connected-apps', { token, method: 'DELETE', body: { clientId: 'drivecord' } });
  assert.equal((await request('/api/apps/notify', { body: { client_id: 'drivecord', client_secret: secret, sub: user.id, title: 'x' } })).data.reason, 'not_connected');
  await request('/api/me', { token, method: 'DELETE', body: {} });
  for (const table of ['app_status', 'notifications']) {
    assert.equal(Number((await ctx.sql(`SELECT COUNT(*) AS n FROM ${table} WHERE user_id = $1`, [user.id]))[0].n), 0, table);
  }
});

// ── Passcord envoyé à l'iPhone + notifications push ──────────────────────
test('web push encryption matches the RFC 8291 test vector', async () => {
  const { createECDH } = await import('node:crypto');
  const { encryptPayload } = await import('./lib/push.mjs');
  const ecdh = createECDH('prime256v1');
  ecdh.setPrivateKey(Buffer.from('yfWPiYE-n46HLnH0KqZOF1fJJU3MYrct3AELtAQ-oRw', 'base64url'));
  const body = encryptPayload(
    'When I grow up, I want to be a watermelon',
    { p256dh: 'BCVxsr7N_eNgVRqvHtD0zTZsEc6-VV-JvLexhqUzORcxaOzi6-AYWXvTBHm4bjyPjs7Vd8pZGH6SRpkNtoIAiw4', auth: 'BTBZMqHH6r4Tts7J_aSIgg' },
    { salt: Buffer.from('DGv6ra1nlYgDCS1FRnbzlw', 'base64url'), ecdh },
  );
  assert.equal(
    body.toString('base64url'),
    'DGv6ra1nlYgDCS1FRnbzlwAAEABBBP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A_yl95bQpu6cVPTpK4Mqgkf1CXztLVBSt2Ks3oZwbuwXPXLWyouBWLVWGNWQexSgSxsj_Qulcy4a-fN',
  );
});

/** Déchiffre un message push comme le ferait le navigateur (aes128gcm). */
async function decryptPush(body, receiver, authSecret) {
  const { createDecipheriv, hkdfSync } = await import('node:crypto');
  const salt = body.subarray(0, 16);
  const idlen = body.readUInt8(20);
  const asPublic = body.subarray(21, 21 + idlen);
  const cipher = body.subarray(21 + idlen);
  const shared = receiver.computeSecret(asPublic);
  const keyInfo = Buffer.concat([Buffer.from('WebPush: info\0'), receiver.getPublicKey(), asPublic]);
  const ikm = Buffer.from(hkdfSync('sha256', shared, authSecret, keyInfo, 32));
  const cek = Buffer.from(hkdfSync('sha256', ikm, salt, Buffer.from('Content-Encoding: aes128gcm\0'), 16));
  const nonce = Buffer.from(hkdfSync('sha256', ikm, salt, Buffer.from('Content-Encoding: nonce\0'), 12));
  const decipher = createDecipheriv('aes-128-gcm', cek, nonce);
  decipher.setAuthTag(cipher.subarray(-16));
  const plain = Buffer.concat([decipher.update(cipher.subarray(0, -16)), decipher.final()]);
  return JSON.parse(plain.subarray(0, plain.lastIndexOf(2)).toString());
}

test('Passcord requests reach the iPhone: push, inbox, number matching and refusal', async (t) => {
  const { createECDH, verify: verifySig, createPublicKey } = await import('node:crypto');
  const pushes = [];
  const pushFetch = async (url, init) => {
    pushes.push({ url, init });
    return new Response(null, { status: url.includes('gone') ? 410 : 201 });
  };
  const { request, token, user } = await setup(t, { pushFetch });

  // Abonnement push de la web app (clés du « navigateur »).
  const receiver = createECDH('prime256v1');
  receiver.generateKeys();
  const authSecret = randomBytes(16);
  const { publicKey: vapid } = (await request('/api/push/key')).data;
  assert.equal(Buffer.from(vapid, 'base64url').length, 65);
  const keys = { p256dh: receiver.getPublicKey().toString('base64url'), auth: authSecret.toString('base64url') };
  assert.equal((await request('/api/push/subscribe', { body: { endpoint: 'https://web.push.apple.com/abc', keys } })).status, 401);
  assert.equal((await request('/api/push/subscribe', { token, body: { endpoint: 'http://insecure.test/x', keys } })).status, 400);
  const subscribed = await request('/api/push/subscribe', { token, body: { endpoint: 'https://web.push.apple.com/abc', keys } });
  assert.equal(subscribed.data.sent, 1);
  const welcome = pushes.at(-1);
  assert.equal(welcome.init.headers['Content-Encoding'], 'aes128gcm');
  // En-tête VAPID signé avec la clé publiée.
  const [, jwt, k] = welcome.init.headers.Authorization.match(/^vapid t=([^,]+), k=(.+)$/);
  assert.equal(k, vapid);
  const [h, c, s] = jwt.split('.');
  assert.equal(JSON.parse(Buffer.from(c, 'base64url')).aud, 'https://web.push.apple.com');
  const point = Buffer.from(vapid, 'base64url');
  const vapidKey = createPublicKey({ format: 'jwk', key: { kty: 'EC', crv: 'P-256', x: point.subarray(1, 33).toString('base64url'), y: point.subarray(33).toString('base64url') } });
  assert.ok(verifySig('sha256', Buffer.from(`${h}.${c}`), { key: vapidKey, dsaEncoding: 'ieee-p1363' }, Buffer.from(s, 'base64url')));
  assert.equal((await decryptPush(welcome.init.body, receiver, authSecret)).title, 'Notifications activées');

  // Association Passcord : un jeton de boîte de réception est remis.
  const pair = (await request('/api/passcord/pair', { token, body: {} })).data;
  const phone = generateKeyPairSync('ed25519');
  const claimed = await request('/api/passcord/claim', {
    token,
    body: {
      id: pair.id, challenge: pair.challenge, name: 'iPhone', publicKey: phone.publicKey.export({ format: 'jwk' }),
      signature: sign(null, Buffer.from(`cord-pair-v1:${issuer}:${pair.id}:${pair.challenge}`), phone.privateKey).toString('base64url'),
    },
  });
  const { keyId, inboxToken } = claimed.data;
  assert.ok(inboxToken);
  const inbox = () => request('/api/passcord/inbox', { body: { keyId, token: inboxToken } });
  assert.equal((await request('/api/passcord/inbox', { body: { keyId, token: 'faux' } })).status, 403);
  assert.deepEqual((await inbox()).data.requests, []);

  // L'ordinateur envoie la demande à l'iPhone : nombre affiché, notification, boîte de réception.
  const login = (await request('/api/passcord/login', { body: {} })).data;
  const poll = { id: login.id, pollToken: login.pollToken };
  assert.equal((await request('/api/passcord/notify', { body: { ...poll, pollToken: 'x', email: 'luna@example.test' } })).status, 403);
  const before = pushes.length;
  const sent = await request('/api/passcord/notify', { body: { ...poll, email: 'LUNA@example.test' } });
  assert.match(sent.data.code, /^\d{2}$/);
  assert.equal(pushes.length, before + 1);
  const message = await decryptPush(pushes.at(-1).init.body, receiver, authSecret);
  assert.match(message.body, new RegExp(sent.data.code));
  assert.ok(message.url.startsWith('/?passcord=passcord%3A%2F%2Fcord%2Flogin'));
  // Adresse inconnue : même réponse, rien n'est envoyé.
  const other = (await request('/api/passcord/login', { body: {} })).data;
  const unknown = await request('/api/passcord/notify', { body: { id: other.id, pollToken: other.pollToken, email: 'personne@example.test' } });
  assert.match(unknown.data.code, /^\d{2}$/);
  assert.equal(pushes.length, before + 1);

  const [pending] = (await inbox()).data.requests;
  assert.equal(pending.id, login.id);
  assert.equal(pending.device, 'Safari · macOS');
  const link = new URL(pending.url);
  const choices = link.searchParams.get('choices').split(',');
  assert.equal(choices.length, 3);
  assert.ok(choices.includes(sent.data.code));
  assert.equal(link.searchParams.get('device'), 'Safari · macOS');
  const approval = {
    id: login.id, keyId,
    signature: sign(null, Buffer.from(`cord-login-v1:${issuer}:${login.id}:${link.searchParams.get('challenge')}`), phone.privateKey).toString('base64url'),
  };
  // Mauvais nombre : demande annulée, l'ordinateur l'apprend.
  const wrong = choices.find((n) => n !== sent.data.code);
  const refused = await request('/api/passcord/approve', { body: { ...approval, code: wrong } });
  assert.equal(refused.status, 403);
  assert.equal(refused.data.reason, 'wrong_code');
  const deniedPoll = await request('/api/passcord/poll', { body: poll });
  assert.equal(deniedPoll.status, 410);
  assert.equal(deniedPoll.data.reason, 'denied');

  // Nouvelle demande : bon nombre, la session s'ouvre.
  const second = (await request('/api/passcord/login', { body: {} })).data;
  const sent2 = await request('/api/passcord/notify', { body: { id: second.id, pollToken: second.pollToken, email: 'luna@example.test' } });
  const req2 = (await inbox()).data.requests.find((r) => r.id === second.id);
  const link2 = new URL(req2.url);
  const ok = await request('/api/passcord/approve', {
    body: { id: second.id, keyId, code: sent2.data.code, signature: sign(null, Buffer.from(`cord-login-v1:${issuer}:${second.id}:${link2.searchParams.get('challenge')}`), phone.privateKey).toString('base64url') },
  });
  assert.equal(ok.status, 200);
  assert.equal((await request('/api/passcord/poll', { body: { id: second.id, pollToken: second.pollToken } })).data.user.id, user.id);

  // Refus depuis l'iPhone (bouton « Ce n'est pas moi »).
  const third = (await request('/api/passcord/login', { body: {} })).data;
  await request('/api/passcord/notify', { body: { id: third.id, pollToken: third.pollToken, email: 'luna@example.test' } });
  assert.equal((await request('/api/passcord/deny', { body: { id: third.id, keyId, token: inboxToken } })).status, 200);
  assert.equal((await request('/api/passcord/poll', { body: { id: third.id, pollToken: third.pollToken } })).data.reason, 'denied');

  // Clé associée avant la boîte de réception : jeton obtenu contre une signature récente.
  const ts = Date.now();
  const fresh = await request('/api/passcord/inbox/token', { body: { keyId, ts, signature: sign(null, Buffer.from(`cord-inbox-v1:${issuer}:${keyId}:${ts}`), phone.privateKey).toString('base64url') } });
  assert.equal(fresh.status, 200);
  const old = ts - 600_000;
  assert.equal((await request('/api/passcord/inbox/token', { body: { keyId, ts: old, signature: sign(null, Buffer.from(`cord-inbox-v1:${issuer}:${keyId}:${old}`), phone.privateKey).toString('base64url') } })).status, 403);
  assert.equal((await request('/api/passcord/inbox', { body: { keyId, token: inboxToken } })).status, 403);
  assert.equal((await request('/api/passcord/inbox', { body: { keyId, token: fresh.data.token } })).status, 200);

  // Abonnement mort (410) : oublié.
  await request('/api/push/subscribe', { token, body: { endpoint: 'https://push.example/gone', keys } });
  const fourth = (await request('/api/passcord/login', { body: {} })).data;
  await request('/api/passcord/notify', { body: { id: fourth.id, pollToken: fourth.pollToken, email: 'luna@example.test' } });
  const before2 = pushes.length;
  const fifth = (await request('/api/passcord/login', { body: {} })).data;
  await request('/api/passcord/notify', { body: { id: fifth.id, pollToken: fifth.pollToken, email: 'luna@example.test' } });
  assert.equal(pushes.length - before2, 1);
});

test('new beta builds are announced once to testers; reminders, push devices and Passcord history', async (t) => {
  let build = 13;
  const source = { latest: async () => ({ build: `Build ${build}`, tag: `build-${build}`, publishedAt: '2026-09-27T16:00:00Z', assets: [] }) };
  const pushes = [];
  const pushFetch = async (url, init) => {
    pushes.push({ url, init });
    return new Response(null, { status: 201 });
  };
  const ctx = await setup(t, { admins: ['luna@example.test'], betaReleases: { passcord: source }, pushFetch });
  const { request, token: admin, sql } = ctx;
  const user = await tester(ctx, 'erin@example.test');
  const [key] = (await request('/api/admin/beta/keys', { token: admin, body: { count: 1 } })).data.keys;
  await request('/api/beta/redeem', { token: user, body: { code: key.code } });
  const inbox = async (token) => (await request('/api/notifications', { token })).data.items.filter((n) => n.app === 'passcord');

  // Premier build vu : point de départ, aucune annonce.
  await request('/api/beta/passcord', { token: user });
  assert.equal((await inbox(user)).length, 0);
  // Nouveau build : une annonce par testeur (et l'administration), une seule fois.
  build = 14;
  await Promise.all([request('/api/beta/passcord', { token: user }), request('/api/beta/passcord', { token: admin })]);
  await request('/api/beta/passcord', { token: user });
  const [announce] = await inbox(user);
  assert.match(announce.title, /Passcord Build 14 est disponible/);
  assert.equal((await inbox(user)).length, 1);
  assert.equal((await inbox(admin)).length, 1);

  // Rappel d'une app de la suite : dédoublonné par son étiquette.
  const reminder = { app: 'cordlauncher', title: 'Drivecord expire dans 5 h', body: 'Branche ton iPhone.', tag: 'expiry:drivecord:U1:123', url: '/#/apps' };
  assert.equal((await request('/api/me/notify', { token: user, body: reminder })).data.sent, true);
  assert.equal((await request('/api/me/notify', { token: user, body: reminder })).data.sent, false);
  assert.equal((await request('/api/me/notify', { token: user, body: { ...reminder, tag: 'autre', url: '//evil.test' } })).data.sent, true);
  const all = (await request('/api/notifications', { token: user })).data.items;
  assert.equal(all.filter((n) => n.title === reminder.title).length, 2);
  assert.equal(all.find((n) => n.title === reminder.title && n.url !== '/#/apps').url, null, 'lien externe refusé');

  // Appareils abonnés : listés dans le compte, retirables.
  const { createECDH } = await import('node:crypto');
  const receiver = createECDH('prime256v1');
  receiver.generateKeys();
  const keys = { p256dh: receiver.getPublicKey().toString('base64url'), auth: randomBytes(16).toString('base64url') };
  await request('/api/push/subscribe', { token: user, body: { endpoint: 'https://web.push.apple.com/device-1', keys } });
  const [device] = (await request('/api/account', { token: user })).data.pushDevices;
  assert.equal(device.service, 'web.push.apple.com');
  assert.equal((await request('/api/push/devices', { token: admin, body: { id: device.id }, method: 'DELETE' })).status, 200);
  assert.equal((await request('/api/account', { token: user })).data.pushDevices.length, 1, 'un autre compte ne peut pas le retirer');
  await request('/api/push/devices', { token: user, body: { id: device.id }, method: 'DELETE' });
  assert.equal((await request('/api/account', { token: user })).data.pushDevices.length, 0);

  // Historique Passcord : approuvée, refusée, mauvais nombre.
  const pair = (await request('/api/passcord/pair', { token: user, body: {} })).data;
  const phone = generateKeyPairSync('ed25519');
  const claimed = (await request('/api/passcord/claim', {
    token: user,
    body: { id: pair.id, challenge: pair.challenge, name: 'iPhone', publicKey: phone.publicKey.export({ format: 'jwk' }), signature: sign(null, Buffer.from(`cord-pair-v1:${issuer}:${pair.id}:${pair.challenge}`), phone.privateKey).toString('base64url') },
  })).data;
  const creds = { keyId: claimed.keyId, token: claimed.inboxToken };
  const ask = async () => {
    const login = (await request('/api/passcord/login', { body: {} })).data;
    const { code } = (await request('/api/passcord/notify', { body: { id: login.id, pollToken: login.pollToken, email: 'erin@example.test' } })).data;
    const url = new URL((await request('/api/passcord/inbox', { body: creds })).data.requests.find((r) => r.id === login.id).url);
    const signature = sign(null, Buffer.from(`cord-login-v1:${issuer}:${login.id}:${url.searchParams.get('challenge')}`), phone.privateKey).toString('base64url');
    return { login, code, choices: url.searchParams.get('choices').split(','), signature };
  };
  const a = await ask();
  await request('/api/passcord/approve', { body: { id: a.login.id, keyId: creds.keyId, code: a.code, signature: a.signature } });
  const b = await ask();
  await request('/api/passcord/deny', { body: { id: b.login.id, ...creds } });
  const c = await ask();
  await request('/api/passcord/approve', { body: { id: c.login.id, keyId: creds.keyId, code: c.choices.find((n) => n !== c.code), signature: c.signature } });
  const history = (await request('/api/passcord/history', { body: creds })).data.events;
  assert.deepEqual(history.map((e) => e.kind), ['passcord_wrong_code', 'passcord_denied', 'passcord_approved', 'passcord_paired']);
  assert.equal(history[0].device, 'Safari · macOS');
  assert.equal((await request('/api/passcord/history', { body: { ...creds, token: 'faux' } })).status, 403);
  void sql;
});
