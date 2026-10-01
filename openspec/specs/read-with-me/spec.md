# read-with-me Specification

## Purpose
Lets the child read a decodable story aloud to her grown-up, one sentence at a time, with help that the grown-up gives and the app records.

## Requirements

### Requirement: One sentence per screen
Read with me SHALL show one decodable sentence per screen at 56 to 64 px, with no audio of the sentence before her attempt.

#### Scenario: Story start
- **WHEN** Read with me starts
- **THEN** the first sentence is shown silently after the spoken "Read to your grown-up"

### Requirement: Grown-up marks
A tap on a word SHALL play that word and mark it stumbled.

#### Scenario: One word
- **WHEN** the grown-up taps "jump"
- **THEN** "jump" is spoken and w:jump moves down one box

#### Scenario: Several words
- **WHEN** three words are tapped in one sentence
- **THEN** each is spoken and marked once

### Requirement: Check plays and moves on
The check target SHALL play the sentence with synced word highlighting and then show the next sentence.

#### Scenario: Last sentence
- **WHEN** the check target is tapped on the last sentence
- **THEN** the sentence plays and the step ends

#### Scenario: Tap during playback
- **WHEN** the check target is tapped again while the sentence plays
- **THEN** the tap is ignored

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
- **THEN** it dims; after a second miss the right answer is shown and spoken
