# Tasks: Guided daily session (Phase 4)

## 1. Prototype and approval (stop here until the owner approves)

- [ ] 1.1 Design tokens and components in `css/app.css`; `js/guide.js` with 4 SVG poses; garden SVG
- [ ] 1.2 `tools/prototype.html` and `tools/prototype.js` with fixtures for every screen and state
- [ ] 1.3 `tests/prototype.js` screenshots at 1280x614 and 800x1094 with reduced motion
- [ ] 1.4 Review against the UX checklist; fix; send the screenshots to the owner
- [ ] 1.5 **Owner approves the screenshots**

## 2. Data

- [ ] 2.1 Schema 2 in `js/store.js` with `validate()` limits
- [ ] 2.2 Migrations: schema 1 → 2 and Reading Garden → 2, with fixtures
- [ ] 2.3 Storage-full handling and the `warn` field
- [ ] 2.4 `js/progress.js`: records, intervals, up and down moves, mastery and flowers, dates
- [ ] 2.5 Incremental rehearsal plan, new-word pacing and unit advancement
- [ ] 2.6 First units `data/units/p4-01.js`…`p4-04.js`: decodable words, her tricky words, 2 stories each

## 3. Session

- [ ] 3.1 Home: garden and Start, the "See you tomorrow" state, and a 2 s hold for Grown-ups
- [ ] 3.2 `js/session.js`: plan, step order, auto-advance, target cue, re-prompts, errorless finish, the 3-in-a-row rule, time budget
- [ ] 3.3 Resume: Home hold, reload, sleep, next day
- [ ] 3.4 Progress path and seed row; guide poses wired to states
- [ ] 3.5 Step: Sounds and words (Find it from the old detective, with mix-up distractors)
- [ ] 3.6 Step: New tricky word (hear, say-spell-say, find the heart; family shown after)
- [ ] 3.7 Step: Read with me (grown-up marks, ✓ plays and advances, hold to skip)
- [ ] 3.8 Step: Maths, today's crocodile rounds (4 items)
- [ ] 3.9 Garden celebration with the spoken summary
- [ ] 3.10 Fading hearts in reading
- [ ] 3.11 Remove the old tiles, modes and typing; remove `data/default-week.js`

## 4. Grown-ups

- [ ] 4.1 Number-pad gate
- [ ] 4.2 Progress view, "Where is she?" picker and "Practise one game"
- [ ] 4.3 Speed and test voice
- [ ] 4.4 Backup, restore (with all rejection cases) and two-step reset

## 5. Tests

- [ ] 5.1 A full session completed using only answer taps
- [ ] 5.2 DOM rules: one primary target, no mode switch, targets of at least 120 px, at least 70% height used, no scroll
- [ ] 5.3 Scheduler unit checks: once-a-day up-moves, intervals, clock moved back, rehearsal ratio
- [ ] 5.4 Migration, restore and reset
- [ ] 5.5 Resume across reload and date change
- [ ] 5.6 Screenshots of every step at both sizes, reviewed against the UX checklist

## 6. Docs

- [ ] 6.1 README (Today, no weekly typing, backups), SECURITY (backup contents) and CLAUDE.md (state, layout, roadmap)
- [ ] 6.2 `npm test` and `npm run spec` pass

## 7. Try on the tablet

- [ ] 7.1 Owner runs one full session with her and notes stray taps, "what do I do?" moments, help taps, first-try accuracy and length (target: at most 2 moments, 10 ± 2 minutes)
- [ ] 7.2 Archive the change after the owner is happy
