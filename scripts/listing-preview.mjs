#!/usr/bin/env node
// Build a mock product-listing page from products/<slug>/06-listing.md so the
// owner can test how the listing reads and looks before uploading, and run
// automatic listing checks (title length, keyword placement, banned claims,
// thumbnail size). The mock is deliberately unbranded — it is NOT a copy of
// any marketplace's design.
//
// Usage: node scripts/listing-preview.mjs products/<slug>
// Output: products/<slug>/listing-preview/
//   listing-preview.html   open in a browser
//   desktop.png, mobile.png, search-grid.png, checks.md
import { readFile, readdir, writeFile, mkdir, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const dir = process.argv[2];
if (!dir) { console.error('Usage: node scripts/listing-preview.mjs products/<slug>'); process.exit(1); }
const slug = path.basename(path.resolve(dir));
const outDir = path.join(dir, 'listing-preview');
await mkdir(outDir, { recursive: true });

const md = await readFile(path.join(dir, '06-listing.md'), 'utf8');
const section = (name) => {
  const m = md.match(new RegExp(`^## ${name}[^\\n]*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, 'm'));
  return m ? m[1] : '';
};

// --- Parse listing fields ---------------------------------------------------
const titleSec = section('Title');
const title = (titleSec.match(/\*\*(?:แนะนำ|Recommended)[^\n]*\n\s*`([^`]+)`/) || titleSec.match(/`([^`]{20,})`/) || [])[1] ?? '(no title found)';
const keyword = (titleSec.match(/\*\*"([^"]+)"\*\*/) || [])[1] ?? '';
const description = ((section('Description').match(/```\n([\s\S]*?)```/) || [])[1] ?? '').trim();
const price = (section('Pricing').match(/\$\s?(\d+(?:\.\d{2})?)/) || [])[1] ?? '?';
const catRow = (label) => {
  const m = section('Categories').match(new RegExp(`\\|\\s*\\*\\*${label}\\*\\*[^|]*\\|([^|]+)\\|`, 'i'));
  return m ? m[1].replace(/\*\*/g, '').trim() : '';
};
const stripNotes = (x) => x.replace(/\s*\([^)]*[\u0E00-\u0E7F][^)]*\)/g, '').trim(); // drop Thai notes
const grades = stripNotes(catRow('Grade levels'));
const subjects = catRow('Subject');
const resource = catRow('Resource type');
const standards = catRow('Standards');
const pages = catRow('Number of pages');

// --- Assets -----------------------------------------------------------------
const thumbDir = path.join(dir, 'output', 'thumbnails');
const thumbs = (await readdir(thumbDir).catch(() => [])).filter((f) => /\.png$/i.test(f)).sort();
const thumbInfo = await Promise.all(thumbs.map(async (f) => ({ f, size: (await stat(path.join(thumbDir, f))).size })));
const rel = (p) => path.relative(outDir, p).split(path.sep).join('/');

const previewPdf = (await readdir(path.join(dir, 'output')).catch(() => [])).find((f) => f.endsWith('-preview.pdf'));
let previewImgs = [];
if (previewPdf) {
  try {
    execFileSync('pdftoppm', ['-r', '45', '-png', path.join(dir, 'output', previewPdf), path.join(outDir, 'preview')]);
    previewImgs = (await readdir(outDir)).filter((f) => /^preview-\d+\.png$/.test(f)).sort();
  } catch { /* pdftoppm not installed: preview strip is skipped */ }
}

// --- Checks -----------------------------------------------------------------
const BANNED = ['handmade', 'ai-free', 'ai free', 'teacher-written', 'teacher written', 'teacher-created',
  'teacher created', 'classroom-tested', 'classroom tested', 'best seller', 'bestseller', 'best-selling',
  'aligned to all standards', '#1', 'award-winning'];
const checks = [];
const add = (ok, label, detail = '') => checks.push({ ok, label, detail });
const lower = description.toLowerCase();
const firstSentences = description.split(/(?<=[.?!])\s+/).slice(0, 3).join(' ').toLowerCase();
add(title.length <= 80, `Title length ${title.length}/80`);
add(!!keyword && title.toLowerCase().includes(keyword.toLowerCase().replace(/^2 digit/, '2 digit')),
  'Main keyword in title', keyword ? `"${keyword}"` : 'no keyword found in 06-listing.md');
add(!!keyword && firstSentences.includes(keyword.toLowerCase()), 'Main keyword in first 3 sentences of description');
const kwCount = keyword ? lower.split(keyword.toLowerCase()).length - 1 : 0;
add(kwCount >= 1 && kwCount <= 3, `Main keyword used ${kwCount}× in description (1–3 recommended)`);
const bannedHits = BANNED.filter((w) => `${title} ${description}`.toLowerCase().includes(w));
add(bannedHits.length === 0, 'No banned/unverifiable claims', bannedHits.join(', '));
add(!/\[Store Name\]/.test(description), 'Store name filled in', 'still "[Store Name]" — fill in before publishing');
add(thumbInfo.length >= 1, `Thumbnails found: ${thumbInfo.length}`);
for (const t of thumbInfo) add(t.size < 4 * 1024 * 1024, `${t.f} < 4 MB`, `${(t.size / 1024).toFixed(0)} KB`);
add(!!previewPdf, 'Preview PDF present', previewPdf ?? '');
add(Number(price) > 0, `Price $${price}`);

// --- HTML -------------------------------------------------------------------
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const descHtml = esc(description)
  .split(/\n{2,}/)
  .map((block) => {
    const lines = block.split('\n');
    if (/^[A-Z][A-Z0-9 '&/,-]{3,}(\s*\(.*\))?$/.test(lines[0])) {
      return `<h3>${lines[0]}</h3>${lines.slice(1).map((l) => `<p>${l}</p>`).join('')}`;
    }
    return lines.map((l) => `<p>${l}</p>`).join('');
  }).join('')
  .replace(/<p>• /g, '<p class="li">')
  .replace(/<p>([○□△☆][^<]*)<\/p>/g, '<p class="lvl">$1</p>');
const chips = (s) => s.split(/[,)]\s*|\d\)\s*/).map((x) => x.replace(/\(.*$/, '').trim()).filter((x) => x && x.length < 40)
  .map((x) => `<span class="chip">${esc(x)}</span>`).join('');

const gridCards = Array.from({ length: 8 }, (_, i) => i === 2
  ? `<div class="card ours"><img src="${rel(path.join(thumbDir, thumbs[0] ?? ''))}"><div class="ct">${esc(title)}</div><div class="cp">$${price}</div></div>`
  : `<div class="card"><div class="ph"></div><div class="ct ghost"></div><div class="ct ghost short"></div><div class="cp ghost-p"></div></div>`).join('');

const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Listing Preview</title>
<style>
:root{--bg:#f6f7f9;--card:#fff;--ink:#1d2433;--muted:#667085;--line:#e4e7ec;--accent:#3557d6;--ok:#127a43;--bad:#b42318}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
.banner{background:#fff4e5;border-bottom:1px solid #f5d29a;padding:8px 16px;font-size:13px;text-align:center}
.wrap{max-width:1120px;margin:0 auto;padding:20px 16px}
.top{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:28px}
@media (max-width:820px){.top{grid-template-columns:1fr}}
.gallery .main{width:100%;aspect-ratio:1;border-radius:12px;background:#fff;border:1px solid var(--line);object-fit:contain}
.strip{display:flex;gap:8px;margin-top:8px;overflow-x:auto}.strip img{width:72px;height:72px;border-radius:8px;border:2px solid var(--line);cursor:pointer;object-fit:cover}
.strip img.on{border-color:var(--accent)}
h1{font-size:24px;line-height:1.3;margin:0 0 6px}.by{color:var(--muted);font-size:14px;margin-bottom:14px}
.buy{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px;margin-bottom:16px}
.price{font-size:30px;font-weight:700}.btn{display:block;width:100%;margin-top:12px;padding:12px;border:0;border-radius:999px;background:var(--accent);color:#fff;font-weight:600;font-size:16px}
.btn.alt{background:#fff;color:var(--accent);border:1px solid var(--accent)}
.meta{display:grid;grid-template-columns:110px 1fr;gap:6px 10px;font-size:14px}.meta b{color:var(--muted);font-weight:500}
.chip{display:inline-block;background:#eef2ff;color:#2b3a8f;border-radius:999px;padding:2px 10px;margin:2px 4px 2px 0;font-size:13px}
.panel{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:20px;margin-top:24px}
.panel h2{margin:0 0 12px;font-size:19px}.desc h3{font-size:14px;letter-spacing:.04em;margin:18px 0 6px}.desc p{margin:4px 0}.desc .li{padding-left:16px;text-indent:-12px}.desc .li::before{content:"• "}.desc .lvl{font-weight:700;margin-top:12px}
.pv{display:flex;gap:12px;overflow-x:auto;padding-bottom:6px}.pv img{height:300px;border:1px solid var(--line);border-radius:6px;background:#fff}
.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}@media (max-width:820px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
.card{background:#fff;border:1px solid var(--line);border-radius:10px;padding:8px}.card img,.card .ph{width:100%;aspect-ratio:1;border-radius:6px;object-fit:cover;background:#e9ecf1}
.card .ct{font-size:13px;line-height:1.35;margin-top:6px;max-height:3.9em;overflow:hidden}.card .cp{font-weight:700;margin-top:4px}
.ghost{height:10px;background:#e9ecf1;border-radius:4px;margin-top:8px}.ghost.short{width:60%}.ghost-p{width:30%;height:12px;background:#e9ecf1;border-radius:4px;margin-top:8px}
.ours{outline:3px solid var(--accent)}
.checks{list-style:none;padding:0;margin:0}.checks li{padding:6px 0;border-bottom:1px solid var(--line);font-size:14px}.checks .d{color:var(--muted)}
.ok{color:var(--ok);font-weight:700}.bad{color:var(--bad);font-weight:700}
</style></head><body>
<div class="banner">Listing test preview for <b>${esc(slug)}</b> — mock layout only, not a real store page.</div>
<div class="wrap">
 <div class="top">
  <div class="gallery">
   <img class="main" id="main" src="${rel(path.join(thumbDir, thumbs[0] ?? ''))}" alt="">
   <div class="strip">${thumbs.map((t, i) => `<img class="${i ? '' : 'on'}" src="${rel(path.join(thumbDir, t))}" alt="">`).join('')}</div>
  </div>
  <div>
   <h1>${esc(title)}</h1>
   <div class="by">by [Store Name] · ${esc(grades || '')}</div>
   <div class="buy"><div class="price">$${price}</div>
    <button class="btn">Add to cart</button><button class="btn alt">Preview (${previewImgs.length} pages)</button></div>
   <div class="meta">
    <b>Grades</b><div>${chips(grades)}</div>
    <b>Subject</b><div>${chips(subjects)}</div>
    <b>Resource</b><div>${chips(resource)}</div>
    <b>Standards</b><div>${chips(standards.replace(/ยืนยัน.*$/, ''))}</div>
    <b>Format</b><div>PDF · ${esc(pages || '?')} pages</div>
   </div>
  </div>
 </div>
 ${previewImgs.length ? `<div class="panel"><h2>Preview pages</h2><div class="pv">${previewImgs.map((p) => `<img src="${p}" alt="">`).join('')}</div></div>` : ''}
 <div class="panel desc"><h2>Description</h2>${descHtml}</div>
 <div class="panel" id="search"><h2>In a search results grid (small size)</h2><div class="grid">${gridCards}</div></div>
 <div class="panel"><h2>Listing checks</h2><ul class="checks">${checks.map((c) => `<li><span class="${c.ok ? 'ok' : 'bad'}">${c.ok ? 'PASS' : 'CHECK'}</span> ${esc(c.label)} <span class="d">${esc(c.detail)}</span></li>`).join('')}</ul></div>
</div>
<script>
document.querySelectorAll('.strip img').forEach(img => img.addEventListener('click', () => {
  document.getElementById('main').src = img.src;
  document.querySelectorAll('.strip img').forEach(i => i.classList.toggle('on', i === img));
}));
</script></body></html>`;

const htmlPath = path.join(outDir, 'listing-preview.html');
await writeFile(htmlPath, html);
await writeFile(path.join(outDir, 'checks.md'),
  `# Listing checks — ${slug}\n\n${checks.map((c) => `- ${c.ok ? '✅' : '⚠️'} ${c.label}${c.detail ? ` — ${c.detail}` : ''}`).join('\n')}\n`);

// --- Screenshots ------------------------------------------------------------
const browser = await chromium.launch();
try {
  const url = pathToFileURL(path.resolve(htmlPath)).href;
  const desk = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await desk.goto(url, { waitUntil: 'networkidle' });
  await desk.screenshot({ path: path.join(outDir, 'desktop.png'), fullPage: true });
  await (await desk.$('#search')).screenshot({ path: path.join(outDir, 'search-grid.png') });
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await mob.goto(url, { waitUntil: 'networkidle' });
  await mob.screenshot({ path: path.join(outDir, 'mobile.png') });
} finally {
  await browser.close();
}
console.log(`wrote ${outDir}/ (listing-preview.html, desktop.png, mobile.png, search-grid.png, checks.md)`);
for (const c of checks) console.log(`${c.ok ? 'PASS ' : 'CHECK'} ${c.label}${c.detail ? ` — ${c.detail}` : ''}`);
