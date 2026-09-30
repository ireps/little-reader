/* Read the story: warm up the tricky words, then one sentence per screen. */
(function(){
'use strict';
var LR = window.LR, U = LR.ui, W = LR.words, S = LR.speech;
var st;

function warmUp(words){
  var app = U.app();
  app.innerHTML = '<div class="warm"><p class="prompt">Warm up: tricky words in this story</p>'
    + '<p class="tip">Tap each one to hear it.</p><div class="cards">'
    + words.map(function(w){ return '<button class="chip" data-act="chip" data-w="' + U.esc(w) + '">' + U.lettersHTML(w) + '</button>'; }).join('')
    + '</div><div class="row"><button class="btn" data-act="start">' + LR.icons.get('book') + ' Start reading</button></div></div>';
  app.onclick = function(e){
    var el = U.closestAct(e);
    if (!el) return;
    var a = el.getAttribute('data-act');
    if (a === 'chip') U.sayWord(el, el.getAttribute('data-w'));
    else if (a === 'start') { U.stopAll(); read(); }
  };
}

function sentenceHTML(s){
  return (s.match(/[A-Za-z']+|[^A-Za-z']+/g) || []).map(function(t){
    return /^[A-Za-z']+$/.test(t) ? '<button class="w" data-act="w" data-w="' + U.esc(t) + '">' + U.lettersHTML(t) + '</button>' : U.esc(t);
  }).join('');
}

/* Two modes: "Together" shows "Read it to me" at once; "My turn" hides it until she says she has read the sentence. */
function modesHTML(){
  var m = LR.state.storyMode;
  return '<div class="modes" role="group" aria-label="Reading mode">'
    + '<button class="mode" data-act="mode" data-m="together" aria-pressed="' + (m === 'together') + '">Together</button>'
    + '<button class="mode" data-act="mode" data-m="myturn" aria-pressed="' + (m === 'myturn') + '">My turn</button></div>';
}

function read(){
  var app = U.app(), ss = U.sentences();
  if (st.i >= ss.length) { done(); return; }
  var s = ss[st.i], mine = LR.state.storyMode === 'myturn';
  var I = LR.icons.get;
  var controls = mine
    ? '<button class="btn" data-act="tried">' + I('check') + ' I read it</button><button class="btn soft" data-act="read" hidden>' + I('speaker') + ' Now listen</button>'
    : '<button class="btn" data-act="read">' + I('speaker') + ' Read it to me</button>';
  /* One row of controls (arrows, modes, reading), so the screen fits 614 px of height. */
  app.innerHTML = '<div class="sentence">' + sentenceHTML(s) + '</div>'
    + '<div class="ctl"><button class="btn soft arrow" data-act="prev" aria-label="Previous sentence">' + I('left') + '</button>'
    + modesHTML() + controls
    + '<button class="btn soft arrow" data-act="next" aria-label="Next sentence">' + I('right') + '</button></div>'
    + U.dotsHTML(ss.length, st.i)
    + '<p class="tip">' + (mine ? 'Read it out loud. Stuck on a word? Tap it.' : 'Stuck on a word? Tap it.') + '</p>';
  app.onclick = function(e){
    var el = U.closestAct(e);
    if (!el) return;
    var a = el.getAttribute('data-act');
    if (a === 'w') { var w = el.getAttribute('data-w'); U.bumpTricky(U.clean(w), 1); U.sayWord(el, w); }
    else if (a === 'read') readSentence(s);
    else if (a === 'tried') {
      el.hidden = true;
      app.querySelector('[data-act=read]').hidden = false;
      U.stopAll();
      S.say('Well done! Now listen and check.');
    }
    else if (a === 'mode') { LR.state.storyMode = el.getAttribute('data-m'); LR.store.save(); U.stopAll(); read(); }
    else if (a === 'prev') { if (st.i > 0) { st.i--; U.stopAll(); read(); } }
    else if (a === 'next') { st.i++; U.stopAll(); read(); }
  };
}

/* The whole sentence in one go, each word lit (pointing) while it is spoken. */
function readSentence(s){
  U.stopAll();
  var g = U.gen, els = U.app().querySelectorAll('.sentence .w');
  var words = Array.prototype.map.call(els, function(el){ return el.getAttribute('data-w'); });
  function light(i){ Array.prototype.forEach.call(els, function(el, k){ el.classList.toggle('say', k === i); }); }
  S.say(s, { parts:words, onWord:function(i){ if (g === U.gen) light(i); } })
    .then(function(){ if (g === U.gen) light(-1); });
}

function done(){
  var app = U.app();
  app.innerHTML = '<div class="done"><div class="stars">' + LR.icons.get('flower') + '</div><p class="prompt">You read the whole story!</p>'
    + '<div class="row"><button class="btn" data-act="again">Read it again</button><a class="btn soft" href="#home">Home</a></div></div>';
  app.onclick = function(e){
    var el = U.closestAct(e);
    if (el && el.getAttribute('data-act') === 'again') { st.i = 0; U.stopAll(); read(); }
  };
  S.say('You read the whole story!');
}

LR.routes.story = function(){
  U.setTitle('Read the story');
  st = { i:0 };
  if (!U.sentences().length) { U.noWords(); return; }
  var warm = U.storyWords().filter(function(w){ return W.isHeart(w) || (LR.state.tricky[w] || 0) > 0; });
  if (warm.length) warmUp(warm); else read();
};
})();
