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
export const DIVIDENDES = { seuilAnneesDepenses: 0.6 };
export const PART_DIVIDENDES: Record<string, number> = { constructeur: 0.6, milliardaire: 0.3, fonds: 0.8, famille: 0.5, consortium: 0.6 };
/** Variation aléatoire annuelle de l'apport (écart type, part de l'apport). */
export const ALEA_APPORT = 0.08;

/* ---------------------------------------------------------------- Dépenses */

/** Coût annuel moyen d'un employé de département (M€), modulé par le niveau moyen du département. */
export const COUT_EMPLOYE = { base: 0.05, parPointNiveau: 0.003 };
/** Opérations : logistique, déplacements, pièces de rechange, par Grand Prix. */
export const OPERATIONS_PAR_GP = 1.2;
/** Entretien d'une installation, par niveau, majoré avec l'âge (+ âge/30). */
export const ENTRETIEN_PAR_NIVEAU = 0.25;
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
 * Restrictions aérodynamiques selon le classement constructeurs de la saison précédente (règle connue et
 * identique pour tous, D-081) : efficacité du développement aérodynamique, du premier au dernier.
 */
export const RESTRICTIONS_AERO = { premier: 0.75, dernier: 1.15 };

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
