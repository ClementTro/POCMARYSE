// Applique les espaces insécables de la typographie française aux traductions FR :
// avant ? ! : ; et à l'intérieur des guillemets « ». Usage : npm run typo:fr
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const NBSP = '\u00a0';
const racine = resolve(import.meta.dirname, '..', 'src');

function fichiersFr(dossier) {
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = join(dossier, nom);
    if (statSync(chemin).isDirectory()) return fichiersFr(chemin);
    const estFr =
      nom === 'fr.json' || (dossier.endsWith(join('locales', 'fr')) && nom.endsWith('.json'));
    return estFr ? [chemin] : [];
  });
}

for (const fichier of fichiersFr(racine)) {
  const avant = readFileSync(fichier, 'utf8');
  const apres = avant
    .replace(/« /g, `«${NBSP}`)
    .replace(/ »/g, `${NBSP}»`)
    .replace(/ ([?!:;])/g, `${NBSP}$1`);
  if (apres !== avant) {
    writeFileSync(fichier, apres);
    console.log(`typographie corrigée : ${fichier}`);
  }
}
