#!/usr/bin/env node
/* ============================================================
   Recadre les vignettes materiel sur le boitier.
   ------------------------------------------------------------
   Les visuels ont ete decoupes dans la planche Visio officielle, et
   certains decoupages ont emporte la legende du boitier voisin. Une
   fois le fond rendu transparent, ces fragments de texte flottent
   au-dessus de l'appareil.

   Methode : recherche des composantes connexes du masque alpha. Le
   boitier est, de loin, la plus grande. Les composantes dont l'aire
   est inferieure a un pourcentage de celle-ci sont du texte parasite
   et sont effacees. L'image est ensuite recadree sur ce qui reste.

   Le seuil ne peut pas etre trop bas : un PA-415-5G a deux antennes
   detachees du chassis, un PA-7000 a des modules separes. Ce sont de
   vraies parties de l'appareil, pas du bruit.

     node tools/recadre.js [--dry]
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const DIR = path.join(__dirname, '..', 'img', 'hw');
const DRY = process.argv.includes('--dry');

/* Une composante est conservee si son aire atteint ce pourcentage de
   la plus grande. En dessous, c'est une legende. */
const KEEP_RATIO = 0.06;
const ALPHA_MIN = 40;        // en deca, le pixel est considere vide

async function traiter(file) {
  const src = path.join(DIR, file);
  const { data, info } = await sharp(src).ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  /* Etiquetage des composantes connexes (8-voisinage) */
  const label = new Int32Array(W * H).fill(-1);
  const areas = [];
  const stack = [];
  for (let start = 0; start < W * H; start++) {
    if (label[start] !== -1) continue;
    if (data[start * C + 3] < ALPHA_MIN) { label[start] = -2; continue; }
    const id = areas.length;
    let area = 0;
    stack.push(start);
    label[start] = id;
    while (stack.length) {
      const n = stack.pop();
      area++;
      const x = n % W, y = (n / W) | 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
          const m = ny * W + nx;
          if (label[m] !== -1) continue;
          if (data[m * C + 3] < ALPHA_MIN) { label[m] = -2; continue; }
          label[m] = id;
          stack.push(m);
        }
      }
    }
    areas.push(area);
  }
  if (!areas.length) return null;

  const maxArea = Math.max(...areas);
  const keep = areas.map(a => a >= maxArea * KEEP_RATIO);
  const dropped = keep.filter(k => !k).length;

  /* Effacement des composantes rejetees + boite des conservees */
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let n = 0; n < W * H; n++) {
    const id = label[n];
    if (id < 0) continue;
    if (!keep[id]) { data[n * C + 3] = 0; continue; }
    const x = n % W, y = (n / W) | 0;
    if (x < x0) x0 = x; if (x > x1) x1 = x;
    if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  if (x1 < 0) return null;

  const cw = x1 - x0 + 1, ch = y1 - y0 + 1;
  const gain = Math.round((1 - (cw * ch) / (W * H)) * 100);

  if (!DRY) {
    await sharp(data, { raw: { width: W, height: H, channels: C } })
      .extract({ left: x0, top: y0, width: cw, height: ch })
      .png({ compressionLevel: 9 })
      .toFile(src + '.tmp');
    fs.renameSync(src + '.tmp', src);
  }
  return { file, from: W + 'x' + H, to: cw + 'x' + ch, dropped, gain };
}

(async () => {
  const files = fs.readdirSync(DIR).filter(f => f.endsWith('.png'));
  let n = 0, totalDropped = 0;
  for (const f of files) {
    try {
      const r = await traiter(f);
      if (!r) { console.log('  vide, ignore : ' + f); continue; }
      n++;
      totalDropped += r.dropped;
      if (r.dropped > 0) {
        console.log('  ' + r.file.padEnd(24) + r.from.padEnd(10) + ' -> ' + r.to.padEnd(10)
          + r.dropped + ' fragment(s) retire(s)');
      }
    } catch (e) { console.error('  ECHEC ' + f + ' : ' + e.message); }
  }
  console.log((DRY ? '[simulation] ' : '') + n + ' vignettes recadrees, '
    + totalDropped + ' fragments parasites retires');
})();
