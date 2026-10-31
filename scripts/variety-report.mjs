#!/usr/bin/env node
// Summarize recent products in products/catalog.json and flag repetition
// against docs/variety-policy.md. Used by the creative-director agent.
//
// Usage: node scripts/variety-report.mjs [N=10]
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const N = Number(process.argv[2] ?? 10);

const catalog = JSON.parse(await readFile(path.join(root, 'products', 'catalog.json'), 'utf8'));
const all = [...catalog.products]
  .filter((p) => p.status !== 'archived')
  .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
const recent = all.slice(0, N);

const themes = (await readdir(path.join(root, 'templates', 'themes')))
  .filter((f) => f.endsWith('.css')).map((f) => f.replace(/\.css$/, ''));
const library = await readFile(path.join(root, 'docs', 'activity-library.md'), 'utf8');
const activityIds = [...library.matchAll(/^\| `([a-z0-9-]+)` \|/gm)].map((m) => m[1]);

const count = (items) => items.flat().filter(Boolean)
  .reduce((m, x) => m.set(x, (m.get(x) ?? 0) + 1), new Map());
const fmt = (m) => [...m].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}×${v}`).join(', ') || '—';

console.log(`# Variety report — last ${recent.length} of ${all.length} products\n`);
console.log('| date | slug | subject | grades | theme | hero | concept |');
console.log('|---|---|---|---|---|---|---|');
for (const p of recent) {
  console.log(`| ${p.date} | ${p.slug} | ${p.subject} | ${(p.grades ?? []).join(',')} | ${p.theme ?? '—'} | ${p.hero_activity ?? '—'} | ${p.concept ?? '—'} |`);
}

console.log('\n## Usage');
console.log('- Subjects:', fmt(count(recent.map((p) => p.subject))));
console.log('- Grades:', fmt(count(recent.map((p) => p.grades ?? []))));
console.log('- Themes:', fmt(count(recent.map((p) => p.theme))));
console.log('- Hero activities:', fmt(count(recent.map((p) => p.hero_activity))));
console.log('- Activities:', fmt(count(recent.map((p) => p.activities ?? []))));

// Policy checks (docs/variety-policy.md)
const issues = [];
const last = (n) => all.slice(0, n);
const usedThemes3 = new Set(last(3).map((p) => p.theme).filter(Boolean));
const usedHero5 = new Set(last(5).map((p) => p.hero_activity).filter(Boolean));
const last7 = last(7);
if (last7.length >= 7) {
  if (new Set(last7.map((p) => p.subject)).size < 2) issues.push('Last 7 products cover fewer than 2 subjects.');
  if (new Set(last7.flatMap((p) => p.grades ?? [])).size < 2) issues.push('Last 7 products cover fewer than 2 grade levels.');
}
for (const [act, n] of count(last(10).map((p) => p.activities ?? []))) {
  if (n > 6) issues.push(`Activity "${act}" appears in ${n} of the last 10 products (max 6).`);
}
const concepts = count(all.filter((p) => !p.series).map((p) => p.concept));
for (const [c, n] of concepts) if (n > 1) issues.push(`Concept "${c}" is used ${n} times outside a series.`);
const topicKey = (p) => `${(p.topic ?? '').toLowerCase()}|${(p.grades ?? []).join(',')}`;
for (const [k, n] of count(last(30).filter((p) => !p.series).map(topicKey))) {
  if (n > 1) issues.push(`Topic+grade "${k}" repeats ${n} times in the last 30 (not marked as a series).`);
}

console.log('\n## Policy check');
console.log(issues.length ? issues.map((i) => `- ⚠️ ${i}`).join('\n') : '- ✅ No violations');

console.log('\n## Available for the next product');
console.log('- Themes not used in last 3:', themes.filter((t) => !usedThemes3.has(t)).join(', ') || '—');
console.log('- Hero activities not used in last 5:', activityIds.filter((a) => !usedHero5.has(a)).join(', '));
