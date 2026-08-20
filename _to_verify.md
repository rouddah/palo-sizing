# Éléments à vérifier / valider

> Fichier généré automatiquement lors de la refonte du 29 juin 2026.
> Ces éléments ont été identifiés lors du grep final mais n'ont pas été modifiés faute de validation suffisante.

## pa-series.html — "IoT Security" résiduel (subscription name)

| Ligne | Contenu | Statut |
|-------|---------|--------|
| 1174 | `data-tip="...IoT Security."` — tooltip sur le critère IoT dans le wizard technique | À valider : renommer en "Device Security" si la subscription a effectivement changé de nom dans le catalogue NGFW |
| 1361 | `"...appelle une sécurité adaptée (IoT Security)."` — texte du guide de dimensionnement | À renommer en "Device Security" |
| 1365 | `"...nécessitent la subscription IoT Security pour..."` — texte du guide | À renommer en "Device Security" |
| 2390 | `subs.push({ name:'IoT Security', ... })` — objet JS de subscription dans le moteur de calcul | À renommer en "Device Security" ; vérifier que le SKU associé est toujours correct |

**Contexte :** La transition IoT Security → Device Security est officielle depuis le 15 août 2025.
Ces références sont dans pa-series.html qui dépasse 2 750 lignes. Une modification chirurgicale est possible mais doit être validée par rapport aux spécifications PA-Series-Complete-Specs.md.

## pa-series.html — CN-Series / AI Runtime Security

La page mentionne potentiellement CN-Series sans mention de la transition vers AI Runtime Security (Prisma AIRS 2.0, oct. 2025). À vérifier lors d'une prochaine passe sur pa-series.html.

## Idira — Pilier Identity (nouveau, mai 2026)

Selon le prompt, ajouter :
- Une carte sur index.html dans une catégorie "Identité"
- Une page `idira.html` listant les composants (PAM, IAM, EPM, Identity Governance, Workforce Password Management, Agentic Identities, Secrets Management)
- À arbitrer avec l'équipe commerciale avant d'ajouter : cela représente un nouveau pilier produit hors NGFW/SASE/SecOps

## Jeu de pictogrammes officiel Palo Alto - RESOLU (20 aout 2026)

Le premier fichier telecharge etait chiffre par la protection des droits
Microsoft. Reexporte depuis PowerPoint, il s ouvre normalement.

458 pictogrammes ont ete convertis du DrawingML vers SVG. Neuf sont
employes par le site, dans les titres de groupe et de section. Le
convertisseur vit dans tools/icons/ (voir son README).

Mesure a retenir : le jeu officiel est dessine pour la projection. En
dessous de 20px ses traits les plus fins disparaissent. Les affordances
d interface (coche, croix, chevron, fleche) restent donc une geometrie
au trait, dessinee pour ces tailles-la.
