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
