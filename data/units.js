/* The built-in course (Phase 4: the first units). Original text, written for this app.
   Letters and Sounds Phase 4: adjacent consonants, with Phase 2 and 3 sounds and tricky words assumed known.
   Each unit: its sounds, 8 to 12 decodable words, its new tricky words, and 2 stories of 4 to 6 sentences.
   Phase 5 adds the rest of the course and a test that every word is decodable for its unit. */
window.LR = window.LR || {};
LR.units = [
  {
    id: 'p4-01', title: 'Ends: st, nd, mp, nk, lk, lt', sounds: ['st', 'nd', 'mp', 'nk', 'lk', 'lt'],
    words: ['jump', 'lamp', 'hand', 'pond', 'nest', 'tent', 'milk', 'sink', 'desk', 'belt'],
    tricky: ['said', 'like'],
    stories: [
      { id: 'p4-01a', title: 'The frog', s: [
        'A frog sat on a log in the pond.',
        'It can jump and it can swim.',
        'Raj said, "Jump, frog, jump!"',
        'The frog did a big jump.',
        'Splash! It went into the pond.'
      ] },
      { id: 'p4-01b', title: 'Milk', s: [
        'Meena has a cup of milk.',
        'She sat at the desk with it.',
        'The cup fell into the sink.',
        'Mum said, "Do not be sad."',
        'Meena had milk and a bun.'
      ] }
    ]
  },
  {
    id: 'p4-02', title: 'Starts: st, sp, sn, sl, sw', sounds: ['st', 'sp', 'sn', 'sl', 'sw'],
    words: ['stop', 'step', 'spot', 'spin', 'snap', 'snack', 'slip', 'slug', 'swim', 'star'],
    tricky: ['so', 'do'],
    stories: [
      { id: 'p4-02a', title: 'The slug', s: [
        'A slug is on the step.',
        'It is so slim and wet.',
        'Can it swim? No, it can not.',
        'A duck spots the slug.',
        'Stop, duck! Let the slug go.'
      ] },
      { id: 'p4-02b', title: 'Snack time', s: [
        'It is time for a snack.',
        'Raj has a bun with jam.',
        'Meena has nuts in a cup.',
        'Do not spill the jam, Raj!',
        'Snap! The bun is in bits.'
      ] }
    ]
  },
  {
    id: 'p4-03', title: 'Starts: fl, cl, pl, gl, dr, fr, gr, tr, cr', sounds: ['fl', 'cl', 'pl', 'gl', 'dr', 'fr', 'gr', 'tr', 'cr'],
    words: ['flag', 'clap', 'plum', 'glad', 'drum', 'frog', 'grin', 'trip', 'crab', 'trunk'],
    tricky: ['were', 'there'],
    stories: [
      { id: 'p4-03a', title: 'The drum', s: [
        'Raj has a big red drum.',
        'Bang, bang, bang!',
        'Meena can clap and grin.',
        'They were so glad.',
        'There is a band on the step!'
      ] },
      { id: 'p4-03b', title: 'The trip', s: [
        'We went on a trip to the hills.',
        'There were plums and nuts.',
        'Is it a crab? No, it is a frog!',
        'The frog hops on a flat rock.',
        'We had fun on the trip.'
      ] }
    ]
  },
  {
    id: 'p4-04', title: 'Both ends: plant, stand, drink', sounds: ['CCVCC'],
    words: ['plant', 'stand', 'drink', 'crisp', 'stamp', 'blink', 'twist', 'frost', 'spend', 'crust'],
    tricky: ['little', 'one', 'what', 'when'],
    stories: [
      { id: 'p4-04a', title: 'The little plant', s: [
        'Meena has a little plant in a pot.',
        'She gets a drink for it.',
        'Drip, drip, drip!',
        'What will it be?',
        'It will be a big plant with buds.'
      ] },
      { id: 'p4-04b', title: 'One leg', s: [
        'Raj can stand on one leg.',
        'Can Meena stand on one leg?',
        'She can! Then she tips.',
        'When she tips, Raj tips!',
        'Bump! Meena and Raj grin.'
      ] }
    ]
  }
];
/* Tricky words she knows already (the owner's list): in review from the first session. */
LR.knownTricky = ['come', 'some', 'from', 'have', 'many', 'also'];
