/**
 * Phase 12b — dilemmes techniques (fiche compagnon §3, §4, §7 ; D-170 Q4, Q10) : alertes des responsables (nées d'un état réellement
 * simulé : fatigue, défaut caché) et événements de conception. La vérité est fixée à la création ; le choix change les moyens engagés
 * et ce qu'on en capture. Pour le joueur qui ne délègue pas la recherche, le dilemme bloque le temps (D-168, D-170 Q10) ; pour l'IA et le
 * directeur technique délégué, il est tranché tout de suite, avec la même information.
 */

import { ALERTES, PIECES, SOUFFLERIE, type TypePiece } from '../../balance/monoplaces';
import type { DefinitionCommande } from '../../core/commandes';
import { ajouterSemaines, rangSemaine } from '../../core/calendrier';
import { ajouterEvenement } from '../../core/evenements';
import { idsTries, table, type Entite, type Monde } from '../../core/monde';
import { tirageLocal } from '../../core/moteur';
import { TABLES, type DilemmeTechnique, type Ecurie, type Personne, type ProjetConception } from '../../model/types';
import { fatiguePole, fraicheur, probaIncident, type Pole } from './fatigue';
import { appliquerChoixEvenement, choixEvenementIA } from './evenements';
import { depenser, enveloppeRestante } from './depenses';

const ecurieDe = (m: Monde, id: string) => table(m, TABLES.ecuries)[id] as unknown as Ecurie | undefined;
const projetDe = (m: Monde, id: string) => table(m, TABLES.projetsConception)[id] as unknown as ProjetConception | undefined;

export const dilemmes = (monde: Monde, idEcurie?: string) => idsTries(table(monde, TABLES.dilemmesTechniques))
  .map((id) => table(monde, TABLES.dilemmesTechniques)[id] as unknown as DilemmeTechnique).filter((d) => !idEcurie || d.ecurie === idEcurie);

/** L'écurie décide-t-elle elle-même (IA, ou recherche déléguée au directeur technique) ? */
export const decideSeule = (e: Ecurie) => !e.pilotee || !!e.delegationRecherche;

/** Responsable d'un pôle (alertes, stress). */
export function responsable(monde: Monde, idEcurie: string, pole: Pole): Personne | undefined {
  const poste = pole === 'aero' ? 'responsable_aero' : 'responsable_conception';
  return (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).find((p) => p.statut === 'actif' && p.ecurie === idEcurie && p.poste === poste);
}

/** Ajoute du stress (existant, humain/etat.ts) au responsable du pôle. */
export function stresser(monde: Monde, idEcurie: string, pole: Pole, x: number): void {
  const r = responsable(monde, idEcurie, pole);
  if (r) r.etat.stress = Math.round(Math.min(100, r.etat.stress + x));
}

/** Crée un dilemme ; une écurie qui décide seule le tranche aussitôt, sinon il attend le joueur (bloquant). */
export function creerDilemme(monde: Monde, d: Omit<DilemmeTechnique, 'id' | 'cree' | 'echeance'>): DilemmeTechnique {
  const id = `dil_${d.projet}_${d.famille}_${rangSemaine(monde.date)}`;
  const dil: DilemmeTechnique = { ...d, id, cree: { ...monde.date }, echeance: ajouterSemaines(monde.date, ALERTES.echeanceSemaines) };
  table(monde, TABLES.dilemmesTechniques)[id] = dil as unknown as Entite;
  ajouterEvenement(monde, {
    type: 'conception.dilemme', acteurs: [{ id: d.ecurie, role: 'ecurie' }], importance: 2, visibilite: 'prive',
    contexte: { dilemme: id, famille: d.famille, projet: d.projet, options: d.options, recommandation: d.recommandation }, texte: d.texte,
  });
  const e = ecurieDe(monde, d.ecurie);
  if (e && decideSeule(e)) resoudre(monde, dil, choixIA(monde, dil), 'ia');
  return dil;
}

function choixIA(monde: Monde, d: DilemmeTechnique): string {
  if (d.famille !== 'alerte') return choixEvenementIA(monde, d);
  // Une vérification se paie sur l'enveloppe de l'année : sans argent, on ralentit (aucun dépassement involontaire du plafond).
  return d.recommandation === 'verifier' && enveloppeRestante(monde, d.ecurie) < ALERTES.verificationMEUR ? 'ralentir' : d.recommandation;
}

/** Applique un choix et clôt le dilemme. */
export function resoudre(monde: Monde, d: DilemmeTechnique, option: string, auteur: string): void {
  delete table(monde, TABLES.dilemmesTechniques)[d.id];
  const p = projetDe(monde, d.projet);
  let detail = '';
  if (p) {
    const pole = PIECES[p.type as TypePiece].pole as Pole;
    if (d.famille === 'alerte') {
      if (option === 'ralentir') { p.rythme = 'allege'; detail = 'rythme allégé'; }
      else if (option === 'verifier') {
        depenser(monde, p.ecurie, ALERTES.verificationMEUR);
        p.joursRestants += ALERTES.verificationJours;
        // Chance de trouver un défaut : vérification de l'équipe (fraîcheur) et heures de soufflerie déjà passées sur le projet.
        const chance = 1 - (1 - ALERTES.detectionVerification * fraicheur(fatiguePole(monde, p.ecurie, pole))) * Math.exp(-(p.heures ?? 0) / SOUFFLERIE.heuresDetection);
        if (p.defaut && tirageLocal(monde, 'monoplaces.verification', p.id, rangSemaine(monde.date)).chance(chance)) { delete p.defaut; detail = 'défaut trouvé et corrigé'; }
        else detail = p.defaut ? 'rien trouvé' : 'rien à signaler';
      } else { stresser(monde, p.ecurie, pole, ALERTES.stressMaintien); detail = 'calendrier maintenu'; }
    } else detail = appliquerChoixEvenement(monde, d, p, option);
  }
  ajouterEvenement(monde, {
    type: 'conception.choix', acteurs: [{ id: d.ecurie, role: 'ecurie' }, ...(auteur !== 'ia' ? [{ id: auteur, role: 'auteur' }] : [])], importance: 1, visibilite: 'prive',
    contexte: { dilemme: d.id, famille: d.famille, option, detail, delegue: auteur === 'ia' },
  });
}

/** Sans réponse à l'échéance (outils, simulations), la recommandation du responsable s'applique. */
export function echeancesDilemmes(monde: Monde): void {
  const maintenant = rangSemaine(monde.date);
  for (const d of dilemmes(monde)) if (rangSemaine(d.echeance) <= maintenant) resoudre(monde, d, d.recommandation, 'ia');
}

const TEXTES_ALERTE = [
  'Chef, l’équipe est surmenée. Les derniers essais montrent des résultats incohérents et je commence à craindre un problème sur notre nouveau {piece}.',
  'Chef, on enchaîne les semaines difficiles. Je ne suis plus sûr de la fiabilité de nos calculs sur le {piece}.',
  'Chef, quelque chose cloche sur le {piece} : les chiffres ne collent pas. Je préférerais vérifier avant la fabrication.',
];

/**
 * Alerte du responsable (une par projet et par pôle au plus, à intervalles) : il perçoit le risque réel (défaut caché, incidents à venir)
 * avec une erreur qui dépend de sa corrélation, de sa rigueur, de sa propre fatigue et de son stress. Il peut crier au loup ou se taire.
 */
export function alertesResponsables(monde: Monde, p: ProjetConception): void {
  if (p.fabricationJoursRestants !== undefined || dilemmes(monde).some((d) => d.projet === p.id)) return;
  const pole = PIECES[p.type as TypePiece].pole as Pole;
  const maintenant = rangSemaine(monde.date);
  if (p.derniereAlerte !== undefined && maintenant - p.derniereAlerte < ALERTES.delaiProjetSemaines) return;
  const dep = (Object.values(table(monde, TABLES.departements)) as unknown as { ecurie: string; type: string; derniereAlerte?: number }[]).find((x) => x.ecurie === p.ecurie && x.type === pole);
  if (dep?.derniereAlerte !== undefined && maintenant - dep.derniereAlerte < ALERTES.delaiPoleSemaines) return;
  const f = fatiguePole(monde, p.ecurie, pole);
  const resp = responsable(monde, p.ecurie, pole);
  const semaines = Math.max(1, p.joursRestants / 7);
  const reel = p.defaut ? 0.6 : Math.min(0.6, probaIncident(f) * semaines);
  const sigma = ALERTES.bruitBase - (ALERTES.bruitCompetence * ((resp?.competences['correlation'] ?? 10) + (resp?.competences['rigueur'] ?? 10))) / 40 + f / 200 + (resp?.etat.stress ?? 30) / 300;
  const t = tirageLocal(monde, 'monoplaces.alerte', p.id, maintenant);
  const percu = reel * Math.exp(t.normale(0, Math.max(0.05, sigma)));
  if (percu < ALERTES.seuil) return;
  p.derniereAlerte = maintenant;
  if (dep) dep.derniereAlerte = maintenant;
  const piece = PIECES[p.type as TypePiece].libelle.toLowerCase();
  creerDilemme(monde, {
    ecurie: p.ecurie, projet: p.id, famille: 'alerte', options: ['ralentir', 'verifier', 'maintenir'],
    recommandation: percu > 2 * ALERTES.seuil ? 'verifier' : 'ralentir',
    texte: TEXTES_ALERTE[t.entier(0, TEXTES_ALERTE.length - 1)]!.replace('{piece}', piece),
    verite: { defaut: !!p.defaut, risque: Math.round(reel * 100) / 100 },
  });
}
