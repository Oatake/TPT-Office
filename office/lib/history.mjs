// Work history from git: each commit is credited to the agent whose output
// file it touched (products/<slug>/03-content.md → content-writer, ...).
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);

const FILE_AGENT = [
  [/^products\/_ideas\//, 'market-researcher'],
  [/\/01-research\.md$/, 'market-researcher'],
  [/\/02b-creative-brief\.md$/, 'creative-director'],
  [/\/02-plan\.md$/, 'curriculum-designer'],
  [/\/03-content\.md$/, 'content-writer'],
  [/\/(worksheet\.html|design-notes\.md|thumbnails\.html)$|\/output\/|\/thumb-src\//, 'worksheet-designer'],
  [/\/05-qa-report\.md$/, 'quality-reviewer'],
  [/\/06-listing\.md$|\/listing-preview\//, 'tpt-listing-specialist'],
  [/\/07-marketing\.md$/, 'marketing-specialist'],
];

export function agentsForFile(file) {
  return FILE_AGENT.filter(([re]) => re.test(file)).map(([, a]) => a);
}

export async function loadHistory(root, limit = 60) {
  let stdout = '';
  try {
    ({ stdout } = await run('git', ['log', `-${limit}`, '--name-only', '--format=%x1e%h%x1f%cI%x1f%an%x1f%s'], { cwd: root, maxBuffer: 8 << 20 }));
  } catch {
    return { commits: [], branch: null };
  }
  const commits = [];
  for (const block of stdout.split('\x1e').slice(1)) {
    const [head, ...rest] = block.split('\n');
    const [hash, date, author, subject] = head.split('\x1f');
    const files = rest.map((l) => l.trim()).filter(Boolean);
    const agents = [...new Set(files.flatMap(agentsForFile))];
    const slug = files.map((f) => f.match(/^products\/([^/_][^/]*)\//)?.[1]).find(Boolean) ?? null;
    commits.push({ hash, date: new Date(date).toISOString(), author, subject, agents, slug, files: files.length });
  }
  let branch = null;
  try { branch = (await run('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: root })).stdout.trim(); } catch { /* detached */ }
  return { commits, branch };
}
