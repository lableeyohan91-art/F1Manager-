/**
 * Phase 12a — performance physique d'une voiture sur un circuit (docs/systemes/phase-12-conception-detaillee.md §4, D-170).
 *
 * Paramètres de la voiture (en % de la voiture de référence du profil de vitesse) = somme des effets de ses pièces installées
 * (efficacité et concept) + puissance du motoriste − perte de puissance quand le refroidissement ne suffit pas.
 * Écart de temps au tour (%) = Σ (d1 × x + ½ × d2 × x²) / temps de référence, avec les sensibilités du circuit calculées par le profil de
 * vitesse sur son tracé réel (tools/circuits/sensibilites-voiture.mts). Module pur de lecture : aucune écriture, aucun hasard.
 */

import { EFFICACITE_REFERENCE, MOTORISTE_PUISSANCE, PARAMETRES_SENSIBILITE, PIECES, REFROIDISSEMENT, SENSIBILITES_MOYENNES, type ParametreVoiture, type TypePiece } from '../../balance/monoplaces';
import { table, type Monde } from '../../core/monde';
import { TABLES, type Circuit, type Ecurie, type Motoriste, type PieceVoiture } from '../../model/types';

export type ParametresVoiture = Record<ParametreVoiture, number> & { refroidissement: number };

/** Pièces installées sur la voiture d'une écurie (une par type au plus). */
export function piecesInstallees(monde: Monde, idEcurie: string): PieceVoiture[] {
  return (Object.values(table(monde, TABLES.pieces)) as unknown as PieceVoiture[]).filter((p) => p.ecurie === idEcurie && p.installee);
}

/** Effet d'une pièce sur les paramètres (en %, et en points de marge pour le refroidissement). */
export function effetPiece(type: TypePiece, efficacite: number, concept: number): Partial<ParametresVoiture> {
  const def = PIECES[type];
  const res: Partial<ParametresVoiture> = {};
  const ajouter = (k: string, x: number) => { (res as Record<string, number>)[k] = ((res as Record<string, number>)[k] ?? 0) + x; };
  for (const [k, x] of Object.entries(def.gain)) ajouter(k, (x as number) * (efficacite - EFFICACITE_REFERENCE));
  for (const [k, x] of Object.entries(def.compromis)) ajouter(k, (x as number) * concept);
  return res;
}

/**
 * Cache de calcul (jamais sauvegardé, sans effet sur les résultats) : paramètres de chaque voiture, valables pour la semaine en cours
 * tant qu'aucune pièce n'a changé. Toute écriture sur les pièces appelle `invaliderVoitures`.
 */
const cache = new WeakMap<Monde, { cle: string; voitures: Map<string, ParametresVoiture>; indices: Map<string, number> }>();
function cacheDe(monde: Monde) {
  const cle = `${monde.date.annee}-${monde.date.semaine}`;
  let c = cache.get(monde);
  if (!c || c.cle !== cle) { c = { cle, voitures: new Map(), indices: new Map() }; cache.set(monde, c); }
  return c;
}
export function invaliderVoitures(monde: Monde): void { cache.delete(monde); }
/** Valeur mise en cache pour la semaine (indices moyens, etc.). */
export function enCache(monde: Monde, cle: string, calcul: () => number): number {
  const c = cacheDe(monde);
  const v = c.indices.get(cle);
  if (v !== undefined) return v;
  const x = calcul();
  c.indices.set(cle, x);
  return x;
}

/** Paramètres de la voiture d'une écurie (écarts à la référence, en %), hors circuit. Copie : le résultat peut être modifié. */
export function parametresVoiture(monde: Monde, e: Ecurie): ParametresVoiture {
  const c = cacheDe(monde);
  let p = c.voitures.get(e.id);
  if (!p) { p = calculerParametres(monde, e); c.voitures.set(e.id, p); }
  return { ...p };
}

function calculerParametres(monde: Monde, e: Ecurie): ParametresVoiture {
  const res = Object.fromEntries(PARAMETRES_SENSIBILITE.map((k) => [k, 0])) as ParametresVoiture;
  res.refroidissement = REFROIDISSEMENT.margeReference;
  for (const p of piecesInstallees(monde, e.id)) {
    if (!(p.type in PIECES)) continue;
    for (const [k, x] of Object.entries(effetPiece(p.type as TypePiece, p.efficacite, p.concept))) (res as Record<string, number>)[k]! += x as number;
  }
  const niveau = (table(monde, TABLES.motoristes)[e.motoriste] as unknown as Motoriste | undefined)?.niveau ?? MOTORISTE_PUISSANCE.niveauReference;
  res.puissance += MOTORISTE_PUISSANCE.pourcentParPoint * (niveau - MOTORISTE_PUISSANCE.niveauReference);
  return res;
}

/** Besoin de refroidissement d'un circuit (points) : chaleur du mois et altitude. Mois de 1 à 12 ; sans mois, moyenne de l'année. */
export function besoinRefroidissement(circuit: Pick<Circuit, 'temperatureMensuelle' | 'altitudeM'>, mois?: number): number {
  const t = circuit.temperatureMensuelle;
  const temp = !t ? REFROIDISSEMENT.temperatureNeutreC : mois ? t[mois - 1]! : t.reduce((a, b) => a + b, 0) / t.length;
  return (temp - REFROIDISSEMENT.temperatureNeutreC) * REFROIDISSEMENT.parDegre + Math.max(0, circuit.altitudeM) / REFROIDISSEMENT.altitudeParPoint;
}

/** Perte de puissance (%) quand la marge de refroidissement de la voiture ne couvre pas le besoin du circuit. */
export function perteRefroidissement(marge: number, besoin: number): number {
  return Math.max(0, besoin - marge) * REFROIDISSEMENT.perteParPoint;
}

/**
 * Écart de temps au tour (% ; positif = plus lent que la voiture de référence) d'une voiture de paramètres donnés sur un circuit.
 */
export function ecartTempsPct(p: ParametresVoiture, circuit: Pick<Circuit, 'sensibilites' | 'temperatureMensuelle' | 'altitudeM'>, mois?: number): number {
  // Circuit sans sensibilités propres (partie antérieure au format 31) : sensibilités moyennes des 30 circuits.
  const s = circuit.sensibilites ?? SENSIBILITES_MOYENNES;
  let dt = 0;
  for (const k of PARAMETRES_SENSIBILITE) {
    const x = k === 'puissance' ? p.puissance - perteRefroidissement(p.refroidissement, besoinRefroidissement(circuit, mois)) : p[k];
    dt += (s.d1[k] ?? 0) * x + 0.5 * (s.d2[k] ?? 0) * x * x;
  }
  return (100 * dt) / s.tempsS;
}

/** Écart de temps au tour (%) de la voiture d'une écurie sur un circuit. */
export function ecartTempsEcurie(monde: Monde, e: Ecurie, circuit: Circuit, mois?: number): number {
  return ecartTempsPct(parametresVoiture(monde, e), circuit, mois);
}
