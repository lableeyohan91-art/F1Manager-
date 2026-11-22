/**
 * Potentiel estimé (phase 6a §6) : personne ne lit le vrai potentiel, sauf la formule de progression.
 * Chaque écurie s'en fait une idée en fourchette, plus ou moins juste selon :
 * - la jeunesse de la personne (un jeune est difficile à juger) ;
 * - le temps d'observation (saisons d'activité visibles, présence dans l'écurie) ;
 * - le niveau de son département recrutement, et son biais propre (optimiste ou pessimiste).
 * L'estimation est recalculée à la demande, de façon déterministe (tirage local par écurie, personne et année) :
 * aucune table à stocker, donc pas de volume à borner. Les missions de repérage (à concevoir) resserreront la fourchette.
 */

import { ESTIMATION } from '../../balance/carriere';
import { tirageLocal } from '../../core/moteur';
import { table, type Monde } from '../../core/monde';
import { TABLES, type Departement, type Personne } from '../../model/types';
import { niveauCarriere } from './profil';

const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));

export interface PotentielEstime { centre: number; demiLargeur: number }

/**
 * Estimation du potentiel de `p` par l'écurie `idEcurie`.
 * `null` = l'opinion du paddock (valeur de marché) : pas de département ni de biais d'écurie.
 */
export function potentielEstime(monde: Monde, idEcurie: string | null, p: Personne): PotentielEstime {
  const age = monde.date.annee - p.anneeNaissance;
  const t = borner((age - ESTIMATION.ageJeune) / (ESTIMATION.ageVeteran - ESTIMATION.ageJeune), 0, 1);
  const base = ESTIMATION.demiLargeurJeune + t * (ESTIMATION.demiLargeurVeteran - ESTIMATION.demiLargeurJeune);
  const dep = idEcurie
    ? (Object.values(table(monde, TABLES.departements)) as unknown as Departement[]).find((d) => d.ecurie === idEcurie && d.type === 'recrutement')
    : undefined;
  const niveauDep = dep?.niveauMoyen ?? 10;
  // Phase 6b : les saisons juniors comptent comme du temps d'observation.
  const observees = (p.carriere?.saisonsActives ?? 0) + (p.carriere?.juniors?.length ?? 0) + (idEcurie && p.ecurie === idEcurie ? 2 : 0);
  const demiLargeur = (base * (ESTIMATION.max - ESTIMATION.amplitude * (niveauDep / 20))) / (1 + ESTIMATION.observation * observees);
  const biais = dep ? tirageLocal(monde, 'recrutement.biais', dep.id).normale(0, ESTIMATION.biaisDepartement) : 0;
  const erreur = tirageLocal(monde, 'recrutement.estimation', idEcurie ?? 'paddock', p.id, monde.date.annee).normale(0, demiLargeur / 2);
  // On ne peut pas estimer un potentiel inférieur à ce que la personne montre déjà.
  const centre = borner(Math.max(niveauCarriere(p), p.potentiel + biais + erreur), 1, 20);
  return { centre: Math.round(centre * 10) / 10, demiLargeur: Math.round(demiLargeur * 10) / 10 };
}
