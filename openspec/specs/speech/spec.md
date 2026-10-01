# speech Specification

## Purpose

Defines how the app speaks: which voice it picks, the clip hook, and the guarantee that speech never blocks the app.

## Requirements

### Requirement: Clip first, else tablet voice
Speech SHALL play the clip supplied for the text, in an Indian English female computer voice, and use the tablet's text-to-speech only when no clip exists, the clip fails, or clips are switched off.
(Previously: clips were an unused hook and the tablet voice spoke everything.)

#### Scenario: No clips
- **GIVEN** a string has no clip
- **WHEN** it is spoken
- **THEN** the tablet voice speaks it and the app carries on

#### Scenario: Word with a clip
- **WHEN** the word "come" is spoken
- **THEN** its clip plays and the tablet voice is not used

#### Scenario: Clip fails
- **GIVEN** a clip returns 404 or fails to decode
- **WHEN** it is played
- **THEN** the tablet voice speaks the text

### Requirement: Voice choice
Without a saved choice, the app SHALL prefer a female English voice in the order en-IN, en-GB, en-US, then any English voice.

#### Scenario: One voice
- **GIVEN** the tablet has only "English United States" (en_US)
- **WHEN** a voice is chosen
- **THEN** that voice is used, with the lang normalised to en-US

### Requirement: Speech always settles
Every speech request SHALL resolve, whether it ends, errors or times out.

#### Scenario: End event never fires
- **GIVEN** the browser never fires onend
- **WHEN** a word is spoken
- **THEN** the promise resolves after the timeout and the lesson carries on

### Requirement: New action stops old speech
Starting a new action SHALL stop any speech in progress and clear its highlights.
(Previously: highlights could stay lit after a stop.)

#### Scenario: Tap mid-sentence
- **WHEN** she taps a word while a sentence is being read
- **THEN** the sentence stops, no word stays lit, and the word is spoken

#### Scenario: Leaving a screen
- **WHEN** she goes Home during speech
- **THEN** the speech stops

### Requirement: One utterance per sentence
A sentence SHALL be spoken as one utterance, with each word lit while it is spoken, using boundary events when the engine sends them and a calibrated estimate otherwise.

#### Scenario: Read-back
- **WHEN** a sentence is read aloud
- **THEN** one utterance is requested and the words light in order

#### Scenario: No boundary events
- **GIVEN** the engine sends no boundary events
- **WHEN** a sentence is read aloud
- **THEN** the words still light in order from the estimate

#### Scenario: Stopped mid-sentence
- **WHEN** speech is stopped halfway
- **THEN** no word stays lit

### Requirement: Joined phrases
Praise and the word it names SHALL be spoken as one utterance, and say-spell-say SHALL use no more than 3 utterances.

#### Scenario: Praise plus word
- **WHEN** she finds "come"
- **THEN** "Yes! come" is requested as a single utterance

#### Scenario: Say-spell-say
- **WHEN** say-spell-say runs for "come"
- **THEN** exactly 3 utterances are requested: the word, the letter names, the word

### Requirement: No sound before the first touch
The app SHALL request no speech until the first touch on the page, and SHALL warm up the speech engine on that touch.

#### Scenario: First load
- **WHEN** the app opens
- **THEN** no speech is requested until the first touch, and after it speech works

### Requirement: Placeholder captions
Until voice clips arrive (Phase 7), everything the app speaks SHALL also appear as a caption on screen for as long as it is being spoken.

#### Scenario: Caption shown
- **WHEN** the app says "Find the word you hear"
- **THEN** a caption strip shows "Find the word you hear" while it is spoken and clears when speech ends

#### Scenario: No voice available
- **GIVEN** the tablet voice is unavailable or silent
- **WHEN** the app speaks
- **THEN** the caption still shows the text and the lesson carries on

#### Scenario: Never gives the answer away
- **WHEN** Word detective says the word she must find
- **THEN** the caption shows "Find the word you hear" instead of the word

#### Scenario: Fits the screen
- **GIVEN** the viewport is 1280x614
- **WHEN** a caption is shown
- **THEN** it does not cover any tap target and nothing scrolls

### Requirement: Complete clip coverage
Every string the app can say SHALL be playable from the clips in `tools/clip-list.txt`, whole or as its longest phrases.

#### Scenario: Full coverage
- **WHEN** npm test runs
- **THEN** everything said during the tests resolves to keys in the clip list

#### Scenario: New string without a clip
- **GIVEN** a story sentence is added and the list is not regenerated
- **WHEN** npm test runs
- **THEN** the test fails and says the clip list is out of date

#### Scenario: Clip not supplied
- **GIVEN** the list has a key with no supplied clip
- **WHEN** it is spoken
- **THEN** the tablet voice says the whole text with its caption

### Requirement: Clip sentences
A sentence with a clip SHALL play as one clip, with each word lit at the start time recorded for it.

#### Scenario: Read-back
- **WHEN** a sentence with a clip is read aloud
- **THEN** one clip plays and each word lights at its recorded offset

### Requirement: Joined clip sequences
Text spoken as several clips SHALL play with no gap longer than 150 ms between them.

#### Scenario: Praise plus word
- **WHEN** "Yes! come" plays as the clips "yes" and "come"
- **THEN** the gap between them is at most 150 ms
