# Phase 11b — Rapport final : les 30 circuits (24/11/2026)

> Réponse au « go officiel » du porteur pour la finalisation des 30 circuits. Mesures **indicatives** (D-120).
> Statuts des données : **V** vérifié · **R** relevé (tours réels) · **E** estimé · **H** hypothèse · **C** calculé par le moteur.

## 1. Critères de fin de phase

| # | Critère du porteur | État | Preuve |
| --- | --- | --- | --- |
| 1 | Les 30 circuits sont présents | **Fait** | 30 dans `data/grille-2026/circuits.csv` et dans le monde de jeu (test) |
| 2 | Les 30 tracés sont techniquement exploitables | **Fait** | Tracé continu, longueur officielle ±1,5 %, vitesses plausibles (30 tests) |
| 3 | Les 30 fiches sont consultables dans le jeu | **Fait** | Écran « Circuits » : calendrier et hors calendrier, blocs A à E ; parcours navigateur sur téléphone et ordinateur |
| 4 | Calendrier de 20 Grands Prix et rotation | **Fait** | 10 permanents chaque saison, rotation vérifiée sur 40 saisons, les 30 circuits courent au moins une fois |
| 5 | Climats et historiques intégrés | **Fait** | 12 mois pour 30 circuits (la pluie du jeu suit le mois) ; 260 éditions réelles |
| 6 | Contraintes techniques prêtes pour la phase 12 | **Fait, provisoire** | Indices calculés par le moteur, marqués sans effet avant leur formule |
| 7 | Stratégie et incidents préparés pour la phase 13 | **Fait** | Stands, zones de dépassement et de risque, murs, dégagements, évacuation |
| 8 | Tests automatisés | **Fait** | 502 tests sur 502 (dont 186 sur les données des 30 circuits, 7 sur le calendrier) |
| 9 | GitHub Actions et publication | **Vert jusqu'au n° 148** | Plusieurs exécutions ont été annulées parce qu'un envoi plus récent les remplaçait ; voir §8 |
| 10 | Export APEX Lab des 30 circuits | **Fait** | `export/apex-lab/` : 30 fichiers et un index (2 Mo) ; test de couverture |
| 11 | Rapport distinguant terminé, estimé et réservé | Ce document | §2 à §6 |

## 2. Ce qui est terminé

**Les 30 circuits**

| Groupe | Nombre | Source du tracé et des vitesses |
| --- | --- | --- |
| Pilotes (Monaco, Monza, Suzuka, Singapour, Mexico) | 5 | 5 tours de qualification 2026 (OpenF1), numérotation des virages rapprochée à la main |
| Validation | 21 | 5 tours de qualification 2025 ou 2026 (OpenF1) |
| Reconstruits : Portimão, Istanbul, Paul-Ricard | 3 | 5 tours de qualification 2021–2022 (archives publiques de télémétrie du chronométrage officiel) |
| Reconstruit : Kyalami | 1 | Tracé public GeoJSON (licence MIT) ; **aucune vitesse réelle** (configuration actuelle jamais courue en F1) : vitesses calculées par le moteur |

**Fiabilité de la méthode GeoJSON**
- Je l'ai contrôlée sur les 3 autres circuits reconstruits, pour lesquels j'ai aussi les tours réels.
- Écart de temps au tour modélisé : 0,2 % à Portimão, 0,8 % à Paul-Ricard, 2,4 % à Istanbul.

**Défauts de tracés trouvés par les tests, et corrigés**
- Un saut de position de 18 à 32 m au départ, sur Lusail et les 3 circuits reconstruits : les tours moyennés ne commençaient pas au même endroit. Réparé par interpolation en ligne droite.
- Deux Grands Prix la même année sur un même circuit (Bahreïn 2020, Silverstone 2020, Spielberg 2020 et 2021) : c'est réel, ce n'est pas une erreur.

**Fiche de chaque circuit**
- La fiche est générée par le **moteur du jeu** (`tools/circuits/generer-fiches-jeu.mts`).
- **A. Présentation** : tracé, virages numérotés, lignes droites, freinages, dénivelé.
- **B. Exigences** : deux caractéristiques essentielles, une moins importante, avec explication et limites. Calcul du moteur, normalisé sur le calendrier, règle du gain négligeable. Un test vérifie que la fiche reproduit le calcul du moteur.
- **C. Conditions** : climat du mois du Grand Prix dans la partie, revêtement, pneus, altitude, énergie.
- **D. Historique** : éditions réelles, éditions de la partie.
- **Stratégie et incidents.**
- **E. Préparation du week-end** : réglages « à découvrir en essais libres », jamais donnés (D-161).

**Identité des circuits** : la caractéristique n° 1 varie sur les 24 circuits du calendrier.

| Caractéristique n° 1 | Circuits |
| --- | --- |
| Faible traînée | 9 |
| Motricité | 7 |
| Appui | 4 |
| Puissance | 2 |
| Adhérence mécanique | 2 |

Aucune ne domine la moitié du calendrier, et un test le vérifie.

**Calendrier**
- 10 permanents. Les 10 autres places sont attribuées sans tirage, selon une règle connue de tous :
  - les contrats en cours gardent leur place, d'après les fins de contrat réelles publiques ;
  - les places libres vont ensuite aux circuits absents depuis le plus longtemps ;
  - chaque nouvel entrant reçoit un contrat de 3 saisons.
- Chaque changement est annoncé publiquement.
- Exemple de la graine 42 :
  - 2031 : 4 contrats arrivent à échéance ; Kyalami, Portimão, Paul-Ricard et Istanbul entrent ;
  - 2032 : Yas Marina revient.
- Aucun Grand Prix n'est jamais supprimé : un circuit qui sort garde ses archives.

**Climat**
- La pluie du jeu suit le **mois réel** du Grand Prix : un Grand Prix déplacé change de climat.

**Stands**
- Le **temps de passage** dans la voie (relevé, arrêt compris) est distingué de la **perte nette** par rapport à un tour sans arrêt (calculée).
- La perte nette va de 13,4 à 22,5 s selon le circuit. Elle est relevée sur 26 circuits et estimée pour les 4 reconstruits.

**Sauvegardes**
- Format 29.
- Une ancienne partie garde son calendrier de 24 Grands Prix et ses classes de pluie (migration testée).
- Une sauvegarde reprise donne exactement la même suite qu'une partie jouée d'une traite (test).

**Erreur de ma part, corrigée avant livraison**
- Les contrats de circuits étaient partagés entre deux parties créées depuis les mêmes données : faire avancer l'une modifiait l'autre.
- Deux tests de déterminisme l'ont révélé. Chaque partie a désormais ses propres contrats.

## 3. Ce qui est estimé (à recouper)

| Donnée | Statut | Remarque |
| --- | --- | --- |
| Bosses, vibreurs, murs, dégagements, largeur, abrasivité, évacuation, stress des pneus | E (H pour Kyalami) | Aucune source ouverte chiffrée accessible ; connaissance publique générale ; `data/circuits/caracteres.csv` |
| Numérotation des virages de 25 circuits | R automatique, « à vérifier » | Les N sommets de courbure les plus marqués (N officiel) ; noms seulement pour les 5 pilotes. Le fichier officiel de MultiViewer existe dans des archives publiques, mais **je ne l'ai pas utilisé** puisque tu avais refusé cette source |
| Pluie pendant la course | E | Normales officielles (V), mais la part des jours pluvieux où il pleut pendant la course (0,35) est une hypothèse |
| Mois et heure des circuits hors calendrier | E | Dernière date connue |
| Zones de dépassement, difficulté de dépasser | C provisoire | Longueur d'aspiration et freinage. Plausible, mais imparfait : Suzuka sort plus « facile » que sa réputation |
| Contrat de rotation de 3 saisons | H | À discuter (D-164) |
| Caractéristiques essentielles | C provisoire | Voiture de référence aux ailerons presque toujours au maximum (D-163, phase 12) |

## 4. Ce qui est réservé aux phases suivantes

| Fonction | Phase | Ce qui est déjà prêt |
| --- | --- | --- |
| Effet des contraintes techniques sur les voitures (appui, traînée, refroidissement, énergie, bosses…) | 12 | Indices par circuit, registre des caractéristiques, canal météo unique |
| Aérodynamique et vrais compromis appui/traînée | 12 | Diagnostic D-163 |
| Réglages du week-end, retours d'ingénieurs | 13 | Structure du bloc E |
| Météo dynamique, température de piste, pneus | 13 | Climat sur 12 mois, abrasivité, stress des pneus |
| Safety Car, VSC, drapeaux rouges nés des incidents | 13 | Zones à risque, murs, dégagements, évacuation, historique réel pour vérifier (jamais pour caler) |
| Stratégie, arrêts, dépassements | 13 | Perte nette aux stands, zones de dépassement |

## 5. Effet sur les courses (avant/après, mêmes 20 graines × 10 saisons)

**Rapports complets** (tous les indicateurs suivis)
- `donnees/campagne-vivier-avant.md` ;
- `donnees/campagne-vivier-apres.md`, avec la colonne « référence » = avant.

**Changement mesuré**
- Le calendrier passe de 24 à 20 Grands Prix, et la pluie suit le climat réel du mois.
- Aucun coefficient d'équilibrage n'a été touché.

| Indicateur | Avant | Après |
| --- | --- | --- |
| Courses sous la pluie par saison | 2,7 | **1,7** |
| Vainqueurs différents par saison | 6,2 | 5,7 |
| Écuries victorieuses par saison | 4,3 | 4,0 |
| Part des victoires de l'écurie dominante | 57 % | 58 % |
| Victoires inattendues par saison | 2,5 | 2,2 |
| Écart de points entre les deux premiers | 66 | 55 |
| Titre encore ouvert avant la dernière manche | 27 % | **35 %** |
| Dominations (≥ 120 points d'écart) | 14 % | 11 % |
| Séries avec 5 titres consécutifs ou plus | 45 % | 45 % (objectif 0–25 % : **toujours non atteint**) |
| Champions pilotes différents sur 10 saisons | 4,2 | 4,3 |
| Écart 1re–dernière voiture (% du temps au tour) | 1,54 | 1,53 (dans l'objectif : 53 % des saisons) |

**Lecture**
- Moins de courses donne moins de points : les championnats restent plus souvent ouverts jusqu'au bout.
- **Défavorable : la pluie est 37 % plus rare**, ce qui donne un peu moins de surprises.
  - Cause : avec le climat réel, la probabilité de pluie pendant la course est plus basse que les anciennes classes du jeu. Exemple : Silverstone passe de 25 % à 9 %.
  - L'hypothèse de 0,35 pesait beaucoup.
  - **Vérifié la nuit du 24 au 25/11** contre les 10 dernières éditions réelles des 30 circuits (récits de course, vérification seulement) : 29 courses humides sur 258 (11,2 %), contre 9,0 % pour le modèle. La part passe à **0,43**, un seul facteur global (répartition entre circuits et mois inchangée). Effet mesuré : `docs/rapports/audit-phases-1-11/rapport.md` §4.
- Les **dynasties** sont inchangées. Conformément à ta consigne, aucune correction avant la fin de la phase 12.
- **Finances (mesuré la nuit du 24 au 25/11)** : avec 20 Grands Prix au lieu de 24, les coûts d'opérations baissent d'environ 4,8 M€ par an et par écurie. Cet argent part presque entièrement en développement (+4,6 M€), sous le plafond. La trésorerie ne change pas de façon notable. Les probabilités du sponsoring ont été ramenées au nombre réel de Grands Prix (audit, constat 5.8).

## 6. Problèmes ouverts

1. **Ailerons presque toujours au maximum** : la voiture de référence est en cause, refonte en phase 12 (D-163). Les caractéristiques essentielles et la « sensibilité aux réglages » restent donc provisoires.
2. **Virages de 25 circuits** : numérotation automatique. Les numéros peuvent différer de l'officiel sur les circuits à virages discrets (bosses, courbes rapides). À relire, ou à recouper avec une source que tu autoriserais.
3. **Pluie moins fréquente** (§5) : vérifiée contre l'historique réel et corrigée (0,43).
4. **Zones de dépassement** : méthode simple, quelques résultats discutables (Suzuka).
5. **Kyalami** : sans relief ni vitesse réelle ; historique indicatif seulement (anciennes configurations, 1977–1993).
6. **Données réelles de vitesses 2021–2022** (Portimão, Istanbul, Paul-Ricard) : faites par des voitures d'une autre génération. Elles servent à la géométrie et au contrôle, pas à caler.

## 7. Décisions

- **D-164 (mise en œuvre)** : le contrat de rotation de 3 saisons est **à discuter**.
- **Écart avec D-141** : la plage du vote reste 20–24. Partant de 20, le vote ne peut qu'**augmenter** le nombre de Grands Prix. Si tu veux pouvoir le réduire, il faudra élargir la plage.

## 8. Reproduire

```
npx vitest run                                   # 502 tests
npx tsx tools/circuits/generer-fiches-jeu.mts    # fiches et climat du jeu
npx tsx tools/banc-specialisation.mts f.json     # banc sur 30 tracés
npx tsx tools/export-apex-lab.mts export/apex-lab tous
npm run equilibrage -- --graines 20 --saisons 10 --reference docs/rapports/phase-11b/donnees/campagne-vivier-avant.json
```

Les outils de collecte et les sources sont décrits dans `tools/circuits/LISEZMOI.md`, section 7.
