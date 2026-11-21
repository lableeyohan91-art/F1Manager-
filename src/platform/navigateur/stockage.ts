/**
 * Stockage des sauvegardes dans le navigateur : IndexedDB, compression gzip native (CompressionStream).
 * Hors du moteur. Utilisé par l'interface à partir de la phase 2.
 */

import { deserialiser, serialiser, type Monde } from '../../engine';

const BASE = 'f1manager';
const MAGASIN = 'sauvegardes';

async function compresser(texte: string): Promise<Blob> {
  const flux = new Blob([texte]).stream().pipeThrough(new CompressionStream('gzip'));
  return new Response(flux).blob();
}

async function decompresser(blob: Blob): Promise<string> {
  const flux = blob.stream().pipeThrough(new DecompressionStream('gzip'));
  return new Response(flux).text();
}

function ouvrir(): Promise<IDBDatabase> {
  return new Promise((resoudre, rejeter) => {
    const req = indexedDB.open(BASE, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(MAGASIN);
    req.onsuccess = () => resoudre(req.result);
    req.onerror = () => rejeter(req.error);
  });
}

export async function enregistrer(nom: string, monde: Monde): Promise<number> {
  const blob = await compresser(serialiser(monde));
  const db = await ouvrir();
  await new Promise<void>((resoudre, rejeter) => {
    const tx = db.transaction(MAGASIN, 'readwrite');
    tx.objectStore(MAGASIN).put(blob, nom);
    tx.oncomplete = () => resoudre();
    tx.onerror = () => rejeter(tx.error);
  });
  return blob.size;
}

export async function charger(nom: string): Promise<Monde | null> {
  const db = await ouvrir();
  const blob = await new Promise<Blob | undefined>((resoudre, rejeter) => {
    const req = db.transaction(MAGASIN).objectStore(MAGASIN).get(nom);
    req.onsuccess = () => resoudre(req.result as Blob | undefined);
    req.onerror = () => rejeter(req.error);
  });
  return blob ? deserialiser(await decompresser(blob)) : null;
}

/** Exporte une sauvegarde en fichier téléchargeable (.sav). */
export async function exporter(monde: Monde): Promise<Blob> {
  return compresser(serialiser(monde));
}

export async function importer(fichier: Blob): Promise<Monde> {
  return deserialiser(await decompresser(fichier));
}
