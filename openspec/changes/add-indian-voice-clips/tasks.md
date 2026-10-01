# Tasks: Indian English voice clips (Phase 7)

## 1. Clip list

- [ ] 1.1 `LR.phrases` table for every prompt and praise string (move them out of the step code)
- [ ] 1.2 `tools/list-clips.js` collects units, maths output spaces, letter and grapheme names and phrases into `tools/clip-list.txt`
- [ ] 1.3 Coverage test: every string in the list has a manifest entry (it is skipped until a manifest exists, then enforced)

## 2. Clip import

- [ ] 2.1 `tools/import-clips.js`: check supplied files against `clip-list.txt`, convert WAV, read durations and timings, write `audio/clips/` and `audio/manifest.js`
- [ ] 2.2 Optional `tools/make-clips.ps1` helper for Heera en-IN with SpeakProgress timings
- [ ] 2.3 `audio/README.md`: how to supply clips, file naming, and how to add a string
- [ ] 2.4 Owner supplies the clips; import and commit them
- [ ] 2.5 Load `audio/manifest.js` in `index.html` before `js/speech.js`

## 3. Playback

- [ ] 3.1 `preload()` with an LRU of Audio elements; preload the next item when each item is drawn
- [ ] 3.2 Clip lookup: whole text, then split parts, then the tablet voice
- [ ] 3.3 Sequences with gaps under 150 ms; `onWord` from clip timings
- [ ] 3.4 Watchdog, `play()` rejection fallback, and `playbackRate` from the speed setting
- [ ] 3.5 Grown-ups clips and captions switches; `clips` and `captions` in schema 2 `validate()`

## 4. Tests

- [ ] 4.1 Preload latency: a stubbed Audio starts within 150 ms of the tap
- [ ] 4.2 Fallback: a clip 404, a decode error and `ended` never firing all continue within the watchdog
- [ ] 4.3 Highlight from timings: words light at the manifest's offsets
- [ ] 4.4 No requests leave the site

## 5. Docs

- [ ] 5.1 README (voice, the clip tool), SECURITY (computer-voice clips) and CLAUDE.md (speech rules)
- [ ] 5.2 `npm test` and `npm run spec` pass

## 6. Try on the tablet

- [ ] 6.1 Owner runs a few sessions with her: is the voice right, and does it feel quicker?
- [ ] 6.2 Archive the change
