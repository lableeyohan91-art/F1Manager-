# Rapport d’équilibrage — 50 graines × 20 saisons

Scénario grille-2026, graines 1 à 50, 1000 saisons simulées en 1 242,9 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 7,2 | 4,0 – 10,0 | 3,0 – 8,0 | 71 % | 7,4 |
| Écuries victorieuses par saison | 5,1 | 3,0 – 7,0 | 2,0 – 5,0 | 60 % | 5,3 |
| Part des victoires de l'écurie dominante | 52 % | 33 % – 79 % | 35 % – 80 % | 75 % | 51 % |
| Taux d’abandon par départ | 6 % | 3 % – 9 % | 5 % – 15 % | 59 % | 5 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,17 | 0,60 – 2,10 | 1,50 – 4,00 | 26 % | 1,13 |
| Écart de points entre les deux premiers | 69 | 9 – 150 | — | — | 67 |
| Changements de leader du championnat | 3,1 | 0,0 – 7,0 | — | — | 3,1 |
| Doublés par saison (toutes écuries) | 4,3 | 1,0 – 9,0 | — | — | 4,2 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,82 | 0,65 – 0,96 | — | — | 0,82 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 0,86 | 0,48 – 1,27 | — | — | 0,80 |
| Victoires inattendues par saison | 2,0 | 0,0 – 5,0 | — | — | 1,9 |
| Courses sous la pluie par saison | 2,8 | 1,0 – 5,0 | — | — | 2,8 |

## Par série de 20 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 20 saisons | 7,4 | 5,0 – 9,0 | 3,0 – 7,0 | 48 % | 7,5 |
| Champions constructeurs différents sur 20 saisons | 4,6 | 3,0 – 6,0 | — | — | 4,7 |
| Plus longue série de titres constructeurs consécutifs | 6,2 | 4,0 – 10,0 | — | — | 6,4 |
| Écuries sans aucune victoire sur 20 saisons | 0,3 | 0,0 – 1,0 | — | — | 0,2 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 18,9 | 13,0 – 26,0 | — | — | 20,0 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 3,3 | 2,7 – 3,9 | — | — | 3,4 |
| Transitions de saison sans aucun changement d’étage (D-081) | 10 % | 0 % – 16 % | — | — | 9 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 74 % | — | 40 % – 90 % | — | 74 % |
| Séries de 20 saisons avec 5 titres constructeurs consécutifs ou plus | 68 % | — | 0 % – 25 % | — | 74 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 26 % | — | — | — | 25 % |
| Retournement à la dernière manche (le leader perd le titre) | 5 % | — | — | — | 6 % |
| Champion et vice-champion coéquipiers | 34 % | — | — | — | 33 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 8 % | — | — | — | 8 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 17 % | — | — | — | 17 % |
| Saisons très serrées (≤ 10 points d’écart) | 12 % | — | — | — | 10 % |
| Dominations (≥ 120 points d’écart) | 18 % | — | — | — | 18 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,44 | 0,39 – 0,49 | — | — | 0,44 |
| Coéquipiers : écart moyen dû aux compétences | 0,24 | 0,17 – 0,31 | — | — | 0,23 |
| Coéquipiers : écart moyen dû à la forme | 0,01 | 0,01 – 0,01 | — | — | 0,01 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,33 – 0,40 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 29 % | 18 % – 42 % | — | — | 28 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 70 % | 56 % – 83 % | — | — | 72 % |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,90 | 0,83 – 0,95 | — | — | 0,89 |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,95 | 0,92 – 0,98 | — | — | 0,95 |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 0,99 | — | — | 0,98 |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,32 | 0,82 – 1,82 | — | — | 1,35 |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 34 % | 14 % – 50 % | — | — | 35 % |
| Pilotes : changements de position par concurrent sur la saison | 8,4 | 5,9 – 10,5 | — | — | 8,7 |
| Pilotes : écart moyen entre voisins (points) — haut | 45,5 | 26,6 – 64,4 | — | — | 44,7 |
| Pilotes : écart moyen entre voisins (points) — milieu | 18,6 | 10,6 – 28,7 | — | — | 18,1 |
| Pilotes : écart moyen entre voisins (points) — bas | 5,2 | 1,8 – 8,2 | — | — | 5,3 |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 96 % | 90 % – 100 % | — | — | 96 % |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 74 % | 67 % – 81 % | — | — | 74 % |
| Pilotes : frontières raisonnablement disputées — haut | 37 % | 20 % – 60 % | — | — | 36 % |
| Pilotes : frontières raisonnablement disputées — milieu | 70 % | 43 % – 86 % | — | — | 71 % |
| Pilotes : frontières raisonnablement disputées — bas | 97 % | 89 % – 100 % | — | — | 97 % |
| Pilotes : positions déjà acquises à 3 manches de la fin | 2 % | 0 % – 5 % | — | — | 2 % |
| Pilotes : positions déjà acquises — haut | 8 % | 0 % – 20 % | — | — | 8 % |
| Pilotes : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — | 0 % |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — | 0 % |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 39 % | 23 % – 59 % | — | — | 38 % |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 2 % | 0 % – 5 % | — | — | 2 % |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,91 | 0,84 – 0,98 | — | — | 0,91 |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,92 – 0,99 | — | — | 0,95 |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,95 – 1,00 | — | — | 0,98 |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,52 | 0,18 – 0,91 | — | — | 0,58 |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 10 % | 0 % – 27 % | — | — | 11 % |
| Constructeurs : changements de position par concurrent sur la saison | 5,0 | 2,8 – 6,9 | — | — | 5,2 |
| Constructeurs : écart moyen entre voisins (points) — haut | 118,8 | 59,8 – 182,3 | — | — | 116,3 |
| Constructeurs : écart moyen entre voisins (points) — milieu | 36,9 | 20,3 – 56,0 | — | — | 35,5 |
| Constructeurs : écart moyen entre voisins (points) — bas | 18,0 | 3,0 – 38,5 | — | — | 19,0 |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 87 % | 80 % – 100 % | — | — | 87 % |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 53 % | 40 % – 70 % | — | — | 54 % |
| Constructeurs : frontières raisonnablement disputées — haut | 26 % | 0 % – 50 % | — | — | 28 % |
| Constructeurs : frontières raisonnablement disputées — milieu | 64 % | 50 % – 75 % | — | — | 65 % |
| Constructeurs : frontières raisonnablement disputées — bas | 86 % | 50 % – 100 % | — | — | 84 % |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 6 % | 0 % – 18 % | — | — | 7 % |
| Constructeurs : positions déjà acquises — haut | 18 % | 0 % – 50 % | — | — | 18 % |
| Constructeurs : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — | 0 % |
| Constructeurs : positions déjà acquises — bas | 0 % | 0 % – 0 % | — | — | 0 % |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 48 % | 27 % – 73 % | — | — | 47 % |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 8 % | 0 % – 18 % | — | — | 8 % |

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
- Kimi Antoneli (Mercédes) remporte le titre avec 441 points et 8 victoires, 93 points devant Max Verstapen (Red Bul).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Mercédes signe 5 doublés.
- Audy progresse de la 10e à la 7e place.
- Wiliams recule de la 5e à la 8e place.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 408 points et 9 victoires, 60 points devant Kimi Antoneli (McLarren).
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Wiliams progresse de la 8e à la 5e place.
- Cadilac termine la saison sans marquer le moindre point.

**2030** — champion : Lando Noris
- Lando Noris (Mercédes) remporte le titre avec 397 points et 5 victoires, 5 points devant Oscar Piastry (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 8 fois.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Mercédes signe 8 doublés.
- Cadilac termine la saison sans marquer le moindre point.

**2031** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 404 points et 7 victoires, 20 points devant Max Verstapen (Ferrary).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 5 fois.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Cadilac progresse de la 11e à la 8e place.
- Wiliams recule de la 7e à la 10e place.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Max Verstapen
- Max Verstapen (Ferrary) remporte le titre avec 466 points et 11 victoires, 119 points devant Taylor Walsh (Red Bul).
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Wiliams progresse de la 10e à la 6e place.
- Cadilac recule de la 8e à la 11e place.

**2033** — champion : Taylor Walsh
- Taylor Walsh (Red Bul) remporte le titre avec 421 points et 9 victoires, 85 points devant Kimi Antoneli (Mercédes).
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Victoire surprise de Oliver Bearmann (Racing Buls) à Silverston, sous la pluie.
- Aston Martyn recule de la 5e à la 11e place.

**2034** — champion : Max Verstapen
- Max Verstapen (McLarren) remporte le titre avec 344 points et 5 victoires, 7 points devant Kimi Antoneli (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 14 fois.
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Victoire surprise de Gabriel Bortoletto (Red Bul) à Suzuca, sous la pluie.
- Victoire surprise de Romain Moreau (Alpyne) à Interlagoss.
- Red Bul recule de la 1re à la 5e place.
- Aston Martyn progresse de la 11e à la 6e place.
- Haass recule de la 8e à la 11e place.
- Haass termine la saison sans marquer le moindre point.

**2035** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 322 points et 6 victoires, 26 points devant Oscar Piastry (McLarren).
- La tête du championnat a changé 6 fois.
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Victoire surprise de Oscar Piastry (McLarren) à Monacco.
- Victoire surprise de Romain Moreau (Alpyne) à Monzza.
- Haass termine la saison sans marquer le moindre point.

**2036** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 397 points et 10 victoires, 63 points devant Paolo Marchetti (Mercédes).
- La tête du championnat a changé 7 fois.
- McLarren décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Max Verstapen (Aston Martyn) à Shangai.
- Victoire surprise de Oscar Piastry (Red Bul) à Spielbergh.
- Victoire surprise de Taylor Walsh (Wiliams) à Zandvort.
- Victoire surprise de Oscar Piastry (Red Bul) à Monzza.
- Victoire surprise de Oscar Piastry (Red Bul) à Las Vegaz.
- Ferrary recule de la 2e à la 6e place.
- Haass termine la saison sans marquer le moindre point.

**2037** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 448 points et 12 victoires, 141 points devant Paolo Marchetti (Mercédes).
- Une domination sans partage.
- La tête du championnat a changé 5 fois.
- McLarren décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Max Verstapen (Wiliams) à Albert Parc.
- Ferrary progresse de la 6e à la 3e place.
- Wiliams recule de la 3e à la 6e place.
- Racing Buls progresse de la 10e à la 7e place.
- Aston Martyn recule de la 5e à la 9e place.

**2038** — champion : Kimi Antoneli
- Kimi Antoneli (Red Bul) remporte le titre avec 347 points et 7 victoires, 44 points devant Oscar Piastry (McLarren).
- La tête du championnat a changé 4 fois.
- Red Bul décroche le titre des constructeurs (8e titre de son histoire).
- Victoire surprise de Samuel Marlow (Aston Martyn) à Shangai, sous la pluie.
- Red Bul progresse de la 4e à la 1re place.

**2039** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 396 points et 9 victoires, 132 points devant Marco Sartori (Ferrary).
- Une domination sans partage.
- McLarren décroche le titre des constructeurs (15e titre de son histoire).
- Red Bul recule de la 1re à la 4e place.

**2040** — champion : Kimi Antoneli
- Kimi Antoneli (McLarren) remporte le titre avec 419 points et 8 victoires, 73 points devant Oscar Piastry (Mercédes).
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Victoire surprise de Paolo Marchetti (Aston Martyn) à Spa-Francorchamp.
- Victoire surprise de Arvid Linblad (Audy) à Austen, sous la pluie.
- Aston Martyn progresse de la 7e à la 4e place.
- Audy progresse de la 9e à la 6e place.
- Red Bul recule de la 4e à la 8e place.
- Racing Buls termine la saison sans marquer le moindre point.

**2041** — champion : Oscar Piastry
- Oscar Piastry (Mercédes) remporte le titre avec 445 points et 11 victoires, 105 points devant Kimi Antoneli (McLarren).
- McLarren décroche le titre des constructeurs (16e titre de son histoire).
- Victoire surprise de Anna Kessler (Ferrary) à Catalunia.
- Victoire surprise de Lucía Ferrer (Ferrary) à Hungarorring, sous la pluie.
- Racing Buls progresse de la 11e à la 8e place.
- Cadilac recule de la 7e à la 10e place.

**2042** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 317 points et 5 victoires, 22 points devant Kimi Antoneli (Mercédes).
- McLarren décroche le titre des constructeurs (17e titre de son histoire).
- Haass progresse de la 11e à la 7e place.
- Red Bul recule de la 7e à la 11e place.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2043** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 279 points et 4 victoires, 7 points devant Lucy Marlow (Wiliams).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 4 fois.
- McLarren décroche le titre des constructeurs (18e titre de son histoire).
- Victoire surprise de Lucía Ferrer (Ferrary) à Albert Parc.
- Victoire surprise de Louis Lambert (Audy) à Shangai, sous la pluie.
- Victoire surprise de Anna Kessler (Ferrary) à Spielbergh.
- Victoire surprise de Louis Lambert (Audy) à Zandvort.
- Victoire surprise de Anna Kessler (Ferrary) à Bakou.
- Red Bul progresse de la 11e à la 5e place.
- Aston Martyn recule de la 2e à la 6e place.

**2044** — champion : Connor Fletcher
- Connor Fletcher (McLarren) remporte le titre avec 288 points et 6 victoires, 6 points devant Lucía Ferrer (McLarren).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Connor Fletcher arrache le titre à Lucía Ferrer.
- La tête du championnat a changé 6 fois.
- McLarren décroche le titre des constructeurs (19e titre de son histoire).
- Haass progresse de la 9e à la 6e place.

**2045** — champion : Lucía Ferrer
- Lucía Ferrer (McLarren) remporte le titre avec 336 points et 7 victoires, 74 points devant Giulia Sartori (Ferrary).
- McLarren décroche le titre des constructeurs (20e titre de son histoire).
- Victoire surprise de Giulia Sartori (Ferrary) à Suzuca.
- Victoire surprise de Paolo Marchetti (Aston Martyn) à Jedda.
- Victoire surprise de Kimi Antoneli (Wiliams) à Miamy.
- Victoire surprise de Giulia Sartori (Ferrary) à Zandvort, sous la pluie.
- Victoire surprise de Giulia Sartori (Ferrary) à Bakou.
- Wiliams recule de la 2e à la 6e place.
- Racing Buls progresse de la 10e à la 7e place.
- Haass recule de la 6e à la 9e place.

**2046** — champion : Giulia Sartori
- Giulia Sartori (Ferrary) remporte le titre avec 338 points et 8 victoires, 43 points devant Lucía Ferrer (McLarren).
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Victoire surprise de Mason Whitaker (Cadilac) à Austen, sous la pluie.
- Audy progresse de la 10e à la 6e place.
- Wiliams recule de la 6e à la 11e place.

