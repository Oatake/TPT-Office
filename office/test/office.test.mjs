// node --test office/test/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, utimes, appendFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { qaVerdict, appealVerdict, listingChecks, loadPipeline, STAGES } from '../lib/pipeline.mjs';
import { agentsForFile } from '../lib/history.mjs';
import { loadLive, activityKind, toolDetail, transcriptDirFor } from '../lib/live.mjs';
import { loadTeam } from '../lib/team.mjs';
import { buildState } from '../lib/state.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

test('QA verdict is read from the "ผลการตรวจ" line', () => {
  assert.equal(qaVerdict('# QA\n**ผลการตรวจ:** **PASS WITH FIXES** (blocker 3)'), 'PASS WITH FIXES');
  assert.equal(qaVerdict('**ผลการตรวจ:** **FAIL**'), 'FAIL');
  assert.equal(qaVerdict('nothing here'), null);
});

test('appeal verdict: the last review wins', () => {
  const brief = '# Brief\n## Appeal Review\n### ผล: **REVISE** (2 fixes)\n...\n### ผล: **PASS** after revision';
  assert.equal(appealVerdict(brief), 'PASS');
  assert.equal(appealVerdict('# Brief only'), null);
});

test('listing checks are counted', () => {
  const c = listingChecks('# Listing checks\n- ✅ Title\n- ⚠️ Store name — fill in\n- ❌ Price missing\n- ✅ Thumbs');
  assert.equal(c.pass, 2);
  assert.deepEqual(c.warn, ['Store name — fill in']);
  assert.deepEqual(c.fail, ['Price missing']);
});

test('git files are credited to the right agent', () => {
  assert.deepEqual(agentsForFile('products/x/03-content.md'), ['content-writer']);
  assert.deepEqual(agentsForFile('products/x/output/x.pdf'), ['worksheet-designer']);
  assert.deepEqual(agentsForFile('products/x/listing-preview/checks.md'), ['tpt-listing-specialist']);
  assert.deepEqual(agentsForFile('README.md'), []);
});

test('team roster = PM + every agent in .claude/agents', async () => {
  const team = await loadTeam(root);
  assert.equal(team[0].name, 'project-manager');
  assert.ok(team.length >= 9);
  for (const m of team) assert.ok(m.look?.shirt, `${m.name} has a look`);
});

test('pipeline marks the next step of an in-progress product', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'office-pipe-'));
  await mkdir(path.join(dir, 'products', 'demo-slug'), { recursive: true });
  await writeFile(path.join(dir, 'products', 'catalog.json'), JSON.stringify({ products: [{ slug: 'demo-slug', status: 'in-progress', date: '2026-11-07' }] }));
  for (const f of ['01-research.md', '02b-creative-brief.md', '02-plan.md']) await writeFile(path.join(dir, 'products', 'demo-slug', f), '#');
  const { products } = await loadPipeline(dir);
  assert.equal(products.length, 1);
  assert.equal(products[0].nextStage, 'content');
  assert.equal(products[0].stages.filter((s) => s.done).length, 3);
  assert.equal(products[0].stages.length, STAGES.length);
});

test('tool names map to office animations', () => {
  assert.equal(activityKind('Write'), 'typing');
  assert.equal(activityKind('Grep'), 'reading');
  assert.equal(activityKind('WebSearch'), 'searching');
  assert.equal(activityKind('Bash'), 'running');
  assert.equal(toolDetail('Write', { file_path: '/a/products/x/03-content.md' }), 'x/03-content.md');
  assert.equal(transcriptDirFor('/home/user/TPT-Office').endsWith('-home-user-TPT-Office'), true);
});

async function fakeSession() {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'office-live-'));
  const sid = 'sess-1';
  const main = path.join(dir, `${sid}.jsonl`);
  const ts = new Date().toISOString();
  const line = (f, o) => appendFile(f, `${JSON.stringify({ sessionId: sid, timestamp: ts, ...o })}\n`);
  const use = (id, name, input) => ({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'tool_use', id, name, input }] } });
  const result = (id) => ({ type: 'user', message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: id, content: 'ok' }] } });
  await line(main, { type: 'user', message: { role: 'user', content: '/new-tpt-product 2nd grade fractions' } });
  await line(main, use('a1', 'Agent', { subagent_type: 'market-researcher', description: 'Research fractions', prompt: 'Research products/frac-2' }));
  await line(main, result('a1'));
  await line(main, use('a2', 'Agent', { subagent_type: 'content-writer', description: 'Write content', prompt: 'Write products/frac-2/03-content.md from the plan' }));
  const sub = path.join(dir, sid, 'subagents');
  await mkdir(sub, { recursive: true });
  const sf = path.join(sub, 'agent-1.jsonl');
  await line(sf, { type: 'user', isSidechain: true, message: { role: 'user', content: 'Write products/frac-2/03-content.md from the plan' } });
  await line(sf, use('t1', 'Read', { file_path: 'products/frac-2/02-plan.md' }));
  await line(sf, result('t1'));
  await line(sf, use('t2', 'Write', { file_path: 'products/frac-2/03-content.md' }));
  return { dir, main, sf };
}

test('live: open Agent call = working, with the sub-agent\'s current tool', async () => {
  const { dir } = await fakeSession();
  const live = await loadLive(root, { dir });
  assert.equal(live.available, true);
  assert.equal(live.agents['market-researcher'].state, 'done');
  const cw = live.agents['content-writer'];
  assert.equal(cw.state, 'working');
  assert.equal(cw.slug, 'frac-2');
  assert.equal(cw.activity.kind, 'typing');
  assert.equal(cw.activity.detail, 'frac-2/03-content.md');
  assert.equal(live.pm.state, 'working');
});

test('live: an open call with no writes for a long time = stalled', async () => {
  const { dir, main, sf } = await fakeSession();
  const old = new Date(Date.now() - 60 * 60 * 1000);
  await utimes(main, old, old);
  await utimes(sf, old, old);
  const live = await loadLive(root, { dir });
  assert.equal(live.agents['content-writer'].state, 'stalled');
  assert.equal(live.pm.state, 'idle');
});

test('live: missing transcript folder is reported, not thrown', async () => {
  const live = await loadLive(root, { dir: path.join(os.tmpdir(), 'does-not-exist-office') });
  assert.equal(live.available, false);
});

test('buildState on this repo', async () => {
  const s = await buildState(root, { live: false });
  assert.equal(s.members[0].isPM, true);
  assert.ok(s.products.length >= 1);
  for (const m of s.members) assert.ok(['working', 'next', 'waiting', 'stalled', 'idle'].includes(m.status.state));
});

test('buildState: a live agent shows as working with its task', async () => {
  const { dir } = await fakeSession();
  const s = await buildState(root, { transcripts: dir });
  const cw = s.members.find((m) => m.name === 'content-writer');
  assert.equal(cw.status.state, 'working');
  assert.match(cw.status.headline, /กำลังเขียน/);
  assert.ok(s.feed.some((e) => e.source === 'live' && e.agent === 'content-writer'));
});
