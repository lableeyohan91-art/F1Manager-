# Rapport d’équilibrage — 50 graines × 20 saisons

Scénario grille-2026, graines 1 à 50, 1000 saisons simulées en 465,1 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 7,3 | 5,0 – 10,0 | 3,0 – 8,0 | 68 % |
| Écuries victorieuses par saison | 5,2 | 3,0 – 8,0 | 2,0 – 5,0 | 56 % |
| Part des victoires de l'écurie dominante | 51 % | 29 % – 75 % | 35 % – 80 % | 72 % |
| Taux d’abandon par départ | 6 % | 3 % – 9 % | 5 % – 15 % | 51 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,12 | 0,56 – 2,02 | 1,50 – 4,00 | 24 % |
| Écart de points entre les deux premiers | 81 | 10 – 174 | — | — |
| Changements de leader du championnat | 3,0 | 0,0 – 7,0 | — | — |
| Doublés par saison (toutes écuries) | 4,1 | 1,0 – 9,0 | — | — |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,81 | 0,59 – 0,96 | — | — |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 0,80 | 0,44 – 1,28 | — | — |
| Victoires inattendues par saison | 1,8 | 0,0 – 4,0 | — | — |
| Courses sous la pluie par saison | 2,8 | 1,0 – 5,0 | — | — |

## Par série de 20 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Champions pilotes différents sur 20 saisons | 5,6 | 3,0 – 8,0 | 3,0 – 7,0 | 78 % |
| Champions constructeurs différents sur 20 saisons | 4,1 | 3,0 – 6,0 | — | — |
| Plus longue série de titres constructeurs consécutifs | 7,4 | 4,0 – 11,0 | — | — |
| Écuries sans aucune victoire sur 20 saisons | 0,4 | 0,0 – 1,0 | — | — |
| Remontées (+3 places ou plus d’une saison à l’autre) | 16,4 | 10,0 – 22,0 | — | — |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 3,0 | 2,3 – 3,6 | — | — |
| Transitions de saison sans aucun changement d’étage (D-081) | 13 % | 5 % – 26 % | — | — |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 73 % | — | 40 % – 90 % | — |
| Séries de 20 saisons avec 5 titres constructeurs consécutifs ou plus | 84 % | — | 0 % – 25 % | — |
| Titre encore ouvert avant la dernière manche (définition exacte) | 23 % | — | — | — |
| Retournement à la dernière manche (le leader perd le titre) | 6 % | — | — | — |
| Champion et vice-champion coéquipiers | 28 % | — | — | — |
| Lutte jusqu’à la dernière manche entre coéquipiers | 7 % | — | — | — |
| Lutte jusqu’à la dernière manche entre écuries différentes | 16 % | — | — | — |
| Saisons très serrées (≤ 10 points d’écart) | 11 % | — | — | — |
| Dominations (≥ 120 points d’écart) | 25 % | — | — | — |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,45 | 0,39 – 0,50 | — | — |
| Coéquipiers : écart moyen dû aux compétences | 0,25 | 0,17 – 0,33 | — | — |
| Coéquipiers : écart moyen dû à la forme | 0,01 | 0,01 – 0,01 | — | — |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,34 – 0,40 | — | — |
| Coéquipiers : part de l’écart quadratique due aux compétences | 31 % | 19 % – 44 % | — | — |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 69 % | 55 % – 84 % | — | — |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,89 | 0,82 – 0,95 | — | — |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,95 | 0,92 – 0,98 | — | — |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 0,99 | — | — |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,33 | 0,82 – 1,91 | — | — |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 34 % | 18 % – 50 % | — | — |
| Pilotes : changements de position par concurrent sur la saison | 8,5 | 5,8 – 11,0 | — | — |
| Pilotes : écart moyen entre voisins (points) — haut | 45,6 | 25,8 – 65,0 | — | — |
| Pilotes : écart moyen entre voisins (points) — milieu | 19,0 | 10,0 – 30,3 | — | — |
| Pilotes : écart moyen entre voisins (points) — bas | 5,2 | 1,4 – 8,6 | — | — |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 95 % | 90 % – 100 % | — | — |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 74 % | 67 % – 81 % | — | — |
| Pilotes : frontières raisonnablement disputées — haut | 38 % | 20 % – 60 % | — | — |
| Pilotes : frontières raisonnablement disputées — milieu | 70 % | 57 % – 86 % | — | — |
| Pilotes : frontières raisonnablement disputées — bas | 97 % | 89 % – 100 % | — | — |
| Pilotes : positions déjà acquises à 3 manches de la fin | 2 % | 0 % – 5 % | — | — |
| Pilotes : positions déjà acquises — haut | 10 % | 0 % – 20 % | — | — |
| Pilotes : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 39 % | 23 % – 59 % | — | — |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 3 % | 0 % – 5 % | — | — |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,91 | 0,83 – 0,98 | — | — |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,96 | 0,91 – 0,99 | — | — |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,95 – 1,00 | — | — |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,55 | 0,18 – 0,91 | — | — |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 10 % | 0 % – 27 % | — | — |
| Constructeurs : changements de position par concurrent sur la saison | 5,1 | 2,7 – 7,5 | — | — |
| Constructeurs : écart moyen entre voisins (points) — haut | 117,7 | 53,0 – 183,3 | — | — |
| Constructeurs : écart moyen entre voisins (points) — milieu | 34,1 | 16,8 – 54,3 | — | — |
| Constructeurs : écart moyen entre voisins (points) — bas | 19,1 | 3,0 – 42,0 | — | — |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 87 % | 80 % – 100 % | — | — |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 54 % | 40 % – 70 % | — | — |
| Constructeurs : frontières raisonnablement disputées — haut | 26 % | 0 % – 50 % | — | — |
| Constructeurs : frontières raisonnablement disputées — milieu | 67 % | 50 % – 100 % | — | — |
| Constructeurs : frontières raisonnablement disputées — bas | 84 % | 50 % – 100 % | — | — |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 6 % | 0 % – 18 % | — | — |
| Constructeurs : positions déjà acquises — haut | 17 % | 0 % – 50 % | — | — |
| Constructeurs : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 49 % | 27 % – 73 % | — | — |
| Constructeurs : positions isolées (voisins à plus de 3 victoires) | 8 % | 0 % – 18 % | — | — |

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
- Kimi Antoneli (Mercédes) remporte le titre avec 395 points et 7 victoires, 7 points devant Max Verstapen (Red Bul).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 7 fois.
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Wiliams progresse de la 10e à la 7e place.
- Cadilac termine la saison sans marquer le moindre point.

**2030** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 386 points et 7 victoires, 3 points devant Max Verstapen (Red Bul).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Kimi Antoneli arrache le titre à Max Verstapen.
- La tête du championnat a changé 7 fois.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Suzuca.
- Victoire surprise de Oscar Piastry (McLarren) à Spielbergh.
- Victoire surprise de Max Verstapen (Red Bul) à Zandvort, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Austen.
- Victoire surprise de Oscar Piastry (McLarren) à Lussail.
- Haass progresse de la 10e à la 7e place.
- Wiliams recule de la 7e à la 10e place.

**2031** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 379 points et 5 victoires, 21 points devant Oscar Piastry (McLarren).
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Victoire surprise de Oscar Piastry (McLarren) à Shangai.
- Victoire surprise de Lando Noris (McLarren) à Suzuca.
- Victoire surprise de Kimi Antoneli (Mercédes) à Gilles-Villeneuves.
- Victoire surprise de Kimi Antoneli (Mercédes) à Spielbergh.
- Victoire surprise de Max Verstapen (Red Bul) à Zandvort.
- Victoire surprise de Oscar Piastry (McLarren) à Madrit, sous la pluie.
- Victoire surprise de Kimi Antoneli (Mercédes) à Austen.
- McLarren progresse de la 4e à la 1re place.
- Mercédes recule de la 1re à la 4e place.
- Aston Martyn progresse de la 8e à la 5e place.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 437 points et 8 victoires, 107 points devant Kimi Antoneli (Mercédes).
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Victoire surprise de Oscar Piastry (McLarren) à Jedda.
- Victoire surprise de Kimi Antoneli (Mercédes) à Hungarorring.
- Haass progresse de la 9e à la 5e place.

**2033** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 434 points et 11 victoires, 107 points devant Kimi Antoneli (Mercédes).
- Red Bul décroche le titre des constructeurs (8e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Mercédes) à Albert Parc, sous la pluie.
- Victoire surprise de Kimi Antoneli (Mercédes) à Suzuca.
- Victoire surprise de Tyler Sawyer (Audy) à Silverston, sous la pluie.

**2034** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 370 points et 8 victoires, 41 points devant Max Verstapen (Red Bul).
- La tête du championnat a changé 5 fois.
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Gabriel Bortoletto (Aston Martyn) à Suzuca, sous la pluie.
- Victoire surprise de Tyler Sawyer (Audy) à Miamy.
- Victoire surprise de Oscar Piastry (McLarren) à Monzza.
- Victoire surprise de Oscar Piastry (McLarren) à Austen.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Haass recule de la 6e à la 9e place.

**2035** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 405 points et 8 victoires, 122 points devant Max Verstapen (Red Bul).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Arvid Linblad (Racing Buls) à Shangai.
- Victoire surprise de Oscar Piastry (McLarren) à Monacco.
- Victoire surprise de Taylor Walsh (Haass) à Hermanos Rodrigues.

**2036** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 465 points et 12 victoires, 119 points devant Oscar Piastry (McLarren).
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Victoire surprise de Taylor Walsh (Haass) à Monacco.
- Victoire surprise de Max Verstapen (Red Bul) à Madrit.
- Aston Martyn progresse de la 9e à la 5e place.
- Wiliams progresse de la 10e à la 7e place.
- Audy recule de la 5e à la 10e place.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

**2037** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 453 points et 12 victoires, 158 points devant Oscar Piastry (McLarren).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (16e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Albert Parc.

**2038** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 444 points et 14 victoires, 193 points devant Connor Fletcher (McLarren).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (17e titre de son histoire).

**2039** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 346 points et 6 victoires, 45 points devant Kimi Antoneli (Mercédes).
- La tête du championnat a changé 8 fois.
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Aston Martyn progresse de la 8e à la 5e place.
- Racing Buls recule de la 7e à la 10e place.

**2040** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 408 points et 8 victoires, 14 points devant Connor Fletcher (McLarren).
- Le titre restait ouvert avant la dernière manche.
- McLarren décroche le titre des constructeurs (13e titre de son histoire).
- McLarren signe 7 doublés.
- Racing Buls progresse de la 10e à la 6e place.

**2041** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 429 points et 10 victoires, 90 points devant Oscar Piastry (McLarren).
- Mercédes décroche le titre des constructeurs (18e titre de son histoire).
- Haass progresse de la 11e à la 5e place.

**2042** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 320 points et 3 victoires, 5 points devant Connor Fletcher (McLarren).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Oscar Piastry arrache le titre à Connor Fletcher.
- McLarren décroche le titre des constructeurs (14e titre de son histoire).
- Wiliams recule de la 3e à la 6e place.

**2043** — champion : Connor Fletcher
- Connor Fletcher (McLarren) remporte le titre avec 334 points et 5 victoires, 11 points devant Oscar Piastry (McLarren).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 4 fois.
- McLarren décroche le titre des constructeurs (15e titre de son histoire).
- Victoire surprise de Anna Kessler (Ferrary) à Spielbergh.
- Victoire surprise de Anna Kessler (Ferrary) à Bakou.
- Wiliams progresse de la 6e à la 2e place.

**2044** — champion : Connor Fletcher
- Connor Fletcher (McLarren) remporte le titre avec 347 points et 5 victoires, 81 points devant Magdalena Wimmer (Red Bul).
- McLarren décroche le titre des constructeurs (16e titre de son histoire).
- Red Bul progresse de la 7e à la 4e place.
- Aston Martyn recule de la 5e à la 8e place.
- Haass recule de la 6e à la 9e place.

**2045** — champion : Connor Fletcher
- Connor Fletcher (McLarren) remporte le titre avec 420 points et 12 victoires, 176 points devant George Denholm (Alpyne).
- Une domination sans partage.
- McLarren décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Adrián Aranda (Ferrary) à Hermanos Rodrigues.
- Victoire surprise de Louis Lambert (Cadilac) à Las Vegaz, sous la pluie.
- Alpyne progresse de la 6e à la 3e place.
- Wiliams recule de la 3e à la 6e place.

**2046** — champion : Connor Fletcher
- Connor Fletcher (McLarren) remporte le titre avec 361 points et 5 victoires, 139 points devant Magdalena Wimmer (Red Bul).
- Une domination sans partage.
- McLarren décroche le titre des constructeurs (18e titre de son histoire).
- Victoire surprise de Anna Kessler (Ferrary) à Albert Parc.
- Ferrary progresse de la 7e à la 4e place.
- Aston Martyn progresse de la 10e à la 7e place.
- Wiliams recule de la 6e à la 9e place.

