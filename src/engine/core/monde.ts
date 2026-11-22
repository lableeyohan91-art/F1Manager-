/**
 * L'état complet d'une partie (voir docs/architecture.md §3).
 *
 * - Les entités sont rangées dans des TABLES (une par type), indexées par identifiant.
 * - Les liens entre entités passent par les identifiants, jamais par des références d'objets.
 * - Tout l'état est sérialisable en JSON, ce qui rend triviales la sauvegarde,
 *   la copie (tests contrefactuels) et la migration.
 */

import type { DateJeu } from './calendrier';
import type { EtatFlux } from './hasard';
import type { Evenement } from './evenements';
import type { Commande } from './commandes';

/** Version actuelle du format de sauvegarde. Toute modification de structure l'incrémente (+ migration). */
export const VERSION_FORMAT = 16;

/** Version du jeu (informative). */
export const VERSION_JEU = '0.1.0';

/** Une entité générique : un objet JSON qui possède un identifiant. */
export interface Entite {
  id: string;
  [champ: string]: unknown;
}

/** Rendez-vous daté, déclenché à la bonne semaine (fin de contrat, échéance de promesse…). */
export interface RendezVous {
  id: string;
  date: DateJeu;
  type: string;
  donnees: Record<string, unknown>;
}

/** Fait majeur conservé pour toujours (importance ≥ seuil Chronique). */
export interface EntreeChronique {
  id: string;
  date: DateJeu;
  type: string;
  acteurs: Evenement['acteurs'];
  resume: string;
}

/** Commande passée par un acteur extérieur (le joueur), conservée pour pouvoir rejouer la partie. */
export interface CommandeJournalisee {
  date: DateJeu;
  commande: Commande;
}

export interface Monde {
  versionFormat: number;
  versionJeu: string;
  /** D'où vient ce monde : de quoi le recréer à l'identique (scénario + graine). */
  origine: { scenario: string; graine: number };
  graine: number;
  date: DateJeu;
  /** Compteurs d'identifiants, par préfixe. */
  compteurs: Record<string, number>;
  /** État de chaque flux de hasard, par nom de flux. */
  flux: Record<string, EtatFlux>;
  /** Tables d'entités : nom de table → (id → entité). */
  tables: Record<string, Record<string, Entite>>;
  /** Journal des événements (id → événement), dans l'ordre de création. */
  evenements: Record<string, Evenement>;
  /** Chronique : faits majeurs, jamais effacés. */
  chronique: EntreeChronique[];
  /** Rendez-vous à venir. */
  agenda: RendezVous[];
  /** Commandes extérieures en attente d'application (traitées au début du prochain pas). */
  fileCommandes: Commande[];
  /** Journal des commandes extérieures appliquées (pour rejouer). */
  journalCommandes: CommandeJournalisee[];
  /**
   * Réglages d'expérience (format 3) : remplacent ponctuellement un coefficient d'équilibrage pour CE monde,
   * par ex. { 'course.aleaSigma': 0.2 }. Utilisés par les outils d'équilibrage ; vides dans une partie normale.
   */
  parametres: Record<string, number>;
}

export function creerMondeVide(graine: number, scenario: string, dateDepart: DateJeu): Monde {
  if (!Number.isInteger(graine)) throw new Error('La graine doit être un entier');
  return {
    versionFormat: VERSION_FORMAT,
    versionJeu: VERSION_JEU,
    origine: { scenario, graine },
    graine,
    date: { ...dateDepart },
    compteurs: {},
    flux: {},
    tables: {},
    evenements: {},
    chronique: [],
    agenda: [],
    fileCommandes: [],
    journalCommandes: [],
    parametres: {},
  };
}

/** Copie profonde d'un monde (tests contrefactuels, comparaisons). */
export function copierMonde(monde: Monde): Monde {
  return structuredClone(monde);
}

/** Accès à une table (créée vide si besoin). */
export function table(monde: Monde, nom: string): Record<string, Entite> {
  let t = monde.tables[nom];
  if (!t) {
    t = {};
    monde.tables[nom] = t;
  }
  return t;
}

/** Identifiants d'une table, triés : à utiliser pour tout parcours (déterminisme). */
export function idsTries(t: Record<string, unknown>): string[] {
  return Object.keys(t).sort();
}

/** Valeur d'un coefficient pour ce monde : le réglage d'expérience s'il existe, sinon la valeur par défaut. */
export function parametre(monde: Monde, nom: string, defaut: number): number {
  const v = monde.parametres?.[nom];
  return typeof v === 'number' && Number.isFinite(v) ? v : defaut;
}
