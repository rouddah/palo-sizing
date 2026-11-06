# Provenance des photos de facade

Les photos de `img/front/` sont extraites des datasheets officielles Palo Alto
Networks, telechargees le 5 novembre 2026 depuis www.paloaltonetworks.com
(lien de la page datasheet ci-dessous ; le PDF se telecharge depuis cette
page). Chaque datasheet porte en premiere page une photo par modele, legendee
de son nom. L association modele / photo suit cette legende (legende placee
sous l image dans le PDF), puis a ete verifiee a l oeil : bon modele, face
avant, boitier entier.

Traitement : extraction de l image embarquee telle quelle, sans rasteriser
la page (`tools/photos-extract.py`, PyMuPDF) ; detourage du fond blanc par
diffusion depuis les bords quand l image n a pas de canal alpha ; recadrage
au plus pres du boitier ; reduction pour tenir dans 720 x 400 px, jamais
agrandie ; export WebP. `node tools/photos.js <images extraites>` refait
tout et regenere `data/pa-chassis.js` et ce fichier.

| Modele | Fichier | Taille (px) | Vue | Source | Image du PDF | Fond |
| --- | --- | --- | --- | --- | --- | --- |
| PA-410 | `front/pa-410.webp` | 720 x 147 | face avant | [datasheet pa-400-series](https://www.paloaltonetworks.com/resources/datasheets/pa-400-series) | page 1, xref 165 | transparent d origine |
| PA-415 | `front/pa-415.webp` | 703 x 106 | face avant | [datasheet pa-400-series](https://www.paloaltonetworks.com/resources/datasheets/pa-400-series) | page 1, xref 169 | transparent d origine |
| PA-415-5G | `front/pa-415-5g.webp` | 588 x 400 | face avant | [datasheet pa-400-series](https://www.paloaltonetworks.com/resources/datasheets/pa-400-series) | page 1, xref 171 | transparent d origine |
| PA-440 | `front/pa-440.webp` | 476 x 111 | face avant | [datasheet pa-400-series](https://www.paloaltonetworks.com/resources/datasheets/pa-400-series) | page 1, xref 177 | transparent d origine |
| PA-445 | `front/pa-445.webp` | 720 x 100 | face avant | [datasheet pa-400-series](https://www.paloaltonetworks.com/resources/datasheets/pa-400-series) | page 1, xref 173 | transparent d origine |
| PA-450 | `front/pa-450.webp` | 475 x 110 | face avant | [datasheet pa-400-series](https://www.paloaltonetworks.com/resources/datasheets/pa-400-series) | page 1, xref 179 | transparent d origine |
| PA-455 | `front/pa-455.webp` | 720 x 94 | face avant | [datasheet pa-400-series](https://www.paloaltonetworks.com/resources/datasheets/pa-400-series) | page 1, xref 167 | transparent d origine |
| PA-455-5G | `front/pa-455-5g.webp` | 650 x 102 | face avant | [datasheet pa-400-series](https://www.paloaltonetworks.com/resources/datasheets/pa-400-series) | page 1, xref 175 | transparent d origine |
| PA-460 | `front/pa-460.webp` | 474 x 110 | face avant | [datasheet pa-400-series](https://www.paloaltonetworks.com/resources/datasheets/pa-400-series) | page 1, xref 181 | transparent d origine |
| PA-501 | `front/pa-501.webp` | 417 x 86 | face avant | [datasheet pa-500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-500-series) | page 1, xref 185 | transparent d origine |
| PA-505 | `front/pa-505.webp` | 433 x 89 | face avant | [datasheet pa-500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-500-series) | page 1, xref 181 | transparent d origine |
| PA-510 | `front/pa-510.webp` | 427 x 101 | face avant | [datasheet pa-500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-500-series) | page 1, xref 183 | transparent d origine |
| PA-520 | `front/pa-520.webp` | 431 x 100 | face avant | [datasheet pa-500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-500-series) | page 1, xref 177 | transparent d origine |
| PA-520-5G | `front/pa-520-5g.webp` | 291 x 331 | face avant | [datasheet pa-500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-500-series) | page 1, xref 187 | transparent d origine |
| PA-540 | `front/pa-540.webp` | 421 x 99 | face avant | [datasheet pa-500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-500-series) | page 1, xref 179 | transparent d origine |
| PA-545-POE | `front/pa-545-poe.webp` | 659 x 77 | face avant | [datasheet pa-500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-500-series) | page 1, xref 173 | transparent d origine |
| PA-550 | `front/pa-550.webp` | 661 x 95 | face avant | [datasheet pa-500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-500-series) | page 1, xref 169 | transparent d origine |
| PA-555-POE | `front/pa-555-poe.webp` | 659 x 77 | face avant | [datasheet pa-500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-500-series) | page 1, xref 175 | transparent d origine |
| PA-560 | `front/pa-560.webp` | 661 x 93 | face avant | [datasheet pa-500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-500-series) | page 1, xref 171 | transparent d origine |
| PA-850 | `front/pa-850.webp` | 720 x 121 | face avant | [datasheet pa-800-series-datasheet](https://www.paloaltonetworks.com/resources/datasheets/pa-800-series-datasheet) | page 1, xref 89 | blanc, detoure |
| PA-1410 | `front/pa-1410.webp` | 720 x 114 | face avant | [datasheet pa-1400-series](https://www.paloaltonetworks.com/resources/datasheets/pa-1400-series) | page 1, xref 165 | blanc, detoure |
| PA-1420 | `front/pa-1420.webp` | 720 x 114 | face avant | [datasheet pa-1400-series](https://www.paloaltonetworks.com/resources/datasheets/pa-1400-series) | page 1, xref 167 | blanc, detoure |
| PA-1510-POE | `front/pa-1510-poe.webp` | 720 x 110 | face avant | [datasheet pa-1500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-1500-series) | page 1, xref 168 | transparent d origine |
| PA-1520-POE | `front/pa-1520-poe.webp` | 720 x 110 | face avant | [datasheet pa-1500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-1500-series) | page 1, xref 170 | transparent d origine |
| PA-1530-POE | `front/pa-1530-poe.webp` | 720 x 110 | face avant | [datasheet pa-1500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-1500-series) | page 1, xref 174 | transparent d origine |
| PA-3410 | `front/pa-3410.webp` | 720 x 113 | face avant | [datasheet pa-3400-series](https://www.paloaltonetworks.com/resources/datasheets/pa-3400-series) | page 1, xref 171 | blanc, detoure |
| PA-3420 | `front/pa-3420.webp` | 720 x 113 | face avant | [datasheet pa-3400-series](https://www.paloaltonetworks.com/resources/datasheets/pa-3400-series) | page 1, xref 173 | blanc, detoure |
| PA-3430 | `front/pa-3430.webp` | 720 x 112 | face avant | [datasheet pa-3400-series](https://www.paloaltonetworks.com/resources/datasheets/pa-3400-series) | page 1, xref 175 | blanc, detoure |
| PA-3440 | `front/pa-3440.webp` | 720 x 112 | face avant | [datasheet pa-3400-series](https://www.paloaltonetworks.com/resources/datasheets/pa-3400-series) | page 1, xref 177 | blanc, detoure |
| PA-3510 | `front/pa-3510.webp` | 720 x 108 | face avant | [datasheet pa-3500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-3500-series) | page 1, xref 217 | transparent d origine |
| PA-3520 | `front/pa-3520.webp` | 720 x 108 | face avant | [datasheet pa-3500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-3500-series) | page 1, xref 221 | transparent d origine |
| PA-3530 | `front/pa-3530.webp` | 720 x 182 | face avant | [datasheet pa-3500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-3500-series) | page 1, xref 225 | transparent d origine |
| PA-3540 | `front/pa-3540.webp` | 720 x 182 | face avant | [datasheet pa-3500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-3500-series) | page 1, xref 229 | transparent d origine |
| PA-5410 | `front/pa-5410.webp` | 717 x 192 | face avant | [datasheet pa-5400-series](https://www.paloaltonetworks.com/resources/datasheets/pa-5400-series) | page 1, xref 186 | transparent d origine |
| PA-5420 | `front/pa-5420.webp` | 717 x 192 | face avant | [datasheet pa-5400-series](https://www.paloaltonetworks.com/resources/datasheets/pa-5400-series) | page 1, xref 178 | transparent d origine |
| PA-5430 | `front/pa-5430.webp` | 717 x 192 | face avant | [datasheet pa-5400-series](https://www.paloaltonetworks.com/resources/datasheets/pa-5400-series) | page 1, xref 194 | transparent d origine |
| PA-5440 | `front/pa-5440.webp` | 717 x 192 | face avant | [datasheet pa-5400-series](https://www.paloaltonetworks.com/resources/datasheets/pa-5400-series) | page 1, xref 190 | transparent d origine |
| PA-5445 | `front/pa-5445.webp` | 717 x 192 | face avant | [datasheet pa-5400-series](https://www.paloaltonetworks.com/resources/datasheets/pa-5400-series) | page 1, xref 182 | transparent d origine |
| PA-5510 | `front/pa-5510.webp` | 665 x 144 | face avant | [datasheet pa-5500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-5500-series) | page 1, xref 182 | transparent d origine |
| PA-5520 | `front/pa-5520.webp` | 664 x 144 | face avant | [datasheet pa-5500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-5500-series) | page 1, xref 184 | transparent d origine |
| PA-5530 | `front/pa-5530.webp` | 670 x 145 | face avant | [datasheet pa-5500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-5500-series) | page 1, xref 186 | transparent d origine |
| PA-5540 | `front/pa-5540.webp` | 663 x 208 | face avant | [datasheet pa-5500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-5500-series) | page 1, xref 172 | transparent d origine |
| PA-5550 | `front/pa-5550.webp` | 661 x 207 | face avant | [datasheet pa-5500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-5500-series) | page 1, xref 174 | transparent d origine |
| PA-5560 | `front/pa-5560.webp` | 667 x 210 | face avant | [datasheet pa-5500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-5500-series) | page 1, xref 176 | transparent d origine |
| PA-5570 | `front/pa-5570.webp` | 658 x 208 | face avant | [datasheet pa-5500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-5500-series) | page 1, xref 178 | transparent d origine |
| PA-5580 | `front/pa-5580.webp` | 658 x 208 | face avant | [datasheet pa-5500-series](https://www.paloaltonetworks.com/resources/datasheets/pa-5500-series) | page 1, xref 180 | transparent d origine |
| PA-7050 | `front/pa-7050.webp` | 439 x 400 | trois-quarts avant | [datasheet pa-7000-series](https://www.paloaltonetworks.com/resources/datasheets/pa-7000-series) | page 1, xref 127 | transparent d origine |
| PA-7080 | `front/pa-7080.webp` | 223 x 400 | trois-quarts avant | [datasheet pa-7000-series](https://www.paloaltonetworks.com/resources/datasheets/pa-7000-series) | page 1, xref 129 | transparent d origine |
| PA-7500 | `front/pa-7500.webp` | 312 x 400 | trois-quarts avant | [datasheet pa-7500](https://www.paloaltonetworks.com/resources/datasheets/pa-7500) | page 1, xref 133 | transparent d origine |
| PA-410R | `front/pa-410r.webp` | 343 x 176 | trois-quarts avant | [datasheet pa-400r-series](https://www.paloaltonetworks.com/resources/datasheets/pa-400r-series) | page 1, xref 177 | transparent d origine |
| PA-410R-5G | `front/pa-410r-5g.webp` | 720 x 213 | trois-quarts avant | [datasheet pa-400r-series](https://www.paloaltonetworks.com/resources/datasheets/pa-400r-series) | page 1, xref 179 | transparent d origine |
| PA-450R | `front/pa-450r.webp` | 705 x 92 | face avant | [datasheet pa-400r-series](https://www.paloaltonetworks.com/resources/datasheets/pa-400r-series) | page 1, xref 181 | transparent d origine |
| PA-450R-5G | `front/pa-450r-5g.webp` | 680 x 400 | face avant | [datasheet pa-400r-series](https://www.paloaltonetworks.com/resources/datasheets/pa-400r-series) | page 1, xref 183 | transparent d origine |
| PA-455R-5G | `front/pa-455r-5g.webp` | 493 x 291 | trois-quarts avant | [datasheet pa-400r-series](https://www.paloaltonetworks.com/resources/datasheets/pa-400r-series) | page 1, xref 185 | transparent d origine |
| PA-52R-5G | `front/pa-52r-5g.webp` | 653 x 189 | face avant | [datasheet pa-50r-series](https://www.paloaltonetworks.com/resources/datasheets/pa-50r-series) | page 1, xref 191 | transparent d origine |
| PA-54R-POE-D-5G | `front/pa-54r-poe-d-5g.webp` | 460 x 400 | face avant | [datasheet pa-50r-series](https://www.paloaltonetworks.com/resources/datasheets/pa-50r-series) | page 1, xref 195 | transparent d origine |
| PA-56R-POE-5G | `front/pa-56r-poe-5g.webp` | 720 x 175 | face avant | [datasheet pa-50r-series](https://www.paloaltonetworks.com/resources/datasheets/pa-50r-series) | page 1, xref 187 | transparent d origine |

## Sans photo

- **PA-820** : la datasheet PA-800 en ligne (edition 07/2023) ne montre que la PA-850 : meme gabarit, mais quatre de ses cages sont des SFP+ (8 SFP 1G sur la PA-820) et la serigraphie porte PA-850. TechDocs n a qu une illustration au trait annotee de reperes, pas une photo. L interface affiche un plastron dessine.
- **PA-54R-POE** : la datasheet PA-50R montre les PA-52R-5G, PA-54R-POE-D-5G et PA-56R-POE-5G, pas la PA-54R-POE, dont la facade differe (pas de connecteurs d antenne 5G). TechDocs n a qu une illustration au trait annotee de reperes. L interface affiche un plastron dessine.

## Vues de trois-quarts

Les chassis (PA-7050, PA-7080, PA-7500) et les boitiers durcis PA-410R,
PA-410R-5G et PA-455R-5G ne sont montres qu en perspective par leur
datasheet : c est la photo retenue, le texte alternatif dit « Vue avant ».
