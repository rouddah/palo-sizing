# Audit des datasheets PA-Series - 5 novembre 2026

Chaque modele de `data/pa-models.js` a ete recompare a la datasheet
officielle Palo Alto Networks en ligne le 5 novembre 2026. Les PDF ont ete
telecharges depuis paloaltonetworks.com et lus table par table ; ils ne
sont pas publies avec le depot.

Champs compares pour chaque modele : debit firewall (appmix), debit
Threat Prevention, debit VPN IPsec, sessions concurrentes, nouvelles
sessions par seconde, systemes virtuels (base/max), interfaces par type
(cuivre, SFP, SFP+, SFP28, QSFP28, QSFP-DD), PoE et budget PoE, HA
active/active, fonction 5G / GTP / SCTP Security, format, reference
chassis, version de PAN-OS des mesures. Le stockage, les alimentations
et la consommation ne sont pas des champs du site : ils ont ete lus pour
le controle de coherence, pas reportes.

## Editions consultees

| Serie | URL de la datasheet | Edition (code de pied de page) | PDF cree le | PAN-OS des mesures |
| --- | --- | --- | --- | --- |
| PA-400 | https://www.paloaltonetworks.com/resources/datasheets/pa-400-series | `strata_ds_pa-400-series_022326` | 23/02/2026 | 12.1 |
| PA-400R | https://www.paloaltonetworks.com/resources/datasheets/pa-400r-series | `strata_ds_pa-400r_022726` | 27/02/2026 | 12.1 |
| PA-500 | https://www.paloaltonetworks.com/resources/datasheets/pa-500-series | `strata_ds_pa-500-series_082026` | 20/08/2026 | 12.2 |
| PA-50R | https://www.paloaltonetworks.com/resources/datasheets/pa-50r-series | `strata_ds_pa-50r-series-ruggedized-5g-enabled-ngfws_091726` | 17/09/2026 | 12.2 |
| PA-1400 | https://www.paloaltonetworks.com/resources/datasheets/pa-1400-series | `strata_ds_pa-1400-series_012726` | 27/01/2026 | 12.1 |
| PA-1500 | https://www.paloaltonetworks.com/resources/datasheets/pa-1500-series | `strata_ds_pa-1500-series-quantum-optimized-ngfws_091126` | 21/09/2026 | 12.2 |
| PA-3400 | https://www.paloaltonetworks.com/resources/datasheets/pa-3400-series | `strata_ds_pa-3400-series_021126` | 13/02/2026 | 12.1 |
| PA-3500 | https://www.paloaltonetworks.com/resources/datasheets/pa-3500-series | `strata_ds_pa-3500-series-quantum-optimized-ngfws_102026` | 20/10/2026 | 12.2 |
| PA-5400 | https://www.paloaltonetworks.com/resources/datasheets/pa-5400-series | `strata_ds_pa-5400-series_041426` | 14/04/2026 | 12.1 |
| PA-5500 | https://www.paloaltonetworks.com/resources/datasheets/pa-5500-series | `strata_ds_pa-5500-series_081926` | 23/09/2026 | 12.2 |
| PA-7500 | https://www.paloaltonetworks.com/resources/datasheets/pa-7500 | `strata_ds_pa-7500_031126` | 11/03/2026 | 11.1 |
| EoS / EoL | https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates | page web | lue le 05/11/2026 | - |

PA-800 et PA-7000 : series End of Sale, datasheets retirees, non
recontrolables (inchange depuis aout 2026).

Trois editions sont posterieures au releve du 21 aout 2026 et changent
des chiffres : PA-1500 (septembre), PA-5500 (septembre), PA-3500
(octobre). La PA-50R a ete reeditee en septembre sans changement de
chiffres.

## Synthese

- **8 valeurs TBD resolues** : VPN IPsec et CPS des PA-3500 et des
  PA-5510 a PA-5530. Plus aucun modele n'a de VPN ou de CPS nul.
- **13 references chassis publiees** et renseignees (PA-1500, PA-3500,
  PA-5510 a PA-5530), plus 4 pour la PA-400R ajoutee.
- **2 comptes de ports faux** : SFP28 des PA-3530 et PA-3540.
- **15 drapeaux HA active/active faux** : PA-400, PA-1400 et PA-50R.
- **3 drapeaux 5G Security** revus : un ajoute, deux retires faute de
  source.
- **5 modeles ajoutes** : serie PA-400R. 54 modeles, 12 series devient
  **59 modeles, 13 series**.
- Aucun ecart sur les debits firewall et Threat Prevention, les
  sessions et les systemes virtuels des 54 modeles existants.

## Detail par serie

### PA-400 (PA-410, PA-415, PA-415-5G, PA-440, PA-445, PA-450, PA-455, PA-455-5G, PA-460)

Verifie : debits FW / TP / VPN, sessions, CPS, vsys, ports (combo
SFP/RJ45 comptes en SFP), budget PoE, 5G Security.

| Champ | Ancienne valeur | Nouvelle valeur | Source |
| --- | --- | --- | --- |
| `haAA`, les neuf modeles | false | true | « Supports high availability with active/active and active/passive modes » |

Aucun autre ecart. Contradiction interne relevee sur le budget PoE du
PA-455-5G (91 W dans le bloc PoE, 151 W dans la table d'alimentation) :
le site garde 151 W, voir `_to_verify.md`.

Hors datasheet : la page End of Life annonce l'End of Sale de sept
modeles PA-400 au 22 mars 2027 (pas les deux -5G). Drapeau `eos` non
pose, date non atteinte : arbitrage dans `_to_verify.md`.

### PA-500 (PA-501, PA-505, PA-510, PA-520, PA-520-5G, PA-540, PA-545-POE, PA-550, PA-555-POE, PA-560)

Verifie : debits, sessions, CPS, vsys (« -- » pour les quatre premiers),
ports (y compris ports bypass), budgets PoE 181 W et 330 W, HA.

| Champ | Ancienne valeur | Nouvelle valeur | Source |
| --- | --- | --- | --- |
| `m5g`, PA-520-5G | true | nul (non publie) | aucune section Mobile Network Infrastructure dans la datasheet ; le modem 5G n'est pas la fonction 5G Security |

Non publie : reference chassis du PA-520-5G (la Table 4 ne liste que des
accessoires).

### PA-1400 (PA-1410, PA-1420)

Verifie : debits, sessions, CPS, vsys, ports, budget PoE 151 W.

| Champ | Ancienne valeur | Nouvelle valeur | Source |
| --- | --- | --- | --- |
| `haAA`, PA-1410 et PA-1420 | false | true | Table 2, High Availability : « Modes: active/active, active/passive » |

Statut EoS tranche : la PA-1400 n'apparait sur la page EoL que comme
remplacement de l'ION 9000. Serie active.

### PA-1500 (PA-1510-POE, PA-1520-POE, PA-1530-POE)

Verifie : debits, sessions, CPS, vsys, ports (20 cuivre, SFP, SFP+,
SFP28), budgets PoE 485 / 545 / 724 W, HA, 5G Security.

| Champ | Ancienne valeur | Nouvelle valeur | Source |
| --- | --- | --- | --- |
| `sku`, PA-1510-POE | nul | `PAN-PA-1510-POE` | Table 4, Ordering Information |
| `sku`, PA-1520-POE | nul | `PAN-PA-1520-POE` | Table 4 |
| `sku`, PA-1530-POE | nul | `PAN-PA-1530-POE` | Table 4 |

### PA-3400 (PA-3410, PA-3420, PA-3430, PA-3440)

Verifie : debits, sessions, CPS, vsys, ports, 5G Security limitee aux
PA-3430 et PA-3440. Aucun ecart.

### PA-3500 (PA-3510, PA-3520, PA-3530, PA-3540)

Verifie : tous les champs de performance, vsys, ports, HA, 5G Security.

| Champ | Ancienne valeur | Nouvelle valeur | Source |
| --- | --- | --- | --- |
| `vpn`, PA-3510 / 3520 / 3530 / 3540 | nul (TBD) | 13 / 15 / 22 / 36 Gbps | Table 1 |
| `cps`, PA-3510 / 3520 / 3530 / 3540 | nul (TBD) | 325 000 / 350 000 / 500 000 / 550 000 | Table 1 |
| `sfp25`, PA-3530 et PA-3540 | 6 | 8 | Table 3 : « 10G/25G SFP28 (8) » |
| `sku`, les quatre modeles | nul | `PAN-PA-3510` a `PAN-PA-3540` | Table 4 |

### PA-5400 (PA-5410, PA-5420, PA-5430, PA-5440, PA-5445)

Verifie : debits, sessions, CPS, vsys, ports, 5G / GTP / SCTP Security.
Aucun ecart.

### PA-5500 (PA-5510 a PA-5580)

Verifie : tous les champs de performance des huit modeles, vsys, ports
des trois sous-familles, HA, 5G Security, references.

| Champ | Ancienne valeur | Nouvelle valeur | Source |
| --- | --- | --- | --- |
| `vpn`, PA-5510 / 5520 / 5530 | nul (TBD) | 34 / 36 / 38 Gbps | Table 1 |
| `cps`, PA-5510 / 5520 / 5530 | nul (TBD) | 600 000 / 971 000 / 1 010 000 | Table 1 |
| `sku`, PA-5510 / 5520 / 5530 | nul | `PAN-PA-5510-AC` / `-5520-AC` / `-5530-AC` (variantes `-DC` publiees aussi) | Table 4 |

Toujours TBD dans la datasheet, sans champ correspondant sur le site :
consommation, BTU/h, courant d'appel et MTBF des PA-5510 a PA-5530.

### PA-7500

Verifie : debits, sessions, CPS, vsys pour la configuration de reference
6 DPC-A + 2 NPC-A, ports (2 NPC-A x 8 QSFP-DD et 12 SFP-DD).

| Champ | Ancienne valeur | Nouvelle valeur | Source |
| --- | --- | --- | --- |
| `m5g` | true | nul (non publie) | aucune section Mobile Network Infrastructure dans la datasheet |

Non publiee par la datasheet : la reference `PAN-PA-7500` (seule la
carte `PAN-PA-7500-SFC-A` y figure). Conservee.

### PA-50R (PA-52R-5G, PA-54R-POE-D-5G, PA-54R-POE, PA-56R-POE-5G)

Verifie : debits, sessions, CPS, vsys, ports, cellulaire, formats.

| Champ | Ancienne valeur | Nouvelle valeur | Source |
| --- | --- | --- | --- |
| `haAA`, les quatre modeles | false | true | Table 3 : « NGFW clustering with active/active. HA active/passive. » (formulation identique a PA-3500 et PA-5500) |
| `m5g`, PA-54R-POE | false | true | Table 3, Mobile Network Infrastructure : « Palo Alto Networks 5G-Native Security », pour toute la serie |

Toujours non publies : references chassis (accessoires seulement), budget
PoE. La contradiction de nom PA-54R-POE / PA-54R-POE-5G demeure.

### PA-800, PA-7000

Non recontrolees : datasheets retirees. Valeurs inchangees.

## Modeles ajoutes : serie PA-400R

Datasheet PA-400R de fevrier 2026, mesures PAN-OS 12.1. La serie succede
a la PA-220R (End of Sale 31 janvier 2025, remplacement PA-400R d'apres la
page EoL).

| Modele | FW | TP | VPN | Sessions | CPS | Ports | vsys | Reference |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PA-410R | 1,4 Gbps | 650 Mbps | 650 Mbps | 64 000 | 11 400 | RJ45 x4, SFP x2 | 1/2 | `PAN-PA-410R` |
| PA-410R-5G | 1,4 Gbps | 650 Mbps | 650 Mbps | 64 000 | 11 400 | RJ45 x4, SFP x2 | 1/2 | `PAN-PA-410R-5G` |
| PA-450R | 3,2 Gbps | 1,7 Gbps | 1,3 Gbps | 200 000 | 48 000 | RJ45 x6, combo x2 | 1/2 | `PAN-PA-450R` |
| PA-450R-5G | 3,2 Gbps | 1,7 Gbps | 1,3 Gbps | 200 000 | 48 000 | RJ45 x6, combo x2 | 1/2 | `PAN-PA-450R-5G` |
| PA-455R-5G | 3,2 Gbps | 1,8 Gbps | 1,3 Gbps | 200 000 | 48 000 | RJ45 x6, combo x2, RJ45 PoE x4 | 1/2 | non publiee |

HA active/active publiee pour la serie. Pas de section 5G Security. Non
publies : budget PoE du PA-455R-5G, capacites de configuration.

## Modeles non ajoutes

- **PA-5450** : absent du site, End of Sale au 22 novembre 2026 d'apres la
  page EoL (remplacement PA-5500). Non ajoute, sa fin de vente tombe dans
  quinze jours.
- **PA-220R** : End of Sale depuis janvier 2025, datasheet de 2022.

## Valeurs restees non publiees

| Modele | Champ |
| --- | --- |
| PA-520-5G | reference chassis, 5G Security |
| PA-455R-5G | reference chassis, budget PoE |
| PA-52R-5G, PA-54R-POE-D-5G, PA-54R-POE, PA-56R-POE-5G | reference chassis ; budget PoE pour les trois modeles PoE |
| PA-7500 | 5G Security |
| Series ajoutees depuis 2026 et PA-400R | capacites de configuration (zones, politiques, tunnels, objets), que les datasheets 2026 ne publient plus |

## Verification

`npm run data` (59 modeles, 13 series, aucune erreur de coherence),
`npm run check` et `npm test` passent.
