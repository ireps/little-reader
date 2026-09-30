## ADDED Requirements

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
