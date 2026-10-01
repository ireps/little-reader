/* Story questions: after Read with me, who, where or what questions about the story with word (and picture) answers,
   and "What happened first?" with short phrases from the story. */
(function(){
'use strict';
var LR = window.LR, U = LR.ui, K = LR.kit;
var cur = null;

function storyOf(id){ var f = null; LR.units.forEach(function(u){ u.stories.forEach(function(st){ if (st.id === id) f = st; }); }); return f; }
function answer(o){
  var w = U.clean(o), pic = LR.pictures[w];
  return '<button class="s-card s-answer" data-act="pick" data-w="' + U.esc(o) + '">' + (pic ? '<span class="s-picimg" aria-hidden="true">' + pic + '</span>' : '') + '<span>' + U.esc(o) + '</span></button>';
}
/* "What happened first?": short phrases from the story, as wide cards one above the other. */
function phrase(o){
  return '<button class="s-card s-answer s-phrase" data-act="pick" data-w="' + U.esc(o) + '"><span>' + U.esc(o) + '</span></button>';
}

LR.steps.q = {
  render:function(item, ctx){
    var st = storyOf(item.story), q = st && st.q && st.q[item.k];
    if (!q) { ctx.done(true, false); return; }
    cur = { q:q };
    var opts = U.shuffle(q.opts.slice());
    ctx.screen({ pose:'thinking', main:(q.first ? '<div class="s-cards s-col">' + opts.map(phrase).join('') : '<div class="s-row s-cards">' + opts.map(answer).join('')) + '</div>' + K.replay() });
    ctx.prompt(q.q);
  },
  tap:function(el, act, ctx){
    if (act === 'hear') { U.stopAll(); ctx.prompt(cur.q.q); return; }
    if (act !== 'pick') return;
    var picked = el.getAttribute('data-w');
    LR.choice(el, picked === cur.q.a, ctx, {
      sel:'.s-answer', counted:false,
      right:function(){ return 'Yes! ' + cur.q.a + '.'; },
      wrong:function(){ return cur.q.first ? 'Not that one. Think about the story.' : 'Not ' + picked + '. Think about the story.'; },
      reveal:function(){ return cur.q.first ? 'First, ' + cur.q.a + '.' : 'It was ' + cur.q.a + '.'; },
      rightEl:function(){ return U.app().querySelector('.s-answer[data-w="' + cur.q.a + '"]'); }
    });
  }
};
})();
