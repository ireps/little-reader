# grown-ups Specification

## Purpose

Describes the Grown-ups area where a parent enters the week's content and adjusts settings, as shipped in Phases 0 to 2.

## Requirements

### Requirement: Sum gate
The Grown-ups area SHALL open only after the right answer to a sum from 11 to 18 is tapped on an on-screen number pad, after a 2 s hold on the Grown-ups link.
(Previously: a typed answer to a two-digit sum.)

#### Scenario: Right answer
- **WHEN** the right sum is tapped on the number pad
- **THEN** the settings are shown

#### Scenario: Wrong answer
- **WHEN** a wrong answer is tapped
- **THEN** the pad clears and a new sum is shown

### Requirement: Voice and speed
Grown-ups SHALL let a parent set speech speed from 0.75 to 1.1 and test the voice.
(Previously: a voice picker and speed from 0.5 to 1.1.)

#### Scenario: Speed
- **WHEN** the speed is changed
- **THEN** it is saved and used for all speech

#### Scenario: Test
- **WHEN** Test voice is tapped
- **THEN** a short sentence is spoken at the chosen speed

### Requirement: Progress view
Grown-ups SHALL show her current unit, flower count, words to watch (most misses and mix-ups) and the last 7 days' minutes and first-try accuracy.

#### Scenario: Data shown
- **GIVEN** 3 sessions have run
- **WHEN** Grown-ups opens
- **THEN** the unit, flowers, words to watch and 3 days of results are shown

### Requirement: Where is she
Grown-ups SHALL let a parent choose her current unit by tapping it in a list.

#### Scenario: Change unit
- **WHEN** unit p4-03 is tapped
- **THEN** the next session is planned from p4-03

### Requirement: Practise one game
Grown-ups SHALL let a parent open any single activity outside the session.

#### Scenario: Open and return
- **WHEN** Find it is chosen
- **THEN** it runs alone and returns to Grown-ups at the end, and results still update progress

### Requirement: Backup
Grown-ups SHALL download all progress as a file named YYYY-MM-DD.littlereader.json.

#### Scenario: File contents
- **WHEN** Save a backup is tapped
- **THEN** a JSON file with the schema-2 state and an app marker is downloaded

### Requirement: Restore
Grown-ups SHALL restore a backup file only after checking it, confirming, and passing it through validation.

#### Scenario: Good file
- **WHEN** a valid backup is chosen and confirmed
- **THEN** progress is replaced by the file's contents

#### Scenario: Bad JSON
- **WHEN** a file that is not JSON is chosen
- **THEN** "That file isn't a Little Reader backup" is shown and nothing changes

#### Scenario: Wrong app
- **WHEN** a JSON file without the app marker is chosen
- **THEN** the same message is shown and nothing changes

#### Scenario: Newer schema
- **WHEN** a backup with schema 3 is chosen
- **THEN** "That backup is from a newer version of Little Reader" is shown and nothing changes

#### Scenario: Too big
- **WHEN** a file over 1 MB is chosen
- **THEN** it is rejected with a clear message and nothing changes

### Requirement: Reset
Resetting all progress SHALL need two taps on two separate screens.

#### Scenario: One tap
- **WHEN** Reset is tapped once
- **THEN** a confirm screen is shown and nothing is deleted

#### Scenario: Two taps
- **WHEN** the confirm is tapped
- **THEN** all progress is cleared and the app starts at p4-01

### Requirement: Maths progress
The Grown-ups progress view SHALL list each unlocked maths skill with its level and box.

#### Scenario: Skills shown
- **GIVEN** compare and count are unlocked
- **WHEN** Grown-ups opens
- **THEN** both are listed with their level and whether they are mastered

### Requirement: Equals sign setting
Grown-ups SHALL have an Equals sign switch, off by default, that adds = to comparing rounds.

#### Scenario: Default
- **WHEN** the app is new
- **THEN** the switch is off

#### Scenario: Turned on
- **WHEN** the switch is turned on
- **THEN** it is saved and the next comparing rounds can include =

### Requirement: Clips switch
Grown-ups SHALL let a parent turn the voice clips on or off, and the choice SHALL be saved.

#### Scenario: Clips off
- **WHEN** clips are turned off
- **THEN** the tablet voice speaks everything

#### Scenario: Default
- **WHEN** the app is new
- **THEN** clips are on

### Requirement: Captions switch
Grown-ups SHALL let a parent keep the on-screen captions on while clips play; captions SHALL be off by default when clips are on.

#### Scenario: Default
- **GIVEN** clips are on
- **WHEN** a clip plays
- **THEN** no caption is shown

#### Scenario: Captions kept on
- **WHEN** Show captions is turned on
- **THEN** captions show while clips play

### Requirement: Pace setting
Grown-ups SHALL offer a pace of Calm, Normal or Quick, saved with her progress and Calm by default. The pace SHALL set how long a finished item stays on screen before the next one (about 1.4 s, 0.7 s or 0.25 s) and how much slower letter sweeps, the Flash look and animations run.

#### Scenario: Default
- **WHEN** the app is new
- **THEN** the pace is Calm

#### Scenario: Answer stays on screen
- **GIVEN** the pace is Calm
- **WHEN** she taps the right answer and the praise ends
- **THEN** the green answer stays on screen for about 1.4 s before the next item

#### Scenario: Odd stored value
- **WHEN** the stored pace is not one of the three
- **THEN** it is read as Calm
