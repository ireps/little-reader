/* Word knowledge: heart letters, families of tricky words, look-alikes. No browser APIs here. */
(function(){
'use strict';
var LR = window.LR = window.LR || {};

/* Common tricky words: index of each letter that doesn't sound the way it looks. */
var HEARTS = {
  the:[2], come:[1,3], some:[1,3], from:[2], have:[3], many:[1], any:[0], also:[0], said:[1,2], says:[1,2],
  was:[1,2], of:[0,1], to:[1], 'do':[1], you:[1,2], they:[2,3], there:[2,3,4], where:[2,3,4], were:[3],
  one:[0,1,2], two:[1,2], what:[2], who:[0,2], love:[1,3], done:[1,3], does:[1,2], could:[1,2,3],
  would:[1,2,3], should:[2,3,4], friend:[2], put:[1], push:[1], pull:[1], want:[1], water:[1], again:[2,3],
  eye:[0,1,2], people:[2], fruit:[2,3], mother:[1], other:[0], brother:[2], only:[0], move:[1,3], are:[2],
  most:[1], money:[1], son:[1], won:[1], none:[1,3], glove:[2,4], month:[1],
  like:[1,3], so:[1], no:[1], go:[1], little:[4,5], when:[1], into:[3], he:[1], she:[2], we:[1], me:[1], be:[1], my:[1], all:[1,2]
};

/* Tricky words that share the same trick: learn them as a family. */
var FAMILIES = [
  {name:'o says “uh”', words:['come','some','from','done','love','one','other','mother','brother','money','son','won','none','of','glove','month']},
  {name:'“oul” says “ood”', words:['could','would','should']},
  {name:'a after w says “o”', words:['was','want','what','water','watch','wash']},
  {name:'u says “oo”', words:['put','push','pull','full','bush']},
  {name:'ai says “e”', words:['said','again','says']},
  {name:'o says “oo”', words:['do','to','who','into']},
  {name:'o says its name', words:['so','no','go']},
  {name:'e says its name', words:['he','she','we','me','be']},
  {name:'wh: the h is quiet', words:['when','what','where','which']}
];

/* Extra look-alike words for Word detective (same first letters, similar shapes). */
var BANK = ['cat','cot','cut','pot','pit','pet','pets','posts','plants','plans','plant','cone','cane','coat','came','same','sun',
  'frog','form','fun','glow','grew','grows','got','gum','game','mop','map','man','men','money','hive','hat','then','them',
  'this','that','sail','spoil','mist','must','moss','thorn','throw','three','nut','nest','net','fruit','fly','rose','rope',
  'nose','lent','lamp','some','come','from','many','have','soil','most','grow','pots','the','also',
  'jump','junk','lamp','limp','hand','band','pond','bond','nest','next','tent','test','milk','mill','sink','silk','desk','dusk','belt','bent',
  'stop','step','spot','spin','snap','snip','slip','slap','slug','swim','star','stir','flag','flap','clap','clip','plum','plug',
  'drum','drip','frog','from','grin','grip','trip','trap','crab','grab','glad','plant','plan','stand','stamp','drink','dress',
  'crisp','crust','blink','black','said','sad','like','lick','were','wet','there','then','little','lift','one','on','what','want','when','wet',
  'and','ant','ask','act','sand','sun','sob','dot','dig','dog','went','them','list','only','owl','web','lake','sock','cot','fog','hut','mat','milk',
  'quit','quack','yes','yak','yell','egg','end','elf','kit','kick','kid','up','us','under'];

var LETTER_NAMES = {a:'ay',b:'bee',c:'see',d:'dee',e:'ee',f:'ef',g:'jee',h:'aitch',i:'eye',j:'jay',k:'kay',l:'el',m:'em',
  n:'en',o:'oh',p:'pee',q:'queue',r:'ar',s:'ess',t:'tee',u:'you',v:'vee',w:'double you',x:'ex',y:'why',z:'zed'};

function has(o, k){ return Object.prototype.hasOwnProperty.call(o, k); }
function clean(w){ return String(w).toLowerCase().replace(/[^a-z']/g, ''); }

/* A grown-up's edits (LR.state.hearts) win over the built-in list. Plurals borrow the singular's hearts. */
function heartsFor(word){
  var w = clean(word), mine = (LR.state && LR.state.hearts) || {};
  if (has(mine, w)) return mine[w];
  if (has(HEARTS, w)) return HEARTS[w];
  if (w.length > 2 && w.charAt(w.length - 1) === 's' && has(HEARTS, w.slice(0, -1))) return HEARTS[w.slice(0, -1)];
  return [];
}
function isHeart(w){ return heartsFor(w).length > 0; }
/* Distractors for a word to find: her own past mix-ups first, then look-alikes that share the first letter
   and shape, so guessing from the first letter doesn't work. */
function lookalikes(target, pool, mixups, n){
  n = n || 2;
  var mine = (mixups || []).filter(function(w){ return w !== target; }).slice(0, n);
  if (mine.length >= n) return mine;
  var seen = {}, cands = pool.concat(BANK).filter(function(w){ if (seen[w] || w === target || w.length < 2) return false; seen[w] = 1; return true; });
  var scored = cands.map(function(w){
    var s = Math.random() * 1.5;
    if (w.charAt(0) === target.charAt(0)) s += 3;
    if (w.slice(0, 2) === target.slice(0, 2)) s += 1;
    if (Math.abs(w.length - target.length) <= 1) s += 1.5;
    if (w.charAt(w.length - 1) === target.charAt(target.length - 1)) s += 1;
    return { w:w, s:s };
  });
  scored.sort(function(a, b){ return b.s - a.s; });
  return mine.concat(scored.map(function(o){ return o.w; }).filter(function(w){ return mine.indexOf(w) === -1; })).slice(0, n);
}
function familyOf(w){ for (var i = 0; i < FAMILIES.length; i++) if (FAMILIES[i].words.indexOf(w) > -1) return FAMILIES[i]; return null; }

/* ---------- Phonics: graphemes in the Letters and Sounds order ---------- */
/* Phase 2 and 3 graphemes are assumed known (she is past them). Doubled consonants count as one sound. */
var BASE = ('s a t p i n m d g o c k ck e u r h b f ff l ll ss j v w x y z zz qu ch sh th ng ai ee igh oa oo ar or ur ow oi ear air ure er '
  + 'tt pp dd gg nn mm rr bb').split(' ');
/* Phase 5 graphemes, taught unit by unit (each unit's `sounds`). A split digraph is written a_e. */
var P5 = 'ay ou ie ea oy ir ue aw wh ph ew oe au ey a_e e_e i_e o_e u_e'.split(' ');
/* Tricky words from Letters and Sounds Phases 2 and 3, assumed known; units add their own. */
var TRICKY_BASE = 'the to i no go into he she we me be was you they all are my her of'.split(' ');
/* Story names: always allowed. */
var NAMES = ['raj', 'meena', 'mum', 'dad', 'nani', 'tilly'];
var VOWELS = 'aeiou';

/* Splits a word into graphemes using only the allowed ones, longest first where there is a choice.
   Returns an array like ['sh', 'i', 'p'] (a split digraph comes back as 'a_e' at the vowel's place), or null. */
function segment(word, allowed){
  var w = clean(word).replace(/'/g, ''), has = {}, i;
  (allowed || BASE.concat(P5)).forEach(function(g){ has[g] = 1; });
  /* A split digraph: a single vowel, exactly one consonant, then a final e, as in cake, these, white. */
  var split = -1, n = w.length;
  if (n >= 3 && w.charAt(n - 1) === 'e' && VOWELS.indexOf(w.charAt(n - 2)) === -1 && VOWELS.indexOf(w.charAt(n - 3)) > -1
      && has[w.charAt(n - 3) + '_e'] && (n === 3 || VOWELS.indexOf(w.charAt(n - 4)) === -1)) split = n - 3;
  function solve(str, marks){
    var best = [null];
    (function go(pos, acc){
      if (best[0]) return;
      if (pos === str.length) { best[0] = acc.slice(); return; }
      if (marks[pos]) { acc.push(marks[pos]); go(pos + 1, acc); acc.pop(); return; }
      for (var len = 3; len >= 1; len--) {
        var g = str.substr(pos, len);
        if (g.length === len && has[g]) { acc.push(g); go(pos + len, acc); acc.pop(); }
      }
    })(0, []);
    return best[0];
  }
  if (split > -1) {
    var marks = {}; marks[split] = w.charAt(split) + '_e';
    var r = solve(w.slice(0, -1), marks);
    if (r) return r;
  }
  return solve(w, {});
}

/* What a unit (by index in LR.units) allows: graphemes and tricky words taught so far. */
function allowedFor(index){
  var g = BASE.slice(), t = TRICKY_BASE.concat(NAMES, LR.knownTricky || []);
  for (var i = 0; i <= index && i < LR.units.length; i++) {
    var u = LR.units[i];
    (u.sounds || []).forEach(function(x){ if (P5.indexOf(x) > -1) g.push(x); });
    t = t.concat((u.tricky || []).map(clean));
  }
  return { graphemes:g, tricky:t, all:allTricky() };
}
/* Every tricky word the app knows of. These are never "decodable": they must have been taught. */
function allTricky(){
  var t = Object.keys(HEARTS).concat(TRICKY_BASE, LR.knownTricky || []);
  (LR.units || []).forEach(function(u){ t = t.concat((u.tricky || []).map(clean)); });
  return t;
}
function decodable(word, index, allowed){
  var w = clean(word).replace(/'/g, '');
  if (!w) return true;
  allowed = allowed || allowedFor(index);
  if (allowed.tricky.indexOf(w) > -1) return true;
  if ((allowed.all || allTricky()).indexOf(w) > -1) return false;
  /* Read the word the way it is really read (all graphemes, longest first), then every part must be taught. */
  var parts = segment(w);
  return !!parts && parts.every(function(g){ return allowed.graphemes.indexOf(g) > -1; });
}
/* Every word a unit shows her to read: its word list, stories, silly sentences and answer choices. */
function wordsOf(text){ return (String(text).match(/[A-Za-z']+/g) || []).map(clean); }
function checkUnits(){
  var problems = [];
  LR.units.forEach(function(u, i){
    var al = allowedFor(i);
    function check(where, text){ wordsOf(text).forEach(function(w){ if (!decodable(w, i, al)) problems.push(u.id + ' ' + where + ': ' + w); }); }
    u.words.forEach(function(w){ check('words', w); });
    (u.stories || []).forEach(function(st){
      st.s.forEach(function(s){ check(st.id, s); });
      (st.q || []).forEach(function(q){ q.opts.forEach(function(o){ check(st.id + ' answers', o); }); });
    });
    (u.silly || []).forEach(function(x){ check('silly', x.s); });
  });
  return problems;
}

/* How to say each grapheme's sound with the tablet voice (a stand-in until Phase 7's clips). */
var SOUNDS = { s:'sss', a:'a', t:'tuh', p:'puh', i:'ih', n:'nnn', m:'mmm', d:'duh', g:'guh', o:'o', c:'kuh', k:'kuh', ck:'kuh', e:'eh',
  u:'uh', r:'rrr', h:'huh', b:'buh', f:'fff', ff:'fff', l:'lll', ll:'lll', ss:'sss', j:'juh', v:'vvv', w:'wuh', x:'ks', y:'yuh', z:'zzz',
  zz:'zzz', qu:'kwuh', ch:'ch', sh:'shh', th:'th', ng:'ng', ai:'ay', ee:'ee', igh:'eye', oa:'oh', oo:'oo', ar:'ar', or:'or', ur:'er',
  ow:'ow', oi:'oy', ear:'ear', air:'air', ure:'pure', er:'er', ay:'ay', ou:'ow', ie:'eye', ea:'ee', oy:'oy', ir:'er', ue:'oo', aw:'aw',
  wh:'wuh', ph:'fff', ew:'oo', oe:'oh', au:'aw', ey:'ee', a_e:'ay', e_e:'ee', i_e:'eye', o_e:'oh', u_e:'oo' };
function soundOf(g){ return SOUNDS[g] || (g.length === 2 && g.charAt(0) === g.charAt(1) ? SOUNDS[g.charAt(0)] : g); }

function isTricky(w){ return allTricky().indexOf(clean(w)) > -1; }

LR.words = { segment:segment, isTricky:isTricky, soundOf:soundOf, allowedFor:allowedFor, decodable:decodable, checkUnits:checkUnits, BASE:BASE, P5:P5, TRICKY_BASE:TRICKY_BASE, NAMES:NAMES,
  HEARTS:HEARTS, FAMILIES:FAMILIES, BANK:BANK, LETTER_NAMES:LETTER_NAMES, heartsFor:heartsFor, isHeart:isHeart, familyOf:familyOf, lookalikes:lookalikes, clean:clean };
})();
