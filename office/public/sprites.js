// Pixel sprites for TPT Office — drawn in code (original art, no assets).
// Characters are 16×24 bitmaps built from a base body + hair/prop overlays,
// then outlined automatically and cached as small canvases.

export const CHAR_W = 16;
export const CHAR_H = 24;

// Base body, front view. S skin, E eye, M mouth, T shirt, D shirt shade,
// N hand, P pants, B shoes.
const FRONT = [
  '................',
  '................',
  '....SSSSSSSS....',
  '...SSSSSSSSSS...',
  '...SSSSSSSSSS...',
  '...SSSSSSSSSS...',
  '...SSESSSSESS...',
  '...SSSSSSSSSS...',
  '...SSSSMMSSSS...',
  '....SSSSSSSS....',
  '......SSSS......',
  '....TTTTTTTT....',
  '...DTTTTTTTTD...',
  '..DDTTTTTTTTDD..',
  '..DDTTTTTTTTDD..',
  '..DDTTTTTTTTDD..',
  '..NNTTTTTTTTNN..',
  '....PPPPPPPP....',
  '....PPPPPPPP....',
  '....PPP..PPP....',
  '....PPP..PPP....',
  '....PPP..PPP....',
  '....BBB..BBB....',
  '................',
];

// Legs for the two walk frames (rows 19–22).
const WALK_LEGS = [
  ['....PPP..PPP....', '....PPP..PPP....', '....BBB..PPP....', '.........BBB....'],
  ['....PPP..PPP....', '....PPP..PPP....', '....PPP..BBB....', '....BBB.........'],
];
// Arms swing: rows 13–16 for the two walk frames.
const WALK_ARMS = [
  ['..DDTTTTTTTTDD..', '..DDTTTTTTTTDD..', '..NNTTTTTTTTDD..', '....TTTTTTTTNN..'],
  ['..DDTTTTTTTTDD..', '..DDTTTTTTTTDD..', '..DDTTTTTTTTNN..', '..NNTTTTTTTT....'],
];

// Hair overlays: H hair, h hair shade, '.' keep, 'x' clear.
const HAIR = {
  short: { 1: '.....HHHHHH.....', 2: '...HHHHHHHHHH...', 3: '..HHHHHHHHHHHH..', 4: '..HHH......HHH..', 5: '..HH........HH..' },
  bob: { 1: '.....HHHHHH.....', 2: '...HHHHHHHHHH...', 3: '..HHHHHHHHHHHH..', 4: '..HHHHhhhhHHHH..', 5: '..HH........HH..', 6: '..HH........HH..', 7: '..HH........HH..', 8: '..HH........HH..', 9: '..hh........hh..' },
  long: { 1: '.....HHHHHH.....', 2: '...HHHHHHHHHH...', 3: '..HHHHHHHHHHHH..', 4: '..HHHH....HHHH..', 5: '..HH........HH..', 6: '..HH........HH..', 7: '..HH........HH..', 8: '..HH........HH..', 9: '..HH........HH..', 10: '..HH........HH..', 11: '..HH........HH..', 12: '..hh........hh..' },
  bun: { 0: '......HHHH......', 1: '.....HhhhhH.....', 2: '...HHHHHHHHHH...', 3: '..HHHHHHHHHHHH..', 4: '..HHH......HHH..', 5: '..HH........HH..' },
  spiky: { 0: '....H..H..H.....', 1: '...HHHHHHHHHH...', 2: '...HHHHHHHHHH...', 3: '..HHHHHHHHHHHH..', 4: '..H.HH....HH.H..' },
  ponytail: { 1: '.....HHHHHH.....', 2: '...HHHHHHHHHH...', 3: '..HHHHHHHHHHHHH.', 4: '..HHH......HHHHH', 5: '..HH........HHHH', 6: '.............HHh', 7: '.............Hh.', 8: '.............h..' },
  curly: { 0: '....HH.HH.HH....', 1: '...HHHHHHHHHH...', 2: '..HHHHHHHHHHHH..', 3: '.HHHHHHHHHHHHHH.', 4: '.HHHH......HHHH.', 5: '.HHH........HHH.', 6: '..H..........H..' },
};

// Props worn on the body (A accent, G glasses frame).
const WEAR = {
  glasses: { 6: '....GEGGGGEG....' },
  beret: { 0: '.....AAAAAA.....', 1: '...AAAAAAAAAA...', 2: '..AAAAAAAAAAA...' },
  headphones: { 1: '....AAAAAAAA....', 2: '...A........A...', 5: '..A..........A..', 6: '..A..........A..', 7: '..A..........A..' },
  tie: { 11: '.......AA.......', 12: '.......AA.......', 13: '.......AA.......', 14: '......AAAA......', 15: '.......AA.......' },
};

export function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(f < 1 ? v * f : v + (255 - v) * (f - 1)))));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

const OUTLINE = '#1d1b26';

function paletteFor(look) {
  return {
    S: look.skin, E: '#1d1b26', M: shade(look.skin, 0.72), T: look.shirt, D: shade(look.shirt, 0.78),
    N: look.skin, P: look.pants, B: '#222230', H: look.hair, h: shade(look.hair, 0.7),
    A: look.accent ?? '#1d1b26', G: '#1d1b26',
  };
}

function overlay(rows, layer) {
  if (!layer) return rows;
  const out = rows.map((r) => r.split(''));
  for (const [y, line] of Object.entries(layer)) {
    for (let x = 0; x < line.length; x++) {
      const ch = line[x];
      if (ch === '.') continue;
      out[y][x] = ch === 'x' ? '.' : ch;
    }
  }
  return out.map((r) => r.join(''));
}

function replaceRows(rows, start, lines) {
  const out = [...rows];
  lines.forEach((l, i) => { out[start + i] = l; });
  return out;
}

// Back view: the face area becomes hair.
function backView(rows, hairStyle) {
  const out = rows.map((r) => r.split(''));
  for (let y = 2; y <= 9; y++) for (let x = 3; x <= 12; x++) if ('SEM'.includes(out[y][x])) out[y][x] = y >= 8 ? 'h' : 'H';
  if (hairStyle === 'long') for (let y = 10; y <= 13; y++) for (let x = 4; x <= 11; x++) out[y][x] = 'H';
  return out.map((r) => r.join(''));
}

function render(rows, pal) {
  const c = document.createElement('canvas');
  c.width = CHAR_W; c.height = CHAR_H;
  const g = c.getContext('2d');
  const filled = (x, y) => y >= 0 && y < CHAR_H && x >= 0 && x < CHAR_W && rows[y][x] !== '.';
  // Outline: any empty pixel touching a filled one.
  g.fillStyle = OUTLINE;
  for (let y = 0; y < CHAR_H; y++) for (let x = 0; x < CHAR_W; x++) {
    if (!filled(x, y) && (filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1))) g.fillRect(x, y, 1, 1);
  }
  for (let y = 0; y < CHAR_H; y++) for (let x = 0; x < CHAR_W; x++) {
    const ch = rows[y][x];
    if (ch === '.') continue;
    g.fillStyle = pal[ch] ?? '#ff00ff';
    g.fillRect(x, y, 1, 1);
  }
  return c;
}

// Returns { front: [stand, walk1, walk2], back: [...], blink, sit }
export function buildCharacter(look) {
  const pal = paletteFor(look);
  const wear = WEAR[look.prop];
  const dress = (rows) => overlay(overlay(rows, HAIR[look.hairStyle] ?? HAIR.short), wear);
  const walk = (i) => replaceRows(replaceRows(FRONT, 13, WALK_ARMS[i]), 19, WALK_LEGS[i]);
  const frontFrames = [FRONT, walk(0), walk(1)].map(dress);
  const blink = dress(overlay(FRONT, { 6: '...SSMSSSSMSS...' }));
  const backWear = look.prop === 'glasses' || look.prop === 'tie' ? null : wear;
  const backFrames = [FRONT, walk(0), walk(1)].map((r) => overlay(backView(overlay(r, HAIR[look.hairStyle] ?? HAIR.short), look.hairStyle), backWear));
  return {
    front: frontFrames.map((r) => render(r, pal)),
    back: backFrames.map((r) => render(r, pal)),
    blink: render(blink, pal),
  };
}

// Small portrait (head + shoulders) as a data URL for the team cards.
export function portrait(look, scale = 4) {
  const ch = buildCharacter(look);
  const c = document.createElement('canvas');
  c.width = CHAR_W * scale; c.height = 17 * scale;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.drawImage(ch.front[0], 0, 0, CHAR_W, 17, 0, 0, CHAR_W * scale, 17 * scale);
  return c.toDataURL();
}

// 7×7 icons for speech bubbles.
const ICON_PAL = { k: '#1d1b26', Y: '#f5c542', W: '#e9a0a0', b: '#2f6fdd', p: '#dfe6f0', G: '#27ae60', O: '#f5a623', R: '#e74c3c', g: '#7f8c8d' };
export const ICONS = {
  typing: ['.....kk', '....kYk', '...kYk.', '..kYk..', '.kYk...', 'kWk....', 'kk.....'],
  reading: ['.......', 'bbb.bbb', 'bppbppb', 'bppbppb', 'bppbppb', 'bbbbbbb', '.......'],
  searching: ['.kkk...', 'kpppk..', 'kpppk..', 'kpppk..', '.kkkk..', '....kk.', '.....kk'],
  running: ['kkkkkkk', 'kGkkkkk', 'kkGkkkk', 'kGkkGGk', 'kkkkkkk', '.......', '.......'],
  delegating: ['...k...', '...kk..', 'kkkkkk.', 'kkkkkkk', 'kkkkkk.', '...kk..', '...k...'],
  thinking: ['.......', '.......', '.......', 'k.k.k..', '.......', '.......', '.......'],
  asking: ['.bbbb..', 'b....b.', '....b..', '...b...', '.......', '...b...', '.......'],
  waiting: ['.bbbb..', 'b....b.', '....b..', '...b...', '.......', '...b...', '.......'],
  next: ['..OO...', '..OO...', '..OO...', '..OO...', '.......', '..OO...', '.......'],
  stalled: ['RRRR...', '..R....', '.R.....', 'RRRR...', '....ggg', '.....g.', '....ggg'],
  done: ['......G', '.....GG', 'G...GG.', 'GG.GG..', '.GGG...', '..G....', '.......'],
  coffee: ['..g.g..', '.g.g...', 'RRRRR..', 'RkkkRRR', 'RRRRR.R', 'RRRRRRR', '.RRR...'],
};

export function drawIcon(g, name, x, y) {
  const rows = ICONS[name];
  if (!rows) return;
  for (let j = 0; j < rows.length; j++) for (let i = 0; i < rows[j].length; i++) {
    const ch = rows[j][i];
    if (ch === '.') continue;
    g.fillStyle = ICON_PAL[ch];
    g.fillRect(x + i, y + j, 1, 1);
  }
}
