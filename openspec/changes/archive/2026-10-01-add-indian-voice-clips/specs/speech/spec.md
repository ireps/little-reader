## MODIFIED Requirements

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

## ADDED Requirements

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
