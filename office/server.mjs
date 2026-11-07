#!/usr/bin/env node
// TPT Office — pixel office dashboard for the AI agent team.
//
// Usage:
//   node office/server.mjs                 # http://127.0.0.1:4173
//   node office/server.mjs --port 8080 --open
//   node office/server.mjs --once          # print the state as JSON and exit
//   node office/server.mjs --transcripts <dir>   # read Claude Code transcripts from another folder
//   node office/server.mjs --no-live       # repo files + git only
//   node office/server.mjs --demo          # simulated agents walk through the pipeline
//
// No dependencies: Node's http module, Server-Sent Events for live updates.
import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { execFile, spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildState } from './lib/state.mjs';
import { startDemo } from './lib/demo.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const publicDir = path.join(here, 'public');

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : fallback;
};
const PORT = Number(opt('port', process.env.PORT ?? 4173));
const HOST = opt('host', '127.0.0.1');
const POLL_MS = Number(opt('poll', 2000));
const stateOpts = {
  live: !flag('no-live'),
  transcripts: opt('transcripts', process.env.TPT_OFFICE_TRANSCRIPTS) ?? undefined,
};

if (flag('demo')) {
  const demo = await startDemo();
  stateOpts.transcripts = demo.dir;
  stateOpts.demo = true;
  stateOpts.live = true;
}

if (flag('once')) {
  console.log(JSON.stringify(await buildState(root, stateOpts), null, 2));
  process.exit(0);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.md': 'text/plain; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.pdf': 'application/pdf', '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};
// Repo folders the dashboard may show (read-only): product outputs and what
// their HTML pulls in (themes, brand fonts/clip art).
const REPO_ALLOW = ['products/', 'templates/', 'brand/assets/'];

async function sendFile(res, file) {
  const s = await stat(file).catch(() => null);
  if (!s?.isFile()) return notFound(res);
  res.writeHead(200, {
    'content-type': TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream',
    'content-length': s.size,
    'cache-control': 'no-cache',
  });
  createReadStream(file).pipe(res);
}

function notFound(res) {
  res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
  res.end('Not found');
}

function json(res, body, code = 200) {
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
}

// --- live state + Server-Sent Events -------------------------------------
let current = null;
let currentJson = '';
const clients = new Set();

async function refresh() {
  try {
    const s = await buildState(root, stateOpts);
    const { generatedAt, ...rest } = s;
    const key = JSON.stringify(rest);
    current = s;
    if (key !== currentJson) {
      currentJson = key;
      const msg = `event: state\ndata: ${JSON.stringify(s)}\n\n`;
      for (const c of clients) c.write(msg);
    }
  } catch (err) {
    console.error('[office] state error:', err.message);
  }
}

let timer = null;
async function loop() {
  await refresh();
  timer = setTimeout(loop, POLL_MS);
}

function runVarietyReport(n) {
  return new Promise((resolve) => {
    execFile(process.execPath, [path.join(root, 'scripts', 'variety-report.mjs'), String(n)], { cwd: root, timeout: 20000 }, (err, stdout, stderr) => {
      resolve({ ok: !err, output: stdout || stderr || String(err?.message ?? '') });
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);
  const p = decodeURIComponent(url.pathname);
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, { error: 'read-only' }, 405);

    if (p === '/api/state') return json(res, current ?? await buildState(root, stateOpts));
    if (p === '/api/events') {
      res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-store', connection: 'keep-alive' });
      res.write(`retry: 3000\n\n`);
      if (current) res.write(`event: state\ndata: ${JSON.stringify(current)}\n\n`);
      clients.add(res);
      const ping = setInterval(() => res.write(': ping\n\n'), 25000);
      req.on('close', () => { clearInterval(ping); clients.delete(res); });
      return;
    }
    if (p === '/api/variety') {
      const n = Math.min(Math.max(Number(url.searchParams.get('n')) || 10, 1), 100);
      return json(res, await runVarietyReport(n));
    }
    if (p.startsWith('/repo/')) {
      const rel = path.posix.normalize(p.slice('/repo/'.length));
      if (rel.startsWith('..') || !REPO_ALLOW.some((a) => rel.startsWith(a))) return notFound(res);
      const file = path.join(root, rel);
      if (!file.startsWith(root + path.sep)) return notFound(res);
      return sendFile(res, file);
    }
    const rel = p === '/' ? 'index.html' : path.posix.normalize(p.slice(1));
    const file = path.join(publicDir, rel);
    if (!file.startsWith(publicDir + path.sep)) return notFound(res);
    return sendFile(res, file);
  } catch (err) {
    console.error('[office]', err);
    if (!res.headersSent) json(res, { error: 'internal error' }, 500);
  }
});

server.listen(PORT, HOST, () => {
  const where = `http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`;
  console.log(`TPT Office is open → ${where}`);
  console.log(stateOpts.demo ? 'Demo mode: simulated agents (no real Claude Code session)' : stateOpts.live ? 'Live agent status: reading Claude Code transcripts' : 'Live agent status: off (--no-live)');
  if (flag('open')) {
    const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    spawn(cmd, [where], { stdio: 'ignore', detached: true, shell: process.platform === 'win32' }).on('error', () => {}).unref();
  }
  loop();
});

const shutdown = () => { clearTimeout(timer); for (const c of clients) c.end(); server.close(() => process.exit(0)); };
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
