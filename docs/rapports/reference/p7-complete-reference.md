# Rapport d’équilibrage — 100 graines × 10 saisons

Scénario grille-2026, graines 1 à 100, 1000 saisons simulées en 1 121,4 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 6,0 | 4,0 – 8,0 | 3,0 – 8,0 | 90 % | 6,0 |
| Écuries victorieuses par saison | 4,1 | 3,0 – 6,0 | 2,0 – 5,0 | 84 % | 4,1 |
| Part des victoires de l'écurie dominante | 59 % | 38 % – 83 % | 35 % – 80 % | 80 % | 60 % |
| Taux d’abandon par départ | 7 % | 4 % – 10 % | 5 % – 15 % | 76 % | 7 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,52 | 0,90 – 2,24 | 1,50 – 4,00 | 48 % | 1,53 |
| Écart de points entre les deux premiers | 65 | 10 – 146 | — | — | 67 |
| Changements de leader du championnat | 3,0 | 0,0 – 7,0 | — | — | 2,9 |
| Doublés par saison (toutes écuries) | 5,6 | 1,0 – 11,0 | — | — | 5,7 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,90 | 0,80 – 0,97 | — | — | 0,90 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 1,02 | 0,67 – 1,40 | — | — | 1,01 |
| Victoires inattendues par saison | 2,4 | 0,0 – 6,0 | — | — | 2,4 |
| Courses sous la pluie par saison | 2,7 | 1,0 – 5,0 | — | — | 2,7 |

## Par série de 10 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 10 saisons | 4,6 | 3,0 – 6,0 | 3,0 – 7,0 | 97 % | 4,6 |
| Champions constructeurs différents sur 10 saisons | 2,7 | 2,0 – 4,0 | — | — | 2,6 |
| Plus longue série de titres constructeurs consécutifs | 5,4 | 3,0 – 8,0 | — | — | 5,4 |
| Écuries sans aucune victoire sur 10 saisons | 2,8 | 2,0 – 4,0 | — | — | 3,0 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 6,0 | 3,0 – 10,0 | — | — | 5,6 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 2,5 | 1,9 – 3,3 | — | — | 2,6 |
| Transitions de saison sans aucun changement d’étage (D-081) | 16 % | 0 % – 33 % | — | — | 15 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 66 % | — | 40 % – 90 % | — | 61 % |
| Séries de 10 saisons avec 5 titres constructeurs consécutifs ou plus | 62 % | — | 0 % – 25 % | — | 57 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 28 % | — | — | — | 25 % |
| Retournement à la dernière manche (le leader perd le titre) | 7 % | — | — | — | 5 % |
| Champion et vice-champion coéquipiers | 40 % | — | — | — | 44 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 11 % | — | — | — | 11 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 16 % | — | — | — | 14 % |
| Saisons très serrées (≤ 10 points d’écart) | 11 % | — | — | — | 10 % |
| Dominations (≥ 120 points d’écart) | 15 % | — | — | — | 18 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,44 | 0,39 – 0,50 | — | — | 0,44 |
| Coéquipiers : écart moyen dû aux compétences | 0,24 | 0,16 – 0,31 | — | — | 0,24 |
| Coéquipiers : écart moyen dû à la forme | 0,01 | 0,01 – 0,01 | — | — | 0,01 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,34 – 0,40 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 29 % | 18 % – 42 % | — | — | 29 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 71 % | 57 % – 84 % | — | — | 70 % |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,92 | 0,86 – 0,96 | — | — | 0,92 |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,93 – 0,99 | — | — | 0,96 |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,97 – 1,00 | — | — | 0,98 |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,17 | 0,73 – 1,64 | — | — | 1,16 |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 30 % | 14 % – 45 % | — | — | 29 % |
| Pilotes : changements de position par concurrent sur la saison | 7,4 | 5,4 – 9,5 | — | — | 7,3 |
| Pilotes : écart moyen entre voisins (points) — haut | 49,4 | 31,2 – 67,8 | — | — | 49,8 |
| Pilotes : écart moyen entre voisins (points) — milieu | 21,8 | 12,6 – 32,0 | — | — | 21,8 |
| Pilotes : écart moyen entre voisins (points) — bas | 3,6 | 1,2 – 6,4 | — | — | 3,7 |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 95 % | 90 % – 100 % | — | — | 94 % |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 72 % | 62 % – 81 % | — | — | 72 % |
| Pilotes : frontières raisonnablement disputées — haut | 32 % | 0 % – 60 % | — | — | 32 % |
| Pilotes : frontières raisonnablement disputées — milieu | 65 % | 43 % – 86 % | — | — | 66 % |
| Pilotes : frontières raisonnablement disputées — bas | 98 % | 89 % – 100 % | — | — | 98 % |
| Pilotes : positions déjà acquises à 3 manches de la fin | 2 % | 0 % – 5 % | — | — | 2 % |
| Pilotes : positions déjà acquises — haut | 8 % | 0 % – 20 % | — | — | 8 % |
| Pilotes : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — | 0 % |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 42 % | 23 % – 64 % | — | — | 42 % |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 2 % | 0 % – 5 % | — | — | 2 % |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,94 | 0,87 – 0,98 | — | — | 0,93 |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,97 | 0,93 – 0,99 | — | — | 0,97 |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 1,00 | — | — | 0,98 |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,45 | 0,18 – 0,73 | — | — | 0,46 |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 8 % | 0 % – 18 % | — | — | 8 % |
| Constructeurs : changements de position par concurrent sur la saison | 4,1 | 2,5 – 6,1 | — | — | 4,1 |
| Constructeurs : écart moyen entre voisins (points) — haut | 144,8 | 90,3 – 189,8 | — | — | 146,4 |
| Constructeurs : écart moyen entre voisins (points) — milieu | 34,1 | 18,3 – 55,0 | — | — | 34,2 |
| Constructeurs : écart moyen entre voisins (points) — bas | 10,9 | 2,0 – 25,0 | — | — | 11,2 |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 83 % | 70 % – 90 % | — | — | 82 % |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 54 % | 40 % – 70 % | — | — | 54 % |
| Constructeurs : frontières raisonnablement disputées — haut | 20 % | 0 % – 50 % | — | — | 20 % |
| Constructeurs : frontières raisonnablement disputées — milieu | 67 % | 50 % – 100 % | — | — | 68 % |
| Constructeurs : frontières raisonnablement disputées — bas | 94 % | 50 % – 100 % | — | — | 94 % |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 8 % | 0 % – 18 % | — | — | 9 % |
| Constructeurs : positions déjà acquises — haut | 23 % | 0 % – 50 % | — | — | 24 % |
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
- Kimi Antoneli (Mercédes) remporte le titre avec 441 points et 8 victoires, 85 points devant Max Verstapen (Red Bul).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Mercédes signe 5 doublés.
- Audy progresse de la 10e à la 6e place.
- Wiliams recule de la 5e à la 8e place.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 412 points et 9 victoires, 42 points devant Kimi Antoneli (McLarren).
- La tête du championnat a changé 5 fois.
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Haass progresse de la 10e à la 7e place.
- Audy recule de la 6e à la 11e place.

**2030** — champion : Lando Noris
- Lando Noris (Mercédes) remporte le titre avec 417 points et 8 victoires, 14 points devant Oscar Piastry (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Mercédes signe 10 doublés.
- Victoire surprise de Kimi Antoneli (McLarren) à Gilles-Villeneuves.
- Audy termine la saison sans marquer le moindre point.

**2031** — champion : Max Verstapen
- Max Verstapen (Ferrary) remporte le titre avec 483 points et 12 victoires, 122 points devant Kimi Antoneli (McLarren).
- Une domination sans partage.
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Taylor Walsh (Red Bul) à Catalunia.
- Victoire surprise de Oscar Piastry (Mercédes) à Madrit, sous la pluie.
- Victoire surprise de Kimi Antoneli (McLarren) à Austen.
- Aston Martyn progresse de la 8e à la 5e place.
- Wiliams recule de la 6e à la 11e place.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Max Verstapen
- Max Verstapen (Ferrary) remporte le titre avec 435 points et 9 victoires, 50 points devant Oscar Piastry (Red Bul).
- La tête du championnat a changé 5 fois.
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Red Bul progresse de la 4e à la 1re place.
- Haass progresse de la 10e à la 7e place.

**2033** — champion : Taylor Walsh
- Taylor Walsh (Red Bul) remporte le titre avec 423 points et 8 victoires, 29 points devant Oscar Piastry (Red Bul).
- Red Bul décroche le titre des constructeurs (8e titre de son histoire).
- Red Bul signe 6 doublés.
- Victoire surprise de Max Verstapen (McLarren) à Silverston, sous la pluie.
- Aston Martyn recule de la 6e à la 9e place.

**2034** — champion : Anna Kessler
- Anna Kessler (Ferrary) remporte le titre avec 382 points et 8 victoires, 43 points devant Kimi Antoneli (Mercédes).
- La tête du championnat a changé 5 fois.
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Victoire surprise de Oscar Piastry (Aston Martyn) à Gilles-Villeneuves.
- Aston Martyn progresse de la 9e à la 4e place.
- Red Bul recule de la 1re à la 5e place.
- Wiliams progresse de la 11e à la 8e place.
- Haass recule de la 6e à la 11e place.

**2035** — champion : Max Verstapen
- Max Verstapen (Mercédes) remporte le titre avec 387 points et 8 victoires, 118 points devant Taylor Walsh (McLarren).
- La tête du championnat a changé 5 fois.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Aston Martyn) à Suzuca.
- Audy progresse de la 9e à la 6e place.
- Red Bul recule de la 5e à la 8e place.

**2036** — champion : Max Verstapen
- Max Verstapen (Mercédes) remporte le titre avec 404 points et 10 victoires, 108 points devant Taylor Walsh (McLarren).
- La tête du championnat a changé 7 fois.
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Victoire surprise de Connor Fletcher (Audy) à Jedda.
- Victoire surprise de Oscar Piastry (Red Bul) à Gilles-Villeneuves.
- Victoire surprise de Kimi Antoneli (Aston Martyn) à Silverston, sous la pluie.
- Victoire surprise de Kimi Antoneli (Aston Martyn) à Spa-Francorchamp.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

