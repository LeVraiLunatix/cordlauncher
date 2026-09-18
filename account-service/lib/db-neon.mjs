/**
 * Adaptateur Neon (production, Vercel serverless).
 * `sql(text, params) => Promise<row[]>`, en Postgres. `DATABASE_URL` = chaîne
 * de connexion. C'est le SEUL adaptateur importé par la fonction serverless,
 * pour que PGlite (volumineux, dev/tests) n'y soit jamais embarqué.
 */
export async function neonSql(connectionString) {
  const { neon } = await import('@neondatabase/serverless');
  const client = neon(connectionString);
  return async (text, params = []) => {
    const result = await client.query(text, params);
    return Array.isArray(result) ? result : (result?.rows ?? []);
  };
}
