# Spec Delta

## Purpose

Makes every tap feel instant on the tablet by setting latency budgets for visual and audio responses and forbidding fixed waits and stalls.

## ADDED Requirements

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
- **GIVEN** a clip is playing
- **WHEN** she taps an answer
- **THEN** the audio stops and the tapped card changes within 100 ms

#### Scenario: Disabled item
- **WHEN** she taps a card that is already dimmed
- **THEN** nothing changes and no error is logged

### Requirement: Audio starts within 150 ms
Speech for an action SHALL start within 150 ms of the tap when its clip is preloaded, and within 600 ms otherwise.

#### Scenario: Preloaded clip
- **GIVEN** the clip for "come" was preloaded
- **WHEN** she taps "come"
- **THEN** playback starts within 150 ms

#### Scenario: Clip not loaded
- **GIVEN** the clip was not preloaded
- **WHEN** she taps the word
- **THEN** playback starts within 600 ms, or the tablet voice speaks it

### Requirement: No fixed waits
The next item SHALL appear as soon as the praise or feedback audio ends, with no added pause.

#### Scenario: Right answer then next item
- **WHEN** the praise clip ends
- **THEN** the next item is drawn within 100 ms

#### Scenario: Last item
- **WHEN** the last item's praise ends
- **THEN** the end screen is drawn within 100 ms

### Requirement: No stalls
No sequence SHALL wait longer than a clip's length plus 1 s for audio to finish.

#### Scenario: Ended never fires
- **GIVEN** a clip never fires its ended event
- **WHEN** it is played
- **THEN** the sequence continues no later than its duration plus 1 s

#### Scenario: Audio error
- **WHEN** a clip fails to decode
- **THEN** the tablet voice speaks the text and the sequence continues

#### Scenario: Tablet voice never finishes
- **GIVEN** onend never fires for an utterance
- **WHEN** it is spoken
- **THEN** the sequence continues within the estimated length plus 1 s

### Requirement: Highlights run with the sound
Letter and word highlighting SHALL run during the audio it matches, never before it.

#### Scenario: Sentence read-back
- **WHEN** a sentence plays
- **THEN** each word is lit while it is spoken, in order

#### Scenario: Spelling a word
- **WHEN** say-spell-say plays for "come"
- **THEN** each letter is lit while its name is spoken

### Requirement: Double taps count once
Repeated taps within one item SHALL be scored once.

#### Scenario: Double tap on the right answer
- **WHEN** she taps the right answer twice within 300 ms
- **THEN** one right answer is recorded and the next item appears once

#### Scenario: Tap after solving
- **WHEN** she taps any card after the item is solved
- **THEN** nothing is recorded
