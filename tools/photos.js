#!/usr/bin/env node
/* ============================================================
   Photos de facade des PA-Series : de la datasheet au WebP.
   ------------------------------------------------------------
   Source : les photos embarquees en premiere page des datasheets
   officielles Palo Alto (une photo par modele, legendee). Elles
   s'extraient telles quelles avec PyMuPDF, sans rasteriser la page :

     python -I tools/photos-extract.py <pdfs> <raw>

   ecrit <raw>/<datasheet>_p<page>_x<xref>.png. Ce script prend
   ensuite chaque photo de MANIFEST et :
     1. detoure le fond blanc quand la photo n'a pas de canal alpha
        (PA-1400, PA-3400, PA-850) : diffusion depuis les bords, pas
        de seuil global, un boitier porte des serigraphies blanches ;
     2. recadre au plus pres du boitier (alpha > 40) ;
     3. reduit pour tenir dans 720 x 400, jamais agrandi ;
     4. exporte en WebP (img/front/<id>.webp) ;
     5. reecrit data/pa-chassis.js (table modele -> image).

     node tools/photos.js <raw>

   La provenance de chaque image est dans img/SOURCES.md.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'img', 'front');
const RAW = process.argv[2];
if (!RAW) { console.error('usage : node tools/photos.js <dossier des images extraites>'); process.exit(2); }

const BOX_W = 720, BOX_H = 400;

/* id du modele -> [datasheet, fichier extrait, vue]. vue : 'face' ou
   'trois-quarts' (boitiers durcis et chassis, que la datasheet ne
   montre qu'en perspective). */
const MANIFEST = {
  'PA-410':          ['pa-400-series', 'p1_x165', 'face'],
  'PA-415':          ['pa-400-series', 'p1_x169', 'face'],
  'PA-415-5G':       ['pa-400-series', 'p1_x171', 'face'],
  'PA-440':          ['pa-400-series', 'p1_x177', 'face'],
  'PA-445':          ['pa-400-series', 'p1_x173', 'face'],
  'PA-450':          ['pa-400-series', 'p1_x179', 'face'],
  'PA-455':          ['pa-400-series', 'p1_x167', 'face'],
  'PA-455-5G':       ['pa-400-series', 'p1_x175', 'face'],
  'PA-460':          ['pa-400-series', 'p1_x181', 'face'],
  'PA-501':          ['pa-500-series', 'p1_x185', 'face'],
  'PA-505':          ['pa-500-series', 'p1_x181', 'face'],
  'PA-510':          ['pa-500-series', 'p1_x183', 'face'],
  'PA-520':          ['pa-500-series', 'p1_x177', 'face'],
  'PA-520-5G':       ['pa-500-series', 'p1_x187', 'face'],
  'PA-540':          ['pa-500-series', 'p1_x179', 'face'],
  'PA-545-POE':      ['pa-500-series', 'p1_x173', 'face'],
  'PA-550':          ['pa-500-series', 'p1_x169', 'face'],
  'PA-555-POE':      ['pa-500-series', 'p1_x175', 'face'],
  'PA-560':          ['pa-500-series', 'p1_x171', 'face'],
  'PA-850':          ['pa-800-series-datasheet', 'p1_x89', 'face'],
  'PA-1410':         ['pa-1400-series', 'p1_x165', 'face'],
  'PA-1420':         ['pa-1400-series', 'p1_x167', 'face'],
  'PA-1510-POE':     ['pa-1500-series', 'p1_x168', 'face'],
  'PA-1520-POE':     ['pa-1500-series', 'p1_x170', 'face'],
  'PA-1530-POE':     ['pa-1500-series', 'p1_x174', 'face'],
  'PA-3410':         ['pa-3400-series', 'p1_x171', 'face'],
  'PA-3420':         ['pa-3400-series', 'p1_x173', 'face'],
  'PA-3430':         ['pa-3400-series', 'p1_x175', 'face'],
  'PA-3440':         ['pa-3400-series', 'p1_x177', 'face'],
  'PA-3510':         ['pa-3500-series', 'p1_x217', 'face'],
  'PA-3520':         ['pa-3500-series', 'p1_x221', 'face'],
  'PA-3530':         ['pa-3500-series', 'p1_x225', 'face'],
  'PA-3540':         ['pa-3500-series', 'p1_x229', 'face'],
  'PA-5410':         ['pa-5400-series', 'p1_x186', 'face'],
  'PA-5420':         ['pa-5400-series', 'p1_x178', 'face'],
  'PA-5430':         ['pa-5400-series', 'p1_x194', 'face'],
  'PA-5440':         ['pa-5400-series', 'p1_x190', 'face'],
  'PA-5445':         ['pa-5400-series', 'p1_x182', 'face'],
  'PA-5510':         ['pa-5500-series', 'p1_x182', 'face'],
  'PA-5520':         ['pa-5500-series', 'p1_x184', 'face'],
  'PA-5530':         ['pa-5500-series', 'p1_x186', 'face'],
  'PA-5540':         ['pa-5500-series', 'p1_x172', 'face'],
  'PA-5550':         ['pa-5500-series', 'p1_x174', 'face'],
  'PA-5560':         ['pa-5500-series', 'p1_x176', 'face'],
  'PA-5570':         ['pa-5500-series', 'p1_x178', 'face'],
  'PA-5580':         ['pa-5500-series', 'p1_x180', 'face'],
  'PA-7050':         ['pa-7000-series', 'p1_x127', 'trois-quarts'],
  'PA-7080':         ['pa-7000-series', 'p1_x129', 'trois-quarts'],
  'PA-7500':         ['pa-7500', 'p1_x133', 'trois-quarts'],
  'PA-410R':         ['pa-400r-series', 'p1_x177', 'trois-quarts'],
  'PA-410R-5G':      ['pa-400r-series', 'p1_x179', 'trois-quarts'],
  'PA-450R':         ['pa-400r-series', 'p1_x181', 'face'],
  'PA-450R-5G':      ['pa-400r-series', 'p1_x183', 'face'],
  'PA-455R-5G':      ['pa-400r-series', 'p1_x185', 'trois-quarts'],
  'PA-52R-5G':       ['pa-50r-series', 'p1_x191', 'face'],
  'PA-54R-POE-D-5G': ['pa-50r-series', 'p1_x195', 'face'],
  'PA-56R-POE-5G':   ['pa-50r-series', 'p1_x187', 'face']
};

/* Fond blanc relie au bord -> transparent, frange en alpha partiel. */
function detour(data, w, h) {
  const SOLID = 248, EDGE = 232;
  const seen = new Uint8Array(w * h);
  const stack = [];
  const lum = i => Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
  const push = p => { if (!seen[p] && lum(p) >= EDGE) { seen[p] = 1; stack.push(p); } };
  for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
  while (stack.length) {
    const p = stack.pop(), x = p % w, y = (p - x) / w;
    const l = lum(p);
    data[p * 4 + 3] = l >= SOLID ? 0 : Math.round(255 * (SOLID - l) / (SOLID - EDGE));
    if (l < SOLID) continue;          // la frange ne se propage pas
    if (x > 0) push(p - 1); if (x < w - 1) push(p + 1);
    if (y > 0) push(p - w); if (y < h - 1) push(p + w);
  }
}

function bbox(data, w, h) {
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (data[(y * w + x) * 4 + 3] > 40) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

/* Modeles sans photo de facade publiee, et pourquoi. */
const MISSING = {
  'PA-820': 'la datasheet PA-800 en ligne (edition 07/2023) ne montre que la PA-850 : '
    + 'meme gabarit, mais quatre de ses cages sont des SFP+ (8 SFP 1G sur la PA-820) et '
    + 'la serigraphie porte PA-850. TechDocs n a qu une illustration au trait annotee de '
    + 'reperes, pas une photo.',
  'PA-54R-POE': 'la datasheet PA-50R montre les PA-52R-5G, PA-54R-POE-D-5G et PA-56R-POE-5G, '
    + 'pas la PA-54R-POE, dont la facade differe (pas de connecteurs d antenne 5G). '
    + 'TechDocs n a qu une illustration au trait annotee de reperes.'
};

function writeSources(table, alphaless) {
  const vm = require('vm');
  const ctx = {};
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'data', 'pa-models.js'), 'utf8') + ';this.MODELS = MODELS;', ctx);
  const DS = 'https://www.paloaltonetworks.com/resources/datasheets/';
  let s = '# Provenance des photos de facade\n\n'
    + 'Les photos de `img/front/` sont extraites des datasheets officielles Palo Alto\n'
    + 'Networks, telechargees le 5 novembre 2026 depuis www.paloaltonetworks.com\n'
    + '(lien de la page datasheet ci-dessous ; le PDF se telecharge depuis cette\n'
    + 'page). Chaque datasheet porte en premiere page une photo par modele, legendee\n'
    + 'de son nom. L association modele / photo suit cette legende (legende placee\n'
    + 'sous l image dans le PDF), puis a ete verifiee a l oeil : bon modele, face\n'
    + 'avant, boitier entier.\n\n'
    + 'Traitement : extraction de l image embarquee telle quelle, sans rasteriser\n'
    + 'la page (`tools/photos-extract.py`, PyMuPDF) ; detourage du fond blanc par\n'
    + 'diffusion depuis les bords quand l image n a pas de canal alpha ; recadrage\n'
    + 'au plus pres du boitier ; reduction pour tenir dans 720 x 400 px, jamais\n'
    + 'agrandie ; export WebP. `node tools/photos.js <images extraites>` refait\n'
    + 'tout et regenere `data/pa-chassis.js` et ce fichier.\n\n'
    + '| Modele | Fichier | Taille (px) | Vue | Source | Image du PDF | Fond |\n'
    + '| --- | --- | --- | --- | --- | --- | --- |\n';
  const missing = [];
  ctx.MODELS.forEach(m => {
    const e = table[m.id.toLowerCase()];
    if (!e) { missing.push(m.id); return; }
    const key = MANIFEST[m.id][1];
    s += '| ' + m.id + ' | `' + e.img.replace('img/', '') + '` | ' + e.w + ' x ' + e.h + ' | '
      + (e.view === 'face' ? 'face avant' : 'trois-quarts avant') + ' | [datasheet ' + e.ds + '](' + DS + e.ds + ') | '
      + 'page ' + key.replace(/^p(\d+)_x(\d+)$/, '$1, xref $2') + ' | '
      + (alphaless[m.id] ? 'blanc, detoure' : 'transparent d origine') + ' |\n';
  });
  s += '\n## Sans photo\n\n';
  missing.forEach(id => { s += '- **' + id + '** : ' + (MISSING[id] || 'aucune photo officielle trouvee.') + ' L interface affiche un plastron dessine.\n'; });
  s += '\n## Vues de trois-quarts\n\n'
    + 'Les chassis (PA-7050, PA-7080, PA-7500) et les boitiers durcis PA-410R,\n'
    + 'PA-410R-5G et PA-455R-5G ne sont montres qu en perspective par leur\n'
    + 'datasheet : c est la photo retenue, le texte alternatif dit « Vue avant ».\n';
  fs.writeFileSync(path.join(ROOT, 'img', 'SOURCES.md'), s);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const table = {};
  const alphaless = {};
  for (const [id, [ds, key, view]] of Object.entries(MANIFEST)) {
    const src = path.join(RAW, ds + '_' + key + '.png');
    const meta = await sharp(src).metadata();
    const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    if (!meta.hasAlpha) { detour(data, info.width, info.height); alphaless[id] = 1; }
    const bb = bbox(data, info.width, info.height);
    const file = id.toLowerCase() + '.webp';
    const img = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .extract(bb)
      .resize({ width: BOX_W, height: BOX_H, fit: 'inside', withoutEnlargement: true });
    const res = await img.webp({ quality: 86, alphaQuality: 100, effort: 6 }).toFile(path.join(OUT, file));
    table[id.toLowerCase()] = { label: id, img: 'img/front/' + file, w: res.width, h: res.height, view: view, ds: ds };
    console.log(id.padEnd(16), (bb.width + 'x' + bb.height).padEnd(10), '->', res.width + 'x' + res.height, (res.size / 1024).toFixed(1) + ' Ko', meta.hasAlpha ? '' : '(detoure)');
  }
  const head = '/* Photos de facade des PA-Series, extraites des datasheets officielles\n'
    + '   Palo Alto (premiere page, photo legendee du modele). Genere par\n'
    + '   tools/photos.js : ne pas editer a la main. Provenance de chaque\n'
    + '   image : img/SOURCES.md.\n\n'
    + '   w / h : taille du WebP en pixels. view : face, ou trois-quarts quand\n'
    + '   la datasheet ne montre le boitier qu en perspective (chassis,\n'
    + '   boitiers durcis). ds : datasheet source. Un modele absent n a pas\n'
    + '   de photo de facade publiee : l interface dessine un plastron. */\n\n';
  fs.writeFileSync(path.join(ROOT, 'data', 'pa-chassis.js'), head + 'const PA_CHASSIS = ' + JSON.stringify(table, null, 1) + ';\n');
  writeSources(table, alphaless);
  console.log(Object.keys(table).length + ' photos');
})().catch(e => { console.error(e); process.exit(1); });
