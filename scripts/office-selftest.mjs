// office-selftest.mjs — ทดสอบตัวรวมสถานะของ TPT-Office Live ด้วยเหตุการณ์จำลอง
// รัน: node scripts/office-selftest.mjs  (ไม่แตะไฟล์จริง)
import assert from 'node:assert/strict';
import { createLive, applyEvent, snapshot, qaVerdict, appealVerdict } from './office-state.mjs';
import { normalize, findSlug } from './office-hook.mjs';

const T0 = Date.parse('2026-11-11T10:00:00Z');
const at = (min) => new Date(T0 + min * 60000).toISOString();
const S = 'sess1';
const live = createLive();
const ev = (min, e) => applyEvent(live, { ts: at(min), session: S, ...e });
const prod = (over = {}) => [{ slug: 'halloween-sub', status: 'in-progress', title: 'Halloween', stages: ['research','brief','plan','content','design','qa','listing','marketing'].map(id => ({ id, done: ['research','brief','plan'].includes(id) })), qa: null, appeal: null, rework: false, ...over }];
const card = (snap, id) => snap.team.find(a => a.id === id);

// hook normalize + slug
assert.equal(findSlug('Product: halloween-sub\nwrite stuff'), 'halloween-sub');
assert.equal(findSlug('read products/abc-1/02-plan.md'), 'abc-1');
assert.equal(findSlug('products/catalog.json'), undefined);
const n = normalize({ hook_event_name: 'PreToolUse', session_id: S, tool_name: 'Agent', tool_use_id: 'tu1', tool_input: { subagent_type: 'content-writer', description: 'Write content', prompt: 'Product: halloween-sub' } });
assert.equal(n.subagent_type, 'content-writer'); assert.equal(n.slug, 'halloween-sub');
const syn = normalize({ hook_event_name: 'UserPromptSubmit', session_id: S, prompt: '<agent-message from="x">done</agent-message>' });
assert.equal(syn.synthetic, true);

// verdict parsers
assert.equal(qaVerdict('**ผลการตรวจ:** **PASS WITH FIXES** (x)'), 'PASS WITH FIXES');
assert.equal(qaVerdict('**Verdict:** FAIL'), 'FAIL');
assert.equal(appealVerdict('## Appeal Review\n\n### ผล: **REVISE (x)'), 'REVISE');
assert.equal(appealVerdict('no appeal section ผล: **PASS'), null);

// 1) owner starts pipeline
ev(0, { event: 'UserPromptSubmit', message: '/new-tpt-product halloween' });
let s = snapshot(live, prod(), T0 + 30000);
assert.equal(card(s, 'pm').state, 'working');

// 2) PM launches content-writer (background): Pre → Start → Post immediately
ev(1, { event: 'PreToolUse', tool: 'Agent', tool_use_id: 'a', subagent_type: 'content-writer', slug: 'halloween-sub', description: 'Write content' });
ev(1, { event: 'SubagentStart', agent_id: 'w1', agent_type: 'content-writer' });
ev(1, { event: 'PostToolUse', tool: 'Agent', tool_use_id: 'a', subagent_type: 'content-writer', slug: 'halloween-sub' });
ev(2, { event: 'PreToolUse', agent_id: 'w1', agent_type: 'content-writer', tool: 'Write', summary: 'Write halloween-sub/03-content.md', slug: 'halloween-sub' });
ev(2, { event: 'Stop' }); // PM turn ends while agent works in background
s = snapshot(live, prod(), T0 + 2.5 * 60000);
assert.equal(card(s, 'content-writer').state, 'working');
assert.equal(card(s, 'content-writer').slug, 'halloween-sub');
assert.equal(card(s, 'pm').state, 'supervising');
assert.ok(s.products[0].stages.find(x => x.id === 'content').active);

// 3) stall: no events for 15 min
s = snapshot(live, prod(), T0 + 17 * 60000);
assert.equal(card(s, 'content-writer').state, 'stalled');

// 4) writer finishes → done flash, PM waiting (pipeline open, turn ended)
ev(18, { event: 'SubagentStop', agent_id: 'w1', agent_type: 'content-writer' });
s = snapshot(live, prod(), T0 + 18.5 * 60000);
assert.equal(card(s, 'content-writer').state, 'done');
assert.equal(card(s, 'pm').state, 'waiting');
s = snapshot(live, prod(), T0 + 30 * 60000);
assert.equal(card(s, 'content-writer').state, 'idle');

// 5) parallel QA + CD, QA rounds counted
ev(31, { event: 'UserPromptSubmit', message: '<agent-message from="w1">done</agent-message>' });
for (const [i, t] of [['q','quality-reviewer'],['c','creative-director']]) {
  ev(32, { event: 'PreToolUse', tool: 'Agent', tool_use_id: i, subagent_type: t, slug: 'halloween-sub' });
}
ev(32, { event: 'SubagentStart', agent_id: 'q1', agent_type: 'quality-reviewer' });
ev(32, { event: 'SubagentStart', agent_id: 'c1', agent_type: 'creative-director' });
s = snapshot(live, prod(), T0 + 33 * 60000);
assert.equal(card(s, 'quality-reviewer').state, 'working');
assert.equal(card(s, 'creative-director').state, 'working');
assert.equal(card(s, 'creative-director').slug, 'halloween-sub');
assert.equal(card(s, 'quality-reviewer').qaRound, 1);
assert.ok(!s.timeline.some(t => t.text.includes('agent-message')), 'synthetic prompt not in timeline as owner');
ev(40, { event: 'SubagentStop', agent_id: 'q1' });
ev(40, { event: 'SubagentStop', agent_id: 'c1' });

// 6) QA FAIL → writer shows rework
s = snapshot(live, prod({ qa: 'FAIL', rework: true }), T0 + 60 * 60000);
assert.equal(card(s, 'content-writer').state, 'rework');

// 7) StopFailure → PM error; SessionEnd interrupts running agents
ev(61, { event: 'PreToolUse', tool: 'Agent', tool_use_id: 'd', subagent_type: 'worksheet-designer', slug: 'halloween-sub' });
ev(61, { event: 'SubagentStart', agent_id: 'd1', agent_type: 'worksheet-designer' });
ev(62, { event: 'StopFailure', error: 'rate_limit' });
s = snapshot(live, prod(), T0 + 62.5 * 60000);
assert.equal(card(s, 'pm').state, 'error');
ev(63, { event: 'SessionEnd', reason: 'other' });
s = snapshot(live, prod(), T0 + 64 * 60000);
assert.equal(card(s, 'worksheet-designer').state, 'error');
assert.equal(card(s, 'pm').state, 'idle');

// 8) unknown subagent (server started mid-run) & guest agents
applyEvent(live, { ts: at(70), session: 'sess2', event: 'PreToolUse', agent_id: 'x9', agent_type: 'Explore', tool: 'Read', summary: 'Read x' });
s = snapshot(live, prod(), T0 + 70.2 * 60000);
assert.equal(s.guests[0].role, 'Explore'); assert.equal(s.guests[0].state, 'working');
console.log('ALL OK —', s.timeline.length, 'timeline items');
console.log(s.timeline.slice(0, 6).map(t => t.text).join('\n'));
