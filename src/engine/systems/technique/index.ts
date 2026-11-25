/**
 * Phases 8a et 8b — règlements et recherche (docs/systemes/phase-8-conception-detaillee.md §2 à §7 ; D-128, D-132).
 *
 * 8a — Règlements :
 * - un règlement en vigueur, de durée prévue 4 à 6 saisons ; 2 saisons avant sa fin, la fédération propose 2 ou 3 réformes
 *   (aéro, motorisation, châssis, refonte) décrites par leur intensité de changement par domaine, et la prolongation ;
 * - vote à mi-saison (une voix par écurie ; la fédération tranche les égalités), annonce, entrée en vigueur après environ
 *   deux saisons complètes de préparation ;
 * - évolutions mineures annuelles décidées par la fédération seule (1 ou 2 domaines, faible intensité).
 * 8b — Recherche :
 * - savoir par écurie et par domaine : fondamental, et propre à chaque règlement (en vigueur, annoncé, proposé) ;
 * - deux programmes de recherche (domaine, horizon « actuelle », « suivante » ou un règlement futur, part des moyens), suspension
 *   sans perte, réorientation avec remise en route ; rendements décroissants, voisinages, obsolescence aux réformes, découvertes rares ;
 * - mêmes commandes et mêmes règles pour le joueur et l'IA ; délégation au directeur technique.
 * La conversion du savoir en performance est PROVISOIRE et isolée dans `conception.ts` (remplacée par la phase 12).
 */

import { causesConnues } from '../humain/causes';
import {
  CALENDRIER_REGLEMENT, CHOIX_DOMAINE_IA, DECOUVERTES, DECOUVERTES_FACTEURS, DOMAINES, FACTEURS_RECHERCHE, EVOLUTIONS_MINEURES, CONCEPTION_PROVISOIRE, HISTORIQUE_RECHERCHE, IA_RECHERCHE, LISTE_DOMAINES, ORIENTATIONS, PNEUS_REFORME, PROGRAMMES, SAVOIR, VOTE_IA,
  type Domaine, type Orientation,
} from '../../balance/technique';
import { FUITES_REGLEMENT } from '../../balance/information';
import { ALLIANCES, INFLUENCE } from '../../balance/politique';
import { allies, poidsOrientation } from '../politique/acces';
import type { DefinitionCommande } from '../../core/commandes';
import { ajouterEvenement } from '../../core/evenements';
import { idsTries, table, type Entite, type Monde } from '../../core/monde';
import { tirageLocal, type Moteur, type Systeme } from '../../core/moteur';
import {
  TABLES, type Decouverte, type Ecurie, type EvolutionMineure, type HistoriqueRecherche, type Installation, type Personne, type ProgrammeRecherche, type Reglement, type Savoir,
} from '../../model/types';
import { ecuriesActives } from '../saison/performance';
import { capaciteDeveloppement } from '../saison';
import { niveauEffectif } from '../economie/infrastructures';
import { forceEcurie, teamPrincipal } from '../humain/decision';
import { avantProjets, intensitePercue, programmes, propositions, reglementAnnonce, reglementConnu, reglementEnVigueur, reglements, savoir, savoirApplicable } from './acces';
import { fixerArchitectures, intersaison, reconcevoir } from '../monoplaces/conception';
import { facteurRechercheSoufflerie } from '../monoplaces/soufflerie';
import { DOMAINES_SOUFFLERIE } from '../../balance/monoplaces';
import { DATE_DEPART } from '../../balance/monde';
import { domainePoste, iaDecide } from '../joueur/acces';

const r3 = (x: number) => Math.round(x * 1000) / 1000;
const liste = <T>(m: Monde, t: string) => idsTries(table(m, t)).map((id) => table(m, t)[id] as unknown as T);

export { avantProjets, intensitePercue, partRecherche, programmes, propositions, reglementAnnonce, reglementConnu, reglementEnVigueur, reglements, savoir, savoirApplicable } from './acces';

/* ===================================================================== 8a — Règlements */

function tirerIntensites(monde: Monde, orientation: Orientation, cle: string): Record<string, number> {
  const o = ORIENTATIONS[orientation];
  const f = tirageLocal(monde, 'reglement.intensites', cle);
  const res: Record<string, number> = {};
  for (const d of LISTE_DOMAINES) {
    const vise = (o.domaines as readonly string[]).includes(d);
    res[d] = r3(vise ? o.min + (o.max - o.min) * f.suivant() : o.autres[0] + (o.autres[1] - o.autres[0]) * f.suivant());
  }
  return res;
}

/** Règlement de départ (en vigueur depuis la saison précédant la partie), créé à la première exécution. */
export function initialiserReglement(monde: Monde): void {
  if (reglements(monde).length) return;
  const f = tirageLocal(monde, 'reglement.initial');
  const debut = monde.date.annee - 1;
  const r: Reglement = {
    id: 'reg_1', generation: 1, orientation: 'initial', debut, fin: debut + f.entier(CALENDRIER_REGLEMENT.dureeMin, CALENDRIER_REGLEMENT.dureeMax) - 1,
    statut: 'en_vigueur', intensites: Object.fromEntries(LISTE_DOMAINES.map((d) => [d, 0])), pneus: 1,
  };
  table(monde, TABLES.reglements)[r.id] = r as unknown as Entite;
}

/** Propositions de la fédération : 2 ou 3 réformes d'orientations différentes, plus la prolongation. */
/**
 * Préparation des réformes par la fédération (phase 8c : en avant-projet, connues seulement des écuries qui en ont vent),
 * publiées ensuite par `publierReformes`.
 */
export function preparerReformes(monde: Monde): void {
  const actuel = reglementEnVigueur(monde);
  if (!actuel || propositions(monde).length || avantProjets(monde).length || reglementAnnonce(monde)) return;
  const f = tirageLocal(monde, 'reglement.propositions', actuel.id, monde.date.annee);
  const n = f.entier(CALENDRIER_REGLEMENT.propositionsMin, CALENDRIER_REGLEMENT.propositionsMax);
  const orientations = [...(Object.keys(ORIENTATIONS) as Orientation[])];
  const choisies: Orientation[] = [];
  // Phase 8d-4 : tirage pondéré par l'orientation préférée du président de la fédération et le lobbying des écuries (1 par défaut).
  while (choisies.length < n && orientations.length) {
    const poids = orientations.map((o) => poidsOrientation(monde, o, INFLUENCE.bonusPresident));
    let x = f.suivant() * poids.reduce((a, b) => a + b, 0);
    let k = 0;
    while (k < orientations.length - 1 && (x -= poids[k]!) > 0) k++;
    choisies.push(orientations.splice(k, 1)[0]!);
  }
  const generation = Math.max(...reglements(monde).map((r) => r.generation)) + 1;
  const prolongation = f.entier(1, CALENDRIER_REGLEMENT.prolongationMax);
  choisies.forEach((o, i) => {
    const debut = actuel.fin + 1;
    const id = `reg_${generation}_${i + 1}`;
    const intensites = tirerIntensites(monde, o, id);
    // Les pneumatiques peuvent accompagner une réforme : le domaine « interface pneus » change alors aussi.
    const pneus = f.chance(CALENDRIER_REGLEMENT.pneusAvecReforme) ? actuel.pneus + 1 : actuel.pneus;
    if (pneus !== actuel.pneus) intensites['interface_pneus'] = Math.max(intensites['interface_pneus'] ?? 0, PNEUS_REFORME.intensiteInterface);
    const r: Reglement = {
      id, generation, orientation: o, debut, fin: debut + f.entier(CALENDRIER_REGLEMENT.dureeMin, CALENDRIER_REGLEMENT.dureeMax) - 1,
      statut: 'brouillon', intensites, pneus, votes: {}, prolongation, connuPar: [],
      // Jalon A : le lobbying de l'année a pesé sur ces propositions (chaîne de causes).
      causes: { lobbying: Object.values(monde.evenements).filter((x) => x.type === 'politique.lobbying' && x.date.annee === monde.date.annee).map((x) => x.id).sort() },
    };
    table(monde, TABLES.reglements)[r.id] = r as unknown as Entite;
  });
}

/** Publication des propositions (2 ou 3 réformes et la prolongation) : tout le monde connaît désormais les intensités exactes. */
export function publierReformes(monde: Monde): void {
  const actuel = reglementEnVigueur(monde);
  const projets = avantProjets(monde);
  if (!actuel || !projets.length) return;
  for (const r of projets) r.statut = 'propose';
  const n = projets.length;
  const prolongation = projets[0]!.prolongation ?? 1;
  const choisies = projets.map((r) => r.orientation as Orientation);
  const evtPropositions = ajouterEvenement(monde, {
    type: 'reglement.propositions', acteurs: [], importance: 3, visibilite: 'public', causes: causesConnues(monde, ...projets.flatMap((r) => r.causes?.lobbying ?? [])),
    contexte: { propositions: propositions(monde).map((r) => ({ id: r.id, orientation: r.orientation, debut: r.debut })), prolongation },
    texte: `La fédération propose ${n} réformes pour ${actuel.fin + 1} (${choisies.map((o) => ORIENTATIONS[o].libelle.toLowerCase()).join(', ')}), ou la prolongation du règlement actuel de ${prolongation} saison${prolongation > 1 ? 's' : ''}.`,
  });
  for (const r of projets) r.causes = { ...r.causes, propositions: evtPropositions.id };
}

/** Intérêt calculé d'une écurie pour une option (IA ; même information que le joueur). */
export function interetOption(monde: Monde, e: Ecurie, option: Reglement | 'prolongation'): number {
  const force = forceEcurie(monde, e.id);
  if (option === 'prolongation') {
    const actuel = reglementEnVigueur(monde);
    const age = actuel ? monde.date.annee - actuel.debut + 1 : 0;
    return VOTE_IA.poidsStatuQuo * (force - 0.5) - VOTE_IA.usureParSaison * Math.max(0, age - CALENDRIER_REGLEMENT.dureeMin);
  }
  const actives = ecuriesActives(monde);
  let avance = 0;
  for (const d of LISTE_DOMAINES) {
    const i = option.intensites[d] ?? 0;
    if (i <= 0) continue;
    const moi = savoirApplicable(monde, e.id, d, option.id);
    const moyenne = actives.reduce((a, x) => a + savoirApplicable(monde, x.id, d, option.id), 0) / Math.max(1, actives.length);
    avance += (i * (moi - moyenne)) / VOTE_IA.echelleAvance;
  }
  return avance;
}

/** Choix d'une écurie de l'IA : la réforme qu'elle préfère, et si elle la préfère à la prolongation. */
function choixIA(monde: Monde, e: Ecurie, props: Reglement[]): { reforme: string; changer: boolean } {
  const f = tirageLocal(monde, 'reglement.vote', e.id, monde.date.annee);
  // Phase 8d-4 : une écurie tient compte de l'intérêt de ses alliés (jamais un vote imposé).
  const ids = allies(monde, e.id);
  const autres = ids.map((id) => table(monde, TABLES.ecuries)[id] as unknown as Ecurie).filter((x) => x?.statut === 'active');
  const interet = (o: Reglement | 'prolongation') => interetOption(monde, e, o) + (autres.length ? ALLIANCES.poidsAllies * autres.reduce((a, x) => a + interetOption(monde, x, o), 0) / autres.length : 0);
  const notes = props.map((r) => ({ id: r.id, u: interet(r) + f.normale(0, VOTE_IA.aleaVote) })).sort((a, b) => b.u - a.u || (a.id < b.id ? -1 : 1));
  const prolonger = interet('prolongation') + f.normale(0, VOTE_IA.aleaVote);
  return { reforme: notes[0]!.id, changer: notes[0]!.u > prolonger };
}

/** Décompte d'un tour : la fédération tranche les égalités (tirage local). */
function gagnantTour(monde: Monde, voix: Map<string, number>, tour: number): { gagnant: string; egalite: boolean } {
  const max = Math.max(...voix.values());
  const ex = [...voix.entries()].filter(([, v]) => v === max).map(([k]) => k).sort();
  return { gagnant: ex[tirageLocal(monde, 'reglement.egalite', monde.date.annee, tour).entier(0, ex.length - 1)]!, egalite: ex.length > 1 };
}

/**
 * Vote en deux tours, une voix par écurie. Le joueur vote par la commande « reglement.vote » (une réforme : il est pour le changement
 * et pour celle-ci ; « prolongation » : contre le changement) ; sans vote ni délégation, son écurie s'abstient.
 */
export function voterReforme(monde: Monde): void {
  const props = propositions(monde);
  const actuel = reglementEnVigueur(monde);
  if (!props.length || !actuel) return;
  const tour1 = new Map<string, number>([['reforme', 0], ['prolongation', 0]]);
  const tour2 = new Map<string, number>(props.map((r) => [r.id, 0]));
  const bulletins: Record<string, string> = {};
  for (const e of ecuriesActives(monde)) {
    const vote = props[0]!.votes?.[e.id];
    let reforme: string | undefined, changer: boolean;
    if (vote) {
      changer = vote !== 'prolongation';
      reforme = changer ? vote : undefined;
    } else if (!iaDecide(e, 'politique')) {
      continue;
    } else {
      const c = choixIA(monde, e, props);
      changer = c.changer;
      reforme = c.reforme;
    }
    tour1.set(changer ? 'reforme' : 'prolongation', tour1.get(changer ? 'reforme' : 'prolongation')! + 1);
    if (reforme) tour2.set(reforme, tour2.get(reforme)! + 1);
    bulletins[e.id] = changer ? reforme! : 'prolongation';
  }
  for (const r of props) r.votes = { ...bulletins };
  const t1 = gagnantTour(monde, tour1, 1);
  if (t1.gagnant === 'prolongation') {
    const n = props[0]!.prolongation ?? 1;
    actuel.fin += n;
    for (const r of props) rejeter(monde, r);
    ajouterEvenement(monde, {
      type: 'reglement.vote', acteurs: [], importance: 3, visibilite: 'public', contexte: { gagnant: 'prolongation', tour1: Object.fromEntries(tour1), egalite: t1.egalite, bulletins },
      texte: `Les écuries votent la prolongation du règlement actuel jusqu'en ${actuel.fin} (${tour1.get('prolongation')} voix contre ${tour1.get('reforme')}).`,
    });
    return;
  }
  // Second tour : chaque écurie vote pour la réforme qu'elle préfère (le joueur, pour celle qu'il a choisie).
  const t2 = gagnantTour(monde, tour2, 2);
  for (const r of props) {
    if (r.id === t2.gagnant) r.statut = 'annonce';
    else rejeter(monde, r);
  }
  const adopte = table(monde, TABLES.reglements)[t2.gagnant] as unknown as Reglement;
  const evtAnnonce = ajouterEvenement(monde, {
    type: 'reglement.annonce', acteurs: [], importance: 4, visibilite: 'public', causes: causesConnues(monde, adopte.causes?.propositions),
    contexte: { reglement: t2.gagnant, orientation: adopte.orientation, debut: adopte.debut, tour1: Object.fromEntries(tour1), tour2: Object.fromEntries(tour2), egalite: t1.egalite || t2.egalite, bulletins },
    texte: `Nouveau règlement adopté (${ORIENTATIONS[adopte.orientation as Orientation]?.libelle ?? adopte.orientation}, ${tour1.get('reforme')} voix pour un changement contre ${tour1.get('prolongation')}) : il entrera en vigueur en ${adopte.debut}.`,
  });
  adopte.causes = { ...adopte.causes, annonce: evtAnnonce.id };
}

/** Une proposition rejetée : seule la part fondamentale du savoir accumulé pour elle reste utile (D-132, question 5). */
export function rejeter(monde: Monde, r: Reglement): void {
  r.statut = 'rejete';
  for (const s of Object.values(table(monde, TABLES.savoirs)) as unknown as Savoir[]) {
    const v = s.parReglement[r.id];
    if (v === undefined) continue;
    s.fondamental = r3(s.fondamental + v * SAVOIR.partFondamentalRejet);
    delete s.parReglement[r.id];
  }
  // Les programmes qui visaient cette proposition sont suspendus (aucun savoir n'est perdu au-delà de la règle ci-dessus).
  for (const p of programmes(monde)) if (p.horizon === r.id) p.statut = 'suspendu';
}

/** Entrée en vigueur d'un règlement annoncé : obsolescence partielle du savoir, reconception (provisoire) des voitures. */
export function entreeEnVigueur(monde: Monde): boolean {
  const nouveau = reglementAnnonce(monde);
  const ancien = reglementEnVigueur(monde);
  if (!nouveau || !ancien || nouveau.debut !== monde.date.annee) return false;
  ancien.statut = 'termine';
  nouveau.statut = 'en_vigueur';
  for (const s of Object.values(table(monde, TABLES.savoirs)) as unknown as Savoir[]) {
    const i = nouveau.intensites[s.domaine] ?? 0;
    const garde = (s.parReglement[ancien.id] ?? 0) * (1 - i);
    s.parReglement[nouveau.id] = r3((s.parReglement[nouveau.id] ?? 0) + garde);
    // Le savoir préparé « pour la saison suivante » visait l'ancien règlement : même obsolescence.
    noterObsolescence(monde, s, ((s.parReglement[ancien.id] ?? 0) + s.pourSaisonSuivante) * i);
    s.pourSaisonSuivante = r3(s.pourSaisonSuivante * (1 - i));
    delete s.parReglement[ancien.id];
  }
  // Phase 12a : pari de concept (architecture choisie, sinon recommandée par le DT), puis reconception absolue des pièces.
  fixerArchitectures(monde, ecuriesActives(monde), nouveau);
  reconcevoir(monde, ecuriesActives(monde), nouveau.intensites, nouveau, `reglement-${nouveau.id}`);
  for (const p of programmes(monde)) if (p.horizon === nouveau.id) p.horizon = 'actuelle';
  ajouterEvenement(monde, {
    type: 'reglement.entree_en_vigueur', acteurs: [], importance: 4, visibilite: 'public', causes: causesConnues(monde, nouveau.causes?.annonce), contexte: { reglement: nouveau.id, orientation: nouveau.orientation, pneus: nouveau.pneus },
    texte: `Le nouveau règlement (${ORIENTATIONS[nouveau.orientation as Orientation]?.libelle ?? nouveau.orientation}) entre en vigueur : les voitures sont reconçues.`,
  });
  return true;
}

/** Évolution mineure de la saison suivante (fédération seule), sauf si une réforme entre en vigueur. */
export function deciderEvolutionMineure(monde: Monde): void {
  const suivante = monde.date.annee + 1;
  if (reglementAnnonce(monde)?.debut === suivante) return;
  const f = tirageLocal(monde, 'reglement.mineure', suivante);
  if (!f.chance(EVOLUTIONS_MINEURES.probabilite)) return;
  const n = f.entier(EVOLUTIONS_MINEURES.domainesMin, EVOLUTIONS_MINEURES.domainesMax);
  const domaines = [...LISTE_DOMAINES];
  const intensites: Record<string, number> = {};
  for (let k = 0; k < n; k++) intensites[domaines.splice(f.entier(0, domaines.length - 1), 1)[0]!] = r3(EVOLUTIONS_MINEURES.intensiteMin + (EVOLUTIONS_MINEURES.intensiteMax - EVOLUTIONS_MINEURES.intensiteMin) * f.suivant());
  const ev: EvolutionMineure = { id: `evm_${suivante}`, saison: suivante, intensites, appliquee: false };
  table(monde, TABLES.evolutionsMineures)[ev.id] = ev as unknown as Entite;
  ajouterEvenement(monde, {
    type: 'reglement.evolution_mineure', acteurs: [], importance: 2, visibilite: 'public', contexte: { saison: suivante, intensites },
    texte: `Évolution du règlement pour ${suivante} : ${Object.keys(intensites).map((d) => DOMAINES[d as Domaine].libelle.toLowerCase()).join(', ')}.`,
  });
  // Volume borné.
  const t = table(monde, TABLES.evolutionsMineures);
  const ids = idsTries(t);
  for (const id of ids.slice(0, Math.max(0, ids.length - EVOLUTIONS_MINEURES.conservees))) delete t[id];
}

/** Application d'une évolution mineure en début de saison : petite obsolescence, adaptation des voitures. */
export function appliquerEvolutionMineure(monde: Monde): void {
  const ev = table(monde, TABLES.evolutionsMineures)[`evm_${monde.date.annee}`] as unknown as EvolutionMineure | undefined;
  const actuel = reglementEnVigueur(monde);
  if (!ev || ev.appliquee || !actuel) return;
  ev.appliquee = true;
  for (const s of Object.values(table(monde, TABLES.savoirs)) as unknown as Savoir[]) {
    const i = ev.intensites[s.domaine] ?? 0;
    if (!i) continue;
    const perte = (s.parReglement[actuel.id] ?? 0) * i;
    s.parReglement[actuel.id] = r3((s.parReglement[actuel.id] ?? 0) - perte);
    noterObsolescence(monde, s, perte);
  }
  reconcevoir(monde, ecuriesActives(monde), ev.intensites, actuel, `mineure-${ev.id}`);
}

/* ===================================================================== 8b — Recherche */

function historique(monde: Monde, idEcurie: string): HistoriqueRecherche {
  const t = table(monde, TABLES.historiqueRecherche);
  const id = `${idEcurie}|${monde.date.annee}`;
  if (!t[id]) t[id] = { id, ecurie: idEcurie, annee: monde.date.annee, domaines: {} } satisfies HistoriqueRecherche as unknown as Entite;
  return t[id] as unknown as HistoriqueRecherche;
}

function noterObsolescence(monde: Monde, s: Savoir, perte: number): void {
  if (perte <= 0) return;
  const h = historique(monde, s.ecurie);
  const d = (h.domaines[s.domaine] ??= { effort: 0, gain: 0, obsolescence: 0 });
  d.obsolescence = r3(d.obsolescence + perte);
}

/** Facteur de compétence du personnel pour un domaine (moyenne des compétences utiles chez le DT et les responsables, rapportée à la référence). */
function facteurCompetence(monde: Monde, idEcurie: string, domaine: Domaine): number {
  const equipe = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).filter((p) => p.statut === 'actif' && p.ecurie === idEcurie
    && ['directeur_technique', 'responsable_aero', 'responsable_conception'].includes(p.poste));
  const valeurs: number[] = [];
  for (const c of DOMAINES[domaine].competences) for (const p of equipe) if (p.competences[c] !== undefined) valeurs.push(p.competences[c]!);
  return valeurs.length ? valeurs.reduce((a, b) => a + b, 0) / valeurs.length / FACTEURS_RECHERCHE.competenceReference : FACTEURS_RECHERCHE.defaut;
}

/** Facteur des installations utiles au domaine (niveau effectif moyen rapporté à la référence). */
function facteurInstallations(monde: Monde, idEcurie: string, domaine: Domaine): number {
  const inst = (Object.values(table(monde, TABLES.installations)) as unknown as Installation[]).filter((i) => i.ecurie === idEcurie && (DOMAINES[domaine].installations as readonly string[]).includes(i.type));
  return inst.length ? inst.reduce((a, i) => a + niveauEffectif(i), 0) / inst.length / FACTEURS_RECHERCHE.installationReference : FACTEURS_RECHERCHE.defaut;
}

/** Progression des programmes (toutes les 4 semaines) : savoir gagné, voisinages, historique, découvertes. */
export function avancerRecherche(monde: Monde): void {
  const actuel = reglementEnVigueur(monde);
  for (const e of ecuriesActives(monde)) {
    const cap = capaciteDeveloppement(monde, e);
    // Phase 12b : les heures de soufflerie réservées à la recherche (barème selon le classement) dopent les programmes aéro.
    const aeroActifs = programmes(monde, e.id).filter((p) => p.statut === 'actif' && (DOMAINES_SOUFFLERIE as readonly string[]).includes(p.domaine));
    const partAero = aeroActifs.reduce((a, p) => a + p.part, 0);
    const heures = e.heuresRecherche ?? 0;
    e.heuresRecherche = 0;
    for (const p of programmes(monde, e.id)) {
      if (p.statut !== 'actif') continue;
      const d = p.domaine as Domaine;
      const s = savoir(monde, e.id, d);
      const cibleReglement = p.horizon === 'actuelle' ? actuel?.id : p.horizon === 'suivante' ? undefined : p.horizon;
      const deja = s.fondamental + (cibleReglement ? s.parReglement[cibleReglement] ?? 0 : s.pourSaisonSuivante);
      const efficacite = p.remiseEnRoute > 0 ? SAVOIR.efficaciteRemiseEnRoute : 1;
      p.remiseEnRoute = Math.max(0, p.remiseEnRoute - PROGRAMMES.periodeSemaines);
      const soufflerie = (DOMAINES_SOUFFLERIE as readonly string[]).includes(d) ? facteurRechercheSoufflerie(partAero > 0 ? (heures * p.part) / partAero : 0) : 1;
      const gain = SAVOIR.gainBase * (p.part / IA_RECHERCHE.partDefaut) * cap * facteurCompetence(monde, e.id, d) * facteurInstallations(monde, e.id, d)
        * efficacite * soufflerie / (1 + deja / SAVOIR.rendementK);
      s.fondamental = r3(s.fondamental + gain * SAVOIR.partFondamental);
      const specifique = gain * (1 - SAVOIR.partFondamental);
      if (p.horizon === 'suivante') s.pourSaisonSuivante = r3(s.pourSaisonSuivante + specifique);
      else if (cibleReglement) s.parReglement[cibleReglement] = r3((s.parReglement[cibleReglement] ?? 0) + specifique);
      for (const v of DOMAINES[d].voisins) {
        const sv = savoir(monde, e.id, v);
        sv.fondamental = r3(sv.fondamental + (gain * SAVOIR.partVoisins) / DOMAINES[d].voisins.length);
      }
      const h = historique(monde, e.id);
      const hd = (h.domaines[d] ??= { effort: 0, gain: 0, obsolescence: 0 });
      hd.effort = r3(hd.effort + p.part);
      hd.gain = r3(hd.gain + gain);
      // Découverte possible pour une recherche orientée vers un règlement futur.
      if (cibleReglement && cibleReglement !== actuel?.id) tenterDecouverte(monde, e, d, cibleReglement, s);
    }
  }
}

function tenterDecouverte(monde: Monde, e: Ecurie, d: Domaine, idReglement: string, s: Savoir): void {
  const dt = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).find((p) => p.statut === 'actif' && p.ecurie === e.id && p.poste === 'directeur_technique');
  const proba = DECOUVERTES.base * Math.min(DECOUVERTES_FACTEURS.plafondSavoir, s.fondamental / CONCEPTION_PROVISOIRE.echelle)
    * ((dt?.competences['visionTechnique'] ?? DECOUVERTES_FACTEURS.visionSansDT) / DECOUVERTES_FACTEURS.visionReference);
  if (!tirageLocal(monde, 'recherche.decouverte', e.id, d, monde.date.annee, monde.date.semaine).chance(proba)) return;
  s.parReglement[idReglement] = r3((s.parReglement[idReglement] ?? 0) + DECOUVERTES.ampleur);
  const dec: Decouverte = { id: `dec_${e.id}_${d}_${monde.date.annee}_${monde.date.semaine}`, ecurie: e.id, domaine: d, reglement: idReglement, saison: monde.date.annee, ampleur: DECOUVERTES.ampleur, diffusee: 0 };
  table(monde, TABLES.decouvertes)[dec.id] = dec as unknown as Entite;
  ajouterEvenement(monde, {
    type: 'recherche.decouverte', acteurs: [{ id: e.id, role: 'ecurie' }, ...(dt ? [{ id: dt.id, role: 'auteur' }] : [])], importance: 3, visibilite: 'prive',
    contexte: { domaine: d, reglement: idReglement, savoirFondamental: r3(s.fondamental), visionDT: dt?.competences['visionTechnique'] ?? null },
    texte: `${e.nom} fait une découverte en ${DOMAINES[d].libelle.toLowerCase()} pour le futur règlement : un savoir fondamental solide et une vision technique affûtée.`,
  });
}

/** Chaque saison : les autres écuries copient progressivement les découvertes appliquées sous le règlement en vigueur. */
function diffuserDecouvertes(monde: Monde): void {
  const actuel = reglementEnVigueur(monde);
  const t = table(monde, TABLES.decouvertes);
  for (const d of liste<Decouverte>(monde, TABLES.decouvertes)) {
    if (d.reglement !== actuel?.id || d.diffusee >= 1) continue;
    const part = Math.min(DECOUVERTES.diffusionParSaison, 1 - d.diffusee);
    for (const e of ecuriesActives(monde)) {
      if (e.id === d.ecurie) continue;
      const s = savoir(monde, e.id, d.domaine);
      s.parReglement[d.reglement] = r3((s.parReglement[d.reglement] ?? 0) + d.ampleur * part);
    }
    d.diffusee = r3(d.diffusee + part);
  }
  // Audit 8.12 : on garde les découvertes encore en diffusion, puis les plus récentes (avant : ordre alphabétique des écuries).
  const ids = idsTries(t).sort((a, b) => {
    const x = t[a] as unknown as { diffusee: number; saison?: number }, y = t[b] as unknown as { diffusee: number; saison?: number };
    return Number(x.diffusee < 1) - Number(y.diffusee < 1) || (x.saison ?? 0) - (y.saison ?? 0) || (a < b ? -1 : 1);
  });
  for (const id of ids.slice(0, Math.max(0, ids.length - DECOUVERTES.conservees))) delete t[id];
}

/** Chaque saison : vieillissement très lent du savoir (D-132, question 6) et historique borné. */
function vieillirSavoir(monde: Monde): void {
  for (const s of Object.values(table(monde, TABLES.savoirs)) as unknown as Savoir[]) {
    const k = 1 - SAVOIR.vieillissementAnnuel;
    s.fondamental = r3(s.fondamental * k);
    for (const id of Object.keys(s.parReglement)) s.parReglement[id] = r3(s.parReglement[id]! * k);
  }
  const t = table(monde, TABLES.historiqueRecherche);
  for (const [id, h] of Object.entries(t)) if ((h as unknown as HistoriqueRecherche).annee < monde.date.annee - HISTORIQUE_RECHERCHE.saisons) delete t[id];
  // Volume borné : règlements terminés ou rejetés conservés `HISTORIQUE_RECHERCHE.saisons` saisons.
  const tr = table(monde, TABLES.reglements);
  for (const [id, r] of Object.entries(tr)) {
    const reg = r as unknown as Reglement;
    if ((reg.statut === 'termine' || reg.statut === 'rejete') && reg.fin < monde.date.annee - HISTORIQUE_RECHERCHE.saisons) delete tr[id];
  }
}

/** Profil technique d'une écurie (explications au joueur, mêmes informations pour l'IA) : savoir et rang par domaine. */
export function profilTechnique(monde: Monde, idEcurie: string): { domaine: string; libelle: string; savoir: number; rang: number }[] {
  const actuel = reglementAnnonce(monde)?.id ?? reglementEnVigueur(monde)?.id;
  return LISTE_DOMAINES.map((d) => {
    const valeurs = ecuriesActives(monde).map((e) => ({ e: e.id, v: savoirApplicable(monde, e.id, d, actuel) })).sort((a, b) => b.v - a.v);
    return { domaine: d, libelle: DOMAINES[d].libelle, savoir: r3(savoirApplicable(monde, idEcurie, d, actuel)), rang: valeurs.findIndex((x) => x.e === idEcurie) + 1 };
  });
}

/* ===================================================================== Commandes (joueur et IA) */

function auteurAutorise(monde: Monde, auteur: string, idEcurie: string): boolean {
  const p = table(monde, TABLES.personnes)[auteur] as unknown as Personne | undefined;
  return !!p && p.statut === 'actif' && p.ecurie === idEcurie && (p.poste === 'team_principal' || p.poste === 'directeur_technique');
}

export function motifRefusProgramme(monde: Monde, auteur: string, prm: Record<string, unknown>): string | null {
  const e = table(monde, TABLES.ecuries)[String(prm['ecurie'] ?? '')] as unknown as Ecurie | undefined;
  if (!e || e.statut !== 'active') return 'Écurie inconnue.';
  if (!auteurAutorise(monde, auteur, e.id)) return 'Seuls le team principal et le directeur technique de l’écurie décident de la recherche.';
  const emplacement = prm['emplacement'];
  if (!(typeof emplacement === 'number' && Number.isInteger(emplacement) && emplacement >= 1 && emplacement <= PROGRAMMES.emplacements)) return `Emplacement de 1 à ${PROGRAMMES.emplacements}.`;
  if (!LISTE_DOMAINES.includes(String(prm['domaine']) as Domaine)) return 'Domaine technique inconnu.';
  const horizon = String(prm['horizon'] ?? '');
  if (horizon !== 'actuelle' && horizon !== 'suivante') {
    const r = table(monde, TABLES.reglements)[horizon] as unknown as Reglement | undefined;
    if (!r || (r.statut !== 'propose' && r.statut !== 'annonce' && r.statut !== 'brouillon') || !reglementConnu(r, e.id)) return 'Horizon : voiture actuelle, saison suivante, ou un règlement annoncé, proposé ou dont l’écurie a eu vent.';
  }
  const part = prm['part'];
  if (!(typeof part === 'number' && Number.isFinite(part) && part >= PROGRAMMES.partMin && part <= PROGRAMMES.partMax)) return `Part des moyens entre ${PROGRAMMES.partMin} et ${PROGRAMMES.partMax}.`;
  const autres = programmes(monde, e.id).filter((p) => p.emplacement !== emplacement && p.statut === 'actif').reduce((a, p) => a + p.part, 0);
  if (autres + part > PROGRAMMES.partTotaleMax + 1e-9) return `La recherche ne peut pas dépasser ${Math.round(PROGRAMMES.partTotaleMax * 100)} % des moyens de développement.`;
  return null;
}

/** Fixe ou modifie un programme. Changer de domaine impose une remise en route (coût en temps seulement, D-132, question 7). */
export function definirProgramme(monde: Monde, auteur: string, prm: Record<string, unknown>): void {
  const idEcurie = String(prm['ecurie']);
  const emplacement = Number(prm['emplacement']);
  const t = table(monde, TABLES.programmes);
  const id = `prg_${idEcurie}_${emplacement}`;
  const ancien = t[id] as unknown as ProgrammeRecherche | undefined;
  const domaine = String(prm['domaine']);
  const p: ProgrammeRecherche = {
    id, ecurie: idEcurie, emplacement, domaine, horizon: String(prm['horizon']), part: Number(prm['part']), statut: 'actif',
    remiseEnRoute: ancien && ancien.domaine !== domaine ? SAVOIR.remiseEnRouteSemaines : ancien?.remiseEnRoute ?? 0,
    debut: ancien && ancien.domaine === domaine ? ancien.debut : { ...monde.date },
  };
  t[id] = p as unknown as Entite;
  ajouterEvenement(monde, {
    type: 'recherche.programme', acteurs: [{ id: auteur, role: 'auteur' }, { id: idEcurie, role: 'ecurie' }], importance: 1, visibilite: 'prive',
    contexte: { emplacement, domaine, horizon: p.horizon, part: p.part, reorientation: !!ancien && ancien.domaine !== domaine },
  });
}

export const commandeProgramme: DefinitionCommande = {
  type: 'recherche.programme',
  valider: (monde, c) => motifRefusProgramme(monde, c.auteur, c.parametres),
  appliquer({ monde }, c) { definirProgramme(monde, c.auteur, c.parametres); },
};

export const commandeSuspendre: DefinitionCommande = {
  type: 'recherche.suspendre',
  valider(monde, c) {
    const idEcurie = String(c.parametres['ecurie'] ?? '');
    if (!auteurAutorise(monde, c.auteur, idEcurie)) return 'Seuls le team principal et le directeur technique de l’écurie décident de la recherche.';
    if (!table(monde, TABLES.programmes)[`prg_${idEcurie}_${Number(c.parametres['emplacement'])}`]) return 'Aucun programme à cet emplacement.';
    return null;
  },
  appliquer({ monde }, c) {
    (table(monde, TABLES.programmes)[`prg_${String(c.parametres['ecurie'])}_${Number(c.parametres['emplacement'])}`] as unknown as ProgrammeRecherche).statut = 'suspendu';
  },
};

export const commandeDeleguer: DefinitionCommande = {
  type: 'recherche.deleguer',
  valider(monde, c) {
    const e = table(monde, TABLES.ecuries)[String(c.parametres['ecurie'] ?? '')] as unknown as Ecurie | undefined;
    if (!e) return 'Écurie inconnue.';
    const tp = teamPrincipal(monde, e.id);
    if (!tp || tp.id !== c.auteur) return 'Seul le team principal peut déléguer la recherche.';
    return typeof c.parametres['actif'] === 'boolean' ? null : 'Préciser actif : vrai ou faux.';
  },
  appliquer({ monde }, c) {
    const e = table(monde, TABLES.ecuries)[String(c.parametres['ecurie'])] as unknown as Ecurie;
    e.delegationRecherche = c.parametres['actif'] === true;
  },
};

export const commandeVote: DefinitionCommande = {
  type: 'reglement.vote',
  valider(monde, c) {
    const e = table(monde, TABLES.ecuries)[String(c.parametres['ecurie'] ?? '')] as unknown as Ecurie | undefined;
    if (!e) return 'Écurie inconnue.';
    const tp = teamPrincipal(monde, e.id);
    if (!tp || tp.id !== c.auteur) return 'Seul le team principal vote au nom de l’écurie.';
    const props = propositions(monde);
    if (!props.length) return 'Aucun vote en cours.';
    const option = String(c.parametres['option'] ?? '');
    if (option !== 'prolongation' && !props.some((r) => r.id === option)) return 'Option inconnue.';
    return null;
  },
  appliquer({ monde }, c) {
    for (const r of propositions(monde)) (r.votes ??= {})[String(c.parametres['ecurie'])] = String(c.parametres['option']);
  },
};

/* ===================================================================== IA (mêmes commandes) */

type Commander = (c: { type: string; auteur: string; parametres: Record<string, unknown> }) => unknown;

/** Les écuries de l'IA (et celles du joueur qui ont délégué) choisissent leurs programmes. */
export function decisionsRecherche(monde: Monde, commander: Commander, seulement?: string): void {
  const actuel = reglementEnVigueur(monde);
  for (const e of ecuriesActives(monde)) {
    if (seulement && e.id !== seulement) continue;
    if (e.pilotee && !e.delegationRecherche) continue;
    // Futur règlement visé : annoncé, sinon proposé, sinon un avant-projet dont l'écurie a eu vent (phase 8c).
    const futur = reglementAnnonce(monde) ?? propositions(monde)[0] ?? avantProjets(monde).find((r) => reglementConnu(r, e.id));
    const tp = teamPrincipal(monde, e.id);
    const dt = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).find((p) => p.statut === 'actif' && p.ecurie === e.id && p.poste === 'directeur_technique');
    const auteur = tp?.id;
    if (!auteur) continue;
    const f = tirageLocal(monde, 'recherche.ia', e.id, monde.date.annee, monde.date.semaine);
    const force = forceEcurie(monde, e.id) + f.normale(0, IA_RECHERCHE.alea);
    const risque = ((dt?.traits['risque'] ?? 10) + (tp?.traits['risque'] ?? 10)) / 40; // moyenne des deux traits, ramenée de 0–20 à 0–1
    // Horizons : un prétendant reste sur la voiture actuelle ; une écurie distancée prépare l'avenir ; entre les deux, un de chaque.
    const futurId = futur && futur.id !== actuel?.id ? futur.id : 'suivante';
    const horizons = force >= IA_RECHERCHE.forcePretendant ? ['actuelle', risque > CHOIX_DOMAINE_IA.seuilRisque ? futurId : 'actuelle']
      : force <= IA_RECHERCHE.forceDistancee ? [futurId, futurId] : ['actuelle', futurId];
    const part = Math.min(PROGRAMMES.partMax, Math.max(PROGRAMMES.partMin, IA_RECHERCHE.partDefaut + IA_RECHERCHE.partAudace * (risque - 0.5)));
    const pris = new Set<string>();
    horizons.forEach((horizon, i) => {
      const domaine = choisirDomaine(monde, e, horizon, pris, `${monde.date.annee}-${monde.date.semaine}-${i}`);
      pris.add(domaine);
      const existant = table(monde, TABLES.programmes)[`prg_${e.id}_${i + 1}`] as unknown as ProgrammeRecherche | undefined;
      if (existant && existant.statut === 'actif' && existant.domaine === domaine && existant.horizon === horizon) return;
      commander({ type: 'recherche.programme', auteur, parametres: { ecurie: e.id, emplacement: i + 1, domaine, horizon, part: Math.round(part * 100) / 100 } });
    });
  }
}

/** Choix d'un domaine : intensité du futur règlement, faiblesses relatives, philosophie de l'écurie, rendement décroissant, jugement. */
function choisirDomaine(monde: Monde, e: Ecurie, horizon: string, exclus: Set<string>, cle: string): string {
  const r = horizon !== 'actuelle' && horizon !== 'suivante' ? (table(monde, TABLES.reglements)[horizon] as unknown as Reglement | undefined) : undefined;
  const philosophie = e.philosophieTechnique.toLowerCase();
  const notes = LISTE_DOMAINES.filter((d) => !exclus.has(d)).map((d) => {
    const s = savoir(monde, e.id, d);
    let u = 1 / (1 + (s.fondamental + Object.values(s.parReglement).reduce((a, b) => a + b, 0)) / SAVOIR.rendementK);
    if (r) u *= CHOIX_DOMAINE_IA.intensiteBase + intensitePercue(monde, e.id, r, d); // approximative pour un avant-projet (8c)
    if (/aéro/.test(philosophie) && d.startsWith('aero')) u *= CHOIX_DOMAINE_IA.philosophieAero;
    if (/motoriste/.test(philosophie) && (d === 'groupe_propulseur' || d === 'energie')) u *= CHOIX_DOMAINE_IA.philosophieMoteur;
    // Jugement : une part de hasard propre à l'écurie, pour que deux écuries semblables ne fassent pas les mêmes choix.
    u *= CHOIX_DOMAINE_IA.jugementMin + CHOIX_DOMAINE_IA.jugementAmplitude * tirageLocal(monde, 'recherche.jugement', e.id, d, cle).suivant();
    return { d, u };
  }).sort((a, b) => b.u - a.u || (a.d < b.d ? -1 : 1));
  return notes[0]!.d;
}

/* ===================================================================== Calendrier */

export const systemeTechnique: Systeme = {
  nom: 'technique.reglements_recherche',
  executer({ monde, date, commanderIA }) {
    initialiserReglement(monde);
    if (date.semaine === 1) {
      // Entrée en vigueur d'une réforme, sinon évolution mineure ; puis savoir destiné à cette saison.
      if (!entreeEnVigueur(monde)) appliquerEvolutionMineure(monde);
      for (const e of ecuriesActives(monde)) appliquerSaisonSuivante(monde, e);
      // Phase 12a : voiture de l'année (chaque pièce se rapproche de sa frontière, savoir de la saison suivante compris).
      if (date.annee > DATE_DEPART.annee) intersaison(monde, ecuriesActives(monde));
    }
    if (date.semaine === 2) {
      vieillirSavoir(monde);
      diffuserDecouvertes(monde);
      decisionsRecherche(monde, (c) => commanderIA(c));
    }
    const actuel = reglementEnVigueur(monde);
    if (actuel && date.annee === actuel.fin - CALENDRIER_REGLEMENT.anneesAvantFin && date.semaine === FUITES_REGLEMENT.semaineAvantProjet) preparerReformes(monde);
    if (actuel && date.annee === actuel.fin - CALENDRIER_REGLEMENT.anneesAvantFin && date.semaine === CALENDRIER_REGLEMENT.semaineProposition) {
      preparerReformes(monde); // au cas où (partie reprise après la semaine de préparation)
      publierReformes(monde);
      decisionsRecherche(monde, (c) => commanderIA(c)); // recherche exploratoire possible avant le vote
    }
    if (date.semaine === CALENDRIER_REGLEMENT.semaineVote && propositions(monde).length) {
      voterReforme(monde);
      decisionsRecherche(monde, (c) => commanderIA(c));
    }
    if (date.semaine === EVOLUTIONS_MINEURES.semaine) deciderEvolutionMineure(monde);
    if (date.semaine % PROGRAMMES.periodeSemaines === 2) avancerRecherche(monde);
  },
};

/** Savoir accumulé pour la saison suivante : utilisé à l'intersaison, puis versé au savoir du règlement en vigueur. */
function appliquerSaisonSuivante(monde: Monde, e: Ecurie): void {
  const actuel = reglementEnVigueur(monde);
  const parDomaine: Record<string, number> = {};
  for (const d of LISTE_DOMAINES) {
    const s = savoir(monde, e.id, d);
    if (s.pourSaisonSuivante <= 0) continue;
    parDomaine[d] = s.pourSaisonSuivante;
    if (actuel) s.parReglement[actuel.id] = r3((s.parReglement[actuel.id] ?? 0) + s.pourSaisonSuivante);
    s.pourSaisonSuivante = 0;
  }
  // Phase 12a : ce savoir élargit la frontière du règlement en vigueur ; la voiture de l'année en profite à l'intersaison.
  if (Object.keys(parDomaine).length) ajouterEvenement(monde, { type: 'technique.preparation', acteurs: [{ id: e.id, role: 'ecurie' }], importance: 1, visibilite: 'prive', contexte: { savoirParDomaine: parDomaine } });
}


export function installerTechnique(moteur: Moteur): Moteur {
  moteur.ajouterSysteme(systemeTechnique);
  moteur.commandes.enregistrer(commandeProgramme).enregistrer(commandeSuspendre).enregistrer(commandeDeleguer).enregistrer(commandeVote);
  return moteur;
}
