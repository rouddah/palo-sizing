// Stormshield SNS : limites de configuration et fonctions de sécurité, par modèle.
// Relevé du 2026-11-10. Logiciel de référence : SNS 5.0.x (5.0.9 = dernière 5.0 publiée ; 5.1.x en EA).
// Règle : valeur publiée par Stormshield ou null. Aucune estimation.
const SOURCES = {
  mx: 'https://www.stormshield.com/wp-content/uploads/SNS-EN-Appliances-Matrix.pdf (Matrix Technical Specifications, Copyright Stormshield 2026.10.22, mesures « version 5.x » ; p.2 « Solutions for infrastructures », p.1 « Solutions for specific environments »)',
  ds: 'datasheet du modèle (champ ds de data/competitors.js), p.6 tableaux VPN et SYSTEM, « features mentioned are for version 5.x »',
  dsPack: 'datasheet du modèle (champ ds de data/competitors.js), page SERVICE PACKS (p.7 ou p.8 selon le modèle) : Essential / Industrial / Premium Security Pack',
  dsFeat: 'datasheet du modèle (champ ds de data/competitors.js), page FEATURES (p.5) : USAGE CONTROL, PROTECTION FROM THREATS, CONFIDENTIALITY, NETWORK - INTEGRATION',
  xr: 'https://www.stormshield.com/wp-content/uploads/SNS-EN-SNxr1200-Datasheet.pdf (Version 1.7, Copyright Stormshield 2024), p.2 TECHNICAL SPECIFICATIONS et FEATURES',
  ucm: 'https://documentation.stormshield.eu/SNS/v5/en/Content/PDF/SNS-UserGuides/sns-en-user_configuration_manual-v5.0.8.pdf (SNS User Configuration Manual v5.0.8, 08/11/2026)',
  rn502: 'https://documentation.stormshield.eu/SNS/v5/en/Content/Release_Notes_SNS/5.0.2-Features.htm (New features in SNS 5.0.2, section « IPsec VPN - Hybrid cryptography for post-quantum encryption »)'
};

const FEATURES = {
  ips: 'lic', av: 'lic', sandbox: 'lic', url: 'lic', dns: null, app: 'lic', tls: 'lic', sdwan: 'lic', ztna: 'lic',
  raVpn: 'lic', dlp: null, iot: null, ot: 'lic', pqc: 'lic', wifi: false, cell: null, wlc: null, swc: null, ai: null,
  featSrc: {
    ips: 'dsPack : ligne « IPS/IDS » cochée dans Essential (et Industrial pour SNi) et Premium Security Pack ; Stormshield ne publie aucune offre matérielle sans pack, d\'où lic',
    av: 'dsPack : ligne « Antimalware » = Option dans Essential, incluse dans Premium (et Option dans Industrial) ; dsFeat : « Embedded antivirus (HTTP, SMTP, POP3, FTP) »',
    sandbox: 'dsPack : ligne « Breach Fighter AI-powered sandboxing » (sandbox cloud) = Option dans Essential/Industrial, incluse dans Premium ; dsFeat : « Cloud based Sandbox on the European territory (option) » ; analyse hors boîtier, donc lic et non lic-local',
    url: 'dsPack : ligne « Extended Web Control (URL filtering) » = Option dans Essential/Industrial, incluse dans Premium ; xr : « URL filtering (embedded database or cloud mode) »',
    dns: 'non publié : aucune fonction de blocage de domaines au niveau DNS décrite dans dsFeat ni dans ucm (seulement « DNS proxy-cache ») ; la ligne de pack « Threat intelligence (IP & domains) » ne précise pas un filtrage DNS',
    app: 'dsPack : ligne « Layer 7 Firewall » cochée dans tous les packs ; dsFeat : « Application detection and management »',
    tls: 'dsFeat : « SSL decryption and inspection » (PROTECTION FROM THREATS) ; ucm : module SSL FILTERING ; fonction du moteur, rattachée au pack NGFW (pas de ligne dédiée dans dsPack)',
    sdwan: 'dsPack : section « Secure SD-WAN & ZTNA » cochée dans tous les packs ; dsFeat : « SD-WAN » ; ucm : module SD-WAN',
    ztna: 'dsPack : section « Secure SD-WAN & ZTNA » (Device posture assessment) cochée dans tous les packs ; dsFeat : « Zero Trust Network Access (ZTNA) » ; ucm : onglets ZTNA du module SSL VPN',
    raVpn: 'dsPack : lignes « SSL VPN gateway & client » et « IPsec VPN gateway » cochées dans tous les packs ; dsFeat : « Remote SSL VPN access in multi-OS tunnel mode »',
    dlp: 'non publié : aucune fonction DLP dans dsFeat, dsPack ni ucm',
    iot: 'non publié : aucune fonction de profilage IoT dans dsFeat, dsPack ni ucm',
    ot: 'dsPack : ligne « Industrial protocols DPI » = Option dans Essential, incluse dans Industrial (SNi) et Premium ; mx p.1 « INDUSTRIAL PROTOCOLS » : Modbus, UMAS, S7, EtherNet/IP, CIP, OPC UA, BACnet/IP, PROFINET, IEC 60870-5-104, IEC 61850…',
    pqc: 'rn502 : « As of SNS version 5.0, hybrid cryptography… ML-KEM-512, ML-KEM-768, ML-KEM-1024 », profils PQCEncryption et PQCTransition ; dsPack : ligne « Postquantum encryption » cochée dans tous les packs',
    wifi: 'mx 2026.10.22 et datasheets : aucun modèle de la gamme actuelle ni variante avec Wi-Fi (ucm « Wi-Fi interface (WLAN) » ne concerne que d\'anciens modèles équipés d\'une carte Wi-Fi)',
    cell: 'non publié par modèle : ucm p.232 décrit une interface « USB/Ethernet (for USB key/modem) » pour clé modem 4G USB, mais aucune datasheet de la gamme actuelle ne publie de port USB ni de 4G (sauf SNxr1200 : 4 ports USB 2.0, sans mention de modem)',
    wlc: 'non publié : aucune gestion de points d\'accès décrite dans dsFeat ni ucm',
    swc: 'non publié : aucune gestion de commutateurs décrite dans dsFeat ni ucm',
    ai: 'non publié : la seule mention IA est « Breach Fighter AI-powered sandboxing » (sandbox cloud, déjà comptée dans sandbox) ; pas de détection en ligne par apprentissage automatique publiée'
  }
};

// Champs non publiés pour toute la gamme : virt / virtBase / virtTerm (aucun contexte virtuel sur SNS matériel),
// nat, addr, addrGrp, svc, zones, users, sslDec, ap, sw.
const NP = { virt: null, virtBase: null, virtTerm: null, nat: null, addr: null, addrGrp: null, svc: null, zones: null, users: null, sslDec: null, ap: null, sw: null };
const VLAN_LBL = 'mx, ligne « Max number of logical interfaces (agg, dialups, GRE, ipsec, loopback, pptp, vlans) » : plafond COMMUN à toutes les interfaces logiques, VLAN compris (pas de maximum VLAN seul publié)';
const RULES_LBL = 'ligne « Number of rules (recommanded / specific conf.) » : valeur retenue = « specific conf. » (maximum), valeur recommandée entre parenthèses';
const RA_LBL = '« Nb of SSL VPN clients » (ds) = « Nb of SSL VPN tunnels » (mx) ; aucun chiffre publié pour les clients IPsec mobiles';
const IPSEC_LBL = '« Nb of IPsec VPN tunnels (1024 kbps per tunnel) »';

function m(o) { return Object.assign({}, NP, o); }

const CAPS = {
  'SNS-XS-170':  m({ ipsec:200,   ra:200,  vlan:137,  rules:2048,  routes:512,   feat:{}, src:{ ipsec:'mx p.2 et ds p.6 (2025.10.15), '+IPSEC_LBL+' : 200', ra:'mx p.2 et ds p.6 : 200 ; '+RA_LBL, vlan:VLAN_LBL+' : 137', rules:'mx p.2 et ds p.6, '+RULES_LBL+' : 2,048 (1,024)', routes:'mx p.2 et ds p.6, « Max number of static routes » : 512' } }),
  'SNS-S-220':   m({ ipsec:300,   ra:300,  vlan:393,  rules:8192,  routes:512,   feat:{}, src:{ ipsec:'mx p.2 et ds p.6 (2026.10.13), '+IPSEC_LBL+' : 300', ra:'mx p.2 et ds p.6 : 300 ; '+RA_LBL, vlan:VLAN_LBL+' : 393', rules:'mx p.2 et ds p.6, '+RULES_LBL+' : 8,192 (2,048)', routes:'mx p.2 et ds p.6, « Max number of static routes » : 512' } }),
  'SNS-S-320':   m({ ipsec:400,   ra:400,  vlan:393,  rules:8192,  routes:512,   feat:{}, src:{ ipsec:'mx p.2 et ds p.6 (2026.10.13), '+IPSEC_LBL+' : 400', ra:'mx p.2 et ds p.6 : 400 ; '+RA_LBL, vlan:VLAN_LBL+' : 393', rules:'mx p.2 et ds p.6, '+RULES_LBL+' : 8,192 (2,048)', routes:'mx p.2 et ds p.6, « Max number of static routes » : 512' } }),
  'SNS-M-520':   m({ ipsec:1500,  ra:500,  vlan:1336, rules:16384, routes:5120,  feat:{}, src:{ ipsec:'mx p.2 et ds p.6 (2026.01.06), '+IPSEC_LBL+' : 1,500', ra:'mx p.2 et ds p.6 : 500 ; '+RA_LBL, vlan:VLAN_LBL+' : 1,336', rules:'mx p.2 et ds p.6, '+RULES_LBL+' : 16,384 (4,096)', routes:'mx p.2 et ds p.6, « Max number of static routes » : 5,120' } }),
  'SNS-M-720':   m({ ipsec:2000,  ra:700,  vlan:1336, rules:32768, routes:5120,  feat:{}, src:{ ipsec:'mx p.2 et ds p.6 (2025.10.15), '+IPSEC_LBL+' : 2,000', ra:'mx p.2 et ds p.6 : 700 ; '+RA_LBL, vlan:VLAN_LBL+' : 1,336', rules:'mx p.2 et ds p.6, '+RULES_LBL+' : 32,768 (8,192)', routes:'mx p.2 et ds p.6, « Max number of static routes » : 5,120' } }),
  'SNS-M-920':   m({ ipsec:2200,  ra:1000, vlan:1336, rules:32768, routes:5120,  feat:{}, src:{ ipsec:'mx p.2 et ds p.6 (2025.10.15), '+IPSEC_LBL+' : 2,200', ra:'mx p.2 et ds p.6 : 1,000 ; '+RA_LBL, vlan:VLAN_LBL+' : 1,336', rules:'mx p.2 et ds p.6, '+RULES_LBL+' : 32,768 (8,192)', routes:'mx p.2 et ds p.6, « Max number of static routes » : 5,120' } }),
  'SNS-SN1100':  m({ ipsec:4700,  ra:1600, vlan:1336, rules:32768, routes:7680,  feat:{}, src:{ ipsec:'mx p.2 et ds p.6 (2026.01.30), '+IPSEC_LBL+' : 4,700', ra:'mx p.2 et ds p.6 : 1,600 ; '+RA_LBL, vlan:VLAN_LBL+' : 1,336', rules:'mx p.2 et ds p.6, '+RULES_LBL+' : 32,768 (8,192)', routes:'mx p.2 et ds p.6, « Max number of static routes » : 7,680' } }),
  'SNS-L-2200':  m({ ipsec:6900,  ra:2400, vlan:1336, rules:32768, routes:10240, feat:{}, src:{ ipsec:'mx p.2 et ds p.6 (2026.05.26), '+IPSEC_LBL+' : 6,900', ra:'mx p.2 et ds p.6 : 2,400 ; '+RA_LBL, vlan:VLAN_LBL+' : 1,336', rules:'mx p.2 et ds p.6, '+RULES_LBL+' : 32,768 (16,384)', routes:'mx p.2 et ds p.6, « Max number of static routes » : 10,240' } }),
  'SNS-L-3200':  m({ ipsec:10000, ra:4000, vlan:1336, rules:32768, routes:10240, feat:{}, src:{ ipsec:'mx p.2 et ds p.6 (2026.05.26), '+IPSEC_LBL+' : 10,000', ra:'mx p.2 et ds p.6 : 4,000 ; '+RA_LBL, vlan:VLAN_LBL+' : 1,336', rules:'mx p.2 et ds p.6, '+RULES_LBL+' : 32,768 (16,384)', routes:'mx p.2 et ds p.6, « Max number of static routes » : 10,240' } }),
  'SNS-XL-5200': m({ ipsec:20000, ra:5000, vlan:1336, rules:32768, routes:10240, feat:{}, src:{ ipsec:'mx p.2 et ds p.6 (2026.05.26), '+IPSEC_LBL+' : 20,000', ra:'mx p.2 et ds p.6 : 5,000 ; '+RA_LBL, vlan:VLAN_LBL+' : 1,336', rules:'mx p.2 et ds p.6, '+RULES_LBL+' : 32,768 (16,384)', routes:'mx p.2 et ds p.6, « Max number of static routes » : 10,240' } }),
  'SNS-XL-6200': m({ ipsec:30000, ra:7500, vlan:1336, rules:32768, routes:10240, feat:{}, src:{ ipsec:'mx p.2 (2026.10.22), '+IPSEC_LBL+' : 30,000 ; ATTENTION la ds p.6 (2026.05.26, plus ancienne) publie 23,000 : valeur de la matrice la plus récente retenue', ra:'mx p.2 et ds p.6 : 7,500 ; '+RA_LBL, vlan:VLAN_LBL+' : 1,336', rules:'mx p.2 et ds p.6, '+RULES_LBL+' : 32,768 (16,384)', routes:'mx p.2 et ds p.6, « Max number of static routes » : 10,240' } }),
  'SNS-SNXR1200':m({ ipsec:500,   ra:null, vlan:1336, rules:null,  routes:null,  feat:{}, src:{ ipsec:'mx p.1 (2026.10.22), « Max number of VPN IPsec tunnels » : 500 ; ATTENTION xr p.2 (2024, v1.7) publie 100 : valeur de la matrice la plus récente retenue', ra:'non publié (xr : SSL VPN cité sans chiffre ; mx p.1 sans ligne SSL VPN pour SNxr1200)', vlan:VLAN_LBL+' (mx p.1) : 1,336', rules:'non publié (ni xr ni mx)', routes:'non publié (ni xr ni mx)' } }),
  'SNS-SNI20':   m({ ipsec:200,   ra:200,  vlan:393,  rules:null,  routes:null,  feat:{}, src:{ ipsec:'mx p.1 et ds p.6 (2026.06.17), « Max number of IPsec VPN tunnels (1024 kbps per tunnel) » : 200', ra:'mx p.1 (Max number of SSL VPN tunnels) et ds p.6 (Nb of SSL VPN clients) : 200', vlan:VLAN_LBL+' (mx p.1) : 393', rules:'non publié (ni ds ni mx)', routes:'non publié (ni ds ni mx)' } }),
  'SNS-SNI10':   m({ ipsec:200,   ra:200,  vlan:137,  rules:null,  routes:null,  feat:{}, src:{ ipsec:'mx p.1 et ds p.6 (2026.06.17), '+IPSEC_LBL+' : 200', ra:'mx p.1 (Max number of SSL VPN tunnels) et ds p.6 (Nb of SSL VPN clients) : 200', vlan:VLAN_LBL+' (mx p.1) : 137', rules:'non publié (ni ds ni mx)', routes:'non publié (ni ds ni mx)' } }),
  'SNS-SNI50':   m({ ipsec:750,   ra:500,  vlan:1336, rules:null,  routes:null,  feat:{}, src:{ ipsec:'mx p.1 et ds p.6 (2026.09.11), « Max number of IPsec VPN tunnels (1024 kbps par tunnel) » : 750', ra:'mx p.1 (Max number of SSL VPN tunnels) et ds p.6 (Nb of SSL VPN clients) : 500', vlan:VLAN_LBL+' (mx p.1) : 1,336', rules:'non publié (ni ds ni mx)', routes:'non publié (ni ds ni mx)' } })
};

module.exports = { SOURCES, FEATURES, CAPS };
