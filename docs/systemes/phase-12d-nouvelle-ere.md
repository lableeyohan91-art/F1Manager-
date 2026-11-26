# Phase 12d — une vraie nouvelle ère à chaque grande réforme (fiche de conception, 26/11/2026)

> Demande du porteur (26/11/2026) : « à chaque nouvelle ère, le savoir doit revenir un peu comme au début du jeu… le savoir doit vraiment
> redescendre ». Chantier 1 de l'ordre convenu (chantier 2 : piège de la pauvreté, ensuite).
> Statut : **validée et mise en œuvre (D-178, 26/11/2026)**. Les mesures ci-dessous ont été faites avec exactement ce mécanisme.
> Diagnostic de départ : `docs/rapports/phase-12d/diagnostic.md`.

## 1. Le problème (mesuré)

- Le savoir de fond grandit sans fin (7,5 → 40 en 30 ans), avec une usure de 1 % par an seulement.
- À une grande réforme : le savoir propre à l'ancien règlement est transféré au nouveau dans la proportion (1 − intensité), et le savoir de fond
  compte à 30 %. Résultat : **juste après une réforme, les pièces touchées repartent à 73 % du plafond** (début du jeu : 54 %), et après 2040
  toute la grille est à plus de 90 % du plafond, à 2 points les unes des autres. Une nouvelle ère ne rebat presque rien.

## 2. Le mécanisme proposé

À l'entrée en vigueur d'une grande réforme, pour chaque domaine de savoir touché à l'intensité I (0 à 1) :

1. **Le savoir de fond s'use** : fondamental × (1 − `usureFondamentale` × I), avec `usureFondamentale` = 0,5. Les méthodes, outils et habitudes
   d'une ère vieillissent quand les règles changent ; une partie seulement reste (les personnes, la culture).
2. **Le transfert de l'ancienne ère est réduit** : le savoir propre à l'ancien règlement passe au nouveau dans la proportion (1 − I)², au lieu
   de (1 − I). Une réforme à moitié intense ne garde plus la moitié de l'ancienne ère, mais un quart.
3. **Inchangé** : le savoir préparé pour le nouveau règlement (programmes de recherche « futur règlement », découvertes) compte entièrement ;
   c'est lui qui fait la différence au départ d'une ère. La coupe de réforme (D-175), les paris d'architecture et la reconception restent.
4. Les pièces que la réforme ne touche pas gardent leur savoir (une réforme aéro ne change pas le châssis).

Deux coefficients nommés dans `balance/` (`REFORME.usureFondamentale`, `REFORME.transfertExposant`) ; même règle pour toutes les écuries ;
événement « nouvelle ère » expliquant la perte de savoir (causes : le règlement) ; aucun nouvel attribut.

## 3. Variantes mesurées (4 graines × 30 saisons, mêmes graines ; outil `diagnostic-hierarchies`)

| Indicateur | Actuel | Usure du fond 50 % seule | **Nouvelle ère (proposée)** |
| --- | --- | --- | --- |
| Pièces touchées juste après une réforme (part du plafond) | 73 % | 65 % | **55 %** (début du jeu : 54 %) |
| Baisse de la frontière moyenne l'année d'une réforme | −0,58 | −1,12 | **−1,73** |
| Part du plafond atteinte par la grille, 2045 / 2056 | 90 % / 92 % | 93 % / 89 % | **76 % / 81 %** |
| Écart de frontière entre la 1re et la 11e, 2045 | 2,8 | 2,0 | **4,1** |
| Écuries changeant d'étage : saison de réforme / normale | 4,1 / 3,1 | 4,8 / 3,0 | 4,1 / 3,3 |
| Champion sortant : garde le titre / reste dans les 4 premiers | 36 % / 86 % | 57 % / 81 % | 35 % / 83 % |
| Écurie la plus souvent dans les 3 dernières | 81 % | 84 % | 81 % |

**Lecture** :
- La nouvelle ère fait exactement ce qui est demandé : on repart comme au début du jeu, le savoir ne sature plus, les voitures restent plus
  différentes entre elles.
- Elle **ne fait pas tourner le bas de grille à elle seule** : l'écurie coincée en bas l'est par l'argent (chantier 2).
- Le champion sortant n'est ni protégé ni puni : il garde le titre une fois sur trois et reste dans les 4 premiers 4 fois sur 5, comme
  aujourd'hui (les grandes ont les meilleurs ingénieurs et pilotes, et préparent mieux).

### Campagne complète (10 graines × 30 saisons, mêmes graines ; tous les indicateurs : `docs/rapports/phase-12d/donnees/`)

| Indicateur | Objectif D-081 | Actuel | **Nouvelle ère** |
| --- | --- | --- | --- |
| Séries de 30 saisons avec 5 titres consécutifs ou plus | dynasties très rares | 60 % | **30 %** |
| Plus longue série de titres constructeurs | — | 6,5 | **5,1** |
| Titre ouvert avant la dernière manche | 30–50 % | 29 % | **38 %** ✓ |
| Lutte jusqu'à la dernière manche entre écuries différentes | — | 22 % | **31 %** |
| Dominations (≥ 120 points d'écart) | < 5 % | 10 % | **7 %** (encore au-dessus) |
| Écart de points entre les deux premiers | — | 59 | 51 |
| Champions constructeurs différents | 5–8 / 20 saisons | 6,5 | 6,3 |
| Champions pilotes différents | — | 12,6 | 12,4 |
| Remontées (+3 places) | — | 29,0 | 29,8 |
| Écuries changeant d'étage par saison | 2,8–3,8 | 3,4 | 3,4 |
| Transitions sans changement d'étage | — | 11 % | 9 % |
| Vainqueurs différents par saison | — | 7,8 | 7,7 |
| Écuries victorieuses par saison | 4–6 | 5,7 | 5,5 |
| Part des victoires de l'écurie dominante | — | 46 % | 44 % |
| Écart 1re–dernière voiture | — | 0,99 % | 1,06 % |
| Corrélation voiture ↔ points | — | 0,76 | 0,77 |
| **Dernière écurie qui marque** | 60–90 % | 71 % | **61 %** (défavorable, à la limite) |
| **Écuries sans aucune victoire sur 30 saisons** | — | 0,2 | **0,5** (défavorable) |
| Victoires inattendues par saison | — | 1,4 | 1,2 (défavorable) |
| Plus forte progression d'une voiture dans la saison | — | 0,91 | 0,97 |
| Taux d'abandon | — | 6 % | 6 % |

Vitesse des voitures (4 graines × 30 saisons) : l'année d'une grande réforme, la grille recule de **2,1 points** en moyenne (79 % des
écuries reculent) ; une année normale, +0,8. La grille plafonne vers 22–23 points au lieu de 24–25 : pas de course à l'infini.

**Lecture** : la nouvelle ère divise par deux les dynasties et ouvre les championnats. Défavorable : la dernière écurie marque moins souvent
et une écurie de plus, en moyenne, ne gagne jamais en 30 saisons — c'est encore le piège de la pauvreté (chantier 2).

## 4. Critères de réussite proposés

- Pièces touchées juste après une réforme : 50 à 65 % du plafond. **Atteint (55 %).**
- La grille ne dépasse pas 85 % du plafond en moyenne sur 30 saisons. **Atteint (76–81 %).**
- Aucune dégradation des indicateurs D-081 de la campagne complète (dynasties, dominations, titre ouvert) — à vérifier.
- Pas de loterie : le champion sortant reste dans les 4 premiers au moins 2 fois sur 3. **Atteint (83 %).**

## 5. Questions au porteur

1. Valider le mécanisme (usure du savoir de fond de 50 % × intensité, transfert de l'ancienne ère réduit) ?
2. La préparation du règlement doit-elle compter **plus** encore (par exemple : le savoir préparé compte double la première saison) ?
   Aujourd'hui, elle compte normalement ; on mesurera après le chantier 2.
