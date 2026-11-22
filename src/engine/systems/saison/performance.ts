/** Calculs de performance partagés par les systèmes de la saison (phase 3). */

import { CARACTERISTIQUES_VITESSE, PROFILS_CIRCUIT } from '../../balance/circuits';
import { PART_PLUIE_DANS_VITESSE, POIDS_PILOTE } from '../../balance/course';
import { idsTries, table, type Monde } from '../../core/monde';
import { TABLES, type Ecurie, type Motoriste, type Personne, type Voiture } from '../../model/types';

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

/** Indice de performance d'une voiture sur un type de circuit (moyenne pondérée des caractéristiques). */
export function indiceSurCircuit(monde: Monde, ecurie: Ecurie, typeCircuit: string): number {
  const v = voitureDe(monde, ecurie.id);
  const profil = PROFILS_CIRCUIT[typeCircuit] ?? PROFILS_CIRCUIT['mixte']!;
  let s = 0;
  for (const c of CARACTERISTIQUES_VITESSE) s += profil[c] * caracteristique(monde, ecurie, v, c);
  return s;
}

/** Indice moyen (toutes caractéristiques de vitesse à poids égal) : sert aux statistiques. */
export function indiceMoyen(monde: Monde, ecurie: Ecurie): number {
  const v = voitureDe(monde, ecurie.id);
  let s = 0;
  for (const c of CARACTERISTIQUES_VITESSE) s += caracteristique(monde, ecurie, v, c);
  return s / CARACTERISTIQUES_VITESSE.length;
}

/** Niveau d'un pilote (1–20) : moyenne pondérée de ses compétences ; sous la pluie, une part de la vitesse devient la pluie. */
export function niveauPilote(p: Personne, pluie: boolean): number {
  let s = 0;
  for (const [c, poids] of Object.entries(POIDS_PILOTE)) {
    const v = p.competences[c] ?? 10;
    if (c === 'vitesse' && pluie) s += poids * ((1 - PART_PLUIE_DANS_VITESSE) * v + PART_PLUIE_DANS_VITESSE * (p.competences['pluie'] ?? v));
    else s += poids * v;
  }
  return s;
}

/** Pilotes titulaires actifs, par écurie (ordre des identifiants). */
export function pilotesTitulaires(monde: Monde): Personne[] {
  const t = table(monde, TABLES.personnes);
  return idsTries(t)
    .map((id) => t[id] as unknown as Personne)
    .filter((p) => p.statut === 'actif' && p.poste === 'pilote_titulaire' && p.ecurie);
}
