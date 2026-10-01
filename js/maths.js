/* KG-2 maths (NCF-FS 2022 numeracy outcomes): the skills, in the order they unlock, and a generator for each.
   An item is { s: skill, lv: 1 or 2, seed }: the same seed always makes the same question, so a resumed session
   shows what it showed before. gen() returns { prompt, show (HTML), opts: [{ v, html, label }], answer, right, count }.
   Pictures are inline SVG or emoji up to Unicode 6. No red, no crosses: taken-away things are drawn faded. */
(function(){
'use strict';
var LR = window.LR = window.LR || {};
function esc(s){ return LR.ui.esc(s); }

/* A small seeded random number generator (mulberry32). */
function rng(seed){
  var a = seed >>> 0;
  var r = function(){
    a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  r.int = function(lo, hi){ return lo + Math.floor(r() * (hi - lo + 1)); };
  r.pick = function(list){ return list[Math.floor(r() * list.length)]; };
  r.shuffle = function(list){ var a2 = list.slice(); for (var i = a2.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a2[i]; a2[i] = a2[j]; a2[j] = t; } return a2; };
  return r;
}

/* ---------- Pictures ---------- */
/* Ten-frames: dots in rows of 5, never scattered, so she can see the amount at a glance. */
function frames(n){
  var out = '<span class="m-frames" aria-hidden="true">', f = Math.max(1, Math.ceil(n / 10));
  for (var k = 0; k < f; k++) {
    out += '<span class="frame">';
    for (var i = 0; i < 10; i++) out += '<span class="cell' + (k * 10 + i < n ? ' fill' : '') + '"></span>';
    out += '</span>';
  }
  return out + '</span>';
}
/* A row of things to count; `gone` of them are faded (taken away). */
function things(emoji, n, gone){
  var out = '<span class="m-things" aria-hidden="true">';
  for (var i = 0; i < n; i++) out += '<span class="obj' + (i >= n - (gone || 0) ? ' gone' : '') + '">' + emoji + '</span>';
  return out + '</span>';
}
function numberLine(from, to, mark, hop){
  var n = to - from, w = 60 * n + 40, s = '<svg class="m-line" viewBox="0 0 ' + w + ' 100" aria-hidden="true"><line x1="20" y1="40" x2="' + (w - 20) + '" y2="40" stroke="#1E2B38" stroke-width="4"/>';
  for (var i = 0; i <= n; i++) {
    var x = 20 + i * 60, v = from + i, q = v === mark;
    s += '<line x1="' + x + '" y1="28" x2="' + x + '" y2="52" stroke="#1E2B38" stroke-width="4"/>'
      + (q ? '<circle cx="' + x + '" cy="78" r="16" fill="#FFC933"/><text x="' + x + '" y="86" text-anchor="middle" font-size="24" font-weight="700" fill="#1E2B38">?</text>'
           : '<text x="' + x + '" y="84" text-anchor="middle" font-size="24" fill="#1E2B38">' + v + '</text>');
    if (hop && i > 0 && v <= mark) s += '<path d="M' + (x - 54) + ' 26 q27 -26 54 0" fill="none" stroke="#3FA34D" stroke-width="3"/>';
  }
  return s + '</svg>';
}
/* Coins and notes: simplified drawings with the value, clearly not replicas. */
function money(v){
  if (v >= 10 && v % 10 === 0 && v > 10) return '<svg class="m-note" viewBox="0 0 120 64" aria-hidden="true"><rect x="2" y="2" width="116" height="60" rx="8" fill="#F6B9A0" stroke="#7A5236" stroke-width="3"/><circle cx="92" cy="32" r="16" fill="#FDE3D5"/><text x="40" y="44" text-anchor="middle" font-size="30" font-weight="700" fill="#1E2B38">₹' + v + '</text></svg>';
  return '<svg class="m-coin" viewBox="0 0 70 70" aria-hidden="true"><circle cx="35" cy="35" r="32" fill="' + (v >= 10 ? '#E8C85A' : '#D3D8DD') + '" stroke="#5F6A72" stroke-width="3"/><circle cx="35" cy="35" r="25" fill="none" stroke="#5F6A72" stroke-width="2"/><text x="35" y="45" text-anchor="middle" font-size="' + (v >= 10 ? 24 : 28) + '" font-weight="700" fill="#1E2B38">₹' + v + '</text></svg>';
}
function coins(list){ return '<span class="m-coins">' + list.map(money).join('') + '</span>'; }
var SHAPES = {
  circle: '<circle cx="50" cy="50" r="38"/>',
  square: '<rect x="14" y="14" width="72" height="72"/>',
  triangle: '<polygon points="50,10 92,88 8,88"/>',
  rectangle: '<rect x="4" y="26" width="92" height="50"/>'
};
function shape(name, colour){
  return '<svg class="m-shape" viewBox="0 0 100 100" aria-hidden="true"><g fill="' + (colour || '#8FC7A0') + '" stroke="#1E2B38" stroke-width="4">' + SHAPES[name] + '</g></svg>';
}
/* A shape cut by a line: in two equal halves, or not. */
function cut(kind, equal){
  var line = kind === 'circle' ? (equal ? '<line x1="50" y1="10" x2="50" y2="90"/>' : '<line x1="30" y1="14" x2="30" y2="86"/>')
    : (equal ? '<line x1="50" y1="14" x2="50" y2="86"/>' : '<line x1="14" y1="40" x2="86" y2="40"/>');
  var body = kind === 'circle' ? '<circle cx="50" cy="50" r="40"/>' : '<rect x="10" y="14" width="80" height="72"/>';
  return '<svg class="m-shape" viewBox="0 0 100 100" aria-hidden="true"><g fill="#BFE6CD" stroke="#1E2B38" stroke-width="4">' + body + line + '</g></svg>';
}
/* Pattern beads: colour and shape both differ, so colour is never the only cue. */
var BEADS = { R:['circle', '#F28AA5'], B:['square', '#7CC6F2'], Y:['triangle', '#FFCB45'] };
function bead(k){ return '<svg class="m-bead" viewBox="0 0 100 100" aria-hidden="true"><g fill="' + BEADS[k][1] + '" stroke="#1E2B38" stroke-width="5">' + SHAPES[BEADS[k][0]] + '</g></svg>'; }
var BEAD_NAMES = { R:'pink circle', B:'blue square', Y:'yellow triangle' };
/* Long and short pencils; full and empty glasses. */
function pencil(len){ return '<svg class="m-pencil" viewBox="0 0 240 40" aria-hidden="true"><rect x="10" y="10" width="' + len + '" height="20" rx="3" fill="#FFCB45" stroke="#7A5236" stroke-width="3"/><polygon points="' + (10 + len) + ',10 ' + (30 + len) + ',20 ' + (10 + len) + ',30" fill="#E3BC8C" stroke="#7A5236" stroke-width="3"/></svg>'; }
function glass(full){ return '<svg class="m-glass" viewBox="0 0 80 100" aria-hidden="true">' + (full ? '<polygon points="16,22 64,22 59,92 21,92" fill="#7CC6F2"/>' : '') + '<polygon points="12,8 68,8 60,94 20,94" fill="none" stroke="#1E2B38" stroke-width="4"/></svg>'; }
/* Times of day: a still scene each. */
function sky(t){
  var bg = t === 'night' ? '#1E2B50' : t === 'morning' ? '#FFE3B8' : '#BDE3FF';
  var body = t === 'night' ? '<circle cx="70" cy="28" r="14" fill="#F5F0C8"/><circle cx="30" cy="20" r="2.5" fill="#fff"/><circle cx="45" cy="40" r="2" fill="#fff"/><circle cx="20" cy="45" r="2" fill="#fff"/>'
    : t === 'morning' ? '<circle cx="22" cy="58" r="14" fill="#FFB347"/>' : '<circle cx="50" cy="18" r="14" fill="#FFCB45"/>';
  return '<svg class="m-sky" viewBox="0 0 100 80" aria-hidden="true"><rect width="100" height="80" fill="' + bg + '"/>' + body + '<rect y="64" width="100" height="16" fill="#9CD08A"/></svg>';
}

/* ---------- Number words ---------- */
var NAMES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen',
  'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var THINGS = ['🍎', '🐦', '⭐', '🌸', '🐟', '🍬', '🚗', '🐝'];

/* Near-miss choices around an answer (±1, ±2), inside lo..hi. */
function near(r, ans, lo, hi, extra){
  var c = [ans], cands = [ans - 1, ans + 1, ans - 2, ans + 2].concat(extra || []).filter(function(x){ return x >= lo && x <= hi && x !== ans; });
  cands = r.shuffle(cands);
  for (var i = 0; c.length < 3 && i < cands.length; i++) if (c.indexOf(cands[i]) === -1) c.push(cands[i]);
  return r.shuffle(c);
}
function numOpts(list){ return list.map(function(v){ return { v:v, html:'<span class="m-num">' + v + '</span>', label:String(v) }; }); }

/* ---------- The skills, in order ---------- */
var SKILLS = [
  { id:'compare', name:'Comparing (< and >)', code:'IL 3.13' },
  { id:'count', name:'Counting objects', code:'IL 3.9' },
  { id:'numeral', name:'Numbers and amounts', code:'IL 3.11' },
  { id:'counton', name:'Counting on and back', code:'IL 3.10' },
  { id:'neighbour', name:'Before, after, between', code:'ILM 4.11' },
  { id:'zero', name:'Zero', code:'IL 3.12' },
  { id:'add', name:'Adding', code:'IL 3.14' },
  { id:'take', name:'Taking away', code:'IL 3.15' },
  { id:'names', name:'Number names', code:'IL 3.11' },
  { id:'money', name:'Money', code:'IL 3.20' },
  { id:'measure', name:'Measuring', code:'IL 3.21' },
  { id:'shapes', name:'Shapes', code:'IL 3.25' },
  { id:'halves', name:'Halves', code:'IL 3.26' },
  { id:'pattern', name:'Patterns', code:'IL 3.27' },
  { id:'time', name:'Days, months and time of day', code:'IL 3.29' }
];

var GEN = {
  count:function(r, lv){
    var n = r.int(lv === 1 ? 2 : 11, lv === 1 ? 10 : 20);
    return { prompt:'How many dots?', show:frames(n), opts:numOpts(near(r, n, 0, 20)), answer:n, right:'Yes! ' + n + '.', count:n, key:n };
  },
  numeral:function(r, lv){
    if (lv === 1) {
      var n = r.int(1, 9), list = near(r, n, 1, 10);
      return { prompt:'Find ' + n, show:'<span class="m-big">' + n + '</span>', answer:n, right:'Yes! ' + n + '.', count:n, key:n,
        opts:list.map(function(v){ return { v:v, html:frames(v), label:v + ' dots' }; }) };
    }
    var t = r.int(1, 9), o = r.int(0, 9), v2 = t * 10 + o;
    var swap = o > 0 && o !== t ? o * 10 + t : null, others = [v2 + 1 <= 99 ? v2 + 1 : v2 - 1, swap !== null ? swap : (v2 + 10 <= 99 ? v2 + 10 : v2 - 10)];
    var opts2 = r.shuffle([v2].concat(others.filter(function(x, i){ return others.indexOf(x) === i && x !== v2; })));
    return { prompt:'Find ' + v2, show:'<span class="m-big">' + v2 + '</span>', answer:v2, right:'Yes! ' + t + ' tens and ' + o + ' ones.', key:v2,
      opts:opts2.map(function(x){ return { v:x, html:blocks(x), label:Math.floor(x / 10) + ' tens and ' + (x % 10) + ' ones' }; }) };
  },
  counton:function(r, lv){
    var step = lv === 2 ? r.pick([1, 2, 10]) : 1, back = lv === 1 && r() < 0.4, max = lv === 1 ? 9 : (step === 10 ? 100 : 20);
    var start = step === 10 ? r.int(1, 6) * 10 : back ? r.int(4, max) : r.int(0, max - 3 * step);
    var d = back ? -1 : step, seq = [start, start + d, start + 2 * d], ans = start + 3 * d;
    return { prompt:back ? 'Count back. What comes next?' : 'What comes next?', show:'<span class="m-seq">' + seq.join(', ') + ', <b>?</b></span>', key:seq.join(),
      opts:numOpts(near(r, ans, 0, 100, step > 1 ? [ans + step, ans - step] : [])), answer:ans, right:seq.join(', ') + ', ' + ans + '!' };
  },
  neighbour:function(r, lv){
    var hi = lv === 1 ? 20 : 100, kind = r.pick(['after', 'before', 'between']), n = r.int(1, hi - 1), ans, prompt;
    if (kind === 'after') { ans = n + 1; prompt = 'What comes after ' + n + '?'; }
    else if (kind === 'before') { ans = n - 1; prompt = 'What comes before ' + n + '?'; }
    else { ans = n; prompt = 'What comes between ' + (n - 1) + ' and ' + (n + 1) + '?'; }
    var from = Math.max(0, Math.min(ans - 3, hi - 6));
    return { prompt:prompt, show:numberLine(from, from + 6, ans), opts:numOpts(near(r, ans, 0, hi)), answer:ans, right:'Yes! ' + ans + '.', key:kind + n };
  },
  zero:function(r){
    var e = r.pick(THINGS), n = r.int(2, 6);
    /* Before, then after: the things, an arrow, and an empty space where they were. */
    return { prompt:n + ' go away. How many are left?', show:'<span class="m-row">' + things(e, n) + '<span class="m-op">→</span><span class="m-empty" aria-label="none left"></span></span>', key:e + n,
      opts:numOpts(r.shuffle([0, 1, n])), answer:0, right:'Yes! Zero. None left.' };
  },
  add:function(r, lv){
    var hi = lv === 1 ? 9 : 18, a = r.int(1, lv === 1 ? 5 : 9), b = r.int(1, Math.min(hi - a, 9)), e = r.pick(THINGS), s = a + b;
    return { prompt:'How many in all?', show:'<span class="m-row">' + things(e, a) + '<span class="m-op">+</span>' + things(e, b) + '</span>',
      opts:numOpts(near(r, s, 0, 20)), answer:s, right:a + ' and ' + b + ' make ' + s + '.', count:s, countSel:'.m-things .obj', key:a + '+' + b };
  },
  take:function(r){
    var n = r.int(3, 9), k = r.int(1, n - 1), e = r.pick(THINGS);
    return { prompt:n + ' take away ' + k + '. How many are left?', show:'<span class="m-row">' + things(e, n, k) + '</span>',
      opts:numOpts(near(r, n - k, 0, 9)), answer:n - k, right:n + ' take away ' + k + ' is ' + (n - k) + '.', count:n - k, countSel:'.m-things .obj:not(.gone)', key:n + '-' + k };
  },
  names:function(r, lv){
    var n = lv === 1 ? r.int(1, 10) : r.int(11, 20), list = near(r, n, lv === 1 ? 1 : 11, lv === 1 ? 10 : 20);
    return { prompt:'Find the word', show:'<span class="m-big">' + n + '</span>', answer:n, right:n + ', ' + NAMES[n] + '.', key:n,
      opts:list.map(function(v){ return { v:v, html:'<span class="m-word">' + NAMES[v] + '</span>', label:NAMES[v] }; }) };
  },
  money:function(r, lv){
    if (lv === 1) {
      var v = r.pick([1, 2, 5, 10]), list = r.shuffle([v].concat(r.shuffle([1, 2, 5, 10].filter(function(x){ return x !== v; })).slice(0, 2)));
      return { prompt:'Find ' + v + ' rupee' + (v === 1 ? '' : 's'), show:'', answer:v, right:'Yes! ' + v + ' rupee' + (v === 1 ? '' : 's') + '.', key:v,
        opts:list.map(function(x){ return { v:x, html:money(x), label:x + ' rupees' }; }) };
    }
    var target = r.int(3, 20), sets = makeSets(r, target);
    return { prompt:'Which makes ' + target + ' rupees?', show:'<span class="m-big">₹' + target + '</span>', answer:0, right:'Yes! That makes ' + target + ' rupees.', key:target,
      opts:r.shuffle(sets.map(function(set, i){ return { v:i, html:coins(set), label:set.join(' and ') + ' rupees' }; })) };
  },
  measure:function(r, lv){
    var kinds = lv === 1 ? ['long', 'short', 'heavy', 'light'] : ['full', 'empty', 'hot', 'cold'], k = r.pick(kinds), a, b, prompt;
    if (k === 'long' || k === 'short') { a = { v:'long', html:pencil(190), label:'long pencil' }; b = { v:'short', html:pencil(80), label:'short pencil' }; prompt = 'Which is ' + (k === 'long' ? 'longer' : 'shorter') + '?'; }
    else if (k === 'heavy' || k === 'light') { a = { v:'heavy', html:'<span class="m-emoji">🐘</span>', label:'elephant' }; b = { v:'light', html:'<span class="m-emoji">🐭</span>', label:'mouse' }; prompt = 'Which is ' + (k === 'heavy' ? 'heavier' : 'lighter') + '?'; }
    else if (k === 'full' || k === 'empty') { a = { v:'full', html:glass(true), label:'full glass' }; b = { v:'empty', html:glass(false), label:'empty glass' }; prompt = 'Which is ' + k + '?'; }
    else { a = { v:'hot', html:'<span class="m-emoji">☕</span>', label:'hot tea' }; b = { v:'cold', html:'<span class="m-emoji">⛄</span>', label:'snowman' }; prompt = 'Which is ' + k + '?'; }
    return { prompt:prompt, show:'', opts:r.shuffle([a, b]), answer:k, right:'Yes! That one is ' + k + '.', key:k, two:true };
  },
  shapes:function(r, lv){
    var names = ['circle', 'square', 'triangle', 'rectangle'];
    if (lv === 1) {
      var s = r.pick(names), list = r.shuffle([s].concat(r.shuffle(names.filter(function(x){ return x !== s; })).slice(0, 2)));
      return { prompt:'Find the ' + s, show:'', answer:s, right:'Yes! A ' + s + '.', key:s,
        opts:list.map(function(x){ return { v:x, html:shape(x), label:x }; }) };
    }
    var q = r.pick([['no corners', 'circle'], ['3 sides', 'triangle'], ['4 sides the same', 'square']]);
    var others = r.shuffle(names.filter(function(x){ return x !== q[1] && !(q[1] === 'square' && x === 'rectangle'); })).slice(0, 2);
    return { prompt:'Which shape has ' + q[0] + '?', show:'', answer:q[1], right:'Yes! A ' + q[1] + '.', key:q[0],
      opts:r.shuffle([q[1]].concat(others)).map(function(x){ return { v:x, html:shape(x), label:x }; }) };
  },
  halves:function(r){
    var kind = r.pick(['circle', 'square']), right = r.int(0, 2);
    return { prompt:'Which is cut in half?', show:'', answer:right, right:'Yes! Two halves, the same size.', key:kind + right,
      opts:[0, 1, 2].map(function(i){ return { v:i, html:cut(i % 2 ? (kind === 'circle' ? 'square' : 'circle') : kind, i === right), label:i === right ? 'two equal halves' : 'two parts' }; }) };
  },
  pattern:function(r, lv){
    var pat = lv === 1 ? r.pick(['RB', 'BY', 'YR']) : r.pick(['RBB', 'BYY', 'RBY', 'YRB']), len = lv === 1 ? 5 : pat.length * 2 + 1;
    var seq = [];
    for (var i = 0; i < len; i++) seq.push(pat.charAt(i % pat.length));
    var ans = pat.charAt(len % pat.length);
    return { prompt:'What comes next?', show:'<span class="m-pattern">' + seq.map(bead).join('') + '<span class="m-gap">?</span></span>', answer:ans, key:pat + len,
      right:'Yes! A ' + BEAD_NAMES[ans] + '.', opts:r.shuffle(['R', 'B', 'Y']).map(function(k){ return { v:k, html:bead(k), label:BEAD_NAMES[k] }; }) };
  },
  time:function(r, lv){
    if (lv === 1) {
      var d = r.int(0, 6), next = DAYS[(d + 1) % 7], list = r.shuffle([next, DAYS[(d + 3) % 7], DAYS[(d + 5) % 7]]);
      return { prompt:'What day comes after ' + DAYS[d] + '?', show:'<span class="m-word">' + DAYS[d] + '</span>', answer:next, right:DAYS[d] + ', ' + next + '!', key:d,
        opts:list.map(function(x){ return { v:x, html:'<span class="m-word">' + x + '</span>', label:x }; }) };
    }
    if (r() < 0.5) {
      var m = r.int(0, 11), nm = MONTHS[(m + 1) % 12], ml = r.shuffle([nm, MONTHS[(m + 4) % 12], MONTHS[(m + 7) % 12]]);
      return { prompt:'What month comes after ' + MONTHS[m] + '?', show:'<span class="m-word">' + MONTHS[m] + '</span>', answer:nm, right:MONTHS[m] + ', ' + nm + '!', key:'m' + m,
        opts:ml.map(function(x){ return { v:x, html:'<span class="m-word">' + x + '</span>', label:x }; }) };
    }
    var t = r.pick(['morning', 'afternoon', 'night']);
    return { prompt:'Which one is ' + t + '?', show:'', answer:t, right:'Yes! That is ' + t + '.', key:t,
      opts:r.shuffle(['morning', 'afternoon', 'night']).map(function(x){ return { v:x, html:sky(x), label:x }; }) };
  }
};
/* Tens and ones: rods of ten and single cubes. */
function blocks(v){
  var t = Math.floor(v / 10), o = v % 10, s = '<span class="m-blocks" aria-hidden="true">';
  for (var i = 0; i < t; i++) s += '<span class="rod"></span>';
  for (var j = 0; j < o; j++) s += '<span class="cube"></span>';
  return s + '</span>';
}
/* Three sets of coins: the first makes the target, the other two don't. */
function makeSets(r, target){
  function make(total){
    var set = [], left = total;
    [10, 5, 2, 1].forEach(function(c){ while (left >= c && set.length < 4) { set.push(c); left -= c; } });
    return left ? null : set;
  }
  var good = make(target), out = [good], tries = [target + 1, target - 1, target + 2, target - 2, target + 5];
  for (var i = 0; out.length < 3 && i < tries.length; i++) { var s2 = tries[i] > 0 && make(tries[i]); if (s2) out.push(s2); }
  return out;
}

/* Builds the question for an item. */
function gen(item){
  var r = rng(item.seed || 1), g = GEN[item.s];
  return g ? g(r, item.lv === 2 ? 2 : 1) : null;
}

LR.maths = { SKILLS:SKILLS, gen:gen, rng:rng, frames:frames, NAMES:NAMES, ids:SKILLS.map(function(s){ return s.id; }) };
})();
