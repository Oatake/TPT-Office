#!/usr/bin/env node
// Render a worksheet HTML file to a print-ready PDF (US Letter), a watermarked
// preview PDF, or square PNG thumbnails for TPT.
//
// Usage:
//   node scripts/build-pdf.mjs <input.html> <output.pdf>
//   node scripts/build-pdf.mjs <input.html> <output-preview.pdf> --preview [--pages 4]
//   node scripts/build-pdf.mjs <input.html> <output-dir> --thumbnails [--pages 4]
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const positional = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--pages');
const pagesIdx = args.indexOf('--pages');
const maxPages = pagesIdx >= 0 ? Number(args[pagesIdx + 1]) : 4;
const [input, output] = positional;

if (!input || !output) {
  console.error('Usage: node scripts/build-pdf.mjs <input.html> <output> [--preview|--thumbnails] [--pages N]');
  process.exit(1);
}

// Brand fonts: every brand/assets/fonts/<family>/<Family>-<Weight>.woff2 is
// registered as @font-face so worksheets can use it by family name.
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
async function brandFontCss() {
  const dir = path.join(repoRoot, 'brand', 'assets', 'fonts');
  const weights = { regular: 400, bold: 700 };
  let css = '';
  for (const fam of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    if (!fam.isDirectory()) continue;
    for (const f of await readdir(path.join(dir, fam.name))) {
      const m = f.match(/^(.+)-(Regular|Bold)\.(woff2|woff|ttf|otf)$/i);
      if (!m) continue;
      const url = pathToFileURL(path.join(dir, fam.name, f)).href;
      css += `@font-face{font-family:"${m[1]}";font-weight:${weights[m[2].toLowerCase()]};src:url("${url}");}\n`;
    }
  }
  return css;
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(path.resolve(input)).href, { waitUntil: 'networkidle' });
  const fontCss = await brandFontCss();
  if (fontCss) await page.addStyleTag({ content: fontCss });
  await page.evaluate(async () => {
    // Force-load every declared face, then wait until fonts are ready.
    await Promise.all([...document.fonts].map((f) => f.load().catch(() => {})));
    await document.fonts.ready;
  });

  if (flags.has('--thumbnails')) {
    await mkdir(output, { recursive: true });
    const sheets = await page.$$('.page');
    const count = Math.min(maxPages, sheets.length);
    // Square canvas: one letter page centered on a brand-colored background.
    for (let i = 0; i < count; i++) {
      const png = await sheets[i].screenshot({ type: 'png' });
      const thumb = await browser.newPage({ viewport: { width: 1400, height: 1400 } });
      await thumb.setContent(`<!DOCTYPE html><html><body style="margin:0;width:1400px;height:1400px;
        display:flex;align-items:center;justify-content:center;background:#f3f6fc">
        <img src="data:image/png;base64,${png.toString('base64')}"
             style="height:1300px;box-shadow:0 8px 30px rgba(0,0,0,.25)"></body></html>`);
      const file = path.join(output, `thumbnail-${i + 1}.png`);
      await thumb.screenshot({ path: file });
      await thumb.close();
      console.log('wrote', file);
    }
  } else {
    await mkdir(path.dirname(path.resolve(output)), { recursive: true });
    if (flags.has('--preview')) {
      await page.evaluate((n) => {
        document.body.classList.add('preview');
        document.querySelectorAll('.page').forEach((p, i) => { if (i >= n) p.remove(); });
      }, maxPages);
    }
    await page.emulateMedia({ media: 'print' });
    await page.pdf({ path: output, format: 'Letter', printBackground: true, preferCSSPageSize: true });
    const total = await page.$$eval('.page', (p) => p.length);
    console.log(`wrote ${output} (${total} pages)`);
  }
} finally {
  await browser.close();
}
