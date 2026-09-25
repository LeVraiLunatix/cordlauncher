/**
 * Décrit un appareil à partir de son User-Agent (aucune dépendance, best effort).
 *
 * Les apps de la suite s'annoncent par un jeton « Nom/version » en tête
 * (ex. `CordLauncher/0.1.0 (Windows 11)`, `Passcord/12 CFNetwork/… Darwin/…`) :
 * elles sont nommées et reçoivent leur logo (`app`), comme les navigateurs.
 */
const SUITE_APPS = {
  cordlauncher: { name: 'CordLauncher', logo: '/assets/icon-180.png', kind: 'desktop' },
  passcord: { name: 'Passcord', logo: '/assets/logos/passcord.png', kind: 'mobile' },
  drivecord: { name: 'Drivecord', logo: '/assets/logos/drivecord.png', kind: null },
  tunecord: { name: 'Tunecord', logo: '/assets/logos/tunecord.png', kind: null },
};

function detectOs(ua) {
  if (/iPhone|iPod/.test(ua)) return 'iOS';
  if (/iPad/.test(ua)) return 'iPadOS';
  if (/Android/.test(ua)) return 'Android';
  if (/Windows NT 10|Windows 1[01]/.test(ua)) return 'Windows';
  if (/Windows/.test(ua)) return 'Windows';
  if (/Mac OS X|Macintosh|macOS/.test(ua)) return 'macOS';
  if (/CFNetwork|Darwin/.test(ua)) return 'iOS';
  if (/CrOS/.test(ua)) return 'ChromeOS';
  if (/Linux|X11/.test(ua)) return 'Linux';
  return null;
}

export function describeDevice(ua = '') {
  ua = String(ua ?? '').trim();
  const os = detectOs(ua);

  // 1. Une app de la suite (jeton « Nom/version » n'importe où, en tête le plus souvent).
  const token = ua.match(/\b(CordLauncher|Passcord|Drivecord(?:[ -]?Desktop)?|Tunecord)\/[\w.\-]+/i)?.[1];
  if (token) {
    const slug = token.toLowerCase().replace(/[ -]?desktop$/, '');
    const app = SUITE_APPS[slug];
    const desktop = /desktop/i.test(token) || ['Windows', 'macOS', 'Linux'].includes(os);
    const kind = app.kind ?? (desktop ? 'desktop' : 'mobile');
    return { browser: app.name, os, kind, label: os ? `${app.name} · ${os}` : app.name, app: slug, logo: app.logo };
  }

  // 2. Un navigateur.
  let browser = null;
  if (/Edg(e|A|iOS)?\//.test(ua)) browser = 'Edge';
  else if (/OPR\/|Opera/.test(ua)) browser = 'Opera';
  else if (/Firefox\/|FxiOS\//.test(ua)) browser = 'Firefox';
  else if (/SamsungBrowser\//.test(ua)) browser = 'Samsung Internet';
  else if (/Chrome\/|CriOS\//.test(ua)) browser = 'Chrome';
  else if (/Safari\//.test(ua) && /Version\//.test(ua)) browser = 'Safari';
  if (browser) {
    const kind = /iPad|Tablet/.test(ua) ? 'tablet' : /Mobile|iPhone|Android/.test(ua) ? 'mobile' : 'desktop';
    return { browser, os, kind, label: os ? `${browser} · ${os}` : browser, app: null, logo: null };
  }

  // 3. Clients reconnaissables sans nom d'app.
  if (/Tauri|reqwest/i.test(ua)) return { browser: 'Application Windows', os: os ?? 'Windows', kind: 'desktop', label: `Application Cord · ${os ?? 'Windows'}`, app: null, logo: null };
  if (/CFNetwork|Darwin/.test(ua)) {
    const name = ua.match(/^([A-Za-z][\w .-]{1,30}?)\/\d/)?.[1];
    return { browser: name ?? 'App iPhone', os: 'iOS', kind: 'mobile', label: `${name ?? 'App iPhone'} · iOS`, app: null, logo: null };
  }
  if (/okhttp/i.test(ua)) return { browser: 'App Android', os: 'Android', kind: 'mobile', label: 'App Android', app: null, logo: null };
  if (/node|undici|curl|python|go-http|axios/i.test(ua)) return { browser: 'Client API', os, kind: 'api', label: 'Script ou client API', app: null, logo: null };

  return { browser: null, os, kind: 'unknown', label: os ? `Appareil ${os}` : 'Appareil inconnu', app: null, logo: null };
}

/** Empreinte grossière (navigateur ou app + système) pour repérer un nouvel appareil. */
export const deviceKey = (ua) => {
  const d = describeDevice(ua);
  return `${d.browser ?? '?'}|${d.os ?? '?'}`;
};
