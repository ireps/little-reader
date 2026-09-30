/* Browser checks for Little Reader. Run: npm test
   Needs Playwright (dev only, never shipped): npm install && npx playwright install chromium
   Serves the repo itself, opens it at the Fire HD 10's real size (1280 x 614 landscape, 800 x 1094 portrait)
   with reduced motion on, as the tablet has it. */
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
  const p = await b.newPage({ viewport: { width: 1280, height: 614 }, reducedMotion: 'reduce', hasTouch: true });
  const errs = [], hosts = new Set();
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text()); });
  p.on('request', r => hosts.add(new URL(r.url()).host));
  let dialog = false; p.on('dialog', d => { dialog = true; d.dismiss(); });
  // A stand-in for the tablet's speech engine: records each utterance and when it was requested.
  // __tts.endMs sets how long speaking takes; __tts.never = true means onend never fires (to test the watchdog).
  await p.addInitScript(() => {
    const tts = window.__tts = { calls: [], endMs: 30, never: false };
    function Utterance(text){ this.text = text; }
    const synth = {
      speaking: false, pending: false, onvoiceschanged: null, _u: null,
      getVoices(){ return [{ name: 'English United States', lang: 'en_US', voiceURI: 'en-us' }]; },
      speak(u){
        tts.calls.push({ text: u.text, t: performance.now() });
        this._u = u; this.speaking = true;
        setTimeout(() => { if (this._u === u && u.onstart) u.onstart({}); }, 5);
        if (tts.never) return;
        setTimeout(() => { if (this._u !== u) return; this._u = null; this.speaking = false; if (u.onend) u.onend({}); }, tts.endMs);
      },
      cancel(){ this._u = null; this.speaking = false; }
    };
    Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
    window.SpeechSynthesisUtterance = Utterance;
  });
  const said = () => p.evaluate(() => __tts.calls.map(c => c.text).filter(t => t.trim()));
  const touch = () => p.mouse.click(2, 300);
  const seed = async (state) => {
    await p.goto(U);
    await p.evaluate(s => { localStorage.clear(); if (s) localStorage.setItem('littleReader.v1', JSON.stringify(s)); }, state || null);
    await p.reload();
  };
  const go = async (r) => { await p.goto(U + '#home'); await p.goto(U + '#' + r); await p.waitForTimeout(250); };
  const height = () => p.evaluate(() => document.documentElement.scrollHeight);
  const openGrownups = async () => {
    await go('grownups');
    const m = (await p.textContent('label[for=ans]')).match(/(\d+) \+ (\d+)/);
    await p.fill('#ans', String(+m[1] + +m[2])); await p.click('[data-act=open]'); await p.waitForTimeout(100);
  };

  // Every screen fits the tablet in both orientations
  await seed();
  for (const [w, h] of [[1280, 614], [800, 1094]]) {
    await p.setViewportSize({ width: w, height: h });
    for (const r of ['home', 'detective', 'hearts', 'story', 'croc', 'grownups']) {
      await go(r);
      if (r === 'story') await p.click('[data-act=start]');
      if (r !== 'grownups') { const sh = await height(); ok(sh <= h, `${r} fits ${w}x${h} (${sh})`); }
    }
  }
  await p.setViewportSize({ width: 1280, height: 614 });

  // Word detective: her mix-ups become the distractors, and new mix-ups are saved
  await seed({ words:['come'], story:'Go.', confusions:{ come:{ cone:2, came:1 } } });
  let seen = null;
  for (let i = 0; i < 8 && !seen; i++) { await go('detective'); const c = await p.$$eval('.card', cs => cs.map(x => x.dataset.w)); if (c.includes('come')) seen = c; }
  ok(seen && seen.includes('cone') && seen.includes('came'), 'detective uses her mix-ups as distractors: ' + seen);
  await seed({ words:['pots'], story:'' });
  await go('detective');
  const wrong = await p.$$eval('.card', cs => cs.map(c => c.dataset.w).find(w => w !== 'pots'));
  await p.click(`.card[data-w="${wrong}"]`); await p.waitForTimeout(150);
  ok(await p.evaluate(w => (LR.state.confusions.pots || {})[w] === 1, wrong), 'a wrong pick is saved as a mix-up');
  ok(await p.$eval(`.card[data-w="${wrong}"]`, c => c.disabled && c.classList.contains('wrong')), 'the wrong card is marked and disabled');

  // Heart words
  await seed({ words:['come'], story:'' });
  await p.goto(U + '#home'); await p.goto(U + '#hearts');
  ok(await p.$eval('.family', f => f.hidden), 'family hidden before she hears the word');
  await p.waitForTimeout(250);
  await p.click('[data-act=hear]'); await p.waitForTimeout(100);
  ok(await p.$eval('.family', f => !f.hidden), 'family shown after Hear it');
  await p.click('[data-act=find]'); await p.waitForTimeout(150);
  ok(await p.$$eval('.lbtn.h', x => x.length) === 0, 'Find the heart starts with hearts hidden');
  await p.click('.lbtn[data-i="0"]');
  ok(await p.$eval('.lbtn[data-i="0"]', x => x.classList.contains('plain')), 'a plain letter turns grey');
  await p.click('.lbtn[data-i="1"]'); await p.click('.lbtn[data-i="3"]'); await p.waitForTimeout(100);
  ok((await said()).includes('You found them all! come.') && !(await p.$('#find-note')), 'finding every heart completes the round and goes straight back to the word');

  // Read the story
  await seed({ words:['come'], story:'Some plants have thorns. A rose plant has many thorns.' });
  await go('story');
  ok(await p.$$eval('.chip', c => c.map(x => x.dataset.w).includes('some')), 'warm-up lists the story\'s heart words');
  await p.click('[data-act=start]'); await p.waitForTimeout(100);
  await p.click('.w'); await p.waitForTimeout(100);
  ok(await p.evaluate(() => LR.state.tricky.some === 1), 'tapping a word counts it as a help word');
  const tall = await p.$eval('.sentence .w', x => x.getBoundingClientRect().height);
  ok(tall >= 60, 'story words are at least 60 px tall (' + Math.round(tall) + ')');
  await p.click('[data-act=mode][data-m=myturn]'); await p.waitForTimeout(100);
  ok(await p.$eval('[data-act=read]', x => x.hidden), 'My turn hides Now listen at first');
  await p.click('[data-act=tried]'); await p.waitForTimeout(100);
  ok(await p.$eval('[data-act=read]', x => !x.hidden), 'I read it reveals Now listen');
  ok(await p.evaluate(() => JSON.parse(localStorage.getItem('littleReader.v1')).storyMode === 'myturn'), 'My turn is remembered');

  // Hungry crocodile: all 8 rounds, each starting by itself once the answer has been spoken
  await go('croc');
  const modes = []; let maxH = 0;
  for (let r = 0; r < 8; r++) {
    if (r) await p.waitForFunction(n => document.querySelectorAll('.dot.on').length === n, r, { timeout: 8000 });
    const s = await p.evaluate(() => ({ a:+document.querySelector('#num-a .n').textContent, b:+document.querySelector('#num-b .n').textContent, pick:!!document.querySelector('.sym'), read:!!document.querySelector('.say-btn') }));
    const sym = s.a > s.b ? '>' : '<', other = sym === '>' ? '<' : '>';
    if (s.read) { modes.push('read'); await p.click(`.say-btn[data-s="${other}"]`); await p.click(`.say-btn[data-s="${sym}"]`); }
    else if (s.pick) { modes.push('pick'); await p.click(`.sym[data-s="${other}"]`); await p.click(`.sym[data-s="${sym}"]`); }
    else { modes.push('tap'); await p.click('#num-' + (s.a > s.b ? 'b' : 'a')); await p.click('#num-' + (s.a > s.b ? 'a' : 'b')); }
    maxH = Math.max(maxH, await height());
  }
  await p.waitForSelector('.done', { timeout: 8000 });
  ok(modes.join(',') === 'tap,tap,pick,read,tap,pick,read,pick', 'crocodile rounds: ' + modes.join(','));
  ok(maxH <= 614, 'crocodile fits 614 px in every round, after solving too (' + maxH + ')');
  ok((await p.textContent('.prompt')).includes('fed the crocodile'), 'crocodile reaches the end screen');

  // Grown-ups: escaping, saving, mix-ups
  await seed({ words:['pots'], story:'', confusions:{ pots:{ plants:2 } }, tricky:{ pots:2 } });
  await openGrownups();
  ok((await p.textContent('#tricky')).includes('pots, picked plants ×2'), 'Grown-ups lists mix-ups');
  await p.click('[data-act=clear]'); await p.waitForTimeout(80);
  ok(await p.evaluate(() => !Object.keys(LR.state.confusions).length && !Object.keys(LR.state.tricky).length), 'Clear list clears help words and mix-ups');
  await p.fill('#gw', 'come, <img src=x onerror=alert(1)>, glow');
  await p.fill('#gs', 'I <img src=x onerror=alert(1)> can read. <b>Bold</b> test.');
  await p.click('[data-act=save]'); await p.waitForTimeout(100);
  await go('story'); await p.click('[data-act=start]').catch(() => {}); await p.waitForTimeout(150);
  await go('hearts'); await go('detective');
  ok(!dialog && !(await p.evaluate(() => !!document.querySelector('#app img, #app b'))), 'HTML typed by a parent shows as text, never runs');

  // Storage: migration from the prototype, and cleaning bad data
  await p.goto(U); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('readingGarden.v1', JSON.stringify({ words:['want','was'], story:'I was here.', tricky:{ was:2 } })); });
  await p.reload();
  ok(await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('littleReader.v1')); return s && s.words.join() === 'want,was' && s.tricky.was === 2; }), 'Reading Garden data migrates');
  await p.evaluate(() => localStorage.setItem('littleReader.v1', JSON.stringify({ words:'nope', confusions:{ '<b>x</b>':{ '<img>':5, y:'bad' } }, storyMode:'evil', rate:99 })));
  await p.reload();
  ok(await p.evaluate(() => Array.isArray(LR.state.words) && JSON.stringify(LR.state.confusions) === '{"bxb":{"img":5}}' && LR.state.storyMode === 'together' && LR.state.rate === 0.8), 'bad stored data is cleaned on load');

  ok([...hosts].every(h => h.startsWith('localhost')), 'no requests leave the site: ' + [...hosts].join(', '));
  // ---------- Phase 3: speed, speech, feedback, sizes, captions ----------

  // No speech before the first touch; the caption shows what would be said
  await seed({ words:['come'], story:'' });
  await p.evaluate(() => { __tts.calls.length = 0; });
  await go('detective');
  ok((await said()).length === 0, 'nothing is spoken before the first touch');
  ok((await p.textContent('#caption')) === 'come', 'the caption shows the word before any touch');
  await touch(); await p.waitForTimeout(50);
  await p.click('[data-act=hear]'); await p.waitForTimeout(80);
  ok((await said()).includes('come'), 'speech works after the first touch');

  // Captions: shown while speaking, cleared after, never covering a tap target
  await p.evaluate(() => { __tts.endMs = 600; });
  await p.click('[data-act=hear]'); await p.waitForTimeout(100);
  ok((await p.textContent('#caption')) === 'come', 'the caption shows while speaking');
  const overlap = await p.evaluate(() => {
    const c = document.getElementById('caption').getBoundingClientRect();
    return [...document.querySelectorAll('[data-act]')].some(el => { const r = el.getBoundingClientRect();
      return r.width && !(r.right <= c.left || r.left >= c.right || r.bottom <= c.top || r.top >= c.bottom); });
  });
  ok(!overlap, 'the caption covers no tap target');
  await p.waitForTimeout(700);
  ok((await p.textContent('#caption')) === '', 'the caption clears when speech ends');
  await p.evaluate(() => { __tts.endMs = 30; });

  // Speed, with the CPU slowed 6x: something visible within 100 ms, speech requested within 50 ms (130 ms if busy)
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
  const timeTap = (which, busy, target) => p.evaluate(async ([which, busy, target]) => {
    const cards = [...document.querySelectorAll('.card:not([disabled])')];
    const el = which === 'right' ? cards.find(c => c.dataset.w === target) : cards.find(c => c.dataset.w !== target);
    if (busy) { __tts.endMs = 5000; LR.speech.say('A long sentence that is still being spoken.'); await new Promise(r => setTimeout(r, 40)); }
    const n = __tts.calls.length, t0 = performance.now();
    el.click();
    const changed = el.classList.contains('fb-' + which);
    await new Promise(r => requestAnimationFrame(() => r()));
    const tFrame = performance.now() - t0;
    await new Promise(r => setTimeout(r, busy ? 250 : 120));
    const call = __tts.calls.slice(n).find(c => c.text.trim());
    __tts.endMs = 30;
    return { changed, tFrame, tSpeak: call ? call.t - t0 : 9999 };
  }, [which, busy, target]);
  const freshRound = async () => {
    await seed({ words:['come'], story:'' }); await go('detective'); await touch(); await p.waitForTimeout(60);
    await p.click('[data-act=hear]'); await p.waitForTimeout(150);
    return (await said()).slice(-1)[0];
  };
  let tg = await freshRound();
  let t = await timeTap('wrong', false, tg);
  ok(t.changed && t.tFrame < 100, `wrong tap shows within 100 ms (${Math.round(t.tFrame)})`);
  ok(t.tSpeak < 50, `wrong tap requests speech within 50 ms (${Math.round(t.tSpeak)})`);
  tg = await freshRound();
  t = await timeTap('wrong', true, tg);
  ok(t.changed && t.tFrame < 100, `tap during speech shows within 100 ms (${Math.round(t.tFrame)})`);
  ok(t.tSpeak < 130, `tap during speech requests speech within 130 ms (${Math.round(t.tSpeak)})`);
  tg = await freshRound();
  t = await timeTap('right', false, tg);
  ok(t.changed && t.tFrame < 100, `right tap shows within 100 ms (${Math.round(t.tFrame)})`);
  ok(t.tSpeak < 50, `right tap requests speech within 50 ms (${Math.round(t.tSpeak)})`);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });

  // Double taps count once; a solved item ignores taps
  await seed({ words:['come'], story:'' }); await go('detective'); await touch(); await p.waitForTimeout(60);
  await p.evaluate(() => { __tts.endMs = 800; });
  await p.click('[data-act=hear]'); await p.waitForTimeout(60);
  const tgt = (await said()).slice(-1)[0];
  await p.click(`.card[data-w="${tgt}"]`); await p.click(`.card[data-w="${tgt}"]`, { force: true });
  await p.waitForTimeout(100);
  ok((await said()).filter(x => x === 'Yes! ' + tgt).length === 1, 'a double tap on the right answer counts once');
  await p.evaluate(() => { __tts.endMs = 30; });

  // No fixed waits: the next word comes as soon as the praise ends
  await seed({ words:['come'], story:'' }); await go('detective'); await touch(); await p.waitForTimeout(60);
  await p.click('[data-act=hear]'); await p.waitForTimeout(60);
  const tgt2 = (await said()).slice(-1)[0];
  const tNext = await p.evaluate(async w => {
    const t0 = performance.now(); document.querySelector(`.card[data-w="${w}"]`).click();
    while (!document.querySelector('.dot.on')) await new Promise(r => setTimeout(r, 5));
    return performance.now() - t0;
  }, tgt2);
  ok(tNext < 30 + 150, `the next word appears as soon as the praise ends (${Math.round(tNext)} ms)`);

  // No stalls: if speech never ends, the watchdog moves on
  await seed({ words:['come'], story:'' }); await go('detective'); await touch(); await p.waitForTimeout(60);
  await p.click('[data-act=hear]'); await p.waitForTimeout(60);
  const tgt3 = (await said()).slice(-1)[0];
  await p.evaluate(() => { __tts.never = true; });
  await p.click(`.card[data-w="${tgt3}"]`);
  const moved = await p.waitForFunction(() => document.querySelector('.dot.on'), null, { timeout: 5000 }).then(() => true, () => false);
  ok(moved, 'when speech never ends, the lesson still moves on');
  await p.evaluate(() => { __tts.never = false; });

  // One utterance per sentence, words lit in order while it is spoken, none lit after a stop
  await seed({ words:['come'], story:'The frog can jump on the log.' }); await go('story'); await touch();
  await p.click('[data-act=start]').catch(() => {}); await p.waitForTimeout(60);
  // How fast words light depends on the speed calibrated from earlier utterances, so sample for the whole sentence.
  await p.evaluate(() => { __tts.calls.length = 0; __tts.endMs = 3000; });
  await p.click('[data-act=read]');
  const lit = [];
  for (let i = 0; i < 56; i++) { lit.push(await p.evaluate(() => [...document.querySelectorAll('.sentence .w')].findIndex(w => w.classList.contains('say')))); await p.waitForTimeout(50); }
  const order = lit.filter((x, i) => x >= 0 && x !== lit[i - 1]);
  ok((await said()).join('|') === 'The frog can jump on the log.', 'a sentence is spoken as one utterance');
  ok(order.length >= 3 && order[0] === 0 && order.every((x, i) => !i || x > order[i - 1]), 'words light in order while the sentence is spoken: ' + order.join(','));
  await p.evaluate(() => LR.ui.stopAll());
  ok(await p.$$eval('.sentence .w.say', x => x.length) === 0, 'no word stays lit after a stop');
  await p.evaluate(() => { __tts.endMs = 30; });

  // Say, spell, say: exactly 3 utterances, letters lit during the spelling
  await seed({ words:['come'], story:'' }); await go('hearts'); await touch(); await p.waitForTimeout(80);
  await p.evaluate(() => { __tts.calls.length = 0; __tts.endMs = 400; });
  await p.click('[data-act=spell]');
  let sawLit = false;
  for (let i = 0; i < 30; i++) { if (await p.$('.big-word .l.lit')) sawLit = true; await p.waitForTimeout(50); }
  ok((await said()).length === 3 && (await said())[1].indexOf('see') === 0, 'say-spell-say is 3 utterances: ' + (await said()).join(' | '));
  ok(sawLit, 'letters light while their names are spoken');
  await p.evaluate(() => { __tts.endMs = 30; });

  // Feedback: never red, never a cross; the wrong state is dimmed with a dot
  await seed({ words:['pots'], story:'' }); await go('detective'); await touch(); await p.waitForTimeout(60);
  const wrong2 = await p.$$eval('.card', cs => cs.map(c => c.dataset.w).find(w => w !== 'pots'));
  await p.click(`.card[data-w="${wrong2}"]`); await p.waitForTimeout(60);
  const fb = await p.$eval(`.card[data-w="${wrong2}"]`, c => ({ op: getComputedStyle(c).opacity, bg: getComputedStyle(c).backgroundColor, dot: !!c.querySelector('.fb-mark .ic-dot') }));
  ok(fb.dot && +fb.op < 0.6 && !/rgb\((2[0-9]{2}), ([0-9]{1,2}), /.test(fb.bg), 'a wrong answer is dimmed with a dot, not red: ' + JSON.stringify(fb));

  // Child tap targets: at least 120 x 120 px (words in a sentence: 60 px tall; letters of a word: 120 px tall, 60 px wide)
  for (const [w, h] of [[1280, 614], [800, 1094]]) {
    await p.setViewportSize({ width: w, height: h });
    const small = [];
    const check = async (name) => small.push(...(await p.$$eval('#app [data-act]', (els, name) => els.filter(el => el.offsetParent).map(el => {
      const r = el.getBoundingClientRect(), inText = el.classList.contains('w'), letter = el.classList.contains('lbtn');
      const okay = inText ? r.height >= 60 : letter ? r.height >= 120 && r.width >= 60 : r.width >= 120 && r.height >= 120;
      return okay ? null : `${name}:${el.dataset.act} ${Math.round(r.width)}x${Math.round(r.height)}`;
    }).filter(Boolean), name)));
    await seed({ words:['come', 'some'], story:'Some plants have thorns.' });
    await go('detective'); await check('detective');
    await go('hearts'); await touch(); await p.waitForTimeout(80); await p.click('[data-act=hear]'); await p.waitForTimeout(80); await check('hearts');
    await p.click('[data-act=find]'); await p.waitForTimeout(80); await check('find');
    await go('story'); await check('warm-up'); await p.click('[data-act=start]'); await p.waitForTimeout(80); await check('story');
    await go('croc'); await check('croc');
    ok(small.length === 0, `child targets are big enough at ${w}x${h}` + (small.length ? ': ' + small.join(', ') : ''));
    for (const r of ['home', 'detective', 'hearts', 'story', 'croc']) {
      await go(r);
      if (r === 'hearts') { await touch(); await p.click('[data-act=hear]'); await p.waitForTimeout(80); }
      if (r === 'story') await p.click('[data-act=start]');
      const sh = await height(); ok(sh <= h, `${r} still fits ${w}x${h} (${sh})`);
    }
  }
  await p.setViewportSize({ width: 1280, height: 614 });

  // Interface icons are SVG: no emoji in the header, buttons, tiles or rewards
  const emo = [];
  for (const r of ['home', 'detective', 'hearts', 'story', 'croc']) {
    await go(r);
    emo.push(...(await p.$$eval('header, button, a, .stars, .title', els => els.map(e => e.textContent).filter(t => /\p{Extended_Pictographic}/u.test(t)))));
  }
  ok(emo.length === 0, 'no emoji in interface chrome' + (emo.length ? ': ' + emo.join(' ') : ''));

  // Andika is loaded and used for reading text
  await go('hearts');
  const font = await p.evaluate(async () => { await document.fonts.ready; return { loaded: [...document.fonts].some(f => /Andika/.test(f.family) && f.status === 'loaded'), family: getComputedStyle(document.querySelector('.big-word')).fontFamily }; });
  ok(font.loaded && /^"?Andika/.test(font.family), 'Andika is loaded and used: ' + font.family);

  ok(errs.length === 0, 'no page errors or CSP violations' + (errs.length ? ': ' + errs.join(' | ') : ''));

  await b.close(); server.close();
  console.log(failed ? `\n${failed} failed` : '\nAll passed');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
