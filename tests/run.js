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
  ok((await p.textContent('#find-note')) === 'You found them all!', 'finding every heart completes the round');

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

  // Hungry crocodile: all 8 rounds
  await go('croc');
  const modes = []; let maxH = 0;
  for (let r = 0; r < 8; r++) {
    const s = await p.evaluate(() => ({ a:+document.querySelector('#num-a .n').textContent, b:+document.querySelector('#num-b .n').textContent, pick:!!document.querySelector('.sym'), read:!!document.querySelector('.say-btn') }));
    const sym = s.a > s.b ? '>' : '<', other = sym === '>' ? '<' : '>';
    if (s.read) { modes.push('read'); await p.click(`.say-btn[data-s="${other}"]`); await p.click(`.say-btn[data-s="${sym}"]`); }
    else if (s.pick) { modes.push('pick'); await p.click(`.sym[data-s="${other}"]`); await p.click(`.sym[data-s="${sym}"]`); }
    else { modes.push('tap'); await p.click('#num-' + (s.a > s.b ? 'b' : 'a')); await p.click('#num-' + (s.a > s.b ? 'a' : 'b')); }
    await p.waitForTimeout(100);
    maxH = Math.max(maxH, await height());
    await p.click('[data-act=nextc]'); await p.waitForTimeout(80);
  }
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
  ok(errs.length === 0, 'no page errors or CSP violations' + (errs.length ? ': ' + errs.join(' | ') : ''));

  await b.close(); server.close();
  console.log(failed ? `\n${failed} failed` : '\nAll passed');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
