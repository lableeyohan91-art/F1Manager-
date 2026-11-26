# Phase 12d — une vraie nouvelle ère à chaque grande réforme (fiche de conception, 26/11/2026)

> Demande du porteur (26/11/2026) : « à chaque nouvelle ère, le savoir doit revenir un peu comme au début du jeu… le savoir doit vraiment
> redescendre ». Chantier 1 de l'ordre convenu (chantier 2 : piège de la pauvreté, ensuite).
> Statut : **conception soumise au porteur** ; variantes mesurées dans des copies du dépôt, **rien n'est changé dans le jeu**.
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

Campagne complète (10 graines × 30 saisons, tous les indicateurs) : `docs/rapports/phase-12d/` (en cours au moment de l'écriture).

## 4. Critères de réussite proposés

- Pièces touchées juste après une réforme : 50 à 65 % du plafond. **Atteint (55 %).**
- La grille ne dépasse pas 85 % du plafond en moyenne sur 30 saisons. **Atteint (76–81 %).**
- Aucune dégradation des indicateurs D-081 de la campagne complète (dynasties, dominations, titre ouvert) — à vérifier.
- Pas de loterie : le champion sortant reste dans les 4 premiers au moins 2 fois sur 3. **Atteint (83 %).**

## 5. Questions au porteur

1. Valider le mécanisme (usure du savoir de fond de 50 % × intensité, transfert de l'ancienne ère réduit) ?
2. La préparation du règlement doit-elle compter **plus** encore (par exemple : le savoir préparé compte double la première saison) ?
   Aujourd'hui, elle compte normalement ; on mesurera après le chantier 2.
