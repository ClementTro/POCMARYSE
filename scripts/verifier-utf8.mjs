// Échoue si un fichier suivi par git n'est pas en UTF-8 valide (ex. réécrit en ANSI par PowerShell 5)
// ou s'il contient de l'UTF-8 encodé deux fois (« Ã© » au lieu de « é »).
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { extname } from 'node:path';

const EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.json',
  '.css',
  '.html',
  '.md',
  '.mdc',
  '.sql',
  '.yml',
]);
const decodeur = new TextDecoder('utf-8', { fatal: true });

const fichiers = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {
  encoding: 'utf8',
})
  .split('\n')
  .filter((f) => EXTENSIONS.has(extname(f)));

// Octet de tête UTF-8 (Ã, Â, â) relu en Latin-1 et suivi d'un octet de continuation.
const DOUBLE_ENCODAGE = /[\u00c2\u00c3\u00e2][\u0080-\u00bf]/;

const invalides = [];
const doubles = [];
for (const fichier of fichiers) {
  if (fichier.startsWith('scripts/verifier-utf8')) continue;
  try {
    const texte = decodeur.decode(readFileSync(fichier));
    if (DOUBLE_ENCODAGE.test(texte)) doubles.push(fichier);
  } catch {
    invalides.push(fichier);
  }
}

if (invalides.length) {
  console.error(`Fichiers qui ne sont pas en UTF-8 valide :\n  ${invalides.join('\n  ')}`);
}
if (doubles.length) {
  console.error(`Fichiers avec du texte encodé deux fois (« Ã© ») :\n  ${doubles.join('\n  ')}`);
}
if (invalides.length || doubles.length) process.exit(1);
