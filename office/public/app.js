import { Office } from './office.js';
import { portrait } from './sprites.js';

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const repoUrl = (p) => `/repo/${p.split('/').map(encodeURIComponent).join('/')}`;

const STATUS = {
  working: 'กำลังทำงาน', next: 'ถึงคิว', waiting: 'รอเจ้าของร้าน', stalled: 'งานค้าง', idle: 'ว่าง',
};
const PRODUCT_STATUS = { planning: 'วางแผน', 'in-progress': 'กำลังทำ', ready: 'พร้อมขาย', published: 'ลงขายแล้ว', archived: 'เก็บแล้ว' };
const STAGE_SHORT = { research: 'RES', brief: 'BRF', plan: 'PLN', content: 'TXT', design: 'PDF', qa: 'QA', appeal: 'APL', listing: 'LST', marketing: 'MKT' };
const STEP_NO = { 'market-researcher': '1', 'creative-director': '2 และ 6', 'curriculum-designer': '3', 'content-writer': '4', 'worksheet-designer': '5', 'quality-reviewer': '6', 'tpt-listing-specialist': '7', 'marketing-specialist': '8' };

let state = null;
let selected = null;
let sheet = null; // { kind: 'member'|'product'|'report', id }
const portraits = new Map();

const office = new Office($('#office'), { onSelect: (name) => openMember(name) });

function ago(iso) {
  if (!iso) return '—';
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 45) return 'เมื่อสักครู่';
  if (s < 3600) return `${Math.round(s / 60)} นาทีที่แล้ว`;
  if (s < 86400) return `${Math.round(s / 3600)} ชม.ที่แล้ว`;
  if (s < 86400 * 30) return `${Math.round(s / 86400)} วันที่แล้ว`;
  return new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
}

function face(m) {
  if (!portraits.has(m.name)) portraits.set(m.name, portrait(m.look));
  return portraits.get(m.name);
}

const memberByName = (n) => state?.members.find((m) => m.name === n);

// --- header ---------------------------------------------------------------
function renderChips() {
  const s = state;
  const ready = (s.summary.byStatus.ready ?? 0) + (s.summary.byStatus.published ?? 0);
  const live = s.live.demo
    ? '<span class="chip live" title="ข้อมูลจำลองจาก --demo ไม่ใช่งานจริง"><b>● DEMO</b> agent จำลอง</span>'
    : s.live.available
    ? `<span class="chip live" title="อ่าน transcript จาก ${esc(s.live.dir)}"><b>● LIVE</b> ${s.live.sessions.filter((x) => x.active).length ? 'มี session ทำงานอยู่' : 'ไม่มี session ที่กำลังรัน'}</span>`
    : `<span class="chip off" title="${s.live.disabled ? 'ปิดด้วย --no-live' : 'ยังไม่เจอ transcript ของ Claude Code สำหรับ repo นี้'}"><b>○ OFFLINE</b> สถานะจากไฟล์ใน repo</span>`;
  $('#chips').innerHTML = `${live}
    <span class="chip"><b>${s.summary.working}</b> กำลังทำงาน</span>
    <span class="chip"><b>${ready}/${s.summary.products}</b> สินค้าพร้อมขาย</span>
    ${s.branch ? `<span class="chip" title="git branch">⎇ ${esc(s.branch)}</span>` : ''}
    <span class="chip" title="${esc(new Date(s.generatedAt).toLocaleString('th-TH'))}">อัปเดต ${esc(ago(s.generatedAt))}</span>`;
  $('#repo').textContent = s.repo;
}

// --- team -------------------------------------------------------------------
function renderTeam() {
  const ms = state.members;
  $('#team-count').textContent = `${ms.length} คน · ทำงาน ${state.summary.working}`;
  $('#team').innerHTML = ms.map((m) => {
    const st = m.status.state;
    return `<li><button type="button" class="member ${st}" data-member="${esc(m.name)}" aria-pressed="${selected === m.name}">
      <span class="avatar"><img src="${face(m)}" alt=""><i class="dot ${st}"></i></span>
      <span>
        <span class="m-top"><span class="m-name">${esc(m.title)}</span><span class="m-role">${esc(m.role)}</span></span>
        <span class="m-top"><span class="badge ${st}">${esc(STATUS[st] ?? st)}</span><span class="m-line ${m.status.live ? 'live' : ''}">${esc(m.status.headline)}</span></span>
      </span>
    </button></li>`;
  }).join('');
}

// --- pipeline ---------------------------------------------------------------
function liveStage(p) {
  const set = new Set();
  for (const m of state.members) if (m.status.state === 'working' && m.status.task?.slug === p.slug) set.add(m.name);
  return set;
}

function renderPipeline() {
  const ps = state.products;
  $('#pipe-count').textContent = `${ps.length} ชิ้น`;
  if (!ps.length) {
    $('#pipeline').innerHTML = '<p class="empty">ยังไม่มีสินค้า — เริ่มด้วยคำสั่ง <code>/new-tpt-product</code> ด้านขวา</p>';
  } else {
    $('#pipeline').innerHTML = ps.map((p) => {
      const live = liveStage(p);
      const cells = p.stages.map((s) => {
        const who = memberByName(s.agent);
        const cls = s.done ? 'done' : live.has(s.agent) ? 'live' : s.next ? 'next' : '';
        const tip = `${s.label} — ${who?.title ?? s.agent}${s.verdict ? ` (${s.verdict})` : ''}${s.done ? ' ✓' : s.next ? ' · ถึงคิว' : ''}`;
        return `<span class="cell ${cls}" title="${esc(tip)}" aria-label="${esc(tip)}"></span>`;
      }).join('');
      const qa = p.stages.find((s) => s.id === 'qa')?.verdict;
      const appeal = p.stages.find((s) => s.id === 'appeal')?.verdict;
      const warn = p.checks ? p.checks.warn.length + p.checks.fail.length : 0;
      return `<article class="product">
        <div class="p-head">
          ${p.files?.thumbnails?.[0] ? `<img class="p-thumb" src="${repoUrl(p.files.thumbnails[0])}" alt="" loading="lazy">` : '<span class="p-thumb" aria-hidden="true"></span>'}
          <div>
            <div class="p-title">${esc(p.title)}</div>
            <div class="p-meta">${esc([p.subject, p.grades?.length ? `ป.${p.grades.join(',')}` : null, p.theme, p.price != null ? `$${Number(p.price).toFixed(2)}` : null].filter(Boolean).join(' · '))}</div>
          </div>
        </div>
        <div class="track" role="list" aria-label="ขั้นตอน">${cells}</div>
        <div class="track-labels" aria-hidden="true">${p.stages.map((s) => `<span>${STAGE_SHORT[s.id] ?? s.id}</span>`).join('')}</div>
        <div class="p-foot">
          <span class="verdicts">
            <span class="badge ${esc(p.status)}">${esc(PRODUCT_STATUS[p.status] ?? p.status)}</span>
            ${qa ? `<span class="badge ghost" title="ผล QA">QA ${esc(qa)}</span>` : ''}
            ${appeal && appeal !== 'DONE' ? `<span class="badge ghost" title="ผล Appeal Review">APPEAL ${esc(appeal)}</span>` : ''}
            ${p.checks ? `<span class="badge ghost" title="ผลตรวจ listing">✅${p.checks.pass}${warn ? ` ⚠️${warn}` : ''}</span>` : ''}
          </span>
          <button type="button" class="link-btn" data-product="${esc(p.slug)}">รายละเอียด</button>
        </div>
      </article>`;
    }).join('');
  }
  $('#ideas').innerHTML = state.ideas.length
    ? `<h3>ไอเดียที่วิจัยไว้ (products/_ideas)</h3><ul>${state.ideas.slice(0, 5).map((i) => `<li><a href="${repoUrl(i.file)}" target="_blank" rel="noopener">${esc(i.title)}</a></li>`).join('')}</ul>`
    : '';
}

// --- feed ------------------------------------------------------------------
function renderFeed() {
  const icon = { start: '▶ เริ่มงาน', finish: '✓ ส่งงาน', error: '✕ ผิดพลาด', commit: 'commit' };
  $('#feed').innerHTML = state.feed.slice(0, 30).map((e) => {
    const m = memberByName(e.agent) ?? memberByName('project-manager');
    return `<li>
      <i class="swatch" style="background:${esc(m?.look.shirt ?? '#999')}"></i>
      <div>
        <div><b>${esc(m?.title ?? e.agent)}</b> · ${esc(e.text)}</div>
        <div class="when">${esc(ago(e.ts))}${e.slug ? ` · ${esc(e.slug)}` : ''} · <span class="src">${esc(icon[e.kind] ?? e.kind)}${e.hash ? ` ${esc(e.hash)}` : ''}</span></div>
      </div>
    </li>`;
  }).join('') || '<li class="empty">ยังไม่มีความเคลื่อนไหว</li>';
}

// --- commands ----------------------------------------------------------------
function renderCommands() {
  const topic = $('#topic').value.trim();
  const t = topic || '<หัวข้อ>';
  const cmds = [
    { label: 'สร้างสินค้าใหม่ครบทุกขั้น (PM สั่งทีมทั้ง 8 คน)', cmd: `/new-tpt-product ${t}` },
    { label: 'หาไอเดียสินค้าอย่างเดียว (Market Researcher)', cmd: `/tpt-niche-research ${t}` },
    { label: 'เปิดออฟฟิศนี้ (รันในเทอร์มินัล)', cmd: 'npm run office' },
  ];
  $('#cmds').innerHTML = cmds.map((c) => `<div class="cmd"><code><small>${esc(c.label)}</small>${esc(c.cmd)}</code><button type="button" data-copy="${esc(c.cmd)}">COPY</button></div>`).join('');
}

function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove('show'), 1800);
}

async function copy(text) {
  try { await navigator.clipboard.writeText(text); toast('คัดลอกแล้ว'); } catch {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.append(ta); ta.select();
    try { document.execCommand('copy'); toast('คัดลอกแล้ว'); } catch { toast('คัดลอกไม่ได้ — เลือกข้อความเอง'); }
    ta.remove();
  }
}

// --- sheet (dialog) -----------------------------------------------------------
const dlg = $('#sheet');

function cmdBox(label, cmd) {
  return `<div class="cmd"><code><small>${esc(label)}</small>${esc(cmd)}</code><button type="button" data-copy="${esc(cmd)}">COPY</button></div>`;
}

function memberSheet(m) {
  const s = m.status;
  const run = s.lastRun;
  const feed = state.feed.filter((e) => e.agent === m.name || e.agents?.includes(m.name)).slice(0, 8);
  const hints = m.isPM
    ? cmdBox('สั่งทำสินค้าใหม่', `/new-tpt-product ${$('#topic').value.trim() || '<หัวข้อ>'}`)
    : m.name === 'market-researcher'
      ? cmdBox('หาไอเดียอย่างเดียว', `/tpt-niche-research ${$('#topic').value.trim() || '<หัวข้อ>'}`)
      : `<p class="hint">ถูกเรียกโดย PM ในขั้นที่ ${esc(STEP_NO[m.name] ?? '—')} ของ <code>/new-tpt-product</code> · คำสั่งงานอยู่ที่ <code>${esc(m.file)}</code></p>`;
  return `
    <div class="who">
      <img class="portrait-lg" src="${face(m)}" alt="">
      <div>
        <div><span class="badge ${s.state}">${esc(STATUS[s.state] ?? s.state)}</span> ${s.live ? '<span class="badge ghost">LIVE</span>' : ''}</div>
        <p style="margin-top:6px">${esc(s.headline)}</p>
      </div>
    </div>
    <p>${esc(m.description)}</p>
    ${m.tools?.length ? `<div><h3>เครื่องมือที่ใช้ได้</h3><div class="tools">${m.tools.map((t) => `<span>${esc(t)}</span>`).join('')}</div></div>` : ''}
    ${s.activity ? `<div><h3>กำลังทำตอนนี้</h3><dl class="kv"><dt>เครื่องมือ</dt><dd>${esc(s.activity.tool)}${s.activity.detail ? ` — ${esc(s.activity.detail)}` : ''}</dd><dt>เมื่อ</dt><dd>${esc(ago(s.activity.at))}</dd></dl></div>` : ''}
    ${run ? `<div><h3>งานล่าสุดที่ได้รับมอบหมาย (จาก Claude Code)</h3><dl class="kv">
      <dt>งาน</dt><dd>${esc(run.task || '—')}</dd>
      ${run.slug ? `<dt>สินค้า</dt><dd>${esc(run.slug)}</dd>` : ''}
      <dt>เริ่ม</dt><dd>${esc(ago(run.startedAt))}</dd>
      <dt>สถานะ</dt><dd>${esc({ working: 'กำลังทำ', done: run.error ? 'จบแบบมีข้อผิดพลาด' : `ส่งงานแล้ว ${ago(run.endedAt)}`, stalled: 'ค้าง ไม่มีความเคลื่อนไหว' }[run.state] ?? run.state)}</dd>
      ${run.toolCount ? `<dt>ใช้เครื่องมือ</dt><dd>${run.toolCount} ครั้ง</dd>` : ''}
    </dl></div>` : ''}
    ${s.queue?.length ? `<div><h3>งานที่รออยู่</h3><ul>${s.queue.map((q) => `<li>${esc(q.label ?? q.stage)} — ${esc(q.title ?? q.slug)}</li>`).join('')}</ul></div>` : ''}
    ${s.done?.length ? `<div><h3>ผลงานในร้าน (${s.done.length})</h3><ul>${s.done.map((d) => `<li>${esc(d.label)} — ${esc(d.slug)}${d.verdict && d.verdict !== 'DONE' ? ` <span class="badge ghost">${esc(d.verdict)}</span>` : ''}</li>`).join('')}</ul></div>` : ''}
    ${feed.length ? `<div><h3>ประวัติล่าสุด</h3><ul>${feed.map((e) => `<li>${esc(e.text)} <span class="p-meta">· ${esc(ago(e.ts))}</span></li>`).join('')}</ul></div>` : ''}
    <div>${hints}</div>`;
}

function productSheet(p) {
  const f = p.files ?? {};
  const links = [
    f.pdf && ['PDF เต็ม', f.pdf], f.preview && ['Preview PDF', f.preview], f.listingPreview && ['หน้าจำลอง listing', f.listingPreview], f.overview && ['ภาพรวมทุกหน้า', f.overview],
  ].filter(Boolean);
  const todo = [];
  if (p.checks) for (const w of [...p.checks.fail, ...p.checks.warn]) todo.push(w);
  if (p.status === 'ready') todo.push('ตรวจ PDF ด้วยตาตัวเอง อัปโหลดขึ้น TPT แล้วเปลี่ยน status ใน catalog เป็น published');
  return `
    <p class="p-meta">${esc(p.slug)}${p.date ? ` · เริ่ม ${esc(p.date)}` : ''}${p.series ? ` · series: ${esc(p.series)}` : ''}${p.uncataloged ? ' · ยังไม่อยู่ใน catalog.json' : ''}</p>
    <dl class="kv">
      <dt>สถานะ</dt><dd><span class="badge ${esc(p.status)}">${esc(PRODUCT_STATUS[p.status] ?? p.status)}</span></dd>
      ${p.concept ? `<dt>คอนเซปต์</dt><dd>${esc(p.concept)}</dd>` : ''}
      ${p.theme ? `<dt>ธีม</dt><dd>${esc(p.theme)}</dd>` : ''}
      ${p.hero ? `<dt>Hero activity</dt><dd>${esc(p.hero)}</dd>` : ''}
      ${p.price != null ? `<dt>ราคา</dt><dd>$${Number(p.price).toFixed(2)}</dd>` : ''}
    </dl>
    <div><h3>ขั้นตอน</h3><ul>${p.stages.map((s) => {
      const who = memberByName(s.agent);
      return `<li>${s.done ? '✅' : s.next ? '🟧' : '⬜'} ${esc(s.label)} — ${esc(who?.title ?? s.agent)}${s.verdict && s.verdict !== 'DONE' ? ` <span class="badge ghost">${esc(s.verdict)}</span>` : ''}</li>`;
    }).join('')}</ul></div>
    ${f.thumbnails?.length ? `<div><h3>Thumbnails</h3><div class="thumbs">${f.thumbnails.map((t) => `<a href="${repoUrl(t)}" target="_blank" rel="noopener"><img src="${repoUrl(t)}" alt="${esc(t.split('/').pop())}" loading="lazy"></a>`).join('')}</div></div>` : ''}
    ${links.length ? `<div><h3>ไฟล์</h3><div class="files">${links.map(([l, h]) => `<a href="${repoUrl(h)}" target="_blank" rel="noopener">${esc(l)}</a>`).join('')}</div></div>` : ''}
    ${f.docs?.length ? `<div><h3>เอกสารของทีม</h3><div class="files">${f.docs.map((d) => `<a href="${repoUrl(d)}" target="_blank" rel="noopener">${esc(d.split('/').pop())}</a>`).join('')}</div></div>` : ''}
    ${todo.length ? `<div><h3>สิ่งที่เจ้าของร้านต้องทำ</h3><ul>${todo.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>` : ''}
    <div class="cmd-list">
      ${cmdBox('สร้างหน้าจำลอง listing + ตรวจใหม่', `node scripts/listing-preview.mjs products/${p.slug}`)}
      ${cmdBox('สร้าง PDF ใหม่', `node scripts/build-pdf.mjs products/${p.slug}/worksheet.html products/${p.slug}/output/${p.slug}.pdf`)}
    </div>`;
}

function renderSheet() {
  if (!sheet || !state) return;
  let title = ''; let html = '';
  if (sheet.kind === 'member') {
    const m = memberByName(sheet.id);
    if (!m) return;
    title = `${m.title} · ${m.role}`; html = memberSheet(m);
  } else if (sheet.kind === 'product') {
    const p = state.products.find((x) => x.slug === sheet.id);
    if (!p) return;
    title = p.title; html = productSheet(p);
  } else if (sheet.kind === 'report') {
    title = 'Variety report'; html = sheet.html;
  }
  $('#sheet-title').textContent = title;
  if ($('#sheet-body').dataset.html !== html) { $('#sheet-body').innerHTML = html; $('#sheet-body').dataset.html = html; }
}

function openSheet(s) {
  sheet = s;
  $('#sheet-body').dataset.html = '';
  renderSheet();
  if (!dlg.open) dlg.showModal();
}

function openMember(name) {
  selected = name;
  office.select(name);
  renderTeam();
  openSheet({ kind: 'member', id: name });
}

dlg.addEventListener('close', () => { sheet = null; });
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
$('#sheet-close').addEventListener('click', () => dlg.close());

async function openVariety() {
  openSheet({ kind: 'report', html: '<p class="hint">กำลังรัน <code>node scripts/variety-report.mjs 10</code> …</p>' });
  try {
    const r = await (await fetch('/api/variety?n=10')).json();
    if (sheet?.kind === 'report') { sheet.html = `<pre class="report">${esc(r.output)}</pre>`; renderSheet(); }
  } catch {
    if (sheet?.kind === 'report') { sheet.html = '<p>รันรายงานไม่ได้ — เซิร์ฟเวอร์ยังเปิดอยู่หรือไม่?</p>'; renderSheet(); }
  }
}

// --- events ------------------------------------------------------------------
document.addEventListener('click', (e) => {
  const c = e.target.closest('[data-copy]');
  if (c) return copy(c.dataset.copy);
  const m = e.target.closest('[data-member]');
  if (m) return openMember(m.dataset.member);
  const p = e.target.closest('[data-product]');
  if (p) return openSheet({ kind: 'product', id: p.dataset.product });
});
$('#topic').addEventListener('input', () => { renderCommands(); renderSheet(); });
$('#variety-btn').addEventListener('click', openVariety);

function apply(next) {
  state = next;
  office.setState(state);
  renderChips();
  renderTeam();
  renderPipeline();
  renderFeed();
  renderSheet();
}

function connect() {
  if (!('EventSource' in window)) return poll();
  const es = new EventSource('/api/events');
  es.addEventListener('state', (e) => apply(JSON.parse(e.data)));
  es.onerror = () => {
    if (state) $('#chips').querySelector('.chip')?.replaceWith(Object.assign(document.createElement('span'), { className: 'chip off', innerHTML: '<b>○</b> กำลังเชื่อมต่อใหม่…' }));
  };
}

async function poll() {
  try { apply(await (await fetch('/api/state')).json()); } catch { /* server down */ }
  setTimeout(poll, 4000);
}

renderCommands();
fetch('/api/state').then((r) => r.json()).then(apply).catch(() => {
  $('#pipeline').innerHTML = '<p class="empty">ต่อเซิร์ฟเวอร์ไม่ได้ — รัน <code>npm run office</code> ในโฟลเดอร์ repo</p>';
});
connect();
setInterval(() => { if (state) { renderChips(); renderFeed(); } }, 30000);
