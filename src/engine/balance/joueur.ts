/**
 * Phase 10 — le joueur (docs/systemes/phase-10-joueur.md). Valeurs PROVISOIRES (D-120).
 */

/**
 * Délégations par défaut d'une écurie dirigée par le joueur : `true` = l'équipe décide avec les règles de l'IA.
 * Au départ, le joueur gère lui-même ses pilotes ; tout le reste est délégué (il découvre le jeu sans être submergé).
 * La recherche (directeur technique) et les stands (directeur sportif) ont leurs propres drapeaux (phases 8b et 8d-1).
 */
export const DELEGATIONS_DEFAUT = { pilotes: false, personnel: true, academie: true, politique: true } as const;

/** Recherche et stands délégués au départ (drapeaux des phases 8b et 8d). */
export const DELEGATION_RECHERCHE_DEFAUT = true;
export const DELEGATION_STANDS_DEFAUT = true;

/**
 * Manager incarné par le joueur :
 * - traits et valeurs neutres (note 10, sur 20) : ils ne pèsent dans aucun sens sur les relations et les décisions déléguées ;
 * - compétences de team principal (note sur 20) : celles d'un team principal moyen de la grille de départ ;
 * - âge (ans) : sans effet sur la retraite (le joueur ne prend jamais sa retraite à sa place) ;
 * - durée du premier contrat (saisons).
 */
export const MANAGER_JOUEUR = { trait: 10, valeur: 10, competence: 12, age: 45, dureeContratAnnees: 3 };

/** Budget de développement fixé par le joueur (commande `budget.developpement`) : borne haute en multiple du plafond budgétaire. */
export const BUDGET_JOUEUR = { maxEnPartDuPlafond: 1 };

/** Décisions en attente : nombre de semaines avant l'échéance au-delà duquel une décision n'est pas encore signalée comme urgente. */
export const URGENCE_SEMAINES = 4;
