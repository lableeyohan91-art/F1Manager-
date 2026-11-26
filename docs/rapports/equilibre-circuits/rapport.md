# Équilibre des circuits et des voitures : mise en œuvre et mesure (27/11/2026)

> Demande du porteur : « tout ce qui équilibre le jeu pour effacer les dominations, on l'a validé : mets-le en œuvre et code » ; « les
> circuits ne doivent pas trop récompenser un axe » ; « une saison serrée entre deux pilotes d'une écurie n'est pas une saison serrée ».
> 10 graines × 30 saisons, mêmes graines ; référence recalculée avec les nouveaux indicateurs. Tous les indicateurs : `donnees/`.

## Ce qui a été mis en œuvre

- **Circuits et caractéristiques (S3).** Chaque caractéristique alimente deux pièces : châssis = virages lents + motricité ; pontons =
  vitesse de pointe. L'effet direct de la note de pneus est réduit (× 0,4). La motricité des suspensions est renforcée (gain 0,35,
  compromis 1,8). Les concepts sont un peu plus marqués (0,3 par point, plafond 1).
- **Notes à identités (S2).** Tes notes du 25/11 sont reprises, avec une spécialité par grande écurie (version b3). La motricité est
  provisoire.
- **IA des installations (S6).** L'effet de l'âge sur l'entretien est plafonné à 15 ans ; l'IA n'agrandit plus ses installations quand son
  budget de pièces est sous 60 M€.
- **Indicateurs.** Saisons serrées et dominations entre écuries différentes ; écarts au championnat constructeurs.

## Circuits : quelle caractéristique fait gagner (voiture neutre)

| Caractéristique | Avant | Après |
| --- | --- | --- |
| Gestion des pneus | 19 circuits | 3 |
| Virages rapides | 7 | 4 |
| Virages lents | 2 | 10 |
| Vitesse de pointe | 2 | 6 |
| Motricité | 0 | 5 |
| Efficacité aéro | 0 | 2 |

Au départ : 4 écuries gagnent au moins un circuit (Mercédès 11, McLaren 8, Ferrari 7, Red Bull 4), au lieu de Mercédès seule sur les 30.

## Campagne (extrait ; référence → version 1 → version b3)

| Indicateur (objectif) | Référence | Version 1 | Version b3 |
| --- | --- | --- | --- |
| Vainqueurs différents par saison | 7,6 | 8,0 | 7,8 |
| Part des victoires de l'écurie dominante | 46 % | 42 % | 44 % |
| Lutte jusqu'à la dernière manche entre écuries différentes | 23 % | 28 % | **28 %** |
| Champion et vice-champion coéquipiers | 24 % | 23 % | 19 % |
| Dernière écurie qui marque | 68 % | 74 % | 72 % |
| Titre ouvert avant la dernière manche | 31 % | 34 % | 34 % |
| Championnat constructeurs serré (≤ 25 points) | 15 % | 17 % | 18 % |
| Dominations entre écuries (≥ 120 points sur le meilleur pilote d'une autre écurie) | 18 % | 15 % | 22 % ✗ |
| **Séries de 5 titres consécutifs ou plus (≤ 25 %)** | 60 % | 90 % ✗ | **80 % ✗** |
| Plus longue série de titres | 5,7 | 7,3 | 6,4 |
| Champions constructeurs différents | 7,8 | 6,9 | 7,2 |
| Écart 1re–dernière voiture | 1,02 % | 0,91 % | 0,94 % |

Titres constructeurs sur 300 saisons : référence Mercédès 54, McLaren 49 ; version b3 **McLaren 92**, Williams 39, Ferrari 34, Mercédès 24.

## Lecture, dite franchement

1. **Saison par saison, c'est mieux** : plus de luttes entre écuries différentes, moins de duels entre coéquipiers pour le titre, la
   dernière écurie marque plus souvent, et les circuits ne récompensent plus un seul axe.
2. **Sur plusieurs saisons, c'est pire : McLaren enchaîne les titres** (92 sur 300). Elle part avec les meilleurs pilotes (17,3), une
   voiture régulière (2e ou 3e presque partout : la régularité rapporte plus que des victoires isolées) et plus d'argent de développement
   que Mercédès (57 contre 42 M€ par an). La correction S6 n'a pas suffi à rendre son budget de pièces à Mercédès.
3. **Objectif « dynasties ≤ 25 % » non atteint**, ni avant (60 %) ni après (80 %).

## Pistes (à décider)

- Corriger la cause financière : les grandes écuries au plafond ont trop de personnel et d'entretien, donc trop peu pour les pièces.
- Mesurer les circuits rééquilibrés **avec les anciennes notes**, pour séparer l'effet des circuits de celui des notes.
- Renforcer l'usure du succès (D-140) pour l'écurie qui enchaîne les titres, déjà décidée dans son principe.
