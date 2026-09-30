# lessons Specification

## Purpose

Describes the four child lessons reached from the home screen tiles, as shipped in Phases 0 to 2.

## Requirements

### Requirement: Home tiles
Home SHALL show four equal tiles (Word detective, Heart words, Read the story, Hungry crocodile) and a Grown-ups link.

#### Scenario: Open home
- **WHEN** the app starts
- **THEN** four tiles and a Grown-ups link are shown

### Requirement: Word detective
Word detective SHALL speak a word and offer it among two look-alikes, using her past mix-ups as distractors first, for 8 rounds.

#### Scenario: Wrong pick
- **WHEN** she picks a look-alike
- **THEN** its letters are swept, the app says "That says <word>", and the mix-up is recorded

#### Scenario: Past mix-up
- **GIVEN** she picked "pots" for "plants" twice
- **WHEN** "plants" is the target
- **THEN** "pots" is among the choices

### Requirement: Heart words
Heart words SHALL show one word at a time with heart marks on irregular letters, and offer Hear it, Say-spell-say, Find the heart, and previous and next.

#### Scenario: Find the heart
- **WHEN** she taps every heart letter of "come"
- **THEN** the app says "You found them all!"

### Requirement: Read the story
Read the story SHALL warm up tricky words and then show one sentence per screen, with a Together / My turn switch and tap-a-word help.

#### Scenario: Together
- **GIVEN** the mode is Together
- **WHEN** she taps "Read it to me"
- **THEN** the sentence is read word by word and then as a whole

#### Scenario: My turn
- **GIVEN** the mode is My turn
- **WHEN** she taps "I read it"
- **THEN** "Now listen" appears

### Requirement: Hungry crocodile
Hungry crocodile SHALL run 8 rounds mixing tap-the-bigger-number, choose-the-mouth and choose-the-words, for numbers 0 to 10.

#### Scenario: Choose the mouth
- **WHEN** she picks the mouth that opens toward the bigger number
- **THEN** the statement is shown and spoken
