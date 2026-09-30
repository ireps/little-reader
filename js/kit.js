/* LR.kit: the child-screen components of the guided session (Phase 4).
   Every function returns an HTML string; built-in text goes through LR.ui.esc() or lettersHTML(). */
(function(){
'use strict';
var LR = window.LR = window.LR || {};
var kit = LR.kit = {};

function esc(s){ return LR.ui.esc(s); }
function I(n){ return LR.icons.get(n); }

/* The session's steps, in order. Steps with nothing to do are left off the path. */
kit.STEPS = [
  { id:'words', icon:'search', label:'Sounds and words' },
  { id:'tricky', icon:'heart', label:'New tricky word' },
  { id:'silly', icon:'thumb', label:'Silly sentences' },
  { id:'read', icon:'book', label:'Read with me' },
  { id:'maths', icon:'dice', label:'Maths' },
  { id:'garden', icon:'flower', label:'Garden' }
];

/* A garden path of step icons: done steps carry a check, the current one is lit. */
kit.path = function(ids, current){
  var at = ids.indexOf(current), out = '<ol class="s-path" aria-label="Today">';
  ids.forEach(function(id, i){
    var st = kit.STEPS.filter(function(s){ return s.id === id; })[0];
    var cls = i < at ? 'done' : i === at ? 'now' : 'next';
    out += (i ? '<li class="s-link ' + (i <= at ? 'done' : '') + '" aria-hidden="true"></li>' : '')
      + '<li class="s-step ' + cls + '" aria-label="' + esc(st.label) + (cls === 'done' ? ', done' : cls === 'now' ? ', now' : '') + '">'
      + I(st.icon) + (cls === 'done' ? '<span class="s-tick">' + I('check') + '</span>' : '') + '</li>';
  });
  return out + '</ol>';
};

/* A row of seeds, one per item in the current step; finished items are filled. */
kit.seeds = function(total, done){
  var out = '<div class="s-seeds" aria-label="' + done + ' of ' + total + '">';
  for (var i = 0; i < total; i++) out += '<span class="s-seed' + (i < done ? ' on' : '') + '"></span>';
  return out + '</div>';
};

/* The one primary target on a screen: the single thing to tap next. */
kit.target = function(act, label, icon, extra){
  return '<button class="s-target" data-act="' + esc(act) + '"' + (extra || '') + '>' + (icon ? I(icon) : '') + '<span>' + esc(label) + '</span></button>';
};

/* A quiet replay control: never louder than her answers. */
kit.replay = function(act){
  return '<button class="s-replay" data-act="' + esc(act || 'hear') + '" aria-label="Hear it again">' + I('speaker') + '</button>';
};

/* Answer cards for a choice: all share one answer style, so none stands out. state: '', 'right', 'wrong'. */
kit.card = function(word, state, act){
  var mark = state === 'right' ? '<span class="fb-mark">' + I('check') + '</span>' : state === 'wrong' ? '<span class="fb-mark">' + I('dot') + '</span>' : '';
  return '<button class="s-card' + (state ? ' fb-' + state : '') + '" data-act="' + esc(act || 'pick') + '" data-w="' + esc(word) + '"'
    + (state ? ' disabled' : '') + '>' + LR.ui.lettersHTML(word, true) + mark + '</button>';
};

/* A big word with its heart letters. lit: index of a letter to light, or -1. */
kit.word = function(word, lit){
  var html = LR.ui.lettersHTML(word);
  if (lit > -1) {
    var n = -1;
    html = html.replace(/<span class="l( h)?"/g, function(m, h){ n++; return '<span class="l' + (h || '') + (n === lit ? ' lit' : '') + '"'; });
  }
  return '<div class="s-word">' + html + '</div>';
};

/* A sentence to read, one button per word (tap for help). Hearts hide on words she has mastered. */
kit.sentence = function(s, opts){
  opts = opts || {};
  var mastered = opts.mastered || [], k = -1;
  return '<div class="s-sentence">' + (s.match(/[A-Za-z']+|[^A-Za-z']+/g) || []).map(function(t){
    if (!/^[A-Za-z']+$/.test(t)) return esc(t);
    k++;
    var w = LR.ui.clean(t), cls = 'w' + (k === opts.lit ? ' say' : '') + (opts.helped && opts.helped.indexOf(k) > -1 ? ' helped' : '');
    return '<button class="' + cls + '" data-act="w" data-w="' + esc(t) + '">' + LR.ui.lettersHTML(t, mastered.indexOf(w) > -1) + '</button>';
  }).join('') + '</div>';
};

/* A hold button: it only acts after being held (ms). The ring fills as it is held; p is 0 to 1. */
kit.hold = function(act, icon, label, ms, p, cls){
  var r = 44, c = 2 * Math.PI * r, fill = Math.max(0, Math.min(1, p || 0));
  return '<button class="s-hold ' + (cls || '') + '" data-act="' + esc(act) + '" data-hold="' + (ms | 0) + '" aria-label="' + esc(label) + ' (hold)">'
    + '<svg class="s-ring" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="' + r + '" class="s-ring-bg"/>'
    + (fill ? '<circle cx="50" cy="50" r="' + r + '" class="s-ring-fg" stroke-dasharray="' + (c * fill).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 50 50)"/>' : '') + '</svg>'
    + I(icon) + '</button>';
};

/* The session screen: top strip (hold to go home, the path, the seeds), the guide with her words, and the activity. */
kit.screen = function(o){
  return '<div class="s-screen">'
    + '<div class="s-top">' + kit.hold('home', 'home', 'Home', 1000, o.homeHold || 0, 'home')
    + (o.steps ? kit.path(o.steps, o.step) : '<span></span>')
    + (o.seeds ? kit.seeds(o.seeds[0], o.seeds[1]) : '<span></span>') + '</div>'
    + '<div class="s-guide">' + LR.guide.svg(o.pose) + '<p class="s-bubble" id="caption" aria-live="polite">' + esc(o.say || '') + '</p></div>'
    + '<div class="s-main">' + o.main + '</div></div>';
};
})();
