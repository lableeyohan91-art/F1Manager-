/**
 * Chargement et validation du jeu de données initial (docs/systemes/donnees-initiales.md).
 * Toutes les erreurs sont accumulées puis signalées ensemble, avec fichier, ligne et colonne.
 */

import { DATE_DEPART } from '../balance/monde';
import { AGE_MIN_HISTOIRE, PASSE } from '../balance/histoire';
import { TYPES_MEDIAS, type Media } from '../model/medias';
import { ARCHETYPES } from '../balance/carriere';
import { COMPETENCES_PILOTE } from '../balance/personnages';
import type { Carriere, Circuit, Clauses, Contrat, Ecurie, Motoriste, Palmares, Poste, TypeProprietaire, VoitureDonnees } from '../model/types';
import { PARAMETRES_SENSIBILITE } from '../balance/monoplaces';
import { CHAMPS_EXIGENCES, type ExigencesCircuit } from '../model/types';
import { ErreurDonnees, Lecteur, lireCsv } from './csv';
import { ETIQUETTES } from '../balance/memoire';

/** Texte des fichiers, indexé par nom de fichier. */
export type FichiersDonnees = Record<string, string>;

export const FICHIERS_GRILLE = ['histoires.csv', 'finances.csv', 'voitures.csv', 'sensibilites-circuits.csv', 'ecuries.csv', 'motoristes.csv', 'personnes.csv', 'contrats.csv', 'carrieres.csv', 'palmares.csv', 'circuits.csv'] as const;
export const FICHIERS_COMMUNS = ['nationalites.csv', 'noms.csv', 'secteurs.csv', 'entreprises.csv', 'ecuries-juniors.csv', 'medias.csv'] as const;

const POSTES_DONNEES: readonly Poste[] = [
  'team_principal', 'directeur_technique', 'directeur_sportif', 'directeur_financier',
  'responsable_aero', 'responsable_conception', 'pilote_titulaire', 'pilote_reserve', 'ancien_pilote',
];

/** Personne telle que décrite dans le fichier (les couches cachées seront générées). */
export interface PersonneDonnees {
  id: string;
  prenom: string;
  nom: string;
  nationalite: string;
  dateNaissance: string;
  anneeNaissance: number;
  poste: Poste;
  ecurie: string;
  statut: 'actif' | 'retraite';
  competences: Record<string, number> | null;
  potentiel: number | null;
  /** Archétype de carrière imposé (colonne facultative, phase 6a §3.4), vide sinon. */
  profilCarriere?: string;
  verification: string;
}

export interface Nationalite {
  code: string;
  nom: string;
  poids: number;
}

/** Phase 9 : une histoire du passé (rivalité, réussite commune, humiliation…) entre deux personnes, ou d'une personne envers une écurie. */
export interface HistoireDonnees {
  id: string;
  saison: number;
  porteur: string;
  cible: string;
  etiquette: string;
  /** Multiplicateur de l'intensité du souvenir (0,2 à 2). */
  intensite: number;
  /** Le souvenir existe dans les deux sens (cible personne seulement). */
  reciproque: boolean;
  texte: string;
  verification: string;
}

export interface DonneesInitiales {
  motoristes: Motoriste[];
  ecuries: Ecurie[];
  personnes: PersonneDonnees[];
  contrats: Omit<Contrat, 'statut'>[];
  carrieres: Omit<Carriere, 'id'>[];
  palmares: Omit<Palmares, 'id'>[];
  /** Phase 9 (D-143) : histoires et rivalités réelles, publiquement connues (faits publics, intensités estimées). */
  histoires: HistoireDonnees[];
  circuits: Circuit[];
  voitures: VoitureDonnees[];
  finances: { ecurie: string; tresorerieMEUR: number; typeProprietaire: TypeProprietaire; apportAnnuelMEUR: number; revenusCommerciauxMEUR: number; verification: string }[];
  nationalites: Nationalite[];
  /** Prénoms et noms par code de nationalité. */
  noms: Record<string, { prenoms: string[]; noms: string[] }>;
  /** Phase 5b : secteurs d'activité des sponsors fictifs, et racines de noms d'entreprises inventées. */
  secteurs: Secteur[];
  racinesEntreprises: string[];
  /** Phase 6b : noms fictifs des écuries juniors. */
  ecuriesJuniors: { nom: string; nationalite: string }[];
  /** Phase 11 (D-149) : médias fictifs et leur ligne éditoriale (`data/commun/medias.csv`). */
  medias: Media[];
}

export interface Secteur {
  secteur: string;
  libelle: string;
  poids: number;
  budgetMinMEUR: number;
  budgetMaxMEUR: number;
  suffixes: string[];
}

/** Moyenne d'une liste de notes. */
export function moyenne(valeurs: number[]): number {
  return valeurs.length === 0 ? 0 : valeurs.reduce((a, b) => a + b, 0) / valeurs.length;
}

/**
 * Clauses écrites en clair dans contrats.csv (séparées par « / ») : « pilote n°1 » donne le statut de n°1,
 * le reste est conservé comme remarque.
 */
export function lireClauses(texte: string): Clauses {
  const clauses: Clauses = {};
  const notes: string[] = [];
  for (const morceau of texte.split('/').map((x) => x.trim()).filter(Boolean)) {
    if (/n°\s*1|numéro 1|numero 1/i.test(morceau)) clauses.statutN1 = true;
    else notes.push(morceau);
  }
  if (notes.length) clauses.note = notes.join(' / ');
  return clauses;
}

function fichier(f: FichiersDonnees, nom: string): string {
  const t = f[nom];
  if (t === undefined) throw new ErreurDonnees([`Fichier manquant : ${nom}`]);
  return t;
}

function verifierIdsUniques(nomFichier: string, ids: { id: string; numero: number }[], problemes: string[]): Set<string> {
  const vus = new Set<string>();
  for (const { id, numero } of ids) {
    if (vus.has(id)) problemes.push(`${nomFichier}, ligne ${numero} : identifiant en double « ${id} »`);
    if (!/^[a-z]+_[a-z0-9_]+$/.test(id)) problemes.push(`${nomFichier}, ligne ${numero} : identifiant mal formé « ${id} » (minuscules, préfixe_suffixe)`);
    vus.add(id);
  }
  return vus;
}

export function chargerDonnees(f: FichiersDonnees): DonneesInitiales {
  const problemes: string[] = [];
  const anneeMax = 2100;

  // Nationalités et noms (communs).
  const lnat = lireCsv('nationalites.csv', fichier(f, 'nationalites.csv'), ['code', 'nom', 'poidsPaddock']);
  const rn = new Lecteur('nationalites.csv');
  const nationalites = lnat.map((l) => ({ code: rn.texte(l, 'code'), nom: rn.texte(l, 'nom'), poids: rn.decimal(l, 'poidsPaddock', 0, 1000) }));
  const codesNat = new Set(nationalites.map((n) => n.code));
  const lnoms = lireCsv('noms.csv', fichier(f, 'noms.csv'), ['nationalite', 'type', 'valeur']);
  const rno = new Lecteur('noms.csv');
  const noms: DonneesInitiales['noms'] = {};
  for (const l of lnoms) {
    const nat = rno.reference(l, 'nationalite', codesNat);
    const type = rno.parmi(l, 'type', ['prenom', 'nom'] as const);
    const v = rno.texte(l, 'valeur');
    const entree = (noms[nat] ??= { prenoms: [], noms: [] });
    (type === 'prenom' ? entree.prenoms : entree.noms).push(v);
  }
  for (const n of nationalites) {
    const e = noms[n.code];
    if (n.poids > 0 && (!e || e.prenoms.length === 0 || e.noms.length === 0)) {
      problemes.push(`noms.csv : aucun prénom ou aucun nom pour la nationalité ${n.code}, qui a un poids non nul`);
    }
  }

  // Motoristes.
  const lmot = lireCsv('motoristes.csv', fichier(f, 'motoristes.csv'), ['id', 'nom', 'nationalite', 'niveau']);
  const rm = new Lecteur('motoristes.csv');
  const motoristes: Motoriste[] = lmot.map((l) => ({
    id: rm.texte(l, 'id'),
    nom: rm.texte(l, 'nom'),
    nationalite: rm.reference(l, 'nationalite', codesNat),
    niveau: rm.entier(l, 'niveau', 1, 20),
    verification: l.valeurs['verification'] ?? '',
  }));
  const idsMot = verifierIdsUniques('motoristes.csv', lmot.map((l, i) => ({ id: motoristes[i]!.id, numero: l.numero })), problemes);

  // Écuries.
  const colsEq = ['id', 'nom', 'nomCourt', 'nationalite', 'anneeCreationLignee', 'anneeNomActuel', 'motoriste', 'niveauVoiture', 'budgetMEUR', 'prestige', 'popularite', 'pressionMediatique', 'toleranceConseil', 'culture', 'philosophieTechnique', 'politiqueRecrutement', 'titresConstructeurs', 'titresPilotes'];
  const leq = lireCsv('ecuries.csv', fichier(f, 'ecuries.csv'), colsEq);
  const re = new Lecteur('ecuries.csv');
  const ecuries: Ecurie[] = leq.map((l) => ({
    id: re.texte(l, 'id'),
    nom: re.texte(l, 'nom'),
    nomCourt: re.texte(l, 'nomCourt'),
    nationalite: re.reference(l, 'nationalite', codesNat),
    anneeCreationLignee: re.entier(l, 'anneeCreationLignee', 1900, anneeMax),
    anneeNomActuel: re.entier(l, 'anneeNomActuel', 1900, anneeMax),
    motoriste: re.reference(l, 'motoriste', idsMot),
    niveauVoiture: re.entier(l, 'niveauVoiture', 1, 20),
    budgetMEUR: re.decimal(l, 'budgetMEUR', 1, 5000),
    prestige: re.entier(l, 'prestige', 1, 20),
    popularite: re.entier(l, 'popularite', 1, 20),
    pressionMediatique: re.entier(l, 'pressionMediatique', 1, 20),
    toleranceConseil: re.entier(l, 'toleranceConseil', 1, 20),
    culture: re.texte(l, 'culture'),
    philosophieTechnique: re.texte(l, 'philosophieTechnique'),
    politiqueRecrutement: re.texte(l, 'politiqueRecrutement'),
    titresConstructeurs: re.entier(l, 'titresConstructeurs', 0, 100),
    titresPilotes: re.entier(l, 'titresPilotes', 0, 100),
    verification: l.valeurs['verification'] ?? '',
    statut: 'active',
    typeOrganisation: 'ecurie',
    ...(re.texte(l, 'ecuriePartenaire', false) ? { ecuriePartenaire: re.texte(l, 'ecuriePartenaire', false) } : {}),
  }));
  const idsEq = verifierIdsUniques('ecuries.csv', leq.map((l, i) => ({ id: ecuries[i]!.id, numero: l.numero })), problemes);
  if (ecuries.length === 0) problemes.push('ecuries.csv : aucune écurie');

  // Personnes.
  const lper = lireCsv('personnes.csv', fichier(f, 'personnes.csv'), ['id', 'prenom', 'nom', 'nationalite', 'dateNaissance', 'poste', 'ecurie', 'statut', ...COMPETENCES_PILOTE, 'potentiel']);
  const rp = new Lecteur('personnes.csv');
  const personnes: PersonneDonnees[] = lper.map((l) => {
    const poste = rp.parmi(l, 'poste', POSTES_DONNEES);
    const statut = rp.parmi(l, 'statut', ['actif', 'retraite'] as const);
    const naissance = rp.texte(l, 'dateNaissance');
    const mDate = /^(\d{4})(-(\d{2})-(\d{2}))?$/.exec(naissance);
    if (!mDate) rp.signaler(l, `date de naissance « ${naissance} » invalide (AAAA-MM-JJ ou AAAA)`);
    const estPilote = poste === 'pilote_titulaire' || poste === 'pilote_reserve';
    let competences: Record<string, number> | null = null;
    let potentiel: number | null = null;
    if (estPilote) {
      competences = {};
      for (const c of COMPETENCES_PILOTE) competences[c] = rp.entier(l, c, 1, 20);
      potentiel = rp.entier(l, 'potentiel', 1, 20);
    }
    return {
      id: rp.texte(l, 'id'),
      prenom: rp.texte(l, 'prenom'),
      nom: rp.texte(l, 'nom'),
      nationalite: rp.reference(l, 'nationalite', codesNat),
      dateNaissance: naissance,
      anneeNaissance: mDate ? Number(mDate[1]) : NaN,
      poste,
      ecurie: statut === 'actif' ? rp.reference(l, 'ecurie', idsEq) : '',
      statut,
      competences,
      potentiel,
      profilCarriere: (() => {
        const v = rp.texte(l, 'profilCarriere', false);
        if (v && !ARCHETYPES[v]) rp.signaler(l, `profil de carrière « ${v} » inconnu (${Object.keys(ARCHETYPES).join(', ')})`);
        return v || undefined;
      })(),
      verification: l.valeurs['verification'] ?? '',
    };
  });
  const idsPer = verifierIdsUniques('personnes.csv', lper.map((l, i) => ({ id: personnes[i]!.id, numero: l.numero })), problemes);
  for (const p of personnes) {
    if (p.competences && p.potentiel !== null) {
      const moy = moyenne(Object.values(p.competences));
      if (p.potentiel < Math.floor(moy)) problemes.push(`personnes.csv : ${p.prenom} ${p.nom} a un potentiel (${p.potentiel}) inférieur à son niveau moyen actuel (${moy.toFixed(1)})`);
    }
  }

  // Contrats.
  const lctr = lireCsv('contrats.csv', fichier(f, 'contrats.csv'), ['id', 'personne', 'ecurie', 'poste', 'debut', 'fin', 'salaireMEUR']);
  const rc = new Lecteur('contrats.csv');
  const contrats = lctr.map((l) => ({
    id: rc.texte(l, 'id'),
    personne: rc.reference(l, 'personne', idsPer),
    organisation: rc.reference(l, 'ecurie', idsEq),
    type: 'emploi' as const,
    poste: rc.parmi(l, 'poste', POSTES_DONNEES),
    debut: rc.entier(l, 'debut', 1950, anneeMax),
    fin: rc.entier(l, 'fin', 1950, anneeMax),
    salaireMEUR: rc.decimal(l, 'salaireMEUR', 0, 500),
    clauses: lireClauses(l.valeurs['clauses'] ?? ''),
    verification: l.valeurs['verification'] ?? '',
  }));
  verifierIdsUniques('contrats.csv', lctr.map((l, i) => ({ id: contrats[i]!.id, numero: l.numero })), problemes);
  for (const c of contrats) if (c.fin < c.debut) problemes.push(`contrats.csv : ${c.id} se termine avant de commencer`);

  // Carrières.
  const lcar = lireCsv('carrieres.csv', fichier(f, 'carrieres.csv'), ['personne', 'ecurieLignee', 'nomHistorique', 'poste', 'de', 'a']);
  const rca = new Lecteur('carrieres.csv');
  const carrieres = lcar.map((l) => ({
    personne: rca.reference(l, 'personne', idsPer),
    ecurieLignee: rca.reference(l, 'ecurieLignee', idsEq),
    nomHistorique: rca.texte(l, 'nomHistorique'),
    poste: rca.parmi(l, 'poste', POSTES_DONNEES),
    de: rca.entier(l, 'de', 1950, anneeMax),
    a: rca.entier(l, 'a', 1950, anneeMax),
    ...((l.valeurs['moisDe'] ?? '') !== '' ? { moisDe: rca.entier(l, 'moisDe', 1, 12) } : {}),
    ...((l.valeurs['moisA'] ?? '') !== '' ? { moisA: rca.entier(l, 'moisA', 1, 12) } : {}),
    note: l.valeurs['note'] ?? '',
  }));
  // Audit de la phase 9 : carrières impossibles ou qui se chevauchent (un transfert en cours de saison précise ses mois).
  problemes.push(...verifierCarrieres(carrieres, lcar.map((l) => l.numero), DATE_DEPART.annee));

  // Palmarès.
  const lpal = lireCsv('palmares.csv', fichier(f, 'palmares.csv'), ['saison', 'championPilote', 'ecurieChampionPilote', 'championConstructeurs']);
  const rpa = new Lecteur('palmares.csv');
  const palmares = lpal.map((l) => ({
    saison: rpa.entier(l, 'saison', 1950, anneeMax),
    championPilote: rpa.reference(l, 'championPilote', idsPer),
    ecurieChampionPilote: rpa.reference(l, 'ecurieChampionPilote', idsEq),
    championConstructeurs: rpa.reference(l, 'championConstructeurs', idsEq),
    note: l.valeurs['note'] ?? '',
  }));

  // Audit (1.11) : une saison n'a qu'un palmarès (sinon la seconde ligne écrasait la première en silence).
  const saisonsPal = new Set<number>();
  palmares.forEach((p, i) => { if (saisonsPal.has(p.saison)) problemes.push(`palmares.csv, ligne ${lpal[i]!.numero} : saison ${p.saison} en double`); saisonsPal.add(p.saison); });

  // Phase 9 : histoires réelles (porteur : une personne ; cible : une personne ou une écurie).
  const lhis = lireCsv('histoires.csv', fichier(f, 'histoires.csv'), ['id', 'saison', 'porteur', 'cible', 'etiquette', 'intensite', 'reciproque', 'texte']);
  const rh = new Lecteur('histoires.csv');
  const idsPerEq = new Set([...idsPer, ...idsEq]);
  const histoires: HistoireDonnees[] = lhis.map((l) => ({
    id: rh.texte(l, 'id'),
    saison: rh.entier(l, 'saison', 1950, anneeMax),
    porteur: rh.reference(l, 'porteur', idsPer),
    cible: rh.reference(l, 'cible', idsPerEq),
    etiquette: rh.parmi(l, 'etiquette', Object.keys(ETIQUETTES) as readonly string[]),
    intensite: rh.decimal(l, 'intensite', 0.2, 2),
    reciproque: rh.parmi(l, 'reciproque', ['oui', 'non'] as const) === 'oui',
    texte: rh.texte(l, 'texte'),
    verification: l.valeurs['verification'] ?? '',
  }));
  verifierIdsUniques('histoires.csv', lhis.map((l, i) => ({ id: histoires[i]!.id, numero: l.numero })), problemes);
  for (const h of histoires) if (h.reciproque && idsEq.has(h.cible)) problemes.push(`histoires.csv : ${h.id} est réciproque mais sa cible est une écurie`);
  // Audit (4.16) : pas d'histoire envers soi-même ; pas deux histoires de même étiquette pour la même paire la même saison.
  const paires = new Set<string>();
  for (const h of histoires) {
    if (h.porteur === h.cible) problemes.push(`histoires.csv : ${h.id} a le même porteur et la même cible`);
    const cle = `${h.saison}|${h.porteur}|${h.cible}|${h.etiquette}`;
    if (paires.has(cle)) problemes.push(`histoires.csv : ${h.id} répète une histoire déjà saisie (même saison, paire et étiquette)`);
    paires.add(cle);
  }
  // Audit de la phase 9 : une histoire appartient au passé reconstruit, et ses protagonistes y étaient en âge de la vivre.
  const naissance = new Map(personnes.map((p) => [p.id, p.anneeNaissance]));
  for (const h of histoires) {
    if (!Number.isFinite(h.saison)) continue;
    if (h.saison < PASSE.debut || h.saison >= DATE_DEPART.annee) problemes.push(`histoires.csv : ${h.id} est datée de ${h.saison}, hors du passé reconstruit (${PASSE.debut}–${DATE_DEPART.annee - 1})`);
    for (const id of [h.porteur, h.cible]) {
      const n = naissance.get(id);
      if (n !== undefined && h.saison - n < AGE_MIN_HISTOIRE) problemes.push(`histoires.csv : ${h.id} met en scène ${id} à ${h.saison - n} ans (au moins ${AGE_MIN_HISTOIRE} ans)`);
    }
  }

  // Circuits.
  const lcir = lireCsv('circuits.csv', fichier(f, 'circuits.csv'), ['id', 'nom', 'ville', 'pays', 'type', 'altitudeM', 'climatPluie', ...CHAMPS_EXIGENCES]);
  const rci = new Lecteur('circuits.csv');
  const circuits: Circuit[] = lcir.map((l) => ({
    id: rci.texte(l, 'id'),
    nom: rci.texte(l, 'nom'),
    ville: rci.texte(l, 'ville'),
    pays: rci.texte(l, 'pays'),
    type: rci.parmi(l, 'type', ['rapide', 'lent et sinueux', 'mixte', 'urbain', 'altitude'] as const),
    altitudeM: rci.entier(l, 'altitudeM', -500, 5000),
    climatPluie: rci.parmi(l, 'climatPluie', ['très faible', 'faible', 'moyen', 'élevé'] as const),
    exigences: Object.fromEntries(CHAMPS_EXIGENCES.map((c) => [c, rci.entier(l, c, 1, 5)])) as unknown as ExigencesCircuit,
    verification: l.valeurs['verification'] ?? '',
    // Phase 11b : vivier (colonnes facultatives ; sans elles, ancien calendrier).
    ...(l.valeurs['statut'] ? {
      vivier: {
        statut: rci.parmi(l, 'statut', ['permanent', 'rotation'] as const),
        finContrat: l.valeurs['finContrat'] ? rci.entier(l, 'finContrat', 1950, 2200) : null,
        jourHabituel: rci.entier(l, 'jourHabituel', 1, 366),
        derniereEdition: l.valeurs['derniereEdition'] ? rci.entier(l, 'derniereEdition', 1950, 2200) : null,
      },
    } : {}),
  }));
  // Audit (1.14) : le vivier est tout ou rien (sinon les circuits sans statut ne seraient jamais courus, sans message).
  const avecStatut = circuits.filter((c) => c.vivier).length;
  if (avecStatut > 0 && avecStatut < circuits.length) problemes.push(`circuits.csv : ${circuits.length - avecStatut} circuit(s) sans statut de vivier alors que d'autres en ont un`);
  // Phase 11b : climat mensuel (fichier facultatif climat-circuits.csv, généré par tools/circuits/generer-fiches-jeu.mts).
  if (f['climat-circuits.csv'] !== undefined) {
    const lcl = lireCsv('climat-circuits.csv', f['climat-circuits.csv'], ['id', 'mois', 'pluieCourse']);
    const rcl = new Lecteur('climat-circuits.csv');
    const parId = new Map(circuits.map((c) => [c.id, c]));
    const vus = new Map<string, Set<number>>();
    for (const l of lcl) {
      const c = parId.get(rcl.texte(l, 'id'));
      if (!c) { problemes.push(`climat-circuits.csv ligne ${l.numero} : circuit inconnu`); continue; }
      const mois = rcl.entier(l, 'mois', 1, 12);
      const dejaVus = vus.get(c.id) ?? new Set<number>();
      if (dejaVus.has(mois)) problemes.push(`climat-circuits.csv ligne ${l.numero} : mois ${mois} en double pour ${c.id}`);
      dejaVus.add(mois); vus.set(c.id, dejaVus);
      (c.pluieMensuelle ??= new Array<number>(12).fill(Number.NaN))[mois - 1] = rcl.decimal(l, 'pluieCourse', 0, 1);
      // Phase 12a : température de l'air pendant la course (besoin de refroidissement), si la colonne est renseignée.
      if ((l.valeurs['airCourseC'] ?? '') !== '') (c.temperatureMensuelle ??= new Array<number>(12).fill(Number.NaN))[mois - 1] = rcl.decimal(l, 'airCourseC', -20, 60);
    }
    for (const c of circuits) if (c.temperatureMensuelle && c.temperatureMensuelle.some((x) => !Number.isFinite(x))) problemes.push(`climat-circuits.csv : ${c.id} n'a pas ses 12 températures`);
    // Audit (1.4) : un mois absent n'est jamais remplacé par 0 en silence.
    for (const c of circuits) if (c.pluieMensuelle && c.pluieMensuelle.some((x) => !Number.isFinite(x))) problemes.push(`climat-circuits.csv : ${c.id} n'a pas ses 12 mois`);
    problemes.push(...rcl.problemes);
  }
  // Phase 13b : difficulté de dépassement et perte de la voie des stands (fichier facultatif, tools/circuits/course-circuits.mts).
  if (f['course-circuits.csv'] !== undefined) {
    const lcc = lireCsv('course-circuits.csv', f['course-circuits.csv'], ['id', 'difficulteDepassement', 'perteVoieS']);
    const rcc = new Lecteur('course-circuits.csv');
    const parId = new Map(circuits.map((c) => [c.id, c]));
    for (const l of lcc) {
      const c = parId.get(rcc.texte(l, 'id'));
      if (!c) { problemes.push(`course-circuits.csv ligne ${l.numero} : circuit inconnu`); continue; }
      c.course = { difficulteDepassement: rcc.entier(l, 'difficulteDepassement', 1, 5), perteVoieS: rcc.decimal(l, 'perteVoieS', 5, 40) };
    }
    problemes.push(...rcc.problemes);
  }
  verifierIdsUniques('circuits.csv', lcir.map((l, i) => ({ id: circuits[i]!.id, numero: l.numero })), problemes);
  // Phase 12a : sensibilités du temps au tour (tools/circuits/sensibilites-voiture.mts) ; obligatoires pour chaque circuit.
  // 28/11 (13a bis, remarque du porteur) : si `sensibilites-course.csv` existe (voiture de course : carburant, pneus usés, recharge),
  // c'est lui que lisent les Grands Prix (`sensibilites`) ; celles de qualification sont gardées à part (`sensibilitesQualif`, phase 13b).
  for (const nomFichier of ['sensibilites-circuits.csv', 'sensibilites-course.csv'] as const) {
    if (nomFichier === 'sensibilites-course.csv' && f[nomFichier] === undefined) continue;
    const lse = lireCsv(nomFichier, fichier(f, nomFichier), ['id', 'tempsS', 'niveauAileron', ...PARAMETRES_SENSIBILITE.flatMap((k) => [`d1_${k}`, `d2_${k}`])]);
    const rse = new Lecteur(nomFichier);
    const parId = new Map(circuits.map((c) => [c.id, c]));
    for (const l of lse) {
      const c = parId.get(rse.texte(l, 'id'));
      if (!c) { problemes.push(`${nomFichier} ligne ${l.numero} : circuit inconnu`); continue; }
      if (nomFichier === 'sensibilites-course.csv') c.sensibilitesQualif = c.sensibilites;
      c.sensibilites = {
        tempsS: rse.decimal(l, 'tempsS', 30, 200), niveauAileron: rse.decimal(l, 'niveauAileron', -2, 3),
        d1: Object.fromEntries(PARAMETRES_SENSIBILITE.map((k) => [k, rse.decimal(l, `d1_${k}`, -5, 5)])),
        d2: Object.fromEntries(PARAMETRES_SENSIBILITE.map((k) => [k, rse.decimal(l, `d2_${k}`, -5, 5)])),
      };
    }
    for (const c of circuits) if (!c.sensibilites) problemes.push(`${nomFichier} : aucune sensibilité pour ${c.id} (relancer tools/circuits/sensibilites-voiture.mts)`);
    problemes.push(...rse.problemes);
  }

  // Voitures (D-056).
  const lvoi = lireCsv('voitures.csv', fichier(f, 'voitures.csv'), ['ecurie', 'viragesLents', 'viragesRapides', 'vitessePointe', 'efficaciteAero', 'fiabilite', 'gestionPneus']);
  const rv = new Lecteur('voitures.csv');
  const voitures: VoitureDonnees[] = lvoi.map((l) => {
    const ecurie = rv.reference(l, 'ecurie', idsEq);
    return {
      id: `voi_${ecurie.replace(/^eq_/, '')}`,
      ecurie,
      viragesLents: rv.entier(l, 'viragesLents', 1, 20),
      viragesRapides: rv.entier(l, 'viragesRapides', 1, 20),
      vitessePointe: rv.entier(l, 'vitessePointe', 1, 20),
      efficaciteAero: rv.entier(l, 'efficaciteAero', 1, 20),
      fiabilite: rv.entier(l, 'fiabilite', 1, 20),
      gestionPneus: rv.entier(l, 'gestionPneus', 1, 20),
      // Phase 12c (D-175) : motricité en sortie de virage (colonne facultative ; sans elle, la note des virages lents).
      motricite: l.valeurs['motricite'] ? rv.entier(l, 'motricite', 1, 20) : rv.entier(l, 'viragesLents', 1, 20),
      verification: l.valeurs['verification'] ?? '',
    };
  });
  for (const e of ecuries) {
    const n = voitures.filter((v) => v.ecurie === e.id).length;
    if (n !== 1) problemes.push(`voitures.csv : ${n} ligne(s) pour l'écurie ${e.id} (il en faut exactement 1)`);
  }

  // Finances (phase 5a).
  const lfin = lireCsv('finances.csv', fichier(f, 'finances.csv'), ['ecurie', 'tresorerieMEUR', 'typeProprietaire', 'apportAnnuelMEUR', 'revenusCommerciauxMEUR']);
  const rf = new Lecteur('finances.csv');
  const finances = lfin.map((l) => ({
    ecurie: rf.reference(l, 'ecurie', idsEq),
    tresorerieMEUR: rf.decimal(l, 'tresorerieMEUR', -1000, 5000),
    typeProprietaire: rf.parmi(l, 'typeProprietaire', ['constructeur', 'milliardaire', 'fonds', 'famille', 'consortium'] as const),
    apportAnnuelMEUR: rf.decimal(l, 'apportAnnuelMEUR', 0, 2000),
    revenusCommerciauxMEUR: rf.decimal(l, 'revenusCommerciauxMEUR', 0, 2000),
    verification: l.valeurs['verification'] ?? '',
  }));
  for (const e of ecuries) {
    const n = finances.filter((x) => x.ecurie === e.id).length;
    if (n !== 1) problemes.push(`finances.csv : ${n} ligne(s) pour l'écurie ${e.id} (il en faut exactement 1)`);
  }

  // Médias (phase 11).
  const lmed = lireCsv('medias.csv', fichier(f, 'medias.csv'), ['id', 'nom', 'type', 'nationalite', 'fiabilite', 'appetitRumeurs']);
  const rmed = new Lecteur('medias.csv');
  const medias: Media[] = lmed.map((l) => ({
    id: rmed.texte(l, 'id'),
    nom: rmed.texte(l, 'nom'),
    type: rmed.parmi(l, 'type', TYPES_MEDIAS),
    ...(rmed.texte(l, 'nationalite', false) ? { nationalite: rmed.reference(l, 'nationalite', codesNat) } : {}),
    fiabilite: rmed.decimal(l, 'fiabilite', 0, 1),
    appetitRumeurs: rmed.decimal(l, 'appetitRumeurs', 0, 1),
  }));
  verifierIdsUniques('medias.csv', lmed.map((l, i) => ({ id: medias[i]!.id, numero: l.numero })), problemes);
  for (const m of medias) if (m.type === 'national' && !m.nationalite) problemes.push(`medias.csv : le média national ${m.id} n'a pas de nationalité`);

  problemes.push(...rmed.problemes, ...rf.problemes, ...rv.problemes, ...rn.problemes, ...rno.problemes, ...rm.problemes, ...re.problemes, ...rp.problemes, ...rc.problemes, ...rca.problemes, ...rpa.problemes, ...rci.problemes, ...rh.problemes);
  if (problemes.length > 0) throw new ErreurDonnees(problemes);

  // Sponsors fictifs (phase 5b).
  const lsec = lireCsv('secteurs.csv', fichier(f, 'secteurs.csv'), ['secteur', 'libelle', 'poids', 'budgetMinMEUR', 'budgetMaxMEUR', 'suffixes']);
  const rs = new Lecteur('secteurs.csv');
  const secteurs: Secteur[] = lsec.map((l) => ({
    secteur: rs.texte(l, 'secteur'), libelle: rs.texte(l, 'libelle'), poids: rs.decimal(l, 'poids', 0, 1000),
    budgetMinMEUR: rs.decimal(l, 'budgetMinMEUR', 0, 1000), budgetMaxMEUR: rs.decimal(l, 'budgetMaxMEUR', 0, 1000),
    suffixes: rs.texte(l, 'suffixes').split('|').map((x) => x.trim()).filter(Boolean),
  }));
  for (const s of secteurs) if (s.budgetMaxMEUR < s.budgetMinMEUR) problemes.push(`secteurs.csv : budget maximal inférieur au minimal pour ${s.secteur}`);
  const rent = new Lecteur('entreprises.csv');
  const racinesEntreprises = lireCsv('entreprises.csv', fichier(f, 'entreprises.csv'), ['racine']).map((l) => rent.texte(l, 'racine'));
  if (racinesEntreprises.length < 10) problemes.push('entreprises.csv : il faut au moins 10 racines de noms');

  const ljun = lireCsv('ecuries-juniors.csv', fichier(f, 'ecuries-juniors.csv'), ['nom', 'nationalite']);
  const rj = new Lecteur('ecuries-juniors.csv');
  const ecuriesJuniors = ljun.map((l) => ({ nom: rj.texte(l, 'nom'), nationalite: rj.reference(l, 'nationalite', codesNat) }));
  if (ecuriesJuniors.length < 21) problemes.push('ecuries-juniors.csv : il faut au moins 21 noms (10 écuries Apex 3 + 11 écuries Apex 2)');

  // Audit (1.3) : les erreurs des fichiers communs lus après le premier contrôle sont signalées elles aussi.
  problemes.push(...rs.problemes, ...rent.problemes, ...rj.problemes);
  if (problemes.length > 0) throw new ErreurDonnees(problemes);

  return { motoristes, ecuries, personnes, contrats, carrieres, palmares, histoires, circuits, voitures, finances, nationalites, noms, secteurs, racinesEntreprises, ecuriesJuniors, medias };
}

/**
 * Audit de la phase 9 — cohérence des carrières : fin avant le début, passage après le départ du jeu, mois invalides,
 * et deux passages qui se recouvrent (au mois près : un transfert en cours de saison doit préciser `moisA` et `moisDe`).
 */
export function verifierCarrieres(carrieres: { personne: string; ecurieLignee: string; poste: string; de: number; a: number; moisDe?: number; moisA?: number }[], numeros: number[], anneeDepart: number): string[] {
  const pb: string[] = [];
  const ou = (i: number) => `carrieres.csv, ligne ${numeros[i]} (${carrieres[i]!.personne}, ${carrieres[i]!.ecurieLignee})`;
  const debutMois = (c: (typeof carrieres)[number]) => c.de * 12 + (c.moisDe ?? 1) - 1;
  const finMois = (c: (typeof carrieres)[number]) => c.a * 12 + (c.moisA ?? 12) - 1;
  carrieres.forEach((c, i) => {
    if (!Number.isFinite(c.de) || !Number.isFinite(c.a)) return;
    if (c.a < c.de) pb.push(`${ou(i)} : la fin (${c.a}) est antérieure au début (${c.de})`);
    else if (finMois(c) < debutMois(c)) pb.push(`${ou(i)} : le mois de départ (${c.moisA}) précède le mois d'arrivée (${c.moisDe}) la même année`);
    if (c.a >= anneeDepart) pb.push(`${ou(i)} : le passé s'arrête en ${anneeDepart - 1} (la saison ${anneeDepart} relève de contrats.csv), fin déclarée ${c.a}`);
  });
  for (let i = 0; i < carrieres.length; i++) for (let j = i + 1; j < carrieres.length; j++) {
    const a = carrieres[i]!, b = carrieres[j]!;
    if (a.personne !== b.personne || ![a.de, a.a, b.de, b.a].every(Number.isFinite)) continue;
    if (debutMois(a) <= finMois(b) && debutMois(b) <= finMois(a)) {
      pb.push(`${ou(j)} : chevauche le passage chez ${a.ecurieLignee} (ligne ${numeros[i]}) ; un transfert en cours de saison doit préciser moisA et moisDe sans recouvrement`);
    }
  }
  return pb;
}
