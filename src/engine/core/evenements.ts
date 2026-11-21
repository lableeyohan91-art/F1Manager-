/**
 * Journal des événements (voir docs/systemes/memoire.md §1, couche « faits »).
 *
 * Un événement est un fait objectif et immuable : type, date, acteurs, contexte,
 * visibilité, importance et CAUSES. Les causes permettent de remonter les chaînes
 * de conséquences et d'expliquer (« Pourquoi ? »).
 */

import {
  CONSERVATION_MINEURS_SAISONS,
  CONSERVATION_NOTABLES_DETAIL_SAISONS,
  CONSERVATION_NOTABLES_RESUME_SAISONS,
  IMPORTANCE_CHRONIQUE,
} from '../balance/memoire';
import type { DateJeu } from './calendrier';
import { nouvelIdentifiant } from './identifiants';
import { idsTries, type Monde } from './monde';

export type Visibilite = 'public' | 'prive' | 'confidentiel';

export interface ActeurEvenement {
  id: string;
  /** Rôle dans l'événement : « auteur », « cible », « temoin »… */
  role: string;
}

export interface Evenement {
  id: string;
  date: DateJeu;
  type: string;
  acteurs: ActeurEvenement[];
  contexte: Record<string, unknown>;
  visibilite: Visibilite;
  /** 1 (mineur) à 5 (majeur). */
  importance: 1 | 2 | 3 | 4 | 5;
  /** Identifiants des événements à l'origine de celui-ci. */
  causes: string[];
  /** Personnes informées en dehors des acteurs (événements privés ou confidentiels). */
  connuPar: string[];
  /** Vrai quand l'événement a été résumé (contexte retiré) pour gagner de la place. */
  resume?: boolean;
  /** Phrase lisible, utilisée par la Chronique et le diagnostic. */
  texte?: string;
}

export type NouvelEvenement = Omit<Evenement, 'id' | 'date' | 'causes' | 'connuPar' | 'contexte' | 'visibilite'> & {
  causes?: string[];
  connuPar?: string[];
  contexte?: Record<string, unknown>;
  visibilite?: Visibilite;
};

export function ajouterEvenement(monde: Monde, e: NouvelEvenement): Evenement {
  if (!Number.isInteger(e.importance) || e.importance < 1 || e.importance > 5) {
    throw new Error(`Importance invalide pour ${e.type} : ${e.importance}`);
  }
  for (const c of e.causes ?? []) {
    if (!monde.evenements[c]) throw new Error(`Cause inconnue pour ${e.type} : ${c}`);
  }
  const evt: Evenement = {
    id: nouvelIdentifiant(monde, 'evt'),
    date: { ...monde.date },
    type: e.type,
    acteurs: e.acteurs,
    contexte: e.contexte ?? {},
    visibilite: e.visibilite ?? 'public',
    importance: e.importance,
    causes: e.causes ?? [],
    connuPar: e.connuPar ?? [],
    ...(e.texte !== undefined ? { texte: e.texte } : {}),
  };
  monde.evenements[evt.id] = evt;
  if (evt.importance >= IMPORTANCE_CHRONIQUE) {
    monde.chronique.push({
      id: evt.id,
      date: { ...evt.date },
      type: evt.type,
      acteurs: evt.acteurs,
      resume: evt.texte ?? evt.type,
    });
  }
  return evt;
}

/** Événements où apparaît un acteur, dans l'ordre chronologique. */
export function evenementsDe(monde: Monde, idActeur: string): Evenement[] {
  return idsTries(monde.evenements)
    .map((id) => monde.evenements[id] as Evenement)
    .filter((e) => e.acteurs.some((a) => a.id === idActeur));
}

export function evenementsDeType(monde: Monde, type: string): Evenement[] {
  return idsTries(monde.evenements)
    .map((id) => monde.evenements[id] as Evenement)
    .filter((e) => e.type === type);
}

/**
 * Remonte la chaîne des causes d'un événement (parcours en largeur, sans doublon).
 * Renvoie les ancêtres encore présents dans le journal, du plus proche au plus lointain.
 */
export function chaineDeCauses(monde: Monde, idEvenement: string): Evenement[] {
  const resultat: Evenement[] = [];
  const vus = new Set<string>([idEvenement]);
  let file = [...(monde.evenements[idEvenement]?.causes ?? [])];
  while (file.length > 0) {
    const suivante: string[] = [];
    for (const id of file) {
      if (vus.has(id)) continue;
      vus.add(id);
      const e = monde.evenements[id];
      if (!e) continue;
      resultat.push(e);
      suivante.push(...e.causes);
    }
    file = suivante;
  }
  return resultat;
}

/** Longueur de la plus longue chaîne de causes partant d'un événement (1 = sans cause). */
export function profondeurCauses(monde: Monde, idEvenement: string, memo = new Map<string, number>()): number {
  const deja = memo.get(idEvenement);
  if (deja !== undefined) return deja;
  memo.set(idEvenement, 1); // protège contre les cycles
  const e = monde.evenements[idEvenement];
  let p = 1;
  if (e) for (const c of e.causes) p = Math.max(p, 1 + profondeurCauses(monde, c, memo));
  memo.set(idEvenement, p);
  return p;
}

export interface BilanCompactage {
  resumes: number;
  supprimes: number;
}

/**
 * Applique la politique de conservation (bornes de taille des sauvegardes).
 * - importance 1–2 : supprimés après CONSERVATION_MINEURS_SAISONS ;
 * - importance 3 : résumés après CONSERVATION_NOTABLES_DETAIL_SAISONS, supprimés après CONSERVATION_NOTABLES_RESUME_SAISONS ;
 * - importance ≥ 4 : conservés (et déjà copiés dans la Chronique).
 * Un événement encore cité comme cause par un événement conservé, ou protégé par un autre système
 * (ex. : un souvenir qui le référence), n'est pas supprimé.
 */
export function compacterJournal(monde: Monde, idsProteges: ReadonlySet<string> = new Set()): BilanCompactage {
  const anneeCourante = monde.date.annee;
  const bilan: BilanCompactage = { resumes: 0, supprimes: 0 };
  const ids = idsTries(monde.evenements);

  const aSupprimer = new Set<string>();
  for (const id of ids) {
    const e = monde.evenements[id] as Evenement;
    const age = anneeCourante - e.date.annee;
    if (e.importance <= 2 && age > CONSERVATION_MINEURS_SAISONS) aSupprimer.add(id);
    else if (e.importance === 3) {
      if (age > CONSERVATION_NOTABLES_RESUME_SAISONS) aSupprimer.add(id);
      else if (age > CONSERVATION_NOTABLES_DETAIL_SAISONS && !e.resume) {
        e.contexte = {};
        e.resume = true;
        bilan.resumes++;
      }
    }
  }

  // Un événement cité par un événement conservé reste (on itère jusqu'à stabilité).
  let change = true;
  while (change) {
    change = false;
    for (const id of ids) {
      if (aSupprimer.has(id)) continue;
      const e = monde.evenements[id];
      if (!e) continue;
      for (const c of e.causes) {
        if (aSupprimer.delete(c)) change = true;
      }
    }
  }
  for (const id of idsProteges) aSupprimer.delete(id);

  for (const id of aSupprimer) {
    delete monde.evenements[id];
    bilan.supprimes++;
  }
  return bilan;
}
