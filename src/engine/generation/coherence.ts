/**
 * Contrôles de cohérence automatiques du monde (critère 3 de la phase 2).
 * Renvoie la liste des problèmes, en français. Liste vide = monde cohérent.
 */

import { POSTES_INDIVIDUALISES } from '../balance/monde';
import { COMPETENCES_TRANSVERSALES, TRAITS, VALEURS } from '../balance/personnages';
import { table, type Monde } from '../core/monde';
import { TABLES, type Contrat, type Ecurie, type Personne } from '../model/types';

/** Âges plausibles par famille de postes (années). */
const AGES_PLAUSIBLES = { pilote: { min: 15, max: 46 }, autre: { min: 22, max: 82 } };

export function verifierCoherence(monde: Monde): string[] {
  const pb: string[] = [];
  const annee = monde.date.annee;
  const ecuries = Object.values(table(monde, TABLES.ecuries)) as unknown as Ecurie[];
  const personnes = Object.values(table(monde, TABLES.personnes)) as unknown as Personne[];
  const contrats = Object.values(table(monde, TABLES.contrats)) as unknown as Contrat[];
  const idsPer = new Set(personnes.map((p) => p.id));
  const idsEq = new Set(ecuries.map((e) => e.id));
  const idsMot = new Set(Object.keys(table(monde, TABLES.motoristes)));

  for (const e of ecuries) {
    if (!idsMot.has(e.motoriste)) pb.push(`${e.nom} : motoriste inconnu ${e.motoriste}`);
    for (const { poste, nombre } of POSTES_INDIVIDUALISES) {
      const n = personnes.filter((p) => p.statut === 'actif' && p.ecurie === e.id && p.poste === poste).length;
      if (n !== nombre) pb.push(`${e.nom} : ${n} ${poste} au lieu de ${nombre}`);
    }
  }

  for (const c of contrats) {
    if (!idsPer.has(c.personne)) pb.push(`Contrat ${c.id} : personne inconnue ${c.personne}`);
    if (!idsEq.has(c.ecurie)) pb.push(`Contrat ${c.id} : écurie inconnue ${c.ecurie}`);
    if (c.statut === 'actif' && c.fin < annee) pb.push(`Contrat ${c.id} : actif mais terminé en ${c.fin}`);
  }
  const contratsActifs = new Map(contrats.filter((c) => c.statut === 'actif').map((c) => [c.personne, c]));

  for (const p of personnes) {
    const nom = `${p.prenom} ${p.nom}`;
    if (p.statut === 'actif' && p.ecurie) {
      const c = contratsActifs.get(p.id);
      if (!c) pb.push(`${nom} : actif dans une écurie mais sans contrat`);
      else if (c.ecurie !== p.ecurie) pb.push(`${nom} : contrat chez ${c.ecurie} mais affecté à ${p.ecurie}`);
    }
    if (p.statut !== 'retraite') {
      const age = annee - p.anneeNaissance;
      const bornes = p.poste.startsWith('pilote') ? AGES_PLAUSIBLES.pilote : AGES_PLAUSIBLES.autre;
      if (!(age >= bornes.min && age <= bornes.max)) pb.push(`${nom} : âge peu plausible (${age} ans) pour ${p.poste}`);
    }
    for (const t of Object.keys(TRAITS)) if (!(p.traits[t]! >= 1 && p.traits[t]! <= 20)) pb.push(`${nom} : trait ${t} manquant ou hors bornes`);
    for (const v of Object.keys(VALEURS)) if (!(p.valeurs[v]! >= 1 && p.valeurs[v]! <= 20)) pb.push(`${nom} : valeur ${v} manquante ou hors bornes`);
    if (p.statut !== 'retraite') {
      for (const c of COMPETENCES_TRANSVERSALES) if (!(p.competences[c]! >= 1)) pb.push(`${nom} : compétence ${c} manquante`);
    }
  }
  return pb;
}
