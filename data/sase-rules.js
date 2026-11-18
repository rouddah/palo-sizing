/* Regles de dimensionnement Prisma SASE (Prisma Access + Prisma SD-WAN).
   Table de decision finie : chaque brique, chaque seuil et chaque quantite
   incluse vient d'une source officielle Palo Alto Networks, citee par sa cle
   dans SASE_RULES.src. Releve du 10 novembre 2026, detail dans
   AUDIT_SASE_2026-11.md.

   AXE PRINCIPAL : les trois editions du guide de licences public (Secure
   Web Gateway, ZTNA, Enterprise) et ses trois compteurs (par utilisateur,
   par site, par Mbps). Le guide public prime ; ce que seules les
   descriptions d'offres (cle cat, non publique) ajoutent s'affiche avec la
   mention [a confirmer] (src.pub === false), sans prix ni reference.

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
    cat:     { t: 'Descriptif officiel des références Palo Alto, août 2026', u: null, pub: false },
    dtx:     { t: 'Monitor Your Prisma Access Data Transfer Usage (documentation Prisma Access 3.0 et 3.1)', u: 'https://docs.paloaltonetworks.com/prisma/prisma-access/3-1/prisma-access-panorama-admin/prisma-access-overview/prisma-access-licenses/monitor-your-data-transfer-usage' },
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
    sdwanlic:{ t: 'Your Prisma SD-WAN License', u: 'https://docs.paloaltonetworks.com/prisma-sd-wan/activation-and-onboarding/your-prisma-sd-wan-license' },
    pbsa:    { t: 'Activate Standalone Prisma Browser License (docs Prisma Browser)', u: 'https://docs.paloaltonetworks.com/prisma-browser/activation-and-onboarding/activate-standalone-prisma-browser-license' },
    pbdeck:  { t: 'Présentation client Prisma Browser, Palo Alto Networks, 2026', u: null, pub: false }
  },

  /* Compteurs publics (palg) : Per User, Per Site, Per Bandwidth (Mbps), par an. */
  personas: {
    user: { name: 'par utilisateur', unit: 'utilisateurs', per: 'par utilisateur et par an' },
    net:  { name: 'par Mbps',        unit: 'Mbps',         per: 'par Mbps et par an' },
    site: { name: 'par site',        unit: 'sites',        per: 'par site et par an' }
  },
  personaSrc: 'palg',
  /* Editions : noms et contenu du tableau 1 du guide de licences public
     (palg). pub = ce que le tableau 1 coche ; persona = ce que le guide dit
     du compteur (par site : abonnement SD-WAN de branche, redondance,
     connectivite entre branches) et la doc site-based (Egress NAT,
     redondance regionale). extra = ce que seules les descriptions d'offres
     (cat) ajoutent : affiche avec la mention [a confirmer]. */
  editions: [
    { id: 'swg', name: 'Secure Web Gateway', short: 'SWG', use: 'Sécurité de l’accès internet des utilisateurs et des sites.', privateApps: false, sc: 0, ztnaConn: 0,
      personas: ['user', 'net', 'site'],
      pub: ['Advanced Threat Prevention', 'Advanced WildFire', 'Advanced URL Filtering', 'Advanced DNS Security'],
      extra: { user: ['AI Access Security', 'ADEM Core'], net: ['AI Access Security', 'ADEM Core'], site: ['AI Access Security', 'ADEM Core'] } },
    { id: 'ztna', name: 'Zero Trust Network Access (ZTNA)', short: 'ZTNA', use: 'Accès sécurisé aux applications privées.', privateApps: true, sc: 5, ztnaConn: 10,
      personas: ['user', 'site'],
      pub: ['Connexion aux applications privées (5 Service Connections, 10 ZTNA Connectors)', 'Advanced Threat Prevention', 'Advanced WildFire'],
      extra: { user: ['ADEM Core'], site: ['Interconnect', 'ADEM Core'] } },
    { id: 'enterprise', name: 'Enterprise', short: 'Enterprise', use: 'Sécurité de toutes les applications, internet et privées, avec navigateur d’entreprise et protection des données SaaS en ligne.', privateApps: true, sc: 5, ztnaConn: 10,
      personas: ['user', 'net', 'site'],
      pub: ['Connexion aux applications privées (5 Service Connections, 10 ZTNA Connectors)', 'Advanced Threat Prevention', 'Advanced WildFire', 'Advanced URL Filtering', 'Advanced DNS Security', 'SaaS Inline Security', 'Prisma Browser Core'],
      extra: { user: ['AI Access Security', 'ADEM Core', '5 sites de 10 Mbps à partir de 2 000 utilisateurs'], net: ['AI Access Security', 'ADEM Core'], site: ['Interconnect', 'AI Access Security', 'ADEM Core'] } }
  ],
  personaPub: { site: ['Abonnement de branche Prisma SD-WAN, selon le palier et le modèle d’ION', 'Egress NAT', 'Redondance régionale'] },
  personaPubSrc: 'palg, site',
  editionSrc: 'palg',
  extraSrc: 'cat',
  /* Le guide public ne coche pas SaaS Inline pour Secure Web Gateway ; une
     description d'offre l'inclut. L'outil suit le guide public. */
  conflicts: ['SaaS Inline Security : le guide de licences public ne l’inclut qu’en Enterprise ; une description d’offre l’annonce aussi en Secure Web Gateway. L’outil suit le guide public.'],
  entUserSites: { minUsers: 2000, sites: 5, mbps: 10 },
  allEditions: ['Plus de 150 emplacements cloud', '250 GB de transfert de données par an et par unité', 'Gestion par Strata Cloud Manager ou Panorama', 'Connexion par GlobalProtect, Prisma Agent, Explicit Proxy ou tunnels IPsec', 'SLA Prisma Access'],
  /* 250 GB par unite et par an, unites additionnees sur le tenant ; une
     unite = un Mobile User ou 1 Mbps de Remote Network (dtx, doc 3.0 et
     3.1). Unite des offres par site : non publiee. */
  includedGB: 250, includedSrc: 'palg, dtx',
  oneEdition: 'Un tenant ne porte qu’un type de licence Prisma Access : on ne mélange pas les éditions dans un tenant.',
  history: 'Des pages d’allocation de licences citent encore des couvertures « Local » et « Worldwide » (minimum de 200 ou 1 000 unités par tenant). Elles n’apparaissent plus dans l’offre actuelle : l’outil ne les propose pas.',

  /* ── Mobile Users (lic, cat) ── */
  mu: { note: 'Une unité = un utilisateur nomade ; elle ouvre GlobalProtect, Prisma Agent, Explicit Proxy ou plusieurs. Les utilisateurs Clientless VPN comptent aussi.', src: 'lic, cat' },

  /* ── Remote Networks ── */
  rnSite: {   // compteur par site (palg) et modele par site (site)
    tiers: [
      { id: 'vs', type: 'Very Small', name: 'jusqu’à 25 Mbps',  mbps: 25 },
      { id: 's',  type: 'Small',      name: 'jusqu’à 50 Mbps',  mbps: 50 },
      { id: 'm',  type: 'Medium',     name: 'jusqu’à 250 Mbps', mbps: 250 },
      { id: 'l',  type: 'Large',      name: 'jusqu’à 1 Gbps',   mbps: 1000 },
      { id: 'xl', type: 'X-Large',    name: 'jusqu’à 2,5 Gbps', mbps: 2500 }
    ],
    oversub: 0.10, incl: ['Egress NAT', 'Redondance régionale'], src: 'cat, site',
    splitNote: 'Au-delà de 2,5 Gbps, un site s’embarque comme plusieurs sites de 2,5 Gbps, mais ce modèle ne donne pas accès aux applications privées.'
  },
  rnAgg: {    // compteur par Mbps (palg), allouee par compute location (alloc, rncheck)
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
  /* Noms et descriptions : tableau 2 du guide de licences public (palg)
     quand l'add-on y figure. unitSrc : source de l'unite par persona ; le
     guide public ne publie aucune unite d'add-on, elle vient des
     descriptions d'offres (cat) et s'affiche [a confirmer]. incSrc : source
     de l'inclusion quand elle n'est pas dans le tableau 1 public. */
  addons: [
    { id: 'privateApp',  name: 'Private App Access', desc: 'Connecteurs d’applications privées supplémentaires (jusqu’à 200), Service Connections et ZTNA Connectors.', per: ['user', 'net', 'site'], unitSrc: 'cat', inc: ['ztna', 'enterprise'], src: 'palg' },
    { id: 'scQty',       name: 'Private App Access, Service Connections supplémentaires', desc: 'Service Connections au-delà de celles de l’édition.', fixed: 'perSC', src: 'cat, sc' },
    { id: 'ztnaUnl',     name: 'ZTNA Connector, applications illimitées', desc: 'Lève la limite d’applications des ZTNA Connectors.', fixed: null, src: 'cat' },
    { id: 'appSec',      name: 'App Security', desc: 'Pare-feu applicatif web pour toutes les applications, inspection continue du trafic.', per: ['user', 'net', 'site'], unitSrc: 'cat', src: 'palg' },
    { id: 'saasInline',  name: 'SaaS Inline', desc: 'Visibilité et contrôle en temps réel des applications SaaS autorisées ou non, découverte du shadow IT.', per: ['user', 'net', 'site'], unitSrc: 'cat', inc: ['enterprise'], src: 'palg' },
    { id: 'appAccel',    name: 'App Acceleration', desc: 'Accélère les applications selon les conditions réseau, poste et application en temps réel.', per: ['user', 'net', 'site'], unitSrc: 'cat', src: 'palg' },
    { id: 'scmPro',      name: 'Strata Cloud Manager Pro', desc: 'Supervision de bout en bout de l’expérience utilisateur vers les applications (ADEM), détection et correction des problèmes de performance.', per: ['user', 'net', 'site'], unitSrc: 'cat', src: 'palg' },
    { id: 'sls',         name: 'Strata Logging Service', desc: 'Stockage et analyse des journaux dans le cloud.', per: ['user', 'net', 'site'], unitSrc: 'cat', src: 'palg' },
    { id: 'iot',         name: 'IoT', desc: 'Découverte, profilage et protection des objets connectés.', per: ['site'], unitSrc: 'cat', src: 'palg' },
    { id: 'interconnect',name: 'Interconnect', desc: 'Connectivité entre branches et des utilisateurs vers les branches par Prisma Access.', per: ['net'], unitSrc: 'cat', inc: ['ztna:site', 'enterprise:site'], incSrc: 'cat', src: 'palg' },
    { id: 'dlp',         name: 'Data Loss Protection', desc: 'Protection des données en mouvement pour tous les utilisateurs et réseaux.', per: ['user'], unitSrc: 'cat', src: 'palg' },
    { id: 'dataSec',     name: 'Data Security', desc: 'Protection unifiée des données sensibles : découverte, classification, application des politiques.', fixed: null, src: 'palg' },
    { id: 'ngcasb',      name: 'NG-CASB', desc: 'SaaS Security Inline, DLP Inline, SaaS Security API, DLP API, SSPM et AI Access Security.', fixed: null, src: 'cat' },
    { id: 'pra',         name: 'Privileged Remote Access', desc: 'Accès sans client, depuis un navigateur, aux applications internes RDP, SSH et VNC.', per: ['user'], unitSrc: 'cat', src: 'palg' },
    { id: 'trafficRep',  name: 'Traffic Replication', desc: 'Copie du trafic des utilisateurs dans le cloud pour l’analyse forensique et la chasse aux menaces.', per: ['user'], unitSrc: 'cat', src: 'palg' },
    { id: 'browserCore', name: 'Prisma Browser Core', desc: 'Navigateur d’entreprise natif SASE, postes gérés ou non, sans agent à installer.', per: ['user'], unitSrc: 'cat', inc: ['enterprise'], src: 'palg' },
    { id: 'browserPro',  name: 'Prisma Browser Pro', desc: 'DLP avancée dans le navigateur et les applications lourdes, gestion des identifiants Idira, ADEM real user monitoring.', per: ['user'], unitSrc: 'cat', src: 'palg' },
    { id: 'colo',        name: 'Colo-Connect', desc: 'Connectivité privée entre les hubs du client et Prisma Access, jusqu’à 20 Gbps par région.', fixed: 'perLink', unitSrc: 'cat', src: 'palg' },
    { id: 'excess',      name: 'Excess Data Transfer', desc: 'Transfert de données au-delà de l’allocation annuelle.', fixed: 'perTB', src: 'cat' },
    { id: 'byoip',       name: 'Onboarding des IP du client', desc: 'IPv4 ou IPv6 du client portées sur les nœuds Prisma Access.', fixed: 'flat', src: 'cat' },
    { id: 'xborder',     name: 'X-Border Connectivity', desc: 'Connectivité entre la Chine et le reste du monde.', fixed: 'flat', src: 'cat' },
    { id: 'rbi',         name: 'Remote Browser Isolation', desc: 'Rendu des sites dans des conteneurs cloud isolés. Requiert un abonnement Mobile User ou Remote Network.', fixed: null, src: 'palg, rbi' },
    { id: 'aiAccess',    name: 'AI Access', desc: 'Usage encadré des applications d’IA générative.', fixed: null, inc: ['swg', 'enterprise'], incSrc: 'cat', src: 'palg' },
    { id: 'sspm',        name: 'SSPM', desc: 'Surveillance et correction des erreurs de configuration des applications SaaS.', fixed: null, src: 'palg' },
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
    /* tiers : paliers « alternatifs » publies par sdwanlic (le modele Small /
       Medium / Large 25 / 250 / 2 500 Mbps couvre le meme besoin) ; vtiers :
       plafond de 500 Mbps en ION virtuel, descriptions d'offres seulement. */
    device: { tiers: [25, 50, 150, 250, 500, 1000, 2500], vtiers: [25, 50, 150, 250, 500], vtiersSrc: 'cat',
      note: 'Une licence par ION, au palier de débit (entrant + sortant) qui le traverse ; une paire HA demande deux licences. ZBFW inclus ; WAN Clarity Reporting et Clarity Network DVR en option, pour tous les ION de branche ou aucun. Paliers Small, Medium, Large (25, 250, 2 500 Mbps) ou paliers alternatifs de 25 Mbps à 2,5 Gbps.' },
    site: { tiers: [25, 250, 2500],
      note: 'Une licence partagée par tous les ION du site (Small, Medium, Large). ZBFW, DVR et WCR inclus.' },
    aggregate: { minAvgPerDevice: 10, note: 'Mbps partagés par tous les sites, HA comprise. ZBFW, WCR et DVR inclus. Moyenne d’au moins 10 Mbps par ION de branche.' },
    oneModel: 'Un seul type d’abonnement de branche pour tous les sites du tenant.',
    dc: 'Un abonnement data center par ION (physique ou virtuel) affecté à un site data center, débit jusqu’au maximum de l’ION.',
    siteCoreIncl: 'Le compteur Prisma Access par site inclut l’abonnement de branche Prisma SD-WAN, selon le palier acheté et le modèle d’ION : pas d’abonnement de branche à ajouter pour ces sites, seulement les ION.',
    perDeviceAddons: 'Par ION, en option : Security, SD-WAN + Security, IoT Device Security, Strata Logging Service (paliers Very Small à Large), ZBFW, WAN Clarity Reporting, Clarity Network DVR, App Acceleration.',
    src: 'sdwanlic'
  },

  /* ── Prisma Browser (palg tableau 2, pbsa, cat, pbdeck) ──
     Seul ou en add-on de Prisma Access, par utilisateur et par an. Le guide
     public decrit Core et Pro comme add-ons ; la doc d'activation confirme
     la licence seule ; Education, le contenu de la licence seule et
     l'extension Private App Access viennent des descriptions d'offres. */
  pb: {
    editions: [
      { id: 'edu',  name: 'Prisma Browser Education', short: 'Education', use: 'Contenu de Core, réservé aux établissements d’enseignement.', src: 'cat' },
      { id: 'core', name: 'Prisma Browser Core', short: 'Core', use: 'Navigateur d’entreprise pour internet et les SaaS : SWG dans le navigateur, Enterprise DLP, AI Access, console d’administration.', src: 'palg, cat' },
      { id: 'pro',  name: 'Prisma Browser Pro', short: 'Pro', use: 'Core, plus applications privées natives, DLP étendue aux applications lourdes, identifiants gérés par Idira, protection web avancée, ADEM RUM.', src: 'palg, cat' }
    ],
    addonPriv: 'En add-on de Prisma Access, Prisma Browser joint aussi les applications privées par les Service Connections et les ZTNA Connectors du tenant.',
    standalonePriv: { name: 'Private App Access pour Prisma Browser', desc: 'Pour Prisma Browser Core seul : jusqu’à 10 ZTNA Connectors et le Prisma Browser Connector pour joindre les applications privées.' },
    proWhy: { thick: 'données à protéger dans les applications lourdes (Outlook, Teams, Excel)', identity: 'comptes partagés ou applications sans SSO', rum: 'mesure de l’expérience réelle depuis le navigateur (ADEM RUM)', advWeb: 'protection web avancée (scripts à l’exécution, extensions)' },
    alloc: 'Une licence Prisma Browser seule se répartit entre plusieurs tenants, par exemple PoC et production.',
    aiAccess: 'La licence Prisma Browser seule inclut AI Access Security pour le trafic du navigateur ; l’AI Access au niveau réseau demande une autre licence.',
    mix: 'Prestataires en licence Prisma Browser seule dans un projet Prisma Access : cohabitation des deux licences sur un même tenant à vérifier avec Palo Alto Networks.',
    addonPerUser: 'L’add-on Prisma Browser s’ajoute à des utilisateurs Prisma Access : chaque utilisateur Prisma Browser en add-on compte aussi comme Mobile User.',
    ngfwPath: 'Pare-feu Palo Alto en place devant les applications : le connecteur NGFW (PAN-OS 12.1.5 ou plus, géré par Panorama) évite toute nouvelle machine.',
    pbcPath: 'Applications privées par le Prisma Browser Connector, côté data center ; le navigateur rejoint la région cloud la plus proche.',
    rdp: 'Connexion RDP et SSH native dans le navigateur, par Prisma Access ou le Prisma Browser Connector.',
    useCases: [
      ['Prestataires et tiers', 'Accès en quelques minutes sans expédier de PC, les données restent dans le navigateur.'],
      ['BYOD et appareils non gérés', 'Aucun agent intrusif, posture vérifiée en continu, mobiles compris.'],
      ['Réduction du VDI', 'Les applications web et SaaS passent dans le navigateur ; le VDI reste pour les applications lourdes.'],
      ['Fusions et acquisitions', 'Équipes rachetées en production en quelques heures, sans toucher à leurs postes.'],
      ['IA générative et SaaS', 'Copier-coller, téléversements et invites contrôlés au dernier kilomètre, trafic chiffré compris.'],
      ['Continuité d’activité', 'N’importe quel appareil devient un poste de travail sécurisé pendant un incident.']
    ]
  },

  /* ── Fiches explicatives (vue Licences) ──
     st par edition : i = inclus (guide public), t = inclus selon une
     description d'offre [a confirmer], a = add-on, n = non propose.
     ask = la question qui fait apparaitre le besoin chez le client. */
  explain: [
    { grp: 'Sécurité de l’accès internet', rows: [
      { n: 'Advanced URL Filtering', d: 'Filtrage web par catégories, analyse en ligne des pages pour bloquer le phishing et les sites malveillants inconnus.', ask: 'Faut-il filtrer la navigation des utilisateurs et des sites ?', st: { swg: 'i', ztna: 'n', enterprise: 'i' }, src: 'palg' },
      { n: 'Advanced DNS Security', d: 'Bloque les domaines malveillants, le tunneling DNS et les domaines générés par algorithme.', ask: 'Le client a-t-il une protection DNS aujourd’hui ?', st: { swg: 'i', ztna: 'n', enterprise: 'i' }, src: 'palg' },
      { n: 'Advanced Threat Prevention', d: 'IPS, anti-malware et blocage des commandes et contrôles, inconnus compris, sur tout le trafic.', ask: '', st: { swg: 'i', ztna: 'i', enterprise: 'i' }, src: 'palg' },
      { n: 'Advanced WildFire', d: 'Analyse des fichiers inconnus en bac à sable cloud, protections diffusées en quelques minutes.', ask: '', st: { swg: 'i', ztna: 'i', enterprise: 'i' }, src: 'palg' },
      { n: 'Remote Browser Isolation', d: 'Ouvre les sites à risque dans un conteneur cloud isolé ; seul le rendu arrive sur le poste.', ask: 'Les utilisateurs visitent-ils des sites non catégorisés ou à risque ?', st: { swg: 'a', ztna: 'a', enterprise: 'a' }, src: 'palg, rbi' }
    ] },
    { grp: 'Applications privées', rows: [
      { n: 'Connexion aux applications privées', d: '5 Service Connections et 10 ZTNA Connectors pour joindre data centers et clouds.', ask: 'Où sont hébergées les applications internes : data center, AWS, Azure, GCP, sites ?', st: { swg: 'a', ztna: 'i', enterprise: 'i' }, src: 'palg, sc' },
      { n: 'Private App Access', d: 'Ouvre les Service Connections et les ZTNA Connectors à Secure Web Gateway ; porte un tenant jusqu’à 200 Service Connections.', ask: 'Plus de 5 Service Connections, ou applications privées avec Secure Web Gateway ?', st: { swg: 'a', ztna: 'a', enterprise: 'a' }, src: 'palg, sc' },
      { n: 'App Security', d: 'Pare-feu applicatif web devant les applications : OWASP Top 10, bots, exploits zero-day.', ask: 'Des applications internes ouvertes aux utilisateurs distants sont-elles anciennes ou peu patchées ?', st: { swg: 'a', ztna: 'a', enterprise: 'a' }, src: 'palg' },
      { n: 'Privileged Remote Access', d: 'Accès sans client, depuis un navigateur, aux serveurs RDP, SSH et VNC.', ask: 'Des administrateurs ou des prestataires prennent-ils la main sur des serveurs ?', st: { swg: 'a', ztna: 'a', enterprise: 'a' }, src: 'palg' },
      { n: 'Colo-Connect', d: 'Interconnexion privée à haut débit entre les hubs du client et Prisma Access, jusqu’à 20 Gbps par région.', ask: 'Le data center est-il en colocation (Equinix ou autre) ?', st: { swg: 'a', ztna: 'a', enterprise: 'a' }, src: 'palg' }
    ] },
    { grp: 'Données et SaaS', rows: [
      { n: 'SaaS Inline Security', d: 'Découvre le shadow IT, note le risque de chaque SaaS et contrôle les usages (compte personnel ou d’entreprise, téléversements).', ask: 'Le client sait-il quels SaaS sont utilisés, et avec quels comptes ?', st: { swg: 'a', ztna: 'a', enterprise: 'i' }, src: 'palg' },
      { n: 'AI Access Security', d: 'Inventaire et contrôle des applications d’IA générative, protection des invites et des téléversements.', ask: 'ChatGPT, Copilot, Gemini : l’usage est-il encadré ?', st: { swg: 't', ztna: 'a', enterprise: 't' }, src: 'palg, cat' },
      { n: 'Data Loss Protection', d: 'Enterprise DLP sur les données en mouvement : plus de 1 000 identifiants, EDM, empreintes de documents.', ask: 'Des données réglementées (santé, cartes bancaires, données personnelles) partent-elles vers le web ?', st: { swg: 'a', ztna: 'a', enterprise: 'a' }, src: 'palg' },
      { n: 'Email DLP et Endpoint DLP', d: 'DLP étendue aux courriels sortants et aux périphériques (USB, imprimantes, partages).', ask: 'La fuite passe-t-elle aussi par la messagerie ou les clés USB ?', st: { swg: 'a', ztna: 'a', enterprise: 'a' }, src: 'palg' },
      { n: 'SSPM', d: 'Surveillance et correction des erreurs de configuration des SaaS (Microsoft 365, Salesforce).', ask: 'Qui vérifie les réglages de sécurité de Microsoft 365 ?', st: { swg: 'a', ztna: 'a', enterprise: 'a' }, src: 'palg' }
    ] },
    { grp: 'Navigateur d’entreprise', rows: [
      { n: 'Prisma Browser Core', d: 'Navigateur Chromium sécurisé, postes gérés ou non : SWG et DLP au dernier kilomètre, contrôle des extensions, posture vérifiée en continu.', ask: 'Des prestataires ou des appareils personnels accèdent-ils aux applications ?', st: { swg: 'a', ztna: 'a', enterprise: 'i' }, src: 'palg' },
      { n: 'Prisma Browser Pro', d: 'Core, plus DLP dans les applications lourdes, identifiants gérés par Idira, accès natif aux applications privées, ADEM RUM.', ask: 'Comptes partagés, applications sans SSO, données qui partent par Outlook ou Teams ?', st: { swg: 'a', ztna: 'a', enterprise: 'a' }, src: 'palg' }
    ] },
    { grp: 'Expérience et exploitation', rows: [
      { n: 'ADEM Core', d: 'Supervision de base de l’expérience des utilisateurs Prisma Access.', ask: '', st: { swg: 't', ztna: 't', enterprise: 't' }, src: 'cat' },
      { n: 'Strata Cloud Manager Pro', d: 'ADEM complet (tests de bout en bout : poste, Wi-Fi, FAI, application) et AIOps.', ask: 'Le support reçoit-il des plaintes de lenteur sans pouvoir dire d’où elles viennent ?', st: { swg: 'a', ztna: 'a', enterprise: 'a' }, src: 'palg' },
      { n: 'App Acceleration', d: 'Accélère les applications selon le réseau, le poste et l’application, jusqu’à 5 fois plus vite que l’accès internet direct.', ask: 'Des utilisateurs éloignés se plaignent-ils de lenteurs sur les SaaS ?', st: { swg: 'a', ztna: 'a', enterprise: 'a' }, src: 'palg' },
      { n: 'Strata Logging Service', d: 'Stockage et analyse des journaux dans le cloud.', ask: 'Quelle durée de conservation des journaux la conformité impose-t-elle ?', st: { swg: 'a', ztna: 'a', enterprise: 'a' }, src: 'palg' },
      { n: 'Traffic Replication', d: 'Copie du trafic dans le cloud pour l’analyse forensique et la chasse aux menaces.', ask: 'Le SOC a-t-il besoin des paquets, pas seulement des journaux ?', st: { swg: 'a', ztna: 'a', enterprise: 'a' }, src: 'palg' }
    ] },
    { grp: 'Sites', rows: [
      { n: 'Abonnement de branche Prisma SD-WAN', d: 'Compris dans le compteur par site, selon le palier et le modèle d’ION : seuls les boîtiers s’ajoutent.', ask: 'Les sites ont-ils un SD-WAN à remplacer ?', st: { swg: 'i', ztna: 'i', enterprise: 'i' }, src: 'palg', note: 'au compteur par site' },
      { n: 'Interconnect', d: 'Trafic entre sites, et des utilisateurs vers les sites, à travers Prisma Access.', ask: 'Les sites échangent-ils des données entre eux, ou des serveurs sont-ils dans les sites ?', st: { swg: 'a', ztna: 't', enterprise: 't' }, src: 'palg, cat', note: 'inclus au compteur par site en ZTNA et Enterprise' },
      { n: 'IoT', d: 'Découverte et profilage des objets connectés des sites, politique par type d’objet.', ask: 'Caméras, imprimantes, équipements médicaux ou industriels sur les sites ?', st: { swg: 'a', ztna: 'a', enterprise: 'a' }, src: 'palg', note: 'au compteur par site' }
    ] }
  ],
  /* Briques de raccordement, expliquees dans la vue Licences. */
  glossary: [
    { n: 'Mobile User', d: 'Un utilisateur hors site (télétravail, mobilité), connecté par GlobalProtect, Prisma Agent ou Explicit Proxy. Un utilisateur hybride compte une fois.', src: 'lic' },
    { n: 'Remote Network', d: 'Un site raccordé par tunnel IPsec depuis un ION, un pare-feu ou un routeur. Compté par site (palier de débit) ou en Mbps agrégés.', src: 'palg, site' },
    { n: 'Service Connection', d: 'Tunnel vers un data center ou un siège, environ 1 Gbps. Nécessaire pour un AD sur site, et pour que les Mobile Users joignent les sites.', src: 'sc, schb' },
    { n: 'ZTNA Connector', d: 'Machine virtuelle qui ouvre les applications d’un data center ou d’un cloud, sans tunnel IPsec ni routage à préparer. Jusqu’à 2 Gbps.', src: 'ztnaon' },
    { n: 'Compute location', d: 'Région de traitement Prisma Access. Au compteur par Mbps, la bande passante s’alloue par compute location, 50 Mbps au moins.', src: 'alloc' },
    { n: 'ION', d: 'Boîtier Prisma SD-WAN du site ou du data center, physique ou virtuel, qui monte les tunnels vers Prisma Access.', src: 'iondev' },
    { n: 'Prisma Browser Connector', d: 'Connecteur côté data center pour les utilisateurs Prisma Browser, sans Prisma Access.', src: 'pbdeck' },
    { n: 'Colo-Connect', d: 'Interconnexion privée dans une colocation, pour des Service Connections à haut débit.', src: 'palg' }
  ],

  /* ── Qualification : regles appliquees par le moteur ── */
  adOnPrem: 'Authentification sur un service du data center (Active Directory) : une Service Connection vers ce data center est nécessaire.',
  cloudZtna: 'Applications dans un cloud public : ZTNA Connector dans le VPC ou le VNet, avec groupe à mise à l’échelle automatique sur AWS et Azure.'
};
/* Un const de haut niveau n'est pas une propriete de window : on l'expose. */
if (typeof window !== 'undefined') window.SASE_RULES = SASE_RULES;
if (typeof module !== 'undefined') module.exports = { SASE_RULES };
