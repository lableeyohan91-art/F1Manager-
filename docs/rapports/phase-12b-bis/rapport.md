# Phase 12b bis — rapport : soufflerie renforcée, V5, ADUO, intensif ponctuel (25/11/2026)

> Demandes du porteur après la 12b : renforcer la soufflerie, étudier l'équilibrage moteur gardé de côté (ADUO), tester une
> amplification α, adopter V5, pas de voitures « à 500 km/h » en 10 ans, des régressions, récompenser la recherche, un intensif
> utilisable « de temps en temps » avec des conséquences, alertes inchangées. Décision : **D-173**. Mesures **indicatives** (D-120).
> Code mesuré : commit 8e0433e (avant la conversion des six pièces 1fe6e10, sans effet sur les notes actuelles). Données : `donnees/`.

## 1. Ce qui a changé

| Élément | Avant (12b) | 12b bis |
| --- | --- | --- |
| Frontière | V-base | **V5** : échelle de savoir 12, part fondamentale aux réformes 0,3, pénalités d'architecture 0,2–0,5 |
| Heures de soufflerie → avancement d'un projet | 1 jour / heure | **4 jours / heure** ; CFD 0,16 jour / unité |
| Heures → recherche aéro (phase 8) | ×0,85 à ×1,15 | **×0,3 à ×1,8** selon les heures |
| ADUO (rattrapage des motoristes) | absent | +1 évolution au-delà de 2 % de retard de puissance ; +2 (et +2 la saison suivante) au-delà de 4 % |
| IA : rythme | intensif si équipe fraîche et enjeu | + **intensif ponctuel** sur les 14 derniers jours d'un projet si fatigue < 40 |
| Plafond budgétaire | dépassement involontaire possible (0,3 à 1 M€) | corrigé (réserve de recherche de l'IA, vérifications sans argent, enveloppe bornée) |
| Expériences | — | paramètres `soufflerie.amplification` et `motoriste.aduo` |

## 2. Hiérarchies sur 30 saisons (10 graines, mêmes graines, tous les indicateurs : `donnees/`)

| Indicateur | Avant 12a | 12b | **12b bis (α=1)** | α=2 | Sans ADUO |
| --- | --- | --- | --- | --- | --- |
| Champions constructeurs différents | 6,3 | 3,7 | **6,6** | 7,2 | 6,1 |
| Champions pilotes différents | 12,8 | 13,1 | **11,7** | 12,0 | 11,5 |
| Plus longue série de titres constructeurs | 6,2 | 7,9 | **6,5** | 5,3 | 7,2 |
| Séries avec 5 titres consécutifs ou plus | 70 % | 90 % | **80 %** | 50 % | 70 % |
| Remontées (+3 places) | 38,9 | 13,8 | **27,1** | 31,3 | 22,9 |
| Écuries changeant d'étage par saison | 3,8 | 2,3 | **3,1** | 3,4 | 3,1 |
| Transitions sans changement d'étage | 5 % | 19 % | **10 %** | 6 % | 13 % |
| Écuries sans victoire sur 30 saisons | 0,1 | 1,3 | **0,4** | 0,2 | 0,1 |
| Vainqueurs différents par saison | 7,4 | 6,0 | **7,3** | 7,6 | 7,3 |
| Écuries victorieuses par saison | 5,3 | 4,1 | **5,3** | 5,5 | 5,2 |
| Part des victoires de l'écurie dominante | 47 % | 56 % | **49 %** | 47 % | 48 % |
| Écart 1re–dernière voiture | 0,98 % | 1,50 % | **1,15 %** | 1,02 % | 1,15 % |
| Corrélation voiture ↔ points | 0,77 | 0,89 | **0,78** | 0,74 | 0,80 |
| Dernière écurie avec au moins 1 point | 80 % | 46 % | **57 %** | 69 % | 66 % |
| Titre ouvert avant la dernière manche | 30 % | 29 % | **27 %** | 34 % | 30 % |
| Dominations (≥ 120 points d'écart) | 11 % | 13 % | **13 %** | 11 % | 14 % |
| Victoires inattendues par saison | 1,6 | 1,8 | **1,5** | 1,5 | 1,5 |
| Taux d'abandon | 6 % | 6 % | **6 %** | 6 % | 6 % |

Lecture : la 12b bis rend aux hiérarchies leur mobilité (6,6 champions, 27 remontées), sans revenir au niveau d'avant la 12a. L'ADUO y
contribue (sans lui : 6,1 champions, 22,9 remontées). α=2 resserre encore (7,2 champions, séries de 5 titres 50 %).

Défavorable : séries de 5 titres consécutifs ou plus encore à 80 % (objectif D-081 : 0–25 %, **non atteint**) ; « dernière écurie qui
marque » 57 % (objectif 60–90 %, **non atteint de peu**).

## 3. Laboratoire (8 graines × 4 saisons, même écurie, stratégies imposées)

| Stratégie | Williams : place / gain | Haas : place / gain | Fatigue max | Dilemmes (4 saisons, Williams / Haas) |
| --- | --- | --- | --- | --- |
| IA | 4,59 / 4,98 | 8,50 / 4,81 | 36–37 | 4,5 / 3,5 |
| Normal permanent | 4,59 / **5,30** | **8,41** / 4,95 | 15 | 4,8 / 2,5 |
| Intensif permanent | 5,03 / 4,81 | 8,97 / 4,34 | 53 | **29,3 / 16,0** |
| **Intensif ponctuel** (14 derniers jours) | 4,59 / 4,98 | 8,66 / 4,79 | 35–36 | 4,5 / 3,0 |
| Soufflerie 0 % recherche | **4,34 / 5,49** | **7,91 / 5,51** | 37 | 4,4 / 3,6 |
| Soufflerie 100 % recherche | 5,84 / 3,35 | 9,78 / 2,73 | 36 | 5,3 / 2,9 |
| Barème plat (100 % pour tous) | 4,72 / 5,12 | 8,31 / 4,88 | 36–37 | 4,8 / 3,3 |

Ce qui marche :
- L'intensif permanent reste une mauvaise stratégie (moins de progrès, 4 à 5 fois plus d'incidents, 6 fois plus de dilemmes).
- La répartition de la soufflerie compte : 0 % ou 100 % de recherche change nettement le résultat sur 4 saisons.

Ce qui ne marche pas (**objectifs non atteints**) :
- **Le barème de soufflerie compte encore peu** : Haas fait aussi bien avec le barème plat (8,31) qu'avec le réel (8,50) ; Williams un peu
  mieux avec le réel (4,59 contre 4,72).
- **L'intensif ponctuel n'apporte rien** : le normal fait aussi bien ou mieux.
- Cause probable commune : **c'est l'argent qui limite**. L'enveloppe annuelle des projets est épuisée vers la semaine 30 ; aller plus vite
  ne permet pas de faire plus de projets, seulement de les finir plus tôt. Le gain d'avancer d'une pièce (quelques Grands Prix plus tôt)
  ne se voit presque pas.

## 4. Vitesse des voitures et réformes (4 graines × 30 saisons)

> **Rectificatif du 26/11/2026** : la conclusion « les réformes ne font pas reculer » est **fausse**. L'outil mesurait avant l'exécution
> de la semaine 1, et comptait l'effet d'une réforme l'année suivante. Mesure corrigée (`donnees/tendances-voitures-corrige.md`) : l'année
> d'une grande réforme, la grille recule de 0,97 point en moyenne (+0,59 une année normale) et 67 % des écuries reculent (8 % une année
> normale). Voir `docs/rapports/phase-12c/rapport.md` §4. Le texte d'origine est conservé ci-dessous.

Indice moyen de la grille (1 point ≈ 0,28 % ≈ 0,25 s) : 15,7 (2028) → 21,9 (2035) → 23,6 (2040) → 25,2 (2050) → 24,5 (2057).
- **Pas de course à l'infini** : la frontière plafonne la progression ; environ +9 points (≈ 2,4 s) en 20 ans, puis un plateau.
- **Les réformes ne font pas reculer les voitures** (**objectif non atteint**) : la grille progresse de +0,46 point les années de
  grande réforme contre +0,27 les années normales ; 11 % des écuries reculent l'année d'une réforme, contre 21 % une année normale.
  En F1 réelle, une grande réforme rend souvent les voitures plus lentes au début, et en fait reculer certaines.

## 5. Propositions (à décider par le porteur ; rien n'est appliqué)

1. **Réformes qui font reculer** : une grande réforme abaisse la frontière (ex. −2 à −3 points pour tous, l'équivalent d'une coupe
   d'appui réglementaire) ; la reconception part de là ; les écuries qui ont préparé le règlement retrouvent plus vite leur niveau.
   C'est ce qui « récompense la recherche » : la préparation devient visible au moment où les autres reculent.
2. **Soufflerie qui compte même quand l'argent limite** : faire porter les heures sur la **qualité** des pièces (gain par projet), pas
   seulement sur leur vitesse ; critère : barème plat nettement moins bon que le réel pour une écurie mal classée.
3. **Intensif utile ponctuellement** : lui donner une vraie raison d'être, finir une pièce avant une échéance (Grand Prix choisi,
   fin d'année avant le gel, réforme) ; aujourd'hui, sans échéance, il ne sert à rien.
4. **α** : garder 1 pour l'instant ; α=2 resserre la hiérarchie, mais c'est un équilibrage déclaré (D-169) à décider après les points 1 à 3.
