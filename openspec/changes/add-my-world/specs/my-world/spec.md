## Purpose

Teaches the KG-2 "world around me" (EVS) topics with spoken picture questions, in the order schools teach them.

## ADDED Requirements

### Requirement: Picture questions
My world SHALL ask a spoken question and show 3 pictures, exactly one of them right, with nothing she has to read. A tapped picture SHALL show its right or wrong state within 100 ms, and the caption SHALL never show the answer.

#### Scenario: Right
- **WHEN** "Which one lives in water?" is asked and she taps the fish
- **THEN** it turns green with a check and "Yes! A fish lives in water." is spoken

#### Scenario: Wrong
- **WHEN** she taps the dog
- **THEN** it dims with a soft tone, with no red, cross or buzzer; after a second miss the fish is shown and spoken

### Requirement: Topics in teaching order
The topics SHALL open in UKG EVS teaching order (body parts, senses, family, fruit and vegetables, healthy food, plants, pet and wild animals, where animals live, animal sounds, baby animals, insects and birds, transport, helpers, weather, day and night, safety), the first 2 open from the start and each later one when the one before reaches box 2; a topic she has practised SHALL stay open.

#### Scenario: New install
- **WHEN** the first session is planned
- **THEN** only body parts and senses questions can appear

#### Scenario: Next topic
- **GIVEN** senses reaches box 2
- **WHEN** the next session is planned
- **THEN** family questions can appear

### Requirement: Two a day
Each day's session SHALL include 2 My world questions from 2 different open topics, least recently practised first, and record each topic's result in its box.

#### Scenario: Recorded
- **WHEN** she answers a family question right the first time
- **THEN** the family topic moves up one box (at most once a day)

### Requirement: Pictures the tablet can draw
Every picture SHALL be an emoji from Unicode 6 or older, or inline SVG.

#### Scenario: Code points
- **WHEN** the topic banks are scanned
- **THEN** every emoji is from Unicode 6 or older
