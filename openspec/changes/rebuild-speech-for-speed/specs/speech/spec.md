## MODIFIED Requirements

### Requirement: New action stops old speech
Starting a new action SHALL stop any speech in progress and clear its highlights.
(Previously: highlights could stay lit after a stop.)

#### Scenario: Tap mid-sentence
- **WHEN** she taps a word while a sentence is being read
- **THEN** the sentence stops, no word stays lit, and the word is spoken

#### Scenario: Leaving a screen
- **WHEN** she goes Home during speech
- **THEN** the speech stops

## ADDED Requirements

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
