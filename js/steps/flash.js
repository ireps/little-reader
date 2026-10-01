/* Flash: a word shows for 2 seconds (3 at the Calm pace), then hides, and she picks it from 3 look-alikes.
   Nothing is said until she answers: this is reading at a glance, not listening. */
(function(){
'use strict';
var LR = window.LR, U = LR.ui, K = LR.kit, P = LR.progress, W = LR.words;
var cur = null;

LR.steps.flash = {
  SHOW_MS:2000,
  render:function(item, ctx){
    var w = item.w, pool = P.unit().words.concat(Object.keys(LR.state.items).map(function(id){ return id.slice(2); }));
    var mix = Object.keys(LR.state.confusions[w] || {});
    cur = { w:w, opts:U.shuffle([w].concat(W.lookalikes(w, pool, mix, 2, W.nearUpTo(LR.units.indexOf(P.unit()))))) };
    ctx.screen({ main:'<div class="s-flash">' + K.word(w, -1) + '</div>' });
    ctx.prompt('Look!', { caption:'Look!' });
    /* The word hides after 2 s times the pace: a timed reveal, part of the activity (not a wait before moving on). */
    setTimeout(function(){
      if (!ctx.live()) return;
      U.app().querySelector('.s-main').innerHTML = '<div class="s-row s-cards">' + cur.opts.map(function(o){ return K.card(o); }).join('') + '</div>';
      ctx.prompt('Which one was it?');
    }, Math.round(LR.steps.flash.SHOW_MS * U.pace().f));
  },
  tap:function(el, act, ctx){
    if (act !== 'pick') return;
    var w = cur.w, picked = el.getAttribute('data-w');
    LR.choice(el, picked === w, ctx, {
      sel:'.s-card',
      right:function(){ return 'Yes! ' + w; },
      wrong:function(){ return 'That says ' + picked + '. Try again.'; },
      reveal:function(){ return 'It was ' + w + '.'; },
      rightEl:function(){ return U.app().querySelector('.s-card[data-w="' + w + '"]'); },
      onRight:function(first){ if (first && P.right(P.wid(w))) ctx.grew(); LR.store.save(); },
      onMiss:function(n){
        var c = LR.state.confusions, row = c[w] || (c[w] = {});
        row[picked] = Math.min(999, (row[picked] || 0) + 1);
        if (n === 1) P.miss(P.wid(w));
        LR.store.save();
      }
    });
  }
};
})();
