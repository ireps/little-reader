/* Phase 4 prototype: fixtures for every screen and state, for the owner to approve before the session is built.
   Dev only; not loaded by the app. */
(function(){
'use strict';
var LR = window.LR, K = LR.kit, G = LR.garden, I = LR.icons.get, esc = LR.ui.esc;
var PATH = ['words', 'tricky', 'read', 'maths', 'garden'];

function frame(n){
  var s = '<span class="frame" aria-hidden="true">';
  for (var i = 0; i < 10; i++) s += '<span class="cell' + (i < n ? ' fill' : '') + '"></span>';
  return s + '</span>';
}
function num(n, state){
  return '<button class="s-card s-num' + (state ? ' fb-' + state : '') + '" data-act="pick">'
    + '<span class="n">' + n + '</span>' + frame(n)
    + (state === 'right' ? '<span class="fb-mark">' + I('check') + '</span>' : state === 'wrong' ? '<span class="fb-mark">' + I('dot') + '</span>' : '') + '</button>';
}
function cards(list){ return '<div class="s-row s-cards">' + list.join('') + '</div>'; }
function letters(word, states){
  var out = '<div class="s-letters" role="group" aria-label="' + esc(word) + '">';
  for (var i = 0; i < word.length; i++) {
    var st = states[i] || '';
    out += '<button class="l lbtn' + (st === 'right' ? ' h fb-right' : st === 'wrong' ? ' plain fb-wrong' : '') + '" data-act="letter">' + esc(word.charAt(i))
      + (st === 'right' ? '<span class="fb-mark">' + I('check') + '</span>' : st === 'wrong' ? '<span class="fb-mark">' + I('dot') + '</span>' : '') + '</button>';
  }
  return out + '</div>';
}
function skip(){
  return '<div class="s-skip">' + K.hold('skip', 'skip', 'Not today', 2000, 0, 'small') + '<span>Not today</span></div>';
}
function home(o){
  return '<div class="s-home"><div class="g-wide">' + G.svg(o.flowers, o.fresh) + '</div><div class="g-tall">' + G.svg(o.flowers, o.fresh, true) + '</div>'
    + '<div class="s-corner">' + K.hold('grownups', 'lock', 'Grown-ups', 2000, 0, 'small') + '</div>'
    + '<h1 class="s-title">Little Reader</h1>'
    + (o.note ? '<p class="s-note">' + esc(o.note) + '</p>' : '')
    + K.target('start', o.label || 'Start', 'play', '').replace('class="s-target"', 'class="s-target big"')
    + LR.guide.svg(o.pose || 'waiting') + '</div>';
}
var SENT = 'The frog can jump on the log.';

var SCREENS = {
  'home-first': { t:'Home, first time: an empty garden and one Start', html:function(){ return home({ flowers:0 }); } },
  'home-returning': { t:'Home, returning: her flowers and one Start', html:function(){ return home({ flowers:9 }); } },
  'home-done': { t:'Home, today done: "See you tomorrow", Start offers extra practice', html:function(){ return home({ flowers:11, note:'See you tomorrow!', label:'Play more', pose:'happy' }); } },
  'words-wait': { t:'Sounds and words (Find it): waiting. All cards share one style; replay is quiet', html:function(){
    return K.screen({ steps:PATH, step:'words', seeds:[8, 2], pose:'waiting', say:'Find the word you hear',
      main: cards([K.card('come'), K.card('cone'), K.card('came')]) + K.replay() }); } },
  'words-right': { t:'Find it: right. Green, check, chime, happy guide', html:function(){
    return K.screen({ steps:PATH, step:'words', seeds:[8, 3], pose:'happy', say:'Yes! come',
      main: cards([K.card('come', 'right'), K.card('cone').replace('s-card', 's-card dim'), K.card('came').replace('s-card', 's-card dim')]) }); } },
  'words-wrong': { t:'Find it: wrong. Dimmed with a dot, soft tone, thinking guide. No red', html:function(){
    return K.screen({ steps:PATH, step:'words', seeds:[8, 2], pose:'thinking', say:'That says cone.',
      main: cards([K.card('come'), K.card('cone', 'wrong'), K.card('came')]) + K.replay() }); } },
  'words-reveal': { t:'Find it: after 2 misses the answer is shown and said, then it moves on', html:function(){
    return K.screen({ steps:PATH, step:'words', seeds:[8, 3], pose:'waiting', say:'This one says come.',
      main: cards([K.card('come', 'right'), K.card('cone', 'wrong'), K.card('came', 'wrong')]) }); } },
  'tricky-meet': { t:'New tricky word: she hears it; letters light while it is spelled', html:function(){
    return K.screen({ steps:PATH, step:'tricky', seeds:[3, 0], pose:'listening', say:'come. c, o, m, e. come.',
      main: K.word('come', 1) }); } },
  'tricky-find': { t:'New tricky word: find the heart letters (o found, c tapped)', html:function(){
    return K.screen({ steps:PATH, step:'tricky', seeds:[3, 1], pose:'waiting', say:'Find the heart letters',
      main: letters('come', ['wrong', 'right']) + K.replay() }); } },
  'tricky-family': { t:'New tricky word: its family, once she has met the word', html:function(){
    return K.screen({ steps:PATH, step:'tricky', seeds:[3, 2], pose:'happy', say:'Same trick: some, done',
      main: K.word('come', -1) + '<div class="s-row">' + ['some', 'done', 'love'].map(function(w){ return '<button class="chip" data-act="chip">' + LR.ui.lettersHTML(w) + '</button>'; }).join('') + '</div>' }); } },
  'read-sentence': { t:'Read with me: she reads to her grown-up. Nothing is read aloud first', html:function(){
    return K.screen({ steps:PATH, step:'read', seeds:[5, 1], pose:'listening', say:'Read to your grown-up',
      main: K.sentence(SENT, { mastered:['the', 'can'] }) + '<div class="s-row">' + K.target('check', '', 'check', ' aria-label="I read it"').replace('class="s-target"', 'class="s-target check"') + skip() + '</div>' }); } },
  'read-help': { t:'Read with me: the grown-up tapped "jump"; it is said and marked', html:function(){
    return K.screen({ steps:PATH, step:'read', seeds:[5, 1], pose:'listening', say:'jump',
      main: K.sentence(SENT, { mastered:['the', 'can'], lit:3, helped:[3] }) + '<div class="s-row">' + K.target('check', '', 'check', ' aria-label="I read it"').replace('class="s-target"', 'class="s-target check"') + skip() + '</div>' }); } },
  'read-playing': { t:'Read with me: after the check, the sentence plays with words lit, then moves on', html:function(){
    return K.screen({ steps:PATH, step:'read', seeds:[5, 2], pose:'happy', say:SENT,
      main: K.sentence(SENT, { mastered:['the', 'can'], lit:4 }) + '<div class="s-row">' + K.target('check', '', 'check', ' aria-label="I read it" disabled').replace('class="s-target"', 'class="s-target check off"') + '</div>' }); } },
  'maths': { t:'Maths (crocodile rounds until Phase 6): which is more?', html:function(){
    return K.screen({ steps:PATH, step:'maths', seeds:[4, 1], pose:'waiting', say:'Which is more?',
      main: cards([num(3), num(7)]) + K.replay() }); } },
  'maths-right': { t:'Maths: right, and the crocodile mouth shows it', html:function(){
    return K.screen({ steps:PATH, step:'maths', seeds:[4, 2], pose:'happy', say:'7 is more. 3 is less than 7.',
      main: '<div class="s-row s-cards">' + num(3, '').replace('s-card', 's-card dim') + '<span class="s-sym">&lt;</span>' + num(7, 'right') + '</div>' }); } },
  'idle': { t:'No tap for a while: after 3 re-prompts, one "Go on" target', html:function(){
    return K.screen({ steps:PATH, step:'words', seeds:[8, 2], pose:'waiting', say:'Tap to go on',
      main: K.target('goon', 'Go on', 'play') }); } },
  'leave-hold': { t:'Home during a session needs a 1 s hold; the ring fills while held', html:function(){
    return K.screen({ steps:PATH, step:'words', seeds:[8, 2], pose:'waiting', say:'Hold to go home', homeHold:0.5,
      main: cards([K.card('come'), K.card('cone'), K.card('came')]) + K.replay() }); } },
  'celebrate': { t:'Garden: today\'s new flowers (ringed) and a spoken summary', html:function(){
    return K.screen({ steps:PATH, step:'garden', pose:'happy', say:'You grew 2 flowers!',
      main: '<div class="s-celebrate">' + G.svg(11, 2) + '</div>' + K.target('done', 'Done', 'home') }); } },
  'grown-gate': { t:'Grown-ups gate (after a 2 s hold): a sum on a tap-only pad', html:function(){
    var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Clear', '0', 'OK'];
    return '<div class="gp-page"><header class="gp-head"><span class="gp-title">For grown-ups</span></header>'
      + '<div class="gate"><p class="prompt">What is 7 + 5?</p><div class="pad-show">1</div><div class="pad">'
      + keys.map(function(k){ return '<button class="btn soft" data-act="key">' + k + '</button>'; }).join('') + '</div></div></div>'; } },
  'grown-main': { t:'Grown-ups: progress, where she is, practise one game, voice, backup', html:function(){
    var days = [[9, .8], [11, .7], [0, 0], [10, .9], [12, .6], [8, .85], [10, .75]], bars = '';
    days.forEach(function(d, i){
      var h = d[0] * 5;
      bars += '<rect x="' + (i * 44 + 6) + '" y="' + (70 - h) + '" width="30" height="' + h + '" rx="5" fill="#8FC7A0"/>'
        + '<text x="' + (i * 44 + 21) + '" y="90" text-anchor="middle" font-size="13" fill="#4A6272">' + ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i] + '</text>';
    });
    return '<div class="gp-page"><header class="gp-head"><span class="gp-title">Grown-ups</span></header><div class="gp">'
      + '<section><h2>Progress</h2><p>Unit 2 of 30 (st, nd, mp). 14 flowers.</p>'
      + '<p class="help">Words to watch: <span class="tchip">said ×3</span><span class="tchip">they ×2</span><span class="mix">pots, picked plants ×2</span></p>'
      + '<p class="help">Last 7 days: minutes (bars), and first-try accuracy 77%.</p><svg viewBox="0 0 310 95" class="gp-bars" role="img" aria-label="Minutes per day">' + bars + '</svg></section>'
      + '<section><h2>Where is she?</h2><p class="help">Tap a unit to start there next time.</p>'
      + ['1. Review: sh, ch, th', '2. st, nd, mp (now)', '3. nt, lk, ft', '4. bl, cl, fl'].map(function(u, i){ return '<button class="btn soft small unit' + (i === 1 ? ' on' : '') + '">' + u + '</button>'; }).join('') + '</section>'
      + '<section><h2>Practise one game</h2>' + ['Find it', 'Tricky word', 'Read with me', 'Crocodile'].map(function(g){ return '<button class="btn soft small">' + g + '</button>'; }).join('') + '</section>'
      + '<section><h2>Voice</h2><label>Speed</label><input type="range" min="0.75" max="1.1" step="0.05" value="0.9" aria-label="Speed"><button class="btn soft small">Test voice</button></section>'
      + '<section><h2>Backup</h2><button class="btn soft small">Save a backup</button><button class="btn soft small">Restore…</button><button class="btn soft small">Reset everything</button></section>'
      + '</div></div>'; } }
};

function show(){
  var id = location.hash.slice(1), app = document.getElementById('app');
  if (!SCREENS[id]) {
    app.className = '';
    app.innerHTML = '<h1>Phase 4 prototype</h1><ul>' + Object.keys(SCREENS).map(function(k){
      return '<li><a href="#' + k + '">' + esc(k) + '</a>: ' + esc(SCREENS[k].t) + '</li>'; }).join('') + '</ul>';
    return;
  }
  app.className = 's-root';
  app.innerHTML = SCREENS[id].html();
  document.title = id;
}
window.addEventListener('hashchange', show);
LR.prototype = { SCREENS: SCREENS };
show();
})();
