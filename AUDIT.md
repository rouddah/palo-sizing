# Audit palo-sizing.pages.dev

> Audit réalisé le 29 juin 2026 à partir des fichiers fournis (index.html, prisma.html, cortex.html, panorama.html, browser.html, pa-series.html, search.html, header.js, styles.css, PA-Series-Complete-Specs.md). Le fichier links.js (référencé par index.html ligne 51) n'a pas été fourni et n'a pas été audité.

## TL;DR

Le site est globalement bien tenu et largement plus à jour que la moyenne des contenus partenaires que je vois. Les vrais sujets sont :

1. **prisma.html** : la page est bonne sur l'essentiel (3 éditions correctes, Precision AI Pro Bundle correct, Device Security correct) mais a une carte « IoT Security » résiduelle dans les add-ons (ligne 299-305) qu'il faut renommer **Device Security** pour rester cohérent avec le reste de la page.
2. **cortex.html** : utilise **Cortex Data Lake (CDL)** alors que prisma.html parle de **Strata Logging Service**. C'est le même produit renommé. Incohérence à corriger.
3. **cortex.html** : il manque **Cortex Cloud** (annoncé fév. 2025, version 2.0 oct. 2025, remplaçant Prisma Cloud). C'est un trou produit à combler.
4. **search.html (sizing tool)** : 100 % orienté technicien (mode TP/FW/VPN, sessions concurrentes, interfaces 100G, etc.). Pas de mode « guidé business » pour un AM ou un partenaire commercial.
5. **pa-series.html** fait 2 750 lignes et `search.html` 1 066 lignes : c'est ça la sensation de « brouillon » que tu décris. La page n'est pas fausse, elle est juste écrasante.
6. **Mention manquante** : la transition GlobalProtect → **Prisma Access Agent** (EoS des SKU GP sur form factor NGFW depuis 15 août 2025).
7. **Mention manquante** : **Idira**, nouveau pilier identity sécurité lancé 12 mai 2026. Hors scope possible mais à arbitrer.

---

## Corrections factuelles ligne par ligne

### prisma.html

| Ligne | Problème | Correction |
|-------|----------|-----------|
| 70 | « GlobalProtect · Remote Networks · Service Connections » dans le sous-titre. GlobalProtect comme nom de fonctionnalité reste valide côté Prisma Access, mais à clarifier vu que les SKUs GP sur form factor NGFW sont EoS. | Garder GlobalProtect (c'est encore la fonction côté PA) mais ajouter dans la note d'intro la transition vers **Prisma Access Agent** pour les SKU NGFW. |
| 92 | « 150+ PoP mondiaux » | Palo Alto communique officiellement « 100+ locations » (datasheet Prisma Access spec sheet) et 150+ apparaît dans certains decks marketing. Garder « 100+ » est plus défendable, ou source claire si tu veux 150+. |
| 94 | « SLA de disponibilité 99.999% » | Confirmé OK (datasheet officielle). |
| 158-159 | Carte CDSS « IoT / Device Security » : l'intitulé est ambigu | Renommer simplement « **Device Security** » (suffit, le « ex-IoT/OT Security » est déjà mentionné plus haut). |
| 220 | « GlobalProtect (150+ PoP, 99.999% SLA) » dans le tableau d'éditions MU | OK fonctionnellement, mais cohérence du chiffre à arbitrer (cf. ligne 92). |
| 299-305 | Add-on « **IoT Security** » avec SKU `PAN-PRISMA-ACCESS-IOT` | Renommer en **Device Security**. La transition IoT → Device Security est effective depuis le 15 août 2025. Garder le SKU si confirmé. |
| 222 / 242 | « Strata Logging Service » apparaît comme « add-on » dans toutes les éditions MU et NET | Vérifier : sur Prisma Access, SLS est en pratique requis (toute la doc PAN dit `Required` pour SLS). Le présenter comme add-on optionnel peut induire en erreur. Si la SKU est bien vendue à part (ce qui est le cas) mais conditionne le fonctionnement, écrire plutôt « inclus de base / SKU à dimensionner séparément » ou « obligatoire, dimensionné séparément ». |
| 219 | « Strata Cloud Manager (base) » coché partout | Préciser que c'est **SCM Essentials** (gratuit avec PA). SCM Pro est add-on payant (ce que la ligne 289 mentionne déjà). Clarifier dans une note. |
| 416 | « Optionnel sur cette page (composant reseau distinct du composant securite) » | OK mais Prisma SD-WAN reste un produit à part entière. Pas une erreur, juste un choix éditorial. |

### cortex.html

| Ligne | Problème | Correction |
|-------|----------|-----------|
| 194 | Sous-titre : « Cortex XDR · XSIAM · XSOAR · Xpanse · **Cortex Data Lake** » | Remplacer Cortex Data Lake par **Strata Logging Service** (renommage officiel). Ou supprimer carrément (CDL n'est pas un produit Cortex « vitrine » au même niveau que les 4 autres). |
| 197-205 | Note source en commentaire : « Aucun deck de licensing Cortex fourni » | Vrai. Ajouter dans la bibliographie : page produit Cortex Cloud (cortex/cloud), page produit Cortex AgentiX (annonce oct. 2025), changelog XSIAM 3.0. |
| 211 | « Vue d'ensemble — **4 produits** Cortex » | Devrait être **5 produits** au minimum : XDR, XSIAM, XSOAR/AgentiX, Xpanse, **Cortex Cloud** (remplaçant Prisma Cloud, lancé fév. 2025, v2.0 oct. 2025). Manquant en totalité de la page. |
| 233 | XSIAM « Inclut XDR, XSOAR et **CDL** » | Remplacer CDL par **Strata Logging Service**. |
| 244 | XSOAR « 900+ intégrations » | Vérifié OK pour XSOAR. Note : AgentiX annonce 1 000+ intégrations. |
| 251-256 | Carte Xpanse | OK. |
| 446 (rang après ligne 247) | Aucune carte « Cortex Cloud » | À ajouter : CNAPP + CDR, remplace Prisma Cloud, lancé fév. 2025, v2.0 disponible depuis oct. 2025. |
| 588 | « ⚙️ Cortex AgentiX / XSOAR (inclus) » | OK. Confirmer que la note de transition est à jour : AgentiX standalone est dispo depuis début 2026, plus seulement « expected ». |
| 592 | « 🗄️ Cortex Data Lake (CDL) » dans les modules XSIAM | Remplacer par **Strata Logging Service**. |
| 605 | « Email Security (XSIAM 3.0) » | Vérifié : XSIAM 3.0 a effectivement annoncé Email Security native. OK. |
| 609 | « Exposure Management (XSIAM 3.0) » | OK. Préciser que **Cortex Exposure Management** est aussi vendu standalone (priorisation vuln cross enterprise/cloud, page produit officielle). |
| 778-781 | Note de transition vers AgentiX | OK mais à raffraîchir : standalone disponible depuis début 2026 (plus « attendu »). |
| 800 (ligne tableau XSOAR) | « XSIAM (inclus) » | OK. |
| 845 | Section Xpanse | OK. |
| 1004-1037 | Ressources officielles : aucun lien vers Cortex Cloud | Ajouter `paloaltonetworks.com/cortex/cloud`. |

### panorama.html

| Ligne | Problème | Correction |
|-------|----------|-----------|
| 96 | Note sur Panorama VM standard 1 000 devices | OK, c'est documenté côté PAN. |
| 99-101 | Pas de mention que **Strata Cloud Manager** remplace progressivement Panorama pour les déploiements cloud-first et que **ESA Pro** (nov. 2025) inclut désormais SCM | Ajouter une ligne dans la note d'intro. |

### browser.html

| Ligne | Problème | Correction |
|-------|----------|-----------|
| 174 | « Acquis via Talon (nov. 2023) » | Vérifié OK (acquisition Talon Cyber Security 2023, ~625 M$). |
| 517 | « ... le nom **Prisma Access Browser** » | Cohérence : la page principale s'appelle « Prisma Browser » dans le header (header.js ligne 75 : « Prisma Access Browser » dans le sous-titre du dropdown, mais la card-name dit « Prisma Access Browser »). Vérifier que le naming est cohérent partout : la marque officielle actuelle est « **Prisma Access Browser** » (incluant « Access »). |

### header.js

| Ligne | Problème | Correction |
|-------|----------|-----------|
| 75 | « Cortex » dropdown sub-titre : « XDR · XSIAM · XSOAR · Xpanse » | Ajouter **Cortex Cloud** : « XDR · XSIAM · XSOAR · Xpanse · Cloud » |
| (partout) | Aucune entrée pour **Idira** dans le nav | À arbitrer : si tu vises la couverture complète du portefeuille, ajouter une carte/page Idira. Sinon, le mentionner brièvement quelque part. |

### index.html / links.js

| Fichier | Problème | Correction |
|---------|----------|-----------|
| links.js | Non fourni, non auditable | À fournir pour audit complet. |

### search.html (l'outil de sizing)

| Ligne | Problème | Correction |
|-------|----------|-----------|
| 541-664 | Tout le panneau de filtres est en jargon technicien : « Mode de débit (TP/FW/VPN) », « Sessions concurrentes min. », « Interfaces minimum requises 100G QSFP28 », « PoE requis » | Garder ce mode pour les techs, **mais ajouter un mode d'entrée alternatif** : un wizard à 5-7 questions business (cf. plus bas). |
| (toute la page) | Pas de carte d'entrée « **Je débute** » ou « **Mode guidé** » | Ajouter sur l'index ET sur search.html une bascule très visible « **Mode guidé (non-technique)** » qui ouvre le wizard. |

---

## Trous produit identifiés

| Produit | Date d'apparition / changement | Présent sur le site ? | Action |
|---------|-------------------------------|----------------------|--------|
| **Cortex Cloud** (remplace Prisma Cloud) | Annoncé fév. 2025, v2.0 oct. 2025 | Non | À ajouter dans cortex.html et dans le dropdown |
| **Cortex AgentiX** (remplace XSOAR) | Lancé 28 oct. 2025 | Oui (cortex.html) | OK, raffraîchir la note de transition |
| **Cortex Exposure Management** | Disponible | Mentionné brièvement dans XSIAM 3.0 | OK |
| **Device Security** (remplace IoT Security) | 15 août 2025 | Oui mais carte « IoT Security » résiduelle | À corriger (prisma.html L299-305) |
| **Prisma Access Agent** (remplace GP SKU sur NGFW) | 15 août 2025 | Non | À mentionner dans prisma.html intro |
| **Precision AI Pro Bundle** (remplace CORESEC) | 18 déc. 2025 | Oui | OK |
| **Strata Logging Service** (renommage CDL) | OK | Partiel (prisma OK, cortex KO) | Cohérence à faire sur cortex.html |
| **ESA Pro** (remplace ESA) | 1er nov. 2025 | Non | À mentionner sur panorama.html |
| **Prisma AIRS 2.0** (remplace CN-Series) | oct. 2025 | Non | À mentionner brièvement |
| **ELA8** (remplace ELA classique) | EoS legacy ELA 20 août 2026 | Non | Hors scope distributeur probablement |
| **Idira** (Identity Security platform) | 12 mai 2026 | Non | À arbitrer (nouveau pilier produit) |

---

## Conclusion pratique

Si tu corriges juste les 7 points TL;DR + les 2-3 lignes les plus visibles (CDL → SLS, IoT → Device Security partout, ajout Cortex Cloud, mode guidé sur search.html), tu as fait 80 % du boulot. Le reste relève de polissage et d'ajouts produit progressifs.

Le sujet « brouillon » que tu décris est essentiellement **pa-series.html (2 750 lignes)** et **search.html (1 066 lignes)**. Ce sont des pages qui ne sont pas fausses, juste trop denses pour un premier contact non-tech. La réponse n'est pas de les amaigrir (l'info est utile aux techs) mais de **mettre une porte d'entrée séparée** : un wizard business qui sort une recommandation en 30 secondes avec un lien « Voir le détail technique → » qui amène vers la page existante.
