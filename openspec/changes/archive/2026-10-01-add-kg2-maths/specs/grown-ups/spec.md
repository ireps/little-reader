## ADDED Requirements

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
