/**
 * Mémoire v1 (phase 4) : souvenirs, relations, résidu, réconciliation.
 * Conception : docs/systemes/memoire.md, phase-4-contrats-memoire.md §4, D-070.
 *
 * Principe anti-double comptage (D-070) : les souvenirs agissent sur les décisions UNIQUEMENT à travers
 * les relations (confiance, respect, affinité). Le calcul d'utilité lit les relations, jamais les souvenirs
 * directement, et jamais le moral.
 */

import { PASSE } from '../../balance/histoire';
import {
  LIEN_SOCIAL,
  ETIQUETTES, FAMILIARITE_MENSUELLE, RECONCILIATION, RESIDU, RETOUR_BASE_MENSUEL, SATURATION, SEUIL_CREATION_SOUVENIR,
  SEUIL_EFFACEMENT_SOUVENIR, SOUVENIRS_MAX_PAR_PERSONNE, TRAIT_OUBLI, PROXIMITE,
} from '../../balance/memoire';
import { rangSemaine, type DateJeu } from '../../core/calendrier';
import { nouvelIdentifiant } from '../../core/identifiants';
import { idsTries, table, type Entite, type Monde } from '../../core/monde';
import type { Systeme } from '../../core/moteur';
import { TABLES, type Personne } from '../../model/types';
import { COMPETENCES_TRANSVERSALES, VALEURS } from '../../balance/personnages';
import { niveauPilote } from '../saison/performance';
import { SEMAINES_PAR_AN } from '../../balance/calendrier';

export const TABLE_SOUVENIRS = 'souvenirs';
export const TABLE_RELATIONS = 'relations';

export interface Souvenir {
  id: string;
  porteur: string;
  /** Événement d'origine (protégé du compactage tant que le souvenir existe). */
  evenement: string;
  /** Personne ou organisation visée ; égal au porteur pour un souvenir envers soi-même. */
  cible: string;
  etiquette: string;
  ressenti: number;
  intensite: number;
  creeLe: DateJeu;
  renforceLe: DateJeu;
}

export interface Axes {
  confiance: number;
  respect: number;
  affinite: number;
}

export interface Relation {
  id: string;
  de: string;
  vers: string;
  /** Part durable de chaque axe (nourrie par les résidus, revient lentement vers 0). */
  base: Axes;
  /** Connaissance de l'autre (0 à 1). Amplifie les souvenirs, grandit en travaillant ensemble. Durable : on ne « désapprend » pas quelqu'un. */
  familiarite: number;
  /**
   * D-152 : dernière collaboration ou interaction directe (rang de semaine, `rangSemaine`). Absent = proximité entière.
   * La proximité (part du lien social) s'estompe avec les années sans contact ; la familiarité, elle, reste.
   */
  contact?: number;
}

/** D-152 : note un contact entre deux personnes (collaboration, interaction directe) à la date courante. */
export function noterContact(monde: Monde, r: Relation): void {
  r.contact = rangSemaine(monde.date);
}

/** D-152 : proximité actuelle (0 à 1) : moitié tous les `PROXIMITE.demiVieAnnees` ans sans contact. */
export function proximite(monde: Monde, r: Relation | undefined): number {
  if (!r || r.contact === undefined) return 1;
  const annees = Math.max(0, rangSemaine(monde.date) - r.contact) / SEMAINES_PAR_AN;
  return Math.pow(0.5, annees / PROXIMITE.demiVieAnnees);
}

export interface RelationCalculee extends Axes {
  familiarite: number;
}

const borner = (x: number, min = -1, max = 1) => Math.min(max, Math.max(min, x));
const idRelation = (de: string, vers: string) => `rel_${de}__${vers}`;

export function personne(monde: Monde, id: string): Personne | undefined {
  return table(monde, TABLES.personnes)[id] as unknown as Personne | undefined;
}

export function souvenirsDe(monde: Monde, porteur: string): Souvenir[] {
  // Performance (audit n°4) : filtrer d'abord, trier ensuite (même ordre qu'avant, sans trier toute la table à chaque appel).
  return (Object.values(table(monde, TABLE_SOUVENIRS)) as unknown as Souvenir[]).filter((s) => s.porteur === porteur).sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

/** Index des souvenirs par porteur, en un seul passage (pour les traitements de masse). */
export function indexSouvenirs(monde: Monde): Map<string, Souvenir[]> {
  const t = table(monde, TABLE_SOUVENIRS);
  const res = new Map<string, Souvenir[]>();
  for (const id of idsTries(t)) {
    const s = t[id] as unknown as Souvenir;
    const l = res.get(s.porteur);
    if (l) l.push(s);
    else res.set(s.porteur, [s]);
  }
  return res;
}

export function relationBrute(monde: Monde, de: string, vers: string, creer = false): Relation | undefined {
  const t = table(monde, TABLE_RELATIONS);
  const id = idRelation(de, vers);
  let r = t[id] as unknown as Relation | undefined;
  if (!r && creer) {
    r = { id, de, vers, base: { confiance: 0, respect: 0, affinite: 0 }, familiarite: 0 };
    t[id] = r as unknown as Entite;
  }
  return r;
}

/** Relation de « de » vers « vers » : base durable + effet des souvenirs actifs envers la cible. */
export function relation(monde: Monde, de: string, vers: string, souvenirsDuPorteur?: Souvenir[]): RelationCalculee {
  const r = relationBrute(monde, de, vers);
  const res: RelationCalculee = { confiance: r?.base.confiance ?? 0, respect: r?.base.respect ?? 0, affinite: r?.base.affinite ?? 0, familiarite: r?.familiarite ?? 0 };
  // Performance : les souvenirs du porteur peuvent être fournis par l'appelant (mêmes souvenirs, même ordre, pour toute une série de calculs).
  for (const s of souvenirsDuPorteur ?? souvenirsDe(monde, de)) {
    if (s.cible !== vers || s.cible === s.porteur) continue;
    const def = ETIQUETTES[s.etiquette];
    if (!def) continue;
    const effet = s.ressenti * s.intensite;
    res.confiance += effet * def.axes.confiance;
    res.respect += effet * def.axes.respect;
    res.affinite += effet * def.axes.affinite;
  }
  // D-139 : lien social entre deux personnes (affinité naturelle et respect professionnel, en proportion de la familiarité).
  // D-152 : pondéré par la proximité actuelle (les années sans travailler ensemble l'estompent ; la familiarité reste).
  if (res.familiarite > 0) {
    const a = table(monde, TABLES.personnes)[de] as unknown as Personne | undefined;
    const b = a ? (table(monde, TABLES.personnes)[vers] as unknown as Personne | undefined) : undefined;
    if (a && b) {
      const l = lienNaturel(a, b);
      const k = res.familiarite * proximite(monde, r);
      res.affinite += l.affinite * k;
      res.respect += l.respect * k;
    }
  }
  res.confiance = borner(res.confiance);
  res.respect = borner(res.respect);
  res.affinite = borner(res.affinite);
  return res;
}

const CLES_VALEURS = Object.keys(VALEURS);
const TRANSVERSALES = new Set<string>(COMPETENCES_TRANSVERSALES);

/** Niveau de métier d'une personne (sans dépendre des systèmes humains) : pilote, niveau général ; autres, moyenne des compétences de métier. */
function niveauDe(p: Personne): number {
  if (p.poste.startsWith('pilote')) return niveauPilote(p, false);
  let s = 0, n = 0;
  for (const [c, v] of Object.entries(p.competences)) if (!TRANSVERSALES.has(c)) { s += v; n++; }
  return n ? s / n : 10;
}

/** Affinité naturelle (valeurs proches, sociabilité) et respect professionnel de A envers B, avant familiarité (D-137, D-139). */
export function lienNaturel(a: Personne, b: Personne): { affinite: number; respect: number } {
  let ecart = 0;
  for (const k of CLES_VALEURS) ecart += Math.abs((a.valeurs[k] ?? 10) - (b.valeurs[k] ?? 10));
  const compat = 1 - ecart / CLES_VALEURS.length / 20;
  const sociabilite = ((a.traits['sociabilite'] ?? 10) + (b.traits['sociabilite'] ?? 10)) / 40;
  return {
    affinite: LIEN_SOCIAL.poidsAffinite * (compat - LIEN_SOCIAL.compatibiliteNeutre) * (LIEN_SOCIAL.sociabiliteBase + sociabilite),
    respect: borner((niveauDe(b) - LIEN_SOCIAL.niveauNeutre) / LIEN_SOCIAL.echelleNiveau),
  };
}

function noteDe(p: Personne, cle: string): number {
  const [type, nom] = cle.split(':') as [string, string];
  return (type === 't' ? p.traits[nom] : p.valeurs[nom]) ?? 10.5;
}

export interface ContexteLecture {
  /**
   * Multiplicateur de contexte (D-070) : justification d'un refus, gravité d'une promesse rompue,
   * importance d'un engagement, caractère public… 1 = neutre.
   */
  facteur?: number;
}

/**
 * Grille de lecture : transforme un événement vécu par une personne en souvenir (ou renforce un souvenir existant).
 * Renvoie le souvenir créé ou renforcé, ou null si l'événement ne marque pas.
 */
export function lireEvenement(monde: Monde, porteurId: string, cible: string, etiquette: string, idEvenement: string, ctx: ContexteLecture = {}): Souvenir | null {
  const p = personne(monde, porteurId);
  const def = ETIQUETTES[etiquette];
  if (!p || !def) return null;
  let amplification = 1;
  for (const [cle, poids] of Object.entries(def.amplificateurs)) amplification *= Math.max(0.2, 1 + (poids * (noteDe(p, cle) - 10.5)) / 10);
  const familiarite = cible === porteurId ? 1 : (relationBrute(monde, porteurId, cible)?.familiarite ?? 0);
  const intensite = Math.min(1, def.intensite * amplification * (ctx.facteur ?? 1) * (0.8 + 0.4 * familiarite));
  if (intensite < SEUIL_CREATION_SOUVENIR) return null;

  // Renforcement d'un souvenir existant (même étiquette, même cible), avec saturation.
  const existant = souvenirsDe(monde, porteurId).find((s) => s.etiquette === etiquette && s.cible === cible);
  if (existant) {
    const recent = rangSemaine(monde.date) - rangSemaine(existant.renforceLe) < SATURATION.semaines;
    if (recent) {
      // Saturation (D-070) : des répétitions rapprochées ne dépassent pas 1,2 fois l'effet d'un seul événement.
      const plafond = Math.max(existant.intensite, Math.min(1, intensite * SATURATION.plafondRepetition));
      existant.intensite = Math.min(plafond, existant.intensite + intensite * (1 - existant.intensite) * SATURATION.facteur);
    } else {
      existant.intensite = Math.min(1, existant.intensite + intensite * (1 - existant.intensite) * 0.6);
    }
    existant.renforceLe = { ...monde.date };
    existant.evenement = idEvenement;
    return existant;
  }

  const s: Souvenir = {
    id: nouvelIdentifiant(monde, 'mem'),
    porteur: porteurId,
    evenement: idEvenement,
    cible,
    etiquette,
    ressenti: def.ressenti,
    intensite,
    creeLe: { ...monde.date },
    renforceLe: { ...monde.date },
  };
  table(monde, TABLE_SOUVENIRS)[s.id] = s as unknown as Entite;
  if (cible !== porteurId) relationBrute(monde, porteurId, cible, true);

  // Plafond de souvenirs par personne : le plus faible s'efface, avec son résidu.
  const tous = souvenirsDe(monde, porteurId);
  if (tous.length > SOUVENIRS_MAX_PAR_PERSONNE) {
    // Audit 4.13 : le nouveau souvenir fait partie des candidats (s'il est le plus faible, c'est lui qui s'efface, avec son résidu).
    const plusFaible = [...tous].sort((a, b) => a.intensite - b.intensite || (a.id < b.id ? -1 : 1))[0];
    if (plusFaible) effacer(monde, plusFaible);
  }
  return s;
}

/**
 * Audit n°5 : la mémoire résiduelle se forme PROGRESSIVEMENT pendant l'oubli naturel. À chaque baisse d'intensité due au temps,
 * une part (selon le trait du porteur) de l'effet perdu est versée dans la base durable de la relation. La trace laissée reste
 * proportionnelle à la force du souvenir, sans saut brutal à l'effacement.
 */
function verserResidu(monde: Monde, s: Souvenir, baisse: number): void {
  const p = personne(monde, s.porteur);
  const def = ETIQUETTES[s.etiquette];
  if (!p || !def || s.cible === s.porteur || baisse <= 0) return;
  const trait = s.ressenti < 0 ? TRAIT_OUBLI.negatifAutrui : TRAIT_OUBLI.positifAutrui;
  const part = RESIDU.min + ((p.traits[trait] ?? 10) / 20) * (RESIDU.max - RESIDU.min);
  ajouterABase(monde, s, s.ressenti * baisse * part);
}

function ajouterABase(monde: Monde, s: Souvenir, effet: number): void {
  const def = ETIQUETTES[s.etiquette];
  if (!def || s.cible === s.porteur) return;
  const r = relationBrute(monde, s.porteur, s.cible, true) as Relation;
  r.base.confiance = borner(r.base.confiance + effet * def.axes.confiance);
  r.base.respect = borner(r.base.respect + effet * def.axes.respect);
  r.base.affinite = borner(r.base.affinite + effet * def.axes.affinite);
}

/**
 * Efface un souvenir. Audit n°5 : continuité de la relation — l'effet qu'il exerçait encore (intensité actuelle) passe dans la base
 * durable, ni plus ni moins. Un effacement ne peut donc ni aggraver ni améliorer brutalement la relation.
 */
export function effacer(monde: Monde, s: Souvenir): void {
  if (personne(monde, s.porteur)) ajouterABase(monde, s, s.ressenti * s.intensite);
  delete table(monde, TABLE_SOUVENIRS)[s.id];
}

/** Multiplicateur de vitesse d'oubli selon les traits (D-070 : la rancune agit sur la durée). */
function multiplicateurOubli(p: Personne, s: Souvenir): number {
  const trait = s.cible === s.porteur ? TRAIT_OUBLI.soiMeme : s.ressenti < 0 ? TRAIT_OUBLI.negatifAutrui : TRAIT_OUBLI.positifAutrui;
  return 1.5 - (p.traits[trait] ?? 10) / 20;
}

/** Oubli mensuel, effacement avec résidu, retour lent des bases vers zéro, familiarité entre collègues. */
export function passerUnMois(monde: Monde): void {
  oublierUnMois(monde);
  familiariserUnMois(monde);
}

/** Oubli d'un mois : intensité des souvenirs (avec résidu) et retour lent des bases durables vers zéro. */
export function oublierUnMois(monde: Monde): void {
  const ts = table(monde, TABLE_SOUVENIRS);
  for (const id of idsTries(ts)) {
    const s = ts[id] as unknown as Souvenir;
    const p = personne(monde, s.porteur);
    const def = ETIQUETTES[s.etiquette];
    if (!p || !def) {
      delete ts[id];
      continue;
    }
    const baisse = s.intensite * def.oubli * multiplicateurOubli(p, s);
    s.intensite -= baisse;
    verserResidu(monde, s, baisse); // trace progressive de l'oubli naturel (audit n°5)
    if (s.intensite < SEUIL_EFFACEMENT_SOUVENIR) effacer(monde, s);
  }
  const tr = table(monde, TABLE_RELATIONS);
  for (const id of idsTries(tr)) {
    const r = tr[id] as unknown as Relation;
    for (const axe of ['confiance', 'respect', 'affinite'] as const) r.base[axe] *= 1 - RETOUR_BASE_MENSUEL;
  }
}

/** Familiarité d'un mois entre collègues individualisés d'une même écurie (et chacun envers son écurie). */
function familiariserUnMois(monde: Monde): void {
  // Familiarité : collègues individualisés d'une même écurie (et chacun envers son écurie).
  const tp = table(monde, TABLES.personnes);
  const parEcurie = new Map<string, string[]>();
  for (const id of idsTries(tp)) {
    const p = tp[id] as unknown as Personne;
    if (p.statut === 'actif' && p.ecurie) parEcurie.set(p.ecurie, [...(parEcurie.get(p.ecurie) ?? []), p.id]);
  }
  for (const [ecurie, membres] of parEcurie) {
    for (const a of membres) {
      const ra = relationBrute(monde, a, ecurie, true) as Relation;
      ra.familiarite = Math.min(1, ra.familiarite + FAMILIARITE_MENSUELLE);
      for (const b of membres) {
        if (a === b) continue;
        const r = relationBrute(monde, a, b, true) as Relation;
        r.familiarite = Math.min(1, r.familiarite + FAMILIARITE_MENSUELLE);
        noterContact(monde, r);
      }
    }
  }
}

/**
 * Réconciliation (D-070) : réduit l'intensité des souvenirs négatifs de « destinataire » envers « auteur ».
 * La rancune du destinataire freine la réconciliation ; un geste répété récemment compte beaucoup moins.
 */
export function reconcilier(monde: Monde, destinataire: string, auteur: string, type: keyof typeof RECONCILIATION, dejaRecent: boolean): number {
  const p = personne(monde, destinataire);
  if (!p) return 0;
  const reduction = RECONCILIATION[type] * (1.5 - (p.traits['rancune'] ?? 10) / 20) * (dejaRecent ? SATURATION.facteur : 1);
  let total = 0;
  for (const s of souvenirsDe(monde, destinataire)) {
    if (s.cible !== auteur || s.ressenti >= 0) continue;
    // Ce que la réconciliation efface est pardonné : aucune part ne passe dans la mémoire résiduelle (audit n°5).
    const avant = s.intensite;
    s.intensite *= 1 - Math.min(0.9, reduction);
    total += avant - s.intensite;
    if (s.intensite < SEUIL_EFFACEMENT_SOUVENIR) effacer(monde, s);
  }
  return total;
}

/** Identifiants d'événements cités par des souvenirs : à protéger du compactage du journal. */
export function evenementsProteges(monde: Monde): string[] {
  return Object.values(table(monde, TABLE_SOUVENIRS)).map((s) => (s as unknown as Souvenir).evenement);
}

export const systemeOubli: Systeme = {
  nom: 'memoire.oubli',
  executer({ monde, date }) {
    // Audit 4.14 : 12 passages par an, au changement de mois (comme le passé reconstruit), et non toutes les 4 semaines (13 par an).
    const mois = (s: number) => Math.floor((s - 1) / PASSE.semainesParMois);
    if (date.semaine > 1 && mois(date.semaine) !== mois(date.semaine - 1)) passerUnMois(monde);
    else if (date.semaine === 1) passerUnMois(monde);
  },
};
