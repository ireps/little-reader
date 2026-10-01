# rewards Specification

## Purpose
Rewards learning with a garden that only grows and a short celebration, never with punishment or pressure.

## Requirements

### Requirement: Garden
The garden SHALL show one flower per item ever mastered, and SHALL never lose flowers.

#### Scenario: New mastery
- **WHEN** an item reaches box 3
- **THEN** a flower is added to the garden

#### Scenario: Mastered item missed
- **WHEN** a mastered item is missed
- **THEN** the garden keeps the same number of flowers

### Requirement: Sprouts
The garden SHALL show a sprout for every word she is learning (box 1 or 2), so progress is visible from the first day.

#### Scenario: First day
- **GIVEN** a new install with 6 known tricky words at box 1
- **WHEN** Home is shown
- **THEN** the garden shows no flowers and 6 sprouts

### Requirement: End-of-session celebration
The session end SHALL show the garden with today's new flowers ringed (a static cue), the guide's happy pose and a spoken summary, and one Done target once the summary has been said.

#### Scenario: Two new flowers
- **WHEN** a session with 2 new masteries ends
- **THEN** 2 flowers appear and the guide says "You grew 2 flowers!"

#### Scenario: No new flowers
- **WHEN** a session with no new mastery ends
- **THEN** the guide praises the practice and the garden is shown

### Requirement: No negatives
The app SHALL have no streak loss, visible timers, buzzers, red colours for errors or crosses.

#### Scenario: DOM and audio check
- **WHEN** every screen and state is scanned
- **THEN** none of these appear and no error sound plays
