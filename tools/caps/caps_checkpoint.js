/* Check Point (Quantum Spark 2500 et Quantum Force) : limites de configuration et fonctions,
   relevé du 10 novembre 2026 pour le site Palo Sizing. Sources officielles Check Point uniquement.
   Version logicielle de référence : R82 pour les Force (Gaia), R82.00.X (R82.00.11) pour les Spark.
   Non publié = null. Détails, ambiguïtés et taux de remplissage : caps_checkpoint.md. */

const SOURCES = {
  ds: 'datasheet du modèle (champ ds de competitors.js) ; Spark 2500 : quantum-spark-2500-datasheet.pdf du 22 juillet 2026 ; Force 3920 : 13 juillet 2026 ; 3950/3970/3980 : 22 juillet 2026 ; 9100/9200 : 15 juillet 2026 ; 9300/9400/9800 : 12 juillet 2026 ; 9700, 19100, 19200, 29100, 29200 : 8 juillet 2026',
  r82max: 'https://sc1.checkpoint.com/documents/R82/WebAdminGuides/EN/CP_R82_RN/Content/Topics-RN/Maximum-Supported-Items.htm (R82 Release Notes, Maximum Supported Items, 14 septembre 2026)',
  r82fl: 'https://www.checkpoint.com/downloads/products/check-point-quantum-software-r82-feature-list.pdf (Quantum Software R82 Feature List)',
  r82rn: 'https://sc1.checkpoint.com/documents/R82/WebAdminGuides/EN/CP_R82_RN/CP_R82_ReleaseNotes.pdf (R82 Release Notes, 14 septembre 2026, What\'s New, IPSec VPN)',
  sk113247: 'https://support.checkpoint.com/results/sk/sk113247 (Maximum number of VLAN and VAPs for Gaia Embedded Appliances, modifié le 9 juin 2026, R82.00.X)',
  sparkAG: 'https://sc1.checkpoint.com/documents/Appliances/Quantum_Spark_R82.00.X/AdminGuides_Locally_Managed/EN/CP_R82.00.X_Spark_Firewall_Appliances_Locally_Managed_AdminGuide.pdf (R82.00.X Locally Managed Administration Guide, 22 septembre 2026)',
  sparkRN: 'https://sc1.checkpoint.com/documents/Appliances/Quantum_Spark_R82.00.X/RN/EN/CP_R82.00.X_Appliances_ReleaseNotes.pdf (R82.00.X Spark Firewall Appliances Release Notes, 15 septembre 2026)',
  sk67820: 'https://support.checkpoint.com/results/sk/sk67820 (Check Point Remote Access Solutions, modifié le 6 novembre 2026, R82.10/R82/R81.20)',
  ics: 'https://www.checkpoint.com/downloads/products/critical-infrastructure-ics-scada-protection-solution-brief.pdf (Critical Infrastructure & ICS/SCADA Protection, 8 septembre 2016)'
};

/* Niveau éditeur. Les Force et les Spark partagent le tableau Subscription Services de leur datasheet
   (NGFW / NGTP / SNBT). Exceptions Spark (SD-WAN et IoT inclus, DLP non publié, RA VPN, PQC) dans CAPS[id].feat. */
const FEATURES = {
  ips:'lic', av:'lic', sandbox:'lic', url:'lic', dns:'lic', app:'lic', tls:'base', sdwan:'lic', ztna:null,
  raVpn:'lic', dlp:'lic', iot:'lic', ot:'lic', pqc:'base', wifi:false, cell:false, wlc:null, swc:null, ai:'lic',
  featSrc:{
    ips:'ds, tableau Subscription Services (dernière page) : IPS coché dans NGFW, NGTP et SNBT (abonnements)',
    av:'ds, tableau Subscription Services : Anti-Virus et Anti-Bot cochés dans NGTP et SNBT',
    sandbox:'ds, tableau Subscription Services : « SandBlast Threat Emulation (sandboxing) » coché dans SNBT seulement ; émulation dans le cloud ThreatCloud, aucune exécution locale publiée sur ces boîtiers',
    url:'ds, tableau Subscription Services : URL Filtering coché dans NGTP et SNBT',
    dns:'ds, tableau Subscription Services : DNS Security coché dans NGTP et SNBT (Force) ; r82fl §2 Improved DNS Security',
    app:'ds, tableau Subscription Services : Application Control coché dans NGFW, NGTP et SNBT',
    tls:'ds p.2 : « HTTPS Inspection (Layer 1-7) » dans la liste des fonctions du boîtier et absent du tableau Subscription Services (déduit, aucun libellé « inclus » explicite) ; débits « TLS Inspection Performance » publiés p.3',
    sdwan:'ds, tableau Subscription Services (Force) : SD-WAN « optional » dans les trois paquets ; référence d\'abonnement SD-WAN séparée dans le tableau de commande',
    ztna:'aucune fonction ZTNA portée par le pare-feu dans les datasheets Force/Spark ni dans r82fl',
    raVpn:'sk67820 : « By default, a Security Gateway comes with a license for 5 users », blades 50, 200 ou Unlimited au-delà ; ds p.2 « Site-to-Site and Remote Access VPN »',
    dlp:'ds Force, tableau Subscription Services : DLP « optional » (3900) et ligne de commande « Data Loss Prevention (DLP) blade for 1 year » (toutes les Force)',
    iot:'ds Force, tableau Subscription Services : « IoT Network Protection » optional ; abonnement IoT séparé dans le tableau de commande',
    ot:'ics p.2 : Application Control prend en charge Modbus, DNP3, IEC-60870-5-104, IEC 61850, S7, etc. ; « All features are available across all appliances » (document de 2016) ; Application Control est sous abonnement (ds)',
    pqc:'r82rn, What\'s New in R82, IPSec VPN : « Added support for ML-KEM (Kyber768) as required by the FIPS 203 standard » ; r82fl §6 IPsec VPN. Fonction du blade IPsec VPN, sans abonnement de sécurité publié',
    wifi:'ds Force : aucune radio Wi-Fi dans le matériel',
    cell:'ds Force : aucun modem 5G/LTE dans le matériel',
    wlc:'non publié', swc:'non publié',
    ai:'r82fl §1 « AI-based Prevention Engines » (ThreatCloud Graph, Kronos, Deep Brand Clustering) ; ds p.1 « Fastest AI-Powered Threat Prevention » ; moteurs de Threat Prevention donc sous abonnement'
  }
};

/* Exceptions communes aux Spark 2500 */
const SPARK_FEAT = {
  sdwan:'base', iot:'base', dns:null, dlp:null, raVpn:'base', pqc:null, ot:'lic'
};
const SPARK_FEATSRC = {
  sdwan:'ds Spark p.9, tableau Subscription Services : « SD-WAN for SMB (Web UI and Spark Management) is included ; SD-WAN for Enterprise (Smart1) requires an additional license »',
  iot:'ds Spark p.9 : « IoT for SMB (Web UI and Spark Management) is included ; IoT for Enterprise (Smart1) requires an additional license »',
  dns:'fonction publiée (ds Spark p.2 « Advanced DNS Security » ; sparkRN R82.00.10 « DNS security ») mais absente du tableau Subscription Services Spark p.9 : mode de licence non publié, laissé à null',
  dlp:'aucune mention DLP dans la datasheet Spark 2500 ni dans sparkAG',
  raVpn:'ds Spark p.5, ligne Remote Access Users (100/200/1000 selon modèle) dans le bloc Software ; VPN absent du tableau Subscription Services (déduit)',
  pqc:'sparkRN p.9 (R82.00.10) : « Quantum encryption - Quantum-safe cryptography using PQC algorithms (e.g. Kyber, Dilithium) », sans préciser que cela porte sur le VPN IPsec : laissé à null',
  wifi:'ds Spark p.6, ligne Wi-Fi & bands',
  cell:'ds Spark p.6, ligne 5G / LTE (optional) ; p.7 références W-5G'
};

function spark(o){ o.feat = Object.assign({}, SPARK_FEAT, o.feat); o.featSrc = Object.assign({}, SPARK_FEATSRC, o.featSrc || {}); return o; }

const SPARK_SRC = {
  vlan:'sk113247, tableau Tag-Based VLANs (R82.00.X) ; la datasheet p.5 publie aussi « Total physical and virtual (VLAN) interfaces per appliance: 1024 (single gateway) »',
  ra:'ds p.5, tableau Specifications, ligne Remote Access Users (cellules fusionnées : 2530-2550 = 100, 2560-2570 = 200, 2580-2590 = 1 000)',
  addr:'sparkAG p.491, Network Objects and Groups : « You can create a maximum of 1000 objects in total » (hôtes, réseaux et noms de domaine confondus, gestion locale)'
};

const FORCE_SRC_3900 = {
  vlan:'ds p.4, Network Connectivity : « Total physical and virtual (VLAN) interfaces per appliance: 1024/4096 (single gateway/with virtual systems) » ; valeur 4096 = avec Virtual Systems, interfaces physiques comprises',
  virt:'ds p.4, tableau Virtual System, colonne Firewall VS (Firewall + IPS VS et Next Gen Threat Prevention VS plus bas, voir md)',
  rules:'r82max, tableau Management Server : « Rules in each Access Control policy » 28 000 (20 000 recommandés), R82',
  nat:'r82max, tableau Management Server : « Rules in each NAT policy » 16 384, R82'
};
const FORCE_SRC_BIG = {
  vlan:'r82max, Maximum Supported Number of Interfaces on Security Gateway : « VSX Gateway in the Traditional VSX mode » 4096 (physiques, VLAN et Warp compris), 1024 en passerelle non-VSX',
  virt:'ds p.4, tableau Maximum Virtual System Capacity, ligne Max capacity, colonne Firewall VS',
  virtBase:'ds p.5, note du tableau de commande : « The Base package includes 2 virtual systems (VS), one management VS and one production/data VS »',
  rules:FORCE_SRC_3900.rules, nat:FORCE_SRC_3900.nat
};
const FORCE_SRC_1929 = Object.assign({}, FORCE_SRC_BIG, {
  vlan:'ds p.4, Network Connectivity : « Total physical and virtual (VLAN) interfaces per appliance: 1024/4096 (single gateway/with virtual systems) » ; r82max : 4096 en VSX traditionnel',
  virtBase:'ds p.5, note : « The Base package includes 2 virtual systems (VS), one management VS and one production/data VS » ; « Plus model 5 VS licenses which are additive »'
});

const N = { ipsec:null, ra:null, vlan:null, virt:null, virtBase:null, virtTerm:null, rules:null, nat:null, addr:null, addrGrp:null, svc:null, zones:null, routes:null, users:null, sslDec:null, ap:null, sw:null };
function m(o){ return Object.assign({}, N, o); }

const CAPS = {
  'Spark-2530': spark(m({ ra:100,  vlan:100, addr:1000, feat:{ wifi:true,  cell:false }, src:SPARK_SRC })),
  'Spark-2550': spark(m({ ra:100,  vlan:100, addr:1000, feat:{ wifi:true,  cell:'variante' }, src:SPARK_SRC })),
  'Spark-2560': spark(m({ ra:200,  vlan:200, addr:1000, feat:{ wifi:true,  cell:false }, src:SPARK_SRC })),
  'Spark-2570': spark(m({ ra:200,  vlan:200, addr:1000, feat:{ wifi:true,  cell:'variante' }, src:SPARK_SRC })),
  'Spark-2580': spark(m({ ra:1000, vlan:200, addr:1000, feat:{ wifi:false, cell:false }, src:SPARK_SRC })),
  'Spark-2590': spark(m({ ra:1000, vlan:200, addr:1000, feat:{ wifi:false, cell:false }, src:SPARK_SRC })),
  'Force-3920':  m({ vlan:4096, virt:17,  virtTerm:'VS', rules:28000, nat:16384, feat:{}, src:FORCE_SRC_3900 }),
  'Force-3950':  m({ vlan:4096, virt:28,  virtTerm:'VS', rules:28000, nat:16384, feat:{}, src:FORCE_SRC_3900 }),
  'Force-3970':  m({ vlan:4096, virt:28,  virtTerm:'VS', rules:28000, nat:16384, feat:{}, src:FORCE_SRC_3900 }),
  'Force-3980':  m({ vlan:4096, virt:28,  virtTerm:'VS', rules:28000, nat:16384, feat:{}, src:FORCE_SRC_3900 }),
  'Force-9100':  m({ vlan:4096, virt:48,  virtBase:2, virtTerm:'VS', rules:28000, nat:16384, feat:{}, src:FORCE_SRC_BIG }),
  'Force-9200':  m({ vlan:4096, virt:48,  virtBase:2, virtTerm:'VS', rules:28000, nat:16384, feat:{}, src:FORCE_SRC_BIG }),
  'Force-9300':  m({ vlan:4096, virt:48,  virtBase:2, virtTerm:'VS', rules:28000, nat:16384, feat:{}, src:FORCE_SRC_BIG }),
  'Force-9400':  m({ vlan:4096, virt:64,  virtBase:2, virtTerm:'VS', rules:28000, nat:16384, feat:{}, src:FORCE_SRC_BIG }),
  'Force-9700':  m({ vlan:4096, virt:128, virtBase:2, virtTerm:'VS', rules:28000, nat:16384, feat:{}, src:FORCE_SRC_BIG }),
  'Force-9800':  m({ vlan:4096, virt:160, virtBase:2, virtTerm:'VS', rules:28000, nat:16384, feat:{}, src:FORCE_SRC_BIG }),
  'Force-19100': m({ vlan:4096, virt:300, virtBase:2, virtTerm:'VS', rules:28000, nat:16384, feat:{}, src:FORCE_SRC_1929 }),
  'Force-19200': m({ vlan:4096, virt:300, virtBase:2, virtTerm:'VS', rules:28000, nat:16384, feat:{}, src:FORCE_SRC_1929 }),
  'Force-29100': m({ vlan:4096, virt:300, virtBase:2, virtTerm:'VS', rules:28000, nat:16384, feat:{}, src:FORCE_SRC_1929 }),
  'Force-29200': m({ vlan:4096, virt:300, virtBase:2, virtTerm:'VS', rules:28000, nat:16384, feat:{}, src:FORCE_SRC_1929 })
};

module.exports = { SOURCES, FEATURES, CAPS };
