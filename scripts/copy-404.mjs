// GitHub Pages sert 404.html pour toute URL inconnue : en y copiant index.html,
// l'application démarre sur n'importe quelle route profonde (ADR 0006).
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve(import.meta.dirname, '..', 'dist');
const index = resolve(dist, 'index.html');

if (!existsSync(index)) {
  console.error('dist/index.html introuvable : lancer le build avant ce script.');
  process.exit(1);
}

copyFileSync(index, resolve(dist, '404.html'));
console.log('dist/404.html créé.');
