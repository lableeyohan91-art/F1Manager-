# Rapport d’équilibrage — 50 graines × 20 saisons

Scénario grille-2026, graines 1 à 50, 1000 saisons simulées en 234,3 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 7,3 | 5,0 – 10,0 | 3,0 – 8,0 | 69 % |
| Écuries victorieuses par saison | 5,2 | 3,0 – 8,0 | 2,0 – 5,0 | 56 % |
| Part des victoires de l'écurie dominante | 52 % | 29 % – 79 % | 35 % – 80 % | 72 % |
| Taux d’abandon par départ | 6 % | 3 % – 9 % | 5 % – 15 % | 49 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,12 | 0,56 – 2,02 | 1,50 – 4,00 | 24 % |
| Écart de points entre les deux premiers | 80 | 10 – 174 | — | — |
| Changements de leader du championnat | 3,0 | 0,0 – 7,0 | — | — |
| Doublés par saison (toutes écuries) | 4,1 | 0,0 – 9,0 | — | — |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,81 | 0,56 – 0,96 | — | — |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 0,80 | 0,44 – 1,28 | — | — |
| Victoires inattendues par saison | 1,8 | 0,0 – 5,0 | — | — |
| Courses sous la pluie par saison | 2,8 | 1,0 – 5,0 | — | — |

## Par série de 20 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Champions pilotes différents sur 20 saisons | 5,3 | 3,0 – 9,0 | 3,0 – 7,0 | 82 % |
| Champions constructeurs différents sur 20 saisons | 3,9 | 2,0 – 6,0 | — | — |
| Plus longue série de titres constructeurs consécutifs | 8,1 | 4,0 – 14,0 | — | — |
| Écuries sans aucune victoire sur 20 saisons | 0,3 | 0,0 – 1,0 | — | — |
| Remontées (+3 places ou plus d’une saison à l’autre) | 15,8 | 9,0 – 23,0 | — | — |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 3,0 | 2,4 – 3,7 | — | — |
| Transitions de saison sans aucun changement d’étage (D-081) | 13 % | 5 % – 26 % | — | — |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 71 % | — | 40 % – 90 % | — |
| Séries de 20 saisons avec 5 titres constructeurs consécutifs ou plus | 84 % | — | 0 % – 25 % | — |
| Titre encore ouvert avant la dernière manche (définition exacte) | 21 % | — | — | — |
| Retournement à la dernière manche (le leader perd le titre) | 4 % | — | — | — |
| Champion et vice-champion coéquipiers | 31 % | — | — | — |
| Lutte jusqu’à la dernière manche entre coéquipiers | 7 % | — | — | — |
| Lutte jusqu’à la dernière manche entre écuries différentes | 14 % | — | — | — |
| Saisons très serrées (≤ 10 points d’écart) | 10 % | — | — | — |
| Dominations (≥ 120 points d’écart) | 24 % | — | — | — |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,44 | 0,39 – 0,49 | — | — |
| Coéquipiers : écart moyen dû aux compétences | 0,23 | 0,16 – 0,31 | — | — |
| Coéquipiers : écart moyen dû à la forme | 0,01 | 0,01 – 0,01 | — | — |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,34 – 0,40 | — | — |
| Coéquipiers : part de l’écart quadratique due aux compétences | 28 % | 17 % – 40 % | — | — |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 72 % | 59 % – 84 % | — | — |

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
- Kimi Antoneli (Mercédes) remporte le titre avec 392 points et 7 victoires, 16 points devant Max Verstapen (Red Bul).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 11 fois.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Suzuca.
- Victoire surprise de Oscar Piastry (McLarren) à Spielbergh.
- Victoire surprise de Max Verstapen (Red Bul) à Zandvort, sous la pluie.
- Victoire surprise de Isack Hadjard (Red Bul) à Marinna Bay, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Austen.
- Victoire surprise de Oscar Piastry (McLarren) à Lussail.
- Wiliams recule de la 7e à la 10e place.

**2031** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 380 points et 5 victoires, 22 points devant Oscar Piastry (McLarren).
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Victoire surprise de Oscar Piastry (McLarren) à Shangai.
- Victoire surprise de Lando Noris (McLarren) à Suzuca.
- Victoire surprise de Kimi Antoneli (Mercédes) à Gilles-Villeneuves.
- Victoire surprise de Kimi Antoneli (Mercédes) à Spielbergh.
- Victoire surprise de Oscar Piastry (McLarren) à Madrit, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Marinna Bay, sous la pluie.
- Victoire surprise de Kimi Antoneli (Mercédes) à Austen.
- Victoire surprise de Lukas Vogel (Racing Buls) à Las Vegaz.
- McLarren progresse de la 4e à la 1re place.
- Mercédes recule de la 1re à la 4e place.
- Audy progresse de la 9e à la 6e place.
- Alpyne recule de la 5e à la 9e place.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 442 points et 8 victoires, 96 points devant Kimi Antoneli (Mercédes).
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Victoire surprise de Oscar Piastry (McLarren) à Jedda.
- Victoire surprise de Kimi Antoneli (Mercédes) à Hungarorring.
- Cadilac termine la saison sans marquer le moindre point.

**2033** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 432 points et 11 victoires, 110 points devant Kimi Antoneli (Mercédes).
- Red Bul décroche le titre des constructeurs (8e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Mercédes) à Albert Parc, sous la pluie.
- Victoire surprise de Kimi Antoneli (Mercédes) à Suzuca.
- Victoire surprise de Oliver Bearmann (Haass) à Silverston, sous la pluie.
- Aston Martyn recule de la 8e à la 11e place.

**2034** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 370 points et 7 victoires, 44 points devant Max Verstapen (Red Bul).
- La tête du championnat a changé 5 fois.
- Red Bul décroche le titre des constructeurs (9e titre de son histoire).
- Victoire surprise de Gabriel Bortoletto (Audy) à Suzuca, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Jedda.
- Victoire surprise de Tyler Sawyer (Audy) à Miamy.
- Victoire surprise de Samuel Marlow (Alpyne) à Silverston.
- Victoire surprise de Oscar Piastry (McLarren) à Monzza.
- Victoire surprise de Oscar Piastry (McLarren) à Austen.
- Victoire surprise de Oscar Piastry (McLarren) à Las Vegaz.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Haass recule de la 6e à la 9e place.

**2035** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 426 points et 9 victoires, 129 points devant Max Verstapen (Red Bul).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Oscar Piastry (McLarren) à Monacco.
- Victoire surprise de Oliver Bearmann (Haass) à Madrit, sous la pluie.

**2036** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 489 points et 14 victoires, 124 points devant Oscar Piastry (McLarren).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Victoire surprise de Taylor Walsh (Haass) à Monacco.
- Victoire surprise de Max Verstapen (Red Bul) à Madrit.
- Alpyne progresse de la 8e à la 5e place.
- Wiliams progresse de la 9e à la 6e place.
- Audy recule de la 4e à la 7e place.
- Racing Buls recule de la 6e à la 9e place.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

**2037** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 501 points et 16 victoires, 165 points devant Oscar Piastry (McLarren).
- Une domination sans partage.
- La tête du championnat a changé 5 fois.
- Mercédes décroche le titre des constructeurs (16e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Albert Parc.
- Audy recule de la 7e à la 10e place.
- Haass recule de la 8e à la 11e place.

**2038** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 444 points et 13 victoires, 186 points devant Oscar Piastry (McLarren).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (17e titre de son histoire).
- Alpyne progresse de la 6e à la 2e place.
- Ferrary recule de la 3e à la 7e place.

**2039** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 380 points et 8 victoires, 60 points devant Marco Sartori (Mercédes).
- Mercédes décroche le titre des constructeurs (18e titre de son histoire).
- Aston Martyn progresse de la 10e à la 7e place.
- Alpyne recule de la 2e à la 9e place.

**2040** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 425 points et 8 victoires, 57 points devant Oscar Piastry (McLarren).
- Mercédes décroche le titre des constructeurs (19e titre de son histoire).
- Victoire surprise de Arvid Linblad (Racing Buls) à Austen, sous la pluie.
- Alpyne progresse de la 9e à la 5e place.
- Racing Buls progresse de la 10e à la 7e place.
- Red Bul recule de la 3e à la 9e place.
- Aston Martyn recule de la 7e à la 10e place.

**2041** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 444 points et 11 victoires, 81 points devant Oscar Piastry (McLarren).
- Mercédes décroche le titre des constructeurs (20e titre de son histoire).
- Haass progresse de la 11e à la 4e place.
- Red Bul progresse de la 9e à la 5e place.
- Aston Martyn progresse de la 10e à la 7e place.
- Alpyne recule de la 5e à la 8e place.
- Cadilac recule de la 4e à la 9e place.
- Racing Buls recule de la 7e à la 10e place.
- Ferrary recule de la 6e à la 11e place.

**2042** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 370 points et 7 victoires, 40 points devant Anna Kessler (Wiliams).
- Mercédes décroche le titre des constructeurs (21e titre de son histoire).
- Racing Buls progresse de la 10e à la 6e place.
- Red Bul recule de la 5e à la 10e place.
- Ferrary, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2043** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 350 points et 8 victoires, 30 points devant Anna Kessler (Wiliams).
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Victoire surprise de Taylor Walsh (Haass) à Silverston.
- Victoire surprise de Connor Fletcher (Cadilac) à Madrit.
- Racing Buls recule de la 6e à la 10e place.

**2044** — champion : Anna Kessler
- Anna Kessler (Wiliams) remporte le titre avec 283 points et 5 victoires, 15 points devant Oscar Piastry (McLarren).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 5 fois.
- McLarren décroche le titre des constructeurs (13e titre de son histoire).
- Red Bul progresse de la 9e à la 3e place.
- Mercédes recule de la 2e à la 5e place.
- Racing Buls progresse de la 10e à la 6e place.
- Audy recule de la 5e à la 9e place.
- Cadilac recule de la 6e à la 11e place.

**2045** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 341 points et 7 victoires, 74 points devant Marco Sartori (Mercédes).
- La tête du championnat a changé 6 fois.
- McLarren décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Gabriel Bortoletto (Audy) à Gilles-Villeneuves.
- Victoire surprise de Adrián Aranda (Cadilac) à Spa-Francorchamp.
- Cadilac progresse de la 11e à la 5e place.
- Wiliams recule de la 2e à la 6e place.
- Haass recule de la 4e à la 9e place.

**2046** — champion : Marco Sartori
- Marco Sartori (Mercédes) remporte le titre avec 269 points et 4 victoires, 29 points devant Oscar Piastry (McLarren).
- La tête du championnat a changé 7 fois.
- Audy décroche le titre des constructeurs, le premier de son histoire.
- Victoire surprise de Connor Fletcher (Cadilac) à Shangai, sous la pluie.
- Audy progresse de la 8e à la 1re place.
- Ferrary progresse de la 11e à la 8e place.
- Red Bul recule de la 2e à la 9e place.

