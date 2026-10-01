# Tasks: Indian English voice clips (Phase 7)

## 1. Clip list

- [x] 1.1 `LR.phrases` table (`data/phrases.js`) for every prompt and praise string
- [x] 1.2 `tools/list-clips.js` collects units, maths output spaces, letter and grapheme names and phrases into `tools/clip-list.txt`
- [x] 1.3 Coverage test: everything said during `npm test` can be played from the list, and the list is up to date

## 2. Clip import

- [x] 2.1 `tools/import-clips.js`: check supplied files against `clip-list.txt`, convert WAV, read durations and timings, write `audio/clips/` and `audio/manifest.js`
- [x] 2.2 Optional `tools/make-clips.ps1` helper for Heera en-IN with SpeakProgress timings
- [x] 2.3 `audio/README.md`: how to supply clips, file naming, and how to add a string
- [ ] 2.4 Owner supplies the clips; import and commit them
- [x] 2.5 Load `audio/manifest.js` in `index.html` before `js/speech.js`

## 3. Playback

- [x] 3.1 `preload()` with an LRU of Audio elements; preload the next item when each item is drawn
- [x] 3.2 Clip lookup: whole text, then split parts, then the tablet voice
- [x] 3.3 Sequences with gaps under 150 ms; `onWord` from clip timings
- [x] 3.4 Watchdog, `play()` rejection fallback, and `playbackRate` from the speed setting
- [x] 3.5 Grown-ups clips and captions switches; `clips` and `captions` in schema 2 `validate()`

- [x] 3.6 Pace (owner feedback: "too fast"): Grown-ups Calm / Normal / Quick; the runner holds each finished item for a beat; sweeps, Flash and animations scale; `pace` in `validate()`

## 4. Tests

- [ ] 4.1 Preload latency: measured on the tablet once clips exist (headless Chromium can't measure real audio start)
- [x] 4.2 Fallback: a clip 404 falls back to the tablet voice; a clip that runs past its length continues within the watchdog
- [x] 4.3 Highlight from timings: words light at the manifest's offsets
- [x] 4.4 No requests leave the site

## 5. Docs

- [x] 5.1 README (voice, the clip tool), SECURITY (computer-voice clips) and CLAUDE.md (speech rules)
- [x] 5.2 `npm test` and `npm run spec` pass

## 6. Try on the tablet

- [ ] 6.1 Owner runs a few sessions with her: is the voice right, and does it feel quicker?
- [ ] 6.2 Archive the change
