/* Hungry crocodile: the mouth (< or >) always opens toward the bigger number. */
(function(){
'use strict';
var LR = window.LR, U = LR.ui, S = LR.speech;
var cr;

function mouthSVG(sym, cls){
  var pts = sym === '>' ? '18,18 82,50 18,82' : '82,18 18,50 82,82';
  var ex = sym === '>' ? 56 : 44;
  return '<svg class="mouth ' + (cls || '') + '" viewBox="0 0 100 100" role="img" aria-label="' + (sym === '>' ? 'greater than' : 'less than') + '">'
    + '<polyline points="' + pts + '" fill="none" stroke="currentColor" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<circle cx="' + ex + '" cy="20" r="6" fill="currentColor"/></svg>';
}
function frame(n){
  var s = '<span class="frame" aria-hidden="true">';
  for (var i = 0; i < 10; i++) s += '<span class="cell' + (i < n ? ' fill' : '') + '"></span>';
  return s + '</span>';
}
/* tap: tap the bigger number. pick: choose the mouth. read: the mouth is shown, choose the words. */
var MODES = ['tap', 'tap', 'pick', 'read', 'tap', 'pick', 'read', 'pick'];
var PROMPTS = { tap:'Which is more? Tap it.', pick:'Which mouth fits?', read:'Which words go with this mouth?' };
function correctSym(){ return cr.a > cr.b ? '>' : '<'; }
function statementText(){ return cr.a > cr.b ? cr.a + ' is greater than ' + cr.b : cr.a + ' is less than ' + cr.b; }

function round(){
  if (cr.round >= cr.total) { done(); return; }
  var a = U.rand(11), b;
  do { b = U.rand(11); } while (b === a);
  cr.a = a; cr.b = b; cr.solved = false;
  cr.mode = MODES[cr.round % MODES.length];
  draw();
  S.say(PROMPTS[cr.mode]);
}

function draw(){
  var app = U.app(), tap = cr.mode === 'tap';
  function box(side, n){
    return tap
      ? '<button class="num" data-act="num" data-side="' + side + '" id="num-' + side + '"><span class="n">' + n + '</span>' + frame(n) + '</button>'
      : '<div class="num" id="num-' + side + '"><span class="n">' + n + '</span>' + frame(n) + '</div>';
  }
  var choices = '';
  if (cr.mode === 'pick') choices = '<div class="row" id="choices"><button class="sym" data-act="sym" data-s="<" aria-label="less than">' + mouthSVG('<') + '</button>'
    + '<button class="sym" data-act="sym" data-s=">" aria-label="greater than">' + mouthSVG('>') + '</button></div>';
  if (cr.mode === 'read') choices = '<div class="row" id="choices"><button class="say-btn" data-act="words" data-s=">">is greater than</button>'
    + '<button class="say-btn" data-act="words" data-s="<">is less than</button></div>';
  var slot = cr.mode === 'read' ? mouthSVG(correctSym()) : '?';
  app.innerHTML = '<p class="prompt">' + PROMPTS[cr.mode] + '</p>'
    + '<div class="cmp">' + box('a', cr.a) + '<div class="slot" id="slot">' + slot + '</div>' + box('b', cr.b) + '</div>'
    + choices
    + '<div class="result" id="result"></div>'
    + U.dotsHTML(cr.total, cr.round)
    + '<p class="tip" id="croc-tip">The crocodile’s mouth always opens toward the bigger number.</p>';
  app.onclick = click;
}

function solve(){
  var app = U.app();
  cr.solved = true;
  document.getElementById('num-' + (cr.a > cr.b ? 'a' : 'b')).classList.add('big');
  document.getElementById('slot').innerHTML = mouthSVG(correctSym(), 'chomp');
  /* The answer and Next replace the mouth buttons and the tip, so the screen fits 614 px of height. */
  var choices = document.getElementById('choices');
  if (choices) choices.hidden = true;
  document.getElementById('croc-tip').hidden = true;
  document.getElementById('result').innerHTML = '<span class="result-text"><b>' + cr.a + ' ' + U.esc(correctSym()) + ' ' + cr.b + '</b>'
    + U.esc(statementText()) + '</span><button class="btn" data-act="nextc">Next ▶</button>';
  Array.prototype.forEach.call(app.querySelectorAll('button.num'), function(b){ b.disabled = true; });
  U.stopAll();
  S.say('Chomp! The crocodile eats ' + Math.max(cr.a, cr.b) + '. ' + statementText() + '.');
}
function shake(el){ el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }

function click(e){
  var el = U.closestAct(e);
  if (!el || el.disabled) return;
  var a = el.getAttribute('data-act');
  if (a === 'num' && !cr.solved) {
    var n = el.getAttribute('data-side') === 'a' ? cr.a : cr.b;
    if (n === Math.max(cr.a, cr.b)) solve();
    else { shake(el); U.stopAll(); S.say('Count the dots. Which has more?'); }
  } else if (a === 'sym' && !cr.solved) {
    var s = el.getAttribute('data-s');
    if (s === correctSym()) solve();
    else {
      shake(el);
      var slot = document.getElementById('slot');
      slot.innerHTML = mouthSVG(s, 'bad');
      U.stopAll();
      var g = U.gen;
      S.say('Oops! That mouth wants the smaller number. Try the other one.');
      setTimeout(function(){ if (g === U.gen && !cr.solved) slot.innerHTML = '?'; }, 1600);
    }
  } else if (a === 'words' && !cr.solved) {
    if (el.getAttribute('data-s') === correctSym()) solve();
    else { shake(el); U.stopAll(); S.say('Look at the mouth. It opens toward the bigger number.'); }
  } else if (a === 'nextc') { cr.round++; U.stopAll(); round(); }
  else if (a === 'again') { LR.routes.croc(); }
}

function done(){
  var app = U.app();
  app.innerHTML = '<div class="done"><div class="stars" aria-hidden="true">🐊</div><p class="prompt">You fed the crocodile ' + cr.total + ' times!</p>'
    + '<div class="row"><button class="btn" data-act="again">Play again</button><a class="btn soft" href="#home">Home</a></div></div>';
  app.onclick = click;
  S.say('The crocodile is full. Well done!');
}

LR.routes.croc = function(){ U.setTitle('Hungry crocodile'); cr = { round:0, total:8 }; round(); };
})();
