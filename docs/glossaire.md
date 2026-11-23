# Glossaire

Un mot = un sens, pour le porteur du projet, ChatGPT et Claude Code. Tout terme nouveau est ajouté ici avant d'être utilisé dans le code. Entre parenthèses : le nom utilisé dans le code (anglais) quand il diffère.

## Monde et organisation

| Terme | Définition |
| --- | --- |
| **Monde** (`World`) | L'état complet d'une partie à un instant donné : date, graine, toutes les entités. |
| **Entité** | Tout objet du monde qui possède un identifiant unique : personne, écurie, contrat, événement… |
| **Identifiant** (`id`) | Code unique et permanent d'une entité, préfixé par son type (`per_000412`, `org_0007`). Jamais réutilisé. |
| **Organisation** (`Org`) | Entité collective : écurie, motoriste, fournisseur, instance dirigeante, média, propriétaire, agence d'agents. |
| **Écurie** (`Team`) | Organisation qui engage des voitures dans le championnat. |
| **Instance dirigeante** (`Governing body`) | Organisation fictive qui fixe le règlement et organise les votes. |
| **Propriétaire** (`Owner`) | Personne ou organisation qui possède une écurie. Fixe les grandes orientations et le budget. |
| **Conseil** (`Board`) | Représente le propriétaire auprès du team principal. Juge ses résultats et peut le licencier. |
| **Département** (`Department`) | Groupe d'employés non individualisés (ex. : mécaniciens, production), décrit par son effectif, son niveau moyen et sa cohésion. |
| **Poste** (`Role`) | Fonction occupée dans une organisation (directeur technique, pilote titulaire…). Une personne n'est pas un poste. |
| **Poste individualisé** | Poste occupé par un personnage complet. 9 par écurie au départ (D-009). |
| **Installation** (`Facility`) | Équipement d'une écurie (soufflerie, simulateur…), décrit par son niveau, son âge, son état et sa capacité. |
| **Règlement** (`Rules`) | Ensemble des règles sportives, techniques et financières d'une saison. |
| **Plafond budgétaire** (`Cost cap`) | Limite des dépenses autorisées par saison, fixée par le règlement. |

## Personnages

| Terme | Définition |
| --- | --- |
| **Personne / personnage** (`Person`) | Individu du monde : pilote, ingénieur, dirigeant, agent… Le joueur est aussi une personne. |
| **Personnalité** (`Personality`) | Traits stables qui décrivent la manière d'être. Cachés. Évoluent très peu. |
| **Trait** | Une dimension de la personnalité (ex. : rancune), notée de 1 à 20. |
| **Valeurs** (`Values`) | Ce qui compte pour la personne (argent, fidélité, victoire…). Pondèrent ses décisions. |
| **Conviction** | Une valeur assez forte pour faire agir la personne contre son intérêt immédiat (ligne rouge). |
| **Compétences** (`Skills`) | Savoir-faire propres à un métier, notés de 1 à 20. |
| **Potentiel** | Niveau maximal qu'une compétence peut atteindre. Caché. |
| **Aspiration** | Objectif personnel à moyen ou long terme (devenir champion, diriger une écurie…). |
| **État émotionnel** (`Mood`) | Moral, stress, motivation, confiance en soi. Recalculé en permanence, jamais saisi directement. |
| **Agent** | Personne qui représente des pilotes dans leurs négociations, avec sa propre personnalité et sa propre mémoire. |
| **Connaissance incertaine** | Ce que le joueur (ou une IA) sait d'une personne : une fourchette qui se précise avec le recrutement et le temps passé ensemble. |

## Mémoire et relations

| Terme | Définition |
| --- | --- |
| **Événement** (`Event`) | Fait daté et objectif, inscrit au journal : type, acteurs, contexte, visibilité, importance, causes. |
| **Journal des événements** (`Event log`) | Registre de tous les événements, dans l'ordre. Les faits mineurs anciens sont résumés puis supprimés. |
| **Cause** | Lien d'un événement vers les événements ou décisions qui l'ont provoqué. Base du « Pourquoi ? ». |
| **Chaîne de causes** | Suite d'événements reliés par leurs causes. Sa longueur mesure la profondeur des conséquences. |
| **Visibilité** | Public (tout le monde le sait), privé (participants et proches), confidentiel (participants seulement). |
| **Souvenir** (`Memory`) | Ce qu'UNE personne retient d'un événement : cible, ressenti (de −1 à +1), intensité, étiquette. |
| **Étiquette de souvenir** (`Memory tag`) | Catégorie du vécu : promesse rompue, soutien, humiliation, reconnaissance, trahison… |
| **Grille de lecture** (`Appraisal`) | Fonction qui transforme un événement en souvenir selon la personnalité, les valeurs, la relation et ce que la personne sait. |
| **Oubli** (`Decay`) | Baisse progressive de l'intensité d'un souvenir. Sa vitesse dépend du trait « rancune ». |
| **Renforcement** | Hausse de l'intensité d'un souvenir quand un événement similaire se produit avec la même cible. |
| **Mémoire résiduelle / résidu** | Part d'un souvenir effacé qui est versée durablement dans la relation. |
| **Relation** (`Relationship`) | Lien orienté de A vers B, sur 4 axes : confiance, respect, affinité, familiarité. Pas forcément réciproque. |
| **Base de relation** | Partie durable d'une relation, nourrie par les résidus. Bouge lentement. |
| **Promesse** (`Promise`) | Engagement vérifiable par le moteur, avec une échéance. Produit un événement « tenue » ou « rompue ». |
| **Réputation** | Image publique d'un acteur, par facette (formateur, fidèle, impitoyable…), calculée à partir des faits publics. Voir aussi **réputation perçue**. |
| **Groupe social** | Ensemble de personnes liées par des relations fortes et une expérience commune, détecté automatiquement. Jamais prédéfini. |
| **Influence** | Capacité d'une personne à entraîner les autres. Dépend du respect qu'on lui porte et de sa place dans les groupes. |
| **Chronique** | Archive permanente des faits majeurs (titres, transferts marquants, crises). Ne s'efface jamais. |

## Simulation

| Terme | Définition |
| --- | --- |
| **Moteur** (`Engine`) | Code qui fait évoluer le monde. Ne connaît pas l'interface. |
| **Pas de temps** (`Tick`) | Une itération de la boucle de simulation. Proposition : 1 semaine (D-028). |
| **Système** (`System`) | Module du moteur responsable d'un domaine (finances, mémoire, marché…), exécuté dans un ordre fixe à chaque pas. |
| **Commande** (`Command`) | Action demandée par le joueur ou par l'IA (proposer un contrat, licencier…). Validée par les mêmes règles pour tous. |
| **Graine** (`Seed`) | Nombre qui initialise le hasard. Même graine + mêmes commandes = même histoire. |
| **Flux de hasard** (`RNG stream`) | Suite de tirages propre à un système. Évite qu'une décision bouleverse le hasard des autres systèmes. |
| **Utilité** | Score qu'une personne ou une IA donne à chaque option pour choisir. Garde ses raisons principales. |
| **Mode observateur** | Simulation sans joueur. |
| **Simulation historique** | Simulation préalable, de durée configurable, qui crée le passé du monde avant le début de la partie. |
| **Modèle de résultat abstrait** | Calcul du classement d'un Grand Prix sans course visible : performance + pilote + fiabilité + aléa. |
| **Indice de performance** | Note globale de la voiture d'une écurie pour un type de circuit, en attendant le développement détaillé des monoplaces. |
| **Équilibrage** (`Balance`) | Réglage des coefficients. Tous sont rangés dans un seul dossier. |
| **Résultat cible** | Fourchette chiffrée qu'un indicateur doit respecter pour que le monde soit crédible (ex. : 4 à 8 champions sur 20 saisons). |
| **Test contrefactuel** | Deux copies d'une partie qui ne diffèrent que par une décision, simulées puis comparées. |
| **Choix cosmétique** | Décision dont l'effet mesuré ne dépasse pas le bruit naturel. À retravailler. |
| **Option dominante** | Option d'un dilemme qui gagne dans plus de 80 % des contextes. À rééquilibrer. |
| **Audit des attributs** | Vérification que chaque attribut est lu par au moins une formule et a un effet mesurable. |
| **Diagnostic** | Interface de consultation du monde (entités, relations, souvenirs, raisons des décisions), destinée à l'équipe de conception. |
| **Bac à sable** | Outil pour déclencher à la main une interaction (négociation, promesse…) et observer la réaction. |
| **Migration** | Conversion d'une ancienne sauvegarde au format actuel. |

## Données initiales

| Terme | Définition |
| --- | --- |
| **Jeu de données initial** | Ensemble des fichiers CSV qui décrivent le monde au départ de la partie (écuries, personnes, contrats, carrières, palmarès). Entièrement modifiable. |
| **Grille 2026** | Jeu de données initial inspiré de la grille réelle de F1 2026, avec des noms altérés (D-042). |
| **Nom altéré** | Nom réel modifié d'une seule lettre, en gardant si possible la prononciation (Ferrari → Ferrary). |
| **Histoire ancrée** | Préparation du passé où les faits viennent des données, et seule la couche humaine (souvenirs, relations) est simulée. Elle ne modifie pas la grille de départ. |
| **Simulation historique libre** | Préparation du passé où tout est simulé. Réservée aux mondes entièrement fictifs. |

## Saison et performance (phase 3)

| Terme | Définition |
| --- | --- |
| **Caractéristiques de la voiture** | Virages lents, virages rapides, vitesse de pointe, efficacité aérodynamique, motorisation (celle du motoriste), fiabilité, gestion des pneus (D-056). |
| **Profil de circuit** | Poids de chaque caractéristique de vitesse selon le type de circuit. |
| **Indice voiture (sur un circuit)** | Moyenne pondérée des caractéristiques selon le profil du circuit. |
| **Retard de la voiture** | Écart, en % du temps au tour, entre une voiture et la meilleure voiture du circuit. |
| **Victoire inattendue** | Victoire avec une voiture en retard d'au moins 0,4 % sur la meilleure. |
| **Tirage local** | Tirage au hasard déterminé seulement par la graine et une clé (système, date, entité) ; indépendant des autres tirages (D-057). |
| **Élagage des causes** | Au-delà de 10 saisons, les liens vers des causes mineures sont remplacés par un résumé (D-058). |
| **Capacité de développement** | Aptitude d'une écurie à améliorer sa voiture : personnel technique, installations, budget. |
| **Rendements décroissants** | Plus une caractéristique est proche du plafond technique, plus elle progresse lentement. |
| **Dynastie** | Série d'au moins 5 titres constructeurs consécutifs. |

## Contrats et relations (phase 4)

| Terme | Définition |
| --- | --- |
| **Valeur de marché** | Salaire annuel qu'une personne peut espérer : niveau métier, âge et courbe du métier, potentiel restant, palmarès. |
| **Utilité d'une offre** | Score d'une offre pour la personne : ses valeurs, ses relations (seul canal des souvenirs), ses aspirations, les promesses (pondérées par leur crédibilité). |
| **Conviction forte** | Valeur ≥ 17 : pèse double dans les décisions (D-052). |
| **Ligne rouge** | Valeur ≥ 19 chez une personne qui se remet peu en question, attachée à une situation concrète (D-067). Refus ou acceptation absolus. |
| **Prime de continuité** | Valeur attribuée par une écurie au fait de garder quelqu'un qui connaît ses méthodes. |
| **Remplacement provisoire** | Recrutement dans le réservoir des personnes libres, en tours d'offres simultanées, en attendant le marché de la phase 7 (D-066). |
| **Saturation** | Un même geste répété à moins de 12 semaines d'intervalle compte beaucoup moins (D-070). |
| **Réconciliation** | Excuses, reconnaissance d'une erreur, discussion privée : réduisent les souvenirs négatifs, freinées par la rancune. |
| **Écurie pilotée** | Écurie dont le joueur prend les décisions de personnel dans le bac à sable. |
| **Score de réussite** | 40 % sport, 25 % personnel, 20 % finances, 15 % confiance et réputation (D-069). |
| **Effort technique** | Total des dépenses plafonnées prévues d'une écurie sur l'année (personnel, installations, opérations, développement), rapporté à une référence : il règle la vitesse de développement de la voiture (D-084). |
| **Restriction aérodynamique** | Efficacité du développement aéro selon le classement de l'an passé : 75 % pour le premier, 115 % pour le dernier. Réduite en cas de sanction pour dépassement du plafond. |
| **Dividendes** | Part de la trésorerie excédentaire retirée chaque année par le propriétaire (D-085). |
| **Étage** | Groupe de rangs au classement constructeurs (1–4, 5–8, 9 et plus) servant à mesurer la mobilité de la hiérarchie (D-088). |
| **Rang attendu** | Rang des moyens financiers d'une écurie parmi toutes ; le conseil compare les résultats à ce rang pour juger le team principal. |
| **Valeur commerciale** | Ce qu'un personnage rapporte commercialement (sponsors, marchés), distinct de ses compétences ; dynamique. Prévue en phase 7 (D-096). |
| **Pilote payant** | Pilote dont l'accès au baquet est en partie financé par ses sponsors ou ses soutiens (D-097). |
| **Profil de carrière** | Paramètres cachés propres à une personne (archétype, âges de progression, d'apogée et de déclin) qui façonnent sa courbe de carrière (phase 6a, à valider). |
| **Potentiel estimé** | Fourchette que se fait une écurie du potentiel caché d'une personne, plus ou moins juste selon le temps d'observation et son département recrutement (phase 6a, à valider). |
| **Affinité (circuit)** | Préférence individuelle d'un pilote pour un circuit (appréciée, neutre, redoutée), évolutive ; modifie sa performance effective (D-103, phase 13). |
| **Forme du jour** | Écart ponctuel, cohérent sur un week-end, entre la performance d'un pilote et son niveau habituel (D-103, phase 13). |
| **Forme à moyen terme** | Série de réussite ou de méforme sur plusieurs semaines, lue dans l'état émotionnel (confiance, motivation) (D-103, phase 13). |
| **Budget de variance** | Répartition de l'écart total entre performance attendue et réelle entre des sources explicables (affinité, forme, stratégie, incidents) et un aléa résiduel (D-103). |
| **Veille technologique** | Observation légale des voitures et des performances adverses pour en comprendre les concepts, jamais pour en obtenir les plans (D-109). |
| **Délégation** | Confier un domaine (recherche, fabrication, stocks, recrutement…) au personnel ; la qualité dépend de ses compétences (D-109). |
| **Frontière de compromis** | Ensemble des combinaisons techniques possibles pour une écurie sous un règlement donné ; le concept est le point choisi sur cette frontière, le développement la repousse (D-114, proposition pour la phase 12). |
| **Air perturbé / aspiration** | En virage, perte d'appui derrière une autre voiture (air perturbé) ; en ligne droite, réduction de traînée en la suivant (aspiration). Deux phénomènes distincts (D-114). |
| **Fenêtre d'exploitation** | Plage de conditions (températures, piste, réglages, carburant, pilote) dans laquelle une voiture donne son maximum (D-114). |

| **Fenêtre de transferts** | Période (semaines 26 à 48) pendant laquelle les écuries font des offres aux pilotes pour les saisons suivantes ; les contrats signés prennent effet en semaine 50 (phase 7a, D-116). |
| **Offre (marché)** | Proposition d'une écurie à une personne : salaire, durée, première saison, statut de n°1, indemnité à verser à l'employeur actuel ; jusqu'à trois tours de négociation (phase 7a). |
| **Pré-accord** | Contrat signé pendant la fenêtre qui ne commence qu'une saison plus tard (ou deux) ; la personne reste chez son employeur jusque-là (phase 7a, D-117). |
| **Contrat signé** | Statut d'un contrat conclu mais pas encore commencé (« signe ») ; il devient actif en semaine 50 de l'année qui précède son début (phase 7a). |
| **Débauchage** | Recrutement d'une personne encore sous contrat (ou affiliée à une académie) à la date de début du nouveau contrat, contre une indemnité versée à son employeur (phase 7a). |
| **Clause de rachat** | Montant inscrit au contrat qui permet à une autre écurie de libérer la personne sans l'accord de son employeur (phase 7a). |
| **Indemnité de transfert** | Somme versée à l'employeur actuel lors d'un débauchage : la clause de rachat si elle existe, sinon l'indemnité exigée par l'écurie (phase 7a). |
| **Contre-attaque** | Réaction d'un employeur à une offre extérieure faite à son pilote : il le prolonge et l'augmente pour le garder (phase 7a). |
| **Lassitude** | Envie d'un nouveau défi d'une personne installée depuis longtemps (et titrée) au même endroit ; calculée, modérée, jamais un départ automatique (D-117 ; pilotes en 7a, personnel en 7b). |
| **Réputation de prédatrice** | Réputation d'une écurie qui débauche souvent : un coût (méfiance, indemnités plus chères), jamais une interdiction ; elle s'efface avec le temps (D-117). |
| **Non-concurrence** | Période (6 mois) pendant laquelle une personne débauchée travaille à efficacité réduite (50 %) dans sa nouvelle écurie, sans pouvoir utiliser ce qu'elle savait de l'ancienne (D-117, D-127). |
| **Remplacement (marché)** | Recrutement d'un responsable nettement meilleur que celui en place, qui est alors libéré avec indemnité (phase 7b). |
| **Départ en groupe** | Une partie du niveau d'un département suit un responsable technique influent débauché (D-077, phase 7b). |
| **Candidature spontanée** | Proposition de services d'une personne ambitieuse et lassée à une autre écurie, pour un poste égal ou supérieur (D-117, phase 7b). |
| **Popularité** | Notoriété d'un pilote (0 à 100), nationale et internationale ; base de sa valeur commerciale (phase 7c). |
| **Valeur commerciale** | Ce qu'un pilote peut rapporter en sponsoring par an : popularité, taille du marché de sa nationalité, rareté de sa nationalité sur la grille (phase 7c). |
| **Sponsor personnel** | Sponsor lié à un pilote : il l'accompagne dans son écurie (dans un emplacement existant) ou le paie lui-même (phase 7c). |
| **Pilote payant** | Pilote dont l'apport commercial (sponsors, famille) compte dans son recrutement ; le marché le régule, aucune règle (D-099, phase 7c). |
| **Agent** | Représentant d'un pilote ou d'un cadre : négocie, prend une commission négociée, pousse parfois au transfert, démarche les écuries (phase 7c). |
| **Équipe des stands** | Mécaniciens d'une écurie gérés collectivement (rapidité, précision, cohésion, fatigue), avec un chef d'équipe individualisé sous le directeur sportif (D-129 ; humain en phase 8, arrêts simulés en phase 13). |
| **Cohésion (équipe des stands)** | Synchronisation collective : elle libère la part du potentiel de rapidité réellement exprimée, sans jamais le dépasser (D-129). |
| **Engagement conditionnel** | Promesse d'un partenaire réel (entreprise familiale ou nationale) de financer un jeune pilote s'il accède à la F1 ; le sponsor est réservé jusque-là (D-131). |
| **Remplacement de sponsor** | Un sponsor qui suit un pilote prend la place d'un sponsor moins généreux de l'écurie, contre une indemnité de rupture ; seulement si le gain net est positif (D-131). |
| **Grande réforme** | Nouveau règlement technique proposé par la fédération (aérodynamique, motorisation et énergie, châssis et mécanique, refonte majeure), voté par les écuries et appliqué environ deux saisons complètes après le vote (D-128, phase 8a). |
| **Prolongation** | Option du vote d'une grande réforme : le règlement en vigueur est prolongé d'une ou deux saisons (phase 8a). |
| **Évolution mineure** | Petite modification annuelle du règlement, sur 1 ou 2 domaines, décidée par la fédération seule (D-132, phase 8a). |
| **Intensité (d'un changement)** | Part d'un domaine technique qui change avec un règlement, de 0 (inchangé) à 1 (entièrement nouveau) ; elle fixe la part du savoir qui devient obsolète et l'ampleur de la reconception (phase 8a). |
| **Domaine technique** | L'un des 12 champs de connaissance des voitures (aérodynamique avant, fond plat, énergie, interface pneus…), avec ses voisins ; identifiants stables repris par la phase 12 (D-132). |
| **Savoir** | Connaissance accumulée par une écurie dans un domaine technique : une part **fondamentale** (toujours utile) et une part **propre à un règlement** (en partie obsolète quand il change) (D-128, phase 8b). |
| **Programme de recherche** | Effort de recherche d'une écurie : un domaine, un horizon et une part des moyens de développement ; deux au plus, suspendables sans perte (D-128, phase 8b). |
| **Horizon (de recherche)** | Ce que vise un programme : la voiture actuelle, la saison suivante, ou un règlement futur (annoncé ou seulement proposé) (D-128, phase 8b). |
| **Remise en route** | Semaines à efficacité réduite après la réorientation d'un programme vers un autre domaine ; coût en temps seulement (D-132). |
| **Reconception** | Adaptation des voitures à l'entrée d'un règlement ou d'une évolution mineure : chaque caractéristique se rapproche de la moyenne du plateau selon l'intensité, puis s'en écarte selon le savoir, la compétence et l'exécution ; provisoire jusqu'à la phase 12 (phase 8). |
| **Découverte** | Avancée rare et expliquée d'une écurie pour un règlement futur (savoir fondamental et vision technique de son DT), copiée peu à peu par les autres après l'entrée en vigueur ; sans quota (D-128). |
| **Délégation de la recherche** | Le joueur confie ses programmes de recherche à son directeur technique, qui décide avec les règles de l'IA (D-132). |
| **Fait suivi** | Événement privé qui intéresse les autres (promesse rompue, tension financière, débauchage…) et dont le moteur tient la liste de ceux qui le connaissent, bornée (phase 8c). |
| **Fuite** | Transmission d'un fait privé par une personne qui le connaît à l'une de ses relations, parfois dans une autre écurie ; freinée par la discrétion (phase 8c). |
| **Rumeur** | Version déformée (exagérée) d'un fait, reçue lors d'une fuite ; elle pèse plus qu'un fait exact, selon la croyance de celui qui l'entend (phase 8c). |
| **Croyance** | Crédit qu'une personne accorde à ce qu'on lui rapporte, selon sa confiance envers la source (phase 8c). |
| **Révélation** | Passage d'un fait privé au public, par la presse ou parce que trop de monde est au courant (phase 8c). |
| **Réputation perçue** | Réputation d'un acteur aux yeux d'un observateur : faits publics, plus les faits privés qu'il connaît, pondérés par ce qu'il en croit (phase 8c). |
| **Avant-projet** | Réforme préparée par la fédération avant sa publication ; seules les écuries qui en ont vent le connaissent, et approximativement (phase 8c). |
| **Chef d'équipe des stands** | Seul mécanicien individualisé de l'équipe des stands, sous l'autorité du directeur sportif ; son encadrement fixe le plafond de cohésion et l'efficacité de l'entraînement (D-129, phase 8d). |
| **Plan d'entraînement (stands)** | Orientation (rapidité, précision, coordination, récupération) et intensité (légère, normale, intensive) de l'entraînement de l'équipe des stands, modifiable à tout moment (D-132, phase 8d). |
| **Fatigue (stands)** | Charge accumulée par l'équipe des stands (entraînement, Grands Prix, enchaînements), réduite par la récupération ; elle freine les progrès et, en phase 13, augmentera les erreurs (phase 8d). |
| **Encadrement (stands)** | Qualité de la direction de l'équipe des stands : chef d'équipe, directeur sportif et leur relation ; il fixe le plafond de cohésion (phase 8d). |
| **Envie de partir** | Désir d'une personne de quitter son poste, calculé à partir de sa motivation, de sa méfiance envers le team principal, de sa rancœur envers l'écurie et de sa lassitude (phase 8d). |
| **Demande de départ** | Demande d'une personne de quitter son poste à l'amiable, contre une partie de son indemnité ; l'employeur accepte ou refuse (phase 8d). |
| **Rupture négociée** | Fin de contrat d'un commun accord, avec une indemnité convenue, proposée par l'employeur ou demandée par la personne (D-077, phase 8d). |
| **Démission** | Départ unilatéral d'une personne, sans indemnité, suivi d'une période de non-concurrence (phase 8d). |
| **Groupe social** | Ensemble de personnes liées par l'affinité ou le respect et une expérience commune, détecté chaque saison autour d'un leader, jamais créé à la main (memoire.md §4, phase 8d). |
| **Lien social** | Relation de la mémoire v1, plus une affinité née de valeurs proches et un respect né de la compétence, en proportion de la familiarité ; lu seulement par les groupes (D-137). |
| **Leader (groupe)** | Membre d'un groupe social qui reçoit le plus de respect ; quand il change d'écurie, certains membres veulent le suivre (phase 8d). |
| **Président de la fédération** | Personnalité élue tous les 4 ans par les écuries ; son orientation préférée, sa rigueur budgétaire et sa sensibilité au lobbying pèsent sur les propositions (D-132, phase 8d). |
| **Lobbying** | Argent dépensé par une écurie pour que la fédération retienne une orientation parmi ses propositions de réforme ; il ne touche jamais au décompte des voix (phase 8d). |
| **Alliance** | Rapprochement d'écuries (même motoriste, écuries partenaires, dirigeants qui s'entendent) ; dans les votes, chacune tient compte de l'intérêt de ses alliées (phase 8d). |
| **Usure du succès** | Lassitude d'une personne qui gagne depuis longtemps avec la même écurie, à partir d'un seuil personnel de 3 à 5 titres (jamais chez les très loyaux) ; elle annonce son besoin d'un nouveau défi, sa motivation baisse, puis elle cherche à partir. Équilibrage volontaire (D-140). |
| **Histoire réelle** | Rivalité ou histoire publiquement connue entre personnages inspirés de personnes réelles, saisie dans `histoires.csv` ; elle laisse des souvenirs au départ de 2027 (D-143). |
| **Ère** | Série d'au moins trois titres constructeurs consécutifs d'une écurie, inscrite dans la Chronique (phase 9). |
| **Date d'arrivée** | Année où un dirigeant a rejoint son écurie, saisie dans `carrieres.csv` ; elle fixe son ancienneté au départ (D-143). |
