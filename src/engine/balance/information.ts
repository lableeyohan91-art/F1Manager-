/**
 * Phase 8c — qui sait quoi : fuites, rumeurs, réputation perçue (docs/systemes/phase-8c-qui-sait-quoi.md).
 * Valeurs PROVISOIRES (D-120).
 */

/** Événements privés suivis et leur intérêt (0 à 1) : plus un fait intéresse, plus il circule et plus la presse s'en empare. */
export const FAITS_DIFFUSABLES: Record<string, number> = {
  'promesse.rompue': 1,
  'recherche.decouverte': 1,
  'contrat.licenciement': 0.8,
  'finances.tension': 0.8,
  'marche.offre': 0.7, // seulement pour un débauchage (voir `offreSuivie`)
  'personnel.critique': 0.6,
  'finances.coupe_budget': 0.6,
  'finances.emprunt': 0.5,
  'marche.candidature': 0.5,
  'promesse.tenue': 0.4,
  'negociation.refus': 0.4,
  'personnel.soutien': 0.3,
  'augmentation.demandee': 0.3,
};

/**
 * Diffusion :
 * - tauxBase : probabilité hebdomadaire qu'une personne parle d'un fait d'intérêt 1, à discrétion moyenne ;
 * - discretion : facteur = max − discrétion / 20 (de 1,5 pour une personne très bavarde à 0,5 pour une très discrète) ;
 * - connaisseursMax : au-delà, le fait devient public (volume borné) ; faitsMax : faits suivis à la fois ;
 * - dureeDiffusion : semaines pendant lesquelles un fait circule encore ;
 * - familiariteMin : familiarité minimale pour qu'une relation serve de canal.
 */
export const DIFFUSION = { tauxBase: 0.05, discretionMax: 1.5, connaisseursMax: 25, faitsMax: 300, dureeDiffusion: 26, familiariteMin: 0.05 };

/**
 * Rumeurs : probabilité de déformation = base + manqueProfessionnalisme × (1 − professionnalisme / 20) ;
 * amplification : poids d'une rumeur (exagérée) par rapport au fait exact ;
 * croyance = croyanceBase + croyanceConfiance × confiance envers la source (bornée entre 0 et 1).
 */
export const RUMEURS = { base: 0.1, manqueProfessionnalisme: 0.2, amplification: 1.5, croyanceBase: 0.5, croyanceConfiance: 0.5 };

/** Révélation par la presse : probabilité hebdomadaire = base × intérêt × (connaisseurs / connaisseursMax). Importance de l'événement selon l'intérêt. */
export const REVELATION = { base: 0.08, seuilImportanceNotable: 0.8 };

/**
 * Avant-projets de règlement (lien 8b) :
 * - semaineAvantProjet : semaine où la fédération prépare ses réformes (publication en semaine 12) ;
 * - base : probabilité hebdomadaire qu'une écurie en ait vent, × (politique du TP / 20) × (prestigeBase + prestige / 20) ;
 * - bruitIntensite : écart type de la perception de chaque intensité avant publication.
 */
export const FUITES_REGLEMENT = { semaineAvantProjet: 2, base: 0.12, prestigeBase: 0.5, bruitIntensite: 0.2 };
