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
import { poidsPercu } from '../information/connaissance';

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

/**
 * Audit n°3 : paramètres requis par type de promesse. Sans eux, une promesse n'est pas vérifiable : elle ne peut pas être faite
 * (et une ancienne promesse incomplète devient caduque à son échéance au lieu d'être considérée comme tenue).
 */
export function motifPromesseInvalide(type: TypePromesse, parametres: Record<string, string | number>): string | null {
  const fini = (x: unknown) => typeof x === 'number' && Number.isFinite(x);
  if (type === 'salaire_minimum' && !(fini(parametres['salaire']) && Number(parametres['salaire']) > 0)) return 'Une promesse de salaire minimum doit préciser un montant positif.';
  if (type === 'prolongation' && !(fini(parametres['finAvant']) && Number.isInteger(parametres['finAvant']))) return 'Une promesse de prolongation doit préciser l’échéance actuelle du contrat.';
  if (type === 'ne_pas_recruter' && !(typeof parametres['personne'] === 'string' && parametres['personne'] !== '')) return 'Une promesse de ne pas recruter doit désigner la personne concernée.';
  if (type === 'promotion_categorie') return 'Type de promesse réservé, pas encore utilisable.';
  return null;
}

export function faireUnePromesse(monde: Monde, p: Omit<Promesse, 'id' | 'statut' | 'evenementOrigine'>, causes: string[] = []): Promesse {
  const invalide = motifPromesseInvalide(p.type, p.parametres);
  if (invalide) throw new Error(`Promesse invalide : ${invalide}`);
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

/** Le dernier contrat de la personne avec l'organisation a-t-il pris fin par décision de l'employeur ? */
export function departProvoque(monde: Monde, personne: string, organisation: string): boolean {
  const derniers = (Object.values(table(monde, TABLES.contrats)) as unknown as Contrat[])
    .filter((c) => c.personne === personne && c.organisation === organisation && c.type === 'emploi' && c.statut !== 'actif' && c.statut !== 'signe')
    .sort((a, b) => b.fin - a.fin || (a.id < b.id ? 1 : -1));
  const m = derniers[0]?.motifFin;
  return m === 'licenciement' || m === 'non_prolonge';
}

/** La promesse est-elle respectée à cet instant ? (null = pas encore vérifiable) */
export function promesseRespectee(monde: Monde, p: Promesse): boolean | null {
  const c = contratActif(monde, p.beneficiaire, p.organisation);
  const benef = table(monde, TABLES.personnes)[p.beneficiaire] as unknown as Personne | undefined;
  switch (p.type) {
    case 'salaire_minimum': {
      const min = p.parametres['salaire'];
      if (typeof min !== 'number' || !Number.isFinite(min) || min <= 0) return null; // non vérifiable : jamais tenue d'office
      return !!c && c.salaireMEUR >= min;
    }
    case 'statut_n1': {
      // Audit n°3 : le statut de n°1 est exclusif. Si deux titulaires de la même écurie l'ont tous deux, aucun ne l'a réellement.
      if (!c || !c.clauses.statutN1) return false;
      const rival = (Object.values(table(monde, TABLES.contrats)) as unknown as Contrat[]).some((x) => x.id !== c.id && x.organisation === p.organisation
        && x.statut === 'actif' && x.type === 'emploi' && x.poste === 'pilote_titulaire' && !!x.clauses.statutN1);
      return !rival;
    }
    case 'titularisation': return !!benef && benef.ecurie === p.organisation && benef.poste === 'pilote_titulaire';
    case 'prolongation': {
      const finAvant = p.parametres['finAvant'];
      if (typeof finAvant !== 'number' || !Number.isFinite(finAvant)) return null;
      return !!c && c.fin > finAvant;
    }
    case 'ne_pas_recruter': {
      if (typeof p.parametres['personne'] !== 'string') return null;
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
        // Audit n°3 : départ voulu par l'employeur (licenciement, non-prolongation) = promesse rompue ; départ de la personne
        // (démission, rachat par une autre écurie, refus de prolonger) ou retraite = promesse caduque.
        if (benef && departProvoque(monde, benef.id, p.organisation)) clore(monde, p, false);
        else p.statut = 'caduque';
        continue;
      }
      const ok = promesseRespectee(monde, p);
      // Rupture anticipée : un statut de n°1 promis qui disparaît en cours de route.
      if (p.type === 'statut_n1' && ok === false) clore(monde, p, false);
      else if (echues.has(p.id) && ok !== null) clore(monde, p, ok);
      else if (echues.has(p.id) && ok === null) p.statut = 'caduque'; // promesse incomplète (ancienne sauvegarde) : ni tenue ni rompue
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
 * Réputation d'un acteur (−1 à +1 par facette), à partir des faits PUBLICS encore au journal, les plus récents pesant plus lourd
 * (−20 % par saison d'ancienneté). Avec un observateur : réputation PERÇUE (phase 8c), qui ajoute les faits privés qu'il connaît.
 */
export function reputation(monde: Monde, idActeur: string, observateur?: string): Reputation {
  const r: Reputation = { paroleTenue: 0, fideliteAuPersonnel: 0, impitoyable: 0, formateur: 0 };
  for (const e of Object.values(monde.evenements)) {
    if (!e.acteurs.some((a) => a.id === idActeur && a.role === 'auteur')) continue;
    // Phase 8c (réputation perçue) : un observateur tient compte aussi des faits privés qu'il connaît, selon ce qu'il en croit.
    const percu = e.visibilite === 'public' ? 1 : observateur ? poidsPercu(monde, e, observateur) : 0;
    if (!percu) continue;
    const poids = percu * Math.pow(0.8, monde.date.annee - e.date.annee);
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
