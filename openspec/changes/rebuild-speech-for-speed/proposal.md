# Proposal: Rebuild speech for speed (Phase 3)

## Why

The app feels slow and unresponsive on the tablet, and every part of that delay is in our own code:

- **One speech request per word or letter.** "Read it to me" on 8 words takes about 10 s, and
  "Say, spell, say" about 5 s, because each word is its own utterance and Android 5.1 pays a start-up
  cost for each one.
- **Waits built in before any sound.** `ui.sayWord()` sweeps the letters (140 ms each) *before* it
  speaks, so a 4-letter word stays silent for about 560 ms. There are also fixed pauses: 400 ms in
  Word detective, 300 ms in Heart words, 350 and 500 ms between steps, and 80 ms after every cancel.
- **Stalls.** If Silk never fires the speech "end" event, `say()` waits out its 3 to 4 s timeout on
  every line.
- **Feedback is speech alone,** so a right or wrong tap shows nothing until the voice starts, 0.5 to
  4 s later.

The owner also wants an Indian English voice, and the tablet has only en_US.

This is the quick win. It works on today's lessons and makes the tablet feel fast and polished
before the bigger rebuild (Phase 4).

## What Changes

- **Pre-made clips in an Indian English female computer voice** (Microsoft Heera, en-IN), generated
  on the owner's PC by a dev-only tool. Each clip comes with word timings. The tablet voice becomes
  the fallback.
- **One clip per sentence,** with each word lit in time with the audio. No more per-word utterances.
- **Highlights run with the sound, never before it.** All fixed waits are removed; the next thing
  happens when the audio ends.
- **Watchdogs** so no sequence waits longer than a clip's length plus 1 s.
- **Instant feedback in under 100 ms:** a colour state plus a short chime or soft tone made with
  WebAudio (no file, no fetch), before any speech.
- **Polish on today's lessons:** SVG interface icons instead of emoji, the Andika font bundled (with
  the owner's OK to download it from SIL), and child targets of at least 120 px.
- **Nothing is spoken before the first touch.**

## Capabilities

### New Capabilities
- `performance`: latency budgets for taps and audio, no fixed waits, no stalls, and double-tap safety.
- `child-ux`: the instant feedback layers, SVG interface icons and the Andika font. Phase 4 adds the rest.

### Modified Capabilities
- `speech`: clips in an Indian English voice first, one clip per sentence with synced highlighting,
  joined phrases, tablet voice as fallback, and silence until the first touch.
- `platform`: child tap targets grow from 64 px to 120 px (Grown-ups stays at 64 px). Clips are
  served from the same site.

## Impact

- **Code:** `js/speech.js` (preload, sequences, timings, watchdog), `js/ui.js` (sweep during
  audio, feedback layers, icons), every lesson in `js/lessons/` (waits removed), and `css/app.css`
  (sizes, states, Andika).
- **New files:**
  - `tools/make-clips.ps1` (dev-only, Windows);
  - `audio/clips/*.mp3` and `audio/manifest.js` (about 8 to 10 MB);
  - `js/icons.js`;
  - `fonts/Andika-*.woff2` and `fonts/OFL.txt`.
- **Tests:** a speed test with the CPU throttled 6x, a clip coverage test and a target size test.
- **Docs:** README (voice, audio), SECURITY (clips come from a computer voice), CLAUDE.md (speech
  rules, target size).
- **Tablet try (owner, with her):** every lesson once. Does it feel instant? Is the voice right?
