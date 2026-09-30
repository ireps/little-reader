## MODIFIED Requirements

### Requirement: Clip first, else tablet voice
Speech SHALL play the pre-made clip for the text, made from an Indian English female computer voice, and use the tablet's text-to-speech only when no clip exists or the clip fails.
(Previously: clips were an unused hook and the tablet voice spoke everything.)

#### Scenario: Word with a clip
- **WHEN** the word "come" is spoken
- **THEN** its clip plays and the tablet voice is not used

#### Scenario: Sentence, letter name, number name and app phrase
- **WHEN** any of these is spoken
- **THEN** its clip plays

#### Scenario: No clips
- **GIVEN** a string has no clip
- **WHEN** it is spoken
- **THEN** the tablet voice speaks it and the app carries on

#### Scenario: Clip fails
- **GIVEN** a clip returns 404 or fails to decode
- **WHEN** it is played
- **THEN** the tablet voice speaks the text

### Requirement: New action stops old speech
Starting a new action SHALL stop any playing clip or utterance and clear its highlights.
(Previously: this covered the tablet voice only.)

#### Scenario: Tap mid-sentence
- **WHEN** she taps a word while a sentence clip plays
- **THEN** the sentence stops, no word stays lit, and the word plays

#### Scenario: Leaving a screen
- **WHEN** she goes Home during a clip
- **THEN** the clip stops

## ADDED Requirements

### Requirement: Complete clip coverage
Every string the app can say SHALL have a clip.

#### Scenario: Full coverage
- **WHEN** every lesson is played through with logging on
- **THEN** zero missing clips are logged

#### Scenario: New word without a clip
- **GIVEN** a word is added to the word lists without a clip
- **WHEN** npm test runs
- **THEN** the coverage test fails and names the word

### Requirement: One clip per sentence
A sentence SHALL play as one clip, with each word lit while it is spoken.

#### Scenario: Read-back
- **WHEN** a sentence is read back
- **THEN** one clip plays and the words light in order

#### Scenario: Stopped mid-sentence
- **WHEN** playback is stopped halfway
- **THEN** no word stays lit

### Requirement: Joined phrases
A sequence of clips SHALL play with no gap longer than 150 ms between them.

#### Scenario: Praise plus word
- **WHEN** "Yes!" and "come" play as a sequence
- **THEN** the gap between them is at most 150 ms

### Requirement: Speed setting
Speech speed SHALL follow the Grown-ups setting for both clips and the tablet voice.

#### Scenario: Slow
- **GIVEN** speed is set to 0.8
- **WHEN** a clip plays
- **THEN** its playback rate is 0.8

### Requirement: No sound before the first touch
The app SHALL play no sound until the first touch on the page.

#### Scenario: First load
- **WHEN** the app opens
- **THEN** it is silent until the first touch, and after it speech works
