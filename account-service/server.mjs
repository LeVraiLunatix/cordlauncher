import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';
import { createService, migrate } from './lib/service.mjs';
import { pgliteSql } from './lib/db.mjs';
import { readClients, readOidcKey, makeSendVerification } from './lib/config.mjs';

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

  const { handle } = createService({
    sql,
    issuer,
    clients: readClients(),
    sendVerification: makeSendVerification({ localDev: localhost }),
    oidcKey: readOidcKey({ allowEphemeral: localhost }),
  });

  const server = http.createServer(handle);
  server.listen(port, host, () => console.log(`Compte Cord : ${issuer}`));
  return { server, close: () => new Promise((r) => server.close(r)) };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) startFromEnv();
