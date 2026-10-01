# english-kg2 Specification

## Purpose
Teaches KG-2 English reading skills in the Oxford (Letters and Sounds) style, starting with tricky words and a listening word-finding game.

## Requirements

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

### Requirement: Sequence
Content SHALL follow the Letters and Sounds order used by Oxford phonics: Phase 3 graphemes as review, then Phase 4 adjacent consonants, then Phase 5 graphemes including split digraphs.

#### Scenario: Ordered units
- **WHEN** the unit list is read
- **THEN** every unit's graphemes appear no earlier than their phase allows

#### Scenario: Sound patterns
- **WHEN** Phase 5 units are reached
- **THEN** ow, oi, or, ee, ai, oa, ou, ar, sh, ch and th are each taught, and ow is taught as two families (snow and cow) side by side

### Requirement: Flash
Flash SHALL show a word for 2 s, hide it, and ask her to pick it from 3 look-alikes, with no audio until she answers.

#### Scenario: Right
- **WHEN** she picks the flashed word
- **THEN** it turns green and is spoken

#### Scenario: Wrong
- **WHEN** she picks a look-alike
- **THEN** it dims and the look-alike is named; after a second miss the flashed word is shown and spoken

### Requirement: Picture match
Picture match SHALL show a decodable word with sound buttons and 3 pictures (preferring words that start the same way), and ask her to pick the picture; only words with a picture are used.

#### Scenario: Right
- **GIVEN** the word "ship" with its picture and two others
- **WHEN** she taps the ship
- **THEN** it turns green and "ship" is spoken

#### Scenario: Wrong
- **WHEN** she taps another picture
- **THEN** it dims and that picture's word is spoken

### Requirement: Build it
Build it SHALL speak a word and let her build it by tapping tiles into slots, with each digraph (and split digraph) as one tile and 2 decoy tiles; tricky words are practised with Find it and Flash instead.

#### Scenario: Right order
- **WHEN** she taps the tiles in the right order
- **THEN** the word is complete, turns green and is spoken

#### Scenario: Wrong tile
- **WHEN** she taps a tile that doesn't fit the next slot
- **THEN** the tile stays in the tray, dims briefly with a soft tone, and no buzzer plays

#### Scenario: Digraph tile
- **WHEN** "ship" is built
- **THEN** "sh" is a single tile and fills one slot

### Requirement: Sound buttons
Picture match and Build it SHALL show a dot under each single-letter grapheme and a dash under each digraph.

#### Scenario: Shown
- **WHEN** "ship" is shown in Picture match
- **THEN** a dash is under "sh" and dots are under "i" and "p"

### Requirement: Help ladder
A help tap on a word in any reading screen SHALL first give a hint (hearts lit and a known family or rhyme word, or the first sound), then the word on a second tap, and both SHALL mark a miss.

#### Scenario: One tap
- **WHEN** she taps "come" once
- **THEN** its hearts light and "Like some" is spoken

#### Scenario: Two taps
- **WHEN** she taps it again
- **THEN** "come" is spoken

#### Scenario: Already helped
- **WHEN** she taps a word already helped twice in this sentence
- **THEN** the word is spoken and no further miss is recorded

### Requirement: Silly sentences
Silly sentences SHALL show a sentence she reads herself and ask for a thumbs up (makes sense) or thumbs down (silly), and play it only after she answers.

#### Scenario: Right
- **WHEN** she gives "A dog can sing" a thumbs down
- **THEN** the thumb turns green and the sentence is spoken

#### Scenario: Wrong
- **WHEN** she gives it a thumbs up
- **THEN** it dims, the sentence is spoken and the right thumb is shown

### Requirement: Language tasks
Rhyme, capital letters, a or an, plural -s and in/on/under SHALL each be offered as a picture or tile task in the session's rotation.

#### Scenario: Rhyme right
- **WHEN** she hears "cat" and picks the hat picture
- **THEN** it turns green

#### Scenario: Rhyme wrong
- **WHEN** she picks the dog picture
- **THEN** it dims and "cat, dog. They don't rhyme." is spoken

#### Scenario: Capitals
- **WHEN** she taps the first word of a sentence written with a small first letter
- **THEN** it gets its capital letter

#### Scenario: a or an
- **WHEN** she picks "an" for the apple picture
- **THEN** "an apple" turns green and is spoken

#### Scenario: Plural
- **WHEN** she reads "cats" and picks the picture of three cats
- **THEN** it turns green

#### Scenario: Position
- **WHEN** she reads "The ball is under the box" and picks the matching scene
- **THEN** it turns green
