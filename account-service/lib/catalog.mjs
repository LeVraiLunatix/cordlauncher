/**
 * Les apps de la suite Cord, telles que le Compte Cord les présente (vitrine,
 * écran de consentement, apps connectées). Repris de cordsuite/src/lib/products.ts
 * — c'est lui qui fait foi : recaler ce tableau quand un statut y change.
 *
 * `status` : live (en ligne) | beta (en développement) | soon (à venir).
 * Les logos sont servis par le portail sous /assets/logos/<slug>.png.
 */
export const SUITE = [
  { slug: 'drivecord', name: 'Drivecord', status: 'live', tagline: 'Stockage sans limite', description: 'Ton cloud chiffré et sans plafond, monté sur des webhooks Discord.', url: 'https://drivecord.app', launch: 'https://drivecord.app/login?via=cord', accent: ['#6D64F2', '#C64BF1'] },
  { slug: 'sharecord', name: 'Sharecord', status: 'live', tagline: 'Fichiers éphémères', description: 'Partage des fichiers temporaires par lien, qui s’effacent tout seuls.', url: 'https://share.cordsuite.app', launch: 'https://share.cordsuite.app/dashboard', accent: ['#6D64F2', '#C64BF1'] },
  { slug: 'tunecord', name: 'Tunecord', status: 'live', tagline: 'Tes podcasts, hébergés', description: 'Héberge et diffuse tes podcasts : flux RSS et stats d’écoute.', url: 'https://tunecord.vercel.app', accent: ['#BD2F98', '#F65D63'] },
  { slug: 'passcord', name: 'Passcord', status: 'beta', tagline: 'Coffre à mots de passe', description: 'Gestionnaire chiffré de bout en bout pour l’iPhone — et ta clé Cord.', url: null, accent: ['#126A84', '#1CC3E0'] },
  { slug: 'notecord', name: 'Notecord', status: 'soon', tagline: 'Notes synchronisées', description: 'Des notes qui s’ouvrent vite et se chiffrent en silence.', url: null, accent: ['#EB981F', '#EF6327'] },
  { slug: 'linkcord', name: 'Linkcord', status: 'soon', tagline: 'Liens & page perso', description: 'Raccourcis de liens et page « tous mes liens » sans pistage.', url: null, accent: ['#19A684', '#37CC94'] },
  { slug: 'bentocord', name: 'Bentocord', status: 'soon', tagline: 'Profil façon bento', description: 'Une page de profil modulaire, façon grille bento.', url: null, accent: ['#F16C8E', '#F9A159'] },
  { slug: 'gocord', name: 'Gocord', status: 'soon', tagline: 'Go-links', description: 'Tape un mot, atterris sur le bon outil.', url: null, accent: ['#1E8FDC', '#1E61DC'] },
  { slug: 'quizcord', name: 'Quizcord', status: 'soon', tagline: 'Quiz & blind-tests', description: 'Quiz et blind-tests multijoueurs en temps réel.', url: null, accent: ['#F9B322', '#F16F38'] },
  { slug: 'budgetcord', name: 'Budgetcord', status: 'soon', tagline: 'Budget perso', description: 'Suivre son budget sans confier son historique bancaire.', url: null, accent: ['#1C9856', '#0C6340'] },
];

const bySlug = new Map(SUITE.map((app) => [app.slug, app]));

/**
 * Présentation publique d'un client OAuth : ce que `CORD_CLIENTS` déclare
 * (nom), enrichi par la fiche de la suite si l'identifiant correspond. Jamais
 * le secret ni la liste des adresses de retour.
 */
export function describeClient(clientId, client) {
  const app = bySlug.get(clientId);
  return {
    id: clientId,
    name: client?.name ?? app?.name ?? clientId,
    tagline: app?.tagline ?? null,
    description: client?.description ?? app?.description ?? null,
    url: client?.url ?? app?.url ?? null,
    accent: app?.accent ?? ['#6E58F0', '#B842EC'],
    logo: app ? `/assets/logos/${app.slug}.png` : null,
    firstParty: Boolean(app),
  };
}
