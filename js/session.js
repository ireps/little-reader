/* The guided session: Home (her garden and one Start), today's plan, and the runner that moves through it by itself.
   Steps register in LR.steps (js/steps/*.js); each draws one item and calls ctx.done() when it is finished. */
(function(){
'use strict';
var LR = window.LR, U = LR.ui, K = LR.kit, P = LR.progress, S = LR.speech;
LR.steps = LR.steps || {};
var session = LR.session = { IDLE_MS: 8000, BUDGET_MIN: 12 };
var idleTimer = null;
var token = 0; /* changes whenever a new item is drawn or the screen changes: stale callbacks check it */
var practice = null; /* a practice run from Grown-ups lives in memory, so it never replaces the day's plan */

function state(){ return LR.state; }
function save(){ LR.store.save(); }
function stepIds(r){ return r.steps.map(function(s){ return s.id; }); }

/* ---------- Planning ---------- */
function crocItems(n){
  var out = [], last = null;
  for (var i = 0; i < n; i++) {
    var a, b;
    do { a = U.rand(11); b = U.rand(11); } while (a === b || (last && last.a === a && last.b === b));
    last = { t:'croc', a:a, b:b, m:i % 2 ? 'mouth' : 'more' };
    out.push(last);
  }
  return out;
}
function plan(mode, only){
  var t = P.today(), steps = [];
  function add(id, items){ if (items.length || id === 'garden') steps.push({ id:id, items:items }); }
  var words = mode === 'extra' ? P.planExtra(8) : P.planWords(10);
  if (!only || only === 'words') add('words', words.map(function(w){ return { t:'find', w:w }; }));
  if (mode === 'day' || only === 'tricky') {
    var tricky = P.newTricky();
    if (only === 'tricky' && !tricky.length) tricky = P.unit().tricky.slice(0, 1);
    if (!only || only === 'tricky') add('tricky', tricky.map(function(w){ return { t:'tricky', w:w }; }));
  }
  if (mode === 'day' || only === 'read') {
    var story = P.nextStory();
    if (!only || only === 'read') add('read', story.s.map(function(s, i){ return { t:'read', story:story.id, i:i }; }));
  }
  if (mode === 'day' || only === 'maths') { if (!only || only === 'maths') add('maths', crocItems(4)); }
  if (mode !== 'practice') add('garden', []);
  return { date:t, steps:steps, at:[0, 0], done:false, started:Date.now(), fresh:0, right:0, answered:0, mode:mode };
}

/* ---------- Running ---------- */
function current(){ return practice || state().resume; }
function clearIdle(){ if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; } }
function setPose(pose){
  var g = U.app().querySelector('.s-guide .guide');
  if (g) g.outerHTML = LR.guide.svg(pose);
}

/* Draws the item the plan is at, or moves on to the next step, or finishes. */
function run(){
  clearIdle();
  var r = current();
  if (!r) { location.hash = '#home'; return; }
  var st = r.steps[r.at[0]];
  if (!st) { finish(); return; }
  /* Time budget: past 12 minutes, each remaining step keeps one item (Read with me keeps its story). */
  if (r.at[1] === 0 && st.id !== 'read' && st.items.length > 1 && (Date.now() - r.started) / 60000 > session.BUDGET_MIN) st.items = st.items.slice(0, 1);
  if (st.id === 'garden') { celebrate(); return; }
  var item = st.items[r.at[1]];
  if (!item) { r.at = [r.at[0] + 1, 0]; save(); run(); return; }
  U.stopAll();
  var step = LR.steps[item.t];
  step.render(item, makeCtx(r, st, item));
}

function makeCtx(r, st, item){
  var tok = ++token, misses = 0, finished = false, prompt = null, reprompts = 0;
  var ctx = {
    item:item, step:st.id, first:r.at[1] === 0, last:r.at[1] === st.items.length - 1,
    live:function(){ return tok === token && !finished; },
    misses:function(){ return misses; },
    miss:function(){ return ++misses; },
    /* Draws the session screen around the step's activity. */
    screen:function(o){
      U.app().innerHTML = K.screen({ steps:stepIds(r), step:st.id, seeds:[st.items.length, r.at[1]], pose:o.pose || 'waiting', say:'', main:o.main });
    },
    pose:setPose,
    /* Speaks the instruction (none if text is empty); if nothing is tapped for a while, says it again
       (or `again`), 3 times, then offers "Go on". */
    prompt:function(text, opts, idleMs, again){
      prompt = { text:text, opts:opts || {}, idle:idleMs || session.IDLE_MS, again:again || text };
      reprompts = 0;
      return speakPrompt(!text);
    },
    /* The item is finished. firstTry: answered right the first time (for the day's accuracy). */
    done:function(firstTry, counted){
      if (finished) return;
      finished = true;
      clearIdle();
      if (counted !== false) { r.answered++; if (firstTry) r.right++; }
      r.at = [r.at[0], r.at[1] + 1];
      save();
      if (tok === token) run();
    },
    /* Ends the whole step (Read with me's "Not today"). */
    skipStep:function(){
      if (tok !== token) return;
      finished = true;
      clearIdle();
      r.at = [r.at[0] + 1, 0];
      save();
      run();
    },
    grew:function(){ r.fresh++; }
  };
  function speakPrompt(silent){
    clearIdle();
    var gg = U.gen, text = reprompts ? prompt.again : prompt.text;
    return (silent ? Promise.resolve() : S.say(text, reprompts && prompt.again !== prompt.text ? {} : prompt.opts)).then(function(){
      if (gg !== U.gen || tok !== token || finished) return;
      idleTimer = setTimeout(onIdle, prompt.idle);
    });
  }
  function onIdle(){
    idleTimer = null;
    if (tok !== token || finished) return;
    reprompts++;
    if (reprompts <= 3) { U.stopAll(); speakPrompt(); return; }
    goOn();
  }
  /* After 3 re-prompts: one quiet screen with a single "Go on", which redraws the item. */
  function goOn(){
    var main = U.app().querySelector('.s-main');
    if (!main) return;
    setPose('waiting');
    main.innerHTML = K.target('goon', 'Go on', 'play');
    S.say('Tap to go on');
  }
  /* Any tap in the app counts as activity: the idle count starts again. */
  ctx.touched = function(){ if (prompt && !finished) { clearIdle(); if (!U.app().querySelector('[data-act=goon]')) idleTimer = setTimeout(onIdle, prompt.idle); } };
  session.ctx = ctx;
  return ctx;
}

/* The garden step: today's new flowers and a spoken summary. */
function celebrate(){
  var r = current(), n = r.fresh, total = state().flowers.length;
  session.ctx = null;
  token++;
  U.stopAll();
  U.app().innerHTML = K.screen({ steps:stepIds(r), step:'garden', pose:'happy', say:'',
    main:'<div class="s-celebrate">' + LR.garden.svg(total, n) + '</div>' + K.target('done', 'Done', 'home', ' disabled').replace('class="s-target"', 'class="s-target off"') });
  var g = U.gen, tok = token;
  S.say(n ? 'You grew ' + n + ' flower' + (n === 1 ? '' : 's') + '!' : 'Well done! Your garden is growing.').then(function(){
    if (tok !== token) return;
    var d = U.app().querySelector('[data-act=done]');
    if (d) { d.disabled = false; d.className = 's-target'; }
  });
}

function finish(){
  var r = current();
  clearIdle();
  if (!r.done) {
    r.done = true;
    P.recordDay(r.answered, r.right, Math.min(600, Math.round((Date.now() - r.started) / 60000)));
    if (r.mode === 'day') P.advance();
    save();
  }
  if (r.mode === 'practice') { practice = null; location.hash = '#grownups'; }
  else location.hash = '#home';
}

/* ---------- Taps ---------- */
function click(e){
  var el = U.closestAct(e);
  if (!el || el.disabled || el.hasAttribute('data-hold')) return;
  var a = el.getAttribute('data-act');
  if (a === 'goon') { run(); return; }
  if (a === 'done') { finish(); return; }
  if (a === 'start') { location.hash = '#session'; return; }
  var r = current(), st = r && r.steps[r.at[0]], item = st && st.items[r.at[1]];
  if (item && LR.steps[item.t] && session.ctx) LR.steps[item.t].tap(el, a, session.ctx);
}

/* Hold buttons act only after being held; the ring fills as they are held. A quick tap gives a spoken hint. */
var hold = null;
function holdStart(e){
  var el = e.target.closest && e.target.closest('[data-hold]');
  if (!el) return;
  e.preventDefault();
  var ms = +el.getAttribute('data-hold') || 1000, t0 = Date.now(), fg = null, c = 2 * Math.PI * 44;
  hold = { el:el, done:false };
  var h = hold;
  (function tick(){
    if (hold !== h) return;
    var p = Math.min(1, (Date.now() - t0) / ms), ring = el.querySelector('.s-ring');
    if (!fg && ring) {
      fg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      fg.setAttribute('cx', 50); fg.setAttribute('cy', 50); fg.setAttribute('r', 44);
      fg.setAttribute('class', 's-ring-fg'); fg.setAttribute('transform', 'rotate(-90 50 50)');
      ring.appendChild(fg);
    }
    if (fg) fg.setAttribute('stroke-dasharray', (c * p).toFixed(1) + ' ' + c.toFixed(1));
    if (p >= 1) { h.done = true; hold = null; holdAction(el.getAttribute('data-act')); return; }
    requestAnimationFrame(tick);
  })();
}
function holdEnd(){
  if (!hold) return;
  var el = hold.el;
  hold = null;
  var fg = el.querySelector('.s-ring-fg');
  if (fg) fg.parentNode.removeChild(fg);
  var a = el.getAttribute('data-act');
  U.stopAll();
  S.say(a === 'home' ? 'Hold to go home' : a === 'skip' ? 'A grown-up can hold this' : 'Hold it');
}
function holdAction(a){
  if (a === 'home') { clearIdle(); location.hash = '#home'; }
  else if (a === 'grownups') location.hash = '#grownups';
  else if (a === 'skip' && session.ctx) session.ctx.skipStep();
}
document.addEventListener('pointerdown', holdStart);
document.addEventListener('pointerup', holdEnd);
document.addEventListener('pointercancel', holdEnd);
document.addEventListener('pointerdown', function(e){
  if (session.ctx && e.target.closest && !e.target.closest('[data-hold]')) session.ctx.touched();
}, true);

/* ---------- Routes ---------- */
function start(mode, only){
  var st = state(), t = P.today();
  st.last = t;
  if (mode === 'practice') practice = plan('practice', only);
  else {
    practice = null;
    var r = st.resume, today = !!r && r.date === t;
    /* Once today's session is done, Start gives extra practice. An unfinished plan from today resumes where it was. */
    if (today && r.done) st.resume = plan('extra');
    else if (!today) st.resume = plan('day');
  }
  save();
  U.app().className = 's-root';
  U.app().onclick = click;
  run();
}
LR.routes.session = function(){ document.title = 'Little Reader'; start('day'); };
['words', 'tricky', 'read', 'maths'].forEach(function(id){
  LR.routes['practice-' + id] = function(){ document.title = 'Practise – Little Reader'; start('practice', id); };
});

/* Home: her garden and one Start. After today's session, "See you tomorrow" and Start offers more practice. */
LR.routes.home = function(){
  clearIdle();
  session.ctx = null;
  token++;
  document.title = 'Little Reader';
  var st = state(), t = P.today(), r = st.resume;
  var doneToday = !!r && r.date === t && r.done && (r.mode === 'day' || r.mode === 'extra');
  var fresh = r && r.date === t ? r.fresh : 0, n = st.flowers.length;
  var app = U.app();
  app.className = 's-root';
  app.innerHTML = '<div class="s-home"><div class="g-wide">' + LR.garden.svg(n, fresh) + '</div><div class="g-tall">' + LR.garden.svg(n, fresh, true) + '</div>'
    + '<div class="s-corner">' + K.hold('grownups', 'lock', 'Grown-ups', 2000, 0, 'small') + '</div>'
    + '<h1 class="s-title">Little Reader</h1>'
    + (doneToday ? '<p class="s-note">See you tomorrow!</p>' : '')
    + K.target('start', doneToday ? 'Play more' : 'Start', 'play').replace('class="s-target"', 'class="s-target big"')
    + LR.guide.svg(doneToday ? 'happy' : 'waiting') + '</div>';
  app.onclick = click;
};
})();
