/* Interface icons as inline SVG. The tablet's old emoji font draws emoji differently, so buttons and headers use these.
   Emoji stay only as content pictures (Unicode 8 or older). */
(function(){
'use strict';
var LR = window.LR = window.LR || {};

var S = 'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';
var PATHS = {
  home: '<path d="M12 3 2 12h3v9h5v-6h4v6h5v-9h3z"/>',
  speaker: '<path d="M3 9v6h4l5 5V4L7 9z"/><path d="M15.5 8a5.5 5.5 0 0 1 0 8" ' + S + ' stroke-width="2.2"/><path d="M18.5 5a9.5 9.5 0 0 1 0 14" ' + S + ' stroke-width="2.2"/>',
  check: '<path d="M4 12.5l5 5L20 6.5" ' + S + ' stroke-width="3.4"/>',
  star: '<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/>',
  flower: '<path d="M12 13v9" ' + S + ' stroke-width="2"/><circle cx="12" cy="4.6" r="3"/><circle cx="16.6" cy="8" r="3"/>'
    + '<circle cx="14.8" cy="13" r="3"/><circle cx="9.2" cy="13" r="3"/><circle cx="7.4" cy="8" r="3"/><circle cx="12" cy="9.2" r="2.6" fill="#FFCB45"/>',
  sprout: '<path d="M12 22V11" ' + S + ' stroke-width="2.2"/><path d="M12 13C12 8 8.5 5.5 4 6c0 4.5 3 7 8 7z"/><path d="M12 11c0-4 3-7 8-7 0 4.5-3.5 7-8 7z"/>',
  heart: '<path d="M12 21s-7.5-4.6-9.5-9.3C1 8 3.4 4 7.2 4c2 0 3.5 1.1 4.8 2.8C13.3 5.1 14.8 4 16.8 4 20.6 4 23 8 21.5 11.7 19.5 16.4 12 21 12 21z"/>',
  left: '<path d="M15 4 7 12l8 8" ' + S + ' stroke-width="3.4"/>',
  right: '<path d="M9 4l8 8-8 8" ' + S + ' stroke-width="3.4"/>',
  dot: '<circle cx="12" cy="12" r="5"/>',
  search: '<circle cx="10" cy="10" r="6.5" ' + S + ' stroke-width="2.6"/><path d="M15 15l6 6" ' + S + ' stroke-width="3"/>',
  book: '<path d="M2 5c3-1.5 6.5-1.5 10 1 3.5-2.5 7-2.5 10-1v14c-3-1.5-6.5-1.5-10 1-3.5-2.5-7-2.5-10-1z" ' + S + ' stroke-width="2"/><path d="M12 6v14" ' + S + ' stroke-width="2"/>',
  croc: '<path d="M20 5 6 12l14 7" ' + S + ' stroke-width="3.2"/><circle cx="16.5" cy="4.2" r="1.7"/>',
  thumb: '<path d="M2 10h4v11H2z"/><path d="M8 21h9.5a2 2 0 0 0 2-1.6l1.4-7A2 2 0 0 0 19 10h-5l.8-4.2A2 2 0 0 0 12.8 3.5L8 10z"/>',
  dice: '<rect x="3" y="3" width="18" height="18" rx="4" ' + S + ' stroke-width="2.2"/><circle cx="8" cy="8" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="16" cy="16" r="1.8"/>',
  play: '<path d="M7 4.5v15l13-7.5z"/>',
  globe: '<circle cx="12" cy="12" r="9" ' + S + ' stroke-width="2.2"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" ' + S + ' stroke-width="2"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2.5"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10" ' + S + ' stroke-width="2.4"/>',
  skip: '<path d="M5 5l9 7-9 7z"/><path d="M18 5v14" ' + S + ' stroke-width="2.6"/>',
  ear: '<path d="M7 9a5 5 0 0 1 10 0c0 3-3 4-3.5 6.5S12 20 10 20" ' + S + ' stroke-width="2.4"/><path d="M10 10a2 2 0 0 1 4 0" ' + S + ' stroke-width="2.2"/>'
};

/* icon('check') returns an SVG string. It is hidden from screen readers; label the button instead. */
function icon(name){
  return '<svg class="ic ic-' + name + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">' + (PATHS[name] || '') + '</svg>';
}

LR.icons = { get: icon, names: Object.keys(PATHS) };
})();
