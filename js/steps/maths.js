/* Maths (Phase 4): the crocodile rounds. "Which is more?" (tap the bigger number) and "Which mouth fits?" (< or >).
   The mouth always opens toward the bigger number. Phase 6 replaces this with the full KG-2 maths. */
(function(){
'use strict';
var LR = window.LR, U = LR.ui, K = LR.kit, S = LR.speech;
var cur = null;

function frame(n){
  var s = '<span class="frame" aria-hidden="true">';
  for (var i = 0; i < 10; i++) s += '<span class="cell' + (i < n ? ' fill' : '') + '"></span>';
  return s + '</span>';
}
function mouthSVG(sym){
  var pts = sym === '>' ? '18,18 82,50 18,82' : '82,18 18,50 82,82', ex = sym === '>' ? 56 : 44;
  return '<svg class="mouth" viewBox="0 0 100 100" aria-hidden="true"><polyline points="' + pts + '" fill="none" stroke="currentColor" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<circle cx="' + ex + '" cy="20" r="6" fill="currentColor"/></svg>';
}
function num(n, side, button){
  var inner = '<span class="n">' + n + '</span>' + frame(n);
  return button ? '<button class="s-card s-num" data-act="num" data-side="' + side + '">' + inner + '</button>'
    : '<div class="s-card s-num s-still" id="num-' + side + '">' + inner + '</div>';
}
function sym(){ return cur.a > cur.b ? '>' : '<'; }
function statement(){ return cur.a + (cur.a > cur.b ? ' is greater than ' : ' is less than ') + cur.b; }

LR.steps.croc = {
  render:function(item, ctx){
    cur = { a:item.a, b:item.b, m:item.m, solved:false };
    var more = item.m === 'more';
    var main = '<div class="s-row s-cards s-nums">' + num(item.a, 'a', more) + '<span class="s-sym" id="slot">' + (more ? '' : '?') + '</span>' + num(item.b, 'b', more) + '</div>';
    main += '<div class="s-row">' + (more ? '' : ['<', '>'].map(function(s){
      return '<button class="s-card s-mouth" data-act="sym" data-s="' + s + '" aria-label="' + (s === '>' ? 'greater than' : 'less than') + '">' + mouthSVG(s) + '</button>';
    }).join('')) + K.replay() + '</div>';
    ctx.screen({ main:main });
    ctx.prompt(more ? 'Which is more?' : 'Which mouth fits?');
  },
  tap:function(el, act, ctx){
    if (act === 'hear') { U.stopAll(); ctx.prompt(cur.m === 'more' ? 'Which is more?' : 'Which mouth fits?'); return; }
    if (cur.solved || (act !== 'num' && act !== 'sym')) return;
    var ok = act === 'num' ? (el.getAttribute('data-side') === 'a' ? cur.a : cur.b) === Math.max(cur.a, cur.b) : el.getAttribute('data-s') === sym();
    U.stopAll();
    if (ok) { solve(el, ctx, !ctx.misses()); return; }
    U.feedback(el, 'wrong');
    el.disabled = true;
    ctx.pose('thinking');
    if (ctx.miss() >= 2 || act === 'sym') {
      /* Two choices: after a miss the other one is the answer, so show it. */
      var right = act === 'num' ? U.app().querySelector('[data-act=num]:not([disabled])') : U.app().querySelector('[data-act=sym]:not([disabled])');
      solve(right, ctx, false);
      return;
    }
    S.say('Count the dots. Which has more?');
  }
};
function solve(el, ctx, first){
  cur.solved = true;
  if (el) U.feedback(el, 'right');
  Array.prototype.forEach.call(U.app().querySelectorAll('[data-act=num],[data-act=sym]'), function(b){ b.disabled = true; });
  var slot = document.getElementById('slot');
  if (slot) slot.textContent = sym();
  ctx.pose(first ? 'happy' : 'waiting');
  S.say((first ? 'Yes! ' : 'The mouth opens to ' + Math.max(cur.a, cur.b) + '. ') + statement() + '.').then(function(){ if (ctx.live()) ctx.done(first); });
}
})();
