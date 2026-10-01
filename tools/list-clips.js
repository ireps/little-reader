/* Lists every voice clip the app can need, from its own data: the course (words, stories, silly sentences,
   questions), pictures, letter names and sounds, the maths questions, and data/phrases.js.
   Run: node tools/list-clips.js          writes tools/clip-list.txt (key <TAB> file name)
        node tools/list-clips.js --check  exits 1 if tools/clip-list.txt is out of date (npm test runs this)
   A key is the text in lower case without punctuation; LR.speech plays a sentence as its whole clip, or as the
   longest known pieces clause by clause, so fixed phrases and words can be combined. Dev only. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'clip-list.txt');

/* Load the app's data scripts (classic scripts on LR) in a sandbox. */
const sandbox = { console };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext('var LR = window.LR = { ui: { esc: function(s){ return String(s); } } };', sandbox);
['data/units.js', 'data/units-p5.js', 'data/pictures.js', 'data/phrases.js', 'js/words.js', 'js/maths.js'].forEach(f => {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f });
});
const LR = sandbox.LR, W = LR.words, M = LR.maths;

/* The same rules as LR.speech.keyOf() and its clause split. */
const keyOf = s => String(s).toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
const clauses = s => String(s).split(/[.!?,;:"“”]+/).map(keyOf).filter(Boolean);

const keys = new Set();
const add = s => { const k = keyOf(s); if (k) keys.add(k); };
const words = s => (String(s).match(/[A-Za-z0-9']+/g) || []).forEach(add);

/* 1. The course: every word on its own, every sentence whole, every question and answer. */
LR.units.forEach(u => {
  u.words.concat(u.tricky).forEach(add);
  u.stories.forEach(st => {
    st.s.forEach(s => { add(s); words(s); });
    (st.q || []).forEach(q => { add(q.q); q.opts.forEach(add); });
  });
  (u.silly || []).forEach(x => { add(x.s); words(x.s); });
});
(LR.knownTricky || []).forEach(add);
Object.keys(W.HEARTS).forEach(add);
W.FAMILIES.forEach(f => f.words.forEach(add));
W.BANK.forEach(add);
Object.values(W.LETTER_NAMES).forEach(add);
W.BASE.concat(W.P5).forEach(g => add(W.soundOf(g)));

/* 2. Pictures and language tasks. */
Object.keys(LR.pictures).forEach(add);
LR.lang.rhymes.forEach(p => p.forEach(add));
LR.lang.an.forEach(w => add('an ' + w));
LR.lang.a.forEach(w => add('a ' + w));
LR.lang.plural.forEach(w => { add(w); add(w + 's'); });
Object.values(LR.lang.position).forEach(add);
['a', 'an', 'in', 'on', 'under'].forEach(add);

/* 3. Numbers and names used in maths. */
for (let n = 0; n <= 100; n++) add(String(n));
M.NAMES.forEach(add);
['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'].forEach(add);
const atoms = new Set(keys);

/* Breaks a clause into atoms (numbers, words already listed) and new fixed pieces between them. */
function pieces(clause){
  const w = clause.split(' ');
  let run = [];
  const flush = () => { if (run.length) { keys.add(run.join(' ')); run = []; } };
  w.forEach(t => { if (/^\d+$/.test(t) || M.NAMES.includes(t)) { flush(); keys.add(t); } else run.push(t); });
  flush();
}

/* 4. Fixed phrases: each {w} is a slot for a word or number; the parts around it become their own clips. */
LR.phrases.forEach(p => p.split('{w}').forEach(part => clauses(part).forEach(k => keys.add(k))));

/* 5. Maths: every prompt and answer the generators can make (many seeds per skill and level). */
M.ids.forEach(s => [1, 2].forEach(lv => {
  for (let seed = 1; seed <= 4000; seed++) {
    const q = M.gen({ s, lv, seed });
    if (!q) continue;
    [q.prompt, q.right, q.right.replace(/^Yes! /, '')].forEach(t => clauses(t).forEach(c => (atoms.has(c) ? keys.add(c) : pieces(c))));
    q.opts.forEach(o => clauses(o.label).forEach(pieces));
  }
}));

/* File names: the key with dashes, unique. */
const used = new Set(), lines = [...keys].sort().map(k => {
  let base = k.replace(/'/g, '').replace(/ /g, '-').slice(0, 60) || 'clip', f = base, i = 2;
  while (used.has(f)) f = base + '-' + i++;
  used.add(f);
  return k + '\t' + f + '.mp3';
});
const text = '# Voice clips for Little Reader: key <TAB> file name. Made by tools/list-clips.js; do not edit by hand.\n'
  + '# Supply one Indian English computer-voice recording per line, named as in the second column (see audio/README.md).\n'
  + lines.join('\n') + '\n';

if (process.argv.includes('--check')) {
  const now = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8').replace(/\r\n/g, '\n') : '';
  if (now !== text) { console.error('tools/clip-list.txt is out of date: run node tools/list-clips.js'); process.exit(1); }
  console.log('tools/clip-list.txt is up to date (' + lines.length + ' clips)');
} else {
  fs.writeFileSync(OUT, text);
  console.log('Wrote tools/clip-list.txt: ' + lines.length + ' clips');
}
