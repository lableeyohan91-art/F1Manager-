# Rapport d’équilibrage — 50 graines × 20 saisons

Scénario grille-2026, graines 1 à 50, 1000 saisons simulées en 1 293,9 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 7,4 | 5,0 – 11,0 | 3,0 – 8,0 | 67 % | 7,3 |
| Écuries victorieuses par saison | 5,3 | 3,0 – 8,0 | 2,0 – 5,0 | 56 % | 5,2 |
| Part des victoires de l'écurie dominante | 51 % | 29 % – 79 % | 35 % – 80 % | 70 % | 51 % |
| Taux d’abandon par départ | 5 % | 3 % – 9 % | 5 % – 15 % | 47 % | 6 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,13 | 0,56 – 2,02 | 1,50 – 4,00 | 25 % | 1,12 |
| Écart de points entre les deux premiers | 67 | 10 – 146 | — | — | 81 |
| Changements de leader du championnat | 3,1 | 0,0 – 7,0 | — | — | 3,0 |
| Doublés par saison (toutes écuries) | 4,2 | 1,0 – 9,0 | — | — | 4,1 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,82 | 0,62 – 0,96 | — | — | 0,81 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 0,80 | 0,45 – 1,28 | — | — | 0,80 |
| Victoires inattendues par saison | 1,9 | 0,0 – 5,0 | — | — | 1,8 |
| Courses sous la pluie par saison | 2,8 | 1,0 – 5,0 | — | — | 2,8 |

## Par série de 20 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 20 saisons | 7,5 | 6,0 – 9,0 | 3,0 – 7,0 | 48 % | 5,6 |
| Champions constructeurs différents sur 20 saisons | 4,7 | 3,0 – 7,0 | — | — | 4,1 |
| Plus longue série de titres constructeurs consécutifs | 6,4 | 4,0 – 11,0 | — | — | 7,4 |
| Écuries sans aucune victoire sur 20 saisons | 0,2 | 0,0 – 1,0 | — | — | 0,4 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 20,0 | 13,0 – 27,0 | — | — | 16,4 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 3,4 | 2,6 – 4,1 | — | — | 3,0 |
| Transitions de saison sans aucun changement d’étage (D-081) | 9 % | 0 % – 16 % | — | — | 13 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 74 % | — | 40 % – 90 % | — | 73 % |
| Séries de 20 saisons avec 5 titres constructeurs consécutifs ou plus | 74 % | — | 0 % – 25 % | — | 84 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 25 % | — | — | — | 23 % |
| Retournement à la dernière manche (le leader perd le titre) | 6 % | — | — | — | 6 % |
| Champion et vice-champion coéquipiers | 33 % | — | — | — | 28 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 8 % | — | — | — | 7 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 17 % | — | — | — | 16 % |
| Saisons très serrées (≤ 10 points d’écart) | 10 % | — | — | — | 11 % |
| Dominations (≥ 120 points d’écart) | 18 % | — | — | — | 25 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,44 | 0,39 – 0,49 | — | — | 0,45 |
| Coéquipiers : écart moyen dû aux compétences | 0,23 | 0,16 – 0,30 | — | — | 0,25 |
| Coéquipiers : écart moyen dû à la forme | 0,01 | 0,01 – 0,01 | — | — | 0,01 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,33 – 0,40 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 28 % | 17 % – 41 % | — | — | 31 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 72 % | 59 % – 85 % | — | — | 69 % |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,89 | 0,81 – 0,95 | — | — | 0,89 |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,95 | 0,91 – 0,98 | — | — | 0,95 |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 0,99 | — | — | 0,98 |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,35 | 0,82 – 1,91 | — | — | 1,33 |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 35 % | 18 % – 55 % | — | — | 34 % |
| Pilotes : changements de position par concurrent sur la saison | 8,7 | 6,0 – 11,0 | — | — | 8,5 |
| Pilotes : écart moyen entre voisins (points) — haut | 44,7 | 26,0 – 64,0 | — | — | 45,6 |
| Pilotes : écart moyen entre voisins (points) — milieu | 18,1 | 10,3 – 28,3 | — | — | 19,0 |
| Pilotes : écart moyen entre voisins (points) — bas | 5,3 | 1,7 – 8,4 | — | — | 5,2 |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 96 % | 90 % – 100 % | — | — | 95 % |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 74 % | 67 % – 81 % | — | — | 74 % |
| Pilotes : frontières raisonnablement disputées — haut | 36 % | 20 % – 60 % | — | — | 38 % |
| Pilotes : frontières raisonnablement disputées — milieu | 71 % | 57 % – 86 % | — | — | 70 % |
| Pilotes : frontières raisonnablement disputées — bas | 97 % | 89 % – 100 % | — | — | 97 % |
| Pilotes : positions déjà acquises à 3 manches de la fin | 2 % | 0 % – 5 % | — | — | 2 % |
| Pilotes : positions déjà acquises — haut | 8 % | 0 % – 20 % | — | — | 10 % |
| Pilotes : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — | 0 % |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 38 % | 18 % – 55 % | — | — | 39 % |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 2 % | 0 % – 5 % | — | — | 3 % |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,91 | 0,82 – 0,97 | — | — | 0,91 |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,95 | 0,91 – 0,99 | — | — | 0,96 |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,95 – 1,00 | — | — | 0,98 |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,58 | 0,18 – 0,91 | — | — | 0,55 |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 11 % | 0 % – 27 % | — | — | 10 % |
| Constructeurs : changements de position par concurrent sur la saison | 5,2 | 2,9 – 7,6 | — | — | 5,1 |
| Constructeurs : écart moyen entre voisins (points) — haut | 116,3 | 55,3 – 181,8 | — | — | 117,7 |
| Constructeurs : écart moyen entre voisins (points) — milieu | 35,5 | 18,5 – 54,8 | — | — | 34,1 |
| Constructeurs : écart moyen entre voisins (points) — bas | 19,0 | 3,5 – 41,5 | — | — | 19,1 |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 87 % | 80 % – 100 % | — | — | 87 % |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 54 % | 40 % – 70 % | — | — | 54 % |
| Constructeurs : frontières raisonnablement disputées — haut | 28 % | 0 % – 50 % | — | — | 26 % |
| Constructeurs : frontières raisonnablement disputées — milieu | 65 % | 50 % – 100 % | — | — | 67 % |
| Constructeurs : frontières raisonnablement disputées — bas | 84 % | 50 % – 100 % | — | — | 84 % |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 7 % | 0 % – 18 % | — | — | 6 % |
| Constructeurs : positions déjà acquises — haut | 18 % | 0 % – 50 % | — | — | 17 % |
| Constructeurs : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — | 0 % |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 47 % | 18 % – 73 % | — | — | 49 % |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 8 % | 0 % – 18 % | — | — | 8 % |

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

**2037** — champion : Taylor Walsh
- Taylor Walsh (Mercédes) remporte le titre avec 336 points et 5 victoires, 13 points devant Fleur Postma (Mercédes).
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Victoire surprise de Louis Lambert (Wiliams) à Spa-Francorchamp, sous la pluie.
- Alpyne recule de la 1re à la 4e place.
- Wiliams progresse de la 8e à la 5e place.

**2038** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 431 points et 12 victoires, 103 points devant Taylor Walsh (Mercédes).
- Mercédes décroche le titre des constructeurs (16e titre de son histoire).
- Victoire surprise de Anna Kessler (Audy) à Marinna Bay.
- Wiliams recule de la 5e à la 8e place.

**2039** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 352 points et 7 victoires, 34 points devant Kimi Antoneli (Mercédes).
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Alpyne recule de la 3e à la 6e place.

**2040** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 449 points et 11 victoires, 143 points devant Oscar Piastry (Mercédes).
- Une domination sans partage.
- McLarren décroche le titre des constructeurs (13e titre de son histoire).
- Aston Martyn recule de la 4e à la 7e place.
- Racing Buls termine la saison sans marquer le moindre point.

**2041** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 432 points et 12 victoires, 79 points devant Kimi Antoneli (McLarren).
- McLarren décroche le titre des constructeurs (14e titre de son histoire).
- Aston Martyn progresse de la 7e à la 4e place.
- Haass progresse de la 10e à la 7e place.
- Alpyne recule de la 4e à la 9e place.
- Red Bul, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2042** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 348 points et 6 victoires, 83 points devant Marco Sartori (McLarren).
- McLarren décroche le titre des constructeurs (15e titre de son histoire).
- Audy progresse de la 5e à la 2e place.
- Alpyne progresse de la 9e à la 4e place.

**2043** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 316 points et 5 victoires, 19 points devant Connor Fletcher (McLarren).
- Le titre restait ouvert avant la dernière manche.
- McLarren décroche le titre des constructeurs (16e titre de son histoire).
- Victoire surprise de Anna Kessler (Audy) à Bakou.
- Wiliams progresse de la 7e à la 2e place.
- Red Bul progresse de la 8e à la 4e place.
- Audy recule de la 2e à la 6e place.

**2044** — champion : Giovanni Lombardi
- Giovanni Lombardi (Red Bul) remporte le titre avec 418 points et 7 victoires, 112 points devant Connor Fletcher (McLarren).
- Red Bul décroche le titre des constructeurs (9e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Ferrary) à Suzuca.
- Red Bul progresse de la 4e à la 1re place.

**2045** — champion : Giovanni Lombardi
- Giovanni Lombardi (McLarren) remporte le titre avec 392 points et 8 victoires, 102 points devant Connor Fletcher (Red Bul).
- La tête du championnat a changé 7 fois.
- McLarren décroche le titre des constructeurs (17e titre de son histoire).
- Red Bul recule de la 1re à la 4e place.
- Ferrary recule de la 7e à la 10e place.

**2046** — champion : Giovanni Lombardi
- Giovanni Lombardi (McLarren) remporte le titre avec 476 points et 14 victoires, 260 points devant Connor Fletcher (Red Bul).
- Une domination sans partage.
- McLarren décroche le titre des constructeurs (18e titre de son histoire).
- Mercédes recule de la 2e à la 5e place.

