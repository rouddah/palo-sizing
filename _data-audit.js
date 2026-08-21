#!/usr/bin/env node
/* ============================================================
   Audit de coherence des donnees PA-Series.
   ------------------------------------------------------------
   Ce controle ne dit PAS si une valeur est conforme a la
   datasheet : seule une lecture de la datasheet le dit. Il dit si
   les valeurs sont coherentes entre elles, et une incoherence est
   une erreur certaine.

   Les invariants viennent de l'architecture d'un NGFW, pas d'une
   convention :

     - le debit Threat Prevention ne peut pas depasser le debit
       App-ID : c'est le meme moteur avec des inspections en plus ;
     - dans une serie, un modele superieur ne peut pas etre
       inferieur sur une metrique de capacite ;
     - les tunnels GlobalProtect ne peuvent pas depasser le nombre
       de sessions concurrentes ;
     - une reference qui existe a un format de SKU stable.

   Une valeur que la datasheet ne publie pas n'est pas une
   incoherence : elle sort en avertissement, pas en erreur. Le
   controle separe ce qui est faux de ce qui manque.

     node _data-audit.js
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, 'data', 'pa-models.js'), 'utf8');
const MODELS = new Function(src + '; return MODELS;')();

const err = [];   // certitudes : incoherence demontrable
const warn = [];  // a verifier a la source

function E(m) { err.push(m); }
function W(m) { warn.push(m); }

/* ── 1. Invariants physiques par modele ─────────────────── */
for (const m of MODELS) {
  const id = m.id.padEnd(16);

  if (!(m.fw > 0))   E(id + 'debit App-ID absent ou nul');
  if (!(m.tp > 0))   E(id + 'debit Threat Prevention absent ou nul');
  if (!(m.sess > 0)) E(id + 'sessions absentes ou nulles');

  /* CPS et VPN IPsec sont portes TBD par les datasheets des series
     annoncees. Absents, ils manquent ; a zero, ils sont faux. */
  if (m.cps === null) W(id + 'CPS non publie par la datasheet');
  else if (!(m.cps > 0)) E(id + 'CPS present mais nul');
  if (m.vpn === null) W(id + 'debit VPN IPsec non publie par la datasheet');
  else if (!(m.vpn > 0)) E(id + 'debit VPN IPsec present mais nul');

  /* Threat Prevention active toutes les inspections par-dessus
     App-ID : son debit lui est necessairement inferieur. */
  if (m.tp > m.fw) E(id + 'TP ' + m.tp + ' > App-ID ' + m.fw + ' : impossible');

  /* Le VPN IPsec ne passe pas non plus par moins de traitement que
     le firewall brut. */
  if (m.vpn > m.fw) W(id + 'VPN ' + m.vpn + ' > App-ID ' + m.fw + ' : a verifier');

  /* Un tunnel GlobalProtect occupe au moins une session. */
  if (m.gp && m.sess && m.gp > m.sess) E(id + 'tunnels GP ' + m.gp + ' > sessions ' + m.sess);

  /* Un chassis sans aucune interface ne se deploie pas. */
  const ports = (m.rj45 || 0) + (m.sfp1 || 0) + (m.sfp10 || 0) + (m.sfp25 || 0) + (m.sfp100 || 0);
  if (ports === 0 && !/7000|7500/.test(m.s)) E(id + 'aucune interface declaree');

  /* Le SKU suit un format stable chez Palo Alto. */
  if (!m.sku) W(id + 'reference chassis non publiee par la datasheet');
  else if (!/^PAN-PA-/.test(m.sku)) W(id + 'SKU hors format habituel : ' + m.sku);

  /* Le ratio CPS / sessions traduit la duree de vie moyenne d'une
     session. En dehors de 5 a 120 s, la valeur merite un controle. */
  if (m.cps && m.sess) {
    const duree = m.sess / m.cps;
    if (duree < 5 || duree > 120) {
      W(id + 'sessions/CPS = ' + duree.toFixed(1) + ' s de duree implicite, hors plage usuelle');
    }
  }

  if (m.poe && !m.poeW) W(id + 'annonce PoE sans budget de puissance');
  if (!m.poe && m.poeW) E(id + 'budget PoE ' + m.poeW + ' W sans PoE');
}

/* ── 2. Monotonie dans une serie ─────────────────────────── */
const bySeries = {};
MODELS.forEach(m => (bySeries[m.s] = bySeries[m.s] || []).push(m));

/* Numero de modele : PA-3430 -> 3430. Le suffixe (-5G, R, POE)
   designe une variante, pas un cran superieur. */
function rang(m) {
  const n = (m.id.match(/PA-(\d+)/) || [])[1];
  return n ? parseInt(n, 10) : 0;
}

for (const [serie, list] of Object.entries(bySeries)) {
  /* Le suffixe -POE marque une variante, mais toute la serie PA-1500 le
     porte : la comparaison reste homogene. */
  const base = list.filter(m => /^PA-\d+(-POE)?$/.test(m.id)).sort((a, b) => rang(a) - rang(b));
  for (let i = 1; i < base.length; i++) {
    const p = base[i - 1], c = base[i];
    ['fw', 'tp', 'vpn', 'sess', 'cps'].forEach(k => {
      if (c[k] != null && p[k] != null && c[k] < p[k]) {
        E(serie + ' : ' + c.id + ' ' + k + '=' + c[k] + ' < ' + p.id + ' ' + k + '=' + p[k]
          + ' : un modele superieur ne peut pas etre en dessous');
      }
    });
  }
}

/* ── 3. Doublons ─────────────────────────────────────────── */
const ids = MODELS.map(m => m.id);
const dupIds = ids.filter((x, i) => ids.indexOf(x) !== i);
if (dupIds.length) E('identifiants en double : ' + [...new Set(dupIds)].join(', '));

const skus = MODELS.map(m => m.sku).filter(Boolean);
const dupSkus = skus.filter((x, i) => skus.indexOf(x) !== i);
if (dupSkus.length) E('SKU en double : ' + [...new Set(dupSkus)].join(', '));

/* ── 4. Fin de commercialisation ─────────────────────────── */
/* Les series annoncees End of Sale par Palo Alto. Un modele d'une
   de ces series doit porter le drapeau, sinon il est propose a la
   vente alors qu'il ne se commande plus. */
const SERIES_EOS = ['PA-800', 'PA-7000'];
MODELS.forEach(m => {
  if (SERIES_EOS.includes(m.s) && !m.eos) E(m.id + ' : serie ' + m.s + ' End of Sale mais drapeau absent');
  if (!SERIES_EOS.includes(m.s) && m.eos) W(m.id + ' : marque EoS hors serie EoS connue, a verifier');
});

/* ── Rapport ─────────────────────────────────────────────── */
console.log('Modeles audites : ' + MODELS.length);
console.log('Series          : ' + Object.keys(bySeries).join(', '));
console.log('');

if (err.length) {
  console.log('INCOHERENCES CERTAINES (' + err.length + ') :');
  err.forEach(e => console.log('  x ' + e));
  console.log('');
}
if (warn.length) {
  console.log('A VERIFIER A LA SOURCE (' + warn.length + ') :');
  warn.forEach(w => console.log('  ? ' + w));
  console.log('');
}
if (!err.length && !warn.length) console.log('Aucune incoherence interne.');

console.log('Rappel : ce controle ne prouve pas la conformite aux datasheets.');
console.log('Il prouve seulement que les valeurs ne se contredisent pas entre elles.');

process.exit(err.length ? 1 : 0);
