/** Stockage des sauvegardes en fichier, compressées (gzip). Plateforme Node : lanceur sans écran et tests. */

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { gunzipSync, gzipSync } from 'node:zlib';
import { deserialiser, serialiser, type Monde } from '../../engine';

export function compresser(texte: string): Buffer {
  return gzipSync(Buffer.from(texte, 'utf8'), { level: 9 });
}

export function decompresser(donnees: Buffer): string {
  return gunzipSync(donnees).toString('utf8');
}

/** Écrit la sauvegarde ; renvoie sa taille compressée en octets. */
export function ecrireSauvegarde(chemin: string, monde: Monde): number {
  const octets = compresser(serialiser(monde));
  mkdirSync(dirname(chemin), { recursive: true });
  // Audit n°4 : la sauvegarde précédente devient la sauvegarde de secours, avant d'être remplacée.
  if (existsSync(chemin)) copyFileSync(chemin, `${chemin}.secours`);
  writeFileSync(chemin, octets);
  return octets.length;
}

export function lireSauvegarde(chemin: string): Monde {
  return deserialiser(decompresser(readFileSync(chemin)));
}

/** Lit la sauvegarde ; si elle est illisible ou incohérente, se rabat sur la sauvegarde de secours en le signalant. */
export function lireSauvegardeAvecSecours(chemin: string): { monde: Monde; depuisSecours: boolean; erreur?: string } {
  try {
    return { monde: lireSauvegarde(chemin), depuisSecours: false };
  } catch (e) {
    const erreur = e instanceof Error ? e.message : String(e);
    if (!existsSync(`${chemin}.secours`)) throw e;
    return { monde: lireSauvegarde(`${chemin}.secours`), depuisSecours: true, erreur };
  }
}
