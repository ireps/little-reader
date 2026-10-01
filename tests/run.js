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
  // Everything the app asks to say, across all the tests, for the voice-clip coverage check at the end.
  const heard = new Set();
  await p.exposeFunction('__heard', t => { heard.add(t); });
  await p.addInitScript(() => { window.addEventListener('DOMContentLoaded', () => {
    const S = window.LR && LR.speech; if (!S) return;
    const say = S.say; S.say = function(t){ if (String(t).trim()) window.__heard(String(t)); return say.apply(this, arguments); };
  }); });
  // A stand-in for the tablet's speech engine: records each utterance and when it was requested.
  // __tts.endMs sets how long speaking takes; __tts.never = true means onend never fires (to test the watchdog).
  const ttsStub = () => {
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
  };
  await p.addInitScript(ttsStub);
  // Quick looks and no pause between items, so the checks run fast (the pace beat has its own test).
  await p.addInitScript(() => { window.addEventListener('DOMContentLoaded', () => { if (window.LR && LR.steps && LR.steps.flash) LR.steps.flash.SHOW_MS = 150;
    if (window.LR && LR.ui && LR.ui.PACE && !window.__realPace) Object.keys(LR.ui.PACE).forEach(k => { LR.ui.PACE[k].beat = 0; });
    /* The installed voice clips are set aside here, so the stand-in voice speaks; clip playback has its own checks below. */
    if (window.LR) LR.clips = {}; }); });
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
      else await p.click(`[data-act=sym][data-s="${it.a > it.b ? '>' : it.a < it.b ? '<' : '='}"]`);
    }
    else if (it.t === 'math') await p.click(`.m-opt[data-i="${await p.evaluate(i => { const q = LR.maths.gen(i); return q.opts.map(o => o.v).indexOf(q.answer); }, it)}"]`);
    else if (it.t === 'flash') { await p.waitForSelector('.s-card'); await p.click(`.s-card[data-w="${it.w}"]`); }
    else if (it.t === 'pic') await p.click(`.s-pic[data-w="${it.w}"]`);
    else if (it.t === 'build') {
      for (const g of await p.evaluate(w => LR.words.segment(w) || w.split(''), it.w)) {
        const label = /_e$/.test(g) ? g.charAt(0) + '–e' : g;
        await p.evaluate(l => [...document.querySelectorAll('.s-tile')].find(t => t.textContent === l).click(), label);
      }
    }
    else if (it.t === 'silly') { const ok = await p.evaluate(i => LR.units.find(u => u.id === i.u).silly[i.k].ok, it); await p.click(`.s-thumb[data-ok="${ok}"]`); }
    else if (it.t === 'rhyme') await p.click(`.s-pic[data-w="${await p.evaluate(k => LR.lang.rhymes[k][1], it.k)}"]`);
    else if (it.t === 'an') await p.click(`.s-word-card[data-w="${/^[aeiou]/.test(it.w) ? 'an' : 'a'}"]`);
    else if (it.t === 'plural') await p.click(`.s-pic[data-n="${it.many ? 3 : 1}"]`);
    else if (it.t === 'pos') await p.click(`.s-pic[data-p="${it.p}"]`);
    else if (it.t === 'caps') await p.click('.s-sentence .w');
    else if (it.t === 'q') { const a = await p.evaluate(i => { let f; LR.units.forEach(u => u.stories.forEach(s => { if (s.id === i.story) f = s.q[i.k].a; })); return f; }, it); await p.click(`.s-answer[data-w="${a}"]`); }
    await waitAt(c.at);
    return c;
  };
  /* Puts one item in today's plan and opens it, to test an activity on its own. */
  const only = async (it, step) => {
    await p.goto(U + '#home');
    await p.evaluate(([it, step]) => {
      LR.state.resume = { date: LR.progress.today(), steps: [{ id: step || 'words', items: [it, { t: 'find', w: 'come' }] }], at: [0, 0], done: false, started: Date.now(), fresh: 0, right: 0, answered: 0, mode: 'day' };
      LR.store.save();
    }, [it, step]);
    await p.reload(); await touch(); await p.click('[data-act=start]'); await p.waitForTimeout(60);
  };
  const d = (s, n) => p.evaluate(([s, n]) => LR.progress.addDays(s, n), [s, n]);

  // ---------- Home ----------
  await seed();
  ok(await p.$$eval('#app [data-act=start]', x => x.length) === 1, 'Home has one Start');
  ok(await p.$$eval('#app .s-target', x => x.length) === 1, 'Home has one primary target');
  ok(await p.$eval('.garden', g => g.dataset.flowers) === '0', 'a new garden has no flowers yet');
  ok(/15 sprouts/.test(await p.$eval('.garden', g => g.getAttribute('aria-label'))), 'the words she is learning show as sprouts (her 6 known words and the 9 base tricky words)');
  const base = await p.evaluate(() => { const it = LR.state.items, b = LR.baseReview;
    return { all: b.length === 9 && b.every(w => it['w:' + w] && it['w:' + w].b === 1), known: LR.knownTricky.every(w => it['w:' + w] && it['w:' + w].b === 1) }; });
  ok(base.all && base.known, 'a new install has the, to, I, no, go, into, me, be and are in review at box 1, with her known words');
  await p.evaluate(() => { localStorage.setItem(LR.store.KEY, JSON.stringify({ schema: 2, unit: 'p5-03', items: { 'w:the': { b: 4, d: '2030-01-01', u: '', m: 0 }, 'w:jump': { b: 2, d: '2030-01-01', u: '', m: 0 } },
    flowers: [], confusions: {}, stories: {}, days: [], rate: 0.9 })); LR.store.load(); });
  const old = await p.evaluate(() => { const it = LR.state.items; return { the: it['w:the'].b, jump: it['w:jump'].b, are: it['w:are'] && it['w:are'].b, i: it['w:i'] && it['w:i'].b,
    saved: JSON.parse(localStorage.getItem(LR.store.KEY)).items['w:be'] !== undefined }; });
  ok(old.the === 4 && old.jump === 2 && old.are === 1 && old.i === 1 && old.saved, 'existing progress gains the base tricky words once, and words already there keep their box: ' + JSON.stringify(old));
  ok(await p.evaluate(() => LR.ui.lettersHTML('i', true).indexOf('>I<') > -1), 'the word I always shows as a capital letter');
  const pairs = await p.evaluate(() => { const S = LR.session, st = { q: [{}, {}, {}] }, d = LR.progress.addDays('2000-01-01', 9133);
    return { zero: S.dayNumber('2000-01-01'), day: S.dayNumber(d), today: S.questionPair(st, d), next: S.questionPair(st, LR.progress.addDays(d, 1)), after: S.questionPair(st, LR.progress.addDays(d, 2)), two: S.questionPair({ q: [{}, {}] }, d) }; });
  ok(pairs.zero === 0 && pairs.day === 9133 && pairs.today.join() === '1,2' && pairs.next.join() === '2,0' && pairs.after.join() === '0,1' && pairs.two.join() === '0,1',
    'story questions are asked in pairs that take turns by date (day 9133: 2 and 3, then 3 and 1, then 1 and 2): ' + JSON.stringify(pairs));
  await seed();
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
  ok(order.join(',') === 'words,tricky,silly,read,maths,garden', 'a session runs its steps in order: ' + order.join(','));
  ok(path1.length === 6 && /now/.test(path1[0]), 'the path shows the steps, the first one now: ' + path1.join(' / '));
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

  // ---------- Pace: the answer stays on screen for a beat before the next item ----------
  await seed(s2({ 'w:come': { b: 2, d: t0 }, 'w:some': { b: 2, d: t0 } })); await startSession();
  await p.evaluate(() => { LR.ui.PACE.calm.beat = 1000; });
  c = await item();
  await p.click(`.s-card[data-w="${c.it.w}"]`);
  await p.waitForTimeout(400);
  ok(await p.$(`.s-card.fb-right[data-w="${c.it.w}"]`) !== null, 'at the Calm pace, the right answer is still on screen just after the praise');
  await p.waitForFunction(w => !document.querySelector(`.s-card.fb-right[data-w="${w}"]`), c.it.w, { timeout: 3000 });
  ok(true, 'then the next item is drawn');
  await p.evaluate(() => { LR.ui.PACE.calm.beat = 0; });

  // ---------- New tricky word ----------
  /* All of unit 1's words are known and not due, so nothing is reviewed today. */
  const later = await d(t0, 5), unitWords = {};
  for (const w of await p.evaluate(() => LR.progress.unitById('p4-01').words.concat(LR.knownTricky, LR.baseReview))) unitWords['w:' + w] = { b: 2, d: later };
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
  await seed(s2(Object.assign({}, unitWords, { 'w:come': { b: 2, d: later }, 'w:said': { b: 2, d: later }, 'w:like': { b: 2, d: later }, 'w:the': { b: 3, d: later } })));
  await startSession();
  while ((await item()).step !== 'read') await answer();
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
    LR.state.unit = 'p4-04'; P.unitById('p4-04').words.forEach(w => LR.state.items['w:' + w] = { b: 3, d: P.addDays(t, 3), u: '', m: 0 });
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
    const P = LR.progress, t = P.today(), u = P.unitById('p4-01');
    LR.state.unit = u.id;
    u.words.concat(u.tricky).forEach(w => LR.state.items['w:' + w] = { b: 3, d: t, u: '', m: 0 });
    LR.state.items['w:jump'].b = 2;
    LR.state.silly = { 'p4-01': [5, 5] };
    const before = P.advance();
    LR.state.items['w:jump'].b = 3;
    LR.state.silly = { 'p4-01': [5, 3] };
    const lowSilly = P.advance();
    LR.state.silly = { 'p4-01': [5, 4] };
    return [before, lowSilly, P.advance(), LR.state.unit].join();
  });
  ok(adv === 'false,false,true,p4-02', 'the next unit opens only when every word is mastered and silly sentences are 80% right: ' + adv);

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
  ok((await p.textContent('.gp')).includes('Unit 4 of 27'), 'Grown-ups shows her unit (p4-01 is unit 4 of 27)');
  ok(await p.$$eval('.gp textarea, .gp input[type=text]', x => x.length) === 0, 'Grown-ups has no typing boxes');
  // Where is she?
  await p.evaluate(() => { LR.state.resume = { date: LR.progress.today(), steps: [{ id: 'words', items: [{ t: 'find', w: 'come' }] }], at: [0, 0], done: false, started: Date.now(), fresh: 0, right: 0, answered: 0, mode: 'day' }; });
  await p.click('[data-act=unit][data-u="p4-03"]'); await p.waitForTimeout(30);
  ok(await p.evaluate(() => LR.state.unit === 'p4-03' && LR.state.resume === null), 'choosing a unit re-plans the next session from it');
  // Practise one game
  await p.click('a[href="#practice-maths"]'); await p.waitForTimeout(60);
  ok(await p.evaluate(() => !!document.querySelector('[data-act=num],[data-act=sym]') && LR.state.resume === null), 'Practise one game opens the game without replacing the day\'s plan');
  for (let i = 0; i < 6; i++) { const cc = await p.evaluate(() => location.hash === '#practice-maths' && LR.session.ctx && LR.session.ctx.item); if (!cc) break;
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

  // ---------- Phase 5: the course ----------
  const course = await p.evaluate(() => {
    const W = LR.words, i4 = LR.units.findIndex(u => u.id === 'p4-01'), bad = [], perTheme = {};
    const THEMES = ['plants', 'animals', 'food', 'body', 'transport', 'weather', 'helpers', 'family', 'home', 'school', 'festivals', 'seasons', 'safety'];
    LR.units.forEach(u => {
      const sil = u.silly || [];
      if (u.words.length < 8 || u.words.length > 12) bad.push(u.id + ' words ' + u.words.length);
      if (u.tricky.length < 1 || u.tricky.length > 3) bad.push(u.id + ' tricky ' + u.tricky.length);
      if (u.stories.length !== 4 || u.stories.some(s => s.s.length < 4 || s.s.length > 6)) bad.push(u.id + ' stories');
      u.stories.forEach(s => { if (!s.q || s.q.length !== 3 || s.q.filter(q => q.first).length !== 1 || s.q.some(q => q.opts.indexOf(q.a) === -1 || q.opts.length !== 3)) bad.push(s.id + ' questions'); });
      if (sil.length !== 8 || sil.filter(x => x.ok).length !== 4) bad.push(u.id + ' silly');
      if (THEMES.indexOf(u.theme) === -1) bad.push(u.id + ' theme');
      u.stories.forEach(s => { if (THEMES.indexOf(s.theme) === -1) bad.push(s.id + ' theme'); else perTheme[s.theme] = (perTheme[s.theme] || 0) + 1; });
      const near = u.near || [];
      if (near.length < 3 || near.some(g => g.length < 3 || g.some(w => w[0] !== g[0][0]) || new Set(g).size !== g.length) || !near.some(g => g.some(w => u.words.includes(w)))) bad.push(u.id + ' near');
    });
    ['family', 'home', 'school', 'festivals', 'seasons', 'safety'].forEach(t => { if ((perTheme[t] || 0) < 2) bad.push('theme ' + t + ' has ' + (perTheme[t] || 0) + ' stories'); });
    return { problems: W.checkUnits(), bad, cake: W.decodable('cake', i4), night: W.decodable('night', i4), doTricky: W.decodable('do', i4),
      order: LR.units.map(u => u.id).join(), ship: (W.segment('ship') || []).join('|'), cakeSeg: (W.segment('cake') || []).join('|') };
  });
  ok(course.problems.length === 0, 'every word in every unit is decodable with what has been taught by then' + (course.problems.length ? ': ' + course.problems.join(', ') : ''));
  ok(!course.cake && course.night && !course.doTricky, 'the check fails on an untaught sound (cake in Phase 4) or tricky word (do in unit 1), and passes taught ones (night)');
  ok(course.bad.length === 0, 'every unit has 8-12 words, 1-3 tricky words, 4 stories of 4-6 sentences with 3 questions each (one "What happened first?"), 8 silly sentences, a theme on the unit and each story, and 3 or more same-start groups; each new theme has 2 or more stories' + (course.bad.length ? ': ' + course.bad.join(', ') : ''));
  ok(/^p3-r1,p3-r2,p3-r3,p4-01,.*p4-06,p5-01,.*p5-12,p5-r1,p5-r2,p6-01,p6-02,p6-03,p6-04$/.test(course.order), 'units run from Phase 3 review through Phases 4 and 5, then mixed review and the Phase 6 suffixes (-s/-es, -ing, -ed, -er/-est)');
  ok(course.ship === 'sh|i|p' && course.cakeSeg === 'c|a_e|k', 'words split into sounds, with split digraphs (sh-i-p, c-a_e-k)');
  const sfx = await p.evaluate(() => { const W = LR.words, base = s => ({ graphemes: W.BASE, tricky: [], suffixes: s, all: [] });
    return { early: W.decodable('jumping', 0, base([])), taught: W.decodable('jumping', 0, base(['ing'])), stamped: W.decodable('stamped', 0, base([])),
      bed: W.decodable('bed', 0, base([])), letter: W.suffixOf('letter'), blacker: W.decodable('blacker', 0, base(['ing'])), blackerOk: W.decodable('blacker', 0, base(['er'])) }; });
  ok(!sfx.early && sfx.taught && !sfx.stamped, 'a suffixed word (jumping, stamped) is decodable only once its suffix is taught: ' + JSON.stringify(sfx));
  const near = await p.evaluate(() => { const W = LR.words, g = [['plants', 'plums', 'pots'], ['grow', 'green', 'grin']], runs = [];
    for (let i = 0; i < 20; i++) runs.push(W.lookalikes('plants', ['cat', 'dog'], [], 2, g).sort().join());
    return { group: [...new Set(runs)], mix: W.lookalikes('plants', [], ['pets'], 2, g), twoStart: W.lookalikes('grab', [], [], 2, g) }; });
  ok(near.group.length === 1 && near.group[0] === 'plums,pots', 'with no mix-ups, both distractors come from the target’s same-start group: ' + JSON.stringify(near.group));
  ok(near.mix[0] === 'pets' && ['plums', 'pots'].includes(near.mix[1]) && near.twoStart.every(w => w.slice(0, 2) === 'gr'),
    'her mix-ups still come first, then the group; a word outside the groups gets same-start words from them: ' + JSON.stringify(near));
  ok(sfx.bed && sfx.letter === '' && !sfx.blacker && sfx.blackerOk, 'a suffix is only split off a real root (bed and letter are plain words; blacker needs -er)');
  const pics = await p.evaluate(() => {
    /* Unicode 6.0/6.1 emoji ranges (Android 5.1 draws these), plus a few older default-emoji symbols. */
    const R = [[0x1F300, 0x1F320], [0x1F330, 0x1F335], [0x1F337, 0x1F37C], [0x1F380, 0x1F393], [0x1F3A0, 0x1F3C4], [0x1F3C6, 0x1F3CA], [0x1F3E0, 0x1F3F0],
      [0x1F400, 0x1F43E], [0x1F440, 0x1F440], [0x1F442, 0x1F4F7], [0x1F4F9, 0x1F4FC], [0x1F500, 0x1F53D], [0x1F550, 0x1F567], [0x1F5FB, 0x1F640],
      [0x1F645, 0x1F64F], [0x1F680, 0x1F6C5]];
    const BMP = [0x2B50, 0x2614, 0x26C4, 0x2615, 0x26BD, 0x26FA, 0x26F5, 0x231A, 0x23F0, 0x270B];
    return Object.entries(LR.pictures).filter(([w, e]) => { const c = e.codePointAt(0); return [...e].length !== 1 || !(BMP.includes(c) || R.some(([a, b]) => c >= a && c <= b)); }).map(([w]) => w);
  });
  ok(pics.length === 0, 'every picture is an emoji from Unicode 6 or older' + (pics.length ? ': ' + pics.join(', ') : ''));

  // ---------- Phase 5: each activity, right and wrong ----------
  await seed(s2({ 'w:come': { b: 2, d: t0 } }));
  // Flash: the word shows, then hides; nothing is said before she answers
  await clearSaid();
  await only({ t: 'flash', w: 'jump' });
  ok((await p.textContent('.s-flash')).includes('jump') && !(await said()).includes('jump'), 'Flash shows the word without saying it');
  await p.waitForSelector('.s-card');
  ok(!(await p.$('.s-flash')), 'Flash hides the word, then offers 3 look-alikes');
  await p.click('.s-card:not([data-w="jump"])'); await p.waitForTimeout(30);
  ok(await p.$eval('.s-card.fb-wrong', e => e.disabled), 'Flash: a wrong pick dims');
  await p.click('.s-card[data-w="jump"]'); await waitAt([0, 0]);
  ok((await said()).includes('Yes! jump'), 'Flash: the right pick is praised and it moves on');
  // Picture match, with sound buttons
  await only({ t: 'pic', w: 'ship' });
  ok(await p.$$eval('.s-sw .sb.dash', x => x.length) === 1 && await p.$$eval('.s-sw .sb.dot', x => x.length) === 2, 'Picture match shows sound buttons: a dash under sh, dots under i and p');
  await p.click('.s-pic:not([data-w="ship"])'); await p.waitForTimeout(30);
  ok((await said()).some(t => /^That is a /.test(t)), 'Picture match: a wrong picture is named');
  await p.click('.s-pic[data-w="ship"]'); await waitAt([0, 0]);
  ok(true, 'Picture match: the right picture moves on');
  // Build it: sh is one tile; a wrong tile stays in the tray
  await only({ t: 'build', w: 'ship' });
  ok(await p.$$eval('.s-slot', x => x.length) === 3 && await p.$$eval('.s-tile', x => x.some(t => t.textContent === 'sh')), 'Build it: "ship" has 3 slots and "sh" is a single tile');
  const decoy = await p.$$eval('.s-tile', x => x.map(t => t.textContent).find(t => !['sh', 'i', 'p'].includes(t)));
  await p.evaluate(l => [...document.querySelectorAll('.s-tile')].find(t => t.textContent === l).click(), decoy); await p.waitForTimeout(30);
  ok(await p.$$eval('.s-tile', (x, l) => x.some(t => t.textContent === l), decoy) && await p.$eval('.s-slot', s => !s.classList.contains('full')), 'Build it: a wrong tile stays in the tray and fills nothing');
  const mBefore = await p.evaluate(() => LR.state.items['w:ship'].m);
  await answer();
  ok(await p.evaluate(m => LR.state.items['w:ship'].m === m, mBefore) && mBefore >= 1, 'Build it: the miss is recorded once');
  // Silly sentences
  await only({ t: 'silly', u: 'p4-01', k: 1 }, 'silly');
  ok(!(await said()).includes('A tent can drink milk.'), 'Silly sentences: the sentence is not read before she answers');
  await p.click('.s-thumb[data-ok="true"]'); await waitAt([0, 0]);
  ok((await said()).some(t => t.startsWith('A tent can drink milk.')) && await p.evaluate(() => JSON.stringify(LR.state.silly['p4-01'])) === '[1,0]', 'Silly sentences: a wrong thumb shows the answer, reads the sentence and is counted');
  await only({ t: 'silly', u: 'p4-01', k: 0 }, 'silly');
  await p.click('.s-thumb[data-ok="true"]'); await waitAt([0, 0]);
  ok(await p.evaluate(() => JSON.stringify(LR.state.silly['p4-01'])) === '[2,1]', 'Silly sentences: a right thumb is counted');
  // Rhyme, a/an, one or many, in/on/under, capitals
  await only({ t: 'rhyme', k: 0 });
  ok((await said()).includes('What rhymes with cat?'), 'Rhyme: she hears the word');
  await p.click('.s-pic:not([data-w="hat"])'); await p.waitForTimeout(30);
  ok(await p.$$eval('.s-pic.fb-wrong', x => x.length) === 1, 'Rhyme: a wrong picture dims');
  await p.click('.s-pic[data-w="hat"]'); await waitAt([0, 0]);
  await only({ t: 'an', w: 'apple' });
  await p.click('.s-word-card[data-w="a"]'); await waitAt([0, 0]);
  ok((await said()).includes('We say an apple.'), 'a or an: a wrong choice shows and says "an apple"');
  await only({ t: 'plural', w: 'cat', many: true });
  ok((await p.textContent('.s-main .s-word')) === 'cats', 'One or many: she reads "cats"');
  await p.click('.s-pic[data-n="3"]'); await waitAt([0, 0]);
  ok((await said()).includes('Yes! cats.'), 'One or many: three cats is right');
  await only({ t: 'pos', p: 'under' });
  await p.click('.s-pic[data-p="in"]'); await p.waitForTimeout(30);
  await p.click('.s-pic[data-p="under"]'); await waitAt([0, 0]);
  ok((await said()).includes('Yes! The ball is under the box.'), 'In, on, under: the matching scene is right after a miss');
  await only({ t: 'caps', story: 'p4-01a', i: 0 });
  ok((await p.textContent('.s-sentence')).startsWith('a frog'), 'Capitals: the sentence starts with a small letter');
  await p.click('.s-sentence .w:nth-of-type(2)'); await p.waitForTimeout(30);
  await p.evaluate(() => { __tts.endMs = 600; });
  await p.click('.s-sentence .w'); await p.waitForTimeout(30);
  ok((await p.textContent('.s-sentence')).startsWith('A frog'), 'Capitals: tapping the first word gives it a capital');
  await waitAt([0, 0]);
  await p.evaluate(() => { __tts.endMs = 20; });
  // Story questions
  await only({ t: 'q', story: 'p4-01a', k: 0 }, 'read');
  ok((await said()).includes('Who did a big jump?'), 'Story questions: the question is asked');
  await p.click('.s-answer[data-w="frog"]'); await waitAt([0, 0]);
  ok((await said()).includes('Yes! frog.'), 'Story questions: the right answer moves on');
  // What happened first? Phrases from the story, side by side
  await only({ t: 'q', story: 'p4-03a', k: 2 }, 'read');
  ok(await p.$$eval('.s-cards.s-col .s-phrase', x => x.length) === 3 && (await said()).includes('What happened first?') && !(await p.textContent('[data-caption]')).includes('Raj has'),
    'What happened first? is spoken with 3 phrase cards, and the caption never shows the answer');
  await p.click('.s-phrase[data-w="Meena can clap"]'); await p.waitForTimeout(40);
  ok((await said()).includes('Not that one. Think about the story.'), 'What happened first?: a later event is not the answer');
  await p.click('.s-phrase[data-w="Raj has a red drum"]'); await waitAt([0, 0]);
  ok((await said()).includes('Yes! Raj has a red drum.'), 'What happened first?: the first event is right, and it is spoken');
  // The help ladder: first a hint, then the word; one miss per word
  await only({ t: 'read', story: 'p4-01a', i: 2 }, 'read');
  await p.waitForSelector('[data-act=check]:not([disabled])');
  await clearSaid();
  await p.click('.s-sentence .w[data-w="said"]'); await p.waitForTimeout(40);
  const hint = (await said()).slice(-1)[0];
  ok(hint && hint !== 'said' && await p.evaluate(() => LR.state.items['w:said'].m) === 1, 'help ladder: the first tap gives a hint, not the word (' + hint + ')');
  await p.click('.s-sentence .w[data-w="said"]'); await p.waitForTimeout(40);
  await p.click('.s-sentence .w[data-w="said"]'); await p.waitForTimeout(40);
  ok((await said()).includes('said') && await p.evaluate(() => LR.state.items['w:said'].m) === 1, 'help ladder: the second tap says the word, and the word counts as one miss');
  // The day's plan: questions follow the story; Sounds and words mixes activities
  await seed(s2({ 'w:come': { b: 2, d: t0 }, 'w:jump': { b: 0, d: t0 }, 'w:lamp': { b: 1, d: t0 }, 'w:some': { b: 2, d: t0 } }));
  await startSession();
  const planned = await p.evaluate(() => { const r = LR.state.resume; return { words: r.steps[0].items.map(i => i.t), read: (r.steps.find(s => s.id === 'read') || { items: [] }).items.map(i => i.t) }; });
  ok(planned.read.slice(-1)[0] === 'q' && planned.read[0] === 'read', 'story questions come after the story\'s sentences: ' + planned.read.join(','));
  ok(new Set(planned.words).size >= 3 && ['rhyme', 'an', 'plural', 'pos', 'caps'].includes(planned.words.slice(-1)[0]), 'Sounds and words mixes activities and ends with a language task: ' + planned.words.join(','));
  ok(planned.words.every((t, i) => i < 3 || !(t === planned.words[i - 1] && t === planned.words[i - 2] && t === planned.words[i - 3])), 'no activity runs more than 3 times in a row');

  // ---------- Phase 6: maths ----------
  const gens = await p.evaluate(() => {
    const M = LR.maths, bad = [], R = {
      count: [[2, 10], [11, 20]], numeral: [[1, 9], [10, 99]], counton: [[0, 9], [0, 100]], neighbour: [[0, 20], [0, 100]],
      add: [[2, 9], [2, 18]], take: [[1, 8], [1, 8]], names: [[1, 10], [11, 20]], zero: [[0, 0], [0, 0]]
    };
    M.ids.filter(s => s !== 'compare').forEach(s => [1, 2].forEach(lv => {
      for (let i = 1; i <= 300; i++) {
        const q = M.gen({ s, lv, seed: i * 104729 }), vals = q.opts.map(o => o.v);
        if (!vals.includes(q.answer)) bad.push(`${s}${lv}: answer not offered`);
        if (new Set(vals.map(String)).size !== vals.length) bad.push(`${s}${lv}: repeated choice`);
        if (q.opts.length < 2 || q.opts.length > 3) bad.push(`${s}${lv}: ${q.opts.length} choices`);
        if (R[s] && (q.answer < R[s][lv - 1][0] || q.answer > R[s][lv - 1][1])) bad.push(`${s}${lv}: ${q.answer} out of range`);
        if (s === 'money' && lv === 1 && ![1, 2, 5, 10].includes(q.answer)) bad.push('money1: ' + q.answer);
      }
    }));
    return [...new Set(bad)];
  });
  ok(gens.length === 0, 'every maths generator gives its answer among unique choices, inside the level\'s range (300 items per skill and level)' + (gens.length ? ': ' + gens.slice(0, 8).join(', ') : ''));
  const mplan = await p.evaluate(() => {
    const t = LR.progress.today(), out = {};
    LR.state.items = {}; LR.state.equals = false;
    out.first = LR.progress.mathsUnlocked().join();
    LR.state.items['m:compare'] = { b: 2, d: t, u: '', m: 0 }; LR.state.items['m:count'] = { b: 1, d: t, u: '', m: 0 };
    out.second = LR.progress.mathsUnlocked().join();
    let repeats = 0, sizes = new Set(), eqOff = 0;
    for (let k = 0; k < 60; k++) {
      const items = LR.session.mathItems(4 + (k % 2));
      sizes.add(items.length);
      items.forEach((x, i) => {
        if (x.t === 'croc' && (x.m === 'eq' || x.a === x.b)) eqOff++;
        const prev = items.slice(0, i).reverse().find(y => (y.s || 'compare') === (x.s || 'compare'));
        if (prev && (x.t === 'croc' ? prev.a === x.a && prev.b === x.b : LR.maths.gen(prev).key === LR.maths.gen(x).key)) repeats++;
      });
    }
    LR.state.equals = true;
    let eqOn = 0;
    for (let k = 0; k < 60; k++) LR.session.mathItems(5).forEach(x => { if (x.t === 'croc' && x.a === x.b && x.m === 'eq') eqOn++; });
    LR.state.equals = false;
    LR.state.items['m:compare'] = { b: 3, d: t, u: '', m: 0 };
    out.level2 = LR.progress.mathsLevel('compare') === 2 && LR.progress.mathsLevel('count') === 1;
    Object.assign(out, { repeats, sizes: [...sizes].join(), eqOff, eqOn });
    return out;
  });
  ok(mplan.first === 'compare' && mplan.second === 'compare,count', 'maths skills unlock in order, each when the one before reaches box 2: ' + mplan.first + ' / ' + mplan.second);
  ok(mplan.repeats === 0, 'a skill never repeats the same numbers in a row');
  ok(mplan.sizes === '4,5', 'the Maths step has 4 or 5 items');
  ok(mplan.eqOff === 0 && mplan.eqOn > 0, 'equal amounts and = appear only when the Equals sign switch is on (' + mplan.eqOn + ' when on)');
  ok(mplan.level2, 'a skill moves to level 2 at box 3');
  // Each skill: right, and wrong with the answer shown (count-along for counting)
  await seed(s2({ 'w:come': { b: 2, d: t0 } }));
  const skillIds = await p.evaluate(() => LR.maths.ids.filter(s => s !== 'compare'));
  const mres = [];
  for (const s of skillIds) {
    await only({ t: 'math', s, lv: 1, seed: 12345 }, 'maths');
    const info = await p.evaluate(() => { const q = LR.maths.gen(LR.session.ctx.item); return { right: q.opts.map(o => o.v).indexOf(q.answer), n: q.opts.length, count: q.count || 0 }; });
    const wrongs = [...Array(info.n).keys()].filter(i => i !== info.right);
    const tries = wrongs.slice(0, info.n === 2 ? 1 : 2);
    for (const [k, w] of tries.entries()) {
      /* The last wrong tap starts the reveal: slow the voice so the count-along can be seen. */
      await p.evaluate(slow => { __tts.endMs = slow ? 1500 : 120; }, k === tries.length - 1);
      await p.click(`.m-opt[data-i="${w}"]`); await p.waitForTimeout(40);
    }
    const shown = await p.$eval(`.m-opt[data-i="${info.right}"]`, e => e.classList.contains('fb-right'));
    let lit = true;
    if (info.count && ['count', 'add', 'take'].includes(s)) { await p.waitForTimeout(300); lit = await p.$$eval('.s-q .lit', x => x.length) > 0; }
    await p.evaluate(() => { __tts.endMs = 20; });
    await waitAt([0, 0]).catch(() => {});
    const moved = await p.evaluate(() => LR.state.resume.at[1] === 1);
    await only({ t: 'math', s, lv: 1, seed: 999 }, 'maths');
    const r2 = await p.evaluate(() => { const q = LR.maths.gen(LR.session.ctx.item); return q.opts.map(o => o.v).indexOf(q.answer); });
    await p.click(`.m-opt[data-i="${r2}"]`); await waitAt([0, 0]);
    const up = await p.evaluate(sk => (LR.state.items['m:' + sk] || {}).b, s);
    if (!(shown && lit && moved && up >= 1)) mres.push(`${s}: shown ${shown}, lit ${lit}, moved ${moved}, box ${up}`);
  }
  ok(mres.length === 0, 'every maths skill: a wrong answer shows the right one (counting along where there is something to count) and moves on; a right answer moves it up' + (mres.length ? ': ' + mres.join('; ') : ''));
  await only({ t: 'math', s: 'count', lv: 1, seed: 4 }, 'maths');
  const dots = await p.evaluate(() => ({ n: LR.maths.gen(LR.session.ctx.item).answer, frames: document.querySelectorAll('.s-q .frame').length, fill: document.querySelectorAll('.s-q .cell.fill').length, cells: document.querySelectorAll('.s-q .cell').length }));
  ok(dots.frames >= 1 && dots.fill === dots.n && dots.cells % 10 === 0, 'amounts are shown as ten-frames, never scattered: ' + JSON.stringify(dots));
  await only({ t: 'croc', a: 4, b: 4, m: 'eq' }, 'maths');
  ok(await p.$$eval('[data-act=sym]', x => x.map(e => e.dataset.s).join('')) === '<=>', 'with = on, the crocodile offers <, = and >');
  await p.click('[data-act=sym][data-s="="]'); await waitAt([0, 0]);
  ok((await said()).some(t => /4 is equal to 4/.test(t)), 'equal amounts: = is right and "4 is equal to 4" is said');
  // Grown-ups: maths rows and the Equals sign switch
  await p.goto(U + '#grownups');
  if (await p.$('.gate')) { const [a, bb] = (await p.textContent('.gate .prompt')).match(/(\d+) \+ (\d+)/).slice(1).map(Number); for (const k of String(a + bb)) await p.click(`[data-k="${k}"]`); await p.click('[data-k="OK"]'); await p.waitForTimeout(40); }
  ok((await p.textContent('.gp')).includes('Comparing (< and >): level'), 'Grown-ups lists her maths skills with their level');
  ok((await p.textContent('[data-act=equals]')).includes('off'), 'the Equals sign switch starts off');
  await p.click('[data-act=equals]'); await p.waitForTimeout(30);
  ok(await p.evaluate(() => LR.state.equals === true && JSON.parse(localStorage.getItem('littleReader.v1')).equals === true), 'turning Equals sign on is saved');
  ok(await p.$eval('[data-act=pace][data-v=calm]', e => e.getAttribute('aria-pressed') === 'true'), 'the pace starts at Calm');
  await p.click('[data-act=pace][data-v=quick]'); await p.waitForTimeout(30);
  ok(await p.evaluate(() => JSON.parse(localStorage.getItem('littleReader.v1')).pace === 'quick' && getComputedStyle(document.documentElement).getPropertyValue('--pace').trim() === '0.75'), 'choosing the Quick pace is saved and applied');
  ok(await p.evaluate(() => LR.store.validate(Object.assign(JSON.parse(JSON.stringify(LR.state)), { pace: 'zoom' })).pace === 'calm'), 'a stored pace is validated (anything odd means Calm)');
  await p.click('[data-act=pace][data-v=calm]'); await p.waitForTimeout(30);
  ok(/No voice clips yet/.test(await p.textContent('#app')) && !(await p.$('[data-act=clips]')), 'with no clips installed, Grown-ups says so and shows no clip switches');
  ok(await p.evaluate(() => { const v = LR.store.validate(Object.assign(JSON.parse(JSON.stringify(LR.state)), { clips: 'no', captions: 1 })); return v.clips === true && v.captions === false; }), 'stored clip settings are validated (anything odd means clips on, captions off)');

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
  await p.waitForSelector(`.s-card[data-w="${w2}"]`);
  const tNext = await p.evaluate(async w => {
    const t0 = performance.now(), el = document.querySelector(`.s-card[data-w="${w}"]`); el.click(); el.click();
    while (LR.state.resume.at[1] !== 2) await new Promise(r => setTimeout(r, 5));
    return performance.now() - t0;
  }, w2);
  ok(tNext < 20 + 150, `the next item appears as soon as the praise ends (${Math.round(tNext)} ms)`);
  ok((await said()).filter(x => x === 'Yes! ' + w2).length === 1, 'a double tap on the right answer counts once');
  await p.evaluate(() => { __tts.never = true; });
  const w3 = await p.evaluate(() => LR.session.ctx.item.w);
  await p.waitForSelector(`.s-card[data-w="${w3}"]`);
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
          /* Interface text only: content pictures (.s-picimg) are allowed emoji. */
          emoji: [...document.querySelectorAll('#app button, #app a, #app .s-path')].map(e => { const c = e.cloneNode(true); c.querySelectorAll('.s-picimg').forEach(x => x.remove()); return c.textContent; }).filter(t => /\p{Extended_Pictographic}/u.test(t)),
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
  const font = await p.evaluate(async () => { await document.fonts.ready; return { loaded: [...document.fonts].some(f => /Andika/.test(f.family) && f.status === 'loaded'), family: getComputedStyle(document.querySelector('.s-main .s-card, .s-main .s-tile, .s-main .s-word')).fontFamily }; });
  ok(font.loaded && /^"?Andika/.test(font.family), 'Andika is loaded and used: ' + font.family);

  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'), refs = html.match(/(?:src|href)="(?:js|data|css|audio)\/[^"]+"/g) || [];
  const vers = new Set(refs.map(r => (r.match(/\?v=(\d+)/) || [])[1]));
  ok(refs.length > 20 && vers.size === 1 && !vers.has(undefined), 'every script and stylesheet in index.html carries the same ?v= version: ' + [...vers].join(','));
  ok([...hosts].every(h => h.startsWith('localhost')), 'no requests leave the site: ' + [...hosts].join(', '));
  ok(errs.length === 0, 'no page errors or CSP violations' + (errs.length ? ': ' + errs.join(' | ') : ''));

  // ---------- Voice clips (Phase 7): playback with a stand-in manifest ----------
  {
    /* A short silent WAV stands in for every clip; "missing" is a clip whose file isn't there. */
    const wavOf = n => { const b = Buffer.alloc(44 + n * 2); b.write('RIFF', 0); b.writeUInt32LE(36 + n * 2, 4); b.write('WAVEfmt ', 8);
      b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(8000, 24); b.writeUInt32LE(16000, 28); b.writeUInt16LE(2, 32);
      b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(n * 2, 40); return b; };
    const wav = (() => { const n = 1600, b = Buffer.alloc(44 + n * 2); b.write('RIFF', 0); b.writeUInt32LE(36 + n * 2, 4); b.write('WAVEfmt ', 8);
      b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(8000, 24); b.writeUInt32LE(16000, 28); b.writeUInt16LE(2, 32);
      b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(n * 2, 40); return b; })();
    const man = { 'that says': { f: 'that-says.wav', d: 200, t: [0, 100] }, 'come': { f: 'come.wav', d: 200 }, 'yes': { f: 'yes.wav', d: 200 },
      'come and read with me': { f: 'come-and-read-with-me.wav', d: 200, t: [0, 50, 100, 150, 180] }, 'some': { f: 'missing.wav', d: 200 }, 'from': { f: 'long.wav', d: 100 } };
    const q = await ctx.newPage(), clipReqs = [];
    q.on('pageerror', e => errs.push(e.message));
    await q.addInitScript(ttsStub);
    await q.route('**/audio/manifest.js*', r => r.fulfill({ contentType: 'text/javascript', body: 'window.LR = window.LR || {}; LR.clips = ' + JSON.stringify(man) + ';' }));
    await q.route('**/audio/clips/*', r => { const f = r.request().url().split('/').pop(); clipReqs.push(f);
      return f === 'missing.wav' ? r.fulfill({ status: 404, body: '' }) : f === 'long.wav' ? r.fulfill({ contentType: 'audio/wav', body: wavOf(8000 * 6) }) : r.fulfill({ contentType: 'audio/wav', body: wav }); });
    await q.goto(U + '#home'); await q.evaluate(() => localStorage.clear()); await q.reload(); await q.mouse.click(640, 5);
    const run = (text, opts) => q.evaluate(([t, o]) => { __tts.calls.length = 0; const words = [], caps = [];
      const el = document.getElementById('caption'), mo = new MutationObserver(() => caps.push(el.textContent)); mo.observe(el, { childList: true, characterData: true, subtree: true });
      const t0 = performance.now();
      return LR.speech.say(t, Object.assign({ onWord: i => words.push(i) }, o || {})).then(() => { mo.disconnect();
        return { tts: __tts.calls.map(c => c.text), words, caps: caps.filter(Boolean), ms: performance.now() - t0 }; }); }, [text, opts || null]);
    ok(await q.evaluate(() => JSON.stringify(LR.speech.resolve('That says come.'))) === '["that says","come"]', 'a sentence resolves into the longest clips it has: that says + come');
    ok(await q.evaluate(() => LR.speech.resolve('That says cone.')) === null, 'a sentence with a missing word does not resolve');
    let r = await run('That says come.');
    ok(r.tts.length === 0 && clipReqs.includes('that-says.wav') && clipReqs.includes('come.wav'), 'with clips, the sentence plays from its clips and the tablet voice stays silent: ' + JSON.stringify(r.tts));
    ok(r.caps.length === 0, 'with clips, no caption shows (Grown-ups can turn captions back on)');
    ok(JSON.stringify(r.words) === '[0,1,2]', 'words light in order from the clips’ word times: ' + JSON.stringify(r.words));
    r = await run('Come and read with me.', { parts: ['Come and', 'read with me.'] });
    ok(JSON.stringify(r.words) === '[0,1]' && r.tts.length === 0, 'a whole-sentence clip maps its word times onto the parts: ' + JSON.stringify(r.words));
    /* Sync: a word lights when the clip's own clock reaches its time, and sweeps get the clip's voice length. */
    const sync = await q.evaluate(() => { const at = [], t0 = performance.now();
      return LR.speech.say('That says come.', { onWord: i => at.push([i, performance.now() - t0]) }).then(() => at); });
    const w1 = sync.find(x => x[0] === 1), w0 = sync.find(x => x[0] === 0);
    ok(w0 && w1 && w1[1] - w0[1] >= 80, 'a clip’s second word lights at its time (100 ms), not with the first: ' + JSON.stringify(sync.map(x => [x[0], Math.round(x[1])])));
    ok(await q.evaluate(() => { LR.clips.look = { f: 'come.wav', d: 1000, t: [250] }; const ms = LR.speech.voiceMs('Look', 0.9); delete LR.clips.look; return ms === 550; }),
      'a sweep lasts as long as the clip’s voice (first word to the end of the sound), not the tablet-voice estimate');
    r = await run('That says cone.');
    ok(r.tts.join() === 'That says cone.' && r.caps.includes('That says cone.'), 'a sentence without all its clips is spoken by the tablet voice, with the caption');
    r = await run('Some');
    ok(r.tts.join() === 'Some' && r.caps.includes('Some'), 'a clip that fails to load falls back to the tablet voice and the caption');
    r = await run('From');
    ok(r.tts.length === 0 && r.ms < 2500, 'a clip that runs on past its length is ended by the watchdog (length + 1 s): ' + Math.round(r.ms) + ' ms');
    await q.evaluate(() => { LR.state.captions = true; });
    r = await run('Yes');
    ok(r.tts.length === 0 && r.caps.includes('Yes'), 'with captions on, clips play with the caption');
    await q.evaluate(() => { LR.state.clips = false; LR.state.captions = false; });
    r = await run('Yes');
    ok(r.tts.join() === 'Yes', 'with voice clips switched off, the tablet voice speaks');
    await q.evaluate(() => { LR.state.clips = true; });
    const pre = clipReqs.length;
    await q.evaluate(() => { LR.speech.cancel(); const t = LR.speech.say('Come and read with me.'); setTimeout(() => LR.speech.cancel(), 30); return t; });
    ok(await q.evaluate(() => !document.getElementById('caption').textContent), 'stopping a clip settles say() and clears the caption: ' + (clipReqs.length - pre));
    await q.goto(U + '#grownups');
    const [qa, qb] = (await q.textContent('.gate .prompt')).match(/(\d+) \+ (\d+)/).slice(1).map(Number);
    for (const k of String(qa + qb)) await q.click(`[data-k="${k}"]`);
    await q.click('[data-k="OK"]'); await q.waitForTimeout(40);
    ok(/6 voice clips are installed/.test(await q.textContent('#app')), 'Grown-ups says how many voice clips are installed');
    await q.click('[data-act=clips]');
    ok(await q.evaluate(() => JSON.parse(localStorage.getItem('littleReader.v1')).clips === false) && /Voice clips: off/.test(await q.textContent('[data-act=clips]')), 'Grown-ups can switch voice clips off, and it is saved');
    await q.click('[data-act=captions]');
    ok(await q.evaluate(() => JSON.parse(localStorage.getItem('littleReader.v1')).captions === true), 'Grown-ups can turn captions on with clips, and it is saved');
    await q.close();
  }

  // ---------- Voice clips (Phase 7) ----------
  const clipKeys = new Set(fs.readFileSync(path.join(ROOT, 'tools/clip-list.txt'), 'utf8').split(/\r?\n/).filter(l => l && l[0] !== '#').map(l => l.split('\t')[0]));
  const missing = await p.evaluate(([texts, keys]) => { const k = new Set(keys); return texts.filter(t => !LR.speech.resolve(t, x => k.has(x))); }, [[...heard].filter(t => !/still being spoken/.test(t)), [...clipKeys]]);
  ok(heard.size > 100 && !missing.length, `everything said in the tests (${heard.size} texts) can be played from tools/clip-list.txt` + (missing.length ? ': ' + missing.slice(0, 30).join(' | ') : ''));
  {
    /* The importer: 38 MP3 frames (128 kbps, 44.1 kHz) last 993 ms; word times are kept only if they fit the words. */
    const os = require('os'), tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lr-clips-')), inDir = path.join(tmp, 'in');
    fs.mkdirSync(inDir);
    const frame = Buffer.alloc(417); Buffer.from([0xFF, 0xFB, 0x90, 0x64]).copy(frame);
    const mp3 = Buffer.concat(Array(38).fill(frame));
    fs.writeFileSync(path.join(inDir, 'that-says.mp3'), mp3); fs.writeFileSync(path.join(inDir, 'that-says.json'), '[0, 400]');
    fs.writeFileSync(path.join(inDir, 'come.mp3'), mp3); fs.writeFileSync(path.join(inDir, 'come.json'), '[0, 5]');
    fs.writeFileSync(path.join(inDir, 'yes.mp3'), 'not an mp3');
    const imp = require('child_process').spawnSync(process.execPath, [path.join(ROOT, 'tools/import-clips.js'), inDir, '--out', tmp]);
    const sandbox = { window: {} }; sandbox.window = sandbox;
    require('vm').runInNewContext(fs.readFileSync(path.join(tmp, 'manifest.js'), 'utf8'), sandbox);
    const m = sandbox.LR.clips;
    ok(imp.status === 0 && Object.keys(m).length === 2 && m['that says'].d === 993 && JSON.stringify(m['that says'].t) === '[0,400]' && !m.come.t && !m.yes
      && fs.readdirSync(path.join(tmp, 'clips')).sort().join() === 'come.mp3,that-says.mp3', 'the clip importer copies the clips, measures them, keeps good word times and skips bad files');
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  {
    /* The installed clips (audio/manifest.js, from tools/import-clips.js): every entry is in the list, its file exists and has a length. */
    const sb = {}; sb.window = sb;
    require('vm').runInNewContext(fs.readFileSync(path.join(ROOT, 'audio/manifest.js'), 'utf8'), sb);
    const man = sb.LR.clips, keys = Object.keys(man);
    const badClips = keys.filter(k => !clipKeys.has(k) || !man[k] || typeof man[k].f !== 'string' || !(man[k].d > 0) || !fs.existsSync(path.join(ROOT, 'audio/clips', man[k].f)));
    ok(!badClips.length, `audio/manifest.js is valid: ${keys.length} of ${clipKeys.size} clips installed` + (badClips.length ? '; bad or missing files: ' + badClips.slice(0, 20).join(', ') : ''));
    if (keys.length) {
      /* One real clip plays in the browser, without the tablet voice. */
      const k = keys.includes('come') ? 'come' : keys[0];
      const q = await ctx.newPage();
      await q.addInitScript(ttsStub);
      await q.goto(U + '#home'); await q.evaluate(() => localStorage.clear()); await q.reload(); await q.mouse.click(640, 5);
      const res = await q.evaluate(t => { __tts.calls.length = 0; const t0 = performance.now(); return LR.speech.say(t).then(() => ({ tts: __tts.calls.length, ms: performance.now() - t0 })); }, k);
      ok(res.tts === 0 && res.ms > 100, `an installed clip plays in the browser ("${k}", ${Math.round(res.ms)} ms, no tablet voice)`);
      await q.close();
    }
  }
  const stale = require('child_process').spawnSync(process.execPath, [path.join(ROOT, 'tools/list-clips.js'), '--check']);
  ok(stale.status === 0, 'tools/clip-list.txt is up to date with the course and phrases');

  await b.close(); server.close();
  console.log(failed ? `\n${failed} failed` : '\nAll passed');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
