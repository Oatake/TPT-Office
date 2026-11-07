// Team roster: reads the agents in .claude/agents/*.md and adds the
// office-only details (Thai title, desk, pixel look) the UI needs.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

// Office profile for each agent. `look` drives the pixel sprite in
// office/public/sprites.js; colors are plain hex so they are easy to tweak.
// An agent file without a profile here still shows up (with a default look).
export const PROFILES = {
  'market-researcher': {
    title: 'นักวิจัยตลาด', role: 'Market Researcher', order: 1,
    look: { hair: '#3b2a1e', hairStyle: 'short', skin: '#f2c9a0', shirt: '#2f6fdd', pants: '#2b3245', prop: 'magnifier' },
  },
  'creative-director': {
    title: 'ผู้กำกับฝ่ายสร้างสรรค์', role: 'Creative Director', order: 2,
    look: { hair: '#c0392b', hairStyle: 'bob', skin: '#e8b48a', shirt: '#8e44ad', pants: '#2d2d3a', prop: 'beret', accent: '#1f1f2e' },
  },
  'curriculum-designer': {
    title: 'นักออกแบบหลักสูตร', role: 'Curriculum Designer', order: 3,
    look: { hair: '#6b4a2f', hairStyle: 'bun', skin: '#f5d0b0', shirt: '#27ae60', pants: '#34495e', prop: 'books' },
  },
  'content-writer': {
    title: 'นักเขียนเนื้อหา', role: 'Content Writer', order: 4,
    look: { hair: '#1b1b1b', hairStyle: 'long', skin: '#d9a47a', shirt: '#f5a623', pants: '#3a3a4a', prop: 'pencil' },
  },
  'worksheet-designer': {
    title: 'นักออกแบบใบงาน', role: 'Worksheet Designer', order: 5,
    look: { hair: '#e0b04a', hairStyle: 'spiky', skin: '#f2c9a0', shirt: '#16a085', pants: '#2c3e50', prop: 'headphones', accent: '#e74c3c' },
  },
  'quality-reviewer': {
    title: 'ผู้ตรวจคุณภาพ', role: 'Quality Reviewer', order: 6,
    look: { hair: '#7f8c8d', hairStyle: 'short', skin: '#e8b48a', shirt: '#c0392b', pants: '#2b2b2b', prop: 'glasses' },
  },
  'tpt-listing-specialist': {
    title: 'ผู้เชี่ยวชาญหน้าร้าน & SEO', role: 'Listing & SEO', order: 7,
    look: { hair: '#4a2c1a', hairStyle: 'ponytail', skin: '#c68e62', shirt: '#2980b9', pants: '#1f2a36', prop: 'tag', accent: '#f1c40f' },
  },
  'marketing-specialist': {
    title: 'ผู้เชี่ยวชาญการตลาด', role: 'Marketing', order: 8,
    look: { hair: '#d35400', hairStyle: 'curly', skin: '#f5d0b0', shirt: '#e84393', pants: '#2d3436', prop: 'megaphone' },
  },
};

// The main Claude Code session runs the /new-tpt-product skill as the
// Project Manager, so it gets its own character.
export const PM = {
  name: 'project-manager',
  title: 'ผู้จัดการโปรเจกต์', role: 'Project Manager (Claude หลัก)', order: 0,
  description: 'Claude Code session หลักที่รัน /new-tpt-product — ประสานงาน ส่งงานให้ agent และ commit ผลงาน',
  tools: ['Agent', 'Bash', 'Read', 'Write', 'Edit'],
  look: { hair: '#2c2c2c', hairStyle: 'short', skin: '#f2c9a0', shirt: '#34495e', pants: '#22262e', prop: 'tie', accent: '#f5a623' },
  isPM: true,
};

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const out = {};
  if (!m) return out;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) out[kv[1]] = kv[2].trim();
  }
  return out;
}

export async function loadTeam(root) {
  const dir = path.join(root, '.claude', 'agents');
  let files = [];
  try { files = (await readdir(dir)).filter((f) => f.endsWith('.md')); } catch { /* no agents dir */ }
  const agents = [];
  for (const f of files) {
    const fm = parseFrontmatter(await readFile(path.join(dir, f), 'utf8'));
    const name = fm.name || f.replace(/\.md$/, '');
    const profile = PROFILES[name] ?? {
      title: name, role: name, order: 50,
      look: { hair: '#555', hairStyle: 'short', skin: '#f2c9a0', shirt: '#95a5a6', pants: '#2c3e50', prop: null },
    };
    agents.push({
      name,
      file: path.posix.join('.claude/agents', f),
      description: fm.description ?? '',
      tools: (fm.tools ?? '').split(',').map((t) => t.trim()).filter(Boolean),
      ...profile,
    });
  }
  agents.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  return [{ ...PM }, ...agents];
}
