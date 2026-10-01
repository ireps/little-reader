## MODIFIED Requirements

### Requirement: Language tasks
Language tasks SHALL be skills with boxes, like the maths skills, in one chain in UKG term order (capital and small letters, vowels, alphabet order, a or an, one or many, naming words, he/she/they, this/these, is/are, in/on/under, rhymes, then doing words, describing words, opposites, capital letters, word order, sentence and picture). The first 2 are open from the start; each later one opens when the one before reaches box 2, and one she has practised stays open. A learner who did sessions before this order keeps rhyme, a or an, plural, in/on/under and capitals open. Every session SHALL include 2 language items from the open skills, least recently practised first. A tapped answer SHALL show its state within 100 ms.

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

#### Scenario: Two a day
- **WHEN** any day's session is planned
- **THEN** Sounds and words ends with 2 language items from 2 different skills

#### Scenario: Still rotating after a month
- **GIVEN** 30 days of sessions are recorded
- **WHEN** the next 5 sessions are planned
- **THEN** they don't all use the same language skills

#### Scenario: Unlock
- **GIVEN** a new install, with vowels at box 1
- **WHEN** a session is planned
- **THEN** no alphabet-order item appears; once vowels reach box 2, alphabet-order items can appear

#### Scenario: Earlier learner
- **GIVEN** saved progress with sessions done before the language order
- **WHEN** it is loaded
- **THEN** rhyme, a or an, plural, in/on/under and capitals are open

## ADDED Requirements

### Requirement: Letters
Letter skills SHALL ask her to match a capital letter to its small letter (among look-alikes such as b, d, p), say which letter comes next in the alphabet, and find the one vowel among 3 letters; letters are named with their letter names.

#### Scenario: Capital to small
- **WHEN** "G" is shown and she picks "g" from g, q and p
- **THEN** it turns green and "G, g" is spoken

#### Scenario: Next letter
- **WHEN** "What comes after m?" is asked and she picks n
- **THEN** it turns green

#### Scenario: Vowel
- **WHEN** a, t and m are shown and she picks t
- **THEN** it dims and the prompt is repeated; after a second miss, a is shown and "a is a vowel" is spoken

### Requirement: Kinds of words
Word-kind skills SHALL show 3 decodable words and ask her to find the naming word (a thing), the doing word (an action) or the describing word, with exactly one right answer.

#### Scenario: Doing word
- **WHEN** cat, jump and red are shown for "Find the doing word"
- **THEN** jump is right and "Yes! jump is a doing word." is spoken

#### Scenario: Naming word wrong
- **WHEN** she picks red for "Find the naming word"
- **THEN** it dims; red is not named as wrong with a cross or a buzzer

### Requirement: Opposites
The opposites skill SHALL say a word and ask her to find its opposite among 3 words.

#### Scenario: Hot
- **WHEN** she picks cold for "What is the opposite of hot?"
- **THEN** it turns green and "hot, cold" is spoken

### Requirement: Sentence grammar
Grammar skills SHALL show a picture of one thing or of three and ask her to pick "This is" or "These are", or "is" or "are" for a gap in a sentence, or "He", "She" or "They" for a gap after a sentence about Raj, Meena or both.

#### Scenario: These are
- **WHEN** three cats are shown and she picks "These are cats."
- **THEN** it turns green and is spoken

#### Scenario: Is or are
- **WHEN** "The dogs ? big." is shown with three dogs and she picks "are"
- **THEN** the gap fills with "are" and the sentence is spoken

#### Scenario: Pronoun
- **WHEN** "Meena has a hat. ? is happy." is shown and she picks "She"
- **THEN** it turns green

### Requirement: Word order
Word order SHALL show the words of a short sentence (3 to 5 words, from her unit's sense sentences) as shuffled tiles, and she taps them in order to fill the slots; a tile that doesn't fit the next slot dims briefly and stays in the tray, and the finished sentence is spoken. Each tapped tile SHALL respond within 100 ms.

#### Scenario: Right order
- **WHEN** she taps "A", "fish", "is", "wet." in turn
- **THEN** the sentence is complete, turns green and is spoken

#### Scenario: Wrong tile
- **WHEN** she taps "wet." for the first slot
- **THEN** it dims briefly with a soft tone and stays in the tray

### Requirement: Sentence and picture
The sentence-picture skill SHALL show a short decodable sentence and 3 pictures, and she picks the picture it describes.

#### Scenario: Right
- **WHEN** "A frog can jump." is shown and she picks the frog
- **THEN** it turns green and the sentence is spoken
