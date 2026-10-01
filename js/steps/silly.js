/* Silly sentences: she reads a sentence and gives a thumbs up (it makes sense) or a thumbs down (it's silly).
   The sentence is read out only after she answers. A tap on a word gets the help ladder. */
(function(){
'use strict';
var LR = window.LR, U = LR.ui, K = LR.kit, P = LR.progress;
var cur = null;

function unitOf(id){ return LR.units.filter(function(u){ return u.id === id; })[0]; }
function thumb(ok){
  return '<button class="s-card s-thumb' + (ok ? '' : ' down') + '" data-act="thumb" data-ok="' + ok + '" aria-label="' + (ok ? 'Makes sense' : 'Silly') + '">' + LR.icons.get('thumb') + '</button>';
}

LR.steps.silly = {
  render:function(item, ctx){
    var u = unitOf(item.u), x = u && u.silly[item.k];
    if (!x) { ctx.done(true, false); return; }
    cur = { u:item.u, s:x.s, ok:x.ok, help:{} };
    ctx.screen({ main:K.sentence(x.s) + '<div class="s-row s-cards">' + thumb(true) + thumb(false) + '</div>' });
    ctx.prompt('Is it silly?');
  },
  tap:function(el, act, ctx){
    if (act === 'w') { if (!ctx.locked) LR.help(el, cur.help); return; }
    if (act !== 'thumb') return;
    var said = el.getAttribute('data-ok') === 'true';
    LR.choice(el, said === cur.ok, ctx, {
      sel:'.s-thumb', two:true,
      right:function(){ return cur.s + ' ' + (cur.ok ? 'Yes, that makes sense!' : 'Yes, that is silly!'); },
      reveal:function(){ return cur.s + ' ' + (cur.ok ? 'That makes sense.' : 'That is silly!'); },
      rightEl:function(){ return U.app().querySelector('.s-thumb[data-ok="' + cur.ok + '"]'); },
      onRight:function(first){ P.sillyResult(cur.u, first); LR.store.save(); },
      onMiss:function(){ P.sillyResult(cur.u, false); LR.store.save(); }
    });
  }
};
})();
