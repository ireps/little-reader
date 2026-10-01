# Tasks: Guided daily session (Phase 4)

## 1. Prototype and approval (stop here until the owner approves)

- [x] 1.1 Design tokens and components in `css/app.css`; `js/guide.js` with 4 SVG poses; garden SVG
- [x] 1.2 `tools/prototype.html` and `tools/prototype.js` with fixtures for every screen and state
- [x] 1.3 `tests/prototype.js` screenshots at 1280x614 and 800x1094 with reduced motion
- [x] 1.4 Review against the UX checklist; fix; send the screenshots to the owner
- [x] 1.5 **Owner approves the screenshots**

## 2. Data

- [x] 2.1 Schema 2 in `js/store.js` with `validate()` limits
- [x] 2.2 Migrations: schema 1 → 2 and Reading Garden → 2, with fixtures
- [x] 2.3 Storage-full handling and the `warn` field
- [x] 2.4 `js/progress.js`: records, intervals, up and down moves, mastery and flowers, dates
- [x] 2.5 Incremental rehearsal plan, new-word pacing and unit advancement
- [x] 2.6 First units in `data/units.js` (p4-01 to p4-04): decodable words, new tricky words, 2 stories each

## 3. Session

- [x] 3.1 Home: garden and Start, the "See you tomorrow" state, and a 2 s hold for Grown-ups
- [x] 3.2 `js/session.js`: plan, step order, auto-advance, target cue, re-prompts, errorless finish, the 3-in-a-row rule, time budget
- [x] 3.3 Resume: Home hold, reload, sleep, next day
- [x] 3.4 Progress path and seed row; guide poses wired to states
- [x] 3.5 Step: Sounds and words (Find it from the old detective, with mix-up distractors)
- [x] 3.6 Step: New tricky word (hear, say-spell-say, find the heart; family shown after)
- [x] 3.7 Step: Read with me (grown-up marks, ✓ plays and advances, hold to skip)
- [x] 3.8 Step: Maths, today's crocodile rounds (4 items)
- [x] 3.9 Garden celebration with the spoken summary
- [x] 3.10 Fading hearts in reading
- [x] 3.11 Remove the old tiles, modes and typing; remove `data/default-week.js`

## 4. Grown-ups

- [x] 4.1 Number-pad gate
- [x] 4.2 Progress view, "Where is she?" picker and "Practise one game"
- [x] 4.3 Speed and test voice
- [x] 4.4 Backup, restore (with all rejection cases) and two-step reset

## 5. Tests

- [x] 5.1 A full session completed using only answer taps
- [x] 5.2 DOM rules: one primary target, no mode switch, targets of at least 120 px, at least 70% height used, no scroll
- [x] 5.3 Scheduler unit checks: once-a-day up-moves, intervals, clock moved back, rehearsal ratio
- [x] 5.4 Migration, restore and reset
- [x] 5.5 Resume across reload and date change
- [x] 5.6 Screenshots of every step at both sizes, reviewed against the UX checklist

## 6. Docs

- [x] 6.1 README (Today, no weekly typing, backups), SECURITY (backup contents) and CLAUDE.md (state, layout, roadmap)
- [x] 6.2 `npm test` and `npm run spec` pass

## 7. Try on the tablet

- [ ] 7.1 Owner runs one full session with her and notes stray taps, "what do I do?" moments, help taps, first-try accuracy and length (target: at most 2 moments, 10 ± 2 minutes)
- [ ] 7.2 Archive the change after the owner is happy
