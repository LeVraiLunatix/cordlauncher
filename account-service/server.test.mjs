import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createHash, generateKeyPairSync, randomBytes, sign, createPublicKey, verify } from 'node:crypto';
import { createService, migrate } from './lib/service.mjs';
import { pgliteSql } from './lib/db-pglite.mjs';

const issuer = 'http://127.0.0.1:4319';
const oidcKey = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' },
}).privateKey;

/** Un service neuf (PGlite en mémoire) derrière un serveur HTTP éphémère. */
async function makeApp({ sendVerification, clients } = {}) {
  const sql = await pgliteSql(undefined);
  await migrate(sql);
  const { handle } = createService({ sql, issuer, clients, sendVerification, oidcKey });
  const server = http.createServer(handle);
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  return { server, close: () => new Promise((r) => server.close(r)) };
}

async function fixture(t) {
  let verification;
  const app = await makeApp({
    sendVerification: async (mail) => {
      verification = mail;
    },
    clients: {
      drivecord: { name: 'Drivecord', secret: 'test-client-secret', redirectUris: ['http://localhost:3000/api/auth/callback/cord'] },
    },
  });
  t.after(() => app.close());
  const base = `http://127.0.0.1:${app.server.address().port}`;
  async function request(path, { body, token, method = body ? 'POST' : 'GET', origin, ip } = {}) {
    const response = await fetch(base + path, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(origin ? { Origin: origin } : {}),
        ...(ip ? { 'X-Forwarded-For': ip } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    return { status: response.status, data: await response.json(), cookie: response.headers.get('set-cookie') };
  }
  const credentials = { name: 'Luna', email: 'luna@example.test', password: ' Un mot de passe Cord ' };
  const registered = await request('/api/register', { body: credentials });
  assert.equal(registered.status, 201);
  assert.equal(registered.data.user.emailVerified, false);
  await request('/api/email/send', { token: registered.data.token, body: {} });
  const verificationToken = new URL(verification.url).searchParams.get('verify');
  assert.equal((await request('/api/email/verify', { body: { token: verificationToken } })).status, 200);
  assert.equal((await request('/api/email/verify', { body: { token: verificationToken } })).status, 410);
  return { request, credentials, token: registered.data.token, user: registered.data.user, issuer };
}

test('account identity persists; wrong passwords, origins and expired sessions are refused', async (t) => {
  const { request, token, credentials, user } = await fixture(t);
  assert.match(user.id, /^cord_/);
  assert.equal((await request('/api/me', { token })).data.user.email, credentials.email);
  assert.equal((await request('/api/me')).status, 401);
  assert.equal((await request('/api/login', { body: { ...credentials, password: credentials.password.trim() } })).status, 401);
  const login = await request('/api/login', { body: credentials });
  assert.equal(login.status, 200);
  assert.equal(login.data.user.id, user.id);
  assert.match(login.cookie, /HttpOnly/);
  assert.equal((await request('/api/me', { token, method: 'PATCH', body: { name: 'Lunatix' } })).data.user.name, 'Lunatix');
  assert.equal((await request('/api/me', { token, origin: 'https://evil.example' })).status, 403);
  assert.equal((await request('/api/register', { body: credentials })).status, 409);
  assert.equal((await request('/api/logout', { token, body: {} })).status, 200);
  assert.equal((await request('/api/me', { token })).status, 401);
});

test('a member can delete their own account', async (t) => {
  const { request, credentials } = await fixture(t);
  const fresh = await request('/api/login', { body: credentials });
  const token = fresh.data.token;
  assert.equal((await request('/api/me', { token, method: 'DELETE', body: {} })).status, 200);
  assert.equal((await request('/api/me', { token })).status, 401, 'session invalidée');
  assert.equal((await request('/api/login', { body: credentials })).status, 401, 'compte supprimé');
});

test('Passcord pairing proves possession, prevents replay, supports login and revocation', async (t) => {
  const { request, token, user, issuer } = await fixture(t);
  const pair = (await request('/api/passcord/pair', { token, body: {} })).data;
  const { privateKey, publicKey } = generateKeyPairSync('ed25519');
  const key = publicKey.export({ format: 'jwk' });
  const claim = {
    id: pair.id,
    challenge: pair.challenge,
    name: 'iPhone',
    publicKey: key,
    signature: sign(null, Buffer.from(`cord-pair-v1:${issuer}:${pair.id}:${pair.challenge}`), privateKey).toString('base64url'),
  };
  assert.equal((await request('/api/passcord/claim', { body: claim })).status, 401);
  assert.equal((await request('/api/passcord/claim', { token, body: { ...claim, challenge: 'wrong' } })).status, 403);
  const claimed = await request('/api/passcord/claim', { token, body: claim });
  assert.equal(claimed.status, 200);
  assert.equal((await request('/api/passcord/claim', { token, body: claim })).status, 410);
  assert.equal((await request('/api/me', { token })).data.keys.length, 1);
  const login = (await request('/api/passcord/login', { body: {} })).data;
  const poll = { id: login.id, pollToken: login.pollToken };
  assert.equal((await request('/api/passcord/poll', { body: poll })).data.pending, true);
  assert.equal((await request('/api/passcord/poll', { body: { ...poll, pollToken: 'wrong' } })).status, 403);
  const approval = {
    id: login.id,
    keyId: claimed.data.keyId,
    signature: sign(null, Buffer.from(`cord-login-v1:${issuer}:${login.id}:${login.challenge}`), privateKey).toString('base64url'),
  };
  assert.equal((await request('/api/passcord/approve', { body: { ...approval, signature: claim.signature } })).status, 403);
  assert.equal((await request('/api/passcord/approve', { body: approval })).status, 200);
  assert.equal((await request('/api/passcord/approve', { body: approval })).status, 409);
  const result = await request('/api/passcord/poll', { body: poll });
  assert.equal(result.data.user.id, user.id);
  assert.equal((await request('/api/me', { token: result.data.token })).status, 200);
  assert.equal((await request('/api/passcord/poll', { body: poll })).status, 410);
  await request('/api/passcord/keys', { token, body: { id: claimed.data.keyId }, method: 'DELETE' });
  const next = (await request('/api/passcord/login', { body: {} })).data;
  const signature = sign(null, Buffer.from(`cord-login-v1:${issuer}:${next.id}:${next.challenge}`), privateKey).toString('base64url');
  assert.equal((await request('/api/passcord/approve', { body: { ...approval, id: next.id, signature } })).status, 403);
});

test('OIDC restricts redirects, requires PKCE, signs identity, and consumes codes once', async (t) => {
  const { request, token, user, issuer } = await fixture(t);
  const verifier = randomBytes(32).toString('base64url');
  const params = {
    client_id: 'drivecord',
    redirect_uri: 'http://localhost:3000/api/auth/callback/cord',
    scope: 'openid profile email',
    response_type: 'code',
    code_challenge_method: 'S256',
    code_challenge: createHash('sha256').update(verifier).digest('base64url'),
    state: 'browser-state',
    nonce: 'browser-nonce',
  };
  assert.equal((await request('/api/authorize', { body: params })).status, 401);
  assert.equal((await request('/api/authorize', { token, body: { ...params, redirect_uri: 'https://evil.example' } })).status, 400);
  assert.equal((await request('/api/authorize', { token, body: { ...params, code_challenge_method: 'plain' } })).status, 400);
  const authorization = await request('/api/authorize', { token, body: params });
  assert.equal(authorization.status, 200);
  const redirect = new URL(authorization.data.redirect);
  assert.equal(redirect.searchParams.get('state'), params.state);
  const grant = {
    client_id: 'drivecord',
    client_secret: 'test-client-secret',
    grant_type: 'authorization_code',
    redirect_uri: params.redirect_uri,
    code: redirect.searchParams.get('code'),
    code_verifier: verifier,
  };
  assert.equal((await request('/oauth/token', { body: { ...grant, client_secret: 'wrong' } })).status, 401);
  assert.equal((await request('/oauth/token', { body: { ...grant, code_verifier: 'x'.repeat(43) } })).status, 400);
  const result = await request('/oauth/token', { body: grant });
  assert.equal(result.status, 200);
  const parts = result.data.id_token.split('.');
  const claims = JSON.parse(Buffer.from(parts[1], 'base64url'));
  assert.equal(claims.sub, user.id);
  assert.equal(claims.iss, issuer);
  assert.equal(claims.aud, 'drivecord');
  assert.equal(claims.nonce, params.nonce);
  const keys = (await request('/.well-known/jwks.json')).data.keys;
  assert.ok(verify('RSA-SHA256', Buffer.from(`${parts[0]}.${parts[1]}`), createPublicKey({ key: keys[0], format: 'jwk' }), Buffer.from(parts[2], 'base64url')));
  assert.equal((await request('/oauth/userinfo', { token: result.data.access_token })).data.sub, user.id);
  assert.equal((await request('/api/me', { token: result.data.access_token })).status, 401, 'an app token cannot manage the Cord account');
  assert.equal((await request('/oauth/token', { body: grant })).status, 400);
});

test('rate limiting counts per client address from X-Forwarded-For', async (t) => {
  const { request } = await fixture(t);
  const attempt = (ip) => request('/api/login', { ip, body: { email: 'nobody@example.test', password: 'x' } });
  for (let i = 0; i < 20; i++) assert.equal((await attempt('203.0.113.7')).status, 401);
  assert.equal((await attempt('203.0.113.7')).status, 429, 'the noisy client is throttled');
  assert.equal((await attempt('198.51.100.9')).status, 401, 'another client is not');
});

test('readClients merges CORD_CLIENT_<ID> entries without overriding CORD_CLIENTS', async () => {
  const { readClients } = await import('./lib/config.mjs');
  const sharecord = { name: 'Sharecord', secret: 's', redirectUris: ['https://share.cordsuite.app/api/auth/callback/cord'] };
  const drivecord = { name: 'Drivecord', secret: 'd', redirectUris: ['https://drivecord.app/cb'] };
  const clients = readClients({ CORD_CLIENTS: JSON.stringify({ drivecord }), CORD_CLIENT_SHARECORD: JSON.stringify(sharecord) });
  assert.deepEqual(clients, { drivecord, sharecord });
  assert.deepEqual(readClients({ CORD_CLIENTS: JSON.stringify({ drivecord }), CORD_CLIENT_DRIVECORD: JSON.stringify({ ...drivecord, secret: 'x' }) }).drivecord, drivecord, 'jamais d’écrasement');
  assert.deepEqual(readClients({ CORD_CLIENTS: '{cassé', CORD_CLIENT_SHARECORD: '{cassé' }), {}, 'JSON invalide ignoré');
  assert.deepEqual(readClients({ CORD_CLIENT_SHARECORD: '{"secret":"s"}' }), {}, 'entrée incomplète ignorée');
});
