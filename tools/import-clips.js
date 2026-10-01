/* Imports voice clips into the app: checks the supplied files against tools/clip-list.txt, copies them to
   audio/clips/ and writes audio/manifest.js (each clip's file, length and word times). Dev only.
   Run: node tools/import-clips.js [folder]        default folder: audio/incoming/ (not committed)
        node tools/import-clips.js [folder] --out <dir>   write clips/ and manifest.js under <dir> (the tests use this)
   Each clip is named as in the second column of tools/clip-list.txt. MP3 is copied as it is; WAV is converted to
   MP3 (96 kbps mono, at the WAV's own sample rate, so the voice stays clear) with ffmpeg (which must then be installed). An optional <name>.json next to a clip holds the start of each
   word in ms ([0, 420, 900]), as tools/make-clips.ps1 writes; without it the app spreads the words evenly.
   Missing clips are fine: the app says those with the tablet's voice and shows the caption. */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const outAt = args.indexOf('--out');
const OUT = outAt > -1 ? path.resolve(args[outAt + 1]) : path.join(ROOT, 'audio');
const IN = path.resolve(args.find((a, i) => !a.startsWith('--') && (outAt < 0 || i !== outAt + 1)) || path.join(ROOT, 'audio/incoming'));
const CLIPS = path.join(OUT, 'clips');

/* The list: key <TAB> file name. */
const list = fs.readFileSync(path.join(__dirname, 'clip-list.txt'), 'utf8').split(/\r?\n/)
  .filter(l => l && l[0] !== '#').map(l => { const [key, file] = l.split('\t'); return { key, file, base: file.replace(/\.mp3$/, '') }; });

/* Length of an MP3 in ms, from its frame headers (MPEG 1, 2 and 2.5, Layer III). */
const RATES = { 3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000] };
const KBPS = { 3: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320], 2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160] };
function mp3Ms(buf){
  let i = 0, samples = 0, rate = 0;
  if (buf.slice(0, 3).toString() === 'ID3') i = 10 + ((buf[6] & 127) << 21 | (buf[7] & 127) << 14 | (buf[8] & 127) << 7 | (buf[9] & 127));
  while (i + 4 <= buf.length) {
    if (buf[i] !== 0xFF || (buf[i + 1] & 0xE0) !== 0xE0) { i++; continue; }
    const ver = (buf[i + 1] >> 3) & 3, layer = (buf[i + 1] >> 1) & 3, br = buf[i + 2] >> 4, sr = (buf[i + 2] >> 2) & 3, pad = (buf[i + 2] >> 1) & 1;
    if (ver === 1 || layer !== 1 || br === 0 || br === 15 || sr === 3) { i++; continue; }
    rate = RATES[ver][sr];
    const kbps = (ver === 3 ? KBPS[3] : KBPS[2])[br], per = ver === 3 ? 1152 : 576;
    const size = Math.floor(per / 8 * kbps * 1000 / rate) + pad;
    samples += per;
    i += size;
  }
  return rate ? Math.round(samples * 1000 / rate) : 0;
}

if (!fs.existsSync(IN)) { console.error('No folder ' + IN + ': put the clips there (see audio/README.md).'); process.exit(1); }
const have = new Set(fs.readdirSync(IN));
fs.mkdirSync(CLIPS, { recursive: true });
const manifest = {}, missing = [], bad = [];
let converted = 0;
for (const c of list) {
  const mp3 = path.join(IN, c.base + '.mp3'), wav = path.join(IN, c.base + '.wav'), dest = path.join(CLIPS, c.file);
  if (have.has(c.base + '.mp3')) fs.copyFileSync(mp3, dest);
  else if (have.has(c.base + '.wav')) {
    const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav, '-ac', '1', '-codec:a', 'libmp3lame', '-b:a', '96k', dest]);
    if (r.error) { console.error('Converting WAV to MP3 needs ffmpeg on the PATH (Windows: winget install Gyan.FFmpeg, then open a new terminal): ' + r.error.message); process.exit(1); }
    if (r.status !== 0) { console.error('ffmpeg could not convert ' + c.base + '.wav: ' + r.stderr); process.exit(1); }
    converted++;
  } else { missing.push(c.file); continue; }
  const d = mp3Ms(fs.readFileSync(dest));
  if (!d) { bad.push(c.file); fs.unlinkSync(dest); continue; }
  const entry = { f: c.file, d };
  if (have.has(c.base + '.json')) {
    let t = null;
    try { t = JSON.parse(fs.readFileSync(path.join(IN, c.base + '.json'), 'utf8')); } catch (e) {}
    const words = c.key.split(' ').length;
    if (Array.isArray(t) && t.length === words && t.every((x, i) => typeof x === 'number' && x >= 0 && x <= d && (!i || x >= t[i - 1]))) entry.t = t.map(Math.round);
    else console.warn('Ignoring word times in ' + c.base + '.json: expected ' + words + ' rising numbers within the clip');
  }
  manifest[c.key] = entry;
}
/* Clips in audio/clips/ that are no longer listed are removed. */
const listed = new Set(list.map(c => c.file));
let removed = 0;
for (const f of fs.readdirSync(CLIPS)) if (!listed.has(f) || !manifest[list.find(c => c.file === f).key]) { fs.unlinkSync(path.join(CLIPS, f)); removed++; }
const known = new Set(list.flatMap(c => [c.base + '.mp3', c.base + '.wav', c.base + '.json']));
const extra = [...have].filter(f => !known.has(f));

fs.writeFileSync(path.join(OUT, 'manifest.js'), '/* Voice clips: written by tools/import-clips.js (don\'t edit by hand). Empty until the clips are supplied;\n'
  + '   until then the tablet\'s voice speaks and captions show. { key: { f: file, d: length in ms, t: [start ms of each word] } } */\n'
  + 'window.LR = window.LR || {};\nLR.clips = ' + JSON.stringify(manifest, null, 0).replace(/},"/g, '},\n"') + ';\n');

const n = Object.keys(manifest).length;
console.log(`Imported ${n} of ${list.length} clips` + (converted ? ` (${converted} converted from WAV)` : '') + (removed ? `, removed ${removed} old` : '') + '.');
if (missing.length) console.log(`${missing.length} missing (the tablet's voice says these): ${missing.slice(0, 10).join(', ')}${missing.length > 10 ? ', …' : ''}`);
if (bad.length) console.log(`${bad.length} not readable as MP3, skipped: ${bad.slice(0, 10).join(', ')}`);
if (extra.length) console.log(`${extra.length} files not in the list, ignored: ${extra.slice(0, 10).join(', ')}`);
console.log('Bump ?v= in index.html, then run npm test.');
