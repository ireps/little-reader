/* The help ladder, for any word she taps while reading. First tap: a hint (its heart letters light, and a word with the
   same trick that she knows, or else its first sound). Second tap: the word. Either counts as a miss, once per word. */
(function(){
'use strict';
var LR = window.LR, U = LR.ui, P = LR.progress, S = LR.speech, W = LR.words;

function known(w){ var r = LR.state.items[P.wid(w)]; return (r && r.b >= 2) || (LR.knownTricky || []).indexOf(w) > -1; }
function hintFor(w){
  var fam = W.isTricky(w) ? W.familyOf(w) : null;
  if (fam) {
    var like = fam.words.filter(function(x){ return x !== w && known(x); })[0];
    if (like) return 'Like ' + like + '.';
  }
  var parts = W.segment(w);
  return parts ? W.soundOf(parts[0]) + '... ' + w : w;
}

/* state: an object kept for the current sentence ({ word: taps }). */
LR.help = function(el, state){
  var raw = el.getAttribute('data-w'), w = U.clean(raw), n = state[w] = (state[w] || 0) + 1;
  el.classList.add('helped');
  if (n === 1) { P.miss(P.wid(w)); LR.store.save(); }
  if (n === 1) {
    U.stopAll();
    Array.prototype.forEach.call(el.querySelectorAll('.l'), function(l, i){ if (W.heartsFor(w).indexOf(i) > -1) l.classList.add('lit'); });
    S.say(hintFor(w));
    return 'hint';
  }
  U.sayWord(el, raw);
  return 'word';
};
LR.help.hintFor = hintFor;
})();
