/* Spaced review. Every word has a box (0 to 5) and a due date; right on the first try moves it up (once a day),
   a miss or a help tap moves it down. Box 3 or more is mastered and grows a flower, which is never taken away. */
(function(){
'use strict';
var LR = window.LR = window.LR || {};
var INTERVALS = [0, 1, 2, 4, 7, 14];

function pad(n){ return (n < 10 ? '0' : '') + n; }
function fmt(d){ return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
/* The tablet's local date. */
function localDate(){ return fmt(new Date()); }
/* "Today" never goes backwards: if the clock is moved back, the last date seen is used. */
function today(){
  var d = localDate(), last = LR.state && LR.state.last;
  return last && d < last ? last : d;
}
function addDays(date, n){
  var p = date.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2] + n);
  return fmt(d);
}

function items(){ return LR.state.items; }
function wid(w){ return 'w:' + w; }
/* Adds a word to review (box 0, due today) if it isn't there yet. */
function ensure(id, box){
  var it = items();
  if (!it[id]) it[id] = { b:box || 0, d:today(), u:'', m:0 };
  return it[id];
}

/* Right on the first try: up one box, at most once a day. Returns true if this grew a new flower. */
function right(id){
  var r = ensure(id), t = today(), grew = false;
  if (r.u === t) return false;
  r.b = Math.min(5, r.b + 1);
  r.u = t;
  r.d = addDays(t, INTERVALS[r.b]);
  if (r.b >= 3 && LR.state.flowers.indexOf(id) === -1) { LR.state.flowers.push(id); grew = true; }
  return grew;
}
/* A miss, a help tap or a grown-up's "stumbled" mark: down one box (never below 0), due again today. */
function miss(id){
  var r = ensure(id);
  r.b = Math.max(0, r.b - 1);
  r.d = today();
  r.m = Math.min(999, r.m + 1);
}
/* Words she is learning (box 1 or 2): they show as sprouts in her garden. */
function growing(){ var it = items(); return Object.keys(it).filter(function(id){ return it[id].b >= 1 && it[id].b <= 2; }).length; }
function isMastered(w){ var r = items()[wid(w)]; return !!r && r.b >= 3; }

function unitById(id){ for (var i = 0; i < LR.units.length; i++) if (LR.units[i].id === id) return LR.units[i]; return unitById.start || (unitById.start = LR.units.filter(function(u){ return u.id === LR.startUnit; })[0] || LR.units[0]); }
function unit(){ return unitById(LR.state.unit); }

/* Sounds and words: due words, about 1 weak (box 0-1) for every 3 known (box 2+), plus up to 3 new unit words.
   With too few known words due, mastered words that aren't due fill in, least recently reviewed first. */
function planWords(max){
  max = max || 10;
  var t = today(), it = items(), weak = [], known = [];
  Object.keys(it).forEach(function(id){
    if (id.indexOf('w:') !== 0 || it[id].d > t) return;
    (it[id].b <= 1 ? weak : known).push(id);
  });
  var byDue = function(a, b){ return it[a].d < it[b].d ? -1 : it[a].d > it[b].d ? 1 : 0; };
  weak.sort(byDue); known.sort(byDue);
  var fresh = unit().words.filter(function(w){ return !it[wid(w)]; }).slice(0, 3).map(function(w){ ensure(wid(w)); return wid(w); });
  /* Nothing known yet (the first days): the new words and the weakest ones, 6 at most. */
  if (!known.length && !Object.keys(it).some(function(id){ return it[id].b >= 2; })) return fresh.concat(weak).slice(0, 6).map(strip);
  weak = weak.concat(fresh);
  if (known.length < weak.length * 3) {
    var extra = Object.keys(it).filter(function(id){ return id.indexOf('w:') === 0 && it[id].b >= 3 && it[id].d > t; });
    extra.sort(function(a, b){ return (it[a].u || '') < (it[b].u || '') ? -1 : 1; });
    known = known.concat(extra.slice(0, weak.length * 3 - known.length));
  }
  var out = [], k = 0, w = 0;
  while (out.length < max && (k < known.length || w < weak.length)) {
    for (var j = 0; j < 3 && k < known.length && out.length < max; j++) out.push(known[k++]);
    if (w < weak.length && out.length < max) out.push(weak[w++]);
  }
  return out.map(strip);
}
function strip(id){ return id.slice(2); }

/* Extra practice after the day is done: a few due or mastered words. */
function planExtra(n){
  var it = items(), ids = Object.keys(it).filter(function(id){ return id.indexOf('w:') === 0; });
  ids.sort(function(a, b){ return it[a].d < it[b].d ? -1 : 1; });
  return LR.ui.shuffle(ids.slice(0, n * 2)).slice(0, n).map(strip);
}

/* First-try accuracy of the last session before today (1 if none yet). */
function lastAccuracy(){
  var t = today(), ds = LR.state.days.filter(function(d){ return d.d < t && d.n > 0; });
  if (!ds.length) return 1;
  var d = ds[ds.length - 1];
  return d.r / d.n;
}
/* New tricky words today: 2 after a good day (60%+), 1 after an OK one (40-60%), none after a hard one. */
function newTrickyCount(){ var a = lastAccuracy(); return a >= 0.6 ? 2 : a >= 0.4 ? 1 : 0; }
function newTricky(){
  var it = items();
  return unit().tricky.filter(function(w){ return !it[wid(w)]; }).slice(0, newTrickyCount());
}

/* The unit's story read least recently (never read comes first). */
function nextStory(){
  var s = LR.state.stories, list = unit().stories.slice();
  list.sort(function(a, b){ var x = s[a.id] || '', y = s[b.id] || ''; return x < y ? -1 : x > y ? 1 : 0; });
  return list[0];
}

/* The next unit opens when every word and tricky word of this one is mastered, and (if it has silly sentences)
   she has answered at least 5 of them with 80% right first time. */
function unitDone(){
  var it = items(), u = unit(), sil = (LR.state.silly || {})[u.id];
  var words = u.words.concat(u.tricky).every(function(w){ var r = it[wid(w)]; return r && r.b >= 3; });
  var silly = !(u.silly && u.silly.length) || (!!sil && sil[0] >= 5 && sil[1] / sil[0] >= 0.8);
  return words && silly;
}
function sillyResult(unitId, first){
  var s = LR.state.silly || (LR.state.silly = {}), v = s[unitId] || [0, 0];
  s[unitId] = [Math.min(9999, v[0] + 1), Math.min(9999, v[1] + (first ? 1 : 0))];
}
function advance(){
  if (!unitDone()) return false;
  var i = LR.units.indexOf(unit());
  if (i < LR.units.length - 1) { LR.state.unit = LR.units[i + 1].id; return true; }
  return false;
}

/* ---------- Maths ---------- */
/* Skills unlock in order: each opens when the one before it reaches box 2. Comparing is always open. A skill she has
   already practised stays open, so a skill added earlier in the order never locks one she could use before. */
function mathsUnlocked(){ return chain(LR.maths.ids, 'm:', 1); }
function chain(ids, pre, open){
  var it = items(), out = ids.slice(0, open), prevOpen = true;
  for (var i = open; i < ids.length; i++) {
    var prev = it[pre + ids[i - 1]], mine = it[pre + ids[i]];
    var ok = (prevOpen && prev && prev.b >= 2) || !!mine;
    if (ok) out.push(ids[i]);
    prevOpen = ok;
  }
  return out;
}
/* Language skills: the first ones are always open, then one more each time the one before reaches box 2. */
function langUnlocked(){ return chain(LR.grammar.ORDER, 'g:', LR.grammar.OPEN); }
/* Level 2 (bigger numbers) once a skill reaches box 3. */
function mathsLevel(id){ var r = items()['m:' + id]; return r && r.b >= 3 ? 2 : 1; }
function langLevel(id){ var r = items()['g:' + id]; return r && r.b >= 3 ? 2 : 1; }

/* Adds a session's results to the day's record (last 30 days kept). */
function recordDay(n, r, mins){
  var t = today(), days = LR.state.days, d = days.length && days[days.length - 1].d === t ? days[days.length - 1] : null;
  if (!d) { d = { d:t, n:0, r:0, mins:0 }; days.push(d); }
  d.n = Math.min(500, d.n + n); d.r = Math.min(d.n, d.r + r); d.mins = Math.min(600, d.mins + mins);
  while (days.length > 30) days.shift();
}

LR.progress = {
  INTERVALS:INTERVALS, localDate:localDate, today:today, addDays:addDays, ensure:ensure, right:right, miss:miss, isMastered:isMastered,
  unit:unit, unitById:unitById, planWords:planWords, planExtra:planExtra, newTricky:newTricky, newTrickyCount:newTrickyCount,
  lastAccuracy:lastAccuracy, growing:growing, sillyResult:sillyResult, mathsUnlocked:mathsUnlocked, mathsLevel:mathsLevel, langUnlocked:langUnlocked, langLevel:langLevel, nextStory:nextStory, unitDone:unitDone, advance:advance, recordDay:recordDay, wid:wid
};
})();
