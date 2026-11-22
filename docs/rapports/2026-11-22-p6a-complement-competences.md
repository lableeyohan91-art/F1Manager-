# Rapport — Phase 6a complémentaire : compétences des pilotes, circuits, mental, expérience, affinités

Date : 22/11/2026. Conception : `docs/systemes/phase-6a-complement-competences.md` (VALIDÉE, D-104 à D-108). Méthode : D-076 pour le rapport, D-095 (mesurer, ne pas recalibrer).

## 1. Ce qui a été livré

| Élément | Contenu |
| --- | --- |
| Compétences (D-104) | « Vitesse » supprimée. Nouvelles compétences : freinage, virages lents, virages rapides, motricité, intelligence de course. Natures et courbes de vieillissement ; style commun aux compétences de rythme à la génération |
| Mental (D-105) | Trait **résilience** lu par l'état émotionnel (remontée et chute du moral et de la confiance). **Erreurs sous pression** dans les 4 dernières manches pour les pilotes encore en course pour le titre, selon le sang-froid et l'expérience des luttes pour le titre |
| Expérience (D-106) | Compteurs : Grands Prix, pluie, luttes pour le titre, circuits, écurie actuelle. L'expérience remplace l'âge pour la progression des compétences d'expérience. Handicaps « circuit découvert » et « nouvelle écurie », réduits par l'adaptabilité. Apprentissage de la pluie. Expérience initiale des pilotes réels tirée de `carrieres.csv` (provisoire avant la phase 9) |
| Circuits (D-107) | 9 exigences par circuit (1 à 5) dans `circuits.csv`, à la place des 5 profils par type. Elles règlent le rythme du pilote, le poids des caractéristiques de la voiture (altitude comprise), l'influence du pilote (difficulté) et les incidents (risque d'accident). Poids normalisés : l'influence totale du pilote et de la voiture reste à la même échelle |
| Affinités (D-108) | −2 à +2, 0,15 point par cran. Une part naturelle (Grand Prix à domicile, rares crans ailleurs) est calculée sans stockage ; la part acquise (victoire, podium, titre, accident), modulée par la personnalité, est stockée seulement si elle n'est pas nulle |
| Mode développeur (D-108) | Commande `dev.modifier_personne` (compétence, potentiel, trait), journalisée et tracée par un événement. Interrupteur « mode développeur » dans l'interface, avec un éditeur sur la fiche d'une personne |
| Données | Nouvelles notes des 22 pilotes réels (estimations de game design de Claude Code) ; exigences des 24 circuits |
| Sauvegarde | Format 8, migration 7 → 8 testée |
| Tests | 10 nouveaux (84 au total) : circuits opposés, influence de chaque compétence, prodige contre vétéran, finale fragile contre solide, confiance contre méforme, résilience, bornes des affinités, mode développeur, audit (plus aucune lecture de « vitesse », chaque nouvel attribut lu), migration |

## 2. Vérification que chaque attribut sert (tests de laboratoire)

| Test | Résultat |
| --- | --- |
| Deux pilotes de même niveau général : un « freineur » et un pilote rapide en courbe | Le premier devance le second à Monzza, le second devance le premier à Suzuca ✔ |
| +2 points sur **chacune** des 13 compétences | Le niveau monte à chaque fois ✔ |
| Prodige de 19 ans contre Alonzo à Suzuca | Le jeune subit le handicap de découverte, Alonzo (plus de 300 GP) non ✔ |
| Finale : sang-froid 3 sans expérience des titres, contre sang-froid 18 avec 4 luttes | Le fragile commet **plus de deux fois** plus d'erreurs ; jamais d'erreur sous pression hors des courses décisives ✔ |
| Même pilote, confiance 95 ou 25 | La forme diffère dans la même course ✔ (effet encore faible : forme provisoire, D-103) |
| Résilience 19 contre 2, moral à 30 | Le résilient remonte plus vite ✔ |
| Affinités | Jamais au-delà de ±2 ni de ±0,3 point ✔ |

## 3. Équilibrage sportif — conditions identiques (référence P6a + D-102)

Références conservées : `docs/rapports/reference/p6a-complement-reference*`.

### 3.1 Tous les indicateurs suivis — 100 graines × 10 saisons

| Indicateur | Référence | **Complément** | Sens |
| --- | --- | --- | --- |
| Vainqueurs de GP différents / saison | 6,10 | 5,94 | défavorable (léger) |
| Écuries victorieuses / saison | 4,06 | 3,94 | défavorable (léger) |
| Part des victoires de l'écurie dominante | 59,7 % | 60,8 % | défavorable (léger) |
| Taux d'abandon | 7,1 % | 6,7 % | — |
| Écart 1re–dernière voiture (%) | 1,52 | 1,52 | ≈ |
| Écart de points P1–P2 | 75,0 | 71,7 | favorable |
| Changements de leader | 2,79 | 2,82 | ≈ |
| Doublés / saison | 6,10 | 6,07 | ≈ |
| Corrélation voiture ↔ points | 0,898 | 0,906 | ≈ |
| Plus forte progression d'une voiture | 1,02 | 1,02 | ≈ |
| Victoires inattendues / saison | 2,01 | 2,02 | ≈ |
| Courses sous la pluie | 2,73 | 2,73 | identique |
| Champions pilotes / 10 saisons | 3,12 | 3,03 | défavorable (léger) |
| Champions constructeurs / 10 saisons | 2,40 | 2,10 | **défavorable** |
| Plus longue série de titres | 6,15 | 6,51 | **défavorable** |
| Écuries sans victoire / 10 saisons | 2,88 | 3,44 | **défavorable** |
| Remontées (+3 places) | 5,22 | 4,49 | **défavorable** |
| Écuries changeant d'étage / saison | 2,40 | 2,24 | défavorable |
| Transitions sans changement d'étage | 18 % | 21 % | défavorable (cible < 20 % : **plus atteinte**) |
| La dernière écurie marque ≥ 1 point | 64 % | 57 % | **défavorable** (cible 60–90 % : **plus atteinte**) |
| Dynasties | 67 % | 71 % | défavorable |
| Titre ouvert avant la dernière manche | 24,5 % | 23,9 % | ≈ (cible 30–50 % : non atteinte) |
| Retournement à la dernière manche | 6,3 % | 5,4 % | défavorable (léger) |
| Champion et dauphin coéquipiers | 44 % | 46 % | ≈ |
| Lutte finale entre coéquipiers / entre écuries | 12,3 % / 12,2 % | 11,7 % / 12,2 % | ≈ |
| Saisons très serrées | 10,4 % | 10,7 % | ≈ |
| **Dominations (≥ 120 pts)** | 22,7 % | **18,9 %** | **favorable** (cible < 5 % : non atteinte) |
| Coéquipiers : écart moyen | 0,430 | 0,432 | ≈ |
| Coéquipiers : part compétences / forme / aléa | 26 / 0 / 75 % | 26 / 0 / 74 % | ≈ |

### 3.2 Sur 20 saisons — 50 graines

| Indicateur | Référence | **Complément** | Sens |
| --- | --- | --- | --- |
| Écuries victorieuses / saison | 5,43 | 5,21 | défavorable (léger ; cible 4–6 : atteinte) |
| Vainqueurs de GP différents / saison | 7,69 | 7,34 | défavorable (léger) |
| Champions pilotes / 20 saisons | 6,24 | 5,34 | **défavorable** |
| Champions constructeurs / 20 saisons | 4,58 | 3,90 | **défavorable** (cible 5–8 : non atteinte) |
| Plus longue série de titres | 7,42 | 8,14 | **défavorable** |
| Écuries sans victoire / 20 saisons | 0,24 | 0,34 | défavorable (léger) |
| Remontées | 18,7 | 15,8 | **défavorable** |
| Écuries changeant d'étage / saison | 3,28 | 3,03 | défavorable |
| Transitions sans changement d'étage | 11 % | 13 % | défavorable (léger ; cible atteinte) |
| La dernière écurie marque ≥ 1 point | 79 % | 71 % | défavorable (cible 60–90 % : atteinte) |
| Dynasties | 84 % | 84 % | ≈ |
| Dominations | 24,3 % | 24,3 % | ≈ |
| Titre ouvert avant la dernière manche | 25,5 % | 21,3 % | **défavorable** |
| Écart de points P1–P2 | 77,4 | 80,4 | défavorable (léger) |
| Saisons très serrées | 10,8 % | 10,4 % | ≈ |
| Retournement à la dernière manche | 6,0 % | 4,4 % | défavorable |
| Corrélation voiture ↔ points | 0,80 | 0,81 | ≈ |
| Lutte finale entre écuries différentes | 17,0 % | 14,2 % | défavorable |

### 3.3 Hiérarchie dans le temps et dominations (30 graines)

| Indicateur | Référence | **Complément** |
| --- | --- | --- |
| Persistance du classement N ↔ N+3 | 0,635 | **0,687** (plus figée) |
| Dernier tiers 2027 → top 3 un jour | 60 % | 51 % |
| Top 3 2027 → dernier tiers un jour | 52 % | 41 % |
| Dominations : champion dans la meilleure voiture | 80 % | 71 % |
| Écart de niveau entre les 1er et 6e pilotes | 1,65 | 1,65 |

### 3.4 Démographie (10 graines × 30 saisons)

| Indicateur | Référence | **Complément** |
| --- | --- | --- |
| Débutants en F1 / saison | 2,21 | 1,99 (cible 2–4 : à la limite) |
| Durée de carrière en F1 | 7,9 saisons | 8,9 saisons |
| Âge des champions | 29,9 ans | **31,3 ans** |
| Âge moyen des titulaires | ≈ 29,7 | ≈ 30,5 |
| Niveau moyen des titulaires 2027 → 2056 | 16,15 → 16,00 | 16,07 → 15,90 (stable à ± 0,5) |
| Pépites issues des cohortes | 2,4 / décennie | 2,8 / décennie |

## 4. Lecture franche

- **Les mécanismes fonctionnent et chaque attribut sert** (§2). Les pilotes sont réellement différents selon les circuits, et le mental compte en fin de championnat.
- **Les dominations écrasantes reculent sur 10 saisons** (23 % → 19 %), et le champion a moins souvent la meilleure voiture (80 % → 71 %) : le pilote recompte un peu.
- **Mais la hiérarchie se fige davantage**, et c'est le résultat défavorable principal :
  - persistance du classement 0,635 → 0,687 ;
  - moins de champions constructeurs (4,6 → 3,9 sur 20 saisons) ;
  - la dernière écurie marque moins souvent (64 % → 57 % sur 10 saisons), si bien que deux cibles D-081 atteintes en 6a ne le sont plus sur 10 saisons ;
  - des champions plus âgés.

  **Explication la plus probable (hypothèse, non encore vérifiée)** : l'expérience favorise désormais les pilotes établis.
  - Les compétences d'expérience (intelligence de course, régularité, pneus, retour technique) pèsent environ 37 % du niveau. Elles progressent plus lentement pour un débutant (facteur 0,6) et plus vite pour un vétéran (jusqu'à 1,4).
  - Un débutant subit en plus les handicaps de découverte.
  - Or les grandes écuries ont les pilotes expérimentés. Les petites écuries, qui misaient sur un jeune pour remonter, en profitent moins.

  C'est l'effet voulu par D-106 (l'expérience doit compter), mais son ampleur actuelle réduit la mobilité.
- **Conformément à D-095, rien n'est recalibré.** Les leviers possibles, à trancher lors de la grande campagne d'après la phase 8 ou plus tôt si tu le décides :
  - un facteur d'expérience moins écrasant pour les débutants (par exemple 0,8 au lieu de 0,6) ;
  - des handicaps de découverte plus courts ;
  - et surtout les juniors de la 6b : les jeunes arriveront avec une vraie expérience des courses (championnats juniors), au lieu d'arriver « vierges » en F1.

## 5. Questions pour toi

1. Faut-il **vérifier l'hypothèse tout de suite**, avec une simulation où le facteur d'expérience est neutre, pour confirmer la cause du figement ? C'est un test, pas un recalibrage.
2. On peut maintenant passer à la **conception de la phase 6b** (juniors, académies, financement, repérage). Elle devrait atténuer ce figement : les jeunes y accumulent de l'expérience avant la F1.
