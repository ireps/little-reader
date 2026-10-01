## MODIFIED Requirements

### Requirement: Story choice
The day's story SHALL be the current unit's least recently read story, so the unit's 4 stories take turns.

#### Scenario: Rotation
- **GIVEN** story a was read yesterday and story b never
- **WHEN** Read with me starts today
- **THEN** story b is used

#### Scenario: All four
- **GIVEN** a unit's 4 stories
- **WHEN** Read with me runs on 4 days in a row
- **THEN** each story is read once

### Requirement: Story questions
Each story SHALL have 3 questions: who, where or what questions, and one "What happened first?". After the last sentence, Read with me SHALL ask 2 of them, a different pair each day in turn (1 and 2, then 2 and 3, then 3 and 1, by the date: days since 1 January 2000, in threes), so rereads bring the others. Answers SHALL be words or short phrases she reads, with a picture where one exists, and the question is spoken. A tapped answer SHALL show its state within 100 ms, and the caption SHALL never show the answer.

#### Scenario: Answered
- **WHEN** she picks the frog for "Who can jump?"
- **THEN** it turns green and the step ends

#### Scenario: Wrong
- **WHEN** she picks the hen
- **THEN** it dims; after a second miss the right answer is shown and spoken

#### Scenario: What happened first
- **GIVEN** a story where Raj gets a chip and then the moth sits on it
- **WHEN** "What happened first?" is asked with "Raj gets a chip" among the choices
- **THEN** picking "Raj gets a chip" turns it green and it is spoken

#### Scenario: Pairs take turns
- **GIVEN** today is 9133 days after 1 January 2000 (9133 mod 3 = 1)
- **WHEN** Read with me ends today
- **THEN** questions 2 and 3 are asked; on the next day, questions 3 and 1
