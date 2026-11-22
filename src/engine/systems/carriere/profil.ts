/**
 * Profil de carrière (phase 6a, §3) et changements de métier (§5, §8).
 * Module « feuille » : il n'importe que l'équilibrage et le modèle, pour pouvoir servir à la construction du monde,
 * aux migrations de sauvegarde et aux systèmes.
 */

import { AGE_MINIMAL_F1, ARCHETYPES, ECART_COMPETENCES, PLATEAU_MINIMAL_DONNEES, RECONVERSION, VARIATION_AGES } from '../../balance/carriere';
import { COMPETENCES_PAR_POSTE, COMPETENCES_PILOTE, COMPETENCES_TRANSVERSALES, courbeAge } from '../../balance/personnages';
import type { Flux } from '../../core/hasard';
import type { Monde } from '../../core/monde';
import type { CarrierePersonne, Personne, Poste } from '../../model/types';

const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));

/** Compétences métier d'un poste (les pilotes partagent la même liste). */
export function competencesMetier(poste: string): readonly string[] {
  return poste.startsWith('pilote') ? COMPETENCES_PILOTE : (COMPETENCES_PAR_POSTE[poste] ?? []);
}

/** Niveau de carrière : moyenne des compétences métier (sert au meilleur niveau et au déclin ressenti). */
export function niveauCarriere(p: Personne): number {
  const v = competencesMetier(p.poste).map((c) => p.competences[c]).filter((x): x is number => typeof x === 'number');
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 10;
}

/** Plafond d'une compétence = potentiel global + écart propre (les transversales ont un plafond un peu plus bas). */
export function plafondCompetence(p: Personne, c: string): number {
  const base = (COMPETENCES_TRANSVERSALES as readonly string[]).includes(c) ? p.potentiel - 1 : p.potentiel;
  return borner(base + (p.carriere?.ecarts[c] ?? 0), 1, 20);
}

/**
 * Tire le profil de carrière d'une personne.
 * - `age` : âge actuel ; `donnees` : personne issue des données (encore au sommet si elle est active) ;
 * - `impose` : archétype imposé par la colonne `profilCarriere` de personnes.csv.
 */
export function tirerCarriere(p: Personne, f: Flux, age: number, donnees: boolean, impose?: string): CarrierePersonne {
  const courbe = courbeAge(p.poste);
  const noms = Object.keys(ARCHETYPES);
  let archetype = impose && ARCHETYPES[impose] ? impose : f.choisirPondere(noms, noms.map((n) => ARCHETYPES[n]!.poids));
  // Une personne des données déjà au-delà de l'âge de déclin moyen et toujours active : profil « longévité » (§3.4).
  if (!impose && donnees && p.statut === 'actif' && age >= courbe.declinApres) archetype = 'longevite';
  const a = ARCHETYPES[archetype]!;
  const debutApogee = courbe.progressionJusqua + a.decalageApogee + f.normale(0, VARIATION_AGES.apogee);
  let finApogee = debutApogee + Math.max(0.5, (courbe.declinApres - courbe.progressionJusqua) * a.dureeApogee + f.normale(0, VARIATION_AGES.plateau));
  if (donnees && p.statut === 'actif' && finApogee < age + PLATEAU_MINIMAL_DONNEES) finApogee = age + PLATEAU_MINIMAL_DONNEES + f.entier(0, 3);
  const ecarts: Record<string, number> = {};
  const liste = [...competencesMetier(p.poste), ...COMPETENCES_TRANSVERSALES];
  for (const c of liste) ecarts[c] = f.normale(0, ECART_COMPETENCES);
  const moyenne = competencesMetier(p.poste).reduce((s, c) => s + (ecarts[c] ?? 0), 0) / Math.max(1, competencesMetier(p.poste).length);
  for (const c of competencesMetier(p.poste)) ecarts[c] = Math.round(((ecarts[c] ?? 0) - moyenne) * 100) / 100; // centrés : le potentiel global reste la moyenne
  for (const c of COMPETENCES_TRANSVERSALES) ecarts[c] = Math.round((ecarts[c] ?? 0) * 100) / 100;
  return {
    archetype, debutApogee: Math.round(debutApogee * 10) / 10, finApogee: Math.round(Math.max(finApogee, debutApogee + 0.5) * 10) / 10,
    vitesseProgression: Math.round(a.progression * borner(f.normale(1, 0.1), 0.7, 1.3) * 100) / 100,
    vitesseDeclin: Math.round(a.declin * borner(f.normale(1, 0.15), 0.6, 1.5) * 100) / 100,
    ecarts, saisonsF1: 0, saisonsActives: 0, niveauMax: Math.round(niveauCarriere(p) * 10) / 10,
  };
}

/**
 * Changement de métier (promotion, reconversion) : les compétences du nouveau métier sont créées à partir
 * des compétences voisines et des transversales, un peu en dessous ; les anciennes compétences métier disparaissent.
 * Le profil de carrière est prolongé selon la courbe du nouveau métier.
 */
export function changerMetier(p: Personne, poste: Poste, f: Flux, age: number): void {
  const ancien = competencesMetier(p.poste);
  const nouveau = competencesMetier(poste);
  if (ancien === nouveau || (p.poste.startsWith('pilote') && poste.startsWith('pilote'))) { p.poste = poste; return; }
  const trans = COMPETENCES_TRANSVERSALES.map((c) => p.competences[c] ?? 10);
  const baseTrans = trans.reduce((a, b) => a + b, 0) / trans.length;
  const baseMetier = ancien.length ? ancien.reduce((s, c) => s + (p.competences[c] ?? 10), 0) / ancien.length : baseTrans;
  for (const c of nouveau) {
    if (p.competences[c] === undefined) p.competences[c] = borner(Math.round((0.5 * baseTrans + 0.5 * baseMetier - RECONVERSION.ecartNiveau + f.normale(0, 1)) * 10) / 10, 1, 20);
  }
  for (const c of ancien) if (!nouveau.includes(c)) delete p.competences[c];
  p.poste = poste;
  if (p.carriere) {
    const courbe = courbeAge(poste);
    for (const c of nouveau) if (p.carriere.ecarts[c] === undefined) p.carriere.ecarts[c] = Math.round(f.normale(0, ECART_COMPETENCES) * 100) / 100;
    for (const c of Object.keys(p.carriere.ecarts)) if (!nouveau.includes(c) && !(COMPETENCES_TRANSVERSALES as readonly string[]).includes(c)) delete p.carriere.ecarts[c];
    // Un nouveau métier ouvre une nouvelle période de progression : le plateau est recalé sur la courbe du métier.
    p.carriere.debutApogee = Math.max(age + 2, courbe.progressionJusqua + f.normale(0, VARIATION_AGES.apogee));
    p.carriere.finApogee = Math.max(p.carriere.debutApogee + 2, courbe.declinApres + f.normale(0, VARIATION_AGES.plateau));
    p.carriere.niveauMax = Math.round(niveauCarriere(p) * 10) / 10;
  }
}

/** Âge minimal pour un baquet de pilote (D-100, en attendant les filières de la 6b), lu par le recrutement. */
export function assezAgePourLaF1(monde: Monde, p: Personne): boolean {
  return !p.poste.startsWith('pilote') || monde.date.annee - p.anneeNaissance >= AGE_MINIMAL_F1;
}
