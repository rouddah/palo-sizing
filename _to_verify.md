# Points a confirmer a la source

> Ce fichier ne liste que ce qui est **volontairement en attente** : une
> valeur qu'aucune datasheet ne publie, une contradiction interne a un
> document officiel, un arbitrage editorial non tranche. Une valeur
> fausse ne se met pas ici, elle se corrige.
>
> Releve du 5 novembre 2026, apres relecture des onze datasheets
> PA-Series (detail dans `AUDIT_DATASHEETS_2026-11.md`).

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

## References chassis : six modeles sans SKU

Le 21 aout 2026, quinze modeles n'avaient pas de reference. Les
datasheets de septembre et octobre 2026 publient desormais, en Table 4 :

- PA-1500 : `PAN-PA-1510-POE`, `PAN-PA-1520-POE`, `PAN-PA-1530-POE`
- PA-3500 : `PAN-PA-3510` a `PAN-PA-3540`
- PA-5510 a PA-5530 : `PAN-PA-55x0-AC` et `-DC` (le champ porte la
  reference AC, comme les PA-5540 a PA-5580)
- PA-400R : `PAN-PA-410R`, `PAN-PA-410R-5G`, `PAN-PA-450R`,
  `PAN-PA-450R-5G`

**Toujours sans reference publiee**, donc `sku` nul : PA-520-5G (la
datasheet PA-500 ne liste que des accessoires), PA-455R-5G (la Table 4 le
nomme sans prefixe `PAN-`) et les quatre PA-50R (accessoires seulement).

**Non publiees par la datasheet mais conservees** : les references des
PA-400, PA-500, PA-1400, PA-3400, PA-5400 et du PA-7500. Ces datasheets
n'ont pas de table de commande ; les references viennent du catalogue et
n'ont pas ete recontrolees dans cette passe.

## PA-400 : End of Sale annonce

La page End of Life officielle annonce l'End of Sale des PA-410, PA-415,
PA-440, PA-445, PA-450, PA-455 et PA-460 au **22 mars 2027**, End of
Life au 21 mars 2032, remplacement recommande : PA-500 Series. Les
PA-415-5G et PA-455-5G ne figurent pas dans l'annonce.

A arbitrer : la date n'est pas atteinte, les modeles restent commandables
et `eos` reste `false`. Poser le drapeau maintenant les retirerait de
l'etabli de dimensionnement quatre mois trop tot.

## 5G / GTP / SCTP Security : deux affirmations sans source

Le champ `m5g` alimente la ligne « 5G / GTP / SCTP Security » du
comparateur. Il est passe a **nul** (non publie, tiret a l'ecran) sur :

- **PA-520-5G** : la datasheet PA-500 n'a pas de section Mobile Network
  Infrastructure. Le modem 5G integre n'est pas la fonction de securite
  5G ; PA-415-5G et PA-455-5G etaient deja a `false` pour la meme raison.
- **PA-7500** : la datasheet de mars 2026 n'en parle pas non plus.

A confirmer aupres de Palo Alto avant de les remettre a `true`.

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

Les pages `pa-series.html` et `search.html` portent chacune une table
`DS_URLS` serie vers datasheet, qui n'a pas d'entree `PA-400R` : le lien
datasheet de ces cinq colonnes retombe sur `#` tant qu'elle n'est pas
ajoutee (`https://www.paloaltonetworks.com/resources/datasheets/pa-400r-series`).

## PA-500 : format « 1U Rack »

La datasheet PA-500 ne qualifie pas le format. Elle donne des dimensions
de boitier de bureau (1,63 a 1,75 pouce de haut) et vend le montage en
baie comme accessoire (`PAN-1RU-4POST-RACK-10` a `-16`). Le site affiche
« 1U Rack », la PA-400 aux dimensions identiques est en « Desktop ».
Arbitrage editorial, le filtre de format en depend.

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

## PA-800 et PA-7000 : datasheets retirees

Les deux series sont End of Sale et leurs datasheets ne sont plus
publiees. Leurs valeurs viennent des editions anterieures et n'ont pas pu
etre recontrolees a la source. Elles restent affichees avec leur drapeau
EoS et leur date de fin de vie.

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

| Page | Valeur | Etat |
| --- | --- | --- |
| prisma | 66 000+ apps SaaS, 25+ integrations API | non retrouve |
| prisma | 600+ applications GenAI | non retrouve |
| prisma | 1 000+ classificateurs DLP, 22 profils reglementaires | non retrouve |
| prisma | 85+ categories PAN-DB | non retrouve |
| prisma | 3 600+ attributs Device-ID | non retrouve |
| prisma | SKU des add-ons Mobile Users et Remote Networks | non recontroles |
| cortex | 15 PB/jour d'ingestion | non retrouve |
| cortex | 1,2 milliard d'executions de playbooks | non retrouve |
| cortex | MITRE ATT&CK Turla 2024, 100% bloque | non retrouve |
| panorama | 16 500 / 25 000 / 36 500 logs/s en mode mixte | non retrouve |
| panorama | 4 TB / 24 TB / 48 TB de stockage local | le catalogue donne 16 TB en configuration de base |

**Confirme en revanche**, et laisse tel quel : les editions Prisma
Browser Education, Core et Pro, dont les references figurent au
catalogue, Pro etant la seule a inclure l'acces aux applications privees.

## pa-series.html : CN-Series et AI Runtime Security

La page mentionne peut-etre encore CN-Series sans signaler la transition
vers AI Runtime Security (Prisma AIRS 2.0, oct. 2025). A verifier lors
d'une prochaine passe sur la page.

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
