// Live activity from Claude Code transcripts (~/.claude/projects/<project>/).
//
// Claude Code writes every session as JSONL. When the Project Manager (the
// main session running /new-tpt-product) hands work to an agent it calls the
// Agent tool with `subagent_type`; the call stays open until the agent
// finishes. The agent's own transcript (a separate JSONL file) shows which
// tool it is using right now. Files are read incrementally and cached, so
// polling every few seconds is cheap.
import { open, readdir, stat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export const WINDOW_MS = 12 * 60 * 60 * 1000; // sessions touched in the last 12 h
export const STALE_MS = 15 * 60 * 1000; // an open Agent call with no writes for 15 min = stalled
const SUBAGENT_FRESH_MS = 60 * 1000; // background agents: transcript written in the last minute
const PM_FRESH_MS = 2 * 60 * 1000;

export function transcriptDirFor(root) {
  return path.join(os.homedir(), '.claude', 'projects', path.resolve(root).replace(/[^a-zA-Z0-9]/g, '-'));
}

export function activityKind(tool) {
  if (/^(Write|Edit|MultiEdit|NotebookEdit)$/.test(tool)) return 'typing';
  if (/^(Read|Grep|Glob|LS)$/.test(tool)) return 'reading';
  if (/^(WebSearch|WebFetch)$/.test(tool) || /web-?fetch|search/i.test(tool)) return 'searching';
  if (tool === 'Bash') return 'running';
  if (tool === 'Agent' || tool === 'Task') return 'delegating';
  if (tool === 'AskUserQuestion') return 'asking';
  return 'thinking';
}

const clip = (s, n = 70) => {
  const t = String(s ?? '').replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
};

export function toolDetail(name, input = {}) {
  const base = (p) => (p ? String(p).split('/').slice(-2).join('/') : '');
  switch (name) {
    case 'Read': case 'Write': case 'Edit': case 'MultiEdit': case 'NotebookEdit':
      return base(input.file_path ?? input.notebook_path);
    case 'Grep': case 'Glob': return clip(input.pattern, 50);
    case 'WebSearch': return clip(input.query, 60);
    case 'WebFetch': try { return new URL(input.url).host; } catch { return clip(input.url, 50); }
    case 'Bash': return clip(input.description || input.command, 60);
    case 'Agent': case 'Task': return clip(input.description || input.subagent_type, 60);
    default: return clip(input.description ?? '', 60);
  }
}

function userText(message) {
  const c = message?.content;
  if (typeof c === 'string') return c;
  if (Array.isArray(c)) return c.filter((x) => x?.type === 'text').map((x) => x.text).join('\n');
  return '';
}

function newParse() {
  return { tools: new Map(), firstPrompt: null, lastTs: null, last: null, sessionId: null };
}

function applyEntry(st, e) {
  const ts = e.timestamp ?? null;
  if (ts) st.lastTs = ts;
  if (e.sessionId) st.sessionId ??= e.sessionId;
  const msg = e.message;
  if (e.type === 'user' && msg) {
    const text = userText(msg);
    if (text && st.firstPrompt === null && !e.isMeta) st.firstPrompt = text;
    if (Array.isArray(msg.content)) {
      for (const c of msg.content) {
        if (c?.type !== 'tool_result') continue;
        const t = st.tools.get(c.tool_use_id);
        if (t) { t.resultTs = ts; t.isError = Boolean(c.is_error); }
      }
    }
    const isToolResult = Array.isArray(msg.content) && msg.content.some((c) => c?.type === 'tool_result');
    st.last = { kind: isToolResult ? 'tool_result' : 'user', ts };
  } else if (e.type === 'assistant' && Array.isArray(msg?.content)) {
    let hasTool = false;
    for (const c of msg.content) {
      if (c?.type !== 'tool_use') continue;
      hasTool = true;
      st.tools.set(c.id, { id: c.id, name: c.name, input: c.input ?? {}, ts, resultTs: null, isError: false });
    }
    if (hasTool || msg.content.some((c) => c?.type === 'text' && c.text?.trim())) {
      st.last = { kind: hasTool ? 'tool_use' : 'text', ts };
    }
  }
}

// path → { size, offset, rest: Buffer, parse }
const cache = new Map();

async function readTranscript(file) {
  const s = await stat(file);
  let c = cache.get(file);
  if (!c || s.size < c.offset) {
    c = { offset: 0, rest: Buffer.alloc(0), parse: newParse() };
    cache.set(file, c);
  }
  if (s.size > c.offset) {
    const fh = await open(file, 'r');
    try {
      const buf = Buffer.alloc(s.size - c.offset);
      await fh.read(buf, 0, buf.length, c.offset);
      c.offset = s.size;
      const data = Buffer.concat([c.rest, buf]);
      const cut = data.lastIndexOf(0x0a);
      const complete = cut < 0 ? Buffer.alloc(0) : data.subarray(0, cut);
      c.rest = Buffer.from(cut < 0 ? data : data.subarray(cut + 1));
      for (const line of complete.toString('utf8').split('\n')) {
        if (!line.trim()) continue;
        try { applyEntry(c.parse, JSON.parse(line)); } catch { /* partial or foreign line */ }
      }
    } finally {
      await fh.close();
    }
  }
  return { file, mtime: s.mtime.getTime(), parse: c.parse };
}

async function safeList(dir) {
  try { return await readdir(dir, { withFileTypes: true }); } catch { return []; }
}

function samePrompt(a, b) {
  if (!a || !b) return false;
  const x = a.trim(); const y = b.trim();
  return x === y || x.startsWith(y.slice(0, 300)) || y.startsWith(x.slice(0, 300));
}

function currentActivity(parse) {
  const tools = [...parse.tools.values()];
  const pending = tools.filter((t) => !t.resultTs).at(-1);
  const t = pending ?? tools.at(-1);
  if (!t) return null;
  return { tool: t.name, kind: activityKind(t.name), detail: toolDetail(t.name, t.input), at: t.ts, pending: !t.resultTs };
}

const slugIn = (text) => text?.match(/products\/([a-z0-9][a-z0-9-]*)/)?.[1] ?? null;

export async function loadLive(root, { dir = transcriptDirFor(root), now = Date.now() } = {}) {
  const top = await safeList(dir);
  if (!top.length) return { available: false, dir, sessions: [], agents: {}, pm: null, events: [] };

  const recent = async (f) => {
    try { const s = await stat(f); return now - s.mtime.getTime() < WINDOW_MS ? f : null; } catch { return null; }
  };
  const mainFiles = (await Promise.all(top.filter((d) => d.isFile() && d.name.endsWith('.jsonl') && !d.name.startsWith('agent-')).map((d) => recent(path.join(dir, d.name))))).filter(Boolean);
  const subFiles = [];
  for (const d of top) {
    if (d.isFile() && d.name.startsWith('agent-') && d.name.endsWith('.jsonl')) subFiles.push(path.join(dir, d.name));
    if (d.isDirectory()) {
      const sd = path.join(dir, d.name, 'subagents');
      for (const f of await safeList(sd)) if (f.isFile() && f.name.endsWith('.jsonl')) subFiles.push(path.join(sd, f.name));
    }
  }
  const sessions = await Promise.all(mainFiles.map(readTranscript));
  const subs = (await Promise.all((await Promise.all(subFiles.map(recent))).filter(Boolean).map(readTranscript)));

  const agents = {};
  const events = [];
  for (const s of sessions) {
    for (const t of s.parse.tools.values()) {
      if ((t.name !== 'Agent' && t.name !== 'Task') || !t.input.subagent_type) continue;
      const name = t.input.subagent_type;
      const sub = subs.find((x) => samePrompt(x.parse.firstPrompt, t.input.prompt));
      const lastWrite = Math.max(s.mtime, sub?.mtime ?? 0);
      let state = 'done';
      if (!t.resultTs) state = now - lastWrite < STALE_MS ? 'working' : 'stalled';
      else if (sub && now - sub.mtime < SUBAGENT_FRESH_MS && sub.parse.last?.kind !== 'text') state = 'working';
      const run = {
        state,
        task: t.input.description ?? '',
        slug: slugIn(t.input.prompt) ?? slugIn(t.input.description),
        startedAt: t.ts,
        endedAt: state === 'done' ? (t.resultTs ?? (sub?.parse.lastTs ?? null)) : null,
        error: t.isError,
        background: Boolean(t.input.run_in_background),
        session: s.parse.sessionId,
        activity: sub ? currentActivity(sub.parse) : null,
        toolCount: sub ? sub.parse.tools.size : 0,
      };
      const prev = agents[name];
      // Prefer a running call; otherwise keep the latest one.
      if (!prev || (run.state === 'working' && prev.state !== 'working') || (prev.state !== 'working' && (run.startedAt ?? '') > (prev.startedAt ?? ''))) {
        agents[name] = run;
      }
      events.push({ ts: t.ts, agent: name, kind: 'start', text: run.task, slug: run.slug });
      if (t.resultTs) events.push({ ts: t.resultTs, agent: name, kind: t.isError ? 'error' : 'finish', text: run.task, slug: run.slug });
    }
  }

  let pm = null;
  const main = [...sessions].sort((a, b) => b.mtime - a.mtime)[0];
  if (main) {
    const act = currentActivity(main.parse);
    const fresh = now - main.mtime < PM_FRESH_MS;
    let state = 'idle';
    if (fresh) state = main.parse.last?.kind === 'text' ? 'waiting' : 'working';
    // While an agent works the main transcript can stay quiet for a long time.
    const busy = Object.values(agents).filter((a) => a.state === 'working');
    let activity = act;
    if (busy.length && state !== 'working') {
      state = 'working';
      activity = { tool: 'Agent', kind: 'delegating', detail: busy.map((a) => a.task).join(', '), at: busy[0].startedAt, pending: true };
    }
    pm = { state, activity, session: main.parse.sessionId, lastAt: main.parse.lastTs, firstPrompt: clip(main.parse.firstPrompt, 90) };
  }

  events.sort((a, b) => (b.ts ?? '').localeCompare(a.ts ?? ''));
  return {
    available: true,
    dir,
    sessions: sessions.map((s) => ({ id: s.parse.sessionId, lastAt: s.parse.lastTs, active: now - s.mtime < PM_FRESH_MS })),
    agents,
    pm,
    events: events.slice(0, 40),
  };
}
