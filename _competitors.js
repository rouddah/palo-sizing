#!/usr/bin/env node
/* ============================================================
   Coherence de data/competitors.js (fichier facultatif).
   ------------------------------------------------------------
   Les champs materiels concurrents (multi-gig, PoE, HA,
   alimentation) suivent la regle des PA : non publie = null,
   jamais une estimation, et chaque valeur publiee porte sa
   source (hwSrc). Ce controle refuse un modele qui y deroge.

     node _competitors.js
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, 'data', 'competitors.js');
if (!fs.existsSync(FILE)) { console.log('Concurrents : fichier absent, controle ignore.'); process.exit(0); }
const { COMPETITORS } = require(FILE);

const errs = [];
const err = (id, m) => errs.push(id + ' : ' + m);
const FIELDS = ['rj45', 'mgig', 'mgigSp', 'poeP', 'haAP', 'haAA', 'haCl', 'haNote', 'psu', 'psuR', 'hwSrc', 'ds', 'dsRev'];
const intOrNull = v => v === null || (Number.isInteger(v) && v >= 0);
const ids = new Set();
const stats = {};

COMPETITORS.models.forEach(m => {
  const id = m.id;
  if (ids.has(id)) err(id, 'id en double'); ids.add(id);
  FIELDS.forEach(f => { if (!(f in m)) err(id, 'champ ' + f + ' absent (null si non publie)'); });
  ['rj45', 'mgig', 'poeP'].forEach(f => { if (!intOrNull(m[f])) err(id, f + ' doit etre un entier ou null'); });
  if (m.mgig > 0 && !m.mgigSp) err(id, 'mgig sans vitesses (mgigSp)');
  if (!(m.mgig > 0) && m.mgigSp) err(id, 'mgigSp sans port multi-gig');
  ['haAP', 'haAA'].forEach(f => { if ([true, false, null].indexOf(m[f]) === -1) err(id, f + ' : true, false ou null'); });
  if ([true, false, 'option', null].indexOf(m.psuR) === -1) err(id, 'psuR : true, false, \'option\' ou null');
  const s = m.hwSrc || {};
  if (m.rj45 != null && !s.ports) err(id, 'ports sans source (hwSrc.ports)');
  if (m.poeP != null && !s.poe) err(id, 'poeP sans source (hwSrc.poe)');
  if ((m.haAP != null || m.haAA != null || m.haCl) && !s.ha) err(id, 'HA sans source (hwSrc.ha)');
  if ((m.haAP != null || m.haAA != null || m.haCl) && !m.haNote) err(id, 'HA sans haNote');
  if ((m.psu || m.psuR != null) && !s.psu) err(id, 'alimentation sans source (hwSrc.psu)');
  if (m.psuR != null && !m.psu) err(id, 'psuR sans description psu');
  if (/—/.test(JSON.stringify(m))) err(id, 'em-dash');
  const st = stats[m.v] || (stats[m.v] = { n: 0 });
  st.n++;
  ['mgig', 'poeP', 'haAP', 'haAA', 'haCl', 'psuR'].forEach(f => { st[f] = (st[f] || 0) + (m[f] != null ? 1 : 0); });
});

Object.keys(stats).forEach(v => {
  const st = stats[v];
  console.log('  ' + v.padEnd(11) + st.n + ' modeles, publies : '
    + ['mgig', 'poeP', 'haAP', 'haAA', 'haCl', 'psuR'].map(f => f + ' ' + st[f]).join(', '));
});
if (errs.length) { console.error('Concurrents : ' + errs.length + ' erreur(s)'); errs.forEach(e => console.error('  - ' + e)); process.exit(1); }
console.log('Concurrents : OK, ' + COMPETITORS.models.length + ' modeles.');
