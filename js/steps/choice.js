/* Shared by the choice activities: a tap on one of several answers.
   Right: green, check, chime, praise, then the item ends. Wrong: dimmed with a dot and a soft tone; after 2 misses
   (or at once, when there were only 2 choices) the answer is shown and said, and the item ends. Never red, never a cross. */
(function(){
'use strict';
var LR = window.LR, U = LR.ui, S = LR.speech;

function dimOthers(keep, sel){
  Array.prototype.forEach.call(U.app().querySelectorAll(sel), function(c){
    c.disabled = true;
    if (c !== keep && !c.classList.contains('fb-wrong')) c.classList.add('dim');
  });
}

/* o: { sel: answer selector, right(first): what to say when right, wrong(el): what to say after a miss,
        reveal(el): what to say when showing the answer, rightEl(): the right answer's element,
        two: only two choices, onRight(first), onMiss(n), counted: false to leave the day's accuracy alone,
        revealWith(): instead of reveal, a function returning a promise (e.g. a count-along) } */
LR.choice = function(el, ok, ctx, o){
  if (ctx.locked) return;
  U.stopAll();
  if (ok) {
    ctx.locked = true;
    U.feedback(el, 'right');
    var first = !ctx.misses();
    var p = S.say(o.right(first));
    dimOthers(el, o.sel);
    if (o.onRight) o.onRight(first);
    ctx.pose('happy');
    p.then(function(){ if (ctx.live()) ctx.done(first, o.counted); });
    return;
  }
  U.feedback(el, 'wrong');
  el.disabled = true;
  var n = ctx.miss();
  if (n >= 2 || o.two) {
    ctx.locked = true;
    var r = o.rightEl();
    if (r) { U.feedback(r, 'right'); dimOthers(r, o.sel); }
    (o.revealWith ? o.revealWith() : S.say(o.reveal(el))).then(function(){ if (ctx.live()) ctx.done(false, o.counted); });
  } else S.say(o.wrong(el));
  if (o.onMiss) o.onMiss(n);
  ctx.pose('thinking');
};
})();
