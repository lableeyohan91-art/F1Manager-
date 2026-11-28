/**
 * Phase 13d (fiche docs/systemes/phase-13d-decisions-en-course.md) — le stratège de chaque écurie (son directeur sportif) : style de
 * décision en course (choisi par le joueur avec la commande `course.style`, sinon selon la personnalité) et qualité (compétence
 * stratégie). Les décisions elles-mêmes sont prises tour par tour dans course-piste.ts, avec la même règle pour toutes les écuries.
 */
import { STRATEGE, STYLES_STRATEGIE } from '../../balance/course';
import type { DefinitionCommande } from '../../core/commandes';
import { ajouterEvenement } from '../../core/evenements';
import { table, type Monde } from '../../core/monde';
import { TABLES, type Ecurie, type Personne, type StyleStrategie } from '../../model/types';

export function directeurSportif(monde: Monde, idEcurie: string): Personne | undefined {
  return (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).find((p) => p.statut === 'actif' && p.ecurie === idEcurie && p.poste === 'directeur_sportif');
}

export interface Stratege { style: StyleStrategie; lecture: number; facteurEstimation: number; delaiMeteo: number }

/** Style et qualité du stratège d'une écurie. */
export function stratege(monde: Monde, e: Ecurie): Stratege {
  const ds = directeurSportif(monde, e.id);
  const S = STRATEGE, comp = ds?.competences['strategie'] ?? S.defaut, risque = ds?.traits['risque'] ?? S.defaut;
  const style: StyleStrategie = e.styleStrategie ?? (risque >= S.offensifRisque ? 'offensif' : risque <= S.prudentRisque ? 'prudent' : 'equilibre');
  const d = comp - S.reference;
  return {
    style,
    lecture: Math.min(S.lectureMax, Math.max(S.lectureMin, S.lectureBase + S.lectureParPoint * d)),
    facteurEstimation: Math.min(S.estimationMax, Math.max(S.estimationMin, 1 - S.estimationParPoint * d)),
    delaiMeteo: STYLES_STRATEGIE[style].meteoDelai - S.meteoParPoint * d,
  };
}

/** Phase 13d : style de stratégie en course de l'écurie (joueur ; l'IA suit la personnalité de son directeur sportif). */
export const commandeStyleStrategie: DefinitionCommande = {
  type: 'course.style',
  valider(monde, c) {
    const e = table(monde, TABLES.ecuries)[String(c.parametres['ecurie'] ?? '')] as unknown as Ecurie | undefined;
    if (!e || e.statut !== 'active') return 'Écurie inconnue.';
    const a = table(monde, TABLES.personnes)[c.auteur] as unknown as Personne | undefined;
    if (!a || a.statut !== 'actif' || a.ecurie !== e.id || !['team_principal', 'directeur_sportif'].includes(a.poste ?? '')) return 'Seuls le team principal et le directeur sportif fixent le style de stratégie.';
    if (!['prudent', 'equilibre', 'offensif'].includes(String(c.parametres['style']))) return 'Style : prudent, équilibré ou offensif.';
    return null;
  },
  appliquer({ monde }, c) {
    const e = table(monde, TABLES.ecuries)[String(c.parametres['ecurie'])] as unknown as Ecurie;
    const avant = e.styleStrategie ?? null;
    e.styleStrategie = c.parametres['style'] as StyleStrategie;
    ajouterEvenement(monde, { type: 'course.style', acteurs: [{ id: e.id, role: 'ecurie' }, { id: c.auteur, role: 'decideur' }], importance: 1, visibilite: 'prive', contexte: { avant, apres: e.styleStrategie } });
  },
};
