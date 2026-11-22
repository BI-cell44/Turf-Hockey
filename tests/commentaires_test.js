// Test des commentaires audio : rien n'est téléchargé si l'option est désactivée,
// les fichiers sont demandés (et lus) quand elle est activée.
// Lancement depuis la racine du dépôt : node tests/commentaires_test.js
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const errors = [];
  const run = async (com, ms) => {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    page.on('pageerror', e => errors.push(String(e)));
    const reqs = [];
    page.on('request', r => { if (r.url().includes('commentaires/')) reqs.push(r.url().split('commentaires/')[1]); });
    await page.addInitScript(c => {
      localStorage.setItem('th26opts', JSON.stringify({ mode: 'indoor', lvl: 2, dur: 0, guide: 1, auto: 1, com: c }));
      window.__plays = [];
      const p = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () { if (!this.src.startsWith('data:')) window.__plays.push(this.src.split('commentaires/')[1]); return p.call(this); };
    }, com);
    await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
    await page.waitForTimeout(600);
    await page.keyboard.down('Enter'); await page.waitForTimeout(80); await page.keyboard.up('Enter'); await page.waitForTimeout(200);
    await page.keyboard.down('Enter'); await page.waitForTimeout(80); await page.keyboard.up('Enter');
    await page.waitForTimeout(ms);
    const plays = await page.evaluate(() => window.__plays);
    await page.close();
    return { reqs, plays };
  };
  const off = await run(0, 6000);
  const on = await run(2, 70000);
  const j = on.plays.filter(p => p.startsWith('j/')).length, c = on.plays.filter(p => p.startsWith('c/')).length;
  console.log('désactivé : requêtes', off.reqs.length, '· lectures', off.plays.length);
  console.log('activé    : requêtes', on.reqs.length, '· lectures', on.plays.length, '(journaliste', j, ', consultant', c + ')', on.plays.join(' '));
  if (off.reqs.length || off.plays.length) errors.push('Échec : fichiers audio chargés alors que les commentaires sont désactivés');
  if (!on.plays.some(p => p.startsWith('j/engagement') || p.startsWith('j/intro'))) errors.push("Échec : pas d'introduction du journaliste");
  if (!on.reqs.length) errors.push('Échec : aucun fichier audio demandé');
  await browser.close();
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
  console.log('OK');
})();
