# Rapport d’équilibrage — 50 graines × 20 saisons

Scénario grille-2026, graines 1 à 50, 1000 saisons simulées en 257,4 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 7,8 | 5,0 – 11,0 | 3,0 – 8,0 | 59 % | 6,8 |
| Écuries victorieuses par saison | 5,5 | 3,0 – 8,0 | 2,0 – 5,0 | 49 % | 4,7 |
| Part des victoires de l'écurie dominante | 49 % | 29 % – 75 % | 35 % – 80 % | 66 % | 51 % |
| Taux d’abandon par départ | 6 % | 3 % – 9 % | 5 % – 15 % | 54 % | 7 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,12 | 0,56 – 2,02 | 1,50 – 4,00 | 24 % | 1,17 |
| Écart de points entre les deux premiers | 70 | 10 – 156 | — | — | 66 |
| Changements de leader du championnat | 3,3 | 0,0 – 7,0 | — | — | 3,2 |
| Doublés par saison (toutes écuries) | 4,2 | 1,0 – 9,0 | — | — | 4,4 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,80 | 0,56 – 0,96 | — | — | 0,77 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 0,80 | 0,44 – 1,28 | — | — | 0,79 |
| Victoires inattendues par saison | 1,9 | 0,0 – 4,0 | — | — | 2,1 |
| Courses sous la pluie par saison | 2,8 | 1,0 – 5,0 | — | — | 2,8 |

## Par série de 20 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 20 saisons | 6,5 | 4,0 – 9,0 | 3,0 – 7,0 | 78 % | 5,9 |
| Champions constructeurs différents sur 20 saisons | 4,8 | 3,0 – 7,0 | — | — | 4,0 |
| Plus longue série de titres constructeurs consécutifs | 7,3 | 4,0 – 11,0 | — | — | 7,3 |
| Écuries sans aucune victoire sur 20 saisons | 0,2 | — | — | — | 0,8 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 19,4 | 15,0 – 26,0 | — | — | 12,9 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 3,3 | 2,8 – 3,9 | — | — | 2,6 |
| Transitions de saison sans aucun changement d’étage (D-081) | 10 % | 0 % – 16 % | — | — | 16 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 78 % | — | 40 % – 90 % | — | 58 % |
| Séries de 20 saisons avec 5 titres constructeurs consécutifs ou plus | 80 % | — | 0 % – 25 % | — | 88 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 28 % | — | — | — | 30 % |
| Retournement à la dernière manche (le leader perd le titre) | 6 % | — | — | — | 5 % |
| Champion et vice-champion coéquipiers | 32 % | — | — | — | 33 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 10 % | — | — | — | 12 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 18 % | — | — | — | 18 % |
| Saisons très serrées (≤ 10 points d’écart) | 11 % | — | — | — | 12 % |
| Dominations (≥ 120 points d’écart) | 19 % | — | — | — | 17 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,43 | 0,38 – 0,48 | — | — | 0,46 |
| Coéquipiers : écart moyen dû aux compétences | 0,22 | 0,15 – 0,30 | — | — | 0,26 |
| Coéquipiers : écart moyen dû à la forme | 0,01 | 0,01 – 0,01 | — | — | 0,01 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,34 – 0,40 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 26 % | 15 % – 39 % | — | — | 34 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 74 % | 61 % – 87 % | — | — | 66 % |

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
- Kimi Antoneli (Mercédes) remporte le titre avec 433 points et 8 victoires, 85 points devant Max Verstapen (Red Bul).
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Mercédes signe 5 doublés.
- Audy progresse de la 10e à la 5e place.
- Wiliams recule de la 5e à la 10e place.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 372 points et 5 victoires, 7 points devant Kimi Antoneli (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Cadilac termine la saison sans marquer le moindre point.

**2030** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 369 points et 6 victoires, 9 points devant Kimi Antoneli (Mercédes).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Suzuca.
- Victoire surprise de Max Verstapen (Red Bul) à Zandvort, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Bakou.
- Victoire surprise de Isack Hadjard (Red Bul) à Marinna Bay, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Austen.
- Victoire surprise de Kimi Antoneli (Mercédes) à Las Vegaz.
- Ferrary progresse de la 4e à la 1re place.
- McLarren recule de la 1re à la 4e place.
- Audy recule de la 6e à la 9e place.
- Cadilac termine la saison sans marquer le moindre point.

**2031** — champion : Lukas Vogel
- Lukas Vogel (Ferrary) remporte le titre avec 372 points et 9 victoires, 59 points devant Charles Leclerq (Ferrary).
- La tête du championnat a changé 9 fois.
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Victoire surprise de Lando Noris (McLarren) à Suzuca.
- Victoire surprise de Max Verstapen (Red Bul) à Jedda.
- Victoire surprise de Oscar Piastry (McLarren) à Madrit, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Marinna Bay, sous la pluie.
- Alpyne recule de la 6e à la 9e place.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 420 points et 8 victoires, 78 points devant Lukas Vogel (Ferrary).
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Racing Buls recule de la 5e à la 8e place.

**2033** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 412 points et 9 victoires, 118 points devant Lukas Vogel (Ferrary).
- Red Bul décroche le titre des constructeurs (8e titre de son histoire).
- Victoire surprise de Kimi Antoneli (Mercédes) à Albert Parc, sous la pluie.
- Victoire surprise de Lando Noris (McLarren) à Spa-Francorchamp.
- Victoire surprise de Taylor Walsh (Haass) à Bakou.
- Wiliams termine la saison sans marquer le moindre point.

**2034** — champion : Lukas Vogel
- Lukas Vogel (Ferrary) remporte le titre avec 332 points et 9 victoires, 14 points devant Kimi Antoneli (Mercédes).
- La tête du championnat a changé 7 fois.
- Red Bul décroche le titre des constructeurs (9e titre de son histoire).
- Victoire surprise de Connor Fletcher (Aston Martyn) à Suzuca, sous la pluie.
- Victoire surprise de Kimi Antoneli (Mercédes) à Spielbergh.
- Victoire surprise de Oscar Piastry (McLarren) à Monzza.
- Alpyne progresse de la 10e à la 7e place.
- Haass recule de la 5e à la 8e place.
- Racing Buls recule de la 8e à la 11e place.

**2035** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 337 points et 4 victoires, 69 points devant Anna Kessler (Ferrary).
- La tête du championnat a changé 7 fois.
- Ferrary décroche le titre des constructeurs (19e titre de son histoire).
- Victoire surprise de Connor Fletcher (Aston Martyn) à Spielbergh.
- Victoire surprise de Connor Fletcher (Aston Martyn) à Monzza.
- Victoire surprise de Taylor Walsh (Haass) à Hermanos Rodrigues.
- Racing Buls progresse de la 11e à la 7e place.

**2036** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 420 points et 11 victoires, 122 points devant Oscar Piastry (McLarren).
- Une domination sans partage.
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Alpyne progresse de la 8e à la 5e place.
- Wiliams progresse de la 9e à la 6e place.
- Red Bul recule de la 2e à la 7e place.
- Cadilac progresse de la 11e à la 8e place.
- Racing Buls recule de la 7e à la 10e place.
- Audy recule de la 6e à la 11e place.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

**2037** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 426 points et 11 victoires, 115 points devant Anna Kessler (Ferrary).
- La tête du championnat a changé 4 fois.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Mikko Rantanen (Aston Martyn) à Sakir.
- Victoire surprise de Connor Fletcher (Aston Martyn) à Spielbergh, sous la pluie.
- Victoire surprise de Adrián Aranda (Cadilac) à Las Vegaz.

**2038** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 381 points et 8 victoires, 85 points devant Anna Kessler (Ferrary).
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Samuel Marlow (Audy) à Shangai, sous la pluie.
- Victoire surprise de Connor Fletcher (Aston Martyn) à Hermanos Rodrigues.
- Cadilac progresse de la 7e à la 2e place.

**2039** — champion : Anna Kessler
- Anna Kessler (Ferrary) remporte le titre avec 343 points et 4 victoires, 46 points devant Oscar Piastry (McLarren).
- La tête du championnat a changé 4 fois.
- Aston Martyn décroche le titre des constructeurs, le premier de son histoire.
- Victoire surprise de Adrián Aranda (Cadilac) à Spielbergh.
- Aston Martyn progresse de la 4e à la 1re place.
- Mercédes recule de la 1re à la 4e place.

**2040** — champion : Connor Fletcher
- Connor Fletcher (Aston Martyn) remporte le titre avec 344 points et 6 victoires, 26 points devant Anna Kessler (Ferrary).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 8 fois.
- Aston Martyn décroche le titre des constructeurs (2e titre de son histoire).
- Victoire surprise de Adrián Aranda (Cadilac) à Albert Parc.
- Victoire surprise de Mikko Rantanen (Aston Martyn) à Suzuca.
- Victoire surprise de Connor Fletcher (Aston Martyn) à Spielbergh.
- Victoire surprise de Arvid Linblad (Racing Buls) à Austen, sous la pluie.
- McLarren progresse de la 5e à la 2e place.
- Cadilac recule de la 3e à la 7e place.

**2041** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 275 points et 4 victoires, 17 points devant Connor Fletcher (Aston Martyn).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Victoire surprise de Adrián Aranda (Cadilac) à Suzuca.
- Victoire surprise de Gabriel Bortoletto (Cadilac) à Yas Marinna, sous la pluie.
- Mercédes progresse de la 4e à la 1re place.
- Haass progresse de la 10e à la 7e place.
- Audy progresse de la 11e à la 8e place.
- Red Bul recule de la 6e à la 9e place.
- Alpyne recule de la 8e à la 11e place.

**2042** — champion : Connor Fletcher
- Connor Fletcher (Aston Martyn) remporte le titre avec 383 points et 7 victoires, 67 points devant Anna Kessler (Ferrary).
- La tête du championnat a changé 4 fois.
- Aston Martyn décroche le titre des constructeurs (3e titre de son histoire).
- Ferrary progresse de la 5e à la 2e place.
- Mercédes recule de la 1re à la 6e place.
- Alpyne progresse de la 11e à la 8e place.

**2043** — champion : Simone Moretti
- Simone Moretti (Wiliams) remporte le titre avec 405 points et 11 victoires, 74 points devant Connor Fletcher (Aston Martyn).
- Wiliams décroche le titre des constructeurs (10e titre de son histoire).
- Victoire surprise de Adrián Aranda (Cadilac) à Hungarorring.
- Victoire surprise de Anna Kessler (Ferrary) à Bakou.
- Victoire surprise de Adrián Aranda (Cadilac) à Las Vegaz.
- Red Bul progresse de la 10e à la 6e place.
- Mercédes recule de la 6e à la 9e place.

**2044** — champion : Giovanni Lombardi
- Giovanni Lombardi (Mercédes) remporte le titre avec 303 points et 4 victoires, 44 points devant Connor Fletcher (Aston Martyn).
- La tête du championnat a changé 5 fois.
- Aston Martyn décroche le titre des constructeurs (4e titre de son histoire).
- Victoire surprise de Anna Kessler (Ferrary) à Austen.
- Mercédes progresse de la 9e à la 3e place.
- Wiliams recule de la 1re à la 4e place.
- Alpyne progresse de la 8e à la 5e place.
- Racing Buls progresse de la 11e à la 8e place.
- Cadilac recule de la 5e à la 11e place.

**2045** — champion : Giovanni Lombardi
- Giovanni Lombardi (Mercédes) remporte le titre avec 367 points et 7 victoires, 71 points devant Connor Fletcher (Aston Martyn).
- La tête du championnat a changé 5 fois.
- Aston Martyn décroche le titre des constructeurs (5e titre de son histoire).
- Cadilac progresse de la 11e à la 6e place.
- Ferrary recule de la 6e à la 10e place.

**2046** — champion : Giovanni Lombardi
- Giovanni Lombardi (Mercédes) remporte le titre avec 414 points et 8 victoires, 105 points devant Connor Fletcher (Aston Martyn).
- La tête du championnat a changé 4 fois.
- Aston Martyn décroche le titre des constructeurs (6e titre de son histoire).
- Victoire surprise de Adrián Aranda (Cadilac) à Lussail.
- Ferrary progresse de la 10e à la 7e place.
- Wiliams recule de la 5e à la 11e place.

