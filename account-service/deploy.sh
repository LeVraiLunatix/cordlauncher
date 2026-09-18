#!/usr/bin/env bash
# Déploie le service Compte Cord sur le VPS Oracle : tests, envoi des
# fichiers, redémarrage PM2 (process « cord-account », Node 24 à part).
# La configuration (secrets compris) vit dans ~/cord-account/.env sur le VPS
# et n'est jamais envoyée d'ici.
set -euo pipefail

KEY="${CORD_VPS_KEY:-$HOME/.ssh/drivebot-oracle.key}"
HOST="${CORD_VPS_HOST:-ubuntu@141.253.108.13}"

cd "$(dirname "$0")"
node --test server.test.mjs
scp -q -i "$KEY" server.mjs start.mjs portal.html portal.js portal.css package.json "$HOST":cord-account/
ssh -i "$KEY" "$HOST" 'pm2 restart cord-account --update-env >/dev/null && sleep 2 && curl -fsS http://127.0.0.1:4319/health && echo'
