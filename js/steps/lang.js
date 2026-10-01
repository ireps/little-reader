/* Language tasks, one a day in turn: rhyme, a or an, one or many, where is it (in, on, under), capital letters. */
(function(){
'use strict';
var LR = window.LR, U = LR.ui, K = LR.kit, S = LR.speech;
var cur = null;

/* ---------- Rhyme: she hears a word and finds the picture that rhymes ---------- */
LR.steps.rhyme = {
  render:function(item, ctx){
    var pairs = LR.lang.rhymes, pair = pairs[item.k % pairs.length];
    var others = U.shuffle(pairs.filter(function(p){ return p !== pair; })).slice(0, 2).map(function(p){ return p[U.rand(2)]; });
    cur = { a:pair[0], b:pair[1] };
    ctx.screen({ main:'<div class="s-row">' + K.pic(pair[0]) + '</div><div class="s-row s-cards">' + U.shuffle([pair[1]].concat(others)).map(function(w){ return K.picCard(w); }).join('') + '</div>', replay:true });
    ctx.prompt('What rhymes with ' + pair[0] + '?');
  },
  tap:function(el, act, ctx){
    if (act === 'hear') { U.stopAll(); ctx.prompt('What rhymes with ' + cur.a + '?'); return; }
    if (act !== 'pick') return;
    var picked = el.getAttribute('data-w');
    LR.choice(el, picked === cur.b, ctx, {
      sel:'.s-pic',
      right:function(){ return cur.a + ', ' + cur.b + '! They rhyme.'; },
      wrong:function(){ return cur.a + ', ' + picked + '. They don’t rhyme.'; },
      reveal:function(){ return cur.a + ', ' + cur.b + '. They rhyme.'; },
      rightEl:function(){ return U.app().querySelector('.s-pic[data-w="' + cur.b + '"]'); }
    });
  }
};

/* ---------- a or an ---------- */
function fillGap(t){ var g = U.app().querySelector('.s-gap'); g.textContent = t; g.classList.add('full'); }
LR.steps.an = {
  render:function(item, ctx){
    var w = item.w;
    cur = { w:w, an:/^[aeiou]/.test(w) ? 'an' : 'a' };
    ctx.screen({ main:'<div class="s-row">' + K.pic(w) + '</div><div class="s-sentence s-blank"><span class="s-gap">?</span> ' + U.esc(w) + '</div>'
      + '<div class="s-row s-cards">' + ['a', 'an'].map(function(x){ return '<button class="s-card s-word-card" data-act="pick" data-w="' + x + '">' + x + '</button>'; }).join('') + '</div>' });
    ctx.prompt('A or an?');
  },
  tap:function(el, act, ctx){
    if (act !== 'pick') return;
    var picked = el.getAttribute('data-w'), phrase = cur.an + ' ' + cur.w;
    LR.choice(el, picked === cur.an, ctx, {
      sel:'.s-word-card', two:true,
      right:function(){ fillGap(cur.an); return 'Yes! ' + phrase; },
      reveal:function(){ fillGap(cur.an); return 'We say ' + phrase + '.'; },
      rightEl:function(){ return U.app().querySelector('.s-word-card[data-w="' + cur.an + '"]'); }
    });
  }
};

/* ---------- One or many: she reads "cat" or "cats" and picks the picture ---------- */
LR.steps.plural = {
  render:function(item, ctx){
    var w = item.w, word = item.many ? w + 's' : w;
    cur = { word:word, many:item.many };
    ctx.screen({ main:'<div class="s-word">' + U.esc(word) + '</div><div class="s-row s-cards">'
      + U.shuffle([1, 3]).map(function(n){ return '<button class="s-card s-pic" data-act="pick" data-n="' + n + '" aria-label="' + (n === 1 ? 'one' : 'three') + '">' + K.pic(w, n) + '</button>'; }).join('') + '</div>' });
    ctx.prompt('Which picture?');
  },
  tap:function(el, act, ctx){
    if (act !== 'pick') return;
    var n = +el.getAttribute('data-n'), want = cur.many ? 3 : 1;
    LR.choice(el, n === want, ctx, {
      sel:'.s-pic', two:true,
      right:function(){ return 'Yes! ' + cur.word + '.'; },
      reveal:function(){ return cur.word + (cur.many ? ' means more than one.' : ' means just one.'); },
      rightEl:function(){ return U.app().querySelector('.s-pic[data-n="' + want + '"]'); }
    });
  }
};

/* ---------- In, on, under: she reads a sentence and picks the scene ---------- */
function scene(p){
  var ball = p === 'on' ? '<circle cx="100" cy="38" r="18" fill="#F28AA5"/>' : p === 'under' ? '<circle cx="100" cy="132" r="18" fill="#F28AA5"/>' : '<circle cx="100" cy="82" r="16" fill="#F28AA5"/>';
  var box = p === 'under' ? '<rect x="55" y="40" width="90" height="62" rx="6" fill="#C9935E" stroke="#7A5236" stroke-width="4"/>' + '<rect x="40" y="102" width="12" height="48" fill="#7A5236"/><rect x="148" y="102" width="12" height="48" fill="#7A5236"/>'
    : '<rect x="55" y="56" width="90" height="70" rx="6" fill="#C9935E" stroke="#7A5236" stroke-width="4"/>';
  /* "In": the ball is drawn inside an open box, peeking over the front. */
  if (p === 'in') box = '<rect x="55" y="56" width="90" height="70" rx="6" fill="#E3BC8C" stroke="#7A5236" stroke-width="4"/>' + ball + '<rect x="55" y="84" width="90" height="42" fill="#C9935E" stroke="#7A5236" stroke-width="4"/>';
  return '<svg class="s-scene" viewBox="0 0 200 160" aria-hidden="true"><rect x="0" y="150" width="200" height="10" fill="#9CD08A"/>' + box + (p === 'in' ? '' : ball) + '</svg>';
}
LR.steps.pos = {
  render:function(item, ctx){
    var s = LR.lang.position[item.p];
    cur = { p:item.p, s:s, help:{} };
    ctx.screen({ main:K.sentence(s) + '<div class="s-row s-cards">' + U.shuffle(['in', 'on', 'under']).map(function(p){
      return '<button class="s-card s-pic" data-act="pick" data-p="' + p + '" aria-label="' + p + '">' + scene(p) + '</button>'; }).join('') + '</div>' });
    ctx.prompt('Find the picture');
  },
  tap:function(el, act, ctx){
    if (act === 'w') { if (!ctx.locked) LR.help(el, cur.help); return; }
    if (act !== 'pick') return;
    var p = el.getAttribute('data-p');
    LR.choice(el, p === cur.p, ctx, {
      sel:'.s-pic',
      right:function(){ return 'Yes! ' + cur.s; },
      wrong:function(){ return 'Here the ball is ' + p + ' the box.'; },
      reveal:function(){ return cur.s; },
      rightEl:function(){ return U.app().querySelector('.s-pic[data-p="' + cur.p + '"]'); }
    });
  }
};

/* ---------- Capital letters: which word needs a big letter? (the first word of the sentence) ---------- */
function storyOf(id){ var f = null; LR.units.forEach(function(u){ u.stories.forEach(function(st){ if (st.id === id) f = st; }); }); return f; }
LR.steps.caps = {
  /* A sentence works if only its first word has a capital letter, and the first word is not "I". */
  ok:function(s){
    var ws = s.match(/[A-Za-z']+/g) || [];
    return ws.length >= 3 && !/["“]/.test(s) && ws[0] !== 'I' && ws.slice(1).every(function(w){ return w === w.toLowerCase(); });
  },
  render:function(item, ctx){
    var st = storyOf(item.story), s = st && st.s[item.i];
    if (!s) { ctx.done(true, false); return; }
    var low = s.charAt(0).toLowerCase() + s.slice(1);
    cur = { s:s, first:(low.match(/[A-Za-z']+/) || [''])[0] };
    ctx.screen({ main:K.sentence(low) });
    ctx.prompt('Which word needs a big letter?');
  },
  tap:function(el, act, ctx){
    if (act !== 'w' || ctx.locked) return;
    var first = U.app().querySelector('.s-sentence .w');
    LR.choice(el, el === first, ctx, {
      sel:'.s-sentence .w',
      right:function(){ first.innerHTML = LR.ui.lettersHTML(cur.first.charAt(0).toUpperCase() + cur.first.slice(1)); return 'Yes! A sentence starts with a big letter.'; },
      wrong:function(){ return 'Not that one. Try again.'; },
      reveal:function(){ first.innerHTML = LR.ui.lettersHTML(cur.first.charAt(0).toUpperCase() + cur.first.slice(1)); return 'The first word gets a big letter.'; },
      rightEl:function(){ return first; }
    });
  }
};
})();
