// Demo mode: writes a fake Claude Code session to a temp folder and keeps it
// moving through the /new-tpt-product pipeline, so the office can be tried
// without running real agents.  `node office/server.mjs --demo`
import { appendFile, mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const SLUG = 'demo-3rd-grade-multiplication-arrays';
const P = `products/${SLUG}`;

// One step per Agent call; `with` runs in parallel with the step (QA + appeal).
const STEPS = [
  { agent: 'market-researcher', desc: 'Research 3rd grade multiplication niches', tools: [['Read', { file_path: 'products/catalog.json' }], ['WebSearch', { query: 'multiplication arrays worksheets 3rd grade TPT' }], ['WebSearch', { query: 'teacher pay teachers arrays bestseller price' }], ['Write', { file_path: `${P}/01-research.md` }]] },
  { agent: 'creative-director', desc: 'Creative brief for arrays product', tools: [['Bash', { description: 'Run variety report for last 10 products', command: 'node scripts/variety-report.mjs 10' }], ['Read', { file_path: 'docs/variety-policy.md' }], ['Write', { file_path: `${P}/02b-creative-brief.md` }]] },
  { agent: 'curriculum-designer', desc: 'Product plan + standards', tools: [['Read', { file_path: `${P}/02b-creative-brief.md` }], ['WebFetch', { url: 'https://www.thecorestandards.org/Math/Content/3/OA/' }], ['Write', { file_path: `${P}/02-plan.md` }]] },
  { agent: 'content-writer', desc: 'Write 24 pages of content + answer key', tools: [['Read', { file_path: `${P}/02-plan.md` }], ['Write', { file_path: `${P}/03-content.md` }], ['Edit', { file_path: `${P}/03-content.md` }]] },
  { agent: 'worksheet-designer', desc: 'Design PDF, preview and thumbnails', tools: [['Read', { file_path: 'templates/worksheet-template.html' }], ['Write', { file_path: `${P}/worksheet.html` }], ['Bash', { description: 'Build PDF', command: 'node scripts/build-pdf.mjs ...' }], ['Bash', { description: 'Render thumbnails' }]] },
  { agent: 'quality-reviewer', desc: 'QA: answer keys, spelling, layout', with: { agent: 'creative-director', desc: 'Appeal review of cover + thumbnails', tools: [['Read', { file_path: `${P}/output/thumbnails/thumbnail-1.png` }], ['Edit', { file_path: `${P}/02b-creative-brief.md` }]] }, tools: [['Read', { file_path: `${P}/03-content.md` }], ['Grep', { pattern: 'Answer Key' }], ['Bash', { description: 'Check PDF page count' }], ['Write', { file_path: `${P}/05-qa-report.md` }]] },
  { agent: 'tpt-listing-specialist', desc: 'Listing, SEO title, tags, price', tools: [['WebSearch', { query: 'multiplication arrays worksheets keywords' }], ['Write', { file_path: `${P}/06-listing.md` }], ['Bash', { description: 'Listing preview + checks', command: `node scripts/listing-preview.mjs ${P}` }]] },
  { agent: 'marketing-specialist', desc: 'Pinterest + email promo plan', tools: [['Read', { file_path: `${P}/06-listing.md` }], ['WebSearch', { query: 'pinterest teacher pins february' }], ['Write', { file_path: `${P}/07-marketing.md` }]] },
];

export async function startDemo({ tickMs = 3000 } = {}) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'tpt-office-demo-'));
  const sid = randomUUID();
  const main = path.join(dir, `${sid}.jsonl`);
  const subDir = path.join(dir, sid, 'subagents');
  await mkdir(subDir, { recursive: true });
  await writeFile(main, '');
  const now = () => new Date().toISOString();
  const log = (file, obj) => appendFile(file, `${JSON.stringify({ sessionId: sid, timestamp: now(), ...obj })}\n`);
  const toolUse = (file, name, input) => {
    const id = `toolu_${randomUUID().slice(0, 12)}`;
    return log(file, { type: 'assistant', message: { role: 'assistant', content: [{ type: 'tool_use', id, name, input }] } }).then(() => id);
  };
  const toolResult = (file, id) => log(file, { type: 'user', message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: id, content: 'ok' }] } });
  const say = (file, text) => log(file, { type: 'assistant', message: { role: 'assistant', content: [{ type: 'text', text }] } });

  await log(main, { type: 'user', message: { role: 'user', content: '/new-tpt-product 3rd grade multiplication arrays' } });

  // A tiny cooperative script: each run is a generator of ticks.
  async function* runAgent(step) {
    const prompt = `Product folder: ${P}\nTask: ${step.desc}`;
    const id = await toolUse(main, 'Agent', { subagent_type: step.agent, description: step.desc, prompt });
    const file = path.join(subDir, `agent-${randomUUID().slice(0, 8)}.jsonl`);
    await log(file, { type: 'user', isSidechain: true, message: { role: 'user', content: prompt } });
    for (const [name, input] of step.tools) {
      yield;
      const t = await toolUse(file, name, input);
      yield;
      await toolResult(file, t);
    }
    await say(file, 'Done.');
    await toolResult(main, id);
  }

  async function* pipeline() {
    for (;;) {
      for (const step of STEPS) {
        const runs = [runAgent(step), step.with ? runAgent(step.with) : null].filter(Boolean);
        let active = runs;
        while (active.length) {
          const res = await Promise.all(active.map((r) => r.next()));
          active = active.filter((_, i) => !res[i].done);
          yield;
        }
        const c = await toolUse(main, 'Bash', { description: `Commit ${step.agent} output`, command: 'git commit' });
        yield;
        await toolResult(main, c);
      }
      await say(main, 'สินค้าพร้อมแล้ว — รอเจ้าของร้านตรวจ PDF ก่อนลงขาย');
      for (let i = 0; i < 6; i++) yield;
    }
  }

  const it = pipeline();
  let timer = null;
  const step = async () => { await it.next(); timer = setTimeout(step, tickMs); };
  step();
  return { dir, stop: () => clearTimeout(timer) };
}
