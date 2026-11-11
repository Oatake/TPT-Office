/* trail-lib.js — shared by worksheet.html and thumbnails.html
 * 3rd-grade-winter-fractions-number-line ("Snowshoe Trail")
 *
 * 1. ART: every illustration is original inline SVG (no clip art, no fonts other than Lexend).
 *    All symbols are injected once as <symbol>s and reused with <use href="#id">.
 *    For a series reskin, swap the character symbols here; the number-line engine stays.
 * 2. NUMBER LINES: TRAIL.nl() parses the NL[...] notation from 03-content.md and draws
 *    every tick from the formula x = x0 + (k / (b × (max − min))) × L. Nothing is hand-placed.
 *
 * Units: 1 SVG unit = 1 CSS px = 1/96 in (every SVG is drawn 1:1).
 */
(function () {
  const C = { slate: '#1e293b', glacier: '#2468a0', berry: '#c8325f', ice: '#dcebf7', gray: '#64748b', faint: '#a7b4c2' };
  const IN = 96;

  /* ------------------------------------------------------------------ */
  /* SVG symbols                                                          */
  /* ------------------------------------------------------------------ */
  const S = 'stroke="#1e293b" stroke-linecap="round" stroke-linejoin="round"';
  const DEFS = `
<svg class="hidden-defs" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">
<defs>
  <!-- #3 Juniper, snowshoe hare — jumping pose (faces right). Fur fill = var(--fur) (white) -->
  <symbol id="jun-jump" viewBox="0 0 124 96">
    <g ${S} stroke-width="3" fill="var(--fur,#fff)">
      <path d="M40 55 Q26 63 14 74" fill="none"/>
      <path d="M2 80 Q6 70 20 71 Q32 73 30 79 Q22 85 2 80 Z"/>
      <circle cx="26" cy="41" r="6.5"/>
      <ellipse cx="54" cy="48" rx="28" ry="16" transform="rotate(-14 54 48)"/>
      <path d="M68 60 Q80 70 96 70" fill="none"/>
      <path d="M58 61 Q66 72 80 76" fill="none"/>
      <ellipse cx="80" cy="12" rx="5.5" ry="15" transform="rotate(-38 80 12)"/>
      <ellipse cx="88" cy="11" rx="5.5" ry="15" transform="rotate(-18 88 11)"/>
      <circle cx="91" cy="35" r="14"/>
    </g>
    <ellipse cx="80" cy="2" rx="4" ry="5" transform="rotate(-38 80 12)" fill="#1e293b"/>
    <ellipse cx="88" cy="1" rx="4" ry="5" transform="rotate(-18 88 11)" fill="#1e293b"/>
    <circle cx="96" cy="32" r="2.3" fill="#1e293b"/>
    <path d="M103 37 L107 38.5 L103 41 Z" fill="#1e293b" ${S} stroke-width="1.2"/>
    <path d="M84 47 Q92 52 101 46" fill="none" ${S} stroke-width="5.5" stroke="var(--scarf,#1e293b)"/>
    <path d="M84 47 Q92 52 101 46" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="3 4"/>
    <path d="M86 49 Q74 50 64 44" fill="none" ${S} stroke-width="5" stroke="var(--scarf,#1e293b)"/>
    <path d="M86 49 Q74 50 64 44" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 4"/>
  </symbol>

  <!-- #3 Juniper — standing, pointing left (back toward 0) -->
  <symbol id="jun-point" viewBox="0 0 90 120">
    <g ${S} stroke-width="3" fill="var(--fur,#fff)">
      <ellipse cx="34" cy="111" rx="15" ry="5.5"/>
      <ellipse cx="60" cy="111" rx="15" ry="5.5"/>
      <ellipse cx="47" cy="80" rx="21" ry="27"/>
      <path d="M30 70 Q18 64 6 60" fill="none"/>
      <circle cx="5" cy="60" r="3.2"/>
      <path d="M64 72 Q70 82 66 92" fill="none"/>
      <ellipse cx="39" cy="15" rx="5.8" ry="15.5" transform="rotate(-10 39 15)"/>
      <ellipse cx="55" cy="15" rx="5.8" ry="15.5" transform="rotate(10 55 15)"/>
      <circle cx="47" cy="42" r="16"/>
    </g>
    <ellipse cx="39" cy="4" rx="4.3" ry="5" transform="rotate(-10 39 15)" fill="#1e293b"/>
    <ellipse cx="55" cy="4" rx="4.3" ry="5" transform="rotate(10 55 15)" fill="#1e293b"/>
    <circle cx="41" cy="40" r="2.3" fill="#1e293b"/><circle cx="53" cy="40" r="2.3" fill="#1e293b"/>
    <path d="M44.5 46 L49.5 46 L47 49 Z" fill="#1e293b" ${S} stroke-width="1.2"/>
    <path d="M32 57 Q47 64 62 57" fill="none" ${S} stroke-width="6" stroke="var(--scarf,#1e293b)"/>
    <path d="M32 57 Q47 64 62 57" fill="none" stroke="#fff" stroke-width="1.7" stroke-dasharray="3.5 4"/>
    <path d="M57 60 L60 76" fill="none" ${S} stroke-width="6" stroke="var(--scarf,#1e293b)"/>
    <path d="M57 60 L60 76" fill="none" stroke="#fff" stroke-width="1.7" stroke-dasharray="3.5 4"/>
  </symbol>

  <!-- #3 Juniper — standing, waving -->
  <symbol id="jun-wave" viewBox="0 0 90 120">
    <g ${S} stroke-width="3" fill="var(--fur,#fff)">
      <ellipse cx="34" cy="111" rx="15" ry="5.5"/>
      <ellipse cx="60" cy="111" rx="15" ry="5.5"/>
      <ellipse cx="47" cy="80" rx="21" ry="27"/>
      <path d="M30 72 Q24 82 28 92" fill="none"/>
      <path d="M64 70 Q76 62 80 48" fill="none"/>
      <circle cx="80.5" cy="46" r="3.4"/>
      <ellipse cx="39" cy="15" rx="5.8" ry="15.5" transform="rotate(-10 39 15)"/>
      <ellipse cx="55" cy="15" rx="5.8" ry="15.5" transform="rotate(10 55 15)"/>
      <circle cx="47" cy="42" r="16"/>
    </g>
    <ellipse cx="39" cy="4" rx="4.3" ry="5" transform="rotate(-10 39 15)" fill="#1e293b"/>
    <ellipse cx="55" cy="4" rx="4.3" ry="5" transform="rotate(10 55 15)" fill="#1e293b"/>
    <circle cx="41" cy="40" r="2.3" fill="#1e293b"/><circle cx="53" cy="40" r="2.3" fill="#1e293b"/>
    <path d="M44.5 46 L49.5 46 L47 49 Z" fill="#1e293b" ${S} stroke-width="1.2"/>
    <path d="M42 51 Q47 54 52 51" fill="none" ${S} stroke-width="1.6"/>
    <path d="M32 57 Q47 64 62 57" fill="none" ${S} stroke-width="6" stroke="var(--scarf,#1e293b)"/>
    <path d="M32 57 Q47 64 62 57" fill="none" stroke="#fff" stroke-width="1.7" stroke-dasharray="3.5 4"/>
    <path d="M37 60 L33 76" fill="none" ${S} stroke-width="6" stroke="var(--scarf,#1e293b)"/>
    <path d="M37 60 L33 76" fill="none" stroke="#fff" stroke-width="1.7" stroke-dasharray="3.5 4"/>
  </symbol>

  <!-- Juniper head (icon) -->
  <symbol id="jun-head" viewBox="0 0 50 60">
    <g ${S} stroke-width="3" fill="var(--fur,#fff)">
      <ellipse cx="17" cy="16" rx="5.5" ry="14" transform="rotate(-12 17 16)"/>
      <ellipse cx="33" cy="16" rx="5.5" ry="14" transform="rotate(12 33 16)"/>
      <circle cx="25" cy="40" r="15"/>
    </g>
    <ellipse cx="17" cy="5" rx="4" ry="4.6" transform="rotate(-12 17 16)" fill="#1e293b"/>
    <ellipse cx="33" cy="5" rx="4" ry="4.6" transform="rotate(12 33 16)" fill="#1e293b"/>
    <circle cx="19.5" cy="38" r="2.2" fill="#1e293b"/><circle cx="30.5" cy="38" r="2.2" fill="#1e293b"/>
    <path d="M22.7 44 L27.3 44 L25 46.8 Z" fill="#1e293b" ${S} stroke-width="1.1"/>
  </symbol>

  <!-- #4 Birch the moose — standing, waving one front hoof (head = front-view #birch-head) -->
  <symbol id="birch-wave" viewBox="0 0 130 120">
    <g ${S} stroke-width="3" fill="var(--fur2,#fff)">
      <path d="M100 82 L100 114 M112 80 L113 114 M58 84 L58 114" fill="none"/>
      <path d="M44 76 Q24 74 16 58" fill="none"/>
      <path d="M10 55 L19 51 L21 57 L13 60 Z"/>
      <path d="M40 54 Q42 42 60 42 Q70 34 82 42 L104 44 Q122 46 122 64 Q122 84 104 84 L58 86 Q40 86 40 70 Z"/>
      <path d="M122 54 Q129 52 127 61" fill="none"/>
    </g>
    <use href="#birch-head" x="6" y="4" width="66" height="60"/>
  </symbol>

  <!-- #4 Birch — long stride (faces right) -->
  <symbol id="birch-stride" viewBox="0 0 140 120">
    <g ${S} stroke-width="3" fill="var(--fur2,#fff)">
      <path d="M30 80 L14 112 M44 84 L50 113 M84 82 L80 113 M96 80 L118 108" fill="none"/>
      <path d="M100 54 Q98 42 80 42 Q70 34 58 42 L36 44 Q18 46 18 64 Q18 84 36 84 L82 86 Q100 86 100 70 Z"/>
      <path d="M18 54 Q11 52 13 61" fill="none"/>
    </g>
    <use href="#birch-head" x="68" y="4" width="66" height="60"/>
  </symbol>

  <!-- Birch head (icon, front view: palmate antlers, long face, knit hat) -->
  <symbol id="birch-head" viewBox="0 0 64 58">
    <g ${S} stroke-width="2.8" fill="var(--fur2,#fff)">
      <path d="M22 19 Q12 22 6 14 L3 5 L8 10 L10 2 L14 10 L17 3 L19 12 Q22 15 25 16 Z"/>
      <path d="M42 19 Q52 22 58 14 L61 5 L56 10 L54 2 L50 10 L47 3 L45 12 Q42 15 39 16 Z"/>
      <path d="M18 24 Q13 20 15 27 Q17 30 21 29 Z M46 24 Q51 20 49 27 Q47 30 43 29 Z"/>
      <path d="M21 20 Q32 13 43 20 L42 36 Q47 48 39 54 Q32 57 25 54 Q17 48 22 36 Z"/>
      <path d="M22 20 Q32 2 42 20 Z"/>
      <circle cx="32" cy="6" r="3.6"/>
    </g>
    <path d="M22 19.5 Q32 15 42 19.5" fill="none" ${S} stroke-width="3" stroke="var(--hat,#1e293b)"/>
    <circle cx="27" cy="29" r="2" fill="#1e293b"/><circle cx="37" cy="29" r="2" fill="#1e293b"/>
    <ellipse cx="29" cy="48" rx="1.6" ry="2.2" fill="#1e293b"/><ellipse cx="35" cy="48" rx="1.6" ry="2.2" fill="#1e293b"/>
  </symbol>

  <!-- #5 Footprints: hare track pair (2 long hind feet + 2 small front feet). currentColor -->
  <symbol id="prints" viewBox="0 0 40 44">
    <g fill="currentColor">
      <path d="M11 2 Q17 2 17.5 10 Q18 19 13.5 22 Q8.5 23 7 16 Q5.5 6 11 2 Z"/>
      <path d="M29 2 Q34.5 6 33 16 Q31.5 23 26.5 22 Q22 19 22.5 10 Q23 2 29 2 Z"/>
      <ellipse cx="14" cy="31" rx="4" ry="4.4"/>
      <ellipse cx="25" cy="39" rx="4" ry="4.4"/>
    </g>
  </symbol>
  <symbol id="prints-o" viewBox="0 0 40 44">
    <g fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round">
      <path d="M11 2 Q17 2 17.5 10 Q18 19 13.5 22 Q8.5 23 7 16 Q5.5 6 11 2 Z"/>
      <path d="M29 2 Q34.5 6 33 16 Q31.5 23 26.5 22 Q22 19 22.5 10 Q23 2 29 2 Z"/>
      <ellipse cx="14" cy="31" rx="3.6" ry="4.2"/>
      <ellipse cx="25" cy="39" rx="3.6" ry="4.2"/>
    </g>
  </symbol>
  <!-- moose hoof print (inverted heart split in two halves) -->
  <symbol id="hoof" viewBox="0 0 40 40">
    <path d="M18 4 Q8 6 7 20 Q7 32 18 37 Z M22 4 Q32 6 33 20 Q33 32 22 37 Z" fill="currentColor"/>
  </symbol>

  <!-- #6 Base Camp flag. Flag fill = var(--flag) -->
  <symbol id="flag" viewBox="0 0 60 80">
    <path d="M4 78 Q30 62 56 78 Z" fill="var(--snowfill,#fff)" ${S} stroke-width="2.6"/>
    <path d="M22 70 L22 6" fill="none" ${S} stroke-width="3"/>
    <path d="M22 7 L50 16 L22 26 Z" fill="var(--flag,#fff)" ${S} stroke-width="2.6"/>
  </symbol>

  <!-- #7 Cocoa Cabin (no wreaths, no lights) -->
  <symbol id="cabin" viewBox="0 0 100 100">
    <g ${S} stroke-width="3" fill="var(--wood,#fff)">
      <path d="M66 36 L66 14 L78 14 L78 40" />
      <path d="M18 48 L82 48 L82 96 L18 96 Z"/>
      <path d="M8 52 L50 16 L92 52 Z"/>
      <path d="M42 96 L42 70 Q42 66 46 66 L54 66 Q58 66 58 70 L58 96" fill="var(--door,#fff)"/>
      <path d="M24 58 L38 58 L38 72 L24 72 Z M31 58 L31 72 M24 65 L38 65" fill="var(--win,#fff)"/>
    </g>
    <path d="M20 41 Q30 34 36 37 Q44 22 50 21 Q58 24 62 34 Q72 32 80 41 L50 16 Z" fill="#fff" ${S} stroke-width="2.4"/>
    <path d="M66 12 Q60 6 68 2 M74 10 Q70 4 78 -1" fill="none" ${S} stroke-width="2.2" stroke="var(--smoke,#64748b)"/>
    <path d="M62 82 L78 82 M62 89 L78 89 M22 82 L38 82 M22 89 L38 89" ${S} stroke-width="1.4" stroke="#94a3b8"/>
    <circle cx="54" cy="82" r="1.8" fill="#1e293b"/>
  </symbol>

  <!-- #10 Pine tree (outline, no star, no ornaments) + mountain -->
  <symbol id="pine" viewBox="0 0 60 100">
    <g fill="var(--pinefill,#fff)" stroke="var(--pine,#2468a0)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
      <path d="M30 96 L30 84"/>
      <path d="M6 86 L30 54 L54 86 Z"/>
      <path d="M10 64 L30 30 L50 64 Z"/>
      <path d="M15 40 L30 6 L45 40 Z"/>
    </g>
  </symbol>
  <symbol id="mtn" viewBox="0 0 200 110">
    <g fill="var(--mtnfill,#fff)" stroke="var(--mtn,#2468a0)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
      <path d="M2 108 L70 14 L112 70 L140 36 L198 108 Z"/>
      <path d="M52 39 L70 14 L88 39 L80 34 L72 42 L63 34 Z" fill="#fff"/>
      <path d="M128 51 L140 36 L152 51 L146 48 L140 54 L134 48 Z" fill="#fff"/>
    </g>
  </symbol>

  <!-- #11 Snowflakes (drawn, never the ❄ character) -->
  <symbol id="flake" viewBox="-50 -50 100 100">
    <g stroke="currentColor" stroke-width="5" stroke-linecap="round" fill="none">
      <g id="flake-arm"><path d="M0 0 L0 -44 M0 -26 L-12 -38 M0 -26 L12 -38 M0 -12 L-8 -20 M0 -12 L8 -20"/></g>
      <use href="#flake-arm" transform="rotate(60)"/><use href="#flake-arm" transform="rotate(120)"/>
      <use href="#flake-arm" transform="rotate(180)"/><use href="#flake-arm" transform="rotate(240)"/><use href="#flake-arm" transform="rotate(300)"/>
    </g>
  </symbol>
  <symbol id="flake2" viewBox="-50 -50 100 100">
    <g stroke="currentColor" stroke-width="5" stroke-linecap="round" fill="none">
      <g id="flake2-arm"><path d="M0 -8 L0 -44 M-9 -30 L0 -22 L9 -30"/></g>
      <use href="#flake2-arm" transform="rotate(60)"/><use href="#flake2-arm" transform="rotate(120)"/>
      <use href="#flake2-arm" transform="rotate(180)"/><use href="#flake2-arm" transform="rotate(240)"/><use href="#flake2-arm" transform="rotate(300)"/>
      <circle r="8"/>
    </g>
  </symbol>

  <!-- #12 Snowball + mitten tokens -->
  <symbol id="snowball" viewBox="0 0 50 50">
    <circle cx="25" cy="25" r="20" fill="var(--ball,#fff)" stroke="currentColor" stroke-width="3.4"/>
    <path d="M14 30 Q18 38 28 39" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="31" cy="17" r="2" fill="currentColor"/><circle cx="20" cy="20" r="1.6" fill="currentColor"/>
  </symbol>
  <symbol id="mitten" viewBox="0 0 50 50">
    <g fill="var(--mit,#fff)" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round">
      <path d="M14 36 L13 18 Q13 5 26 5 Q38 5 38 18 L38 36 Z"/>
      <path d="M14 27 Q5 26 5 18 Q6 11 13.5 15"/>
      <path d="M11 36 L41 36 L41 46 L11 46 Z"/>
    </g>
    <path d="M18 41 L34 41" stroke="currentColor" stroke-width="2.4" stroke-dasharray="2 4" stroke-linecap="round"/>
  </symbol>

  <!-- #14 Scissors -->
  <symbol id="scissors" viewBox="0 0 48 32">
    <g fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round">
      <circle cx="8" cy="8" r="5.5"/><circle cx="8" cy="24" r="5.5"/>
      <path d="M12.5 11 L44 24 M12.5 21 L44 8"/>
    </g>
  </symbol>

  <!-- "Try it!" star (SVG, never ★) -->
  <symbol id="star" viewBox="0 0 40 40">
    <path d="M20 3 L25 14.5 L37.5 15.5 L28 23.8 L31 36 L20 29.5 L9 36 L12 23.8 L2.5 15.5 L15 14.5 Z" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linejoin="round"/>
  </symbol>

  <!-- small arrow (replaces the → character everywhere) -->
  <symbol id="arrow" viewBox="0 0 24 12">
    <path d="M1 6 L21 6 M15 1 L21 6 L15 11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  </symbol>
</defs>
</svg>`;

  /* ------------------------------------------------------------------ */
  /* helpers                                                              */
  /* ------------------------------------------------------------------ */
  function frac(s) {
    if (s == null) return null;
    s = String(s).trim();
    if (!s || s === '—' || s === '-' || s === '–') return null;
    const [n, d] = s.split('/').map(Number);
    const den = d === undefined ? 1 : d;
    return { n, d: den, v: n / den, s };
  }

  // parse "NL[0–2, 4, point=7/4, labels=0,1,2, arc=1, guide=dots]"
  function parseNL(str) {
    const m = String(str).match(/NL\[(.*)\]/);
    const body = (m ? m[1] : str).trim();
    const head = body.match(/^\s*(\d+)\s*[–-]\s*(\d+)\s*,\s*([^,]+?)\s*(?:,(.*))?$/);
    if (!head) throw new Error('Bad NL spec: ' + str);
    const o = { min: +head[1], max: +head[2] };
    const bRaw = head[3].trim();
    o.b = /^\d+$/.test(bRaw) ? +bRaw : null;
    const rest = head[4] || '';
    const re = /(\w+)\s*=\s*(.+?)(?=,\s*\w+\s*=|$)/g;
    let k;
    while ((k = re.exec(rest))) o[k[1]] = k[2].trim();
    o.pt = frac(o.point);
    // labels: default = whole numbers only
    const lab = o.labels || '';
    if (lab === 'all') o.lab = 'all';
    else if (/boxes/.test(lab)) o.lab = 'boxes';
    else if (lab === 'none') o.lab = 'none';
    else o.lab = 'wholes';
    return o;
  }

  const r2 = (x) => Math.round(x * 100) / 100;

  // stacked fraction in SVG. cx = centre, by = y of the fraction bar.
  function fracSVG(cx, by, n, d, fs, o = {}) {
    const col = o.color || C.slate, wt = o.weight || 600;
    const w = Math.max(String(n).length, String(d).length) * fs * 0.6 + fs * 0.32;
    const sw = Math.max(1.3, fs * 0.075);
    let s = `<g fill="${col}" font-family="Lexend" font-weight="${wt}" font-size="${fs}" text-anchor="middle">`;
    s += n === '' ? '' : `<text x="${r2(cx)}" y="${r2(by - fs * 0.19)}">${n}</text>`;
    s += `<line x1="${r2(cx - w / 2)}" x2="${r2(cx + w / 2)}" y1="${r2(by)}" y2="${r2(by)}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"/>`;
    s += d === '' ? '' : `<text x="${r2(cx)}" y="${r2(by + fs * 0.93)}">${d}</text>`;
    return s + '</g>';
  }
  // whole number centred vertically on y
  function numSVG(cx, cy, n, fs, o = {}) {
    return `<text x="${r2(cx)}" y="${r2(cy + fs * 0.36)}" font-family="Lexend" font-weight="${o.weight || 600}" font-size="${fs}" text-anchor="middle" fill="${o.color || C.slate}">${n}</text>`;
  }
  // footprint point marker (pad centred exactly on (x, y))
  function footSVG(x, y, sc = 1, col = C.slate) {
    return `<g transform="translate(${r2(x)} ${r2(y)}) scale(${sc})" fill="${col}" stroke="#fff" stroke-width="1.3">
      <ellipse cx="0" cy="0.5" rx="5.6" ry="7.4"/><circle cx="-5.3" cy="-9.6" r="2.5"/><circle cx="0" cy="-12" r="2.6"/><circle cx="5.3" cy="-9.6" r="2.5"/></g>`;
  }
  // hop arc from x1 to x2 at baseline y (arrow head at x2)
  function arcSVG(x1, x2, y, h, style = 'solid', o = {}) {
    const rx = (x2 - x1) / 2;
    const y0 = y - (o.lift ?? 3);
    let stroke = C.berry, sw = o.sw || 2.6, dash = '', op = 1, head = true;
    if (style === 'dash') dash = 'stroke-dasharray="6 5"';
    if (style === 'trace') { stroke = '#8b98a8'; dash = 'stroke-dasharray="1.5 5"'; sw = 2.2; head = false; }
    if (style === 'faint') { op = 0.55; sw = 1.9; }
    if (o.color) stroke = o.color;
    let s = `<path d="M${r2(x1)} ${r2(y0)} A ${r2(rx)} ${r2(h)} 0 0 1 ${r2(x2)} ${r2(y0)}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" ${dash} opacity="${op}"/>`;
    if (head) {
      const a = o.head || 5.5;
      s += `<path d="M${r2(x2 - a * 0.95)} ${r2(y0 - a * 1.25)} L${r2(x2)} ${r2(y0)} L${r2(x2 + a * 0.75)} ${r2(y0 - a * 1.3)}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" opacity="${op}"/>`;
    }
    return s;
  }

  /* ------------------------------------------------------------------ */
  /* Number line engine                                                    */
  /* ------------------------------------------------------------------ */
  // o: parsed NL (min,max,b,pt,lab,guide,arc) + layout: x0,y,L, lw, th, thW, fs, lfs (label font size),
  //    arcs:[[v1,v2,style]], noTicks, tickFr:[0,.2,.5,1], ptStyle 'foot'|'dot'|'none', ptScale, labTop
  function line(o) {
    const span = o.max - o.min;
    const L = o.L, x0 = o.x0, y = o.y;
    const X = (v) => x0 + ((v - o.min) / span) * L;   // == x0 + (k / (b·span))·L for v = min + k/b
    const lw = o.lw ?? 2.7, th = o.th ?? 8.6, thW = o.thW ?? 11.5;
    const fs = o.fs ?? 16;
    let s = '';
    // ticks
    const ticks = [];
    if (o.tickFr) o.tickFr.forEach((f) => ticks.push({ x: x0 + f * L, whole: f === 0 || f === 1, v: f }));
    else if (o.b && !o.noTicks) {
      const n = o.b * span;
      for (let k = 0; k <= n; k++) ticks.push({ x: x0 + (k / n) * L, k, whole: k % o.b === 0, v: o.min + k / o.b });
    } else for (let w = o.min; w <= o.max; w++) ticks.push({ x: X(w), whole: true, v: w });
    // guide dots
    if (o.guide && o.gb) {
      const pts = o.guide === 'half' ? [0.5] : Array.from({ length: o.gb - 1 }, (_, i) => (i + 1) / o.gb);
      pts.forEach((f) => (s += `<circle cx="${r2(X(o.min + f))}" cy="${y}" r="3.6" fill="#fff" stroke="#8b98a8" stroke-width="1.6"/>`));
    }
    // arcs (drawn under the line ends)
    (o.arcs || []).forEach(([a, b, st]) => {
      const xa = X(a), xb = X(b);
      s += arcSVG(xa, xb, y, o.arcH ?? Math.min(26, Math.max(9, (xb - xa) * 0.42)), st, { sw: o.arcSW, head: o.arcHead });
    });
    s += `<line x1="${r2(x0)}" y1="${y}" x2="${r2(x0 + L)}" y2="${y}" stroke="${C.slate}" stroke-width="${lw}" stroke-linecap="round"/>`;
    if (o.guide && o.gb) {
      const pts = o.guide === 'half' ? [0.5] : Array.from({ length: o.gb - 1 }, (_, i) => (i + 1) / o.gb);
      pts.forEach((f) => (s += `<circle cx="${r2(X(o.min + f))}" cy="${y}" r="3.4" fill="#fff" stroke="#7b8da3" stroke-width="1.5"/>`));
    }
    ticks.forEach((t) => {
      const h = t.whole ? thW : th;
      s += `<line x1="${r2(t.x)}" x2="${r2(t.x)}" y1="${r2(y - h)}" y2="${r2(y + h)}" stroke="${C.slate}" stroke-width="${t.whole ? lw * 0.9 : lw * 0.78}" stroke-linecap="round"/>`;
    });
    // labels
    const gap = o.labGap ?? 4;
    const lfs = o.lfs ?? fs;
    const labY = y + thW + gap;               // top of label area
    const show = (t) => {
      if (o.lab === 'none') return;
      if (o.labOnly && !o.labOnly.some((v) => Math.abs(v - t.v) < 1e-9)) return;
      if (t.whole) { s += numSVG(t.x, labY + lfs * 0.38, Math.round(t.v), lfs, { color: o.labColor }); return; }
      if (o.lab === 'all') s += fracSVG(t.x, labY + lfs * 0.93, t.k - 0 + (o.min * o.b), o.b, o.ffs ?? lfs, { color: o.labColor });
    };
    if (!o.noLabels) ticks.forEach(show);
    if (o.lab === 'boxes') ticks.filter((t) => !t.whole).forEach((t) => {
      const bw = o.boxW ?? 34, bh = o.boxH ?? 52, bx = t.x - bw / 2, by = labY + 2;
      s += `<rect x="${r2(bx)}" y="${r2(by)}" width="${bw}" height="${bh}" rx="5" fill="none" stroke="#8b98a8" stroke-width="1.4" stroke-dasharray="4 3"/>`;
      s += `<line x1="${r2(bx + 6)}" x2="${r2(bx + bw - 6)}" y1="${r2(by + bh / 2)}" y2="${r2(by + bh / 2)}" stroke="${C.slate}" stroke-width="1.6"/>`;
    });
    // extra labels (answer keys): [[v, text, color]]
    (o.extraLab || []).forEach(([v, n, d, col]) => {
      const x = X(v);
      if (d) s += fracSVG(x, labY + lfs * 0.93, n, d, lfs, { color: col || C.berry, weight: 700 });
      else s += numSVG(x, labY + lfs * 0.38, n, lfs, { color: col || C.berry, weight: 700 });
    });
    // point
    if (o.pt && o.ptStyle !== 'none') {
      const x = X(o.pt.v);
      if (o.ptStyle === 'dot') s += `<circle cx="${r2(x)}" cy="${y}" r="${o.dotR ?? 6.2}" fill="${o.ptColor || C.slate}" stroke="#fff" stroke-width="1.3"/>`;
      else s += footSVG(x, y, o.ptScale ?? 1, o.ptColor || C.slate);
    }
    return { svg: s, X, labY, ticks };
  }

  // Build a full <svg> containing one or more aligned lines.
  // spec: { w, h, lines:[{nl:'NL[..]', y, ...overrides}], x0, L, extra:'svg string', cls }
  function svgBox(w, h, inner, cls = '', style = '') {
    return `<svg class="${cls}" width="${r2(w)}" height="${r2(h)}" viewBox="0 0 ${r2(w)} ${r2(h)}" style="${style}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  }
  function nl(str, lay = {}) {
    const o = Object.assign(parseNL(str), lay);
    return line(o);
  }

  // paws level icon: n pairs of footprints
  function paws(n, size = 26) {
    let s = '';
    for (let i = 0; i < n; i++) s += `<use href="#prints" x="${i * size * 0.92}" y="0" width="${size}" height="${size}"/>`;
    const w = (n - 1) * size * 0.92 + size;
    return `<svg class="paws" width="${r2(w)}" height="${size}" viewBox="0 0 ${r2(w)} ${size}" style="color:#1e293b">${s}</svg>`;
  }

  // Cover / thumbnail scene: snowy trail = real number line 0..1 in fourths
  function scene(o = {}) {
  const W = o.W ?? 8.36 * IN, H = o.H ?? 3.95 * IN, y = o.y ?? 262;
  const x0 = o.x0 ?? 136, L = o.L ?? 5.9 * IN, X = (v) => x0 + v * L, k = o.k ?? 1;
  let s = `<defs><linearGradient id="snowfade${o.id || ''}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dcebf7"/><stop offset="1" stop-color="#dcebf7" stop-opacity="0"/></linearGradient></defs>`;
  // flakes
  (o.flakes ?? [[W - 150, 6, 34, 'flake'], [W - 300, 52, 24, 'flake2'], [X(.36), 18, 22, 'flake2']]).forEach(([fx, fy, fw, id]) =>
    s += `<use href="#${id}" x="${fx}" y="${fy}" width="${fw}" height="${fw}" style="color:#2468a0"/>`);
  // mountain + back hill
  s += `<use href="#mtn" x="-10" y="${y - 182 * k}" width="${290 * k}" height="${160 * k}" style="--mtnfill:#fff"/>`;
  s += `<path d="M0 ${y - 40} Q170 ${y - 96} 340 ${y - 52} Q540 ${y - 2} ${W} ${y - 70} L${W} ${y + 40} Q560 ${y + 66} 300 ${y + 48} Q140 ${y + 38} 0 ${y + 52} Z" fill="#dcebf7"/>`;
  // pines (glacier outline, no decorations), left of Base Camp
  (o.pines ?? [[0, y - 150, 118], [44, y - 118, 92], [86, y - 138, 108]]).forEach(([px, py, ph]) =>
    s += `<use href="#pine" x="${px}" y="${py}" width="${ph * 0.6}" height="${ph}" style="--pinefill:#fff"/>`);
  // front drift fading to white (no hard edge)
  s += `<path d="M0 ${y + 22} Q240 ${y - 6} 470 ${y + 24} Q640 ${y + 44} ${W} ${y + 8} L${W} ${H} L0 ${H} Z" fill="url(#snowfade${o.id || ''})"/>`;
  s += `<path d="M0 ${y + 22} Q240 ${y - 6} 470 ${y + 24} Q640 ${y + 44} ${W} ${y + 8}" fill="none" stroke="#b9d3ea" stroke-width="3"/>`;
  // trail = number line 0..1 in fourths, ticks from the formula
  const fs = o.fs ?? 30;
  s += line({ min: 0, max: 1, b: 4, x0, y, L, lab: 'all', lfs: fs, lw: 4.4 * k, th: 13 * k, thW: 17 * k,
    arcs: [[0, .25, 'solid'], [.25, .5, 'solid'], [.5, .75, 'dash']], arcH: 62 * k, arcSW: 4 * k, arcHead: 9 * k, labGap: 8 * k }).svg;
  // berry footprints where she landed (1/4 and 2/4)
  [.25, .5].forEach((v) => s += `<use href="#prints" x="${X(v) - 12 * k}" y="${y - 48 * k}" width="${24 * k}" height="${26 * k}" style="color:#c8325f"/>`);
  // Base Camp flag at 0, Cocoa Cabin at 1, Birch beside the cabin, Juniper mid-air between 2/4 and 3/4
  s += `<use href="#flag" x="${x0 - 30 * k}" y="${y - 100 * k}" width="${64 * k}" height="${85 * k}" style="--flag:#c8325f"/>`;
  s += `<use href="#cabin" x="${X(1) - 52 * k}" y="${y - 118 * k}" width="${104 * k}" height="${104 * k}" style="--door:#dcebf7;--win:#dcebf7"/>`;
  s += `<use href="#birch-wave" x="${X(1) + 40 * k}" y="${y - 62 * k}" width="${62 * k}" height="${58 * k}" style="--hat:#c8325f"/>`;
  s += `<use href="#jun-jump" x="${X(.5) + 10 * k}" y="${y - 150 * k}" width="${136 * k}" height="${105 * k}" style="--scarf:#c8325f"/>`;
  return svgBox(W, H, s, 'cover-scene');
}

  window.TRAIL = { C, IN, DEFS, frac, parseNL, fracSVG, numSVG, footSVG, arcSVG, line, nl, svgBox, paws, r2, scene };
  document.body.insertAdjacentHTML('afterbegin', DEFS);
})();
