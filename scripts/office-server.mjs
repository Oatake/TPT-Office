#!/usr/bin/env node
// office-server.mjs — TPT-Office Live: หน้าจอดูสถานะทีม AI agent แบบสด
//
//   npm run office                    เปิด server ที่ http://127.0.0.1:4777
//   node scripts/office-server.mjs --port 5000 --host 0.0.0.0
//   node scripts/office-server.mjs --once        พิมพ์สถานะ (JSON) ครั้งเดียวแล้วจบ
//
// การเปิด server จะสร้างโฟลเดอร์ .office/ ให้อัตโนมัติ = เปิดการบันทึกของ hooks
// (ดู scripts/office-hook.mjs และ .claude/settings.json) ลบ .office/ = ปิดการบันทึก
// ไม่ต้องติดตั้งอะไรเพิ่ม ใช้แค่ Node built-in

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createLive, applyEvent, scanProducts, snapshot } from './office-state.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OFFICE_DIR = path.join(ROOT, '.office');
const EVENTS = path.join(OFFICE_DIR, 'events.jsonl');
const UI = path.join(ROOT, 'office-ui', 'index.html');
const MAX_REPLAY_BYTES = 5 * 1024 * 1024;

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const PORT = Number(opt('--port', process.env.OFFICE_PORT || 4777));
const HOST = opt('--host', process.env.OFFICE_HOST || '127.0.0.1');
const ONCE = args.includes('--once');

fs.mkdirSync(OFFICE_DIR, { recursive: true });

// ---------------------------------------------------------------- อ่าน events (ต่อท้ายทีละส่วน)
const live = createLive();
let offset = 0;
let partial = '';

function readNewEvents() {
  let size;
  try { size = fs.statSync(EVENTS).size; } catch { return false; }
  if (size < offset) { offset = 0; partial = ''; } // ไฟล์ถูกลบ/เริ่มใหม่
  if (size === offset) return false;
  let start = offset;
  if (offset === 0 && size > MAX_REPLAY_BYTES) start = size - MAX_REPLAY_BYTES;
  const fd = fs.openSync(EVENTS, 'r');
  const buf = Buffer.alloc(size - start);
  fs.readSync(fd, buf, 0, buf.length, start);
  fs.closeSync(fd);
  offset = size;
  let text = partial + buf.toString('utf8');
  if (start > 0) text = text.slice(text.indexOf('\n') + 1); // ตัดบรรทัดแรกที่อาจขาดครึ่ง
  const lines = text.split('\n');
  partial = lines.pop();
  for (const line of lines) {
    if (!line.trim()) continue;
    try { applyEvent(live, JSON.parse(line)); } catch { /* ข้ามบรรทัดเสีย */ }
  }
  return true;
}

// ---------------------------------------------------------------- git log (commit ล่าสุด)
let commits = [];
function refreshGit(done = () => {}) {
  execFile('git', ['log', '-n', '12', '--format=%h%x1f%cI%x1f%s'], { cwd: ROOT }, (err, out) => {
    if (!err) {
      commits = out.trim().split('\n').filter(Boolean).map((l) => {
        const [hash, date, subject] = l.split('\x1f');
        return { hash, date, subject };
      });
    }
    done();
  });
}

function currentState() {
  return snapshot(live, scanProducts(ROOT), Date.now(), {
    commits,
    recording: fs.existsSync(OFFICE_DIR),
    hasEvents: fs.existsSync(EVENTS),
  });
}

if (ONCE) {
  readNewEvents();
  refreshGit(() => console.log(JSON.stringify(currentState(), null, 2)));
} else {
  startServer();
}

// ---------------------------------------------------------------- HTTP + Server-Sent Events
function startServer() {
  const clients = new Set();
  let lastJson = '';

  function broadcast(force = false) {
    const st = currentState();
    // เทียบโดยไม่สนใจเวลา now (ไม่งั้นจะส่งทุกครั้ง)
    const key = JSON.stringify({ ...st, now: 0 });
    if (!force && key === lastJson) return;
    lastJson = key;
    const msg = `data: ${JSON.stringify(st)}\n\n`;
    for (const res of clients) res.write(msg);
  }

  readNewEvents();
  refreshGit();
  setInterval(() => { if (readNewEvents()) broadcast(); }, 700);
  setInterval(() => broadcast(), 3000);      // ไฟล์สินค้า + สถานะที่ขึ้นกับเวลา (เช่น เงียบนานผิดปกติ)
  setInterval(() => refreshGit(), 15000);
  setInterval(() => { for (const res of clients) res.write(': ping\n\n'); }, 25000);

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    if (url.pathname === '/' || url.pathname === '/index.html') {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
      return fs.createReadStream(UI).pipe(res);
    }
    if (url.pathname === '/api/state') {
      readNewEvents();
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
      return res.end(JSON.stringify(currentState()));
    }
    if (url.pathname === '/api/stream') {
      res.writeHead(200, {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-store',
        connection: 'keep-alive',
      });
      res.write(`retry: 2000\ndata: ${JSON.stringify(currentState())}\n\n`);
      clients.add(res);
      req.on('close', () => clients.delete(res));
      return;
    }
    if (url.pathname.startsWith('/files/')) return serveFile(url.pathname.slice('/files/'.length), res);
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('not found');
  });

  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') console.error(`พอร์ต ${PORT} ถูกใช้อยู่ ลองใหม่ด้วย: npm run office -- --port ${PORT + 1}`);
    else console.error(e.message);
    process.exit(1);
  });

  server.listen(PORT, HOST, () => {
    console.log(`🏢 TPT-Office Live เปิดแล้ว: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
    console.log(`   บันทึกเหตุการณ์ที่ ${path.relative(ROOT, EVENTS)} (ลบโฟลเดอร์ .office/ เพื่อปิดการบันทึก)`);
    console.log('   กด Ctrl+C เพื่อปิด');
  });
}

// เปิดดูไฟล์ในโฟลเดอร์สินค้า (อ่านอย่างเดียว เฉพาะ products/ และ templates/themes/previews/)
const TYPES = {
  '.md': 'text/plain; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.pdf': 'application/pdf',
  '.html': 'text/plain; charset=utf-8',
};
function serveFile(rel, res) {
  const decoded = decodeURIComponent(rel);
  const full = path.resolve(ROOT, decoded);
  const allowed = [path.join(ROOT, 'products') + path.sep, path.join(ROOT, 'templates', 'themes', 'previews') + path.sep];
  const type = TYPES[path.extname(full).toLowerCase()];
  if (!type || !allowed.some((a) => full.startsWith(a)) || !fs.existsSync(full) || !fs.statSync(full).isFile()) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    return res.end('not found');
  }
  res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' });
  fs.createReadStream(full).pipe(res);
}
