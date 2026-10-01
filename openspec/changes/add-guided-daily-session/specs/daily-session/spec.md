# Spec Delta

## Purpose

Gives the child one button and a guided, self-advancing 10-minute session, so she never has to choose what to do or read an instruction.

## ADDED Requirements

### Requirement: Home is a garden and Start
Home SHALL show her garden and exactly one Start target, plus a small Grown-ups link.

#### Scenario: First run
- **GIVEN** no saved progress
- **WHEN** the app opens
- **THEN** an empty garden and one Start target are shown, and nothing is spoken until the first touch

#### Scenario: Returning
- **GIVEN** she has 5 flowers
- **WHEN** the app opens
- **THEN** the garden shows 5 flowers and one Start target

#### Scenario: Day finished
- **GIVEN** today's session is complete
- **WHEN** Home is shown
- **THEN** the guide says "See you tomorrow" and Start offers extra practice of due and mastered items

### Requirement: Fixed step order
A session SHALL run its steps in this order: Sounds and words, New tricky word, Silly sentences, Read with me, Maths, Garden, skipping any step with nothing to do.

#### Scenario: Normal day
- **WHEN** a session runs
- **THEN** the steps appear in the listed order

#### Scenario: Nothing due
- **GIVEN** no review items are due
- **WHEN** a session runs
- **THEN** Sounds and words shows only the new unit words and the other steps run

#### Scenario: Step not yet available
- **GIVEN** no silly sentences exist for the unit
- **WHEN** a session runs
- **THEN** the Silly sentences step is skipped and not shown on the path

#### Scenario: All units finished
- **GIVEN** the last unit is complete
- **WHEN** a session runs
- **THEN** it contains review items only

### Requirement: Moves on by itself
Each item and step SHALL advance with no Next, previous or forward control.

#### Scenario: Answer taps only
- **WHEN** a full session is completed in the test
- **THEN** only answer targets were tapped and no navigation control exists

### Requirement: One marked target
At most one target SHALL carry the highlight cue (colour and thick outline, no motion), and only after the prompt audio ends; choice items show their answer cards in one shared style instead.

#### Scenario: Waiting
- **WHEN** a single-action item waits for her
- **THEN** one element has the target style

#### Scenario: Audio playing
- **WHEN** the prompt is still playing
- **THEN** no element has the target style until the audio ends

#### Scenario: Portrait
- **GIVEN** the viewport is 800x1094
- **WHEN** an item waits
- **THEN** one element has the target style

### Requirement: Re-prompting
After 8 s with no tap, the app SHALL repeat the spoken instruction, up to 3 times, then show a single "Tap to go on" target.

#### Scenario: Idle once
- **WHEN** 8 s pass with no tap
- **THEN** the same instruction is spoken again

#### Scenario: Idle four times
- **WHEN** 32 s pass with no tap
- **THEN** the guide shows its waiting pose with one "Tap to go on" target and speaks no more

#### Scenario: Tap during a re-prompt
- **WHEN** she taps an answer while the re-prompt plays
- **THEN** the re-prompt stops and the answer is scored

### Requirement: She tries first
No word, sentence or answer she must read SHALL be spoken before she attempts it; only the target word in listening tasks is spoken first.

#### Scenario: Sentence screens
- **WHEN** a sentence to read is shown
- **THEN** no control plays it before she has answered or the grown-up has tapped the check target

#### Scenario: Answer reveal
- **WHEN** an item is answered
- **THEN** the right answer is spoken after the tap

### Requirement: No mode switch
Child screens SHALL contain no mode switch.

#### Scenario: DOM check
- **WHEN** every child screen is scanned
- **THEN** no Together, My turn or other mode control exists

### Requirement: Errorless finish
After 2 misses on an item, the app SHALL show and say the answer, record a miss and move on.

#### Scenario: Two misses
- **WHEN** she misses an item twice
- **THEN** the right answer turns green and is spoken, a miss is recorded, and the next item follows

#### Scenario: Miss then right
- **WHEN** she misses once and then answers right
- **THEN** the item counts as right but not first-try, and the box does not move up

### Requirement: About 10 minutes
A session SHALL aim at about 10 minutes and, after 12 minutes, cut each remaining step to one item (Read with me to one story).

#### Scenario: Slow day
- **GIVEN** 12 minutes have passed during Sounds and words
- **WHEN** the next step starts
- **THEN** each remaining step has one item

#### Scenario: Fast day
- **WHEN** she finishes in 8 minutes
- **THEN** no extra items are added

### Requirement: Resume
Leaving and returning on the same day SHALL resume at the same item.

#### Scenario: Home mid-step
- **WHEN** she holds Home at item 4 of Sounds and words and then taps Start
- **THEN** item 4 is shown again

#### Scenario: Reload or sleep
- **WHEN** the page reloads mid-session
- **THEN** Start resumes at the same item

#### Scenario: Next day
- **GIVEN** yesterday's session was unfinished
- **WHEN** she taps Start today
- **THEN** a new session is planned and the unfinished items are due

### Requirement: Read with me needs a grown-up
The Read with me step SHALL ask for a grown-up, and skipping it SHALL need a 2 s hold.

#### Scenario: Grown-up present
- **WHEN** Read with me starts
- **THEN** the guide says "Read to your grown-up"

#### Scenario: Hold to skip
- **WHEN** "Not today" is held for 2 s
- **THEN** the step ends and the story is offered first next session

#### Scenario: Quick tap
- **WHEN** "Not today" is tapped briefly
- **THEN** nothing is skipped

### Requirement: Mixed tasks
Items SHALL be ordered so that one task type never runs more than 3 times in a row.

#### Scenario: Sequence check
- **WHEN** a planned session is inspected
- **THEN** no 4 consecutive items share a task type, unless only one type is available
