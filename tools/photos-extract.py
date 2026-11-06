"""Extrait les images embarquees des datasheets PDF (PyMuPDF), sans
rasteriser : python -I tools/photos-extract.py <dossier pdf> <dossier sortie>.
Ecrit aussi report.json (taille, page, position de chaque image).
Suite : node tools/photos.js <dossier sortie>."""
import sys, os, fitz, json
src = sys.argv[1]; out = sys.argv[2]
os.makedirs(out, exist_ok=True)
report = []
for fn in sorted(os.listdir(src)):
    if not fn.endswith('.pdf'):
        continue
    doc = fitz.open(os.path.join(src, fn))
    base = fn[:-4]
    for pno, page in enumerate(doc):
        for i, info in enumerate(page.get_images(full=True)):
            xref, smask = info[0], info[1]
            try:
                pix = fitz.Pixmap(doc, xref)
                if smask:
                    mask = fitz.Pixmap(doc, smask)
                    pix = fitz.Pixmap(pix, mask)
                if pix.n - pix.alpha >= 4:
                    pix = fitz.Pixmap(fitz.csRGB, pix)
            except Exception as e:
                print('ERR', fn, xref, e); continue
            if pix.width < 300:
                continue
            name = f'{base}_p{pno+1}_x{xref}.png'
            pix.save(os.path.join(out, name))
            rects = page.get_image_rects(xref)
            report.append(dict(file=name, w=pix.width, h=pix.height, alpha=bool(pix.alpha), page=pno+1,
                               rect=[round(v) for v in rects[0]] if rects else None))
json.dump(report, open(os.path.join(out, 'report.json'), 'w'), indent=1)
for r in report:
    print(r['file'], r['w'], r['h'], r['alpha'], r['rect'])
