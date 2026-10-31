// Outils communs aux scripts publier, annuler et diagnostic : lancer des commandes, afficher des messages
// en français simple, vérifier les prérequis. Fonctionne sous Windows, macOS et Linux.
import { spawnSync } from 'node:child_process';

/** Lance un programme sans passer par un shell. Retourne { code, sortie, erreur, absent }. */
export function executer(commande, args = [], { afficher = false } = {}) {
  const resultat = spawnSync(commande, args, {
    encoding: 'utf8',
    stdio: afficher ? 'inherit' : 'pipe',
    maxBuffer: 64 * 1024 * 1024,
  });
  return {
    code: resultat.status ?? 1,
    sortie: (resultat.stdout ?? '').trim(),
    erreur: (resultat.stderr ?? '').trim(),
    absent: resultat.error?.code === 'ENOENT',
  };
}

export const git = (...args) => executer('git', args);
export const gh = (...args) => executer('gh', args);

/** Lance un script npm en affichant sa sortie. Retourne le code de sortie. */
export function executerNpm(arguments_) {
  // npm est un fichier .cmd sous Windows : il faut un shell. La commande est toujours écrite en dur ici.
  const resultat = spawnSync(`npm ${arguments_}`, { shell: true, stdio: 'inherit' });
  return resultat.status ?? 1;
}

/** Erreur dont le message est destiné telle quelle à la personne qui lit le terminal. */
export class ErreurSimple extends Error {
  constructor(message, aide = '') {
    super(message);
    this.aide = aide;
  }
}

export function dormir(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function titre(texte) {
  console.log(`\n=== ${texte} ===`);
}

export function dire(texte) {
  console.log(texte);
}

/** Affiche une erreur simple et termine le programme. */
export function terminerEnErreur(erreur) {
  if (erreur instanceof ErreurSimple) {
    console.error(`\nPROBLÈME : ${erreur.message}`);
    if (erreur.aide) console.error(erreur.aide);
  } else {
    console.error(`\nPROBLÈME INATTENDU : ${erreur?.message ?? erreur}`);
    console.error('Ce cas dépasse ce que le script sait gérer : il faut une personne technique.');
  }
  process.exit(1);
}

/** Vérifie git, gh (installé et connecté) et l'identité git. Lève une ErreurSimple sinon. */
export function verifierPrerequis() {
  if (git('--version').absent) {
    throw new ErreurSimple(
      "Git n'est pas installé sur cet ordinateur.",
      'Une personne technique doit installer Git (https://git-scm.com).',
    );
  }
  if (gh('--version').absent) {
    throw new ErreurSimple(
      "L'outil GitHub (gh) n'est pas installé sur cet ordinateur.",
      'Une personne technique doit installer GitHub CLI (https://cli.github.com), puis lancer : gh auth login',
    );
  }
  if (gh('auth', 'status').code !== 0) {
    throw new ErreurSimple(
      "Cet ordinateur n'est pas connecté à GitHub.",
      'Une personne technique doit lancer : gh auth login',
    );
  }
  if (!git('config', 'user.name').sortie || !git('config', 'user.email').sortie) {
    throw new ErreurSimple(
      'Git ne connaît pas ton nom ou ton adresse e-mail.',
      'Une personne technique doit lancer : git config --global user.name "Nom" et git config --global user.email "adresse"',
    );
  }
  if (git('remote', 'get-url', 'origin').code !== 0) {
    throw new ErreurSimple("Ce dossier n'est pas relié à GitHub (pas de dépôt « origin »).");
  }
}

export function brancheCourante() {
  return git('branch', '--show-current').sortie;
}

export function fichiersModifies() {
  const { sortie } = git('status', '--porcelain');
  return sortie ? sortie.split('\n') : [];
}

/** Lit un JSON retourné par une commande gh. Retourne null en cas d'échec. */
export function ghJson(...args) {
  const { code, sortie } = gh(...args);
  if (code !== 0 || !sortie) return null;
  try {
    return JSON.parse(sortie);
  } catch {
    return null;
  }
}

/** Adresse publique du site (GitHub Pages), ou chaîne vide. */
export function adresseDuSite() {
  const { code, sortie } = gh('api', 'repos/{owner}/{repo}/pages', '--jq', '.html_url');
  return code === 0 ? sortie : '';
}

/** Variables du dépôt GitHub (publiques) : { NOM: valeur }. */
export function variablesDuDepot() {
  const liste = ghJson('variable', 'list', '--json', 'name,value') ?? [];
  return Object.fromEntries(liste.map((v) => [v.name, v.value]));
}
