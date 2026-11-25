# Rapport d’équilibrage — 20 graines × 10 saisons

Scénario grille-2026, graines 1 à 20, 200 saisons simulées en 313,7 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 5,8 | 4,0 – 8,0 | 3,0 – 8,0 | 91 % | 5,7 |
| Écuries victorieuses par saison | 4,0 | 3,0 – 6,0 | 2,0 – 5,0 | 86 % | 4,0 |
| Part des victoires de l'écurie dominante | 58 % | 35 % – 80 % | 35 % – 80 % | 87 % | 59 % |
| Taux d’abandon par départ | 7 % | 5 % – 10 % | 5 % – 15 % | 90 % | 7 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,54 | 0,88 – 2,24 | 1,50 – 4,00 | 52 % | 1,53 |
| Écart de points entre les deux premiers | 59 | 7 – 123 | — | — | 61 |
| Changements de leader du championnat | 2,8 | 0,0 – 6,0 | — | — | 2,7 |
| Doublés par saison (toutes écuries) | 4,5 | 1,0 – 9,0 | — | — | 4,9 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,87 | 0,75 – 0,97 | — | — | 0,89 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 1,05 | 0,69 – 1,43 | — | — | 1,05 |
| Victoires inattendues par saison | 2,2 | 0,0 – 5,0 | — | — | 2,0 |
| Courses sous la pluie par saison | 2,2 | 1,0 – 4,0 | — | — | 2,2 |

## Par série de 10 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 10 saisons | 4,5 | 3,0 – 6,0 | 3,0 – 7,0 | 100 % | 4,2 |
| Champions constructeurs différents sur 10 saisons | 2,5 | 2,0 – 3,0 | — | — | 2,8 |
| Plus longue série de titres constructeurs consécutifs | 5,2 | 3,0 – 10,0 | — | — | 5,3 |
| Écuries sans aucune victoire sur 10 saisons | 3,0 | 1,0 – 5,0 | — | — | 3,5 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 6,6 | 2,0 – 12,0 | — | — | 5,5 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 2,8 | 2,0 – 3,8 | — | — | 2,8 |
| Transitions de saison sans aucun changement d’étage (D-081) | 11 % | 0 % – 22 % | — | — | 12 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 56 % | — | 40 % – 90 % | — | 59 % |
| Séries de 10 saisons avec 5 titres constructeurs consécutifs ou plus | 55 % | — | 0 % – 25 % | — | 55 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 32 % | — | — | — | 32 % |
| Retournement à la dernière manche (le leader perd le titre) | 7 % | — | — | — | 8 % |
| Champion et vice-champion coéquipiers | 42 % | — | — | — | 43 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 13 % | — | — | — | 13 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 19 % | — | — | — | 19 % |
| Saisons très serrées (≤ 10 points d’écart) | 13 % | — | — | — | 12 % |
| Dominations (≥ 120 points d’écart) | 12 % | — | — | — | 14 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,44 | 0,39 – 0,49 | — | — | 0,44 |
| Coéquipiers : écart moyen dû aux compétences | 0,24 | 0,17 – 0,32 | — | — | 0,24 |
| Coéquipiers : écart moyen dû à la forme | 0,02 | 0,01 – 0,02 | — | — | 0,02 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,33 – 0,39 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 30 % | 19 % – 42 % | — | — | 30 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 70 % | 56 % – 83 % | — | — | 69 % |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,90 | 0,84 – 0,96 | — | — | 0,90 |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,93 – 0,98 | — | — | 0,96 |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 0,99 | — | — | 0,98 |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,23 | 0,82 – 1,82 | — | — | 1,28 |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 31 % | 18 % – 45 % | — | — | 32 % |
| Pilotes : changements de position par concurrent sur la saison | 6,9 | 5,0 – 9,0 | — | — | 6,9 |
| Pilotes : écart moyen entre voisins (points) — haut | 41,9 | 25,6 – 56,4 | — | — | 41,7 |
| Pilotes : écart moyen entre voisins (points) — milieu | 17,2 | 10,1 – 26,9 | — | — | 17,6 |
| Pilotes : écart moyen entre voisins (points) — bas | 3,4 | 1,1 – 5,7 | — | — | 3,3 |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 97 % | 95 % – 100 % | — | — | 97 % |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 76 % | 71 % – 81 % | — | — | 76 % |
| Pilotes : frontières raisonnablement disputées — haut | 39 % | 20 % – 60 % | — | — | 40 % |
| Pilotes : frontières raisonnablement disputées — milieu | 74 % | 57 % – 86 % | — | — | 71 % |
| Pilotes : frontières raisonnablement disputées — bas | 99 % | 89 % – 100 % | — | — | 99 % |
| Pilotes : positions déjà acquises à 3 manches de la fin | 1 % | 0 % – 5 % | — | — | 1 % |
| Pilotes : positions déjà acquises — haut | 6 % | 0 % – 20 % | — | — | 6 % |
| Pilotes : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 43 % | 27 % – 64 % | — | — | 43 % |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 2 % | 0 % – 5 % | — | — | 2 % |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,93 | 0,85 – 0,98 | — | — | 0,92 |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,93 – 0,99 | — | — | 0,96 |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 1,00 | — | — | 0,98 |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,48 | 0,18 – 0,91 | — | — | 0,50 |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 9 % | 0 % – 18 % | — | — | 9 % |
| Constructeurs : changements de position par concurrent sur la saison | 4,0 | 2,3 – 5,7 | — | — | 4,0 |
| Constructeurs : écart moyen entre voisins (points) — haut | 117,8 | 69,5 – 156,8 | — | — | 118,5 |
| Constructeurs : écart moyen entre voisins (points) — milieu | 28,4 | 16,0 – 42,3 | — | — | 29,2 |
| Constructeurs : écart moyen entre voisins (points) — bas | 11,0 | 1,5 – 24,5 | — | — | 9,8 |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 87 % | 80 % – 100 % | — | — | 87 % |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 58 % | 50 % – 70 % | — | — | 57 % |
| Constructeurs : frontières raisonnablement disputées — haut | 25 % | 0 % – 50 % | — | — | 23 % |
| Constructeurs : frontières raisonnablement disputées — milieu | 73 % | 50 % – 100 % | — | — | 72 % |
| Constructeurs : frontières raisonnablement disputées — bas | 96 % | 100 % – 100 % | — | — | 96 % |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 6 % | 0 % – 9 % | — | — | 6 % |
| Constructeurs : positions déjà acquises — haut | 16 % | 0 % – 25 % | — | — | 17 % |
| Constructeurs : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 51 % | 27 % – 73 % | — | — | 50 % |
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
- Kimi Antoneli (Mercédes) remporte le titre avec 379 points et 7 victoires, 72 points devant Max Verstapen (Red Bul).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Audy progresse de la 10e à la 6e place.
- Aston Martyn recule de la 7e à la 10e place.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 349 points et 7 victoires, 27 points devant Kimi Antoneli (McLarren).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 5 fois.
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).

**2030** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 336 points et 7 victoires, 14 points devant Lando Noris (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Mercédes signe 8 doublés.
- Victoire surprise de Kimi Antoneli (McLarren) à Sakir.
- Victoire surprise de Kimi Antoneli (McLarren) à Gilles-Villeneuves.
- Victoire surprise de Lando Noris (Mercédes) à Hungarorring.
- Victoire surprise de Oscar Piastry (Mercédes) à Marinna Bay.
- Victoire surprise de Kimi Antoneli (McLarren) à Interlagoss, sous la pluie.
- Haass progresse de la 10e à la 7e place.
- Audy recule de la 8e à la 11e place.
- Audy termine la saison sans marquer le moindre point.

**2031** — champion : Max Verstapen
- Max Verstapen (Ferrary) remporte le titre avec 363 points et 7 victoires, 11 points devant Kimi Antoneli (McLarren).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 8 fois.
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Oscar Piastry (Mercédes) à Marinna Bay, sous la pluie.
- Haass recule de la 7e à la 10e place.
- Cadilac termine la saison sans marquer le moindre point.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Kimi Antoneli
- Kimi Antoneli (Red Bul) remporte le titre avec 348 points et 8 victoires, 69 points devant Oscar Piastry (McLarren).
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Victoire surprise de Louis Lambert (Alpyne) à Lussail.
- Red Bul progresse de la 4e à la 1re place.
- Haass progresse de la 10e à la 7e place.
- Cadilac termine la saison sans marquer le moindre point.

**2033** — champion : Kimi Antoneli
- Kimi Antoneli (Red Bul) remporte le titre avec 388 points et 11 victoires, 103 points devant Oscar Piastry (McLarren).
- Red Bul décroche le titre des constructeurs (8e titre de son histoire).
- Victoire surprise de Oliver Bearmann (Wiliams) à Silverston, sous la pluie.

**2034** — champion : Samuel Marlow
- Samuel Marlow (Ferrary) remporte le titre avec 344 points et 7 victoires, 37 points devant Anna Kessler (Ferrary).
- La tête du championnat a changé 4 fois.
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Red Bul) à Shangai.
- Victoire surprise de Anna Lehmann (Mercédes) à Suzuca, sous la pluie.
- Victoire surprise de Arvid Linblad (Wiliams) à Gilles-Villeneuves.
- Victoire surprise de Oscar Piastry (Alpyne) à Monacco.
- Victoire surprise de Kimi Antoneli (Red Bul) à Monzza.
- Victoire surprise de Oscar Piastry (Alpyne) à Sepanng.
- Victoire surprise de Kimi Antoneli (Red Bul) à Austen.
- Cadilac progresse de la 11e à la 8e place.
- Haass recule de la 7e à la 10e place.

**2035** — champion : Kimi Antoneli
- Kimi Antoneli (Ferrary) remporte le titre avec 318 points et 6 victoires, 28 points devant Louis Lambert (Mercédes).
- Ferrary décroche le titre des constructeurs (19e titre de son histoire).
- Red Bul recule de la 2e à la 5e place.
- Aston Martyn progresse de la 11e à la 8e place.
- Cadilac recule de la 8e à la 11e place.

**2036** — champion : Kimi Antoneli
- Kimi Antoneli (Ferrary) remporte le titre avec 288 points et 5 victoires, 3 points devant Louis Lambert (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Kimi Antoneli arrache le titre à Louis Lambert.
- La tête du championnat a changé 4 fois.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Ferrary) à Jedda.
- Victoire surprise de Oscar Piastry (Cadilac) à Gilles-Villeneuves.
- Cadilac progresse de la 11e à la 6e place.
- Audy recule de la 7e à la 10e place.

