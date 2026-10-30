// Échoue si un fichier suivi par git n'est pas en UTF-8 valide (ex. réécrit en ANSI par PowerShell 5).
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

const invalides = fichiers.filter((fichier) => {
  try {
    decodeur.decode(readFileSync(fichier));
    return false;
  } catch {
    return true;
  }
});

if (invalides.length) {
  console.error(`Fichiers qui ne sont pas en UTF-8 valide :\n  ${invalides.join('\n  ')}`);
  process.exit(1);
}
