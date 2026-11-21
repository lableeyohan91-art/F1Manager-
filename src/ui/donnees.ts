/** Données embarquées dans le site : fichiers CSV de data/ (lus au moment de la construction). */
import type { FichiersDonnees } from '../engine';

const bruts = import.meta.glob('/data/{grille-2026,commun}/*.csv', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export function fichiersGrille2026(): FichiersDonnees {
  const res: FichiersDonnees = {};
  for (const [chemin, texte] of Object.entries(bruts)) res[chemin.split('/').pop() as string] = texte;
  return res;
}
