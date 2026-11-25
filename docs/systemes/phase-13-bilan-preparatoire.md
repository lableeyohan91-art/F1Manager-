# Phase 13 (courses) — bilan préparatoire : ce qu'on a en tête, pertinence, actions (26/11/2026)

> Demande du porteur : « commence à réfléchir sur la phase 13 et notre moteur de jeu, fais-moi un bilan sur ce qu'on a en tête, évalue leur
> pertinence et propose des actions ». Sources : fiche d'intention du 23/11/2026 (`docs/echanges/2026-11-23-intention-phase-13-courses.md`),
> audit APEX transmis par ChatGPT (25/11/2026, points 3 à 8), inventaire du moteur de course actuel (relu le 26/11/2026).
> Statut : **bilan, pas une conception validée** (CLAUDE.md : aucune ligne de code de la phase 13 avant validation).

## 1. Où on en est vraiment

La course actuelle est **calculée en une fois** : temps = −(voiture + pilote + forme) + aléa + pression ; on trie. Il n'y a ni tour, ni position,
ni dépassement, ni pneus, ni carburant, ni batterie, ni arrêt, ni voiture de sécurité ; la pluie est tirée une fois pour toute la course.

Ce qui est **prêt** et servira directement :
- **Profil de vitesse physique** sur les 30 tracés réels (12a–12c) : vitesse en chaque point, pour chaque voiture, cause de la limitation
  (adhérence, puissance, freinage), énergie électrique par tour. C'est la base naturelle d'un moteur « par portions ».
- **Voitures** (six pièces, appui, traînée, motricité, freinage, masse, refroidissement, fiabilité) et **circuits** (portions, zones de
  dépassement, temps de passage aux stands, climat mensuel, pluie par mois).
- **Équipe des stands** (8d : temps, erreurs, fatigue, cohésion), **pilotes** (13 compétences + trait de sang-froid), **IA** des écuries,
  **déterminisme** et flux de hasard séparés, **banc d'essai neutralisable** (D-174).

## 2. Ce qu'on a en tête, et ce que j'en pense

| Idée | Origine | Pertinence | Commentaire |
| --- | --- | --- | --- |
| Moteur par portions, 22 voitures avec position réelle | fiche §3 | **haute** | c'est le cœur ; s'appuyer sur le profil de vitesse existant (pas de deuxième physique) |
| Dépassements décidés là où ils ont lieu (écart local, aspiration, air perturbé, défense) | fiche §3, APEX pt 3 | **haute** | APEX : 64 dépassements annoncés pour 1,66 place gagnée → éviter les échanges à chaque tour (seuil d'écart, coût de l'attaque, défense) |
| Quatre leviers (conduite, ERS, carburant, pneus) × 3 niveaux | fiche §4, APEX pt 5 | **haute**, avec prudence | 81 combinaisons par pilote : il faut des **effets nets et lisibles**, et que ni « tout agressif » ni « tout conservateur » ne soit optimal |
| Carburant : charge de départ, masse, économie, panne | fiche §4, APEX pt 6 | haute | conséquences réelles d'une mauvaise estimation, sans panne systématique |
| Pneus : composés, usure, température, fenêtre | fiche §8, APEX pt 7 | **haute** | remplace la note de pneus « bonus fixe » des voitures (relecture : seule caractéristique non physique) |
| Stratégie : undercut, overcut, neutralisations, trafic | fiche §11, APEX pt 7 | **haute** | mesurer contre 21 IA **réactives** (sinon le joueur paraît trop fort) |
| Pluie qui évolue, prévisions incertaines, paris | fiche §11, APEX pt 8 | haute | APEX : « attendre » trop souvent rentable en pluie longue → seuils d'adhérence et pertes réelles en pneus secs |
| 13 compétences avec un rôle chacune | fiche §5, APEX pt 4 | **haute** | aujourd'hui, 6 compétences ne font que peser dans une moyenne (dépassement, défense, départs, intelligence de course, retour technique, condition) |
| Sang-froid comme note de pilotage | fiche §5 | moyenne | je maintiens ma proposition du 23/11 : **un seul** sang-froid (le trait), lu par la course sous pression |
| Jauge d'énergie physique du pilote | fiche §6 | moyenne | utile si elle crée des décisions (gérer un pilote épuisé) ; sinon, c'est une couche de plus |
| Ingénieur de course qui conseille, peut se tromper | fiche §10 | **haute** | c'est l'interface du joueur ; il lit l'état **estimé**, jamais l'avenir |
| IA imparfaite, cycles de confiance, objectifs au championnat | fiche §9 | haute | erreurs venant d'analyses bruitées, jamais programmées |
| Course en 2D | fiche §3 | haute pour l'envie, **coûteuse** | à faire **après** un moteur juste ; l'affichage montre ce que le moteur a calculé |
| Profils de pilotes générés (Next Gen) | fiche §12 | haute | la génération (phase 6) doit produire des spécialistes, pas une note générale |

## 3. Les risques principaux

1. **Le coût de calcul.** Une saison se simule en environ 2 s aujourd'hui. 22 voitures par portions, 20 Grands Prix, plus les saisons
   simulées sans le joueur : 100 à 1000 fois plus. **Proposition** : un seul moteur, deux finesses (fine pour la course que le joueur regarde,
   grossière, par relais, pour les autres), même physique ; mesurer dès le premier prototype, sur téléphone.
2. **La lisibilité.** Quatre leviers × 22 pilotes : le joueur doit comprendre en une phrase pourquoi il a gagné ou perdu une place
   (l'explication existe déjà dans les résultats, à étendre).
3. **L'équilibrage** : stratégies dominantes (tout agressif, tout économe), dépassements trop faciles ou impossibles. D'où les bancs du §5.
4. **Les données** : vraies zones de dépassement, voie des stands, probabilités de neutralisation par circuit (en partie dans les fiches 11b).

## 4. Proposition d'organisation (à valider)

| Sous-phase | Contenu | Pourquoi dans cet ordre |
| --- | --- | --- |
| 13a | **Ressources au tour** : pneus (composés, usure, température), carburant (charge, masse, consommation), batterie (énergie par tour existante) ; course tour par tour, sans dépassement localisé | fixe la physique des relais ; remplace la note de pneus fixe ; teste les quatre leviers |
| 13b | **Portions et dépassements** : positions, écarts, aspiration, air perturbé (perte d'appui à moins d'une seconde), zones de dépassement, défense, départs | le cœur « course » ; utilise le profil de vitesse |
| 13c | **Stratégie et aléas** : arrêts (équipe des stands 8d), undercut/overcut, voiture de sécurité et VSC, drapeaux rouges, pénalités, pluie évolutive et prévisions | les vraies décisions du joueur |
| 13d | **Ingénieur de course et IA** : conseils incertains, objectifs au championnat, confiance ; même commande pour tous | la qualité de l'adversité |
| 13e | **Interface** : consignes en course (paysage, D-177), explication des gains et pertes | rendre tout cela jouable |
| 13f | **Vue 2D** | l'envie, quand le moteur est juste |

Chaque sous-phase : conception, validation, code, tests, campagne avant/après, rapport (processus CLAUDE.md).

## 5. Tests à prévoir dès la conception (enseignements d'APEX, à vérifier dans NOTRE moteur)

- **Bancs par niveau** (D-174) : physique pure → course sans aléa → avec incidents → course complète ; mêmes graines = mêmes résultats.
- **Compétences** : 22 pilotes dans la même voiture sur les 30 circuits ; une compétence modifiée à la fois ; chaque compétence doit changer
  un résultat **dans sa situation** (freinage : attaques en bout de ligne droite ; défense : positions tenues ; pluie : courses mouillées).
- **Leviers** : campagnes « tout agressif », « tout neutre », « tout conservateur », « économiser puis attaquer » ; aucune ne doit dominer.
- **Carburant** : charges de départ variées ; la panne doit rester rare et toujours expliquée par une mauvaise estimation.
- **Dépassements** : dépassements par course, places gagnées départ → arrivée, part des échanges répétés entre la même paire (APEX : trop).
- **Stratégie** : undercuts et overcuts réussis et ratés ; arrêts sous neutralisation ; contre 21 IA réactives.
- **Pluie** : anticiper trop tôt, trop tard, rester en pneus secs et réussir, rester et perdre beaucoup.
- **Coût** : temps d'une course fine et d'une saison complète sur téléphone.

## 6. Décisions à prendre par le porteur (avant toute conception détaillée)

1. Valider l'organisation 13a → 13f (ou en changer l'ordre).
2. Un seul moteur à deux finesses : d'accord ?
3. Sang-froid : un seul (le trait), ou une note de pilotage en plus ?
4. Jauge d'énergie physique des pilotes : maintenant (13b/13c) ou plus tard ?
5. Vue 2D : en fin de phase 13 (proposé) ou plus tôt, même schématique ?
