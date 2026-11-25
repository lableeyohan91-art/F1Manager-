import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';

// base : chemin du site sur GitHub Pages (https://<compte>.github.io/F1Manager-/).
export default defineConfig({
  base: process.env.BASE_URL ?? '/F1Manager-/',
  plugins: [preact()],
  // Nombreux tests qui simulent une saison (≈ 3 s ici) : la limite par défaut de 5 s échouait au hasard sur les machines d'intégration
  // (CI n°177, 178, 188). Aucune vérification n'est relâchée, seulement le temps accordé.
  test: { include: ['tests/**/*.test.ts'], testTimeout: 60_000 },
});
