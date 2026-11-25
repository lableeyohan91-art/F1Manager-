# Phase 12 — Conception détaillée : département technique, pièces, soufflerie, fabrication, renouvellement des hiérarchies

> **Statut : PROPOSITION de Claude Code (25/11/2026), soumise au porteur. Rien n'est validé ni codé.**
> Demandes du porteur : messages « Phase 12 — conception et recherche des monoplaces », « Développement des monoplaces : conception, recherche, soufflerie, fatigue et innovations » et « Complément : équilibrage, renouvellement des hiérarchies et révolutions techniques » (25/11/2026).
> Fiche compagnon : `phase-12-fatigue-evenements.md` (fatigue, stress, alertes, événements, découvertes).
> Cadre validé : D-109 (orientations), D-114 (fondations techniques), D-128 et D-132 (recherche de la phase 8), D-140 (usure du succès), D-160 et D-161 (caractéristiques et réglages), D-162 et D-163 (profil de vitesse et refonte aérodynamique), D-166 (budget payé).
> Légende : **[VALIDÉ]** décision existante · **[EXISTANT]** déjà codé · **[PROPOSÉ]** à valider · **[À DÉCIDER]** question ouverte (§13).

## 0. En une page

1. **On ne recrée rien en double.**
   - Les 12 domaines techniques, le savoir (fondamental et réglementaire), les deux programmes de recherche continus, les règlements et les découvertes de la phase 8 restent la base.
   - La phase 12 ajoute à côté des **projets** : conception d'une pièce, fabrication, installation. Ces projets puisent dans le **même réservoir** d'ingénieurs et d'heures de soufflerie que les programmes.
2. **Les six pièces et les valeurs de F1 Manager 2024 sont reprises telles quelles** comme référence de départ (§3).
   - 1 $ du jeu de référence = 1 € de notre jeu. Notre plafond de 215 M€ est déjà le chiffre réel en dollars.
   - Le calcul du §3.3 montre que ces coûts entrent naturellement dans nos budgets de développement (71 à 125 M€ par an). **Je ne propose aucune adaptation à ce stade.**
3. **Une pièce change des paramètres physiques** (appui, traînée, masse, adhérence mécanique, refroidissement), pas une note.
   - La performance sort du profil de vitesse, sur les 30 circuits.
   - Prérequis absolu : la **refonte aérodynamique** acceptée en D-163 (aujourd'hui les ailerons sont au maximum sur 25 tracés sur 26, donc aucun compromis appui-traînée ne serait visible).
4. **La soufflerie et la CFD deviennent la ressource la plus stratégique** (§5), avec le barème réel 2026 (70 % pour le champion, 115 % pour le dernier, 6 périodes, nouveau calcul à mi-saison).
   - Elles agissent par **trois effets distincts** : expertise acquise, exploration de variantes (CFD), validation et détection des défauts (soufflerie).
   - Chaque effet a son propre rendement décroissant. Aucun nombre d'heures ne devient un coefficient de vitesse.
5. **Fatigue, stress, événements, découvertes** : fiche compagnon. Résumé :
   - **une seule jauge visible**, la charge et fatigue de chaque pôle technique ;
   - le **stress** individuel des responsables existe déjà dans le moteur : on le nourrit, on ne crée pas de second système ;
   - les alertes viennent de l'état simulé ;
   - environ 7 % des conceptions ont un événement narratif ;
   - environ 20 % des programmes de recherche en ont un par an ;
   - trois niveaux de résultat (mineur, fausse piste, majeur).
6. **Renouvellement des hiérarchies** (§10) : trois leviers **techniques et réels**, plus un levier d'**équilibrage assumé et réglable**.
   - Les leviers réels : paris de concept à chaque grand règlement, innovations qui se diffusent seulement une fois vues en piste, suppression du rappel vers la moyenne qui existe aujourd'hui.
   - Le levier assumé : amplification du barème de soufflerie.
   - Cela demande de **reformuler D-081** (projet D-169, à valider).
7. **Découpage** : 12a architecture et physique → 12b conception, soufflerie, fatigue, événements de conception → 12c fabrication et garage → 12d recherche appliquée, événements de recherche, innovations.
   - La phase 11b et la phase 13 ne sont pas modifiées.

---

## 1. Audit de l'existant

### 1.1 Ce qui est déjà codé et fonctionne [EXISTANT]

| Élément | Où | État | Devenir en phase 12 |
| --- | --- | --- | --- |
| 12 domaines techniques, voisins, compétences et installations utiles | `balance/technique.ts` (`DOMAINES`) | Stable (D-132) | **Conservés.** La colonne `caracs` (lien provisoire avec les 6 notes) disparaît |
| Savoir fondamental et réglementaire par écurie et domaine, rendements décroissants (K = 40), voisins (15 %), vieillissement | `systems/technique` | Fonctionne, provisoire | **Matière première de la conception** : il fixe la frontière de compromis (§4) |
| 2 programmes de recherche continus (sujet, horizon, part des moyens, suspension, remise en route) | idem | Fonctionne | **Conservés, sans durée imposée.** Ils partagent la capacité avec les projets (§2) |
| Règlements : grandes réformes votées (4 orientations, intensité par domaine), évolutions mineures, obsolescence | idem, `politique` | Fonctionne | **Conservés.** On y ajoute les bornes de la frontière et le « paysage » des concepts (§10.2) |
| Découvertes : rares, expliquées, copiées à 50 % par saison | `DECOUVERTES` | Fonctionne, très rares (base 0,004 par période) | **Fusionnées** avec les événements de recherche (fiche compagnon §5) : un seul système de découvertes |
| Conception provisoire à l'intersaison et aux réformes (qualité relative à la **moyenne de la grille**) | `technique/conception.ts` | Jetable par construction | **Remplacée.** Son rappel vers la moyenne est contraire à ton objectif (§10.4) |
| Développement des 6 notes abstraites toutes les 4 semaines | `saison/index.ts` (`developper`) | Provisoire ; **converge vers le plafond** (mesuré en phase 3) | **Supprimé** en 12a, remplacé par les pièces |
| Restrictions aérodynamiques selon le classement (0,75 → 1,15, linéaire, règle votable) | `economie` (`restrictionAero`) | Fonctionne (phase 5a) | **Remplacées** par le barème réel en heures (§5.2), toujours votable |
| Plafond 215 M€, budget de développement, argent réellement payé (D-166) | `economie` | Validé | **Conservé.** Projets, fabrication et recherche s'y imputent |
| Départements (aéro, conception, simulation, production, fiabilité : effectif, niveau, cohésion) | tables | Fonctionne ; la cohésion n'est lue par aucune formule (audit 1.9) | **Deviennent les pôles** qui portent la capacité et la fatigue (§2, fiche compagnon) |
| Installations (soufflerie, CFD, simulateur, bureau d'études, usine, centre de recherche ; niveau 1–10, âge, entretien) | tables | Fonctionne | Chacune agit sur **une** opération précise (§8) |
| Responsables individualisés : directeur technique, responsable aéro, responsable conception (compétences conception, aérodynamique, corrélation, innovation, rigueur, vision technique, gestion de projet) | personnes | Fonctionne | Supervisent les projets ; leurs compétences pilotent la qualité, l'estimation et l'innovation |
| Stress, moral, motivation des personnes | `humain/etat.ts` | Fonctionne | Le stress des responsables reçoit la pression des projets (fiche compagnon §2) |
| Fatigue d'équipe avec intensités légère, normale, intensive et récupération | `stands` (D-129) | Fonctionne | **Même modèle** réutilisé pour les pôles techniques : cohérence pour le joueur |
| Profil de vitesse physique sur les 30 circuits (masse, puissance, appui, traînée, adhérences, aéro active) | `circuits/profil.ts` | Calé (D-163), **non branché sur les courses** (D-162) | **Devient le juge de la performance** en 12a |
| Usure du succès (D-140) | `humain/decision.ts` | Validé (exception assumée) | Conservée, elle freine désormais la capacité des pôles |

### 1.2 Ce qui est validé mais pas encore conçu [VALIDÉ, à concevoir]

- D-109 : pièces, fabrication séparée, garage, inventaire, innovations, veille légale, délégation par domaine, garde-fous.
- D-114 : frontière de compromis, circuits en segments, motoriste et intégration, chaîne de causes.
- D-163 : refonte aérodynamique (appui de base au milieu de la plage, aéro active sur l'aileron seulement, coût de l'appui).

### 1.3 Ce qui manque et que cette fiche propose

Capacité d'ingénierie et affectations · projets à durée · rythmes de travail · fatigue · soufflerie et CFD en heures · qualité estimée et réelle · erreurs et défauts cachés · événements de conception et de recherche · trois niveaux de découverte · fabrication et stocks · paris de concept aux réformes · IA et délégation du département technique.

---

## 2. Un seul réservoir de capacité : programmes continus et projets

C'est la réponse à « ne pas créer un second système qui ferait doublon ».

| | Programme de recherche (phase 8) | Projet de conception (phase 12) | Projet de recherche appliquée (12d) |
| --- | --- | --- | --- |
| But | Accumuler du **savoir** dans un domaine | Produire le **plan** d'une pièce | Explorer une idée précise (née d'un événement ou d'un pari) |
| Durée | **Continue, libre** (inchangé) | Discrète : base F1M (33 ou 44 jours) | Discrète, plus longue et incertaine |
| Nombre | 2 emplacements (inchangé) | Autant que la capacité le permet | 1 à la fois (garde-fou) |
| Consomme | Part des pôles, des heures, de l'argent | Idem | Idem |
| Produit | Savoir | Plan (version de pièce) + savoir | Savoir, solution débloquée ou rien |

**Capacité [PROPOSÉ].**
- Chaque pôle (aéro, conception, simulation) a une capacité en **jours-ingénieur par semaine**, issue de son effectif et de son niveau.
- Le joueur, ou son directeur technique s'il délègue, répartit cette capacité en pourcentages : programmes, projets, réserve.
- La « part des moyens » d'un programme de la phase 8 (5 à 35 %, 50 % au total) devient exactement cette part de capacité. Rien n'est retiré à la phase 8 : sa part abstraite reçoit enfin un sens concret.

**Taille d'équipe d'un projet [PROPOSÉ].**
- Chaque type de pièce a une équipe de référence (exemple : un aileron mobilise 30 % d'un pôle aéro de référence).
- Plus de monde n'accélère que jusqu'à ×1,3 (rendement en racine carrée). Mettre deux fois plus d'ingénieurs sur un aileron ne le fait pas en deux fois moins de temps.
- **Un grand pôle permet surtout de mener plus de projets en parallèle.** Exemple : Mercédes a 150 personnes en aéro, Haass 75. C'est un vrai avantage des grandes écuries, borné par le plafond : leurs salaires y sont comptés.

**Double affectation.**
- La charge d'un pôle est la **somme** de ses affectations, multipliées par le rythme.
- Au-delà de 100 %, chaque projet avance moins vite que prévu et la fatigue monte.
- Il est donc impossible d'être à pleine capacité partout sans conséquence (fiche compagnon §1).

---

## 3. Les six pièces et les valeurs de F1 Manager 2024

### 3.1 Valeurs de référence conservées [PROPOSÉ : reprise à l'identique]

| Pièce | Conception | Coût du projet | Fabrication | Coût unitaire |
| --- | --- | --- | --- | --- |
| Châssis | 33 j | 1,0 M | 10 j | 0,55 M |
| Aileron avant | 44 j | 1,8 M | 3 j | 0,225 M |
| Aileron arrière | 44 j | 1,8 M | 3 j | 0,275 M |
| Pontons | 33 j | 1,0 M | 8 j | 0,45 M |
| Fond plat | 33 j | 1,0 M | 8 j | 0,40 M |
| Suspensions | 33 j | 1,0 M | 8 j | 0,30 M |

- Rangées dans `balance/` avec leur source (guide technique communautaire de F1 Manager 2024) et leur unité : jours, M€ du jeu.
- Ce sont des valeurs **de base** pour une équipe de référence en rythme normal. Personnel, installations, rythme et circonstances les modulent.

### 3.2 Unités : monnaie et temps (deux questions distinctes de l'équilibrage)

- **Monnaie.** 1 $ du jeu de référence = 1 € de notre jeu. Notre économie est déjà calée sur les montants réels en dollars (plafond 215). Convertir au taux de change fausserait tout de 8 % environ, sans raison de jeu. **[À DÉCIDER Q1]**
- **Temps.** Notre moteur avance **par semaine**. Je propose de compter les projets **en jours** (7 jours par semaine à 100 % de productivité) plutôt que de les arrondir en semaines.
  - 33 jours = 4,7 semaines, 44 jours = 6,3 semaines : les chiffres de F1M restent exacts.
  - Une fabrication de 3 jours se termine dans la semaine où elle commence.

### 3.3 Compatibilité avec notre économie : comparaison chiffrée

Saison type d'une écurie active (hypothèse à vérifier en laboratoire) : 4 nouvelles versions de chacune des 6 pièces ; 3,5 exemplaires par version (2 voitures et des pièces de rechange) ; 5 M€ de casse.

| Poste | Calcul | Montant |
| --- | --- | --- |
| Projets de conception | 4 × (4 × 1,0 + 2 × 1,8) | 30,4 M€ |
| Fabrication | 4 versions × 3,5 jeux × 2,2 M€ par jeu complet | 30,8 M€ |
| Casse et remplacements | | ≈ 5 M€ |
| Voiture de l'année suivante (6 projets de base) | 6 × 1,3 | ≈ 8 M€ |
| **Total pièces** | | **≈ 74 M€** |

Mesuré aujourd'hui (2027) : budget de développement de 71 à 125 M€ pour les écuries au plafond, 74 M€ pour Haass.
- Les coûts de F1M entrent **sans adaptation**, en laissant de la place aux programmes de recherche.
- Une écurie pauvre peut se payer 3 cycles, une riche 5. Une contrainte naturelle, sans malus.
- **Aucun chiffre n'est modifié.** Le laboratoire 12b vérifiera ces hypothèses ; toute adaptation ultérieure sera chiffrée et soumise.

### 3.4 Compatibilité avec le calendrier

- Les 20 Grands Prix se courent des semaines 11 à 48 (38 semaines).
- Un cycle complet d'un aileron à 100 % de productivité :
  - 44 jours de conception (6,3 semaines) ;
  - 3 jours de fabrication ;
  - environ 1 semaine de logistique et d'installation ;
  - soit environ 7,5 semaines.
- Cela donne au plus 5 versions par saison et par pièce si l'on n'enchaîne que celle-là, et 3 à 4 en pratique, faute de capacité.
- C'est l'ordre de grandeur de F1M et de la réalité. Le rythme intensif peut gagner environ une semaine sur un cycle : c'est tout l'intérêt de viser un Grand Prix précis.

### 3.5 Pièces futures (pas en phase 12)

- D-114 cite aussi refroidissement, freins et transmission.
- Je propose de **s'en tenir aux six pièces de F1M**. Le refroidissement passe par les pontons, les freins et la transmission par les suspensions et le châssis.
- On ajoutera une pièce seulement quand une formule le justifiera (règle CLAUDE.md « pas d'attribut sans formule »).

---

## 4. Ce qu'une pièce change physiquement

### 4.1 Les paramètres du profil de vitesse (déjà calés, D-163)

`masseKg`, `cla` (appui), `cda` (traînée), `muMeca`, `muAero`, `muMotricite`, `muFreinage`, et le gain de l'aérodynamique active (`reductionTraineeLigne`, `reductionAppuiLigne`).

Le profil calcule le temps au tour sur chacun des 30 circuits : virages lents et rapides, freinages, motricité, lignes droites, électrique.

### 4.2 Effet de chaque pièce [PROPOSÉ]

| Pièce | Paramètres touchés | Compromis naturel |
| --- | --- | --- |
| **Aileron avant** | appui avant, équilibre, part de l'appui | Plus d'appui avant : rapide en virage lent, mais rotation instable en virage rapide ; un peu de traînée |
| **Aileron arrière** | appui (`cla`) et traînée (`cda`), gain de l'aéro active | Le compromis le plus direct : appui contre vitesse de pointe |
| **Fond plat** | appui « efficace » (peu de traînée), sensibilité à la hauteur de caisse | Gros appui pas cher en traînée, mais sensible aux bosses (colonne `bosses` des circuits, 11b) |
| **Pontons** | traînée, **marge de refroidissement** | Carrosserie serrée : moins de traînée, mais perte de puissance sur les circuits chauds ou en altitude (climat et altitude de la 11b) |
| **Châssis** | masse, rigidité (`muMeca`), base des autres pièces | Plus léger : accélère, freine et tourne mieux, mais moins durable (12c) ; un châssis raté limite tout le reste |
| **Suspensions** | `muMeca`, `muMotricite`, sensibilité aux bosses et vibreurs | Plateforme raide : bon pour le fond plat, mauvais sur les vibreurs (Monacco, Singapoure) |

- **Refroidissement** : pour respecter « pas d'attribut sans formule », la marge de refroidissement est lue **dès la 12a** par une formule simple du profil.
  - Si la chaleur du circuit (climat mensuel) et son altitude demandent plus que la marge disponible, la puissance thermique baisse de quelques pour cent.
  - C'est l'exemple de Bahreïn 2024 de la fiche D-114. La gestion thermique fine reste en phase 13.
- **Interactions entre pièces.**
  - Chaque pièce a un **concept** : son point sur la frontière, comme « fort appui » ou « faible traînée ».
  - Une pièce dont le concept s'écarte de celui du châssis et du fond plat installés perd une part de son gain (cohérence du concept, D-114 §4.9).
  - C'est ce qui produit naturellement : « l'aileron prometteur qui ne marche pas avec notre fond plat ».

### 4.3 La frontière de compromis (D-114, pièce maîtresse)

Pour un règlement donné et un domaine, la frontière dit **quelles combinaisons sont possibles**. Exemple pour l'aérodynamique : l'appui maximal atteignable à une traînée donnée.

- Le **règlement** fixe les bornes absolues (le plafond qu'aucune écurie ne dépasse).
- Le **savoir réglementaire** de l'écurie fixe sa frontière à elle, sous ces bornes. La rendre plus généreuse coûte de plus en plus de savoir : c'est le rendement décroissant de la phase 8.
- La **pièce conçue** est un point sur ou sous cette frontière.
  - Sous la frontière quand l'exécution est imparfaite : qualité tirée, réduite par la fatigue et les défauts.
  - Sur la frontière quand elle est parfaite.
- **Une découverte majeure** déplace la frontière dans un domaine, ou ajoute une option de concept nouvelle. Fiche compagnon §6.

**Ce qui empêche la voiture parfaite.**
- On ne peut pas avoir à la fois le maximum d'appui et le minimum de traînée.
- Les bornes du règlement sont fixes et les rendements décroissants.
- Un réglage optimal à Monza est mauvais à Monaco : le profil le montre circuit par circuit.
- **Aucun plafond artificiel n'est ajouté.**

### 4.4 De la voiture aux résultats

- 12a branche le profil de vitesse sur la performance de course. Cela lève **D-162**, comme cette décision le prévoyait.
- Pour chaque voiture et chaque circuit, on calcule l'écart au tour, mis en cache et recalculé seulement quand une pièce change.
- **Temps de calcul à mesurer.** 11 voitures × 30 circuits ≈ 330 profils, à chaque installation de pièce. Le profil coûte quelques millisecondes : à vérifier sur téléphone avant de s'engager.
- Les 6 notes abstraites actuelles disparaissent. La fiche voiture montre à la place des forces et faiblesses par type de circuit, issues du profil.

---

## 5. Soufflerie et CFD : la ressource la plus stratégique

### 5.1 Ce que dit le règlement réel (vérifié)

- 6 périodes de test par an.
- Base de 100 % pour le **7e** du classement constructeurs : 320 passages en soufflerie (80 heures de vent) et 2 000 simulations CFD par période.
- Puis 5 % par place. Le champion a 70 %. Le dernier et toute nouvelle écurie ont 115 %. En 2026, les 9e, 10e et 11e (Alpyne, Audy, Cadilac) sont tous à 115 %.
- L'allocation est **recalculée à mi-saison**, après 3 périodes, sur le classement de ce moment. La première moitié suit le classement final de l'année précédente.
- Sources : voir le message de restitution (FIA, presse spécialisée). Les sources divergent légèrement sur le décompte exact par période : il faudra s'en tenir au texte de la FIA.

### 5.2 Adaptation à nos 11 écuries [PROPOSÉ]

- **Barème par place** : 70, 75, 80, 85, 90, 95, 100, 105, 110, puis 115 pour le 10e et le 11e.
- Il remplace l'interpolation linéaire actuelle (0,75 → 1,15).
- Les deux bornes restent des **règles votables** (phase 8d) : la fédération peut durcir ou adoucir le barème.
- **6 périodes** d'environ 8,7 semaines (semaines 1–9, 10–17, 18–26, 27–35, 36–43, 44–52). Recalcul en semaine 27 sur le classement du moment.
- **Aucun report d'une période à l'autre, aucun transfert entre écuries.** Une heure non utilisée est perdue. C'est l'anti-thésaurisation demandée.
- **Unités** : des heures de soufflerie (80 h à 100 %) et des « unités CFD » (2 000 à 100 %). Le joueur répartit ses heures entre projets et programmes de recherche des domaines aéro, ou délègue.

### 5.3 Deux approches comparées

| | **A. Adaptation fidèle de F1M** | **B. Version physique** (ma recommandation, qui intègre A) |
| --- | --- | --- |
| Principe | Les heures consommées par un projet donnent de l'expertise (≈ 1 jour d'expertise par unité) et un peu de qualité | Les heures servent à **trois choses distinctes**, chacune avec son propre rendement décroissant |
| Lisibilité | Très simple | Plus riche, reste expliquable en une phrase par effet |
| Valeur d'une heure | Linéaire, donc de fait un coefficient de vitesse | Dépend de la compétence, de l'hypothèse et de ce qui a déjà été testé |
| Gaspillage possible | Non | Oui : des heures sur une mauvaise piste n'apportent que de la connaissance |
| Risque | Devient « plus d'heures = plus vite » | Calibrage plus long |

### 5.4 Formule proposée (approche B)

**Efficacité d'une heure.** `e = qualité de la soufflerie × compétence × fraîcheur`
- qualité de la soufflerie = 0,6 + 0,04 × niveau de l'installation (niveau 10 → 1,0 ; niveau 5 → 0,8) ;
- compétence = 0,6 + 0,4 × (moyenne aérodynamique et corrélation du responsable aéro et niveau du pôle) / 20 ;
- fraîcheur = 1 − fatigue du pôle / 200 (fiche compagnon) ;
- même forme pour la CFD (installation CFD, pôle simulation).

**Les trois usages des heures effectives H (soufflerie) et C (CFD) d'un projet.**

| Usage | Ressource principale | Formule | Rendement décroissant |
| --- | --- | --- | --- |
| **1. Expertise** (savoir réglementaire du domaine) | les deux | gain = (jours de conception + kS × H + kC × C) × g / (1 + savoir / 40) | Celui de la phase 8 (savoir déjà acquis) |
| **2. Exploration de variantes** | **CFD** | nombre de variantes N = 1 + C / 150 ; chaque variante a une qualité réelle tirée ; l'équipe garde celle qui **paraît** la meilleure en CFD | Le meilleur de N tirages croît comme √(2 ln N) : 2 variantes valent beaucoup, 20 à peine plus que 10 |
| **3. Validation et détection** | **soufflerie** | erreur d'estimation σ = σ_CFD / √(1 + H / 10) ; probabilité de détecter un défaut caché = 1 − exp(−H / 15) × (1 − rigueur) | Racine et exponentielle |

- **kS = 1 jour par heure effective.** C'est l'idée de F1M (« une unité ≈ une journée d'expertise »), que tu veux conserver. kC est fixé pour que l'allocation complète de CFD vaille environ l'allocation complète de soufflerie (25 unités ≈ 1 jour).
- **Pas de double comptage.** L'expertise additionne les deux ressources avec des poids distincts. La qualité de la pièce vient **seulement** du choix de variante (CFD) corrigé par la validation (soufflerie).
  - Une variante trouvée en CFD mais non validée en soufflerie garde le biais de la CFD : sa performance réelle peut décevoir.
  - C'est la complémentarité réelle des deux outils.
- **Gaspiller est possible.** Si l'hypothèse de départ est mauvaise (fausse piste, concept inadapté au règlement, §10.2), toutes les variantes sont mauvaises : les heures n'achètent alors que de l'expertise et la certitude de s'être trompé.

### 5.5 Une valeur ressentie, mais pas automatique

- **Ordre de grandeur.** Au même effort, le dernier (115 %) dispose de 1,64 fois les heures du champion (70 %).
  - Avec kS = 1, un aileron de 44 jours testé 30 heures apporte 74 « jours » d'expertise au dernier, contre environ 62 au champion (18 heures). Près de 20 % de savoir en plus par projet, cumulé sur des dizaines de projets et de saisons.
  - Il dispose aussi de plus de variantes et de moins de mauvaises surprises.
- **Mesure séparée de la valeur des heures supplémentaires**, exigée pour le laboratoire : même écurie, mêmes graines, barème réel contre barème plat (100 % pour tous). La différence de progression est la valeur exacte de l'aide.
- **Amplification assumée** (ton complément §2) : un coefficient `amplificationBareme`, noté α.
  - Allocation = 100 % + α × (barème − 100 %). α = 1 est le réel. α = 1,5 donne 55 % pour le champion et 122 % pour le dernier.
  - Testé à α = 0, 1, 1,5 et 2. C'est un **levier d'équilibrage déclaré**, pas caché (§10.5, D-169).

---

## 6. Projets de conception : cycle de vie

1. **Lancement**.
   - Le joueur choisit la pièce, l'objectif (exemples : « +appui en virage rapide », « −traînée », « −masse ») et le concept (point visé sur la frontière). Il peut aussi choisir un Grand Prix visé.
   - Le responsable annonce une **estimation** : gain attendu par type de circuit, date, coût, avec une **fourchette** qui dépend de sa corrélation, du savoir et des heures prévues.
2. **Travail** : chaque semaine, les jours avancent selon la capacité affectée, le rythme et la fatigue. Heures de soufflerie et de CFD consommées.
3. **Pendant le projet**, le joueur peut :
   - changer de rythme ;
   - ajouter des heures ou des ingénieurs ;
   - suspendre ou annuler. Le savoir acquis reste ; le coût du projet, payé au lancement comme dans F1M, n'est pas remboursé (parade contre la « pêche » aux événements).
   - Les événements (fiche compagnon) peuvent aussi demander une décision.
4. **Fin** : le plan est validé. Sa qualité réelle est fixée, mais **seulement connue avec l'incertitude qui reste** jusqu'aux premiers roulages.
5. **Fabrication et installation** (§7), puis vérité en piste : le profil de vitesse montre le gain réel, circuit par circuit.

**Erreurs, retards, échecs** : fiche compagnon §1.4. Les difficultés normales existent aussi en rythme normal (environ 2 % des projets), sans lien avec la fatigue.

---

## 7. Fabrication, stocks, installation (12c)

- **Plan, exemplaires, montage**, comme dans F1M. Un plan reste disponible : on peut refabriquer une ancienne version.
- **Capacité de l'usine** en jours de fabrication par semaine. Elle dépend du niveau de l'installation « usine » et du pôle production (313 personnes chez Mercédes, 156 chez Haass).
- **Fabrication urgente** : délai × 0,6, coût unitaire × 1,5, et elle occupe plus de capacité. Possible, mais elle bloque le reste.
  - C'est le seul endroit où je propose un rythme « accéléré » (§11, Q2).
- **Stock et versions.**
  - Chaque exemplaire a une version, une durabilité (kilomètres ou nombre de Grands Prix) et un état.
  - Une version légère peut s'user plus vite. C'est la contrepartie réelle de l'événement « matériau expérimental ».
- **Casse** : en attendant la phase 13, un accident ou un abandon au Grand Prix endommage une pièce avec une probabilité simple (déjà présente pour les abandons).
  - Sans rechange, on remonte l'ancienne version, et le profil de vitesse le traduit.
  - La phase 13 affinera la casse sans rien changer à la 12c.
- **Volumes bornés** : 4 versions conservées par pièce et par écurie, stocks comptés (pas un objet par exemplaire).

---

## 8. Personnel et installations : un effet précis chacun

| Facteur | Agit sur | Pas sur |
| --- | --- | --- |
| Compétence **conception** (responsable conception, DT) | Qualité moyenne des pièces mécaniques, vitesse des projets châssis et suspensions | Les heures |
| Compétence **aérodynamique** | Qualité des pièces aéro, efficacité des heures | La fabrication |
| **Corrélation** | Précision de l'estimation, biais CFD-soufflerie-piste | La qualité réelle |
| **Rigueur** | Détection des défauts, durabilité tenue | La vitesse |
| **Innovation** | Probabilité et ampleur des pistes et découvertes | L'exécution |
| **Vision technique** (DT) | Lecture du paysage d'un futur règlement (§10.2) | Les projets courants |
| **Gestion de projet** (DT) | Pénalité de double affectation, retards | La qualité |
| Sang-froid, stress | Fiabilité des alertes et des décisions sous pression | — |
| Installation soufflerie / CFD | Efficacité des heures (pas leur nombre : c'est le règlement) | — |
| Simulateur | Précision de l'estimation sur piste, réglages (phase 13) | — |
| Bureau d'études | Vitesse et capacité de conception | — |
| Usine | Capacité, délais et coût de fabrication | — |
| Centre de recherche | Efficacité des programmes et projets de recherche | — |

Aucun bonus global « infrastructure ».

---

## 9. Règlements, budget, motoristes

- **Plafond** (phase 5, D-166) : inchangé.
  - Projets, fabrication, recherche et vérifications supplémentaires sont des dépenses plafonnées, débitées à l'écriture comptable.
  - Le dépassement reste un pari sanctionné.
- **Règlements** (phase 8) : inchangés dans leur mécanique.
  - Une réforme fixe de nouvelles bornes de frontière et un **paysage de concepts** (§10.2).
  - Le savoir réglementaire devient obsolète selon l'intensité de la réforme, comme aujourd'hui.
  - Une évolution mineure déplace légèrement les bornes d'un ou deux domaines.
- **Motoristes.**
  - Ils ne sont pas des écuries du joueur. Leur groupe propulseur fixe la puissance, le rendement électrique et la chaleur à évacuer.
  - **Égalité de fourniture** : un client reçoit la même spécification que l'écurie d'usine.
  - L'**intégration** (pontons, refroidissement, masse) est propre à chaque écurie : même moteur, résultats différents (D-114).
- **ADUO** (vérifié pour 2026) :
  - déclenché si le moteur thermique est à 2 % ou plus du meilleur ;
  - de 2 à 4 % : une homologation supplémentaire dans la saison ;
  - au-delà de 4 % : deux, plus deux la saison suivante ;
  - mesure du seul moteur thermique.
  - **Ma recommandation : ne pas l'implémenter en phase 12.** Nos motoristes n'ont pas encore de développement propre. Un mécanisme de rattrapage sur un système qui n'existe pas serait un bonus déguisé.
  - À rouvrir quand les motoristes auront leurs propres cycles (après la 12d, ou avec un cycle « motorisation » de la phase 8). **[À DÉCIDER Q9]**

---

## 10. Renouvellement des hiérarchies (complément du porteur)

### 10.1 Diagnostic

- Aujourd'hui, 55 % des séries de 10 saisons contiennent une dynastie de 5 titres ou plus. L'objectif de D-081 est 0 à 25 %.
- Causes probables :
  1. le développement abstrait converge vers le plafond, et le plus riche y arrive en premier ;
  2. la conception provisoire aux réformes est **relative à la moyenne de la grille**, ce qui rebat peu ;
  3. les découvertes sont presque inexistantes (0,004 par période) ;
  4. aucune réforme ne peut « se rater » vraiment.

### 10.2 Levier technique 1 : les paris de concept à chaque grande réforme [PROPOSÉ, fortement recommandé]

Le cœur de ta demande « Mercédes rate le nouveau règlement, Haass trouve la bonne architecture ».

- À sa création, une grande réforme tire, **en secret et pour tout le monde**, un **paysage** : pour les domaines qu'elle touche, 2 ou 3 familles de concept, dont une meilleure que les autres d'un écart réel.
  - Exemple : « effet de sol bas et pontons étroits » contre « pontons larges ».
  - L'écart est tiré, de 0 à environ 1,5 % du temps au tour à pleine maîtrise.
- **Personne ne connaît la bonne réponse.**
  - La recherche orientée vers ce règlement (phase 8, horizon « règlement futur ») fait **apparaître des indices**. Leur fiabilité dépend du savoir, de la vision technique du DT, des heures et du hasard.
  - Une petite écurie qui prépare tôt peut voir juste. Une grande qui s'entête sur l'ancien concept peut se tromper.
- **Le choix du concept** de la nouvelle voiture est une décision du joueur ou de l'IA, avec ce qu'ils savent.
  - Se tromper coûte une saison, voire deux : changer de concept impose de reconcevoir châssis, fond plat et pontons, donc du temps, des heures et de l'argent.
  - Bien choisir peut donner plusieurs saisons d'avance, jusqu'à ce que les autres comprennent (diffusion, §10.3).
- **Pourquoi c'est légitime (pas un équilibrage artificiel).** L'écart naît d'une contrainte technique réelle, la nouveauté, et des décisions prises. Le hasard ne fait que fixer la « vérité » du règlement, la même pour tous.

### 10.3 Levier technique 2 : innovations rares, diffusées seulement une fois vues

- Une découverte majeure (fiche compagnon §6) reste exclusive tant que la pièce n'a pas couru.
- Ensuite, les autres l'observent (veille légale, D-109) et la reproduisent progressivement, en 1 à 2 saisons, et seulement s'ils ont le savoir pour l'intégrer.
- Une écurie peut donc garder un avantage plusieurs saisons : ta demande §6, « préserver les réussites ».

### 10.4 Levier technique 3 : supprimer le rappel vers la moyenne

- La formule provisoire actuelle calcule la qualité d'une reconception comme « moyenne de la grille + écart de savoir ».
- La frontière (§4.3) est **absolue** : une écurie qui maîtrise est rapide, quelle que soit la grille.
- **Aucun mécanisme ne ramène une équipe vers le milieu.** Les seules forces sont réelles :
  - rendements décroissants (le leader progresse moins vite par heure) ;
  - barème de soufflerie ;
  - obsolescence aux réformes ;
  - plafond ;
  - usure du succès (D-140, déjà validée).

### 10.5 Levier d'équilibrage assumé : l'amplification du barème [PROPOSÉ]

- Seulement si le laboratoire montre que les trois leviers techniques ne suffisent pas.
- α > 1 (§5.5), déclaré dans `balance/` comme **équilibrage volontaire**, au même titre que D-140.
- Il donne **des moyens** (des heures), jamais de la vitesse : une écurie qui gaspille ses heures reste derrière.

### 10.6 Ce que je refuse de proposer (ta liste « à éviter », que je partage)

Vitesse secrète aux derniers · freinage des dominants · innovation garantie à une écurie en difficulté · champion à intervalles réguliers · avantage effacé sans raison.

### 10.7 Contradiction avec D-081 : reformulation proposée (projet D-169)

**D-081 aujourd'hui** :
- « ni bonus cachés pour l'IA ni pénalités artificielles pour les dominants » ;
- « équilibre issu de systèmes cohérents ».

Elle est déjà nuancée par D-140 (usure du succès, exception explicite).

**Proposition de nouvelle formulation** :
> « L'équilibre du championnat vient de systèmes cohérents. Est accepté, et toujours **déclaré** (connu des joueurs, rangé dans `balance/` comme équilibrage volontaire) :
> - un **équilibrage des opportunités et des moyens** : barème de soufflerie et de CFD inversé selon le classement, éventuellement amplifié au-delà du réel si les mesures le justifient ;
> - des réformes suffisamment perturbatrices ;
> - des risques et découvertes capables de grands écarts ;
> - la diffusion progressive des innovations ;
> - l'usure du succès (D-140).
>
> Sont **interdits** : tout bonus ou malus de performance selon le classement ; toute innovation ou tout résultat garanti ou imposé ; tout avantage retiré sans cause technique ; toute information cachée donnée à l'IA. Les cibles de compétitivité de D-081 restent des objectifs mesurés, jamais des consignes du moteur. »

À valider. Je n'ai pas modifié D-081 : elle est inscrite comme **D-169, À DISCUTER**.

---

## 11. Rythmes de travail [PROPOSÉ]

| Rythme | Avancement | Coût | Fatigue | Usage |
| --- | --- | --- | --- | --- |
| **Allégé** | × 0,7 | normal | récupère vite | Après un rush, ou si le pôle est fatigué |
| **Normal** | × 1 | normal | soutenable indéfiniment | Par défaut |
| **Intensif** | × 1,3 (et expertise × 1,15) | + 10 % (heures supplémentaires) | monte | Finir avant un Grand Prix |

- Je **déconseille un troisième niveau « accéléré » pour la conception**.
  - Il ferait doublon avec l'intensif, plus une fatigue encore plus rapide, sans décision nouvelle.
  - La notion d'urgence a sa vraie place à la fabrication (§7).
- **[À DÉCIDER Q2]**

---

## 12. IA et délégation

- **Mêmes commandes que le joueur** : affectations, rythme, heures, choix d'événements, concept, fabrication.
- **Même information.** L'IA voit l'estimation de **son** responsable, avec son erreur, jamais la vérité. Elle ne connaît pas le paysage d'une réforme : elle voit ses indices, comme le joueur.
- **Politique de l'IA** (utilité, jugement à graine, traits du DT) :
  - **rythme** : intensif si un projet vise un Grand Prix proche, si l'écurie est en lutte et si la fatigue est sous 40 ; allégé au-delà de 55 ;
  - **événements** : espérance de gain **perçue** contre coût, modulée par le goût du risque du DT, la trésorerie et la position sportive ;
  - **concept** : celui que ses indices désignent, pondéré par sa philosophie technique (données) et une part d'entêtement (trait).
- **Délégation du joueur.**
  - Le directeur technique décide avec la même fonction. Le joueur fixe une **politique** : prudente, équilibrée ou audacieuse ; « protéger l'équipe » ou « tenir les délais ».
  - Les dilemmes délégués sont tranchés sans arrêter le jeu et résumés dans les actualités.

---

## 13. Découpage précis

| Sous-phase | Contenu | Hors champ | Campagne |
| --- | --- | --- | --- |
| **12a** Architecture et physique | Refonte aéro (D-163) · paramètres physiques des 11 voitures (conversion de `voitures.csv`) · 6 pièces et concepts · frontière par règlement (savoir → frontière) · marge de refroidissement · profil de vitesse branché sur les courses (fin de D-162) · suppression des 6 notes et du développement abstrait · **conception simplifiée** (projets au rythme normal, sans événement, pour que les voitures évoluent) · paysage de concepts aux réformes | Fatigue, événements, fabrication | 10 et 30 saisons : convergence, diversité, hiérarchies |
| **12b** Conception complète | Capacité des pôles et affectations · rythmes · fatigue, stress, alertes · soufflerie et CFD (barème réel, 3 usages) · estimation contre réel · erreurs, défauts cachés, retards, échecs · événements de conception · IA et délégation · interface mobile | Fabrication | Les 10 stratégies du §14 |
| **12c** Fabrication et garage | Usine, capacité, urgence · stocks, versions, durabilité · casse simple · installation par voiture · IA des stocks · délégation | Casse fine (phase 13) | Pénuries, coûts réels contre §3.3 |
| **12d** Recherche appliquée et innovations | Événements de recherche · 3 niveaux de résultat · fusion des découvertes de la phase 8 · innovations majeures et diffusion · veille légale · étude ADUO | Compatibilité pilote (12e) | 30 et 50 saisons : ruptures, durée des avantages |

Chaque sous-phase suit le processus de CLAUDE.md : fiche, validation, code, tests, campagne, rapport. Format de sauvegarde et migration à chaque étape.

---

## 14. Laboratoire et campagnes (avant toute validation chiffrée)

**Stratégies comparées** (même écurie, mêmes graines, 11 écuries, 10, 30 et 50 saisons) :
1. normal permanent ;
2. intensif permanent ;
3. alternance intelligente ;
4. soufflerie concentrée sur un domaine ;
5. heures réparties ;
6. recherche agressive ;
7. recherche prudente ;
8. recherche centrée sur le futur règlement ;
9. développement spécialisé ;
10. développement polyvalent ;
11. accepter toutes les opportunités ;
12. tout refuser ;
13. décider selon le contexte.

**Mesures.**
- Gain réel par pièce (temps au tour sur les 30 circuits).
- Gain par heure de soufflerie et par unité de CFD.
- Expertise, fatigue moyenne et maximale, erreurs, retards, échecs, défauts cachés.
- Événements par famille, découvertes mineures, fausses pistes, innovations majeures.
- Dépenses et rendement.
- Écarts entre écuries, diversité des concepts.
- Indicateurs de renouvellement (complément §7) :
  - écuries championnes différentes ;
  - durée des dominations ;
  - passages du fond au podium et aux victoires ;
  - grandes écuries ratant un règlement ;
  - premières victoires ;
  - avant et après réforme ;
  - effet isolé du barème ;
  - maintien des réussites des petites écuries.
- **Comparaison** : système actuel contre phase 12 avec α = 0, 1, 1,5 et 2.

**Critères de réussite** (objectifs mesurés, jamais des consignes du moteur) :
- l'intensif permanent n'est pas la meilleure stratégie ;
- le normal est viable ;
- aucune stratégie n'est dominante sur toutes les graines ;
- les innovations majeures restent rares, autour d'une tous les 2 à 4 ans sur la grille ;
- pas de convergence vers la voiture parfaite ;
- des trajectoires du type « Haass 9e → 7e → 3e → 2e » apparaissent dans quelques pour cent des séries, sans être systématiques.

---

## 15. Avis critique de Claude Code

1. **Le risque n°1 n'est pas la fatigue, c'est la physique.**
   - Tant que la refonte aérodynamique (D-163) n'est pas faite, un aileron « faible traînée » ne servira à rien : les ailerons sont au maximum partout.
   - La 12a doit commencer par là, et sa campagne doit prouver que les compromis se voient circuit par circuit.
2. **La profondeur demandée est considérable.** Pièces × versions × stocks × fatigue × événements × soufflerie × 11 IA.
   - Sans délégation de qualité et sans interface sobre (une jauge, des fourchettes, deux ou trois options), le jeu deviendra une feuille de calcul.
   - Je recommande d'avancer sous-phase par sous-phase, avec un écran utilisable à chaque fois.
3. **Le levier le plus puissant pour tes ascensions spectaculaires est le pari de concept (§10.2), pas l'amplification du barème.**
   - Le barème agit lentement et sur tout le monde. Le pari de concept crée les vraies ruptures (Brawn 2009, Mercedes 2014, Red Bull 2022) avec une cause expliquée.
   - Je propose de le tester **avant** de toucher à α.
4. **Le « 1 heure ≈ 1 jour d'expertise » de F1M est un bon point de départ.** Mais à lui seul, il ferait des heures un coefficient de vitesse : c'est pour cela que je l'intègre dans l'approche B au lieu de m'y limiter.
5. **Les valeurs de F1M sont compatibles avec notre économie.** Le seul point à surveiller est le nombre de cycles par saison, qui dépendra de la capacité des pôles : à mesurer, sans toucher aux 33 et 44 jours.
6. **ADUO** : bonne idée réelle, mais prématurée tant que les motoristes ne développent pas.

## 16. Décisions à prendre ensemble

| # | Question | Ma recommandation |
| --- | --- | --- |
| Q1 | 1 $ de F1M = 1 € du jeu ? | Oui |
| Q2 | Rythmes : allégé, normal, intensif (pas d'« accéléré » en conception, urgence seulement à la fabrication) ? | Oui |
| Q3 | Fatigue par pôle + fatigue et stress individuels des responsables, une seule jauge visible (fiche compagnon §1) ? | Oui |
| Q4 | L'événement « erreur due à la fatigue » est une **alerte conditionnelle**, hors du tirage de 5 à 10 % ? | Oui |
| Q5 | Fusionner les découvertes automatiques de la phase 8 dans les événements de recherche ? | Oui |
| Q6 | Barème réel de soufflerie et CFD, 6 périodes, recalcul à mi-saison, sans report ; α réglable testé de 0 à 2 ? | Oui |
| Q7 | Paris de concept à chaque grande réforme (§10.2) ? | Oui, en priorité |
| Q8 | Reformulation de D-081 (D-169) ? | À valider telle quelle ou à amender |
| Q9 | ADUO reporté jusqu'au développement des motoristes ? | Oui |
| Q10 | Dilemmes techniques **non bloquants**, avec échéance et choix par défaut = recommandation du responsable ? (les demandes du personnel restent bloquantes, D-168) | Oui |
| Q11 | Intensif : + 10 % de coût de projet ? | Oui |
| Q12 | Brancher le profil de vitesse sur les courses dès la 12a (fin de D-162) ? | Oui |
| Q13 | Six pièces seulement (pas de freins, transmission, refroidissement séparés) ? | Oui |
