# Rapport d’équilibrage — 10 graines × 30 saisons

Scénario grille-2026, graines 1 à 10, 300 saisons simulées en 955,6 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 6,7 | 4,0 – 10,0 | 3,0 – 8,0 | 80 % | 7,4 |
| Écuries victorieuses par saison | 4,6 | 3,0 – 7,0 | 2,0 – 5,0 | 70 % | 5,3 |
| Part des victoires de l'écurie dominante | 51 % | 33 % – 71 % | 35 % – 80 % | 84 % | 47 % |
| Taux d’abandon par départ | 6 % | 4 % – 9 % | 5 % – 15 % | 58 % | 6 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,49 | 0,80 – 2,34 | 1,50 – 4,00 | 43 % | 0,98 |
| Écart de points entre les deux premiers | 56 | 8 – 127 | — | — | 58 |
| Changements de leader du championnat | 3,0 | 0,0 – 6,0 | — | — | 3,4 |
| Doublés par saison (toutes écuries) | 3,2 | 1,0 – 6,0 | — | — | 2,9 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,86 | 0,69 – 0,97 | — | — | 0,77 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 1,00 | 0,44 – 1,76 | — | — | 0,76 |
| Victoires inattendues par saison | 1,5 | 0,0 – 4,0 | — | — | 1,6 |
| Courses sous la pluie par saison | 2,2 | 1,0 – 4,0 | — | — | 2,2 |

## Par série de 30 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 30 saisons | 12,2 | 10,0 – 15,0 | 3,0 – 7,0 | 0 % | 12,8 |
| Champions constructeurs différents sur 30 saisons | 4,6 | 3,0 – 7,0 | — | — | 6,3 |
| Plus longue série de titres constructeurs consécutifs | 7,8 | 4,0 – 13,0 | — | — | 6,2 |
| Écuries sans aucune victoire sur 30 saisons | 1,0 | 0,0 – 3,0 | — | — | 0,1 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 17,1 | 13,0 – 23,0 | — | — | 38,9 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 2,6 | 2,3 – 3,2 | — | — | 3,8 |
| Transitions de saison sans aucun changement d’étage (D-081) | 20 % | 10 % – 28 % | — | — | 5 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 40 % | — | 40 % – 90 % | — | 80 % |
| Séries de 30 saisons avec 5 titres constructeurs consécutifs ou plus | 80 % | — | 0 % – 25 % | — | 70 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 31 % | — | — | — | 30 % |
| Retournement à la dernière manche (le leader perd le titre) | 6 % | — | — | — | 5 % |
| Champion et vice-champion coéquipiers | 26 % | — | — | — | 27 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 10 % | — | — | — | 8 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 22 % | — | — | — | 22 % |
| Saisons très serrées (≤ 10 points d’écart) | 13 % | — | — | — | 13 % |
| Dominations (≥ 120 points d’écart) | 11 % | — | — | — | 11 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,43 | 0,38 – 0,49 | — | — | 0,43 |
| Coéquipiers : écart moyen dû aux compétences | 0,22 | 0,14 – 0,32 | — | — | 0,22 |
| Coéquipiers : écart moyen dû à la forme | 0,02 | 0,01 – 0,02 | — | — | 0,02 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,34 – 0,40 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 27 % | 13 % – 41 % | — | — | 26 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 73 % | 56 % – 88 % | — | — | 73 % |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,90 | 0,84 – 0,96 | — | — | 0,86 |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,92 – 0,99 | — | — | 0,94 |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 1,00 | — | — | 0,97 |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,20 | 0,64 – 1,73 | — | — | 1,52 |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 30 % | 14 % – 50 % | — | — | 40 % |
| Pilotes : changements de position par concurrent sur la saison | 7,0 | 4,6 – 9,4 | — | — | 8,5 |
| Pilotes : écart moyen entre voisins (points) — haut | 37,8 | 23,0 – 53,0 | — | — | 35,3 |
| Pilotes : écart moyen entre voisins (points) — milieu | 17,3 | 10,6 – 24,3 | — | — | 13,9 |
| Pilotes : écart moyen entre voisins (points) — bas | 3,9 | 1,0 – 6,8 | — | — | 5,2 |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 98 % | 95 % – 100 % | — | — | 98 % |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 76 % | 67 % – 86 % | — | — | 80 % |
| Pilotes : frontières raisonnablement disputées — haut | 42 % | 20 % – 60 % | — | — | 46 % |
| Pilotes : frontières raisonnablement disputées — milieu | 72 % | 57 % – 86 % | — | — | 80 % |
| Pilotes : frontières raisonnablement disputées — bas | 98 % | 89 % – 100 % | — | — | 98 % |
| Pilotes : positions déjà acquises à 3 manches de la fin | 1 % | 0 % – 5 % | — | — | 1 % |
| Pilotes : positions déjà acquises — haut | 5 % | 0 % – 20 % | — | — | 5 % |
| Pilotes : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 43 % | 23 % – 68 % | — | — | 36 % |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 1 % | 0 % – 5 % | — | — | 2 % |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,93 | 0,85 – 0,98 | — | — | 0,89 |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,97 | 0,93 – 0,99 | — | — | 0,95 |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,95 – 1,00 | — | — | 0,97 |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,44 | 0,18 – 0,91 | — | — | 0,63 |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 8 % | 0 % – 18 % | — | — | 13 % |
| Constructeurs : changements de position par concurrent sur la saison | 3,9 | 2,0 – 5,9 | — | — | 5,4 |
| Constructeurs : écart moyen entre voisins (points) — haut | 101,7 | 55,3 – 145,8 | — | — | 86,3 |
| Constructeurs : écart moyen entre voisins (points) — milieu | 35,4 | 17,8 – 54,5 | — | — | 30,7 |
| Constructeurs : écart moyen entre voisins (points) — bas | 11,4 | 1,0 – 27,0 | — | — | 19,5 |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 89 % | 80 % – 100 % | — | — | 92 % |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 55 % | 40 % – 70 % | — | — | 59 % |
| Constructeurs : frontières raisonnablement disputées — haut | 26 % | 0 % – 50 % | — | — | 35 % |
| Constructeurs : frontières raisonnablement disputées — milieu | 65 % | 50 % – 75 % | — | — | 70 % |
| Constructeurs : frontières raisonnablement disputées — bas | 95 % | 100 % – 100 % | — | — | 85 % |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 4 % | 0 % – 9 % | — | — | 4 % |
| Constructeurs : positions déjà acquises — haut | 12 % | 0 % – 25 % | — | — | 11 % |
| Constructeurs : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 54 % | 27 % – 73 % | — | — | 49 % |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 6 % | 0 % – 18 % | — | — | 5 % |

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
- Kimi Antoneli (Mercédes) remporte le titre avec 389 points et 8 victoires, 72 points devant Oscar Piastry (McLarren).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Mercédes signe 7 doublés.
- Victoire surprise de Oscar Piastry (McLarren) à Albert Parc.
- Victoire surprise de Oscar Piastry (McLarren) à Monzza.
- Victoire surprise de Max Verstapen (Red Bul) à Marinna Bay.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 377 points et 9 victoires, 63 points devant George Russel (Mercédes).
- La tête du championnat a changé 5 fois.
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Cadilac termine la saison sans marquer le moindre point.
- Audy termine la saison sans marquer le moindre point.

**2030** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 374 points et 8 victoires, 52 points devant Oscar Piastry (Mercédes).
- La tête du championnat a changé 5 fois.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Mercédes signe 7 doublés.
- Victoire surprise de Samuel Marlow (Ferrary) à Las Vegaz.

**2031** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 403 points et 10 victoires, 94 points devant Oscar Piastry (Mercédes).
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Cadilac termine la saison sans marquer le moindre point.
- Audy termine la saison sans marquer le moindre point.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 424 points et 13 victoires, 112 points devant Kimi Antoneli (Red Bul).
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Red Bul) à Hungarorring.
- Victoire surprise de Kimi Antoneli (Red Bul) à Madrit.
- Racing Buls termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.
- Cadilac termine la saison sans marquer le moindre point.
- Audy termine la saison sans marquer le moindre point.

**2033** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 433 points et 15 victoires, 142 points devant Kimi Antoneli (Red Bul).
- Une domination sans partage.
- McLarren décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Red Bul) à Kyalamy, sous la pluie.
- Cadilac termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2034** — champion : Anna Kessler
- Anna Kessler (Ferrary) remporte le titre avec 295 points et 6 victoires, 18 points devant Fleur Postma (Mercédes).
- La tête du championnat a changé 6 fois.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Red Bul) à Shangai.
- Victoire surprise de Kimi Antoneli (Red Bul) à Spa-Francorchamp.
- Cadilac termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2035** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 403 points et 10 victoires, 112 points devant Fleur Postma (Mercédes).
- McLarren décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Oscar Piastry (Wiliams) à Monacco.
- Victoire surprise de Oscar Piastry (Wiliams) à Madrit.
- Audy termine la saison sans marquer le moindre point.
- Cadilac termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2036** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 422 points et 14 victoires, 91 points devant Taylor Prescott (Mercédes).
- McLarren décroche le titre des constructeurs (15e titre de son histoire).
- Victoire surprise de Anna Kessler (Ferrary) à Gilles-Villeneuves.
- Audy termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

**2037** — champion : Taylor Prescott
- Taylor Prescott (Mercédes) remporte le titre avec 347 points et 5 victoires, 2 points devant Kimi Antoneli (McLarren).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 6 fois.
- McLarren décroche le titre des constructeurs (16e titre de son histoire).
- Victoire surprise de Fleur Postma (Wiliams) à Interlagoss.
- Haass termine la saison sans marquer le moindre point.

**2038** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 299 points et 6 victoires, 2 points devant Kimi Antoneli (Wiliams).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Oscar Piastry arrache le titre à Kimi Antoneli.
- La tête du championnat a changé 8 fois.
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Victoire surprise de Fleur Postma (Wiliams) à Kyalamy.
- Victoire surprise de Kimi Antoneli (Wiliams) à Spa-Francorchamp, sous la pluie.
- Haass termine la saison sans marquer le moindre point.

**2039** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 393 points et 8 victoires, 21 points devant Louis Lambert (McLarren).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 4 fois.
- McLarren décroche le titre des constructeurs (17e titre de son histoire).
- Aston Martyn progresse de la 7e à la 4e place.
- Haass termine la saison sans marquer le moindre point.
- Red Bul, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2040** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 455 points et 14 victoires, 99 points devant Louis Lambert (McLarren).
- Mercédes décroche le titre des constructeurs (16e titre de son histoire).
- Haass termine la saison sans marquer le moindre point.

**2041** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 415 points et 12 victoires, 154 points devant Stefan Lehmann (McLarren).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Louis Lambert (Aston Martyn) à Madrit.
- Victoire surprise de Louis Lambert (Aston Martyn) à Hermanos Rodrigues.
- Haass termine la saison sans marquer le moindre point.
- Ferrary, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2042** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 296 points et 6 victoires, 21 points devant Connor Lawton (Mercédes).
- Mercédes décroche le titre des constructeurs (18e titre de son histoire).
- Victoire surprise de Samuel Carlisle (Red Bul) à Zandvort, sous la pluie.
- Victoire surprise de Samuel Carlisle (Red Bul) à Monzza, sous la pluie.
- Racing Buls progresse de la 8e à la 2e place.
- Audy progresse de la 10e à la 7e place.
- Aston Martyn recule de la 3e à la 10e place.
- Haass termine la saison sans marquer le moindre point.

**2043** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 420 points et 12 victoires, 163 points devant Ruben Bos (Racing Buls).
- Une domination sans partage.
- La tête du championnat a changé 6 fois.
- Mercédes décroche le titre des constructeurs (19e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Ferrary) à Gilles-Villeneuves, sous la pluie.
- Cadilac progresse de la 9e à la 5e place.
- Red Bul recule de la 4e à la 11e place.
- Red Bul termine la saison sans marquer le moindre point.

**2044** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 389 points et 10 victoires, 129 points devant Clara Nielsen (Racing Buls).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (20e titre de son histoire).
- Red Bul progresse de la 11e à la 8e place.
- Haass termine la saison sans marquer le moindre point.

**2045** — champion : George Radcliffe
- George Radcliffe (Mercédes) remporte le titre avec 320 points et 4 victoires, 43 points devant Simone Moretti (Racing Buls).
- Mercédes décroche le titre des constructeurs (21e titre de son histoire).
- Haass termine la saison sans marquer le moindre point.

**2046** — champion : George Radcliffe
- George Radcliffe (Mercédes) remporte le titre avec 320 points et 6 victoires, 35 points devant Markus Albrecht (Wiliams).
- La tête du championnat a changé 4 fois.
- Mercédes décroche le titre des constructeurs (22e titre de son histoire).
- Victoire surprise de Nathan Ouellet (McLarren) à Suzuca, sous la pluie.
- Victoire surprise de Markus Albrecht (Wiliams) à Madrit.
- Racing Buls recule de la 2e à la 5e place.
- Aston Martyn termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2047** — champion : Markus Albrecht
- Markus Albrecht (Wiliams) remporte le titre avec 286 points et 4 victoires, 20 points devant Hannah Marlow (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (23e titre de son histoire).
- Victoire surprise de Clara Nielsen (Alpyne) à Madrit, sous la pluie.
- Aston Martyn termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.
- Red Bul, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2048** — champion : Clara Nielsen
- Clara Nielsen (Mercédes) remporte le titre avec 278 points et 6 victoires, 74 points devant Nathan Ouellet (McLarren).
- Mercédes décroche le titre des constructeurs (24e titre de son histoire).
- Victoire surprise de Markus Albrecht (Audy) à Suzuca.
- Victoire surprise de Austin Baxter (Ferrary) à Sepanng.
- Ferrary progresse de la 8e à la 3e place.
- Red Bul progresse de la 9e à la 4e place.
- Cadilac recule de la 4e à la 8e place.
- Alpyne recule de la 6e à la 9e place.
- Aston Martyn termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2049** — champion : Baptiste Bertrand
- Baptiste Bertrand (Mercédes) remporte le titre avec 257 points et 5 victoires, 36 points devant Thijs Brouwer (Wiliams).
- La tête du championnat a changé 5 fois.
- Mercédes décroche le titre des constructeurs (25e titre de son histoire).
- Wiliams progresse de la 5e à la 2e place.
- Cadilac progresse de la 8e à la 4e place.
- Ferrary recule de la 3e à la 6e place.
- Red Bul recule de la 4e à la 9e place.
- Haass termine la saison sans marquer le moindre point.

**2050** — champion : Markus Albrecht
- Markus Albrecht (Audy) remporte le titre avec 218 points et 2 victoires, 4 points devant Thijs Brouwer (Wiliams).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Markus Albrecht arrache le titre à Thijs Brouwer.
- La tête du championnat a changé 4 fois.
- Mercédes décroche le titre des constructeurs (26e titre de son histoire).
- Victoire surprise de Markus Albrecht (Audy) à Silverston.
- Haass termine la saison sans marquer le moindre point.

**2051** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 313 points et 7 victoires, 77 points devant Baptiste Bertrand (Mercédes).
- Mercédes décroche le titre des constructeurs (27e titre de son histoire).
- Red Bul progresse de la 7e à la 2e place.
- Racing Buls progresse de la 8e à la 3e place.
- Audy recule de la 6e à la 9e place.
- Haass termine la saison sans marquer le moindre point.

**2052** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 284 points et 7 victoires, 97 points devant Austin Baxter (Ferrary).
- La tête du championnat a changé 5 fois.
- Mercédes décroche le titre des constructeurs (28e titre de son histoire).
- Victoire surprise de Larissa Almeida (Aston Martyn) à Sepanng, sous la pluie.
- Ferrary progresse de la 6e à la 2e place.
- Audy progresse de la 9e à la 6e place.
- Racing Buls recule de la 3e à la 8e place.
- Wiliams recule de la 4e à la 9e place.
- Haass termine la saison sans marquer le moindre point.

**2053** — champion : Baptiste Bertrand
- Baptiste Bertrand (Red Bul) remporte le titre avec 247 points et 5 victoires, 24 points devant Thijs Brouwer (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Victoire surprise de Larissa Almeida (Aston Martyn) à Silverston, sous la pluie.
- Mercédes recule de la 1re à la 5e place.

**2054** — champion : Céline Schmid
- Céline Schmid (Cadilac) remporte le titre avec 250 points et 4 victoires, 11 points devant Thijs Brouwer (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 5 fois.
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Ferrary progresse de la 4e à la 1re place.
- Alpyne progresse de la 8e à la 4e place.
- Red Bul recule de la 1re à la 7e place.
- McLarren recule de la 3e à la 9e place.
- Haass termine la saison sans marquer le moindre point.

**2055** — champion : Thijs Brouwer
- Thijs Brouwer (Cadilac) remporte le titre avec 283 points et 3 victoires, 40 points devant Baptiste Bertrand (Ferrary).
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Red Bul progresse de la 7e à la 3e place.
- Racing Buls recule de la 5e à la 9e place.
- Aston Martyn termine la saison sans marquer le moindre point.

**2056** — champion : Baptiste Bertrand
- Baptiste Bertrand (Mercédes) remporte le titre avec 313 points et 7 victoires, 19 points devant Céline Schmid (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (29e titre de son histoire).
- Mercédes progresse de la 5e à la 1re place.
- Aston Martyn progresse de la 11e à la 6e place.
- Alpyne recule de la 4e à la 7e place.
- Cadilac recule de la 2e à la 9e place.
- Audy recule de la 8e à la 11e place.
- Racing Buls termine la saison sans marquer le moindre point.
- Audy termine la saison sans marquer le moindre point.

