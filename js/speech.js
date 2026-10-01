/* All sound goes through LR.speech.say(). A clip is used if one exists (LR.clips), else the tablet's voice.
   Until voice clips arrive (Phase 7), everything said also shows as a caption in the top bar. */
(function(){
'use strict';
var LR = window.LR = window.LR || {};

var synth = window.speechSynthesis || null;
var canSpeak = !!(synth && window.SpeechSynthesisUtterance);
var voices = [], voicesHook = null, lastCancel = 0, currentUtter = null, currentAudio = null;
var current = null;      /* the say() in progress: { fin, timers } */
var unlocked = false;    /* no speech before the first touch */
var hasBoundary = false; /* true once this engine has sent a word boundary event */
/* Calibration: ms per character at rate 1, a moving average of the last 10 utterances. Memory only. */
var MS_PER_CHAR = 75, PAUSE_MS = 250, samples = [];
/* Silence the clip importer leaves at the end of each clip (tools/import-clips.js TAIL). */
var CLIP_TAIL = 200;

/* Voices don't report gender, so this guesses from the name. Grown-ups can always pick another. */
var FEMALE = /raveena|aditi|kajal|heera|veena|lekha|isha|neerja|swara|salli|joanna|kendra|kimberly|ivy|amy|emma|nicole|olivia|samantha|karen|moira|tessa|fiona|victoria|zira|hazel|susan|serena|kate|catherine|allison|ava|libby|sonia|natasha/i;
function isFemale(v){
  var n = (v && v.name) || '';
  if (/\bfemale\b/i.test(n)) return true;
  if (/\bmale\b/i.test(n)) return false;
  return FEMALE.test(n);
}

function has(o, k){ return Object.prototype.hasOwnProperty.call(o, k); }
function loadVoices(){
  if (!canSpeak) return;
  try { voices = synth.getVoices() || []; } catch(e) { voices = []; }
  if (voicesHook) voicesHook();
}
if (canSpeak) { loadVoices(); try { synth.onvoiceschanged = loadVoices; } catch(e) {} }

function langOf(v){ return String(v.lang || '').replace('_', '-').toLowerCase(); }
function englishVoices(){ return voices.filter(function(v){ return /^en/i.test(v.lang || ''); }); }

/* Saved choice, then a female voice (Indian, British, any English), then any English voice. */
function chooseVoice(){
  var en = englishVoices(), i, p, pref = ['en-in', 'en-gb', 'en-us'];
  if (!en.length) return null;
  if (LR.state && LR.state.voice) for (i = 0; i < en.length; i++) if (en[i].voiceURI === LR.state.voice) return en[i];
  for (p = 0; p < pref.length; p++) for (i = 0; i < en.length; i++) if (langOf(en[i]) === pref[p] && isFemale(en[i])) return en[i];
  for (i = 0; i < en.length; i++) if (isFemale(en[i])) return en[i];
  for (p = 0; p < pref.length; p++) for (i = 0; i < en.length; i++) if (langOf(en[i]) === pref[p]) return en[i];
  return en[0];
}

/* ---------- Voice clips (Phase 7) ----------
   audio/manifest.js sets LR.clips = { key: { f: file, d: length in ms, t: [start ms of each word] } }.
   A key is the text in lower case, without punctuation. */
var CLIP_DIR = 'audio/clips/', cache = {}, cacheOrder = [], CACHE_MAX = 40;
function keyOf(s){
  return String(s).toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
}
function clipsOn(){ return !!LR.clips && (!LR.state || LR.state.clips !== false); }
function hasClip(k){ return !!LR.clips && has(LR.clips, k); }
/* Turns text into a list of clip keys: the whole text if there is a clip for it, else clause by clause, each made
   of the longest known phrases ("That says cone." -> "that says" + "cone"). Returns null if anything is missing. */
function resolveClips(text, hasKey){
  hasKey = hasKey || hasClip;
  var whole = keyOf(text);
  if (!whole) return [];
  if (hasKey(whole)) return [whole];
  var out = [], clauses = String(text).split(/[.!?,;:"\u201C\u201D]+/);
  for (var c = 0; c < clauses.length; c++) {
    var k = keyOf(clauses[c]);
    if (!k) continue;
    if (hasKey(k)) { out.push(k); continue; }
    var w = k.split(' '), i = 0;
    while (i < w.length) {
      var found = 0;
      for (var j = Math.min(w.length, i + 8); j > i; j--) if (hasKey(w.slice(i, j).join(' '))) { found = j; break; }
      if (!found) return null;
      out.push(w.slice(i, found).join(' '));
      i = found;
    }
  }
  return out;
}
/* Audio elements, kept for the clips used most recently, so they start at once. */
function audioFor(k){
  var url = CLIP_DIR + LR.clips[k].f;
  if (cache[url]) { cacheOrder.splice(cacheOrder.indexOf(url), 1); cacheOrder.push(url); return cache[url]; }
  var a = new Audio(url);
  a.preload = 'auto';
  cache[url] = a; cacheOrder.push(url);
  while (cacheOrder.length > CACHE_MAX) { var old = cacheOrder.shift(); if (cache[old] !== currentAudio) delete cache[old]; }
  return a;
}
/* Starts loading the clips for some text that is about to be said. */
function preload(text){
  if (!clipsOn()) return;
  var seq = resolveClips(text);
  if (seq) seq.forEach(function(k){ try { audioFor(k); } catch(e) {} });
}

/* ---------- Captions (placeholder for the voice) ---------- */
function caption(text){
  /* On session screens the guide's speech bubble is the caption; elsewhere, the top bar. */
  var el = document.querySelector('#app [data-caption]') || document.getElementById('caption');
  if (el) el.textContent = text || '';
}

/* ---------- Timing ---------- */
function rateOf(r){ return r || (LR.state && LR.state.rate) || 0.8; }
function msPerChar(rate){ return MS_PER_CHAR / rateOf(rate); }
function pausesIn(s){ return (String(s).match(/[.,!?;:]/g) || []).length; }
/* Estimated speaking time in ms, from this tablet's measured speed. */
function estimate(text, rate){
  var t = String(text);
  return Math.round(t.length * msPerChar(rate) + pausesIn(t) * PAUSE_MS);
}
function calibrate(text, ms, rate){
  var t = String(text).trim();
  if (t.length < 3 || ms <= 0) return;
  var per = (ms - pausesIn(t) * PAUSE_MS) * rateOf(rate) / t.length;
  per = Math.max(30, Math.min(200, per));
  samples.push(per);
  if (samples.length > 10) samples.shift();
  MS_PER_CHAR = samples.reduce(function(a, b){ return a + b; }, 0) / samples.length;
}
/* Where each part (by default, each word) starts in the text. */
function partOffsets(text, parts){
  var out = [], from = 0;
  if (!parts) {
    var re = /[A-Za-z0-9']+/g, m;
    while ((m = re.exec(text))) out.push(m.index);
    return out;
  }
  parts.forEach(function(p){
    var i = text.indexOf(p, from);
    if (i < 0) i = from;
    out.push(i);
    from = i + p.length;
  });
  return out;
}

/* ---------- Stop ---------- */
function cancel(){
  if (current) current.fin();
  if (currentAudio) { try { currentAudio.pause(); } catch(e) {} currentAudio = null; }
  if (canSpeak) {
    var busy = false;
    try { busy = synth.speaking || synth.pending; } catch(e) {}
    if (busy) { try { synth.cancel(); } catch(e) {} lastCancel = Date.now(); }
  }
  caption('');
}

/* Speaks text. Resolves when speaking ends, fails, is stopped or times out, so callers never get stuck.
   opts.parts: the pieces to report through opts.onWord (default: the words).
   opts.onStart(ms): called when speech starts, with the estimated length in ms.
   opts.onWord(i): called as part i starts, from boundary events or the estimate.
   opts.caption: text to show instead of the spoken text, when showing it would give the answer away. */
function say(text, opts){
  if (typeof opts === 'number') opts = { rate:opts };
  opts = opts || {};
  text = String(text);
  if (current) current.fin();
  var rate = rateOf(opts.rate);
  return new Promise(function(resolve){
    var done = false, timers = [], started = 0, fired = -1, me;
    var est = estimate(text, rate), offs = partOffsets(text, opts.parts);
    function later(fn, ms){ timers.push(setTimeout(fn, ms)); }
    function clear(){ timers.forEach(clearTimeout); timers = []; }
    function fin(ok){
      if (done) return;
      done = true; clear();
      if (ok && started && !currentAudio) calibrate(text, Date.now() - started, rate);
      if (current === me) { current = null; caption(''); }
      resolve();
    }
    function fire(i){
      if (i <= fired || i >= offs.length) return;
      fired = i;
      if (opts.onWord) opts.onWord(i);
    }
    /* Called once, when sound starts (or should have). Runs the estimated schedule unless boundaries arrive.
       Clips pass their own voice length (ms) and light their words themselves. */
    function begin(ms){
      if (started || done) return;
      started = Date.now();
      var clip = typeof ms === 'number';
      if (opts.onStart) opts.onStart(clip ? ms : est);
      if (!opts.onWord) return;
      fire(0);
      if (hasBoundary || clip) return;
      var per = msPerChar(rate);
      offs.forEach(function(o, i){
        if (!i) return;
        later(function(){ fire(i); }, Math.round(o * per + pausesIn(text.slice(0, o)) * PAUSE_MS));
      });
    }
    me = current = { fin:function(){ fin(false); } };
    var seq = clipsOn() ? resolveClips(text) : null;
    /* Captions stand in for the voice: shown with the tablet voice, and with clips only if Grown-ups keeps them on. */
    var cap = typeof opts.caption === 'string' ? opts.caption : text;
    caption(!seq || (LR.state && LR.state.captions) ? cap : '');

    if (!unlocked) { begin(); later(function(){ fin(false); }, est); return; }
    if (seq && seq.length) { playClips(seq); return; }
    tts();

    /* Plays clips one after another (the next starts on the last one's "ended"). Words light when the clip's own
       clock (currentTime) reaches their recorded times, so highlights stay with the voice through a slow start, a
       stall or a changed speed. Sound starts (begin) when the first word is heard, not when the file starts. */
    function playClips(keys){
      var partStart = null, w = 0, k = 0;
      if (opts.parts) { partStart = []; var n = 0; opts.parts.forEach(function(p){ partStart.push(n); n += Math.max(1, keyOf(p).split(' ').length); }); }
      function wordAt(gw){ if (!partStart) return gw; var i = partStart.indexOf(gw); return i; }
      var playbackRate = Math.max(0.75, Math.min(1.2, rate / 0.9));
      function timesOf(key){ var info = LR.clips[key], words = key.split(' ').length, dur = info.d || 1500;
        if (info.t && info.t.length === words) return info.t;
        var t = []; for (var i = 0; i < words; i++) t.push(Math.round(dur * i / words)); return t; }
      /* How long the voice lasts, first word to last sound, for sweeps paced by onStart. */
      var spokenMs = Math.round(Math.max(200, keys.reduce(function(s, key){ return s + (LR.clips[key].d || 1500); }, 0)
        - timesOf(keys[0])[0] - CLIP_TAIL) / playbackRate);
      var tick = window.requestAnimationFrame ? function(fn){ window.requestAnimationFrame(fn); } : function(fn){ setTimeout(fn, 16); };
      function next(){
        if (done) return;
        if (k >= keys.length) { currentAudio = null; fin(false); return; }
        var key = keys[k++], info = LR.clips[key], words = key.split(' ').length, a;
        try { a = audioFor(key); } catch(e) { fallback(); return; }
        currentAudio = a;
        try { a.currentTime = 0; a.playbackRate = playbackRate; } catch(e) {}
        var base = w, times = timesOf(key), dur = info.d || 1500, idx = 0, watching = false;
        w += words;
        /* Light every word whose time has come (all of them when the clip has ended). */
        function catchUp(all){
          var now = all ? Infinity : (a.currentTime || 0) * 1000;
          if (!started && now >= times[0]) begin(spokenMs);
          while (started && idx < words && now >= times[idx]) { var p = wordAt(base + idx); if (p > -1) fire(p); idx++; }
        }
        function watch(){
          if (done || currentAudio !== a) { watching = false; return; }
          catchUp(false);
          if (idx < words) tick(watch); else watching = false;
        }
        a.onplaying = function(){ if (!watching) { watching = true; watch(); } };
        a.onended = function(){ if (currentAudio === a) { catchUp(true); next(); } };
        a.onerror = function(){ if (currentAudio === a) fallback(); };
        later(function(){ if (currentAudio === a) next(); }, Math.round(dur / playbackRate) + 1000);
        try { var pr = a.play(); if (pr && pr.catch) pr.catch(function(){ if (currentAudio === a) fallback(); }); } catch(e) { fallback(); }
      }
      next();
    }
    /* A clip failed: say the whole text with the tablet voice instead, and show the caption. */
    function fallback(){
      if (currentAudio) { try { currentAudio.pause(); } catch(e) {} currentAudio = null; }
      clear(); fired = -1;
      caption(cap);
      tts();
    }

    function tts(){
    if (!canSpeak) { begin(); later(function(){ fin(false); }, est); return; }

    var busy = false;
    try { busy = synth.speaking || synth.pending; } catch(e) {}
    if (busy) { try { synth.cancel(); } catch(e) {} lastCancel = Date.now(); }
    var wait = busy ? Math.max(0, 80 - (Date.now() - lastCancel)) : 0;
    function speak(){
      if (done) return;
      try {
        if (!voices.length) loadVoices();
        var u = new SpeechSynthesisUtterance(text);
        var v = chooseVoice();
        if (v) { u.voice = v; u.lang = v.lang; }
        u.rate = rate;
        u.onstart = begin;
        u.onend = function(){ fin(true); };
        u.onerror = function(){ fin(false); };
        u.onboundary = function(e){
          if (e && e.name && e.name !== 'word') return;
          if (!hasBoundary) { hasBoundary = true; LR.speech.hasBoundary = true; }
          clear();
          begin();
          var ci = e ? e.charIndex : 0, k = 0;
          for (var i = 0; i < offs.length; i++) if (offs[i] <= ci) k = i;
          fire(k);
        };
        currentUtter = u; /* keep a reference so the browser doesn't drop onend */
        synth.speak(u);
      } catch(e) { fin(false); return; }
      /* If the engine never says it started, start the highlights anyway. */
      later(begin, 300);
      /* Watchdog: start-up allowance + estimated length + 1 s. */
      later(function(){ fin(false); }, 600 + est + 1000);
    }
    if (wait) later(speak, wait); else speak();
    }
  });
}

/* First touch: allow speech and load the speech engine with a silent utterance. */
function unlock(){
  if (unlocked) return;
  unlocked = true;
  if (!canSpeak) return;
  try { var u = new SpeechSynthesisUtterance(' '); u.volume = 0; synth.speak(u); } catch(e) {}
}
document.addEventListener('pointerdown', unlock, true);
document.addEventListener('touchstart', unlock, true);
document.addEventListener('keydown', unlock, true);

/* How long the voice takes to say text: from its clip when there is one (first word to last sound), else the estimate. */
function voiceMs(text, rate){
  var k = keyOf(text), c = clipsOn() && hasClip(k) ? LR.clips[k] : null;
  if (!c) return estimate(text, rate);
  var t0 = c.t && c.t.length ? c.t[0] : 0;
  return Math.round(Math.max(200, (c.d || 1500) - t0 - CLIP_TAIL) / Math.max(0.75, Math.min(1.2, rateOf(rate) / 0.9)));
}

LR.speech = {
  canSpeak: canSpeak,
  hasBoundary: false,
  say: say,
  cancel: cancel,
  estimate: estimate,
  voiceMs: voiceMs,
  resolve: resolveClips,
  keyOf: keyOf,
  preload: preload,
  isUnlocked: function(){ return unlocked; },
  englishVoices: englishVoices,
  chooseVoice: chooseVoice,
  isFemale: isFemale,
  onVoices: function(fn){ voicesHook = fn || null; }
};
})();
