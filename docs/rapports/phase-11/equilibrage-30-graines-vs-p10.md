# Rapport d’équilibrage — 30 graines × 10 saisons

Scénario grille-2026, graines 1 à 30, 300 saisons simulées en 500,2 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence p10 (avant phase 11) |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 6,0 | 4,0 – 8,0 | 3,0 – 8,0 | 92 % | 6,1 |
| Écuries victorieuses par saison | 4,2 | 3,0 – 6,0 | 2,0 – 5,0 | 82 % | 4,2 |
| Part des victoires de l'écurie dominante | 59 % | 35 % – 83 % | 35 % – 80 % | 76 % | 59 % |
| Taux d’abandon par départ | 7 % | 5 % – 10 % | 5 % – 15 % | 91 % | 7 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,55 | 0,90 – 2,24 | 1,50 – 4,00 | 50 % | 1,55 |
| Écart de points entre les deux premiers | 70 | 10 – 152 | — | — | 69 |
| Changements de leader du championnat | 2,9 | 0,0 – 7,0 | — | — | 2,9 |
| Doublés par saison (toutes écuries) | 5,4 | 1,0 – 11,0 | — | — | 5,5 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,89 | 0,78 – 0,97 | — | — | 0,88 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 1,04 | 0,69 – 1,42 | — | — | 1,04 |
| Victoires inattendues par saison | 2,7 | 0,0 – 6,0 | — | — | 2,7 |
| Courses sous la pluie par saison | 2,7 | 1,0 – 5,0 | — | — | 2,7 |

## Par série de 10 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence p10 (avant phase 11) |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 10 saisons | 4,4 | 3,0 – 6,0 | 3,0 – 7,0 | 100 % | 4,4 |
| Champions constructeurs différents sur 10 saisons | 2,9 | 2,0 – 4,0 | — | — | 2,9 |
| Plus longue série de titres constructeurs consécutifs | 4,8 | 3,0 – 8,0 | — | — | 4,6 |
| Écuries sans aucune victoire sur 10 saisons | 2,6 | 1,0 – 4,0 | — | — | 2,5 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 7,0 | 4,0 – 13,0 | — | — | 7,2 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 2,8 | 2,0 – 4,0 | — | — | 2,8 |
| Transitions de saison sans aucun changement d’étage (D-081) | 12 % | 0 % – 33 % | — | — | 13 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence p10 (avant phase 11) |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 58 % | — | 40 % – 90 % | — | 55 % |
| Séries de 10 saisons avec 5 titres constructeurs consécutifs ou plus | 47 % | — | 0 % – 25 % | — | 43 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 25 % | — | — | — | 26 % |
| Retournement à la dernière manche (le leader perd le titre) | 6 % | — | — | — | 6 % |
| Champion et vice-champion coéquipiers | 42 % | — | — | — | 45 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 11 % | — | — | — | 11 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 14 % | — | — | — | 15 % |
| Saisons très serrées (≤ 10 points d’écart) | 11 % | — | — | — | 11 % |
| Dominations (≥ 120 points d’écart) | 18 % | — | — | — | 18 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,45 | 0,40 – 0,50 | — | — | 0,45 |
| Coéquipiers : écart moyen dû aux compétences | 0,24 | 0,17 – 0,33 | — | — | 0,24 |
| Coéquipiers : écart moyen dû à la forme | 0,02 | 0,01 – 0,02 | — | — | 0,01 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,33 – 0,40 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 30 % | 18 % – 43 % | — | — | 30 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 69 % | 53 % – 83 % | — | — | 69 % |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence p10 (avant phase 11) |
| --- | --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,91 | 0,86 – 0,96 | — | — | 0,91 |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,93 – 0,99 | — | — | 0,96 |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 1,00 | — | — | 0,98 |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,16 | 0,73 – 1,64 | — | — | 1,18 |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 29 % | 14 % – 45 % | — | — | 30 % |
| Pilotes : changements de position par concurrent sur la saison | 7,5 | 5,4 – 9,7 | — | — | 7,5 |
| Pilotes : écart moyen entre voisins (points) — haut | 48,3 | 29,8 – 67,4 | — | — | 48,0 |
| Pilotes : écart moyen entre voisins (points) — milieu | 21,5 | 12,0 – 32,7 | — | — | 21,6 |
| Pilotes : écart moyen entre voisins (points) — bas | 3,9 | 1,2 – 6,9 | — | — | 3,8 |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 95 % | 90 % – 100 % | — | — | 95 % |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 72 % | 67 % – 81 % | — | — | 72 % |
| Pilotes : frontières raisonnablement disputées — haut | 34 % | 0 % – 60 % | — | — | 32 % |
| Pilotes : frontières raisonnablement disputées — milieu | 67 % | 43 % – 86 % | — | — | 66 % |
| Pilotes : frontières raisonnablement disputées — bas | 98 % | 89 % – 100 % | — | — | 98 % |
| Pilotes : positions déjà acquises à 3 manches de la fin | 2 % | 0 % – 5 % | — | — | 2 % |
| Pilotes : positions déjà acquises — haut | 8 % | 0 % – 20 % | — | — | 8 % |
| Pilotes : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 42 % | 27 % – 59 % | — | — | 42 % |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 2 % | 0 % – 5 % | — | — | 2 % |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,93 | 0,87 – 0,98 | — | — | 0,93 |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,92 – 0,99 | — | — | 0,96 |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 1,00 | — | — | 0,98 |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,47 | 0,18 – 0,73 | — | — | 0,47 |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 8 % | 0 % – 18 % | — | — | 8 % |
| Constructeurs : changements de position par concurrent sur la saison | 4,2 | 2,5 – 6,2 | — | — | 4,3 |
| Constructeurs : écart moyen entre voisins (points) — haut | 139,1 | 77,3 – 190,3 | — | — | 139,9 |
| Constructeurs : écart moyen entre voisins (points) — milieu | 34,3 | 18,0 – 54,3 | — | — | 34,6 |
| Constructeurs : écart moyen entre voisins (points) — bas | 12,4 | 2,0 – 28,0 | — | — | 12,2 |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 84 % | 70 % – 90 % | — | — | 83 % |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 54 % | 40 % – 60 % | — | — | 54 % |
| Constructeurs : frontières raisonnablement disputées — haut | 20 % | 0 % – 50 % | — | — | 21 % |
| Constructeurs : frontières raisonnablement disputées — milieu | 68 % | 50 % – 100 % | — | — | 67 % |
| Constructeurs : frontières raisonnablement disputées — bas | 94 % | 50 % – 100 % | — | — | 93 % |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 8 % | 0 % – 18 % | — | — | 9 % |
| Constructeurs : positions déjà acquises — haut | 21 % | 0 % – 50 % | — | — | 23 % |
| Constructeurs : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — | 0 % |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 49 % | 27 % – 73 % | — | — | 49 % |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 9 % | 0 % – 18 % | — | — | 10 % |

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
- Kimi Antoneli (Mercédes) remporte le titre avec 443 points et 8 victoires, 87 points devant Max Verstapen (Red Bul).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Audy progresse de la 10e à la 7e place.
- Wiliams recule de la 5e à la 8e place.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 401 points et 7 victoires, 20 points devant Kimi Antoneli (McLarren).
- La tête du championnat a changé 5 fois.
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Wiliams progresse de la 8e à la 5e place.
- Audy recule de la 7e à la 10e place.
- Cadilac termine la saison sans marquer le moindre point.

**2030** — champion : Lando Noris
- Lando Noris (Mercédes) remporte le titre avec 422 points et 7 victoires, 29 points devant Oscar Piastry (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Mercédes signe 10 doublés.
- Victoire surprise de Kimi Antoneli (McLarren) à Shangai, sous la pluie.
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
- Max Verstapen (Ferrary) remporte le titre avec 504 points et 15 victoires, 222 points devant Kimi Antoneli (Mercédes).
- Une domination sans partage.
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Louis Lambert (Alpyne) à Suzuca.
- Victoire surprise de Oscar Piastry (Wiliams) à Gilles-Villeneuves.
- Victoire surprise de Oliver Bearmann (Racing Buls) à Silverston, sous la pluie.
- Red Bul recule de la 1re à la 4e place.
- Audy progresse de la 10e à la 7e place.

**2034** — champion : Max Verstapen
- Max Verstapen (Ferrary) remporte le titre avec 480 points et 14 victoires, 148 points devant Oscar Piastry (McLarren).
- Une domination sans partage.
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Ferrary signe 5 doublés.
- Victoire surprise de Kimi Antoneli (Mercédes) à Shangai.
- Victoire surprise de Kimi Antoneli (Mercédes) à Hungarorring.
- Victoire surprise de Kimi Antoneli (Mercédes) à Bakou.
- Cadilac progresse de la 10e à la 7e place.
- Aston Martyn progresse de la 11e à la 8e place.
- Wiliams recule de la 6e à la 9e place.
- Haass recule de la 8e à la 11e place.

**2035** — champion : Kimi Antoneli
- Kimi Antoneli (Ferrary) remporte le titre avec 402 points et 11 victoires, 108 points devant Oscar Piastry (McLarren).
- Ferrary décroche le titre des constructeurs (19e titre de son histoire).
- Victoire surprise de Oscar Piastry (McLarren) à Monacco.
- Alpyne recule de la 6e à la 11e place.

**2036** — champion : Kimi Antoneli
- Kimi Antoneli (Ferrary) remporte le titre avec 475 points et 16 victoires, 210 points devant Anna Kessler (Mercédes).
- Une domination sans partage.
- Ferrary décroche le titre des constructeurs (20e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Shangai.
- Victoire surprise de Oscar Piastry (Audy) à Gilles-Villeneuves.
- Victoire surprise de Oscar Piastry (Audy) à Spielbergh.
- Victoire surprise de Max Verstapen (Red Bul) à Madrit.
- McLarren recule de la 2e à la 7e place.
- Alpyne progresse de la 11e à la 8e place.
- Cadilac recule de la 6e à la 10e place.

