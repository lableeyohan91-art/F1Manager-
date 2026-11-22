/**
 * Indicateurs de simulation (phase 3) : crédibilité ET intérêt narratif (D-053).
 * Ce sont des MESURES, jamais des contraintes (D-040) : rien dans le moteur ne les lit.
 */

import { ECART_VOITURE_PAR_POINT, SEUIL_SURPRISE_PCT } from '../balance/course';
import { table, type Monde } from '../core/monde';
import { TABLES, type GrandPrix, type Saison } from '../model/types';

export interface IndicateursSaison {
  annee: number;
  vainqueursDifferents: number;
  ecuriesVictorieuses: number;
  /** Part des victoires de l'écurie qui en a gagné le plus (0–1). */
  partVictoiresDominante: number;
  tauxAbandon: number;
  derniereEcurieMarque: boolean;
  /** Écart de performance moyen entre la meilleure et la moins bonne voiture au début de la saison, en % du temps au tour. */
  ecartPerfPct: number;
  ecartP1P2: number;
  changementsLeader: number;
  doublesTotal: number;
  /** Écart moyen entre coéquipiers à l'arrivée (courses où les deux finissent), en % du temps au tour. */
  ecartCoequipiersPct: number;
  /** Corrélation de rang (Spearman) entre la performance de la voiture et les points constructeurs (1 = parfaite). */
  correlationVoiturePoints: number;
  /** Plus forte progression d'une voiture pendant la saison (points d'indice). */
  progressionMax: number;
  progressionEcurie: string;
  resultatsInattendus: number;
  /** Titre mathématiquement ouvert avant la dernière manche (définition exacte, égalités départagées). */
  titreDerniereManche: boolean;
  /** Le leader avant la dernière manche n'est pas le champion. */
  retournementDerniereManche: boolean;
  /** Champion et vice-champion sont coéquipiers. */
  duoCoequipiers: boolean;
  /** Lutte pour le titre (ouvert à la dernière manche) entre coéquipiers / entre écuries différentes. */
  lutteCoequipiers: boolean;
  lutteInterEcuries: boolean;
  courseSousLaPluie: number;
  /** Décomposition de l'écart entre coéquipiers (courses où les deux finissent ; nécessite les explications). */
  coequipiers: DecompositionCoequipiers | null;
}

/**
 * Écart de « temps » entre deux coéquipiers = Δcompétences + Δforme + Δaléa (même voiture : Δvoiture = 0).
 * moyAbs* : moyenne des valeurs absolues (en % du temps au tour) ;
 * part* : part de l'écart quadratique moyen total (moyenne des carrés, qui inclut l'écart systématique entre
 *         deux coéquipiers) due à chaque composante ; le reste (positif ou négatif) vient des termes croisés.
 */
export interface DecompositionCoequipiers {
  paires: number;
  moyAbsTotal: number;
  moyAbsCompetences: number;
  moyAbsForme: number;
  moyAbsAlea: number;
  partCompetences: number;
  partForme: number;
  partAlea: number;
}

const moyAbs = (v: number[]) => (v.length ? v.reduce((a, b) => a + Math.abs(b), 0) / v.length : 0);

export function decompositionCoequipiers(gps: GrandPrix[]): DecompositionCoequipiers | null {
  const dTot: number[] = [], dComp: number[] = [], dForme: number[] = [], dAlea: number[] = [];
  for (const g of gps) {
    const parEcurie = new Map<string, GrandPrix['resultats']>();
    for (const r of g.resultats) if (r.position !== null && r.explication) parEcurie.set(r.ecurie, [...(parEcurie.get(r.ecurie) ?? []), r]);
    for (const paire of parEcurie.values()) {
      if (paire.length !== 2) continue;
      // Orientation fixe (par identifiant), pas par ordre d'arrivée : sinon la sélection crée une corrélation artificielle.
      const [a, b] = [...paire].sort((x, y) => (x.pilote < y.pilote ? -1 : 1)) as [GrandPrix['resultats'][number], GrandPrix['resultats'][number]];
      const ea = a.explication!, eb = b.explication!;
      // Le « temps » vaut −(voiture + pilote + forme) + aléa : on exprime les écarts dans ce sens (positif = a plus lent).
      dComp.push(-(ea.pilote - eb.pilote));
      dForme.push(-(ea.forme - eb.forme));
      dAlea.push(ea.alea - eb.alea);
      dTot.push(dComp.at(-1)! + dForme.at(-1)! + dAlea.at(-1)!);
    }
  }
  if (dTot.length === 0) return null;
  const carre = (v: number[]) => v.reduce((a, b) => a + b * b, 0) / v.length;
  const vt = carre(dTot) || 1;
  return {
    paires: dTot.length,
    moyAbsTotal: moyAbs(dTot),
    moyAbsCompetences: moyAbs(dComp),
    moyAbsForme: moyAbs(dForme),
    moyAbsAlea: moyAbs(dAlea),
    partCompetences: carre(dComp) / vt,
    partForme: carre(dForme) / vt,
    partAlea: carre(dAlea) / vt,
  };
}

export interface IndicateursSerie {
  saisons: IndicateursSaison[];
  championsPilotesDifferents: number;
  championsConstructeursDifferents: number;
  maxTitresConsecutifsEcurie: number;
  /** Écuries qui n'ont gagné aucune course sur toute la série. */
  ecuriesSansVictoire: number;
  /** Nombre de fois où une écurie gagne au moins 3 places au classement constructeurs d'une saison à l'autre. */
  remontees: number;
}

function rangs(valeurs: number[]): number[] {
  const ordre = valeurs.map((v, i) => [v, i] as const).sort((a, b) => b[0] - a[0]);
  const r = new Array<number>(valeurs.length);
  ordre.forEach(([, i], k) => (r[i] = k + 1));
  return r;
}

export function spearman(a: number[], b: number[]): number {
  const n = a.length;
  if (n < 2) return 1;
  const ra = rangs(a), rb = rangs(b);
  let d2 = 0;
  for (let i = 0; i < n; i++) d2 += (ra[i]! - rb[i]!) ** 2;
  return 1 - (6 * d2) / (n * (n * n - 1));
}

export function indicateursSaison(monde: Monde, s: Saison): IndicateursSaison {
  const gps = s.calendrier.map((id) => table(monde, TABLES.grandsPrix)[id] as unknown as GrandPrix).filter((g) => g?.termine);
  const vainqueurs = gps.map((g) => g.resultats[0]).filter((r) => r?.position === 1);
  const departs = gps.reduce((a, g) => a + g.resultats.length, 0);
  const abandons = gps.reduce((a, g) => a + g.resultats.filter((r) => r.abandon).length, 0);
  const vic = s.constructeurs.map((c) => c.victoires);
  const idx = Object.values(s.indiceDebut);

  // Coéquipiers.
  const ecarts: number[] = [];
  for (const g of gps) {
    const parEcurie = new Map<string, number[]>();
    for (const r of g.resultats) if (r.ecartPct !== null) parEcurie.set(r.ecurie, [...(parEcurie.get(r.ecurie) ?? []), r.ecartPct]);
    for (const v of parEcurie.values()) if (v.length === 2) ecarts.push(Math.abs(v[0]! - v[1]!));
  }

  const ecuries = s.constructeurs.map((c) => c.ecurie);
  let progressionMax = -Infinity, progressionEcurie = '';
  for (const e of ecuries) {
    const d = (s.indiceFin[e] ?? s.indiceDebut[e] ?? 0) - (s.indiceDebut[e] ?? 0);
    if (d > progressionMax) [progressionMax, progressionEcurie] = [d, e];
  }

  return {
    annee: s.annee,
    vainqueursDifferents: new Set(vainqueurs.map((r) => r!.pilote)).size,
    ecuriesVictorieuses: new Set(vainqueurs.map((r) => r!.ecurie)).size,
    partVictoiresDominante: gps.length ? Math.max(0, ...vic) / gps.length : 0,
    tauxAbandon: departs ? abandons / departs : 0,
    derniereEcurieMarque: (s.constructeurs.at(-1)?.points ?? 0) > 0,
    ecartPerfPct: idx.length ? (Math.max(...idx) - Math.min(...idx)) * ECART_VOITURE_PAR_POINT : 0,
    ecartP1P2: (s.pilotes[0]?.points ?? 0) - (s.pilotes[1]?.points ?? 0),
    changementsLeader: s.leaders.filter((l, i) => i > 0 && l !== s.leaders[i - 1]).length,
    doublesTotal: s.constructeurs.reduce((a, c) => a + c.doubles, 0),
    ecartCoequipiersPct: ecarts.length ? ecarts.reduce((a, b) => a + b, 0) / ecarts.length : 0,
    correlationVoiturePoints: spearman(ecuries.map((e) => s.indiceDebut[e] ?? 0), s.constructeurs.map((c) => c.points)),
    progressionMax,
    progressionEcurie,
    resultatsInattendus: vainqueurs.filter((r) => r!.retardVoiturePct >= SEUIL_SURPRISE_PCT).length,
    titreDerniereManche: s.titreOuvertDerniereManche ?? false,
    retournementDerniereManche: !!s.titreOuvertDerniereManche && !!s.leaderAvantDerniereManche && s.leaderAvantDerniereManche !== s.pilotes[0]?.pilote,
    duoCoequipiers: !!s.pilotes[1] && s.pilotes[0]?.ecurie === s.pilotes[1].ecurie,
    lutteCoequipiers: !!s.titreOuvertDerniereManche && !!s.pilotes[1] && s.pilotes[0]?.ecurie === s.pilotes[1].ecurie,
    lutteInterEcuries: !!s.titreOuvertDerniereManche && !!s.pilotes[1] && s.pilotes[0]?.ecurie !== s.pilotes[1].ecurie,
    courseSousLaPluie: gps.filter((g) => g.pluie).length,
    coequipiers: decompositionCoequipiers(gps),
  };
}

export function indicateursSerie(monde: Monde): IndicateursSerie {
  const saisons = (Object.values(table(monde, TABLES.saisons)) as unknown as Saison[]).filter((s) => s.termine).sort((a, b) => a.annee - b.annee);
  const champP = saisons.map((s) => s.pilotes[0]?.pilote ?? '');
  const champC = saisons.map((s) => s.constructeurs[0]?.ecurie ?? '');
  let maxSerie = 0, serie = 0;
  champC.forEach((c, i) => {
    serie = i > 0 && c === champC[i - 1] ? serie + 1 : 1;
    maxSerie = Math.max(maxSerie, serie);
  });
  const gagnantes = new Set(saisons.flatMap((s) => s.constructeurs.filter((c) => c.victoires > 0).map((c) => c.ecurie)));
  const toutes = new Set(saisons.flatMap((s) => s.constructeurs.map((c) => c.ecurie)));
  let remontees = 0;
  for (let i = 1; i < saisons.length; i++) {
    const avant = saisons[i - 1]!.constructeurs.map((c) => c.ecurie);
    saisons[i]!.constructeurs.forEach((c, rang) => {
      const r = avant.indexOf(c.ecurie);
      if (r >= 0 && r - rang >= 3) remontees++;
    });
  }
  return {
    saisons: saisons.map((s) => indicateursSaison(monde, s)),
    championsPilotesDifferents: new Set(champP).size,
    championsConstructeursDifferents: new Set(champC).size,
    maxTitresConsecutifsEcurie: maxSerie,
    ecuriesSansVictoire: [...toutes].filter((e) => !gagnantes.has(e)).length,
    remontees,
  };
}
