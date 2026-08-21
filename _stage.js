#!/usr/bin/env node
/* ============================================================
   Prepare le dossier a deployer.
   ------------------------------------------------------------
   `wrangler pages deploy .` envoyait tout le depot : les scripts
   de verification, le CHANGELOG, NEXT_SESSION.md, _to_verify.md,
   package.json. Rien de secret, mais ce sont des notes internes,
   et NEXT_SESSION.md indiquait publiquement ou vit le token
   Cloudflare sur le poste.

   Pages n'honore ni .gitignore ni .assetsignore : la seule methode
   fiable est de deployer un dossier qui ne contient QUE le site.

     node _stage.js          -> reconstruit .deploy/
     npm run deploy          -> stage + wrangler

   Liste blanche volontaire : un fichier non liste n'est pas publie.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = path.join(ROOT, '.deploy');

/* Fichiers racine publies : les pages, plus les scripts et la
   feuille de style qu'elles chargent. */
const ROOT_FILES = ['styles.css', 'header.js', 'ui.js', 'icons.js', 'links.js', 'bg.js'];
/* Dossiers publies en entier */
const DIRS = ['data', 'img', 'fonts'];

function rmrf(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  let n = 0;
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) n += copyDir(s, d);
    else { fs.copyFileSync(s, d); n++; }
  }
  return n;
}

rmrf(OUT);
fs.mkdirSync(OUT, { recursive: true });

let count = 0;

// les pages
for (const f of fs.readdirSync(ROOT)) {
  if (f.endsWith('.html')) { fs.copyFileSync(path.join(ROOT, f), path.join(OUT, f)); count++; }
}
// les scripts et styles charges par les pages
for (const f of ROOT_FILES) {
  if (!fs.existsSync(path.join(ROOT, f))) { console.error('MANQUANT : ' + f); process.exit(1); }
  fs.copyFileSync(path.join(ROOT, f), path.join(OUT, f));
  count++;
}
// les dossiers d'assets
for (const d of DIRS) {
  if (!fs.existsSync(path.join(ROOT, d))) { console.error('MANQUANT : ' + d + '/'); process.exit(1); }
  count += copyDir(path.join(ROOT, d), path.join(OUT, d));
}

/* Garde-fou 1 : tout fichier local reference par une page doit avoir
   ete copie. La liste blanche protege des fuites mais laisse tomber en
   silence les fichiers nouvellement ajoutes. bg.js est parti en
   production absent du bundle : la page appelait un 404 et aucun
   controle ne s en plaignait. */
const referenced = new Set();
for (const f of fs.readdirSync(OUT)) {
  if (!f.endsWith('.html')) continue;
  const html = fs.readFileSync(path.join(OUT, f), 'utf8');
  const RE = /(?:src|href)\s*=\s*["']([^"'#?:]+\.(?:js|css))["']/g;
  let m;
  while ((m = RE.exec(html))) {
    if (/^(https?:)?\/\//.test(m[1])) continue;
    referenced.add(m[1]);
  }
}
const absent = [...referenced].filter(r => !fs.existsSync(path.join(OUT, r)));
if (absent.length) {
  console.error('ECHEC - fichiers appeles par les pages mais absents du bundle :');
  absent.forEach(a => console.error('  x ' + a + '   (a ajouter a ROOT_FILES)'));
  process.exit(1);
}

/* Garde-fou : rien d'interne ne doit s'etre glisse dans le lot. */
const FORBIDDEN = /^(_|package|CHANGELOG|NEXT_SESSION|AUDIT|PA-Series-Complete)/;
const leaked = [];
(function walk(dir, rel) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const r = rel ? rel + '/' + e.name : e.name;
    if (e.isDirectory()) walk(path.join(dir, e.name), r);
    else if (FORBIDDEN.test(e.name) || e.name.endsWith('.md') || e.name.endsWith('.py')) leaked.push(r);
  }
})(OUT, '');

if (leaked.length) {
  console.error('ECHEC - fichiers internes dans le bundle :');
  leaked.forEach(f => console.error('  x ' + f));
  process.exit(1);
}

console.log('.deploy/ pret : ' + count + ' fichiers, aucun fichier interne.');
