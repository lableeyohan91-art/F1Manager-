# Phase 12a — rapport : architecture et physique des monoplaces (25/11/2026)

> Conception validée : D-170 (`docs/systemes/phase-12-conception-detaillee.md`). Mise en œuvre : **D-171**.
> Mesures **indicatives** (D-120). Données complètes : `donnees/` (toutes les colonnes de tous les indicateurs).

## 1. Ce qui est fait

| Élément | État |
| --- | --- |
| Refonte aérodynamique (D-163) | Faite, **partielle** (§2) |
| Temps au tour physique sur les 30 circuits, branché sur les courses (fin de D-162) | Fait |
| Six pièces, valeurs de F1 Manager 2024 (jours, coûts), concepts à vrai compromis | Fait |
| Frontière de compromis (savoir de la phase 8, rendement décroissant) | Fait |
| Projets de conception au rythme normal, coût payé au lancement, fabrication, installation | Fait |
| IA et directeur technique délégué : mêmes commandes, jugement sur les circuits à venir | Fait |
| Reconception absolue aux réformes (fin du rappel vers la moyenne), intersaison | Fait |
| Paris d'architecture aux grandes réformes | Fait (corrigé une fois, §4) |
| Refroidissement (chaleur du mois, altitude) | Fait |
| Écran Technique : voiture circuit par circuit, pièces, projets, architecture | Fait |
| Format de sauvegarde 31, migration testée | Fait |
| Tests | 533, tous verts (dont 10 nouveaux) ; moteur pur ; parcours navigateur réussi (34 étapes) |

**Pas encore fait** (prévu en 12b, 12c, 12d) :
- fatigue et rythmes de travail ;
- heures de soufflerie et de CFD ;
- événements ;
- fabrication urgente et stocks ;
- découvertes majeures.

**Choix provisoire** : la fiabilité et la gestion des pneus restent deux notes abstraites, jusqu'aux phases 12c et 13.

## 2. Refonte aérodynamique (D-163)

- **Modèle** :
  - les ailerons sont séparés du corps de la voiture ;
  - le réglage d'ailerons du week-end ne change que leur part ;
  - un supplément d'aileron coûte sa traînée ;
  - l'aérodynamique active ouvre le volet d'une quantité fixe, et seulement sur les vraies lignes droites (au moins 300 m).
- **Calage**, avec des contraintes publiques : Monza et Las Vegas se courent avec moins d'appui que Monaco et le Hungaroring.
  - Résultat sur les 21 circuits de validation : **3,5 % d'écart de temps au tour** (3,4 % avant la refonte).
- **Résultat partiel, à dire franchement** :
  - Monza (0,70) et Las Vegas (0,05) choisissent un réglage intermédiaire, mais **la plupart des circuits restent au fort appui maximal**, Spa et Bakou compris, ce qui est faux.
  - Cause : la voiture du modèle reste un peu lente sur la plupart des tracés, et l'appui est le levier le moins cher pour regagner du temps.
  - À reprendre avec les réglages de la phase 13 (D-161).
- **Conséquence pour les pièces** : le réglage du week-end absorbe déjà la plus grande part du choix appui/traînée. J'ai donc réglé chaque concept pour qu'il soit **neutre sur un circuit moyen**. Résultat : **aucun concept n'est meilleur partout**.

| Pièce | Le concept « + » gagne sur… | Exemples |
| --- | --- | --- |
| Aileron arrière (fort appui) | 15 circuits sur 30 | gagne à Sepang et Lusail ; perd à Monza et Djeddah |
| Aileron avant (fort appui) | 16 sur 30 | |
| Fond plat (effet de sol maximal) | 15 sur 30 | gagne à Silverstone ; perd à Mexico et Bakou (bosses) |
| Châssis (agilité mécanique) | 13 sur 30 | gagne à Mexico ; perd à Silverstone |
| Suspensions (souplesse) | 16 sur 30 | gagne à Monaco et Bakou |
| Pontons (refroidissement généreux) | selon le mois | paie l'été et en altitude |

## 3. Courses : 10 saisons (20 graines, même référence qu'avant la 12a)

| Indicateur | Avant | Après |
| --- | --- | --- |
| Vainqueurs différents par saison | 5,8 | **4,8** |
| Écuries victorieuses par saison | 4,0 | **3,1** |
| Part des victoires de l'écurie dominante | 58 % | 64 % |
| Écart 1re–dernière voiture (objectif 1,5–4 %) | 1,54 % (52 % dans l'objectif) | **2,10 % (97 %)** |
| Corrélation voiture ↔ points | 0,87 | 0,93 |
| Victoires inattendues par saison | 2,2 | 1,5 |
| Champions constructeurs différents sur 10 saisons | 2,5 | 2,2 |
| Séries de 5 titres consécutifs ou plus (objectif 0–25 %) | 55 % | 55 % |
| Écuries sans victoire sur 10 saisons | 3,0 | **6,5** |
| Remontées (+3 places) | 6,6 | **3,2** |
| Dernière écurie avec au moins 1 point (objectif 60–90 %) | 56 % | **26 %** |
| Titre ouvert avant la dernière manche | 32 % | 29 % |
| Pluie, abandons, coéquipiers | inchangés | inchangés |

## 4. Le problème principal : la hiérarchie se fige (30 saisons, 10 graines)

| Indicateur | Avant la 12a | 12a | V1 : savoir qui sature plus vite | V2 : paris plus coûteux | V3 : V1 + V2 |
| --- | --- | --- | --- | --- | --- |
| Champions constructeurs différents (30 saisons) | **6,3** | 3,7 | 4,8 | 3,6 | 4,8 |
| Plus longue série de titres | 6,2 | 8,1 | 7,2 | 8,0 | 6,3 |
| Séries avec 5 titres consécutifs ou plus | 70 % | 90 % | 80 % | 90 % | 80 % |
| Remontées (+3 places) | **38,9** | 9,4 | 17,0 | 10,2 | 15,0 |
| Écuries changeant d'étage par saison | 3,8 | 2,1 | 2,5 | 2,0 | 2,4 |
| Vainqueurs différents par saison | 7,4 | 5,9 | 6,5 | 5,7 | 6,8 |
| Écart 1re–dernière voiture | 0,98 % | 1,58 % | 1,39 % | 1,64 % | 1,45 % |
| Dernière écurie avec au moins 1 point | 80 % | 36 % | 49 % | 40 % | 43 % |
| Titre ouvert avant la dernière manche | 30 % | 27 % | 30 % | 32 % | 29 % |

**Lecture franche**

1. **La 12a, telle quelle, va à l'inverse de ton objectif** (des écuries qui montent et qui tombent) : la hiérarchie bouge beaucoup moins.
2. **Le mouvement de l'ancien modèle était en partie artificiel.**
   - Toutes les voitures convergeaient vers le même plafond : à la fin, 0,98 % seulement entre la première et la dernière.
   - Le moindre aléa mensuel changeait donc l'ordre. C'était le défaut « voitures parfaites » mesuré en phase 3.
   - La 12a supprime ce défaut, et avec lui ce faux mouvement.
3. **Cause du figement** : la frontière de chaque écurie suit son **savoir accumulé**.
   - Les grandes écuries ont plus de capacité de recherche, donc plus de savoir, donc une frontière plus haute, durablement.
   - Exemple : Mercédes plafonne vers 60 points de savoir, Haass vers 22.
4. **Paris d'architecture** :
   - D'abord, toutes les écuries choisissaient la même architecture : l'avis du directeur technique s'appuyait sur tout le savoir accumulé. **Corrigé** : seule la recherche menée sur le nouveau règlement éclaire le pari.
   - Les paris divergent maintenant (exemple : Ferrary se trompe en 2032 et recule), mais leur effet reste trop faible pour rebattre la hiérarchie. Les rendre plus coûteux (V2) ne change rien.
5. **Seule V1 aide vraiment** (le savoir sature plus vite : l'avance des riches se tasse), sans revenir au niveau d'avant.

**Leviers restants, prévus par la conception validée** :
- **12b** : le barème inversé des heures de soufflerie (le dernier a 1,64 fois les heures du champion) agit **directement** sur l'expertise, ce qui manque aujourd'hui.
- **12b** : l'exécution incertaine des projets (fatigue, erreurs).
- **12d** : les découvertes majeures.

Je recommande de **ne pas recalibrer davantage maintenant** (méthode D-095), mais d'adopter V1 tout de suite si tu es d'accord, puis de mesurer après la 12b.

## 5. Autres effets à signaler

- **Finances** : les écuries de tête, près de leur frontière, dépensent moins que leur budget de développement (exemple : 29 M€ sur 73 M€). Leur trésorerie gonfle (Mercédes vers 480 M€ en 2031). À surveiller.
  - Piste : en 12b, l'IA pourrait reporter cet argent sur la recherche.
- **Temps de calcul** : environ +50 % par saison simulée (cache compris). Une saison reste sous la seconde sur ordinateur ; à mesurer sur téléphone.

## 6. Décisions à prendre

1. **Adopter V1** (savoir qui sature plus vite, `FRONTIERE.echelleSavoir` 30 → 12) ? Ma recommandation : oui.
2. **Continuer avec la 12b** (fatigue, rythmes, soufflerie et CFD avec le barème réel, événements de conception), qui apporte le principal levier de rattrapage ?
3. **Question 10 de D-170** (dilemmes techniques bloquants ou non) : toujours à confirmer avant la 12b.
