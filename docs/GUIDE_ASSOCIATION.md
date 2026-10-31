# Guide : entretenir le site avec Cursor

Ce guide est pour toi, qui t'occupes du site de l'association. Pas besoin de savoir programmer : tu parles à
l'assistant de Cursor comme à un collègue, il fait le travail et te le montre avant de le publier.

## Pour commencer

1. Ouvre **Cursor**, puis le dossier du projet (**Fichier > Ouvrir un dossier** > `POCMARYSE`).
2. Ouvre le panneau de conversation et vérifie qu'il est en mode **Agent**.
3. Écris ce que tu veux, avec tes mots.

Si l'assistant dit que quelque chose n'est pas installé ou que tu n'es pas connectée à GitHub, ne cherche pas à
le réparer : demande à une personne technique (voir la fin de ce guide).

## Comment lui parler

Dis ce que tu voulais obtenir, ou ce que tu as vu, plutôt que comment faire.

| Tu peux dire | Ce qui va se passer |
|---|---|
| « Change le titre de l'accueil en "Le carnet de la famille" » | il te montre le résultat, puis te demande si tu veux le mettre en ligne |
| « Remplace la photo de la page Histoire » | il te demande la photo et vérifie qu'on a le droit de la publier |
| « La page Courses n'affiche plus rien » | il cherche d'abord la cause sans rien changer, te pose quelques questions, puis te propose une solution |
| « Le site est lent » | il mesure d'abord, te dit ce qu'il trouve et ce qu'il peut gagner |
| « J'aimerais pouvoir noter mes recettes sur 5 » | il te résume ce qu'il va faire en quelques lignes et attend ton accord |
| « Annule ce qu'on vient de faire » | il remet la version précédente en ligne |

## Les questions de l'assistant

Il te posera souvent des questions avant d'agir, avec des réponses à cocher. C'est normal : il préfère
bien comprendre plutôt que de se tromper. Tu peux toujours répondre **« Je ne sais pas »** : il t'aidera à trouver.

## Rien ne se publie sans ton accord

Une modification est d'abord préparée **chez toi**, l'assistant te la montre (captures d'écran), puis te demande :
**« Je mets en ligne ? »** Tant que tu ne réponds pas **oui**, le site visible par tout le monde ne change pas.

Après ton oui, compte quelques minutes : le site est vérifié automatiquement. Si quelque chose ne va pas à ce
moment-là, la version précédente revient toute seule.

## Se tromper n'est pas grave

- **« Annule »** : l'assistant remet la version précédente en ligne.
- Tout est enregistré : on peut retrouver n'importe quelle version.

## Ce que l'assistant ne fera pas seul

Pour ta sécurité, il s'arrête et te conseille une personne technique quand tu lui demandes :

- de stocker de nouvelles informations (une nouvelle liste, de nouveaux champs dans les comptes…) ;
- de changer la connexion ou les comptes ;
- d'ajouter un paiement, l'envoi d'e-mails, une application pour téléphone ;
- de supprimer des données ;
- de remplacer ou réutiliser les photos de Maryse ;
- une grosse mise à jour du site.

Il peut quand même t'expliquer pourquoi, te proposer une version plus simple, et noter l'idée pour plus tard.

## Qui appeler quand l'assistant est dépassé

Il te le dira : « Il faut une personne technique ». Il te préparera un petit résumé à envoyer. Garde ici ses coordonnées :

- Personne technique de confiance : ______________________

Tu peux aussi lui demander « Fais le point sur le site » pour savoir si tout va bien (cela ne change rien).

## Pour la personne technique

Tout est expliqué dans [`MAINTENANCE.md`](MAINTENANCE.md). Pour débrancher les protections prévues pour les
non-techniciens sur son propre ordinateur : `npm run mode-dev` (et `npm run mode-asso` pour les remettre).
