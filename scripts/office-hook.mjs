#!/usr/bin/env node
// office-hook.mjs — "ยามหน้าห้อง" ของ TPT-Office Live
//
// Claude Code เรียกสคริปต์นี้ทุกครั้งที่เกิด hook event (ตั้งค่าใน .claude/settings.json)
// หน้าที่: อ่าน JSON จาก stdin → ย่อเหลือเฉพาะที่ต้องใช้ → ต่อท้ายลง .office/events.jsonl
//
// กติกาสำคัญ:
//  - ทำงานเฉพาะเมื่อมีโฟลเดอร์ .office/ (สร้างอัตโนมัติเมื่อรัน `npm run office`)
//    ลบ .office/ ทิ้ง = ปิดการบันทึก
//  - ห้ามทำให้ Claude Code สะดุด: จับ error ทุกอย่างและ exit 0 เสมอ ไม่พิมพ์อะไรออก stdout
//  - ถ้ามีไฟล์ .office/debug จะเก็บ input ดิบลง .office/raw.jsonl ด้วย (ใช้ตรวจ field ใน Phase 0)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OFFICE_DIR = path.join(ROOT, '.office');
const MAX_TEXT = 160;

export function clip(s, n = MAX_TEXT) {
  if (typeof s !== 'string') return undefined;
  const one = s.replace(/\s+/g, ' ').trim();
  return one.length > n ? one.slice(0, n - 1) + '…' : one;
}

// หา slug สินค้าจากข้อความ เช่น "Product: 2nd-grade-x" หรือ path "products/2nd-grade-x/..."
export function findSlug(...texts) {
  for (const t of texts) {
    if (typeof t !== 'string') continue;
    const tag = t.match(/^\s*Product:\s*([a-z0-9][a-z0-9-]*)\s*$/im);
    if (tag) return tag[1];
    for (const m of t.matchAll(/products\/([a-z0-9][a-z0-9-]*)(?=\/|\b)/g)) {
      if (m[1] !== 'catalog') return m[1];
    }
  }
  return undefined;
}

// สรุป tool call ให้อ่านง่าย เช่น "Write 03-content.md", "WebSearch: 2nd grade…"
export function toolSummary(tool, input = {}) {
  const base = (p) => (typeof p === 'string' ? p.split('/').slice(-2).join('/') : '');
  switch (tool) {
    case 'Read': case 'Write': case 'Edit': case 'NotebookEdit':
      return `${tool} ${base(input.file_path || input.notebook_path)}`;
    case 'Glob': case 'Grep':
      return `${tool} ${clip(input.pattern, 60) || ''}`;
    case 'Bash':
      return `Bash: ${clip(input.description || input.command, 80) || ''}`;
    case 'WebSearch':
      return `WebSearch: ${clip(input.query, 80) || ''}`;
    case 'WebFetch':
      return `WebFetch: ${clip(input.url, 80) || ''}`;
    case 'Agent': case 'Task':
      return `${tool} → ${input.subagent_type || 'agent'}: ${clip(input.description, 60) || ''}`;
    case 'Skill':
      return `Skill /${input.skill || input.command || ''}`;
    case 'SubagentHandback': case 'SendMessage':
      return 'ส่งรายงานกลับ';
    case 'AskUserQuestion':
      return 'ถามเจ้าของร้าน';
    default:
      return tool;
  }
}

export function normalize(h) {
  const ev = {
    ts: new Date().toISOString(),
    event: h.hook_event_name,
    session: h.session_id,
  };
  if (h.agent_id) ev.agent_id = h.agent_id;
  if (h.agent_type) ev.agent_type = h.agent_type;

  const input = h.tool_input && typeof h.tool_input === 'object' ? h.tool_input : {};
  if (h.tool_name) {
    ev.tool = h.tool_name;
    if (h.tool_use_id) ev.tool_use_id = h.tool_use_id;
    ev.summary = toolSummary(h.tool_name, input);
    if (h.tool_name === 'Agent' || h.tool_name === 'Task') {
      ev.subagent_type = input.subagent_type || 'general-purpose';
      ev.description = clip(input.description, 80);
      if (input.run_in_background !== undefined) ev.background = !!input.run_in_background;
    }
    if (h.tool_name === 'Skill') ev.skill = input.skill || input.command;
    ev.slug = findSlug(input.prompt, input.description, input.file_path, input.path,
      input.command, input.notebook_path, input.args);
  }
  if (h.hook_event_name === 'PostToolUseFailure') ev.error = clip(h.error, 120);
  if (h.hook_event_name === 'Notification') {
    ev.message = clip(h.message, 120);
    if (h.notification_type) ev.notification_type = h.notification_type;
  }
  if (h.hook_event_name === 'UserPromptSubmit') {
    ev.message = clip(h.prompt, 120);
    ev.slug = findSlug(h.prompt);
    // รายงานจาก agent / การแจ้งเตือนของระบบ ถูกส่งเข้ามาเป็น "prompt" ด้วย — ไม่ใช่เจ้าของร้านพิมพ์
    if (typeof h.prompt === 'string' && /^\s*<(agent-message|task-notification|system-reminder)\b/.test(h.prompt)) {
      ev.synthetic = true;
      ev.message = /^\s*<agent-message/.test(h.prompt) ? 'รายงานจาก agent ที่ส่งงานเสร็จ' : 'การแจ้งเตือนจากระบบ';
    }
    const skill = typeof h.prompt === 'string' && h.prompt.match(/^\s*\/([a-z0-9-:]+)/i);
    if (skill) ev.skill = skill[1];
  }
  if (h.hook_event_name === 'StopFailure') ev.error = clip(h.error || h.reason || h.message, 120);
  if (h.hook_event_name === 'SessionEnd') ev.reason = h.reason;
  for (const k of Object.keys(ev)) if (ev[k] === undefined) delete ev[k];
  return ev;
}

function main() {
  if (!fs.existsSync(OFFICE_DIR)) return;
  let raw = '';
  try { raw = fs.readFileSync(0, 'utf8'); } catch { return; }
  if (!raw.trim()) return;
  let h;
  try { h = JSON.parse(raw); } catch { return; }
  if (fs.existsSync(path.join(OFFICE_DIR, 'debug'))) {
    fs.appendFileSync(path.join(OFFICE_DIR, 'raw.jsonl'), JSON.stringify(h) + '\n');
  }
  fs.appendFileSync(path.join(OFFICE_DIR, 'events.jsonl'), JSON.stringify(normalize(h)) + '\n');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch { /* never break Claude Code */ }
  process.exit(0);
}
