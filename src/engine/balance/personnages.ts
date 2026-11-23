/**
 * Paramètres des personnages (docs/systemes/personnalite.md).
 *
 * ATTENTION : les listes de traits et de valeurs sont PROVISOIRES (D-025, D-026, à finaliser
 * avec le porteur et ChatGPT). Elles sont rangées ici pour pouvoir être changées sans toucher au reste.
 * Échelle : notes entières de 1 à 20 (D-027).
 */

/** Couche 1 — les 9 traits proposés. Clé technique → libellé. */
export const TRAITS = {
  ambition: 'Ambition',
  loyaute: 'Loyauté',
  rancune: 'Rancune',
  besoinReconnaissance: 'Besoin de reconnaissance',
  temperament: 'Tempérament',
  discretion: 'Discrétion',
  professionnalisme: 'Professionnalisme',
  sangFroid: 'Sang-froid',
  sociabilite: 'Sociabilité',
  // D-054 (phase 4)
  risque: 'Propension au risque',
  remiseEnQuestion: 'Remise en question',
  // D-105 (phase 6a complémentaire)
  resilience: 'Résilience',
} as const;

/** Couche 2 — les 7 valeurs proposées. */
export const VALEURS = {
  argent: 'Argent',
  victoire: 'Victoire',
  fidelite: 'Fidélité',
  stabilite: 'Stabilité',
  defi: 'Défi',
  equite: 'Équité',
  racines: 'Racines',
} as const;

/** Une valeur à ce niveau ou plus devient une conviction (ligne rouge). */
export const SEUIL_CONVICTION = 17;

/** Tirage des traits et valeurs : loi normale bornée à [1, 20]. */
export const TIRAGE_TRAITS = { moyenne: 10.5, ecartType: 3.5 };
export const TIRAGE_VALEURS = { moyenne: 10, ecartType: 4 };

/**
 * Ajustements de tirage par poste (en points, ajoutés à la moyenne).
 * Exemple : un pilote titulaire est en moyenne plus ambitieux. Volontairement modestes.
 */
export const BIAIS_TRAITS_PAR_POSTE: Partial<Record<string, Partial<Record<keyof typeof TRAITS, number>>>> = {
  pilote_titulaire: { ambition: 3, sangFroid: 1.5 },
  pilote_junior: { ambition: 3 },
  team_principal: { sangFroid: 2, professionnalisme: 1.5 },
  directeur_financier: { professionnalisme: 2, temperament: -1.5 },
};

/** Compétences transversales communes à tous (couche 3). */
export const COMPETENCES_TRANSVERSALES = ['leadership', 'communication', 'adaptabilite', 'gestionHumaine'] as const;

/** Compétences propres aux pilotes (colonnes du fichier personnes.csv). */
export const COMPETENCES_PILOTE = [
  // D-104 : « vitesse » supprimée ; le rythme résulte de ces quatre compétences face aux exigences de chaque circuit.
  'freinage',
  'viragesLents',
  'viragesRapides',
  'motricite',
  'depassement',
  'defense',
  'departs',
  'pluie',
  'gestionPneus',
  'retourTechnique',
  'condition',
  'regularite',
  'intelligenceCourse',
] as const;
/** Les quatre compétences de « rythme » (D-104). */
export const COMPETENCES_RYTHME = ['freinage', 'viragesLents', 'viragesRapides', 'motricite'] as const;

/** Compétences métier des autres postes. */
export const COMPETENCES_PAR_POSTE: Record<string, readonly string[]> = {
  team_principal: ['negociation', 'politique', 'relationConseil'],
  directeur_technique: ['visionTechnique', 'gestionProjet', 'aerodynamique', 'conception', 'innovation'],
  directeur_sportif: ['organisationStands', 'strategie', 'reglement', 'gestionPilotes'],
  directeur_financier: ['gestionBudgetaire', 'negociation', 'maitrisePlafond'],
  responsable_aero: ['aerodynamique', 'rigueur', 'innovation', 'correlation'],
  responsable_conception: ['conception', 'rigueur', 'innovation', 'correlation'],
  // Phase 8d : lues par l'encadrement de l'équipe des stands (organisation) et l'entraînement à la précision (rigueur).
  chef_stands: ['organisationStands', 'rigueur'],
  ingenieur: ['specialite', 'rigueur', 'innovation'],
};

/**
 * Niveau moyen tiré pour les compétences d'un dirigeant ou d'un ingénieur généré :
 * base + facteur × (prestige de l'écurie − 10), puis aléa.
 */
export const NIVEAU_PERSONNEL_GENERE = { base: 12, facteurPrestige: 0.35, ecartType: 2.2 };

/**
 * Courbes d'âge par métier (D-051), en années.
 * - progressionJusqua : âge jusqu'auquel la personne peut encore nettement progresser ;
 * - declinApres : âge à partir duquel les compétences déclinent (phase 6).
 * La marge de potentiel d'une personne générée = (années de progression restantes) × margeParAnnee,
 * plafonnée à margeMax.
 */
export const COURBES_AGE: Record<string, { progressionJusqua: number; declinApres: number; margeParAnnee: number; margeMax: number }> = {
  pilote: { progressionJusqua: 28, declinApres: 34, margeParAnnee: 0.6, margeMax: 5 },
  team_principal: { progressionJusqua: 55, declinApres: 68, margeParAnnee: 0.25, margeMax: 4 },
  directeur_technique: { progressionJusqua: 52, declinApres: 64, margeParAnnee: 0.25, margeMax: 4 },
  directeur_sportif: { progressionJusqua: 50, declinApres: 63, margeParAnnee: 0.25, margeMax: 4 },
  directeur_financier: { progressionJusqua: 50, declinApres: 65, margeParAnnee: 0.2, margeMax: 3 },
  responsable_aero: { progressionJusqua: 48, declinApres: 62, margeParAnnee: 0.3, margeMax: 4 },
  responsable_conception: { progressionJusqua: 48, declinApres: 62, margeParAnnee: 0.3, margeMax: 4 },
  chef_stands: { progressionJusqua: 45, declinApres: 58, margeParAnnee: 0.3, margeMax: 4 },
  ingenieur: { progressionJusqua: 45, declinApres: 60, margeParAnnee: 0.3, margeMax: 4 },
};

/** Courbe d'âge d'un poste (les pilotes de tous types partagent la courbe « pilote »). */
export function courbeAge(poste: string) {
  return COURBES_AGE[poste.startsWith('pilote') ? 'pilote' : poste] ?? COURBES_AGE['ingenieur']!;
}

/**
 * Niveau moyen et dispersion des pilotes titulaires GÉNÉRÉS (réservoir et remplacements, D-066).
 * Provisoire avant les filières juniors (phase 6b) : un pilote qui arrive en F1 a le niveau d'un bon pilote
 * de catégorie inférieure, pas celui d'un ingénieur générique.
 */
export const NIVEAU_PILOTE_TITULAIRE_GENERE = { moyenne: 14.2, ecartType: 1.1 };

/** Âges tirés pour les personnes générées, par poste (années). */
export const AGES_PAR_POSTE: Record<string, { min: number; max: number }> = {
  team_principal: { min: 42, max: 64 },
  directeur_technique: { min: 40, max: 62 },
  directeur_sportif: { min: 38, max: 60 },
  directeur_financier: { min: 38, max: 60 },
  responsable_aero: { min: 34, max: 55 },
  responsable_conception: { min: 34, max: 55 },
  chef_stands: { min: 32, max: 55 },
  pilote_titulaire: { min: 21, max: 29 },
  pilote_reserve: { min: 20, max: 28 },
  pilote_junior: { min: 16, max: 22 },
  ingenieur: { min: 26, max: 55 },
};

/** Aspirations possibles (couche 4), avec les postes concernés. */
export const ASPIRATIONS: { type: string; postes: readonly string[]; libelle: string }[] = [
  { type: 'devenir_titulaire', postes: ['pilote_reserve', 'pilote_junior'], libelle: 'Devenir pilote titulaire' },
  { type: 'etre_champion', postes: ['pilote_titulaire'], libelle: 'Devenir champion' },
  { type: 'ecurie_prestigieuse', postes: ['pilote_titulaire', 'directeur_technique', 'responsable_aero', 'responsable_conception'], libelle: 'Travailler pour une écurie prestigieuse' },
  { type: 'diriger_ecurie', postes: ['directeur_technique', 'directeur_sportif', 'directeur_financier'], libelle: 'Diriger une écurie' },
  { type: 'finir_ecurie_formatrice', postes: ['pilote_titulaire'], libelle: 'Finir sa carrière dans son écurie formatrice' },
  { type: 'transmettre', postes: ['team_principal', 'directeur_technique', 'directeur_sportif'], libelle: 'Transmettre, former des jeunes' },
  { type: 'batir_un_projet', postes: ['team_principal', 'directeur_technique'], libelle: 'Bâtir un projet gagnant' },
];

/** État émotionnel de départ (0 à 100) et dispersion. */
export const ETAT_DEPART = { moyenne: 65, ecartType: 10 };

/**
 * Résilience (D-105, trait 1–20) : vitesse à laquelle le moral et la confiance remontent vers leur cible
 * (inertie × (min + amplitude × résilience / 20)) et résistance quand ils chutent (inertie × (min + amplitude × (1 − résilience / 20))).
 */
export const RESILIENCE_ETAT = { min: 0.6, amplitude: 0.8 };

