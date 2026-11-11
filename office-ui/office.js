// office.js — ออฟฟิศ pixel art ของ TPT-Office Live (เฟส 2)
//
// ภาพทั้งหมดวาดด้วยโค้ด (fillRect ทีละ pixel) เป็นงานต้นฉบับของร้าน ไม่ใช้ sprite/tileset ภายนอก
// รับข้อมูลจาก snapshot เดิม (state.team / state.products / state.guests) ผ่าน Office.update(state)
//
// โลกขนาด 256×184 "logical pixel" แล้วขยายเป็นจำนวนเท่าเต็มให้คมชัด
// ชั้นที่ 1 = pixel (ห้อง โต๊ะ ตัวละคร) ชั้นที่ 2 = ข้อความ/บับเบิลที่ความละเอียดจริงของจอ

(() => {
  const W = 256, H = 184;
  const SPEED = 42;                    // logical px ต่อวินาที
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------------- ผังออฟฟิศ
  const PM_DESK = { x: 128, y: 46 };
  const COLS = [32, 96, 160, 224];
  const ROW_A = 80, ROW_B = 118;
  const DESKS = {
    pm: PM_DESK,
    'market-researcher': { x: COLS[0], y: ROW_A },
    'creative-director': { x: COLS[1], y: ROW_A },
    'curriculum-designer': { x: COLS[2], y: ROW_A },
    'content-writer': { x: COLS[3], y: ROW_A },
    'worksheet-designer': { x: COLS[0], y: ROW_B },
    'quality-reviewer': { x: COLS[1], y: ROW_B },
    'tpt-listing-specialist': { x: COLS[2], y: ROW_B },
    'marketing-specialist': { x: COLS[3], y: ROW_B },
  };
  const PROP = {
    pm: 'mug', 'market-researcher': 'books', 'creative-director': 'palette',
    'curriculum-designer': 'ruler', 'content-writer': 'papers', 'worksheet-designer': 'printer',
    'quality-reviewer': 'clipboard', 'tpt-listing-specialist': 'tag', 'marketing-specialist': 'megaphone',
  };
  const SHORT = {
    pm: 'PM', 'market-researcher': 'วิจัยตลาด', 'creative-director': 'Creative', 'curriculum-designer': 'หลักสูตร',
    'content-writer': 'นักเขียน', 'worksheet-designer': 'ออกแบบ', 'quality-reviewer': 'QA',
    'tpt-listing-specialist': 'Listing', 'marketing-specialist': 'การตลาด',
  };
  const CORRIDORS = [64, 128, 192];
  const LOUNGE_AISLE = 140;
  const HANDOFF = { x: 152, y: 64 };
  const LOUNGE = [
    { x: 26, y: 172 }, { x: 44, y: 178 }, { x: 76, y: 160, couch: true }, { x: 90, y: 160, couch: true },
    { x: 104, y: 160, couch: true }, { x: 134, y: 174 }, { x: 156, y: 168 }, { x: 176, y: 178 },
    { x: 198, y: 170 }, { x: 220, y: 176 },
  ];
  const VISITOR = [{ x: 196, y: 64 }, { x: 212, y: 64 }, { x: 228, y: 64 }];

  // หน้าตาตัวละคร (สีผิว/ผม/เสื้อหลากหลาย)
  const LOOK = {
    pm: { skin: '#f1c27d', hair: '#3b2a1e', style: 'short', shirt: '#34495e', pants: '#2d3436', tie: '#c0392b' },
    'market-researcher': { skin: '#8d5524', hair: '#1b1b1b', style: 'curly', shirt: '#2e8b57', pants: '#34495e' },
    'creative-director': { skin: '#ffdbac', hair: '#a5432a', style: 'bun', shirt: '#8e44ad', pants: '#2d3436' },
    'curriculum-designer': { skin: '#c68642', hair: '#2c1b10', style: 'long', shirt: '#2980b9', pants: '#3d3d3d' },
    'content-writer': { skin: '#e0ac69', hair: '#d4a24c', style: 'long', shirt: '#e67e22', pants: '#34495e' },
    'worksheet-designer': { skin: '#5c3a21', hair: '#0f0f0f', style: 'short', shirt: '#16a085', pants: '#2d3436' },
    'quality-reviewer': { skin: '#f1c27d', hair: '#9e9e9e', style: 'short', shirt: '#c0392b', pants: '#3d3d3d' },
    'tpt-listing-specialist': { skin: '#a86b3c', hair: '#3d2314', style: 'bun', shirt: '#e1b12c', pants: '#34495e' },
    'marketing-specialist': { skin: '#ffe0bd', hair: '#5b3a29', style: 'curly', shirt: '#e84393', pants: '#2d3436' },
  };
  const GUEST_LOOKS = [
    { skin: '#c68642', hair: '#222', style: 'short', shirt: '#7f8c8d', pants: '#555' },
    { skin: '#ffdbac', hair: '#6d4c41', style: 'long', shirt: '#95a5a6', pants: '#555' },
    { skin: '#8d5524', hair: '#111', style: 'curly', shirt: '#707b7c', pants: '#555' },
  ];

  const BUBBLE = { waiting: '✋', stalled: '💤', error: '❗', rework: '↩️', done: '✅', supervising: '👀' };
  const DESK_STATES = new Set(['working', 'supervising', 'waiting', 'stalled', 'error', 'rework']);

  // ---------------------------------------------------------------- ตัวช่วยวาด
  let ctx, canvas, scale = 3, dpr = 1, wrap, tip, opts = {};
  const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  function line(x0, y0, x1, y1, c) { // เส้น pixel คม ๆ (Bresenham)
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      R(x0, y0, 1, 1, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }

  // ---------------------------------------------------------------- ตัวละคร
  const chars = new Map();
  let lastState = null, firstUpdate = true, t = 0;

  function makeChar(id, look) {
    return { id, look, x: 0, y: 0, path: [], at: null, state: 'idle', carry: false,
      lounge: -1, nextWander: 0, onArrive: null, step: 0, flashUntil: 0, guest: false, card: null };
  }

  function seatOf(id) { const d = DESKS[id]; return { x: d.x + 1, y: d.y - 1 }; }
  // จุดออกจากที่ยืน → ทางเดิน (aisle)
  function exitPath(p, kind) {
    if (kind === 'desk') {
      const d = DESKS[p.id];
      return [{ x: d.x + 20, y: d.y - 1 }, { x: d.x + 20, y: d.y + 18 }];
    }
    if (kind === 'lounge') return [{ x: p.x, y: LOUNGE_AISLE }];
    return [];
  }
  function route(from, fromKind, to, toKind) {
    const a = exitPath(from, fromKind), b = exitPath(to, toKind).reverse();
    const A = a.length ? a[a.length - 1] : from, B = b.length ? b[0] : to;
    const mid = [];
    if (A.y !== B.y) {
      const target = (A.x + B.x) / 2;
      const cx = CORRIDORS.reduce((best, c) => (Math.abs(c - target) < Math.abs(best - target) ? c : best));
      mid.push({ x: cx, y: A.y }, { x: cx, y: B.y });
    }
    const pts = [...a, ...mid, ...b, { x: to.x, y: to.y }];
    return pts.filter((p, i) => i === 0 || p.x !== pts[i - 1].x || p.y !== pts[i - 1].y);
  }

  function place(ch, where, kind) { ch.x = where.x; ch.y = where.y; ch.path = []; ch.at = kind; }
  function walk(ch, where, kind, onArrive) {
    if (reduced) { place(ch, where, kind); onArrive && onArrive(); return; }
    ch.path = route({ x: ch.x, y: ch.y, id: ch.id }, ch.at, { ...where, id: ch.id }, kind);
    ch.destKind = kind;
    ch.at = 'walking';
    ch.onArrive = onArrive || null;
  }
  function freeLounge(except) {
    const used = new Set([...chars.values()].filter((c) => c !== except).map((c) => c.lounge));
    const free = LOUNGE.map((_, i) => i).filter((i) => !used.has(i));
    return free.length ? free[Math.floor(Math.random() * free.length)] : Math.floor(Math.random() * LOUNGE.length);
  }
  function goLounge(ch, instant) {
    ch.lounge = freeLounge(ch);
    ch.nextWander = t + 12 + Math.random() * 20;
    const spot = LOUNGE[ch.lounge];
    instant ? place(ch, spot, 'lounge') : walk(ch, spot, 'lounge');
  }
  function goDesk(ch, instant) {
    ch.lounge = -1;
    const s = seatOf(ch.id);
    instant ? place(ch, s, 'desk') : walk(ch, s, 'desk');
  }

  function applyTeam(team) {
    for (const card of team) {
      let ch = chars.get(card.id);
      if (!ch) { ch = makeChar(card.id, LOOK[card.id]); chars.set(card.id, ch); }
      const prev = ch.state;
      ch.card = card;
      ch.state = card.state;
      if (firstUpdate) {
        DESK_STATES.has(card.state) ? goDesk(ch, true) : goLounge(ch, true);
        continue;
      }
      if (prev === card.state) continue;
      if (DESK_STATES.has(card.state)) {
        if (ch.at !== 'desk' || ch.path.length) goDesk(ch);
      } else if (card.state === 'done' && DESK_STATES.has(prev) && card.id !== 'pm') {
        // ส่งงาน: ถือแฟ้มเดินไปโต๊ะ PM แล้วไปพักผ่อน
        ch.carry = true;
        ch.flashUntil = t + 12;
        const spot = { x: HANDOFF.x + (Math.random() * 16 - 8), y: HANDOFF.y };
        walk(ch, spot, 'handoff', () => { ch.pauseUntil = t + 1.4; ch.afterPause = () => { ch.carry = false; goLounge(ch); }; });
      } else if (ch.at === 'desk' || (ch.at === 'walking' && ch.destKind === 'desk')) {
        goLounge(ch);
      }
    }
  }

  function applyGuests(guests) {
    const active = (guests || []).filter((g) => g.state === 'working' || g.state === 'stalled').slice(0, VISITOR.length);
    const keep = new Set();
    active.forEach((g, i) => {
      const id = `guest:${g.role}:${g.since}`;
      keep.add(id);
      let ch = chars.get(id);
      if (!ch) {
        ch = makeChar(id, GUEST_LOOKS[i % GUEST_LOOKS.length]);
        ch.guest = true;
        chars.set(id, ch);
        if (firstUpdate || reduced) place(ch, VISITOR[i], 'visitor');
        else { place(ch, { x: 262, y: 64 }, 'edge'); walk(ch, VISITOR[i], 'visitor'); }
      }
      ch.state = g.state;
      ch.card = { th: `ผู้ช่วย: ${g.role}`, en: 'นอกทีม', state: g.state, summary: g.summary, slug: g.slug, since: g.since, icon: '🧳' };
    });
    for (const [id, ch] of chars) {
      if (ch.guest && !keep.has(id) && !ch.leaving) {
        ch.leaving = true;
        ch.state = 'done';
        if (reduced) chars.delete(id);
        else walk(ch, { x: 266, y: 64 }, 'edge', () => chars.delete(id));
      }
    }
  }

  function tick(dt) {
    for (const ch of [...chars.values()]) {
      if (ch.pauseUntil) {
        if (t >= ch.pauseUntil) { ch.pauseUntil = 0; const f = ch.afterPause; ch.afterPause = null; f && f(); }
        continue;
      }
      if (ch.path.length) {
        let move = SPEED * dt;
        while (move > 0 && ch.path.length) {
          const p = ch.path[0], dx = p.x - ch.x, dy = p.y - ch.y, d = Math.hypot(dx, dy);
          if (d <= move) { ch.x = p.x; ch.y = p.y; ch.path.shift(); move -= d; }
          else { ch.x += (dx / d) * move; ch.y += (dy / d) * move; ch.step += move; move = 0; }
          if (Math.abs(dx) > 0.01) ch.face = dx > 0 ? 1 : -1;
        }
        if (!ch.path.length) {
          ch.at = ch.destKind;
          const f = ch.onArrive; ch.onArrive = null;
          f && f();
        }
      } else if (ch.at === 'lounge' && !reduced && t > ch.nextWander && !ch.guest) {
        goLounge(ch); // เดินเล่นในมุมพักผ่อน
      }
    }
  }

  // ---------------------------------------------------------------- วาดคน
  // yb = แนวล่างของลำตัว (เอว)
  function drawPerson(ch, x, yb, pose, f) {
    const L = ch.look;
    // ขา
    if (pose === 'stand' || pose === 'walk' || pose === 'hand') {
      const lift = pose === 'walk' ? f : -1;
      R(x - 3, yb, 2, lift === 0 ? 3 : 4, L.pants); R(x + 1, yb, 2, lift === 1 ? 3 : 4, L.pants);
      R(x - 3, yb + (lift === 0 ? 3 : 4), 2, 1, '#1e1e1e'); R(x + 1, yb + (lift === 1 ? 3 : 4), 2, 1, '#1e1e1e');
    } else if (pose === 'couch') {
      R(x - 3, yb, 2, 2, L.pants); R(x + 1, yb, 2, 2, L.pants);
      R(x - 3, yb + 2, 2, 3, L.pants); R(x + 1, yb + 2, 2, 3, L.pants);
      R(x - 3, yb + 5, 2, 1, '#1e1e1e'); R(x + 1, yb + 5, 2, 1, '#1e1e1e');
    }
    const bob = (pose === 'walk' && f === 1) ? -1 : 0;
    const sleep = pose === 'sleep';
    yb += bob;
    // ลำตัว + แขน
    R(x - 4, yb - 6, 8, 6, L.shirt);
    if (L.tie) { R(x - 1, yb - 6, 2, 1, L.tie); R(x - 1, yb - 5, 1, 4, L.tie); }
    if (pose === 'type') {
      R(x - 5, yb - 6, 1, 3, L.shirt); R(x + 4, yb - 6, 1, 3, L.shirt);
      R(x - 4, yb - 3 + (f ? 0 : -1) + 1, 2, 1, L.skin); R(x + 2, yb - 3 + (f ? -1 : 0) + 1, 2, 1, L.skin);
    } else if (pose === 'hand') {
      const wave = f ? 1 : 0;
      R(x - 5, yb - 6, 1, 5, L.shirt); R(x - 5, yb - 1, 1, 1, L.skin);
      R(x + 4 + wave, yb - 13, 1, 7, L.shirt); R(x + 4 + wave, yb - 15, 1, 2, L.skin);
    } else if (sleep) {
      R(x - 5, yb - 4, 10, 2, L.shirt); // แขนกอดโต๊ะ
    } else {
      R(x - 5, yb - 6, 1, 5, L.shirt); R(x + 4, yb - 6, 1, 5, L.shirt);
      R(x - 5, yb - 1, 1, 1, L.skin); R(x + 4, yb - 1, 1, 1, L.skin);
    }
    // หัว
    const hy = sleep ? yb - 9 : yb - 12;
    R(x - 3, hy, 6, 6, L.skin);
    // ผม
    R(x - 3, hy - 1, 6, 2, L.hair);
    if (L.style === 'long') { R(x - 4, hy, 1, 6, L.hair); R(x + 3, hy, 1, 6, L.hair); }
    else if (L.style === 'bun') { R(x - 1, hy - 3, 3, 2, L.hair); R(x - 3, hy + 1, 1, 1, L.hair); R(x + 2, hy + 1, 1, 1, L.hair); }
    else if (L.style === 'curly') { R(x - 4, hy - 1, 8, 2, L.hair); R(x - 4, hy + 1, 1, 2, L.hair); R(x + 3, hy + 1, 1, 2, L.hair); R(x - 2, hy - 2, 4, 1, L.hair); }
    else { R(x - 3, hy + 1, 1, 1, L.hair); R(x + 2, hy + 1, 1, 1, L.hair); }
    // ตา (หลับ = ไม่วาด)
    if (!sleep) {
      const look = pose === 'look' ? (Math.floor(t * 0.8) % 3) - 1 : (ch.face === -1 && (pose === 'walk' || pose === 'stand') ? -1 : 0);
      const blink = Math.floor(t * 10) % 37 === 0;
      if (!blink) { R(x - 2 + look, hy + 3, 1, 1, '#2b2b2b'); R(x + 1 + look, hy + 3, 1, 1, '#2b2b2b'); }
    }
    // ของในมือ
    if (ch.carry) { R(x - 3, yb - 5, 6, 5, '#ffffff'); R(x - 2, yb - 4, 4, 1, '#9db3d6'); R(x - 2, yb - 2, 3, 1, '#9db3d6'); }
    if (ch.at === 'lounge' && !ch.carry && pose !== 'walk') {
      R(x + 5, yb - 3, 2, 2, '#f5f5f5'); R(x + 5, yb - 3, 2, 1, '#6d4c41');
      if (Math.floor(t * 1.5) % 2) R(x + 6, yb - 5, 1, 1, 'rgba(255,255,255,.7)');
    }
  }

  // ---------------------------------------------------------------- วาดห้อง
  function skyColors() {
    const h = new Date().getHours();
    if (h >= 7 && h < 17) return { sky: '#9fd3f5', night: false };
    if ((h >= 17 && h < 19) || h === 6) return { sky: '#f5b77a', night: false };
    return { sky: '#1d2747', night: true };
  }
  function drawRoom(board) {
    const { sky, night } = skyColors();
    // พื้นไม้
    R(0, 34, W, H - 34, '#c9a37b');
    for (let y = 34; y < H; y += 6) {
      R(0, y, W, 1, '#b58e66');
      const off = ((y / 6) % 2) * 16;
      for (let x = off; x < W; x += 32) R(x, y, 1, 6, '#b58e66');
    }
    // พรมมุมพักผ่อน
    R(122, 152, 112, 30, '#7fb08d'); R(124, 154, 108, 26, '#8fc19d');
    for (let x = 128; x < 230; x += 8) R(x, 166, 4, 1, '#7fb08d');
    // ผนัง
    R(0, 0, W, 34, '#efe3cf'); R(0, 31, W, 3, '#a98b6a'); R(0, 30, W, 1, '#c8b08f');
    // หน้าต่าง
    for (const wx of [8, 212]) {
      R(wx - 1, 5, 38, 22, '#8b6b4a'); R(wx, 6, 36, 20, sky);
      if (night) { for (const [sx, sy] of [[5, 4], [17, 9], [28, 3], [10, 14], [31, 15]]) R(wx + sx, 6 + sy, 1, 1, '#fff7c2'); R(wx + 26, 9, 3, 3, '#f4f1de'); }
      else { R(wx + 6, 11, 9, 2, '#ffffff'); R(wx + 8, 10, 5, 1, '#ffffff'); R(wx + 22, 17, 7, 2, '#f7fbff'); }
      R(wx + 17, 6, 2, 20, '#8b6b4a'); R(wx, 15, 36, 1, '#8b6b4a');
      R(wx - 2, 27, 40, 2, '#a3825f');
    }
    // นาฬิกา (เวลาจริง)
    const cx = 58, cy = 15, now = new Date();
    R(cx - 6, cy - 6, 13, 13, '#5d4037'); R(cx - 5, cy - 5, 11, 11, '#fffaf0');
    const hr = ((now.getHours() % 12) + now.getMinutes() / 60) / 12 * Math.PI * 2, mn = now.getMinutes() / 60 * Math.PI * 2;
    line(cx, cy, cx + Math.sin(hr) * 3, cy - Math.cos(hr) * 3, '#2b2b2b');
    line(cx, cy, cx + Math.sin(mn) * 4.5, cy - Math.cos(mn) * 4.5, '#c0392b');
    // กระดาน pipeline
    R(71, 3, 114, 26, '#7a5c3e'); R(72, 4, 112, 24, '#fbfbf7');
    if (board) {
      board.stages.forEach((st, i) => {
        const x = 78 + i * 13, y = 19;
        let c = '#d9d6cf';
        if (st.done) c = '#2e9e5b';
        if (board.rework && (st.id === 'content' || st.id === 'design' || st.id === 'qa') && !st.active) c = '#d64545';
        if (st.active) c = Math.floor(t * 2) % 2 ? '#3d7be0' : '#8fb4f0';
        R(x, y, 11, 4, c);
      });
    }
    R(176, 26, 6, 1, '#d64545'); R(166, 26, 6, 1, '#3d7be0'); // ปากกาไวท์บอร์ด
    // ต้นไม้
    plant(4, 150); plant(250, 150); plant(70, 34); plant(186, 34);
    // มุมกาแฟ
    R(6, 148, 14, 18, '#5f6a72'); R(7, 149, 12, 6, '#2d3436'); R(9, 158, 8, 1, '#2d3436');
    R(11, 160, 3, 3, '#f5f5f5'); R(16, 151, 2, 2, Math.floor(t) % 2 ? '#e74c3c' : '#7f2a22');
    R(5, 166, 16, 3, '#8d6e63');
    // ตู้น้ำ
    R(238, 158, 10, 12, '#dfe6e9'); R(239, 150, 8, 8, '#74b9ff'); R(240, 151, 6, 6, '#a6d4ff'); R(240, 162, 2, 2, '#0984e3');
    if (night) { ctx.fillStyle = 'rgba(20,24,48,.18)'; ctx.fillRect(0, 0, W, H); }
  }
  function plant(x, y) {
    R(x - 3, y + 6, 7, 6, '#b5651d'); R(x - 4, y + 5, 9, 2, '#9c5418');
    R(x - 1, y - 2, 3, 8, '#2e7d32'); R(x - 4, y, 3, 4, '#43a047'); R(x + 2, y - 1, 3, 4, '#43a047'); R(x - 2, y - 4, 2, 3, '#66bb6a');
  }
  function couch() {
    R(66, 146, 50, 8, '#c0392b'); R(64, 150, 4, 12, '#a93226'); R(114, 150, 4, 12, '#a93226');
    R(68, 154, 46, 6, '#d35445'); R(68, 160, 46, 2, '#922b21');
  }

  function drawDesk(id, card) {
    const d = DESKS[id], x = d.x, y = d.y;
    const st = card ? card.state : 'idle';
    const occupied = [...chars.values()].some((c) => c.id === id && c.at === 'desk' && !c.path.length);
    // เก้าอี้ว่าง
    if (!occupied) { R(x - 3, y - 9, 8, 7, '#4b4b5a'); R(x - 2, y - 8, 6, 5, '#5c5c6e'); }
    // โต๊ะ
    R(x - 16, y, 32, 4, '#deb887'); R(x - 16, y + 3, 32, 1, '#c99f6c');
    R(x - 16, y + 4, 32, 8, '#a47148'); R(x - 15, y + 5, 30, 6, '#b07d52');
    R(x - 15, y + 12, 2, 3, '#7a5233'); R(x + 13, y + 12, 2, 3, '#7a5233');
    // จอ
    R(x - 15, y - 9, 11, 8, '#2d3436');
    let scr = '#1f2a33';
    if (st === 'working' || st === 'supervising' || st === 'waiting') scr = '#1e3a5f';
    if (st === 'error' || st === 'rework') scr = Math.floor(t * 2) % 2 ? '#7f1d1d' : '#b91c1c';
    R(x - 14, y - 8, 9, 6, scr);
    if (st === 'working' || st === 'supervising') {
      for (let i = 0; i < 4; i++) {
        const w = 2 + ((i * 7 + Math.floor(t * 6)) % 6);
        R(x - 13, y - 7 + i * 1.5, Math.min(w, 7), 1, i % 2 ? '#7fd1ff' : '#b6f0c2');
      }
    } else if (st === 'stalled') {
      R(x - 12, y - 6, 2, 1, '#55606a'); R(x - 9, y - 5, 2, 1, '#55606a');
    } else if (st === 'error' || st === 'rework') {
      R(x - 10, y - 7, 1, 3, '#fff'); R(x - 10, y - 3, 1, 1, '#fff');
    }
    R(x - 11, y - 1, 3, 1, '#2d3436');
    // คีย์บอร์ด
    R(x - 2, y + 1, 7, 2, '#636e72'); R(x - 1, y + 1, 5, 1, '#b2bec3');
    drawProp(PROP[id], x, y, st);
    // กองงานที่ถูกส่งกลับ
    if (st === 'rework') { R(x + 6, y - 2, 7, 3, '#e74c3c'); R(x + 7, y - 3, 5, 1, '#ff7675'); }
  }
  function drawProp(kind, x, y, st) {
    const px = x + 8;
    switch (kind) {
      case 'books': R(px, y - 6, 6, 2, '#c0392b'); R(px + 1, y - 4, 6, 2, '#2980b9'); R(px, y - 2, 7, 2, '#27ae60'); break;
      case 'palette': R(px, y - 3, 7, 3, '#f3d9a4'); R(px + 1, y - 3, 1, 1, '#e74c3c'); R(px + 3, y - 3, 1, 1, '#3498db'); R(px + 5, y - 2, 1, 1, '#f1c40f'); break;
      case 'ruler': R(px - 1, y - 1, 9, 1, '#f1c40f'); for (let i = 0; i < 9; i += 2) R(px - 1 + i, y - 1, 1, 1, '#b7950b'); R(px + 2, y - 5, 4, 4, '#8e44ad'); break;
      case 'papers': R(px, y - 4, 6, 4, '#ffffff'); R(px + 1, y - 5, 6, 1, '#f0f0f0'); R(px + 1, y - 3, 4, 1, '#bbb'); R(px + 1, y - 1, 3, 1, '#bbb'); break;
      case 'printer': {
        R(px - 1, y - 5, 8, 5, '#b2bec3'); R(px, y - 4, 6, 1, '#636e72');
        const out = st === 'working' ? Math.floor(t * 3) % 4 : 0;
        R(px + 1, y - 1 - out, 4, out + 1, '#ffffff');
        break;
      }
      case 'clipboard': R(px, y - 6, 6, 6, '#8d6e63'); R(px + 1, y - 5, 4, 4, '#ffffff'); R(px + 2, y - 7, 2, 1, '#636e72'); R(px + 1, y - 4, 1, 1, '#27ae60'); R(px + 3, y - 2, 1, 1, '#c0392b'); break;
      case 'tag': R(px, y - 4, 6, 4, '#f6e58d'); R(px, y - 4, 1, 1, '#deb887'); R(px + 2, y - 3, 3, 1, '#e17055'); break;
      case 'megaphone': R(px, y - 4, 2, 3, '#e17055'); R(px + 2, y - 5, 2, 5, '#fab1a0'); R(px + 4, y - 6, 2, 7, '#e17055'); break;
      case 'mug': R(px + 1, y - 4, 4, 4, '#ecf0f1'); R(px + 5, y - 3, 1, 2, '#ecf0f1'); R(px + 1, y - 4, 4, 1, '#6d4c41'); break;
      default: break;
    }
  }

  function poseFor(ch) {
    if (ch.at === 'walking') return 'walk';
    if (ch.at === 'desk') {
      switch (ch.state) {
        case 'working': return 'type';
        case 'supervising': return 'look';
        case 'waiting': return 'hand';
        case 'stalled': return 'sleep';
        default: return 'sit';
      }
    }
    if (ch.at === 'lounge' && LOUNGE[ch.lounge]?.couch) return 'couch';
    return 'stand';
  }

  // ---------------------------------------------------------------- เฟรม
  let teamCards = new Map();
  function draw() {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.imageSmoothingEnabled = false;
    const board = lastState && (lastState.products.find((p) => p.status === 'planning' || p.status === 'in-progress') || lastState.products[0]);
    drawRoom(board);

    const items = [];
    for (const id of Object.keys(DESKS)) items.push({ y: DESKS[id].y, draw: () => drawDesk(id, teamCards.get(id)) });
    items.push({ y: 150, draw: couch });
    const placed = [];
    for (const ch of chars.values()) {
      const pose = poseFor(ch);
      const f = pose === 'walk' ? Math.floor(ch.step / 3) % 2 : pose === 'type' ? Math.floor(t * 8) % 2 : pose === 'hand' ? Math.floor(t * 3) % 2 : 0;
      let x = Math.round(ch.x), yb, sortY;
      if (pose === 'type' || pose === 'sit' || pose === 'look' || pose === 'sleep') {
        const d = DESKS[ch.id]; yb = d.y + 1; sortY = d.y - 1; x = d.x + 1;
      } else if (pose === 'couch') { yb = ch.y - 3; sortY = 151; }
      else { yb = Math.round(ch.y) - 5; sortY = ch.y; }
      placed.push({ ch, x, yb, pose });
      items.push({ y: sortY, draw: () => drawPerson(ch, x, yb, pose, f) });
    }
    items.sort((a, b) => a.y - b.y).forEach((it) => it.draw());

    // ---- ชั้นข้อความ (ความละเอียดจริง)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const cssScale = scale / dpr;
    const fs = (n) => `${Math.round(n * scale)}px system-ui, "Noto Sans Thai", sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    // ป้ายชื่อใต้โต๊ะ
    if (cssScale >= 2) {
      ctx.font = `600 ${fs(3.8)}`;
      for (const id of Object.keys(DESKS)) {
        const d = DESKS[id];
        const label = SHORT[id];
        const w = Math.min(ctx.measureText(label).width + 3 * scale, 28 * scale);
        const cx = d.x * scale, cy = (d.y + 8) * scale;
        ctx.fillStyle = '#f3e6c4';
        roundRect(cx - w / 2, cy - 2.6 * scale, w, 5.2 * scale, 1 * scale); ctx.fill();
        ctx.fillStyle = '#4a3420'; ctx.fillText(fit(label, 26 * scale), cx, cy + 0.2 * scale);
      }
    }
    // ชื่อสินค้าบนกระดาน
    if (board) {
      ctx.font = `600 ${fs(4.4)}`;
      ctx.fillStyle = '#3a3a3a';
      ctx.fillText(fit(board.title, 104 * scale), 128 * scale, 11 * scale);
    } else {
      ctx.font = fs(4.4); ctx.fillStyle = '#777'; ctx.fillText('ยังไม่มีสินค้า', 128 * scale, 15 * scale);
    }
    // บับเบิลสถานะ
    for (const { ch, x, yb, pose } of placed) {
      let icon = BUBBLE[ch.state];
      if (ch.carry) icon = '📄';
      if (ch.state === 'done' && !ch.carry && t > ch.flashUntil) icon = null;
      if (ch.state === 'supervising' && ch.at !== 'desk') icon = null;
      if (!icon && ch.at === 'desk' && ch.state === 'working') icon = '…';
      if (!icon) continue;
      const headTop = (pose === 'sleep' ? yb - 10 : pose === 'hand' ? yb - 16 : yb - 14);
      const bounce = (ch.state === 'waiting' || ch.state === 'error') && !reduced ? Math.sin(t * 6) * 1.2 : 0;
      let bx = x, by = headTop - 6 + bounce;
      if (by < 36) { bx = x + 11; by = headTop + 2 + bounce; } // อย่าบังกระดานบนผนัง
      bubble(bx * scale, by * scale, icon, ch.state);
    }
    if (hoverId) {
      const p = placed.find((q) => q.ch.id === hoverId);
      if (p) { ctx.strokeStyle = 'rgba(61,123,224,.9)'; ctx.lineWidth = Math.max(1, scale / 2); ctx.strokeRect((p.x - 6) * scale, (p.yb - 15) * scale, 12 * scale, 22 * scale); }
    }
    lastPlaced = placed;
  }
  let lastPlaced = [];

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function fit(text, max) {
    if (ctx.measureText(text).width <= max) return text;
    let s = text;
    while (s.length > 3 && ctx.measureText(s + '…').width > max) s = s.slice(0, -1);
    return s + '…';
  }
  function bubble(cx, cy, icon, state) {
    const s = scale, w = 9 * s, h = 8 * s;
    const border = { waiting: '#d39a1f', error: '#d64545', rework: '#d64545', stalled: '#e07a3f', done: '#2e9e5b' }[state] || '#8a8f98';
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = border; ctx.lineWidth = Math.max(1, s * 0.5);
    roundRect(cx - w / 2, cy - h / 2, w, h, 2 * s); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - 1.5 * s, cy + h / 2 - 0.3 * s); ctx.lineTo(cx, cy + h / 2 + 2 * s); ctx.lineTo(cx + 1.5 * s, cy + h / 2 - 0.3 * s); ctx.fill();
    ctx.font = `${Math.round(5.2 * s)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    ctx.fillStyle = '#333';
    if (icon === '…') { ctx.font = `700 ${Math.round(5 * s)}px system-ui`; ctx.fillText(['·  ', '·· ', '···'][Math.floor(t * 3) % 3], cx, cy - 0.6 * s); }
    else ctx.fillText(icon, cx, cy + 0.4 * s);
  }

  // ---------------------------------------------------------------- ขนาด + hover
  function resize() {
    dpr = window.devicePixelRatio || 1;
    const cw = wrap.clientWidth || W;
    scale = Math.max(1, Math.floor((cw * dpr) / W));
    canvas.width = W * scale; canvas.height = H * scale;
    canvas.style.width = `${(W * scale) / dpr}px`;
    canvas.style.height = `${(H * scale) / dpr}px`;
  }
  let hoverId = null, pinned = false;
  function hit(e) {
    const r = canvas.getBoundingClientRect();
    const lx = ((e.clientX - r.left) / r.width) * W, ly = ((e.clientY - r.top) / r.height) * H;
    let best = null;
    for (const p of lastPlaced) {
      if (lx >= p.x - 6 && lx <= p.x + 6 && ly >= p.yb - 15 && ly <= p.yb + 7) best = p;
    }
    if (!best) {
      // คลิกที่โต๊ะ = เลือกเจ้าของโต๊ะ
      for (const [id, d] of Object.entries(DESKS)) if (lx >= d.x - 16 && lx <= d.x + 16 && ly >= d.y - 10 && ly <= d.y + 15) best = lastPlaced.find((p) => p.ch.id === id) || null;
    }
    return best;
  }
  function showTip(p, e) {
    if (!p || !p.ch.card) { tip.hidden = true; hoverId = null; canvas.style.cursor = ''; return; }
    hoverId = p.ch.id;
    canvas.style.cursor = 'pointer';
    tip.innerHTML = opts.describe ? opts.describe(p.ch.card) : p.ch.card.th;
    tip.hidden = false;
    const wr = wrap.getBoundingClientRect();
    let left = e.clientX - wr.left + 14, top = e.clientY - wr.top + 14;
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    if (left + tw > wr.width - 4) left = Math.max(4, e.clientX - wr.left - tw - 14);
    if (top + th > wr.height - 4) top = Math.max(4, e.clientY - wr.top - th - 14);
    tip.style.left = `${left}px`; tip.style.top = `${top}px`;
  }

  // ---------------------------------------------------------------- API
  let lastFrame = 0, acc = 0;
  function loop(ts) {
    const dt = Math.min(0.1, (ts - (lastFrame || ts)) / 1000);
    lastFrame = ts;
    acc += dt;
    if (acc >= 1 / 30) { // วาดราว 30 fps ก็พอ
      t += acc; tick(acc); acc = 0;
      if (canvas.isConnected && wrap.offsetParent !== null) draw();
    }
    requestAnimationFrame(loop);
  }

  window.Office = {
    init(container, options = {}) {
      opts = options;
      wrap = container;
      canvas = document.createElement('canvas');
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', 'ออฟฟิศจำลอง: ตัวละครแต่ละตัวคือ agent หนึ่งตำแหน่ง สถานะเป็นข้อความอยู่ในแถบด้านล่าง');
      tip = document.createElement('div');
      tip.className = 'office-tip'; tip.hidden = true;
      wrap.append(canvas, tip);
      ctx = canvas.getContext('2d');
      resize();
      new ResizeObserver(resize).observe(wrap);
      canvas.addEventListener('pointermove', (e) => { if (!pinned && e.pointerType === 'mouse') showTip(hit(e), e); });
      canvas.addEventListener('pointerleave', () => { if (!pinned) { tip.hidden = true; hoverId = null; } });
      canvas.addEventListener('click', (e) => {
        const p = hit(e);
        pinned = !!p && !(pinned && hoverId === p.ch.id);
        showTip(pinned ? p : null, e);
      });
      requestAnimationFrame(loop);
    },
    update(state) {
      lastState = state;
      teamCards = new Map(state.team.map((c) => [c.id, c]));
      applyTeam(state.team);
      applyGuests(state.guests);
      firstUpdate = false;
      if (pinned && hoverId) {
        const ch = chars.get(hoverId);
        if (ch && ch.card && !tip.hidden) tip.innerHTML = opts.describe ? opts.describe(ch.card) : ch.card.th;
      }
    },
  };
})();
