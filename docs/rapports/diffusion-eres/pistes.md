# Trois pistes, efficacité individuelle (27/11/2026)

Mesure indicative (D-120). Mêmes graines (10 × 30 saisons), mêmes mécaniques ; référence = version avec rattrapage des motoristes (`campagne-apres-moteurs.md`). Chaque piste est un paramètre (désactivée par défaut) :

- **P1** `reforme.lecture=1` : à chaque réforme, chaque écurie lit plus ou moins bien le nouveau règlement (perte de savoir × 0,5 à 1,5, tirage indépendant du classement, événement public si la lecture est très bonne ou très mauvaise).
- **P2** `recherche.diffusionRetard=1` : plus une écurie est loin du meilleur, plus elle copie vite (savoir et pièces).
- **P3** `usure.renforcee=1` : usure du succès des cadres × 1,7, maximum 0,9 (exception D-140).

Tableau complet de tous les indicateurs : `comparaison-pistes.md`.

## Indicateurs principaux

| Indicateur | Réf. | P1 | P2 | P3 | Les trois |
| --- | --- | --- | --- | --- | --- |
| Dynasties (séries à 5 titres ou plus) | 70 % | 60 % | 60 % | 60 % | **50 %** |
| Plus longue série de titres | 5,2 | 5,2 | 5,1 | 4,9 | 4,9 |
| Champions constructeurs différents (30 saisons) | 8,0 | 7,6 | 8,6 | 8,0 | **8,8** |
| Remontées (+3 places) | 39,8 | 38,5 | 41,7 | 42,5 | **43,0** |
| Titre ouvert avant la dernière manche | 33 % | 29 % | **34 %** | 33 % | 32 % |
| Lutte finale entre écuries différentes | 29 % | 25 % | **31 %** | 29 % | 28 % |
| Saisons très serrées entre écuries | 15 % | 11 % | **16 %** | 11 % | 11 % |
| Dominations entre écuries (≥ 120 pts) | 14 % | 16 % | 13 % | 13 % | **12 %** |
| Domination constructeurs (≥ 150 pts) | 24 % | 29 % | 24 % | 26 % | 28 % |
| Champion et vice-champion coéquipiers | 14 % | 17 % | 15 % | 15 % | 21 % |
| Dernière écurie qui marque | 81 % | 81 % | **83 %** | 82 % | 77 % |
| Écart 1re–dernière voiture (saison) | 0,79 % | 0,83 % | 0,77 % | 0,81 % | 0,85 % |
| Titres du plus titré (sur 300) | McLaren 57 | Aston 56 | McLaren 56 | McLaren 49 | McLaren 53 |

## Au cours d'une ère (écart en % du tour : 1re–11e / 1re–4e / 4e–11e)

| Saison de l'ère | Réf. | P1 | P2 | P3 | Les trois |
| --- | --- | --- | --- | --- | --- |
| 1 | 0,77 / 0,21 / 0,56 | 0,82 / 0,25 / 0,57 | 0,78 / 0,23 / 0,54 | 0,76 / 0,23 / 0,53 | **0,92 / 0,29 / 0,63** |
| 3 | 0,72 / 0,16 / 0,56 | 0,76 / 0,21 / 0,55 | 0,71 / 0,18 / 0,53 | 0,75 / 0,17 / 0,57 | 0,81 / 0,22 / 0,59 |
| 5 | 0,65 / 0,11 / 0,54 | 0,67 / 0,11 / 0,56 | 0,68 / 0,12 / 0,56 | 0,71 / 0,13 / 0,58 | 0,72 / 0,13 / 0,59 |
| 6 | 0,66 / 0,10 / 0,56 | 0,63 / 0,12 / 0,51 | 0,68 / 0,12 / 0,56 | 0,71 / 0,12 / 0,59 | 0,72 / 0,12 / 0,60 |

## Lecture, dite franchement

- **Bruit** : avec 10 graines, les dynasties bougent par pas de 10 % (une série sur dix). 70 → 60 % pour une piste seule est dans le bruit ; 70 → 50 % pour les trois ensemble commence à être un signal.
- **P1 (lecture du règlement)** fait ce qu'elle doit : la grille repart plus écartée au début de l'ère (0,77 → 0,82 %) et se resserre ensuite (0,63 % en saison 6). Mais elle crée des dominations en début d'ère (dominations 14 → 16 %, constructeurs 24 → 29 %, titre ouvert 33 → 29 %) : une écurie qui lit bien le règlement s'envole. Aston gagne 56 titres : une graine où elle lit bien deux réformes de suite.
- **P2 (copie facilitée)** améliore légèrement la lutte (titre ouvert, saisons serrées, dernière écurie qui marque, champions différents) mais **ne resserre pas le bas de grille** (4e–11e inchangé, 0,53–0,56 %). L'objectif visé n'est pas atteint : le retard du bas de grille ne vient pas surtout du savoir copiable.
- **P3 (usure renforcée)** casse un peu les longues séries (plus longue série 4,9, remontées 42,5, McLaren 57 → 49 titres), au prix de saisons moins serrées (15 → 11 %).
- **Les trois ensemble** : meilleur résultat sur les dynasties (50 %), les champions différents (8,8) et les remontées (43) ; début d'ère le plus écarté (0,92 %, objectif « repartir de loin » approché) ; défavorable : coéquipiers champion et vice-champion 21 %, dernière écurie qui marque 77 %, saisons serrées 11 %, domination constructeurs 28 %.
- **Objectif non atteint dans tous les cas** : le bas de grille ne se resserre pas en fin d'ère (4e–11e ≈ 0,55–0,60 %). La cause n'est pas encore identifiée (pistes à vérifier : budget et part de recherche, moteurs clients, pilotes). Dynasties toujours au-dessus de l'objectif 0–25 %.
