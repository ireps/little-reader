# Tasks

## 1. Engine: checker, distractors, review, question pairs

- [x] 1.1 `js/words.js`: suffix-aware `decodable()` and `allowedFor()` (Decision 6), driven by a unit `suffixes` field. Tests in `tests/run.js`: "jumping" fails before the -ing unit and passes after it; "bed" isn't read as b + ed; "faster" fails before -er/-est.
- [x] 1.2 `js/words.js`: `lookalikes(target, pool, mixups, n, near)` takes the same-start group first (Decision 5). Find it (`js/steps/find.js`) and Flash (`js/steps/flash.js`) pass `P.unit().near`. Tests: with a group plants/plums/pots and no mix-ups, both distractors come from the group; mix-ups still come first; at least 2 cards share the first letter.
- [x] 1.3 `data/units.js` `LR.baseReview`, and `js/store.js` `seedKnown()` run on every load (Decision 4). Tests: a new install has the 9 words at box 1; an existing state without them gains them once, and an item already present keeps its box.
- [x] 1.4 `js/session.js` asks question pair `k, k+1` by days since 2000 mod 3 (Decision 3). Tests: a fixed date gives the expected pair, and the next day gives the next pair.
- [x] 1.5 `js/steps/q.js`: "What happened first?" phrase answers as wide cards in a column (the `first` flag), with the caption showing only the question. Tests: right and wrong picks; caption never contains the answer.
- [x] 1.6 Count test: 4 stories, 3 questions each, at least 3 `near` groups, a `theme` on every story from the extended list, and at least 2 stories each for family, home, school, festivals, seasons and safety. Verify that `npm test` names the unit and field when one is short.
- [x] 1.7 Remove the duplicated comment in `js/progress.js` (lines 112 to 113). Verify with `npm test`.

## 2. Content: existing units (p3-r1 to p5-12)

- [x] 2.1 Units p3-r1 to p4-06: add 2 stories each, a 3rd question per story (at least one "What happened first?" per story), a `theme` on each story, and a `near` set. Verify that `npm test` (`checkUnits`) passes after the file.
- [x] 2.2 Units p5-01 to p5-12: the same as 2.1. Verify that `npm test` passes after the file.
- [x] 2.3 Same-start groups cover her known confusions (pots/plants, grow/green, come/coat) in the units where those words appear. Verify by reading the `near` sets against the CLAUDE.md list.

## 3. Content: new units

- [x] 3.1 `data/units-p6.js` with p5-r1 and p5-r2 (mixed review, 1 new tricky word each, `HEARTS` and `FAMILIES` extended), loaded in `index.html` and `tools/list-clips.js`. Verify that `npm test` passes.
- [x] 3.2 Suffix units p6-01 (-s/-es), p6-02 (-ing), p6-03 (-ed covering t, d and id), p6-04 (-er/-est), with unchanged roots only. Verify that `npm test` passes and the word lists have no doubled letters or dropped e.
- [x] 3.3 Pictures for any new picturable words (Unicode 6 emoji only). Verify that the emoji code-point test passes.
- [x] 3.4 Update the curriculum lines in README.md, and the CLAUDE.md layout (`units-p6.js`) and roadmap (8a, 8b, 8c rows). Verify by reading both.

## 4. Voice clips

- [x] 4.1 `node tools/list-clips.js`, then `.venv/Scripts/python tools/make-clips-neerja.py` (only the missing clips; re-run to retry), then `node tools/import-clips.js`. Verify the count printed is N of N, and that `npm test` passes ("audio/manifest.js is valid" and the coverage check).

## 5. Integration

- [x] 5.1 Bump `?v=` on every file in `index.html`. Run `npm test`, `npm run spec` and `npm run screens`, and look at the Read with me question screens (the phrase answers) at 1280x614 and 800x1094: nothing scrolls, and targets are at least 120 px tall.
- [x] 5.2 Run a full session in Chromium from a fresh install and from a saved p5-12 state. Check for no console errors or CSP violations, that new stories appear, that 2 questions are asked, and that the session takes about 10 minutes in the session timer.

## 6. Try on the tablet

- [ ] 6.1 The owner runs a week of sessions with her. Note whether new stories appear, whether "What happened first?" needs explaining, whether same-start words still catch her (Grown-ups mix-ups), and whether sessions stay around 10 minutes. Then start 8b.
