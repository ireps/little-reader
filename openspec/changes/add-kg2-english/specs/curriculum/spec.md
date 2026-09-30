## ADDED Requirements

### Requirement: Decodable guarantee
Every sentence SHALL use only graphemes and tricky words taught up to its unit.

#### Scenario: Untaught word
- **GIVEN** a story in unit p4-02 uses "night" before "igh" is taught
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
