/**
 * Phase 12a — pièces des voitures : création de départ, installation, historique borné (D-170).
 */

import { CONVERSION_DEPART, EFFICACITE_REFERENCE, FRONTIERE, PIECES, TYPES_PIECES, type TypePiece } from '../../balance/monoplaces';
import { savoir } from '../technique/acces';
import { invaliderVoitures } from './physique';
import { idsTries, table, type Entite, type Monde } from '../../core/monde';
import { TABLES, type PieceVoiture, type Voiture, type VoitureDonnees } from '../../model/types';

/** Versions conservées par écurie et par type de pièce (volumes bornés) : l'installée et les plus récentes. */
export const VERSIONS_CONSERVEES = 4;

const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));
const r2 = (x: number) => Math.round(x * 100) / 100;

/**
 * Pièces de départ d'une voiture, à partir de ses notes de voitures.csv (conversion unique, CONVERSION_DEPART) : efficacité selon les
 * notes liées à la pièce ; concept des ailerons selon l'écart entre virages rapides et vitesse de pointe (une voiture rapide en ligne
 * droite part d'ailerons « faible traînée »).
 */
export function piecesDepart(d: VoitureDonnees): Omit<PieceVoiture, 'id'>[] {
  const note = (k: string) => (d as unknown as Record<string, number>)[k] ?? CONVERSION_DEPART.noteReference;
  const c = CONVERSION_DEPART;
  return TYPES_PIECES.map((type) => {
    const notes = c.notes[type];
    const moyenne = notes.reduce((a, k) => a + note(k), 0) / notes.length;
    const concept = type === 'aileron_avant' || type === 'aileron_arriere' ? borner(c.conceptParPoint * (note('viragesRapides') - note('vitessePointe')), -c.conceptMax, c.conceptMax) : 0;
    return { ecurie: d.ecurie, type, version: 1, efficacite: r2(EFFICACITE_REFERENCE + c.parPoint * (moyenne - c.noteReference)), concept: r2(concept), reglement: '', saison: 0, installee: true };
  });
}

/** Ajoute une version de pièce à la table (identifiant stable : écurie, type, version). */
export function ajouterPiece(monde: Monde, p: Omit<PieceVoiture, 'id'>): PieceVoiture {
  const id = `pce_${p.ecurie.replace(/^eq_/, '')}_${p.type}_${p.version}`;
  const piece: PieceVoiture = { id, ...p };
  table(monde, TABLES.pieces)[id] = piece as unknown as Entite;
  invaliderVoitures(monde);
  return piece;
}

/** Création, à la naissance du monde (ou à la migration d'une ancienne partie), de la voiture et de ses six pièces. */
export function creerVoitureEtPieces(monde: Monde, d: VoitureDonnees): void {
  const v: Voiture = { id: d.id, ecurie: d.ecurie, fiabilite: d.fiabilite, gestionPneus: d.gestionPneus, verification: d.verification };
  table(monde, TABLES.voitures)[v.id] = v as unknown as Entite;
  const pieces = piecesDepart(d).map((p) => ajouterPiece(monde, p));
  // Savoir de départ cohérent avec les pièces (FRONTIERE.margeDepart) : sinon toutes les écuries auraient la même frontière.
  const parDomaine = new Map<string, number[]>();
  for (const p of pieces) {
    const part = Math.min(FRONTIERE.partMaxDepart, Math.max(0, (p.efficacite + FRONTIERE.margeDepart - FRONTIERE.min) / FRONTIERE.etendue));
    const s = -FRONTIERE.echelleSavoir * Math.log(1 - part);
    for (const dom of PIECES[p.type as TypePiece].domaines) parDomaine.set(dom, [...(parDomaine.get(dom) ?? []), s]);
  }
  for (const [dom, liste] of parDomaine) savoir(monde, d.ecurie, dom).fondamental = r2(liste.reduce((a, b) => a + b, 0) / liste.length);
}

/** Versions d'une pièce d'une écurie, de la plus ancienne à la plus récente. */
export function versions(monde: Monde, idEcurie: string, type: TypePiece): PieceVoiture[] {
  const t = table(monde, TABLES.pieces);
  return idsTries(t).map((id) => t[id] as unknown as PieceVoiture).filter((p) => p.ecurie === idEcurie && p.type === type).sort((a, b) => a.version - b.version);
}

/** Installe une version (une seule installée par type) et borne l'historique. */
export function installer(monde: Monde, piece: PieceVoiture): void {
  const liste = versions(monde, piece.ecurie, piece.type as TypePiece);
  for (const p of liste) p.installee = p.id === piece.id;
  invaliderVoitures(monde);
  const t = table(monde, TABLES.pieces);
  const aGarder = new Set([piece.id, ...liste.slice(-VERSIONS_CONSERVEES).map((p) => p.id)]);
  for (const p of liste) if (!aGarder.has(p.id)) delete t[p.id];
}
