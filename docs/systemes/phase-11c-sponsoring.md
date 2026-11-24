# Refonte du sponsoring (proposée en « phase 11c »)

> Statut : **À VALIDER** par le porteur (étape 2 du processus de CLAUDE.md). Aucun code avant validation.
> Fiche d'intention : message du porteur du 24/11/2026 (« F1 Manager mobile — refonte du système de sponsoring »).
> Rédigée par Claude Code après audit de l'existant. Aucun rééquilibrage sportif ; les dynasties attendent la fin de la phase 12.

## 1. Ce qui existe (audit)

| Élément | État actuel | Conséquence pour la refonte |
| --- | --- | --- |
| Emplacements | 1 titre, 3 principaux, 6 secondaires (`EMPLACEMENTS_SPONSORS`) | Conservés |
| Rang d'un contrat | Déduit du **montant** (titre ≥ 30 M€, principal ≥ 8 M€) | Conservé : la puissance commerciale reste liée à l'attrait de l'écurie |
| Contrat | Montant annuel fixe, une prime si un rang constructeurs est atteint (≈ 20 % du fixe), satisfaction, clause de sortie, rancune, renouvellement | **Réutilisé** et enrichi (pas de second système) |
| Budget d'un sponsor | Un sponsor n'a qu'un contrat à la fois (`sponsorsEngages`) | Règle « pas deux fois le même budget » déjà tenue ; à étendre aux primes |
| Choix des contrats | **Entièrement automatique pour toutes les écuries, y compris le joueur** (phase 10 : « administration de l'écurie ») | Le joueur doit pouvoir **choisir** entre des offres : écran et commande nouveaux |
| Image publique (phase 11) | Lue par l'attrait ; les scandales déçoivent les sponsors sensibles | Réutilisée |
| Fatigue des pilotes | **N'existe pas.** Le stress est calculé mais lu par aucune formule de course. La jauge d'énergie est prévue en **phase 13** | Voir §6 : pas de fatigue inventée maintenant |
| Résultats des Grands Prix | Positions et points de chaque pilote (modèle abstrait) | Suffisent pour juger les objectifs de course |

## 2. Principe économique : des variantes de même valeur attendue… pour le sponsor

Un sponsor propose plusieurs variantes de contrat (prudente, équilibrée, audacieuse). Il les chiffre d'après **ce qu'il sait publiquement de l'écurie** : son rang attendu, qui découle de ses résultats récents et de son attrait.

- Valeur attendue d'une variante, pour le sponsor = fixe + Σ (prime × probabilité estimée par le sponsor).
- Les trois variantes ont **la même valeur attendue**, à une marge de risque près : l'audacieuse vaut un peu moins (par exemple 90 %), car le sponsor fait payer l'incertitude.
- Conséquences :
  - **le contrat prudent reste intéressant** : il rapporte autant en moyenne, sans risque ;
  - **l'audacieux ne gagne que si l'écurie fait mieux que ce que le sponsor croit**. C'est exactement le pari voulu : le joueur sait, par exemple, que sa voiture va progresser grâce à la recherche ;
  - **aucune stratégie universelle** : choisir toujours l'audacieux fait perdre de l'argent en moyenne, si l'écurie ne dépasse pas les attentes.
- **Pas d'argent en plus** : la valeur attendue totale reste le montant que l'écurie obtient aujourd'hui. Les primes **remplacent** une partie du fixe ; elles ne s'y ajoutent pas.
- **Plafond** : un sponsor n'engage jamais plus que ses moyens. Le montant maximal à payer (fixe, plus toutes les primes, plus une éventuelle opération) reste inférieur ou égal au budget qu'il consacre à la F1.
- **Engagement ferme** : un sponsor incapable de payer une grosse prime ne la propose pas (scénario 6).
- **Primes fixées au contrat** : elles ne diminuent jamais après coup.

## 3. Sponsor titre : un objectif par Grand Prix

- Une part du contrat titre (par exemple 20 %, à calibrer) devient une **enveloppe de primes de course**. Elle est répartie sur les Grands Prix de la saison.
- **Avant chaque Grand Prix**, le sponsor propose 3 objectifs, plus « aucun objectif ». Ils sont **calculés pour cette écurie, sur ce circuit** :
  - en partant du rang attendu de l'écurie sur ce type de circuit (niveau de la voiture, compétences des pilotes, exigences du circuit : la même information que celle des écuries de l'IA) ;
  - **prudent** : atteignable dans la plupart des cas (par exemple, meilleur pilote dans le top N) ;
  - **intermédiaire** : à peu près une chance sur deux ;
  - **audacieux** : rare (points, podium, victoire selon le niveau de l'écurie) ;
  - prime = part de l'enveloppe ÷ probabilité estimée par le sponsor, moins sa marge. Toutes les primes ont donc la même valeur attendue pour lui.
- **Jugement** : sur les **résultats réellement simulés**, sans tirage après la course. L'objectif porte sur le meilleur des deux pilotes, sauf mention contraire.
- **Estimation affichée au joueur** :
  - le directeur sportif donne une fourchette (par exemple « environ 40 à 60 % ») ;
  - sa précision dépend de sa compétence **stratégie**, l'une des 6 compétences encore sans effet propre : ce serait sa première utilisation ;
  - jamais la vraie probabilité interne.
- **Sans choix du joueur avant la course**, le directeur commercial choisit avec les règles de l'IA (selon le goût du risque du team principal). Il n'y a **ni arrêt ni alerte** : le jeu reste fluide sur mobile.

## 4. Contrats titre et principaux : choisir entre sécurité et risque

- **Quand un emplacement titre ou principal se libère** (fin de contrat, rupture), le joueur reçoit 2 à 3 offres de sponsors différents, chacune déclinée en variantes. Il choisit (commande `sponsor.signer`) ou laisse faire son équipe.
- **Clauses annuelles des sponsors principaux** : variées, selon le profil du sponsor (image recherchée : résultats, prestige, popularité, nationalité) :
  - rang constructeurs, total de points ;
  - au moins un podium, au moins une victoire ;
  - arrivées dans les points ;
  - progression de N places ;
  - objectif lié à un pilote (sponsor national ou personnel).
- **Clauses extraordinaires** (une victoire pour une écurie de fond de grille) : seulement chez un sponsor qui en a les moyens et une raison crédible (image « popularité » ou « résultats », budget important).
- **Satisfaction** :
  - mécanisme existant conservé ;
  - une clause audacieuse ratée déçoit **moins** qu'une clause prudente ratée (la déception est proportionnelle à la probabilité que le sponsor lui accordait) ;
  - objectifs atteints : meilleure chance de renouvellement.
- **Sponsors secondaires** : comme aujourd'hui, entièrement automatiques, fixe seul.

## 5. Opérations publicitaires exceptionnelles (sponsors principaux)

- **Déclenchement** : après un **exploit mesuré par rapport au rang attendu**, sur des résultats réellement simulés :
  - podium d'une écurie attendue au-delà de la 9e place ;
  - victoire d'une écurie attendue au-delà de la 4e place ;
  - record battu (phase 11) ;
  - victoire surprise (le fait existe déjà).
  - Une victoire attendue n'est **jamais** un exploit.
- **Rareté** :
  - au plus une proposition par écurie et par saison ;
  - une seule par contrat de sponsor ;
  - aucune si la précédente date de moins de 26 semaines.
- **Proposition** :
  - un des sponsors principaux propose une opération pour le Grand Prix suivant ;
  - montant selon son budget et l'ampleur de l'exploit (par exemple 2 à 10 % de son budget F1) ;
  - **4 formats**, de la contrepartie la plus légère à la plus lourde : tenues spéciales (aucune contrainte), visibilité sur la voiture (**peut déplaire au sponsor titre**, clause d'exclusivité), interview exclusive, campagne complète.
- **Pilote demandé**, affiché **avant** acceptation : au choix du joueur, le plus populaire, l'auteur de l'exploit, ou le pilote n°1. Si ce pilote n'est plus dans l'écurie, l'offre tombe.
- Le joueur peut **refuser**. Une offre délaissée expire au Grand Prix suivant.

## 6. Conséquences pour le pilote (sans fatigue inventée)

- **Maintenant** (systèmes existants), selon la personnalité du pilote, jamais au hasard :
  - **exposition médiatique** et **image** en hausse (phase 11) ;
  - **souvenir** : se sentir mis en valeur (« reconnaissance »), surtout pour un pilote en quête de reconnaissance ; ou contrarié par une sollicitation lourde (« conflit » léger), surtout pour un pilote discret ou très professionnel, et d'autant plus si le team principal accepte souvent des campagnes lourdes ;
  - **satisfaction** du sponsor qui finance ;
  - **mécontentement du sponsor titre** en cas de visibilité qui empiète sur son emplacement.
- **La fatigue sportive : en phase 13.** Chaque opération crée un fait daté (« sollicitation » légère, moyenne ou lourde) attaché au pilote. Quand la jauge d'énergie existera, elle lira ces faits de la semaine avant le Grand Prix. **Aucun attribut lu par personne** n'est ajouté maintenant (règle de CLAUDE.md), et aucun malus de vitesse.

## 7. Délégation, commandes, écrans

- **Nouveau domaine délégable** : `commercial`.
  - délégué : l'équipe choisit les contrats, les objectifs de course et les opérations, avec les règles de l'IA ;
  - non délégué : le joueur décide ; sans réponse, l'équipe tranche à l'échéance.
- **Commandes communes au joueur et à l'IA** :
  - `sponsor.signer` (offre et variante) ;
  - `sponsor.objectif_gp` (objectif choisi, ou aucun) ;
  - `sponsor.operation` (accepter ou refuser, et pilote si l'offre est libre).
- **Écran Finances → Sponsors** :
  - les contrats en cours (fixe, primes, objectifs, satisfaction) ;
  - les offres en attente ;
  - l'objectif du prochain Grand Prix (3 cartes, fourchette du directeur sportif).
- **Décision en attente** : seulement pour une offre de contrat et une opération exceptionnelle. L'objectif de course n'en est pas une, par choix de fluidité.

## 8. Modèle et sauvegarde

- **`ContratSponsoring` enrichi** :
  - `variante` (prudente, équilibrée, audacieuse) ;
  - `clauses` : liste de { type, seuil, prime, probabilité estimée par le sponsor à la signature } ;
  - `enveloppeGP` (titre) ;
  - `primesVersees`.
- **Nouvelles tables** :
  - `offresSponsors` : bornées, effacées en fin de saison ;
  - `objectifsGP` : un par écurie et par Grand Prix, effacé après le jugement ;
  - `operations` : bornées.
- **Format de sauvegarde 28**, avec migration : les contrats existants deviennent des contrats « prudents » à une seule clause, celle d'aujourd'hui.

## 9. Tests et mesures prévus (indicatifs, D-120)

- Les 9 scénarios du porteur :
  - petite écurie avec contrats prudents, puis avec contrats audacieux ;
  - podium inattendu ;
  - tous les objectifs ambitieux ratés ;
  - grande écurie dominante ;
  - sponsor trop petit pour une grosse prime ;
  - toutes les opérations acceptées, puis toutes refusées ;
  - IA.
- **Comparaison avant/après sur les mêmes graines** :
  - revenus fixes et variables, par catégorie d'écurie ;
  - variabilité d'une saison à l'autre ;
  - ruptures, satisfaction ;
  - rapport entre l'écurie la mieux dotée et la moins dotée.
- **Contrôle « pas d'argent gratuit »** : la valeur attendue des contrats, calculée avec l'estimation du sponsor, ne doit pas dépasser l'actuelle.
- **Contrôle « pas de stratégie universelle »** : sur 20 graines, une écurie qui choisit toujours l'audacieux sans progresser gagne moins en moyenne que l'option prudente.
- **Aucun coefficient sportif touché.**

## 10. Questions pour le porteur

1. **Fatigue** : pas de fatigue sportive avant la phase 13 ; les opérations laissent un fait de « sollicitation » que la jauge d'énergie lira plus tard, et ont dès maintenant leurs effets humains et commerciaux. *Recommandé.*
2. **Équilibre des variantes** : même valeur attendue pour le sponsor, l'audacieuse étant décotée d'environ 10 % (prix du risque). Le pari ne rapporte que si l'écurie dépasse ce que le marché attend d'elle. *Recommandé.*
3. **Part variable du sponsor titre** : environ 20 % de son contrat devient l'enveloppe des primes de course. *Valeur provisoire, à calibrer.*
4. **Objectif de course sans choix du joueur** : le directeur commercial choisit, sans arrêt ni alerte. *Recommandé (fluidité sur mobile).*
5. **Estimation par le directeur sportif**, plus ou moins précise selon sa compétence « stratégie » (première utilisation de cette compétence). *Recommandé.*
6. **Rareté des opérations** : au plus 1 par écurie et par saison, et 1 par contrat de sponsor. *Recommandé.*
7. **Domaine `commercial`** : délégué ou non au départ d'une partie ? *Recommandation : non délégué pour les contrats (c'est le cœur de la refonte), avec repli automatique à l'échéance.*
8. **Place dans la feuille de route** : en « phase 11c », maintenant, avant la phase 11b (circuits) qui demande ta collecte de données ? *Recommandé.*
