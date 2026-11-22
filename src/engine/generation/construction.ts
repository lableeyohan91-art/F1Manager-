/**
 * Construction du monde de départ à partir du jeu de données initial (phase 2).
 *
 * - Ce qui est dans les données est repris tel quel (écuries, pilotes, dirigeants connus, palmarès…).
 * - Les couches cachées (personnalité, valeurs, aspirations) et l'état sont GÉNÉRÉS pour tout le monde.
 * - Les postes individualisés manquants (D-029), les départements, les installations
 *   et le réservoir de personnes libres sont générés.
 *
 * Chaque personne générée tire son hasard dans un flux propre (« generation:<id> ») :
 * modifier une ligne des données ne change pas la personnalité des autres.
 */

import { DEPARTEMENTS, DUREE_CONTRAT_GENERE, INSTALLATIONS, POSTES_INDIVIDUALISES, RESERVOIR, SALAIRES_GENERES } from '../balance/monde';
import {
  AGES_PAR_POSTE,
  ASPIRATIONS,
  BIAIS_TRAITS_PAR_POSTE,
  COMPETENCES_PAR_POSTE,
  COMPETENCES_PILOTE,
  COMPETENCES_TRANSVERSALES,
  ETAT_DEPART,
  courbeAge,
  NIVEAU_PERSONNEL_GENERE,
  TIRAGE_TRAITS,
  TIRAGE_VALEURS,
  TRAITS,
  VALEURS,
} from '../balance/personnages';
import type { DateJeu } from '../core/calendrier';
import { etatInitialFlux, Flux } from '../core/hasard';
import { nouvelIdentifiant } from '../core/identifiants';
import { creerMondeVide, idsTries, table, type Entite, type Monde } from '../core/monde';
import type { Contrat, Departement, Ecurie, Installation, Personne, Poste } from '../model/types';
import { TABLES } from '../model/types';
import { moyenne, type DonneesInitiales, type PersonneDonnees } from './chargement';

export const DATE_DEPART: DateJeu = { annee: 2027, semaine: 1 };

const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));
const note = (x: number) => Math.round(borner(x, 1, 20));

/** Flux de hasard temporaire, propre à une entité (non stocké dans le monde). */
function fluxDe(graine: number, cle: string): Flux {
  return new Flux(etatInitialFlux(graine, `generation:${cle}`));
}

function tirerTraits(f: Flux, poste: string): Record<string, number> {
  const biais = BIAIS_TRAITS_PAR_POSTE[poste] ?? {};
  const res: Record<string, number> = {};
  for (const t of Object.keys(TRAITS) as (keyof typeof TRAITS)[]) {
    res[t] = note(f.normale(TIRAGE_TRAITS.moyenne + (biais[t] ?? 0), TIRAGE_TRAITS.ecartType));
  }
  return res;
}

function tirerValeurs(f: Flux): Record<string, number> {
  const res: Record<string, number> = {};
  for (const v of Object.keys(VALEURS)) res[v] = note(f.normale(TIRAGE_VALEURS.moyenne, TIRAGE_VALEURS.ecartType));
  return res;
}

function tirerAspirations(f: Flux, poste: string) {
  const possibles = ASPIRATIONS.filter((a) => a.postes.includes(poste));
  const n = Math.min(possibles.length, f.entier(0, 2));
  return f.melanger(possibles).slice(0, n).map((a) => ({ type: a.type, horizon: f.entier(1, 6) }));
}

function tirerEtat(f: Flux) {
  const v = () => Math.round(borner(f.normale(ETAT_DEPART.moyenne, ETAT_DEPART.ecartType), 0, 100));
  return { moral: v(), stress: 100 - v(), motivation: v(), confiance: v() };
}

/**
 * Niveau moyen sur les compétences métier (hors transversales).
 * Le POTENTIEL est le niveau moyen maximal que la personne peut atteindre (interprétation à valider).
 */
function moyenneMetier(competences: Record<string, number>): number {
  const metier = Object.entries(competences).filter(([c]) => !(COMPETENCES_TRANSVERSALES as readonly string[]).includes(c));
  return moyenne(metier.map(([, v]) => v));
}

/** Marge de potentiel selon l'âge et le métier (D-051). */
function margePotentiel(age: number, poste: string): number {
  const c = courbeAge(poste);
  return Math.min(c.margeMax, Math.max(0, c.progressionJusqua - age) * c.margeParAnnee);
}

/** Compétences générées pour un poste, autour d'un niveau moyen. */
function tirerCompetences(f: Flux, poste: string, niveau: number): Record<string, number> {
  const res: Record<string, number> = {};
  const metier = poste.startsWith('pilote') ? COMPETENCES_PILOTE : (COMPETENCES_PAR_POSTE[poste] ?? []);
  for (const c of metier) res[c] = note(f.normale(niveau, NIVEAU_PERSONNEL_GENERE.ecartType));
  for (const c of COMPETENCES_TRANSVERSALES) res[c] = note(f.normale(niveau - 1, NIVEAU_PERSONNEL_GENERE.ecartType + 0.5));
  return res;
}

function competencesTransversales(f: Flux, base: number): Record<string, number> {
  const res: Record<string, number> = {};
  for (const c of COMPETENCES_TRANSVERSALES) res[c] = note(f.normale(base, 2.5));
  return res;
}

interface Contexte {
  monde: Monde;
  graine: number;
  d: DonneesInitiales;
  nomsPris: Set<string>;
}

function tirerNationalite(ctx: Contexte, f: Flux, preference?: string): string {
  if (preference && f.chance(0.5) && ctx.d.noms[preference]) return preference;
  const nats = ctx.d.nationalites.filter((n) => n.poids > 0 && ctx.d.noms[n.code]);
  return f.choisirPondere(nats.map((n) => n.code), nats.map((n) => n.poids));
}

function tirerNom(ctx: Contexte, f: Flux, nat: string): { prenom: string; nom: string } {
  const liste = ctx.d.noms[nat] as { prenoms: string[]; noms: string[] };
  for (let essai = 0; essai < 50; essai++) {
    const prenom = f.choisir(liste.prenoms);
    const nom = f.choisir(liste.noms);
    const cle = `${prenom} ${nom}`;
    if (!ctx.nomsPris.has(cle)) {
      ctx.nomsPris.add(cle);
      return { prenom, nom };
    }
  }
  const prenom = f.choisir(liste.prenoms);
  const nom = `${f.choisir(liste.noms)}-${f.choisir(liste.noms)}`;
  ctx.nomsPris.add(`${prenom} ${nom}`);
  return { prenom, nom };
}

function ajouter<T extends { id: string }>(monde: Monde, nomTable: string, e: T): T {
  table(monde, nomTable)[e.id] = e as unknown as Entite;
  return e;
}

/** Personne issue des données : identité et compétences reprises, couches cachées générées. */
function personneDepuisDonnees(ctx: Contexte, p: PersonneDonnees, ecuries: Map<string, Ecurie>): Personne {
  const f = fluxDe(ctx.graine, p.id);
  const age = DATE_DEPART.annee - p.anneeNaissance;
  let competences: Record<string, number>;
  let potentiel: number;
  if (p.competences && p.potentiel !== null) {
    competences = { ...p.competences, ...competencesTransversales(f, 12) };
    potentiel = p.potentiel;
  } else {
    const prestige = ecuries.get(p.ecurie)?.prestige ?? 10;
    const niveau = NIVEAU_PERSONNEL_GENERE.base + 1 + NIVEAU_PERSONNEL_GENERE.facteurPrestige * (prestige - 10);
    competences = tirerCompetences(f, p.poste, niveau);
    potentiel = note(moyenneMetier(competences) + margePotentiel(age, p.poste));
  }
  ctx.nomsPris.add(`${p.prenom} ${p.nom}`);
  return {
    id: p.id,
    prenom: p.prenom,
    nom: p.nom,
    nationalite: p.nationalite,
    dateNaissance: p.dateNaissance,
    anneeNaissance: p.anneeNaissance,
    poste: p.poste,
    ecurie: p.ecurie,
    statut: p.statut,
    origine: 'donnees',
    traits: tirerTraits(f, p.poste),
    valeurs: tirerValeurs(f),
    competences,
    potentiel,
    aspirations: p.statut === 'actif' ? tirerAspirations(f, p.poste) : [],
    etat: tirerEtat(f),
    verification: p.verification,
  };
}

/** Personne entièrement générée. */
function personneGeneree(ctx: Contexte, poste: Poste, ecurie: Ecurie | null, statut: 'actif' | 'libre'): Personne {
  const id = nouvelIdentifiant(ctx.monde, 'per');
  const f = fluxDe(ctx.graine, id);
  const nat = tirerNationalite(ctx, f, ecurie?.nationalite);
  const { prenom, nom } = tirerNom(ctx, f, nat);
  const ages = AGES_PAR_POSTE[poste] ?? { min: 25, max: 55 };
  const age = f.entier(ages.min, ages.max);
  const anneeNaissance = DATE_DEPART.annee - age;
  let competences: Record<string, number>;
  let potentiel: number;
  if (poste === 'pilote_junior' || poste === 'pilote_reserve') {
    const niveau = poste === 'pilote_reserve' ? 13 : f.normale(10.5, 1.5);
    competences = tirerCompetences(f, poste, niveau);
    // Quelques pépites : le potentiel des jeunes varie beaucoup.
    potentiel = note(moyenneMetier(competences) + margePotentiel(age, poste) + Math.abs(f.normale(0, 2.5)));
  } else {
    const prestige = ecurie?.prestige ?? 9;
    const niveau = NIVEAU_PERSONNEL_GENERE.base + NIVEAU_PERSONNEL_GENERE.facteurPrestige * (prestige - 10);
    competences = tirerCompetences(f, poste, niveau);
    potentiel = note(moyenneMetier(competences) + margePotentiel(age, poste) + Math.abs(f.normale(0, 1)));
  }
  return ajouter(ctx.monde, TABLES.personnes, {
    id,
    prenom,
    nom,
    nationalite: nat,
    dateNaissance: String(anneeNaissance),
    anneeNaissance,
    poste,
    ecurie: ecurie?.id ?? '',
    statut,
    origine: 'generee',
    traits: tirerTraits(f, poste),
    valeurs: tirerValeurs(f),
    competences,
    potentiel,
    aspirations: tirerAspirations(f, poste),
    etat: tirerEtat(f),
    verification: 'personnage fictif généré',
  } satisfies Personne);
}

function contratGenere(ctx: Contexte, p: Personne): Contrat {
  const f = fluxDe(ctx.graine, `contrat:${p.id}`);
  const s = SALAIRES_GENERES[p.poste] ?? { min: 0.5, max: 2 };
  const id = nouvelIdentifiant(ctx.monde, 'ctr');
  return ajouter(ctx.monde, TABLES.contrats, {
    id,
    personne: p.id,
    ecurie: p.ecurie,
    poste: p.poste,
    debut: DATE_DEPART.annee - f.entier(0, 6),
    fin: DATE_DEPART.annee - 1 + f.entier(DUREE_CONTRAT_GENERE.min, DUREE_CONTRAT_GENERE.max),
    salaireMEUR: Math.round((s.min + f.suivant() * (s.max - s.min)) * 10) / 10,
    clauses: '',
    statut: 'actif',
    verification: 'contrat généré (estimation)',
  } satisfies Contrat);
}

export function construireMonde(graine: number, d: DonneesInitiales, scenario: string): Monde {
  const monde = creerMondeVide(graine, scenario, DATE_DEPART);
  const ctx: Contexte = { monde, graine, d, nomsPris: new Set() };

  for (const m of d.motoristes) ajouter(monde, TABLES.motoristes, { ...m });
  const ecuries = new Map<string, Ecurie>();
  for (const e of d.ecuries) ecuries.set(e.id, ajouter(monde, TABLES.ecuries, { ...e }));
  for (const c of d.circuits) ajouter(monde, TABLES.circuits, { ...c });
  d.palmares.forEach((p) => ajouter(monde, TABLES.palmares, { id: `pal_${p.saison}`, ...p }));
  d.carrieres.forEach((c, i) => ajouter(monde, TABLES.carrieres, { id: `car_${String(i + 1).padStart(6, '0')}`, ...c }));

  // Personnes issues des données.
  for (const p of d.personnes) ajouter(monde, TABLES.personnes, personneDepuisDonnees(ctx, p, ecuries));
  for (const c of d.contrats) ajouter(monde, TABLES.contrats, { ...c, statut: 'actif' } satisfies Contrat);

  // Postes individualisés manquants (D-029).
  const personnes = () => Object.values(table(monde, TABLES.personnes)) as unknown as Personne[];
  for (const idEq of idsTries(Object.fromEntries(ecuries))) {
    const eq = ecuries.get(idEq) as Ecurie;
    for (const { poste, nombre } of POSTES_INDIVIDUALISES) {
      const deja = personnes().filter((p) => p.statut === 'actif' && p.ecurie === eq.id && p.poste === poste).length;
      for (let i = deja; i < nombre; i++) personneGeneree(ctx, poste as Poste, eq, 'actif');
    }
  }

  // Contrats pour les personnes actives qui n'en ont pas (dirigeants connus, postes générés).
  const sousContrat = new Set((Object.values(table(monde, TABLES.contrats)) as unknown as Contrat[]).map((c) => c.personne));
  for (const p of personnes().sort((a, b) => (a.id < b.id ? -1 : 1))) {
    if (p.statut === 'actif' && p.ecurie && !sousContrat.has(p.id)) contratGenere(ctx, p);
  }

  // Réservoir de personnes libres.
  for (let i = 0; i < RESERVOIR.pilotesJuniors; i++) personneGeneree(ctx, 'pilote_junior', null, 'libre');
  for (let i = 0; i < RESERVOIR.ingenieursLibres; i++) personneGeneree(ctx, 'ingenieur', null, 'libre');

  // Départements et installations.
  for (const idEq of [...ecuries.keys()].sort()) {
    const eq = ecuries.get(idEq) as Ecurie;
    const f = fluxDe(graine, `structure:${eq.id}`);
    const facteur = borner(eq.budgetMEUR / DEPARTEMENTS.budgetReferenceMEUR, DEPARTEMENTS.facteurMin, DEPARTEMENTS.facteurMax);
    const equipe = personnes().filter((p) => p.ecurie === eq.id && p.statut === 'actif');
    const chef = (poste: string) => equipe.find((p) => p.poste === poste)?.id ?? '';
    const responsables: Record<string, string> = {
      aero: chef('responsable_aero'),
      conception: chef('responsable_conception'),
      stands: chef('directeur_sportif'),
      strategie: chef('directeur_sportif'),
    };
    for (const [type, base] of Object.entries(DEPARTEMENTS.effectifs)) {
      ajouter(monde, TABLES.departements, {
        id: nouvelIdentifiant(monde, 'dep'),
        ecurie: eq.id,
        type: type as Departement['type'],
        effectif: Math.round(base * facteur),
        niveauMoyen: note(f.normale(eq.niveauVoiture * 0.6 + 4, 1.5)),
        cohesion: note(f.normale(12, 2.5)),
        responsable: responsables[type] ?? '',
      } satisfies Departement);
    }
    for (const type of INSTALLATIONS.types) {
      ajouter(monde, TABLES.installations, {
        id: nouvelIdentifiant(monde, 'fac'),
        ecurie: eq.id,
        type,
        niveau: Math.round(borner(eq.niveauVoiture / 2 + f.normale(0, INSTALLATIONS.ecartTypeNiveau), 1, 10)),
        ageAnnees: f.entier(0, INSTALLATIONS.ageMax),
        etat: Math.round(borner(f.normale(80, 10), 30, 100)),
      } satisfies Installation);
    }
  }

  return monde;
}
