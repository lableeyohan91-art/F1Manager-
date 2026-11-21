/**
 * Empreinte d'un état : sérialisation stable (clés triées) puis hachage.
 * Sert à vérifier le déterminisme : deux simulations identiques ⇒ même empreinte.
 */

/** JSON avec clés d'objets triées : indépendant de l'ordre d'insertion. */
export function jsonStable(valeur: unknown): string {
  return JSON.stringify(trier(valeur));
}

function trier(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(trier);
  if (v !== null && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    const res: Record<string, unknown> = {};
    for (const k of Object.keys(o).sort()) res[k] = trier(o[k]);
    return res;
  }
  return v;
}

/** Hachage 53 bits (cyrb53), rendu en hexadécimal. */
export function hacher(texte: string, graine = 0): string {
  let h1 = 0xdeadbeef ^ graine, h2 = 0x41c6ce57 ^ graine;
  for (let i = 0; i < texte.length; i++) {
    const ch = texte.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(14, '0');
}

export function empreinte(valeur: unknown): string {
  return hacher(jsonStable(valeur));
}
