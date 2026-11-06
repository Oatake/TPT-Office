#!/usr/bin/env node
// Render a worksheet HTML file to a print-ready PDF (US Letter), a watermarked
// preview PDF, or square PNG thumbnails for TPT.
//
// Usage:
//   node scripts/build-pdf.mjs <input.html> <output.pdf>
//   node scripts/build-pdf.mjs <input.html> <output-preview.pdf> --preview [--pages 4 | --select 1,5,13,14]
//   node scripts/build-pdf.mjs <input.html> <output-dir> --thumbnails [--pages 4]
//   node scripts/build-pdf.mjs <thumbnails.html> <output-dir> --thumbnails --raw   (each .page saved at its own size)
//   add --theme <name> to override the worksheet's <meta name="tpt-theme"> (templates/themes/<name>.css)
import { mkdir, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const VALUE_FLAGS = new Set(['--pages', '--theme', '--select']);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const positional = args.filter((a, i) => !a.startsWith('--') && !VALUE_FLAGS.has(args[i - 1]));
const flagValue = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const maxPages = Number(flagValue('--pages') ?? 4);
const [input, output] = positional;

if (!input || !output) {
  console.error('Usage: node scripts/build-pdf.mjs <input.html> <output> [--preview|--thumbnails] [--pages N]');
  process.exit(1);
}

// Brand fonts: every brand/assets/fonts/<dir>/<Family>-<Style>.(woff2|ttf|...)
// is registered as @font-face so worksheets and themes can use it by family
// name. <Style> is Regular, Bold, ExtraBold, or Variable (variable-weight font).
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
async function brandFontCss() {
  const dir = path.join(repoRoot, 'brand', 'assets', 'fonts');
  const weights = { regular: '400', bold: '700', extrabold: '800', variable: '100 900' };
  let css = '';
  for (const fam of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    if (!fam.isDirectory()) continue;
    for (const f of await readdir(path.join(dir, fam.name))) {
      const m = f.match(/^(.+)-(Regular|Bold|ExtraBold|Variable)\.(woff2|woff|ttf|otf)$/i);
      if (!m) continue;
      const url = pathToFileURL(path.join(dir, fam.name, f)).href;
      css += `@font-face{font-family:"${m[1]}";font-weight:${weights[m[2].toLowerCase()]};src:url("${url}");}\n`;
    }
  }
  return css;
}

// Theme: --theme flag, else <meta name="tpt-theme" content="...">. The theme
// stylesheet is appended last so it overrides the template's base styles.
async function applyTheme(page) {
  const name = flagValue('--theme')
    ?? await page.$eval('meta[name="tpt-theme"]', (m) => m.content).catch(() => undefined);
  if (!name) return null;
  const file = path.join(repoRoot, 'templates', 'themes', `${name}.css`);
  try {
    await page.addStyleTag({ content: await readFile(file, 'utf8') });
  } catch {
    throw new Error(`Theme "${name}" not found: ${file}`);
  }
  await page.evaluate((n) => document.body.classList.add(`theme-${n}`), name);
  return name;
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(path.resolve(input)).href, { waitUntil: 'networkidle' });
  const fontCss = await brandFontCss();
  if (fontCss) await page.addStyleTag({ content: fontCss });
  // Children's materials: turn off ligatures so "fi", "ff", "ffi", "fl" print as
  // separate letters (a fi ligature hides the dot on the i, which breaks
  // phonics tasks like "dot the vowels").
  await page.addStyleTag({ content: 'html, body, body * { font-variant-ligatures: none !important; font-feature-settings: "liga" 0, "clig" 0, "dlig" 0 !important; }' });
  const theme = await applyTheme(page);
  if (theme) console.log('theme:', theme);
  await page.evaluate(async () => {
    // Force-load every declared face, then wait until fonts are ready.
    await Promise.all([...document.fonts].map((f) => f.load().catch(() => {})));
    await document.fonts.ready;
  });

  if (flags.has('--thumbnails')) {
    await mkdir(output, { recursive: true });
    const sheets = await page.$$('.page');
    const thumbBg = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--thumb-bg').trim() || '#f3f6fc');
    const count = Math.min(maxPages, sheets.length);
    // Square canvas: one letter page centered on a brand-colored background.
    for (let i = 0; i < count; i++) {
      if (flags.has('--raw')) {
        // Designed thumbnails (e.g. 1400x1400 .page elements in thumbnails.html): save as-is.
        const box = await sheets[i].boundingBox();
        await page.setViewportSize({ width: Math.ceil(box.width), height: Math.ceil(box.height) });
        const file = path.join(output, `thumbnail-${i + 1}.png`);
        await sheets[i].screenshot({ path: file, type: 'png' });
        console.log('wrote', file);
        continue;
      }
      const png = await sheets[i].screenshot({ type: 'png' });
      const thumb = await browser.newPage({ viewport: { width: 1400, height: 1400 } });
      await thumb.setContent(`<!DOCTYPE html><html><body style="margin:0;width:1400px;height:1400px;
        display:flex;align-items:center;justify-content:center;background:${thumbBg}">
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
      // --select 1,4,10,13 keeps those pages (1-based); otherwise the first --pages N.
      const select = flagValue('--select')?.split(',').map((x) => Number(x.trim()) - 1);
      await page.evaluate(({ n, select }) => {
        document.body.classList.add('preview');
        document.querySelectorAll('.page').forEach((p, i) => {
          if (select ? !select.includes(i) : i >= n) p.remove();
        });
      }, { n: maxPages, select });
    }
    await page.emulateMedia({ media: 'print' });
    await page.pdf({ path: output, format: 'Letter', printBackground: true, preferCSSPageSize: true });
    const total = await page.$$eval('.page', (p) => p.length);
    console.log(`wrote ${output} (${total} pages)`);
  }
} finally {
  await browser.close();
}
