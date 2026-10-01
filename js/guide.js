/* The guide: Tilly the tortoise, an original inline-SVG character. Her pose shows the app's state
   (waiting, listening, happy, thinking). Poses are separate drawings, not animations, so they work with reduced motion. */
(function(){
'use strict';
var LR = window.LR = window.LR || {};

var SHELL = '#4E9E5C', SHELL_DARK = '#357A43', SKIN = '#A8D89A', SKIN_DARK = '#6FA863', INK = '#1E2B38', CHEEK = '#F4A3B4';

function body(){
  return '<ellipse cx="62" cy="168" rx="18" ry="11" fill="' + SKIN + '"/>'
    + '<ellipse cx="128" cy="170" rx="18" ry="11" fill="' + SKIN + '"/>'
    + '<path d="M24 150c0-52 32-86 76-86s74 34 74 86z" fill="' + SHELL + '"/>'
    + '<path d="M24 150h150" stroke="' + SHELL_DARK + '" stroke-width="8" stroke-linecap="round"/>'
    + '<path d="M72 80l-12 34 22 26h36l22-26-12-34z" fill="none" stroke="' + SHELL_DARK + '" stroke-width="5" stroke-linejoin="round"/>'
    + '<path d="M60 114H32M140 114h28M82 140l-8 10M118 140l8 10M72 80l-10-8M128 80l10-8" stroke="' + SHELL_DARK + '" stroke-width="5" stroke-linecap="round"/>';
}
/* The head, centred on (168, 104); pose details are drawn on top. */
function head(face, tilt){
  return '<g transform="rotate(' + (tilt || 0) + ' 168 104)">'
    + '<path d="M150 128c-6 14-4 26 4 32" stroke="' + SKIN + '" stroke-width="22" stroke-linecap="round" fill="none"/>'
    + '<circle cx="168" cy="100" r="30" fill="' + SKIN + '"/>'
    + '<circle cx="152" cy="112" r="6" fill="' + CHEEK + '"/><circle cx="188" cy="112" r="6" fill="' + CHEEK + '"/>'
    + face + '</g>';
}
var EYES = '<circle cx="158" cy="96" r="4.5" fill="' + INK + '"/><circle cx="180" cy="96" r="4.5" fill="' + INK + '"/>';
var POSES = {
  waiting: function(){
    return body() + head(EYES + '<path d="M160 110q10 8 20 0" stroke="' + INK + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>');
  },
  listening: function(){
    return body() + head(EYES + '<circle cx="170" cy="112" r="4" fill="' + INK + '"/>', -12)
      + '<path d="M206 78a16 16 0 0 1 0 26M214 70a28 28 0 0 1 0 42" stroke="' + SKIN_DARK + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
  },
  happy: function(){
    return body() + head('<path d="M153 97q5-6 10 0M175 97q5-6 10 0" stroke="' + INK + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
      + '<path d="M157 107q12 16 24 0z" fill="' + INK + '"/>', 8)
      + '<path d="M26 40l4 9 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#FFCB45"/>'
      + '<path d="M196 30l3 6 6 1-5 4 1 6-5-3-5 3 1-6-5-4 6-1z" fill="#FFCB45"/>';
  },
  thinking: function(){
    return body() + head('<circle cx="160" cy="92" r="4.5" fill="' + INK + '"/><circle cx="182" cy="92" r="4.5" fill="' + INK + '"/>'
      + '<path d="M162 112h14" stroke="' + INK + '" stroke-width="3.5" stroke-linecap="round"/>', 4)
      + '<circle cx="150" cy="54" r="5" fill="' + SKIN_DARK + '"/><circle cx="166" cy="44" r="6" fill="' + SKIN_DARK + '"/><circle cx="185" cy="38" r="7" fill="' + SKIN_DARK + '"/>';
  }
};

/* guide('happy') returns an SVG string. The pose is also named in a data attribute, for tests. */
function guide(pose){
  var p = POSES[pose] ? pose : 'waiting';
  return '<svg class="guide" data-pose="' + p + '" viewBox="0 0 230 190" aria-hidden="true" focusable="false">' + POSES[p]() + '</svg>';
}

LR.guide = { svg: guide, poses: Object.keys(POSES) };
})();
