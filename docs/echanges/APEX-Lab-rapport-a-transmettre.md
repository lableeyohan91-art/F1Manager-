# Apex Lab v0.9 — météo et direction de course

**Date :** 23 novembre 2026  
**Statut :** laboratoire expérimental autonome ; ne modifie pas le dépôt F1 Manager de Claude.

## 1. Fonctionnalités ajoutées

- **Météo** : modes *historique par circuit*, *bruine*, *pluie forte*, *averse ponctuelle*, *pluie intermittente*, et anciens modes manuels. La pluie modifie progressivement l'humidité de piste, puis celle-ci sèche après l'averse. Les stratégies adaptatives (slicks/inter/pluie) peuvent en bénéficier ou se tromper.
- **Occurrences météo** : taux de courses « wet » ou « mixed », calculé à partir des récits historiques disponibles, puis **lissé** avec un a priori géographique distinct pour les circuits peu documentés (p. ex. Djeddah, Sakhir, Lusail). **L'intensité exacte et la durée des averses ne sont pas des statistiques observées** : leur distribution est une hypothèse de laboratoire.
- **SC/VSC/rouge par circuit** : relevés historiques *avec au moins une intervention*, séparés, avec dénominateurs propres à chaque catégorie. Fréquences lissées afin de ne pas transformer 1/1 en certitude. Les événements de course sont déterministes par graine et dotés d'une cause plausible. Une même course peut avoir plusieurs incidents. Les possibilités de pari sous neutralisation restent réelles.
- **Drapeaux jaunes et doubles jaunes** : désormais présents et montrés dans le récit de course. Un drapeau jaune local ralentit et empêche le dépassement sur le tour concerné (approximation par tour). **Leur fréquence reste une estimation liée au risque du circuit ; les archives utilisées ne permettent pas de les mesurer directement**.
- **Onglet statistique** : nombre de courses historiques observées, fréquences estimées, lien source, et campagne rapide de 1 000 courses sur le circuit sélectionné.
- **Conseils stratégiques** : les paris sont rejoués avec les mêmes événements exogènes. En météo « historique », les plans pré-course utilisent une prévision sèche simplifiée et ne connaissent pas l'averse exacte.

## 2. Exemples d'observations de F1 (données historiques, NON simulations)

| Circuit | Course avec SC | Course avec VSC | Course avec drapeau rouge | Pluie humide/mixte documentée |
|---|---:|---:|---:|---:|
| Singapour / Marina Bay | 13/17 (76 %) | 4/10 (40 %) | 0/17 (0 %) | 2/16 (12,5 %) |
| Barcelone-Catalogne | 7/34 (21 %) | 3/12 (25 %) | 0/36 (0 %) | 2/33 (6 %) |
| Spa-Francorchamps | 20/32 (63 %) | 1/12 (8 %) | 6/59 (10 %) | 18/54 (33 %) |
| Monaco | 16/33 (48 %) | 5/11 (45 %) | 9/72 (13 %) | 12/58 (21 %) |
| Djeddah | 5/5 (100 %) | 2/5 (40 %) | 1/5 (20 %) | archives météo non consolidées dans cette version |

### Très important : dénominateurs différents

La Safety Car n'a été introduite de façon permanente qu'en 1993, la VSC en 2015 ; les drapeaux rouges existent depuis les débuts du championnat. Ces archives ne mesurent pas toutes la même période. Les événements d'aujourd'hui ont aussi des protocoles différents de ceux d'il y a plusieurs décennies. Les proportions observées servent **d'ancrage**, pas de prévision exacte pour la saison suivante.

La source est le site **TracingInsights**, statistiques dérivées de **F1DB, CC BY 4.0** ; météo historique catégorisée à partir des articles Wikipedia, **CC BY-SA 4.0**. Liens directs et données brutes par circuit inclus dans `historique-circuits.csv` / `historique-circuits-sources.json`.

## 3. Grande campagne indépendante de la v0.9

**24 circuits × 2 000 graines = 48 000 profils simulés de météo et d’interventions** (tirages rapides sans exécuter à chaque fois les 22 voitures). Ces statistiques sont des **sorties du générateur d’événements Apex Lab**, pas des mesures de la F1 réelle.

| Indicateur | Résultat |
|---|---:|
| Courses avec au moins une SC (moyenne 24 circuits) | **47,7 %** |
| Courses avec au moins une VSC | **35,5 %** |
| Courses avec au moins un rouge | **7,7 %** |
| Courses humides avec pluie au moins une fois | **14,1 %** |
| Durée de l'audit hors interface (Node.js, ordinateur d'essai) | ~9,4 s |

Quelques probabilités **simulées** :

- Singapour : SC **69,4 %**, VSC **37,9 %**, rouge **2,2 %**, pluie **15,3 %**.
- Barcelone : SC **25,3 %**, VSC **29,2 %**, rouge **1,4 %**, pluie **6,9 %**.
- Spa : SC **63,6 %**, VSC **18,3 %**, rouge **10,4 %**, pluie **34,8 %**.
- Djeddah : SC **68,5 %**, VSC **36,3 %**, rouge **12,9 %**, pluie **1,6 %**.

*Détails exhaustifs dans `campagne-48000-courses.json`. Les taux simulés correspondent à l’échantillon de 48 000 profils d’événements et incluent le lissage des petits échantillons.*

## 4. Tests effectués

- Tests de compatibilité initiaux et scénarios de fumée passés (12 contrôles principaux).
- **12 groupes de vérification v0.9** : nombres sources, limites des intensités et humidités, 7 modes météo, mêmes graines et mêmes résultats, 22 pilotes, distribution SC/VSC/rouge sur des centaines de graines.
- Interface HTML autonome ouverte dans **Chromium desktop et mobile**, sans erreur JavaScript ; changement de circuit, panneau historique, campagne de 1 000 courses et **comparateur de 4 graines** (6 stratégies + conseils radio) validés.

## 5. Limites encore importantes — à traiter avant le moteur final

1. **Jaunes** : leurs occurrences ne sont PAS encore calibrées sur une série de messages Race Control par circuit. À faire : extraire les signaux *YELLOW/DOUBLE YELLOW* de l'archive FIA/OpenF1, identifier les races, normaliser les doublons par secteur et mesurer fréquence et durée. **Ne pas confondre nombre de messages et nombre de phases de drapeau.**
2. **Rouge** : les durées sont simplifiées (neutralisation sur deux tours) et ne reproduisent pas complètement l'arrêt de course, le chronomètre réel et les procédures de reprise. Le taux d'occurrence est ancré, pas la simulation réglementaire.
3. **SC/VSC** : les probabilités calibrées sont par *course*, sans rejouer exactement une chaîne de faits accident → jaunes → évacuation → VSC/SC → rouge ; les causes sont illustratives. À relier plus strictement aux événements au moment de la phase 13.
4. **Météo** : archives « wet/mixed » souvent anciennes, mois de calendrier et météo réelle heure par heure non importés ; aucune distribution historique fiable d'intensité/durée. Il faut compléter avec météo tour par tour et données modernes.
5. **Validation** : reproduire les distributions et vérifier la valeur de l'undercut/overcut, des coups de pluie et des décisions SC dans des campagnes contrefactuelles plus nombreuses, sans recherche de coefficients qui rendent systématiquement gagnante une stratégie.

## 6. Sources consultées

- Statistiques des circuits : https://tracinginsights.com/stats/compare/circuits
- Méthode et périodes de couverture : https://tracinginsights.com/stats/methodology
- Fichiers historiques réutilisables : https://tracinginsights.com/stats/data
- Archives pour poursuivre le travail sur les drapeaux jaunes : https://openf1.org/ et https://api.openf1.org/v1/race_control

Aucun résultat du laboratoire n'est présenté comme une statistique observée du championnat réel.