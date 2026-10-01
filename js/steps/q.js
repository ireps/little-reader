/* Story questions: after Read with me, a who or what question about the story, with word (and picture) answers. */
(function(){
'use strict';
var LR = window.LR, U = LR.ui, K = LR.kit;
var cur = null;

function storyOf(id){ var f = null; LR.units.forEach(function(u){ u.stories.forEach(function(st){ if (st.id === id) f = st; }); }); return f; }
function answer(o){
  var w = U.clean(o), pic = LR.pictures[w];
  return '<button class="s-card s-answer" data-act="pick" data-w="' + U.esc(o) + '">' + (pic ? '<span class="s-picimg" aria-hidden="true">' + pic + '</span>' : '') + '<span>' + U.esc(o) + '</span></button>';
}

LR.steps.q = {
  render:function(item, ctx){
    var st = storyOf(item.story), q = st && st.q && st.q[item.k];
    if (!q) { ctx.done(true, false); return; }
    cur = { q:q };
    ctx.screen({ pose:'thinking', main:'<div class="s-row s-cards">' + U.shuffle(q.opts.slice()).map(answer).join('') + '</div>' + K.replay() });
    ctx.prompt(q.q);
  },
  tap:function(el, act, ctx){
    if (act === 'hear') { U.stopAll(); ctx.prompt(cur.q.q); return; }
    if (act !== 'pick') return;
    var picked = el.getAttribute('data-w');
    LR.choice(el, picked === cur.q.a, ctx, {
      sel:'.s-answer', counted:false,
      right:function(){ return 'Yes! ' + cur.q.a + '.'; },
      wrong:function(){ return 'Not ' + picked + '. Think about the story.'; },
      reveal:function(){ return 'It was ' + cur.q.a + '.'; },
      rightEl:function(){ return U.app().querySelector('.s-answer[data-w="' + cur.q.a + '"]'); }
    });
  }
};
})();
