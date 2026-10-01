/* The built-in course, part 1: Phase 3 review and Phase 4 (adjacent consonants). Original text, written for this app.
   Letters and Sounds order (the order Oxford's phonics follows). Each unit: a theme (plants, animals, food, body,
   transport, weather, helpers), its sounds, 10 decodable words, its tricky
   words, 4 stories of 5 sentences, each with a theme and 3 questions (one "What happened first?", first: true),
   8 silly sentences (ok: does it make sense?) and same-start groups (near: words that start alike but end differently,
   used as distractors so she reads past the first letter).
   tests/run.js checks that every word is decodable with what has been taught up to its unit. */
window.LR = window.LR || {};
LR.units = [];
/* Where a new install starts (she is past Phase 3). Grown-ups can move her. */
LR.startUnit = 'p4-01';
/* Tricky words she knows already (the owner's list): in review from the first session. */
LR.knownTricky = ['come', 'some', 'from', 'have', 'many', 'also'];
/* Letters and Sounds Phase 2 and 3 tricky words she is assumed to know: in review from the first session, so each is
   checked and drops out once mastered. */
LR.baseReview = ['the', 'to', 'i', 'no', 'go', 'into', 'me', 'be', 'are'];

LR.units.push(
  {
    id: 'p3-r1', phase: 3, theme: 'food', title: 'Review: ch, sh, th, ng, qu', sounds: ['ch', 'sh', 'th', 'ng', 'qu'],
    words: ['chip', 'shop', 'thin', 'ring', 'quiz', 'chop', 'fish', 'moth', 'song', 'shed'],
    tricky: ['he', 'she', 'we'],
    stories: [
      { id: 'p3-r1a', title: 'The fish shop', theme: 'food', s: [
        'Dad has a fish shop.',
        'A big red fish is in the tub.',
        'Meena can see the fish wag its fin.',
        'Dad sings a song in the shop.',
        'The fish shop is fun!'
      ], q: [
        { q: 'Who has a fish shop?', a: 'Dad', opts: ['Dad', 'Mum', 'Raj'] },
        { q: 'What does Dad sing in the shop?', a: 'song', opts: ['song', 'ring', 'chip'] },
        { q: 'What happened first?', a: 'Dad has a fish shop', opts: ['Dad has a fish shop', 'Meena can see the fish', 'Dad sings a song'], first: true }
      ] },
      { id: 'p3-r1b', title: 'The moth', theme: 'animals', s: [
        'A moth is on the shed.',
        'It is a thin moth.',
        'Raj gets a chip.',
        'The moth sits on the chip!',
        'Raj is sad. The moth is not!'
      ], q: [
        { q: 'Where is the moth at the start?', a: 'shed', opts: ['shed', 'shop', 'ship'] },
        { q: 'Who gets a chip?', a: 'Raj', opts: ['Raj', 'Dad', 'Meena'] },
        { q: 'What happened first?', a: 'A moth is on the shed', opts: ['A moth is on the shed', 'The moth sits on the chip', 'Raj is sad'], first: true }
      ] },
      { id: 'p3-r1c', title: 'Chips for all', theme: 'family', s: [
        'Nani is with us.',
        'Mum and Dad chop the fish.',
        'I get chips in a dish.',
        'Nani has a thin chip.',
        'We all munch and chat.'
      ], q: [
        { q: 'Who is with us?', a: 'Nani', opts: ['Nani', 'Raj', 'Mum'] },
        { q: 'What are the chips in?', a: 'dish', opts: ['dish', 'shop', 'shed'] },
        { q: 'What happened first?', a: 'Mum and Dad chop the fish', opts: ['Mum and Dad chop the fish', 'I get chips in a dish', 'We all munch and chat'], first: true }
      ] },
      { id: 'p3-r1d', title: 'The shed', theme: 'home', s: [
        'Dad has a shed.',
        'Raj and Dad fix the shed.',
        'A moth lands on Raj.',
        'Shoo, moth, shoo!',
        'Then the shed is good.'
      ], q: [
        { q: 'Who fixes the shed with Dad?', a: 'Raj', opts: ['Raj', 'Meena', 'Nani'] },
        { q: 'What lands on Raj?', a: 'moth', opts: ['moth', 'fish', 'ring'] },
        { q: 'What happened first?', a: 'Raj and Dad fix the shed', opts: ['Raj and Dad fix the shed', 'A moth lands on Raj', 'The shed is good'], first: true }
      ] }
    ],
    near: [['chip', 'chop', 'chin'], ['shop', 'shed', 'ship'], ['thin', 'this', 'then']],
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
      { id: 'p3-r2a', title: 'Night', theme: 'weather', s: [
        'It is night.',
        'The moon is up.',
        'Meena can see the moon.',
        'The rain is on the roof.',
        'Meena gets in bed. Good night!'
      ], q: [
        { q: 'What is up at night?', a: 'moon', opts: ['moon', 'boat', 'book'] },
        { q: 'Where is the rain?', a: 'roof', opts: ['roof', 'boat', 'bed'] },
        { q: 'What happened first?', a: 'It is night', opts: ['It is night', 'Meena gets in bed', 'The rain is on the roof'], first: true }
      ] },
      { id: 'p3-r2b', title: 'The boat', theme: 'transport', s: [
        'Raj has a red boat.',
        'The boat is in the rain.',
        'It gets wet.',
        'Raj gets his coat.',
        'Then the boat can sail on a pool!'
      ], q: [
        { q: 'What is red?', a: 'boat', opts: ['boat', 'coat', 'moon'] },
        { q: 'Who has a red boat?', a: 'Raj', opts: ['Raj', 'Meena', 'Dad'] },
        { q: 'What happened first?', a: 'Raj has a red boat', opts: ['Raj has a red boat', 'Raj gets his coat', 'The boat can sail'], first: true }
      ] },
      { id: 'p3-r2c', title: 'Rain', theme: 'seasons', s: [
        'Rain, rain, rain!',
        'Meena has a coat and boots.',
        'She can jump in the wet mud.',
        'The seeds in the soil get rain.',
        'Soon the seeds will be big.'
      ], q: [
        { q: 'What does Meena jump in?', a: 'mud', opts: ['mud', 'soil', 'boat'] },
        { q: 'What has Meena got on her feet?', a: 'boots', opts: ['boots', 'hat', 'ring'] },
        { q: 'What happened first?', a: 'Meena has a coat and boots', opts: ['Meena has a coat and boots', 'She can jump in the mud', 'The seeds get rain'], first: true }
      ] },
      { id: 'p3-r2d', title: 'The lamp', theme: 'home', s: [
        'It is night and I am in bed.',
        'I can see the moon.',
        'Dad gets a lamp for me.',
        'It has a soft light.',
        'Good night, Dad!'
      ], q: [
        { q: 'Who gets a lamp?', a: 'Dad', opts: ['Dad', 'Mum', 'Nani'] },
        { q: 'What can I see?', a: 'moon', opts: ['moon', 'boat', 'coat'] },
        { q: 'What happened first?', a: 'I can see the moon', opts: ['I can see the moon', 'Dad gets a lamp', 'Good night, Dad'], first: true }
      ] }
    ],
    near: [['rain', 'ran', 'rail'], ['boat', 'boot', 'book'], ['moon', 'mood', 'moth']],
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
      { id: 'p3-r3a', title: 'The farm', theme: 'animals', s: [
        'Nani has a farm.',
        'Her cow is in the barn.',
        'A hen sits on a pot of corn.',
        'Nani gets corn for the hen.',
        'The cow gets corn as well.'
      ], q: [
        { q: 'Who has a farm?', a: 'Nani', opts: ['Nani', 'Raj', 'Dad'] },
        { q: 'Where is the cow?', a: 'barn', opts: ['barn', 'car', 'pot'] },
        { q: 'What happened first?', a: 'A hen sits on a pot', opts: ['A hen sits on a pot', 'Nani gets corn for the hen', 'The cow gets corn'], first: true }
      ] },
      { id: 'p3-r3b', title: 'The coin', theme: 'home', s: [
        'Meena has a coin.',
        'It is in her purse.',
        'Then the coin is not in her purse!',
        'Is it in the car? No!',
        'It is in her hair!'
      ], q: [
        { q: 'Where is the coin at the end?', a: 'hair', opts: ['hair', 'car', 'fork'] },
        { q: 'Who has a coin?', a: 'Meena', opts: ['Meena', 'Raj', 'Nani'] },
        { q: 'What happened first?', a: 'It is in her purse', opts: ['It is in her purse', 'Is it in the car?', 'It is in her hair'], first: true }
      ] },
      { id: 'p3-r3c', title: 'The fair', theme: 'festivals', s: [
        'We go to the fair.',
        'The fair has lots of lights.',
        'Meena gets a red star.',
        'Raj gets a big drum.',
        'We all clap and cheer.'
      ], q: [
        { q: 'Where do we go?', a: 'fair', opts: ['fair', 'farm', 'car'] },
        { q: 'What does Meena get?', a: 'star', opts: ['star', 'drum', 'coin'] },
        { q: 'What happened first?', a: 'Meena gets a star', opts: ['Meena gets a star', 'Raj gets a drum', 'We clap and cheer'], first: true }
      ] },
      { id: 'p3-r3d', title: 'Long hair', theme: 'family', s: [
        'Nani has long hair.',
        'Meena can brush her hair.',
        'It is soft.',
        'Then Meena pins a red star in it.',
        'Nani hugs Meena.'
      ], q: [
        { q: 'Who has long hair?', a: 'Nani', opts: ['Nani', 'Meena', 'Mum'] },
        { q: 'What does Meena pin in the hair?', a: 'star', opts: ['star', 'coin', 'fork'] },
        { q: 'What happened first?', a: 'Meena can brush her hair', opts: ['Meena can brush her hair', 'Meena pins a star in it', 'Nani hugs Meena'], first: true }
      ] }
    ],
    near: [['car', 'corn', 'coin'], ['fork', 'fort', 'form'], ['hair', 'hard', 'harm']],
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
      { id: 'p4-01a', title: 'The frog', theme: 'animals', s: [
        'A frog sat on a log in the pond.',
        'It can jump and it can swim.',
        'Raj said, "Jump, frog, jump!"',
        'The frog did a big jump.',
        'Splash! It went into the pond.'
      ], q: [
        { q: 'Who did a big jump?', a: 'frog', opts: ['frog', 'fish', 'dog'] },
        { q: 'Where did the frog sit?', a: 'log', opts: ['log', 'desk', 'tent'] },
        { q: 'What happened first?', a: 'A frog sat on a log', opts: ['A frog sat on a log', 'The frog did a big jump', 'It went into the pond'], first: true }
      ] },
      { id: 'p4-01b', title: 'Milk', theme: 'food', s: [
        'Meena has a cup of milk.',
        'She sat at the desk with it.',
        'The cup fell into the sink.',
        'Mum said, "It is not bad."',
        'Meena had milk and a bun.'
      ], q: [
        { q: 'What fell into the sink?', a: 'cup', opts: ['cup', 'desk', 'lamp'] },
        { q: 'Who has a cup of milk?', a: 'Meena', opts: ['Meena', 'Raj', 'Mum'] },
        { q: 'What happened first?', a: 'Meena has a cup of milk', opts: ['Meena has a cup of milk', 'The cup fell into the sink', 'Meena had milk and a bun'], first: true }
      ] },
      { id: 'p4-01c', title: 'The tent', theme: 'family', s: [
        'Dad and Raj camp in a tent.',
        'Dad has a lamp.',
        'Raj has milk in a flask.',
        'They sit and look at the stars.',
        'Raj said, "I like the tent!"'
      ], q: [
        { q: 'Who is in the tent with Raj?', a: 'Dad', opts: ['Dad', 'Mum', 'Nani'] },
        { q: 'What has Dad got?', a: 'lamp', opts: ['lamp', 'milk', 'desk'] },
        { q: 'What happened first?', a: 'Dad and Raj camp in a tent', opts: ['Dad and Raj camp in a tent', 'They look at the stars', 'Raj said he likes the tent'], first: true }
      ] },
      { id: 'p4-01d', title: 'Hold my hand', theme: 'safety', s: [
        'Mum and Meena went to the shop.',
        'Lots of cars went past.',
        'Mum said, "Hold my hand."',
        'Stop and look! Then go on.',
        'Meena held her hand to the shop.'
      ], q: [
        { q: 'Who held Mum’s hand?', a: 'Meena', opts: ['Meena', 'Raj', 'Dad'] },
        { q: 'What went past?', a: 'cars', opts: ['cars', 'frogs', 'tents'] },
        { q: 'What happened first?', a: 'Mum and Meena went to the shop', opts: ['Mum and Meena went to the shop', 'Mum said hold my hand', 'Meena held her hand'], first: true }
      ] }
    ],
    near: [['jump', 'junk', 'just'], ['lamp', 'limp', 'lump'], ['milk', 'mill', 'mint']],
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
      { id: 'p4-02a', title: 'The slug', theme: 'animals', s: [
        'A slug is on the step.',
        'It is so slim and wet.',
        'Can it swim? No, it can not.',
        'A duck spots the slug.',
        'Stop, duck! Let the slug go.'
      ], q: [
        { q: 'What is on the step?', a: 'slug', opts: ['slug', 'duck', 'frog'] },
        { q: 'Who spots the slug?', a: 'duck', opts: ['duck', 'frog', 'dog'] },
        { q: 'What happened first?', a: 'A slug is on the step', opts: ['A slug is on the step', 'A duck spots the slug', 'Stop, duck!'], first: true }
      ] },
      { id: 'p4-02b', title: 'Snack time', theme: 'food', s: [
        'Raj and Meena sit for a snack.',
        'Raj has a bun with jam.',
        'Meena has nuts in a cup.',
        'Do not spill the jam, Raj!',
        'Snap! The bun is in bits.'
      ], q: [
        { q: 'Who has a bun with jam?', a: 'Raj', opts: ['Raj', 'Meena', 'Mum'] },
        { q: 'What has Meena got in a cup?', a: 'nuts', opts: ['nuts', 'jam', 'buns'] },
        { q: 'What happened first?', a: 'Raj and Meena sit for a snack', opts: ['Raj and Meena sit for a snack', 'Raj has a bun with jam', 'The bun is in bits'], first: true }
      ] },
      { id: 'p4-02c', title: 'Snack in class', theme: 'school', s: [
        'Meena and Raj are in class.',
        'Miss Jain has a snack for the class.',
        'It is a big tin of nuts.',
        'Do not snatch, Raj!',
        'So we all get some nuts.'
      ], q: [
        { q: 'Who has a snack for the class?', a: 'Miss Jain', opts: ['Miss Jain', 'Mum', 'Nani'] },
        { q: 'What is in the tin?', a: 'nuts', opts: ['nuts', 'jam', 'buns'] },
        { q: 'What happened first?', a: 'Miss Jain has a snack', opts: ['Miss Jain has a snack', 'Raj must not snatch', 'We all get some nuts'], first: true }
      ] },
      { id: 'p4-02d', title: 'Summer', theme: 'seasons', s: [
        'It is hot in the summer.',
        'We swim in the pool.',
        'Dad said, "Do not run on the wet steps."',
        'We sit on the step and splash.',
        'Then we get a cool drink.'
      ], q: [
        { q: 'Where do we swim?', a: 'pool', opts: ['pool', 'sink', 'pond'] },
        { q: 'What do we get at the end?', a: 'drink', opts: ['drink', 'snack', 'bun'] },
        { q: 'What happened first?', a: 'We swim in the pool', opts: ['We swim in the pool', 'We sit on the step', 'We get a cool drink'], first: true }
      ] }
    ],
    near: [['stop', 'step', 'stem'], ['spin', 'spot', 'spit'], ['slip', 'slap', 'slim']],
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
      { id: 'p4-03a', title: 'The drum', theme: 'home', s: [
        'Raj has a big red drum.',
        'Bang, bang, bang!',
        'Meena can clap and grin.',
        'They were so glad.',
        'There is a band on the step!'
      ], q: [
        { q: 'What has Raj got?', a: 'drum', opts: ['drum', 'flag', 'crab'] },
        { q: 'Who can clap and grin?', a: 'Meena', opts: ['Meena', 'Raj', 'Dad'] },
        { q: 'What happened first?', a: 'Raj has a red drum', opts: ['Raj has a red drum', 'Meena can clap', 'There is a band on the step'], first: true }
      ] },
      { id: 'p4-03b', title: 'The trip', theme: 'transport', s: [
        'We went on a trip to the hills.',
        'There were plums and nuts.',
        'Is it a crab? No, it is a frog!',
        'The frog hops on a flat rock.',
        'We had fun on the trip.'
      ], q: [
        { q: 'What hops on the rock?', a: 'frog', opts: ['frog', 'crab', 'plum'] },
        { q: 'Where did we go?', a: 'hills', opts: ['hills', 'shop', 'pond'] },
        { q: 'What happened first?', a: 'We went on a trip', opts: ['We went on a trip', 'There were plums and nuts', 'The frog hops on a rock'], first: true }
      ] },
      { id: 'p4-03c', title: 'The train', theme: 'family', s: [
        'We went on a train to see Nani.',
        'The train was long and fast.',
        'Raj had a flag to flap.',
        'Nani was at the end of the trip.',
        'We were so glad to see her!'
      ], q: [
        { q: 'Who did we go to see?', a: 'Nani', opts: ['Nani', 'Dad', 'Mum'] },
        { q: 'What did Raj have?', a: 'flag', opts: ['flag', 'drum', 'crab'] },
        { q: 'What happened first?', a: 'We went on a train', opts: ['We went on a train', 'Raj had a flag', 'We were glad to see Nani'], first: true }
      ] },
      { id: 'p4-03d', title: 'Holi', theme: 'festivals', s: [
        'It is Holi!',
        'Raj has red and green dust.',
        'Meena has pink dust.',
        'We get red, green and pink!',
        'There is lots of fun.'
      ], q: [
        { q: 'Who has pink dust?', a: 'Meena', opts: ['Meena', 'Raj', 'Dad'] },
        { q: 'What colours does Raj have?', a: 'red and green', opts: ['red and green', 'pink', 'black'] },
        { q: 'What happened first?', a: 'Raj has red and green', opts: ['Raj has red and green', 'We get red, green and pink', 'There is lots of fun'], first: true }
      ] }
    ],
    near: [['frog', 'from', 'frost'], ['drum', 'drip', 'drop'], ['trip', 'trap', 'trunk']],
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
      { id: 'p4-04a', title: 'The little plant', theme: 'plants', s: [
        'Meena has a little plant in a pot.',
        'She gets a drink for it.',
        'Drip, drip, drip!',
        'What will it be?',
        'It will be a big plant with buds.'
      ], q: [
        { q: 'What has Meena got in a pot?', a: 'plant', opts: ['plant', 'drink', 'stamp'] },
        { q: 'What does Meena get for the plant?', a: 'drink', opts: ['drink', 'stamp', 'bun'] },
        { q: 'What happened first?', a: 'Meena gets a drink for it', opts: ['Meena gets a drink for it', 'Drip, drip, drip', 'It will be a big plant'], first: true }
      ] },
      { id: 'p4-04b', title: 'One leg', theme: 'home', s: [
        'Raj can stand on one leg.',
        'Can Meena stand on one leg?',
        'She can! Then she tips.',
        'Raj tips as well!',
        'Bump! Meena and Raj grin.'
      ], q: [
        { q: 'Who stands on one leg first?', a: 'Raj', opts: ['Raj', 'Mum', 'Dad'] },
        { q: 'What does Raj stand on?', a: 'one leg', opts: ['one leg', 'a bench', 'a box'] },
        { q: 'What happened first?', a: 'Raj can stand on one leg', opts: ['Raj can stand on one leg', 'Meena tips', 'Meena and Raj grin'], first: true }
      ] },
      { id: 'p4-04c', title: 'Pots and plants', theme: 'plants', s: [
        'Dad has six pots.',
        'In the pots are plants.',
        'Raj gets a drink for the plants.',
        'Then one pot tips!',
        'Dad and Raj fix it with soil.'
      ], q: [
        { q: 'What is in the pots?', a: 'plants', opts: ['plants', 'pots', 'plums'] },
        { q: 'How many pots has Dad got?', a: 'six', opts: ['six', 'one', 'ten'] },
        { q: 'What happened first?', a: 'Raj gets a drink for the plants', opts: ['Raj gets a drink for the plants', 'One pot tips', 'Dad and Raj fix it'], first: true }
      ] },
      { id: 'p4-04d', title: 'Frost', theme: 'seasons', s: [
        'It is winter.',
        'There is frost on the grass.',
        'Meena has a hat and a scarf.',
        'Her hands are cold.',
        'Mum has a hot drink for her.'
      ], q: [
        { q: 'What is on the grass?', a: 'frost', opts: ['frost', 'plants', 'crust'] },
        { q: 'Who has a hot drink for Meena?', a: 'Mum', opts: ['Mum', 'Raj', 'Nani'] },
        { q: 'What happened first?', a: 'There is frost on the grass', opts: ['There is frost on the grass', 'Her hands are cold', 'Mum has a hot drink'], first: true }
      ] }
    ],
    near: [['plants', 'plums', 'pots'], ['stand', 'stamp', 'stack'], ['drink', 'drip', 'drum']],
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
      { id: 'p4-05a', title: 'Spring', theme: 'seasons', s: [
        'It is spring.',
        'Raj and Meena run out to the street.',
        'Splash! Raj is in a big puddle.',
        'Meena has a string with a red bell on it.',
        'Ring, ring! The bell is a lot of fun.'
      ], q: [
        { q: 'Who is in the puddle?', a: 'Raj', opts: ['Raj', 'Meena', 'Nani'] },
        { q: 'What is on the string?', a: 'bell', opts: ['bell', 'shrimp', 'strap'] },
        { q: 'What happened first?', a: 'Raj and Meena run out', opts: ['Raj and Meena run out', 'Raj is in a puddle', 'The bell is a lot of fun'], first: true }
      ] },
      { id: 'p4-05b', title: 'The shrimp', theme: 'animals', s: [
        'Dad has a net.',
        'He gets a shrimp in it.',
        'It is a strong little shrimp!',
        'It springs out of the net.',
        'Splash! It is back in the pond.'
      ], q: [
        { q: 'What is in the net?', a: 'shrimp', opts: ['shrimp', 'fish', 'string'] },
        { q: 'Who has a net?', a: 'Dad', opts: ['Dad', 'Raj', 'Meena'] },
        { q: 'What happened first?', a: 'Dad gets a shrimp', opts: ['Dad gets a shrimp', 'It springs out of the net', 'It is back in the pond'], first: true }
      ] },
      { id: 'p4-05c', title: 'The light', theme: 'safety', s: [
        'Raj and Dad are on the street.',
        'When can we go?',
        'Look at the light. It is red.',
        'Stop! Then it is green.',
        'Now we can go.'
      ], q: [
        { q: 'What colour is the light first?', a: 'red', opts: ['red', 'green', 'pink'] },
        { q: 'Who is with Raj?', a: 'Dad', opts: ['Dad', 'Mum', 'Nani'] },
        { q: 'What happened first?', a: 'The light is red', opts: ['The light is red', 'The light is green', 'We can go'], first: true }
      ] },
      { id: 'p4-05d', title: 'Bath night', theme: 'home', s: [
        'It is bath night.',
        'Splash, splash! Meena is in the bath.',
        'Mum scrubs her back.',
        'Then Meena gets out.',
        'She has a long towel.'
      ], q: [
        { q: 'Who scrubs Meena?', a: 'Mum', opts: ['Mum', 'Dad', 'Raj'] },
        { q: 'Where is Meena?', a: 'bath', opts: ['bath', 'bed', 'pond'] },
        { q: 'What happened first?', a: 'Meena is in the bath', opts: ['Meena is in the bath', 'Mum scrubs her back', 'Meena gets out'], first: true }
      ] }
    ],
    near: [['string', 'strap', 'strong'], ['splash', 'split', 'splat'], ['scrub', 'scrap', 'scratch']],
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
      { id: 'p4-06a', title: 'Lunch', theme: 'food', s: [
        'It is lunch on the bench.',
        'Raj has a big bun.',
        'Meena has a crunchy apple.',
        'Oh no! A cat is on the bench!',
        'The cat gets their lunch!'
      ], q: [
        { q: 'Where is the lunch?', a: 'bench', opts: ['bench', 'chest', 'shelf'] },
        { q: 'What does Raj have?', a: 'bun', opts: ['bun', 'apple', 'nuts'] },
        { q: 'What happened first?', a: 'It is lunch on the bench', opts: ['It is lunch on the bench', 'A cat is on the bench', 'The cat gets the lunch'], first: true }
      ] },
      { id: 'p4-06b', title: 'The brush', theme: 'home', s: [
        'Dad has a brush.',
        'He can brush the shelf.',
        'Crash! A box drops on the rug.',
        'Oh, it is a chest of dolls!',
        'Raj and Meena grin at their dolls.'
      ], q: [
        { q: 'What has Dad got?', a: 'brush', opts: ['brush', 'bench', 'chest'] },
        { q: 'What drops on the rug?', a: 'box', opts: ['box', 'brush', 'shelf'] },
        { q: 'What happened first?', a: 'Dad has a brush', opts: ['Dad has a brush', 'A box drops', 'Raj and Meena grin'], first: true }
      ] },
      { id: 'p4-06c', title: 'Diwali', theme: 'festivals', s: [
        'It is Diwali.',
        'Mum and Meena get the lamps.',
        'Dad has a box of sweets.',
        'Raj and Meena munch them.',
        'Lots of lamps flash in the dark.'
      ], q: [
        { q: 'Who has a box of sweets?', a: 'Dad', opts: ['Dad', 'Mum', 'Raj'] },
        { q: 'What do Mum and Meena get?', a: 'lamps', opts: ['lamps', 'sweets', 'bench'] },
        { q: 'What happened first?', a: 'Mum and Meena get the lamps', opts: ['Mum and Meena get the lamps', 'Raj and Meena munch sweets', 'Lamps flash in the dark'], first: true }
      ] },
      { id: 'p4-06d', title: 'Lunch box', theme: 'school', s: [
        'Raj has a lunch box.',
        'In it is a bun and a plum.',
        'At lunch, Raj sits on the bench with Sam.',
        'Sam has no lunch!',
        'So Raj and Sam munch the bun and the plum.'
      ], q: [
        { q: 'Who has no lunch?', a: 'Sam', opts: ['Sam', 'Raj', 'Meena'] },
        { q: 'Where does Raj sit?', a: 'bench', opts: ['bench', 'shelf', 'chest'] },
        { q: 'What happened first?', a: 'Raj has a lunch box', opts: ['Raj has a lunch box', 'Sam has no lunch', 'They munch the bun'], first: true }
      ] }
    ],
    near: [['chest', 'chimp', 'chomp'], ['shelf', 'shell', 'shed'], ['brush', 'brick', 'bring']],
    silly: [
      { s: 'You can sit on a bench.', ok: true }, { s: 'A bench can munch lunch.', ok: false },
      { s: 'You can munch lunch.', ok: true }, { s: 'A shelf can run.', ok: false },
      { s: 'A flash is bright.', ok: true }, { s: 'A brush can sing a song.', ok: false },
      { s: 'A chest can hold things.', ok: true }, { s: 'Lunch can crash a car.', ok: false }
    ]
  }
);
