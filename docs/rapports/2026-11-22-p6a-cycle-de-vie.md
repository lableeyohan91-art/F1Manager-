# Rapport — Phase 6a : cycle de vie des personnages

Date : 22/11/2026. Conception : `docs/systemes/phase-6a-cycle-de-vie.md` (VALIDÉE, D-100, D-101). Méthode : D-076 pour le rapport, D-095 pour l'équilibrage (mesurer et documenter, ne pas recalibrer trop tôt).

## 1. Ce qui a été livré

| Élément | Contenu | Où |
| --- | --- | --- |
| Profil de carrière | 6 archétypes ; âges propres d'apogée et de déclin ; points forts et faibles par compétence ; profils compatibles avec l'âge pour les personnes des données ; « longévité » imposée à Alonzo et Hammilton (`personnes.csv`, colonne `profilCarriere`) | `balance/carriere.ts`, `systems/carriere/profil.ts` |
| Progression et déclin | Toutes les 4 semaines, par compétence, selon plusieurs facteurs (§1.1) | `systems/carriere/index.ts` |
| Déclics et stagnations | Rares, plus fréquents pour le profil « irrégulier », avec une révision rare du potentiel de ±1 (D-100) | idem |
| Potentiel estimé | Fourchette propre à chaque écurie, selon l'âge, le temps d'observation, le département recrutement et son biais. **L'IA ne lit plus le vrai potentiel** (audit automatique dans les tests) | `systems/carriere/estimation.ts`, `humain/decision.ts` |
| Fins de carrière | Plusieurs mécanismes (§1.2) | `systems/carriere/index.ts` |
| Générations | Monde de départ : jeunes pilotes de 14 à 22 ans avec leur passé de progression. Chaque année : 15 pilotes de 14 ans et 10 jeunes ingénieurs. Accès à la F1 dès 18 ans (D-100). Plus de pilotes générés à la demande | `generation/construction.ts` |
| Sauvegarde | Format 7, migration 6 → 7 testée | `core/sauvegarde.ts` |
| Diagnostic | Fiche d'une personne : profil de carrière, meilleur niveau, saisons en F1, potentiel estimé | `src/ui/diagnostic/Vues.tsx` |
| Laboratoire | `npm run demographie` (démographie, dérive du niveau), `npm run persistance` (cercle vertueux) | `tools/` |
| Tests | 8 nouveaux (74 au total) : profils, environnement (titulaire contre réserviste), déclin physique avant l'expérience, estimation et audit, abandon, cohortes, reconversion avec souvenirs conservés, retour, 10 saisons cohérentes avec contrôle des âges, migration | `tests/carriere.test.ts` |

### 1.1 Facteurs de la progression

- la phase de carrière (avant l'apogée, plateau, déclin) ;
- la nature de la compétence (physique, technique, expérience, transversale) ;
- le temps de jeu ;
- l'encadrement (simulateur ou centre de recherche, chef direct) ;
- un mentor ;
- la motivation ;
- le travail personnel (professionnalisme, remise en question).

### 1.2 Mécanismes de fin de carrière

- **Retraites décidées par la personne** : déclin ressenti, âge comparé à son profil, absence de contrat, rêve de titre, ambition.
- **Un sans-emploi finit par quitter le milieu**, à tout âge.
- **Abandon des jeunes qui n'ont pas percé** (D-101).
- **Retours** possibles.
- **Reconversions** : un pilote devient directeur sportif ou team principal, un jeune qui abandonne devient ingénieur, un directeur technique ou sportif devient team principal.
- **Promotions entre métiers**, qui recréent les compétences du nouveau métier.

### 1.3 Écarts à la fiche (à connaître)

- **Pas de table d'estimations** : l'estimation est recalculée à la demande, de façon déterministe, par un tirage local par écurie, personne et année. C'est plus simple, sans volume à borner et sans migration. Les missions de repérage, encore à concevoir, s'y brancheront.
- **Classement abstrait karting / F4 (`reputationJeune`) non implémenté** : en 6a, aucune formule ne l'aurait lu. Les recruteurs jugent sur leur estimation. Il viendra en 6b avec les académies, qui le liront (règle « pas d'attribut sans formule »).
- La règle provisoire « un libre depuis 3 saisons prend sa retraite » est supprimée. Elle est remplacée par la décision « quitter le milieu », pour le personnel et les pilotes déjà passés par la F1.
- Le filet de sécurité qui génère du personnel à la demande reste en place pour les postes de direction. Il ne sert presque plus : 0,04 personne par saison.

## 2. Corrections en cours de route

| Constat (premiers essais) | Correction |
| --- | --- |
| La population grossissait sans fin (337 → 635 personnes en 30 saisons) : les ingénieurs sans poste ne partaient jamais avant 52 ans | Un sans-emploi peut quitter le milieu à tout âge (l'âge minimal de retraite ne vaut que pour les personnes en poste) |
| Correction trop forte : les jeunes juniors, « sans contrat » depuis leurs 14 ans, partaient tous | Les jeunes qui n'ont jamais eu de baquet relèvent uniquement de l'abandon (D-101) |
| Temps de calcul ×2,4 | Index des installations calculé une fois par période : ×1,8 (objectif < ×2 atteint) |
| Outil de démographie : un pilote reconverti le jour de sa retraite était compté comme « personnel » | Le poste au moment de la retraite est inscrit dans l'événement |

## 3. Démographie — 10 graines × 30 saisons (et 4 × 50)

| Indicateur | Valeur | Cible | Verdict |
| --- | --- | --- | --- |
| Débutants en F1 par saison | 2,04 (2,10 sur 50 saisons) | 2 à 4 (D-072) | ✔ au bas de la fourchette |
| Durée de carrière en F1 à la retraite | moyenne 8,5 saisons ; 10 % ≤ 1 ; 90 % ≤ 17 ; max 24 | 6 à 10, carrières très courtes et de plus de 20 saisons possibles | ✔ |
| Âge de retraite des pilotes de F1 | moyenne 36,1 ; de 30 à 42 ans (10–90 %) | étalé | ✔ |
| Âge des champions | moyenne 29,0 ; de 23 à 36 ans | pas d'apogée commun | ✔ |
| Âge moyen des titulaires | 26,9 en 2027 → ≈ 30 ensuite | — | un peu élevé, à surveiller |
| **Niveau moyen des titulaires (dérive)** | 16,09 (2027) → 16,97 (2031) → 17,17 (2036) → 16,93 → 16,72 → 16,55 → 16,64 (2056) | stable à ± 0,5 | ⚠ **hausse de +0,9 les 5 premières années**, puis stable à ± 0,3 |
| Population (hors retraités) | 336 → 351 → 340 → 323 → 311 → 303 → 304 | stable | ✔ légère baisse, puis stable |
| Abandons de jeunes | 12,7 par saison (pour 15 entrées) | le vivier reste un vivier | ✔ |
| Retraites / retours / reconversions | 39,5 / 0,32 / 5,0 par saison | — | |
| Déclics / stagnations | 8,0 / 5,5 par saison (toutes personnes) | rares | ✔ |
| Personnes générées en urgence | 0,04 par saison | quasi nul | ✔ |
| Pépites (potentiel ≥ 18) nées dans les cohortes | 28 par partie de 30 saisons, soit environ une par an | — | ⚠ sans doute trop fréquentes (§5) |

La hausse initiale du niveau vient surtout des jeunes pilotes de la grille réelle (Antoneli, Bearmann, Hadjard…) : leur potentiel noté dépasse leur niveau actuel, et ils progressent. Ensuite, les générations se remplacent sans dérive.

## 4. Équilibrage sportif — conditions identiques (référence P5b)

Mêmes graines, mêmes mécaniques hors 6a. Références conservées dans `docs/rapports/reference/p6a-reference*`.

### 4.1 Tous les indicateurs suivis — 100 graines × 10 saisons

| Indicateur | P5b | **P6a** | Sens |
| --- | --- | --- | --- |
| Vainqueurs de GP différents / saison | 5,97 | 6,29 | favorable |
| Écuries victorieuses / saison | 3,85 | 4,16 | favorable |
| Part des victoires de l'écurie dominante | 57 % | 59 % | **défavorable (léger)** |
| Taux d'abandon | 7,8 % | 7,1 % | — |
| Écart 1re–dernière voiture (%) | 1,56 | 1,52 | ≈ |
| **Écart de points P1–P2** | 52,7 | **72,2** | **défavorable** |
| Changements de leader | 3,42 | 2,82 | **défavorable** |
| Doublés / saison | 6,11 | 6,12 | ≈ |
| Corrélation voiture ↔ points | 0,90 | 0,90 | ≈ |
| Plus forte progression d'une voiture | 1,00 | 1,02 | ≈ |
| Victoires inattendues / saison | 2,27 | 2,10 | défavorable (léger) |
| Courses sous la pluie | 2,73 | 2,73 | identique |
| **Champions pilotes / 10 saisons** | 3,94 | **3,20** | **défavorable** |
| Champions constructeurs / 10 saisons | 2,42 | 2,33 | défavorable (léger) |
| Plus longue série de titres | 5,94 | 6,18 | défavorable (léger) |
| Écuries sans victoire / 10 saisons | 4,84 | 2,75 | **favorable** |
| Remontées (+3 places) | 3,53 | 5,40 | **favorable** |
| Écuries changeant d'étage / saison | 1,91 | 2,44 | **favorable** |
| Transitions sans changement d'étage | 23 % | 17 % | **favorable** (cible < 20 % : **atteinte**) |
| La dernière écurie marque ≥ 1 point | 43 % | 64 % | **favorable** (cible 60–90 % : **atteinte**) |
| Dynasties (≥ 5 titres consécutifs) | 66 % | 66 % | ≈ (cible « très rares » : très loin) |
| Titre ouvert avant la dernière manche | 35 % | 27 % | **défavorable** (cible 30–50 % : non atteinte) |
| Retournement à la dernière manche | 6,2 % | 4,6 % | défavorable |
| Champion et dauphin coéquipiers | 49 % | 46 % | ≈ |
| Lutte finale entre coéquipiers | 17,1 % | 13,3 % | défavorable |
| Lutte finale entre écuries différentes | 18,0 % | 13,8 % | défavorable |
| Saisons très serrées | 14,1 % | 11,0 % | défavorable |
| **Dominations (≥ 120 pts)** | 9,4 % | **19,8 %** | **défavorable** (cible < 5 % : non atteinte) |
| Coéquipiers : écart moyen | 0,447 | 0,425 | ≈ |
| Coéquipiers : part compétences / forme / aléa | 32 / 0 / 69 % | 24 / 0 / 76 % | — |

### 4.2 Sur 20 saisons — 50 graines

| Indicateur | P5b | **P6a** | Sens |
| --- | --- | --- | --- |
| Écuries victorieuses / saison | 4,75 | 5,49 | **favorable** (cible 4–6 : **atteinte**) |
| Vainqueurs de GP différents / saison | 6,82 | 7,85 | favorable |
| Champions pilotes / 20 saisons | 5,94 | 6,50 | favorable |
| **Champions constructeurs / 20 saisons** | 3,96 | **4,76** | **favorable** (cible 5–8 : presque) |
| Plus longue série de titres | 7,28 | 7,26 | ≈ |
| Écuries sans victoire / 20 saisons | 0,84 | 0,16 | favorable |
| Remontées (+3 places) | 12,9 | 19,4 | **favorable** |
| Écuries changeant d'étage / saison | 2,63 | 3,32 | **favorable** |
| Transitions sans changement d'étage | 16 % | 10 % | favorable |
| La dernière écurie marque ≥ 1 point | 58 % | 78 % | **favorable** (cible 60–90 % : **atteinte**) |
| Dynasties | 88 % | 80 % | favorable (cible « très rares » : encore très loin) |
| Dominations | 16,6 % | 19,1 % | **défavorable** |
| Titre ouvert avant la dernière manche | 29,7 % | 27,8 % | défavorable (léger) |
| Écart de points P1–P2 | 66,5 | 69,8 | défavorable (léger) |
| Saisons très serrées | 12,3 % | 10,8 % | défavorable (léger) |
| Retournement à la dernière manche | 5,1 % | 5,5 % | ≈ |
| Corrélation voiture ↔ points | 0,77 | 0,80 | ≈ |
| Champion et dauphin coéquipiers | 33 % | 32 % | ≈ |
| Lutte finale entre écuries différentes | 17,8 % | 18,1 % | ≈ |
| Écart 1re–dernière voiture (%) | 1,17 | 1,12 | ≈ |

### 4.3 Hiérarchie dans le temps — 30 graines × 20 saisons (`npm run persistance`)

| Indicateur | P5b | **P6a** |
| --- | --- | --- |
| Corrélation classement N ↔ N+3 (plus bas = moins figé) | 0,744 | **0,626** |
| Écuries du dernier tiers en 2027 qui atteignent un jour le top 3 | 36 % | **56 %** |
| … le top 5 | 72 % | **84 %** |
| Écuries du top 3 en 2027 qui tombent un jour dans le dernier tiers | 27 % | **52 %** |

## 5. Lecture franche

- **La 6a est la mécanique la plus efficace à ce jour pour rendre la hiérarchie vivante.** Les grandes écuries déclinent quand leurs stars vieillissent, et les petites remontent avec un bon jeune. Trois cibles D-081 sont atteintes pour la première fois :
  - la dernière écurie qui marque ;
  - la mobilité entre étages ;
  - 4 à 6 écuries victorieuses sur 20 saisons.
- **Mais les saisons individuelles sont plus déséquilibrées** : deux fois plus de dominations sur 10 saisons (9 % → 20 %), un écart plus grand entre les deux premiers, moins de titres joués à la dernière manche. Sur 10 saisons, il y a aussi **moins de champions pilotes différents** (3,9 → 3,2).

  L'explication la plus probable : **des pilotes d'exception** qui, à leur apogée et dans la bonne voiture, écrasent la concurrence plusieurs saisons de suite. Les écarts de niveau entre pilotes sont plus grands qu'avec des compétences figées. Deux pistes, que je **mesure sans les corriger** (D-095) :
  1. **Les pépites sont sans doute trop fréquentes** (≈ une par an avec un potentiel ≥ 18). C'est un paramètre de conception des cohortes, à trancher par toi.
  2. Rien n'empêche encore une star d'aller ou de rester dans la meilleure voiture, ni ne fait monter son prix. Le marché du travail (phase 7 : enchères, agents, débauchage) et les règlements (phase 8) devraient répartir les talents.
- **Le niveau moyen monte de +0,9 en 5 ans, puis se stabilise.** Ce n'est pas une dérive continue : c'est l'effet de départ des jeunes de la grille réelle.
- **Comportement de l'IA changé** : elle juge désormais le potentiel sur son estimation, et peut se tromper. C'est voulu (fin de la triche).

## 6. Déséquilibres documentés et mécaniques susceptibles de les résoudre (D-095)

| Déséquilibre | Remède attendu |
| --- | --- |
| Dominations d'un pilote d'exception (20 %) | 7 (prix des stars, agents, concurrence pour les signer), 8 (règlements), 13 (moteur de course : erreurs, pression, sang-froid D-075) |
| Titres moins souvent joués à la dernière manche | 13 (moteur de course) |
| Âge moyen de la grille un peu élevé (≈ 30 ans) | 6b (filières juniors : les jeunes arrivent plus prêts et mieux identifiés) |
| Fréquence des pépites | décision de conception (question §7.1) |

## 7. Questions pour toi

1. **Pépites** : environ un jeune par an avec un potentiel ≥ 18, est-ce trop ? Je propose de **garder ce réglage** jusqu'à la grande campagne d'après la phase 8. Mais si tu juges, comme moi, que les « talents générationnels » doivent être plus rares (par exemple un tous les 3 à 4 ans), c'est un choix de conception que l'on peut faire dès maintenant, sans attendre.
2. On enchaîne sur la **conception de la phase 6b** (filières juniors, académies, financement des jeunes, repérage) ?
