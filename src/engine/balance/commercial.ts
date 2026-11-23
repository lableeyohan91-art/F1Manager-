/**
 * Phase 7c — agents, popularité, valeur commerciale, sponsors personnels, pilotes payants
 * (docs/systemes/phase-7-marche-du-travail.md §5, §8, §15.3 ; D-096 à D-099, D-116, D-117). Estimations provisoires (D-120).
 */

/**
 * Popularité (0–100) des pilotes, mise à jour chaque fin de saison vers une cible : base selon le rang au championnat
 * (`parRang` par place gagnée sur la dernière), victoires, titres, ancienneté ; charisme (communication, sociabilité, besoin de reconnaissance).
 * La nationale suit plus vite et plus haut que l'internationale. Inertie : part conservée chaque année.
 */
export const POPULARITE = {
  initialeParPointNiveau: 4, initialeMin: 5,
  parRang: 2.5, parVictoire: 3, parTitre: 12, parSaisonF1: 1, plafondAnciennete: 10,
  charisme: 15, bonusNational: 15, inertie: 0.6, junior: 0.4,
};

/**
 * Taille relative du marché commercial d'une nationalité (1 = très grand marché). Valeur par défaut pour les autres.
 * Codes de nationalité des données (trois lettres).
 */
export const TAILLE_MARCHE: Record<string, number> = {
  USA: 1, GBR: 0.9, DEU: 0.85, JPN: 0.8, CHN: 0.9, FRA: 0.75, ITA: 0.75, ESP: 0.7, BRA: 0.75, MEX: 0.7, NLD: 0.6, NED: 0.6,
  AUS: 0.6, CAN: 0.6, IND: 0.7, SAU: 0.65, ARE: 0.55, BEL: 0.45, AUT: 0.45, CHE: 0.5, MON: 0.35, MCO: 0.35, FIN: 0.35, DNK: 0.35,
  SWE: 0.4, ARG: 0.55, NZL: 0.35, THA: 0.45, POL: 0.45,
};
export const TAILLE_MARCHE_DEFAUT = 0.3;

/**
 * Valeur commerciale (M€/an) = base × (popularité internationale/100 + poidsNational × popularité nationale/100 × taille du marché × rareté) ;
 * rareté = 1 / (1 + nombre d'autres titulaires de F1 de la même nationalité).
 */
export const VALEUR_COMMERCIALE = { baseMEUR: 25, poidsNational: 0.8 };

/**
 * Sponsors personnels : chaque début d'année, un pilote titulaire de valeur commerciale ≥ seuilMEUR (ou dont la famille finance la carrière,
 * budget ≥ seuilFamilleMEUR) peut attirer un sponsor de sa nationalité. Montant = part × valeur (ou budget familial × partFamille).
 * Accompagnant : contrat à l'écurie, conditionné à sa présence, dans un emplacement libre (jamais en plus). Sinon : il paie le pilote lui-même.
 */
export const SPONSORS_PERSONNELS = { seuilMEUR: 4, part: 0.5, seuilFamilleMEUR: 3, partFamille: 1, probabilite: 0.5, dureeAns: 2 };

/**
 * Pilotes payants : apport commercial d'un candidat (sponsors qui le suivent, ou budget familial pour un débutant) ajouté au score de
 * recrutement, rapporté à la référence de coût du poste (même échelle que le coût salarial). Aucune règle n'oppose talent et argent (D-099).
 */
export const PILOTES_PAYANTS = { poids: 0.4 };

/** Attrait d'une écurie pour les sponsors (D-096) : popularité internationale de son pilote le plus populaire, jeune espoir (≤ ageJeune). */
export const ATTRAIT_PILOTES = { popularite: 0.12, jeuneEspoir: 0.05, ageJeune: 23, reputationJeune: 50 };

/**
 * Agents (D-117 §15.3) : pour les pilotes de F1 et d'Apex 2, et le personnel de haut niveau (niveau ≥ niveauPersonnel).
 * - clientsMax par agent ; nombre d'agents générés au départ ;
 * - commission négociée entre min et max : plus faible pour un client de grande valeur, plus forte avec un agent bon négociateur ;
 * - surenchere : hausse des demandes en contre-offre (× négociation/20) ; partCommissionRessentie : part de la commission ressentie
 *   par le client dans l'utilité d'un salaire ; pousseeTransfert : bonus d'utilité pour une offre extérieure (× ambition/20) ;
 * - demarchages : propositions de clients par agent et par fenêtre (× réseau/20, au moins 1).
 */
export const AGENTS = {
  nombre: 20, clientsMax: 10, niveauPersonnel: 15,
  commissionMin: 0.05, commissionMax: 0.2, surenchere: 0.15, partCommissionRessentie: 0.5, pousseeTransfert: 0.06, demarchages: 3,
  semaine: 2, semaineDemarchage: 28,
};

/**
 * Audit de la phase 7 (priorité 3) — entreprises créées pour un pilote (familiale ou nationale) :
 * au plus `maximum` actives en même temps dans le monde ; budget = valeur commerciale (ou budget familial) × multipleBudget ;
 * le montant engagé ne dépasse jamais partMaxBudget de leur budget ; elles cessent quand leur pilote n'est plus titulaire depuis
 * plus de `anneesSansPilote` saisons (ou à sa retraite). Les sponsors du vivier engagés auprès d'un pilote respectent aussi partMaxBudget.
 */
export const ENTREPRISES_LIEES = { maximum: 15, multipleBudget: 2, partMaxBudget: 0.5, anneesSansPilote: 1 };
