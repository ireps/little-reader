## ADDED Requirements

### Requirement: Audio starts within 150 ms
Speech for an action SHALL start within 150 ms of the tap when its clip is preloaded, and within 600 ms or through the tablet voice otherwise.

#### Scenario: Preloaded clip
- **GIVEN** the clip for "come" was preloaded
- **WHEN** she taps "come"
- **THEN** playback starts within 150 ms

#### Scenario: Clip not loaded
- **GIVEN** the clip was not preloaded
- **WHEN** she taps the word
- **THEN** playback starts within 600 ms, or the tablet voice speaks it

#### Scenario: Clip never ends
- **GIVEN** a clip never fires its ended event
- **WHEN** it is played
- **THEN** the sequence continues no later than its duration plus 1 s
