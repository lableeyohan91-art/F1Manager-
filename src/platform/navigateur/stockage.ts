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

const SECOURS = '::secours';

async function lisible(blob: Blob): Promise<boolean> {
  try { deserialiser(await decompresser(blob)); return true; } catch { return false; }
}

/** Une sauvegarde existe-t-elle sous ce nom (principale ou secours) ? */
export async function existe(nom: string): Promise<boolean> {
  const db = await ouvrir();
  return !!(await lireBlob(db, nom)) || !!(await lireBlob(db, nom + SECOURS));
}

/** Audit de la phase 10 : copie une sauvegarde sous un autre nom (partie remplacée conservée, récupérable). */
export async function copier(de: string, vers: string): Promise<boolean> {
  const db = await ouvrir();
  const blob = await lireBlob(db, de);
  if (!blob) return false;
  await new Promise<void>((resoudre, rejeter) => {
    const tx = db.transaction(MAGASIN, 'readwrite');
    tx.objectStore(MAGASIN).put(blob, vers);
    tx.oncomplete = () => resoudre();
    tx.onerror = () => rejeter(tx.error);
  });
  return true;
}

export async function enregistrer(nom: string, monde: Monde): Promise<number> {
  const blob = await compresser(serialiser(monde));
  const db = await ouvrir();
  const precedent = await lireBlob(db, nom);
  // Audit de la phase 10 : une sauvegarde principale illisible ne remplace jamais une sauvegarde de secours valide.
  const precedentLisible = precedent ? await lisible(precedent) : false;
  await new Promise<void>((resoudre, rejeter) => {
    const tx = db.transaction(MAGASIN, 'readwrite');
    // Audit n°4 : la sauvegarde précédente devient la sauvegarde de secours (même transaction).
    if (precedent && precedentLisible) tx.objectStore(MAGASIN).put(precedent, nom + SECOURS);
    tx.objectStore(MAGASIN).put(blob, nom);
    tx.oncomplete = () => resoudre();
    tx.onerror = () => rejeter(tx.error);
  });
  return blob.size;
}

function lireBlob(db: IDBDatabase, nom: string): Promise<Blob | undefined> {
  return new Promise<Blob | undefined>((resoudre, rejeter) => {
    const req = db.transaction(MAGASIN).objectStore(MAGASIN).get(nom);
    req.onsuccess = () => resoudre(req.result as Blob | undefined);
    req.onerror = () => rejeter(req.error);
  });
}

export async function charger(nom: string): Promise<Monde | null> {
  const db = await ouvrir();
  const blob = await lireBlob(db, nom);
  return blob ? deserialiser(await decompresser(blob)) : null;
}

/** Charge la sauvegarde ; si elle est illisible ou incohérente, se rabat sur la sauvegarde de secours en le signalant. */
export async function chargerAvecSecours(nom: string): Promise<{ monde: Monde; depuisSecours: boolean; erreur?: string } | null> {
  try {
    const monde = await charger(nom);
    return monde ? { monde, depuisSecours: false } : null;
  } catch (e) {
    const db = await ouvrir();
    const secours = await lireBlob(db, nom + SECOURS);
    if (!secours) throw e;
    return { monde: deserialiser(await decompresser(secours)), depuisSecours: true, erreur: e instanceof Error ? e.message : String(e) };
  }
}

/** Exporte une sauvegarde en fichier téléchargeable (.sav). */
export async function exporter(monde: Monde): Promise<Blob> {
  return compresser(serialiser(monde));
}

export async function importer(fichier: Blob): Promise<Monde> {
  return deserialiser(await decompresser(fichier));
}
