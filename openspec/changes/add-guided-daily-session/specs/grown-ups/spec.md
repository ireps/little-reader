## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Weekly words and story
**Reason**: Nobody will type content; all content is built in (curriculum capability).
**Migration**: Saved words move into review at box 1; the saved story is dropped.

### Requirement: Heart-letter editor
**Reason**: Heart letters are built in for every tricky word in the curriculum.
**Migration**: Custom heart edits are dropped.

### Requirement: Help words and mix-ups
**Reason**: Replaced by the progress view, which shows words to watch and mix-ups.
**Migration**: Help counts become box-0 review items; mix-ups are kept.

## ADDED Requirements

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
- **THEN** "This isn't a Little Reader backup" is shown and nothing changes

#### Scenario: Wrong app
- **WHEN** a JSON file without the app marker is chosen
- **THEN** the same message is shown and nothing changes

#### Scenario: Newer schema
- **WHEN** a backup with schema 3 is chosen
- **THEN** "This backup is from a newer version" is shown and nothing changes

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
