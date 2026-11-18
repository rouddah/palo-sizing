#!/usr/bin/env node
/* ============================================================
   Fiche de comparaison imprimable, rendue par Chrome.
   ------------------------------------------------------------
   Ouvre le comparateur sur une selection PA + concurrents, construit
   la fiche, l'imprime en PDF A4 et verifie :
     - la fiche contient les lignes cles (debits, sessions, CPS,
       ports, HA, PoE, EoS), les sources et la date d'edition ;
     - la mention de methode de mesure des concurrents ;
     - aucun prix, aucun em-dash, aucune couleur (noir et blanc) ;
     - une seule page A4 pour quatre modeles ;
     - hors fiche, l'impression de la page n'est pas detournee.

     node _print.js            (PS_OUT=<dossier> garde le PDF)
   ============================================================ */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const ROOT = __dirname;
const PORT = 8914;
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.png': 'image/png', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
].find(p => fs.existsSync(p));

const CASES = [
  { name: 'pa-concurrents', cmp: 'PA-1420,FG-200G,Force-3950,Cisco-1250', vendors: 'fortinet,checkpoint,cisco', comp: true },
  { name: 'pa-seuls', cmp: 'PA-3410,PA-3510,PA-5410', vendors: '', comp: false },
  { name: 'quatre-dense', cmp: 'PA-7500,PA-5580,PA-1530-POE,FG-7121F', vendors: 'fortinet', comp: true }
];
const fails = [];
const fail = (c, m) => fails.push(c + ' : ' + m);

(async () => {
  if (!CHROME) { console.error('Chrome introuvable, controle ignore.'); process.exit(0); }
  const server = http.createServer((q, r) => {
    let f = decodeURIComponent(q.url.split('?')[0]);
    if (f === '/') f = '/index.html';
    const p = path.join(ROOT, f);
    if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
    fs.createReadStream(p).pipe(r);
  });
  await new Promise(res => server.listen(PORT, res));
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu', '--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  for (const C of CASES) {
    const url = 'http://localhost:' + PORT + '/pa-series.html?cmp=' + C.cmp + (C.vendors ? '&vendors=' + C.vendors : '');
    await page.goto(url, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    const btn = await page.$('#cv-print');
    if (!btn) { fail(C.name, 'bouton Imprimer / PDF absent'); continue; }
    const ok = await page.evaluate(() => { const b = window.PrintSheet.build(); document.body.classList.add('ps-on'); return b; });
    if (!ok) { fail(C.name, 'fiche non construite'); continue; }
    await page.evaluate(() => Promise.all(Array.from(document.querySelectorAll('#print-sheet img')).map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))));
    await page.emulateMediaType('print');
    const info = await page.evaluate(() => {
      const ps = document.getElementById('print-sheet');
      const txt = ps.textContent;
      const visibleOther = Array.from(document.body.children).filter(e => e !== ps && getComputedStyle(e).display !== 'none' && e.tagName !== 'SCRIPT').map(e => e.tagName + '#' + e.id);
      const colors = new Set();
      ps.querySelectorAll('*').forEach(el => {
        const cs = getComputedStyle(el);
        [cs.color, cs.borderTopColor, cs.backgroundColor].forEach(c => {
          const m = c.match(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/);
          if (!m || (m[4] !== undefined && +m[4] === 0)) return;
          if (!(m[1] === m[2] && m[2] === m[3])) colors.add(c + ' sur ' + el.tagName + '.' + el.className);
        });
      });
      return { txt, visibleOther, colors: Array.from(colors).slice(0, 5), models: ps.querySelectorAll('th.ps-m:not(.lab)').length,
        imgs: Array.from(ps.querySelectorAll('img')).map(i => i.naturalWidth) };
    });
    const t = info.txt;
    const must = ['Sizing Guide PANW', 'Fiche de comparaison', 'Édition du', 'Sessions', 'Interfaces', 'Haute disponibilité',
      'End of Sale', 'Sources', 'paloaltonetworks.com/resources/datasheets/'];
    must.forEach(w => { if (t.indexOf(w) === -1) fail(C.name, 'absent de la fiche : ' + w); });
    if (!/CPS|par seconde/i.test(t)) fail(C.name, 'ligne CPS absente');
    if (!/actif\/passif/i.test(t)) fail(C.name, 'ligne HA actif/passif absente');
    if (C.comp) {
      if (!/méthode de mesure de leur éditeur/.test(t)) fail(C.name, 'mention de methode de mesure absente');
      C.vendors.split(',').forEach(v => { const d = v + '.com'; if (t.indexOf(d) === -1) fail(C.name, 'source ' + d + ' absente'); });
      if (!/Mesure Fortinet/.test(t)) fail(C.name, 'profil de mesure absent sous un debit concurrent');
    }
    if (/[€$£]|\bprix\b|\bprice\b|\btarif/i.test(t)) fail(C.name, 'mention de prix');
    if (t.indexOf('—') !== -1) fail(C.name, 'em-dash dans la fiche');
    if (info.visibleOther.length) fail(C.name, 'elements imprimes hors fiche : ' + info.visibleOther.join(', '));
    if (info.colors.length) fail(C.name, 'couleur dans la fiche : ' + info.colors.join(' ; '));
    if (info.models !== C.cmp.split(',').length) fail(C.name, info.models + ' colonnes au lieu de ' + C.cmp.split(',').length);
    if (info.imgs.some(w => !w)) fail(C.name, 'photo non chargee');
    const pdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });
    const pages = (Buffer.from(pdf).toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    if (pages !== 1) fail(C.name, pages + ' pages A4 au lieu d\'une');
    if (process.env.PS_OUT) fs.writeFileSync(path.join(process.env.PS_OUT, 'fiche-' + C.name + '.pdf'), pdf);
    await page.emulateMediaType('screen');
    console.log('  ' + C.name + ' : ' + info.models + ' modeles, ' + pages + ' page');
  }

  // Hors comparaison, Ctrl+P imprime la page comme avant.
  await page.goto('http://localhost:' + PORT + '/pa-series.html', { waitUntil: 'networkidle0' });
  await page.emulateMediaType('print');
  const hijack = await page.evaluate(() => { window.dispatchEvent(new Event('beforeprint')); return document.body.classList.contains('ps-on'); });
  if (hijack) fail('gamme', 'la fiche remplace l\'impression hors vue Comparaison');

  await browser.close(); server.close();
  if (fails.length) { console.error('Fiche imprimable : ' + fails.length + ' echec(s)'); fails.forEach(f => console.error('  - ' + f)); process.exit(1); }
  console.log('Fiche imprimable : OK');
})().catch(e => { console.error(e); process.exit(1); });
