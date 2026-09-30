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
  'and','ant','ask','act','sand','sun','sob','dot','dig','dog','went','them','list','only','owl','web','lake','sock','cot','fog','hut','mat','milk'];

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

LR.words = { HEARTS:HEARTS, FAMILIES:FAMILIES, BANK:BANK, LETTER_NAMES:LETTER_NAMES, heartsFor:heartsFor, isHeart:isHeart, familyOf:familyOf, lookalikes:lookalikes, clean:clean };
})();
