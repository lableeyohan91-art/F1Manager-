import { creerScenarioGrille2026, verifierCoherence } from '../../src/engine';
import { lireDonneesGrille2026 } from '../../src/platform/node/donnees';
const sc = creerScenarioGrille2026(lireDonneesGrille2026());
for (const g of [1, 2, 3, 4]) { const m = sc.creerMonde(g); const mo = sc.creerMoteur(); for (let k = 0; k < 3 * 13; k++) { mo.avancer(m, 4); const pb = verifierCoherence(m, { ages: false }); if (pb.length) { console.log(g, m.date, pb.slice(0, 3)); break; } } }
