/**
 * Hasard à graine (D-005).
 *
 * - Générateur sfc32 : 4 entiers de 32 bits d'état, rapide, reproductible.
 * - Un FLUX par système (« resultats », « marche »…) : chaque flux est dérivé de la graine
 *   du monde et de son nom. Un tirage de plus dans un flux ne change rien aux autres.
 * - L'état de chaque flux est rangé dans le monde, donc sauvegardé.
 *
 * Interdit dans le moteur : Math.random. Tout passe par ce module.
 */

export type EtatFlux = [number, number, number, number];

/** Hachage d'une chaîne en 4 entiers de 32 bits (cyrb128). */
export function hacher128(texte: string): EtatFlux {
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (let i = 0; i < texte.length; i++) {
    const k = texte.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  h1 ^= h2 ^ h3 ^ h4;
  h2 ^= h1;
  h3 ^= h1;
  h4 ^= h1;
  return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}

/** État initial d'un flux, dérivé de la graine du monde et du nom du flux. */
export function etatInitialFlux(graine: number, nom: string): EtatFlux {
  const etat = hacher128(`${graine}::${nom}`);
  // On « chauffe » le générateur pour décorréler les premiers tirages.
  const flux = new Flux(etat);
  for (let i = 0; i < 12; i++) flux.suivant();
  return etat;
}

/**
 * Un flux de hasard. Il modifie directement le tableau d'état qu'on lui donne :
 * l'état rangé dans le monde avance donc avec les tirages.
 */
export class Flux {
  constructor(private readonly etat: EtatFlux) {}

  /** Nombre décimal dans [0, 1). */
  suivant(): number {
    const s = this.etat;
    let a = s[0], b = s[1], c = s[2], d = s[3];
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    const t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    s[0] = a >>> 0; s[1] = b >>> 0; s[2] = c >>> 0; s[3] = d >>> 0;
    return (t >>> 0) / 4294967296;
  }

  /** Entier entre min et max inclus. */
  entier(min: number, max: number): number {
    if (max < min) throw new Error(`entier(): max (${max}) < min (${min})`);
    return min + Math.floor(this.suivant() * (max - min + 1));
  }

  /** Vrai avec la probabilité p (entre 0 et 1). */
  chance(p: number): boolean {
    return this.suivant() < p;
  }

  /** Tirage selon une loi normale (Box-Muller, deux tirages, sans mémoire cachée). */
  normale(moyenne = 0, ecartType = 1): number {
    const u1 = Math.max(this.suivant(), 1e-12);
    const u2 = this.suivant();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return moyenne + z * ecartType;
  }

  /** Un élément au hasard (tableau non vide). */
  choisir<T>(elements: readonly T[]): T {
    if (elements.length === 0) throw new Error('choisir(): tableau vide');
    return elements[this.entier(0, elements.length - 1)] as T;
  }

  /** Un élément selon des poids positifs. */
  choisirPondere<T>(elements: readonly T[], poids: readonly number[]): T {
    if (elements.length === 0 || elements.length !== poids.length) {
      throw new Error('choisirPondere(): tableaux vides ou de tailles différentes');
    }
    const total = poids.reduce((s, p) => s + Math.max(0, p), 0);
    if (total <= 0) return this.choisir(elements);
    let r = this.suivant() * total;
    for (let i = 0; i < elements.length; i++) {
      r -= Math.max(0, poids[i] as number);
      if (r < 0) return elements[i] as T;
    }
    return elements[elements.length - 1] as T;
  }

  /** Copie mélangée (Fisher-Yates). */
  melanger<T>(elements: readonly T[]): T[] {
    const copie = [...elements];
    for (let i = copie.length - 1; i > 0; i--) {
      const j = this.entier(0, i);
      [copie[i], copie[j]] = [copie[j] as T, copie[i] as T];
    }
    return copie;
  }
}
