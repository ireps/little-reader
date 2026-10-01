# Spec Delta

## Purpose

Teaches KG-2 English reading skills in the Oxford (Letters and Sounds) style, starting with tricky words and a listening word-finding game.

## ADDED Requirements

### Requirement: Tricky words in families
Tricky words SHALL come from the Letters and Sounds Phase 2 to 5 lists plus her known words, and be taught with their family.

#### Scenario: o says uh
- **WHEN** "come" is the new tricky word
- **THEN** after she has heard it, "some" and "done" are shown as its family

#### Scenario: oo family
- **WHEN** "to" is the new tricky word
- **THEN** "do" and "who" are shown as its family

### Requirement: Heart letters
Tricky words SHALL show a heart on each irregular letter wherever they are taught.

#### Scenario: come
- **WHEN** "come" is shown in the New tricky word step
- **THEN** o and e carry hearts

#### Scenario: said
- **WHEN** "said" is shown
- **THEN** a and i carry hearts

### Requirement: New tricky word step
The New tricky word step SHALL play the word, then say-spell-say, then ask her to find the heart letters, with no controls other than the letters.

#### Scenario: Find the heart
- **WHEN** she taps the o of "come"
- **THEN** it gains a heart and the app says "Yes!"

#### Scenario: Plain letter
- **WHEN** she taps the c of "come"
- **THEN** it dims with a soft tone and no heart

### Requirement: Find it
Find it SHALL speak a word and offer it among 3 cards whose distractors share its first letter or are her past mix-ups.

#### Scenario: Mix-up distractors
- **GIVEN** she picked "pots" for "plants" before
- **WHEN** "plants" is the target
- **THEN** "pots" is one of the cards

#### Scenario: First-letter guessing
- **WHEN** any Find it item is shown
- **THEN** at least 2 cards start with the target's first letter
