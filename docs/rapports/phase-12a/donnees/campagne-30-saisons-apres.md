# Rapport d’équilibrage — 10 graines × 30 saisons

Scénario grille-2026, graines 1 à 10, 300 saisons simulées en 1 112,4 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 5,9 | 4,0 – 8,0 | 3,0 – 8,0 | 90 % | 7,4 |
| Écuries victorieuses par saison | 3,9 | 2,0 – 6,0 | 2,0 – 5,0 | 88 % | 5,3 |
| Part des victoires de l'écurie dominante | 57 % | 35 % – 80 % | 35 % – 80 % | 84 % | 47 % |
| Taux d’abandon par départ | 6 % | 4 % – 9 % | 5 % – 15 % | 60 % | 6 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,58 | 0,95 – 2,32 | 1,50 – 4,00 | 54 % | 0,98 |
| Écart de points entre les deux premiers | 63 | 8 – 138 | — | — | 58 |
| Changements de leader du championnat | 2,8 | 0,0 – 7,0 | — | — | 3,4 |
| Doublés par saison (toutes écuries) | 4,3 | 1,0 – 8,0 | — | — | 2,9 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,92 | 0,83 – 0,97 | — | — | 0,77 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 0,79 | 0,43 – 1,22 | — | — | 0,76 |
| Victoires inattendues par saison | 1,4 | 0,0 – 4,0 | — | — | 1,6 |
| Courses sous la pluie par saison | 2,2 | 1,0 – 4,0 | — | — | 2,2 |

## Par série de 30 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 30 saisons | 12,9 | 12,0 – 16,0 | 3,0 – 7,0 | 0 % | 12,8 |
| Champions constructeurs différents sur 30 saisons | 3,7 | 2,0 – 5,0 | — | — | 6,3 |
| Plus longue série de titres constructeurs consécutifs | 8,1 | 5,0 – 12,0 | — | — | 6,2 |
| Écuries sans aucune victoire sur 30 saisons | 1,9 | 1,0 – 4,0 | — | — | 0,1 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 9,4 | 5,0 – 15,0 | — | — | 38,9 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 2,1 | 1,6 – 3,1 | — | — | 3,8 |
| Transitions de saison sans aucun changement d’étage (D-081) | 23 % | 7 % – 34 % | — | — | 5 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 36 % | — | 40 % – 90 % | — | 80 % |
| Séries de 30 saisons avec 5 titres constructeurs consécutifs ou plus | 90 % | — | 0 % – 25 % | — | 70 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 27 % | — | — | — | 30 % |
| Retournement à la dernière manche (le leader perd le titre) | 7 % | — | — | — | 5 % |
| Champion et vice-champion coéquipiers | 34 % | — | — | — | 27 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 10 % | — | — | — | 8 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 17 % | — | — | — | 22 % |
| Saisons très serrées (≤ 10 points d’écart) | 12 % | — | — | — | 13 % |
| Dominations (≥ 120 points d’écart) | 14 % | — | — | — | 11 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,43 | 0,38 – 0,49 | — | — | 0,43 |
| Coéquipiers : écart moyen dû aux compétences | 0,22 | 0,14 – 0,31 | — | — | 0,22 |
| Coéquipiers : écart moyen dû à la forme | 0,02 | 0,01 – 0,02 | — | — | 0,02 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,34 – 0,39 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 26 % | 13 % – 40 % | — | — | 26 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 73 % | 57 % – 87 % | — | — | 73 % |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,92 | 0,86 – 0,96 | — | — | 0,86 |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,94 – 0,99 | — | — | 0,94 |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 1,00 | — | — | 0,97 |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,11 | 0,55 – 1,64 | — | — | 1,52 |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 27 % | 9 % – 45 % | — | — | 40 % |
| Pilotes : changements de position par concurrent sur la saison | 6,4 | 4,7 – 8,5 | — | — | 8,5 |
| Pilotes : écart moyen entre voisins (points) — haut | 41,3 | 24,8 – 57,4 | — | — | 35,3 |
| Pilotes : écart moyen entre voisins (points) — milieu | 19,0 | 11,7 – 26,3 | — | — | 13,9 |
| Pilotes : écart moyen entre voisins (points) — bas | 3,1 | 1,0 – 5,7 | — | — | 5,2 |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 97 % | 95 % – 100 % | — | — | 98 % |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 75 % | 67 % – 81 % | — | — | 80 % |
| Pilotes : frontières raisonnablement disputées — haut | 38 % | 20 % – 60 % | — | — | 46 % |
| Pilotes : frontières raisonnablement disputées — milieu | 71 % | 57 % – 86 % | — | — | 80 % |
| Pilotes : frontières raisonnablement disputées — bas | 99 % | 100 % – 100 % | — | — | 98 % |
| Pilotes : positions déjà acquises à 3 manches de la fin | 1 % | 0 % – 5 % | — | — | 1 % |
| Pilotes : positions déjà acquises — haut | 6 % | 0 % – 20 % | — | — | 5 % |
| Pilotes : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 44 % | 27 % – 64 % | — | — | 36 % |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 2 % | 0 % – 5 % | — | — | 2 % |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,94 | 0,88 – 0,99 | — | — | 0,89 |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,97 | 0,94 – 1,00 | — | — | 0,95 |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 1,00 | — | — | 0,97 |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,39 | 0,00 – 0,73 | — | — | 0,63 |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 6 % | 0 % – 18 % | — | — | 13 % |
| Constructeurs : changements de position par concurrent sur la saison | 3,5 | 1,9 – 5,3 | — | — | 5,4 |
| Constructeurs : écart moyen entre voisins (points) — haut | 117,3 | 68,3 – 153,8 | — | — | 86,3 |
| Constructeurs : écart moyen entre voisins (points) — milieu | 33,2 | 17,3 – 52,8 | — | — | 30,7 |
| Constructeurs : écart moyen entre voisins (points) — bas | 7,9 | 0,5 – 17,5 | — | — | 19,5 |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 87 % | 80 % – 100 % | — | — | 92 % |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 55 % | 50 % – 70 % | — | — | 59 % |
| Constructeurs : frontières raisonnablement disputées — haut | 21 % | 0 % – 50 % | — | — | 35 % |
| Constructeurs : frontières raisonnablement disputées — milieu | 69 % | 50 % – 100 % | — | — | 70 % |
| Constructeurs : frontières raisonnablement disputées — bas | 97 % | 100 % – 100 % | — | — | 85 % |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 6 % | 0 % – 18 % | — | — | 4 % |
| Constructeurs : positions déjà acquises — haut | 16 % | 0 % – 50 % | — | — | 11 % |
| Constructeurs : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 52 % | 27 % – 73 % | — | — | 49 % |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 8 % | 0 % – 18 % | — | — | 5 % |

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
- Kimi Antoneli (McLarren) remporte le titre avec 386 points et 8 victoires, 48 points devant Oscar Piastry (Mercédes).
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Aston Martyn progresse de la 10e à la 7e place.
- Racing Buls termine la saison sans marquer le moindre point.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 394 points et 10 victoires, 90 points devant Kimi Antoneli (Red Bul).
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Racing Buls termine la saison sans marquer le moindre point.

**2033** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 417 points et 12 victoires, 71 points devant Kimi Antoneli (Red Bul).
- McLarren décroche le titre des constructeurs (13e titre de son histoire).
- Racing Buls termine la saison sans marquer le moindre point.

**2034** — champion : Fleur Postma
- Fleur Postma (Mercédes) remporte le titre avec 308 points et 4 victoires, 9 points devant Kimi Antoneli (Red Bul).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Fleur Postma arrache le titre à Kimi Antoneli.
- La tête du championnat a changé 8 fois.
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Red Bul) à Shangai.
- Victoire surprise de Oscar Piastry (Red Bul) à Imolla.
- Victoire surprise de Oscar Piastry (Red Bul) à Gilles-Villeneuves.
- Victoire surprise de Kimi Antoneli (Red Bul) à Catalunia.
- Victoire surprise de Kimi Antoneli (Red Bul) à Silverston.
- Victoire surprise de Oscar Piastry (Red Bul) à Sepanng.
- Cadilac progresse de la 10e à la 7e place.

**2035** — champion : Fleur Postma
- Fleur Postma (Mercédes) remporte le titre avec 358 points et 8 victoires, 2 points devant Samuel Carlisle (McLarren).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Fleur Postma arrache le titre à Samuel Carlisle.
- La tête du championnat a changé 4 fois.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Álvaro Ferrer (Ferrary) à Sepanng, sous la pluie.
- Audy progresse de la 10e à la 7e place.
- Cadilac recule de la 7e à la 10e place.
- Racing Buls termine la saison sans marquer le moindre point.

**2036** — champion : Taylor Prescott
- Taylor Prescott (Mercédes) remporte le titre avec 384 points et 10 victoires, 31 points devant Samuel Carlisle (McLarren).
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Mercédes signe 5 doublés.
- Racing Buls termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

**2037** — champion : Taylor Prescott
- Taylor Prescott (Mercédes) remporte le titre avec 449 points et 15 victoires, 142 points devant Daniel Hollis (McLarren).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (16e titre de son histoire).
- Racing Buls termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2038** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 382 points et 13 victoires, 138 points devant Kimi Antoneli (Ferrary).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (17e titre de son histoire).
- Mercédes signe 5 doublés.
- Victoire surprise de Fleur Postma (Ferrary) à Kyalamy.
- Victoire surprise de Kimi Antoneli (Ferrary) à Marinna Bay.
- Audy recule de la 8e à la 11e place.
- Audy termine la saison sans marquer le moindre point.

**2039** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 436 points et 13 victoires, 171 points devant Louis Lambert (Ferrary).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (18e titre de son histoire).
- Mercédes signe 5 doublés.
- Victoire surprise de Louis Lambert (Ferrary) à Suzuca, sous la pluie.
- Victoire surprise de Louis Lambert (Ferrary) à Portimau.
- Victoire surprise de Kimi Antoneli (Ferrary) à Imolla.
- Victoire surprise de Louis Lambert (Ferrary) à Istambull.
- Cadilac termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2040** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 486 points et 18 victoires, 190 points devant Philipp Wallner (Mercédes).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (19e titre de son histoire).
- Mercédes signe 11 doublés.
- Cadilac termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.
- Red Bul, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2041** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 461 points et 17 victoires, 161 points devant Philipp Wallner (Mercédes).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (20e titre de son histoire).
- Mercédes signe 9 doublés.
- Haass termine la saison sans marquer le moindre point.

**2042** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 312 points et 6 victoires, 4 points devant Philipp Wallner (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Markus Albrecht arrache le titre à Philipp Wallner.
- La tête du championnat a changé 6 fois.
- Mercédes décroche le titre des constructeurs (21e titre de son histoire).
- Victoire surprise de Samuel Carlisle (Audy) à Zandvort, sous la pluie.
- Victoire surprise de Samuel Carlisle (Audy) à Monzza, sous la pluie.
- Victoire surprise de Hao Guo (Ferrary) à Sepanng.
- Red Bul progresse de la 6e à la 3e place.

**2043** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 442 points et 15 victoires, 154 points devant Ruben Bos (McLarren).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (22e titre de son histoire).
- Mercédes signe 5 doublés.
- Haass termine la saison sans marquer le moindre point.

**2044** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 399 points et 9 victoires, 181 points devant Baptiste Bertrand (Red Bul).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (23e titre de son histoire).
- McLarren recule de la 2e à la 5e place.
- Audy progresse de la 10e à la 6e place.
- Alpyne recule de la 7e à la 10e place.
- Haass termine la saison sans marquer le moindre point.

**2045** — champion : Markus Albrecht
- Markus Albrecht (McLarren) remporte le titre avec 303 points et 6 victoires, 62 points devant Niklas Bauer (Mercédes).
- McLarren décroche le titre des constructeurs (14e titre de son histoire).
- McLarren progresse de la 5e à la 1re place.
- Audy recule de la 6e à la 9e place.
- Cadilac termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2046** — champion : Markus Albrecht
- Markus Albrecht (McLarren) remporte le titre avec 340 points et 7 victoires, 32 points devant Niklas Bauer (Mercédes).
- La tête du championnat a changé 5 fois.
- McLarren décroche le titre des constructeurs (15e titre de son histoire).
- Cadilac progresse de la 10e à la 7e place.

**2047** — champion : Markus Albrecht
- Markus Albrecht (McLarren) remporte le titre avec 406 points et 13 victoires, 141 points devant Ruben Bos (McLarren).
- Une domination sans partage.
- McLarren décroche le titre des constructeurs (16e titre de son histoire).
- McLarren signe 5 doublés.
- Victoire surprise de Hao Guo (Aston Martyn) à Sepanng, sous la pluie.
- Alpyne termine la saison sans marquer le moindre point.

**2048** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 326 points et 6 victoires, 46 points devant Clara Nielsen (McLarren).
- Mercédes décroche le titre des constructeurs (24e titre de son histoire).

**2049** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 405 points et 9 victoires, 151 points devant Baptiste Bertrand (Ferrary).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (25e titre de son histoire).
- Alpyne progresse de la 11e à la 7e place.
- Haass termine la saison sans marquer le moindre point.

**2050** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 322 points et 6 victoires, 38 points devant Baptiste Bertrand (Ferrary).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (26e titre de son histoire).
- Haass termine la saison sans marquer le moindre point.

**2051** — champion : Markus Albrecht
- Markus Albrecht (McLarren) remporte le titre avec 298 points et 5 victoires, 67 points devant Baptiste Bertrand (Ferrary).
- McLarren décroche le titre des constructeurs (17e titre de son histoire).
- Cadilac recule de la 7e à la 10e place.
- Haass termine la saison sans marquer le moindre point.

**2052** — champion : George Radcliffe
- George Radcliffe (Mercédes) remporte le titre avec 314 points et 8 victoires, 54 points devant Baptiste Bertrand (Mercédes).
- Mercédes décroche le titre des constructeurs (27e titre de son histoire).
- Victoire surprise de Ren Shimizu (Audy) à Monacco.
- Victoire surprise de Nico Steiner (Racing Buls) à Austen.
- Cadilac progresse de la 10e à la 5e place.
- Wiliams recule de la 6e à la 9e place.

**2053** — champion : Markus Albrecht
- Markus Albrecht (Ferrary) remporte le titre avec 405 points et 12 victoires, 180 points devant Camille Dufresne (Ferrary).
- Une domination sans partage.
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Céline Schmid (Alpyne) à Albert Parc.
- Victoire surprise de Baptiste Bertrand (Mercédes) à Marinna Bay.
- Alpyne progresse de la 8e à la 5e place.

**2054** — champion : Nicolas Delmas
- Nicolas Delmas (Red Bul) remporte le titre avec 286 points et 4 victoires, 46 points devant Austin Baxter (Ferrary).
- La tête du championnat a changé 9 fois.
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Victoire surprise de Sota Inoue (Cadilac) à Shangai.
- Victoire surprise de Ren Shimizu (Mercédes) à Suzuca.
- Victoire surprise de Felix Neumann (Alpyne) à Spielbergh, sous la pluie.
- Victoire surprise de Baptiste Bertrand (Alpyne) à Zandvort.
- Victoire surprise de Baptiste Bertrand (Alpyne) à Hermanos Rodrigues.
- Haass termine la saison sans marquer le moindre point.

**2055** — champion : Austin Baxter
- Austin Baxter (Ferrary) remporte le titre avec 289 points et 5 victoires, 46 points devant Larissa Cardoso (Red Bul).
- Ferrary décroche le titre des constructeurs (19e titre de son histoire).
- Victoire surprise de Baptiste Bertrand (Alpyne) à Silverston.
- Victoire surprise de Baptiste Bertrand (Alpyne) à Monzza.
- Wiliams termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2056** — champion : Larissa Cardoso
- Larissa Cardoso (Red Bul) remporte le titre avec 289 points et 6 victoires, 18 points devant Nicolas Delmas (Red Bul).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 4 fois.
- Red Bul décroche le titre des constructeurs (8e titre de son histoire).
- Mercédes progresse de la 5e à la 2e place.
- Ferrary recule de la 1re à la 4e place.
- Alpyne recule de la 4e à la 8e place.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

