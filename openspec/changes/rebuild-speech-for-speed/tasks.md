# Tasks: Rebuild speech for speed (Phase 3)

## 1. Speech engine

- [x] 1.1 `say()` with `opts.onWord`: `onboundary` when available, calibrated estimate otherwise
- [x] 1.2 Duration calibration (moving average, in memory only)
- [x] 1.3 A watchdog on every utterance; the post-cancel delay only when the engine was speaking
- [x] 1.4 Warm-up on the first touch; no sound before it
- [x] 1.5 Placeholder caption strip for everything `say()` speaks

## 2. Lessons without waits

- [x] 2.1 `sayWord`: speech first, sweep during speech
- [x] 2.2 `saySpellSay`: 3 utterances with letters lit during the middle one
- [x] 2.3 Story "Read it to me": one utterance with synced word highlighting
- [x] 2.4 Join praise and word into one utterance; remove the fixed waits in detective, hearts, story and croc
- [x] 2.5 Make double taps safe: a solved item ignores further taps

## 3. Feedback, icons, font, sizes

- [x] 3.1 `LR.ui.feedback()` with CSS states and WebAudio tones
- [x] 3.2 `js/icons.js`, and replace the emoji in interface chrome
- [x] 3.3 Bundle Andika WOFF2 and `OFL.txt` (after the owner's OK) and wire up `@font-face` (the Latin subset, from the `@fontsource/andika` npm package, because SIL's site is blocked from the build environment)
- [x] 3.4 Child targets of at least 120 px; rebalance the 614 px landscape query

## 4. Tests

- [x] 4.1 Speed test: CPU throttled 6x, stubbed speechSynthesis; a visible change within 100 ms and `speak()` within 50 ms of right, wrong and mid-speech taps
- [x] 4.2 Stall test: `onend` never fires; the sequence continues within the watchdog
- [x] 4.3 Highlight test: words light in order during the sentence, and none stays lit after a stop
- [x] 4.4 Target size test: every child `[data-act]` is at least 120x120 px at both sizes
- [x] 4.5 Emoji test: no emoji in interface chrome
- [x] 4.6 Caption test: the spoken text shows while speaking, clears after, and covers no target
- [x] 4.7 Screenshots at 1280x614 and 800x1094 with reduced motion, reviewed against the UX checklist

## 5. Docs

- [x] 5.1 Update README and CLAUDE.md (speech rules, 120 px)
- [x] 5.2 `npm test` and `npm run spec` pass

## 6. Try on the tablet

- [ ] 6.1 Owner tries every lesson with her once: does it feel instant, and do the highlights keep up with the voice?
- [ ] 6.2 Archive the change after the owner is happy
