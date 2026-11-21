/**
 * Identifiants uniques et permanents (voir docs/systemes/entites.md).
 * Forme : <préfixe>_<numéro sur 6 chiffres>, par ex. per_000412. Jamais réutilisés.
 * Les identifiants issus des fichiers de données (ex. eq_ferrari) sont aussi acceptés :
 * seuls les identifiants créés par le moteur suivent la numérotation.
 */

import type { Monde } from './monde';

const PREFIXE_VALIDE = /^[a-z]{2,4}$/;

export function nouvelIdentifiant(monde: Monde, prefixe: string): string {
  if (!PREFIXE_VALIDE.test(prefixe)) throw new Error(`Préfixe d'identifiant invalide : « ${prefixe} »`);
  const n = (monde.compteurs[prefixe] ?? 0) + 1;
  monde.compteurs[prefixe] = n;
  return `${prefixe}_${String(n).padStart(6, '0')}`;
}
