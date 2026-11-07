// The pixel office: canvas scene where each team member sits at a desk,
// types when their agent is working, and wanders to the lounge when idle.
import { buildCharacter, drawIcon, shade, CHAR_W, CHAR_H } from './sprites.js';

const T = 16;
export const MAP_W = 28 * T; // 448
export const MAP_H = 16 * T; // 256
const Y1 = 4.2 * T; // walkway under the wall
const Y2 = 8.4 * T; // walkway between desk rows
const XV = 20.5 * T; // walkway to the lounge
const SPEED = 64; // px / s

// Desks follow the pipeline order: top row steps 1–4, bottom row 5–8.
const DESK_COLS = [2, 7, 12, 17];
const DESK_ROWS = [6, 11];
const SHORT = {
  'market-researcher': 'RESEARCH', 'creative-director': 'CREATIVE', 'curriculum-designer': 'CURRICULUM', 'content-writer': 'WRITER',
  'worksheet-designer': 'DESIGN', 'quality-reviewer': 'QA', 'tpt-listing-specialist': 'LISTING', 'marketing-specialist': 'MARKETING',
};

const IDLE_SPOTS = [
  { x: 23.4 * T, y: 13.1 * T, pose: 'sofa' },
  { x: 24.7 * T, y: 13.1 * T, pose: 'sofa' },
  { x: 26.0 * T, y: 13.1 * T, pose: 'sofa' },
  { x: 26.3 * T, y: 5.3 * T, pose: 'stand', icon: 'coffee' },
  { x: 22.4 * T, y: 5.5 * T, pose: 'stand' },
  { x: 24.3 * T, y: 4.8 * T, pose: 'stand', facing: 'back' },
  { x: 22.6 * T, y: 9.6 * T, pose: 'stand' },
  { x: 25.2 * T, y: 9.2 * T, pose: 'stand', icon: 'coffee' },
  { x: 27.0 * T, y: 10.4 * T, pose: 'stand' },
  { x: 22.8 * T, y: 15.2 * T, pose: 'stand' },
];
const BOARD_SPOT = { x: 8.3 * T, y: Y1, pose: 'stand' };

const SKY = (h) => (h >= 7 && h < 17 ? ['#a7dbf7', '#d8f0fc'] : h >= 17 && h < 19 ? ['#f3a86b', '#f7d29a'] : h >= 5 && h < 7 ? ['#f7c6a0', '#c9e4f5'] : ['#1f2550', '#2d3570']);

const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export class Office {
  constructor(canvas, { onSelect } = {}) {
    this.canvas = canvas;
    this.g = canvas.getContext('2d');
    this.onSelect = onSelect;
    this.chars = new Map();
    this.desks = new Map();
    this.products = [];
    this.selected = null;
    this.hover = null;
    this.scale = 1;
    this.last = performance.now();
    this.bg = null;
    this.bgHour = -1;
    this.resize();
    new ResizeObserver(() => this.resize()).observe(canvas);
    document.fonts?.ready.then(() => { this.bg = null; });
    canvas.addEventListener('click', (e) => this.click(e));
    canvas.addEventListener('mousemove', (e) => this.move(e));
    canvas.addEventListener('mouseleave', () => { this.hover = null; });
    const tick = (t) => { this.frame(t); requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }

  resize() {
    const w = this.canvas.clientWidth || MAP_W;
    const s = Math.max(1, Math.round((w * (window.devicePixelRatio || 1)) / MAP_W));
    if (s === this.scale && this.canvas.width === MAP_W * s) return;
    this.scale = s;
    this.canvas.width = MAP_W * s;
    this.canvas.height = MAP_H * s;
    this.bg = null;
  }

  // --- state -------------------------------------------------------------
  setState(state) {
    this.products = state.products ?? [];
    const agents = state.members.filter((m) => !m.isPM);
    agents.forEach((m, i) => {
      if (this.desks.has(m.name) || i >= 8) return;
      const tx = DESK_COLS[i % 4]; const ty = DESK_ROWS[Math.floor(i / 4)];
      this.desks.set(m.name, {
        name: m.name, tx, ty, x: tx * T, top: ty * T - 4, label: SHORT[m.name] ?? m.name.toUpperCase().slice(0, 10),
        seat: { x: tx * T + 16, y: ty * T + 4, pose: 'seat' }, side: { x: tx * T + 44, y: ty * T + 4, pose: 'stand' }, look: m.look,
        row: Math.floor(i / 4),
      });
    });
    for (const m of state.members) {
      let c = this.chars.get(m.name);
      if (!c) {
        c = { name: m.name, member: m, sprite: buildCharacter(m.look), x: 0, y: 0, path: [], dir: 'down', anim: Math.random() * 10, blinkAt: 2 + Math.random() * 4, spot: null, wanderAt: 0, doneUntil: 0, visitIdx: 0, visitAt: 0 };
        const start = this.targetFor(c, m);
        c.x = start.x; c.y = start.y; c.spot = start;
        this.chars.set(m.name, c);
      }
      if (c.member.status.state === 'working' && m.status.state !== 'working') c.doneUntil = performance.now() + 6000;
      c.member = m;
    }
    this.retarget(true);
  }

  occupied(except) {
    return new Set([...this.chars.values()].filter((c) => c !== except && c.spot?.idle).map((c) => c.spot.idx));
  }

  targetFor(c, m) {
    const st = m.status.state;
    if (m.isPM) {
      if (st === 'working') {
        const working = [...this.chars.values()].filter((x) => !x.member.isPM && x.member.status.state === 'working');
        if (working.length) {
          const w = working[c.visitIdx % working.length];
          return { ...this.desks.get(w.name).side, visiting: w.name };
        }
        return BOARD_SPOT;
      }
      if (st === 'waiting' || st === 'next') return BOARD_SPOT;
    } else if (st !== 'idle') {
      const d = this.desks.get(m.name);
      if (d) return d.seat;
    }
    return this.idleSpot(c);
  }

  idleSpot(c) {
    if (c.spot?.idle) return c.spot;
    const taken = this.occupied(c);
    const free = IDLE_SPOTS.map((s, idx) => ({ ...s, idx, idle: true })).filter((s) => !taken.has(s.idx));
    const pick = free[Math.floor(Math.random() * free.length)] ?? { ...IDLE_SPOTS[0], idx: 0, idle: true };
    return pick;
  }

  retarget(force = false) {
    const now = performance.now() / 1000;
    for (const c of this.chars.values()) {
      const m = c.member;
      if (m.isPM && m.status.state === 'working' && now > c.visitAt) { c.visitIdx++; c.visitAt = now + 9; force = true; }
      let target = this.targetFor(c, m);
      if (target.idle && now > c.wanderAt && c.spot?.idle && !c.path.length) {
        c.wanderAt = now + 20 + Math.random() * 25;
        if (Math.random() < 0.5) { const old = c.spot; c.spot = null; target = this.idleSpot(c); if (!target) target = old; }
      }
      const same = c.spot && c.spot.x === target.x && c.spot.y === target.y;
      if (!same || force) {
        if (same && !c.path.length) continue;
        c.spot = target;
        c.path = reduceMotion() ? [] : this.route(c, target);
        if (reduceMotion()) { c.x = target.x; c.y = target.y; }
      }
    }
  }

  // Walkway graph: rows Y1/Y2 and the column XV into the lounge.
  access(p) {
    if (p.x >= XV - 2) return { x: p.x, y: p.pose === 'sofa' ? 14.6 * T : p.y, lane: 'v' };
    return { x: p.x, y: p.y < Y2 - 10 ? Y1 : Y2, lane: 'h' };
  }

  route(c, to) {
    const from = { x: c.x, y: c.y, pose: c.path.length ? null : c.spot?.pose };
    const a = this.access(from); const b = this.access(to);
    const pts = [{ x: a.x, y: a.y }];
    if (!(a.lane === 'h' && b.lane === 'h' && a.y === b.y)) pts.push({ x: XV, y: a.y }, { x: XV, y: b.y });
    pts.push({ x: b.x, y: b.y }, { x: to.x, y: to.y });
    const out = [];
    let prev = from;
    for (const p of pts) { if (p.x !== prev.x || p.y !== prev.y) out.push(p); prev = p; }
    return out;
  }

  select(name) {
    this.selected = name;
  }

  // --- input -------------------------------------------------------------
  toMap(e) {
    const r = this.canvas.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * MAP_W, y: ((e.clientY - r.top) / r.height) * MAP_H };
  }

  hit(p) {
    const list = [...this.chars.values()].sort((a, b) => b.y - a.y);
    for (const c of list) if (p.x >= c.x - 8 && p.x <= c.x + 8 && p.y >= c.y - CHAR_H && p.y <= c.y) return c.name;
    for (const d of this.desks.values()) if (p.x >= d.x && p.x <= d.x + 32 && p.y >= d.top - 16 && p.y <= d.top + 20) return d.name;
    return null;
  }

  click(e) {
    const n = this.hit(this.toMap(e));
    if (n) { this.selected = n; this.onSelect?.(n); }
  }

  move(e) {
    this.hover = this.hit(this.toMap(e));
    this.canvas.style.cursor = this.hover ? 'pointer' : 'default';
  }

  // --- frame -------------------------------------------------------------
  frame(t) {
    const dt = Math.min(0.1, (t - this.last) / 1000);
    this.last = t;
    if (document.hidden) return;
    this.retarget();
    for (const c of this.chars.values()) {
      c.anim += dt;
      const p = c.path[0];
      if (p) {
        const dx = p.x - c.x; const dy = p.y - c.y;
        const d = Math.hypot(dx, dy);
        const step = SPEED * dt;
        if (d <= step) { c.x = p.x; c.y = p.y; c.path.shift(); } else { c.x += (dx / d) * step; c.y += (dy / d) * step; }
        c.dir = Math.abs(dy) > Math.abs(dx) ? (dy < 0 ? 'up' : 'down') : dx < 0 ? 'left' : 'right';
      }
    }
    this.draw(t);
  }

  draw(t) {
    const g = this.g;
    const hour = new Date().getHours();
    if (!this.bg || this.bgHour !== hour) { this.bg = this.renderBackground(hour); this.bgHour = hour; }
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.imageSmoothingEnabled = false;
    g.drawImage(this.bg, 0, 0);
    g.setTransform(this.scale, 0, 0, this.scale, 0, 0);
    g.imageSmoothingEnabled = false;
    this.drawBoard(g);
    this.drawClock(g);

    // Depth-sorted scene: desks, sofa and characters by baseline.
    const items = [];
    for (const d of this.desks.values()) items.push({ y: d.top + 20, draw: () => this.drawDesk(g, d, t) });
    items.push({ y: 13.6 * T, draw: () => this.drawSofaFront(g) });
    for (const c of this.chars.values()) {
      const seated = c.spot?.pose === 'seat' && !c.path.length;
      if (seated) items.push({ y: c.y - 1, draw: () => this.drawChair(g, c) });
      items.push({ y: c.y, draw: () => this.drawChar(g, c, t) });
    }
    items.sort((a, b) => a.y - b.y);
    for (const it of items) it.draw();
    for (const c of this.chars.values()) this.drawOverlay(g, c, t);
    if (hour >= 19 || hour < 6) { g.fillStyle = 'rgba(20,24,60,0.18)'; g.fillRect(0, 0, MAP_W, MAP_H); }
  }

  // --- static room -------------------------------------------------------
  renderBackground(hour) {
    const s = this.scale;
    const c = document.createElement('canvas');
    c.width = MAP_W * s; c.height = MAP_H * s;
    const g = c.getContext('2d');
    g.scale(s, s);
    const r = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };

    // floor: wood planks
    for (let y = 3 * T; y < MAP_H; y += 8) {
      const row = (y / 8) | 0;
      r(0, y, MAP_W, 8, row % 2 ? '#d9b07c' : '#d3a971');
      for (let x = (row % 3) * 22; x < MAP_W; x += 66) r(x, y, 1, 8, '#b98d58');
      r(0, y + 7, MAP_W, 1, '#c99b63');
    }
    // lounge carpet
    r(21.2 * T, 3 * T, 6.8 * T, 13 * T, '#8fb9a8');
    for (let y = 3 * T; y < MAP_H; y += 4) for (let x = 21.2 * T + ((y / 4) % 2) * 2; x < MAP_W; x += 4) r(x, y, 1, 1, '#83ad9c');
    r(21.2 * T, 3 * T, 1, 13 * T, '#6f9686');
    // rug under the sofa
    r(22.6 * T, 10.9 * T, 4.8 * T, 3.6 * T, '#e9c46a');
    r(22.9 * T, 11.2 * T, 4.2 * T, 3.0 * T, '#f4d58d');

    // back wall
    r(0, 0, MAP_W, 3 * T, '#efe4d0');
    r(0, 2.6 * T, MAP_W, 0.4 * T, '#c9b79a');
    r(0, 3 * T, MAP_W, 2, '#a8916f');
    // windows
    const [sky1, sky2] = SKY(hour);
    for (const wx of [10.2, 13.6]) {
      const x = wx * T; const y = 0.35 * T; const w = 2.6 * T; const h = 1.9 * T;
      r(x - 2, y - 2, w + 4, h + 4, '#8a6a48');
      r(x, y, w, h, sky1);
      r(x, y + h * 0.55, w, h * 0.45, sky2);
      if (hour >= 19 || hour < 5) { r(x + 6, y + 5, 1, 1, '#fff'); r(x + 26, y + 9, 1, 1, '#fff'); r(x + 15, y + 3, 1, 1, '#ffe9a8'); }
      else { r(x + 5, y + 8, 9, 3, '#ffffff'); r(x + 8, y + 6, 5, 2, '#ffffff'); }
      r(x + w / 2 - 1, y, 2, h, '#8a6a48');
      r(x, y + h / 2 - 1, w, 2, '#8a6a48');
    }
    // store sign
    r(16.6 * T, 0.5 * T, 4.0 * T, 1.0 * T, '#2f6fdd');
    r(16.6 * T, 0.5 * T + 14, 4.0 * T, 2, '#2459b3');
    g.fillStyle = '#ffffff';
    g.font = '6px "Silkscreen", monospace';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('TPT OFFICE', 18.6 * T, 1.0 * T);
    // bookshelf in the lounge
    r(23.2 * T, 0.6 * T, 2.4 * T, 2.6 * T, '#7a5232');
    for (let i = 0; i < 3; i++) {
      const y = 0.8 * T + i * 13;
      r(23.35 * T, y, 2.1 * T, 10, '#5b3b22');
      const cols = ['#e74c3c', '#2f6fdd', '#f5a623', '#27ae60', '#8e44ad', '#16a085'];
      for (let b = 0; b < 7; b++) r(23.45 * T + b * 4.4, y + 2 + (b % 3), 3, 8 - (b % 3), cols[(b + i) % cols.length]);
    }
    // coffee counter + machine
    r(25.9 * T, 2.1 * T, 1.9 * T, 1.6 * T, '#9c7a5b');
    r(25.9 * T, 2.1 * T, 1.9 * T, 3, '#b8987a');
    r(26.2 * T, 0.9 * T, 0.9 * T, 1.2 * T, '#3d4250');
    r(26.35 * T, 1.2 * T, 0.6 * T, 0.35 * T, '#e74c3c');
    r(26.5 * T, 1.75 * T, 4, 5, '#ffffff');
    // water cooler
    r(21.8 * T, 2.2 * T, 0.9 * T, 1.6 * T, '#dfe6ee');
    r(21.85 * T, 1.2 * T, 0.8 * T, 1.0 * T, '#7ec8f2');
    r(21.85 * T, 1.2 * T, 0.8 * T, 2, '#a9dcf7');
    // plants
    const plant = (px, py) => {
      const x = Math.round(px); const y = Math.round(py);
      r(x - 5, y - 6, 10, 7, '#b5523b'); r(x - 6, y - 7, 12, 2, '#cf6a50');
      g.fillStyle = '#2e8b57';
      for (const [dx, dy, w, h] of [[-7, -16, 6, 9], [1, -18, 6, 11], [-3, -22, 6, 12], [-9, -11, 5, 5], [4, -12, 5, 5]]) g.fillRect(x + dx, y + dy, w, h);
      g.fillStyle = '#3cb371';
      for (const [dx, dy] of [[-5, -14], [3, -16], [-1, -20], [5, -11]]) g.fillRect(x + dx, y + dy, 2, 2);
    };
    plant(1.0 * T, 3.6 * T);
    plant(20.2 * T, 3.6 * T);
    plant(1.0 * T, 15.7 * T);
    plant(27.4 * T, 8.0 * T);
    // printer between the desk rows (design output)
    r(0.2 * T, 9.6 * T, 1.3 * T, 1.0 * T, '#cfd6de');
    r(0.2 * T, 9.6 * T, 1.3 * T, 3, '#e8edf2');
    r(0.4 * T, 9.2 * T, 0.9 * T, 0.45 * T, '#ffffff');
    // sofa back (the front is drawn in the depth-sorted pass)
    r(22.9 * T, 12.0 * T, 4.2 * T, 0.9 * T, '#c0504d');
    r(22.9 * T, 12.0 * T, 4.2 * T, 2, '#d8706b');
    // whiteboard frame
    r(1.0 * T, 0.3 * T, 7.4 * T, 2.2 * T, '#9aa4ae');
    r(1.1 * T, 0.4 * T, 7.2 * T, 2.0 * T, '#fbfcfd');
    r(1.0 * T, 2.5 * T, 7.4 * T, 2, '#7d8790');
    return c;
  }

  // Whiteboard: one row per product (newest first), one square per pipeline step.
  drawBoard(g) {
    const x0 = 20; let y = 9;
    g.fillStyle = '#2b2b3a';
    g.font = '5px "Silkscreen", monospace';
    g.textAlign = 'left'; g.textBaseline = 'top';
    g.fillText('PIPELINE', x0, y - 1);
    y += 7;
    const list = this.products.slice(0, 3);
    if (!list.length) { g.fillStyle = '#7f8c8d'; g.fillText('NO PRODUCTS YET', x0, y + 2); return; }
    const working = new Set([...this.chars.values()].filter((c) => c.member.status.state === 'working').map((c) => `${c.member.status.task?.slug}|${c.name}`));
    const blink = Math.floor(performance.now() / 500) % 2;
    for (const p of list) {
      g.fillStyle = '#2b2b3a';
      g.fillText((p.slug.split('-').slice(0, 3).join(' ')).toUpperCase().slice(0, 10), x0, y);
      p.stages.forEach((s, i) => {
        const sx = x0 + 50 + i * 6;
        const live = working.has(`${p.slug}|${s.agent}`);
        g.fillStyle = s.done ? '#27ae60' : live ? (blink ? '#2ecc71' : '#a3e4b7') : s.next ? (blink ? '#f5a623' : '#f8cf86') : '#d5dbe1';
        g.fillRect(sx, y, 5, 5);
      });
      y += 8;
    }
  }

  drawClock(g) {
    const cx = Math.round(9.1 * T); const cy = Math.round(1.3 * T);
    g.fillStyle = '#5b4a3a'; g.fillRect(cx - 7, cy - 7, 14, 14);
    g.fillStyle = '#ffffff'; g.fillRect(cx - 6, cy - 6, 12, 12);
    const d = new Date();
    const hand = (ang, len, col) => {
      g.fillStyle = col;
      for (let i = 0; i <= len; i++) g.fillRect(Math.round(cx + Math.sin(ang) * i), Math.round(cy - Math.cos(ang) * i), 1, 1);
    };
    hand(((d.getHours() % 12) + d.getMinutes() / 60) * (Math.PI / 6), 3, '#1d1b26');
    hand(d.getMinutes() * (Math.PI / 30), 5, '#1d1b26');
    hand(d.getSeconds() * (Math.PI / 30), 5, '#e74c3c');
  }

  drawSofaFront(g) {
    const r = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
    r(22.9 * T, 13.05 * T, 4.2 * T, 0.75 * T, '#b04542');
    r(22.9 * T, 13.05 * T, 4.2 * T, 2, '#d8706b');
    r(22.6 * T, 12.3 * T, 0.45 * T, 1.5 * T, '#9c3a37');
    r(26.95 * T, 12.3 * T, 0.45 * T, 1.5 * T, '#9c3a37');
    r(23.0 * T, 13.8 * T, 2, 2, '#5b3b22'); r(26.9 * T, 13.8 * T, 2, 2, '#5b3b22');
  }

  drawChair(g, c) {
    const x = Math.round(c.x); const y = Math.round(c.y);
    g.fillStyle = '#3d4250';
    g.fillRect(x - 9, y - 17, 18, 9);
    g.fillStyle = '#525a6b';
    g.fillRect(x - 8, y - 16, 16, 2);
  }

  drawDesk(g, d, t) {
    const r = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
    const owner = this.chars.get(d.name);
    const st = owner?.member.status.state;
    const seated = owner && owner.spot?.pose === 'seat' && !owner.path.length;
    const x = d.x; const y = d.top;
    // top + front
    r(x, y, 32, 10, '#c8935a');
    r(x, y, 32, 2, '#dcae78');
    r(x, y + 10, 32, 10, '#8a5a32');
    r(x + 1, y + 19, 3, 2, '#5b3b22'); r(x + 28, y + 19, 3, 2, '#5b3b22');
    // nameplate
    const sel = this.selected === d.name || this.hover === d.name;
    r(x + 3, y + 12, 26, 6, sel ? '#fff4c2' : '#efe4d0');
    g.fillStyle = '#2b2b3a';
    g.font = `${d.label.length > 8 ? 3.4 : 4}px "Silkscreen", monospace`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(d.label, x + 16, y + 15.2);
    // laptop (back of the lid faces us) with a glow when working
    const glow = st === 'working' ? (Math.floor(t / 300) % 2 ? '#bff7d4' : '#9ef0bd') : null;
    r(x + 10, y - 3, 12, 8, '#3d4250');
    r(x + 10, y - 3, 12, 1, glow ?? '#545b6d');
    r(x + 15, y, 2, 2, d.look.shirt);
    r(x + 9, y + 5, 14, 2, '#2b2f3a');
    // hands typing on both sides of the laptop
    if (seated && (st === 'working' || st === 'next' || st === 'stalled')) {
      const up = st === 'working' && Math.floor(t / 140) % 2;
      r(x + 6, y + 3 + (up ? 0 : 1), 3, 2, d.look.skin);
      r(x + 23, y + 3 + (up ? 1 : 0), 3, 2, d.look.skin);
    }
    this.drawProp(g, d, x, y);
  }

  drawProp(g, d, x, y) {
    const r = (px, py, w, h, col) => { g.fillStyle = col; g.fillRect(Math.round(px), Math.round(py), Math.round(w), Math.round(h)); };
    switch (d.look.prop) {
      case 'magnifier': r(x + 26, y + 2, 4, 4, '#1d1b26'); r(x + 27, y + 3, 2, 2, '#bfe6ff'); r(x + 29, y + 6, 2, 2, '#7a5232'); break;
      case 'beret': r(x + 2, y + 2, 6, 5, '#ffffff'); r(x + 3, y + 3, 1, 1, '#e74c3c'); r(x + 5, y + 3, 1, 1, '#2f6fdd'); r(x + 4, y + 5, 1, 1, '#f5c542'); break;
      case 'books': r(x + 24, y + 1, 7, 2, '#e74c3c'); r(x + 25, y + 3, 6, 2, '#2f6fdd'); r(x + 24, y + 5, 7, 2, '#27ae60'); break;
      case 'pencil': r(x + 26, y + 1, 4, 6, '#2f6fdd'); r(x + 26, y - 2, 1, 3, '#f5c542'); r(x + 28, y - 3, 1, 4, '#e74c3c'); break;
      case 'headphones': r(x + 2, y + 2, 7, 5, '#ffffff'); r(x + 3, y + 3, 5, 1, '#9aa4ae'); r(x + 3, y + 5, 3, 1, '#9aa4ae'); break;
      case 'glasses': r(x + 24, y + 1, 6, 7, '#f4f1e8'); r(x + 25, y + 2, 4, 1, '#e74c3c'); r(x + 25, y + 4, 3, 1, '#9aa4ae'); r(x + 25, y + 6, 4, 1, '#9aa4ae'); break;
      case 'tag': r(x + 24, y + 1, 6, 5, '#f1c40f'); r(x + 25, y + 2, 1, 1, '#1d1b26'); r(x + 27, y + 3, 2, 1, '#8a6d0b'); break;
      case 'megaphone': r(x + 24, y + 3, 3, 3, '#e84393'); r(x + 27, y + 1, 3, 7, '#f78fb3'); break;
      default: break;
    }
  }

  drawChar(g, c, t) {
    const walking = c.path.length > 0;
    const pose = walking ? 'walk' : c.spot?.pose;
    let img;
    if (walking) {
      const f = 1 + (Math.floor(c.anim * 7) % 2);
      img = c.dir === 'up' ? c.sprite.back[f] : c.sprite.front[f];
    } else if (c.spot?.facing === 'back') {
      img = c.sprite.back[0];
    } else {
      const blinking = (c.anim % c.blinkAt) < 0.12;
      img = blinking ? c.sprite.blink : c.sprite.front[0];
    }
    let x = Math.round(c.x - CHAR_W / 2);
    let y = Math.round(c.y - CHAR_H);
    if (pose === 'seat') y = Math.round(c.y - CHAR_H + 2);
    if (pose === 'sofa') y = Math.round(c.y - CHAR_H + 4);
    const flip = walking && c.dir === 'left';
    // shadow
    if (pose !== 'seat' && pose !== 'sofa') { g.fillStyle = 'rgba(40,25,10,0.22)'; g.fillRect(x + 3, Math.round(c.y) - 1, 10, 2); }
    if (flip) { g.save(); g.translate(x + CHAR_W, y); g.scale(-1, 1); g.drawImage(img, 0, 0); g.restore(); } else g.drawImage(img, x, y);
    // screen light on the face
    if (pose === 'seat' && c.member.status.state === 'working') { g.fillStyle = 'rgba(160,255,200,0.18)'; g.fillRect(x + 3, y + 2, 10, 9); }
    c.box = { x, y };
  }

  drawOverlay(g, c, t) {
    if (!c.box) return;
    const st = c.member.status.state;
    const walking = c.path.length > 0;
    let icon = null;
    if (performance.now() < c.doneUntil) icon = 'done';
    else if (st === 'working') icon = walking ? null : c.member.status.activity?.kind ?? 'thinking';
    else if (st === 'next') icon = 'next';
    else if (st === 'waiting') icon = 'waiting';
    else if (st === 'stalled') icon = 'stalled';
    else if (!walking && c.spot?.icon) icon = c.spot.icon;
    const bob = reduceMotion() ? 0 : Math.round(Math.sin(t / 260 + c.anim) * 0.8);
    const bx = c.box.x + 2; const by = c.box.y - 12 + bob;
    if (icon) {
      g.fillStyle = '#1d1b26'; g.fillRect(bx, by, 11, 10); g.fillRect(bx + 4, by + 10, 3, 1); g.fillRect(bx + 5, by + 11, 1, 1);
      g.fillStyle = '#ffffff'; g.fillRect(bx + 1, by + 1, 9, 8); g.fillRect(bx + 5, by + 9, 1, 1);
      drawIcon(g, icon, bx + 2, by + 1.5 | 0);
    }
    if (this.selected === c.name || this.hover === c.name) {
      const label = c.member.isPM ? 'PM' : (SHORT[c.name] ?? c.name);
      g.font = '5px "Silkscreen", monospace';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      const w = Math.ceil(g.measureText(label).width) + 6;
      const ly = icon ? by - 6 : c.box.y - 6;
      g.fillStyle = this.selected === c.name ? '#f5a623' : '#2b2b3a';
      g.fillRect(Math.round(c.x - w / 2), ly - 4, w, 8);
      g.fillStyle = this.selected === c.name ? '#1d1b26' : '#ffffff';
      g.fillText(label, Math.round(c.x), ly + 0.5);
      if (this.selected === c.name) {
        g.fillStyle = 'rgba(245,166,35,0.9)';
        const fy = Math.round(c.y) + 1;
        g.fillRect(Math.round(c.x) - 7, fy, 14, 1);
      }
    }
  }
}

export { shade };
