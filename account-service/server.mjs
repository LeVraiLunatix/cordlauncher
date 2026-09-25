import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createService, migrate } from './lib/service.mjs';
import { pgliteSql } from './lib/db-pglite.mjs';
import { readClients, readOidcKey, readAdmins, makeSendMail, readBetaReleases } from './lib/config.mjs';

/**
 * Entrée de développement local : Postgres embarqué (PGlite) + serveur HTTP,
 * même code que la production (Neon sur Vercel). Sert à `npm run account:dev`.
 *
 * `CORD_DATABASE` = dossier de persistance PGlite (défaut : ./data/pg) ;
 * mettre `:memory:` pour repartir de zéro à chaque lancement.
 */
export async function startFromEnv() {
  const port = Number(process.env.PORT ?? 4319);
  const host = process.env.HOST ?? '127.0.0.1';
  const issuer = process.env.CORD_ISSUER ?? `http://127.0.0.1:${port}`;
  const localhost = ['127.0.0.1', 'localhost'].includes(new URL(issuer).hostname);

  const dbDir = process.env.CORD_DATABASE ?? fileURLToPath(new URL('./data/pg', import.meta.url));
  if (dbDir !== ':memory:') mkdirSync(dirname(resolve(dbDir)), { recursive: true });
  const sql = await pgliteSql(dbDir === ':memory:' ? undefined : dbDir);
  await migrate(sql);

  // En local sans CORD_OIDC_KEY : la clé de développement est gardée à côté de
  // la base, sinon chaque redémarrage invaliderait jetons et secrets 2FA.
  let oidcKey;
  const devKeyFile = dbDir === ':memory:' ? null : resolve(dirname(resolve(dbDir)), 'oidc-dev.pem');
  if (!process.env.CORD_OIDC_KEY && localhost && devKeyFile && existsSync(devKeyFile)) oidcKey = readFileSync(devKeyFile, 'utf8');
  else {
    oidcKey = readOidcKey({ allowEphemeral: localhost });
    if (!process.env.CORD_OIDC_KEY && devKeyFile) writeFileSync(devKeyFile, oidcKey, { mode: 0o600 });
  }

  const { handle } = createService({
    sql,
    issuer,
    clients: readClients(),
    sendMail: makeSendMail({ localDev: localhost }),
    admins: readAdmins(),
    betaReleases: readBetaReleases(),
    dataKey: process.env.CORD_DATA_KEY,
    oidcKey,
  });

  const server = http.createServer(handle);
  server.listen(port, host, () => console.log(`Compte Cord : ${issuer}`));
  return { server, close: () => new Promise((r) => server.close(r)) };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) startFromEnv();
