## MODIFIED Requirements

### Requirement: Fixed step order
A session SHALL run its steps in this order: Sounds and words, New tricky word, Silly sentences, Read with me, Maths, My world, Garden, skipping any step with nothing to do.

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

#### Scenario: My world
- **WHEN** a day's session is planned
- **THEN** a My world step with 2 items comes after Maths and before Garden
