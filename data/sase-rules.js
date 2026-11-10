/* Regles de dimensionnement Prisma SASE (Prisma Access + Prisma SD-WAN).
   Table de decision finie : chaque brique, chaque seuil et chaque quantite
   incluse vient d'une source officielle Palo Alto Networks, citee par sa cle
   dans SASE_RULES.src. Releve du 10 novembre 2026, detail et citations dans
   AUDIT_SASE_2026-11.md.

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
    palg:    { t: 'Prisma Access Licensing Guide (datasheet, juin 2026, prisma_ds_prisma-access-licensing-guide_060526)', u: 'https://www.paloaltonetworks.com/resources/datasheets/prisma-access-licensing-guide' },
    lic:     { t: 'Your Prisma Access License (docs Prisma Access)', u: 'https://docs.paloaltonetworks.com/prisma-access/activation-and-onboarding/your-prisma-access-license' },
    site:    { t: 'Remote Networks, High Performance Site-Based Licensing (Prisma Access 6.0)', u: 'https://docs.paloaltonetworks.com/prisma-access/activation-and-onboarding/your-prisma-access-license/remote-networks-site-based-licensing' },
    alloc:   { t: 'Allocate Remote Network Bandwidth', u: 'https://docs.paloaltonetworks.com/prisma-access/administration/prisma-access-remote-networks/allocate-remote-network-bandwidth' },
    rncheck: { t: 'Planning Checklist for Remote Networks (IPSec Termination Nodes)', u: 'https://docs.paloaltonetworks.com/prisma-access/administration/prisma-access-remote-networks/planning-checklist-for-remote-networks' },
    rnhp:    { t: 'Remote Networks, High Performance', u: 'https://docs.paloaltonetworks.com/prisma-access/administration/prisma-access-remote-networks/remote-networks-high-performance' },
    sc:      { t: 'Prisma Access Service Connections', u: 'https://docs.paloaltonetworks.com/prisma-access/administration/prisma-access-service-connections' },
    scplan:  { t: 'Plan Service Connections Through Common Services', u: 'https://docs.paloaltonetworks.com/prisma-access/activation-and-onboarding/activate-your-prisma-access-license/cloud-managed-prisma-access-and-add-ons-license-activation/activate-a-license-for-cloud-managed-prisma-access-and-add-ons/plan-service-connections-cloud-managed-prisma-access' },
    schb:    { t: 'Create a High-Bandwidth Network Using Multiple Service Connections', u: 'https://docs.paloaltonetworks.com/prisma-access/administration/prisma-access-advanced-deployments/service-connection-advanced-deployments/create-a-high-bandwidth-network-using-multiple-service-connections' },
    allocl:  { t: 'Allocate Licenses Through Common Services', u: 'https://docs.paloaltonetworks.com/prisma-access/activation-and-onboarding/activate-your-prisma-access-license/cloud-managed-prisma-access-and-add-ons-license-activation/activate-a-license-for-cloud-managed-prisma-access-and-add-ons/allocate-licenses-cloud-managed-prisma-access' },
    addloc:  { t: 'Add Additional Locations Through Common Services', u: 'https://docs.paloaltonetworks.com/prisma-access/activation-and-onboarding/activate-your-prisma-access-license/cloud-managed-prisma-access-and-add-ons-license-activation/activate-a-license-for-cloud-managed-prisma-access-and-add-ons/add-additional-locations-cloud-managed-prisma-access' },
    ztna:    { t: 'Configure ZTNA Connector', u: 'https://docs.paloaltonetworks.com/prisma-access/administration/ztna-connector-in-prisma-access/configure-a-ztna-connector' },
    ztnaon:  { t: 'Onboarding Workflow for Prisma Access ZTNA Connector', u: 'https://docs.paloaltonetworks.com/prisma-access/activation-and-onboarding/onboard-prisma-access/onboarding-workflow-for-ztna-connector' },
    rbi:     { t: 'Cheat Sheet: Remote Browser Isolation', u: 'https://docs.paloaltonetworks.com/prisma-access/activation-and-onboarding/your-prisma-access-license/all-available-apps-and-services/cheat-sheet-rbi' },
    iondev:  { t: 'Prisma SD-WAN ION Device Specifications (datasheet, prisma_ds_sdwan-ion-device-specifications_082426)', u: 'https://www.paloaltonetworks.com/resources/datasheets/prisma-sd-wan-instant-on-network-ion-device-specifications' },
    sdwanlic:{ t: 'Your Prisma SD-WAN License', u: 'https://docs.paloaltonetworks.com/prisma-sd-wan/activation-and-onboarding/your-prisma-sd-wan-license' }
  },

  /* ── Editions de base Prisma Access (palg, table 1) ── */
  editions: [
    { id: 'swg', name: 'Secure Web Gateway', use: 'Accès internet sécurisé des utilisateurs et des sites.',
      privateApps: false, sc: 0, ztnaConn: 0,
      incl: { atp: true, wf: true, url: true, dns: true, saasInline: false, browserCore: false } },
    { id: 'ztna', name: 'Zero Trust Network Access (ZTNA)', use: 'Accès sécurisé aux applications privées.',
      privateApps: true, sc: 5, ztnaConn: 10,
      incl: { atp: true, wf: true, url: false, dns: false, saasInline: false, browserCore: false } },
    { id: 'enterprise', name: 'Enterprise', use: 'Toutes les applications, internet et privées, avec navigateur d’entreprise sécurisé et protection des données SaaS en ligne.',
      privateApps: true, sc: 5, ztnaConn: 10,
      incl: { atp: true, wf: true, url: true, dns: true, saasInline: true, browserCore: true } }
  ],
  editionSrc: 'palg',
  allEditions: ['Plus de 150 emplacements cloud', '250 GB de transfert de données par an', 'Gestion par Strata Cloud Manager ou Panorama', 'Connexion par GlobalProtect, Prisma Agent, Explicit Proxy ou tunnels IPsec', 'SLA Prisma Access'],
  inclLabels: { atp: 'Advanced Threat Prevention', wf: 'Advanced WildFire', url: 'Advanced URL Filtering', dns: 'Advanced DNS Security', saasInline: 'SaaS Inline Security', browserCore: 'Prisma Browser Core' },

  /* ── Couverture Local / Worldwide (allocl, addloc, sc, scplan) ── */
  coverage: {
    local:     { name: 'Local', minUnits: 200, locations: 5, sc: 2, src: 'allocl, addloc, sc' },
    worldwide: { name: 'Worldwide (Global)', minUnits: 1000, locations: null, sc: 5, scBelow1000: 2, src: 'allocl, addloc, sc' }
  },

  /* ── Mobile Users (lic) ── */
  mu: { unit: 'utilisateur', note: 'Une unité = un utilisateur nomade ; elle ouvre GlobalProtect, Explicit Proxy ou les deux. Les utilisateurs Clientless VPN comptent aussi.', src: 'lic' },

  /* ── Remote Networks ── */
  rnSite: {   // modele par site, Prisma Access 6.0 (site)
    tiers: [
      { id: 'vs', name: 'Very Small', mbps: 25 },
      { id: 's',  name: 'Small',      mbps: 50 },
      { id: 'm',  name: 'Medium',     mbps: 250 },
      { id: 'l',  name: 'Large',      mbps: 1000 },
      { id: 'xl', name: 'X-Large',    mbps: 2500 }
    ],
    oversub: 0.10, incl: ['Egress NAT', 'Redondance régionale'], src: 'site',
    splitNote: 'Au-delà de 2,5 Gbps, un site s’embarque comme plusieurs sites X-Large, mais ce modèle ne donne pas accès aux applications privées.'
  },
  rnAgg: {    // modele agrege par compute location (alloc, rncheck)
    unit: 'Mbps', minPerLocation: 50, nodeMbps: 1000, sitesPerNode: 500, maxNodes: 200,
    noQosInbound: 'QoS et accès entrant sécurisé non pris en charge quand la bande passante est allouée par compute location.',
    src: 'alloc, rncheck'
  },
  rnHp: { tunnelMbps: 2000, nodeMbps: 3000, branchesPerIp: 120, src: 'rnhp' },

  /* ── Acces aux applications privees ── */
  scMbps: 1000, scMaxRecommended: 4, scSrc: 'schb',
  scNote: 'Palo Alto Networks recommande toujours au moins une Service Connection : les Mobile Users joignent les Remote Networks par elle.',
  ztnaConnMbps: 2000, privateAppMax: 200, privateAppSrc: 'palg, ztna, ztnaon, sc',
  coloMbpsPerRegion: 20000, coloSrc: 'palg',

  /* ── Add-ons Prisma Access (palg, table 2) : unite de vente non publiee
     sauf mention ; on n'invente pas de quantite. ── */
  addons: [
    { id: 'privateApp',  name: 'Private App Access', desc: 'Connecteurs vers les applications privées au-delà de ceux de l’édition (jusqu’à 200), Service Connections et ZTNA Connectors.' },
    { id: 'scmPro',      name: 'Strata Cloud Manager Pro', desc: 'Supervision de l’expérience utilisateur de bout en bout (ADEM), détection et résolution des problèmes de performance.' },
    { id: 'appAccel',    name: 'App Acceleration', desc: 'Accélération des applications, jusqu’à 5 fois plus rapide que l’accès internet direct selon l’éditeur.' },
    { id: 'appSec',      name: 'App Security', desc: 'Pare-feu applicatif web (WAF) pour les applications.' },
    { id: 'saasInline',  name: 'SaaS Inline', desc: 'Visibilité et contrôle en ligne des applications SaaS, découverte du shadow IT.', inEnterprise: true },
    { id: 'aiAccess',    name: 'AI Access', desc: 'Usage encadré des applications d’IA générative.' },
    { id: 'dlp',         name: 'Data Loss Protection', desc: 'Protection des données sensibles en transit pour tous les utilisateurs et réseaux.' },
    { id: 'dataSec',     name: 'Data Security', desc: 'Découverte, classification et protection des données sensibles sur les utilisateurs, applications et réseaux.' },
    { id: 'sspm',        name: 'SSPM', desc: 'Surveillance et correction des erreurs de configuration des applications SaaS autorisées.' },
    { id: 'emailDlp',    name: 'Email DLP', desc: 'Prévention de l’exfiltration de données dans les courriels sortants.' },
    { id: 'endpointDlp', name: 'Endpoint DLP', desc: 'Contrôle des transferts de données vers les périphériques (USB, imprimantes, partages).' },
    { id: 'browserCore', name: 'Prisma Browser Core', desc: 'Navigateur d’entreprise natif SASE pour les postes gérés et non gérés.', inEnterprise: true },
    { id: 'browserPro',  name: 'Prisma Browser Pro', desc: 'DLP avancée dans le navigateur et les clients lourds, gestion des identifiants, accès natif aux applications privées, RUM ADEM.' },
    { id: 'pra',         name: 'Privileged Remote Access', desc: 'Accès sans client à RDP, SSH et VNC depuis un navigateur.' },
    { id: 'rbi',         name: 'Remote Browser Isolation', desc: 'Rendu des sites dans des conteneurs cloud isolés. Requiert un abonnement Mobile User ou Remote Network (Prisma Access 5.0 Innovation).', src: 'palg, rbi' },
    { id: 'trafficRep',  name: 'Traffic Replication', desc: 'Copie du trafic utilisateur dans le cloud pour l’analyse forensique et la chasse aux menaces.' },
    { id: 'iot',         name: 'IoT', desc: 'Découverte, profilage et protection des équipements IoT.' },
    { id: 'colo',        name: 'Colo-Connect', desc: 'Connectivité privée jusqu’à 20 Gbps par région entre les hubs du réseau et Prisma Access.' },
    { id: 'interconnect',name: 'Interconnect', desc: 'Connectivité site à site et site à utilisateur routée en privé par Prisma Access.' },
    { id: 'sls',         name: 'Strata Logging Service', desc: 'Stockage et analyse des journaux dans le cloud.' }
  ],
  addonSrc: 'palg',
  ademRn: 'Pour les Remote Networks, la bande passante ADEM d’une compute location est celle qui lui est allouée.',
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
  ionNote: 'Débits chiffrés, paquets de 1 400 octets, Prisma SD-WAN 6.5.1 ; ION 9200 en mode branche mesuré avec 2 tunnels VPN.',

  /* ── Abonnements Prisma SD-WAN (sdwanlic) ── */
  sdwan: {
    termYears: [1, 5],
    device: { tiers: [{ id: 'S', mbps: 25 }, { id: 'M', mbps: 250 }, { id: 'L', mbps: 2500 }],
      alt: [25, 50, 150, 250, 500, 1000, 2500],
      note: 'Une licence par ION ; une paire HA demande deux licences. ZBFW inclus. WAN Clarity Reporting et Clarity Network DVR en option, à prendre pour tous les ION de branche ou aucun.' },
    site: { tiers: [{ id: 'S', mbps: 25 }, { id: 'M', mbps: 250 }, { id: 'L', mbps: 2500 }],
      note: 'Une licence partagée par tous les ION du site (débit total entrant + sortant). ZBFW, DVR et WCR inclus.' },
    aggregate: { minAvgPerDevice: 10, note: 'Quantité de Mbps partagée par tous les sites, HA comprise. ZBFW, WCR et DVR inclus. Moyenne d’au moins 10 Mbps par ION de branche.' },
    oneModel: 'Un seul type d’abonnement de branche pour tous les sites du tenant.',
    dc: 'Un abonnement data center par ION (physique ou virtuel) affecté à un site data center, débit jusqu’au maximum de l’ION.',
    paSiteIncl: 'Avec le compteur Prisma Access par site, l’abonnement Prisma SD-WAN est inclus pour certains modèles selon le palier de site acheté (liste des modèles non publiée dans le guide).',
    paSiteInclSrc: 'palg',
    src: 'sdwanlic'
  }
};
/* Un const de haut niveau n'est pas une propriete de window : on l'expose. */
if (typeof window !== 'undefined') window.SASE_RULES = SASE_RULES;
if (typeof module !== 'undefined') module.exports = { SASE_RULES };
