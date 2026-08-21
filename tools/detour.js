#!/usr/bin/env node
/* ============================================================
   Detoure les vignettes materiel : le fond blanc devient
   transparent.
   ------------------------------------------------------------
   Les images d'origine sont des PNG sans canal alpha, sur fond
   blanc plein. Sur le theme sombre du site, chaque vignette
   apparaissait donc dans un rectangle blanc.

   Methode : remplissage par diffusion depuis les bords, et non
   simple seuil sur le blanc. La nuance est importante : un
   boitier PA-Series porte des serigraphies, des LED et des
   etiquettes blanches. Un seuil global les percerait. Seul le
   blanc *relie au bord* de l'image est du fond.

   Les pixels de la frange (blanc casse, anti-aliasing) recoivent
   une transparence partielle, sinon le detourage laisse un
   lisere clair autour du boitier.

     node tools/detour.js            # traite img/hw/
     node tools/detour.js --dry      # rapport seul, n ecrit rien
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const DIR = path.join(__dirname, '..', 'img', 'hw');
const DRY = process.argv.includes('--dry');

/* Un pixel est « fond » s il est tres clair ; la frange est traitee
   a part avec une transparence proportionnelle. */
const SOLID = 250;   // au-dela : fond franc (le blanc pur du fond)
const EDGE  = 238;   // frange : au-dessous, c est du chassis (les
                     // boitiers PA sont gris argent, autour de 200-230,
                     // un seuil trop bas les mangeait)

async function detour(file) {
  const src = path.join(DIR, file);
  const { data, info } = await sharp(src).ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const px = data;

  const lum = i => (px[i] + px[i + 1] + px[i + 2]) / 3;

  /* Diffusion depuis les quatre bords, en pile explicite : une
     recursion deborderait sur les grandes images. */
  const bg = new Uint8Array(W * H);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const n = y * W + x;
    if (bg[n]) return;
    if (lum(n * C) < EDGE) return;      // trop sombre : on s arrete
    bg[n] = 1;
    stack.push(n);
  };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }

  while (stack.length) {
    const n = stack.pop();
    const x = n % W, y = (n / W) | 0;
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
  }

  /* Application : fond franc totalement transparent, frange
     proportionnelle a sa clarte. */
  let cleared = 0, feathered = 0;
  for (let n = 0; n < W * H; n++) {
    if (!bg[n]) continue;
    const i = n * C;
    const l = lum(i);
    if (l >= SOLID) { px[i + 3] = 0; cleared++; }
    else {
      // 200 -> opaque, 244 -> transparent
      const a = Math.round(255 * (SOLID - l) / (SOLID - EDGE));
      px[i + 3] = Math.max(0, Math.min(255, a));
      feathered++;
    }
  }

  const pct = Math.round(cleared / (W * H) * 100);
  if (!DRY) {
    await sharp(px, { raw: { width: W, height: H, channels: C } })
      .png({ compressionLevel: 9, palette: false })
      .toFile(src + '.tmp');
    fs.renameSync(src + '.tmp', src);
  }
  return { file, W, H, pct, feathered };
}

(async () => {
  const files = fs.readdirSync(DIR).filter(f => f.endsWith('.png'));
  let done = 0, skipped = 0, totalPct = 0;
  for (const f of files) {
    try {
      const meta = await sharp(path.join(DIR, f)).metadata();
      // deja detouree : on ne repasse pas dessus
      if (meta.hasAlpha) {
        const st = await sharp(path.join(DIR, f)).stats();
        if (st.channels[3] && st.channels[3].min === 0) { skipped++; continue; }
      }
      const r = await detour(f);
      totalPct += r.pct;
      done++;
      if (done <= 5) console.log('  ' + r.file.padEnd(24) + r.W + 'x' + r.H
        + '  fond retire ' + String(r.pct).padStart(2) + '%  frange ' + r.feathered + 'px');
    } catch (e) {
      console.error('  ECHEC ' + f + ' : ' + e.message);
    }
  }
  console.log((DRY ? '[simulation] ' : '') + done + ' vignettes detourees, '
    + skipped + ' deja transparentes'
    + (done ? ', fond retire ' + Math.round(totalPct / done) + '% en moyenne' : ''));
})();
