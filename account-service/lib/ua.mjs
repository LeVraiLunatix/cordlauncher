/** Décrit un appareil à partir de son User-Agent (aucune dépendance, best effort). */
export function describeDevice(ua = '') {
  ua = String(ua);
  let os = null;
  if (/iPhone|iPod/.test(ua)) os = 'iOS';
  else if (/iPad/.test(ua)) os = 'iPadOS';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/Windows NT/.test(ua)) os = 'Windows';
  else if (/Mac OS X|Macintosh/.test(ua)) os = 'macOS';
  else if (/CrOS/.test(ua)) os = 'ChromeOS';
  else if (/Linux|X11/.test(ua)) os = 'Linux';

  let browser = null;
  if (/Edg(e|A|iOS)?\//.test(ua)) browser = 'Edge';
  else if (/OPR\/|Opera/.test(ua)) browser = 'Opera';
  else if (/Firefox\/|FxiOS\//.test(ua)) browser = 'Firefox';
  else if (/SamsungBrowser\//.test(ua)) browser = 'Samsung Internet';
  else if (/Chrome\/|CriOS\//.test(ua)) browser = 'Chrome';
  else if (/Safari\//.test(ua) && /Version\//.test(ua)) browser = 'Safari';

  let kind = 'unknown';
  if (browser) kind = /iPad|Tablet/.test(ua) ? 'tablet' : /Mobile|iPhone|Android/.test(ua) ? 'mobile' : 'desktop';
  else if (/CFNetwork|Darwin/.test(ua)) { browser = 'App Cord'; kind = 'mobile'; os ??= 'iOS'; }
  else if (/okhttp/i.test(ua)) { browser = 'App Cord'; kind = 'mobile'; os ??= 'Android'; }
  else if (/reqwest|CordLauncher|Tauri/i.test(ua)) { browser = 'CordLauncher'; kind = 'desktop'; }
  else if (/node|undici|curl|python|go-http/i.test(ua)) { browser = 'Client API'; kind = 'api'; }

  const label = browser && os ? `${browser} · ${os}` : browser ?? os ?? 'Appareil inconnu';
  return { browser, os, kind, label };
}

/** Empreinte grossière (navigateur + système) pour repérer un nouvel appareil. */
export const deviceKey = (ua) => {
  const d = describeDevice(ua);
  return `${d.browser ?? '?'}|${d.os ?? '?'}`;
};
