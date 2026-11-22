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
}

export interface Contrat {
  id: string;
  personne: string;
  ecurie: string;
  poste: Poste;
  debut: number;
  fin: number;
  salaireMEUR: number;
  clauses: string;
  statut: 'actif' | 'termine' | 'rompu';
  verification: string;
}

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
  verification: string;
  /** Rang dans le calendrier (ordre du fichier circuits.csv). */
  ordre?: number;
}

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
  /** Décomposition du « temps » (en %), conservée 2 saisons : voiture, pilote, forme, aléa. */
  explication?: { voiture: number; pilote: number; forme: number; alea: number };
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
