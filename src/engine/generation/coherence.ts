/**
 * Contrôles de cohérence automatiques du monde (critère 3 de la phase 2).
 * Renvoie la liste des problèmes, en français. Liste vide = monde cohérent.
 */

import { COHORTE } from '../balance/carriere';
import { POSTES_INDIVIDUALISES } from '../balance/monde';
import { COMPETENCES_TRANSVERSALES, TRAITS, VALEURS } from '../balance/personnages';
import { table, type Monde } from '../core/monde';
import { SEMAINE_FIN_CONTRATS } from '../balance/contrats';
import { TABLES, type Contrat, type ContratSponsoring, type Ecurie, type Finances, type Personne } from '../model/types';
import { nombrePlaces, occupantsPour } from '../systems/humain/effectifs';

/** Âges plausibles par famille de postes (années). */
// Les pilotes entrent dans le vivier à l'âge de la cohorte (phase 6a, 14 ans).
const AGES_PLAUSIBLES = { pilote: { min: COHORTE.agePilotes, max: 46 }, autre: { min: 22, max: 82 } };

/**
 * @param options.ages vérifier la plausibilité des âges (à désactiver tant que le vieillissement et les retraites n'existent pas, phase 6).
 */
export function verifierCoherence(monde: Monde, options: { ages?: boolean } = {}): string[] {
  const verifierAges = options.ages ?? true;
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
    if (c.type === 'emploi' && !idsEq.has(c.organisation)) pb.push(`Contrat ${c.id} : organisation inconnue ${c.organisation}`);
    if (c.statut === 'actif' && c.fin < annee) pb.push(`Contrat ${c.id} : actif mais terminé en ${c.fin}`);
  }
  const contratsActifs = new Map(contrats.filter((c) => c.statut === 'actif' && c.type === 'emploi').map((c) => [c.personne, c]));

  // Audit n°4 : invariants des contrats actuels et futurs.
  // Les contrats signés en semaine 50 pour la saison suivante sont actifs dès la fin de la semaine 50 (prise d'effet anticipée).
  const anticipation = monde.date.semaine > SEMAINE_FIN_CONTRATS ? 1 : 0;
  const parPersonne = new Map<string, number>();
  for (const c of contrats) {
    if (c.type === 'emploi' && c.statut === 'actif') parPersonne.set(c.personne, (parPersonne.get(c.personne) ?? 0) + 1);
    if (c.statut === 'actif' && c.debut > annee + anticipation) pb.push(`Contrat ${c.id} : actif avant sa date de début (${c.debut})`);
    if (c.statut === 'signe' && c.debut <= annee + anticipation) pb.push(`Contrat ${c.id} : signé pour ${c.debut} mais pas encore entré en vigueur`);
    if (c.fin < c.debut) pb.push(`Contrat ${c.id} : se termine (${c.fin}) avant de commencer (${c.debut})`);
    if (!Number.isFinite(c.salaireMEUR) || c.salaireMEUR < 0) pb.push(`Contrat ${c.id} : salaire invalide`);
  }
  for (const [id, n] of parPersonne) if (n > 1) pb.push(`Personne ${id} : ${n} contrats d'emploi actifs en même temps`);
  // Effectifs de chaque saison, actuelle et futures (contrats signés compris).
  for (const e of ecuries) {
    if (e.statut !== 'active') continue;
    for (const { poste } of POSTES_INDIVIDUALISES) for (let y = annee + anticipation; y <= annee + 3; y++) {
      const n = occupantsPour(monde, e.id, poste as Personne['poste'], y).length;
      if (n > nombrePlaces(poste as Personne['poste'])) pb.push(`${e.nom} : ${n} ${poste} prévus en ${y}`);
    }
  }
  // Finances et sponsors : valeurs finies, références existantes.
  for (const fi of Object.values(table(monde, TABLES.finances)) as unknown as Finances[]) {
    if (!idsEq.has(fi.ecurie)) pb.push(`Finances ${fi.id} : écurie inconnue ${fi.ecurie}`);
    if (!Number.isFinite(fi.tresorerieMEUR)) pb.push(`Finances de ${fi.ecurie} : trésorerie non finie`);
    for (const [k, v] of Object.entries(fi.comptes)) if (typeof v === 'number' && !Number.isFinite(v)) pb.push(`Finances de ${fi.ecurie} : ligne « ${k} » non finie`);
  }
  const idsSponsors = new Set(Object.keys(table(monde, TABLES.sponsors)));
  for (const cs of Object.values(table(monde, TABLES.contratsSponsoring)) as unknown as ContratSponsoring[]) {
    if (!idsEq.has(cs.ecurie)) pb.push(`Contrat de sponsoring ${cs.id} : écurie inconnue ${cs.ecurie}`);
    if (idsSponsors.size && !idsSponsors.has(cs.sponsor)) pb.push(`Contrat de sponsoring ${cs.id} : sponsor inconnu ${cs.sponsor}`);
    if (!Number.isFinite(cs.montantAnnuelMEUR)) pb.push(`Contrat de sponsoring ${cs.id} : montant non fini`);
  }
  for (const i of Object.values(table(monde, TABLES.installations))) if (!idsEq.has(String(i['ecurie']))) pb.push(`Installation ${String(i['id'])} : écurie inconnue`);

  for (const p of personnes) {
    const nom = `${p.prenom} ${p.nom}`;
    if (p.statut === 'actif' && p.ecurie) {
      const c = contratsActifs.get(p.id);
      if (!c) pb.push(`${nom} : actif dans une écurie mais sans contrat`);
      else if (c.organisation !== p.ecurie) pb.push(`${nom} : contrat chez ${c.organisation} mais affecté à ${p.ecurie}`);
    }
    if (verifierAges && p.statut !== 'retraite') {
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
