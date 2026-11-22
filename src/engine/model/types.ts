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

export type MotifFinContrat = 'echeance' | 'non_prolonge' | 'licenciement' | 'demission' | 'rachat';

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
export interface Voiture {
  id: string;
  ecurie: string;
  viragesLents: number;
  viragesRapides: number;
  vitessePointe: number;
  efficaciteAero: number;
  fiabilite: number;
  gestionPneus: number;
  /** La motorisation n'est pas stockée : c'est le niveau du motoriste de l'écurie. */
  verification: string;
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
}

export interface LigneClassementConstructeur {
  ecurie: string;
  points: number;
  victoires: number;
  doubles: number;
  primesMEUR?: number;
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
}
export type RangSponsor = 'titre' | 'principal' | 'secondaire';
export interface ContratSponsoring {
  id: string;
  sponsor: string;
  ecurie: string;
  rang: RangSponsor;
  montantAnnuelMEUR: number;
  /** Prime versée si l'objectif de classement est atteint (M€). */
  primeObjectifMEUR: number;
  /** Classement constructeurs minimal visé (1 = premier). */
  objectifRang: number;
  /** Clause de sortie : le sponsor peut partir avant la fin si l'objectif est manqué et sa satisfaction trop basse. */
  clauseSortie: boolean;
  debut: number;
  fin: number;
  statut: 'actif' | 'termine' | 'rompu';
  /** 0 à 100. */
  satisfaction: number;
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
  /** Phase 7a : indemnités de transfert reçues (rachat d'un pilote ou d'un affilié par une autre écurie), recette hors plafond. */
  transfertsRecus?: number;
}

export interface Finances {
  id: string;
  ecurie: string;
  tresorerieMEUR: number;
  revenusCommerciauxBaseMEUR: number;
  /** Budget de l'année en cours. */
  budget: { annee: number; developpementMEUR: number; plafondVise: number; strategie: string };
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
  verification: string;
}

/** Phase 7a : offre faite pendant la fenêtre de transferts (bornée : effacée en fin de saison). */
export interface OffreMarche {
  id: string;
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
}

