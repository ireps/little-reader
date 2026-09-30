# Tasks: Rebuild speech for speed (Phase 3)

## 1. Clip pipeline

- [ ] 1.1 Add `tools/list-clips.js` (Node, dev-only) to collect every string the lessons can say into `tools/clip-list.txt`
- [ ] 1.2 Add `tools/make-clips.ps1` (System.Speech, Heera en-IN, SpeakProgress timings, ffmpeg to 32 kbps mono MP3) writing `audio/clips/` and `audio/manifest.js`
- [ ] 1.3 Document the tool in `audio/README.md`: prerequisites, how to run it, and how to add a string
- [ ] 1.4 Owner runs the tool and commits the clips and the manifest
- [ ] 1.5 Load `audio/manifest.js` in `index.html` before `js/speech.js`

## 2. Speech engine

- [ ] 2.1 `preload()` with an LRU of Audio elements
- [ ] 2.2 `say()` accepts an array and joins clips with gaps under 150 ms
- [ ] 2.3 `onWord` timing callbacks from clip offsets; `onboundary` or an estimate for the TTS fallback
- [ ] 2.4 A watchdog on every play; `play()` rejection falls back to TTS
- [ ] 2.5 The speed setting maps to `playbackRate`
- [ ] 2.6 Unlock on the first touch; no sound before it

## 3. Lessons without waits

- [ ] 3.1 `sayWord` and `saySpellSay`: audio first, sweep driven by timings
- [ ] 3.2 Story read-back: one clip per sentence with synced word highlighting
- [ ] 3.3 Remove the fixed waits in detective, hearts, story and croc; advance on audio end
- [ ] 3.4 Preload the next item's clips when each item is drawn
- [ ] 3.5 Make double taps safe: a solved item ignores further taps

## 4. Feedback, icons, font, sizes

- [ ] 4.1 `LR.ui.feedback()` with CSS states and WebAudio tones
- [ ] 4.2 `js/icons.js`, and replace the emoji in interface chrome
- [ ] 4.3 Bundle Andika WOFF2 and `OFL.txt` (after the owner's OK) and wire up `@font-face`
- [ ] 4.4 Child targets of at least 120 px; rebalance the 614 px landscape query

## 5. Tests

- [ ] 5.1 Speed test: CPU throttled 6x, stubbed Audio; a visible change within 100 ms of right, wrong and mid-audio taps
- [ ] 5.2 Stall test: `ended` never fires, `play()` rejects, TTS never ends; the sequence continues within the watchdog
- [ ] 5.3 Coverage test: every string from `list-clips.js` has a manifest entry
- [ ] 5.4 Target size test: every child `[data-act]` is at least 120x120 px at both sizes
- [ ] 5.5 Emoji test: no emoji in interface chrome
- [ ] 5.6 Screenshots at 1280x614 and 800x1094 with reduced motion, reviewed against the UX checklist

## 6. Docs and archive

- [ ] 6.1 Update README (voice, audio, run the clip tool), SECURITY (computer-voice clips) and CLAUDE.md (speech rules, 120 px)
- [ ] 6.2 `npm test` and `npm run spec` pass

## 7. Try on the tablet

- [ ] 7.1 Owner tries every lesson with her once: does it feel instant, and is the voice right?
- [ ] 7.2 Archive the change (`openspec archive rebuild-speech-for-speed`) after the owner is happy
