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
| **Réputation** | Image publique d'un acteur, par facette (formateur, fidèle, impitoyable…), calculée à partir des faits publics. |
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
