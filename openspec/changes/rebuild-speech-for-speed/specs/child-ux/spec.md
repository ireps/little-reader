# Spec Delta

## Purpose

Makes the child screens usable by a beginning reader: instant, non-punishing feedback, clear icons and a child-friendly font. Phase 4 adds the guided-flow rules.

## ADDED Requirements

### Requirement: Right-answer feedback
A right answer SHALL show a leaf-green state with a check icon and play a soft chime within 100 ms, before any speech.

#### Scenario: Right tap
- **WHEN** she taps the right card
- **THEN** within 100 ms the card turns green with a check icon and a two-note chime plays

#### Scenario: Reduced motion
- **GIVEN** reduced motion is on
- **WHEN** she taps the right card
- **THEN** the green state and check icon still appear, with no animation needed

### Requirement: Wrong-answer feedback
A wrong answer SHALL dim the card with a small dot and play a low soft tone within 100 ms, with no red and no cross.

#### Scenario: Wrong tap
- **WHEN** she taps a wrong card
- **THEN** within 100 ms the card is grey with a dot, a soft low tone plays, and no red or cross appears

### Requirement: SVG interface icons
Interface icons (home, speaker, check, star, flower, heart, arrow) SHALL be inline SVG; emoji SHALL appear only as content pictures, from Unicode 8 or older.

#### Scenario: Interface markup
- **WHEN** the header and buttons of every screen are scanned
- **THEN** they contain SVG icons and no emoji characters

### Requirement: Andika font
Reading text SHALL use the self-hosted Andika font, which has single-storey a and g.

#### Scenario: Font present
- **GIVEN** the Andika files are in fonts/
- **WHEN** a lesson word is rendered
- **THEN** its computed font family is Andika
