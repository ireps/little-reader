/* Screenshots of the real app's screens and states, for review against the UX checklist. Run: npm run screens
   Writes test-results/screens/<size>-<name>.png at the Fire HD 10's sizes with reduced motion on. Dev only. */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'test-results', 'screens');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.woff2':'font/woff2' };
const server = http.createServer((req, res) => {
  const file = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/^\/$/, '/index.html'));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await new Promise(r => server.listen(0, r));
  const U = 'http://localhost:' + server.address().port + '/index.html';
  const b = await chromium.launch();
  for (const [w, h] of [[1280, 614], [800, 1094]]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce', hasTouch: true });
    // Speech that ends quickly, so the session moves on; captions still show while it lasts.
    await p.addInitScript(() => {
      function Utterance(text){ this.text = text; }
      const synth = { speaking:false, pending:false, getVoices(){ return []; },
        speak(u){ this._u = u; setTimeout(() => u.onstart && u.onstart({}), 3); setTimeout(() => { if (this._u === u) { this._u = null; u.onend && u.onend({}); } }, window.__endMs || 20); },
        cancel(){ this._u = null; } };
      Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
      window.SpeechSynthesisUtterance = Utterance;
    });
    const shot = async (name) => { await p.evaluate(() => document.fonts.ready); await p.screenshot({ path: path.join(OUT, `${w}x${h}-${name}.png`) }); };
    const item = () => p.evaluate(() => { const r = LR.state.resume, st = r && r.steps[r.at[0]]; return { step: st && st.id, at: r && r.at, it: st && st.items[r.at[1]] }; });
    const next = (at) => p.waitForFunction(a => { const r = LR.state.resume; return location.hash === '#home' || (r && (r.at[0] !== a[0] || r.at[1] !== a[1])); }, at, { timeout: 8000 });
    await p.goto(U + '#home'); await p.evaluate(() => localStorage.clear()); await p.reload();
    await shot('home-first');
    await p.mouse.click(640, 5); await p.click('[data-act=start]'); await p.waitForTimeout(100);
    const taken = new Set();
    for (let i = 0; i < 40; i++) {
      if (await p.evaluate(() => location.hash) === '#home') break;
      const c = await item(), it = c.it;
      if (c.step === 'garden') { await p.waitForSelector('[data-act=done]:not([disabled])'); await shot('garden'); await p.click('[data-act=done]'); await p.waitForTimeout(100); continue; }
      const key = it.t + (it.m || '');
      if (it.t === 'find') {
        if (!taken.has(key)) {
          await shot('find'); const wrong = await p.$$eval('.s-card', (x, w) => x.map(e => e.dataset.w).find(v => v !== w), it.w);
          await p.evaluate(() => { window.__endMs = 1500; }); await p.click(`.s-card[data-w="${wrong}"]`); await p.waitForTimeout(80); await shot('find-wrong');
          await p.evaluate(() => { window.__endMs = 20; });
        }
        await p.evaluate(() => { window.__endMs = 1500; });
        await p.click(`.s-card[data-w="${it.w}"]`); await p.waitForTimeout(80);
        if (!taken.has(key)) await shot('find-right');
        await p.evaluate(() => { window.__endMs = 20; });
      } else if (it.t === 'tricky') {
        await p.evaluate(() => { window.__endMs = 700; });
        await p.waitForTimeout(250); if (!taken.has(key)) await shot('tricky-meet');
        await p.evaluate(() => { window.__endMs = 20; });
        await p.waitForSelector('.lbtn'); if (!taken.has(key)) await shot('tricky-find');
        const hs = await p.evaluate(w => LR.words.heartsFor(w), it.w);
        await p.evaluate(() => { window.__endMs = 1500; });
        for (const k of hs) await p.click(`.lbtn[data-i="${k}"]`);
        await p.waitForSelector('.s-main .chip', { timeout: 5000 }).catch(() => {});
        if (!taken.has(key)) await shot('tricky-family');
        await p.evaluate(() => { window.__endMs = 20; });
      } else if (it.t === 'read') {
        await p.waitForSelector('[data-act=check]:not([disabled])');
        if (!taken.has(key)) { await shot('read'); await p.click('.s-sentence .w[data-w="frog"]').catch(() => {}); await p.waitForTimeout(60); await shot('read-help'); }
        await p.evaluate(() => { window.__endMs = 1500; });
        await p.click('[data-act=check]'); await p.waitForTimeout(500);
        if (!taken.has(key)) await shot('read-playing');
        await p.evaluate(() => { window.__endMs = 20; });
      } else if (it.t === 'croc') {
        if (!taken.has(key)) await shot('maths-' + it.m);
        if (it.m === 'more') await p.click(`[data-act=num][data-side="${it.a > it.b ? 'a' : 'b'}"]`);
        else await p.click(`[data-act=sym][data-s="${it.a > it.b ? '>' : '<'}"]`);
      }
      taken.add(key);
      await next(c.at);
    }
    await p.waitForTimeout(100); await shot('home-done');
    // Go on, after the re-prompts
    await p.evaluate(() => { const t = LR.progress.today(); LR.state.resume = null; LR.state.items['w:come'] = { b: 2, d: t, u: '', m: 0 }; LR.session.IDLE_MS = 60; });
    await p.click('[data-act=start]'); await p.waitForSelector('[data-act=goon]', { timeout: 5000 }).catch(() => {}); await shot('go-on');
    // Grown-ups
    await p.goto(U + '#grownups'); await shot('grownups-gate');
    const [a, bb] = (await p.textContent('.gate .prompt')).match(/(\d+) \+ (\d+)/).slice(1).map(Number);
    for (const k of String(a + bb)) await p.click(`[data-k="${k}"]`);
    await p.click('[data-k="OK"]'); await p.waitForTimeout(80); await shot('grownups');
    await p.click('[data-act=reset]'); await p.waitForTimeout(50); await shot('grownups-confirm');
    await p.close();
  }
  await b.close(); server.close();
  console.log('Screenshots in ' + path.relative(ROOT, OUT));
})().catch(e => { console.error(e); process.exit(1); });
