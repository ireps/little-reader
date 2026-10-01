/* Sounds and words, "Find it": she hears a word and finds it among look-alikes that start the same way,
   with her own past mix-ups as the distractors. Breaks the first-letter-guessing habit. */
(function(){
'use strict';
var LR = window.LR, U = LR.ui, K = LR.kit, P = LR.progress, S = LR.speech, W = LR.words;
/* The caption must not show the word she is listening for. */
var FIND = 'Find the word you hear';
var cur = null;

function mixUps(w){
  var m = LR.state.confusions[w] || {};
  return Object.keys(m).sort(function(a, b){ return m[b] - m[a]; });
}
function recordMixUp(target, picked){
  var c = LR.state.confusions, row = c[target] || (c[target] = {});
  row[picked] = Math.min(999, (row[picked] || 0) + 1);
}

LR.steps.find = {
  render:function(item, ctx){
    var w = item.w, pool = P.unit().words.concat(Object.keys(LR.state.items).map(function(id){ return id.slice(2); }));
    var opts = U.shuffle([w].concat(W.lookalikes(w, pool, mixUps(w), 2)));
    cur = { w:w, locked:false };
    ctx.screen({ main:'<div class="s-row s-cards">' + opts.map(function(o){ return K.card(o); }).join('') + '</div>' + K.replay() });
    ctx.prompt(w, { caption:FIND });
  },
  tap:function(el, act, ctx){
    var w = cur.w;
    if (act === 'hear') { U.stopAll(); ctx.prompt(w, { caption:FIND }); return; }
    if (act !== 'pick' || cur.locked) return;
    var picked = el.getAttribute('data-w');
    U.stopAll();
    /* Feedback and speech first (the speed budget), then the bookkeeping. */
    if (picked === w) {
      cur.locked = true;
      U.feedback(el, 'right');
      var first = !ctx.misses();
      S.say('Yes! ' + w).then(function(){ ctx.done(first); });
      dimOthers(el);
      if (first && P.right(P.wid(w))) ctx.grew();
      ctx.pose('happy');
      return;
    }
    U.feedback(el, 'wrong');
    el.disabled = true;
    if (ctx.miss() >= 2) {
      /* Errorless finish: show and say the answer, then move on. */
      cur.locked = true;
      var right = U.app().querySelector('.s-card[data-w="' + w + '"]');
      if (right) { U.feedback(right, 'right'); dimOthers(right); }
      S.say('That says ' + picked + '. This one says ' + w + '.').then(function(){ ctx.done(false); });
    } else {
      var n = el.querySelectorAll('.l').length, step = Math.max(80, Math.min(Math.round(220 * U.pace().f), Math.round(S.voiceMs(picked) / Math.max(1, n))));
      S.say('That says ' + picked + '.', { onWord:function(i){ if (i === 2 && ctx.live()) U.lightLetters(el, step); } });
    }
    recordMixUp(w, picked);
    if (ctx.misses() === 1) P.miss(P.wid(w));
    LR.store.save();
    ctx.pose('thinking');
  }
};
function dimOthers(keep){
  Array.prototype.forEach.call(U.app().querySelectorAll('.s-card'), function(c){
    c.disabled = true;
    if (c !== keep && !c.classList.contains('fb-wrong')) c.classList.add('dim');
  });
}
})();
