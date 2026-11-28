/**
 * Phase 13e (fiche docs/systemes/phase-13e-course-en-direct.md) — ordres du joueur pendant la course regardée en direct. Ils sont gardés
 * dans le Grand Prix et rejoués par la course elle-même : l'aperçu tour par tour et le résultat final sont le même calcul.
 */
import type { DefinitionCommande } from '../../core/commandes';
import { ajouterEvenement } from '../../core/evenements';
import { table, type Monde } from '../../core/monde';
import { TABLES, type Circuit, type Ecurie, type GrandPrix, type OrdreCourse, type Personne } from '../../model/types';
import { toursCourse } from './course-tours';

const COMPOSES_ORDRE = ['tendre', 'moyen', 'dur', 'pluie'];
const NIVEAUX = ['agressive', 'neutre', 'conservatrice'];

export function motifRefusOrdre(monde: Monde, auteur: string, prm: Record<string, unknown>): string | null {
  const gp = table(monde, TABLES.grandsPrix)[String(prm['grandPrix'] ?? '')] as unknown as GrandPrix | undefined;
  if (!gp || gp.termine) return 'Grand Prix inconnu ou déjà couru.';
  const e = table(monde, TABLES.ecuries)[String(prm['ecurie'] ?? '')] as unknown as Ecurie | undefined;
  if (!e || e.statut !== 'active') return 'Écurie inconnue.';
  const a = table(monde, TABLES.personnes)[auteur] as unknown as Personne | undefined;
  if (!a || a.statut !== 'actif' || a.ecurie !== e.id || !['team_principal', 'directeur_sportif'].includes(a.poste ?? '')) return 'Seuls le team principal et le directeur sportif donnent des ordres en course.';
  const p = table(monde, TABLES.personnes)[String(prm['pilote'] ?? '')] as unknown as Personne | undefined;
  if (!p || p.ecurie !== e.id || p.poste !== 'pilote_titulaire') return 'Pilote titulaire inconnu dans cette écurie.';
  const tours = toursCourse(table(monde, TABLES.circuits)[gp.circuit] as unknown as Circuit);
  const tour = Number(prm['tour']);
  if (!Number.isInteger(tour) || tour < 1 || tour > tours) return `Tour entre 1 et ${tours}.`;
  if (prm['arret'] !== undefined && !COMPOSES_ORDRE.includes(String(prm['arret']))) return 'Pneus : tendre, moyen, dur ou pluie.';
  const consignes = (prm['consignes'] ?? {}) as Record<string, unknown>;
  for (const [k, v] of Object.entries(consignes)) if (!['conduite', 'pneus', 'batterie', 'carburant'].includes(k) || !NIVEAUX.includes(String(v))) return 'Consigne inconnue.';
  if (prm['arret'] === undefined && !Object.keys(consignes).length) return 'Ordre vide.';
  return null;
}

/** Phase 13e : ordre en direct (arrêt au stand ou consignes), appliqué au début du tour indiqué. */
export const commandeOrdreCourse: DefinitionCommande = {
  type: 'course.ordre',
  valider: (monde, c) => motifRefusOrdre(monde, c.auteur, c.parametres),
  appliquer({ monde }, c) {
    const gp = table(monde, TABLES.grandsPrix)[String(c.parametres['grandPrix'])] as unknown as GrandPrix;
    const o: OrdreCourse = { tour: Number(c.parametres['tour']), pilote: String(c.parametres['pilote']) };
    if (c.parametres['arret'] !== undefined) o.arret = c.parametres['arret'] as OrdreCourse['arret'];
    const consignes = c.parametres['consignes'] as OrdreCourse['consignes'] | undefined;
    if (consignes && Object.keys(consignes).length) o.consignes = consignes;
    (gp.direct ??= { ordres: [] }).ordres.push(o);
    ajouterEvenement(monde, {
      type: 'course.ordre', acteurs: [{ id: String(c.parametres['ecurie']), role: 'ecurie' }, { id: o.pilote, role: 'pilote' }, { id: c.auteur, role: 'decideur' }],
      importance: 1, visibilite: 'prive', contexte: { grandPrix: gp.id, tour: o.tour, ...(o.arret ? { arret: o.arret } : {}), ...(o.consignes ?? {}) },
    });
  },
};
