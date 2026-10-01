/* Everything the app says that isn't course content: instructions, praise, hints and the fixed parts of
   sentences built around a word ({w}). tools/list-clips.js turns these, the course and the maths into the list of
   voice clips (tools/clip-list.txt); a {w} sentence is played as its fixed parts plus the word's own clip.
   The tests record everything said and fail if any of it can't be played from the list. */
window.LR = window.LR || {};
LR.phrases = [
  /* Instructions */
  'Find the word you hear', 'Build the word you hear', 'Find its picture', 'Find the heart letters', 'Find the picture',
  'Look!', 'Which one was it?', 'Is it silly?', 'A or an?', 'Which picture?', 'Which word needs a big letter?',
  'Read to your grown-up', 'Tap the tick when done', 'Tap to go on', 'Hold to go home', 'A grown-up can hold this', 'Hold it',
  'Which is more?', 'Which mouth fits?', 'Look again. Which mouth fits?', 'Count the dots. Which has more?', 'Come and read with me.',
  /* Praise and feedback */
  'Yes! {w}', 'Yes! That one is tricky.', 'You found them all! {w}.', 'These are the heart letters.', 'That one sounds the way it looks.',
  'That says {w}.', 'That says {w}. This one says {w}.', 'That says {w}. Try again.', 'It was {w}.', 'It is {w}.', 'Not that one.',
  'Not that one. Try again.', 'That is a {w}.', 'This is the {w}.', 'Same trick: {w}', 'Like {w}.',
  '{w} Yes, that makes sense!', '{w} Yes, that is silly!', '{w} That makes sense.', '{w} That is silly!',
  '{w}, {w}! They rhyme.', '{w}, {w}. They rhyme.', '{w}, {w}. They don’t rhyme.', 'What rhymes with {w}?',
  'Yes! {w} means more than one.', '{w} means more than one.', '{w} means just one.', 'We say {w}.',
  'Yes! A sentence starts with a big letter.', 'The first word gets a big letter.', 'Here the ball is {w} the box.',
  'Not {w}. Think about the story.', 'You grew {w} flower', 'You grew {w} flowers!', 'You grew 1 flower!', 'Well done! Your seeds are growing.',
  /* Comparing (the crocodile) */
  'Chomp!', '{w} is greater than {w}', '{w} is less than {w}', '{w} is equal to {w}', 'The mouth opens to {w}.', 'Yes! {w} is greater than {w}.',
  'Yes! {w} is less than {w}.', 'Yes! {w} is equal to {w}.'
];
