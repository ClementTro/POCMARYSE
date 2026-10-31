# Maintenance et exploitation

Guide pour l'agent et pour toute personne technique qui reprend le site. Décisions : [ADR 0014](adr/0014-maintenance-par-l-association.md).
Pour la personne qui entretient le site avec Cursor : [`GUIDE_ASSOCIATION.md`](GUIDE_ASSOCIATION.md).

## Prérequis sur l'ordinateur

| Outil | Pourquoi | Vérification |
|---|---|---|
| Node.js 22 (`.nvmrc`) | lancer le site et les scripts | `node --version` |
| Git, avec nom et e-mail | enregistrer les modifications | `git config user.name` et `git config user.email` |
| GitHub CLI (`gh`), connecté | PR, déploiement, diagnostic | `gh auth status` |
| Cursor | l'agent de maintenance | |

Première installation (une personne technique, une seule fois) :

```bash
git clone https://github.com/<propriétaire>/POCMARYSE.git
cd POCMARYSE
npm install
gh auth login        # compte GitHub qui a les droits d'administration du dépôt
git config --global user.name "Nom"
git config --global user.email "adresse@exemple.fr"
npm run diagnostic   # doit afficher « Aucun problème détecté »
```

Les scripts fonctionnent à l'identique sous Windows, macOS et Linux.

## Cycle d'une demande

1. L'agent comprend la demande (questions, reformulation) et crée une branche `demande/<sujet>`.
2. Il modifie, teste (`npm run lint && npm run typecheck && npm run test`), met à jour `CHANGELOG.md` (« Non publié »).
3. Il montre le résultat (captures d'écran) et demande « Je mets en ligne ? ».
4. Sur un « oui » : `npm run publier -- --type patch|minor`.
5. GitHub vérifie, fusionne, déploie, contrôle le site, pose le tag `vX.Y.Z`.

`npm run publier -- --a-blanc` fait toutes les vérifications sans rien publier.

## Ce que fait `npm run publier`

1. Prérequis (git, gh connecté, identité git), branche `demande/*`, rien de non enregistré.
2. Intègre les changements publiés entre-temps sur `main` (s'arrête en cas de conflit).
3. Formatage (corrigé automatiquement si besoin), lint, types, tests, build.
4. Version suivante (`patch` ou `minor`), `CHANGELOG.md` rangé sous `[X.Y.Z] - date`, commit `chore(release): vX.Y.Z`, push.
5. PR vers `main` (via `gh api`), attente du check « Lint, types, tests, build ».
6. Fusion (merge commit), retour sur `main` en local.
7. Suivi de `deploy.yml` : déploiement, contrôle du site, tag.

Si la CI est rouge, le script s'arrête sans fusionner. Après correction sur la branche, relancer
`npm run publier` reprend la même PR.

## Ce que fait `deploy.yml`

```
push sur main ─► build ─► publication ─► contrôle du site ─┬─ OK ──► tag vX.Y.Z (= dernière version saine)
                                                           └─ échec ► redéploie le dernier tag (retour arrière)
```

- Le **contrôle** (`scripts/verifier-site.mjs`) vérifie : accueil, fichiers du site, adresse Supabase présente
  dans le site publié (sinon les variables du dépôt manquaient au build), adresse profonde (`404.html`).
  Supabase qui ne répond pas ou `ping()` absent sont des **avertissements** : un retour arrière ne répare pas
  un projet en pause.
- **Retour arrière manuel** : onglet Actions > « Déploiement GitHub Pages » > Run workflow, champ `version` = `v1.0.1`.
  Le workflow reste lancé depuis `main` mais déploie le code de ce tag.
- **Test du retour arrière** : Run workflow avec `simuler_echec` coché. Le contrôle échoue exprès, le dernier tag est redéployé.
- **Rattrapage quotidien** (05:30 UTC) : déploie `main` s'il n'a jamais été tenté (fusion automatique de Dependabot).

## Annuler

`npm run annuler` : remet en ligne le tag précédent tout de suite (redéploiement), puis crée la branche
`demande/annulation-vX.Y.Z` qui annule la dernière fusion (`git revert -m 1`), et la publie en patch. Le numéro de
version et le journal gardent leur historique. En cas de conflit, le script s'arrête : la version précédente est
déjà en ligne, le nettoyage du code relève d'une personne technique.

## Mode développeur

`npm run mode-dev` crée `.cursor/mode-developpeur` (ignoré par git) : l'agent devient concis et technique, sans
questions systématiques, captures ni « oui » avant mise en ligne. `npm run mode-asso` le retire. Les contraintes
du projet, la CI et le flux par PR restent. Pour pousser sans PR, il faut désactiver soi-même la protection de
`main` dans **Settings > Branches** (à remettre ensuite).

## Pannes

| Symptôme | Cause probable | Que faire |
|---|---|---|
| `publier` : « gh n'est pas installé / connecté » | outil absent | installer GitHub CLI, `gh auth login` |
| `publier` : vérification locale en échec | lint, types, test ou build | lire le détail, corriger, relancer |
| `publier` : CI rouge sur la PR | un test ou une règle échoue chez GitHub | ouvrir le lien affiché, corriger sur la branche, relancer |
| `publier` : « des changements se mélangent mal » | conflit avec `main` | résoudre à la main (personne technique) |
| Déploiement rouge au contrôle | site cassé ou variables absentes | le retour arrière est automatique ; `npm run diagnostic` pour la cause |
| Écran « Backend non configuré » | variables `VITE_SUPABASE_*` absentes du dépôt | `gh variable set ...` (voir `SUPABASE_SETUP.md`), relancer le déploiement |
| Connexion impossible, erreurs réseau | projet Supabase en pause | le relancer dans le tableau de bord Supabase |
| Tâche « Garder Supabase actif » rouge | projet en pause, ou `0002_ping.sql` non appliquée | relancer le projet, ou coller la migration dans Supabase |
| Aucune tâche planifiée depuis longtemps | GitHub désactive les tâches planifiées après 60 jours sans activité | onglet Actions : réactiver le workflow |
| Une mise à jour automatique reste ouverte | version majeure, ou CI rouge | personne technique |

## Mises à jour des dépendances

- **Dependabot** (`.github/dependabot.yml`) : chaque lundi, corrections et mises à jour mineures regroupées ; GitHub
  Actions chaque mois. Les montées de version majeures sont ignorées.
- `dependabot-auto-merge.yml` active la fusion automatique ; GitHub fusionne quand la CI est verte, puis le
  rattrapage quotidien ou le push déploie et contrôle le site. Ces fusions ne créent pas de tag : le retour arrière
  restaure alors le dernier tag.
- Montée majeure (React, Vite, Tailwind, Node, Supabase) : chantier technique, sur une branche, avec ADR si la
  stack change. Node 22 reçoit ses corrections de sécurité jusqu'en avril 2027.

## Réglages GitHub attendus

À vérifier si un comportement surprenant apparaît (Settings du dépôt) :

- **Branches** : règle sur `main`, y compris pour les administrateurs : PR obligatoire, check « Lint, types, tests, build »
  obligatoire, force push et suppression interdits.
- **General** : fusion par merge commit autorisée, fusion automatique autorisée, suppression des branches fusionnées.
- **Pages** : source « GitHub Actions ».
- **Variables** (Actions) : `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Jamais de clé `service_role`.
