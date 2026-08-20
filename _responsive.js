#!/usr/bin/env node
/* ============================================================
   Controle de mise en page reelle, dans Chrome.
   ------------------------------------------------------------
   Sert un serveur statique local, ouvre chaque page a plusieurs
   largeurs et verifie qu'aucune ne deborde lateralement. Le
   debordement horizontal est le defaut le plus courant d'un site
   dense sur mobile, et le seul que ni jsdom ni un lint ne voient.

     node _responsive.js

   Utilise le Chrome deja installe (puppeteer-core, pas de
   telechargement de navigateur).
   ============================================================ */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const ROOT = __dirname;
const PORT = 8912;
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.png': 'image/png', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.webp': 'image/webp' };

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
].find(p => fs.existsSync(p));

const WIDTHS = [360, 390, 768, 1024, 1440, 1920];
const PAGES = ['qualification.html', 'pa-series.html', 'index.html', 'optiques.html',
  'accessoires.html', 'search.html', 'wizard.html', 'panorama.html'];

const failures = [];

(async () => {
  if (!CHROME) { console.error('Chrome introuvable, controle ignore.'); process.exit(0); }

  const server = http.createServer((q, r) => {
    let f = decodeURIComponent(q.url.split('?')[0]);
    if (f === '/') f = '/index.html';
    const p = path.join(ROOT, f);
    if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
      r.writeHead(404); return r.end();
    }
    r.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
    fs.createReadStream(p).pipe(r);
  });
  await new Promise(res => server.listen(PORT, res));

  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new',
    args: ['--disable-gpu', '--no-sandbox'] });
  const page = await browser.newPage();

  for (const file of PAGES) {
    const row = [];
    for (const w of WIDTHS) {
      await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
      await page.goto('http://localhost:' + PORT + '/' + file, { waitUntil: 'networkidle0' });

      const r = await page.evaluate(() => {
        const de = document.documentElement;
        // le ou les elements qui depassent reellement le cadre
        const guilty = [];
        const limit = de.clientWidth;
        document.querySelectorAll('body *').forEach(el => {
          const b = el.getBoundingClientRect();
          if (b.width === 0) return;
          if (b.right > limit + 1 || b.left < -1) {
            const cs = getComputedStyle(el);
            // un enfant d'un cadre a defilement horizontal est legitime
            let p = el.parentElement, inScroller = false;
            while (p && p !== document.body) {
              const ps = getComputedStyle(p);
              if (ps.overflowX === 'auto' || ps.overflowX === 'scroll' || ps.overflowX === 'hidden') { inScroller = true; break; }
              p = p.parentElement;
            }
            if (!inScroller && cs.position !== 'fixed') {
              guilty.push(el.tagName.toLowerCase() + (el.className && typeof el.className === 'string'
                ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '')
                + ' [' + Math.round(b.left) + '..' + Math.round(b.right) + ']');
            }
          }
        });
        return { scrollW: de.scrollWidth, clientW: de.clientWidth, guilty: [...new Set(guilty)].slice(0, 4) };
      });

      const overflow = r.scrollW > r.clientW + 1;
      row.push((overflow ? 'X' : '.') + w);
      if (overflow) {
        failures.push(file + ' @ ' + w + 'px : scrollWidth ' + r.scrollW + ' > ' + r.clientW
          + (r.guilty.length ? '  -> ' + r.guilty.join(' | ') : ''));
      }
    }
    console.log('  ' + file.padEnd(22) + row.join('  '));
  }

  await browser.close();
  server.close();

  console.log('');
  if (failures.length) {
    console.log('ECHEC - debordement horizontal :');
    failures.forEach(f => console.log('  x ' + f));
    process.exit(1);
  }
  console.log('OK - aucune page ne deborde lateralement (' + PAGES.length + ' pages x '
    + WIDTHS.length + ' largeurs).');
})().catch(e => { console.error('ERREUR:', e.message); process.exit(1); });
