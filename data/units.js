/* The built-in course, part 1: Phase 3 review and Phase 4 (adjacent consonants). Original text, written for this app.
   Letters and Sounds order (the order Oxford's phonics follows). Each unit: a theme (plants, animals, food, body,
   transport, weather, helpers), its sounds, 10 decodable words, its tricky
   words, 2 stories of 5 sentences with questions, and 8 silly sentences (ok: does it make sense?).
   tests/run.js checks that every word is decodable with what has been taught up to its unit. */
window.LR = window.LR || {};
LR.units = [];
/* Where a new install starts (she is past Phase 3). Grown-ups can move her. */
LR.startUnit = 'p4-01';
/* Tricky words she knows already (the owner's list): in review from the first session. */
LR.knownTricky = ['come', 'some', 'from', 'have', 'many', 'also'];

LR.units.push(
  {
    id: 'p3-r1', phase: 3, theme: 'food', title: 'Review: ch, sh, th, ng, qu', sounds: ['ch', 'sh', 'th', 'ng', 'qu'],
    words: ['chip', 'shop', 'thin', 'ring', 'quiz', 'chop', 'fish', 'moth', 'song', 'shed'],
    tricky: ['he', 'she', 'we'],
    stories: [
      { id: 'p3-r1a', title: 'The fish shop', s: [
        'Dad has a fish shop.',
        'A big red fish is in the tub.',
        'Meena can see the fish wag its fin.',
        'Dad sings a song in the shop.',
        'The fish shop is fun!'
      ], q: [{ q: 'Who has a fish shop?', a: 'Dad', opts: ['Dad', 'Mum', 'Raj'] }] },
      { id: 'p3-r1b', title: 'The moth', s: [
        'A moth is on the shed.',
        'It is a thin moth.',
        'Raj gets a chip.',
        'The moth sits on the chip!',
        'Raj is sad. The moth is not!'
      ], q: [{ q: 'Where is the moth at the start?', a: 'shed', opts: ['shed', 'shop', 'ship'] }] }
    ],
    silly: [
      { s: 'A fish is wet.', ok: true }, { s: 'A cat can sing a song.', ok: false },
      { s: 'A ship is on the sun.', ok: false }, { s: 'Dad can chop a log.', ok: true },
      { s: 'A moth can sit on a pin.', ok: true }, { s: 'A fish can run up the hill.', ok: false },
      { s: 'Mum has a ring.', ok: true }, { s: 'The dog is in the cup.', ok: false }
    ]
  },
  {
    id: 'p3-r2', phase: 3, theme: 'weather', title: 'Review: ai, ee, igh, oa, oo', sounds: ['ai', 'ee', 'igh', 'oa', 'oo'],
    words: ['rain', 'tail', 'feet', 'seed', 'night', 'light', 'boat', 'coat', 'moon', 'book'],
    tricky: ['was', 'you', 'they'],
    stories: [
      { id: 'p3-r2a', title: 'Night', s: [
        'It is night.',
        'The moon is up.',
        'Meena can see the moon.',
        'The rain is on the roof.',
        'Meena gets in bed. Good night!'
      ], q: [{ q: 'What is up at night?', a: 'moon', opts: ['moon', 'boat', 'book'] }] },
      { id: 'p3-r2b', title: 'The boat', s: [
        'Raj has a red boat.',
        'The boat is in the rain.',
        'It gets wet.',
        'Raj gets his coat.',
        'Then the boat can sail on a pool!'
      ], q: [{ q: 'What is red?', a: 'boat', opts: ['boat', 'coat', 'moon'] }] }
    ],
    silly: [
      { s: 'A boat can sail.', ok: true }, { s: 'A goat can look at a book.', ok: false },
      { s: 'The moon is in the sink.', ok: false }, { s: 'A dog has a tail.', ok: true },
      { s: 'The rain is wet.', ok: true }, { s: 'A coat can run.', ok: false },
      { s: 'The sun is up at night.', ok: false }, { s: 'A seed can be in the soil.', ok: true }
    ]
  },
  {
    id: 'p3-r3', phase: 3, theme: 'animals', title: 'Review: ar, or, ur, ow, oi, ear, air, er', sounds: ['ar', 'or', 'ur', 'ow', 'oi', 'ear', 'air', 'er'],
    words: ['car', 'star', 'fork', 'corn', 'burn', 'cow', 'coin', 'ear', 'hair', 'letter'],
    tricky: ['my', 'her', 'all'],
    stories: [
      { id: 'p3-r3a', title: 'The farm', s: [
        'Nani has a farm.',
        'Her cow is in the barn.',
        'A hen sits on a pot of corn.',
        'Nani gets corn for the hen.',
        'The cow gets corn as well.'
      ], q: [{ q: 'Who has a farm?', a: 'Nani', opts: ['Nani', 'Raj', 'Dad'] }] },
      { id: 'p3-r3b', title: 'The coin', s: [
        'Meena has a coin.',
        'It is in her purse.',
        'Then the coin is not in her purse!',
        'Is it in the car? No!',
        'It is in her hair!'
      ], q: [{ q: 'Where is the coin at the end?', a: 'hair', opts: ['hair', 'car', 'fork'] }] }
    ],
    silly: [
      { s: 'A cow can moo.', ok: true }, { s: 'A car can sing.', ok: false },
      { s: 'A star is up at night.', ok: true }, { s: 'A coin can bark.', ok: false },
      { s: 'You can hear with an ear.', ok: true }, { s: 'Corn can run.', ok: false },
      { s: 'A dog has fur.', ok: true }, { s: 'A fork can fly to the moon.', ok: false }
    ]
  },
  {
    id: 'p4-01', phase: 4, theme: 'animals', title: 'Ends: st, nd, mp, nk, lk, lt', sounds: ['st', 'nd', 'mp', 'nk', 'lk', 'lt'],
    words: ['jump', 'lamp', 'hand', 'pond', 'nest', 'tent', 'milk', 'sink', 'desk', 'belt'],
    tricky: ['said', 'like'],
    stories: [
      { id: 'p4-01a', title: 'The frog', s: [
        'A frog sat on a log in the pond.',
        'It can jump and it can swim.',
        'Raj said, "Jump, frog, jump!"',
        'The frog did a big jump.',
        'Splash! It went into the pond.'
      ], q: [{ q: 'Who did a big jump?', a: 'frog', opts: ['frog', 'fish', 'dog'] }] },
      { id: 'p4-01b', title: 'Milk', s: [
        'Meena has a cup of milk.',
        'She sat at the desk with it.',
        'The cup fell into the sink.',
        'Mum said, "It is not bad."',
        'Meena had milk and a bun.'
      ], q: [{ q: 'What fell into the sink?', a: 'cup', opts: ['cup', 'desk', 'lamp'] }] }
    ],
    silly: [
      { s: 'A frog can jump.', ok: true }, { s: 'A tent can drink milk.', ok: false },
      { s: 'You can sit at a desk.', ok: true }, { s: 'A lamp can sing.', ok: false },
      { s: 'A fish is in the pond.', ok: true }, { s: 'The sink can jump.', ok: false },
      { s: 'Milk is in a cup.', ok: true }, { s: 'A nest can sing a song.', ok: false }
    ]
  },
  {
    id: 'p4-02', phase: 4, theme: 'food', title: 'Starts: st, sp, sn, sl, sw', sounds: ['st', 'sp', 'sn', 'sl', 'sw'],
    words: ['stop', 'step', 'spot', 'spin', 'snap', 'snack', 'slip', 'slug', 'swim', 'star'],
    tricky: ['so', 'do'],
    stories: [
      { id: 'p4-02a', title: 'The slug', s: [
        'A slug is on the step.',
        'It is so slim and wet.',
        'Can it swim? No, it can not.',
        'A duck spots the slug.',
        'Stop, duck! Let the slug go.'
      ], q: [{ q: 'What is on the step?', a: 'slug', opts: ['slug', 'duck', 'frog'] }] },
      { id: 'p4-02b', title: 'Snack time', s: [
        'Raj and Meena sit for a snack.',
        'Raj has a bun with jam.',
        'Meena has nuts in a cup.',
        'Do not spill the jam, Raj!',
        'Snap! The bun is in bits.'
      ], q: [{ q: 'Who has a bun with jam?', a: 'Raj', opts: ['Raj', 'Meena', 'Mum'] }] }
    ],
    silly: [
      { s: 'A slug is slim.', ok: true }, { s: 'A star can swim in a cup.', ok: false },
      { s: 'You can spin a top.', ok: true }, { s: 'A slug can snap a stick.', ok: false },
      { s: 'A bun is a snack.', ok: true }, { s: 'A step can swim.', ok: false },
      { s: 'Stop at the red light.', ok: true }, { s: 'A spot can sing.', ok: false }
    ]
  },
  {
    id: 'p4-03', phase: 4, theme: 'transport', title: 'Starts: fl, cl, pl, gl, dr, fr, gr, tr, cr', sounds: ['fl', 'cl', 'pl', 'gl', 'dr', 'fr', 'gr', 'tr', 'cr'],
    words: ['flag', 'clap', 'plum', 'glad', 'drum', 'frog', 'grin', 'trip', 'crab', 'trunk'],
    tricky: ['were', 'there'],
    stories: [
      { id: 'p4-03a', title: 'The drum', s: [
        'Raj has a big red drum.',
        'Bang, bang, bang!',
        'Meena can clap and grin.',
        'They were so glad.',
        'There is a band on the step!'
      ], q: [{ q: 'What has Raj got?', a: 'drum', opts: ['drum', 'flag', 'crab'] }] },
      { id: 'p4-03b', title: 'The trip', s: [
        'We went on a trip to the hills.',
        'There were plums and nuts.',
        'Is it a crab? No, it is a frog!',
        'The frog hops on a flat rock.',
        'We had fun on the trip.'
      ], q: [{ q: 'What hops on the rock?', a: 'frog', opts: ['frog', 'crab', 'plum'] }] }
    ],
    silly: [
      { s: 'A frog can hop.', ok: true }, { s: 'A plum can drum.', ok: false },
      { s: 'You can clap.', ok: true }, { s: 'A drum can grin.', ok: false },
      { s: 'A crab can grab.', ok: true }, { s: 'A crab can fly a flag.', ok: false },
      { s: 'A flag can flap.', ok: true }, { s: 'A trip is in a plum.', ok: false }
    ]
  },
  {
    id: 'p4-04', phase: 4, theme: 'plants', title: 'Both ends: plant, stand, drink', sounds: ['CCVCC'],
    words: ['plant', 'stand', 'drink', 'crisp', 'stamp', 'blink', 'twist', 'frost', 'spend', 'crust'],
    tricky: ['little', 'one', 'what'],
    stories: [
      { id: 'p4-04a', title: 'The little plant', s: [
        'Meena has a little plant in a pot.',
        'She gets a drink for it.',
        'Drip, drip, drip!',
        'What will it be?',
        'It will be a big plant with buds.'
      ], q: [{ q: 'What has Meena got in a pot?', a: 'plant', opts: ['plant', 'drink', 'stamp'] }] },
      { id: 'p4-04b', title: 'One leg', s: [
        'Raj can stand on one leg.',
        'Can Meena stand on one leg?',
        'She can! Then she tips.',
        'Raj tips as well!',
        'Bump! Meena and Raj grin.'
      ], q: [{ q: 'Who stands on one leg first?', a: 'Raj', opts: ['Raj', 'Mum', 'Dad'] }] }
    ],
    silly: [
      { s: 'A plant can grow in a pot.', ok: true }, { s: 'A stamp can blink.', ok: false },
      { s: 'You can drink milk.', ok: true }, { s: 'A plant can twist and jump.', ok: false },
      { s: 'You can stand on one leg.', ok: true }, { s: 'Crust can stand up and sing.', ok: false },
      { s: 'Frost is cold.', ok: true }, { s: 'One cat is a big frog.', ok: false }
    ]
  },
  {
    id: 'p4-05', phase: 4, theme: 'weather', title: 'Three together: str, spr, scr, spl, shr, thr', sounds: ['str', 'spr', 'scr', 'spl', 'shr', 'thr'],
    words: ['string', 'strap', 'scrub', 'splash', 'shrimp', 'thrill', 'spring', 'street', 'scrap', 'strong'],
    tricky: ['out', 'when'],
    stories: [
      { id: 'p4-05a', title: 'Spring', s: [
        'It is spring.',
        'Raj and Meena run out to the street.',
        'Splash! Raj is in a big puddle.',
        'Meena has a string with a red bell on it.',
        'Ring, ring! The bell is a lot of fun.'
      ], q: [{ q: 'Who is in the puddle?', a: 'Raj', opts: ['Raj', 'Meena', 'Nani'] }] },
      { id: 'p4-05b', title: 'The shrimp', s: [
        'Dad has a net.',
        'He gets a shrimp in it.',
        'It is a strong little shrimp!',
        'It springs out of the net.',
        'Splash! It is back in the pond.'
      ], q: [{ q: 'What is in the net?', a: 'shrimp', opts: ['shrimp', 'fish', 'string'] }] }
    ],
    silly: [
      { s: 'You can scrub a pot.', ok: true }, { s: 'A street can sing.', ok: false },
      { s: 'A shrimp can swim.', ok: true }, { s: 'A strap can scrub the sun.', ok: false },
      { s: 'You can splash in the bath.', ok: true }, { s: 'A shrimp can run up a tree.', ok: false },
      { s: 'A string can be long.', ok: true }, { s: 'Spring is in a cup.', ok: false }
    ]
  },
  {
    id: 'p4-06', phase: 4, theme: 'food', title: 'Clusters with ch, sh, th', sounds: ['nch', 'sh', 'ch'],
    words: ['chest', 'bench', 'lunch', 'shelf', 'crash', 'flash', 'brush', 'champ', 'munch', 'chimp'],
    tricky: ['oh', 'their'],
    stories: [
      { id: 'p4-06a', title: 'Lunch', s: [
        'It is lunch on the bench.',
        'Raj has a big bun.',
        'Meena munches a crunchy apple.',
        'Oh no! A cat is on the bench!',
        'The cat gets their lunch!'
      ], q: [{ q: 'Where is the lunch?', a: 'bench', opts: ['bench', 'chest', 'shelf'] }] },
      { id: 'p4-06b', title: 'The brush', s: [
        'Dad has a brush.',
        'He brushes the shelf.',
        'Crash! A box drops on the rug.',
        'Oh, it is a chest of dolls!',
        'Raj and Meena grin at their dolls.'
      ], q: [{ q: 'What has Dad got?', a: 'brush', opts: ['brush', 'bench', 'chest'] }] }
    ],
    silly: [
      { s: 'You can sit on a bench.', ok: true }, { s: 'A bench can munch lunch.', ok: false },
      { s: 'You can munch lunch.', ok: true }, { s: 'A shelf can run.', ok: false },
      { s: 'A flash is bright.', ok: true }, { s: 'A brush can sing a song.', ok: false },
      { s: 'A chest can hold things.', ok: true }, { s: 'Lunch can crash a car.', ok: false }
    ]
  }
);
