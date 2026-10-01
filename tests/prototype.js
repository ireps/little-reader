/* Phase 4 prototype screenshots and checks. Run: npm run prototype
   Renders every screen of tools/prototype.html at 1280x614 and 800x1094 with reduced motion on, checks the UX rules
   that can be measured, and writes test-results/prototype/<size>-<screen>.png plus two contact sheets. Dev only. */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'test-results', 'prototype');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.woff2':'font/woff2' };
const server = http.createServer((req, res) => {
  const file = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

let failed = 0;
const ok = (c, m) => { if (!c) failed++; if (!c) console.log('FAIL ' + m); };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await new Promise(r => server.listen(0, r));
  const U = 'http://localhost:' + server.address().port + '/tools/prototype.html';
  const b = await chromium.launch();
  const sheets = {};
  let ids = [];
  for (const [w, h] of [[1280, 614], [800, 1094]]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
    const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await p.goto(U);
    ids = await p.evaluate(() => Object.keys(LR.prototype.SCREENS));
    const shots = [];
    for (const id of ids) {
      await p.goto(U + '#' + id); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(50);
      const file = path.join(OUT, `${w}x${h}-${id}.png`);
      await p.screenshot({ path: file });
      shots.push({ id, file, title: await p.evaluate(i => LR.prototype.SCREENS[i].t, id) });
      const grown = id.startsWith('grown');
      const m = await p.evaluate(grown => {
        const small = [...document.querySelectorAll('#app [data-act]')].filter(el => el.offsetParent).map(el => {
          const r = el.getBoundingClientRect();
          if (el.classList.contains('w')) return r.height >= 60 ? null : 'word ' + Math.round(r.height);
          if (el.classList.contains('lbtn')) return r.height >= 120 && r.width >= 60 ? null : 'letter';
          if (el.classList.contains('s-hold')) return r.width >= 72 ? null : 'hold';
          const min = grown ? 64 : 120;
          return r.width >= min && r.height >= min ? null : el.dataset.act + ' ' + Math.round(r.width) + 'x' + Math.round(r.height);
        }).filter(Boolean);
        return { scroll: document.documentElement.scrollHeight, targets: document.querySelectorAll('.s-target:not(.off)').length, small };
      }, grown);
      if (!grown) ok(m.scroll <= h, `${id} fits ${w}x${h} (${m.scroll})`);
      ok(m.targets <= 1, `${id} has at most one primary target (${m.targets})`);
      ok(!m.small.length, `${id} targets big enough at ${w}x${h}: ${m.small.join(', ')}`);
    }
    ok(!errs.length, `no errors or CSP violations at ${w}x${h}: ${errs.join(' | ')}`);
    sheets[`${w}x${h}`] = shots;
    await p.close();
  }
  // Contact sheets: every screen, captioned, for review.
  for (const [size, shots] of Object.entries(sheets)) {
    const land = size.startsWith('1280');
    const p = await b.newPage({ viewport: { width: land ? 1320 : 1350, height: 800 } });
    const cells = shots.map(s => `<figure><img src="data:image/png;base64,${fs.readFileSync(s.file).toString('base64')}"><figcaption><b>${s.id}</b> ${s.title.replace(/</g, '&lt;')}</figcaption></figure>`).join('');
    await p.setContent(`<!DOCTYPE html><html><head><style>
      body{margin:0;padding:16px;font:15px sans-serif;background:#f4f4f4;display:grid;grid-template-columns:repeat(${land ? 2 : 3},1fr);gap:14px}
      figure{margin:0;background:#fff;padding:8px;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.15)} img{width:100%;display:block;border:1px solid #ddd}
      figcaption{padding:6px 2px 0;line-height:1.3}</style></head><body>${cells}</body></html>`);
    await p.waitForTimeout(200);
    await p.screenshot({ path: path.join(OUT, `sheet-${land ? 'landscape' : 'portrait'}.png`), fullPage: true });
    await p.close();
  }
  await b.close(); server.close();
  console.log(`${ids.length} screens x 2 sizes in ${path.relative(ROOT, OUT)}` + (failed ? `\n${failed} failed` : '\nAll checks passed'));
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
