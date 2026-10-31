// Active ou retire le mode développeur de l'agent (ADR 0014) :
//   npm run mode-dev    -> crée .cursor/mode-developpeur (fichier local, jamais versionné)
//   npm run mode-asso   -> le supprime
//   node scripts/mode.mjs statut
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const FICHIER = '.cursor/mode-developpeur';
const action = process.argv[2];

if (action === 'dev') {
  mkdirSync(dirname(FICHIER), { recursive: true });
  writeFileSync(
    FICHIER,
    'Mode développeur actif sur cet ordinateur (fichier local, non versionné).\nPour revenir au mode association : npm run mode-asso\n',
    'utf8',
  );
  console.log(
    'Mode développeur activé : l’agent est concis et technique, sans les garde-fous pour non-techniques.',
  );
} else if (action === 'asso') {
  rmSync(FICHIER, { force: true });
  console.log(
    'Mode association rétabli : l’agent parle simplement, pose des questions et demande ton accord.',
  );
} else if (action === 'statut') {
  console.log(existsSync(FICHIER) ? 'Mode développeur actif.' : 'Mode association actif.');
} else {
  console.error('Usage : node scripts/mode.mjs dev | asso | statut');
  process.exit(1);
}
