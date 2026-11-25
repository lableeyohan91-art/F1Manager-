# Phase 12c — analyse approfondie : voitures, développement, réformes, hiérarchies (25/11/2026)

> Demande du porteur : « analyse tout ce qu'on pourrait faire pour améliorer tout ça en profondeur ».
> Statut : **analyse et propositions, aucune décision**. Rien n'est codé ici, sauf ce que le porteur a déjà tranché
> (fiabilité retirée du châssis) ou demandé directement (points 9 et 10 de l'audit APEX).
> Sources : rapports `phase-12b-bis/`, `phase-12-profils/`, `phase-11b/audit-apex-lab.md` ; outils `banc-grille`, `banc-specialisation`,
> `labo-conception`, `tendances-voitures`.

## 0. Ce qu'on veut (rappel des intentions du porteur)

1. Une voiture peut être globalement meilleure **sans être la meilleure partout** ; cela doit venir de la **physique** (vitesse de pointe
   contre appui, etc.), pas d'une règle.
2. Des hiérarchies qui bougent (D-081) : 5 à 8 champions constructeurs sur 20 saisons, peu de dynasties, des remontées.
3. Des **régressions** possibles, et la **recherche récompensée**.
4. Des leviers techniques (soufflerie, rythme intensif) qui comptent, avec des conséquences.
5. Pas de course à l'infini (« pas de voitures à 500 km/h »).
6. Jamais d'équilibrage des résultats ; l'équilibrage déclaré des moyens est permis (D-169).

## 1. Diagnostic : ce qui est mesuré aujourd'hui

| Sujet | Mesure | Verdict |
| --- | --- | --- |
| Profils des voitures sur 30 circuits (notes actuelles) | Mercédès 1re partout ; 10 paires sur 55 s'inversent | Défaut (données plates **et** physique) |
| Même chose, notes proposées par le porteur | 3 voitures gagnent des circuits ; 17 paires sur 55 ; McLaren devant Mercédès en moyenne ; Red Bull ne gagne nulle part | Mieux, mais faussé par la physique (§2.1) |
| Réglage d'ailerons optimal | maximum sur **25 circuits sur 30** (Spa, Suzuka, Silverstone compris) | **Défaut physique confirmé** |
| Sensibilités de Silverstone | courbure ≈ 10 fois les autres circuits | **Artefact de calcul confirmé** |
| Refroidissement en course | température moyenne de l'année au lieu du mois du GP | **Bug confirmé, corrigé** (§2.3) |
| Vitesse des voitures sur 30 ans | +9 points (≈ 2,4 s) en 20 ans, puis plateau | Conforme (pas de course à l'infini) |
| Réformes | la grille progresse plus les années de réforme (+0,46 contre +0,27) ; 11 % des écuries reculent (21 % une année normale) | **Objectif non atteint** |
| Barème de soufflerie | Haas : barème plat ≈ barème réel | **Objectif non atteint** |
| Intensif ponctuel | n'apporte rien par rapport au normal | **Objectif non atteint** |
| Dynasties | 80 % des séries de 30 saisons ont 5 titres consécutifs ou plus (objectif 0–25 %) | **Objectif non atteint** |
| Mobilité (12b bis) | 6,6 champions constructeurs, 27 remontées | Retrouvée en bonne partie |

**Fil rouge** : trois objectifs non atteints ont une **cause commune**. Le développement est limité par l'**argent** (l'enveloppe des projets
est vide vers la mi-saison), pas par le temps. Tout ce qui accélère (heures de soufflerie, intensif) ne permet donc pas de faire plus,
seulement plus tôt. Et à la réforme, rien ne remet les compteurs à zéro : le savoir accumulé reconstruit aussitôt une voiture meilleure.

## 2. Axe A — la physique de la voiture (la fondation : tout le reste en dépend)

### A1. Le compromis appui / traînée est trop faible — priorité 1

**Constat.** Avec l'aéro active (2026), l'aileron s'ouvre en ligne droite et retire une quantité fixe de traînée. Un aileron chargé garde son
surplus de traînée, mais le gain en virage l'emporte presque toujours : le réglage optimal touche la borne haute sur 25 circuits sur 30.
Conséquences : une voiture « fort appui, forte traînée » (McLaren dans la proposition) est avantagée presque partout, une voiture
« faible traînée » (Mercédès, Ferrari) n'est payée que sur 4 ou 5 circuits ; les profils sont faussés.

**Cause probable.** Le calage de la 12a ne contraint que 7 circuits (5 tracés détaillés + 2 de validation) et ne pénalise la borne que sur
ces 7 ; il garde une pénalité résiduelle (le meilleur jeu trouvé touche encore des bornes).

**Options.**
1. *Recalage contraint sur les 30 circuits* (recommandé) : critère actuel (vitesses réelles des 5 tracés détaillés) + pénalité pour chaque
   circuit dont le réglage touche une borne + **ordres publics d'appui** (faits connus, pas des résultats) : Monza, Las Vegas, Bakou, Djeddah,
   Spa < circuits moyens < Monaco, Hongrie, Singapour, Zandvoort. Paramètres libres : finesse incrémentale, part de traînée de l'aileron,
   réduction de l'aéro active, plage de réglage.
2. *Aéro active proportionnelle* : retirer une **part** de la traînée de l'aileron (et non une quantité fixe). Plus simple, mais revient en
   partie sur D-163 (remise en cause à signaler).
3. *Vitesses de pointe publiques* : ajouter au critère les vitesses maximales connues par circuit (pièges à vitesse), pour que la traînée
   soit payée là où elle l'est en vrai.

**Test de validation.** Réglage optimal à l'intérieur de la plage sur au moins 25 circuits ; ordre public respecté ; écart de vitesse sur les
5 tracés détaillés pas plus de 10 % pire qu'aujourd'hui ; puis banc de la grille.

**Phase** : 12 (refonte D-163). **Coût** : un recalage + régénération des sensibilités + campagne avant/après (D-076).

### A2. Sensibilités robustes (Silverstone) — priorité 1, avec A1

Les dérivées sont calculées à ± 3 % ; si un virage bascule « à fond » dans cet intervalle, la courbure explose. Proposition : ajuster
d1 et d2 par moindres carrés sur une plage réaliste (−10 % à +10 %, 7 points), au lieu de deux points. Test : aucune courbure aberrante
(ratio au médian < 4), précision sur le temps au tour pour ± 10 % meilleure qu'aujourd'hui.

### A3. Refroidissement — fait, avec une limite de données

- **Fait** : la course utilise la chaleur du mois du Grand Prix.
- **Limite** : les températures des courses de nuit (Las Vegas, Singapour, Djeddah, Lusail, Bahreïn) sont probablement des températures
  de jour. À vérifier dans les données (`temperatureMensuelle`), pas dans le code.
- Effet aujourd'hui : le refroidissement ne pèse qu'à Mexico, Sepang et sur quelques courses d'été très chaudes. C'est réaliste ; les
  pontons « refroidissement généreux » sont un pari pour ces courses-là.

### A4. Les pneus de la voiture — à refaire en phase 13

La note `gestionPneus` de la voiture est un bonus fixe, pondéré par circuit. Elle profite à McLaren partout. En phase 13, la gestion des pneus
doit sortir de la physique (charge sur les pneus, glissement en sortie de virage, température) : appui, masse, suspensions et motricité.

## 3. Axe B — les profils de départ

### B1. Fiabilité hors du châssis — **fait** (décision du porteur)

Le châssis est maintenant calculé sur les virages lents et rapides ; la fiabilité ne rend plus une voiture plus lente.

### B2. Une note « motricité / freinage » ? Mon avis

**Oui pour la motricité, non pour le freinage.**
- **Motricité** : elle pèse lourd dans notre physique. Le banc de la 11b montre qu'à Monaco, la motricité vaut 1,06 s, plus que tout le reste,
  et elle distingue les voitures sur les circuits lents (Monaco, Singapour, Hongrie, Mexico). Aujourd'hui, elle est mélangée avec les virages
  lents et les pneus : impossible de dire « McLaren excellente en motricité » sans la dire excellente en virages lents.
  Proposition : une colonne `motricite` dans `voitures.csv`, qui alimente l'efficacité et le concept des suspensions (souplesse et motricité).
- **Freinage** : dans notre physique, il distingue très peu les voitures (il faut +29 % d'adhérence au freinage pour gagner 0,5 s par tour).
  Les écarts de freinage entre F1 viennent surtout du **pilote** (compétence existante) et, en phase 13, de la température des freins.
  Une note de voiture serait presque décorative, ce qui va contre la règle « pas d'attribut sans formule qui compte ».
- Coût : une colonne de données (11 valeurs à fournir par le porteur), une migration n'est pas nécessaire (conversion faite une seule fois
  à la création du monde ; les anciennes parties gardent leurs pièces).

### B3. Valider les identités après A1

Relancer `banc-grille` avec la proposition du porteur une fois la physique corrigée. Critères proposés (indicatifs, D-040) :
Mercédès 1re en moyenne mais 1re sur **moins de 60 %** des circuits ; au moins 4 voitures 1res quelque part ; au moins 25 paires sur 55
qui s'inversent ; chaque identité gagne « ses » circuits (Ferrari en ligne droite, McLaren en motricité, Red Bull en virages rapides).

### B4. Suivre les profils en continu

Ajouter aux campagnes d'équilibrage : « voitures 1res sur au moins un circuit (début de saison) » et « écart de rang d'une voiture d'un circuit à
l'autre ». Ainsi on voit si le développement re-homogénéise les voitures au fil des saisons.

## 4. Axe C — le développement : rendre le temps et les heures utiles

**Constat** : c'est l'argent qui limite. Aller plus vite ne sert à rien.

### C1. Les heures de soufflerie améliorent la qualité — priorité 2

Aujourd'hui, les heures servent surtout à avancer plus vite. Proposition : elles relèvent aussi la **qualité** de la pièce produite
(efficacité finale, plus proche de la frontière ; moins de défauts cachés). Une écurie mal classée, avec plus d'heures, fait de meilleures
pièces pour le même argent : c'est l'esprit du barème réel. Test : barème plat nettement moins bon que le réel pour Haas (laboratoire).

### C2. Des échéances qui donnent un sens à l'intensif — priorité 2

L'intensif doit servir à **tenir une date** : une pièce prête pour un Grand Prix choisi (circuit où elle rapporte le plus), avant le gel de
fin d'année, ou avant une réforme. Proposition : le joueur peut fixer une échéance à un projet ; l'estimation du responsable dit si elle est
tenable au rythme normal ; l'IA passe en intensif quand l'échéance est menacée et que l'équipe est fraîche. Conséquences inchangées
(fatigue, incidents, alertes). Test : dans le laboratoire, « intensif pour une échéance » rapporte plus de points que « normal » sur la saison,
et « intensif permanent » reste mauvais.

### C3. Le compromis saison en cours / avenir

La répartition de la soufflerie compte déjà (0 % contre 100 % de recherche). Ce qui manque, c'est le moment où la préparation paie :
c'est l'axe D.

## 5. Axe D — réformes et régressions — priorité 2

**Constat** : à la réforme, la voiture est reconstruite à partir du savoir accumulé ; elle progresse plus qu'une année normale.

**Proposition** : une grande réforme **abaisse la frontière** pour tout le monde (l'équivalent d'une coupe d'appui ou d'une nouvelle
motorisation : de l'ordre de −2 à −3 points, selon l'orientation de la réforme), puis la progression reprend.
- Les écuries qui ont **préparé** le règlement (recherche ciblée, bonne architecture) retrouvent leur niveau en une ou deux saisons ; les
  autres reculent réellement. C'est ce qui récompense la recherche.
- Le savoir de fond (30 %, V5) reste ; le savoir propre à l'ancien règlement est perdu (déjà le cas).
- Les paris d'architecture gardent leur rôle : une mauvaise architecture coûte plus quand tout le monde repart de plus bas.
- Option « moteurs » : une réforme moteur rebat la puissance des motoristes (comme 2014 ou 2026), avec l'ADUO pour rattraper.

Test : l'année d'une grande réforme, la grille recule en moyenne ; plus d'écuries reculent qu'une année normale ; les écuries qui ont préparé
reculent moins ; plus de changements de hiérarchie autour des réformes.

## 6. Axe E — dynasties — priorité 3, d'abord mesurer

80 % des séries ont une dynastie de 5 titres (objectif 0 à 25 %). Avant de corriger, **mesurer les causes** dans une campagne :
part de l'argent (primes, sponsors), du personnel (meilleurs ingénieurs attirés par les champions), du savoir accumulé, des pilotes.
Leviers possibles, tous déclarés (D-169), à choisir **après** la mesure :
- les réformes de l'axe D (casser les dynasties est leur rôle historique) ;
- un savoir qui s'use (des méthodes qui vieillissent) ;
- le marché du personnel (les ingénieurs des champions sont débauchés) ;
- l'amplification α de la soufflerie (α = 2 donne 50 % de séries à 5 titres) ;
- l'usure du succès (D-140), déjà en place côté pilotes.

## 7. Axe F — moteurs

- **ADUO** : fait ; mesuré utile (sans lui, 6,1 champions au lieu de 6,6).
- À venir : développement propre des motoristes selon leur budget ; réforme moteur qui rebat les cartes ; et l'effet du moteur client
  contre usine (aujourd'hui, même puissance, D-114).

## 8. Axe G — outils de mesure (point 10 de l'audit APEX) — **fait en partie**

Quatre niveaux, du plus pur au plus complet :
1. **Banc physique** : `tools/banc-specialisation.mts` (voitures à une seule caractéristique, même niveau global). À relancer après A1.
2. **Banc de la grille** : `tools/banc-grille.mts` (les 11 voitures, 30 circuits, sans hasard).
3. **Course neutralisée** : paramètres d'expérience **ajoutés** : `course.meteoForcee` (−1 tirage, 0 sec, 1 pluie), `course.abandons` (0 = ni
   panne ni incident), `course.pression` (0 = pas d'erreur sous pression), `course.aleaSigma` (0 = pas d'aléa). Testé : mêmes graines et mêmes
   paramètres donnent les mêmes résultats.
4. **Campagne complète** : `npm run equilibrage` (avec `--param`).

## 9. Axe H — leçons pour la phase 13 (moteur de course)

La course actuelle est calculée en une fois (temps = voiture + pilote + forme + aléa + pression). Les compétences dépassement, défense,
départs, intelligence de course, retour technique ne font que peser dans une moyenne. La phase 13 devra, avec des tests prévus dès sa
conception :
- dépassements selon l'écart **local** (vitesse de pointe en ligne droite, motricité en sortie de virage, freinage), l'aspiration, l'air
  perturbé, la défense ; pas d'échanges de position à chaque tour (enseignement d'APEX : 64 dépassements annoncés pour 1,66 place gagnée) ;
- modes (pilotage, ERS, carburant, pneus) dont aucun n'est optimal en permanence ; économiser pour attaquer au bon moment ;
- carburant (charge de départ, masse, consommation, panne en cas d'erreur) ;
- arrêts, undercut et overcut réussis ou ratés, trafic, neutralisations ;
- pluie qui évolue, prévisions incertaines, paris gagnés et perdus ;
- chaque compétence de pilote avec un usage réel et situé.

## 10. Ordre proposé

| Ordre | Chantier | Phase | Décision du porteur nécessaire |
| --- | --- | --- | --- |
| 1 | A1 + A2 : compromis appui/traînée, sensibilités robustes ; banc physique et banc de la grille avant/après | 12 | Option A1-1 (recommandée) ou A1-2 (remise en cause partielle de D-163) |
| 2 | B2 : colonne motricité ; B3 : valider les identités des 11 voitures | 12 | Oui/non motricité ; valeurs ; identités |
| 3 | D : réformes qui font reculer | 12 | Ampleur de la baisse |
| 4 | C1 + C2 : heures → qualité ; échéances et intensif | 12 | Oui/non |
| 5 | E : mesurer les causes des dynasties, puis choisir un levier | 12 (grande campagne) | Après mesure |
| 6 | F : développement des motoristes, réforme moteur | 12 ou 13 | Plus tard |
| 7 | H : moteur de course | 13 | Conception dédiée |

Chaque étape : rapport avant/après sur les mêmes graines, tous les indicateurs (D-076), sans recalibrage des résultats.
