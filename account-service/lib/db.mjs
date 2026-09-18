/**
 * Adaptateurs de base de données. Les deux exposent la même fonction
 * `sql(text, params) => Promise<row[]>`, en Postgres :
 *  - Neon en production (Vercel serverless) ;
 *  - PGlite en développement et pour les tests (Postgres en mémoire ou sur
 *    disque, sans serveur à installer).
 */

/** Neon (production). `DATABASE_URL` = chaîne de connexion Postgres. */
export async function neonSql(connectionString) {
  const { neon } = await import('@neondatabase/serverless');
  const client = neon(connectionString);
  return async (text, params = []) => {
    const result = await client.query(text, params);
    return Array.isArray(result) ? result : (result?.rows ?? []);
  };
}

/**
 * PGlite (développement / tests). `dir` = dossier de persistance, ou
 * `undefined` pour une base en mémoire (repartie de zéro à chaque démarrage).
 */
export async function pgliteSql(dir) {
  const { PGlite } = await import('@electric-sql/pglite');
  const db = new PGlite(dir);
  await db.waitReady;
  const sql = async (text, params = []) => {
    const result = await db.query(text, params);
    return result.rows ?? [];
  };
  sql.close = () => db.close();
  return sql;
}
