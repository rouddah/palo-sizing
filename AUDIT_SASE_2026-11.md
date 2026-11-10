# Audit des regles de dimensionnement Prisma SASE, novembre 2026

Releve du 10 novembre 2026 pour l'outil `sase.html` (donnees `data/sase-rules.js`,
moteur `js/sase-engine.js`, test `_sase.js`). Sources officielles Palo Alto Networks
seulement. Aucun prix, aucune reference de commande.

## Sources

| Cle | Document | Ce qu'on en tire |
|---|---|---|
| palg | Prisma Access Licensing Guide, datasheet, code `prisma_ds_prisma-access-licensing-guide_060526` (juin 2026), https://www.paloaltonetworks.com/resources/datasheets/prisma-access-licensing-guide | 3 compteurs (par utilisateur, par site, par Mbps), 3 editions (table 1), ce que toutes incluent (150+ emplacements, 250 GB/an, SCM ou Panorama, GlobalProtect / Prisma Agent / Explicit Proxy / IPsec), 20 add-ons (table 2), Private App Access jusqu'a 200 connecteurs, Colo-Connect jusqu'a 20 Gbps par region, note 1 : SD-WAN inclus avec certains modeles selon le palier de site |
| lic | docs : Your Prisma Access License | 1 unite Mobile User = 1 utilisateur (GlobalProtect, Explicit Proxy ou les deux), Clientless VPN compte ; 1 unite Remote Network = 1 Mbps |
| site | docs : Remote Networks, High Performance Site-Based Licensing | Prisma Access 6.0 ; paliers Very Small 25, Small 50, Medium 250 Mbps, Large 1 Gbps, X-Large 2,5 Gbps ; entrant + sortant ; 10 % de depassement ; Egress NAT et redondance regionale inclus ; > 2,5 Gbps = plusieurs sites, sans acces aux applications privees |
| alloc | docs : Allocate Remote Network Bandwidth | modele agrege : minimum 50 Mbps par compute location, entrant + sortant, QoS et acces entrant non pris en charge, jusqu'a 1 000 remote networks par import CSV, ECMP jusqu'a 4 tunnels (BGP), bande passante ADEM RN = bande allouee |
| rncheck | docs : Planning Checklist for Remote Networks | IPSec Termination Node : 1 000 Mbps, 500 sites (5.0+), 200 noeuds par compute location ; Local Zones 500 Mbps |
| rnhp | docs : Remote Networks, High Performance | 3 Gbps par noeud, 2 Gbps par tunnel, 120 branches par IP de service |
| sc | docs : Prisma Access Service Connections | recommande toujours une Service Connection (MU vers RN en hub and spoke) ; ZTNA ou Enterprise : 5 au plus ; Private App add-on : 200 par tenant ; Global >= 1 000 unites : 5, 200 a 999 : 2 ; Local : 2 ; achat de Service Connections additionnelles possible |
| scplan | docs : Plan Service Connections (Common Services) | Local : 2 par defaut ; global enterprise ou worldwide : 5 |
| schb | docs : High-Bandwidth Network Using Multiple Service Connections | environ 1 Gbps par Service Connection, pas plus de 4 par site, au-dela ZTNA Connector ou Colo-Connect |
| allocl | docs : Allocate Licenses (Common Services) | minimum par tenant : 200 (Local), 1 000 (global ou worldwide) ; une seule edition par tenant ; licence combinee MU + RN a repartir en quantites egales |
| addloc | docs : Add Additional Locations | Local : 5 lieux par defaut, add-on Additional Locations ; Worldwide : illimite |
| ztna, ztnaon | docs : Configure ZTNA Connector ; Onboarding Workflow for ZTNA Connector | 10 connecteurs dans ZTNA et Enterprise, jusqu'a 200 avec Private App Access ; jusqu'a 2 Gbps par connecteur |
| rbi | docs : Cheat Sheet RBI | requiert Prisma Access 5.0 Innovation et un abonnement Mobile User ou Remote Network |
| iondev | Prisma SD-WAN ION Device Specifications, datasheet `prisma_ds_sdwan-ion-device-specifications_082426` | portefeuille Small / Medium / Large, ports, cellulaire, debits chiffres 1 400 octets (6.5.1), TP appmix, flux, echelle VPN DC, vION 3102V a 7132V |
| sdwanlic | docs : Your Prisma SD-WAN License | 1 a 5 ans ; DC : un abonnement par ION ; branche : par appareil S 25 / M 250 / L 2 500 Mbps (paliers alternatifs 25 a 2 500), par site S/M/L, agrege (Mbps, moyenne >= 10 Mbps par ION) ; un seul type par tenant ; ZBFW, DVR, WCR selon le modele |

## Ce que le moteur calcule

1. Edition : deduite des usages (internet seul : Secure Web Gateway ; applications privees seules : ZTNA ; les deux ou navigateur / donnees SaaS : Enterprise) ou imposee, avec alertes d'incoherence.
2. Couverture Local / Worldwide : deduite (plus de 5 lieux ou au moins 1 000 utilisateurs par tenant : Worldwide), Additional Locations au-dela de 5 lieux en Local.
3. Mobile Users : utilisateurs + Clientless, releves au minimum par tenant.
4. Remote Networks : par site (palier par profil, scission au-dela de 2,5 Gbps) ou agrege (Mbps par compute location, minimum 50, noeuds IPSec et plafond de 500 sites par noeud).
5. Service Connections : une par data center au moins, une par Gbps jusqu'a 4, une d'office si MU et RN coexistent ; comparaison aux quantites incluses et Private App Access au-dela ; ZTNA Connectors.
6. Prisma SD-WAN : plus petit ION qui tient le debit (mode branche ou DC) et les contraintes PoE, cellulaire, SFP+, durci, virtuel ; paire HA = 2 ; abonnements par appareil, par site ou agreges ; abonnement DC par ION de data center.
7. Add-ons coches : une ligne chacun, quantite nulle (« unite non publiee ») sauf mention ; SaaS Inline et Prisma Browser Core notes « inclus » en Enterprise.

## Non publie (laisse nul ou signale)

- Unite de vente des add-ons (ADEM pour les Mobile Users, RBI, DLP, SaaS Inline, AI Access, App Acceleration, IoT, etc.) : le guide de juin 2026 ne la donne pas.
- Liste des modeles ION dont l'abonnement SD-WAN est inclus dans le compteur Prisma Access par site (note 1 du guide sans detail).
- Service Connections incluses pour un tenant Worldwide sans Mobile Users (unites en Mbps) : le texte parle d'« units » sans distinguer.
- Prix, references de commande : jamais.

## Choix faits

- Un ION est retenu si le debit du site est inferieur ou egal au debit chiffre publie (pas de marge ajoutee : la datasheet est un maximum, la nomenclature le dit).
- Le palier de site est le plus petit dont le plafond couvre le debit saisi ; la tolerance de 10 % n'est pas utilisee pour descendre d'un palier.
- PA-5440 apparait comme option data center au-dela de 15 Gbps, parce que la datasheet ION le liste dans sa table des modeles.
