/**
 * Adaptateur PGlite (développement et tests) : Postgres en mémoire ou sur
 * disque, sans serveur à installer. Même dialecte SQL que Neon.
 * `dir` = dossier de persistance, ou `undefined` pour une base en mémoire.
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
