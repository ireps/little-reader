/* The built-in course, part 2: Letters and Sounds Phase 5 (new graphemes, split digraphs, ow two ways).
   Original text, written for this app. See data/units.js for the format. */
LR.units.push(
  {
    id: 'p5-01', phase: 5, theme: 'weather', title: 'ay, ou', sounds: ['ay', 'ou'],
    words: ['day', 'play', 'tray', 'clay', 'spray', 'cloud', 'shout', 'mouth', 'round', 'found'],
    tricky: ['people'],
    stories: [
      { id: 'p5-01a', title: 'Play day', s: [
        'It is a hot day.',
        'Raj and Meena play out in the sun.',
        'A big cloud is up in the sky.',
        'Then it rains!',
        'They shout and run in.'
      ], q: [{ q: 'What do they do in the sun?', a: 'play', opts: ['play', 'shout', 'spray'] }] },
      { id: 'p5-01b', title: 'Clay', s: [
        'Meena has a lump of clay.',
        'She rolls it round and round.',
        'It is a clay mouse!',
        'It has a round mouth.',
        'People clap for her clay mouse.'
      ], q: [{ q: 'What does Meena make with the clay?', a: 'mouse', opts: ['mouse', 'cloud', 'tray'] }] }
    ],
    silly: [
      { s: 'You can play in the sun.', ok: true }, { s: 'A cloud can shout.', ok: false },
      { s: 'A cloud is up in the sky.', ok: true }, { s: 'A tray can play.', ok: false },
      { s: 'You can shout.', ok: true }, { s: 'Clay can run round the town.', ok: false },
      { s: 'A tray can hold a cup.', ok: true }, { s: 'A mouth is on a foot.', ok: false }
    ]
  },
  {
    id: 'p5-02', phase: 5, theme: 'plants', title: 'ie, ea', sounds: ['ie', 'ea'],
    words: ['pie', 'tie', 'cried', 'dried', 'sea', 'eat', 'leaf', 'dream', 'team', 'beach'],
    tricky: ['could'],
    stories: [
      { id: 'p5-02a', title: 'At the beach', s: [
        'We went to the beach.',
        'The sea was green.',
        'Raj could see a crab on a rock.',
        'Meena had a pie to eat.',
        'Then we all had a nap.'
      ], q: [{ q: 'What does Raj see on a rock?', a: 'crab', opts: ['crab', 'pie', 'leaf'] }] },
      { id: 'p5-02b', title: 'The leaf', s: [
        'A leaf fell in the stream.',
        'It was a green leaf.',
        'It went past a team of ducks.',
        'The ducks cried, "Quack!"',
        'The leaf dried in the sun.'
      ], q: [{ q: 'What fell in the stream?', a: 'leaf', opts: ['leaf', 'pie', 'tie'] }] }
    ],
    silly: [
      { s: 'You can eat a pie.', ok: true }, { s: 'A pie can swim in the sea.', ok: false },
      { s: 'A leaf is green.', ok: true }, { s: 'A leaf can eat a bun.', ok: false },
      { s: 'Dad has a red tie.', ok: true }, { s: 'A tie can cry.', ok: false },
      { s: 'The sea is wet.', ok: true }, { s: 'The beach can dream.', ok: false }
    ]
  },
  {
    id: 'p5-03', phase: 5, theme: 'body', title: 'oy, ir', sounds: ['oy', 'ir'],
    words: ['boy', 'toy', 'joy', 'bird', 'girl', 'shirt', 'first', 'third', 'skirt', 'stir'],
    tricky: ['called', 'asked'],
    stories: [
      { id: 'p5-03a', title: 'The toy bird', s: [
        'A boy had a toy bird.',
        'The bird was red with a long tail.',
        'A girl asked, "Can I play?"',
        'The boy said yes.',
        'They had lots of fun.'
      ], q: [{ q: 'What toy has the boy got?', a: 'bird', opts: ['bird', 'girl', 'shirt'] }] },
      { id: 'p5-03b', title: 'First', s: [
        'Meena called out, "I am first!"',
        'Raj was third.',
        'Meena had a red shirt.',
        'Raj had dirt on his shirt.',
        'But they both had fun.'
      ], q: [{ q: 'Who was first?', a: 'Meena', opts: ['Meena', 'Raj', 'Dad'] }] }
    ],
    silly: [
      { s: 'A bird can fly.', ok: true }, { s: 'A toy can eat a bird.', ok: false },
      { s: 'A girl can play.', ok: true }, { s: 'A shirt can fly.', ok: false },
      { s: 'You can stir a pot.', ok: true }, { s: 'The bird is in her cup of tea.', ok: false },
      { s: 'You can get dirt on a shirt.', ok: true }, { s: 'A boy is a bird.', ok: false }
    ]
  },
  {
    id: 'p5-04', phase: 5, theme: 'plants', title: 'ue, ew, aw', sounds: ['ue', 'ew', 'aw'],
    words: ['blue', 'glue', 'true', 'clue', 'new', 'few', 'grew', 'saw', 'paw', 'draw'],
    tricky: ['looked'],
    stories: [
      { id: 'p5-04a', title: 'Draw', s: [
        'Meena can draw.',
        'She drew a blue cat.',
        'The cat had a big paw.',
        'Raj looked at it.',
        'Is it a true cat? No!'
      ], q: [{ q: 'What did Meena draw?', a: 'cat', opts: ['cat', 'dog', 'paw'] }] },
      { id: 'p5-04b', title: 'The new plant', s: [
        'Nani has a new plant.',
        'It grew and grew.',
        'Raj saw a few buds on it.',
        'Then it had blue flowers.',
        'Raj looked and looked.'
      ], q: [{ q: 'What colour are the flowers?', a: 'blue', opts: ['blue', 'red', 'green'] }] }
    ],
    silly: [
      { s: 'The sky is blue.', ok: true }, { s: 'A paw can draw a blue sun.', ok: false },
      { s: 'A cat has a paw.', ok: true }, { s: 'Glue can grow.', ok: false },
      { s: 'You can draw with a pen.', ok: true }, { s: 'A new hat can fly to the moon.', ok: false },
      { s: 'Glue is sticky.', ok: true }, { s: 'A few cows can draw.', ok: false }
    ]
  },
  {
    id: 'p5-05', phase: 5, theme: 'animals', title: 'wh, ph, au, oe', sounds: ['wh', 'ph', 'au', 'oe'],
    words: ['whip', 'wheel', 'which', 'whisk', 'dolphin', 'graph', 'toe', 'goes', 'haul', 'launch'],
    tricky: ['water'],
    stories: [
      { id: 'p5-05a', title: 'The dolphin', s: [
        'A dolphin is in the water.',
        'It goes up and down.',
        'Which way will it go?',
        'It jumps! Splash!',
        'Meena and Raj cheer.'
      ], q: [{ q: 'What is in the water?', a: 'dolphin', opts: ['dolphin', 'wheel', 'toe'] }] },
      { id: 'p5-05b', title: 'The wheel', s: [
        'Dad has a cart with a big wheel.',
        'Raj and Meena haul it up the hill.',
        'Then it goes down fast!',
        'Ouch! It hits Raj on his toe.',
        'Raj is all right.'
      ], q: [{ q: 'What did the wheel hit?', a: 'toe', opts: ['toe', 'paw', 'dolphin'] }] }
    ],
    silly: [
      { s: 'A dolphin can swim.', ok: true }, { s: 'A whip can eat lunch.', ok: false },
      { s: 'A wheel goes round.', ok: true }, { s: 'A dolphin can haul a cart up a hill.', ok: false },
      { s: 'You have a toe.', ok: true }, { s: 'A wheel is in her ear.', ok: false },
      { s: 'Water is wet.', ok: true }, { s: 'Water is dry.', ok: false }
    ]
  },
  {
    id: 'p5-06', phase: 5, theme: 'food', title: 'a_e (cake)', sounds: ['a_e'],
    words: ['cake', 'make', 'gate', 'game', 'plate', 'snake', 'name', 'lake', 'made', 'shape'],
    tricky: ['where'],
    stories: [
      { id: 'p5-06a', title: 'The cake', s: [
        'Mum made a cake.',
        'Raj and Meena play a game.',
        'Where is the cake?',
        'It is on a plate by the gate.',
        'They all had cake.'
      ], q: [{ q: 'What did Mum make?', a: 'cake', opts: ['cake', 'game', 'plate'] }] },
      { id: 'p5-06b', title: 'The lake', s: [
        'We went to the lake.',
        'A snake was on a rock.',
        'Its shape was long and thin.',
        'It made a hiss and went into the lake.',
        'We gave it lots of space.'
      ], q: [{ q: 'Where did the snake go?', a: 'lake', opts: ['lake', 'gate', 'cake'] }] }
    ],
    silly: [
      { s: 'You can eat cake.', ok: true }, { s: 'A gate can bake a cake.', ok: false },
      { s: 'A snake has no legs.', ok: true }, { s: 'A snake can play a game of chess.', ok: false },
      { s: 'A plate can hold a cake.', ok: true }, { s: 'A lake is in a cup.', ok: false },
      { s: 'You can play a game.', ok: true }, { s: 'A plate can name a snake.', ok: false }
    ]
  },
  {
    id: 'p5-07', phase: 5, theme: 'transport', title: 'i_e (kite)', sounds: ['i_e'],
    words: ['kite', 'bike', 'time', 'five', 'line', 'smile', 'ride', 'slide', 'white', 'shine'],
    tricky: ['who'],
    stories: [
      { id: 'p5-07a', title: 'The kite', s: [
        'Raj has a white kite.',
        'It is time to fly it.',
        'The kite goes up, up, up!',
        'Who is that? It is Meena on her bike.',
        'She has a big smile.'
      ], q: [{ q: 'What colour is the kite?', a: 'white', opts: ['white', 'blue', 'red'] }] },
      { id: 'p5-07b', title: 'The slide', s: [
        'Meena likes the slide.',
        'She goes down five times.',
        'Then she rides her bike.',
        'The sun shines on her.',
        'What a fine time!'
      ], q: [{ q: 'What does Meena go down?', a: 'slide', opts: ['slide', 'kite', 'line'] }] }
    ],
    silly: [
      { s: 'You can ride a bike.', ok: true }, { s: 'A bike can smile.', ok: false },
      { s: 'A kite can fly.', ok: true }, { s: 'A kite can ride a bike.', ok: false },
      { s: 'The sun can shine.', ok: true }, { s: 'Five white mice can drive a bus.', ok: false },
      { s: 'Five is a number.', ok: true }, { s: 'The slide is in the sky.', ok: false }
    ]
  },
  {
    id: 'p5-08', phase: 5, theme: 'helpers', title: 'o_e (home)', sounds: ['o_e'],
    words: ['home', 'bone', 'rope', 'note', 'nose', 'stone', 'hope', 'those', 'woke', 'broke'],
    tricky: ['again'],
    stories: [
      { id: 'p5-08a', title: 'The bone', s: [
        'A dog had a bone.',
        'It hid the bone by a stone.',
        'Then it had a nap and woke up.',
        'Where was the bone?',
        'It dug and dug, and it got the bone again.'
      ], q: [{ q: 'What did the dog hide?', a: 'bone', opts: ['bone', 'rope', 'stone'] }] },
      { id: 'p5-08b', title: 'Home', s: [
        'Nani rode home on a bus.',
        'Raj and Meena were at home.',
        'They had a note for her.',
        'It said, "Hello Nani!"',
        'Nani gave them a big hug.'
      ], q: [{ q: 'Who came home on a bus?', a: 'Nani', opts: ['Nani', 'Mum', 'Raj'] }] }
    ],
    silly: [
      { s: 'A dog can dig for a bone.', ok: true }, { s: 'A stone can smile.', ok: false },
      { s: 'You have a nose.', ok: true }, { s: 'A rope can eat a bone.', ok: false },
      { s: 'You can skip with a rope.', ok: true }, { s: 'A nose is on a toe.', ok: false },
      { s: 'A stone is hard.', ok: true }, { s: 'A home can run to the shop.', ok: false }
    ]
  },
  {
    id: 'p5-09', phase: 5, theme: 'body', title: 'u_e and e_e (cube, these)', sounds: ['u_e', 'e_e'],
    words: ['cube', 'tube', 'flute', 'huge', 'mule', 'use', 'these', 'rude', 'tune', 'prune'],
    tricky: ['any'],
    stories: [
      { id: 'p5-09a', title: 'The flute', s: [
        'Pete has a flute.',
        'He plays a huge tune.',
        'A mule hears it.',
        'It stops to look.',
        'Is there any more?'
      ], q: [{ q: 'What does Pete play?', a: 'flute', opts: ['flute', 'tube', 'cube'] }] },
      { id: 'p5-09b', title: 'Cubes', s: [
        'Meena has these cubes.',
        'She makes a huge tower.',
        'Then it falls!',
        'Meena is not upset.',
        'She makes it again.'
      ], q: [{ q: 'What does Meena make?', a: 'tower', opts: ['tower', 'flute', 'mule'] }] }
    ],
    silly: [
      { s: 'You can play a tune on a flute.', ok: true }, { s: 'A cube can play a flute.', ok: false },
      { s: 'A cube has six sides.', ok: true }, { s: 'A mule can fly to the moon.', ok: false },
      { s: 'A mule can carry things.', ok: true }, { s: 'These cubes can sing.', ok: false },
      { s: 'You can use a tube of glue.', ok: true }, { s: 'A huge mule is in a cup.', ok: false }
    ]
  },
  {
    id: 'p5-10', phase: 5, theme: 'weather', title: 'ow two ways: snow and cow', sounds: ['ow'],
    words: ['snow', 'grow', 'show', 'slow', 'blow', 'cow', 'now', 'how', 'town', 'down'],
    tricky: ['work'],
    stories: [
      { id: 'p5-10a', title: 'Snow', s: [
        'It is snowing on the hills.',
        'Meena and Raj go out.',
        'They make a snowman.',
        'A cow looks at it. Moo!',
        'The snowman is slow to melt.'
      ], q: [{ q: 'What do they make?', a: 'snowman', opts: ['snowman', 'cow', 'town'] }] },
      { id: 'p5-10b', title: 'The town', s: [
        'We went down to the town.',
        'There was a big show.',
        'A man can blow a huge horn.',
        'How fun it was!',
        'Now we go home.'
      ], q: [{ q: 'Where did we go?', a: 'town', opts: ['town', 'snow', 'cow'] }] }
    ],
    silly: [
      { s: 'A cow can moo.', ok: true }, { s: 'A cow can grow in a pot.', ok: false },
      { s: 'Snow is cold.', ok: true }, { s: 'Snow is hot.', ok: false },
      { s: 'Plants grow.', ok: true }, { s: 'A town can blow.', ok: false },
      { s: 'You can blow on hot milk.', ok: true }, { s: 'A snail can drive a car.', ok: false }
    ]
  },
  {
    id: 'p5-11', phase: 5, theme: 'animals', title: 'y (happy, fly) and ey (key)', sounds: ['y', 'ey'],
    words: ['happy', 'funny', 'sunny', 'puppy', 'fly', 'sky', 'try', 'why', 'key', 'monkey'],
    tricky: ['mr', 'mrs'],
    stories: [
      { id: 'p5-11a', title: 'The monkey', s: [
        'It is a sunny day.',
        'A funny monkey is up a tree.',
        'Why is it so happy?',
        'It has a key!',
        'Mr Sharma wants his key back.'
      ], q: [{ q: 'What has the monkey got?', a: 'key', opts: ['key', 'fly', 'puppy'] }] },
      { id: 'p5-11b', title: 'The puppy', s: [
        'Mrs Rao has a puppy.',
        'It can try to catch a fly.',
        'It jumps up high.',
        'It is a funny puppy.',
        'We are happy to see it.'
      ], q: [{ q: 'What does the puppy try to catch?', a: 'fly', opts: ['fly', 'key', 'sky'] }] }
    ],
    silly: [
      { s: 'A fly can fly.', ok: true }, { s: 'A monkey can drive a bus.', ok: false },
      { s: 'A puppy is a dog.', ok: true }, { s: 'A key can fly in the sky.', ok: false },
      { s: 'A key can open a lock.', ok: true }, { s: 'A puppy can try to read.', ok: false },
      { s: 'A sunny day is hot.', ok: true }, { s: 'The sky is in a box.', ok: false }
    ]
  },
  {
    id: 'p5-12', phase: 5, theme: 'animals', title: 'Review: ai, ay, oi, oy, ou, ow', sounds: [],
    words: ['paint', 'spray', 'coin', 'enjoy', 'mouth', 'brown', 'soil', 'owl', 'frown', 'cloud'],
    tricky: ['because'],
    stories: [
      { id: 'p5-12a', title: 'The owl', s: [
        'A brown owl is in the tree.',
        'It sees a mouse on the soil.',
        'The mouse runs into a hole.',
        'The owl has to wait, because the mouse is in its hole.',
        'Then the owl goes to sleep.'
      ], q: [{ q: 'What did the owl see?', a: 'mouse', opts: ['mouse', 'coin', 'paint'] }] },
      { id: 'p5-12b', title: 'Paint', s: [
        'Meena enjoys paint.',
        'She paints a brown cow.',
        'Raj sprays paint on a box.',
        'Oops! Paint is on his mouth!',
        'They both enjoy a funny day.'
      ], q: [{ q: 'What did Meena paint?', a: 'cow', opts: ['cow', 'owl', 'box'] }] }
    ],
    silly: [
      { s: 'An owl can fly at night.', ok: true }, { s: 'An owl can paint a cow.', ok: false },
      { s: 'You can paint with a brush.', ok: true }, { s: 'A coin can enjoy a song.', ok: false },
      { s: 'A coin is round.', ok: true }, { s: 'Soil is good to eat.', ok: false },
      { s: 'Plants grow in soil.', ok: true }, { s: 'A brown cow can fly.', ok: false }
    ]
  }
);
