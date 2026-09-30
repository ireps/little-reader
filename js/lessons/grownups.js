/* Grown-ups: weekly words and story, heart letters, voice, and the words she needed help with.
   The sum question keeps a young child out. It is a child lock, not security. */
(function(){
'use strict';
var LR = window.LR, U = LR.ui, W = LR.words, S = LR.speech;
var unlocked = false;

function gate(){
  var app = U.app(), x = U.rand(40) + 21, y = U.rand(40) + 21;
  app.innerHTML = '<div class="gate"><p class="prompt">For grown-ups</p><label for="ans">What is ' + x + ' + ' + y + '?</label>'
    + '<input id="ans" type="number" inputmode="numeric" autocomplete="off">'
    + '<div class="row"><button class="btn" data-act="open">Open</button></div><p class="msg" id="msg"></p></div>';
  var inp = document.getElementById('ans');
  function check(){
    if (parseInt(inp.value, 10) === x + y) { unlocked = true; settings(); }
    else document.getElementById('msg').textContent = 'That’s not it. Try again.';
  }
  app.onclick = function(e){ var el = U.closestAct(e); if (el && el.getAttribute('data-act') === 'open') check(); };
  inp.onkeydown = function(e){ if (e.key === 'Enter' || e.keyCode === 13) check(); };
}

function settings(){
  var app = U.app(), st = LR.state;
  app.innerHTML = '<div class="gp">'
    + '<section><h2>This week’s words</h2><p class="help">From the school list. Separate them with commas or new lines.</p><textarea id="gw" rows="3" aria-label="This week’s words"></textarea></section>'
    + '<section><h2>This week’s story</h2><p class="help">Type or paste the paragraph she’s reading.</p><textarea id="gs" rows="6" aria-label="This week’s story" maxlength="' + LR.store.MAX_STORY + '"></textarea></section>'
    + '<div class="row"><button class="btn" data-act="save">Save</button> <span id="saved" class="saved"></span></div>'
    + '<section><h2>Heart letters</h2><p class="help">Tap letters that don’t sound the way they look. They get a ♥ in every lesson. Common tricky words are marked already.</p><div id="hed"></div></section>'
    + '<section><h2>Voice</h2><p class="help" id="vstatus"></p><label for="voice">Voice</label><select id="voice"></select>'
    + '<label for="rate">Speed</label><input id="rate" type="range" min="0.5" max="1.1" step="0.1">'
    + '<div class="row"><button class="btn soft" data-act="test">Test voice</button></div></section>'
    + '<section><h2>Words she needed help with</h2><p class="help">Words she tapped for help in the story or missed in Word detective. These come up more often in Word detective.</p><div id="tricky"></div></section>'
    + '</div>';
  document.getElementById('gw').value = st.words.join(', ');
  document.getElementById('gs').value = st.story;
  drawHearts(); fillVoices(); drawTricky();
  var rate = document.getElementById('rate');
  rate.value = st.rate;
  rate.onchange = function(){ var r = parseFloat(rate.value); LR.state.rate = r >= 0.5 && r <= 1.2 ? r : 0.8; LR.store.save(); };
  document.getElementById('voice').onchange = function(){ LR.state.voice = this.value; LR.store.save(); };
  S.onVoices(fillVoices);
  app.onclick = function(e){
    var el = U.closestAct(e);
    if (!el) return;
    var a = el.getAttribute('data-act');
    if (a === 'save') {
      var words = U.unique(document.getElementById('gw').value.split(/[,\n]+/).map(LR.store.cleanWord)).filter(Boolean);
      LR.state.words = words.slice(0, LR.store.MAX_WORDS);
      LR.state.story = document.getElementById('gs').value.trim().slice(0, LR.store.MAX_STORY);
      LR.store.save(); drawHearts();
      document.getElementById('saved').textContent = 'Saved';
    } else if (a === 'toggle') {
      var w = el.getAttribute('data-w'), i = parseInt(el.getAttribute('data-i'), 10);
      var arr = W.heartsFor(w).slice(), k = arr.indexOf(i);
      if (k > -1) arr.splice(k, 1); else arr.push(i);
      arr.sort(function(p, q){ return p - q; });
      LR.state.hearts[w] = arr; LR.store.save(); drawHearts();
    } else if (a === 'reset') {
      delete LR.state.hearts[el.getAttribute('data-w')]; LR.store.save(); drawHearts();
    } else if (a === 'test') {
      U.stopAll(); S.say('Come and read with me.');
    } else if (a === 'clear') {
      LR.state.tricky = {}; LR.state.confusions = {}; LR.store.save(); drawTricky();
    }
  };
}

function drawHearts(){
  var words = U.unique(LR.state.words.map(U.clean).concat(U.storyWords())).filter(Boolean);
  document.getElementById('hed').innerHTML = words.map(function(w){
    var h = W.heartsFor(w), ls = '';
    for (var i = 0; i < w.length; i++) {
      var on = h.indexOf(i) > -1;
      ls += '<button class="hl' + (on ? ' hl-on' : '') + '" data-act="toggle" data-w="' + U.esc(w) + '" data-i="' + i + '" aria-pressed="' + on + '">' + U.esc(w.charAt(i)) + '</button>';
    }
    return '<div class="hrow">' + ls + (U.has(LR.state.hearts, w) ? ' <button class="btn soft small" data-act="reset" data-w="' + U.esc(w) + '">Undo my changes</button>' : '') + '</div>';
  }).join('');
}

/* Female voices are listed first; the automatic choice already prefers one. */
function fillVoices(){
  var sel = document.getElementById('voice'), vs = document.getElementById('vstatus');
  if (!sel) return;
  if (!S.canSpeak) {
    vs.textContent = 'This browser can’t read aloud. The lessons still work, but words won’t be spoken.';
    sel.disabled = true;
    return;
  }
  var en = S.englishVoices().slice().sort(function(a, b){ return (S.isFemale(b) ? 1 : 0) - (S.isFemale(a) ? 1 : 0); });
  var auto = S.chooseVoice();
  vs.textContent = en.length
    ? 'This tablet can read aloud. Automatic picks ' + (auto ? auto.name : 'the default voice') + '.'
    : 'No English voices found yet. Tap Test voice to check.';
  sel.innerHTML = '<option value="">Automatic</option>' + en.map(function(v){
    return '<option value="' + U.esc(v.voiceURI) + '"' + (v.voiceURI === LR.state.voice ? ' selected' : '') + '>'
      + U.esc(v.name + ' (' + v.lang + ')' + (S.isFemale(v) ? ', female' : '')) + '</option>';
  }).join('');
}

/* Help-word counts, plus mix-ups from Word detective ("pots, picked plants"). */
function drawTricky(){
  var t = LR.state.tricky, c = LR.state.confusions, l = Object.keys(t).sort(function(a, b){ return t[b] - t[a]; });
  var mixes = [];
  Object.keys(c).forEach(function(k){ Object.keys(c[k]).forEach(function(p){ mixes.push({ t:k, p:p, n:c[k][p] }); }); });
  mixes.sort(function(a, b){ return b.n - a.n; });
  var html = l.length ? l.map(function(w){ return '<span class="tchip">' + U.esc(w) + ' ×' + t[w] + '</span>'; }).join('') : '<p class="help">None yet.</p>';
  if (mixes.length) html += '<p class="help">Mix-ups in Word detective (the word, then what she picked):</p>'
    + mixes.slice(0, 20).map(function(m){ return '<span class="mix">' + U.esc(m.t) + ', picked ' + U.esc(m.p) + ' ×' + m.n + '</span>'; }).join('');
  if (l.length || mixes.length) html += '<div class="row"><button class="btn soft small" data-act="clear">Clear list</button></div>';
  document.getElementById('tricky').innerHTML = html;
}

LR.routes.grownups = function(){ U.setTitle('Grown-ups'); if (unlocked) settings(); else gate(); };
})();
