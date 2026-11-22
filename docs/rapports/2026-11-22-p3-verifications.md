# Vérifications demandées après la phase 3

**Date :** 22/11/2026 · **Graines :** 1 à 100 × 10 saisons pour chaque mesure · **Référence figée :** [reference/p3-reference.md](reference/p3-reference.md) et [reference/p3-reference.json](reference/p3-reference.json)

## 1. Écart entre coéquipiers : d'où vient-il ?

Deux coéquipiers ont la même voiture. Leur écart à l'arrivée vient donc seulement de leurs **compétences**, de leur **forme** (confiance en soi) et de l'**aléa** de course. Mesure faite sur les courses où les deux finissent :

| Composante | Écart moyen (% temps au tour) | Part de l'écart quadratique |
| --- | --- | --- |
| Compétences | 0,10 | 10 % |
| Forme | 0,03 | 1 % |
| Aléa | 0,36 | 90 % |
| **Total** | **0,39** | |

**Diagnostic : l'aléa domine trop.** Un point de niveau pilote ne vaut que 0,1 % du temps au tour, alors que l'aléa de chaque pilote a un écart type de 0,3 %. Le meilleur des deux coéquipiers ne gagne pas assez souvent le duel. Conséquence directe : dans **59 % des saisons**, le champion et le vice-champion sont coéquipiers.

Deux erreurs de mesure, trouvées et corrigées en route :
- les paires étaient ordonnées selon l'ordre d'arrivée, ce qui créait une corrélation artificielle. Elles sont maintenant ordonnées par identifiant ;
- la variance ignore l'écart systématique entre deux pilotes. Elle a été remplacée par la moyenne des carrés.

## 2. Plusieurs niveaux d'aléa (rapport : [2026-11-22-p3-balayage-alea.md](2026-11-22-p3-balayage-alea.md))

| Indicateur | aléa 0,15 | 0,22 | **0,30 (actuel)** | 0,40 |
| --- | --- | --- | --- | --- |
| Vainqueurs différents par saison | 4,9 | 5,7 | 6,5 | 7,3 |
| Part des victoires de l'écurie dominante | 68 % | 62 % | 56 % | 50 % |
| Victoires inattendues par saison | 0,4 | 1,0 | 1,8 | 3,0 |
| Champions pilotes différents sur 10 saisons | 3,9 | 4,1 | 4,1 | 4,1 |
| Dynasties (5 titres consécutifs) | 63 % | 62 % | 56 % | 52 % |
| Titre ouvert avant la dernière manche | 33 % | 37 % | 36 % | 38 % |
| Écart moyen entre coéquipiers | 0,22 | 0,30 | 0,39 | 0,50 |
| Part des compétences dans cet écart | 30 % | 17 % | 10 % | 6 % |

**L'aléa change surtout la variété des courses, très peu les championnats.** Le nombre de champions et le suspense de fin de saison sont presque insensibles à l'aléa : ils dépendent des voitures. Baisser l'aléa seul rendrait les courses plus prévisibles sans régler le fond du problème, qui est **le faible poids du pilote**.

### Essais complémentaires : donner plus de poids au pilote

| Indicateur | Référence (pilote 0,10 · aléa 0,30) | A (0,20 · 0,30) | **B (0,20 · 0,22)** | C (0,25 · 0,25) |
| --- | --- | --- | --- | --- |
| Vainqueurs différents par saison | 6,5 | 6,1 | 5,4 | 5,4 |
| Part de l'écurie dominante | 56 % | 55 % | 60 % | 58 % |
| Victoires inattendues par saison | 1,8 | 2,6 | 1,9 | 2,9 |
| Champions différents sur 10 saisons | 4,1 | 3,9 | 3,7 | 3,5 |
| Dynasties | 56 % | 50 % | 55 % | 53 % |
| Titre ouvert avant la dernière manche | 36 % | 33 % | 28 % | 27 % |
| Champion et vice-champion coéquipiers | 59 % | 39 % | 42 % | 29 % |
| Écart moyen entre coéquipiers | 0,39 | 0,44 | 0,36 | 0,42 |
| Part des compétences dans cet écart | 10 % | 30 % | 44 % | 49 % |

Remarque : les « victoires inattendues » augmentent quand le pilote compte plus. C'est logique : un excellent pilote dans une voiture moyenne peut alors gagner (exemple : Alonzo ou Verstapen dans une voiture en retard).

**Proposition (D-059, à valider) : réglage B**, pilote à 0,20 % par point et aléa à 0,22.
- Les compétences expliquent 44 % de l'écart entre coéquipiers, contre 10 % aujourd'hui.
- Les duos de coéquipiers en tête du championnat passent de 59 % à 42 %.
- Tous les objectifs restent atteints, sauf les dynasties : leur cause est structurelle, et on ne les corrige pas (consigne).

Prix à payer : un peu moins de vainqueurs différents (5,4 contre 6,5), et un peu moins de titres ouverts à la dernière manche (28 % contre 36 %).

Rien n'est appliqué : le moteur garde les réglages de référence tant que vous n'avez pas tranché.

## 3. Luttes pour le titre : entre coéquipiers ou entre écuries (référence)

| Indicateur | Valeur |
| --- | --- |
| Champion et vice-champion coéquipiers | 59 % des saisons |
| Lutte jusqu'à la dernière manche entre coéquipiers | 20 % |
| Lutte jusqu'à la dernière manche entre écuries différentes | 16 % |
| Retournement lors de la dernière manche (le leader perd le titre) | 8 % |

Définition retenue : la lutte est attribuée au duo champion / vice-champion final. Si un troisième pilote était encore en course pour le titre, il n'est pas pris en compte dans cette répartition.

## 4. Titre « joué à la dernière manche » : définition exacte

**Avant** : l'écart entre le 1er et le 2e avant la dernière manche était ≤ 25 points. C'était inexact pour trois raisons :
- un 3e pouvait encore être en course ;
- à 25 points d'écart, il y a égalité possible, départagée par les victoires ;
- tout était approximé à partir d'un seul écart.

**Maintenant** : juste avant la dernière manche, on regarde s'il existe un pilote qui, en **gagnant** pendant que le leader **ne marque rien**, finirait devant lui avec les mêmes règles de départage que le classement : points, puis victoires, puis podiums. Une égalité parfaite compte comme « encore ouvert ». Cette règle est testée sur 6 cas, dont les égalités et le rival placé 3e.

Écart avec l'ancienne mesure : 36 % des titres au lieu de 37 %. La chronique distingue désormais un titre resté ouvert d'un **retournement** (le leader perd le titre lors de la dernière manche).

## 5. Référence conservée

Les résultats actuels sont figés dans `docs/rapports/reference/p3-reference.md` (lisible) et `p3-reference.json` (machine). Pour comparer une future version à cette référence : `npm run equilibrage -- --reference docs/rapports/reference/p3-reference.json`. Une colonne « Référence P3 » s'ajoute alors à chaque tableau.

## 6. Dynasties

Non corrigées, conformément à la consigne. Elles serviront de mesure de l'effet des mécaniques à venir : marché, vieillissement, économie, règlement.

## Outils ajoutés

- **Réglages d'expérience par monde** (`monde.parametres`, format de sauvegarde 3 avec migration testée). Ils permettent de tester un coefficient sans modifier le code. Ils sont vides dans une partie normale.
- `npm run equilibrage` accepte maintenant `--alea`, `--param nom=valeur`, `--balayage-alea`, `--json` et `--reference`.
