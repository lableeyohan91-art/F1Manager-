/**
 * Économie — phase 5a (docs/systemes/phase-5-economie.md, D-078). Montants en M€ par an sauf mention.
 * Estimations de game design, à calibrer par le laboratoire (D-076, D-081).
 */

/** Nombre de périodes comptables par an (une toutes les 4 semaines). */
export const PERIODES_PAR_AN = 13;

/* ---------------------------------------------------------------- Recettes */

/** Revenus commerciaux = base × (POPULARITE.min + POPULARITE.parPoint × popularité) × (RESULTATS.min + RESULTATS.amplitude × force sportive). */
export const COMMERCIAL = { popMin: 0.7, popParPoint: 0.02, resultatsMin: 0.85, resultatsAmplitude: 0.3 };

/**
 * Apport annuel du propriétaire selon son type : multiplicateur de l'apport de base, sensibilité aux résultats
 * (apport accru si l'écurie est proche du sommet, pour les ambitieux) et aux pertes (fonds : apport réduit si déficit).
 */
export const PROPRIETAIRES: Record<string, { stabilite: number; sensibiliteResultats: number; sensibilitePertes: number }> = {
  constructeur: { stabilite: 0.9, sensibiliteResultats: 0.1, sensibilitePertes: 0.1 },
  milliardaire: { stabilite: 0.7, sensibiliteResultats: 0.35, sensibilitePertes: 0 },
  fonds: { stabilite: 0.8, sensibiliteResultats: 0.1, sensibilitePertes: 0.5 },
  famille: { stabilite: 0.95, sensibiliteResultats: 0, sensibilitePertes: 0.2 },
  consortium: { stabilite: 0.85, sensibiliteResultats: 0.15, sensibilitePertes: 0.2 },
};
/**
 * Dividendes (bilan annuel) : au-delà d'une trésorerie égale à `seuilAnneesDepenses` années de dépenses,
 * le propriétaire retire une part de l'excédent, selon son type (un fonds encaisse, un milliardaire réinvestit).
 * Raison : sans ce mécanisme, les écuries riches accumulaient 1 000 à 1 500 M€ en 5 saisons (premier essai 5a).
 */
export const DIVIDENDES = { seuilAnneesDepenses: 0.25 };
/**
 * Audit économique du 27/11, solution A (porteur : « A B C ») : le propriétaire d'une écurie classée dans la seconde moitié du championnat
 * constructeurs qui vient de se terminer ne prend que `facteurSecondeMoitie` des dividendes habituels (0 = il laisse tout l'excédent à
 * l'écurie). Mesuré avant : Haas versait 34 M€ par an en étant dernière, avec 54 M€ de marge inutilisée sous le plafond.
 */
// Mesuré (27/11) : sans condition, les grandes écuries passées dans la seconde moitié accumulaient une trésorerie inutile (jusqu'à 1,3 Md€),
// faute de place sous le plafond. Les dividendes ne sont donc retenus que si le développement de l'année a été limité par l'argent : budget
// de développement inférieur d'au moins `margeMinMEUR` à la place restant sous le plafond après les frais fixes.
export const DIVIDENDES_RESULTATS = { facteurSecondeMoitie: 0, margeMinMEUR: 10 };
export const PART_DIVIDENDES: Record<string, number> = { constructeur: 0.6, milliardaire: 0.3, fonds: 0.8, famille: 0.5, consortium: 0.6 };
/** Variation aléatoire annuelle de l'apport (écart type, part de l'apport). */
export const ALEA_APPORT = 0.08;

/* ---------------------------------------------------------------- Dépenses */

/** Coût annuel moyen d'un employé de département (M€), modulé par le niveau moyen du département. */
export const COUT_EMPLOYE = { base: 0.05, parPointNiveau: 0.003 };
/** Opérations : logistique, déplacements, pièces de rechange, par Grand Prix. */
export const OPERATIONS_PAR_GP = 1.2;
/** Entretien d'une installation : remplacé par l'entretien progressif (D-181, balance/capacites.ts, INSTALLATIONS_COUT). */
/** Marketing et hospitalité (hors plafond), en part des revenus commerciaux. */
export const PART_MARKETING = 0.15;
/** Nombre de cadres les mieux payés (hors pilotes) dont le salaire est hors plafond (règle réelle). */
export const CADRES_HORS_PLAFOND = 3;

/* ---------------------------------------------------------------- Plafond et sanctions */

/** Dépassement mineur : en dessous de ce pourcentage du plafond. */
export const SEUIL_DEPASSEMENT_MINEUR = 0.05;
/** Amende (M€) = facteur × dépassement ; la saison suivante, efficacité aérodynamique réduite. */
export const SANCTION_PLAFOND = { amendeFacteur: 2, reductionAeroMineur: 0.1, reductionAeroMajeur: 0.25 };

/**
 * Restrictions aérodynamiques (règle connue et identique pour tous, D-081) : part des heures de soufflerie et de CFD selon le classement
 * constructeurs. Phase 12b : barème réel 2026 (vérifié) : `premier` pour le champion, + `pasParPlace` par place, plafonné à `dernier`
 * (les 10e et 11e ont 115 %). Avant la 12b : interpolation linéaire de 0,75 à 1,15. Bornes votables (phase 8d).
 */
export const RESTRICTIONS_AERO = { premier: 0.7, dernier: 1.15, pasParPlace: 0.05 };

/* ---------------------------------------------------------------- Budget de développement */

/**
 * Marge de sécurité visée sous le plafond (part du plafond) : absorbe les embauches et hausses de salaires en cours d'année.
 * Sans elle, une écurie qui vise exactement le plafond le dépasse de quelques centaines de milliers d'euros.
 */
export const MARGE_SECURITE_PLAFOND = 0.015;

/**
 * Effort technique de référence (M€ de dépenses plafonnées prévues sur l'année) donnant un facteur budget de 1.
 * L'effort technique = TOUTES les dépenses plafonnées (personnel des départements, installations, opérations,
 * développement) : une écurie au plafond obtient ≈ 1,05, quelle que soit la répartition entre personnel et pièces.
 * Raison : mesurer le seul poste « développement » avantagerait artificiellement les petites équipes, qui ont moins
 * de salariés et donc plus de marge sous le plafond (constaté au premier essai de la phase 5a).
 */
export const EFFORT_TECHNIQUE_REFERENCE = 200;
export const FACTEUR_BUDGET_DEV = { min: 0.3, max: 1.3 };
/** Budget de développement minimal (même en crise). */
export const DEVELOPPEMENT_MINIMUM = 15;

/**
 * IA budgétaire : réserve visée = N périodes de dépenses fixes, selon la prudence ;
 * part de l'excédent de trésorerie réinvestie chaque année.
 */
export const BUDGET_IA = { periodesReserve: 3, partExcedentInvesti: 0.35 };
/** Probabilité de dépasser volontairement le plafond (prise de risque), et ampleur maximale. */
export const DEPASSEMENT_VOLONTAIRE = { seuilRisque: 14, probabiliteParPoint: 0.04, ampleurMax: 0.04 };
/** En cours de saison : si la trésorerie de fin d'année projetée est négative, coupe du développement restant. */
export const COUPE_EN_COURS = 0.2;

/* ---------------------------------------------------------------- Conseil */

/** Le conseil licencie le team principal si l'écart au classement attendu est trop grand, selon sa patience. */
export const CONSEIL = { ecartGrave: 5, ecartRepete: 3, patienceMaxGrave: 8, patienceMaxRepete: 12, probabilite: 0.6 };
/** Audit 4.1 : contre-offre d'un team principal au conseil — le conseil suit jusqu'à ce multiple de la valeur de marché (H). */
export const CONSEIL_CONTRE_OFFRE = { plafondValeur: 1.2 };

/* =================================================================== Phase 5b */

/* ---------------------------------------------------------------- Sponsors */

/**
 * Part des revenus commerciaux de base qui provient des droits commerciaux (télévision, organisateur), versés quoi qu'il arrive.
 * Le reste de l'ancien « commercial » de la phase 5a est désormais apporté par les contrats de sponsoring (marché).
 */
export const PART_DROITS_COMMERCIAUX = 0.5;
/** Vivier de sponsors : taille au départ, arrivées par an, taille maximale (volume borné). */
export const VIVIER_SPONSORS = { initial: 75, arriveesParAn: 7, maximum: 95, anneesSansContratAvantDepart: 2, probabiliteDepart: 0.35 };
/** Emplacements par écurie (titre, principaux, secondaires). */
export const EMPLACEMENTS_SPONSORS: Record<string, number> = { titre: 1, principal: 3, secondaire: 6 };
/** Montant au-delà duquel un contrat est de rang « titre » ou « principal » (M€ par an). */
export const SEUILS_RANG_SPONSOR = { titre: 30, principal: 8 };
/**
 * Montant proposé = budget du sponsor × conjoncture × part engagée × (min + amplitude × attrait).
 * Part engagée calibrée pour que le sponsoring total (≈ 850–950 M€ par an) remplace la moitié des anciens revenus commerciaux
 * (premier essai à 0,7 : ≈ 1 830 M€, deux fois trop, aucune crise possible).
 * Attrait de l'écurie entre 0 et 1.
 */
export const OFFRE_SPONSOR = { partEngagee: 0.35, min: 0.55, amplitude: 0.9, primeObjectif: 0.2 };
/** Poids de l'attrait selon l'image recherchée par le sponsor (popularité, prestige, résultats, marketing, nationalité). */
export const POIDS_ATTRAIT: Record<string, { popularite: number; prestige: number; resultats: number; marketing: number; nationalite: number }> = {
  prestige: { popularite: 0.2, prestige: 0.45, resultats: 0.2, marketing: 0.1, nationalite: 0.05 },
  popularite: { popularite: 0.5, prestige: 0.1, resultats: 0.2, marketing: 0.15, nationalite: 0.05 },
  resultats: { popularite: 0.15, prestige: 0.1, resultats: 0.6, marketing: 0.1, nationalite: 0.05 },
  nationalite: { popularite: 0.2, prestige: 0.1, resultats: 0.2, marketing: 0.1, nationalite: 0.4 },
};
/** Bruit de préférence d'un sponsor entre écuries (écart type, sur l'attrait). */
export const ALEA_CHOIX_SPONSOR = 0.06;
/** Durée des contrats (années) : de min à max, plus longue si le sponsor est fidèle. */
export const DUREE_CONTRAT_SPONSOR = { min: 1, max: 4 };
/** Satisfaction : gain si objectif atteint, perte de base et par place manquée ; seuil de rupture ; seuil de renouvellement. */
export const SATISFACTION_SPONSOR = { initiale: 60, gainObjectif: 15, perteBase: 15, pertePlace: 6, seuilRupture: 25, seuilRenouvellement: 50 };
/** Rancune d'un sponsor déçu ou parti fâché (années pendant lesquelles il évite l'écurie). */
export const RANCUNE_SPONSOR_ANNEES = 3;
/** Conjoncture économique mondiale : marche aléatoire annuelle bornée, multiplie les budgets des sponsors. */
export const CONJONCTURE = { ecartType: 0.07, rappel: 0.3, min: 0.75, max: 1.2 };

/* ---------------------------------------------------------------- Dette et crises */

/** Réserve minimale (en périodes de dépenses) sous laquelle l'écurie emprunte. */
export const RESERVE_MINIMALE_PERIODES = 1;
/** Capacité d'emprunt (0,5 au premier essai : aucune crise en 600 saisons, les banques prêtaient trop) : part des recettes annuelles, modulée par le goût du risque du propriétaire (× (0,5 + risque/20)). */
export const LIMITE_DETTE_RECETTES = 0.25;
/** Taux annuel : base + prime de risque × (dette / recettes annuelles), plafonnée. */
export const TAUX_DETTE = { base: 0.04, primeRisque: 0.1, max: 0.15 };
/** Remboursement : au-delà de `seuilPeriodes` de trésorerie, la moitié de l'excédent rembourse la dette. */
export const REMBOURSEMENT = { seuilPeriodes: 3, part: 0.5 };
/** Crise : baisse de motivation du personnel quand les salaires sont menacés (points sur 100). */
export const CRISE_MOTIVATION = 12;
/** Sauvetage par le propriétaire : probabilité de base selon son type, + ambition ; périodes de crise avant administration. */
export const SAUVETAGE: Record<string, number> = { constructeur: 0.7, milliardaire: 0.6, fonds: 0.25, famille: 0.4, consortium: 0.35 };
export const PERIODES_CRISE_AVANT_ADMINISTRATION = 3;
/** Lassitude : chaque année, un propriétaire impatient qui perd de l'argent et des places peut vendre. */
export const LASSITUDE = { anneesDeficit: 3, probabilite: 0.12, patienceMax: 9 };
/**
 * Chantier 2, levier A (D-179) — investisseur d'opportunité : une écurie qui stagne dans les 3 dernières places (au moins `saisonsBasMin`
 * des `fenetreSaisons` dernières saisons), hors crise, vaut peu et attire un repreneur. Chance par bilan annuel : `probabiliteBase` +
 * `parPointImpatience` × (10 − patience du propriétaire), bornée à [`probabiliteMin`, `probabiliteMax`] ; jamais moins de
 * `delaiDepuisRachat` saisons après un changement de propriétaire. Le repreneur apporte au moins `hausseApportMin` × l'apport de base de
 * l'ancien propriétaire et son ambition vaut au moins `ambitionMin` (H : il achète pour faire monter l'écurie).
 */
export const INVESTISSEUR = { fenetreSaisons: 4, saisonsBasMin: 3, placesBas: 3, probabiliteBase: 0.25, parPointImpatience: 0.03, probabiliteMin: 0.1, probabiliteMax: 0.5, delaiDepuisRachat: 5, hausseApportMin: 1.4, ambitionMin: 12 };
/**
 * Chantier 2, levier C (D-179) — objectif du propriétaire : à chaque bilan, gagner `progressionPlaces` place(s) au championnat
 * constructeurs (le champion : garder la première). Atteint par une progression : apport de la saison suivante × (1 + `bonusApport`) ;
 * garder la première place ne donne pas de bonus, et seules les écuries parties de la `placeMinBonus`e place ou au-delà en reçoivent un
 * (les grandes sont au plafond ; mesuré : un bonus pour les écuries de tête rendait les championnats moins disputés, titre ouvert 38 % → 27 %).
 */
/**
 * Chantier 2, levier B (fiche phase-12e-levier-b-pilote-soutenu.md) — offre du pilote soutenu. PROTOTYPE DE MESURE : désactivé par défaut
 * (`actif` 0 ; paramètre d'expérience `pilotesSoutenus`), en attente de la validation du porteur.
 * Éligibilité (ouverture du marché) : baquet libre la saison suivante, seconde moitié du classement, et pas de sponsor titre ni principal
 * la saison suivante ou trésorerie sous `tresorerieMois` mois de dépenses. Au plus une offre par saison sur la grille (l'écurie la plus pauvre),
 * avec la chance `chance` ; pas de nouvelle offre pendant un contrat en cours ni `delaiApresRefus` saisons après un refus.
 * Pilote : sans baquet, niveau entre (référence de l'écurie − `ecartMax`) et (référence − `ecartMin`), au moins `niveauMin` ; le plus vendeur.
 * Chèque `chequeMin`–`chequeMax` M€ ; sponsor principal `sponsorMin`–`sponsorMax` M€/an pendant `dureeSponsor` ans ; titulaire `dureeGarantie` saisons, n°1.
 * IA : accepte si l'écart de niveau est au plus `ecartAccepteIA`, ou si la trésorerie est sous le seuil.
 */
export const PILOTE_SOUTENU = { actif: 0, chance: 0.25, delaiApresRefus: 3, tresorerieMois: 3, ecartMin: 1, ecartMax: 4, niveauMin: 10, ecartAccepteIA: 3,
  chequeMin: 10, chequeMax: 25, sponsorMin: 20, sponsorMax: 35, dureeSponsor: 5, dureeGarantie: 3, salaireParValeur: 0.6 };
export const OBJECTIF_PROPRIETAIRE = { progressionPlaces: 1, bonusApport: 0.15, placeMinBonus: 5 };
/** Rachat : types de repreneurs (poids), apport annuel de base (M€, fourchette), part de la dette effacée, chance de changer de team principal. */
export const REPRENEURS: Record<string, { poids: number; apportMin: number; apportMax: number }> = {
  constructeur: { poids: 2, apportMin: 100, apportMax: 200 },
  milliardaire: { poids: 3, apportMin: 60, apportMax: 220 },
  fonds: { poids: 3, apportMin: 30, apportMax: 90 },
  consortium: { poids: 2, apportMin: 40, apportMax: 120 },
};
export const RACHAT = { partDetteEffacee: 0.7, periodesReserveInjectees: 2, probabiliteChangementTP: 0.5 };

/* ---------------------------------------------------------------- Infrastructures */

/** Installations qui agissent sur le développement de la voiture (déjà lues par la capacité de développement). */
export const INSTALLATIONS_TECHNIQUES = ['soufflerie', 'cfd', 'simulateur', 'bureau_etudes'] as const;
/** Vieillissement : perte d'efficacité par année d'âge, plancher ; perte d'état par année de crise. */
export const VIEILLISSEMENT = { perteParAn: 0.012, plancher: 0.7, perteEtatCrise: 15, recuperationEtat: 10 };
/** Enveloppe réglementaire d'investissement en infrastructures (hors plafond), par an (M€). */
export const INVESTISSEMENT_ANNUEL_MAX = 25;
/**
 * Audit économique du 27/11 (porteur : « je ne vois pas pourquoi on limite les infrastructures à 25 M€ par an, ce n'est pas équitable ») —
 * VARIANTE DE MESURE, désactivée par défaut (paramètre `reglement.investissementModule`, 0 = désactivé, 1 = actif) : l'enveloppe annuelle
 * d'investissement d'une écurie reçoit `bonusParNiveau` M€ par point de retard de son niveau moyen d'installations sur la moyenne de la
 * grille (équilibrage des moyens déclaré, D-169), au plus `bonusMax` M€.
 */
export const INVESTISSEMENT_MODULE = { actif: 0, bonusParNiveau: 8, bonusMax: 25 };
/**
 * Audit économique du 27/11 (porteur : « à chaque GP on a la part fixe et la part variable selon nos résultats » ; solution B retenue) :
 * activée (paramètre `economie.primesParGP` = part variable, 0 = ancienne règle) : une part `partVariable` de l'enveloppe des primes
 * est versée Grand Prix par Grand Prix selon le classement constructeurs **en cours** (mêmes parts que le barème annuel) ; le reste garde
 * la règle actuelle (classement de l'an dernier, étalé sur l'année).
 */
export const PRIMES_PAR_GP = { partVariable: 0.5 };
/**
 * Économie v2 (D-189, fiche economie-v2-argent-utile.md ; porteur : « oui ») — EN MESURE, désactivé par défaut : `entretienHorsPlafond`
 * (paramètre `economie.entretienHorsPlafond`, 1 = actif) fait payer l'entretien des installations avec l'argent de l'écurie, hors plafond ;
 * le plafond est alors baissé d'autant : `plafondAvecEntretienHorsMEUR` (M€), sauf réglage explicite `reglement.plafondMEUR`.
 */
export const ECONOMIE_V2 = { entretienHorsPlafond: 0, plafondAvecEntretienHorsMEUR: 190 };
/** Coût d'une amélioration (niveau n → n+1) = base × (n+1) ; rénovation = base × niveau ; durées (semaines). */
export const COUT_INFRASTRUCTURE = { ameliorationParNiveau: 4, renovationParNiveau: 1.5, ageMinRenovation: 12 };
export const DUREE_INFRASTRUCTURE = { amelioration: { min: 40, max: 80 }, renovation: { min: 26, max: 52 } };
/** Risques : probabilité et ampleur des retards et dépassements de coût, tirés au lancement. */
export const RISQUES_INFRASTRUCTURE = { probabiliteRetard: 0.25, retardMax: 0.6, probabiliteSurcout: 0.3, surcoutMax: 0.4 };
/** L'IA lance un projet si sa trésorerie dépasse la réserve visée d'au moins cette part du coût. */
export const MARGE_LANCEMENT_PROJET = 0.5;

/**
 * Retrait du propriétaire en cours de saison (difficultés de sa maison mère, changement de stratégie) : probabilité annuelle
 * selon son type, part de l'apport restante retirée, semaine de l'annonce. Source principale des crises (rapport P5b) :
 * sans choc, l'IA ajuste son budget chaque année et ne tombe jamais en crise.
 */
export const RETRAIT_PROPRIETAIRE = {
  probabiliteParAn: { constructeur: 0.02, milliardaire: 0.04, fonds: 0.04, famille: 0.03, consortium: 0.03 } as Record<string, number>,
  reductionMin: 0.5, reductionMax: 1, semaineMin: 12, semaineMax: 40,
};
/** Emprunt offensif : un team principal joueur, soutenu par un propriétaire joueur, finance le développement par la dette. */
export const EMPRUNT_OFFENSIF = { risqueTP: 13, risqueProprietaire: 12, partCapacite: 0.5 };
