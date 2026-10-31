// Met en ligne la demande en cours (ADR 0014) :
//   npm run publier -- --type patch|minor [--a-blanc]
//
// Étapes : prérequis, vérifications locales, version et journal des changements, PR, attente de la CI,
// fusion, suivi du déploiement et du contrôle du site. S'arrête au premier problème et l'explique.
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import {
  ErreurSimple,
  adresseDuSite,
  brancheCourante,
  dire,
  dormir,
  executerNpm,
  fichiersModifies,
  gh,
  git,
  terminerEnErreur,
  titre,
  verifierPrerequis,
} from './lib/outils.mjs';
import {
  changelogVide,
  dateDuJour,
  extraireNonPublie,
  incrementerVersion,
  publierChangelog,
} from './lib/versions.mjs';

const VERIFICATIONS = [
  ['format:check', 'le formatage du code'],
  ['lint', 'la qualité du code'],
  ['typecheck', 'les types'],
  ['test', 'les tests'],
  ['build', 'la construction du site'],
];

function lireOptions(argv) {
  const options = { type: 'patch', aBlanc: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--a-blanc') options.aBlanc = true;
    else if (arg === '--type') options.type = argv[(i += 1)];
    else if (arg.startsWith('--type=')) options.type = arg.slice('--type='.length);
    else
      throw new ErreurSimple(`Option inconnue : ${arg}`, 'Options : --type patch|minor, --a-blanc');
  }
  if (!['patch', 'minor'].includes(options.type)) {
    throw new ErreurSimple(
      `Type de version « ${options.type} » inconnu.`,
      'Utilise --type patch (texte, image, bug) ou --type minor (nouvelle fonction).',
    );
  }
  return options;
}

function exigerBrancheDeDemande() {
  const branche = brancheCourante();
  if (!branche.startsWith('demande/')) {
    throw new ErreurSimple(
      branche === 'main' || !branche
        ? 'Tu es sur la version en ligne (main) : rien ne doit y être modifié directement.'
        : `La branche « ${branche} » n'est pas une branche de demande.`,
      'Crée une branche pour ta demande : git switch -c demande/<sujet-en-minuscules-et-tirets>',
    );
  }
  return branche;
}

function exigerArbrePropre() {
  const modifies = fichiersModifies();
  if (modifies.length > 0) {
    throw new ErreurSimple(
      'Il reste des modifications non enregistrées :\n  ' + modifies.slice(0, 10).join('\n  '),
      "Enregistre-les d'abord (git add, puis git commit), puis relance la mise en ligne.",
    );
  }
}

/** Récupère `main`, vérifie qu'il y a quelque chose à publier et intègre les changements publiés entre-temps. */
function synchroniserAvecMain(branche) {
  const recuperation = git('fetch', 'origin', 'main', '--tags', '--quiet');
  if (recuperation.code !== 0) {
    throw new ErreurSimple('Impossible de joindre GitHub.', recuperation.erreur);
  }
  const enRetard = Number(git('rev-list', '--count', 'HEAD..origin/main').sortie || 0);
  if (enRetard > 0) {
    dire(
      `La version en ligne a avancé de ${enRetard} changement(s) depuis le début de ta demande : je les intègre.`,
    );
    const fusion = git('merge', '--no-edit', 'origin/main');
    if (fusion.code !== 0) {
      git('merge', '--abort');
      throw new ErreurSimple(
        'Des changements publiés entre-temps se mélangent mal avec les tiens.',
        "Rien n'a été publié. C'est un cas pour une personne technique.",
      );
    }
  }
  const enAvance = Number(git('rev-list', '--count', 'origin/main..HEAD').sortie || 0);
  if (enAvance === 0) {
    throw new ErreurSimple(
      `La branche « ${branche} » ne contient aucun changement par rapport à la version en ligne.`,
      "Il n'y a rien à publier.",
    );
  }
}

function lancerVerifications() {
  VERIFICATIONS.forEach(([script, libelle], index) => {
    titre(`Vérification ${index + 1}/${VERIFICATIONS.length} : ${libelle}`);
    let code = executerNpm(`run ${script}`);
    if (code !== 0 && script === 'format:check') {
      dire('Le formatage du code n’est pas bon : je le corrige automatiquement.');
      executerNpm('run format');
      if (fichiersModifies().length > 0) {
        git('add', '-A');
        git('commit', '-m', 'style: applique le formatage automatique');
      }
      code = executerNpm(`run ${script}`);
    }
    if (code !== 0) {
      throw new ErreurSimple(
        `La vérification de ${libelle} a échoué. Rien n'est publié.`,
        'Le détail est affiché juste au-dessus. Corrige le problème, enregistre, puis relance la mise en ligne.',
      );
    }
  });
}

function preparerVersion(type) {
  const chemin = 'CHANGELOG.md';
  const changelog = readFileSync(chemin, 'utf8');
  const notes = extraireNonPublie(changelog);
  if (changelogVide(notes)) {
    throw new ErreurSimple(
      'Le journal des changements est vide.',
      'Ajoute une ligne simple dans CHANGELOG.md, section « Non publié » (ce qui change pour les utilisateurs), enregistre, puis relance.',
    );
  }
  const version = incrementerVersion(
    JSON.parse(readFileSync('package.json', 'utf8')).version,
    type,
  );
  const etiquette = git('ls-remote', '--tags', 'origin', `refs/tags/v${version}`);
  if (etiquette.sortie) {
    throw new ErreurSimple(
      `La version v${version} existe déjà en ligne.`,
      'Il faut une personne technique.',
    );
  }
  return { chemin, changelog, notes, version };
}

function enregistrerVersion({ chemin, changelog, version }, branche) {
  writeFileSync(chemin, publierChangelog(changelog, version, dateDuJour()), 'utf8');
  if (executerNpm(`version ${version} --no-git-tag-version`) !== 0) {
    throw new ErreurSimple('Impossible de changer le numéro de version.');
  }
  git('add', 'CHANGELOG.md', 'package.json', 'package-lock.json');
  const commit = git('commit', '-m', `chore(release): v${version}`);
  if (commit.code !== 0)
    throw new ErreurSimple('Impossible d’enregistrer la version.', commit.erreur);
  const envoi = git('push', '--set-upstream', 'origin', branche);
  if (envoi.code !== 0)
    throw new ErreurSimple('Impossible d’envoyer ta demande sur GitHub.', envoi.erreur);
}

function ouvrirPr({ version, notes }, branche) {
  const corps = `Mise en ligne de la version v${version}.\n\n${notes}`;
  const creation = gh(
    'api',
    '-X',
    'POST',
    'repos/{owner}/{repo}/pulls',
    '-f',
    `title=release: v${version}`,
    '-f',
    `head=${branche}`,
    '-f',
    'base=main',
    '-f',
    `body=${corps}`,
    '--jq',
    '.number',
  );
  if (creation.code === 0 && creation.sortie) return Number(creation.sortie);
  // Une PR existe peut-être déjà pour cette branche (relance après un échec).
  const existante = gh(
    'pr',
    'list',
    '--head',
    branche,
    '--state',
    'open',
    '--json',
    'number',
    '--jq',
    '.[0].number',
  );
  if (existante.code === 0 && existante.sortie) return Number(existante.sortie);
  throw new ErreurSimple('Impossible de créer la demande de fusion sur GitHub.', creation.erreur);
}

async function attendreVerificationsAutomatiques(numero) {
  const debut = Date.now();
  while (Date.now() - debut < 20 * 60_000) {
    const reponse = gh('pr', 'checks', String(numero), '--json', 'name,bucket,link');
    let liste = [];
    try {
      liste = JSON.parse(reponse.sortie);
    } catch {
      // Pas encore de vérification enregistrée : on réessaie.
    }
    if (liste.length > 0) {
      const echecs = liste.filter((c) => c.bucket === 'fail' || c.bucket === 'cancel');
      if (echecs.length > 0) {
        throw new ErreurSimple(
          `La vérification automatique de GitHub a échoué (${echecs.map((c) => c.name).join(', ')}). Rien n'est publié.`,
          `Détail : ${echecs[0].link}\nCorrige le problème sur la branche, relance : la même demande de fusion sera réutilisée.`,
        );
      }
      if (liste.every((c) => c.bucket === 'pass' || c.bucket === 'skipping')) return;
    }
    await dormir(15_000);
  }
  throw new ErreurSimple(
    'La vérification automatique prend trop de temps.',
    'Réessaie dans quelques minutes.',
  );
}

function fusionner(numero, branche) {
  const fusion = gh(
    'api',
    '-X',
    'PUT',
    `repos/{owner}/{repo}/pulls/${numero}/merge`,
    '-f',
    'merge_method=merge',
    '--jq',
    '.merged',
  );
  if (fusion.code !== 0 || fusion.sortie !== 'true') {
    throw new ErreurSimple('GitHub a refusé la fusion.', fusion.erreur || fusion.sortie);
  }
  const sha = gh('api', `repos/{owner}/{repo}/pulls/${numero}`, '--jq', '.merge_commit_sha').sortie;
  // Remet l'ordinateur sur la version en ligne et range la branche terminée.
  git('switch', 'main');
  git('pull', '--ff-only', '--quiet', 'origin', 'main');
  git('branch', '-d', branche);
  return sha;
}

async function attendreFinExecution(identifiant) {
  const debut = Date.now();
  while (Date.now() - debut < 20 * 60_000) {
    const vue = gh('run', 'view', String(identifiant), '--json', 'status,conclusion');
    try {
      const { status, conclusion } = JSON.parse(vue.sortie);
      if (status === 'completed') return conclusion;
    } catch {
      // Réponse illisible : on réessaie.
    }
    await dormir(15_000);
  }
  return 'timed_out';
}

async function trouverExecution(filtre, delaiMs = 3 * 60_000) {
  const debut = Date.now();
  while (Date.now() - debut < delaiMs) {
    const liste = JSON.parse(
      gh(
        'run',
        'list',
        '--workflow',
        'deploy.yml',
        '--limit',
        '15',
        '--json',
        'databaseId,headSha,event',
      ).sortie || '[]',
    );
    const trouvee = liste.find(filtre);
    if (trouvee) return trouvee;
    await dormir(10_000);
  }
  return null;
}

async function suivreDeploiement(sha, version) {
  titre('Déploiement et contrôle du site');
  dire('GitHub publie le site, puis vérifie qu’il fonctionne. Cela prend environ deux minutes.');
  const execution = await trouverExecution((r) => r.headSha === sha && r.event === 'push');
  if (!execution) {
    throw new ErreurSimple(
      "Le déploiement n'a pas démarré.",
      'La fusion est faite, mais le site n’a pas été mis à jour. Lance : npm run diagnostic',
    );
  }
  const conclusion = await attendreFinExecution(execution.databaseId);
  if (conclusion === 'success') {
    const adresse = adresseDuSite();
    dire(`\nC'est en ligne : version v${version}${adresse ? ` sur ${adresse}` : ''}.`);
    return;
  }
  dire(
    '\nLe contrôle automatique a détecté un problème : la dernière version saine est remise en ligne.',
  );
  const retour = await trouverExecution(
    (r) => r.event === 'workflow_dispatch' && r.databaseId > execution.databaseId,
    2 * 60_000,
  );
  if (retour) {
    const resultat = await attendreFinExecution(retour.databaseId);
    dire(
      resultat === 'success'
        ? 'Le site est revenu à la version précédente : il fonctionne.'
        : 'Le retour à la version précédente a lui aussi échoué.',
    );
  }
  throw new ErreurSimple(
    `La version v${version} n'est pas restée en ligne.`,
    'Lance : npm run diagnostic. Si le problème persiste, il faut une personne technique.',
  );
}

export async function publier({ type = 'patch', aBlanc = false } = {}) {
  titre('Préparation');
  verifierPrerequis();
  const branche = exigerBrancheDeDemande();
  exigerArbrePropre();

  synchroniserAvecMain(branche);

  // Reprise : une précédente tentative a déjà enregistré la version (par exemple après une CI rouge corrigée).
  const reprise = git('log', 'origin/main..HEAD', '--format=%s')
    .sortie.split('\n')
    .map((sujet) => /^chore\(release\): v(\d+\.\d+\.\d+)$/.exec(sujet))
    .find(Boolean);

  lancerVerifications();
  const version = reprise ? { version: reprise[1], notes: '' } : preparerVersion(type);

  if (aBlanc) {
    titre('À blanc terminé');
    dire(
      `Tout est bon. La version qui serait publiée : v${version.version}. Rien n'a été modifié ni envoyé.`,
    );
    return;
  }

  titre(`Mise en ligne de la version v${version.version}`);
  if (reprise) {
    dire('Reprise de la mise en ligne déjà préparée.');
    const envoi = git('push', '--set-upstream', 'origin', branche);
    if (envoi.code !== 0)
      throw new ErreurSimple('Impossible d’envoyer ta demande sur GitHub.', envoi.erreur);
  } else {
    enregistrerVersion(version, branche);
  }
  const numero = ouvrirPr(version, branche);
  dire(
    `Demande de fusion n°${numero} créée. J'attends la vérification automatique de GitHub (environ une minute)...`,
  );
  await attendreVerificationsAutomatiques(numero);
  dire('Vérification automatique réussie.');
  const sha = fusionner(numero, branche);
  await suivreDeploiement(sha, version.version);
}

const estLance = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (estLance) {
  try {
    await publier(lireOptions(process.argv.slice(2)));
  } catch (erreur) {
    terminerEnErreur(erreur);
  }
}
