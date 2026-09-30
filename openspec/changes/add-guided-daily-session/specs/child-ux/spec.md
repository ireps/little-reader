## ADDED Requirements

### Requirement: Spoken prompts
Every child screen SHALL speak its instruction in at most 6 words, and a re-prompt SHALL use the same words.

#### Scenario: Each activity
- **WHEN** any child activity item is shown
- **THEN** its instruction is spoken and is at most 6 words

#### Scenario: Re-prompt
- **WHEN** the instruction is repeated after idle time
- **THEN** the words are identical

### Requirement: No reading needed for instructions
Each child screen SHALL be usable by a child who cannot read its instruction text.

#### Scenario: Instruction text hidden
- **WHEN** the prototype review hides all instruction text
- **THEN** every screen can still be completed from the speech, icons and the target cue

### Requirement: One primary target
Exactly one child element SHALL use the primary style at any time.

#### Scenario: Waiting for an answer
- **WHEN** an item waits
- **THEN** one element has the primary style

#### Scenario: After an answer
- **WHEN** an item is answered
- **THEN** the primary style moves to the next target or disappears

### Requirement: Her attempt is most prominent
No control that reads content aloud SHALL be styled more prominently than her answer targets.

#### Scenario: Replay control
- **WHEN** a replay control is shown
- **THEN** it is smaller than the answer targets and uses the quiet style

### Requirement: Space
Child screens SHALL use at least 70% of the viewport height without scrolling.

#### Scenario: Landscape
- **GIVEN** 1280x614
- **WHEN** any child screen is shown
- **THEN** its content spans at least 70% of the height and nothing scrolls

#### Scenario: Portrait
- **GIVEN** 800x1094
- **WHEN** any child screen is shown
- **THEN** its content spans at least 70% of the height and nothing scrolls

### Requirement: Progress path
A session SHALL show a path of its steps with the current step lit, and a row of seeds for the items in the current step.

#### Scenario: Current step
- **WHEN** New tricky word is running
- **THEN** its icon on the path is lit and the earlier ones are marked done

#### Scenario: Seed fills
- **WHEN** an item is finished
- **THEN** one more seed is filled

### Requirement: Guide character
An SVG guide character SHALL show a pose for waiting, listening, happy and thinking, changed without motion.

#### Scenario: Pose changes
- **WHEN** she answers right, answers wrong, or the app waits
- **THEN** the pose becomes happy, thinking or waiting, respectively

### Requirement: Fading hearts
Heart marks in reading SHALL be hidden for mastered words and shown for the rest.

#### Scenario: Mastered word
- **GIVEN** "come" is at box 3
- **WHEN** it appears in a story sentence
- **THEN** it shows no hearts

#### Scenario: Unmastered word
- **GIVEN** "said" is at box 1
- **WHEN** it appears in a story sentence
- **THEN** its hearts are shown

### Requirement: Holds to leave
Leaving a session through Home SHALL need a 1 s hold, and opening Grown-ups from Home SHALL need a 2 s hold.

#### Scenario: Quick tap
- **WHEN** Home is tapped briefly during a session
- **THEN** the session stays and the hold ring shows a hint

#### Scenario: Hold
- **WHEN** Home is held for 1 s
- **THEN** Home is shown and the session can resume
