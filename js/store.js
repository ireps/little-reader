/* Saved state, on this tablet only. Everything loaded is checked before use. */
(function(){
'use strict';
var LR = window.LR = window.LR || {};
var KEY = 'littleReader.v1', OLD_KEY = 'readingGarden.v1', SCHEMA = 1;
var MAX_WORDS = 60, MAX_WORD = 30, MAX_STORY = 2000;

function read(key){
  try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch(e) { return null; }
}
function isObj(o){ return !!o && typeof o === 'object' && !Array.isArray(o); }
function cleanWord(w){ return String(w).toLowerCase().replace(/[^a-z']/g, '').slice(0, MAX_WORD); }
function isIndex(n){ return typeof n === 'number' && n >= 0 && n < MAX_WORD && n % 1 === 0; }

/* Returns a complete, safe state object whatever it is given. */
function validate(s){
  var d = LR.defaultWeek;
  var out = { schema:SCHEMA, words:d.words.slice(), story:d.story, hearts:{}, tricky:{}, confusions:{}, storyMode:'together', voice:'', rate:0.8 };
  if (!isObj(s)) return out;
  if (Array.isArray(s.words)) {
    var seen = {};
    out.words = s.words.filter(function(w){ return typeof w === 'string'; }).map(cleanWord)
      .filter(function(w){ if (!w || seen[w]) return false; seen[w] = 1; return true; }).slice(0, MAX_WORDS);
  }
  if (typeof s.story === 'string') out.story = s.story.slice(0, MAX_STORY);
  if (isObj(s.hearts)) Object.keys(s.hearts).forEach(function(k){
    var w = cleanWord(k), v = s.hearts[k];
    if (w && Array.isArray(v)) out.hearts[w] = v.filter(isIndex);
  });
  if (isObj(s.tricky)) Object.keys(s.tricky).forEach(function(k){
    var w = cleanWord(k), n = s.tricky[k];
    if (w && typeof n === 'number' && n > 0 && n < 1000) out.tricky[w] = Math.floor(n);
  });
  /* confusions: { target: { word she picked instead: count } }, from Word detective. */
  if (isObj(s.confusions)) Object.keys(s.confusions).slice(0, 200).forEach(function(k){
    var t = cleanWord(k), m = s.confusions[k], row = {};
    if (!t || !isObj(m)) return;
    Object.keys(m).slice(0, 10).forEach(function(j){
      var w = cleanWord(j), n = m[j];
      if (w && w !== t && typeof n === 'number' && n > 0 && n < 1000) row[w] = Math.floor(n);
    });
    if (Object.keys(row).length) out.confusions[t] = row;
  });
  if (s.storyMode === 'together' || s.storyMode === 'myturn') out.storyMode = s.storyMode;
  if (typeof s.voice === 'string') out.voice = s.voice.slice(0, 200);
  if (typeof s.rate === 'number' && s.rate >= 0.5 && s.rate <= 1.2) out.rate = s.rate;
  return out;
}

function save(){ try { localStorage.setItem(KEY, JSON.stringify(LR.state)); } catch(e) {} }

/* First run after the rename copies anything saved by the Reading Garden prototype. */
function load(){
  var s = read(KEY), migrated = false;
  if (!s) { s = read(OLD_KEY); migrated = !!s; }
  LR.state = validate(s);
  if (migrated) save();
  return LR.state;
}

LR.store = { load:load, save:save, validate:validate, cleanWord:cleanWord, MAX_WORDS:MAX_WORDS, MAX_STORY:MAX_STORY };
})();
