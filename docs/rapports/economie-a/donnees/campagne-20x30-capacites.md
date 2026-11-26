# Rapport d’équilibrage — 20 graines × 30 saisons

Scénario grille-2026, graines 1 à 20, 600 saisons simulées en 2 232,7 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 7,7 | 5,0 – 10,0 | 3,0 – 8,0 | 65 % |
| Écuries victorieuses par saison | 5,5 | 3,0 – 8,0 | 2,0 – 5,0 | 48 % |
| Part des victoires de l'écurie dominante | 45 % | 29 % – 65 % | 35 % – 80 % | 71 % |
| Taux d’abandon par départ | 6 % | 4 % – 9 % | 5 % – 15 % | 56 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,03 | 0,52 – 1,66 | 1,50 – 4,00 | 14 % |
| Écart de points entre les deux premiers | 56 | 7 – 125 | — | — |
| Changements de leader du championnat | 3,2 | 0,0 – 7,0 | — | — |
| Doublés par saison (toutes écuries) | 2,8 | 0,0 – 6,0 | — | — |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,74 | 0,46 – 0,95 | — | — |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 1,03 | 0,29 – 1,93 | — | — |
| Victoires inattendues par saison | 1,6 | 0,0 – 4,0 | — | — |
| Courses sous la pluie par saison | 2,3 | 1,0 – 4,0 | — | — |

## Par série de 30 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Champions pilotes différents sur 30 saisons | 13,7 | 11,0 – 17,0 | 3,0 – 7,0 | 0 % |
| Champions constructeurs différents sur 30 saisons | 8,0 | 6,0 – 10,0 | — | — |
| Plus longue série de titres constructeurs consécutifs | 5,4 | 4,0 – 7,0 | — | — |
| Écuries sans aucune victoire sur 30 saisons | 0,1 | — | — | — |
| Remontées (+3 places ou plus d’une saison à l’autre) | 32,1 | 23,0 – 43,0 | — | — |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 3,5 | 2,9 – 4,0 | — | — |
| Transitions de saison sans aucun changement d’étage (D-081) | 8 % | 3 % – 21 % | — | — |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 66 % | — | 40 % – 90 % | — |
| Séries de 30 saisons avec 5 titres constructeurs consécutifs ou plus | 60 % | — | 0 % – 25 % | — |
| Titre encore ouvert avant la dernière manche (définition exacte) | 32 % | — | — | — |
| Retournement à la dernière manche (le leader perd le titre) | 8 % | — | — | — |
| Champion et vice-champion coéquipiers | 22 % | — | — | — |
| Lutte jusqu’à la dernière manche entre coéquipiers | 7 % | — | — | — |
| Lutte jusqu’à la dernière manche entre écuries différentes | 25 % | — | — | — |
| Saisons très serrées (≤ 10 points d’écart) | 16 % | — | — | — |
| Dominations (≥ 120 points d’écart) | 12 % | — | — | — |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,43 | 0,38 – 0,49 | — | — |
| Coéquipiers : écart moyen dû aux compétences | 0,22 | 0,15 – 0,30 | — | — |
| Coéquipiers : écart moyen dû à la forme | 0,02 | 0,01 – 0,02 | — | — |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,33 – 0,40 | — | — |
| Coéquipiers : part de l’écart quadratique due aux compétences | 26 % | 14 % – 40 % | — | — |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 74 % | 59 % – 87 % | — | — |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,87 | 0,78 – 0,94 | — | — |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,94 | 0,90 – 0,98 | — | — |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,97 | 0,95 – 0,99 | — | — |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,49 | 0,91 – 2,09 | — | — |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 38 % | 18 % – 55 % | — | — |
| Pilotes : changements de position par concurrent sur la saison | 8,3 | 5,8 – 10,4 | — | — |
| Pilotes : écart moyen entre voisins (points) — haut | 34,5 | 19,0 – 51,4 | — | — |
| Pilotes : écart moyen entre voisins (points) — milieu | 14,1 | 8,3 – 21,9 | — | — |
| Pilotes : écart moyen entre voisins (points) — bas | 5,3 | 2,2 – 7,9 | — | — |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 98 % | 95 % – 100 % | — | — |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 78 % | 71 % – 86 % | — | — |
| Pilotes : frontières raisonnablement disputées — haut | 45 % | 20 % – 60 % | — | — |
| Pilotes : frontières raisonnablement disputées — milieu | 78 % | 57 % – 100 % | — | — |
| Pilotes : frontières raisonnablement disputées — bas | 97 % | 89 % – 100 % | — | — |
| Pilotes : positions déjà acquises à 3 manches de la fin | 1 % | 0 % – 5 % | — | — |
| Pilotes : positions déjà acquises — haut | 5 % | 0 % – 20 % | — | — |
| Pilotes : positions déjà acquises — milieu | 0 % | — | — | — |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 38 % | 18 % – 59 % | — | — |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 1 % | 0 % – 5 % | — | — |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,89 | 0,78 – 0,97 | — | — |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,95 | 0,89 – 0,99 | — | — |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,95 – 1,00 | — | — |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,60 | 0,18 – 1,09 | — | — |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 12 % | 0 % – 27 % | — | — |
| Constructeurs : changements de position par concurrent sur la saison | 5,0 | 2,8 – 7,2 | — | — |
| Constructeurs : écart moyen entre voisins (points) — haut | 82,1 | 39,5 – 130,5 | — | — |
| Constructeurs : écart moyen entre voisins (points) — milieu | 34,6 | 18,8 – 53,5 | — | — |
| Constructeurs : écart moyen entre voisins (points) — bas | 17,9 | 2,5 – 37,0 | — | — |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 93 % | 80 % – 100 % | — | — |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 58 % | 40 % – 70 % | — | — |
| Constructeurs : frontières raisonnablement disputées — haut | 36 % | 0 % – 75 % | — | — |
| Constructeurs : frontières raisonnablement disputées — milieu | 65 % | 50 % – 100 % | — | — |
| Constructeurs : frontières raisonnablement disputées — bas | 86 % | 50 % – 100 % | — | — |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 3 % | 0 % – 9 % | — | — |
| Constructeurs : positions déjà acquises — haut | 9 % | 0 % – 25 % | — | — |
| Constructeurs : positions déjà acquises — milieu | 0 % | — | — | — |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 51 % | 27 % – 73 % | — | — |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 4 % | 0 % – 9 % | — | — |

## Chronique d’exemple (graine 1)

**2027** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 336 points et 8 victoires, 8 points devant George Russel (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Kimi Antoneli arrache le titre à George Russel.
- Mercédes décroche le titre des constructeurs (10e titre de son histoire).
- Victoire surprise de Lando Noris (McLarren) à Suzuca.
- Victoire surprise de Max Verstapen (Red Bul) à Sakir.
- Victoire surprise de Max Verstapen (Red Bul) à Monacco.
- Victoire surprise de Lewis Hammilton (Ferrary) à Madrit, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Las Vegaz.

**2028** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 389 points et 8 victoires, 75 points devant George Russel (Mercédes).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Mercédes signe 6 doublés.
- Victoire surprise de Max Verstapen (Red Bul) à Hungarorring.
- Victoire surprise de Oscar Piastry (McLarren) à Monzza.
- Audy progresse de la 10e à la 7e place.
- Aston Martyn recule de la 7e à la 11e place.

**2029** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 349 points et 7 victoires, 37 points devant George Russel (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Mercédes signe 5 doublés.
- Victoire surprise de Max Verstapen (Wiliams) à Marinna Bay, sous la pluie.
- Aston Martyn progresse de la 11e à la 7e place.
- Haass termine la saison sans marquer le moindre point.

**2030** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 305 points et 6 victoires, 1 point devant Lando Noris (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Oscar Piastry arrache le titre à Lando Noris.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Mercédes signe 7 doublés.
- Victoire surprise de Max Verstapen (Wiliams) à Hermanos Rodrigues.

**2031** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 296 points et 6 victoires, 6 points devant Samuel Marlow (Ferrary).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- La tête du championnat a changé 4 fois.
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Victoire surprise de Gabriel Bortoletto (Aston Martyn) à Kyalamy.
- Victoire surprise de Kimi Antoneli (McLarren) à Gilles-Villeneuves.
- Victoire surprise de Kimi Antoneli (McLarren) à Hungarorring.
- Victoire surprise de Oscar Piastry (Mercédes) à Marinna Bay, sous la pluie.
- Victoire surprise de Kimi Antoneli (McLarren) à Las Vegaz.
- Red Bul progresse de la 4e à la 1re place.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Kimi Antoneli
- Kimi Antoneli (Red Bul) remporte le titre avec 321 points et 6 victoires, 36 points devant Oscar Piastry (McLarren).
- La tête du championnat a changé 5 fois.
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Red Bul) à Suzuca.
- Victoire surprise de Oscar Piastry (McLarren) à Portimau.
- Victoire surprise de Oscar Piastry (McLarren) à Paul-Ricar.
- Victoire surprise de Oscar Piastry (McLarren) à Spa-Francorchamp.
- Victoire surprise de Kimi Antoneli (Red Bul) à Hungarorring.
- Victoire surprise de Kimi Antoneli (Red Bul) à Monzza.
- Victoire surprise de Kimi Antoneli (Red Bul) à Madrit.
- Victoire surprise de Daan Vos (Mercédes) à Lussail.
- Victoire surprise de Oscar Piastry (McLarren) à Yas Marinna.
- Mercédes recule de la 2e à la 5e place.
- Haass termine la saison sans marquer le moindre point.

**2033** — champion : Kimi Antoneli
- Kimi Antoneli (Red Bul) remporte le titre avec 369 points et 9 victoires, 83 points devant Samuel Marlow (Ferrary).
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Red Bul) à Suzuca.
- Victoire surprise de Kimi Antoneli (Red Bul) à Sakir.
- Victoire surprise de Kimi Antoneli (Red Bul) à Imolla.
- Victoire surprise de Gabriel Bortoletto (Aston Martyn) à Silverston, sous la pluie.

**2034** — champion : Oscar Piastry
- Oscar Piastry (Ferrary) remporte le titre avec 358 points et 10 victoires, 60 points devant Samuel Marlow (Ferrary).
- Ferrary décroche le titre des constructeurs (19e titre de son histoire).
- Victoire surprise de Gabriel Bortoletto (Aston Martyn) à Suzuca, sous la pluie.
- Audy progresse de la 7e à la 4e place.
- Haass termine la saison sans marquer le moindre point.

**2035** — champion : Oscar Piastry
- Oscar Piastry (Ferrary) remporte le titre avec 346 points et 9 victoires, 101 points devant Samuel Carlisle (McLarren).
- Ferrary décroche le titre des constructeurs (20e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Audy) à Jedda.
- Victoire surprise de Kimi Antoneli (Audy) à Monzza.
- Red Bul recule de la 3e à la 6e place.
- Cadilac termine la saison sans marquer le moindre point.

**2036** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 409 points et 13 victoires, 134 points devant Samuel Carlisle (McLarren).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Ferrary recule de la 1re à la 5e place.
- Haass termine la saison sans marquer le moindre point.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

**2037** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 304 points et 5 victoires, 24 points devant Louis Lambert (McLarren).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 5 fois.
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Audy) à Spielbergh, sous la pluie.
- Victoire surprise de Kimi Antoneli (Audy) à Istambull, sous la pluie.
- Red Bul recule de la 7e à la 10e place.
- Haass termine la saison sans marquer le moindre point.

**2038** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 311 points et 6 victoires, 31 points devant Louis Lambert (McLarren).
- Mercédes décroche le titre des constructeurs (16e titre de son histoire).
- Victoire surprise de Oscar Piastry (Cadilac) à Portimau, sous la pluie.
- Victoire surprise de Louis Lambert (McLarren) à Monzza.
- Audy recule de la 5e à la 10e place.
- Haass termine la saison sans marquer le moindre point.

**2039** — champion : Fleur Postma
- Fleur Postma (Mercédes) remporte le titre avec 244 points et 4 victoires, 3 points devant Louis Lambert (Alpyne).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Fleur Postma arrache le titre à Kimi Antoneli.
- La tête du championnat a changé 8 fois.
- Mercédes décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Oscar Piastry (Cadilac) à Hungarorring.
- Victoire surprise de Oscar Piastry (Cadilac) à Lussail.
- Alpyne progresse de la 6e à la 2e place.
- McLarren recule de la 3e à la 7e place.
- Haass termine la saison sans marquer le moindre point.

**2040** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 360 points et 10 victoires, 94 points devant Louis Lambert (Alpyne).
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- McLarren progresse de la 7e à la 1re place.
- Haass termine la saison sans marquer le moindre point.
- Red Bul, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2041** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 327 points et 7 victoires, 101 points devant Samuel Carlisle (Aston Martyn).
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Victoire surprise de Louis Lambert (Ferrary) à Monacco.

**2042** — champion : Fleur Postma
- Fleur Postma (McLarren) remporte le titre avec 208 points et 1 victoire, 4 points devant Kimi Antoneli (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 5 fois.
- McLarren décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Anna Kessler (Aston Martyn) à Shangai.
- Victoire surprise de Markus Albrecht (Wiliams) à Sakir.
- Victoire surprise de Louis Lambert (Ferrary) à Sepanng.
- Haass termine la saison sans marquer le moindre point.

**2043** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 227 points et 5 victoires, 6 points devant Markus Albrecht (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 4 fois.
- Mercédes décroche le titre des constructeurs (18e titre de son histoire).
- Cadilac progresse de la 7e à la 3e place.
- McLarren recule de la 1re à la 4e place.
- Aston Martyn recule de la 2e à la 7e place.

**2044** — champion : Nathan Ouellet
- Nathan Ouellet (Racing Buls) remporte le titre avec 250 points et 4 victoires, 38 points devant Markus Albrecht (Mercédes).
- La tête du championnat a changé 5 fois.
- Mercédes décroche le titre des constructeurs (19e titre de son histoire).
- Racing Buls progresse de la 5e à la 2e place.
- Red Bul progresse de la 8e à la 4e place.
- Wiliams recule de la 2e à la 6e place.

**2045** — champion : Ruben Bos
- Ruben Bos (Cadilac) remporte le titre avec 280 points et 5 victoires, 37 points devant Clara Nielsen (Cadilac).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 6 fois.
- Cadilac décroche le titre des constructeurs, le premier de son histoire.
- Victoire surprise de Álvaro Ferrer (Aston Martyn) à Portimau.
- Victoire surprise de Adrián Aranda (Alpyne) à Monzza.
- Victoire surprise de Álvaro Ferrer (Aston Martyn) à Istambull, sous la pluie.
- Ferrary progresse de la 10e à la 3e place.
- Alpyne progresse de la 7e à la 4e place.
- Audy progresse de la 9e à la 5e place.
- Racing Buls recule de la 2e à la 6e place.
- Mercédes recule de la 1re à la 7e place.
- Haass progresse de la 11e à la 8e place.
- McLarren recule de la 5e à la 10e place.
- Wiliams recule de la 6e à la 11e place.

**2046** — champion : Markus Albrecht
- Markus Albrecht (Cadilac) remporte le titre avec 397 points et 10 victoires, 57 points devant Ruben Bos (Cadilac).
- Cadilac décroche le titre des constructeurs (2e titre de son histoire).
- Cadilac signe 8 doublés.
- Victoire surprise de Álvaro Ferrer (Aston Martyn) à Paul-Ricar.
- Victoire surprise de Felix Neumann (McLarren) à Interlagoss, sous la pluie.
- Aston Martyn progresse de la 9e à la 5e place.
- McLarren progresse de la 10e à la 6e place.
- Alpyne recule de la 4e à la 7e place.
- Mercédes recule de la 7e à la 10e place.

**2047** — champion : Markus Albrecht
- Markus Albrecht (Cadilac) remporte le titre avec 414 points et 15 victoires, 173 points devant Ruben Bos (Cadilac).
- Une domination sans partage.
- Cadilac décroche le titre des constructeurs (3e titre de son histoire).
- Victoire surprise de Stefan Lehmann (Haass) à Spa-Francorchamp.
- Victoire surprise de Hao Guo (Ferrary) à Sepanng, sous la pluie.
- Racing Buls progresse de la 8e à la 2e place.
- Haass progresse de la 9e à la 5e place.
- Red Bul recule de la 2e à la 8e place.

**2048** — champion : Markus Albrecht
- Markus Albrecht (Cadilac) remporte le titre avec 324 points et 7 victoires, 93 points devant Ruben Bos (Cadilac).
- Cadilac décroche le titre des constructeurs (4e titre de son histoire).
- Haass recule de la 5e à la 8e place.
- Wiliams termine la saison sans marquer le moindre point.

**2049** — champion : Baptiste Bertrand
- Baptiste Bertrand (Alpyne) remporte le titre avec 216 points et 3 victoires, 17 points devant Austin Baxter (Cadilac).
- Retournement lors de la dernière manche : Baptiste Bertrand arrache le titre à Arthur Maes.
- La tête du championnat a changé 6 fois.
- Audy décroche le titre des constructeurs, le premier de son histoire.
- Alpyne progresse de la 10e à la 2e place.
- Mercédes progresse de la 9e à la 3e place.
- Cadilac recule de la 1re à la 4e place.
- Ferrary recule de la 2e à la 9e place.
- Wiliams termine la saison sans marquer le moindre point.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2050** — champion : Arthur Maes
- Arthur Maes (Audy) remporte le titre avec 250 points et 4 victoires, 17 points devant Ruben Bos (Audy).
- Le titre restait ouvert avant la dernière manche.
- Audy décroche le titre des constructeurs (2e titre de son histoire).
- Victoire surprise de Markus Albrecht (Mercédes) à Silverston.
- Ferrary progresse de la 9e à la 2e place.
- Aston Martyn progresse de la 7e à la 3e place.
- Alpyne recule de la 2e à la 5e place.
- Mercédes recule de la 3e à la 6e place.
- Haass progresse de la 10e à la 7e place.
- McLarren recule de la 5e à la 8e place.
- Racing Buls recule de la 6e à la 10e place.

**2051** — champion : Arthur Maes
- Arthur Maes (Audy) remporte le titre avec 251 points et 2 victoires, 22 points devant George Radcliffe (Aston Martyn).
- Le titre restait ouvert avant la dernière manche.
- Audy décroche le titre des constructeurs (3e titre de son histoire).
- Victoire surprise de Markus Albrecht (Mercédes) à Hungarorring.
- Victoire surprise de Markus Albrecht (Mercédes) à Interlagoss.
- Mercédes progresse de la 6e à la 3e place.
- Red Bul progresse de la 9e à la 6e place.
- Ferrary recule de la 2e à la 8e place.

**2052** — champion : George Radcliffe
- George Radcliffe (Aston Martyn) remporte le titre avec 240 points et 5 victoires, 7 points devant Markus Albrecht (Alpyne).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 4 fois.
- Audy décroche le titre des constructeurs (4e titre de son histoire).
- Ferrary progresse de la 8e à la 5e place.
- Mercédes recule de la 3e à la 7e place.
- Red Bul recule de la 6e à la 9e place.

**2053** — champion : Markus Albrecht
- Markus Albrecht (Alpyne) remporte le titre avec 335 points et 7 victoires, 112 points devant Arthur Maes (Audy).
- Audy décroche le titre des constructeurs (5e titre de son histoire).
- Aston Martyn recule de la 2e à la 5e place.
- Racing Buls progresse de la 10e à la 7e place.

**2054** — champion : Céline Schmid
- Céline Schmid (Alpyne) remporte le titre avec 213 points et 3 victoires, 44 points devant Thijs Brouwer (Cadilac).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 8 fois.
- Alpyne décroche le titre des constructeurs (4e titre de son histoire).
- Victoire surprise de Dylan Whitaker (McLarren) à Miamy.
- Victoire surprise de Baptiste Bertrand (Aston Martyn) à Zandvort.
- Racing Buls progresse de la 7e à la 4e place.
- Red Bul progresse de la 9e à la 5e place.
- McLarren progresse de la 10e à la 6e place.
- Mercédes recule de la 6e à la 9e place.
- Audy recule de la 1re à la 10e place.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

**2055** — champion : Céline Schmid
- Céline Schmid (Alpyne) remporte le titre avec 278 points et 2 victoires, 2 points devant Thijs Brouwer (Cadilac).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Céline Schmid arrache le titre à Thijs Brouwer.
- La tête du championnat a changé 6 fois.
- Alpyne décroche le titre des constructeurs (5e titre de son histoire).
- Aston Martyn progresse de la 7e à la 4e place.

**2056** — champion : Larissa Cardoso
- Larissa Cardoso (Alpyne) remporte le titre avec 193 points et 2 victoires, 13 points devant Arthur Maes (Cadilac).
- Retournement lors de la dernière manche : Larissa Cardoso arrache le titre à Arthur Maes.
- La tête du championnat a changé 4 fois.
- Alpyne décroche le titre des constructeurs (6e titre de son histoire).
- Victoire surprise de Nicolas Delmas (Ferrary) à Monzza.
- Haass progresse de la 7e à la 4e place.
- Mercédes progresse de la 11e à la 6e place.
- Ferrary recule de la 5e à la 9e place.

