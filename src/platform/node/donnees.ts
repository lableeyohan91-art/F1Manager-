/** Lecture des fichiers de données sur le disque (lanceur sans écran, tests). */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { FichiersDonnees } from '../../engine';

export function lireDossiers(...dossiers: string[]): FichiersDonnees {
  const res: FichiersDonnees = {};
  for (const d of dossiers) {
    for (const nom of readdirSync(d)) if (nom.endsWith('.csv')) res[nom] = readFileSync(join(d, nom), 'utf8');
  }
  return res;
}

export function lireDonneesGrille2026(racine = '.'): FichiersDonnees {
  return lireDossiers(join(racine, 'data/grille-2026'), join(racine, 'data/commun'));
}
