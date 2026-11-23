# Phase 10 — Le joueur

> Statut : **conception validée par délégation** (D-147). Le porteur a autorisé Claude Code, pour la nuit du 23 au 24/11/2026, à concevoir, coder et tester la phase 10 sans validation intermédiaire. Relecture prévue le 24/11/2026. Tout choix ci-dessous peut être remis en cause à cette relecture.

## 1. Objectif

Prendre la tête d'une écurie et la diriger sur plusieurs saisons, depuis un téléphone ou un ordinateur, avec les **mêmes commandes et les mêmes règles que l'IA** (D-012). Les écrans sont les premiers écrans « joueur ». L'interface de diagnostic reste disponible pour la conception.

Ce que la phase 10 **ne fait pas** : course en direct et consignes en course (phase 13), conception de la voiture (phase 12), médias (phase 11), carrière du manager après un licenciement (phase 14), direction artistique (phase 15).

## 2. Le joueur dans le monde

### 2.1 Prise de fonction (commande `joueur.prendre_ecurie`)

- Paramètres : écurie, prénom et nom du manager.
- Valide une seule fois par partie, si aucune écurie n'est déjà dirigée par un joueur.
- Le joueur devient le **team principal** de l'écurie : une personne est créée (poste `team_principal`, drapeau `joueur`). Ses traits et ses valeurs sont neutres (10). Ses compétences de départ sont celles d'un team principal moyen (`balance/joueur.ts`). Le joueur est une personne comme les autres : les autres personnages ont une relation avec lui, il peut être jugé par le conseil (D-089).
- Le team principal en place quitte l'écurie : son contrat prend fin et il redevient libre, ce qui produit un événement (cause : la prise de fonction). Le joueur reprend son salaire et signe pour 3 saisons.
- L'écurie est marquée `pilotee`, et le monde garde la trace du joueur (`monde.joueur` : personne, écurie, depuis, état).

### 2.2 Délégations (commande `joueur.deleguer`)

Le joueur choisit ce qu'il gère lui-même. Un domaine délégué est décidé par son équipe, **avec exactement les règles de l'IA**. Domaines :

| Domaine | Ce que l'IA fait à sa place s'il est délégué | Personne qui décide |
| --- | --- | --- |
| `pilotes` | Prolongations des titulaires, offres du marché des pilotes, contre-attaques, réponses aux demandes d'augmentation des pilotes | Team principal (règles de l'IA) |
| `personnel` | Prolongations du personnel, recrutements, réponses aux demandes de départ et d'augmentation, ruptures négociées | Team principal (règles de l'IA) |
| `recherche` | Programmes de recherche (déjà en 8b) | Directeur technique |
| `stands` | Plan d'entraînement et recrutement des stands (déjà en 8d) | Directeur sportif |
| `academie` | Capacité de l'académie, missions de repérage | Team principal (règles de l'IA) |
| `politique` | Votes du règlement, élection et votes de la fédération, lobbying | Team principal (règles de l'IA) |

- Au départ, **tous les domaines sont délégués** sauf `pilotes` : le joueur découvre le jeu sans être submergé.
- Une écurie de l'IA n'a pas de délégations : tout est décidé par l'IA.
- **Filet de sécurité** (le même que pour l'IA) : un poste encore vacant au moment du recrutement de dernier recours est pourvu par un intérim d'1 à 2 ans. Une écurie n'est jamais sans directeur ni sans pilote. Le joueur a eu jusque-là le marché pour agir.
- Ce qui reste décidé par l'administration de l'écurie en phase 10, faute d'écran : sponsors, projets d'infrastructure, emprunts. Le budget de développement est proposé par la direction financière (règle de l'IA) et le joueur peut le modifier (§2.3).

### 2.3 Nouvelles commandes

- `joueur.prendre_ecurie`, `joueur.deleguer` (§2.1, §2.2).
- `budget.developpement` : le team principal fixe le budget de développement de l'année, de 0 au maximum que permet la trésorerie (même borne que l'IA). Le dépassement volontaire du plafond reste possible, avec les mêmes sanctions.

Toutes les autres actions du joueur utilisent des commandes **qui existent déjà** et que l'IA utilise : prolongation, non-prolongation, licenciement, réponses aux demandes, interactions (soutenir, critiquer, féliciter…), offres du marché, programmes de recherche, plan des stands, votes, lobbying, missions de repérage.

### 2.4 Décisions en attente

Une fonction de consultation du moteur (sans effet sur l'état) liste ce qui attend le joueur :

- contre-offre d'une négociation de prolongation ;
- demande d'augmentation ;
- demande de départ (domaine `personnel` non délégué) ;
- contrats qui finissent cette saison sans décision (avant la semaine des négociations) ;
- postes vacants pour la saison suivante ;
- votes ouverts (règlement, fédération) si `politique` n'est pas délégué.

Chaque décision indique son échéance et la conséquence d'une absence de réponse (par exemple : « sans réponse en 8 semaines, la demande vaut refus »).

### 2.5 Ce que le joueur voit

Le joueur ne voit **jamais** les traits ni les valeurs cachés.
- Il voit les compétences de ses propres employés, arrondies.
- Pour les autres personnes, il voit le niveau public et le potentiel estimé, avec son incertitude (système d'estimation de la phase 6a).
- Les événements affichés sont ceux qui sont publics, ou connus de son écurie (`connuPar`, phase 8c).

### 2.6 Licenciement du joueur

Le conseil juge le joueur comme les autres (D-089). Licencié, il perd la main : l'écurie repasse à l'IA et `monde.joueur.etat` devient `licencie`. L'écran de fin de partie montre le bilan. La suite (trouver un autre poste) est la phase 14.

## 3. Sauvegarde

- Format 25 : champ `monde.joueur` et délégations de l'écurie. Migration 24 → 25 (aucune donnée à transformer) et test.
- Les commandes du joueur sont journalisées (mécanisme existant) : une partie peut être rejouée à l'identique.
- Dans le navigateur, la sauvegarde existante est réutilisée : IndexedDB, gzip, sauvegarde de secours. Sauvegarde automatique à chaque fin de saison et sauvegarde manuelle.

## 4. Interface (mobile d'abord, utilisable sur ordinateur)

L'application s'ouvre sur l'écran **jeu**. Le diagnostic reste accessible à l'adresse `#diagnostic`. Barre de navigation en bas sur mobile, latérale sur ordinateur.

| Écran | Contenu | Actions |
| --- | --- | --- |
| Accueil | Nouvelle partie (choix de l'écurie, nom du manager), reprendre une sauvegarde | `joueur.prendre_ecurie` |
| Tableau de bord | Date, prochain Grand Prix, positions au championnat, trésorerie et plafond, décisions en attente, derniers faits de l'écurie | Avancer d'une semaine, jusqu'au prochain Grand Prix, jusqu'à la prochaine décision |
| Messages | Faits connus de l'écurie, du plus récent au plus ancien, avec leurs causes | Ouvrir une décision |
| Équipe | Pilotes et personnel : poste, compétences, moral, contrat | Prolonger, ne pas prolonger, licencier, soutenir, critiquer, féliciter, répondre aux demandes |
| Marché | Pilotes et personnel disponibles, potentiel estimé | Faire une offre (règles du marché, phase 7) |
| Technique | Savoir par domaine, programmes, stands | Programmes, plan des stands, délégation |
| Finances | Trésorerie, plafond, budget de développement | `budget.developpement` |
| Championnat | Classements, résultats des Grands Prix | — |
| Direction | Délégations, fédération, votes | `joueur.deleguer`, votes, lobbying |
| Réglages | Sauvegarder, charger, mesure des performances | — |

**Avancer le temps** : la simulation avance semaine par semaine, et l'écran reste réactif (pause entre les semaines). Elle s'arrête d'elle-même quand une nouvelle décision attend le joueur.

**Web Worker (D-110), choix de mise en œuvre** : pas en phase 10. Une semaine se calcule en 40 ms environ. Faire tourner le moteur dans un Worker obligerait à recopier le monde (8 Mo) vers l'écran à chaque semaine, ce qui coûterait plus cher que le calcul lui-même. Un **calcul par tranches** sur le fil principal donne le même confort. On rouvrira la question si la page de mesure, sur un vrai téléphone, montre des saccades.

**Page de mesure** (D-110) : temps de calcul par semaine et par saison, taille de la sauvegarde. Elle sert au test sur un vrai téléphone.

## 5. Tests

- Moteur :
  - prise de fonction (validations, ancien team principal libéré, événement causé) ;
  - délégations (l'IA décide ou s'abstient selon le domaine) ;
  - filet de sécurité ;
  - décisions en attente ;
  - commande de budget ;
  - licenciement du joueur ;
  - migration 24 → 25 ;
  - rejouabilité d'une partie avec des commandes du joueur ;
  - 10 saisons avec un joueur passif (tout délégué), puis avec un joueur qui ne délègue rien et ne fait rien : aucune incohérence.
- Interface : parcours complet sur un téléphone simulé (Playwright) : nouvelle partie, avancer, décider, sauvegarder, recharger. Captures d'écran.
- Mesure indicative (D-120) : une écurie dirigée par un joueur passif, comparée à la même écurie dirigée par l'IA (mêmes graines). Il ne doit pas y avoir d'écart notable : les délégations reprennent les règles de l'IA.
