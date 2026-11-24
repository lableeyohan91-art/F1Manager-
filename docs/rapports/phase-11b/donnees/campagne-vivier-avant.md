# Rapport d’équilibrage — 20 graines × 10 saisons

Scénario grille-2026, graines 1 à 20, 200 saisons simulées en 297,6 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 6,2 | 4,0 – 9,0 | 3,0 – 8,0 | 89 % |
| Écuries victorieuses par saison | 4,3 | 3,0 – 6,0 | 2,0 – 5,0 | 81 % |
| Part des victoires de l'écurie dominante | 57 % | 38 % – 83 % | 35 % – 80 % | 80 % |
| Taux d’abandon par départ | 7 % | 5 % – 10 % | 5 % – 15 % | 91 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,54 | 0,88 – 2,24 | 1,50 – 4,00 | 52 % |
| Écart de points entre les deux premiers | 66 | 9 – 150 | — | — |
| Changements de leader du championnat | 3,0 | 0,0 – 7,0 | — | — |
| Doublés par saison (toutes écuries) | 5,4 | 1,0 – 11,0 | — | — |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,88 | 0,76 – 0,97 | — | — |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 1,04 | 0,67 – 1,40 | — | — |
| Victoires inattendues par saison | 2,5 | 0,0 – 6,0 | — | — |
| Courses sous la pluie par saison | 2,7 | 1,0 – 5,0 | — | — |

## Par série de 10 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Champions pilotes différents sur 10 saisons | 4,2 | 3,0 – 5,0 | 3,0 – 7,0 | 100 % |
| Champions constructeurs différents sur 10 saisons | 3,0 | 2,0 – 4,0 | — | — |
| Plus longue série de titres constructeurs consécutifs | 5,0 | 3,0 – 8,0 | — | — |
| Écuries sans aucune victoire sur 10 saisons | 2,7 | 1,0 – 4,0 | — | — |
| Remontées (+3 places ou plus d’une saison à l’autre) | 6,3 | 4,0 – 10,0 | — | — |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 2,6 | 2,0 – 3,6 | — | — |
| Transitions de saison sans aucun changement d’étage (D-081) | 14 % | 0 % – 33 % | — | — |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 56 % | — | 40 % – 90 % | — |
| Séries de 10 saisons avec 5 titres constructeurs consécutifs ou plus | 45 % | — | 0 % – 25 % | — |
| Titre encore ouvert avant la dernière manche (définition exacte) | 27 % | — | — | — |
| Retournement à la dernière manche (le leader perd le titre) | 6 % | — | — | — |
| Champion et vice-champion coéquipiers | 42 % | — | — | — |
| Lutte jusqu’à la dernière manche entre coéquipiers | 11 % | — | — | — |
| Lutte jusqu’à la dernière manche entre écuries différentes | 16 % | — | — | — |
| Saisons très serrées (≤ 10 points d’écart) | 12 % | — | — | — |
| Dominations (≥ 120 points d’écart) | 14 % | — | — | — |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,44 | 0,40 – 0,50 | — | — |
| Coéquipiers : écart moyen dû aux compétences | 0,24 | 0,16 – 0,32 | — | — |
| Coéquipiers : écart moyen dû à la forme | 0,02 | 0,01 – 0,02 | — | — |
| Coéquipiers : écart moyen dû à l’aléa | 0,37 | 0,34 – 0,40 | — | — |
| Coéquipiers : part de l’écart quadratique due aux compétences | 29 % | 17 % – 44 % | — | — |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 70 % | 56 % – 84 % | — | — |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,91 | 0,86 – 0,96 | — | — |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,93 – 0,98 | — | — |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 0,99 | — | — |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,20 | 0,73 – 1,64 | — | — |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 30 % | 14 % – 45 % | — | — |
| Pilotes : changements de position par concurrent sur la saison | 7,6 | 5,5 – 9,9 | — | — |
| Pilotes : écart moyen entre voisins (points) — haut | 47,7 | 30,4 – 65,2 | — | — |
| Pilotes : écart moyen entre voisins (points) — milieu | 21,7 | 11,7 – 32,6 | — | — |
| Pilotes : écart moyen entre voisins (points) — bas | 3,8 | 1,1 – 7,1 | — | — |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 95 % | 90 % – 100 % | — | — |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 72 % | 67 % – 81 % | — | — |
| Pilotes : frontières raisonnablement disputées — haut | 32 % | 0 % – 60 % | — | — |
| Pilotes : frontières raisonnablement disputées — milieu | 67 % | 43 % – 86 % | — | — |
| Pilotes : frontières raisonnablement disputées — bas | 98 % | 89 % – 100 % | — | — |
| Pilotes : positions déjà acquises à 3 manches de la fin | 2 % | 0 % – 5 % | — | — |
| Pilotes : positions déjà acquises — haut | 8 % | 0 % – 20 % | — | — |
| Pilotes : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 40 % | 23 % – 59 % | — | — |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 2 % | 0 % – 5 % | — | — |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,93 | 0,85 – 0,98 | — | — |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,93 – 0,99 | — | — |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 1,00 | — | — |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,48 | 0,18 – 0,73 | — | — |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 9 % | 0 % – 27 % | — | — |
| Constructeurs : changements de position par concurrent sur la saison | 4,2 | 2,5 – 6,1 | — | — |
| Constructeurs : écart moyen entre voisins (points) — haut | 139,8 | 85,0 – 186,0 | — | — |
| Constructeurs : écart moyen entre voisins (points) — milieu | 33,7 | 19,0 – 54,8 | — | — |
| Constructeurs : écart moyen entre voisins (points) — bas | 12,1 | 2,5 – 27,5 | — | — |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 84 % | 80 % – 90 % | — | — |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 53 % | 40 % – 60 % | — | — |
| Constructeurs : frontières raisonnablement disputées — haut | 19 % | 0 % – 50 % | — | — |
| Constructeurs : frontières raisonnablement disputées — milieu | 67 % | 50 % – 75 % | — | — |
| Constructeurs : frontières raisonnablement disputées — bas | 93 % | 50 % – 100 % | — | — |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 8 % | 0 % – 18 % | — | — |
| Constructeurs : positions déjà acquises — haut | 21 % | 0 % – 50 % | — | — |
| Constructeurs : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 48 % | 27 % – 73 % | — | — |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 9 % | 0 % – 18 % | — | — |

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
- Kimi Antoneli (Mercédes) remporte le titre avec 446 points et 8 victoires, 86 points devant Max Verstapen (Red Bul).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Mercédes signe 5 doublés.
- Audy progresse de la 10e à la 7e place.
- Wiliams recule de la 5e à la 8e place.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 404 points et 7 victoires, 15 points devant Kimi Antoneli (McLarren).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 7 fois.
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Wiliams progresse de la 8e à la 5e place.
- Audy recule de la 7e à la 10e place.
- Cadilac termine la saison sans marquer le moindre point.

**2030** — champion : Lando Noris
- Lando Noris (Mercédes) remporte le titre avec 420 points et 7 victoires, 19 points devant Oscar Piastry (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Mercédes signe 10 doublés.
- Aston Martyn progresse de la 8e à la 5e place.
- Cadilac termine la saison sans marquer le moindre point.

**2031** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 479 points et 12 victoires, 125 points devant Oscar Piastry (Mercédes).
- Une domination sans partage.
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Victoire surprise de Oscar Piastry (Mercédes) à Madrit, sous la pluie.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 428 points et 9 victoires, 89 points devant Oscar Piastry (McLarren).
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Mercédes) à Hungarorring.
- Victoire surprise de Louis Lambert (Alpyne) à Madrit.
- Victoire surprise de Louis Lambert (Alpyne) à Austen.

**2033** — champion : Max Verstapen
- Max Verstapen (Ferrary) remporte le titre avec 467 points et 12 victoires, 119 points devant Oscar Piastry (McLarren).
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Oliver Bearmann (Racing Buls) à Silverston, sous la pluie.
- Ferrary progresse de la 4e à la 1re place.
- Audy progresse de la 10e à la 7e place.
- Aston Martyn recule de la 8e à la 11e place.

**2034** — champion : Max Verstapen
- Max Verstapen (Ferrary) remporte le titre avec 475 points et 14 victoires, 158 points devant Kimi Antoneli (Mercédes).
- Une domination sans partage.
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Mercédes) à Albert Parc.
- Victoire surprise de Kimi Antoneli (Mercédes) à Shangai.
- Victoire surprise de Louis Lambert (Audy) à Sakir.
- Victoire surprise de Oscar Piastry (Red Bul) à Gilles-Villeneuves.
- Victoire surprise de Oscar Piastry (Red Bul) à Monzza.
- Haass recule de la 8e à la 11e place.

**2035** — champion : Max Verstapen
- Max Verstapen (Mercédes) remporte le titre avec 428 points et 12 victoires, 34 points devant Kimi Antoneli (Ferrary).
- Ferrary décroche le titre des constructeurs (19e titre de son histoire).
- Alpyne recule de la 7e à la 11e place.

**2036** — champion : Max Verstapen
- Max Verstapen (Mercédes) remporte le titre avec 444 points et 9 victoires, 55 points devant Kimi Antoneli (Ferrary).
- La tête du championnat a changé 5 fois.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Oscar Piastry (Aston Martyn) à Spielbergh.
- Victoire surprise de Oscar Piastry (Aston Martyn) à Monzza.
- Aston Martyn progresse de la 8e à la 4e place.
- Alpyne progresse de la 11e à la 8e place.
- Red Bul recule de la 5e à la 10e place.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

