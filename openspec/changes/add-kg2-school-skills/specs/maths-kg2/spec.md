## MODIFIED Requirements

### Requirement: Number names
Number names SHALL match a numeral to its written name, one to ten at level 1 and eleven to fifty at level 2.

#### Scenario: Right
- **WHEN** she picks "seven" for 7
- **THEN** it turns green

#### Scenario: Wrong
- **WHEN** she picks "eleven"
- **THEN** it dims and "7, seven" is spoken

#### Scenario: Level 2 range
- **WHEN** 500 level-2 items are generated
- **THEN** every number is between 11 and 50 and its options are written names

### Requirement: Skill order
Skills SHALL unlock in the order schools teach them (compare, count, size words, odd one out, numerals, count on and back, order, before and after, zero, add, take away, number names, money, measure, longest, shapes, solids, halves, patterns, data, skip counting, time, clock), each when the previous reaches box 2; a skill she has already practised SHALL stay open even if a skill before it is not yet open. Each session SHALL include 4 to 5 maths items.

#### Scenario: Unlock
- **GIVEN** counting objects reaches box 2
- **WHEN** the next session is planned
- **THEN** size-word items can appear

#### Scenario: Session share
- **WHEN** any session is planned
- **THEN** the Maths step has 4 or 5 items

#### Scenario: Practised skills stay open
- **GIVEN** counting is at box 2, size words were never practised, and numerals has been practised
- **WHEN** the next session is planned
- **THEN** size words and numerals are both open

## ADDED Requirements

### Requirement: Skip counting
Skip counting SHALL show three numbers counting in 2s, 5s or 10s and ask for the next; level 1 stays within 20 (2s) and 50 (5s and 10s), level 2 within 100.

#### Scenario: Fives
- **WHEN** "5, 10, 15, ?" is shown and she picks 20
- **THEN** it turns green and "5, 10, 15, 20!" is spoken

### Requirement: Order
Order SHALL show 3 numbers and ask for the smallest or the biggest; level 1 within 10, level 2 within 50.

#### Scenario: Smallest
- **WHEN** 7, 3 and 9 are shown for "Which is the smallest?" and she picks 3
- **THEN** it turns green

### Requirement: Size words
Size words SHALL show 2 drawn things and ask which is taller, shorter, thicker, thinner, on top or at the bottom.

#### Scenario: Taller
- **WHEN** she picks the taller tree for "Which is taller?"
- **THEN** it turns green and "Yes! That one is taller." is spoken

### Requirement: Longest and holds the most
Comparing three SHALL show 3 pencils (longest, shortest) at level 1 and 3 containers (holds the most, holds the least) at level 2.

#### Scenario: Longest
- **WHEN** she picks the longest of 3 pencils
- **THEN** it turns green

#### Scenario: Holds the most
- **WHEN** she picks the biggest container for "Which holds the most?"
- **THEN** it turns green

### Requirement: Solid shapes
Solid shapes SHALL show drawn solids (sphere, cube, cylinder, cone) and ask her to find one by name at level 1, or which solid an everyday thing is like (ball, box, tin, ice cream cone) at level 2.

#### Scenario: Cube
- **WHEN** she picks the cube for "Find the cube"
- **THEN** it turns green

#### Scenario: Like a ball
- **WHEN** "A ball is like which shape?" is asked and she picks the sphere
- **THEN** it turns green and "A ball is a sphere." is spoken

### Requirement: Odd one out
Odd one out SHALL show 3 shapes where 2 share a colour (level 1) or a shape (level 2) and the third differs, and ask which is not like the others.

#### Scenario: Colour
- **WHEN** two blue circles and a pink circle are shown and she picks the pink circle
- **THEN** it turns green

### Requirement: Simple data
Simple data SHALL show a row of pink and blue beads (more of one colour) and ask "Are there more pink or blue?", with the two colours as answers.

#### Scenario: More pink
- **WHEN** 5 pink and 2 blue beads are shown and she picks pink
- **THEN** it turns green and "Yes! More pink." is spoken

### Requirement: O'clock
The clock skill SHALL show a clock face and ask what time it is, with o'clock times at level 1 and o'clock or half past at level 2.

#### Scenario: Three o'clock
- **WHEN** the hands show 3 o'clock and she picks "3 o'clock"
- **THEN** it turns green
