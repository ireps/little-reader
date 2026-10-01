/* The built-in course, part 3: mixed review after Phase 5, then early Phase 6 suffixes (-s/-es, -ing, -ed, -er/-est)
   on roots whose spelling does not change. Original text, written for this app. See data/units.js for the format.
   A unit's `suffixes` are taught from that unit on; words built with them are checked as root + suffix. */
LR.units.push(
  {
    id: 'p5-r1', phase: 5, theme: 'seasons', title: 'Review: blends with ai, ee, oa, ea, ou, ow', sounds: [],
    words: ['spray', 'cream', 'stream', 'sprout', 'throat', 'crown', 'squeak', 'scream', 'trail', 'sweet'],
    tricky: ['once'],
    stories: [
      { id: 'p5-r1a', title: 'Ice cream', theme: 'seasons', s: [
        'It is a hot summer day.',
        'Once a week, we get ice cream.',
        'Raj gets a pink cream cone.',
        'It drips down his chin!',
        'Raj licks it up fast.'
      ], q: [
        { q: 'Who gets a pink cone?', a: 'Raj', opts: ['Raj', 'Meena', 'Dad'] },
        { q: 'Where does it drip?', a: 'down his chin', opts: ['down his chin', 'on the cat', 'in the stream'] },
        { q: 'What happened first?', a: 'Raj gets a cone', opts: ['Raj gets a cone', 'It drips down his chin', 'Raj licks it'], first: true }
      ] },
      { id: 'p5-r1b', title: 'The stream', theme: 'animals', s: [
        'A stream runs by the trail.',
        'Meena and Dad sit by it.',
        'Squeak! A mouse runs past.',
        'Meena jumps up.',
        'Then the mouse is in a hole.'
      ], q: [
        { q: 'What runs past?', a: 'a mouse', opts: ['a mouse', 'a crown', 'a stream'] },
        { q: 'Who sits with Dad?', a: 'Meena', opts: ['Meena', 'Raj', 'Nani'] },
        { q: 'What happened first?', a: 'They sit by the stream', opts: ['They sit by the stream', 'A mouse runs past', 'The mouse is in a hole'], first: true }
      ] },
      { id: 'p5-r1c', title: 'The play', theme: 'festivals', s: [
        'We have a play at the fair.',
        'Raj is the king.',
        'He has a gold crown.',
        'Meena is the queen.',
        'Once the play ends, we all cheer.'
      ], q: [
        { q: 'Who is the king?', a: 'Raj', opts: ['Raj', 'Meena', 'Dad'] },
        { q: 'What has Raj got on?', a: 'a crown', opts: ['a crown', 'a coat', 'a cream cone'] },
        { q: 'What happened first?', a: 'Raj is the king', opts: ['Raj is the king', 'Meena is the queen', 'We all cheer'], first: true }
      ] },
      { id: 'p5-r1d', title: 'Sore throat', theme: 'family', s: [
        'Nani has a sore throat.',
        'She can not speak.',
        'Meena makes her a hot drink.',
        'Raj reads to her.',
        'Soon Nani is well again.'
      ], q: [
        { q: 'Who has a sore throat?', a: 'Nani', opts: ['Nani', 'Raj', 'Meena'] },
        { q: 'What does Meena make?', a: 'a hot drink', opts: ['a hot drink', 'a crown', 'a cake'] },
        { q: 'What happened first?', a: 'Nani has a sore throat', opts: ['Nani has a sore throat', 'Meena makes a drink', 'Nani is well again'], first: true }
      ] }
    ],
    near: [['spray', 'spin', 'spot'], ['cream', 'crown', 'crab'], ['stream', 'street', 'strap']],
    silly: [
      { s: 'You can eat ice cream.', ok: true }, { s: 'A crown can sing.', ok: false },
      { s: 'A mouse can squeak.', ok: true }, { s: 'A stream can scream.', ok: false },
      { s: 'Sweets are sweet.', ok: true }, { s: 'A throat is on your toe.', ok: false },
      { s: 'You can spray water.', ok: true }, { s: 'A trail can eat cream.', ok: false }
    ]
  },
  {
    id: 'p5-r2', phase: 5, theme: 'transport', title: 'Review: blends with a_e, i_e, o_e', sounds: [],
    words: ['skate', 'stripe', 'globe', 'smoke', 'brave', 'spine', 'plane', 'crane', 'prize', 'trade'],
    tricky: ['friend'],
    stories: [
      { id: 'p5-r2a', title: 'The plane', theme: 'transport', s: [
        'Raj and his friend Sam see a plane.',
        'It is white with a blue stripe.',
        'It goes up into the sky.',
        'Sam said, "I will fly a plane one day."',
        'Raj said, "And I will be brave like you!"'
      ], q: [
        { q: 'What do they see?', a: 'a plane', opts: ['a plane', 'a crane', 'a globe'] },
        { q: 'What colour is the stripe?', a: 'blue', opts: ['blue', 'red', 'pink'] },
        { q: 'What happened first?', a: 'They see a plane', opts: ['They see a plane', 'It goes up into the sky', 'Sam will fly a plane'], first: true }
      ] },
      { id: 'p5-r2b', title: 'The prize', theme: 'school', s: [
        'In class, we have a quiz.',
        'Miss Jain has a globe.',
        'Meena can name six lands on it.',
        'She gets the prize!',
        'It is a gold star.'
      ], q: [
        { q: 'Who gets the prize?', a: 'Meena', opts: ['Meena', 'Raj', 'Sam'] },
        { q: 'What is the prize?', a: 'a gold star', opts: ['a gold star', 'a globe', 'a cake'] },
        { q: 'What happened first?', a: 'We have a quiz', opts: ['We have a quiz', 'Meena gets the prize', 'It is a gold star'], first: true }
      ] },
      { id: 'p5-r2c', title: 'Toast', theme: 'safety', s: [
        'Nani makes toast.',
        'Then we see smoke!',
        'The toast is black.',
        'Nani said, "Do not grab the hot plate."',
        'She made new toast, and we ate it with jam.'
      ], q: [
        { q: 'What did they see?', a: 'smoke', opts: ['smoke', 'a plane', 'a globe'] },
        { q: 'Who makes toast?', a: 'Nani', opts: ['Nani', 'Mum', 'Raj'] },
        { q: 'What happened first?', a: 'Nani makes toast', opts: ['Nani makes toast', 'The toast is black', 'We ate it with jam'], first: true }
      ] },
      { id: 'p5-r2d', title: 'Skate', theme: 'family', s: [
        'Dad and Meena go to skate.',
        'Meena trips on the ice.',
        'She is brave and gets up.',
        'Dad holds her hand.',
        'Now she can skate like a pro!'
      ], q: [
        { q: 'Who holds her hand?', a: 'Dad', opts: ['Dad', 'Mum', 'Sam'] },
        { q: 'What does Meena trip on?', a: 'ice', opts: ['ice', 'a stone', 'a rope'] },
        { q: 'What happened first?', a: 'Meena trips', opts: ['Meena trips', 'She gets up', 'She can skate'], first: true }
      ] }
    ],
    near: [['skate', 'skip', 'skin'], ['plane', 'plan', 'plum'], ['smoke', 'smell', 'smack']],
    silly: [
      { s: 'A plane can fly.', ok: true }, { s: 'A globe can skate.', ok: false },
      { s: 'Smoke is from a fire.', ok: true }, { s: 'A spine can sing.', ok: false },
      { s: 'You can win a prize.', ok: true }, { s: 'A stripe can trade a plane.', ok: false },
      { s: 'You can skate on ice.', ok: true }, { s: 'Toast can be brave.', ok: false }
    ]
  },
  {
    id: 'p6-01', phase: 6, theme: 'home', title: 'One and more: -s and -es', sounds: [], suffixes: ['es'],
    words: ['cats', 'dogs', 'hens', 'boxes', 'foxes', 'dishes', 'wishes', 'brushes', 'benches', 'lunches'],
    tricky: ['school'],
    stories: [
      { id: 'p6-01a', title: 'Lunch at school', theme: 'school', s: [
        'At school, we eat lunch at the benches.',
        'Raj has a big lunch.',
        'Sam and Meena have lunch boxes.',
        'We wash the dishes.',
        'Then we run out to play.'
      ], q: [
        { q: 'Where do we eat?', a: 'at the benches', opts: ['at the benches', 'in the boxes', 'at the beach'] },
        { q: 'Who have lunch boxes?', a: 'Sam and Meena', opts: ['Sam and Meena', 'Raj', 'Miss Jain'] },
        { q: 'What happened first?', a: 'We eat lunch', opts: ['We eat lunch', 'We wash the dishes', 'We run out to play'], first: true }
      ] },
      { id: 'p6-01b', title: 'Foxes', theme: 'animals', s: [
        'Three foxes are in the woods.',
        'At night, they sniff the bins.',
        'They get bits of food.',
        'The hens are in boxes, safe and still.',
        'The foxes run back to the woods.'
      ], q: [
        { q: 'What do the foxes sniff?', a: 'the bins', opts: ['the bins', 'the hens', 'the dishes'] },
        { q: 'How many foxes are there?', a: 'three', opts: ['three', 'six', 'one'] },
        { q: 'What happened first?', a: 'The foxes sniff the bins', opts: ['The foxes sniff the bins', 'They get bits of food', 'They run back'], first: true }
      ] },
      { id: 'p6-01c', title: 'Wishes', theme: 'festivals', s: [
        'It is Sam’s birthday.',
        'He has a cake.',
        'Sam makes three wishes.',
        'We sing to him.',
        'Then we all have cake on dishes.'
      ], q: [
        { q: 'Whose birthday is it?', a: 'Sam', opts: ['Sam', 'Raj', 'Meena'] },
        { q: 'How many wishes does Sam make?', a: 'three', opts: ['three', 'one', 'six'] },
        { q: 'What happened first?', a: 'Sam makes three wishes', opts: ['Sam makes three wishes', 'We sing to him', 'We all have cake'], first: true }
      ] },
      { id: 'p6-01d', title: 'Brushes', theme: 'home', s: [
        'Mum has three brushes.',
        'One is for the dog.',
        'One is for hair.',
        'One is for teeth.',
        'Which brush is for the dog? The big one!'
      ], q: [
        { q: 'What has Mum got?', a: 'three brushes', opts: ['three brushes', 'three foxes', 'three dishes'] },
        { q: 'Which brush is for the dog?', a: 'the big one', opts: ['the big one', 'the pink one', 'the thin one'] },
        { q: 'What happened first?', a: 'Mum has three brushes', opts: ['Mum has three brushes', 'One is for teeth', 'The big one is for the dog'], first: true }
      ] }
    ],
    near: [['boxes', 'bones', 'books'], ['dishes', 'dogs', 'ducks'], ['benches', 'bells', 'beds']],
    silly: [
      { s: 'Cats can sit on benches.', ok: true }, { s: 'Dishes can run.', ok: false },
      { s: 'Foxes have tails.', ok: true }, { s: 'Boxes can sing.', ok: false },
      { s: 'Hens lay eggs.', ok: true }, { s: 'Brushes can eat lunches.', ok: false },
      { s: 'Dogs can dig.', ok: true }, { s: 'Wishes can swim in a dish.', ok: false }
    ]
  },
  {
    id: 'p6-02', phase: 6, theme: 'family', title: 'Doing words: -ing', sounds: [], suffixes: ['ing'],
    words: ['jumping', 'singing', 'helping', 'playing', 'eating', 'reading', 'fishing', 'camping', 'sleeping', 'looking'],
    tricky: ['put'],
    stories: [
      { id: 'p6-02a', title: 'All day', theme: 'family', s: [
        'In the morning, Dad is reading.',
        'Then Mum and Nani are cooking.',
        'Raj is helping them.',
        'At night, Meena is singing.',
        'And the cat is sleeping!'
      ], q: [
        { q: 'Who is singing?', a: 'Meena', opts: ['Meena', 'Raj', 'Dad'] },
        { q: 'What is the cat doing?', a: 'sleeping', opts: ['sleeping', 'eating', 'jumping'] },
        { q: 'What happened first?', a: 'Dad is reading', opts: ['Dad is reading', 'Raj is helping', 'Meena is singing'], first: true }
      ] },
      { id: 'p6-02b', title: 'Camping', theme: 'seasons', s: [
        'In the winter, we go camping.',
        'Dad and Raj set up the tent.',
        'Meena is looking for sticks.',
        'We sit by the fire, eating and singing.',
        'Then we are sleeping in the tent.'
      ], q: [
        { q: 'What is Meena looking for?', a: 'sticks', opts: ['sticks', 'fish', 'stars'] },
        { q: 'Where are we sleeping?', a: 'in the tent', opts: ['in the tent', 'in the car', 'at school'] },
        { q: 'What happened first?', a: 'Dad and Raj set up the tent', opts: ['Dad and Raj set up the tent', 'Meena is looking for sticks', 'We are sleeping in the tent'], first: true }
      ] },
      { id: 'p6-02c', title: 'Fishing', theme: 'animals', s: [
        'Nani and Raj are fishing at the lake.',
        'Raj is looking at the water.',
        'Splash! A fish is jumping!',
        'Nani said, "Put it back."',
        'Raj puts it back, and it swims off.'
      ], q: [
        { q: 'Who is fishing with Raj?', a: 'Nani', opts: ['Nani', 'Dad', 'Meena'] },
        { q: 'What is jumping?', a: 'a fish', opts: ['a fish', 'a frog', 'a duck'] },
        { q: 'What happened first?', a: 'Raj is looking at the water', opts: ['Raj is looking at the water', 'A fish is jumping', 'Raj puts it back'], first: true }
      ] },
      { id: 'p6-02d', title: 'Crossing', theme: 'safety', s: [
        'We are going to school.',
        'Cars are passing.',
        'We are standing at the side.',
        'We are looking left and right.',
        'Now we are crossing.'
      ], q: [
        { q: 'What are passing?', a: 'cars', opts: ['cars', 'foxes', 'hens'] },
        { q: 'Where are we going?', a: 'to school', opts: ['to school', 'to the lake', 'to bed'] },
        { q: 'What happened first?', a: 'Cars are passing', opts: ['Cars are passing', 'We are looking left and right', 'We are crossing'], first: true }
      ] }
    ],
    near: [['jumping', 'junk', 'jump'], ['singing', 'sing', 'sink'], ['reading', 'read', 'reach']],
    silly: [
      { s: 'A fish can be swimming.', ok: true }, { s: 'A rock is singing.', ok: false },
      { s: 'A cat can be sleeping.', ok: true }, { s: 'A bed is eating lunch.', ok: false },
      { s: 'You can be reading a book.', ok: true }, { s: 'A tent is jumping.', ok: false },
      { s: 'Dad is helping Mum.', ok: true }, { s: 'The sun is fishing.', ok: false }
    ]
  },
  {
    id: 'p6-03', phase: 6, theme: 'helpers', title: 'Done words: -ed', sounds: [], suffixes: ['ed'],
    words: ['jumped', 'helped', 'kicked', 'played', 'rained', 'filled', 'landed', 'painted', 'planted', 'melted'],
    tricky: ['pull'],
    stories: [
      { id: 'p6-03a', title: 'Beans', theme: 'plants', s: [
        'Nani and I planted seeds.',
        'Then it rained.',
        'The seeds grew and grew.',
        'We pulled up weeds.',
        'Now we have green beans!'
      ], q: [
        { q: 'Who planted seeds with me?', a: 'Nani', opts: ['Nani', 'Dad', 'Sam'] },
        { q: 'What did we pull up?', a: 'weeds', opts: ['weeds', 'beans', 'seeds'] },
        { q: 'What happened first?', a: 'We planted seeds', opts: ['We planted seeds', 'It rained', 'We pulled up weeds'], first: true }
      ] },
      { id: 'p6-03b', title: 'The sand pit', theme: 'school', s: [
        'At school, we played in the sand pit.',
        'Meena filled a bucket with sand.',
        'Raj jumped in the pit.',
        'Sand landed on Meena!',
        'Miss Jain helped us clean up.'
      ], q: [
        { q: 'Who filled a bucket?', a: 'Meena', opts: ['Meena', 'Raj', 'Miss Jain'] },
        { q: 'What landed on Meena?', a: 'sand', opts: ['sand', 'rain', 'paint'] },
        { q: 'What happened first?', a: 'Meena filled a bucket', opts: ['Meena filled a bucket', 'Raj jumped in', 'Miss Jain helped us'], first: true }
      ] },
      { id: 'p6-03c', title: 'The fire crew', theme: 'helpers', s: [
        'A cat was stuck up a tree.',
        'It cried and cried.',
        'The fire crew came.',
        'They pulled out a long ladder.',
        'They helped the cat down.'
      ], q: [
        { q: 'Who helped the cat?', a: 'the fire crew', opts: ['the fire crew', 'the vet', 'Nani'] },
        { q: 'Where was the cat?', a: 'up a tree', opts: ['up a tree', 'in a box', 'on a bus'] },
        { q: 'What happened first?', a: 'The cat cried', opts: ['The cat cried', 'The fire crew came', 'They helped it down'], first: true }
      ] },
      { id: 'p6-03d', title: 'Melted', theme: 'seasons', s: [
        'It was a hot summer day.',
        'Raj had an ice lolly.',
        'He played in the sun.',
        'The lolly melted!',
        'It landed on his feet.'
      ], q: [
        { q: 'What melted?', a: 'the lolly', opts: ['the lolly', 'the snow', 'the cake'] },
        { q: 'Where did it land?', a: 'on his feet', opts: ['on his feet', 'on the cat', 'on the bus'] },
        { q: 'What happened first?', a: 'Raj had an ice lolly', opts: ['Raj had an ice lolly', 'He played in the sun', 'It landed on his feet'], first: true }
      ] }
    ],
    near: [['played', 'plan', 'plum'], ['melted', 'mess', 'men'], ['landed', 'lamp', 'lap']],
    silly: [
      { s: 'It rained, and the street got wet.', ok: true }, { s: 'The cake played a game.', ok: false },
      { s: 'Nani planted seeds.', ok: true }, { s: 'A rock painted a cat.', ok: false },
      { s: 'Snow melted in the sun.', ok: true }, { s: 'The moon kicked a bus.', ok: false },
      { s: 'Dad helped Mum.', ok: true }, { s: 'The bed jumped on a frog.', ok: false }
    ]
  },
  {
    id: 'p6-04', phase: 6, theme: 'animals', title: 'More and most: -er and -est', sounds: [], suffixes: ['er', 'est'],
    words: ['faster', 'fastest', 'longer', 'longest', 'quicker', 'quickest', 'softer', 'softest', 'thicker', 'thickest'],
    tricky: ['full'],
    stories: [
      { id: 'p6-04a', title: 'The race', theme: 'animals', s: [
        'A dog and a cat run a race.',
        'The dog is fast.',
        'The cat is faster!',
        'But the fox is the fastest of all.',
        'The fox gets the prize.'
      ], q: [
        { q: 'Who is the fastest?', a: 'the fox', opts: ['the fox', 'the dog', 'the cat'] },
        { q: 'What does the fox get?', a: 'the prize', opts: ['the prize', 'a bone', 'a fish'] },
        { q: 'What happened first?', a: 'The dog is fast', opts: ['The dog is fast', 'The cat is faster', 'The fox gets the prize'], first: true }
      ] },
      { id: 'p6-04b', title: 'Strings', theme: 'school', s: [
        'Miss Jain has three strings.',
        'The red string is long.',
        'The blue string is longer.',
        'The green string is the longest.',
        'We tie them in a line.'
      ], q: [
        { q: 'Which string is the longest?', a: 'green', opts: ['green', 'red', 'blue'] },
        { q: 'Who has three strings?', a: 'Miss Jain', opts: ['Miss Jain', 'Meena', 'Dad'] },
        { q: 'What happened first?', a: 'The red string is long', opts: ['The red string is long', 'The green string is longest', 'We tie them in a line'], first: true }
      ] },
      { id: 'p6-04c', title: 'Soft', theme: 'home', s: [
        'Meena has a soft toy rabbit.',
        'Nani has a softer rug.',
        'But the cat is the softest of all.',
        'Meena hugs the cat.',
        'The cat purrs.'
      ], q: [
        { q: 'What is the softest?', a: 'the cat', opts: ['the cat', 'the rug', 'the rabbit'] },
        { q: 'Who hugs the cat?', a: 'Meena', opts: ['Meena', 'Nani', 'Raj'] },
        { q: 'What happened first?', a: 'Meena has a soft rabbit', opts: ['Meena has a soft rabbit', 'Meena hugs the cat', 'The cat purrs'], first: true }
      ] },
      { id: 'p6-04d', title: 'Coats', theme: 'seasons', s: [
        'In winter, we need thick coats.',
        'Raj has a thick coat.',
        'Dad has a thicker coat.',
        'Nani has the thickest coat of all!',
        'We are all snug.'
      ], q: [
        { q: 'Who has the thickest coat?', a: 'Nani', opts: ['Nani', 'Dad', 'Raj'] },
        { q: 'When do we need thick coats?', a: 'in winter', opts: ['in winter', 'in summer', 'at lunch'] },
        { q: 'What happened first?', a: 'Raj has a thick coat', opts: ['Raj has a thick coat', 'Nani has the thickest coat', 'We are all snug'], first: true }
      ] }
    ],
    near: [['faster', 'fast', 'fan'], ['longer', 'long', 'log'], ['softer', 'soft', 'sock']],
    silly: [
      { s: 'A fox is faster than a snail.', ok: true }, { s: 'A snail is the fastest of all.', ok: false },
      { s: 'A rope can be longer than a stick.', ok: true }, { s: 'A rock is softer than a bed.', ok: false },
      { s: 'A full cup has milk in it.', ok: true }, { s: 'A mouse is longer than a train.', ok: false },
      { s: 'A coat can be thick.', ok: true }, { s: 'A brick is softer than a cat.', ok: false }
    ]
  }
);
