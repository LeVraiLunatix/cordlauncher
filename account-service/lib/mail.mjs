/**
 * Gabarits des emails du Compte Cord (HTML + texte brut).
 *
 * Contraintes des messageries : tableaux, styles en ligne, aucune feuille
 * externe ni script. Le dégradé a une couleur de repli (Outlook l'ignore).
 */

const esc = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const formatDate = (ms) =>
  new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Paris' }).format(new Date(ms));

const FONT = "'Inter','Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const DISPLAY = "'Space Grotesk','Inter','Segoe UI',Helvetica,Arial,sans-serif";
const MONO = "'JetBrains Mono',Consolas,Menlo,monospace";

function layout({ issuer, preheader, eyebrow, title, intro, code, button, details = [], outro, tone = 'brand' }) {
  const accent = tone === 'alert' ? '#f0617d' : '#8b5cff';
  const eyebrowColor = tone === 'alert' ? '#ff9aae' : '#b9a6ff';
  const rows = details
    .map(
      ([label, value]) => `<tr><td style="padding:10px 0;border-top:1px solid #2a2440;font:500 12px ${MONO};letter-spacing:.08em;text-transform:uppercase;color:#8e88a8;width:38%;vertical-align:top">${esc(label)}</td><td style="padding:10px 0;border-top:1px solid #2a2440;font:500 14px ${FONT};color:#ece8ff;vertical-align:top">${esc(value)}</td></tr>`,
    )
    .join('');
  const codeBlock = code
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 4px"><tr><td style="border-radius:16px;background:#1d1733;border:1px solid #3a2f63;padding:16px 26px;font:700 34px ${MONO};letter-spacing:.32em;color:#f7f5ff">${esc(code.slice(0, 3))}&nbsp;${esc(code.slice(3))}</td></tr></table>
       <p style="margin:8px 0 0;font:400 12px/1.6 ${FONT};color:#8e88a8">Tape ce code dans la fenêtre ouverte, ou utilise le bouton.</p>`
    : '';
  const cta = button
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px"><tr><td style="border-radius:14px;background:${accent};background-image:linear-gradient(120deg,#6e58f0,#b842ec 60%,#d24bef)"><a href="${esc(button.url)}" style="display:inline-block;padding:15px 26px;font:600 15px ${FONT};color:#ffffff;text-decoration:none;border-radius:14px">${esc(button.label)}</a></td></tr></table>
       <p style="margin:14px 0 0;font:400 12px/1.6 ${FONT};color:#8e88a8">Le bouton ne marche pas ? Copie ce lien :<br><a href="${esc(button.url)}" style="color:#b9a6ff;word-break:break-all">${esc(button.url)}</a></p>`
    : '';
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#0a0811">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0811;background-image:radial-gradient(ellipse at 15% 0%,#3a2380 0%,rgba(10,8,17,0) 55%)"><tr><td align="center" style="padding:40px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="padding:0 4px 22px"><table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="vertical-align:middle"><img src="${esc(issuer)}/assets/icon-180.png" width="40" height="40" alt="" style="display:block;border-radius:11px"></td>
<td style="vertical-align:middle;padding-left:12px;font:600 17px ${DISPLAY};color:#f3f0ff;letter-spacing:-.01em">Compte Cord</td>
</tr></table></td></tr>
<tr><td style="background:#141022;border:1px solid #2a2440;border-radius:24px;padding:36px 32px">
<p style="margin:0 0 12px;font:600 11px ${MONO};letter-spacing:.18em;text-transform:uppercase;color:${eyebrowColor}">${esc(eyebrow)}</p>
<h1 style="margin:0 0 14px;font:600 26px/1.2 ${DISPLAY};letter-spacing:-.02em;color:#f7f5ff">${esc(title)}</h1>
<p style="margin:0;font:400 15px/1.65 ${FONT};color:#c9c3de">${intro}</p>
${codeBlock}
${cta}
${rows ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:26px">${rows}</table>` : ''}
${outro ? `<p style="margin:24px 0 0;font:400 13px/1.65 ${FONT};color:#9d97b5">${outro}</p>` : ''}
</td></tr>
<tr><td style="padding:22px 8px 0;font:400 12px/1.6 ${FONT};color:#6f6988;text-align:center">
Compte Cord · l’identité de la suite Cord<br>
<a href="${esc(issuer)}" style="color:#9d8cf0;text-decoration:none">${esc(issuer.replace(/^https?:\/\//, ''))}</a> · Cet email est lié à la sécurité de ton compte, on ne t’envoie jamais de pub.
</td></tr>
</table></td></tr></table></body></html>`;
}

const strip = (html) => html.replace(/<[^>]+>/g, '');

/** Construit { subject, html, text } pour un type d'email. */
export function renderMail(kind, data, { issuer }) {
  const securityLink = `${issuer}/#securite`;
  const sessionsLink = `${issuer}/#appareils`;
  const when = formatDate(data.at ?? Date.now());
  const spec = (() => {
    switch (kind) {
      case 'verify':
        return {
          subject: data.code ? `${data.code.slice(0, 3)} ${data.code.slice(3)} — ton code Compte Cord` : 'Confirme ton adresse — Compte Cord',
          preheader: data.code ? `Ton code : ${data.code}. Il active ton compte Cord dans toute la suite.` : 'Un clic pour activer ton compte Cord dans toute la suite.',
          eyebrow: 'Bienvenue',
          title: 'Confirme ton adresse email',
          intro: 'Encore une étape : confirme que cette adresse est bien la tienne pour utiliser ton compte Cord dans les apps de la suite.',
          code: data.code,
          button: { label: 'Confirmer mon adresse', url: data.url },
          outro: 'Le code et le lien sont valables 15 minutes. Si tu n’as pas créé de compte Cord, ignore simplement cet email.',
        };
      case 'reset':
        return {
          subject: 'Réinitialise ton mot de passe — Compte Cord',
          preheader: 'Choisis un nouveau mot de passe pour ton compte Cord.',
          eyebrow: 'Récupération',
          title: 'Nouveau mot de passe',
          intro: 'Quelqu’un (toi, on espère) a demandé à réinitialiser le mot de passe de ton compte Cord. Le lien ci-dessous te permet d’en choisir un nouveau.',
          button: { label: 'Choisir un nouveau mot de passe', url: data.url },
          details: [['Demandé le', when], ['Depuis', data.device ?? 'Appareil inconnu']],
          outro: 'Valable 30 minutes, utilisable une fois. Toutes tes sessions seront fermées après le changement. Si tu n’es pas à l’origine de cette demande, ignore cet email : ton mot de passe actuel reste valable.',
        };
      case 'email-change':
        return {
          subject: 'Confirme ta nouvelle adresse — Compte Cord',
          preheader: 'Valide cette adresse pour ton compte Cord.',
          eyebrow: 'Changement d’adresse',
          title: 'Confirme ta nouvelle adresse',
          intro: `Tu as demandé à utiliser <strong style="color:#fff">${esc(data.newEmail)}</strong> pour ton compte Cord. Confirme-le pour finaliser le changement.`,
          button: { label: 'Utiliser cette adresse', url: data.url },
          outro: 'Valable 30 minutes. Si tu n’as rien demandé, ignore cet email : rien ne change.',
        };
      case 'email-changed':
        return {
          subject: 'Ton adresse a changé — Compte Cord',
          preheader: 'L’adresse de ton compte Cord vient d’être modifiée.',
          eyebrow: 'Alerte de sécurité',
          tone: 'alert',
          title: 'Adresse email modifiée',
          intro: 'L’adresse de ton compte Cord a été remplacée. Tu ne recevras plus nos emails ici.',
          details: [['Nouvelle adresse', data.newEmail], ['Date', when]],
          outro: 'Si ce n’est pas toi, réponds à cet email ou contacte le support de la suite Cord au plus vite.',
        };
      case 'new-login':
        return {
          subject: 'Nouvelle connexion à ton compte Cord',
          preheader: `Connexion depuis ${data.device ?? 'un nouvel appareil'}.`,
          eyebrow: 'Alerte de connexion',
          tone: 'alert',
          title: 'Nouvelle connexion détectée',
          intro: 'Ton compte Cord vient d’être utilisé depuis un appareil qu’on ne connaissait pas encore.',
          button: { label: 'Voir mes appareils', url: sessionsLink },
          details: [['Appareil', data.device ?? 'Inconnu'], ['Méthode', data.method ?? 'Mot de passe'], ['Adresse IP', data.ip ?? 'Inconnue'], ['Date', when]],
          outro: 'C’est toi ? Rien à faire. Sinon, ferme cette session depuis ton compte et change ton mot de passe tout de suite.',
        };
      case 'password-changed':
        return {
          subject: 'Mot de passe modifié — Compte Cord',
          preheader: 'Le mot de passe de ton compte Cord a changé.',
          eyebrow: 'Alerte de sécurité',
          tone: 'alert',
          title: 'Mot de passe modifié',
          intro: 'Le mot de passe de ton compte Cord vient d’être changé. Les autres sessions ont été déconnectées.',
          button: { label: 'Vérifier ma sécurité', url: securityLink },
          details: [['Date', when], ['Appareil', data.device ?? 'Inconnu']],
          outro: 'Si ce n’est pas toi, utilise « Mot de passe oublié » immédiatement pour reprendre la main.',
        };
      case 'mfa-enabled':
      case 'mfa-disabled':
        return {
          subject: kind === 'mfa-enabled' ? 'Double authentification activée — Compte Cord' : 'Double authentification désactivée — Compte Cord',
          preheader: 'Changement de la sécurité de ton compte Cord.',
          eyebrow: 'Sécurité',
          tone: kind === 'mfa-enabled' ? 'brand' : 'alert',
          title: kind === 'mfa-enabled' ? 'Double authentification activée' : 'Double authentification désactivée',
          intro:
            kind === 'mfa-enabled'
              ? 'Ton compte Cord demande désormais un code à usage unique en plus du mot de passe. Garde tes codes de secours en lieu sûr.'
              : 'Ton compte Cord ne demande plus de code à usage unique à la connexion.',
          button: { label: 'Ouvrir la sécurité du compte', url: securityLink },
          details: [['Date', when]],
          outro: 'Si ce n’est pas toi, change ton mot de passe tout de suite.',
        };
      case 'passkey-added':
        return {
          subject: 'Nouvelle passkey ajoutée — Compte Cord',
          preheader: 'Une clé d’accès a été ajoutée à ton compte Cord.',
          eyebrow: 'Sécurité',
          title: 'Nouvelle passkey',
          intro: 'Une passkey vient d’être ajoutée : elle permet de te connecter sans mot de passe.',
          button: { label: 'Gérer mes passkeys', url: securityLink },
          details: [['Nom', data.name ?? 'Passkey'], ['Date', when]],
          outro: 'Si ce n’est pas toi, supprime-la et change ton mot de passe.',
        };
      case 'account-deleted':
        return {
          subject: 'Ton compte Cord a été supprimé',
          preheader: 'Toutes tes données Compte Cord ont été effacées.',
          eyebrow: 'Au revoir',
          title: 'Compte supprimé',
          intro: 'Ton compte Cord et toutes les données associées (appareils, sessions, apps connectées, historique) ont été effacés. Les données propres à chaque app (fichiers Drivecord, coffre Passcord…) restent gérées par ces apps.',
          details: [['Date', when]],
          outro: 'Merci d’avoir essayé la suite Cord. Tu peux recréer un compte quand tu veux.',
        };
      default:
        throw new Error(`Email inconnu : ${kind}`);
    }
  })();
  const html = layout({ issuer, ...spec });
  const text = [
    spec.title,
    '',
    strip(spec.intro),
    ...(spec.code ? ['', `Ton code : ${spec.code}`] : []),
    ...(spec.button ? ['', `${spec.button.label} : ${spec.button.url}`] : []),
    ...(spec.details?.length ? ['', ...spec.details.map(([k, v]) => `${k} : ${v}`)] : []),
    ...(spec.outro ? ['', spec.outro] : []),
    '',
    `— Compte Cord · ${issuer}`,
  ].join('\n');
  return { subject: spec.subject, html, text };
}
