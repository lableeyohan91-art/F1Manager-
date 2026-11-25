# Rapport d’équilibrage — 10 graines × 30 saisons

Scénario grille-2026, graines 1 à 10, 300 saisons simulées en 1 200,6 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 5,7 | 4,0 – 8,0 | 3,0 – 8,0 | 94 % | 7,4 |
| Écuries victorieuses par saison | 3,9 | 3,0 – 5,0 | 2,0 – 5,0 | 92 % | 5,3 |
| Part des victoires de l'écurie dominante | 56 % | 38 % – 76 % | 35 % – 80 % | 89 % | 47 % |
| Taux d’abandon par départ | 6 % | 4 % – 9 % | 5 % – 15 % | 60 % | 6 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,64 | 1,04 – 2,33 | 1,50 – 4,00 | 58 % | 0,98 |
| Écart de points entre les deux premiers | 59 | 8 – 135 | — | — | 58 |
| Changements de leader du championnat | 2,8 | 0,0 – 6,0 | — | — | 3,4 |
| Doublés par saison (toutes écuries) | 4,1 | 1,0 – 8,0 | — | — | 2,9 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,91 | 0,81 – 0,97 | — | — | 0,77 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 0,86 | 0,39 – 1,41 | — | — | 0,76 |
| Victoires inattendues par saison | 1,7 | 0,0 – 4,0 | — | — | 1,6 |
| Courses sous la pluie par saison | 2,2 | 1,0 – 4,0 | — | — | 2,2 |

## Par série de 30 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 30 saisons | 12,4 | 11,0 – 16,0 | 3,0 – 7,0 | 0 % | 12,8 |
| Champions constructeurs différents sur 30 saisons | 3,6 | 3,0 – 4,0 | — | — | 6,3 |
| Plus longue série de titres constructeurs consécutifs | 8,0 | 5,0 – 14,0 | — | — | 6,2 |
| Écuries sans aucune victoire sur 30 saisons | 2,0 | 1,0 – 3,0 | — | — | 0,1 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 10,2 | 6,0 – 15,0 | — | — | 38,9 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 2,0 | 1,4 – 2,8 | — | — | 3,8 |
| Transitions de saison sans aucun changement d’étage (D-081) | 27 % | 10 % – 52 % | — | — | 5 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 40 % | — | 40 % – 90 % | — | 80 % |
| Séries de 30 saisons avec 5 titres constructeurs consécutifs ou plus | 90 % | — | 0 % – 25 % | — | 70 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 32 % | — | — | — | 30 % |
| Retournement à la dernière manche (le leader perd le titre) | 7 % | — | — | — | 5 % |
| Champion et vice-champion coéquipiers | 33 % | — | — | — | 27 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 11 % | — | — | — | 8 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 21 % | — | — | — | 22 % |
| Saisons très serrées (≤ 10 points d’écart) | 14 % | — | — | — | 13 % |
| Dominations (≥ 120 points d’écart) | 14 % | — | — | — | 11 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,43 | 0,38 – 0,48 | — | — | 0,43 |
| Coéquipiers : écart moyen dû aux compétences | 0,22 | 0,15 – 0,31 | — | — | 0,22 |
| Coéquipiers : écart moyen dû à la forme | 0,02 | 0,01 – 0,02 | — | — | 0,02 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,34 – 0,40 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 26 % | 13 % – 40 % | — | — | 26 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 73 % | 59 % – 88 % | — | — | 73 % |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,92 | 0,85 – 0,97 | — | — | 0,86 |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,94 – 0,99 | — | — | 0,94 |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,97 – 1,00 | — | — | 0,97 |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,10 | 0,55 – 1,64 | — | — | 1,52 |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 27 % | 9 % – 45 % | — | — | 40 % |
| Pilotes : changements de position par concurrent sur la saison | 6,4 | 4,6 – 8,0 | — | — | 8,5 |
| Pilotes : écart moyen entre voisins (points) — haut | 41,2 | 26,4 – 55,8 | — | — | 35,3 |
| Pilotes : écart moyen entre voisins (points) — milieu | 19,1 | 12,0 – 25,9 | — | — | 13,9 |
| Pilotes : écart moyen entre voisins (points) — bas | 3,0 | 0,9 – 5,3 | — | — | 5,2 |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 97 % | 90 % – 100 % | — | — | 98 % |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 75 % | 67 % – 81 % | — | — | 80 % |
| Pilotes : frontières raisonnablement disputées — haut | 38 % | 20 % – 60 % | — | — | 46 % |
| Pilotes : frontières raisonnablement disputées — milieu | 70 % | 57 % – 86 % | — | — | 80 % |
| Pilotes : frontières raisonnablement disputées — bas | 99 % | 100 % – 100 % | — | — | 98 % |
| Pilotes : positions déjà acquises à 3 manches de la fin | 1 % | 0 % – 5 % | — | — | 1 % |
| Pilotes : positions déjà acquises — haut | 6 % | 0 % – 20 % | — | — | 5 % |
| Pilotes : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 46 % | 27 % – 64 % | — | — | 36 % |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 2 % | 0 % – 5 % | — | — | 2 % |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,94 | 0,88 – 0,98 | — | — | 0,89 |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,97 | 0,94 – 1,00 | — | — | 0,95 |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 1,00 | — | — | 0,97 |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,40 | 0,00 – 0,73 | — | — | 0,63 |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 6 % | 0 % – 18 % | — | — | 13 % |
| Constructeurs : changements de position par concurrent sur la saison | 3,5 | 1,9 – 5,2 | — | — | 5,4 |
| Constructeurs : écart moyen entre voisins (points) — haut | 118,2 | 79,3 – 153,8 | — | — | 86,3 |
| Constructeurs : écart moyen entre voisins (points) — milieu | 32,2 | 16,5 – 51,8 | — | — | 30,7 |
| Constructeurs : écart moyen entre voisins (points) — bas | 7,9 | 1,0 – 18,5 | — | — | 19,5 |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 86 % | 80 % – 100 % | — | — | 92 % |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 56 % | 50 % – 70 % | — | — | 59 % |
| Constructeurs : frontières raisonnablement disputées — haut | 22 % | 0 % – 50 % | — | — | 35 % |
| Constructeurs : frontières raisonnablement disputées — milieu | 70 % | 50 % – 100 % | — | — | 70 % |
| Constructeurs : frontières raisonnablement disputées — bas | 97 % | 100 % – 100 % | — | — | 85 % |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 5 % | 0 % – 18 % | — | — | 4 % |
| Constructeurs : positions déjà acquises — haut | 15 % | 0 % – 50 % | — | — | 11 % |
| Constructeurs : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — | 0 % |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 51 % | 27 % – 73 % | — | — | 49 % |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 7 % | 0 % – 18 % | — | — | 5 % |

## Chronique d’exemple (graine 1)

**2027** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 344 points et 8 victoires, 2 points devant George Russel (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Kimi Antoneli arrache le titre à George Russel.
- Mercédes décroche le titre des constructeurs (10e titre de son histoire).
- Mercédes signe 5 doublés.
- Victoire surprise de Max Verstapen (Red Bul) à Sakir.
- Victoire surprise de Lewis Hammilton (Ferrary) à Madrit, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Las Vegaz.
- Cadilac termine la saison sans marquer le moindre point.

**2028** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 411 points et 9 victoires, 97 points devant George Russel (Mercédes).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Mercédes signe 10 doublés.
- Victoire surprise de Oscar Piastry (McLarren) à Albert Parc.
- Victoire surprise de Oscar Piastry (McLarren) à Monzza.
- Victoire surprise de Max Verstapen (Red Bul) à Marinna Bay.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 387 points et 9 victoires, 50 points devant George Russel (Mercédes).
- La tête du championnat a changé 5 fois.
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Mercédes signe 8 doublés.
- Victoire surprise de Kimi Antoneli (McLarren) à Spa-Francorchamp.
- Cadilac progresse de la 11e à la 8e place.
- Racing Buls termine la saison sans marquer le moindre point.
- Audy termine la saison sans marquer le moindre point.

**2030** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 361 points et 7 victoires, 21 points devant Oscar Piastry (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Mercédes signe 7 doublés.
- Victoire surprise de Samuel Marlow (Ferrary) à Las Vegaz.
- Aston Martyn recule de la 7e à la 10e place.

**2031** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 371 points et 7 victoires, 26 points devant Max Verstapen (Ferrary).
- Le titre restait ouvert avant la dernière manche.
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Aston Martyn progresse de la 10e à la 7e place.
- Cadilac recule de la 8e à la 11e place.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 387 points et 10 victoires, 85 points devant Kimi Antoneli (Red Bul).
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Red Bul) à Hungarorring.
- Cadilac progresse de la 11e à la 8e place.

**2033** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 402 points et 11 victoires, 61 points devant Kimi Antoneli (Red Bul).
- McLarren décroche le titre des constructeurs (13e titre de son histoire).
- Cadilac recule de la 8e à la 11e place.

**2034** — champion : Fleur Postma
- Fleur Postma (Mercédes) remporte le titre avec 293 points et 4 victoires, 16 points devant Kimi Antoneli (Red Bul).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 6 fois.
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Red Bul) à Shangai.
- Victoire surprise de Oscar Piastry (Red Bul) à Imolla.
- Victoire surprise de Oscar Piastry (Red Bul) à Gilles-Villeneuves.
- Victoire surprise de Kimi Antoneli (Red Bul) à Silverston.
- Victoire surprise de Oscar Piastry (Red Bul) à Sepanng.
- Racing Buls progresse de la 10e à la 7e place.
- Haass recule de la 7e à la 10e place.
- Alpyne recule de la 8e à la 11e place.
- Alpyne termine la saison sans marquer le moindre point.

**2035** — champion : Samuel Carlisle
- Samuel Carlisle (McLarren) remporte le titre avec 358 points et 6 victoires, 18 points devant Fleur Postma (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- McLarren décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Álvaro Ferrer (Ferrary) à Sepanng, sous la pluie.

**2036** — champion : Taylor Prescott
- Taylor Prescott (Mercédes) remporte le titre avec 375 points et 9 victoires, 29 points devant Samuel Carlisle (McLarren).
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Mercédes signe 5 doublés.
- Cadilac progresse de la 10e à la 7e place.
- Haass termine la saison sans marquer le moindre point.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

**2037** — champion : Taylor Prescott
- Taylor Prescott (Mercédes) remporte le titre avec 415 points et 12 victoires, 139 points devant Samuel Marlow (Mercédes).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Mercédes signe 5 doublés.
- Victoire surprise de Anna Kessler (Ferrary) à Istambull, sous la pluie.
- Cadilac recule de la 7e à la 10e place.
- Haass termine la saison sans marquer le moindre point.

**2038** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 343 points et 9 victoires, 13 points devant Samuel Marlow (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 6 fois.
- Mercédes décroche le titre des constructeurs (16e titre de son histoire).
- Mercédes signe 6 doublés.
- Victoire surprise de Fleur Postma (Ferrary) à Kyalamy.
- Victoire surprise de Kimi Antoneli (Ferrary) à Miamy, sous la pluie.
- Victoire surprise de Kimi Antoneli (Ferrary) à Spa-Francorchamp, sous la pluie.
- Victoire surprise de Kimi Antoneli (Ferrary) à Marinna Bay.
- Audy recule de la 8e à la 11e place.

**2039** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 408 points et 10 victoires, 116 points devant Louis Lambert (Ferrary).
- La tête du championnat a changé 4 fois.
- Mercédes décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Louis Lambert (Ferrary) à Suzuca, sous la pluie.
- Victoire surprise de Kimi Antoneli (Ferrary) à Imolla.
- Victoire surprise de Adrián Aranda (Wiliams) à Monzza, sous la pluie.
- Victoire surprise de Louis Lambert (Ferrary) à Interlagoss.
- Cadilac termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2040** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 459 points et 15 victoires, 163 points devant Louis Lambert (Ferrary).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (18e titre de son histoire).
- Cadilac termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.
- Red Bul, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2041** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 454 points et 16 victoires, 159 points devant Ruben Bos (McLarren).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (19e titre de son histoire).
- Alpyne progresse de la 9e à la 6e place.
- Cadilac termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2042** — champion : Samuel Carlisle
- Samuel Carlisle (Ferrary) remporte le titre avec 290 points et 5 victoires, 8 points devant George Radcliffe (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Samuel Carlisle arrache le titre à George Radcliffe.
- La tête du championnat a changé 12 fois.
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Clara Nielsen (Red Bul) à Jedda.
- Victoire surprise de Samuel Carlisle (Ferrary) à Silverston.
- Victoire surprise de Samuel Carlisle (Ferrary) à Monzza, sous la pluie.
- Mercédes recule de la 1re à la 4e place.
- Cadilac termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2043** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 383 points et 9 victoires, 78 points devant Samuel Carlisle (McLarren).
- Mercédes décroche le titre des constructeurs (20e titre de son histoire).
- Mercédes progresse de la 4e à la 1re place.
- Cadilac termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2044** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 344 points et 5 victoires, 78 points devant Anna Kessler (Red Bul).
- Mercédes décroche le titre des constructeurs (21e titre de son histoire).
- Haass termine la saison sans marquer le moindre point.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2045** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 316 points et 5 victoires, 23 points devant Ruben Bos (Ferrary).
- Mercédes décroche le titre des constructeurs (22e titre de son histoire).
- Victoire surprise de Álvaro Ferrer (Racing Buls) à Istambull, sous la pluie.
- Haass termine la saison sans marquer le moindre point.

**2046** — champion : Markus Albrecht
- Markus Albrecht (Ferrary) remporte le titre avec 366 points et 8 victoires, 58 points devant Ruben Bos (Ferrary).
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Ferrary signe 5 doublés.
- Mercédes recule de la 1re à la 4e place.
- Alpyne termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2047** — champion : Markus Albrecht
- Markus Albrecht (Ferrary) remporte le titre avec 386 points et 10 victoires, 124 points devant Céline Schmid (McLarren).
- Une domination sans partage.
- Ferrary décroche le titre des constructeurs (19e titre de son histoire).
- Haass termine la saison sans marquer le moindre point.

**2048** — champion : Markus Albrecht
- Markus Albrecht (Ferrary) remporte le titre avec 284 points et 6 victoires, 47 points devant George Radcliffe (Ferrary).
- Ferrary décroche le titre des constructeurs (20e titre de son histoire).
- Victoire surprise de Baptiste Bertrand (Wiliams) à Spa-Francorchamp, sous la pluie.
- Victoire surprise de Niklas Bauer (Wiliams) à Hermanos Rodrigues.
- Haass termine la saison sans marquer le moindre point.

**2049** — champion : Markus Albrecht
- Markus Albrecht (Red Bul) remporte le titre avec 316 points et 4 victoires, 8 points devant Ruben Bos (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Markus Albrecht arrache le titre à Ruben Bos.
- McLarren décroche le titre des constructeurs (15e titre de son histoire).
- McLarren progresse de la 4e à la 1re place.
- Haass termine la saison sans marquer le moindre point.

**2050** — champion : Markus Albrecht
- Markus Albrecht (Red Bul) remporte le titre avec 309 points et 7 victoires, 28 points devant Thijs Brouwer (Ferrary).
- Le titre restait ouvert avant la dernière manche.
- Ferrary décroche le titre des constructeurs (21e titre de son histoire).
- Victoire surprise de Ruben Bos (Wiliams) à Kyalamy, sous la pluie.
- McLarren recule de la 1re à la 4e place.
- Alpyne recule de la 7e à la 10e place.
- Haass termine la saison sans marquer le moindre point.

**2051** — champion : Markus Albrecht
- Markus Albrecht (Red Bul) remporte le titre avec 359 points et 10 victoires, 49 points devant Baptiste Bertrand (Mercédes).
- La tête du championnat a changé 4 fois.
- Ferrary décroche le titre des constructeurs (22e titre de son histoire).
- Haass termine la saison sans marquer le moindre point.

**2052** — champion : George Radcliffe
- George Radcliffe (Ferrary) remporte le titre avec 343 points et 8 victoires, 23 points devant Markus Albrecht (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 4 fois.
- Mercédes décroche le titre des constructeurs (23e titre de son histoire).
- Cadilac progresse de la 9e à la 6e place.

**2053** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 366 points et 9 victoires, 53 points devant Baptiste Bertrand (Ferrary).
- Mercédes décroche le titre des constructeurs (24e titre de son histoire).
- Cadilac recule de la 6e à la 10e place.
- Haass termine la saison sans marquer le moindre point.

**2054** — champion : Baptiste Bertrand
- Baptiste Bertrand (Ferrary) remporte le titre avec 290 points et 6 victoires, 21 points devant Céline Schmid (McLarren).
- La tête du championnat a changé 6 fois.
- Ferrary décroche le titre des constructeurs (23e titre de son histoire).
- Victoire surprise de Dylan Whitaker (Cadilac) à Jedda.
- Victoire surprise de Thijs Brouwer (Wiliams) à Spielbergh, sous la pluie.
- Victoire surprise de Thijs Brouwer (Wiliams) à Silverston.
- Cadilac progresse de la 10e à la 7e place.

**2055** — champion : Hannah Ellery
- Hannah Ellery (Ferrary) remporte le titre avec 258 points et 4 victoires, 9 points devant Antti Järvinen (Ferrary).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 10 fois.
- Ferrary décroche le titre des constructeurs (24e titre de son histoire).
- Victoire surprise de Thijs Brouwer (Red Bul) à Albert Parc.
- Victoire surprise de Thomas Kingsley (Aston Martyn) à Jedda.
- Victoire surprise de Thomas Vasselin (Racing Buls) à Portimau.
- Victoire surprise de Thomas Kingsley (Aston Martyn) à Gilles-Villeneuves, sous la pluie.
- Victoire surprise de Céline Schmid (Wiliams) à Las Vegaz.
- Aston Martyn progresse de la 9e à la 5e place.
- Audy recule de la 8e à la 11e place.

**2056** — champion : Hannah Ellery
- Hannah Ellery (Ferrary) remporte le titre avec 305 points et 7 victoires, 31 points devant Larissa Cardoso (Ferrary).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 4 fois.
- Ferrary décroche le titre des constructeurs (25e titre de son histoire).
- Victoire surprise de Markus Brandt (Alpyne) à Las Vegaz.
- Audy termine la saison sans marquer le moindre point.

