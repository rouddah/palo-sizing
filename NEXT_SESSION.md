# Briefing session suivante — palo-sizing

> Mis à jour le 30 juin 2026. À lire en début de session avant de toucher quoi que ce soit.

## Contexte rapide

Repo : `C:\Users\rayna\Documents\palo-sizing` (HTML/CSS/JS vanilla, déployé sur Cloudflare Pages)
Remote GitHub : `https://github.com/rouddah/palo-sizing` (token dans le remote git, push direct)
Déploiement Cloudflare : `npx wrangler pages deploy . --project-name palo-sizing --branch main`
Token Cloudflare : `C:\Users\rayna\Desktop\tokencloudflare.txt`
CLOUDFLARE_API_TOKEN à passer en variable d'env avant wrangler.

## Ce qui a été fait (session 1 — 29 juin 2026)

Corrections Étape 2 du CLAUDE_CODE_PROMPT.md :
- prisma.html : Device Security, Prisma Access Agent, 100+ PoP, SCM Essentials, SLS requis
- cortex.html : Cortex Cloud ajouté, CDL → SLS, AgentiX, 5 produits
- panorama.html : ESA Pro, note SCM reformulée
- header.js : dropdown Cortex mis à jour
- index.html + search.html : entrées vers wizard.html
- wizard.html : v1 créée (7 questions)

## Ce qui a été fait (session 2 — 30 juin 2026)

- wizard.html : réécriture complète v2 (seuils commerciaux, NGFW précis PA-410→PA-7500, Local/Worldwide Edition, bouton Export, add-ons ADEM/App Acceleration)
- pa-series.html : 4x IoT Security → Device Security
- links.js : IoT Security → Device Security, 150+ → 100+ PoP, ajout AIRS, ajout catégorie Identite
- header.js : Idira dans dropdown Produits, nav-btn Mode guidé
- browser.html : 150+ → 100+ PoP
- resources.html : nouvelle page avec 9 catégories de liens validés
- idira.html : nouvelle page Idira (3 domaines, 7 composants)
- Bloc "Ressources" + lien resources.html ajouté sur toutes les pages produit

## État actuel — toutes les tâches du CLAUDE_CODE_PROMPT.md sont complètes

Étape 1 (audit) : FAIT ✅
Étape 2 (corrections factuelles) : FAIT ✅
Étape 3 (wizard) : FAIT v2 ✅
Étape 4 (nettoyage) : FAIT ✅ (sauf em-dashes browser.html — voir _to_verify.md)
Étape 5 (commits/deploy) : à vérifier après commits

## Tâches restantes éventuelles (non-bloquantes)

### Em-dashes dans browser.html
Les titres et le contenu de browser.html contiennent encore des em-dashes (—). Non traités car non listés dans les corrections Étape 2 du CLAUDE_CODE_PROMPT.md et risque de régression sur contenu existant. À traiter proprement si nécessaire, via grep+replace chirurgical.

### CN-Series / Prisma AIRS dans pa-series.html
La page pa-series.html pourrait mentionner CN-Series sans référence à la transition vers AI Runtime Security (AIRS, oct. 2025). À vérifier lors d'une passe pa-series.html.

### Idira — page légère
La page idira.html créée est intentionnellement légère (pas de détails SKU, pas de pricing). À enrichir quand les informations commerciales Idira seront disponibles.

## Workflow pour committer et déployer

```bash
# 1. Commit par fichier modifié
cd C:\Users\rayna\Documents\palo-sizing
git add <fichier>
git commit -m "feat/fix(...): description"

# 2. Push GitHub
git push origin main

# 3. Deploy Cloudflare
CLOUDFLARE_API_TOKEN="<voir tokencloudflare.txt sur le Bureau>" npx wrangler pages deploy . --project-name palo-sizing --branch main
```

NB : le push GitHub ne déclenche PAS le deploy Cloudflare automatiquement. Il faut toujours lancer wrangler manuellement.

## Règles non-négociables (rappel)

- Stack inchangée : HTML/CSS/JS vanilla, pas de framework, pas de build step
- Pas de prix jamais
- Pas d'em-dash (—) dans le contenu nouveau — utiliser ` - ` ou ponctuation normale
- Noms officiels PAN en anglais (Mobile User, Service Connection, Remote Network, etc.)
- Données chiffrées sourcées uniquement — si doute → placeholder `[à confirmer]` + _to_verify.md
- Ne pas inventer de SKU
