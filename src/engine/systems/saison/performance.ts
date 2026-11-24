/** Calculs de performance partagés par les systèmes de la saison (phase 3). */

import { ALTITUDE_REFERENCE_M, CARACTERISTIQUES_VITESSE, POIDS_VOITURE_PAR_EXIGENCE } from '../../balance/circuits';
import { PART_PLUIE_DANS_RYTHME, POIDS_PILOTE } from '../../balance/course';
import { COMPETENCES_RYTHME } from '../../balance/personnages';
import { idsTries, table, type Monde } from '../../core/monde';
import { TABLES, type Circuit, type Ecurie, type ExigencesCircuit, type Motoriste, type Personne, type Voiture } from '../../model/types';

/** Exigences d'un circuit neutre (toutes à 3) : niveau « général » d'un pilote, statistiques. */
export const EXIGENCES_NEUTRES: ExigencesCircuit = { lents: 3, rapides: 3, freinage: 3, motricite: 3, lignesDroites: 3, degradationPneus: 3, exigencePhysique: 3, difficulte: 3, risqueAccident: 3 };

export function ecuriesActives(monde: Monde): Ecurie[] {
  const t = table(monde, TABLES.ecuries);
  return idsTries(t).map((id) => t[id] as unknown as Ecurie).filter((e) => e.statut === 'active');
}

export function voitureDe(monde: Monde, idEcurie: string): Voiture {
  const v = (Object.values(table(monde, TABLES.voitures)) as unknown as Voiture[]).find((x) => x.ecurie === idEcurie);
  if (!v) throw new Error(`Aucune voiture pour l'écurie ${idEcurie}`);
  return v;
}

/** La motorisation d'une voiture est le niveau de son motoriste. */
export function motorisation(monde: Monde, ecurie: Ecurie): number {
  return (table(monde, TABLES.motoristes)[ecurie.motoriste] as unknown as Motoriste | undefined)?.niveau ?? 10;
}

/** Valeur d'une caractéristique de vitesse (la motorisation vient du motoriste). */
export function caracteristique(monde: Monde, ecurie: Ecurie, v: Voiture, c: (typeof CARACTERISTIQUES_VITESSE)[number]): number {
  return c === 'motorisation' ? motorisation(monde, ecurie) : v[c];
}

/** Poids des caractéristiques de la voiture sur un circuit (D-107), normalisés à 1. */
export function poidsVoiture(circuit: Pick<Circuit, 'exigences' | 'altitudeM' | 'poidsProfil'>): Record<(typeof CARACTERISTIQUES_VITESSE)[number], number> {
  // Phase 11b : poids issus du profil de vitesse sur le tracé réel, quand une campagne les a injectés (expérience, D-159).
  if (circuit.poidsProfil) return circuit.poidsProfil as Record<(typeof CARACTERISTIQUES_VITESSE)[number], number>;
  const brut = {} as Record<(typeof CARACTERISTIQUES_VITESSE)[number], number>;
  let total = 0;
  for (const c of CARACTERISTIQUES_VITESSE) {
    let w = 0;
    for (const [ex, k] of Object.entries(POIDS_VOITURE_PAR_EXIGENCE[c])) w += (k ?? 0) * (circuit.exigences[ex as keyof ExigencesCircuit] ?? 3);
    if (c === 'motorisation') w *= 1 + Math.max(0, circuit.altitudeM) / ALTITUDE_REFERENCE_M;
    brut[c] = w;
    total += w;
  }
  for (const c of CARACTERISTIQUES_VITESSE) brut[c] /= total || 1;
  return brut;
}

/** Indice de performance d'une voiture sur un circuit (moyenne pondérée des caractéristiques selon ses exigences). */
export function indiceSurCircuit(monde: Monde, ecurie: Ecurie, circuit: Pick<Circuit, 'exigences' | 'altitudeM' | 'poidsProfil'>): number {
  const v = voitureDe(monde, ecurie.id);
  const poids = poidsVoiture(circuit);
  let s = 0;
  for (const c of CARACTERISTIQUES_VITESSE) s += poids[c] * caracteristique(monde, ecurie, v, c);
  return s;
}

/** Indice moyen (toutes caractéristiques de vitesse à poids égal) : sert aux statistiques. */
export function indiceMoyen(monde: Monde, ecurie: Ecurie): number {
  const v = voitureDe(monde, ecurie.id);
  let s = 0;
  for (const c of CARACTERISTIQUES_VITESSE) s += caracteristique(monde, ecurie, v, c);
  return s / CARACTERISTIQUES_VITESSE.length;
}

/**
 * Poids des compétences d'un pilote sur un circuit (D-104) : le rythme est réparti entre freinage, virages lents,
 * virages rapides et motricité selon les exigences ; pneus et condition sont modulés ; sous la pluie, une part du rythme
 * passe à la compétence « pluie ». Somme = 1 (influence totale du pilote inchangée).
 */
export function poidsPilote(exigences: ExigencesCircuit, pluie: boolean): Record<string, number> {
  const demande: Record<string, number> = { freinage: exigences.freinage, viragesLents: exigences.lents, viragesRapides: exigences.rapides, motricite: exigences.motricite };
  const totalDemande = COMPETENCES_RYTHME.reduce((a, c) => a + (demande[c] ?? 0), 0) || 1;
  const rythme = POIDS_PILOTE['rythme'] ?? 0;
  const partSec = pluie ? 1 - PART_PLUIE_DANS_RYTHME : 1;
  const w: Record<string, number> = {};
  for (const c of COMPETENCES_RYTHME) w[c] = rythme * partSec * ((demande[c] ?? 0) / totalDemande);
  if (pluie) w['pluie'] = rythme * PART_PLUIE_DANS_RYTHME;
  for (const [c, x] of Object.entries(POIDS_PILOTE)) {
    if (c === 'rythme') continue;
    w[c] = x * (c === 'gestionPneus' ? exigences.degradationPneus / 3 : c === 'condition' ? exigences.exigencePhysique / 3 : 1);
  }
  const total = Object.values(w).reduce((a, b) => a + b, 0) || 1;
  for (const c of Object.keys(w)) w[c]! /= total;
  return w;
}

/** Niveau d'un pilote (1–20) sur un circuit (par défaut : circuit neutre, utilisé pour les statistiques et la valeur de marché). */
export function niveauPilote(p: Personne, pluie: boolean, exigences: ExigencesCircuit = EXIGENCES_NEUTRES): number {
  let s = 0;
  for (const [c, poids] of Object.entries(poidsPilote(exigences, pluie))) s += poids * (p.competences[c] ?? 10);
  return s;
}

/** Pilotes titulaires actifs, par écurie (ordre des identifiants). */
export function pilotesTitulaires(monde: Monde): Personne[] {
  const t = table(monde, TABLES.personnes);
  return idsTries(t)
    .map((id) => t[id] as unknown as Personne)
    .filter((p) => p.statut === 'actif' && p.poste === 'pilote_titulaire' && p.ecurie);
}
