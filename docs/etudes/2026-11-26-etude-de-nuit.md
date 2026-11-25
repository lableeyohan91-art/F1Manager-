# Étude de nuit du 26/11/2026 — réponses aux questions du porteur

> Demande du porteur (25/11/2026, au soir) : sens de chaque caractéristique de voiture, notes de 19-20 la première année d'un règlement,
> où en est l'équilibre et comment éviter les cycles de domination, **le plaisir de jouer** (une petite écurie peut-elle progresser ?),
> moteurs des écuries clientes et choix du motoriste, un nouveau motoriste scénarisé, des pilotes payants avec un vrai dilemme, relecture
> complète du projet (bugs, incohérences, cohérence avec l'objectif). Puis : mode paysage, puis phase 13.
> Statut : **étude et propositions** ; seuls des bugs confirmés ont été corrigés. Aucune décision prise à la place du porteur.
> Les mesures sont indicatives (D-120). Outils : `banc-grille`, `banc-specialisation`, `saison-victoires`, `trajectoire-ecurie`,
> `tendances-voitures`, `npm run equilibrage`.

## Résumé en dix lignes

1. **Chaque caractéristique physique de la voiture gagne du temps quelque part et en perd ailleurs** (mesuré sur 30 circuits). Deux
   exceptions à traiter : la note de **pneus** de la voiture (bonus fixe provisoire, à refaire en phase 13) et le **refroidissement**, qui
   ne compte que sur les courses chaudes ou en altitude (c'est voulu, mais le banc ne le teste pas encore).
2. **Les notes de 19-20 ne sont pas un problème de moteur** : la note n'est qu'un point de départ relatif ; la voiture progresse ensuite de
   l'ordre de +8 à +9 points en 20 ans avant un plateau. Mais **l'affichage « /20 » trompe** : je propose de montrer au joueur des écarts
   (en secondes) et la « maturité du règlement », pas des notes absolues.
3. **Équilibre** : nettement mieux avec la 12c (6,8 champions sur 30 saisons, titre ouvert 34 %, dernière écurie qui marque 68 %) ; restent
   trop fréquentes les **dynasties** (60 % des séries ont 5 titres de suite ; objectif 0–25 %) et les **dominations** (9 %, objectif < 5 %).
4. **Cadillac et Audi dirigées par l'IA remontent** (Cadillac : 10,8e en 2027, 6,8e en 2036, un podium médian dès 2032) ; **Haas, pauvre,
   stagne puis recule** (budget de développement en baisse) : **piège de la pauvreté confirmé**, priorité pour le plaisir de jouer.
   Un choix « de joueur » fait mieux que l'IA (une place gagnée en moyenne sur 4 saisons).
5. **Moteurs** : aujourd'hui, le motoriste est figé par les données, le client a exactement la même puissance que l'usine, il n'y a ni
   contrat, ni coût, ni changement possible. C'est un vrai manque ; proposition de **contrats moteur** (choix à chaque cycle).
6. **Nouveau motoriste scénarisé** : faisable et pertinent, à condition que ce soit un événement du monde (il peut aller à une écurie de
   l'IA), pas un cadeau au joueur.
7. **Pilote payant avec dilemme** : faisable (les briques existent à 60 %) et très pertinent pour les petites écuries.
8. **Relecture** : 5 bugs réels corrigés cette nuit (dont 2 importants), une erreur de mesure corrigée dans mon propre outil (réformes),
   documentation en retard (feuille de route, glossaire, fiches « pas encore codée »), nombres en dur nombreux hors de `balance/`.

## 1. Toutes les caractéristiques ont-elles un sens en course ?

Banc de spécialisation (physique recalée, D-175) : chaque voiture est la référence améliorée sur **une** caractéristique, dosée pour gagner
0,5 s en moyenne ; même niveau global pour toutes.

| Caractéristique | Formule (où elle agit) | Où elle gagne le plus | Où elle perd le plus | Verdict |
| --- | --- | --- | --- | --- |
| Appui (cla) | vitesse en virage (v² ∝ adhérence + appui) | Spa (+0,24 s) | Las Vegas (−0,15 s) | **sens réel** ; gagne 9 circuits |
| Faible traînée (cda) | lignes droites, énergie électrique | Las Vegas (+0,22 s) | Shanghai (−0,25 s) | **sens réel** ; 4 circuits |
| Adhérence mécanique | virages lents et moyens | Mexico (+0,14 s) | Monza (−0,14 s) | sens réel ; 1 circuit |
| Motricité | sorties de virage | Bakou (+0,53 s) | Suzuka (−0,27 s) | **sens réel** ; 9 circuits |
| Moteur (puissance) | accélération, vitesse de pointe | Lusail (+0,11 s) | Bakou (−0,23 s) | sens réel ; 3 circuits |
| Freinage | zones de freinage | Mexico (+0,23 s) | Lusail (−0,23 s) | sens réel ; 4 circuits (mais il faut +30 % pour 0,5 s) |
| Masse | accélération, freinage, virages | partout, un peu | — | sens réel, faible (pièces : −0,1 % par point d'efficacité du châssis) |
| Refroidissement | perte de puissance si la marge ne couvre pas la chaleur du mois et l'altitude | Mexico, Sepang, courses d'été chaudes | ailleurs, coûte de la traînée (pontons) | **sens réel, limité aux courses chaudes** ; le banc le classe à tort « futur » (registre à mettre à jour) |
| Fiabilité | probabilité d'abandon mécanique | — | — | sens réel (pas de temps au tour, c'est voulu) |
| Pneus (note de voiture) | **bonus fixe** pondéré par la dégradation du circuit | — | — | **provisoire** : pas de physique ; à remplacer en phase 13 (charge, glissement, température) |

Les 21 paires de voitures s'inversent sur au moins un circuit : **aucune caractéristique n'est dominante partout.**

**Ce qui reste à faire** :
- Inscrire le refroidissement au banc (il a un effet depuis la 12a).
- Phase 13 : la note de pneus de la voiture doit sortir de la physique ; d'ici là, elle pèse lourd (McLaren à 19 gagnait 13 circuits de
  plus qu'à 16, voir le rapport `phase-12-profils`).
- Les améliorations de pièces (projets) suivent la même physique : un concept « fort appui » gagne à Monaco et perd à Las Vegas.

## 2. Des notes de 19-20 la première année d'un règlement ?

**Ce que fait le moteur** : la note de `voitures.csv` sert **une seule fois**, à la création du monde, à fixer l'efficacité des six pièces
(10 + 0,7 × (note − 14)). Une note de 19 donne une efficacité de 13,5 ; la frontière (ce que le savoir permet) monte jusqu'à 19. Ensuite,
tout est physique et relatif : la grille gagne environ +8 à +9 points d'indice en 20 ans (≈ 2,3 s au tour), puis plafonne.

**Mon avis** : tu as raison sur le fond (en début de règlement, tout le monde est loin du plafond), et le moteur le fait déjà ; mais :
- **l'échelle affichée est trompeuse** : une voiture « 19 » en 2027 vaut « 24 » en 2045 ; une note sur 20 n'a plus de sens. Je propose
  d'afficher au joueur **l'écart au meilleur en secondes** par circuit et une **maturité du règlement** (part du potentiel atteint par la
  grille) ;
- abaisser toutes les notes de 3 points ne changerait **rien** à la hiérarchie (tout est relatif) ; cela ne ferait qu'augmenter la marge
  de progression (donc la vitesse de progression des premières années). C'est un réglage possible, pas une correction.

## 3. Équilibre : où on en est, comment éviter les cycles de domination

### Mesures (10 graines × 30 saisons)

| Objectif D-081 | Cible | 12b bis | 12c (physique recalée, coupe de réforme) |
| --- | --- | --- | --- |
| Écuries victorieuses par saison | 4–6 | 5,3 ✓ | 5,6 ✓ |
| Part des victoires de l'écurie dominante | (plus bas = mieux) | 49 % | 45 % |
| Titre ouvert avant la dernière manche | 30–50 % | 27 % ✗ | **34 % ✓** |
| Dominations (≥ 120 points d'écart) | < 5 % | 13 % ✗ | 9 % ✗ |
| Champions constructeurs différents (30 saisons) | 5–8 sur 20 saisons | 6,6 ✓ | 6,8 ✓ |
| Séries avec 5 titres consécutifs | dynasties très rares | 80 % ✗ | 60 % ✗ |
| Dernière écurie qui marque | 60–90 % | 57 % ✗ | **68 % ✓** |

Tous les indicateurs : `docs/rapports/phase-12c/rapport.md`. **Rectificatif** : les réformes faisaient déjà reculer la grille en 12b bis
(−0,97 point ; mon outil mesurait une semaine trop tôt) ; avec la coupe (12c) : −1,49 point, 84 % des écuries reculent.

### Options contre les cycles de domination (toutes déclarées et identiques pour tous, D-081 / D-169)

| Option | Mécanisme | Pertinence | Risque |
| --- | --- | --- | --- |
| 1. Réformes qui font reculer (fait, D-175) | coupe aux grandes réformes, les préparés remontent plus vite | haute (c'est le rôle historique des réformes) | si elles sont trop rares (4–6 ans), une dynastie tient entre deux |
| 2. Barème de soufflerie amplifié (α) | le dernier a plus d'heures, le champion moins | moyenne | aujourd'hui l'argent limite plus que les heures |
| 3. Heures → qualité des pièces (laissé en l'état par le porteur) | rend le barème réellement utile | haute | — |
| 4. Marché du personnel | les ingénieurs des champions sont débauchés ; usure du succès (D-140) | haute, et c'est « FM » | aujourd'hui, effet non mesuré sur les dynasties |
| 5. Savoir qui vieillit | les méthodes se périment, une avance non entretenue fond | moyenne | peut punir sans raison visible |
| 6. Mesurer d'abord | campagne qui attribue les dynasties à l'argent, au personnel, au savoir, aux pilotes | **à faire avant 2 à 5** | — |

## 4. Le plaisir de jouer : une petite écurie peut-elle progresser ?

### Mesure : Cadillac dirigée par l'IA (8 graines × 10 saisons, physique 12c)

| Saison | Place constructeurs (moyenne ; min–max) | Points | Meilleur résultat (médiane) | Saisons avec des points |
| --- | --- | --- | --- | --- |
| 2027 | 10,8 ; 10–11 | 0,9 | 11e | 3/8 |
| 2028 | 9,8 ; 9–11 | 5,3 | 9e | 6/8 |
| 2029 | 9,8 ; 7–11 | 10,5 | 9e | 6/8 |
| 2030 | 8,6 ; 6–11 | 29,9 | 7e | 7/8 |
| 2031 | 8,5 ; 6–11 | 41,0 | 4e | 8/8 |
| 2032 | 8,3 ; 3–10 | 72,0 | 3e | 8/8 |
| 2034 | 7,9 ; 2–11 | 93,0 | 4e | 8/8 |
| 2036 | 6,8 ; 3–11 | 147,5 | 2e | 7/8 |

**Lecture** : ta trajectoire (« saison 2 dans le top 15, saison 3 des points de temps en temps, saison 4 régulier, puis top 5, podium,
peut-être la victoire ») **existe déjà**, même sous l'IA, avec une forte dispersion selon les graines (de 2e à 11e en 2034). Raisons :
Cadillac a un gros budget (≈ 92 M€ de développement payés en 2027, plus que Mercédès, car ses frais fixes sont bas), les rendements
décroissants rapprochent les retardataires, le barème de soufflerie l'aide, l'ADUO aide son motoriste en retard.

**Mesures complémentaires (même méthode)** :

| Écurie (IA) | Développement payé par an | Place 2027 → 2031 → 2036 (moyenne) | Lecture |
| --- | --- | --- | --- |
| Cadillac | ≈ 85–90 M€ | 10,8 → 8,5 → 6,8 | remonte nettement |
| Audi | ≈ 80–86 M€ | 10,0 → 8,9 → 7,8 | remonte |
| **Haas** | **59 → 40 M€ (en baisse)** | 8,3 → 9,1 → **10,0** | **stagne, puis recule** |

**Problème confirmé : un piège de la pauvreté.** Une écurie pauvre (Haas) ne progresse pas en 10 saisons et son budget de développement
**baisse**. Avec elle, ta trajectoire « FM » n'est pas réalisable aujourd'hui. À corriger en priorité pour le plaisir de jouer, par des
mécanismes réels et visibles : primes et droits commerciaux qui récompensent la progression (pas seulement la place), sponsors
d'opportunité et pilotes payants (§7), contrats moteur moins chers pour les clients (§5), objectifs gradués du propriétaire. À mesurer
avant/après.

**Pourquoi Haas s'appauvrit** (graines 1 et 2, comptes annuels) : recettes stables autour de 190 M€ (primes 55–77, droits commerciaux ≈ 40,
sponsors 17–40, apport du propriétaire 55–65 M€, contre 130–180 M€ pour Cadillac) ; les **primes baissent** quand elle recule (77 → 55 M€) ;
les **salaires des pilotes** (hors plafond) montent de 21 à 40 M€ ; le propriétaire **prélève des dividendes** (3 à 14 M€ par an) même quand
le développement baisse. Le développement est ce qui reste : 48–53 M€ en 2027, 21–35 M€ ensuite. C'est un cercle vicieux réaliste
(classement → primes → développement → classement), **sans porte de sortie** aujourd'hui.

Portes de sortie possibles (réelles, visibles, mêmes règles pour tous ; décision du porteur) :
1. Un propriétaire qui suspend ses dividendes quand l'écurie décline (selon sa personnalité : patient ou rentier).
2. Des pilotes payants et des sponsors d'opportunité (§7) qui ciblent justement les écuries en difficulté.
3. Des contrats moteur moins chers pour les clients modestes (§5).
4. Des objectifs gradués du propriétaire, avec un bonus d'apport quand l'écurie progresse.
5. Une répartition des primes un peu plus resserrée (choix réglementaire déclaré, D-169).

**Le joueur peut faire mieux que l'IA** : Cadillac sur 4 saisons (8 graines), soufflerie entièrement sur la voiture : place moyenne 8,81
contre 9,75 sous l'IA (gain d'indice 6,5 contre 5,8). Les choix comptent ; ce n'est pas trivial (une place en 4 saisons).

### L'IA fait-elle des erreurs ? Oui, et elles sont honnêtes (elle n'a pas la vérité)

- Elle estime ses pièces avec un bruit (selon la compétence, la fatigue, les heures de soufflerie) : elle peut monter une pièce moins bonne.
- L'exécution d'un projet est incertaine : une nouvelle version peut être pire.
- Elle parie sur une architecture aux réformes, avec une perception bruitée : elle peut se tromper pour tout un règlement.
- Elle choisit ses programmes de recherche avec un jugement imparfait (force perçue bruitée, philosophie de l'écurie).
- Elle peut épuiser ses équipes (fatigue, incidents, défauts cachés) et dépasser volontairement le plafond (amende, sanction).

**Limites** : l'IA reste à ± 0,25 de son concept actuel (prudente) et ne choisit jamais d'architecture explicitement (seulement « la
meilleure en apparence »). Le joueur, lui, peut tout choisir : il peut donc faire mieux… ou pire.

### Difficulté : absente aujourd'hui. Proposition (déclarée, jamais cachée)

| Niveau | Leviers (visibles, annoncés au départ) |
| --- | --- |
| Facile | plus de patience du conseil et du propriétaire ; estimations plus précises pour le joueur (brouillard réduit, D-013) |
| Normal | règles actuelles |
| Difficile | conseil impatient ; brouillard plus épais pour le joueur ; l'IA estime mieux (bruit d'estimation réduit, annoncé) |

Pas de bonus caché pour l'IA (CLAUDE.md) : chaque levier est affiché dans l'écran de choix de la difficulté. **Décision du porteur.**

### Ce qui rendrait la remontée « FM » (possible, pas facile)

1. **Des objectifs gradués du conseil** (top 10, points, top 7…) qui récompensent la progression, avec de l'argent du propriétaire.
2. **Le recrutement comme levier** : débaucher un bon directeur technique (existe, aux mêmes règles pour l'IA), le rendre visible et lisible.
3. **Les paris techniques** (architecture, concept extrême) : risqués, mais seule vraie voie pour sauter des places.
4. **Les pilotes payants et les sponsors d'opportunité** (§7) : de l'argent contre de la performance pilote.
5. **Le moteur** (§5) : un meilleur contrat moteur est le levier le plus fort d'une petite écurie.

## 5. Les moteurs des écuries clientes

**Aujourd'hui** :
- motoriste fixé par `ecuries.csv` (Mercédès → McLaren, Alpine, Williams ; Ferrary → Haass, Cadillac ; Red Bul Forde → Red Bull, Racing Bulls) ;
- puissance = niveau du motoriste seulement : **client = usine** (D-114) ;
- **aucun contrat, aucun coût de fourniture, aucun changement possible**, aucune entrée ni sortie de motoriste ;
- le niveau évolue chaque intersaison (progression + aléa + ADUO).

**Proposition — contrats moteur** (inspiration : vraies règles F1 ; je ne peux pas vérifier précisément comment F1 Manager le fait) :
- un contrat de fourniture de 3 à 5 ans, aligné sur les cycles de règlement moteur, avec un prix annuel (hors plafond, comme en F1 réelle
  — à vérifier) ;
- **fenêtre de choix** un an avant la fin du contrat : les motoristes font des offres (prix, durée, statut « équipe partenaire » avec
  priorité d'information), selon l'attrait de l'écurie et leur nombre de clients (au plus 3–4 écuries par motoriste) ;
- **avantage d'usine léger et réel** : intégration du moteur au châssis (refroidissement, masse) meilleure pour l'usine et l'équipe
  partenaire ; le client a la même puissance mais une intégration moins bonne (petit coût physique, D-114 à nuancer : remise en cause à
  signaler) ;
- même commande pour l'IA et le joueur ; un changement de motoriste coûte une adaptation (une saison de pièces moins bien intégrées).

**Pertinence** : très forte. C'est un vrai choix stratégique à long terme, lisible, et le levier le plus réaliste d'une petite écurie.

## 6. Un nouveau motoriste qui bouscule le jeu (événement scénarisé)

**Faisabilité** : moyenne. Il n'existe pas de système d'événements scénarisés ; il faudrait :
- des motoristes avec une date d'entrée et un niveau de départ incertain (un nouveau motoriste est en retard au début, l'ADUO l'aide) ;
- un **événement de monde** (pas réservé au joueur) : vers 2030–2031, un constructeur fictif crédible (par exemple un grand groupe
  automobile asiatique ou un constructeur sportif européen, avec un nom inventé) annonce son arrivée pour la réforme moteur suivante et
  cherche une écurie partenaire ; il fait des offres (argent, statut d'usine, moteur gratuit) aux écuries qu'il juge prometteuses ou
  bon marché (McLaren, Cadillac, Alpine, ou d'autres selon le monde) ;
- un dilemme pour l'écurie qui reçoit l'offre (joueur ou IA, mêmes règles) : rester client d'un motoriste éprouvé ou devenir l'usine d'un
  nouveau venu (pari : argent et priorité contre fiabilité et retard probable).

**Pertinence** : forte pour l'histoire et la rejouabilité, **à condition** que l'événement soit tiré dans le monde (date et cibles
variables selon la graine), jamais un cadeau garanti au joueur. Prérequis : les contrats moteur (§5).

## 7. Pilote payant avec un vrai dilemme

**Existant** : sponsors personnels et pilotes payants (phase 7c) agissent dans le marché (un pilote apporte de l'argent, le score de
recrutement le prend en compte), mais **rien n'arrive au joueur sous forme d'offre**, et aucune clause n'oblige à garder un pilote.

**Proposition** : « offre de pilote soutenu » quand une écurie est en difficulté financière (trésorerie basse, sponsor principal absent) :
- un pilote moyen (niveau 11–13) soutenu par un grand groupe national fictif : chèque d'entrée + sponsor principal pour 5 ans ;
- **clauses nouvelles** : titularisation garantie pendant X années, statut de pilote n°1 (existe déjà), pénalité de rupture élevée ;
- dilemme bloquant pour le joueur (D-168), décision immédiate pour l'IA (même règle : accepte si la trésorerie l'exige) ;
- conséquences : le coéquipier et le personnel réagissent (mémoire, promesses), la presse aussi (phase 11).

**Faisabilité** : bonne (sponsors, clauses, décisions bloquantes, mémoire existent). **Pertinence** : très forte (dilemme FM classique, vrai
coût sportif contre survie financière).

## 8. Relecture complète

### Bugs réels trouvés et corrigés cette nuit

| Bug | Effet | Correction |
| --- | --- | --- |
| Pièce en fabrication pendant une réforme | arrivait avec l'efficacité d'avant la réforme (ni coupe ni perte) | la pièce subit la même variation que la pièce montée |
| Effort budgétaire extrapolé d'une période | facteur de développement qui sautait de 0,3 à 1,3 selon les paiements de projets | lissé sur l'année écoulée |
| « Titre ouvert » départagé aux podiums | indicateur et chronique pouvaient se tromper à égalité | même départage que le classement (2es places…) |
| Rang du barème de soufflerie aux seuls points | heures fausses en cas d'égalité | ordre officiel du classement |
| Matériau fragile qui efface un autre défaut | défaut de performance perdu | un défaut existant est gardé |
| **Mon outil de tendance** mesurait avant la semaine 1 | l'effet d'une réforme était compté l'année suivante | corrigé, mesures refaites (§3 bis) |

### Incohérences à traiter (non corrigées, à décider)

- **Attributs lus par aucune formule** (règle CLAUDE.md) : culture de l'écurie, titres pilotes de l'écurie, « niveau voiture » d'origine
  (encore affiché dans le diagnostic alors qu'il est figé depuis la 12a), type d'organisation, responsable de département (jamais mis à
  jour), écarts en tête de saison. À supprimer ou à brancher.
- **Nombres en dur** hors de `balance/` : nombreux (événements de conception, dilemmes, économie, humain). Chantier de nettoyage.
- **Décisions de l'IA face aux alertes** : un « ralentir » choisi par l'IA est annulé la semaine suivante par sa propre règle de rythme.
- **Documentation en retard** : feuille de route (11b, 11c, 12a, 12b non marquées livrées), fiches de la phase 12 « pas encore codée »,
  glossaire (caractéristiques de voiture, indice, reconception, restriction aéro décrits à l'ancienne ; une vingtaine de termes de la phase
  12 absents).

### Où en est-on par rapport à l'objectif de base (GAME_DESIGN) ?

| Pilier | État |
| --- | --- |
| Monde vivant, mémoire, personnages, groupes | **fort** (phases 4 à 9) |
| Économie, plafond, sponsors, crises | **fort** |
| Carrières, juniors, marché, agents | **fort** |
| Règlements, recherche, politique | **fort** |
| Voitures crédibles, compromis, circuits réels | **en cours, sur de bonnes bases** (12a–12c) |
| Compétitivité D-081 | **partielle** (mobilité oui, dynasties et dominations trop fréquentes) |
| Le joueur : leviers, lisibilité, plaisir | **le point faible** : beaucoup de systèmes, peu de leviers visibles et d'objectifs gradués ; difficulté absente |
| Course (stratégie, pneus, pluie, dépassements) | **pas commencé** (phase 13) |

**Cohérence générale** : le moteur est cohérent et testé (541 tests, pureté, déterminisme). Le risque principal n'est plus technique : c'est
que la richesse des systèmes ne se voie pas assez du côté du joueur. Je recommande que chaque phase à venir ajoute au moins un levier
visible et un objectif lisible pour le joueur.
