import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';

// base : chemin du site sur GitHub Pages (https://<compte>.github.io/F1Manager-/).
export default defineConfig({
  base: process.env.BASE_URL ?? '/F1Manager-/',
  plugins: [preact()],
  test: { include: ['tests/**/*.test.ts'] },
});
