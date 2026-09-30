/* Screenshots of every child screen and state, for review against the UX checklist. Run: npm run screens
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
    // Speech that lasts a while, so captions and highlights can be seen mid-way.
    await p.addInitScript(() => {
      function Utterance(text){ this.text = text; }
      const synth = { speaking:false, pending:false, getVoices(){ return []; }, speak(u){ if (u.text.trim()) window.__last = u.text; this.speaking = true; setTimeout(() => u.onstart && u.onstart({}), 5); }, cancel(){ this.speaking = false; } };
      Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
      window.SpeechSynthesisUtterance = Utterance;
    });
    const shot = async (name) => { await p.evaluate(() => document.fonts.ready); await p.screenshot({ path: path.join(OUT, `${w}x${h}-${name}.png`) }); };
    const go = async (r) => { await p.goto(U + '#home'); await p.goto(U + '#' + r); await p.waitForTimeout(150); };
    await p.goto(U); await p.evaluate(() => localStorage.clear()); await p.reload();
    await go('home'); await shot('home');
    await go('detective'); await p.mouse.click(2, 300); await p.click('[data-act=hear]'); await p.waitForTimeout(100); await shot('detective');
    const target = await p.evaluate(() => window.__last);
    const wrong = await p.$$eval('.card', (cs, t) => cs.map(c => c.dataset.w).find(x => x !== t), target);
    await p.click(`.card[data-w="${wrong}"]`); await p.waitForTimeout(300); await shot('detective-wrong');
    await p.click(`.card[data-w="${target}"]`); await p.waitForTimeout(100); await shot('detective-right');
    await go('hearts'); await p.mouse.click(2, 300); await p.click('[data-act=hear]'); await p.waitForTimeout(400); await shot('hearts');
    await p.click('[data-act=find]'); await p.waitForTimeout(100); await p.click('.lbtn[data-i="0"]'); await p.click('.lbtn[data-i="1"]'); await p.waitForTimeout(100); await shot('hearts-find');
    await go('story'); await shot('story-warmup');
    await p.click('[data-act=start]'); await p.waitForTimeout(100); await p.click('[data-act=read]'); await p.waitForTimeout(700); await shot('story');
    await p.click('[data-act=mode][data-m=myturn]'); await p.waitForTimeout(100); await shot('story-myturn');
    await go('croc'); await shot('croc');
    const s = await p.evaluate(() => ({ a:+document.querySelector('#num-a .n').textContent, b:+document.querySelector('#num-b .n').textContent }));
    await p.click('#num-' + (s.a > s.b ? 'b' : 'a')); await p.waitForTimeout(100); await shot('croc-wrong');
    await p.click('#num-' + (s.a > s.b ? 'a' : 'b')); await p.waitForTimeout(100); await shot('croc-right');
    await p.close();
  }
  await b.close(); server.close();
  console.log('Screenshots in ' + path.relative(ROOT, OUT));
})().catch(e => { console.error(e); process.exit(1); });
