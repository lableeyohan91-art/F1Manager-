/**
 * Audit des phases 10–11 — accessibilité sur téléphones Android simulés (Playwright), en portrait et en paysage :
 * mesure des performances depuis l'accueil, bouton Réglages de l'en-tête, tous les écrans par la barre du bas (avec « Plus »),
 * boutons dans l'écran, aucun débordement horizontal. Usage : node tools/parcours-android.mjs [dossier des captures]
 */
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
const { chromium, devices } = createRequire(import.meta.url)('playwright');
const URL_SITE = process.env.URL_SITE ?? 'http://localhost:4173/F1Manager-/';
const dossier = process.argv[2] ?? 'sorties/parcours-android';
mkdirSync(dossier, { recursive: true });
const APPAREILS = ['Galaxy S9+', 'Galaxy S8', 'Pixel 7', 'Pixel 7 landscape', 'Galaxy S8 landscape'];
const ECRANS = [['Actualités', 'À la une'], ['Équipe', 'Effectif de'], ['Marché', 'Cibles possibles'], ['Technique', 'Savoir technique'], ['Finances', 'Budget de développement'], ['Championnat', 'Constructeurs'], ['Archives', 'Records'], ['Direction', 'Délégations'], ['Réglages', 'Mesure des performances']];
const navigateur = await chromium.launch();
const erreurs = [];
const dansLEcran = async (page, loc, quoi) => {
  const b = await loc.boundingBox();
  const vp = page.viewportSize();
  if (!b || b.x < 0 || b.y < 0 || b.x + b.width > vp.width + 1 || b.y + b.height > vp.height + 1) throw new Error(`${quoi} hors de l'écran (${JSON.stringify(b)} pour ${vp.width}×${vp.height})`);
};
for (const nomAppareil of APPAREILS) {
  const ctx = await navigateur.newContext({ ...devices[nomAppareil] });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => erreurs.push(`[${nomAppareil}] ${e.message}`));
  const court = nomAppareil.replace(/[^a-zA-Z0-9]+/g, '-');
  try {
    await page.goto(URL_SITE);
    await page.locator('input.num').first().fill('42');
    await page.getByRole('button', { name: 'Mesurer les performances de cet appareil' }).click();
    await page.getByText(/semaines en/).waitFor({ timeout: 90_000 });
    console.log(`✔ ${nomAppareil} : mesure depuis l'accueil — ${await page.locator('[role=status]').first().textContent()}`);
    await page.getByRole('button', { name: 'Nouvelle partie' }).click();
    await page.getByText('Votre manager').waitFor({ timeout: 60_000 });
    await page.getByLabel('Prénom').fill('Android');
    await page.getByLabel('Nom', { exact: true }).fill('Test');
    await page.locator('.carte-choix').first().click();
    await page.getByRole('button', { name: 'Prendre la tête de l’écurie' }).click();
    await page.getByText('Décisions en attente').waitFor();
    for (const [nom, loc] of [['Réglages (en-tête)', page.getByRole('button', { name: 'Réglages' }).first()], ['Continuer', page.getByRole('button', { name: 'Continuer ▸' })]]) await dansLEcran(page, loc, nom);
    await page.screenshot({ path: `${dossier}/${court}-accueil-partie.png` });
    await page.getByRole('button', { name: 'Réglages' }).first().click();
    await page.getByText('Mesure des performances').waitFor();
    console.log(`✔ ${nomAppareil} : Réglages en un geste depuis l'en-tête`);
    for (const [ecran, texte] of ECRANS) {
      const bouton = page.locator('.jeu-nav button', { hasText: ecran });
      if (!(await bouton.isVisible())) { const plus = page.locator('.jeu-nav button.plus'); await dansLEcran(page, plus, '« Plus »'); await plus.click(); }
      await dansLEcran(page, bouton, ecran);
      await bouton.click();
      await page.getByText(texte).first().waitFor();
    }
    console.log(`✔ ${nomAppareil} : les ${ECRANS.length} écrans de la barre de navigation sont accessibles`);
    if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) throw new Error('débordement horizontal');
    await page.screenshot({ path: `${dossier}/${court}-reglages.png` });
    console.log(`✔ ${nomAppareil} : pas de débordement horizontal`);
  } catch (e) {
    erreurs.push(`[${nomAppareil}] ${e.message}`);
  }
  await ctx.close();
}
await navigateur.close();
if (erreurs.length) { console.error('ÉCHEC :\n' + erreurs.join('\n')); process.exit(1); }
console.log('Parcours Android réussi.');
