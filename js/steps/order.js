/* Word order: the words of a short sentence as shuffled tiles; she taps them in order to fill the slots, left to
   right. A tile that doesn't fit the next slot stays in the tray and dims for a moment with a soft tone. After 2
   wrong tiles the sentence completes itself and is said (errorless finish). Sentences come from her unit's sense
   sentences (js/grammar.js), so every word is one she can read. */
(function(){
'use strict';
var LR = window.LR, U = LR.ui, K = LR.kit, P = LR.progress, S = LR.speech;
var cur = null;

function draw(){
  var slots = '<div class="s-slots s-wslots">' + cur.words.map(function(w, i){
    return '<span class="s-slot s-wslot' + (i < cur.at ? ' full' : i === cur.at ? ' next' : '') + '">' + (i < cur.at ? U.esc(w) : '') + '</span>';
  }).join('') + '</div>';
  var tray = '<div class="s-row s-tray">' + cur.tray.map(function(t, i){
    return t.used ? '' : '<button class="s-tile s-wtile" data-act="tile" data-i="' + i + '">' + U.esc(t.w) + '</button>';
  }).join('') + '</div>';
  U.app().querySelector('.s-main').innerHTML = slots + tray;
}
function complete(cls){
  U.app().querySelector('.s-main').innerHTML = '<div class="s-slots s-wslots">' + cur.words.map(function(w){
    return '<span class="s-slot s-wslot full ' + cls + '">' + U.esc(w) + '</span>'; }).join('') + '</div>';
}

LR.steps.order = {
  render:function(item, ctx){
    var list = LR.grammar.orderSentences(P.unitById(item.u)), s = list[item.k % list.length];
    var words = s.split(' ');
    var tray = U.shuffle(words.map(function(w){ return { w:w, used:false }; }));
    /* Never start already in order. */
    if (tray.map(function(t){ return t.w; }).join(' ') === s) tray.push(tray.shift());
    cur = { s:s, words:words, at:0, tray:tray };
    ctx.screen({ main:'', replay:true });
    draw();
    ctx.prompt('Make the sentence');
  },
  tap:function(el, act, ctx){
    if (act === 'hear') { U.stopAll(); ctx.prompt('Make the sentence'); return; }
    if (act !== 'tile' || ctx.locked) return;
    var t = cur.tray[+el.getAttribute('data-i')];
    U.stopAll();
    if (t.w === cur.words[cur.at]) {
      U.feedback(el, 'right');
      t.used = true;
      cur.at++;
      if (cur.at < cur.words.length) { draw(); return; }
      ctx.locked = true;
      var first = !ctx.misses();
      complete('fb-right');
      ctx.pose('happy');
      S.say('Yes! ' + cur.s).then(function(){ if (ctx.live()) ctx.done(first); });
      return;
    }
    U.feedback(el, 'wrong');
    var n = ctx.miss();
    ctx.pose('thinking');
    if (n >= 2) {
      ctx.locked = true;
      complete('fb-right');
      S.say(cur.s).then(function(){ if (ctx.live()) ctx.done(false); });
      return;
    }
    S.say('Not that one.').then(function(){ if (el.isConnected) { el.classList.remove('fb-wrong'); var m = el.querySelector('.fb-mark'); if (m) m.parentNode.removeChild(m); } });
  }
};
})();
