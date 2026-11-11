// office-state.mjs — "เลขา" ของ TPT-Office Live (ส่วนคิด ไม่มี I/O ของ server)
//
// รวมข้อมูล 2 แหล่งเป็นสถานะเดียว:
//   1) events จาก hooks (.office/events.jsonl)  → ใครกำลังทำอะไร "ตอนนี้"
//   2) ไฟล์ใน products/ + catalog.json            → สินค้าแต่ละชิ้นไปถึงขั้นไหน
// ใช้ได้ทั้งจาก office-server.mjs และจากการทดสอบ

import fs from 'node:fs';
import path from 'node:path';

export const STALL_MS = Number(process.env.OFFICE_STALL_MIN || 10) * 60_000;
const DONE_FLASH_MS = 3 * 60_000;
const ERROR_SHOW_MS = 60 * 60_000;
const TIMELINE_MAX = 120;

// ทีมประจำออฟฟิศ (ลำดับตาม pipeline ใน .claude/skills/new-tpt-product/SKILL.md)
export const ROLES = [
  { id: 'pm', th: 'ผู้จัดการโปรเจกต์', en: 'Project Manager', icon: '🧑‍💼' },
  { id: 'market-researcher', th: 'นักวิจัยตลาด', en: 'Market Researcher', icon: '🔍', stage: 'research' },
  { id: 'creative-director', th: 'ผู้กำกับฝ่ายสร้างสรรค์', en: 'Creative Director', icon: '🎨', stage: 'brief' },
  { id: 'curriculum-designer', th: 'นักออกแบบหลักสูตร', en: 'Curriculum Designer', icon: '📐', stage: 'plan' },
  { id: 'content-writer', th: 'นักเขียนเนื้อหา', en: 'Content Writer', icon: '✍️', stage: 'content' },
  { id: 'worksheet-designer', th: 'นักออกแบบใบงาน', en: 'Worksheet Designer', icon: '🖨️', stage: 'design' },
  { id: 'quality-reviewer', th: 'ผู้ตรวจคุณภาพ', en: 'Quality Reviewer', icon: '🔎', stage: 'qa' },
  { id: 'tpt-listing-specialist', th: 'หน้าร้าน & SEO', en: 'Listing & SEO', icon: '🏷️', stage: 'listing' },
  { id: 'marketing-specialist', th: 'การตลาด', en: 'Marketing', icon: '📣', stage: 'marketing' },
];
const ROLE_IDS = new Set(ROLES.map((r) => r.id));
const roleOf = (id) => ROLES.find((r) => r.id === id);

export const STAGES = [
  { id: 'research', th: 'วิจัยตลาด', file: '01-research.md' },
  { id: 'brief', th: 'Creative brief', file: '02b-creative-brief.md' },
  { id: 'plan', th: 'แผนหลักสูตร', file: '02-plan.md' },
  { id: 'content', th: 'เนื้อหา', file: '03-content.md' },
  { id: 'design', th: 'ออกแบบ PDF', file: 'output/<slug>.pdf' },
  { id: 'qa', th: 'QA + Appeal', file: '05-qa-report.md' },
  { id: 'listing', th: 'Listing', file: '06-listing.md' },
  { id: 'marketing', th: 'การตลาด', file: '07-marketing.md' },
];

const ACTIVE_STATUSES = new Set(['planning', 'in-progress']);

// ---------------------------------------------------------------- events → live state

export function createLive() {
  return {
    runs: new Map(),      // key: agent_id (หรือ "tu:<tool_use_id>" ก่อน SubagentStart) → run
    sessions: new Map(),  // session_id → { lastTs, state, message, ended }
    timeline: [],
    qaRounds: new Map(),  // slug → จำนวนครั้งที่เรียก quality-reviewer
  };
}

const ms = (ts) => Date.parse(ts) || 0;

function pushTimeline(live, ev, text, kind = 'info', role) {
  live.timeline.push({ ts: ev.ts, text, kind, role, slug: ev.slug });
  if (live.timeline.length > TIMELINE_MAX) live.timeline.splice(0, live.timeline.length - TIMELINE_MAX);
}

function session(live, ev) {
  let s = live.sessions.get(ev.session);
  if (!s) {
    s = { id: ev.session, lastTs: ev.ts, state: 'idle', message: '', ended: false, summary: '' };
    live.sessions.set(ev.session, s);
  }
  s.lastTs = ev.ts;
  return s;
}

const roleName = (id) => roleOf(id)?.th || id;
const isAgentTool = (t) => t === 'Agent' || t === 'Task';

export function applyEvent(live, ev) {
  if (!ev || !ev.event || !ev.ts) return;
  const s = ev.session ? session(live, ev) : null;
  const inSub = !!ev.agent_id;
  let run = inSub ? live.runs.get(ev.agent_id) : null;

  // event จากใน subagent ที่ไม่รู้จัก (เช่น server เริ่มกลางทาง) → สร้าง run ย้อนหลัง
  if (inSub && !run && ev.event !== 'SubagentStop') {
    run = newRun(live, ev.agent_id, ev.agent_type || 'unknown', ev);
  }

  switch (ev.event) {
    case 'SessionStart':
      if (s) { s.ended = false; s.state = 'idle'; }
      break;

    case 'UserPromptSubmit':
      if (/^<(agent-message|task-notification|system-reminder)/.test(ev.message || '')) ev = { ...ev, synthetic: true };
      if (s) {
        s.state = 'working'; s.message = ''; s.ended = false;
        s.summary = ev.synthetic ? 'อ่านรายงานจากทีม' : 'รับคำสั่งจากเจ้าของร้าน';
      }
      if (!ev.synthetic) pushTimeline(live, ev, `เจ้าของร้านสั่ง: ${ev.message || ''}`, 'owner', 'pm');
      break;

    case 'PreToolUse':
    case 'PostToolUse':
    case 'PostToolUseFailure': {
      if (run) {
        run.lastTs = ev.ts;
        if (ev.event === 'PreToolUse') { run.summary = ev.summary; run.tools += 1; }
        if (!run.slug && ev.slug) run.slug = ev.slug;
        if (ev.event === 'PostToolUseFailure') run.lastError = ev.error || ev.summary;
      } else if (s) {
        s.state = 'working';
        if (ev.event === 'PreToolUse') s.summary = ev.summary;
      }
      const who = run ? run.role : 'pm';

      if (isAgentTool(ev.tool) && ev.event === 'PreToolUse') {
        const key = 'tu:' + (ev.tool_use_id || ev.ts);
        const r = newRun(live, key, ev.subagent_type, ev);
        r.status = 'starting';
        r.description = ev.description;
        r.launchedBy = who;
        pushTimeline(live, ev, `${roleName(who)} ส่งงานให้ ${roleName(ev.subagent_type)}${ev.description ? `: ${ev.description}` : ''}`, 'handoff', ev.subagent_type);
        if (ev.subagent_type === 'quality-reviewer' && ev.slug) {
          live.qaRounds.set(ev.slug, (live.qaRounds.get(ev.slug) || 0) + 1);
        }
      }
      if (isAgentTool(ev.tool) && ev.event === 'PostToolUseFailure') {
        const r = live.runs.get('tu:' + ev.tool_use_id);
        if (r) { r.status = 'failed'; r.endTs = ev.ts; r.lastError = ev.error; }
        pushTimeline(live, ev, `เรียก ${roleName(ev.subagent_type)} ไม่สำเร็จ: ${ev.error || ''}`, 'error', ev.subagent_type);
      }
      // เขียนไฟล์ในโฟลเดอร์สินค้า = มีผลงานใหม่ ลง timeline
      if (ev.event === 'PostToolUse' && (ev.tool === 'Write' || ev.tool === 'Edit') && ev.slug) {
        pushTimeline(live, ev, `${roleName(who)} ${ev.tool === 'Write' ? 'เขียน' : 'แก้'} ${ev.summary.split(' ').slice(1).join(' ')}`, 'file', who);
      }
      if (ev.event === 'PostToolUseFailure' && !isAgentTool(ev.tool)) {
        pushTimeline(live, ev, `${roleName(who)}: ${ev.summary} ล้มเหลว`, 'warn', who);
      }
      break;
    }

    case 'SubagentStart': {
      // จับคู่กับคำสั่ง Agent ที่ยังรอเริ่ม (session เดียวกัน, ตำแหน่งเดียวกัน, เก่าสุดก่อน)
      let pending = null;
      for (const [k, r] of live.runs) {
        if (r.status === 'starting' && r.session === ev.session && r.role === ev.agent_type) { pending = [k, r]; break; }
      }
      let r;
      if (pending) {
        live.runs.delete(pending[0]);
        r = pending[1];
        r.key = ev.agent_id;
        live.runs.set(ev.agent_id, r);
      } else {
        r = live.runs.get(ev.agent_id) || newRun(live, ev.agent_id, ev.agent_type, ev);
      }
      r.status = 'running';
      r.startTs = r.startTs || ev.ts;
      r.lastTs = ev.ts;
      pushTimeline(live, { ...ev, slug: r.slug }, `${roleName(r.role)} เริ่มงาน${r.slug ? ` (${r.slug})` : ''}`, 'start', r.role);
      break;
    }

    case 'SubagentStop': {
      const r = live.runs.get(ev.agent_id);
      if (r) {
        r.status = 'done';
        r.endTs = ev.ts;
        r.lastTs = ev.ts;
        pushTimeline(live, { ...ev, slug: r.slug }, `${roleName(r.role)} ส่งงานเสร็จ${r.slug ? ` (${r.slug})` : ''}`, 'done', r.role);
      }
      break;
    }

    case 'Notification':
      if (s && !inSub) {
        s.state = 'waiting';
        s.message = ev.message || 'รอเจ้าของร้าน';
      }
      pushTimeline(live, ev, `แจ้งเตือน: ${ev.message || ''}`, 'wait', 'pm');
      break;

    case 'Stop':
      if (s && !inSub) { s.state = 'turn-ended'; s.message = ''; }
      break;

    case 'StopFailure':
      if (s) { s.state = 'error'; s.message = ev.error || 'Claude หยุดทำงานเพราะเกิดข้อผิดพลาด (เช่น rate limit)'; }
      pushTimeline(live, ev, `หยุดเพราะข้อผิดพลาด: ${ev.error || ''}`, 'error', 'pm');
      break;

    case 'SessionEnd':
      if (s) { s.ended = true; s.state = 'idle'; }
      for (const r of live.runs.values()) {
        if (r.session === ev.session && (r.status === 'running' || r.status === 'starting')) {
          r.status = 'interrupted';
          r.endTs = ev.ts;
        }
      }
      pushTimeline(live, ev, 'ปิด session', 'info', 'pm');
      break;
    default:
      break;
  }
}

function newRun(live, key, role, ev) {
  const r = {
    key, role: role || 'unknown', session: ev.session, slug: ev.slug,
    status: 'running', startTs: ev.ts, lastTs: ev.ts, endTs: null,
    summary: '', tools: 0, description: ev.description,
  };
  live.runs.set(key, r);
  // เก็บแค่ 200 run ล่าสุด
  if (live.runs.size > 200) live.runs.delete(live.runs.keys().next().value);
  return r;
}

// ---------------------------------------------------------------- products/ → pipeline state

function readText(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return null; }
}

// "**ผลการตรวจ:** **PASS WITH FIXES**" → "PASS WITH FIXES"
export function qaVerdict(md) {
  if (!md) return null;
  const m = md.match(/(?:ผลการตรวจ|Verdict|Result|Overall)\s*:?\s*\**\s*:?\s*\**\s*(PASS WITH FIXES|PASS|FAIL)/i);
  return m ? m[1].toUpperCase() : null;
}

// ส่วน "## Appeal Review" → "### ผล: **REVISE ..." → "REVISE"
export function appealVerdict(md) {
  if (!md) return null;
  const i = md.search(/^##\s+Appeal Review/im);
  if (i < 0) return null;
  const m = md.slice(i).match(/(?:ผล|Verdict|Result)\s*:?\s*\**\s*(PASS|REVISE|APPROVE[D]?)/i);
  return m ? m[1].toUpperCase().replace('APPROVED', 'APPROVE') : null;
}

export function scanProducts(root) {
  const prodDir = path.join(root, 'products');
  let catalog = [];
  try { catalog = JSON.parse(readText(path.join(prodDir, 'catalog.json')) || '{}').products || []; } catch { /* broken JSON while an agent edits it */ }
  const bySlug = new Map(catalog.map((p) => [p.slug, p]));
  let dirs = [];
  try {
    dirs = fs.readdirSync(prodDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith('_') && !d.name.startsWith('.'))
      .map((d) => d.name);
  } catch { /* no products dir */ }
  const slugs = [...new Set([...catalog.map((p) => p.slug), ...dirs])];

  return slugs.map((slug) => {
    const c = bySlug.get(slug) || {};
    const dir = path.join(prodDir, slug);
    const has = (f) => fs.existsSync(path.join(dir, f.replace('<slug>', slug)));
    const qaMd = readText(path.join(dir, '05-qa-report.md'));
    const briefMd = readText(path.join(dir, '02b-creative-brief.md'));
    const stages = STAGES.map((st) => ({ id: st.id, done: has(st.file) }));
    const qa = qaVerdict(qaMd);
    const appeal = appealVerdict(briefMd);
    const status = c.status || (fs.existsSync(dir) ? 'planning' : 'unknown');
    const fixed = !!qaMd && /^##\s+Fix Log/im.test(qaMd);
    const rework = ACTIVE_STATUSES.has(status) && (qa === 'FAIL' || (appeal === 'REVISE' && !fixed));
    let mtime = 0;
    try {
      for (const f of fs.readdirSync(dir)) {
        const t = fs.statSync(path.join(dir, f)).mtimeMs;
        if (t > mtime) mtime = t;
      }
    } catch { /* folder not created yet */ }
    return {
      slug, status, title: c.title || slug, date: c.date || null,
      subject: c.subject, grades: c.grades, theme: c.theme, concept: c.concept,
      hero: c.hero_activity, price: c.price,
      stages, qa, appeal, fixed, rework,
      thumbnail: has('output/thumbnails/thumbnail-1.png') ? `products/${slug}/output/thumbnails/thumbnail-1.png` : null,
      updated: mtime ? new Date(mtime).toISOString() : null,
    };
  });
}

// ---------------------------------------------------------------- snapshot สำหรับหน้าจอ

export function snapshot(live, products, now = Date.now(), extra = {}) {
  const runs = [...live.runs.values()];
  const active = (r) => r.status === 'running' || r.status === 'starting';
  const productBySlug = new Map(products.map((p) => [p.slug, p]));

  const agentCard = (role, list) => {
    const running = list.filter(active).sort((a, b) => ms(b.lastTs) - ms(a.lastTs));
    const latest = [...list].sort((a, b) => ms(b.lastTs) - ms(a.lastTs))[0];
    let state = 'idle', run = latest, note = '';
    if (running.length) {
      run = running[0];
      const quiet = now - ms(run.lastTs);
      state = quiet > STALL_MS ? 'stalled' : 'working';
      if (state === 'stalled') note = `ไม่มีความเคลื่อนไหว ${Math.round(quiet / 60000)} นาที`;
    } else if (latest) {
      const since = now - ms(latest.endTs || latest.lastTs);
      if ((latest.status === 'failed' || latest.status === 'interrupted') && since < ERROR_SHOW_MS) {
        state = 'error';
        note = latest.status === 'interrupted' ? 'session ปิดก่อนงานเสร็จ' : (latest.lastError || 'เรียกไม่สำเร็จ');
      } else if (latest.status === 'done' && since < DONE_FLASH_MS) state = 'done';
    }
    const slug = run?.slug;
    const p = slug && productBySlug.get(slug);
    if (p?.rework && (role.id === 'content-writer' || role.id === 'worksheet-designer') && state === 'idle') {
      state = 'rework';
      note = `งานถูกส่งกลับให้แก้ (${p.qa === 'FAIL' ? 'QA FAIL' : 'Appeal REVISE'})`;
    }
    return {
      ...role, state, note,
      slug: slug || null,
      summary: run?.summary || run?.description || '',
      since: run ? (active(run) ? run.startTs : (run.endTs || run.lastTs)) : null,
      lastTs: run?.lastTs || null,
      tools: run?.tools || 0,
      parallel: running.length,
      jobs: list.length,
      qaRound: role.id === 'quality-reviewer' && slug ? live.qaRounds.get(slug) || 0 : undefined,
    };
  };

  // PM = main thread ของ session ล่าสุดที่ยังเปิดอยู่
  const sessions = [...live.sessions.values()].sort((a, b) => ms(b.lastTs) - ms(a.lastTs));
  const s = sessions.find((x) => !x.ended) || sessions[0];
  const pmRole = roleOf('pm');
  const teamBusy = runs.some((r) => active(r) && r.role !== 'pm');
  const pipelineOpen = products.some((p) => ACTIVE_STATUSES.has(p.status));
  let pm = { ...pmRole, state: 'idle', note: '', summary: '', since: null, lastTs: null, slug: null };
  if (s && !s.ended) {
    const quiet = now - ms(s.lastTs);
    pm.lastTs = s.lastTs;
    pm.since = s.lastTs;
    pm.summary = s.summary;
    if (s.state === 'error') { pm.state = 'error'; pm.note = s.message; }
    else if (s.state === 'waiting') { pm.state = 'waiting'; pm.note = s.message; }
    else if (teamBusy) { pm.state = 'supervising'; pm.note = 'รอทีมส่งงาน'; }
    else if (s.state === 'working') {
      pm.state = quiet > STALL_MS ? 'stalled' : 'working';
      if (pm.state === 'stalled') pm.note = `ไม่มีความเคลื่อนไหว ${Math.round(quiet / 60000)} นาที`;
    } else if (s.state === 'turn-ended' && pipelineOpen) {
      pm.state = 'waiting';
      pm.note = 'จบรอบแล้ว รอเจ้าของร้านตอบ/สั่งงานต่อ';
    }
  }

  const team = [pm, ...ROLES.slice(1).map((role) => agentCard(role, runs.filter((r) => r.role === role.id)))];

  // ผู้ช่วยนอกทีม (Explore, general-purpose ฯลฯ)
  const guests = runs
    .filter((r) => !ROLE_IDS.has(r.role))
    .sort((a, b) => ms(b.lastTs) - ms(a.lastTs))
    .slice(0, 8)
    .map((r) => ({
      role: r.role, slug: r.slug, summary: r.summary || r.description || '',
      state: active(r) ? (now - ms(r.lastTs) > STALL_MS ? 'stalled' : 'working') : r.status === 'done' ? 'done' : 'error',
      since: r.startTs, lastTs: r.lastTs,
    }));

  // ขั้นที่กำลังทำ (มีคนทำงานอยู่กับสินค้าชิ้นนั้น)
  const prods = products.map((p) => {
    const activeStages = new Set();
    for (const r of runs) if (active(r) && r.slug === p.slug && roleOf(r.role)?.stage) activeStages.add(roleOf(r.role).stage);
    return {
      ...p,
      qaRounds: live.qaRounds.get(p.slug) || 0,
      stages: p.stages.map((st) => ({ ...st, active: activeStages.has(st.id) })),
    };
  }).sort((a, b) => {
    const rank = (x) => (ACTIVE_STATUSES.has(x.status) ? 0 : 1);
    return rank(a) - rank(b) || String(b.date || '').localeCompare(String(a.date || ''));
  });

  return {
    now: new Date(now).toISOString(),
    stallMinutes: STALL_MS / 60000,
    team,
    guests,
    products: prods,
    timeline: live.timeline.slice(-60).reverse(),
    ...extra,
  };
}
