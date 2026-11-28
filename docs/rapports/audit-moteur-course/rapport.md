# Audit du moteur de course

> Réponse au « prompt maître du moteur de course » (28/11/2026). Étape 1 seulement : aucun réglage du jeu modifié. Dépôt au commit
> 2bf9ec3, 576 tests (575 passent ; celui qui échoue mesure un temps de calcul et échoue quand la machine est chargée). Mesures
> reproductibles : `tools/banc-pilotes.mts`, `tools/banc-philosophies.mts`, `tools/banc-consignes.mts`, campagnes de la phase 13a.

## Ce qu'il faut retenir

- **La physique existe, mais la course ne s'en sert que sous forme résumée.** Le profil de vitesse calcule point par point, sur les vrais
  tracés, ce qui limite la vitesse (virage, freinage, motricité, puissance). Il tourne **hors du jeu** : la course lit sept
  « sensibilités » par circuit. C'est léger et juste en moyenne, mais il n'y a ni portions, ni positions, ni dépassements pendant la course.
- **Les circuits se ressemblent trop pour la voiture.** Sur les 30 circuits, le classement de ce qui rapporte le plus est presque toujours
  le même : masse, puis adhérence mécanique, appui, puissance ; la traînée, la motricité et le freinage comptent peu, **même à Monza et à
  Monaco**. C'est le premier chantier physique.
- **Le défaut « Verstappen » d'APEX n'existe pas chez nous sous cette forme** : à voiture identique, il gagne 35 % des courses sur le sec
  et 23 % sous la pluie (APEX : 71 sur 72). Mais **cinq compétences ne servent qu'à une moyenne** (dépassement, défense, départs, retour
  technique, intelligence de course) : le défaut décrit au §5 de ton cahier des charges est bien présent.
- **Le défaut « 525 sur 528 » d'APEX existe chez nous** : sur 180 Grands Prix, aucune stratégie à deux arrêts, 67 % de « moyen → dur ».
- **Le neutre est le meilleur réglage** parce que, sans positions ni événements, une consigne ne peut que déplacer du temps : aucune
  situation ne la rend utile. Les sous-phases 13b et 13c lèveront la plupart de ces limites ; l'équilibre des pneus et du carburant
  demande en plus des corrections propres.

## A — État réel du moteur

Légende : **Fait**, **Partiel**, **Absent**, **Déséquilibré**, **Prévu** (sous-phase indiquée).

| Système | État | Ce qui existe vraiment | Sous-phase |
| --- | --- | --- | --- |
| Physique de la voiture | Partiel | 7 paramètres (appui, traînée, masse, adhérence mécanique, motricité, freinage, puissance) + refroidissement selon le mois et l'altitude ; pièces et motoristes → paramètres ; écart au tour = sensibilités du circuit | 13b (portions) |
| Profil de vitesse par portion | Fait, hors du jeu | `src/engine/circuits/profil.ts` : vitesse point par point, cause limitante gardée ; utilisé pour calculer les sensibilités et choisir les ailerons, pas pendant la course | 13b |
| Différences entre circuits | Déséquilibré | Mêmes paramètres décisifs partout (voir B.2) | 13b |
| Qualifications | Absent | Pas de séance ni de grille ; le classement se fait au temps total | 13b |
| Départ et premier tour | Absent | La compétence « départs » n'est qu'un poids dans une moyenne | 13b |
| Positions, écarts, trafic, dépassements, défense | Absent | Classement au temps total | 13b |
| Aspiration, air perturbé | Absent | — | 13b |
| Pneus | Fait, déséquilibré | 3 composés secs + pluie, usure, falaise, circuit, pilote, voiture, consignes ; pas de température ; aucun 2 arrêts | 13a (à corriger) + 13c |
| Carburant | Partiel | Consommation et économie forcée ; **pas de gain de masse** ni de charge réduite ni de panne sèche | 13a (à compléter) |
| Batterie / ERS | Partiel | Réserve dépensée puis rechargée ; ne déplace du temps que sur le tour ; sans attaque ni défense, elle ne sert à rien | 13b |
| Quatre consignes | Fait | Commande commune, fiche du pilote, valables jusqu'à nouvel ordre ; pas modifiables tour par tour | 13e (en direct) |
| Arrêts et équipe des stands | Fait | Perte dans la voie, immobilisation et erreurs selon l'équipe des stands | — |
| Stratégie | Partiel | Choisie avant la course sur une estimation imparfaite de l'usure ; jamais changée en course | 13c, 13d |
| Undercut, overcut | Absent | Impossible sans positions ni pneus froids | 13c |
| Météo | Partiel | Pluie ou pas pour toute la course (climat réel du mois) ; pas d'évolution, d'état de piste, de prévision | 13c |
| Voiture de sécurité, VSC, drapeau rouge | Absent | — | 13c |
| Erreurs des pilotes | Partiel | Un seul tirage d'incident par course (abandon) selon la régularité, la pluie, le circuit et la conduite ; pas d'erreurs légères | 13c |
| Fiabilité | Partiel | Un tirage d'abandon mécanique par course (fiabilité, pièces fragiles, département) ; pas d'usure des composants ni de température | 13c |
| Compétences des pilotes | Déséquilibré | Voir B.3 | 13b, 13c |
| Forme, confiance, motivation | Partiel | Confiance et motivation : ±0,1 % ; pas de « forme du week-end » propre (l'aléa de course en tient lieu) | 13b |
| Affinité, nouveauté, expérience | Fait | Affinité ±2 niveaux par circuit, nouveauté du circuit et de l'écurie, apprentissage de la pluie | — |
| Pression, sang-froid | Partiel | Le sang-froid ne joue qu'en fin de championnat pour les prétendants (erreur −0,6 %) ; stress hors course | 13c |
| Fatigue physique en course | Absent | — | 13c (D-192) |
| IA de course | Partiel | Stratégie optimale sur estimation ; consignes neutres ; ne réagit à rien | 13d |
| Ingénieur de course | Absent | — | 13d |
| Vue 2D, explications en course | Absent | Le résultat garde une explication (voiture, pilote, forme, aléa, pneus, arrêts, stratégie) | 13e, 13f |
| Déterminisme | Fait | Graine, flux séparés par système, tirages locaux ; neutralisations de banc : météo, abandons, pression ; manquent : forme, erreurs séparées | — |
| Deux niveaux de finesse | Absent | Un seul niveau aujourd'hui | 13b |
| Coût de calcul | Fait | Saison complète ≈ 3,3 s sur ordinateur (13a : +6 %) ; non mesuré sur téléphone depuis la 13a | à remesurer |

## B — Les enseignements d'APEX, un par un

### B.1 Verstappen dominait (71 victoires sur 72 à voiture égale)

- **Chez nous (mesuré)** : 22 pilotes dans une voiture identique, 30 circuits × 20 courses, aléa de course, pneus de la 13a :
| Condition | Verstapen | 2e pilote | Vainqueurs différents |
| --- | --- | --- | --- |
| Sec (600 courses) | 35,5 % des victoires, 410 podiums | Hammilton 9,0 % | 20 |
| Pluie (600 courses) | 23,3 % | Alonzo 12,8 % | 21 |
- **Risque** : faible sous cette forme. L'écart de niveau (≈ 2,5 points au-dessus des meilleurs) vaut ≈ 0,35 % du tour, pour un aléa de
  0,30 %. Un grand pilote gagne souvent, sans gagner toujours.
- **Mais** : sa domination ne vient pas de situations (il n'y a pas de dépassement, de défense, de départ), seulement d'une moyenne.
- **Tests à faire** : refaire ce banc avec la 13b (dépassements, départs, défense) ; vérifier qu'un spécialiste (pluie, freinage) bat le
  meilleur pilote sur « son » terrain.

### B.2 Confondre la géométrie d'une portion et ce qui limite la vitesse

- **APEX** : des portions classées « lignes droites » parce que la puissance limitait la vitesse.
- **Chez nous** : le profil de vitesse garde la cause limitante en chaque point, séparée de la courbure (géométrie). **Le risque n'existe pas
  dans le modèle.**
- **Mais un autre problème apparaît** (banc des sept philosophies, physique du jeu) :

Gain au tour (%) pour 1 % de mieux sur un seul paramètre :

| Circuit | Appui | Traînée −1 % | Puissance | Motricité | Freinage | Adhérence méca. | Masse −1 % |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Suzuka | 0,204 | 0,064 | 0,151 | 0,018 | 0,017 | 0,226 | 0,329 |
| Monaco | 0,135 | 0,036 | 0,108 | 0,063 | 0,020 | 0,256 | 0,251 |
| Monza | 0,143 | 0,086 | 0,157 | 0,030 | 0,037 | 0,186 | 0,272 |
| Singapour | 0,121 | 0,038 | 0,124 | 0,054 | 0,032 | 0,220 | 0,247 |
| Mexico | 0,116 | 0,033 | 0,097 | 0,053 | 0,041 | 0,264 | 0,216 |
| Moyenne des 30 | 0,150 | 0,055 | 0,137 | 0,039 | 0,027 | 0,222 | 0,274 |

  Le même ordre presque partout : à Monza, la traînée vaut moins que l'appui ; à Monaco, la motricité compte peu ; le freinage ne compte
  nulle part. Les sept prototypes (fort appui, faible traînée, puissance, motricité, freinage, adhérence mécanique, polyvalente), à écarts
  comparables choisis à la main : **l'adhérence mécanique gagne les 30 circuits**, la faible traînée finit dernière partout, même à Monza.
  Ce n'est pas un « bonus » mal placé : ce sont les sensibilités du modèle physique (référence au fort appui, aéro active partielle,
  D-171). **À corriger avant 13b.**
- **Nuance** : le jeu actuel compense une partie de ce défaut au niveau des notes de départ et des pièces (chaque caractéristique est
  décisive sur 2 à 10 circuits, mesure du 27/11). Le défaut est dans la physique, pas encore dans les résultats.

### B.3 Des compétences qui ne servent qu'à une moyenne

Gain au tour pour +5 points d'une compétence (moyenne des 30 circuits ; aléa de course : 0,30 % sec, 0,51 % pluie) :

| Compétence | Sec | Pluie | Effet situationnel aujourd'hui |
| --- | --- | --- | --- |
| Freinage, virages lents, virages rapides, motricité | 0,07–0,08 (0,02 à 0,15 selon le circuit) | ≈ 0,02 | Oui : pondérées par les exigences du circuit |
| Pluie | — | 0,21 | Oui : seulement sous la pluie |
| Gestion des pneus | 0,065 | 0,065 | Oui : usure de la 13a + circuit |
| Régularité | 0,09 | 0,09 | En partie : moins d'incidents |
| Condition | 0,046 | 0,046 | En partie : circuits exigeants |
| Intelligence de course | 0,09 | 0,09 | **Non** (moyenne) |
| Dépassement | 0,06 | 0,06 | **Non** |
| Défense, départs, retour technique | 0,04 | 0,04 | **Non** |

- **Risque confirmé** : cinq compétences rendent le pilote « un peu plus rapide partout ». Le retour technique ne sert pas aux ingénieurs.
- **Correction** : 13b donne leur situation à dépassement, défense, départs ; 13c à intelligence de course (décisions, gestion) ;
  retour technique → précision des réglages et de l'estimation de l'usure (13d). **Leur poids dans la moyenne doit alors baisser d'autant**
  (sinon double effet).

### B.4 Forme, confiance, affinité qui s'additionnent

- **Chez nous** : confiance ±0,1 %, motivation jusqu'à −0,1 %, affinité ±2 niveaux (≈ ±0,3 %), nouveauté (pénalité de découverte), pression
  −0,6 % rare. Tout s'additionne, mais les montants sont petits devant l'aléa. **Risque faible aujourd'hui** ; il augmentera si on ajoute
  une « forme du week-end » sans retirer une part de l'aléa générique (D-103 le prévoyait).
- **Test** : banc « petits bonus cumulés » (même pilote, tout favorable contre tout neutre).

### B.5 L'agressivité permanente trop rentable

- **Chez nous** : deux réglages corrigés cette nuit (pneus conservateurs puis conduite agressive dominaient). Aujourd'hui, « tout agressif »
  et « tout conservateur » sont nettement moins bons ; aucune consigne seule ne domine (−5 % à +1 % des points). **Risque maîtrisé, mais
  le neutre est le meilleur partout** (voir C.1).

### B.6 Le sous-carburant presque toujours fatal

- **Chez nous** : impossible pour l'instant (pas de charge réduite au départ ni de panne sèche). **À construire avec ses tests** (C.4).

### B.7 Les pneus moyens dans 525 stratégies sur 528

- **Chez nous (mesuré, 3 parties × 3 saisons, 180 Grands Prix, 2 640 courses de pilotes)** :
| Stratégie | Part |
| --- | --- |
| moyen → dur (1 arrêt) | 67 % |
| tendre → dur | 13 % |
| pluie (sans arrêt) | 11 % |
| tendre → moyen | 9 % |
| 2 arrêts ou plus | **0 %** |
- **Risque confirmé** : le dur et le moyen sont presque toujours utilisés, le tendre rarement, jamais deux arrêts. Causes : écarts entre
  composés trop faibles face à la perte d'un arrêt (≈ 24 s), pas de température, pas de neutralisation, pas de trafic.

### B.8 64 dépassements par course pour 1,66 place gagnée

- **Chez nous** : pas encore de dépassements. **Tests à inscrire en 13b** : dépassements par course, places gagnées du départ à l'arrivée,
  échanges répétés entre la même paire, trains figés.

### B.9 Attendre avant de changer de pneus sous la pluie était trop souvent gagnant

- **Chez nous** : la pluie dure toute la course ; il n'y a pas de choix. **À construire en 13c avec le banc météo** (campagne E).

### B.10 Fréquences de neutralisations et bugs de SC / drapeau rouge

- **Chez nous** : absentes. Les bugs d'APEX (temps qui recule sous SC, réinsertion incohérente, avantage aux stands, pneus sous drapeau
  rouge) deviennent des **tests de non-régression** de 13c. Fréquences à caler sur des références publiques par circuit, pas sur APEX.

### B.11 L'IA qui ne réagit pas rend le joueur trop fort

- **Chez nous** : l'IA ne réagit à rien, mais le joueur ne peut pas non plus intervenir en course. Le risque apparaîtra en 13e : **la 13d
  (IA réactive) doit venir avant ou avec la 13e.**

## C — Critique de la phase 13a

### C.1 Pourquoi le neutre reste légèrement meilleur

Une consigne échange du rythme contre une ressource (pneus, carburant, batterie, risque). Sans positions, trafic, neutralisation ni fin
de course disputée, **il n'y a jamais de moment où la ressource vaut plus que le rythme** : l'échange est constant, donc au mieux neutre.
C'est normal en 13a ; la 13b (attaquer, défendre) et la 13c (voiture de sécurité, pluie, fin de relais) créeront ces moments. Il ne
faut **pas** recalibrer les consignes pour qu'elles battent le neutre en moyenne : elles doivent gagner dans leurs situations.

### C.2 La batterie

Elle ne fait que déplacer du temps d'un tour à l'autre : sur une course entière, elle ne rapporte rien (mesuré : ±0,0 point). C'est le
bon principe (« déplacer la performance »), mais **sans dépassement elle est inutile**. Elle doit aussi lire la physique : l'énergie
électrique déployée par tour existe déjà dans le profil de vitesse ; la réserve doit en découler (13b).

### C.3 Les pneus

Trois défauts : composés trop proches au regard de la perte d'un arrêt ; pas de température (pneus neufs froids, surchauffe en attaque,
indispensables à l'undercut) ; usure linéaire identique sur tous les circuits à un facteur près. Corrections proposées en 13a bis (§D).

### C.4 Le carburant

Il manque l'essentiel du choix : **la charge de départ** (plus léger = plus rapide au début, risque d'économie ou de panne), le gain de
masse au fil de la course, la panne sèche possible. Aujourd'hui, la seule décision est « agressif ou non », sans intérêt.

### C.5 Les stratégies d'arrêts

Pas encore intéressantes : un seul arrêt, presque toujours moyen → dur, décidé avant la course, jamais révisé.

### C.6 Pourquoi les dominations ont remonté (12 → 17 %) et la dernière écurie marque moins (83 → 73 %)

Les pneus et les arrêts ajoutent une différence **systématique** entre écuries (gestion des pneus des pilotes et des voitures, qualité de
l'équipe des stands), qui va plutôt aux meilleures écuries, sans ajouter d'aléa (il n'y a ni neutralisation, ni erreur de stratégie, ni
pluie qui change). La 13c ajoutera ces aléas crédibles ; il ne faut pas corriger les dominations avant de l'avoir mesurée.

### C.7 Ce que les phases 13b et 13c amélioreront naturellement

Valeur des consignes et de la batterie (13b), compétences situationnelles (13b, 13c), qualifications et départs (13b), diversité des
stratégies (13c : neutralisations, pluie, températures), surprises crédibles (13c), dominations (13c, à mesurer).

## D — Plan de développement

| Sous-phase | Contenu | Dépend de | Risques | Tests et critères de réussite | Coût de calcul |
| --- | --- | --- | --- | --- | --- |
| **13a bis** (court) | Pneus : température (chauffe, surchauffe), écarts entre composés, usure selon le circuit ; carburant : charge de départ, masse, panne sèche ; physique : revoir les sensibilités pour que traînée, motricité et freinage comptent là où ils doivent (Monza, Monaco, Singapour) | 13a | Toucher la physique recalibre toute la grille | Stratégies variées (au moins 15 % de 2 arrêts sur les circuits dégradants, les 3 composés utilisés) ; Monza récompense la faible traînée ; bancs philosophies et consignes | nul |
| **13b** | Course qui avance **tour par tour avec des positions** : qualifications, départ, écarts, trafic, air perturbé, aspiration, batterie pour attaquer et défendre, dépassements localisés aux zones de dépassement des fiches ; compétences dépassement, défense, départs en situation ; deux finesses (détaillée pour la course regardée, par tour pour les autres) ; vue 2D schématique | 13a bis | Dépassements trop faciles ou impossibles ; coût | Dépassements par course plausibles par circuit (Monaco ≪ Monza) ; places gagnées départ→arrivée ; pas d'échanges répétés ; les deux finesses donnent les mêmes hiérarchies (écart mesuré) | × 3 à × 10 sur la course regardée ; faible sur les autres |
| **13c** | Voiture de sécurité, VSC, drapeau rouge (fréquences par circuit) ; pluie qui évolue, état de piste, prévisions ; undercut et overcut (pneus froids, trafic) ; erreurs graduées (petite erreur → abandon), pénalités ; fiabilité selon l'usure et la température ; fatigue physique en course ; sang-froid en course | 13b | Hasard qui décide tout ; bugs de reprise | Non-régression des bugs APEX ; undercut parfois gagnant, parfois perdant ; anticiper la pluie parfois payant ; fréquences crédibles | faible |
| **13d** | IA de course réactive (stratégie, consignes, réaction aux événements) avec personnalités (prudente, agressive, opportuniste…) liées au personnel ; ingénieur de course (conseils incertains selon ses compétences, le retour technique du pilote et les outils) ; même commande pour tous | 13c | IA omnisciente ou absurde | Campagne D contre IA réactives ; campagne G (profils A à E, 1 000 courses) | faible |
| **13e** | Interface mobile : préparer la stratégie, laisser l'ingénieur gérer, alertes aux moments clés, consignes en direct, explication de chaque gain ou perte | 13d | Microgestion, lisibilité | Parcours joueur ; une course jouable sans intervention et améliorable par un joueur attentif | — |
| **13f** | Vraie vue 2D : voitures, écarts, dépassements, arrêts, neutralisations, état de piste ; elle ne fait qu'afficher le moteur | 13e | Coût d'affichage sur téléphone | Fluidité sur téléphone ; ce qui est vu = ce qui est calculé | affichage seulement |

**Décisions structurantes à te soumettre avant 13b** :
1. **La course doit pouvoir s'arrêter et reprendre** (pour que tu interviennes) : la course regardée devient un état sauvegardable, avancé
   tour par tour par le moteur. Changement d'architecture (format de sauvegarde, interface).
2. **Revoir les sensibilités physiques** des circuits (13a bis) : cela changera la hiérarchie de départ des voitures ; il faudra revérifier
   le banc de la grille.
3. **Baisser le poids « moyenne » des compétences qui reçoivent une situation** (sans changer les notes des pilotes).

## E — Critique franche de notre ambition

**Réaliste** : physique par portions (elle existe déjà hors du jeu), positions et dépassements par portion, neutralisations, pluie
évolutive, IA à règles avec personnalités, ingénieur imparfait, vue 2D schématique.

**Risque de devenir trop complexe** :
- simuler finement les 22 voitures à chaque course de chaque saison simulée : il faut les deux finesses, et prouver qu'elles s'accordent ;
- la température des pneus, des freins et du moteur en même temps : commencer par les pneus seulement ;
- des drapeaux rouges avec réparations et règles de reprise complètes : version simple d'abord (reprise dans l'ordre, pneus libres).

**Risque d'ennui sur mobile** : quatre consignes × deux pilotes à surveiller à chaque tour. Il faut que l'ingénieur gère par défaut et
que le jeu t'appelle aux moments décisifs (alerte, pause automatique), avec une course regardable en accéléré.

**Risque de stratégie dominante** : l'undercut (si les pneus neufs sont toujours plus rapides et qu'il n'y a pas de pneus froids ni de
trafic) ; « attendre la voiture de sécurité » (si elle est trop fréquente) ; batterie gardée pour la fin (si l'attaque finale est trop
facile). Chacun aura son banc.

**Risque de résultats incohérents** : dépassements en boucle entre deux voitures ; voiture lente devant mais intouchable ; temps qui
reculent sous neutralisation. Tests de non-régression dès la 13b.

**À simplifier** : 81 combinaisons de consignes à afficher → quelques **profils** prêts à l'emploi (attaque, gestion, défense, économie)
et le détail pour qui le veut ; carburant en trois charges de départ plutôt qu'un réglage continu.

**Mérite plus de profondeur** : l'ingénieur de course (c'est lui qui rend la course lisible et qui crée les paris), les qualifications (sur
les circuits où l'on dépasse peu, elles font la moitié de la course), les spécialités des pilotes (pluie, freinage, défense), qui
donnent les scénarios 6 et 7 de ton cahier des charges.

**Ce que je te recommande** : commencer par une **13a bis courte** (physique des circuits, pneus, carburant), parce que sans elle les
bancs de la 13b mesureraient une physique fausse ; puis 13b. La campagne G (valeur des décisions du joueur) n'a de sens qu'après la 13d.
