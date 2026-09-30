/* Her garden: one flower for every word or skill she has ever mastered. It only grows.
   Drawn as inline SVG. New flowers (today's) get a sun-coloured ring, a still cue that needs no motion. */
(function(){
'use strict';
var LR = window.LR = window.LR || {};

var PETALS = ['#F28AA5', '#FFCB45', '#B18CE0', '#FF9E5E', '#7CC6F2', '#F6D55C'];

function flower(x, y, i, fresh){
  var c = PETALS[i % PETALS.length], s = '';
  if (fresh) s += '<circle cx="' + x + '" cy="' + (y - 34) + '" r="30" fill="#FFF2BF" stroke="#FFCB45" stroke-width="4"/>';
  s += '<path d="M' + x + ' ' + y + 'v-30" stroke="#3E8A4B" stroke-width="5" stroke-linecap="round"/>'
    + '<path d="M' + x + ' ' + (y - 12) + 'q-14-4-16-14q14 0 16 10" fill="#5BAE6A"/>';
  [[0, -14], [13, -4], [8, 11], [-8, 11], [-13, -4]].forEach(function(d){
    s += '<circle cx="' + (x + d[0]) + '" cy="' + (y - 34 + d[1]) + '" r="10" fill="' + c + '"/>';
  });
  return s + '<circle cx="' + x + '" cy="' + (y - 34) + '" r="7" fill="#7A5236"/>';
}

/* garden(12, 2) draws 12 flowers, the last 2 marked as new. Past 42 flowers, a counter shows the rest. */
function garden(count, fresh, tall){
  count = Math.max(0, count | 0); fresh = Math.min(count, Math.max(0, fresh | 0));
  /* tall: a narrower, taller field (portrait), with fewer flowers to a row and more rows. */
  var COLS = tall ? 8 : 14, ROWS = tall ? 6 : 3, W = tall ? 600 : 1000, H = tall ? 460 : 300;
  var shown = Math.min(count, COLS * ROWS), s = '';
  var top = tall ? H - 290 : H - 150, half = W / 2;
  s += '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="#E3F1F6"/>'
    + '<circle cx="' + (W - 100) + '" cy="62" r="40" fill="#FFCB45"/>'
    + '<path d="M0 ' + top + 'q' + half / 2 + '-40 ' + half + ' 0t' + half + ' 0V' + H + 'H0z" fill="#BFE6A8"/>'
    + '<path d="M0 ' + (top + 40) + 'q' + half / 2 + '-30 ' + half + ' 0t' + half + ' 0V' + H + 'H0z" fill="#9CD08A"/>';
  for (var i = 0; i < shown; i++) {
    var row = Math.floor(i / COLS), col = i % COLS;
    var x = 50 + col * 64 + (row % 2) * 32, y = (tall ? top + 70 : 200) + row * 40;
    s += flower(x, y, i, i >= shown - Math.min(fresh, shown));
  }
  if (count > shown) s += '<text x="960" y="285" text-anchor="end" font-size="34" font-weight="700" fill="#1E2B38">+' + (count - shown) + '</text>';
  return '<svg class="garden" data-flowers="' + count + '" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMax slice" role="img" aria-label="'
    + count + ' flower' + (count === 1 ? '' : 's') + '">' + s + '</svg>';
}

LR.garden = { svg: garden };
})();
