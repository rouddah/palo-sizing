#!/usr/bin/env node
/* ============================================================
   Controle clavier et noms accessibles.
   ------------------------------------------------------------
   Un outil interne se remplit souvent au clavier, en tabulant d'un
   champ au suivant. Trois defauts rendent ce parcours impraticable et
   aucun ne se voit a la souris :

     - une cible interactive qu'on ne peut pas atteindre ;
     - une cible atteinte mais sans marque de focus visible : on ne
       sait plus ou l'on est ;
     - un bouton sans nom accessible, qui s'annonce « bouton » et rien
       d'autre a la synthese vocale. Typiquement un bouton qui ne
       contient qu'un pictogramme.

   Le controle verifie aussi l'absence de tabindex positif, qui
   reordonne le parcours et le rend imprevisible.

     node _keyboard.js
   ============================================================ */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const ROOT = __dirname;
const PORT = 8918;
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.png': 'image/png', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
].find(p => fs.existsSync(p));

const PAGES = [
  ['qualification.html', 'etabli'],
  ['index.html', 'accueil'],
  ['pa-series.html', 'comparateur'],
  ['optiques.html', 'optiques'],
  ['accessoires.html', 'accessoires'],
  ['search.html', 'recherche'],
  ['wizard.html', 'wizard'],
  ['resources.html', 'ressources']
];

const probe = () => {
  const SEL = 'a[href], button, input, select, textarea, [tabindex]';
  const out = { noName: [], noFocus: [], positiveTab: [], total: 0 };

  /* Nom accessible, version courte mais fidele a l'ordre de l'ARIA :
     aria-label, puis aria-labelledby, puis le texte, puis le titre,
     puis l'alternative d'une image contenue. */
  function nameOf(el) {
    const al = el.getAttribute('aria-label');
    if (al && al.trim()) return al.trim();
    const lb = el.getAttribute('aria-labelledby');
    if (lb) {
      const t = lb.split(/\s+/).map(id => {
        const n = document.getElementById(id);
        return n ? n.textContent : '';
      }).join(' ').trim();
      if (t) return t;
    }
    if (el.textContent && el.textContent.trim()) return el.textContent.trim();
    if (el.getAttribute('title')) return el.getAttribute('title').trim();
    const img = el.querySelector('img[alt], svg[aria-label]');
    if (img) return (img.getAttribute('alt') || img.getAttribute('aria-label') || '').trim();
    if (el.tagName === 'INPUT') {
      const lab = el.labels && el.labels[0];
      if (lab && lab.textContent.trim()) return lab.textContent.trim();
      if (el.getAttribute('placeholder')) return el.getAttribute('placeholder').trim();
    }
    return '';
  }

  document.querySelectorAll(SEL).forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    if (el.hasAttribute('disabled') || el.getAttribute('aria-hidden') === 'true') return;
    const r = el.getBoundingClientRect();
    if (r.width < 1 && r.height < 1) return;

    out.total++;
    const id = el.tagName.toLowerCase()
      + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/)[0] : '');

    const ti = el.getAttribute('tabindex');
    if (ti !== null && +ti > 0) out.positiveTab.push(id + ' tabindex=' + ti);

    if (!nameOf(el)) out.noName.push(id + (el.id ? '#' + el.id : ''));

    /* Marque de focus : on met reellement le focus et on regarde si
       quelque chose change a l'ecran. Lire la feuille de style ne
       suffirait pas, une regle peut etre annulee plus loin. */
    const before = cs.outlineStyle + '|' + cs.outlineWidth + '|' + cs.boxShadow + '|' + cs.borderColor;
    el.focus({ preventScroll: true });
    const af = getComputedStyle(el);
    const after = af.outlineStyle + '|' + af.outlineWidth + '|' + af.boxShadow + '|' + af.borderColor;
    if (before === after) out.noFocus.push(id);
    el.blur();
  });

  const uniq = a => [...new Set(a)];
  return { total: out.total, noName: uniq(out.noName).slice(0, 8),
           noFocus: uniq(out.noFocus).slice(0, 8), positiveTab: uniq(out.positiveTab).slice(0, 8),
           nName: uniq(out.noName).length, nFocus: uniq(out.noFocus).length,
           nTab: uniq(out.positiveTab).length };
};

(async () => {
  if (!CHROME) { console.log('Chrome introuvable, controle ignore.'); process.exit(0); }

  const server = http.createServer((q, r) => {
    let f = decodeURIComponent(q.url.split('?')[0]);
    if (f === '/') f = '/index.html';
    const p = path.join(ROOT, f);
    if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
    fs.createReadStream(p).pipe(r);
  });
  await new Promise(res => server.listen(PORT, res));

  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  let failures = 0, cibles = 0;
  for (const [url, label] of PAGES) {
    await page.goto('http://localhost:' + PORT + '/' + url, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));
    const r = await page.evaluate(probe);
    cibles += r.total;
    const n = r.nName + r.nFocus + r.nTab;
    failures += n;
    if (!n) { console.log('  ' + label.padEnd(14) + r.total + ' cibles, toutes nommees et focalisables'); continue; }
    console.log('  ' + label.padEnd(14) + r.total + ' cibles, ' + n + ' probleme(s)');
    if (r.nName)  console.log('     sans nom accessible (' + r.nName + ') : ' + r.noName.join(', '));
    if (r.nFocus) console.log('     sans marque de focus (' + r.nFocus + ') : ' + r.noFocus.join(', '));
    if (r.nTab)   console.log('     tabindex positif (' + r.nTab + ') : ' + r.positiveTab.join(', '));
  }

  await browser.close();
  server.close();

  console.log('\n' + cibles + ' cibles interactives verifiees');
  if (failures) { console.log('ECHEC - ' + failures + ' probleme(s) de parcours clavier.'); process.exit(1); }
  console.log('OK - parcours clavier praticable.');
})().catch(e => { console.error('ERREUR: ' + e.message); process.exit(1); });
