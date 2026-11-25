# Rapport d’équilibrage — 10 graines × 30 saisons

Scénario grille-2026, graines 1 à 10, 300 saisons simulées en 967,2 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 6,3 | 4,0 – 9,0 | 3,0 – 8,0 | 86 % | 7,4 |
| Écuries victorieuses par saison | 4,3 | 3,0 – 6,0 | 2,0 – 5,0 | 80 % | 5,3 |
| Part des victoires de l'écurie dominante | 54 % | 33 % – 75 % | 35 % – 80 % | 85 % | 47 % |
| Taux d’abandon par départ | 6 % | 4 % – 9 % | 5 % – 15 % | 60 % | 6 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,50 | 0,98 – 2,31 | 1,50 – 4,00 | 38 % | 0,98 |
| Écart de points entre les deux premiers | 58 | 10 – 128 | — | — | 58 |
| Changements de leader du championnat | 2,8 | 0,0 – 7,0 | — | — | 3,4 |
| Doublés par saison (toutes écuries) | 4,0 | 1,0 – 8,0 | — | — | 2,9 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,89 | 0,80 – 0,97 | — | — | 0,77 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 0,78 | 0,35 – 1,37 | — | — | 0,76 |
| Victoires inattendues par saison | 1,7 | 0,0 – 4,0 | — | — | 1,6 |
| Courses sous la pluie par saison | 2,2 | 1,0 – 4,0 | — | — | 2,2 |

## Par série de 30 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 30 saisons | 12,9 | 10,0 – 16,0 | 3,0 – 7,0 | 0 % | 12,8 |
| Champions constructeurs différents sur 30 saisons | 4,0 | 3,0 – 5,0 | — | — | 6,3 |
| Plus longue série de titres constructeurs consécutifs | 7,9 | 5,0 – 12,0 | — | — | 6,2 |
| Écuries sans aucune victoire sur 30 saisons | 1,3 | 0,0 – 2,0 | — | — | 0,1 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 12,7 | 9,0 – 22,0 | — | — | 38,9 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 2,4 | 1,9 – 3,1 | — | — | 3,8 |
| Transitions de saison sans aucun changement d’étage (D-081) | 21 % | 14 % – 34 % | — | — | 5 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 42 % | — | 40 % – 90 % | — | 80 % |
| Séries de 30 saisons avec 5 titres constructeurs consécutifs ou plus | 90 % | — | 0 % – 25 % | — | 70 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 30 % | — | — | — | 30 % |
| Retournement à la dernière manche (le leader perd le titre) | 7 % | — | — | — | 5 % |
| Champion et vice-champion coéquipiers | 31 % | — | — | — | 27 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 10 % | — | — | — | 8 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 20 % | — | — | — | 22 % |
| Saisons très serrées (≤ 10 points d’écart) | 11 % | — | — | — | 13 % |
| Dominations (≥ 120 points d’écart) | 12 % | — | — | — | 11 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,43 | 0,38 – 0,48 | — | — | 0,43 |
| Coéquipiers : écart moyen dû aux compétences | 0,22 | 0,15 – 0,30 | — | — | 0,22 |
| Coéquipiers : écart moyen dû à la forme | 0,02 | 0,01 – 0,02 | — | — | 0,02 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,33 – 0,40 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 26 % | 14 % – 40 % | — | — | 26 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 73 % | 58 % – 86 % | — | — | 73 % |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,91 | 0,86 – 0,96 | — | — | 0,86 |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,93 – 0,99 | — | — | 0,94 |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,97 – 1,00 | — | — | 0,97 |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,13 | 0,64 – 1,64 | — | — | 1,52 |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 29 % | 14 % – 45 % | — | — | 40 % |
| Pilotes : changements de position par concurrent sur la saison | 6,7 | 4,7 – 8,7 | — | — | 8,5 |
| Pilotes : écart moyen entre voisins (points) — haut | 39,6 | 24,6 – 55,4 | — | — | 35,3 |
| Pilotes : écart moyen entre voisins (points) — milieu | 17,9 | 11,0 – 25,1 | — | — | 13,9 |
| Pilotes : écart moyen entre voisins (points) — bas | 3,6 | 1,0 – 6,6 | — | — | 5,2 |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 97 % | 95 % – 100 % | — | — | 98 % |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 75 % | 67 % – 81 % | — | — | 80 % |
| Pilotes : frontières raisonnablement disputées — haut | 39 % | 20 % – 60 % | — | — | 46 % |
| Pilotes : frontières raisonnablement disputées — milieu | 71 % | 57 % – 86 % | — | — | 80 % |
| Pilotes : frontières raisonnablement disputées — bas | 98 % | 89 % – 100 % | — | — | 98 % |
| Pilotes : positions déjà acquises à 3 manches de la fin | 1 % | 0 % – 5 % | — | — | 1 % |
| Pilotes : positions déjà acquises — haut | 5 % | 0 % – 20 % | — | — | 5 % |
| Pilotes : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 46 % | 27 % – 64 % | — | — | 36 % |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 1 % | 0 % – 5 % | — | — | 2 % |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,94 | 0,88 – 0,98 | — | — | 0,89 |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,97 | 0,92 – 0,99 | — | — | 0,95 |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 1,00 | — | — | 0,97 |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,46 | 0,18 – 0,91 | — | — | 0,63 |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 8 % | 0 % – 18 % | — | — | 13 % |
| Constructeurs : changements de position par concurrent sur la saison | 3,8 | 2,1 – 5,5 | — | — | 5,4 |
| Constructeurs : écart moyen entre voisins (points) — haut | 109,0 | 64,3 – 148,0 | — | — | 86,3 |
| Constructeurs : écart moyen entre voisins (points) — milieu | 35,0 | 17,8 – 53,0 | — | — | 30,7 |
| Constructeurs : écart moyen entre voisins (points) — bas | 8,8 | 1,0 – 20,5 | — | — | 19,5 |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 88 % | 80 % – 100 % | — | — | 92 % |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 57 % | 40 % – 70 % | — | — | 59 % |
| Constructeurs : frontières raisonnablement disputées — haut | 26 % | 0 % – 50 % | — | — | 35 % |
| Constructeurs : frontières raisonnablement disputées — milieu | 68 % | 50 % – 100 % | — | — | 70 % |
| Constructeurs : frontières raisonnablement disputées — bas | 96 % | 100 % – 100 % | — | — | 85 % |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 5 % | 0 % – 9 % | — | — | 4 % |
| Constructeurs : positions déjà acquises — haut | 13 % | 0 % – 25 % | — | — | 11 % |
| Constructeurs : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 52 % | 27 % – 73 % | — | — | 49 % |
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

**2031** — champion : Max Verstapen
- Max Verstapen (Ferrary) remporte le titre avec 405 points et 10 victoires, 46 points devant Oscar Piastry (Mercédes).
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Aston Martyn progresse de la 10e à la 7e place.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 348 points et 7 victoires, 29 points devant Kimi Antoneli (Red Bul).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 6 fois.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Red Bul) à Kyalamy.
- Victoire surprise de Kimi Antoneli (Red Bul) à Hungarorring.

**2033** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 365 points et 8 victoires, 17 points devant Kimi Antoneli (Red Bul).
- McLarren décroche le titre des constructeurs (11e titre de son histoire).

**2034** — champion : Taylor Prescott
- Taylor Prescott (Mercédes) remporte le titre avec 371 points et 11 victoires, 67 points devant Fleur Postma (Mercédes).
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Mercédes signe 5 doublés.
- Victoire surprise de Kimi Antoneli (Red Bul) à Shangai.
- Victoire surprise de Oscar Piastry (Wiliams) à Monacco.
- Victoire surprise de Kimi Antoneli (Red Bul) à Spa-Francorchamp.
- Racing Buls progresse de la 10e à la 7e place.
- Audy progresse de la 11e à la 8e place.
- Alpyne recule de la 7e à la 11e place.

**2035** — champion : Taylor Prescott
- Taylor Prescott (Mercédes) remporte le titre avec 379 points et 9 victoires, 48 points devant Samuel Carlisle (McLarren).
- Mercédes décroche le titre des constructeurs (16e titre de son histoire).
- Mercédes signe 6 doublés.
- Victoire surprise de Álvaro Ferrer (Ferrary) à Sepanng, sous la pluie.
- Red Bul recule de la 2e à la 5e place.
- Alpyne progresse de la 11e à la 7e place.
- Racing Buls recule de la 7e à la 10e place.

**2036** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 441 points et 15 victoires, 118 points devant Samuel Carlisle (McLarren).
- Mercédes décroche le titre des constructeurs (17e titre de son histoire).
- Mercédes signe 6 doublés.
- Haass recule de la 8e à la 11e place.
- Cadilac termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

**2037** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 350 points et 8 victoires, 12 points devant Louis Lambert (McLarren).
- Retournement lors de la dernière manche : Oscar Piastry arrache le titre à Louis Lambert.
- Mercédes décroche le titre des constructeurs (18e titre de son histoire).
- Mercédes signe 5 doublés.
- Victoire surprise de Kimi Antoneli (Ferrary) à Spielbergh, sous la pluie.
- Victoire surprise de Kimi Antoneli (Ferrary) à Istambull, sous la pluie.
- Audy termine la saison sans marquer le moindre point.
- Cadilac termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2038** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 384 points et 10 victoires, 31 points devant Louis Lambert (McLarren).
- Mercédes décroche le titre des constructeurs (19e titre de son histoire).
- Mercédes signe 8 doublés.
- Victoire surprise de Oscar Piastry (Wiliams) à Portimau, sous la pluie.

**2039** — champion : Samuel Carlisle
- Samuel Carlisle (Mercédes) remporte le titre avec 396 points et 9 victoires, 26 points devant Kimi Antoneli (Mercédes).
- Mercédes décroche le titre des constructeurs (20e titre de son histoire).
- Mercédes signe 11 doublés.
- Victoire surprise de Gabriel Bortoletto (Ferrary) à Interlagoss.
- Victoire surprise de Oscar Piastry (Wiliams) à Yas Marinna.
- Haass termine la saison sans marquer le moindre point.
- Red Bul, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2040** — champion : Samuel Carlisle
- Samuel Carlisle (Mercédes) remporte le titre avec 385 points et 11 victoires, 48 points devant Kimi Antoneli (Ferrary).
- Mercédes décroche le titre des constructeurs (21e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Ferrary) à Suzuca.
- Victoire surprise de Kimi Antoneli (Ferrary) à Imolla.
- Victoire surprise de Kimi Antoneli (Ferrary) à Gilles-Villeneuves.
- Cadilac termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2041** — champion : Anna Kessler
- Anna Kessler (Mercédes) remporte le titre avec 371 points et 9 victoires, 94 points devant Kimi Antoneli (Ferrary).
- Mercédes décroche le titre des constructeurs (22e titre de son histoire).
- Victoire surprise de Louis Lambert (Wiliams) à Albert Parc.
- Victoire surprise de Kimi Antoneli (Ferrary) à Sakir.
- Victoire surprise de Louis Lambert (Wiliams) à Jedda.
- Victoire surprise de Louis Lambert (Wiliams) à Monacco.
- Victoire surprise de Kimi Antoneli (Ferrary) à Monzza, sous la pluie.
- Victoire surprise de Kimi Antoneli (Ferrary) à Marinna Bay, sous la pluie.
- Victoire surprise de Louis Lambert (Wiliams) à Hermanos Rodrigues.
- Cadilac termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2042** — champion : Anna Kessler
- Anna Kessler (Mercédes) remporte le titre avec 365 points et 8 victoires, 38 points devant Kimi Antoneli (McLarren).
- Mercédes décroche le titre des constructeurs (23e titre de son histoire).
- Haass termine la saison sans marquer le moindre point.

**2043** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 391 points et 9 victoires, 66 points devant Anna Kessler (Mercédes).
- Mercédes décroche le titre des constructeurs (24e titre de son histoire).
- Mercédes signe 7 doublés.
- Racing Buls termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.

**2044** — champion : Markus Albrecht
- Markus Albrecht (Mercédes) remporte le titre avec 402 points et 10 victoires, 146 points devant Nathan Ouellet (Red Bul).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (25e titre de son histoire).
- Audy recule de la 7e à la 10e place.

**2045** — champion : Nathan Ouellet
- Nathan Ouellet (Red Bul) remporte le titre avec 280 points et 3 victoires, 50 points devant Hao Guo (Ferrary).
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Victoire surprise de Markus Albrecht (Mercédes) à Portimau.
- Mercédes recule de la 1re à la 4e place.
- Racing Buls recule de la 8e à la 11e place.

**2046** — champion : Markus Albrecht
- Markus Albrecht (McLarren) remporte le titre avec 275 points et 2 victoires, 3 points devant Nathan Ouellet (Red Bul).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Markus Albrecht arrache le titre à Nathan Ouellet.
- La tête du championnat a changé 6 fois.
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Cadilac progresse de la 7e à la 4e place.
- Racing Buls termine la saison sans marquer le moindre point.

**2047** — champion : Markus Albrecht
- Markus Albrecht (McLarren) remporte le titre avec 358 points et 7 victoires, 70 points devant Clara Nielsen (Red Bul).
- Red Bul décroche le titre des constructeurs (8e titre de son histoire).
- Racing Buls termine la saison sans marquer le moindre point.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2048** — champion : Markus Albrecht
- Markus Albrecht (McLarren) remporte le titre avec 300 points et 4 victoires, 11 points devant Thijs Brouwer (Red Bul).
- Le titre restait ouvert avant la dernière manche.
- Red Bul décroche le titre des constructeurs (9e titre de son histoire).
- Red Bul signe 5 doublés.

**2049** — champion : Thijs Brouwer
- Thijs Brouwer (McLarren) remporte le titre avec 340 points et 8 victoires, 62 points devant Ruben Bos (McLarren).
- McLarren décroche le titre des constructeurs (13e titre de son histoire).
- Alpyne progresse de la 9e à la 6e place.
- Racing Buls termine la saison sans marquer le moindre point.

**2050** — champion : Baptiste Bertrand
- Baptiste Bertrand (Red Bul) remporte le titre avec 277 points et 5 victoires, 15 points devant Thijs Brouwer (McLarren).
- Le titre restait ouvert avant la dernière manche.
- Red Bul décroche le titre des constructeurs (10e titre de son histoire).
- Victoire surprise de Felix Lehmann (Cadilac) à Gilles-Villeneuves, sous la pluie.
- Victoire surprise de Markus Albrecht (Mercédes) à Silverston.
- Victoire surprise de Markus Albrecht (Mercédes) à Istambull, sous la pluie.
- Haass termine la saison sans marquer le moindre point.

**2051** — champion : Baptiste Bertrand
- Baptiste Bertrand (Red Bul) remporte le titre avec 269 points et 6 victoires, 0 point devant Clara Nielsen (Aston Martyn).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Baptiste Bertrand arrache le titre à Clara Nielsen.
- La tête du championnat a changé 5 fois.
- Red Bul décroche le titre des constructeurs (11e titre de son histoire).
- Victoire surprise de Markus Albrecht (Mercédes) à Kyalamy.
- Victoire surprise de Markus Albrecht (Mercédes) à Istambull, sous la pluie.
- Victoire surprise de Larissa Almeida (Alpyne) à Marinna Bay, sous la pluie.

**2052** — champion : Markus Albrecht
- Markus Albrecht (Ferrary) remporte le titre avec 279 points et 4 victoires, 43 points devant George Radcliffe (McLarren).
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Ferrary progresse de la 4e à la 1re place.
- Haass termine la saison sans marquer le moindre point.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

**2053** — champion : Thijs Brouwer
- Thijs Brouwer (Red Bul) remporte le titre avec 353 points et 9 victoires, 10 points devant Markus Albrecht (Ferrary).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 8 fois.
- Red Bul décroche le titre des constructeurs (12e titre de son histoire).
- Victoire surprise de Baptiste Bertrand (Wiliams) à Marinna Bay.
- Mercédes progresse de la 6e à la 3e place.
- Wiliams progresse de la 8e à la 5e place.
- Aston Martyn recule de la 4e à la 8e place.

**2054** — champion : Thijs Brouwer
- Thijs Brouwer (Red Bul) remporte le titre avec 303 points et 8 victoires, 7 points devant Baptiste Bertrand (Red Bul).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Thijs Brouwer arrache le titre à Baptiste Bertrand.
- La tête du championnat a changé 8 fois.
- Red Bul décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Julien Perrin (Mercédes) à Jedda.
- Wiliams recule de la 5e à la 8e place.
- Haass termine la saison sans marquer le moindre point.

**2055** — champion : Thijs Brouwer
- Thijs Brouwer (Aston Martyn) remporte le titre avec 293 points et 5 victoires, 13 points devant Baptiste Bertrand (Red Bul).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 7 fois.
- Red Bul décroche le titre des constructeurs (14e titre de son histoire).
- Aston Martyn progresse de la 7e à la 2e place.
- Alpyne recule de la 5e à la 9e place.
- Haass termine la saison sans marquer le moindre point.

**2056** — champion : Baptiste Bertrand
- Baptiste Bertrand (Mercédes) remporte le titre avec 263 points et 5 victoires, 53 points devant Thijs Brouwer (Aston Martyn).
- Mercédes décroche le titre des constructeurs (26e titre de son histoire).
- Victoire surprise de Thijs Brouwer (Aston Martyn) à Spielbergh.
- Victoire surprise de Sota Inoue (Alpyne) à Hungarorring, sous la pluie.
- Mercédes progresse de la 4e à la 1re place.
- McLarren recule de la 3e à la 8e place.
- Haass termine la saison sans marquer le moindre point.

