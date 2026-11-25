/**
 * Phase 12b — événements de conception (fiche compagnon §4) : piste prometteuse, contradiction CFD / soufflerie, matériau expérimental,
 * réorientation du concept. Un seul événement au plus par projet, tiré au lancement ; vérité fixée à la présentation ; le responsable
 * donne une estimation imparfaite (corrélation). Les incidents dus à la fatigue sont une mécanique distincte (fatigue.ts, alertes).
 */

import { EVENEMENTS_CONCEPTION as EV, PIECES, SOUFFLERIE, type TypePiece } from '../../balance/monoplaces';
import { SAVOIR } from '../../balance/technique';
import { rangSemaine } from '../../core/calendrier';
import { table, type Monde } from '../../core/monde';
import { tirageLocal } from '../../core/moteur';
import { TABLES, type DilemmeTechnique, type Ecurie, type Personne, type ProjetConception } from '../../model/types';
import { reglementEnVigueur, savoir, savoirApplicable } from '../technique/acces';
import { depenser, enveloppeRestante } from './depenses';
import { piecesInstallees } from './physique';
import type { Pole } from './fatigue';

const r2 = (x: number) => Math.round(x * 100) / 100;
const borner = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
type Famille = keyof typeof EV.poids;

function personnel(monde: Monde, idEcurie: string, pole: Pole): { innovation: number; correlation: number; rigueur: number; risque: number } {
  const ps = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).filter((p) => p.statut === 'actif' && p.ecurie === idEcurie);
  const resp = ps.find((p) => p.poste === (pole === 'aero' ? 'responsable_aero' : 'responsable_conception'));
  const dt = ps.find((p) => p.poste === 'directeur_technique');
  return {
    innovation: Math.max(resp?.competences['innovation'] ?? 10, dt?.competences['innovation'] ?? 10),
    correlation: resp?.competences['correlation'] ?? 10, rigueur: resp?.competences['rigueur'] ?? 10, risque: dt?.traits['risque'] ?? 10,
  };
}

/** Au lancement d'un projet : y aura-t-il un événement, de quelle famille, à quel moment (tirage unique, à graine). */
export function tirerEvenement(monde: Monde, p: ProjetConception): void {
  const type = p.type as TypePiece;
  const pole = PIECES[type].pole as Pole;
  const pers = personnel(monde, p.ecurie, pole);
  const actuel = piecesInstallees(monde, p.ecurie).find((x) => x.type === type)?.concept ?? 0;
  const nouveaute = Math.min(1, Math.abs(p.concept - actuel) / 2);
  const proba = borner(EV.base * (0.7 + (0.6 * pers.innovation) / 20) * (0.8 + 0.4 * nouveaute), EV.min, EV.max);
  const f = tirageLocal(monde, 'monoplaces.evenement', p.id);
  if (!f.chance(proba)) return;
  const s = PIECES[type].domaines.reduce((a, d) => a + savoirApplicable(monde, p.ecurie, d, reglementEnVigueur(monde)?.id), 0) / PIECES[type].domaines.length;
  const poids: Record<Famille, number> = {
    piste: EV.poids.piste * (0.5 + s / 80),
    contradiction: pole === 'aero' ? EV.poids.contradiction * (1.5 - pers.correlation / 20) : 0,
    materiau: ['chassis', 'suspensions', 'pontons', 'fond_plat'].includes(type) ? EV.poids.materiau : 0,
    reorientation: EV.poids.reorientation,
  };
  const familles = Object.keys(poids) as Famille[];
  p.evenementPrevu = { famille: f.choisirPondere(familles, familles.map((x) => poids[x])), a: r2(EV.momentMin + f.suivant() * (EV.momentMax - EV.momentMin)) };
}

const TEXTES: Record<Famille, string[]> = {
  piste: [
    'Chef, nos ingénieurs ont identifié une modification du {piece} qui pourrait nous faire gagner du temps. Il nous faudrait deux semaines et un budget supplémentaire. On tente ?',
    'Chef, une idée est sortie des derniers essais sur le {piece}. Je ne peux rien garantir, mais ça mérite peut-être qu’on creuse.',
    'Chef, l’équipe pense tenir une piste sur le {piece}. Deux semaines d’exploration pour en avoir le cœur net : à vous de voir.',
  ],
  contradiction: [
    'Chef, le simulateur annonce un gain sur le {piece}, mais la soufflerie ne le confirme pas. Je ne sais pas encore lequel croire.',
    'Chef, nos chiffres CFD et nos essais en soufflerie se contredisent sur le {piece}. On vérifie, on joue la prudence, ou on continue ?',
    'Chef, la corrélation ne tient pas sur le {piece} : la CFD et la soufflerie racontent deux histoires différentes.',
  ],
  materiau: [
    'Chef, un ingénieur propose un matériau plus léger pour le {piece}. Intéressant, mais sa durabilité reste incertaine.',
    'Chef, on peut gagner de la masse sur le {piece} avec une solution expérimentale. Faut-il la tester avant de l’adopter ?',
    'Chef, le fournisseur nous propose un composite inédit pour le {piece}. Prometteur, pas encore éprouvé.',
  ],
  reorientation: [
    'Chef, le {piece} pourrait finalement être plus intéressant avec une autre orientation, vu les circuits qui arrivent.',
    'Chef, en cours de route, on s’aperçoit que le {piece} gagnerait peut-être à changer de concept. On garde le cap ?',
    'Chef, les essais suggèrent une autre direction pour le {piece}. Ça coûterait une semaine.',
  ],
};

/** Présente l'événement prévu quand l'avancement atteint son moment (vérité tirée ici, estimation du responsable). */
export function presenterEvenement(monde: Monde, p: ProjetConception, creer: (d: Omit<DilemmeTechnique, 'id' | 'cree' | 'echeance'>) => void,
  meilleurConceptAlt: (p: ProjetConception) => { concept: number; gain: number }): void {
  const prevu = p.evenementPrevu;
  if (!prevu || prevu.presente || 1 - p.joursRestants / p.joursTotal < prevu.a) return;
  prevu.presente = true;
  // Une même famille ne revient pas trop vite pour une écurie (l'événement est alors perdu, pas reporté).
  const recent = Object.values(monde.evenements).some((ev) => ev.type === 'conception.dilemme' && ev.contexte['famille'] === prevu.famille
    && ev.acteurs.some((a) => a.id === p.ecurie) && rangSemaine(monde.date) - rangSemaine(ev.date) < EV.delaiFamilleSemaines);
  if (recent) return;
  const type = p.type as TypePiece;
  const pole = PIECES[type].pole as Pole;
  const pers = personnel(monde, p.ecurie, pole);
  const f = tirageLocal(monde, 'monoplaces.evenement.verite', p.id);
  const piece = PIECES[type].libelle.toLowerCase();
  const texte = TEXTES[prevu.famille as Famille][f.entier(0, 2)]!.replace('{piece}', piece);
  const bruit = (1.5 - pers.correlation / 20) * 0.5;
  switch (prevu.famille as Famille) {
    case 'piste': {
      const pMaj = Math.min(EV.majeureMax, EV.majeureBase * (pers.innovation / 14) ** 2);
      const x = f.suivant();
      const niveau = x < pMaj ? 'majeure' : x < pMaj + EV.partRien * (1 - pMaj) ? 'rien' : 'mineure';
      const valeur = niveau === 'majeure' ? EV.majeure : niveau === 'mineure' ? EV.mineureMin + f.suivant() * (EV.mineureMax - EV.mineureMin) : 0;
      const estimee = Math.max(0, valeur + f.normale(0, bruit));
      creer({
        ecurie: p.ecurie, projet: p.id, famille: 'piste', options: ['refuser', 'explorer', 'explorer_soufflerie'],
        recommandation: estimee >= 0.4 ? 'explorer' : 'refuser',
        texte: `${texte} (Estimation du responsable : ${estimee < 0.2 ? 'peu de chose' : estimee < 1 ? 'un petit gain possible' : 'un gain sensible possible'}.)`,
        verite: { niveau, valeur: r2(valeur), estimee: r2(estimee) },
      });
      break;
    }
    case 'contradiction': {
      const cfdJuste = f.chance(0.4 + (0.4 * pers.correlation) / 20);
      creer({
        ecurie: p.ecurie, projet: p.id, famille: 'contradiction', options: ['verifier', 'prudence', 'poursuivre'],
        recommandation: pers.correlation >= 15 ? 'poursuivre' : 'verifier', texte,
        verite: { cfdJuste, revelation: r2(0.6 + (0.3 * pers.correlation) / 20), perte: r2(f.suivant() * EV.facteurErreurMax) },
      });
      break;
    }
    case 'materiau': {
      const fragile = f.chance(0.45 - (0.2 * pers.rigueur) / 20);
      creer({ ecurie: p.ecurie, projet: p.id, famille: 'materiau', options: ['tenter', 'essais', 'conserver'], recommandation: 'essais', texte, verite: { fragile } });
      break;
    }
    case 'reorientation': {
      const alt = meilleurConceptAlt(p);
      const estime = alt.gain + f.normale(0, bruit * 0.05);
      creer({
        ecurie: p.ecurie, projet: p.id, famille: 'reorientation', options: ['maintenir', 'reorienter'],
        recommandation: estime > EV.gainReorientationMin ? 'reorienter' : 'maintenir',
        texte: `${texte} (Orientation envisagée : ${alt.concept > p.concept ? PIECES[type].conceptPlus : PIECES[type].conceptMoins}.)`,
        verite: { concept: alt.concept, gain: r2(alt.gain), estime: r2(estime) },
      });
      break;
    }
  }
}

/** Effets d'un choix (vérité fixée à la création). Renvoie un résumé pour le fait. */
export function appliquerChoixEvenement(monde: Monde, d: DilemmeTechnique, p: ProjetConception, option: string): string {
  const v = d.verite;
  const apprendreDomaines = (x: number) => {
    const r = reglementEnVigueur(monde)?.id;
    for (const dom of PIECES[p.type as TypePiece].domaines) {
      const s = savoir(monde, p.ecurie, dom);
      if (r) s.parReglement[r] = r2((s.parReglement[r] ?? 0) + x * (1 - SAVOIR.partFondamental));
      s.fondamental = r2(s.fondamental + x * (r ? SAVOIR.partFondamental : 1));
    }
  };
  switch (d.famille) {
    case 'piste': {
      if (option === 'refuser') return 'piste écartée';
      depenser(monde, p.ecurie, EV.exploreMEUR);
      p.joursRestants += EV.exploreJours;
      const capture = option === 'explorer_soufflerie' ? 1 : EV.captureSimple;
      if (option === 'explorer_soufflerie') p.heures = r2((p.heures ?? 0) + SOUFFLERIE.heuresValidation);
      const valeur = Number(v['valeur']);
      p.bonusEfficacite = r2((p.bonusEfficacite ?? 0) + valeur * capture);
      if (v['niveau'] === 'majeure') apprendreDomaines(EV.savoirMajeure);
      else if (v['niveau'] === 'rien') apprendreDomaines(EV.savoirRien);
      return v['niveau'] === 'majeure' ? 'avancée majeure' : v['niveau'] === 'mineure' ? 'avancée mineure' : 'fausse piste';
    }
    case 'contradiction': {
      if (option === 'prudence') { p.facteurGain = r2((p.facteurGain ?? 1) * EV.facteurPrudence); return 'prudence'; }
      if (option === 'verifier') {
        depenser(monde, p.ecurie, EV.verifierMEUR);
        p.joursRestants += EV.verifierJours;
        if (tirageLocal(monde, 'monoplaces.evenement.verification', d.id).chance(Number(v['revelation']))) { apprendreDomaines(EV.savoirRien); return 'vérité établie'; }
      }
      if (!v['cfdJuste']) { p.facteurGain = r2((p.facteurGain ?? 1) * Number(v['perte'])); return 'erreur non détectée'; }
      return 'CFD confirmée';
    }
    case 'materiau': {
      if (option === 'conserver') return 'solution éprouvée conservée';
      if (option === 'essais') {
        depenser(monde, p.ecurie, EV.essaisMEUR);
        p.joursRestants += EV.essaisJours;
        if (v['fragile']) return 'matériau écarté après essais';
        p.bonusEfficacite = r2((p.bonusEfficacite ?? 0) + EV.gainMateriau);
        return 'matériau validé';
      }
      p.bonusEfficacite = r2((p.bonusEfficacite ?? 0) + EV.gainMateriau);
      if (v['fragile']) p.defaut = { type: 'fragile', ampleur: 1 };
      return v['fragile'] ? 'matériau fragile (non détecté)' : 'pari gagné';
    }
    case 'reorientation': {
      if (option === 'maintenir') return 'concept maintenu';
      p.concept = Number(v['concept']);
      p.joursRestants += EV.reorienterJours;
      return 'concept réorienté';
    }
  }
  return '';
}

/** Choix de l'IA (et du directeur technique délégué) : à partir de l'estimation de son responsable, de son goût du risque et de son budget. */
export function choixEvenementIA(monde: Monde, d: DilemmeTechnique): string {
  const e = table(monde, TABLES.ecuries)[d.ecurie] as unknown as Ecurie;
  const p = table(monde, TABLES.projetsConception)[d.projet] as unknown as ProjetConception | undefined;
  const pole = p ? (PIECES[p.type as TypePiece].pole as Pole) : 'aero';
  const pers = personnel(monde, e.id, pole);
  const argent = enveloppeRestante(monde, e.id) > 2;
  switch (d.famille) {
    case 'piste': return Number(d.verite['estimee']) >= 0.4 && argent ? (pers.risque >= 12 ? 'explorer_soufflerie' : 'explorer') : 'refuser';
    case 'contradiction': return argent ? d.recommandation : pers.risque >= 14 ? 'poursuivre' : 'prudence';
    case 'materiau': return argent ? 'essais' : pers.risque >= 14 ? 'tenter' : 'conserver';
    default: return d.recommandation;
  }
}
