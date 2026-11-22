/**
 * État émotionnel (couche 5) : recalculé chaque mois, jamais modifié directement par une décision
 * (sauf les petits effets immédiats d'une interaction sur la confiance en soi).
 * - moral : bilan de tous les souvenirs actifs ;
 * - confiance en soi : soutiens et reconnaissances contre humiliations, critiques et échecs personnels ;
 * - motivation : suit le moral ;
 * - stress : pression médiatique de l'écurie.
 * Effets : la confiance en soi agit sur la forme en course ; la motivation du personnel technique agit
 * sur la capacité de développement (cascade de référence, phase 4).
 */

import { idsTries, table, type Monde } from '../../core/monde';
import type { Systeme } from '../../core/moteur';
import { TABLES, type Ecurie, type Personne } from '../../model/types';
import { indexSouvenirs, type Souvenir } from '../memoire';

/** Part du chemin parcourue chaque mois vers la valeur cible (inertie de l'état émotionnel). */
const INERTIE = 0.25;
/** Bilan des souvenirs donnant un moral à ~75 % de son écart maximal (plus petit = plus sensible). Calibré le 22/11/2026. */
const SENSIBILITE_MORAL = 0.8;
/** Points de motivation par point de moral au-dessus ou en dessous de 65. */
const LIEN_MORAL_MOTIVATION = 1.0;
const ETIQUETTES_CONFIANCE: Record<string, number> = {
  soutien: 1, reconnaissance: 0.6, gratitude: 0.5, reussite_commune: 0.5, excuses_recues: 0.3,
  humiliation: -1, critique_dure: -0.6, manque_respect: -0.5, echec_personnel: -0.8, trahison: -0.5, critique_constructive: 0.1,
};

const borner = (x: number) => Math.max(0, Math.min(100, x));

export function mettreAJourEtat(monde: Monde, p: Personne, souvenirs: Souvenir[]): void {
  let bilan = 0, confiance = 0;
  for (const s of souvenirs) {
    bilan += s.ressenti * s.intensite;
    confiance += (ETIQUETTES_CONFIANCE[s.etiquette] ?? 0) * s.intensite;
  }
  const moralCible = 65 + 30 * Math.tanh(bilan / SENSIBILITE_MORAL);
  const confianceCible = 65 + 25 * Math.tanh(confiance / 1.2);
  p.etat.moral = Math.round(borner(p.etat.moral + INERTIE * (moralCible - p.etat.moral)));
  p.etat.confiance = Math.round(borner(p.etat.confiance + INERTIE * (confianceCible - p.etat.confiance)));
  p.etat.motivation = Math.round(borner(p.etat.motivation + INERTIE * (60 + LIEN_MORAL_MOTIVATION * (p.etat.moral - 65) - p.etat.motivation)));
  const ecurie = table(monde, TABLES.ecuries)[p.ecurie] as unknown as Ecurie | undefined;
  const pression = ecurie ? ecurie.pressionMediatique * 2.5 : 20;
  const sangFroid = p.traits['sangFroid'] ?? 10;
  p.etat.stress = Math.round(borner(p.etat.stress + INERTIE * (pression * (1.3 - sangFroid / 20) + 20 - p.etat.stress)));
}

export const systemeEtat: Systeme = {
  nom: 'humain.etat',
  executer({ monde, date }) {
    if (date.semaine % 4 !== 1) return;
    const t = table(monde, TABLES.personnes);
    const index = indexSouvenirs(monde);
    for (const id of idsTries(t)) {
      const p = t[id] as unknown as Personne;
      if (p.statut !== 'retraite') mettreAJourEtat(monde, p, index.get(p.id) ?? []);
    }
  },
};
