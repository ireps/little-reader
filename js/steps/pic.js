/* Picture match: she reads a word (sound buttons under it) and taps its picture. Nothing is said before she answers. */
(function(){
'use strict';
var LR = window.LR, U = LR.ui, K = LR.kit, P = LR.progress;
var cur = null;

/* Two other pictures, different from the word's own, preferring words that start the same way. */
function distractors(w){
  var mine = LR.pictures[w], seen = {}, list = Object.keys(LR.pictures).filter(function(x){
    var e = LR.pictures[x];
    if (x === w || e === mine || seen[e]) return false;
    seen[e] = 1; return true;
  });
  list.sort(function(a, b){ return (b.charAt(0) === w.charAt(0)) - (a.charAt(0) === w.charAt(0)) || Math.random() - 0.5; });
  return list.slice(0, 2);
}

LR.steps.pic = {
  render:function(item, ctx){
    var w = item.w, opts = U.shuffle([w].concat(distractors(w)));
    cur = { w:w };
    ctx.screen({ main:K.soundWord(w) + '<div class="s-row s-cards">' + opts.map(function(o){ return K.picCard(o); }).join('') + '</div>' });
    ctx.prompt('Find its picture');
  },
  tap:function(el, act, ctx){
    if (act !== 'pick') return;
    var w = cur.w, picked = el.getAttribute('data-w');
    LR.choice(el, picked === w, ctx, {
      sel:'.s-pic',
      right:function(){ return 'Yes! ' + w; },
      wrong:function(){ return 'That is a ' + picked + '.'; },
      reveal:function(){ return 'This is the ' + w + '.'; },
      rightEl:function(){ return U.app().querySelector('.s-pic[data-w="' + w + '"]'); },
      onRight:function(first){ if (first && P.right(P.wid(w))) ctx.grew(); LR.store.save(); },
      onMiss:function(n){ if (n === 1) { P.miss(P.wid(w)); LR.store.save(); } }
    });
  }
};
})();
