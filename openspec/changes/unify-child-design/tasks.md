# Tasks

## 1. Colour, surfaces and type

- [x] 1.1 Current path step in leaf green, spoken word in the soft lit style, number-line gap no longer yellow. Test: no element outside `.s-target` is sun yellow on any session screen, at both sizes.
- [x] 1.2 Flat paper for the big word, the crocodile's still numbers and question words and sentences; Andika Regular for words and letters (`.m-word`, `.g-text`).

## 2. Shared components

- [x] 2.1 `kit.screen({ replay })` and `ctx.replay(on)`; Find it, Rhyme, maths, language, My world, questions, Build it, Word order, the crocodile and Find the heart letters use them. Test: no replay control inside `.s-main` on any screen.
- [x] 2.2 One answer-card minimum size. Test: every answer card has the same computed minimum size at each screen size.
- [x] 2.3 One `.s-gap` missing-piece mark (a/an, is/are, he/she/they, sequences, patterns, number line, crocodile), with `.full` when answered. Test: is/are fills the gap and marks it full.

## 3. Checks

- [x] 3.1 `npm run screens` at both sizes, reviewed, nothing scrolls. Bump `?v=`. `npm test` and `npm run spec` pass.
