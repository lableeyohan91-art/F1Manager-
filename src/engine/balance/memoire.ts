/**
 * Paramètres de conservation du journal des événements (voir docs/systemes/memoire.md §1).
 * Les durées sont en saisons (années de jeu).
 */

/** Événements d'importance 1 et 2 : durée de conservation détaillée, en saisons. */
export const CONSERVATION_MINEURS_SAISONS = 1;

/** Événements d'importance 3 : durée avant résumé (le contexte est retiré), en saisons. */
export const CONSERVATION_NOTABLES_DETAIL_SAISONS = 3;

/** Événements d'importance 3 : durée avant suppression du résumé, en saisons. */
export const CONSERVATION_NOTABLES_RESUME_SAISONS = 6;

/** Importance à partir de laquelle un événement est versé dans la Chronique (conservé pour toujours). */
export const IMPORTANCE_CHRONIQUE = 4;

/**
 * Élagage des chaînes de causes (D-058), en saisons : au-delà, un événement conservé ne protège plus
 * ses causes mineures ; les liens vers elles sont remplacés par un résumé.
 */
export const ELAGAGE_CAUSES_SAISONS = 10;

/* ======================================================================================
 * Mémoire v1 (phase 4) — docs/systemes/phase-4-contrats-memoire.md §4, D-070.
 * ====================================================================================== */

/** Nombre maximal de souvenirs actifs par personne (le plus faible est effacé, avec son résidu). */
export const SOUVENIRS_MAX_PAR_PERSONNE = 40;

/** En dessous de cette intensité calculée, aucun souvenir n'est créé : tout ne marque pas. */
export const SEUIL_CREATION_SOUVENIR = 0.12;

/** En dessous de cette intensité, un souvenir s'efface (et laisse un résidu). */
export const SEUIL_EFFACEMENT_SOUVENIR = 0.06;

/** Part de l'effet d'un souvenir effacé versée dans la base durable de la relation : min + (trait/20) × (max − min). */
export const RESIDU = { min: 0.1, max: 0.3 };

/** Retour mensuel de la base durable vers zéro (les erreurs restent réparables, lentement). */
export const RETOUR_BASE_MENSUEL = 0.006;

/**
 * Saturation (D-070) : un renforcement du même souvenir moins de N semaines après le précédent ne compte
 * que pour une fraction. Empêche de « farmer » une relation par des compliments répétés.
 */
export const SATURATION = { semaines: 12, facteur: 0.25, plafondRepetition: 1.2 };

/** Gain de familiarité par mois entre collègues d'une même écurie, et plafond. */
export const FAMILIARITE_MENSUELLE = 0.012;

/**
 * Étiquettes de souvenirs. Pour chacune :
 * - ressenti : signe et force du vécu (−1 … +1) ;
 * - intensite : intensité de base à la création (avant amplification) ;
 * - axes : répartition de l'effet sur la relation envers la cible (confiance, respect, affinité) ;
 * - oubli : vitesse d'oubli mensuelle de base (modulée par les traits, voir VITESSES_OUBLI) ;
 * - amplificateurs : traits (t:) ou valeurs (v:) qui amplifient (poids > 0) ou modèrent (< 0) la création,
 *   facteur = 1 + poids × (note − 10,5) / 10.
 * Rappel D-070 : la rancune agit sur la DURÉE (oubli), pas sur la création.
 */
export interface DefinitionEtiquette {
  libelle: string;
  ressenti: number;
  intensite: number;
  axes: { confiance: number; respect: number; affinite: number };
  oubli: number;
  amplificateurs: Record<string, number>;
}

export const ETIQUETTES: Record<string, DefinitionEtiquette> = {
  manque_reconnaissance: { libelle: 'Manque de reconnaissance', ressenti: -0.6, intensite: 0.55, axes: { confiance: 0.5, respect: 0.1, affinite: 0.4 }, oubli: 0.035, amplificateurs: { 't:besoinReconnaissance': 0.8, 'v:argent': 0.5, 't:ambition': 0.4 } },
  reconnaissance: { libelle: 'Reconnaissance', ressenti: 0.6, intensite: 0.4, axes: { confiance: 0.4, respect: 0.2, affinite: 0.4 }, oubli: 0.05, amplificateurs: { 't:besoinReconnaissance': 0.8, 't:ambition': 0.3 } },
  gratitude: { libelle: 'Gratitude (opportunité offerte)', ressenti: 0.8, intensite: 0.55, axes: { confiance: 0.4, respect: 0.2, affinite: 0.4 }, oubli: 0.03, amplificateurs: { 't:ambition': 0.5, 'v:fidelite': 0.5 } },
  promesse_tenue: { libelle: 'Promesse tenue', ressenti: 0.7, intensite: 0.5, axes: { confiance: 0.7, respect: 0.2, affinite: 0.1 }, oubli: 0.04, amplificateurs: { 'v:fidelite': 0.4, 'v:equite': 0.5 } },
  promesse_rompue: { libelle: 'Promesse rompue', ressenti: -0.9, intensite: 0.65, axes: { confiance: 0.8, respect: 0.1, affinite: 0.1 }, oubli: 0.03, amplificateurs: { 'v:equite': 0.8 } },
  conflit: { libelle: 'Négociation conflictuelle', ressenti: -0.4, intensite: 0.3, axes: { confiance: 0.3, respect: 0.2, affinite: 0.5 }, oubli: 0.06, amplificateurs: { 't:temperament': 0.6 } },
  humiliation: { libelle: 'Humiliation', ressenti: -0.9, intensite: 0.6, axes: { confiance: 0.3, respect: 0.2, affinite: 0.5 }, oubli: 0.03, amplificateurs: { 't:besoinReconnaissance': 0.6, 't:temperament': 0.5 } },
  injustice: { libelle: 'Injustice', ressenti: -0.7, intensite: 0.45, axes: { confiance: 0.5, respect: 0.3, affinite: 0.2 }, oubli: 0.04, amplificateurs: { 'v:equite': 0.9 } },
  critique_dure: { libelle: 'Critique publique justifiée', ressenti: -0.35, intensite: 0.35, axes: { confiance: 0.2, respect: -0.1, affinite: 0.6 }, oubli: 0.07, amplificateurs: { 't:temperament': 0.5, 't:besoinReconnaissance': 0.4, 't:remiseEnQuestion': -0.5 } },
  critique_constructive: { libelle: 'Critique privée constructive', ressenti: 0.15, intensite: 0.25, axes: { confiance: 0.2, respect: 0.7, affinite: 0.1 }, oubli: 0.08, amplificateurs: { 't:professionnalisme': 0.6, 't:remiseEnQuestion': 0.5 } },
  manque_respect: { libelle: 'Manque de respect', ressenti: -0.5, intensite: 0.35, axes: { confiance: 0.3, respect: 0.3, affinite: 0.4 }, oubli: 0.05, amplificateurs: { 't:besoinReconnaissance': 0.5, 't:temperament': 0.3 } },
  soutien: { libelle: 'Soutien dans une période difficile', ressenti: 0.7, intensite: 0.45, axes: { confiance: 0.5, respect: 0.1, affinite: 0.4 }, oubli: 0.03, amplificateurs: { 't:besoinReconnaissance': 0.4, 't:loyaute': 0.3 } },
  trahison: { libelle: 'Trahison', ressenti: -1, intensite: 0.7, axes: { confiance: 0.7, respect: 0.1, affinite: 0.2 }, oubli: 0.025, amplificateurs: { 't:ambition': 0.5, 'v:equite': 0.6 } },
  rivalite: { libelle: 'Rivalité', ressenti: -0.3, intensite: 0.3, axes: { confiance: 0, respect: 0.4, affinite: 0.6 }, oubli: 0.05, amplificateurs: { 't:ambition': 0.7, 't:temperament': 0.4 } },
  reussite_commune: { libelle: 'Réussite collective', ressenti: 0.6, intensite: 0.35, axes: { confiance: 0.3, respect: 0.3, affinite: 0.4 }, oubli: 0.03, amplificateurs: { 't:sociabilite': 0.6, 'v:fidelite': 0.4, 't:besoinReconnaissance': 0.3 } },
  perte: { libelle: 'Départ d’un proche', ressenti: -0.4, intensite: 0.35, axes: { confiance: 0.5, respect: 0, affinite: 0.5 }, oubli: 0.05, amplificateurs: { 't:loyaute': 0.6 } },
  excuses_recues: { libelle: 'Excuses reçues', ressenti: 0.35, intensite: 0.3, axes: { confiance: 0.5, respect: 0.2, affinite: 0.3 }, oubli: 0.06, amplificateurs: { 'v:equite': 0.3 } },
  echec_personnel: { libelle: 'Échec personnel (envers soi-même)', ressenti: -0.5, intensite: 0.4, axes: { confiance: 0, respect: 0, affinite: 0 }, oubli: 0.05, amplificateurs: { 't:ambition': 0.5, 't:remiseEnQuestion': 0.6 } },
};

/**
 * Vitesse d'oubli : multiplicateur = 1,5 − trait/20 (trait 20 → ×0,5 ; trait 1 → ×1,45).
 * Négatif envers les autres : rancune ; positif envers les autres : loyauté ; envers soi-même : remise en question.
 */
export const TRAIT_OUBLI = { negatifAutrui: 'rancune', positifAutrui: 'loyaute', soiMeme: 'remiseEnQuestion' } as const;

/**
 * Réconciliation (D-070) : des excuses ou la reconnaissance d'une erreur réduisent l'intensité des souvenirs
 * négatifs du destinataire envers l'auteur. Réduction = base × (1,5 − rancune/20), saturée si répétée.
 */
export const RECONCILIATION = { excuses: 0.3, reconnaissanceErreur: 0.35, discussionPrivee: 0.15 };
