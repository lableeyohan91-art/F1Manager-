# Rapport d’équilibrage — 100 graines × 10 saisons

Scénario grille-2026, graines 1 à 100, 1000 saisons simulées en 206,4 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 6,3 | 4,0 – 9,0 | 3,0 – 8,0 | 86 % | 6,0 |
| Écuries victorieuses par saison | 4,2 | 3,0 – 6,0 | 2,0 – 5,0 | 82 % | 3,9 |
| Part des victoires de l'écurie dominante | 59 % | 38 % – 83 % | 35 % – 80 % | 78 % | 57 % |
| Taux d’abandon par départ | 7 % | 5 % – 10 % | 5 % – 15 % | 83 % | 8 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,52 | 0,91 – 2,24 | 1,50 – 4,00 | 48 % | 1,56 |
| Écart de points entre les deux premiers | 72 | 9 – 158 | — | — | 53 |
| Changements de leader du championnat | 2,8 | 0,0 – 7,0 | — | — | 3,4 |
| Doublés par saison (toutes écuries) | 6,1 | 2,0 – 11,0 | — | — | 6,1 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,90 | 0,79 – 0,97 | — | — | 0,90 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 1,02 | 0,67 – 1,40 | — | — | 1,00 |
| Victoires inattendues par saison | 2,1 | 0,0 – 5,0 | — | — | 2,3 |
| Courses sous la pluie par saison | 2,7 | 1,0 – 5,0 | — | — | 2,7 |

## Par série de 10 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 10 saisons | 3,2 | 2,0 – 5,0 | 3,0 – 7,0 | 70 % | 3,9 |
| Champions constructeurs différents sur 10 saisons | 2,3 | 1,0 – 3,0 | — | — | 2,4 |
| Plus longue série de titres constructeurs consécutifs | 6,2 | 3,0 – 10,0 | — | — | 5,9 |
| Écuries sans aucune victoire sur 10 saisons | 2,8 | 1,0 – 4,0 | — | — | 4,8 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 5,4 | 2,0 – 9,0 | — | — | 3,5 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 2,4 | 1,7 – 3,2 | — | — | 1,9 |
| Transitions de saison sans aucun changement d’étage (D-081) | 17 % | 0 % – 33 % | — | — | 23 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 64 % | — | 40 % – 90 % | — | 43 % |
| Séries de 10 saisons avec 5 titres constructeurs consécutifs ou plus | 66 % | — | 0 % – 25 % | — | 66 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 27 % | — | — | — | 35 % |
| Retournement à la dernière manche (le leader perd le titre) | 5 % | — | — | — | 6 % |
| Champion et vice-champion coéquipiers | 46 % | — | — | — | 49 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 13 % | — | — | — | 17 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 14 % | — | — | — | 18 % |
| Saisons très serrées (≤ 10 points d’écart) | 11 % | — | — | — | 14 % |
| Dominations (≥ 120 points d’écart) | 20 % | — | — | — | 9 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,42 | 0,38 – 0,47 | — | — | 0,45 |
| Coéquipiers : écart moyen dû aux compétences | 0,21 | 0,14 – 0,28 | — | — | 0,24 |
| Coéquipiers : écart moyen dû à la forme | 0,01 | 0,01 – 0,01 | — | — | 0,01 |
| Coéquipiers : écart moyen dû à l’aléa | 0,37 | 0,34 – 0,40 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 24 % | 14 % – 37 % | — | — | 32 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 76 % | 63 % – 88 % | — | — | 69 % |

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

