/* Browser checks for Little Reader. Run: npm test
   Needs Playwright (dev only, never shipped): npm install && npx playwright install chromium
   Serves the repo itself, opens it at the Fire HD 10's real size (1280 x 614 landscape, 800 x 1094 portrait)
   with reduced motion on, as the tablet has it. The tablet's speech engine is replaced by a stand-in. */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.woff2':'font/woff2', '.ttf':'font/ttf', '.md':'text/plain', '.mp3':'audio/mpeg' };
const server = http.createServer((req, res) => {
  const file = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/^\/$/, '/index.html'));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

let failed = 0;
const ok = (c, m) => { if (!c) failed++; console.log((c ? 'PASS ' : 'FAIL ') + m); };

(async () => {
  await new Promise(r => server.listen(0, r));
  const U = 'http://localhost:' + server.address().port + '/index.html';
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 614 }, reducedMotion: 'reduce', hasTouch: true, acceptDownloads: true });
  const p = await ctx.newPage();
  const errs = [], hosts = new Set();
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text()); });
  p.on('request', r => hosts.add(new URL(r.url()).host));
  let dialog = false; p.on('dialog', d => { dialog = true; d.dismiss(); });
  // A stand-in for the tablet's speech engine: records each utterance and when it was requested.
  // __tts.endMs sets how long speaking takes; __tts.never = true means onend never fires (to test the watchdog).
  await p.addInitScript(() => {
    const tts = window.__tts = { calls: [], endMs: 20, never: false };
    function Utterance(text){ this.text = text; }
    const synth = {
      speaking: false, pending: false, onvoiceschanged: null, _u: null,
      getVoices(){ return [{ name: 'English United States', lang: 'en_US', voiceURI: 'en-us' }]; },
      speak(u){
        tts.calls.push({ text: u.text, t: performance.now() });
        this._u = u; this.speaking = true;
        setTimeout(() => { if (this._u === u && u.onstart) u.onstart({}); }, 3);
        if (tts.never) return;
        setTimeout(() => { if (this._u !== u) return; this._u = null; this.speaking = false; if (u.onend) u.onend({}); }, tts.endMs);
      },
      cancel(){ this._u = null; this.speaking = false; }
    };
    Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
    window.SpeechSynthesisUtterance = Utterance;
  });
  const said = () => p.evaluate(() => __tts.calls.map(c => c.text).filter(t => t.trim()));
  const clearSaid = () => p.evaluate(() => { __tts.calls.length = 0; });
  const touch = () => p.mouse.click(640, 5);
  const seed = async (state) => {
    await p.goto(U + '#home');
    await p.evaluate(s => { localStorage.clear(); if (s) localStorage.setItem('littleReader.v1', JSON.stringify(s)); }, state || null);
    await p.reload();
  };
  const today = () => p.evaluate(() => LR.progress.today());
  const item = () => p.evaluate(() => { const r = LR.state.resume, st = r && r.steps[r.at[0]]; return { step: st && st.id, at: r && r.at, it: st && st.items[r.at[1]] }; });
  const startSession = async () => { await p.goto(U + '#home'); await touch(); await p.click('[data-act=start]'); await p.waitForTimeout(60); };
  const waitAt = (at) => p.waitForFunction(a => { const r = LR.state.resume; return r && (r.at[0] !== a[0] || r.at[1] !== a[1]); }, at, { timeout: 8000 });
  const height = () => p.evaluate(() => document.documentElement.scrollHeight);
  /* Answers the current item correctly, as a child would, with answer taps only. */
  const answer = async () => {
    const c = await item();
    if (c.step === 'garden') { await p.waitForSelector('[data-act=done]:not([disabled])'); await p.click('[data-act=done]'); return c; }
    const it = c.it;
    if (it.t === 'find') await p.click(`.s-card[data-w="${it.w}"]`);
    else if (it.t === 'tricky') {
      await p.waitForSelector('.lbtn, .s-main .chip', { timeout: 5000 });
      for (const k of await p.evaluate(w => LR.words.heartsFor(w), it.w)) await p.click(`.lbtn[data-i="${k}"]`);
    }
    else if (it.t === 'read') { await p.waitForSelector('[data-act=check]:not([disabled])'); await p.click('[data-act=check]'); }
    else if (it.t === 'croc') {
      if (it.m === 'more') await p.click(`[data-act=num][data-side="${it.a > it.b ? 'a' : 'b'}"]`);
      else await p.click(`[data-act=sym][data-s="${it.a > it.b ? '>' : '<'}"]`);
    }
    await waitAt(c.at);
    return c;
  };
  const d = (s, n) => p.evaluate(([s, n]) => LR.progress.addDays(s, n), [s, n]);

  // ---------- Home ----------
  await seed();
  ok(await p.$$eval('#app [data-act=start]', x => x.length) === 1, 'Home has one Start');
  ok(await p.$$eval('#app .s-target', x => x.length) === 1, 'Home has one primary target');
  ok(await p.$eval('.garden', g => g.dataset.flowers) === '0', 'a new garden has no flowers yet');
  ok(/6 sprouts/.test(await p.$eval('.garden', g => g.getAttribute('aria-label'))), 'the words she is learning show as sprouts');
  ok((await said()).length === 0, 'nothing is spoken before the first touch');
  ok(!(await p.isVisible('#bar')), 'the top bar is hidden on the child screens');
  ok(await p.evaluate(() => LR.state.unit === 'p4-01' && ['come', 'some', 'from', 'have', 'many', 'also'].every(w => LR.state.items['w:' + w].b === 1)), 'a new install starts at unit p4-01 with her known tricky words in review');

  // ---------- A full session with answer taps only ----------
  await startSession();
  const path1 = await p.$$eval('.s-step', x => x.map(s => s.getAttribute('aria-label')));
  const kinds = [];
  for (let i = 0; i < 40; i++) {
    if (await p.evaluate(() => location.hash) === '#home') break;
    const c = await answer();
    kinds.push(c.step);
  }
  const order = kinds.filter((k, i) => k !== kinds[i - 1]);
  ok(order.join(',') === 'words,tricky,read,maths,garden', 'a session runs its steps in order: ' + order.join(','));
  ok(path1.length === 5 && /now/.test(path1[0]), 'the path shows the steps, the first one now: ' + path1.join(' / '));
  ok(await p.evaluate(() => location.hash) === '#home', 'the session ends back at Home, using answer taps only');
  const day = await p.evaluate(() => LR.state.days.slice(-1)[0]);
  ok(day && day.n >= 6 && day.r === day.n, 'the day is recorded with first-try accuracy: ' + JSON.stringify(day));
  ok(await p.evaluate(() => !!LR.state.stories['p4-01a']), 'the story read is recorded');
  ok((await p.textContent('.s-note')) === 'See you tomorrow!' && (await p.textContent('[data-act=start]')).includes('Play more'), 'after the session Home says See you tomorrow and offers Play more');
  await p.click('[data-act=start]'); await p.waitForTimeout(80);
  ok(await p.evaluate(() => LR.state.resume.mode === 'extra' && LR.state.resume.steps.map(s => s.id).join() === 'words,garden'), 'Play more runs extra word practice');

  // ---------- No mode switch, no navigation on any child screen ----------
  await seed(); await startSession();
  const found = [];
  for (let i = 0; i < 40 && await p.evaluate(() => location.hash) !== '#home'; i++) {
    found.push(...await p.$$eval('#app [data-act]', x => x.map(e => e.dataset.act).filter(a => ['mode', 'prev', 'next', 'nextc', 'tried', 'read'].includes(a))));
    found.push(...await p.$$eval('#app', x => x.map(e => e.textContent).filter(t => /Together|My turn|Read it to me/.test(t))));
    await answer();
  }
  ok(found.length === 0, 'no mode switch, no "Read it to me" and no navigation controls: ' + found.join(','));

  // ---------- Find it ----------
  const t0 = await (await p.evaluateHandle(() => LR.progress.today())).jsonValue();
  const s2 = (items, extra) => Object.assign({ schema: 2, unit: 'p4-01', items, flowers: [], confusions: {}, stories: {}, days: [], rate: 0.9 }, extra || {});
  await seed(s2({ 'w:come': { b: 2, d: t0 } }, { confusions: { come: { cone: 3, came: 1 } } }));
  await startSession();
  let c = await item();
  const cards = await p.$$eval('.s-card', x => x.map(e => e.dataset.w));
  ok(c.it.w === 'come' && cards.includes('cone') && cards.includes('came'), 'Find it uses her past mix-ups as the distractors: ' + cards);
  ok((await p.textContent('[data-caption]')) !== 'come', 'the caption never shows the word to find');
  ok(await p.$$eval('#app .s-target', x => x.length) === 0, 'Find it has no primary target: all cards share one style');
  const same = await p.$$eval('.s-card', x => new Set(x.map(e => getComputedStyle(e).backgroundColor + getComputedStyle(e).borderColor)).size);
  ok(same === 1, 'the answer cards look the same before she chooses');
  await p.click('.s-card[data-w="cone"]'); await p.waitForTimeout(40);
  ok(await p.evaluate(() => LR.state.confusions.come.cone === 4 && LR.state.items['w:come'].b === 1), 'a wrong pick is saved as a mix-up and moves the word down a box');
  ok(await p.$eval('.s-card[data-w="cone"]', e => e.disabled && e.classList.contains('fb-wrong')), 'the wrong card is dimmed and disabled');
  ok(await p.$eval('.guide', g => g.dataset.pose) === 'thinking', 'the guide looks thoughtful after a miss');
  await p.click('.s-card[data-w="came"]');
  await waitAt(c.at);
  ok(await p.evaluate(() => LR.state.items['w:come'].b === 1), 'after 2 misses the answer is shown and she moves on, without moving up');
  ok((await said()).some(t => /This one says come/.test(t)), 'the answer is said after 2 misses');

  const firstLetter = await p.evaluate(() => {
    const ws = LR.knownTricky.concat(...LR.units.map(u => u.words.concat(u.tricky)));
    return ws.filter(w => !LR.words.lookalikes(w, [], [], 2).some(x => x.charAt(0) === w.charAt(0)));
  });
  ok(firstLetter.length === 0, 'every word has a look-alike with the same first letter, so first-letter guessing fails' + (firstLetter.length ? ': ' + firstLetter : ''));

  // ---------- New tricky word ----------
  /* All of unit 1's words are known and not due, so nothing is reviewed today. */
  const later = await d(t0, 5), unitWords = {};
  for (const w of await p.evaluate(() => LR.units[0].words)) unitWords['w:' + w] = { b: 2, d: later };
  await seed(s2(Object.assign({ 'w:come': { b: 2, d: later } }, unitWords))); await startSession();
  c = await item();
  ok(c.step === 'tricky' && c.it.w === 'said', 'with nothing due, the session starts with the new tricky word: ' + JSON.stringify(c));
  await p.waitForSelector('.lbtn');
  ok((await said()).slice(-4).join('|').includes('ess, ay, eye, dee'), 'say-spell-say names the letters');
  await p.click('.lbtn[data-i="0"]'); await p.waitForTimeout(30);
  ok(await p.$eval('.lbtn[data-i="0"]', e => e.classList.contains('plain') && e.classList.contains('fb-wrong')), 'a plain letter dims');
  await p.click('.lbtn[data-i="1"]'); await p.click('.lbtn[data-i="2"]');
  await p.waitForSelector('.s-main .chip');
  ok((await said()).some(t => t.startsWith('Same trick: again')), 'after the heart letters, its family is shown and said');
  await waitAt(c.at);
  ok(await p.evaluate(() => LR.state.items['w:said'] && LR.state.items['w:said'].b === 0), 'the new tricky word goes into review');

  // ---------- Read with me ----------
  await seed(s2(Object.assign({ 'w:come': { b: 2, d: later }, 'w:said': { b: 2, d: later }, 'w:like': { b: 2, d: later }, 'w:the': { b: 3, d: later } }, unitWords)));
  await startSession();
  c = await item();
  ok(c.step === 'read', 'Read with me: ' + JSON.stringify(c));
  await clearSaid();
  await p.waitForSelector('[data-act=check]:not([disabled])');
  const sentence = await p.$eval('.s-sentence', e => e.textContent);
  ok(!(await said()).includes(sentence), 'the sentence is not read to her before she reads it');
  ok(await p.$$eval('#app .s-target:not(.off)', x => x.length) === 1, 'the tick is the one primary target once the instruction is said');
  ok(await p.$eval('.s-sentence .w[data-w="the"]', w => !w.querySelector('.h')), 'a mastered word shows no heart marks');
  await p.click('.s-sentence .w[data-w="frog"]'); await p.waitForTimeout(40);
  ok(await p.evaluate(() => LR.state.items['w:frog'] && LR.state.items['w:frog'].m === 1), 'a grown-up tap on a word marks it (stumbled)');
  await clearSaid(); await p.evaluate(() => { __tts.endMs = 500; });
  await p.click('[data-act=check]');
  const lit = [];
  for (let i = 0; i < 12; i++) { lit.push(await p.evaluate(() => [...document.querySelectorAll('.s-sentence .w')].findIndex(w => w.classList.contains('say')))); await p.waitForTimeout(40); }
  await p.click('[data-act=check]', { force: true }).catch(() => {});
  await waitAt(c.at);
  await p.evaluate(() => { __tts.endMs = 20; });
  const seq = lit.filter((x, i) => x >= 0 && x !== lit[i - 1]);
  ok((await said()).filter(t => t === sentence).length === 1, 'the tick plays the sentence once, as one utterance');
  ok(seq.length >= 2 && seq.every((x, i) => !i || x > seq[i - 1]), 'words light in order while it plays: ' + seq.join(','));
  // Not today: a quick tap does nothing; a 2 s hold ends the step
  await p.click('[data-act=skip]'); await p.waitForTimeout(40);
  ok((await item()).step === 'read', 'a quick tap on Not today does not skip');
  const box = await p.$eval('[data-act=skip]', e => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  await p.mouse.move(box.x, box.y); await p.mouse.down(); await p.waitForTimeout(2150); await p.mouse.up(); await p.waitForTimeout(60);
  ok((await item()).step === 'maths', 'a 2 s hold on Not today ends Read with me');
  ok(await p.evaluate(() => !LR.state.stories['p4-01a']), 'a skipped story is offered first next time');

  // ---------- Maths ----------
  c = await item();
  const wrongSide = c.it.m === 'more' ? `[data-act=num][data-side="${c.it.a > c.it.b ? 'b' : 'a'}"]` : `[data-act=sym][data-s="${c.it.a > c.it.b ? '<' : '>'}"]`;
  await p.click(wrongSide); await p.waitForTimeout(30);
  ok(await p.$eval(wrongSide, e => e.classList.contains('fb-wrong')), 'a wrong maths answer is dimmed');
  if (c.it.m === 'more') await answer(); else await waitAt(c.at);
  ok(true, 'maths moves on');

  // ---------- Re-prompts ----------
  await seed(s2({ 'w:come': { b: 2, d: t0 } })); await startSession();
  await clearSaid();
  await p.evaluate(() => { LR.session.IDLE_MS = 150; });
  await p.click('[data-act=hear]');
  await p.waitForSelector('[data-act=goon]', { timeout: 5000 });
  ok((await said()).filter(t => t === 'come').length === 4, 'with no tap the instruction is said again 3 times, then Go on: ' + (await said()).join('|'));
  ok(await p.$$eval('#app .s-target', x => x.length) === 1, 'Go on is the one target');
  await p.click('[data-act=goon]'); await p.waitForTimeout(40);
  ok(await p.$$eval('.s-card', x => x.length) === 3, 'Go on brings the item back');
  await p.evaluate(() => { LR.session.IDLE_MS = 8000; });

  // ---------- Leaving and resuming ----------
  await seed(); await startSession();
  await answer(); await answer();
  const at = (await item()).at;
  const hb = await p.$eval('[data-act=home]', e => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  await p.mouse.click(hb.x, hb.y); await p.waitForTimeout(60);
  ok(await p.evaluate(() => location.hash) === '#session', 'a quick tap on Home does not leave');
  ok((await said()).includes('Hold to go home'), 'a quick tap on Home says to hold it');
  await p.mouse.move(hb.x, hb.y); await p.mouse.down(); await p.waitForTimeout(1150); await p.mouse.up(); await p.waitForTimeout(60);
  ok(await p.evaluate(() => location.hash) === '#home', 'holding Home for 1 s leaves the session');
  await p.reload(); await startSession();
  ok(JSON.stringify((await item()).at) === JSON.stringify(at), 'after leaving and reloading, Start resumes at the same item');
  await p.evaluate(() => { LR.state.resume.date = LR.progress.addDays(LR.progress.today(), -1); LR.state.last = LR.state.resume.date; LR.store.save(); });
  await p.reload(); await startSession();
  ok(await p.evaluate(() => LR.state.resume.date === LR.progress.today() && LR.state.resume.at.join() === '0,0'), 'the next day a new session is planned');

  // ---------- Time budget ----------
  await seed(); await startSession();
  await p.evaluate(() => { const r = LR.state.resume; r.started = Date.now() - 13 * 60000; r.at = [r.at[0] + 1, 0]; LR.store.save(); });
  await p.goto(U + '#home'); await p.click('[data-act=start]'); await p.waitForTimeout(60);
  const cut = await p.evaluate(() => { const r = LR.state.resume; return r.steps.filter((s, i) => i >= r.at[0] && s.id !== 'read' && s.id !== 'garden').map(s => s.items.length); });
  ok(cut.length && cut[0] === 1, 'after 12 minutes the next step keeps one item: ' + cut);

  // ---------- Scheduler ----------
  const sched = await p.evaluate(() => {
    const P = LR.progress, t = P.today(), out = {};
    LR.state.items = {}; LR.state.flowers = [];
    P.ensure('w:jump');
    P.right('w:jump'); P.right('w:jump');
    out.onceADay = LR.state.items['w:jump'].b === 1;
    out.interval1 = LR.state.items['w:jump'].d === P.addDays(t, 1);
    LR.state.items['w:jump'].u = 'x'; P.right('w:jump'); LR.state.items['w:jump'].u = 'x';
    out.grew = P.right('w:jump');
    out.interval3 = LR.state.items['w:jump'].d === P.addDays(t, 4);
    out.flower = LR.state.flowers.length === 1;
    P.miss('w:jump');
    out.missDown = LR.state.items['w:jump'].b === 2 && LR.state.items['w:jump'].d === t && LR.state.flowers.length === 1;
    LR.state.items['w:x'] = { b: 0, d: t, u: '', m: 0 }; P.miss('w:x');
    out.floor = LR.state.items['w:x'].b === 0;
    const last = LR.state.last; LR.state.last = P.addDays(P.localDate(), 9);
    out.clockBack = P.today() === LR.state.last;
    LR.state.last = last;
    // 1 weak for every 3 known
    LR.state.items = {};
    ['aa', 'bb'].forEach(w => LR.state.items['w:' + w] = { b: 0, d: t, u: '', m: 0 });
    ['cc', 'dd', 'ee', 'ff', 'gg', 'hh'].forEach(w => LR.state.items['w:' + w] = { b: 2, d: t, u: '', m: 0 });
    LR.state.unit = 'p4-04'; LR.units[3].words.forEach(w => LR.state.items['w:' + w] = { b: 3, d: P.addDays(t, 3), u: '', m: 0 });
    const plan = P.planWords(10).map(w => LR.state.items['w:' + w].b);
    out.plan = plan.join('');
    out.ratio = plan.slice(0, 4).filter(x => x <= 1).length === 1 && plan.filter(x => x <= 1).length <= Math.ceil(plan.length / 4) + 1;
    LR.state.unit = 'p4-01';
    return out;
  });
  ok(sched.onceADay && sched.interval1, 'right twice in a day moves up only once, due in 1 day');
  ok(sched.grew && sched.interval3 && sched.flower, 'reaching box 3 grows a flower and is due in 4 days');
  ok(sched.missDown && sched.floor, 'a miss moves down one box (never below 0) and the flower stays');
  ok(sched.clockBack, 'a clock moved back does not move "today" back');
  ok(sched.ratio, 'review mixes about 1 weak word for every 3 known ones: ' + sched.plan);
  const pace = await p.evaluate(() => {
    const P = LR.progress, y = P.addDays(P.today(), -1), r = [];
    [[20, 15], [20, 9], [20, 7]].forEach(([n, ok]) => { LR.state.days = [{ d: y, n, r: ok, mins: 10 }]; r.push(P.newTrickyCount()); });
    return r.join(',');
  });
  ok(pace === '2,1,0', 'new tricky words per day follow yesterday\'s accuracy (75%, 45%, 35%): ' + pace);
  const adv = await p.evaluate(() => {
    const P = LR.progress, t = P.today(), u = LR.units[0];
    LR.state.unit = u.id;
    u.words.concat(u.tricky).forEach(w => LR.state.items['w:' + w] = { b: 3, d: t, u: '', m: 0 });
    LR.state.items['w:jump'].b = 2;
    const before = P.advance();
    LR.state.items['w:jump'].b = 3;
    return [before, P.advance(), LR.state.unit].join();
  });
  ok(adv === 'false,true,p4-02', 'the next unit opens only when every word of the unit is mastered: ' + adv);

  // ---------- Storage and migration ----------
  await p.goto(U + '#home');
  await p.evaluate(() => { localStorage.clear(); localStorage.setItem('littleReader.v1', JSON.stringify({ schema: 1, words: ['come', 'grow'], story: 'x', hearts: {}, tricky: { grow: 2 }, confusions: { grow: { gome: 1 } }, storyMode: 'myturn', voice: 'v', rate: 0.8 })); });
  await p.reload();
  ok(await p.evaluate(() => { const s = LR.state; return s.schema === 2 && s.items['w:come'].b === 1 && s.items['w:grow'].b === 0 && s.confusions.grow.gome === 1 && !('story' in s) && !('storyMode' in s) && s.rate === 0.8; }), 'schema 1 migrates: words to box 1, help words to box 0, mix-ups kept, story dropped');
  await p.evaluate(() => { localStorage.clear(); localStorage.setItem('readingGarden.v1', JSON.stringify({ words: ['want', 'was'], story: 'I was here.', tricky: { was: 2 } })); });
  await p.reload();
  ok(await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('littleReader.v1')); return s.schema === 2 && s.items['w:want'].b === 1 && s.items['w:was'].b === 0; }), 'Reading Garden data migrates to schema 2');
  await p.evaluate(() => {
    const items = {}; const az = n => { let s = ''; do { s = String.fromCharCode(97 + n % 26) + s; n = Math.floor(n / 26); } while (n); return s; };
    for (let i = 0; i < 2500; i++) items['w:w' + az(i)] = { b: 1, d: '2026-01-01' };
    items['w:<img>'] = { b: 1, d: '2026-01-01' }; items['w:ok'] = { b: 9, d: 'soon' };
    localStorage.setItem('littleReader.v1', JSON.stringify({ schema: 2, unit: 'nope', items, confusions: { '<b>x</b>': { '<img>': 5, y: 'bad' } }, rate: 99, resume: { date: 'x' } }));
  });
  await p.reload();
  ok(await p.evaluate(() => { const s = LR.state; return Object.keys(s.items).length === 2000 && !s.items['w:<img>'] && !s.items['w:ok'] && s.unit === 'p4-01' && s.rate === 0.9 && s.resume === null && JSON.stringify(s.confusions) === '{"bxb":{"img":5}}'; }), 'bad or oversized stored data is cleaned on load');
  await p.evaluate(() => { localStorage.setItem('littleReader.v1', '{not json'); });
  await p.reload();
  ok(await p.evaluate(() => LR.state.schema === 2 && LR.state.unit === 'p4-01'), 'corrupt data starts fresh without errors');
  // Storage full: the session carries on, Grown-ups warns
  await seed(); await startSession();
  await p.evaluate(() => { Storage.prototype.setItem = function(){ throw new Error('QuotaExceededError'); }; });
  await answer();
  ok((await item()).at[1] === 1, 'when storage is full the session carries on');
  ok(await p.evaluate(() => LR.store.failed()), 'a failed save is noticed');

  // ---------- Grown-ups ----------
  await seed();
  const openGrownups = async () => {
    await p.goto(U + '#grownups');
    const [a, bb] = (await p.textContent('.gate .prompt')).match(/(\d+) \+ (\d+)/).slice(1).map(Number);
    for (const k of String(a + bb)) await p.click(`[data-k="${k}"]`);
    await p.click('[data-k="OK"]'); await p.waitForTimeout(40);
  };
  await p.goto(U + '#grownups');
  const sum = await p.textContent('.gate .prompt'), [ga, gb] = sum.match(/(\d+) \+ (\d+)/).slice(1).map(Number);
  ok(ga + gb >= 11 && ga + gb <= 18 && ga <= 9 && gb <= 9, 'the gate asks a sum of two digits from 11 to 18: ' + sum);
  ok(await p.$$eval('.gate input', x => x.length) === 0, 'the gate needs no typing');
  await p.click('[data-k="1"]'); await p.click('[data-k="OK"]'); await p.waitForTimeout(30);
  ok((await p.textContent('#msg')).length > 0 && !(await p.$('.gp')), 'a wrong answer keeps Grown-ups shut');
  await openGrownups();
  ok(!!(await p.$('.gp')), 'the right answer opens Grown-ups');
  ok((await p.textContent('.gp')).includes('Unit 1 of 4'), 'Grown-ups shows her unit');
  ok(await p.$$eval('.gp textarea, .gp input[type=text]', x => x.length) === 0, 'Grown-ups has no typing boxes');
  // Where is she?
  await p.evaluate(() => { LR.state.resume = { date: LR.progress.today(), steps: [{ id: 'words', items: [{ t: 'find', w: 'come' }] }], at: [0, 0], done: false, started: Date.now(), fresh: 0, right: 0, answered: 0, mode: 'day' }; });
  await p.click('[data-act=unit][data-u="p4-03"]'); await p.waitForTimeout(30);
  ok(await p.evaluate(() => LR.state.unit === 'p4-03' && LR.state.resume === null), 'choosing a unit re-plans the next session from it');
  // Practise one game
  await p.click('a[href="#practice-maths"]'); await p.waitForTimeout(60);
  ok(await p.evaluate(() => !!document.querySelector('[data-act=num],[data-act=sym]') && LR.state.resume === null), 'Practise one game opens the game without replacing the day\'s plan');
  for (let i = 0; i < 4; i++) { const cc = await p.evaluate(() => LR.session.ctx && LR.session.ctx.item); if (!cc) break;
    if (cc.m === 'more') await p.click(`[data-act=num][data-side="${cc.a > cc.b ? 'a' : 'b'}"]`); else await p.click(`[data-act=sym][data-s="${cc.a > cc.b ? '>' : '<'}"]`);
    await p.waitForFunction(o => !LR.session.ctx || LR.session.ctx.item !== o || location.hash === '#grownups', cc, { timeout: 5000 }).catch(() => {}); await p.waitForTimeout(30); }
  await p.waitForFunction(() => location.hash === '#grownups', null, { timeout: 5000 }).catch(() => {});
  ok(await p.evaluate(() => location.hash) === '#grownups', 'after the game it returns to Grown-ups');
  // Backup
  await p.waitForSelector('[data-act=backup]');
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('[data-act=backup]')]);
  const bfile = await dl.path(), bdata = JSON.parse(fs.readFileSync(bfile, 'utf8'));
  ok(/^\d{4}-\d{2}-\d{2}\.littlereader\.json$/.test(dl.suggestedFilename()) && bdata.app === 'little-reader' && bdata.schema === 2 && bdata.state.unit === 'p4-03', 'Save a backup downloads YYYY-MM-DD.littlereader.json with her progress');
  // Restore: rejections, then a good file
  const tmp = path.join(require('os').tmpdir(), 'lr-test');
  fs.mkdirSync(tmp, { recursive: true });
  const put = (n, s) => { const f = path.join(tmp, n); fs.writeFileSync(f, s); return f; };
  const tryRestore = async (f) => { await p.setInputFiles('#restore', f); await p.waitForTimeout(80); return p.textContent('#bmsg').catch(() => ''); };
  const unitNow = () => p.evaluate(() => LR.state.unit);
  ok(/isn’t a Little Reader backup/.test(await tryRestore(put('bad.json', '{nope'))) && await unitNow() === 'p4-03', 'restore rejects a file that isn\'t JSON');
  ok(/isn’t a Little Reader backup/.test(await tryRestore(put('other.json', '{"hello":1}'))) && await unitNow() === 'p4-03', 'restore rejects another app\'s file');
  ok(/newer version/.test(await tryRestore(put('newer.json', JSON.stringify({ app: 'little-reader', schema: 3, state: {} })))) && await unitNow() === 'p4-03', 'restore rejects a backup from a newer version');
  ok(/too big/.test(await tryRestore(put('big.json', 'x'.repeat(1024 * 1024 + 10)))) && await unitNow() === 'p4-03', 'restore rejects a file over 1 MB');
  const good = JSON.parse(JSON.stringify(bdata)); good.state.unit = 'p4-02'; good.state.confusions = { '<img src=x onerror=alert(1)>': { come: 1 } };
  await p.setInputFiles('#restore', put('good.json', JSON.stringify(good))); await p.waitForTimeout(80);
  ok(await unitNow() === 'p4-03' && !!(await p.$('[data-act=yes]')), 'a good backup asks for confirmation before replacing anything');
  await p.click('[data-act=yes]'); await p.waitForTimeout(40);
  ok(await unitNow() === 'p4-02' && !dialog && !(await p.evaluate(() => !!document.querySelector('#app img'))), 'the confirmed backup is restored, through validation, with nothing injected');
  // Reset: two steps
  await p.click('[data-act=reset]'); await p.waitForTimeout(30);
  ok(await unitNow() === 'p4-02', 'one tap on Reset deletes nothing');
  await p.click('[data-act=yes]'); await p.waitForTimeout(30);
  ok(await p.evaluate(() => LR.state.unit === 'p4-01' && LR.state.flowers.length === 0 && Object.keys(LR.state.confusions).length === 0), 'confirming Reset starts again at unit 1');
  // Grown-ups from Home needs a 2 s hold
  await p.goto(U + '#home');
  await p.click('[data-act=grownups]'); await p.waitForTimeout(40);
  ok(await p.evaluate(() => location.hash) === '#home', 'a quick tap on the lock does not open Grown-ups');

  // ---------- Speed, captions, feedback (Phase 3 rules, in the session) ----------
  await seed(s2({ 'w:come': { b: 2, d: t0 }, 'w:some': { b: 2, d: t0 }, 'w:from': { b: 2, d: t0 } }));
  await p.goto(U + '#session'); await p.waitForTimeout(80);
  ok((await said()).length === 0, 'a session opened without a touch speaks nothing');
  ok((await p.textContent('[data-caption]')) === 'Find the word you hear', 'the guide\'s bubble shows the instruction as a caption');
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
  const timeTap = (which, busy) => p.evaluate(async ([which, busy]) => {
    const target = LR.session.ctx.item.w;
    const el = [...document.querySelectorAll('.s-card:not([disabled])')].find(c => which === 'right' ? c.dataset.w === target : c.dataset.w !== target);
    if (busy) { __tts.endMs = 5000; LR.speech.say('A long sentence that is still being spoken.'); await new Promise(r => setTimeout(r, 40)); }
    const n = __tts.calls.length, t0 = performance.now();
    el.click();
    const changed = el.classList.contains('fb-' + which);
    await new Promise(r => requestAnimationFrame(() => r()));
    const tFrame = performance.now() - t0;
    await new Promise(r => setTimeout(r, busy ? 250 : 120));
    const call = __tts.calls.slice(n).find(c => c.text.trim());
    __tts.endMs = 20;
    return { changed, tFrame, tSpeak: call ? call.t - t0 : 9999 };
  }, [which, busy]);
  await touch(); await p.waitForTimeout(60);
  let t = await timeTap('wrong', false);
  ok(t.changed && t.tFrame < 100, `wrong tap shows within 100 ms (${Math.round(t.tFrame)})`);
  ok(t.tSpeak < 50, `wrong tap requests speech within 50 ms (${Math.round(t.tSpeak)})`);
  await p.waitForTimeout(200);
  t = await timeTap('right', true);
  ok(t.changed && t.tFrame < 100, `right tap during speech shows within 100 ms (${Math.round(t.tFrame)})`);
  ok(t.tSpeak < 130, `right tap during speech requests speech within 130 ms (${Math.round(t.tSpeak)})`);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  // No fixed waits, double taps count once, no stalls
  await p.waitForFunction(() => LR.state.resume.at[1] === 1, null, { timeout: 5000 });
  const w2 = await p.evaluate(() => LR.session.ctx.item.w);
  const tNext = await p.evaluate(async w => {
    const t0 = performance.now(), el = document.querySelector(`.s-card[data-w="${w}"]`); el.click(); el.click();
    while (LR.state.resume.at[1] !== 2) await new Promise(r => setTimeout(r, 5));
    return performance.now() - t0;
  }, w2);
  ok(tNext < 20 + 150, `the next item appears as soon as the praise ends (${Math.round(tNext)} ms)`);
  ok((await said()).filter(x => x === 'Yes! ' + w2).length === 1, 'a double tap on the right answer counts once');
  await p.evaluate(() => { __tts.never = true; });
  const w3 = await p.evaluate(() => LR.session.ctx.item.w);
  await p.click(`.s-card[data-w="${w3}"]`);
  const moved = await p.waitForFunction(() => LR.state.resume.at[1] === 3 || LR.state.resume.at[0] > 0, null, { timeout: 6000 }).then(() => true, () => false);
  ok(moved, 'when speech never ends, the session still moves on');
  await p.evaluate(() => { __tts.never = false; });
  // A wrong answer is never red
  await seed(s2({ 'w:come': { b: 2, d: t0 } })); await startSession();
  await p.click('.s-card:not([data-w="come"])'); await p.waitForTimeout(30);
  const fb = await p.$eval('.s-card.fb-wrong', e => ({ op: getComputedStyle(e).opacity, bg: getComputedStyle(e).backgroundColor, dot: !!e.querySelector('.fb-mark .ic-dot') }));
  ok(fb.dot && +fb.op < 0.6 && !/rgb\((2[0-9]{2}), ([0-9]{1,2}), /.test(fb.bg), 'a wrong answer is dimmed with a dot, not red: ' + JSON.stringify(fb));

  // ---------- Every child screen: fits, big targets, one primary target, no emoji ----------
  for (const [w, h] of [[1280, 614], [800, 1094]]) {
    await p.setViewportSize({ width: w, height: h });
    const bad = [], tall = [], many = [], emo = [], space = [];
    const check = async (name) => {
      const m = await p.evaluate(() => {
        const small = [...document.querySelectorAll('#app [data-act]')].filter(el => el.offsetParent).map(el => {
          const r = el.getBoundingClientRect();
          if (el.classList.contains('w')) return r.height >= 60 ? null : 'word';
          if (el.classList.contains('lbtn')) return r.height >= 120 && r.width >= 60 ? null : 'letter';
          if (el.hasAttribute('data-hold')) return r.width >= 72 ? null : 'hold';
          return r.width >= 120 && r.height >= 120 ? null : el.dataset.act + ' ' + Math.round(r.width) + 'x' + Math.round(r.height);
        }).filter(Boolean);
        const root = document.querySelector('.s-screen, .s-home');
        return { small, scroll: document.documentElement.scrollHeight, targets: document.querySelectorAll('#app .s-target:not(.off)').length,
          emoji: [...document.querySelectorAll('#app button, #app a, #app .s-path')].map(e => e.textContent).filter(t => /\p{Extended_Pictographic}/u.test(t)),
          used: root ? root.getBoundingClientRect().height / innerHeight : 0 };
      });
      if (m.small.length) bad.push(name + ': ' + m.small.join(' '));
      if (m.scroll > h) tall.push(name + ' ' + m.scroll);
      if (m.targets > 1) many.push(name);
      if (m.used < 0.7) space.push(name + ' ' + m.used.toFixed(2));
      emo.push(...m.emoji);
    };
    await seed(); await check('home');
    await startSession();
    const seen = new Set();
    for (let i = 0; i < 40 && await p.evaluate(() => location.hash) !== '#home'; i++) {
      const cc = await item(), key = cc.step + (cc.it ? ':' + cc.it.t + (cc.it.m || '') : '');
      if (cc.it && cc.it.t === 'tricky') { await p.waitForSelector('.lbtn'); await check('tricky-find'); }
      else if (cc.step === 'garden') { await p.waitForSelector('[data-act=done]:not([disabled])'); await check('garden'); }
      else if (!seen.has(key)) { await p.waitForTimeout(40); await check(key); }
      seen.add(key);
      await answer();
    }
    ok(!bad.length, `child targets are big enough at ${w}x${h}` + (bad.length ? ': ' + bad.join(', ') : ''));
    ok(!tall.length, `nothing scrolls at ${w}x${h}` + (tall.length ? ': ' + tall.join(', ') : ''));
    ok(!many.length, `at most one primary target at ${w}x${h}` + (many.length ? ': ' + many.join(', ') : ''));
    ok(!space.length, `child screens use at least 70% of the height at ${w}x${h}` + (space.length ? ': ' + space.join(', ') : ''));
    ok(!emo.length, `no emoji in the interface at ${w}x${h}` + (emo.length ? ': ' + emo.join(' ') : ''));
  }
  await p.setViewportSize({ width: 1280, height: 614 });

  // Andika is loaded and used for reading text
  await seed(); await startSession();
  const font = await p.evaluate(async () => { await document.fonts.ready; return { loaded: [...document.fonts].some(f => /Andika/.test(f.family) && f.status === 'loaded'), family: getComputedStyle(document.querySelector('.s-card')).fontFamily }; });
  ok(font.loaded && /^"?Andika/.test(font.family), 'Andika is loaded and used: ' + font.family);

  ok([...hosts].every(h => h.startsWith('localhost')), 'no requests leave the site: ' + [...hosts].join(', '));
  ok(errs.length === 0, 'no page errors or CSP violations' + (errs.length ? ': ' + errs.join(' | ') : ''));

  await b.close(); server.close();
  console.log(failed ? `\n${failed} failed` : '\nAll passed');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
