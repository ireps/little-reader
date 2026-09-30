# Spec Delta

## Purpose

Rewards learning with a garden that only grows and a short celebration, never with punishment or pressure.

## ADDED Requirements

### Requirement: Garden
The garden SHALL show one flower per item ever mastered, and SHALL never lose flowers.

#### Scenario: New mastery
- **WHEN** an item reaches box 3
- **THEN** a flower is added to the garden

#### Scenario: Mastered item missed
- **WHEN** a mastered item is missed
- **THEN** the garden keeps the same number of flowers

### Requirement: End-of-session celebration
The session end SHALL show today's new flowers placed one by one as static states, the guide's happy pose, a chime and a spoken summary, finishing within 10 s.

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
