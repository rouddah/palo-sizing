#!/usr/bin/env node
/* ============================================================
   Fusionne les releves « limites et fonctions » (un fichier par
   editeur, format decrit dans l'en-tete de data/capabilities.js)
   en data/capabilities.js. Les cles courtes de SOURCES sont
   developpees dans chaque source, pour que la cellule affiche la
   reference complete au survol.

     node tools/caps-merge.js tools/caps
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const dir = process.argv[2];
if (!dir) { console.error('usage : node tools/caps-merge.js <dossier>'); process.exit(2); }

const VENDORS = ['pan', 'fortinet', 'checkpoint', 'cisco', 'sophos', 'sonicwall', 'stormshield'];
const NUM = ['ipsec', 'ra', 'vlan', 'virt', 'virtBase', 'rules', 'nat', 'addr', 'addrGrp', 'svc', 'zones', 'routes', 'users', 'sslDec', 'ap', 'sw'];
const FEAT = ['ips', 'av', 'sandbox', 'url', 'dns', 'app', 'tls', 'sdwan', 'ztna', 'raVpn', 'dlp', 'iot', 'ot', 'pqc', 'wifi', 'cell', 'wlc', 'swc', 'ai'];

const out = { vendors: {}, models: {} };
for (const v of VENDORS) {
  const f = path.join(dir, 'caps_' + v + '.js');
  if (!fs.existsSync(f)) { console.warn('absent : ' + f); continue; }
  const { SOURCES = {}, FEATURES = {}, CAPS = {} } = require(path.resolve(f));
  const keys = Object.keys(SOURCES).sort((a, b) => b.length - a.length);
  const expand = t => {
    if (typeof t !== 'string') return t;
    for (const k of keys) {
      if (t === k) return SOURCES[k];
      if (t.startsWith(k + ',') || t.startsWith(k + ' ') || t.startsWith(k + ';') || t.startsWith(k + ':')) return SOURCES[k] + t.slice(k.length);
    }
    return t;
  };
  const expandAll = o => { const r = {}; Object.keys(o || {}).forEach(k => { r[k] = expand(o[k]); }); return r; };
  const features = {}, featSrc = expandAll(FEATURES.featSrc);
  FEAT.forEach(k => { if (k in FEATURES) features[k] = FEATURES[k]; });
  out.vendors[v] = { features, featSrc };
  Object.keys(CAPS).forEach(id => {
    const c = CAPS[id], m = {};
    NUM.forEach(k => { m[k] = c[k] == null ? null : c[k]; });
    m.virtTerm = c.virtTerm || null;
    if (c.feat && Object.keys(c.feat).length) m.feat = c.feat;
    if (c.featSrc && Object.keys(c.featSrc).length) m.featSrc = expandAll(c.featSrc);
    m.src = expandAll(c.src);
    out.models[id] = m;
  });
}

const head = fs.readFileSync(path.join(__dirname, 'caps-header.txt'), 'utf8');
let body = 'const CAPABILITIES = {\n  vendors: {\n';
body += Object.keys(out.vendors).map(v => '    ' + v + ': ' + JSON.stringify(out.vendors[v])).join(',\n');
body += '\n  },\n  models: {\n';
body += Object.keys(out.models).map(id => '    ' + JSON.stringify(id) + ': ' + JSON.stringify(out.models[id])).join(',\n');
body += '\n  }\n};\nif (typeof module !== \'undefined\') module.exports = { CAPABILITIES };\n';
fs.writeFileSync(path.join(__dirname, '..', 'data', 'capabilities.js'), head + body);
console.log('data/capabilities.js : ' + Object.keys(out.vendors).length + ' editeurs, ' + Object.keys(out.models).length + ' modeles');
