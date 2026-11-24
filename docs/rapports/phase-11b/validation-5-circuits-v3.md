# Phase 11b-1 — Les 5 circuits test, version 3 : Suzuka et Monaco (24/11/2026)

> Suite de la version 2 (`validation-5-circuits-v2.md`). Le porteur a demandé de traiter d'abord Suzuka et Monaco, et a validé la
> normalisation proposée (« un paramètre au gain négligeable ne peut pas être essentiel »). Toujours **non branché sur les courses**.

## 1. Ce que la recherche des causes a trouvé

| Constat | Cause physique trouvée | Ce qui a été ajouté au modèle | Statut |
| --- | --- | --- | --- |
| Le calage bridait l'adhérence pour freiner une voiture trop rapide ailleurs | Monaco trop rapide et Suzuka trop lente étaient **liés par le calage** : une seule voiture pour tous les circuits | — (diagnostic) | — |
| Suzuka : 3,9 g demandés dans les virages moyens contre 3,2 g de capacité | Capacité latérale trop faible **partout**, aggravée à Suzuka | Voir les trois lignes suivantes | — |
| Le modèle réclamait à la fois beaucoup d'appui et peu de traînée (ailerons au maximum, traînée contre sa borne basse) | **Aérodynamique active du règlement 2026** : ailerons ouverts en ligne droite, fermés en virage | Mode « ligne droite » sur les portions de rayon supérieur à 1 km : traînée −54 %, appui −46 % (calés, bornés) | H (zones réelles désignées par la FIA, approchées par la géométrie) |
| Énergie répartie uniformément sur le tour | Une écurie dépense son énergie là où elle rapporte le plus (vitesses basses et moyennes) et **coupe en bout de ligne droite** (observé en 2026) | Vitesse de coupure du déploiement électrique, ajustée au budget d'énergie | H |
| Monaco et Singapour trop rapides, Suzuka trop lente, **avec la même voiture** | Cela ne peut venir que du **circuit** : l'**adhérence du revêtement** (urbains peu adhérents, Suzuka très adhérente) | Un coefficient d'adhérence par piste (prévu au §2.1), borné de 0,85 à 1,15, moyenne des 5 circuits ramenée à 1 | R |

**Adhérence des pistes calée** : Monaco 0,935 · Singapour 0,935 · Mexico 0,996 · Monza 1,058 · Suzuka 1,077.
- Le sens est celui attendu : urbains en bas, Suzuka en haut. Le coefficient ne se contente donc pas d'absorber des erreurs au hasard.
- **À recouper** avec un classement public indépendant des revêtements (fiches du manufacturier de pneus), avant de généraliser.

## 2. Le modèle contre le réel (tours de qualification 2026)

| Circuit | Tour modèle / réel | Vmax modèle / réel | Vmin modèle / réel | Écart moyen de vitesse | Ailerons | Coupure électrique |
| --- | --- | --- | --- | --- | --- | --- |
| Monzza | 80,5 / 81,9 s | 331 / 339 | 82 / 72 | 13,5 km/h | +0,8 | 295 km/h |
| Monacco | **72,9 / 72,3 s** (avant : 68,9) | 303 / 286 | 49 / 48 | 13,1 km/h | +1,0 | aucune |
| Suzuca | **91,8 / 89,1 s** (avant : 93,2) | 307 / 323 | 71 / 77 | 19,1 km/h | +1,0 | 258 km/h |
| Marinna Bay | 92,6 / 91,5 s | 305 / 307 | 61 / 69 | 11,0 km/h | +1,0 | 293 km/h |
| Hermanos Rodrigues | 77,9 / 76,6 s | 349 / 350 | 63 / 67 | 10,0 km/h | +1,0 | aucune |

- **Monaco** : réglé, à 0,6 s du réel.
- **Suzuka** : amélioré, mais encore 2,6 s (3 %) trop lente. C'est le circuit le moins bien reproduit.
- **Ailerons** : avec l'aérodynamique active, ajouter de l'appui coûte peu en ligne droite. Le calcul met donc beaucoup d'appui presque partout. Seule Monza garde un réglage plus bas. C'est cohérent avec la logique du règlement 2026, mais à surveiller.
- **Coût du calcul** : de 12 à 51 ms par circuit pour choisir le réglage (recherche optimisée, mêmes résultats).

## 3. Points essentiels (provisoires : 4 caractéristiques du jeu)

| Circuit | Points essentiels | Le moins important | Gain brut le plus fort (+2 %) |
| --- | --- | --- | --- |
| Monzza | faible traînée + puissance | adhérence mécanique | puissance 0,27 s |
| Monacco | adhérence mécanique + appui | faible traînée | adhérence mécanique 0,43 s |
| Marinna Bay | adhérence mécanique + puissance | faible traînée | adhérence mécanique 0,43 s |
| Hermanos Rodrigues | adhérence mécanique + appui | faible traînée | adhérence mécanique 0,41 s |
| Suzuca | faible traînée + puissance ⚠ | adhérence mécanique | **appui 0,46 s** |

**⚠ Suzuka : la normalisation déforme ici.**
- En gain brut, l'appui est nettement n° 1.
- Mais la normalisation compare Suzuka à la moyenne des **5 circuits test seulement**, dont 3 à très fort appui (Monaco, Singapour, Mexico). Cela gonfle la référence de l'appui.
- Conclusion : la normalisation ne vaut que sur le **calendrier complet** (20 à 30 circuits). D'ici là, les deux lectures (brute et normalisée) sont présentées côte à côte, sans rien forcer.

## 4. Limites encore ouvertes

1. **Suzuka, 3 % trop lente**, et vitesses de pointe trop basses (307 contre 323 km/h). Piste restante : les rayons des « S » (mesure), et la règle de coupure électrique, qui coupe ici à 258 km/h.
2. **Motricité légèrement négative à Monza et à Suzuka** (−0,01 s). Avec un budget d'énergie fixe, mieux accélérer consomme l'énergie plus tôt. Une écurie réelle répartirait mieux son énergie. Il faudra un déploiement optimisé (phase 13). En attendant, un gain négatif compte pour zéro dans le classement.
3. **Voiture de référence** : la motricité moyenne effective (0,95) est juste sous la borne plausible (1,0), après la remise à 1 de la moyenne des adhérences de piste. Elle reste à surveiller.
4. **Restent à faire** : numérotation officielle des virages, climat, contraintes de réglage par circuit, campagne avant/après, historique des neutralisations par édition.

## 5. Tests

- 28 tests sur les circuits, dont la règle « gain négligeable, jamais essentiel » et la cohérence entre fiche et moteur (même calcul).
- Suite complète : **301 tests sur 301**.
