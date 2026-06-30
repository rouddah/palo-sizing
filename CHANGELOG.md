# Changelog

## [Session 2] — 30 juin 2026

### wizard.html (réécriture totale v2)
- feat: v2 complète — spec WIZARD_V2_DELTA.md implémentée
- feat: seuils commerciaux — Prisma Access < 200 unités → encart jaune avec alternatives
- feat: seuils commerciaux — Cortex < 200 endpoints → XDR Prevent ou MSSP
- feat: Local Edition (< 1000 unités) vs Worldwide Edition (>= 1000)
- feat: sizing NGFW recalibré — 13 paliers PA-410 → PA-7500 (source WIZARD_V2_DELTA.md)
- feat: Q3 tailles de site recalibrées — Tres petit 20 Mbps / Petit 50 / Moyen 100 / Grand 250 / Tres grand 500
- feat: formulations Q1-Q7 exactes conformes spec v2
- feat: bouton Export — génère texte markdown copiable + copie dans le presse-papier si disponible
- feat: add-ons ADEM (users_remote > 500), App Acceleration (site_size >= Moyen)
- feat: mention Cortex Cloud sur le bloc SecOps
- fix: classe sessionStorage key renommée wiz_state
- fix: classes CSS préfixées .wiz-

### pa-series.html
- fix: 4 occurrences "IoT Security" → "Device Security" (lignes 1174, 1361, 1365, 2390)

### links.js
- fix: "IoT Security" → "Device Security" dans description Subscriptions NGFW
- fix: "150+ Points of Presence" → "100+" (cohérence avec prisma.html)
- feat: ajout carte AI Runtime Security (AIRS) dans catégorie SASE & Cloud
- feat: ajout catégorie "Identite" avec 5 cartes Idira (PAM, IAM, EPM, Agentic, overview)

### header.js
- feat: ajout entrée Idira dans le dropdown Produits
- feat: ajout nav-btn "Mode guide" pointant vers wizard.html

### browser.html
- fix: "150+ mondiaux" → "100+ mondiaux" dans le noeud Prisma Access PoP (cohérence)
- feat: lien "Toutes les ressources" ajouté en bas de section Ressources

### cortex.html
- feat: lien "Toutes les ressources" ajouté en bas de section Ressources officielles

### prisma.html
- feat: section Ressources ajoutée (4 liens : page produit, licensing guide, docs, LIVEcommunity)
- feat: lien "Toutes les ressources" vers resources.html

### panorama.html
- feat: section Ressources ajoutée (4 liens : Panorama, SCM, Compatibility Matrix, LIVEcommunity)
- feat: lien "Toutes les ressources" vers resources.html

### pa-series.html
- feat: lien "Toutes les ressources" ajouté dans le footer

### resources.html (nouveau)
- feat: page dédiée avec 9 catégories de liens validés (portails, pages produit, datasheets, docs, EoS/EoL, formation, benchmarks, partenaires, liens obsolètes)
- feat: tableau "Liens à ne plus utiliser" (Beacon, Prisma Cloud, CDL docs, GP NGFW SKUs)

### idira.html (nouveau)
- feat: page Idira avec 3 domaines (humain, agentique, machine), tableau des 7 composants
- feat: note d'intro : nouveau pilier identite, détails SKU en attente, contacter SE

---

## [Refonte ciblée] — 29 juin 2026

### prisma.html
- fix: sous-titre page-header mis à jour avec mention Prisma Access Agent (ex-GlobalProtect SKUs)
- fix: info-note transition GlobalProtect SKUs ajoutée avant le bloc architecture overview
- fix: "150+ PoP mondiaux" → "100+ PoP mondiaux" (carte PoP + tableau MU + note connectivité)
- fix: carte CDSS "IoT / Device Security" renommée en "Device Security"
- fix: add-on "IoT Security" renommé en "Device Security" dans la section add-ons MU (SKU conservé)
- fix: "Strata Cloud Manager (base)" → "Strata Cloud Manager Essentials" + ligne séparée "Strata Cloud Manager Pro (Add-on)"
- fix: "Strata Logging Service" reformulé en "requis · SKU séparée" dans les tableaux MU et NET

### cortex.html
- fix: sous-titre page-header : "Cortex Data Lake" → "AgentiX · Cortex Cloud"
- fix: "Vue d'ensemble — 4 produits" → "5 produits"
- feat: ajout 5e product-card Cortex Cloud (CNAPP + CDR, remplace Prisma Cloud, v2.0 oct. 2025)
- fix: XSIAM card-desc : "Inclut XDR, XSOAR et CDL" → "Inclut XDR, AgentiX et Strata Logging Service"
- fix: module XSIAM "Cortex Data Lake (CDL)" → "Strata Logging Service (ex-CDL)"
- fix: note transition AgentiX rafraîchie (standalone disponible début 2026)
- feat: lien ressource Cortex Cloud ajouté dans la section Ressources officielles

### panorama.html
- fix: note d'intro enrichie avec mention ESA Pro (1er nov. 2025, inclut SCM)
- fix: note bas de page reformulée pour Strata Cloud Manager vs Panorama

### header.js
- fix: sous-titre dropdown Cortex : "XDR · XSIAM · XSOAR · Xpanse" → "XDR · XSIAM · AgentiX · Xpanse · Cloud"

### index.html
- feat: carte "🧙 Mode guidé (non-technique)" ajoutée en tête de page (lien vers wizard.html)

### search.html
- feat: bandeau discret ajouté en haut de page "Pas à l'aise avec les filtres techniques ? Essayez le mode guidé →"

### wizard.html (nouveau)
- feat: page wizard complète — 7 questions business linéaires avec progress bar
- feat: Q1-Q2 nombre d'utilisateurs on-site / en mobilité
- feat: Q3 nombre et taille des sites distants
- feat: Q4-Q6 filtrage Internet, apps privées, IoT (Oui / Non / Je ne sais pas)
- feat: Q7 maturité SOC (4 options)
- feat: état sauvegardé dans sessionStorage (retour arrière possible)
- feat: résultat en 5 blocs (Prisma Access, PA-Series, Cortex, éléments obligatoires, disclaimer)
- feat: liens "Voir les détails techniques" vers pa-series.html, prisma.html, cortex.html, panorama.html
