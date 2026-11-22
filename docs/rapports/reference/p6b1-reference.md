# Rapport d’équilibrage — 100 graines × 10 saisons

Scénario grille-2026, graines 1 à 100, 1000 saisons simulées en 304,9 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 5,9 | 4,0 – 8,0 | 3,0 – 8,0 | 93 % |
| Écuries victorieuses par saison | 3,9 | 3,0 – 6,0 | 2,0 – 5,0 | 88 % |
| Part des victoires de l'écurie dominante | 61 % | 38 % – 83 % | 35 % – 80 % | 81 % |
| Taux d’abandon par départ | 7 % | 4 % – 10 % | 5 % – 15 % | 76 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,52 | 0,92 – 2,24 | 1,50 – 4,00 | 48 % |
| Écart de points entre les deux premiers | 72 | 10 – 152 | — | — |
| Changements de leader du championnat | 2,8 | 0,0 – 7,0 | — | — |
| Doublés par saison (toutes écuries) | 6,1 | 2,0 – 12,0 | — | — |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,91 | 0,81 – 0,98 | — | — |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 1,02 | 0,67 – 1,40 | — | — |
| Victoires inattendues par saison | 2,0 | 0,0 – 5,0 | — | — |
| Courses sous la pluie par saison | 2,7 | 1,0 – 5,0 | — | — |

## Par série de 10 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Champions pilotes différents sur 10 saisons | 3,0 | 2,0 – 4,0 | 3,0 – 7,0 | 65 % |
| Champions constructeurs différents sur 10 saisons | 2,2 | 1,0 – 3,0 | — | — |
| Plus longue série de titres constructeurs consécutifs | 6,4 | 3,0 – 10,0 | — | — |
| Écuries sans aucune victoire sur 10 saisons | 3,6 | 2,0 – 6,0 | — | — |
| Remontées (+3 places ou plus d’une saison à l’autre) | 4,5 | 2,0 – 7,0 | — | — |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 2,3 | 1,3 – 2,9 | — | — |
| Transitions de saison sans aucun changement d’étage (D-081) | 19 % | 0 % – 33 % | — | — |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 60 % | — | 40 % – 90 % | — |
| Séries de 10 saisons avec 5 titres constructeurs consécutifs ou plus | 69 % | — | 0 % – 25 % | — |
| Titre encore ouvert avant la dernière manche (définition exacte) | 24 % | — | — | — |
| Retournement à la dernière manche (le leader perd le titre) | 6 % | — | — | — |
| Champion et vice-champion coéquipiers | 47 % | — | — | — |
| Lutte jusqu’à la dernière manche entre coéquipiers | 12 % | — | — | — |
| Lutte jusqu’à la dernière manche entre écuries différentes | 13 % | — | — | — |
| Saisons très serrées (≤ 10 points d’écart) | 11 % | — | — | — |
| Dominations (≥ 120 points d’écart) | 19 % | — | — | — |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,43 | 0,38 – 0,47 | — | — |
| Coéquipiers : écart moyen dû aux compétences | 0,22 | 0,16 – 0,29 | — | — |
| Coéquipiers : écart moyen dû à la forme | 0,01 | 0,01 – 0,01 | — | — |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,34 – 0,40 | — | — |
| Coéquipiers : part de l’écart quadratique due aux compétences | 25 % | 15 % – 36 % | — | — |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 75 % | 63 % – 87 % | — | — |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,91 | 0,86 – 0,96 | — | — |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,93 – 0,98 | — | — |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 1,00 | — | — |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,18 | 0,73 – 1,73 | — | — |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 30 % | 14 % – 45 % | — | — |
| Pilotes : changements de position par concurrent sur la saison | 7,3 | 5,5 – 9,4 | — | — |
| Pilotes : écart moyen entre voisins (points) — haut | 48,7 | 30,8 – 68,0 | — | — |
| Pilotes : écart moyen entre voisins (points) — milieu | 23,5 | 12,9 – 32,7 | — | — |
| Pilotes : écart moyen entre voisins (points) — bas | 3,3 | 1,1 – 6,2 | — | — |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 94 % | 90 % – 100 % | — | — |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 72 % | 62 % – 81 % | — | — |
| Pilotes : frontières raisonnablement disputées — haut | 33 % | 0 % – 60 % | — | — |
| Pilotes : frontières raisonnablement disputées — milieu | 64 % | 43 % – 86 % | — | — |
| Pilotes : frontières raisonnablement disputées — bas | 99 % | 89 % – 100 % | — | — |
| Pilotes : positions déjà acquises à 3 manches de la fin | 2 % | 0 % – 5 % | — | — |
| Pilotes : positions déjà acquises — haut | 9 % | 0 % – 20 % | — | — |
| Pilotes : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 42 % | 23 % – 64 % | — | — |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 3 % | 0 % – 5 % | — | — |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,93 | 0,87 – 0,98 | — | — |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,97 | 0,93 – 0,99 | — | — |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 1,00 | — | — |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,45 | 0,18 – 0,73 | — | — |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 8 % | 0 % – 18 % | — | — |
| Constructeurs : changements de position par concurrent sur la saison | 4,1 | 2,5 – 6,0 | — | — |
| Constructeurs : écart moyen entre voisins (points) — haut | 152,9 | 99,5 – 196,3 | — | — |
| Constructeurs : écart moyen entre voisins (points) — milieu | 30,3 | 14,5 – 49,5 | — | — |
| Constructeurs : écart moyen entre voisins (points) — bas | 10,3 | 2,0 – 23,5 | — | — |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 82 % | 70 % – 90 % | — | — |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 55 % | 40 % – 70 % | — | — |
| Constructeurs : frontières raisonnablement disputées — haut | 18 % | 0 % – 50 % | — | — |
| Constructeurs : frontières raisonnablement disputées — milieu | 72 % | 50 % – 100 % | — | — |
| Constructeurs : frontières raisonnablement disputées — bas | 95 % | 100 % – 100 % | — | — |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 9 % | 0 % – 18 % | — | — |
| Constructeurs : positions déjà acquises — haut | 24 % | 0 % – 50 % | — | — |
| Constructeurs : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 48 % | 27 % – 73 % | — | — |
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
- Kimi Antoneli (Mercédes) remporte le titre avec 391 points et 7 victoires, 8 points devant Max Verstapen (Red Bul).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 7 fois.
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Wiliams progresse de la 10e à la 7e place.
- Cadilac termine la saison sans marquer le moindre point.

**2030** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 395 points et 7 victoires, 2 points devant Max Verstapen (Red Bul).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Kimi Antoneli arrache le titre à Max Verstapen.
- La tête du championnat a changé 5 fois.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Suzuca.
- Victoire surprise de Oscar Piastry (McLarren) à Spielbergh.
- Victoire surprise de Max Verstapen (Red Bul) à Zandvort, sous la pluie.
- Victoire surprise de Isack Hadjard (Red Bul) à Marinna Bay, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Austen.
- Victoire surprise de Oscar Piastry (McLarren) à Lussail.
- Wiliams recule de la 7e à la 10e place.

**2031** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 367 points et 5 victoires, 26 points devant Charles Leclerq (Ferrary).
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Lando Noris (McLarren) à Suzuca.
- Victoire surprise de Kimi Antoneli (Mercédes) à Gilles-Villeneuves.
- Victoire surprise de Kimi Antoneli (Mercédes) à Spielbergh.
- Victoire surprise de Max Verstapen (Red Bul) à Zandvort.
- Victoire surprise de Oscar Piastry (McLarren) à Madrit, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Marinna Bay, sous la pluie.
- Victoire surprise de Kimi Antoneli (Mercédes) à Austen.
- Victoire surprise de Kimi Antoneli (Mercédes) à Las Vegaz.
- Mercédes recule de la 1re à la 4e place.
- Audy progresse de la 9e à la 6e place.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 417 points et 7 victoires, 88 points devant Gabriel Bortoletto (Ferrary).
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Victoire surprise de Oscar Piastry (McLarren) à Jedda.
- Victoire surprise de Kimi Antoneli (Mercédes) à Hungarorring.

**2033** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 411 points et 8 victoires, 92 points devant Kimi Antoneli (Mercédes).
- La tête du championnat a changé 7 fois.
- Red Bul décroche le titre des constructeurs (8e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Mercédes) à Albert Parc, sous la pluie.

**2034** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 382 points et 9 victoires, 50 points devant Max Verstapen (Red Bul).
- Red Bul décroche le titre des constructeurs (9e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Jedda.
- Victoire surprise de Samuel Marlow (Racing Buls) à Silverston.
- Victoire surprise de Oscar Piastry (McLarren) à Monzza.
- Victoire surprise de Oscar Piastry (McLarren) à Austen.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Haass recule de la 6e à la 9e place.

**2035** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 437 points et 9 victoires, 128 points devant Max Verstapen (Red Bul).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Arvid Linblad (Racing Buls) à Shangai.
- Victoire surprise de Oscar Piastry (McLarren) à Monacco.
- Victoire surprise de Oliver Bearmann (Haass) à Madrit, sous la pluie.
- Ferrary recule de la 2e à la 5e place.
- Alpyne recule de la 7e à la 11e place.

**2036** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 470 points et 12 victoires, 106 points devant Oscar Piastry (McLarren).
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Madrit.
- Wiliams progresse de la 8e à la 3e place.
- Alpyne progresse de la 11e à la 6e place.
- Audy recule de la 4e à la 9e place.
- Haass recule de la 7e à la 10e place.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

