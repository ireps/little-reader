/* Heart words: one word at a time, tricky letters marked, with its family of the same trick.
   "Find the ♥" hides the hearts and she taps the letters she thinks are tricky. */
(function(){
'use strict';
var LR = window.LR, U = LR.ui, W = LR.words, S = LR.speech;
var hw;

function list(){
  var w = U.unique(LR.state.words.map(U.clean)).filter(Boolean);
  if (!w.length) w = U.storyWords().filter(W.isHeart);
  return w;
}

/* The family only appears once she has heard the word, so she meets the word first. */
function revealFamily(){
  var f = U.app().querySelector('.family');
  if (f) f.hidden = false;
}

function familyHTML(w){
  var fam = W.familyOf(w);
  if (!fam) return '';
  return '<div class="family" hidden><p>Same trick: ' + U.esc(fam.name) + '</p>'
    + fam.words.filter(function(x){ return x !== w; }).slice(0, 6).map(function(x){
        return '<button class="chip" data-act="chip" data-w="' + U.esc(x) + '">' + U.lettersHTML(x) + '</button>';
      }).join('') + '</div>';
}

/* The word sits between the previous and next arrows, so the screen fits 614 px of height. */
function wordRow(inner){
  return '<div class="wordrow"><button class="btn soft arrow" data-act="prev" aria-label="Previous word">' + LR.icons.get('left') + '</button>'
    + inner + '<button class="btn soft arrow" data-act="next" aria-label="Next word">' + LR.icons.get('right') + '</button></div>';
}
function noteHTML(text, l, id){
  return '<p class="heart-note"' + (id ? ' id="' + id + '"' : '') + '>' + text + '</p><p class="count">' + (hw.i + 1) + ' of ' + l.length + '</p>';
}

function draw(){
  var app = U.app(), l = list();
  if (!l.length) { U.noWords(); return; }
  if (hw.i >= l.length) hw.i = 0;
  var w = l[hw.i], heart = W.isHeart(w);
  hw.word = w;
  if (hw.find && heart) { drawFind(w, l); return; }
  hw.find = false;
  app.innerHTML = '<div class="hw">'
    + wordRow('<button class="big-word" data-act="word">' + U.lettersHTML(w) + '</button>')
    + noteHTML(heart ? '♥ letters: learn them by heart' : '&nbsp;', l)
    + '<div class="row"><button class="btn" data-act="hear">' + LR.icons.get('speaker') + ' Hear it</button><button class="btn soft" data-act="spell">Say, spell, say</button>'
    + (heart ? '<button class="btn soft" data-act="find" aria-label="Find the hearts">Find the ' + LR.icons.get('heart') + '</button>' : '') + '</div>'
    + familyHTML(w) + '</div>';
  app.onclick = click;
  var g = U.gen;
  S.say(w).then(function(){ if (g === U.gen) revealFamily(); });
}

/* Find the ♥: the word without hearts, every letter a button. */
function drawFind(w, l){
  var app = U.app(), ls = '';
  hw.found = [];
  for (var i = 0; i < w.length; i++) ls += '<button class="l lbtn" data-act="letter" data-i="' + i + '">' + U.esc(w.charAt(i)) + '</button>';
  app.innerHTML = '<div class="hw">'
    + wordRow('<div class="big-word find" role="group" aria-label="' + U.esc(w) + '">' + ls + '</div>')
    + noteHTML('Tap the letters that don’t sound the way they look', l, 'find-note')
    + '<div class="row"><button class="btn" data-act="hear">' + LR.icons.get('speaker') + ' Hear it</button><button class="btn soft" data-act="show">Show me</button></div>'
    + '</div>';
  app.onclick = click;
  S.say(w + '. Find the tricky letters.');
}

function findTap(el){
  var w = hw.word, hearts = W.heartsFor(w), i = parseInt(el.getAttribute('data-i'), 10);
  U.stopAll();
  if (hearts.indexOf(i) > -1) {
    U.feedback(el, 'right');
    if (hw.found.indexOf(i) === -1) hw.found.push(i);
    el.classList.add('h');
    el.disabled = true;
    if (hw.found.length === hearts.length) {
      document.getElementById('find-note').textContent = 'You found them all!';
      var g = U.gen;
      S.say('You found them all! ' + w + '.').then(function(){ if (g === U.gen) { hw.find = false; draw(); } });
    } else S.say('Yes! That one is tricky.');
  } else {
    U.feedback(el, 'wrong');
    el.classList.add('plain');
    el.disabled = true;
    S.say('That one sounds the way it looks. Try another.');
  }
}

function click(e){
  var el = U.closestAct(e);
  if (!el || el.disabled) return;
  var a = el.getAttribute('data-act'), l = list(), w = hw.word, big = U.app().querySelector('.big-word');
  if (a === 'word' || a === 'hear') {
    if (hw.find) { U.stopAll(); S.say(w); }
    else { U.sayWord(big, w); revealFamily(); }
  }
  else if (a === 'spell') { U.saySpellSay(big, w); revealFamily(); }
  else if (a === 'chip') U.sayWord(el, el.getAttribute('data-w'));
  else if (a === 'find') { U.stopAll(); hw.find = true; draw(); }
  else if (a === 'show') { U.stopAll(); hw.find = false; draw(); }
  else if (a === 'letter') findTap(el);
  else if (a === 'prev') { hw.i = (hw.i - 1 + l.length) % l.length; hw.find = false; U.stopAll(); draw(); }
  else if (a === 'next') { hw.i = (hw.i + 1) % l.length; hw.find = false; U.stopAll(); draw(); }
}

LR.routes.hearts = function(){ U.setTitle('Heart words'); hw = { i:0, find:false }; draw(); };
})();
