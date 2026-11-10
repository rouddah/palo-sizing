/* Regles de dimensionnement Prisma SASE (Prisma Access + Prisma SD-WAN).
   Table de decision finie : chaque brique, chaque seuil et chaque quantite
   incluse vient d'une source officielle Palo Alto Networks, citee par sa cle
   dans SASE_RULES.src. Releve du 10 novembre 2026, detail dans
   AUDIT_SASE_2026-11.md.

   AXE PRINCIPAL : l'offre « Core » par persona et par unite, telle que la
   decrit le descriptif officiel des references Palo Alto (aout 2026) :
   Prisma Access User (par utilisateur), Net (par Mbps) et Site (par site et
   par palier), chacune en SWG, ZTNA ou Enterprise Core. Les descriptions
   donnent ce que chaque offre inclut ; elles sont reprises comme faits, sans
   prix ni reference de commande.

   REGLES DU SITE
     - aucun prix, aucune reference de commande : on nomme les briques par leur
       nom officiel (Mobile User, Remote Network, Service Connection...) ;
     - une valeur que la source ne publie pas reste nulle et s'affiche comme
       « non publie », jamais estimee ;
     - les debits ION sont ceux de la datasheet (chiffrement, paquets de
       1 400 octets, Prisma SD-WAN 6.5.1) : ce sont des maximums, pas une
       garantie sur le trafic du client.
*/
const SASE_RULES = {
  src: {
    cat:     { t: 'Descriptif officiel des références Palo Alto, août 2026', u: null },
    palg:    { t: 'Prisma Access Licensing Guide (datasheet, juin 2026, prisma_ds_prisma-access-licensing-guide_060526)', u: 'https://www.paloaltonetworks.com/resources/datasheets/prisma-access-licensing-guide' },
    lic:     { t: 'Your Prisma Access License (docs Prisma Access)', u: 'https://docs.paloaltonetworks.com/prisma-access/activation-and-onboarding/your-prisma-access-license' },
    site:    { t: 'Remote Networks, High Performance Site-Based Licensing (Prisma Access 6.0)', u: 'https://docs.paloaltonetworks.com/prisma-access/activation-and-onboarding/your-prisma-access-license/remote-networks-site-based-licensing' },
    alloc:   { t: 'Allocate Remote Network Bandwidth', u: 'https://docs.paloaltonetworks.com/prisma-access/administration/prisma-access-remote-networks/allocate-remote-network-bandwidth' },
    rncheck: { t: 'Planning Checklist for Remote Networks (IPSec Termination Nodes)', u: 'https://docs.paloaltonetworks.com/prisma-access/administration/prisma-access-remote-networks/planning-checklist-for-remote-networks' },
    rnhp:    { t: 'Remote Networks, High Performance', u: 'https://docs.paloaltonetworks.com/prisma-access/administration/prisma-access-remote-networks/remote-networks-high-performance' },
    sc:      { t: 'Prisma Access Service Connections', u: 'https://docs.paloaltonetworks.com/prisma-access/administration/prisma-access-service-connections' },
    schb:    { t: 'Create a High-Bandwidth Network Using Multiple Service Connections', u: 'https://docs.paloaltonetworks.com/prisma-access/administration/prisma-access-advanced-deployments/service-connection-advanced-deployments/create-a-high-bandwidth-network-using-multiple-service-connections' },
    allocl:  { t: 'Allocate Licenses Through Common Services', u: 'https://docs.paloaltonetworks.com/prisma-access/activation-and-onboarding/activate-your-prisma-access-license/cloud-managed-prisma-access-and-add-ons-license-activation/activate-a-license-for-cloud-managed-prisma-access-and-add-ons/allocate-licenses-cloud-managed-prisma-access' },
    ztna:    { t: 'Configure ZTNA Connector', u: 'https://docs.paloaltonetworks.com/prisma-access/administration/ztna-connector-in-prisma-access/configure-a-ztna-connector' },
    ztnaon:  { t: 'Onboarding Workflow for Prisma Access ZTNA Connector', u: 'https://docs.paloaltonetworks.com/prisma-access/activation-and-onboarding/onboard-prisma-access/onboarding-workflow-for-ztna-connector' },
    rbi:     { t: 'Cheat Sheet: Remote Browser Isolation', u: 'https://docs.paloaltonetworks.com/prisma-access/activation-and-onboarding/your-prisma-access-license/all-available-apps-and-services/cheat-sheet-rbi' },
    iondev:  { t: 'Prisma SD-WAN ION Device Specifications (datasheet, prisma_ds_sdwan-ion-device-specifications_082426)', u: 'https://www.paloaltonetworks.com/resources/datasheets/prisma-sd-wan-instant-on-network-ion-device-specifications' },
    sdwanlic:{ t: 'Your Prisma SD-WAN License', u: 'https://docs.paloaltonetworks.com/prisma-sd-wan/activation-and-onboarding/your-prisma-sd-wan-license' }
  },

  /* ── Offre « Core » par persona (cat) ──
     User par utilisateur, Net par Mbps, Site par site et par palier.
     incl : ce que la description de chaque offre inclut. */
  personas: {
    user: { name: 'Prisma Access User', unit: 'utilisateurs', per: 'par utilisateur et par an' },
    net:  { name: 'Prisma Access Net',  unit: 'Mbps',         per: 'par Mbps et par an' },
    site: { name: 'Prisma Access Site', unit: 'sites',        per: 'par site et par an' }
  },
  editions: [
    { id: 'swg', name: 'SWG Core', use: 'Sécurité de l’accès internet.', privateApps: false, sc: 0, ztnaConn: 0,
      personas: ['user', 'net', 'site'],
      incl: { user: ['Sécurité internet (abonnement de sécurité premium)', 'SaaS Inline', 'AI Access Security', 'ADEM Core'],
              net:  ['Sécurité internet', 'SaaS Inline', 'AI Access Security', 'ADEM Core'],
              site: ['Sécurité internet', 'Abonnement de bande passante SD-WAN', 'SaaS Inline', 'AI Access Security', 'ADEM Core'] } },
    { id: 'ztna', name: 'ZTNA Core', use: 'Accès aux applications privées, avec Advanced Threat Prevention et Advanced WildFire.', privateApps: true, sc: 5, ztnaConn: 10,
      personas: ['user', 'site'],
      incl: { user: ['Accès aux applications privées', 'Advanced Threat Prevention', 'Advanced WildFire', '5 Service Connections', '10 ZTNA Connectors', 'ADEM Core'],
              site: ['Accès aux applications privées', 'Advanced Threat Prevention', 'Advanced WildFire', '5 Service Connections', '10 ZTNA Connectors', 'Interconnect', 'Abonnement de bande passante SD-WAN', 'ADEM Core'] } },
    { id: 'enterprise', name: 'Enterprise Core', use: 'Applications privées et sécurité internet.', privateApps: true, sc: 5, ztnaConn: 10,
      personas: ['user', 'net', 'site'],
      incl: { user: ['Applications privées et sécurité internet', '5 Service Connections', '10 ZTNA Connectors', 'SaaS Inline', 'AI Access Security', 'ADEM Core', 'Prisma Browser Core', '5 sites de 10 Mbps (à partir de 2 000 utilisateurs achetés)'],
              net:  ['Applications privées et sécurité internet', '5 Service Connections', '10 ZTNA Connectors', 'SaaS Inline', 'AI Access Security', 'ADEM Core', 'Prisma Browser Core'],
              site: ['Applications privées et sécurité internet', '5 Service Connections', '10 ZTNA Connectors', 'Interconnect', 'Abonnement de bande passante SD-WAN', 'SaaS Inline', 'AI Access Security', 'ADEM Core', 'Prisma Browser Core'] } }
  ],
  editionSrc: 'cat',
  entUserSites: { minUsers: 2000, sites: 5, mbps: 10 },
  allEditions: ['Plus de 150 emplacements cloud', '250 GB de transfert de données par an', 'Gestion par Strata Cloud Manager ou Panorama', 'Connexion par GlobalProtect, Prisma Agent, Explicit Proxy ou tunnels IPsec', 'SLA Prisma Access'],
  includedGB: 250,
  oneEdition: 'Un tenant ne porte qu’un type de licence Prisma Access : on ne mélange pas les éditions dans un tenant.',
  history: 'Des pages d’allocation de licences citent encore des couvertures « Local » et « Worldwide » (minimum de 200 ou 1 000 unités par tenant). Elles n’apparaissent plus dans l’offre actuelle : l’outil ne les propose pas.',

  /* ── Mobile Users (lic, cat) ── */
  mu: { note: 'Une unité = un utilisateur nomade ; elle ouvre GlobalProtect, Prisma Agent, Explicit Proxy ou plusieurs. Les utilisateurs Clientless VPN comptent aussi.', src: 'lic, cat' },

  /* ── Remote Networks ── */
  rnSite: {   // offre Site Core (cat) et modele par site (site)
    tiers: [
      { id: 'vs', name: 'jusqu’à 25 Mbps',  mbps: 25 },
      { id: 's',  name: 'jusqu’à 50 Mbps',  mbps: 50 },
      { id: 'm',  name: 'jusqu’à 250 Mbps', mbps: 250 },
      { id: 'l',  name: 'jusqu’à 1 Gbps',   mbps: 1000 },
      { id: 'xl', name: 'jusqu’à 2,5 Gbps', mbps: 2500 }
    ],
    oversub: 0.10, incl: ['Egress NAT', 'Redondance régionale'], src: 'cat, site',
    splitNote: 'Au-delà de 2,5 Gbps, un site s’embarque comme plusieurs sites de 2,5 Gbps, mais ce modèle ne donne pas accès aux applications privées.'
  },
  rnAgg: {    // offre Net Core par Mbps, allouee par compute location (alloc, rncheck)
    minPerLocation: 50, nodeMbps: 1000, sitesPerNode: 500, maxNodes: 200,
    noQosInbound: 'QoS et accès entrant sécurisé non pris en charge quand la bande passante est allouée par compute location.',
    src: 'cat, alloc, rncheck'
  },
  rnHp: { tunnelMbps: 2000, nodeMbps: 3000, branchesPerIp: 120, src: 'rnhp' },

  /* ── Acces aux applications privees ── */
  scMbps: 1000, scMaxRecommended: 4, scSrc: 'schb',
  scNote: 'Palo Alto Networks recommande toujours au moins une Service Connection : les Mobile Users joignent les Remote Networks par elle.',
  ztnaConnMbps: 2000, privateAppMax: 200, privateAppSrc: 'cat, ztna, ztnaon, sc',

  /* ── Add-ons Prisma Access ──
     per : personas pour lesquelles l'offre existe (user = par utilisateur,
     net = par Mbps, site = par site et par palier) ; fixed : unite fixe
     (perSC, perLink, perTB, flat), null = unite non publiee.
     inc : editions qui l'incluent deja (« edition:persona » si une seule). */
  addons: [
    { id: 'privateApp',  name: 'Private App Access', desc: 'Accès aux Service Connections et aux ZTNA Connectors pour une édition qui ne les inclut pas.', per: ['user', 'net', 'site'], inc: ['ztna', 'enterprise'], src: 'cat' },
    { id: 'scQty',       name: 'Private App Access, Service Connections supplémentaires', desc: 'Service Connections au-delà de celles de l’édition.', fixed: 'perSC', src: 'cat, sc' },
    { id: 'ztnaUnl',     name: 'ZTNA Connector, applications illimitées', desc: 'Lève la limite d’applications des ZTNA Connectors.', fixed: null, src: 'cat' },
    { id: 'appSec',      name: 'Private App Security', desc: 'Protection applicative des applications privées (OWASP Top 10, robots, exploits jour zéro).', per: ['user', 'net', 'site'], src: 'cat' },
    { id: 'saasInline',  name: 'SaaS Inline', desc: 'Visibilité et contrôle en ligne des applications SaaS.', per: ['user', 'net', 'site'], inc: ['swg', 'enterprise'], src: 'cat' },
    { id: 'appAccel',    name: 'App Acceleration', desc: 'Accélération des applications SaaS selon les conditions réseau.', per: ['user', 'net', 'site'], src: 'cat' },
    { id: 'scmPro',      name: 'Strata Cloud Manager avec AIOps et ADEM', desc: 'AIOps et ADEM, Strata Logging Service 1 an compris.', per: ['user', 'net', 'site'], src: 'cat' },
    { id: 'sls',         name: 'Strata Logging Service', desc: 'Stockage des journaux, 1 an de rétention.', per: ['user', 'net', 'site'], src: 'cat' },
    { id: 'iot',         name: 'IoT', desc: 'Sécurité IoT pour le réseau (par site et palier ; ailleurs « par unité », persona non précisée).', per: ['site'], src: 'cat' },
    { id: 'interconnect',name: 'Interconnect', desc: 'Connectivité site à site et utilisateurs vers sites par Prisma Access.', per: ['net'], inc: ['ztna:site', 'enterprise:site'], src: 'cat' },
    { id: 'dlp',         name: 'DLP', desc: 'Data Loss Prevention pour Prisma Access.', per: ['user'], src: 'cat' },
    { id: 'ngcasb',      name: 'NG-CASB', desc: 'SaaS Security Inline, DLP Inline, SaaS Security API, DLP API, SSPM et AI Access Security (« par unité »).', fixed: null, src: 'cat' },
    { id: 'saa',         name: 'Secure Agentless Access', desc: 'Accès sans client aux applications non web (RDP, SSH, VNC).', per: ['user'], src: 'cat' },
    { id: 'trafficRep',  name: 'Traffic Replication', desc: 'Copie du trafic qui traverse Prisma Access.', per: ['user'], src: 'cat' },
    { id: 'browserAdd',  name: 'Prisma Browser, add-on Prisma Access', desc: 'Navigateur d’entreprise pour internet, SaaS et applications privées, Enterprise DLP, AI Access pour le trafic du navigateur, console.', per: ['user'], src: 'cat' },
    { id: 'browserPro',  name: 'Prisma Browser Pro, add-on Prisma Access', desc: 'Navigateur pour internet, SaaS et applications privées, Enterprise DLP, AI Access, protection avancée web, données et identité, ADEM RUM.', per: ['user'], src: 'cat' },
    { id: 'colo',        name: 'Colo-Connect', desc: 'Liens Colo-Connect utilisables par les Service Connections comme transport (variante 100G), jusqu’à 20 Gbps par région.', fixed: 'perLink', src: 'cat, palg' },
    { id: 'excess',      name: 'Excess Data Transfer', desc: '1 To de transfert agrégé par unité, au-delà des 250 GB annuels inclus.', fixed: 'perTB', src: 'cat, palg' },
    { id: 'byoip',       name: 'Onboarding des IP du client', desc: 'IPv4 ou IPv6 du client portées sur les nœuds Prisma Access (MU, RN, SC, EP, répartiteurs, NAT).', fixed: 'flat', src: 'cat' },
    { id: 'xborder',     name: 'X-Border Connectivity', desc: 'Connectivité dédiée ou premium entre la Chine et le reste du monde.', fixed: 'flat', src: 'cat' },
    { id: 'rbi',         name: 'Remote Browser Isolation', desc: 'Rendu des sites dans des conteneurs cloud isolés. Requiert un abonnement Mobile User ou Remote Network.', fixed: null, src: 'palg, rbi' },
    { id: 'aiAccess',    name: 'AI Access', desc: 'Usage encadré des applications d’IA générative.', fixed: null, inc: ['swg', 'enterprise'], src: 'palg, cat' },
    { id: 'sspm',        name: 'SSPM', desc: 'Correction des erreurs de configuration des applications SaaS (aussi dans NG-CASB).', fixed: null, src: 'palg, cat' },
    { id: 'emailDlp',    name: 'Email DLP', desc: 'Prévention de l’exfiltration dans les courriels sortants.', fixed: null, src: 'palg' },
    { id: 'endpointDlp', name: 'Endpoint DLP', desc: 'Contrôle des transferts vers les périphériques.', fixed: null, src: 'palg' }
  ],
  fixedUnits: { perSC: 'Service Connections', perLink: 'liens', perTB: 'To', flat: 'forfait' },
  ademRn: 'Pour les Remote Networks en bande passante agrégée, la bande passante ADEM d’une compute location est celle qui lui est allouée.',
  ademRnSrc: 'alloc',

  /* ── Prisma SD-WAN : appareils ION (iondev, tables 1 et 3) ──
     mbpsB / mbpsDC : debit chiffre (1 400 octets) en mode branche / data center.
     tier : taille du portefeuille (figure 1 de la datasheet). */
  ion: [
    { id: 'ION 1200',   tier: 'Small',  mbpsB: 800,  mbpsDC: null,  dc: false, poe: 0, cell: 'LTE ou 5G (variantes)', sfp10: 0, mgig: 0, rugged: false, flowsB: 20000, tpB: null,
      ports: '4x 10/100/1000 RJ45', psu: 'Adaptateur 25 W (40 W cellulaire), sans ventilateur' },
    { id: 'ION 1200-S', tier: 'Small',  mbpsB: 800,  mbpsDC: null,  dc: false, poe: 4, cell: 'LTE ou 5G (variantes)', sfp10: 0, mgig: 0, rugged: false, flowsB: 40000, tpB: 350,
      ports: '6x 1G RJ45, 2x combo RJ45/SFP, 2x bypass, 4x PoE++', psu: '2 PSU 150 W, sans ventilateur' },
    { id: 'ION 3200',   tier: 'Small',  mbpsB: 1000, mbpsDC: 1400,  dc: true,  poe: 4, cell: null, sfp10: 0, mgig: 0, rugged: false, flowsB: 100000, tpB: 520, dcVpn: 500,
      ports: '6x 1G RJ45, 2x combo RJ45/SFP, 2x bypass, 4x PoE++', psu: '2 PSU 150 W, sans ventilateur' },
    { id: 'ION 3200H',  tier: 'Small',  mbpsB: 1300, mbpsDC: 1700,  dc: true,  poe: 0, cell: '5G (variante)', sfp10: 0, mgig: 0, rugged: true, flowsB: 100000, tpB: 710, dcVpn: 2000,
      ports: '5x 1G RJ45, 2x combo RJ45/SFP, 2x bypass', psu: '2 PSU 270 W ou DC redondante, sans ventilateur, -40 à 70 °C' },
    { id: 'ION 5200',   tier: 'Medium', mbpsB: 3200, mbpsDC: 4000,  dc: true,  poe: 4, cell: null, sfp10: 4, mgig: 4, rugged: false, flowsB: 100000, tpB: 1300, dcVpn: 2000,
      ports: '4x 10G SFP+, 11x 1G RJ45, 4x multi-gig (1/2.5G), 4x bypass, 4x PoE++', psu: '2 PSU 450 W redondantes' },
    { id: 'ION 9200',   tier: 'Large',  mbpsB: 7500, mbpsDC: 15000, dc: true,  poe: 4, cell: null, sfp10: 10, mgig: 4, rugged: false, flowsB: 1000000, tpB: 4500, dcVpn: 5000,
      ports: '10x 10G SFP+, 11x 1G RJ45, 4x multi-gig (1/2.5/5G), 8x bypass, 4x PoE++', psu: '2 PSU 450 W redondantes' },
    { id: 'PA-5440',    tier: null,     mbpsB: null, mbpsDC: 54000, dc: true,  dcOnly: true, poe: 0, cell: null, sfp10: 12, mgig: 8, rugged: false, flowsB: null, tpB: null, dcVpn: 3000,
      ports: '8x multi-gig RJ45, 12x SFP/SFP+, 4x QSFP+/QSFP28', psu: '2 PSU 1 200 W hot-swap' }
  ],
  vion: [
    { id: 'ION 3102V', mbps: 100,   dc: false }, { id: 'ION 3104V', mbps: 200, dc: false }, { id: 'ION 3108V', mbps: 350, dc: false },
    { id: 'ION 7108V', mbps: 3000,  dc: true },  { id: 'ION 7116V', mbps: 10000, dc: true }, { id: 'ION 7132V', mbps: 25000, dc: true }
  ],
  ionSrc: 'iondev',
  ionNote: 'Débits ION chiffrés, paquets de 1 400 octets, Prisma SD-WAN 6.5.1 ; ION 9200 en mode branche mesuré avec 2 tunnels VPN.',

  /* ── Abonnements Prisma SD-WAN (sdwanlic, cat) ── */
  sdwan: {
    termYears: [1, 5],
    device: { tiers: [25, 50, 150, 250, 500, 1000, 2500], vtiers: [25, 50, 150, 250, 500],
      note: 'Une licence par ION, au palier de débit du site (entrant + sortant) ; une paire HA demande deux licences. ZBFW inclus ; WAN Clarity Reporting et Clarity Network DVR en option, pour tous les ION de branche ou aucun.' },
    site: { tiers: [25, 250, 2500],
      note: 'Une licence partagée par tous les ION du site. ZBFW, DVR et WCR inclus.' },
    aggregate: { minAvgPerDevice: 10, note: 'Mbps partagés par tous les sites, HA comprise. ZBFW, WAN Reporting et EDA inclus. Moyenne d’au moins 10 Mbps par ION de branche.' },
    oneModel: 'Un seul type d’abonnement de branche pour tous les sites du tenant.',
    dc: 'Un abonnement data center par ION (physique ou virtuel) affecté à un site data center, débit jusqu’au maximum de l’ION.',
    siteCoreIncl: 'L’offre Prisma Access Site Core inclut l’abonnement de bande passante SD-WAN : pas d’abonnement de branche à ajouter pour ces sites, seulement les ION.',
    perDeviceAddons: 'Par ION, en option : Security, SD-WAN + Security, IoT Device Security, Strata Logging Service (paliers Very Small à Large), ZBFW, WAN Clarity Reporting, Clarity Network DVR, App Acceleration.',
    src: 'sdwanlic, cat'
  }
};
/* Un const de haut niveau n'est pas une propriete de window : on l'expose. */
if (typeof window !== 'undefined') window.SASE_RULES = SASE_RULES;
if (typeof module !== 'undefined') module.exports = { SASE_RULES };
