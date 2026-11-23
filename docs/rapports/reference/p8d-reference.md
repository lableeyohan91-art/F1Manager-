# Rapport d’équilibrage — 100 graines × 10 saisons

Scénario grille-2026, graines 1 à 100, 1000 saisons simulées en 1 392,1 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 6,0 | 4,0 – 8,0 | 3,0 – 8,0 | 90 % | 5,9 |
| Écuries victorieuses par saison | 4,1 | 3,0 – 6,0 | 2,0 – 5,0 | 85 % | 4,0 |
| Part des victoires de l'écurie dominante | 60 % | 38 % – 83 % | 35 % – 80 % | 79 % | 60 % |
| Taux d’abandon par départ | 7 % | 5 % – 10 % | 5 % – 15 % | 88 % | 7 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,57 | 0,92 – 2,24 | 1,50 – 4,00 | 53 % | 1,56 |
| Écart de points entre les deux premiers | 68 | 11 – 150 | — | — | 68 |
| Changements de leader du championnat | 2,9 | 0,0 – 7,0 | — | — | 2,9 |
| Doublés par saison (toutes écuries) | 5,7 | 1,0 – 11,0 | — | — | 5,7 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,88 | 0,76 – 0,97 | — | — | 0,89 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 1,03 | 0,69 – 1,45 | — | — | 1,03 |
| Victoires inattendues par saison | 2,6 | 0,0 – 6,0 | — | — | 2,5 |
| Courses sous la pluie par saison | 2,7 | 1,0 – 5,0 | — | — | 2,7 |

## Par série de 10 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 10 saisons | 4,5 | 3,0 – 6,0 | 3,0 – 7,0 | 98 % | 4,6 |
| Champions constructeurs différents sur 10 saisons | 2,7 | 2,0 – 4,0 | — | — | 2,7 |
| Plus longue série de titres constructeurs consécutifs | 5,3 | 3,0 – 8,0 | — | — | 5,3 |
| Écuries sans aucune victoire sur 10 saisons | 3,0 | 1,0 – 5,0 | — | — | 2,9 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 6,0 | 3,0 – 10,0 | — | — | 6,1 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 2,7 | 2,0 – 3,6 | — | — | 2,7 |
| Transitions de saison sans aucun changement d’étage (D-081) | 13 % | 0 % – 33 % | — | — | 13 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 64 % | — | 40 % – 90 % | — | 62 % |
| Séries de 10 saisons avec 5 titres constructeurs consécutifs ou plus | 60 % | — | 0 % – 25 % | — | 55 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 26 % | — | — | — | 27 % |
| Retournement à la dernière manche (le leader perd le titre) | 5 % | — | — | — | 5 % |
| Champion et vice-champion coéquipiers | 42 % | — | — | — | 43 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 12 % | — | — | — | 11 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 15 % | — | — | — | 15 % |
| Saisons très serrées (≤ 10 points d’écart) | 10 % | — | — | — | 10 % |
| Dominations (≥ 120 points d’écart) | 17 % | — | — | — | 17 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,44 | 0,40 – 0,50 | — | — | 0,45 |
| Coéquipiers : écart moyen dû aux compétences | 0,24 | 0,17 – 0,32 | — | — | 0,24 |
| Coéquipiers : écart moyen dû à la forme | 0,01 | 0,01 – 0,01 | — | — | 0,01 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,33 – 0,40 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 30 % | 19 % – 43 % | — | — | 30 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 69 % | 55 % – 82 % | — | — | 69 % |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,91 | 0,86 – 0,96 | — | — | 0,92 |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,93 – 0,99 | — | — | 0,96 |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 1,00 | — | — | 0,98 |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,18 | 0,73 – 1,64 | — | — | 1,17 |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 30 % | 14 % – 45 % | — | — | 29 % |
| Pilotes : changements de position par concurrent sur la saison | 7,4 | 5,4 – 9,5 | — | — | 7,4 |
| Pilotes : écart moyen entre voisins (points) — haut | 49,6 | 33,0 – 67,0 | — | — | 49,7 |
| Pilotes : écart moyen entre voisins (points) — milieu | 21,7 | 12,3 – 32,0 | — | — | 21,7 |
| Pilotes : écart moyen entre voisins (points) — bas | 3,7 | 1,2 – 6,7 | — | — | 3,7 |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 95 % | 90 % – 100 % | — | — | 94 % |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 72 % | 67 % – 81 % | — | — | 72 % |
| Pilotes : frontières raisonnablement disputées — haut | 33 % | 20 % – 60 % | — | — | 32 % |
| Pilotes : frontières raisonnablement disputées — milieu | 65 % | 43 % – 86 % | — | — | 66 % |
| Pilotes : frontières raisonnablement disputées — bas | 99 % | 89 % – 100 % | — | — | 99 % |
| Pilotes : positions déjà acquises à 3 manches de la fin | 2 % | 0 % – 5 % | — | — | 2 % |
| Pilotes : positions déjà acquises — haut | 8 % | 0 % – 20 % | — | — | 8 % |
| Pilotes : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — | 0 % |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 42 % | 23 % – 64 % | — | — | 42 % |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 2 % | 0 % – 9 % | — | — | 2 % |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,93 | 0,86 – 0,98 | — | — | 0,93 |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,93 – 0,99 | — | — | 0,97 |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,95 – 1,00 | — | — | 0,98 |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,48 | 0,18 – 0,91 | — | — | 0,46 |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 8 % | 0 % – 18 % | — | — | 8 % |
| Constructeurs : changements de position par concurrent sur la saison | 4,3 | 2,5 – 6,4 | — | — | 4,1 |
| Constructeurs : écart moyen entre voisins (points) — haut | 144,2 | 87,5 – 190,8 | — | — | 145,0 |
| Constructeurs : écart moyen entre voisins (points) — milieu | 34,2 | 17,3 – 54,8 | — | — | 34,1 |
| Constructeurs : écart moyen entre voisins (points) — bas | 11,4 | 2,0 – 26,0 | — | — | 11,1 |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 83 % | 70 % – 90 % | — | — | 83 % |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 54 % | 40 % – 70 % | — | — | 54 % |
| Constructeurs : frontières raisonnablement disputées — haut | 20 % | 0 % – 50 % | — | — | 21 % |
| Constructeurs : frontières raisonnablement disputées — milieu | 68 % | 50 % – 100 % | — | — | 67 % |
| Constructeurs : frontières raisonnablement disputées — bas | 94 % | 50 % – 100 % | — | — | 95 % |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 8 % | 0 % – 18 % | — | — | 8 % |
| Constructeurs : positions déjà acquises — haut | 23 % | 0 % – 50 % | — | — | 23 % |
| Constructeurs : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — | 0 % |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 48 % | 27 % – 73 % | — | — | 49 % |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 10 % | 0 % – 18 % | — | — | 10 % |

## Chronique d’exemple (graine 1)

**2027** — champion : George Russel
- George Russel (Mercédes) remporte le titre avec 417 points et 8 victoires, 12 points devant Kimi Antoneli (Mercédes).
- Le titre restait ouvert avant la dernière manche.
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
- Kimi Antoneli (Mercédes) remporte le titre avec 427 points et 6 victoires, 71 points devant Max Verstapen (Red Bul).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Mercédes signe 5 doublés.
- Audy progresse de la 10e à la 7e place.
- Wiliams recule de la 5e à la 8e place.

**2029** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 408 points et 8 victoires, 31 points devant Kimi Antoneli (McLarren).
- La tête du championnat a changé 9 fois.
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Wiliams progresse de la 8e à la 5e place.
- Cadilac termine la saison sans marquer le moindre point.

**2030** — champion : Lando Noris
- Lando Noris (Mercédes) remporte le titre avec 406 points et 7 victoires, 27 points devant Oscar Piastry (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Mercédes signe 7 doublés.
- Victoire surprise de Kimi Antoneli (McLarren) à Shangai, sous la pluie.
- Victoire surprise de Kimi Antoneli (McLarren) à Gilles-Villeneuves.
- Victoire surprise de Kimi Antoneli (McLarren) à Hermanos Rodrigues.
- Wiliams recule de la 5e à la 8e place.
- Audy termine la saison sans marquer le moindre point.

**2031** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 456 points et 11 victoires, 104 points devant Isack Hadjard (Ferrary).
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Victoire surprise de Oscar Piastry (Mercédes) à Madrit, sous la pluie.
- Victoire surprise de Oscar Piastry (Mercédes) à Bakou.
- Audy termine la saison sans marquer le moindre point.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Isack Hadjard
- Isack Hadjard (Ferrary) remporte le titre avec 350 points et 4 victoires, 35 points devant Kimi Antoneli (Mercédes).
- La tête du championnat a changé 7 fois.
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Max Verstapen (Aston Martyn) à Spielbergh.
- Victoire surprise de Kimi Antoneli (Mercédes) à Hungarorring.
- Victoire surprise de Oscar Piastry (Wiliams) à Bakou.
- Victoire surprise de Max Verstapen (Aston Martyn) à Marinna Bay.
- Victoire surprise de Louis Lambert (Alpyne) à Austen.

**2033** — champion : Max Verstapen
- Max Verstapen (Ferrary) remporte le titre avec 466 points et 13 victoires, 155 points devant Isack Hadjard (Ferrary).
- Une domination sans partage.
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Ferrary signe 5 doublés.
- Victoire surprise de Louis Lambert (Alpyne) à Suzuca.
- Victoire surprise de Oliver Bearmann (Cadilac) à Silverston, sous la pluie.
- Victoire surprise de Samuel Carlisle (Racing Buls) à Las Vegaz.
- Aston Martyn recule de la 4e à la 10e place.

**2034** — champion : Max Verstapen
- Max Verstapen (Ferrary) remporte le titre avec 450 points et 12 victoires, 114 points devant Oscar Piastry (McLarren).
- La tête du championnat a changé 6 fois.
- Ferrary décroche le titre des constructeurs (19e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Mercédes) à Shangai.
- Victoire surprise de Anna Lehmann (Alpyne) à Suzuca, sous la pluie.
- Victoire surprise de Oscar Piastry (McLarren) à Monzza.
- Aston Martyn progresse de la 10e à la 6e place.
- Red Bul recule de la 5e à la 8e place.
- Haass recule de la 7e à la 11e place.
- Red Bul, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2035** — champion : Max Verstapen
- Max Verstapen (Mercédes) remporte le titre avec 392 points et 10 victoires, 24 points devant Kimi Antoneli (Ferrary).
- La tête du championnat a changé 13 fois.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Oscar Piastry (McLarren) à Monacco.

**2036** — champion : Max Verstapen
- Max Verstapen (Mercédes) remporte le titre avec 412 points et 9 victoires, 81 points devant Kimi Antoneli (Ferrary).
- La tête du championnat a changé 7 fois.
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Ferrary) à Suzuca.
- Victoire surprise de Oscar Piastry (Ferrary) à Spielbergh.

