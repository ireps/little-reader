# curriculum Specification

## Purpose
Ships all reading content inside the app as original, decodable units in the Letters and Sounds order, so no grown-up ever types content.

## Requirements

### Requirement: Built in
All words, stories, sentences and pictures SHALL ship with the app, and grown-ups SHALL NOT need to type content.

#### Scenario: First run
- **GIVEN** a new install with no saved data
- **WHEN** Start is tapped
- **THEN** a full session runs with no setup

### Requirement: Original text
Unit text SHALL be original, with no third-party copyrighted content.

#### Scenario: Licence note
- **WHEN** README is read
- **THEN** it states that the content is original and lists the public-domain word lists used

### Requirement: Pictures
Content pictures SHALL be emoji from Unicode 8 or older, or inline SVG.

#### Scenario: Code points
- **WHEN** the unit data is scanned
- **THEN** every emoji is from Unicode 8 or older

### Requirement: Starting point
A new install SHALL start at Phase 4 (adjacent consonants), with come, some, from, have, many and also known at box 1.

#### Scenario: New install
- **WHEN** the first session is planned
- **THEN** it uses unit p4-01 and those 6 words are in review

### Requirement: Decodable guarantee
Every word she reads (unit words, story sentences, silly sentences and answer choices) SHALL use only graphemes and tricky words taught up to its unit; spoken questions are exempt.

#### Scenario: Untaught word
- **GIVEN** a story in unit p4-02 uses "cake" before "a_e" is taught
- **WHEN** npm test runs
- **THEN** the decodability test fails and names the word and unit

### Requirement: Unit size
Each unit SHALL have 8 to 12 decodable words, 1 to 3 tricky words, 2 stories of 4 to 6 sentences, 8 silly sentences and a picture for every picturable word.

#### Scenario: Count test
- **WHEN** npm test runs
- **THEN** every unit meets these counts or the test names the unit and the field

### Requirement: Themes
Stories SHALL use early-years themes (plants, animals, food, body, transport, weather, helpers) with Indian settings and British spelling.

#### Scenario: Themes tagged
- **WHEN** the unit list is read
- **THEN** every unit has a theme from the list

### Requirement: Full sequence
The curriculum SHALL contain units from Phase 3 review to the end of Phase 5.

#### Scenario: Last unit
- **WHEN** the last unit is complete
- **THEN** every Phase 5 grapheme and the Phase 2 to 5 tricky words have been taught
