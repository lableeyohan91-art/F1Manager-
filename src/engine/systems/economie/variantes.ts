/**
 * Phase 11c — variantes d'un contrat de sponsoring (docs/systemes/phase-11c-sponsoring.md §2 et §4, D-155).
 *
 * - La prudente est le contrat d'avant la refonte : fixe, et une prime de classement (20 % du fixe).
 * - L'équilibrée et l'audacieuse remplacent une part de sa valeur attendue E par des primes. Chaque prime vaut sa part ÷ la
 *   probabilité que le sponsor accorde à la clause : même valeur attendue pour lui, à sa marge de risque près.
 *   Une clause improbable paie donc beaucoup quand elle est tenue (D-155 question 2 : un pari réussi doit valoir le coup).
 * - Engagement ferme : le maximum à payer ne dépasse pas le budget F1 du sponsor ; sinon, clause moins difficile, ou pas de variante.
 * Fonction pure : aucun effet sur le monde.
 */

import { CLAUSES_PAR_IMAGE, ENGAGEMENT_MAX_PART_BUDGET, PRIME_MAX_MULTIPLE_VALEUR, ENVELOPPE_GP_TITRE, PROBA_CLAUSE, PROGRESSION_MAX_PLACES, VARIANTES } from '../../balance/sponsoring';
import type { ClauseSponsor, TypeClause, VarianteContrat, VarianteOffre } from '../../model/types';
import { probaClause } from './probabilites';

const r1 = (x: number) => Math.round(x * 10) / 10;
const r3 = (x: number) => Math.round(x * 1000) / 1000;
const logit = (p: number) => Math.log(Math.max(1e-4, p) / Math.max(1e-4, 1 - p));

export interface ParametresVariantes {
  /** Montant fixe annuel du contrat prudent (M€) : celui d'avant la refonte. */
  montantMEUR: number;
  /** Prime du contrat prudent, en part du fixe. */
  partPrime: number;
  /** Objectif de classement du contrat prudent (celui d'avant la refonte). */
  objectifRang: number;
  /** Rang attendu public, nombre d'écuries, nombre de Grands Prix. */
  rangAttendu: number;
  ecuries: number;
  grandsPrix: number;
  /** Dernier classement constructeurs (pour une clause de progression). */
  rangDernier?: number;
  /** Image recherchée par le sponsor (types de clauses préférés). */
  image: string;
  /** Budget F1 du sponsor (budget × conjoncture). */
  budgetF1MEUR: number;
  titre: boolean;
}

/** Une progression est un objectif de classement : jamais deux clauses de classement au même seuil. */
const CLASSEMENT = new Set<TypeClause>(['rang', 'progression']);

interface Candidate { type: TypeClause; seuil: number; p: number; ordre: number }

function candidates(x: ParametresVariantes): Candidate[] {
  const types = CLAUSES_PAR_IMAGE[x.image] ?? CLAUSES_PAR_IMAGE['resultats']!;
  const res: Candidate[] = [];
  const ajouter = (type: TypeClause, seuil: number) => {
    const p = probaClause(type, seuil, x.rangAttendu, x.ecuries, x.grandsPrix);
    if (p >= PROBA_CLAUSE.min && p <= PROBA_CLAUSE.max) res.push({ type, seuil, p, ordre: types.indexOf(type) });
  };
  for (const t of types) {
    if (t === 'rang') for (let k = 1; k < x.ecuries; k++) ajouter('rang', k);
    else if (t === 'progression') { if (x.rangDernier) for (let n = 1; n <= PROGRESSION_MAX_PLACES; n++) if (x.rangDernier - n >= 1) ajouter('progression', x.rangDernier - n); }
    else if (t === 'arrivees_points') for (let m = 1; m <= x.grandsPrix; m++) ajouter('arrivees_points', m);
    else ajouter(t, 1);
  }
  return res;
}

/** Choisit la clause la plus proche de la probabilité visée, parmi celles que le sponsor peut payer (p ≥ pMin). */
function choisirClause(c: Candidate[], visee: number, pMin: number, exclus: Set<TypeClause>, prises: Candidate[]): Candidate | undefined {
  let best: Candidate | undefined, score = Infinity;
  for (const k of c) {
    if (k.p < pMin || exclus.has(k.type) || prises.some((x) => x.seuil === k.seuil && (x.type === k.type || (CLASSEMENT.has(x.type) && CLASSEMENT.has(k.type))))) continue;
    const s = Math.abs(logit(k.p) - logit(visee)) + 0.15 * k.ordre;
    if (s < score - 1e-9) { score = s; best = k; }
  }
  return best;
}

/** Les variantes proposées par un sponsor pour un emplacement titre ou principal (la prudente toujours ; les autres si le sponsor peut tenir ses engagements). */
export function construireVariantes(x: ParametresVariantes): VarianteOffre[] {
  const V = x.montantMEUR;
  const pPrudente = probaClause('rang', x.objectifRang, x.rangAttendu, x.ecuries, x.grandsPrix);
  const primePrudente = V * x.partPrime;
  const E = V + primePrudente * pPrudente;
  const env = x.titre ? E * ENVELOPPE_GP_TITRE : 0;
  const plafond = x.budgetF1MEUR * ENGAGEMENT_MAX_PART_BUDGET;
  const fin = (variante: VarianteContrat, fixe: number, clauses: ClauseSponsor[]): VarianteOffre => ({
    variante, fixeMEUR: r1(fixe), clauses, ...(env ? { enveloppeGPMEUR: r1(env) } : {}),
    valeurAttendueMEUR: r1(fixe + clauses.reduce((a, c) => a + c.primeMEUR * c.probabilite, 0) + env),
    maximumMEUR: r1(fixe + clauses.reduce((a, c) => a + c.primeMEUR, 0) + env),
  });
  const res: VarianteOffre[] = [fin('prudente', V - env, [{ type: 'rang', seuil: x.objectifRang, primeMEUR: r1(primePrudente), probabilite: r3(pPrudente) }])];
  const cands = candidates(x);
  for (const v of ['equilibree', 'audacieuse'] as const) {
    const def = VARIANTES[v];
    const fixe = E * (1 - def.partVariable) - env;
    const evClause = (E * def.partVariable * (1 - def.decote)) / def.nbClauses;
    const marge = (plafond - fixe - env) / def.nbClauses;
    if (marge <= 0 || fixe <= 0) continue;
    // Engagement ferme (moyens du sponsor) et prudence (multiple de la valeur du contrat) : probabilité minimale d'une clause.
    const pMin = Math.max(evClause / marge, evClause / (PRIME_MAX_MULTIPLE_VALEUR * E));
    const clauses: ClauseSponsor[] = [];
    const prises: Candidate[] = [];
    const exclus = new Set<TypeClause>();
    for (let i = 0; i < def.nbClauses; i++) {
      // Deux types différents si possible ; sinon deux paliers du même type.
      const k = choisirClause(cands, def.probaVisee, pMin, exclus, prises) ?? choisirClause(cands, def.probaVisee, pMin, new Set(), prises);
      if (!k) break;
      prises.push(k);
      exclus.add(k.type);
      if (k.type === 'rang') exclus.add('progression');
      if (k.type === 'progression') exclus.add('rang');
      clauses.push({ type: k.type, seuil: k.seuil, primeMEUR: r1(evClause / k.p), probabilite: r3(k.p) });
    }
    if (clauses.length === def.nbClauses) res.push(fin(v, fixe, clauses));
  }
  return res;
}
