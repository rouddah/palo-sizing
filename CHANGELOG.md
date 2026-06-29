# Changelog

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
