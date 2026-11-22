/**
 * Promesses (phase 4, §6) et réputation publique v1 (§4, couche 5).
 * Une promesse est un engagement vérifiable par le moteur : à son échéance, ou dès qu'elle devient
 * impossible à tenir, elle produit un événement « tenue » ou « rompue », puis des souvenirs.
 */

import { ajouterEvenement, type Evenement } from '../../core/evenements';
import { comparerDates, type DateJeu } from '../../core/calendrier';
import { nouvelIdentifiant } from '../../core/identifiants';
import { idsTries, table, type Entite, type Monde } from '../../core/monde';
import { planifier, type Systeme } from '../../core/moteur';
import { TABLES, type Contrat, type Personne } from '../../model/types';
import { lireEvenement } from '../memoire';

export const TABLE_PROMESSES = 'promesses';

export type TypePromesse = 'salaire_minimum' | 'statut_n1' | 'titularisation' | 'prolongation' | 'ne_pas_recruter' | 'promotion_categorie';

export interface Promesse {
  id: string;
  auteur: string;
  /** Organisation au nom de laquelle la promesse est faite. */
  organisation: string;
  beneficiaire: string;
  type: TypePromesse;
  parametres: Record<string, string | number>;
  echeance: DateJeu;
  publique: boolean;
  statut: 'en_cours' | 'tenue' | 'rompue' | 'caduque';
  evenementOrigine: string;
}

export const LIBELLES_PROMESSES: Record<TypePromesse, string> = {
  salaire_minimum: 'salaire minimum',
  statut_n1: 'statut de pilote n°1',
  titularisation: 'titularisation',
  prolongation: 'prolongation garantie',
  ne_pas_recruter: 'ne pas recruter un concurrent',
  promotion_categorie: 'promotion de catégorie (réservé phase 6)',
};

export function promesses(monde: Monde): Promesse[] {
  const t = table(monde, TABLE_PROMESSES);
  return idsTries(t).map((id) => t[id] as unknown as Promesse);
}

export function faireUnePromesse(monde: Monde, p: Omit<Promesse, 'id' | 'statut' | 'evenementOrigine'>, causes: string[] = []): Promesse {
  const evt = ajouterEvenement(monde, {
    type: 'promesse.faite',
    acteurs: [{ id: p.auteur, role: 'auteur' }, { id: p.beneficiaire, role: 'beneficiaire' }, { id: p.organisation, role: 'organisation' }],
    importance: 3,
    visibilite: p.publique ? 'public' : 'prive',
    causes,
    contexte: { type: p.type, ...p.parametres },
  });
  const promesse: Promesse = { ...p, id: nouvelIdentifiant(monde, 'prm'), statut: 'en_cours', evenementOrigine: evt.id };
  table(monde, TABLE_PROMESSES)[promesse.id] = promesse as unknown as Entite;
  if (comparerDates(p.echeance, monde.date) >= 0) planifier(monde, p.echeance, 'promesse.echeance', { promesse: promesse.id });
  return promesse;
}

function contratActif(monde: Monde, personne: string, organisation: string): Contrat | undefined {
  return (Object.values(table(monde, TABLES.contrats)) as unknown as Contrat[]).find((c) => c.personne === personne && c.organisation === organisation && c.statut === 'actif' && c.type === 'emploi');
}

/** La promesse est-elle respectée à cet instant ? (null = pas encore vérifiable) */
export function promesseRespectee(monde: Monde, p: Promesse): boolean | null {
  const c = contratActif(monde, p.beneficiaire, p.organisation);
  const benef = table(monde, TABLES.personnes)[p.beneficiaire] as unknown as Personne | undefined;
  switch (p.type) {
    case 'salaire_minimum': return !!c && c.salaireMEUR >= Number(p.parametres['salaire'] ?? 0);
    case 'statut_n1': return !!c && !!c.clauses.statutN1;
    case 'titularisation': return !!benef && benef.ecurie === p.organisation && benef.poste === 'pilote_titulaire';
    case 'prolongation': return !!c && c.fin > Number(p.parametres['finAvant'] ?? monde.date.annee);
    case 'ne_pas_recruter': {
      const cible = table(monde, TABLES.personnes)[String(p.parametres['personne'])] as unknown as Personne | undefined;
      return !cible || cible.ecurie !== p.organisation;
    }
    default: return null;
  }
}

/** Clôt une promesse : événement, souvenirs du bénéficiaire. Une promesse publique rompue touche la réputation (via l'événement public). */
export function clore(monde: Monde, p: Promesse, tenue: boolean, cause?: string): Evenement {
  p.statut = tenue ? 'tenue' : 'rompue';
  const evt = ajouterEvenement(monde, {
    type: tenue ? 'promesse.tenue' : 'promesse.rompue',
    acteurs: [{ id: p.auteur, role: 'auteur' }, { id: p.beneficiaire, role: 'beneficiaire' }, { id: p.organisation, role: 'organisation' }],
    importance: p.publique ? 4 : 3,
    visibilite: p.publique ? 'public' : 'prive',
    causes: [p.evenementOrigine, ...(cause ? [cause] : [])].filter((c) => monde.evenements[c]),
    contexte: { promesse: p.id, type: p.type },
  });
  const gravite = p.type === 'statut_n1' || p.type === 'titularisation' ? 1.2 : 1;
  const etiquette = tenue ? 'promesse_tenue' : 'promesse_rompue';
  lireEvenement(monde, p.beneficiaire, p.auteur, etiquette, evt.id, { facteur: gravite });
  lireEvenement(monde, p.beneficiaire, p.organisation, etiquette, evt.id, { facteur: 0.7 * gravite });
  return evt;
}

/** Vérifie les promesses dont l'échéance tombe cette semaine, et celles déjà impossibles à tenir. */
export const systemePromesses: Systeme = {
  nom: 'humain.promesses',
  executer({ monde, rendezVous }) {
    const echues = new Set(rendezVous.filter((r) => r.type === 'promesse.echeance').map((r) => r.donnees['promesse'] as string));
    for (const p of promesses(monde)) {
      if (p.statut !== 'en_cours') continue;
      const benef = table(monde, TABLES.personnes)[p.beneficiaire] as unknown as Personne | undefined;
      // Bénéficiaire parti de l'organisation (de lui-même) : la promesse devient caduque, sauf si on l'a fait partir.
      if (!benef || (benef.ecurie !== p.organisation && p.type !== 'ne_pas_recruter' && p.type !== 'titularisation')) {
        p.statut = 'caduque';
        continue;
      }
      const ok = promesseRespectee(monde, p);
      // Rupture anticipée : un statut de n°1 promis qui disparaît en cours de route.
      if (p.type === 'statut_n1' && ok === false) clore(monde, p, false);
      else if (echues.has(p.id) && ok !== null) clore(monde, p, ok);
    }
  },
};

/* ------------------------------------------------------------------ Réputation publique v1 */

export interface Reputation {
  paroleTenue: number;
  fideliteAuPersonnel: number;
  impitoyable: number;
  formateur: number;
}

/**
 * Réputation publique d'un acteur (−1 à +1 par facette), à partir des faits PUBLICS encore au journal,
 * les plus récents pesant plus lourd (−20 % par saison d'ancienneté).
 */
export function reputation(monde: Monde, idActeur: string): Reputation {
  const r: Reputation = { paroleTenue: 0, fideliteAuPersonnel: 0, impitoyable: 0, formateur: 0 };
  for (const e of Object.values(monde.evenements)) {
    if (e.visibilite !== 'public' || !e.acteurs.some((a) => a.id === idActeur && a.role === 'auteur')) continue;
    const poids = Math.pow(0.8, monde.date.annee - e.date.annee);
    switch (e.type) {
      case 'promesse.tenue': r.paroleTenue += 0.25 * poids; break;
      case 'promesse.rompue': r.paroleTenue -= 0.4 * poids; break;
      case 'contrat.licenciement': r.impitoyable += 0.25 * poids; r.fideliteAuPersonnel -= 0.15 * poids; break;
      case 'negociation.accord': r.fideliteAuPersonnel += 0.05 * poids; break;
      case 'personnel.critique': r.impitoyable += 0.1 * poids; break;
      case 'personnel.soutien': r.fideliteAuPersonnel += 0.08 * poids; break;
      case 'pilote.titularisation': r.formateur += 0.3 * poids; break;
    }
  }
  for (const k of Object.keys(r) as (keyof Reputation)[]) r[k] = Math.max(-1, Math.min(1, r[k]));
  return r;
}
