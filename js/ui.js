/* Shared UI: helpers, the letter/heart rendering, the finger sweep, the router and the home screen. */
(function(){
'use strict';
var LR = window.LR = window.LR || {};
LR.routes = LR.routes || {};
var app = null, bar = null, barTitle = null;
var ui = LR.ui = { gen: 0 };

/* ---------- Helpers ---------- */
ui.esc = function(s){
  return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; });
};
ui.clean = function(w){ return String(w).toLowerCase().replace(/[^a-z']/g, ''); };
ui.unique = function(arr){ var seen = {}, out = []; arr.forEach(function(x){ if (x && !seen[x]) { seen[x] = 1; out.push(x); } }); return out; };
ui.rand = function(n){ return Math.floor(Math.random() * n); };
ui.shuffle = function(a){ for (var i = a.length - 1; i > 0; i--) { var j = ui.rand(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
ui.has = function(o, k){ return Object.prototype.hasOwnProperty.call(o, k); };
ui.app = function(){ return app; };
ui.closestAct = function(e){ return e.target && e.target.closest ? e.target.closest('[data-act]') : null; };

/* Every parent-entered string reaches the page through esc() here. */
ui.lettersHTML = function(word, plain){
  var h = plain ? [] : LR.words.heartsFor(word), out = '';
  for (var i = 0; i < word.length; i++) out += '<span class="l' + (h.indexOf(i) > -1 ? ' h' : '') + '">' + ui.esc(word.charAt(i)) + '</span>';
  return out;
};
ui.storyWords = function(){ return ui.unique((LR.state.story.match(/[A-Za-z']+/g) || []).map(ui.clean)).filter(Boolean); };
ui.sentences = function(){
  var t = LR.state.story.replace(/\s+/g, ' ').trim();
  return (t.match(/[^.!?]+[.!?]*/g) || []).map(function(s){ return s.trim(); }).filter(Boolean)
    .map(function(s){ return s.charAt(0).toUpperCase() + s.slice(1); });
};
ui.dotsHTML = function(total, current){
  var s = '<div class="dots" aria-label="' + Math.min(current + 1, total) + ' of ' + total + '">';
  for (var i = 0; i < total; i++) s += '<span class="dot' + (i < current ? ' on' : (i === current ? ' now' : '')) + '"></span>';
  return s + '</div>';
};
ui.bumpTricky = function(w, d){
  var t = LR.state.tricky, n = (t[w] || 0) + d;
  if (n > 0) t[w] = n; else delete t[w];
  LR.store.save();
};
ui.noWords = function(){
  app.innerHTML = '<p class="prompt">No words yet.</p><p class="tip">Ask a grown-up to add this week’s words.</p>';
  app.onclick = null;
};
ui.setTitle = function(t){ barTitle.textContent = t; document.title = t + ' – Little Reader'; };

/* ---------- Speech + highlight choreography ---------- */
/* gen changes whenever something new starts, so old speech/animation chains stop. */
ui.stopAll = function(){
  ui.gen++;
  LR.speech.cancel();
  if (app) Array.prototype.forEach.call(app.querySelectorAll('.lit,.say'), function(x){ x.classList.remove('lit'); x.classList.remove('say'); });
  /* Also clears the placeholder caption (speech.cancel). */
};
/* Light each letter left to right, like a finger under the word, one every stepMs. */
ui.lightLetters = function(el, stepMs, cb){
  var ls = el.querySelectorAll('.l'), g = ui.gen, i = 0;
  function next(){
    if (g !== ui.gen) return;
    if (i > 0) ls[i - 1].classList.remove('lit');
    if (i >= ls.length) { if (cb) cb(); return; }
    ls[i].classList.add('lit'); i++;
    setTimeout(next, stepMs);
  }
  next();
};
/* Spread a sweep over the time the word takes to say, within sensible limits. */
function stepFor(ms, n){ return Math.max(80, Math.min(220, Math.round(ms / Math.max(1, n)))); }

/* Speech first; the letters light while the word is spoken, never before. */
ui.sayWord = function(el, word){
  ui.stopAll();
  var g = ui.gen, n = el.querySelectorAll('.l').length;
  el.classList.add('say');
  return LR.speech.say(word, { onStart:function(ms){ if (g === ui.gen) ui.lightLetters(el, stepFor(ms, n)); } })
    .then(function(){ el.classList.remove('say'); });
};
/* Say, spell, say: three utterances. The letters light one by one while their names are spoken. */
ui.saySpellSay = function(el, word){
  ui.stopAll();
  var g = ui.gen, ls = el.querySelectorAll('.l');
  var names = word.toLowerCase().split('').map(function(ch){ return LR.words.LETTER_NAMES[ch] || ch; });
  function light(i){
    Array.prototype.forEach.call(ls, function(l, k){ l.classList.toggle('lit', k === i); });
  }
  el.classList.add('say');
  return LR.speech.say(word).then(function(){
    if (g !== ui.gen) return;
    el.classList.remove('say');
    return LR.speech.say(names.join(', '), { rate:0.9, parts:names, onWord:function(i){ if (g === ui.gen) light(i); } });
  }).then(function(){
    if (g !== ui.gen) return;
    light(-1);
    el.classList.add('say');
    return LR.speech.say(word);
  }).then(function(){ el.classList.remove('say'); });
};

/* ---------- Instant feedback: a colour state and a soft tone, before any speech ---------- */
var actx = null;
function audioCtx(){
  if (actx) return actx;
  var C = window.AudioContext || window.webkitAudioContext;
  if (!C) return null;
  try { actx = new C(); } catch(e) { actx = null; }
  return actx;
}
function tone(freqs, len, gain){
  var c = audioCtx();
  if (!c) return;
  try {
    if (c.state === 'suspended' && c.resume) c.resume();
    var t = c.currentTime;
    freqs.forEach(function(f, i){
      var o = c.createOscillator(), v = c.createGain(), at = t + i * len;
      o.type = 'sine'; o.frequency.value = f;
      v.gain.setValueAtTime(0.0001, at);
      v.gain.exponentialRampToValueAtTime(gain, at + 0.01);
      v.gain.exponentialRampToValueAtTime(0.0001, at + len);
      o.connect(v); v.connect(c.destination);
      o.start(at); o.stop(at + len + 0.02);
    });
  } catch(e) {}
}
/* Right: green with a check and two high notes. Wrong: dimmed with a dot and one low, quiet note. No red, no cross. */
ui.feedback = function(el, kind){
  var right = kind === 'right';
  el.classList.remove('fb-right', 'fb-wrong');
  el.classList.add(right ? 'fb-right' : 'fb-wrong');
  var old = el.querySelector('.fb-mark');
  if (old) old.parentNode.removeChild(old);
  var m = document.createElement('span');
  m.className = 'fb-mark';
  m.innerHTML = LR.icons.get(right ? 'check' : 'dot');
  el.appendChild(m);
  if (right) tone([1047, 1319], 0.08, 0.12); else tone([220], 0.11, 0.06);
};
function wake(){ var c = audioCtx(); if (c && c.state === 'suspended' && c.resume) try { c.resume(); } catch(e) {} }
document.addEventListener('pointerdown', wake, true);

/* ---------- Router ---------- */
ui.route = function(){
  ui.stopAll();
  LR.speech.onVoices(null);
  var r = (location.hash || '#home').replace('#', '');
  if (!ui.has(LR.routes, r)) r = 'home';
  bar.style.display = r === 'home' ? 'none' : 'flex';
  LR.routes[r]();
  window.scrollTo(0, 0);
};
ui.start = function(){
  app = document.getElementById('app');
  bar = document.getElementById('bar');
  barTitle = document.getElementById('bar-title');
  var hb = bar.querySelector('.home-btn');
  if (hb) hb.innerHTML = LR.icons.get('home');
  window.addEventListener('hashchange', ui.route);
  ui.route();
};

/* ---------- Home ---------- */
function tile(r, icon, label, cls){
  return '<a class="tile ' + cls + '" href="#' + r + '"><span class="tile-ic">' + LR.icons.get(icon) + '</span><span>' + label + '</span></a>';
}
LR.routes.home = function(){
  document.title = 'Little Reader';
  app.innerHTML = '<div class="home"><h1 class="title">Little Reader ' + LR.icons.get('sprout') + '</h1><div class="tiles">'
    + tile('detective', 'search', 'Word detective', 't-sun')
    + tile('hearts', 'heart', 'Heart words', 't-berry')
    + tile('story', 'book', 'Read the story', 't-mint')
    + tile('croc', 'croc', 'Hungry crocodile', 't-leaf')
    + '</div><a class="grown" href="#grownups">Grown-ups</a></div>';
  app.onclick = null;
};
})();
