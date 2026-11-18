# Audit des limites et fonctions, novembre 2026

Releve du 10 novembre 2026, un rapport par editeur. Donnees brutes dans tools/caps/, fusion par node tools/caps-merge.js tools/caps.

---

# Relevé capacités et fonctions : Palo Alto Networks (PA-Series), 10/11/2026

Livrable : `caps_pan.js` (59 modèles, tous les id de `data/pa-models.js`, aucun ajout ni retrait). Générateur
reproductible : `pan_caps/gen.js` (lit `pan_caps/docs.json` et `pan_caps/fm.json`, extraits de l'outil officiel).

## Sources

| Clé | Source | Version / date |
|---|---|---|
| cmp | https://www.paloaltonetworks.com/products/product-comparison : outil officiel « Product comparison ». Données lues via la requête que la page envoie elle-même au moteur Solr du site (62 fiches en_US, 120 lignes de capacités) | Page modifiée le 09/11/2026. **L'outil n'indique aucune version PAN-OS.** |
| ds400, ds400r, ds1400*, ds3400*, ds5400* | datasheets PDF (liens dans pa-models.js) | PAN-OS 12.1 |
| ds500, ds50r, ds1500, ds3500, ds5500 | datasheets PDF | PAN-OS 12.2 |
| ds7000, ds7500*, ds800 | datasheets PDF | PAN-OS 11.2, 11.1, 11.0 |
| subs | docs.paloaltonetworks.com/ngfw/administration/subscriptions/all-subscriptions (« Subscriptions You Can Use With the Firewall ») | mise à jour 26/10/2026 |
| sdreq | docs.paloaltonetworks.com/sd-wan/activation-and-onboarding/system-requirements-for-sd-wan | 30/07/2026 |
| pqvpn | docs « Configure Post-Quantum IKEv2 VPNs with RFC 9242 and RFC 9370 Hybrid Keys » | PAN-OS 11.2+, 20/07/2026 |
| pqike | Compatibility matrix, suites IKE PAN-OS 11.2 (ML-KEM 512/768/1024) | 11.2 |
| icsapp | Livre blanc officiel « App-IDs for ICS and SCADA » | non daté |

(*) lues pour contrôle, non citées dans SOURCES car elles ne publient que les vsys, déjà fournis par cmp.

Depuis 2025-2026, les datasheets ne publient plus les limites de configuration (seulement Virtual systems base/max).
La seule source officielle courante de ces limites est l'outil cmp.

## Correspondance des champs (libellés exacts de cmp)

| Champ | Ligne cmp |
|---|---|
| ipsec | IPSec VPN > Site to site (with proxy id). « Max IKE Peers » publié à part (plus bas sur les petits modèles : PA-501 250, PA-505 500) |
| ra | GlobalProtect Client VPN > Max tunnels (SSL, IPSec, and IKE with XAUTH) : un seul chiffre pour SSL et IPsec |
| vlan | Interfaces > 802.1q tags per device (4 094 partout). C'est le nombre d'identifiants VLAN, pas de sous-interfaces ; cmp publie à part « Max interfaces (logical and physical) » (1 024 à 8 400) |
| virt / virtBase | Virtual Systems > Max / Base virtual systems ; datasheets pour les modèles absents de cmp |
| rules | Policies > Security rulebase |
| nat | NAT > Total NAT rule capacity (même valeur que Policies > NAT rule capacity) |
| addr / addrGrp / svc | Objects > Address objects / Address groups / Service objects |
| zones | Security Zones > Max security zones |
| routes | Routing > IPv4 forwarding table size (entrées de la table de transfert, partagées entre routeurs virtuels ; pas de chiffre « routes statiques » publié) |
| users | User-ID > IP-User mappings (data plane). Le plan de gestion est à 512 000 sur tous les modèles |
| sslDec | SSL Decryption > Max concurrent decryption sessions |
| ap / sw | non applicable : PAN-OS ne gère ni points d'accès ni commutateurs → null partout |

## Taux de remplissage (sur 59)

ipsec 44 · ra 42 · vlan 44 · virt 57 · virtBase 59 · virtTerm 59 · rules 44 · nat 44 · addr 44 · addrGrp 44 ·
svc 44 · zones 44 · routes 42 · users 44 · sslDec 38 · ap 0 · sw 0.

**Absents de cmp (15 modèles, capacités null sauf vsys)** : PA-520-5G, PA-1510-POE, PA-1520-POE, PA-1530-POE,
PA-3510, PA-3520, PA-3530, PA-3540, PA-5510, PA-5520, PA-5530, PA-52R-5G, PA-54R-POE, PA-54R-POE-D-5G, PA-56R-POE-5G.
Leurs datasheets ne publient que Virtual systems (base/max). Aucune autre source officielle ne donne leurs limites.
À l'inverse, cmp contient des modèles hors site (PA-5450, PA-5200, PA-3200, PA-220/220R, cartes 7000/7500/5450).

## Fonctions (niveau éditeur, FEATURES)

ips lic · av lic · sandbox lic · url lic · dns lic · app base · tls base · sdwan lic · ztna null · raVpn base ·
dlp lic · iot lic · ot base · pqc base · wifi false · cell false · wlc false · swc false · ai lic.

Exceptions par modèle (CAPS[id].feat) :
- cell 'intégré' : PA-415-5G, PA-455-5G, PA-520-5G, PA-410R-5G, PA-450R-5G, PA-455R-5G, PA-52R-5G, PA-54R-POE-D-5G,
  PA-56R-POE-5G. PA-54R-POE reste false : la Table 4 de ds50r indique Cellular « N/A » (vérifié sur rendu image).
- pqc false : PA-820, PA-850 (dernière version PAN-OS 11.1, or les clés hybrides ML-KEM exigent 11.2 ; seule la
  PPK RFC 8784 existe en 11.1). C'est une déduction à partir de deux faits officiels, pas une phrase de l'éditeur.
- sdwan null : PA-7500 (absent de sdreq, datasheet muette ; cmp affiche « SD-WAN IPSec tunnels : TBD » mais
  « SD-WAN Rules : 8,192 »).
- sdwan lic sans exception, avec une note de source, pour PA-500, PA-1500, PA-3500, PA-5500, PA-400R, PA-50R : ces séries
  manquent dans la liste de sdreq, mais leur datasheet décrit le SD-WAN.

## Écarts avec data/pa-models.js (valeur existante → valeur relevée)

Concordants : PA-410 à PA-460 (sauf vsys), PA-505/510/520, PA-540 à PA-560, PA-1410/1420, PA-3410/3420/3440, PA-5410,
PA-7050/7080 (zones, policies, addr, nat, ipsec).

Corrections :
- **PA-5420** : zones 4 000 → 6 000 ; policies 30 000 → 45 000 ; ipsec 10 000 → 12 000 ; addr 80 000 → 120 000 ;
  sdwanT 4 000 → 5 000.
- **PA-5430** : zones 4 000 → 17 000 ; policies 30 000 → 65 000 ; ipsec 10 000 → 12 000 ; ssl 500 000 → 900 000 ;
  addr 80 000 → 160 000 ; nat 6 000 → 8 000 ; sdwanT 4 000 → 5 000.
- **PA-5440** : zones 4 000 → 17 000 ; policies 30 000 → 65 000 ; ipsec 10 000 → 24 000 ; ssl 500 000 → 2 400 000 ;
  addr 80 000 → 160 000 ; nat 6 000 → 8 000 ; sdwanT 4 000 → 8 000 ; sdwanR 800 → 1 000.
- **PA-5445** : idem PA-5440 sauf ssl 500 000 → 4 800 000.
  (Les valeurs existantes des PA-5420 à 5445 sont celles du PA-5410, recopiées.)
- **PA-820** : zones 50 → 30 ; policies 2 000 → 1 500. **PA-850** : zones 50 → 40 ; policies 2 000 → 1 500.
- **PA-3430** : gp 1 800 → 2 000.
- **PA-7500** : ssl 44 000 000 → 43 979 283 (valeur exacte publiée).
- **PA-7050 / PA-7080** : ssl 4 000 000 / 6 000 000 et gp 40 000 / 60 000 non retrouvés tels quels ; cmp publie
  « 786,432/19.2M » et « 1,310,720/32M » (décryptage), « 40000/60000 » (GlobalProtect) sans dire à quoi correspond
  chaque chiffre → null ici.

Valeurs à ajouter (null aujourd'hui dans pa-models.js, publiées par cmp) :
- PA-501 : zones 25, policies 500, ipsec 250, ssl 6 600, addr 2 500, nat 400, gp 500, vsys 1/1, sdwanT 250, sdwanR 100.
- PA-820 / PA-850 : ipsec 2 000, ssl 12 800 / 19 200, addr 2 500 / 3 500, nat 3 000, vsys base 1, sdwanT 1 000, sdwanR 100.
- PA-5540 à PA-5580 : zones 17 000, policies 65 000, ipsec 24 000, addr 160 000, nat 16 000, gp 60 000, sdwanT 8 000,
  sdwanR 1 000 ; ssl 4 M / 5 M / 7,5 M / 9 M / 10 M.
- PA-410R / 410R-5G : 25 / 500 / 1 000 / 6 600 / 2 500 / 400 / gp 250. PA-450R / 450R-5G : 75 / 2 000 / 2 800 / 25 600 /
  10 000 / 3 000 / gp 1 500. PA-455R-5G : 75 / 2 500 / 2 800 / 20 000 / 15 000 / 3 000 / gp 1 500
  (zones / policies / ipsec / ssl / addr / nat). SD-WAN 1 000/100 (410R), 2 800/250 (450R, 455R).
- vsys PA-501/505/510/520 : cmp publie 1/1, alors que la datasheet PA-500 affiche un tiret.

## Valeurs surprenantes

- PA-5420 → PA-5430 : les zones passent de 6 000 à 17 000, les règles de 45 000 à 65 000 ; c'est un vrai saut de palier.
- Le décryptage du PA-7500 est publié au chiffre près (43 979 283) ; c'est la seule valeur non arrondie.
- PA-1410 et PA-1420 ont les mêmes limites, sauf ipsec (3 500 / 4 000) et sslDec (51 200 / 140 000).
- PA-415-5G : sslDec 6 553 dans cmp (comme PA-410/415), PA-410R : 6 600.
- PA-450/455/455-5G/460 : cmp n'a aucune ligne de décryptage (null), alors que PA-440/445 l'ont.
- Les tunnels GlobalProtect du PA-5410 (15 000) sont 7,5 fois ceux du PA-3440 (2 000).
- Le PA-501 n'a que 250 pairs IKE et 250 tunnels site à site.

## Ambiguïtés

- cmp ne date pas ses valeurs et ne donne pas de version PAN-OS. Les modèles PA-5540+ (PAN-OS 12.1.2+) y figurent,
  donc la base est récente, mais je ne peux pas le prouver.
- PA-7050/7080 : couples « a/b » sans légende. Seul ipsec est tranché (12 000 = ligne de la carte NPC 100G).
- sandbox : selon subs, le WildFire de base est « included as part of the Threat Prevention license ». Ce n'est donc
  pas 'base' ; l'analyse a lieu dans le cloud ou sur une appliance WF-500 → 'lic' (et non 'lic-local').
- raVpn : subs autorise portails et passerelles GlobalProtect sans licence (« without HIP checks »). Les datasheets
  marquent pourtant « Secure access over IPsec and SSL VPN tunnels using GlobalProtect Gateway and Portals » d'un
  « Requires GlobalProtect License ». J'ai retenu 'base' d'après la doc d'administration ; à arbitrer.
- ot : App-ID OT/ICS sans abonnement (livre blanc icsapp, ds50r). L'IPS OT demande Threat Prevention, et l'offre
  « Industrial OT Security » est un abonnement à part, que subs ne mentionne pas.
- users : j'ai pris les correspondances IP-utilisateur du plan de données (128 k / 256 k / 512 k), plus discriminantes que
  celles du plan de gestion (512 k partout).
- vlan = 4 094 partout (identifiants 802.1Q) : peu discriminant ; « Max interfaces » serait l'autre lecture possible.

## Non publié nulle part (source officielle)

- Toutes les limites de configuration des PA-1500, PA-3500, PA-5510/5520/5530, PA-520-5G et PA-50R.
- Max virtual systems des PA-820/850 (cmp vide, datasheet muette).
- Routes statiques en tant que telles (seule la taille de la table de transfert est publiée).
- ZTNA porté par le pare-feu (l'éditeur le place dans Prisma Access).
- Liste par modèle de la prise en charge SD-WAN pour PA-7500.
- Gestion de points d'accès ou de commutateurs : fonction inexistante (ap/sw null, wlc/swc false).

## Résumé

1. 59/59 modèles couverts, structure conforme au brief, aucun em-dash, chargement Node vérifié.
2. Source principale : l'outil officiel Product comparison (62 fiches, 120 lignes), lu le 10/11/2026, sans version PAN-OS indiquée.
3. 44 modèles ont des limites complètes. Pour 15 modèles récents ou absents de l'outil, seuls les vsys sont connus.
4. vsys renseignés pour 57 modèles (base pour 59) ; terme 'vsys'.
5. Écarts majeurs dans pa-models.js : PA-5420/5430/5440/5445 ont les limites du PA-5410 recopiées (zones, règles, objets, tunnels).
6. Autres corrections : PA-820/850 (zones, règles), PA-3430 (GlobalProtect 2 000), PA-7500 (décryptage exact).
7. Beaucoup de valeurs manquantes peuvent être ajoutées au site : PA-501, PA-820/850, PA-5540 à 5580, toute la gamme PA-400R.
8. PA-7050/7080 : chiffres « a/b » sans légende ; décryptage, GlobalProtect et routes laissés à null.
9. Fonctions : App-ID, TLS, VPN d'accès distant, App-ID OT et PQC VPN inclus ; IPS, AV, sandbox, URL, DNS, SD-WAN, DLP, IoT et IA sous abonnement ; pas de Wi-Fi ni de contrôleurs ; 5G intégrée sur 9 variantes.
10. Points à arbitrer : licence GlobalProtect (doc ou datasheet), pqc false déduit pour PA-800, SD-WAN du PA-7500.

---

# Fortinet FortiGate : capacités et fonctions (relevé du 10/11/2026)

Livrable : `caps_fortinet.js` (29 modèles, tous les id `v:'fortinet'` de data/competitors.js, ni ajout ni retrait).
Dossier de travail : `fortinet_caps/` (JSON de la table, datasheets PDF et texte, rendus d'image, `gen.py` qui régénère le corps de CAPS).

## Sources

| Clé | Source | Version / date |
|---|---|---|
| maxval | https://docs.fortinet.com/max-value-table, lue via l'API de la page (`/api/tools/max-values?family=fortigate&version=8.0.2&models=30G,...,7000F`) | FortiOS 8.0.2 (version par défaut et la plus récente de l'outil) |
| maxval76 | même table, FortiOS 7.6.8 (dernière 7.6.x), pour comparer | 7.6.8 |
| ds | les 28 datasheets du champ `ds` (révisions R03 à R51, avril à octobre 2026), page Specifications | voir dsRev |
| sub | tableau « Subscriptions » des datasheets (FortiGuard), identique dans les 28 | idem |
| ag2gb / rn2gb | Admin Guide 8.0.0 « Proxy-related features not supported on FortiGate 2 GB RAM models » + Release Notes 8.0.0 (liste : 40F, 60F, 50G et variantes) | 8.0.0 |
| sslvpn | Release Notes 7.6.2 « SSL VPN removed from 2GB RAM models » | 7.6.2 |
| pqc | New Features 7.6.1 (PQC pour l'échange de clés IPsec, RFC 9370, ML-KEM) + Admin Guide 8.0.2 « Post-Quantum readiness » | 7.6.1+ |
| ztna / ems | Admin Guide 7.6.4 « Basic ZTNA configuration » ; EMS Admin Guide 7.4.7, licences | |

Ordre des colonnes de la table vérifié (l'API rend les limites dans l'ordre des modèles demandés ; contrôle avec des requêtes à un seul modèle). Les datasheets ont été relues par coordonnées de mots (PyMuPDF) puis en image pour 30G, 60F, 70G et 7000F, parce que `pdftotext -layout` décale les colonnes sur ces fiches.

## Règles de lecture appliquées
- La table donne trois limites par objet : instance, par VDOM, globale. La valeur retenue est **la limite par VDOM**, celle qu'atteint un déploiement à un seul VDOM (Fortinet : « normally the one you reach first »). Quand la limite globale diffère, elle est citée dans `src` (ex. 4200F/4400F/4800F/7000F : 200 000 règles par VDOM, 400 000 sur l'équipement ; adresses 200 000 par VDOM, 500 000 au global à partir du 3700F).
- `ipsec` : ligne datasheet « Gateway-to-Gateway IPsec VPN Tunnels ». Elle concorde partout avec `vpn.ipsec.phase1` de la table (policy-based). `vpn.ipsec.phase1-interface` (route-based) n'a aucune limite publiée.
- `ra` : « Client-to-Gateway IPsec VPN Tunnels » (IPsec dialup). C'est toujours plus que « Concurrent SSL-VPN Users », qui vaut tiret, N/A ou « not supported » sur les petits modèles.
- `vlan` : la table n'a pas de ligne VLAN. On reprend `system.interface` global (toutes les interfaces de l'équipement, physiques, VLAN, tunnels…), libellé explicite dans src.
- `nat` : `firewall.central-snat-map` (règles SNAT en mode NAT central). La DNAT (`firewall.vip`) est comptée à part.
- `virt` / `virtBase` : lignes « Max Virtual Domains » et « Default Virtual Domain » de la table 8.0.2 (absentes en 7.6.8), comparées à la ligne datasheet « Virtual Domains (Default / Maximum) ».
- `sslDec` : ligne datasheet « SSL Inspection Concurrent Session (IPS, avg. HTTPS) ».
- 7081F et 7121F : la table n'a qu'une colonne « FortiGate 7000F » pour le châssis. Elle est appliquée aux deux et signalée dans src. Tunnels et sslDec viennent des colonnes système de la datasheet (7081F = 6 FPM, 7121F = 10 FPM).

## Taux de remplissage (29 modèles)
ipsec 29, ra 29, vlan 29, virt 29, virtBase 29, virtTerm 29, rules 29, nat 29, addr 29, addrGrp 29, svc 29, zones 29, routes 29, sslDec 29, sw 29, ap 27 (7081F/7121F null), **users 0**.
Fonctions : les 19 sont renseignées au niveau éditeur, avec 7 modèles à exceptions. Une seule valeur null : ztna du 30G.

## Fonctions (FEATURES)
ips, av, sandbox (cloud : FortiGate Cloud Sandbox, donc 'lic' et non 'lic-local'), url, dns, dlp, iot, ot, ai = 'lic' (services FortiGuard du tableau Subscriptions). app = 'base' (« included with FortiCare Subscription » : contrat de support, pas d'abonnement de sécurité). tls, sdwan, raVpn, pqc, wlc, swc = 'base' (fonctions FortiOS absentes de la liste des services payants). ztna = 'lic' : la passerelle FortiGate ne demande pas d'abonnement, mais aucun poste ne s'enregistre sans licence ZTNA sur FortiClient EMS.
Exceptions :
- dns = false sur 30G et 50G (« in any OS build ») et sur 40F et 60F (depuis 7.4.4), d'après la note 1 du tableau Subscriptions.
- ztna = false sur 40F, 50G et 60F (modèles 2 Go de RAM, plus de ZTNA depuis 7.6.5) ; null sur le 30G (absent de la liste, rien dans sa fiche).
- wifi = true seulement sur 30G, 50G et 70G : ce sont les seules datasheets actuelles qui listent des variantes FortiWiFi. Les fiches 40F, 60F et 80F n'en listent plus, même si leur nom de fichier contient « fortiwifi ».
- cell = 'variante' sur 40F (40F-3G4G) et 50G (50G-5G).
- wlc = false sur 7081F et 7121F (datasheet : FortiAPs « N/A »).

## Valeurs surprenantes et contradictions
- **60F** : la table 8.0.2 donne 5 VDOM (5 par défaut, 5 au maximum), la datasheet 10 / 10. On garde 5 (table) et on signale l'écart. Le 40F, lui aussi à 2 Go, reste à 10.
- **400G** : 25 VDOM dans la table contre 10 / 50 dans la datasheet. **1800F** : 500 dans la table contre 10 / 250 dans la datasheet. Valeurs de la table retenues.
- **3800G** : la datasheet annonce 400 000 règles, la table 200 000 (par VDOM et au global). Pour les FortiAP, datasheet 8192 contre 4096 dans la table.
- **4800F** : la datasheet annonce 200 000 règles, la table 200 000 par VDOM et 400 000 au global.
- **FortiSwitch, 8.0.2 contre 7.6.8 et datasheets** : 50G 16 (7.6.8 : 8), 200G 96 (64), 2600F 300 (196). Le **400G baisse** de 96 à 48 en 8.0.2. Les datasheets suivent les valeurs 7.6.x.
- **7000F** : la table donne 8192 FortiAP mais la datasheet dit « N/A ». On a laissé ap à null et wlc à false.
- La table indique `Concurrent Explicit Proxy User` = 0 (sans limite) pour le 3500G seul ; ce champ n'est pas utilisé.
- 1000F : 600 000 sessions TLS déchiffrées, moins que le 400G (3 M) ou le 200G (900 k) : c'est bien ce que disent les fiches (génération F contre G).
- Les petits modèles (30G à 90G) partagent les mêmes plafonds d'objets (5000 adresses, 1024 services, 20 zones).

## Ambiguïtés
- Version : le brief demande la « dernière version publiée », d'où 8.0.2. Si l'on préfère une branche mature (7.6.x), seuls changent sw (4 modèles) et user.local. Tous les écarts sont notés dans src.
- `users` : la table ne publie que `user.local` (comptes locaux : 50 à 35 000 par VDOM en 8.0.2, 5000 en 7.6.8 sur les grands modèles) et `user.fsso` (5 agents). Ce ne sont pas des correspondances IP-utilisateur. Le champ est donc laissé à null partout, avec la valeur user.local en clair dans src si l'on veut l'afficher.
- `vlan` = nombre total d'interfaces, pas de VLAN dédiés.
- `zones` : la limite `system.zone` porte sur les zones regroupant des interfaces. Chez Fortinet, une politique peut s'appuyer sur des interfaces sans passer par une zone.

## Non publié nulle part (sources officielles consultées)
- Correspondances IP-utilisateur / utilisateurs identifiés simultanés (FSSO ou RSSO) : aucune limite chiffrée.
- Nombre de VLAN par interface ou au total, en dehors du plafond `system.interface`.
- ZTNA sur le 30G.
- Analyse sandbox locale sur FortiGate : n'existe pas (FortiGate Cloud Sandbox ou appliance FortiSandbox).

## Résumé
1. 29/29 modèles Fortinet couverts, ids identiques à competitors.js, `node require` OK.
2. Limites de configuration tirées de la Maximum Values Table officielle, FortiOS 8.0.2, colonne par modèle (API de docs.fortinet.com).
3. Valeur retenue = limite par VDOM ; limite globale citée quand elle diffère.
4. Tunnels IPsec, accès distant et sessions TLS viennent des datasheets ; les IPsec concordent avec la table.
5. 16 champs de capacité remplis à 100 % ; ap à 27/29 ; users à 0/29 (seuls les comptes locaux sont publiés).
6. Fonctions : services FortiGuard en 'lic' ; contrôle applicatif, TLS, SD-WAN, VPN, PQC, contrôleurs Wi-Fi et switch en 'base' ; ZTNA en 'lic' (licence EMS).
7. Modèles à 2 Go de RAM (40F, 50G, 60F) : pas de ZTNA. 30G, 40F, 50G, 60F : pas de filtrage DNS.
8. Contradictions table / datasheet signalées : VDOM (60F, 400G, 1800F), règles (3800G, 4800F), FortiAP (3800G, 7000F), FortiSwitch (50G, 200G, 400G, 2600F).
9. Wi-Fi intégré : 30G, 50G, 70G ; cellulaire en variante : 40F, 50G.
10. Aucune valeur estimée ou extrapolée, aucun prix ni référence de commande, pas de tiret cadratin.

---

# Check Point : capacités et fonctions par modèle (relevé du 10 novembre 2026)

Livrable : `caps_checkpoint.js` (20 modèles, tous les id `v:'checkpoint'` de `data/competitors.js` : Spark 2530 à 2590, Force 3920 à 29200). Dossier de travail : `checkpoint_caps/` (PDF, rendus PNG, scripts).

## Sources (toutes officielles Check Point)

| Clé | Document | Version / date |
|---|---|---|
| ds | Datasheets par modèle (lien `ds` de competitors.js) | Spark 2500 : 22 juillet 2026 ; Force 3920 : 13 juillet ; 3950/3970/3980 : 22 juillet ; 9100/9200 : 15 juillet ; 9300/9400/9800 : 12 juillet ; 9700, 19100, 19200, 29100, 29200 : 8 juillet 2026 |
| r82max | R82 Release Notes, *Maximum Supported Items* (sc1.checkpoint.com) | 14 septembre 2026 |
| r82rn / r82fl | R82 Release Notes (PDF) et *Quantum Software R82 Feature List* | 14 septembre 2026 |
| sk113247 | Maximum number of VLAN and VAPs for Gaia Embedded Appliances | modifié le 9 juin 2026, R82.00.X |
| sparkAG | Spark R82.00.X Locally Managed Administration Guide | 22 septembre 2026 |
| sparkRN | Spark R82.00.X Release Notes (R82.00.10 et R82.00.11) | 15 septembre 2026 |
| sk67820 | Check Point Remote Access Solutions (licences RA) | modifié le 6 novembre 2026 |
| ics | Solution brief Critical Infrastructure & ICS/SCADA Protection | 8 septembre 2016 |

Version de référence : R82 (Gaia) pour les Force, R82.00.X (R82.00.11 la plus récente) pour les Spark.

Lecture : les datasheets Spark 2530 à 3980 et 9100 à 9300 ont été téléchargées et lues en texte puis rendues en image pour les tableaux (VS, Remote Access Users fusionnés). Les datasheets 9400, 9700, 9800, 19100, 19200, 29100 et 29200 sont derrière un challenge anti-bot AWS WAF (réponse 202 vide en curl et WebFetch). Elles ont été lues dans le Chrome de l'utilisateur (visionneuse PDF, captures d'écran pour 9400/9700/9800, extraction du texte de la page avec pdf.js dans l'onglet pour 19100 à 29200). Elles ne sont donc pas copiées dans `checkpoint_caps/pdf`.

## Taux de remplissage (20 modèles)

| Champ | Rempli | Remarque |
|---|---|---|
| vlan | 20/20 | Spark : sk113247 ; Force : 4096 interfaces (VSX) |
| virt, virtTerm | 14/20 | toutes les Force ; Spark sans Virtual Systems publiés |
| virtBase | 10/20 | Force 9100 à 29200 (note du tableau de commande) |
| rules, nat | 14/20 | Force (limites R82 par politique) |
| ra | 6/20 | Spark seulement |
| addr | 6/20 | Spark seulement (1 000 objets en gestion locale) |
| ipsec, addrGrp, svc, zones, routes, users, sslDec, ap, sw | 0/20 | non publiés |

Fonctions : 21 champs renseignés au niveau éditeur (dont 3 à null : ztna, wlc, swc), avec exceptions Spark (sdwan, iot, raVpn en `base` ; dns, dlp, pqc à null ; wifi/cell par modèle).

## Valeurs et choix à connaître

- **vlan (Force)** : la datasheet publie « Total physical and virtual (VLAN) interfaces per appliance: 1024/4096 (single gateway/with virtual systems) » (3900, 19000, 29000). Les 9000 ne la publient pas, mais r82max donne la même règle pour toute passerelle R82 (1024 non-VSX, 4096 en VSX traditionnel, interfaces physiques, VLAN et Warp comprises). On a retenu 4096 (maximum) ; en passerelle simple c'est 1024. Ce sont des interfaces au total, pas strictement des sous-interfaces 802.1Q.
- **vlan (Spark)** : sk113247 (VLAN tagués) : 100 pour 2530/2550, 200 pour 2560/2570/2580/2590. La datasheet Spark indique 1024 interfaces au total (physiques + VLAN), valeur différente et d'une autre nature ; sk113247 a été lu via WebFetch (résumé), à relire si besoin.
- **virt** : colonne « Firewall VS » (VS en pare-feu seul). Avec plus de fonctions, c'est nettement moins : Firewall + IPS VS et Next Gen Threat Prevention VS. Exemples (Max capacity) : 3920 = 17 / 10 / 5 ; 3950-3980 = 28 / 14 / 7 ; 9100-9300 = 48 / 24 / 12 ; 9400 = 64 / 32 / 16 ; 9700 = 128 / 64 / 32 ; 9800 = 160 / 80 / 40 ; 19100/19200 = 300 / 160 / 80 ; 29100 = 300 / 160 / 112 ; 29200 = 300 / 160 / 128 (Plus 126, Maestro 80).
- **Surprise** : 9100, 9200 et 9300 publient exactement les mêmes capacités VS (48 / 24 / 9 en Base, 12 en Plus), malgré des CPU très différents. 9400 et 9700 ont un plafond plus bas en configuration Base (53 et 106 Firewall VS) qu'en Plus.
- **virtBase = 2** : « The Base package includes 2 virtual systems (VS), one management VS and one production/data VS », soit **un seul VS de production** utile. Pour 19000/29000, la configuration Plus apporte 5 licences VS additives. Les datasheets 3900 ne disent rien des VS inclus (null).
- **rules / nat** : 28 000 règles par politique Access Control (20 000 recommandés) et 16 384 règles NAT. Ce sont des limites du serveur de management R82 par politique, valables pour toute passerelle Gaia : même valeur pour toutes les Force. Non transposées aux Spark (Gaia Embedded, autre code).
- **addr (Spark)** : « maximum of 1000 objects in total » en gestion locale, hôtes, réseaux et noms de domaine confondus. En gestion centrale (Smart-1), d'autres limites s'appliquent (non publiées par modèle).
- **ra (Spark)** : 100 (2530/2550), 200 (2560/2570), 1 000 (2580/2590), cellules fusionnées de la datasheet vérifiées sur rendu image.
- **Datasheet Spark** : la dernière page (abonnements) porte l'en-tête « Force 3980 », erreur de mise en page de Check Point ; le contenu (IoT et SD-WAN « for SMB included ») est propre aux Spark.

## Ambiguïtés sur les fonctions

- **tls = base** : HTTPS Inspection figure dans les fonctions du boîtier et pas dans le tableau des abonnements. Aucun texte ne dit « inclus » : c'est une déduction.
- **raVpn** : Force = `lic` (sk67820 : 5 utilisateurs inclus par défaut, blades 50 / 200 / Unlimited au-delà) ; Spark = `base` (nombre d'utilisateurs publié par modèle, VPN hors tableau d'abonnements, déduction).
- **pqc** : Force = `base`, ML-KEM (Kyber768) en VPN site-à-site depuis R82, fonction du blade IPsec VPN. Spark = null : les notes R82.00.10 parlent de « Quantum-safe cryptography (Kyber, Dilithium) » sans dire que c'est le VPN IPsec.
- **dns (Spark)** : fonction publiée mais absente du tableau d'abonnements Spark : null.
- **dlp** : Force = `lic` (blade DLP optionnel) ; Spark = null (jamais mentionné).
- **ot** : Application Control couvre Modbus, DNP3, IEC-104, IEC 61850, S7… et « All features are available across all appliances ». La source date de 2016, c'est la seule page officielle trouvée.
- **ai** : moteurs « AI-based Prevention » de R82 (ThreatCloud Graph, Kronos…) dans la Threat Prevention, donc `lic`.
- **sandbox = lic** : émulation dans le cloud ThreatCloud, aucune émulation locale publiée sur ces boîtiers.
- **ztna, wlc, swc** : rien de publié pour le pare-feu (le ZTNA Check Point relève de Harmony SASE, hors boîtier).

## Non publié nulle part (sources officielles accessibles)

Tunnels IPsec site-à-site max (Spark : seul un paramètre CLI « maximum-concurrent-vpn-tunnels », défaut 10 000, réglable jusqu'à 4 294 967 295, qui n'est pas une capacité), utilisateurs RA max des Force (licence Unlimited possible), groupes d'adresses, objets service, zones, routes statiques, utilisateurs identifiés (Identity Awareness), sessions TLS déchiffrées, points d'accès et commutateurs gérés. Les objets réseau côté management R82 (100 000 par domaine, 1 000 000 au total) sont des limites de base de management, pas du boîtier : non reportées.

## Résumé (10 lignes)

1. 20/20 modèles Check Point couverts, mêmes id que competitors.js, vérifiés avec node.
2. Sources : datasheets juillet 2026, R82 Maximum Supported Items, sk113247, guide Spark R82.00.X, sk67820.
3. VS publiés pour toutes les Force : de 17 (3920) à 300 (19000/29000) en Firewall VS, beaucoup moins avec la Threat Prevention.
4. Le paquet Base des 9000/19000/29000 inclut 2 VS dont un seul de production ; 3900 non publié.
5. VLAN : 4096 interfaces (VSX) ou 1024 (passerelle simple) pour les Force ; 100 ou 200 VLAN pour les Spark (sk113247).
6. Règles : 28 000 de filtrage et 16 384 de NAT par politique R82 (Force uniquement).
7. Spark : 100 / 200 / 1 000 utilisateurs VPN distants, 1 000 objets réseau en gestion locale.
8. Fonctions sous abonnement NGFW/NGTP/SNBT ; SD-WAN et IoT inclus sur Spark, optionnels sur Force ; DLP optionnel sur Force.
9. PQC ML-KEM publié pour R82 (Force), pas clairement pour les Spark ; ZTNA, contrôleurs Wi-Fi/switch non publiés.
10. 7 datasheets bloquées par un WAF anti-bot en ligne de commande, lues dans Chrome : pas de copie locale de ces PDF.

---

# Cisco : capacités et fonctions (Threat Defense), relevé du 10 novembre 2026

20 modèles couverts (tous les id `v:'cisco'` de data/competitors.js) : Firepower 1010/1120/1140/1150, Secure Firewall 1210CE/1210CP/1220CX/1230/1240/1250, 3105/3110/3120/3130/3140, 4215/4225/4245, 6160/6170. Logiciel Threat Defense uniquement ; les chiffres ASA (security contexts 2;5 à 2;250, etc.) sont volontairement ignorés.

## Sources
| Clé | Document | Version / date |
|---|---|---|
| ds1000 | datasheet Firepower 1000, Table 1 (Threat Defense) | Updated 23/10/2023 |
| ds1200 | datasheet Secure Firewall 1200, Tables 2 et 8 | Updated 09/07/2025 |
| ds3100 | datasheet 3100, Table 2 | Updated 06/10/2026 |
| ds4200 | datasheet 4200, Table 1 | Updated 29/10/2024 |
| ds6100 | datasheet 6100, Table 4 | Updated 15/10/2026 |
| ravpn | FMC Device Config Guide 10.x, Remote Access VPN, Appendix A (PDF p.84-85) | 03/11/2026 |
| vlan | FMC Device Config Guide 10.x, Regular Firewall Interfaces | 03/11/2026 |
| mi | FMC Device Config Guide 10.x, Multi-Instance Mode | 03/11/2026 |
| ident | FMC Device Config Guide 10.x, Identity Overview, « Maximum mappings per device » | 03/11/2026 |
| lic | FMC Administration Guide 10.x, Licenses | 02/11/2026 |
| licmap | Cisco Secure Firewall Management Center Feature Licenses | 17/09/2026 |
| threat | secure.cisco.com, Threat Capabilities of Cisco Secure Firewall | 24/08/2026 |
| pbr | FMC Device Config Guide 10.x, Policy Based Routing | 03/11/2026 |
| ztna | FMC Device Config Guide 7.7, ZTNA Overview | 05/03/2025 |
| scada | Snort 3 Inspector Reference, Inspectors | n.d. |
| acl | FMC Device Config Guide 7.4, Access Control Rules | 7.4 |

URLs complètes dans `SOURCES` de caps_cisco.js. Version retenue : branche 10.x (guides les plus récents, mis à jour début novembre 2026). Cisco ne publie pas de « suggested release » lisible dans ces pages ; à confirmer si le site doit afficher 7.6/7.7.

Accès : cisco.com bloque curl (Akamai, « Access Denied ») ; pages lues par WebFetch, et le PDF du chapitre RA VPN 10.x récupéré par WebFetch puis passé dans pdftotext (SCRATCH/cisco_caps/fmc10_ravpn.txt) car l'annexe n'apparaissait pas dans la version HTML convertie.

## Taux de remplissage (20 modèles)
ipsec 20/20, ra 20/20, vlan 20/20, virt 20/20, virtBase 20/20, virtTerm 20/20, users 20/20.
rules, nat, addr, addrGrp, svc, zones, routes, sslDec, ap, sw : 0/20.

Fonctions (niveau éditeur, aucune exception par modèle) : ips lic, av lic, sandbox lic, url lic, dns lic, app base, tls base, sdwan base, ztna base, raVpn lic, ot lic, ai lic, wifi false, cell false ; dlp, iot, pqc, wlc, swc null.

## Valeurs surprenantes / à savoir
- **ipsec** = « Maximum VPN peers » des datasheets, libellé unique non séparé site-à-site / accès distant (autorisé par le brief, précisé dans src). Le guide FDM 10.x dit explicitement que la limite de sessions VPN combine utilisateurs RA et pairs site-à-site : ipsec et ra ne s'additionnent donc pas.
- **ra** vient de l'Appendix A du guide FMC 10.x. 1150 et 3105 n'y figurent pas ; l'annexe dit « For capacity of other hardware models, check the data sheets », d'où ra = Maximum VPN peers datasheet (800 et 2 000), indiqué dans src.
- **3120** : RA = 6 000 dans le guide, mais 7 000 « VPN peers » dans la datasheet (seul écart entre les deux sources).
- **4225** : 21 instances dans le guide 10.x (la datasheet de 2024 dit 15). Valeur du guide retenue.
- **virt = 0** pour les 1000 (absents de la liste des modèles multi-instance), 1200 (« Multi-Instance : Not supported »), 3105 (explicitement non supporté) et 6100 (« Available in future release »). virtTerm = 'instance' (multi-instance, conteneurs Threat Defense).
- **virtBase = virt** : le guide indique que toutes les licences sont consommées par châssis et non par instance, aucune licence par instance n'est publiée. Interprétation à valider si le site veut une lecture stricte (sinon null).
- **vlan** : 60 sur la 1010, 512 sur la 1120, 1 024 partout ailleurs, y compris 6100. En multi-instance le châssis accepte en plus 500 sous-interfaces VLAN partagées (non retenu).
- **users** = « Maximum Mappings » (IP-utilisateur, SXP, ABP, objets dynamiques confondus) ; 64 000 si mappings AD seuls sur 1000/1200/3100. Colonne « Enhanced (Beta) » (128 000 à 600 000) ignorée.
- **tls 'base'** : le déchiffrement n'est rattaché à aucune licence de fonction ; il relève seulement des export-controlled features du compte Smart.
- **ztna 'base'** : Clientless ZTNA (7.4+, web TLS) sans abonnement ; Universal ZTNA (7.7.10+) demande en plus Cisco Secure Access, non retenu.
- **ai 'lic'** : SnortML (licence IPS, 7.6+). EVE (Encrypted Visibility Engine) aussi sous IPS.
- **sandbox 'lic'** (pas 'lic-local') : analyse dynamique dans Secure Malware Analytics (cloud ou appliance). L'« analyse locale » de Malware Defense est statique.

## Ambiguïtés
- Datasheet 1200 : colonnes 1210 et 1220 seulement ; appliquées à 1210CE/1210CP et 1220CX (même découpage que l'Appendix A).
- Datasheet 6100 : « Maximum VPN peers 60 K » pour les deux modèles, Appendix A « Secure Firewall 6100 : 60 000 » sans distinction.
- VPN site-à-site distribué (4200/6100) : sessions 10 000 / 12 500 / 15 000 / 280 000 / 350 000 sur une page Security Cloud Control (docs.manage.security.cisco.com) ; fonction différente, non utilisée.
- Pages docs.manage.security.cisco.com : certaines encore à l'ancienne table RA (2100) ; seules les pages cisco.com 10.x sont retenues.

## Non publié nulle part (Threat Defense)
- Nombre max de règles d'accès / ACE : Cisco écrit que cela « depends on many factors, including policy complexity, physical memory » (guide 7.4), aucun chiffre par modèle.
- Règles NAT, objets adresse, groupes, services, zones, routes statiques : aucune table par modèle.
- Sessions TLS déchiffrées simultanées : seul le débit TLS est publié.
- AP Wi-Fi et commutateurs gérés : sans objet sur Threat Defense, non publié.
- DLP, profilage IoT : aucune fonction publiée.
- VPN post-quantique ML-KEM : annoncé pour FTD 10.5 « targeted for late 2026 » (blog Cisco), non documenté comme disponible.
- Info utile non demandée : VRF max 5/10/10/10/15 (1210 à 1250) et 250 (6100) dans les datasheets.

## Résumé
1. 20/20 modèles Cisco couverts, aucun ajout ni retrait ; fichier vérifié avec node (20 clés).
2. Sources : 5 datasheets HTML + guides FMC 10.x (novembre 2026) + pages licences Cisco.
3. ipsec, ra, vlan, virt, virtBase, virtTerm, users : 100 % remplis.
4. rules, nat, addr, addrGrp, svc, zones, routes, sslDec, ap, sw : jamais publiés par Cisco pour Threat Defense.
5. ipsec = « Maximum VPN peers » combiné RA + site-à-site, libellé noté.
6. ra pour 1150 et 3105 repris de la datasheet sur renvoi explicite du guide.
7. Écarts : 3120 RA 6 000 (guide) vs 7 000 (datasheet) ; 4225 21 instances (guide 10.x) vs 15 (datasheet 2024).
8. Multi-instance seulement sur 3110-3140 et 4200 ; 0 ailleurs (6100 « future release »).
9. Licences génériques : IPS, Malware Defense, URL, Secure Client ; app, TLS, SD-WAN (PBR), ZTNA clientless inclus.
10. Pas de DLP, IoT, Wi-Fi, cellulaire ; PQC seulement en feuille de route.

---

# Relevé capacités et fonctions : Sophos Firewall XGS

Livrable : `caps_sophos.js` (19 modèles, tous les id `v:'sophos'` de `data/competitors.js`, aucun ajouté ni retiré). Généré par `sophos_caps/gen.js`.
Version logicielle de référence : Sophos Firewall 22.0 MR3 (Build 576, 16/10/2026). La 23.0 GA (Build 371, 04/11/2026) vient de sortir et change une valeur (zones).

## Sources
| Clé | Document | Version / date |
|---|---|---|
| br | Sophos Firewall Brochure, https://assets.sophos.com/X24WTUEQ/at/7wf85vbnnqf939bbhtxgfk/sophos-firewall-br.pdf | PDF du 23/10/2026 ; pages imprimées (= page PDF moins 1) |
| fl | Sophos Firewall Feature List, https://assets.sophos.com/X24WTUEQ/at/wqcgnwbmth9vsqggg8bnh5f/sophos-firewall-feature-list.pdf | PDF du 12/01/2026 |
| hosts | docs.sophos.com, SF 22.0 Help, Hosts and services | consulté le 10/11/2026 |
| users | docs.sophos.com, SF 22.0 Help, Authentication > Users | idem |
| vlanDoc | docs.sophos.com, SF 22.0 Help, Virtual LANs | idem |
| ipsecAlg | docs.sophos.com, SF 22.0 Help, IPsec encryption algorithms | idem |
| rn22 / rn23 | Release notes SF 22.0 (jusqu’à MR3) et 23.0 GA | 16/10/2026 et 04/11/2026 |

Sophos ne publie aucune table de « maximum values » par modèle. Les seules limites par modèle sont les trois lignes de la brochure (tunnels IPsec, tunnels SSL VPN, connexions TLS déchiffrées). Les autres limites trouvées sont des plafonds logiciels sans distinction de modèle.

## Taux de remplissage (19 modèles)
| Champ | Rempli | Remarque |
|---|---|---|
| ipsec | 19/19 | « IPsec VPN concurrent tunnels » (br, par modèle) |
| ra | 19/19 | « SSL VPN concurrent tunnels » seul (br) ; tunnels, pas des utilisateurs ; accès distant et site-à-site SSL confondus |
| sslDec | 19/19 | « Xstream SSL/TLS concurrent connections » (br) |
| addr | 19/19 | 16 000 hôtes tous types confondus (doc 22.0, limite logicielle) |
| zones | 19/19 | 100 en 22.0 ; 248 en 23.0 GA (rn23) |
| users | 19/19 | 65 535 identifiants utilisateurs + groupes (doc 22.0) |
| vlan, virt, virtBase, virtTerm, rules, nat, addrGrp, svc, routes, ap, sw | 0/19 | non publiés |

Fonctions : 17/19 renseignées au niveau éditeur (iot, ot, swc = null). Exceptions par modèle : wifi (variantes w des XGS 88/108/118/128), cell = 'module' (XGS 118, 128, 138).

## Valeurs surprenantes / ambiguïtés
- **XGS 138** : `pdftotext` décale d’une ligne la colonne (cellule IPsec vide, SSL = 2 500). Le rendu image de la page 18 donne IPsec 2 500, SSL 1 500, connexions TLS 18 432 : valeurs retenues.
- **Tableaux à deux colonnes** (XGS 2100/2300 p.20, 3100/3300 p.21) vérifiés en image : 2300 = 5 000 / 2 500 / 18 432 ; 3300 = 6 500 / 5 000 / 102 400.
- **ra** : la valeur retenue est la seule ligne « SSL VPN concurrent tunnels ». Le chiffre IPsec est déjà dans `ipsec`, et rien n’indique qu’il concerne l’accès distant. La brochure ne sépare pas accès distant et site-à-site SSL (Base License p.5 : « IPsec/SSL site-to-site and remote access VPN ») : les deux usages sont donc mêlés, et le chiffre compte des tunnels, pas des utilisateurs. Sur les gros modèles, ra est plus élevé que ipsec (ex. XGS 8500 : 24 000 contre 15 000).
- **Connexions TLS** : 5580 = 511 992 contre 512 000 pour la 5500 (chiffre exact de la brochure, vérifié en image). XGS 2380 = 21 195, valeur peu ronde mais publiée.
- La brochure p.5 écrit « IPsec/SSL site-to-site and remote access VPN (unlimited) » sous Base License : cela concerne la licence (pas de licence par utilisateur VPN), pas la capacité. La capacité reste celle du tableau par modèle.
- **zones** : rn23 dit « Increased the maximum number of zones from 100 to 248 ». 100 est retenu pour la 22.0 MR3, la version courante recommandée. À passer à 248 si le site suit la 23.0.
- **addr / users / zones** sont des plafonds logiciels publiés sans mention de modèle. Ils sont appliqués aux 19 modèles parce que la doc parle de « the firewall » sans réserve, pas parce qu’un texte cite toutes les familles. 16 000 = hôtes IP, MAC, FQDN et groupes pays cumulés (rien sur les groupes d’hôtes). 65 535 = identifiants de la base utilisateurs/groupes, pas des correspondances IP-utilisateur simultanées.
- **vlan** : la doc 22.0 dit qu’il n’y a « pas de limite fixe » de VLAN par interface physique sur XGS. Ce n’est pas un nombre, donc null.
- **pqc = false** : la liste des groupes DH IPsec en 22.0 est complète et sans ML-KEM. La 22.0 MR2 se contente de détecter et bloquer les échanges ML-KEM via l’IPS ; ce n’est pas un VPN post-quantique.
- **sandbox = 'lic'** (cloud, Zero-Day Protection) ; **ztna = 'lic'** : la passerelle est gratuite, mais les licences client ZTNA se vendent à part et une licence Base seule exige du support. **dlp = 'lic'** porte uniquement sur le courriel (module Email Protection). **tls = 'base'** (TLS 1.3 inspection dans la Base License).
- **XGS 88(w)** : sans rapport de journalisation local, sans double moteur AV, sans AV WAF ni MTA (br p.14, fl p.11). Les fonctions du tableau restent toutefois listées pour lui.
- **wlc = 'base'** : seulement pour le Wi-Fi intégré et les bornes APX Wi-Fi 5, qui sont en fin de vente (fin de vie déc. 2027, br p.36). Les bornes AP6 se gèrent depuis Sophos Central, pas depuis le pare-feu.
- **cell** : module 5G Gen.2 en option pour 118/128/138 seulement (Product Matrix p.12, indisponible au Japon). La fl cite par ailleurs un « Wireless WAN support » générique, sans modèle ; les autres modèles sont donc à false.

## Publié nulle part (sources officielles)
Nombre maximal de règles de pare-feu, de règles NAT, de groupes d’adresses, d’objets service, de routes statiques, de VLAN, de points d’accès gérés par modèle, de commutateurs ; contextes virtuels (Sophos Firewall n’en a pas) ; identification IoT ; protocoles OT/industriels ; gestion de commutateurs par le pare-feu. Sur le nombre d’AP, seuls des fils communautaires existent, et ils se contredisent : non retenus.

## Résumé
1. 19 modèles XGS couverts, ids identiques à competitors.js, vérifiés par `node require`.
2. Seules 3 limites sont publiées par modèle, toutes dans la brochure du 23/10/2026 : tunnels IPsec, tunnels SSL VPN, connexions TLS déchiffrées.
3. 3 plafonds logiciels sont communs à la gamme (doc 22.0) : 16 000 hôtes, 65 535 utilisateurs/groupes, 100 zones (248 en 23.0).
4. 11 champs de capacité restent null sur tous les modèles, faute de publication (règles, NAT, VLAN, routes, AP, etc.).
5. XGS 138 : erreur d’extraction texte corrigée par lecture image (IPsec 2 500, SSL 1 500).
6. ra = tunnels SSL VPN simultanés seuls (accès distant et site-à-site SSL confondus), à signaler sur le site.
7. Sécurité sous abonnement : IPS, AV, URL, DNS, contrôle applicatif, sandbox cloud, ML ; de base : TLS, SD-WAN, VPN d’accès distant, contrôleur Wi-Fi.
8. Pas de VPN post-quantique (pqc false) : seule la détection du PQC par l’IPS existe.
9. Wi-Fi 6 sur les variantes w de 88/108/118/128 ; module 5G sur 118/128/138.
10. iot, ot et swc à null : aucune mention officielle.

---

# SonicWall : capacités et fonctions (relevé du 2026-11-10)

Livrable : `caps_sonicwall.js`, 21 modèles (tous les id `v:'sonicwall'` de `data/competitors.js`, aucun ajouté ni retiré). Fichiers de travail dans `sonicwall_caps/` (guides SonicOS en PDF, pages rendues en image).

## Sources

| Clé | Document | Version / date |
|---|---|---|
| ds_tz8 | Gen_8_TZ_Series_Datasheet.pdf (assets-cms.sonicwall.com) | © 2025, SonicOS 8 ; tableaux p.7-8, résumé des fonctions p.10-11 |
| ds_tz7 | FY26_Q3_Gen_7_TZ_Datasheet_Update.pdf | FY26 Q3, SonicOS 7 ; tableaux p.6-7 |
| ds_tz80 | TZ80_Datasheet.pdf | © 2025 ; tableau p.4-5, souscriptions p.6 |
| ds_nsa8 | Datasheet-Gen8-NSa.pdf | métadonnées 2026-10-01, tableaux en image p.5-6, résumé p.7-8 |
| ds_nsa7 | Gen_7_NSa_Datasheet_(1)_-_0815.pdf | 2025-08-15 ; tableaux p.7-8, résumé p.10-11 |
| ds_nssp | Gen_7_NSsp_Datasheet_SonicWall.pdf | métadonnées 2026-10-26 ; tableaux p.5-6, résumé p.7-8 |
| ssl8 | SonicOS 8 SSL VPN Administration Guide (PDF), p.6-7 | SonicOS 8 (note 8.2.2 pour le TZ80) |
| ssl73 | SonicOS 7.3 SSL VPN, page « About SSL VPN » | SonicOS 7.3 |
| users8 | SonicOS 8 Users Administration Guide (PDF), p.7 | SonicOS 8 |
| sw71 | SonicOS 7.1 Switch Network, Daisy-Chaining Switches | SonicOS 7.0 / 7.1 |
| mi_faq, mi_about | KB « NSsp 15700 series FAQs » (2020-11-19) ; About SonicOS 7, Multi-Instance | SonicOSX 7 |
| sec8 | SonicOS 8 Security Services Administration Guide | SonicOS 8 |
| dpissl70 | SonicOS 7.0 DPI-SSL Administration Guide | SonicOS 7.0 |
| suites | sonicwall.com/products/firewalls/security-services | consultée le 2026-11-10 |
| gsg8 | SonicOS 8 NSa Getting Started Guide | SonicOS 8.0 |
| scada | SonicWall Security Center, catégorie SCADA-APPS | base de signatures en ligne |

Versions retenues : SonicOS 8.2.3 (notes de version SonicOS 8, Gen 8 et TZ80), SonicOS 7.3.4 (Gen 7), SonicOSX 7 (NSsp 15700).

Méthode : les tableaux ont été lus sur les pages rendues en image, colonne par colonne. `pdftotext` décale les colonnes des tableaux TZ Gen 8. Par exemple, la ligne « Access points supported » sort en 64/128/128/256/256 alors que la vraie ligne est 16/16/32/32/32. Les valeurs 64/128/256 sont celles des VLAN.

## Taux de remplissage (21 modèles)

| Champ | Rempli | Remarque |
|---|---|---|
| ipsec | 21/21 | ligne « Site-to-site VPN tunnels » |
| ra | 21/21 | le plus élevé entre « IPSec VPN clients (max) » (valeur entre parenthèses) et le maximum SSL VPN |
| vlan | 21/21 | « Logical VLAN and tunnel interfaces » (Gen 8, NSa, NSsp) ou « VLAN interfaces » (TZ Gen 7, TZ80) |
| users | 21/21 | « SAML Single Sign-On Users » / « SSO Users » |
| sslDec | 21/21 | « Maximum connections (TLS) » / « (DPI SSL) » / « MAX DPI-SSL Connections » |
| ap | 21/21 | « Access points supported (maximum) » |
| sw | 6/21 | 8 pour les six modèles Gen 7 TZ/NSa ; non publié pour SonicOS 8 et les NSsp |
| virt / virtBase / virtTerm | 1/21 | NSsp 15700 uniquement (13 instances) |
| rules, nat, addr, addrGrp, svc, zones, routes | 0/21 | non publiés par modèle |

Fonctions : 17 sur 19 renseignées au niveau éditeur. `iot` et `pqc` restent à null.

Exceptions par modèle :
- `wifi:true` pour les TZ280, TZ370, TZ380 et TZ570 (variantes W) ;
- TZ80 : `sdwan:'lic'`, `dlp:null`, `swc:null`.

## Valeurs surprenantes et ambiguïtés

- **Lecture des valeurs VPN « 5 (200) » :** le premier nombre est le nombre d'accès inclus, celui entre parenthèses le maximum avec licences. C'est le maximum qui est retenu.
- **Datasheets et guides SSL VPN ne concordent pas.** On garde la version logicielle courante et les deux valeurs sont dans `src` :
  - TZ80 : 5 au datasheet, 10 depuis SonicOS 8.2.2 (guide et notes de version) ;
  - TZ370 : 100 au datasheet, 200 en SonicOS 7.3 ;
  - TZ570 : 200 au datasheet, 500 en SonicOS 7.3 ;
  - TZ670 : 250 au datasheet, 750 en SonicOS 7.3. C'est le seul modèle où la valeur SSL dépasse le maximum IPsec (500), d'où `ra:750` ;
  - NSa 4800 : 1 000 au datasheet, 1 500 dans le guide SonicOS 8 ;
  - NSa 5700/6700 et NSsp : les valeurs SonicOS 7.3 (3 000 à 8 000) dépassent celles des datasheets (1 500 à 3 000), mais restent sous le maximum IPsec.
- **vlan :** les Gen 8, les NSa et les NSsp publient « Logical VLAN and tunnel interfaces » : VLAN et interfaces tunnel partagent le même plafond.
- **users :** valeur « SAML SSO Users » des datasheets. Le guide Users SonicOS 8 dit que la limite globale d'utilisateurs égale la limite SSO, ce qui justifie le choix. Les datasheets Gen 8 notent que SAML SSO arrive avec SonicOS 8.1, version sortie depuis (on en est à 8.2.3). La « Local user database » (150 à 5 000) n'est pas utilisée.
- **NSsp 15700, multi-instance :**
  - la KB FAQ (2020) annonce 13 instances en autonome, soit 1 racine et 12 filles, et environ 26 en HA ;
  - le guide SonicOSX 7 ne donne pas de plafond : il lie le nombre d'instances aux cœurs CPU et aux licences d'instance créées à l'enregistrement, sans en donner le nombre ;
  - `virtBase:13` repose sur la phrase de la FAQ « There are no extra costs for firewall instances and their security services ». À confirmer si le site doit afficher une base incluse.
- **TZ/NSa et NSsp 10700/11700/13700 :** pas de virtualisation (Multi-Instance réservé au NSsp 15700). On a mis virt à null, pas 0, faute de chiffre publié.
- **sw = 8 :** limite générale « Up to eight Switches » de SonicOS 7.0/7.1, appliquée aux six Gen 7 TZ/NSa. Rien d'équivalent n'est publié pour SonicOS 8 (Gen 8, TZ80). La page About SonicOS ne cite que les TZ et les NSa, même si le datasheet NSsp liste « SonicWall Switch integration ».
- **ztna = 'lic' :** SonicWall Private Access (Cloud Secure Edge) est inclus dans le programme 3&Free ou les bundles 3 ans. Le pare-feu sert de connecteur, la négociation d'accès est cloud. Le classement « porté par le pare-feu » se discute.
- **ai = 'lic' :** RTDMI, l'un des moteurs de Capture ATP, « leverages artificial intelligence and machine learning » (gsg8). L'analyse se fait dans le sandbox cloud, avec Block Until Verdict, pas sur le boîtier.
- **sandbox = 'lic', pas 'lic-local' :** l'analyse se fait dans le cloud Capture ATP, ou sur site avec une appliance séparée (Capture Security appliance, CSa).
- **ot = 'lic' :** signatures SCADA-APPS (Modbus, IEC 104, S7comm) et DNP3 (catégorie PROTOCOLS) dans la base IPS/App Control du Security Center. On ne trouve aucune mention dans les datasheets.
- **TZ80 :** le pare-feu est vendu « subscription-based ». Le SD-WAN y est fourni par les souscriptions Secure Connect Lite / Secure Connect, d'où `sdwan:'lic'`. EPSS n'est pas disponible pour le TZ80 (page des suites).
- **tls = 'lic' :** le guide DPI-SSL SonicOS 7.0 parle d'une « separate, licensed feature », et la suite EPSS inclut « DPI for TLS ».

## Non publié

- **Règles de sécurité, objets adresse, groupes d'adresses, objets service, zones et routes statiques :** aucun maximum par modèle.
  - Les guides SonicOS 7/8 renvoient au TSR de l'appareil (« Max Address Objects Base »).
  - Les zones ne sont limitées que par le nombre d'interfaces, avec au plus deux zones WAN.
- **NAT :** seule une plage générique « 512 - 2048 NAT policies depending on the platform » est publiée (guides Rules and Policies SonicOS 8), sans table par modèle. Le champ est donc laissé à null.
- **Post-quantique (ML-KEM) :** absent des guides SonicOS 8 IPSec VPN et des notes de version 8.2.3 / 7.3.4. Les datasheets publient DH groupes 1, 2, 5 et 14.
- **Profilage IoT :** absent. La rubrique « IoT and Application Control » du datasheet NSsp décrit le contrôle applicatif.
- **Switches gérés en SonicOS 8**, et nombre de licences d'instance livrées sur le NSsp 15700.

## Résumé

1. 21 modèles SonicWall couverts, conformes à competitors.js.
2. Champs VPN, VLAN, utilisateurs SSO, connexions TLS et points d'accès remplis à 100 % depuis les datasheets officielles lues en image.
3. ra = maximum avec licences, en retenant le plus élevé entre IPsec et SSL VPN selon la version courante (SonicOS 8.2.3 / 7.3.4).
4. Écarts datasheet / guide SSL VPN sur 7 modèles, documentés dans src. Une seule valeur ra change : TZ670 à 750.
5. vlan compte VLAN et tunnels ensemble sur la plupart des modèles.
6. Règles, NAT, objets, groupes, services, zones et routes : non publiés par modèle chez SonicWall, null partout.
7. Virtualisation : seul le NSsp 15700 (SonicOSX 7, 13 instances d'après la KB FAQ, sans surcoût selon SonicWall).
8. Switches : 8 par pare-feu pour les Gen 7 TZ/NSa (SonicOS 7.x). Rien de publié pour SonicOS 8 ni pour les NSsp.
9. Fonctions de sécurité toutes sous abonnement. SD-WAN, VPN d'accès distant, contrôleurs Wi-Fi et switch inclus (sauf TZ80, entièrement sous souscription). Sandbox et IA dans le cloud Capture ATP.
10. Pas de post-quantique ni de profilage IoT publiés. Cellulaire par clé USB WWAN. Wi-Fi intégré sur les variantes W des TZ280/370/380/570.

---

# Stormshield SNS : capacités et fonctions par modèle

Relevé du 2026-11-10. 15 modèles (tous les id `v:'stormshield'` de data/competitors.js), aucun ajouté ni retiré.
Logiciel de référence : SNS 5.0.x (5.0.9 est la dernière 5.0 publiée ; les 5.1.x sont en EA). Les datasheets et la matrice indiquent « version 5.x ».

## Sources
- Matrice de gamme : https://www.stormshield.com/wp-content/uploads/SNS-EN-Appliances-Matrix.pdf (Copyright Stormshield 2026.10.22). p.2 « Solutions for infrastructures » (XS à XL), p.1 « Solutions for specific environments » (SNi10/20/50, SNxr1200). Lue en image (le texte extrait a des colonnes décalées).
- Datasheets de chaque modèle (URL = champ `ds` de competitors.js), p.6 VPN/SYSTEM, p.5 FEATURES, p.7 ou p.8 SERVICE PACKS. Versions : XS-170 et M-720/920 2025.10.15 ; S-220/320 2026.10.13 ; M-520 2026.01.06 ; SN1100 2026.01.30 ; L et XL 2026.05.26 ; SNi10/SNi20 2026.06.17 ; SNi50 2026.09.11 ; SNxr1200 v1.7 (2024).
- SNS User Configuration Manual v5.0.8 (08/11/2026) : https://documentation.stormshield.eu/SNS/v5/en/Content/PDF/SNS-UserGuides/sns-en-user_configuration_manual-v5.0.8.pdf
- Nouveautés SNS 5.0.2 (ML-KEM) : https://documentation.stormshield.eu/SNS/v5/en/Content/Release_Notes_SNS/5.0.2-Features.htm

## Taux de remplissage (sur 15 modèles)
| Champ | Rempli | Commentaire |
|---|---|---|
| ipsec | 15/15 | « Nb of IPsec VPN tunnels (1024 kbps per tunnel) » |
| ra | 14/15 | clients/tunnels SSL VPN ; SNxr1200 non publié |
| vlan | 15/15 | plafond commun des interfaces logiques, voir ambiguïtés |
| rules | 11/15 | valeur « specific conf. » ; SNi et SNxr non publiés |
| routes | 11/15 | routes statiques ; SNi et SNxr non publiés |
| virt, virtBase, virtTerm | 0/15 | pas de contexte virtuel publié pour les SNS matériels |
| nat, addr, addrGrp, svc, zones, users, sslDec, ap, sw | 0/15 | non publiés |

Fonctions (niveau éditeur) : ips, av, sandbox, url, app, tls, sdwan, ztna, raVpn, ot, pqc = 'lic' ; wifi = false ; dns, dlp, iot, cell, wlc, swc, ai = null.

## Valeurs surprenantes et écarts entre documents
- **SN-XL-6200, ipsec** : la matrice 2026.10.22 publie 30,000, la datasheet 2026.05.26 publie 23,000. J'ai retenu la matrice, plus récente. L'écart est noté dans src.
- **SNxr1200, ipsec** : la matrice 2026.10.22 publie 500, la datasheet v1.7 (2024) publie 100. Matrice retenue. Les débits diffèrent aussi (matrice : fw 4 Gbps et IPsec 1.7 Gbps ; datasheet et site : 2.4 Gbps et 0.6 Gbps). La datasheet SNxr1200 semble périmée.
- Le nombre de règles plafonne à 32,768 du M-720 au XL-6200. Un XL-6200 n'a donc pas plus de règles qu'un M-720. Même chose pour les routes statiques : 10,240 du L-2200 au XL-6200.
- Le plafond d'interfaces logiques est de 1,336 sur tous les modèles à partir du M-520, SNi50 et SNxr1200 compris.
- Les nombres de règles et de routes ne sont publiés pour aucun SNi.

## Ambiguïtés
- **vlan** : Stormshield ne publie pas de maximum VLAN seul. Il publie « Max number of logical interfaces (agg, dialups, GRE, ipsec, loopback, pptp, vlans) », un plafond commun à tous ces types d'interfaces. Je l'ai repris parce que les VLAN y figurent nommément, et src le dit en clair. Si le site veut un maximum VLAN strict, il faut mettre ce champ à null pour les 15 modèles.
- **rules** : Stormshield publie deux valeurs, « recommanded / specific conf. ». J'ai retenu la seconde (le maximum) et mis la valeur recommandée entre parenthèses dans src.
- **ra** : la datasheet parle de « Nb of SSL VPN clients » et la matrice de « Nb of SSL VPN tunnels », avec les mêmes chiffres. Rien n'est publié pour les clients IPsec mobiles.
- **'lic' et non 'base'** : Stormshield présente toutes les fonctions à l'intérieur des Security Packs (Essential, Industrial pour les SNi, Premium) et ne publie aucune offre matérielle sans pack. IPS, contrôle applicatif, SD-WAN, ZTNA, VPN et post-quantique sont cochés dans tous les packs. Antimalware, sandbox, filtrage URL et DPI industriel sont en option dans Essential et Industrial, et inclus dans Premium. Industrial inclut le DPI industriel mais laisse l'antispam en option.
- **tls** : l'inspection TLS figure dans la liste FEATURES de chaque datasheet (« SSL decryption and inspection ») mais n'a pas de ligne dans le tableau des packs. Je l'ai classée 'lic' comme le reste du moteur NGFW.
- **sandbox** : Breach Fighter est un sandbox cloud hébergé en Europe. La valeur est donc 'lic' et non 'lic-local'.
- **ai** : la seule mention d'IA est « Breach Fighter AI-powered sandboxing », déjà comptée dans sandbox. Aucune détection en ligne par apprentissage automatique n'est publiée, d'où null.
- **pqc** : ML-KEM-512/768/1024 en mode hybride depuis SNS 5.0 (profils PQCEncryption et PQCTransition), en plus des PPK (RFC 8784) depuis SNS 4.8.
- **cell** : le manuel v5.0.8 (p.232) décrit une interface « USB/Ethernet » pour clé modem 4G USB (Huawei HiLink ou profil modem). Aucune datasheet actuelle ne publie de port USB ni de 4G, sauf le SNxr1200, qui a 4 ports USB 2.0 mais sans mention de modem. J'ai laissé null plutôt que d'attribuer la fonction aux modèles.
- **wifi** : aucun modèle de la gamme actuelle n'a de Wi-Fi d'après la matrice et les datasheets. Le chapitre « Wi-Fi interface (WLAN) » du manuel concerne d'anciens modèles W.

## Non publié nulle part (sources officielles consultées)
- Contextes virtuels : SNS n'a pas d'équivalent vsys/VDOM sur les boîtiers matériels. Le manuel ne parle de « virtual firewall » que pour les EVA, des VM.
- Règles NAT, objets adresse, groupes, objets service, zones, utilisateurs identifiés simultanés, sessions TLS déchiffrées. Le manuel indique seulement que le nombre d'utilisateurs authentifiés simultanément « depends on the model », sans chiffre.
- La matrice publie un « NUMBER OF USERS » (Firewall usage et NGFW usage, par exemple 25/10 pour le XS-170). C'est une recommandation de dimensionnement, pas une limite d'utilisateurs identifiés, donc je ne l'ai pas reprise dans users.
- Points d'accès et commutateurs gérés : aucune fonction de ce type n'existe dans la documentation.
- Sécurité DNS, DLP, IoT : aucune fonction publiée. La ligne de pack « Threat intelligence (IP & domains) » ne décrit pas un filtrage DNS.
- Autres limites publiées mais hors brief : routes dynamiques (10,000, et 500,000 pour L et XL), files QoS (100 à 255), passerelles SD-WAN principales/secours (64/64).

## Résumé
1. Les 15 modèles Stormshield sont couverts dans caps_stormshield.js, avec la même liste d'id que data/competitors.js.
2. Sources : matrice SNS 2026.10.22, datasheets des modèles, manuel SNS v5.0.8 et notes de version 5.0.2.
3. ipsec 15/15, ra 14/15, vlan 15/15 (plafond commun d'interfaces logiques), rules 11/15, routes 11/15.
4. Aucun contexte virtuel, aucun nombre d'objets, de NAT, de zones, d'utilisateurs ou de sessions TLS n'est publié.
5. Deux écarts : XL-6200 ipsec 30,000 (matrice) contre 23,000 (datasheet) ; SNxr1200 ipsec 500 contre 100. J'ai retenu la matrice, plus récente.
6. Le champ vlan est à revoir : il reprend un plafond commun « interfaces logiques », à passer à null si le site veut un maximum VLAN strict.
7. Toutes les fonctions sont 'lic', car Stormshield les vend dans des Security Packs (Essential, Industrial, Premium). Antimalware, sandbox, URL et DPI industriel ne sont inclus que dans Premium (le DPI industriel aussi dans Industrial).
8. Post-quantique publié : ML-KEM hybride depuis SNS 5.0. Sandbox cloud uniquement (Breach Fighter).
9. Wi-Fi absent de toute la gamme actuelle ; 4G seulement par clé USB d'après le manuel, non attribuée aux modèles.
10. DNS, DLP, IoT, IA en ligne, contrôleurs AP et switch : null.
