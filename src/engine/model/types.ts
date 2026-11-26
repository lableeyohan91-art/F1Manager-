/**
 * Types des entités du monde (voir docs/systemes/entites.md et personnalite.md).
 * Les entités sont rangées dans les tables du monde ; ces types décrivent leur contenu.
 */

import type { DateJeu } from '../core/calendrier';

/** Noms des tables du monde. */
export const TABLES = {
  ecuries: 'ecuries',
  motoristes: 'motoristes',
  personnes: 'personnes',
  contrats: 'contrats',
  carrieres: 'carrieres',
  palmares: 'palmares',
  circuits: 'circuits',
  departements: 'departements',
  installations: 'installations',
  voitures: 'voitures',
  finances: 'finances',
  proprietaires: 'proprietaires',
  sponsors: 'sponsors',
  contratsSponsoring: 'contratsSponsoring',
  conjoncture: 'conjoncture',
  ecuriesJuniors: 'ecuriesJuniors',
  saisonsJuniors: 'saisonsJuniors',
  academies: 'academies',
  missionsReperage: 'missionsReperage',
  connaissances: 'connaissances',
  offres: 'offres',
  candidatures: 'candidatures',
  agents: 'agents',
  reglements: 'reglements',
  evolutionsMineures: 'evolutionsMineures',
  savoirs: 'savoirs',
  programmes: 'programmes',
  historiqueRecherche: 'historiqueRecherche',
  decouvertes: 'decouvertes',
  // Phase 8c
  faitsSuivis: 'faitsSuivis',
  information: 'information',
  // Phase 8d
  equipesStands: 'equipesStands',
  groupes: 'groupes',
  federation: 'federation',
  alliances: 'alliances',
  archives: 'archives',
  // Phase 11
  medias: 'medias',
  articles: 'articles',
  conferences: 'conferences',
  records: 'records',
  etatMedias: 'etatMedias',
  // Phase 11c
  offresSponsors: 'offresSponsors',
  objectifsGP: 'objectifsGP',
  operationsSponsors: 'operationsSponsors',
  // Phase 12a : pièces des voitures (versions) et projets de conception.
  pieces: 'pieces',
  projetsConception: 'projetsConception',
  dilemmesTechniques: 'dilemmesTechniques',
  saisons: 'saisons',
  grandsPrix: 'grandsprix',
} as const;

/** Note de 1 à 20 (D-027). */
export type Note = number;

export type Poste =
  | 'team_principal'
  | 'directeur_technique'
  | 'directeur_sportif'
  | 'directeur_financier'
  | 'responsable_aero'
  | 'responsable_conception'
  /** Phase 8d (D-129) : chef d'équipe des stands, sous l'autorité du directeur sportif. */
  | 'chef_stands'
  | 'pilote_titulaire'
  | 'pilote_reserve'
  | 'pilote_junior'
  | 'ingenieur'
  | 'ancien_pilote';

export interface Motoriste {
  id: string;
  nom: string;
  nationalite: string;
  niveau: Note;
  verification: string;
  /** Phase 12b : évolutions ADUO encore dues la saison suivante (motoriste très en retard). */
  aduoReport?: number;
}

export interface Ecurie {
  id: string;
  nom: string;
  nomCourt: string;
  nationalite: string;
  anneeCreationLignee: number;
  anneeNomActuel: number;
  motoriste: string;
  niveauVoiture: Note;
  budgetMEUR: number;
  prestige: Note;
  popularite: Note;
  pressionMediatique: Note;
  toleranceConseil: Note;
  culture: string;
  philosophieTechnique: string;
  politiqueRecrutement: string;
  titresConstructeurs: number;
  titresPilotes: number;
  verification: string;
  statut: 'active' | 'inactive';
  typeOrganisation: TypeOrganisation;
  /** Écurie pilotée par le joueur (bac à sable) : l'IA ne prend pas ses décisions de personnel à sa place. */
  pilotee?: boolean;
  /** Écurie « sœur » en F1 (lien réel conservé, D-112) : placement et promotion des affiliés de l'académie. */
  ecuriePartenaire?: string;
  /** Phase 7a : réputation de prédatrice (débauchages récents, s'efface avec le temps). Lue par l'utilité des offres et l'indemnité exigée. */
  reputationPredateur?: number;
  /** Phase 8b (D-132, question 9) : le joueur confie ses programmes de recherche à son directeur technique (décisions de l'IA). */
  delegationRecherche?: boolean;
  /** Phase 10 : domaines que le joueur confie à son équipe (règles de l'IA). Absent = le joueur décide (défauts inscrits à la prise de fonction). */
  delegations?: Partial<Record<'pilotes' | 'personnel' | 'academie' | 'politique' | 'stands' | 'communication' | 'commercial', boolean>>;
  /** Phase 11 : image publique de l'écurie (−100 à 100, absente = 0). Lue par les sponsors, le conseil et les candidats. */
  image?: number;
  /** Phase 11 : objectif annoncé en conférence de presse pour une saison (« viser le titre » relève l'exigence du conseil). */
  objectifAnnonce?: { annee: number; niveau: 'titre' | 'prudent' };
  /** Phase 12a : famille d'architecture choisie pour chaque règlement (pari de concept, D-170 Q7). */
  architectures?: Record<string, string>;
  /** Phase 12b : part des heures de soufflerie et de CFD réservée à la recherche (le reste va aux projets de pièces). */
  souffleriePartRecherche?: number;
  /** Phase 12b : heures effectives de soufflerie consacrées à la recherche depuis le dernier avancement des programmes. */
  heuresRecherche?: number;
}

/** Couche 1 — personnalité : traits cachés (liste provisoire, D-025). */
export type Traits = Record<string, Note>;
/** Couche 2 — valeurs : poids cachés (liste provisoire, D-026). Une valeur ≥ seuil est une conviction. */
export type Valeurs = Record<string, Note>;
/** Couche 3 — compétences : notes par compétence (métier + transversales). */
export type Competences = Record<string, Note>;

export interface Aspiration {
  type: string;
  /** Horizon visé, en années de jeu. */
  horizon: number;
}

/** Couche 5 — état émotionnel, de 0 à 100 (calculé, jamais saisi). */
export interface EtatEmotionnel {
  moral: number;
  stress: number;
  motivation: number;
  confiance: number;
}

export interface Personne {
  id: string;
  /** Phase 10 : le manager incarné par le joueur (ses décisions ne sont jamais prises par l'IA). */
  joueur?: boolean;
  /** Audit des phases 10–11 : dernier départ d'une écurie (hors échéance normale), lu par le refus d'y revenir aussitôt. */
  dernierDepart?: { organisation: string; annee: number; motif: string };
  /** Phase 11 : image publique (−100 à 100, absente = 0). Lue par la valeur commerciale et les candidats (via l'écurie). */
  image?: number;
  /** Phase 11 : exposition médiatique récente (0 à 100, s'efface). Lue par la popularité. */
  exposition?: number;
  /** Phase 7b : en période de non-concurrence jusqu'à cette date (incluse) : ne contribue pas au développement de sa nouvelle écurie. */
  nonConcurrenceJusqua?: { annee: number; semaine: number };
  /** D-140 : écurie où la personne a déjà dit avoir besoin d'un nouveau défi (signal précurseur donné une fois par séjour). */
  nouveauDefiDemande?: string;
  /** Jalon A : dernier fait qui explique qu'elle veuille partir (cause citée par la suite : demande, démission, signature ailleurs). */
  dernierFaitDepart?: string;
  /** Phase 7c : popularité (0–100), nationale et internationale ; lue par la valeur commerciale, les sponsors et l'attrait des sponsors. */
  popularite?: { nationale: number; internationale: number };
  /** Phase 7c : agent (table « agents ») et commission négociée (fraction du salaire). Lus par la négociation et les offres. */
  agent?: string;
  commission?: number;
  /** Phase 7c : sponsor personnel qui paie le pilote lui-même (M€/an, jusqu'à une année) ; lu par l'utilité des offres. */
  sponsorPersonnel?: { sponsor: string; montantMEUR: number; jusqua: number };
  /** D-131 : engagement d'un partenaire réel, conditionné à l'arrivée en F1 (converti en sponsor accompagnant, ou personnel à défaut de place). */
  engagementF1?: { sponsor: string; montantMEUR: number; jusqua: number };
  prenom: string;
  nom: string;
  nationalite: string;
  /** Date de naissance AAAA-MM-JJ, ou année seule si inconnue. */
  dateNaissance: string;
  anneeNaissance: number;
  poste: Poste;
  /** Écurie actuelle (vide si libre ou retraité). */
  ecurie: string;
  statut: 'actif' | 'libre' | 'retraite';
  /** D'où vient la personne : fichier de données (inspirée du réel) ou générée. */
  origine: 'donnees' | 'generee';
  traits: Traits;
  valeurs: Valeurs;
  competences: Competences;
  potentiel: Note;
  aspirations: Aspiration[];
  etat: EtatEmotionnel;
  verification: string;
  /** Saison depuis laquelle la personne est libre (sans contrat d'emploi). */
  libreDepuis?: number;
  /** Apparence (D-080) : graine visuelle persistante, sans effet sur la simulation. */
  apparence?: { graine: number };
  /** Phase 6a — cycle de vie (caché). Lu par la progression (§4) et la retraite (§7). */
  carriere?: CarrierePersonne;
  /** Année de retraite (retours possibles, D-072). */
  retraiteDepuis?: number;
  /** D-167 : saison à la fin de laquelle le pilote a annoncé qu'il arrête (annonce faite avant le marché). */
  retraiteAnnoncee?: number;
  /** Phase 6b : baquet junior de la saison en cours (la personne reste « libre » au sens de la F1, donc recrutable). */
  junior?: { categorie: 'apex3' | 'apex2'; ecurie: string; annee: number; prixMEUR?: number; subventionne?: boolean };
  /** Phase 6b : réputation sportive (0–100) — classements karting et Apex 4, résultats Apex 3 et Apex 2. */
  reputationJeune?: number;
  /** Phase 6b : budget familial annuel (M€), tiré une fois. Lu par le marché des baquets. */
  budgetFamilleMEUR?: number;
  /** Phase 6b-2 : mécène (montant annuel, dernière année de soutien). Lu par le marché des baquets. */
  mecene?: { montantMEUR: number; jusqua: number };
}

/** Académie d'une écurie de F1 (phase 6b-2). */
export interface Academie {
  id: string; ecurie: string; places: number; reputation: number;
  /** Audit 6b n°2 : capacité visée par le team principal (commande « academie.capacite ») ; absente = le plafond permis par les moyens. */
  placesVisees?: number;
  /** Anciens affiliés (liste bornée), lue par la réputation de l'académie ; les vieux contrats d'affiliation sont effacés. */
  anciens?: string[];
}
/** Mission de repérage en cours (commande commune au joueur et à l'IA). */
export interface MissionReperage { id: string; ecurie: string; personne: string; finAnnee: number; finSemaine: number }
/**
 * Connaissance qu'une écurie a d'une personne (audit 6b) : acquise progressivement pendant une mission de repérage,
 * puis oubliée progressivement (obsolescence). 0 à 1. Lue par l'estimation du potentiel.
 */
export interface Connaissance { id: string; ecurie: string; personne: string; niveau: number }

/** Écurie junior (phase 6b) : table séparée des écuries de F1. */
export interface EcurieJunior {
  id: string;
  nom: string;
  nationalite: string;
  categorie: 'apex3' | 'apex2';
  /** 1–20 : effet en course et encadrement des pilotes. */
  qualite: number;
  /** 0–100 : réputation de formatrice. */
  reputation: number;
  prixBaquetMEUR: number;
  /** Écurie de F1 partenaire (placement préférentiel, 6b-2). */
  partenaire?: string;
}

export interface ResultatJunior { pilote: string; ecurie: string; position: number | null; points: number }
export interface MancheJunior { manche: number; circuit: string; semaine: number; pluie: boolean; termine: boolean; resultats: ResultatJunior[] }
export interface SaisonJunior {
  id: string;
  categorie: 'apex3' | 'apex2';
  annee: number;
  manches: MancheJunior[];
  classement: { pilote: string; ecurie: string; points: number; victoires: number; podiums: number }[];
  classementEcuries: { ecurie: string; points: number }[];
  termine: boolean;
  champion?: string;
}

/** Résumé d'une saison junior dans la carrière d'un pilote (conservé toute la carrière, borné). */
export interface ResumeJunior { annee: number; categorie: string; ecurie: string; rang: number; points: number; victoires: number; titre: boolean }

/** Profil de carrière et compteurs (phase 6a, docs/systemes/phase-6a-cycle-de-vie.md §3, §10). */
export interface CarrierePersonne {
  archetype: string;
  /** Âges propres : début et fin du plateau d'apogée (années). */
  debutApogee: number;
  finApogee: number;
  /** Multiplicateurs propres (archétype × variation individuelle). */
  vitesseProgression: number;
  vitesseDeclin: number;
  /** Plafond propre par compétence = potentiel + écart (points forts / faibles). Lu par la progression. */
  ecarts: Record<string, number>;
  /** Expérience : saisons comme titulaire en F1, saisons d'activité. Lue par l'estimation, la retraite, l'abandon. */
  saisonsF1: number;
  saisonsActives: number;
  /** Meilleur niveau métier de la carrière. Lu par la retraite (déclin ressenti). */
  niveauMax: number;
  /** Déclic ou stagnation en cours : multiplicateur et périodes restantes. Lu par la progression. */
  phaseSpeciale?: { type: 'declic' | 'stagnation'; periodes: number };
  /** D-106 : expérience réelle (pilotes). Lue par la progression, les handicaps de nouveauté, la pluie, la pression. */
  experience?: ExperiencePilote;
  /** D-108 : affinités non neutres par circuit (−2 à +2). Lues par le niveau effectif en course. */
  affinites?: Record<string, number>;
  /** Phase 6b : résumés des saisons juniors (lus par l'estimation et le recrutement). */
  juniors?: ResumeJunior[];
}

export interface ExperiencePilote {
  gp: number;
  pluie: number;
  luttesTitre: number;
  /** Courses disputées par circuit. */
  circuits: Record<string, number>;
  /** Écurie actuelle et Grands Prix disputés avec elle (handicap de nouvelle écurie). */
  ecurie: string;
  gpEcurie: number;
  /** Phase 6b : courses juniors disputées (comptent à moitié pour le facteur d'expérience). */
  gpJuniors?: number;
}

/**
 * Types de contrats (phase 4, prévus pour la phase 6 — D-063) :
 * emploi = poste dans une organisation ; affiliation / financement / placement = réservés aux filières juniors.
 * Une personne peut avoir plusieurs contrats actifs simultanés, de types différents.
 */
export type TypeContrat = 'emploi' | 'affiliation' | 'financement' | 'placement';

/** Clauses structurées (les champs « réservés » ne sont lus qu'à partir de la phase 6 ou 7). */
export interface Clauses {
  /** Statut de pilote n°1. */
  statutN1?: boolean;
  /** Indemnité due en cas de licenciement, en M€. */
  indemniteRuptureMEUR?: number;
  /** Prime par victoire, en M€. */
  primeVictoireMEUR?: number;
  /** Réservé (phase 6/7) : option prioritaire de l'académie, montant de rachat, financement annuel, organisation de placement. */
  optionPrioritaire?: boolean;
  rachatMEUR?: number;
  financementAnnuelMEUR?: number;
  placementOrganisation?: string;
  /** Remarque libre (données). */
  note?: string;
}

/** Phase 8d-2 : rupture négociée à l'initiative de l'employeur ou de la personne. */
export type MotifFinContrat = 'echeance' | 'non_prolonge' | 'licenciement' | 'demission' | 'rachat' | 'rupture_employeur' | 'rupture_personne';

export interface Contrat {
  id: string;
  personne: string;
  /** Organisation partie au contrat : écurie (phase 4) ; plus tard écurie junior, académie, sponsor personnel. */
  organisation: string;
  type: TypeContrat;
  poste: Poste;
  debut: number;
  fin: number;
  salaireMEUR: number;
  clauses: Clauses;
  /** Phase 7a : « signe » = contrat conclu pendant la fenêtre, qui ne prend effet qu'à son début (pré-accord). */
  statut: 'actif' | 'termine' | 'rompu' | 'signe';
  motifFin?: MotifFinContrat;
  /** L'organisation a décidé de ne pas prolonger : le contrat prendra fin à son échéance. */
  nonProlonge?: boolean;
  /** Demande d'augmentation en attente de réponse (salaire demandé, M€). */
  demandeAugmentation?: number;
  /** Audit 4.5 : date de la demande d'augmentation (délai de réponse). */
  demandeAugmentationDepuis?: DateJeu;
  /** Audit n°4 : indemnité de rupture effectivement versée (M€), une seule fois. */
  indemniteVerseeMEUR?: number;
  /** Phase 7b : personne que ce contrat signé remplace (son contrat sera rompu, avec indemnité, à la prise d'effet). */
  remplace?: string;
  /** Phase 7b : période de non-concurrence (semaines) à servir au début du contrat, après un débauchage de personnel technique. */
  nonConcurrenceSemaines?: number;
  /** Phase 8d-2 : demande de départ à l'amiable (indemnité demandée, date ; refusée = en attente d'une éventuelle démission). */
  demandeDepart?: { indemnite: number; depuis: { annee: number; semaine: number }; refusee?: boolean; evenement?: string; refus?: string };
  /** Jalon A : fait qui explique la fin prochaine de ce contrat (décision de ne pas prolonger), cité par la fin du contrat. */
  causeFin?: string;
  /** Phase 8d-2 : saison où l'employeur de l'IA a déjà proposé une rupture négociée (une fois par saison). */
  ruptureProposee?: number;
  verification: string;
}

/** Types d'organisation (D-063) : seules les écuries existent en phase 4, les autres sont réservés. */
export type TypeOrganisation = 'ecurie' | 'motoriste' | 'instance' | 'ecurie_junior' | 'academie' | 'championnat' | 'sponsor';

export interface Carriere {
  id: string;
  personne: string;
  ecurieLignee: string;
  nomHistorique: string;
  poste: Poste;
  de: number;
  a: number;
  /** Audit phase 9 : mois d'arrivée la première année (1 à 12) ; absent = janvier. Transferts en cours de saison. */
  moisDe?: number;
  /** Audit phase 9 : mois de départ la dernière année (1 à 12) ; absent = décembre. */
  moisA?: number;
  note: string;
}

export interface Palmares {
  id: string;
  saison: number;
  championPilote: string;
  ecurieChampionPilote: string;
  championConstructeurs: string;
  note: string;
}

export interface Circuit {
  id: string;
  nom: string;
  ville: string;
  pays: string;
  type: 'rapide' | 'lent et sinueux' | 'mixte' | 'urbain' | 'altitude';
  altitudeM: number;
  climatPluie: 'très faible' | 'faible' | 'moyen' | 'élevé';
  /** D-107 : exigences propres au circuit (1–5). Lues par le modèle de course (pilote, voiture, incidents). */
  exigences: ExigencesCircuit;
  verification: string;
  /** Rang dans le calendrier (ordre du fichier circuits.csv). */
  ordre?: number;
  /**
   * Phase 11b (expérience, non utilisée par défaut) : poids des caractéristiques de la voiture calculés par le profil de vitesse sur le
   * tracé réel (data/circuits/poids-voiture-profil.json). Présents seulement quand une campagne les injecte ; sinon, poids D-107.
   */
  poidsProfil?: Record<string, number>;
  /**
   * Phase 11b : place dans le vivier des circuits (lue par la création du calendrier, D-145). Absente des parties antérieures au
   * format 29 : elles gardent l'ancien calendrier (les N premiers circuits du fichier).
   */
  vivier?: VivierCircuit;
  /** Phase 11b : probabilité de pluie pendant la course pour chaque mois (12 valeurs, climat réel ; lue par la simulation du Grand Prix). */
  pluieMensuelle?: number[];
  /** Phase 12a : température de l'air pendant la course pour chaque mois (12 valeurs, °C ; lue par le besoin de refroidissement). */
  temperatureMensuelle?: number[];
  /**
   * Phase 12a : sensibilités du temps au tour aux paramètres physiques de la voiture (profil de vitesse sur le tracé réel,
   * data/grille-2026/sensibilites-circuits.csv) : temps de la voiture de référence et dérivées première et seconde (s par %).
   * Le niveau d'ailerons interne n'est jamais montré au joueur (D-161).
   */
  sensibilites?: { tempsS: number; niveauAileron: number; d1: Record<string, number>; d2: Record<string, number> };
}

export interface VivierCircuit {
  /** Permanent : au calendrier chaque saison. Rotation : partage les places restantes selon la règle connue de tous. */
  statut: 'permanent' | 'rotation';
  /** Dernière saison couverte par le contrat en cours (rotation) ; null : aucun contrat. */
  finContrat: number | null;
  /** Jour de l'année habituel du Grand Prix (ordre du calendrier). */
  jourHabituel: number;
  /** Dernière saison où le circuit a accueilli un Grand Prix (réelle, puis simulée) ; null : jamais. */
  derniereEdition: number | null;
}

export interface ExigencesCircuit {
  lents: number;
  rapides: number;
  freinage: number;
  motricite: number;
  lignesDroites: number;
  degradationPneus: number;
  exigencePhysique: number;
  difficulte: number;
  risqueAccident: number;
}
export const CHAMPS_EXIGENCES = ['lents', 'rapides', 'freinage', 'motricite', 'lignesDroites', 'degradationPneus', 'exigencePhysique', 'difficulte', 'risqueAccident'] as const;

export type TypeDepartement =
  | 'aero'
  | 'conception'
  | 'production'
  | 'simulation'
  | 'fiabilite'
  | 'stands'
  | 'strategie'
  | 'recrutement'
  | 'marketing'
  | 'logistique';

export interface Departement {
  id: string;
  ecurie: string;
  type: TypeDepartement;
  effectif: number;
  niveauMoyen: Note;
  cohesion: Note;
  responsable: string;
  /** Phase 12b : fatigue du pôle (0 à 100 ; seuls les pôles aéro et conception) et semaine (rang) de sa dernière alerte. */
  fatigue?: number;
  derniereAlerte?: number;
  /** D-181 : cohésion habituelle (vers laquelle la cohésion remonte ; l'effet sur la productivité est l'écart à cette valeur). */
  cohesionHabituelle?: number;
  /** D-181 : variation d'effectif décidée, effective à une date (recrues qui arrivent, ou départs après préavis), niveau des recrues. */
  mouvement?: { nombre: number; niveau: number; effet: { annee: number; semaine: number } };
  /** D-181 : rang de semaine du dernier recrutement (pas de licenciement juste après, sauf crise). */
  dernierRecrutement?: number;
}

export type TypeInstallation =
  | 'soufflerie'
  | 'cfd'
  | 'simulateur'
  | 'bureau_etudes'
  | 'usine'
  | 'centre_recherche'
  | 'centre_formation'
  | 'installations_personnel';

export interface Installation {
  id: string;
  ecurie: string;
  type: TypeInstallation;
  /** 1 à 10. */
  niveau: number;
  ageAnnees: number;
  /** État d'entretien, 0 à 100. */
  etat: number;
}

export interface DateNaissanceInfo {
  date: DateJeu;
}

/** Caractéristiques d'une monoplace (D-056), décimales en interne, échelle ≈ 1–20. */
/** Ligne de voitures.csv : notes de départ (phase 3), converties en pièces à la création du monde (phase 12a). */
export interface VoitureDonnees {
  id: string;
  ecurie: string;
  viragesLents: number;
  viragesRapides: number;
  vitessePointe: number;
  efficaciteAero: number;
  fiabilite: number;
  gestionPneus: number;
  /** Phase 12c (D-175) : motricité en sortie de virage (1 à 20) ; lue par la conversion de départ (suspensions). Absente des anciennes données : virages lents. */
  motricite?: number;
  verification: string;
}

/**
 * Voiture d'une écurie dans le monde. Phase 12a : sa vitesse vient de ses PIÈCES (table `pieces`) et du motoriste, à travers les
 * sensibilités physiques des circuits. Restent ici, provisoirement, deux notes que le profil de vitesse ne couvre pas encore :
 * la fiabilité (abandons ; la durabilité des pièces la remplacera en 12c) et la gestion des pneus (la phase 13 la remplacera).
 */
export interface Voiture {
  id: string;
  ecurie: string;
  fiabilite: number;
  gestionPneus: number;
  verification: string;
}

/**
 * Phase 12a : une version de pièce d'une écurie (D-170). Les paramètres physiques de la voiture sont la référence modifiée par ses
 * pièces installées : efficacité (au-dessus ou en dessous de la référence) et concept (−1 à +1, point choisi sur la frontière).
 */
export interface PieceVoiture {
  id: string;
  ecurie: string;
  type: string;
  /** Numéro de version (1, 2, …) propre à l'écurie et au type de pièce. */
  version: number;
  /** Efficacité (points) ; la voiture de référence a toutes ses pièces à EFFICACITE_REFERENCE. */
  efficacite: number;
  /** Concept, de −1 à +1 (sens donné par les libellés de la pièce, balance/monoplaces.ts). */
  concept: number;
  /** Règlement sous lequel la pièce a été conçue (obsolescence lors d'une réforme). */
  reglement: string;
  /** Saison de conception. */
  saison: number;
  installee: boolean;
  /** Phase 12b : défaut caché de durabilité (révélé en course) : la fiabilité de la voiture baisse tant qu'elle est montée. */
  fragile?: boolean;
}

/**
 * Phase 12b : dilemme technique présenté à une écurie (alerte d'un responsable ou événement de conception). La vérité est fixée à la
 * création ; les options changent les moyens engagés et ce qu'on capture de cette vérité, jamais la vérité elle-même.
 */
export interface DilemmeTechnique {
  id: string;
  ecurie: string;
  projet: string;
  /** 'alerte' (fatigue, défaut), ou famille d'événement de conception : 'piste', 'contradiction', 'materiau', 'reorientation'. */
  famille: string;
  options: string[];
  recommandation: string;
  /** Message du responsable (texte du jeu) et estimation qu'il donne (fourchette). */
  texte: string;
  verite: Record<string, number | string | boolean>;
  cree: DateJeu;
  echeance: DateJeu;
}

/** Phase 12a : projet de conception d'une nouvelle version de pièce (conception simplifiée : rythme normal, sans événement). */
export interface ProjetConception {
  id: string;
  ecurie: string;
  type: string;
  /** Concept visé (−1 à +1). */
  concept: number;
  /** Jours de conception restants (7 par semaine à productivité 1). */
  joursRestants: number;
  joursTotal: number;
  debut: DateJeu;
  /** Coût payé au lancement (M€), comme dans F1 Manager. */
  coutMEUR: number;
  /** Phase de fabrication (jours restants) une fois la conception terminée ; installation à la fin. */
  fabricationJoursRestants?: number;
  /** Efficacité obtenue (fixée à la fin de la conception). */
  efficacite?: number;
  /** Phase 12b : heures effectives de soufflerie et unités effectives de CFD consacrées au projet. */
  heures?: number;
  cfd?: number;
  /** Phase 12b : rythme de travail (normal par défaut). */
  rythme?: 'allege' | 'normal' | 'intensif';
  /** D-181 : projet prioritaire (reçoit plus d'ingénieurs du pôle). */
  prioritaire?: boolean;
  /** D-181 : essais renforcés (plus cher, résultat plus sûr). */
  essaisRenforces?: boolean;
  /** Phase 12b : incidents survenus ; défaut caché (inconnu de l'écurie tant qu'il n'est pas découvert) ; projet devenu inutilisable. */
  incidents?: number;
  defaut?: { type: 'performance' | 'fragile'; ampleur: number };
  echec?: boolean;
  /** Phase 12b : semaine (rang) de la dernière alerte du responsable sur ce projet. */
  derniereAlerte?: number;
  /** Phase 12b : événement de conception tiré au lancement (famille, moment en part de l'avancement), déjà présenté ou non. */
  evenementPrevu?: { famille: string; a: number; presente?: boolean };
  /** Phase 12b : effets des choix faits pendant le projet (part de valeur capturée, bonus ou malus d'efficacité, gain de masse). */
  bonusEfficacite?: number;
  /** Phase 12b : part du gain prévu réellement obtenue (prudence, erreur non détectée). */
  facteurGain?: number;
  evenement?: string;
}

export type CauseAbandon = 'mecanique' | 'incident';

export interface ResultatPilote {
  pilote: string;
  ecurie: string;
  /** Position à l'arrivée, ou null en cas d'abandon. */
  position: number | null;
  abandon: CauseAbandon | null;
  points: number;
  /** Écart avec le vainqueur, en % du temps au tour (null si abandon). */
  ecartPct: number | null;
  /** Rang de l'indice voiture sur ce circuit (1 = meilleure voiture), pour mesurer les surprises. */
  rangVoiture: number;
  /** Retard de la voiture sur la meilleure voiture du circuit, en % du temps au tour (0 = la plus rapide). */
  retardVoiturePct: number;
  /**
   * Décomposition du « temps » (en %), conservée 2 saisons : voiture, pilote (affinité et nouveauté comprises), forme, aléa ;
   * phase 6a complémentaire : part de l'affinité, de la nouveauté (circuit, écurie) et erreur sous pression.
   */
  explication?: { voiture: number; pilote: number; forme: number; alea: number; affinite?: number; nouveaute?: number; pression?: number };
}

export interface GrandPrix {
  id: string;
  saison: number;
  manche: number;
  circuit: string;
  semaine: number;
  pluie: boolean;
  termine: boolean;
  resultats: ResultatPilote[];
}

export interface LigneClassementPilote {
  pilote: string;
  ecurie: string;
  points: number;
  victoires: number;
  podiums: number;
  abandons: number;
  meilleurResultat: number | null;
  /** Nombre d'arrivées à chaque place (indice 0 = 1re place) : départage des égalités (audit 1.7). */
  places?: number[];
}

export interface LigneClassementConstructeur {
  ecurie: string;
  points: number;
  victoires: number;
  doubles: number;
  primesMEUR?: number;
  /** Nombre d'arrivées à chaque place des deux voitures (indice 0 = 1re place) : départage des égalités (audit 1.6). */
  places?: number[];
}

export interface Saison {
  id: string;
  annee: number;
  calendrier: string[];
  bareme: number[];
  pilotes: LigneClassementPilote[];
  constructeurs: LigneClassementConstructeur[];
  /** Leader du championnat pilotes après chaque manche. */
  leaders: string[];
  /** Écart de points entre le 1er et le 2e du championnat pilotes après chaque manche. */
  ecartsTete: number[];
  /**
   * Avant la dernière manche : le titre pilotes était-il encore mathématiquement ouvert ?
   * (un rival pouvait encore finir devant, égalités départagées par les victoires puis les podiums)
   */
  titreOuvertDerniereManche?: boolean;
  /** Leader du championnat pilotes avant la dernière manche. */
  leaderAvantDerniereManche?: string;
  /** Indice moyen de chaque écurie (toutes caractéristiques de vitesse) au début et à la fin de la saison. */
  indiceDebut: Record<string, number>;
  /** Audit n°4 : niveau de chaque pilote relevé à sa première course de la saison (pour les indicateurs historiques). */
  niveauxPilotes?: Record<string, number>;
  indiceFin: Record<string, number>;
  termine: boolean;
  chronique: string[];
}

/* ------------------------------------------------------------------ Économie (phase 5a) */

export type TypeProprietaire = 'constructeur' | 'milliardaire' | 'fonds' | 'famille' | 'consortium';

export interface Proprietaire {
  id: string;
  ecurie: string;
  type: TypeProprietaire;
  apportBaseMEUR: number;
  /** Personnalité du propriétaire (1–20). */
  patience: number;
  ambition: number;
  risque: number;
  /** Faux quand le propriétaire a vendu l'écurie (phase 5b) : il reste dans l'historique. */
  actif?: boolean;
  /** Année d'arrivée (rachats, phase 5b). */
  depuis?: number;
}

/** Ce que recherche un sponsor chez une écurie (phase 5b). */
export type ImageSponsor = 'prestige' | 'popularite' | 'resultats' | 'nationalite';
/** Entreprise fictive générée (aucune vraie marque). */
export interface Sponsor {
  id: string;
  nom: string;
  secteur: string;
  nationalite: string;
  /** Budget marketing annuel que l'entreprise peut consacrer à la F1 (M€), avant conjoncture. */
  budgetMEUR: number;
  image: ImageSponsor;
  /** Fidélité (1–20) : probabilité de renouveler un contrat satisfaisant. */
  fidelite: number;
  /** Exigence (1–20) : écart au classement attendu qu'il accepte avant d'être déçu. */
  exigence: number;
  /** Mémoire simple : écuries évitées jusqu'à une année (objectif raté, rupture). */
  rancunes: { ecurie: string; jusqua: number }[];
  actif: boolean;
  /** Dernière année sous contrat (pour le renouvellement du vivier). */
  derniereAnneeContrat: number;
  /** Phase 7c : entreprise familiale ou nationale liée à un pilote (ne sponsorise que lui ; hors vivier général ; disparaît avec lui). */
  lie?: string;
}
export type RangSponsor = 'titre' | 'principal' | 'secondaire';
/** Phase 11c : variante d'un contrat titre ou principal (même valeur attendue pour le sponsor, à sa marge de risque près). */
export type VarianteContrat = 'prudente' | 'equilibree' | 'audacieuse';
/** Phase 11c : type d'une clause annuelle (rang constructeurs, places gagnées, au moins un podium, une victoire, N arrivées dans les points). */
export type TypeClause = 'rang' | 'progression' | 'podium' | 'victoire' | 'arrivees_points';
export interface ClauseSponsor {
  type: TypeClause;
  /** rang et progression : rang constructeurs à atteindre (ou mieux) ; podium, victoire : 1 ; arrivées dans les points : nombre de Grands Prix. */
  seuil: number;
  /** Prime versée si la clause est tenue (M€), fixée au contrat. */
  primeMEUR: number;
  /** Probabilité estimée par le sponsor à la signature (sa connaissance publique du marché). Lue par la satisfaction. */
  probabilite: number;
  /** Bilan de la dernière saison évaluée. */
  atteinte?: boolean;
}
export interface ContratSponsoring {
  id: string;
  sponsor: string;
  ecurie: string;
  rang: RangSponsor;
  /** Partie fixe annuelle (M€). */
  montantAnnuelMEUR: number;
  /** Phase 11c : variante choisie à la signature. */
  variante: VarianteContrat;
  /** Phase 11c : clauses annuelles (la prudente : une clause de classement, celle d'avant la refonte). */
  clauses: ClauseSponsor[];
  /** Phase 11c : sponsor titre, enveloppe annuelle des primes de course (M€), répartie sur les Grands Prix. */
  enveloppeGPMEUR?: number;
  /** Phase 11c : primes versées depuis la signature (M€) : clauses, objectifs de course. */
  primesVerseesMEUR: number;
  /** Phase 11c : une opération exceptionnelle a déjà été faite avec ce contrat (un autre sponsor principal est sollicité en priorité). */
  operationFaite?: boolean;
  /** Clause de sortie : le sponsor peut partir avant la fin si l'objectif est manqué et sa satisfaction trop basse. */
  clauseSortie: boolean;
  debut: number;
  fin: number;
  statut: 'actif' | 'termine' | 'rompu';
  /** 0 à 100. */
  satisfaction: number;
  /** Phase 7c : sponsor personnel qui accompagne ce pilote (contrat conditionné à sa présence ; occupe un emplacement existant). */
  pilote?: string;
}
/** Phase 11c : une variante telle qu'elle est proposée (avant signature). */
export interface VarianteOffre {
  variante: VarianteContrat;
  fixeMEUR: number;
  clauses: ClauseSponsor[];
  enveloppeGPMEUR?: number;
  /** Valeur attendue pour le sponsor (fixe + primes × probabilités + enveloppe). */
  valeurAttendueMEUR: number;
  /** Montant maximal à payer sur une saison (engagement ferme). */
  maximumMEUR: number;
}
/** Phase 11c : offre de contrat faite à l'écurie du joueur (domaine commercial non délégué). Effacée à la décision. */
export interface OffreSponsor {
  id: string;
  sponsor: string;
  ecurie: string;
  rang: RangSponsor;
  annee: number;
  renouvellement: boolean;
  echeance: DateJeu;
  variantes: VarianteOffre[];
}
export type NiveauObjectifGP = 'prudent' | 'intermediaire' | 'audacieux';
export interface OptionObjectifGP {
  niveau: NiveauObjectifGP;
  /** Le meilleur pilote de l'écurie finit dans les `seuil` premiers. */
  seuil: number;
  primeMEUR: number;
  /** Probabilité estimée par le sponsor (jamais montrée au joueur). */
  probabilite: number;
  /** Fourchette du directeur sportif (lue par l'affichage et par le choix de l'équipe). */
  estimation: [number, number];
}
/** Phase 11c : objectif de course proposé par le sponsor titre pour un Grand Prix (un par écurie, effacé après le jugement). */
export interface ObjectifGP {
  id: string;
  gp: string;
  ecurie: string;
  contrat: string;
  /** Part de l'enveloppe mise en jeu sur ce Grand Prix (M€) ; « aucun objectif » en verse une part fixe. */
  partMEUR: number;
  options: OptionObjectifGP[];
  choix?: NiveauObjectifGP | 'aucun';
  choisiPar?: 'joueur' | 'equipe';
}
export type FormatOperation = 'tenues' | 'visibilite' | 'interview' | 'campagne';
/** Phase 11c : opération publicitaire exceptionnelle proposée après un exploit (sponsor principal). */
export interface OperationSponsor {
  id: string;
  ecurie: string;
  contrat: string;
  sponsor: string;
  /** Fait déclencheur (premier top 5, podium ou victoire depuis 3 saisons). */
  evenement: string;
  exploit: 'top5' | 'podium' | 'victoire';
  rangAttendu: number;
  /** Pilote demandé, affiché avant acceptation ; absent si le sponsor laisse l'écurie choisir. */
  ciblage: 'exploit' | 'populaire' | 'numero1' | 'libre';
  pilote?: string;
  /** Auteur de l'exploit (meilleur pilote de l'écurie ce jour-là). */
  auteur: string;
  formats: { format: FormatOperation; montantMEUR: number }[];
  echeance: DateJeu;
  proposeeLe: DateJeu;
  statut: 'proposee' | 'acceptee' | 'refusee' | 'expiree';
  format?: FormatOperation;
}
/** Projet d'infrastructure en cours (phase 5b). */
export interface ProjetInfrastructure {
  id: string;
  installation: string;
  nature: 'amelioration' | 'renovation';
  /** Coût et durée annoncés au lancement. */
  coutPrevuMEUR: number;
  dureePrevueSemaines: number;
  /** Coût et durée réels (tirés au lancement, découverts au fil du projet). */
  coutReelMEUR: number;
  dureeReelleSemaines: number;
  depenseMEUR: number;
  avancementSemaines: number;
  debut: { annee: number; semaine: number };
  retardAnnonce?: boolean;
  /**
   * Audit n°3 : semaines calendaires sans travail (crise, enveloppe épuisée), distinctes de l'avancement (temps de travail).
   * Date prévue = début + durée annoncée ; date réelle = livraison ; retard = temps calendaire écoulé − durée annoncée.
   */
  semainesSuspendues?: number;
}

/** Comptes d'une année (M€). */
export interface ComptesAnnee {
  annee: number;
  primes: number;
  commercial: number;
  apport: number;
  /** Dépenses plafonnées. */
  personnelPlafonne: number;
  departements: number;
  operations: number;
  entretien: number;
  developpement: number;
  /** Dépenses hors plafond. */
  salairesHorsPlafond: number;
  marketing: number;
  indemnites: number;
  amendes: number;
  /** Retrait du propriétaire (hors plafond). */
  dividendes: number;
  /** Phase 5b : contrats de sponsoring (recette), intérêts de la dette et investissements en infrastructures (hors plafond). */
  sponsors: number;
  interets: number;
  investissements: number;
  /** Apports exceptionnels du propriétaire (sauvetage, rachat) : recette hors exploitation. */
  apportsExceptionnels: number;
  /** Phase 6b-2 : académie (financement des affiliés) et missions de repérage, hors plafond. */
  academie?: number;
  /** Audit 5.2 : plafond en vigueur pendant cette année (un plafond voté ne s'applique pas rétroactivement). */
  plafondMEUR?: number;
  /** Phase 7a : indemnités de transfert reçues (rachat d'un pilote ou d'un affilié par une autre écurie), recette hors plafond. */
  transfertsRecus?: number;
}

export interface Finances {
  id: string;
  ecurie: string;
  tresorerieMEUR: number;
  revenusCommerciauxBaseMEUR: number;
  /** Budget de l'année en cours. */
  budget: {
    annee: number; developpementMEUR: number; plafondVise: number; strategie: string;
    /** Audit 5.1 et 10.2 : choix du team principal (montant, saison visée, date) — gardé par le budget annuel, modifiable à tout moment (D-166). */
    choixTP?: { annee: number; montantMEUR: number };
  };
  /**
   * D-166 : dépenses plafonnées réellement payées à la dernière période comptable, ramenées à l'année (M€/an). La progression
   * de la voiture lit cet argent dépensé, pas le budget prévu : on reçoit ce que l'on paie.
   */
  depensePeriode?: { annee: number; plafonneesAnnuelMEUR: number };
  /** Comptes de l'année en cours (cumulés période par période). */
  comptes: ComptesAnnee;
  /** Bilans des années passées. */
  historique: (ComptesAnnee & { tresorerieFin: number; plafonnees: number; depassement: number })[];
  /** Réduction d'efficacité aérodynamique due à une sanction (0 à 1), pour l'année en cours. */
  sanctionAero: number;
  /** Phase 5b : dette, état de santé, projets d'infrastructure. */
  detteMEUR: number;
  etatCrise: 'sain' | 'tension' | 'crise' | 'administration';
  periodesEnCrise: number;
  projets: ProjetInfrastructure[];
  /** Retrait du propriétaire en cours d'année (tiré au bilan, annoncé à la semaine indiquée). */
  chocApport?: { annee: number; semaine: number; facteur: number; annonce?: boolean };
  /** D-179 : objectif fixé par le propriétaire pour la saison `annee` (place au championnat constructeurs, ou mieux). */
  objectifProprietaire?: { annee: number; place: number; depart?: number };
  /** D-179 : objectif atteint → apport de la saison `annee` multiplié par `facteur`. */
  bonusApport?: { annee: number; facteur: number };
  /** Levier B (prototype) : dernière offre de pilote soutenu (contrat jusqu'à `jusqua`, ou refus l'année `refus`). */
  piloteSoutenu?: { jusqua?: number; refus?: number; pilote?: string; debut?: number; montant?: number };
  /** Audit 5.12 : fait d'entrée dans la dernière crise (cause des suites). */
  evenementCrise?: string;
  /** Phase 12a : dépenses des projets de conception et de fabrication (année en cours, et reste à payer à la prochaine écriture). */
  depensesTechniques?: { annee: number; projetsMEUR: number; aPayerMEUR: number };
  verification: string;
}

/** Phase 7a : offre faite pendant la fenêtre de transferts (bornée : effacée en fin de saison). */
export interface OffreMarche {
  id: string;
  /** Jalon A : événement de l'offre (cause de la signature). */
  evenement?: string;
  ecurie: string;
  /** Team principal qui fait l'offre. */
  decideur: string;
  personne: string;
  poste: Poste;
  salaireMEUR: number;
  dureeAnnees: number;
  /** Première saison du contrat (année suivante, ou celle d'après pour un pré-accord). */
  debut: number;
  statutN1: boolean;
  /** Montant à verser à l'employeur actuel (clause de rachat ou indemnité convenue), 0 si la personne est libre à cette date. */
  indemniteMEUR: number;
  /** Organisation qui reçoit l'indemnité (écurie employeuse, ou académie de l'affilié). */
  beneficiaireIndemnite?: string;
  /** Tour de négociation (0 à TOURS_MARCHE − 1). */
  tour: number;
  annee: number;
  semaine: number;
  statut: 'en_attente' | 'contre_offre' | 'acceptee' | 'refusee' | 'retiree' | 'expiree';
  salaireDemande?: number;
  raisons?: string[];
  /** Phase 7b : titulaire actuel du poste que la recrue remplacerait (amélioration de l'effectif). */
  remplace?: string;
}

/** Phase 7b : candidature spontanée d'une personne ambitieuse ou lassée (bornée ; effacée chaque fin de saison). */
export interface Candidature {
  id: string;
  personne: string;
  ecurie: string;
  poste: Poste;
  annee: number;
  semaine: number;
}

/**
 * D-121 : fiche légère d'une personne retirée depuis plusieurs années (même identifiant). On garde ce que l'histoire du monde
 * cite (nom, dates, poste, palmarès, saisons en F1) ; relations, souvenirs, contrats et détails sont effacés.
 */
export interface PersonneArchivee {
  id: string;
  prenom: string;
  nom: string;
  nationalite: string;
  anneeNaissance: number;
  poste: Poste;
  retraiteDepuis: number;
  saisonsF1: number;
  titres: number;
}

/** Phase 7c : agent (léger, D-117 §15.3) : compétence de négociation, deux traits, liste de clients bornée. */
export interface Agent {
  id: string;
  prenom: string;
  nom: string;
  /** 1–20 : pousse les demandes salariales en contre-offre. */
  negociation: number;
  /** 1–20 : pousse ses clients vers les transferts (commission plus forte). */
  ambition: number;
  /** 1–20 : nombre et qualité des démarchages auprès des écuries. */
  reseau: number;
}

/** Phase 8a — règlement technique (en vigueur, annoncé, proposé, rejeté ou terminé). */
export interface Reglement {
  id: string;
  generation: number;
  /** Orientation de la réforme (aéro, motorisation, châssis, refonte), « initial » pour le règlement de départ. */
  orientation: string;
  debut: number;
  /** Dernière saison prévue (peut être prolongée par un vote). */
  fin: number;
  /** Phase 8c : « brouillon » = avant-projet de la fédération, pas encore publié (seules les écuries de `connuPar` en ont vent). */
  statut: 'brouillon' | 'en_vigueur' | 'annonce' | 'propose' | 'rejete' | 'termine';
  /** Phase 8c : écuries qui ont eu vent de l'avant-projet. */
  connuPar?: string[];
  /** Jalon A : faits qui expliquent ce règlement (lobbying, propositions, annonce), pour les chaînes de causes. */
  causes?: { propositions?: string; annonce?: string; lobbying?: string[] };
  /** Intensité du changement par domaine technique, de 0 (inchangé) à 1 (entièrement nouveau), par rapport au règlement précédent. */
  intensites: Record<string, number>;
  /** Version de la spécification des pneumatiques du manufacturier commun. */
  pneus: number;
  /** Votes des écuries (identifiant d'option : règlement proposé ou « prolongation »). */
  votes?: Record<string, string>;
  /** Pour l'option de prolongation proposée en même temps : nombre de saisons. */
  prolongation?: number;
}

/** Phase 8a — évolution mineure annuelle décidée par la fédération (bornée). */
export interface EvolutionMineure { id: string; saison: number; intensites: Record<string, number>; appliquee: boolean }

/** Phase 8b — savoir d'une écurie dans un domaine technique. */
export interface Savoir {
  id: string;
  ecurie: string;
  domaine: string;
  /** Compréhension générale du domaine : survit en grande partie aux réformes. */
  fondamental: number;
  /** Maîtrise propre à chaque règlement (en vigueur, annoncé ou proposé). */
  parReglement: Record<string, number>;
  /** Savoir destiné à la voiture de la saison suivante (utilisé à l'intersaison). */
  pourSaisonSuivante: number;
}

/** Phase 8b — programme de recherche (deux emplacements par écurie). */
export interface ProgrammeRecherche {
  id: string;
  ecurie: string;
  emplacement: number;
  domaine: string;
  /** « actuelle », « suivante » ou l'identifiant d'un règlement futur (annoncé ou proposé). */
  horizon: string;
  /** Part des moyens de développement affectée. */
  part: number;
  statut: 'actif' | 'suspendu';
  /** Semaines de remise en route restantes (efficacité réduite) après une réorientation. */
  remiseEnRoute: number;
  debut: { annee: number; semaine: number };
}

/** Phase 8b — historique de recherche d'une écurie pour une saison (borné). */
export interface HistoriqueRecherche {
  id: string;
  ecurie: string;
  annee: number;
  domaines: Record<string, { effort: number; gain: number; obsolescence: number }>;
}

/** Phase 8b — découverte (rare, expliquée, sans quota), copiée progressivement par les autres. */
export interface Decouverte { id: string; ecurie: string; domaine: string; reglement: string; saison: number; ampleur: number; diffusee: number }


export * from './medias';
