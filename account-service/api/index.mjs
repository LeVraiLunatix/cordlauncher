import { createService, migrate } from '../lib/service.mjs';
import { neonSql } from '../lib/db-neon.mjs';
import { readClients, readOidcKey, makeSendVerification } from '../lib/config.mjs';

/**
 * Point d'entrée serverless (Vercel). Tout le trafic de compte.cordsuite.app
 * y est routé (voir vercel.json). L'instance est mémorisée entre deux
 * invocations « chaudes » ; le schéma n'est appliqué qu'une fois.
 */

let ready;

function build() {
  const issuer = process.env.CORD_ISSUER;
  if (!issuer) throw new Error('CORD_ISSUER manquante.');
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL manquante.');
  return (async () => {
    const sql = await neonSql(connectionString);
    await migrate(sql);
    return createService({
      sql,
      issuer,
      clients: readClients(),
      sendVerification: makeSendVerification({ localDev: false }),
      oidcKey: readOidcKey(),
    });
  })();
}

export default async function handler(req, res) {
  try {
    ready ??= build();
    const { handle } = await ready;
    await handle(req, res);
  } catch (e) {
    // Une erreur de démarrage (config absente) ne doit pas fuiter de détails.
    ready = undefined;
    console.error('[cord-account] démarrage impossible :', e);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Service Compte Cord indisponible.' }));
  }
}
