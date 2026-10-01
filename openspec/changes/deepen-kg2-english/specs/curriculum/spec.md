## MODIFIED Requirements

### Requirement: Starting point
A new install SHALL start at Phase 4 (adjacent consonants), with come, some, from, have, many and also known at box 1. The Phase 2 and 3 tricky words she is assumed to know (the, to, I, no, go, into, me, be, are) SHALL also be in review at box 1, for new installs and for existing ones that don't have them yet.

#### Scenario: New install
- **WHEN** the first session is planned
- **THEN** it uses unit p4-01, and those 6 words and the 9 base tricky words are in review

#### Scenario: Existing install
- **GIVEN** saved progress from before this change, without "the" in review
- **WHEN** the next session is planned
- **THEN** the 9 base tricky words are added at box 1 and nothing she already has changes

#### Scenario: Mastered drop out
- **GIVEN** "the" was right first time on 3 separate days
- **WHEN** later sessions are planned
- **THEN** "the" returns only at the mastered interval, like any other word

### Requirement: Decodable guarantee
Every word she reads (unit words, story sentences, silly sentences and answer choices) SHALL use only graphemes, suffixes and tricky words taught up to its unit; spoken questions are exempt. A word with a suffix (-s, -es, -ing, -ed, -er, -est) is decodable only once that suffix's unit is reached and its root is decodable.

#### Scenario: Untaught word
- **GIVEN** a story in unit p4-02 uses "cake" before "a_e" is taught
- **WHEN** npm test runs
- **THEN** the decodability test fails and names the word and unit

#### Scenario: Suffix too early
- **GIVEN** a story in unit p5-03 uses "jumped" before the -ed unit
- **WHEN** npm test runs
- **THEN** the decodability test fails and names the word and unit

#### Scenario: Suffix taught
- **GIVEN** the -ing unit has been reached
- **WHEN** "jumping" appears in a story
- **THEN** it passes, because "jump" is decodable and -ing is taught

### Requirement: Unit size
Each unit SHALL have 8 to 12 decodable words, 1 to 3 tricky words, 4 stories of 4 to 6 sentences with 3 questions each, 8 silly sentences, a same-start set of at least 3 groups, and a picture for every picturable word.

#### Scenario: Count test
- **WHEN** npm test runs
- **THEN** every unit meets these counts or the test names the unit and the field

#### Scenario: Same-start groups
- **WHEN** a unit's same-start set is read
- **THEN** each group has 3 or more decodable words that share their first 1 or 2 letters and differ after them, and at least one word in the set is from the unit

### Requirement: Themes
Stories SHALL use early-years themes (plants, animals, food, body, transport, weather, helpers, family, home, school, festivals, seasons, safety) with Indian settings and British spelling.

#### Scenario: Themes tagged
- **WHEN** the unit list is read
- **THEN** every unit and every story has a theme from the list

#### Scenario: New themes used
- **WHEN** the stories are counted by theme
- **THEN** each of family, home, school, festivals, seasons and safety has at least 2 stories

### Requirement: Full sequence
The curriculum SHALL contain units from Phase 3 review to the end of Phase 5, then 2 mixed review units, then early Phase 6 suffix units: -s and -es, -ing, -ed (said t, d and id) and -er and -est, on roots whose spelling doesn't change.

#### Scenario: Last unit
- **WHEN** the last unit is complete
- **THEN** every Phase 5 grapheme, the Phase 2 to 5 tricky words and the 4 suffix groups have been taught

#### Scenario: Roots stay the same
- **WHEN** the suffix units' words are read
- **THEN** none needs a doubled letter or a dropped e (no "hopping" or "making")
