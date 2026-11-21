/**
 * Chargement et validation du jeu de données initial (docs/systemes/donnees-initiales.md).
 * Toutes les erreurs sont accumulées puis signalées ensemble, avec fichier, ligne et colonne.
 */

import { COMPETENCES_PILOTE } from '../balance/personnages';
import type { Carriere, Circuit, Contrat, Ecurie, Motoriste, Palmares, Poste } from '../model/types';
import { ErreurDonnees, Lecteur, lireCsv } from './csv';

/** Texte des fichiers, indexé par nom de fichier. */
export type FichiersDonnees = Record<string, string>;

export const FICHIERS_GRILLE = ['ecuries.csv', 'motoristes.csv', 'personnes.csv', 'contrats.csv', 'carrieres.csv', 'palmares.csv', 'circuits.csv'] as const;
export const FICHIERS_COMMUNS = ['nationalites.csv', 'noms.csv'] as const;

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
  verification: string;
}

export interface Nationalite {
  code: string;
  nom: string;
  poids: number;
}

export interface DonneesInitiales {
  motoristes: Motoriste[];
  ecuries: Ecurie[];
  personnes: PersonneDonnees[];
  contrats: Omit<Contrat, 'statut'>[];
  carrieres: Omit<Carriere, 'id'>[];
  palmares: Omit<Palmares, 'id'>[];
  circuits: Circuit[];
  nationalites: Nationalite[];
  /** Prénoms et noms par code de nationalité. */
  noms: Record<string, { prenoms: string[]; noms: string[] }>;
}

/** Moyenne d'une liste de notes. */
export function moyenne(valeurs: number[]): number {
  return valeurs.length === 0 ? 0 : valeurs.reduce((a, b) => a + b, 0) / valeurs.length;
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
    ecurie: rc.reference(l, 'ecurie', idsEq),
    poste: rc.parmi(l, 'poste', POSTES_DONNEES),
    debut: rc.entier(l, 'debut', 1950, anneeMax),
    fin: rc.entier(l, 'fin', 1950, anneeMax),
    salaireMEUR: rc.decimal(l, 'salaireMEUR', 0, 500),
    clauses: l.valeurs['clauses'] ?? '',
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
    note: l.valeurs['note'] ?? '',
  }));

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

  // Circuits.
  const lcir = lireCsv('circuits.csv', fichier(f, 'circuits.csv'), ['id', 'nom', 'ville', 'pays', 'type', 'altitudeM', 'climatPluie']);
  const rci = new Lecteur('circuits.csv');
  const circuits: Circuit[] = lcir.map((l) => ({
    id: rci.texte(l, 'id'),
    nom: rci.texte(l, 'nom'),
    ville: rci.texte(l, 'ville'),
    pays: rci.texte(l, 'pays'),
    type: rci.parmi(l, 'type', ['rapide', 'lent et sinueux', 'mixte', 'urbain', 'altitude'] as const),
    altitudeM: rci.entier(l, 'altitudeM', -500, 5000),
    climatPluie: rci.parmi(l, 'climatPluie', ['très faible', 'faible', 'moyen', 'élevé'] as const),
    verification: l.valeurs['verification'] ?? '',
  }));
  verifierIdsUniques('circuits.csv', lcir.map((l, i) => ({ id: circuits[i]!.id, numero: l.numero })), problemes);

  problemes.push(...rn.problemes, ...rno.problemes, ...rm.problemes, ...re.problemes, ...rp.problemes, ...rc.problemes, ...rca.problemes, ...rpa.problemes, ...rci.problemes);
  if (problemes.length > 0) throw new ErreurDonnees(problemes);

  return { motoristes, ecuries, personnes, contrats, carrieres, palmares, circuits, nationalites, noms };
}
