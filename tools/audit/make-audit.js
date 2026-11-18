'use strict';
/* Genere le tableau par modele de AUDIT_EXHAUSTIF_2026-11.md a partir de
   data/pa-models.js et d'une carte des sources par serie.
   node make-audit.js <pa-models.js> <sortie.md> */
const fs = require('fs');
const MODELS = new Function(fs.readFileSync(process.argv[2], 'utf8') + '; return MODELS;')();

const DS = 'https://www.paloaltonetworks.com/resources/datasheets/';
const EOL = 'https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates';
const D = 'https://docs.paloaltonetworks.com/';
const HAP = D + 'ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls';
const HAPM = D + 'compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support';
const CM = D + 'compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls';
const HCO = D + 'ngfw/administration/high-availability/ha-clustering-overview';
const NGC = D + 'ngfw/administration/ngfw-clustering';
const CNC = D + 'ngfw/administration/ngfw-clustering/configure-an-ngfw-cluster';
const CAP = D + 'ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha';
const NF122 = D + 'ngfw/new-features/by-version/panos/12-2';
const RN121 = D + 'ngfw/release-notes/12-1/features-introduced-in-pan-os/hardware-features';
const RN111 = D + 'pan-os/11-1/pan-os-release-notes/features-introduced-in-pan-os/hardware-features';
const HW = s => D + 'hardware/' + s;
const CAT = 'catalogue officiel Palo Alto (liste de references, colonne SKU)';

/* Sources par serie : ds = URL, ed = code de pied de page, puis la page et
   la table de chaque groupe de champs. */
const S = {
  'PA-400':  { ds: DS + 'pa-400-series', ed: 'strata_ds_pa-400-series_022326', perf: 'Table 1 p.6', io: 'Table 3 p.7 (I/O)', mgmt: 'Table 3 p.7 (Management I/O)', poe: 'Table 3 p.7 (Power Over Ethernet) et Power Supply p.7', disk: 'Table 3 p.7 (Storage Capacity)', psu: 'Highlights p.1 (optional redundant power supply), Table 3 p.7-8 (Power Supply, Max Current)', cool: 'Highlights p.1 (fanless) et Table 3 p.8 (Passive cooling)', form: 'Highlights p.1 (desktop form factor), Table 3 p.8 (Dimensions)', ha: 'Highlights p.1 ; ' + HW('pa-400-hardware-reference/pa-400-firewall-overview'), haPorts: HAP + ' (PA-400 : data port) ; ' + HAPM, m5g: 'aucune section Mobile Network Infrastructure', sku: CAT + ' ; ' + EOL + ' (PAN-PA-410 a 460)', gp: 'GlobalProtect non mentionne par la datasheet 02/2026' },
  'PA-400R': { ds: DS + 'pa-400r-series', ed: 'strata_ds_pa-400r_022726', perf: 'Table 1 p.5', io: 'Table 3 p.6 (I/O)', mgmt: 'Table 3 p.6 (Management I/O)', poe: 'Table 3 p.6 (I/O : 1G RJ45 PoE (4)), budget non publie', disk: 'Table 3 p.6 (Storage Capacity)', psu: 'Table 3 p.7 (Input Voltage)', cool: 'Highlights p.1 (fanless) et Table 3 p.7 (Passive cooling)', form: 'Table 3 p.7 (Dimensions), Table 4 p.8 (DIN clip, wall et pole mount)', ha: 'Highlights p.1 ; ' + HW('pa-400r-hardware-reference/pa-400r-firewall-overview'), haPorts: HAPM + ' (PA-450R, PA-455R-5G : aucun) ; non publie pour les autres', m5g: 'aucune section Mobile Network Infrastructure', sku: 'Table 4 p.8 ; PA-455R-5G : ' + CAT, gp: 'GlobalProtect non mentionne par la datasheet 02/2026' },
  'PA-500':  { ds: DS + 'pa-500-series', ed: 'strata_ds_pa-500-series_082026', perf: 'Table 1 p.7', io: 'Table 3 p.8 (I/O)', mgmt: 'Table 3 p.8 (Management I/O)', poe: 'Table 3 p.9 (Power Over Ethernet)', disk: 'Table 3 p.8 (Storage Capacity)', psu: 'Table 3 p.9 (Maximum Current Consumption) et Table 4 p.11 (note : second adaptateur redondant en option)', cool: 'Table 3 p.10 (Passive cooling / Active cooling)', form: 'Table 3 p.10 (Dimensions de bureau), Table 4 p.11 (kits PAN-1RU-4POST-RACK)', ha: 'Highlights p.2 ; ' + HW('pa-500-hardware-reference/pa-500-series-firewall-overview'), haPorts: HAPM + ' (aucun port HA ; PA-501 absent de la matrice)', m5g: 'aucune section Mobile Network Infrastructure', sku: CAT + ' ; PA-520-5G absent', gp: 'Table 2 p.8' },
  'PA-50R':  { ds: DS + 'pa-50r-series', ed: 'strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726', perf: 'Table 1 p.5', io: 'Table 4 p.7 (I/O)', mgmt: 'Table 4 p.7 (Management I/O)', poe: 'nom des modeles ; ports PoE et budget non publies', disk: 'Table 4 p.7 (Storage Capacity : « 128 Gb »)', psu: 'Table 4 p.7 (Input Voltage), Tables 5 a 7 p.8-9 (modules d\'alimentation)', cool: 'Table 4 p.8 (Passive cooling)', form: 'Table 4 p.7 (Mount Options and Dimensions)', ha: 'Table 3 p.6 (High Availability and Clustering) et p.4', haPorts: HAPM + ' (aucun)', m5g: 'Table 3 p.6 (Mobile Network Infrastructure)', sku: 'Tables 5 a 7 p.8-9 : accessoires seulement', gp: 'Table 3 p.6' },
  'PA-800':  { ds: DS + 'pa-800-series-datasheet', ed: 'strata_ds_pa-800-series_071423', perf: 'Table 1 p.4 (valeurs appmix de la paire HTTP/appmix)', io: 'Table 3 p.5 (I/O)', mgmt: 'Table 3 p.5 (Management I/O)', poe: 'sans objet', disk: 'Table 3 p.6 (Storage Capacity)', psu: 'Table 3 p.6 (Power Supply)', cool: 'Table 3 p.6 (Airflow)', form: 'Table 3 p.6 (Rack Mount)', ha: 'Table 2 p.5 (High Availability)', haPorts: 'Table 3 p.5 ; ' + HAP, m5g: 'aucune section Mobile Network Infrastructure', sku: CAT + ' ; ' + EOL, gp: 'Table 2 p.5' },
  'PA-1400': { ds: DS + 'pa-1400-series', ed: 'strata_ds_pa-1400-series_012726', perf: 'Table 1 p.5', io: 'Table 3 p.7 (I/O)', mgmt: 'Table 3 p.7 (Management I/O)', poe: 'Table 3 p.7 (Power over Ethernet) et I/O', disk: 'Table 3 p.7 (Storage Capacity)', psu: 'Table 3 p.7 (Power Supply)', cool: 'Table 3 p.7 (Airflow)', form: 'Table 3 p.7 (Rack Mount Dimensions)', ha: 'Table 2 p.6 (High Availability)', haPorts: 'Table 3 p.7 ; ' + HAP + ' ; ' + HAPM, m5g: 'aucune section Mobile Network Infrastructure', sku: CAT, gp: 'Table 2 p.6' },
  'PA-1500': { ds: DS + 'pa-1500-series', ed: 'strata_ds_pa-1500-series-quantum-optimized-ngfws_091126', perf: 'Table 1 p.6', io: 'Table 3 p.8 (I/O)', mgmt: 'Table 3 p.8 (Management I/O)', poe: 'Highlights p.3 (16 ports PoE++ 90 W) et Table 3 p.8 (Power over Ethernet)', disk: 'Table 3 p.8 (Storage Capacity)', psu: 'Table 3 p.8 (Power Supplies)', cool: 'Table 3 p.9 (Airflow)', form: 'Table 3 p.9 (Rack Mount Dimensions)', ha: 'Table 2 p.7 (High Availability ; failure detection : future release)', haPorts: 'Table 3 p.8 ; ' + HAP, m5g: 'Table 2 p.7 (Mobile Network Infrastructure : 5G Security)', sku: 'Table 4 p.10', gp: 'Table 2 p.7' },
  'PA-3400': { ds: DS + 'pa-3400-series', ed: 'strata_ds_pa-3400-series_021126', perf: 'Table 1 p.5', io: 'Table 3 p.7 (I/O)', mgmt: 'Table 3 p.7 (Management I/O)', poe: 'sans objet', disk: 'Table 3 p.7 (Storage Capacity)', psu: 'Table 3 p.7 (Power Supply)', cool: 'Table 3 p.7 (Airflow)', form: 'Table 3 p.7 (Rack Mount Dimensions)', ha: 'Table 2 p.6 ; ' + HCO + ' (PA-3400 : 6 membres)', haPorts: 'Table 3 p.7 ; ' + HAP, m5g: 'Table 2 p.6 (Mobile Network Infrastructure, PA-3440 et PA-3430 seulement)', sku: CAT, gp: 'Table 2 p.6' },
  'PA-3500': { ds: DS + 'pa-3500-series', ed: 'strata_ds_pa-3500-series-quantum-optimized-ngfws_102026', perf: 'Table 1 p.6', io: 'Table 3 p.7 (I/O)', mgmt: 'Table 3 p.7 (Management I/O)', poe: 'sans objet', disk: 'Table 3 p.7 (Storage Capacity)', psu: 'Table 3 p.7-8 (Power Supply, Power Supplies)', cool: 'Table 3 p.8 (Airflow)', form: 'Table 3 p.8 (Rack Mount Dimensions) et Table 4 p.9 (kits 1RU / 2RU)', ha: 'Table 2 p.7 (HA active/passive, NGFW clustering with active/active : future release) ; ' + CNC + ' ; ' + NF122, haPorts: 'Table 3 p.7 ; ' + HAP, m5g: 'Table 2 p.7 (Mobile Network Infrastructure : 5G Security)', sku: 'Table 4 p.9', gp: 'Table 2 p.7' },
  'PA-5400': { ds: DS + 'pa-5400-series', ed: 'strata_ds_pa-5400-series_041426', perf: 'Table 1 p.6', io: 'Table 3 p.7 (I/O)', mgmt: 'Table 3 p.7 (Management I/O)', poe: 'sans objet', disk: 'Table 3 p.7 (Storage Capacity)', psu: 'Table 3 p.7-8 (Power Supplies, Max Current AC et DC)', cool: 'Table 3 p.8 (Airflow)', form: 'Table 3 p.8 (Rack Mount Dimensions)', ha: 'Table 2 p.7 ; ' + HCO + ' (PA-5410 a PA-5445 : 8 membres)', haPorts: 'Table 3 p.7 ; ' + HAP + ' ; ' + HAPM, m5g: 'Table 2 p.7 (5G, GTP, SCTP Security)', sku: CAT, gp: 'Table 2 p.6-7' },
  'PA-5500': { ds: DS + 'pa-5500-series', ed: 'strata_ds_pa-5500-series_081926', perf: 'Table 1 p.6', io: 'Table 3 p.7 (I/O)', mgmt: 'Table 3 p.7 (Management I/O)', poe: 'sans objet', disk: 'Table 3 p.8 (Storage Capacity)', psu: 'Table 3 p.8 (Power Supplies, Power Supply Output) et Table 4 p.10', cool: 'Table 3 p.9 (Airflow), Table 4 p.10 (5x PAN-PA-FAN-2RU-A)', form: 'Table 3 p.9 (Rack Mount Dimensions)', ha: 'Table 2 p.7 ; ' + CAP + ' (A/A non supporte) ; ' + NGC + ' ; ' + NF122, haPorts: 'Table 3 p.7 ; ' + HAP, m5g: 'Table 2 p.7 (Mobile Network Infrastructure : 5G security)', sku: 'Table 4 p.10', gp: 'Table 2 p.6-7' },
  'PA-7000': { ds: DS + 'pa-7000-series', ed: 'strata_ds_pa-7000-series_071624', perf: 'Table 1 p.5 (systeme complet)', io: 'Table 3 p.6 (Full System)', mgmt: 'Table 3 p.6 (PA-7050-SMC-B / PA-7080-SMC-B)', poe: 'sans objet', disk: 'Table 3 p.6', psu: 'Table 3 p.6 (Power supplies base/max)', cool: 'non publie', form: 'Table 3 p.7 (Rack mount)', ha: 'Table 2 p.6 ; ' + HCO + ' (PA-7050 : 6, PA-7080 : 4)', haPorts: 'Table 3 p.6 ; ' + HAP, m5g: 'Table 2 p.6 (5G, GTP, SCTP Security)', sku: EOL + ' (PAN-PA-7050-AC-SYS, PAN-PA-7080-AC-SYS)', gp: 'Table 2 p.6' },
  'PA-7500': { ds: DS + 'pa-7500', ed: 'strata_ds_pa-7500_031126', perf: 'Table 1 p.5 (6 DPC-A + 2 NPC-A)', io: 'Table 3 p.6 (I/O each PA-7500-NPC-A)', mgmt: 'Table 3 p.6 (Management I/O each PA-7500-MPC-A)', poe: 'sans objet', disk: 'non publie', psu: 'Table 3 p.7 (Power Supplies, AC/DC)', cool: 'Table 3 p.7 (Airflow)', form: 'Table 3 p.7 (Rack Mount Dimensions)', ha: 'Table 2 p.6 (NGFW Clustering, active-passive, PAN-OS 12.1.5 minimum) ; ' + CAP + ' (A/A non supporte) ; ' + NGC, haPorts: HAP + ' (HSCI-A/B sur MPC)', m5g: 'aucune section Mobile Network Infrastructure', sku: CAT + ' (PAN-PA-7500-A-SYS : chassis assembly)', gp: 'Table 2 p.6' },
};
const PANOS_SRC = {
  'PA-410': CM, 'PA-415': CM, 'PA-415-5G': RN111 + ' ; ' + CM, 'PA-445': CM, 'PA-455': CM, 'PA-455-5G': CM,
  'PA-410R': RN111 + ' ; ' + CM, 'PA-410R-5G': CM, 'PA-450R': RN111 + ' ; ' + CM, 'PA-450R-5G': RN111 + ' ; ' + CM, 'PA-455R-5G': RN121,
  'PA-501': RN121 + ' ; ' + CM, 'PA-505': RN121 + ' ; ' + CM, 'PA-510': RN121 + ' ; ' + CM, 'PA-520-5G': RN121 + ' ; ' + CM,
  'PA-1410': CM, 'PA-1420': CM, 'PA-5440': CM, 'PA-5445': RN111, 'PA-7500': RN111 + ' ; ' + CM,
};
function panosSrc(m) {
  if (PANOS_SRC[m.id]) return PANOS_SRC[m.id];
  if (m.s === 'PA-500') return RN121;
  if (m.s === 'PA-50R') return HW('pa-50r-hardware-reference/pa-50r-series-firewall-overview') + ' (First Supported PAN-OS release)';
  if (m.s === 'PA-1500') return HW('pa-1500-hardware-reference/pa-1500-series-firewall-overview') + ' (First Supported PAN-OS Software Release)';
  if (m.s === 'PA-3500') return HW('pa-3500-hardware-reference/pa-3500-series-firewall-overview') + ' (First Supported PAN-OS Software Release)';
  if (m.s === 'PA-5500') return HW('pa-5500-hardware-reference/pa-5500-series-firewall-overview');
  if (m.s === 'PA-3400' || m.s === 'PA-5400') return CM;
  return CM + ' (colonnes a partir de 10.1 : premiere version non publiee)';
}
const v = x => x === null || x === undefined ? '*non publie*' : x === true ? 'oui' : x === false ? 'non' : String(x).replace(/\|/g, '/');
const n = x => x == null ? '*non publie*' : x;

let out = '';
for (const m of MODELS) {
  const s = S[m.s];
  const P = s.ed + ', ';
  const rows = [
    ['Debit firewall appmix (fw, Gbps)', n(m.fw), P + s.perf],
    ['Threat Prevention appmix (tp, Gbps)', n(m.tp), P + s.perf],
    ['IPsec VPN (vpn, Gbps)', n(m.vpn), P + s.perf],
    ['Sessions max (sess)', n(m.sess), P + s.perf],
    ['Nouvelles sessions/s (cps)', n(m.cps), P + s.perf],
    ['Systemes virtuels base/max (vsys)', v(m.vsys), P + s.perf],
    ['Cuivre RJ45 1G (rj45)', m.rj45, P + s.io],
    ['Cuivre multi-gig (mgig, mgigSp)', m.mgig + (m.mgigSp ? ' (' + m.mgigSp + ')' : ''), P + s.io],
    ['Combo SFP/RJ45 1G (combo)', m.combo, P + s.io],
    ['SFP 1G (sfp1)', m.sfp1, P + s.io],
    ['SFP+ 10G (sfp10)', m.sfp10, P + s.io],
    ['SFP28 25G (sfp25)', m.sfp25, P + s.io],
    ['QSFP28 100G (sfp100)', m.sfp100, P + s.io],
    ['SFP-DD 100G (sfpdd)', m.sfpdd, P + s.io],
    ['QSFP-DD 400G (sfp400)', m.sfp400, P + s.io],
    ['Libelle I/O (io)', v(m.io), P + s.io],
    ['PoE (poe) / ports PoE (poeP) / budget (poeW)', v(m.poe) + ' / ' + v(m.poeP) + ' / ' + (m.poeW == null ? '*non publie*' : m.poeW + ' W'), P + s.poe],
    ['Ports de gestion (mgmt)', v(m.mgmt), P + s.mgmt],
    ['Format (f)', v(m.f), P + s.form],
    ['Stockage (disk)', v(m.disk), P + s.disk],
    ['Alimentation (psu)', v(m.psu), P + s.psu],
    ['Refroidissement (cool)', v(m.cool), P + s.cool],
    ['HA actif/passif (haAP)', v(m.haAP), P + s.ha],
    ['HA actif/actif classique (haAA)', v(m.haAA), P + s.ha],
    ['Clustering (haCl)', v(m.haCl), P + s.ha],
    ['Ports HA dedies (haPorts)', v(m.haPorts), s.haPorts],
    ['5G Security (m5g)', v(m.m5g), P + s.m5g],
    ['GlobalProtect', /PA-400/.test(m.s) ? '*non publie*' : 'oui', P + s.gp],
    ['Reference (sku)', v(m.sku), s.sku],
    ['PAN-OS minimal (panosMin)', v(m.panosMin), panosSrc(m)],
    ['Dernier PAN-OS (panosMax)', v(m.panosMax), m.panosMax ? EOL : 'non publie (aucune annonce de fin de vie)'],
    ['End of Sale / End of Life (eosD / eolD, eos)', v(m.eosD) + ' / ' + v(m.eolD) + ', eos ' + v(m.eos), m.eosD ? EOL : EOL + ' (modele absent)'],
    ['PAN-OS des mesures (dsOs)', v(m.dsOs), P + s.perf + ' (Note)'],
    ['Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf)',
      [m.gp, m.zones, m.policies, m.ipsec, m.ssl, m.addr, m.nat, m.sdwanT, m.sdwanR, m.secProf].map(x => x == null ? '-' : x).join(' / '),
      [m.gp, m.zones, m.policies].some(x => x != null) ? 'edition anterieure de la datasheet, non publiees par l\'edition courante : [a confirmer]' : 'non publiees'],
  ];
  out += '\n### ' + m.id + ' (' + m.s + ')\n\nDatasheet : ' + s.ds + ' (`' + s.ed + '`)\n\n| Champ | Valeur | Source |\n| --- | --- | --- |\n'
    + rows.map(r => '| ' + r.join(' | ') + ' |').join('\n') + '\n';
}
fs.writeFileSync(process.argv[3], out);
console.log('ok', MODELS.length);
