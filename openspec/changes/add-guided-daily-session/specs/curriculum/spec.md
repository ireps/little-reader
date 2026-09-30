# Spec Delta

## Purpose

Ships all reading content inside the app as original, decodable units in the Letters and Sounds order, so no grown-up ever types content.

## ADDED Requirements

### Requirement: Built in
All words, stories, sentences and pictures SHALL ship with the app, and grown-ups SHALL NOT need to type content.

#### Scenario: First run
- **GIVEN** a new install with no saved data
- **WHEN** Start is tapped
- **THEN** a full session runs with no setup

### Requirement: Original text
Unit text SHALL be original, with no third-party copyrighted content.

#### Scenario: Licence note
- **WHEN** README is read
- **THEN** it states that the content is original and lists the public-domain word lists used

### Requirement: Pictures
Content pictures SHALL be emoji from Unicode 8 or older, or inline SVG.

#### Scenario: Code points
- **WHEN** the unit data is scanned
- **THEN** every emoji is from Unicode 8 or older

### Requirement: Starting point
A new install SHALL start at Phase 4 (adjacent consonants), with come, some, from, have, many and also known at box 1.

#### Scenario: New install
- **WHEN** the first session is planned
- **THEN** it uses unit p4-01 and those 6 words are in review
