# Rapport d’équilibrage — 100 graines × 10 saisons

Scénario grille-2026, graines 1 à 100, 1000 saisons simulées en 406,7 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 5,8 | 4,0 – 8,0 | 3,0 – 8,0 | 93 % |
| Écuries victorieuses par saison | 3,9 | 3,0 – 6,0 | 2,0 – 5,0 | 89 % |
| Part des victoires de l'écurie dominante | 61 % | 42 % – 83 % | 35 % – 80 % | 82 % |
| Taux d’abandon par départ | 7 % | 4 % – 10 % | 5 % – 15 % | 78 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,52 | 0,92 – 2,24 | 1,50 – 4,00 | 48 % |
| Écart de points entre les deux premiers | 75 | 11 – 160 | — | — |
| Changements de leader du championnat | 2,7 | 0,0 – 7,0 | — | — |
| Doublés par saison (toutes écuries) | 5,9 | 2,0 – 11,0 | — | — |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,90 | 0,78 – 0,98 | — | — |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 1,02 | 0,67 – 1,40 | — | — |
| Victoires inattendues par saison | 2,0 | 0,0 – 5,0 | — | — |
| Courses sous la pluie par saison | 2,7 | 1,0 – 5,0 | — | — |

## Par série de 10 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Champions pilotes différents sur 10 saisons | 3,0 | 2,0 – 5,0 | 3,0 – 7,0 | 66 % |
| Champions constructeurs différents sur 10 saisons | 2,3 | 1,0 – 3,0 | — | — |
| Plus longue série de titres constructeurs consécutifs | 6,4 | 4,0 – 10,0 | — | — |
| Écuries sans aucune victoire sur 10 saisons | 3,6 | 2,0 – 5,0 | — | — |
| Remontées (+3 places ou plus d’une saison à l’autre) | 4,7 | 2,0 – 8,0 | — | — |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 2,2 | 1,3 – 2,9 | — | — |
| Transitions de saison sans aucun changement d’étage (D-081) | 21 % | 0 % – 44 % | — | — |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 56 % | — | 40 % – 90 % | — |
| Séries de 10 saisons avec 5 titres constructeurs consécutifs ou plus | 73 % | — | 0 % – 25 % | — |
| Titre encore ouvert avant la dernière manche (définition exacte) | 24 % | — | — | — |
| Retournement à la dernière manche (le leader perd le titre) | 5 % | — | — | — |
| Champion et vice-champion coéquipiers | 42 % | — | — | — |
| Lutte jusqu’à la dernière manche entre coéquipiers | 11 % | — | — | — |
| Lutte jusqu’à la dernière manche entre écuries différentes | 13 % | — | — | — |
| Saisons très serrées (≤ 10 points d’écart) | 9 % | — | — | — |
| Dominations (≥ 120 points d’écart) | 20 % | — | — | — |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,45 | 0,40 – 0,50 | — | — |
| Coéquipiers : écart moyen dû aux compétences | 0,25 | 0,17 – 0,34 | — | — |
| Coéquipiers : écart moyen dû à la forme | 0,01 | 0,01 – 0,01 | — | — |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,34 – 0,39 | — | — |
| Coéquipiers : part de l’écart quadratique due aux compétences | 31 % | 19 % – 45 % | — | — |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 69 % | 54 % – 83 % | — | — |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,92 | 0,87 – 0,96 | — | — |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,94 – 0,99 | — | — |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,97 – 1,00 | — | — |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,11 | 0,64 – 1,55 | — | — |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 27 % | 9 % – 45 % | — | — |
| Pilotes : changements de position par concurrent sur la saison | 7,0 | 5,3 – 8,9 | — | — |
| Pilotes : écart moyen entre voisins (points) — haut | 49,4 | 31,2 – 68,4 | — | — |
| Pilotes : écart moyen entre voisins (points) — milieu | 23,7 | 13,9 – 32,9 | — | — |
| Pilotes : écart moyen entre voisins (points) — bas | 3,2 | 1,1 – 6,1 | — | — |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 94 % | 90 % – 100 % | — | — |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 71 % | 62 % – 76 % | — | — |
| Pilotes : frontières raisonnablement disputées — haut | 33 % | 0 % – 60 % | — | — |
| Pilotes : frontières raisonnablement disputées — milieu | 63 % | 43 % – 86 % | — | — |
| Pilotes : frontières raisonnablement disputées — bas | 99 % | 89 % – 100 % | — | — |
| Pilotes : positions déjà acquises à 3 manches de la fin | 2 % | 0 % – 5 % | — | — |
| Pilotes : positions déjà acquises — haut | 9 % | 0 % – 20 % | — | — |
| Pilotes : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 43 % | 23 % – 64 % | — | — |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 3 % | 0 % – 9 % | — | — |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,94 | 0,87 – 0,98 | — | — |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,97 | 0,93 – 0,99 | — | — |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 1,00 | — | — |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,45 | 0,18 – 0,73 | — | — |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 7 % | 0 % – 18 % | — | — |
| Constructeurs : changements de position par concurrent sur la saison | 4,0 | 2,3 – 5,9 | — | — |
| Constructeurs : écart moyen entre voisins (points) — haut | 151,9 | 99,8 – 196,0 | — | — |
| Constructeurs : écart moyen entre voisins (points) — milieu | 31,0 | 14,8 – 51,0 | — | — |
| Constructeurs : écart moyen entre voisins (points) — bas | 9,9 | 1,5 – 22,5 | — | — |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 82 % | 70 % – 90 % | — | — |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 55 % | 40 % – 70 % | — | — |
| Constructeurs : frontières raisonnablement disputées — haut | 18 % | 0 % – 50 % | — | — |
| Constructeurs : frontières raisonnablement disputées — milieu | 72 % | 50 % – 100 % | — | — |
| Constructeurs : frontières raisonnablement disputées — bas | 95 % | 100 % – 100 % | — | — |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 9 % | 0 % – 18 % | — | — |
| Constructeurs : positions déjà acquises — haut | 23 % | 0 % – 50 % | — | — |
| Constructeurs : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 49 % | 27 % – 73 % | — | — |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 10 % | 0 % – 18 % | — | — |

## Chronique d’exemple (graine 1)

**2027** — champion : George Russel
- George Russel (Mercédes) remporte le titre avec 417 points et 8 victoires, 19 points devant Kimi Antoneli (Mercédes).
- Mercédes décroche le titre des constructeurs (10e titre de son histoire).
- Mercédes signe 7 doublés.
- Victoire surprise de Lando Noris (McLarren) à Shangai, sous la pluie.
- Victoire surprise de Lando Noris (McLarren) à Suzuca.
- Victoire surprise de Max Verstapen (Red Bul) à Sakir.
- Victoire surprise de Lewis Hammilton (Ferrary) à Zandvort, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Austen.
- Victoire surprise de Max Verstapen (Red Bul) à Hermanos Rodrigues.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Cadilac termine la saison sans marquer le moindre point.

**2028** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 419 points et 7 victoires, 83 points devant Max Verstapen (Red Bul).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Mercédes signe 5 doublés.
- Audy progresse de la 10e à la 6e place.
- Wiliams recule de la 5e à la 10e place.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 395 points et 7 victoires, 7 points devant Max Verstapen (Red Bul).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 7 fois.
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Wiliams progresse de la 10e à la 7e place.
- Cadilac termine la saison sans marquer le moindre point.

**2030** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 386 points et 7 victoires, 3 points devant Max Verstapen (Red Bul).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Kimi Antoneli arrache le titre à Max Verstapen.
- La tête du championnat a changé 7 fois.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Suzuca.
- Victoire surprise de Oscar Piastry (McLarren) à Spielbergh.
- Victoire surprise de Max Verstapen (Red Bul) à Zandvort, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Austen.
- Victoire surprise de Oscar Piastry (McLarren) à Lussail.
- Haass progresse de la 10e à la 7e place.
- Wiliams recule de la 7e à la 10e place.

**2031** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 379 points et 5 victoires, 21 points devant Oscar Piastry (McLarren).
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Victoire surprise de Oscar Piastry (McLarren) à Shangai.
- Victoire surprise de Lando Noris (McLarren) à Suzuca.
- Victoire surprise de Kimi Antoneli (Mercédes) à Gilles-Villeneuves.
- Victoire surprise de Kimi Antoneli (Mercédes) à Spielbergh.
- Victoire surprise de Max Verstapen (Red Bul) à Zandvort.
- Victoire surprise de Oscar Piastry (McLarren) à Madrit, sous la pluie.
- Victoire surprise de Kimi Antoneli (Mercédes) à Austen.
- McLarren progresse de la 4e à la 1re place.
- Mercédes recule de la 1re à la 4e place.
- Aston Martyn progresse de la 8e à la 5e place.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 437 points et 8 victoires, 107 points devant Kimi Antoneli (Mercédes).
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Victoire surprise de Oscar Piastry (McLarren) à Jedda.
- Victoire surprise de Kimi Antoneli (Mercédes) à Hungarorring.
- Haass progresse de la 9e à la 5e place.

**2033** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 434 points et 11 victoires, 107 points devant Kimi Antoneli (Mercédes).
- Red Bul décroche le titre des constructeurs (8e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Mercédes) à Albert Parc, sous la pluie.
- Victoire surprise de Kimi Antoneli (Mercédes) à Suzuca.
- Victoire surprise de Tyler Sawyer (Audy) à Silverston, sous la pluie.

**2034** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 370 points et 8 victoires, 41 points devant Max Verstapen (Red Bul).
- La tête du championnat a changé 5 fois.
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Gabriel Bortoletto (Aston Martyn) à Suzuca, sous la pluie.
- Victoire surprise de Tyler Sawyer (Audy) à Miamy.
- Victoire surprise de Oscar Piastry (McLarren) à Monzza.
- Victoire surprise de Oscar Piastry (McLarren) à Austen.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Haass recule de la 6e à la 9e place.

**2035** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 405 points et 8 victoires, 122 points devant Max Verstapen (Red Bul).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Arvid Linblad (Racing Buls) à Shangai.
- Victoire surprise de Oscar Piastry (McLarren) à Monacco.
- Victoire surprise de Taylor Walsh (Haass) à Hermanos Rodrigues.

**2036** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 465 points et 12 victoires, 119 points devant Oscar Piastry (McLarren).
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Victoire surprise de Taylor Walsh (Haass) à Monacco.
- Victoire surprise de Max Verstapen (Red Bul) à Madrit.
- Aston Martyn progresse de la 9e à la 5e place.
- Wiliams progresse de la 10e à la 7e place.
- Audy recule de la 5e à la 10e place.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

