/**
 * Phase 7a — marché des transferts des pilotes (fiche docs/systemes/phase-7-marche-du-travail.md, D-116, D-117).
 * Estimations de game design, provisoires : elles seront mesurées (D-095) puis calibrées lors de la campagne d'après la phase 8.
 */

/** Fenêtre principale : tours d'offres de la semaine `debut` à la semaine `fin`, tous les `pas` semaines. Les contrats prennent effet en semaine 50. */
export const FENETRE = { debut: 26, fin: 48, pas: 2 };

/** Nombre de tours de négociation d'une offre (offre, contre-offre, offre finale). */
export const TOURS_MARCHE = 3;

/**
 * Plan de personnel de l'IA (pilotes titulaires).
 * - vivier : nombre de candidats examinés à chaque tour (présélection sur l'opinion du paddock, pour borner le calcul) ;
 * - approchesBase / approchesParNiveau : nombre d'offres simultanées en attente pour une écurie (département recrutement, niveau /20) ;
 * - ecartDebauchage : avance de score (unités de score de recrutement, ≈ 1/20 de point de niveau) exigée pour payer une indemnité plutôt que de prendre le meilleur candidat libre ;
 * - preAccordSemaineMin : un pré-accord à deux saisons n'est envisagé qu'à partir de cette semaine, seulement pour un candidat d'exception
 *   (parmi les `preAccordRang` premiers du vivier selon l'opinion du paddock), et au plus `preAccordsParSaison` par écurie et par saison.
 */
export const PLAN_MARCHE = { vivier: 40, approchesBase: 1, approchesParNiveau: 2, ecartDebauchage: 0.06, preAccordSemaineMin: 40, preAccordRang: 5, preAccordsParSaison: 1 };

/**
 * Pari sur l'avenir (levier contre les débutants trop âgés) : l'écurie ajoute au score la progression qu'elle estime possible
 * pendant le contrat = min(potentiel estimé − niveau, progressionParAn × durée), en points de niveau, multipliée par `poids` (/20 comme le niveau).
 */
export const HORIZON = { progressionParAn: 0.9, poids: 0.6 };

/** Salaire offert par l'IA = valeur de marché × [min ; max] selon l'audace du team principal et le budget ; plafond de surenchère en contre-offre. */
export const OFFRE_MARCHE = { min: 0.9, max: 1.2, plafondBase: 1.15, plafondAudace: 0.3 };

/**
 * Clause de rachat inscrite dans un nouveau contrat de pilote titulaire : salaire × années restantes × multiple.
 * Indemnité exigée par une écurie (sans clause) : salaire × années restantes × multipleIndemnite, + majorations si c'est son meilleur pilote
 * ou si l'acheteur est réputé prédateur. Affilié d'académie : financement annuel × multipleAffiliation.
 */
export const RACHAT = { multiple: 1.5, multipleIndemnite: 2.0, majorationMeilleur: 0.5, majorationParPointPredateur: 0.1, multipleAffiliation: 3, minimumMEUR: 1 };

/** Un pilote sous contrat ne part que si l'offre le séduit nettement plus que rester (unités d'utilité). */
export const INERTIE_CONTRAT = 0.12;

/** Contre-attaque de l'employeur : il prolonge et augmente un pilote courtisé qu'il veut garder, jusqu'à ce multiple de la meilleure offre extérieure. */
export const CONTRE_ATTAQUE = { surenchere: 1.05, plafondValeur: 1.4 };

/**
 * Lassitude des pilotes (D-117 §15.1) : calculée, non stockée. À partir de `anneesMin` saisons dans la même écurie, chaque saison
 * (parAnnee) et chaque titre avec elle (parTitre) augmentent l'envie d'un nouveau défi ; modulée par le goût du défi et l'ambition, freinée par la loyauté.
 * Bonus d'utilité pour une offre d'une autre écurie, malus de moitié pour une prolongation ; plafonné à `max`.
 */
export const LASSITUDE_PILOTE = { anneesMin: 5, parAnnee: 0.02, parTitre: 0.05, max: 0.2 };

/**
 * Réputation de prédatrice (D-117 §15.4) : + parDebauchage à chaque rachat d'un pilote sous contrat ; multipliée chaque année par `inertie`.
 * Malus d'utilité des offres de cette écurie : parPoint × réputation, plafonné ; jamais une interdiction.
 */
export const PREDATEUR = { parDebauchage: 1, inertie: 0.6, malusParPoint: 0.04, malusMax: 0.15 };
