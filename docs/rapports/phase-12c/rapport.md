# Phase 12c — rapport : physique recalée, motricité, recul aux réformes, profils (26/11/2026)

> Décision : **D-175** (chantiers 1 à 3 de `docs/systemes/phase-12c-analyse-approfondie.md`, « oui pour les 3 premiers » du porteur ;
> le chantier 4, heures → qualité et échéances, est laissé en l'état). Mesures **indicatives** (D-120). Données : `donnees/`.
> Campagnes mesurées sur le commit 5acd2e5 (avant les corrections de bugs de la relecture de nuit, sans effet attendu sur ces indicateurs).

## 1. Ce qui a changé

| Chantier | Avant | Après |
| --- | --- | --- |
| A1 — compromis appui / traînée | réglage d'ailerons optimal **au maximum sur 25 circuits sur 30** | **0 sur 30** à une borne ; ordre public respecté (Monza, Las Vegas, Bakou, Djeddah < Monaco, Hongrie, Singapour, Zandvoort) |
| Précision du calage (5 tracés détaillés) | 15,09 km/h ; 1,16 % sur le temps au tour | 15,36 km/h ; 1,19 % (inchangée à peu près) |
| Validation (25 autres circuits, hors critère) | 20,18 km/h ; 4,44 % | 20,63 km/h ; **4,25 %** |
| A2 — sensibilités | différences à ± 3 % ; Silverstone ≈ 12–14 fois la courbure médiane | moindres carrés de −10 % à +10 % ; courbure maximale 2 à 5 fois la médiane (Sepang, Spa, Austin) |
| Concepts | non neutres après le recalage | compromis recalculés : chaque concept neutre sur le circuit moyen |
| B2 — note de motricité | absente | colonne facultative `motricite` (suspensions) ; **valeurs du porteur attendues** (aujourd'hui = virages lents, donc sans effet) |
| B1 — fiabilité | dans l'efficacité du châssis | retirée (D-174) |
| D — grande réforme | reconception seule | coupe de 3 points d'efficacité × intensité sur les pièces touchées |

Valeurs du recalage : appui 4,043 → 5,065 ; adhérence mécanique 1,27 → 1,473 ; efficacité de l'appui sur l'adhérence 1,805 → 1,516 ;
motricité 0,832 → 0,875 ; freinage 1,498 → 1,479 ; énergie électrique 8,41 → 6,41 MJ par tour ; appui conservé en ligne droite 0,678 →
0,643 ; finesse incrémentale des ailerons 3,23 → 2,01 (**à la borne basse du calage**, plausible pour un aileron très chargé, à surveiller) ;
part de l'appui due aux ailerons 0,336 → 0,441 ; part de la traînée 0,406 → 0,280.

## 2. Chaque caractéristique gagne quelque part et perd ailleurs (banc de spécialisation)

Réglage optimisé par voiture : appui 9 circuits, motricité 9, faible traînée 4, freinage 4, moteur 3, adhérence mécanique 1 ; **21 paires
sur 21 s'inversent** (avant : appui 5 circuits). Détail dans `donnees/banc-specialisation.md`.

## 3. Hiérarchies sur 30 saisons (10 graines, mêmes graines ; tous les indicateurs : `donnees/`)

| Indicateur | Objectif D-081 | 12b bis | **12c** | 12c sans coupe |
| --- | --- | --- | --- | --- |
| Champions constructeurs différents | 5–8 / 20 saisons | 6,6 | **6,8** | 5,4 |
| Champions pilotes différents | — | 11,7 | **12,6** | 12,6 |
| Plus longue série de titres | — | 6,5 | **5,3** | 6,7 |
| Séries avec 5 titres consécutifs ou plus | dynasties très rares | 80 % | **60 %** ✗ | 80 % |
| Remontées (+3 places) | — | 27,1 | **28,5** | 28,6 |
| Écuries changeant d'étage par saison | 2,8–3,8 | 3,1 | **3,2** | 3,3 |
| Transitions sans changement d'étage | — | 10 % | **11 %** | 9 % |
| Écuries sans victoire sur 30 saisons | — | 0,4 | **0,3** | 0,2 |
| Vainqueurs différents par saison | — | 7,3 | **7,6** | 7,6 |
| Écuries victorieuses par saison | 4–6 | 5,3 | **5,6** ✓ | 5,4 |
| Part des victoires de l'écurie dominante | — | 49 % | **45 %** | 47 % |
| Écart 1re–dernière voiture | — | 1,15 % | **1,02 %** | 1,03 % |
| Corrélation voiture ↔ points | — | 0,78 | **0,76** | 0,76 |
| Dernière écurie qui marque | 60–90 % | 57 % | **68 %** ✓ | 63 % |
| Titre ouvert avant la dernière manche | 30–50 % | 27 % | **34 %** ✓ | 33 % |
| Dominations (≥ 120 points) | < 5 % | 13 % | **9 %** ✗ | 15 % |
| Saisons très serrées (≤ 10 points) | — | 11 % | **15 %** | 16 % |
| Victoires inattendues par saison | — | 1,5 | **1,3** | 1,3 |
| Plus forte progression dans la saison | — | 1,05 | **0,94** | 0,95 |
| Taux d'abandon | — | 6 % | **6 %** | 6 % |

Lecture : la 12c améliore presque tout ; la coupe de réforme en est la cause principale (sans elle : 5,4 champions, 80 % de dynasties,
15 % de dominations). **Non atteints** : dynasties (60 % des séries ont 5 titres de suite) et dominations (9 % contre < 5 %).
Défavorable : un peu moins de victoires inattendues (1,3 contre 1,5) et une progression en saison un peu plus faible.

## 4. Réformes : elles font reculer (mesure corrigée)

**Erreur de mesure corrigée** : l'outil de tendance mesurait avant l'exécution de la semaine 1 ; l'effet d'une réforme était compté l'année
suivante. Le rapport de la 12b bis concluait à tort « aucune régression aux réformes » (rectifié).

| Version | Variation moyenne de la grille l'année d'une grande réforme | Année normale | Écuries qui reculent (réforme / normale) |
| --- | --- | --- | --- |
| 12b bis (mesure corrigée) | −0,97 point | +0,59 | 67 % / 8 % |
| **12c** (coupe de 3) | **−1,49 point** | +0,71 | **84 %** / 6 % |

L'écart réforme contre année normale est d'environ 2,2 points (≈ 0,6 s au tour), dans la cible validée (2 à 3 points). La grille plafonne
vers 24 points après 2050 : pas de course à l'infini.

## 5. Profils des voitures et proposition du porteur

| Notes | Voitures 1res sur au moins un circuit | Paires inversées | Meilleure en moyenne | Victoires 2027 (10 saisons, 200 courses) | Titres 2027 |
| --- | --- | --- | --- | --- | --- |
| Actuelles | Mercédès 30 | 3 / 55 | Mercédès 19,46 | Mercédès 127, McLaren 46, Ferrari 14, Red Bull 13 | Mercédès 10 |
| Proposition du porteur | McLaren 19, Mercédès 11 | 11 / 55 | **McLaren 18,97** | McLaren 98, Mercédès 62, Red Bull 21, Ferrari 19 | McLaren 10 |
| Proposition, McLaren pneus 17 | Mercédès 15, McLaren 15 | 11 / 55 | **Mercédès 18,71** | McLaren 76, Mercédès 73, Red Bull 27, Ferrari 24 | Mercédès 7, McLaren 3 |
| Proposition, McLaren pneus 16 | Mercédès 24, McLaren 6 | 11 / 55 | Mercédès 18,71 | Mercédès 75, McLaren 71, Red Bull 28, Ferrari 26 | Mercédès 8, McLaren 2 |

Avec la physique recalée, les identités sont cohérentes : **Mercédès gagne les circuits rapides** (Monza, Las Vegas, Bakou, Djeddah, Spa,
Suzuka, Silverstone), **McLaren les circuits lents et de motricité** (Monaco, Hongrie, Singapour, Zandvoort, Mexico). Ferrari et Red Bull ne
sont jamais les plus rapides sur un circuit : leur retard moyen (≈ 1,2 point) dépasse ce que leur point fort rapporte ; elles gagnent des
courses (≈ 12 % chacune) grâce aux pilotes et aux circonstances. Pour qu'elles soient les plus rapides quelque part, il faudrait les
rapprocher en moyenne (données, décision du porteur) ; amplifier les concepts n'aide presque pas (essai : +1 circuit pour Ferrari).

**Recommandation** : la proposition du porteur avec la note de pneus de McLaren à 17 respecte D-083 (Mercédès référence, 7 titres sur 10)
sans écraser (37 % des victoires, contre 63 % avec les notes actuelles et ≈ 62 % en 2026 réelle). Choisir entre 16 et 17 selon
« Mercédès gagne un peu plus » ou « bataille à deux ».

## 6. Questions pour le porteur

1. Notes : adopter la proposition (McLaren pneus 17 ou 16) ? Valeurs de **motricité** des 11 voitures ?
2. Moteurs : Ferrary et Red Bul Forde à 17 et 16 : garder (Mercédès domine aussi par le moteur, comme en 2026) ou rapprocher ?
3. Coupe de réforme à 3 : garder ?
