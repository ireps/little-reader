## MODIFIED Requirements

### Requirement: Storage key and schema
The app SHALL save state under localStorage key littleReader.v1 with schema 2: unit, items, flowers, confusions, stories, resume, days, rate, clips and warn.
(Previously: schema 1 with words, story, hearts, tricky, confusions, storyMode, voice and rate.)

#### Scenario: Save
- **WHEN** an item is answered
- **THEN** littleReader.v1 holds a JSON object with schema 2

### Requirement: Validation on load
Every load and restore SHALL pass through validation that rebuilds a clean state with type and size limits (2000 items, 2000 flowers, 200x10 confusions, 500 stories, 30 days, ids of at most 32 characters).
(Previously: limits of 60 words and a 2000-character story.)

#### Scenario: Corrupt data
- **GIVEN** littleReader.v1 holds invalid JSON or wrong types
- **WHEN** the app loads
- **THEN** it starts at the first unit with no error

#### Scenario: Oversized data
- **GIVEN** 3000 items are stored
- **WHEN** the app loads
- **THEN** only 2000 are kept

#### Scenario: Bad id
- **GIVEN** an item id contains markup
- **WHEN** the app loads
- **THEN** that item is dropped

### Requirement: Migration from Reading Garden
When littleReader.v1 is absent, the app SHALL import readingGarden.v1 once, through schema 1 into schema 2.
(Previously: imported into schema 1.)

#### Scenario: Old data present
- **GIVEN** readingGarden.v1 holds words
- **WHEN** the app loads for the first time
- **THEN** those words are review items at box 1

## ADDED Requirements

### Requirement: Migration from schema 1
Schema-1 state SHALL migrate to schema 2: words to box 1, help-word counts to box 0, mix-ups kept, rate kept, story, hearts, story mode and voice dropped.

#### Scenario: From schema 1
- **GIVEN** a schema-1 state with words come and grow and tricky count for grow
- **WHEN** the app loads
- **THEN** w:come is at box 1, w:grow is at box 0 and mix-ups are unchanged

### Requirement: Storage full
When saving fails, the app SHALL keep working from memory and show a warning in Grown-ups.

#### Scenario: Quota error
- **GIVEN** localStorage throws on setItem
- **WHEN** an item is answered
- **THEN** the session continues and Grown-ups shows "Storage is full; save a backup"
