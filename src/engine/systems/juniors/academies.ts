/**
 * Académies, mécènes et repérage — phase 6b-2 (docs/systemes/phase-6b-filieres-juniors.md §5 à §8, D-112).
 *
 * - Une académie par écurie de F1 : places selon les moyens et la politique de recrutement, réputation issue des carrières réelles.
 * - Contrats d'affiliation (type réservé depuis la phase 4) : financement du baquet junior, option prioritaire, promesse éventuelle.
 * - Mécènes pour des jeunes talentueux sans moyens.
 * - Missions de repérage : commande commune au joueur et à l'IA, qui resserre l'estimation du potentiel (biais conservé).
 * Toutes les écuries suivent les mêmes règles ; pour l'instant, l'IA gère aussi l'académie de l'écurie du joueur (délégation).
 */

import {
  ACADEMIE, AFFILIATION, CATEGORIES_JUNIORS, MECENE, MEMOIRE_ACADEMIE, PROMESSE_ACADEMIE, RENOUVELLEMENT_AFFILIATION, REPERAGE, REPUTATION_ACADEMIE,
} from '../../balance/juniors';
import type { DefinitionCommande } from '../../core/commandes';
import { ajouterEvenement } from '../../core/evenements';
import { nouvelIdentifiant } from '../../core/identifiants';
import { tirageLocal } from '../../core/moteur';
import { idsTries, table, type Entite, type Monde } from '../../core/monde';
import { TABLES, type Academie, type Contrat, type Departement, type Ecurie, type Finances, type MissionReperage, type Personne } from '../../model/types';
import { lireEvenement } from '../memoire';
import { potentielEstime } from '../carriere/estimation';
import { faireUnePromesse } from '../humain/promesses';
import { teamPrincipal } from '../humain/decision';
import { ecuriesActives } from '../saison/performance';

const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));
const arrondi = (x: number) => Math.round(x * 100) / 100;
const FILIERE = /jeune|junior|filière|formation/i;

export const academies = (m: Monde) => idsTries(table(m, TABLES.academies)).map((id) => table(m, TABLES.academies)[id] as unknown as Academie);
export const academieDe = (m: Monde, idEcurie: string) => academies(m).find((a) => a.ecurie === idEcurie);
const contrats = (m: Monde) => idsTries(table(m, TABLES.contrats)).map((id) => table(m, TABLES.contrats)[id] as unknown as Contrat);
export const affiliationsActives = (m: Monde, idEcurie?: string) => contrats(m).filter((c) => c.type === 'affiliation' && c.statut === 'actif' && (!idEcurie || c.organisation === idEcurie));
export const affiliationDe = (m: Monde, idPersonne: string) => contrats(m).find((c) => c.type === 'affiliation' && c.statut === 'actif' && c.personne === idPersonne);
const personnes = (m: Monde) => idsTries(table(m, TABLES.personnes)).map((id) => table(m, TABLES.personnes)[id] as unknown as Personne);

/** Crée les académies si besoin (une par écurie de F1). */
export function initialiserAcademies(monde: Monde): void {
  for (const e of ecuriesActives(monde)) {
    if (academieDe(monde, e.id)) continue;
    const places = Math.round(borner(ACADEMIE.min + ACADEMIE.parTranche * Math.floor(e.budgetMEUR / ACADEMIE.trancheBudgetMEUR) + (FILIERE.test(e.politiqueRecrutement) ? ACADEMIE.bonusFiliere : 0), ACADEMIE.min, ACADEMIE.max));
    const a: Academie = { id: `aca_${e.id.replace(/^eq_/, '')}`, ecurie: e.id, places, reputation: Math.round(borner(ACADEMIE.reputationBase + ACADEMIE.reputationParPointPrestige * (e.prestige - 10), 0, 100)) };
    table(monde, TABLES.academies)[a.id] = a as unknown as Entite;
  }
}

/** Coût annuel de l'académie : financement des affiliés (hors plafond). Lu par la comptabilité et le budget. */
export function coutAnnuelAcademie(monde: Monde, idEcurie: string): number {
  return affiliationsActives(monde, idEcurie).reduce((a, c) => a + (c.clauses.financementAnnuelMEUR ?? 0), 0);
}

/** Financement personnel d'un jeune pour une année : mécène + financement d'académie (la famille est comptée par le marché). */
export function financementExterieur(monde: Monde, p: Personne, annee: number): number {
  const mecene = p.mecene && p.mecene.jusqua >= annee ? p.mecene.montantMEUR : 0;
  return mecene + (affiliationDe(monde, p.id)?.clauses.financementAnnuelMEUR ?? 0);
}

/** Une personne peut-elle être engagée par cette écurie de F1 ? Option prioritaire : un affilié est réservé à son académie et à l'écurie partenaire. */
export function engageablePar(monde: Monde, p: Personne, e: Ecurie): boolean {
  const aff = affiliationDe(monde, p.id);
  return !aff || aff.organisation === e.id || aff.organisation === e.ecuriePartenaire;
}

/* ---------------------------------------------------------------- Affiliations */

function categorieVisee(p: Personne, annee: number): 'apex3' | 'apex2' {
  return annee - p.anneeNaissance >= CATEGORIES_JUNIORS.apex2.ageMin && (p.carriere?.juniors ?? []).some((r) => r.categorie === 'apex3') ? 'apex2' : 'apex3';
}

/** Fin et renouvellement des contrats d'affiliation (fin de saison, comme les contrats d'emploi ; un affilié engagé ou retraité libère sa place). */
function revoirAffiliations(monde: Monde, annee: number): void {
  for (const c of affiliationsActives(monde)) {
    const p = table(monde, TABLES.personnes)[c.personne] as unknown as Personne | undefined;
    if (!p || p.statut !== 'libre') { c.statut = 'termine'; c.motifFin = 'echeance'; continue; } // engagé en F1, ou retraité
    if (c.fin > annee) continue;
    const est = potentielEstime(monde, c.organisation, p).centre;
    if (est >= RENOUVELLEMENT_AFFILIATION.potentielMin && annee - p.anneeNaissance <= RENOUVELLEMENT_AFFILIATION.ageMax) {
      c.fin = annee + AFFILIATION.dureeMin;
      c.clauses.financementAnnuelMEUR = CATEGORIES_JUNIORS[categorieVisee(p, annee + 1)].prixBaquetMEUR * AFFILIATION.partFinancement;
    } else {
      c.statut = 'termine';
      c.motifFin = 'non_prolonge';
      ajouterEvenement(monde, { type: 'academie.depart', acteurs: [{ id: p.id, role: 'personne' }, { id: c.organisation, role: 'organisation' }], importance: 1, contexte: { contrat: c.id } });
    }
  }
}

/** Recrutement d'affiliés : les académies les plus prestigieuses choisissent d'abord, d'après LEUR estimation du potentiel. */
function recruterAffilies(monde: Monde, annee: number): void {
  const parPrestige = academies(monde)
    .map((a) => ({ a, e: table(monde, TABLES.ecuries)[a.ecurie] as unknown as Ecurie | undefined }))
    .filter((x): x is { a: Academie; e: Ecurie } => !!x.e && x.e.statut === 'active')
    .sort((x, y) => y.e.prestige + y.a.reputation / 20 - (x.e.prestige + x.a.reputation / 20) || (x.a.id < y.a.id ? -1 : 1));
  for (const { a, e } of parPrestige) {
    let libres = a.places - affiliationsActives(monde, e.id).length;
    while (libres > 0) {
      let meilleur: { p: Personne; score: number; centre: number } | undefined;
      for (const p of personnes(monde)) {
        const age = annee - p.anneeNaissance;
        if (p.statut !== 'libre' || !p.poste.startsWith('pilote') || (p.carriere?.saisonsF1 ?? 0) > 0 || age < AFFILIATION.ageMin || age > AFFILIATION.ageMax || affiliationDe(monde, p.id)) continue;
        const centre = potentielEstime(monde, e.id, p).centre;
        if (centre < AFFILIATION.potentielMinimal) continue;
        const score = centre + AFFILIATION.poidsReputation * (p.reputationJeune ?? 0) - AFFILIATION.penaliteAge * Math.max(0, age - 16);
        if (!meilleur || score > meilleur.score) meilleur = { p, score, centre };
      }
      if (!meilleur) break;
      affilier(monde, e, meilleur.p, meilleur.centre, annee);
      libres--;
    }
  }
}

function affilier(monde: Monde, e: Ecurie, p: Personne, centre: number, annee: number): void {
  const f = tirageLocal(monde, 'academie.affiliation', e.id, p.id, annee);
  const duree = f.entier(AFFILIATION.dureeMin, AFFILIATION.dureeMax);
  const c: Contrat = {
    id: nouvelIdentifiant(monde, 'ctr'), personne: p.id, organisation: e.id, type: 'affiliation', poste: 'pilote_junior', debut: annee, fin: annee + duree - 1,
    salaireMEUR: 0, clauses: { optionPrioritaire: true, financementAnnuelMEUR: arrondi(CATEGORIES_JUNIORS[categorieVisee(p, annee)].prixBaquetMEUR * AFFILIATION.partFinancement) },
    statut: 'actif', verification: 'contrat simulé (académie)',
  };
  table(monde, TABLES.contrats)[c.id] = c as unknown as Entite;
  const tp = teamPrincipal(monde, e.id);
  const ev = ajouterEvenement(monde, {
    type: 'academie.affiliation', acteurs: [{ id: p.id, role: 'personne' }, { id: e.id, role: 'organisation' }], importance: 2, visibilite: 'public',
    contexte: { contrat: c.id, duree, financement: c.clauses.financementAnnuelMEUR }, texte: `${p.prenom} ${p.nom} rejoint l'académie de ${e.nom}.`,
  });
  if (tp) lireEvenement(monde, p.id, tp.id, 'gratitude', ev.id, { facteur: AFFILIATION.gratitude });
  // Promesse de titularisation à un très grand espoir : tenue ou rompue, elle entre dans la mémoire (phase 4).
  if (tp && centre >= PROMESSE_ACADEMIE.potentielMin && annee - p.anneeNaissance >= PROMESSE_ACADEMIE.ageMin && f.chance(PROMESSE_ACADEMIE.probabilite)) {
    faireUnePromesse(monde, {
      auteur: tp.id, organisation: e.id, beneficiaire: p.id, type: 'titularisation', parametres: {},
      echeance: { annee: annee + PROMESSE_ACADEMIE.delaiAnnees, semaine: 49 }, publique: false,
    }, [ev.id]);
  }
}

/* ---------------------------------------------------------------- Mécènes */

function chercherMecenes(monde: Monde, annee: number): void {
  for (const p of personnes(monde)) {
    if (p.statut !== 'libre' || !p.poste.startsWith('pilote') || (p.carriere?.saisonsF1 ?? 0) > 0 || (p.mecene && p.mecene.jusqua >= annee)) continue;
    if ((p.budgetFamilleMEUR ?? 0) > MECENE.budgetFamilleMax || affiliationDe(monde, p.id)) continue;
    if ((p.reputationJeune ?? 0) < MECENE.reputationMin && potentielEstime(monde, null, p).centre < MECENE.potentielMin) continue;
    const f = tirageLocal(monde, 'mecene', p.id, annee);
    if (!f.chance(MECENE.probabilite)) continue;
    p.mecene = { montantMEUR: arrondi(MECENE.montantMin + f.suivant() * (MECENE.montantMax - MECENE.montantMin)), jusqua: annee + MECENE.dureeAnnees - 1 };
    ajouterEvenement(monde, { type: 'junior.mecene', acteurs: [{ id: p.id, role: 'personne' }], importance: 2, visibilite: 'public', contexte: { montant: p.mecene.montantMEUR, jusqua: p.mecene.jusqua } });
  }
}

/* ---------------------------------------------------------------- Repérage */

export function missionsActives(monde: Monde, idEcurie?: string): MissionReperage[] {
  const t = table(monde, TABLES.missionsReperage);
  const fin = (x: MissionReperage) => x.finAnnee * 100 + x.finSemaine;
  const maintenant = monde.date.annee * 100 + monde.date.semaine;
  return idsTries(t).map((id) => t[id] as unknown as MissionReperage).filter((x) => fin(x) >= maintenant && (!idEcurie || x.ecurie === idEcurie));
}

/** Une mission de repérage de cette écurie est-elle en cours sur cette personne ? Lu par l'estimation du potentiel. */
export function enReperage(monde: Monde, idEcurie: string | null, idPersonne: string): boolean {
  return !!idEcurie && missionsActives(monde, idEcurie).some((x) => x.personne === idPersonne);
}

/** Nombre de missions simultanées permises par le département recrutement. */
export function missionsMax(monde: Monde, idEcurie: string): number {
  const dep = (Object.values(table(monde, TABLES.departements)) as unknown as Departement[]).find((d) => d.ecurie === idEcurie && d.type === 'recrutement');
  return REPERAGE.missionsMin + Math.floor((dep?.niveauMoyen ?? 10) / REPERAGE.niveauParMission);
}

export function motifRefusMission(monde: Monde, idEcurie: string, idPersonne: string): string | null {
  if (!table(monde, TABLES.personnes)[idPersonne]) return 'Personne inconnue.';
  if (enReperage(monde, idEcurie, idPersonne)) return 'Une mission est déjà en cours sur cette personne.';
  if (missionsActives(monde, idEcurie).length >= missionsMax(monde, idEcurie)) return 'Le département recrutement n’a plus de capacité de repérage disponible.';
  return null;
}

/** Lance une mission : coût inscrit dans les comptes (ligne académie, hors plafond), durée limitée, volume borné. */
export function lancerMission(monde: Monde, idEcurie: string, idPersonne: string, auteur: string): void {
  const finSemaine = monde.date.semaine + REPERAGE.dureeSemaines;
  const m: MissionReperage = { id: nouvelIdentifiant(monde, 'rep'), ecurie: idEcurie, personne: idPersonne, finAnnee: monde.date.annee + Math.floor((finSemaine - 1) / 52), finSemaine: ((finSemaine - 1) % 52) + 1 };
  table(monde, TABLES.missionsReperage)[m.id] = m as unknown as Entite;
  const fi = (Object.values(table(monde, TABLES.finances)) as unknown as Finances[]).find((f) => f.ecurie === idEcurie);
  if (fi) { fi.tresorerieMEUR -= REPERAGE.coutMEUR; fi.comptes.academie = (fi.comptes.academie ?? 0) + REPERAGE.coutMEUR; }
  ajouterEvenement(monde, { type: 'recrutement.mission', acteurs: [{ id: auteur, role: 'auteur' }, { id: idPersonne, role: 'cible' }, { id: idEcurie, role: 'organisation' }], importance: 1, visibilite: 'prive', contexte: { fin: `${m.finAnnee}-${m.finSemaine}` } });
}

/** Commande « recrutement.mission » : passée par le team principal d'une écurie (joueur ou IA), mêmes règles pour tous. */
export const commandeMissionReperage: DefinitionCommande = {
  type: 'recrutement.mission',
  valider(monde, c) {
    const idEcurie = String(c.parametres['ecurie'] ?? '');
    const tp = teamPrincipal(monde, idEcurie);
    if (!tp || tp.id !== c.auteur) return 'Seul le team principal de l’écurie peut lancer une mission de repérage.';
    return motifRefusMission(monde, idEcurie, String(c.parametres['personne'] ?? ''));
  },
  appliquer({ monde }, c) {
    lancerMission(monde, String(c.parametres['ecurie']), String(c.parametres['personne']), c.auteur);
  },
};

/** IA : missions sur les jeunes les plus prometteurs selon l'opinion du paddock (début d'année) ou sur les meilleurs de l'Apex 2 (mi-saison). */
function missionsIA(monde: Monde, annee: number, pourF1: boolean, commander: (c: { type: string; auteur: string; parametres: Record<string, unknown> }) => unknown): void {
  // Volume borné : les missions terminées sont effacées.
  const t = table(monde, TABLES.missionsReperage);
  const actives = new Set(missionsActives(monde).map((x) => x.id));
  for (const id of Object.keys(t)) if (!actives.has(id)) delete t[id];
  const cibles = personnes(monde)
    .filter((p) => p.statut === 'libre' && p.poste.startsWith('pilote') && (p.carriere?.saisonsF1 ?? 0) === 0 && (pourF1 ? p.junior?.categorie === 'apex2' : annee - p.anneeNaissance <= AFFILIATION.ageMax))
    .map((p) => ({ p, v: potentielEstime(monde, null, p).centre + REPERAGE.poidsReputationIA * (p.reputationJeune ?? 0) }))
    .sort((a, b) => b.v - a.v || (a.p.id < b.p.id ? -1 : 1))
    .slice(0, REPERAGE.vivierIA);
  for (const e of ecuriesActives(monde)) {
    if (e.pilotee) continue;
    const tp = teamPrincipal(monde, e.id);
    if (!tp) continue;
    let n = 0;
    for (const { p } of cibles) {
      if (n >= REPERAGE.ciblesIA) break;
      if (motifRefusMission(monde, e.id, p.id)) continue;
      // Choix légèrement différents d'une écurie à l'autre (chacune a ses priorités).
      if (!tirageLocal(monde, 'reperage.ia', e.id, p.id, annee, pourF1 ? 1 : 0).chance(REPERAGE.probabiliteIA)) continue;
      commander({ type: 'recrutement.mission', auteur: tp.id, parametres: { ecurie: e.id, personne: p.id } });
      n++;
    }
  }
}

/* ---------------------------------------------------------------- Réputation des académies */

function reputationAcademies(monde: Monde, annee: number): void {
  const pal = Object.values(table(monde, TABLES.palmares)) as unknown as { championPilote: string }[];
  const tc = table(monde, TABLES.contrats);
  for (const a of academies(monde)) {
    // Mémoire bornée : les affiliés passés sont retenus par identifiant, puis les vieux contrats sont effacés.
    const ceux = contrats(monde).filter((c) => c.type === 'affiliation' && c.organisation === a.ecurie);
    a.anciens = [...new Set([...(a.anciens ?? []), ...ceux.map((c) => c.personne)])].slice(-MEMOIRE_ACADEMIE.anciensMax);
    for (const c of ceux) if (c.statut !== 'actif' && c.fin < annee - MEMOIRE_ACADEMIE.conservationContratsAnnees) delete tc[c.id];
    const anciens = new Set(a.anciens);
    if (!anciens.size) continue;
    let promus = 0, titres = 0;
    for (const id of anciens) {
      const p = table(monde, TABLES.personnes)[id] as unknown as Personne | undefined;
      if (p && ((p.carriere?.saisonsF1 ?? 0) > 0 || (p.statut === 'actif' && p.poste === 'pilote_titulaire'))) promus++;
      titres += pal.filter((x) => x.championPilote === id).length;
    }
    const cible = borner((REPUTATION_ACADEMIE.parPromu * promus) / anciens.size + REPUTATION_ACADEMIE.parTitre * titres, 0, 100);
    a.reputation = Math.round(REPUTATION_ACADEMIE.inertie * a.reputation + (1 - REPUTATION_ACADEMIE.inertie) * cible);
  }
}

/* ---------------------------------------------------------------- Calendrier annuel */

/** Début d'année (avant le marché des baquets) : académies, affiliations, mécènes, missions de l'IA. */
export function intersaisonAcademies(monde: Monde, annee: number, commander: (c: { type: string; auteur: string; parametres: Record<string, unknown> }) => unknown): void {
  initialiserAcademies(monde);
  missionsIA(monde, annee, false, commander);
  recruterAffilies(monde, annee);
  chercherMecenes(monde, annee);
}

export function miSaisonAcademies(monde: Monde, annee: number, commander: (c: { type: string; auteur: string; parametres: Record<string, unknown> }) => unknown): void {
  missionsIA(monde, annee, true, commander);
}

export function finDeSaisonAcademies(monde: Monde, annee: number): void {
  revoirAffiliations(monde, annee);
  reputationAcademies(monde, annee);
}
