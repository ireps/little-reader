# Tasks

## 1. Language skill schedule

- [ ] 1.1 `js/grammar.js` with `ORDER` (5 existing kinds, then 12 new) and `SKILLS`, loaded in `index.html` and `tools/list-clips.js`. `P.langUnlocked()` in `js/progress.js`. Tests: the 5 existing kinds and the first new one are open on a fresh install; the next opens when the previous reaches box 2.
- [ ] 1.2 `js/session.js`: 2 language items from 2 different open skills, oldest `g:` first, each carrying `g`. `ctx.done` records `P.right` and `P.miss` for `g:` items. Tests: two a day; results move the `g:` box; with 30 or more recorded days, 5 consecutive plans don't all repeat the same pair.

## 2. New language skills

- [ ] 2.1 Generators for letters (capital-small, next letter, vowel) in `js/grammar.js`, drawn by `LR.steps.math` (`t:'gram'`). Tests: right and wrong for each; answers are unique.
- [ ] 2.2 Naming, doing and describing words, and opposites, with fixed decodable banks. Tests: exactly one right answer; the banks are decodable at p4-01.
- [ ] 2.3 *this/these*, *is/are* and *he/she/they*, with pictures of one or three things. Tests: right and wrong; the gap fills on a right answer.
- [ ] 2.4 Word order (`js/steps/order.js`, tiles into slots, errorless after 2 misses) using the unit's sense sentences. Tests: right order completes; a wrong tile stays; tiles at least 120 px tall.
- [ ] 2.5 Sentence-picture, with a built-in list. Tests: right and wrong; every picture exists and every sentence is decodable at p4-01.

## 3. New maths skills

- [ ] 3.1 Skip counting, order and number names to fifty (`NAMES` to 50) in `js/maths.js`. Tests: ranges per level; names are unique.
- [ ] 3.2 Size words, longest/holds the most, solids, odd one out, simple data and o'clock, with SVG pictures. Tests: right and wrong for each; exactly one right option; unlock order ends with clock.

## 4. Clips, docs and screens

- [ ] 4.1 `tools/list-clips.js` sweeps `LR.grammar`, the banks and the word-order sentences. New phrases go in `data/phrases.js`. Regenerate the list and make the missing clips with Neerja, then import. Verify N of N and `npm test`.
- [ ] 4.2 README activity tables (language and maths), and the CLAUDE.md layout (`js/grammar.js`, `js/steps/order.js`) and roadmap (8b built). Verify by reading.
- [ ] 4.3 `npm run screens` for a sample of each new skill at 1280x614 and 800x1094: nothing scrolls, and targets meet the size rules. Bump `?v=`. `npm test` and `npm run spec` pass.

## 5. Try on the tablet

- [ ] 5.1 The owner runs a week of sessions. Note which new tasks needed explaining, whether word order is easy to use, and whether sessions stay around 10 minutes. Then 8c.
