# Rapport d’équilibrage — 50 graines × 20 saisons

Scénario grille-2026, graines 1 à 50, 1000 saisons simulées en 361,5 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 7,5 | 5,0 – 10,0 | 3,0 – 8,0 | 66 % |
| Écuries victorieuses par saison | 5,2 | 3,0 – 8,0 | 2,0 – 5,0 | 56 % |
| Part des victoires de l'écurie dominante | 51 % | 29 % – 79 % | 35 % – 80 % | 70 % |
| Taux d’abandon par départ | 5 % | 3 % – 9 % | 5 % – 15 % | 47 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,12 | 0,56 – 2,02 | 1,50 – 4,00 | 24 % |
| Écart de points entre les deux premiers | 77 | 10 – 164 | — | — |
| Changements de leader du championnat | 3,0 | 0,0 – 7,0 | — | — |
| Doublés par saison (toutes écuries) | 4,2 | 1,0 – 9,0 | — | — |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,82 | 0,62 – 0,96 | — | — |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 0,80 | 0,44 – 1,28 | — | — |
| Victoires inattendues par saison | 1,8 | 0,0 – 5,0 | — | — |
| Courses sous la pluie par saison | 2,8 | 1,0 – 5,0 | — | — |

## Par série de 20 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Champions pilotes différents sur 20 saisons | 5,7 | 3,0 – 8,0 | 3,0 – 7,0 | 80 % |
| Champions constructeurs différents sur 20 saisons | 4,2 | 2,0 – 6,0 | — | — |
| Plus longue série de titres constructeurs consécutifs | 8,2 | 4,0 – 15,0 | — | — |
| Écuries sans aucune victoire sur 20 saisons | 0,4 | 0,0 – 1,0 | — | — |
| Remontées (+3 places ou plus d’une saison à l’autre) | 16,6 | 11,0 – 23,0 | — | — |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 3,1 | 2,6 – 3,6 | — | — |
| Transitions de saison sans aucun changement d’étage (D-081) | 11 % | 5 % – 21 % | — | — |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 75 % | — | 40 % – 90 % | — |
| Séries de 20 saisons avec 5 titres constructeurs consécutifs ou plus | 84 % | — | 0 % – 25 % | — |
| Titre encore ouvert avant la dernière manche (définition exacte) | 23 % | — | — | — |
| Retournement à la dernière manche (le leader perd le titre) | 6 % | — | — | — |
| Champion et vice-champion coéquipiers | 32 % | — | — | — |
| Lutte jusqu’à la dernière manche entre coéquipiers | 8 % | — | — | — |
| Lutte jusqu’à la dernière manche entre écuries différentes | 16 % | — | — | — |
| Saisons très serrées (≤ 10 points d’écart) | 10 % | — | — | — |
| Dominations (≥ 120 points d’écart) | 22 % | — | — | — |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,43 | 0,38 – 0,47 | — | — |
| Coéquipiers : écart moyen dû aux compétences | 0,22 | 0,16 – 0,29 | — | — |
| Coéquipiers : écart moyen dû à la forme | 0,01 | 0,01 – 0,01 | — | — |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,34 – 0,39 | — | — |
| Coéquipiers : part de l’écart quadratique due aux compétences | 26 % | 16 % – 36 % | — | — |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 74 % | 62 % – 86 % | — | — |

## Compétitivité à toutes les positions (D-113)

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Pilotes : mobilité — corrélation classement à 25 % ↔ final | 0,88 | 0,80 – 0,95 | — | — |
| Pilotes : mobilité — corrélation classement à 50 % ↔ final | 0,95 | 0,91 – 0,98 | — | — |
| Pilotes : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,96 – 0,99 | — | — |
| Pilotes : déplacement moyen entre la mi-saison et la fin (places) | 1,39 | 0,82 – 2,00 | — | — |
| Pilotes : part gagnant ou perdant ≥ 2 places en seconde moitié | 36 % | 18 % – 55 % | — | — |
| Pilotes : changements de position par concurrent sur la saison | 8,8 | 6,0 – 11,3 | — | — |
| Pilotes : écart moyen entre voisins (points) — haut | 44,8 | 25,2 – 65,2 | — | — |
| Pilotes : écart moyen entre voisins (points) — milieu | 18,8 | 10,4 – 30,6 | — | — |
| Pilotes : écart moyen entre voisins (points) — bas | 5,1 | 1,6 – 8,3 | — | — |
| Pilotes : frontières mathématiquement disputées à 3 manches de la fin | 95 % | 90 % – 100 % | — | — |
| Pilotes : frontières raisonnablement disputées à 3 manches — toutes | 74 % | 67 % – 81 % | — | — |
| Pilotes : frontières raisonnablement disputées — haut | 38 % | 20 % – 60 % | — | — |
| Pilotes : frontières raisonnablement disputées — milieu | 71 % | 57 % – 86 % | — | — |
| Pilotes : frontières raisonnablement disputées — bas | 97 % | 89 % – 100 % | — | — |
| Pilotes : positions déjà acquises à 3 manches de la fin | 2 % | 0 % – 5 % | — | — |
| Pilotes : positions déjà acquises — haut | 9 % | 0 % – 20 % | — | — |
| Pilotes : positions déjà acquises — milieu | 0 % | 0 % – 0 % | — | — |
| Pilotes : positions déjà acquises — bas | 0 % | — | — | — |
| Pilotes : positions stables mais disputées (voisin à moins d’une victoire) | 37 % | 18 % – 59 % | — | — |
| Pilotes : positions isolées (voisins à plus de 3 victoires) | 3 % | 0 % – 5 % | — | — |
| Constructeurs : mobilité — corrélation classement à 25 % ↔ final | 0,90 | 0,81 – 0,98 | — | — |
| Constructeurs : mobilité — corrélation classement à 50 % ↔ final | 0,95 | 0,90 – 0,99 | — | — |
| Constructeurs : mobilité — corrélation classement à 75 % ↔ final | 0,98 | 0,95 – 1,00 | — | — |
| Constructeurs : déplacement moyen entre la mi-saison et la fin (places) | 0,56 | 0,18 – 0,91 | — | — |
| Constructeurs : part gagnant ou perdant ≥ 2 places en seconde moitié | 11 % | 0 % – 27 % | — | — |
| Constructeurs : changements de position par concurrent sur la saison | 5,2 | 2,9 – 7,6 | — | — |
| Constructeurs : écart moyen entre voisins (points) — haut | 117,6 | 54,3 – 184,3 | — | — |
| Constructeurs : écart moyen entre voisins (points) — milieu | 33,7 | 16,8 – 52,5 | — | — |
| Constructeurs : écart moyen entre voisins (points) — bas | 18,9 | 3,0 – 41,5 | — | — |
| Constructeurs : frontières mathématiquement disputées à 3 manches de la fin | 87 % | 80 % – 100 % | — | — |
| Constructeurs : frontières raisonnablement disputées à 3 manches — toutes | 54 % | 40 % – 70 % | — | — |
| Constructeurs : frontières raisonnablement disputées — haut | 27 % | 0 % – 50 % | — | — |
| Constructeurs : frontières raisonnablement disputées — milieu | 67 % | 50 % – 100 % | — | — |
| Constructeurs : frontières raisonnablement disputées — bas | 84 % | 50 % – 100 % | — | — |
| Constructeurs : positions déjà acquises à 3 manches de la fin | 6 % | 0 % – 18 % | — | — |
| Constructeurs : positions déjà acquises — haut | 18 % | 0 % – 50 % | — | — |
| Constructeurs : positions déjà acquises — milieu | 0 % | — | — | — |
| Constructeurs : positions déjà acquises — bas | 0 % | — | — | — |
| Constructeurs : positions stables mais disputées (voisin à moins d’une victoire) | 47 % | 27 % – 73 % | — | — |
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

**2037** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 496 points et 15 victoires, 159 points devant Oscar Piastry (McLarren).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (16e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Albert Parc.

**2038** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 459 points et 14 victoires, 164 points devant Connor Fletcher (Wiliams).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Samuel Marlow (Racing Buls) à Shangai, sous la pluie.
- Red Bul progresse de la 6e à la 3e place.

**2039** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 375 points et 8 victoires, 41 points devant Kimi Antoneli (Mercédes).
- La tête du championnat a changé 4 fois.
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Victoire surprise de Adrián Aranda (Audy) à Gilles-Villeneuves.
- McLarren progresse de la 4e à la 1re place.
- Aston Martyn progresse de la 10e à la 7e place.
- Alpyne recule de la 6e à la 9e place.
- Racing Buls recule de la 7e à la 11e place.

**2040** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 438 points et 10 victoires, 76 points devant Oscar Piastry (McLarren).
- Mercédes décroche le titre des constructeurs (18e titre de son histoire).
- Racing Buls progresse de la 11e à la 6e place.
- Audy recule de la 6e à la 10e place.
- Cadilac recule de la 8e à la 11e place.

**2041** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 436 points et 10 victoires, 80 points devant Oscar Piastry (McLarren).
- Mercédes décroche le titre des constructeurs (19e titre de son histoire).
- Haass progresse de la 9e à la 4e place.
- Racing Buls recule de la 6e à la 9e place.
- Alpyne recule de la 7e à la 10e place.

**2042** — champion : Connor Fletcher
- Connor Fletcher (Wiliams) remporte le titre avec 351 points et 8 victoires, 17 points devant Oscar Piastry (McLarren).
- McLarren décroche le titre des constructeurs (12e titre de son histoire).

**2043** — champion : Connor Fletcher
- Connor Fletcher (Wiliams) remporte le titre avec 429 points et 10 victoires, 119 points devant Oscar Piastry (McLarren).
- La tête du championnat a changé 5 fois.
- Wiliams décroche le titre des constructeurs (10e titre de son histoire).
- Victoire surprise de Niklas Winkler (Alpyne) à Catalunia.
- Victoire surprise de Taylor Walsh (Haass) à Silverston.
- Alpyne progresse de la 10e à la 5e place.
- Ferrary recule de la 5e à la 10e place.

**2044** — champion : Connor Fletcher
- Connor Fletcher (Wiliams) remporte le titre avec 328 points et 8 victoires, 0 point devant Anna Kessler (Red Bul).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Connor Fletcher arrache le titre à Anna Kessler.
- La tête du championnat a changé 10 fois.
- Wiliams décroche le titre des constructeurs (11e titre de son histoire).
- Red Bul progresse de la 6e à la 2e place.
- Racing Buls progresse de la 11e à la 6e place.
- Ferrary progresse de la 10e à la 7e place.
- Haass recule de la 4e à la 10e place.

**2045** — champion : Giovanni Lombardi
- Giovanni Lombardi (Mercédes) remporte le titre avec 407 points et 9 victoires, 113 points devant Connor Fletcher (Wiliams).
- La tête du championnat a changé 6 fois.
- Mercédes décroche le titre des constructeurs (20e titre de son histoire).
- Victoire surprise de Paolo Marchetti (Audy) à Shangai.
- Mercédes progresse de la 4e à la 1re place.
- Cadilac progresse de la 11e à la 8e place.
- Ferrary recule de la 7e à la 11e place.

**2046** — champion : Giovanni Lombardi
- Giovanni Lombardi (Mercédes) remporte le titre avec 464 points et 12 victoires, 274 points devant Anna Kessler (Red Bul).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (21e titre de son histoire).
- Audy progresse de la 6e à la 3e place.
- Wiliams recule de la 2e à la 5e place.
- McLarren recule de la 3e à la 6e place.

