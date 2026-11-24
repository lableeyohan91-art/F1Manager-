# Phase 11b-1 — Relevé des circuits, version 1 (24/11/2026)

> Pour relecture par le porteur (D-159, question 12). **Données de travail** : rien n'est encore dans le jeu.
> Statut de chaque valeur : **V** réelle vérifiée · **R** reconstruite à partir de données réelles · **E** estimation · **H** choix de jeu.
> Outils : `tools/circuits/` (Python, bibliothèque standard seulement). Données dérivées : `docs/rapports/phase-11b/donnees/`.
> Le **climat** manque : les archives météo ont refusé les requêtes (quota du jour dépassé par mes premiers essais). Il sera ajouté dès qu'elles répondront.

## 1. Ce qui a été collecté

| Donnée | Couverture | Source | Statut |
| --- | --- | --- | --- |
| Tour réel : position GPS et vitesse, accélérateur, frein, toutes les 0,27 s environ | **26 circuits** (2025 ou 2026 ; Monaco : tour de qualification, faute de positions en course) | OpenF1 (données de chronométrage du championnat, utilisées comme base seulement, jamais redistribuées brutes : décision 6) | V |
| Longueur, nombre officiel de virages, configuration en vigueur, record | **30 circuits** | Wikipédia (faits) | V |
| Virages : angle, sens, rayon minimal, vitesse minimale réelle ; lignes droites ; dénivelé | 26 circuits | Calcul sur le tour réel | R |
| Part du tour à pleine charge et au freinage, vitesses maximale et minimale | 26 circuits | Tour réel | V (un seul tour : à confirmer sur plusieurs) |
| Temps dans la voie des stands, arrêt compris (médiane de la course) | 26 circuits | OpenF1 | V |
| Safety Cars, VSC, drapeaux rouges des 10 dernières éditions | 23 circuits (§4) | Jeu communautaire CC0 (TracingInsights) | R |
| Vérification de ces neutralisations par les messages officiels de la direction de course | **91 courses 2023–2026** | OpenF1 | V |
| Points essentiels (modèle physique sur le tracé réel) | 26 circuits | Calcul | H (méthode validée), R (données) |
| Portimão, Istanbul, Kyalami, Paul-Ricard | Fiche officielle seulement | Aucune course depuis 2023 : tracé à reprendre des cartes, vitesses estimées | E |

## 2. Les 5 circuits test, en détail

Notation des virages : n° détecté, sens (d = droite, g = gauche), angle, rayon minimal (m), vitesse minimale réelle (km/h).

### Monacco (Monaco)

- **Officiel** : 3,337 km, 19 virages (V). **Détecté** : 17 virages ; dénivelé 41 m (le chiffre connu est d'environ 42 m) ; plus longue ligne droite 215 m.
- **Tour réel (qualifications 2026)** : 72,1 s ; vitesse maximale 289 km/h, minimale **44 km/h** (épingle) ; 37 % du tour à pleine charge, 29 % au freinage.
- **Voie des stands** : 23,4 s, arrêt compris.
- **Virages** : `1:d85°/R46/112 2:g17°/R151/254 3:d16°/R224/263 4:g117°/R69/157 5:d75°/R49/139 6:d124°/R26/75 7:g193°/R16/46 8:d217°/R29/73 9:d40°/R143/245 10:d16°/R334/283 11:g28°/R66/120 12:d38°/R48/69 13:g114°/R66/169 14:d47°/R79/144 15:g75°/R62/122 16:d217°/R24/60 17:d14°/R226/166`
- **Points essentiels calculés** : virages lents, virages rapides. **Le moins important** : vitesse de pointe (le plus net des 26 circuits).

### Monzza (Monza)

- **Officiel** : 5,793 km, 11 virages. **Détecté** : 12 (la première chicane compte pour deux) ; dénivelé 12 m ; plus longue ligne droite 1 123 m.
- **Tour réel (course 2026)** : 83,5 s ; 330 km/h au maximum ; **70 % à pleine charge** (le plus haut des 26) ; 11 % au freinage.
- **Voie des stands** : 24,9 s (seulement 4 arrêts exploitables, à cause d'un drapeau rouge).
- **Virages** : `1:d49°/R48/86 2:g69°/R37/71 3:d43°/R207/269 4:d29°/R253/298 5:g46°/R62/114 6:d37°/R70/111 7:d101°/R76/199 8:d66°/R74/177 9:g45°/R75/187 10:d38°/R123/187 11:g34°/R115/233 12:d168°/R78/194`
- **Points essentiels** : vitesse de pointe, moteur. **Le moins important** : virages lents.

### Suzuca (Suzuka)

- **Officiel** : 5,807 km, 18 virages. **Détecté** : 17 ; dénivelé **40 m** ; plus longue ligne droite 805 m.
- **Tour réel (course 2026)** : 92,4 s ; 322 km/h ; minimale 71 km/h (épingle) ; 53 % à pleine charge.
- **Voie des stands** : 24,2 s.
- **Virages** : `1:d187°/R59/150 2:g51°/R98/212 3:d65°/R78/191 4:g68°/R85/193 5:d106°/R68/165 6:g163°/R63/191 7:d40°/R79/239 8:d88°/R48/141 9:d33°/R137/225 10:g175°/R25/71 11:d75°/R128/212 12:d44°/R233/275 13:g207°/R59/159 14:g59°/R101/278 15:d68°/R46/101 16:g62°/R41/95 17:d86°/R84/111`
- **Points essentiels** : virages rapides, virages lents. **Le moins important** : vitesse de pointe.

### Marinna Bay (Singapour)

- **Officiel** : 4,927 km, 19 virages (tracé 2025). **Détecté** : 18 ; dénivelé 5 m ; plus longue ligne droite 410 m.
- **Tour réel (course 2026)** : 95,2 s ; 291 km/h ; minimale 66 km/h ; 48 % à pleine charge, **26 % au freinage**.
- **Voie des stands** : 24,4 s.
- **Virages** : `1:g65°/R54/130 2:d19°/R105/130 3:g148°/R33/85 4:d114°/R55/140 5:d22°/R252/281 6:g98°/R51/116 7:d116°/R30/76 8:g114°/R53/127 9:g95°/R66/134 10:d51°/R65/111 11:g37°/R74/124 12:d13°/R200/181 13:g135°/R25/67 14:d110°/R34/89 15:g33°/R171/221 16:d63°/R43/101 17:g65°/R71/104 18:g100°/R74/185`
- **Points essentiels** : moteur, virages lents. Le « moteur » traduit ici **l'accélération en sortie de virage lent** (motricité) : l'explication de la fiche devra le dire. **Le moins important** : vitesse de pointe.

### Hermanos Rodrigues (Mexico)

- **Officiel** : 4,304 km, 17 virages ; altitude 2 240 m. **Détecté** : 15 ; plus longue ligne droite 1 159 m.
- **Tour réel (course 2026)** : 79,3 s ; **352 km/h**, la vitesse maximale la plus élevée des 26 (air peu dense : moins de traînée) ; 34 % à pleine charge.
- **Voie des stands** : 22,9 s.
- **Virages** : `1:d84°/R53/97 2:g47°/R49/98 3:d74°/R49/103 4:g83°/R39/79 5:d103°/R29/74 6:d135°/R35/77 7:g62°/R75/157 8:d19°/R162/172 9:g53°/R115/197 10:d62°/R79/160 11:g48°/R107/171 12:d85°/R61/131 13:g120°/R27/65 14:d36°/R64/74 15:d175°/R38/97`
- **Points essentiels** : virages lents, moteur. **Le moins important** : vitesse de pointe.

**Ce que je te demande de regarder** : est-ce que ces portraits te paraissent justes ? Les vitesses minimales et les « points essentiels » sont les valeurs qui comptent le plus pour le jeu.

## 3. Les 26 circuits en un tableau

| Circuit | Tour réel | Vmax | Vmin | Pleine charge | Freinage | Voie des stands | Virages (détectés / officiels) | Dénivelé | Points essentiels | Le moins important |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Albert Parc | 82,1 s (2026) | 323 | 83 | 57 % | 13 % | 18,6 s | 18 / 14 | 2 m | vitesse de pointe, moteur | virages lents |
| Shangai | 95,3 s | 321 | 65 | 50 % | 22 % | 23,3 s | 11 / 16 | 7 m | virages lents, virages rapides | moteur |
| Suzuca | 92,4 s | 322 | 71 | 53 % | 16 % | 24,2 s | 17 / 18 | 40 m | virages rapides, virages lents | vitesse de pointe |
| Sakir | 95,1 s (2025) | 298 | 66 | 48 % | 20 % | 24,8 s | 13 / 15 | 16 m | moteur, vitesse de pointe | virages lents |
| Jedda | 91,8 s (2025) | 326 | 75 | 65 % | 13 % | 20,6 s | 21 / 27 | 2 m | vitesse de pointe, moteur | virages rapides |
| Miamy | 91,9 s | 331 | 64 | 49 % | 17 % | 23,1 s | 16 / 19 | 3 m | vitesse de pointe, moteur | virages rapides |
| Gilles-Villeneuves | 74,2 s | 327 | 61 | 60 % | 20 % | 24,9 s | 13 / 14 | 5 m | moteur, vitesse de pointe | virages rapides |
| Monacco | 72,1 s (qualif.) | 289 | 44 | 37 % | 29 % | 23,4 s | 17 / 19 | 41 m | virages lents, virages rapides | vitesse de pointe |
| Catalunia | 80,1 s | 327 | 99 | 37 % | 19 % | 22,7 s | 13 / 14 | 30 m | virages rapides, virages lents | vitesse de pointe |
| Spielbergh | 70,4 s | 321 | 64 | 55 % | 19 % | 21,6 s | 9 / 10 | 63 m | moteur, vitesse de pointe | virages rapides |
| Silverston | 91,8 s | 302 | 80 | 60 % | 14 % | 29,2 s | 15 / 18 | 11 m | virages rapides, vitesse de pointe | virages lents |
| Spa-Francorchamp | 108,9 s | 326 | 66 | 60 % | 14 % | 24,2 s | 17 / 19 | **102 m** | vitesse de pointe, moteur | virages lents |
| Hungarorring | 82,0 s | 286 | 102 ⚠ | 35 % | 44 % ⚠ | 22,0 s | 15 / 14 | 10 m | virages lents, moteur | vitesse de pointe |
| Zandvort | 74,2 s | 321 | 87 | 53 % | 21 % | 18,0 s | 15 / 14 | 9 m | virages rapides, virages lents | vitesse de pointe |
| Monzza | 83,5 s | 330 | 71 | 70 % | 11 % | 24,9 s | 12 / 11 | 12 m | vitesse de pointe, moteur | virages lents |
| Madrit | 95,6 s | 330 | 75 | 46 % | 18 % | 31,4 s | 23 / 22 | 24 m | virages rapides, virages lents | vitesse de pointe |
| Bakou | 104,9 s | 326 | 71 | 60 % | 19 % | 20,6 s | 18 / 20 | 27 m | moteur, vitesse de pointe | virages rapides |
| Marinna Bay | 95,2 s | 291 | 66 | 48 % | 26 % | 24,4 s | 18 / 19 | 5 m | moteur, virages lents | vitesse de pointe |
| Austen | 98,0 s | 322 | 76 | 56 % | 18 % | 24,2 s | 17 / 20 | 30 m | virages rapides, virages lents | vitesse de pointe |
| Hermanos Rodrigues | 79,3 s | 352 | 65 | 34 % | 25 % | 22,9 s | 15 / 17 | 3 m | virages lents, moteur | vitesse de pointe |
| Interlagoss | 72,7 s | 326 | 85 | 44 % | 20 % | 24,4 s | 9 / 15 ⚠ | 43 m | virages lents, virages rapides | moteur |
| Las Vegaz | 95,6 s | 349 | 92 | 63 % | 18 % | 22,2 s | 13 / 17 | 16 m | vitesse de pointe, moteur | virages lents |
| Lussail | 83,0 s (2025) | 310 | 95 | 59 % | 13 % | 28,8 s | 13 / 16 | 4 m | virages rapides, virages lents | vitesse de pointe |
| Yas Marinna | 86,7 s (2025) | 310 | 67 | 60 % | 15 % | 21,7 s | 12 / 16 | 11 m | moteur, virages lents | virages rapides |
| Imola (nouveau) | 78,0 s (2025) | 304 | 98 | 66 % | 18 % | 30,3 s | 13 / 19 | 34 m | moteur, vitesse de pointe | virages rapides |
| Sepang (nouveau) | 98,2 s (2026) | 325 | 68 | 50 % | 20 % | 28,2 s | 13 / 15 | 22 m | virages rapides, virages lents | vitesse de pointe |

⚠ = valeur suspecte à revoir (un seul tour mesuré : le canal du frein du Hungaroring paraît bloqué ; Interlagos fusionne trop de virages).

**Lecture** : les circuits se rangent d'eux-mêmes en familles connues : vitesse (Monzza, Spa, Las Vegaz, Jedda, Bakou), grandes courbes (Suzuca, Silverston, Catalunia, Austen, Lussail, Sepang, Zandvort), virages lents (Monacco, Hungarorring, Marinna Bay, Hermanos Rodrigues). **Les circuits « plats » d'avant (Albert Parc, Shangai, Miamy) ont maintenant une identité.**

## 4. Neutralisations : vérification par les messages officiels

- **91 courses de 2023 à 2026** : le jeu communautaire et les messages officiels de la direction de course donnent **exactement les mêmes nombres** de SC, VSC et drapeaux rouges dans **83 cas**.
- **Piège trouvé** : en 2026, la direction de course écrit « VSC DEPLOYED » au lieu de « VIRTUAL SAFETY CAR DEPLOYED ». Corrigé.
- **8 écarts** à trancher (`donnees/verification-neutralisations.json`). Exemples : Albert Parc 2023 (3 ou 4 drapeaux rouges, message en double probable), Zandvoort 2023 (1 ou 2 SC sous la pluie), Spa 2025 (départ retardé : SC ou drapeau rouge ?), Sepang 2026. **Règle proposée** : les messages officiels font foi, sauf doublon manifeste.
- **Avant 2023** (pas de messages officiels accessibles), on garde le jeu communautaire, avec un **trou connu** (Singapour 2016) à compléter à la main.

## 5. Limites, dites franchement

1. **Un seul tour par circuit** : une valeur aberrante passe (le frein du Hungaroring). Il faudra 3 à 5 tours par circuit et garder la médiane.
2. **Virages** : la détection automatique est à 1 ou 2 près sur la plupart des circuits, mais à 6 près sur Djeddah et Interlagos. Le rapprochement avec la **numérotation officielle** reste à faire circuit par circuit.
3. **Voiture de calcul trop rapide** de 5 à 11 % (≈ 375 km/h au lieu de 330). Les voitures 2026 ne déploient pas toute leur énergie électrique en bout de ligne droite. Calage prévu en 11b-2 ; il ne change pas l'ordre des points essentiels, mais il en change l'ampleur.
4. **Pleine charge en 2026** : la gestion de l'énergie fait lever le pied avant certains freinages. Les parts de « pleine charge » sont donc plus basses qu'avant 2026. C'est réel, mais il faudra le garder à l'esprit en comparant des années différentes.
5. **Temps de la voie des stands** : arrêt compris. Le **temps perdu** par rapport à un tour normal (environ 18 à 25 s) sera calculé en 11b-2.
6. **Climat** : à venir.
