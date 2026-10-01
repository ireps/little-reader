# performance Specification

## Purpose
Makes every tap feel instant on the tablet by setting latency budgets for visual responses and speech requests and forbidding fixed waits and stalls.

## Requirements

### Requirement: Tap feedback within 100 ms
Every tap on an answer or button SHALL produce a visible change within 100 ms.

#### Scenario: Right answer
- **GIVEN** the CPU is throttled 6x
- **WHEN** she taps the right answer
- **THEN** the card shows its right state within 100 ms

#### Scenario: Wrong answer
- **WHEN** she taps a wrong answer
- **THEN** the card shows its dimmed state within 100 ms

#### Scenario: Tap during audio
- **GIVEN** speech is playing
- **WHEN** she taps an answer
- **THEN** the speech stops and the tapped card changes within 100 ms

#### Scenario: Disabled item
- **WHEN** she taps a card that is already dimmed
- **THEN** nothing changes and no error is logged

### Requirement: Speech requested at once
Speech for an action SHALL be requested from the speech engine within 50 ms of the tap, with no delay added by the app.

#### Scenario: Idle engine
- **GIVEN** nothing is being spoken
- **WHEN** she taps "come"
- **THEN** speechSynthesis.speak is called within 50 ms

#### Scenario: Engine busy
- **GIVEN** a sentence is being spoken
- **WHEN** she taps a word
- **THEN** the sentence is cancelled and the word is requested within 130 ms

### Requirement: No fixed waits
The next item SHALL appear as soon as the praise or feedback speech ends, with no added pause.

#### Scenario: Right answer then next item
- **WHEN** the praise speech ends
- **THEN** the next item is drawn within 100 ms

#### Scenario: Last item
- **WHEN** the last item's praise ends
- **THEN** the end screen is drawn within 100 ms

### Requirement: No stalls
No sequence SHALL wait longer than the speech's estimated length plus 1 s for it to finish.

#### Scenario: Speech error
- **WHEN** the tablet voice fires an error
- **THEN** the sequence continues at once

#### Scenario: Tablet voice never finishes
- **GIVEN** onend never fires for an utterance
- **WHEN** it is spoken
- **THEN** the sequence continues within the estimated length plus 1 s

### Requirement: Highlights run with the sound
Letter and word highlighting SHALL run during the speech it matches, never before it.

#### Scenario: Sentence read-back
- **WHEN** a sentence is read aloud
- **THEN** each word is lit in order while the sentence is spoken, not before it starts

#### Scenario: Spelling a word
- **WHEN** say-spell-say runs for "come"
- **THEN** each letter is lit in order while the letter names are spoken

### Requirement: Double taps count once
Repeated taps within one item SHALL be scored once.

#### Scenario: Double tap on the right answer
- **WHEN** she taps the right answer twice within 300 ms
- **THEN** one right answer is recorded and the next item appears once

#### Scenario: Tap after solving
- **WHEN** she taps any card after the item is solved
- **THEN** nothing is recorded

### Requirement: Audio starts within 150 ms
Speech for an action SHALL start within 150 ms of the tap when its clip is preloaded, and within 600 ms or through the tablet voice otherwise.

#### Scenario: Preloaded clip
- **GIVEN** the clip for "come" was preloaded
- **WHEN** she taps "come"
- **THEN** playback starts within 150 ms

#### Scenario: Clip not loaded
- **GIVEN** the clip was not preloaded
- **WHEN** she taps the word
- **THEN** playback starts within 600 ms, or the tablet voice speaks it

#### Scenario: Clip never ends
- **GIVEN** a clip never fires its ended event
- **WHEN** it is played
- **THEN** the sequence continues no later than its duration plus 1 s
