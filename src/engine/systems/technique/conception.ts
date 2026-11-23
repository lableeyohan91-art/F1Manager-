/**
 * Phase 8 — conversion PROVISOIRE du savoir en performance (D-132, question 1).
 *
 * Ce fichier est volontairement isolé : il fait le lien entre les 12 domaines techniques et les 6 caractéristiques abstraites
 * des voitures de la phase 3. Il sera remplacé par la conception des voitures de la phase 12. Tous ses coefficients sont
 * dans `balance/technique.ts` (CONCEPTION_PROVISOIRE, poids `caracs` des domaines).
 */

import { CONCEPTION_PROVISOIRE, DOMAINES, LISTE_DOMAINES, type CaracVoiture } from '../../balance/technique';
import { BORNES_CARACTERISTIQUE, PLAFOND_TECHNIQUE } from '../../balance/developpement';
import { ajouterEvenement } from '../../core/evenements';
import { table, type Monde } from '../../core/monde';
import { tirageLocal } from '../../core/moteur';
import { TABLES, type Ecurie, type Personne, type Voiture } from '../../model/types';
import { reglementEnVigueur, savoirApplicable } from './acces';

export const CARACS: readonly CaracVoiture[] = ['viragesLents', 'viragesRapides', 'vitessePointe', 'efficaciteAero', 'fiabilite', 'gestionPneus'];

const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));
const r3 = (x: number) => Math.round(x * 1000) / 1000;

/** Poids d'un domaine sur une caractéristique (0 si sans lien). */
const poids = (d: (typeof LISTE_DOMAINES)[number], c: CaracVoiture) => (DOMAINES[d].caracs as Partial<Record<CaracVoiture, number>>)[c] ?? 0;

/** Moyenne pondérée, sur les domaines liés à la caractéristique, d'une valeur par domaine. */
export function parCaracteristique(c: CaracVoiture, valeur: (d: (typeof LISTE_DOMAINES)[number]) => number): number {
  let total = 0, somme = 0;
  for (const d of LISTE_DOMAINES) {
    const w = poids(d, c);
    if (!w) continue;
    total += w;
    somme += w * valeur(d);
  }
  return total ? somme / total : 0;
}

function voiture(monde: Monde, idEcurie: string): Voiture | undefined {
  return (Object.values(table(monde, TABLES.voitures)) as unknown as Voiture[]).find((v) => v.ecurie === idEcurie);
}

/** Compétence technique d'une écurie pour une caractéristique (sur 20) : compétences utiles des domaines liés, DT et responsables. */
function competencePour(monde: Monde, idEcurie: string, c: CaracVoiture): number {
  const equipe = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).filter((p) => p.statut === 'actif' && p.ecurie === idEcurie
    && (p.poste === 'directeur_technique' || p.poste === 'responsable_aero' || p.poste === 'responsable_conception'));
  return parCaracteristique(c, (d) => {
    const v: number[] = [];
    for (const comp of DOMAINES[d].competences) for (const p of equipe) if (p.competences[comp] !== undefined) v.push(p.competences[comp]!);
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 10;
  });
}

/**
 * Bonus du savoir au développement de la saison (multiplicateur ≥ 1) pour une caractéristique :
 * savoir applicable au règlement en vigueur, dans les domaines liés.
 */
export function bonusSavoirDeveloppement(monde: Monde, idEcurie: string, c: CaracVoiture): number {
  const idR = reglementEnVigueur(monde)?.id;
  const s = parCaracteristique(c, (d) => savoirApplicable(monde, idEcurie, d, idR));
  return 1 + (CONCEPTION_PROVISOIRE.bonusDeveloppement * s) / CONCEPTION_PROVISOIRE.echelle;
}

/**
 * Reconception (entrée d'un règlement ou évolution mineure) : chaque caractéristique se rapproche de la moyenne de la grille,
 * dans la mesure de l'intensité du changement, puis s'en écarte selon la préparation (savoir), la compétence et l'exécution.
 * Toutes les écuries sont reconçues à partir de la même grille de départ (calcul en deux temps).
 */
export function reconcevoirGrille(monde: Monde, ecuries: Ecurie[], intensites: Record<string, number>, idReglement: string, cle: string): void {
  const voitures = ecuries.map((e) => ({ e, v: voiture(monde, e.id) })).filter((x): x is { e: Ecurie; v: Voiture } => !!x.v);
  if (!voitures.length) return;
  const nouvelles = new Map<string, Partial<Record<CaracVoiture, number>>>();
  const resume: Record<string, Record<string, number>> = {};
  for (const c of CARACS) {
    const I = parCaracteristique(c, (d) => intensites[d] ?? 0);
    if (I <= 0) continue;
    const savoirs = voitures.map(({ e }) => parCaracteristique(c, (d) => savoirApplicable(monde, e.id, d, idReglement)));
    const comps = voitures.map(({ e }) => competencePour(monde, e.id, c));
    const moy = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
    const moyenneGrille = moy(voitures.map(({ v }) => v[c]));
    const moyenneSavoir = moy(savoirs);
    const moyenneComp = moy(comps);
    voitures.forEach(({ e, v }, k) => {
      const ecartSavoir = borner(savoirs[k]! - moyenneSavoir, -CONCEPTION_PROVISOIRE.plafondEcartSavoir, CONCEPTION_PROVISOIRE.plafondEcartSavoir);
      const sigma = CONCEPTION_PROVISOIRE.ecartExecution * Math.max(0, 1 - CONCEPTION_PROVISOIRE.reductionEcartParSavoir * savoirs[k]!);
      const execution = tirageLocal(monde, 'conception', e.id, cle, c).normale(0, sigma);
      const qualite = moyenneGrille + CONCEPTION_PROVISOIRE.parPointSavoir * ecartSavoir + CONCEPTION_PROVISOIRE.parPointCompetence * (comps[k]! - moyenneComp) + execution;
      const valeur = borner(v[c] * (1 - I) + I * qualite, BORNES_CARACTERISTIQUE.min, BORNES_CARACTERISTIQUE.max);
      (nouvelles.get(e.id) ?? nouvelles.set(e.id, {}).get(e.id)!)[c] = valeur;
      (resume[e.id] ??= {})[c] = r3(valeur - v[c]);
    });
  }
  for (const { e, v } of voitures) {
    const n = nouvelles.get(e.id);
    if (!n) continue;
    for (const c of CARACS) if (n[c] !== undefined) v[c] = n[c]!;
    const variation = Object.values(resume[e.id] ?? {}).reduce((a, b) => a + b, 0);
    ajouterEvenement(monde, {
      type: 'technique.reconception', acteurs: [{ id: e.id, role: 'ecurie' }], importance: 1, visibilite: 'prive',
      contexte: { cle, reglement: idReglement, variations: resume[e.id] ?? {}, variationTotale: r3(variation) },
    });
  }
}

/** Savoir préparé « pour la saison suivante » : appliqué à l'intersaison, avec les rendements décroissants du plafond technique. */
export function appliquerPreparation(monde: Monde, e: Ecurie, parDomaine: Record<string, number>): void {
  const v = voiture(monde, e.id);
  if (!v) return;
  const gains: Record<string, number> = {};
  for (const c of CARACS) {
    const pts = parCaracteristique(c, (d) => parDomaine[d] ?? 0);
    if (pts <= 0) continue;
    const gain = CONCEPTION_PROVISOIRE.parPointPreparation * pts * Math.max(0, 1 - v[c] / PLAFOND_TECHNIQUE);
    v[c] = borner(v[c] + gain, BORNES_CARACTERISTIQUE.min, BORNES_CARACTERISTIQUE.max);
    gains[c] = r3(gain);
  }
  ajouterEvenement(monde, {
    type: 'technique.preparation', acteurs: [{ id: e.id, role: 'ecurie' }], importance: 1, visibilite: 'prive',
    contexte: { savoirParDomaine: parDomaine, gains },
  });
}
