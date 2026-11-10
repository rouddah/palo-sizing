# Audit des pages produit au 6 novembre 2026

Pages relues : `cortex.html`, `browser.html`, `idira.html`, `panorama.html`,
`prisma.html` (onglets Prisma Access, Prisma SD-WAN, Prisma Browser),
`resources.html` et les entrées correspondantes de `links.js`.
Contenu précédent daté d'août 2026, jamais recontrôlé depuis.

Sources publiques utilisées (les présentations Palo Alto Networks non publiques
ne sont citées que sous ce nom) :

- Documentation Cortex (`cortex-docs.paloaltonetworks.com`) : plan de licence
  Cortex XDR, rétention XDR, paliers de licence XSIAM, rétention XSIAM,
  licences Cortex AgentiX, cycle de vie XSOAR 6, matrice de compatibilité de
  l'agent Cortex XDR (Windows, Mac, Linux, mobile), cadences de scan Xpanse.
- Blog Palo Alto Networks « What's New in Cortex » (19 mai 2026, 30 juillet 2026).
- Annonce Cortex XDR One et Cortex Agentic Endpoint Security (22 octobre 2026,
  reprise par la presse : « available immediately »).
- Page officielle End-of-Sale (relevée le 6 novembre 2026).
- Datasheet Prisma Access (référence `prisma_ds_prisma-access_022626`, février 2026)
  et Prisma Access Licensing Guide (`..._060526`, juin 2026).
- Documentation Panorama « Panorama Models » ; LIVEcommunity « Breaking Barriers
  in Log Ingestion: 1 Million Logs/sec with Panorama ».
- Blog « Redefining Network Security for the Frontier AI Era » (PAN-OS 12.2 Ceres,
  août 2026) ; page produit Idira ; annonce Idira (12 mai 2026) ;
  annonce Prisma AIRS 3.0 (23 mars 2026) ; Prisma Browser for Business (mars 2026).
- Webinaire public Prisma SASE « Safeguard your Sensitive Data » (mai 2026).
- Présentations Palo Alto Networks (2026) : portefeuille Cortex (août 2026),
  Cortex XDR One (octobre 2026), Exposure Management, Prisma SD-WAN (mai 2026),
  Prisma Browser RDP/SSH natif (mai 2026), FAQ PAN-OS 12.2.

Captures avant/après : `~/Downloads/_palosizing_v12` (`avant-*` et `apres-*`,
1440 et 390 px, thème sombre).

## cortex.html

| Affirmation | Avant | Après | Source |
| --- | --- | --- | --- |
| Note de source | « Aucun deck de licensing fourni », éditions à confirmer | Sources nommées (docs de licence, blog, annonce XDR One), versions au 6 nov. | docs Cortex, blog |
| Versions | aucune (XSIAM 3.5 implicite) | XSIAM 3.6, XDR 5.2, AgentiX 1.4, XSOAR 8.15, Xpanse 2.14 | blog What's New juillet 2026 |
| XDR One / AES | absent | XDR One = XDR Pro + Agentic Endpoint Security, disponible depuis le 22 oct. 2026 ; AES seul avec agent « Targeted » à côté d'un EDR tiers ; Managed AES Unit 42 ; faux positifs jusqu'à -95 % (attribué) | annonce 22/10/2026, plan de licence XDR, présentation PAN |
| Éditions XDR | Prevent / Pro per Endpoint / Pro per TB | Prevent / Pro per Endpoint (Pro EP, EP Cloud) / Pro per GB / XDR One ; liste des modules en option | plan de licence XDR |
| SKU XDR | PAN-XDR-PRT, PAN-XDR-PRO-EP, PAN-XDR-PRO-TB | ligne retirée (références non vues à la source) | règle « pas de SKU non vu » |
| Rétention XDR | 30 j / 30 j / 12 mois inclus | Prevent : cas 186 j ; Pro : données ingérées 31 j, cas 186 j, extension en option | docs « Data retention in Cortex XDR » |
| Réponse automatisée | « Add-on XSOAR » / « inclus XSIAM » | playbooks inclus, AgentiX intégré à XDR | présentation XDR One, docs AgentiX |
| Compatibilité OS | agent 8.9, Win 7 SP1, Server 2008 R2, macOS 10.13+, iOS 15+, Android 5+ | agent 9.3 : Win 10/11 (x64, ARM), Server 2012 à 2025, macOS 14 à 27, Linux par famille, Android 8 à 16, iOS 16+ ; Win 7 / 2008 R2 seulement via 7.9.103-CE (fin 2026 / fin 2027) | matrice de compatibilité agent |
| Version agent | 8.9 (juillet 2025) | 9.3 | matrice de compatibilité |
| Rétention hot XDR Pro | 30 j | 31 j | docs rétention |
| « 1 100+ content packs XSOAR » | content packs | 1 100+ intégrations Cortex (attribué) | présentation portefeuille Cortex, août 2026 |
| Note XQL | 30 j (Pro/EP) ou 12 mois (Pro/TB, XSIAM) | 31 j données, 186 j cas et requêtes, add-ons | docs rétention XDR et XSIAM |
| MITRE « Turla 2024, 100 % bloqué » | Turla daté 2024 (Turla = Round 5, 2023) | Prévention Round 6 : meilleur taux, sans faux positif (attribué) | présentation XDR Acceleration |
| AV-Comparatives EPR | 99 %/99 % 2025 | idem + certifié EPR 7 ans de suite (attribué) | présentation XDR One |
| « 98 % réduction alertes » (tableau MITRE) | ligne sans rapport avec MITRE | SE Labs Ransomware 2026 100 % + Gartner MQ EPP 2026 Leader (4e année) | présentation XDR One, FAQ Gartner 2026 |
| XSIAM inclusions | « inclut XDR Pro, XSOAR et Strata Logging Service » | paliers NG-SIEM / Enterprise / Premium et leur contenu ; Enterprise Plus en EoS depuis 30/04/2025 | docs paliers XSIAM, page EoS |
| Data lake XSIAM | Strata Logging Service, 15 PB/j max, 12 mois défaut, 24 mois en option | Cortex Extended Data Lake : palier Analytics (min. 100 Go/j), palier Data Lake (min. 50 Go/j), rétention 31 j / 186 j | docs XSIAM, présentation portefeuille |
| Volume | « capacité max 15 PB/jour » | 17 PB/jour traités par la plateforme (attribué, pas une limite) | présentation portefeuille, août 2026 |
| Modèles ML | 2 900+ ML + 2 600+ analytiques | 3 600+ modèles ML, 13 300+ détecteurs (attribué) | présentation portefeuille |
| Réduction bruit | « jusqu'à 99 % » | backlog -75 % par regroupement, 90 % des cas clos par automatisation (attribué) | présentation portefeuille |
| TIM | « entraîné sur 1,2 Md d'exécutions » (phrase d'AgentiX) | TIM + Extended Threat Intel (XTI, juillet 2026), inclus en Premium | blog juillet 2026, docs XSIAM |
| Advanced Email Security | « intégré à XSIAM », LLM | add-on XSIAM et XDR, API, sans toucher au flux | docs licence XDR/XSIAM |
| Exposure Management | « intégré Xpanse » | add-on XSIAM et XDR, scanners natifs et tiers, -99 % de bruit (attribué) | blog juillet 2026, présentation Exposure Management |
| Connecteurs | 1 000+, « QRadar SaaS (acquis 2024) » | 1 100+ ; QRadar SaaS en fin de vie avril / août 2026 | présentation portefeuille, page EoS |
| Compression « 1 Go raw ≈ 0,2-0,3 Go CDL » | non sourcé | retiré, remplacé par les minimums de palier | docs XSIAM |
| FedRAMP « 6 branches US Military » | non sourcé | retiré, « FedRAMP High » conservé | |
| AgentiX | « Disponible oct. 2025 », « entraîné sur 1,2 Md d'exécutions XSOAR » | annoncé oct. 2025, AgentiX 1.4 juillet 2026, agents nommés, 1,2 Md d'exécutions de playbooks (attribué), FedRAMP Moderate et High | datasheet AgentiX, blog juillet 2026 |
| Transition XSOAR | « standalone depuis début 2026 », « SKU PS XSOAR EoS oct. 2025 » | AgentiX vendu seul ; XSOAR 8.15 et 6.14 supportés, 6.12/6.13 EoL 30/06/2026 ; SKU PS XSOAR EoS 1er février 2026 | docs cycle de vie XSOAR 6, page EoS |
| Tableau éditions XSOAR | Community (gratuit, 5 users) / Essentials / Enterprise | AgentiX Base / Enterprise / inclus XSIAM (utilisateurs, compute units, historique, flux TI) ; Community EoL 15/08/2024 | docs licences AgentiX, cycle de vie XSOAR |
| Xpanse | « IPv4 entier plusieurs fois par jour, 500 Md ports/jour, +35 % d'assets, 25 % RDP, 45 min, 3 sem. » | cadences documentées : base ~250 ports 2 fois/semaine, protocoles sensibles plusieurs fois/jour, services actifs quotidiens ; chiffres non sourcés retirés | docs Xpanse « Scanning cadences » |
| Guide de dimensionnement | XDR Pro/TB « à partir de ~1 000 endpoints », XSOAR standalone, MSSP « XSIAM + XSOAR Enterprise » | Pro per GB, AgentiX autonome, XSIAM multi-tenant, ligne XDR One / AES | docs licences |
| Cortex Cloud | « transition automatique » | migration accompagnée, migration auto d'une partie des configurations ; trois modules | présentation Cortex Cloud |
| Liens | docs.paloaltonetworks.com/cortex/cortex-xdr (404), attackevals.mitre-engenuity.org (hors ligne) | cortex-docs.paloaltonetworks.com/cortex-xdr, evals.mitre.org | contrôle HTTP 6/11 |

## browser.html

| Affirmation | Avant | Après | Source |
| --- | --- | --- | --- |
| Nom | « Prisma Access Browser » en titre | Prisma Browser (ex-Prisma Access Browser) | datasheet Prisma Access, guide de licences |
| PoP | 100+ | 150+ | datasheet Prisma Access |
| Talon | « acquis pour ~625 M$ » | annonce nov. 2023, montant « selon la presse » | |
| Enterprise DLP inline | « Add-on » (contredisait le tableau d'éditions) | inclus dans les trois éditions ; extension aux applications lourdes en Pro | catalogue, guide de licences |
| RDP / SSH natif | absent | ligne Pro « RDP/SSH natif sans traduction HTML, sans add-on » | présentation PAN mai 2026 |
| Édition Pro | Web PAM | + credentials Idira, DLP applications lourdes, ADEM RUM | guide de licences juin 2026 |
| Nouveautés 2026 | absentes | PAN-OS 12.2 (visibilité NGFW du navigateur), intégration Cortex XDR 5.2, Prisma Browser for Business (PME, mars 2026) | blog Ceres, blog Cortex juillet 2026, presse mars 2026 |
| PAN-DB « 85+ catégories » | non sourcé | retiré | |
| « PAB » | sigle interne | Prisma Browser | |
| Commentaire HTML | « deck de licensing fourni par l'utilisateur » | sources publiques | règle « pas de document interne » |
| Liens | sase/prisma-access-browser (redirigé), docs .../prisma-access-browser (404) | sase/prisma-browser, docs.paloaltonetworks.com/prisma-browser | contrôle HTTP |

## idira.html

| Affirmation | Avant | Après | Source |
| --- | --- | --- | --- |
| Statut | « quatrième pilier », « licensing et SKU en cours de finalisation » | lancée et disponible le 12 mai 2026, domaine Identity du portefeuille | annonce 12/05/2026, page produit |
| Identités agentiques | « Cortex AgentiX intégré » | Secure AI Agents : découverte, contrôle, accès juste-à-temps, traçabilité | page produit, fiche Secure AI Agents |
| Identités machine | Secrets Management | + Secrets Hub, Certificate Manager | page produit |
| Certificate Manager | absent | offres SaaS CyberArk Certificate Manager & co en EoS le 3 mai 2027, remplacées par NGTS | page EoS (annonce 3/11/2026) |
| Intégrations | « XSIAM, Prisma Access (User-ID, ZTNA), SCM », non sourcé | XSIAM 3.5 (réponse tenant compte des privilèges), Prisma Browser Pro (credentials Idira) | blog Cortex mai 2026, guide de licences |
| Écosystème | 300+ intégrations | 300+ intégrations, 200+ partenaires | page produit |
| Accents | texte sans accents | accents rétablis | |

## panorama.html

| Affirmation | Avant | Après | Source |
| --- | --- | --- | --- |
| VM en Management Only | « ingère 20 000 logs/s, 24 TB » | 20 000 logs/s et 24 TB en mode Panorama (Log Collector local) ; en Management Only, logs vers un Dedicated Log Collector | docs Panorama Models |
| VM appareils gérés | 2 500 (Management Only) | licences 25, 100, 1 000, jusqu'à 2 500 | docs Panorama Models |
| Hyperviseurs VM | ESXi / KVM / Hyper-V | + AWS, GovCloud, Azure, GCP, OCI, Alibaba | docs Panorama Models |
| M-600 | « plus au catalogue » | End of Sale depuis le 15 février 2024 | page EoS |
| Mode legacy | absent | non supporté depuis le 1er sept. 2025 | docs Panorama Models |
| M-700 Collector Groups | absent | jusqu'à 1 M logs/s (attribué) | LIVEcommunity |
| Version | absente | PAN-OS / Panorama 12.2 Ceres, GA 30/07/2026, annoncée 04/08/2026 ; six Network Security Agents dans SCM | blog Ceres, FAQ PAN-OS 12.2 |

Non modifié, toujours en attente (`_to_verify.md`) : logs/s en mode mixte des
M-Series, stockage M-300 (4 TB affiché, 16 TB au catalogue).

## prisma.html

### Onglet Prisma Access

| Affirmation | Avant | Après | Source |
| --- | --- | --- | --- |
| GlobalProtect | « SKU GP EoS, nouveaux déploiements en Prisma Access Agent » | idem + « Prisma Agent », pas d'EoL de GlobalProtect, licence couvrant les deux | page EoS, docs Prisma Agent |
| Mobile Users | « GlobalProtect avec ZTNA 2.0 », par user/an | GlobalProtect, Prisma Agent ou Explicit Proxy, par utilisateur/an | guide de licences |
| Remote Networks | « vendu par Mbps/an » | par site ou par Mbps, par an | guide de licences |
| PoP | 150+ | 150+ sur AWS, Google Cloud, OCI ; SASE Private Location | datasheet Prisma Access |
| URL Filtering | « 85+ catégories » | 3,8 Md de nouvelles URL analysées/jour | datasheet Prisma Access |
| NG-CASB | 66 000+ apps SaaS, 25+ API | 85 000+ apps SaaS (attribué), SSPM | webinaire Data Security mai 2026 |
| AI Access | 600+ apps GenAI | 5 000+ (attribué) | webinaire Data Security |
| Enterprise DLP | 1 000+ classificateurs, 22 profils réglementaires | 1 000+ identifiants de données, ML et LLM ; « 22 profils » retiré | webinaire Data Security |
| Device-ID | 3 600+ attributs | retiré (non sourcé) | |
| Add-ons | deux grilles MU/RN avec 19 références PAN-PRISMA-ACCESS-* | une grille de 17 add-ons alignée sur le guide de juin 2026, sans référence | guide de licences ; références jamais recontrôlées |
| Pro Bundle | EoS ancien bundle | + commandable depuis le 18/12/2025 ; ATP+ / Frontier Virtual Patching avec 12.2 | page EoS, blog Ceres |
| Commentaires HTML | « deck fourni par l'utilisateur » | sources publiques | |

### Onglet Prisma SD-WAN

| Affirmation | Avant | Après | Source |
| --- | --- | --- | --- |
| ION 1200 / 1200-S | « LTE optionnel » | ports, variantes LTE et 5G (C5G) | présentation SD-WAN mai 2026 |
| ION 3200H | rugged | -40 à +70 °C (DC), IEEE 1613, IEC 61850-3, variante 5G | idem |
| ION 5200 / 9200 | « multi-gig » | ports détaillés, PoE++, bypass, FIPS 140-3 / alimentations redondantes | idem |
| vION | 100 / 200 / 350 Mbps | conservé (datasheet) ; écart avec 0,7 / 1,1 / 1,8 Gbps de la présentation signalé | datasheet avril 2026 vs présentation mai 2026 |
| SD-WAN et compteur par site | absent | abonnement SD-WAN compris selon le palier | guide de licences |

### Onglet Prisma Browser

Édition Enterprise de Prisma Access incluant Prisma Browser Core, Prisma
Browser for Business, contenu de l'édition Pro (guide de licences) ; référence
`PAN-PRISMA-ACCESS-SEB-UPG` retirée (non recontrôlée) ; « 600+ apps GenAI » retiré.

## resources.html et links.js

- Date « liens valides au 29 juin 2026 » remplacée par « vérifiés le 6 novembre 2026 ».
  87 liens testés en HTTP : 404 corrigés (docs Cortex XDR, docs Prisma Browser,
  pan.dev/access, datasheet PA-7500), redirections remplacées par leur cible
  (cortex-docs, sase/prisma-browser, ai-security/prisma-airs, Unit 42 MDR,
  evals.mitre.org).
- Ajouts : Cortex Exposure Management, Cortex Agentic Endpoint Security,
  Cortex Advanced Email Security, NGTS (docs), Prisma Browser (docs),
  datasheets PA-1500, PA-3500, PA-5500.
- Software Firewalls : CN-Series en End of Sale au 1er novembre 2026, remplacé
  par AI Runtime Firewall (page EoS) ; AIRS « 2.0, oct. 2025 » devenu
  « Prisma AIRS 3.0, mars 2026 ».
- Liens obsolètes ajoutés : docs-cortex, attackevals.mitre-engenuity.org,
  sase/prisma-access-browser, CN-Series.
- `links.js` : Cortex (AgentiX, XDR One), Prisma Browser, 150+ PoP, AIRS 3.0,
  Idira.

## Restes et points ouverts

- `wizard.html` mentionne encore « Worldwide Edition : accès aux 100+ PoP » (hors
  périmètre de cette passe).
- `panorama.html` : alignement de colonnes du tableau (lignes à 5 cellules pour 6
  colonnes), défaut antérieur non traité.
- Colo-Connect : 100 Gbps par région (datasheet février 2026) contre 20 Gbps
  (guide de licences juin 2026), aucun chiffre affiché.
- Voir `_to_verify.md`, section « Pages produit, audit du 6 novembre 2026 ».
