# Rapport d’équilibrage — 50 graines × 20 saisons

Scénario grille-2026, graines 1 à 50, 1000 saisons simulées en 251,5 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 7,7 | 5,0 – 11,0 | 3,0 – 8,0 | 61 % |
| Écuries victorieuses par saison | 5,4 | 3,0 – 8,0 | 2,0 – 5,0 | 51 % |
| Part des victoires de l'écurie dominante | 50 % | 29 % – 75 % | 35 % – 80 % | 69 % |
| Taux d’abandon par départ | 6 % | 4 % – 9 % | 5 % – 15 % | 58 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,12 | 0,56 – 2,02 | 1,50 – 4,00 | 24 % |
| Écart de points entre les deux premiers | 77 | 9 – 168 | — | — |
| Changements de leader du championnat | 3,2 | 0,0 – 7,0 | — | — |
| Doublés par saison (toutes écuries) | 4,1 | 1,0 – 9,0 | — | — |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,80 | 0,55 – 0,96 | — | — |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 0,80 | 0,44 – 1,28 | — | — |
| Victoires inattendues par saison | 1,9 | 0,0 – 4,0 | — | — |
| Courses sous la pluie par saison | 2,8 | 1,0 – 5,0 | — | — |

## Par série de 20 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Champions pilotes différents sur 20 saisons | 6,2 | 3,0 – 9,0 | 3,0 – 7,0 | 66 % |
| Champions constructeurs différents sur 20 saisons | 4,6 | 3,0 – 6,0 | — | — |
| Plus longue série de titres constructeurs consécutifs | 7,4 | 4,0 – 11,0 | — | — |
| Écuries sans aucune victoire sur 20 saisons | 0,2 | 0,0 – 1,0 | — | — |
| Remontées (+3 places ou plus d’une saison à l’autre) | 18,7 | 12,0 – 25,0 | — | — |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 3,3 | 2,7 – 3,9 | — | — |
| Transitions de saison sans aucun changement d’étage (D-081) | 11 % | 0 % – 21 % | — | — |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 79 % | — | 40 % – 90 % | — |
| Séries de 20 saisons avec 5 titres constructeurs consécutifs ou plus | 84 % | — | 0 % – 25 % | — |
| Titre encore ouvert avant la dernière manche (définition exacte) | 26 % | — | — | — |
| Retournement à la dernière manche (le leader perd le titre) | 6 % | — | — | — |
| Champion et vice-champion coéquipiers | 30 % | — | — | — |
| Lutte jusqu’à la dernière manche entre coéquipiers | 9 % | — | — | — |
| Lutte jusqu’à la dernière manche entre écuries différentes | 17 % | — | — | — |
| Saisons très serrées (≤ 10 points d’écart) | 11 % | — | — | — |
| Dominations (≥ 120 points d’écart) | 24 % | — | — | — |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,43 | 0,39 – 0,48 | — | — |
| Coéquipiers : écart moyen dû aux compétences | 0,23 | 0,15 – 0,30 | — | — |
| Coéquipiers : écart moyen dû à la forme | 0,01 | 0,01 – 0,01 | — | — |
| Coéquipiers : écart moyen dû à l’aléa | 0,37 | 0,34 – 0,40 | — | — |
| Coéquipiers : part de l’écart quadratique due aux compétences | 27 % | 15 % – 39 % | — | — |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 73 % | 60 % – 86 % | — | — |

## Chronique d’exemple (graine 1)

**2027** — champion : George Russel
- George Russel (Mercédes) remporte le titre avec 417 points et 8 victoires, 5 points devant Kimi Antoneli (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 4 fois.
- Mercédes décroche le titre des constructeurs (10e titre de son histoire).
- Mercédes signe 8 doublés.
- Victoire surprise de Lando Noris (McLarren) à Shangai, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Sakir.
- Victoire surprise de Max Verstapen (Red Bul) à Austen.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Cadilac termine la saison sans marquer le moindre point.

**2028** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 423 points et 8 victoires, 99 points devant Max Verstapen (Red Bul).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Mercédes signe 5 doublés.
- Audy progresse de la 10e à la 5e place.
- Wiliams recule de la 5e à la 10e place.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 361 points et 5 victoires, 1 point devant Kimi Antoneli (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Max Verstapen arrache le titre à Kimi Antoneli.
- La tête du championnat a changé 10 fois.
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Aston Martyn recule de la 6e à la 11e place.
- Aston Martyn termine la saison sans marquer le moindre point.

**2030** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 395 points et 7 victoires, 33 points devant Kimi Antoneli (Mercédes).
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Suzuca.
- Victoire surprise de Max Verstapen (Red Bul) à Bakou.
- Victoire surprise de Isack Hadjard (Red Bul) à Marinna Bay, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Austen.
- Victoire surprise de Kimi Antoneli (Mercédes) à Las Vegaz.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- McLarren recule de la 1re à la 4e place.
- Aston Martyn progresse de la 11e à la 7e place.
- Cadilac termine la saison sans marquer le moindre point.

**2031** — champion : Charles Leclerq
- Charles Leclerq (Ferrary) remporte le titre avec 337 points et 5 victoires, 3 points devant Kimi Antoneli (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Charles Leclerq arrache le titre à Kimi Antoneli.
- La tête du championnat a changé 10 fois.
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Victoire surprise de Lando Noris (McLarren) à Suzuca.
- Victoire surprise de Max Verstapen (Red Bul) à Jedda.
- Victoire surprise de Kimi Antoneli (Mercédes) à Gilles-Villeneuves.
- Victoire surprise de Max Verstapen (Red Bul) à Zandvort.
- Victoire surprise de Oscar Piastry (McLarren) à Madrit, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Marinna Bay, sous la pluie.
- Victoire surprise de Kimi Antoneli (Mercédes) à Austen.
- McLarren progresse de la 4e à la 1re place.
- Haass progresse de la 10e à la 7e place.
- Alpyne recule de la 6e à la 9e place.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 435 points et 9 victoires, 129 points devant Isack Hadjard (Red Bul).
- Une domination sans partage.
- Red Bul décroche le titre des constructeurs (8e titre de son histoire).
- Victoire surprise de Julia Neumann (Aston Martyn) à Austen.
- Racing Buls recule de la 5e à la 8e place.

**2033** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 433 points et 12 victoires, 165 points devant Oscar Piastry (McLarren).
- Une domination sans partage.
- Red Bul décroche le titre des constructeurs (9e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Mercédes) à Albert Parc, sous la pluie.
- Victoire surprise de Lando Noris (McLarren) à Spa-Francorchamp.
- Victoire surprise de Taylor Walsh (Haass) à Bakou.
- Aston Martyn recule de la 7e à la 10e place.

**2034** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 349 points et 9 victoires, 3 points devant Max Verstapen (Red Bul).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Kimi Antoneli arrache le titre à Max Verstapen.
- La tête du championnat a changé 10 fois.
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Victoire surprise de Gabriel Bortoletto (Audy) à Suzuca, sous la pluie.
- Victoire surprise de Kimi Antoneli (Mercédes) à Spielbergh.
- Victoire surprise de Max Verstapen (Red Bul) à Silverston.
- Victoire surprise de Kimi Antoneli (Mercédes) à Spa-Francorchamp.
- Victoire surprise de Oscar Piastry (McLarren) à Monzza.
- Victoire surprise de Oscar Piastry (McLarren) à Austen.
- Victoire surprise de Romain Moreau (Alpyne) à Interlagoss.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Alpyne progresse de la 9e à la 6e place.
- Haass recule de la 6e à la 9e place.

**2035** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 374 points et 4 victoires, 59 points devant Max Verstapen (Red Bul).
- La tête du championnat a changé 6 fois.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Anna Kessler (Racing Buls) à Albert Parc.
- Victoire surprise de Taylor Walsh (Haass) à Hermanos Rodrigues.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Ferrary recule de la 5e à la 8e place.

**2036** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 482 points et 12 victoires, 141 points devant Oscar Piastry (McLarren).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Mercédes signe 6 doublés.
- Alpyne progresse de la 6e à la 3e place.
- Cadilac progresse de la 10e à la 5e place.
- Wiliams progresse de la 9e à la 6e place.
- Racing Buls recule de la 5e à la 8e place.
- Audy recule de la 3e à la 10e place.

**2037** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 471 points et 13 victoires, 132 points devant Lukas Vogel (Mercédes).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Mercédes signe 8 doublés.
- Victoire surprise de Max Verstapen (Red Bul) à Albert Parc.
- Racing Buls progresse de la 8e à la 4e place.
- Cadilac recule de la 5e à la 8e place.
- Haass recule de la 7e à la 10e place.

**2038** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 452 points et 13 victoires, 176 points devant Oscar Piastry (McLarren).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (16e titre de son histoire).
- Cadilac progresse de la 8e à la 4e place.
- Ferrary, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2039** — champion : Oscar Piastry
- Oscar Piastry (McLarren) remporte le titre avec 355 points et 9 victoires, 51 points devant Kimi Antoneli (Mercédes).
- La tête du championnat a changé 7 fois.
- Mercédes décroche le titre des constructeurs (17e titre de son histoire).
- Wiliams progresse de la 8e à la 5e place.
- Cadilac recule de la 4e à la 7e place.
- Alpyne recule de la 6e à la 10e place.

**2040** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 401 points et 8 victoires, 27 points devant Oscar Piastry (McLarren).
- Mercédes décroche le titre des constructeurs (18e titre de son histoire).
- Victoire surprise de Arvid Linblad (Racing Buls) à Austen, sous la pluie.
- Alpyne progresse de la 10e à la 5e place.

**2041** — champion : Connor Fletcher
- Connor Fletcher (Mercédes) remporte le titre avec 355 points et 5 victoires, 35 points devant Kimi Antoneli (Mercédes).
- La tête du championnat a changé 4 fois.
- Mercédes décroche le titre des constructeurs (19e titre de son histoire).
- Victoire surprise de Anna Kessler (Racing Buls) à Catalunia.
- Wiliams progresse de la 7e à la 3e place.
- Haass progresse de la 11e à la 5e place.
- Aston Martyn progresse de la 10e à la 6e place.
- Racing Buls recule de la 3e à la 7e place.
- Alpyne recule de la 5e à la 8e place.
- Red Bul recule de la 4e à la 9e place.

**2042** — champion : Connor Fletcher
- Connor Fletcher (Mercédes) remporte le titre avec 279 points et 7 victoires, 38 points devant Oscar Piastry (McLarren).
- La tête du championnat a changé 6 fois.
- Mercédes décroche le titre des constructeurs (20e titre de son histoire).
- Ferrary progresse de la 11e à la 8e place.
- Aston Martyn recule de la 6e à la 10e place.

**2043** — champion : Paolo Marchetti
- Paolo Marchetti (Wiliams) remporte le titre avec 350 points et 7 victoires, 54 points devant Connor Fletcher (Mercédes).
- La tête du championnat a changé 4 fois.
- Wiliams décroche le titre des constructeurs (10e titre de son histoire).
- Red Bul progresse de la 9e à la 6e place.

**2044** — champion : Giovanni Lombardi
- Giovanni Lombardi (McLarren) remporte le titre avec 355 points et 4 victoires, 2 points devant Connor Fletcher (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (21e titre de son histoire).
- Red Bul progresse de la 6e à la 3e place.
- Wiliams recule de la 1re à la 5e place.
- Aston Martyn progresse de la 9e à la 6e place.
- Haass recule de la 4e à la 7e place.
- Audy recule de la 7e à la 10e place.

**2045** — champion : Giovanni Lombardi
- Giovanni Lombardi (McLarren) remporte le titre avec 396 points et 8 victoires, 3 points devant Connor Fletcher (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Retournement lors de la dernière manche : Giovanni Lombardi arrache le titre à Connor Fletcher.
- McLarren décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Paolo Marchetti (Wiliams) à Jedda.
- Cadilac progresse de la 11e à la 8e place.
- Aston Martyn recule de la 6e à la 9e place.

**2046** — champion : Giovanni Lombardi
- Giovanni Lombardi (McLarren) remporte le titre avec 402 points et 9 victoires, 36 points devant Connor Fletcher (Mercédes).
- La tête du championnat a changé 4 fois.
- Mercédes décroche le titre des constructeurs (22e titre de son histoire).
- Audy progresse de la 10e à la 6e place.

