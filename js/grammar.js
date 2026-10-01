/* KG-2 English language skills (Indian UKG syllabi), scheduled like the maths skills: each is a `g:` item with a box.
   ORDER: the 5 first tasks (always open; their screens are in js/steps/lang.js), then the rest, which open one at a
   time in school order as the one before reaches box 2. Word order has its own screen (js/steps/order.js); the others
   are generated here in the maths question shape { prompt, show, opts: [{ v, html, label }], answer, right, key } and
   drawn by LR.steps.math. Every word she reads here is decodable from Phase 3 (tests/run.js checks). */
(function(){
'use strict';
var LR = window.LR = window.LR || {};
function esc(s){ return LR.ui.esc(s); }

/* All language skills in UKG term order. First term: letters (capital and small, vowels, alphabet order), a or an,
   one or many, naming words, he/she/they, this/these, is/are, in/on/under, rhyming words. Second term: doing and
   describing words, opposites, capital letters in sentences, word order, reading a sentence. The first OPEN are open
   from the start; each later one opens when the one before reaches box 2. */
var ORDER = ['letters', 'vowels', 'next', 'an', 'plural', 'naming', 'pronoun', 'this', 'isare', 'pos', 'rhyme',
  'doing', 'describing', 'opposites', 'caps', 'order', 'sentpic'];
var OPEN = 2;
/* The five tasks every learner had before the order existed: kept open for anyone who has done a session. */
var EARLIER = ['rhyme', 'an', 'plural', 'pos', 'caps'];
var SKILLS = [
  { id:'letters', name:'Capital and small letters' }, { id:'next', name:'Which letter comes next' }, { id:'vowels', name:'Vowels' },
  { id:'naming', name:'Naming words' }, { id:'doing', name:'Doing words' }, { id:'describing', name:'Describing words' },
  { id:'opposites', name:'Opposites' }, { id:'this', name:'This and these' }, { id:'isare', name:'Is and are' },
  { id:'pronoun', name:'He, she and they' }, { id:'order', name:'Word order' }, { id:'sentpic', name:'Sentence and picture' }
];

/* ---------- Word banks (decodable from Phase 3) ---------- */
var NAMING = ['cat', 'dog', 'hat', 'bus', 'sun', 'pen', 'cup', 'bed', 'pig', 'hen'];
var DOING = ['run', 'jump', 'sit', 'hop', 'dig', 'swim', 'sing', 'kick', 'clap', 'nap'];
var DESCRIBING = ['big', 'red', 'hot', 'wet', 'sad', 'thin', 'soft', 'fast', 'pink', 'long'];
var OPPOSITES = [['hot', 'cold'], ['up', 'down'], ['on', 'off'], ['long', 'short'], ['thick', 'thin'], ['soft', 'hard'],
  ['top', 'bottom'], ['open', 'shut'], ['fast', 'slow'], ['big', 'small']];
var ADJ = ['big', 'fast', 'wet', 'sad'];
var THINGS = ['hat', 'dog', 'cat', 'cup', 'pen', 'fish'];
var VERBS = ['run', 'swim', 'jump', 'sing', 'hop', 'dig'];
var WHO = [['Raj', 'He'], ['Meena', 'She'], ['Raj and Meena', 'They']];
var SENTPIC = [['A frog can jump.', 'frog'], ['The sun is hot.', 'sun'], ['A fish can swim.', 'fish'], ['A cat can sit on a mat.', 'cat'],
  ['A dog can dig.', 'dog'], ['A hen can peck.', 'hen'], ['A bus can go fast.', 'bus'], ['A bee can buzz.', 'bee'],
  ['The moon is up at night.', 'moon'], ['A pig is pink.', 'pig'], ['A ship can sail.', 'ship'], ['An apple is red.', 'apple']];
/* Word order when the unit has no short sense sentences. */
var ORDER_SENTENCES = ['A fish is wet.', 'A dog can dig.', 'The sun is hot.', 'A frog can hop.'];
/* Look-alike letters, so matching needs a real look. */
var ALIKE = { b:['d', 'p'], d:['b', 'q'], p:['q', 'b'], q:['p', 'g'], g:['q', 'j'], m:['n', 'w'], n:['m', 'h'], u:['n', 'v'], w:['m', 'v'],
  h:['n', 'k'], i:['j', 'l'], j:['i', 'g'], l:['i', 't'], t:['f', 'l'], f:['t', 'k'], c:['e', 'o'], e:['c', 'a'], a:['e', 'o'], o:['c', 'a'] };
var ABC = 'abcdefghijklmnopqrstuvwxyz', VOWELS = 'aeiou', CONS = 'bcdfghjklmnprstvwz';

function name(l){ return LR.words.LETTER_NAMES[l.toLowerCase()]; }
function letterOpt(l){ return { v:l, html:'<span class="m-num g-letter">' + esc(l) + '</span>', label:name(l) }; }
function wordOpt(w){ return { v:w, html:'<span class="m-word">' + esc(w) + '</span>', label:w }; }
function pic(w, n){ var e = (LR.pictures || {})[w] || '', s = ''; for (var i = 0; i < (n || 1); i++) s += e; return '<span class="s-picimg" aria-hidden="true">' + s + '</span>'; }
function others(r, list, not, n){ return r.shuffle(list.filter(function(x){ return not.indexOf(x) === -1; })).slice(0, n); }

var GEN = {
  letters:function(r, lv){
    var l = r.pick(Object.keys(ALIKE).concat(ABC.split(''))), big = lv === 1, alike = ALIKE[l] || others(r, ABC.split(''), [l], 2);
    var show = big ? l.toUpperCase() : l, opts = r.shuffle([l].concat(alike.slice(0, 2))).map(function(x){ return letterOpt(big ? x : x.toUpperCase()); });
    var ans = big ? l : l.toUpperCase();
    return { prompt:big ? 'Find the small letter' : 'Find the big letter', show:'<span class="m-big">' + esc(show) + '</span>', opts:opts, answer:ans,
      right:'Yes! Big ' + name(l) + ', small ' + name(l) + '.', key:l };
  },
  next:function(r, lv){
    var after = lv === 1 || r() < 0.5, i = after ? r.int(0, 24) : r.int(1, 25), l = ABC.charAt(i), ans = ABC.charAt(after ? i + 1 : i - 1);
    var wrong = others(r, ABC.split(''), [ans, l], 2);
    return { prompt:(after ? 'What comes after ' : 'What comes before ') + name(l) + '?', show:'<span class="m-big">' + l + '</span>',
      opts:r.shuffle([ans].concat(wrong)).map(letterOpt), answer:ans,
      right:after ? 'Yes! ' + name(l) + ', ' + name(ans) + '.' : 'Yes! ' + name(ans) + ', ' + name(l) + '.', key:(after ? 'a' : 'b') + l };
  },
  vowels:function(r){
    var v = r.pick(VOWELS.split('')), cs = r.shuffle(CONS.split('')).slice(0, 2);
    return { prompt:'Find the vowel', show:'', opts:r.shuffle([v].concat(cs)).map(letterOpt), answer:v, right:'Yes! ' + name(v) + ' is a vowel.', key:v + cs.join('') };
  },
  naming:function(r){ return kind(r, NAMING, [DOING, DESCRIBING], 'naming'); },
  doing:function(r){ return kind(r, DOING, [NAMING, DESCRIBING], 'doing'); },
  describing:function(r){ return kind(r, DESCRIBING, [NAMING, DOING], 'describing'); },
  opposites:function(r){
    var pair = r.pick(OPPOSITES), flip = r() < 0.5, w = pair[flip ? 1 : 0], ans = pair[flip ? 0 : 1];
    var wrong = others(r, OPPOSITES.map(function(p){ return p[r.int(0, 1)]; }), pair, 2);
    return { prompt:'What is the opposite of ' + w + '?', show:'<span class="m-word">' + esc(w) + '</span>', opts:r.shuffle([ans].concat(wrong)).map(wordOpt),
      answer:ans, right:'Yes! ' + w + ', ' + ans + '.', key:w };
  },
  this:function(r){
    var w = r.pick(LR.lang.plural), many = r() < 0.5, one = 'This is a ' + w + '.', more = 'These are ' + w + 's.';
    return { prompt:'Which one fits the picture?', show:pic(w, many ? 3 : 1), answer:many ? more : one, right:'Yes! ' + (many ? more : one), key:w + many,
      opts:r.shuffle([one, more]).map(function(s){ return { v:s, html:'<span class="m-word g-sent">' + esc(s) + '</span>', label:s }; }) };
  },
  isare:function(r){
    var w = r.pick(LR.lang.plural), many = r() < 0.5, adj = r.pick(ADJ), noun = many ? w + 's' : w, verb = many ? 'are' : 'is';
    return { prompt:'Is or are?', show:pic(w, many ? 3 : 1) + '<span class="m-word g-sent">The ' + esc(noun) + ' <span class="s-gap">?</span> ' + esc(adj) + '.</span>',
      opts:['is', 'are'].map(wordOpt), answer:verb, right:'Yes! The ' + noun + ' ' + verb + ' ' + adj + '.', key:noun + adj, fill:verb };
  },
  pronoun:function(r){
    var who = r.pick(WHO), thing = r.pick(THINGS), verb = r.pick(VERBS);
    var first = who[0] + (who[1] === 'They' ? ' have a ' : ' has a ') + thing + '.';
    return { prompt:'He, she or they?', show:'<span class="m-word g-sent">' + esc(first) + ' <span class="s-gap">?</span> can ' + esc(verb) + '.</span>',
      opts:['He', 'She', 'They'].map(wordOpt), answer:who[1], right:'Yes! ' + who[1] + ' can ' + verb + '.', key:who[0] + thing + verb, fill:who[1] };
  },
  sentpic:function(r){
    var it = r.pick(SENTPIC), wrong = others(r, SENTPIC.map(function(x){ return x[1]; }), [it[1]], 2);
    return { prompt:'Find the picture', show:'<span class="m-word g-sent">' + esc(it[0]) + '</span>', answer:it[1], right:'Yes! ' + it[0], key:it[1],
      opts:r.shuffle([it[1]].concat(wrong)).map(function(w){ return { v:w, html:pic(w), label:w }; }) };
  }
};
/* Find the naming, doing or describing word among one of each kind. */
function kind(r, list, rest, k){
  var w = r.pick(list), opts = [w].concat(rest.map(function(l){ return r.pick(l); }));
  return { prompt:'Find the ' + k + ' word', show:'', opts:r.shuffle(opts).map(wordOpt), answer:w, right:'Yes! ' + w + ' is a ' + k + ' word.', key:opts.join() };
}

function gen(item){
  var g = GEN[item.g];
  return g ? g(LR.maths.rng(item.seed), item.lv === 2 ? 2 : 1) : null;
}

/* Word order: the unit's short sense sentences (3 to 5 words), or the built-in ones. */
function orderSentences(unit){
  var mine = ((unit && unit.silly) || []).filter(function(x){ var n = x.s.split(' ').length; return x.ok && n >= 3 && n <= 5 && !/[,"“!?]/.test(x.s); }).map(function(x){ return x.s; });
  return mine.length ? mine : ORDER_SENTENCES;
}

LR.grammar = { ORDER:ORDER, OPEN:OPEN, EARLIER:EARLIER, SKILLS:SKILLS, gen:gen, ids:SKILLS.map(function(s){ return s.id; }).filter(function(id){ return id !== 'order'; }),
  orderSentences:orderSentences, ORDER_SENTENCES:ORDER_SENTENCES,
  BANKS:{ NAMING:NAMING, DOING:DOING, DESCRIBING:DESCRIBING, OPPOSITES:OPPOSITES, ADJ:ADJ, THINGS:THINGS, VERBS:VERBS, SENTPIC:SENTPIC } };
})();
