# Rapport d’équilibrage — 20 graines × 10 saisons

Scénario grille-2026, graines 1 à 20, 200 saisons simulées en 550,9 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 4,8 | 3,0 – 6,0 | 3,0 – 8,0 | 100 % | 5,8 |
| Écuries victorieuses par saison | 3,1 | 2,0 – 4,0 | 2,0 – 5,0 | 100 % | 4,0 |
| Part des victoires de l'écurie dominante | 64 % | 45 % – 85 % | 35 % – 80 % | 88 % | 58 % |
| Taux d’abandon par départ | 8 % | 5 % – 10 % | 5 % – 15 % | 93 % | 7 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 2,10 | 1,65 – 2,38 | 1,50 – 4,00 | 97 % | 1,54 |
| Écart de points entre les deux premiers | 61 | 9 – 127 | — | — | 59 |
| Changements de leader du championnat | 2,4 | 0,0 – 6,0 | — | — | 2,8 |
| Doublés par saison (toutes écuries) | 5,3 | 1,0 – 9,0 | — | — | 4,5 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,93 | 0,85 – 0,98 | — | — | 0,87 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 0,96 | 0,57 – 1,39 | — | — | 1,05 |
| Victoires inattendues par saison | 1,5 | 0,0 – 4,0 | — | — | 2,2 |
| Courses sous la pluie par saison | 2,2 | 1,0 – 4,0 | — | — | 2,2 |

## Par série de 10 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 10 saisons | 4,3 | 3,0 – 6,0 | 3,0 – 7,0 | 100 % | 4,5 |
| Champions constructeurs différents sur 10 saisons | 2,2 | 1,0 – 4,0 | — | — | 2,5 |
| Plus longue série de titres constructeurs consécutifs | 6,2 | 3,0 – 10,0 | — | — | 5,2 |
| Écuries sans aucune victoire sur 10 saisons | 6,5 | 6,0 – 7,0 | — | — | 3,0 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 3,2 | 1,0 – 5,0 | — | — | 6,6 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 1,7 | 1,3 – 2,0 | — | — | 2,8 |
| Transitions de saison sans aucun changement d’étage (D-081) | 24 % | 11 % – 44 % | — | — | 11 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 26 % | — | 40 % – 90 % | — | 56 % |
| Séries de 10 saisons avec 5 titres constructeurs consécutifs ou plus | 55 % | — | 0 % – 25 % | — | 55 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 29 % | — | — | — | 32 % |
| Retournement à la dernière manche (le leader perd le titre) | 6 % | — | — | — | 7 % |
| Champion et vice-champion coéquipiers | 42 % | — | — | — | 42 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 14 % | — | — | — | 13 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 15 % | — | — | — | 19 % |
| Saisons très serrées (≤ 10 points d’écart) | 12 % | — | — | — | 13 % |
| Dominations (≥ 120 points d’écart) | 11 % | — | — | — | 12 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,45 | 0,39 – 0,50 | — | — | 0,44 |
| Coéquipiers : écart moyen dû aux compétences | 0,24 | 0,17 – 0,33 | — | — | 0,24 |
| Coéquipiers : écart moyen dû à la forme | 0,02 | 0,01 – 0,02 | — | — | 0,02 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,34 – 0,39 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 30 % | 18 % – 42 % | — | — | 30 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 69 % | 54 % – 82 % | — | — | 70 % |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,93 | 0,88 – 0,97 | — | — | 0,90 |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,97 | 0,94 – 0,99 | — | — | 0,96 |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,99 | 0,97 – 1,00 | — | — | 0,98 |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 0,96 | 0,45 – 1,45 | — | — | 1,23 |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 23 % | 5 % – 41 % | — | — | 31 % |
| Pilotes : changements de position par concurrent sur la saison | 5,3 | 4,2 – 6,4 | — | — | 6,9 |
| Pilotes : écart moyen entre voisins (points) — haut | 43,2 | 29,2 – 57,6 | — | — | 41,9 |
| Pilotes : écart moyen entre voisins (points) — milieu | 22,3 | 16,6 – 27,9 | — | — | 17,2 |
| Pilotes : écart moyen entre voisins (points) — bas | 1,5 | 0,7 – 2,6 | — | — | 3,4 |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 96 % | 90 % – 100 % | — | — | 97 % |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 73 % | 67 % – 81 % | — | — | 76 % |
| Pilotes : frontières raisonnablement disputées — haut | 35 % | 20 % – 60 % | — | — | 39 % |
| Pilotes : frontières raisonnablement disputées — milieu | 66 % | 43 % – 86 % | — | — | 74 % |
| Pilotes : frontières raisonnablement disputées — bas | 100 % | 100 % – 100 % | — | — | 99 % |
| Pilotes : positions déjà acquises à 3 manches de la fin | 1 % | 0 % – 5 % | — | — | 1 % |
| Pilotes : positions déjà acquises — haut | 6 % | 0 % – 20 % | — | — | 6 % |
| Pilotes : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 48 % | 27 % – 68 % | — | — | 43 % |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 2 % | 0 % – 5 % | — | — | 2 % |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,95 | 0,89 – 0,99 | — | — | 0,93 |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,97 | 0,94 – 1,00 | — | — | 0,96 |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,99 | 0,96 – 1,00 | — | — | 0,98 |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,34 | 0,00 – 0,73 | — | — | 0,48 |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 6 % | 0 % – 18 % | — | — | 9 % |
| Constructeurs : changements de position par concurrent sur la saison | 2,8 | 1,6 – 4,3 | — | — | 4,0 |
| Constructeurs : écart moyen entre voisins (points) — haut | 141,9 | 119,8 – 164,5 | — | — | 117,8 |
| Constructeurs : écart moyen entre voisins (points) — milieu | 23,5 | 11,8 – 35,5 | — | — | 28,4 |
| Constructeurs : écart moyen entre voisins (points) — bas | 3,5 | 0,5 – 7,5 | — | — | 11,0 |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 83 % | 80 % – 90 % | — | — | 87 % |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 57 % | 50 % – 70 % | — | — | 58 % |
| Constructeurs : frontières raisonnablement disputées — haut | 13 % | 0 % – 25 % | — | — | 25 % |
| Constructeurs : frontières raisonnablement disputées — milieu | 80 % | 75 % – 100 % | — | — | 73 % |
| Constructeurs : frontières raisonnablement disputées — bas | 100 % | — | — | — | 96 % |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 7 % | 0 % – 18 % | — | — | 6 % |
| Constructeurs : positions déjà acquises — haut | 19 % | 0 % – 50 % | — | — | 16 % |
| Constructeurs : positions déjà acquises — milieu | 0 % | — | — | — | 0 % |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 51 % | 27 % – 73 % | — | — | 51 % |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 9 % | 0 % – 18 % | — | — | 7 % |

## Chronique d’exemple (graine 1)

**2027** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 344 points et 8 victoires, 2 points devant George Russel (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Kimi Antoneli arrache le titre à George Russel.
- Mercédes décroche le titre des constructeurs (10e titre de son histoire).
- Mercédes signe 5 doublés.
- Victoire surprise de Max Verstapen (Red Bul) à Sakir.
- Victoire surprise de Lewis Hammilton (Ferrary) à Madrit, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Las Vegaz.
- Cadilac termine la saison sans marquer le moindre point.

**2028** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 411 points et 9 victoires, 97 points devant George Russel (Mercédes).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Mercédes signe 10 doublés.
- Victoire surprise de Oscar Piastry (McLarren) à Albert Parc.
- Victoire surprise de Oscar Piastry (McLarren) à Monzza.
- Victoire surprise de Max Verstapen (Red Bul) à Marinna Bay.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 387 points et 9 victoires, 50 points devant George Russel (Mercédes).
- La tête du championnat a changé 5 fois.
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Mercédes signe 8 doublés.
- Victoire surprise de Kimi Antoneli (McLarren) à Spa-Francorchamp.
- Cadilac progresse de la 11e à la 8e place.
- Racing Buls termine la saison sans marquer le moindre point.
- Audy termine la saison sans marquer le moindre point.

**2030** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 361 points et 7 victoires, 21 points devant Oscar Piastry (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Mercédes signe 7 doublés.
- Victoire surprise de Samuel Marlow (Ferrary) à Las Vegaz.
- Aston Martyn recule de la 7e à la 10e place.

**2031** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 386 points et 8 victoires, 48 points devant Oscar Piastry (Mercédes).
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Aston Martyn progresse de la 10e à la 7e place.
- Racing Buls termine la saison sans marquer le moindre point.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 394 points et 10 victoires, 90 points devant Kimi Antoneli (Red Bul).
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Racing Buls termine la saison sans marquer le moindre point.

**2033** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 417 points et 12 victoires, 71 points devant Kimi Antoneli (Red Bul).
- McLarren décroche le titre des constructeurs (13e titre de son histoire).
- Racing Buls termine la saison sans marquer le moindre point.

**2034** — champion : Fleur Postma
- Fleur Postma (Mercédes) remporte le titre avec 308 points et 4 victoires, 9 points devant Kimi Antoneli (Red Bul).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Fleur Postma arrache le titre à Kimi Antoneli.
- La tête du championnat a changé 8 fois.
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Red Bul) à Shangai.
- Victoire surprise de Oscar Piastry (Red Bul) à Imolla.
- Victoire surprise de Oscar Piastry (Red Bul) à Gilles-Villeneuves.
- Victoire surprise de Kimi Antoneli (Red Bul) à Catalunia.
- Victoire surprise de Kimi Antoneli (Red Bul) à Silverston.
- Victoire surprise de Oscar Piastry (Red Bul) à Sepanng.
- Cadilac progresse de la 10e à la 7e place.

**2035** — champion : Fleur Postma
- Fleur Postma (Mercédes) remporte le titre avec 358 points et 8 victoires, 2 points devant Samuel Carlisle (McLarren).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Fleur Postma arrache le titre à Samuel Carlisle.
- La tête du championnat a changé 4 fois.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Álvaro Ferrer (Ferrary) à Sepanng, sous la pluie.
- Audy progresse de la 10e à la 7e place.
- Cadilac recule de la 7e à la 10e place.
- Racing Buls termine la saison sans marquer le moindre point.

**2036** — champion : Taylor Prescott
- Taylor Prescott (Mercédes) remporte le titre avec 384 points et 10 victoires, 31 points devant Samuel Carlisle (McLarren).
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Mercédes signe 5 doublés.
- Racing Buls termine la saison sans marquer le moindre point.
- Haass termine la saison sans marquer le moindre point.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

