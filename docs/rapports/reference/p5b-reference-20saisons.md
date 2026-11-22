# Rapport d’équilibrage — 50 graines × 20 saisons

Scénario grille-2026, graines 1 à 50, 1000 saisons simulées en 154,5 s. Généré par `npm run equilibrage`.

> Rappel (D-040) : ce sont des **objectifs statistiques**, pas des limites. Le moteur ne lit aucun de ces indicateurs.

## Par saison

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Vainqueurs de Grand Prix différents par saison | 6,8 | 5,0 – 9,0 | 3,0 – 8,0 | 81 % | 6,8 |
| Écuries victorieuses par saison | 4,7 | 3,0 – 7,0 | 2,0 – 5,0 | 70 % | 4,7 |
| Part des victoires de l'écurie dominante | 51 % | 33 % – 75 % | 35 % – 80 % | 80 % | 52 % |
| Taux d’abandon par départ | 7 % | 5 % – 10 % | 5 % – 15 % | 84 % | 7 % |
| Écart de performance 1re–dernière voiture (% temps au tour) | 1,17 | 0,60 – 2,03 | 1,50 – 4,00 | 26 % | 1,16 |
| Écart de points entre les deux premiers | 66 | 8 – 149 | — | — | 67 |
| Changements de leader du championnat | 3,2 | 0,0 – 7,0 | — | — | 3,2 |
| Doublés par saison (toutes écuries) | 4,4 | 1,0 – 9,0 | — | — | 4,5 |
| Corrélation voiture ↔ points constructeurs (Spearman) | 0,77 | 0,48 – 0,95 | — | — | 0,77 |
| Plus forte progression d’une voiture dans la saison (points d’indice) | 0,79 | 0,45 – 1,26 | — | — | 0,79 |
| Victoires inattendues par saison | 2,1 | 0,0 – 5,0 | — | — | 2,1 |
| Courses sous la pluie par saison | 2,8 | 1,0 – 5,0 | — | — | 2,8 |

## Par série de 20 saisons

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Champions pilotes différents sur 20 saisons | 5,9 | 4,0 – 8,0 | 3,0 – 7,0 | 84 % | 6,2 |
| Champions constructeurs différents sur 20 saisons | 4,0 | 3,0 – 5,0 | — | — | 4,0 |
| Plus longue série de titres constructeurs consécutifs | 7,3 | 4,0 – 11,0 | — | — | 7,4 |
| Écuries sans aucune victoire sur 20 saisons | 0,8 | 0,0 – 2,0 | — | — | 0,9 |
| Remontées (+3 places ou plus d’une saison à l’autre) | 12,9 | 9,0 – 20,0 | — | — | 12,2 |
| Écuries changeant d’étage par saison (étages 1–4 / 5–8 / 9+, D-081) | 2,6 | 2,2 – 3,3 | — | — | 2,6 |
| Transitions de saison sans aucun changement d’étage (D-081) | 16 % | 5 % – 26 % | — | — | 15 % |

## Proportions, luttes pour le titre et coéquipiers

| Indicateur | Moyenne | 10 % – 90 % | Objectif | Dans l’objectif | Référence P3 |
| --- | --- | --- | --- | --- | --- |
| Saisons où la dernière écurie marque au moins 1 point | 58 % | — | 40 % – 90 % | — | 59 % |
| Séries de 20 saisons avec 5 titres constructeurs consécutifs ou plus | 88 % | — | 0 % – 25 % | — | 88 % |
| Titre encore ouvert avant la dernière manche (définition exacte) | 30 % | — | — | — | 28 % |
| Retournement à la dernière manche (le leader perd le titre) | 5 % | — | — | — | 5 % |
| Champion et vice-champion coéquipiers | 33 % | — | — | — | 34 % |
| Lutte jusqu’à la dernière manche entre coéquipiers | 12 % | — | — | — | 11 % |
| Lutte jusqu’à la dernière manche entre écuries différentes | 18 % | — | — | — | 17 % |
| Saisons très serrées (≤ 10 points d’écart) | 12 % | — | — | — | 11 % |
| Dominations (≥ 120 points d’écart) | 17 % | — | — | — | 17 % |
| Coéquipiers : écart moyen à l’arrivée (% temps au tour) | 0,46 | 0,40 – 0,52 | — | — | 0,45 |
| Coéquipiers : écart moyen dû aux compétences | 0,26 | 0,17 – 0,35 | — | — | 0,25 |
| Coéquipiers : écart moyen dû à la forme | 0,01 | 0,01 – 0,01 | — | — | 0,01 |
| Coéquipiers : écart moyen dû à l’aléa | 0,36 | 0,34 – 0,39 | — | — | 0,36 |
| Coéquipiers : part de l’écart quadratique due aux compétences | 34 % | 20 % – 51 % | — | — | 33 % |
| Coéquipiers : part de l’écart quadratique due à la forme | 0 % | 0 % – 0 % | — | — | 0 % |
| Coéquipiers : part de l’écart quadratique due à l’aléa | 66 % | 50 % – 82 % | — | — | 67 % |

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
- Kimi Antoneli (Mercédes) remporte le titre avec 355 points et 4 victoires, 22 points devant Max Verstapen (Red Bul).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 8 fois.
- Mercédes décroche le titre des constructeurs (11e titre de son histoire).
- Audy progresse de la 10e à la 6e place.
- Wiliams recule de la 5e à la 9e place.
- Cadilac termine la saison sans marquer le moindre point.

**2029** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 384 points et 7 victoires, 42 points devant George Russel (Mercédes).
- Mercédes décroche le titre des constructeurs (12e titre de son histoire).
- Wiliams progresse de la 9e à la 6e place.
- Aston Martyn recule de la 5e à la 8e place.
- Audy recule de la 6e à la 9e place.
- Haass termine la saison sans marquer le moindre point.

**2030** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 380 points et 5 victoires, 25 points devant Lewis Hammilton (Ferrary).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 7 fois.
- Ferrary décroche le titre des constructeurs (17e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Suzuca.
- Victoire surprise de George Russel (Mercédes) à Miamy.
- Victoire surprise de Isack Hadjard (Red Bul) à Marinna Bay, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Austen.
- Victoire surprise de Max Verstapen (Red Bul) à Yas Marinna.
- Ferrary progresse de la 4e à la 1re place.

**2031** — champion : Charles Leclerq
- Charles Leclerq (Ferrary) remporte le titre avec 417 points et 10 victoires, 96 points devant Max Verstapen (Red Bul).
- Ferrary décroche le titre des constructeurs (18e titre de son histoire).
- Victoire surprise de Lando Noris (McLarren) à Suzuca.
- Victoire surprise de Max Verstapen (Red Bul) à Jedda.
- Victoire surprise de Kimi Antoneli (Mercédes) à Gilles-Villeneuves.
- Victoire surprise de Max Verstapen (Red Bul) à Monacco.
- Victoire surprise de Oscar Piastry (McLarren) à Madrit, sous la pluie.
- Victoire surprise de Max Verstapen (Red Bul) à Marinna Bay, sous la pluie.
- Victoire surprise de George Russel (Mercédes) à Yas Marinna.
- Haass progresse de la 11e à la 8e place.
- Alpyne recule de la 5e à la 10e place.
- Wiliams, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 5 saisons.

**2032** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 456 points et 10 victoires, 97 points devant Charles Leclerq (Ferrary).
- Red Bul décroche le titre des constructeurs (7e titre de son histoire).
- Alpyne progresse de la 10e à la 7e place.
- Racing Buls recule de la 7e à la 10e place.

**2033** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 479 points et 14 victoires, 125 points devant Charles Leclerq (Ferrary).
- Une domination sans partage.
- Red Bul décroche le titre des constructeurs (8e titre de son histoire).
- Cadilac progresse de la 11e à la 8e place.

**2034** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 402 points et 6 victoires, 5 points devant Charles Leclerq (Ferrary).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 7 fois.
- Red Bul décroche le titre des constructeurs (9e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Suzuca, sous la pluie.
- Victoire surprise de Kimi Antoneli (Mercédes) à Spielbergh.
- Victoire surprise de Max Verstapen (Red Bul) à Spa-Francorchamp.
- Victoire surprise de Oscar Piastry (McLarren) à Monzza.
- Victoire surprise de Oscar Piastry (McLarren) à Austen.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Cadilac progresse de la 8e à la 5e place.
- Racing Buls progresse de la 9e à la 6e place.
- Audy progresse de la 11e à la 7e place.
- Aston Martyn recule de la 6e à la 10e place.
- Haass recule de la 5e à la 11e place.

**2035** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 414 points et 11 victoires, 81 points devant George Russel (Mercédes).
- La tête du championnat a changé 4 fois.
- Red Bul décroche le titre des constructeurs (10e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Monzza.
- Victoire surprise de Max Verstapen (Red Bul) à Lussail.
- Wiliams progresse de la 8e à la 5e place.
- Cadilac recule de la 5e à la 8e place.
- Racing Buls recule de la 6e à la 10e place.
- Haass termine la saison sans marquer le moindre point.

**2036** — champion : Lando Noris
- Lando Noris (McLarren) remporte le titre avec 346 points et 5 victoires, 23 points devant George Russel (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 10 fois.
- McLarren décroche le titre des constructeurs (11e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Shangai.
- Victoire surprise de Max Verstapen (Red Bul) à Hermanos Rodrigues.
- Red Bul recule de la 1re à la 4e place.
- Audy recule de la 6e à la 9e place.
- Haass termine la saison sans marquer le moindre point.
- Alpyne, pourtant titrée par le passé, n’a remporté aucune course depuis 10 saisons.

**2037** — champion : Kimi Antoneli
- Kimi Antoneli (Mercédes) remporte le titre avec 322 points et 7 victoires, 11 points devant George Russel (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 5 fois.
- Mercédes décroche le titre des constructeurs (13e titre de son histoire).
- Haass termine la saison sans marquer le moindre point.

**2038** — champion : George Russel
- George Russel (Mercédes) remporte le titre avec 307 points et 4 victoires, 4 points devant Max Verstapen (Red Bul).
- Le titre s’est joué à quelques points : une des saisons les plus serrées.
- Le titre restait ouvert avant la dernière manche.
- La tête du championnat a changé 9 fois.
- Mercédes décroche le titre des constructeurs (14e titre de son histoire).
- Mercédes signe 5 doublés.
- Haass termine la saison sans marquer le moindre point.

**2039** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 343 points et 7 victoires, 12 points devant George Russel (Mercédes).
- Le titre restait ouvert avant la dernière manche.
- Mercédes décroche le titre des constructeurs (15e titre de son histoire).
- Haass termine la saison sans marquer le moindre point.

**2040** — champion : Lando Noris
- Lando Noris (McLarren) remporte le titre avec 387 points et 9 victoires, 61 points devant George Russel (Mercédes).
- McLarren décroche le titre des constructeurs (12e titre de son histoire).
- Haass termine la saison sans marquer le moindre point.

**2041** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 355 points et 6 victoires, 12 points devant Kimi Antoneli (Mercédes).
- La tête du championnat a changé 4 fois.
- Mercédes décroche le titre des constructeurs (16e titre de son histoire).
- Victoire surprise de Taylor Walsh (Cadilac) à Hermanos Rodrigues.
- Victoire surprise de Gabriel Bortoletto (Alpyne) à Yas Marinna, sous la pluie.
- Audy progresse de la 8e à la 5e place.
- Ferrary recule de la 4e à la 7e place.

**2042** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 343 points et 7 victoires, 89 points devant Elena Barbieri (Audy).
- La tête du championnat a changé 4 fois.
- Red Bul décroche le titre des constructeurs (11e titre de son histoire).
- Victoire surprise de Max Verstapen (Red Bul) à Suzuca.
- Audy progresse de la 5e à la 2e place.
- Ferrary progresse de la 7e à la 3e place.
- Alpyne progresse de la 9e à la 5e place.
- Mercédes recule de la 1re à la 7e place.
- McLarren recule de la 3e à la 8e place.
- Racing Buls termine la saison sans marquer le moindre point.

**2043** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 508 points et 15 victoires, 218 points devant Oscar Piastry (Alpyne).
- Une domination sans partage.
- Red Bul décroche le titre des constructeurs (12e titre de son histoire).
- Victoire surprise de Oscar Piastry (Alpyne) à Sakir.
- Victoire surprise de Oscar Piastry (Alpyne) à Hungarorring.
- Alpyne progresse de la 5e à la 2e place.
- Mercédes progresse de la 7e à la 4e place.
- McLarren progresse de la 8e à la 5e place.
- Ferrary recule de la 3e à la 7e place.
- Wiliams recule de la 4e à la 8e place.

**2044** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 462 points et 14 victoires, 65 points devant Fleur Kok (McLarren).
- McLarren décroche le titre des constructeurs (13e titre de son histoire).
- Victoire surprise de Alessandro Testa (Audy) à Monzza, sous la pluie.
- McLarren progresse de la 5e à la 1re place.
- Haass progresse de la 9e à la 4e place.
- Alpyne recule de la 2e à la 6e place.

**2045** — champion : Max Verstapen
- Max Verstapen (Red Bul) remporte le titre avec 436 points et 10 victoires, 79 points devant Fleur Kok (McLarren).
- McLarren décroche le titre des constructeurs (14e titre de son histoire).

**2046** — champion : Fleur Kok
- Fleur Kok (McLarren) remporte le titre avec 444 points et 11 victoires, 142 points devant Paolo Zanetti (McLarren).
- Une domination sans partage.
- McLarren décroche le titre des constructeurs (15e titre de son histoire).
- McLarren signe 8 doublés.
- Victoire surprise de Alessandro Testa (Wiliams) à Miamy.
- Audy progresse de la 5e à la 2e place.
- Alpyne progresse de la 6e à la 3e place.
- Red Bul recule de la 2e à la 6e place.
- Haass recule de la 4e à la 8e place.

