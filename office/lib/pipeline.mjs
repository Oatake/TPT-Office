// Product pipeline: works out which /new-tpt-product step each product has
// reached, from the files in products/<slug>/ and products/catalog.json.
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

// Same order as .claude/skills/new-tpt-product/SKILL.md.
export const STAGES = [
  { id: 'research', label: 'วิจัยตลาด', agent: 'market-researcher', files: ['01-research.md'] },
  { id: 'brief', label: 'Creative Brief', agent: 'creative-director', files: ['02b-creative-brief.md'] },
  { id: 'plan', label: 'วางแผนหลักสูตร', agent: 'curriculum-designer', files: ['02-plan.md'] },
  { id: 'content', label: 'เขียนเนื้อหา', agent: 'content-writer', files: ['03-content.md'] },
  { id: 'design', label: 'ออกแบบ PDF', agent: 'worksheet-designer', files: ['worksheet.html'], needsPdf: true },
  { id: 'qa', label: 'ตรวจคุณภาพ', agent: 'quality-reviewer', files: ['05-qa-report.md'] },
  { id: 'appeal', label: 'Appeal Review', agent: 'creative-director', appeal: true },
  { id: 'listing', label: 'Listing', agent: 'tpt-listing-specialist', files: ['06-listing.md'] },
  { id: 'marketing', label: 'การตลาด', agent: 'marketing-specialist', files: ['07-marketing.md'] },
];

const ACTIVE_STATUSES = new Set(['planning', 'in-progress']);

async function exists(p) {
  try { return await stat(p); } catch { return null; }
}

async function readText(p) {
  try { return await readFile(p, 'utf8'); } catch { return null; }
}

async function listDir(p) {
  try { return await readdir(p); } catch { return []; }
}

// "**ผลการตรวจ:** **PASS WITH FIXES**" → "PASS WITH FIXES"
export function qaVerdict(text) {
  if (!text) return null;
  const line = text.split('\n').find((l) => /ผลการตรวจ|verdict|result/i.test(l) && /PASS|FAIL/.test(l));
  return line?.match(/PASS WITH FIXES|PASS|FAIL/)?.[0] ?? null;
}

// The appeal review can be revised several times: the last "ผล:" line wins.
export function appealVerdict(briefText) {
  if (!briefText) return null;
  const i = briefText.indexOf('## Appeal Review');
  if (i < 0) return null;
  const verdicts = [...briefText.slice(i).matchAll(/^#*\s*(?:ผล|Result|Verdict)\s*:\s*\**\s*(PASS|REVISE|APPROVED?)/gim)];
  return verdicts.length ? verdicts.at(-1)[1].toUpperCase() : 'DONE';
}

// "- ✅ Title length 77/80" / "- ⚠️ ..." / "- ❌ ..." → counts + warnings
export function listingChecks(text) {
  if (!text) return null;
  const lines = text.split('\n').filter((l) => /^- (✅|⚠️|❌)/.test(l));
  return {
    pass: lines.filter((l) => l.startsWith('- ✅')).length,
    warn: lines.filter((l) => l.startsWith('- ⚠️')).map((l) => l.slice(4).trim()),
    fail: lines.filter((l) => l.startsWith('- ❌')).map((l) => l.slice(3).trim()),
  };
}

async function productStages(dir, slug) {
  const stages = [];
  const brief = await readText(path.join(dir, '02b-creative-brief.md'));
  for (const s of STAGES) {
    let done = false;
    let mtime = null;
    let verdict = null;
    if (s.appeal) {
      verdict = appealVerdict(brief);
      done = verdict !== null;
      if (done) mtime = (await exists(path.join(dir, '02b-creative-brief.md')))?.mtime ?? null;
    } else {
      const st = await Promise.all(s.files.map((f) => exists(path.join(dir, f))));
      done = st.every(Boolean);
      if (done && s.needsPdf) {
        const pdfs = (await listDir(path.join(dir, 'output'))).filter((f) => f.endsWith('.pdf'));
        done = pdfs.length > 0;
      }
      if (done) mtime = st.reduce((m, x) => (x && (!m || x.mtime > m) ? x.mtime : m), null);
      if (done && s.id === 'qa') verdict = qaVerdict(await readText(path.join(dir, '05-qa-report.md')));
    }
    stages.push({ id: s.id, label: s.label, agent: s.agent, done, verdict, mtime: mtime?.toISOString() ?? null, slug });
  }
  return stages;
}

async function productFiles(dir, slug) {
  const rel = (...p) => path.posix.join('products', slug, ...p);
  const out = await listDir(path.join(dir, 'output'));
  const thumbs = (await listDir(path.join(dir, 'output', 'thumbnails'))).filter((f) => f.endsWith('.png')).sort();
  const files = {
    pdf: out.find((f) => f.endsWith('.pdf') && !f.endsWith('-preview.pdf')),
    preview: out.find((f) => f.endsWith('-preview.pdf')),
    overview: out.find((f) => f.endsWith('-overview.png')),
  };
  return {
    pdf: files.pdf ? rel('output', files.pdf) : null,
    preview: files.preview ? rel('output', files.preview) : null,
    overview: files.overview ? rel('output', files.overview) : null,
    thumbnails: thumbs.map((t) => rel('output', 'thumbnails', t)),
    listingPreview: (await exists(path.join(dir, 'listing-preview', 'listing-preview.html'))) ? rel('listing-preview', 'listing-preview.html') : null,
    docs: (await listDir(dir)).filter((f) => /^\d\d[a-z]?-.*\.md$/.test(f) || f === 'design-notes.md').sort().map((f) => rel(f)),
  };
}

export async function loadPipeline(root) {
  const productsDir = path.join(root, 'products');
  let catalog = { products: [] };
  try { catalog = JSON.parse(await readFile(path.join(productsDir, 'catalog.json'), 'utf8')); } catch { /* empty shop */ }

  const bySlug = new Map((catalog.products ?? []).map((p) => [p.slug, p]));
  // Folders that exist but are not in the catalog yet still count (step 1 in progress).
  for (const d of await listDir(productsDir)) {
    if (d.startsWith('_') || d.startsWith('.') || d === 'catalog.json' || bySlug.has(d)) continue;
    if ((await exists(path.join(productsDir, d)))?.isDirectory()) bySlug.set(d, { slug: d, status: 'planning', title: d, uncataloged: true });
  }

  const products = [];
  for (const [slug, entry] of bySlug) {
    const dir = path.join(productsDir, slug);
    const hasDir = (await exists(dir))?.isDirectory();
    const stages = hasDir ? await productStages(dir, slug) : STAGES.map((s) => ({ id: s.id, label: s.label, agent: s.agent, done: false, slug }));
    const status = entry.status ?? 'planning';
    const active = ACTIVE_STATUSES.has(status);
    // The next unfinished step of an active product is "waiting for its agent".
    const next = active ? stages.find((s) => !s.done) : null;
    if (next) next.next = true;
    const checks = hasDir ? listingChecks(await readText(path.join(dir, 'listing-preview', 'checks.md'))) : null;
    products.push({
      slug,
      title: entry.title ?? slug,
      status,
      date: entry.date ?? null,
      subject: entry.subject ?? null,
      grades: entry.grades ?? [],
      theme: entry.theme ?? null,
      concept: entry.concept ?? null,
      hero: entry.hero_activity ?? null,
      price: entry.price ?? null,
      series: entry.series ?? null,
      uncataloged: Boolean(entry.uncataloged),
      progress: stages.filter((s) => s.done).length / stages.length,
      nextStage: next?.id ?? null,
      stages,
      checks,
      files: hasDir ? await productFiles(dir, slug) : null,
    });
  }
  products.sort((a, b) => (b.date ?? '9999').localeCompare(a.date ?? '9999'));

  const ideas = [];
  for (const f of (await listDir(path.join(productsDir, '_ideas'))).filter((x) => x.endsWith('.md')).sort().reverse()) {
    const text = await readText(path.join(productsDir, '_ideas', f));
    ideas.push({ file: path.posix.join('products/_ideas', f), title: text?.match(/^#\s+(.+)$/m)?.[1] ?? f });
  }
  return { products, ideas };
}
