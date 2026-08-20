/* Allege les traces sans les deformer.
   1. precision ramenee a 1 decimale (un glyphe rendu a 14-20px n'a pas
      besoin du centieme de pixel)
   2. commandes consecutives identiques regroupees (C a b c C d e f -> C a b c d e f)
   3. separateurs minimaux
   4. segments cubiques quasi rectilignes convertis en lignes
   5. deduplication des points identiques apres arrondi                */
'use strict';

function round(n, p) { const v = +(+n).toFixed(p); return Object.is(v, -0) ? 0 : v; }

/* Un cubique dont les points de controle sont sur la corde est une ligne. */
function cubicIsLine(x0, y0, c1x, c1y, c2x, c2y, x, y, tol) {
  const dx = x - x0, dy = y - y0;
  const len = Math.hypot(dx, dy);
  if (len < 1e-6) return false;
  for (const [cx, cy] of [[c1x, c1y], [c2x, c2y]]) {
    const d = Math.abs((cx - x0) * dy - (cy - y0) * dx) / len;
    if (d > tol) return false;
    const t = ((cx - x0) * dx + (cy - y0) * dy) / (len * len);
    if (t < -0.05 || t > 1.05) return false;
  }
  return true;
}

function optimize(d, opts) {
  const p = opts && opts.precision != null ? opts.precision : 1;
  const tol = opts && opts.lineTol != null ? opts.lineTol : 0.04;

  // 1. lecture des segments
  const toks = d.match(/[MLCQZ]|-?\d+(?:\.\d+)?/g) || [];
  const segs = [];
  let i = 0;
  while (i < toks.length) {
    const c = toks[i++];
    if (c === 'Z') { segs.push({ c: 'Z', v: [] }); continue; }
    const n = c === 'C' ? 6 : c === 'Q' ? 4 : 2;
    const v = [];
    for (let k = 0; k < n; k++) v.push(+toks[i++]);
    segs.push({ c, v });
  }

  // 2. arrondi, conversion des cubiques plates, suppression des doublons
  const out = [];
  let cx = 0, cy = 0, sx = 0, sy = 0;
  for (const s of segs) {
    if (s.c === 'Z') { out.push(s); cx = sx; cy = sy; continue; }
    const v = s.v.map(n => round(n, p));
    if (s.c === 'M') { out.push({ c: 'M', v }); cx = sx = v[0]; cy = sy = v[1]; continue; }
    if (s.c === 'L') {
      if (v[0] === cx && v[1] === cy) continue;          // point identique
      out.push({ c: 'L', v }); cx = v[0]; cy = v[1]; continue;
    }
    if (s.c === 'C') {
      if (v[4] === cx && v[5] === cy
          && v[0] === cx && v[1] === cy && v[2] === cx && v[3] === cy) continue;
      if (cubicIsLine(cx, cy, v[0], v[1], v[2], v[3], v[4], v[5], tol)) {
        if (v[4] === cx && v[5] === cy) continue;
        out.push({ c: 'L', v: [v[4], v[5]] });
      } else out.push({ c: 'C', v });
      cx = v[4]; cy = v[5]; continue;
    }
    out.push({ c: s.c, v });
    cx = v[v.length - 2]; cy = v[v.length - 1];
  }

  // 3. ecriture compacte : commande omise si identique a la precedente,
  //    separateur omis quand le nombre suivant commence par '-' ou '.'
  let str = '', prev = '';
  for (const s of out) {
    if (s.c === 'Z') { str += 'Z'; prev = ''; continue; }
    let head = s.c === prev ? '' : s.c;
    if (!head && str && !/[\s,]$/.test(str)) {
      const first = String(s.v[0]);
      if (!(first.startsWith('-') || first.startsWith('.'))) head = ' ';
    }
    str += head;
    s.v.forEach((n, k) => {
      const t = String(n).replace(/^0\./, '.').replace(/^-0\./, '-.');
      if (k > 0 && !t.startsWith('-') && !t.startsWith('.')) str += ' ';
      str += t;
    });
    prev = s.c;
  }
  return str;
}

module.exports = { optimize };

/* Mesure si appele directement */
if (require.main === module) {
  const cat = require('./catalogue.json');
  let before = 0, after = 0;
  for (const c of cat) {
    for (const pp of c.paths) { before += pp.d.length; after += optimize(pp.d).length; }
  }
  console.log('catalogue entier : ' + Math.round(before / 1024) + ' Ko -> '
    + Math.round(after / 1024) + ' Ko  (-' + Math.round(100 - after / before * 100) + '%)');
  const sample = ['ssl-decryption', 'tunnel-ssl-session', 'branch-office', 'user', 'av-signatures',
    'double-up', 'bar-graph', 'dashboard', 'switch', 'iot-i', 'vpn', 'public-cloud'];
  for (const s of sample) {
    const c = cat.find(x => x.slug === s);
    if (!c) continue;
    const b = c.paths.reduce((a, x) => a + x.d.length, 0);
    const a = c.paths.reduce((a2, x) => a2 + optimize(x.d).length, 0);
    console.log('  ' + s.padEnd(24) + String(b).padStart(6) + ' -> ' + String(a).padStart(6)
      + '  (-' + Math.round(100 - a / b * 100) + '%)');
  }
}
