// Portail Compte Cord, embarqué en chaînes pour être servi par la fonction
// serverless (aucun fichier statique exposé). Source : dossier portal/ —
// régénérer avec `npm run portal` après une modification.
export const PORTAL_VERSION = "195bbea2f16f";

export const PORTAL_HTML = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Compte Cord</title>
<meta name="description" content="Compte Cord : une seule identité pour toute la suite Cord — Drivecord, Passcord, Tunecord et les suivantes. Connexion par Passcord, passkeys et double authentification.">
<meta name="theme-color" content="#08070f" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#f4f2fb" media="(prefers-color-scheme: light)">
<meta name="color-scheme" content="dark light">
<meta name="referrer" content="no-referrer">
<meta property="og:title" content="Compte Cord">
<meta property="og:description" content="Un compte. Toute la suite Cord.">
<link rel="icon" href="/assets/icon-32.png" type="image/png">
<link rel="apple-touch-icon" href="/assets/icon-180.png">
<link rel="preload" href="/assets/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/space-grotesk.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/portal.css?v=195bbea2f16f">
<script type="module" src="/portal.js?v=195bbea2f16f"></script>
</head>
<body>
<svg xmlns="http://www.w3.org/2000/svg" class="sprite" aria-hidden="true" focusable="false"><symbol id="i-activity" viewBox="0 0 24 24"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" /></symbol><symbol id="i-app-window" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M10 4v4" /><path d="M2 8h20" /><path d="M6 4v4" /></symbol><symbol id="i-arrow-left" viewBox="0 0 24 24"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></symbol><symbol id="i-arrow-right" viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></symbol><symbol id="i-arrow-up-right" viewBox="0 0 24 24"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></symbol><symbol id="i-at-sign" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" /></symbol><symbol id="i-badge-check" viewBox="0 0 24 24"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><path d="m16 9-5.5 5.5L8 12" /></symbol><symbol id="i-ban" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M4.929 4.929 19.07 19.071" /></symbol><symbol id="i-bell-dot" viewBox="0 0 24 24"><path d="M10.268 21a2 2 0 0 0 3.464 0" /><path d="M11.68 2.009A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673c-.824-.85-1.678-1.731-2.21-3.348" /><circle cx="18" cy="5" r="3" /></symbol><symbol id="i-bell-off" viewBox="0 0 24 24"><path d="M10.268 21a2 2 0 0 0 3.464 0" /><path d="M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742" /><path d="m2 2 20 20" /><path d="M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05" /></symbol><symbol id="i-bell" viewBox="0 0 24 24"><path d="M10.268 21a2 2 0 0 0 3.464 0" /><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" /></symbol><symbol id="i-camera" viewBox="0 0 24 24"><path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" /><circle cx="12" cy="13" r="3" /></symbol><symbol id="i-chart-column" viewBox="0 0 24 24"><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></symbol><symbol id="i-check-check" viewBox="0 0 24 24"><path d="M18 6 7 17l-5-5" /><path d="m22 10-7.5 7.5L13 16" /></symbol><symbol id="i-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></symbol><symbol id="i-chevron-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></symbol><symbol id="i-chevron-right" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></symbol><symbol id="i-circle-alert" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></symbol><symbol id="i-circle-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="m16 9-5.5 5.5L8 12" /></symbol><symbol id="i-circle-help" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></symbol><symbol id="i-circle-x" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></symbol><symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></symbol><symbol id="i-cloud" viewBox="0 0 24 24"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /></symbol><symbol id="i-command" viewBox="0 0 24 24"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" /></symbol><symbol id="i-copy" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></symbol><symbol id="i-corner-down-left" viewBox="0 0 24 24"><path d="M20 4v7a4 4 0 0 1-4 4H4" /><path d="m9 10-5 5 5 5" /></symbol><symbol id="i-cpu" viewBox="0 0 24 24"><path d="M12 20v2" /><path d="M12 2v2" /><path d="M17 20v2" /><path d="M17 2v2" /><path d="M2 12h2" /><path d="M2 17h2" /><path d="M2 7h2" /><path d="M20 12h2" /><path d="M20 17h2" /><path d="M20 7h2" /><path d="M7 20v2" /><path d="M7 2v2" /><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="8" y="8" width="8" height="8" rx="1" /></symbol><symbol id="i-database" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></symbol><symbol id="i-download" viewBox="0 0 24 24"><path d="M12 15V3" /><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /></symbol><symbol id="i-ellipsis" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></symbol><symbol id="i-external-link" viewBox="0 0 24 24"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></symbol><symbol id="i-eye-off" viewBox="0 0 24 24"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" /></symbol><symbol id="i-eye" viewBox="0 0 24 24"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></symbol><symbol id="i-file-json" viewBox="0 0 24 24"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" /><path d="M14 2v5a1 1 0 0 0 1 1h5" /><path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1" /><path d="M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1" /></symbol><symbol id="i-fingerprint-pattern" viewBox="0 0 24 24"><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" /><path d="M14 13.12c0 2.38 0 6.38-1 8.88" /><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" /><path d="M2 12a10 10 0 0 1 18-6" /><path d="M2 16h.01" /><path d="M21.8 16c.2-2 .131-5.354 0-6" /><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" /><path d="M8.65 22c.21-.66.45-1.32.57-2" /><path d="M9 6.8a6 6 0 0 1 9 5.2v2" /></symbol><symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></symbol><symbol id="i-hard-drive" viewBox="0 0 24 24"><path d="M10 16h.01" /><path d="M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /><path d="M21.946 12.013H2.054" /><path d="M6 16h.01" /></symbol><symbol id="i-history" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></symbol><symbol id="i-house" viewBox="0 0 24 24"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></symbol><symbol id="i-id-card" viewBox="0 0 24 24"><path d="M13 19a4 4 0 00-8 0" /><path d="M16 10h2" /><path d="M16 14h2" /><circle cx="9" cy="12" r="3" /><rect x="2" y="5" width="20" height="14" rx="2" /></symbol><symbol id="i-inbox" viewBox="0 0 24 24"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></symbol><symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></symbol><symbol id="i-key-round" viewBox="0 0 24 24"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" /><circle cx="16.5" cy="7.5" r=".5" fill="currentColor" /></symbol><symbol id="i-key" viewBox="0 0 24 24"><path d="m2 21 9.6-9.6" /><path d="m7.5 15.5 2.3 2.3a1 1 0 0 1 0 1.4l-2.1 2.1a1 1 0 0 1-1.4 0L4 19" /><circle cx="15.5" cy="7.5" r="5.5" /></symbol><symbol id="i-keyboard" viewBox="0 0 24 24"><path d="M10 8h.01" /><path d="M12 12h.01" /><path d="M14 8h.01" /><path d="M16 12h.01" /><path d="M18 8h.01" /><path d="M6 8h.01" /><path d="M7 16h10" /><path d="M8 12h.01" /><rect width="20" height="16" x="2" y="4" rx="2" /></symbol><symbol id="i-languages" viewBox="0 0 24 24"><path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" /></symbol><symbol id="i-laptop" viewBox="0 0 24 24"><path d="M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z" /><path d="M20.054 15.987H3.946" /></symbol><symbol id="i-layout-dashboard" viewBox="0 0 24 24"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></symbol><symbol id="i-layout-grid" viewBox="0 0 24 24"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></symbol><symbol id="i-link-2" viewBox="0 0 24 24"><path d="M9 17H7A5 5 0 0 1 7 7h2" /><path d="M15 7h2a5 5 0 1 1 0 10h-2" /><line x1="8" x2="16" y1="12" y2="12" /></symbol><symbol id="i-lock-keyhole" viewBox="0 0 24 24"><circle cx="12" cy="16" r="1" /><rect x="3" y="10" width="18" height="12" rx="2" /><path d="M7 10V7a5 5 0 0 1 10 0v3" /></symbol><symbol id="i-lock" viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></symbol><symbol id="i-log-in" viewBox="0 0 24 24"><path d="m10 17 5-5-5-5" /><path d="M15 12H3" /><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /></symbol><symbol id="i-log-out" viewBox="0 0 24 24"><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /></symbol><symbol id="i-mail-check" viewBox="0 0 24 24"><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /><path d="m16 19 2 2 4-4" /></symbol><symbol id="i-mail" viewBox="0 0 24 24"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></symbol><symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 5h16" /><path d="M4 12h16" /><path d="M4 19h16" /></symbol><symbol id="i-monitor-smartphone" viewBox="0 0 24 24"><path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8" /><path d="M10 19v-3.96 3.15" /><path d="M7 19h5" /><rect width="6" height="10" x="16" y="12" rx="2" /></symbol><symbol id="i-monitor" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></symbol><symbol id="i-moon" viewBox="0 0 24 24"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></symbol><symbol id="i-orbit" viewBox="0 0 24 24"><path d="M20.341 6.484A10 10 0 0 1 10.266 21.85" /><path d="M3.659 17.516A10 10 0 0 1 13.74 2.152" /><circle cx="12" cy="12" r="3" /><circle cx="19" cy="5" r="2" /><circle cx="5" cy="19" r="2" /></symbol><symbol id="i-palette" viewBox="0 0 24 24"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" /><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /></symbol><symbol id="i-party-popper" viewBox="0 0 24 24"><path d="M5.8 11.3 2 22l10.7-3.79" /><path d="M4 3h.01" /><path d="M22 8h.01" /><path d="M15 2h.01" /><path d="M22 20h.01" /><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" /><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17" /><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7" /><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z" /></symbol><symbol id="i-pencil" viewBox="0 0 24 24"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></symbol><symbol id="i-plus" viewBox="0 0 24 24"><path d="M5 12h14" /><path d="M12 5v14" /></symbol><symbol id="i-podcast" viewBox="0 0 24 24"><path d="M12 17v4" /><path d="M18 11a6 6 0 00-3-5.197" /><path d="M2 11a10 10 0 015-8.662" /><path d="M22 11a10 10 0 00-5-8.662" /><path d="M6 11a6 6 0 013-5.197" /><path d="M9 21h6" /><rect x="10" y="9" width="4" height="8" rx="2" /></symbol><symbol id="i-qr-code" viewBox="0 0 24 24"><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" /></symbol><symbol id="i-refresh-cw" viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></symbol><symbol id="i-rocket" viewBox="0 0 24 24"><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09" /><path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05" /></symbol><symbol id="i-rotate-ccw" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></symbol><symbol id="i-scan-face" viewBox="0 0 24 24"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><path d="M9 9h.01" /><path d="M15 9h.01" /></symbol><symbol id="i-search" viewBox="0 0 24 24"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></symbol><symbol id="i-send" viewBox="0 0 24 24"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></symbol><symbol id="i-server" viewBox="0 0 24 24"><rect width="20" height="8" x="2" y="2" rx="2" ry="2" /><rect width="20" height="8" x="2" y="14" rx="2" ry="2" /><line x1="6" x2="6.01" y1="6" y2="6" /><line x1="6" x2="6.01" y1="18" y2="18" /></symbol><symbol id="i-settings" viewBox="0 0 24 24"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /><circle cx="12" cy="12" r="3" /></symbol><symbol id="i-shield-alert" viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="M12 8v4" /><path d="M12 16h.01" /></symbol><symbol id="i-shield-check" viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></symbol><symbol id="i-shield" viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></symbol><symbol id="i-sliders-horizontal" viewBox="0 0 24 24"><path d="M10 5H3" /><path d="M12 19H3" /><path d="M14 3v4" /><path d="M16 17v4" /><path d="M21 12h-9" /><path d="M21 19h-5" /><path d="M21 5h-7" /><path d="M8 10v4" /><path d="M8 12H3" /></symbol><symbol id="i-smartphone" viewBox="0 0 24 24"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></symbol><symbol id="i-sparkles" viewBox="0 0 24 24"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /><path d="M20 2v4" /><path d="M22 4h-4" /><circle cx="4" cy="20" r="2" /></symbol><symbol id="i-sun-moon" viewBox="0 0 24 24"><path d="M12 2v2" /><path d="M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715" /><path d="M16 12a4 4 0 0 0-4-4" /><path d="m19 5-1.256 1.256" /><path d="M20 12h2" /></symbol><symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></symbol><symbol id="i-tablet-smartphone" viewBox="0 0 24 24"><rect width="10" height="14" x="3" y="8" rx="2" /><path d="M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4" /><path d="M8 18h.01" /></symbol><symbol id="i-trash-2" viewBox="0 0 24 24"><path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></symbol><symbol id="i-triangle-alert" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" /></symbol><symbol id="i-upload" viewBox="0 0 24 24"><path d="M12 3v12" /><path d="m17 8-5-5-5 5" /><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /></symbol><symbol id="i-user-check" viewBox="0 0 24 24"><path d="m16 11 2 2 4-4" /><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></symbol><symbol id="i-user-round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></symbol><symbol id="i-user" viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></symbol><symbol id="i-users" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path d="M16 3.128a4 4 0 0 1 0 7.744" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" /></symbol><symbol id="i-wand-sparkles" viewBox="0 0 24 24"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" /><path d="m14 7 3 3" /><path d="M5 6v4" /><path d="M19 14v4" /><path d="M10 2v2" /><path d="M7 8H3" /><path d="M21 16h-4" /><path d="M11 3H9" /></symbol><symbol id="i-x" viewBox="0 0 24 24"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></symbol><symbol id="i-zap" viewBox="0 0 24 24"><path d="M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z" /></symbol></svg>
<a class="skip-link" href="#main">Aller au contenu</a>
<div class="backdrop" aria-hidden="true">
  <div class="orb orb-a"></div>
  <div class="orb orb-b"></div>
  <div class="orb orb-c"></div>
  <div class="orb orb-d"></div>
  <div class="backdrop-grid"></div>
  <div class="grain"></div>
</div>
<div id="app" class="app" aria-busy="true">
  <div class="boot" role="progressbar" aria-label="Chargement du Compte Cord">
    <img class="boot-mark" src="/assets/icon-180.png" alt="" width="64" height="64">
    <span class="boot-bar"><span></span></span>
  </div>
</div>
<div id="toasts" class="toasts" role="status" aria-live="polite" aria-atomic="false"></div>
<noscript><div class="noscript">Le Compte Cord a besoin de JavaScript pour fonctionner.</div></noscript>
</body>
</html>
`;

export const PORTAL_JS = `// Portail Compte Cord — généré par scripts/gen-portal.cjs, ne pas éditer.
// vendor/qrcode.js
//---------------------------------------------------------------------
//
// QR Code Generator for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//
// The word 'QR Code' is registered trademark of
// DENSO WAVE INCORPORATED
//  http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------

//---------------------------------------------------------------------
// qrcode
//---------------------------------------------------------------------

/**
 * qrcode
 * @param typeNumber 1 to 40
 * @param errorCorrectionLevel 'L','M','Q','H'
 */
const qrcode = function(typeNumber, errorCorrectionLevel) {

  const PAD0 = 0xEC;
  const PAD1 = 0x11;

  let _typeNumber = typeNumber;
  const _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
  let _modules = null;
  let _moduleCount = 0;
  let _dataCache = null;
  const _dataList = [];

  const _this = {};

  const makeImpl = function(test, maskPattern) {

    _moduleCount = _typeNumber * 4 + 17;
    _modules = function(moduleCount) {
      const modules = new Array(moduleCount);
      for (let row = 0; row < moduleCount; row += 1) {
        modules[row] = new Array(moduleCount);
        for (let col = 0; col < moduleCount; col += 1) {
          modules[row][col] = null;
        }
      }
      return modules;
    }(_moduleCount);

    setupPositionProbePattern(0, 0);
    setupPositionProbePattern(_moduleCount - 7, 0);
    setupPositionProbePattern(0, _moduleCount - 7);
    setupPositionAdjustPattern();
    setupTimingPattern();
    setupTypeInfo(test, maskPattern);

    if (_typeNumber >= 7) {
      setupTypeNumber(test);
    }

    if (_dataCache == null) {
      _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
    }

    mapData(_dataCache, maskPattern);
  };

  const setupPositionProbePattern = function(row, col) {

    for (let r = -1; r <= 7; r += 1) {

      if (row + r <= -1 || _moduleCount <= row + r) continue;

      for (let c = -1; c <= 7; c += 1) {

        if (col + c <= -1 || _moduleCount <= col + c) continue;

        if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
            || (0 <= c && c <= 6 && (r == 0 || r == 6) )
            || (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
          _modules[row + r][col + c] = true;
        } else {
          _modules[row + r][col + c] = false;
        }
      }
    }
  };

  const getBestMaskPattern = function() {

    let minLostPoint = 0;
    let pattern = 0;

    for (let i = 0; i < 8; i += 1) {

      makeImpl(true, i);

      const lostPoint = QRUtil.getLostPoint(_this);

      if (i == 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint;
        pattern = i;
      }
    }

    return pattern;
  };

  const setupTimingPattern = function() {

    for (let r = 8; r < _moduleCount - 8; r += 1) {
      if (_modules[r][6] != null) {
        continue;
      }
      _modules[r][6] = (r % 2 == 0);
    }

    for (let c = 8; c < _moduleCount - 8; c += 1) {
      if (_modules[6][c] != null) {
        continue;
      }
      _modules[6][c] = (c % 2 == 0);
    }
  };

  const setupPositionAdjustPattern = function() {

    const pos = QRUtil.getPatternPosition(_typeNumber);

    for (let i = 0; i < pos.length; i += 1) {

      for (let j = 0; j < pos.length; j += 1) {

        const row = pos[i];
        const col = pos[j];

        if (_modules[row][col] != null) {
          continue;
        }

        for (let r = -2; r <= 2; r += 1) {

          for (let c = -2; c <= 2; c += 1) {

            if (r == -2 || r == 2 || c == -2 || c == 2
                || (r == 0 && c == 0) ) {
              _modules[row + r][col + c] = true;
            } else {
              _modules[row + r][col + c] = false;
            }
          }
        }
      }
    }
  };

  const setupTypeNumber = function(test) {

    const bits = QRUtil.getBCHTypeNumber(_typeNumber);

    for (let i = 0; i < 18; i += 1) {
      const mod = (!test && ( (bits >> i) & 1) == 1);
      _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
    }

    for (let i = 0; i < 18; i += 1) {
      const mod = (!test && ( (bits >> i) & 1) == 1);
      _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
    }
  };

  const setupTypeInfo = function(test, maskPattern) {

    const data = (_errorCorrectionLevel << 3) | maskPattern;
    const bits = QRUtil.getBCHTypeInfo(data);

    // vertical
    for (let i = 0; i < 15; i += 1) {

      const mod = (!test && ( (bits >> i) & 1) == 1);

      if (i < 6) {
        _modules[i][8] = mod;
      } else if (i < 8) {
        _modules[i + 1][8] = mod;
      } else {
        _modules[_moduleCount - 15 + i][8] = mod;
      }
    }

    // horizontal
    for (let i = 0; i < 15; i += 1) {

      const mod = (!test && ( (bits >> i) & 1) == 1);

      if (i < 8) {
        _modules[8][_moduleCount - i - 1] = mod;
      } else if (i < 9) {
        _modules[8][15 - i - 1 + 1] = mod;
      } else {
        _modules[8][15 - i - 1] = mod;
      }
    }

    // fixed module
    _modules[_moduleCount - 8][8] = (!test);
  };

  const mapData = function(data, maskPattern) {

    let inc = -1;
    let row = _moduleCount - 1;
    let bitIndex = 7;
    let byteIndex = 0;
    const maskFunc = QRUtil.getMaskFunction(maskPattern);

    for (let col = _moduleCount - 1; col > 0; col -= 2) {

      if (col == 6) col -= 1;

      while (true) {

        for (let c = 0; c < 2; c += 1) {

          if (_modules[row][col - c] == null) {

            let dark = false;

            if (byteIndex < data.length) {
              dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
            }

            const mask = maskFunc(row, col - c);

            if (mask) {
              dark = !dark;
            }

            _modules[row][col - c] = dark;
            bitIndex -= 1;

            if (bitIndex == -1) {
              byteIndex += 1;
              bitIndex = 7;
            }
          }
        }

        row += inc;

        if (row < 0 || _moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  };

  const createBytes = function(buffer, rsBlocks) {

    let offset = 0;

    let maxDcCount = 0;
    let maxEcCount = 0;

    const dcdata = new Array(rsBlocks.length);
    const ecdata = new Array(rsBlocks.length);

    for (let r = 0; r < rsBlocks.length; r += 1) {

      const dcCount = rsBlocks[r].dataCount;
      const ecCount = rsBlocks[r].totalCount - dcCount;

      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);

      dcdata[r] = new Array(dcCount);

      for (let i = 0; i < dcdata[r].length; i += 1) {
        dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
      }
      offset += dcCount;

      const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
      const rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);

      const modPoly = rawPoly.mod(rsPoly);
      ecdata[r] = new Array(rsPoly.getLength() - 1);
      for (let i = 0; i < ecdata[r].length; i += 1) {
        const modIndex = i + modPoly.getLength() - ecdata[r].length;
        ecdata[r][i] = (modIndex >= 0)? modPoly.getAt(modIndex) : 0;
      }
    }

    let totalCodeCount = 0;
    for (let i = 0; i < rsBlocks.length; i += 1) {
      totalCodeCount += rsBlocks[i].totalCount;
    }

    const data = new Array(totalCodeCount);
    let index = 0;

    for (let i = 0; i < maxDcCount; i += 1) {
      for (let r = 0; r < rsBlocks.length; r += 1) {
        if (i < dcdata[r].length) {
          data[index] = dcdata[r][i];
          index += 1;
        }
      }
    }

    for (let i = 0; i < maxEcCount; i += 1) {
      for (let r = 0; r < rsBlocks.length; r += 1) {
        if (i < ecdata[r].length) {
          data[index] = ecdata[r][i];
          index += 1;
        }
      }
    }

    return data;
  };

  const createData = function(typeNumber, errorCorrectionLevel, dataList) {

    const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);

    const buffer = qrBitBuffer();

    for (let i = 0; i < dataList.length; i += 1) {
      const data = dataList[i];
      buffer.put(data.getMode(), 4);
      buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
      data.write(buffer);
    }

    // calc num max data.
    let totalDataCount = 0;
    for (let i = 0; i < rsBlocks.length; i += 1) {
      totalDataCount += rsBlocks[i].dataCount;
    }

    if (buffer.getLengthInBits() > totalDataCount * 8) {
      throw 'code length overflow. ('
        + buffer.getLengthInBits()
        + '>'
        + totalDataCount * 8
        + ')';
    }

    // end code
    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
      buffer.put(0, 4);
    }

    // padding
    while (buffer.getLengthInBits() % 8 != 0) {
      buffer.putBit(false);
    }

    // padding
    while (true) {

      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(PAD0, 8);

      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(PAD1, 8);
    }

    return createBytes(buffer, rsBlocks);
  };

  _this.addData = function(data, mode) {

    mode = mode || 'Byte';

    let newData = null;

    switch(mode) {
    case 'Numeric' :
      newData = qrNumber(data);
      break;
    case 'Alphanumeric' :
      newData = qrAlphaNum(data);
      break;
    case 'Byte' :
      newData = qr8BitByte(data);
      break;
    case 'Kanji' :
      newData = qrKanji(data);
      break;
    default :
      throw 'mode:' + mode;
    }

    _dataList.push(newData);
    _dataCache = null;
  };

  _this.isDark = function(row, col) {
    if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
      throw row + ',' + col;
    }
    return _modules[row][col];
  };

  _this.getModuleCount = function() {
    return _moduleCount;
  };

  _this.make = function() {
    if (_typeNumber < 1) {
      let typeNumber = 1;

      for (; typeNumber < 40; typeNumber++) {
        const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, _errorCorrectionLevel);
        const buffer = qrBitBuffer();

        for (let i = 0; i < _dataList.length; i++) {
          const data = _dataList[i];
          buffer.put(data.getMode(), 4);
          buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
          data.write(buffer);
        }

        let totalDataCount = 0;
        for (let i = 0; i < rsBlocks.length; i++) {
          totalDataCount += rsBlocks[i].dataCount;
        }

        if (buffer.getLengthInBits() <= totalDataCount * 8) {
          break;
        }
      }

      _typeNumber = typeNumber;
    }

    makeImpl(false, getBestMaskPattern() );
  };

  _this.createTableTag = function(cellSize, margin) {

    cellSize = cellSize || 2;
    margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

    let qrHtml = '';

    qrHtml += '<table style="';
    qrHtml += ' border-width: 0px; border-style: none;';
    qrHtml += ' border-collapse: collapse;';
    qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
    qrHtml += '">';
    qrHtml += '<tbody>';

    for (let r = 0; r < _this.getModuleCount(); r += 1) {

      qrHtml += '<tr>';

      for (let c = 0; c < _this.getModuleCount(); c += 1) {
        qrHtml += '<td style="';
        qrHtml += ' border-width: 0px; border-style: none;';
        qrHtml += ' border-collapse: collapse;';
        qrHtml += ' padding: 0px; margin: 0px;';
        qrHtml += ' width: ' + cellSize + 'px;';
        qrHtml += ' height: ' + cellSize + 'px;';
        qrHtml += ' background-color: ';
        qrHtml += _this.isDark(r, c)? '#000000' : '#ffffff';
        qrHtml += ';';
        qrHtml += '"/>';
      }

      qrHtml += '</tr>';
    }

    qrHtml += '</tbody>';
    qrHtml += '</table>';

    return qrHtml;
  };

  _this.createSvgTag = function(cellSize, margin, alt, title) {

    let opts = {};
    if (typeof arguments[0] == 'object') {
      // Called by options.
      opts = arguments[0];
      // overwrite cellSize and margin.
      cellSize = opts.cellSize;
      margin = opts.margin;
      alt = opts.alt;
      title = opts.title;
    }

    cellSize = cellSize || 2;
    margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

    // Compose alt property surrogate
    alt = (typeof alt === 'string') ? {text: alt} : alt || {};
    alt.text = alt.text || null;
    alt.id = (alt.text) ? alt.id || 'qrcode-description' : null;

    // Compose title property surrogate
    title = (typeof title === 'string') ? {text: title} : title || {};
    title.text = title.text || null;
    title.id = (title.text) ? title.id || 'qrcode-title' : null;

    const size = _this.getModuleCount() * cellSize + margin * 2;
    let c, mc, r, mr, qrSvg='', rect;

    rect = 'l' + cellSize + ',0 0,' + cellSize +
      ' -' + cellSize + ',0 0,-' + cellSize + 'z ';

    qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
    qrSvg += !opts.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : '';
    qrSvg += ' viewBox="0 0 ' + size + ' ' + size + '" ';
    qrSvg += ' preserveAspectRatio="xMinYMin meet"';
    qrSvg += (title.text || alt.text) ? ' role="img" aria-labelledby="' +
        escapeXml([title.id, alt.id].join(' ').trim() ) + '"' : '';
    qrSvg += '>';
    qrSvg += (title.text) ? '<title id="' + escapeXml(title.id) + '">' +
        escapeXml(title.text) + '</title>' : '';
    qrSvg += (alt.text) ? '<description id="' + escapeXml(alt.id) + '">' +
        escapeXml(alt.text) + '</description>' : '';
    qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
    qrSvg += '<path d="';

    for (r = 0; r < _this.getModuleCount(); r += 1) {
      mr = r * cellSize + margin;
      for (c = 0; c < _this.getModuleCount(); c += 1) {
        if (_this.isDark(r, c) ) {
          mc = c*cellSize+margin;
          qrSvg += 'M' + mc + ',' + mr + rect;
        }
      }
    }

    qrSvg += '" stroke="transparent" fill="black"/>';
    qrSvg += '</svg>';

    return qrSvg;
  };

  _this.createDataURL = function(cellSize, margin) {

    cellSize = cellSize || 2;
    margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

    const size = _this.getModuleCount() * cellSize + margin * 2;
    const min = margin;
    const max = size - margin;

    return createDataURL(size, size, function(x, y) {
      if (min <= x && x < max && min <= y && y < max) {
        const c = Math.floor( (x - min) / cellSize);
        const r = Math.floor( (y - min) / cellSize);
        return _this.isDark(r, c)? 0 : 1;
      } else {
        return 1;
      }
    } );
  };

  _this.createImgTag = function(cellSize, margin, alt) {

    cellSize = cellSize || 2;
    margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

    const size = _this.getModuleCount() * cellSize + margin * 2;

    let img = '';
    img += '<img';
    img += '\\u0020src="';
    img += _this.createDataURL(cellSize, margin);
    img += '"';
    img += '\\u0020width="';
    img += size;
    img += '"';
    img += '\\u0020height="';
    img += size;
    img += '"';
    if (alt) {
      img += '\\u0020alt="';
      img += escapeXml(alt);
      img += '"';
    }
    img += '/>';

    return img;
  };

  const escapeXml = function(s) {
    let escaped = '';
    for (let i = 0; i < s.length; i += 1) {
      const c = s.charAt(i);
      switch(c) {
      case '<': escaped += '&lt;'; break;
      case '>': escaped += '&gt;'; break;
      case '&': escaped += '&amp;'; break;
      case '"': escaped += '&quot;'; break;
      default : escaped += c; break;
      }
    }
    return escaped;
  };

  const _createHalfASCII = function(margin) {
    const cellSize = 1;
    margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

    const size = _this.getModuleCount() * cellSize + margin * 2;
    const min = margin;
    const max = size - margin;

    let y, x, r1, r2, p;

    const blocks = {
      '██': '█',
      '█ ': '▀',
      ' █': '▄',
      '  ': ' '
    };

    const blocksLastLineNoMargin = {
      '██': '▀',
      '█ ': '▀',
      ' █': ' ',
      '  ': ' '
    };

    let ascii = '';
    for (y = 0; y < size; y += 2) {
      r1 = Math.floor((y - min) / cellSize);
      r2 = Math.floor((y + 1 - min) / cellSize);
      for (x = 0; x < size; x += 1) {
        p = '█';

        if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
          p = ' ';
        }

        if (min <= x && x < max && min <= y+1 && y+1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) {
          p += ' ';
        }
        else {
          p += '█';
        }

        // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
        ascii += (margin < 1 && y+1 >= max) ? blocksLastLineNoMargin[p] : blocks[p];
      }

      ascii += '\\n';
    }

    if (size % 2 && margin > 0) {
      return ascii.substring(0, ascii.length - size - 1) + Array(size+1).join('▀');
    }

    return ascii.substring(0, ascii.length-1);
  };

  _this.createASCII = function(cellSize, margin) {
    cellSize = cellSize || 1;

    if (cellSize < 2) {
      return _createHalfASCII(margin);
    }

    cellSize -= 1;
    margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

    const size = _this.getModuleCount() * cellSize + margin * 2;
    const min = margin;
    const max = size - margin;

    let y, x, r, p;

    const white = Array(cellSize+1).join('██');
    const black = Array(cellSize+1).join('  ');

    let ascii = '';
    let line = '';
    for (y = 0; y < size; y += 1) {
      r = Math.floor( (y - min) / cellSize);
      line = '';
      for (x = 0; x < size; x += 1) {
        p = 1;

        if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) {
          p = 0;
        }

        // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
        line += p ? white : black;
      }

      for (r = 0; r < cellSize; r += 1) {
        ascii += line + '\\n';
      }
    }

    return ascii.substring(0, ascii.length-1);
  };

  _this.renderTo2dContext = function(context, cellSize) {
    cellSize = cellSize || 2;
    const length = _this.getModuleCount();
    for (let row = 0; row < length; row++) {
      for (let col = 0; col < length; col++) {
        context.fillStyle = _this.isDark(row, col) ? 'black' : 'white';
        context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }

  return _this;
};

//---------------------------------------------------------------------
// qrcode.stringToBytes
//---------------------------------------------------------------------

qrcode.stringToBytes = function(s) {
  const bytes = [];
  for (let i = 0; i < s.length; i += 1) {
    const c = s.charCodeAt(i);
    bytes.push(c & 0xff);
  }
  return bytes;
};

//---------------------------------------------------------------------
// qrcode.createStringToBytes
//---------------------------------------------------------------------

/**
 * @param unicodeData base64 string of byte array.
 * [16bit Unicode],[16bit Bytes], ...
 * @param numChars
 */
qrcode.createStringToBytes = function(unicodeData, numChars) {

  // create conversion map.

  const unicodeMap = function() {

    const bin = base64DecodeInputStream(unicodeData);
    const read = function() {
      const b = bin.read();
      if (b == -1) throw 'eof';
      return b;
    };

    let count = 0;
    const unicodeMap = {};
    while (true) {
      const b0 = bin.read();
      if (b0 == -1) break;
      const b1 = read();
      const b2 = read();
      const b3 = read();
      const k = String.fromCharCode( (b0 << 8) | b1);
      const v = (b2 << 8) | b3;
      unicodeMap[k] = v;
      count += 1;
    }
    if (count != numChars) {
      throw count + ' != ' + numChars;
    }

    return unicodeMap;
  }();

  const unknownChar = '?'.charCodeAt(0);

  return function(s) {
    const bytes = [];
    for (let i = 0; i < s.length; i += 1) {
      const c = s.charCodeAt(i);
      if (c < 128) {
        bytes.push(c);
      } else {
        const b = unicodeMap[s.charAt(i)];
        if (typeof b == 'number') {
          if ( (b & 0xff) == b) {
            // 1byte
            bytes.push(b);
          } else {
            // 2bytes
            bytes.push(b >>> 8);
            bytes.push(b & 0xff);
          }
        } else {
          bytes.push(unknownChar);
        }
      }
    }
    return bytes;
  };
};

//---------------------------------------------------------------------
// QRMode
//---------------------------------------------------------------------

const QRMode = {
  MODE_NUMBER :    1 << 0,
  MODE_ALPHA_NUM : 1 << 1,
  MODE_8BIT_BYTE : 1 << 2,
  MODE_KANJI :     1 << 3
};

//---------------------------------------------------------------------
// QRErrorCorrectionLevel
//---------------------------------------------------------------------

const QRErrorCorrectionLevel = {
  L : 1,
  M : 0,
  Q : 3,
  H : 2
};

//---------------------------------------------------------------------
// QRMaskPattern
//---------------------------------------------------------------------

const QRMaskPattern = {
  PATTERN000 : 0,
  PATTERN001 : 1,
  PATTERN010 : 2,
  PATTERN011 : 3,
  PATTERN100 : 4,
  PATTERN101 : 5,
  PATTERN110 : 6,
  PATTERN111 : 7
};

//---------------------------------------------------------------------
// QRUtil
//---------------------------------------------------------------------

const QRUtil = function() {

  const PATTERN_POSITION_TABLE = [
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102],
    [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110],
    [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122],
    [6, 30, 54, 78, 102, 126],
    [6, 26, 52, 78, 104, 130],
    [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138],
    [6, 30, 58, 86, 114, 142],
    [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150],
    [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162],
    [6, 26, 54, 82, 110, 138, 166],
    [6, 30, 58, 86, 114, 142, 170]
  ];
  const G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
  const G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
  const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

  const _this = {};

  const getBCHDigit = function(data) {
    let digit = 0;
    while (data != 0) {
      digit += 1;
      data >>>= 1;
    }
    return digit;
  };

  _this.getBCHTypeInfo = function(data) {
    let d = data << 10;
    while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
      d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15) ) );
    }
    return ( (data << 10) | d) ^ G15_MASK;
  };

  _this.getBCHTypeNumber = function(data) {
    let d = data << 12;
    while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
      d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18) ) );
    }
    return (data << 12) | d;
  };

  _this.getPatternPosition = function(typeNumber) {
    return PATTERN_POSITION_TABLE[typeNumber - 1];
  };

  _this.getMaskFunction = function(maskPattern) {

    switch (maskPattern) {

    case QRMaskPattern.PATTERN000 :
      return function(i, j) { return (i + j) % 2 == 0; };
    case QRMaskPattern.PATTERN001 :
      return function(i, j) { return i % 2 == 0; };
    case QRMaskPattern.PATTERN010 :
      return function(i, j) { return j % 3 == 0; };
    case QRMaskPattern.PATTERN011 :
      return function(i, j) { return (i + j) % 3 == 0; };
    case QRMaskPattern.PATTERN100 :
      return function(i, j) { return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0; };
    case QRMaskPattern.PATTERN101 :
      return function(i, j) { return (i * j) % 2 + (i * j) % 3 == 0; };
    case QRMaskPattern.PATTERN110 :
      return function(i, j) { return ( (i * j) % 2 + (i * j) % 3) % 2 == 0; };
    case QRMaskPattern.PATTERN111 :
      return function(i, j) { return ( (i * j) % 3 + (i + j) % 2) % 2 == 0; };

    default :
      throw 'bad maskPattern:' + maskPattern;
    }
  };

  _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
    let a = qrPolynomial([1], 0);
    for (let i = 0; i < errorCorrectLength; i += 1) {
      a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0) );
    }
    return a;
  };

  _this.getLengthInBits = function(mode, type) {

    if (1 <= type && type < 10) {

      // 1 - 9

      switch(mode) {
      case QRMode.MODE_NUMBER    : return 10;
      case QRMode.MODE_ALPHA_NUM : return 9;
      case QRMode.MODE_8BIT_BYTE : return 8;
      case QRMode.MODE_KANJI     : return 8;
      default :
        throw 'mode:' + mode;
      }

    } else if (type < 27) {

      // 10 - 26

      switch(mode) {
      case QRMode.MODE_NUMBER    : return 12;
      case QRMode.MODE_ALPHA_NUM : return 11;
      case QRMode.MODE_8BIT_BYTE : return 16;
      case QRMode.MODE_KANJI     : return 10;
      default :
        throw 'mode:' + mode;
      }

    } else if (type < 41) {

      // 27 - 40

      switch(mode) {
      case QRMode.MODE_NUMBER    : return 14;
      case QRMode.MODE_ALPHA_NUM : return 13;
      case QRMode.MODE_8BIT_BYTE : return 16;
      case QRMode.MODE_KANJI     : return 12;
      default :
        throw 'mode:' + mode;
      }

    } else {
      throw 'type:' + type;
    }
  };

  _this.getLostPoint = function(qrcode) {

    const moduleCount = qrcode.getModuleCount();

    let lostPoint = 0;

    // LEVEL1

    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount; col += 1) {

        let sameCount = 0;
        const dark = qrcode.isDark(row, col);

        for (let r = -1; r <= 1; r += 1) {

          if (row + r < 0 || moduleCount <= row + r) {
            continue;
          }

          for (let c = -1; c <= 1; c += 1) {

            if (col + c < 0 || moduleCount <= col + c) {
              continue;
            }

            if (r == 0 && c == 0) {
              continue;
            }

            if (dark == qrcode.isDark(row + r, col + c) ) {
              sameCount += 1;
            }
          }
        }

        if (sameCount > 5) {
          lostPoint += (3 + sameCount - 5);
        }
      }
    };

    // LEVEL2

    for (let row = 0; row < moduleCount - 1; row += 1) {
      for (let col = 0; col < moduleCount - 1; col += 1) {
        let count = 0;
        if (qrcode.isDark(row, col) ) count += 1;
        if (qrcode.isDark(row + 1, col) ) count += 1;
        if (qrcode.isDark(row, col + 1) ) count += 1;
        if (qrcode.isDark(row + 1, col + 1) ) count += 1;
        if (count == 0 || count == 4) {
          lostPoint += 3;
        }
      }
    }

    // LEVEL3

    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount - 6; col += 1) {
        if (qrcode.isDark(row, col)
            && !qrcode.isDark(row, col + 1)
            &&  qrcode.isDark(row, col + 2)
            &&  qrcode.isDark(row, col + 3)
            &&  qrcode.isDark(row, col + 4)
            && !qrcode.isDark(row, col + 5)
            &&  qrcode.isDark(row, col + 6) ) {
          lostPoint += 40;
        }
      }
    }

    for (let col = 0; col < moduleCount; col += 1) {
      for (let row = 0; row < moduleCount - 6; row += 1) {
        if (qrcode.isDark(row, col)
            && !qrcode.isDark(row + 1, col)
            &&  qrcode.isDark(row + 2, col)
            &&  qrcode.isDark(row + 3, col)
            &&  qrcode.isDark(row + 4, col)
            && !qrcode.isDark(row + 5, col)
            &&  qrcode.isDark(row + 6, col) ) {
          lostPoint += 40;
        }
      }
    }

    // LEVEL4

    let darkCount = 0;

    for (let col = 0; col < moduleCount; col += 1) {
      for (let row = 0; row < moduleCount; row += 1) {
        if (qrcode.isDark(row, col) ) {
          darkCount += 1;
        }
      }
    }

    const ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
    lostPoint += ratio * 10;

    return lostPoint;
  };

  return _this;
}();

//---------------------------------------------------------------------
// QRMath
//---------------------------------------------------------------------

const QRMath = function() {

  const EXP_TABLE = new Array(256);
  const LOG_TABLE = new Array(256);

  // initialize tables
  for (let i = 0; i < 8; i += 1) {
    EXP_TABLE[i] = 1 << i;
  }
  for (let i = 8; i < 256; i += 1) {
    EXP_TABLE[i] = EXP_TABLE[i - 4]
      ^ EXP_TABLE[i - 5]
      ^ EXP_TABLE[i - 6]
      ^ EXP_TABLE[i - 8];
  }
  for (let i = 0; i < 255; i += 1) {
    LOG_TABLE[EXP_TABLE[i] ] = i;
  }

  const _this = {};

  _this.glog = function(n) {

    if (n < 1) {
      throw 'glog(' + n + ')';
    }

    return LOG_TABLE[n];
  };

  _this.gexp = function(n) {

    while (n < 0) {
      n += 255;
    }

    while (n >= 256) {
      n -= 255;
    }

    return EXP_TABLE[n];
  };

  return _this;
}();

//---------------------------------------------------------------------
// qrPolynomial
//---------------------------------------------------------------------

const qrPolynomial = function(num, shift) {

  if (typeof num.length == 'undefined') {
    throw num.length + '/' + shift;
  }

  const _num = function() {
    let offset = 0;
    while (offset < num.length && num[offset] == 0) {
      offset += 1;
    }
    const _num = new Array(num.length - offset + shift);
    for (let i = 0; i < num.length - offset; i += 1) {
      _num[i] = num[i + offset];
    }
    return _num;
  }();

  const _this = {};

  _this.getAt = function(index) {
    return _num[index];
  };

  _this.getLength = function() {
    return _num.length;
  };

  _this.multiply = function(e) {

    const num = new Array(_this.getLength() + e.getLength() - 1);

    for (let i = 0; i < _this.getLength(); i += 1) {
      for (let j = 0; j < e.getLength(); j += 1) {
        num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i) ) + QRMath.glog(e.getAt(j) ) );
      }
    }

    return qrPolynomial(num, 0);
  };

  _this.mod = function(e) {

    if (_this.getLength() - e.getLength() < 0) {
      return _this;
    }

    const ratio = QRMath.glog(_this.getAt(0) ) - QRMath.glog(e.getAt(0) );

    const num = new Array(_this.getLength() );
    for (let i = 0; i < _this.getLength(); i += 1) {
      num[i] = _this.getAt(i);
    }

    for (let i = 0; i < e.getLength(); i += 1) {
      num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i) ) + ratio);
    }

    // recursive call
    return qrPolynomial(num, 0).mod(e);
  };

  return _this;
};

//---------------------------------------------------------------------
// QRRSBlock
//---------------------------------------------------------------------

const QRRSBlock = function() {

  const RS_BLOCK_TABLE = [

    // L
    // M
    // Q
    // H

    // 1
    [1, 26, 19],
    [1, 26, 16],
    [1, 26, 13],
    [1, 26, 9],

    // 2
    [1, 44, 34],
    [1, 44, 28],
    [1, 44, 22],
    [1, 44, 16],

    // 3
    [1, 70, 55],
    [1, 70, 44],
    [2, 35, 17],
    [2, 35, 13],

    // 4
    [1, 100, 80],
    [2, 50, 32],
    [2, 50, 24],
    [4, 25, 9],

    // 5
    [1, 134, 108],
    [2, 67, 43],
    [2, 33, 15, 2, 34, 16],
    [2, 33, 11, 2, 34, 12],

    // 6
    [2, 86, 68],
    [4, 43, 27],
    [4, 43, 19],
    [4, 43, 15],

    // 7
    [2, 98, 78],
    [4, 49, 31],
    [2, 32, 14, 4, 33, 15],
    [4, 39, 13, 1, 40, 14],

    // 8
    [2, 121, 97],
    [2, 60, 38, 2, 61, 39],
    [4, 40, 18, 2, 41, 19],
    [4, 40, 14, 2, 41, 15],

    // 9
    [2, 146, 116],
    [3, 58, 36, 2, 59, 37],
    [4, 36, 16, 4, 37, 17],
    [4, 36, 12, 4, 37, 13],

    // 10
    [2, 86, 68, 2, 87, 69],
    [4, 69, 43, 1, 70, 44],
    [6, 43, 19, 2, 44, 20],
    [6, 43, 15, 2, 44, 16],

    // 11
    [4, 101, 81],
    [1, 80, 50, 4, 81, 51],
    [4, 50, 22, 4, 51, 23],
    [3, 36, 12, 8, 37, 13],

    // 12
    [2, 116, 92, 2, 117, 93],
    [6, 58, 36, 2, 59, 37],
    [4, 46, 20, 6, 47, 21],
    [7, 42, 14, 4, 43, 15],

    // 13
    [4, 133, 107],
    [8, 59, 37, 1, 60, 38],
    [8, 44, 20, 4, 45, 21],
    [12, 33, 11, 4, 34, 12],

    // 14
    [3, 145, 115, 1, 146, 116],
    [4, 64, 40, 5, 65, 41],
    [11, 36, 16, 5, 37, 17],
    [11, 36, 12, 5, 37, 13],

    // 15
    [5, 109, 87, 1, 110, 88],
    [5, 65, 41, 5, 66, 42],
    [5, 54, 24, 7, 55, 25],
    [11, 36, 12, 7, 37, 13],

    // 16
    [5, 122, 98, 1, 123, 99],
    [7, 73, 45, 3, 74, 46],
    [15, 43, 19, 2, 44, 20],
    [3, 45, 15, 13, 46, 16],

    // 17
    [1, 135, 107, 5, 136, 108],
    [10, 74, 46, 1, 75, 47],
    [1, 50, 22, 15, 51, 23],
    [2, 42, 14, 17, 43, 15],

    // 18
    [5, 150, 120, 1, 151, 121],
    [9, 69, 43, 4, 70, 44],
    [17, 50, 22, 1, 51, 23],
    [2, 42, 14, 19, 43, 15],

    // 19
    [3, 141, 113, 4, 142, 114],
    [3, 70, 44, 11, 71, 45],
    [17, 47, 21, 4, 48, 22],
    [9, 39, 13, 16, 40, 14],

    // 20
    [3, 135, 107, 5, 136, 108],
    [3, 67, 41, 13, 68, 42],
    [15, 54, 24, 5, 55, 25],
    [15, 43, 15, 10, 44, 16],

    // 21
    [4, 144, 116, 4, 145, 117],
    [17, 68, 42],
    [17, 50, 22, 6, 51, 23],
    [19, 46, 16, 6, 47, 17],

    // 22
    [2, 139, 111, 7, 140, 112],
    [17, 74, 46],
    [7, 54, 24, 16, 55, 25],
    [34, 37, 13],

    // 23
    [4, 151, 121, 5, 152, 122],
    [4, 75, 47, 14, 76, 48],
    [11, 54, 24, 14, 55, 25],
    [16, 45, 15, 14, 46, 16],

    // 24
    [6, 147, 117, 4, 148, 118],
    [6, 73, 45, 14, 74, 46],
    [11, 54, 24, 16, 55, 25],
    [30, 46, 16, 2, 47, 17],

    // 25
    [8, 132, 106, 4, 133, 107],
    [8, 75, 47, 13, 76, 48],
    [7, 54, 24, 22, 55, 25],
    [22, 45, 15, 13, 46, 16],

    // 26
    [10, 142, 114, 2, 143, 115],
    [19, 74, 46, 4, 75, 47],
    [28, 50, 22, 6, 51, 23],
    [33, 46, 16, 4, 47, 17],

    // 27
    [8, 152, 122, 4, 153, 123],
    [22, 73, 45, 3, 74, 46],
    [8, 53, 23, 26, 54, 24],
    [12, 45, 15, 28, 46, 16],

    // 28
    [3, 147, 117, 10, 148, 118],
    [3, 73, 45, 23, 74, 46],
    [4, 54, 24, 31, 55, 25],
    [11, 45, 15, 31, 46, 16],

    // 29
    [7, 146, 116, 7, 147, 117],
    [21, 73, 45, 7, 74, 46],
    [1, 53, 23, 37, 54, 24],
    [19, 45, 15, 26, 46, 16],

    // 30
    [5, 145, 115, 10, 146, 116],
    [19, 75, 47, 10, 76, 48],
    [15, 54, 24, 25, 55, 25],
    [23, 45, 15, 25, 46, 16],

    // 31
    [13, 145, 115, 3, 146, 116],
    [2, 74, 46, 29, 75, 47],
    [42, 54, 24, 1, 55, 25],
    [23, 45, 15, 28, 46, 16],

    // 32
    [17, 145, 115],
    [10, 74, 46, 23, 75, 47],
    [10, 54, 24, 35, 55, 25],
    [19, 45, 15, 35, 46, 16],

    // 33
    [17, 145, 115, 1, 146, 116],
    [14, 74, 46, 21, 75, 47],
    [29, 54, 24, 19, 55, 25],
    [11, 45, 15, 46, 46, 16],

    // 34
    [13, 145, 115, 6, 146, 116],
    [14, 74, 46, 23, 75, 47],
    [44, 54, 24, 7, 55, 25],
    [59, 46, 16, 1, 47, 17],

    // 35
    [12, 151, 121, 7, 152, 122],
    [12, 75, 47, 26, 76, 48],
    [39, 54, 24, 14, 55, 25],
    [22, 45, 15, 41, 46, 16],

    // 36
    [6, 151, 121, 14, 152, 122],
    [6, 75, 47, 34, 76, 48],
    [46, 54, 24, 10, 55, 25],
    [2, 45, 15, 64, 46, 16],

    // 37
    [17, 152, 122, 4, 153, 123],
    [29, 74, 46, 14, 75, 47],
    [49, 54, 24, 10, 55, 25],
    [24, 45, 15, 46, 46, 16],

    // 38
    [4, 152, 122, 18, 153, 123],
    [13, 74, 46, 32, 75, 47],
    [48, 54, 24, 14, 55, 25],
    [42, 45, 15, 32, 46, 16],

    // 39
    [20, 147, 117, 4, 148, 118],
    [40, 75, 47, 7, 76, 48],
    [43, 54, 24, 22, 55, 25],
    [10, 45, 15, 67, 46, 16],

    // 40
    [19, 148, 118, 6, 149, 119],
    [18, 75, 47, 31, 76, 48],
    [34, 54, 24, 34, 55, 25],
    [20, 45, 15, 61, 46, 16]
  ];

  const qrRSBlock = function(totalCount, dataCount) {
    const _this = {};
    _this.totalCount = totalCount;
    _this.dataCount = dataCount;
    return _this;
  };

  const _this = {};

  const getRsBlockTable = function(typeNumber, errorCorrectionLevel) {

    switch(errorCorrectionLevel) {
    case QRErrorCorrectionLevel.L :
      return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
    case QRErrorCorrectionLevel.M :
      return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
    case QRErrorCorrectionLevel.Q :
      return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
    case QRErrorCorrectionLevel.H :
      return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
    default :
      return undefined;
    }
  };

  _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {

    const rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);

    if (typeof rsBlock == 'undefined') {
      throw 'bad rs block @ typeNumber:' + typeNumber +
          '/errorCorrectionLevel:' + errorCorrectionLevel;
    }

    const length = rsBlock.length / 3;

    const list = [];

    for (let i = 0; i < length; i += 1) {

      const count = rsBlock[i * 3 + 0];
      const totalCount = rsBlock[i * 3 + 1];
      const dataCount = rsBlock[i * 3 + 2];

      for (let j = 0; j < count; j += 1) {
        list.push(qrRSBlock(totalCount, dataCount) );
      }
    }

    return list;
  };

  return _this;
}();

//---------------------------------------------------------------------
// qrBitBuffer
//---------------------------------------------------------------------

const qrBitBuffer = function() {

  const _buffer = [];
  let _length = 0;

  const _this = {};

  _this.getBuffer = function() {
    return _buffer;
  };

  _this.getAt = function(index) {
    const bufIndex = Math.floor(index / 8);
    return ( (_buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
  };

  _this.put = function(num, length) {
    for (let i = 0; i < length; i += 1) {
      _this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
    }
  };

  _this.getLengthInBits = function() {
    return _length;
  };

  _this.putBit = function(bit) {

    const bufIndex = Math.floor(_length / 8);
    if (_buffer.length <= bufIndex) {
      _buffer.push(0);
    }

    if (bit) {
      _buffer[bufIndex] |= (0x80 >>> (_length % 8) );
    }

    _length += 1;
  };

  return _this;
};

//---------------------------------------------------------------------
// qrNumber
//---------------------------------------------------------------------

const qrNumber = function(data) {

  const _mode = QRMode.MODE_NUMBER;
  const _data = data;

  const _this = {};

  _this.getMode = function() {
    return _mode;
  };

  _this.getLength = function(buffer) {
    return _data.length;
  };

  _this.write = function(buffer) {

    const data = _data;

    let i = 0;

    while (i + 2 < data.length) {
      buffer.put(strToNum(data.substring(i, i + 3) ), 10);
      i += 3;
    }

    if (i < data.length) {
      if (data.length - i == 1) {
        buffer.put(strToNum(data.substring(i, i + 1) ), 4);
      } else if (data.length - i == 2) {
        buffer.put(strToNum(data.substring(i, i + 2) ), 7);
      }
    }
  };

  const strToNum = function(s) {
    let num = 0;
    for (let i = 0; i < s.length; i += 1) {
      num = num * 10 + chatToNum(s.charAt(i) );
    }
    return num;
  };

  const chatToNum = function(c) {
    if ('0' <= c && c <= '9') {
      return c.charCodeAt(0) - '0'.charCodeAt(0);
    }
    throw 'illegal char :' + c;
  };

  return _this;
};

//---------------------------------------------------------------------
// qrAlphaNum
//---------------------------------------------------------------------

const qrAlphaNum = function(data) {

  const _mode = QRMode.MODE_ALPHA_NUM;
  const _data = data;

  const _this = {};

  _this.getMode = function() {
    return _mode;
  };

  _this.getLength = function(buffer) {
    return _data.length;
  };

  _this.write = function(buffer) {

    const s = _data;

    let i = 0;

    while (i + 1 < s.length) {
      buffer.put(
        getCode(s.charAt(i) ) * 45 +
        getCode(s.charAt(i + 1) ), 11);
      i += 2;
    }

    if (i < s.length) {
      buffer.put(getCode(s.charAt(i) ), 6);
    }
  };

  const getCode = function(c) {

    if ('0' <= c && c <= '9') {
      return c.charCodeAt(0) - '0'.charCodeAt(0);
    } else if ('A' <= c && c <= 'Z') {
      return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
    } else {
      switch (c) {
      case '\\u0020' : return 36;
      case '$' : return 37;
      case '%' : return 38;
      case '*' : return 39;
      case '+' : return 40;
      case '-' : return 41;
      case '.' : return 42;
      case '/' : return 43;
      case ':' : return 44;
      default :
        throw 'illegal char :' + c;
      }
    }
  };

  return _this;
};

//---------------------------------------------------------------------
// qr8BitByte
//---------------------------------------------------------------------

const qr8BitByte = function(data) {

  const _mode = QRMode.MODE_8BIT_BYTE;
  const _data = data;
  const _bytes = qrcode.stringToBytes(data);

  const _this = {};

  _this.getMode = function() {
    return _mode;
  };

  _this.getLength = function(buffer) {
    return _bytes.length;
  };

  _this.write = function(buffer) {
    for (let i = 0; i < _bytes.length; i += 1) {
      buffer.put(_bytes[i], 8);
    }
  };

  return _this;
};

//---------------------------------------------------------------------
// qrKanji
//---------------------------------------------------------------------

const qrKanji = function(data) {

  const _mode = QRMode.MODE_KANJI;
  const _data = data;

  const stringToBytes = qrcode.stringToBytes;
  !function(c, code) {
    // self test for sjis support.
    const test = stringToBytes(c);
    if (test.length != 2 || ( (test[0] << 8) | test[1]) != code) {
      throw 'sjis not supported.';
    }
  }('\\u53cb', 0x9746);

  const _bytes = stringToBytes(data);

  const _this = {};

  _this.getMode = function() {
    return _mode;
  };

  _this.getLength = function(buffer) {
    return ~~(_bytes.length / 2);
  };

  _this.write = function(buffer) {

    const data = _bytes;

    let i = 0;

    while (i + 1 < data.length) {

      let c = ( (0xff & data[i]) << 8) | (0xff & data[i + 1]);

      if (0x8140 <= c && c <= 0x9FFC) {
        c -= 0x8140;
      } else if (0xE040 <= c && c <= 0xEBBF) {
        c -= 0xC140;
      } else {
        throw 'illegal char at ' + (i + 1) + '/' + c;
      }

      c = ( (c >>> 8) & 0xff) * 0xC0 + (c & 0xff);

      buffer.put(c, 13);

      i += 2;
    }

    if (i < data.length) {
      throw 'illegal char at ' + (i + 1);
    }
  };

  return _this;
};

//=====================================================================
// GIF Support etc.
//

//---------------------------------------------------------------------
// byteArrayOutputStream
//---------------------------------------------------------------------

const byteArrayOutputStream = function() {

  const _bytes = [];

  const _this = {};

  _this.writeByte = function(b) {
    _bytes.push(b & 0xff);
  };

  _this.writeShort = function(i) {
    _this.writeByte(i);
    _this.writeByte(i >>> 8);
  };

  _this.writeBytes = function(b, off, len) {
    off = off || 0;
    len = len || b.length;
    for (let i = 0; i < len; i += 1) {
      _this.writeByte(b[i + off]);
    }
  };

  _this.writeString = function(s) {
    for (let i = 0; i < s.length; i += 1) {
      _this.writeByte(s.charCodeAt(i) );
    }
  };

  _this.toByteArray = function() {
    return _bytes;
  };

  _this.toString = function() {
    let s = '';
    s += '[';
    for (let i = 0; i < _bytes.length; i += 1) {
      if (i > 0) {
        s += ',';
      }
      s += _bytes[i];
    }
    s += ']';
    return s;
  };

  return _this;
};

//---------------------------------------------------------------------
// base64EncodeOutputStream
//---------------------------------------------------------------------

const base64EncodeOutputStream = function() {

  let _buffer = 0;
  let _buflen = 0;
  let _length = 0;
  let _base64 = '';

  const _this = {};

  const writeEncoded = function(b) {
    _base64 += String.fromCharCode(encode(b & 0x3f) );
  };

  const encode = function(n) {
    if (n < 0) {
      throw 'n:' + n;
    } else if (n < 26) {
      return 0x41 + n;
    } else if (n < 52) {
      return 0x61 + (n - 26);
    } else if (n < 62) {
      return 0x30 + (n - 52);
    } else if (n == 62) {
      return 0x2b;
    } else if (n == 63) {
      return 0x2f;
    } else {
      throw 'n:' + n;
    }
  };

  _this.writeByte = function(n) {

    _buffer = (_buffer << 8) | (n & 0xff);
    _buflen += 8;
    _length += 1;

    while (_buflen >= 6) {
      writeEncoded(_buffer >>> (_buflen - 6) );
      _buflen -= 6;
    }
  };

  _this.flush = function() {

    if (_buflen > 0) {
      writeEncoded(_buffer << (6 - _buflen) );
      _buffer = 0;
      _buflen = 0;
    }

    if (_length % 3 != 0) {
      // padding
      const padlen = 3 - _length % 3;
      for (let i = 0; i < padlen; i += 1) {
        _base64 += '=';
      }
    }
  };

  _this.toString = function() {
    return _base64;
  };

  return _this;
};

//---------------------------------------------------------------------
// base64DecodeInputStream
//---------------------------------------------------------------------

const base64DecodeInputStream = function(str) {

  const _str = str;
  let _pos = 0;
  let _buffer = 0;
  let _buflen = 0;

  const _this = {};

  _this.read = function() {

    while (_buflen < 8) {

      if (_pos >= _str.length) {
        if (_buflen == 0) {
          return -1;
        }
        throw 'unexpected end of file./' + _buflen;
      }

      const c = _str.charAt(_pos);
      _pos += 1;

      if (c == '=') {
        _buflen = 0;
        return -1;
      } else if (c.match(/^\\s$/) ) {
        // ignore if whitespace.
        continue;
      }

      _buffer = (_buffer << 6) | decode(c.charCodeAt(0) );
      _buflen += 6;
    }

    const n = (_buffer >>> (_buflen - 8) ) & 0xff;
    _buflen -= 8;
    return n;
  };

  const decode = function(c) {
    if (0x41 <= c && c <= 0x5a) {
      return c - 0x41;
    } else if (0x61 <= c && c <= 0x7a) {
      return c - 0x61 + 26;
    } else if (0x30 <= c && c <= 0x39) {
      return c - 0x30 + 52;
    } else if (c == 0x2b) {
      return 62;
    } else if (c == 0x2f) {
      return 63;
    } else {
      throw 'c:' + c;
    }
  };

  return _this;
};

//---------------------------------------------------------------------
// gifImage (B/W)
//---------------------------------------------------------------------

const gifImage = function(width, height) {

  const _width = width;
  const _height = height;
  const _data = new Array(width * height);

  const _this = {};

  _this.setPixel = function(x, y, pixel) {
    _data[y * _width + x] = pixel;
  };

  _this.write = function(out) {

    //---------------------------------
    // GIF Signature

    out.writeString('GIF87a');

    //---------------------------------
    // Screen Descriptor

    out.writeShort(_width);
    out.writeShort(_height);

    out.writeByte(0x80); // 2bit
    out.writeByte(0);
    out.writeByte(0);

    //---------------------------------
    // Global Color Map

    // black
    out.writeByte(0x00);
    out.writeByte(0x00);
    out.writeByte(0x00);

    // white
    out.writeByte(0xff);
    out.writeByte(0xff);
    out.writeByte(0xff);

    //---------------------------------
    // Image Descriptor

    out.writeString(',');
    out.writeShort(0);
    out.writeShort(0);
    out.writeShort(_width);
    out.writeShort(_height);
    out.writeByte(0);

    //---------------------------------
    // Local Color Map

    //---------------------------------
    // Raster Data

    const lzwMinCodeSize = 2;
    const raster = getLZWRaster(lzwMinCodeSize);

    out.writeByte(lzwMinCodeSize);

    let offset = 0;

    while (raster.length - offset > 255) {
      out.writeByte(255);
      out.writeBytes(raster, offset, 255);
      offset += 255;
    }

    out.writeByte(raster.length - offset);
    out.writeBytes(raster, offset, raster.length - offset);
    out.writeByte(0x00);

    //---------------------------------
    // GIF Terminator
    out.writeString(';');
  };

  const bitOutputStream = function(out) {

    const _out = out;
    let _bitLength = 0;
    let _bitBuffer = 0;

    const _this = {};

    _this.write = function(data, length) {

      if ( (data >>> length) != 0) {
        throw 'length over';
      }

      while (_bitLength + length >= 8) {
        _out.writeByte(0xff & ( (data << _bitLength) | _bitBuffer) );
        length -= (8 - _bitLength);
        data >>>= (8 - _bitLength);
        _bitBuffer = 0;
        _bitLength = 0;
      }

      _bitBuffer = (data << _bitLength) | _bitBuffer;
      _bitLength = _bitLength + length;
    };

    _this.flush = function() {
      if (_bitLength > 0) {
        _out.writeByte(_bitBuffer);
      }
    };

    return _this;
  };

  const getLZWRaster = function(lzwMinCodeSize) {

    const clearCode = 1 << lzwMinCodeSize;
    const endCode = (1 << lzwMinCodeSize) + 1;
    let bitLength = lzwMinCodeSize + 1;

    // Setup LZWTable
    const table = lzwTable();

    for (let i = 0; i < clearCode; i += 1) {
      table.add(String.fromCharCode(i) );
    }
    table.add(String.fromCharCode(clearCode) );
    table.add(String.fromCharCode(endCode) );

    const byteOut = byteArrayOutputStream();
    const bitOut = bitOutputStream(byteOut);

    // clear code
    bitOut.write(clearCode, bitLength);

    let dataIndex = 0;

    let s = String.fromCharCode(_data[dataIndex]);
    dataIndex += 1;

    while (dataIndex < _data.length) {

      const c = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;

      if (table.contains(s + c) ) {

        s = s + c;

      } else {

        bitOut.write(table.indexOf(s), bitLength);

        if (table.size() < 0xfff) {

          if (table.size() == (1 << bitLength) ) {
            bitLength += 1;
          }

          table.add(s + c);
        }

        s = c;
      }
    }

    bitOut.write(table.indexOf(s), bitLength);

    // end code
    bitOut.write(endCode, bitLength);

    bitOut.flush();

    return byteOut.toByteArray();
  };

  const lzwTable = function() {

    const _map = {};
    let _size = 0;

    const _this = {};

    _this.add = function(key) {
      if (_this.contains(key) ) {
        throw 'dup key:' + key;
      }
      _map[key] = _size;
      _size += 1;
    };

    _this.size = function() {
      return _size;
    };

    _this.indexOf = function(key) {
      return _map[key];
    };

    _this.contains = function(key) {
      return typeof _map[key] != 'undefined';
    };

    return _this;
  };

  return _this;
};

const createDataURL = function(width, height, getPixel) {
  const gif = gifImage(width, height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      gif.setPixel(x, y, getPixel(x, y) );
    }
  }

  const b = byteArrayOutputStream();
  gif.write(b);

  const base64 = base64EncodeOutputStream();
  const bytes = b.toByteArray();
  for (let i = 0; i < bytes.length; i += 1) {
    base64.writeByte(bytes[i]);
  }
  base64.flush();

  return 'data:image/gif;base64,' + base64;
};



// src/00-core.js
/* ───────────────────────────────────────────────────────────────────────
 * Noyau du portail : rendu échappé, i18n, API, toasts, modales, utilitaires.
 * Aucune dépendance, compatible CSP stricte (pas de style/script en ligne :
 * les valeurs dynamiques passent par le CSSOM dans hydrate()).
 * ─────────────────────────────────────────────────────────────────────── */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// ── Rendu : gabarits étiquetés qui échappent toute interpolation ─────────
class Safe {
  constructor(value) { this.value = value; }
  toString() { return this.value; }
}
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '\`': '&#96;' };
function escapeValue(value) {
  if (value == null || value === false || value === true) return '';
  if (value instanceof Safe) return value.value;
  if (Array.isArray(value)) return value.map(escapeValue).join('');
  return String(value).replace(/[&<>"'\`]/g, (c) => ESCAPES[c]);
}
const html = (strings, ...values) =>
  new Safe(strings.reduce((out, chunk, i) => out + chunk + (i < values.length ? escapeValue(values[i]) : ''), ''));
const raw = (value) => new Safe(String(value));
const icon = (name, cls = '') => raw(\`<svg class="i \${cls}" aria-hidden="true" focusable="false"><use href="#i-\${name}"></use></svg>\`);

function render(target, template) {
  target.innerHTML = escapeValue(template);
  hydrate(target);
  return target;
}

/** Applique les valeurs dynamiques via le CSSOM (autorisé par la CSP). */
function hydrate(root) {
  for (const el of $$('[data-accent]', root)) {
    const [a, b] = el.dataset.accent.split(',');
    el.style.setProperty('--a', a);
    el.style.setProperty('--b', b || a);
  }
  for (const el of $$('[data-width]', root)) el.style.setProperty('--w', \`\${Math.max(0, Math.min(100, Number(el.dataset.width)))}%\`);
  for (const el of $$('[data-height]', root)) el.style.height = \`\${Math.max(2, Number(el.dataset.height))}%\`;
  for (const el of $$('[data-dash]', root)) {
    // Animation CSS (et non transition + rAF) : l'état final s'applique même
    // si l'onglet est en arrière-plan au moment du rendu.
    const [length, offset] = el.dataset.dash.split(',');
    el.style.setProperty('--len', length);
    el.style.setProperty('--offset', offset);
  }
  for (const el of $$('[data-delay]', root)) el.style.animationDelay = \`\${el.dataset.delay}ms\`;
}

// Lumière qui suit le pointeur sur les panneaux de verre.
document.addEventListener('pointermove', (event) => {
  const glass = event.target.closest?.('.glass');
  if (!glass || event.pointerType === 'touch') return;
  const rect = glass.getBoundingClientRect();
  glass.style.setProperty('--mx', \`\${event.clientX - rect.left}px\`);
  glass.style.setProperty('--my', \`\${event.clientY - rect.top}px\`);
}, { passive: true });

// ── i18n ─────────────────────────────────────────────────────────────────
const MESSAGES = { fr: {}, en: {} };
const LOCALES = ['fr', 'en'];
let locale = 'fr';
function messages(dict) {
  for (const lang of LOCALES) Object.assign(MESSAGES[lang], dict[lang] ?? {});
}
/** t('clé', { var }) — repli : français, puis la clé elle-même. */
function t(key, vars) {
  let text = MESSAGES[locale][key] ?? MESSAGES.fr[key] ?? key;
  if (typeof text === 'function') text = text(vars ?? {});
  if (vars) text = text.replace(/\\{(\\w+)\\}/g, (_, name) => (vars[name] ?? \`{\${name}}\`));
  return text;
}
function setLocale(next) {
  locale = LOCALES.includes(next) ? next : 'fr';
  document.documentElement.lang = locale;
  try { localStorage.setItem('cord:locale', locale); } catch { /* stockage indisponible */ }
}
function initialLocale() {
  try {
    const saved = localStorage.getItem('cord:locale');
    if (LOCALES.includes(saved)) return saved;
  } catch { /* stockage indisponible */ }
  return (navigator.language || 'fr').toLowerCase().startsWith('fr') ? 'fr' : (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'fr';
}
const intlLocale = () => (locale === 'fr' ? 'fr-FR' : 'en-GB');
const fmtDate = (ms) => (ms ? new Intl.DateTimeFormat(intlLocale(), { dateStyle: 'long' }).format(new Date(ms)) : '—');
const fmtDateShort = (ms) => (ms ? new Intl.DateTimeFormat(intlLocale(), { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(ms)) : '—');
const fmtDateTime = (ms) => (ms ? new Intl.DateTimeFormat(intlLocale(), { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ms)) : '—');
const fmtTime = (ms) => new Intl.DateTimeFormat(intlLocale(), { hour: '2-digit', minute: '2-digit' }).format(new Date(ms));
function fmtRelative(ms) {
  if (!ms) return '—';
  const diff = ms - Date.now();
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat(intlLocale(), { numeric: 'auto' });
  if (abs < 60_000) return t('time.now');
  if (abs < 3600_000) return rtf.format(Math.round(diff / 60_000), 'minute');
  if (abs < 86400_000) return rtf.format(Math.round(diff / 3600_000), 'hour');
  if (abs < 30 * 86400_000) return rtf.format(Math.round(diff / 86400_000), 'day');
  if (abs < 365 * 86400_000) return rtf.format(Math.round(diff / (30 * 86400_000)), 'month');
  return rtf.format(Math.round(diff / (365 * 86400_000)), 'year');
}
const plural = (n, key) => t(n === 1 ? \`\${key}.one\` : \`\${key}.other\`, { n });

// ── Thème ────────────────────────────────────────────────────────────────
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark' || theme === 'light') root.dataset.theme = theme;
  else delete root.dataset.theme;
  try { localStorage.setItem('cord:theme', theme || 'system'); } catch { /* stockage indisponible */ }
}
function savedTheme() {
  try { return localStorage.getItem('cord:theme') || 'system'; } catch { return 'system'; }
}
const effectiveTheme = () =>
  document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

// ── API ──────────────────────────────────────────────────────────────────
class ApiError extends Error {
  constructor(message, status, reason) { super(message); this.status = status; this.reason = reason; }
}
async function api(path, data, method = data === undefined ? 'GET' : 'POST') {
  let response;
  try {
    response = await fetch(path, {
      method,
      credentials: 'same-origin',
      headers: method === 'GET' ? { Accept: 'application/json' } : { 'Content-Type': 'application/json', Accept: 'application/json' },
      ...(method === 'GET' ? {} : { body: JSON.stringify(data ?? {}) }),
    });
  } catch {
    throw new ApiError(t('error.network'), 0);
  }
  let body = {};
  try { body = await response.json(); } catch { /* réponse vide */ }
  if (!response.ok) throw new ApiError(translateError(body.error, body.reason, response.status), response.status, body.reason);
  return body;
}
function translateError(message, reason, status) {
  if (reason && MESSAGES[locale][\`reason.\${reason}\`]) return t(\`reason.\${reason}\`);
  if (locale !== 'fr' && status === 429) return t('error.rate');
  if (locale !== 'fr' && status >= 500) return t('error.server');
  return message || t('error.server');
}

// ── Notifications ────────────────────────────────────────────────────────
function toast(message, { type = 'success', duration = type === 'error' ? 7000 : 4500, action } = {}) {
  const host = $('#toasts');
  const el = document.createElement('div');
  el.className = \`toast toast-\${type}\`;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  const lead = { success: 'circle-check', error: 'circle-alert', info: 'info' }[type] ?? 'info';
  render(el, html\`\${icon(lead, 'lead')}<div class="body">\${message}\${action ? html\` <a href="\${action.href}" \${action.external ? raw('target="_blank" rel="noopener"') : ''}>\${action.label}</a>\` : ''}</div>
    <button class="btn btn-ghost btn-icon btn-sm close" aria-label="\${t('common.close')}">\${icon('x')}</button>
    <span class="bar"></span>\`);
  $('.bar', el).style.animationDuration = \`\${duration}ms\`;
  const close = () => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 260);
  };
  $('.close', el).addEventListener('click', close);
  let timer = setTimeout(close, duration);
  el.addEventListener('pointerenter', () => { clearTimeout(timer); $('.bar', el).style.animationPlayState = 'paused'; });
  el.addEventListener('pointerleave', () => { timer = setTimeout(close, 2000); $('.bar', el).style.animationPlayState = 'running'; });
  host.append(el);
  while (host.children.length > 4) host.firstElementChild.remove();
}
const toastError = (e) => toast(e?.message || t('error.server'), { type: 'error' });

// ── Modales (<dialog> natif : focus piégé, Échap, accessibilité) ─────────
/**
 * modal({ title, desc, icon, tone, body, actions, wide, onSubmit, onOpen, dismissible })
 * \`body\` et \`actions\` : gabarits html (ou fonctions qui en renvoient).
 * \`onSubmit(formData, ctx)\` : async ; ctx.close(), ctx.setBody(), ctx.error().
 * Renvoie une promesse résolue à la fermeture avec la valeur passée à close().
 */
function modal({ title, desc, iconName, tone = '', body, actions, wide = false, onSubmit, onOpen, dismissible = true, labelledBy }) {
  return new Promise((resolve) => {
    const dialog = document.createElement('dialog');
    dialog.className = \`modal\${wide ? ' wide' : ''}\`;
    const titleId = \`m-\${Math.random().toString(36).slice(2, 9)}\`;
    dialog.setAttribute('aria-labelledby', labelledBy ?? titleId);
    let result;
    const ctx = {
      dialog,
      close(value) {
        result = value;
        dialog.classList.add('closing');
        setTimeout(() => dialog.close(), 170);
      },
      setBody(template) {
        render($('.modal-content', dialog), typeof template === 'function' ? template() : template);
      },
      error(message) {
        const box = $('.modal-error', dialog);
        if (!message) { box.hidden = true; return; }
        render(box, html\`\${icon('circle-alert')}<span>\${message}</span>\`);
        box.hidden = false;
      },
    };
    render(dialog, html\`<div class="sheet-handle"></div>
      <form class="modal-inner" method="dialog" novalidate>
        <div class="modal-head">
          \${iconName ? html\`<div class="icon-badge \${tone}">\${icon(iconName)}</div>\` : ''}
          <div class="grow"><h2 class="modal-title" id="\${titleId}">\${title}</h2>\${desc ? html\`<p class="modal-desc">\${desc}</p>\` : ''}</div>
          \${dismissible ? html\`<button type="button" class="btn btn-ghost btn-icon modal-close" data-close aria-label="\${t('common.close')}">\${icon('x')}</button>\` : ''}
        </div>
        <div class="modal-content stack">\${typeof body === 'function' ? body() : body ?? ''}</div>
        <div class="modal-error" role="alert" hidden></div>
        \${actions ? html\`<div class="modal-actions">\${typeof actions === 'function' ? actions() : actions}</div>\` : ''}
      </form>\`);
    const form = $('form', dialog);
    dialog.addEventListener('click', (event) => {
      if (event.target.closest('[data-close]')) { event.preventDefault(); ctx.close(); }
      else if (event.target === dialog && dismissible) ctx.close();
    });
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      if (dismissible) ctx.close();
    });
    dialog.addEventListener('close', () => { dialog.remove(); resolve(result); });
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!onSubmit) return ctx.close(true);
      const submitter = event.submitter ?? $('[type="submit"]', form);
      ctx.error(null);
      if (!form.checkValidity()) {
        const invalid = $(':invalid', form);
        invalid?.focus();
        ctx.error(invalid?.validationMessage || t('error.form'));
        return;
      }
      await busy(submitter, async () => {
        try {
          await onSubmit(new FormData(form), ctx, submitter);
        } catch (e) {
          ctx.error(e?.message || t('error.server'));
        }
      });
    });
    document.body.append(dialog);
    dialog.showModal();
    onOpen?.(ctx);
    const first = $('[autofocus]', dialog) ?? $('input:not([type="hidden"]), textarea, select', dialog);
    if (first) setTimeout(() => first.focus(), 60);
  });
}
function confirmDialog({ title, desc, confirm, tone = 'danger', iconName = 'triangle-alert', body }) {
  return modal({
    title,
    desc,
    iconName,
    tone: \`tone-\${tone}\`,
    body,
    actions: html\`<button type="button" class="btn btn-ghost" data-close>\${t('common.cancel')}</button>
      <button type="submit" class="btn \${tone === 'danger' ? 'btn-danger-solid' : 'btn-primary'}">\${confirm}</button>\`,
    onSubmit: async (_, ctx) => ctx.close(true),
  });
}

// ── Utilitaires ──────────────────────────────────────────────────────────
async function busy(button, fn) {
  if (!button) return fn();
  if (button.getAttribute('aria-busy') === 'true') return undefined;
  button.setAttribute('aria-busy', 'true');
  button.disabled = true;
  try {
    return await fn();
  } finally {
    button.removeAttribute('aria-busy');
    button.disabled = false;
  }
}
async function copyText(text, label = t('common.copied')) {
  try {
    await navigator.clipboard.writeText(text);
    toast(label, { type: 'success', duration: 2200 });
  } catch {
    toast(t('error.copy'), { type: 'error' });
  }
}
function downloadFile(name, content, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
const b64uToBytes = (text) => {
  const base = text.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(base + '='.repeat((4 - (base.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};
const bytesToB64u = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let bin = '';
  for (const byte of bytes) bin += String.fromCharCode(byte);
  return btoa(bin).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
};
const isMobile = () => matchMedia('(max-width: 960px)').matches || /iPhone|iPad|Android/i.test(navigator.userAgent);
const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const hashString = (text) => {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
};
function deviceName() {
  const ua = navigator.userAgent;
  if (/iPhone/.test(ua)) return 'iPhone';
  if (/iPad/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'iPad';
  if (/Android/.test(ua)) return 'Android';
  if (/Mac OS X|Macintosh/.test(ua)) return 'Mac';
  if (/Windows/.test(ua)) return 'Windows';
  if (/CrOS/.test(ua)) return 'Chromebook';
  if (/Linux/.test(ua)) return 'Linux';
  return t('common.device');
}

/** Petite pluie de confettis (respecte « mouvement réduit »). */
function celebrate() {
  if (reducedMotion()) return;
  const layer = document.createElement('div');
  layer.className = 'celebrate';
  const colors = ['#6e58f0', '#8b5cff', '#b842ec', '#d24bef', '#3ddc97', '#6cc7ff', '#ffbe5c'];
  for (let i = 0; i < 70; i++) {
    const bit = document.createElement('i');
    bit.style.left = \`\${Math.random() * 100}%\`;
    bit.style.background = colors[i % colors.length];
    bit.style.setProperty('--dx', \`\${(Math.random() - 0.5) * 240}px\`);
    bit.style.setProperty('--rot', \`\${360 + Math.random() * 720}deg\`);
    bit.style.animationDelay = \`\${Math.random() * 400}ms\`;
    bit.style.animationDuration = \`\${1400 + Math.random() * 900}ms\`;
    layer.append(bit);
  }
  document.body.append(layer);
  setTimeout(() => layer.remove(), 2800);
}

/** Force d'un mot de passe : 0 à 4 (heuristique locale, rien n'est envoyé). */
function passwordScore(password) {
  if (!password) return 0;
  let score = 0;
  const length = password.length;
  if (length >= 12) score++;
  if (length >= 16) score++;
  const classes = [/[a-z]/, /[A-Z]/, /\\d/, /[^A-Za-z0-9]/].filter((re) => re.test(password)).length;
  if (classes >= 3) score++;
  if (length >= 20 || (classes === 4 && length >= 14) || /\\s\\S+\\s/.test(password)) score++;
  if (/^(.)\\1+$/.test(password) || /(password|motdepasse|azerty|qwerty|123456|cordcord)/i.test(password)) score = Math.min(score, 1);
  if (length < 12) score = Math.min(score, 1);
  return Math.max(1, Math.min(4, score));
}

// src/01-ui.js
/* Briques d'interface partagées : avatars, QR, anneaux, champs mot de passe. */

messages({
  fr: {
    'common.close': 'Fermer', 'common.cancel': 'Annuler', 'common.save': 'Enregistrer', 'common.continue': 'Continuer',
    'common.copy': 'Copier', 'common.copied': 'Copié dans le presse-papiers.', 'common.back': 'Retour', 'common.done': 'Terminé',
    'common.rename': 'Renommer', 'common.remove': 'Supprimer', 'common.revoke': 'Révoquer', 'common.retry': 'Réessayer',
    'common.device': 'Appareil', 'common.name': 'Nom', 'common.show': 'Afficher', 'common.hide': 'Masquer', 'common.open': 'Ouvrir',
    'common.never': 'Jamais', 'common.today': 'Aujourd’hui', 'common.yesterday': 'Hier', 'common.loading': 'Chargement…',
    'common.or': 'ou', 'common.enabled': 'Activée', 'common.disabled': 'Désactivée', 'common.new': 'Nouveau',
    'time.now': 'à l’instant',
    'error.network': 'Connexion impossible au Compte Cord. Vérifie ta connexion Internet.',
    'error.server': 'Le service Cord ne répond pas correctement. Réessaie dans un instant.',
    'error.rate': 'Trop de tentatives. Patiente un peu avant de réessayer.',
    'error.form': 'Vérifie les champs du formulaire.',
    'error.copy': 'Copie impossible : sélectionne le texte à la main.',
    'reason.mfa_required': 'Saisis le code de ton application d’authentification.',
    'reason.mfa_invalid': 'Ce code ne fonctionne pas. Vérifie l’heure de ton téléphone ou utilise un code de secours.',
    'reason.password_invalid': 'Mot de passe incorrect.',
    'reason.mfa_unreadable': 'Ton application d’authentification ne peut pas être vérifiée pour le moment : utilise un code de secours.',
    'reason.passkey_unknown': 'Cette passkey n’est plus liée à un compte Cord. Supprime-la de ton gestionnaire.',
    'password.show': 'Afficher le mot de passe', 'password.hide': 'Masquer le mot de passe',
    'strength.0': ' ', 'strength.1': 'Trop faible', 'strength.2': 'Moyen', 'strength.3': 'Solide', 'strength.4': 'Excellent',
    'strength.hint': '12 caractères minimum. Une phrase de passe fonctionne très bien.',
    'status.live': 'En ligne', 'status.beta': 'En développement', 'status.soon': 'Bientôt',
    'device.desktop': 'Ordinateur', 'device.mobile': 'Mobile', 'device.tablet': 'Tablette', 'device.api': 'Application', 'device.unknown': 'Appareil',
  },
  en: {
    'common.close': 'Close', 'common.cancel': 'Cancel', 'common.save': 'Save', 'common.continue': 'Continue',
    'common.copy': 'Copy', 'common.copied': 'Copied to clipboard.', 'common.back': 'Back', 'common.done': 'Done',
    'common.rename': 'Rename', 'common.remove': 'Remove', 'common.revoke': 'Revoke', 'common.retry': 'Try again',
    'common.device': 'Device', 'common.name': 'Name', 'common.show': 'Show', 'common.hide': 'Hide', 'common.open': 'Open',
    'common.never': 'Never', 'common.today': 'Today', 'common.yesterday': 'Yesterday', 'common.loading': 'Loading…',
    'common.or': 'or', 'common.enabled': 'On', 'common.disabled': 'Off', 'common.new': 'New',
    'time.now': 'just now',
    'error.network': 'Can’t reach Cord Account. Check your internet connection.',
    'error.server': 'The Cord service isn’t responding properly. Try again in a moment.',
    'error.rate': 'Too many attempts. Wait a little before trying again.',
    'error.form': 'Please check the form fields.',
    'error.copy': 'Couldn’t copy: select the text manually.',
    'reason.mfa_required': 'Enter the code from your authenticator app.',
    'reason.mfa_invalid': 'That code doesn’t work. Check your phone’s clock or use a recovery code.',
    'reason.password_invalid': 'Wrong password.',
    'reason.mfa_unreadable': 'Your authenticator app can’t be verified right now: use a recovery code.',
    'reason.passkey_unknown': 'This passkey is no longer linked to a Cord account. Remove it from your password manager.',
    'password.show': 'Show password', 'password.hide': 'Hide password',
    'strength.0': ' ', 'strength.1': 'Too weak', 'strength.2': 'Fair', 'strength.3': 'Strong', 'strength.4': 'Excellent',
    'strength.hint': 'At least 12 characters. A passphrase works great.',
    'status.live': 'Live', 'status.beta': 'In development', 'status.soon': 'Coming soon',
    'device.desktop': 'Computer', 'device.mobile': 'Mobile', 'device.tablet': 'Tablet', 'device.api': 'App', 'device.unknown': 'Device',
  },
});

const SUITE_ACCENTS = [['#6D64F2', '#C64BF1'], ['#126A84', '#1CC3E0'], ['#BD2F98', '#F65D63'], ['#1E8FDC', '#1E61DC'], ['#19A684', '#37CC94'], ['#F16C8E', '#F9A159'], ['#EB981F', '#EF6327'], ['#6E58F0', '#B842EC']];

/** Avatar : photo si présente, sinon « identicon » dégradé + initiales. */
function avatar(user, size = '') {
  const cls = \`avatar \${size ? \`avatar-\${size}\` : ''}\`;
  if (user?.avatarUrl) return html\`<span class="\${cls}"><img src="\${user.avatarUrl}" alt="" loading="lazy" decoding="async"></span>\`;
  const seed = hashString(user?.id || user?.email || 'cord');
  const [a, b] = SUITE_ACCENTS[seed % SUITE_ACCENTS.length];
  const angle = seed % 360;
  const initials = (user?.name || user?.email || '?')
    .trim()
    .split(/\\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || '?';
  const gid = \`g\${seed.toString(36)}\`;
  return html\`<span class="\${cls}"><svg viewBox="0 0 100 100" role="img" aria-label="\${user?.name ?? ''}">
    <defs><linearGradient id="\${gid}" gradientTransform="rotate(\${angle % 90} .5 .5)"><stop offset="0" stop-color="\${a}"/><stop offset="1" stop-color="\${b}"/></linearGradient></defs>
    <rect width="100" height="100" fill="url(#\${gid})"/>
    <circle cx="\${20 + (seed % 60)}" cy="\${18 + ((seed >> 3) % 30)}" r="\${26 + ((seed >> 5) % 18)}" fill="#fff" opacity=".13"/>
    <circle cx="\${80 - ((seed >> 7) % 50)}" cy="\${86 - ((seed >> 9) % 20)}" r="\${20 + ((seed >> 11) % 16)}" fill="#000" opacity=".12"/>
    <text x="50" y="50" dy=".36em" text-anchor="middle" font-size="\${initials.length > 1 ? 38 : 44}" class="avatar-initials">\${initials}</text>
  </svg></span>\`;
}

/** QR code en SVG (modules arrondis, dégradé de la suite, logo au centre). */
function qrSvg(text, { logo = '/assets/icon-180.png' } = {}) {
  const qr = qrcode(0, 'Q');
  qr.addData(text);
  qr.make();
  const count = qr.getModuleCount();
  const margin = 1;
  const size = count + margin * 2;
  // Validé au décodeur (jsQR) : modules arrondis de 0,92, logo à 20 %, niveau Q.
  const logoSpan = Math.ceil(count * 0.2) | 1;
  const start = Math.floor((count - logoSpan) / 2);
  const inLogo = (r, c) => logo && r >= start - 1 && r <= start + logoSpan && c >= start - 1 && c <= start + logoSpan;
  const isFinder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= count - 7) || (r >= count - 7 && c < 7);
  const s = 0.92, k = 0.28, e = (s - 2 * k).toFixed(2), i0 = (1 - s) / 2;
  let dots = '';
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (!qr.isDark(r, c) || isFinder(r, c) || inLogo(r, c)) continue;
      const x = (c + margin + i0).toFixed(2);
      const y = (r + margin + i0).toFixed(2);
      dots += \`M\${x},\${y}m\${k},0h\${e}a\${k},\${k} 0 0 1 \${k},\${k}v\${e}a\${k},\${k} 0 0 1 -\${k},\${k}h-\${e}a\${k},\${k} 0 0 1 -\${k},-\${k}v-\${e}a\${k},\${k} 0 0 1 \${k},-\${k}z\`;
    }
  }
  const finder = (x, y) =>
    \`<rect x="\${x + 0.5}" y="\${y + 0.5}" width="6" height="6" rx="1.7" fill="none" stroke="url(#qrg)" stroke-width="1"/><rect x="\${x + 2}" y="\${y + 2}" width="3" height="3" rx=".9" fill="url(#qrg)"/>\`;
  const svg = \`<svg viewBox="0 0 \${size} \${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="QR code">
    <defs><linearGradient id="qrg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4b33d6"/><stop offset=".55" stop-color="#7a3fe0"/><stop offset="1" stop-color="#b52fcf"/></linearGradient></defs>
    <path d="\${dots}" fill="url(#qrg)"/>\${finder(margin, margin)}\${finder(margin + count - 7, margin)}\${finder(margin, margin + count - 7)}</svg>\`;
  return html\`\${raw(svg)}\${logo ? html\`<img class="qr-logo" src="\${logo}" alt="">\` : ''}\`;
}

/** Anneau de score (0-100). */
function scoreRing(value, { size = 112, stroke = 10, label, caption } = {}) {
  const r = (size - stroke) / 2;
  const length = 2 * Math.PI * r;
  const offset = length * (1 - Math.max(0, Math.min(100, value)) / 100);
  return html\`<div class="ring" role="img" aria-label="\${caption ?? ''} \${value}/100">
    <svg width="\${size}" height="\${size}" viewBox="0 0 \${size} \${size}">
      <defs><linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6e58f0"/><stop offset=".5" stop-color="#b842ec"/><stop offset="1" stop-color="#d24bef"/></linearGradient></defs>
      <circle class="track" cx="\${size / 2}" cy="\${size / 2}" r="\${r}" fill="none" stroke-width="\${stroke}"/>
      <circle class="value" cx="\${size / 2}" cy="\${size / 2}" r="\${r}" fill="none" stroke-width="\${stroke}" data-dash="\${length.toFixed(1)},\${offset.toFixed(1)}"/>
    </svg>
    <div class="label"><strong>\${label ?? value}</strong><small>\${caption ?? ''}</small></div>
  </div>\`;
}

/** Champ mot de passe avec bouton « afficher ». */
function passwordField({ name = 'password', label, autocomplete = 'current-password', minlength, strength = false, hint, autofocus = false, required = true, id }) {
  const fieldId = id ?? \`f-\${name}-\${Math.random().toString(36).slice(2, 7)}\`;
  return html\`<div class="field">
    <label for="\${fieldId}">\${label}</label>
    <div class="input-wrap">
      <input class="input" id="\${fieldId}" type="password" name="\${name}" autocomplete="\${autocomplete}" maxlength="512"
        \${minlength ? raw(\`minlength="\${minlength}"\`) : ''} \${required ? raw('required') : ''} \${autofocus ? raw('autofocus') : ''}
        \${strength ? raw('data-strength') : ''} spellcheck="false" autocapitalize="off">
      <button type="button" class="btn btn-ghost btn-icon btn-sm input-action" data-reveal aria-label="\${t('password.show')}" aria-pressed="false">\${icon('eye')}</button>
    </div>
    \${strength ? html\`<div class="strength" data-score="0" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
      <div class="strength-label"><span data-strength-label>\${hint ?? t('strength.hint')}</span></div>\` : hint ? html\`<p class="field-hint">\${hint}</p>\` : ''}
  </div>\`;
}
// Délégation : afficher/masquer + jauge de force, pour tous les champs du portail.
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-reveal]');
  if (!button) return;
  const input = button.parentElement.querySelector('input');
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  button.setAttribute('aria-pressed', String(show));
  button.setAttribute('aria-label', t(show ? 'password.hide' : 'password.show'));
  render(button, icon(show ? 'eye-off' : 'eye'));
});
document.addEventListener('input', (event) => {
  const input = event.target;
  if (!input.matches?.('[data-strength]')) return;
  const field = input.closest('.field');
  const score = input.value ? passwordScore(input.value) : 0;
  $('.strength', field).dataset.score = String(score);
  $('[data-strength-label]', field).textContent = input.value ? t(\`strength.\${score}\`) : t('strength.hint');
});

/** Logo d'app de la suite (ou pastille à l'initiale). */
function appLogo(app, cls = '') {
  return app?.logo
    ? html\`<img class="\${cls}" src="\${app.logo}" alt="" width="46" height="46" loading="lazy">\`
    : html\`<span class="fallback \${cls}">\${(app?.name ?? '?').slice(0, 1)}</span>\`;
}
function statusBadge(status) {
  const tone = { live: 'tone-ok', beta: 'tone-warn', soon: 'tone-muted' }[status] ?? 'tone-muted';
  return html\`<span class="badge \${tone}">\${status === 'live' ? html\`<span class="dot"></span>\` : ''}\${t(\`status.\${status}\`)}</span>\`;
}
const deviceIcon = (kind) => ({ desktop: 'laptop', mobile: 'smartphone', tablet: 'tablet-smartphone', api: 'cpu' })[kind] ?? 'monitor-smartphone';

function emptyState({ iconName, title, desc, action }) {
  return html\`<div class="empty"><div class="icon-badge lg tone-muted">\${icon(iconName)}</div><p class="title">\${title}</p>\${desc ? html\`<p class="desc">\${desc}</p>\` : ''}\${action ?? ''}</div>\`;
}

/** Compte à rebours circulaire (Passcord, 3 minutes). Renvoie stop(). */
function startCountdown(el, expiresAt, onExpire) {
  const total = Math.max(1, expiresAt - Date.now());
  const r = 7;
  const length = 2 * Math.PI * r;
  render(el, html\`<svg viewBox="0 0 18 18"><circle class="track" cx="9" cy="9" r="\${r}"/><circle class="value" cx="9" cy="9" r="\${r}"/></svg><span></span>\`);
  const circle = $('.value', el);
  circle.style.strokeDasharray = String(length);
  const label = $('span', el);
  let timer;
  const tick = () => {
    const left = Math.max(0, expiresAt - Date.now());
    label.textContent = \`\${Math.floor(left / 60000)}:\${String(Math.floor((left % 60000) / 1000)).padStart(2, '0')}\`;
    circle.style.strokeDashoffset = String(length * (1 - left / total));
    if (left <= 0) { clearInterval(timer); onExpire?.(); }
  };
  tick();
  timer = setInterval(tick, 1000);
  return () => clearInterval(timer);
}

// src/10-state.js
/* État global, routeur et actions déléguées. */

const state = {
  account: null, // réponse de /api/account
  hub: null, // réponse de /api/hub (apps de la suite, état remonté, notifications)
  suite: [],
  features: { mail: true },
  route: 'apercu',
};
const VIEWS = {};
const ACTIONS = {};
const passkeysSupported = () =>
  Boolean(window.PublicKeyCredential && navigator.credentials?.create) &&
  !/^\\d{1,3}(\\.\\d{1,3}){3}$/.test(location.hostname) &&
  location.hostname !== '[::1]';

async function loadAccount() {
  const [account, hubData] = await Promise.all([api('/api/account'), api('/api/hub').catch(() => null)]);
  state.account = account;
  state.hub = hubData;
  activityState.events = null;
  const user = state.account.user;
  if (user.locale && user.locale !== locale) setLocale(user.locale);
  applyTheme(user.theme);
  return state.account;
}
/** Recharge l'état du compte puis redessine la vue courante. */
async function refresh() {
  try {
    await loadAccount();
    renderShell();
  } catch (e) {
    if (e.status === 401) return showLanding();
    toastError(e);
  }
}

document.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target || target.closest('[data-scope]')) return;
  const action = ACTIONS[target.dataset.action];
  if (!action) return;
  event.preventDefault();
  Promise.resolve(action(target, event)).catch(toastError);
});
document.addEventListener('change', (event) => {
  const target = event.target.closest('[data-change]');
  if (!target || target.closest('[data-scope]')) return;
  const action = ACTIONS[target.dataset.change];
  if (action) Promise.resolve(action(target, event)).catch(toastError);
});

// Barre du haut : verre dépoli dès qu'on défile.
addEventListener('scroll', () => {
  $('.topbar')?.classList.toggle('scrolled', scrollY > 8);
}, { passive: true });

// src/20-auth.js
/* Carte d'authentification : connexion, inscription, 2FA, passkey, Passcord,
 * mot de passe oublié et réinitialisation. Réutilisée par la vitrine et par
 * l'écran de consentement OAuth. */

messages({
  fr: {
    'auth.login.title': 'Bon retour', 'auth.login.desc': 'Connecte-toi à ton compte Cord.',
    'auth.login.context': 'Connecte-toi pour continuer vers {app}.',
    'auth.email': 'Adresse email', 'auth.password': 'Mot de passe', 'auth.name': 'Ton prénom ou pseudo',
    'auth.register.context': 'Un seul compte pour {app} et toute la suite Cord. Ça prend 30 secondes.',
    'auth.verify.title': 'Vérifie ta boîte mail', 'auth.verify.desc': 'On a envoyé un code à 6 chiffres à {email}. Tape-le ici pour activer ton compte.',
    'auth.verify.submit': 'Activer mon compte', 'auth.verify.later': 'Plus tard', 'auth.verify.resent': 'Nouveau code envoyé.',
    'auth.forgot': 'Mot de passe oublié ?', 'auth.submit.login': 'Se connecter', 'auth.submit.register': 'Créer mon compte',
    'auth.passkey': 'Passkey', 'auth.passcord': 'Passcord',
    'auth.noAccount': 'Pas encore de compte ?', 'auth.createOne': 'Créer un compte Cord',
    'auth.hasAccount': 'Déjà un compte ?', 'auth.signIn': 'Se connecter',
    'auth.register.title': 'Crée ton compte Cord', 'auth.register.desc': 'Une identité pour toutes les apps de la suite. Gratuit, sans pub, sans pistage.',
    'auth.register.legal': 'En créant un compte, tu acceptes qu’on conserve ton nom et ton email pour te connecter aux apps Cord. Rien d’autre, jamais revendu.',
    'auth.mfa.title': 'Double authentification', 'auth.mfa.desc': 'Ouvre ton application d’authentification et saisis le code à 6 chiffres.',
    'auth.mfa.code': 'Code à 6 chiffres', 'auth.mfa.recovery': 'Code de secours', 'auth.mfa.useRecovery': 'Utiliser un code de secours',
    'auth.mfa.useTotp': 'Utiliser l’application d’authentification', 'auth.mfa.recoveryHint': 'Format xxxxx-xxxxx. Chaque code ne sert qu’une fois.',
    'auth.mfa.submit': 'Vérifier',
    'auth.forgot.title': 'Mot de passe oublié', 'auth.forgot.desc': 'Indique ton adresse : on t’envoie un lien pour en choisir un nouveau.',
    'auth.forgot.submit': 'Envoyer le lien',
    'auth.forgot.sent.title': 'Regarde ta boîte mail', 'auth.forgot.sent.desc': 'Si un compte Cord utilise {email}, un lien de réinitialisation vient de partir. Il est valable 30 minutes.',
    'auth.forgot.sent.tip': 'Rien reçu ? Vérifie les indésirables, ou connecte-toi avec Passcord ou une passkey si tu en as.',
    'auth.reset.title': 'Nouveau mot de passe', 'auth.reset.desc': 'Pour le compte {email}. Toutes tes sessions seront fermées.',
    'auth.reset.new': 'Nouveau mot de passe', 'auth.reset.confirm': 'Confirme-le', 'auth.reset.mismatch': 'Les deux mots de passe ne correspondent pas.',
    'auth.reset.submit': 'Changer le mot de passe', 'auth.reset.invalid': 'Ce lien a expiré ou a déjà servi. Demande-en un nouveau.',
    'auth.reset.mfa': 'Code de double authentification', 'auth.reset.mfaHint': 'Ton compte est protégé par la 2FA : code à 6 chiffres ou code de secours.',
    'auth.passcord.title': 'Connexion avec Passcord', 'auth.passcord.scan': 'Scanne ce code avec l’appareil photo de ton iPhone, puis valide avec Face ID dans Passcord.',
    'auth.passcord.mobile': 'Ouvre la demande dans Passcord sur cet iPhone, puis reviens ici.',
    'auth.passcord.open': 'Ouvrir dans Passcord', 'auth.passcord.copy': 'Copier le lien', 'auth.passcord.waiting': 'En attente de ton iPhone…',
    'auth.passcord.expired': 'La demande a expiré.', 'auth.passcord.unpaired': 'Passcord doit d’abord être associé à ton compte depuis la page Appareils.',
    'auth.passkey.cancelled': 'Connexion par passkey annulée.', 'auth.passkey.unsupported': 'Ce navigateur ne gère pas les passkeys.',
    'auth.welcome': 'Bienvenue, {name} !', 'auth.welcomeBack': 'Content de te revoir, {name}.',
    'auth.verifySent': 'Un lien de confirmation vient de partir vers {email}.',
    'auth.devLink': 'Ouvrir le lien (dev)',
  },
  en: {
    'auth.login.title': 'Welcome back', 'auth.login.desc': 'Sign in to your Cord account.',
    'auth.login.context': 'Sign in to continue to {app}.',
    'auth.email': 'Email address', 'auth.password': 'Password', 'auth.name': 'Your first name or nickname',
    'auth.register.context': 'One account for {app} and the whole Cord suite. Takes 30 seconds.',
    'auth.verify.title': 'Check your inbox', 'auth.verify.desc': 'We sent a 6-digit code to {email}. Type it here to activate your account.',
    'auth.verify.submit': 'Activate my account', 'auth.verify.later': 'Later', 'auth.verify.resent': 'New code sent.',
    'auth.forgot': 'Forgot password?', 'auth.submit.login': 'Sign in', 'auth.submit.register': 'Create my account',
    'auth.passkey': 'Passkey', 'auth.passcord': 'Passcord',
    'auth.noAccount': 'No account yet?', 'auth.createOne': 'Create a Cord account',
    'auth.hasAccount': 'Already have an account?', 'auth.signIn': 'Sign in',
    'auth.register.title': 'Create your Cord account', 'auth.register.desc': 'One identity for every app in the suite. Free, no ads, no tracking.',
    'auth.register.legal': 'By creating an account, you let us keep your name and email to sign you in to Cord apps. Nothing else, never sold.',
    'auth.mfa.title': 'Two-factor authentication', 'auth.mfa.desc': 'Open your authenticator app and enter the 6-digit code.',
    'auth.mfa.code': '6-digit code', 'auth.mfa.recovery': 'Recovery code', 'auth.mfa.useRecovery': 'Use a recovery code',
    'auth.mfa.useTotp': 'Use the authenticator app', 'auth.mfa.recoveryHint': 'Format xxxxx-xxxxx. Each code works once.',
    'auth.mfa.submit': 'Verify',
    'auth.forgot.title': 'Forgot password', 'auth.forgot.desc': 'Enter your email and we’ll send you a link to choose a new one.',
    'auth.forgot.submit': 'Send the link',
    'auth.forgot.sent.title': 'Check your inbox', 'auth.forgot.sent.desc': 'If a Cord account uses {email}, a reset link is on its way. It’s valid for 30 minutes.',
    'auth.forgot.sent.tip': 'Nothing? Check your spam folder, or sign in with Passcord or a passkey if you have one.',
    'auth.reset.title': 'New password', 'auth.reset.desc': 'For the account {email}. All your sessions will be signed out.',
    'auth.reset.new': 'New password', 'auth.reset.confirm': 'Confirm it', 'auth.reset.mismatch': 'The two passwords don’t match.',
    'auth.reset.submit': 'Change password', 'auth.reset.invalid': 'This link has expired or was already used. Request a new one.',
    'auth.reset.mfa': 'Two-factor code', 'auth.reset.mfaHint': 'Your account uses 2FA: 6-digit code or recovery code.',
    'auth.passcord.title': 'Sign in with Passcord', 'auth.passcord.scan': 'Scan this code with your iPhone camera, then approve with Face ID in Passcord.',
    'auth.passcord.mobile': 'Open the request in Passcord on this iPhone, then come back here.',
    'auth.passcord.open': 'Open in Passcord', 'auth.passcord.copy': 'Copy link', 'auth.passcord.waiting': 'Waiting for your iPhone…',
    'auth.passcord.expired': 'The request expired.', 'auth.passcord.unpaired': 'Passcord must first be paired with your account from the Devices page.',
    'auth.passkey.cancelled': 'Passkey sign-in cancelled.', 'auth.passkey.unsupported': 'This browser doesn’t support passkeys.',
    'auth.welcome': 'Welcome, {name}!', 'auth.welcomeBack': 'Good to see you again, {name}.',
    'auth.verifySent': 'A confirmation link is on its way to {email}.',
    'auth.devLink': 'Open link (dev)',
  },
});

/**
 * Monte la carte d'authentification dans \`host\`.
 * options : { mode, email, resetToken, context: { appName }, onSuccess(result, meta) }
 * \`email\` préremplit le champ (login_hint d'une app) ; après une inscription,
 * l'étape « verify » demande le code à 6 chiffres reçu par email.
 */
function mountAuth(host, { mode = 'login', email = '', resetToken, context, onSuccess }) {
  const local = { mode, email: String(email ?? '').slice(0, 254), password: '', recovery: false, resetInfo: null, stop: [], passkeyAbort: null };
  host.dataset.scope = 'auth';

  const cleanup = () => {
    local.stop.splice(0).forEach((fn) => fn());
    if (local.passkeyAbort) { local.passkeyAbort.abort(); local.passkeyAbort = null; }
  };
  const go = (next) => { cleanup(); local.mode = next; local.interacted = true; draw(); };
  const done = async (result, meta = {}) => { cleanup(); await onSuccess(result, meta); };

  const head = (title, desc) => html\`<div class="auth-head"><h2>\${title}</h2>\${desc ? html\`<p>\${desc}</p>\` : ''}</div>\`;
  const emailField = (autofocus = true) => html\`<div class="field"><label for="a-email">\${t('auth.email')}</label>
    <input class="input" id="a-email" name="email" type="email" inputmode="email" autocomplete="username webauthn" required maxlength="254" value="\${local.email}" \${autofocus ? raw('autofocus') : ''} spellcheck="false" autocapitalize="off"></div>\`;

  const views = {
    login: () => html\`\${head(t('auth.login.title'), context?.appName ? t('auth.login.context', { app: context.appName }) : t('auth.login.desc'))}
      <form data-form="login" novalidate>
        \${emailField()}
        \${passwordField({ label: t('auth.password'), id: 'a-password' })}
        <div class="row"><span class="spacer"></span><button type="button" class="link-btn" data-go="forgot">\${t('auth.forgot')}</button></div>
        <button class="btn btn-primary btn-lg btn-block" type="submit">\${t('auth.submit.login')}\${icon('arrow-right')}</button>
      </form>
      <div class="divider-text">\${t('common.or')}</div>
      <div class="auth-alt">
        \${passkeysSupported() ? html\`<button type="button" class="btn btn-glass" data-do="passkey">\${icon('fingerprint-pattern')}\${t('auth.passkey')}</button>\` : ''}
        <button type="button" class="btn btn-glass" data-do="passcord">\${icon('smartphone')}\${t('auth.passcord')}</button>
      </div>
      <p class="auth-foot">\${t('auth.noAccount')} <button type="button" class="link-btn" data-go="register">\${t('auth.createOne')}</button></p>\`,

    register: () => html\`\${head(t('auth.register.title'), context?.appName ? t('auth.register.context', { app: context.appName }) : t('auth.register.desc'))}
      <form data-form="register" novalidate>
        <div class="field"><label for="a-name">\${t('auth.name')}</label><input class="input" id="a-name" name="name" autocomplete="nickname" required maxlength="60" autofocus></div>
        \${emailField(false)}
        \${passwordField({ label: t('auth.password'), autocomplete: 'new-password', minlength: 12, strength: true, id: 'a-password' })}
        <button class="btn btn-primary btn-lg btn-block" type="submit">\${t('auth.submit.register')}\${icon('sparkles')}</button>
      </form>
      <p class="legal">\${t('auth.register.legal')}</p>
      <p class="auth-foot">\${t('auth.hasAccount')} <button type="button" class="link-btn" data-go="login">\${t('auth.signIn')}</button></p>\`,

    verify: () => html\`<div class="auth-illu"><div class="icon-badge grad">\${icon('mail-check')}</div></div>
      \${head(t('auth.verify.title'), t('auth.verify.desc', { email: local.email }))}
      <form data-form="verify" novalidate>
        <div class="field"><label for="a-code" class="sr-only">\${t('verify.code')}</label><input class="input input-otp" id="a-code" name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9 ]{6,7}" required maxlength="7" autofocus placeholder="••••••"></div>
        <button class="btn btn-primary btn-lg btn-block" type="submit">\${t('auth.verify.submit')}\${icon('arrow-right')}</button>
      </form>
      \${local.devUrl ? html\`<a class="btn btn-glass btn-block" href="\${local.devUrl}">\${icon('external-link')}\${t('auth.devLink')}</a>\` : ''}
      <div class="row-wrap"><button type="button" class="link-btn" data-do="resend-code">\${t('verify.resend')}</button><span class="spacer"></span><button type="button" class="link-btn muted" data-do="skip-verify">\${t('auth.verify.later')}</button></div>\`,

    mfa: () => html\`<div class="auth-illu"><div class="icon-badge grad">\${icon('shield-check')}</div></div>
      \${head(t('auth.mfa.title'), local.recovery ? t('auth.mfa.recoveryHint') : t('auth.mfa.desc'))}
      <form data-form="mfa" novalidate>
        \${local.recovery
          ? html\`<div class="field"><label for="a-otp">\${t('auth.mfa.recovery')}</label><input class="input mono" id="a-otp" name="otp" autocomplete="off" required maxlength="24" autofocus spellcheck="false" autocapitalize="off" placeholder="xxxxx-xxxxx"></div>\`
          : html\`<div class="field"><label for="a-otp" class="sr-only">\${t('auth.mfa.code')}</label><input class="input input-otp" id="a-otp" name="otp" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9 ]{6,7}" required maxlength="7" autofocus placeholder="••••••"></div>\`}
        <button class="btn btn-primary btn-lg btn-block" type="submit">\${t('auth.mfa.submit')}</button>
      </form>
      <div class="row-wrap"><button type="button" class="link-btn" data-do="toggle-recovery">\${local.recovery ? t('auth.mfa.useTotp') : t('auth.mfa.useRecovery')}</button><span class="spacer"></span><button type="button" class="link-btn muted" data-go="login">\${icon('arrow-left')}\${t('common.back')}</button></div>\`,

    forgot: () => html\`\${head(t('auth.forgot.title'), t('auth.forgot.desc'))}
      <form data-form="forgot" novalidate>
        \${emailField()}
        <button class="btn btn-primary btn-lg btn-block" type="submit">\${t('auth.forgot.submit')}\${icon('send')}</button>
      </form>
      <p class="auth-foot"><button type="button" class="link-btn muted" data-go="login">\${icon('arrow-left')}\${t('common.back')}</button></p>\`,

    'forgot-sent': () => html\`<div class="auth-illu"><div class="icon-badge grad">\${icon('mail-check')}</div></div>
      \${head(t('auth.forgot.sent.title'), t('auth.forgot.sent.desc', { email: local.email }))}
      <p class="small subtle">\${t('auth.forgot.sent.tip')}</p>
      \${local.devUrl ? html\`<a class="btn btn-glass btn-block" href="\${local.devUrl}">\${icon('external-link')}\${t('auth.devLink')}</a>\` : ''}
      <p class="auth-foot"><button type="button" class="link-btn" data-go="login">\${icon('arrow-left')}\${t('auth.signIn')}</button></p>\`,

    reset: () => local.resetInfo === false
      ? html\`<div class="auth-illu"><div class="icon-badge tone-danger">\${icon('circle-x')}</div></div>
          \${head(t('auth.reset.title'), t('auth.reset.invalid'))}
          <button type="button" class="btn btn-primary btn-block" data-go="forgot">\${t('auth.forgot.submit')}</button>\`
      : !local.resetInfo
        ? html\`<div class="stack"><div class="skeleton sk-title"></div><div class="skeleton sk-line"></div><div class="skeleton sk-block"></div></div>\`
        : html\`\${head(t('auth.reset.title'), t('auth.reset.desc', { email: local.resetInfo.email }))}
          <form data-form="reset" novalidate>
            \${passwordField({ label: t('auth.reset.new'), autocomplete: 'new-password', minlength: 12, strength: true, autofocus: true, id: 'a-new' })}
            \${passwordField({ name: 'confirm', label: t('auth.reset.confirm'), autocomplete: 'new-password', minlength: 12, id: 'a-confirm' })}
            \${local.resetInfo.mfa ? html\`<div class="field"><label for="a-otp">\${t('auth.reset.mfa')}</label><input class="input mono" id="a-otp" name="otp" autocomplete="one-time-code" required maxlength="24" spellcheck="false"><p class="field-hint">\${t('auth.reset.mfaHint')}</p></div>\` : ''}
            <button class="btn btn-primary btn-lg btn-block" type="submit">\${t('auth.reset.submit')}</button>
          </form>\`,

    passcord: () => html\`\${head(t('auth.passcord.title'), isMobile() ? t('auth.passcord.mobile') : t('auth.passcord.scan'))}
      <div class="passcord-wait" data-passcord>
        <div class="stack"><div class="skeleton sk-block"></div></div>
      </div>
      <p class="auth-foot"><button type="button" class="link-btn muted" data-go="login">\${icon('arrow-left')}\${t('common.back')}</button></p>\`,
  };

  function draw() {
    render(host, html\`<div class="auth-view" data-mode="\${local.mode}">\${views[local.mode]()}</div>\`);
    const focus = $('[autofocus]', host);
    if (focus && (local.interacted || !isMobile())) focus.focus({ preventScroll: true });
    if (local.mode === 'login') startConditionalPasskey();
    if (local.mode === 'passcord') startPasscord();
    if (local.mode === 'reset' && local.resetInfo === null) loadReset();
  }

  async function loadReset() {
    try {
      local.resetInfo = await api('/api/password/reset/check', { token: resetToken });
    } catch {
      local.resetInfo = false;
    }
    if (local.mode === 'reset') draw();
  }

  // ── Passkeys ────────────────────────────────────────────────────────
  async function passkeyLogin({ conditional = false } = {}) {
    if (!passkeysSupported()) throw new Error(t('auth.passkey.unsupported'));
    if (local.passkeyAbort) local.passkeyAbort.abort();
    const controller = new AbortController();
    local.passkeyAbort = controller;
    const options = await api('/api/passkeys/login/options', {});
    let credential;
    try {
      credential = await navigator.credentials.get({
        mediation: conditional ? 'conditional' : 'optional',
        signal: controller.signal,
        publicKey: { ...options.publicKey, challenge: b64uToBytes(options.publicKey.challenge), allowCredentials: [] },
      });
    } catch (e) {
      if (controller.signal.aborted) return;
      if (conditional) return;
      throw new Error(e?.name === 'NotAllowedError' ? t('auth.passkey.cancelled') : e?.message || t('auth.passkey.cancelled'));
    } finally {
      if (local.passkeyAbort === controller) local.passkeyAbort = null;
    }
    if (!credential) return;
    const result = await api('/api/passkeys/login', {
      id: options.id,
      credential: {
        id: credential.id,
        clientDataJSON: bytesToB64u(credential.response.clientDataJSON),
        authenticatorData: bytesToB64u(credential.response.authenticatorData),
        signature: bytesToB64u(credential.response.signature),
        userHandle: credential.response.userHandle ? bytesToB64u(credential.response.userHandle) : null,
      },
    });
    await done(result, { method: 'passkey' });
  }
  async function startConditionalPasskey() {
    try {
      if (!passkeysSupported() || !(await PublicKeyCredential.isConditionalMediationAvailable?.())) return;
      await passkeyLogin({ conditional: true });
    } catch (e) {
      if (local.mode === 'login') toastError(e);
    }
  }

  // ── Passcord ────────────────────────────────────────────────────────
  async function startPasscord() {
    let request;
    try {
      request = await api('/api/passcord/login', {});
    } catch (e) {
      toastError(e);
      return go('login');
    }
    if (local.mode !== 'passcord') return;
    const box = $('[data-passcord]', host);
    let active = true;
    local.stop.push(() => { active = false; });
    const mobile = isMobile();
    render(box, html\`\${mobile ? html\`<div class="auth-illu"><div class="icon-badge grad">\${icon('smartphone')}</div></div>\` : html\`<div class="qr-frame">\${qrSvg(request.url)}<span class="qr-scan"></span></div>\`}
      <div class="status"><span class="pulse-dot"></span><span>\${t('auth.passcord.waiting')}</span><span class="countdown" data-countdown></span></div>
      <div class="row-wrap">
        <a class="btn \${mobile ? 'btn-primary' : 'btn-glass'} btn-sm" href="\${request.url}">\${icon('external-link')}\${t('auth.passcord.open')}</a>
        <button type="button" class="btn btn-ghost btn-sm" data-do="copy-passcord" data-url="\${request.url}">\${icon('copy')}\${t('auth.passcord.copy')}</button>
      </div>\`);
    const expired = () => {
      if (!active) return;
      active = false;
      render(box, html\`<div class="auth-illu"><div class="icon-badge tone-warn">\${icon('clock')}</div></div><p class="muted">\${t('auth.passcord.expired')}</p>
        <button type="button" class="btn btn-primary" data-do="passcord">\${icon('refresh-cw')}\${t('common.retry')}</button>\`);
    };
    local.stop.push(startCountdown($('[data-countdown]', box), request.expiresAt, expired));
    const poll = async () => {
      if (!active) return;
      try {
        const result = await api('/api/passcord/poll', { id: request.id, pollToken: request.pollToken });
        if (!active) return;
        if (!result.pending) {
          active = false;
          $('.qr-frame', box)?.classList.add('done');
          return done(result, { method: 'passcord' });
        }
      } catch (e) {
        if (e.status === 410) return expired();
        if (!active) return;
      }
      setTimeout(poll, 2000);
    };
    setTimeout(poll, 2000);
  }

  // ── Soumissions ─────────────────────────────────────────────────────
  const submitters = {
    async login(form) {
      local.email = form.email.value.trim();
      local.password = form.password.value;
      try {
        const result = await api('/api/login', { email: local.email, password: local.password });
        local.password = '';
        await done(result, { method: 'password' });
      } catch (e) {
        if (e.reason === 'mfa_required') return go('mfa');
        throw e;
      }
    },
    async register(form) {
      local.email = form.email.value.trim();
      const result = await api('/api/register', { name: form.name.value.trim(), email: local.email, password: form.password.value });
      let delivery = null;
      try { delivery = await api('/api/email/send', {}); } catch { /* renvoyable depuis le compte */ }
      if (!delivery) return done(result, { registered: true });
      // Code à 6 chiffres tout de suite : l'utilisateur ne quitte pas l'écran
      // (ni l'app qui l'a envoyé ici) pour aller cliquer un lien.
      local.registered = result;
      local.devUrl = delivery.devUrl;
      if (delivery.devCode) console.info('[dev] code email :', delivery.devCode);
      go('verify');
    },
    async verify(form) {
      await api('/api/email/verify-code', { code: form.code.value });
      celebrate();
      await done(local.registered, { registered: true, verified: true });
    },
    async mfa(form) {
      try {
        const result = await api('/api/login', { email: local.email, password: local.password, otp: form.otp.value.trim() });
        local.password = '';
        await done(result, { method: 'password' });
      } catch (e) {
        if (e.status === 401 && !e.reason) { local.password = ''; go('login'); }
        if (e.reason === 'mfa_unreadable' && !local.recovery) { local.recovery = true; draw(); }
        throw e;
      }
    },
    async forgot(form) {
      local.email = form.email.value.trim();
      const result = await api('/api/password/forgot', { email: local.email });
      local.devUrl = result.devUrl;
      go('forgot-sent');
    },
    async reset(form) {
      if (form.password.value !== form.confirm.value) {
        form.confirm.setAttribute('aria-invalid', 'true');
        throw new Error(t('auth.reset.mismatch'));
      }
      const result = await api('/api/password/reset', { token: resetToken, password: form.password.value, otp: form.otp?.value.trim() || undefined });
      await done(result, { method: 'reset' });
    },
  };

  host.addEventListener('submit', async (event) => {
    const form = event.target.closest('[data-form]');
    if (!form) return;
    event.preventDefault();
    if (!form.checkValidity()) {
      const invalid = $(':invalid', form);
      invalid?.focus();
      invalid?.setAttribute('aria-invalid', 'true');
      toast(invalid?.validationMessage || t('error.form'), { type: 'error' });
      return;
    }
    await busy($('[type="submit"]', form), async () => {
      try {
        await submitters[form.dataset.form](form.elements);
      } catch (e) {
        toastError(e);
        const field = form.elements.otp ?? form.elements.code ?? form.elements.password;
        if (field && e.status && e.status < 500) { field.select?.(); field.setAttribute('aria-invalid', 'true'); }
      }
    });
  });
  host.addEventListener('input', (event) => event.target.removeAttribute?.('aria-invalid'));
  host.addEventListener('click', async (event) => {
    const goTo = event.target.closest('[data-go]');
    if (goTo) {
      const email = $('#a-email', host)?.value;
      if (email) local.email = email.trim();
      local.recovery = false;
      return go(goTo.dataset.go);
    }
    const doer = event.target.closest('[data-do]');
    if (!doer) return;
    const what = doer.dataset.do;
    if (what === 'passcord') return go('passcord');
    if (what === 'toggle-recovery') { local.recovery = !local.recovery; local.interacted = true; return draw(); }
    if (what === 'copy-passcord') return copyText(doer.dataset.url);
    if (what === 'passkey') await busy(doer, () => passkeyLogin().catch(toastError));
    if (what === 'resend-code') await busy(doer, () => api('/api/email/send', {}).then(() => toast(t('auth.verify.resent'))).catch(toastError));
    if (what === 'skip-verify') await done(local.registered, { registered: true });
  });

  draw();
  return { go, destroy: cleanup };
}

// src/21-landing.js
/* Vitrine publique (non connecté) : présentation du Compte Cord et de la suite. */

messages({
  fr: {
    'landing.pill': 'L’identité de la suite Cord',
    'landing.title.a': 'Un compte.',
    'landing.title.b': 'Toute la suite.',
    'landing.lead': 'Ton Compte Cord t’ouvre Drivecord, Tunecord, Passcord et toutes les apps qui arrivent. Une seule identité, protégée par ton iPhone, tes passkeys et la double authentification.',
    'landing.point.sso': '<strong>Connexion unique</strong> à toutes les apps de la suite',
    'landing.point.passwordless': '<strong>Sans mot de passe</strong> avec Passcord ou une passkey',
    'landing.point.privacy': '<strong>Tes données, tes règles</strong> : export et suppression en un clic',
    'landing.rail': '{n} apps, un seul compte',
    'landing.features.eyebrow': 'Pourquoi un Compte Cord',
    'landing.features.title': 'Une clé, toutes les portes.',
    'landing.features.desc': 'Pensé comme les comptes des grandes plateformes — sans la pub ni la revente de données.',
    'landing.f1.title': 'Connexion unique (OIDC)', 'landing.f1.desc': 'Un bouton « Continuer avec Cord » dans chaque app. Tu choisis ce que tu partages, et tu peux révoquer l’accès à tout moment.',
    'landing.f2.title': 'Passcord & passkeys', 'landing.f2.desc': 'Ton iPhone signe tes connexions avec Face ID ; tes passkeys marchent sur Mac, Windows et Android. La clé privée ne quitte jamais l’appareil.',
    'landing.f3.title': 'Sécurité visible', 'landing.f3.desc': 'Double authentification, sessions par appareil, historique de connexions et alertes email en cas de nouvel appareil.',
    'landing.suite.eyebrow': 'La suite', 'landing.suite.title': 'Des apps indépendantes, une seule identité.',
    'landing.suite.desc': 'Chaque app vit sur son propre domaine. Ton Compte Cord est le fil qui les relie.',
    'landing.how.eyebrow': 'En trois gestes', 'landing.how.title': 'Prêt en une minute.',
    'landing.how.1.title': 'Crée ton compte', 'landing.how.1.desc': 'Un nom, un email, un mot de passe solide. Confirme ton adresse d’un clic.',
    'landing.how.2.title': 'Associe Passcord', 'landing.how.2.desc': 'Scanne un QR code avec ton iPhone : il devient ta clé. Ou ajoute une passkey.',
    'landing.how.3.title': 'Connecte tes apps', 'landing.how.3.desc': 'Sur Drivecord et les autres, choisis « Continuer avec Cord ». C’est tout.',
    'landing.promise.title': 'Ce qu’on ne fera jamais', 'landing.promise.desc': 'Pas de pub, pas de pisteurs, pas de revente. Ton mot de passe est haché avec scrypt, tes secrets 2FA sont chiffrés, et tu peux tout exporter ou tout effacer.',
    'landing.promise.cta': 'Créer mon compte',
    'landing.footer.suite': 'La suite Cord', 'landing.footer.status': 'État des services', 'landing.footer.oidc': 'Configuration OIDC',
    'nav.signin': 'Se connecter', 'nav.theme': 'Changer de thème', 'nav.lang': 'Language: English',
  },
  en: {
    'landing.pill': 'The identity of the Cord suite',
    'landing.title.a': 'One account.',
    'landing.title.b': 'The whole suite.',
    'landing.lead': 'Your Cord account opens Drivecord, Tunecord, Passcord and every app on the way. One identity, protected by your iPhone, your passkeys and two-factor authentication.',
    'landing.point.sso': '<strong>Single sign-on</strong> to every app in the suite',
    'landing.point.passwordless': '<strong>Passwordless</strong> with Passcord or a passkey',
    'landing.point.privacy': '<strong>Your data, your rules</strong>: export and delete in one click',
    'landing.rail': '{n} apps, one account',
    'landing.features.eyebrow': 'Why a Cord account',
    'landing.features.title': 'One key, every door.',
    'landing.features.desc': 'Built like the accounts of big platforms — without the ads or the data brokering.',
    'landing.f1.title': 'Single sign-on (OIDC)', 'landing.f1.desc': 'A “Continue with Cord” button in every app. You choose what you share, and you can revoke access anytime.',
    'landing.f2.title': 'Passcord & passkeys', 'landing.f2.desc': 'Your iPhone signs your logins with Face ID; passkeys work on Mac, Windows and Android. The private key never leaves the device.',
    'landing.f3.title': 'Visible security', 'landing.f3.desc': 'Two-factor authentication, per-device sessions, sign-in history and email alerts for new devices.',
    'landing.suite.eyebrow': 'The suite', 'landing.suite.title': 'Independent apps, one identity.',
    'landing.suite.desc': 'Each app lives on its own domain. Your Cord account is the thread that ties them together.',
    'landing.how.eyebrow': 'Three steps', 'landing.how.title': 'Ready in a minute.',
    'landing.how.1.title': 'Create your account', 'landing.how.1.desc': 'A name, an email, a strong password. Confirm your address in one click.',
    'landing.how.2.title': 'Pair Passcord', 'landing.how.2.desc': 'Scan a QR code with your iPhone: it becomes your key. Or add a passkey.',
    'landing.how.3.title': 'Connect your apps', 'landing.how.3.desc': 'On Drivecord and the others, pick “Continue with Cord”. That’s it.',
    'landing.promise.title': 'What we’ll never do', 'landing.promise.desc': 'No ads, no trackers, no data sales. Your password is hashed with scrypt, your 2FA secrets are encrypted, and you can export or erase everything.',
    'landing.promise.cta': 'Create my account',
    'landing.footer.suite': 'The Cord suite', 'landing.footer.status': 'Service status', 'landing.footer.oidc': 'OIDC configuration',
    'nav.signin': 'Sign in', 'nav.theme': 'Switch theme', 'nav.lang': 'Langue : français',
  },
});

let authHandle = null;

function publicTopbar() {
  return html\`<header class="topbar">
    <a class="brand" href="/" aria-label="Compte Cord"><img src="/assets/icon-180.png" alt="" width="34" height="34"><span class="name">Compte Cord<small>cordsuite.app</small></span></a>
    <div class="actions">
      <button class="btn btn-ghost btn-sm" data-action="toggle-locale" aria-label="\${t('nav.lang')}">\${icon('languages')}<span>\${locale === 'fr' ? 'EN' : 'FR'}</span></button>
      <button class="btn btn-ghost btn-icon btn-sm" data-action="toggle-theme" aria-label="\${t('nav.theme')}">\${icon(effectiveTheme() === 'dark' ? 'sun' : 'moon')}</button>
      <a class="btn btn-glass btn-sm hide-sm" href="#connexion" data-action="focus-auth">\${icon('log-in')}\${t('nav.signin')}</a>
    </div>
  </header>\`;
}

function suiteTile(app, { link = true } = {}) {
  const live = app.status === 'live' && app.url && link;
  const inner = html\`<div class="top">\${appLogo(app)}\${statusBadge(app.status)}</div>
    <div><div class="name">\${app.name}</div><div class="tag">\${app.tagline}</div></div>
    <p class="desc">\${app.description}</p>
    \${live ? html\`<span class="go">\${icon('arrow-right')}</span>\` : ''}\`;
  return live
    ? html\`<a class="app-tile glass" href="\${app.url}" target="_blank" rel="noopener" data-accent="\${app.accent.join(',')}">\${inner}</a>\`
    : html\`<div class="app-tile glass \${app.status === 'soon' ? 'is-soon' : ''}" data-accent="\${app.accent.join(',')}">\${inner}</div>\`;
}

function showLanding({ mode = 'login', resetToken } = {}) {
  state.account = null;
  const app = $('#app');
  app.removeAttribute('aria-busy');
  document.title = 'Compte Cord';
  const apps = state.suite;
  render(app, html\`\${publicTopbar()}
    <main class="landing" id="main">
      <section class="hero">
        <div class="hero-copy">
          <span class="pill"><span class="spark">\${icon('sparkles')}</span>\${t('landing.pill')}</span>
          <h1>\${t('landing.title.a')}<br><span class="grad-text">\${t('landing.title.b')}</span></h1>
          <p class="lead">\${t('landing.lead')}</p>
          <ul class="hero-points">
            <li><span class="icon-badge">\${icon('key-round')}</span><span>\${raw(t('landing.point.sso'))}</span></li>
            <li><span class="icon-badge tone-info">\${icon('scan-face')}</span><span>\${raw(t('landing.point.passwordless'))}</span></li>
            <li><span class="icon-badge tone-ok">\${icon('shield-check')}</span><span>\${raw(t('landing.point.privacy'))}</span></li>
          </ul>
          <div class="logo-rail" aria-label="\${t('landing.rail', { n: apps.length })}">
            \${apps.map((a) => html\`<img src="\${a.logo}" alt="\${a.name}" title="\${a.name}" class="\${a.status === 'soon' ? 'soon' : ''}" width="38" height="38" loading="lazy">\`)}
            <span class="caption">\${t('landing.rail', { n: apps.length })}</span>
          </div>
        </div>
        <div class="auth-card glass" id="connexion"></div>
      </section>

      <section class="l-section">
        <header><p class="eyebrow">\${t('landing.features.eyebrow')}</p><h2>\${t('landing.features.title')}</h2><p>\${t('landing.features.desc')}</p></header>
        <div class="features">
          <article class="feature glass"><span class="icon-badge grad">\${icon('link-2')}</span><h3>\${t('landing.f1.title')}</h3><p>\${t('landing.f1.desc')}</p></article>
          <article class="feature glass"><span class="icon-badge grad">\${icon('fingerprint-pattern')}</span><h3>\${t('landing.f2.title')}</h3><p>\${t('landing.f2.desc')}</p></article>
          <article class="feature glass"><span class="icon-badge grad">\${icon('shield-check')}</span><h3>\${t('landing.f3.title')}</h3><p>\${t('landing.f3.desc')}</p></article>
        </div>
      </section>

      <section class="l-section">
        <header><p class="eyebrow">\${t('landing.suite.eyebrow')}</p><h2>\${t('landing.suite.title')}</h2><p>\${t('landing.suite.desc')}</p></header>
        <div class="suite-grid">\${apps.map((a) => suiteTile(a))}</div>
      </section>

      <section class="l-section">
        <header><p class="eyebrow">\${t('landing.how.eyebrow')}</p><h2>\${t('landing.how.title')}</h2></header>
        <ol class="how">
          \${[1, 2, 3].map((n) => html\`<li class="glass"><span class="how-n">0\${n}</span><h3>\${t(\`landing.how.\${n}.title\`)}</h3><p>\${t(\`landing.how.\${n}.desc\`)}</p></li>\`)}
        </ol>
      </section>

      <section class="promise glass">
        <span class="icon-badge grad">\${icon('lock-keyhole')}</span>
        <div><h2>\${t('landing.promise.title')}</h2><p>\${t('landing.promise.desc')}</p></div>
        <button class="btn btn-primary btn-lg" data-action="start-register">\${t('landing.promise.cta')}\${icon('arrow-right')}</button>
      </section>

      <footer class="site-foot">
        <span>© \${new Date().getFullYear()} Cord</span>
        <a href="https://cordsuite.app" target="_blank" rel="noopener">\${t('landing.footer.suite')}</a>
        <a href="https://cordsuite.app/status" target="_blank" rel="noopener">\${t('landing.footer.status')}</a>
        <span class="spacer"></span>
        <a href="/.well-known/openid-configuration">\${t('landing.footer.oidc')}</a>
      </footer>
    </main>\`);
  authHandle?.destroy();
  authHandle = mountAuth($('#connexion'), { mode, resetToken, onSuccess: afterLogin });
}

async function afterLogin(result, meta = {}) {
  history.replaceState(null, '', '/#apercu');
  await loadAccount();
  state.route = 'apercu';
  renderShell();
  scrollTo({ top: 0 });
  const name = state.account.user.name;
  if (meta.registered) {
    celebrate();
    toast(meta.verified ? t('verify.done') : t('auth.verifySent', { email: state.account.user.email }), {
      type: 'success',
      duration: 8000,
      ...(meta.devUrl ? { action: { href: meta.devUrl, label: t('auth.devLink') } } : {}),
    });
  } else toast(t('auth.welcomeBack', { name }), { type: 'success', duration: 3000 });
}

Object.assign(ACTIONS, {
  'toggle-theme'() {
    const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    if (state.account) {
      state.account.user.theme = next;
      api('/api/me', { theme: next }, 'PATCH').catch(() => {});
      renderShell();
    } else {
      $$('[data-action="toggle-theme"]').forEach((b) => render(b, icon(next === 'dark' ? 'sun' : 'moon')));
    }
  },
  'toggle-locale'() {
    setLocale(locale === 'fr' ? 'en' : 'fr');
    if (state.account) {
      state.account.user.locale = locale;
      api('/api/me', { locale }, 'PATCH').catch(() => {});
      renderShell();
    } else showLanding();
  },
  'focus-auth'() {
    const card = $('#connexion');
    card?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' });
    setTimeout(() => $('input', card)?.focus({ preventScroll: true }), 350);
  },
  'start-register'() {
    authHandle?.go('register');
    ACTIONS['focus-auth']();
  },
});

// src/30-shell.js
/* Coque de l'espace connecté : navigation, routage par ancre, en-têtes. */

messages({
  fr: {
    'nav.overview': 'Accueil', 'nav.search': 'Rechercher ou aller à…', 'nav.inbox': 'Notifications', 'nav.profile': 'Profil', 'nav.security': 'Sécurité', 'nav.devices': 'Appareils',
    'nav.apps': 'Apps', 'nav.activity': 'Activité', 'nav.privacy': 'Confidentialité', 'nav.admin': 'Administration',
    'nav.more': 'Plus', 'nav.logout': 'Se déconnecter', 'nav.section.account': 'Compte', 'nav.section.data': 'Données',
    'nav.section.owner': 'Propriétaire', 'nav.menu': 'Menu du compte',
    'logout.done': 'Tu es déconnecté. À bientôt !',
    'score.excellent': 'Protection excellente', 'score.good': 'Bonne protection', 'score.weak': 'À renforcer', 'score.label': 'sécurité',
  },
  en: {
    'nav.overview': 'Home', 'nav.search': 'Search or jump to…', 'nav.inbox': 'Notifications', 'nav.profile': 'Profile', 'nav.security': 'Security', 'nav.devices': 'Devices',
    'nav.apps': 'Apps', 'nav.activity': 'Activity', 'nav.privacy': 'Privacy', 'nav.admin': 'Admin',
    'nav.more': 'More', 'nav.logout': 'Sign out', 'nav.section.account': 'Account', 'nav.section.data': 'Data',
    'nav.section.owner': 'Owner', 'nav.menu': 'Account menu',
    'logout.done': 'You’re signed out. See you soon!',
    'score.excellent': 'Excellent protection', 'score.good': 'Good protection', 'score.weak': 'Needs attention', 'score.label': 'security',
  },
});

const ROUTES = [
  { id: 'apercu', icon: 'house', label: 'nav.overview', section: 'account', tab: true, dock: true },
  { id: 'securite', icon: 'shield-check', label: 'nav.security', section: 'account', tab: true, dock: true },
  { id: 'appareils', icon: 'monitor-smartphone', label: 'nav.devices', section: 'account', tab: true, dock: true },
  { id: 'apps', icon: 'layout-grid', label: 'nav.apps', section: 'account', tab: true, dock: true },
  { id: 'profil', icon: 'user-round', label: 'nav.profile', section: 'account' },
  { id: 'activite', icon: 'history', label: 'nav.activity', section: 'data', dock: true },
  { id: 'confidentialite', icon: 'lock-keyhole', label: 'nav.privacy', section: 'data' },
  { id: 'admin', icon: 'chart-column', label: 'nav.admin', section: 'owner', admin: true },
];
const routeFromHash = () => {
  const id = location.hash.replace(/^#\\/?/, '').split('?')[0];
  const route = ROUTES.find((r) => r.id === id);
  if (!route || (route.admin && !state.account?.user.admin)) return 'apercu';
  return id;
};

/** Score de sécurité 0-100 et recommandations. */
function securityScore(account = state.account) {
  const { user, security, passkeys, passcord } = account;
  const checks = [
    { id: 'email', ok: user.emailVerified, weight: 20 },
    { id: 'mfa', ok: security.mfa, weight: 25 },
    { id: 'strong', ok: passkeys.length + passcord.length > 0, weight: 25 },
    { id: 'recovery', ok: !security.mfa || security.recoveryCodesLeft >= 3, weight: 10 },
    { id: 'alerts', ok: user.alerts, weight: 10 },
    { id: 'fresh', ok: Boolean(security.passwordChangedAt && Date.now() - security.passwordChangedAt < 400 * 86400_000), weight: 10 },
  ];
  const value = checks.reduce((sum, c) => sum + (c.ok ? c.weight : 0), 0);
  const tone = value >= 85 ? 'ok' : value >= 55 ? 'warn' : 'danger';
  const label = t(value >= 85 ? 'score.excellent' : value >= 55 ? 'score.good' : 'score.weak');
  return { value, tone, label, checks };
}

function pageHead({ eyebrow, title, desc, actions }) {
  return html\`<header class="page-head">
    <div>\${eyebrow ? html\`<p class="eyebrow">\${eyebrow}</p>\` : ''}<h1 tabindex="-1" data-page-title>\${title}</h1>\${desc ? html\`<p>\${desc}</p>\` : ''}</div>
    \${actions ? html\`<div class="row-wrap">\${actions}</div>\` : ''}
  </header>\`;
}

function navLink(route, { tab = false } = {}) {
  const current = state.route === route.id;
  const a = state.account;
  let extra = '';
  if (!tab) {
    if (route.id === 'securite' && securityScore().value < 55) extra = html\`<span class="dot-alert" aria-hidden="true"></span>\`;
    if (route.id === 'apps' && a.apps.length) extra = html\`<span class="count">\${a.apps.length}</span>\`;
    if (route.id === 'appareils') extra = html\`<span class="count">\${a.sessions.length}</span>\`;
  }
  return html\`<a href="#\${route.id}" \${current ? raw('aria-current="page"') : ''}>\${icon(route.icon)}<span>\${t(route.label)}</span>\${extra}</a>\`;
}

let lastRendered = null;
function renderShell() {
  const account = state.account;
  if (!account) return showLanding();
  state.route = routeFromHash();
  const user = account.user;
  const view = VIEWS[state.route];
  const visible = ROUTES.filter((r) => !r.admin || user.admin);
  const app = $('#app');
  app.removeAttribute('aria-busy');
  document.title = \`\${t(ROUTES.find((r) => r.id === state.route).label)} · Compte Cord\`;
  const moreActive = !ROUTES.find((r) => r.id === state.route)?.tab;
  const unread = state.hub?.unread ?? account.unread ?? 0;
  const bell = (cls = '') => html\`<button class="btn btn-ghost btn-icon dock-bell \${cls}" data-action="inbox" aria-label="\${t('nav.inbox')}\${unread ? \` (\${unread})\` : ''}" aria-haspopup="dialog">\${icon(unread ? 'bell' : 'bell')}\${unread ? html\`<span class="badge-dot">\${unread > 9 ? '9+' : unread}</span>\` : ''}</button>\`;
  const others = visible.filter((r) => !r.dock);
  render(app, html\`<div class="shell">
    <header class="dock" aria-label="\${t('nav.menu')}">
      <a class="brand" href="#apercu"><img src="/assets/icon-180.png" alt="" width="32" height="32"><span class="name">Compte Cord</span></a>
      <nav class="dock-nav">
        \${visible.filter((r) => r.dock).map((r) => html\`<a href="#\${r.id}" \${state.route === r.id ? raw('aria-current="page"') : ''}>\${icon(r.icon)}<span>\${t(r.label)}</span>\${r.id === 'securite' && securityScore().value < 55 ? html\`<span class="dot-alert" aria-hidden="true"></span>\` : ''}</a>\`)}
        <button type="button" class="dock-more" data-action="more" \${others.some((r) => r.id === state.route) ? raw('aria-current="page"') : ''}>\${icon('ellipsis')}<span>\${t('nav.more')}</span></button>
      </nav>
      <button class="dock-search" data-action="palette" aria-label="\${t('nav.search')}">\${icon('search')}<span>\${t('nav.search')}</span><kbd>\${/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl'} K</kbd></button>
      \${bell()}
      <button class="avatar-btn" data-action="more" aria-label="\${t('nav.menu')}">\${avatar(user, 'sm')}</button>
    </header>
    <div class="mobile-top">
      <a class="brand" href="#apercu"><img src="/assets/icon-180.png" alt="" width="30" height="30"><span class="name">Compte Cord</span></a>
      <span class="spacer"></span>
      <button class="btn btn-ghost btn-icon" data-action="palette" aria-label="\${t('nav.search')}">\${icon('search')}</button>
      \${bell()}
      <button class="avatar-btn" data-action="more" aria-label="\${t('nav.menu')}">\${avatar(user, 'sm')}</button>
    </div>
    <main class="main" id="main"><div class="main-inner" data-view="\${state.route}">\${view.render(account)}</div></main>
    <nav class="tabbar" aria-label="\${t('nav.menu')}">
      \${ROUTES.filter((r) => r.tab).map((r) => html\`<a href="#\${r.id}" \${state.route === r.id ? raw('aria-current="page"') : ''}>\${icon(r.icon)}<span>\${t(r.label)}</span></a>\`)}
      <button type="button" data-action="more" \${moreActive ? raw('aria-current="page"') : ''}>\${icon('ellipsis')}<span>\${t('nav.more')}</span></button>
    </nav>
  </div>\`);
  view.mount?.($('[data-view]', app), account);
  if (lastRendered && lastRendered !== state.route) {
    $('[data-page-title]', app)?.focus({ preventScroll: true });
    scrollTo({ top: 0, behavior: 'instant' });
  }
  lastRendered = state.route;
}

addEventListener('hashchange', () => {
  if (state.account && !location.pathname.startsWith('/authorize')) renderShell();
});

Object.assign(ACTIONS, {
  async logout() {
    await api('/api/logout', {});
    state.account = null;
    history.replaceState(null, '', '/');
    showLanding();
    toast(t('logout.done'), { type: 'info', duration: 3000 });
  },
  more() {
    const user = state.account.user;
    modal({
      title: user.name,
      desc: user.email,
      body: html\`<div class="more-list">
        \${ROUTES.filter((r) => !r.tab && (!r.admin || user.admin)).map((r) => html\`<a href="#\${r.id}" data-close>\${icon(r.icon)}\${t(r.label)}</a>\`)}
        <button type="button" data-action="toggle-theme" data-close>\${icon(effectiveTheme() === 'dark' ? 'sun' : 'moon')}\${t('nav.theme')}</button>
        <button type="button" data-action="toggle-locale" data-close>\${icon('languages')}\${t('nav.lang')}</button>
        <button type="button" class="danger" data-action="logout" data-close>\${icon('log-out')}\${t('nav.logout')}</button>
      </div>\`,
      onOpen(ctx) {
        ctx.dialog.addEventListener('click', (event) => {
          const link = event.target.closest('a[href^="#"]');
          if (link) { location.hash = link.getAttribute('href'); }
        });
      },
    });
  },
});

// src/31-overview.js
/* Accueil : la Carte Cord, la suite (état remonté par chaque app), le fil commun. */

messages({
  fr: {
    'hello.morning': 'Bonjour, {name}', 'hello.evening': 'Bonsoir, {name}', 'hello.night': 'Encore debout, {name} ?',
    'hello.since': 'Membre depuis {date}', 'hello.verified': 'Email vérifié', 'hello.unverified': 'Email à confirmer',
    'verify.title': 'Confirme ton adresse email', 'verify.desc': 'Indispensable pour te connecter aux apps de la suite avec ton compte Cord.',
    'verify.send': 'Envoyer le code', 'verify.sent': 'Code envoyé à {email}. Il est valable 15 minutes.',
    'verify.code': 'Code reçu par email', 'verify.submit': 'Valider', 'verify.done': 'Adresse confirmée. Ton compte Cord est prêt !',
    'verify.resend': 'Renvoyer', 'verify.hint': 'Tape les 6 chiffres reçus, ou clique sur le lien de l’email.',
    'onboard.title': 'Bien démarrer', 'onboard.desc': '{done} sur {total}',
    'onboard.hide': 'Masquer', 'onboard.complete': 'Ton compte est prêt. Beau travail !',
    'onboard.email': 'Confirmer ton adresse email', 'onboard.email.desc': 'Pour utiliser Cord dans les apps.',
    'onboard.key': 'Associer Passcord ou une passkey', 'onboard.key.desc': 'Connexion sans mot de passe, validée par Face ID.',
    'onboard.mfa': 'Activer la double authentification', 'onboard.mfa.desc': 'Un code à usage unique en plus du mot de passe.',
    'onboard.avatar': 'Ajouter une photo', 'onboard.avatar.desc': 'Pour te reconnaître d’un coup d’œil dans les apps.',
    'onboard.app': 'Connecter une app', 'onboard.app.desc': 'Drivecord t’attend avec « Continuer avec Cord ».',
    'onboard.go': 'Y aller',
    'card.brand': 'Compte Cord', 'card.since': 'Membre depuis', 'card.id': 'Identifiant', 'card.apps': 'Apps reliées',
    'today.title': 'Aujourd’hui', 'today.next': 'Prochaine étape', 'today.ready': 'Tout est en ordre',
    'today.readyDesc': 'Ton compte est protégé et relié à ta suite.', 'today.unread': 'non lue(s)', 'today.sessions': 'session(s) ouverte(s)',
    'suite.title': 'Ta suite', 'suite.desc': 'Chaque app reliée à ton compte Cord te montre où tu en es, et s’ouvre déjà connectée.',
    'suite.open': 'Ouvrir', 'suite.start': 'Commencer avec Cord', 'suite.connected': 'Reliée', 'suite.notYet': 'Pas encore utilisée',
    'suite.idle': 'Reliée à ton compte. Ouvre-la pour que son résumé apparaisse ici.',
    'suite.betaJoin': 'Rejoindre la bêta', 'suite.betaIn': 'Tu es testeur', 'suite.betaDesc': 'Bêta fermée, sur invitation.',
    'suite.soon': 'Bientôt dans la suite', 'suite.updated': 'Mis à jour {when}',
    'suite.launcher': 'CordLauncher', 'suite.launcherDesc': 'Installe et met à jour la suite sur Windows.',
    'feed.title': 'Fil de la suite', 'feed.desc': 'Ce que tes apps t’envoient et ce qui se passe sur ton compte.', 'feed.all': 'Tout voir',
    'feed.empty': 'Rien pour l’instant', 'feed.emptyDesc': 'Les nouvelles de tes apps et de ton compte arriveront ici.',
  },
  en: {
    'hello.morning': 'Hello, {name}', 'hello.evening': 'Good evening, {name}', 'hello.night': 'Still up, {name}?',
    'hello.since': 'Member since {date}', 'hello.verified': 'Email verified', 'hello.unverified': 'Email to confirm',
    'verify.title': 'Confirm your email address', 'verify.desc': 'Required to sign in to the suite’s apps with your Cord account.',
    'verify.send': 'Send the code', 'verify.sent': 'Code sent to {email}. It’s valid for 15 minutes.',
    'verify.code': 'Code from the email', 'verify.submit': 'Confirm', 'verify.done': 'Address confirmed. Your Cord account is ready!',
    'verify.resend': 'Resend', 'verify.hint': 'Type the 6 digits you received, or click the link in the email.',
    'onboard.title': 'Get started', 'onboard.desc': '{done} of {total}',
    'onboard.hide': 'Hide', 'onboard.complete': 'Your account is ready. Nice work!',
    'onboard.email': 'Confirm your email address', 'onboard.email.desc': 'To use Cord in the apps.',
    'onboard.key': 'Pair Passcord or a passkey', 'onboard.key.desc': 'Passwordless sign-in, approved with Face ID.',
    'onboard.mfa': 'Turn on two-factor authentication', 'onboard.mfa.desc': 'A one-time code on top of your password.',
    'onboard.avatar': 'Add a photo', 'onboard.avatar.desc': 'So apps can show who you are at a glance.',
    'onboard.app': 'Connect an app', 'onboard.app.desc': 'Drivecord is waiting with “Continue with Cord”.',
    'onboard.go': 'Go',
    'card.brand': 'Cord Account', 'card.since': 'Member since', 'card.id': 'Identifier', 'card.apps': 'Linked apps',
    'today.title': 'Today', 'today.next': 'Next step', 'today.ready': 'All set',
    'today.readyDesc': 'Your account is protected and linked to your suite.', 'today.unread': 'unread', 'today.sessions': 'open session(s)',
    'suite.title': 'Your suite', 'suite.desc': 'Every app linked to your Cord account shows where you’re at, and opens already signed in.',
    'suite.open': 'Open', 'suite.start': 'Start with Cord', 'suite.connected': 'Linked', 'suite.notYet': 'Not used yet',
    'suite.idle': 'Linked to your account. Open it and its summary will show up here.',
    'suite.betaJoin': 'Join the beta', 'suite.betaIn': 'You’re a tester', 'suite.betaDesc': 'Closed beta, invite only.',
    'suite.soon': 'Coming to the suite', 'suite.updated': 'Updated {when}',
    'suite.launcher': 'CordLauncher', 'suite.launcherDesc': 'Installs and updates the suite on Windows.',
    'feed.title': 'Suite feed', 'feed.desc': 'What your apps send you and what happens on your account.', 'feed.all': 'See all',
    'feed.empty': 'Nothing yet', 'feed.emptyDesc': 'News from your apps and your account will land here.',
  },
});

function greeting(name) {
  const hour = new Date().getHours();
  const first = String(name).split(/\\s+/)[0];
  return t(hour >= 5 && hour < 18 ? 'hello.morning' : hour >= 18 || hour < 1 ? 'hello.evening' : 'hello.night', { name: first });
}

function onboardingSteps(a) {
  return [
    { id: 'email', done: a.user.emailVerified, action: 'send-verification' },
    { id: 'key', done: a.passkeys.length + a.passcord.length > 0, href: '#appareils' },
    { id: 'mfa', done: a.security.mfa, action: 'totp-setup' },
    { id: 'avatar', done: Boolean(a.user.avatarUrl), href: '#profil' },
    { id: 'app', done: a.apps.length > 0, href: 'https://drivecord.app/login?via=cord', external: true },
  ];
}

/** Identifiant lisible et stable, dérivé de l'id interne (CORD·4F2A·91C3). */
function cordId(id) {
  const h = hashString(id).toString(16).toUpperCase().padStart(8, '0').slice(-8);
  return \`CORD·\${h.slice(0, 4)}·\${h.slice(4)}\`;
}

function verifyCard(a) {
  if (a.user.emailVerified) return '';
  return html\`<section class="verify-strip glass" role="status">
    <span class="icon-badge tone-warn">\${icon('mail')}</span>
    <div class="grow"><p class="title">\${t('verify.title')}</p><p class="desc">\${t('verify.hint')}</p></div>
    <form id="verify-code" class="verify-form" novalidate>
      <input class="input input-otp" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="7" placeholder="••••••" aria-label="\${t('verify.code')}" required>
      <button class="btn btn-primary" type="submit">\${t('verify.submit')}</button>
      <button class="btn btn-ghost btn-sm" type="button" data-action="send-verification">\${t('verify.resend')}</button>
    </form>
  </section>\`;
}

function cordCard(a, score, linked) {
  const since = new Intl.DateTimeFormat(intlLocale(), { month: 'short', year: 'numeric' }).format(new Date(a.user.createdAt));
  return html\`<section class="cord-card" data-tilt>
    <span class="cc-holo" aria-hidden="true"></span><span class="cc-shine" aria-hidden="true"></span>
    <div class="cc-top">
      <img src="/assets/icon-180.png" alt="" width="30" height="30">
      <span class="cc-brand">\${t('card.brand')}</span>
      <a class="cc-level tone-\${score.tone}" href="#securite">\${icon('shield-check')}\${score.label}</a>
    </div>
    <div class="cc-id">
      <div class="avatar-ring avatar-xl">\${avatar(a.user)}</div>
      <div class="cc-who">
        <h1 tabindex="-1" data-page-title>\${greeting(a.user.name)}</h1>
        <p><span class="break">\${a.user.email}</span>\${a.user.emailVerified ? html\`<span class="cc-check" title="\${t('hello.verified')}">\${icon('badge-check')}</span>\` : ''}</p>
      </div>
    </div>
    <dl class="cc-bottom">
      <div><dt>\${t('card.since')}</dt><dd>\${since}</dd></div>
      <div><dt>\${t('card.id')}</dt><dd class="mono">\${cordId(a.user.id)}</dd></div>
      <div><dt>\${t('card.apps')}</dt><dd>\${linked}</dd></div>
      <span class="cc-chip" aria-hidden="true"></span>
    </dl>
  </section>\`;
}

function todayPanel(a, score, hub) {
  const steps = onboardingSteps(a);
  const next = steps.find((s) => !s.done);
  const done = steps.filter((s) => s.done).length;
  const unread = hub?.unread ?? a.unread ?? 0;
  return html\`<section class="today glass">
    <div class="today-head"><p class="eyebrow">\${t('today.title')} · \${fmtDate(Date.now())}</p></div>
    <a class="today-score" href="#securite">\${scoreRing(score.value, { size: 84, stroke: 8, caption: t('score.label') })}<span><strong>\${score.label}</strong><small>\${t('onboard.desc', { done, total: steps.length })}</small></span></a>
    \${next
      ? html\`<div class="today-next"><p class="eyebrow">\${t('today.next')}</p><p class="title">\${t(\`onboard.\${next.id}\`)}</p><p class="desc">\${t(\`onboard.\${next.id}.desc\`)}</p>
          \${next.href
            ? html\`<a class="btn btn-primary btn-sm" href="\${next.href}" \${next.external ? raw('target="_blank" rel="noopener"') : ''}>\${t('onboard.go')}\${icon('arrow-right')}</a>\`
            : html\`<button class="btn btn-primary btn-sm" data-action="\${next.action}">\${t('onboard.go')}\${icon('arrow-right')}</button>\`}</div>\`
      : html\`<div class="today-next done"><p class="title">\${icon('circle-check')}\${t('today.ready')}</p><p class="desc">\${t('today.readyDesc')}</p></div>\`}
    <div class="today-counters">
      <button type="button" class="counter" data-action="inbox"><strong>\${unread}</strong><span>\${icon('bell')}\${t('today.unread')}</span></button>
      <a class="counter" href="#appareils"><strong>\${a.sessions.length}</strong><span>\${icon('monitor-smartphone')}\${t('today.sessions')}</span></a>
    </div>
  </section>\`;
}

function appTile(app) {
  const s = app.appStatus;
  const beta = app.beta;
  const soon = app.status === 'soon';
  const wide = app.connected && s;
  let body;
  let actions;
  if (beta && !app.connected) {
    body = html\`<p class="tile-headline">\${beta.access ? t('suite.betaIn') : t('suite.betaDesc')}</p>\`;
    actions = html\`<a class="btn btn-sm \${beta.access ? 'btn-primary' : 'btn-glass'}" href="#apps">\${beta.access ? t('suite.open') : t('suite.betaJoin')}\${icon('arrow-right')}</a>\`;
  } else if (app.connected && s) {
    body = html\`<p class="tile-headline">\${s.headline}</p>\${s.detail ? html\`<p class="tile-detail">\${s.detail}</p>\` : ''}
      \${s.metrics?.length ? html\`<div class="tile-metrics">\${s.metrics.map((m) => html\`<span><strong>\${m.value}</strong>\${m.label}</span>\`)}</div>\` : ''}
      <p class="tile-updated">\${t('suite.updated', { when: fmtRelative(s.updatedAt) })}</p>\`;
    actions = app.launch ? html\`<a class="btn btn-sm btn-primary" href="\${s.url ?? app.launch}" target="_blank" rel="noopener">\${t('suite.open')}\${icon('arrow-up-right')}</a>\` : '';
  } else if (app.connected) {
    body = html\`<p class="tile-detail">\${t('suite.idle')}</p>\`;
    actions = app.launch ? html\`<a class="btn btn-sm btn-primary" href="\${app.launch}" target="_blank" rel="noopener">\${t('suite.open')}\${icon('arrow-up-right')}</a>\` : '';
  } else {
    body = html\`<p class="tile-detail">\${app.description}</p>\`;
    actions = app.launch ? html\`<a class="btn btn-sm btn-glass" href="\${app.launch}" target="_blank" rel="noopener">\${t('suite.start')}\${icon('arrow-up-right')}</a>\` : '';
  }
  return html\`<article class="tile \${wide ? 'wide' : ''} \${soon ? 'soon' : ''} \${app.connected ? 'is-linked' : ''}" data-accent="\${app.accent.join(',')}">
    <span class="tile-glow" aria-hidden="true"></span>
    <header><img src="\${app.logo}" alt="" width="44" height="44" loading="lazy"><div class="grow"><h3>\${app.name}</h3><p>\${app.tagline}</p></div>
      \${app.connected ? html\`<span class="badge tone-ok"><span class="dot"></span>\${t('suite.connected')}</span>\` : beta ? html\`<span class="badge tone-warn">Bêta</span>\` : ''}</header>
    <div class="tile-body">\${body}</div>
    \${actions ? html\`<footer>\${actions}</footer>\` : ''}
  </article>\`;
}

function suiteSection(hub) {
  if (!hub) return html\`<section class="bento">\${[1, 2, 3].map(() => html\`<div class="skeleton tile-sk"></div>\`)}</section>\`;
  const active = hub.apps.filter((a) => a.status !== 'soon');
  const soon = hub.apps.filter((a) => a.status === 'soon');
  // Les apps reliées d'abord, celles avec un résumé en tête.
  active.sort((x, y) => Number(Boolean(y.connected)) - Number(Boolean(x.connected)) || Number(Boolean(y.appStatus)) - Number(Boolean(x.appStatus)));
  const launcher = hub.launcher;
  return html\`<section class="suite">
    <div class="section-head"><div><h2>\${t('suite.title')}</h2><p>\${t('suite.desc')}</p></div></div>
    <div class="bento">
      \${active.map((app) => appTile(app))}
      \${launcher ? html\`<article class="tile is-linked" data-accent="#6e58f0,#b842ec">
        <span class="tile-glow" aria-hidden="true"></span>
        <header><img src="/assets/icon-180.png" alt="" width="44" height="44"><div class="grow"><h3>\${t('suite.launcher')}</h3><p>\${t('suite.launcherDesc')}</p></div><span class="badge tone-ok"><span class="dot"></span>\${t('suite.connected')}</span></header>
        <div class="tile-body"><p class="tile-headline">\${launcher.headline}</p>\${launcher.detail ? html\`<p class="tile-detail">\${launcher.detail}</p>\` : ''}
          \${launcher.metrics?.length ? html\`<div class="tile-metrics">\${launcher.metrics.map((m) => html\`<span><strong>\${m.value}</strong>\${m.label}</span>\`)}</div>\` : ''}
          <p class="tile-updated">\${t('suite.updated', { when: fmtRelative(launcher.updatedAt) })}</p></div>
      </article>\` : ''}
    </div>
    \${soon.length ? html\`<div class="soon-row"><span class="eyebrow">\${t('suite.soon')}</span>\${soon.map((app) => html\`<span class="soon-chip" data-accent="\${app.accent.join(',')}" title="\${app.description}"><img src="\${app.logo}" alt="" width="22" height="22" loading="lazy">\${app.name}</span>\`)}</div>\` : ''}
  </section>\`;
}

function feedSection(a) {
  const notes = (inboxState.items ?? []).slice(0, 8).map((n) => ({ at: n.createdAt, note: n }));
  const events = a.activity.slice(0, 8).map((e) => ({ at: e.at, event: e }));
  const items = [...notes, ...events].sort((x, y) => y.at - x.at).slice(0, 8);
  return html\`<section class="feed glass">
    <div class="card-head"><div class="grow"><h2 class="card-title">\${t('feed.title')}</h2><p class="card-desc">\${t('feed.desc')}</p></div><a class="link-btn" href="#activite">\${t('feed.all')}\${icon('chevron-right')}</a></div>
    \${items.length
      ? html\`<ol class="feed-list">\${items.map((it) => it.note
          ? html\`<li class="\${it.note.readAt ? '' : 'unread'}"><img class="feed-logo" src="\${it.note.logo ?? '/assets/icon-180.png'}" alt="" width="34" height="34">
              <div class="grow"><p class="what"><strong>\${it.note.name}</strong> · \${it.note.title}</p>\${it.note.body ? html\`<p class="more">\${it.note.body}</p>\` : ''}</div>
              <time>\${fmtRelative(it.at)}</time>\${it.note.url ? html\`<a class="btn btn-ghost btn-icon btn-sm" href="\${it.note.url}" target="_blank" rel="noopener" aria-label="\${t('suite.open')}">\${icon('arrow-up-right')}</a>\` : ''}</li>\`
          : (() => { const [ic, tone] = EVENT_STYLE[it.event.kind] ?? ['activity', 'tone-muted']; return html\`<li><span class="icon-badge sm \${tone}">\${icon(ic)}</span>
              <div class="grow"><p class="what">\${t(\`ev.\${it.event.kind}\`)}</p>\${it.event.device ? html\`<p class="more">\${it.event.device.label}</p>\` : ''}</div><time>\${fmtRelative(it.at)}</time></li>\`; })())}</ol>\`
      : emptyState({ iconName: 'orbit', title: t('feed.empty'), desc: t('feed.emptyDesc') })}
  </section>\`;
}

VIEWS.apercu = {
  render(a) {
    const score = securityScore(a);
    const hub = state.hub;
    const linked = hub ? hub.apps.filter((x) => x.connected).length : a.apps.length;
    return html\`<div class="view hub">
      \${verifyCard(a)}
      <div class="hub-hero">\${cordCard(a, score, linked)}\${todayPanel(a, score, hub)}</div>
      \${suiteSection(hub)}
      \${feedSection(a)}
    </div>\`;
  },
  mount(root) {
    if (!inboxState.items && !inboxState.loading) loadInbox().then(() => { if (state.route === 'apercu') renderShell(); });
    const form = $('#verify-code', root);
    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const input = $('[name="code"]', form);
      try {
        await busy(event.submitter ?? $('[type="submit"]', form), () => api('/api/email/verify-code', { code: input.value }));
        celebrate();
        toast(t('verify.done'));
        await refresh();
      } catch (e) {
        input.setAttribute('aria-invalid', 'true');
        input.select();
        toastError(e);
      }
    });
  },
};

// Carte Cord : légère inclinaison 3D et reflet qui suivent le pointeur.
document.addEventListener('pointermove', (event) => {
  const card = event.target.closest?.('[data-tilt]');
  if (!card || event.pointerType === 'touch' || reducedMotion()) return;
  const r = card.getBoundingClientRect();
  const x = (event.clientX - r.left) / r.width;
  const y = (event.clientY - r.top) / r.height;
  card.style.setProperty('--rx', \`\${((0.5 - y) * 7).toFixed(2)}deg\`);
  card.style.setProperty('--ry', \`\${((x - 0.5) * 9).toFixed(2)}deg\`);
  card.style.setProperty('--px', \`\${(x * 100).toFixed(1)}%\`);
  card.style.setProperty('--py', \`\${(y * 100).toFixed(1)}%\`);
}, { passive: true });
document.addEventListener('pointerout', (event) => {
  const card = event.target.closest?.('[data-tilt]');
  if (!card || card.contains(event.relatedTarget)) return;
  card.style.setProperty('--rx', '0deg');
  card.style.setProperty('--ry', '0deg');
});

Object.assign(ACTIONS, {
  async 'send-verification'(button) {
    await busy(button, async () => {
      const result = await api('/api/email/send', {});
      toast(t('verify.sent', { email: state.account?.user.email ?? '' }), {
        duration: 8000,
        ...(result.devUrl ? { action: { href: result.devUrl, label: t('auth.devLink') } } : {}),
      });
      if (result.devCode) console.info('[dev] code email :', result.devCode);
    });
    if (state.route === 'apercu') $('#verify-code [name="code"]')?.focus();
  },
  'hide-onboarding'() {
    try { localStorage.setItem('cord:onboarding-hidden', '1'); } catch { /* stockage indisponible */ }
    renderShell();
  },
});

// src/32-security.js
/* Sécurité : mot de passe, double authentification (TOTP), passkeys, alertes. */

messages({
  fr: {
    'sec.title': 'Sécurité', 'sec.desc': 'Comment tu te connectes, et ce qui protège ton compte si un mot de passe fuit.',
    'sec.score.title': 'Niveau de protection', 'sec.score.all': 'Tout est en ordre. Ton compte est très bien protégé.',
    'sec.tip.email': 'Confirme ton adresse email', 'sec.tip.mfa': 'Active la double authentification', 'sec.tip.strong': 'Ajoute une passkey ou associe Passcord',
    'sec.tip.recovery': 'Régénère tes codes de secours (moins de 3 restants)', 'sec.tip.alerts': 'Réactive les alertes de connexion', 'sec.tip.fresh': 'Change ton mot de passe (plus d’un an)',
    'sec.methods': 'Méthodes de connexion',
    'sec.password': 'Mot de passe', 'sec.password.changed': 'Modifié {when}', 'sec.password.unknown': 'Défini à la création du compte', 'sec.password.change': 'Changer',
    'sec.mfa': 'Double authentification (2FA)', 'sec.mfa.off': 'Un code à 6 chiffres depuis une app comme 1Password, Authy ou Google Authenticator, en plus du mot de passe.',
    'sec.mfa.on': 'Activée {when} · {n} codes de secours restants', 'sec.mfa.enable': 'Activer', 'sec.mfa.disable': 'Désactiver', 'sec.mfa.codes': 'Nouveaux codes de secours',
    'sec.passkeys': 'Passkeys', 'sec.passkeys.desc': 'Connexion instantanée avec Face ID, Touch ID, Windows Hello ou ton téléphone. Rien à retenir, rien à voler.',
    'sec.passkeys.add': 'Ajouter une passkey', 'sec.passkeys.empty': 'Aucune passkey pour l’instant.', 'sec.passkeys.unsupported': 'Ce navigateur ne gère pas les passkeys.',
    'sec.passkeys.synced': 'Synchronisée', 'sec.passkeys.added': 'Ajoutée {when}', 'sec.passkeys.used': 'Utilisée {when}', 'sec.passkeys.unused': 'Jamais utilisée',
    'sec.passkeys.name': 'Nom de la passkey', 'sec.passkeys.nameHint': 'Pour la reconnaître : « MacBook », « iPhone de Luna »…',
    'sec.passkeys.create': 'Créer la passkey', 'sec.passkeys.done': 'Passkey ajoutée. Tu pourras te connecter sans mot de passe.',
    'sec.passkeys.cancelled': 'Création annulée.', 'sec.passkeys.removeTitle': 'Supprimer « {name} » ?',
    'sec.passkeys.removeDesc': 'Tu ne pourras plus te connecter avec cette passkey. Pense aussi à la retirer de ton gestionnaire de mots de passe.',
    'sec.passkeys.removed': 'Passkey supprimée.', 'sec.passkeys.exists': 'Cet appareil a déjà une passkey pour ton compte Cord.', 'sec.passkeys.renamed': 'Passkey renommée.',
    'sec.passcord': 'Passcord sur iPhone', 'sec.passcord.none': 'Ton iPhone peut valider tes connexions avec Face ID.', 'sec.passcord.some': '{n} iPhone associé(s)', 'sec.passcord.manage': 'Gérer',
    'sec.alerts': 'Alertes par email', 'sec.alerts.login': 'Nouvelle connexion', 'sec.alerts.loginDesc': 'Un email quand ton compte est utilisé depuis un appareil inconnu.',
    'sec.alerts.always': 'Toujours envoyées', 'sec.alerts.alwaysDesc': 'Changement de mot de passe, d’email, de 2FA ou ajout de passkey.',
    'sec.alerts.on': 'Alertes de connexion activées.', 'sec.alerts.off': 'Alertes de connexion désactivées.',
    'pw.title': 'Changer le mot de passe', 'pw.desc': 'Les autres appareils seront déconnectés.', 'pw.current': 'Mot de passe actuel', 'pw.new': 'Nouveau mot de passe',
    'pw.confirm': 'Confirme le nouveau', 'pw.submit': 'Changer le mot de passe', 'pw.recent': 'Tu viens de te connecter avec {method} : pas besoin de l’ancien mot de passe.',
    'pw.done': 'Mot de passe changé. {n} autre(s) session(s) fermée(s).',
    'totp.title': 'Activer la double authentification', 'totp.step1': 'Scanne ce QR code avec ton application d’authentification.',
    'totp.manual': 'Ou saisis la clé à la main', 'totp.openApp': 'Ouvrir dans l’app', 'totp.step2': 'Saisis le code à 6 chiffres affiché par l’application.',
    'totp.code': 'Code de vérification', 'totp.verify': 'Vérifier et activer', 'totp.next': 'J’ai scanné le code',
    'totp.step3': 'Garde ces codes de secours en lieu sûr. Chacun permet une connexion si tu perds ton téléphone.',
    'totp.saved': 'J’ai mis mes codes de secours à l’abri', 'totp.download': 'Télécharger (.txt)', 'totp.copyAll': 'Tout copier',
    'totp.finish': 'Terminer', 'totp.done': 'Double authentification activée. Ton compte est bien mieux protégé.',
    'totp.disableTitle': 'Désactiver la double authentification ?', 'totp.disableDesc': 'Saisis un code de ton application (ou un code de secours) pour confirmer.',
    'totp.disabled': 'Double authentification désactivée.', 'totp.regenTitle': 'Nouveaux codes de secours', 'totp.regenDesc': 'Les anciens codes cesseront de fonctionner. Confirme avec un code de ton application.',
    'reauth.title': 'Confirme que c’est bien toi', 'reauth.desc': 'Pour ajouter une protection à ton compte, saisis ton mot de passe. On ne te le redemandera pas avant un moment.',
    'totp.regenerate': 'Générer de nouveaux codes', 'totp.file': 'Codes de secours du Compte Cord\\n{email}\\nGénérés le {date}\\n\\nChaque code ne sert qu’une fois.\\n\\n',
  },
  en: {
    'sec.title': 'Security', 'sec.desc': 'How you sign in, and what protects your account if a password leaks.',
    'sec.score.title': 'Protection level', 'sec.score.all': 'All good. Your account is very well protected.',
    'sec.tip.email': 'Confirm your email address', 'sec.tip.mfa': 'Turn on two-factor authentication', 'sec.tip.strong': 'Add a passkey or pair Passcord',
    'sec.tip.recovery': 'Regenerate your recovery codes (fewer than 3 left)', 'sec.tip.alerts': 'Turn sign-in alerts back on', 'sec.tip.fresh': 'Change your password (over a year old)',
    'sec.methods': 'Sign-in methods',
    'sec.password': 'Password', 'sec.password.changed': 'Changed {when}', 'sec.password.unknown': 'Set when the account was created', 'sec.password.change': 'Change',
    'sec.mfa': 'Two-factor authentication (2FA)', 'sec.mfa.off': 'A 6-digit code from an app like 1Password, Authy or Google Authenticator, on top of your password.',
    'sec.mfa.on': 'On since {when} · {n} recovery codes left', 'sec.mfa.enable': 'Turn on', 'sec.mfa.disable': 'Turn off', 'sec.mfa.codes': 'New recovery codes',
    'sec.passkeys': 'Passkeys', 'sec.passkeys.desc': 'Instant sign-in with Face ID, Touch ID, Windows Hello or your phone. Nothing to remember, nothing to steal.',
    'sec.passkeys.add': 'Add a passkey', 'sec.passkeys.empty': 'No passkeys yet.', 'sec.passkeys.unsupported': 'This browser doesn’t support passkeys.',
    'sec.passkeys.synced': 'Synced', 'sec.passkeys.added': 'Added {when}', 'sec.passkeys.used': 'Used {when}', 'sec.passkeys.unused': 'Never used',
    'sec.passkeys.name': 'Passkey name', 'sec.passkeys.nameHint': 'To recognize it: “MacBook”, “Luna’s iPhone”…',
    'sec.passkeys.create': 'Create passkey', 'sec.passkeys.done': 'Passkey added. You can now sign in without a password.',
    'sec.passkeys.cancelled': 'Creation cancelled.', 'sec.passkeys.removeTitle': 'Remove “{name}”?',
    'sec.passkeys.removeDesc': 'You won’t be able to sign in with this passkey anymore. Also remove it from your password manager.',
    'sec.passkeys.removed': 'Passkey removed.', 'sec.passkeys.exists': 'This device already has a passkey for your Cord account.', 'sec.passkeys.renamed': 'Passkey renamed.',
    'sec.passcord': 'Passcord on iPhone', 'sec.passcord.none': 'Your iPhone can approve your sign-ins with Face ID.', 'sec.passcord.some': '{n} iPhone(s) paired', 'sec.passcord.manage': 'Manage',
    'sec.alerts': 'Email alerts', 'sec.alerts.login': 'New sign-in', 'sec.alerts.loginDesc': 'An email when your account is used from an unknown device.',
    'sec.alerts.always': 'Always sent', 'sec.alerts.alwaysDesc': 'Password, email or 2FA changes, and new passkeys.',
    'sec.alerts.on': 'Sign-in alerts on.', 'sec.alerts.off': 'Sign-in alerts off.',
    'pw.title': 'Change password', 'pw.desc': 'Your other devices will be signed out.', 'pw.current': 'Current password', 'pw.new': 'New password',
    'pw.confirm': 'Confirm new password', 'pw.submit': 'Change password', 'pw.recent': 'You just signed in with {method}: no need for the old password.',
    'pw.done': 'Password changed. {n} other session(s) signed out.',
    'totp.title': 'Turn on two-factor authentication', 'totp.step1': 'Scan this QR code with your authenticator app.',
    'totp.manual': 'Or enter the key manually', 'totp.openApp': 'Open in app', 'totp.step2': 'Enter the 6-digit code shown by the app.',
    'totp.code': 'Verification code', 'totp.verify': 'Verify and turn on', 'totp.next': 'I scanned the code',
    'totp.step3': 'Keep these recovery codes somewhere safe. Each one lets you sign in if you lose your phone.',
    'totp.saved': 'I stored my recovery codes safely', 'totp.download': 'Download (.txt)', 'totp.copyAll': 'Copy all',
    'totp.finish': 'Finish', 'totp.done': 'Two-factor authentication is on. Your account is much safer.',
    'totp.disableTitle': 'Turn off two-factor authentication?', 'totp.disableDesc': 'Enter a code from your app (or a recovery code) to confirm.',
    'totp.disabled': 'Two-factor authentication turned off.', 'totp.regenTitle': 'New recovery codes', 'totp.regenDesc': 'Your old codes will stop working. Confirm with a code from your app.',
    'reauth.title': 'Confirm it’s you', 'reauth.desc': 'To add a protection to your account, enter your password. We won’t ask again for a while.',
    'totp.regenerate': 'Generate new codes', 'totp.file': 'Cord Account recovery codes\\n{email}\\nGenerated on {date}\\n\\nEach code works once.\\n\\n',
  },
});

const currentSession = () => state.account?.sessions.find((s) => s.current);
const recentStrongLogin = () => {
  const s = currentSession();
  return s && ['passcord', 'passkey', 'reset'].includes(s.method) && Date.now() - s.createdAt < 14 * 60_000 ? s.method : null;
};

VIEWS.securite = {
  render(a) {
    const score = securityScore(a);
    const tips = score.checks.filter((c) => !c.ok);
    const tipAction = { email: 'send-verification', mfa: 'totp-setup', strong: passkeysSupported() ? 'passkey-add' : null, recovery: 'totp-regenerate', alerts: 'alerts-on', fresh: 'password-change' };
    return html\`<div class="view">
      \${pageHead({ eyebrow: t('nav.section.account'), title: t('sec.title'), desc: t('sec.desc') })}
      <section class="card glass">
        <div class="method">
          \${scoreRing(score.value, { size: 96, stroke: 9, caption: t('score.label') })}
          <div><h2 class="card-title">\${t('sec.score.title')} · <span class="tone-\${score.tone}">\${score.label}</span></h2>
            \${tips.length ? html\`<ul class="never tips">\${tips.map((c) => html\`<li>\${icon('chevron-right')}<span>\${t(\`sec.tip.\${c.id}\`)}</span></li>\`)}</ul>\` : html\`<p class="card-desc">\${t('sec.score.all')}</p>\`}
          </div>
          <div class="state">\${tips.length && (tipAction[tips[0].id] || tips[0].id === 'strong') ? (tipAction[tips[0].id]
            ? html\`<button class="btn btn-primary btn-sm" data-action="\${tipAction[tips[0].id]}">\${t(\`sec.tip.\${tips[0].id}\`)}</button>\`
            : html\`<a class="btn btn-primary btn-sm" href="#appareils">\${t(\`sec.tip.\${tips[0].id}\`)}</a>\`) : ''}</div>
        </div>
      </section>

      <div class="section-title"><h2>\${t('sec.methods')}</h2></div>

      <section class="card glass">
        <div class="method">
          <span class="icon-badge">\${icon('key-round')}</span>
          <div><h3 class="card-title">\${t('sec.password')}</h3><p class="card-desc">\${a.security.passwordChangedAt ? t('sec.password.changed', { when: fmtRelative(a.security.passwordChangedAt) }) : t('sec.password.unknown')}</p></div>
          <div class="state"><button class="btn btn-glass btn-sm" data-action="password-change">\${icon('pencil')}\${t('sec.password.change')}</button></div>
        </div>
      </section>

      <section class="card glass">
        <div class="method">
          <span class="icon-badge \${a.security.mfa ? 'tone-ok' : 'tone-warn'}">\${icon(a.security.mfa ? 'shield-check' : 'shield-alert')}</span>
          <div><h3 class="card-title">\${t('sec.mfa')}</h3>
            <p class="card-desc">\${a.security.mfa ? t('sec.mfa.on', { when: fmtDateShort(a.security.mfaSince), n: a.security.recoveryCodesLeft }) : t('sec.mfa.off')}</p></div>
          <div class="state">
            \${a.security.mfa
              ? html\`<span class="badge tone-ok"><span class="dot"></span>\${t('common.enabled')}</span>
                  <button class="btn btn-ghost btn-sm" data-action="totp-regenerate">\${icon('refresh-cw')}\${t('sec.mfa.codes')}</button>
                  <button class="btn btn-danger btn-sm" data-action="totp-disable">\${t('sec.mfa.disable')}</button>\`
              : html\`<button class="btn btn-primary btn-sm" data-action="totp-setup">\${icon('shield-check')}\${t('sec.mfa.enable')}</button>\`}
          </div>
        </div>
      </section>

      <section class="card glass">
        <div class="method">
          <span class="icon-badge \${a.passkeys.length ? 'tone-ok' : ''}">\${icon('fingerprint-pattern')}</span>
          <div><h3 class="card-title">\${t('sec.passkeys')}</h3><p class="card-desc">\${t('sec.passkeys.desc')}</p></div>
          <div class="state">\${passkeysSupported()
            ? html\`<button class="btn btn-glass btn-sm" data-action="passkey-add">\${icon('plus')}\${t('sec.passkeys.add')}</button>\`
            : html\`<span class="badge">\${t('sec.passkeys.unsupported')}</span>\`}</div>
        </div>
        \${a.passkeys.length ? html\`<ul class="list card-body">\${a.passkeys.map((p) => html\`<li class="list-item">
          <span class="icon-badge sm tone-muted">\${icon('fingerprint-pattern')}</span>
          <div class="body"><div class="title">\${p.name}\${p.backedUp ? html\`<span class="badge tone-info">\${icon('cloud')}\${t('sec.passkeys.synced')}</span>\` : ''}</div>
            <div class="meta"><span>\${t('sec.passkeys.added', { when: fmtDateShort(p.createdAt) })}</span><span>\${p.lastUsedAt ? t('sec.passkeys.used', { when: fmtRelative(p.lastUsedAt) }) : t('sec.passkeys.unused')}</span></div></div>
          <div class="actions compact">
            <button class="btn btn-ghost btn-icon btn-sm" data-action="passkey-rename" data-id="\${p.id}" data-name="\${p.name}" aria-label="\${t('common.rename')} \${p.name}">\${icon('pencil')}</button>
            <button class="btn btn-ghost btn-icon btn-sm" data-action="passkey-remove" data-id="\${p.id}" data-name="\${p.name}" aria-label="\${t('common.remove')} \${p.name}">\${icon('trash-2')}</button>
          </div></li>\`)}</ul>\` : ''}
      </section>

      <section class="card glass">
        <div class="method">
          <span class="icon-badge \${a.passcord.length ? 'tone-ok' : ''}">\${icon('smartphone')}</span>
          <div><h3 class="card-title">\${t('sec.passcord')}</h3><p class="card-desc">\${a.passcord.length ? t('sec.passcord.some', { n: a.passcord.length }) : t('sec.passcord.none')}</p></div>
          <div class="state"><a class="btn btn-glass btn-sm" href="#appareils">\${t('sec.passcord.manage')}\${icon('chevron-right')}</a></div>
        </div>
      </section>

      <div class="section-title"><h2>\${t('sec.alerts')}</h2></div>
      <section class="card glass">
        <div class="pref"><div class="label"><strong>\${t('sec.alerts.login')}</strong><span>\${t('sec.alerts.loginDesc')}</span></div>
          <label class="switch"><input type="checkbox" role="switch" data-change="alerts-toggle" \${a.user.alerts ? raw('checked') : ''} aria-label="\${t('sec.alerts.login')}"><span></span></label></div>
        <div class="pref"><div class="label"><strong>\${t('sec.alerts.always')}</strong><span>\${t('sec.alerts.alwaysDesc')}</span></div><span class="badge tone-ok">\${icon('check')}\${t('common.enabled')}</span></div>
      </section>
    </div>\`;
  },
};

/**
 * Action sensible : si le serveur répond \`reauth_required\` (connexion de plus
 * de 15 min), on demande le mot de passe puis on rejoue. \`undefined\` = annulé.
 */
async function withReauth(call) {
  try {
    return await call({});
  } catch (e) {
    if (e.reason !== 'reauth_required') throw e;
  }
  let result;
  const confirmed = await modal({
    title: t('reauth.title'),
    desc: t('reauth.desc'),
    iconName: 'lock-keyhole',
    body: html\`\${passwordField({ label: t('auth.password'), autofocus: true })}
      <input type="text" name="username" autocomplete="username" value="\${state.account.user.email}" hidden>\`,
    actions: html\`<button type="button" class="btn btn-ghost" data-close>\${t('common.cancel')}</button><button type="submit" class="btn btn-primary">\${t('common.continue')}</button>\`,
    async onSubmit(data, ctx) {
      result = await call({ password: data.get('password') });
      ctx.close(true);
    },
  });
  return confirmed ? result : undefined;
}

async function createPasskey(name, options) {
  const pk = options.publicKey;
  let credential;
  try {
    credential = await navigator.credentials.create({
      publicKey: {
        ...pk,
        challenge: b64uToBytes(pk.challenge),
        user: { ...pk.user, id: b64uToBytes(pk.user.id) },
        excludeCredentials: pk.excludeCredentials.map((c) => ({ ...c, id: b64uToBytes(c.id) })),
      },
    });
  } catch (e) {
    throw new Error(e?.name === 'InvalidStateError' ? t('sec.passkeys.exists') : e?.name === 'NotAllowedError' ? t('sec.passkeys.cancelled') : e?.message || t('sec.passkeys.cancelled'));
  }
  await api('/api/passkeys/register', {
    id: options.id,
    name,
    credential: {
      id: credential.id,
      clientDataJSON: bytesToB64u(credential.response.clientDataJSON),
      attestationObject: bytesToB64u(credential.response.attestationObject),
      transports: credential.response.getTransports?.() ?? [],
    },
  });
}

function recoveryCodesBlock(codes) {
  return html\`<div class="codes" aria-label="Codes">\${codes.map((c) => html\`<code>\${c}</code>\`)}</div>
    <div class="row-wrap"><button type="button" class="btn btn-glass btn-sm" data-codes-copy>\${icon('copy')}\${t('totp.copyAll')}</button>
    <button type="button" class="btn btn-glass btn-sm" data-codes-download>\${icon('download')}\${t('totp.download')}</button></div>\`;
}
function wireRecoveryCodes(dialog, codes) {
  const text = t('totp.file', { email: state.account.user.email, date: fmtDateTime(Date.now()) }) + codes.join('\\n') + '\\n';
  $('[data-codes-copy]', dialog)?.addEventListener('click', () => copyText(codes.join('\\n')));
  $('[data-codes-download]', dialog)?.addEventListener('click', () => downloadFile('compte-cord-codes-de-secours.txt', text, 'text/plain'));
}
const otpInput = (name = 'code', { recovery = false } = {}) => recovery
  ? html\`<div class="field"><label for="m-code">\${t('totp.code')}</label><input class="input mono" id="m-code" name="\${name}" required maxlength="24" autocomplete="one-time-code" spellcheck="false" autocapitalize="off" autofocus></div>\`
  : html\`<div class="field"><label for="m-code" class="sr-only">\${t('totp.code')}</label><input class="input input-otp" id="m-code" name="\${name}" inputmode="numeric" pattern="[0-9 ]{6,7}" maxlength="7" required autocomplete="one-time-code" placeholder="••••••" autofocus></div>\`;

Object.assign(ACTIONS, {
  'password-change'() {
    const recent = recentStrongLogin();
    return modal({
      title: t('pw.title'),
      desc: t('pw.desc'),
      iconName: 'key-round',
      body: html\`\${recent ? html\`<div class="banner tone-info">\${icon('info')}<div class="body"><p class="desc">\${t('pw.recent', { method: t(\`via.\${recent}\`) })}</p></div></div>\` : passwordField({ name: 'current', label: t('pw.current'), autofocus: true })}
        \${passwordField({ name: 'password', label: t('pw.new'), autocomplete: 'new-password', minlength: 12, strength: true, autofocus: Boolean(recent) })}
        \${passwordField({ name: 'confirm', label: t('pw.confirm'), autocomplete: 'new-password', minlength: 12 })}
        <input type="text" name="username" autocomplete="username" value="\${state.account.user.email}" hidden>\`,
      actions: html\`<button type="button" class="btn btn-ghost" data-close>\${t('common.cancel')}</button><button type="submit" class="btn btn-primary">\${t('pw.submit')}</button>\`,
      async onSubmit(data, ctx) {
        if (data.get('password') !== data.get('confirm')) throw new Error(t('auth.reset.mismatch'));
        const result = await api('/api/security/password', { current: data.get('current') ?? undefined, password: data.get('password') });
        ctx.close();
        toast(t('pw.done', { n: result.closedSessions }));
        refresh();
      },
    });
  },

  async 'totp-setup'(button) {
    const setup = await busy(button, () => withReauth((extra) => api('/api/security/totp', { action: 'setup', ...extra })));
    if (!setup) return;
    const grouped = setup.secret.match(/.{1,4}/g).join(' ');
    let step = 1;
    let codes = [];
    await modal({
      title: t('totp.title'),
      iconName: 'shield-check',
      tone: 'grad',
      body: () => html\`<div class="steps" aria-hidden="true"><span class="on"></span><span></span><span></span></div>
        <p class="muted">\${t('totp.step1')}</p>
        <div class="qr-frame">\${qrSvg(setup.otpauth, { logo: '/assets/icon-180.png' })}</div>
        <details><summary class="link-btn">\${t('totp.manual')}</summary>
          <div class="stack-sm"><div class="copyable"><code>\${grouped}</code><button type="button" class="btn btn-ghost btn-icon btn-sm" data-secret-copy aria-label="\${t('common.copy')}">\${icon('copy')}</button></div></div>
        </details>
        \${isMobile() ? html\`<a class="btn btn-glass btn-block" href="\${setup.otpauth}">\${icon('external-link')}\${t('totp.openApp')}</a>\` : ''}\`,
      actions: () => html\`<button type="button" class="btn btn-ghost" data-close>\${t('common.cancel')}</button><button type="submit" class="btn btn-primary">\${t('totp.next')}\${icon('arrow-right')}</button>\`,
      onOpen(ctx) {
        $('[data-secret-copy]', ctx.dialog)?.addEventListener('click', () => copyText(setup.secret));
      },
      async onSubmit(data, ctx) {
        const actions = $('.modal-actions', ctx.dialog);
        if (step === 1) {
          step = 2;
          ctx.setBody(html\`<div class="steps" aria-hidden="true"><span class="on"></span><span class="on"></span><span></span></div><p class="muted">\${t('totp.step2')}</p>\${otpInput()}\`);
          render(actions, html\`<button type="button" class="btn btn-ghost" data-close>\${t('common.cancel')}</button><button type="submit" class="btn btn-primary">\${t('totp.verify')}</button>\`);
          $('#m-code', ctx.dialog).focus();
          return;
        }
        if (step === 2) {
          const result = await api('/api/security/totp', { action: 'enable', code: data.get('code') });
          codes = result.recoveryCodes;
          step = 3;
          ctx.setBody(html\`<div class="steps" aria-hidden="true"><span class="on"></span><span class="on"></span><span class="on"></span></div>
            <p class="muted">\${t('totp.step3')}</p>\${recoveryCodesBlock(codes)}
            <label class="row small"><input type="checkbox" name="saved" required> \${t('totp.saved')}</label>\`);
          wireRecoveryCodes(ctx.dialog, codes);
          render(actions, html\`<button type="submit" class="btn btn-primary">\${t('totp.finish')}</button>\`);
          $('.modal-close', ctx.dialog)?.remove();
          refresh();
          return;
        }
        ctx.close(true);
        celebrate();
        toast(t('totp.done'));
      },
    });
  },

  'totp-disable'() {
    return modal({
      title: t('totp.disableTitle'),
      desc: t('totp.disableDesc'),
      iconName: 'shield-alert',
      tone: 'tone-danger',
      body: () => html\`\${otpInput('code', { recovery: true })}\`,
      actions: html\`<button type="button" class="btn btn-ghost" data-close>\${t('common.cancel')}</button><button type="submit" class="btn btn-danger-solid">\${t('sec.mfa.disable')}</button>\`,
      async onSubmit(data, ctx) {
        await api('/api/security/totp', { action: 'disable', code: data.get('code').trim() });
        ctx.close();
        toast(t('totp.disabled'), { type: 'info' });
        refresh();
      },
    });
  },

  'totp-regenerate'() {
    let codes = null;
    return modal({
      title: t('totp.regenTitle'),
      desc: t('totp.regenDesc'),
      iconName: 'refresh-cw',
      body: otpInput(),
      actions: html\`<button type="button" class="btn btn-ghost" data-close>\${t('common.cancel')}</button><button type="submit" class="btn btn-primary">\${t('totp.regenerate')}</button>\`,
      async onSubmit(data, ctx) {
        if (codes) return ctx.close();
        codes = (await api('/api/security/totp', { action: 'regenerate', code: data.get('code') })).recoveryCodes;
        ctx.setBody(html\`<p class="muted">\${t('totp.step3')}</p>\${recoveryCodesBlock(codes)}\`);
        wireRecoveryCodes(ctx.dialog, codes);
        render($('.modal-actions', ctx.dialog), html\`<button type="submit" class="btn btn-primary">\${t('common.done')}</button>\`);
        refresh();
      },
    });
  },

  async 'passkey-add'(button) {
    // Options demandées AVANT le geste final : Safari exige que
    // credentials.create() suive directement le toucher, sans requête entre.
    const options = await busy(button, () => withReauth((extra) => api('/api/passkeys/register/options', extra)));
    if (!options) return undefined;
    return modal({
      title: t('sec.passkeys.add'),
      desc: t('sec.passkeys.desc'),
      iconName: 'fingerprint-pattern',
      tone: 'grad',
      body: html\`<div class="field"><label for="m-pk">\${t('sec.passkeys.name')}</label><input class="input" id="m-pk" name="name" maxlength="60" required value="\${deviceName()}" autofocus><p class="field-hint">\${t('sec.passkeys.nameHint')}</p></div>\`,
      actions: html\`<button type="button" class="btn btn-ghost" data-close>\${t('common.cancel')}</button><button type="submit" class="btn btn-primary">\${icon('fingerprint-pattern')}\${t('sec.passkeys.create')}</button>\`,
      async onSubmit(data, ctx) {
        await createPasskey(String(data.get('name')).trim(), options);
        ctx.close();
        celebrate();
        toast(t('sec.passkeys.done'));
        refresh();
      },
    });
  },
  'passkey-rename'(button) {
    return modal({
      title: t('common.rename'),
      iconName: 'pencil',
      body: html\`<div class="field"><label for="m-pk">\${t('sec.passkeys.name')}</label><input class="input" id="m-pk" name="name" maxlength="60" required value="\${button.dataset.name}" autofocus></div>\`,
      actions: html\`<button type="button" class="btn btn-ghost" data-close>\${t('common.cancel')}</button><button type="submit" class="btn btn-primary">\${t('common.save')}</button>\`,
      async onSubmit(data, ctx) {
        await api('/api/passkeys', { id: button.dataset.id, name: String(data.get('name')).trim() }, 'PATCH');
        ctx.close();
        toast(t('sec.passkeys.renamed'));
        refresh();
      },
    });
  },
  async 'passkey-remove'(button) {
    const ok = await confirmDialog({ title: t('sec.passkeys.removeTitle', { name: button.dataset.name }), desc: t('sec.passkeys.removeDesc'), confirm: t('common.remove') });
    if (!ok) return;
    await api('/api/passkeys', { id: button.dataset.id }, 'DELETE');
    toast(t('sec.passkeys.removed'), { type: 'info' });
    refresh();
  },
  async 'alerts-toggle'(input) {
    const alerts = input.checked;
    try {
      await api('/api/me', { alerts }, 'PATCH');
      state.account.user.alerts = alerts;
      toast(t(alerts ? 'sec.alerts.on' : 'sec.alerts.off'), { type: 'info', duration: 2500 });
    } catch (e) {
      input.checked = !alerts;
      throw e;
    }
  },
  async 'alerts-on'() {
    await api('/api/me', { alerts: true }, 'PATCH');
    toast(t('sec.alerts.on'), { type: 'info' });
    refresh();
  },
});

// src/33-devices.js
/* Appareils : iPhone Passcord associés et sessions ouvertes. */

messages({
  fr: {
    'dev.title': 'Appareils', 'dev.desc': 'Tes iPhone Passcord et tous les appareils actuellement connectés à ton compte.',
    'dev.passcord': 'Passcord, ta clé iPhone', 'dev.passcord.desc': 'Associe ton iPhone une fois : ensuite, tes connexions se valident dans Passcord avec Face ID. La clé privée ne quitte jamais le téléphone.',
    'dev.passcord.pair': 'Associer un iPhone', 'dev.passcord.empty': 'Aucun iPhone associé', 'dev.passcord.emptyDesc': 'Passcord transforme ton iPhone en clé de connexion pour toute la suite.',
    'dev.passcord.added': 'Associé {when}', 'dev.passcord.used': 'Dernière validation {when}', 'dev.passcord.unused': 'Jamais utilisé pour se connecter',
    'dev.passcord.revokeTitle': 'Révoquer « {name} » ?', 'dev.passcord.revokeDesc': 'Cet iPhone ne pourra plus valider de connexion. Tu pourras l’associer de nouveau à tout moment.',
    'dev.passcord.revoked': 'iPhone révoqué.', 'dev.passcord.renamed': 'iPhone renommé.', 'dev.passcord.name': 'Nom de l’iPhone',
    'pair.title': 'Associer Passcord', 'pair.scan': 'Sur ton iPhone, scanne ce code avec l’appareil photo : Passcord s’ouvre. Connecte-toi avec ton compte Cord et valide avec Face ID.',
    'pair.mobile': 'Sur cet iPhone, ouvre la demande dans Passcord, connecte-toi à ton compte Cord et valide avec Face ID.',
    'pair.manual': 'Pas d’appareil photo ? Dans Passcord, ouvre Réglages › Compte Cord et colle ce lien.',
    'pair.waiting': 'En attente de ton iPhone…', 'pair.done': 'iPhone associé ! Tes prochaines connexions pourront se valider avec Face ID.',
    'pair.expired': 'La demande a expiré (3 minutes).', 'pair.server': 'Dans Passcord, le serveur doit être {server}.',
    'dev.sessions': 'Sessions actives', 'dev.sessions.desc': 'Les navigateurs et apps connectés à ton compte Cord. Ferme ceux que tu ne reconnais pas.',
    'dev.sessions.current': 'Cet appareil', 'dev.sessions.signout': 'Déconnecter', 'dev.sessions.others': 'Déconnecter les autres appareils',
    'dev.sessions.active': 'Actif {when}', 'dev.sessions.since': 'Connecté {when}', 'dev.sessions.via': 'via {method}',
    'dev.sessions.othersTitle': 'Déconnecter tous les autres appareils ?', 'dev.sessions.othersDesc': 'Tous les appareils sauf celui-ci devront se reconnecter.',
    'dev.sessions.closed': 'Session fermée.', 'dev.sessions.closedMany': '{n} session(s) fermée(s).',
    'dev.sessions.revokeTitle': 'Déconnecter {device} ?', 'dev.sessions.revokeDesc': 'Cet appareil devra se reconnecter pour accéder à ton compte.',
    'dev.sessions.tip': 'Tu ne reconnais pas un appareil ? Déconnecte-le puis change ton mot de passe.',
  },
  en: {
    'dev.title': 'Devices', 'dev.desc': 'Your Passcord iPhones and every device currently signed in to your account.',
    'dev.passcord': 'Passcord, your iPhone key', 'dev.passcord.desc': 'Pair your iPhone once: from then on, you approve sign-ins in Passcord with Face ID. The private key never leaves the phone.',
    'dev.passcord.pair': 'Pair an iPhone', 'dev.passcord.empty': 'No paired iPhone', 'dev.passcord.emptyDesc': 'Passcord turns your iPhone into a sign-in key for the whole suite.',
    'dev.passcord.added': 'Paired {when}', 'dev.passcord.used': 'Last approval {when}', 'dev.passcord.unused': 'Never used to sign in',
    'dev.passcord.revokeTitle': 'Revoke “{name}”?', 'dev.passcord.revokeDesc': 'This iPhone won’t be able to approve sign-ins anymore. You can pair it again anytime.',
    'dev.passcord.revoked': 'iPhone revoked.', 'dev.passcord.renamed': 'iPhone renamed.', 'dev.passcord.name': 'iPhone name',
    'pair.title': 'Pair Passcord', 'pair.scan': 'On your iPhone, scan this code with the camera: Passcord opens. Sign in with your Cord account and approve with Face ID.',
    'pair.mobile': 'On this iPhone, open the request in Passcord, sign in to your Cord account and approve with Face ID.',
    'pair.manual': 'No camera? In Passcord, open Settings › Cord Account and paste this link.',
    'pair.waiting': 'Waiting for your iPhone…', 'pair.done': 'iPhone paired! Your next sign-ins can be approved with Face ID.',
    'pair.expired': 'The request expired (3 minutes).', 'pair.server': 'In Passcord, the server must be {server}.',
    'dev.sessions': 'Active sessions', 'dev.sessions.desc': 'Browsers and apps signed in to your Cord account. Sign out any you don’t recognize.',
    'dev.sessions.current': 'This device', 'dev.sessions.signout': 'Sign out', 'dev.sessions.others': 'Sign out other devices',
    'dev.sessions.active': 'Active {when}', 'dev.sessions.since': 'Signed in {when}', 'dev.sessions.via': 'via {method}',
    'dev.sessions.othersTitle': 'Sign out every other device?', 'dev.sessions.othersDesc': 'All devices except this one will need to sign in again.',
    'dev.sessions.closed': 'Session signed out.', 'dev.sessions.closedMany': '{n} session(s) signed out.',
    'dev.sessions.revokeTitle': 'Sign out {device}?', 'dev.sessions.revokeDesc': 'This device will need to sign in again to access your account.',
    'dev.sessions.tip': 'Don’t recognize a device? Sign it out, then change your password.',
  },
});

VIEWS.appareils = {
  render(a) {
    const others = a.sessions.filter((s) => !s.current).length;
    return html\`<div class="view">
      \${pageHead({ eyebrow: t('nav.section.account'), title: t('dev.title'), desc: t('dev.desc') })}
      <section class="card glass">
        <div class="card-head">
          <span class="icon-badge grad">\${icon('smartphone')}</span>
          <div class="grow"><h2 class="card-title">\${t('dev.passcord')}</h2><p class="card-desc">\${t('dev.passcord.desc')}</p></div>
        </div>
        <div class="card-body">
          \${a.passcord.length
            ? html\`<ul class="list">\${a.passcord.map((k) => html\`<li class="list-item">
                <span class="icon-badge tone-ok">\${icon('smartphone')}</span>
                <div class="body"><div class="title">\${k.name}</div>
                  <div class="meta"><span>\${t('dev.passcord.added', { when: fmtDateShort(k.createdAt) })}</span><span>\${k.lastUsedAt ? t('dev.passcord.used', { when: fmtRelative(k.lastUsedAt) }) : t('dev.passcord.unused')}</span></div></div>
                <div class="actions compact">
                  <button class="btn btn-ghost btn-icon btn-sm" data-action="passcord-rename" data-id="\${k.id}" data-name="\${k.name}" aria-label="\${t('common.rename')} \${k.name}">\${icon('pencil')}</button>
                  <button class="btn btn-danger btn-sm" data-action="passcord-revoke" data-id="\${k.id}" data-name="\${k.name}">\${t('common.revoke')}</button>
                </div></li>\`)}</ul>\`
            : emptyState({ iconName: 'smartphone', title: t('dev.passcord.empty'), desc: t('dev.passcord.emptyDesc') })}
        </div>
        <div class="card-foot"><button class="btn btn-primary" data-action="passcord-pair">\${icon('qr-code')}\${t('dev.passcord.pair')}</button></div>
      </section>

      <section class="card glass">
        <div class="card-head">
          <span class="icon-badge tone-info">\${icon('monitor-smartphone')}</span>
          <div class="grow"><h2 class="card-title">\${t('dev.sessions')}</h2><p class="card-desc">\${t('dev.sessions.desc')}</p></div>
        </div>
        <ul class="list card-body">
          \${a.sessions.map((s) => html\`<li class="list-item">
            \${s.device.logo ? html\`<img class="device-logo" src="\${s.device.logo}" alt="" width="42" height="42">\` : html\`<span class="icon-badge \${s.current ? 'grad' : 'tone-muted'}">\${icon(deviceIcon(s.device.kind))}</span>\`}
            <div class="body">
              <div class="title">\${s.device.label}\${s.current ? html\`<span class="badge tone-ok"><span class="dot"></span>\${t('dev.sessions.current')}</span>\` : ''}</div>
              <div class="meta">
                <span>\${icon('clock')}\${t('dev.sessions.active', { when: fmtRelative(s.lastSeenAt || s.createdAt) })}</span>
                \${s.method ? html\`<span>\${icon('log-in')}\${t('dev.sessions.via', { method: t(\`via.\${s.method === 'register' ? 'password' : s.method}\`) })}</span>\` : ''}
                \${s.ip ? html\`<span class="mono">\${icon('globe')}\${s.ip}</span>\` : ''}
                <span title="\${fmtDateTime(s.createdAt)}">\${t('dev.sessions.since', { when: fmtRelative(s.createdAt) })}</span>
              </div>
            </div>
            \${s.current ? '' : html\`<div class="actions compact"><button class="btn btn-ghost btn-sm" data-action="session-revoke" data-id="\${s.id}" data-device="\${s.device.label}">\${icon('log-out')}\${t('dev.sessions.signout')}</button></div>\`}
          </li>\`)}
        </ul>
        <div class="card-foot">
          \${others ? html\`<button class="btn btn-danger" data-action="sessions-revoke-others">\${icon('log-out')}\${t('dev.sessions.others')}</button>\` : ''}
          <p class="tiny subtle">\${t('dev.sessions.tip')}</p>
        </div>
      </section>
    </div>\`;
  },
};

Object.assign(ACTIONS, {
  async 'passcord-pair'(button) {
    const request = await busy(button, () => api('/api/passcord/pair', {}));
    if (!request) return;
    const mobile = isMobile();
    let active = true;
    let stopCountdown = () => {};
    const before = state.account.passcord.length;
    await modal({
      title: t('pair.title'),
      desc: mobile ? t('pair.mobile') : t('pair.scan'),
      iconName: 'smartphone',
      tone: 'grad',
      body: html\`\${mobile ? '' : html\`<div class="qr-frame" data-qr>\${qrSvg(request.url)}<span class="qr-scan"></span></div>\`}
        <div class="row"><span class="pulse-dot"></span><span class="muted small" data-pair-status>\${t('pair.waiting')}</span><span class="spacer"></span><span class="countdown" data-countdown></span></div>
        <a class="btn \${mobile ? 'btn-primary btn-lg' : 'btn-glass'} btn-block" href="\${request.url}">\${icon('external-link')}\${t('auth.passcord.open')}</a>
        <details><summary class="link-btn muted">\${t('pair.manual')}</summary>
          <div class="stack-sm"><div class="copyable"><code>\${request.url}</code><button type="button" class="btn btn-ghost btn-icon btn-sm" data-pair-copy aria-label="\${t('common.copy')}">\${icon('copy')}</button></div>
          <p class="tiny subtle">\${t('pair.server', { server: location.origin })}</p></div>
        </details>\`,
      onOpen(ctx) {
        $('[data-pair-copy]', ctx.dialog).addEventListener('click', () => copyText(request.url));
        stopCountdown = startCountdown($('[data-countdown]', ctx.dialog), request.expiresAt, () => {
          if (!active) return;
          active = false;
          ctx.error(t('pair.expired'));
          $('[data-qr]', ctx.dialog)?.classList.add('done');
        });
        const poll = async () => {
          if (!active || !ctx.dialog.open) return;
          try {
            const status = await api('/api/passcord/pair/status', { id: request.id });
            if (!status.pending && active) {
              active = false;
              await loadAccount();
              if (state.account.passcord.length > before) {
                ctx.close(true);
                celebrate();
                toast(t('pair.done'));
                renderShell();
              } else {
                ctx.error(t('pair.expired'));
              }
              return;
            }
          } catch { /* réessaie */ }
          setTimeout(poll, 2500);
        };
        setTimeout(poll, 2500);
      },
    });
    active = false;
    stopCountdown();
  },
  'passcord-rename'(button) {
    return modal({
      title: t('common.rename'),
      iconName: 'pencil',
      body: html\`<div class="field"><label for="m-pc">\${t('dev.passcord.name')}</label><input class="input" id="m-pc" name="name" maxlength="60" required value="\${button.dataset.name}" autofocus></div>\`,
      actions: html\`<button type="button" class="btn btn-ghost" data-close>\${t('common.cancel')}</button><button type="submit" class="btn btn-primary">\${t('common.save')}</button>\`,
      async onSubmit(data, ctx) {
        await api('/api/passcord/keys', { id: button.dataset.id, name: String(data.get('name')).trim() }, 'PATCH');
        ctx.close();
        toast(t('dev.passcord.renamed'));
        refresh();
      },
    });
  },
  async 'passcord-revoke'(button) {
    const ok = await confirmDialog({ title: t('dev.passcord.revokeTitle', { name: button.dataset.name }), desc: t('dev.passcord.revokeDesc'), confirm: t('common.revoke') });
    if (!ok) return;
    await api('/api/passcord/keys', { id: button.dataset.id }, 'DELETE');
    toast(t('dev.passcord.revoked'), { type: 'info' });
    refresh();
  },
  async 'session-revoke'(button) {
    const ok = await confirmDialog({ title: t('dev.sessions.revokeTitle', { device: button.dataset.device }), desc: t('dev.sessions.revokeDesc'), confirm: t('dev.sessions.signout'), iconName: 'log-out' });
    if (!ok) return;
    await api('/api/sessions', { id: button.dataset.id }, 'DELETE');
    toast(t('dev.sessions.closed'), { type: 'info' });
    refresh();
  },
  async 'sessions-revoke-others'() {
    const ok = await confirmDialog({ title: t('dev.sessions.othersTitle'), desc: t('dev.sessions.othersDesc'), confirm: t('dev.sessions.others'), iconName: 'log-out' });
    if (!ok) return;
    const result = await api('/api/sessions/revoke-others', {});
    toast(t('dev.sessions.closedMany', { n: result.closed }), { type: 'info' });
    refresh();
  },
});

// src/34-apps.js
/* Apps : applications connectées (OAuth) et catalogue de la suite. */

messages({
  fr: {
    'apps.title': 'Apps', 'apps.desc': 'Les apps auxquelles tu t’es connecté avec ton compte Cord, et ce qu’elles peuvent voir.',
    'apps.connected': 'Apps connectées', 'apps.empty': 'Aucune app connectée', 'apps.emptyDesc': 'Sur Drivecord et les autres apps de la suite, choisis « Continuer avec Cord » : elles apparaîtront ici.',
    'apps.tryDrivecord': 'Essayer Drivecord', 'apps.granted': 'Autorisée {when}', 'apps.used': 'Dernière connexion {when}',
    'apps.revoke': 'Révoquer l’accès', 'apps.revokeTitle': 'Révoquer l’accès de {app} ?',
    'apps.revokeDesc': '{app} ne pourra plus lire ton profil Cord et te redemandera l’autorisation à la prochaine connexion. Tes données dans {app} ne sont pas supprimées.',
    'apps.revoked': 'Accès de {app} révoqué.', 'apps.suite': 'La suite Cord', 'apps.suiteDesc': 'Toutes les apps qui utilisent ton Compte Cord.',
    'scope.openid': 'Identifiant Cord', 'scope.profile': 'Nom et photo', 'scope.email': 'Adresse email',
    'betaApp.title': 'Bêta fermée de Passcord', 'betaApp.desc': 'Tu as reçu une clé d’accès ? Entre-la pour rejoindre les premiers testeurs.',
    'betaApp.key': 'Clé d’accès', 'betaApp.join': 'Rejoindre la bêta', 'betaApp.joined': 'Bienvenue dans la bêta de {name} !', 'betaApp.already': 'Tu fais déjà partie de la bêta.',
    'betaApp.member': 'Testeur', 'betaApp.memberDesc': 'Télécharge l’app puis installe-la avec AltStore, ou depuis CordLauncher (Installer sur iPhone).',
    'betaApp.build': '{build} · publié {when}', 'betaApp.loading': 'Recherche du dernier build…', 'betaApp.none': 'Aucun build publié pour le moment.',
    'betaApp.soon': 'Le téléchargement direct arrive bientôt : en attendant, demande l’IPA à l’administrateur.',
    'betaApp.download': 'Télécharger', 'betaApp.unverified': 'Confirme d’abord ton adresse email pour utiliser une clé.',
    'asset.Passcord.ipa': 'App, extension Safari et clavier — recommandé', 'asset.Passcord-sans-clavier.ipa': 'App et extension Safari, sans clavier',
    'asset.Passcord-autofill.ipa': 'Avec le remplissage automatique — compte Apple Developer payant requis',
    'reason.beta_key_invalid': 'Clé inconnue. Vérifie-la caractère par caractère (ex. PASS-7KQM-2XVD-9HRT).', 'reason.beta_key_used': 'Cette clé a déjà été utilisée.',
    'reason.beta_key_expired': 'Cette clé a expiré.', 'reason.beta_key_revoked': 'Cette clé a été désactivée.', 'reason.beta_required': 'Cette bêta demande une clé d’accès.',
  },
  en: {
    'apps.title': 'Apps', 'apps.desc': 'Apps you signed in to with your Cord account, and what they can see.',
    'apps.connected': 'Connected apps', 'apps.empty': 'No connected apps', 'apps.emptyDesc': 'On Drivecord and the other suite apps, pick “Continue with Cord”: they’ll show up here.',
    'apps.tryDrivecord': 'Try Drivecord', 'apps.granted': 'Authorized {when}', 'apps.used': 'Last sign-in {when}',
    'apps.revoke': 'Revoke access', 'apps.revokeTitle': 'Revoke {app}’s access?',
    'apps.revokeDesc': '{app} will no longer read your Cord profile and will ask for permission on your next sign-in. Your data inside {app} isn’t deleted.',
    'apps.revoked': '{app}’s access revoked.', 'apps.suite': 'The Cord suite', 'apps.suiteDesc': 'Every app that uses your Cord account.',
    'scope.openid': 'Cord ID', 'scope.profile': 'Name and photo', 'scope.email': 'Email address',
    'betaApp.title': 'Passcord closed beta', 'betaApp.desc': 'Got an access key? Enter it to join the first testers.',
    'betaApp.key': 'Access key', 'betaApp.join': 'Join the beta', 'betaApp.joined': 'Welcome to the {name} beta!', 'betaApp.already': 'You’re already in the beta.',
    'betaApp.member': 'Tester', 'betaApp.memberDesc': 'Download the app, then install it with AltStore or from CordLauncher (Install on iPhone).',
    'betaApp.build': '{build} · published {when}', 'betaApp.loading': 'Looking for the latest build…', 'betaApp.none': 'No build published yet.',
    'betaApp.soon': 'Direct download is coming soon: meanwhile, ask the admin for the IPA.',
    'betaApp.download': 'Download', 'betaApp.unverified': 'Confirm your email address first to redeem a key.',
    'asset.Passcord.ipa': 'App, Safari extension and keyboard — recommended', 'asset.Passcord-sans-clavier.ipa': 'App and Safari extension, no keyboard',
    'asset.Passcord-autofill.ipa': 'With system AutoFill — paid Apple Developer account required',
    'reason.beta_key_invalid': 'Unknown key. Check it character by character (e.g. PASS-7KQM-2XVD-9HRT).', 'reason.beta_key_used': 'This key has already been used.',
    'reason.beta_key_expired': 'This key has expired.', 'reason.beta_key_revoked': 'This key has been disabled.', 'reason.beta_required': 'This beta requires an access key.',
  },
});

const SCOPE_ICONS = { openid: 'id-card', profile: 'user-round', email: 'at-sign' };
const betaState = { info: null, loading: false };
const fmtSize = (bytes) => \`\${(bytes / 1_000_000).toLocaleString(intlLocale(), { maximumFractionDigits: 1 })} Mo\`;

function betaCard(a) {
  const member = (a.user.beta ?? []).includes('passcord');
  const info = betaState.info;
  const logo = html\`<img class="device-logo" src="/assets/logos/passcord.png" alt="" width="42" height="42">\`;
  if (!member) {
    return html\`<section class="card glass">
      <div class="card-head">\${logo}<div class="grow"><h2 class="card-title">\${t('betaApp.title')}</h2><p class="card-desc">\${t(a.user.emailVerified ? 'betaApp.desc' : 'betaApp.unverified')}</p></div></div>
      <form id="beta-redeem" class="card-body beta-redeem" novalidate>
        <div class="field"><label for="beta-code">\${t('betaApp.key')}</label>
          <input class="input" id="beta-code" name="code" placeholder="PASS-XXXX-XXXX-XXXX" autocomplete="off" spellcheck="false" autocapitalize="characters" maxlength="40" required \${a.user.emailVerified ? '' : raw('disabled')}></div>
        <button class="btn btn-primary" type="submit" \${a.user.emailVerified ? '' : raw('disabled')}>\${icon('key-round')}\${t('betaApp.join')}</button>
      </form>
    </section>\`;
  }
  return html\`<section class="card glass">
    <div class="card-head">\${logo}<div class="grow"><h2 class="card-title">\${t('betaApp.title')} <span class="badge tone-ok">\${icon('badge-check')}\${t('betaApp.member')}</span></h2>
      <p class="card-desc">\${t('betaApp.memberDesc')}</p></div></div>
    <div class="card-body">\${
      !info ? html\`<p class="subtle">\${t('betaApp.loading')}</p>\`
      : !info.downloads ? html\`<p class="subtle">\${t('betaApp.soon')}</p>\`
      : !info.release ? html\`<p class="subtle">\${t('betaApp.none')}</p>\`
      : html\`<p class="tiny subtle mono">\${t('betaApp.build', { build: info.release.build, when: fmtRelative(info.release.publishedAt) })}</p>
        <ul class="list">\${[...info.release.assets].sort((x, y) => (x.name === 'Passcord.ipa' ? -1 : y.name === 'Passcord.ipa' ? 1 : 0)).map((asset) => html\`<li class="list-item">
          <span class="icon-badge sm \${asset.name === 'Passcord.ipa' ? 'grad' : ''}">\${icon('smartphone')}</span>
          <div class="body"><div class="title mono">\${asset.name}</div><div class="meta"><span>\${MESSAGES[locale][\`asset.\${asset.name}\`] ? t(\`asset.\${asset.name}\`) : ''}</span><span>\${fmtSize(asset.size)}</span></div></div>
          <div class="actions"><button class="btn \${asset.name === 'Passcord.ipa' ? 'btn-primary' : 'btn-glass'} btn-sm" data-action="beta-download" data-asset="\${asset.name}">\${icon('download')}\${t('betaApp.download')}</button></div>
        </li>\`)}</ul>\`
    }</div>
  </section>\`;
}

async function loadBetaInfo() {
  betaState.loading = true;
  try {
    betaState.info = await api('/api/beta/passcord');
    if (state.route === 'apps') renderShell();
  } catch (e) {
    toastError(e);
  } finally {
    betaState.loading = false;
  }
}

VIEWS.apps = {
  render(a) {
    return html\`<div class="view">
      \${pageHead({ eyebrow: t('nav.section.account'), title: t('apps.title'), desc: t('apps.desc') })}
      <section class="card glass">
        <div class="card-head"><span class="icon-badge grad">\${icon('app-window')}</span><div class="grow"><h2 class="card-title">\${t('apps.connected')}</h2></div></div>
        <div class="card-body">
          \${a.apps.length
            ? html\`<ul class="list">\${a.apps.map((app) => html\`<li class="list-item app-row">
                \${appLogo(app)}
                <div class="body">
                  <div class="title">\${app.name}\${app.firstParty ? html\`<span class="badge badge-accent">\${icon('badge-check')}Cord</span>\` : ''}</div>
                  <div class="meta"><span>\${t('apps.granted', { when: fmtDateShort(app.grantedAt) })}</span><span>\${t('apps.used', { when: fmtRelative(app.lastUsedAt) })}</span></div>
                  <div class="scopes">\${app.scope.split(' ').map((s) => html\`<span class="chip">\${icon(SCOPE_ICONS[s] ?? 'info')}\${t(\`scope.\${s}\`)}</span>\`)}</div>
                </div>
                <div class="actions">
                  \${app.url ? html\`<a class="btn btn-ghost btn-sm" href="\${app.url}" target="_blank" rel="noopener">\${t('common.open')}\${icon('external-link')}</a>\` : ''}
                  <button class="btn btn-danger btn-sm" data-action="app-revoke" data-id="\${app.id}" data-name="\${app.name}">\${t('apps.revoke')}</button>
                </div>
              </li>\`)}</ul>\`
            : emptyState({ iconName: 'app-window', title: t('apps.empty'), desc: t('apps.emptyDesc'), action: html\`<a class="btn btn-primary btn-sm" href="https://drivecord.app" target="_blank" rel="noopener">\${t('apps.tryDrivecord')}\${icon('external-link')}</a>\` })}
        </div>
      </section>
      \${betaCard(a)}
      <div class="section-title"><h2>\${t('apps.suite')}</h2></div>
      <div class="suite-grid">\${state.suite.map((app) => suiteTile(app))}</div>
    </div>\`;
  },
  mount(root) {
    if ((state.account?.user.beta ?? []).includes('passcord') && !betaState.info && !betaState.loading) loadBetaInfo();
    const form = $('#beta-redeem', root);
    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const input = $('#beta-code', form);
      if (!input.value.trim()) return input.focus();
      try {
        const result = await busy(event.submitter ?? $('[type="submit"]', form), () => api('/api/beta/redeem', { code: input.value }));
        toast(result.already ? t('betaApp.already') : t('betaApp.joined', { name: result.name }));
        if (!result.already) celebrate();
        betaState.info = null;
        await refresh();
      } catch (e) {
        input.setAttribute('aria-invalid', 'true');
        toastError(e);
      }
    });
  },
};

Object.assign(ACTIONS, {
  async 'beta-download'(button) {
    const { url } = await busy(button, () => api('/api/beta/passcord/download', { asset: button.dataset.asset }));
    // Lien signé et temporaire vers le fichier : le navigateur le télécharge directement.
    location.href = url;
  },
  async 'app-revoke'(button) {
    const name = button.dataset.name;
    const ok = await confirmDialog({ title: t('apps.revokeTitle', { app: name }), desc: t('apps.revokeDesc', { app: name }), confirm: t('apps.revoke'), iconName: 'ban' });
    if (!ok) return;
    await api('/api/connected-apps', { clientId: button.dataset.id }, 'DELETE');
    toast(t('apps.revoked', { app: name }), { type: 'info' });
    refresh();
  },
});

// src/35-activity.js
/* Activité : journal des connexions et des changements du compte. */

messages({
  fr: {
    'activity.title': 'Activité', 'activity.desc': 'Chaque connexion et chaque changement important de ton compte, conservés 180 jours.',
    'activity.filter.all': 'Tout', 'activity.filter.logins': 'Connexions', 'activity.filter.security': 'Sécurité', 'activity.filter.apps': 'Apps',
    'activity.more': 'Charger plus', 'activity.empty': 'Rien à signaler pour l’instant.', 'activity.empty.desc': 'Tes connexions et tes changements apparaîtront ici.',
    'activity.retention': 'Journal conservé 180 jours, visible uniquement par toi. Les adresses IP sont tronquées à l’affichage.',
    'ev.register': 'Compte créé', 'ev.login': 'Connexion', 'ev.login_failed': 'Tentative de connexion refusée',
    'ev.email_verified': 'Adresse email confirmée', 'ev.email_changed': 'Adresse email modifiée',
    'ev.password_changed': 'Mot de passe modifié', 'ev.password_reset': 'Mot de passe réinitialisé', 'ev.password_reset_requested': 'Réinitialisation demandée',
    'ev.mfa_enabled': 'Double authentification activée', 'ev.mfa_disabled': 'Double authentification désactivée',
    'ev.recovery_used': 'Code de secours utilisé', 'ev.recovery_regenerated': 'Codes de secours régénérés',
    'ev.passkey_added': 'Passkey ajoutée', 'ev.passkey_removed': 'Passkey supprimée',
    'ev.passcord_paired': 'iPhone associé à Passcord', 'ev.passcord_revoked': 'iPhone Passcord révoqué',
    'ev.app_authorized': 'App autorisée', 'ev.app_revoked': 'Accès d’une app révoqué',
    'ev.session_revoked': 'Session fermée à distance', 'ev.sessions_revoked': 'Autres sessions fermées',
    'ev.profile_updated': 'Profil mis à jour',
    'ev.beta_joined': 'Bêta rejointe', 'ev.beta_download': 'Build de bêta téléchargé', 'ev.beta_keys_created': 'Clés de bêta générées', 'ev.beta_downloads_configured': 'Installation directe de la bêta activée',
    'via.password': 'mot de passe', 'via.passkey': 'passkey', 'via.passcord': 'Passcord', 'via.reset': 'lien de réinitialisation', 'via.mfa': 'code 2FA incorrect',
    'via.name': 'nom', 'via.avatar': 'photo',
  },
  en: {
    'activity.title': 'Activity', 'activity.desc': 'Every sign-in and every important change to your account, kept for 180 days.',
    'activity.filter.all': 'All', 'activity.filter.logins': 'Sign-ins', 'activity.filter.security': 'Security', 'activity.filter.apps': 'Apps',
    'activity.more': 'Load more', 'activity.empty': 'Nothing to report yet.', 'activity.empty.desc': 'Your sign-ins and changes will show up here.',
    'activity.retention': 'Log kept for 180 days, visible only to you. IP addresses are truncated on display.',
    'ev.register': 'Account created', 'ev.login': 'Signed in', 'ev.login_failed': 'Sign-in attempt refused',
    'ev.email_verified': 'Email address confirmed', 'ev.email_changed': 'Email address changed',
    'ev.password_changed': 'Password changed', 'ev.password_reset': 'Password reset', 'ev.password_reset_requested': 'Password reset requested',
    'ev.mfa_enabled': 'Two-factor authentication on', 'ev.mfa_disabled': 'Two-factor authentication off',
    'ev.recovery_used': 'Recovery code used', 'ev.recovery_regenerated': 'Recovery codes regenerated',
    'ev.passkey_added': 'Passkey added', 'ev.passkey_removed': 'Passkey removed',
    'ev.passcord_paired': 'iPhone paired with Passcord', 'ev.passcord_revoked': 'Passcord iPhone revoked',
    'ev.app_authorized': 'App authorized', 'ev.app_revoked': 'App access revoked',
    'ev.session_revoked': 'Session signed out remotely', 'ev.sessions_revoked': 'Other sessions signed out',
    'ev.profile_updated': 'Profile updated',
    'ev.beta_joined': 'Joined a beta', 'ev.beta_download': 'Beta build downloaded', 'ev.beta_keys_created': 'Beta keys generated', 'ev.beta_downloads_configured': 'Beta direct install turned on',
    'via.password': 'password', 'via.passkey': 'passkey', 'via.passcord': 'Passcord', 'via.reset': 'reset link', 'via.mfa': 'wrong 2FA code',
    'via.name': 'name', 'via.avatar': 'photo',
  },
});

const EVENT_STYLE = {
  register: ['sparkles', ''], login: ['log-in', 'tone-info'], login_failed: ['ban', 'tone-danger'],
  email_verified: ['mail-check', 'tone-ok'], email_changed: ['at-sign', 'tone-warn'],
  password_changed: ['key-round', 'tone-warn'], password_reset: ['rotate-ccw', 'tone-warn'], password_reset_requested: ['mail', 'tone-muted'],
  mfa_enabled: ['shield-check', 'tone-ok'], mfa_disabled: ['shield-alert', 'tone-danger'],
  recovery_used: ['key', 'tone-warn'], recovery_regenerated: ['refresh-cw', 'tone-muted'],
  passkey_added: ['fingerprint-pattern', 'tone-ok'], passkey_removed: ['trash-2', 'tone-muted'],
  passcord_paired: ['smartphone', 'tone-ok'], passcord_revoked: ['trash-2', 'tone-muted'],
  app_authorized: ['app-window', ''], app_revoked: ['ban', 'tone-muted'],
  session_revoked: ['log-out', 'tone-muted'], sessions_revoked: ['log-out', 'tone-muted'], profile_updated: ['pencil', 'tone-muted'],
  beta_joined: ['key-round', 'tone-ok'], beta_download: ['download', 'tone-info'], beta_keys_created: ['key', 'tone-muted'], beta_downloads_configured: ['download', 'tone-ok'],
};
const EVENT_GROUPS = {
  logins: ['register', 'login', 'login_failed', 'session_revoked', 'sessions_revoked'],
  security: ['password_changed', 'password_reset', 'password_reset_requested', 'mfa_enabled', 'mfa_disabled', 'recovery_used', 'recovery_regenerated', 'passkey_added', 'passkey_removed', 'passcord_paired', 'passcord_revoked', 'email_changed', 'email_verified'],
  apps: ['app_authorized', 'app_revoked', 'beta_joined', 'beta_download', 'beta_keys_created', 'beta_downloads_configured'],
};

function eventDetail(e) {
  if (!e.detail) return '';
  if (['login', 'register', 'login_failed', 'profile_updated'].includes(e.kind)) return MESSAGES[locale][\`via.\${e.detail}\`] ? t(\`via.\${e.detail}\`) : '';
  if (e.kind === 'sessions_revoked') return \`× \${e.detail}\`;
  return e.detail;
}

function dayLabel(ms) {
  const d = new Date(ms);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400_000);
  if (d.toDateString() === today.toDateString()) return t('common.today');
  if (d.toDateString() === yesterday.toDateString()) return t('common.yesterday');
  return fmtDate(ms);
}

function timeline(events, { grouped = true } = {}) {
  if (!events.length) return emptyState({ iconName: 'history', title: t('activity.empty'), desc: t('activity.empty.desc') });
  let lastDay = '';
  return html\`<ol class="timeline">\${events.map((e, i) => {
    const [iconName, tone] = EVENT_STYLE[e.kind] ?? ['activity', 'tone-muted'];
    const day = dayLabel(e.at);
    const header = grouped && day !== lastDay ? html\`<li class="day" aria-hidden="false">\${day}</li>\` : '';
    lastDay = day;
    const detail = eventDetail(e);
    const next = events[i + 1];
    const last = !next || (grouped && dayLabel(next.at) !== day);
    return html\`\${header}<li class="event \${last ? 'last' : ''}">
      <span class="icon-badge \${tone}">\${icon(iconName)}</span>
      <div class="body">
        <p class="what">\${t(\`ev.\${e.kind}\`)}\${detail ? html\` <em>· \${detail}</em>\` : ''}</p>
        <p class="meta">\${e.device ? html\`<span>\${e.device.label}</span>\` : ''}\${e.ip ? html\`<span class="mono">\${e.ip}</span>\` : ''}</p>
      </div>
      <time datetime="\${new Date(e.at).toISOString()}" title="\${fmtDateTime(e.at)}">\${grouped ? fmtTime(e.at) : fmtRelative(e.at)}</time>
    </li>\`;
  })}</ol>\`;
}

const activityState = { filter: 'all', events: null, more: false };

VIEWS.activite = {
  render(a) {
    const events = activityState.events ?? a.activity;
    const shown = activityState.filter === 'all' ? events : events.filter((e) => EVENT_GROUPS[activityState.filter].includes(e.kind));
    return html\`<div class="view">
      \${pageHead({ eyebrow: t('nav.section.data'), title: t('activity.title'), desc: t('activity.desc') })}
      <div class="filters" role="group" aria-label="\${t('activity.title')}">
        \${['all', 'logins', 'security', 'apps'].map((f) => html\`<button class="chip" data-action="activity-filter" data-filter="\${f}" aria-pressed="\${String(activityState.filter === f)}">\${t(\`activity.filter.\${f}\`)}</button>\`)}
      </div>
      <section class="card glass">
        \${timeline(shown)}
        \${(activityState.events ? activityState.more : a.activity.length >= 40) ? html\`<div class="card-foot"><button class="btn btn-glass btn-sm" data-action="activity-more">\${icon('chevron-down')}\${t('activity.more')}</button></div>\` : ''}
      </section>
      <p class="tiny subtle row">\${icon('info')}<span>\${t('activity.retention')}</span></p>
    </div>\`;
  },
};

Object.assign(ACTIONS, {
  'activity-filter'(button) {
    activityState.filter = button.dataset.filter;
    renderShell();
  },
  async 'activity-more'(button) {
    await busy(button, async () => {
      const current = activityState.events ?? state.account.activity;
      const before = current.at(-1)?.at ?? Date.now();
      const page = await api(\`/api/activity?before=\${before}\`);
      activityState.events = [...current, ...page.events];
      activityState.more = page.more;
    });
    renderShell();
  },
});

// src/36-profile.js
/* Profil : photo, nom, email, identifiant et préférences. */

messages({
  fr: {
    'profile.title': 'Profil', 'profile.desc': 'Ce que les apps de la suite voient de toi quand tu te connectes avec Cord.',
    'profile.photo': 'Changer la photo', 'profile.photoRemove': 'Retirer la photo', 'profile.photoSaved': 'Photo mise à jour.', 'profile.photoRemoved': 'Photo retirée : ton avatar généré est de retour.',
    'profile.photoError': 'Image illisible. Essaie un PNG ou un JPEG.', 'profile.photoHint': 'Recadrée en carré, 256 × 256. Sans photo, un avatar est généré à partir de ton identifiant.',
    'profile.identity': 'Identité', 'profile.name': 'Nom affiché', 'profile.nameSaved': 'Nom enregistré.',
    'profile.email': 'Adresse email', 'profile.emailChange': 'Modifier', 'profile.id': 'Identifiant Cord', 'profile.since': 'Membre depuis',
    'profile.idHint': 'Identifiant permanent partagé avec les apps connectées (« sub » OIDC).',
    'email.title': 'Changer d’adresse email', 'email.desc': 'On envoie un lien de confirmation à la nouvelle adresse. L’ancienne reste active tant que tu n’as pas cliqué.',
    'email.new': 'Nouvelle adresse', 'email.password': 'Mot de passe actuel', 'email.submit': 'Envoyer le lien',
    'email.sent': 'Lien envoyé à {email}. Clique dessus pour finaliser le changement.', 'email.changed': 'Adresse email mise à jour : {email}.',
    'prefs.title': 'Préférences', 'prefs.theme': 'Apparence', 'prefs.themeDesc': 'Le Compte Cord suit ton système, ou le thème de ton choix.',
    'prefs.system': 'Système', 'prefs.dark': 'Sombre', 'prefs.light': 'Clair', 'prefs.lang': 'Langue', 'prefs.langDesc': 'Pour le portail et, bientôt, pour les emails.',
    'prefs.saved': 'Préférences enregistrées.',
  },
  en: {
    'profile.title': 'Profile', 'profile.desc': 'What the suite’s apps see about you when you sign in with Cord.',
    'profile.photo': 'Change photo', 'profile.photoRemove': 'Remove photo', 'profile.photoSaved': 'Photo updated.', 'profile.photoRemoved': 'Photo removed: your generated avatar is back.',
    'profile.photoError': 'Couldn’t read that image. Try a PNG or a JPEG.', 'profile.photoHint': 'Cropped to a 256 × 256 square. Without a photo, an avatar is generated from your ID.',
    'profile.identity': 'Identity', 'profile.name': 'Display name', 'profile.nameSaved': 'Name saved.',
    'profile.email': 'Email address', 'profile.emailChange': 'Change', 'profile.id': 'Cord ID', 'profile.since': 'Member since',
    'profile.idHint': 'Permanent ID shared with connected apps (OIDC “sub”).',
    'email.title': 'Change email address', 'email.desc': 'We send a confirmation link to the new address. The old one stays active until you click it.',
    'email.new': 'New address', 'email.password': 'Current password', 'email.submit': 'Send the link',
    'email.sent': 'Link sent to {email}. Click it to finish the change.', 'email.changed': 'Email address updated: {email}.',
    'prefs.title': 'Preferences', 'prefs.theme': 'Appearance', 'prefs.themeDesc': 'Cord Account follows your system, or the theme you pick.',
    'prefs.system': 'System', 'prefs.dark': 'Dark', 'prefs.light': 'Light', 'prefs.lang': 'Language', 'prefs.langDesc': 'For the portal and, soon, for emails.',
    'prefs.saved': 'Preferences saved.',
  },
});

VIEWS.profil = {
  render(a) {
    const u = a.user;
    return html\`<div class="view">
      \${pageHead({ eyebrow: t('nav.section.account'), title: t('profile.title'), desc: t('profile.desc') })}
      <section class="card glass card-lg">
        <div class="profile-hero">
          <div class="avatar-edit">
            <div class="avatar-ring avatar-2xl">\${avatar(u)}</div>
            <label class="btn btn-primary btn-icon" aria-label="\${t('profile.photo')}" title="\${t('profile.photo')}">\${icon('camera')}<input type="file" accept="image/png,image/jpeg,image/webp,image/heic" class="sr-only" data-change="avatar-upload"></label>
          </div>
          <div class="who">
            <h2>\${u.name}</h2>
            <p>\${u.email}</p>
            <div class="row-wrap">
              \${u.avatarUrl ? html\`<button class="btn btn-ghost btn-sm" data-action="avatar-remove">\${icon('trash-2')}\${t('profile.photoRemove')}</button>\` : ''}
            </div>
            <p class="tiny subtle">\${t('profile.photoHint')}</p>
          </div>
        </div>
      </section>

      <section class="card glass">
        <div class="card-head"><span class="icon-badge">\${icon('id-card')}</span><div class="grow"><h2 class="card-title">\${t('profile.identity')}</h2></div></div>
        <div class="card-body stack">
          <form class="field" data-scope="profile" id="name-form">
            <label for="p-name">\${t('profile.name')}</label>
            <div class="row"><input class="input" id="p-name" name="name" required maxlength="60" value="\${u.name}" autocomplete="nickname"><button class="btn btn-glass" type="submit">\${t('common.save')}</button></div>
          </form>
          <div class="field"><span class="field-label">\${t('profile.email')}</span>
            <div class="row"><input class="input" value="\${u.email}" readonly aria-label="\${t('profile.email')}">
              <button class="btn btn-glass" data-action="email-change">\${t('profile.emailChange')}</button></div>
            \${u.emailVerified ? html\`<p class="field-hint row">\${icon('badge-check')}<span>\${t('hello.verified')}</span></p>\` : html\`<p class="field-hint">\${t('verify.desc')} <button class="link-btn" data-action="send-verification">\${t('verify.send')}</button></p>\`}
          </div>
          <div class="field"><span class="field-label">\${t('profile.id')}</span>
            <div class="copyable"><code>\${u.id}</code><button class="btn btn-ghost btn-icon btn-sm" data-action="copy" data-value="\${u.id}" aria-label="\${t('common.copy')}">\${icon('copy')}</button></div>
            <p class="field-hint">\${t('profile.idHint')}</p>
          </div>
          <dl class="kv"><dt>\${t('profile.since')}</dt><dd>\${fmtDate(u.createdAt)}</dd></dl>
        </div>
      </section>

      <section class="card glass">
        <div class="card-head"><span class="icon-badge">\${icon('sliders-horizontal')}</span><div class="grow"><h2 class="card-title">\${t('prefs.title')}</h2></div></div>
        <div class="card-body">
          <div class="pref"><div class="label"><strong>\${t('prefs.theme')}</strong><span>\${t('prefs.themeDesc')}</span></div>
            <div class="segmented" role="radiogroup" aria-label="\${t('prefs.theme')}">
              \${[['system', 'sun-moon'], ['dark', 'moon'], ['light', 'sun']].map(([value, ic]) => html\`<label><input type="radio" name="theme" value="\${value}" data-change="pref-theme" \${u.theme === value ? raw('checked') : ''}><span>\${icon(ic)}\${t(\`prefs.\${value}\`)}</span></label>\`)}
            </div></div>
          <div class="pref"><div class="label"><strong>\${t('prefs.lang')}</strong><span>\${t('prefs.langDesc')}</span></div>
            <div class="segmented" role="radiogroup" aria-label="\${t('prefs.lang')}">
              \${[['fr', 'Français'], ['en', 'English']].map(([value, label]) => html\`<label><input type="radio" name="locale" value="\${value}" data-change="pref-locale" \${locale === value ? raw('checked') : ''}><span>\${label}</span></label>\`)}
            </div></div>
        </div>
      </section>
    </div>\`;
  },
  mount(root) {
    $('#name-form', root).addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.target;
      await busy($('[type="submit"]', form), async () => {
        try {
          await api('/api/me', { name: form.name.value.trim() }, 'PATCH');
          toast(t('profile.nameSaved'));
          refresh();
        } catch (e) { toastError(e); }
      });
    });
  },
};

/** Recadre en carré 256 px et compresse (WebP, sinon JPEG) sous ~120 Ko. */
async function prepareAvatar(file) {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new Error(t('profile.photoError'));
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const side = Math.min(bitmap.width, bitmap.height);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, size, size);
  for (const [type, quality] of [['image/webp', 0.86], ['image/jpeg', 0.86], ['image/jpeg', 0.7], ['image/jpeg', 0.5]]) {
    const url = canvas.toDataURL(type, quality);
    if (url.startsWith(\`data:\${type}\`) && url.length < 170_000) return url;
  }
  throw new Error(t('profile.photoError'));
}

Object.assign(ACTIONS, {
  async 'avatar-upload'(input) {
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    const avatarUrl = await prepareAvatar(file);
    await api('/api/me', { avatar: avatarUrl }, 'PATCH');
    toast(t('profile.photoSaved'));
    refresh();
  },
  async 'avatar-remove'(button) {
    await busy(button, () => api('/api/me', { avatar: null }, 'PATCH'));
    toast(t('profile.photoRemoved'), { type: 'info' });
    refresh();
  },
  copy(button) {
    return copyText(button.dataset.value);
  },
  'email-change'() {
    const recent = recentStrongLogin();
    return modal({
      title: t('email.title'),
      desc: t('email.desc'),
      iconName: 'at-sign',
      body: html\`<div class="field"><label for="m-email">\${t('email.new')}</label><input class="input" id="m-email" type="email" name="email" required maxlength="254" autocomplete="email" autofocus></div>
        \${recent ? '' : passwordField({ name: 'password', label: t('email.password') })}\`,
      actions: html\`<button type="button" class="btn btn-ghost" data-close>\${t('common.cancel')}</button><button type="submit" class="btn btn-primary">\${icon('send')}\${t('email.submit')}</button>\`,
      async onSubmit(data, ctx) {
        const email = String(data.get('email')).trim();
        const result = await api('/api/email/change', { email, password: data.get('password') ?? undefined });
        ctx.close();
        toast(t('email.sent', { email }), { duration: 9000, ...(result.devUrl ? { action: { href: result.devUrl, label: t('auth.devLink') } } : {}) });
      },
    });
  },
  async 'pref-theme'(input) {
    applyTheme(input.value);
    state.account.user.theme = input.value;
    await api('/api/me', { theme: input.value }, 'PATCH');
    renderShell();
  },
  async 'pref-locale'(input) {
    setLocale(input.value);
    state.account.user.locale = input.value;
    await api('/api/me', { locale: input.value }, 'PATCH');
    renderShell();
    toast(t('prefs.saved'), { duration: 2000 });
  },
});

// src/37-privacy.js
/* Confidentialité : inventaire des données, export RGPD, suppression du compte. */

messages({
  fr: {
    'privacy.title': 'Confidentialité', 'privacy.desc': 'Tout ce que le Compte Cord sait de toi, et comment le récupérer ou l’effacer.',
    'privacy.inventory': 'Ce que nous savons de toi',
    'inv.profile': 'Profil', 'inv.profile.desc': 'Nom, email{photo}, date d’inscription, préférences.',
    'inv.photo': ', photo',
    'inv.security': 'Sécurité', 'inv.security.desc': 'Mot de passe haché (scrypt){mfa}. Jamais lisibles, même par nous.',
    'inv.mfa': ', secret 2FA chiffré (AES-256-GCM), codes de secours hachés',
    'inv.keys': 'Clés de connexion', 'inv.keys.desc': 'Clés publiques de tes passkeys et iPhone Passcord. Les clés privées restent sur tes appareils.',
    'inv.sessions': 'Sessions', 'inv.sessions.desc': 'Appareil (navigateur, système), IP et dates. Jetons stockés hachés, expirent après 7 jours.',
    'inv.apps': 'Apps connectées', 'inv.apps.desc': 'Quelles apps tu as autorisées, quand, et avec quelles permissions.',
    'inv.events': 'Journal d’activité', 'inv.events.desc': 'Connexions et changements du compte, effacés automatiquement après 180 jours.',
    'privacy.never': 'Ce qu’on ne stocke jamais',
    'never.1': 'Ton mot de passe en clair — ni en base, ni dans les journaux.', 'never.2': 'La clé privée de Passcord ou de tes passkeys.',
    'never.3': 'Le contenu de tes apps : fichiers Drivecord, coffre Passcord, podcasts Tunecord…', 'never.4': 'De pisteur, de pub ou de cookie tiers. Un seul cookie : ta session.',
    'privacy.export': 'Exporter mes données', 'privacy.exportDesc': 'Un fichier JSON lisible avec tout ce qui précède (hors secrets, qu’on ne connaît pas en clair).',
    'privacy.exportBtn': 'Télécharger (JSON)', 'privacy.exported': 'Export téléchargé.',
    'privacy.delete': 'Supprimer mon compte', 'privacy.deleteDesc': 'Efface définitivement ton Compte Cord : profil, appareils, sessions, apps connectées et historique. Irréversible.',
    'privacy.deleteBtn': 'Supprimer mon compte…',
    'del.title': 'Supprimer définitivement ton compte ?', 'del.desc': 'Cette action ne peut pas être annulée.',
    'del.list.1': 'Tu seras déconnecté de toutes les apps de la suite.', 'del.list.2': 'Tes iPhone Passcord et passkeys ne fonctionneront plus.',
    'del.list.3': 'Les données propres à chaque app (fichiers Drivecord…) restent gérées par ces apps.',
    'del.confirm': 'Pour confirmer, saisis ton adresse email', 'del.mismatch': 'L’adresse ne correspond pas.', 'del.submit': 'Supprimer mon compte',
    'del.exportFirst': 'Exporter mes données d’abord', 'del.done': 'Ton compte a été supprimé. Merci d’avoir essayé Cord.',
  },
  en: {
    'privacy.title': 'Privacy', 'privacy.desc': 'Everything Cord Account knows about you, and how to take it back or erase it.',
    'privacy.inventory': 'What we know about you',
    'inv.profile': 'Profile', 'inv.profile.desc': 'Name, email{photo}, sign-up date, preferences.',
    'inv.photo': ', photo',
    'inv.security': 'Security', 'inv.security.desc': 'Hashed password (scrypt){mfa}. Never readable, not even by us.',
    'inv.mfa': ', encrypted 2FA secret (AES-256-GCM), hashed recovery codes',
    'inv.keys': 'Sign-in keys', 'inv.keys.desc': 'Public keys of your passkeys and Passcord iPhones. Private keys stay on your devices.',
    'inv.sessions': 'Sessions', 'inv.sessions.desc': 'Device (browser, OS), IP and dates. Tokens stored hashed, expire after 7 days.',
    'inv.apps': 'Connected apps', 'inv.apps.desc': 'Which apps you authorized, when, and with which permissions.',
    'inv.events': 'Activity log', 'inv.events.desc': 'Sign-ins and account changes, automatically erased after 180 days.',
    'privacy.never': 'What we never store',
    'never.1': 'Your plaintext password — not in the database, not in logs.', 'never.2': 'The private key of Passcord or your passkeys.',
    'never.3': 'Your apps’ content: Drivecord files, Passcord vault, Tunecord podcasts…', 'never.4': 'Trackers, ads or third-party cookies. One cookie only: your session.',
    'privacy.export': 'Export my data', 'privacy.exportDesc': 'A readable JSON file with everything above (except secrets, which we never know in plaintext).',
    'privacy.exportBtn': 'Download (JSON)', 'privacy.exported': 'Export downloaded.',
    'privacy.delete': 'Delete my account', 'privacy.deleteDesc': 'Permanently erases your Cord account: profile, devices, sessions, connected apps and history. Irreversible.',
    'privacy.deleteBtn': 'Delete my account…',
    'del.title': 'Permanently delete your account?', 'del.desc': 'This can’t be undone.',
    'del.list.1': 'You’ll be signed out of every app in the suite.', 'del.list.2': 'Your Passcord iPhones and passkeys will stop working.',
    'del.list.3': 'Each app’s own data (Drivecord files…) stays managed by that app.',
    'del.confirm': 'To confirm, type your email address', 'del.mismatch': 'The address doesn’t match.', 'del.submit': 'Delete my account',
    'del.exportFirst': 'Export my data first', 'del.done': 'Your account was deleted. Thanks for trying Cord.',
  },
});

VIEWS.confidentialite = {
  render(a) {
    const items = [
      ['user-round', 'profile', 1, { photo: a.user.avatarUrl ? t('inv.photo') : '' }],
      ['lock', 'security', null, { mfa: a.security.mfa ? t('inv.mfa') : '' }],
      ['fingerprint-pattern', 'keys', a.passkeys.length + a.passcord.length],
      ['monitor-smartphone', 'sessions', a.sessions.length],
      ['app-window', 'apps', a.apps.length],
      ['history', 'events', a.activity.length >= 40 ? '40+' : a.activity.length],
    ];
    return html\`<div class="view">
      \${pageHead({ eyebrow: t('nav.section.data'), title: t('privacy.title'), desc: t('privacy.desc') })}
      <section class="card glass">
        <div class="card-head"><span class="icon-badge">\${icon('database')}</span><div class="grow"><h2 class="card-title">\${t('privacy.inventory')}</h2></div></div>
        <div class="inventory card-body">
          \${items.map(([ic, key, count, vars]) => html\`<div class="item"><span class="icon-badge sm tone-muted">\${icon(ic)}</span>
            <div><strong>\${t(\`inv.\${key}\`)}</strong><p>\${t(\`inv.\${key}.desc\`, vars ?? {})}</p></div>\${count !== null && count !== undefined ? html\`<span class="count">\${count}</span>\` : ''}</div>\`)}
        </div>
      </section>
      <section class="card glass">
        <div class="card-head"><span class="icon-badge tone-ok">\${icon('shield-check')}</span><div class="grow"><h2 class="card-title">\${t('privacy.never')}</h2></div></div>
        <ul class="never card-body">\${[1, 2, 3, 4].map((n) => html\`<li>\${icon('check')}<span>\${t(\`never.\${n}\`)}</span></li>\`)}</ul>
      </section>
      <section class="card glass">
        <div class="method">
          <span class="icon-badge tone-info">\${icon('file-json')}</span>
          <div><h2 class="card-title">\${t('privacy.export')}</h2><p class="card-desc">\${t('privacy.exportDesc')}</p></div>
          <div class="state"><button class="btn btn-glass" data-action="export-data">\${icon('download')}\${t('privacy.exportBtn')}</button></div>
        </div>
      </section>
      <section class="card glass danger-zone">
        <div class="method">
          <span class="icon-badge tone-danger">\${icon('trash-2')}</span>
          <div><h2 class="card-title">\${t('privacy.delete')}</h2><p class="card-desc">\${t('privacy.deleteDesc')}</p></div>
          <div class="state"><button class="btn btn-danger" data-action="delete-account">\${t('privacy.deleteBtn')}</button></div>
        </div>
      </section>
    </div>\`;
  },
};

async function exportData() {
  const response = await fetch('/api/account/export', { credentials: 'same-origin' });
  if (!response.ok) throw new Error(t('error.server'));
  const data = await response.json();
  downloadFile(\`compte-cord-\${new Date().toISOString().slice(0, 10)}.json\`, JSON.stringify(data, null, 2));
  toast(t('privacy.exported'));
}

Object.assign(ACTIONS, {
  async 'export-data'(button) {
    await busy(button, exportData);
  },
  'delete-account'() {
    const email = state.account.user.email;
    return modal({
      title: t('del.title'),
      desc: t('del.desc'),
      iconName: 'triangle-alert',
      tone: 'tone-danger',
      body: html\`<ul class="never">\${[1, 2, 3].map((n) => html\`<li>\${icon('circle-alert')}<span>\${t(\`del.list.\${n}\`)}</span></li>\`)}</ul>
        <button type="button" class="btn btn-glass btn-sm" data-export>\${icon('download')}\${t('del.exportFirst')}</button>
        <div class="field"><label for="m-del">\${t('del.confirm')}</label><input class="input" id="m-del" name="email" type="email" required autocomplete="off" placeholder="\${email}" spellcheck="false" autocapitalize="off"></div>\`,
      actions: html\`<button type="button" class="btn btn-ghost" data-close>\${t('common.cancel')}</button><button type="submit" class="btn btn-danger-solid">\${icon('trash-2')}\${t('del.submit')}</button>\`,
      onOpen(ctx) {
        $('[data-export]', ctx.dialog).addEventListener('click', (event) => busy(event.currentTarget, () => exportData().catch(toastError)));
      },
      async onSubmit(data, ctx) {
        if (String(data.get('email')).trim().toLowerCase() !== email.toLowerCase()) throw new Error(t('del.mismatch'));
        await api('/api/me', {}, 'DELETE');
        ctx.close();
        state.account = null;
        history.replaceState(null, '', '/');
        showLanding();
        toast(t('del.done'), { type: 'info', duration: 8000 });
      },
    });
  },
});

// src/38-admin.js
/* Administration (propriétaire uniquement, CORD_ADMINS) : statistiques, clients OAuth et bêta fermée de Passcord. */

messages({
  fr: {
    'admin.title': 'Administration', 'admin.desc': 'Vue d’ensemble du Compte Cord. Aucune donnée personnelle n’est affichée ici.',
    'admin.tab.overview': 'Vue d’ensemble', 'admin.tab.beta': 'Bêta Passcord',
    'admin.users': 'Comptes', 'admin.verified': 'Emails vérifiés', 'admin.sessions': 'Sessions actives', 'admin.logins': 'Connexions (24 h)',
    'admin.signups': 'Inscriptions — 30 derniers jours', 'admin.signups7': '{n} cette semaine', 'admin.adoption': 'Adoption de la sécurité',
    'admin.mfa': 'Double authentification', 'admin.passkeys': 'Passkeys', 'admin.passcord': 'Passcord', 'admin.failures': '{n} échec(s) de connexion en 24 h',
    'admin.clients': 'Clients OAuth', 'admin.clientsDesc': 'Déclarés dans la variable CORD_CLIENTS (les secrets ne sont jamais affichés).',
    'admin.client': 'Application', 'admin.redirects': 'Adresses de retour', 'admin.clientUsers': 'Comptes', 'admin.lastUse': 'Dernier usage',
    'admin.mail': 'Emails', 'admin.mailOn': 'Resend configuré', 'admin.mailOff': 'Envoi d’emails non configuré',
    'admin.loading': 'Chargement des statistiques…',
    'beta.desc': 'Génère des clés d’accès à la bêta fermée de Passcord. Une clé s’utilise sur compte.cordsuite.app ou dans CordLauncher et débloque le téléchargement de l’app.',
    'beta.activeKeys': 'Clés actives', 'beta.testers': 'Testeurs', 'beta.build': 'Dernier build', 'beta.noBuild': 'Aucun',
    'beta.downloadsOff': 'Téléchargement direct non configuré', 'beta.downloadsOffDesc': 'Ajoute la variable PASSCORD_RELEASES_TOKEN (jeton GitHub en lecture seule sur le dépôt Passcord) pour que les testeurs téléchargent l’IPA depuis le Compte Cord.',
    'beta.generate': 'Générer des clés', 'beta.generateDesc': 'Chaque clé n’est affichée qu’une fois : copie-la avant de fermer.',
    'beta.count': 'Nombre de clés', 'beta.uses': 'Utilisations par clé', 'beta.validity': 'Validité', 'beta.label': 'Note (facultatif)', 'beta.labelPh': 'Ex. Serveur Discord, amis…',
    'beta.never': 'Sans limite', 'beta.days': '{n} jours', 'beta.create': 'Générer',
    'beta.created.one': 'Clé créée', 'beta.created.other': '{n} clés créées', 'beta.createdDesc': 'Elles ne seront plus jamais affichées en entier : copie-les maintenant.',
    'beta.copyAll': 'Tout copier', 'beta.copiedAll': 'Clés copiées.', 'beta.saveTxt': 'Enregistrer (.txt)', 'beta.done': 'C’est noté',
    'beta.keys': 'Clés d’accès', 'beta.keysEmpty': 'Aucune clé pour l’instant', 'beta.keysEmptyDesc': 'Génère une première clé pour inviter un testeur.',
    'beta.key': 'Clé', 'beta.usage': 'Utilisations', 'beta.expires': 'Expire', 'beta.state': 'État', 'beta.createdAt': 'Créée',
    'beta.status.active': 'Active', 'beta.status.used': 'Utilisée', 'beta.status.expired': 'Expirée', 'beta.status.revoked': 'Désactivée',
    'beta.revoke': 'Désactiver', 'beta.revokeTitle': 'Désactiver cette clé ?', 'beta.revokeDesc': 'Elle ne pourra plus être utilisée. Les testeurs qui l’ont déjà utilisée gardent leur accès.', 'beta.revoked': 'Clé désactivée.',
    'beta.testersTitle': 'Testeurs', 'beta.testersEmpty': 'Aucun testeur', 'beta.testersEmptyDesc': 'Ils apparaîtront ici dès qu’ils auront utilisé une clé.',
    'beta.via': 'via {key}', 'beta.remove': 'Retirer', 'beta.removeTitle': 'Retirer {name} de la bêta ?', 'beta.removeDesc': 'Son compte Cord reste intact, mais il ne pourra plus télécharger Passcord sans une nouvelle clé.', 'beta.removed': 'Testeur retiré.',
    'beta.txtHeader': 'Clés d’accès à la bêta fermée de Passcord — à utiliser sur https://compte.cordsuite.app/#apps',
    'beta.direct': 'Installation directe', 'beta.directOn': 'Active', 'beta.directOff': 'À configurer',
    'beta.directOnDesc': 'Les testeurs téléchargent le dernier build de {repo}, et CordLauncher l’installe sans fichier à récupérer.',
    'beta.directOffDesc': 'Pour que les testeurs installent Passcord en un clic, le Compte Cord doit pouvoir lire tes releases privées sur GitHub.',
    'beta.directEnv': 'Jeton fourni par la variable PASSCORD_RELEASES_TOKEN du serveur.', 'beta.directAdmin': 'Jeton GitHub enregistré chiffré dans le Compte Cord — il n’est jamais réaffiché.',
    'beta.step1': 'Crée un jeton sur GitHub : dans « Repository access », choisis « Only select repositories » → passcord. La permission « Contents : lecture » est déjà cochée.',
    'beta.step1Btn': 'Créer le jeton', 'beta.step2': 'Colle-le ici : le Compte Cord vérifie qu’il ouvre bien le dépôt, puis le garde chiffré.',
    'beta.activate': 'Activer', 'beta.change': 'Changer le jeton', 'beta.disable': 'Désactiver', 'beta.activated': 'Installation directe activée.',
    'beta.disableTitle': 'Désactiver l’installation directe ?', 'beta.disableDesc': 'Le jeton GitHub est effacé du Compte Cord. Les testeurs devront de nouveau choisir un fichier .ipa.', 'beta.disabled': 'Installation directe désactivée.',
  },
  en: {
    'admin.title': 'Admin', 'admin.desc': 'Cord Account at a glance. No personal data is shown here.',
    'admin.tab.overview': 'Overview', 'admin.tab.beta': 'Passcord beta',
    'admin.users': 'Accounts', 'admin.verified': 'Verified emails', 'admin.sessions': 'Active sessions', 'admin.logins': 'Sign-ins (24 h)',
    'admin.signups': 'Sign-ups — last 30 days', 'admin.signups7': '{n} this week', 'admin.adoption': 'Security adoption',
    'admin.mfa': 'Two-factor', 'admin.passkeys': 'Passkeys', 'admin.passcord': 'Passcord', 'admin.failures': '{n} failed sign-in(s) in 24 h',
    'admin.clients': 'OAuth clients', 'admin.clientsDesc': 'Declared in the CORD_CLIENTS variable (secrets are never shown).',
    'admin.client': 'Application', 'admin.redirects': 'Redirect URIs', 'admin.clientUsers': 'Accounts', 'admin.lastUse': 'Last used',
    'admin.mail': 'Emails', 'admin.mailOn': 'Resend configured', 'admin.mailOff': 'Email delivery not configured',
    'admin.loading': 'Loading statistics…',
    'beta.desc': 'Generate access keys for the Passcord closed beta. A key is redeemed on compte.cordsuite.app or in CordLauncher and unlocks the app download.',
    'beta.activeKeys': 'Active keys', 'beta.testers': 'Testers', 'beta.build': 'Latest build', 'beta.noBuild': 'None',
    'beta.downloadsOff': 'Direct download not configured', 'beta.downloadsOffDesc': 'Add the PASSCORD_RELEASES_TOKEN variable (read-only GitHub token on the Passcord repo) so testers can download the IPA from their Cord account.',
    'beta.generate': 'Generate keys', 'beta.generateDesc': 'Each key is shown only once: copy it before closing.',
    'beta.count': 'Number of keys', 'beta.uses': 'Uses per key', 'beta.validity': 'Valid for', 'beta.label': 'Note (optional)', 'beta.labelPh': 'E.g. Discord server, friends…',
    'beta.never': 'No limit', 'beta.days': '{n} days', 'beta.create': 'Generate',
    'beta.created.one': 'Key created', 'beta.created.other': '{n} keys created', 'beta.createdDesc': 'They will never be shown in full again: copy them now.',
    'beta.copyAll': 'Copy all', 'beta.copiedAll': 'Keys copied.', 'beta.saveTxt': 'Save (.txt)', 'beta.done': 'Got it',
    'beta.keys': 'Access keys', 'beta.keysEmpty': 'No keys yet', 'beta.keysEmptyDesc': 'Generate a first key to invite a tester.',
    'beta.key': 'Key', 'beta.usage': 'Uses', 'beta.expires': 'Expires', 'beta.state': 'Status', 'beta.createdAt': 'Created',
    'beta.status.active': 'Active', 'beta.status.used': 'Used', 'beta.status.expired': 'Expired', 'beta.status.revoked': 'Disabled',
    'beta.revoke': 'Disable', 'beta.revokeTitle': 'Disable this key?', 'beta.revokeDesc': 'It can no longer be redeemed. Testers who already used it keep their access.', 'beta.revoked': 'Key disabled.',
    'beta.testersTitle': 'Testers', 'beta.testersEmpty': 'No testers', 'beta.testersEmptyDesc': 'They’ll show up here once they redeem a key.',
    'beta.via': 'via {key}', 'beta.remove': 'Remove', 'beta.removeTitle': 'Remove {name} from the beta?', 'beta.removeDesc': 'Their Cord account stays intact, but they can no longer download Passcord without a new key.', 'beta.removed': 'Tester removed.',
    'beta.txtHeader': 'Passcord closed beta access keys — redeem them at https://compte.cordsuite.app/#apps',
    'beta.direct': 'Direct install', 'beta.directOn': 'On', 'beta.directOff': 'Needs setup',
    'beta.directOnDesc': 'Testers download the latest build of {repo}, and CordLauncher installs it with no file to fetch.',
    'beta.directOffDesc': 'For testers to install Passcord in one click, the Cord Account must be able to read your private GitHub releases.',
    'beta.directEnv': 'Token provided by the server’s PASSCORD_RELEASES_TOKEN variable.', 'beta.directAdmin': 'GitHub token stored encrypted in the Cord Account — never shown again.',
    'beta.step1': 'Create a token on GitHub: under “Repository access”, pick “Only select repositories” → passcord. “Contents: read” is already checked.',
    'beta.step1Btn': 'Create the token', 'beta.step2': 'Paste it here: the Cord Account checks it opens the repository, then stores it encrypted.',
    'beta.activate': 'Turn on', 'beta.change': 'Change token', 'beta.disable': 'Turn off', 'beta.activated': 'Direct install is on.',
    'beta.disableTitle': 'Turn off direct install?', 'beta.disableDesc': 'The GitHub token is erased from the Cord Account. Testers will have to pick an .ipa file again.', 'beta.disabled': 'Direct install is off.',
  },
});

const adminState = { data: null, loading: false, tab: 'overview', beta: null, betaLoading: false };
const BETA_TONES = { active: 'tone-ok', used: 'tone-muted', expired: 'tone-warn', revoked: 'tone-danger' };
const maskedKey = (hint) => \`PASS-••••-••••-\${hint}\`;
const TOKEN_URL = 'https://github.com/settings/personal-access-tokens/new?name=Compte+Cord+-+builds+Passcord&description=Lecture+des+releases+priv%C3%A9es+de+Passcord&expires_in=none&contents=read';

function directCard(b) {
  const ready = b.downloads && !adminState.editToken;
  return html\`<section class="card glass">
    <div class="card-head"><span class="icon-badge \${b.downloads ? 'tone-ok' : 'tone-warn'}">\${icon('download')}</span>
      <div class="grow"><h2 class="card-title">\${t('beta.direct')} <span class="badge \${b.downloads ? 'tone-ok' : 'tone-warn'}">\${t(b.downloads ? 'beta.directOn' : 'beta.directOff')}</span></h2>
        <p class="card-desc">\${b.downloads ? t('beta.directOnDesc', { repo: b.repo ?? 'Passcord' }) : t('beta.directOffDesc')}</p></div>
      \${ready && b.downloadsSource === 'admin' ? html\`<div class="row-wrap"><button class="btn btn-ghost btn-sm" data-action="beta-token-edit">\${t('beta.change')}</button><button class="btn btn-ghost btn-sm" data-action="beta-token-off">\${t('beta.disable')}</button></div>\` : ''}
    </div>
    <div class="card-body">\${ready
      ? html\`<p class="subtle tiny">\${t(b.downloadsSource === 'env' ? 'beta.directEnv' : 'beta.directAdmin')}</p>\`
      : html\`<ol class="token-steps">
          <li><span class="step-n">1</span><p>\${t('beta.step1')}</p><a class="btn btn-glass btn-sm" href="\${TOKEN_URL}" target="_blank" rel="noopener">\${icon('key-round')}\${t('beta.step1Btn')}\${icon('external-link')}</a></li>
          <li><span class="step-n">2</span><div class="grow stack-sm"><p>\${t('beta.step2')}</p>
            <form id="beta-token" class="row-wrap" novalidate>
              <input class="input mono grow" name="token" type="password" autocomplete="off" spellcheck="false" placeholder="github_pat_…" aria-label="GitHub" required>
              <button class="btn btn-primary" type="submit">\${icon('check')}\${t('beta.activate')}</button>
            </form></div></li>
        </ol>\`}</div>
  </section>\`;
}

VIEWS.admin = {
  render() {
    const tabs = html\`<div class="segmented admin-tabs" role="radiogroup" aria-label="\${t('admin.title')}">
      \${[['overview', 'chart-column'], ['beta', 'key-round']].map(([value, ic]) => html\`<label><input type="radio" name="admin-tab" value="\${value}" data-change="admin-tab" \${adminState.tab === value ? raw('checked') : ''}><span>\${icon(ic)}\${t(\`admin.tab.\${value}\`)}</span></label>\`)}
    </div>\`;
    const head = (actions) => pageHead({ eyebrow: t('nav.section.owner'), title: t('admin.title'), desc: adminState.tab === 'beta' ? t('beta.desc') : t('admin.desc'), actions });
    const reload = html\`<button class="btn btn-glass btn-sm" data-action="admin-reload">\${icon('refresh-cw')}\${t('common.retry')}</button>\`;
    if (adminState.tab === 'beta') return html\`<div class="view">\${head(reload)}\${tabs}\${renderBeta()}</div>\`;

    const d = adminState.data;
    if (!d) {
      return html\`<div class="view">\${head('')}\${tabs}
        <div class="grid-4">\${[1, 2, 3, 4].map(() => html\`<div class="skeleton sk-block"></div>\`)}</div><div class="skeleton sk-block"></div></div>\`;
    }
    const { totals } = d;
    const days = [];
    const byDay = new Map(d.signups.map((s) => [s.day, s.count]));
    const today = Math.floor(Date.now() / 86400_000);
    for (let i = 29; i >= 0; i--) days.push({ day: (today - i) * 86400_000, count: byDay.get((today - i) * 86400_000) ?? 0 });
    const max = Math.max(1, ...days.map((x) => x.count));
    const pct = (n) => (totals.users ? Math.round((n / totals.users) * 100) : 0);
    return html\`<div class="view">
      \${head(html\`<span class="badge \${d.mail ? 'tone-ok' : 'tone-warn'}">\${icon('mail')}\${t(d.mail ? 'admin.mailOn' : 'admin.mailOff')}</span>\${reload}\`)}
      \${tabs}
      <section class="grid-4">
        \${[['users', 'users', ''], ['verified', 'mail-check', 'tone-ok'], ['sessions', 'monitor-smartphone', 'tone-info'], ['logins24', 'log-in', 'tone-warn']].map(([k, ic, tone]) => html\`
          <div class="stat glass"><div class="top"><span class="icon-badge sm \${tone}">\${icon(ic)}</span></div><div class="value">\${totals[k]}</div>
          <div class="label">\${t(\`admin.\${k === 'logins24' ? 'logins' : k}\`)}</div></div>\`)}
      </section>
      <section class="grid-2">
        <div class="card glass">
          <div class="card-head"><div class="grow"><h2 class="card-title">\${t('admin.signups')}</h2><p class="card-desc">\${t('admin.signups7', { n: totals.signups7 })}</p></div></div>
          <div class="bars card-body" role="img" aria-label="\${t('admin.signups')}">
            \${days.map((x, i) => html\`<span class="\${x.count ? '' : 'zero'}" data-height="\${(x.count / max) * 100}" data-delay="\${i * 12}" title="\${fmtDateShort(x.day)} · \${x.count}"></span>\`)}
          </div>
          <div class="bars-axis"><span>\${fmtDateShort(days[0].day)}</span><span>\${fmtDateShort(days.at(-1).day)}</span></div>
        </div>
        <div class="card glass">
          <div class="card-head"><div class="grow"><h2 class="card-title">\${t('admin.adoption')}</h2><p class="card-desc">\${t('admin.failures', { n: totals.failures24 })}</p></div></div>
          <div class="card-body stack">
            \${[['mfa', totals.mfa], ['passkeys', totals.passkey_users], ['passcord', totals.passcord_users]].map(([k, n]) => html\`<div class="meter">
              <div class="row"><span>\${t(\`admin.\${k}\`)}</span><span class="mono subtle">\${n} · \${pct(n)} %</span></div>
              <div class="progress"><span data-width="\${pct(n)}"></span></div></div>\`)}
          </div>
        </div>
      </section>
      <section class="card glass">
        <div class="card-head"><span class="icon-badge">\${icon('server')}</span><div class="grow"><h2 class="card-title">\${t('admin.clients')}</h2><p class="card-desc">\${t('admin.clientsDesc')}</p></div></div>
        <div class="table-wrap card-body"><table class="table">
          <thead><tr><th>\${t('admin.client')}</th><th>\${t('admin.redirects')}</th><th>\${t('admin.clientUsers')}</th><th>\${t('admin.lastUse')}</th></tr></thead>
          <tbody>\${d.clients.map((c) => html\`<tr>
            <td><div class="row">\${appLogo(c)}<div><strong>\${c.name}</strong><div class="tiny subtle mono">\${c.id}</div></div></div></td>
            <td>\${c.redirectUris.map((u) => html\`<div class="tiny mono break">\${u}</div>\`)}</td>
            <td class="mono">\${c.users}</td><td>\${c.lastUsedAt ? fmtRelative(c.lastUsedAt) : t('common.never')}</td>
          </tr>\`)}</tbody>
        </table></div>
      </section>
    </div>\`;
  },
  mount() {
    if (adminState.tab === 'beta') {
      if (!adminState.beta && !adminState.betaLoading) loadBeta();
    } else if (!adminState.data && !adminState.loading) loadAdmin();
    const form = $('#beta-generate');
    form?.addEventListener('submit', (event) => generateKeys(event, form));
    const tokenForm = $('#beta-token');
    tokenForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const input = $('[name="token"]', tokenForm);
      if (!input.value.trim()) return input.focus();
      try {
        await busy(event.submitter, () => withReauth((extra) => api('/api/admin/beta/token', { product: 'passcord', token: input.value.trim(), ...extra })));
        toast(t('beta.activated'));
        adminState.editToken = false;
        adminState.beta = null;
        renderShell();
      } catch (e) {
        input.setAttribute('aria-invalid', 'true');
        toastError(e);
      }
    });
  },
};

function renderBeta() {
  const b = adminState.beta;
  if (!b) return html\`<div class="grid-3">\${[1, 2, 3].map(() => html\`<div class="skeleton sk-block"></div>\`)}</div><div class="skeleton sk-block"></div>\`;
  const active = b.keys.filter((k) => k.status === 'active').length;
  return html\`
    <section class="grid-3">
      <div class="stat glass"><div class="top"><span class="icon-badge sm tone-ok">\${icon('key-round')}</span></div><div class="value">\${active}</div><div class="label">\${t('beta.activeKeys')}</div></div>
      <div class="stat glass"><div class="top"><span class="icon-badge sm tone-info">\${icon('users')}</span></div><div class="value">\${b.testers.length}</div><div class="label">\${t('beta.testers')}</div></div>
      <div class="stat glass"><div class="top"><span class="icon-badge sm">\${icon('smartphone')}</span></div><div class="value beta-build">\${b.release?.build ?? t('beta.noBuild')}</div>
        <div class="label">\${t('beta.build')}\${b.release?.publishedAt ? html\` · \${fmtRelative(b.release.publishedAt)}\` : ''}</div></div>
    </section>
    \${directCard(b)}
    <section class="card glass">
      <div class="card-head"><span class="icon-badge grad">\${icon('sparkles')}</span><div class="grow"><h2 class="card-title">\${t('beta.generate')}</h2><p class="card-desc">\${t('beta.generateDesc')}</p></div></div>
      <form id="beta-generate" class="card-body beta-form" novalidate>
        <div class="field"><label for="beta-count">\${t('beta.count')}</label><input class="input" id="beta-count" name="count" type="number" min="1" max="50" value="1" required></div>
        <div class="field"><label for="beta-uses">\${t('beta.uses')}</label><input class="input" id="beta-uses" name="maxUses" type="number" min="1" max="1000" value="1" required></div>
        <div class="field"><label for="beta-validity">\${t('beta.validity')}</label><select class="input" id="beta-validity" name="expiresInDays">
          \${[7, 30, 90, 0].map((n) => html\`<option value="\${n}" \${n === 30 ? raw('selected') : ''}>\${n ? t('beta.days', { n }) : t('beta.never')}</option>\`)}
        </select></div>
        <div class="field beta-label"><label for="beta-label">\${t('beta.label')}</label><input class="input" id="beta-label" name="label" maxlength="60" placeholder="\${t('beta.labelPh')}"></div>
        <div class="beta-submit"><button class="btn btn-primary" type="submit">\${icon('key-round')}\${t('beta.create')}</button></div>
      </form>
    </section>
    <section class="card glass">
      <div class="card-head"><span class="icon-badge">\${icon('key')}</span><div class="grow"><h2 class="card-title">\${t('beta.keys')}</h2></div></div>
      <div class="card-body">\${b.keys.length
        ? html\`<div class="table-wrap"><table class="table">
            <thead><tr><th>\${t('beta.key')}</th><th>\${t('beta.usage')}</th><th>\${t('beta.expires')}</th><th>\${t('beta.state')}</th><th></th></tr></thead>
            <tbody>\${b.keys.map((k) => html\`<tr>
              <td><div class="mono">\${maskedKey(k.hint)}</div><div class="tiny subtle">\${k.label ?? ''}\${k.label ? ' · ' : ''}\${t('beta.createdAt')} \${fmtRelative(k.createdAt)}</div></td>
              <td class="mono">\${k.uses} / \${k.maxUses}</td>
              <td>\${k.expiresAt ? fmtDateShort(k.expiresAt) : t('beta.never')}</td>
              <td><span class="badge \${BETA_TONES[k.status]}">\${t(\`beta.status.\${k.status}\`)}</span></td>
              <td class="actions-cell">\${k.status === 'active' ? html\`<button class="btn btn-danger btn-sm" data-action="beta-revoke" data-id="\${k.id}">\${t('beta.revoke')}</button>\` : ''}</td>
            </tr>\`)}</tbody>
          </table></div>\`
        : emptyState({ iconName: 'key-round', title: t('beta.keysEmpty'), desc: t('beta.keysEmptyDesc') })}</div>
    </section>
    <section class="card glass">
      <div class="card-head"><span class="icon-badge">\${icon('users')}</span><div class="grow"><h2 class="card-title">\${t('beta.testersTitle')}</h2></div></div>
      <div class="card-body">\${b.testers.length
        ? html\`<ul class="list">\${b.testers.map((u) => html\`<li class="list-item">
            \${avatar({ id: u.userId, name: u.name, email: u.email }, 'sm')}
            <div class="body"><div class="title">\${u.name}</div><div class="meta"><span>\${u.email}</span><span>\${fmtRelative(u.grantedAt)}</span>\${u.keyHint ? html\`<span class="mono">\${t('beta.via', { key: u.keyLabel ?? \`…\${u.keyHint}\` })}</span>\` : ''}</div></div>
            <div class="actions"><button class="btn btn-ghost btn-sm" data-action="beta-remove" data-id="\${u.userId}" data-name="\${u.name}">\${t('beta.remove')}</button></div>
          </li>\`)}</ul>\`
        : emptyState({ iconName: 'users', title: t('beta.testersEmpty'), desc: t('beta.testersEmptyDesc') })}</div>
    </section>\`;
}

async function loadAdmin() {
  adminState.loading = true;
  try {
    adminState.data = await api('/api/admin/overview');
    if (state.route === 'admin') renderShell();
  } catch (e) {
    toastError(e);
  } finally {
    adminState.loading = false;
  }
}
async function loadBeta() {
  adminState.betaLoading = true;
  try {
    adminState.beta = await api('/api/admin/beta?product=passcord');
    if (state.route === 'admin' && adminState.tab === 'beta') renderShell();
  } catch (e) {
    toastError(e);
  } finally {
    adminState.betaLoading = false;
  }
}

async function generateKeys(event, form) {
  event.preventDefault();
  if (!form.checkValidity()) { $(':invalid', form)?.focus(); return toast(t('error.form'), { type: 'error' }); }
  const data = new FormData(form);
  const body = { product: 'passcord', count: Number(data.get('count')), maxUses: Number(data.get('maxUses')), expiresInDays: Number(data.get('expiresInDays')), label: String(data.get('label') ?? '') };
  const { keys } = await busy(event.submitter ?? $('[type="submit"]', form), () => api('/api/admin/beta/keys', body)).catch((e) => { toastError(e); return {}; });
  if (!keys) return;
  const codes = keys.map((k) => k.code);
  adminState.beta = null;
  modal({
    title: keys.length === 1 ? t('beta.created.one') : t('beta.created.other', { n: keys.length }),
    desc: t('beta.createdDesc'),
    iconName: 'party-popper',
    tone: 'tone-ok',
    wide: keys.length > 6,
    body: html\`<ul class="beta-codes">\${keys.map((k, i) => html\`<li data-delay="\${i * 40}"><code>\${k.code}</code>
      <button type="button" class="btn btn-ghost btn-icon btn-sm" data-copy="\${k.code}" aria-label="\${t('common.copy')}">\${icon('copy')}</button></li>\`)}</ul>\`,
    actions: html\`<button type="button" class="btn btn-ghost" data-save>\${icon('download')}\${t('beta.saveTxt')}</button>
      <button type="button" class="btn btn-glass" data-copy-all>\${icon('copy')}\${t('beta.copyAll')}</button>
      <button type="submit" class="btn btn-primary">\${t('beta.done')}</button>\`,
    onOpen(ctx) {
      hydrate(ctx.dialog);
      ctx.dialog.addEventListener('click', (e) => {
        const one = e.target.closest('[data-copy]');
        if (one) copyText(one.dataset.copy);
        if (e.target.closest('[data-copy-all]')) copyText(codes.join('\\n'), t('beta.copiedAll'));
        if (e.target.closest('[data-save]')) downloadFile(\`cles-beta-passcord-\${new Date().toISOString().slice(0, 10)}.txt\`, \`\${t('beta.txtHeader')}\\n\\n\${codes.join('\\n')}\\n\`, 'text/plain');
      });
    },
  }).then(() => renderShell());
  if (keys.length === 1) celebrate();
  form.reset();
}

Object.assign(ACTIONS, {
  'beta-token-edit'() {
    adminState.editToken = true;
    renderShell();
  },
  async 'beta-token-off'() {
    const ok = await confirmDialog({ title: t('beta.disableTitle'), desc: t('beta.disableDesc'), confirm: t('beta.disable'), iconName: 'download' });
    if (!ok) return;
    await api('/api/admin/beta/token', { product: 'passcord' }, 'DELETE');
    toast(t('beta.disabled'), { type: 'info' });
    adminState.beta = null;
    renderShell();
  },
  'admin-reload'() {
    if (adminState.tab === 'beta') adminState.beta = null;
    else adminState.data = null;
    renderShell();
  },
  'admin-tab'(input) {
    adminState.tab = input.value;
    renderShell();
  },
  async 'beta-revoke'(button) {
    const ok = await confirmDialog({ title: t('beta.revokeTitle'), desc: t('beta.revokeDesc'), confirm: t('beta.revoke'), iconName: 'ban' });
    if (!ok) return;
    await api('/api/admin/beta/keys', { id: button.dataset.id }, 'DELETE');
    toast(t('beta.revoked'), { type: 'info' });
    adminState.beta = null;
    renderShell();
  },
  async 'beta-remove'(button) {
    const name = button.dataset.name;
    const ok = await confirmDialog({ title: t('beta.removeTitle', { name }), desc: t('beta.removeDesc'), confirm: t('beta.remove'), iconName: 'user-round' });
    if (!ok) return;
    await api('/api/admin/beta/testers', { userId: button.dataset.id, product: 'passcord' }, 'DELETE');
    toast(t('beta.removed'), { type: 'info' });
    adminState.beta = null;
    renderShell();
  },
});

// src/40-consent.js
/* Écran de consentement OAuth / OIDC (/authorize). */

messages({
  fr: {
    'consent.title': '<strong>{app}</strong> souhaite accéder à ton compte Cord',
    'consent.sub': 'Vérifie ce qui sera partagé avant de continuer.',
    'consent.as': 'Connecté en tant que', 'consent.switch': 'Changer',
    'consent.will': '{app} pourra voir :',
    'scope.openid.desc': 'Pour te reconnaître d’une connexion à l’autre', 'scope.profile.desc': 'Pour personnaliser ton espace', 'scope.email.desc': 'Pour te contacter à propos de ton compte',
    'consent.assure': '{app} ne verra jamais ton mot de passe ni tes clés Passcord. Tu peux révoquer cet accès à tout moment depuis ton Compte Cord.',
    'consent.allow': 'Autoriser', 'consent.deny': 'Annuler', 'consent.redirect': 'Tu seras redirigé vers {host}',
    'consent.continuing': 'Connexion à {app}…', 'consent.invalid': 'Lien de connexion invalide',
    'consent.invalidDesc': 'Cette demande ne vient pas d’une app reconnue par le Compte Cord, ou son adresse de retour n’est pas autorisée. Retourne dans l’app et réessaie.',
    'consent.verify': 'Confirme ton email pour continuer', 'consent.verifyDesc': '{app} a besoin d’une adresse vérifiée. Tape le code à 6 chiffres envoyé à {email}.',
    'consent.verifySubmit': 'Continuer vers {app}', 'consent.firstParty': '{app} fait partie de la suite Cord : pas besoin d’autorisation.',
    'consent.verifyCheck': 'J’ai confirmé mon adresse', 'consent.home': 'Aller à mon compte',
  },
  en: {
    'consent.title': '<strong>{app}</strong> wants to access your Cord account',
    'consent.sub': 'Check what will be shared before continuing.',
    'consent.as': 'Signed in as', 'consent.switch': 'Switch',
    'consent.will': '{app} will be able to see:',
    'scope.openid.desc': 'To recognize you across sign-ins', 'scope.profile.desc': 'To personalize your space', 'scope.email.desc': 'To contact you about your account',
    'consent.assure': '{app} will never see your password or your Passcord keys. You can revoke this access anytime from your Cord account.',
    'consent.allow': 'Allow', 'consent.deny': 'Cancel', 'consent.redirect': 'You’ll be redirected to {host}',
    'consent.continuing': 'Signing in to {app}…', 'consent.invalid': 'Invalid sign-in link',
    'consent.invalidDesc': 'This request doesn’t come from an app Cord Account recognizes, or its return address isn’t allowed. Go back to the app and try again.',
    'consent.verify': 'Confirm your email to continue', 'consent.verifyDesc': '{app} needs a verified address. Type the 6-digit code sent to {email}.',
    'consent.verifySubmit': 'Continue to {app}', 'consent.firstParty': '{app} is part of the Cord suite: no permission needed.',
    'consent.verifyCheck': 'I confirmed my address', 'consent.home': 'Go to my account',
  },
});

const consentParams = () => Object.fromEntries(new URLSearchParams(location.search));

async function showConsent() {
  const params = consentParams();
  const app = $('#app');
  app.removeAttribute('aria-busy');
  let context;
  try {
    context = await api(\`/api/authorize/context?client_id=\${encodeURIComponent(params.client_id ?? '')}&redirect_uri=\${encodeURIComponent(params.redirect_uri ?? '')}\`);
  } catch {
    context = null;
  }
  const frame = (inner) => render(app, html\`<main class="consent-page" id="main"><section class="consent glass" aria-live="polite">\${inner}</section></main>\`);
  if (!context || !context.redirectValid) {
    document.title = t('consent.invalid');
    frame(html\`<div class="auth-illu"><div class="icon-badge tone-danger">\${icon('circle-x')}</div></div>
      <h1>\${t('consent.invalid')}</h1><p class="sub">\${t('consent.invalidDesc')}</p>
      <a class="btn btn-glass btn-block" href="/">\${t('consent.home')}</a>\`);
    return;
  }
  const client = context.client;
  document.title = \`\${client.name} · Compte Cord\`;
  const visual = html\`<div class="link-visual" aria-hidden="true">
    <span class="logo"><img src="/assets/icon-180.png" alt=""></span>
    <span class="wire"><span class="lock">\${icon('lock')}</span></span>
    <span class="logo">\${appLogo(client)}</span></div>\`;

  if (!context.user) {
    frame(html\`\${visual}<div id="consent-auth" class="auth-card"></div>\`);
    const signup = params.prompt === 'create' || params.screen_hint === 'signup';
    mountAuth($('#consent-auth'), { mode: signup ? 'register' : 'login', email: params.login_hint ?? '', context: { appName: client.name }, onSuccess: () => showConsent() });
    return;
  }
  const user = context.user;
  if (!user.emailVerified) {
    frame(html\`\${visual}<div><h1>\${t('consent.verify')}</h1><p class="sub">\${t('consent.verifyDesc', { app: client.name, email: user.email })}</p></div>
      <form id="consent-code" class="stack-sm" novalidate>
        <input class="input input-otp" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="7" placeholder="••••••" aria-label="\${t('verify.code')}" required autofocus>
        <button class="btn btn-primary btn-lg btn-block" type="submit">\${t('consent.verifySubmit', { app: client.name })}\${icon('arrow-right')}</button>
      </form>
      <div class="row-wrap"><button class="link-btn" data-action="send-verification">\${t('verify.resend')}</button><span class="spacer"></span><button class="link-btn muted" data-action="consent-reload">\${t('consent.verifyCheck')}</button></div>\`);
    const codeForm = $('#consent-code');
    codeForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const input = $('[name="code"]', codeForm);
      try {
        await busy(event.submitter ?? $('[type="submit"]', codeForm), () => api('/api/email/verify-code', { code: input.value }));
        showConsent();
      } catch (e) {
        input.setAttribute('aria-invalid', 'true');
        input.select();
        toastError(e);
      }
    });
    setTimeout(() => $('[name="code"]', codeForm)?.focus(), 60);
    return;
  }

  const allow = async (button) => {
    const result = await (button ? busy(button, () => api('/api/authorize', params)) : api('/api/authorize', params));
    if (result?.redirect) location.assign(result.redirect);
  };
  if ((context.consented || client.firstParty) && params.prompt !== 'consent') {
    frame(html\`\${visual}<div class="consent-loading"><span class="pulse-dot"></span><p class="muted">\${t('consent.continuing', { app: client.name })}</p></div>\`);
    try { await allow(); } catch (e) { toastError(e); }
    return;
  }
  const scopes = String(params.scope ?? 'openid').split(' ').filter((s) => ['openid', 'profile', 'email'].includes(s));
  const host = (() => { try { return new URL(params.redirect_uri).host; } catch { return ''; } })();
  frame(html\`\${visual}
    <div><h1>\${raw(t('consent.title', { app: escapeValue(client.name) }))}</h1><p class="sub">\${t('consent.sub')}</p></div>
    <div class="account-chip">\${avatar(user, 'sm')}<div class="who"><strong>\${user.name}</strong><span>\${user.email}</span></div>
      <button class="btn btn-ghost btn-sm" data-action="consent-switch">\${t('consent.switch')}</button></div>
    <div><p class="eyebrow">\${t('consent.will', { app: client.name })}</p>
      <ul class="grants">\${scopes.map((s) => html\`<li><span class="icon-badge">\${icon(SCOPE_ICONS[s])}</span><div>\${t(\`scope.\${s}\`)}<small>\${t(\`scope.\${s}.desc\`)}</small></div></li>\`)}</ul></div>
    <p class="assure">\${icon('shield-check')}<span>\${t('consent.assure', { app: client.name })}</span></p>
    <div class="actions">
      <button class="btn btn-ghost btn-lg" data-action="consent-deny">\${t('consent.deny')}</button>
      <button class="btn btn-primary btn-lg" data-action="consent-allow">\${t('consent.allow')}\${icon('arrow-right')}</button>
    </div>
    <p class="foot">\${raw(t('consent.redirect', { host: \`<code>\${escapeValue(host)}</code>\` }))}</p>\`);
  ACTIONS['consent-allow'] = (button) => allow(button);
}

Object.assign(ACTIONS, {
  async 'consent-deny'(button) {
    const params = consentParams();
    const result = await busy(button, () => api('/api/authorize/deny', params));
    if (result?.redirect) location.assign(result.redirect);
  },
  async 'consent-switch'() {
    await api('/api/logout', {}).catch(() => {});
    showConsent();
  },
  'consent-reload'() {
    showConsent();
  },
});

// src/42-inbox.js
/* Notifications : ce que les apps de la suite envoient au compte (cloche du haut). */

messages({
  fr: {
    'inbox.title': 'Notifications', 'inbox.desc': 'Envoyées par les apps reliées à ton compte Cord.',
    'inbox.readAll': 'Tout marquer comme lu', 'inbox.empty': 'Aucune notification', 'inbox.emptyDesc': 'Quand une app de la suite a du nouveau pour toi, ça s’affiche ici.',
    'inbox.more': 'Plus anciennes', 'inbox.delete': 'Supprimer', 'inbox.open': 'Ouvrir',
  },
  en: {
    'inbox.title': 'Notifications', 'inbox.desc': 'Sent by the apps linked to your Cord account.',
    'inbox.readAll': 'Mark all as read', 'inbox.empty': 'No notifications', 'inbox.emptyDesc': 'When a suite app has news for you, it shows up here.',
    'inbox.more': 'Older', 'inbox.delete': 'Delete', 'inbox.open': 'Open',
  },
});

const inboxState = { items: null, unread: 0, more: false, loading: false };

async function loadInbox(before) {
  inboxState.loading = true;
  try {
    const page = await api(\`/api/notifications\${before ? \`?before=\${before}\` : ''}\`);
    inboxState.items = before ? [...(inboxState.items ?? []), ...page.items] : page.items;
    inboxState.unread = page.unread;
    inboxState.more = page.more;
    if (state.hub) state.hub.unread = page.unread;
  } catch (e) {
    toastError(e);
  } finally {
    inboxState.loading = false;
  }
}

function inboxList() {
  const items = inboxState.items;
  if (!items) return html\`<div class="stack-sm">\${[1, 2, 3].map(() => html\`<div class="skeleton sk-line"></div>\`)}</div>\`;
  if (!items.length) return emptyState({ iconName: 'inbox', title: t('inbox.empty'), desc: t('inbox.emptyDesc') });
  return html\`<ol class="inbox-list">\${items.map((n) => html\`<li class="\${n.readAt ? '' : 'unread'}" data-id="\${n.id}">
      <img class="feed-logo" src="\${n.logo ?? '/assets/icon-180.png'}" alt="" width="36" height="36">
      <div class="grow"><p class="what"><strong>\${n.name}</strong><time>\${fmtRelative(n.createdAt)}</time></p><p class="title">\${n.title}</p>\${n.body ? html\`<p class="more">\${n.body}</p>\` : ''}</div>
      <div class="inbox-actions">
        \${n.url ? html\`<a class="btn btn-glass btn-icon btn-sm" href="\${n.url}" target="_blank" rel="noopener" data-open="\${n.id}" aria-label="\${t('inbox.open')}">\${icon('arrow-up-right')}</a>\` : ''}
        <button type="button" class="btn btn-ghost btn-icon btn-sm" data-remove="\${n.id}" aria-label="\${t('inbox.delete')}">\${icon('trash-2')}</button>
      </div>
    </li>\`)}</ol>
    \${inboxState.more ? html\`<button type="button" class="btn btn-ghost btn-sm btn-block" data-older>\${t('inbox.more')}</button>\` : ''}\`;
}

Object.assign(ACTIONS, {
  async inbox() {
    const body = () => html\`<div data-inbox>\${inboxList()}</div>\`;
    modal({
      title: t('inbox.title'),
      desc: t('inbox.desc'),
      iconName: 'bell',
      body,
      actions: html\`<button type="button" class="btn btn-ghost" data-read-all>\${icon('check-check')}\${t('inbox.readAll')}</button>\`,
      onOpen(ctx) {
        ctx.dialog.classList.add('inbox-sheet');
        const redraw = () => ctx.setBody(body);
        const markRead = async (ids) => {
          await api('/api/notifications/read', ids ? { ids } : { all: true }).catch(toastError);
          for (const n of inboxState.items ?? []) if (!ids || ids.includes(n.id)) n.readAt = n.readAt ?? Date.now();
          inboxState.unread = (inboxState.items ?? []).filter((n) => !n.readAt).length;
          if (state.hub) state.hub.unread = inboxState.unread;
        };
        ctx.dialog.addEventListener('click', async (event) => {
          const open = event.target.closest('[data-open]');
          if (open) return void markRead([open.dataset.open]).then(redraw);
          const remove = event.target.closest('[data-remove]');
          if (remove) {
            await api('/api/notifications', { id: remove.dataset.remove }, 'DELETE').catch(toastError);
            inboxState.items = inboxState.items.filter((n) => n.id !== remove.dataset.remove);
            return redraw();
          }
          if (event.target.closest('[data-older]')) {
            await loadInbox(inboxState.items.at(-1)?.createdAt);
            return redraw();
          }
          if (event.target.closest('[data-read-all]')) {
            event.preventDefault();
            await markRead();
            redraw();
          }
        });
        (inboxState.items ? Promise.resolve() : loadInbox()).then(redraw);
      },
    }).then(() => renderShell());
  },
});

// src/43-palette.js
/* Palette de commandes (Ctrl/⌘ K ou « / ») : aller partout, ouvrir une app, agir. */

messages({
  fr: {
    'palette.placeholder': 'Rechercher une page, une app, une action…', 'palette.empty': 'Rien ne correspond à « {q} ».',
    'palette.go': 'Aller à', 'palette.apps': 'Apps', 'palette.actions': 'Actions', 'palette.pages': 'Pages',
    'palette.hint': '↑↓ pour choisir · Entrée pour valider · Échap pour fermer',
    'cmd.passkey': 'Ajouter une passkey', 'cmd.totp': 'Activer la double authentification', 'cmd.password': 'Changer de mot de passe',
    'cmd.export': 'Exporter mes données', 'cmd.pair': 'Associer Passcord', 'cmd.inbox': 'Ouvrir les notifications',
    'cmd.theme': 'Basculer thème clair / sombre', 'cmd.lang': 'Switch to English', 'cmd.logout': 'Se déconnecter',
    'cmd.open': 'Ouvrir {app}', 'cmd.verify': 'Confirmer mon adresse email',
  },
  en: {
    'palette.placeholder': 'Search a page, an app, an action…', 'palette.empty': 'Nothing matches “{q}”.',
    'palette.go': 'Go to', 'palette.apps': 'Apps', 'palette.actions': 'Actions', 'palette.pages': 'Pages',
    'palette.hint': '↑↓ to pick · Enter to run · Esc to close',
    'cmd.passkey': 'Add a passkey', 'cmd.totp': 'Turn on two-factor authentication', 'cmd.password': 'Change password',
    'cmd.export': 'Export my data', 'cmd.pair': 'Pair Passcord', 'cmd.inbox': 'Open notifications',
    'cmd.theme': 'Toggle light / dark theme', 'cmd.lang': 'Passer en français', 'cmd.logout': 'Sign out',
    'cmd.open': 'Open {app}', 'cmd.verify': 'Confirm my email address',
  },
});

const fold = (text) => String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function paletteCommands() {
  const a = state.account;
  const user = a.user;
  const go = (hash) => () => { location.hash = hash; };
  const run = (name) => () => ACTIONS[name]?.(null);
  const commands = [];
  for (const r of ROUTES.filter((x) => !x.admin || user.admin)) {
    commands.push({ group: 'pages', icon: r.icon, label: t(r.label), hint: t('palette.go'), keys: r.id, run: go(r.id) });
  }
  if (!user.emailVerified) commands.push({ group: 'actions', icon: 'mail-check', label: t('cmd.verify'), run: go('apercu') });
  commands.push(
    { group: 'actions', icon: 'fingerprint-pattern', label: t('cmd.passkey'), keys: 'passkey face id', run: () => { location.hash = 'securite'; setTimeout(() => ACTIONS['passkey-add']?.($('[data-action="passkey-add"]')), 120); } },
    ...(a.security.mfa ? [] : [{ group: 'actions', icon: 'shield-check', label: t('cmd.totp'), keys: '2fa totp mfa', run: () => { location.hash = 'securite'; setTimeout(() => ACTIONS['totp-setup']?.($('[data-action="totp-setup"]')), 120); } }]),
    { group: 'actions', icon: 'smartphone', label: t('cmd.pair'), keys: 'passcord iphone qr', run: go('appareils') },
    { group: 'actions', icon: 'key-round', label: t('cmd.password'), keys: 'mot de passe password', run: go('securite') },
    { group: 'actions', icon: 'bell', label: t('cmd.inbox'), keys: 'inbox notifications', run: run('inbox') },
    { group: 'actions', icon: 'download', label: t('cmd.export'), keys: 'rgpd gdpr export json', run: go('confidentialite') },
    { group: 'actions', icon: effectiveTheme() === 'dark' ? 'sun' : 'moon', label: t('cmd.theme'), keys: 'dark light', run: run('toggle-theme') },
    { group: 'actions', icon: 'languages', label: t('cmd.lang'), keys: 'langue language', run: run('toggle-locale') },
    { group: 'actions', icon: 'log-out', label: t('cmd.logout'), keys: 'logout', run: run('logout') },
  );
  for (const app of state.hub?.apps ?? []) {
    if (!app.launch || app.status === 'soon') continue;
    commands.push({ group: 'apps', img: app.logo, label: t('cmd.open', { app: app.name }), hint: app.tagline, keys: app.slug, run: () => window.open(app.launch, '_blank', 'noopener') });
  }
  return commands;
}

function openPalette() {
  if (!state.account || $('dialog.palette')) return;
  const commands = paletteCommands();
  let query = '';
  let index = 0;
  let shown = commands;
  const dialog = document.createElement('dialog');
  dialog.className = 'palette';
  dialog.setAttribute('aria-label', t('nav.search'));
  const list = () => {
    const tokens = fold(query).split(/\\s+/).filter(Boolean);
    shown = tokens.length ? commands.filter((c) => tokens.every((tok) => fold(\`\${c.label} \${c.keys ?? ''} \${c.hint ?? ''}\`).includes(tok))) : commands;
    index = Math.min(index, Math.max(0, shown.length - 1));
    if (!shown.length) return html\`<p class="palette-empty">\${t('palette.empty', { q: query })}</p>\`;
    let group = '';
    return html\`\${shown.map((c, i) => {
      const head = c.group !== group ? html\`<p class="palette-group">\${t(\`palette.\${c.group}\`)}</p>\` : '';
      group = c.group;
      return html\`\${head}<button type="button" class="palette-item" role="option" data-index="\${i}" \${i === index ? raw('aria-selected="true"') : ''}>
        \${c.img ? html\`<img src="\${c.img}" alt="" width="22" height="22">\` : html\`<span class="palette-ic">\${icon(c.icon)}</span>\`}
        <span class="label">\${c.label}</span>\${c.hint ? html\`<span class="hint">\${c.hint}</span>\` : ''}\${i === index ? html\`<span class="enter">\${icon('corner-down-left')}</span>\` : ''}</button>\`;
    })}\`;
  };
  render(dialog, html\`<div class="palette-inner">
    <label class="palette-search">\${icon('search')}<input type="text" placeholder="\${t('palette.placeholder')}" autocomplete="off" spellcheck="false" aria-label="\${t('nav.search')}"><kbd>Esc</kbd></label>
    <div class="palette-list" role="listbox">\${list()}</div>
    <p class="palette-foot">\${icon('command')}\${t('palette.hint')}</p>
  </div>\`);
  const input = $('input', dialog);
  const listBox = $('.palette-list', dialog);
  const redraw = () => {
    render(listBox, list());
    $('[aria-selected="true"]', listBox)?.scrollIntoView({ block: 'nearest' });
  };
  const close = () => { dialog.classList.add('closing'); setTimeout(() => dialog.close(), 140); };
  const exec = (i) => {
    const c = shown[i];
    if (!c) return;
    close();
    setTimeout(() => Promise.resolve(c.run()).catch(toastError), 60);
  };
  input.addEventListener('input', () => { query = input.value; index = 0; redraw(); });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); index = (index + 1) % Math.max(1, shown.length); redraw(); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); index = (index - 1 + shown.length) % Math.max(1, shown.length); redraw(); }
    else if (event.key === 'Enter') { event.preventDefault(); exec(index); }
  });
  listBox.addEventListener('click', (event) => {
    const item = event.target.closest('[data-index]');
    if (item) exec(Number(item.dataset.index));
  });
  listBox.addEventListener('pointermove', (event) => {
    const item = event.target.closest('[data-index]');
    if (item && Number(item.dataset.index) !== index) { index = Number(item.dataset.index); redraw(); }
  });
  dialog.addEventListener('click', (event) => { if (event.target === dialog) close(); });
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); close(); });
  dialog.addEventListener('close', () => dialog.remove());
  document.body.append(dialog);
  dialog.showModal();
  input.focus();
}

ACTIONS.palette = () => openPalette();
document.addEventListener('keydown', (event) => {
  if (!state.account || location.pathname.startsWith('/authorize')) return;
  const typing = event.target.closest?.('input, textarea, select, [contenteditable="true"]');
  if ((event.key === 'k' || event.key === 'K') && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    openPalette();
  } else if (event.key === '/' && !typing && !$('dialog[open]')) {
    event.preventDefault();
    openPalette();
  }
});

// src/99-boot.js
/* Démarrage : thème, langue, liens reçus par email, puis vitrine ou compte. */

messages({
  fr: {
    'boot.verified': 'Adresse email confirmée. Tu peux utiliser ton compte Cord dans toutes les apps.',
    'boot.verifyFailed': 'Ce lien de confirmation a expiré ou a déjà servi.',
    'boot.emailChanged': 'Ta nouvelle adresse est confirmée : {email}.',
    'boot.emailChangeFailed': 'Ce lien de changement d’adresse a expiré ou a déjà servi.',
    'boot.passwordReset': 'Mot de passe changé. Toutes tes autres sessions ont été fermées.',
  },
  en: {
    'boot.verified': 'Email address confirmed. You can use your Cord account in every app.',
    'boot.verifyFailed': 'This confirmation link has expired or was already used.',
    'boot.emailChanged': 'Your new address is confirmed: {email}.',
    'boot.emailChangeFailed': 'This email change link has expired or was already used.',
    'boot.passwordReset': 'Password changed. All your other sessions were signed out.',
  },
});

async function boot() {
  setLocale(initialLocale());
  applyTheme(savedTheme());
  const suiteReady = api('/api/suite').then((s) => { state.suite = s.apps; state.features = s.features; }).catch(() => {});

  if (location.pathname === '/authorize') {
    await suiteReady;
    return showConsent();
  }

  const params = new URLSearchParams(location.search);
  const verify = params.get('verify');
  const reset = params.get('reset');
  const emailChange = params.get('email-change');
  if (verify || reset || emailChange) history.replaceState(null, '', \`/\${location.hash}\`);

  const notices = [];
  if (verify) {
    try {
      await api('/api/email/verify', { token: verify });
      notices.push(() => { celebrate(); toast(t('boot.verified'), { duration: 7000 }); });
    } catch {
      notices.push(() => toast(t('boot.verifyFailed'), { type: 'error' }));
    }
  }
  if (emailChange) {
    try {
      const result = await api('/api/email/change/confirm', { token: emailChange });
      notices.push(() => toast(t('boot.emailChanged', { email: result.email }), { duration: 7000 }));
    } catch (e) {
      notices.push(() => toast(e.status === 409 ? e.message : t('boot.emailChangeFailed'), { type: 'error' }));
    }
  }

  await suiteReady;
  if (reset) {
    showLanding({ mode: 'reset', resetToken: reset });
    // Le succès de la réinitialisation passe par afterLogin() : message dédié.
    return;
  }
  try {
    await loadAccount();
    renderShell();
  } catch (e) {
    if (e.status !== 401 && e.status !== undefined) toastError(e);
    showLanding();
  }
  notices.forEach((fn) => fn());
}

boot();
`;

export const PORTAL_CSS = `/* 00-foundations.css */
/* Polices servies par le service (CSP font-src 'self'). SIL OFL 1.1. */
@font-face { font-family: "Inter"; font-style: normal; font-weight: 100 900; font-display: swap; src: url("/assets/fonts/inter.woff2") format("woff2"); }
@font-face { font-family: "Space Grotesk"; font-style: normal; font-weight: 300 700; font-display: swap; src: url("/assets/fonts/space-grotesk.woff2") format("woff2"); }
@font-face { font-family: "JetBrains Mono"; font-style: normal; font-weight: 100 800; font-display: swap; src: url("/assets/fonts/jetbrains-mono.woff2") format("woff2"); }

/* ── Jetons de design ──────────────────────────────────────────────────── */
:root {
  color-scheme: dark;
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-display: "Space Grotesk", "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Consolas, monospace;

  --bg: #07060d;
  --bg-elev: #0e0c18;
  --fg: #f5f2ff;
  --fg-muted: #b6b0cc;
  --fg-subtle: #7f7998;
  --fg-faint: #57526c;

  --glass: linear-gradient(160deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.022) 60%);
  --glass-solid: rgba(18, 15, 31, 0.72);
  --glass-strong: rgba(24, 20, 41, 0.86);
  --control: rgba(255, 255, 255, 0.055);
  --control-hover: rgba(255, 255, 255, 0.09);
  --control-active: rgba(255, 255, 255, 0.12);
  --line: rgba(255, 255, 255, 0.085);
  --line-strong: rgba(255, 255, 255, 0.15);
  --highlight: rgba(255, 255, 255, 0.14);

  --indigo: #6e58f0;
  --violet: #8b5cff;
  --fuchsia: #d24bef;
  --orchid: #b842ec;
  --accent: #9a7bff;
  --accent-strong: #8b5cff;
  --accent-fg: #ffffff;
  --accent-soft: rgba(139, 92, 255, 0.16);
  --accent-glow: rgba(139, 92, 255, 0.45);
  --grad: linear-gradient(120deg, #6e58f0 0%, #8b5cff 32%, #b842ec 68%, #d24bef 100%);
  --grad-text: linear-gradient(100deg, #c9b8ff 0%, #a98bff 30%, #e08cff 70%, #ffb3f0 100%);

  --ok: #3ddc97;
  --ok-soft: rgba(61, 220, 151, 0.14);
  --warn: #ffbe5c;
  --warn-soft: rgba(255, 190, 92, 0.14);
  --danger: #ff6b86;
  --danger-soft: rgba(255, 107, 134, 0.14);
  --info: #6cc7ff;
  --info-soft: rgba(108, 199, 255, 0.14);

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.35);
  --shadow: 0 24px 60px -24px rgba(0, 0, 0, 0.7), 0 8px 24px -12px rgba(0, 0, 0, 0.45);
  --shadow-lg: 0 40px 120px -30px rgba(0, 0, 0, 0.85), 0 16px 40px -16px rgba(0, 0, 0, 0.5);
  --ring: 0 0 0 3px rgba(154, 123, 255, 0.45);

  --r-xs: 8px;
  --r-sm: 12px;
  --r: 16px;
  --r-lg: 22px;
  --r-xl: 28px;
  --blur: blur(26px) saturate(165%);
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --t-fast: 140ms;
  --t: 260ms;
  --t-slow: 520ms;

  --orb-a: #5b3df5;
  --orb-b: #c03ae8;
  --orb-c: #2a6bff;
  --orb-d: #ff4fb8;
  --orb-opacity: 0.55;
  --grain-opacity: 0.08;
}

:root[data-theme="light"] {
  color-scheme: light;
  --bg: #f4f2fb;
  --bg-elev: #ffffff;
  --fg: #16122b;
  --fg-muted: #57516f;
  --fg-subtle: #837e9b;
  --fg-faint: #aaa6bc;
  --glass: linear-gradient(160deg, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.55) 60%);
  --glass-solid: rgba(255, 255, 255, 0.78);
  --glass-strong: rgba(255, 255, 255, 0.92);
  --control: rgba(40, 24, 110, 0.045);
  --control-hover: rgba(40, 24, 110, 0.08);
  --control-active: rgba(40, 24, 110, 0.11);
  --line: rgba(35, 20, 90, 0.09);
  --line-strong: rgba(35, 20, 90, 0.16);
  --highlight: rgba(255, 255, 255, 0.9);
  --accent: #6c47ff;
  --accent-strong: #6c47ff;
  --accent-soft: rgba(108, 71, 255, 0.1);
  --accent-glow: rgba(108, 71, 255, 0.35);
  --grad-text: linear-gradient(100deg, #5b3df5 0%, #7b4dff 35%, #b03ae0 70%, #d9408f 100%);
  --ok: #0f9d63;
  --ok-soft: rgba(15, 157, 99, 0.1);
  --warn: #b86e00;
  --warn-soft: rgba(230, 150, 20, 0.12);
  --danger: #d8284f;
  --danger-soft: rgba(216, 40, 79, 0.09);
  --info: #0c7cc2;
  --info-soft: rgba(12, 124, 194, 0.1);
  --shadow-sm: 0 1px 2px rgba(30, 20, 80, 0.08);
  --shadow: 0 24px 60px -28px rgba(40, 25, 110, 0.28), 0 8px 20px -12px rgba(40, 25, 110, 0.14);
  --shadow-lg: 0 40px 100px -30px rgba(40, 25, 110, 0.35), 0 16px 40px -16px rgba(40, 25, 110, 0.16);
  --ring: 0 0 0 3px rgba(108, 71, 255, 0.3);
  --orb-a: #8f7bff;
  --orb-b: #f09bff;
  --orb-c: #7ec8ff;
  --orb-d: #ffb1d9;
  --orb-opacity: 0.5;
  --grain-opacity: 0.05;
}
@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) {
    color-scheme: light;
    --bg: #f4f2fb;
    --bg-elev: #ffffff;
    --fg: #16122b;
    --fg-muted: #57516f;
    --fg-subtle: #837e9b;
    --fg-faint: #aaa6bc;
    --glass: linear-gradient(160deg, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.55) 60%);
    --glass-solid: rgba(255, 255, 255, 0.78);
    --glass-strong: rgba(255, 255, 255, 0.92);
    --control: rgba(40, 24, 110, 0.045);
    --control-hover: rgba(40, 24, 110, 0.08);
    --control-active: rgba(40, 24, 110, 0.11);
    --line: rgba(35, 20, 90, 0.09);
    --line-strong: rgba(35, 20, 90, 0.16);
    --highlight: rgba(255, 255, 255, 0.9);
    --accent: #6c47ff;
    --accent-strong: #6c47ff;
    --accent-soft: rgba(108, 71, 255, 0.1);
    --accent-glow: rgba(108, 71, 255, 0.35);
    --grad-text: linear-gradient(100deg, #5b3df5 0%, #7b4dff 35%, #b03ae0 70%, #d9408f 100%);
    --ok: #0f9d63;
    --ok-soft: rgba(15, 157, 99, 0.1);
    --warn: #b86e00;
    --warn-soft: rgba(230, 150, 20, 0.12);
    --danger: #d8284f;
    --danger-soft: rgba(216, 40, 79, 0.09);
    --info: #0c7cc2;
    --info-soft: rgba(12, 124, 194, 0.1);
    --shadow-sm: 0 1px 2px rgba(30, 20, 80, 0.08);
    --shadow: 0 24px 60px -28px rgba(40, 25, 110, 0.28), 0 8px 20px -12px rgba(40, 25, 110, 0.14);
    --shadow-lg: 0 40px 100px -30px rgba(40, 25, 110, 0.35), 0 16px 40px -16px rgba(40, 25, 110, 0.16);
    --ring: 0 0 0 3px rgba(108, 71, 255, 0.3);
    --orb-a: #8f7bff;
    --orb-b: #f09bff;
    --orb-c: #7ec8ff;
    --orb-d: #ffb1d9;
    --orb-opacity: 0.5;
    --grain-opacity: 0.05;
  }
}

/* ── Base ─────────────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; scroll-behavior: smooth; }
body {
  margin: 0;
  min-height: 100dvh;
  background: var(--bg);
  color: var(--fg);
  font: 400 15px/1.55 var(--font-sans);
  font-feature-settings: "cv11", "ss01", "ss03";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  transition: background-color var(--t-slow) var(--ease), color var(--t) var(--ease);
}
h1, h2, h3, h4 { font-family: var(--font-display); font-weight: 600; letter-spacing: -0.025em; line-height: 1.15; margin: 0; text-wrap: balance; }
p { margin: 0; text-wrap: pretty; }
a { color: var(--accent); text-decoration: none; text-underline-offset: 3px; }
a:hover { text-decoration: underline; }
img, svg { display: block; }
button, input, select, textarea { font: inherit; color: inherit; }
button { cursor: pointer; }
code, kbd, .mono { font-family: var(--font-mono); font-size: 0.86em; }
::selection { background: rgba(154, 123, 255, 0.35); }
[hidden] { display: none !important; }
:focus-visible { outline: none; box-shadow: var(--ring); border-radius: var(--r-xs); }
.sprite { position: absolute; width: 0; height: 0; overflow: hidden; }
.i { width: 1.15em; height: 1.15em; flex: none; fill: none; stroke: currentColor; stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.skip-link { position: fixed; top: 12px; left: 12px; z-index: 100; padding: 10px 16px; border-radius: 999px; background: var(--glass-strong); color: var(--fg); transform: translateY(-160%); transition: transform var(--t) var(--ease); }
.skip-link:focus { transform: none; }
.noscript { position: fixed; inset: auto 16px 16px; padding: 16px; border-radius: var(--r); background: var(--glass-strong); text-align: center; }

.eyebrow {
  font: 600 11px/1.2 var(--font-mono);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--fg-subtle);
}
.grad-text {
  background: var(--grad-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.muted { color: var(--fg-muted); }
.subtle { color: var(--fg-subtle); }
.small { font-size: 13px; }
.tiny { font-size: 12px; }
.nowrap { white-space: nowrap; }
.break { overflow-wrap: anywhere; }
.row { display: flex; align-items: center; gap: 10px; }
.row-wrap { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.stack { display: grid; gap: 16px; }
.stack-sm { display: grid; gap: 10px; }
.stack-lg { display: grid; gap: 28px; }
.spacer { flex: 1; }

/* 10-backdrop.css */
/* ── Fond vivant : halos qui dérivent, grille fantôme, grain ───────────── */
.backdrop { position: fixed; inset: 0; z-index: -1; overflow: hidden; pointer-events: none; background: var(--bg); transition: background-color var(--t-slow) var(--ease); }
.orb {
  position: absolute;
  width: 62vmax;
  height: 62vmax;
  border-radius: 50%;
  filter: blur(90px);
  opacity: var(--orb-opacity);
  mix-blend-mode: normal;
  will-change: transform;
  transition: opacity var(--t-slow) var(--ease);
}
.orb-a { top: -28vmax; left: -18vmax; background: radial-gradient(circle at 50% 50%, var(--orb-a), transparent 62%); animation: drift-a 38s var(--ease) infinite alternate; }
.orb-b { top: -10vmax; right: -30vmax; background: radial-gradient(circle at 50% 50%, var(--orb-b), transparent 60%); opacity: calc(var(--orb-opacity) * 0.8); animation: drift-b 46s var(--ease) infinite alternate; }
.orb-c { bottom: -40vmax; left: 8vmax; background: radial-gradient(circle at 50% 50%, var(--orb-c), transparent 60%); opacity: calc(var(--orb-opacity) * 0.55); animation: drift-c 52s var(--ease) infinite alternate; }
.orb-d { bottom: -34vmax; right: -12vmax; width: 44vmax; height: 44vmax; background: radial-gradient(circle at 50% 50%, var(--orb-d), transparent 62%); opacity: calc(var(--orb-opacity) * 0.45); animation: drift-d 41s var(--ease) infinite alternate; }
.backdrop-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, var(--line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--line) 1px, transparent 1px);
  background-size: 64px 64px;
  opacity: 0.35;
  -webkit-mask-image: radial-gradient(ellipse 70% 55% at 50% 0%, #000 0%, transparent 75%);
  mask-image: radial-gradient(ellipse 70% 55% at 50% 0%, #000 0%, transparent 75%);
}
.grain {
  position: absolute;
  inset: -50%;
  opacity: var(--grain-opacity);
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  animation: grain 1.2s steps(6) infinite;
}
@keyframes drift-a { 0% { transform: translate3d(0, 0, 0) scale(1); } 50% { transform: translate3d(12vw, 8vh, 0) scale(1.12); } 100% { transform: translate3d(4vw, 18vh, 0) scale(0.95); } }
@keyframes drift-b { 0% { transform: translate3d(0, 0, 0) scale(1); } 50% { transform: translate3d(-14vw, 12vh, 0) scale(0.92); } 100% { transform: translate3d(-6vw, -4vh, 0) scale(1.1); } }
@keyframes drift-c { 0% { transform: translate3d(0, 0, 0) scale(1.05); } 100% { transform: translate3d(18vw, -14vh, 0) scale(0.9); } }
@keyframes drift-d { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-12vw, -10vh, 0) scale(1.15); } }
@keyframes grain { 0% { transform: translate(0, 0); } 20% { transform: translate(-3%, 2%); } 40% { transform: translate(2%, -3%); } 60% { transform: translate(-2%, 4%); } 80% { transform: translate(3%, 1%); } 100% { transform: translate(0, -2%); } }

/* Écran de démarrage */
.app { min-height: 100dvh; position: relative; }
.boot { position: fixed; inset: 0; display: grid; place-items: center; align-content: center; gap: 22px; }
.boot-mark { width: 64px; height: 64px; border-radius: 18px; box-shadow: 0 20px 60px -10px var(--accent-glow); animation: boot-pulse 1.6s var(--ease) infinite; }
.boot-bar { width: 120px; height: 3px; border-radius: 3px; background: var(--control); overflow: hidden; }
.boot-bar span { display: block; width: 40%; height: 100%; border-radius: inherit; background: var(--grad); animation: boot-bar 1.1s var(--ease) infinite; }
@keyframes boot-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
@keyframes boot-bar { 0% { transform: translateX(-110%); } 100% { transform: translateX(260%); } }

/* 20-components.css */
/* ── Verre ────────────────────────────────────────────────────────────── */
.glass {
  position: relative;
  background: var(--glass), var(--glass-solid);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  -webkit-backdrop-filter: var(--blur);
  backdrop-filter: var(--blur);
  box-shadow: inset 0 1px 0 var(--highlight), var(--shadow);
  isolation: isolate;
}
/* reflet spéculaire + lumière qui suit le pointeur (--mx/--my posés en JS) */
.glass::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: -1;
  background:
    radial-gradient(420px circle at var(--mx, 20%) var(--my, -10%), rgba(255, 255, 255, 0.07), transparent 45%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 30%);
  opacity: 0.9;
  transition: opacity var(--t) var(--ease);
}
.glass::after {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  pointer-events: none;
  background: linear-gradient(140deg, rgba(255, 255, 255, 0.22), transparent 30%, transparent 70%, rgba(210, 75, 239, 0.18));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
  opacity: 0.7;
}
:root[data-theme="light"] .glass::before { background: radial-gradient(420px circle at var(--mx, 20%) var(--my, -10%), rgba(255, 255, 255, 0.7), transparent 45%); }
@media (prefers-color-scheme: light) { :root:not([data-theme="dark"]) .glass::before { background: radial-gradient(420px circle at var(--mx, 20%) var(--my, -10%), rgba(255, 255, 255, 0.7), transparent 45%); } }

.card { padding: 24px; }
.card-lg { padding: 32px; }
.card + .card { margin-top: 0; }
.card-head { display: flex; align-items: flex-start; gap: 14px; }
.card-head > .grow { flex: 1; min-width: 0; }
.card-title { font: 600 17px/1.3 var(--font-display); letter-spacing: -0.015em; }
.card-desc { margin-top: 4px; color: var(--fg-muted); font-size: 14px; }
.card-body { margin-top: 20px; }
.card-foot { margin-top: 20px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.section-title { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin: 6px 2px 14px; }
.section-title h2 { font-size: 15px; font-family: var(--font-mono); font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--fg-subtle); }

.icon-badge {
  --tone: var(--accent);
  --tone-soft: var(--accent-soft);
  position: relative;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex: none;
  border-radius: 13px;
  color: var(--tone);
  background: var(--tone-soft);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--tone) 22%, transparent);
}
.icon-badge .i { width: 20px; height: 20px; }
.icon-badge.lg { width: 52px; height: 52px; border-radius: 16px; }
.icon-badge.lg .i { width: 24px; height: 24px; }
.icon-badge.sm { width: 34px; height: 34px; border-radius: 10px; }
.icon-badge.sm .i { width: 17px; height: 17px; }
.icon-badge.grad { color: #fff; background: var(--grad); box-shadow: 0 10px 30px -10px var(--accent-glow), inset 0 1px 0 rgba(255, 255, 255, 0.3); }
.tone-ok { --tone: var(--ok); --tone-soft: var(--ok-soft); }
.tone-warn { --tone: var(--warn); --tone-soft: var(--warn-soft); }
.tone-danger { --tone: var(--danger); --tone-soft: var(--danger-soft); }
.tone-info { --tone: var(--info); --tone-soft: var(--info-soft); }
.tone-muted { --tone: var(--fg-muted); --tone-soft: var(--control); }

/* ── Boutons ──────────────────────────────────────────────────────────── */
.btn {
  --btn-bg: var(--control);
  --btn-fg: var(--fg);
  --btn-border: var(--line);
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid var(--btn-border);
  border-radius: 13px;
  background: var(--btn-bg);
  color: var(--btn-fg);
  font: 600 14px/1 var(--font-sans);
  letter-spacing: -0.005em;
  white-space: nowrap;
  text-decoration: none !important;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform var(--t-fast) var(--ease), background var(--t) var(--ease), border-color var(--t) var(--ease), box-shadow var(--t) var(--ease), opacity var(--t) var(--ease), color var(--t) var(--ease);
}
.btn:hover { --btn-bg: var(--control-hover); }
.btn:active { transform: scale(0.97); }
.btn:disabled, .btn[aria-disabled="true"] { opacity: 0.5; cursor: not-allowed; transform: none; }
.btn .i { width: 17px; height: 17px; }
.btn-primary {
  --btn-fg: #fff;
  --btn-border: transparent;
  background: var(--grad);
  background-size: 160% 100%;
  background-position: 0% 50%;
  box-shadow: 0 12px 32px -12px var(--accent-glow), inset 0 1px 0 rgba(255, 255, 255, 0.28), inset 0 -1px 0 rgba(0, 0, 0, 0.15);
}
.btn-primary:hover { background-position: 100% 50%; box-shadow: 0 16px 42px -12px var(--accent-glow), inset 0 1px 0 rgba(255, 255, 255, 0.32); }
.btn-primary::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(105deg, transparent 35%, rgba(255, 255, 255, 0.35) 50%, transparent 65%);
  background-size: 250% 100%;
  background-position: 120% 0;
  opacity: 0;
  transition: opacity var(--t) var(--ease);
  pointer-events: none;
}
.btn-primary:hover::after { opacity: 1; animation: sheen 1.1s var(--ease); }
@keyframes sheen { from { background-position: 120% 0; } to { background-position: -20% 0; } }
.btn-glass { --btn-bg: var(--glass-solid); -webkit-backdrop-filter: var(--blur); backdrop-filter: var(--blur); box-shadow: inset 0 1px 0 var(--highlight); }
.btn-glass:hover { --btn-bg: var(--control-hover); border-color: var(--line-strong); }
.btn-ghost { --btn-bg: transparent; --btn-border: transparent; color: var(--fg-muted); }
.btn-ghost:hover { --btn-bg: var(--control); color: var(--fg); }
.btn-danger { --btn-bg: var(--danger-soft); --btn-fg: var(--danger); --btn-border: color-mix(in srgb, var(--danger) 30%, transparent); }
.btn-danger:hover { --btn-bg: color-mix(in srgb, var(--danger) 22%, transparent); }
.btn-danger-solid { --btn-bg: var(--danger); --btn-fg: #fff; --btn-border: transparent; box-shadow: 0 12px 30px -12px color-mix(in srgb, var(--danger) 70%, transparent); }
.btn-danger-solid:hover { --btn-bg: color-mix(in srgb, var(--danger) 88%, #000); }
.btn-sm { min-height: 36px; padding: 0 13px; border-radius: 11px; font-size: 13px; }
.btn-lg { min-height: 52px; padding: 0 24px; border-radius: 15px; font-size: 15px; }
.btn-block { width: 100%; }
.btn-icon { width: 40px; min-height: 40px; padding: 0; border-radius: 12px; }
.btn-icon.btn-sm { width: 34px; min-height: 34px; }
.btn[aria-busy="true"] { color: transparent !important; pointer-events: none; }
.btn[aria-busy="true"] > * { opacity: 0; }
.btn[aria-busy="true"]::before {
  content: "";
  position: absolute;
  inset: 0;
  margin: auto;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid color-mix(in srgb, var(--btn-fg) 30%, transparent);
  border-top-color: var(--btn-fg);
  animation: spin 0.7s linear infinite;
}
.btn-primary[aria-busy="true"]::before { border-color: rgba(255, 255, 255, 0.35); border-top-color: #fff; }
@keyframes spin { to { transform: rotate(360deg); } }
.link-btn { display: inline-flex; align-items: center; gap: 6px; padding: 0; border: 0; background: none; color: var(--accent); font-weight: 500; font-size: 14px; }
.link-btn:hover { text-decoration: underline; }
.link-btn.muted { color: var(--fg-muted); }

/* ── Champs ───────────────────────────────────────────────────────────── */
.field { display: grid; gap: 7px; }
.field > label, .field-label { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 13px; font-weight: 500; color: var(--fg-muted); }
.field-hint { font-size: 12.5px; color: var(--fg-subtle); }
.field-error { font-size: 13px; color: var(--danger); display: flex; gap: 6px; align-items: flex-start; }
.input {
  width: 100%;
  min-height: 48px;
  padding: 12px 15px;
  border: 1px solid var(--line);
  border-radius: 13px;
  background: var(--control);
  color: var(--fg);
  font-size: 15px;
  outline: none;
  transition: border-color var(--t) var(--ease), background var(--t) var(--ease), box-shadow var(--t) var(--ease);
}
.input::placeholder { color: var(--fg-faint); }
.input:hover { border-color: var(--line-strong); }
.input:focus { border-color: color-mix(in srgb, var(--accent) 65%, transparent); background: var(--control-hover); box-shadow: var(--ring); }
.input[aria-invalid="true"] { border-color: color-mix(in srgb, var(--danger) 60%, transparent); }
.input:read-only { color: var(--fg-muted); }
.input.mono { font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.02em; }
.input-wrap { position: relative; display: flex; align-items: center; }
.input-wrap .input { padding-right: 52px; }
.input-wrap .input-action { position: absolute; right: 5px; }
.input-otp { text-align: center; font: 600 26px/1 var(--font-mono); letter-spacing: 0.42em; padding-left: calc(15px + 0.42em); min-height: 60px; }
select.input option { background-color: var(--bg); color: var(--fg); }
select.input { appearance: none; background-image: linear-gradient(45deg, transparent 50%, var(--fg-subtle) 50%), linear-gradient(135deg, var(--fg-subtle) 50%, transparent 50%); background-position: calc(100% - 20px) 50%, calc(100% - 15px) 50%; background-size: 5px 5px; background-repeat: no-repeat; padding-right: 40px; }

.strength { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-top: 2px; }
.strength span { height: 4px; border-radius: 4px; background: var(--control-active); transition: background var(--t) var(--ease); }
.strength[data-score="1"] span:nth-child(-n + 1) { background: var(--danger); }
.strength[data-score="2"] span:nth-child(-n + 2) { background: var(--warn); }
.strength[data-score="3"] span:nth-child(-n + 3) { background: #8fd16a; }
.strength[data-score="4"] span { background: var(--ok); }
.strength-label { font-size: 12px; color: var(--fg-subtle); display: flex; justify-content: space-between; }

/* interrupteur */
.switch { position: relative; display: inline-flex; flex: none; width: 48px; height: 28px; }
.switch input { position: absolute; inset: 0; opacity: 0; margin: 0; cursor: pointer; z-index: 1; }
.switch span { position: absolute; inset: 0; border-radius: 99px; background: var(--control-active); box-shadow: inset 0 0 0 1px var(--line); transition: background var(--t) var(--ease); }
.switch span::after { content: ""; position: absolute; top: 3px; left: 3px; width: 22px; height: 22px; border-radius: 50%; background: #fff; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); transition: transform var(--t) var(--ease-spring); }
.switch input:checked + span { background: var(--grad); box-shadow: 0 6px 18px -6px var(--accent-glow); }
.switch input:checked + span::after { transform: translateX(20px); }
.switch input:focus-visible + span { box-shadow: var(--ring); }

/* segments */
.segmented { position: relative; display: inline-grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 2px; padding: 4px; border-radius: 14px; background: var(--control); box-shadow: inset 0 0 0 1px var(--line); }
.segmented label { position: relative; }
.segmented input { position: absolute; opacity: 0; inset: 0; margin: 0; cursor: pointer; }
.segmented label span { display: flex; align-items: center; justify-content: center; gap: 7px; min-height: 36px; padding: 0 14px; border-radius: 10px; color: var(--fg-muted); font-size: 13px; font-weight: 500; transition: background var(--t) var(--ease), color var(--t) var(--ease), box-shadow var(--t) var(--ease); white-space: nowrap; }
.segmented input:checked + span { background: var(--glass-strong); color: var(--fg); box-shadow: 0 4px 14px -6px rgba(0, 0, 0, 0.4), inset 0 1px 0 var(--highlight); }
.segmented input:focus-visible + span { box-shadow: var(--ring); }
.segmented .i { width: 15px; height: 15px; }

/* ── Badges, puces ────────────────────────────────────────────────────── */
.badge {
  --tone: var(--fg-muted);
  --tone-soft: var(--control);
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 24px;
  padding: 0 9px;
  border-radius: 99px;
  font: 600 11px/1 var(--font-mono);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--tone);
  background: var(--tone-soft);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--tone) 20%, transparent);
  white-space: nowrap;
}
.badge .i { width: 12px; height: 12px; stroke-width: 2.4; }
.badge .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 25%, transparent); }
.badge-accent { --tone: var(--accent); --tone-soft: var(--accent-soft); }
.chip { display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 12px; border-radius: 99px; background: var(--control); border: 1px solid var(--line); font-size: 13px; color: var(--fg-muted); }
.chip .i { width: 14px; height: 14px; }
button.chip { cursor: pointer; transition: background var(--t) var(--ease), color var(--t) var(--ease); }
button.chip:hover { background: var(--control-hover); color: var(--fg); }
button.chip[aria-pressed="true"] { background: var(--accent-soft); color: var(--fg); border-color: color-mix(in srgb, var(--accent) 40%, transparent); }

/* ── Listes ───────────────────────────────────────────────────────────── */
.list { display: grid; gap: 2px; margin: 0; padding: 0; list-style: none; }
.list-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  margin: 0 -14px;
  border-radius: var(--r);
  transition: background var(--t) var(--ease);
}
.list-item:hover { background: var(--control); }
.list-item + .list-item { border-top: 1px solid var(--line); }
.list-item:hover + .list-item, .list-item:hover { border-top-color: transparent; }
.list-item .body { flex: 1; min-width: 0; }
.list-item .title { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-weight: 600; font-size: 14.5px; }
.list-item .meta { margin-top: 3px; font-size: 13px; color: var(--fg-subtle); display: flex; flex-wrap: wrap; gap: 4px 10px; }
.list-item .meta > span { display: inline-flex; align-items: center; gap: 5px; }
.list-item .meta .i { width: 13px; height: 13px; }
.list-item .actions { display: flex; gap: 6px; flex: none; }
.divider { height: 1px; background: var(--line); border: 0; margin: 22px 0; }
.divider-text { display: flex; align-items: center; gap: 14px; margin: 20px 0; color: var(--fg-subtle); font: 600 11px/1 var(--font-mono); letter-spacing: 0.16em; text-transform: uppercase; }
.divider-text::before, .divider-text::after { content: ""; flex: 1; height: 1px; background: var(--line); }

/* ── Avatars ──────────────────────────────────────────────────────────── */
.avatar { position: relative; display: block; flex: none; width: 40px; height: 40px; border-radius: 50%; overflow: hidden; background: var(--control); }
.avatar img, .avatar svg { width: 100%; height: 100%; object-fit: cover; }
.avatar-xs { width: 28px; height: 28px; }
.avatar-sm { width: 34px; height: 34px; }
.avatar-lg { width: 64px; height: 64px; }
.avatar-xl { width: 96px; height: 96px; }
.avatar-2xl { width: 128px; height: 128px; }
.avatar-ring { display: block; flex: none; border-radius: 50%; padding: 3px; background: var(--grad); box-shadow: 0 16px 40px -14px var(--accent-glow); }
.avatar-ring > .avatar { width: 100%; height: 100%; box-shadow: 0 0 0 3px var(--bg); }
.avatar-initials { font-family: var(--font-display); font-weight: 600; fill: #fff; }

/* ── Bannières ────────────────────────────────────────────────────────── */
.banner {
  --tone: var(--accent);
  --tone-soft: var(--accent-soft);
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: var(--r);
  background: linear-gradient(120deg, var(--tone-soft), transparent 80%), var(--glass-solid);
  border: 1px solid color-mix(in srgb, var(--tone) 28%, transparent);
  -webkit-backdrop-filter: var(--blur);
  backdrop-filter: var(--blur);
}
.banner > .i { color: var(--tone); width: 22px; height: 22px; }
.banner .body { flex: 1; min-width: 0; }
.banner .title { font-weight: 600; }
.banner .desc { font-size: 13.5px; color: var(--fg-muted); margin-top: 2px; }

/* ── Squelettes ───────────────────────────────────────────────────────── */
.skeleton { position: relative; overflow: hidden; border-radius: var(--r-sm); background: var(--control); }
.skeleton::after { content: ""; position: absolute; inset: 0; transform: translateX(-100%); background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.07), transparent); animation: shimmer 1.4s infinite; }
.sk-line { height: 12px; border-radius: 6px; }
.sk-title { height: 22px; width: 40%; border-radius: 8px; }
.sk-block { height: 120px; }
@keyframes shimmer { to { transform: translateX(100%); } }

/* ── États vides ──────────────────────────────────────────────────────── */
.empty { display: grid; justify-items: center; text-align: center; gap: 10px; padding: 34px 20px; border-radius: var(--r); border: 1px dashed var(--line-strong); }
.empty .icon-badge { margin-bottom: 4px; }
.empty .title { font-weight: 600; font-size: 15px; }
.empty .desc { color: var(--fg-muted); font-size: 14px; max-width: 42ch; }

/* ── Notifications (toasts) ───────────────────────────────────────────── */
.toasts { position: fixed; z-index: 90; right: 20px; bottom: 20px; display: grid; gap: 10px; width: min(400px, calc(100vw - 32px)); pointer-events: none; }
.toast {
  --tone: var(--accent);
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 14px 14px 16px;
  border-radius: 16px;
  background: var(--glass-strong);
  border: 1px solid var(--line-strong);
  -webkit-backdrop-filter: var(--blur);
  backdrop-filter: var(--blur);
  box-shadow: var(--shadow-lg);
  animation: toast-in var(--t-slow) var(--ease-spring) both;
  overflow: hidden;
  position: relative;
}
.toast::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--tone); }
.toast .i.lead { color: var(--tone); margin-top: 1px; width: 20px; height: 20px; }
.toast .body { flex: 1; min-width: 0; font-size: 14px; line-height: 1.45; }
.toast .body a { font-weight: 600; }
.toast .close { margin: -6px -6px -6px 0; }
.toast.leaving { animation: toast-out var(--t) var(--ease) forwards; }
.toast-success { --tone: var(--ok); }
.toast-error { --tone: var(--danger); }
.toast-info { --tone: var(--info); }
.toast .bar { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: var(--tone); opacity: 0.35; transform-origin: left; animation: toast-bar linear forwards; }
@keyframes toast-in { from { opacity: 0; transform: translateY(16px) scale(0.96); } to { opacity: 1; transform: none; } }
@keyframes toast-out { to { opacity: 0; transform: translateX(24px) scale(0.98); } }
@keyframes toast-bar { from { transform: scaleX(1); } to { transform: scaleX(0); } }

/* ── Fenêtres modales ─────────────────────────────────────────────────── */
dialog.modal {
  width: min(520px, calc(100vw - 24px));
  max-height: min(88dvh, 820px);
  margin: auto;
  padding: 0;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-xl);
  background: var(--glass), var(--glass-strong);
  color: var(--fg);
  -webkit-backdrop-filter: blur(30px) saturate(170%);
  backdrop-filter: blur(30px) saturate(170%);
  box-shadow: inset 0 1px 0 var(--highlight), var(--shadow-lg);
  overflow: auto;
  overscroll-behavior: contain;
}
dialog.modal.wide { width: min(640px, calc(100vw - 24px)); }
dialog.modal[open] { animation: modal-in var(--t-slow) var(--ease-spring); }
dialog.modal::backdrop { background: rgba(6, 4, 14, 0.55); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); animation: fade-in var(--t) var(--ease); }
dialog.modal.closing { animation: modal-out 180ms var(--ease) forwards; }
dialog.modal.closing::backdrop { animation: fade-out 180ms var(--ease) forwards; }
.modal-inner { padding: 28px; display: grid; gap: 20px; }
.modal-head { display: flex; align-items: flex-start; gap: 14px; }
.modal-head .grow { flex: 1; min-width: 0; }
.modal-title { font-size: 21px; }
.modal-desc { margin-top: 6px; color: var(--fg-muted); font-size: 14.5px; }
.modal-close { margin: -8px -8px 0 0; }
.modal-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 10px; }
.modal-error { display: flex; gap: 8px; align-items: flex-start; padding: 12px 14px; border-radius: 12px; background: var(--danger-soft); color: var(--danger); font-size: 14px; }
@keyframes modal-in { from { opacity: 0; transform: translateY(18px) scale(0.96); } to { opacity: 1; transform: none; } }
@keyframes modal-out { to { opacity: 0; transform: translateY(10px) scale(0.98); } }
@keyframes fade-in { from { opacity: 0; } }
@keyframes fade-out { to { opacity: 0; } }
@media (max-width: 560px) {
  dialog.modal, dialog.modal.wide { width: 100vw; max-width: 100vw; max-height: 92dvh; margin: auto 0 0; border-radius: 26px 26px 0 0; border-bottom: 0; }
  dialog.modal[open] { animation: sheet-in var(--t-slow) var(--ease); }
  dialog.modal.closing { animation: sheet-out 200ms var(--ease) forwards; }
  .modal-inner { padding: 22px 20px calc(22px + env(safe-area-inset-bottom)); }
  .modal-actions { flex-direction: column-reverse; }
  .modal-actions .btn { width: 100%; }
}
@keyframes sheet-in { from { transform: translateY(100%); } to { transform: none; } }
@keyframes sheet-out { to { transform: translateY(100%); } }
.sheet-handle { display: none; width: 40px; height: 5px; margin: 10px auto -8px; border-radius: 5px; background: var(--line-strong); }
@media (max-width: 560px) { .sheet-handle { display: block; } }

/* ── QR code ──────────────────────────────────────────────────────────── */
.qr-frame {
  position: relative;
  width: min(260px, 72vw);
  aspect-ratio: 1;
  margin: 0 auto;
  padding: 16px;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 30px 80px -30px var(--accent-glow), 0 0 0 1px rgba(0, 0, 0, 0.04);
}
.qr-frame svg { width: 100%; height: 100%; }
.qr-frame .qr-logo { position: absolute; inset: 0; margin: auto; width: 18%; height: 18%; border-radius: 22%; box-shadow: 0 0 0 5px #fff; }
.qr-frame.done svg { filter: blur(3px); opacity: 0.35; transition: all var(--t-slow) var(--ease); }
.qr-frame .qr-scan { position: absolute; left: 10%; right: 10%; height: 2px; top: 12%; background: linear-gradient(90deg, transparent, var(--violet), transparent); box-shadow: 0 0 18px 2px var(--accent-glow); animation: scan 2.6s var(--ease) infinite alternate; border-radius: 2px; opacity: 0.8; }
@keyframes scan { to { top: 86%; } }

/* anneau de progression */
.ring { position: relative; display: grid; place-items: center; flex: none; }
.ring svg { transform: rotate(-90deg); }
.ring .track { stroke: var(--control-active); }
.ring .value { stroke: url(#ring-grad); stroke-linecap: round; stroke-dasharray: var(--len); stroke-dashoffset: var(--offset); animation: ring-fill 1.2s var(--ease) both; }
@keyframes ring-fill { from { stroke-dashoffset: var(--len); } }
.ring .label { position: absolute; inset: 0; display: grid; place-items: center; align-content: center; text-align: center; }
.ring .label strong { font: 600 26px/1 var(--font-display); letter-spacing: -0.03em; }
.ring .label small { font: 600 10px/1.2 var(--font-mono); letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-subtle); margin-top: 4px; }

/* barre de progression */
.progress { height: 8px; border-radius: 8px; background: var(--control-active); overflow: hidden; }
.progress > span { display: block; height: 100%; width: var(--w, 0); border-radius: inherit; background: var(--grad); box-shadow: 0 0 20px var(--accent-glow); animation: bar-fill 900ms var(--ease) both; }
@keyframes bar-fill { from { width: 0; } }

/* compte à rebours circulaire */
.countdown { display: inline-flex; align-items: center; gap: 8px; font: 500 13px/1 var(--font-mono); color: var(--fg-muted); }
.countdown svg { width: 18px; height: 18px; transform: rotate(-90deg); }
.countdown circle { fill: none; stroke-width: 3; }
.countdown .track { stroke: var(--control-active); }
.countdown .value { stroke: var(--accent); stroke-linecap: round; transition: stroke-dashoffset 1s linear; }

/* pastille « en attente » */
.pulse-dot { position: relative; width: 10px; height: 10px; border-radius: 50%; background: var(--accent); flex: none; }
.pulse-dot::after { content: ""; position: absolute; inset: 0; border-radius: 50%; background: var(--accent); animation: pulse-ring 1.6s var(--ease) infinite; }
@keyframes pulse-ring { from { transform: scale(1); opacity: 0.7; } to { transform: scale(3); opacity: 0; } }

/* codes de secours */
.codes { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; padding: 16px; border-radius: var(--r); background: var(--control); border: 1px dashed var(--line-strong); }
.codes code { font-size: 14px; letter-spacing: 0.06em; text-align: center; padding: 8px; border-radius: 9px; background: var(--control); }

/* étapes d'assistant */
.steps { display: flex; gap: 6px; }
.steps span { height: 4px; flex: 1; border-radius: 4px; background: var(--control-active); transition: background var(--t) var(--ease); }
.steps span.on { background: var(--grad); }

.kv { display: grid; grid-template-columns: minmax(120px, auto) 1fr; gap: 12px 20px; font-size: 14px; }
.kv dt { color: var(--fg-subtle); }
.kv dd { margin: 0; min-width: 0; overflow-wrap: anywhere; }
@media (max-width: 520px) { .kv { grid-template-columns: 1fr; gap: 4px; } .kv dd { margin-bottom: 10px; } }

.copyable { display: inline-flex; align-items: center; gap: 8px; max-width: 100%; padding: 6px 6px 6px 12px; border-radius: 10px; background: var(--control); border: 1px solid var(--line); }
.copyable code { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* 30-landing.css */
/* ── En-tête public ───────────────────────────────────────────────────── */
.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px max(20px, env(safe-area-inset-left));
  padding-top: max(14px, env(safe-area-inset-top));
  transition: background var(--t) var(--ease), box-shadow var(--t) var(--ease), -webkit-backdrop-filter var(--t) var(--ease);
}
.topbar.scrolled { background: color-mix(in srgb, var(--bg) 62%, transparent); -webkit-backdrop-filter: var(--blur); backdrop-filter: var(--blur); box-shadow: 0 1px 0 var(--line); }
.brand { display: inline-flex; align-items: center; gap: 11px; color: var(--fg); text-decoration: none !important; }
.brand img { width: 34px; height: 34px; border-radius: 10px; box-shadow: 0 8px 22px -8px var(--accent-glow); }
.brand .name { font: 600 17px/1 var(--font-display); letter-spacing: -0.02em; }
.brand .name small { display: block; margin-top: 4px; font: 600 9.5px/1 var(--font-mono); letter-spacing: 0.2em; text-transform: uppercase; color: var(--fg-subtle); }
.topbar .actions { margin-left: auto; display: flex; align-items: center; gap: 6px; }

/* ── Vitrine ──────────────────────────────────────────────────────────── */
.landing { width: min(1180px, 100%); margin: 0 auto; padding: 0 20px 60px; }
.hero { display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr); gap: 56px; align-items: center; min-height: calc(100dvh - 140px); padding: 28px 0 40px; }
.hero-copy { display: grid; gap: 26px; align-content: center; }
.pill {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  justify-self: start;
  height: 34px;
  padding: 0 14px 0 6px;
  border-radius: 99px;
  background: var(--glass-solid);
  border: 1px solid var(--line);
  -webkit-backdrop-filter: var(--blur);
  backdrop-filter: var(--blur);
  font-size: 13px;
  color: var(--fg-muted);
  box-shadow: inset 0 1px 0 var(--highlight);
}
.pill .spark { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: var(--grad); color: #fff; }
.pill .spark .i { width: 13px; height: 13px; }
.hero h1 { font-size: clamp(42px, 6.4vw, 78px); letter-spacing: -0.045em; line-height: 0.98; font-weight: 600; }
.hero h1 .grad-text { display: inline-block; padding-bottom: 0.06em; }
.hero .lead { font-size: clamp(16px, 1.6vw, 19px); line-height: 1.6; color: var(--fg-muted); max-width: 52ch; }
.hero-points { display: grid; gap: 12px; margin: 0; padding: 0; list-style: none; }
.hero-points li { display: flex; align-items: center; gap: 12px; color: var(--fg-muted); font-size: 15px; }
.hero-points .icon-badge { width: 34px; height: 34px; border-radius: 10px; }
.hero-points .icon-badge .i { width: 17px; height: 17px; }
.hero-points strong { color: var(--fg); font-weight: 600; }

.logo-rail { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.logo-rail img { width: 38px; height: 38px; border-radius: 11px; box-shadow: 0 8px 20px -10px rgba(0, 0, 0, 0.6); transition: transform var(--t) var(--ease-spring); }
.logo-rail img:hover { transform: translateY(-4px) rotate(-4deg) scale(1.08); }
.logo-rail .soon { opacity: 0.42; filter: saturate(0.4); }
.logo-rail .caption { font-size: 13px; color: var(--fg-subtle); margin-left: 4px; }

/* carte d'authentification */
.auth-card { width: 100%; max-width: 460px; justify-self: end; padding: 32px; border-radius: var(--r-xl); }
.auth-card .auth-head { display: grid; gap: 8px; margin-bottom: 24px; }
.auth-card .auth-head h2 { font-size: 26px; }
.auth-card .auth-head p { color: var(--fg-muted); font-size: 14.5px; }
.auth-card form { display: grid; gap: 16px; }
.auth-alt { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.auth-alt .btn { min-height: 48px; }
.auth-foot { margin-top: 22px; text-align: center; font-size: 14px; color: var(--fg-muted); }
.auth-view { animation: view-in var(--t-slow) var(--ease) both; }
.auth-illu { display: grid; place-items: center; margin: 4px auto 18px; }
.auth-illu .icon-badge { width: 72px; height: 72px; border-radius: 22px; }
.auth-illu .icon-badge .i { width: 32px; height: 32px; }
.legal { margin-top: 14px; font-size: 12px; color: var(--fg-subtle); text-align: center; }
.passcord-wait { display: grid; gap: 18px; justify-items: center; text-align: center; }
.passcord-wait .status { display: inline-flex; align-items: center; gap: 12px; font-size: 14px; color: var(--fg-muted); }

/* ── Sections de la vitrine ───────────────────────────────────────────── */
.l-section { padding: 70px 0 10px; }
.l-section > header { display: grid; gap: 12px; margin-bottom: 30px; max-width: 640px; }
.l-section > header h2 { font-size: clamp(28px, 3.6vw, 42px); letter-spacing: -0.035em; }
.l-section > header p { color: var(--fg-muted); font-size: 16px; }
.features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.feature { padding: 26px; display: grid; gap: 14px; align-content: start; transition: transform var(--t) var(--ease), border-color var(--t) var(--ease); }
.feature:hover { transform: translateY(-4px); border-color: var(--line-strong); }
.feature h3 { font-size: 18px; }
.feature p { color: var(--fg-muted); font-size: 14.5px; }

.suite-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 14px; }
.app-tile {
  --a: #6e58f0;
  --b: #b842ec;
  position: relative;
  display: grid;
  gap: 12px;
  align-content: start;
  padding: 20px;
  border-radius: var(--r-lg);
  color: inherit;
  text-decoration: none !important;
  overflow: hidden;
  transition: transform var(--t) var(--ease), border-color var(--t) var(--ease), box-shadow var(--t) var(--ease);
}
.app-tile::before { background: radial-gradient(300px circle at var(--mx, 0%) var(--my, 0%), color-mix(in srgb, var(--a) 22%, transparent), transparent 55%); opacity: 1; }
a.app-tile:hover { transform: translateY(-4px); border-color: color-mix(in srgb, var(--b) 45%, transparent); box-shadow: inset 0 1px 0 var(--highlight), 0 24px 60px -24px color-mix(in srgb, var(--a) 70%, transparent); }
.app-tile .top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.app-tile img { width: 46px; height: 46px; border-radius: 13px; box-shadow: 0 10px 24px -10px color-mix(in srgb, var(--a) 80%, transparent); }
.app-tile .name { font: 600 16px/1.2 var(--font-display); letter-spacing: -0.015em; }
.app-tile .tag { font-size: 13px; color: var(--fg-subtle); margin-top: 2px; }
.app-tile .desc { font-size: 13.5px; color: var(--fg-muted); }
.app-tile.is-soon img { filter: saturate(0.55); opacity: 0.8; }
.app-tile .go { position: absolute; right: 18px; bottom: 18px; color: var(--fg-subtle); opacity: 0; transform: translateX(-6px); transition: all var(--t) var(--ease); }
a.app-tile:hover .go { opacity: 1; transform: none; color: var(--fg); }

.how { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 0; padding: 0; }
.how li { list-style: none; padding: 24px; display: grid; gap: 10px; }
.how .how-n { font: 600 13px/1 var(--font-mono); letter-spacing: 0.1em; color: var(--accent); }
.how h3 { font-size: 17px; }
.how p { color: var(--fg-muted); font-size: 14px; }

.promise { margin-top: 70px; padding: 40px; display: grid; grid-template-columns: auto 1fr auto; gap: 28px; align-items: center; overflow: hidden; }
.promise h2 { font-size: clamp(22px, 2.6vw, 30px); }
.promise p { color: var(--fg-muted); margin-top: 8px; }
.promise .icon-badge { width: 64px; height: 64px; border-radius: 20px; }
.promise .icon-badge .i { width: 30px; height: 30px; }

.site-foot { margin-top: 60px; padding: 28px 0 10px; border-top: 1px solid var(--line); display: flex; flex-wrap: wrap; gap: 14px 24px; align-items: center; color: var(--fg-subtle); font-size: 13px; }
.site-foot a { color: var(--fg-muted); }
.site-foot .spacer { flex: 1; }

@media (max-width: 980px) {
  .hero { grid-template-columns: 1fr; gap: 34px; min-height: auto; padding-top: 18px; }
  .auth-card { justify-self: stretch; max-width: none; }
  .features, .how { grid-template-columns: 1fr; }
  .promise { grid-template-columns: 1fr; text-align: left; }
}
@media (max-width: 560px) {
  .landing { padding: 0 16px 40px; }
  .auth-card { padding: 24px 20px; border-radius: 24px; }
  .hero h1 { font-size: 44px; }
  .auth-alt { grid-template-columns: 1fr; }
  .l-section { padding-top: 54px; }
  .promise { padding: 26px; }
  .topbar .hide-sm { display: none; }
}
.auth-view form + .row-wrap { margin-top: 16px; }

/* Mobile d'abord : la carte de connexion juste après l'accroche, avant l'argumentaire. */
@media (max-width: 980px) {
  .hero { gap: 22px; }
  .hero-copy { display: contents; }
  .hero-copy > .pill { order: 1; }
  .hero-copy > h1 { order: 2; }
  .hero-copy > .lead { order: 3; }
  .hero > .auth-card { order: 4; margin: 6px 0 10px; }
  .hero-copy > .hero-points { order: 5; }
  .hero-copy > .logo-rail { order: 6; }
}

/* 40-shell.css */
/* ── Coque de l'espace connecté ───────────────────────────────────────── */
.shell { display: grid; grid-template-columns: 272px minmax(0, 1fr); min-height: 100dvh; }
.sidebar {
  position: sticky;
  top: 0;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 22px 16px 18px;
  border-right: 1px solid var(--line);
  background: color-mix(in srgb, var(--bg) 40%, transparent);
  -webkit-backdrop-filter: var(--blur);
  backdrop-filter: var(--blur);
}
.sidebar .brand { padding: 4px 8px 22px; }
.nav { display: grid; gap: 3px; }
.nav-label { margin: 18px 12px 8px; font: 600 10.5px/1 var(--font-mono); letter-spacing: 0.18em; text-transform: uppercase; color: var(--fg-faint); }
.nav a {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 42px;
  padding: 0 12px;
  border-radius: 12px;
  color: var(--fg-muted);
  font-weight: 500;
  font-size: 14.5px;
  text-decoration: none !important;
  transition: background var(--t) var(--ease), color var(--t) var(--ease);
}
.nav a .i { width: 19px; height: 19px; }
.nav a:hover { background: var(--control); color: var(--fg); }
.nav a[aria-current="page"] { color: var(--fg); background: var(--control-hover); box-shadow: inset 0 1px 0 var(--highlight), inset 0 0 0 1px var(--line); }
.nav a[aria-current="page"]::before { content: ""; position: absolute; left: -16px; top: 10px; bottom: 10px; width: 3px; border-radius: 0 3px 3px 0; background: var(--grad); box-shadow: 0 0 14px var(--accent-glow); }
.nav a[aria-current="page"] .i { color: var(--accent); }
.nav a .count { margin-left: auto; min-width: 22px; height: 20px; padding: 0 6px; display: grid; place-items: center; border-radius: 99px; background: var(--control-active); font: 600 11px/1 var(--font-mono); color: var(--fg-muted); }
.nav a .dot-alert { margin-left: auto; width: 8px; height: 8px; border-radius: 50%; background: var(--warn); box-shadow: 0 0 0 3px var(--warn-soft); }
.sidebar .me {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 10px;
  border-radius: 16px;
  background: var(--control);
  border: 1px solid var(--line);
}
.sidebar .me .who { flex: 1; min-width: 0; }
.sidebar .me .who strong { display: block; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sidebar .me .who span { display: block; font-size: 12px; color: var(--fg-subtle); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.main { min-width: 0; padding: 34px clamp(20px, 4vw, 56px) 80px; }
.main-inner { width: min(960px, 100%); margin: 0 auto; }
.page-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; flex-wrap: wrap; margin-bottom: 28px; }
.page-head h1 { font-size: clamp(28px, 3.4vw, 38px); letter-spacing: -0.035em; outline: none; }
.page-head p { margin-top: 8px; color: var(--fg-muted); font-size: 15px; max-width: 60ch; }
.page-head .eyebrow { margin-bottom: 10px; }
.view { display: grid; gap: 18px; animation: view-in var(--t-slow) var(--ease) both; }
.view > * { animation: rise-in var(--t-slow) var(--ease) both; }
.view > *:nth-child(2) { animation-delay: 40ms; }
.view > *:nth-child(3) { animation-delay: 80ms; }
.view > *:nth-child(4) { animation-delay: 120ms; }
.view > *:nth-child(5) { animation-delay: 160ms; }
.view > *:nth-child(n + 6) { animation-delay: 200ms; }
@keyframes view-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes rise-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }

/* barre du haut + onglets (mobile) */
.mobile-top, .tabbar { display: none; }
@media (max-width: 960px) {
  .shell { grid-template-columns: 1fr; }
  .sidebar { display: none; }
  .mobile-top {
    position: sticky;
    top: 0;
    z-index: 30;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: max(12px, env(safe-area-inset-top)) 16px 12px;
    background: color-mix(in srgb, var(--bg) 70%, transparent);
    -webkit-backdrop-filter: var(--blur);
    backdrop-filter: var(--blur);
    border-bottom: 1px solid var(--line);
  }
  .mobile-top .brand img { width: 30px; height: 30px; border-radius: 9px; }
  .mobile-top .brand .name { font-size: 16px; }
  .mobile-top .avatar-btn { margin-left: auto; padding: 0; border: 0; background: none; border-radius: 50%; }
  .main { padding: 22px 16px calc(110px + env(safe-area-inset-bottom)); }
  .tabbar {
    position: fixed;
    z-index: 40;
    left: 12px;
    right: 12px;
    bottom: calc(10px + env(safe-area-inset-bottom));
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    padding: 6px;
    border-radius: 24px;
    background: var(--glass), var(--glass-strong);
    border: 1px solid var(--line-strong);
    -webkit-backdrop-filter: blur(30px) saturate(180%);
    backdrop-filter: blur(30px) saturate(180%);
    box-shadow: inset 0 1px 0 var(--highlight), var(--shadow-lg);
  }
  .tabbar a, .tabbar button {
    display: grid;
    justify-items: center;
    gap: 3px;
    padding: 8px 2px 6px;
    border: 0;
    border-radius: 18px;
    background: none;
    color: var(--fg-subtle);
    font: 600 10.5px/1 var(--font-sans);
    text-decoration: none !important;
    transition: color var(--t) var(--ease), background var(--t) var(--ease);
  }
  .tabbar .i { width: 22px; height: 22px; }
  .tabbar [aria-current="page"] { color: var(--fg); background: var(--control-hover); }
  .tabbar [aria-current="page"] .i { color: var(--accent); }
  .grid-2, .grid-3 { grid-template-columns: 1fr; }
  .grid-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .toasts { left: 16px; right: 16px; width: auto; bottom: calc(96px + env(safe-area-inset-bottom)); }
}
@media (max-width: 560px) {
  .card { padding: 20px; }
  .card-lg { padding: 22px; }
  .list-item { flex-wrap: wrap; }
  .list-item .actions { width: 100%; justify-content: flex-end; }
  .list-item .actions.compact { width: auto; }
}

/* feuille « Plus » (mobile) */
.more-list { display: grid; gap: 6px; }
.more-list a, .more-list button {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 54px;
  padding: 0 16px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: var(--control);
  color: var(--fg);
  font-weight: 500;
  text-decoration: none !important;
  text-align: left;
}
.more-list .i { width: 20px; height: 20px; color: var(--fg-muted); }
.more-list .danger { color: var(--danger); }
.more-list .danger .i { color: var(--danger); }

/* 50-views.css */
/* ── Aperçu ───────────────────────────────────────────────────────────── */
.hello { display: grid; grid-template-columns: auto 1fr auto; gap: 24px; align-items: center; padding: 28px; overflow: hidden; }
.hello::after { opacity: 1; }
.hello .who h1 { font-size: clamp(26px, 3.2vw, 34px); letter-spacing: -0.035em; }
.hello .who .meta { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; color: var(--fg-muted); font-size: 14px; }
.hello .glow { position: absolute; right: -80px; top: -120px; width: 320px; height: 320px; border-radius: 50%; background: radial-gradient(circle, var(--accent-glow), transparent 65%); opacity: 0.6; pointer-events: none; z-index: -1; filter: blur(10px); }
.score { display: grid; justify-items: center; gap: 10px; text-align: center; }
.score .caption { font-size: 13px; font-weight: 600; }
.score .caption.tone-ok { color: var(--ok); }
.score .caption.tone-warn { color: var(--warn); }
.score .caption.tone-danger { color: var(--danger); }
@media (max-width: 720px) {
  .hello { grid-template-columns: auto 1fr; padding: 22px; }
  .hello .score { grid-column: 1 / -1; grid-template-columns: auto 1fr; justify-items: start; text-align: left; align-items: center; gap: 16px; padding-top: 18px; border-top: 1px solid var(--line); }
}

.stat { padding: 18px; display: grid; gap: 12px; align-content: start; color: inherit; text-decoration: none !important; transition: transform var(--t) var(--ease), border-color var(--t) var(--ease); }
a.stat:hover { transform: translateY(-3px); border-color: var(--line-strong); }
.stat .value { font: 600 30px/1 var(--font-display); letter-spacing: -0.04em; }
.stat .label { font-size: 13px; color: var(--fg-muted); }
.stat .top { display: flex; align-items: center; justify-content: space-between; }
.stat .top .i.go { color: var(--fg-faint); width: 16px; height: 16px; transition: transform var(--t) var(--ease); }
a.stat:hover .top .i.go { transform: translate(2px, -2px); color: var(--fg-muted); }
.stat .value.small-value { font-size: 18px; letter-spacing: -0.02em; line-height: 1.2; }

.checklist { display: grid; gap: 8px; margin: 0; padding: 0; list-style: none; }
.checklist li { display: flex; align-items: center; gap: 14px; padding: 12px 14px; border-radius: 14px; background: var(--control); border: 1px solid var(--line); transition: opacity var(--t) var(--ease); }
.checklist .tick { display: grid; place-items: center; width: 26px; height: 26px; flex: none; border-radius: 50%; border: 2px solid var(--line-strong); color: transparent; }
.checklist .tick .i { width: 14px; height: 14px; stroke-width: 3; }
.checklist li.done .tick { border-color: transparent; background: var(--ok); color: #fff; }
.checklist li.done .label { color: var(--fg-subtle); text-decoration: line-through; text-decoration-color: var(--fg-faint); }
.checklist .label { flex: 1; min-width: 0; font-weight: 500; font-size: 14.5px; }
.checklist .label small { display: block; font-weight: 400; color: var(--fg-subtle); font-size: 12.5px; margin-top: 2px; text-decoration: none; }
.onboard-head { display: flex; align-items: center; gap: 16px; margin-bottom: 18px; }
.onboard-head .grow { flex: 1; }
.onboard-head .progress { margin-top: 10px; }

/* activité */
.timeline { display: grid; gap: 0; margin: 0; padding: 0; list-style: none; }
.timeline .day { margin: 18px 0 8px; font: 600 11px/1 var(--font-mono); letter-spacing: 0.14em; text-transform: uppercase; color: var(--fg-subtle); }
.timeline .day:first-child { margin-top: 0; }
.event { position: relative; display: flex; gap: 14px; padding: 10px 0 10px 0; }
.event::before { content: ""; position: absolute; left: 16px; top: 44px; bottom: -10px; width: 1px; background: var(--line); }
.event:last-child::before, .event.last::before { display: none; }
.event .icon-badge { width: 34px; height: 34px; border-radius: 11px; }
.event .icon-badge .i { width: 16px; height: 16px; }
.event .body { flex: 1; min-width: 0; padding-top: 1px; }
.event .what { font-weight: 500; font-size: 14.5px; }
.event .what em { font-style: normal; color: var(--fg-muted); }
.event .meta { margin-top: 3px; font-size: 12.5px; color: var(--fg-subtle); display: flex; flex-wrap: wrap; gap: 4px 10px; }
.event time { font: 500 12px/1 var(--font-mono); color: var(--fg-subtle); white-space: nowrap; padding-top: 4px; }
.filters { display: flex; flex-wrap: wrap; gap: 8px; }

/* profil */
.profile-hero { display: flex; align-items: center; gap: 22px; flex-wrap: wrap; }
.profile-hero .avatar-edit { position: relative; }
.profile-hero .avatar-edit .btn-icon { position: absolute; right: -2px; bottom: -2px; border-radius: 50%; width: 38px; min-height: 38px; box-shadow: 0 0 0 4px var(--bg), var(--shadow); }
.profile-hero .who { flex: 1; min-width: 200px; }
.profile-hero .who h2 { font-size: 24px; }
.profile-hero .who p { color: var(--fg-muted); margin-top: 4px; }
.pref { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding: 16px 0; }
.pref + .pref { border-top: 1px solid var(--line); }
.pref .label strong { display: block; font-weight: 600; font-size: 14.5px; }
.pref .label span { display: block; font-size: 13px; color: var(--fg-subtle); margin-top: 2px; }

/* sécurité */
.method { display: grid; grid-template-columns: auto 1fr auto; gap: 16px; align-items: center; }
.method .state { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; justify-content: flex-end; }
@media (max-width: 560px) { .method { grid-template-columns: auto 1fr; } .method .state { grid-column: 1 / -1; justify-content: flex-start; } }

/* apps connectées */
.app-row img { width: 44px; height: 44px; border-radius: 12px; flex: none; }
.app-row .fallback { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 12px; background: var(--grad); color: #fff; font: 600 18px/1 var(--font-display); }
.scopes { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }

/* confidentialité */
.inventory { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.inventory .item { display: flex; gap: 14px; padding: 16px; border-radius: 16px; background: var(--control); border: 1px solid var(--line); }
.inventory .item strong { display: block; font-size: 14.5px; }
.inventory .item p { font-size: 13px; color: var(--fg-muted); margin-top: 3px; }
.inventory .item .count { margin-left: auto; font: 600 20px/1 var(--font-display); color: var(--fg-muted); }
.never { display: grid; gap: 10px; margin: 0; padding: 0; list-style: none; }
.never li { display: flex; gap: 12px; align-items: flex-start; font-size: 14.5px; color: var(--fg-muted); }
.never li .i { color: var(--ok); margin-top: 2px; }
.danger-zone { border-color: color-mix(in srgb, var(--danger) 30%, transparent); background: linear-gradient(160deg, var(--danger-soft), transparent 60%), var(--glass-solid); }
@media (max-width: 720px) { .inventory { grid-template-columns: 1fr; } }

/* admin */
.bars { display: flex; align-items: flex-end; gap: 4px; height: 140px; padding-top: 10px; }
.bars span { flex: 1; min-height: 3px; border-radius: 5px 5px 2px 2px; background: var(--grad); opacity: 0.85; position: relative; transition: opacity var(--t) var(--ease), transform var(--t) var(--ease); transform-origin: bottom; animation: bar-grow 700ms var(--ease) both; }
.bars span:hover { opacity: 1; }
.bars span.zero { background: var(--control-active); }
@keyframes bar-grow { from { transform: scaleY(0); } }
.bars-axis { display: flex; justify-content: space-between; margin-top: 8px; font: 500 11px/1 var(--font-mono); color: var(--fg-subtle); }
.meter { display: grid; gap: 8px; }
.meter .row { justify-content: space-between; font-size: 14px; }
.table-wrap { overflow-x: auto; margin: 0 -4px; }
table.table { width: 100%; border-collapse: collapse; font-size: 14px; }
.table th { text-align: left; font: 600 11px/1 var(--font-mono); letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-subtle); padding: 10px 8px; border-bottom: 1px solid var(--line); }
.table td { padding: 12px 8px; border-bottom: 1px solid var(--line); vertical-align: top; }
.table tr:last-child td { border-bottom: 0; }

/* célébration */
.celebrate { position: fixed; inset: 0; pointer-events: none; z-index: 95; overflow: hidden; }
.celebrate i { position: absolute; top: -12px; width: 8px; height: 14px; border-radius: 2px; background: var(--grad); animation: confetti 1.8s var(--ease) forwards; }
@keyframes confetti { to { transform: translate3d(var(--dx, 0), 105vh, 0) rotate(var(--rot, 540deg)); opacity: 0.2; } }

.hello .who .since { margin-top: 8px; }
.tips { margin-top: 10px; gap: 6px; }
.tips li { font-size: 14px; }
.tips li .i { color: var(--accent); }
details > summary { list-style: none; cursor: pointer; }
details > summary::-webkit-details-marker { display: none; }
details[open] > summary { margin-bottom: 12px; }
.card-title .tone-ok { color: var(--ok); }
.card-title .tone-warn { color: var(--warn); }
.card-title .tone-danger { color: var(--danger); }
.stat.glass, .app-tile.glass { border-radius: var(--r-lg); }
.row.small input[type="checkbox"] { width: 18px; height: 18px; accent-color: var(--violet); }

.checklist li.done .label small { display: none; }
@media (max-width: 720px) {
  .hello .avatar-ring.avatar-xl { width: 68px; height: 68px; }
  .onboard-head > .icon-badge { display: none; }
  .onboard-head { align-items: flex-start; }
  .checklist li { padding: 12px; gap: 12px; }
}
.device-logo { width: 42px; height: 42px; flex: none; border-radius: 13px; box-shadow: 0 8px 20px -10px rgba(0, 0, 0, 0.5); }

/* administration : onglets + bêta fermée */
.admin-tabs { justify-self: start; margin: -4px 0 4px; }
.beta-build { font-size: 22px; line-height: 1.2; }
.beta-form { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px 16px; align-items: end; }
.beta-form .beta-label { grid-column: 1 / 3; }
.beta-form .beta-submit { display: flex; justify-content: flex-end; }
.beta-codes { display: grid; gap: 8px; max-height: min(52vh, 460px); overflow: auto; padding: 2px; }
.beta-codes li { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 8px 8px 14px; border-radius: 12px; background: var(--control); box-shadow: inset 0 0 0 1px var(--line); animation: code-in 0.5s var(--ease) both; }
.beta-codes code { font: 600 15px/1.4 var(--font-mono); letter-spacing: 0.06em; user-select: all; }
.modal.wide .beta-codes { grid-template-columns: repeat(2, minmax(0, 1fr)); }
@keyframes code-in { from { opacity: 0; transform: translateY(8px) scale(0.98); } }
.table .actions-cell { text-align: right; white-space: nowrap; }
.beta-redeem { display: flex; gap: 10px; align-items: flex-end; }
.beta-redeem .field { flex: 1; }
.beta-redeem .input { font-family: var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; }
.beta-assets { display: grid; gap: 8px; }
@media (max-width: 720px) {
  .beta-form { grid-template-columns: 1fr 1fr; }
  .beta-form .beta-label, .beta-form .beta-submit { grid-column: 1 / -1; }
  .modal.wide .beta-codes { grid-template-columns: 1fr; }
  .beta-redeem { flex-direction: column; align-items: stretch; }
}
@media (prefers-reduced-motion: reduce) { .beta-codes li { animation: none; } }
.token-steps { display: grid; gap: 10px; }
.token-steps li { display: flex; align-items: flex-start; gap: 12px; padding: 14px; border-radius: 16px; background: var(--control); box-shadow: inset 0 0 0 1px var(--line); }
.token-steps li > p { flex: 1; font-size: 14px; margin-top: 3px; }
.token-steps .step-n { display: grid; place-items: center; flex: none; width: 28px; height: 28px; border-radius: 50%; background: var(--grad); color: #fff; font-weight: 600; font-size: 13px; }
.token-steps form .input { min-width: 0; flex: 1; }
@media (max-width: 720px) { .token-steps li { flex-wrap: wrap; } }

/* 55-hub.css */
/* ── Coque : barre flottante (remplace la barre latérale) ─────────────── */
.shell { display: block; }
.dock {
  position: sticky;
  top: 12px;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 10px;
  width: min(1120px, calc(100% - 32px));
  margin: 12px auto 0;
  padding: 8px 10px 8px 14px;
  border-radius: 22px;
  background: var(--glass), var(--glass-solid);
  border: 1px solid var(--line-strong);
  -webkit-backdrop-filter: var(--blur);
  backdrop-filter: var(--blur);
  box-shadow: inset 0 1px 0 var(--highlight), var(--shadow);
}
.dock .brand { gap: 10px; }
.dock .brand img { border-radius: 10px; }
.dock .brand .name { font: 600 15px/1 var(--font-display); letter-spacing: -0.01em; white-space: nowrap; }
.dock-nav { display: flex; gap: 2px; margin: 0 auto; padding: 4px; border-radius: 16px; background: var(--control); }
.dock-nav a, .dock-more {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 13px;
  border: 0;
  border-radius: 12px;
  background: none;
  color: var(--fg-muted);
  font: 500 14px/1 var(--font-sans);
  text-decoration: none !important;
  cursor: pointer;
  transition: background var(--t) var(--ease), color var(--t) var(--ease), box-shadow var(--t) var(--ease);
}
.dock-nav .i { width: 17px; height: 17px; }
.dock-nav a:hover, .dock-more:hover { color: var(--fg); }
.dock-nav [aria-current="page"] { color: var(--fg); background: var(--glass-strong); box-shadow: inset 0 1px 0 var(--highlight), 0 6px 18px -8px rgba(0, 0, 0, 0.6); }
.dock-nav [aria-current="page"] .i { color: var(--accent); }
.dock-nav .dot-alert { width: 7px; height: 7px; border-radius: 50%; background: var(--warn); box-shadow: 0 0 0 3px var(--warn-soft); }
.dock-search {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  min-width: 220px;
  padding: 0 7px 0 12px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--control);
  color: var(--fg-subtle);
  font: 400 13.5px/1 var(--font-sans);
  cursor: pointer;
  transition: border-color var(--t) var(--ease), background var(--t) var(--ease);
}
.dock-search:hover { border-color: var(--line-strong); background: var(--control-hover); }
.dock-search .i { width: 16px; height: 16px; }
kbd { display: inline-flex; align-items: center; gap: 3px; margin-left: auto; padding: 3px 7px; border-radius: 7px; background: var(--control-hover); box-shadow: inset 0 -1px 0 var(--line-strong); font: 600 11px/1.2 var(--font-mono); color: var(--fg-muted); }
.dock-bell { position: relative; }
.badge-dot { position: absolute; top: 2px; right: 1px; min-width: 17px; height: 17px; padding: 0 4px; border-radius: 99px; background: var(--grad); color: #fff; font: 700 10px/17px var(--font-mono); text-align: center; box-shadow: 0 0 0 2px var(--bg); }
.avatar-btn { padding: 0; border: 0; background: none; border-radius: 50%; cursor: pointer; }
@media (min-width: 961px) { .main { padding: 30px clamp(16px, 4vw, 48px) 80px; } }
.main-inner { width: min(1120px, 100%); }
.mobile-top .spacer { flex: 1; }
@media (max-width: 1200px) {
  .dock-search { min-width: 0; width: 38px; padding: 0; justify-content: center; }
  .dock-search span, .dock-search kbd { display: none; }
}
@media (max-width: 1060px) { .dock-nav a span, .dock-more span { display: none; } .dock-nav a, .dock-more { padding: 0 11px; } }
@media (max-width: 960px) { .dock { display: none; } .mobile-top .avatar-btn { margin-left: 0; } }

/* ── Accueil ─────────────────────────────────────────────────────────── */
.hub { gap: 22px; }
.hub-hero { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 18px; align-items: stretch; }

/* La Carte Cord : une carte de membre holographique. */
.cord-card {
  --rx: 0deg;
  --ry: 0deg;
  --px: 30%;
  --py: 20%;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-height: 300px;
  padding: 26px 28px;
  border-radius: 30px;
  color: #fff;
  background:
    radial-gradient(120% 90% at 0% 0%, rgba(110, 88, 240, 0.95) 0%, transparent 55%),
    radial-gradient(90% 80% at 100% 100%, rgba(210, 75, 239, 0.85) 0%, transparent 60%),
    linear-gradient(135deg, #150d2e, #2b1454 55%, #3b1257);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.28), inset 0 0 0 1px rgba(255, 255, 255, 0.12), 0 34px 80px -34px rgba(139, 92, 255, 0.75), var(--shadow);
  transform: perspective(1100px) rotateX(var(--rx)) rotateY(var(--ry));
  transition: transform 500ms var(--ease);
}
.cc-holo {
  position: absolute;
  z-index: -1;
  inset: -45%;
  background: conic-gradient(from 0deg at var(--px) var(--py), transparent 0deg, rgba(120, 220, 255, 0.2) 60deg, rgba(255, 120, 220, 0.22) 140deg, transparent 220deg, rgba(160, 255, 200, 0.16) 300deg, transparent 360deg);
  mix-blend-mode: screen;
  animation: holo-spin 16s linear infinite;
}
.cc-shine { position: absolute; z-index: -1; inset: 0; background: radial-gradient(460px circle at var(--px) var(--py), rgba(255, 255, 255, 0.24), transparent 45%); transition: background 200ms linear; }
@keyframes holo-spin { to { transform: rotate(360deg); } }
.cc-top { display: flex; align-items: center; gap: 10px; }
.cc-top img { border-radius: 9px; box-shadow: 0 6px 16px -6px rgba(0, 0, 0, 0.6); }
.cc-brand { font: 600 12px/1 var(--font-mono); letter-spacing: 0.22em; text-transform: uppercase; opacity: 0.85; }
.cc-level { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 11px; border-radius: 99px; background: rgba(0, 0, 0, 0.28); border: 1px solid rgba(255, 255, 255, 0.18); font-size: 12.5px; font-weight: 600; color: #fff !important; text-decoration: none !important; -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); }
.cc-level .i { width: 14px; height: 14px; }
.cc-level.tone-ok .i { color: #7ff0bf; }
.cc-level.tone-warn .i { color: #ffd38a; }
.cc-level.tone-danger .i { color: #ff9cae; }
.cc-id { display: flex; align-items: center; gap: 18px; }
.cord-card .avatar-ring { box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.35), 0 16px 34px -14px rgba(0, 0, 0, 0.7); }
.cc-who { min-width: 0; }
.cc-who h1 { font-size: clamp(26px, 3vw, 36px); letter-spacing: -0.035em; line-height: 1.05; outline: none; }
.cc-who p { margin-top: 7px; display: flex; align-items: center; gap: 6px; color: rgba(255, 255, 255, 0.8); font-size: 14.5px; }
.cc-check .i { width: 16px; height: 16px; color: #8ff0c4; }
.cc-bottom { position: relative; margin: auto 0 0; display: flex; flex-wrap: wrap; align-items: flex-end; gap: 14px 30px; }
.cc-bottom dt { font: 600 10.5px/1 var(--font-mono); letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255, 255, 255, 0.6); }
.cc-bottom dd { margin: 7px 0 0; font: 600 15px/1 var(--font-display); }
.cc-bottom dd.mono { font-family: var(--font-mono); font-size: 13.5px; letter-spacing: 0.06em; }
.cc-chip { margin-left: auto; width: 46px; height: 34px; border-radius: 8px; background: linear-gradient(135deg, #f6e3a5, #caa24d 45%, #f3d98c 70%, #b88d3a); box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2), 0 6px 14px -6px rgba(0, 0, 0, 0.5); position: relative; }
.cc-chip::before { content: ""; position: absolute; inset: 7px 9px; border: 1px solid rgba(0, 0, 0, 0.25); border-radius: 4px; }

/* Panneau « Aujourd'hui » */
.today { display: flex; flex-direction: column; gap: 16px; padding: 22px; border-radius: var(--r-xl); }
.today-score { display: flex; align-items: center; gap: 14px; color: inherit; text-decoration: none !important; }
.today-score .ring .label strong { font-size: 20px; }
.today-score .ring .label small { display: none; }
.today-score > span strong { display: block; font-size: 16px; }
.today-score > span small { color: var(--fg-subtle); font-size: 12.5px; }
.today-next { display: grid; justify-items: start; gap: 6px; padding: 14px 16px; border-radius: 16px; background: var(--control); border: 1px solid var(--line); }
.today-next .title { display: flex; align-items: center; gap: 8px; font-weight: 600; }
.today-next .desc { color: var(--fg-muted); font-size: 13.5px; }
.today-next .btn { margin-top: 4px; }
.today-next.done .i { width: 18px; height: 18px; color: var(--ok); }
.today-counters { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: auto; }
.counter { display: grid; gap: 5px; padding: 12px 14px; border: 1px solid var(--line); border-radius: 16px; background: var(--control); color: inherit; font: inherit; text-align: left; text-decoration: none !important; cursor: pointer; transition: background var(--t) var(--ease); }
.counter:hover { background: var(--control-hover); }
.counter strong { font: 600 24px/1 var(--font-display); }
.counter span { display: flex; align-items: center; gap: 6px; color: var(--fg-subtle); font-size: 12.5px; }
.counter .i { width: 14px; height: 14px; }

/* Bandeau « confirme ton email » avec code */
.verify-strip { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 16px; padding: 16px 18px; border-radius: var(--r-lg); border-color: color-mix(in srgb, var(--warn) 35%, var(--line)); }
.verify-strip .title { font-weight: 600; }
.verify-strip .desc { color: var(--fg-muted); font-size: 13.5px; }
.verify-form { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.verify-form .input-otp { width: 180px; min-height: 46px; font-size: 20px; }

/* La suite, en grille bento */
.section-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin: 6px 2px 14px; }
.section-head h2 { font-size: 22px; letter-spacing: -0.02em; }
.section-head p { margin-top: 4px; color: var(--fg-muted); font-size: 14px; max-width: 62ch; }
.bento { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 14px; }
.tile {
  --a: #6e58f0;
  --b: #b842ec;
  grid-column: span 2;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 190px;
  padding: 18px;
  border-radius: 24px;
  background: var(--glass), var(--glass-solid);
  border: 1px solid var(--line);
  box-shadow: inset 0 1px 0 var(--highlight), var(--shadow-sm);
  transition: transform var(--t) var(--ease), border-color var(--t) var(--ease), box-shadow var(--t) var(--ease);
}
.tile.wide { grid-column: span 4; }
.tile:hover { transform: translateY(-3px); border-color: color-mix(in srgb, var(--a) 45%, var(--line)); box-shadow: inset 0 1px 0 var(--highlight), 0 26px 54px -26px color-mix(in srgb, var(--a) 65%, transparent); }
.tile-glow { position: absolute; z-index: -1; right: -30%; bottom: -60%; width: 75%; aspect-ratio: 1; border-radius: 50%; background: radial-gradient(circle, color-mix(in srgb, var(--b) 50%, transparent), transparent 65%); opacity: 0.3; transition: opacity var(--t) var(--ease); }
.tile.is-linked .tile-glow { opacity: 0.6; }
.tile:hover .tile-glow { opacity: 0.9; }
.tile header { display: flex; align-items: center; gap: 12px; }
.tile header img { flex: none; border-radius: 13px; box-shadow: 0 10px 24px -12px var(--a); }
.tile h3 { font-size: 16.5px; letter-spacing: -0.01em; }
.tile header p { font-size: 12.5px; color: var(--fg-subtle); }
.tile-body { display: grid; gap: 6px; }
.tile-headline { font: 600 20px/1.2 var(--font-display); letter-spacing: -0.02em; }
.tile-detail { font-size: 13.5px; color: var(--fg-muted); }
.tile-updated { margin-top: 4px; font: 500 11px/1 var(--font-mono); color: var(--fg-faint); }
.tile-metrics { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
.tile-metrics span { display: grid; gap: 3px; padding: 8px 12px; border-radius: 12px; background: var(--control); font-size: 11.5px; color: var(--fg-subtle); }
.tile-metrics strong { font: 600 16px/1 var(--font-display); color: var(--fg); }
.tile footer { margin-top: auto; display: flex; gap: 8px; }
.skeleton.tile-sk { grid-column: span 2; height: 190px; border-radius: 24px; }
.soon-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 14px; }
.soon-row .eyebrow { margin: 0 6px 0 2px; }
.soon-chip { --a: #888; display: inline-flex; align-items: center; gap: 8px; height: 34px; padding: 0 12px 0 6px; border: 1px solid var(--line); border-radius: 99px; background: var(--control); color: var(--fg-muted); font-size: 13px; transition: border-color var(--t) var(--ease); }
.soon-chip:hover { border-color: color-mix(in srgb, var(--a) 50%, var(--line)); }
.soon-chip img { border-radius: 7px; filter: saturate(0.65); }

/* Fil de la suite */
.feed { padding: 22px; border-radius: var(--r-xl); }
.feed-list { display: grid; gap: 4px; margin-top: 12px; }
.feed-list li { display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 14px; transition: background var(--t) var(--ease); }
.feed-list li:hover { background: var(--control); }
.feed-list li.unread { background: color-mix(in srgb, var(--accent) 9%, transparent); }
.feed-logo { flex: none; border-radius: 10px; }
.feed-list .what { font-size: 14px; }
.feed-list .more { font-size: 12.5px; color: var(--fg-subtle); }
.feed-list time { font: 500 11.5px/1 var(--font-mono); color: var(--fg-faint); white-space: nowrap; }

@media (min-width: 961px) and (max-width: 1100px) { .tile, .tile.wide { grid-column: span 3; } }
@media (max-width: 960px) {
  .hub-hero { grid-template-columns: minmax(0, 1fr); }
  .bento { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .tile, .tile.wide, .skeleton.tile-sk { grid-column: span 2; }
  .cord-card { min-height: 0; padding: 22px; }
}
@media (max-width: 560px) {
  .cc-id { flex-direction: column; align-items: flex-start; gap: 14px; }
  .verify-form, .verify-form .input-otp { width: 100%; }
}

/* ── Notifications ───────────────────────────────────────────────────── */
dialog.modal.inbox-sheet { width: min(470px, calc(100vw - 24px)); }
@media (min-width: 961px) { dialog.modal.inbox-sheet { margin: 78px max(16px, calc((100vw - 1120px) / 2)) auto auto; } }
.inbox-list { display: grid; gap: 6px; max-height: min(58vh, 520px); overflow: auto; }
.inbox-list li { display: flex; gap: 12px; padding: 12px; border: 1px solid var(--line); border-radius: 14px; background: var(--control); }
.inbox-list li.unread { border-color: color-mix(in srgb, var(--accent) 45%, var(--line)); background: color-mix(in srgb, var(--accent) 8%, var(--control)); }
.inbox-list .what { display: flex; justify-content: space-between; gap: 8px; font-size: 12.5px; color: var(--fg-subtle); }
.inbox-list .what time { font: 500 11.5px/1.4 var(--font-mono); }
.inbox-list .title { font-weight: 600; font-size: 14px; }
.inbox-list .more { font-size: 13px; color: var(--fg-muted); }
.inbox-actions { display: flex; flex-direction: column; gap: 4px; }

/* ── Palette de commandes ────────────────────────────────────────────── */
dialog.palette {
  width: min(640px, calc(100vw - 24px));
  max-height: none;
  margin: 12vh auto auto;
  padding: 0;
  border: 1px solid var(--line-strong);
  border-radius: 22px;
  background: var(--glass), var(--glass-strong);
  color: var(--fg);
  box-shadow: var(--shadow-lg);
  -webkit-backdrop-filter: var(--blur);
  backdrop-filter: var(--blur);
  animation: pal-in 220ms var(--ease);
}
dialog.palette::backdrop { background: rgba(5, 4, 10, 0.5); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); }
dialog.palette.closing { animation: pal-out 140ms ease forwards; }
.palette-search { display: flex; align-items: center; gap: 12px; padding: 16px 18px; border-bottom: 1px solid var(--line); }
.palette-search .i { width: 20px; height: 20px; color: var(--fg-subtle); }
.palette-search input { flex: 1; min-width: 0; border: 0; background: none; color: var(--fg); font: 400 17px/1.4 var(--font-sans); outline: none; }
.palette-list { max-height: min(52vh, 420px); overflow: auto; padding: 8px; }
.palette-group { padding: 10px 10px 6px; font: 600 10.5px/1 var(--font-mono); letter-spacing: 0.16em; text-transform: uppercase; color: var(--fg-faint); }
.palette-item { display: flex; align-items: center; gap: 12px; width: 100%; min-height: 44px; padding: 0 12px; border: 0; border-radius: 12px; background: none; color: var(--fg); font: 500 14.5px/1.2 var(--font-sans); text-align: left; cursor: pointer; }
.palette-item[aria-selected="true"] { background: var(--control-hover); box-shadow: inset 0 0 0 1px var(--line-strong); }
.palette-item img { border-radius: 7px; }
.palette-ic { display: grid; place-items: center; flex: none; width: 28px; height: 28px; border-radius: 9px; background: var(--control); }
.palette-ic .i { width: 16px; height: 16px; color: var(--fg-muted); }
.palette-item[aria-selected="true"] .palette-ic .i { color: var(--accent); }
.palette-item .label { flex: 1; min-width: 0; }
.palette-item .hint { font-size: 12.5px; color: var(--fg-subtle); white-space: nowrap; }
.palette-item .enter .i { width: 15px; height: 15px; color: var(--accent); }
.palette-empty { padding: 28px; text-align: center; color: var(--fg-subtle); }
.palette-foot { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-top: 1px solid var(--line); font-size: 12px; color: var(--fg-faint); }
.palette-foot .i { width: 13px; height: 13px; }
@keyframes pal-in { from { opacity: 0; transform: translateY(-8px) scale(0.98); } }
@keyframes pal-out { to { opacity: 0; transform: translateY(-6px) scale(0.98); } }

@media (prefers-reduced-motion: reduce) {
  .cc-holo { animation: none; }
  .cord-card { transform: none; }
  .tile:hover { transform: none; }
  dialog.palette { animation: none; }
}
.feed-list, .inbox-list { list-style: none; margin: 0; padding: 0; }
.feed-list .grow, .inbox-list .grow { flex: 1; min-width: 0; }
.feed-list .more, .feed-list .what { overflow: hidden; text-overflow: ellipsis; }
.grow { flex: 1; min-width: 0; }
.view.hub, .hub-hero > * { min-width: 0; }
.view.hub { grid-template-columns: minmax(0, 1fr); }
.cc-top { flex-wrap: wrap; row-gap: 8px; }

/* 60-consent.css */
/* ── Écran de consentement OAuth (/authorize) ─────────────────────────── */
.consent-page { min-height: 100dvh; display: grid; place-items: center; padding: 28px 16px calc(28px + env(safe-area-inset-bottom)); }
.consent { width: min(460px, 100%); padding: 34px; border-radius: 30px; display: grid; gap: 24px; }
.link-visual { display: flex; align-items: center; justify-content: center; gap: 0; padding-top: 4px; }
.link-visual .logo { position: relative; width: 68px; height: 68px; border-radius: 20px; flex: none; box-shadow: 0 18px 40px -16px var(--accent-glow); }
.link-visual .logo img { width: 100%; height: 100%; border-radius: inherit; }
.link-visual .logo .fallback { width: 100%; height: 100%; border-radius: inherit; display: grid; place-items: center; background: var(--grad); color: #fff; font: 600 28px/1 var(--font-display); }
.link-visual .wire { position: relative; width: 92px; height: 2px; margin: 0 -2px; background: repeating-linear-gradient(90deg, var(--line-strong) 0 6px, transparent 6px 12px); }
.link-visual .wire::after { content: ""; position: absolute; top: -3px; left: 0; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 14px var(--accent-glow); animation: wire 1.8s var(--ease) infinite; }
.link-visual .wire .lock { position: absolute; inset: 0; margin: auto; display: grid; place-items: center; width: 30px; height: 30px; top: -14px; border-radius: 50%; background: var(--glass-strong); border: 1px solid var(--line-strong); color: var(--ok); }
.link-visual .wire .lock .i { width: 14px; height: 14px; }
@keyframes wire { 0% { left: 0; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { left: calc(100% - 8px); opacity: 0; } }
.consent h1 { font-size: 23px; text-align: center; letter-spacing: -0.025em; }
.consent h1 strong { font-weight: 600; }
.consent .sub { text-align: center; color: var(--fg-muted); font-size: 14.5px; margin-top: 8px; }
.account-chip { display: flex; align-items: center; gap: 12px; padding: 10px 10px 10px 12px; border-radius: 16px; background: var(--control); border: 1px solid var(--line); }
.account-chip .who { flex: 1; min-width: 0; }
.account-chip strong { display: block; font-size: 14px; }
.account-chip span { display: block; font-size: 12.5px; color: var(--fg-subtle); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.grants { display: grid; gap: 4px; margin: 0; padding: 0; list-style: none; }
.grants li { display: flex; align-items: center; gap: 12px; padding: 10px 0; font-size: 14.5px; }
.grants li + li { border-top: 1px solid var(--line); }
.grants li .icon-badge { width: 32px; height: 32px; border-radius: 10px; }
.grants li .icon-badge .i { width: 15px; height: 15px; }
.grants li small { display: block; color: var(--fg-subtle); font-size: 12.5px; }
.assure { display: flex; gap: 10px; align-items: flex-start; padding: 12px 14px; border-radius: 14px; background: var(--ok-soft); color: var(--fg-muted); font-size: 13px; }
.assure .i { color: var(--ok); margin-top: 1px; }
.consent .actions { display: grid; grid-template-columns: 1fr 1.4fr; gap: 10px; }
.consent .foot { text-align: center; font-size: 12.5px; color: var(--fg-subtle); }
.consent .foot code { color: var(--fg-muted); }
.consent .auth-card { padding: 0; max-width: none; background: none; border: 0; box-shadow: none; -webkit-backdrop-filter: none; backdrop-filter: none; }
.consent .auth-card::before, .consent .auth-card::after { display: none; }
.consent-loading { display: grid; gap: 16px; justify-items: center; text-align: center; padding: 20px 0; }
@media (max-width: 480px) {
  .consent { padding: 24px 20px; border-radius: 26px; }
  .consent .actions { grid-template-columns: 1fr; }
  .consent .actions .btn-primary { order: -1; }
}

/* ── Mouvement réduit ─────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 1ms !important; animation-iteration-count: 1 !important; transition-duration: 1ms !important; scroll-behavior: auto !important; }
  .orb, .grain, .qr-scan, .link-visual .wire::after, .pulse-dot::after { animation: none !important; }
}
`;

export const PORTAL_ASSETS = {"/assets/fonts/inter.woff2":["font/woff2","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"],"/assets/fonts/jetbrains-mono.woff2":["font/woff2","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"],"/assets/fonts/space-grotesk.woff2":["font/woff2","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"],"/assets/icon-180.png":["image/png","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"],"/assets/icon-32.png":["image/png","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"],"/assets/logos/bentocord.png":["image/png","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"],"/assets/logos/budgetcord.png":["image/png","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"],"/assets/logos/cordsuite.png":["image/png","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"],"/assets/logos/drivecord.png":["image/png","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"],"/assets/logos/gocord.png":["image/png","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"],"/assets/logos/linkcord.png":["image/png","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"],"/assets/logos/notecord.png":["image/png","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"],"/assets/logos/passcord.png":["image/png","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"],"/assets/logos/quizcord.png":["image/png","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"],"/assets/logos/tunecord.png":["image/png","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"]};
