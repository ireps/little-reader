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

/* Clip hook: LR.clips = { 'come': 'come.mp3', ... } from audio/manifest.js (Phase 7). */
function clipFor(text){
  var m = LR.clips, k = String(text).toLowerCase().replace(/[^a-z' ]/g, '').trim();
  return m && has(m, k) ? 'audio/words/' + m[k] : null;
}

/* ---------- Captions (placeholder for the voice) ---------- */
function caption(text){
  var el = document.getElementById('caption');
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
    var re = /[A-Za-z']+/g, m;
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
    /* Called once, when sound starts (or should have). Runs the estimated schedule unless boundaries arrive. */
    function begin(){
      if (started || done) return;
      started = Date.now();
      if (opts.onStart) opts.onStart(est);
      if (!opts.onWord) return;
      fire(0);
      if (hasBoundary) return;
      var per = msPerChar(rate);
      offs.forEach(function(o, i){
        if (!i) return;
        later(function(){ fire(i); }, Math.round(o * per + pausesIn(text.slice(0, o)) * PAUSE_MS));
      });
    }
    me = current = { fin:function(){ fin(false); } };
    caption(typeof opts.caption === 'string' ? opts.caption : text);

    if (!unlocked) { begin(); later(function(){ fin(false); }, est); return; }

    var clip = clipFor(text);
    if (clip) {
      try {
        var a = new Audio(clip);
        currentAudio = a;
        a.onplaying = begin;
        a.onended = function(){ currentAudio = null; fin(false); };
        a.onerror = function(){ currentAudio = null; fin(false); };
        var pr = a.play(); if (pr && pr.catch) pr.catch(function(){ fin(false); });
      } catch(e) { fin(false); }
      later(function(){ fin(false); }, 8000);
      return;
    }
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

LR.speech = {
  canSpeak: canSpeak,
  hasBoundary: false,
  say: say,
  cancel: cancel,
  estimate: estimate,
  isUnlocked: function(){ return unlocked; },
  englishVoices: englishVoices,
  chooseVoice: chooseVoice,
  isFemale: isFemale,
  onVoices: function(fn){ voicesHook = fn || null; }
};
})();
