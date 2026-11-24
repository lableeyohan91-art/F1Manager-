# Phase 11b — Circuits : identité technique, segments, conditions, histoire

> Statut : **ÉTUDE ET CONCEPTION, À VALIDER** (D-159). Aucun code de jeu avant validation des décisions du §12.
> Fiche d'intention : `docs/echanges/2026-11-24-intention-phase-11b-circuits.md`.
> Étude menée le 24/11/2026 par Claude Code. Les essais de calcul sont des **prototypes jetables** (scripts hors du dépôt), pas du code du jeu.

## 0. Ce que je n'ai pas pu consulter (à lire en premier)

| Source | État | Conséquence |
| --- | --- | --- |
| **APEX Lab** (`APEX-Lab-rapport-v0.9.md`) | **Inaccessible** : absent du dépôt et des dépôts ouverts à cette session | Ses chiffres (47,7 % SC, 35,5 % VSC, 7,7 % DR, 14,1 % pluie) sont cités tels que tu les as donnés, **non vérifiés**. Pour que je m'appuie sur ses enseignements, dépose le rapport dans `docs/echanges/` |
| FIA (documents de course, plans officiels), formula1.com, OpenF1, Wikipédia, OpenStreetMap, archives météo (Open-Meteo, Meteostat) | **Bloqués** par le réseau de mon environnement | Collecte impossible d'ici pour l'instant : voir §6 et §7 (autorisation d'accès à demander) |
| Dépôts GitHub publics en lecture brute (`raw.githubusercontent.com`) | **Accessibles** | Deux sources utilisables tout de suite (ci-dessous) |

Sources effectivement consultées :

| Source | Contenu | Licence | Fiabilité |
| --- | --- | --- | --- |
| `bacinger/f1-circuits` (GeoJSON) | Tracé de 40 circuits F1 (100 à 200 points par tour), longueur officielle, altitude | MIT (attribution) ; tracé d'origine relevé sur une carte en ligne, **provenance amont non documentée** | Longueurs à 0,5 % près des valeurs officielles (vérifié sur 12 circuits) ; **trop grossier pour les rayons de virage** (voir §3.4) |
| `TracingInsights/RaceData` (copie du jeu Kaggle « Formula 1 Race Data / Race Events », jtrotman) | Grands Prix 1950–2026, Safety Cars (cause, tours), VSC (depuis 2015), drapeaux rouges (cause, reprise) | **CC0** (domaine public) ; attribution appréciée | Jeu communautaire : à recouper par échantillon avec les documents FIA (§6) |

## 1. Audit de l'existant

### 1.1 Ce qui existe et fonctionne

| Élément | État | Qui le lit |
| --- | --- | --- |
| 24 circuits (`circuits.csv`, noms altérés) : type, altitude, climat de pluie (4 niveaux), **9 exigences de 1 à 5** | Saisis à la main, colonne de vérification « type et climat estimés » : **aucune n'est une donnée réelle vérifiée** | Voir ci-dessous |
| Poids des 6 caractéristiques de la voiture par circuit (`poidsVoiture`, D-107) | Normalisés à 1 : l'influence totale de la voiture ne change pas d'un circuit à l'autre | Indice de performance de chaque Grand Prix |
| Poids des compétences du pilote (`poidsPilote`, D-104) | Le rythme est réparti entre freinage, virages lents, rapides et motricité selon les exigences ; pneus selon la dégradation ; condition selon l'effort physique | Note de course du pilote |
| `difficulte` | Étire les écarts entre pilotes | Course, juniors |
| `risqueAccident` | Multiplie la probabilité d'incident | Abandons |
| `climatPluie` | Probabilité fixe de course humide (3 à 25 %) | Pluie du Grand Prix |
| Altitude | Augmente le poids du moteur | Indice voiture |

**Mesure de l'identité actuelle** (poids des 6 caractéristiques, script d'audit) :
- **5 caractéristiques différentes** sont n° 1 selon les circuits (virages lents 7 fois, virages rapides 8 fois, moteur 6, vitesse de pointe 2, pneus 1).
- **Monaco : 50 % virages lents**, Hungaroring 39 %, Singapour 37 %. Suzuka, Jeddah et Lusail : virages rapides à 26–28 %. Mexico : moteur à 31 %.
- Les circuits ont donc déjà une identité. La fondation est bonne.

### 1.2 Ce qui manque ou pose problème

1. **Données non réelles** : les 9 notes sont des estimations ; trois circuits (Albert Parc, Shanghai, Miami) ont presque toutes leurs notes à 3. Ils n'ont **aucune identité** : leurs 6 poids sont entre 15 et 19 %.
2. **Double comptage des lignes droites** : l'exigence « lignes droites » nourrit trois caractéristiques à la fois (vitesse de pointe 0,8, efficacité aéro 0,4, moteur 0,6). Les circuits rapides sont surpondérés en « puissance » sous trois noms.
3. **Le freinage du circuit ne sollicite aucune caractéristique de la voiture**, seulement le pilote. La stabilité au freinage arrive en phase 12.
4. **Une seule ligne de calcul pour la gestion des pneus**, caractéristique de la voiture **et** compétence du pilote ; aucune distinction entre usure, surchauffe et mise en température.
5. **Aucune géométrie** : pas de longueur, pas de nombre de tours, pas de virages, pas de voie des stands.
6. **Calendrier** : tous les circuits par ordre fixe, coupés au nombre voté (24 par défaut, D-141), semaines réparties régulièrement. Pas de date réelle, pas de rotation, pas de circuit permanent.
7. **Météo** : probabilité fixe par circuit, indépendante de la date ; **aucune température**.
8. **Aucune neutralisation** (SC, VSC, drapeau rouge), aucun temps perdu au stand, aucun dépassement localisé : c'est la phase 13.
9. **Archives** : les résultats restent, mais rien n'est agrégé par circuit. Les explications détaillées sont effacées après 2 saisons.

### 1.3 Les fondations à garder

- Le **principe des poids normalisés** : un circuit change la *répartition* de l'importance des caractéristiques, pas l'influence totale de la voiture. Aucun avantage caché.
- Les **13 compétences des pilotes** et leur répartition par circuit.
- `difficulte`, `risqueAccident`, `exigencePhysique` : ils resteront, mais **calculés** à partir des données réelles quand c'est possible (§2).

## 2. Les caractéristiques d'un circuit (liste exhaustive) et leur utilité

Principe : **on ne stocke que ce qui s'observe** (géométrie, revêtement, climat, installations), et **on calcule le reste** avec le même modèle physique que la performance. Les « exigences » ne sont plus saisies : elles sont **mesurées sur le tracé**. C'est ce qui garantit que la fiche et le moteur disent la même chose (§4).

Statut de chaque donnée : **V** réelle vérifiée · **R** reconstruite (à partir de données réelles) · **E** estimation technique (méthode écrite) · **H** hypothèse de game design.

### 2.1 Données stockées

| Famille | Donnée | Statut visé | Utilité (formule qui la lit) | Phase où elle agit |
| --- | --- | --- | --- | --- |
| Identité | Nom altéré, ville, pays, coordonnées, nature (permanent, urbain, semi-urbain), sens, année d'ouverture, historique succinct | V | Fiche ; coordonnées → climat | 11b |
| Configuration | Configurations datées (de l'année… à l'année…), longueur, tracé ordonné en éléments (§3) | R | Profil de vitesse, tout le reste | 11b (calcul), 13 (course) |
| Course | Distance de course réglementaire → nombre de tours ; position de la ligne, des secteurs | V | Durée de course, usure, carburant, énergie | 11b (tours), 13 |
| Stands | Longueur de la voie, vitesse limite, position entrée et sortie, temps perdu typique | V (longueur, limite) / R (temps perdu) | Coût d'un arrêt, undercut | 13 ; affiché en 11b |
| Altitude et dénivelé | Altitude de référence, profil d'altitude par élément | V / R | Densité de l'air (puissance, appui, refroidissement), montées et descentes | 11b (densité), 13 |
| Revêtement | Abrasivité, adhérence, évolution de la piste (1 à 5) | E (sources : fiches techniques publiques du manufacturier de pneus, publiées avant chaque Grand Prix, à vérifier) | Usure et thermique des pneus, évolution de la piste | 11b (usure moyenne), 13 |
| Bosses, vibreurs | Par élément : niveau 0 à 3 | E | Comportement sur bosses (voiture, phase 12), risque, usure | 12, 13 |
| Sécurité | Par élément : nature du dégagement (mur, gravier, asphalte), largeur estimée, accès des secours | E | Gravité d'un incident, voiture immobilisée, choix jaune, VSC, SC ou drapeau rouge | 13 |
| Climat | Par mois : température de l'air (moyenne, écart type), probabilité de pluie pendant 2 heures, intensité, vent, humidité | R (archives météo) | Pluie, température de piste, thermique, pneus | 11b (pluie, température) |
| Historique | Par édition réelle : date, SC, VSC, drapeaux rouges (nombre, cause, tours), course humide | V / R | Fiche (bloc D), vérification du moteur | 11b (affichage), 13 (comparaison) |

### 2.2 Données calculées (jamais saisies)

Calculées par le **profil de vitesse** (§3.3) pour une voiture de référence, puis pour chaque voiture :

| Indice | Calcul | Remplace ou nourrit |
| --- | --- | --- |
| Part du tour en virages lents, moyens, rapides (temps) | Temps passé selon la vitesse minimale du virage | Exigences `lents`, `rapides` |
| Part du tour à pleine charge, plus longue phase à pleine charge | Temps où l'accélération est limitée par la puissance | `lignesDroites` ; énergie (2026) |
| Énergie de freinage par tour, nombre de gros freinages | Somme des décélérations | `freinage` ; récupération électrique ; refroidissement des freins |
| Part du tour limitée par la motricité | Temps où l'accélération est limitée par l'adhérence | `motricite` |
| Énergie latérale et longitudinale transmise aux pneus | Somme des efforts | `degradationPneus` (avec l'abrasivité) |
| Charge physique du pilote | Durée et intensité des efforts latéraux et longitudinaux, chaleur | `exigencePhysique` |
| Zones d'attaque | Lignes droites suivies d'un gros freinage, largeur, règlement de l'année | Difficulté de dépassement (phase 13) ; affichage 11b |
| Sensibilité de chaque caractéristique de la voiture | Gain de temps au tour pour un point de note (§4) | **Poids de la voiture par circuit** et fiche « deux essentielles » |

**Réponse à la liste du §2 de la fiche d'intention.** Les 19 orientations demandées sont toutes couvertes. Plusieurs se recouvrent physiquement, et le modèle les traite comme **une seule cause** pour éviter le double comptage :
- appui, efficacité et traînée : un même couple de paramètres (coefficients de portance et de traînée) ;
- récupération et déploiement électriques : une même batterie qui se vide et se remplit selon le profil ;
- chaleur, froid et altitude : des **conditions** qui modifient la densité de l'air, la température des pneus et le refroidissement ; pas des « caractéristiques » à part.

## 3. Modèle de segments (compatible avec la course en 2D)

### 3.1 Deux niveaux

1. **Éléments** (données stockées, une ligne par élément) : lignes droites et virages, dans l'ordre, avec la numérotation officielle des virages. **Environ 25 à 45 éléments par circuit.**
2. **Profil fin** (calculé au chargement, jamais stocké) : le tracé découpé tous les 10 m (300 à 700 points par tour). On y calcule la vitesse, le freinage, l'accélération, puis les **portions de course** (zones de freinage, de motricité, d'attaque). Le moteur de phase 13 fera avancer les voitures sur ces points ; l'affichage 2D les dessinera à partir des mêmes coordonnées.

Les « types de portions » de la fiche d'intention (relance, zone de freinage, zone d'accélération, zone favorable au dépassement…) sont donc **déduits** du tracé et de la voiture, pas saisis. Une zone de freinage n'est pas la même pour une voiture à fort appui et pour une voiture à faible traînée : c'est voulu.

### 3.2 Un élément

| Champ | Exemple | Statut |
| --- | --- | --- |
| `circuit`, `configuration`, `ordre` | `cir_monza`, `2000-`, 3 | — |
| `type` | `droite`, `virage` | R |
| `numeroOfficiel` | « 1 » (première chicane) | V (plans officiels) |
| `longueurM` | 640 | R |
| `rayonM`, `angleDeg`, `sens` | 18, 90, droite | R |
| `deniveleM` | +4 | R |
| `bosses`, `vibreurs` (0 à 3) | 1, 3 | E |
| `degagement` | mur, gravier, asphalte | E |
| `largeurM` | 12 | E |
| `voieStands` | entrée, sortie | V |
| `statut`, `source` | R, « tracé GeoJSON + plan FIA 2024 » | — |

### 3.3 Le profil de vitesse (modèle physique simplifié)

C'est le cœur du système : **un seul calcul** sert à la fiche, aux poids de la voiture, puis à la course.

- **Vitesse maximale en virage** : l'adhérence du pneu, augmentée de l'appui qui croît avec le carré de la vitesse, équilibre l'effort latéral du virage.
- **Accélération** : limitée par la puissance du moteur (moins la traînée) ou par la motricité, selon le cas.
- **Freinage** : limité par l'adhérence (plus l'appui), plus la traînée.
- Méthode classique en deux passes : une passe en avant (on accélère), une en arrière (on freine à temps). C'est une simulation « quasi statique », sans dynamique au centimètre. Elle reste **très rapide**.
- **Conditions** : la densité de l'air (altitude, température) agit sur la puissance, l'appui et la traînée ; la pluie, sur l'adhérence ; plus tard, la température des pneus et le carburant.
- **Coût mesuré sur le prototype** : quelques millisecondes par tour et par voiture. Pour 22 voitures et 60 tours en phase 13, environ 1 à 3 secondes par course sur ordinateur. Il faudra une version plus grossière pour les courses non regardées (rappel de l'intention de la phase 13).

**Essai sur 12 tracés réels** (prototype, voiture de référence de 850 kg, 750 kW) : temps au tour plausibles (Monza 75 s, Spa 99 s, Silverstone 88 s ; ordre de grandeur des temps réels). Vitesse minimale de Monaco : 58 km/h.

### 3.4 Exactitude des tracés : ce que l'essai a montré

- Les **longueurs** du tracé GeoJSON sont justes (écart < 0,5 % sur 12 circuits).
- Les **rayons** ne le sont pas : un point tous les 30 à 50 m transforme chaque angle du relevé en faux virage. La détection automatique trouve 16 virages à Monza (11 officiels), 29 à Spa (19), 25 à Monaco (19).
- **Méthode proposée** :
  1. détection automatique sur le tracé lissé ;
  2. rapprochement avec la **numérotation officielle** des virages (plans de la FIA, à consulter) ;
  3. rayons **vérifiés par les vitesses réelles** de passage, si nous avons accès à des relevés de vitesse publics (télémétrie publiée après chaque Grand Prix, voir décision 6) ;
  4. sinon, rayon marqué **R** (reconstruit) avec sa marge d'erreur.
- **Tracé de meilleure qualité** : OpenStreetMap (point tous les quelques mètres). Accès bloqué ici, et licence ODbL avec partage à l'identique (décision 5).

### 3.5 Configurations et règlement

- Un circuit a **plusieurs configurations datées** (par exemple, Bahreïn « extérieur » de 2020). Le calendrier choisit la configuration en vigueur. Seule la configuration actuelle sera saisie au départ ; la structure accepte les autres.
- Les **zones d'attaque** (ancien DRS, aérodynamique active et dépassement électrique du règlement 2026) **ne sont pas des données du circuit** : elles découlent du **règlement de l'année** (phase 8), appliqué aux lignes droites du tracé. Un changement de règlement les modifie sans retoucher les circuits.

## 4. Les deux caractéristiques essentielles et la moins importante

### 4.1 Méthode : la sensibilité au temps au tour

Pour chaque caractéristique de la voiture : **combien de temps au tour gagne-t-on avec un point de plus ?** On la classe sur ce gain.
- Les deux plus fortes sont les « points essentiels », la plus faible le « point le moins important ».
- Le calcul passe par le **même profil de vitesse** que la performance : la fiche ne peut pas contredire le moteur.
- Les **poids de la voiture par circuit** (aujourd'hui saisis) deviennent ces sensibilités normalisées. Le modèle de course actuel lit donc déjà les tracés réels, avant même la phase 13.

### 4.2 La vraie difficulté : combien vaut « un point » ?

L'essai sur 12 tracés le montre : selon la façon dont on traduit un point de note en physique, une caractéristique peut dominer partout. Avec mes premières hypothèses, l'adhérence mécanique arrivait première presque partout, parce qu'elle agit à la fois en virage, au freinage et en sortie de virage.

**Proposition** : un point vaut **le même gain de temps moyen sur l'ensemble du calendrier**, pour chaque caractéristique (calibrage une fois pour toutes, hypothèse **H** écrite dans `balance/`). Un circuit est alors « essentiel en vitesse de pointe » s'il y est **plus sensible que la moyenne**. C'est la même idée que les poids normalisés d'aujourd'hui, et elle évite qu'une caractéristique soit essentielle partout. En phase 12, ce sera remplacé par **le coût réel du développement** (frontière de compromis, D-114) : un point d'appui et un point de puissance ne coûteront pas la même chose.

### 4.3 Ce qu'on classe, et dans quelles conditions

- **Seules les caractéristiques que la voiture possède** :
  - **en phase 11b** : virages lents (adhérence mécanique), virages rapides (appui), vitesse de pointe (traînée), efficacité aéro (appui et traînée ensemble), moteur (puissance), pneus (usure en course) ;
  - **en phase 12** : chaque nouvelle caractéristique (stabilité au freinage, bosses, refroidissement, énergie…) entre dans le classement **le jour où une formule la lit**. Jamais avant.
- **Trois lectures**, comme demandé :
  - « conditions habituelles » par défaut : climat du mois, sur la distance de course ;
  - « qualifications » : un tour, pneus neufs, peu de carburant. Les pneus y pèsent moins ;
  - « prévision du week-end » : la météo annoncée, quand elle existe.
- **Trois informations séparées** sur la fiche : importance pour le circuit ; niveau de notre voiture ; notre avantage estimé face aux autres. L'avantage est **estimé par nos ingénieurs**, avec une incertitude, jamais la valeur cachée.

## 5. Fiche circuit mobile (structure)

Une page par circuit, accessible depuis le calendrier et le tableau de bord (prochain Grand Prix). Le détail s'ouvre en dépliant.

```
┌──────────────────────────────────────────┐
│ MONZZA · Italie · Monza            [tracé]│  A. Présentation
│ 5,79 km · 11 virages · 53 tours · 306 km  │     (tracé dessiné à partir
│ Permanent · sens horaire · alt. 160 m     │      des mêmes coordonnées que la course)
│ ▸ Histoire du circuit                     │
├──────────────────────────────────────────┤
│ CE QUI COMPTE ICI          (conditions     │  B. Exigences
│ ★ Vitesse de pointe          habituelles ▾)│     calculées, jamais écrites à la main
│ ★ Moteur                                   │
│ ○ Virages lents (le moins important)       │
│ « Longues pleines charges : une voiture à  │     explication générée à partir
│   forte traînée y perd beaucoup. »         │     des mêmes indices
│ Notre voiture : ▲ vitesse de pointe        │     estimation des ingénieurs
│                 ▼ moteur (incertain ±)     │
├──────────────────────────────────────────┤
│ CONDITIONS (climat de septembre)          │  C. Conditions
│ Air 24 °C (18–30) · pluie 9 % (historique)│     historique ≠ prévision,
│ Usure pneus : faible · Abrasivité 2/5     │     toujours étiqueté
│ Dépasser : facile · Effort physique : 2/5 │
│ Incidents : moyen · Arrêt au stand ≈ 24 s │
│ Prévision du week-end : —  (à J-7)        │
├──────────────────────────────────────────┤
│ NEUTRALISATIONS (10 dernières éditions)   │  D. Historique
│ Safety Car    6 interventions · 5 GP / 10 │     interventions ET GP concernés
│ VSC           3 · 3 GP / 10              │
│ Drapeau rouge 2 · 2 GP / 10              │
│ Source : éditions 2017–2026 (réelles)     │     puis nos courses simulées
├──────────────────────────────────────────┤
│ PRÉPARATION (phases 12 et 13)             │  E. Préparation
│ Compatibilité voiture, pilotes, réglages, │     vide tant que les phases
│ stratégie, risques — avec incertitudes    │     12 et 13 n'existent pas
└──────────────────────────────────────────┘
```

Les chiffres de Monza dans ce schéma sont **réels** pour le bloc D (données §6). Les autres sont **illustratifs**.

## 6. Historique SC, VSC et drapeaux rouges : plan de collecte

### 6.1 Premier résultat (déjà calculé, réel)

Source : TracingInsights / Kaggle (CC0). Fenêtre : **les 10 dernières éditions réellement courues jusqu'au 24/11/2026**, saisons sans Grand Prix exclues. Fichier : `docs/rapports/phase-11b/historique-neutralisations-reel.json`.

| Circuit (nom altéré) | Éditions (période) | SC : interventions · GP concernés | VSC | Drapeaux rouges |
| --- | --- | --- | --- | --- |
| Albert Parc | 10 (2015–2026) | 11 · 6 | 9 · 5 | 4 · 2 |
| Shangai | 10 (2013–2026) | 7 · 6 | 1 · 1 (2 éditions avant la VSC) | 0 |
| Suzuca | 10 (2015–2026) | 5 · 5 | 4 · 3 | 2 · 2 |
| Sakir | 10 (2017–2025) | 9 · 7 | 3 · 3 | 1 · 1 |
| Jedda | **5** (2021–2025) | 5 · 5 | 4 · 2 | 2 · 1 |
| Miamy | **5** (2022–2026) | 3 · 3 | 5 · 3 | 0 |
| Gilles-Villeneuves | 10 (2015–2026) | 7 · 6 | 7 · 4 | 0 |
| Monacco | 10 (2016–2026) | 7 · 5 | 7 · 4 | 3 · 3 |
| Catalunia | 10 (2017–2026) | 4 · 4 | 2 · 2 | 0 |
| Spielbergh | 10 (2019–2026) | 7 · 5 | 5 · 4 | 0 |
| Silverston | 10 (2018–2026) | 10 · 7 | 5 · 3 | 2 · 2 |
| Spa-Francorchamp | 10 (2017–2026) | 8 · 8 | **0 · 0 (à vérifier)** | 1 · 1 |
| Hungarorring | 10 (2017–2026) | 2 · 2 | 5 · 3 | 1 · 1 |
| Zandvort | 10 (**1982–2026**, dont 4 éditions des années 1980) | 6 · 3 | 5 · 4 (sur 6 éditions modernes) | 2 · 2 |
| Monzza | 10 (2017–2026) | 6 · 5 | 3 · 3 | 2 · 2 |
| Madrit | **0** dans la source (édition 2026 à vérifier) | — | — | — |
| Bakou | 10 (2016–2026) | 11 · 6 | 4 · 3 | 2 · 2 |
| Marinna Bay | 10 (2015–2026) | 12 · 6 | 7 · 4 | 0 |
| Austen | 10 (2016–2026) | 3 · 2 | 6 · 5 | 0 |
| Hermanos Rodrigues | 10 (2016–2026) | 6 · 5 | 8 · 7 | 2 · 2 |
| Interlagoss | 10 (2016–2026) | 14 · 8 | 2 · 2 | 4 · 3 |
| Las Vegaz | **4** (2023–2026) | 3 · 2 | 3 · 2 | 0 |
| Lussail | **4** (2021–2025) | 5 · 3 | 1 · 1 | 0 |
| Yas Marinna | 10 (2016–2025) | 3 · 3 | 2 · 2 | 0 |

**Sur les 208 éditions** : 53,8 % des Grands Prix ont eu au moins une SC (0,74 SC par GP), 34,7 % au moins une VSC, 11,5 % au moins un drapeau rouge. Pour mémoire, le générateur d'APEX Lab donnait 47,7 %, 35,5 % et 7,7 % (périodes et circuits différents) : il était **en dessous du réel pour les SC et les drapeaux rouges**, ce qui rejoint le défaut que ton laboratoire avait relevé.

### 6.2 Limites, à afficher honnêtement

- **VSC seulement depuis 2015** (elle n'existait pas avant) : une édition antérieure ne compte pas dans le dénominateur des VSC.
- **Zandvoort** : les dix dernières éditions remontent aux années 1980. Je propose d'afficher **séparément** les éditions modernes (depuis 2021) et anciennes, comme tu le demandes.
- **Jeu communautaire** : quelques anomalies possibles (Spa sans aucune VSC en 10 ans me paraît suspect). Il faut **recouper par échantillon** avec les documents officiels de la FIA (accès à demander).
- **Courses sprint** : non comptées (seulement les Grands Prix).
- Le départ sous SC sous la pluie (par exemple) compte comme une intervention : à préciser sur la fiche.

### 6.3 Dans le jeu

- Table d'**archives par circuit**, à part et **jamais effacée** : une ligne par édition (année, configuration, SC, VSC, DR avec cause et tours, course humide, vainqueur). Une ligne d'édition pèse quelques dizaines d'octets.
- Au départ : les éditions réelles (données). Ensuite, les éditions simulées s'ajoutent. La fiche montre toujours les 10 dernières **éditions réellement courues**, avec leur origine (réelles ou simulées).
- **Avant la phase 13, le moteur ne simule aucune neutralisation** : les éditions simulées porteront « non simulé » plutôt que « 0 ». Pas de fausse statistique.

## 7. Météo et températures : plan de collecte

| Donnée | Source proposée | Licence | Statut |
| --- | --- | --- | --- |
| Climat par mois et par circuit (température de l'air, probabilité de pluie sur la tranche horaire de la course, vent, humidité) | Archives de réanalyse météo ERA5 via Open-Meteo, 20 ans × 12 mois × 30 circuits | CC BY 4.0 (attribution) | R |
| Température de piste | Estimée à partir de l'air et de l'ensoleillement (méthode écrite) | — | E |
| Courses réellement humides depuis 2018 | Pneus intermédiaires ou pluie utilisés pendant la course (données publiques de stratégie par relais) | à vérifier | R |
| Courses humides avant 2018 | Causes « pluie » des SC et drapeaux rouges, comptes rendus | partiel | R, couverture incomplète, **affichée comme telle** |

- **Bloqué aujourd'hui** : les archives météo ne sont pas accessibles depuis mon environnement. Il faut autoriser l'accès réseau (une demande de modification de l'environnement, que tu approuves), au moment de la collecte.
- **Dans le moteur** : la météo dépend du **mois réel** du Grand Prix simulé. Si le calendrier déplace un Grand Prix, son climat change. Une fréquence historique devient une **probabilité**, jamais une certitude.
- La **pluie intermittente** et l'évolution de la piste mouillée appartiennent à la phase 13. En phase 11b, on garde la pluie « oui ou non » du modèle actuel, avec la bonne probabilité selon le mois. On ajoute la température, qui sera lue par les pneus et, en phase 12, par le refroidissement.

## 8. Les 24 circuits et le vivier futur

### 8.1 Différences actuelles (poids voiture d'aujourd'hui, à remplacer par les sensibilités mesurées)

| Profil actuel | Circuits | Remarque |
| --- | --- | --- |
| Virages lents très dominants (≥ 35 %) | Monacco 50 %, Hungarorring 39 %, Marinna Bay 37 % | Identité nette |
| Virages rapides (≥ 25 %) | Suzuca, Lussail, Jedda, Zandvort, Silverston | Identité nette |
| Moteur et vitesse de pointe | Hermanos Rodrigues (moteur 31 %, altitude), Las Vegaz, Monzza, Gilles-Villeneuves, Spielbergh | Le moteur est trop proche de la vitesse de pointe : double comptage des lignes droites (§1.2) |
| **Sans identité** (tous les poids entre 15 et 19 %) | Albert Parc, Shangai, Miamy, Austen, Interlagoss | Saisie « 3 partout » : c'est là que les données réelles changeront le plus |

**Écart possible aujourd'hui** : une voiture spécialisée en appui gagne environ 2 points d'indice entre son meilleur circuit (Lussail) et son pire (Monacco). C'est réel mais modeste. La phase 11b le rendra plus net **par les données, sans coefficient de bonus**.

### 8.2 Vivier de 30 circuits

- On garde les **24 actuels**.
- **6 candidats dont le tracé est déjà disponible** : Imola, Portimão, Istanbul, Sepang, Kyalami, et un circuit à choisir entre Nürburgring, Hockenheim, Paul Ricard et Mugello. Tous ont un historique F1 réel, sauf l'édition récente de Kyalami.
- **Calendrier** :
  - **20 Grands Prix, dont 10 permanents** (feuille de route), ou 24 comme aujourd'hui (D-141 : le nombre est voté par les écuries, 24 par défaut). **Conflit à trancher.**
  - Un circuit a un **contrat** (durée), une **date habituelle** (le mois de son Grand Prix), et peut sortir puis revenir ; son historique reste.
  - La rotation passe par une règle connue de tous, sans tirage favorable à quiconque.

## 9. Dépendances avec les phases 12 et 13

Chaque paramètre technique de la voiture, avec ce qui le sollicite, ce qui le lit et quand il devient actif. **Aucune caractéristique décorative** : si une ligne n'a pas de lecteur, elle n'est pas créée.

| Paramètre de la voiture | Sollicité par (circuit, conditions) | Lu par | Conséquence | Interactions | Actif en |
| --- | --- | --- | --- | --- | --- |
| Adhérence mécanique (virages lents) | Temps en virages lents, motricité, bosses | Profil de vitesse | Vitesse en virage lent, sortie de virage | Pneus (température), pluie | **11b** (poids), 13 |
| Appui | Temps en virages rapides et moyens | Profil de vitesse | Vitesse en grande courbe, freinage | Traînée, air perturbé, altitude, refroidissement | **11b**, 13 |
| Traînée (vitesse de pointe) | Part du tour à pleine charge | Profil de vitesse | Vitesse de pointe, aspiration | Appui, énergie | **11b**, 13 |
| Efficacité aérodynamique | Les deux à la fois | Profil de vitesse | Appui sans traînée | Remplacé en phase 12 par appui et traînée séparés | **11b** |
| Puissance du moteur | Pleine charge, altitude | Profil de vitesse | Accélération, vitesse de pointe | Densité de l'air, énergie, chaleur | **11b**, 13 |
| Gestion des pneus (voiture) | Énergie des pneus × abrasivité, température | Usure en course (modèle actuel), puis thermique des pneus | Rythme sur un relais | **Séparée de la compétence du pilote en phase 12** | 11b (usure), 13 |
| Stabilité au freinage | Énergie et nombre de gros freinages | Profil de vitesse (décélération) | Distance de freinage, attaques | Pilote (compétence freinage), bosses | 12 |
| Comportement sur bosses et vibreurs | Bosses et vibreurs par élément | Profil de vitesse (perte d'adhérence locale), usure | Monaco, Bakou, Singapour | Rigidité, hauteur de caisse | 12 |
| Refroidissement | Température, altitude, trafic, pleine charge | Modèle thermique | Perte progressive, puis usure, puis panne | Coût en traînée des ouvertures | 12 (paramètre), 13 (thermique) |
| Récupération et déploiement électriques | Énergie de freinage, longueur des pleines charges, règlement | Modèle d'énergie | Vitesse en fin de ligne droite, défense, attaque | Règlement 2026, intelligence de course | 13 |
| Sensibilité à l'air perturbé | Possibilité de suivre, virages rapides | Moteur de course (suivi) | Difficulté à dépasser | Appui, refroidissement | 13 |
| Fenêtre d'exploitation | Température, revêtement, réglages | Moteur de course | Voiture pointue contre polyvalente | Tout | 12–13 |
| Fiabilité | Durée, chaleur | Abandons (existant) | Pannes | Refroidissement | existant |

**Compétences des pilotes** (rappel du problème d'APEX Lab) :
- En phase 11b, les poids des pilotes viendront aussi du profil de vitesse : la part du temps passée au freinage, en virages lents, en virages rapides, en motricité.
- Cela rend la répartition **réelle**, mais **ne règle pas** le défaut « un pilote excellent partout gagne partout » : ce défaut vient de la note globale. Il ne sera vraiment réglé qu'en phase 13, quand chaque compétence agira **à l'endroit** où elle a un sens.
- Je le dis clairement pour qu'on n'attende pas de miracle de la phase 11b.

**Direction de course (phase 13)**. La phase 11b fournit seulement les données :
- par élément : dégagement, largeur, mur, accès des secours ;
- une table de règles **par période du règlement** : VSC depuis 2015, règles d'interruption et de reprise, changement de pneus sous drapeau rouge.

La chaîne de causes « incident → danger → intervention → décision » est conçue en phase 13. Elle sera **vérifiée** contre l'historique réel (§6), jamais **calée** dessus.

## 10. Tests et diagnostics

| Test | Indicateur mesurable | Phase |
| --- | --- | --- |
| Longueurs reconstruites contre officielles | Écart < 1 % sur tous les circuits | 11b |
| Virages reconstruits contre numérotation officielle | Même nombre de virages, ou écart justifié | 11b |
| Vitesses de passage (si relevés réels accessibles) | Écart moyen par virage, en km/h | 11b |
| Temps au tour de la voiture de référence | Ordre des circuits comparable aux temps réels (corrélation de rang) | 11b |
| Identité des circuits | Nombre de caractéristiques différentes en n° 1 ; plus aucun circuit « plat » | 11b |
| Pas de domination universelle | Aucune caractéristique n° 1 sur plus de la moitié du calendrier | 11b |
| Voitures spécialisées (faible traînée, fort appui, virages lents, virages rapides, pneus, polyvalente), même valeur moyenne | Le classement entre elles change selon le circuit ; ampleur des écarts | 11b (abstrait), 13 (complet) |
| Cohérence fiche et moteur | Les deux essentielles de la fiche sont bien les deux plus fortes sensibilités du moteur (test automatique sur tous les circuits) | 11b |
| Effet sur les résultats (équilibrage, D-076) | Campagne avant/après sur les mêmes graines : rang moyen, victoires et titres par écurie, surprises, abandons | 11b |
| Météo selon la date | Fréquence simulée de pluie par circuit et par mois contre climat source | 11b |
| Neutralisations (phase 13) | Distribution par circuit contre historique réel, **sans calage forcé** | 13 |
| Undercut, overcut, arrêt sous neutralisation, pluie, coup d'éclat | Contre 21 IA réactives (intention de la phase 13) | 13 |
| Téléphone | Temps de chargement des circuits ; temps du calcul des profils ; mémoire | 11b |

## 11. Plan de la phase 11b (proposé)

| Sous-phase | Contenu | Validation par le porteur avant |
| --- | --- | --- |
| **11b-1 Données réelles** | Accès aux sources (environnement), collecte : tracés, numérotation des virages, stands, tours, climat mensuel, historique des neutralisations, revêtement. Fichiers de données avec statut et source de chaque valeur. **Relecture d'un échantillon** (5 circuits) par toi | Les choix du §12 |
| **11b-2 Profil de vitesse et sensibilités** | Modèle physique simplifié, « valeur d'un point » (§4.2), poids voiture et pilote **calculés** à la place des notes saisies, exigences dérivées. **Campagne d'équilibrage avant/après** (D-076), sans toucher aux dynasties | Le calibrage « un point » |
| **11b-3 Calendrier et climat** | Vivier de 30, dates réelles, permanents et rotation, contrats des circuits, météo et température selon le mois, archives par circuit ; format de sauvegarde et migration | Le vivier et la taille du calendrier |
| **11b-4 Fiche circuit** | Écran mobile (blocs A à D, E vide), explications générées, test de cohérence fiche et moteur, parcours navigateur | La maquette |

La direction de course, les dépassements, l'énergie, la thermique et la course en 2D restent en **phase 13**. Les paramètres de voiture restent en **phase 12**.

## 12. Décisions qui demandent ta validation

1. **Le profil de vitesse comme source unique.** Les 9 notes actuelles et les poids des voitures et des pilotes ne sont plus saisis, mais **calculés** sur les tracés réels. *Recommandé* : c'est ce qui garantit la cohérence entre la fiche, le moteur actuel et la phase 13.
2. **La valeur d'un point de note** : même gain moyen sur le calendrier pour chaque caractéristique, en attendant les coûts de développement de la phase 12. *Recommandé.*
3. **Les résultats vont changer.** Des poids différents donnent des résultats différents : c'est un changement d'équilibrage, avec un rapport avant/après complet. Pas de correction des dynasties. *D'accord ?*
4. **Taille du calendrier** : 20 Grands Prix (feuille de route) ou 24 (D-141, vote par défaut) ? Et quels 10 circuits permanents ?
5. **Sources et licences** : autoriser l'accès réseau aux sources bloquées (archives météo, FIA, OpenStreetMap) au moment de la collecte. Accepter la licence d'OpenStreetMap (partage à l'identique des tracés dérivés, en lien avec D-043), ou s'en tenir au tracé GeoJSON (licence MIT) corrigé par les plans officiels.
6. **Vitesses réelles de passage** (télémétrie publique publiée après chaque Grand Prix) pour vérifier les rayons : les données de chronométrage appartiennent au championnat. Les utiliser **seulement pour calibrer** (jamais les redistribuer) te convient-il ?
7. **Les 6 circuits du vivier** : Imola, Portimão, Istanbul, Sepang, Kyalami, plus un au choix (Nürburgring, Hockenheim, Paul Ricard, Mugello) ?
8. **Configurations anciennes** : structure prête, mais **seule la configuration actuelle** saisie au départ ? *Recommandé* (le travail de données est déjà très important).
9. **Historique avant la phase 13** : afficher les neutralisations **réelles** dès la phase 11b, et « non simulé » pour les saisons jouées jusqu'à la phase 13 ? *Recommandé.*
10. **APEX Lab** : peux-tu déposer le rapport v0.9 dans `docs/echanges/` ? Sans lui, je ne reprends aucun de ses enseignements comme acquis.
