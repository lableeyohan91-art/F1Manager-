# Rapport d’équilibrage — 20 graines × 10 saisons

Scénario grille-2026, graines 1 à 20, 200 saisons simulées en 290,4 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 5,7 | 4,0 – 8,0 | 3,0 – 8,0 | 95 % | 5,7 |
| Écuries victorieuses par saison | 4,0 | 3,0 – 6,0 | 2,0 – 5,0 | 88 % | 4,0 |
| Part des victoires de l'écurie dominante | 59 % | 38 % – 81 % | 35 % – 80 % | 87 % | 58 % |
| Taux d’abandon par départ | 7 % | 5 % – 10 % | 5 % – 15 % | 93 % | 7 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,53 | 0,86 – 2,24 | 1,50 – 4,00 | 52 % | 1,53 |
| Écart de points entre les deux premiers | 61 | 9 – 135 | — | — | 55 |
| Changements de leader du championnat | 2,7 | 0,0 – 6,0 | — | — | 2,8 |
| Doublés par saison (toutes écuries) | 4,9 | 1,0 – 9,0 | — | — | 4,7 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,89 | 0,77 – 0,97 | — | — | 0,88 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 1,05 | 0,67 – 1,43 | — | — | 1,04 |
| Victoires inattendues par saison | 2,0 | 0,0 – 5,0 | — | — | 2,2 |
| Courses sous la pluie par saison | 2,2 | 1,0 – 4,0 | — | — | 1,7 |

## Par série de 10 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 10 saisons | 4,2 | 3,0 – 6,0 | 3,0 – 7,0 | 100 % | 4,3 |
| Champions constructeurs différents sur 10 saisons | 2,8 | 2,0 – 4,0 | — | — | 2,9 |
| Plus longue série de titres constructeurs consécutifs | 5,3 | 3,0 – 9,0 | — | — | 5,0 |
| Écuries sans aucune victoire sur 10 saisons | 3,5 | 2,0 – 5,0 | — | — | 3,0 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 5,5 | 3,0 – 9,0 | — | — | 6,3 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 2,8 | 2,2 – 3,8 | — | — | 2,7 |
| Transitions de saison sans aucun changement d’étage (D-081) | 12 % | 0 % – 22 % | — | — | 17 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 59 % | — | 40 % – 90 % | — | 54 % |
| Séries de 10 saisons avec 5 titres constructeurs consécutifs ou plus | 55 % | — | 0 % – 25 % | — | 45 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 32 % | — | — | — | 35 % |
| Retournement à la dernière manche (le leader perd le titre) | 8 % | — | — | — | 6 % |
| Champion et vice-champion coéquipiers | 43 % | — | — | — | 41 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 13 % | — | — | — | 14 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 19 % | — | — | — | 20 % |
| Saisons très serrées (≤ 10 points d’écart) | 12 % | — | — | — | 13 % |
| Dominations (≥ 120 points d’écart) | 14 % | — | — | — | 11 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,44 | 0,40 – 0,49 | — | — | 0,44 |
| Coéquipiers : écart moyen dû aux compétences | 0,24 | 0,17 – 0,31 | — | — | 0,24 |
| Coéquipiers : écart moyen dû à la forme | 0,02 | 0,01 – 0,02 | — | — | 0,02 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,34 – 0,39 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 30 % | 17 % – 42 % | — | — | 30 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 69 % | 55 % – 83 % | — | — | 69 % |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,90 | 0,83 – 0,95 | — | — | 0,90 |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,92 – 0,98 | — | — | 0,96 |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 1,00 | — | — | 0,98 |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,28 | 0,73 – 1,82 | — | — | 1,24 |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 32 % | 14 % – 50 % | — | — | 31 % |
| Pilotes : changements de position par concurrent sur la saison | 6,9 | 5,0 – 9,3 | — | — | 6,8 |
| Pilotes : écart moyen entre voisins (points) — haut | 41,7 | 26,6 – 56,4 | — | — | 40,9 |
| Pilotes : écart moyen entre voisins (points) — milieu | 17,6 | 9,6 – 26,7 | — | — | 17,9 |
| Pilotes : écart moyen entre voisins (points) — bas | 3,3 | 1,1 – 6,1 | — | — | 3,2 |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 97 % | 95 % – 100 % | — | — | 97 % |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 76 % | 67 % – 81 % | — | — | 76 % |
| Pilotes : frontières raisonnablement disputées — haut | 40 % | 20 % – 60 % | — | — | 39 % |
| Pilotes : frontières raisonnablement disputées — milieu | 71 % | 57 % – 100 % | — | — | 72 % |
| Pilotes : frontières raisonnablement disputées — bas | 99 % | 100 % – 100 % | — | — | 99 % |
| Pilotes : positions déjà acquises à 3 manches de la fin | 1 % | 0 % – 5 % | — | — | 1 % |
| Pilotes : positions déjà acquises — haut | 6 % | 0 % – 20 % | — | — | 6 % |
| Pilotes : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 43 % | 23 % – 64 % | — | — | 43 % |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 2 % | 0 % – 5 % | — | — | 2 % |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,92 | 0,85 – 0,98 | — | — | 0,92 |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,91 – 0,99 | — | — | 0,96 |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 1,00 | — | — | 0,98 |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,50 | 0,18 – 0,91 | — | — | 0,50 |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 9 % | 0 % – 18 % | — | — | 9 % |
| Constructeurs : changements de position par concurrent sur la saison | 4,0 | 2,4 – 6,0 | — | — | 4,0 |
| Constructeurs : écart moyen entre voisins (points) — haut | 118,5 | 67,5 – 157,3 | — | — | 119,1 |
| Constructeurs : écart moyen entre voisins (points) — milieu | 29,2 | 14,8 – 49,3 | — | — | 27,9 |
| Constructeurs : écart moyen entre voisins (points) — bas | 9,8 | 1,0 – 23,5 | — | — | 10,1 |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 87 % | 80 % – 100 % | — | — | 87 % |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 57 % | 50 % – 70 % | — | — | 58 % |
| Constructeurs : frontières raisonnablement disputées — haut | 23 % | 0 % – 50 % | — | — | 23 % |
| Constructeurs : frontières raisonnablement disputées — milieu | 72 % | 50 % – 100 % | — | — | 75 % |
| Constructeurs : frontières raisonnablement disputées — bas | 96 % | 100 % – 100 % | — | — | 95 % |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 6 % | 0 % – 18 % | — | — | 5 % |
| Constructeurs : positions déjà acquises — haut | 17 % | 0 % – 50 % | — | — | 15 % |
| Constructeurs : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 50 % | 27 % – 73 % | — | — | 48 % |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 7 % | 0 % – 18 % | — | — | 7 % |

## Chronique d’exemple (graine 1)

**2027** — champion : George Russel
- George Russel (Mercédes) remporte le titre avec 345 points et 7 victoires, 3 points devant Kimi Antoneli (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (10e titre de son histoire).
- Mercédes signe 5 doublés.
- Victoire surprise de Lando Noris (McLarren) à Shangai, sous la pluie.
- Victoire surprise de Lando Noris (McLarren) à Suzuca.
- Victoire surprise de Max Verstapen (Red Bul) à Sakir.
- Victoire surprise de Lewis Hammilton (Ferrary) à Madrit, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Las Vegaz.
- Cadilac termine la saison sans marquer le moindre point.

**2028** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 373 points et 7 victoires, 70 points devant Max Verstapen (Red Bul).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Audy progresse de la 10e à la 7e place.
- Wiliams recule de la 5e à la 8e place.
- Aston Martyn recule de la 7e à la 10e place.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 345 points et 7 victoires, 27 points devant Kimi Antoneli (McLarren).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 5 fois.
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Wiliams progresse de la 8e à la 5e place.
- Cadilac termine la saison sans marquer le moindre point.

**2030** — champion : Lando Noris
- Lando Noris (Mercédes) remporte le titre avec 321 points et 5 victoires, 13 points devant Oscar Piastry (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Mercédes signe 6 doublés.
- Victoire surprise de Kimi Antoneli (McLarren) à Sakir.
- Victoire surprise de Kimi Antoneli (McLarren) à Gilles-Villeneuves.
- Victoire surprise de Lando Noris (Mercédes) à Hungarorring.
- Wiliams recule de la 5e à la 8e place.
- Audy termine la saison sans marquer le moindre point.
- Cadilac termine la saison sans marquer le moindre point.

**2031** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 375 points et 9 victoires, 106 points devant Isack Hadjard (Ferrary).
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Victoire surprise de Oscar Piastry (Mercédes) à Marinna Bay, sous la pluie.
- Audy termine la saison sans marquer le moindre point.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Isack Hadjard
- Isack Hadjard (Ferrary) remporte le titre avec 282 points et 4 victoires, 12 points devant Oscar Piastry (McLarren).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 7 fois.
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Mercédes) à Madrit.
- Victoire surprise de Kimi Antoneli (Mercédes) à Marinna Bay.
- Victoire surprise de Louis Lambert (Alpyne) à Lussail.
- Haass progresse de la 10e à la 7e place.
- Cadilac termine la saison sans marquer le moindre point.

**2033** — champion : Max Verstapen
- Max Verstapen (Ferrary) remporte le titre avec 382 points et 9 victoires, 118 points devant Oscar Piastry (McLarren).
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Victoire surprise de Oliver Bearmann (Racing Buls) à Silverston, sous la pluie.
- Cadilac progresse de la 11e à la 7e place.
- Aston Martyn recule de la 5e à la 11e place.

**2034** — champion : Max Verstapen
- Max Verstapen (Ferrary) remporte le titre avec 383 points et 11 victoires, 22 points devant Oscar Piastry (Ferrary).
- Retournement lors de la dernière manche : Max Verstapen arrache le titre à Oscar Piastry.
- Ferrary décroche le titre des constructeurs (19e titre de son histoire).
- Ferrary signe 9 doublés.
- Victoire surprise de Kimi Antoneli (Mercédes) à Shangai.
- Victoire surprise de Kimi Antoneli (Mercédes) à Monzza.
- Audy progresse de la 8e à la 4e place.
- Aston Martyn progresse de la 11e à la 7e place.
- Racing Buls recule de la 6e à la 9e place.
- Cadilac recule de la 7e à la 10e place.

**2035** — champion : Max Verstapen
- Max Verstapen (Mercédes) remporte le titre avec 297 points et 5 victoires, 17 points devant Kimi Antoneli (Ferrary).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 4 fois.
- Ferrary décroche le titre des constructeurs (20e titre de son histoire).
- Victoire surprise de Arvid Linblad (Alpyne) à Shangai.
- Victoire surprise de Oliver Bearmann (Racing Buls) à Sepanng, sous la pluie.

**2036** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 359 points et 9 victoires, 53 points devant Max Verstapen (Mercédes).
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Audy recule de la 3e à la 6e place.
- Red Bul recule de la 6e à la 9e place.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

