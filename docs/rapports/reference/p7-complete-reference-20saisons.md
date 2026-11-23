# Rapport d’équilibrage — 50 graines × 20 saisons

Scénario grille-2026, graines 1 à 50, 1000 saisons simulées en 1 005,4 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 7,4 | 5,0 – 11,0 | 3,0 – 8,0 | 68 % | 7,4 |
| Écuries victorieuses par saison | 5,3 | 3,0 – 8,0 | 2,0 – 5,0 | 55 % | 5,3 |
| Part des victoires de l'écurie dominante | 50 % | 29 % – 75 % | 35 % – 80 % | 72 % | 51 % |
| Taux d’abandon par départ | 5 % | 3 % – 9 % | 5 % – 15 % | 47 % | 5 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,12 | 0,56 – 2,02 | 1,50 – 4,00 | 24 % | 1,13 |
| Écart de points entre les deux premiers | 70 | 10 – 150 | — | — | 67 |
| Changements de leader du championnat | 3,1 | 0,0 – 7,0 | — | — | 3,1 |
| Doublés par saison (toutes écuries) | 4,1 | 1,0 – 9,0 | — | — | 4,2 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,81 | 0,59 – 0,96 | — | — | 0,82 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 0,80 | 0,45 – 1,28 | — | — | 0,80 |
| Victoires inattendues par saison | 2,0 | 0,0 – 5,0 | — | — | 1,9 |
| Courses sous la pluie par saison | 2,8 | 1,0 – 5,0 | — | — | 2,8 |

## Par série de 20 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 20 saisons | 7,5 | 5,0 – 9,0 | 3,0 – 7,0 | 50 % | 7,5 |
| Champions constructeurs différents sur 20 saisons | 5,0 | 3,0 – 6,0 | — | — | 4,7 |
| Plus longue série de titres constructeurs consécutifs | 5,9 | 4,0 – 8,0 | — | — | 6,4 |
| Écuries sans aucune victoire sur 20 saisons | 0,2 | 0,0 – 1,0 | — | — | 0,2 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 20,8 | 14,0 – 27,0 | — | — | 20,0 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 3,3 | 2,6 – 3,9 | — | — | 3,4 |
| Transitions de saison sans aucun changement d’étage (D-081) | 9 % | 0 % – 21 % | — | — | 9 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 77 % | — | 40 % – 90 % | — | 74 % |
| Séries de 20 saisons avec 5 titres constructeurs consécutifs ou plus | 72 % | — | 0 % – 25 % | — | 74 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 26 % | — | — | — | 25 % |
| Retournement à la dernière manche (le leader perd le titre) | 6 % | — | — | — | 6 % |
| Champion et vice-champion coéquipiers | 28 % | — | — | — | 33 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 7 % | — | — | — | 8 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 20 % | — | — | — | 17 % |
| Saisons très serrées (≤ 10 points d’écart) | 10 % | — | — | — | 10 % |
| Dominations (≥ 120 points d’écart) | 18 % | — | — | — | 18 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,44 | 0,39 – 0,49 | — | — | 0,44 |
| Coéquipiers : écart moyen dû aux compétences | 0,23 | 0,17 – 0,30 | — | — | 0,23 |
| Coéquipiers : écart moyen dû à la forme | 0,01 | 0,01 – 0,01 | — | — | 0,01 |
| Coéquipiers : écart moyen dû à l’aléa | 0,37 | 0,34 – 0,40 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 28 % | 17 % – 40 % | — | — | 28 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 72 % | 59 % – 84 % | — | — | 72 % |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,89 | 0,82 – 0,95 | — | — | 0,89 |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,95 | 0,91 – 0,98 | — | — | 0,95 |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 0,99 | — | — | 0,98 |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,37 | 0,82 – 1,91 | — | — | 1,35 |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 35 % | 18 % – 50 % | — | — | 35 % |
| Pilotes : changements de position par concurrent sur la saison | 8,7 | 6,0 – 11,1 | — | — | 8,7 |
| Pilotes : écart moyen entre voisins (points) — haut | 45,3 | 26,8 – 65,0 | — | — | 44,7 |
| Pilotes : écart moyen entre voisins (points) — milieu | 18,0 | 10,0 – 28,3 | — | — | 18,1 |
| Pilotes : écart moyen entre voisins (points) — bas | 5,3 | 1,8 – 8,4 | — | — | 5,3 |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 96 % | 90 % – 100 % | — | — | 96 % |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 74 % | 67 % – 81 % | — | — | 74 % |
| Pilotes : frontières raisonnablement disputées — haut | 37 % | 20 % – 60 % | — | — | 36 % |
| Pilotes : frontières raisonnablement disputées — milieu | 71 % | 57 % – 86 % | — | — | 71 % |
| Pilotes : frontières raisonnablement disputées — bas | 97 % | 89 % – 100 % | — | — | 97 % |
| Pilotes : positions déjà acquises à 3 manches de la fin | 2 % | 0 % – 5 % | — | — | 2 % |
| Pilotes : positions déjà acquises — haut | 8 % | 0 % – 20 % | — | — | 8 % |
| Pilotes : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — | 0 % |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 38 % | 18 % – 59 % | — | — | 38 % |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 2 % | 0 % – 5 % | — | — | 2 % |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,91 | 0,82 – 0,98 | — | — | 0,91 |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,95 | 0,90 – 0,99 | — | — | 0,95 |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,95 – 1,00 | — | — | 0,98 |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,56 | 0,18 – 0,91 | — | — | 0,58 |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 11 % | 0 % – 27 % | — | — | 11 % |
| Constructeurs : changements de position par concurrent sur la saison | 5,2 | 2,9 – 7,5 | — | — | 5,2 |
| Constructeurs : écart moyen entre voisins (points) — haut | 115,7 | 57,5 – 180,0 | — | — | 116,3 |
| Constructeurs : écart moyen entre voisins (points) — milieu | 35,4 | 18,8 – 55,5 | — | — | 35,5 |
| Constructeurs : écart moyen entre voisins (points) — bas | 18,9 | 3,5 – 40,0 | — | — | 19,0 |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 87 % | 80 % – 100 % | — | — | 87 % |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 54 % | 40 % – 70 % | — | — | 54 % |
| Constructeurs : frontières raisonnablement disputées — haut | 28 % | 0 % – 50 % | — | — | 28 % |
| Constructeurs : frontières raisonnablement disputées — milieu | 64 % | 50 % – 100 % | — | — | 65 % |
| Constructeurs : frontières raisonnablement disputées — bas | 84 % | 50 % – 100 % | — | — | 84 % |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 6 % | 0 % – 18 % | — | — | 7 % |
| Constructeurs : positions déjà acquises — haut | 17 % | 0 % – 50 % | — | — | 18 % |
| Constructeurs : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — | 0 % |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 48 % | 27 % – 73 % | — | — | 47 % |
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

**2037** — champion : Marco Sartori
- Marco Sartori (Mercédes) remporte le titre avec 328 points et 6 victoires, 13 points devant Max Verstapen (McLarren).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 5 fois.
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Victoire surprise de Niklas Winkler (Racing Buls) à Spielbergh, sous la pluie.
- Victoire surprise de Kimi Antoneli (Aston Martyn) à Monzza.
- Victoire surprise de Kimi Antoneli (Aston Martyn) à Interlagoss.
- Victoire surprise de Kimi Antoneli (Aston Martyn) à Lussail.
- Racing Buls progresse de la 11e à la 8e place.
- Haass termine la saison sans marquer le moindre point.

**2038** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 355 points et 10 victoires, 82 points devant Marco Sartori (Mercédes).
- Mercédes décroche le titre des constructeurs (16e titre de son histoire).
- Victoire surprise de Samuel Marlow (Aston Martyn) à Shangai, sous la pluie.
- Victoire surprise de Kimi Antoneli (Audy) à Spielbergh, sous la pluie.
- McLarren recule de la 1re à la 4e place.
- Cadilac progresse de la 9e à la 5e place.
- Aston Martyn recule de la 4e à la 7e place.
- Wiliams recule de la 7e à la 10e place.
- Haass termine la saison sans marquer le moindre point.

**2039** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 379 points et 8 victoires, 28 points devant Marco Sartori (McLarren).
- Mercédes décroche le titre des constructeurs (17e titre de son histoire).
- Aston Martyn progresse de la 7e à la 3e place.
- Alpyne recule de la 3e à la 7e place.
- Red Bul recule de la 6e à la 9e place.

**2040** — champion : Marco Sartori
- Marco Sartori (McLarren) remporte le titre avec 370 points et 5 victoires, 16 points devant Kimi Antoneli (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (18e titre de son histoire).
- Alpyne progresse de la 7e à la 4e place.
- Cadilac recule de la 5e à la 9e place.
- Haass termine la saison sans marquer le moindre point.

**2041** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 404 points et 9 victoires, 87 points devant Oscar Piastry (McLarren).
- Mercédes décroche le titre des constructeurs (19e titre de son histoire).
- Alpyne recule de la 4e à la 7e place.
- Red Bul recule de la 8e à la 11e place.
- Red Bul, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2042** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 295 points et 4 victoires, 27 points devant Connor Fletcher (Aston Martyn).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (20e titre de son histoire).
- Victoire surprise de Lucía Ferrer (Racing Buls) à Hermanos Rodrigues.
- Red Bul progresse de la 11e à la 8e place.
- Audy recule de la 6e à la 10e place.

**2043** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 258 points et 4 victoires, 33 points devant Oscar Piastry (Mercédes).
- La tête du championnat a changé 4 fois.
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Victoire surprise de Lucía Ferrer (Racing Buls) à Albert Parc.
- Victoire surprise de Anna Kessler (Ferrary) à Spielbergh.
- Victoire surprise de Anna Kessler (Ferrary) à Bakou.
- Victoire surprise de Giulia Sartori (Audy) à Interlagoss.
- Wiliams progresse de la 5e à la 2e place.
- Mercédes recule de la 1re à la 4e place.
- Ferrary recule de la 3e à la 6e place.

**2044** — champion : Arvid Linblad
- Arvid Linblad (Alpyne) remporte le titre avec 261 points et 4 victoires, 21 points devant Kimi Antoneli (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 8 fois.
- McLarren décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Lucía Ferrer (Racing Buls) à Shangai, sous la pluie.
- Victoire surprise de Giulia Sartori (Audy) à Miamy.
- Alpyne progresse de la 5e à la 2e place.
- Aston Martyn recule de la 3e à la 6e place.

**2045** — champion : Paolo Marchetti
- Paolo Marchetti (McLarren) remporte le titre avec 350 points et 9 victoires, 74 points devant Kimi Antoneli (Mercédes).
- La tête du championnat a changé 4 fois.
- McLarren décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Giulia Sartori (Ferrary) à Zandvort, sous la pluie.
- Victoire surprise de Giulia Sartori (Ferrary) à Bakou.
- Victoire surprise de Giulia Sartori (Ferrary) à Interlagoss.
- Red Bul progresse de la 8e à la 4e place.
- Wiliams recule de la 4e à la 10e place.

**2046** — champion : Paolo Marchetti
- Paolo Marchetti (Mercédes) remporte le titre avec 353 points et 6 victoires, 33 points devant Lucía Ferrer (McLarren).
- Mercédes décroche le titre des constructeurs (21e titre de son histoire).
- Victoire surprise de Callum Fletcher (Cadilac) à Shangai, sous la pluie.
- Ferrary progresse de la 5e à la 2e place.

