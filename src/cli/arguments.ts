/** Lecture simple des arguments « --nom valeur » du lanceur sans écran. */
export function lireArguments(argv: string[]): Record<string, string> {
  const res: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i] as string;
    if (!a.startsWith('--')) continue;
    const suivant = argv[i + 1];
    if (suivant === undefined || suivant.startsWith('--')) res[a.slice(2)] = 'oui';
    else {
      res[a.slice(2)] = suivant;
      i++;
    }
  }
  return res;
}
