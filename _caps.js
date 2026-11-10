#!/usr/bin/env node
/* ============================================================
   Coherence de data/capabilities.js (deuxieme tableau).
   Tout modele du site y figure, chaque limite est un entier
   positif ou nul (non publie), chaque valeur publiee porte sa
   source, les fonctions n'ont que les valeurs prevues.

     node _caps.js
   ============================================================ */
'use strict';
const path = require('path');
const { CAPABILITIES } = require(path.join(__dirname, 'data', 'capabilities.js'));
const fs = require('fs');
const vm = require('vm');
const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, 'data', 'pa-models.js'), 'utf8') + ';this.MODELS=MODELS;', ctx);
const MODELS = ctx.MODELS;
const { COMPETITORS } = require(path.join(__dirname, 'data', 'competitors.js'));

const NUM = ['ipsec', 'ra', 'vlan', 'virt', 'virtBase', 'rules', 'nat', 'addr', 'addrGrp', 'svc', 'zones', 'routes', 'users', 'sslDec', 'ap', 'sw'];
const FEAT = ['ips', 'av', 'sandbox', 'url', 'dns', 'app', 'tls', 'sdwan', 'ztna', 'raVpn', 'dlp', 'iot', 'ot', 'pqc', 'wifi', 'cell', 'wlc', 'swc', 'ai'];
const okFeat = v => v === null || v === true || v === false || v === 'base' || v === 'lic' || v === 'lic-local' || (typeof v === 'string' && v.length <= 40);

const errs = [];
const err = (id, m) => errs.push(id + ' : ' + m);
const all = MODELS.map(m => ['pan', m.id]).concat(COMPETITORS.models.map(m => [m.v, m.id]));
const fill = {};

Object.keys(CAPABILITIES.vendors).forEach(v => {
  const V = CAPABILITIES.vendors[v];
  Object.keys(V.features).forEach(k => {
    if (FEAT.indexOf(k) === -1) err(v, 'fonction inconnue ' + k);
    if (!okFeat(V.features[k])) err(v, k + ' : valeur ' + JSON.stringify(V.features[k]));
    if (V.features[k] != null && !V.featSrc[k]) err(v, k + ' sans source');
  });
});

all.forEach(([v, id]) => {
  const c = CAPABILITIES.models[id];
  if (!c) { err(id, 'absent de capabilities.js'); return; }
  const f = fill[v] || (fill[v] = { n: 0 });
  f.n++;
  NUM.forEach(k => {
    if (!(k in c)) err(id, k + ' absent (null si non publie)');
    const x = c[k];
    if (x != null && !(Number.isInteger(x) && x >= 0)) err(id, k + ' doit etre un entier ou null');
    if (x != null && !(c.src && (c.src[k] || (k === 'virtBase' && c.src.virt)))) err(id, k + ' sans source');
    if (x != null) f[k] = (f[k] || 0) + 1;
  });
  if (c.virtBase != null && c.virt != null && c.virtBase > c.virt) err(id, 'virtBase > virt');
  Object.keys(c.feat || {}).forEach(k => {
    if (FEAT.indexOf(k) === -1) err(id, 'fonction inconnue ' + k);
    if (!okFeat(c.feat[k])) err(id, k + ' : valeur ' + JSON.stringify(c.feat[k]));
    const V = CAPABILITIES.vendors[v];
    if (c.feat[k] != null && !((c.featSrc && c.featSrc[k]) || (V && V.featSrc[k]))) err(id, k + ' sans source');
  });
  if (/—/.test(JSON.stringify(c))) err(id, 'em-dash');
});

Object.keys(fill).forEach(v => {
  const f = fill[v];
  console.log('  ' + v.padEnd(12) + f.n + ' modeles, publies : ' + NUM.filter(k => k !== 'virtBase').map(k => k + ' ' + (f[k] || 0)).join(', '));
});
if (errs.length) { console.error('Capacites : ' + errs.length + ' erreur(s)'); errs.slice(0, 60).forEach(e => console.error('  - ' + e)); process.exit(1); }
console.log('Capacites : OK, ' + all.length + ' modeles.');
