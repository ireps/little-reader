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

This is the quick win. It works on today's lessons with the tablet's own voice, and makes the tablet
feel fast and polished before the bigger rebuild (Phase 4).

The Indian English voice clips move to the last phase (Phase 7, `add-indian-voice-clips`). Only
once Phases 4 to 6 have fixed every word, sentence and phrase is the full list of clips known.

## What Changes

- **Fewer, joined utterances.** A sentence is one utterance. Say-spell-say is 3 utterances
  (word, letters, word) instead of one per letter. Praise and a word join into one utterance
  ("Yes! come").
- **Highlights run with the sound, never before it.** Words and letters are lit from `onboundary`
  events where Silk fires them, and otherwise from a timing estimate. The estimate is calibrated from
  how long this tablet's earlier utterances took.
- **All fixed waits are removed.** The next thing happens when the speech ends.
- **Watchdogs,** so no sequence waits longer than the speech's estimated length plus 1 s.
- **Speech engine warm-up** on the first touch. Nothing is spoken before that touch.
- **Instant feedback in under 100 ms:** a colour state plus a short chime or soft tone made with
  WebAudio (no file, no fetch), before any speech.
- **Polish on today's lessons:** SVG interface icons instead of emoji, the Andika font bundled (with
  the owner's OK to download it from SIL), and child targets of at least 120 px.
- **The clip hook stays** (`LR.clips`), unused until Phase 7.

## Capabilities

### New Capabilities
- `performance`: latency budgets for taps and speech requests, no fixed waits, no stalls, and double-tap safety.
- `child-ux`: the instant feedback layers, SVG interface icons and the Andika font. Phase 4 adds the rest.

### Modified Capabilities
- `speech`: stop-and-clear covers highlights, one utterance per sentence with synced highlighting,
  joined phrases, and silence until the first touch.
- `platform`: child tap targets grow from 64 px to 120 px (Grown-ups stays at 64 px), and fonts are
  served from the same site.

## Impact

- **Code:** `js/speech.js` (joined utterances, boundary and estimated timings, watchdog,
  warm-up), `js/ui.js` (sweep during speech, feedback layers, icons), every lesson in
  `js/lessons/` (waits removed), and `css/app.css` (sizes, states, Andika).
- **New files:** `js/icons.js`, `fonts/Andika-*.woff2` and `fonts/OFL.txt`.
- **Tests:** a speed test with the CPU throttled 6x, a stall test, a target size test and an emoji
  test.
- **Docs:** README, CLAUDE.md (speech rules, target size).
- **Tablet try (owner, with her):** every lesson once. Does it feel instant? Do the highlights keep
  up with the voice?
