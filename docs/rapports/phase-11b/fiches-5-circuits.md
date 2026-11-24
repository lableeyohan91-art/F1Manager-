# Phase 11b — Fiches de relecture des 5 circuits test

> **Remplacées dans le jeu** par les fiches des 30 circuits (`data/grille-2026/circuits-fiches.json`, `tools/circuits/generer-fiches-jeu.mts`), normalisées sur le calendrier complet. Ce document reste la relecture historique des 5 pilotes, régénérée avec le moteur actuel.

> Générées par `tools/circuits/fiches.mts` à partir de `data/circuits/*.json` et du modèle de vitesse (24/11/2026). Statuts : **V** vérifié · **R** reconstruit · **E** estimé · **H** hypothèse de conception.
> **Rien ici n’est encore dans le jeu.** Le classement des caractéristiques est **provisoire** (4 caractéristiques de la voiture actuelle, normalisation sur 5 circuits seulement). Aucun réglage n’est donné : il se découvrira en essais libres (D-161).

## Monacco (Monaco)

**A. Présentation**

- Longueur 3.337 km · 19 virages officiels (V) · urbain (E) · altitude 10 m (V) · dénivelé du tracé 42 m (R).
- Tour de référence (qualifications 2026, médiane de 5 pilotes) : 72.279 s (V) ; modèle : 72.4 s.
- Voie des stands (course, arrêt compris) : 23.4 s sur 59 arrêts (V).

**B. Ce que le circuit exige (provisoire)**

- **Points essentiels** : virages lents (adhérence mécanique) · virages rapides (appui). **Le moins important** : vitesse de pointe (faible traînée).
- Parts normalisées : virages lents 39 % · virages rapides 35 % · moteur 14 % · vitesse de pointe 13 %.
- Gains bruts pour +2 % (s) : virages lents 0.46 · virages rapides 0.35 · motricité 0.18 · moteur 0.08 · freinage 0.06 · vitesse de pointe 0.05.
- Le tour selon ce qui limite la vitesse (modèle) : puissance 27 % · virages 26 % · freinage 16 % · motricité 31 %.
- Réel : pleine charge 53 % de la distance ; plus longue phase à pleine charge 530 m ; 4 gros freinages (plus de 100 km/h perdus) ; vitesse de 48 à 286 km/h.
- Charge latérale des pneus sur un tour : 4.5 g·km (R, indicateur relatif ; l’usure réelle dépendra aussi de l’abrasivité, inconnue : E à venir).

**C. Conditions (climat du mois du Grand Prix 2026)**

- juin, course à 15 h : air ≈ 23.7 °C (E), 4.1 jours de pluie dans le mois (V), pluie pendant la course ≈ 5 % (E), humidité 80.5 %.
- Source : Wikipédia (tableau climatique : Monaco) — station Monaco (1981–2010 averages, extremes 1966–present). Adhérence de la piste : 0.903 (R, calée).
- Contraintes pour les réglages (tendance connue de tous, E ; le réglage se découvrira en essais libres) : bosses fortes (revêtement routier), vibreurs peu utilisables (murs).

**D. Neutralisations (10 dernières éditions réelles)**

- Éditions 2016–2026 (10) : Safety Car 7 interventions · 5 GP sur 10 ; VSC 7 · 4 GP sur 10 ; drapeau rouge 3 · 3 GP sur 10.
- Vérification par édition : 2016 ? désaccord sur : drapeau rouge (article : oui) · 2017 ✔ récit · 2018 ? désaccord sur : Safety Car (article : oui) · 2019 ✔ récit · 2021 ? désaccord sur : drapeau rouge (article : oui) · 2022 ✔ récit · 2023 ✔ officiel · 2024 ✔ officiel · 2025 ✔ officiel · 2026 ✔ officiel.

**E. Virages officiels**

- 1 Sainte-Dévote · 2 Beau Rivage (probable) · 3 Massenet · 4 Casino · 5 Mirabeau Haute · 6 Épingle (Grand Hôtel) · 7 Mirabeau Bas · 8 Portier · 9 Tunnel · 10 Nouvelle chicane (1) · 11 Nouvelle chicane (2) · 12 Tabac · 13 Piscine (1) (probable : gauche rapide non détectée (angle trop faible)) · 14 Piscine (2) (probable (ordre des sens cohérent : gauche-droite rapide, droite-gauche lente)) · 15 Piscine (3) (probable (ordre des sens cohérent : gauche-droite rapide, droite-gauche lente)) · 16 Piscine (4) (probable (ordre des sens cohérent : gauche-droite rapide, droite-gauche lente)) · 17 Rascasse · 18 Anthony-Noghes · 19 Ligne d'arrivée (probable).

## Monzza (Monza)

**A. Présentation**

- Longueur 5.793 km · 11 virages officiels (V) · permanent (E) · altitude 160 m (V) · dénivelé du tracé 12 m (R).
- Tour de référence (qualifications 2026, médiane de 5 pilotes) : 81.882 s (V) ; modèle : 82.1 s.
- Voie des stands (course, arrêt compris) : 24.9 s sur 6 arrêts (V).

**B. Ce que le circuit exige (provisoire)**

- **Points essentiels** : vitesse de pointe (faible traînée) · moteur (puissance). **Le moins important** : virages lents (adhérence mécanique).
- Parts normalisées : vitesse de pointe 37 % · moteur 33 % · virages rapides 15 % · virages lents 15 %.
- Gains bruts pour +2 % (s) : moteur 0.26 · virages lents 0.24 · virages rapides 0.21 · vitesse de pointe 0.20 · motricité 0.06 · freinage 0.06.
- Le tour selon ce qui limite la vitesse (modèle) : puissance 67 % · virages 8 % · freinage 11 % · motricité 13 %.
- Réel : pleine charge 82 % de la distance ; plus longue phase à pleine charge 1340 m ; 3 gros freinages (plus de 100 km/h perdus) ; vitesse de 72 à 339 km/h.
- Charge latérale des pneus sur un tour : 5.1 g·km (R, indicateur relatif ; l’usure réelle dépendra aussi de l’abrasivité, inconnue : E à venir).

**C. Conditions (climat du mois du Grand Prix 2026)**

- septembre, course à 15 h : air ≈ 23.6 °C (E), 8.7 jours de pluie dans le mois (E), pluie pendant la course ≈ 10 % (E), humidité — %.
- Source : Wikipédia (tableau climatique : Monza) — station Monza (reference: Milan Linate). Adhérence de la piste : 0.907 (R, calée).
- Contraintes pour les réglages (tendance connue de tous, E ; le réglage se découvrira en essais libres) : bosses faibles, vibreurs agressifs aux chicanes.

**D. Neutralisations (10 dernières éditions réelles)**

- Éditions 2017–2026 (10) : Safety Car 6 interventions · 5 GP sur 10 ; VSC 3 · 3 GP sur 10 ; drapeau rouge 2 · 2 GP sur 10.
- Vérification par édition : 2017 ✔ récit · 2018 ? section « course » introuvable · 2019 ✔ récit · 2020 ✔ récit · 2021 ✔ récit · 2022 ? désaccord sur : VSC (article : non), drapeau rouge (article : oui) · 2023 ✔ officiel · 2024 ✔ officiel · 2025 ✔ officiel · 2026 ✔ officiel.

**E. Virages officiels**

- 1 Variante del Rettifilo (1) · 2 Variante del Rettifilo (2) · 3 Curva Biassono (Curva Grande) · 4 Variante della Roggia (1) · 5 Variante della Roggia (2) · 6 Lesmo 1 · 7 Lesmo 2 · 8 Variante Ascari (1) · 9 Variante Ascari (2) · 10 Variante Ascari (3) · 11 Curva Alboreto (Parabolica).

## Suzuca (Suzuka)

**A. Présentation**

- Longueur 5.807 km · 18 virages officiels (V) · permanent (E) · altitude 45 m (V) · dénivelé du tracé 40 m (R).
- Tour de référence (qualifications 2026, médiane de 5 pilotes) : 89.132 s (V) ; modèle : 89.0 s.
- Voie des stands (course, arrêt compris) : 24.2 s sur 28 arrêts (V).

**B. Ce que le circuit exige (provisoire)**

- **Points essentiels** : vitesse de pointe (faible traînée) · moteur (puissance). **Le moins important** : virages lents (adhérence mécanique).
- Parts normalisées : vitesse de pointe 31 % · moteur 27 % · virages rapides 26 % · virages lents 17 %.
- Gains bruts pour +2 % (s) : virages rapides 0.47 · virages lents 0.35 · moteur 0.27 · vitesse de pointe 0.23 · motricité 0.04 · freinage 0.03.
- Le tour selon ce qui limite la vitesse (modèle) : puissance 73 % · virages 13 % · freinage 7 % · motricité 8 %.
- Réel : pleine charge 70 % de la distance ; plus longue phase à pleine charge 1255 m ; 2 gros freinages (plus de 100 km/h perdus) ; vitesse de 77 à 323 km/h.
- Charge latérale des pneus sur un tour : 10.1 g·km (R, indicateur relatif ; l’usure réelle dépendra aussi de l’abrasivité, inconnue : E à venir).

**C. Conditions (climat du mois du Grand Prix 2026)**

- mars, course à 14 h : air ≈ 13.4 °C (E), 10.5 jours de pluie dans le mois (V), pluie pendant la course ≈ 12 % (E), humidité 62 %.
- Source : Wikipédia (tableau climatique : Tsu — station Tsu (1991−2020 normals, extremes 1889−present). Adhérence de la piste : 1.056 (R, calée).
- Contraintes pour les réglages (tendance connue de tous, E ; le réglage se découvrira en essais libres) : bosses faibles, vibreurs modérés.

**D. Neutralisations (10 dernières éditions réelles)**

- Éditions 2015–2026 (10) : Safety Car 5 interventions · 5 GP sur 10 ; VSC 4 · 3 GP sur 10 ; drapeau rouge 2 · 2 GP sur 10.
- Vérification par édition : 2015 ✔ récit · 2016 ✔ récit · 2017 ? désaccord sur : VSC (article : non) · 2018 ? désaccord sur : Safety Car (article : non), VSC (article : non) · 2019 ? désaccord sur : drapeau rouge (article : oui) · 2022 ✔ récit · 2023 ✔ officiel · 2024 ✔ officiel · 2025 ✔ officiel · 2026 ✔ officiel.

**E. Virages officiels**

- 1 Premier virage · 2 Deuxième virage · 3 S (1) · 4 S (2) · 5 S (3) · 6 S (4) · 7 Courbe Dunlop · 8 Degner 1 · 9 Degner 2 · 10 Sous le pont (probable) · 11 Épingle · 12 Courbe 200R (probable) · 13 Spoon (1) · 14 Spoon (2) · 15 130R · 16 Chicane Casio (1) · 17 Chicane Casio (2) · 18 Dernier virage.

## Marinna Bay (Singapour)

**A. Présentation**

- Longueur 4.927 km · 19 virages officiels (V) · urbain (de nuit) (E) · altitude 10 m (V) · dénivelé du tracé 5 m (R).
- Tour de référence (qualifications 2026, médiane de 5 pilotes) : 91.496 s (V) ; modèle : 91.5 s.
- Voie des stands (course, arrêt compris) : 24.4 s sur 24 arrêts (V).

**B. Ce que le circuit exige (provisoire)**

- **Points essentiels** : virages lents (adhérence mécanique) · virages rapides (appui). **Le moins important** : vitesse de pointe (faible traînée).
- Parts normalisées : virages lents 30 % · virages rapides 28 % · moteur 24 % · vitesse de pointe 19 %.
- Gains bruts pour +2 % (s) : virages lents 0.42 · virages rapides 0.34 · moteur 0.17 · motricité 0.15 · vitesse de pointe 0.09 · freinage 0.07.
- Le tour selon ce qui limite la vitesse (modèle) : puissance 40 % · virages 18 % · freinage 15 % · motricité 28 %.
- Réel : pleine charge 60 % de la distance ; plus longue phase à pleine charge 680 m ; 7 gros freinages (plus de 100 km/h perdus) ; vitesse de 69 à 307 km/h.
- Charge latérale des pneus sur un tour : 5.1 g·km (R, indicateur relatif ; l’usure réelle dépendra aussi de l’abrasivité, inconnue : E à venir).

**C. Conditions (climat du mois du Grand Prix 2026)**

- octobre, course à 20 h : air ≈ 29.4 °C (E), 15 jours de pluie dans le mois (V), pluie pendant la course ≈ 17 % (E), humidité 81.5 %.
- Source : Wikipédia (tableau climatique : Template:Singapore weatherbox) — station Singapore (1991–2020 normals, extremes 1929–1941 and 1948–present). Adhérence de la piste : 0.925 (R, calée).
- Contraintes pour les réglages (tendance connue de tous, E ; le réglage se découvrira en essais libres) : bosses fortes, vibreurs nombreux aux chicanes.

**D. Neutralisations (10 dernières éditions réelles)**

- Éditions 2015–2026 (10) : Safety Car 13 interventions · 7 GP sur 10 ; VSC 7 · 4 GP sur 10 ; drapeau rouge 0 · 0 GP sur 10.
- Vérification par édition : 2015 ✔ récit · 2016 ✔ corrigée · 2017 ✔ récit · 2018 ✔ récit · 2019 ✔ récit · 2022 ✔ récit · 2023 ✔ officiel · 2024 ✔ officiel · 2025 ✔ officiel · 2026 ✔ officiel.

**E. Virages officiels**

- 1 Sheares · 2 · 3 · 4 (non détecté (courbe à pleine vitesse)) · 5 · 6 · 7 Memorial · 8 · 9 · 10 Singapore Sling · 11 (probable) · 12 (probable (pont, ≈ 190 km/h)) · 13 · 14 · 15 (probable (tracé 2023)) · 16 (probable (tracé 2023)) · 17 (probable (tracé 2023)) · 18 (non détecté (tracé 2023)) · 19 (probable).

## Hermanos Rodrigues (Mexico)

**A. Présentation**

- Longueur 4.304 km · 17 virages officiels (V) · permanent (E) · altitude 2240 m (V) · dénivelé du tracé 3 m (R).
- Tour de référence (qualifications 2026, médiane de 5 pilotes) : 76.633 s (V) ; modèle : 76.7 s.
- Voie des stands (course, arrêt compris) : 22.9 s sur 29 arrêts (V).

**B. Ce que le circuit exige (provisoire)**

- **Points essentiels** : virages lents (adhérence mécanique) · virages rapides (appui). **Le moins important** : vitesse de pointe (faible traînée).
- Parts normalisées : virages lents 33 % · virages rapides 25 % · moteur 24 % · vitesse de pointe 19 %.
- Gains bruts pour +2 % (s) : virages lents 0.42 · virages rapides 0.28 · moteur 0.15 · vitesse de pointe 0.09 · freinage 0.07 · motricité 0.06.
- Le tour selon ce qui limite la vitesse (modèle) : puissance 40 % · virages 20 % · freinage 16 % · motricité 24 %.
- Réel : pleine charge 58 % de la distance ; plus longue phase à pleine charge 1270 m ; 4 gros freinages (plus de 100 km/h perdus) ; vitesse de 67 à 350 km/h.
- Charge latérale des pneus sur un tour : 4.0 g·km (R, indicateur relatif ; l’usure réelle dépendra aussi de l’abrasivité, inconnue : E à venir).

**C. Conditions (climat du mois du Grand Prix 2026)**

- novembre, course à 14 h : air ≈ 22.8 °C (E), 3.7 jours de pluie dans le mois (V), pluie pendant la course ≈ 4 % (E), humidité 57.1 %.
- Source : Wikipédia (tableau climatique : Mexico City) — station Ciudad de México ([[Tacubaya]]), normals 1991–2020, extremes 1877–2024. Adhérence de la piste : 0.967 (R, calée).
- Contraintes pour les réglages (tendance connue de tous, E ; le réglage se découvrira en essais libres) : bosses marquées, vibreurs modérés.

**D. Neutralisations (10 dernières éditions réelles)**

- Éditions 2016–2026 (10) : Safety Car 6 interventions · 5 GP sur 10 ; VSC 8 · 7 GP sur 10 ; drapeau rouge 2 · 2 GP sur 10.
- Vérification par édition : 2016 ? désaccord sur : Safety Car (article : non) · 2017 ✔ récit · 2018 ? désaccord sur : VSC (article : non) · 2019 ? désaccord sur : Safety Car (article : oui) · 2021 ? désaccord sur : Safety Car (article : non) · 2022 ? désaccord sur : VSC (article : non) · 2023 ✔ officiel · 2024 ✔ officiel · 2025 ✔ officiel · 2026 ✔ officiel.

**E. Virages officiels**

- 1 · 2 · 3 · 4 · 5 · 6 · 7 Esses (1) · 8 Esses (2) · 9 Esses (3) · 10 Esses (4) · 11 Esses (5) (probable) · 12 Entrée du stade · 13 Stade · 14 Stade (à vérifier) · 15 Stade (à vérifier (non séparé du 14)) · 16 Sortie du stade (probable (portion commune avec le 17)) · 17 Dernier virage (probable (portion commune avec le 16)).

