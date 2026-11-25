/**
 * Systèmes de la saison abstraite (phase 3, docs/systemes/phase-3-saison.md).
 *
 * Ordre dans la semaine :
 *   saison.intersaison   (semaine 1)       : nouvelles voitures, évolution des motoristes, création de la saison et du calendrier
 *   saison.grandsPrix    (rendez-vous « gp ») : résultats abstraits, points, classements
 *   saison.developpement (tous les 4 semaines en saison) : évolution des voitures
 *   saison.finDeSaison   (semaine 49)       : titres, palmarès, primes, chronique
 */

import { PERSONNEL_MARCHE, USURE_SUCCES } from '../../balance/marche';
import { SEMAINES_PAR_AN } from '../../balance/calendrier';
import { PHASES_SAISON } from '../../balance/calendrier';
import { CARACTERISTIQUES_VITESSE, PROBABILITE_PLUIE } from '../../balance/circuits';
import {
  ABANDON_MECANIQUE, ALEA_SIGMA, CONFIANCE_REFERENCE, DIFFICULTE_CIRCUIT, ECART_PILOTE_PAR_POINT, ECART_VOITURE_PAR_POINT, EFFET_FORME_MAX, INCIDENT,
  MULTIPLICATEUR_ALEA_PLUIE, SEUIL_SURPRISE_PCT,
} from '../../balance/course';
import {
  ALEA_DEVELOPPEMENT_MENSUEL, ALEA_INTERSAISON, BORNES_CARACTERISTIQUE, BUDGET_REFERENCE_MEUR, FACTEUR_BUDGET, MOIS_EQUIVALENTS_INTERSAISON,
  MOTORISTE_ALEA_ANNUEL, MOTORISTE_PROGRESSION_ANNUELLE, PLAFOND_TECHNIQUE, POIDS_CAPACITE, TAUX_DEVELOPPEMENT_MENSUEL,
} from '../../balance/developpement';
import { BAREME_POINTS, ENVELOPPE_PRIMES_MEUR, PARTS_PRIMES } from '../../balance/reglement';
import { ajouterEvenement } from '../../core/evenements';
import { planifier, tirageLocal, type Moteur, type Systeme } from '../../core/moteur';
import { idsTries, parametre, table, type Entite, type Monde } from '../../core/monde';
import {
  TABLES, type Circuit, type Contrat, type Ecurie, type GrandPrix, type Installation, type LigneClassementConstructeur, type LigneClassementPilote,
  type Motoriste, type Palmares, type Personne, type ResultatPilote, type Saison, type Voiture,
} from '../../model/types';
import { genererChronique } from './chronique';
import { apresGrandPrix, erreurPression, modificateurNiveau, noterLuttesTitre, titreSurCircuit } from '../carriere/performance';
import { facteurBudgetDeveloppement, financesDe, niveauEffectif, restrictionAero } from '../economie';
import { bonusSavoirDeveloppement } from '../technique/conception';
import { usureSucces } from '../humain/decision';
import { nombreGrandsPrix } from '../politique/acces';
import { avecVivier, circuitsDeLaSaison, moisDeSemaine } from './calendrier';
import { partRecherche } from '../technique/acces';
import { ecuriesActives, indiceMoyen, indiceSurCircuit, niveauPilote, pilotesTitulaires, voitureDe } from './performance';
import { fiabiliteVoiture } from '../monoplaces/physique';

/** Durée de conservation des explications détaillées des résultats, en saisons. */
const CONSERVATION_EXPLICATIONS_SAISONS = 2;
/** Semaine du bilan de fin de saison. */
const SEMAINE_FIN_DE_SAISON = PHASES_SAISON.finDeSaison.debut;

const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));

export const idSaison = (annee: number) => `ssn_${annee}`;
export function saisonDe(monde: Monde, annee: number): Saison | undefined {
  return table(monde, TABLES.saisons)[idSaison(annee)] as unknown as Saison | undefined;
}
export function grandPrix(monde: Monde, id: string): GrandPrix {
  return table(monde, TABLES.grandsPrix)[id] as unknown as GrandPrix;
}

/* ---------------------------------------------------------------- Création de la saison */

export function creerSaison(monde: Monde, annee: number): Saison {
  const tc = table(monde, TABLES.circuits);
  const circuits = (Object.values(tc) as unknown as Circuit[]).sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0) || (a.id < b.id ? -1 : 1));
  // D-141 : nombre voté par les écuries. Phase 11b : permanents et rotation (vivier) ; parties antérieures : les N premiers du fichier.
  const retenus = avecVivier(monde) ? circuitsDeLaSaison(monde, annee, nombreGrandsPrix(monde)) : circuits.slice(0, nombreGrandsPrix(monde));
  const { debut, fin } = PHASES_SAISON.saison;
  const calendrier: string[] = [];
  // Audit (1.15) : avec le vivier, chaque Grand Prix tombe à la semaine de sa date habituelle (son vrai mois, donc son vrai climat),
  // dans la fenêtre de la saison et sans deux Grands Prix la même semaine ; sinon, répartition régulière (ancien calendrier).
  const semaines = semainesDesGrandsPrix(retenus, debut, fin);
  retenus.forEach((c, i) => {
    const semaine = semaines[i]!;
    const id = `gp_${annee}_${String(i + 1).padStart(2, '0')}`;
    const gp: GrandPrix = { id, saison: annee, manche: i + 1, circuit: c.id, semaine, pluie: false, termine: false, resultats: [] };
    table(monde, TABLES.grandsPrix)[id] = gp as unknown as Entite;
    planifier(monde, { annee, semaine }, 'gp', { gp: id });
    calendrier.push(id);
  });
  const ecuries = ecuriesActives(monde);
  const saison: Saison = {
    id: idSaison(annee),
    annee,
    calendrier,
    bareme: [...BAREME_POINTS],
    pilotes: pilotesTitulaires(monde).map((p) => ({ pilote: p.id, ecurie: p.ecurie, points: 0, victoires: 0, podiums: 0, abandons: 0, meilleurResultat: null })),
    constructeurs: ecuries.map((e) => ({ ecurie: e.id, points: 0, victoires: 0, doubles: 0 })),
    leaders: [],
    ecartsTete: [],
    indiceDebut: Object.fromEntries(ecuries.map((e) => [e.id, indiceMoyen(monde, e)])),
    indiceFin: {},
    termine: false,
    chronique: [],
  };
  table(monde, TABLES.saisons)[saison.id] = saison as unknown as Entite;
  return saison;
}

function semainesDesGrandsPrix(retenus: Circuit[], debut: number, fin: number): number[] {
  const n = retenus.length;
  const regulier = retenus.map((_, i) => (n === 1 ? debut : debut + Math.round((i * (fin - debut)) / (n - 1))));
  if (!retenus.every((c) => c.vivier) || n > fin - debut + 1) return regulier;
  const s = retenus.map((c) => Math.min(fin, Math.max(debut, Math.ceil(c.vivier!.jourHabituel / 7))));
  for (let i = 1; i < n; i++) s[i] = Math.max(s[i]!, s[i - 1]! + 1);
  for (let i = n - 1; i >= 0; i--) s[i] = Math.min(s[i]!, i === n - 1 ? fin : s[i + 1]! - 1);
  return s;
}

/* ---------------------------------------------------------------- Grand Prix */

export function simulerGrandPrix(monde: Monde, idGp: string): GrandPrix {
  const gp = grandPrix(monde, idGp);
  // Audit n°5 : idempotence. Un Grand Prix déjà couru (reprise, rendez-vous en double) ne redistribue ni points,
  // ni victoires, ni expérience, ni événements.
  if (gp.termine) return gp;
  const saison = saisonDe(monde, gp.saison) as Saison;
  const circuit = table(monde, TABLES.circuits)[gp.circuit] as unknown as Circuit;
  const ecuries = new Map(ecuriesActives(monde).map((e) => [e.id, e]));
  // Phase 11b : climat réel du mois où le Grand Prix a lieu (un Grand Prix déplacé change de climat) ; sinon, ancienne classe de pluie.
  const pluie = circuit.pluieMensuelle ? circuit.pluieMensuelle[moisDeSemaine(gp.semaine) - 1]! : (PROBABILITE_PLUIE[circuit.climatPluie] ?? 0.1);
  gp.pluie = tirageLocal(monde, 'meteo', gp.id).chance(pluie);

  // Rang des voitures sur ce circuit (1 = la plus rapide).
  const indices = new Map([...ecuries.values()].map((e) => [e.id, indiceSurCircuit(monde, e, circuit)]));
  const rangs = new Map([...indices.entries()].sort((a, b) => b[1] - a[1]).map(([id], i) => [id, i + 1]));
  const meilleurIndice = Math.max(...indices.values());
  const retard = (id: string) => Math.round((meilleurIndice - (indices.get(id) as number)) * ECART_VOITURE_PAR_POINT * 1000) / 1000;

  const sigma = parametre(monde, 'course.aleaSigma', ALEA_SIGMA) * (gp.pluie ? MULTIPLICATEUR_ALEA_PLUIE : 1);
  const partants = pilotesTitulaires(monde).filter((p) => ecuries.has(p.ecurie));
  // Audit n°4 : relevé du niveau contemporain de chaque pilote, à sa première course de la saison.
  saison.niveauxPilotes ??= {};
  for (const p of partants) saison.niveauxPilotes[p.id] ??= Math.round(niveauPilote(p, false) * 100) / 100;
  const calcul = partants.map((p) => {
    const e = ecuries.get(p.ecurie) as Ecurie;
    const f = tirageLocal(monde, 'course', gp.id, p.id);
    const voiture = (indices.get(e.id) as number) * ECART_VOITURE_PAR_POINT;
    // D-104 à D-108 : niveau du pilote sur CE circuit, affinité, handicaps de nouveauté ; la difficulté technique amplifie l'influence du pilote.
    const ecartPilote = parametre(monde, 'course.ecartPiloteParPoint', ECART_PILOTE_PAR_POINT) * (DIFFICULTE_CIRCUIT.min + DIFFICULTE_CIRCUIT.parPoint * circuit.exigences.difficulte);
    const mod = modificateurNiveau(monde, p, circuit);
    const pilote = (niveauPilote(p, gp.pluie, circuit.exigences) + mod.affinite + mod.nouveaute) * ecartPilote;
    const pression = erreurPression(monde, p, saison, gp.manche, gp.id);
    // D-140 : un pilote démotivé (usure du succès) perd un peu de rythme ; une motivation élevée n'apporte rien de plus.
    const forme = EFFET_FORME_MAX * borner((p.etat.confiance - CONFIANCE_REFERENCE) / (100 - CONFIANCE_REFERENCE), -1, 1)
      + USURE_SUCCES.effetCourse * borner((p.etat.motivation - USURE_SUCCES.motivationReference) / USURE_SUCCES.motivationReference, -1, 0);
    const alea = f.normale(0, sigma);
    // Audit (1.5) : la fiabilité peut dépasser 20 (bornes du développement) ; la probabilité ne descend pas sous le plancher.
    const pMeca = Math.max(ABANDON_MECANIQUE.plancher, ABANDON_MECANIQUE.base + (20 - fiabiliteVoiture(monde, e, voitureDe(monde, e.id).fiabilite)) * ABANDON_MECANIQUE.parPoint);
    const pInc = (INCIDENT.base + (20 - (p.competences['regularite'] ?? 10)) * INCIDENT.parPoint)
      * (gp.pluie ? INCIDENT.multiplicateurPluie : 1) * (circuit.exigences.risqueAccident / INCIDENT.risqueReference);
    const abandon = f.chance(pMeca) ? ('mecanique' as const) : f.chance(pInc) ? ('incident' as const) : null;
    return {
      p, e, temps: -(voiture + pilote + forme) + alea + pression, abandon,
      explication: { voiture, pilote, forme, alea, affinite: mod.affinite * ecartPilote, nouveaute: mod.nouveaute * ecartPilote, pression },
    };
  });

  const arrives = calcul.filter((c) => !c.abandon).sort((a, b) => a.temps - b.temps || (a.p.id < b.p.id ? -1 : 1));
  const tempsVainqueur = arrives[0]?.temps ?? 0;
  const resultats: ResultatPilote[] = [
    ...arrives.map((c, i) => ({
      pilote: c.p.id, ecurie: c.e.id, position: i + 1, abandon: null, points: saison.bareme[i] ?? 0,
      ecartPct: Math.round((c.temps - tempsVainqueur) * 1000) / 1000, rangVoiture: rangs.get(c.e.id) as number, retardVoiturePct: retard(c.e.id), explication: c.explication,
    })),
    ...calcul.filter((c) => c.abandon).sort((a, b) => (a.p.id < b.p.id ? -1 : 1)).map((c) => ({
      pilote: c.p.id, ecurie: c.e.id, position: null, abandon: c.abandon, points: 0, ecartPct: null, rangVoiture: rangs.get(c.e.id) as number, retardVoiturePct: retard(c.e.id), explication: c.explication,
    })),
  ];
  gp.resultats = resultats;
  gp.termine = true;
  // Expérience, apprentissage de la pluie, affinités (D-106, D-108).
  apresGrandPrix(monde, circuit, gp.id, gp.pluie, calcul.map((c) => {
    const r = resultats.find((x) => x.pilote === c.p.id);
    return { p: c.p, position: r?.position ?? null, incident: c.abandon === 'incident' };
  }));

  // Avant la dernière manche : le titre est-il encore ouvert ? (définition exacte, égalités comprises)
  if (gp.manche === saison.calendrier.length) {
    trierClassements(saison);
    noterLuttesTitre(saison, (id) => table(monde, TABLES.personnes)[id] as unknown as Personne | undefined);
    saison.leaderAvantDerniereManche = saison.pilotes[0]?.pilote ?? '';
    saison.titreOuvertDerniereManche = titreEncoreOuvert(saison);
  }

  // Classements.
  const lp = new Map(saison.pilotes.map((l) => [l.pilote, l]));
  const lc = new Map(saison.constructeurs.map((l) => [l.ecurie, l]));
  for (const r of resultats) {
    let l = lp.get(r.pilote);
    if (!l) {
      l = { pilote: r.pilote, ecurie: r.ecurie, points: 0, victoires: 0, podiums: 0, abandons: 0, meilleurResultat: null };
      saison.pilotes.push(l);
      lp.set(r.pilote, l);
    }
    l.ecurie = r.ecurie; // audit (1.10) : écurie du dernier Grand Prix couru (transfert en cours de saison)
    l.points += r.points;
    if (r.position !== null) { l.places ??= []; l.places[r.position - 1] = (l.places[r.position - 1] ?? 0) + 1; }
    if (r.position === 1) l.victoires++;
    if (r.position !== null && r.position <= 3) l.podiums++;
    if (r.abandon) l.abandons++;
    if (r.position !== null && (l.meilleurResultat === null || r.position < l.meilleurResultat)) l.meilleurResultat = r.position;
    const c = lc.get(r.ecurie);
    if (c) {
      c.points += r.points;
      if (r.position !== null) { c.places ??= []; c.places[r.position - 1] = (c.places[r.position - 1] ?? 0) + 1; }
      if (r.position === 1) c.victoires++;
    }
  }
  const p1 = resultats[0], p2 = resultats[1];
  if (p1?.position === 1 && p2?.position === 2 && p1.ecurie === p2.ecurie) {
    const c = lc.get(p1.ecurie);
    if (c) c.doubles++;
  }
  trierClassements(saison);
  saison.leaders.push(saison.pilotes[0]?.pilote ?? '');
  saison.ecartsTete.push((saison.pilotes[0]?.points ?? 0) - (saison.pilotes[1]?.points ?? 0));

  // Événements.
  const nom = (id: string) => {
    const p = table(monde, TABLES.personnes)[id] as unknown as Personne | undefined;
    return p ? `${p.prenom} ${p.nom}` : id;
  };
  const vainqueur = resultats[0];
  if (vainqueur?.position === 1) {
    const eq = ecuries.get(vainqueur.ecurie) as Ecurie;
    const doubl = p2?.position === 2 && p2.ecurie === vainqueur.ecurie;
    const victoire = ajouterEvenement(monde, {
      type: 'gp.victoire',
      acteurs: [{ id: vainqueur.pilote, role: 'vainqueur' }, { id: vainqueur.ecurie, role: 'ecurie' }],
      importance: 3,
      contexte: { gp: gp.id, circuit: circuit.id, pluie: gp.pluie, double: doubl },
      texte: `${nom(vainqueur.pilote)} (${eq.nom}) remporte le Grand Prix de ${circuit.nom}${gp.pluie ? ' sous la pluie' : ''}${doubl ? ', doublé de son écurie' : ''}.`,
    });
    if (vainqueur.retardVoiturePct >= SEUIL_SURPRISE_PCT) {
      ajouterEvenement(monde, {
        type: 'gp.victoire_surprise',
        acteurs: [{ id: vainqueur.pilote, role: 'vainqueur' }, { id: vainqueur.ecurie, role: 'ecurie' }],
        importance: 4,
        causes: [victoire.id],
        contexte: { gp: gp.id, rangVoiture: vainqueur.rangVoiture, retardVoiturePct: vainqueur.retardVoiturePct },
        texte: `Victoire surprise de ${nom(vainqueur.pilote)} (${eq.nom}) à ${circuit.nom}, avec la ${vainqueur.rangVoiture}e voiture du plateau sur ce circuit (${vainqueur.retardVoiturePct.toFixed(2)} % de retard).`,
      });
    }
  }
  for (const r of resultats.slice(1, 3)) {
    if (r.position) ajouterEvenement(monde, { type: 'gp.podium', acteurs: [{ id: r.pilote, role: 'pilote' }, { id: r.ecurie, role: 'ecurie' }], importance: 2, contexte: { gp: gp.id, position: r.position } });
  }
  for (const r of resultats.filter((x) => x.abandon)) {
    ajouterEvenement(monde, { type: 'gp.abandon', acteurs: [{ id: r.pilote, role: 'pilote' }, { id: r.ecurie, role: 'ecurie' }], importance: 1, contexte: { gp: gp.id, cause: r.abandon } });
  }
  return gp;
}

/**
 * Un rival peut-il encore être champion à la dernière manche ? Cas le plus favorable au rival :
 * il gagne (points du vainqueur, +1 victoire, +1 podium) et le leader ne marque rien.
 * Départage comme le classement : points, puis victoires, puis podiums ; égalité parfaite = encore ouvert.
 */
export function titreEncoreOuvert(s: Saison): boolean {
  const [leader, ...rivaux] = s.pilotes;
  if (!leader) return false;
  const maxPoints = s.bareme[0] ?? 0;
  return rivaux.some((r) => {
    const pts = r.points + maxPoints, v = r.victoires + 1, pod = r.podiums + 1;
    if (pts !== leader.points) return pts > leader.points;
    if (v !== leader.victoires) return v > leader.victoires;
    return pod >= leader.podiums;
  });
}

/**
 * Départage (D-061, audit 1.6 et 1.7) : points, victoires, puis le plus de 2es places, de 3es places, etc. (règle réelle du
 * championnat) ; l'identifiant ne tranche qu'une égalité parfaite sur toutes les places.
 */
function comparerPlaces(a?: number[], b?: number[]): number {
  const n = Math.max(a?.length ?? 0, b?.length ?? 0);
  for (let i = 1; i < n; i++) { const d = (b?.[i] ?? 0) - (a?.[i] ?? 0); if (d) return d; }
  return 0;
}
export function trierClassements(s: Saison): void {
  const cmp = (a: { points: number; victoires: number; places?: number[] }, b: { points: number; victoires: number; places?: number[] }) =>
    b.points - a.points || b.victoires - a.victoires || comparerPlaces(a.places, b.places);
  s.pilotes.sort((a, b) => cmp(a, b) || b.podiums - a.podiums || (a.pilote < b.pilote ? -1 : 1));
  s.constructeurs.sort((a, b) => cmp(a, b) || (a.ecurie < b.ecurie ? -1 : 1));
}

/* ---------------------------------------------------------------- Développement (provisoire) */

function moyenne(v: number[]): number {
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
}

/** Capacité de développement d'une écurie (≈ 0,3 à 1,1) : personnel technique, installations, budget. */
export function capaciteDeveloppement(monde: Monde, e: Ecurie): number {
  const equipe = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).filter((p) => p.ecurie === e.id && p.statut === 'actif');
  // La motivation du personnel technique module son efficacité (phase 4 : cascade « DT démotivé → développement plus lent »).
  // Phase 7b (D-127) : une personne en période de non-concurrence travaille déjà, mais à efficacité réduite.
  const enNonConcurrence = (x: Personne) => !!x.nonConcurrenceJusqua && (x.nonConcurrenceJusqua.annee > monde.date.annee
    || (x.nonConcurrenceJusqua.annee === monde.date.annee && x.nonConcurrenceJusqua.semaine >= monde.date.semaine));
  const c = (poste: string, comp: string) => {
    const p = equipe.find((x) => x.poste === poste);
    if (!p) return 10;
    const efficacite = enNonConcurrence(p) ? PERSONNEL_MARCHE.efficaciteNonConcurrence : 1;
    return (p.competences[comp] ?? 10) * (0.7 + 0.6 * (p.etat.motivation / 100)) * efficacite;
  };
  const competences = moyenne([
    c('directeur_technique', 'visionTechnique'), c('directeur_technique', 'gestionProjet'),
    c('responsable_aero', 'aerodynamique'), c('responsable_conception', 'conception'),
  ]) / 20;
  const inst = (Object.values(table(monde, TABLES.installations)) as unknown as Installation[])
    .filter((i) => i.ecurie === e.id && ['soufflerie', 'cfd', 'simulateur', 'bureau_etudes'].includes(i.type));
  // Phase 5b : niveau effectif (usure due à l'âge et à l'entretien).
  const installations = moyenne(inst.map((i) => niveauEffectif(i))) / 10;
  // Phase 5a : le budget de développement réellement alloué (finances) remplace le budget indicatif de l'écurie.
  const budget = financesDe(monde, e.id) ? facteurBudgetDeveloppement(monde, e.id) : borner(e.budgetMEUR / BUDGET_REFERENCE_MEUR, FACTEUR_BUDGET.min, FACTEUR_BUDGET.max);
  // D-140 : usure du succès des cadres techniques en place (équilibrage volontaire, décidé par le porteur).
  const cadres = equipe.filter((x) => x.poste === 'directeur_technique' || x.poste === 'responsable_aero' || x.poste === 'responsable_conception');
  const usure = cadres.length ? cadres.reduce((a, x) => a + usureSucces(monde, x).usure, 0) / cadres.length : 0;
  return (POIDS_CAPACITE.competences * competences + POIDS_CAPACITE.installations * installations + POIDS_CAPACITE.budget * budget) * (1 - USURE_SUCCES.effetDeveloppement * usure);
}

/**
 * Phase 12a : la vitesse vient des pièces (systems/monoplaces) ; seules la fiabilité et la gestion des pneus, que le profil de vitesse ne
 * couvre pas encore, gardent ce développement abstrait (jusqu'aux phases 12c et 13).
 */
const CARACS_VOITURE = ['fiabilite', 'gestionPneus'] as const;

function developper(monde: Monde, e: Ecurie, mois: number, alea: number, cle: string): void {
  const v = voitureDe(monde, e.id);
  const cap = capaciteDeveloppement(monde, e);
  // Phase 8b : la part des moyens consacrée aux programmes de recherche est retirée du développement de la voiture ;
  // en échange, le savoir accumulé rend ce développement plus efficace (effet PROVISOIRE, systems/technique/conception.ts).
  const partDeveloppement = 1 - partRecherche(monde, e.id);
  for (const c of CARACS_VOITURE) {
    const f = tirageLocal(monde, 'developpement', e.id, cle, c);
    const gain = TAUX_DEVELOPPEMENT_MENSUEL * mois * cap * partDeveloppement * bonusSavoirDeveloppement(monde, e.id, c)
      * Math.max(0, 1 - v[c] / PLAFOND_TECHNIQUE);
    v[c] = borner(v[c] + gain + f.normale(0, alea), BORNES_CARACTERISTIQUE.min, BORNES_CARACTERISTIQUE.max);
  }
}

/* ---------------------------------------------------------------- Fin de saison */

export function terminerSaison(monde: Monde, annee: number): void {
  const s = saisonDe(monde, annee);
  if (!s || s.termine) return;
  trierClassements(s);
  const ecuries = new Map(ecuriesActives(monde).map((e) => [e.id, e]));
  s.indiceFin = Object.fromEntries([...ecuries.values()].map((e) => [e.id, indiceMoyen(monde, e)]));

  // Primes de fin de saison (renormalisées au nombre d'écuries).
  const parts = PARTS_PRIMES.slice(0, s.constructeurs.length);
  while (parts.length < s.constructeurs.length) parts.push(PARTS_PRIMES.at(-1) ?? 5);
  const total = parts.reduce((a, b) => a + b, 0);
  s.constructeurs.forEach((c, i) => (c.primesMEUR = Math.round(((ENVELOPPE_PRIMES_MEUR * (parts[i] ?? 0)) / total) * 10) / 10));

  const nomP = (id: string) => {
    const p = table(monde, TABLES.personnes)[id] as unknown as Personne | undefined;
    return p ? `${p.prenom} ${p.nom}` : id;
  };
  const champion = s.pilotes[0];
  const championC = s.constructeurs[0];
  if (champion && championC && champion.points > 0) {
    // Audit (1.10) : une écurie devenue inactive en cours de saison ne fait pas planter la fin de saison.
    const eqP = ecuries.get(champion.ecurie) ?? (table(monde, TABLES.ecuries)[champion.ecurie] as unknown as Ecurie);
    const eqC = ecuries.get(championC.ecurie) ?? (table(monde, TABLES.ecuries)[championC.ecurie] as unknown as Ecurie);
    eqP.titresPilotes++;
    // D-108 : le champion s'attache souvent au circuit de son sacre (dernière manche).
    const derniere = s.calendrier.length ? grandPrix(monde, s.calendrier[s.calendrier.length - 1]!) : undefined;
    const circuitSacre = derniere ? (table(monde, TABLES.circuits)[derniere.circuit] as unknown as Circuit | undefined) : undefined;
    const pChampion = table(monde, TABLES.personnes)[champion.pilote] as unknown as Personne | undefined;
    if (circuitSacre && pChampion) titreSurCircuit(monde, pChampion, circuitSacre, annee);
    eqC.titresConstructeurs++;
    const pal: Palmares = { id: `pal_${annee}`, saison: annee, championPilote: champion.pilote, ecurieChampionPilote: champion.ecurie, championConstructeurs: championC.ecurie, note: 'simulé' };
    table(monde, TABLES.palmares)[pal.id] = pal as unknown as Entite;
    ajouterEvenement(monde, {
      type: 'titre.pilotes', acteurs: [{ id: champion.pilote, role: 'champion' }, { id: champion.ecurie, role: 'ecurie' }], importance: 5,
      contexte: { saison: annee, points: champion.points, ecart: champion.points - (s.pilotes[1]?.points ?? 0) },
      texte: `${nomP(champion.pilote)} (${eqP.nom}) champion ${annee}.`,
    });
    ajouterEvenement(monde, {
      type: 'titre.constructeurs', acteurs: [{ id: championC.ecurie, role: 'champion' }], importance: 5,
      contexte: { saison: annee, points: championC.points },
      texte: `${eqC.nom} championne des constructeurs ${annee}.`,
    });
  }
  s.chronique = genererChronique(monde, s);
  s.termine = true;

  // (Phase 4 : la prolongation automatique provisoire des contrats est remplacée par les négociations, voir systems/humain.)

  // Les explications détaillées des vieux Grands Prix sont retirées (taille des sauvegardes).
  const ancienne = saisonDe(monde, annee - CONSERVATION_EXPLICATIONS_SAISONS);
  if (ancienne) for (const idGp of ancienne.calendrier) for (const r of grandPrix(monde, idGp).resultats) delete r.explication;
}

/* ---------------------------------------------------------------- Systèmes */

export const systemeIntersaison: Systeme = {
  nom: 'saison.intersaison',
  phases: ['intersaison'],
  executer({ monde, date }) {
    if (date.semaine !== 1 || saisonDe(monde, date.annee)) return;
    // Nouvelle voiture (sauf la toute première saison : les données décrivent déjà la voiture de départ).
    const premiere = Object.keys(table(monde, TABLES.saisons)).length === 0;
    if (!premiere) {
      for (const e of ecuriesActives(monde)) developper(monde, e, MOIS_EQUIVALENTS_INTERSAISON, ALEA_INTERSAISON, `intersaison-${date.annee}`);
      for (const id of idsTries(table(monde, TABLES.motoristes))) {
        const m = table(monde, TABLES.motoristes)[id] as unknown as Motoriste;
        const f = tirageLocal(monde, 'motoriste', id, date.annee);
        m.niveau = borner(m.niveau + MOTORISTE_PROGRESSION_ANNUELLE * Math.max(0, 1 - m.niveau / PLAFOND_TECHNIQUE) + f.normale(0, MOTORISTE_ALEA_ANNUEL), BORNES_CARACTERISTIQUE.min, BORNES_CARACTERISTIQUE.max);
      }
    }
    creerSaison(monde, date.annee);
  },
};

export const systemeGrandsPrix: Systeme = {
  nom: 'saison.grandsPrix',
  phases: ['saison'],
  executer({ monde, rendezVous }) {
    for (const r of rendezVous) if (r.type === 'gp') simulerGrandPrix(monde, r.donnees['gp'] as string);
  },
};

export const systemeDeveloppement: Systeme = {
  nom: 'saison.developpement',
  phases: ['saison'],
  executer({ monde, date }) {
    if ((date.semaine - PHASES_SAISON.saison.debut) % 4 !== 3) return;
    for (const e of ecuriesActives(monde)) developper(monde, e, 1, ALEA_DEVELOPPEMENT_MENSUEL, `${date.annee}-${date.semaine}`);
  },
};

export const systemeFinDeSaison: Systeme = {
  nom: 'saison.finDeSaison',
  phases: ['finDeSaison'],
  executer({ monde, date }) {
    if (date.semaine === SEMAINE_FIN_DE_SAISON) terminerSaison(monde, date.annee);
  },
};

export function installerSaison(moteur: Moteur): Moteur {
  return moteur.ajouterSysteme(systemeIntersaison).ajouterSysteme(systemeGrandsPrix).ajouterSysteme(systemeDeveloppement).ajouterSysteme(systemeFinDeSaison);
}

export { CARACTERISTIQUES_VITESSE, SEMAINES_PAR_AN };
export type { LigneClassementConstructeur, LigneClassementPilote, Voiture };
