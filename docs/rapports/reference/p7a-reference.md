# Rapport d’équilibrage — 100 graines × 10 saisons

Scénario grille-2026, graines 1 à 100, 1000 saisons simulées en 995,7 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 6,0 | 4,0 – 8,0 | 3,0 – 8,0 | 91 % | 5,8 |
| Écuries victorieuses par saison | 4,1 | 3,0 – 6,0 | 2,0 – 5,0 | 86 % | 3,9 |
| Part des victoires de l'écurie dominante | 60 % | 38 % – 83 % | 35 % – 80 % | 79 % | 61 % |
| Taux d’abandon par départ | 7 % | 4 % – 10 % | 5 % – 15 % | 77 % | 7 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,53 | 0,92 – 2,24 | 1,50 – 4,00 | 49 % | 1,52 |
| Écart de points entre les deux premiers | 67 | 10 – 145 | — | — | 75 |
| Changements de leader du championnat | 2,9 | 0,0 – 7,0 | — | — | 2,7 |
| Doublés par saison (toutes écuries) | 5,7 | 2,0 – 11,0 | — | — | 5,9 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,90 | 0,79 – 0,97 | — | — | 0,90 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 1,01 | 0,67 – 1,40 | — | — | 1,02 |
| Victoires inattendues par saison | 2,4 | 0,0 – 6,0 | — | — | 2,0 |
| Courses sous la pluie par saison | 2,7 | 1,0 – 5,0 | — | — | 2,7 |

## Par série de 10 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 10 saisons | 4,6 | 3,0 – 6,0 | 3,0 – 7,0 | 95 % | 3,0 |
| Champions constructeurs différents sur 10 saisons | 2,6 | 2,0 – 4,0 | — | — | 2,3 |
| Plus longue série de titres constructeurs consécutifs | 5,4 | 3,0 – 9,0 | — | — | 6,4 |
| Écuries sans aucune victoire sur 10 saisons | 3,0 | 1,0 – 5,0 | — | — | 3,6 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 5,6 | 3,0 – 9,0 | — | — | 4,7 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 2,6 | 1,8 – 3,3 | — | — | 2,2 |
| Transitions de saison sans aucun changement d’étage (D-081) | 15 % | 0 % – 33 % | — | — | 21 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 61 % | — | 40 % – 90 % | — | 56 % |
| Séries de 10 saisons avec 5 titres constructeurs consécutifs ou plus | 57 % | — | 0 % – 25 % | — | 73 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 25 % | — | — | — | 24 % |
| Retournement à la dernière manche (le leader perd le titre) | 5 % | — | — | — | 5 % |
| Champion et vice-champion coéquipiers | 44 % | — | — | — | 42 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 11 % | — | — | — | 11 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 14 % | — | — | — | 13 % |
| Saisons très serrées (≤ 10 points d’écart) | 10 % | — | — | — | 9 % |
| Dominations (≥ 120 points d’écart) | 18 % | — | — | — | 20 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,44 | 0,39 – 0,49 | — | — | 0,45 |
| Coéquipiers : écart moyen dû aux compétences | 0,24 | 0,17 – 0,32 | — | — | 0,25 |
| Coéquipiers : écart moyen dû à la forme | 0,01 | 0,01 – 0,01 | — | — | 0,01 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,33 – 0,40 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 29 % | 18 % – 43 % | — | — | 31 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 70 % | 55 % – 84 % | — | — | 69 % |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,92 | 0,87 – 0,96 | — | — | 0,92 |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,93 – 0,99 | — | — | 0,96 |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,97 – 1,00 | — | — | 0,98 |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,16 | 0,73 – 1,64 | — | — | 1,11 |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 29 % | 14 % – 45 % | — | — | 27 % |
| Pilotes : changements de position par concurrent sur la saison | 7,3 | 5,5 – 9,3 | — | — | 7,0 |
| Pilotes : écart moyen entre voisins (points) — haut | 49,8 | 32,0 – 67,6 | — | — | 49,4 |
| Pilotes : écart moyen entre voisins (points) — milieu | 21,8 | 12,4 – 32,0 | — | — | 23,7 |
| Pilotes : écart moyen entre voisins (points) — bas | 3,7 | 1,2 – 6,7 | — | — | 3,2 |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 94 % | 90 % – 100 % | — | — | 94 % |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 72 % | 62 % – 81 % | — | — | 71 % |
| Pilotes : frontières raisonnablement disputées — haut | 32 % | 0 % – 60 % | — | — | 33 % |
| Pilotes : frontières raisonnablement disputées — milieu | 66 % | 43 % – 86 % | — | — | 63 % |
| Pilotes : frontières raisonnablement disputées — bas | 98 % | 89 % – 100 % | — | — | 99 % |
| Pilotes : positions déjà acquises à 3 manches de la fin | 2 % | 0 % – 5 % | — | — | 2 % |
| Pilotes : positions déjà acquises — haut | 8 % | 0 % – 20 % | — | — | 9 % |
| Pilotes : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — | 0 % |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 42 % | 23 % – 64 % | — | — | 43 % |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 2 % | 0 % – 5 % | — | — | 3 % |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,93 | 0,87 – 0,98 | — | — | 0,94 |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,97 | 0,93 – 0,99 | — | — | 0,97 |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 1,00 | — | — | 0,98 |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,46 | 0,18 – 0,73 | — | — | 0,45 |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 8 % | 0 % – 18 % | — | — | 7 % |
| Constructeurs : changements de position par concurrent sur la saison | 4,1 | 2,4 – 5,9 | — | — | 4,0 |
| Constructeurs : écart moyen entre voisins (points) — haut | 146,4 | 90,3 – 190,3 | — | — | 151,9 |
| Constructeurs : écart moyen entre voisins (points) — milieu | 34,2 | 17,8 – 54,3 | — | — | 31,0 |
| Constructeurs : écart moyen entre voisins (points) — bas | 11,2 | 2,0 – 25,5 | — | — | 9,9 |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 82 % | 70 % – 90 % | — | — | 82 % |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 54 % | 40 % – 70 % | — | — | 55 % |
| Constructeurs : frontières raisonnablement disputées — haut | 20 % | 0 % – 50 % | — | — | 18 % |
| Constructeurs : frontières raisonnablement disputées — milieu | 68 % | 50 % – 100 % | — | — | 72 % |
| Constructeurs : frontières raisonnablement disputées — bas | 94 % | 50 % – 100 % | — | — | 95 % |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 9 % | 0 % – 18 % | — | — | 9 % |
| Constructeurs : positions déjà acquises — haut | 24 % | 0 % – 50 % | — | — | 23 % |
| Constructeurs : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — | 0 % |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 49 % | 27 % – 73 % | — | — | 49 % |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 10 % | 0 % – 18 % | — | — | 10 % |

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
- Kimi Antoneli (Mercédes) remporte le titre avec 439 points et 8 victoires, 91 points devant Max Verstapen (Red Bul).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Mercédes signe 5 doublés.
- Audy progresse de la 10e à la 6e place.
- Wiliams recule de la 5e à la 8e place.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 399 points et 8 victoires, 51 points devant Kimi Antoneli (McLarren).
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Wiliams progresse de la 8e à la 5e place.
- Audy recule de la 6e à la 10e place.
- Cadilac termine la saison sans marquer le moindre point.

**2030** — champion : Lando Noris
- Lando Noris (Mercédes) remporte le titre avec 402 points et 6 victoires, 12 points devant Oscar Piastry (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 8 fois.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Mercédes signe 9 doublés.
- Audy termine la saison sans marquer le moindre point.
- Cadilac termine la saison sans marquer le moindre point.

**2031** — champion : Max Verstapen
- Max Verstapen (Ferrary) remporte le titre avec 490 points et 12 victoires, 118 points devant Kimi Antoneli (McLarren).
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Oscar Piastry (Mercédes) à Madrit, sous la pluie.
- Victoire surprise de Kimi Antoneli (McLarren) à Austen.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Max Verstapen
- Max Verstapen (Ferrary) remporte le titre avec 432 points et 9 victoires, 36 points devant Oscar Piastry (Red Bul).
- Le titre restait ouvert avant la dernière manche.
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Red Bul progresse de la 4e à la 1re place.

**2033** — champion : Taylor Walsh
- Taylor Walsh (Red Bul) remporte le titre avec 423 points et 8 victoires, 26 points devant Oscar Piastry (Red Bul).
- Red Bul décroche le titre des constructeurs (8e titre de son histoire).
- Red Bul signe 6 doublés.
- Victoire surprise de Kimi Antoneli (Mercédes) à Suzuca.
- Victoire surprise de Oliver Bearmann (Racing Buls) à Silverston, sous la pluie.
- Audy progresse de la 9e à la 6e place.
- Aston Martyn recule de la 7e à la 10e place.

**2034** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 369 points et 10 victoires, 58 points devant Taylor Walsh (McLarren).
- La tête du championnat a changé 4 fois.
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Victoire surprise de Connor Fletcher (Audy) à Suzuca, sous la pluie.
- Victoire surprise de Max Verstapen (McLarren) à Jedda.
- Victoire surprise de Oscar Piastry (Aston Martyn) à Monzza.
- Victoire surprise de Taylor Walsh (McLarren) à Austen.
- Aston Martyn progresse de la 10e à la 5e place.
- Red Bul recule de la 1re à la 6e place.
- Racing Buls recule de la 7e à la 11e place.

**2035** — champion : Taylor Walsh
- Taylor Walsh (McLarren) remporte le titre avec 275 points et 3 victoires, 3 points devant Marco Sartori (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Taylor Walsh arrache le titre à Marco Sartori.
- La tête du championnat a changé 9 fois.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Oliver Bearmann (Cadilac) à Suzuca.
- Audy progresse de la 7e à la 4e place.
- Red Bul recule de la 6e à la 10e place.

**2036** — champion : Max Verstapen
- Max Verstapen (Alpyne) remporte le titre avec 340 points et 7 victoires, 12 points devant Taylor Walsh (McLarren).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 5 fois.
- Alpyne décroche le titre des constructeurs (4e titre de son histoire).
- Victoire surprise de Connor Fletcher (Audy) à Jedda.
- Victoire surprise de Oscar Piastry (Red Bul) à Gilles-Villeneuves.
- Red Bul progresse de la 10e à la 5e place.
- Racing Buls termine la saison sans marquer le moindre point.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

