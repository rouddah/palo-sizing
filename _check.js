#!/usr/bin/env node
/* ============================================================
   Verification du site avant deploiement.
   ------------------------------------------------------------
   Le projet n'a pas d'etape de build : `npm run build` n'existe
   pas et ne doit pas exister (HTML/CSS/JS servis tels quels par
   Cloudflare Pages). Ce script tient donc le role de garde-fou :
   il ne compile rien, il verifie.

     node _check.js

   1. syntaxe de chaque fichier .js du depot
   2. syntaxe de chaque bloc <script> inline des pages
   3. equilibrage des accolades de styles.css
   4. references d'assets locaux (src, href, url(...)) qui pointent
      dans le vide
   5. appels externes (CDN) : le projet s'interdit toute dependance
      tierce a l'execution, RGPD
   6. emojis residuels dans le contenu rendu

   Sortie non nulle si une verification echoue.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;
const problems = [];
const notes = [];

const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
const jsFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.js') && f !== '_check.js')
  .concat(fs.readdirSync(path.join(ROOT, 'data')).map(f => 'data/' + f));

/* ── 1 + 2. Syntaxe JavaScript ─────────────────────────────── */
function checkScript(src, label) {
  try {
    new vm.Script(src, { filename: label });
    return true;
  } catch (e) {
    problems.push(label + ' : ' + e.message.split('\n')[0]);
    return false;
  }
}

jsFiles.forEach(f => checkScript(fs.readFileSync(path.join(ROOT, f), 'utf8'), f));

const INLINE = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi;
htmlFiles.forEach(f => {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  let m, n = 0;
  while ((m = INLINE.exec(html))) {
    n++;
    if (m[1].trim()) checkScript(m[1], f + ' <script #' + n + '>');
  }
});

/* ── 3. Accolades CSS ──────────────────────────────────────── */
const css = fs.readFileSync(path.join(ROOT, 'styles.css'), 'utf8');
let depth = 0, minDepth = 0;
for (const c of css) {
  if (c === '{') depth++;
  else if (c === '}') { depth--; if (depth < minDepth) minDepth = depth; }
}
if (depth !== 0 || minDepth !== 0) {
  problems.push('styles.css : accolades desequilibrees (solde ' + depth + ', min ' + minDepth + ')');
}

/* ── 4. Assets locaux referencies ──────────────────────────── */
const REF = /(?:src|href)\s*=\s*["']([^"'#?]+)["']|url\(\s*['"]?([^'")]+)['"]?\s*\)/gi;
const seen = new Set();
htmlFiles.concat(['styles.css']).forEach(f => {
  const txt = fs.readFileSync(path.join(ROOT, f), 'utf8');
  let m;
  while ((m = REF.exec(txt))) {
    const ref = (m[1] || m[2] || '').trim();
    if (!ref || /^(https?:|data:|mailto:|tel:|#|\/\/)/i.test(ref)) continue;
    // reference construite en JS (template literal) : rien a verifier ici
    if (ref.indexOf('${') !== -1) continue;
    const key = f + '|' + ref;
    if (seen.has(key)) continue;
    seen.add(key);
    if (!fs.existsSync(path.join(ROOT, ref))) {
      problems.push(f + ' : reference introuvable -> ' + ref);
    }
  }
});

/* ── 5. Dependances externes a l'execution ─────────────────── */
const CDN = /(fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net|unpkg\.com|cdnjs\.cloudflare\.com|ajax\.googleapis\.com)/i;
htmlFiles.concat(['styles.css'], jsFiles).forEach(f => {
  const txt = fs.readFileSync(path.join(ROOT, f), 'utf8');
  txt.split('\n').forEach((line, i) => {
    const hit = line.match(CDN);
    if (hit) problems.push(f + ':' + (i + 1) + ' : appel CDN externe -> ' + hit[1]);
  });
});

/* ── 5bis. Cibles getElementById reellement presentes ────────
   La panne la plus courante sur ce site : un identifiant renomme dans le
   markup mais pas dans le script. Rien ne casse au chargement, la
   fonctionnalite disparait juste en silence. */
htmlFiles.forEach(f => {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  const ids = new Set();
  let m;
  const ID = /\sid\s*=\s*["']([^"']+)["']/g;
  while ((m = ID.exec(html))) ids.add(m[1]);
  const GET = /getElementById\(\s*["']([A-Za-z][\w-]*)["']\s*\)/g;
  const missing = new Set();
  while ((m = GET.exec(html))) {
    if (!ids.has(m[1])) missing.add(m[1]);
  }
  missing.forEach(id => problems.push(f + " : getElementById('" + id + "') sans element correspondant"));
});

/* ── 5ter. Les compteurs de l accueil correspondent aux donnees ──
   L accueil annoncait 39 modeles PA-Series alors que data/pa-models.js
   en contient 33. Sur un outil dont toute la valeur est l exactitude
   des chiffres, un compteur decoratif qui derive est un bug de
   credibilite. Il est desormais adosse a la donnee. */
try {
  const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const counts = {};
  let cm;
  const CNT = /data-count="(\d+)"/g;
  const found = [];
  while ((cm = CNT.exec(home))) found.push(+cm[1]);

  const sizeOf = (file, name) => {
    const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
    return new Function(src + '; return ' + name + ';')().length;
  };
  counts.models = sizeOf('data/pa-models.js', 'MODELS');
  counts.optics = sizeOf('data/pa-optics.js', 'OPTICS');
  counts.accessories = sizeOf('data/pa-accessories.js', 'ACCESSORIES');

  const expected = [counts.models, counts.optics, counts.accessories];
  expected.forEach((want, i) => {
    if (found[i] !== want) {
      problems.push('index.html : compteur ' + (i + 1) + ' affiche ' + found[i]
        + ' alors que la donnee en contient ' + want);
    }
  });
} catch (e) {
  problems.push('controle des compteurs impossible : ' + e.message);
}

/* ── 6. Emojis residuels ───────────────────────────────────── */
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u;
htmlFiles.concat(jsFiles).forEach(f => {
  const txt = fs.readFileSync(path.join(ROOT, f), 'utf8');
  txt.split('\n').forEach((line, i) => {
    if (EMOJI.test(line)) notes.push(f + ':' + (i + 1) + ' : emoji -> ' + line.trim().slice(0, 80));
  });
});

/* ── Rapport ───────────────────────────────────────────────── */
console.log('Fichiers JS verifies      : ' + jsFiles.length);
console.log('Pages HTML verifiees      : ' + htmlFiles.length);
console.log('References locales testees: ' + seen.size);

if (notes.length) {
  console.log('\nEmojis restants (' + notes.length + ') :');
  notes.forEach(n => console.log('  . ' + n));
}

if (problems.length) {
  console.log('\nECHEC - ' + problems.length + ' probleme(s) :');
  problems.forEach(p => console.log('  x ' + p));
  process.exit(1);
}
console.log('\nOK - aucune regression detectee.');
