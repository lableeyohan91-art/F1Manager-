# Phase 13b — positions sur la piste, qualifications, départ, dépassements (conception, 28/11/2026)

> Cadre : prompt maître du porteur (28/11, parties II, III, VI), audit `docs/rapports/audit-moteur-course/`, décisions D-192 et D-194
> (course arrêtable ; poids « moyenne » des compétences qui reçoivent une situation). Valeurs PROVISOIRES (D-120). Statut : à relire.

## 1. Le principe

La course n'est plus un temps total par pilote : c'est un **état** (positions, écarts, ressources de chaque voiture) que le moteur avance
**tour par tour**, puis **portion par portion** dans les zones qui comptent (attaque, défense). Le classement est l'ordre réel sur la piste.
La même fonction sert :
- à la course regardée par le joueur (finesse « fine » : l'état peut être sauvegardé, arrêté, repris — décision D-194 (1)) ;
- aux autres courses et aux saisons simulées (finesse « par tour » : même physique, mêmes règles, sans détail d'affichage).
Les deux finesses sont comparées par un test (même hiérarchie, écarts de points mesurés).

## 2. Le week-end : essais libres, qualifications, course (porteur, 28/11 : « il faudra penser aux essais libres et aux qualifs »)

Le moteur est construit pour un **week-end** : essais libres → qualifications → course, dans le même état de week-end.

### 2.1 Qualifications : vrai format Q1, Q2, Q3 (porteur : « vrai format »)

- Q1 (toutes les voitures, les 5 dernières éliminées), Q2 (les 5 suivantes), Q3 (les 10 meilleures) ; chaque tentative = un tour lancé.
- Tour lancé = voiture (sensibilités **de qualification** : voiture légère, pneus neufs) + pilote (compétences de rythme selon le circuit)
  + aléa de tour (plus petit qu'en course) + erreur possible (régularité, sang-froid) ; pluie : compétence pluie ; évolution de la piste
  (plus rapide au fil de la séance) ; une erreur peut éliminer.
- Le temps de qualification donne aussi un **indicateur de rythme** à l'ingénieur (13d).

### 2.2 Essais libres (sous-phase « 13b+ », juste après la 13b ; programmes validés par le porteur le 28/11)

Le temps de piste est limité : l'écurie répartit ses séances entre des programmes (choix rapide sur mobile, même règle pour l'IA selon sa
personnalité) :
| Programme | Effet |
| --- | --- |
| Réglages | réglage mieux trouvé → un peu plus de rythme tout le week-end (D-161 : réglages à découvrir) |
| Longs relais | l'ingénieur estime mieux l'usure → meilleure stratégie |
| Simulation de qualification | meilleure préparation du tour lancé |
| Apprentissage du circuit | moins de pénalité de nouveauté |
| Essai d'une pièce | découverte plus tôt d'un défaut caché (12b) |
| Jeune pilote | expérience pour lui, moins de temps pour le titulaire |

### 2.3 Temps au tour réels

En course, chaque tour a sa **vraie masse** (≈ 100 kg de carburant au départ, presque rien à la fin) et ses pneus : les premiers tours sont
nettement plus lents que la qualification, les derniers s'en rapprochent (mesuré en 13a bis : tour de course moyen ≈ 4 % plus lent).
Les temps sont affichés en secondes.

## 3. Départ et premier tour

- Gain ou perte de places au départ selon la compétence **départs**, la motricité de la voiture, la place sur la grille (côté propre ou
  sale), un aléa borné ; accrochages possibles au premier virage (risque selon le circuit et la densité du peloton).
- Bornes : un très bon départ gagne 1 à 3 places, rarement plus ; le premier tour ne doit pas devenir une loterie (mesure : variation
  moyenne des places au premier tour par circuit).

## 4. Le tour en course

Pour chaque voiture : temps du tour = rythme de base (voiture de course + pilote + forme) + pneus + carburant + batterie + consignes
(13a) + **effets de la position** :
- **air perturbé** : à moins d'environ 1 s d'une voiture, perte selon la part du tour en virages rapides (sensibilité à l'appui du circuit) ;
- **aspiration** : gain en ligne droite à moins d'environ 1 s (sensibilité à la traînée et aux lignes droites du circuit) ;
- **trafic** : une voiture plus lente devant impose son rythme tant qu'elle n'est pas dépassée.

## 5. Les dépassements

À chaque tour, pour chaque voiture à moins d'un seuil de la voiture devant, une **tentative** est possible dans les zones de dépassement
du circuit (fiches de la phase 11b : difficulté de dépassement, lignes droites, zones de freinage). Probabilité de réussite selon :
- l'écart de rythme du tour (pneus, carburant, voiture) et l'écart réel ;
- l'aspiration et l'énergie électrique disponible (batterie : dépenser pour attaquer, garder pour défendre) ;
- la compétence **dépassement** de l'attaquant contre la **défense** du défenseur, et leurs freinages ;
- la difficulté du circuit (Monaco ≪ Monza) ;
- le risque accepté (consigne de conduite agressive : plus de tentatives, plus d'accrochages).
Une tentative ratée coûte un peu de temps et de pneus ; un accrochage peut abandonner ou abîmer (13c pour les dégâts gradués).
Garde-fous : pas d'échange de position répété entre la même paire au même tour ; une voiture qui vient d'être dépassée ne peut repasser
qu'avec un vrai avantage (fin de la « boucle » d'APEX).

## 6. Arrêts aux stands

Les arrêts de la 13a deviennent des **événements dans la course** : la voiture perd la perte réelle de la voie des stands du circuit
(fiche 11b `strategie.stands.perteNetteS`) plus l'immobilisation ; elle ressort **à sa place réelle**, éventuellement dans le trafic. Les
pneus neufs sont froids (mise en température de la 13a bis). C'est ce qui rend l'undercut et l'overcut possibles et risqués ; leur
**décision** en course (réagir à l'adversaire) vient en 13c-13d.

## 7. Compétences en situation (D-194 (3))

Dépassement, défense, départs reçoivent leur situation ; leur poids dans la moyenne du rythme passe à **zéro** (le reste des poids est
renormalisé). Intelligence de course et retour technique restent dans la moyenne jusqu'en 13c-13d (puis même traitement).

## 8. Vue 2D schématique

Une bande par circuit (le tour déroulé) et des points de couleur aux positions calculées ; événements écrits (dépassement, arrêt).
Elle **lit** l'état de course : aucune règle propre.

## 9. Mesures (critères de réussite)

- Dépassements par course plausibles et différents selon le circuit ; places gagnées départ → arrivée ; aucun échange répété en boucle.
- Monaco : la qualification compte beaucoup plus qu'à Monza (corrélation grille → arrivée).
- Banc des 22 pilotes refait : un bon défenseur ou un bon dépasseur gagne des places en situation.
- Batterie : gardée pour attaquer → dépassements réussis plus fréquents.
- Deux finesses : mêmes champions, écarts de points mesurés.
- Coût : course regardée < 1 s sur téléphone ; saison simulée < +50 %.
- Campagne complète 20 × 30 contre la référence 13a bis, tous les indicateurs.

## 10. Sauvegardes

Format 37 : état de la course en cours (positions, écarts, ressources) quand le joueur l'a arrêtée ; grille de départ et classement des
qualifications dans les résultats. Migration et test.
