# Rapport d’équilibrage — 50 graines × 20 saisons

Scénario grille-2026, graines 1 à 50, 1000 saisons simulées en 103,8 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 6,6 | 5,0 – 9,0 | 3,0 – 8,0 | 89 % |
| Écuries victorieuses par saison | 4,5 | 3,0 – 6,0 | 2,0 – 5,0 | 80 % |
| Part des victoires de l'écurie dominante | 52 % | 33 % – 75 % | 35 % – 80 % | 84 % |
| Taux d’abandon par départ | 7 % | 5 % – 10 % | 5 % – 15 % | 86 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,32 | 0,69 – 2,20 | 1,50 – 4,00 | 36 % |
| Écart de points entre les deux premiers | 67 | 8 – 152 | — | — |
| Changements de leader du championnat | 3,2 | 0,0 – 7,0 | — | — |
| Doublés par saison (toutes écuries) | 4,6 | 1,0 – 9,0 | — | — |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,82 | 0,61 – 0,96 | — | — |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 0,78 | 0,44 – 1,22 | — | — |
| Victoires inattendues par saison | 1,9 | 0,0 – 4,0 | — | — |
| Courses sous la pluie par saison | 2,8 | 1,0 – 5,0 | — | — |

## Par série de 20 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Champions pilotes différents sur 20 saisons | 6,0 | 4,0 – 8,0 | 3,0 – 7,0 | 84 % |
| Champions constructeurs différents sur 20 saisons | 3,7 | 3,0 – 5,0 | — | — |
| Plus longue série de titres constructeurs consécutifs | 7,7 | 4,0 – 12,0 | — | — |
| Écuries sans aucune victoire sur 20 saisons | 1,4 | 0,0 – 3,0 | — | — |
| Remontées (+3 places ou plus d’une saison à l’autre) | 10,1 | 6,0 – 14,0 | — | — |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 2,3 | 1,9 – 2,8 | — | — |
| Transitions de saison sans aucun changement d’étage (D-081) | 20 % | 11 % – 37 % | — | — |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif |
| --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 47 % | — | 40 % – 90 % | — |
| Séries de 20 saisons avec 5 titres constructeurs consécutifs ou plus | 86 % | — | 0 % – 25 % | — |
| Titre encore ouvert avant la dernière manche (définition exacte) | 28 % | — | — | — |
| Retournement à la dernière manche (le leader perd le titre) | 6 % | — | — | — |
| Champion et vice-champion coéquipiers | 32 % | — | — | — |
| Lutte jusqu’à la dernière manche entre coéquipiers | 10 % | — | — | — |
| Lutte jusqu’à la dernière manche entre écuries différentes | 18 % | — | — | — |
| Saisons très serrées (≤ 10 points d’écart) | 12 % | — | — | — |
| Dominations (≥ 120 points d’écart) | 17 % | — | — | — |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,45 | 0,40 – 0,51 | — | — |
| Coéquipiers : écart moyen dû aux compétences | 0,25 | 0,17 – 0,33 | — | — |
| Coéquipiers : écart moyen dû à la forme | 0,01 | 0,01 – 0,01 | — | — |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,34 – 0,39 | — | — |
| Coéquipiers : part de l’écart quadratique due aux compétences | 33 % | 21 % – 46 % | — | — |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 67 % | 53 % – 81 % | — | — |

## Chronique d’exemple (graine 1)

**2027** — champion : George Russel
- George Russel (Mercédes) remporte le titre avec 420 points et 8 victoires, 15 points devant Kimi Antoneli (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (10e titre de son histoire).
- Mercédes signe 8 doublés.
- Victoire surprise de Lando Noris (McLarren) à Shangai, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Sakir.
- Victoire surprise de Max Verstapen (Red Bul) à Austen.
- Victoire surprise de Max Verstapen (Red Bul) à Hermanos Rodrigues.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Cadilac termine la saison sans marquer le moindre point.

**2028** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 348 points et 3 victoires, 18 points devant George Russel (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 6 fois.
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Audy progresse de la 10e à la 6e place.
- Wiliams recule de la 5e à la 10e place.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 368 points et 6 victoires, 29 points devant George Russel (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 4 fois.
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Wiliams progresse de la 10e à la 6e place.
- Audy recule de la 6e à la 9e place.
- Haass termine la saison sans marquer le moindre point.

**2030** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 384 points et 6 victoires, 32 points devant Lewis Hammilton (Ferrary).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 5 fois.
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Suzuca.
- Victoire surprise de George Russel (Mercédes) à Miamy.
- Victoire surprise de Max Verstapen (Red Bul) à Zandvort, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Monzza.
- Victoire surprise de Isack Hadjard (Red Bul) à Marinna Bay, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Austen.
- Victoire surprise de Max Verstapen (Red Bul) à Yas Marinna.
- Ferrary progresse de la 4e à la 1re place.
- Wiliams recule de la 6e à la 9e place.

**2031** — champion : Lewis Hammilton
- Lewis Hammilton (Ferrary) remporte le titre avec 444 points et 8 victoires, 49 points devant Charles Leclerq (Ferrary).
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Ferrary signe 9 doublés.
- Victoire surprise de Max Verstapen (Red Bul) à Jedda.
- Victoire surprise de Kimi Antoneli (Mercédes) à Gilles-Villeneuves.
- Victoire surprise de George Russel (Mercédes) à Yas Marinna.
- Wiliams progresse de la 9e à la 6e place.
- Alpyne recule de la 6e à la 9e place.
- Racing Buls recule de la 7e à la 10e place.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 469 points et 11 victoires, 118 points devant Charles Leclerq (Ferrary).
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Alpyne progresse de la 9e à la 5e place.
- Wiliams recule de la 6e à la 9e place.

**2033** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 479 points et 14 victoires, 119 points devant Charles Leclerq (Ferrary).
- Red Bul décroche le titre des constructeurs (8e titre de son histoire).
- Aston Martyn recule de la 7e à la 10e place.

**2034** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 406 points et 7 victoires, 28 points devant Charles Leclerq (Ferrary).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 7 fois.
- Ferrary décroche le titre des constructeurs (19e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Suzuca, sous la pluie.
- Victoire surprise de Kimi Antoneli (Mercédes) à Spielbergh.
- Victoire surprise de Max Verstapen (Red Bul) à Spa-Francorchamp.
- Victoire surprise de Oscar Piastry (McLarren) à Monzza.

**2035** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 403 points et 10 victoires, 42 points devant George Russel (Mercédes).
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Monzza.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Mercédes progresse de la 4e à la 1re place.
- Ferrary recule de la 1re à la 4e place.
- Haass recule de la 7e à la 11e place.

**2036** — champion : Lando Noris
- Lando Noris (McLarren) remporte le titre avec 375 points et 5 victoires, 13 points devant Kimi Antoneli (Mercédes).
- Retournement lors de la dernière manche : Lando Noris arrache le titre à Kimi Antoneli.
- La tête du championnat a changé 8 fois.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Shangai.
- Victoire surprise de Max Verstapen (Red Bul) à Hermanos Rodrigues.
- Audy recule de la 5e à la 9e place.
- Haass termine la saison sans marquer le moindre point.
- Racing Buls termine la saison sans marquer le moindre point.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

**2037** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 378 points et 8 victoires, 16 points devant Lando Noris (McLarren).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 6 fois.
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Albert Parc.
- Cadilac recule de la 7e à la 10e place.
- Haass termine la saison sans marquer le moindre point.

**2038** — champion : George Russel
- George Russel (Mercédes) remporte le titre avec 384 points et 8 victoires, 46 points devant Kimi Antoneli (Mercédes).
- Mercédes décroche le titre des constructeurs (16e titre de son histoire).
- Mercédes signe 6 doublés.
- Cadilac progresse de la 10e à la 7e place.
- Haass termine la saison sans marquer le moindre point.

**2039** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 382 points et 7 victoires, 21 points devant Oscar Piastry (McLarren).
- Le titre restait ouvert avant la dernière manche.
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- McLarren signe 5 doublés.
- Mercédes recule de la 1re à la 4e place.
- Alpyne recule de la 4e à la 9e place.

**2040** — champion : Lando Noris
- Lando Noris (McLarren) remporte le titre avec 449 points et 11 victoires, 72 points devant Max Verstapen (Red Bul).
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Victoire surprise de Nicolas Marchand (Cadilac) à Austen, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Hermanos Rodrigues.
- Audy recule de la 7e à la 10e place.
- Audy termine la saison sans marquer le moindre point.
- Racing Buls termine la saison sans marquer le moindre point.

**2041** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 430 points et 11 victoires, 23 points devant Kimi Antoneli (Mercédes).
- La tête du championnat a changé 4 fois.
- Red Bul décroche le titre des constructeurs (9e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Spielbergh.
- Victoire surprise de Max Verstapen (Red Bul) à Spa-Francorchamp.
- Aston Martyn progresse de la 6e à la 3e place.
- McLarren recule de la 1re à la 4e place.

**2042** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 409 points et 11 victoires, 155 points devant Oliver Bearmann (Aston Martyn).
- Une domination sans partage.
- Red Bul décroche le titre des constructeurs (10e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Suzuca.
- Victoire surprise de Gabriel Bortoletto (Red Bul) à Lussail.
- Audy progresse de la 10e à la 3e place.
- Mercédes recule de la 2e à la 9e place.
- Racing Buls termine la saison sans marquer le moindre point.

**2043** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 548 points et 17 victoires, 290 points devant Stefano Carraro (McLarren).
- Une domination sans partage.
- Red Bul décroche le titre des constructeurs (11e titre de son histoire).
- Red Bul signe 5 doublés.
- McLarren progresse de la 5e à la 2e place.
- Wiliams progresse de la 6e à la 3e place.
- Haass progresse de la 10e à la 5e place.
- Aston Martyn recule de la 2e à la 7e place.

**2044** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 481 points et 13 victoires, 144 points devant Stefano Carraro (McLarren).
- Une domination sans partage.
- Red Bul décroche le titre des constructeurs (12e titre de son histoire).
- Red Bul signe 6 doublés.
- Mercédes progresse de la 11e à la 8e place.

**2045** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 496 points et 15 victoires, 212 points devant Stefano Carraro (McLarren).
- Une domination sans partage.
- Red Bul décroche le titre des constructeurs (13e titre de son histoire).
- Alpyne progresse de la 6e à la 2e place.
- Haass recule de la 3e à la 10e place.

**2046** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 472 points et 15 victoires, 194 points devant Isack Hadjard (Alpyne).
- Une domination sans partage.
- Red Bul décroche le titre des constructeurs (14e titre de son histoire).
- Aston Martyn progresse de la 8e à la 5e place.
- Wiliams recule de la 5e à la 9e place.
- Racing Buls termine la saison sans marquer le moindre point.
- Mercédes, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

