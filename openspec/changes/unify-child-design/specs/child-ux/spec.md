## ADDED Requirements

### Requirement: Consistent design language
Every child screen SHALL draw shared elements the same way. Sun yellow SHALL be used only by the one primary target. The replay control SHALL appear only under the guide's words. Every answer card SHALL have the same minimum size. Text she reads SHALL be in Andika Regular on flat paper, while answer targets are raised. A missing piece SHALL be marked by one dashed box with a "?" that fills in solid green when answered. Taps still show feedback within 100 ms, and every colour cue keeps a non-colour partner (the check or dot mark, the dashed or solid edge, the tick on done steps).

#### Scenario: Current step on the path
- **WHEN** a choice screen waits for an answer
- **THEN** the current path step is leaf green, and nothing on the screen is sun yellow

#### Scenario: Replay
- **WHEN** a screen offers replay (Find it, Build it, Word order, maths, language, My world, story questions, the crocodile, Find the heart letters)
- **THEN** the replay control is under the guide's words (beside them in portrait), never among the answers

#### Scenario: Answer cards
- **WHEN** any choice screen is shown at 1280x614 or 800x1094
- **THEN** all its answer cards share one minimum size, whatever they show

#### Scenario: Reading text
- **WHEN** a word, letter or sentence to read appears in a question or answer
- **THEN** it is in Andika Regular, and if it is not tappable it sits flat on paper with no raised edge

#### Scenario: Missing piece
- **WHEN** a question has a gap (a/an, is/are, he/she/they, a sequence, a pattern, the number line, the crocodile's mouth)
- **THEN** the gap is a dashed box with a "?", and a right answer fills it in solid green
