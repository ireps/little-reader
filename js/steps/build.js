/* Build it: she hears a word and builds it by tapping tiles into slots, left to right. A sound made of two or
   more letters (sh, ee, a_e) is one tile. Two extra tiles don't belong. A wrong tile stays in the tray, dims for a
   moment with a soft tone, and nothing is lost. */
(function(){
'use strict';
var LR = window.LR, U = LR.ui, K = LR.kit, P = LR.progress, S = LR.speech, W = LR.words;
var cur = null;
var DECOYS = ['s', 'a', 't', 'p', 'i', 'n', 'm', 'd', 'g', 'o', 'c', 'k', 'e', 'u', 'r', 'h', 'b', 'f', 'l', 'sh', 'ch', 'th', 'ee', 'oa', 'ai', 'ar'];

function tileText(g){ return /_e$/.test(g) ? g.charAt(0) + '–e' : g; }
function slotsHTML(){
  return '<div class="s-slots">' + cur.parts.map(function(g, i){
    var done = i < cur.at;
    return '<span class="s-slot' + (done ? ' full' : i === cur.at ? ' next' : '') + '">' + (done ? U.esc(tileText(g)) : '') + '<i class="sb ' + (g.replace('_e', '').length > 1 || /_e$/.test(g) ? 'dash' : 'dot') + '"></i></span>';
  }).join('') + '</div>';
}
function trayHTML(){
  return '<div class="s-row s-tray">' + cur.tray.map(function(t, i){
    return t.used ? '' : '<button class="s-tile" data-act="tile" data-i="' + i + '">' + U.esc(tileText(t.g)) + '</button>';
  }).join('') + K.replay() + '</div>';
}
function draw(){
  var main = U.app().querySelector('.s-main');
  main.innerHTML = slotsHTML() + trayHTML();
}

LR.steps.build = {
  render:function(item, ctx){
    var w = item.w, parts = W.segment(w) || w.split('');
    var decoys = U.shuffle(DECOYS.filter(function(g){ return parts.indexOf(g) === -1; })).slice(0, 2);
    cur = { w:w, parts:parts, at:0, tray:U.shuffle(parts.concat(decoys).map(function(g){ return { g:g, used:false }; })) };
    ctx.screen({ main:'' });
    draw();
    ctx.prompt(w, { caption:'Build the word you hear' });
  },
  tap:function(el, act, ctx){
    var w = cur.w;
    if (act === 'hear') { U.stopAll(); ctx.prompt(w, { caption:'Build the word you hear' }); return; }
    if (act !== 'tile' || ctx.locked) return;
    var t = cur.tray[+el.getAttribute('data-i')];
    U.stopAll();
    if (t.g === cur.parts[cur.at]) {
      U.feedback(el, 'right');
      t.used = true;
      cur.at++;
      if (cur.at < cur.parts.length) { S.say(W.soundOf(t.g)); draw(); return; }
      /* Built: the whole word, green, then praise. */
      ctx.locked = true;
      var first = !ctx.misses();
      U.app().querySelector('.s-main').innerHTML = K.soundWord(w, 'fb-right');
      S.say('Yes! ' + w).then(function(){ if (ctx.live()) ctx.done(first); });
      if (first && P.right(P.wid(w))) ctx.grew();
      LR.store.save();
      ctx.pose('happy');
      return;
    }
    U.feedback(el, 'wrong');
    var n = ctx.miss();
    if (n === 1) { P.miss(P.wid(w)); LR.store.save(); }
    ctx.pose('thinking');
    if (n >= 2) {
      /* Errorless finish after 2 wrong tiles: build it for her, then move on. */
      ctx.locked = true;
      U.app().querySelector('.s-main').innerHTML = K.soundWord(w, 'fb-right');
      S.say('It is ' + w + '.').then(function(){ if (ctx.live()) ctx.done(false); });
      return;
    }
    S.say('Not that one.').then(function(){ if (el.isConnected) { el.classList.remove('fb-wrong'); var m = el.querySelector('.fb-mark'); if (m) m.parentNode.removeChild(m); } });
  }
};
})();
