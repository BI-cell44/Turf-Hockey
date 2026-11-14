// Test de fumée de Turf Hockey 26.
// Parcourt : menu -> placement -> match gazon -> pause -> menu -> match salle à 2 claviers,
// et échoue si une erreur JavaScript apparaît ou si un écran ne s'affiche pas.
//
// Prérequis : Node 18+ et Playwright (`npm i playwright` puis `npx playwright install chromium`).
// Lancement depuis la racine du dépôt : node tests/smoke_test.js
//
// Vérification de syntaxe seule (sans navigateur) :
//   python3 -c "s=open('index.html').read();a=s.index('<script>')+8;b=s.rindex('</script>');open('/tmp/g.js','w').write(s[a:b])" && node --check /tmp/g.js
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  const hold = async (key, ms = 80) => { await page.keyboard.down(key); await page.waitForTimeout(ms); await page.keyboard.up(key); await page.waitForTimeout(120); };
  const visible = id => page.evaluate(i => !document.getElementById(i).hidden, id);
  const check = (cond, msg) => { if (!cond) { errors.push('Échec : ' + msg); } };

  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  await page.waitForTimeout(800);
  check(await visible('menu'), 'menu visible au démarrage');

  await page.click('button[data-o="0"][data-v="grass"]');
  await hold('Enter');
  check(await visible('pads'), 'écran des manettes après Entrée');
  await hold('Enter');
  check(!(await visible('pads')), 'match lancé après Entrée');
  await page.waitForTimeout(1300);
  await page.keyboard.down('KeyD'); await page.waitForTimeout(1500); await page.keyboard.up('KeyD');
  await hold('Escape');
  check(await visible('pause'), 'pause avec Échap');
  await page.click('#quit');
  check(await visible('menu'), 'retour au menu');

  await page.click('button[data-o="0"][data-v="indoor"]');
  await page.click('#toPads');
  await page.click('.cell[data-d="kb2"][data-p="1"]');
  await page.click('#kick');
  await page.waitForTimeout(6000);
  await page.screenshot({ path: path.resolve(__dirname, 'derniere_capture.png') });

  await browser.close();
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
  console.log('OK : aucun problème détecté.');
})();
