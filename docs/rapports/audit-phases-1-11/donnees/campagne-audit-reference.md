# Rapport d’équilibrage — 20 graines × 10 saisons

Scénario grille-2026, graines 1 à 20, 200 saisons simulées en 298,8 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 5,7 | 4,0 – 8,0 | 3,0 – 8,0 | 93 % | 6,2 |
| Écuries victorieuses par saison | 4,0 | 3,0 – 6,0 | 2,0 – 5,0 | 85 % | 4,3 |
| Part des victoires de l'écurie dominante | 58 % | 35 % – 80 % | 35 % – 80 % | 87 % | 57 % |
| Taux d’abandon par départ | 7 % | 5 % – 10 % | 5 % – 15 % | 87 % | 7 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,53 | 0,86 – 2,24 | 1,50 – 4,00 | 53 % | 1,54 |
| Écart de points entre les deux premiers | 55 | 9 – 126 | — | — | 66 |
| Changements de leader du championnat | 2,8 | 0,0 – 6,0 | — | — | 3,0 |
| Doublés par saison (toutes écuries) | 4,7 | 1,0 – 9,0 | — | — | 5,4 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,88 | 0,75 – 0,97 | — | — | 0,88 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 1,04 | 0,68 – 1,41 | — | — | 1,04 |
| Victoires inattendues par saison | 2,2 | 0,0 – 5,0 | — | — | 2,5 |
| Courses sous la pluie par saison | 1,7 | 0,0 – 3,0 | — | — | 2,7 |

## Par série de 10 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 10 saisons | 4,3 | 3,0 – 5,0 | 3,0 – 7,0 | 100 % | 4,2 |
| Champions constructeurs différents sur 10 saisons | 2,9 | 2,0 – 4,0 | — | — | 3,0 |
| Plus longue série de titres constructeurs consécutifs | 5,0 | 3,0 – 9,0 | — | — | 5,0 |
| Écuries sans aucune victoire sur 10 saisons | 3,0 | 1,0 – 5,0 | — | — | 2,7 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 6,3 | 3,0 – 10,0 | — | — | 6,3 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 2,7 | 2,0 – 3,6 | — | — | 2,6 |
| Transitions de saison sans aucun changement d’étage (D-081) | 17 % | 0 % – 33 % | — | — | 14 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 54 % | — | 40 % – 90 % | — | 56 % |
| Séries de 10 saisons avec 5 titres constructeurs consécutifs ou plus | 45 % | — | 0 % – 25 % | — | 45 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 35 % | — | — | — | 27 % |
| Retournement à la dernière manche (le leader perd le titre) | 6 % | — | — | — | 6 % |
| Champion et vice-champion coéquipiers | 41 % | — | — | — | 42 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 14 % | — | — | — | 11 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 20 % | — | — | — | 16 % |
| Saisons très serrées (≤ 10 points d’écart) | 13 % | — | — | — | 12 % |
| Dominations (≥ 120 points d’écart) | 11 % | — | — | — | 14 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,44 | 0,40 – 0,49 | — | — | 0,44 |
| Coéquipiers : écart moyen dû aux compétences | 0,24 | 0,16 – 0,31 | — | — | 0,24 |
| Coéquipiers : écart moyen dû à la forme | 0,02 | 0,01 – 0,02 | — | — | 0,02 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,33 – 0,39 | — | — | 0,37 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 30 % | 17 % – 43 % | — | — | 29 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 69 % | 56 % – 83 % | — | — | 70 % |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,90 | 0,83 – 0,95 | — | — | 0,91 |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,92 – 0,98 | — | — | 0,96 |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 1,00 | — | — | 0,98 |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,24 | 0,73 – 1,82 | — | — | 1,20 |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 31 % | 14 % – 50 % | — | — | 30 % |
| Pilotes : changements de position par concurrent sur la saison | 6,8 | 4,9 – 9,0 | — | — | 7,6 |
| Pilotes : écart moyen entre voisins (points) — haut | 40,9 | 26,0 – 55,2 | — | — | 47,7 |
| Pilotes : écart moyen entre voisins (points) — milieu | 17,9 | 9,6 – 27,7 | — | — | 21,7 |
| Pilotes : écart moyen entre voisins (points) — bas | 3,2 | 1,0 – 5,8 | — | — | 3,8 |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 97 % | 90 % – 100 % | — | — | 95 % |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 76 % | 67 % – 81 % | — | — | 72 % |
| Pilotes : frontières raisonnablement disputées — haut | 39 % | 20 % – 60 % | — | — | 32 % |
| Pilotes : frontières raisonnablement disputées — milieu | 72 % | 57 % – 86 % | — | — | 67 % |
| Pilotes : frontières raisonnablement disputées — bas | 99 % | 100 % – 100 % | — | — | 98 % |
| Pilotes : positions déjà acquises à 3 manches de la fin | 1 % | 0 % – 5 % | — | — | 2 % |
| Pilotes : positions déjà acquises — haut | 6 % | 0 % – 20 % | — | — | 8 % |
| Pilotes : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 43 % | 23 % – 64 % | — | — | 40 % |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 2 % | 0 % – 5 % | — | — | 2 % |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,92 | 0,85 – 0,98 | — | — | 0,93 |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,91 – 0,99 | — | — | 0,96 |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,95 – 1,00 | — | — | 0,98 |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,50 | 0,18 – 0,91 | — | — | 0,48 |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 9 % | 0 % – 18 % | — | — | 9 % |
| Constructeurs : changements de position par concurrent sur la saison | 4,0 | 2,2 – 6,3 | — | — | 4,2 |
| Constructeurs : écart moyen entre voisins (points) — haut | 119,1 | 66,5 – 158,3 | — | — | 139,8 |
| Constructeurs : écart moyen entre voisins (points) — milieu | 27,9 | 15,0 – 46,0 | — | — | 33,7 |
| Constructeurs : écart moyen entre voisins (points) — bas | 10,1 | 1,5 – 25,0 | — | — | 12,1 |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 87 % | 80 % – 100 % | — | — | 84 % |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 58 % | 50 % – 70 % | — | — | 53 % |
| Constructeurs : frontières raisonnablement disputées — haut | 23 % | 0 % – 50 % | — | — | 19 % |
| Constructeurs : frontières raisonnablement disputées — milieu | 75 % | 50 % – 100 % | — | — | 67 % |
| Constructeurs : frontières raisonnablement disputées — bas | 95 % | 50 % – 100 % | — | — | 93 % |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 5 % | 0 % – 9 % | — | — | 8 % |
| Constructeurs : positions déjà acquises — haut | 15 % | 0 % – 25 % | — | — | 21 % |
| Constructeurs : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 48 % | 18 % – 73 % | — | — | 48 % |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 7 % | 0 % – 18 % | — | — | 9 % |

## Chronique d’exemple (graine 1)

**2027** — champion : George Russel
- George Russel (Mercédes) remporte le titre avec 349 points et 8 victoires, 16 points devant Kimi Antoneli (Mercédes).
- Mercédes décroche le titre des constructeurs (10e titre de son histoire).
- Mercédes signe 5 doublés.
- Victoire surprise de Lando Noris (McLarren) à Shangai, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Sakir.
- Victoire surprise de Charles Leclerq (Ferrary) à Gilles-Villeneuves.
- Victoire surprise de Lewis Hammilton (Ferrary) à Madrit, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Las Vegaz.
- Cadilac termine la saison sans marquer le moindre point.

**2028** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 367 points et 7 victoires, 52 points devant Max Verstapen (Red Bul).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Audy progresse de la 10e à la 7e place.
- Wiliams recule de la 5e à la 8e place.
- Aston Martyn recule de la 7e à la 10e place.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 334 points et 6 victoires, 9 points devant Kimi Antoneli (McLarren).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 9 fois.
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Wiliams progresse de la 8e à la 5e place.
- Audy recule de la 7e à la 10e place.
- Cadilac termine la saison sans marquer le moindre point.

**2030** — champion : Lando Noris
- Lando Noris (Mercédes) remporte le titre avec 346 points et 6 victoires, 10 points devant Oscar Piastry (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Mercédes signe 8 doublés.
- Victoire surprise de Lando Noris (Mercédes) à Hungarorring.
- Victoire surprise de Oscar Piastry (Mercédes) à Marinna Bay.
- Victoire surprise de Kimi Antoneli (McLarren) à Interlagoss, sous la pluie.
- Audy termine la saison sans marquer le moindre point.
- Cadilac termine la saison sans marquer le moindre point.

**2031** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 386 points et 10 victoires, 93 points devant Oscar Piastry (Mercédes).
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Victoire surprise de Oscar Piastry (Mercédes) à Marinna Bay, sous la pluie.
- Audy termine la saison sans marquer le moindre point.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 285 points et 5 victoires, 14 points devant Oscar Piastry (McLarren).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 7 fois.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Mercédes) à Hungarorring.
- Victoire surprise de Louis Lambert (Alpyne) à Istambull.
- Victoire surprise de Kimi Antoneli (Mercédes) à Marinna Bay.
- Victoire surprise de Louis Lambert (Alpyne) à Lussail.

**2033** — champion : Max Verstapen
- Max Verstapen (Ferrary) remporte le titre avec 386 points et 10 victoires, 122 points devant Oscar Piastry (McLarren).
- Une domination sans partage.
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Mercédes) à Kyalamy, sous la pluie.
- Victoire surprise de Louis Lambert (Alpyne) à Suzuca.
- Victoire surprise de Oliver Bearmann (Racing Buls) à Silverston, sous la pluie.
- Cadilac progresse de la 11e à la 7e place.
- Aston Martyn recule de la 5e à la 10e place.

**2034** — champion : Max Verstapen
- Max Verstapen (Ferrary) remporte le titre avec 380 points et 10 victoires, 23 points devant Oscar Piastry (Ferrary).
- Retournement lors de la dernière manche : Max Verstapen arrache le titre à Oscar Piastry.
- La tête du championnat a changé 5 fois.
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Ferrary signe 8 doublés.
- Victoire surprise de Kimi Antoneli (Mercédes) à Shangai.
- Victoire surprise de Kimi Antoneli (Mercédes) à Spa-Francorchamp.
- Victoire surprise de Kimi Antoneli (Mercédes) à Monzza.
- Audy progresse de la 8e à la 4e place.
- Wiliams progresse de la 11e à la 6e place.
- Aston Martyn progresse de la 10e à la 7e place.
- Red Bul recule de la 2e à la 10e place.

**2035** — champion : Max Verstapen
- Max Verstapen (Mercédes) remporte le titre avec 323 points et 7 victoires, 31 points devant Kimi Antoneli (Ferrary).
- La tête du championnat a changé 9 fois.
- Ferrary décroche le titre des constructeurs (19e titre de son histoire).

**2036** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 350 points et 7 victoires, 32 points devant Kimi Antoneli (Ferrary).
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Aston Martyn progresse de la 8e à la 5e place.
- Audy recule de la 3e à la 7e place.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

