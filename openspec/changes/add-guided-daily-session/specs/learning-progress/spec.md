# Spec Delta

## Purpose

Schedules every word, sound and skill with spaced, retrieval-based review so she practises what she is about to forget and is not bored by what she knows.

## ADDED Requirements

### Requirement: Boxes and due dates
Every word, grapheme, sentence set and maths skill SHALL have a box from 0 to 5 and a due date.

#### Scenario: New item
- **WHEN** an item is introduced
- **THEN** it is at box 0 and due today

#### Scenario: Migrated item
- **GIVEN** schema-1 words
- **WHEN** they are migrated
- **THEN** each is at box 1 and due today

### Requirement: Moving up once a day
A right first try SHALL move an item up one box, at most once per day.

#### Scenario: Twice in one day
- **WHEN** she gets "come" right first try twice today
- **THEN** it moves up one box only

#### Scenario: Three separate days
- **GIVEN** "come" is at box 0
- **WHEN** she gets it right first try on 3 separate days
- **THEN** it is at box 3

### Requirement: Moving down
A miss, a help tap or a grown-up's stumbled mark SHALL move an item down one box, never below 0, and make it due today.

#### Scenario: Miss
- **WHEN** she misses "said" at box 2
- **THEN** it is at box 1

#### Scenario: Help tap
- **WHEN** a word is tapped for help
- **THEN** it moves down one box

#### Scenario: Stumbled mark
- **WHEN** the grown-up marks a word in Read with me
- **THEN** it moves down one box

### Requirement: Intervals
Items SHALL fall due 0, 1, 2, 4, 7 and 14 days after their last review, for boxes 0 to 5.

#### Scenario: Due date
- **WHEN** an item moves to box 3
- **THEN** it is due 4 days later

#### Scenario: Missed day
- **GIVEN** an item was due yesterday and no session ran
- **WHEN** today's session is planned
- **THEN** the item is due

### Requirement: Mastery
An item at box 3 or higher SHALL count as mastered and grow a flower once.

#### Scenario: Reaching box 3
- **WHEN** an item reaches box 3
- **THEN** a new flower is added

#### Scenario: Mastered then missed
- **WHEN** a box-4 item is missed
- **THEN** it drops to box 3 and its flower stays

### Requirement: Mostly known
Review SHALL mix about 1 weak item (box 0 or 1) with every 3 known items (box 2 or more).

#### Scenario: Mostly weak items
- **GIVEN** 8 weak and 2 known items are due
- **WHEN** Sounds and words is planned
- **THEN** mastered items that aren't due are added so the ratio is near 1:3

#### Scenario: Nothing known yet
- **GIVEN** no item is above box 1
- **WHEN** the step is planned
- **THEN** the weak items are used alone, capped at 6

### Requirement: New-word pacing
Each session SHALL introduce 2 new tricky words when the previous session's first-try accuracy was at least 60%, 1 at 40 to 60%, and 0 below 40%.

#### Scenario: Good day
- **GIVEN** yesterday's accuracy was 75%
- **WHEN** today is planned
- **THEN** 2 new tricky words are introduced

#### Scenario: Hard day
- **GIVEN** yesterday's accuracy was 35%
- **WHEN** today is planned
- **THEN** no new tricky word is introduced

### Requirement: Unit advancement
The next unit SHALL open when all of the current unit's words and tricky words are at box 3 or more (and, once silly sentences exist in Phase 5, silly-sentence accuracy is at least 80%).

#### Scenario: Advance
- **WHEN** both conditions are met at the session's end
- **THEN** the next session uses the next unit

#### Scenario: Not yet
- **WHEN** one unit word is at box 2
- **THEN** the unit stays the same

#### Scenario: Grown-up override
- **WHEN** a grown-up picks a unit in "Where is she?"
- **THEN** the next session uses that unit

### Requirement: Local dates
"Today" SHALL be the tablet's local date, and a clock that moves backwards SHALL NOT break scheduling.

#### Scenario: Crossing midnight
- **WHEN** a session starts at 23:58 and ends at 00:05
- **THEN** its results count for the day it started

#### Scenario: Clock moved back
- **GIVEN** the last session was dated 2026-10-10
- **WHEN** the tablet's date reads 2026-10-01
- **THEN** the app treats today as 2026-10-10 and does not crash
