# maths-kg2 Specification

## Purpose
Teaches the KG-2 numeracy outcomes of NCF-FS 2022 (used by Oxford Advantage) through short generated items she answers by tapping, with visual counting on every wrong answer.

## Requirements

### Requirement: Compare with the crocodile
Compare SHALL ask which is more and which mouth fits, for 0 to 10 with dots at level 1 and 0 to 20 with numerals at level 2.

#### Scenario: Right
- **WHEN** she picks the mouth opening toward 7 for 3 and 7
- **THEN** it turns green and "3 is less than 7" is spoken

#### Scenario: Wrong
- **WHEN** she picks the other mouth
- **THEN** it dims and the right mouth is shown with the sentence "3 is less than 7"

### Requirement: Counting objects
Counting SHALL ask how many objects are shown, to 10 at level 1 and to 20 at level 2.

#### Scenario: Right
- **WHEN** she picks 6 for 6 dots in a ten-frame
- **THEN** it turns green

#### Scenario: Wrong
- **WHEN** she picks 5
- **THEN** it dims and the dots are counted along from 1 to 6

### Requirement: Numerals and quantities
Numeral and quantity SHALL match a numeral to a set, to 9 at level 1 and to 99 as tens and ones at level 2.

#### Scenario: Right
- **WHEN** she picks 3 tens and 4 ones for 34
- **THEN** it turns green

#### Scenario: Wrong
- **WHEN** she picks 4 tens and 3 ones
- **THEN** it dims and the right blocks are shown and "3 tens and 4 ones" is said

### Requirement: Counting forward and back
Counting on and back SHALL ask for the next or previous number from any start, to 9 at level 1 and to 20 plus counting in 2s and 10s at level 2.

#### Scenario: Right
- **WHEN** she picks 8 after "6, 7"
- **THEN** it turns green

#### Scenario: Wrong
- **WHEN** she picks 9
- **THEN** it dims and the right answer is shown with the sequence said

### Requirement: Before, after and between
Before, after and between SHALL ask for the neighbouring number, to 20 at level 1 and to 100 at level 2.

#### Scenario: Right
- **WHEN** she picks 15 for "between 14 and 16"
- **THEN** it turns green

#### Scenario: Wrong
- **WHEN** she picks 13
- **THEN** it dims and the number line shows 14, 15, 16

### Requirement: Zero
Zero SHALL show a set being taken away until none is left and ask how many are left.

#### Scenario: Right
- **WHEN** she picks 0
- **THEN** it turns green and "zero, none left" is spoken

#### Scenario: Wrong
- **WHEN** she picks 1
- **THEN** it dims and 0 is shown and "Zero. None left." is said

### Requirement: Adding
Adding SHALL combine two pictured groups, to 9 at level 1 and facts to 18 at level 2.

#### Scenario: Right
- **WHEN** she picks 5 for 2 things and 3 more
- **THEN** it turns green

#### Scenario: Wrong
- **WHEN** she picks 4
- **THEN** it dims and all the things light one by one while 1 to 5 is said

### Requirement: Taking away
Taking away SHALL show a group with some removed and ask how many are left, within 9.

#### Scenario: Right
- **WHEN** she picks 4 for 6 birds with 2 flying away
- **THEN** it turns green

#### Scenario: Wrong
- **WHEN** she picks 8
- **THEN** it dims and the birds left light one by one while 1 to 4 is said

### Requirement: Number names
Number names SHALL match a numeral to its written name, one to ten at level 1 and eleven to twenty at level 2.

#### Scenario: Right
- **WHEN** she picks "seven" for 7
- **THEN** it turns green

#### Scenario: Wrong
- **WHEN** she picks "eleven"
- **THEN** it dims and "7, seven" is spoken

### Requirement: Indian money
Money SHALL ask her to recognise ₹1, 2, 5 and 10 coins and notes at level 1 and to make amounts up to ₹20 at level 2.

#### Scenario: Right
- **WHEN** she picks the ₹5 coin
- **THEN** it turns green

#### Scenario: Wrong
- **WHEN** she picks the ₹2 coin
- **THEN** it dims and "five rupees" is spoken with the right coin shown

### Requirement: Measurement
Measure SHALL compare long and short, heavy and light at level 1, and full and empty, hot and cold at level 2, with pictured pairs.

#### Scenario: Right
- **WHEN** she picks the longer pencil
- **THEN** it turns green

#### Scenario: Wrong
- **WHEN** she picks the shorter one
- **THEN** it dims and the longer pencil is shown

### Requirement: Shapes
Shapes SHALL ask her to find a circle, square, triangle or rectangle at level 1, and the shape with a given property (no corners, 3 sides, 4 equal sides) at level 2.

#### Scenario: Right
- **WHEN** she picks the triangle
- **THEN** it turns green

#### Scenario: Wrong
- **WHEN** she picks the square
- **THEN** it dims and the triangle is shown and named

### Requirement: Halves
Halves SHALL ask which shape is cut into two equal halves.

#### Scenario: Right
- **WHEN** she picks the circle cut through the middle
- **THEN** it turns green

#### Scenario: Wrong
- **WHEN** she picks an uneven cut
- **THEN** it dims and the two equal parts are shown

### Requirement: Patterns
Patterns SHALL ask what comes next in an AB pattern at level 1 and ABB or ABC at level 2.

#### Scenario: Right
- **WHEN** she picks the pink circle after pink circle, blue square, pink circle, blue square
- **THEN** it turns green

#### Scenario: Wrong
- **WHEN** she picks blue
- **THEN** it dims and the pink circle is shown and named

### Requirement: Days, months and time of day
Time SHALL ask which day comes next at level 1 and which month comes next or whether a scene is morning, afternoon or night at level 2.

#### Scenario: Right
- **WHEN** she picks Tuesday after Monday
- **THEN** it turns green

#### Scenario: Wrong
- **WHEN** she picks Friday
- **THEN** it dims and the days are spoken Monday, Tuesday

### Requirement: Equals in comparing
When the Equals sign setting is on, one comparing round in four SHALL use equal amounts, with =, < and > as the choices.

#### Scenario: Setting off
- **GIVEN** the Equals sign setting is off
- **WHEN** comparing rounds run
- **THEN** the amounts are never equal and only < and > are offered

#### Scenario: Setting on
- **GIVEN** the setting is on
- **WHEN** a round shows 4 and 4
- **THEN** picking = turns it green and "4 is equal to 4" is spoken

### Requirement: Generated items
Maths items SHALL be generated fresh within the skill's range, never repeating the same numbers in consecutive items of one skill.

#### Scenario: No immediate repeats
- **WHEN** 50 items of one skill are generated
- **THEN** no two consecutive items have the same numbers

#### Scenario: Ranges respected
- **WHEN** 500 items of each skill and level are generated
- **THEN** every number is within that level's range

### Requirement: Skill order
Skills SHALL unlock in order (compare, count, numerals, count on and back, before and after, zero, add, take away, number names, money, measure, shapes, halves, patterns, time), each when the previous reaches box 2, and each session SHALL include 4 to 5 maths items.

#### Scenario: Unlock
- **GIVEN** counting objects reaches box 2
- **WHEN** the next session is planned
- **THEN** numerals and quantities items can appear

#### Scenario: Session share
- **WHEN** any session is planned
- **THEN** the Maths step has 4 or 5 items

### Requirement: Dots in fixed layouts
Quantities SHALL be shown as dice or ten-frame layouts, never scattered.

#### Scenario: Seven
- **WHEN** 7 is shown as dots
- **THEN** it is a ten-frame with the top row of 5 and 2 below
