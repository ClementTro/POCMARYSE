// Annule la dernière mise en ligne (ADR 0014) :
//   npm run annuler [-- --a-blanc]
//
// 1. remet tout de suite en ligne la version précédente (redéploiement du tag précédent) ;
// 2. prépare une branche qui annule les changements de la dernière fusion, puis la publie comme une
//    nouvelle version (PR, CI, déploiement), pour que `main` ne contienne plus le défaut.
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import {
  ErreurSimple,
  dire,
  fichiersModifies,
  gh,
  git,
  terminerEnErreur,
  titre,
  verifierPrerequis,
} from './lib/outils.mjs';
import { ajouterNote, tagPrecedent } from './lib/versions.mjs';
import { publier } from './publier.mjs';

export async function annuler({ aBlanc = false } = {}) {
  titre('Préparation de l’annulation');
  verifierPrerequis();
  const modifies = fichiersModifies();
  if (modifies.length > 0) {
    throw new ErreurSimple(
      'Il reste des modifications non enregistrées sur cet ordinateur.',
      "Enregistre-les ou demande à une personne technique, puis relance l'annulation.",
    );
  }
  const recuperation = git('fetch', 'origin', 'main', '--tags', '--quiet');
  if (recuperation.code !== 0)
    throw new ErreurSimple('Impossible de joindre GitHub.', recuperation.erreur);

  const courante = JSON.parse(git('show', 'origin/main:package.json').sortie).version;
  const cible = tagPrecedent(courante, git('tag', '--list', 'v*').sortie.split('\n'));
  if (!cible) {
    throw new ErreurSimple(
      'Il n’y a pas de version précédente à remettre en ligne.',
      'Il faut une personne technique.',
    );
  }
  const fusion = git('rev-list', '--first-parent', '--merges', '-n', '1', 'origin/main').sortie;
  if (!fusion) throw new ErreurSimple('Je ne trouve pas la dernière mise en ligne à annuler.');
  const sujet = git('log', '-1', '--format=%s', fusion).sortie;

  dire(`Version actuelle : v${courante}. Version qui sera remise en ligne : ${cible}.`);
  dire(`Changement annulé : « ${sujet} ».`);
  if (aBlanc) {
    dire('À blanc : rien n’a été modifié ni envoyé.');
    return;
  }

  titre(`Retour immédiat à ${cible}`);
  const redeploiement = gh(
    'workflow',
    'run',
    'deploy.yml',
    '--ref',
    'main',
    '-f',
    `version=${cible}`,
  );
  if (redeploiement.code !== 0) {
    throw new ErreurSimple('Impossible de relancer la version précédente.', redeploiement.erreur);
  }
  dire(`GitHub remet ${cible} en ligne (environ deux minutes).`);

  titre('Annulation durable dans le code');
  const branche = `demande/annulation-v${courante}`;
  const creation = git('switch', '-c', branche, 'origin/main');
  if (creation.code !== 0)
    throw new ErreurSimple(`Impossible de créer la branche ${branche}.`, creation.erreur);
  const retrait = git('revert', '-m', '1', '--no-commit', fusion);
  if (retrait.code !== 0) {
    git('revert', '--abort');
    git('switch', 'main');
    git('branch', '-D', branche);
    throw new ErreurSimple(
      "L'annulation du code ne peut pas se faire toute seule.",
      `La version ${cible} est tout de même remise en ligne. Pour nettoyer le code, il faut une personne technique.`,
    );
  }
  // Le numéro de version et le journal gardent leur historique : l'annulation devient une nouvelle version.
  git('checkout', 'origin/main', '--', 'package.json', 'package-lock.json', 'CHANGELOG.md');
  writeFileSync(
    'CHANGELOG.md',
    ajouterNote(
      readFileSync('CHANGELOG.md', 'utf8'),
      `La version v${courante} est annulée : le site revient à ${cible}.`,
    ),
    'utf8',
  );
  git('add', '-A');
  const commit = git('commit', '-m', `fix: annule la version v${courante}`);
  if (commit.code !== 0)
    throw new ErreurSimple('Impossible d’enregistrer l’annulation.', commit.erreur);

  await publier({ type: 'patch' });
}

const estLance = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (estLance) {
  try {
    await annuler({ aBlanc: process.argv.includes('--a-blanc') });
  } catch (erreur) {
    terminerEnErreur(erreur);
  }
}
