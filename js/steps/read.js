/* Read with me: she reads a sentence aloud to her grown-up. Nothing is read to her first.
   A tap on a word says it and marks it (she stumbled). The tick plays the sentence, words lit, then moves on.
   "Not today" (a 2 s hold, for the grown-up) ends the step; the story is offered first next time. */
(function(){
'use strict';
var LR = window.LR, U = LR.ui, K = LR.kit, P = LR.progress, S = LR.speech;
var cur = null;

function storyOf(id){
  for (var i = 0; i < LR.units.length; i++) for (var j = 0; j < LR.units[i].stories.length; j++)
    if (LR.units[i].stories[j].id === id) return LR.units[i].stories[j];
  return null;
}
/* Words she has mastered lose their heart marks in reading. */
function mastered(s){
  return (s.match(/[A-Za-z']+/g) || []).map(U.clean).filter(P.isMastered);
}

LR.steps.read = {
  render:function(item, ctx){
    var story = storyOf(item.story);
    if (!story || !story.s[item.i]) { ctx.done(true, false); return; }
    var s = story.s[item.i];
    cur = { s:s, story:story, playing:false, helped:{} };
    ctx.screen({ pose:'listening', main:K.sentence(s, { mastered:mastered(s) })
      + '<div class="s-row">' + K.target('check', '', 'check', ' aria-label="I read it" disabled').replace('class="s-target"', 'class="s-target check off"')
      + '<div class="s-skip">' + K.hold('skip', 'skip', 'Not today', 2000, 0, 'small') + '<span>Not today</span></div></div>' });
    /* The tick lights up once the instruction has been said. Reading takes time, so re-prompts wait longer. */
    var p = ctx.prompt(ctx.first ? 'Read to your grown-up' : '', null, 25000, 'Tap the tick when done');
    p.then(function(){
      if (!ctx.live()) return;
      var t = U.app().querySelector('[data-act=check]');
      if (t) { t.disabled = false; t.className = 's-target check'; }
    });
  },
  tap:function(el, act, ctx){
    if (act === 'w') {
      if (cur.playing) return;
      var w = el.getAttribute('data-w'), k = U.clean(w);
      el.classList.add('helped');
      if (!cur.helped[k]) { cur.helped[k] = 1; P.miss(P.wid(k)); LR.store.save(); }
      U.sayWord(el, w);
      return;
    }
    if (act !== 'check' || cur.playing) return;
    cur.playing = true;
    U.stopAll();
    el.disabled = true;
    el.className = 's-target check off';
    ctx.pose('happy');
    var els = U.app().querySelectorAll('.s-sentence .w');
    var words = Array.prototype.map.call(els, function(x){ return x.getAttribute('data-w'); });
    function light(i){ Array.prototype.forEach.call(els, function(x, j){ x.classList.toggle('say', j === i); }); }
    S.say(cur.s, { parts:words, onWord:function(i){ if (ctx.live()) light(i); } }).then(function(){
      if (!ctx.live()) return;
      light(-1);
      if (ctx.last) { LR.state.stories[cur.story.id] = P.today(); LR.store.save(); }
      ctx.done(true, false);
    });
  }
};
})();
