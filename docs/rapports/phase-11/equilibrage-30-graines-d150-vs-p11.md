# Rapport d’équilibrage — 30 graines × 10 saisons

Scénario grille-2026, graines 1 à 30, 300 saisons simulées en 445,2 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 6,1 | 4,0 – 8,0 | 3,0 – 8,0 | 91 % | 6,0 |
| Écuries victorieuses par saison | 4,2 | 3,0 – 6,0 | 2,0 – 5,0 | 83 % | 4,2 |
| Part des victoires de l'écurie dominante | 59 % | 38 % – 83 % | 35 % – 80 % | 79 % | 59 % |
| Taux d’abandon par départ | 7 % | 5 % – 10 % | 5 % – 15 % | 89 % | 7 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,55 | 0,91 – 2,24 | 1,50 – 4,00 | 50 % | 1,55 |
| Écart de points entre les deux premiers | 71 | 10 – 148 | — | — | 70 |
| Changements de leader du championnat | 2,9 | 0,0 – 7,0 | — | — | 2,9 |
| Doublés par saison (toutes écuries) | 5,5 | 1,0 – 11,0 | — | — | 5,4 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,89 | 0,77 – 0,97 | — | — | 0,89 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 1,04 | 0,69 – 1,45 | — | — | 1,04 |
| Victoires inattendues par saison | 2,6 | 0,0 – 6,0 | — | — | 2,7 |
| Courses sous la pluie par saison | 2,7 | 1,0 – 5,0 | — | — | 2,7 |

## Par série de 10 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 10 saisons | 4,5 | 3,0 – 6,0 | 3,0 – 7,0 | 100 % | 4,4 |
| Champions constructeurs différents sur 10 saisons | 2,8 | 2,0 – 4,0 | — | — | 2,9 |
| Plus longue série de titres constructeurs consécutifs | 4,7 | 3,0 – 7,0 | — | — | 4,8 |
| Écuries sans aucune victoire sur 10 saisons | 2,7 | 1,0 – 4,0 | — | — | 2,6 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 6,8 | 4,0 – 11,0 | — | — | 7,0 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 2,7 | 2,0 – 4,0 | — | — | 2,8 |
| Transitions de saison sans aucun changement d’étage (D-081) | 13 % | 0 % – 33 % | — | — | 12 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 57 % | — | 40 % – 90 % | — | 58 % |
| Séries de 10 saisons avec 5 titres constructeurs consécutifs ou plus | 43 % | — | 0 % – 25 % | — | 47 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 25 % | — | — | — | 25 % |
| Retournement à la dernière manche (le leader perd le titre) | 5 % | — | — | — | 6 % |
| Champion et vice-champion coéquipiers | 40 % | — | — | — | 42 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 10 % | — | — | — | 11 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 15 % | — | — | — | 14 % |
| Saisons très serrées (≤ 10 points d’écart) | 10 % | — | — | — | 11 % |
| Dominations (≥ 120 points d’écart) | 18 % | — | — | — | 18 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,44 | 0,40 – 0,50 | — | — | 0,45 |
| Coéquipiers : écart moyen dû aux compétences | 0,24 | 0,16 – 0,33 | — | — | 0,24 |
| Coéquipiers : écart moyen dû à la forme | 0,02 | 0,01 – 0,02 | — | — | 0,02 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,33 – 0,39 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 29 % | 18 % – 44 % | — | — | 30 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 70 % | 55 % – 84 % | — | — | 69 % |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,91 | 0,85 – 0,96 | — | — | 0,91 |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,93 – 0,99 | — | — | 0,96 |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 1,00 | — | — | 0,98 |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,18 | 0,73 – 1,73 | — | — | 1,16 |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 30 % | 14 % – 50 % | — | — | 29 % |
| Pilotes : changements de position par concurrent sur la saison | 7,4 | 5,4 – 9,8 | — | — | 7,5 |
| Pilotes : écart moyen entre voisins (points) — haut | 48,3 | 30,6 – 66,8 | — | — | 48,3 |
| Pilotes : écart moyen entre voisins (points) — milieu | 21,7 | 12,3 – 32,7 | — | — | 21,5 |
| Pilotes : écart moyen entre voisins (points) — bas | 3,8 | 1,2 – 6,7 | — | — | 3,9 |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 95 % | 90 % – 100 % | — | — | 95 % |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 72 % | 67 % – 81 % | — | — | 72 % |
| Pilotes : frontières raisonnablement disputées — haut | 32 % | 0 % – 60 % | — | — | 34 % |
| Pilotes : frontières raisonnablement disputées — milieu | 66 % | 43 % – 86 % | — | — | 67 % |
| Pilotes : frontières raisonnablement disputées — bas | 98 % | 89 % – 100 % | — | — | 98 % |
| Pilotes : positions déjà acquises à 3 manches de la fin | 2 % | 0 % – 5 % | — | — | 2 % |
| Pilotes : positions déjà acquises — haut | 8 % | 0 % – 20 % | — | — | 8 % |
| Pilotes : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 42 % | 23 % – 59 % | — | — | 42 % |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 2 % | 0 % – 5 % | — | — | 2 % |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,93 | 0,86 – 0,98 | — | — | 0,93 |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,92 – 0,99 | — | — | 0,96 |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 1,00 | — | — | 0,98 |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,47 | 0,18 – 0,91 | — | — | 0,47 |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 8 % | 0 % – 18 % | — | — | 8 % |
| Constructeurs : changements de position par concurrent sur la saison | 4,3 | 2,5 – 6,3 | — | — | 4,2 |
| Constructeurs : écart moyen entre voisins (points) — haut | 139,7 | 77,3 – 190,0 | — | — | 139,1 |
| Constructeurs : écart moyen entre voisins (points) — milieu | 34,7 | 17,0 – 56,3 | — | — | 34,3 |
| Constructeurs : écart moyen entre voisins (points) — bas | 11,6 | 2,0 – 26,0 | — | — | 12,4 |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 83 % | 70 % – 90 % | — | — | 84 % |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 53 % | 40 % – 60 % | — | — | 54 % |
| Constructeurs : frontières raisonnablement disputées — haut | 20 % | 0 % – 50 % | — | — | 20 % |
| Constructeurs : frontières raisonnablement disputées — milieu | 66 % | 50 % – 100 % | — | — | 68 % |
| Constructeurs : frontières raisonnablement disputées — bas | 94 % | 50 % – 100 % | — | — | 94 % |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 8 % | 0 % – 18 % | — | — | 8 % |
| Constructeurs : positions déjà acquises — haut | 22 % | 0 % – 50 % | — | — | 21 % |
| Constructeurs : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — | 0 % |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 48 % | 18 % – 73 % | — | — | 49 % |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 9 % | 0 % – 18 % | — | — | 9 % |

## Chronique d’exemple (graine 1)

**2027** — champion : George Russel
- George Russel (Mercédes) remporte le titre avec 419 points et 8 victoires, 14 points devant Kimi Antoneli (Mercédes).
- Mercédes décroche le titre des constructeurs (10e titre de son histoire).
- Mercédes signe 7 doublés.
- Victoire surprise de Lando Noris (McLarren) à Shangai, sous la pluie.
- Victoire surprise de Lando Noris (McLarren) à Suzuca.
- Victoire surprise de Max Verstapen (Red Bul) à Sakir.
- Victoire surprise de Lewis Hammilton (Ferrary) à Zandvort, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Austen.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Cadilac termine la saison sans marquer le moindre point.

**2028** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 441 points et 8 victoires, 85 points devant Max Verstapen (Red Bul).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Audy progresse de la 10e à la 7e place.
- Wiliams recule de la 5e à la 8e place.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 399 points et 7 victoires, 15 points devant Kimi Antoneli (McLarren).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 5 fois.
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Wiliams progresse de la 8e à la 5e place.
- Audy recule de la 7e à la 10e place.
- Cadilac termine la saison sans marquer le moindre point.

**2030** — champion : Lando Noris
- Lando Noris (Mercédes) remporte le titre avec 415 points et 6 victoires, 22 points devant Oscar Piastry (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Mercédes signe 10 doublés.
- Victoire surprise de Kimi Antoneli (McLarren) à Shangai, sous la pluie.
- Victoire surprise de Kimi Antoneli (McLarren) à Sakir.
- Victoire surprise de Kimi Antoneli (McLarren) à Hermanos Rodrigues.
- Aston Martyn progresse de la 8e à la 5e place.
- Wiliams recule de la 5e à la 8e place.
- Cadilac termine la saison sans marquer le moindre point.

**2031** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 477 points et 12 victoires, 138 points devant Oscar Piastry (Mercédes).
- Une domination sans partage.
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Victoire surprise de Oscar Piastry (Mercédes) à Madrit, sous la pluie.
- Victoire surprise de Oscar Piastry (Mercédes) à Bakou.
- Aston Martyn recule de la 5e à la 8e place.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 460 points et 12 victoires, 164 points devant Kimi Antoneli (Mercédes).
- Une domination sans partage.
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Mercédes) à Albert Parc.
- Victoire surprise de Louis Lambert (Alpyne) à Madrit.
- Victoire surprise de Louis Lambert (Alpyne) à Austen.
- McLarren recule de la 1re à la 4e place.
- Racing Buls recule de la 5e à la 8e place.

**2033** — champion : Max Verstapen
- Max Verstapen (Ferrary) remporte le titre avec 504 points et 15 victoires, 224 points devant Kimi Antoneli (Mercédes).
- Une domination sans partage.
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Louis Lambert (Alpyne) à Suzuca.
- Victoire surprise de Oscar Piastry (Wiliams) à Gilles-Villeneuves.
- Victoire surprise de Oliver Bearmann (Racing Buls) à Silverston, sous la pluie.
- Red Bul recule de la 1re à la 4e place.
- Audy progresse de la 10e à la 7e place.

**2034** — champion : Max Verstapen
- Max Verstapen (Ferrary) remporte le titre avec 483 points et 14 victoires, 148 points devant Oscar Piastry (McLarren).
- Une domination sans partage.
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Ferrary signe 5 doublés.
- Victoire surprise de Kimi Antoneli (Mercédes) à Shangai.
- Victoire surprise de Kimi Antoneli (Mercédes) à Hungarorring.
- Victoire surprise de Kimi Antoneli (Mercédes) à Bakou.
- Cadilac progresse de la 10e à la 6e place.
- Alpyne recule de la 5e à la 8e place.

**2035** — champion : Kimi Antoneli
- Kimi Antoneli (Ferrary) remporte le titre avec 423 points et 12 victoires, 126 points devant Oscar Piastry (McLarren).
- Une domination sans partage.
- Ferrary décroche le titre des constructeurs (19e titre de son histoire).
- Victoire surprise de Oscar Piastry (McLarren) à Monacco.
- Alpyne recule de la 8e à la 11e place.

**2036** — champion : Kimi Antoneli
- Kimi Antoneli (Ferrary) remporte le titre avec 480 points et 16 victoires, 220 points devant Oscar Piastry (Audy).
- Une domination sans partage.
- Ferrary décroche le titre des constructeurs (20e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Shangai.
- Victoire surprise de Oscar Piastry (Audy) à Gilles-Villeneuves.
- Victoire surprise de Oscar Piastry (Audy) à Spielbergh.
- McLarren recule de la 2e à la 5e place.
- Alpyne progresse de la 11e à la 6e place.

