/* Grown-ups: her progress, where she is in the course, single games, voice speed, backup, restore and reset.
   Reached by a 2 s hold on Home, then a sum on a tap-only number pad. It is a child lock, not security. Nothing is typed. */
(function(){
'use strict';
var LR = window.LR, U = LR.ui, P = LR.progress, S = LR.speech;
var unlocked = false, MAX_BACKUP = 1024 * 1024;

/* ---------- The gate ---------- */
function gate(){
  /* Two single digits that add up to 11 to 18. */
  var a = 2 + U.rand(8), lo = Math.max(2, 11 - a), b = lo + U.rand(10 - lo), typed = '';
  var app = U.app(), keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Clear', '0', 'OK'];
  app.innerHTML = '<div class="gate"><p class="prompt">What is ' + a + ' + ' + b + '?</p><div class="pad-show" id="pad-show" aria-live="polite"></div>'
    + '<div class="pad">' + keys.map(function(k){ return '<button class="btn soft" data-act="key" data-k="' + k + '">' + k + '</button>'; }).join('') + '</div>'
    + '<p class="msg" id="msg"></p></div>';
  app.onclick = function(e){
    var el = U.closestAct(e);
    if (!el) return;
    var k = el.getAttribute('data-k');
    if (k === 'Clear') typed = '';
    else if (k === 'OK') {
      if (+typed === a + b) { unlocked = true; settings(); return; }
      document.getElementById('msg').textContent = 'That’s not it. Try this one.';
      var msg = document.getElementById('msg').textContent;
      gate(); document.getElementById('msg').textContent = msg; return;
    } else if (typed.length < 2) typed += k;
    document.getElementById('pad-show').textContent = typed;
  };
}

/* ---------- Settings ---------- */
function progressHTML(){
  var st = LR.state, u = P.unit(), ui = LR.units.indexOf(u) + 1, it = st.items;
  var watch = Object.keys(it).filter(function(id){ return it[id].m > 0; }).sort(function(a, b){ return it[b].m - it[a].m; }).slice(0, 8);
  var mixes = [];
  Object.keys(st.confusions).forEach(function(k){ Object.keys(st.confusions[k]).forEach(function(p){ mixes.push({ t:k, p:p, n:st.confusions[k][p] }); }); });
  mixes.sort(function(a, b){ return b.n - a.n; });
  var days = st.days.slice(-7), n = 0, r = 0, bars = '';
  days.forEach(function(d, i){
    n += d.n; r += d.r;
    var h = Math.min(60, d.mins * 5);
    bars += '<rect x="' + (i * 44 + 6) + '" y="' + (66 - h) + '" width="30" height="' + Math.max(2, h) + '" rx="5" fill="#8FC7A0"/>'
      + '<text x="' + (i * 44 + 21) + '" y="84" text-anchor="middle" font-size="12" fill="#4A6272">' + U.esc(d.d.slice(5)) + '</text>';
  });
  return '<section><h2>Progress</h2>'
    + (LR.store.failed() ? '<p class="msg">Storage is full, so progress isn’t being saved. Save a backup, then Reset.</p>' : '')
    + '<p>Unit ' + ui + ' of ' + LR.units.length + ': ' + U.esc(u.title) + '. ' + st.flowers.length + ' flower' + (st.flowers.length === 1 ? '' : 's') + ' (words mastered).</p>'
    + '<p class="help">Words to watch (most misses first): ' + (watch.length ? watch.map(function(id){ return '<span class="tchip">' + U.esc(id.slice(2)) + ' ×' + it[id].m + '</span>'; }).join('') : 'none yet.') + '</p>'
    + (mixes.length ? '<p class="help">Mix-ups (the word, then what she picked): ' + mixes.slice(0, 8).map(function(m){ return '<span class="mix">' + U.esc(m.t) + ', picked ' + U.esc(m.p) + ' ×' + m.n + '</span>'; }).join('') + '</p>' : '')
    + (days.length ? '<p class="help">Last ' + days.length + ' day' + (days.length === 1 ? '' : 's') + ': minutes each day, and first-try accuracy ' + (n ? Math.round(100 * r / n) + '%' : 'not yet measured') + '.</p>'
      + '<svg viewBox="0 0 310 90" class="gp-bars" role="img" aria-label="Minutes per day">' + bars + '</svg>' : '<p class="help">No sessions yet.</p>')
    + '</section>';
}
function settings(){
  var app = U.app(), st = LR.state;
  app.innerHTML = '<div class="gp">' + progressHTML()
    + '<section><h2>Where is she?</h2><p class="help">Tap a unit to start there next time. The app moves on by itself when a unit is mastered.</p>'
    + LR.units.map(function(u, i){ return '<button class="btn soft small unit' + (u.id === st.unit ? ' on' : '') + '" data-act="unit" data-u="' + U.esc(u.id) + '" aria-pressed="' + (u.id === st.unit) + '">'
      + (i + 1) + '. ' + U.esc(u.title) + '</button>'; }).join('') + '</section>'
    + '<section><h2>Practise one game</h2><p class="help">Opens one activity on its own. It still counts towards her progress.</p>'
    + [['words', 'Find it'], ['tricky', 'Tricky word'], ['read', 'Read with me'], ['maths', 'Crocodile']].map(function(g){
      return '<a class="btn soft small" href="#practice-' + g[0] + '">' + g[1] + '</a>'; }).join('') + '</section>'
    + '<section><h2>Voice</h2><p class="help" id="vstatus"></p><label for="rate">Speed</label><input id="rate" type="range" min="0.75" max="1.1" step="0.05">'
    + '<div class="row"><button class="btn soft small" data-act="test">Test voice</button></div></section>'
    + '<section><h2>Backup</h2><p class="help">Everything is saved in this tablet’s browser only. A backup keeps it safe if Silk’s data is cleared.</p>'
    + '<button class="btn soft small" data-act="backup">Save a backup</button>'
    + '<label class="btn soft small file">Restore from a backup<input type="file" id="restore" accept=".json,application/json"></label>'
    + '<button class="btn soft small" data-act="reset">Reset everything</button><p class="msg" id="bmsg"></p></section>'
    + '</div>';
  var rate = document.getElementById('rate');
  rate.value = st.rate;
  rate.onchange = function(){ var r = parseFloat(rate.value); LR.state.rate = r >= 0.75 && r <= 1.1 ? r : 0.9; LR.store.save(); };
  document.getElementById('vstatus').textContent = S.canSpeak ? 'Speech uses this tablet’s voice. Everything said also shows as a caption until the voice clips arrive.' : 'This browser can’t read aloud. Captions still show what would be said.';
  document.getElementById('restore').onchange = function(){ if (this.files && this.files[0]) restore(this.files[0]); this.value = ''; };
  app.onclick = function(e){
    var el = U.closestAct(e);
    if (!el) return;
    var a = el.getAttribute('data-act');
    if (a === 'unit') {
      LR.state.unit = el.getAttribute('data-u');
      /* An unfinished plan for today is dropped, so the next session starts from the chosen unit. */
      if (LR.state.resume && !LR.state.resume.done) LR.state.resume = null;
      LR.store.save(); settings();
    }
    else if (a === 'test') { U.stopAll(); S.say('Come and read with me.'); }
    else if (a === 'backup') backup();
    else if (a === 'reset') confirmReset();
  };
}

/* ---------- Backup, restore, reset ---------- */
function backup(){
  var d = P.localDate(), data = { app:'little-reader', schema:LR.store.SCHEMA, saved:d, state:LR.state };
  var blob = new Blob([JSON.stringify(data)], { type:'application/json' }), a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = d + '.littlereader.json';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function(){ URL.revokeObjectURL(a.href); }, 1000);
  document.getElementById('bmsg').textContent = 'Backup saved to Downloads.';
}
/* Checks a backup file; returns { state, saved } or { error }. */
function checkBackup(text, size){
  if (size > MAX_BACKUP) return { error:'That file is too big to be a Little Reader backup.' };
  var data;
  try { data = JSON.parse(text); } catch(e) { return { error:'That file isn’t a Little Reader backup.' }; }
  if (!data || typeof data !== 'object' || data.app !== 'little-reader' || !data.state || typeof data.state !== 'object') return { error:'That file isn’t a Little Reader backup.' };
  if (typeof data.schema !== 'number' || data.schema > LR.store.SCHEMA) return { error:'That backup is from a newer version of Little Reader. Reload the app and try again.' };
  var st = LR.store.isOld(data.state) ? LR.store.migrate(data.state, P.localDate()) : LR.store.validate(data.state);
  return { state:st, saved:typeof data.saved === 'string' ? data.saved.slice(0, 10) : '' };
}
function restore(file){
  var reader = new FileReader();
  reader.onload = function(){
    var r = checkBackup(String(reader.result), file.size);
    if (r.error) { document.getElementById('bmsg').textContent = r.error; return; }
    confirmScreen('Replace everything on this tablet with the backup' + (r.saved ? ' from ' + r.saved : '') + '? ' + r.state.flowers.length + ' flowers, unit ' + (LR.units.indexOf(LR.progress.unitById(r.state.unit)) + 1) + '.',
      'Replace', function(){ LR.state = r.state; LR.store.save(); settings(); document.getElementById('bmsg').textContent = 'Restored.'; });
  };
  reader.onerror = function(){ document.getElementById('bmsg').textContent = 'That file couldn’t be read.'; };
  if (file.size > MAX_BACKUP) { document.getElementById('bmsg').textContent = 'That file is too big to be a Little Reader backup.'; return; }
  reader.readAsText(file);
}
function confirmReset(){
  confirmScreen('Reset everything? Her progress, garden and mix-ups are deleted from this tablet, and she starts again at unit 1. Save a backup first if you might want them.',
    'Yes, reset', function(){ LR.store.reset(); settings(); document.getElementById('bmsg').textContent = 'Everything was reset.'; });
}
/* A second screen for anything that replaces or deletes her data. */
function confirmScreen(text, yes, fn){
  var app = U.app();
  app.innerHTML = '<div class="gp"><section class="confirm"><p id="ctext"></p><div class="row"><button class="btn small" data-act="yes"></button> <button class="btn soft small" data-act="no">Cancel</button></div></section></div>';
  document.getElementById('ctext').textContent = text;
  app.querySelector('[data-act=yes]').textContent = yes;
  app.onclick = function(e){
    var el = U.closestAct(e);
    if (!el) return;
    if (el.getAttribute('data-act') === 'yes') fn(); else settings();
  };
}

LR.grownups = { checkBackup:checkBackup };
LR.routes.grownups = function(){ U.setTitle('Grown-ups'); if (unlocked) settings(); else gate(); };
})();
