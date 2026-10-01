## MODIFIED Requirements

### Requirement: Find it
Find it SHALL speak a word and offer it among 3 cards whose distractors are her past mix-ups first, then words from the unit's same-start set that share the target's start, then other look-alikes that share its first letter. The tapped card SHALL show its right or wrong state within 100 ms.

#### Scenario: Mix-up distractors
- **GIVEN** she picked "pots" for "plants" before
- **WHEN** "plants" is the target
- **THEN** "pots" is one of the cards

#### Scenario: First-letter guessing
- **WHEN** any Find it item is shown
- **THEN** at least 2 cards start with the target's first letter

#### Scenario: Same-start set
- **GIVEN** the unit's same-start set has the group plants, plums, pots
- **AND** she has no mix-ups for "plants"
- **WHEN** "plants" is the target
- **THEN** both distractors come from that group

### Requirement: Sequence
Content SHALL follow the Letters and Sounds order used by Oxford phonics: Phase 3 graphemes as review, then Phase 4 adjacent consonants, then Phase 5 graphemes including split digraphs, then mixed review, then early Phase 6 suffixes.

#### Scenario: Ordered units
- **WHEN** the unit list is read
- **THEN** every unit's graphemes appear no earlier than their phase allows

#### Scenario: Sound patterns
- **WHEN** Phase 5 units are reached
- **THEN** ow, oi, or, ee, ai, oa, ou, ar, sh, ch and th are each taught, and ow is taught as two families (snow and cow) side by side

#### Scenario: Suffixes last
- **WHEN** the unit list is read
- **THEN** the suffix units come after every Phase 5 unit, in the order -s and -es, -ing, -ed, -er and -est

### Requirement: Flash
Flash SHALL show a word for 2 s, hide it, and ask her to pick it from 3 look-alikes chosen as in Find it (her mix-ups, then the unit's same-start set, then other look-alikes), with no audio until she answers.

#### Scenario: Right
- **WHEN** she picks the flashed word
- **THEN** it turns green and is spoken

#### Scenario: Wrong
- **WHEN** she picks a look-alike
- **THEN** it dims and the look-alike is named; after a second miss the flashed word is shown and spoken

#### Scenario: Same-start look-alikes
- **GIVEN** "grow" is flashed and the unit's same-start set has grow, green, grin
- **WHEN** the choices appear
- **THEN** green and grin are the other two
