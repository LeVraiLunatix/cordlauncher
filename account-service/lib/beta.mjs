import { randomBytes } from 'node:crypto';

/**
 * Bêtas fermées de la suite (aujourd'hui Passcord) : clés d'accès et
 * téléchargement des builds privés.
 *
 * Une clé ressemble à `PASS-7KQM-2XVD-9HRT` : préfixe du produit + 12
 * caractères d'un alphabet sans ambiguïté (ni 0/O, ni 1/I/L) = 60 bits. Seule
 * son empreinte est gardée en base : elle n'est montrée qu'une fois, à sa
 * création.
 */

export const BETA_PRODUCTS = {
  passcord: { name: 'Passcord', prefix: 'PASS' },
};

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function generateBetaCode(product) {
  const { prefix } = BETA_PRODUCTS[product];
  const chars = [];
  // Rejet des octets hors d'un multiple de la taille de l'alphabet : tirage uniforme.
  while (chars.length < 12) {
    for (const byte of randomBytes(16)) {
      if (byte < 248 && chars.length < 12) chars.push(ALPHABET[byte % ALPHABET.length]);
    }
  }
  const body = chars.join('');
  return `${prefix}-${body.slice(0, 4)}-${body.slice(4, 8)}-${body.slice(8)}`;
}

/**
 * Forme canonique d'une clé saisie : majuscules, sans espaces ni tirets.
 * Renvoie `{ product, body }` ou null. (0, 1, I, L et O n'existent pas dans
 * l'alphabet : une clé qui en contient est forcément mal recopiée.)
 */
export function normalizeBetaCode(input) {
  const raw = String(input ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  for (const [product, { prefix }] of Object.entries(BETA_PRODUCTS)) {
    if (!raw.startsWith(prefix)) continue;
    const body = raw.slice(prefix.length);
    if (body.length === 12 && [...body].every((c) => ALPHABET.includes(c))) return { product, body };
  }
  return null;
}

/**
 * Builds privés publiés dans les releases GitHub d'un dépôt privé. Le jeton
 * (lecture seule du contenu) reste côté serveur ; le client reçoit l'URL
 * temporaire signée que GitHub renvoie pour l'asset (valable quelques minutes).
 */
export function githubReleases({ token, repo, fetchImpl = fetch }) {
  if (!token || !repo) return null;
  const headers = { Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'cord-account' };
  let cache = null;
  async function latest() {
    if (cache && Date.now() - cache.at < 60_000) return cache.release;
    const response = await fetchImpl(`https://api.github.com/repos/${repo}/releases?per_page=10`, { headers: { ...headers, Accept: 'application/vnd.github+json' } });
    if (!response.ok) throw new Error(`GitHub ${response.status}`);
    const releases = await response.json();
    const release = releases.find((r) => !r.draft && r.assets?.some((a) => a.name.endsWith('.ipa')));
    if (!release) return null;
    const described = {
      build: release.name || release.tag_name,
      tag: release.tag_name,
      publishedAt: Date.parse(release.published_at) || null,
      assets: release.assets.filter((a) => a.name.endsWith('.ipa')).map((a) => ({ id: a.id, name: a.name, size: a.size, apiUrl: a.url })),
    };
    cache = { at: Date.now(), release: described };
    return described;
  }
  async function downloadUrl(asset) {
    const response = await fetchImpl(asset.apiUrl, { headers: { ...headers, Accept: 'application/octet-stream' }, redirect: 'manual' });
    const location = response.headers.get('location');
    if (response.status < 300 || response.status >= 400 || !location) throw new Error(`GitHub ${response.status}`);
    return location;
  }
  return { latest, downloadUrl };
}
