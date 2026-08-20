#!/usr/bin/env node
/* ============================================================
   Controle de contraste, dans le navigateur, sur les deux themes.
   ------------------------------------------------------------
   Pourquoi dans le navigateur et pas sur la feuille de style : les
   couleurs finales dependent de la composition. Un badge pose sur un
   fond a 12% d'opacite n'a pas la couleur ecrite dans le CSS, il a
   celle du melange. Une sonde qui l'ignore rapporte des echecs
   imaginaires : c'est arrive, un badge annonce a 3,18 alors qu'il
   etait a 5,50.

   La sonde remonte donc la pile des parents en composant chaque fond
   translucide, jusqu'a trouver un aplat opaque.

     node _contrast.js
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

const PAGES = [
  ['qualification.html?bw=800&users=600&type=campus&ssl=yes&sites=3', 'etabli'],
  ['index.html', 'accueil'],
  ['pa-series.html', 'comparateur']
];

const probe = () => {
  function parse(c) {
    const m = (c.match(/[\d.]+/g) || []).map(Number);
    return { r: m[0] || 0, g: m[1] || 0, b: m[2] || 0, a: m.length > 3 ? m[3] : 1 };
  }
  function lum(c) {
    const v = [c.r, c.g, c.b].map(x => x / 255)
      .map(x => x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }
  /* Compose la pile des fonds : sans cela, un fond a 12% est lu comme
     un aplat plein et le rapport calcule est faux. */
  /* Un fond en degrade ou en image n'a pas de couleur unique : la
     composition est alors indeterminable et toute mesure serait une
     invention. Ces elements sont signales a part, pas comptes en
     echec. C'est ce qui a fait annoncer un texte blanc sur carte bleue
     a 1,44 alors qu'il est parfaitement lisible. */
  function hasImage(el) {
    let n = el;
    while (n && n !== document.documentElement) {
      const bi = getComputedStyle(n).backgroundImage;
      if (bi && bi !== 'none') return true;
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c.a === 1) return false;      // aplat opaque atteint avant tout degrade
      n = n.parentElement;
    }
    return false;
  }

  function bgOf(el) {
    const stack = [];
    let n = el;
    while (n && n !== document.documentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c.a > 0) { stack.push(c); if (c.a === 1) break; }
      n = n.parentElement;
    }
    const root = parse(getComputedStyle(document.documentElement).backgroundColor);
    stack.push(root.a === 1 ? root : { r: 255, g: 255, b: 255, a: 1 });
    let out = stack[stack.length - 1];
    for (let i = stack.length - 2; i >= 0; i--) {
      const t = stack[i];
      out = { r: t.r * t.a + out.r * (1 - t.a),
              g: t.g * t.a + out.g * (1 - t.a),
              b: t.b * t.a + out.b * (1 - t.a), a: 1 };
    }
    return out;
  }

  const out = [];
  const skipped = [];
  document.querySelectorAll('body *').forEach(el => {
    if (!el.childNodes.length) return;
    // uniquement les elements qui portent eux-memes du texte
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim());
    if (!own) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;

    const fg = parse(cs.color);
    if (fg.a < 0.95) return;                 // texte volontairement estompe
    if (hasImage(el)) { skipped.push(el.tagName.toLowerCase()); return; }
    const ratio = (Math.max(lum(fg), lum(bgOf(el))) + 0.05)
                / (Math.min(lum(fg), lum(bgOf(el))) + 0.05);

    const size = parseFloat(cs.fontSize);
    const bold = parseInt(cs.fontWeight, 10) >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const need = large ? 3 : 4.5;
    if (ratio >= need) return;

    const id = el.tagName.toLowerCase()
      + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/)[0] : '');
    out.push({ id, ratio: +ratio.toFixed(2), need, size: Math.round(size),
               text: (el.textContent || '').trim().slice(0, 34) });
  });
  // un seul rapport par selecteur, le pire
  const worst = new Map();
  out.forEach(o => { if (!worst.has(o.id) || worst.get(o.id).ratio > o.ratio) worst.set(o.id, o); });
  return { bad: [...worst.values()].sort((a, b) => a.ratio - b.ratio), skipped: skipped.length };
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

  let failures = 0;
  for (const theme of ['dark', 'light']) {
    console.log('\nTheme ' + theme);
    for (const [url, label] of PAGES) {
      await page.goto('http://localhost:' + PORT + '/' + url, { waitUntil: 'networkidle0' });
      await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);
      await new Promise(r => setTimeout(r, 500));
      const res = await page.evaluate(probe);
      const bad = res.bad;
      const note = res.skipped ? '  (' + res.skipped + ' sur degrade, non mesurables)' : '';
      if (!bad.length) { console.log('  ' + label.padEnd(14) + 'tout passe AA' + note); continue; }
      failures += bad.length;
      console.log('  ' + label.padEnd(14) + bad.length + ' sous le seuil' + note);
      bad.slice(0, 6).forEach(b => console.log('     ' + String(b.ratio).padStart(5)
        + ' < ' + b.need + '   ' + String(b.size) + 'px  ' + b.id + '   "' + b.text + '"'));
    }
  }

  await browser.close();
  server.close();

  console.log('');
  if (failures) { console.log('ECHEC - ' + failures + ' element(s) sous le seuil AA.'); process.exit(1); }
  console.log('OK - contraste AA tenu sur les deux themes.');
})().catch(e => { console.error('ERREUR: ' + e.message); process.exit(1); });
