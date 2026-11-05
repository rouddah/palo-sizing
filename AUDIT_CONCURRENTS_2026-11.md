# Audit des donnees concurrentes - novembre 2026

Releve du 5 novembre 2026 pour `data/competitors.js` : 69 boitiers, 29
Fortinet FortiGate, 20 Check Point (6 Spark, 14 Quantum Force), 20 Cisco
(4 Firepower 1000, 16 Secure Firewall). Chaque chiffre a ete relu dans la
datasheet officielle en ligne de l'editeur, dont l'URL et la revision sont
portees par le modele (`ds`, `dsRev`). Aucun prix, aucune reference de
commande ; `id` est une cle interne au site.

## Ce que chaque colonne veut dire, par editeur

Les metriques ne se comparent pas d'un editeur a l'autre. La definition
exacte est dans `vendors[].metrics` et s'affiche sous la carte du modele.

| Champ | Fortinet | Check Point | Cisco |
|---|---|---|---|
| `fw` | IPv4 Firewall, UDP 1518 octets | Firewall 1518B UDP (labo RFC 3511/2544/2647/1242) | FW + AVC, 1024 octets (Threat Defense) |
| `tp` | Threat Protection : FW + IPS + AppCtrl + Malware, Enterprise Mix | Threat Prevention : FW, AppCtrl, URLF, IPS, Anti-Malware, DNS, Zero-Phishing, SandBlast, Enterprise | FW + AVC + IPS, 1024 octets (sans antimalware ni sandbox) |
| `vpn` | IPsec 512 octets, AES256-SHA256 | AES-GCM 1452 octets | IPsec 1024 octets TCP Fastpath, sans offload |
| `sess` | Concurrent Sessions TCP, sans licence Hyperscale | Concurrent connections, configuration Base | Max concurrent sessions with AVC |
| `cps` | New Sessions/Second TCP, sans Hyperscale | Connections/sec | Max new connections/s with AVC |

Choix a connaitre :

- **Check Point** publie deux debits firewall : « Firewall » en Enterprise Test
  Conditions et « Firewall 1518B UDP » en labo. Le site retient le second,
  pour s'aligner sur le profil UDP 1518 de Fortinet. Les valeurs Enterprise
  figurent ci-dessous.
- **Check Point** publie les sessions en Base / Plus / Max selon la memoire.
  Le site retient Base, comme pour les ports. Plus et Max sont ci-dessous.
- **Fortinet** 1800F, 2600F, 3000F, 3000G, 3500F, 3800G, 4200F, 4400F et
  4800F publient un second chiffre de sessions et de CPS « Requires Hyperscale
  Firewall License ». Le site retient le chiffre sans licence.
- **Cisco** ne publie pas de debit firewall brut sous Threat Defense ; les
  chiffres ASA (stateful inspection) relevent d'un autre logiciel et ne sont
  pas repris. Sur les series 3100 et 4200, FW + AVC et FW + AVC + IPS sont
  egaux dans la datasheet.

## Ports

Comptes repris des tableaux d'interfaces, hors management, console, HA et
synchronisation dedies. Classement par format physique : `rj45` cuivre 1G
(multi-gig dans `mgig` depuis le second releve, voir section Materiel), `sfp1` SFP, `sfp10` SFP+, `sfp25` SFP28 et SFP56, `sfp100`
QSFP28 et QSFP56, `sfp400` QSFP-DD. Un port mixte RJ45/SFP est compte une fois,
cote SFP. Le libelle `ports` garde la description exacte (vitesses 2.5G, 5G,
50G, 200G comprises). Chassis Fortinet 7000F : ports nuls, ils dependent des
modules. Check Point Force : configuration Base ; les slots d'extension sont
decrits dans `ports`.

## Fortinet FortiGate (29)

Source : https://www.fortinet.com/products/next-generation-firewall, une
datasheet PDF par serie.

| Modele | Revision | fw | tp | vpn | sess | cps | Format |
|---|---|---|---|---|---|---|---|
| 30G | FGFWF-30G-DAT-R07-20260414 | 4 | 0.5 | 3.5 | 600 000 | 30 000 | Desktop |
| 40F | FG-40F-DAT-R49-20261001 | 5 | 0.6 | 4.4 | 700 000 | 35 000 | Desktop |
| 50G | FGFWF-50G-DAT-R18-20260929 | 5 | 1.1 | 4.5 | 720 000 | 85 000 | Desktop |
| 60F | FG-60F-DAT-R51-20261001 | 10 | 0.7 | 6.5 | 700 000 | 35 000 | Desktop |
| 71F | FG-71F-DAT-R18-20261001 | 10 | 0.8 | 6.1 | 1 500 000 | 35 000 | Desktop |
| 70G | FGFWF-70G-DAT-R10-20260929 | 10 | 1.3 | 7.1 | 1 400 000 | 100 000 | Desktop |
| 80F | FG-80F-DAT-R48-20261001 | 10 | 0.9 | 6.5 | 1 500 000 | 45 000 | Desktop |
| 90G | FG-90G-DAT-R18-20260929 | 28 | 2.2 | 25 | 3 000 000 | 124 000 | Desktop |
| 120G | FG-120G-DAT-R19-20260929 | 39 | 2.8 | 35 | 3 000 000 | 140 000 | 1U |
| 200G | FG-200G-DAT-R12-20260929 | 39 | 6 | 36 | 11 000 000 | 400 000 | 1U |
| 400F | FG-400F-DAT-R23-20261001 | 79.5 | 9 | 55 | 7 800 000 | 500 000 | 1U |
| 400G | FG-400G-DAT-R06-20261013 | 164 | 13 | 55 | 28 000 000 | 580 000 | 1U |
| 700G | FG-700G-DAT-R15-20260929 | 164 | 26 | 55 | 28 000 000 | 700 000 | 1U |
| 900G | FG-900G-DAT-R23-20260929 | 164 | 30 | 55 | 28 000 000 | 720 000 | 1U |
| 1000F | FG-1000F-DAT-R18-20261001 | 198 | 13 | 55 | 7 500 000 | 650 000 | 2U |
| 1800F | FG-1800F-DAT-R47-20260929 | 198 | 15 | 55 | 12 000 000 | 750 000 | 2U |
| 2600F | FG-2600F-DAT-R30-20260929 | 198 | 25 | 55 | 24 000 000 | 1 000 000 | 2U |
| 3000F | FG-3000F-DAT-R27-20260929 | 397 | 33 | 105 | 70 000 000 | 870 000 | 2U |
| 3000G | FG-3000G-DAT-R04-20260929 | 397 | 80 | 105 | 88 000 000 | 1 100 000 | 2U |
| 3200F | FG-3200F-DAT-R21-20260929 | 387 | 45 | 105 | 70 000 000 | 800 000 | 2U |
| 3500F | FG-3500F-DAT-R23-20260929 | 595 | 63 | 165 | 140 000 000 | 1 000 000 | 2U |
| 3500G | FG-3500G-DAT-R03-20260929 | 595 | 105 | 163 | 179 000 000 | 1 100 000 | 2U |
| 3700F | FG-3700F-DAT-R21-20260929 | 589 | 75 | 160 | 140 000 000 | 930 000 | 2U |
| 3800G | FG-3800G-DAT-R06-20260414 | 795 | 200 | 210 | 200 000 000 | 1 110 000 | 3U |
| 4200F | FG-4200F-DAT-R36-20260929 | 800 | 45 | 210 | 210 000 000 | 1 000 000 | 3U |
| 4400F | FG-4400F-DAT-R29-20260929 | 1150 | 75 | 310 | 210 000 000 | 1 000 000 | 4U |
| 4800F | FG-4800F-DAT-R18-20260929 | 3100 | 75 | 800 | 280 000 000 | 915 000 | 4U |
| 7081F | FG-7000F-DAT-R23-20260929 | 1890 | 312 | 378 | 600 000 000 | 5 400 000 | Chassis 12U |
| 7121F | FG-7000F-DAT-R23-20260929 | 1890 | 520 | 630 | 1 000 000 000 | 9 000 000 | Chassis 16U |

Points de lecture :

- La datasheet 70F ne liste plus que le **71F** (avec SSD) : c'est lui qui est
  repris.
- 7081F : performances publiees pour 6 modules FPM ; 7121F pour 10 FPM. Le
  debit firewall publie est identique (1.89 Tbps) pour les deux chassis.
- Les variantes FortiWiFi, -DC, a stockage (x1x), PoE, DSL et 5G ne sont pas
  dupliquees : elles partagent les chiffres du modele de base.

## Check Point (20)

Source : https://www.checkpoint.com/quantum/next-generation-firewall/ et la
page Small Business Firewall, une datasheet PDF par modele (une seule pour la
serie Spark 2500).

| Modele | Date | fw (UDP 1518) | Firewall Enterprise | tp | vpn | sess Base / Plus / Max | cps | Format |
|---|---|---|---|---|---|---|---|---|
| Spark 2530 | 22/07/2026 | 3 | 2.25 | 0.75 | 1.4 | 1 000 000 | 16 000 | Desktop |
| Spark 2550 | 22/07/2026 | 4 | 3 | 1 | 1.4 | 1 000 000 | 20 000 | Desktop |
| Spark 2560 | 22/07/2026 | 11.6 | 6.75 | 1.85 | 4 | 2 000 000 | 53 000 | Desktop |
| Spark 2570 | 22/07/2026 | 15.5 | 9 | 2.5 | 4.5 | 2 000 000 | 62 000 | Desktop |
| Spark 2580 | 22/07/2026 | 20 | 17.5 | 3.2 | 4.5 | 2 000 000 | 72 000 | Desktop |
| Spark 2590 | 22/07/2026 | 25 | 17.5 | 5.5 | 5.5 | 4 000 000 | 75 000 | 430 x 300 x 42,5 mm |
| Force 3920 | 13/07/2026 | 20 | 20 | 3.2 | 9.5 | 2.75 M | 95 000 | Desktop |
| Force 3950 | 22/07/2026 | 20 | 20 | 5.5 | 17.5 | 7.2 M | 130 000 | Desktop |
| Force 3970 | 22/07/2026 | 40 | 40 | 4.25 | 13 | 7.2 M | 140 000 | 1U |
| Force 3980 | 22/07/2026 | 40 | 40 | 7 | 23 | 7.2 M | 195 000 | 1U |
| Force 9100 | 15/07/2026 | 80 | 55 | 6.5 | 22.1 | 2.75 / 7.27 / 16.2 M | 190 000 | 1U |
| Force 9200 | 15/07/2026 | 80 | 60 | 8 | 28.6 | 2.75 / 7.27 / 16.2 M | 250 000 | 1U |
| Force 9300 | 12/07/2026 | 80.2 | 70 | 10.5 | 33 | 2.75 / 7.27 / 16.2 M | 300 000 | 1U |
| Force 9400 | 12/07/2026 | 200 | 72.6 | 14 | 40 | 2.75 / 7.27 / 16.2 M | 355 000 | 1U |
| Force 9700 | 08/07/2026 | 400 | 129 | 20 | 75 | 6.5 / 15 / 29 M | 535 000 | 1U |
| Force 9800 | 12/07/2026 | 400 | 185 | 25 | 75 | 7 / 15 / 29 M | 715 000 | 1U |
| Force 19100 | 08/07/2026 | 800 | 200 | 35 | 75.3 | 12.4 / 20 / 31 M | 750 000 | 2U |
| Force 19200 | 08/07/2026 | 800 | 245 | 44 | 86 | 21 / 31 / 31 M | 1 000 000 | 2U |
| Force 29100 | 08/07/2026 | 1400 | 365 | 60 | 103 | 30 / 48 / 67 M | 1 250 000 | 2U |
| Force 29200 | 08/07/2026 | 1400 | 500 | 75 | 130 | 30 / 48 / 67 M | 1 500 000 | 2U |

Points de lecture :

- Ports de la configuration Base, d'apres la phrase de commande de la
  datasheet. Les tableaux RJ45 des 9100 a 9800 incluent management et
  synchronisation (note de la datasheet) : ils sont retires du compte.
- Spark 2590 : la datasheet donne les dimensions (430 x 300 x 42,5 mm) sans
  nommer le format ; le champ `f` reprend ces dimensions plutot qu'un « 1U »
  qui ne serait pas ecrit.
- Spark 2530 a 2570 existent en versions Wi-Fi et 5G ; les chiffres sont ceux
  du tableau commun.

## Cisco (20)

Source : https://www.cisco.com/site/us/en/products/security/firewalls/index.html,
une datasheet HTML par serie, logiciel Threat Defense.

| Modele | Datasheet | fw | tp | vpn | sess | cps | Format |
|---|---|---|---|---|---|---|---|
| Firepower 1010 | 23/10/2023 | 0.89 | 0.88 | 0.4 | 100 000 | 6 000 | Desktop |
| Firepower 1120 | 23/10/2023 | 2.3 | 2.3 | 1.2 | 200 000 | 15 000 | 1U |
| Firepower 1140 | 23/10/2023 | 3.3 | 3.3 | 1.4 | 400 000 | 22 000 | 1U |
| Firepower 1150 | 23/10/2023 | 5.3 | 4.9 | 2.4 | 600 000 | 28 000 | 1U |
| SF 1210CE | 09/07/2025 | 6 | 6 | 5 | 200 000 | 35 000 | Desktop |
| SF 1210CP | 09/07/2025 | 6 | 6 | 5 | 200 000 | 35 000 | Desktop |
| SF 1220CX | 09/07/2025 | 9 | 9 | 10 | 300 000 | 50 000 | Desktop |
| SF 1230 | 09/07/2025 | 13 | 9 | 13 | 400 000 | 50 000 | 1U |
| SF 1240 | 09/07/2025 | 18 | 12 | 18 | 600 000 | 70 000 | 1U |
| SF 1250 | 09/07/2025 | 24 | 18 | 22 | 1 000 000 | 100 000 | 1U |
| SF 3105 | 06/10/2026 | 10 | 10 | 5.5 | 1 500 000 | 90 000 | 1U |
| SF 3110 | 06/10/2026 | 17 | 17 | 8 | 2 000 000 | 130 000 | 1U |
| SF 3120 | 06/10/2026 | 21 | 21 | 10 | 4 000 000 | 170 000 | 1U |
| SF 3130 | 06/10/2026 | 38 | 38 | 17.8 | 6 000 000 | 240 000 | 1U |
| SF 3140 | 06/10/2026 | 45 | 45 | 22.4 | 10 000 000 | 300 000 | 1U |
| SF 4215 | 29/10/2024 | 65 | 65 | 45 | 15 000 000 | 350 000 | 1U |
| SF 4225 | 29/10/2024 | 80 | 80 | 80 | 30 000 000 | 600 000 | 1U |
| SF 4245 | 29/10/2024 | 140 | 140 | 140 | 60 000 000 | 800 000 | 1U |
| SF 6160 | 15/10/2026 | 600 | 550 | 450 | 75 000 000 | 1 500 000 | 2U |
| SF 6170 | 15/10/2026 | 700 | 600 | 550 | 120 000 000 | 2 700 000 | 2U |

Points de lecture :

- 1200 : le tableau de synthese en tete de datasheet ne concorde pas toujours
  avec le tableau de performances (1230 : IPS 13 Gbps en synthese, NGIPS 11
  Gbps dans le detail). Le site reprend le tableau de performances detaille.
- 6100 : la ligne tp s'intitule « AVC + IPS (1024B) » dans la datasheet.
- Firepower 1010 et 1010E partagent une colonne ; la 1010 a 2 ports PoE+.
- 4200 : le tableau de synthese donne aussi une colonne « Firewall » (90, 95,
  180 Gbps) sans profil precise ; elle n'est pas reprise.

## Modeles ecartes

| Modele | Raison |
|---|---|
| FortiGate 1200G | Seule une brochure produit existe, chiffres annonces « Target performance, subject to final values ». Pas de datasheet. |
| FortiGate 600F, 6000F | Absents de la gamme NGFW publiee sur fortinet.com, aucune datasheet en ligne au releve. |
| FortiGate 70F (sans SSD), 100F, 200F | Absents de la gamme publiee ; la datasheet 70F ne liste plus que le 71F. |
| FortiGate Rugged, FortiWiFi | Hors perimetre (durcis, Wi-Fi) ; les FortiWiFi partagent les chiffres des FortiGate. |
| Check Point Spark 1500 a 2000, Quantum 16000/26000/28000 | Plus listes sur checkpoint.com ; seules la serie Spark 2500 et les Force y figurent. |
| Cisco Secure Firewall 6120, 6130 | La datasheet ne les chiffre qu'en ASA, pas en Threat Defense : pas de valeurs comparables aux autres Cisco. |
| Cisco Firepower 4100, 9300 | Generation precedente, hors gamme Secure Firewall listee. |

Aucun modele n'est marque `eos:true` : aucun avis End of Sale n'a ete trouve
pour les boitiers retenus. La datasheet Firepower 1000 n'a pas ete revue
depuis octobre 2023 et la serie 1200 lui succede ; elle reste en vente sur
cisco.com, mais c'est le premier candidat a verifier au prochain releve.

## Valeurs non publiees

- Toutes les metriques de performance sont publiees pour les 69 modeles :
  aucun `fw`, `tp`, `vpn`, `sess` ou `cps` nul.
- Ports nuls (null) sur les chassis FortiGate 7081F et 7121F : ils dependent
  des modules.
- Les champs PA propres au site (GlobalProtect, zones, politiques, SKU,
  vsys) ne sont pas fournis pour les concurrents. PoE, multi-gig, HA et
  alimentation le sont depuis le second releve (section Materiel ci-dessous).

## Controles

- `node -e "require('./data/competitors.js')"` : charge sans erreur, 69
  modeles, ids uniques, chaque modele a `ds` et `dsRev`, aucun zero sur les
  performances, `tp <= fw` partout, sessions et CPS entiers.
- `node _check.js` : aucune regression. `_data-audit.js` ne lit que les
  donnees PA et n'a pas ete modifie.
- Fichier en LF, sans em-dash.

## Methode

Datasheets Fortinet telechargees en PDF et lues apres extraction texte.
Datasheets Check Point lues dans le navigateur (le site refuse les
telechargements hors navigateur) : extraction du texte du PDF dans la page,
puis lecture visuelle des tableaux quand l'extraction melangeait les
colonnes (19100, Spark 2500). Datasheets Cisco lues dans leur page HTML,
tableau par tableau.

## Materiel : multi-gig, PoE, haute disponibilite, alimentation (5 novembre 2026, second releve)

Les 69 boitiers ont ete releves au meme niveau de detail que les PA, dans la
meme datasheet que leurs performances (`ds`, revision `dsRev` inchangee).
Regle identique : non publie = null, jamais estime ; chaque valeur porte sa
source dans `hwSrc` (page ou tableau et ligne), et le texte HA de la
datasheet est dans `haNote`. Ces champs s'affichent dans le comparateur
(vues Tableau et Comparaison, et fiche imprimable) ; ils n'entrent dans
aucun ecart, barre, maximum ni dans l'etabli.

Changement de convention : `rj45` ne compte plus que le cuivre 1G, comme
pour les PA. Le cuivre 2.5G, 5G et 10GBASE-T passe dans `mgig`, vitesses
ecrites dans `mgigSp`. rj45 + mgig egale l'ancien rj45 sur les 67 modeles a
ports fixes (controle fait a la fusion). Les ports mixtes RJ45/SFP restent
comptes une fois cote SFP (FortiGate 80F, 90G, Spark 2530 a 2590), pas
dans un champ `combo`.

| Champ | Fortinet (29) | Check Point (20) | Cisco (20) |
|---|---|---|---|
| `mgig` publie / null | 27 / 2 | 20 / 0 | 20 / 0 |
| dont modeles a multi-gig | 6 | 11 | 1 |
| `poeP` publie / null | 4 / 25 | 0 / 20 | 12 / 8 |
| `haAP` publie / null | 29 / 0 | 14 / 6 | 20 / 0 |
| `haAA` publie / null | 29 / 0 | 14 / 6 | 10 / 10 |
| `haCl` publie / null | 28 / 1 | 20 / 0 | 9 / 11 |
| `psuR` publie / null | 23 / 6 | 20 / 0 | 19 / 1 |

Total : 318 valeurs publiees, 96 non publiees, sur 6 champs x 69 modeles
(hors vitesses multi-gig, texte d'alimentation et notes).

Lecture par editeur :

- **Fortinet** : ligne « High Availability Configurations » de chaque
  datasheet. Le nombre de membres du clustering n'est publie nulle part
  (champ libelle « nombre de membres non publie »). 30G : actif/passif et
  actif/actif, pas de clustering. Chassis 7000F : « FGSP (Active-Active) »
  et clustering. PoE : 0 seulement quand la datasheet l'ecrit (40F ligne PoE
  a 0, 50G PoE reserve a la variante SFP-POE, 70G et 80F tiret dans la
  colonne du modele) ; les autres datasheets n'ont pas de ligne PoE, donc
  null. Variantes PoE non dupliquees : 50G-SFP-POE (4 PoE/+ et 1 FortiLink
  PoE+, 60 W), 70G-POE (4, 60 W), 80F-POE (6 + 2 FortiLink, 96 W).
  Alimentation : adaptateur externe sans redondance ecrite sur 30G a 71F
  (null), second adaptateur en option sur 80F et 90G, double alimentation
  de serie a partir du 120G (non hot-swap sur 120G, 200G, 400G, 700G).
- **Check Point** : lu dans le navigateur, page par page. Force : « Active/
  Active L2, Active/Passive L2 and L3 », « ClusterXL or VRRP », sans nombre
  de membres. Spark 2500 : seule la mention « ClusterXL High Availability »
  est publiee, modes non precises, donc A/P et A/A null. Aucune datasheet
  Check Point n'a de ligne PoE : 20 null. Alimentation : colonne « Redundant
  Power » du tableau de commande (Base) pour les 9000, 19000 et 29000 ;
  ligne « Dual Power » pour les Spark (No sur 2530 et 2550, Available sur
  2560 et 2570, Dual power supply commande sur 2580 et 2590). Multi-gig :
  2.5G sur Spark 2580/2590 et Force 3950/3970/3980, 10GbE RJ45 sur 3950,
  colonne « 1/10 GbE Copper » des Force 9100 a 9800 (ports reseau RJ45
  embarques, hors management et synchronisation).
- **Cisco** : logiciel Threat Defense. Un actif/actif publie pour ASA
  seulement (Firepower 1120/1140/1150) reste null, comme les 1200 qui ne
  publient que « active/standby HA pairs ». 3100 : clustering jusqu'a 8
  chassis (pas sur la 3105) ; 4200 et 6100 : jusqu'a 16, actif/actif « with
  clustering ». PoE : 2 PoE+ sur la Firepower 1010, 4 ports 802.3at (120 W)
  sur la 1210CP ; pas de ligne PoE sur les 3100, et la 4200 ne cite pas le
  PoE : null. Secure Firewall 1250 : 8x 2.5GBASE-T, seul multi-gig Cisco.

Contradictions des datasheets, notees dans le champ `psu` :

- Force 3920 : la ligne PSU du tableau p.5 reprend le stockage ; la
  redondance vient de la p.4 (« Dual External AC-DC Adaptors »).
- Force 3970 : « Dual Internal PSUs » p.4, « Dual (External) » p.5.
- Spark 2590 : « Dual internal power supply » a la commande, « External
  Power Supply » dans le tableau.
- FortiGate 3000G : « Hot Swappable, 2+2 » p.8, « 2 AC power supplies » a
  la commande p.10.
- Cisco 4200 : ports fixes « SFP28 » dans le tableau, « SFP+ » dans la
  synthese (le site garde sfp10).

Points ouverts, non modifies faute de seconde lecture :

- FortiGate 3500F (32 SFP28) et 3500G (30 SFP28) : les 2 ports HA semblent
  inclus dans le compte (schema p.7 du 3500F, commande p.10 du 3500G),
  alors que la regle du site les exclut. A recompter au prochain releve.
- Firepower 1120/1140/1150 et 1200 compacts : `psuR` false lu dans « single
  AC input » / « Single input, external power supply », la datasheet ne dit
  pas « non redondante » en toutes lettres.
- Les Spark existent en versions Wi-Fi et 5G, les FortiGate en -DC : ce
  sont les chiffres du modele de base.

Methode : Fortinet, PDF telecharges et lus colonne par colonne
(coordonnees de mots PyMuPDF, pour ne pas melanger deux modeles) ; Check
Point, lecture visuelle dans le navigateur (le site refuse les
telechargements hors navigateur, et l'extraction texte des PDF passe par
des polices sous-ensemble) ; Cisco, tableaux des pages HTML. Controle :
`node _competitors.js` (dans `npm run build`) refuse un modele sans ces
champs, une valeur publiee sans source, un mgig sans vitesses, un em-dash.

### Releve par modele (n.p. = non publie)

### Fortinet

| Modele | RJ45 1G | mGig (vitesses) | PoE | A/P | A/A | Clustering | Redondance alim. |
|---|---|---|---|---|---|---|---|
| FortiGate 30G | 4 | 0 | n.p. | oui | oui | n.p. | n.p. |
| FortiGate 40F | 5 | 0 | 0 | oui | oui | Clustering (nombre de membres non publié) | n.p. |
| FortiGate 50G | 5 | 0 | 0 | oui | oui | Clustering (nombre de membres non publié) | n.p. |
| FortiGate 60F | 10 | 0 | n.p. | oui | oui | Clustering (nombre de membres non publié) | n.p. |
| FortiGate 71F | 10 | 0 | n.p. | oui | oui | Clustering (nombre de membres non publié) | n.p. |
| FortiGate 70G | 10 | 0 | 0 | oui | oui | Clustering (nombre de membres non publié) | n.p. |
| FortiGate 80F | 8 | 0 | 0 | oui | oui | Clustering (nombre de membres non publié) | option |
| FortiGate 90G | 8 | 0 | n.p. | oui | oui | Clustering (nombre de membres non publié) | option |
| FortiGate 120G | 16 | 0 | n.p. | oui | oui | Clustering (nombre de membres non publié) | oui |
| FortiGate 200G | 8 | 8 (5/2.5/GE RJ45) | n.p. | oui | oui | Clustering (nombre de membres non publié) | oui |
| FortiGate 400F | 16 | 0 | n.p. | oui | oui | Clustering (nombre de membres non publié) | oui |
| FortiGate 400G | 0 | 8 (5/2.5/GE RJ45) | n.p. | oui | oui | Clustering (nombre de membres non publié) | oui |
| FortiGate 700G | 8 | 0 | n.p. | oui | oui | Clustering (nombre de membres non publié) | oui |
| FortiGate 900G | 16 | 0 | n.p. | oui | oui | Clustering (nombre de membres non publié) | oui |
| FortiGate 1000F | 0 | 8 (10 GE / 5 GE / 2.5 GE / GE / 100M RJ45) | n.p. | oui | oui | Clustering (nombre de membres non publié) | oui |
| FortiGate 1800F | 16 | 0 | n.p. | oui | oui | Clustering (nombre de membres non publié) | oui |
| FortiGate 2600F | 0 | 16 (10 GE / GE RJ45) | n.p. | oui | oui | Clustering (nombre de membres non publié) | oui |
| FortiGate 3000F | 0 | 16 (10 GE / 5 GE / 2.5 GE / GE RJ45) | n.p. | oui | oui | Clustering (nombre de membres non publié) | oui |
| FortiGate 3000G | 0 | 16 (10 GE / 5 GE / 2.5 GE / GE RJ45) | n.p. | oui | oui | Clustering (nombre de membres non publié) | oui |
| FortiGate 3200F | 0 | 0 | n.p. | oui | oui | Clustering (nombre de membres non publié) | oui |
| FortiGate 3500F | 0 | 0 | n.p. | oui | oui | Clustering (nombre de membres non publié) | oui |
| FortiGate 3500G | 0 | 0 | n.p. | oui | oui | Clustering (nombre de membres non publié) | oui |
| FortiGate 3700F | 0 | 0 | n.p. | oui | oui | Clustering (nombre de membres non publié) | oui |
| FortiGate 3800G | 0 | 0 | n.p. | oui | oui | Clustering (nombre de membres non publié) | oui |
| FortiGate 4200F | 0 | 0 | n.p. | oui | oui | Clustering (nombre de membres non publié) | oui |
| FortiGate 4400F | 0 | 0 | n.p. | oui | oui | Clustering (nombre de membres non publié) | oui |
| FortiGate 4800F | 0 | 0 | n.p. | oui | oui | Clustering (nombre de membres non publié) | oui |
| FortiGate 7081F | n.p. | n.p. | n.p. | oui | oui | FGSP (Active-Active) et Clustering (nombre de membres non publié) | oui |
| FortiGate 7121F | n.p. | n.p. | n.p. | oui | oui | FGSP (Active-Active) et Clustering (nombre de membres non publié) | oui |

### Check Point

| Modele | RJ45 1G | mGig (vitesses) | PoE | A/P | A/A | Clustering | Redondance alim. |
|---|---|---|---|---|---|---|---|
| Spark 2530 | 6 | 0 | n.p. | n.p. | n.p. | ClusterXL High Availability (modes et nombre de membres non publiés) | non |
| Spark 2550 | 6 | 0 | n.p. | n.p. | n.p. | ClusterXL High Availability (modes et nombre de membres non publiés) | non |
| Spark 2560 | 9 | 0 | n.p. | n.p. | n.p. | ClusterXL High Availability (modes et nombre de membres non publiés) | option |
| Spark 2570 | 9 | 0 | n.p. | n.p. | n.p. | ClusterXL High Availability (modes et nombre de membres non publiés) | option |
| Spark 2580 | 8 | 2 (2.5GbE RJ45) | n.p. | n.p. | n.p. | ClusterXL High Availability (modes et nombre de membres non publiés) | oui |
| Spark 2590 | 16 | 2 (2.5GbE RJ45) | n.p. | n.p. | n.p. | ClusterXL High Availability (modes et nombre de membres non publiés) | oui |
| Force 3920 | 8 | 0 | n.p. | oui | oui | ClusterXL ou VRRP (nombre de membres non publié) | oui |
| Force 3950 | 8 | 4 (2.5GbE RJ45 (2), 10GbE RJ45 (2, dont 1 partagé avec le management)) | n.p. | oui | oui | ClusterXL ou VRRP (nombre de membres non publié) | oui |
| Force 3970 | 16 | 2 (2.5GbE RJ45) | n.p. | oui | oui | ClusterXL ou VRRP (nombre de membres non publié) | oui |
| Force 3980 | 16 | 2 (2.5GbE RJ45) | n.p. | oui | oui | ClusterXL ou VRRP (nombre de membres non publié) | oui |
| Force 9100 | 0 | 8 (1/10GbE RJ45) | n.p. | oui | oui | ClusterXL ou VRRP (nombre de membres non publié) | oui |
| Force 9200 | 0 | 8 (1/10GbE RJ45) | n.p. | oui | oui | ClusterXL ou VRRP (nombre de membres non publié) | oui |
| Force 9300 | 0 | 8 (1/10GbE RJ45) | n.p. | oui | oui | ClusterXL ou VRRP (nombre de membres non publié) | option |
| Force 9400 | 0 | 8 (1/10GbE RJ45) | n.p. | oui | oui | ClusterXL ou VRRP (nombre de membres non publié) | option |
| Force 9700 | 0 | 4 (1/10GbE RJ45) | n.p. | oui | oui | ClusterXL ou VRRP (nombre de membres non publié) | option |
| Force 9800 | 0 | 4 (1/10GbE RJ45) | n.p. | oui | oui | ClusterXL ou VRRP (nombre de membres non publié) | option |
| Force 19100 | 0 | 0 | n.p. | oui | oui | ClusterXL ou VRRP (nombre de membres non publié) | oui |
| Force 19200 | 0 | 0 | n.p. | oui | oui | ClusterXL ou VRRP (nombre de membres non publié) | oui |
| Force 29100 | 0 | 0 | n.p. | oui | oui | ClusterXL ou VRRP (nombre de membres non publié) | oui |
| Force 29200 | 0 | 0 | n.p. | oui | oui | ClusterXL ou VRRP (nombre de membres non publié) | oui |

### Cisco

| Modele | RJ45 1G | mGig (vitesses) | PoE | A/P | A/A | Clustering | Redondance alim. |
|---|---|---|---|---|---|---|---|
| Firepower 1010 | 8 | 0 | 2 | oui | n.p. | n.p. | n.p. |
| Firepower 1120 | 8 | 0 | 0 | oui | n.p. | n.p. | non |
| Firepower 1140 | 8 | 0 | 0 | oui | n.p. | n.p. | non |
| Firepower 1150 | 8 | 0 | 0 | oui | n.p. | n.p. | non |
| Secure Firewall 1210CE | 8 | 0 | 0 | oui | n.p. | n.p. | non |
| Secure Firewall 1210CP | 8 | 0 | 4 | oui | n.p. | n.p. | non |
| Secure Firewall 1220CX | 8 | 0 | 0 | oui | n.p. | n.p. | non |
| Secure Firewall 1230 | 8 | 0 | 0 | oui | n.p. | n.p. | non |
| Secure Firewall 1240 | 8 | 0 | 0 | oui | n.p. | n.p. | non |
| Secure Firewall 1250 | 0 | 8 (2.5GBASE-T) | 0 | oui | n.p. | n.p. | non |
| Secure Firewall 3105 | 8 | 0 | n.p. | oui | oui | n.p. | option |
| Secure Firewall 3110 | 8 | 0 | n.p. | oui | oui | Clustering jusqu’à 8 membres | option |
| Secure Firewall 3120 | 8 | 0 | n.p. | oui | oui | Clustering jusqu’à 8 membres | option |
| Secure Firewall 3130 | 8 | 0 | n.p. | oui | oui | Clustering jusqu’à 8 membres | oui |
| Secure Firewall 3140 | 8 | 0 | n.p. | oui | oui | Clustering jusqu’à 8 membres | oui |
| Secure Firewall 4215 | 0 | 0 | n.p. | oui | oui | Clustering jusqu’à 16 membres | oui |
| Secure Firewall 4225 | 0 | 0 | n.p. | oui | oui | Clustering jusqu’à 16 membres | oui |
| Secure Firewall 4245 | 0 | 0 | n.p. | oui | oui | Clustering jusqu’à 16 membres | oui |
| Secure Firewall 6160 | 0 | 0 | 0 | oui | oui | Clustering jusqu’à 16 membres | oui |
| Secure Firewall 6170 | 0 | 0 | 0 | oui | oui | Clustering jusqu’à 16 membres | oui |
