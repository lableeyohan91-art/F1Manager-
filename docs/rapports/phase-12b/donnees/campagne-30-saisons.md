# Rapport d’équilibrage — 10 graines × 30 saisons

Scénario grille-2026, graines 1 à 10, 300 saisons simulées en 1 137,6 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 6,0 | 4,0 – 8,0 | 3,0 – 8,0 | 91 % | 7,4 |
| Écuries victorieuses par saison | 4,1 | 2,0 – 6,0 | 2,0 – 5,0 | 84 % | 5,3 |
| Part des victoires de l'écurie dominante | 56 % | 35 % – 80 % | 35 % – 80 % | 84 % | 47 % |
| Taux d’abandon par départ | 6 % | 3 % – 9 % | 5 % – 15 % | 59 % | 6 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,50 | 0,95 – 2,15 | 1,50 – 4,00 | 43 % | 0,98 |
| Écart de points entre les deux premiers | 59 | 7 – 131 | — | — | 58 |
| Changements de leader du championnat | 2,8 | 0,0 – 6,0 | — | — | 3,4 |
| Doublés par saison (toutes écuries) | 4,2 | 1,0 – 8,0 | — | — | 2,9 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,89 | 0,77 – 0,97 | — | — | 0,77 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 0,87 | 0,45 – 1,34 | — | — | 0,76 |
| Victoires inattendues par saison | 1,8 | 0,0 – 4,0 | — | — | 1,6 |
| Courses sous la pluie par saison | 2,2 | 1,0 – 4,0 | — | — | 2,2 |

## Par série de 30 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 30 saisons | 13,1 | 12,0 – 16,0 | 3,0 – 7,0 | 0 % | 12,8 |
| Champions constructeurs différents sur 30 saisons | 3,7 | 3,0 – 5,0 | — | — | 6,3 |
| Plus longue série de titres constructeurs consécutifs | 7,9 | 5,0 – 11,0 | — | — | 6,2 |
| Écuries sans aucune victoire sur 30 saisons | 1,3 | 1,0 – 3,0 | — | — | 0,1 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 13,8 | 8,0 – 22,0 | — | — | 38,9 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 2,3 | 1,8 – 2,9 | — | — | 3,8 |
| Transitions de saison sans aucun changement d’étage (D-081) | 19 % | 10 % – 31 % | — | — | 5 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 46 % | — | 40 % – 90 % | — | 80 % |
| Séries de 30 saisons avec 5 titres constructeurs consécutifs ou plus | 90 % | — | 0 % – 25 % | — | 70 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 29 % | — | — | — | 30 % |
| Retournement à la dernière manche (le leader perd le titre) | 6 % | — | — | — | 5 % |
| Champion et vice-champion coéquipiers | 35 % | — | — | — | 27 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 8 % | — | — | — | 8 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 21 % | — | — | — | 22 % |
| Saisons très serrées (≤ 10 points d’écart) | 14 % | — | — | — | 13 % |
| Dominations (≥ 120 points d’écart) | 13 % | — | — | — | 11 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,43 | 0,39 – 0,49 | — | — | 0,43 |
| Coéquipiers : écart moyen dû aux compétences | 0,22 | 0,16 – 0,30 | — | — | 0,22 |
| Coéquipiers : écart moyen dû à la forme | 0,02 | 0,01 – 0,02 | — | — | 0,02 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,33 – 0,40 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 27 % | 15 % – 40 % | — | — | 26 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 72 % | 57 % – 86 % | — | — | 73 % |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,91 | 0,86 – 0,96 | — | — | 0,86 |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,94 – 0,99 | — | — | 0,94 |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 1,00 | — | — | 0,97 |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,16 | 0,64 – 1,64 | — | — | 1,52 |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 29 % | 14 % – 45 % | — | — | 40 % |
| Pilotes : changements de position par concurrent sur la saison | 6,8 | 4,9 – 8,8 | — | — | 8,5 |
| Pilotes : écart moyen entre voisins (points) — haut | 41,1 | 24,8 – 56,8 | — | — | 35,3 |
| Pilotes : écart moyen entre voisins (points) — milieu | 17,7 | 10,4 – 25,6 | — | — | 13,9 |
| Pilotes : écart moyen entre voisins (points) — bas | 3,5 | 1,1 – 6,1 | — | — | 5,2 |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 97 % | 95 % – 100 % | — | — | 98 % |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 75 % | 67 % – 81 % | — | — | 80 % |
| Pilotes : frontières raisonnablement disputées — haut | 39 % | 20 % – 60 % | — | — | 46 % |
| Pilotes : frontières raisonnablement disputées — milieu | 71 % | 57 % – 86 % | — | — | 80 % |
| Pilotes : frontières raisonnablement disputées — bas | 99 % | 89 % – 100 % | — | — | 98 % |
| Pilotes : positions déjà acquises à 3 manches de la fin | 1 % | 0 % – 5 % | — | — | 1 % |
| Pilotes : positions déjà acquises — haut | 6 % | 0 % – 20 % | — | — | 5 % |
| Pilotes : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 43 % | 23 % – 64 % | — | — | 36 % |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 2 % | 0 % – 5 % | — | — | 2 % |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,94 | 0,88 – 0,98 | — | — | 0,89 |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,97 | 0,93 – 1,00 | — | — | 0,95 |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 1,00 | — | — | 0,97 |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,42 | 0,00 – 0,73 | — | — | 0,63 |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 7 % | 0 % – 18 % | — | — | 13 % |
| Constructeurs : changements de position par concurrent sur la saison | 3,8 | 2,2 – 5,5 | — | — | 5,4 |
| Constructeurs : écart moyen entre voisins (points) — haut | 115,6 | 70,0 – 153,0 | — | — | 86,3 |
| Constructeurs : écart moyen entre voisins (points) — milieu | 32,7 | 17,8 – 48,8 | — | — | 30,7 |
| Constructeurs : écart moyen entre voisins (points) — bas | 10,3 | 1,5 – 24,5 | — | — | 19,5 |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 87 % | 80 % – 100 % | — | — | 92 % |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 56 % | 40 % – 70 % | — | — | 59 % |
| Constructeurs : frontières raisonnablement disputées — haut | 24 % | 0 % – 50 % | — | — | 35 % |
| Constructeurs : frontières raisonnablement disputées — milieu | 69 % | 50 % – 100 % | — | — | 70 % |
| Constructeurs : frontières raisonnablement disputées — bas | 94 % | 50 % – 100 % | — | — | 85 % |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 6 % | 0 % – 18 % | — | — | 4 % |
| Constructeurs : positions déjà acquises — haut | 15 % | 0 % – 50 % | — | — | 11 % |
| Constructeurs : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 52 % | 27 % – 73 % | — | — | 49 % |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 8 % | 0 % – 18 % | — | — | 5 % |

## Chronique d’exemple (graine 1)

**2027** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 346 points et 8 victoires, 12 points devant George Russel (Mercédes).
- Retournement lors de la dernière manche : Kimi Antoneli arrache le titre à George Russel.
- Mercédes décroche le titre des constructeurs (10e titre de son histoire).
- Mercédes signe 6 doublés.
- Victoire surprise de Max Verstapen (Red Bul) à Sakir.
- Victoire surprise de Lewis Hammilton (Ferrary) à Madrit, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Las Vegaz.
- Cadilac termine la saison sans marquer le moindre point.

**2028** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 415 points et 10 victoires, 108 points devant George Russel (Mercédes).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Mercédes signe 9 doublés.
- Victoire surprise de Max Verstapen (Red Bul) à Hungarorring.
- Victoire surprise de Oscar Piastry (McLarren) à Monzza.
- Victoire surprise de Max Verstapen (Red Bul) à Marinna Bay.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 387 points et 9 victoires, 63 points devant George Russel (Mercédes).
- La tête du championnat a changé 5 fois.
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Mercédes signe 7 doublés.
- Cadilac progresse de la 11e à la 8e place.
- Racing Buls termine la saison sans marquer le moindre point.

**2030** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 351 points et 6 victoires, 8 points devant Oscar Piastry (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Mercédes signe 7 doublés.

**2031** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 393 points et 9 victoires, 61 points devant Oscar Piastry (Mercédes).
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Cadilac recule de la 7e à la 10e place.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 424 points et 13 victoires, 137 points devant Kimi Antoneli (Red Bul).
- Une domination sans partage.
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Red Bul) à Hungarorring.
- Audy recule de la 8e à la 11e place.

**2033** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 435 points et 15 victoires, 133 points devant Kimi Antoneli (Red Bul).
- Une domination sans partage.
- McLarren décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Red Bul) à Kyalamy, sous la pluie.
- Victoire surprise de Kimi Antoneli (Red Bul) à Madrit.
- Racing Buls termine la saison sans marquer le moindre point.

**2034** — champion : Oscar Piastry
- Oscar Piastry (Ferrary) remporte le titre avec 353 points et 9 victoires, 69 points devant Fleur Postma (Mercédes).
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Ferrary signe 5 doublés.
- Victoire surprise de Kimi Antoneli (Red Bul) à Shangai.
- Victoire surprise de Kimi Antoneli (Red Bul) à Spa-Francorchamp.
- Victoire surprise de Kimi Antoneli (Red Bul) à Austen.

**2035** — champion : Oscar Piastry
- Oscar Piastry (Ferrary) remporte le titre avec 330 points et 7 victoires, 9 points devant Fleur Postma (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Victoire surprise de Anna Kessler (Ferrary) à Hungarorring.

**2036** — champion : Taylor Prescott
- Taylor Prescott (Mercédes) remporte le titre avec 423 points et 15 victoires, 148 points devant Clara Nielsen (McLarren).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Cadilac progresse de la 10e à la 7e place.
- Haass termine la saison sans marquer le moindre point.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

**2037** — champion : Samuel Carlisle
- Samuel Carlisle (McLarren) remporte le titre avec 388 points et 8 victoires, 16 points devant Taylor Prescott (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- McLarren décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Antoine Lemoine (Red Bul) à Kyalamy.
- Cadilac recule de la 7e à la 10e place.
- Haass termine la saison sans marquer le moindre point.

**2038** — champion : Samuel Carlisle
- Samuel Carlisle (McLarren) remporte le titre avec 326 points et 4 victoires, 4 points devant Oscar Piastry (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 7 fois.
- McLarren décroche le titre des constructeurs (15e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Red Bul) à Spa-Francorchamp, sous la pluie.
- Haass termine la saison sans marquer le moindre point.

**2039** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 407 points et 9 victoires, 28 points devant Louis Lambert (McLarren).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 4 fois.
- McLarren décroche le titre des constructeurs (16e titre de son histoire).
- Cadilac termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2040** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 421 points et 10 victoires, 67 points devant Louis Lambert (McLarren).
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Haass termine la saison sans marquer le moindre point.

**2041** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 436 points et 15 victoires, 145 points devant George Radcliffe (Mercédes).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (16e titre de son histoire).
- Mercédes signe 6 doublés.
- Victoire surprise de Louis Lambert (Alpyne) à Monacco.
- Victoire surprise de Louis Lambert (Alpyne) à Hermanos Rodrigues.
- Alpyne progresse de la 8e à la 4e place.
- Racing Buls progresse de la 9e à la 6e place.
- Wiliams recule de la 4e à la 8e place.
- Red Bul recule de la 6e à la 9e place.
- Cadilac termine la saison sans marquer le moindre point.

**2042** — champion : Anna Kessler
- Anna Kessler (Mercédes) remporte le titre avec 360 points et 9 victoires, 65 points devant Niklas Bauer (McLarren).
- Mercédes décroche le titre des constructeurs (17e titre de son histoire).
- Mercédes signe 5 doublés.
- Victoire surprise de Jan Wagner (Racing Buls) à Spa-Francorchamp, sous la pluie.

**2043** — champion : Anna Kessler
- Anna Kessler (Mercédes) remporte le titre avec 356 points et 8 victoires, 50 points devant Giovanni Lombardi (Mercédes).
- La tête du championnat a changé 5 fois.
- Mercédes décroche le titre des constructeurs (18e titre de son histoire).
- Mercédes signe 6 doublés.
- Victoire surprise de Clara Nielsen (Audy) à Albert Parc, sous la pluie.
- Victoire surprise de Kimi Antoneli (Ferrary) à Gilles-Villeneuves, sous la pluie.
- Victoire surprise de Markus Albrecht (Audy) à Istambull.
- Cadilac progresse de la 11e à la 8e place.
- Alpyne recule de la 6e à la 9e place.
- Red Bul recule de la 7e à la 10e place.
- Haass termine la saison sans marquer le moindre point.
- Red Bul, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2044** — champion : Giovanni Lombardi
- Giovanni Lombardi (Mercédes) remporte le titre avec 419 points et 11 victoires, 140 points devant Niklas Bauer (McLarren).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (19e titre de son histoire).
- Victoire surprise de Nathan Ouellet (Racing Buls) à Interlagoss.
- Red Bul progresse de la 10e à la 6e place.

**2045** — champion : Markus Albrecht
- Markus Albrecht (Ferrary) remporte le titre avec 440 points et 14 victoires, 198 points devant Austin Baxter (Ferrary).
- Une domination sans partage.
- Ferrary décroche le titre des constructeurs (19e titre de son histoire).
- Victoire surprise de Álvaro Ferrer (Aston Martyn) à Istambull, sous la pluie.
- Victoire surprise de Nathan Ouellet (Racing Buls) à Interlagoss.
- Victoire surprise de Ruben Bos (Cadilac) à Yas Marinna.
- Ferrary progresse de la 7e à la 1re place.
- Red Bul progresse de la 6e à la 2e place.
- Cadilac progresse de la 10e à la 5e place.
- McLarren recule de la 2e à la 7e place.
- Audy recule de la 3e à la 8e place.
- Alpyne termine la saison sans marquer le moindre point.

**2046** — champion : Markus Albrecht
- Markus Albrecht (Ferrary) remporte le titre avec 446 points et 14 victoires, 175 points devant Austin Baxter (Ferrary).
- Une domination sans partage.
- Ferrary décroche le titre des constructeurs (20e titre de son histoire).
- Ferrary signe 6 doublés.
- Victoire surprise de Nathan Ouellet (Racing Buls) à Suzuca, sous la pluie.
- Victoire surprise de Álvaro Ferrer (Aston Martyn) à Paul-Ricar.
- Victoire surprise de Giovanni Sartori (Cadilac) à Zandvort.
- Cadilac progresse de la 5e à la 2e place.
- Haass progresse de la 10e à la 5e place.
- Red Bul recule de la 2e à la 6e place.
- Mercédes recule de la 3e à la 7e place.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2047** — champion : Markus Albrecht
- Markus Albrecht (Ferrary) remporte le titre avec 451 points et 18 victoires, 144 points devant Austin Baxter (Ferrary).
- Une domination sans partage.
- Ferrary décroche le titre des constructeurs (21e titre de son histoire).
- Ferrary signe 11 doublés.

**2048** — champion : Austin Baxter
- Austin Baxter (Ferrary) remporte le titre avec 300 points et 5 victoires, 1 point devant Ren Shimizu (Ferrary).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 11 fois.
- Ferrary décroche le titre des constructeurs (22e titre de son histoire).
- Victoire surprise de Markus Albrecht (Aston Martyn) à Suzuca.
- Victoire surprise de Giovanni Lombardi (Haass) à Bakou.
- Aston Martyn progresse de la 5e à la 2e place.

**2049** — champion : Markus Albrecht
- Markus Albrecht (Aston Martyn) remporte le titre avec 337 points et 6 victoires, 39 points devant Ren Shimizu (Ferrary).
- La tête du championnat a changé 7 fois.
- Aston Martyn décroche le titre des constructeurs, le premier de son histoire.
- Victoire surprise de Giovanni Lombardi (Mercédes) à Suzuca.
- Victoire surprise de Giovanni Lombardi (Mercédes) à Gilles-Villeneuves.
- Victoire surprise de Giovanni Lombardi (Mercédes) à Monacco.
- Mercédes progresse de la 8e à la 3e place.
- Wiliams progresse de la 9e à la 6e place.
- Audy progresse de la 11e à la 8e place.
- Racing Buls recule de la 4e à la 10e place.
- Haass recule de la 6e à la 11e place.
- McLarren, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2050** — champion : Markus Albrecht
- Markus Albrecht (Aston Martyn) remporte le titre avec 318 points et 6 victoires, 26 points devant Ren Shimizu (Ferrary).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 5 fois.
- Aston Martyn décroche le titre des constructeurs (2e titre de son histoire).
- Victoire surprise de Giovanni Lombardi (Mercédes) à Gilles-Villeneuves, sous la pluie.
- Alpyne termine la saison sans marquer le moindre point.

**2051** — champion : Markus Albrecht
- Markus Albrecht (Ferrary) remporte le titre avec 313 points et 4 victoires, 29 points devant Baptiste Bertrand (Aston Martyn).
- La tête du championnat a changé 4 fois.
- Aston Martyn décroche le titre des constructeurs (3e titre de son histoire).
- Victoire surprise de Giovanni Lombardi (Mercédes) à Suzuca.
- Victoire surprise de Giovanni Lombardi (Mercédes) à Portimau.
- Victoire surprise de Giovanni Lombardi (Mercédes) à Spa-Francorchamp.
- Victoire surprise de Giovanni Lombardi (Mercédes) à Marinna Bay, sous la pluie.
- Victoire surprise de Magdalena Wimmer (Audy) à Hermanos Rodrigues.
- Alpyne progresse de la 11e à la 8e place.
- Racing Buls termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

**2052** — champion : Giovanni Lombardi
- Giovanni Lombardi (Ferrary) remporte le titre avec 381 points et 9 victoires, 54 points devant Markus Albrecht (Ferrary).
- Ferrary décroche le titre des constructeurs (23e titre de son histoire).
- Ferrary signe 5 doublés.
- Alpyne termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2053** — champion : Giovanni Lombardi
- Giovanni Lombardi (Ferrary) remporte le titre avec 442 points et 15 victoires, 178 points devant Austin Baxter (Ferrary).
- Une domination sans partage.
- Ferrary décroche le titre des constructeurs (24e titre de son histoire).
- Victoire surprise de Magdalena Wimmer (Audy) à Zandvort.
- Victoire surprise de Markus Albrecht (Mercédes) à Hermanos Rodrigues.
- Cadilac recule de la 4e à la 7e place.

**2054** — champion : Giovanni Lombardi
- Giovanni Lombardi (Ferrary) remporte le titre avec 309 points et 9 victoires, 34 points devant Nicolas Delmas (Red Bul).
- Le titre restait ouvert avant la dernière manche.
- Ferrary décroche le titre des constructeurs (25e titre de son histoire).
- Haass termine la saison sans marquer le moindre point.
- McLarren, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

**2055** — champion : Ren Shimizu
- Ren Shimizu (Mercédes) remporte le titre avec 315 points et 7 victoires, 61 points devant Baptiste Bertrand (Aston Martyn).
- Mercédes décroche le titre des constructeurs (20e titre de son histoire).
- Victoire surprise de Giovanni Lombardi (Audy) à Spa-Francorchamp.
- Victoire surprise de Giovanni Lombardi (Audy) à Marinna Bay.
- Mercédes progresse de la 4e à la 1re place.
- Ferrary recule de la 1re à la 5e place.
- McLarren progresse de la 9e à la 6e place.
- Wiliams recule de la 6e à la 9e place.

**2056** — champion : Ren Shimizu
- Ren Shimizu (Mercédes) remporte le titre avec 289 points et 6 victoires, 80 points devant Giovanni Lombardi (Audy).
- Mercédes décroche le titre des constructeurs (21e titre de son histoire).
- Victoire surprise de Baptiste Bertrand (Ferrary) à Kyalamy, sous la pluie.
- Victoire surprise de Aoi Kimura (Audy) à Suzuca, sous la pluie.
- Victoire surprise de Giovanni Lombardi (Audy) à Yas Marinna.
- Red Bul recule de la 4e à la 9e place.

