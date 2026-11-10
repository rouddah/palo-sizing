# Audit exhaustif PA-Series, champ par champ - 5 novembre 2026

Branche `audit-v9`. Chaque valeur de `data/pa-models.js` (59 modèles, 13
séries) a été relue à sa source. Cet audit remplace la lecture par série de
`AUDIT_DATASHEETS_2026-11.md`, qu'il corrige sur plusieurs points (voir
« Erreurs de l'audit précédent »).

Méthode :

- les PDF des datasheets ont été retéléchargés depuis paloaltonetworks.com et
  extraits avec `pdftotext -layout -enc UTF-8`. L'encodage UTF-8 garde les
  renvois de note (†, ‡, §) que l'extraction précédente perdait : c'est ce
  qui révèle le « Future release » du clustering PA-3500 ;
- la haute disponibilité, les ports HA et la première version PAN-OS ont été
  lus dans la documentation technique Palo Alto (TechDocs) quand la datasheet
  ne tranche pas ; chaque page est citée dans la colonne Source ;
- fins de vente et fins de vie : page officielle Hardware End-of-Life Dates,
  relue le 5 novembre 2026 ;
- références : datasheet quand elle a une table de commande, sinon page EoL
  ou catalogue officiel Palo Alto (référence vue, jamais reconstruite) ;
- un champ nul veut dire « non publié », jamais zéro ni « non supporté ».

## Sources

| Série | Datasheet | Édition (pied de page) | PAN-OS des mesures |
| --- | --- | --- | --- |
| PA-400 | https://www.paloaltonetworks.com/resources/datasheets/pa-400-series | `strata_ds_pa-400-series_022326` | 12.1 |
| PA-400R | https://www.paloaltonetworks.com/resources/datasheets/pa-400r-series | `strata_ds_pa-400r_022726` | 12.1 |
| PA-500 | https://www.paloaltonetworks.com/resources/datasheets/pa-500-series | `strata_ds_pa-500-series_082026` | 12.2 |
| PA-50R | https://www.paloaltonetworks.com/resources/datasheets/pa-50r-series | `strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726` | 12.2 |
| PA-800 | https://www.paloaltonetworks.com/resources/datasheets/pa-800-series-datasheet | `strata_ds_pa-800-series_071423` | 11.0 |
| PA-1400 | https://www.paloaltonetworks.com/resources/datasheets/pa-1400-series | `strata_ds_pa-1400-series_012726` | 12.1 |
| PA-1500 | https://www.paloaltonetworks.com/resources/datasheets/pa-1500-series | `strata_ds_pa-1500-series-quantum-optimized-ngfws_091126` | 12.2 |
| PA-3400 | https://www.paloaltonetworks.com/resources/datasheets/pa-3400-series | `strata_ds_pa-3400-series_021126` | 12.1 |
| PA-3500 | https://www.paloaltonetworks.com/resources/datasheets/pa-3500-series | `strata_ds_pa-3500-series-quantum-optimized-ngfws_102026` | 12.2 |
| PA-5400 | https://www.paloaltonetworks.com/resources/datasheets/pa-5400-series | `strata_ds_pa-5400-series_041426` | 12.1 |
| PA-5500 | https://www.paloaltonetworks.com/resources/datasheets/pa-5500-series | `strata_ds_pa-5500-series_081926` | 12.2 |
| PA-7000 | https://www.paloaltonetworks.com/resources/datasheets/pa-7000-series | `strata_ds_pa-7000-series_071624` | 11.2 |
| PA-7500 | https://www.paloaltonetworks.com/resources/datasheets/pa-7500 | `strata_ds_pa-7500_031126` | 11.1 |

Documentation technique (TechDocs) :

- HA Ports on Palo Alto Networks Firewalls (26/10/2026) : https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls
- HA Port and Processor Support (23/10/2026) : https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support
- PAN-OS par modèle (23/10/2026) : https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls
- HA Clustering Overview : https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview
- NGFW Clustering : https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering
- Configure an NGFW Cluster : https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering/configure-an-ngfw-cluster
- Configure Active/Passive HA (26/10/2026) : https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha
- New Features PAN-OS 12.2 : https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2
- Notes de version matérielles 12.1 et 11.1 : https://docs.paloaltonetworks.com/ngfw/release-notes/12-1/features-introduced-in-pan-os/hardware-features , https://docs.paloaltonetworks.com/pan-os/11-1/pan-os-release-notes/features-introduced-in-pan-os/hardware-features
- Guides matériels : https://docs.paloaltonetworks.com/hardware (PA-400, PA-400R, PA-500, PA-50R, PA-1500, PA-3500, PA-5500)
- Fins de vie : https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates

## Corrections (avant → après)

### Ports

| Modèle | Champ | Avant | Après | Source |
| --- | --- | --- | --- | --- |
| PA-415, PA-415-5G, PA-445 | `sfp1` | 1 | 0, `combo` 1 | DS PA-400 Table 3 p.7 : « 1G SFP/RJ45 combo (1) » |
| PA-455, PA-455-5G | `sfp1` | 2 | 0, `combo` 2 | DS PA-400 Table 3 p.7 : « 1G SFP/RJ45 combo (2) » |
| PA-450R, PA-450R-5G, PA-455R-5G | `sfp1` | 2 | 0, `combo` 2 | DS PA-400R Table 3 p.6 |
| PA-545-POE | `rj45` | 12 | 8, `mgig` 4 (1/2.5G PoE) | DS PA-500 Table 3 p.8 : « 1G RJ45 (6), 1G RJ45 bypass (2), 1G/2.5G (4)/PoE » |
| PA-555-POE | `rj45` | 12 | 8, `mgig` 4 (1/2.5G PoE), `poeP` 8 | DS PA-500 Table 3 p.8 et p.9 (PoE ports (8)) |
| PA-1410 | `rj45` | 12 | 8, `mgig` 4 (1/2.5/5G PoE) | DS PA-1400 Table 3 p.7 |
| PA-1420 | `rj45` | 12 | 4, `mgig` 8 (1/2.5/5G, dont 4 PoE) | DS PA-1400 Table 3 p.7 |
| PA-1510-POE | `rj45` | 20 | 12, `mgig` 8 (1/2.5/5G) | DS PA-1500 Table 3 p.8 |
| PA-1520-POE | `rj45` | 20 | 8, `mgig` 12 (8 en 1/2.5/5G, 4 en 1/2.5/5/10G) | DS PA-1500 Table 3 p.8 |
| PA-1530-POE | `rj45` | 20 | 8, `mgig` 12 (4 en 1/2.5/5G, 8 en 1/2.5/5/10G) | DS PA-1500 Table 3 p.8 |
| PA-3410 à PA-3440 | `rj45` | 12 | 0, `mgig` 12 (1/2.5/5/10G) | DS PA-3400 Table 3 p.7 |
| PA-3510 à PA-3540 | `rj45` | 8 | 0, `mgig` 8 (10G mGig) | DS PA-3500 Table 3 p.7 |
| PA-5410 à PA-5445 | `rj45` | 8 | 0, `mgig` 8 (1/2.5/5/10G) | DS PA-5400 Table 3 p.7 |
| PA-5510 à PA-5530 | `rj45` | 10 | 0, `mgig` 10 (10G mGig) | DS PA-5500 Table 3 p.7 |
| PA-7500 | `sfp100` | 24 | 0, `sfpdd` 24 | DS PA-7500 Table 3 p.6 : « SFP-DD (12) 100/25/10 Gbps » par NPC-A, 2 NPC-A : ce sont des SFP-DD, pas des QSFP28 |

Le nombre total de ports cuivre ne change pas : il est réparti entre `rj45`
(1G seulement) et `mgig`. Les ports de gestion, HA, HSCI et log restent hors
des comptes, et figurent mot pour mot dans `mgmt`.

### Performances et capacités

| Modèle | Champ | Avant | Après | Source |
| --- | --- | --- | --- | --- |
| PA-820 | `fw` | 1,6 Gbps | 1,5 Gbps | DS PA-800 Table 1 p.4 : 1.6/1.5 Gbps (HTTP/appmix) ; l'ancienne valeur était le chiffre HTTP |
| PA-820 | `tp` | 0,9 Gbps | 0,84 Gbps | même table : 790/840 Mbps (HTTP/appmix) |
| PA-820 | `vpn` | 1,3 Gbps | 1,4 Gbps | même table |
| PA-850 | `fw` | 2 Gbps | 1,9 Gbps | même table : 2.0/1.9 Gbps |
| PA-850 | `vpn` | 1,6 Gbps | 1,8 Gbps | même table |
| PA-820, PA-850 | `vsys` | 1 / 1 | non publié | la datasheet 07/2023 n'a pas de ligne Virtual systems |

### Haute disponibilité

| Modèle | Champ | Avant | Après | Source |
| --- | --- | --- | --- | --- |
| PA-820, PA-850 | `haAA` | false | true | DS PA-800 Table 2 p.5 : « Modes: active/active, active/passive » |
| PA-3510 à PA-3540 | `haAA` | true | non publié | DS PA-3500 Table 2 p.7 : « HA active/passive, NGFW clustering with active/active.‡ » avec ‡ « Future release » |
| PA-5510 à PA-5580 | `haAA` | true | false (non supporté) | Configure Active/Passive HA : « HA active/active mode is not supported » (PA-5500) ; l'actif/actif passe par le NGFW clustering |
| PA-7500 | `haAA` | true | false (non supporté) | même page (PA-7500) ; DS PA-7500 Table 2 p.6 : « NGFW Clustering, active-passive » |
| PA-52R-5G à PA-56R-POE-5G | `haAA` | true | non publié | DS PA-50R Table 3 p.6 : « NGFW clustering with active/active. HA active/passive. » : l'actif/actif n'y existe que par clustering |
| tous | `haAP` | ligne en dur « oui » | champ par modèle, sourcé | voir tableaux |

Le comparateur affichait « HA Active/Passive : oui » pour tous les modèles
sans donnée derrière ; c'est maintenant un champ par modèle.

### 5G Security, GlobalProtect, SD-WAN

| Modèle | Champ | Avant | Après | Source |
| --- | --- | --- | --- | --- |
| PA-54R-POE | `m5g` | true (ajouté par l'audit précédent) | true, inchangé | DS PA-50R Table 3 p.6, toute la série |
| 27 modèles sans section Mobile Network (PA-400, PA-500 hors PA-520-5G déjà nul, PA-1400, PA-400R, PA-800) | `m5g` | false | non publié | la datasheet n'en parle pas ; seules PA-3410 et PA-3420 restent à false, exclues explicitement (« PA-3440 and PA-3430 ») |
| PA-400, PA-400R | GlobalProtect | oui (en dur) | non publié | les datasheets 02/2026 ne mentionnent pas GlobalProtect |
| PA-7500 | SD-WAN | oui (en dur) | non publié | la datasheet 03/2026 ne mentionne pas SD-WAN |

Libellé du comparateur : « 5G / GTP / SCTP Security » devient « 5G Security » :
seules les PA-3400, PA-5400 et PA-7000 listent GTP et SCTP.

### Format, références, textes

| Modèle | Champ | Avant | Après | Source |
| --- | --- | --- | --- | --- |
| PA-501 à PA-560 | `f` | 1U Rack | Desktop (rack 1U en option) | DS PA-500 Table 3 p.10 (dimensions de bureau, format non qualifié), Table 4 p.11 (kits PAN-1RU-4POST-RACK vendus à part) |
| PA-7050 | `sku` | PAN-PA-7050 | PAN-PA-7050-AC-SYS | page EoL (PAN-PA-7050 n'apparaît dans aucune source) |
| PA-7080 | `sku` | PAN-PA-7080 | PAN-PA-7080-AC-SYS | page EoL et catalogue officiel |
| PA-7500 | `sku` | PAN-PA-7500 | PAN-PA-7500-A-SYS | catalogue officiel (« PA-7500 Chassis assembly ») ; PAN-PA-7500 n'apparaît dans aucune source |
| PA-455R-5G | `sku` | non publié | PAN-PA-455R-5G | catalogue officiel ; la Table 4 de la datasheet le nomme sans préfixe |
| PA-820, PA-850, PA-7050, PA-7080 | `target` | « … [tiret cadratin] EoS » | « …, EoS » | em-dash retiré |
| commentaire de données | remplacement PA-800 | PA-1500 | PA-1400 | page EoL |
| qualification.html | texte PA-500 | « Gamme 1U rack avec PoE intégré » | gamme de bureau, rack en option, PoE sur PA-545-POE et PA-555-POE | DS PA-500 |
| qualification.html | texte PA-3500 | « clustering NGFW actif/actif » | HA A/P, clustering annoncé pour une version future | DS PA-3500 Table 2 |
| qualification.html | texte PA-5500 | sans HA | HA A/P ou NGFW clustering, sans A/A classique | Configure Active/Passive HA |
| qualification.html | liste PoE et 5G du guide | incomplète | ajoute PA-415-5G, PA-455-5G, PA-1500, PA-520-5G, PA-400R, PA-50R | datasheets |
| qualification.html, pa-series.html | « PAN-OS 12.1 » comme version unique | faux pour 6 séries | 11.0 à 12.2 selon la série | Note de la Table 1 de chaque datasheet |
| wizard.html | paliers > 30 000 utilisateurs | PA-5450 (fin de vente le 22/11/2026) et PA-7000 (fin de vente) | PA-5445, PA-5560, PA-7500 | page EoL |

## Champs ajoutés au modèle de données

| Champ | Contenu | Affiché dans |
| --- | --- | --- |
| `mgig`, `mgigSp` | ports cuivre multi-gig et leurs vitesses exactes | comparateur (Tableau, Comparaison, loupe), recherche (filtre et tableau), établi |
| `combo` | ports 1G SFP/RJ45 combo | idem |
| `sfpdd` | ports SFP-DD 100/25/10G (PA-7500) | idem ; le filtre 100G de la recherche compte QSFP28 et SFP-DD |
| `poeP` | nombre de ports PoE (nul : répartition non publiée) | comparateur, recherche, établi |
| `io`, `mgmt` | lignes I/O et Management I/O de la datasheet, mot pour mot | comparateur |
| `haAP`, `haAA`, `haCl`, `haPorts`, `haNote` | HA actif/passif, actif/actif classique (false = exclu par la doc), clustering et membres, ports HA dédiés, source | comparateur, loupe, recherche, établi (modes publiés du modèle retenu) |
| `panosMin`, `panosMax`, `dsOs` | première version PAN-OS, dernière (fin de vie), version des mesures | comparateur |
| `eosD`, `eolD` | dates End of Sale et End of Life | comparateur, loupe, recherche |
| `disk`, `psu`, `cool` | stockage, alimentation et redondance, refroidissement | comparateur |

`_data-audit.js` exige ces champs sur chaque modèle et contrôle leur
cohérence (multi-gig sans vitesse, PoE sans port PoE, A/A sans A/P, dates).

## Erreurs de l'audit précédent

- « PA-800 et PA-7000 : datasheets retirées » : faux. Les deux sont en ligne
  (`pa-800-series-datasheet`, `pa-7000-series`). La PA-7000 est conforme ; la
  PA-800 avait cinq valeurs fausses (ci-dessus).
- `haAA` passé à true sur PA-50R en lisant « NGFW clustering with
  active/active » comme une HA actif/actif classique.
- PA-3500 : le renvoi ‡ « Future release » sur le clustering avait disparu à
  l'extraction du PDF.
- PA-7500 : les 24 SFP-DD étaient comptés en QSFP28 100G.
- Ports cuivre multi-gig comptés en « 1G RJ45 » sur dix séries.

## Contradictions dans les sources officielles

| Sujet | Source A | Source B | Retenu |
| --- | --- | --- | --- |
| HA classique sur PA-5500 / PA-7500 | NGFW Clustering : « The NGFW cluster replaces legacy HA pairs … which are not available on these firewalls » | Configure Active/Passive HA (plus récente) : A/P supporté sur PA-7500 dès 12.1.5 et sur PA-5500 dès 12.1.7 | A/P oui (page la plus récente, cohérente avec la datasheet PA-7500), A/A non |
| PA-5540 à PA-5580 | NGFW Clustering : « require an NGFW cluster of two firewalls » (12.1.2) | Configure Active/Passive HA : A/P dès 12.1.7 | A/P oui, avec la version dans `haNote` |
| Clustering PA-3500 | datasheet 10/2026 : « Future release » | Configure an NGFW Cluster et New Features 12.2 : PA-3500 listé, 2 membres | les deux sont cités dans `haCl` |
| Budget PoE PA-455-5G | DS PA-400 p.7, bloc PoE : 91 W | DS PA-400 p.7, Power Supply : « with 151 W PoE output » | 151 W, inchangé |
| Budget PoE PA-555-POE | bloc PoE : 330 W | Power Consumption : « 332W PoE output » | 330 W, inchangé |
| Nom du troisième PA-50R | DS Table 1 : PA-54R-POE-5G | DS Table 4, Compatibility Matrix, HA Port Support : PA-54R-POE | PA-54R-POE |
| Alimentation PA-555-POE | Table 4 : PAN-PWR-550W-54V-AC-A | Table 4, kit : « 530W AC power adapter » | puissance non reprise |

## Ce qui reste non publié

| Modèle(s) | Champ |
| --- | --- |
| PA-440, PA-450, PA-460, PA-820, PA-850, PA-7050, PA-7080 | PAN-OS minimal (la Compatibility Matrix commence à 10.1) |
| PA-3510 à PA-3540, PA-52R-5G à PA-56R-POE-5G | HA actif/actif classique |
| PA-400, PA-400R, PA-500, PA-800, PA-1400, PA-1500 | clustering |
| PA-50R | nombre de membres du clustering, PAN-OS minimal du clustering |
| PA-410R, PA-410R-5G, PA-450R-5G, PA-501 | ports HA (absents de la matrice HA Port Support) |
| PA-54R-POE-D-5G, PA-54R-POE, PA-56R-POE-5G | nombre de ports PoE, budget PoE |
| PA-455R-5G | budget PoE |
| PA-520-5G, PA-52R-5G, PA-54R-POE-D-5G, PA-54R-POE, PA-56R-POE-5G | référence châssis |
| PA-7500 | stockage, 5G Security, SD-WAN |
| PA-7050, PA-7080 | refroidissement |
| PA-400, PA-400R | GlobalProtect |
| PA-820, PA-850 | systèmes virtuels |
| PA-5510 à PA-5530 | consommation, BTU/h, courant d'appel, MTBF (TBD dans la datasheet, sans champ sur le site) |
| PA-400, PA-500, PA-800, PA-1400, PA-3400, PA-5400, PA-7000, PA-7500 | capacités de configuration (GlobalProtect max, zones, politiques, tunnels, SSL, objets, NAT, SD-WAN, profils) : reprises d'éditions antérieures, plus publiées par les éditions courantes, **[à confirmer]** |

## Tableau par modèle

Chaque ligne donne la valeur actuelle de `data/pa-models.js` et sa source
(code d'édition de la datasheet, page et table, ou URL de la documentation).
« *non publie* » : aucune source officielle ne donne la valeur.

### PA-410 (PA-400)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-400-series (`strata_ds_pa-400-series_022326`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 1.4 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 0.8 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 0.5 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Sessions max (sess) | 64000 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 11000 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 1 / 1 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 7 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 1G RJ45 (7) | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-400-series_022326, Table 3 p.7 (Power Over Ethernet) et Power Supply p.7 |
| Ports de gestion (mgmt) | 10/100/1000 out-of-band management port (1), RJ45 console port (1), USB port (2) | strata_ds_pa-400-series_022326, Table 3 p.7 (Management I/O) |
| Format (f) | Desktop | strata_ds_pa-400-series_022326, Highlights p.1 (desktop form factor), Table 3 p.8 (Dimensions) |
| Stockage (disk) | 64 GB eMMC | strata_ds_pa-400-series_022326, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | Adaptateur AC externe (12 VDC), alimentation redondante en option | strata_ds_pa-400-series_022326, Highlights p.1 (optional redundant power supply), Table 3 p.7-8 (Power Supply, Max Current) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-400-series_022326, Highlights p.1 (fanless) et Table 3 p.8 (Passive cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| Ports HA dedies (haPorts) | Aucun port HA dédié : ports de données configurés en HA1/HA2 | https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls (PA-400 : data port) ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support |
| 5G Security (m5g) | *non publie* | strata_ds_pa-400-series_022326, aucune section Mobile Network Infrastructure |
| GlobalProtect | *non publie* | strata_ds_pa-400-series_022326, GlobalProtect non mentionne par la datasheet 02/2026 |
| Reference (sku) | PAN-PA-410 | catalogue officiel Palo Alto (liste de references, colonne SKU) ; https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (PAN-PA-410 a 460) |
| PAN-OS minimal (panosMin) | 10.1.2 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | 12.1 | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| End of Sale / End of Life (eosD / eolD, eos) | 2027-03-22 / 2032-03-21, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-400-series_022326, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 250 / 25 / 500 / 1000 / 6553 / 2500 / 400 / 1000 / 100 / 75 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-415 (PA-400)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-400-series (`strata_ds_pa-400-series_022326`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 1.5 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 0.8 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 0.5 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Sessions max (sess) | 64000 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 11000 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 1 / 1 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 8 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 1 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 1G SFP/RJ45 combo (1), 1G RJ45 (4), 1G RJ45/PoE (4) | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | oui / 4 / 91 W | strata_ds_pa-400-series_022326, Table 3 p.7 (Power Over Ethernet) et Power Supply p.7 |
| Ports de gestion (mgmt) | SFP/RJ45 (1 GB) combo management port (1), RJ45 console port (1), USB port (2), Micro USB console port (1) | strata_ds_pa-400-series_022326, Table 3 p.7 (Management I/O) |
| Format (f) | Desktop | strata_ds_pa-400-series_022326, Highlights p.1 (desktop form factor), Table 3 p.8 (Dimensions) |
| Stockage (disk) | 128 GB eMMC | strata_ds_pa-400-series_022326, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | Adaptateur AC externe (12 VDC), alimentation redondante en option | strata_ds_pa-400-series_022326, Highlights p.1 (optional redundant power supply), Table 3 p.7-8 (Power Supply, Max Current) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-400-series_022326, Highlights p.1 (fanless) et Table 3 p.8 (Passive cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| Ports HA dedies (haPorts) | Aucun port HA dédié : ports de données configurés en HA1/HA2 | https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls (PA-400 : data port) ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support |
| 5G Security (m5g) | *non publie* | strata_ds_pa-400-series_022326, aucune section Mobile Network Infrastructure |
| GlobalProtect | *non publie* | strata_ds_pa-400-series_022326, GlobalProtect non mentionne par la datasheet 02/2026 |
| Reference (sku) | PAN-PA-415 | catalogue officiel Palo Alto (liste de references, colonne SKU) ; https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (PAN-PA-410 a 460) |
| PAN-OS minimal (panosMin) | 11.0 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | 12.1 | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| End of Sale / End of Life (eosD / eolD, eos) | 2027-03-22 / 2032-03-21, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-400-series_022326, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 250 / 25 / 500 / 1000 / 6553 / 2500 / 400 / 1000 / 100 / 75 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-415-5G (PA-400)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-400-series (`strata_ds_pa-400-series_022326`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 1.5 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 0.8 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 0.5 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Sessions max (sess) | 64000 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 11400 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 1 / 1 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 8 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 1 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Libelle I/O (io) | Embedded 5G cellular module, 1G SFP/RJ45 combo (1), 1G RJ45 (4), 1G RJ45/PoE (4) | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | oui / 4 / 91 W | strata_ds_pa-400-series_022326, Table 3 p.7 (Power Over Ethernet) et Power Supply p.7 |
| Ports de gestion (mgmt) | SFP/RJ45 (1 GB) combo management port (1), RJ45 console port (1), USB port (2), Micro USB console port (1) | strata_ds_pa-400-series_022326, Table 3 p.7 (Management I/O) |
| Format (f) | Desktop | strata_ds_pa-400-series_022326, Highlights p.1 (desktop form factor), Table 3 p.8 (Dimensions) |
| Stockage (disk) | 128 GB eMMC | strata_ds_pa-400-series_022326, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | Adaptateur AC externe (12 VDC), alimentation redondante en option | strata_ds_pa-400-series_022326, Highlights p.1 (optional redundant power supply), Table 3 p.7-8 (Power Supply, Max Current) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-400-series_022326, Highlights p.1 (fanless) et Table 3 p.8 (Passive cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| Ports HA dedies (haPorts) | Aucun port HA dédié : ports de données configurés en HA1/HA2 | https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls (PA-400 : data port) ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support |
| 5G Security (m5g) | *non publie* | strata_ds_pa-400-series_022326, aucune section Mobile Network Infrastructure |
| GlobalProtect | *non publie* | strata_ds_pa-400-series_022326, GlobalProtect non mentionne par la datasheet 02/2026 |
| Reference (sku) | PAN-PA-415-5G | catalogue officiel Palo Alto (liste de references, colonne SKU) ; https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (PAN-PA-410 a 460) |
| PAN-OS minimal (panosMin) | 11.1 | https://docs.paloaltonetworks.com/pan-os/11-1/pan-os-release-notes/features-introduced-in-pan-os/hardware-features ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-400-series_022326, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 250 / 25 / 500 / 1000 / 6553 / 2500 / 400 / 1000 / 100 / 75 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-440 (PA-400)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-400-series (`strata_ds_pa-400-series_022326`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 2.4 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 1.2 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 1.1 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Sessions max (sess) | 200000 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 34000 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 1 / 2 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 8 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 1G RJ45 (8) | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-400-series_022326, Table 3 p.7 (Power Over Ethernet) et Power Supply p.7 |
| Ports de gestion (mgmt) | 10/100/1000 out-of-band management port (1), RJ45 console port (1), USB port (2), Micro USB console port (1) | strata_ds_pa-400-series_022326, Table 3 p.7 (Management I/O) |
| Format (f) | Desktop | strata_ds_pa-400-series_022326, Highlights p.1 (desktop form factor), Table 3 p.8 (Dimensions) |
| Stockage (disk) | 128 GB eMMC | strata_ds_pa-400-series_022326, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | Adaptateur AC externe (12 VDC), alimentation redondante en option | strata_ds_pa-400-series_022326, Highlights p.1 (optional redundant power supply), Table 3 p.7-8 (Power Supply, Max Current) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-400-series_022326, Highlights p.1 (fanless) et Table 3 p.8 (Passive cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| Ports HA dedies (haPorts) | Aucun port HA dédié : ports de données configurés en HA1/HA2 | https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls (PA-400 : data port) ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support |
| 5G Security (m5g) | *non publie* | strata_ds_pa-400-series_022326, aucune section Mobile Network Infrastructure |
| GlobalProtect | *non publie* | strata_ds_pa-400-series_022326, GlobalProtect non mentionne par la datasheet 02/2026 |
| Reference (sku) | PAN-PA-440 | catalogue officiel Palo Alto (liste de references, colonne SKU) ; https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (PAN-PA-410 a 460) |
| PAN-OS minimal (panosMin) | *non publie* | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls (colonnes a partir de 10.1 : premiere version non publiee) |
| Dernier PAN-OS (panosMax) | 12.2 | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| End of Sale / End of Life (eosD / eolD, eos) | 2027-03-22 / 2032-03-21, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-400-series_022326, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 1000 / 50 / 2000 / 2800 / 19890 / 10000 / 3000 / 2800 / 250 / 100 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-445 (PA-400)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-400-series (`strata_ds_pa-400-series_022326`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 2.7 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 1.25 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 1.1 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Sessions max (sess) | 200000 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 34000 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 1 / 2 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 8 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 1 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 1G SFP/RJ45 combo (1), 1G RJ45 (4), 1G RJ45/PoE (4) | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | oui / 4 / 91 W | strata_ds_pa-400-series_022326, Table 3 p.7 (Power Over Ethernet) et Power Supply p.7 |
| Ports de gestion (mgmt) | SFP/RJ45 (1 GB) combo management port (1), RJ45 console port (1), USB port (2), Micro USB console port (1) | strata_ds_pa-400-series_022326, Table 3 p.7 (Management I/O) |
| Format (f) | Desktop | strata_ds_pa-400-series_022326, Highlights p.1 (desktop form factor), Table 3 p.8 (Dimensions) |
| Stockage (disk) | 128 GB eMMC | strata_ds_pa-400-series_022326, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | Adaptateur AC externe (12 VDC), alimentation redondante en option | strata_ds_pa-400-series_022326, Highlights p.1 (optional redundant power supply), Table 3 p.7-8 (Power Supply, Max Current) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-400-series_022326, Highlights p.1 (fanless) et Table 3 p.8 (Passive cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| Ports HA dedies (haPorts) | Aucun port HA dédié : ports de données configurés en HA1/HA2 | https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls (PA-400 : data port) ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support |
| 5G Security (m5g) | *non publie* | strata_ds_pa-400-series_022326, aucune section Mobile Network Infrastructure |
| GlobalProtect | *non publie* | strata_ds_pa-400-series_022326, GlobalProtect non mentionne par la datasheet 02/2026 |
| Reference (sku) | PAN-PA-445 | catalogue officiel Palo Alto (liste de references, colonne SKU) ; https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (PAN-PA-410 a 460) |
| PAN-OS minimal (panosMin) | 11.0 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | 12.2 | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| End of Sale / End of Life (eosD / eolD, eos) | 2027-03-22 / 2032-03-21, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-400-series_022326, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 1000 / 50 / 2000 / 2800 / 19890 / 10000 / 3000 / 2800 / 250 / 100 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-450 (PA-400)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-400-series (`strata_ds_pa-400-series_022326`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 3.3 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 2.1 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 1.7 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Sessions max (sess) | 300000 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 48000 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 1 / 5 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 8 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 1G RJ45 (8) | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-400-series_022326, Table 3 p.7 (Power Over Ethernet) et Power Supply p.7 |
| Ports de gestion (mgmt) | 10/100/1000 out-of-band management port (1), RJ45 console port (1), USB port (2), Micro USB console port (1) | strata_ds_pa-400-series_022326, Table 3 p.7 (Management I/O) |
| Format (f) | Desktop | strata_ds_pa-400-series_022326, Highlights p.1 (desktop form factor), Table 3 p.8 (Dimensions) |
| Stockage (disk) | 128 GB eMMC | strata_ds_pa-400-series_022326, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | Adaptateur AC externe (12 VDC), alimentation redondante en option | strata_ds_pa-400-series_022326, Highlights p.1 (optional redundant power supply), Table 3 p.7-8 (Power Supply, Max Current) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-400-series_022326, Highlights p.1 (fanless) et Table 3 p.8 (Passive cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| Ports HA dedies (haPorts) | Aucun port HA dédié : ports de données configurés en HA1/HA2 | https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls (PA-400 : data port) ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support |
| 5G Security (m5g) | *non publie* | strata_ds_pa-400-series_022326, aucune section Mobile Network Infrastructure |
| GlobalProtect | *non publie* | strata_ds_pa-400-series_022326, GlobalProtect non mentionne par la datasheet 02/2026 |
| Reference (sku) | PAN-PA-450 | catalogue officiel Palo Alto (liste de references, colonne SKU) ; https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (PAN-PA-410 a 460) |
| PAN-OS minimal (panosMin) | *non publie* | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls (colonnes a partir de 10.1 : premiere version non publiee) |
| Dernier PAN-OS (panosMax) | 12.2 | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| End of Sale / End of Life (eosD / eolD, eos) | 2027-03-22 / 2032-03-21, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-400-series_022326, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 1500 / 75 / 2500 / 2800 / - / 15000 / 3000 / 2800 / 250 / 150 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-455 (PA-400)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-400-series (`strata_ds_pa-400-series_022326`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 3.6 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 2.3 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 1.8 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Sessions max (sess) | 300000 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 56000 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 1 / 5 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 6 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 2 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 1G SFP/RJ45 combo (2), 1G RJ45 (2), 1G RJ45/PoE (4) | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | oui / 4 / 91 W | strata_ds_pa-400-series_022326, Table 3 p.7 (Power Over Ethernet) et Power Supply p.7 |
| Ports de gestion (mgmt) | 10/100/1000 out-of-band management port (1), RJ45 console port (1), USB port (2), Micro USB console port (1) | strata_ds_pa-400-series_022326, Table 3 p.7 (Management I/O) |
| Format (f) | Desktop | strata_ds_pa-400-series_022326, Highlights p.1 (desktop form factor), Table 3 p.8 (Dimensions) |
| Stockage (disk) | 128 GB eMMC | strata_ds_pa-400-series_022326, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | Adaptateur AC externe (12 VDC), alimentation redondante en option | strata_ds_pa-400-series_022326, Highlights p.1 (optional redundant power supply), Table 3 p.7-8 (Power Supply, Max Current) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-400-series_022326, Highlights p.1 (fanless) et Table 3 p.8 (Passive cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| Ports HA dedies (haPorts) | Aucun port HA dédié : ports de données configurés en HA1/HA2 | https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls (PA-400 : data port) ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support |
| 5G Security (m5g) | *non publie* | strata_ds_pa-400-series_022326, aucune section Mobile Network Infrastructure |
| GlobalProtect | *non publie* | strata_ds_pa-400-series_022326, GlobalProtect non mentionne par la datasheet 02/2026 |
| Reference (sku) | PAN-PA-455 | catalogue officiel Palo Alto (liste de references, colonne SKU) ; https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (PAN-PA-410 a 460) |
| PAN-OS minimal (panosMin) | 11.1 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | 12.2 | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| End of Sale / End of Life (eosD / eolD, eos) | 2027-03-22 / 2032-03-21, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-400-series_022326, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 1500 / 75 / 2500 / 2800 / - / 15000 / 3000 / 2800 / 250 / 150 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-455-5G (PA-400)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-400-series (`strata_ds_pa-400-series_022326`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 3.2 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 1.8 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 1.6 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Sessions max (sess) | 300000 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 48000 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 1 / 5 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 10 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 2 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Libelle I/O (io) | Embedded 5G cellular module, 1G SFP/RJ45 combo (2), 1G RJ45 (6), 1G RJ45 PoE (4) | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | oui / 4 / 151 W | strata_ds_pa-400-series_022326, Table 3 p.7 (Power Over Ethernet) et Power Supply p.7 |
| Ports de gestion (mgmt) | SFP/RJ45 (1 GB) combo management port (1), RJ45 console port (1), USB port (1) | strata_ds_pa-400-series_022326, Table 3 p.7 (Management I/O) |
| Format (f) | Desktop | strata_ds_pa-400-series_022326, Highlights p.1 (desktop form factor), Table 3 p.8 (Dimensions) |
| Stockage (disk) | 128 GB eMMC | strata_ds_pa-400-series_022326, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | Adaptateur AC externe (54 VDC), alimentation redondante en option | strata_ds_pa-400-series_022326, Highlights p.1 (optional redundant power supply), Table 3 p.7-8 (Power Supply, Max Current) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-400-series_022326, Highlights p.1 (fanless) et Table 3 p.8 (Passive cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| Ports HA dedies (haPorts) | Aucun port HA dédié : ports de données configurés en HA1/HA2 | https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls (PA-400 : data port) ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support |
| 5G Security (m5g) | *non publie* | strata_ds_pa-400-series_022326, aucune section Mobile Network Infrastructure |
| GlobalProtect | *non publie* | strata_ds_pa-400-series_022326, GlobalProtect non mentionne par la datasheet 02/2026 |
| Reference (sku) | PAN-PA-455-5G | catalogue officiel Palo Alto (liste de references, colonne SKU) ; https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (PAN-PA-410 a 460) |
| PAN-OS minimal (panosMin) | 11.2.3 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-400-series_022326, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 1500 / 75 / 2500 / 2800 / - / 15000 / 3000 / 2800 / 250 / 150 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-460 (PA-400)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-400-series (`strata_ds_pa-400-series_022326`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 4.2 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 3 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 2.3 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Sessions max (sess) | 400000 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 67000 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 1 / 5 | strata_ds_pa-400-series_022326, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 8 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 1G RJ45 (8) | strata_ds_pa-400-series_022326, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-400-series_022326, Table 3 p.7 (Power Over Ethernet) et Power Supply p.7 |
| Ports de gestion (mgmt) | 10/100/1000 out-of-band management port (1), RJ45 console port (1), USB port (2), Micro USB console port (1) | strata_ds_pa-400-series_022326, Table 3 p.7 (Management I/O) |
| Format (f) | Desktop | strata_ds_pa-400-series_022326, Highlights p.1 (desktop form factor), Table 3 p.8 (Dimensions) |
| Stockage (disk) | 128 GB eMMC | strata_ds_pa-400-series_022326, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | Adaptateur AC externe (12 VDC), alimentation redondante en option | strata_ds_pa-400-series_022326, Highlights p.1 (optional redundant power supply), Table 3 p.7-8 (Power Supply, Max Current) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-400-series_022326, Highlights p.1 (fanless) et Table 3 p.8 (Passive cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-400-series_022326, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400-hardware-reference/pa-400-firewall-overview |
| Ports HA dedies (haPorts) | Aucun port HA dédié : ports de données configurés en HA1/HA2 | https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls (PA-400 : data port) ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support |
| 5G Security (m5g) | *non publie* | strata_ds_pa-400-series_022326, aucune section Mobile Network Infrastructure |
| GlobalProtect | *non publie* | strata_ds_pa-400-series_022326, GlobalProtect non mentionne par la datasheet 02/2026 |
| Reference (sku) | PAN-PA-460 | catalogue officiel Palo Alto (liste de references, colonne SKU) ; https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (PAN-PA-410 a 460) |
| PAN-OS minimal (panosMin) | *non publie* | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls (colonnes a partir de 10.1 : premiere version non publiee) |
| Dernier PAN-OS (panosMax) | 12.2 | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| End of Sale / End of Life (eosD / eolD, eos) | 2027-03-22 / 2032-03-21, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-400-series_022326, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 1500 / 100 / 2500 / 2800 / - / 15000 / 3000 / 2800 / 250 / 150 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-501 (PA-500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-500-series (`strata_ds_pa-500-series_082026`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 0.8 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Threat Prevention appmix (tp, Gbps) | 0.5 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| IPsec VPN (vpn, Gbps) | 0.24 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Sessions max (sess) | 30000 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Nouvelles sessions/s (cps) | 5000 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Systemes virtuels base/max (vsys) | *non publie* | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Cuivre RJ45 1G (rj45) | 7 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Libelle I/O (io) | 1G RJ45 (7) | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-500-series_082026, Table 3 p.9 (Power Over Ethernet) |
| Ports de gestion (mgmt) | 10/100/1000 out-of-band management port (1), USB port (2), RJ45 console port (1) | strata_ds_pa-500-series_082026, Table 3 p.8 (Management I/O) |
| Format (f) | Desktop (rack 1U en option) | strata_ds_pa-500-series_082026, Table 3 p.10 (Dimensions de bureau), Table 4 p.11 (kits PAN-1RU-4POST-RACK) |
| Stockage (disk) | 128 GB | strata_ds_pa-500-series_082026, Table 3 p.8 (Storage Capacity) |
| Alimentation (psu) | Adaptateur AC externe (12 VDC), un fourni ; second adaptateur redondant en option sur les plateformes à double entrée | strata_ds_pa-500-series_082026, Table 3 p.9 (Maximum Current Consumption) et Table 4 p.11 (note : second adaptateur redondant en option) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-500-series_082026, Table 3 p.10 (Passive cooling / Active cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| Ports HA dedies (haPorts) | *non publie* | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support (aucun port HA ; PA-501 absent de la matrice) |
| 5G Security (m5g) | *non publie* | strata_ds_pa-500-series_082026, aucune section Mobile Network Infrastructure |
| GlobalProtect | oui | strata_ds_pa-500-series_082026, Table 2 p.8 |
| Reference (sku) | PAN-PA-501 | catalogue officiel Palo Alto (liste de references, colonne SKU) ; PA-520-5G absent |
| PAN-OS minimal (panosMin) | 12.1.4-h2 | https://docs.paloaltonetworks.com/ngfw/release-notes/12-1/features-introduced-in-pan-os/hardware-features ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-500-series_082026, Table 1 p.7 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-505 (PA-500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-500-series (`strata_ds_pa-500-series_082026`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 1.2 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Threat Prevention appmix (tp, Gbps) | 0.8 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| IPsec VPN (vpn, Gbps) | 0.4 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Sessions max (sess) | 64000 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Nouvelles sessions/s (cps) | 10000 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Systemes virtuels base/max (vsys) | *non publie* | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Cuivre RJ45 1G (rj45) | 7 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Libelle I/O (io) | 1G RJ45 (7) | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-500-series_082026, Table 3 p.9 (Power Over Ethernet) |
| Ports de gestion (mgmt) | 10/100/1000 out-of-band management port (1), USB port (2), RJ45 console port (1) | strata_ds_pa-500-series_082026, Table 3 p.8 (Management I/O) |
| Format (f) | Desktop (rack 1U en option) | strata_ds_pa-500-series_082026, Table 3 p.10 (Dimensions de bureau), Table 4 p.11 (kits PAN-1RU-4POST-RACK) |
| Stockage (disk) | 128 GB | strata_ds_pa-500-series_082026, Table 3 p.8 (Storage Capacity) |
| Alimentation (psu) | Adaptateur AC externe (12 VDC), un fourni ; second adaptateur redondant en option sur les plateformes à double entrée | strata_ds_pa-500-series_082026, Table 3 p.9 (Maximum Current Consumption) et Table 4 p.11 (note : second adaptateur redondant en option) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-500-series_082026, Table 3 p.10 (Passive cooling / Active cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| Ports HA dedies (haPorts) | Aucun port HA dédié : ports de données configurés en HA1/HA2 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support (aucun port HA ; PA-501 absent de la matrice) |
| 5G Security (m5g) | *non publie* | strata_ds_pa-500-series_082026, aucune section Mobile Network Infrastructure |
| GlobalProtect | oui | strata_ds_pa-500-series_082026, Table 2 p.8 |
| Reference (sku) | PAN-PA-505 | catalogue officiel Palo Alto (liste de references, colonne SKU) ; PA-520-5G absent |
| PAN-OS minimal (panosMin) | 12.1.3 | https://docs.paloaltonetworks.com/ngfw/release-notes/12-1/features-introduced-in-pan-os/hardware-features ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-500-series_082026, Table 1 p.7 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 500 / 25 / 500 / 500 / 6600 / 2500 / 400 / 500 / 100 / 60 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-510 (PA-500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-500-series (`strata_ds_pa-500-series_082026`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 1.8 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Threat Prevention appmix (tp, Gbps) | 1.2 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| IPsec VPN (vpn, Gbps) | 0.8 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Sessions max (sess) | 98000 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Nouvelles sessions/s (cps) | 15000 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Systemes virtuels base/max (vsys) | *non publie* | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Cuivre RJ45 1G (rj45) | 8 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Libelle I/O (io) | 1G RJ45 (8) | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-500-series_082026, Table 3 p.9 (Power Over Ethernet) |
| Ports de gestion (mgmt) | 10/100/1000 out-of-band management port (1), USB port (2), RJ45 console port (1), Micro USB console port (1) | strata_ds_pa-500-series_082026, Table 3 p.8 (Management I/O) |
| Format (f) | Desktop (rack 1U en option) | strata_ds_pa-500-series_082026, Table 3 p.10 (Dimensions de bureau), Table 4 p.11 (kits PAN-1RU-4POST-RACK) |
| Stockage (disk) | 128 GB | strata_ds_pa-500-series_082026, Table 3 p.8 (Storage Capacity) |
| Alimentation (psu) | Adaptateur AC externe (12 VDC), un fourni ; second adaptateur redondant en option sur les plateformes à double entrée | strata_ds_pa-500-series_082026, Table 3 p.9 (Maximum Current Consumption) et Table 4 p.11 (note : second adaptateur redondant en option) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-500-series_082026, Table 3 p.10 (Passive cooling / Active cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| Ports HA dedies (haPorts) | Aucun port HA dédié : ports de données configurés en HA1/HA2 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support (aucun port HA ; PA-501 absent de la matrice) |
| 5G Security (m5g) | *non publie* | strata_ds_pa-500-series_082026, aucune section Mobile Network Infrastructure |
| GlobalProtect | oui | strata_ds_pa-500-series_082026, Table 2 p.8 |
| Reference (sku) | PAN-PA-510 | catalogue officiel Palo Alto (liste de references, colonne SKU) ; PA-520-5G absent |
| PAN-OS minimal (panosMin) | 12.1.3 | https://docs.paloaltonetworks.com/ngfw/release-notes/12-1/features-introduced-in-pan-os/hardware-features ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-500-series_082026, Table 1 p.7 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 500 / 50 / 750 / 1000 / 10000 / 5000 / 400 / 1000 / 100 / 60 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-520 (PA-500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-500-series (`strata_ds_pa-500-series_082026`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 2.8 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Threat Prevention appmix (tp, Gbps) | 1.8 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| IPsec VPN (vpn, Gbps) | 1.5 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Sessions max (sess) | 148000 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Nouvelles sessions/s (cps) | 25000 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Systemes virtuels base/max (vsys) | *non publie* | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Cuivre RJ45 1G (rj45) | 8 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Libelle I/O (io) | 1G RJ45 (8) | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-500-series_082026, Table 3 p.9 (Power Over Ethernet) |
| Ports de gestion (mgmt) | 10/100/1000 out-of-band management port (1), USB port (1), RJ45 console port (1), USB-C console port (1) | strata_ds_pa-500-series_082026, Table 3 p.8 (Management I/O) |
| Format (f) | Desktop (rack 1U en option) | strata_ds_pa-500-series_082026, Table 3 p.10 (Dimensions de bureau), Table 4 p.11 (kits PAN-1RU-4POST-RACK) |
| Stockage (disk) | 120 GB | strata_ds_pa-500-series_082026, Table 3 p.8 (Storage Capacity) |
| Alimentation (psu) | Adaptateur AC externe (12 VDC), un fourni ; second adaptateur redondant en option sur les plateformes à double entrée | strata_ds_pa-500-series_082026, Table 3 p.9 (Maximum Current Consumption) et Table 4 p.11 (note : second adaptateur redondant en option) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-500-series_082026, Table 3 p.10 (Passive cooling / Active cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| Ports HA dedies (haPorts) | Aucun port HA dédié : ports de données configurés en HA1/HA2 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support (aucun port HA ; PA-501 absent de la matrice) |
| 5G Security (m5g) | *non publie* | strata_ds_pa-500-series_082026, aucune section Mobile Network Infrastructure |
| GlobalProtect | oui | strata_ds_pa-500-series_082026, Table 2 p.8 |
| Reference (sku) | PAN-PA-520 | catalogue officiel Palo Alto (liste de references, colonne SKU) ; PA-520-5G absent |
| PAN-OS minimal (panosMin) | 12.1.2 | https://docs.paloaltonetworks.com/ngfw/release-notes/12-1/features-introduced-in-pan-os/hardware-features |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-500-series_082026, Table 1 p.7 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 500 / 100 / 1000 / 1400 / 15000 / 5000 / 400 / 1000 / 100 / 75 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-520-5G (PA-500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-500-series (`strata_ds_pa-500-series_082026`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 2.6 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Threat Prevention appmix (tp, Gbps) | 1.6 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| IPsec VPN (vpn, Gbps) | 1.4 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Sessions max (sess) | 148000 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Nouvelles sessions/s (cps) | 25000 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Systemes virtuels base/max (vsys) | 1 / 2 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Cuivre RJ45 1G (rj45) | 8 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP 1G (sfp1) | 2 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Libelle I/O (io) | Embedded 5G cellular module, 1G RJ45 (8), 1G SFP (2) | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-500-series_082026, Table 3 p.9 (Power Over Ethernet) |
| Ports de gestion (mgmt) | 10/100/1000 out-of-band management port (1), USB port (1), RJ45 console port (1), USB-C console port (1) | strata_ds_pa-500-series_082026, Table 3 p.8 (Management I/O) |
| Format (f) | Desktop (rack 1U en option) | strata_ds_pa-500-series_082026, Table 3 p.10 (Dimensions de bureau), Table 4 p.11 (kits PAN-1RU-4POST-RACK) |
| Stockage (disk) | 120 GB | strata_ds_pa-500-series_082026, Table 3 p.8 (Storage Capacity) |
| Alimentation (psu) | Adaptateur AC externe (12 VDC), un fourni ; second adaptateur redondant en option sur les plateformes à double entrée | strata_ds_pa-500-series_082026, Table 3 p.9 (Maximum Current Consumption) et Table 4 p.11 (note : second adaptateur redondant en option) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-500-series_082026, Table 3 p.10 (Passive cooling / Active cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| Ports HA dedies (haPorts) | Aucun port HA dédié : ports de données configurés en HA1/HA2 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support (aucun port HA ; PA-501 absent de la matrice) |
| 5G Security (m5g) | *non publie* | strata_ds_pa-500-series_082026, aucune section Mobile Network Infrastructure |
| GlobalProtect | oui | strata_ds_pa-500-series_082026, Table 2 p.8 |
| Reference (sku) | *non publie* | catalogue officiel Palo Alto (liste de references, colonne SKU) ; PA-520-5G absent |
| PAN-OS minimal (panosMin) | 12.1.10 | https://docs.paloaltonetworks.com/ngfw/release-notes/12-1/features-introduced-in-pan-os/hardware-features ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-500-series_082026, Table 1 p.7 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-540 (PA-500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-500-series (`strata_ds_pa-500-series_082026`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 3.8 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Threat Prevention appmix (tp, Gbps) | 2.2 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| IPsec VPN (vpn, Gbps) | 2 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Sessions max (sess) | 248000 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Nouvelles sessions/s (cps) | 50000 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Systemes virtuels base/max (vsys) | 1 / 2 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Cuivre RJ45 1G (rj45) | 8 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP 1G (sfp1) | 2 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Libelle I/O (io) | 1G RJ45 (8), 1G SFP (2) | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-500-series_082026, Table 3 p.9 (Power Over Ethernet) |
| Ports de gestion (mgmt) | 10/100/1000 out-of-band management port (1), USB port (1), RJ45 console port (1), USB-C console port (1) | strata_ds_pa-500-series_082026, Table 3 p.8 (Management I/O) |
| Format (f) | Desktop (rack 1U en option) | strata_ds_pa-500-series_082026, Table 3 p.10 (Dimensions de bureau), Table 4 p.11 (kits PAN-1RU-4POST-RACK) |
| Stockage (disk) | 120 GB | strata_ds_pa-500-series_082026, Table 3 p.8 (Storage Capacity) |
| Alimentation (psu) | Adaptateur AC externe (12 VDC), un fourni ; second adaptateur redondant en option sur les plateformes à double entrée | strata_ds_pa-500-series_082026, Table 3 p.9 (Maximum Current Consumption) et Table 4 p.11 (note : second adaptateur redondant en option) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-500-series_082026, Table 3 p.10 (Passive cooling / Active cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| Ports HA dedies (haPorts) | Aucun port HA dédié : ports de données configurés en HA1/HA2 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support (aucun port HA ; PA-501 absent de la matrice) |
| 5G Security (m5g) | *non publie* | strata_ds_pa-500-series_082026, aucune section Mobile Network Infrastructure |
| GlobalProtect | oui | strata_ds_pa-500-series_082026, Table 2 p.8 |
| Reference (sku) | PAN-PA-540 | catalogue officiel Palo Alto (liste de references, colonne SKU) ; PA-520-5G absent |
| PAN-OS minimal (panosMin) | 12.1.2 | https://docs.paloaltonetworks.com/ngfw/release-notes/12-1/features-introduced-in-pan-os/hardware-features |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-500-series_082026, Table 1 p.7 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 1000 / 200 / 2000 / 2800 / 30000 / 10000 / 3000 / 2800 / 250 / 100 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-545-POE (PA-500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-500-series (`strata_ds_pa-500-series_082026`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 5 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Threat Prevention appmix (tp, Gbps) | 3 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| IPsec VPN (vpn, Gbps) | 3 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Sessions max (sess) | 298000 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Nouvelles sessions/s (cps) | 55000 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Systemes virtuels base/max (vsys) | 1 / 2 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Cuivre RJ45 1G (rj45) | 8 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 4 (1/2.5G) | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP 1G (sfp1) | 4 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Libelle I/O (io) | 1G RJ45 (6), 1G RJ45 bypass (2), 1G/2.5G (4)/PoE, 1G SFP (4) | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | oui / 4 / 181 W | strata_ds_pa-500-series_082026, Table 3 p.9 (Power Over Ethernet) |
| Ports de gestion (mgmt) | 10/100/1000 out-of-band management port (1), USB port (1), RJ45 console port (1), USB-C console port (1) | strata_ds_pa-500-series_082026, Table 3 p.8 (Management I/O) |
| Format (f) | Desktop (rack 1U en option) | strata_ds_pa-500-series_082026, Table 3 p.10 (Dimensions de bureau), Table 4 p.11 (kits PAN-1RU-4POST-RACK) |
| Stockage (disk) | 120 GB | strata_ds_pa-500-series_082026, Table 3 p.8 (Storage Capacity) |
| Alimentation (psu) | Adaptateur AC externe (54 VDC), un fourni ; second adaptateur redondant en option sur les plateformes à double entrée | strata_ds_pa-500-series_082026, Table 3 p.9 (Maximum Current Consumption) et Table 4 p.11 (note : second adaptateur redondant en option) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-500-series_082026, Table 3 p.10 (Passive cooling / Active cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| Ports HA dedies (haPorts) | Aucun port HA dédié : ports de données configurés en HA1/HA2 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support (aucun port HA ; PA-501 absent de la matrice) |
| 5G Security (m5g) | *non publie* | strata_ds_pa-500-series_082026, aucune section Mobile Network Infrastructure |
| GlobalProtect | oui | strata_ds_pa-500-series_082026, Table 2 p.8 |
| Reference (sku) | PAN-PA-545-POE | catalogue officiel Palo Alto (liste de references, colonne SKU) ; PA-520-5G absent |
| PAN-OS minimal (panosMin) | 12.1.2 | https://docs.paloaltonetworks.com/ngfw/release-notes/12-1/features-introduced-in-pan-os/hardware-features |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-500-series_082026, Table 1 p.7 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 1000 / 200 / 2000 / 2800 / 30000 / 10000 / 3000 / 2800 / 250 / 100 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-550 (PA-500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-500-series (`strata_ds_pa-500-series_082026`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 6.5 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Threat Prevention appmix (tp, Gbps) | 4.5 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| IPsec VPN (vpn, Gbps) | 4 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Sessions max (sess) | 398000 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Nouvelles sessions/s (cps) | 70000 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Systemes virtuels base/max (vsys) | 1 / 5 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Cuivre RJ45 1G (rj45) | 12 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP 1G (sfp1) | 2 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP+ 10G (sfp10) | 2 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Libelle I/O (io) | 1G RJ45 (10), 1G RJ45 bypass (2), 1G SFP (2), 1G/10G SFP/SFP+ (2) | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-500-series_082026, Table 3 p.9 (Power Over Ethernet) |
| Ports de gestion (mgmt) | 10/100/1000 out-of-band management port (1), USB port (1), RJ45 console port (1), USB-C console port (1) | strata_ds_pa-500-series_082026, Table 3 p.8 (Management I/O) |
| Format (f) | Desktop (rack 1U en option) | strata_ds_pa-500-series_082026, Table 3 p.10 (Dimensions de bureau), Table 4 p.11 (kits PAN-1RU-4POST-RACK) |
| Stockage (disk) | 120 GB | strata_ds_pa-500-series_082026, Table 3 p.8 (Storage Capacity) |
| Alimentation (psu) | Adaptateur AC externe (12 VDC), un fourni ; second adaptateur redondant en option sur les plateformes à double entrée | strata_ds_pa-500-series_082026, Table 3 p.9 (Maximum Current Consumption) et Table 4 p.11 (note : second adaptateur redondant en option) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-500-series_082026, Table 3 p.10 (Passive cooling / Active cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| Ports HA dedies (haPorts) | Aucun port HA dédié : ports de données configurés en HA1/HA2 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support (aucun port HA ; PA-501 absent de la matrice) |
| 5G Security (m5g) | *non publie* | strata_ds_pa-500-series_082026, aucune section Mobile Network Infrastructure |
| GlobalProtect | oui | strata_ds_pa-500-series_082026, Table 2 p.8 |
| Reference (sku) | PAN-PA-550 | catalogue officiel Palo Alto (liste de references, colonne SKU) ; PA-520-5G absent |
| PAN-OS minimal (panosMin) | 12.1.2 | https://docs.paloaltonetworks.com/ngfw/release-notes/12-1/features-introduced-in-pan-os/hardware-features |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-500-series_082026, Table 1 p.7 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 1500 / 400 / 2500 / 2800 / 45000 / 15000 / 3000 / 2800 / 250 / 150 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-555-POE (PA-500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-500-series (`strata_ds_pa-500-series_082026`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 7.5 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Threat Prevention appmix (tp, Gbps) | 5 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| IPsec VPN (vpn, Gbps) | 4.5 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Sessions max (sess) | 448000 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Nouvelles sessions/s (cps) | 75000 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Systemes virtuels base/max (vsys) | 1 / 5 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Cuivre RJ45 1G (rj45) | 8 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 4 (1/2.5G) | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP 1G (sfp1) | 2 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP+ 10G (sfp10) | 2 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Libelle I/O (io) | 1G RJ45 (2), 1G RJ45 bypass (2), 1G RJ45 (4)/PoE, 1G/2.5G (4)/PoE, 1G SFP (2), 1G/10G SFP/SFP+ (2) | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | oui / 8 / 330 W | strata_ds_pa-500-series_082026, Table 3 p.9 (Power Over Ethernet) |
| Ports de gestion (mgmt) | 10/100/1000 out-of-band management port (1), USB port (1), RJ45 console port (1), USB-C console port (1) | strata_ds_pa-500-series_082026, Table 3 p.8 (Management I/O) |
| Format (f) | Desktop (rack 1U en option) | strata_ds_pa-500-series_082026, Table 3 p.10 (Dimensions de bureau), Table 4 p.11 (kits PAN-1RU-4POST-RACK) |
| Stockage (disk) | 120 GB | strata_ds_pa-500-series_082026, Table 3 p.8 (Storage Capacity) |
| Alimentation (psu) | Adaptateur AC externe (54 VDC), un fourni ; second adaptateur redondant en option sur les plateformes à double entrée | strata_ds_pa-500-series_082026, Table 3 p.9 (Maximum Current Consumption) et Table 4 p.11 (note : second adaptateur redondant en option) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-500-series_082026, Table 3 p.10 (Passive cooling / Active cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| Ports HA dedies (haPorts) | Aucun port HA dédié : ports de données configurés en HA1/HA2 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support (aucun port HA ; PA-501 absent de la matrice) |
| 5G Security (m5g) | *non publie* | strata_ds_pa-500-series_082026, aucune section Mobile Network Infrastructure |
| GlobalProtect | oui | strata_ds_pa-500-series_082026, Table 2 p.8 |
| Reference (sku) | PAN-PA-555-POE | catalogue officiel Palo Alto (liste de references, colonne SKU) ; PA-520-5G absent |
| PAN-OS minimal (panosMin) | 12.1.2 | https://docs.paloaltonetworks.com/ngfw/release-notes/12-1/features-introduced-in-pan-os/hardware-features |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-500-series_082026, Table 1 p.7 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 1500 / 400 / 2500 / 2800 / 45000 / 15000 / 3000 / 2800 / 250 / 150 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-560 (PA-500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-500-series (`strata_ds_pa-500-series_082026`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 8.5 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Threat Prevention appmix (tp, Gbps) | 6 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| IPsec VPN (vpn, Gbps) | 5.5 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Sessions max (sess) | 598000 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Nouvelles sessions/s (cps) | 100000 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Systemes virtuels base/max (vsys) | 1 / 5 | strata_ds_pa-500-series_082026, Table 1 p.7 |
| Cuivre RJ45 1G (rj45) | 16 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP 1G (sfp1) | 4 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP+ 10G (sfp10) | 4 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| Libelle I/O (io) | 1G RJ45 (14), 1G RJ45 bypass (2), 1G SFP (4), 1G/10G SFP/SFP+ (4) | strata_ds_pa-500-series_082026, Table 3 p.8 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-500-series_082026, Table 3 p.9 (Power Over Ethernet) |
| Ports de gestion (mgmt) | 10/100/1000 out-of-band management port (1), USB port (1), RJ45 console port (1), USB-C console port (1) | strata_ds_pa-500-series_082026, Table 3 p.8 (Management I/O) |
| Format (f) | Desktop (rack 1U en option) | strata_ds_pa-500-series_082026, Table 3 p.10 (Dimensions de bureau), Table 4 p.11 (kits PAN-1RU-4POST-RACK) |
| Stockage (disk) | 240 GB | strata_ds_pa-500-series_082026, Table 3 p.8 (Storage Capacity) |
| Alimentation (psu) | Adaptateur AC externe (12 VDC), un fourni ; second adaptateur redondant en option sur les plateformes à double entrée | strata_ds_pa-500-series_082026, Table 3 p.9 (Maximum Current Consumption) et Table 4 p.11 (note : second adaptateur redondant en option) |
| Refroidissement (cool) | Active (ventilée) | strata_ds_pa-500-series_082026, Table 3 p.10 (Passive cooling / Active cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-500-series_082026, Highlights p.2 ; https://docs.paloaltonetworks.com/hardware/pa-500-hardware-reference/pa-500-series-firewall-overview |
| Ports HA dedies (haPorts) | Aucun port HA dédié : ports de données configurés en HA1/HA2 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support (aucun port HA ; PA-501 absent de la matrice) |
| 5G Security (m5g) | *non publie* | strata_ds_pa-500-series_082026, aucune section Mobile Network Infrastructure |
| GlobalProtect | oui | strata_ds_pa-500-series_082026, Table 2 p.8 |
| Reference (sku) | PAN-PA-560 | catalogue officiel Palo Alto (liste de references, colonne SKU) ; PA-520-5G absent |
| PAN-OS minimal (panosMin) | 12.1.2 | https://docs.paloaltonetworks.com/ngfw/release-notes/12-1/features-introduced-in-pan-os/hardware-features |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-500-series_082026, Table 1 p.7 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 1500 / 500 / 2500 / 3200 / 60000 / 15000 / 3000 / 2800 / 250 / 150 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-820 (PA-800)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-800-series-datasheet (`strata_ds_pa-800-series_071423`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 1.5 | strata_ds_pa-800-series_071423, Table 1 p.4 (valeurs appmix de la paire HTTP/appmix) |
| Threat Prevention appmix (tp, Gbps) | 0.84 | strata_ds_pa-800-series_071423, Table 1 p.4 (valeurs appmix de la paire HTTP/appmix) |
| IPsec VPN (vpn, Gbps) | 1.4 | strata_ds_pa-800-series_071423, Table 1 p.4 (valeurs appmix de la paire HTTP/appmix) |
| Sessions max (sess) | 128000 | strata_ds_pa-800-series_071423, Table 1 p.4 (valeurs appmix de la paire HTTP/appmix) |
| Nouvelles sessions/s (cps) | 8100 | strata_ds_pa-800-series_071423, Table 1 p.4 (valeurs appmix de la paire HTTP/appmix) |
| Systemes virtuels base/max (vsys) | *non publie* | strata_ds_pa-800-series_071423, Table 1 p.4 (valeurs appmix de la paire HTTP/appmix) |
| Cuivre RJ45 1G (rj45) | 4 | strata_ds_pa-800-series_071423, Table 3 p.5 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-800-series_071423, Table 3 p.5 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-800-series_071423, Table 3 p.5 (I/O) |
| SFP 1G (sfp1) | 8 | strata_ds_pa-800-series_071423, Table 3 p.5 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-800-series_071423, Table 3 p.5 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-800-series_071423, Table 3 p.5 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-800-series_071423, Table 3 p.5 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-800-series_071423, Table 3 p.5 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-800-series_071423, Table 3 p.5 (I/O) |
| Libelle I/O (io) | 10/100/1000 (4), Gigabit SFP (8) | strata_ds_pa-800-series_071423, Table 3 p.5 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-800-series_071423, sans objet |
| Ports de gestion (mgmt) | 10/100/1000 out-of-band management port (1), 10/100/1000 high availability (2), RJ-45 console port (1), USB port (1), Micro USB console port (1) | strata_ds_pa-800-series_071423, Table 3 p.5 (Management I/O) |
| Format (f) | 1U Rack | strata_ds_pa-800-series_071423, Table 3 p.6 (Rack Mount) |
| Stockage (disk) | 240 GB SSD | strata_ds_pa-800-series_071423, Table 3 p.6 (Storage Capacity) |
| Alimentation (psu) | AC 200 W fixe (1), non redondante | strata_ds_pa-800-series_071423, Table 3 p.6 (Power Supply) |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-800-series_071423, Table 3 p.6 (Airflow) |
| HA actif/passif (haAP) | oui | strata_ds_pa-800-series_071423, Table 2 p.5 (High Availability) |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-800-series_071423, Table 2 p.5 (High Availability) |
| Clustering (haCl) | *non publie* | strata_ds_pa-800-series_071423, Table 2 p.5 (High Availability) |
| Ports HA dedies (haPorts) | HA1 et HA2 dédiés, 10/100/1000 (2) | Table 3 p.5 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | *non publie* | strata_ds_pa-800-series_071423, aucune section Mobile Network Infrastructure |
| GlobalProtect | oui | strata_ds_pa-800-series_071423, Table 2 p.5 |
| Reference (sku) | PAN-PA-820 | catalogue officiel Palo Alto (liste de references, colonne SKU) ; https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| PAN-OS minimal (panosMin) | *non publie* | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls (colonnes a partir de 10.1 : premiere version non publiee) |
| Dernier PAN-OS (panosMax) | 11.1 | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| End of Sale / End of Life (eosD / eolD, eos) | 2024-08-31 / 2029-08-31, eos oui | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| PAN-OS des mesures (dsOs) | 11.0 | strata_ds_pa-800-series_071423, Table 1 p.4 (valeurs appmix de la paire HTTP/appmix) (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 1000 / 50 / 2000 / - / - / - / - / - / - / - | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-850 (PA-800)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-800-series-datasheet (`strata_ds_pa-800-series_071423`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 1.9 | strata_ds_pa-800-series_071423, Table 1 p.4 (valeurs appmix de la paire HTTP/appmix) |
| Threat Prevention appmix (tp, Gbps) | 1 | strata_ds_pa-800-series_071423, Table 1 p.4 (valeurs appmix de la paire HTTP/appmix) |
| IPsec VPN (vpn, Gbps) | 1.8 | strata_ds_pa-800-series_071423, Table 1 p.4 (valeurs appmix de la paire HTTP/appmix) |
| Sessions max (sess) | 192000 | strata_ds_pa-800-series_071423, Table 1 p.4 (valeurs appmix de la paire HTTP/appmix) |
| Nouvelles sessions/s (cps) | 13100 | strata_ds_pa-800-series_071423, Table 1 p.4 (valeurs appmix de la paire HTTP/appmix) |
| Systemes virtuels base/max (vsys) | *non publie* | strata_ds_pa-800-series_071423, Table 1 p.4 (valeurs appmix de la paire HTTP/appmix) |
| Cuivre RJ45 1G (rj45) | 4 | strata_ds_pa-800-series_071423, Table 3 p.5 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-800-series_071423, Table 3 p.5 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-800-series_071423, Table 3 p.5 (I/O) |
| SFP 1G (sfp1) | 4 | strata_ds_pa-800-series_071423, Table 3 p.5 (I/O) |
| SFP+ 10G (sfp10) | 4 | strata_ds_pa-800-series_071423, Table 3 p.5 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-800-series_071423, Table 3 p.5 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-800-series_071423, Table 3 p.5 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-800-series_071423, Table 3 p.5 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-800-series_071423, Table 3 p.5 (I/O) |
| Libelle I/O (io) | 10/100/1000 (4), Gigabit SFP (8) or 10/100/1000 (4), Gigabit SFP (4), 10 Gigabit SFP+ (4) | strata_ds_pa-800-series_071423, Table 3 p.5 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-800-series_071423, sans objet |
| Ports de gestion (mgmt) | 10/100/1000 out-of-band management port (1), 10/100/1000 high availability (2), RJ-45 console port (1), USB port (1), Micro USB console port (1) | strata_ds_pa-800-series_071423, Table 3 p.5 (Management I/O) |
| Format (f) | 1U Rack | strata_ds_pa-800-series_071423, Table 3 p.6 (Rack Mount) |
| Stockage (disk) | 240 GB SSD | strata_ds_pa-800-series_071423, Table 3 p.6 (Storage Capacity) |
| Alimentation (psu) | AC 450 W (2), dont une redondante | strata_ds_pa-800-series_071423, Table 3 p.6 (Power Supply) |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-800-series_071423, Table 3 p.6 (Airflow) |
| HA actif/passif (haAP) | oui | strata_ds_pa-800-series_071423, Table 2 p.5 (High Availability) |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-800-series_071423, Table 2 p.5 (High Availability) |
| Clustering (haCl) | *non publie* | strata_ds_pa-800-series_071423, Table 2 p.5 (High Availability) |
| Ports HA dedies (haPorts) | HA1 et HA2 dédiés, 10/100/1000 (2) | Table 3 p.5 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | *non publie* | strata_ds_pa-800-series_071423, aucune section Mobile Network Infrastructure |
| GlobalProtect | oui | strata_ds_pa-800-series_071423, Table 2 p.5 |
| Reference (sku) | PAN-PA-850 | catalogue officiel Palo Alto (liste de references, colonne SKU) ; https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| PAN-OS minimal (panosMin) | *non publie* | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls (colonnes a partir de 10.1 : premiere version non publiee) |
| Dernier PAN-OS (panosMax) | 11.1 | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| End of Sale / End of Life (eosD / eolD, eos) | 2024-08-31 / 2029-08-31, eos oui | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| PAN-OS des mesures (dsOs) | 11.0 | strata_ds_pa-800-series_071423, Table 1 p.4 (valeurs appmix de la paire HTTP/appmix) (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 1000 / 50 / 2000 / - / - / - / - / - / - / - | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-1410 (PA-1400)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-1400-series (`strata_ds_pa-1400-series_012726`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 8.5 | strata_ds_pa-1400-series_012726, Table 1 p.5 |
| Threat Prevention appmix (tp, Gbps) | 4.5 | strata_ds_pa-1400-series_012726, Table 1 p.5 |
| IPsec VPN (vpn, Gbps) | 4.1 | strata_ds_pa-1400-series_012726, Table 1 p.5 |
| Sessions max (sess) | 945000 | strata_ds_pa-1400-series_012726, Table 1 p.5 |
| Nouvelles sessions/s (cps) | 100000 | strata_ds_pa-1400-series_012726, Table 1 p.5 |
| Systemes virtuels base/max (vsys) | 1 / 6 | strata_ds_pa-1400-series_012726, Table 1 p.5 |
| Cuivre RJ45 1G (rj45) | 8 | strata_ds_pa-1400-series_012726, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 4 (1/2.5/5G) | strata_ds_pa-1400-series_012726, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-1400-series_012726, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 6 | strata_ds_pa-1400-series_012726, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 4 | strata_ds_pa-1400-series_012726, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-1400-series_012726, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-1400-series_012726, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-1400-series_012726, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-1400-series_012726, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 10/100/1000 (8), 1G/2.5G/5G (4)/PoE, 1G SFP (6), 1G/10G SFP/SFP+ (4) | strata_ds_pa-1400-series_012726, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | oui / 4 / 151 W | strata_ds_pa-1400-series_012726, Table 3 p.7 (Power over Ethernet) et I/O |
| Ports de gestion (mgmt) | 10/100/1000 out-of-band management port (1), HSCI 10 gigabit high availability (1), RJ-45 console port (1), USB port (1), Micro USB console port (1) | strata_ds_pa-1400-series_012726, Table 3 p.7 (Management I/O) |
| Format (f) | 1U Rack | strata_ds_pa-1400-series_012726, Table 3 p.7 (Rack Mount Dimensions) |
| Stockage (disk) | 120 GB SSD | strata_ds_pa-1400-series_012726, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | AC 450 W (1), seconde AC 450 W en option | strata_ds_pa-1400-series_012726, Table 3 p.7 (Power Supply) |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-1400-series_012726, Table 3 p.7 (Airflow) |
| HA actif/passif (haAP) | oui | strata_ds_pa-1400-series_012726, Table 2 p.6 (High Availability) |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-1400-series_012726, Table 2 p.6 (High Availability) |
| Clustering (haCl) | *non publie* | strata_ds_pa-1400-series_012726, Table 2 p.6 (High Availability) |
| Ports HA dedies (haPorts) | HA1-A et HA1-B 10/100/1000 (2), HSCI 10G SFP+ (1) pour HA2/HA3 | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support |
| 5G Security (m5g) | *non publie* | strata_ds_pa-1400-series_012726, aucune section Mobile Network Infrastructure |
| GlobalProtect | oui | strata_ds_pa-1400-series_012726, Table 2 p.6 |
| Reference (sku) | PAN-PA-1410 | catalogue officiel Palo Alto (liste de references, colonne SKU) |
| PAN-OS minimal (panosMin) | 11.0 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-1400-series_012726, Table 1 p.5 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 1500 / 1000 / 10000 / 3500 / 51200 / 20000 / 3000 / 2800 / 400 / 150 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-1420 (PA-1400)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-1400-series (`strata_ds_pa-1400-series_012726`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 9.5 | strata_ds_pa-1400-series_012726, Table 1 p.5 |
| Threat Prevention appmix (tp, Gbps) | 6.2 | strata_ds_pa-1400-series_012726, Table 1 p.5 |
| IPsec VPN (vpn, Gbps) | 5.6 | strata_ds_pa-1400-series_012726, Table 1 p.5 |
| Sessions max (sess) | 1400000 | strata_ds_pa-1400-series_012726, Table 1 p.5 |
| Nouvelles sessions/s (cps) | 140000 | strata_ds_pa-1400-series_012726, Table 1 p.5 |
| Systemes virtuels base/max (vsys) | 1 / 6 | strata_ds_pa-1400-series_012726, Table 1 p.5 |
| Cuivre RJ45 1G (rj45) | 4 | strata_ds_pa-1400-series_012726, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 8 (1/2.5/5G) | strata_ds_pa-1400-series_012726, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-1400-series_012726, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 2 | strata_ds_pa-1400-series_012726, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 8 | strata_ds_pa-1400-series_012726, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-1400-series_012726, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-1400-series_012726, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-1400-series_012726, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-1400-series_012726, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 10/100/1000 (4), 1G/2.5G/5G (4), 1G/2.5G/5G (4)/PoE, 1G SFP (2), 1G/10G SFP/SFP+ (8) | strata_ds_pa-1400-series_012726, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | oui / 4 / 151 W | strata_ds_pa-1400-series_012726, Table 3 p.7 (Power over Ethernet) et I/O |
| Ports de gestion (mgmt) | 10/100/1000 out-of-band management port (1), HSCI 10 gigabit high availability (1), RJ-45 console port (1), USB port (1), Micro USB console port (1) | strata_ds_pa-1400-series_012726, Table 3 p.7 (Management I/O) |
| Format (f) | 1U Rack | strata_ds_pa-1400-series_012726, Table 3 p.7 (Rack Mount Dimensions) |
| Stockage (disk) | 240 GB SSD | strata_ds_pa-1400-series_012726, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | AC 450 W (1), seconde AC 450 W en option | strata_ds_pa-1400-series_012726, Table 3 p.7 (Power Supply) |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-1400-series_012726, Table 3 p.7 (Airflow) |
| HA actif/passif (haAP) | oui | strata_ds_pa-1400-series_012726, Table 2 p.6 (High Availability) |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-1400-series_012726, Table 2 p.6 (High Availability) |
| Clustering (haCl) | *non publie* | strata_ds_pa-1400-series_012726, Table 2 p.6 (High Availability) |
| Ports HA dedies (haPorts) | HA1-A et HA1-B 10/100/1000 (2), HSCI 10G SFP+ (1) pour HA2/HA3 | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support |
| 5G Security (m5g) | *non publie* | strata_ds_pa-1400-series_012726, aucune section Mobile Network Infrastructure |
| GlobalProtect | oui | strata_ds_pa-1400-series_012726, Table 2 p.6 |
| Reference (sku) | PAN-PA-1420 | catalogue officiel Palo Alto (liste de references, colonne SKU) |
| PAN-OS minimal (panosMin) | 11.0 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-1400-series_012726, Table 1 p.5 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 1500 / 1000 / 10000 / 4000 / 140000 / 20000 / 3000 / 2800 / 400 / 150 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-1510-POE (PA-1500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-1500-series (`strata_ds_pa-1500-series-quantum-optimized-ngfws_091126`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 15 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 9 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 7 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 1 p.6 |
| Sessions max (sess) | 1095000 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 140000 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 1 / 6 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 12 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 8 (1/2.5/5G) | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| SFP 1G (sfp1) | 4 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| SFP+ 10G (sfp10) | 8 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| Libelle I/O (io) | 10/100/1000 Cu (12), 1G/2.5G/5G Cu (8), 1G SFP (4), 1G/10G SFP+ (8) | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | oui / 16 / 485 W | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Highlights p.3 (16 ports PoE++ 90 W) et Table 3 p.8 (Power over Ethernet) |
| Ports de gestion (mgmt) | Out-of-band management: 10/100/1000 Cu (1), Console: RJ-45 (1), Console: USB-C (1), Bootstrap: USB 3.2 Gen1 Type A (1), HA: 10/100/1000 Cu (2), HSCI: 10G SFP+ (1) | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (Management I/O) |
| Format (f) | 1U Rack | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.9 (Rack Mount Dimensions) |
| Stockage (disk) | 480 GB | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (Storage Capacity) |
| Alimentation (psu) | AC 1200 W (1), seconde en option (AC ou DC 1200 W, même type) | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (Power Supplies) |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.9 (Airflow) |
| HA actif/passif (haAP) | oui | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 2 p.7 (High Availability ; failure detection : future release) |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 2 p.7 (High Availability ; failure detection : future release) |
| Clustering (haCl) | *non publie* | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 2 p.7 (High Availability ; failure detection : future release) |
| Ports HA dedies (haPorts) | HA 10/100/1000 (2), HSCI 10G SFP+ (1) | Table 3 p.8 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | oui | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 2 p.7 (Mobile Network Infrastructure : 5G Security) |
| GlobalProtect | oui | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 2 p.7 |
| Reference (sku) | PAN-PA-1510-POE | Table 4 p.10 |
| PAN-OS minimal (panosMin) | 12.2.4 | https://docs.paloaltonetworks.com/hardware/pa-1500-hardware-reference/pa-1500-series-firewall-overview (First Supported PAN-OS Software Release) |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-1520-POE (PA-1500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-1500-series (`strata_ds_pa-1500-series-quantum-optimized-ngfws_091126`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 25 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 18 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 14 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 1 p.6 |
| Sessions max (sess) | 1495000 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 180000 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 1 / 11 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 8 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 12 (1/2.5/5G (8), 1/2.5/5/10G (4)) | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| SFP+ 10G (sfp10) | 8 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| SFP28 25G (sfp25) | 4 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| Libelle I/O (io) | 10/100/1000 Cu (8), 1G/2.5G/5G Cu (8), 1G/2.5G/5/10G Cu (4), 1/10G SFP+ (8), 10G/25G SFP28 (4) | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | oui / 16 / 545 W | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Highlights p.3 (16 ports PoE++ 90 W) et Table 3 p.8 (Power over Ethernet) |
| Ports de gestion (mgmt) | Out-of-band management: 10/100/1000 Cu (1), Console: RJ-45 (1), Console: USB-C (1), Bootstrap: USB 3.2 Gen1 Type A (1), HA: 10/100/1000 Cu (2), HSCI: 25G SFP28 (1) | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (Management I/O) |
| Format (f) | 1U Rack | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.9 (Rack Mount Dimensions) |
| Stockage (disk) | 480 GB | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (Storage Capacity) |
| Alimentation (psu) | AC 1200 W (1), seconde en option (AC ou DC 1200 W, même type) | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (Power Supplies) |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.9 (Airflow) |
| HA actif/passif (haAP) | oui | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 2 p.7 (High Availability ; failure detection : future release) |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 2 p.7 (High Availability ; failure detection : future release) |
| Clustering (haCl) | *non publie* | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 2 p.7 (High Availability ; failure detection : future release) |
| Ports HA dedies (haPorts) | HA 10/100/1000 (2), HSCI 25G SFP28 (1) | Table 3 p.8 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | oui | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 2 p.7 (Mobile Network Infrastructure : 5G Security) |
| GlobalProtect | oui | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 2 p.7 |
| Reference (sku) | PAN-PA-1520-POE | Table 4 p.10 |
| PAN-OS minimal (panosMin) | 12.2.4 | https://docs.paloaltonetworks.com/hardware/pa-1500-hardware-reference/pa-1500-series-firewall-overview (First Supported PAN-OS Software Release) |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-1530-POE (PA-1500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-1500-series (`strata_ds_pa-1500-series-quantum-optimized-ngfws_091126`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 35 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 27 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 18 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 1 p.6 |
| Sessions max (sess) | 1750000 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 220000 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 1 / 11 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 8 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 12 (1/2.5/5G (4), 1/2.5/5/10G (8)) | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| SFP+ 10G (sfp10) | 8 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| SFP28 25G (sfp25) | 4 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| Libelle I/O (io) | 10/100/1000 Cu (8), 1G/2.5G/5G Cu (4), 1G/2.5G/5/10G Cu (8), 1/10G SFP+ (8), 10G/25G SFP28 (4) | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | oui / 16 / 724 W | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Highlights p.3 (16 ports PoE++ 90 W) et Table 3 p.8 (Power over Ethernet) |
| Ports de gestion (mgmt) | Out-of-band management: 10/100/1000 Cu (1), Console: RJ-45 (1), Console: USB-C (1), Bootstrap: USB 3.2 Gen1 Type A (1), HA: 10/100/1000 Cu (2), HSCI: 25G SFP28 (1) | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (Management I/O) |
| Format (f) | 1U Rack | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.9 (Rack Mount Dimensions) |
| Stockage (disk) | 960 GB | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (Storage Capacity) |
| Alimentation (psu) | AC 1200 W (2) ; DC 1200 W en option (même type) | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.8 (Power Supplies) |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 3 p.9 (Airflow) |
| HA actif/passif (haAP) | oui | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 2 p.7 (High Availability ; failure detection : future release) |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 2 p.7 (High Availability ; failure detection : future release) |
| Clustering (haCl) | *non publie* | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 2 p.7 (High Availability ; failure detection : future release) |
| Ports HA dedies (haPorts) | HA 10/100/1000 (2), HSCI 25G SFP28 (1) | Table 3 p.8 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | oui | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 2 p.7 (Mobile Network Infrastructure : 5G Security) |
| GlobalProtect | oui | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 2 p.7 |
| Reference (sku) | PAN-PA-1530-POE | Table 4 p.10 |
| PAN-OS minimal (panosMin) | 12.2.4 | https://docs.paloaltonetworks.com/hardware/pa-1500-hardware-reference/pa-1500-series-firewall-overview (First Supported PAN-OS Software Release) |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-1500-series-quantum-optimized-ngfws_091126, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-3410 (PA-3400)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-3400-series (`strata_ds_pa-3400-series_021126`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 14 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| Threat Prevention appmix (tp, Gbps) | 7.5 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| IPsec VPN (vpn, Gbps) | 6.6 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| Sessions max (sess) | 1400000 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| Nouvelles sessions/s (cps) | 145000 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| Systemes virtuels base/max (vsys) | 1 / 11 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 12 (1/2.5/5/10G) | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 10 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 4 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 1G/2.5G/5G/10G (12), 1G/10G SFP/SFP+ (10), 25G SFP28 (4) | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-3400-series_021126, sans objet |
| Ports de gestion (mgmt) | 100/1000 out-of-band management port (1), 100/1000 high availability (2), 10G SFP+ high availability (1), RJ-45 console port (1), Micro USB (1) | strata_ds_pa-3400-series_021126, Table 3 p.7 (Management I/O) |
| Format (f) | 1U Rack | strata_ds_pa-3400-series_021126, Table 3 p.7 (Rack Mount Dimensions) |
| Stockage (disk) | 480 GB SSD | strata_ds_pa-3400-series_021126, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | Redondante, 450 W AC | strata_ds_pa-3400-series_021126, Table 3 p.7 (Power Supply) |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-3400-series_021126, Table 3 p.7 (Airflow) |
| HA actif/passif (haAP) | oui | strata_ds_pa-3400-series_021126, Table 2 p.6 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-3400 : 6 membres) |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-3400-series_021126, Table 2 p.6 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-3400 : 6 membres) |
| Clustering (haCl) | HA clustering, 6 membres max | strata_ds_pa-3400-series_021126, Table 2 p.6 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-3400 : 6 membres) |
| Ports HA dedies (haPorts) | HA1-A et HA1-B 100/1000 (2), HSCI 10G SFP+ (1) | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | non | strata_ds_pa-3400-series_021126, Table 2 p.6 (Mobile Network Infrastructure, PA-3440 et PA-3430 seulement) |
| GlobalProtect | oui | strata_ds_pa-3400-series_021126, Table 2 p.6 |
| Reference (sku) | PAN-PA-3410 | catalogue officiel Palo Alto (liste de references, colonne SKU) |
| PAN-OS minimal (panosMin) | 10.2 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-3400-series_021126, Table 1 p.5 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 1800 / 1000 / 10000 / 5000 / 140000 / 30000 / 3000 / 3000 / 400 / 150 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-3420 (PA-3400)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-3400-series (`strata_ds_pa-3400-series_021126`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 19 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| Threat Prevention appmix (tp, Gbps) | 10 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| IPsec VPN (vpn, Gbps) | 9.9 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| Sessions max (sess) | 2200000 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| Nouvelles sessions/s (cps) | 220000 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| Systemes virtuels base/max (vsys) | 1 / 11 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 12 (1/2.5/5/10G) | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 10 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 4 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 1G/2.5G/5G/10G (12), 1G/10G SFP/SFP+ (10), 25G SFP28 (4) | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-3400-series_021126, sans objet |
| Ports de gestion (mgmt) | 100/1000 out-of-band management port (1), 100/1000 high availability (2), 10G SFP+ high availability (1), RJ-45 console port (1), Micro USB (1) | strata_ds_pa-3400-series_021126, Table 3 p.7 (Management I/O) |
| Format (f) | 1U Rack | strata_ds_pa-3400-series_021126, Table 3 p.7 (Rack Mount Dimensions) |
| Stockage (disk) | 480 GB SSD | strata_ds_pa-3400-series_021126, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | Redondante, 450 W AC | strata_ds_pa-3400-series_021126, Table 3 p.7 (Power Supply) |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-3400-series_021126, Table 3 p.7 (Airflow) |
| HA actif/passif (haAP) | oui | strata_ds_pa-3400-series_021126, Table 2 p.6 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-3400 : 6 membres) |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-3400-series_021126, Table 2 p.6 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-3400 : 6 membres) |
| Clustering (haCl) | HA clustering, 6 membres max | strata_ds_pa-3400-series_021126, Table 2 p.6 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-3400 : 6 membres) |
| Ports HA dedies (haPorts) | HA1-A et HA1-B 100/1000 (2), HSCI 10G SFP+ (1) | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | non | strata_ds_pa-3400-series_021126, Table 2 p.6 (Mobile Network Infrastructure, PA-3440 et PA-3430 seulement) |
| GlobalProtect | oui | strata_ds_pa-3400-series_021126, Table 2 p.6 |
| Reference (sku) | PAN-PA-3420 | catalogue officiel Palo Alto (liste de references, colonne SKU) |
| PAN-OS minimal (panosMin) | 10.2 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-3400-series_021126, Table 1 p.5 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 1800 / 1000 / 10000 / 5000 / 200000 / 30000 / 4500 / 3000 / 400 / 375 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-3430 (PA-3400)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-3400-series (`strata_ds_pa-3400-series_021126`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 29 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| Threat Prevention appmix (tp, Gbps) | 15 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| IPsec VPN (vpn, Gbps) | 12 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| Sessions max (sess) | 2500000 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| Nouvelles sessions/s (cps) | 240000 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| Systemes virtuels base/max (vsys) | 1 / 11 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 12 (1/2.5/5/10G) | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 10 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 4 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 2 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 1G/2.5G/5G/10G (12), 1G/10G SFP/SFP+ (10), 25G SFP28 (4), 40G/100G QSFP/QSFP28 (2) | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-3400-series_021126, sans objet |
| Ports de gestion (mgmt) | 100/1000 out-of-band management port (1), 100/1000 high availability (2), 10G SFP+ high availability (1), RJ-45 console port (1), Micro USB (1) | strata_ds_pa-3400-series_021126, Table 3 p.7 (Management I/O) |
| Format (f) | 1U Rack | strata_ds_pa-3400-series_021126, Table 3 p.7 (Rack Mount Dimensions) |
| Stockage (disk) | 480 GB SSD | strata_ds_pa-3400-series_021126, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | Redondante, 450 W AC | strata_ds_pa-3400-series_021126, Table 3 p.7 (Power Supply) |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-3400-series_021126, Table 3 p.7 (Airflow) |
| HA actif/passif (haAP) | oui | strata_ds_pa-3400-series_021126, Table 2 p.6 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-3400 : 6 membres) |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-3400-series_021126, Table 2 p.6 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-3400 : 6 membres) |
| Clustering (haCl) | HA clustering, 6 membres max | strata_ds_pa-3400-series_021126, Table 2 p.6 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-3400 : 6 membres) |
| Ports HA dedies (haPorts) | HA1-A et HA1-B 100/1000 (2), HSCI 10G SFP+ (1) | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | oui | strata_ds_pa-3400-series_021126, Table 2 p.6 (Mobile Network Infrastructure, PA-3440 et PA-3430 seulement) |
| GlobalProtect | oui | strata_ds_pa-3400-series_021126, Table 2 p.6 |
| Reference (sku) | PAN-PA-3430 | catalogue officiel Palo Alto (liste de references, colonne SKU) |
| PAN-OS minimal (panosMin) | 10.2 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-3400-series_021126, Table 1 p.5 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 1800 / 1000 / 30000 / 8000 / 250000 / 30000 / 6000 / 4000 / 500 / - | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-3440 (PA-3400)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-3400-series (`strata_ds_pa-3400-series_021126`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 35 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| Threat Prevention appmix (tp, Gbps) | 20 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| IPsec VPN (vpn, Gbps) | 14.5 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| Sessions max (sess) | 3000000 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| Nouvelles sessions/s (cps) | 268000 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| Systemes virtuels base/max (vsys) | 1 / 11 | strata_ds_pa-3400-series_021126, Table 1 p.5 |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 12 (1/2.5/5/10G) | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 10 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 4 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 2 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 1G/2.5G/5G/10G (12), 1G/10G SFP/SFP+ (10), 25G SFP28 (4), 40G/100G QSFP/QSFP28 (2) | strata_ds_pa-3400-series_021126, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-3400-series_021126, sans objet |
| Ports de gestion (mgmt) | 100/1000 out-of-band management port (1), 100/1000 high availability (2), 10G SFP+ high availability (1), RJ-45 console port (1), Micro USB (1) | strata_ds_pa-3400-series_021126, Table 3 p.7 (Management I/O) |
| Format (f) | 1U Rack | strata_ds_pa-3400-series_021126, Table 3 p.7 (Rack Mount Dimensions) |
| Stockage (disk) | 480 GB SSD | strata_ds_pa-3400-series_021126, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | Redondante, 450 W AC | strata_ds_pa-3400-series_021126, Table 3 p.7 (Power Supply) |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-3400-series_021126, Table 3 p.7 (Airflow) |
| HA actif/passif (haAP) | oui | strata_ds_pa-3400-series_021126, Table 2 p.6 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-3400 : 6 membres) |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-3400-series_021126, Table 2 p.6 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-3400 : 6 membres) |
| Clustering (haCl) | HA clustering, 6 membres max | strata_ds_pa-3400-series_021126, Table 2 p.6 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-3400 : 6 membres) |
| Ports HA dedies (haPorts) | HA1-A et HA1-B 100/1000 (2), HSCI 10G SFP+ (1) | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | oui | strata_ds_pa-3400-series_021126, Table 2 p.6 (Mobile Network Infrastructure, PA-3440 et PA-3430 seulement) |
| GlobalProtect | oui | strata_ds_pa-3400-series_021126, Table 2 p.6 |
| Reference (sku) | PAN-PA-3440 | catalogue officiel Palo Alto (liste de references, colonne SKU) |
| PAN-OS minimal (panosMin) | 10.2 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-3400-series_021126, Table 1 p.5 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 2000 / 1000 / 30000 / 8000 / 300000 / 30000 / 6000 / 4000 / 500 / 500 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-3510 (PA-3500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-3500-series (`strata_ds_pa-3500-series-quantum-optimized-ngfws_102026`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 30 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 15 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 13 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| Sessions max (sess) | 2000000 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 325000 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 5 / 15 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 8 (10G mGig) | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 8 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 6 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 2 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 10G mGig Cu (8), 1G/10G SFP+ (8), 10G/25G SFP28 (6), 40G/100G QSFP28 (2) | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, sans objet |
| Ports de gestion (mgmt) | Out-of-band management: 1G/10G SFP+, Console: RJ-45 (1), Console: USB-C, Bootstrap: USB-C, HSCI: 100G (2), Log: 10G SFP+ | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (Management I/O) |
| Format (f) | 1U Rack | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.8 (Rack Mount Dimensions) et Table 4 p.9 (kits 1RU / 2RU) |
| Stockage (disk) | 960 GB SSD (cold swap) | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | 1 200 W (2 fournies), 1+1 redondantes en 220 V, 110 V et DC | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7-8 (Power Supply, Power Supplies) |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.8 (Airflow) |
| HA actif/passif (haAP) | oui | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 2 p.7 (HA active/passive, NGFW clustering with active/active : future release) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering/configure-an-ngfw-cluster ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| HA actif/actif classique (haAA) | *non publie* | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 2 p.7 (HA active/passive, NGFW clustering with active/active : future release) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering/configure-an-ngfw-cluster ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Clustering (haCl) | NGFW clustering, 2 membres (la datasheet l'annonce pour une version future) | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 2 p.7 (HA active/passive, NGFW clustering with active/active : future release) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering/configure-an-ngfw-cluster ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Ports HA dedies (haPorts) | HSCI 40/100G (2), servent de liens HA1 et HA2 | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | oui | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 2 p.7 (Mobile Network Infrastructure : 5G Security) |
| GlobalProtect | oui | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 2 p.7 |
| Reference (sku) | PAN-PA-3510 | Table 4 p.9 |
| PAN-OS minimal (panosMin) | 12.2.2 | https://docs.paloaltonetworks.com/hardware/pa-3500-hardware-reference/pa-3500-series-firewall-overview (First Supported PAN-OS Software Release) |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-3520 (PA-3500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-3500-series (`strata_ds_pa-3500-series-quantum-optimized-ngfws_102026`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 35 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 20 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 15 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| Sessions max (sess) | 4000000 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 350000 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 5 / 15 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 8 (10G mGig) | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 8 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 6 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 2 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 10G mGig Cu (8), 1G/10G SFP+ (8), 10G/25G SFP28 (6), 40G/100G QSFP28 (2) | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, sans objet |
| Ports de gestion (mgmt) | Out-of-band management: 1G/10G SFP+, Console: RJ-45 (1), Console: USB-C, Bootstrap: USB-C, HSCI: 100G (2), Log: 10G SFP+ | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (Management I/O) |
| Format (f) | 1U Rack | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.8 (Rack Mount Dimensions) et Table 4 p.9 (kits 1RU / 2RU) |
| Stockage (disk) | 960 GB SSD (cold swap) | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | 1 200 W (2 fournies), 1+1 redondantes en 220 V, 110 V et DC | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7-8 (Power Supply, Power Supplies) |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.8 (Airflow) |
| HA actif/passif (haAP) | oui | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 2 p.7 (HA active/passive, NGFW clustering with active/active : future release) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering/configure-an-ngfw-cluster ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| HA actif/actif classique (haAA) | *non publie* | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 2 p.7 (HA active/passive, NGFW clustering with active/active : future release) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering/configure-an-ngfw-cluster ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Clustering (haCl) | NGFW clustering, 2 membres (la datasheet l'annonce pour une version future) | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 2 p.7 (HA active/passive, NGFW clustering with active/active : future release) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering/configure-an-ngfw-cluster ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Ports HA dedies (haPorts) | HSCI 40/100G (2), servent de liens HA1 et HA2 | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | oui | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 2 p.7 (Mobile Network Infrastructure : 5G Security) |
| GlobalProtect | oui | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 2 p.7 |
| Reference (sku) | PAN-PA-3520 | Table 4 p.9 |
| PAN-OS minimal (panosMin) | 12.2.2 | https://docs.paloaltonetworks.com/hardware/pa-3500-hardware-reference/pa-3500-series-firewall-overview (First Supported PAN-OS Software Release) |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-3530 (PA-3500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-3500-series (`strata_ds_pa-3500-series-quantum-optimized-ngfws_102026`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 45 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 25 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 22 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| Sessions max (sess) | 5000000 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 500000 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 5 / 20 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 8 (10G mGig) | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 12 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 8 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 4 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 10G mGig Cu (8), 1G/10G SFP+ (12), 10G/25G SFP28 (8), 40G/100G QSFP28 (4) | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, sans objet |
| Ports de gestion (mgmt) | Out-of-band management: 1G/10G SFP+, Console: RJ-45 (1), Console: USB-C, Bootstrap: USB-C, HSCI: 100G (2), Log: 10G SFP+ | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (Management I/O) |
| Format (f) | 2U Rack | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.8 (Rack Mount Dimensions) et Table 4 p.9 (kits 1RU / 2RU) |
| Stockage (disk) | 960 GB SSD (cold swap) | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | 1 200 W (2 fournies), 1+1 redondantes en 220 V, 110 V et DC | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7-8 (Power Supply, Power Supplies) |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.8 (Airflow) |
| HA actif/passif (haAP) | oui | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 2 p.7 (HA active/passive, NGFW clustering with active/active : future release) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering/configure-an-ngfw-cluster ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| HA actif/actif classique (haAA) | *non publie* | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 2 p.7 (HA active/passive, NGFW clustering with active/active : future release) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering/configure-an-ngfw-cluster ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Clustering (haCl) | NGFW clustering, 2 membres (la datasheet l'annonce pour une version future) | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 2 p.7 (HA active/passive, NGFW clustering with active/active : future release) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering/configure-an-ngfw-cluster ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Ports HA dedies (haPorts) | HSCI 40/100G (2), servent de liens HA1 et HA2 | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | oui | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 2 p.7 (Mobile Network Infrastructure : 5G Security) |
| GlobalProtect | oui | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 2 p.7 |
| Reference (sku) | PAN-PA-3530 | Table 4 p.9 |
| PAN-OS minimal (panosMin) | 12.2.2 | https://docs.paloaltonetworks.com/hardware/pa-3500-hardware-reference/pa-3500-series-firewall-overview (First Supported PAN-OS Software Release) |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-3540 (PA-3500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-3500-series (`strata_ds_pa-3500-series-quantum-optimized-ngfws_102026`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 55 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 35 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 36 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| Sessions max (sess) | 6000000 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 550000 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 5 / 20 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 8 (10G mGig) | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 12 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 8 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 4 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 10G mGig Cu (8), 1G/10G SFP+ (12), 10G/25G SFP28 (8), 40G/100G QSFP28 (4) | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, sans objet |
| Ports de gestion (mgmt) | Out-of-band management: 1G/10G SFP+, Console: RJ-45 (1), Console: USB-C, Bootstrap: USB-C, HSCI: 100G (2), Log: 10G SFP+ | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (Management I/O) |
| Format (f) | 2U Rack | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.8 (Rack Mount Dimensions) et Table 4 p.9 (kits 1RU / 2RU) |
| Stockage (disk) | 960 GB SSD (cold swap) | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | 1 200 W (2 fournies), 1+1 redondantes en 220 V, 110 V et DC | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.7-8 (Power Supply, Power Supplies) |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 3 p.8 (Airflow) |
| HA actif/passif (haAP) | oui | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 2 p.7 (HA active/passive, NGFW clustering with active/active : future release) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering/configure-an-ngfw-cluster ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| HA actif/actif classique (haAA) | *non publie* | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 2 p.7 (HA active/passive, NGFW clustering with active/active : future release) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering/configure-an-ngfw-cluster ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Clustering (haCl) | NGFW clustering, 2 membres (la datasheet l'annonce pour une version future) | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 2 p.7 (HA active/passive, NGFW clustering with active/active : future release) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering/configure-an-ngfw-cluster ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Ports HA dedies (haPorts) | HSCI 40/100G (2), servent de liens HA1 et HA2 | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | oui | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 2 p.7 (Mobile Network Infrastructure : 5G Security) |
| GlobalProtect | oui | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 2 p.7 |
| Reference (sku) | PAN-PA-3540 | Table 4 p.9 |
| PAN-OS minimal (panosMin) | 12.2.2 | https://docs.paloaltonetworks.com/hardware/pa-3500-hardware-reference/pa-3500-series-firewall-overview (First Supported PAN-OS Software Release) |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-3500-series-quantum-optimized-ngfws_102026, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-5410 (PA-5400)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-5400-series (`strata_ds_pa-5400-series_041426`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 52 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 35 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 20 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Sessions max (sess) | 5000000 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 270000 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 10 / 20 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 8 (1/2.5/5/10G) | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 12 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 4 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 4 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 1G/2.5G/5G/10G (8), 1G/10G SFP/SFP+ (12), 1G/10G/25G SFP/SFP+/SFP28 (4), 40G/100G QSFP+/QSFP28 (4) | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-5400-series_041426, sans objet |
| Ports de gestion (mgmt) | 1G/10G SFP/SFP+ out-of-band management port (1), 1G/10G SFP/SFP+ high availability (2), 40G QSFP+ high availability (1), RJ-45 console port (1), Micro USB | strata_ds_pa-5400-series_041426, Table 3 p.7 (Management I/O) |
| Format (f) | 2U Rack | strata_ds_pa-5400-series_041426, Table 3 p.8 (Rack Mount Dimensions) |
| Stockage (disk) | 480 GB SSD pair | strata_ds_pa-5400-series_041426, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | 1 200 W (2/2), 1:1 fully redundant ; AC et DC | strata_ds_pa-5400-series_041426, Table 3 p.7-8 (Power Supplies, Max Current AC et DC) |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-5400-series_041426, Table 3 p.8 (Airflow) |
| HA actif/passif (haAP) | oui | strata_ds_pa-5400-series_041426, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-5410 a PA-5445 : 8 membres) |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-5400-series_041426, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-5410 a PA-5445 : 8 membres) |
| Clustering (haCl) | HA clustering, 8 membres max | strata_ds_pa-5400-series_041426, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-5410 a PA-5445 : 8 membres) |
| Ports HA dedies (haPorts) | HA1-A et HA1-B SFP/SFP+ 1/10G (2), HSCI 40G QSFP+ (1) | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support |
| 5G Security (m5g) | oui | strata_ds_pa-5400-series_041426, Table 2 p.7 (5G, GTP, SCTP Security) |
| GlobalProtect | oui | strata_ds_pa-5400-series_041426, Table 2 p.6-7 |
| Reference (sku) | PAN-PA-5410-AC | catalogue officiel Palo Alto (liste de references, colonne SKU) |
| PAN-OS minimal (panosMin) | 10.2 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-5400-series_041426, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 15000 / 4000 / 30000 / 10000 / 500000 / 80000 / 6000 / 4000 / 800 / 750 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-5420 (PA-5400)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-5400-series (`strata_ds_pa-5400-series_041426`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 70 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 50 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 28 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Sessions max (sess) | 7000000 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 370000 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 15 / 65 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 8 (1/2.5/5/10G) | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 12 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 4 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 4 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 1G/2.5G/5G/10G (8), 1G/10G SFP/SFP+ (12), 1G/10G/25G SFP/SFP+/SFP28 (4), 40G/100G QSFP+/QSFP28 (4) | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-5400-series_041426, sans objet |
| Ports de gestion (mgmt) | 1G/10G SFP/SFP+ out-of-band management port (1), 1G/10G SFP/SFP+ high availability (2), 40G QSFP+ high availability (1), RJ-45 console port (1), Micro USB | strata_ds_pa-5400-series_041426, Table 3 p.7 (Management I/O) |
| Format (f) | 2U Rack | strata_ds_pa-5400-series_041426, Table 3 p.8 (Rack Mount Dimensions) |
| Stockage (disk) | 480 GB SSD pair | strata_ds_pa-5400-series_041426, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | 1 200 W (2/2), 1:1 fully redundant ; AC et DC | strata_ds_pa-5400-series_041426, Table 3 p.7-8 (Power Supplies, Max Current AC et DC) |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-5400-series_041426, Table 3 p.8 (Airflow) |
| HA actif/passif (haAP) | oui | strata_ds_pa-5400-series_041426, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-5410 a PA-5445 : 8 membres) |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-5400-series_041426, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-5410 a PA-5445 : 8 membres) |
| Clustering (haCl) | HA clustering, 8 membres max | strata_ds_pa-5400-series_041426, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-5410 a PA-5445 : 8 membres) |
| Ports HA dedies (haPorts) | HA1-A et HA1-B SFP/SFP+ 1/10G (2), HSCI 40G QSFP+ (1) | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support |
| 5G Security (m5g) | oui | strata_ds_pa-5400-series_041426, Table 2 p.7 (5G, GTP, SCTP Security) |
| GlobalProtect | oui | strata_ds_pa-5400-series_041426, Table 2 p.6-7 |
| Reference (sku) | PAN-PA-5420-AC | catalogue officiel Palo Alto (liste de references, colonne SKU) |
| PAN-OS minimal (panosMin) | 10.2 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-5400-series_041426, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 22000 / 4000 / 30000 / 10000 / 500000 / 80000 / 6000 / 4000 / 800 / 750 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-5430 (PA-5400)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-5400-series (`strata_ds_pa-5400-series_041426`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 80 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 60 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 42 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Sessions max (sess) | 9000000 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 380000 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 25 / 125 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 8 (1/2.5/5/10G) | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 12 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 4 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 4 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 1G/2.5G/5G/10G (8), 1G/10G SFP/SFP+ (12), 1G/10G/25G SFP/SFP+/SFP28 (4), 40G/100G QSFP+/QSFP28 (4) | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-5400-series_041426, sans objet |
| Ports de gestion (mgmt) | 1G/10G SFP/SFP+ out-of-band management port (1), 1G/10G SFP/SFP+ high availability (2), 40G QSFP+ high availability (1), RJ-45 console port (1), Micro USB | strata_ds_pa-5400-series_041426, Table 3 p.7 (Management I/O) |
| Format (f) | 2U Rack | strata_ds_pa-5400-series_041426, Table 3 p.8 (Rack Mount Dimensions) |
| Stockage (disk) | 480 GB SSD pair | strata_ds_pa-5400-series_041426, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | 1 200 W (2/2), 1:1 fully redundant ; AC et DC | strata_ds_pa-5400-series_041426, Table 3 p.7-8 (Power Supplies, Max Current AC et DC) |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-5400-series_041426, Table 3 p.8 (Airflow) |
| HA actif/passif (haAP) | oui | strata_ds_pa-5400-series_041426, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-5410 a PA-5445 : 8 membres) |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-5400-series_041426, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-5410 a PA-5445 : 8 membres) |
| Clustering (haCl) | HA clustering, 8 membres max | strata_ds_pa-5400-series_041426, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-5410 a PA-5445 : 8 membres) |
| Ports HA dedies (haPorts) | HA1-A et HA1-B SFP/SFP+ 1/10G (2), HSCI 40G QSFP+ (1) | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support |
| 5G Security (m5g) | oui | strata_ds_pa-5400-series_041426, Table 2 p.7 (5G, GTP, SCTP Security) |
| GlobalProtect | oui | strata_ds_pa-5400-series_041426, Table 2 p.6-7 |
| Reference (sku) | PAN-PA-5430-AC | catalogue officiel Palo Alto (liste de references, colonne SKU) |
| PAN-OS minimal (panosMin) | 10.2 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-5400-series_041426, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 30000 / 4000 / 30000 / 10000 / 500000 / 80000 / 6000 / 4000 / 800 / 750 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-5440 (PA-5400)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-5400-series (`strata_ds_pa-5400-series_041426`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 85 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 70 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 58 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Sessions max (sess) | 20000000 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 390000 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 25 / 225 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 8 (1/2.5/5/10G) | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 12 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 4 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 4 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 1G/2.5G/5G/10G (8), 1G/10G SFP/SFP+ (12), 1G/10G/25G SFP/SFP+/SFP28 (4), 40G/100G QSFP+/QSFP28 (4) | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-5400-series_041426, sans objet |
| Ports de gestion (mgmt) | 1G/10G SFP/SFP+ out-of-band management port (1), 1G/10G SFP/SFP+ high availability (2), 40G QSFP+ high availability (1), RJ-45 console port (1), Micro USB | strata_ds_pa-5400-series_041426, Table 3 p.7 (Management I/O) |
| Format (f) | 2U Rack | strata_ds_pa-5400-series_041426, Table 3 p.8 (Rack Mount Dimensions) |
| Stockage (disk) | 480 GB SSD pair | strata_ds_pa-5400-series_041426, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | 1 200 W (2/2), 1:1 fully redundant ; AC et DC | strata_ds_pa-5400-series_041426, Table 3 p.7-8 (Power Supplies, Max Current AC et DC) |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-5400-series_041426, Table 3 p.8 (Airflow) |
| HA actif/passif (haAP) | oui | strata_ds_pa-5400-series_041426, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-5410 a PA-5445 : 8 membres) |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-5400-series_041426, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-5410 a PA-5445 : 8 membres) |
| Clustering (haCl) | HA clustering, 8 membres max | strata_ds_pa-5400-series_041426, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-5410 a PA-5445 : 8 membres) |
| Ports HA dedies (haPorts) | HA1-A et HA1-B SFP/SFP+ 1/10G (2), HSCI 40G QSFP+ (1) | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support |
| 5G Security (m5g) | oui | strata_ds_pa-5400-series_041426, Table 2 p.7 (5G, GTP, SCTP Security) |
| GlobalProtect | oui | strata_ds_pa-5400-series_041426, Table 2 p.6-7 |
| Reference (sku) | PAN-PA-5440-AC | catalogue officiel Palo Alto (liste de references, colonne SKU) |
| PAN-OS minimal (panosMin) | 11.0 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-5400-series_041426, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 60000 / 4000 / 30000 / 10000 / 500000 / 80000 / 6000 / 4000 / 800 / 750 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-5445 (PA-5400)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-5400-series (`strata_ds_pa-5400-series_041426`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 90 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 76 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 64 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Sessions max (sess) | 48000000 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 449000 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 25 / 225 | strata_ds_pa-5400-series_041426, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 8 (1/2.5/5/10G) | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 12 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 4 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 4 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 1G/2.5G/5G/10G (8), 1G/10G SFP/SFP+ (12), 1G/10G/25G SFP/SFP+/SFP28 (4), 40G/100G QSFP+/QSFP28 (4) | strata_ds_pa-5400-series_041426, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-5400-series_041426, sans objet |
| Ports de gestion (mgmt) | 1G/10G SFP/SFP+ out-of-band management port (1), 1G/10G SFP/SFP+ high availability (2), 40G QSFP+ high availability (1), RJ-45 console port (1), Micro USB | strata_ds_pa-5400-series_041426, Table 3 p.7 (Management I/O) |
| Format (f) | 2U Rack | strata_ds_pa-5400-series_041426, Table 3 p.8 (Rack Mount Dimensions) |
| Stockage (disk) | 480 GB SSD pair | strata_ds_pa-5400-series_041426, Table 3 p.7 (Storage Capacity) |
| Alimentation (psu) | 1 200 W (2/2), 1:1 fully redundant ; AC et DC | strata_ds_pa-5400-series_041426, Table 3 p.7-8 (Power Supplies, Max Current AC et DC) |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-5400-series_041426, Table 3 p.8 (Airflow) |
| HA actif/passif (haAP) | oui | strata_ds_pa-5400-series_041426, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-5410 a PA-5445 : 8 membres) |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-5400-series_041426, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-5410 a PA-5445 : 8 membres) |
| Clustering (haCl) | HA clustering, 8 membres max | strata_ds_pa-5400-series_041426, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-5410 a PA-5445 : 8 membres) |
| Ports HA dedies (haPorts) | HA1-A et HA1-B SFP/SFP+ 1/10G (2), HSCI 40G QSFP+ (1) | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support |
| 5G Security (m5g) | oui | strata_ds_pa-5400-series_041426, Table 2 p.7 (5G, GTP, SCTP Security) |
| GlobalProtect | oui | strata_ds_pa-5400-series_041426, Table 2 p.6-7 |
| Reference (sku) | PAN-PA-5445-AC | catalogue officiel Palo Alto (liste de references, colonne SKU) |
| PAN-OS minimal (panosMin) | 11.1 | https://docs.paloaltonetworks.com/pan-os/11-1/pan-os-release-notes/features-introduced-in-pan-os/hardware-features |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-5400-series_041426, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 60000 / 4000 / 30000 / 10000 / 500000 / 80000 / 6000 / 4000 / 800 / 750 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-5510 (PA-5500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-5500-series (`strata_ds_pa-5500-series_081926`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 65 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 45 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 34 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Sessions max (sess) | 7000000 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 600000 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 10 / 20 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 10 (10G mGig) | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 12 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 8 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 6 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 10GE Cu mGig (10), 10GE SFP+ (12), 10G/25G SFP28 (8), 40G/100G QSFP28 (6) | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-5500-series_081926, sans objet |
| Ports de gestion (mgmt) | Out-of-band management: 1G/10G SFP+, Console: RJ-45 (1), Console: USB-C, Bootstrap: USB-C, HSCI: 40G/100G (2), Log: 10G SFP+ | strata_ds_pa-5500-series_081926, Table 3 p.7 (Management I/O) |
| Format (f) | 2U Rack | strata_ds_pa-5500-series_081926, Table 3 p.9 (Rack Mount Dimensions) |
| Stockage (disk) | 960 GB RAID1 SSD pair (3.84 TB en option) | strata_ds_pa-5500-series_081926, Table 3 p.8 (Storage Capacity) |
| Alimentation (psu) | 1 200 W (2 fournies), 1+1 redondantes en 110-220 V et DC | strata_ds_pa-5500-series_081926, Table 3 p.8 (Power Supplies, Power Supply Output) et Table 4 p.10 |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-5500-series_081926, Table 3 p.9 (Airflow), Table 4 p.10 (5x PAN-PA-FAN-2RU-A) |
| HA actif/passif (haAP) | oui | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| HA actif/actif classique (haAA) | non | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Clustering (haCl) | NGFW clustering, 2 membres | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Ports HA dedies (haPorts) | HSCI 40/100G (2), servent de liens HA1 et HA2 | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | oui | strata_ds_pa-5500-series_081926, Table 2 p.7 (Mobile Network Infrastructure : 5G security) |
| GlobalProtect | oui | strata_ds_pa-5500-series_081926, Table 2 p.6-7 |
| Reference (sku) | PAN-PA-5510-AC | Table 4 p.10 |
| PAN-OS minimal (panosMin) | 12.2.2 | https://docs.paloaltonetworks.com/hardware/pa-5500-hardware-reference/pa-5500-series-firewall-overview |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-5500-series_081926, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-5520 (PA-5500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-5500-series (`strata_ds_pa-5500-series_081926`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 75 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 55 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 36 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Sessions max (sess) | 12000000 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 971000 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 15 / 65 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 10 (10G mGig) | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 12 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 8 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 6 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 10GE Cu mGig (10), 10GE SFP+ (12), 10G/25G SFP28 (8), 40G/100G QSFP28 (6) | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-5500-series_081926, sans objet |
| Ports de gestion (mgmt) | Out-of-band management: 1G/10G SFP+, Console: RJ-45 (1), Console: USB-C, Bootstrap: USB-C, HSCI: 40G/100G (2), Log: 10G SFP+ | strata_ds_pa-5500-series_081926, Table 3 p.7 (Management I/O) |
| Format (f) | 2U Rack | strata_ds_pa-5500-series_081926, Table 3 p.9 (Rack Mount Dimensions) |
| Stockage (disk) | 960 GB RAID1 SSD pair (3.84 TB en option) | strata_ds_pa-5500-series_081926, Table 3 p.8 (Storage Capacity) |
| Alimentation (psu) | 1 200 W (2 fournies), 1+1 redondantes en 110-220 V et DC | strata_ds_pa-5500-series_081926, Table 3 p.8 (Power Supplies, Power Supply Output) et Table 4 p.10 |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-5500-series_081926, Table 3 p.9 (Airflow), Table 4 p.10 (5x PAN-PA-FAN-2RU-A) |
| HA actif/passif (haAP) | oui | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| HA actif/actif classique (haAA) | non | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Clustering (haCl) | NGFW clustering, 2 membres | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Ports HA dedies (haPorts) | HSCI 40/100G (2), servent de liens HA1 et HA2 | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | oui | strata_ds_pa-5500-series_081926, Table 2 p.7 (Mobile Network Infrastructure : 5G security) |
| GlobalProtect | oui | strata_ds_pa-5500-series_081926, Table 2 p.6-7 |
| Reference (sku) | PAN-PA-5520-AC | Table 4 p.10 |
| PAN-OS minimal (panosMin) | 12.2.2 | https://docs.paloaltonetworks.com/hardware/pa-5500-hardware-reference/pa-5500-series-firewall-overview |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-5500-series_081926, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-5530 (PA-5500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-5500-series (`strata_ds_pa-5500-series_081926`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 100 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 65 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 38 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Sessions max (sess) | 14000000 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 1010000 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 25 / 125 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 10 (10G mGig) | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 12 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 8 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 6 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 10GE Cu mGig (10), 10GE SFP+ (12), 10G/25G SFP28 (8), 40G/100G QSFP28 (6) | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-5500-series_081926, sans objet |
| Ports de gestion (mgmt) | Out-of-band management: 1G/10G SFP+, Console: RJ-45 (1), Console: USB-C, Bootstrap: USB-C, HSCI: 40G/100G (2), Log: 10G SFP+ | strata_ds_pa-5500-series_081926, Table 3 p.7 (Management I/O) |
| Format (f) | 2U Rack | strata_ds_pa-5500-series_081926, Table 3 p.9 (Rack Mount Dimensions) |
| Stockage (disk) | 960 GB RAID1 SSD pair (3.84 TB en option) | strata_ds_pa-5500-series_081926, Table 3 p.8 (Storage Capacity) |
| Alimentation (psu) | 1 200 W (2 fournies), 1+1 redondantes en 110-220 V et DC | strata_ds_pa-5500-series_081926, Table 3 p.8 (Power Supplies, Power Supply Output) et Table 4 p.10 |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-5500-series_081926, Table 3 p.9 (Airflow), Table 4 p.10 (5x PAN-PA-FAN-2RU-A) |
| HA actif/passif (haAP) | oui | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| HA actif/actif classique (haAA) | non | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Clustering (haCl) | NGFW clustering, 2 membres | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Ports HA dedies (haPorts) | HSCI 40/100G (2), servent de liens HA1 et HA2 | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | oui | strata_ds_pa-5500-series_081926, Table 2 p.7 (Mobile Network Infrastructure : 5G security) |
| GlobalProtect | oui | strata_ds_pa-5500-series_081926, Table 2 p.6-7 |
| Reference (sku) | PAN-PA-5530-AC | Table 4 p.10 |
| PAN-OS minimal (panosMin) | 12.2.2 | https://docs.paloaltonetworks.com/hardware/pa-5500-hardware-reference/pa-5500-series-firewall-overview |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-5500-series_081926, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-5540 (PA-5500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-5500-series (`strata_ds_pa-5500-series_081926`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 150 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 90 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 80 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Sessions max (sess) | 39000000 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 1330000 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 25 / 225 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 16 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 16 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 4 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 10G/25G SFP28 (16), 40G/100G QSFP28 (16), 100G/400G QSFP-DD (4) | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-5500-series_081926, sans objet |
| Ports de gestion (mgmt) | Out-of-band management: 1G/10G SFP+ (2), Console: RJ-45 (1), Console: USB-C, Bootstrap: USB 3.2 Gen1 Type A, HSCI: 100G/400G QSFP-DD (2), Log: 10G SFP+ (2) | strata_ds_pa-5500-series_081926, Table 3 p.7 (Management I/O) |
| Format (f) | 3U Rack | strata_ds_pa-5500-series_081926, Table 3 p.9 (Rack Mount Dimensions) |
| Stockage (disk) | 3.84 TB RAID1 SSD pair | strata_ds_pa-5500-series_081926, Table 3 p.8 (Storage Capacity) |
| Alimentation (psu) | 2 700 W AC (4 fournies) : 2+2 redondantes en 220 V, 3+1 en 110 V ; DC 2 200 W | strata_ds_pa-5500-series_081926, Table 3 p.8 (Power Supplies, Power Supply Output) et Table 4 p.10 |
| Refroidissement (cool) | Ventilée (5 ventilateurs remplaçables), flux avant-arrière | strata_ds_pa-5500-series_081926, Table 3 p.9 (Airflow), Table 4 p.10 (5x PAN-PA-FAN-2RU-A) |
| HA actif/passif (haAP) | oui | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| HA actif/actif classique (haAA) | non | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Clustering (haCl) | NGFW clustering, 2 membres | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Ports HA dedies (haPorts) | HSCI 100/400G QSFP-DD (2) | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | oui | strata_ds_pa-5500-series_081926, Table 2 p.7 (Mobile Network Infrastructure : 5G security) |
| GlobalProtect | oui | strata_ds_pa-5500-series_081926, Table 2 p.6-7 |
| Reference (sku) | PAN-PA-5540-AC | Table 4 p.10 |
| PAN-OS minimal (panosMin) | 12.1.2 | https://docs.paloaltonetworks.com/hardware/pa-5500-hardware-reference/pa-5500-series-firewall-overview |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-5500-series_081926, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-5550 (PA-5500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-5500-series (`strata_ds_pa-5500-series_081926`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 175 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 120 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 100 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Sessions max (sess) | 49000000 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 1670000 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 25 / 225 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 16 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 16 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 4 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 10G/25G SFP28 (16), 40G/100G QSFP28 (16), 100G/400G QSFP-DD (4) | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-5500-series_081926, sans objet |
| Ports de gestion (mgmt) | Out-of-band management: 1G/10G SFP+ (2), Console: RJ-45 (1), Console: USB-C, Bootstrap: USB 3.2 Gen1 Type A, HSCI: 100G/400G QSFP-DD (2), Log: 10G SFP+ (2) | strata_ds_pa-5500-series_081926, Table 3 p.7 (Management I/O) |
| Format (f) | 3U Rack | strata_ds_pa-5500-series_081926, Table 3 p.9 (Rack Mount Dimensions) |
| Stockage (disk) | 3.84 TB RAID1 SSD pair | strata_ds_pa-5500-series_081926, Table 3 p.8 (Storage Capacity) |
| Alimentation (psu) | 2 700 W AC (4 fournies) : 2+2 redondantes en 220 V, 3+1 en 110 V ; DC 2 200 W | strata_ds_pa-5500-series_081926, Table 3 p.8 (Power Supplies, Power Supply Output) et Table 4 p.10 |
| Refroidissement (cool) | Ventilée (5 ventilateurs remplaçables), flux avant-arrière | strata_ds_pa-5500-series_081926, Table 3 p.9 (Airflow), Table 4 p.10 (5x PAN-PA-FAN-2RU-A) |
| HA actif/passif (haAP) | oui | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| HA actif/actif classique (haAA) | non | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Clustering (haCl) | NGFW clustering, 2 membres | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Ports HA dedies (haPorts) | HSCI 100/400G QSFP-DD (2) | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | oui | strata_ds_pa-5500-series_081926, Table 2 p.7 (Mobile Network Infrastructure : 5G security) |
| GlobalProtect | oui | strata_ds_pa-5500-series_081926, Table 2 p.6-7 |
| Reference (sku) | PAN-PA-5550-AC | Table 4 p.10 |
| PAN-OS minimal (panosMin) | 12.1.2 | https://docs.paloaltonetworks.com/hardware/pa-5500-hardware-reference/pa-5500-series-firewall-overview |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-5500-series_081926, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-5560 (PA-5500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-5500-series (`strata_ds_pa-5500-series_081926`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 240 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 180 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 125 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Sessions max (sess) | 74000000 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 2500000 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 25 / 225 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 8 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 12 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 8 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 10G/25G SFP28 (8), 40G/100G QSFP28 (12), 100G/400G QSFP-DD (8) | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-5500-series_081926, sans objet |
| Ports de gestion (mgmt) | Out-of-band management: 1G/10G SFP+ (2), Console: RJ-45 (1), Console: USB-C, Bootstrap: USB 3.2 Gen1 Type A, HSCI: 100G/400G QSFP-DD (2), Log: 10G SFP+ (2) | strata_ds_pa-5500-series_081926, Table 3 p.7 (Management I/O) |
| Format (f) | 3U Rack | strata_ds_pa-5500-series_081926, Table 3 p.9 (Rack Mount Dimensions) |
| Stockage (disk) | 3.84 TB RAID1 SSD pair | strata_ds_pa-5500-series_081926, Table 3 p.8 (Storage Capacity) |
| Alimentation (psu) | 2 700 W AC (4 fournies) : 2+2 redondantes en 220 V, 3+1 en 110 V ; DC 2 200 W | strata_ds_pa-5500-series_081926, Table 3 p.8 (Power Supplies, Power Supply Output) et Table 4 p.10 |
| Refroidissement (cool) | Ventilée (5 ventilateurs remplaçables), flux avant-arrière | strata_ds_pa-5500-series_081926, Table 3 p.9 (Airflow), Table 4 p.10 (5x PAN-PA-FAN-2RU-A) |
| HA actif/passif (haAP) | oui | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| HA actif/actif classique (haAA) | non | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Clustering (haCl) | NGFW clustering, 2 membres | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Ports HA dedies (haPorts) | HSCI 100/400G QSFP-DD (2) | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | oui | strata_ds_pa-5500-series_081926, Table 2 p.7 (Mobile Network Infrastructure : 5G security) |
| GlobalProtect | oui | strata_ds_pa-5500-series_081926, Table 2 p.6-7 |
| Reference (sku) | PAN-PA-5560-AC | Table 4 p.10 |
| PAN-OS minimal (panosMin) | 12.1.2 | https://docs.paloaltonetworks.com/hardware/pa-5500-hardware-reference/pa-5500-series-firewall-overview |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-5500-series_081926, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-5570 (PA-5500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-5500-series (`strata_ds_pa-5500-series_081926`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 300 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 240 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 150 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Sessions max (sess) | 89000000 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 3000000 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 25 / 225 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 8 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 12 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 8 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 10G/25G SFP28 (8), 40G/100G QSFP28 (12), 100G/400G QSFP-DD (8) | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-5500-series_081926, sans objet |
| Ports de gestion (mgmt) | Out-of-band management: 1G/10G SFP+ (2), Console: RJ-45 (1), Console: USB-C, Bootstrap: USB 3.2 Gen1 Type A, HSCI: 100G/400G QSFP-DD (2), Log: 10G SFP+ (2) | strata_ds_pa-5500-series_081926, Table 3 p.7 (Management I/O) |
| Format (f) | 3U Rack | strata_ds_pa-5500-series_081926, Table 3 p.9 (Rack Mount Dimensions) |
| Stockage (disk) | 3.84 TB RAID1 SSD pair | strata_ds_pa-5500-series_081926, Table 3 p.8 (Storage Capacity) |
| Alimentation (psu) | 2 700 W AC (4 fournies) : 2+2 redondantes en 220 V, 3+1 en 110 V ; DC 2 200 W | strata_ds_pa-5500-series_081926, Table 3 p.8 (Power Supplies, Power Supply Output) et Table 4 p.10 |
| Refroidissement (cool) | Ventilée (5 ventilateurs remplaçables), flux avant-arrière | strata_ds_pa-5500-series_081926, Table 3 p.9 (Airflow), Table 4 p.10 (5x PAN-PA-FAN-2RU-A) |
| HA actif/passif (haAP) | oui | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| HA actif/actif classique (haAA) | non | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Clustering (haCl) | NGFW clustering, 2 membres | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Ports HA dedies (haPorts) | HSCI 100/400G QSFP-DD (2) | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | oui | strata_ds_pa-5500-series_081926, Table 2 p.7 (Mobile Network Infrastructure : 5G security) |
| GlobalProtect | oui | strata_ds_pa-5500-series_081926, Table 2 p.6-7 |
| Reference (sku) | PAN-PA-5570-AC | Table 4 p.10 |
| PAN-OS minimal (panosMin) | 12.1.2 | https://docs.paloaltonetworks.com/hardware/pa-5500-hardware-reference/pa-5500-series-firewall-overview |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-5500-series_081926, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-5580 (PA-5500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-5500-series (`strata_ds_pa-5500-series_081926`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 375 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Threat Prevention appmix (tp, Gbps) | 300 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| IPsec VPN (vpn, Gbps) | 170 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Sessions max (sess) | 99000000 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Nouvelles sessions/s (cps) | 3300000 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Systemes virtuels base/max (vsys) | 25 / 225 | strata_ds_pa-5500-series_081926, Table 1 p.6 |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP28 25G (sfp25) | 8 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| QSFP28 100G (sfp100) | 12 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 8 | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| Libelle I/O (io) | 10G/25G SFP28 (8), 40G/100G QSFP28 (12), 100G/400G QSFP-DD (8) | strata_ds_pa-5500-series_081926, Table 3 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-5500-series_081926, sans objet |
| Ports de gestion (mgmt) | Out-of-band management: 1G/10G SFP+ (2), Console: RJ-45 (1), Console: USB-C, Bootstrap: USB 3.2 Gen1 Type A, HSCI: 100G/400G QSFP-DD (2), Log: 10G SFP+ (2) | strata_ds_pa-5500-series_081926, Table 3 p.7 (Management I/O) |
| Format (f) | 3U Rack | strata_ds_pa-5500-series_081926, Table 3 p.9 (Rack Mount Dimensions) |
| Stockage (disk) | 3.84 TB RAID1 SSD pair | strata_ds_pa-5500-series_081926, Table 3 p.8 (Storage Capacity) |
| Alimentation (psu) | 2 700 W AC (4 fournies) : 2+2 redondantes en 220 V, 3+1 en 110 V ; DC 2 200 W | strata_ds_pa-5500-series_081926, Table 3 p.8 (Power Supplies, Power Supply Output) et Table 4 p.10 |
| Refroidissement (cool) | Ventilée (5 ventilateurs remplaçables), flux avant-arrière | strata_ds_pa-5500-series_081926, Table 3 p.9 (Airflow), Table 4 p.10 (5x PAN-PA-FAN-2RU-A) |
| HA actif/passif (haAP) | oui | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| HA actif/actif classique (haAA) | non | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Clustering (haCl) | NGFW clustering, 2 membres | strata_ds_pa-5500-series_081926, Table 2 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering ; https://docs.paloaltonetworks.com/ngfw/new-features/by-version/panos/12-2 |
| Ports HA dedies (haPorts) | HSCI 100/400G QSFP-DD (2) | Table 3 p.7 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | oui | strata_ds_pa-5500-series_081926, Table 2 p.7 (Mobile Network Infrastructure : 5G security) |
| GlobalProtect | oui | strata_ds_pa-5500-series_081926, Table 2 p.6-7 |
| Reference (sku) | PAN-PA-5580-AC | Table 4 p.10 |
| PAN-OS minimal (panosMin) | 12.1.2 | https://docs.paloaltonetworks.com/hardware/pa-5500-hardware-reference/pa-5500-series-firewall-overview |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-5500-series_081926, Table 1 p.6 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-7050 (PA-7000)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-7000-series (`strata_ds_pa-7000-series_071624`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 343 | strata_ds_pa-7000-series_071624, Table 1 p.5 (systeme complet) |
| Threat Prevention appmix (tp, Gbps) | 184 | strata_ds_pa-7000-series_071624, Table 1 p.5 (systeme complet) |
| IPsec VPN (vpn, Gbps) | 190 | strata_ds_pa-7000-series_071624, Table 1 p.5 (systeme complet) |
| Sessions max (sess) | 245000000 | strata_ds_pa-7000-series_071624, Table 1 p.5 (systeme complet) |
| Nouvelles sessions/s (cps) | 4000000 | strata_ds_pa-7000-series_071624, Table 1 p.5 (systeme complet) |
| Systemes virtuels base/max (vsys) | 25 / 225 | strata_ds_pa-7000-series_071624, Table 1 p.5 (systeme complet) |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-7000-series_071624, Table 3 p.6 (Full System) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-7000-series_071624, Table 3 p.6 (Full System) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-7000-series_071624, Table 3 p.6 (Full System) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-7000-series_071624, Table 3 p.6 (Full System) |
| SFP+ 10G (sfp10) | 48 | strata_ds_pa-7000-series_071624, Table 3 p.6 (Full System) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-7000-series_071624, Table 3 p.6 (Full System) |
| QSFP28 100G (sfp100) | 24 | strata_ds_pa-7000-series_071624, Table 3 p.6 (Full System) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-7000-series_071624, Table 3 p.6 (Full System) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-7000-series_071624, Table 3 p.6 (Full System) |
| Libelle I/O (io) | Système complet : SFP/SFP+ (48), QSFP+/QSFP28 (24), soit 6 cartes PA-7000-100G-NPC-A à SFP/SFP+ (8), QSFP+/QSFP28 (4) | strata_ds_pa-7000-series_071624, Table 3 p.6 (Full System) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-7000-series_071624, sans objet |
| Ports de gestion (mgmt) | SFP MGT (2), SFP HA1 (2), HSCI HA2/HA3 QSFP+/QSFP28 (2), RJ45 serial console (1), Micro USB serial console (1) | strata_ds_pa-7000-series_071624, Table 3 p.6 (PA-7050-SMC-B / PA-7080-SMC-B) |
| Format (f) | Chassis 9U | strata_ds_pa-7000-series_071624, Table 3 p.7 (Rack mount) |
| Stockage (disk) | 480 GB SSD, system drive RAID1 (2 x 240 GB) | strata_ds_pa-7000-series_071624, Table 3 p.6 |
| Alimentation (psu) | 2 500 W (4/4 base/max) ; AC et DC | strata_ds_pa-7000-series_071624, Table 3 p.6 (Power supplies base/max) |
| Refroidissement (cool) | *non publie* | strata_ds_pa-7000-series_071624, non publie |
| HA actif/passif (haAP) | oui | strata_ds_pa-7000-series_071624, Table 2 p.6 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-7050 : 6, PA-7080 : 4) |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-7000-series_071624, Table 2 p.6 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-7050 : 6, PA-7080 : 4) |
| Clustering (haCl) | HA clustering, 6 membres max (avec cartes NPC listées) | strata_ds_pa-7000-series_071624, Table 2 p.6 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-7050 : 6, PA-7080 : 4) |
| Ports HA dedies (haPorts) | SFP HA1 (2), HSCI HA2/HA3 QSFP+/QSFP28 (2) | Table 3 p.6 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | oui | strata_ds_pa-7000-series_071624, Table 2 p.6 (5G, GTP, SCTP Security) |
| GlobalProtect | oui | strata_ds_pa-7000-series_071624, Table 2 p.6 |
| Reference (sku) | PAN-PA-7050-AC-SYS | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (PAN-PA-7050-AC-SYS, PAN-PA-7080-AC-SYS) |
| PAN-OS minimal (panosMin) | *non publie* | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls (colonnes a partir de 10.1 : premiere version non publiee) |
| Dernier PAN-OS (panosMax) | 11.2 | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| End of Sale / End of Life (eosD / eolD, eos) | 2025-12-31 / 2030-12-31, eos oui | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| PAN-OS des mesures (dsOs) | 11.2 | strata_ds_pa-7000-series_071624, Table 1 p.5 (systeme complet) (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 40000 / 17000 / 65000 / 12000 / 4000000 / 160000 / 16000 / 4000 / 700 / 750 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-7080 (PA-7000)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-7000-series (`strata_ds_pa-7000-series_071624`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 590 | strata_ds_pa-7000-series_071624, Table 1 p.5 (systeme complet) |
| Threat Prevention appmix (tp, Gbps) | 305 | strata_ds_pa-7000-series_071624, Table 1 p.5 (systeme complet) |
| IPsec VPN (vpn, Gbps) | 310 | strata_ds_pa-7000-series_071624, Table 1 p.5 (systeme complet) |
| Sessions max (sess) | 416000000 | strata_ds_pa-7000-series_071624, Table 1 p.5 (systeme complet) |
| Nouvelles sessions/s (cps) | 6000000 | strata_ds_pa-7000-series_071624, Table 1 p.5 (systeme complet) |
| Systemes virtuels base/max (vsys) | 25 / 225 | strata_ds_pa-7000-series_071624, Table 1 p.5 (systeme complet) |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-7000-series_071624, Table 3 p.6 (Full System) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-7000-series_071624, Table 3 p.6 (Full System) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-7000-series_071624, Table 3 p.6 (Full System) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-7000-series_071624, Table 3 p.6 (Full System) |
| SFP+ 10G (sfp10) | 80 | strata_ds_pa-7000-series_071624, Table 3 p.6 (Full System) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-7000-series_071624, Table 3 p.6 (Full System) |
| QSFP28 100G (sfp100) | 40 | strata_ds_pa-7000-series_071624, Table 3 p.6 (Full System) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-7000-series_071624, Table 3 p.6 (Full System) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-7000-series_071624, Table 3 p.6 (Full System) |
| Libelle I/O (io) | Système complet : SFP/SFP+ (80), QSFP+/QSFP28 (40), soit 10 cartes PA-7000-100G-NPC-A à SFP/SFP+ (8), QSFP+/QSFP28 (4) | strata_ds_pa-7000-series_071624, Table 3 p.6 (Full System) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-7000-series_071624, sans objet |
| Ports de gestion (mgmt) | SFP MGT (2), SFP HA1 (2), HSCI HA2/HA3 QSFP+/QSFP28 (2), RJ45 serial console (1), Micro USB serial console (1) | strata_ds_pa-7000-series_071624, Table 3 p.6 (PA-7050-SMC-B / PA-7080-SMC-B) |
| Format (f) | Chassis 19U | strata_ds_pa-7000-series_071624, Table 3 p.7 (Rack mount) |
| Stockage (disk) | 480 GB SSD, system drive RAID1 (2 x 240 GB) | strata_ds_pa-7000-series_071624, Table 3 p.6 |
| Alimentation (psu) | 2 500 W (4/8 base/max) ; AC et DC | strata_ds_pa-7000-series_071624, Table 3 p.6 (Power supplies base/max) |
| Refroidissement (cool) | *non publie* | strata_ds_pa-7000-series_071624, non publie |
| HA actif/passif (haAP) | oui | strata_ds_pa-7000-series_071624, Table 2 p.6 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-7050 : 6, PA-7080 : 4) |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-7000-series_071624, Table 2 p.6 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-7050 : 6, PA-7080 : 4) |
| Clustering (haCl) | HA clustering, 4 membres max (avec cartes NPC listées) | strata_ds_pa-7000-series_071624, Table 2 p.6 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-clustering-overview (PA-7050 : 6, PA-7080 : 4) |
| Ports HA dedies (haPorts) | SFP HA1 (2), HSCI HA2/HA3 QSFP+/QSFP28 (2) | Table 3 p.6 ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls |
| 5G Security (m5g) | oui | strata_ds_pa-7000-series_071624, Table 2 p.6 (5G, GTP, SCTP Security) |
| GlobalProtect | oui | strata_ds_pa-7000-series_071624, Table 2 p.6 |
| Reference (sku) | PAN-PA-7080-AC-SYS | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (PAN-PA-7050-AC-SYS, PAN-PA-7080-AC-SYS) |
| PAN-OS minimal (panosMin) | *non publie* | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls (colonnes a partir de 10.1 : premiere version non publiee) |
| Dernier PAN-OS (panosMax) | 11.2 | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| End of Sale / End of Life (eosD / eolD, eos) | 2025-12-31 / 2030-12-31, eos oui | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates |
| PAN-OS des mesures (dsOs) | 11.2 | strata_ds_pa-7000-series_071624, Table 1 p.5 (systeme complet) (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 60000 / 17000 / 65000 / 12000 / 6000000 / 160000 / 16000 / 4000 / 700 / 750 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-7500 (PA-7500)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-7500 (`strata_ds_pa-7500_031126`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 1500 | strata_ds_pa-7500_031126, Table 1 p.5 (6 DPC-A + 2 NPC-A) |
| Threat Prevention appmix (tp, Gbps) | 1440 | strata_ds_pa-7500_031126, Table 1 p.5 (6 DPC-A + 2 NPC-A) |
| IPsec VPN (vpn, Gbps) | 407 | strata_ds_pa-7500_031126, Table 1 p.5 (6 DPC-A + 2 NPC-A) |
| Sessions max (sess) | 440000000 | strata_ds_pa-7500_031126, Table 1 p.5 (6 DPC-A + 2 NPC-A) |
| Nouvelles sessions/s (cps) | 7200000 | strata_ds_pa-7500_031126, Table 1 p.5 (6 DPC-A + 2 NPC-A) |
| Systemes virtuels base/max (vsys) | 25 / 225 | strata_ds_pa-7500_031126, Table 1 p.5 (6 DPC-A + 2 NPC-A) |
| Cuivre RJ45 1G (rj45) | 0 | strata_ds_pa-7500_031126, Table 3 p.6 (I/O each PA-7500-NPC-A) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-7500_031126, Table 3 p.6 (I/O each PA-7500-NPC-A) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-7500_031126, Table 3 p.6 (I/O each PA-7500-NPC-A) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-7500_031126, Table 3 p.6 (I/O each PA-7500-NPC-A) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-7500_031126, Table 3 p.6 (I/O each PA-7500-NPC-A) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-7500_031126, Table 3 p.6 (I/O each PA-7500-NPC-A) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-7500_031126, Table 3 p.6 (I/O each PA-7500-NPC-A) |
| SFP-DD 100G (sfpdd) | 24 | strata_ds_pa-7500_031126, Table 3 p.6 (I/O each PA-7500-NPC-A) |
| QSFP-DD 400G (sfp400) | 16 | strata_ds_pa-7500_031126, Table 3 p.6 (I/O each PA-7500-NPC-A) |
| Libelle I/O (io) | Par PA-7500-NPC-A : QSFP-DD (8) 400/100/40 Gbps avec breakout, SFP-DD (12) 100/25/10 Gbps ; configuration de référence à 2 NPC-A | strata_ds_pa-7500_031126, Table 3 p.6 (I/O each PA-7500-NPC-A) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-7500_031126, sans objet |
| Ports de gestion (mgmt) | Par PA-7500-MPC-A : QSFP28 logging port (2), QSFP-DD high availability port (2), SFP28 management port (2), combo RJ45 console port (1), Micro USB console port (1), USB (1) | strata_ds_pa-7500_031126, Table 3 p.6 (Management I/O each PA-7500-MPC-A) |
| Format (f) | Chassis 14U | strata_ds_pa-7500_031126, Table 3 p.7 (Rack Mount Dimensions) |
| Stockage (disk) | *non publie* | strata_ds_pa-7500_031126, non publie |
| Alimentation (psu) | 3 600 W (haute tension) ou 1 800 W (basse tension), N+M jusqu'à 10 alimentations en partage de charge ; AC et DC | strata_ds_pa-7500_031126, Table 3 p.7 (Power Supplies, AC/DC) |
| Refroidissement (cool) | Ventilée, flux avant-arrière | strata_ds_pa-7500_031126, Table 3 p.7 (Airflow) |
| HA actif/passif (haAP) | oui | strata_ds_pa-7500_031126, Table 2 p.6 (NGFW Clustering, active-passive, PAN-OS 12.1.5 minimum) ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering |
| HA actif/actif classique (haAA) | non | strata_ds_pa-7500_031126, Table 2 p.6 (NGFW Clustering, active-passive, PAN-OS 12.1.5 minimum) ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering |
| Clustering (haCl) | NGFW clustering, 2 membres (dès PAN-OS 11.1.3 en 11.1, 12.1.2 en 12.1) | strata_ds_pa-7500_031126, Table 2 p.6 (NGFW Clustering, active-passive, PAN-OS 12.1.5 minimum) ; https://docs.paloaltonetworks.com/ngfw/administration/high-availability/set-up-activepassive-ha/configure-activepassive-ha (A/A non supporte) ; https://docs.paloaltonetworks.com/ngfw/administration/ngfw-clustering |
| Ports HA dedies (haPorts) | HSCI-A et HSCI-B QSFP-DD 100/400G sur la carte MPC | https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls (HSCI-A/B sur MPC) |
| 5G Security (m5g) | *non publie* | strata_ds_pa-7500_031126, aucune section Mobile Network Infrastructure |
| GlobalProtect | oui | strata_ds_pa-7500_031126, Table 2 p.6 |
| Reference (sku) | PAN-PA-7500-A-SYS | catalogue officiel Palo Alto (liste de references, colonne SKU) (PAN-PA-7500-A-SYS : chassis assembly) |
| PAN-OS minimal (panosMin) | 11.1 | https://docs.paloaltonetworks.com/pan-os/11-1/pan-os-release-notes/features-introduced-in-pan-os/hardware-features ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 11.1 | strata_ds_pa-7500_031126, Table 1 p.5 (6 DPC-A + 2 NPC-A) (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | 60000 / 17000 / 65000 / 12000 / 44000000 / 160000 / 64000 / - / 8192 / 750 | edition anterieure de la datasheet, non publiees par l'edition courante : [a confirmer] |

### PA-410R (PA-400R)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-400r-series (`strata_ds_pa-400r_022726`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 1.4 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Threat Prevention appmix (tp, Gbps) | 0.65 | strata_ds_pa-400r_022726, Table 1 p.5 |
| IPsec VPN (vpn, Gbps) | 0.65 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Sessions max (sess) | 64000 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Nouvelles sessions/s (cps) | 11400 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Systemes virtuels base/max (vsys) | 1 / 2 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Cuivre RJ45 1G (rj45) | 4 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| SFP 1G (sfp1) | 2 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| Libelle I/O (io) | 1G RJ45 (4), 1G SFP (2) | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-400r_022726, Table 3 p.6 (I/O : 1G RJ45 PoE (4)), budget non publie |
| Ports de gestion (mgmt) | Management Console Port RJ45 (1), USB Port for bootstrapping (1), 1G Management Port (1) | strata_ds_pa-400r_022726, Table 3 p.6 (Management I/O) |
| Format (f) | Compact durci / DIN | strata_ds_pa-400r_022726, Table 3 p.7 (Dimensions), Table 4 p.8 (DIN clip, wall et pole mount) |
| Stockage (disk) | 128 GB | strata_ds_pa-400r_022726, Table 3 p.6 (Storage Capacity) |
| Alimentation (psu) | 12-48 VDC natif, adaptateur AC en option | strata_ds_pa-400r_022726, Table 3 p.7 (Input Voltage) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-400r_022726, Highlights p.1 (fanless) et Table 3 p.7 (Passive cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-400r_022726, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400r-hardware-reference/pa-400r-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-400r_022726, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400r-hardware-reference/pa-400r-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-400r_022726, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400r-hardware-reference/pa-400r-firewall-overview |
| Ports HA dedies (haPorts) | *non publie* | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support (PA-450R, PA-455R-5G : aucun) ; non publie pour les autres |
| 5G Security (m5g) | *non publie* | strata_ds_pa-400r_022726, aucune section Mobile Network Infrastructure |
| GlobalProtect | *non publie* | strata_ds_pa-400r_022726, GlobalProtect non mentionne par la datasheet 02/2026 |
| Reference (sku) | PAN-PA-410R | Table 4 p.8 ; PA-455R-5G : catalogue officiel Palo Alto (liste de references, colonne SKU) |
| PAN-OS minimal (panosMin) | 11.1.3 | https://docs.paloaltonetworks.com/pan-os/11-1/pan-os-release-notes/features-introduced-in-pan-os/hardware-features ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-400r_022726, Table 1 p.5 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-410R-5G (PA-400R)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-400r-series (`strata_ds_pa-400r_022726`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 1.4 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Threat Prevention appmix (tp, Gbps) | 0.65 | strata_ds_pa-400r_022726, Table 1 p.5 |
| IPsec VPN (vpn, Gbps) | 0.65 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Sessions max (sess) | 64000 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Nouvelles sessions/s (cps) | 11400 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Systemes virtuels base/max (vsys) | 1 / 2 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Cuivre RJ45 1G (rj45) | 4 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| SFP 1G (sfp1) | 2 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| Libelle I/O (io) | Integrated 5G (DSSS, Dual SIM Single Standby), 1G RJ45 (4), 1G SFP (2) | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-400r_022726, Table 3 p.6 (I/O : 1G RJ45 PoE (4)), budget non publie |
| Ports de gestion (mgmt) | Management Console Port RJ45 (1), USB Port for bootstrapping (1), 1G Management Port (1) | strata_ds_pa-400r_022726, Table 3 p.6 (Management I/O) |
| Format (f) | Compact durci / DIN | strata_ds_pa-400r_022726, Table 3 p.7 (Dimensions), Table 4 p.8 (DIN clip, wall et pole mount) |
| Stockage (disk) | 128 GB | strata_ds_pa-400r_022726, Table 3 p.6 (Storage Capacity) |
| Alimentation (psu) | 12-48 VDC natif, adaptateur AC en option | strata_ds_pa-400r_022726, Table 3 p.7 (Input Voltage) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-400r_022726, Highlights p.1 (fanless) et Table 3 p.7 (Passive cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-400r_022726, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400r-hardware-reference/pa-400r-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-400r_022726, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400r-hardware-reference/pa-400r-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-400r_022726, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400r-hardware-reference/pa-400r-firewall-overview |
| Ports HA dedies (haPorts) | *non publie* | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support (PA-450R, PA-455R-5G : aucun) ; non publie pour les autres |
| 5G Security (m5g) | *non publie* | strata_ds_pa-400r_022726, aucune section Mobile Network Infrastructure |
| GlobalProtect | *non publie* | strata_ds_pa-400r_022726, GlobalProtect non mentionne par la datasheet 02/2026 |
| Reference (sku) | PAN-PA-410R-5G | Table 4 p.8 ; PA-455R-5G : catalogue officiel Palo Alto (liste de references, colonne SKU) |
| PAN-OS minimal (panosMin) | 11.1.4 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-400r_022726, Table 1 p.5 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-450R (PA-400R)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-400r-series (`strata_ds_pa-400r_022726`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 3.2 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Threat Prevention appmix (tp, Gbps) | 1.7 | strata_ds_pa-400r_022726, Table 1 p.5 |
| IPsec VPN (vpn, Gbps) | 1.3 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Sessions max (sess) | 200000 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Nouvelles sessions/s (cps) | 48000 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Systemes virtuels base/max (vsys) | 1 / 2 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Cuivre RJ45 1G (rj45) | 6 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| Combo SFP/RJ45 1G (combo) | 2 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| Libelle I/O (io) | 1G RJ45 (6), 1G SFP/RJ45 combo (2) | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-400r_022726, Table 3 p.6 (I/O : 1G RJ45 PoE (4)), budget non publie |
| Ports de gestion (mgmt) | Management Console Port RJ45 (1), USB Port for bootstrapping (1), 1G Management Port (1), micro USB Console Port (1) | strata_ds_pa-400r_022726, Table 3 p.6 (Management I/O) |
| Format (f) | 1U durci | strata_ds_pa-400r_022726, Table 3 p.7 (Dimensions), Table 4 p.8 (DIN clip, wall et pole mount) |
| Stockage (disk) | 128 GB | strata_ds_pa-400r_022726, Table 3 p.6 (Storage Capacity) |
| Alimentation (psu) | 12-48 VDC natif, adaptateur AC en option | strata_ds_pa-400r_022726, Table 3 p.7 (Input Voltage) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-400r_022726, Highlights p.1 (fanless) et Table 3 p.7 (Passive cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-400r_022726, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400r-hardware-reference/pa-400r-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-400r_022726, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400r-hardware-reference/pa-400r-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-400r_022726, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400r-hardware-reference/pa-400r-firewall-overview |
| Ports HA dedies (haPorts) | Aucun port HA dédié : ports de données configurés en HA1/HA2 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support (PA-450R, PA-455R-5G : aucun) ; non publie pour les autres |
| 5G Security (m5g) | *non publie* | strata_ds_pa-400r_022726, aucune section Mobile Network Infrastructure |
| GlobalProtect | *non publie* | strata_ds_pa-400r_022726, GlobalProtect non mentionne par la datasheet 02/2026 |
| Reference (sku) | PAN-PA-450R | Table 4 p.8 ; PA-455R-5G : catalogue officiel Palo Alto (liste de references, colonne SKU) |
| PAN-OS minimal (panosMin) | 11.1 | https://docs.paloaltonetworks.com/pan-os/11-1/pan-os-release-notes/features-introduced-in-pan-os/hardware-features ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-400r_022726, Table 1 p.5 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-450R-5G (PA-400R)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-400r-series (`strata_ds_pa-400r_022726`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 3.2 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Threat Prevention appmix (tp, Gbps) | 1.7 | strata_ds_pa-400r_022726, Table 1 p.5 |
| IPsec VPN (vpn, Gbps) | 1.3 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Sessions max (sess) | 200000 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Nouvelles sessions/s (cps) | 48000 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Systemes virtuels base/max (vsys) | 1 / 2 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Cuivre RJ45 1G (rj45) | 6 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| Combo SFP/RJ45 1G (combo) | 2 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| Libelle I/O (io) | Integrated 5G (DSSS, Dual SIM Single Standby), 1G RJ45 (6), 1G SFP/RJ45 combo (2) | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-400r_022726, Table 3 p.6 (I/O : 1G RJ45 PoE (4)), budget non publie |
| Ports de gestion (mgmt) | Management Console Port RJ45 (1), USB Port for bootstrapping (1), 1G Management Port (1), micro USB Console Port (1) | strata_ds_pa-400r_022726, Table 3 p.6 (Management I/O) |
| Format (f) | 1U durci | strata_ds_pa-400r_022726, Table 3 p.7 (Dimensions), Table 4 p.8 (DIN clip, wall et pole mount) |
| Stockage (disk) | 128 GB | strata_ds_pa-400r_022726, Table 3 p.6 (Storage Capacity) |
| Alimentation (psu) | 12-48 VDC natif, adaptateur AC en option | strata_ds_pa-400r_022726, Table 3 p.7 (Input Voltage) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-400r_022726, Highlights p.1 (fanless) et Table 3 p.7 (Passive cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-400r_022726, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400r-hardware-reference/pa-400r-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-400r_022726, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400r-hardware-reference/pa-400r-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-400r_022726, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400r-hardware-reference/pa-400r-firewall-overview |
| Ports HA dedies (haPorts) | *non publie* | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support (PA-450R, PA-455R-5G : aucun) ; non publie pour les autres |
| 5G Security (m5g) | *non publie* | strata_ds_pa-400r_022726, aucune section Mobile Network Infrastructure |
| GlobalProtect | *non publie* | strata_ds_pa-400r_022726, GlobalProtect non mentionne par la datasheet 02/2026 |
| Reference (sku) | PAN-PA-450R-5G | Table 4 p.8 ; PA-455R-5G : catalogue officiel Palo Alto (liste de references, colonne SKU) |
| PAN-OS minimal (panosMin) | 11.1 | https://docs.paloaltonetworks.com/pan-os/11-1/pan-os-release-notes/features-introduced-in-pan-os/hardware-features ; https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/palo-alto-networks-next-gen-firewalls |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-400r_022726, Table 1 p.5 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-455R-5G (PA-400R)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-400r-series (`strata_ds_pa-400r_022726`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 3.2 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Threat Prevention appmix (tp, Gbps) | 1.8 | strata_ds_pa-400r_022726, Table 1 p.5 |
| IPsec VPN (vpn, Gbps) | 1.3 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Sessions max (sess) | 200000 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Nouvelles sessions/s (cps) | 48000 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Systemes virtuels base/max (vsys) | 1 / 2 | strata_ds_pa-400r_022726, Table 1 p.5 |
| Cuivre RJ45 1G (rj45) | 10 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| Combo SFP/RJ45 1G (combo) | 2 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| SFP 1G (sfp1) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| Libelle I/O (io) | Integrated 5G (DSSS, Dual SIM Single Standby), 1G RJ45 (6), 1G SFP/RJ45 combo (2), 1G RJ45 PoE (4) | strata_ds_pa-400r_022726, Table 3 p.6 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | oui / 4 / *non publie* | strata_ds_pa-400r_022726, Table 3 p.6 (I/O : 1G RJ45 PoE (4)), budget non publie |
| Ports de gestion (mgmt) | Management Console Port RJ45 (1), USB Port for bootstrapping (1), 1G Management Port (1) | strata_ds_pa-400r_022726, Table 3 p.6 (Management I/O) |
| Format (f) | Mural durci | strata_ds_pa-400r_022726, Table 3 p.7 (Dimensions), Table 4 p.8 (DIN clip, wall et pole mount) |
| Stockage (disk) | 128 GB | strata_ds_pa-400r_022726, Table 3 p.6 (Storage Capacity) |
| Alimentation (psu) | 100-240 VAC | strata_ds_pa-400r_022726, Table 3 p.7 (Input Voltage) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-400r_022726, Highlights p.1 (fanless) et Table 3 p.7 (Passive cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-400r_022726, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400r-hardware-reference/pa-400r-firewall-overview |
| HA actif/actif classique (haAA) | oui | strata_ds_pa-400r_022726, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400r-hardware-reference/pa-400r-firewall-overview |
| Clustering (haCl) | *non publie* | strata_ds_pa-400r_022726, Highlights p.1 ; https://docs.paloaltonetworks.com/hardware/pa-400r-hardware-reference/pa-400r-firewall-overview |
| Ports HA dedies (haPorts) | Aucun port HA dédié : ports de données configurés en HA1/HA2 | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support (PA-450R, PA-455R-5G : aucun) ; non publie pour les autres |
| 5G Security (m5g) | *non publie* | strata_ds_pa-400r_022726, aucune section Mobile Network Infrastructure |
| GlobalProtect | *non publie* | strata_ds_pa-400r_022726, GlobalProtect non mentionne par la datasheet 02/2026 |
| Reference (sku) | PAN-PA-455R-5G | Table 4 p.8 ; PA-455R-5G : catalogue officiel Palo Alto (liste de references, colonne SKU) |
| PAN-OS minimal (panosMin) | 12.1.2 | https://docs.paloaltonetworks.com/ngfw/release-notes/12-1/features-introduced-in-pan-os/hardware-features |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.1 | strata_ds_pa-400r_022726, Table 1 p.5 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-52R-5G (PA-50R)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-50r-series (`strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 2 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| Threat Prevention appmix (tp, Gbps) | 1 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| IPsec VPN (vpn, Gbps) | 0.8 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| Sessions max (sess) | 64000 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| Nouvelles sessions/s (cps) | 2000 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| Systemes virtuels base/max (vsys) | 1 / 2 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| Cuivre RJ45 1G (rj45) | 8 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| SFP 1G (sfp1) | 2 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| Libelle I/O (io) | Cellular: Dual SIM, Single Modem (RedCap), RJ-45: 8 x 1G, SFP: 2 x 1G, VIMS: Yes | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | non / 0 / *non publie* | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, nom des modeles ; ports PoE et budget non publies |
| Ports de gestion (mgmt) | Console: RJ-45 (1), Bootstrap: USB 3.0, Management: 1 Gb (1) | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (Management I/O) |
| Format (f) | 1U durci / DIN | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (Mount Options and Dimensions) |
| Stockage (disk) | 128 GB (écrit 128 Gb) | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (Storage Capacity : « 128 Gb ») |
| Alimentation (psu) | 12-48 VDC, AC 100-240 VAC en option | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (Input Voltage), Tables 5 a 7 p.8-9 (modules d'alimentation) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.8 (Passive cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 3 p.6 (High Availability and Clustering) et p.4 |
| HA actif/actif classique (haAA) | *non publie* | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 3 p.6 (High Availability and Clustering) et p.4 |
| Clustering (haCl) | NGFW clustering actif/actif, nombre de membres non publié | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 3 p.6 (High Availability and Clustering) et p.4 |
| Ports HA dedies (haPorts) | Aucun port HA dédié | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support (aucun) |
| 5G Security (m5g) | oui | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 3 p.6 (Mobile Network Infrastructure) |
| GlobalProtect | oui | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 3 p.6 |
| Reference (sku) | *non publie* | Tables 5 a 7 p.8-9 : accessoires seulement |
| PAN-OS minimal (panosMin) | 12.2.2 | https://docs.paloaltonetworks.com/hardware/pa-50r-hardware-reference/pa-50r-series-firewall-overview (First Supported PAN-OS release) |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-54R-POE-D-5G (PA-50R)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-50r-series (`strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 3 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| Threat Prevention appmix (tp, Gbps) | 1.6 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| IPsec VPN (vpn, Gbps) | 1.2 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| Sessions max (sess) | 200000 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| Nouvelles sessions/s (cps) | 5000 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| Systemes virtuels base/max (vsys) | 1 / 5 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| Cuivre RJ45 1G (rj45) | 12 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| SFP 1G (sfp1) | 2 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| Libelle I/O (io) | Cellular: Dual SIM, Dual Modem, RJ-45: 12 x 1G, SFP: 2 x 1G, Digital I/O: 6 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | oui / *non publie* / *non publie* | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, nom des modeles ; ports PoE et budget non publies |
| Ports de gestion (mgmt) | Out-of-band management: 1G/10G SFP+ (2), Console: RJ-45 console port (1), USB-C, Bootstrap: USB 3.2 Gen1 Type A, Log: 10G SFP+ (2) | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (Management I/O) |
| Format (f) | 3U durci | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (Mount Options and Dimensions) |
| Stockage (disk) | 128 GB (écrit 128 Gb) | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (Storage Capacity : « 128 Gb ») |
| Alimentation (psu) | 12-48 VDC, AC 100-240 VAC en option (modules basse tension, haute tension, véhicule ou adaptateur AC) | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (Input Voltage), Tables 5 a 7 p.8-9 (modules d'alimentation) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.8 (Passive cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 3 p.6 (High Availability and Clustering) et p.4 |
| HA actif/actif classique (haAA) | *non publie* | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 3 p.6 (High Availability and Clustering) et p.4 |
| Clustering (haCl) | NGFW clustering actif/actif, nombre de membres non publié | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 3 p.6 (High Availability and Clustering) et p.4 |
| Ports HA dedies (haPorts) | Aucun port HA dédié | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support (aucun) |
| 5G Security (m5g) | oui | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 3 p.6 (Mobile Network Infrastructure) |
| GlobalProtect | oui | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 3 p.6 |
| Reference (sku) | *non publie* | Tables 5 a 7 p.8-9 : accessoires seulement |
| PAN-OS minimal (panosMin) | 12.2.2 | https://docs.paloaltonetworks.com/hardware/pa-50r-hardware-reference/pa-50r-series-firewall-overview (First Supported PAN-OS release) |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-54R-POE (PA-50R)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-50r-series (`strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 3 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| Threat Prevention appmix (tp, Gbps) | 1.6 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| IPsec VPN (vpn, Gbps) | 1.2 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| Sessions max (sess) | 200000 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| Nouvelles sessions/s (cps) | 5000 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| Systemes virtuels base/max (vsys) | 1 / 5 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| Cuivre RJ45 1G (rj45) | 12 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| SFP 1G (sfp1) | 2 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| Libelle I/O (io) | Cellular: N/A, RJ-45: 12 x 1G, SFP: 2 x 1G, Digital I/O: 6 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | oui / *non publie* / *non publie* | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, nom des modeles ; ports PoE et budget non publies |
| Ports de gestion (mgmt) | Out-of-band management: 1G/10G SFP+ (2), Console: RJ-45 console port (1), USB-C, Bootstrap: USB 3.2 Gen1 Type A, Log: 10G SFP+ (2) | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (Management I/O) |
| Format (f) | 3U durci | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (Mount Options and Dimensions) |
| Stockage (disk) | 128 GB (écrit 128 Gb) | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (Storage Capacity : « 128 Gb ») |
| Alimentation (psu) | 12-48 VDC, AC 100-240 VAC en option (modules basse tension, haute tension, véhicule ou adaptateur AC) | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (Input Voltage), Tables 5 a 7 p.8-9 (modules d'alimentation) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.8 (Passive cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 3 p.6 (High Availability and Clustering) et p.4 |
| HA actif/actif classique (haAA) | *non publie* | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 3 p.6 (High Availability and Clustering) et p.4 |
| Clustering (haCl) | NGFW clustering actif/actif, nombre de membres non publié | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 3 p.6 (High Availability and Clustering) et p.4 |
| Ports HA dedies (haPorts) | Aucun port HA dédié | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support (aucun) |
| 5G Security (m5g) | oui | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 3 p.6 (Mobile Network Infrastructure) |
| GlobalProtect | oui | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 3 p.6 |
| Reference (sku) | *non publie* | Tables 5 a 7 p.8-9 : accessoires seulement |
| PAN-OS minimal (panosMin) | 12.2.2 | https://docs.paloaltonetworks.com/hardware/pa-50r-hardware-reference/pa-50r-series-firewall-overview (First Supported PAN-OS release) |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |

### PA-56R-POE-5G (PA-50R)

Datasheet : https://www.paloaltonetworks.com/resources/datasheets/pa-50r-series (`strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726`)

| Champ | Valeur | Source |
| --- | --- | --- |
| Debit firewall appmix (fw, Gbps) | 4 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| Threat Prevention appmix (tp, Gbps) | 2.4 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| IPsec VPN (vpn, Gbps) | 1.9 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| Sessions max (sess) | 200000 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| Nouvelles sessions/s (cps) | 5000 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| Systemes virtuels base/max (vsys) | 1 / 5 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 |
| Cuivre RJ45 1G (rj45) | 16 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| Cuivre multi-gig (mgig, mgigSp) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| Combo SFP/RJ45 1G (combo) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| SFP 1G (sfp1) | 2 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| SFP+ 10G (sfp10) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| SFP28 25G (sfp25) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| QSFP28 100G (sfp100) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| SFP-DD 100G (sfpdd) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| QSFP-DD 400G (sfp400) | 0 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| Libelle I/O (io) | Cellular: Dual SIM, Single Modem, RJ-45: 16 x 1G, SFP: 2 x 1G, Digital I/O: 6 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (I/O) |
| PoE (poe) / ports PoE (poeP) / budget (poeW) | oui / *non publie* / *non publie* | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, nom des modeles ; ports PoE et budget non publies |
| Ports de gestion (mgmt) | Out-of-band management: 1G/10G SFP+ (2), Console: RJ-45 console port (1), USB-C, Bootstrap: USB 3.2 Gen1 Type A, Log: 10G SFP+ (2) | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (Management I/O) |
| Format (f) | 2U durci | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (Mount Options and Dimensions) |
| Stockage (disk) | 128 GB (écrit 128 Gb) | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (Storage Capacity : « 128 Gb ») |
| Alimentation (psu) | 12-48 VDC, AC 100-240 VAC en option (modules basse tension, haute tension, ou adaptateur AC) | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.7 (Input Voltage), Tables 5 a 7 p.8-9 (modules d'alimentation) |
| Refroidissement (cool) | Passive (sans ventilateur) | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 4 p.8 (Passive cooling) |
| HA actif/passif (haAP) | oui | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 3 p.6 (High Availability and Clustering) et p.4 |
| HA actif/actif classique (haAA) | *non publie* | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 3 p.6 (High Availability and Clustering) et p.4 |
| Clustering (haCl) | NGFW clustering actif/actif, nombre de membres non publié | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 3 p.6 (High Availability and Clustering) et p.4 |
| Ports HA dedies (haPorts) | Aucun port HA dédié | https://docs.paloaltonetworks.com/compatibility-matrix/reference/supported-os-releases-by-model/ha-port-and-processor-support (aucun) |
| 5G Security (m5g) | oui | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 3 p.6 (Mobile Network Infrastructure) |
| GlobalProtect | oui | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 3 p.6 |
| Reference (sku) | *non publie* | Tables 5 a 7 p.8-9 : accessoires seulement |
| PAN-OS minimal (panosMin) | 12.2.2 | https://docs.paloaltonetworks.com/hardware/pa-50r-hardware-reference/pa-50r-series-firewall-overview (First Supported PAN-OS release) |
| Dernier PAN-OS (panosMax) | *non publie* | non publie (aucune annonce de fin de vie) |
| End of Sale / End of Life (eosD / eolD, eos) | *non publie* / *non publie*, eos non | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates (modele absent) |
| PAN-OS des mesures (dsOs) | 12.2 | strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726, Table 1 p.5 (Note) |
| Capacites (gp, zones, policies, ipsec, ssl, addr, nat, sdwanT, sdwanR, secProf) | - / - / - / - / - / - / - / - / - / - | non publiees |
