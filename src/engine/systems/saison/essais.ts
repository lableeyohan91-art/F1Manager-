/**
 * Phase 13b+ (fiche docs/systemes/phase-13b-plus-essais-libres.md) — essais libres : trois séances par Grand Prix, un programme par
 * séance et par pilote titulaire. Le joueur fixe ses programmes par la commande `essais.programmes` ; sans choix enregistré (toutes les
 * écuries de l'IA), le plan par défaut s'applique, avec les mêmes règles et la même information.
 */
import { ESSAIS } from '../../balance/course';
import type { DefinitionCommande } from '../../core/commandes';
import { ajouterEvenement } from '../../core/evenements';
import { tirageLocal } from '../../core/moteur';
import { table, type Monde } from '../../core/monde';
import { PROGRAMMES_ESSAIS, TABLES, type Circuit, type Ecurie, type GrandPrix, type PieceVoiture, type Personne, type ProgrammeEssais } from '../../model/types';
import { piecesInstallees } from '../monoplaces/physique';
import { experienceVide } from '../carriere/performance';

/** Effets des essais libres sur le week-end d'un pilote titulaire (lus par les qualifications, la stratégie et la course). */
export interface EffetsEssais {
  /** Perte due au réglage (% du tour, positive = plus lent), en qualification et en course. */
  reglagePct: number;
  /** Multiplicateur de l'erreur d'estimation de l'usure (stratégie). */
  facteurEstimation: number;
  /** Multiplicateur de la probabilité d'erreur en qualification, et gain de rythme en qualification (% du tour). */
  facteurErreurQualif: number;
  bonusQualifPct: number;
  /** Part restante du handicap « circuit découvert ». */
  facteurNouveaute: number;
  programmes: ProgrammeEssais[];
}

/** Jeune pilote de l'écurie qui peut rouler en EL1 : pilote de réserve, sinon junior affilié (le premier par identifiant). */
export function jeunePilote(monde: Monde, idEcurie: string): Personne | undefined {
  const ps = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).filter((x) => x.statut === 'actif' && x.ecurie === idEcurie);
  const tri = (a: Personne, b: Personne) => (a.id < b.id ? -1 : 1);
  return ps.filter((x) => x.poste === 'pilote_reserve').sort(tri)[0] ?? ps.filter((x) => x.poste === 'pilote_junior').sort(tri)[0];
}

/** Dernier Grand Prix couru : l'écurie y a-t-elle subi une panne ? (information publique, la même pour le joueur et l'IA). */
function panneAuDernierGp(monde: Monde, idEcurie: string, gp: GrandPrix): boolean {
  const gps = (Object.values(table(monde, TABLES.grandsPrix)) as unknown as GrandPrix[]).filter((g) => g.termine && g.saison === gp.saison && g.manche < gp.manche);
  const dernier = gps.sort((a, b) => b.manche - a.manche)[0];
  return !!dernier?.resultats.some((r) => r.ecurie === idEcurie && r.abandon === 'mecanique');
}

/** Plan par défaut (IA, ou joueur qui n'a rien fixé). */
export function planParDefaut(monde: Monde, e: Ecurie, p: Personne, circuit: Circuit, gp: GrandPrix): ProgrammeEssais[] {
  const visites = p.carriere?.experience?.circuits[circuit.id] ?? 0;
  const premier: ProgrammeEssais = visites < ESSAIS.visitesConnu ? 'apprentissage' : panneAuDernierGp(monde, e.id, gp) ? 'essaiPiece' : 'reglages';
  // Les deux premières séances de réglages rapportent le plus (rendement décroissant) ; la troisième se partage selon la situation.
  const plan: ProgrammeEssais[] = premier === 'reglages' ? ['reglages', 'reglages', 'simulationQualif'] : [premier, 'reglages', 'reglages'];
  return plan.slice(0, ESSAIS.seances);
}

/**
 * Prépare le week-end : programmes de chaque titulaire, effets, et conséquences immédiates (pièce fragile trouvée, jeune pilote qui
 * apprend le circuit), avec leurs événements.
 */
export function essaisLibres(monde: Monde, gp: GrandPrix, circuit: Circuit, partants: Personne[]): Map<string, EffetsEssais> {
  const res = new Map<string, EffetsEssais>();
  for (const p of partants) {
    const e = table(monde, TABLES.ecuries)[p.ecurie] as unknown as Ecurie;
    let programmes = (e.programmesEssais?.[p.id] ?? planParDefaut(monde, e, p, circuit, gp)).slice(0, ESSAIS.seances);
    const f = tirageLocal(monde, 'essais', gp.id, p.id);
    // Jeune pilote : seulement en EL1, seulement s'il existe ; sinon la séance revient aux réglages.
    if (programmes[0] === 'jeunePilote') {
      const j = jeunePilote(monde, e.id);
      if (j?.carriere) {
        const ex = (j.carriere.experience ??= experienceVide(e.id));
        ex.circuits[circuit.id] = (ex.circuits[circuit.id] ?? 0) + ESSAIS.visiteJeune;
        ajouterEvenement(monde, { type: 'essais.jeune', acteurs: [{ id: e.id, role: 'ecurie' }, { id: j.id, role: 'pilote' }, { id: p.id, role: 'titulaire' }], importance: 1, visibilite: 'public', contexte: { grandPrix: gp.id, circuit: circuit.id, seance: 1 } });
      } else programmes = ['reglages', ...programmes.slice(1)];
    }
    programmes = programmes.map((x, i) => (i > 0 && x === 'jeunePilote' ? 'reglages' : x));
    const n = (x: ProgrammeEssais) => programmes.filter((y) => y === x).length;
    // Essai de pièce : chaque séance a une chance de trouver une pièce montée fragile.
    for (let k = 0; k < n('essaiPiece'); k++) {
      const fragile = piecesInstallees(monde, e.id).filter((x: PieceVoiture) => x.fragile).sort((a, b) => (a.id < b.id ? -1 : 1))[0];
      if (fragile && f.chance(ESSAIS.probaPiece)) {
        delete fragile.fragile;
        ajouterEvenement(monde, { type: 'essais.piece', acteurs: [{ id: e.id, role: 'ecurie' }, { id: p.id, role: 'pilote' }], importance: 2, visibilite: 'prive', contexte: { grandPrix: gp.id, piece: fragile.id, type: fragile.type, cause: 'essai d\'une pièce aux essais libres' } });
      }
    }
    const rt = p.competences['retourTechnique'] ?? 10;
    const retour = Math.min(ESSAIS.retourMax, Math.max(ESSAIS.retourMin, 1 - ESSAIS.retourParPoint * (rt - ESSAIS.retourReference)));
    const erreur = Math.abs(f.normale(0, ESSAIS.reglageSigmaPct));
    res.set(p.id, {
      reglagePct: erreur * Math.pow(ESSAIS.parSeanceReglages, n('reglages')) * retour,
      facteurEstimation: Math.pow(ESSAIS.parSeanceRelais, n('longsRelais')),
      facteurErreurQualif: Math.pow(ESSAIS.parSeanceSimulation, n('simulationQualif')),
      bonusQualifPct: ESSAIS.bonusSimulationPct * n('simulationQualif'),
      facteurNouveaute: Math.pow(ESSAIS.parSeanceApprentissage, n('apprentissage')),
      programmes,
    });
  }
  return res;
}

/* ===================================================================== Commande commune */

export function motifRefusProgrammes(monde: Monde, auteur: string, prm: Record<string, unknown>): string | null {
  const e = table(monde, TABLES.ecuries)[String(prm['ecurie'] ?? '')] as unknown as Ecurie | undefined;
  if (!e || e.statut !== 'active') return 'Écurie inconnue.';
  const a = table(monde, TABLES.personnes)[auteur] as unknown as Personne | undefined;
  if (!a || a.statut !== 'actif' || a.ecurie !== e.id || !['team_principal', 'directeur_sportif'].includes(a.poste ?? '')) return 'Seuls le team principal et le directeur sportif fixent les programmes d\'essais.';
  const p = table(monde, TABLES.personnes)[String(prm['pilote'] ?? '')] as unknown as Personne | undefined;
  if (!p || p.ecurie !== e.id || p.poste !== 'pilote_titulaire') return 'Pilote titulaire inconnu dans cette écurie.';
  const seances = ['el1', 'el2', 'el3'].slice(0, ESSAIS.seances).map((k) => prm[k]);
  for (const x of seances) if (!PROGRAMMES_ESSAIS.includes(x as ProgrammeEssais)) return 'Programme inconnu (réglages, longs relais, simulation de qualification, apprentissage, essai d\'une pièce, jeune pilote).';
  if (seances.slice(1).includes('jeunePilote')) return 'Le jeune pilote ne roule qu\'en EL1.';
  if (seances[0] === 'jeunePilote' && !jeunePilote(monde, e.id)) return 'Aucun pilote de réserve ni junior dans l\'écurie.';
  return null;
}

/** Phase 13b+ : programmes d'essais libres d'un pilote titulaire (joueur ; mêmes règles que le plan par défaut de l'IA). */
export const commandeProgrammesEssais: DefinitionCommande = {
  type: 'essais.programmes',
  valider: (monde, c) => motifRefusProgrammes(monde, c.auteur, c.parametres),
  appliquer({ monde }, c) {
    const e = table(monde, TABLES.ecuries)[String(c.parametres['ecurie'])] as unknown as Ecurie;
    const pilote = String(c.parametres['pilote']);
    const programmes = ['el1', 'el2', 'el3'].slice(0, ESSAIS.seances).map((k) => c.parametres[k] as ProgrammeEssais);
    (e.programmesEssais ??= {})[pilote] = programmes;
    ajouterEvenement(monde, {
      type: 'essais.programmes', acteurs: [{ id: e.id, role: 'ecurie' }, { id: pilote, role: 'pilote' }, { id: c.auteur, role: 'decideur' }], importance: 1, visibilite: 'prive',
      contexte: { programmes: programmes.join(',') },
    });
  },
};
