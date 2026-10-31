// État de santé du projet, en lecture seule : npm run diagnostic
// Affiche en français simple la CI, le dernier déploiement, le site, Supabase et les versions.
import { readFileSync } from 'node:fs';
import {
  adresseDuSite,
  brancheCourante,
  dire,
  executer,
  fichiersModifies,
  gh,
  ghJson,
  git,
  titre,
  variablesDuDepot,
} from './lib/outils.mjs';
import { trierTags } from './lib/versions.mjs';
import { verifierSite } from './lib/verification.mjs';

let problemes = 0;
function ligne(etat, nom, detail = '') {
  const marque = etat === true ? '[OK]       ' : etat === false ? '[PROBLÈME] ' : '[INFO]     ';
  if (etat === false) problemes += 1;
  dire(`${marque} ${nom}${detail ? ` : ${detail}` : ''}`);
}

function libelleExecution(run) {
  if (!run) return 'aucune exécution trouvée';
  if (run.status !== 'completed') return `en cours (${run.status})`;
  return `${run.conclusion} le ${new Date(run.createdAt).toLocaleString('fr-FR')} (${run.displayTitle})`;
}

titre('Outils');
const outilGit = executer('git', ['--version']);
ligne(!outilGit.absent, 'Git', outilGit.absent ? 'non installé' : outilGit.sortie);
const outilGh = executer('gh', ['--version']);
if (outilGh.absent) {
  ligne(false, 'GitHub CLI (gh)', 'non installé : une personne technique doit l’installer');
  process.exit(0);
}
const connecte = gh('auth', 'status').code === 0;
ligne(connecte, 'Connexion à GitHub', connecte ? 'connecté' : 'non connecté (gh auth login)');
if (!connecte) process.exit(0);

titre('Projet');
const depot = ghJson('repo', 'view', '--json', 'nameWithOwner,url');
ligne(Boolean(depot), 'Dépôt GitHub', depot ? depot.url : 'introuvable depuis ce dossier');
const version = JSON.parse(readFileSync('package.json', 'utf8')).version;
const tags = trierTags(git('tag', '--list', 'v*').sortie.split('\n'));
ligne(null, 'Version dans le code', version);
ligne(null, 'Dernière version saine (tag)', tags[0] ?? 'aucune');
ligne(null, 'Branche actuelle', brancheCourante() || 'inconnue');
const modifies = fichiersModifies();
ligne(
  null,
  'Modifications non enregistrées',
  modifies.length === 0 ? 'aucune' : `${modifies.length} fichier(s)`,
);

titre('Vérifications et déploiement GitHub');
for (const [fichier, nom] of [
  ['ci.yml', 'Dernière vérification automatique (CI)'],
  ['deploy.yml', 'Dernier déploiement'],
]) {
  const [run] =
    ghJson(
      'run',
      'list',
      '--workflow',
      fichier,
      '--limit',
      '1',
      '--json',
      'status,conclusion,displayTitle,createdAt',
    ) ?? [];
  const ok = run ? (run.status !== 'completed' ? null : run.conclusion === 'success') : null;
  ligne(ok, nom, libelleExecution(run));
}
const garde =
  ghJson(
    'run',
    'list',
    '--workflow',
    'garder-actif.yml',
    '--limit',
    '1',
    '--json',
    'status,conclusion,createdAt',
  ) ?? [];
if (garde[0]) {
  ligne(
    garde[0].conclusion === 'success' ? true : garde[0].status === 'completed' ? false : null,
    'Réveil hebdomadaire de Supabase',
    `${garde[0].conclusion || garde[0].status} le ${new Date(garde[0].createdAt).toLocaleDateString('fr-FR')}`,
  );
}

const ouvertes = ghJson('pr', 'list', '--state', 'open', '--json', 'number,title,author') ?? [];
const dependabot = ouvertes.filter((p) => p.author?.login?.includes('dependabot'));
ligne(
  null,
  'Demandes de fusion ouvertes',
  `${ouvertes.length} (dont ${dependabot.length} mise(s) à jour automatique(s))`,
);

titre('Variables du dépôt');
const variables = variablesDuDepot();
for (const nom of ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']) {
  ligne(
    Boolean(variables[nom]),
    nom,
    variables[nom] ? 'définie' : 'ABSENTE : le site ne pourra pas se connecter à Supabase',
  );
}

titre('Site en ligne');
const adresse = adresseDuSite();
if (!adresse) {
  ligne(false, 'Adresse du site', 'GitHub Pages ne répond pas pour ce dépôt');
} else {
  ligne(null, 'Adresse du site', adresse);
  const { resultats } = await verifierSite({
    siteUrl: adresse,
    supabaseUrl: variables.VITE_SUPABASE_URL ?? '',
    anonKey: variables.VITE_SUPABASE_ANON_KEY ?? '',
  });
  for (const r of resultats)
    ligne(
      r.ok ? true : r.bloquant ? false : null,
      r.nom,
      r.ok ? r.detail : `${r.detail}${r.bloquant ? '' : ' (avertissement)'}`,
    );
}

dire(
  problemes === 0
    ? '\nAucun problème détecté.'
    : `\n${problemes} problème(s) détecté(s). Le détail est ci-dessus ; ne corrige rien avant d'avoir compris la cause.`,
);
