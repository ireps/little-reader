/* Pictures for words, and the language tasks that use them.
   Emoji only from Unicode 6.0/6.1 (the tablet's Android 5.1 font draws these); tests/run.js checks the code points.
   A word without a picture never appears in a picture task. */
LR.pictures = {
  frog: '🐸', fish: '🐟', dog: '🐶', puppy: '🐶', cat: '🐱', pig: '🐷', hen: '🐔', cow: '🐄', goat: '🐐', sheep: '🐑',
  snail: '🐌', snake: '🐍', bee: '🐝', ant: '🐜', bird: '🐦', chick: '🐤', mouse: '🐭', rat: '🐀', monkey: '🐒',
  tiger: '🐯', elephant: '🐘', octopus: '🐙', shell: '🐚', whale: '🐳', dolphin: '🐬', shrimp: '🍤', bug: '🐛',
  sun: '🌞', moon: '🌙', star: '⭐', rain: '☔', snowman: '⛄', tree: '🌳', leaf: '🍃', rose: '🌹', plant: '🌱',
  corn: '🌽', apple: '🍎', pear: '🍐', grapes: '🍇', lemon: '🍋', banana: '🍌', cake: '🍰', bun: '🍞', egg: '🍳',
  rice: '🍚', cherry: '🍒', nut: '🌰', sweet: '🍬', cup: '☕', drink: '🍹', fork: '🍴',
  house: '🏠', home: '🏠', car: '🚗', bus: '🚌', train: '🚆', ship: '🚢', boat: '⛵', bike: '🚲', rocket: '🚀', truck: '🚚',
  book: '📖', bell: '🔔', key: '🔑', lock: '🔒', lamp: '💡', light: '💡', clock: '⏰', watch: '⌚', bag: '👜', hat: '🎩',
  boot: '👢', shoe: '👞', ring: '💍', crown: '👑', ball: '⚽', gift: '🎁', box: '📦', tent: '⛺', flag: '🚩',
  hand: '✋', foot: '👣', ear: '👂', nose: '👃', mouth: '👄', thumb: '👍', clap: '👏', baby: '👶', girl: '👧', boy: '👦',
  globe: '🌐', kitten: '🐱', rabbit: '🐰', shirt: '👕', dress: '👗', horn: '📯', paint: '🎨', game: '🎮', swim: '🏊', grin: '😁', glad: '😀', smile: '😀'
};

/* Rhyming pairs with pictures: she hears the first and finds the picture that rhymes. */
LR.lang = {
  rhymes: [['cat', 'hat'], ['dog', 'frog'], ['bee', 'tree'], ['car', 'star'], ['cake', 'snake'], ['bell', 'shell'],
    ['house', 'mouse'], ['boat', 'goat'], ['rain', 'train'], ['clock', 'lock']],
  /* "a" or "an" before a picture word. */
  an: ['apple', 'egg', 'ant', 'octopus', 'elephant'],
  a: ['cat', 'dog', 'bus', 'hat', 'book', 'ship', 'cake', 'bell'],
  /* One or many: words that take a plain -s. */
  plural: ['cat', 'dog', 'bee', 'star', 'cake', 'ball', 'book', 'bird', 'hat', 'car'],
  /* Where is the ball? Each sentence is matched to a drawn scene. */
  position: { 'in': 'The ball is in the box.', on: 'The ball is on the box.', under: 'The ball is under the box.' }
};
