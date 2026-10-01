/* The KG-2 maths skills other than comparing (js/maths.js makes the questions). She taps one of the answers.
   After a miss on a counting question, the right answer is shown with a count-along: each dot or thing lights
   in turn while its number is said. No red, no cross. */
(function(){
'use strict';
var LR = window.LR, U = LR.ui, K = LR.kit, P = LR.progress, S = LR.speech;
var cur = null;

/* Lights the things to count one by one while the numbers are said, then resolves. */
function countAlong(q){
  /* The answer is being shown, not found by her, so no "Yes!". */
  var said = q.right.replace(/^Yes! /, '');
  var els = U.app().querySelectorAll('.s-q ' + (q.countSel || '.cell.fill'));
  var n = Math.min(els.length, q.count || 0);
  if (!n) return S.say(said);
  var nums = [];
  for (var i = 1; i <= n; i++) nums.push(String(i));
  function light(k){ Array.prototype.forEach.call(els, function(el, j){ el.classList.toggle('lit', j <= k); }); }
  return S.say(nums.join(', '), { parts:nums, onWord:function(k){ light(k); } }).then(function(){ return S.say(said); });
}

LR.steps.math = {
  render:function(item, ctx){
    var q = LR.maths.gen(item);
    if (!q) { ctx.done(true, false); return; }
    cur = { item:item, q:q };
    var many = q.opts.length > 2;
    ctx.screen({ main:(q.show ? '<div class="s-q">' + q.show + '</div>' : '') + '<div class="s-row s-cards m-opts' + (many ? '' : ' two') + '">'
      + q.opts.map(function(o, i){ return '<button class="s-card m-opt" data-act="pick" data-i="' + i + '" aria-label="' + U.esc(o.label) + '">' + o.html + '</button>'; }).join('')
      + '</div>' + K.replay() });
    ctx.prompt(q.prompt);
  },
  tap:function(el, act, ctx){
    var q = cur.q, id = 'm:' + cur.item.s;
    if (act === 'hear') { U.stopAll(); ctx.prompt(q.prompt); return; }
    if (act !== 'pick' || ctx.locked) return;
    var o = q.opts[+el.getAttribute('data-i')];
    LR.choice(el, o.v === q.answer, ctx, {
      sel:'.m-opt', two:q.opts.length === 2,
      right:function(){ return q.right; },
      wrong:function(){ return 'Not that one. Try again.'; },
      reveal:function(){ return ''; },
      rightEl:function(){
        var i = q.opts.map(function(x){ return x.v; }).indexOf(q.answer);
        return U.app().querySelector('.m-opt[data-i="' + i + '"]');
      },
      onRight:function(first){ if (first && P.right(id)) ctx.grew(); LR.store.save(); },
      onMiss:function(n){ if (n === 1) { P.miss(id); LR.store.save(); } },
      /* The reveal counts along instead of a sentence. */
      revealWith:function(){ return countAlong(q); }
    });
  }
};
})();
