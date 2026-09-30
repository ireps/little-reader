/* Word detective: hear a word, find it among look-alikes that start the same way. */
(function(){
'use strict';
var LR = window.LR, U = LR.ui, W = LR.words, S = LR.speech;
var det;

function pool(){ return U.unique(LR.state.words.map(U.clean).concat(U.storyWords())).filter(function(w){ return w.length >= 2; }); }

/* This week's words, heart words and words she has missed come up more often. */
function weightedPick(p, last){
  var weekly = LR.state.words.map(U.clean);
  var ws = p.map(function(w){
    if (w === last && p.length > 1) return 0;
    var x = 1;
    if (weekly.indexOf(w) > -1) x += 2;
    if (W.isHeart(w)) x += 2;
    x += (LR.state.tricky[w] || 0) * 3;
    return x;
  });
  var total = ws.reduce(function(a, b){ return a + b; }, 0), r = Math.random() * total;
  for (var i = 0; i < p.length; i++) { r -= ws[i]; if (r < 0) return p[i]; }
  return p[p.length - 1];
}

/* Words she has picked instead of this one before, most frequent first. */
function mixUps(target){
  var m = LR.state.confusions[target] || {};
  return Object.keys(m).sort(function(a, b){ return m[b] - m[a]; });
}

/* Distractors: her own past mix-ups first, then look-alikes that share the first letter and shape,
   so guessing from the first letter doesn't work. */
function lookalikes(target, p){
  var mine = mixUps(target).slice(0, 2);
  if (mine.length === 2) return mine;
  var cands = U.unique(p.concat(W.BANK)).filter(function(w){ return w !== target && w.length >= 2; });
  var scored = cands.map(function(w){
    var s = Math.random() * 1.5;
    if (w.charAt(0) === target.charAt(0)) s += 3;
    if (w.slice(0, 2) === target.slice(0, 2)) s += 1;
    if (Math.abs(w.length - target.length) <= 1) s += 1.5;
    if (w.charAt(w.length - 1) === target.charAt(target.length - 1)) s += 1;
    return { w:w, s:s };
  });
  scored.sort(function(a, b){ return b.s - a.s; });
  var rest = scored.map(function(o){ return o.w; }).filter(function(w){ return mine.indexOf(w) === -1; });
  return mine.concat(rest).slice(0, 2);
}
function recordMixUp(target, picked){
  var c = LR.state.confusions, row = c[target] || (c[target] = {});
  row[picked] = (row[picked] || 0) + 1;
  LR.store.save();
}

function round(){
  var app = U.app(), p = pool();
  if (!p.length) { U.noWords(); return; }
  if (det.round >= det.total) { done(); return; }
  var t = weightedPick(p, det.last);
  det.last = t; det.target = t; det.missed = false; det.locked = false;
  var opts = U.shuffle([t].concat(lookalikes(t, p)));
  app.innerHTML = '<p class="prompt">Find the word you hear</p>'
    + '<div class="row"><button class="btn soft" data-act="hear">🔊 Hear it again</button></div>'
    + '<div class="cards">' + opts.map(function(w){ return '<button class="card" data-act="pick" data-w="' + U.esc(w) + '">' + U.lettersHTML(w, true) + '</button>'; }).join('') + '</div>'
    + U.dotsHTML(det.total, det.round);
  app.onclick = click;
  var g = U.gen;
  setTimeout(function(){ if (g === U.gen) S.say(t); }, 400);
}

function click(e){
  var el = U.closestAct(e);
  if (!el) return;
  var act = el.getAttribute('data-act');
  if (act === 'hear') { U.stopAll(); S.say(det.target); }
  else if (act === 'again') { LR.routes.detective(); }
  else if (act === 'pick') {
    if (det.locked || el.disabled) return;
    var w = el.getAttribute('data-w');
    if (w === det.target) {
      det.locked = true;
      el.classList.add('right');
      if (!det.missed) det.firstTry++;
      U.bumpTricky(w, -1);
      Array.prototype.forEach.call(U.app().querySelectorAll('.card'), function(c){ c.disabled = true; });
      U.stopAll();
      var g = U.gen;
      S.say('Yes! ' + w).then(function(){ setTimeout(function(){ if (g !== U.gen) return; det.round++; round(); }, 500); });
    } else {
      det.missed = true;
      recordMixUp(det.target, w);
      el.disabled = true;
      el.classList.add('wrong');
      U.bumpTricky(det.target, 1);
      U.stopAll();
      var g2 = U.gen;
      U.lightLetters(el, function(){
        S.say('That says ' + w + '.').then(function(){ if (g2 === U.gen) S.say('Look at every letter.'); });
      });
    }
  }
}

function done(){
  var app = U.app(), stars = '';
  for (var i = 0; i < det.firstTry; i++) stars += '⭐';
  app.innerHTML = '<div class="done"><div class="stars" aria-hidden="true">' + (stars || '🌱') + '</div>'
    + '<p class="prompt">You found all ' + det.total + ' words!</p>'
    + '<p class="tip">Each star is a word you found on the first look.</p>'
    + '<div class="row"><button class="btn" data-act="again">Play again</button><a class="btn soft" href="#home">Home</a></div></div>';
  app.onclick = click;
  S.say('Great detective work!');
}

LR.routes.detective = function(){
  U.setTitle('Word detective');
  det = { round:0, total:8, firstTry:0, last:null };
  round();
};
})();
