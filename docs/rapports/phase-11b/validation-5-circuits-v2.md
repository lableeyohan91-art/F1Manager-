# Phase 11b-1 — Les 5 circuits test, version 2 (24/11/2026)

> Réponse aux trois demandes du porteur après relecture du relevé v1 par ChatGPT. **Pas encore de validation définitive** : points ouverts au §5.
> Circuits test : Monza, Monaco, Suzuka, Singapour, Mexico (liste validée, D-159 question 12).

## 0. État réel (sans confondre prototype et jeu)

| Élément | État |
| --- | --- |
| Traces des 5 circuits (`data/circuits/*.json`) | **Dans le dépôt**, reproductibles (`tools/circuits/LISEZMOI.md`) ; **non lues par le jeu** |
| Modèle de vitesse (`src/engine/circuits/profil.ts`, coefficients dans `balance/profil.ts`) | **Code du moteur, testé** (26 tests) ; **non branché sur les courses** : les résultats du jeu ne changent pas |
| Calage de la voiture de référence (`tools/calage-profil.mts`) | Reproductible |
| « Points essentiels » | Calculés par diagnostic ; **pas encore affichés** (fiche circuit = 11b-4) |
| Relevé v1 des 26 circuits | Prototype (un seul tour, ancien modèle) : **remplacé** pour ces 5 circuits |
| Climat | **Absent** (quota des archives météo) |
| Numérotation officielle des virages | **Non faite** |

## 1. Demande 1 — Provisoire et définitif

Le classement des « points essentiels » est **provisoire** :
- il ne porte que sur les **4 caractéristiques que la voiture du jeu possède** : virages lents (adhérence mécanique), virages rapides (appui), vitesse de pointe (traînée), moteur (puissance) ;
- la gestion des pneus et l'efficacité aéro ne sont pas encore traduites dans le modèle de vitesse.

Le classement **définitif** viendra avec les phases 12 et 13 : motricité, freinage, pneus, refroidissement, énergie, chacun le jour où une formule le lira. Pour le préparer, un **diagnostic étendu** (6 paramètres physiques) est déjà calculé, mais il n'est **pas** un classement de jeu (§3).

| Circuit | Provisoire : n° 1 | n° 2 | Le moins important |
| --- | --- | --- | --- |
| Monzza | faible traînée (40 %) | puissance (33 %) | adhérence mécanique (12 %) |
| Monacco | adhérence mécanique (37 %) | appui (31 %) | faible traînée (15 %) |
| Suzuca | appui (33 %) | puissance (23 %) | adhérence mécanique (22 %) — trois caractéristiques à égalité |
| Marinna Bay | adhérence mécanique (30 %) | puissance (25 %) ≈ appui (25 %) | faible traînée (19 %) |
| Hermanos Rodrigues | adhérence mécanique (32 %) | faible traînée (24 %) | appui (20 %) |

Part de chaque caractéristique dans le gain de temps, après normalisation sur les 5 circuits (`donnees/points-essentiels-5-circuits.json`).

## 2. Demande 2 — Singapour (et Suzuka, Mexico)

**Ta remarque était juste, et le défaut venait de mon premier modèle, pas du circuit.**

- **Puissance et motricité sont deux choses différentes** :
  - la **puissance** limite l'accélération au-dessus de ≈ 190 km/h ;
  - la **motricité** (adhérence en accélération) la limite en dessous.

  Le premier prototype n'avait qu'**une seule adhérence**, qui servait à la fois en virage, au freinage et en accélération. Il n'avait pas non plus de limite d'énergie électrique.
- **Ce que le « moteur » mesurait à Singapour** : la puissance, entre ≈ 190 et 290 km/h, sur les nombreuses lignes droites moyennes. Ce n'était donc **pas** de la motricité. Mon explication de l'époque était fausse.
- **Avec le nouveau modèle**, qui sépare adhérence mécanique, appui, motricité, freinage, traînée et puissance et ajoute le budget d'énergie électrique du règlement 2026 :
  - à Singapour, la puissance tombe à la 2e place, à égalité avec l'appui ;
  - l'**adhérence mécanique** passe en tête ;
  - **la motricité seule pèse peu** : 0,04 s pour +2 %.
- **Cause physique du changement** : à Singapour, la voiture n'a que **34 %** de sa puissance électrique en moyenne, faute d'énergie pour tant d'accélérations. Un moteur plus puissant y rapporte donc moins qu'on ne le croirait.
- **Suzuka** : l'appui est n° 1, comme attendu. Mais c'est **le circuit le moins bien reproduit** (§4). Son classement reste à confirmer.
- **Mexico** : adhérence mécanique n° 1 et appui **le moins important**. C'est surprenant mais physique : à 2 240 m, l'air est 24 % moins dense, l'appui produit moins, et chaque point d'appui y vaut moins qu'ailleurs. La faible traînée y compte aussi moins en absolu, mais moins que l'appui. À vérifier avec le refroidissement (phase 12), qui pèsera beaucoup à Mexico.

## 3. Ce que la vérification a corrigé (vrais défauts trouvés)

| Défaut | Cause | Correction | Effet |
| --- | --- | --- | --- |
| Vitesses minimales beaucoup trop hautes (Monza 124 km/h contre 72) | Tracé tous les 10 m et lissé sur ≈ 70 m : les chicanes devenaient des courbes larges | Tracé tous les 5 m, lissage léger | Vitesses minimales à quelques km/h du réel |
| Voiture trop rapide en accélération (Singapour +34 km/h) | Pas de limite d'énergie électrique (règlement 2026) ; ailerons identiques partout | Budget d'énergie par tour ; niveau d'ailerons choisi par le calcul pour chaque circuit | Temps au tour à 1–3 % du réel sur 4 circuits |
| Aileron maximal partout, même à Monza | Hypothèse « un aileron ajoute peu de traînée » trop généreuse | Ordre de grandeur physique (coefficient 1,35 au lieu de 0,7) | Monza reçoit le moins d'appui (calculé, pas imposé) |
| Calage avec une motricité absurde (0,62) | Tours de **course** : gestion de l'énergie et de l'essence | Calage sur des tours de **qualification**, et bornes physiques à chaque paramètre | Valeurs plausibles ; écart affiché, pas caché |
| Faux virages serrés dans les courbes rapides | Positions mesurées dans le temps : un point tous les 18 m à 240 km/h | Moyenne des positions de 5 tours ; lissage proportionnel à l'espacement des mesures | Amélioré, **pas réglé à Suzuka** |
| Tracé 3 % trop court (Monaco) | La moyenne et le lissage coupent les virages | Remise à l'échelle exacte de la longueur officielle | Rayons justes en proportion |

Pourquoi le premier relevé trouvait 16 virages à Monza et 29 à Spa ? Il utilisait un tracé géographique (GeoJSON) d'un point tous les 30 à 50 m : chaque angle entre deux points devenait un faux virage. Les traces actuelles viennent des positions réelles des voitures.

## 4. Le modèle contre le réel (voiture de référence calée, une seule pour les 5 circuits)

| Circuit | Tour modèle / réel (qualif. 2026) | Vmax modèle / réel | Vmin modèle / réel | Écart moyen de vitesse | Ailerons (0 = référence) | Électrique disponible |
| --- | --- | --- | --- | --- | --- | --- |
| Monzza | 81,4 / 81,9 s | 330 / 339 | 80 / 72 | 12 km/h | +0,40 | 35 % |
| Monacco | 68,9 / 72,3 s | 317 / 286 ⚠ | 51 / 48 | 17 km/h | +0,45 (butée) | 66 % |
| Suzuca | 93,2 / 89,1 s ⚠ | 320 / 323 | 69 / 77 | 15 km/h | +0,45 (butée) | 29 % |
| Marinna Bay | 90,2 / 91,5 s | 314 / 307 | 64 / 69 | 9 km/h | +0,45 (butée) | 34 % |
| Hermanos Rodrigues | 77,6 / 76,6 s | 342 / 350 | 64 / 67 | 12 km/h | +0,45 (butée) | 64 % |

Voiture de référence calée (dans des bornes physiques) : appui 3,49 m², traînée 0,61 m², adhérence mécanique 1,25, part de l'appui 2,18, motricité 1,0 (borne basse), freinage 1,42, énergie électrique 6,2 MJ par tour. Écart moyen de vitesse sur les 5 circuits : **12,9 km/h**. Calcul : 15 à 50 ms par circuit pour 17 réglages d'ailerons.

## 5. Ce qui reste ouvert (avant de te demander de valider)

1. **Suzuka, 4 s trop lente** : dans les « S » et à Degner, la vitesse réelle supposerait **5,5 à 6 g** sur les rayons mesurés. Ou bien ces rayons restent trop petits (mesure), ou bien les voitures 2026 y ont plus d'appui que ma voiture de référence (modèle). Cause non tranchée.
2. **Monaco, 31 km/h trop rapide en ligne droite** (tunnel) : effet probable de la gestion de l'énergie, que mon budget « au prorata » répartit mal.
3. **Ailerons en butée** sur 4 circuits sur 5 : la plage de réglage est trop étroite vers le haut, ou l'appui de base est trop faible. À revoir avec le point 1.
4. **La normalisation « un point = même gain moyen »** a un effet indésirable, vu sur le diagnostic étendu. Un paramètre qui pèse très peu partout (la motricité) voit ses petites variations **gonflées** : 40 % à Monaco, alors qu'il ne fait gagner que 0,07 s. **Proposition (à arbitrer)** : normaliser seulement sur le calendrier complet, et ignorer les paramètres dont l'effet brut est négligeable. Je n'ai rien changé sans ton accord.
5. **Motricité légèrement négative à Monza** (−0,009 s) : en accélérant mieux, la voiture consomme son énergie électrique plus tôt et en manque plus loin. C'est un effet réel de la limite d'énergie, mais ma répartition uniforme l'exagère. Il faudra un déploiement plus réaliste (phase 13).
6. **Numérotation officielle des virages** : non faite (l'accès à la source des plans officiels a été refusé ; le rapprochement se fera à la main pour les 5 circuits).
7. **Climat**, **réglages** (hauteur, raideur, refroidissement), **campagne avant/après** : pas encore faits.

## 6. Reproductibilité

- **Tests** : `tests/circuits-profil.test.ts`, 26 tests, sans téléchargement. Ils vérifient la longueur des traces, le nombre de virages et le sens physique des effets : plus de traînée fait perdre de la vitesse de pointe, plus d'appui fait passer les virages plus vite, l'altitude réduit les deux, Monza reçoit moins d'aileron que Monaco. Ils fixent aussi l'état du calage (tour à ±6 %, vitesse à ±20 km/h en moyenne).
- **Suite complète** : 299 tests sur 299.
- **Procédure** : `tools/circuits/LISEZMOI.md` (récupération des tours bruts, construction des traces, calage, diagnostic).
