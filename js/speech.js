/* All sound goes through LR.speech.say(). A clip is used if one exists (LR.clips), else the tablet's voice. */
(function(){
'use strict';
var LR = window.LR = window.LR || {};

var synth = window.speechSynthesis || null;
var canSpeak = !!(synth && window.SpeechSynthesisUtterance);
var voices = [], voicesHook = null, lastCancel = 0, currentUtter = null, currentAudio = null;

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

/* Clip hook: LR.clips = { 'come': 'come.mp3', ... } from audio/manifest.js, only if ever needed. */
function clipFor(text){
  var m = LR.clips, k = String(text).toLowerCase().replace(/[^a-z' ]/g, '').trim();
  return m && has(m, k) ? 'audio/words/' + m[k] : null;
}

function cancel(){
  if (currentAudio) { try { currentAudio.pause(); } catch(e) {} currentAudio = null; }
  if (canSpeak) { try { synth.cancel(); } catch(e) {} lastCancel = Date.now(); }
}

/* Resolves when speaking ends, fails, or times out, so callers never get stuck. */
function say(text, rate){
  return new Promise(function(resolve){
    var done = false, timer = null;
    function fin(){ if (done) return; done = true; if (timer) clearTimeout(timer); resolve(); }
    var clip = clipFor(text);
    if (clip) {
      try {
        var a = new Audio(clip);
        currentAudio = a;
        a.onended = fin; a.onerror = fin;
        var pr = a.play(); if (pr && pr.catch) pr.catch(fin);
      } catch(e) { fin(); }
      timer = setTimeout(fin, 8000);
      return;
    }
    if (!canSpeak) { setTimeout(fin, 300 + text.length * 45); return; }
    if (synth.speaking || synth.pending) cancel();
    var wait = Math.max(0, 80 - (Date.now() - lastCancel));
    setTimeout(function(){
      try {
        if (!voices.length) loadVoices();
        var u = new SpeechSynthesisUtterance(text);
        var v = chooseVoice();
        if (v) { u.voice = v; u.lang = v.lang; }
        u.rate = rate || (LR.state && LR.state.rate) || 0.8;
        u.onend = fin; u.onerror = fin;
        currentUtter = u; /* keep a reference so the browser doesn't drop onend */
        synth.speak(u);
      } catch(e) { fin(); }
      timer = setTimeout(fin, 3000 + text.length * 160);
    }, wait);
  });
}

LR.speech = {
  canSpeak: canSpeak,
  say: say,
  cancel: cancel,
  englishVoices: englishVoices,
  chooseVoice: chooseVoice,
  isFemale: isFemale,
  onVoices: function(fn){ voicesHook = fn || null; }
};
})();
