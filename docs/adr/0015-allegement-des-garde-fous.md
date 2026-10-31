# ADR 0015 — Allègement des garde-fous de l'agent

- **Statut** : accepté. Modifie l'[ADR 0014](0014-maintenance-par-l-association.md) (mode développeur, commandes,
  règles Cursor, mises à jour automatiques).
- **Date** : 2026-10-31

## Contexte

L'ADR 0014 a posé les garde-fous de la maintenance par l'association. Une relecture montre que plusieurs ajouts
alourdissent le projet sans protéger davantage :

- le **mode développeur** ne sert pas à l'association et ouvre une brèche : la phrase « je suis dev » suffit à
  lever les précautions de l'agent, et le fichier local qui l'active s'oublie ;
- les **commandes Cursor** (`/publier`, `/annuler`…) ne seront pas tapées par une personne non technique, qui
  écrit « mets en ligne » ; elles doublent les règles et risquent de diverger ;
- **treize fichiers de règles**, dont deux toujours actifs et six procédures que l'agent doit penser à ouvrir :
  plus il y a de texte, moins il est suivi ;
- les **mises à jour de routine** fusionnées et déployées seules changent la production sans demande.

Les vrais garde-fous restent mécaniques (ADR 0014) : `main` protégée, CI obligatoire, contrôle du site après
déploiement et retour automatique au dernier tag sain.

## Décision

- **Plus de mode développeur.** Les règles de l'agent valent pour tout le monde. Un développeur qui veut un
  autre comportement modifie les règles ; pour pousser sans PR, il désactive lui-même la protection de `main`.
- **Plus de commandes Cursor** : l'agent comprend les demandes écrites avec des mots simples.
- **Une règle toujours active** (`interlocuteur.mdc` : ton, questions, tri, arrêts, mise en ligne) et **trois
  procédures** chargées selon la demande : un problème (erreur ou lenteur), une modification (texte, image ou
  fonction), la mise en ligne et l'annulation.
- **Dependabot ne propose que les correctifs de sécurité** de npm, fusionnés seuls quand la CI est verte (sauf
  version majeure). Les autres mises à jour se font à la demande ; les montées majeures restent pour une
  personne technique. Les actions GitHub ne sont plus mises à jour automatiquement.
- **Documentation réduite** : `docs/MAINTENANCE.md` pour une personne technique (avec la liste des
  comportements à vérifier après une modification des règles) et `docs/GUIDE_ASSOCIATION.md`, une page courte.
- **Inchangé** : `npm run publier`, `npm run annuler`, `npm run diagnostic`, le contrôle du site, le tag de
  version saine, le retour arrière automatique, le rattrapage quotidien et la tâche anti-pause de Supabase.

## Alternatives envisagées

- **Garder le mode développeur en le cachant** (fichier seulement, sans phrase) : la brèche diminue, mais la
  complexité et l'oubli restent.
- **Supprimer `npm run annuler`** au profit d'un simple redéploiement du tag précédent : `main` garderait le
  défaut et la mise en ligne suivante le republierait. Le script est gardé.
- **Aucune mise à jour automatique** : plus simple, mais les failles connues resteraient ouvertes tant que
  personne ne les traite.

## Conséquences

- Moins de texte à maintenir et des règles plus courtes, donc mieux suivies par l'agent.
- Un développeur parle à un agent prudent, qui pose des questions et demande un « oui » avant de mettre en
  ligne ; c'est voulu.
- Les actions GitHub vieilliront : une personne technique devra les mettre à jour de temps en temps.
- Les tâches planifiées s'arrêtent après 60 jours sans activité dans le dépôt (ADR 0014) : c'est accepté pour
  une démo ; la base Supabase se relance alors à la main.
