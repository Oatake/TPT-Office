// Builds the whole office state the UI renders: team + what each member is
// doing, product pipeline, and a merged activity feed.
import path from 'node:path';
import { loadTeam } from './team.mjs';
import { loadPipeline } from './pipeline.mjs';
import { loadHistory } from './history.mjs';
import { loadLive } from './live.mjs';

const ACTIVITY_TH = {
  typing: 'กำลังเขียน', reading: 'กำลังอ่าน', searching: 'กำลังค้นเว็บ', running: 'กำลังรันคำสั่ง',
  delegating: 'กำลังส่งงาน', asking: 'กำลังถามเจ้าของร้าน', thinking: 'กำลังคิด',
};

function memberStatus(member, { pipeline, history, live }) {
  const stagesDone = [];
  const queue = [];
  for (const p of pipeline.products) {
    for (const s of p.stages) {
      if (s.agent !== member.name) continue;
      if (s.done) stagesDone.push({ slug: p.slug, stage: s.id, label: s.label, verdict: s.verdict ?? null, mtime: s.mtime });
      else if (s.next) queue.push({ slug: p.slug, stage: s.id, label: s.label, title: p.title });
    }
  }
  const commits = history.commits.filter((c) => c.agents.includes(member.name));
  const lastCommit = commits[0] ?? null;

  if (member.isPM) {
    const pm = live?.pm;
    const active = pipeline.products.filter((p) => p.nextStage);
    if (pm && pm.state !== 'idle') {
      const a = pm.activity;
      return {
        state: pm.state,
        headline: pm.state === 'waiting' ? 'รอคำตอบจากเจ้าของร้าน' : `${ACTIVITY_TH[a?.kind] ?? 'กำลังทำงาน'}${a?.detail ? `: ${a.detail}` : ''}`,
        activity: a, live: true, queue: active.map((p) => ({ slug: p.slug, stage: p.nextStage, title: p.title })),
        doneCount: history.commits.length, lastCommit: history.commits[0] ?? null,
      };
    }
    return {
      state: active.length ? 'next' : 'idle',
      headline: active.length ? `มีสินค้าค้างอยู่ ${active.length} ชิ้น — สั่งงานต่อได้` : 'ว่าง — พร้อมรับสินค้าชิ้นใหม่',
      activity: null, live: false, queue: active.map((p) => ({ slug: p.slug, stage: p.nextStage, title: p.title })),
      doneCount: history.commits.length, lastCommit: history.commits[0] ?? null,
    };
  }

  const run = live?.agents?.[member.name];
  const base = { queue, done: stagesDone, doneCount: stagesDone.length, lastCommit, lastRun: run ?? null };
  if (run?.state === 'working') {
    const a = run.activity;
    return {
      ...base, state: 'working', live: true, activity: a, task: { slug: run.slug, text: run.task },
      headline: a ? `${ACTIVITY_TH[a.kind] ?? 'กำลังทำงาน'}${a.detail ? `: ${a.detail}` : ''}` : `กำลังทำ: ${run.task}`,
    };
  }
  if (run?.state === 'stalled') {
    return { ...base, state: 'stalled', live: true, activity: run.activity, task: { slug: run.slug, text: run.task }, headline: `งานค้าง (ไม่มีความเคลื่อนไหว): ${run.task}` };
  }
  if (queue.length) {
    return { ...base, state: 'next', live: false, activity: null, task: queue[0], headline: `ถึงคิว: ${queue[0].label} — ${queue[0].slug}` };
  }
  // A finished Agent call newer than the last commit is the better "last job".
  if (run?.state === 'done' && (!lastCommit || new Date(run.endedAt ?? 0) > new Date(lastCommit.date))) {
    return { ...base, state: 'idle', live: false, activity: null, headline: `ว่าง — เพิ่งส่งงาน: ${run.task}` };
  }
  return {
    ...base, state: 'idle', live: false, activity: null,
    headline: lastCommit ? `ว่าง — งานล่าสุด: ${lastCommit.subject}` : 'ว่าง — ยังไม่มีผลงาน',
  };
}

export async function buildState(root, opts = {}) {
  const [team, pipeline, history, live] = await Promise.all([
    loadTeam(root),
    loadPipeline(root),
    loadHistory(root),
    opts.live === false ? null : loadLive(root, { dir: opts.transcripts }),
  ]);
  const ctx = { pipeline, history, live };
  const members = team.map((m) => ({ ...m, status: memberStatus(m, ctx) }));

  const feed = [
    ...(live?.events ?? []).map((e) => ({ ...e, source: 'live' })),
    ...history.commits.map((c) => ({ ts: c.date, agent: c.agents[0] ?? 'project-manager', agents: c.agents, kind: 'commit', text: c.subject, slug: c.slug, hash: c.hash, source: 'git' })),
  ].sort((a, b) => (b.ts ?? '').localeCompare(a.ts ?? '')).slice(0, 50);

  const byStatus = {};
  for (const p of pipeline.products) byStatus[p.status] = (byStatus[p.status] ?? 0) + 1;

  return {
    generatedAt: new Date().toISOString(),
    repo: path.basename(root),
    branch: history.branch,
    live: live ? { available: live.available, sessions: live.sessions, dir: live.dir, demo: Boolean(opts.demo) } : { available: false, disabled: true },
    summary: {
      products: pipeline.products.length,
      byStatus,
      working: members.filter((m) => m.status.state === 'working').length,
      waiting: members.filter((m) => m.status.state === 'next').length,
    },
    members,
    products: pipeline.products,
    ideas: pipeline.ideas,
    feed,
  };
}
