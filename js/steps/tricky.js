/* New tricky word: she hears it and it is spelled (letters light as they are named), then she finds the heart letters,
   the ones that don't sound the way they look. Then its family: other words with the same trick. */
(function(){
'use strict';
var LR = window.LR, U = LR.ui, K = LR.kit, P = LR.progress, S = LR.speech, W = LR.words;
var cur = null;

function letters(w){
  var out = '<div class="s-letters" role="group" aria-label="' + U.esc(w) + '">';
  for (var i = 0; i < w.length; i++) out += '<button class="l lbtn" data-act="letter" data-i="' + i + '">' + U.esc(w.charAt(i)) + '</button>';
  return out + '</div>';
}

function meet(item, ctx){
  var w = item.w;
  cur = { w:w, found:[], phase:'meet' };
  P.ensure(P.wid(w));
  LR.store.save();
  ctx.screen({ pose:'listening', main:K.word(w, -1) });
  var el = U.app().querySelector('.s-word');
  U.saySpellSay(el, w).then(function(){
    if (!ctx.live()) return;
    if (W.heartsFor(w).length) find(ctx); else family(ctx);
  });
}
function find(ctx){
  cur.phase = 'find';
  var main = U.app().querySelector('.s-main');
  main.innerHTML = letters(cur.w);
  ctx.replay(true);
  ctx.pose('waiting');
  ctx.prompt('Find the heart letters');
}
function family(ctx){
  cur.phase = 'family';
  ctx.replay(false);
  var w = cur.w, fam = W.familyOf(w);
  if (!fam) { S.say(w).then(function(){ if (ctx.live()) ctx.done(true, false); }); return; }
  var others = fam.words.filter(function(x){ return x !== w; }).slice(0, 3);
  U.app().querySelector('.s-main').innerHTML = K.word(w, -1)
    + '<div class="s-row">' + others.map(function(x){ return '<span class="chip">' + U.lettersHTML(x) + '</span>'; }).join('') + '</div>';
  ctx.pose('happy');
  S.say('Same trick: ' + others.join(', ')).then(function(){ if (ctx.live()) ctx.done(true, false); });
}

LR.steps.tricky = {
  render:meet,
  tap:function(el, act, ctx){
    var w = cur.w;
    if (act === 'hear') { U.stopAll(); S.say(w); return; }
    if (act !== 'letter' || cur.phase !== 'find') return;
    var hearts = W.heartsFor(w), i = +el.getAttribute('data-i');
    U.stopAll();
    if (hearts.indexOf(i) > -1) {
      U.feedback(el, 'right');
      el.classList.add('h'); el.disabled = true;
      if (cur.found.indexOf(i) === -1) cur.found.push(i);
      if (cur.found.length === hearts.length) {
        cur.phase = 'found';
        ctx.pose('happy');
        S.say('You found them all! ' + w + '.').then(function(){ if (ctx.live()) family(ctx); });
      } else S.say('Yes! That one is tricky.');
      return;
    }
    U.feedback(el, 'wrong');
    el.classList.add('plain'); el.disabled = true;
    if (ctx.miss() >= 2) {
      /* Errorless finish: show the heart letters, then the family. */
      cur.phase = 'found';
      Array.prototype.forEach.call(U.app().querySelectorAll('.lbtn'), function(b){
        var k = +b.getAttribute('data-i');
        if (hearts.indexOf(k) > -1 && !b.classList.contains('h')) { b.classList.add('h'); U.feedback(b, 'right'); }
        b.disabled = true;
      });
      S.say('These are the heart letters.').then(function(){ if (ctx.live()) family(ctx); });
    } else S.say('That one sounds the way it looks.');
  }
};
})();
