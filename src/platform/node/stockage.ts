/** Stockage des sauvegardes en fichier, compressées (gzip). Plateforme Node : lanceur sans écran et tests. */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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
  writeFileSync(chemin, octets);
  return octets.length;
}

export function lireSauvegarde(chemin: string): Monde {
  return deserialiser(decompresser(readFileSync(chemin)));
}
