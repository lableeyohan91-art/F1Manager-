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
