/* Saved state, on this tablet only. Everything loaded (or restored from a backup) is checked before use.
   Schema 2: progress per word, her garden, and today's session plan. Older data is migrated. */
(function(){
'use strict';
var LR = window.LR = window.LR || {};
var KEY = 'littleReader.v1', OLD_KEY = 'readingGarden.v1', SCHEMA = 2;
var MAX_WORD = 30, MAX_ITEMS = 2000, MAX_FLOWERS = 2000, MAX_STORIES = 500, MAX_DAYS = 30;
var ID = /^[a-z]{1,2}:[a-z0-9'-]{1,30}$/, DATE = /^\d{4}-\d{2}-\d{2}$/;
var STEP_IDS = ['words', 'tricky', 'silly', 'read', 'maths', 'world', 'garden'];

function read(key){
  try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch(e) { return null; }
}
function isObj(o){ return !!o && typeof o === 'object' && !Array.isArray(o); }
function cleanWord(w){ return String(w).toLowerCase().replace(/[^a-z']/g, '').slice(0, MAX_WORD); }
function isDate(d){ return typeof d === 'string' && DATE.test(d); }
function isInt(n, lo, hi){ return typeof n === 'number' && n % 1 === 0 && n >= lo && n <= hi; }
function keys(o, max){ return Object.keys(o).slice(0, max); }

function blank(){
  return { schema:SCHEMA, unit:LR.startUnit || LR.units[0].id, items:{}, flowers:[], confusions:{}, stories:{}, silly:{}, resume:null, days:[], rate:0.9, last:'', equals:false, clips:true, captions:false, pace:'calm' };
}

/* confusions: { target: { word she picked instead: count } } */
function cleanConfusions(c){
  var out = {};
  if (!isObj(c)) return out;
  keys(c, 200).forEach(function(k){
    var t = cleanWord(k), m = c[k], row = {};
    if (!t || !isObj(m)) return;
    keys(m, 10).forEach(function(j){
      var w = cleanWord(j), n = m[j];
      if (w && w !== t && typeof n === 'number' && n > 0 && n < 1000) row[w] = Math.floor(n);
    });
    if (Object.keys(row).length) out[t] = row;
  });
  return out;
}

/* One item of today's plan. Anything unexpected is dropped. */
var WORD_TYPES = ['find', 'flash', 'pic', 'build', 'tricky', 'an'];
function isId(x){ return typeof x === 'string' && /^[a-z0-9-]{1,20}$/.test(x); }
function cleanItem(it){
  var out = cleanItemOf(it);
  if (out && typeof it.g === 'string' && LR.grammar && LR.grammar.ORDER.indexOf(it.g) > -1) out.g = it.g;
  return out;
}
function cleanItemOf(it){
  if (!isObj(it)) return null;
  if (WORD_TYPES.indexOf(it.t) > -1 && typeof it.w === 'string' && cleanWord(it.w)) return { t:it.t, w:cleanWord(it.w) };
  if (it.t === 'plural' && typeof it.w === 'string' && cleanWord(it.w)) return { t:'plural', w:cleanWord(it.w), many:it.many === true };
  if ((it.t === 'read' || it.t === 'caps') && isId(it.story) && isInt(it.i, 0, 20)) return { t:it.t, story:it.story, i:it.i };
  if (it.t === 'q' && isId(it.story) && isInt(it.k, 0, 5)) return { t:'q', story:it.story, k:it.k };
  if (it.t === 'silly' && isId(it.u) && isInt(it.k, 0, 20)) return { t:'silly', u:it.u, k:it.k };
  if (it.t === 'rhyme' && isInt(it.k, 0, 50)) return { t:'rhyme', k:it.k };
  if (it.t === 'pos' && (it.p === 'in' || it.p === 'on' || it.p === 'under')) return { t:'pos', p:it.p };
  /* Comparing: "more" and "mouth" never use equal numbers; "eq" (the = switch is on) may. */
  if (it.t === 'croc' && isInt(it.a, 0, 20) && isInt(it.b, 0, 20) && ((it.a !== it.b && (it.m === 'more' || it.m === 'mouth')) || it.m === 'eq'))
    return { t:'croc', a:it.a, b:it.b, m:it.m, lv:it.lv === 2 ? 2 : 1 };
  if (it.t === 'math' && LR.maths && LR.maths.ids.indexOf(it.s) > -1 && isInt(it.seed, 1, 999999999)) return { t:'math', s:it.s, lv:it.lv === 2 ? 2 : 1, seed:it.seed };
  if (it.t === 'gram' && LR.grammar && LR.grammar.ids.indexOf(it.g) > -1 && isInt(it.seed, 1, 999999999)) return { t:'gram', g:it.g, lv:it.lv === 2 ? 2 : 1, seed:it.seed };
  if (it.t === 'order' && isId(it.u) && isInt(it.k, 0, 20)) return { t:'order', u:it.u, k:it.k };
  if (it.t === 'world' && LR.world && LR.world.ids.indexOf(it.e) > -1 && isInt(it.seed, 1, 999999999)) return { t:'world', e:it.e, seed:it.seed };
  return null;
}
function cleanResume(r){
  if (!isObj(r) || !isDate(r.date) || !Array.isArray(r.steps)) return null;
  var steps = r.steps.slice(0, 7).map(function(st){
    if (!isObj(st) || STEP_IDS.indexOf(st.id) === -1 || !Array.isArray(st.items)) return null;
    return { id:st.id, items:st.items.slice(0, 20).map(cleanItem).filter(Boolean) };
  }).filter(Boolean);
  if (!steps.length) return null;
  var at = Array.isArray(r.at) && isInt(r.at[0], 0, 7) && isInt(r.at[1], 0, 20) ? [r.at[0], r.at[1]] : [0, 0];
  return {
    date:r.date, steps:steps, at:at, done:r.done === true,
    started:isInt(r.started, 0, 9e15) ? r.started : 0,
    fresh:isInt(r.fresh, 0, 100) ? r.fresh : 0,
    right:isInt(r.right, 0, 500) ? r.right : 0, answered:isInt(r.answered, 0, 500) ? r.answered : 0,
    mode:r.mode === 'extra' || r.mode === 'practice' ? r.mode : 'day'
  };
}

/* Returns a complete, safe schema-2 state object whatever it is given. */
function validate(s){
  var out = blank();
  if (!isObj(s)) return out;
  if (typeof s.unit === 'string' && LR.units.some(function(u){ return u.id === s.unit; })) out.unit = s.unit;
  if (isObj(s.items)) keys(s.items, MAX_ITEMS).forEach(function(id){
    var r = s.items[id];
    if (!ID.test(id) || !isObj(r) || !isInt(r.b, 0, 5) || !isDate(r.d)) return;
    out.items[id] = { b:r.b, d:r.d, u:isDate(r.u) ? r.u : '', m:isInt(r.m, 0, 999) ? r.m : 0 };
  });
  if (Array.isArray(s.flowers)) {
    var seen = {};
    out.flowers = s.flowers.filter(function(id){ if (typeof id !== 'string' || !ID.test(id) || seen[id]) return false; seen[id] = 1; return true; }).slice(0, MAX_FLOWERS);
  }
  out.confusions = cleanConfusions(s.confusions);
  if (isObj(s.stories)) keys(s.stories, MAX_STORIES).forEach(function(id){
    if (/^[a-z0-9-]{1,20}$/.test(id) && isDate(s.stories[id])) out.stories[id] = s.stories[id];
  });
  /* Silly-sentence accuracy per unit: [answered, right first time]. */
  if (isObj(s.silly)) keys(s.silly, 100).forEach(function(u){
    var v = s.silly[u];
    if (isId(u) && Array.isArray(v) && isInt(v[0], 0, 9999) && isInt(v[1], 0, 9999) && v[1] <= v[0]) out.silly[u] = [v[0], v[1]];
  });
  out.resume = cleanResume(s.resume);
  if (Array.isArray(s.days)) out.days = s.days.filter(function(d){
    return isObj(d) && isDate(d.d) && isInt(d.n, 0, 500) && isInt(d.r, 0, 500) && d.r <= d.n && isInt(d.mins, 0, 600);
  }).map(function(d){ return { d:d.d, n:d.n, r:d.r, mins:d.mins }; }).slice(-MAX_DAYS);
  if (typeof s.rate === 'number' && s.rate >= 0.75 && s.rate <= 1.1) out.rate = s.rate;
  if (isDate(s.last)) out.last = s.last;
  out.equals = s.equals === true;
  out.clips = s.clips !== false;
  out.captions = s.captions === true;
  out.pace = s.pace === 'normal' || s.pace === 'quick' ? s.pace : 'calm';
  return out;
}

/* ---------- Migration from schema 1 (and the Reading Garden prototype before it) ---------- */
function isOld(s){ return isObj(s) && s.schema !== SCHEMA && (Array.isArray(s.words) || isObj(s.tricky) || isObj(s.confusions)); }
function migrate(old, today){
  var out = blank();
  if (Array.isArray(old.words)) old.words.slice(0, 60).forEach(function(w){
    w = cleanWord(w);
    if (w) out.items['w:' + w] = { b:1, d:today, u:'', m:0 };
  });
  if (isObj(old.tricky)) keys(old.tricky, 200).forEach(function(k){
    var w = cleanWord(k);
    if (w) out.items['w:' + w] = { b:0, d:today, u:'', m:isInt(old.tricky[k], 0, 999) ? old.tricky[k] : 0 };
  });
  out.confusions = cleanConfusions(old.confusions);
  if (typeof old.rate === 'number') out.rate = Math.max(0.75, Math.min(1.1, old.rate));
  seedKnown(out, today);
  return out;
}
/* Her known tricky words, and the Phase 2 and 3 tricky words she is assumed to know, go into review at box 1.
   Runs on every load, so existing progress gains words added later; words already there are left alone. */
function seedKnown(st, today){
  var added = false, n = Object.keys(st.items).length;
  (LR.knownTricky || []).concat(LR.baseReview || []).forEach(function(w){
    if (!st.items['w:' + w] && n < MAX_ITEMS) { n++; st.items['w:' + w] = { b:1, d:today, u:'', m:0 }; added = true; }
  });
  /* Someone who has done sessions before the language order existed keeps the five tasks they had. */
  if (st.days && st.days.length && LR.grammar && !Object.keys(st.items).some(function(k){ return k.indexOf('g:') === 0; })) {
    LR.grammar.EARLIER.forEach(function(g){ if (n < MAX_ITEMS) { st.items['g:' + g] = { b:1, d:today, u:'', m:0 }; n++; added = true; } });
  }
  return added;
}

var failed = false;
function save(){
  try { localStorage.setItem(KEY, JSON.stringify(LR.state)); failed = false; }
  catch(e) { failed = true; }
}

function load(){
  var today = LR.progress ? LR.progress.localDate() : new Date().toISOString().slice(0, 10);
  var s = read(KEY);
  if (!s) s = read(OLD_KEY);
  if (isOld(s)) { LR.state = migrate(s, today); save(); }
  else {
    LR.state = validate(s);
    if (seedKnown(LR.state, today)) save();
  }
  return LR.state;
}

/* Wipes everything saved and starts again at the first unit. */
function reset(){
  try { localStorage.removeItem(KEY); localStorage.removeItem(OLD_KEY); } catch(e) {}
  LR.state = blank();
  seedKnown(LR.state, LR.progress.localDate());
  save();
}

LR.store = {
  load:load, save:save, reset:reset, validate:validate, migrate:migrate, isOld:isOld, cleanWord:cleanWord, seedKnown:seedKnown,
  failed:function(){ return failed; }, SCHEMA:SCHEMA, KEY:KEY
};
})();
