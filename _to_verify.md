# Points a confirmer a la source

> Ce fichier ne liste que ce qui est **volontairement en attente** : une
> valeur qu'aucune datasheet ne publie, une contradiction interne a un
> document officiel, un arbitrage editorial non tranche. Une valeur
> fausse ne se met pas ici, elle se corrige.
>
> Releve du 5 novembre 2026, apres l'audit exhaustif v9 (detail champ par
> champ dans `AUDIT_EXHAUSTIF_2026-11.md`, qui remplace
> `AUDIT_DATASHEETS_2026-11.md`).

## Audit v9 : points ouverts

**HA classique sur PA-5500 et PA-7500.** Deux pages TechDocs se
contredisent. « NGFW Clustering » : les paires HA classiques « are not
available on these firewalls ». « Configure Active/Passive HA », plus
recente : A/P supporte sur PA-7500 des 12.1.5 et sur PA-5500 des 12.1.7,
A/A non supporte. Le site suit la seconde (`haAP` true, `haAA` false), en
accord avec la datasheet PA-7500 (« NGFW Clustering, active-passive »).

**Clustering PA-3500.** La datasheet d'octobre 2026 marque « NGFW
clustering with active/active » comme « Future release » ; la page
« Configure an NGFW Cluster » et les New Features 12.2 listent deja la
PA-3500 (2 membres). Le site affiche les deux. A/A classique non publie.

**PA-50R.** La datasheet annonce le NGFW clustering actif/actif, mais la
documentation de clustering ne liste pas la PA-50R : nombre de membres et
version minimale non publies. A/A classique non publie. Ports PoE
(lesquels, combien) et budget PoE non publies.

**PA-1500.** 16 ports PoE++ pour la serie (Highlights), sans dire lesquels
parmi les ports cuivre. `poeP` = 16 pour les trois modeles.

**PAN-OS minimal non publie** pour PA-440, PA-450, PA-460, PA-820,
PA-850, PA-7050 et PA-7080 : la Compatibility Matrix commence a 10.1.

**Capacites de configuration** (GlobalProtect max, zones, politiques,
tunnels, SSL, objets, NAT, SD-WAN, profils) des PA-400, PA-500, PA-800,
PA-1400, PA-3400, PA-5400, PA-7000 et PA-7500 : reprises d'editions
anterieures des datasheets, absentes des editions courantes. A confirmer
ou a retirer. Depuis le 5 novembre 2026 le site les affiche attenuees, en
italique, avec la mention « edition anterieure de la datasheet » sous le
libelle de ligne et au survol de chaque valeur (`LEGACY_CAPS` dans
`data/pa-models.js`). Elles ne comptent plus dans les ecarts, barres et
maxima du comparateur, et `_smoke.js` / `_wizard.js` verifient qu elles ne
changent aucune recommandation.

**GlobalProtect sur PA-400 et PA-400R, SD-WAN sur PA-7500** : les
datasheets courantes n'en parlent pas. Ligne affichee « non publie ».

**PA-7500** : stockage non publie par la datasheet.

**PA-500, alimentation redondante.** La datasheet dit qu'un second
adaptateur est en option « for platforms that support dual power
adapters » sans les nommer. Les kits rack de la Table 4 (deux adaptateurs
par PA-520, PA-540, PA-545-POE, PA-550, PA-555-POE, PA-560, PA-520-5G ;
un seul pour PA-501, PA-505, PA-510) le laissent deviner : non repris,
c'est une deduction.

**Mode guide (`wizard.html`)** : resolu le 5 novembre 2026. Les paliers en
dur sont remplaces par un calcul sur `data/pa-models.js` (5 Mbps et 10
sessions par utilisateur, entree a 65 % de la datasheet, confort a 50 %),
qui couvre PA-500, PA-1400, PA-1500, PA-3400, PA-3500, PA-5400, PA-5500 et
PA-7500. Arbitrage pris : la PA-400 (End of Sale annonce au 22 mars 2027)
n y est plus proposee, l etabli la garde tant que la date n est pas
atteinte. Teste par `_wizard.js`.

## Valeurs TBD d'aout 2026 - resolu le 5 novembre 2026

Les editions de septembre (PA-5500) et d'octobre 2026 (PA-3500) publient
enfin le VPN IPsec et le CPS. Les huit champs nuls sont renseignes :

| Modele | VPN IPsec | CPS |
| --- | --- | --- |
| PA-3510 / 3520 / 3530 / 3540 | 13 / 15 / 22 / 36 Gbps | 325K / 350K / 500K / 550K |
| PA-5510 / 5520 / 5530 | 34 / 36 / 38 Gbps | 600K / 971K / 1,01M |

Plus aucun modele du site n'a de VPN ou de CPS nul. Le mecanisme de
l'etabli (une metrique nulle sort du calcul et un encart le dit) reste en
place pour la prochaine serie annoncee.

**Texte d'interface a mettre a jour** (hors donnees, non modifie dans
cette passe) : dans `qualification.html`, les descriptions de serie
PA-3500 (« La datasheet ne publie pas encore le VPN IPsec ni le CPS ») et
PA-5500 (« Le CPS des trois premiers modeles n'est pas encore publie »)
sont devenues fausses.

## References chassis : cinq modeles sans SKU

Le 21 aout 2026, quinze modeles n'avaient pas de reference. Les
datasheets de septembre et octobre 2026 publient desormais, en Table 4 :

- PA-1500 : `PAN-PA-1510-POE`, `PAN-PA-1520-POE`, `PAN-PA-1530-POE`
- PA-3500 : `PAN-PA-3510` a `PAN-PA-3540`
- PA-5510 a PA-5530 : `PAN-PA-55x0-AC` et `-DC` (le champ porte la
  reference AC, comme les PA-5540 a PA-5580)
- PA-400R : `PAN-PA-410R`, `PAN-PA-410R-5G`, `PAN-PA-450R`,
  `PAN-PA-450R-5G`

**Toujours sans reference publiee**, donc `sku` nul : PA-520-5G (la
datasheet PA-500 ne liste que des accessoires, absent du catalogue) et
les quatre PA-50R (accessoires seulement, absents du catalogue).

**Audit v9** : les references des series sans table de commande (PA-400,
PA-500, PA-800, PA-1400, PA-3400, PA-5400) ont ete retrouvees une a une
au catalogue officiel. Trois n'y figuraient pas et ont ete remplacees par
celles vues a la source : PA-7050 et PA-7080 en `-AC-SYS` (page EoL),
PA-7500 en `PAN-PA-7500-A-SYS` (catalogue, « Chassis assembly »).
PA-455R-5G : `PAN-PA-455R-5G`, vue au catalogue.

## PA-400 : End of Sale annonce

La page End of Life officielle annonce l'End of Sale des PA-410, PA-415,
PA-440, PA-445, PA-450, PA-455 et PA-460 au **22 mars 2027**, End of
Life au 21 mars 2032, remplacement recommande : PA-500 Series. Les
PA-415-5G et PA-455-5G ne figurent pas dans l'annonce.

A arbitrer : la date n'est pas atteinte, les modeles restent commandables
et `eos` reste `false`. Poser le drapeau maintenant les retirerait de
l'etabli de dimensionnement quatre mois trop tot.

## 5G Security : non publie hors section Mobile Network

Le champ `m5g` alimente la ligne « 5G Security » du comparateur. Depuis
l'audit v9 il vaut `true` seulement si la datasheet a une section Mobile
Network Infrastructure, `false` si elle exclut le modele (PA-3410 et
PA-3420), et nul sinon : PA-400, PA-400R, PA-500, PA-800, PA-1400,
PA-7500. Le modem 5G integre (PA-415-5G, PA-455-5G, PA-520-5G, PA-410R-5G, PA-450R-5G, PA-455R-5G)
n'est pas la fonction de securite 5G. A confirmer aupres de Palo Alto.

## PA-50R : nom du troisieme modele

L'edition de septembre 2026 garde la contradiction :

- Table 1, performances : le modele est nomme **PA-54R-POE-5G**
- Table 4, materiel : il est nomme **PA-54R-POE** et porte « N/A » dans
  la colonne cellulaire

Le site retient **PA-54R-POE**, sans 5G : c'est la table materielle qui
decrit les interfaces, et elle est explicite sur l'absence de modem. A
confirmer aupres de Palo Alto.

## Budgets PoE non publies

- **PA-50R** : trois des quatre modeles annoncent PoE. La datasheet donne
  la consommation maximale du boitier (225,1 W) mais pas le budget PoE
  disponible.
- **PA-455R-5G** : quatre ports RJ45 PoE, consommation maximale 185 W,
  aucun budget PoE publie.

Le champ `poeW` reste nul.

## Budgets PoE : contradictions internes

- **PA-455-5G** : le bloc PoE de la datasheet PA-400 donne « Total PoE
  Budget: 91 W » pour une liste qui inclut le PA-455-5G, mais la table
  d'alimentation ecrit « with 151 W PoE output » pour ce modele. Le site
  garde 151 W.
- **PA-555-POE** : budget PoE 330 W dans le bloc PoE, « 332W PoE
  output » dans la table d'alimentation. Le site garde 330 W, la valeur
  annoncee comme budget.

## PA-400R : hors du moteur de recommandation

La serie est ajoutee le 5 novembre 2026 (datasheet PA-400R de fevrier
2026). Comme la PA-50R, elle figure au comparateur et a la recherche mais
pas dans les series que l'etabli peut recommander.

Les tables `DS_URLS` de `pa-series.html` et `search.html` ont bien une
entree `PA-400R`.

## PA-500 : format - tranche le 5 novembre 2026

La datasheet PA-500 ne qualifie pas le format. Elle donne des dimensions
de boitier de bureau (1,63 a 1,75 pouce de haut) et vend le montage en
baie comme accessoire (`PAN-1RU-4POST-RACK-10` a `-16`). Le site affiche
desormais « Desktop (rack 1U en option) », comme la PA-400 aux dimensions
identiques ; le filtre « Desktop » les retient.

## PA-1400 : statut de commercialisation - resolu

L'entree PA-1400 de la page End of Life est la colonne « remplacement
recommande » de l'ION 9000 : la PA-1400 n'est pas en fin de vente. La
serie reste active.

## Capacites de configuration

Zones, politiques, tunnels IPsec site-a-site, sessions de dechiffrement,
objets adresses, regles NAT, profils de securite : **les datasheets 2026
ne les publient plus**. Elles ne sont renseignees que sur les modeles
pour lesquels une edition anterieure les donnait. Les series ajoutees en
aout 2026 les portent a nul, et le comparateur affiche un tiret.

## PA-800 et PA-7000 : datasheets en ligne - resolu le 5 novembre 2026

Contrairement a ce qu'affirmait le releve precedent, les deux datasheets
sont toujours publiees (`pa-800-series-datasheet`, edition 07/2023, et
`pa-7000-series`, edition 07/2024). PA-7000 conforme. PA-800 : cinq debits
corriges (valeurs HTTP prises pour appmix), vsys non publies, HA
actif/actif publiee. Seules leurs capacites de configuration restent
non recontrolables (voir plus haut).

## PA-500 : systemes virtuels du bas de gamme

La datasheet PA-500 ecrit « -- » en systemes virtuels pour PA-501,
PA-505, PA-510 et PA-520, la ou celle du PA-400 ecrit « 1/1 » pour ses
propres entrees de gamme. Le site suit la datasheet et n'affiche rien
pour ces quatre modeles. Si la distinction n'est qu'une coquetterie de
mise en page chez Palo Alto, il faudra remettre « 1 / 1 ».

## PA-50R hors du moteur de recommandation

La gamme durcie est presente dans le comparateur et dans la recherche,
mais elle ne figure pas dans les series que l'etabli de dimensionnement
peut recommander : un profil de bureau ne se dimensionne pas sur un
boitier OT. Arbitrage editorial, a revoir si le site couvre un jour
l'industriel pour lui-meme.

## Chiffres produit non confirmes a la source

Releve du 21 aout 2026. Ces valeurs sont affichees sur les pages produit
mais je n'ai pas trouve de document officiel qui les porte. A confirmer
ou a retirer.

| Page | Valeur | Etat au 6 novembre 2026 |
| --- | --- | --- |
| prisma | 66 000+ apps SaaS, 25+ integrations API | remplace par 85 000+ (webinaire public mai 2026) |
| prisma | 600+ applications GenAI | remplace par 5 000+ (meme source) |
| prisma | 1 000+ classificateurs, 22 profils reglementaires | 1 000+ identifiants confirme, 22 profils retire |
| prisma | 85+ categories PAN-DB | retire |
| prisma | 3 600+ attributs Device-ID | retire |
| prisma | SKU des add-ons Mobile Users et Remote Networks | retires, grille alignee sur le guide de licences de juin 2026 |
| cortex | 15 PB/jour d'ingestion | remplace par 17 PB/jour traites (presentation PAN, aout 2026) |
| cortex | 1,2 milliard d'executions de playbooks | confirme (datasheet AgentiX), rattache a AgentiX |
| cortex | MITRE ATT&CK Turla 2024, 100% bloque | retire (Turla = Round 5, 2023) |
| panorama | 16 500 / 25 000 / 36 500 logs/s en mode mixte | toujours non retrouve |
| panorama | 4 TB / 24 TB / 48 TB de stockage local | toujours en attente (16 TB au catalogue pour le M-300) |

## Pages produit, audit du 6 novembre 2026

Detail dans `AUDIT_PAGES_PRODUIT_2026-11.md`.

- **vION Prisma SD-WAN** : la datasheet d'avril 2026 donne 100 / 200 / 350
  Mbps pour les ION 3102V / 3104V / 3108V, une presentation Palo Alto Networks
  de mai 2026 donne 0,7 / 1,1 / 1,8 Gbps. Le site garde la datasheet et
  signale l'ecart.
- **Colo-Connect** : 100 Gbps par region (datasheet Prisma Access, fevrier
  2026) contre 20 Gbps (guide de licences, juin 2026). Aucun chiffre affiche.
- **Cortex XDR Pro per GB** : la documentation ne nomme plus que « per GB » ;
  le lien avec l'ancienne edition « per TB » n'est pas documente.
- **Prisma Browser, Enterprise DLP** : le site l'affiche incluse dans les trois
  editions (catalogue), la DLP etendue aux applications lourdes en Pro (guide
  de licences). A confirmer edition par edition.
- **Panorama** : tableau a 6 colonnes avec des lignes a 5 cellules (defaut
  d'alignement anterieur), et `wizard.html` annonce encore « 100+ PoP ».

**Confirme en revanche**, et laisse tel quel : les editions Prisma
Browser Education, Core et Pro, dont les references figurent au
catalogue, Pro etant la seule a inclure l'acces aux applications privees.

## pa-series.html : CN-Series et AI Runtime Security

CN-Series est en End of Sale au 1er novembre 2026, remplace par AI Runtime
Firewall (Prisma AIRS 3.0 depuis mars 2026). `resources.html` et `links.js`
le disent depuis le 6 novembre 2026 ; `pa-series.html` reste a verifier.

## Jeu de pictogrammes officiel - resolu le 20 aout 2026

458 pictogrammes convertis du DrawingML vers SVG, neuf employes par le
site. Le convertisseur vit dans `tools/icons/`.

Mesure a retenir : le jeu officiel est dessine pour la projection. En
dessous de 20 px ses traits les plus fins disparaissent. Les affordances
d'interface (coche, croix, chevron, fleche) restent donc une geometrie au
trait, dessinee pour ces tailles-la.

## IoT Security vers Device Security - resolu

La transition est appliquee partout : plus aucune occurrence d'« IoT
Security » dans les pages ni dans les scripts.

## Recontrole independant du 6 novembre 2026

Deux relectures separees des 13 datasheets (editions identiques a celles
de l audit v9, aucune nouvelle edition en ligne) et des pages TechDocs HA.
Aucun ecart sur les debits, sessions, CPS, ports multi-gig, PoE, combos,
HA A/P et A/A. Corrige : `vsysMax` 1 sur PA-410, PA-415, PA-415-5G
(Table 1 : 1/1), alimentation vehicule ajoutee a la PA-56R-POE-5G (Table 7),
edition PA-5500 dans l en-tete (08/2026). Restent ouverts :

- **PAN-OS 12.2 sur PA-415-5G, PA-410R, PA-410R-5G** : la Compatibility
  Matrix porte un tiret sous 12.2. Plafond 12.1 ou simple retard de la
  matrice ? `panosMax` laisse nul.
- **Budget PoE PA-555-POE** : 330 W (bloc PoE) contre 332 W (table
  d alimentation) dans la meme datasheet. Le site garde 330 W.
- **NGFW clustering « 2 membres » sur PA-3510 a PA-3540 et PA-5510 a
  PA-5530** : la page NGFW Clustering ne nomme que PA-7500 et PA-5540 a
  PA-5580 ; le nombre vient des New Features 12.2. A relire a la prochaine
  edition.
- **Ports HA PA-500, PA-450R, PA-455R-5G** : « ports de donnees en HA1/HA2 »
  deduit du tiret de la matrice HA ; TechDocs ne l ecrit que pour la PA-400.
- **HSCI PA-3500** : datasheet « 100G (2) », TechDocs « 40/100 Gbps ».
- **DC PA-5540 a PA-5580** : « 2,200 W » dans le texte, reference
  PAN-PA-5500-PWR-2000-DC dans la table de commande.

## Limites et fonctions (releve du 10 novembre 2026, detail dans AUDIT_CAPACITES_2026-11.md)

- PA : 15 modeles absents de l'outil Product comparison (PA-520-5G, PA-1500, PA-3500, PA-5510 a 5530, PA-50R) : seules leurs vsys sont publiees.
- PA : licence GlobalProtect pour l'acces distant (doc d'administration : sans licence ; datasheets : passerelle sous licence). Retenu 'base'.
- PA-820/850 : VPN post-quantique a false par deduction (derniere version 11.1, ML-KEM exige 11.2).
- Fortinet : table des valeurs maximales 8.0.2 et datasheets divergent (VDOM 60F/400G/1800F, regles 3800G/4800F, FortiAP 3800G, FortiSwitch 50G/200G/2600F) : table retenue.
- Cisco : virtBase = virt (licences par chassis) est une interpretation ; 4225 21 instances (guide 10.x) contre 15 (datasheet 2024).
- Check Point : vlan Spark (sk113247) lu via un resume, a relire ; 7 datasheets Force derriere un challenge anti-robot, lues dans le navigateur.
- SonicWall : NSsp 15700 13 instances et virtBase tires d'une FAQ de 2020.
- Stormshield : vlan = plafond commun des interfaces logiques ; XL-6200 ipsec 30 000 (matrice 10/2026) contre 23 000 (datasheet 05/2026) ; SNxr1200 : datasheet de 2024 en decalage avec la matrice 2026, aussi pour les debits du tableau 1.
- Sophos : zones 100 en 22.0 MR3, 248 en 23.0 GA (04/11/2026).
