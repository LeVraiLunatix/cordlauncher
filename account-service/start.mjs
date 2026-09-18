// Point d'entrée de production (PM2) : server.mjs ne démarre seul que lancé
// directement, or PM2 le charge depuis son propre conteneur.
import { startFromEnv } from './server.mjs';

startFromEnv();
