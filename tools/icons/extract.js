/* ============================================================
   DrawingML -> SVG : extraction du jeu de pictogrammes officiel
   Palo Alto depuis « General Iconography by dineche.pptx ».

   Chaque pictogramme est un <p:grpSp> suivi d'un <p:sp> texte qui
   le nomme. Les traces sont des <a:custGeom> remplis (pas de trait),
   en noir : ils deviennent des <path fill="currentColor">.

   Le jeu n'utilise que moveTo / lnTo / cubicBezTo / close, ce qui
   rend la conversion exacte : aucun arc a approximer.

     node extract.js        -> catalogue.json + planche.html
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const SLIDES = 'pptx/ppt/slides';
const EMU = 914400;

/* ── Decoupe XML : enfants directs d'un conteneur ─────────── */
function children(body, tags) {
  const out = [];
  let i = 0;
  const re = new RegExp('<p:(' + tags.join('|') + ')(?=[ >])');
  while (i < body.length) {
    const m = re.exec(body.slice(i));
    if (!m) break;
    const tag = 'p:' + m[1];
    const s = i + m.index;
    let depth = 0, j = s;
    while (j < body.length) {
      if (body.startsWith('<' + tag, j) && /[ >]/.test(body[j + tag.length + 1] || '')) { depth++; j += tag.length + 1; continue; }
      if (body.startsWith('</' + tag + '>', j)) { depth--; j += tag.length + 3; if (!depth) break; continue; }
      j++;
    }
    out.push({ tag: m[1], xml: body.slice(s, j) });
    i = j;
  }
  return out;
}

function inner(src, tag) {
  const a = src.indexOf('<' + tag + '>');
  if (a < 0) return null;
  const b = src.indexOf('</' + tag + '>', a);
  return src.slice(a + tag.length + 2, b);
}

/* ── Transformations ──────────────────────────────────────── */
function readXfrm(spPr) {
  if (!spPr) return null;
  const x = /<a:xfrm([^>]*)>([\s\S]*?)<\/a:xfrm>/.exec(spPr);
  if (!x) return null;
  const attrs = x[1], body = x[2];
  const off = /<a:off x="(-?\d+)" y="(-?\d+)"\/>/.exec(body);
  const ext = /<a:ext cx="(\d+)" cy="(\d+)"\/>/.exec(body);
  const chOff = /<a:chOff x="(-?\d+)" y="(-?\d+)"\/>/.exec(body);
  const chExt = /<a:chExt cx="(\d+)" cy="(\d+)"\/>/.exec(body);
  if (!off || !ext) return null;
  return {
    x: +off[1], y: +off[2], w: +ext[1], h: +ext[2],
    cx: chOff ? +chOff[1] : null, cy: chOff ? +chOff[2] : null,
    cw: chExt ? +chExt[1] : null, ch: chExt ? +chExt[2] : null,
    flipH: /flipH="1"/.test(attrs), flipV: /flipV="1"/.test(attrs),
    rot: /rot="(-?\d+)"/.test(attrs) ? +/rot="(-?\d+)"/.exec(attrs)[1] / 60000 : 0
  };
}

/* Une transformation affine simple : echelle + translation. */
const IDENT = { a: 1, d: 1, e: 0, f: 0 };
function compose(outer, t) {
  return { a: outer.a * t.a, d: outer.d * t.d,
           e: outer.a * t.e + outer.e, f: outer.d * t.f + outer.f };
}
function apply(t, x, y) { return [t.a * x + t.e, t.d * y + t.f]; }

/* Transformation apportee par un groupe : l'espace enfant (chOff/chExt)
   est projete sur l'espace parent (off/ext). */
function groupTransform(f) {
  if (f.cw == null || f.cw === 0 || f.ch === 0) return { a: 1, d: 1, e: 0, f: 0 };
  const a = f.w / f.cw, d = f.h / f.ch;
  return { a, d, e: f.x - f.cx * a, f: f.y - f.cy * d };
}

/* ── Geometrie -> donnees de chemin SVG ───────────────────── */
function custGeomToPath(spPr, f, T) {
  const geom = inner(spPr, 'a:custGeom');
  if (!geom) return null;
  const pathTags = [...geom.matchAll(/<a:path([^>]*)>([\s\S]*?)<\/a:path>/g)];
  if (!pathTags.length) return null;

  let d = '';
  for (const pt of pathTags) {
    const attrs = pt[1], body = pt[2];
    const pw = /w="(\d+)"/.test(attrs) ? +/w="(\d+)"/.exec(attrs)[1] : f.w;
    const ph = /h="(\d+)"/.test(attrs) ? +/h="(\d+)"/.exec(attrs)[1] : f.h;
    // espace local du trace -> boite de la forme -> monde
    const sx = pw ? f.w / pw : 1, sy = ph ? f.h / ph : 1;
    let local = { a: sx, d: sy, e: f.x, f: f.y };
    if (f.flipH) local = { a: -sx, d: local.d, e: f.x + f.w, f: local.f };
    if (f.flipV) local = { a: local.a, d: -sy, e: local.e, f: f.y + f.h };
    const M = compose(T, local);

    const P = (x, y) => { const [ax, ay] = apply(M, x, y); return ax.toFixed(1) + ' ' + ay.toFixed(1); };

    // les commandes doivent etre lues dans l'ordre du document
    const re = /<a:(moveTo|lnTo|cubicBezTo|quadBezTo|close)(?:\/>|>([\s\S]*?)<\/a:\1>)/g;
    let m;
    while ((m = re.exec(body))) {
      const kind = m[1], seg = m[2] || '';
      const pts = [...seg.matchAll(/<a:pt x="(-?\d+)" y="(-?\d+)"\/>/g)].map(p => [+p[1], +p[2]]);
      if (kind === 'close') { d += 'Z'; continue; }
      if (kind === 'moveTo' && pts[0]) d += 'M' + P(pts[0][0], pts[0][1]);
      else if (kind === 'lnTo' && pts[0]) d += 'L' + P(pts[0][0], pts[0][1]);
      else if (kind === 'cubicBezTo' && pts.length >= 3)
        d += 'C' + P(pts[0][0], pts[0][1]) + ' ' + P(pts[1][0], pts[1][1]) + ' ' + P(pts[2][0], pts[2][1]);
      else if (kind === 'quadBezTo' && pts.length >= 2)
        d += 'Q' + P(pts[0][0], pts[0][1]) + ' ' + P(pts[1][0], pts[1][1]);
    }
  }
  return d || null;
}

function prstGeomToPath(spPr, f, T) {
  const m = /<a:prstGeom prst="([a-zA-Z]+)"/.exec(spPr);
  if (!m) return null;
  const P = (x, y) => { const [ax, ay] = apply(T, x, y); return ax.toFixed(1) + ' ' + ay.toFixed(1); };
  if (m[1] === 'rect') {
    return 'M' + P(f.x, f.y) + 'L' + P(f.x + f.w, f.y) + 'L' + P(f.x + f.w, f.y + f.h)
         + 'L' + P(f.x, f.y + f.h) + 'Z';
  }
  if (m[1] === 'ellipse') {
    // quatre courbes cubiques, constante de Kappa
    const k = 0.5522847498, rx = f.w / 2, ry = f.h / 2, cx = f.x + rx, cy = f.y + ry;
    return 'M' + P(cx - rx, cy)
      + 'C' + P(cx - rx, cy - ry * k) + ' ' + P(cx - rx * k, cy - ry) + ' ' + P(cx, cy - ry)
      + 'C' + P(cx + rx * k, cy - ry) + ' ' + P(cx + rx, cy - ry * k) + ' ' + P(cx + rx, cy)
      + 'C' + P(cx + rx, cy + ry * k) + ' ' + P(cx + rx * k, cy + ry) + ' ' + P(cx, cy + ry)
      + 'C' + P(cx - rx * k, cy + ry) + ' ' + P(cx - rx, cy + ry * k) + ' ' + P(cx - rx, cy) + 'Z';
  }
  return null;
}

/* ── Parcours d'un groupe ─────────────────────────────────── */
function collect(nodeXml, tag, T, out) {
  if (tag === 'grpSp') {
    const gp = inner(nodeXml, 'p:grpSpPr');
    const f = readXfrm(gp);
    const T2 = f ? compose(T, groupTransform(f)) : T;
    const body = nodeXml.slice(nodeXml.indexOf('</p:grpSpPr>') + 12, nodeXml.length);
    for (const c of children(body, ['sp', 'grpSp', 'pic', 'cxnSp'])) collect(c.xml, c.tag, T2, out);
    return;
  }
  if (tag !== 'sp') return;
  const spPr = inner(nodeXml, 'p:spPr');
  if (!spPr) return;
  const f = readXfrm(spPr);
  if (!f) return;
  if (f.rot) out.rotated = true;

  const d = custGeomToPath(spPr, f, T) || prstGeomToPath(spPr, f, T);
  if (!d) return;

  // Couleur : on ne retient que le fait qu'il y ait un remplissage.
  const noFill = /<a:noFill\/>/.test(spPr.slice(0, spPr.indexOf('<a:ln') < 0 ? spPr.length : spPr.indexOf('<a:ln')));
  const col = /<a:solidFill><a:srgbClr val="([0-9A-Fa-f]{6})"/.exec(spPr);
  if (noFill && !col) return;   // forme purement decorative sans remplissage
  out.paths.push({ d, color: col ? '#' + col[1].toUpperCase() : '#000000' });
}

/* ── Extraction ───────────────────────────────────────────── */
function slugify(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 44);
}

const catalogue = [];
const seen = new Map();

for (let n = 1; n <= 200; n++) {
  const p = path.join(SLIDES, 'slide' + n + '.xml');
  if (!fs.existsSync(p)) continue;
  const xml = fs.readFileSync(p, 'utf8');
  if (!/<a:custGeom>/.test(xml)) continue;

  const a = xml.indexOf('<p:spTree>'), b = xml.lastIndexOf('</p:spTree>');
  const kids = children(xml.slice(a + 10, b), ['sp', 'grpSp', 'pic', 'cxnSp']);

  const texts = [...xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map(m => m[1].trim()).filter(Boolean);
  const category = texts[0] || 'Divers';

  for (let i = 0; i < kids.length; i++) {
    const k = kids[i];
    if (k.tag !== 'grpSp') continue;

    // libelle : le premier sp texte qui suit, sous le pictogramme
    let label = '';
    for (let j = i + 1; j < Math.min(i + 3, kids.length); j++) {
      if (kids[j].tag !== 'sp') continue;
      const t = [...kids[j].xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map(m => m[1]).join('').trim();
      if (t) { label = t; break; }
    }
    if (!label) continue;

    const gf = readXfrm(inner(k.xml, 'p:grpSpPr'));
    if (!gf) continue;
    const ar = gf.w / gf.h;
    // un pictogramme est a peu pres carre ; au-dela c'est un logotype
    if (ar < 0.45 || ar > 2.4) continue;
    if (gf.w > EMU * 2.2 || gf.h > EMU * 2.2) continue;

    const out = { paths: [], rotated: false };
    collect(k.xml, 'grpSp', IDENT, out);
    if (!out.paths.length) continue;

    // boite reelle des traces
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const pp of out.paths) {
      for (const m of pp.d.matchAll(/(-?\d+\.\d)\s(-?\d+\.\d)/g)) {
        const x = +m[1], y = +m[2];
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
    if (!isFinite(minX) || maxX <= minX || maxY <= minY) continue;

    const w = maxX - minX, h = maxY - minY;
    const scale = 22 / Math.max(w, h);           // 24 avec 1 de marge
    const tx = (24 - w * scale) / 2 - minX * scale;
    const ty = (24 - h * scale) / 2 - minY * scale;

    const norm = out.paths.map(pp => ({
      color: pp.color,
      d: pp.d.replace(/(-?\d+\.\d)\s(-?\d+\.\d)/g,
        (_, X, Y) => (+X * scale + tx).toFixed(2) + ' ' + (+Y * scale + ty).toFixed(2))
    }));

    let slug = slugify(label);
    if (!slug) continue;
    if (seen.has(slug)) { seen.set(slug, seen.get(slug) + 1); slug += '-' + seen.get(slug); }
    else seen.set(slug, 1);

    catalogue.push({
      slug, label, category, slide: n,
      colors: [...new Set(norm.map(x => x.color))],
      paths: norm,
      bytes: norm.reduce((s, x) => s + x.d.length, 0)
    });
  }
}

fs.writeFileSync('catalogue.json', JSON.stringify(catalogue, null, 1));
console.log('pictogrammes extraits : ' + catalogue.length);
const byCat = {};
catalogue.forEach(c => (byCat[c.category] = (byCat[c.category] || 0) + 1));
Object.entries(byCat).sort((a, b) => b[1] - a[1])
  .forEach(([k, v]) => console.log('  ' + String(v).padStart(4) + '  ' + k));
const mono = catalogue.filter(c => c.colors.length === 1).length;
console.log('monochromes : ' + mono + ' / ' + catalogue.length);
console.log('poids median : ' + catalogue.map(c => c.bytes).sort((a, b) => a - b)[Math.floor(catalogue.length / 2)] + ' octets');
