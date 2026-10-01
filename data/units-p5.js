/* The built-in course, part 2: Letters and Sounds Phase 5 (new graphemes, split digraphs, ow two ways).
   Original text, written for this app. See data/units.js for the format. */
LR.units.push(
  {
    id: 'p5-01', phase: 5, theme: 'weather', title: 'ay, ou', sounds: ['ay', 'ou'],
    words: ['day', 'play', 'tray', 'clay', 'spray', 'cloud', 'shout', 'mouth', 'round', 'found'],
    tricky: ['people'],
    stories: [
      { id: 'p5-01a', title: 'Play day', theme: 'weather', s: [
        'It is a hot day.',
        'Raj and Meena play out in the sun.',
        'A big cloud is up in the sky.',
        'Then it rains!',
        'They shout and run in.'
      ], q: [
        { q: 'What do they do in the sun?', a: 'play', opts: ['play', 'shout', 'spray'] },
        { q: 'What is up in the sky?', a: 'cloud', opts: ['cloud', 'tray', 'mouth'] },
        { q: 'What happened first?', a: 'Raj and Meena play in the sun', opts: ['Raj and Meena play in the sun', 'Then it rains', 'They shout and run in'], first: true }
      ] },
      { id: 'p5-01b', title: 'Clay', theme: 'home', s: [
        'Meena has a lump of clay.',
        'She rolls it round and round.',
        'It is a clay mouse!',
        'It has a round mouth.',
        'People clap for her clay mouse.'
      ], q: [
        { q: 'What does Meena make with the clay?', a: 'mouse', opts: ['mouse', 'cloud', 'tray'] },
        { q: 'Who claps for the mouse?', a: 'people', opts: ['people', 'cows', 'ducks'] },
        { q: 'What happened first?', a: 'Meena has a lump of clay', opts: ['Meena has a lump of clay', 'She rolls it round', 'People clap for her'], first: true }
      ] },
      { id: 'p5-01c', title: 'The hoop', theme: 'school', s: [
        'We play out in the playground.',
        'Miss Jain has a round hoop.',
        'Raj shouts, "Pass it to me!"',
        'Meena spins the hoop round and round.',
        'Then the bell rings and we run in.'
      ], q: [
        { q: 'Who has a hoop?', a: 'Miss Jain', opts: ['Miss Jain', 'Raj', 'Mum'] },
        { q: 'What do we hear at the end?', a: 'bell', opts: ['bell', 'shout', 'hoop'] },
        { q: 'What happened first?', a: 'Miss Jain has a hoop', opts: ['Miss Jain has a hoop', 'Meena spins the hoop', 'We run in'], first: true }
      ] },
      { id: 'p5-01d', title: 'Stay in', theme: 'seasons', s: [
        'A big dark cloud comes.',
        'It rains all day.',
        'Raj and Meena stay in.',
        'They play with clay on a tray.',
        'Then the sun comes out.'
      ], q: [
        { q: 'What do they play with?', a: 'clay', opts: ['clay', 'cloud', 'spray'] },
        { q: 'Who stays in?', a: 'Raj and Meena', opts: ['Raj and Meena', 'Mum and Dad', 'Nani'] },
        { q: 'What happened first?', a: 'A dark cloud comes', opts: ['A dark cloud comes', 'They play with clay', 'The sun comes out'], first: true }
      ] }
    ],
    near: [['play', 'plan', 'plum'], ['cloud', 'clap', 'clay'], ['shout', 'shop', 'shot']],
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
      { id: 'p5-02a', title: 'At the beach', theme: 'family', s: [
        'We went to the beach.',
        'The sea was green.',
        'Raj could see a crab on a rock.',
        'Meena had a pie to eat.',
        'Then we all had a nap.'
      ], q: [
        { q: 'What does Raj see on a rock?', a: 'crab', opts: ['crab', 'pie', 'leaf'] },
        { q: 'Who had a pie?', a: 'Meena', opts: ['Meena', 'Raj', 'Dad'] },
        { q: 'What happened first?', a: 'We went to the beach', opts: ['We went to the beach', 'Raj could see a crab', 'We all had a nap'], first: true }
      ] },
      { id: 'p5-02b', title: 'The leaf', theme: 'plants', s: [
        'A leaf fell in the stream.',
        'It was a green leaf.',
        'It went past a team of ducks.',
        'The ducks cried, "Quack!"',
        'The leaf dried in the sun.'
      ], q: [
        { q: 'What fell in the stream?', a: 'leaf', opts: ['leaf', 'pie', 'tie'] },
        { q: 'Who cried quack?', a: 'ducks', opts: ['ducks', 'crabs', 'cows'] },
        { q: 'What happened first?', a: 'A leaf fell in the stream', opts: ['A leaf fell in the stream', 'It went past the ducks', 'It dried in the sun'], first: true }
      ] },
      { id: 'p5-02c', title: 'Tea with Nani', theme: 'family', s: [
        'Nani has tea at three.',
        'Meena gets the cups.',
        'Raj gets a dish of treats.',
        'Nani said, "This is a real treat!"',
        'They all eat and chat.'
      ], q: [
        { q: 'Who has tea?', a: 'Nani', opts: ['Nani', 'Dad', 'Mum'] },
        { q: 'What does Meena get?', a: 'cups', opts: ['cups', 'treats', 'pie'] },
        { q: 'What happened first?', a: 'Meena gets the cups', opts: ['Meena gets the cups', 'Raj gets the treats', 'They eat and chat'], first: true }
      ] },
      { id: 'p5-02d', title: 'Book time', theme: 'school', s: [
        'Miss Jain is in class.',
        'She reads to us.',
        'We sit on a mat and keep still.',
        'The book is about a green sea monster.',
        'It is a lot of fun.'
      ], q: [
        { q: 'Who reads to us?', a: 'Miss Jain', opts: ['Miss Jain', 'Nani', 'Raj'] },
        { q: 'What is the book about?', a: 'a sea monster', opts: ['a sea monster', 'a pie', 'a leaf'] },
        { q: 'What happened first?', a: 'Miss Jain reads to us', opts: ['Miss Jain reads to us', 'We sit on a mat', 'It is a lot of fun'], first: true }
      ] }
    ],
    near: [['team', 'teach', 'tent'], ['dream', 'drum', 'dress'], ['beach', 'bench', 'bean']],
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
      { id: 'p5-03a', title: 'The toy bird', theme: 'home', s: [
        'A boy had a toy bird.',
        'The bird was red with a long tail.',
        'A girl asked, "Can I play?"',
        'The boy said yes.',
        'They had lots of fun.'
      ], q: [
        { q: 'What toy has the boy got?', a: 'bird', opts: ['bird', 'girl', 'shirt'] },
        { q: 'Who asked to play?', a: 'girl', opts: ['girl', 'boy', 'bird'] },
        { q: 'What happened first?', a: 'A boy had a toy bird', opts: ['A boy had a toy bird', 'A girl asked to play', 'They had fun'], first: true }
      ] },
      { id: 'p5-03b', title: 'First', theme: 'body', s: [
        'Meena called out, "I am first!"',
        'Raj was third.',
        'Meena had a red shirt.',
        'Raj had dirt on his shirt.',
        'But they both had fun.'
      ], q: [
        { q: 'Who was first?', a: 'Meena', opts: ['Meena', 'Raj', 'Dad'] },
        { q: 'Who had dirt on his shirt?', a: 'Raj', opts: ['Raj', 'Meena', 'Dad'] },
        { q: 'What happened first?', a: 'Meena called out', opts: ['Meena called out', 'Raj had dirt on his shirt', 'They both had fun'], first: true }
      ] },
      { id: 'p5-03c', title: 'Sports day', theme: 'school', s: [
        'It is sports day.',
        'The girls and boys run fast.',
        'Meena is first!',
        'Raj trips, but he is third.',
        'Miss Jain claps for all of them.'
      ], q: [
        { q: 'Who is first?', a: 'Meena', opts: ['Meena', 'Raj', 'Miss Jain'] },
        { q: 'What does Raj do?', a: 'trips', opts: ['trips', 'sings', 'sleeps'] },
        { q: 'What happened first?', a: 'The girls and boys run', opts: ['The girls and boys run', 'Raj trips', 'Miss Jain claps'], first: true }
      ] },
      { id: 'p5-03d', title: 'Too hot', theme: 'safety', s: [
        'Mum has a hot pot.',
        'Raj asked, "Can I stir it?"',
        'Mum said, "No, it is too hot."',
        'So Raj stirs the jam in a jar.',
        'Mum is glad.'
      ], q: [
        { q: 'Who has a hot pot?', a: 'Mum', opts: ['Mum', 'Raj', 'Nani'] },
        { q: 'What does Raj stir?', a: 'jam', opts: ['jam', 'milk', 'soup'] },
        { q: 'What happened first?', a: 'Raj asked to stir it', opts: ['Raj asked to stir it', 'Mum said no', 'Raj stirs the jam'], first: true }
      ] }
    ],
    near: [['bird', 'bin', 'bid'], ['girl', 'grin', 'glad'], ['shirt', 'shut', 'shop']],
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
      { id: 'p5-04a', title: 'Draw', theme: 'home', s: [
        'Meena can draw.',
        'She drew a blue cat.',
        'The cat had a big paw.',
        'Raj looked at it.',
        'Is it a true cat? No!'
      ], q: [
        { q: 'What did Meena draw?', a: 'cat', opts: ['cat', 'dog', 'paw'] },
        { q: 'Who looked at it?', a: 'Raj', opts: ['Raj', 'Meena', 'Mum'] },
        { q: 'What happened first?', a: 'Meena drew a blue cat', opts: ['Meena drew a blue cat', 'Raj looked at it', 'Is it a true cat?'], first: true }
      ] },
      { id: 'p5-04b', title: 'The new plant', theme: 'plants', s: [
        'Nani has a new plant.',
        'It grew and grew.',
        'Raj saw a few buds on it.',
        'Then it had blue flowers.',
        'Raj looked and looked.'
      ], q: [
        { q: 'What colour are the flowers?', a: 'blue', opts: ['blue', 'red', 'green'] },
        { q: 'Who has a new plant?', a: 'Nani', opts: ['Nani', 'Raj', 'Meena'] },
        { q: 'What happened first?', a: 'It grew and grew', opts: ['It grew and grew', 'Raj saw buds', 'It had blue flowers'], first: true }
      ] },
      { id: 'p5-04c', title: 'Glue', theme: 'school', s: [
        'In class we draw.',
        'Raj drew a blue sea.',
        'Meena drew a red sun.',
        'Then we glue on a few stars.',
        'Miss Jain said, "That is true art!"'
      ], q: [
        { q: 'Who drew a blue sea?', a: 'Raj', opts: ['Raj', 'Meena', 'Miss Jain'] },
        { q: 'What do we glue on?', a: 'stars', opts: ['stars', 'paws', 'leaves'] },
        { q: 'What happened first?', a: 'Raj drew a blue sea', opts: ['Raj drew a blue sea', 'We glue on stars', 'Miss Jain said it is art'], first: true }
      ] },
      { id: 'p5-04d', title: 'The kitten', theme: 'family', s: [
        'We have a new kitten.',
        'It has soft paws.',
        'It can chew a string.',
        'Dad saw it nap in a box.',
        'We all looked at it.'
      ], q: [
        { q: 'What do we have?', a: 'kitten', opts: ['kitten', 'duck', 'bird'] },
        { q: 'Who saw it nap?', a: 'Dad', opts: ['Dad', 'Mum', 'Raj'] },
        { q: 'What happened first?', a: 'We have a new kitten', opts: ['We have a new kitten', 'It can chew a string', 'Dad saw it nap'], first: true }
      ] }
    ],
    near: [['blue', 'black', 'bloom'], ['grew', 'grab', 'grin'], ['draw', 'drip', 'drum']],
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
      { id: 'p5-05a', title: 'The dolphin', theme: 'animals', s: [
        'A dolphin is in the water.',
        'It goes up and down.',
        'Which way will it go?',
        'It jumps! Splash!',
        'Meena and Raj cheer.'
      ], q: [
        { q: 'What is in the water?', a: 'dolphin', opts: ['dolphin', 'wheel', 'toe'] },
        { q: 'Who cheers?', a: 'Meena and Raj', opts: ['Meena and Raj', 'Mum and Dad', 'Nani'] },
        { q: 'What happened first?', a: 'It goes up and down', opts: ['It goes up and down', 'It jumps', 'Meena and Raj cheer'], first: true }
      ] },
      { id: 'p5-05b', title: 'The wheel', theme: 'family', s: [
        'Dad has a cart with a big wheel.',
        'Raj and Meena haul it up the hill.',
        'Then it goes down fast!',
        'Ouch! It hits Raj on his toe.',
        'Raj is all right.'
      ], q: [
        { q: 'What did the wheel hit?', a: 'toe', opts: ['toe', 'paw', 'dolphin'] },
        { q: 'Who has a cart?', a: 'Dad', opts: ['Dad', 'Raj', 'Nani'] },
        { q: 'What happened first?', a: 'Raj and Meena haul it up', opts: ['Raj and Meena haul it up', 'It goes down fast', 'It hits Raj on his toe'], first: true }
      ] },
      { id: 'p5-05c', title: 'Deep water', theme: 'safety', s: [
        'We go to the sea.',
        'The water is deep.',
        'Dad said, "Stay with me."',
        'We stay with Dad and splash.',
        'Then we sit on the sand.'
      ], q: [
        { q: 'Who said stay with me?', a: 'Dad', opts: ['Dad', 'Mum', 'Nani'] },
        { q: 'What is deep?', a: 'water', opts: ['water', 'sand', 'toe'] },
        { q: 'What happened first?', a: 'We go to the sea', opts: ['We go to the sea', 'We splash with Dad', 'We sit on the sand'], first: true }
      ] },
      { id: 'p5-05d', title: 'Which sock?', theme: 'home', s: [
        'Meena has three socks.',
        'Which one is hers?',
        'She tries one on her toe.',
        'It is too big!',
        'It is Dad’s sock.'
      ], q: [
        { q: 'What does Meena have?', a: 'socks', opts: ['socks', 'wheels', 'dolphins'] },
        { q: 'Whose sock is it?', a: 'Dad', opts: ['Dad', 'Raj', 'Nani'] },
        { q: 'What happened first?', a: 'Meena has three socks', opts: ['Meena has three socks', 'She tries one on', 'It is too big'], first: true }
      ] }
    ],
    near: [['whip', 'whisk', 'wheel'], ['dolphin', 'doll', 'dog'], ['toe', 'top', 'tub']],
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
      { id: 'p5-06a', title: 'The cake', theme: 'family', s: [
        'Mum made a cake.',
        'Raj and Meena play a game.',
        'Where is the cake?',
        'It is on a plate by the gate.',
        'They all had cake.'
      ], q: [
        { q: 'What did Mum make?', a: 'cake', opts: ['cake', 'game', 'plate'] },
        { q: 'Where is the cake?', a: 'gate', opts: ['gate', 'lake', 'game'] },
        { q: 'What happened first?', a: 'Mum made a cake', opts: ['Mum made a cake', 'They play a game', 'They all had cake'], first: true }
      ] },
      { id: 'p5-06b', title: 'The lake', theme: 'animals', s: [
        'We went to the lake.',
        'A snake was on a rock.',
        'Its shape was long and thin.',
        'It made a hiss and went into the lake.',
        'We gave it lots of space.'
      ], q: [
        { q: 'Where did the snake go?', a: 'lake', opts: ['lake', 'gate', 'cake'] },
        { q: 'What was on a rock?', a: 'snake', opts: ['snake', 'cake', 'game'] },
        { q: 'What happened first?', a: 'A snake was on a rock', opts: ['A snake was on a rock', 'It made a hiss', 'It went into the lake'], first: true }
      ] },
      { id: 'p5-06c', title: 'Eid', theme: 'festivals', s: [
        'It is Eid.',
        'Raj and Meena go to see Sam.',
        'Sam and his mum have made sweets.',
        'Sam gave Raj a plate of them.',
        'Raj said, "Eid Mubarak!"'
      ], q: [
        { q: 'Who do Raj and Meena go to see?', a: 'Sam', opts: ['Sam', 'Nani', 'Kate'] },
        { q: 'What did Sam give Raj?', a: 'sweets', opts: ['sweets', 'cake', 'a game'] },
        { q: 'What happened first?', a: 'Raj and Meena go to see Sam', opts: ['Raj and Meena go to see Sam', 'Sam gave Raj sweets', 'Raj said Eid Mubarak'], first: true }
      ] },
      { id: 'p5-06d', title: 'The name game', theme: 'school', s: [
        'In class we play a name game.',
        'Miss Jain claps, and we say a name.',
        'Raj shouts, "Kate!"',
        'Kate waves at Raj.',
        'Where is Jake? He is late!'
      ], q: [
        { q: 'Who is late?', a: 'Jake', opts: ['Jake', 'Kate', 'Raj'] },
        { q: 'Who waves at Raj?', a: 'Kate', opts: ['Kate', 'Jake', 'Miss Jain'] },
        { q: 'What happened first?', a: 'Miss Jain claps', opts: ['Miss Jain claps', 'Kate waves at Raj', 'Jake is late'], first: true }
      ] }
    ],
    near: [['cake', 'came', 'cane'], ['game', 'gate', 'gave'], ['snake', 'snack', 'snap']],
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
      { id: 'p5-07a', title: 'The kite', theme: 'weather', s: [
        'Raj has a white kite.',
        'It is time to fly it.',
        'The kite goes up, up, up!',
        'Who is that? It is Meena on her bike.',
        'She has a big smile.'
      ], q: [
        { q: 'What colour is the kite?', a: 'white', opts: ['white', 'blue', 'red'] },
        { q: 'Who is on a bike?', a: 'Meena', opts: ['Meena', 'Raj', 'Dad'] },
        { q: 'What happened first?', a: 'It is time to fly it', opts: ['It is time to fly it', 'The kite goes up', 'Meena is on her bike'], first: true }
      ] },
      { id: 'p5-07b', title: 'The slide', theme: 'home', s: [
        'Meena likes the slide.',
        'She goes down five times.',
        'Then she rides her bike.',
        'The sun shines on her.',
        'What a fine time!'
      ], q: [
        { q: 'What does Meena go down?', a: 'slide', opts: ['slide', 'kite', 'line'] },
        { q: 'How many times does Meena go down?', a: 'five', opts: ['five', 'three', 'one'] },
        { q: 'What happened first?', a: 'Meena goes down the slide', opts: ['Meena goes down the slide', 'She rides her bike', 'The sun shines'], first: true }
      ] },
      { id: 'p5-07c', title: 'The new bike', theme: 'safety', s: [
        'Raj has a new bike.',
        'He has a white helmet on.',
        'Dad said, "Ride at the side."',
        'Raj rides at the side.',
        'Then it is time to stop.'
      ], q: [
        { q: 'What colour is the helmet?', a: 'white', opts: ['white', 'red', 'blue'] },
        { q: 'Who said ride at the side?', a: 'Dad', opts: ['Dad', 'Mum', 'Raj'] },
        { q: 'What happened first?', a: 'Raj has a white helmet on', opts: ['Raj has a white helmet on', 'Raj rides at the side', 'It is time to stop'], first: true }
      ] },
      { id: 'p5-07d', title: 'Kite day', theme: 'festivals', s: [
        'It is the kite festival.',
        'Lots of kites are up.',
        'Raj and Dad have a white kite.',
        'Meena has a pink kite.',
        'The kites dip and glide.'
      ], q: [
        { q: 'What colour is Meena’s kite?', a: 'pink', opts: ['pink', 'white', 'blue'] },
        { q: 'Who has the white kite?', a: 'Raj and Dad', opts: ['Raj and Dad', 'Meena', 'Nani'] },
        { q: 'What happened first?', a: 'Lots of kites are up', opts: ['Lots of kites are up', 'Meena has a pink kite', 'The kites dip and glide'], first: true }
      ] }
    ],
    near: [['kite', 'kit', 'kick'], ['bike', 'bite', 'bin'], ['slide', 'slip', 'slim']],
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
      { id: 'p5-08a', title: 'The bone', theme: 'animals', s: [
        'A dog had a bone.',
        'It hid the bone by a stone.',
        'Then it had a nap and woke up.',
        'Where was the bone?',
        'It dug and dug, and it got the bone again.'
      ], q: [
        { q: 'What did the dog hide?', a: 'bone', opts: ['bone', 'rope', 'stone'] },
        { q: 'Where did the dog hide the bone?', a: 'stone', opts: ['stone', 'rope', 'home'] },
        { q: 'What happened first?', a: 'The dog hid the bone', opts: ['The dog hid the bone', 'It had a nap', 'It got the bone again'], first: true }
      ] },
      { id: 'p5-08b', title: 'Home', theme: 'family', s: [
        'Nani rode home on a bus.',
        'Raj and Meena were at home.',
        'They had a note for her.',
        'It said, "Hello Nani!"',
        'Nani gave them a big hug.'
      ], q: [
        { q: 'Who came home on a bus?', a: 'Nani', opts: ['Nani', 'Mum', 'Raj'] },
        { q: 'What did they have for Nani?', a: 'note', opts: ['note', 'rope', 'bone'] },
        { q: 'What happened first?', a: 'Nani rode home on a bus', opts: ['Nani rode home on a bus', 'It said hello Nani', 'Nani gave them a hug'], first: true }
      ] },
      { id: 'p5-08c', title: 'Smoke', theme: 'safety', s: [
        'Smoke! Raj can smell it.',
        'Dad said, "We go out, now!"',
        'They wait by the gate.',
        'A fire truck comes.',
        'The fire crew spray the hose on it.'
      ], q: [
        { q: 'Who can smell smoke?', a: 'Raj', opts: ['Raj', 'Meena', 'Nani'] },
        { q: 'What comes to help?', a: 'a fire truck', opts: ['a fire truck', 'a bus', 'a bike'] },
        { q: 'What happened first?', a: 'Raj can smell smoke', opts: ['Raj can smell smoke', 'They wait by the gate', 'A fire truck comes'], first: true }
      ] },
      { id: 'p5-08d', title: 'The vet', theme: 'helpers', s: [
        'Rex has a sore nose.',
        'Mum and Raj take him to the vet.',
        'The vet pokes his nose.',
        'She has some cream for him.',
        'Rex is home, and he is fine.'
      ], q: [
        { q: 'Who has a sore nose?', a: 'Rex', opts: ['Rex', 'Raj', 'Mum'] },
        { q: 'Where do they take Rex?', a: 'the vet', opts: ['the vet', 'the lake', 'the shop'] },
        { q: 'What happened first?', a: 'They take Rex to the vet', opts: ['They take Rex to the vet', 'The vet pokes his nose', 'Rex is home'], first: true }
      ] }
    ],
    near: [['come', 'coat', 'cone'], ['home', 'hole', 'hope'], ['stone', 'stop', 'stove']],
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
      { id: 'p5-09a', title: 'The flute', theme: 'animals', s: [
        'Pete has a flute.',
        'He plays a huge tune.',
        'A mule hears it.',
        'It stops to look.',
        'Is there any more?'
      ], q: [
        { q: 'What does Pete play?', a: 'flute', opts: ['flute', 'tube', 'cube'] },
        { q: 'Who hears the tune?', a: 'mule', opts: ['mule', 'cube', 'Pete'] },
        { q: 'What happened first?', a: 'Pete plays a tune', opts: ['Pete plays a tune', 'A mule hears it', 'It stops to look'], first: true }
      ] },
      { id: 'p5-09b', title: 'Cubes', theme: 'home', s: [
        'Meena has these cubes.',
        'She makes a huge tower.',
        'Then it falls!',
        'Meena is not upset.',
        'She makes it again.'
      ], q: [
        { q: 'What does Meena make?', a: 'tower', opts: ['tower', 'flute', 'mule'] },
        { q: 'What does Meena have?', a: 'cubes', opts: ['cubes', 'flutes', 'mules'] },
        { q: 'What happened first?', a: 'She makes a tower', opts: ['She makes a tower', 'It falls', 'She makes it again'], first: true }
      ] },
      { id: 'p5-09c', title: 'Bed time', theme: 'home', s: [
        'It is late.',
        'Meena has a huge yawn.',
        'She gets the tube of paste.',
        'She cleans her teeth.',
        'Then Mum hums a tune, and Meena is asleep.'
      ], q: [
        { q: 'What does Meena get?', a: 'tube of paste', opts: ['tube of paste', 'cube', 'flute'] },
        { q: 'Who hums a tune?', a: 'Mum', opts: ['Mum', 'Dad', 'Nani'] },
        { q: 'What happened first?', a: 'Meena has a huge yawn', opts: ['Meena has a huge yawn', 'She cleans her teeth', 'Mum hums a tune'], first: true }
      ] },
      { id: 'p5-09d', title: 'June', theme: 'seasons', s: [
        'It is June, and it is hot.',
        'Then the rain comes.',
        'Pete and Meena run in it.',
        'Is there any rain left? Yes!',
        'The plants are glad.'
      ], q: [
        { q: 'What comes?', a: 'rain', opts: ['rain', 'snow', 'a mule'] },
        { q: 'Who runs in the rain?', a: 'Pete and Meena', opts: ['Pete and Meena', 'Mum and Dad', 'Nani'] },
        { q: 'What happened first?', a: 'It is hot', opts: ['It is hot', 'The rain comes', 'The plants are glad'], first: true }
      ] }
    ],
    near: [['cube', 'cub', 'cut'], ['tube', 'tub', 'tune'], ['flute', 'flat', 'flag']],
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
      { id: 'p5-10a', title: 'Snow', theme: 'seasons', s: [
        'Snow is on the hills.',
        'Meena and Raj go out.',
        'They make a snowman.',
        'A cow looks at it. Moo!',
        'The snowman is slow to melt.'
      ], q: [
        { q: 'What do they make?', a: 'snowman', opts: ['snowman', 'cow', 'town'] },
        { q: 'What looks at the snowman?', a: 'cow', opts: ['cow', 'owl', 'dog'] },
        { q: 'What happened first?', a: 'Meena and Raj go out', opts: ['Meena and Raj go out', 'They make a snowman', 'A cow looks at it'], first: true }
      ] },
      { id: 'p5-10b', title: 'The town', theme: 'family', s: [
        'We went down to the town.',
        'There was a big show.',
        'A man can blow a huge horn.',
        'How fun it was!',
        'Now we go home.'
      ], q: [
        { q: 'Where did we go?', a: 'town', opts: ['town', 'snow', 'cow'] },
        { q: 'What did the man blow?', a: 'horn', opts: ['horn', 'snow', 'flute'] },
        { q: 'What happened first?', a: 'We went down to the town', opts: ['We went down to the town', 'A man can blow a horn', 'Now we go home'], first: true }
      ] },
      { id: 'p5-10c', title: 'Will it grow?', theme: 'plants', s: [
        'Raj has a seed in a pot.',
        'Will it grow?',
        'He waters it each day.',
        'Now a green shoot is up.',
        'It grows and grows!'
      ], q: [
        { q: 'What is up now?', a: 'a green shoot', opts: ['a green shoot', 'a cow', 'a crown'] },
        { q: 'Where is the seed?', a: 'in a pot', opts: ['in a pot', 'in the snow', 'in town'] },
        { q: 'What happened first?', a: 'Raj has a seed', opts: ['Raj has a seed', 'He waters it', 'A green shoot is up'], first: true }
      ] },
      { id: 'p5-10d', title: 'Work', theme: 'helpers', s: [
        'Dad goes to work in town.',
        'He is a cook.',
        'At work, he cooks for lots of people.',
        'At home, he cooks for us.',
        'Now we eat. Yum!'
      ], q: [
        { q: 'Who is a cook?', a: 'Dad', opts: ['Dad', 'Mum', 'Nani'] },
        { q: 'Where does Dad go?', a: 'work', opts: ['work', 'the beach', 'the lake'] },
        { q: 'What happened first?', a: 'Dad goes to work', opts: ['Dad goes to work', 'He cooks at home', 'We eat'], first: true }
      ] }
    ],
    near: [['grow', 'green', 'grin', 'grab'], ['snow', 'snack', 'snap'], ['town', 'tent', 'tub']],
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
      { id: 'p5-11a', title: 'The monkey', theme: 'animals', s: [
        'It is a sunny day.',
        'A funny monkey is up a tree.',
        'Why is it so happy?',
        'It has a key!',
        'Mr Sharma wants his key back.'
      ], q: [
        { q: 'What has the monkey got?', a: 'key', opts: ['key', 'fly', 'puppy'] },
        { q: 'Who wants his key back?', a: 'Mr Sharma', opts: ['Mr Sharma', 'Mrs Rao', 'Raj'] },
        { q: 'What happened first?', a: 'It is a sunny day', opts: ['It is a sunny day', 'A funny monkey is up a tree', 'It has a key'], first: true }
      ] },
      { id: 'p5-11b', title: 'The puppy', theme: 'animals', s: [
        'Mrs Rao has a puppy.',
        'It can try to catch a fly.',
        'It jumps up high.',
        'It is a funny puppy.',
        'We are happy to see it.'
      ], q: [
        { q: 'What does the puppy try to catch?', a: 'fly', opts: ['fly', 'key', 'sky'] },
        { q: 'Who has a puppy?', a: 'Mrs Rao', opts: ['Mrs Rao', 'Mr Sharma', 'Meena'] },
        { q: 'What happened first?', a: 'It tries to catch a fly', opts: ['It tries to catch a fly', 'It jumps up high', 'We are happy to see it'], first: true }
      ] },
      { id: 'p5-11c', title: 'My birthday', theme: 'family', s: [
        'It is my birthday!',
        'I am six today.',
        'Mum made a yummy cake.',
        'Nani and Mr Sharma sing to me.',
        'I am so happy!'
      ], q: [
        { q: 'Who made a cake?', a: 'Mum', opts: ['Mum', 'Nani', 'Dad'] },
        { q: 'How old am I?', a: 'six', opts: ['six', 'five', 'three'] },
        { q: 'What happened first?', a: 'Mum made a cake', opts: ['Mum made a cake', 'They sing to me', 'I am happy'], first: true }
      ] },
      { id: 'p5-11d', title: 'Ding dong', theme: 'safety', s: [
        'Ding dong! Who is it?',
        'Meena did not open it.',
        'She got Mum.',
        'Mum looked. It was Mrs Rao.',
        'Mum said, "Good girl, Meena!"'
      ], q: [
        { q: 'Who was it?', a: 'Mrs Rao', opts: ['Mrs Rao', 'Mr Sharma', 'Nani'] },
        { q: 'Who did Meena get?', a: 'Mum', opts: ['Mum', 'Dad', 'Raj'] },
        { q: 'What happened first?', a: 'Meena did not open it', opts: ['Meena did not open it', 'She got Mum', 'It was Mrs Rao'], first: true }
      ] }
    ],
    near: [['fly', 'flip', 'flag'], ['key', 'kit', 'kid'], ['sky', 'skip', 'skin']],
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
      { id: 'p5-12a', title: 'The owl', theme: 'animals', s: [
        'A brown owl is in the tree.',
        'It sees a mouse on the soil.',
        'The mouse runs into a hole.',
        'The owl has to wait, because the mouse is in its hole.',
        'Then the owl goes to sleep.'
      ], q: [
        { q: 'What did the owl see?', a: 'mouse', opts: ['mouse', 'coin', 'paint'] },
        { q: 'Where does the mouse run?', a: 'hole', opts: ['hole', 'tree', 'soil'] },
        { q: 'What happened first?', a: 'The owl sees a mouse', opts: ['The owl sees a mouse', 'The mouse runs into a hole', 'The owl goes to sleep'], first: true }
      ] },
      { id: 'p5-12b', title: 'Paint', theme: 'home', s: [
        'Meena enjoys paint.',
        'She paints a brown cow.',
        'Raj sprays paint on a box.',
        'Oops! Paint is on his mouth!',
        'They both enjoy a funny day.'
      ], q: [
        { q: 'What did Meena paint?', a: 'cow', opts: ['cow', 'owl', 'box'] },
        { q: 'What is on Raj’s mouth?', a: 'paint', opts: ['paint', 'soil', 'clay'] },
        { q: 'What happened first?', a: 'Meena paints a cow', opts: ['Meena paints a cow', 'Raj sprays a box', 'Paint is on his mouth'], first: true }
      ] },
      { id: 'p5-12c', title: 'Clean up', theme: 'home', s: [
        'The playroom is a mess.',
        'Toys are all about.',
        'Mum said, "Clean up, because Nani is on her way."',
        'Raj and Meena enjoy the job.',
        'Now the room is clean.'
      ], q: [
        { q: 'Who is on her way?', a: 'Nani', opts: ['Nani', 'Mum', 'Meena'] },
        { q: 'What is all about?', a: 'toys', opts: ['toys', 'coins', 'owls'] },
        { q: 'What happened first?', a: 'Toys are all about', opts: ['Toys are all about', 'Raj and Meena clean up', 'The room is clean'], first: true }
      ] },
      { id: 'p5-12d', title: 'Pongal', theme: 'festivals', s: [
        'It is Pongal.',
        'We paint the horns of the brown cow.',
        'The cow has bells and flowers.',
        'We cook sweet rice in a pot.',
        'We all enjoy the day.'
      ], q: [
        { q: 'What do we paint?', a: 'horns', opts: ['horns', 'coins', 'clouds'] },
        { q: 'What do we cook?', a: 'sweet rice', opts: ['sweet rice', 'soup', 'cake'] },
        { q: 'What happened first?', a: 'We paint the horns', opts: ['We paint the horns', 'The cow has bells', 'We cook rice'], first: true }
      ] }
    ],
    near: [['coin', 'corn', 'cow'], ['brown', 'brick', 'bring'], ['cloud', 'clown', 'clap']],
    silly: [
      { s: 'An owl can fly at night.', ok: true }, { s: 'An owl can paint a cow.', ok: false },
      { s: 'You can paint with a brush.', ok: true }, { s: 'A coin can enjoy a song.', ok: false },
      { s: 'A coin is round.', ok: true }, { s: 'Soil is good to eat.', ok: false },
      { s: 'Plants grow in soil.', ok: true }, { s: 'A brown cow can fly.', ok: false }
    ]
  }
);
