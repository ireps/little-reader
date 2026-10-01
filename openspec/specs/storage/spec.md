# storage Specification

## Purpose

Defines what the app saves in localStorage, how saved data is checked on load, and how older data is migrated.

## Requirements

### Requirement: Storage key and schema
The app SHALL save state under localStorage key littleReader.v1 with schema 1: words, story, hearts, tricky, confusions, storyMode, voice, rate.

#### Scenario: Save
- **WHEN** a grown-up saves words
- **THEN** littleReader.v1 holds a JSON object with schema 1

### Requirement: Validation on load
Every load SHALL pass through validation that rebuilds a clean state with type and size limits (60 words of at most 30 letters, a story of at most 2000 characters).

#### Scenario: Corrupt data
- **GIVEN** littleReader.v1 holds invalid JSON or wrong types
- **WHEN** the app loads
- **THEN** it starts with the default week and no error

#### Scenario: Oversized data
- **GIVEN** 100 words are stored
- **WHEN** the app loads
- **THEN** only the first 60 are kept

### Requirement: Migration from Reading Garden
When littleReader.v1 is absent, the app SHALL import words and story from readingGarden.v1 once.

#### Scenario: Old data present
- **GIVEN** readingGarden.v1 holds words
- **WHEN** the app loads for the first time
- **THEN** those words appear in the lessons
