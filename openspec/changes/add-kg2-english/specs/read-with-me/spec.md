## ADDED Requirements

### Requirement: Story choice
The day's story SHALL be the current unit's least recently read story.

#### Scenario: Rotation
- **GIVEN** story a was read yesterday and story b never
- **WHEN** Read with me starts today
- **THEN** story b is used

### Requirement: Story questions
After the last sentence, Read with me SHALL ask 1 or 2 who or what questions with picture answers.

#### Scenario: Answered
- **WHEN** she picks the frog for "Who can jump?"
- **THEN** it turns green and the step ends

#### Scenario: Wrong
- **WHEN** she picks the hen
- **THEN** it dims and the sentence with the answer is shown and spoken
