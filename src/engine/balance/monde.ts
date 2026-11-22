/** Paramètres de génération du monde (phase 2). */

/** Les 9 postes individualisés par écurie (D-029) et leur nombre. */
export const POSTES_INDIVIDUALISES: { poste: string; nombre: number }[] = [
  { poste: 'team_principal', nombre: 1 },
  { poste: 'directeur_technique', nombre: 1 },
  { poste: 'directeur_sportif', nombre: 1 },
  { poste: 'directeur_financier', nombre: 1 },
  { poste: 'responsable_aero', nombre: 1 },
  { poste: 'responsable_conception', nombre: 1 },
  { poste: 'pilote_titulaire', nombre: 2 },
  { poste: 'pilote_reserve', nombre: 1 },
];

/** Réservoir de personnes libres au départ. */
export const RESERVOIR = {
  // Jeunes pilotes : remplacés en phase 6a par une cohorte par âge de 14 à 22 ans (balance/carriere.ts, POPULATION_JEUNE_INITIALE).
  /** Ingénieurs et cadres sans poste. */
  ingenieursLibres: 50,
};

/** Durée des contrats générés pour le personnel (années après la saison de départ). */
export const DUREE_CONTRAT_GENERE = { min: 1, max: 4 };

/** Salaire annuel du personnel généré, en M€, par poste (fourchette). */
export const SALAIRES_GENERES: Record<string, { min: number; max: number }> = {
  team_principal: { min: 3, max: 10 },
  directeur_technique: { min: 2, max: 8 },
  directeur_sportif: { min: 0.8, max: 2.5 },
  directeur_financier: { min: 0.8, max: 2.5 },
  responsable_aero: { min: 0.8, max: 3 },
  responsable_conception: { min: 0.8, max: 3 },
  pilote_reserve: { min: 0.3, max: 1.5 },
};

/** Départements : effectif = base × (budget / budgetReference), borné. */
export const DEPARTEMENTS = {
  budgetReferenceMEUR: 400,
  effectifs: {
    aero: 120, conception: 110, production: 250, simulation: 45, fiabilite: 40,
    stands: 30, strategie: 15, recrutement: 8, marketing: 40, logistique: 35,
  } as Record<string, number>,
  /** Bornes du facteur appliqué à l'effectif de base. */
  facteurMin: 0.55,
  facteurMax: 1.25,
};

/** Installations : niveau (1–10) ≈ niveau de l'écurie / 2, plus un aléa. */
export const INSTALLATIONS = {
  types: ['soufflerie', 'cfd', 'simulateur', 'bureau_etudes', 'usine', 'centre_recherche', 'centre_formation', 'installations_personnel'] as const,
  ecartTypeNiveau: 1,
  ageMax: 25,
};
