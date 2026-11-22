/**
 * Lecture des fichiers CSV de données (séparateur « ; », UTF-8, compatibles Excel).
 * Le moteur reçoit le TEXTE des fichiers : c'est la plateforme qui les lit sur le disque
 * ou qui les embarque dans le site.
 */

export interface LigneCsv {
  /** Numéro de ligne dans le fichier (1 = en-tête). */
  numero: number;
  valeurs: Record<string, string>;
}

export class ErreurDonnees extends Error {
  constructor(readonly problemes: string[]) {
    super(`Données invalides (${problemes.length} problème${problemes.length > 1 ? 's' : ''}) :\n- ${problemes.join('\n- ')}`);
  }
}

/** Découpe une ligne en tenant compte des guillemets ("a;b" reste une seule valeur). Lève une erreur si un guillemet n'est pas refermé. */
function decouper(ligne: string, sep: string): string[] {
  const res: string[] = [];
  let cur = '';
  let guillemets = false;
  for (let i = 0; i < ligne.length; i++) {
    const c = ligne[i] as string;
    if (guillemets) {
      if (c === '"' && ligne[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') guillemets = false;
      else cur += c;
    } else if (c === '"') guillemets = true;
    else if (c === sep) {
      res.push(cur);
      cur = '';
    } else cur += c;
  }
  if (guillemets) throw new Error('guillemet non refermé');
  res.push(cur);
  return res.map((v) => v.trim());
}

/**
 * Lit un CSV. Vérifie que les colonnes obligatoires sont présentes.
 * Les lignes vides sont ignorées. Une ligne trop longue ou trop courte est signalée.
 */
export function lireCsv(nomFichier: string, texte: string, colonnesObligatoires: readonly string[], sep = ';'): LigneCsv[] {
  const lignes = texte.replace(/^﻿/, '').split(/\r?\n/);
  const problemes: string[] = [];
  let enTete: string[];
  try {
    enTete = decouper(lignes[0] ?? '', sep);
  } catch {
    throw new ErreurDonnees([`${nomFichier}, ligne 1 (en-tête) : guillemet non refermé`]);
  }
  // Audit n°4 : une colonne vide ou en double écraserait silencieusement une autre.
  const vues = new Set<string>();
  enTete.forEach((col, j) => {
    if (col === '') problemes.push(`${nomFichier} : colonne ${j + 1} sans nom dans l'en-tête`);
    else if (vues.has(col)) problemes.push(`${nomFichier} : colonne « ${col} » en double dans l'en-tête`);
    vues.add(col);
  });
  for (const col of colonnesObligatoires) {
    if (!enTete.includes(col)) problemes.push(`${nomFichier} : colonne obligatoire manquante « ${col} »`);
  }
  if (problemes.length > 0) throw new ErreurDonnees(problemes);

  const res: LigneCsv[] = [];
  for (let i = 1; i < lignes.length; i++) {
    const brute = lignes[i] as string;
    if (brute.trim() === '') continue;
    let cellules: string[];
    try {
      cellules = decouper(brute, sep);
    } catch {
      problemes.push(`${nomFichier}, ligne ${i + 1} : guillemet non refermé`);
      continue;
    }
    if (cellules.length !== enTete.length) {
      problemes.push(`${nomFichier}, ligne ${i + 1} : ${cellules.length} colonnes au lieu de ${enTete.length}`);
      continue;
    }
    const valeurs: Record<string, string> = {};
    enTete.forEach((col, j) => (valeurs[col] = cellules[j] as string));
    res.push({ numero: i + 1, valeurs });
  }
  if (problemes.length > 0) throw new ErreurDonnees(problemes);
  return res;
}

/** Outils de conversion qui accumulent les problèmes au lieu de s'arrêter au premier. */
export class Lecteur {
  readonly problemes: string[] = [];

  constructor(private readonly fichier: string) {}

  private ou(ligne: LigneCsv, col: string): string {
    return `${this.fichier}, ligne ${ligne.numero}, colonne « ${col} »`;
  }

  texte(ligne: LigneCsv, col: string, obligatoire = true): string {
    const v = ligne.valeurs[col] ?? '';
    if (obligatoire && v === '') this.problemes.push(`${this.ou(ligne, col)} : valeur vide`);
    return v;
  }

  entier(ligne: LigneCsv, col: string, min: number, max: number, obligatoire = true): number {
    const v = ligne.valeurs[col] ?? '';
    if (v === '') {
      if (obligatoire) this.problemes.push(`${this.ou(ligne, col)} : valeur vide`);
      return NaN;
    }
    const n = Number(v);
    if (!Number.isInteger(n)) {
      this.problemes.push(`${this.ou(ligne, col)} : « ${v} » n'est pas un nombre entier`);
      return NaN;
    }
    if (n < min || n > max) this.problemes.push(`${this.ou(ligne, col)} : ${n} hors des bornes [${min} ; ${max}]`);
    return n;
  }

  decimal(ligne: LigneCsv, col: string, min: number, max: number): number {
    const v = (ligne.valeurs[col] ?? '').replace(',', '.');
    const n = Number(v);
    if (v === '' || !Number.isFinite(n)) {
      this.problemes.push(`${this.ou(ligne, col)} : « ${v} » n'est pas un nombre`);
      return NaN;
    }
    if (n < min || n > max) this.problemes.push(`${this.ou(ligne, col)} : ${n} hors des bornes [${min} ; ${max}]`);
    return n;
  }

  parmi<T extends string>(ligne: LigneCsv, col: string, valeurs: readonly T[]): T {
    const v = ligne.valeurs[col] ?? '';
    if (!valeurs.includes(v as T)) this.problemes.push(`${this.ou(ligne, col)} : « ${v} » n'est pas parmi : ${valeurs.join(', ')}`);
    return v as T;
  }

  reference(ligne: LigneCsv, col: string, existants: ReadonlySet<string>, obligatoire = true): string {
    const v = ligne.valeurs[col] ?? '';
    if (v === '') {
      if (obligatoire) this.problemes.push(`${this.ou(ligne, col)} : valeur vide`);
      return v;
    }
    if (!existants.has(v)) this.problemes.push(`${this.ou(ligne, col)} : identifiant inconnu « ${v} »`);
    return v;
  }

  signaler(ligne: LigneCsv, message: string): void {
    this.problemes.push(`${this.fichier}, ligne ${ligne.numero} : ${message}`);
  }
}
