# Audit des regles de dimensionnement Prisma SASE, novembre 2026

Releve du 10 novembre 2026 pour l'outil `sase.html` (donnees `data/sase-rules.js`,
moteur `js/sase-engine.js`, test `_sase.js`). Sources officielles Palo Alto Networks
seulement. Aucun prix, aucune reference de commande.

## Axe principal : l'offre « Core » par persona

Source `cat` : descriptif officiel des references Palo Alto, aout 2026. Seules les
descriptions et les unites ont ete lues ; aucune colonne de prix ni de reference.

| Persona | Unite | Editions | Inclus selon la description |
|---|---|---|---|
| Prisma Access User | par utilisateur | SWG, ZTNA, Enterprise Core | SWG : securite internet (abonnement premium), SaaS Inline, AI Access Security, ADEM Core. ZTNA : applications privees, Adv. Threat Prevention, Adv. WildFire, 5 SCs, 10 ZTNA-C, ADEM Core. Enterprise : applications privees et internet, 5 SCs, 10 ZTNA-C, SaaS Inline, AI Access Sec., ADEM Core, Prisma Browser Core, 5 sites de 10 Mbps a partir de 2 000 utilisateurs achetes |
| Prisma Access Net | par Mbps | SWG, Enterprise Core (pas de ZTNA) | SWG : securite internet, SaaS Inline, AI Access Sec., ADEM Core. Enterprise : applications privees et internet, 5 SCs, 10 ZTNA-C, SaaS Inline, AI Access Sec., ADEM Core, Prisma Browser Core |
| Prisma Access Site | par site, paliers 25, 50, 250 Mbps, 1 Gbps, 2,5 Gbps | SWG, ZTNA, Enterprise Core | toutes : abonnement de bande passante SD-WAN, ADEM Core ; ZTNA et Enterprise : 5 SCs, 10 ZTNA-C, Interconnect ; SWG et Enterprise : SaaS Inline, AI Access Sec. ; Enterprise : Prisma Browser Core |

Les couvertures « Local » et « Worldwide » (minimums de 200 et 1 000 unites par
tenant, 5 lieux en Local) ne figurent plus dans le descriptif d'aout 2026 ; seules
des pages d'allocation de licences les citent encore. L'outil ne les propose pas et
l'indique en note.

## Add-ons et unites (cat, sauf mention)

- Par persona (utilisateur, Mbps, site et palier) : Private App Access (acces aux SCs et ZTNA-C pour SWG), Private App Security, SaaS Inline, App Acceleration, Strata Cloud Manager avec AIOps et ADEM (SLS 1 an compris), Strata Logging Service.
- Par utilisateur seulement : DLP, Secure Agentless Access (RDP, SSH, VNC), Traffic Replication, Prisma Browser add-on, Prisma Browser Pro add-on.
- Par Mbps seulement : Interconnect (inclus dans Site ZTNA et Enterprise Core).
- Par site et palier : IoT (une autre description dit « par unite » sans persona).
- Unites fixes : Service Connections supplementaires (par Service Connection), Colo-Connect (par lien, variante 100G), Excess Data Transfer (par To, 1 To par unite, au-dela des 250 GB inclus, palg), onboarding des IP du client (forfait), X-Border Connectivity Chine (forfait).
- Unite non publiee : ZTNA Connector applications illimitees, NG-CASB (« par unite »), Remote Browser Isolation, AI Access, SSPM, Email DLP, Endpoint DLP (ces quatre derniers viennent du guide de juin 2026).

## Prisma SD-WAN

- Abonnements ION (cat, sdwanlic) : par appareil aux paliers 25, 50, 150, 250, 500 Mbps, 1 Gbps, 2,5 Gbps (ION virtuel jusqu'a 500 Mbps), et paliers Very Small a Large ; par site jusqu'a 25, 250, 2 500 Mbps ; par Mbps (ZBFW, WAN Reporting, EDA inclus, moyenne d'au moins 10 Mbps par ION) ; Data Center par ION physique ou virtuel. Options par ION : Security, SD-WAN + Security, IoT Device Security, SLS, ZBFW, WCR, DVR, App Acceleration.
- Site Core inclut l'abonnement de bande passante SD-WAN : pour ces sites, seuls les ION entrent dans la nomenclature.
- Appareils (iondev) : ION 1200, 1200-S, 3200, 3200H, 5200, 9200, PA-5440 en data center, vION 3102V a 7132V, debits chiffres 1 400 octets en mode branche et DC. Le maximum de la datasheet est utilise tel quel (marge a trancher par Rayan).

## Sources documentaires (docs.paloaltonetworks.com et datasheets)

| Cle | Document | Ce qu'on en tire |
|---|---|---|
| palg | Prisma Access Licensing Guide (juin 2026) | ce que toutes les editions incluent (150+ emplacements, 250 GB/an, SCM ou Panorama, connexions), descriptions des add-ons, Colo-Connect 20 Gbps par region |
| lic | Your Prisma Access License | unite Mobile User (GlobalProtect, Explicit Proxy, Clientless VPN), 1 unite RN = 1 Mbps |
| site | Site-Based Licensing | Prisma Access 6.0, paliers, 10 % de depassement, Egress NAT et redondance regionale, decoupage au-dela de 2,5 Gbps sans applications privees |
| alloc, rncheck | Allocate Remote Network Bandwidth ; Planning Checklist | 50 Mbps minimum par compute location, QoS et acces entrant non pris en charge, IPSec Termination Node 1 000 Mbps et 500 sites |
| rnhp | Remote Networks, High Performance | 2 Gbps par tunnel |
| sc, schb | Service Connections ; High-Bandwidth with Multiple SCs | une SC recommandee meme sans DC (MU vers RN), environ 1 Gbps par SC, pas plus de 4 par site |
| ztna, ztnaon | ZTNA Connector | 10 inclus (ZTNA, Enterprise), jusqu'a 200 avec Private App Access, 2 Gbps par connecteur |
| allocl | Allocate Licenses | une seule edition par tenant ; mention historique Local / Worldwide |
| rbi | Cheat Sheet RBI | requiert un abonnement Mobile User ou Remote Network |
| iondev | ION Device Specifications | modeles, ports, debits, cellulaire |
| sdwanlic | Your Prisma SD-WAN License | modeles d'abonnement, un seul type par tenant, 1 a 5 ans |

## Non publie

- Unites des add-ons listes plus haut comme « unite non publiee ».
- Correspondance entre les paliers Very Small a Large des options par ION et un debit.
- Nombre de Service Connections et de ZTNA Connectors apportes par Private App Access pour SWG Core ; extension au-dela de 10 ZTNA Connectors.
