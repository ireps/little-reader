# Design: Indian English voice clips

## Context

- After Phases 3 to 6, `say()` uses the tablet voice with calibrated timings. All content is built
  in, and every spoken string passes through `say()`.
- The CSP has `connect-src 'none'`, so clips load through `Audio` elements (`media-src 'self'`),
  never through fetch or XHR.
- The owner has a Windows PC. This repo's cloud sessions run Linux, where the Heera voice isn't
  available.

## Goals / Non-Goals

**Goals:**
- Every string has a clip, and a missing clip is caught by `npm test`.
- Audio starts within 150 ms for a preloaded clip.
- Highlighting is timed from real word offsets.

**Non-Goals:**
- Recording a person (never).
- Cloud TTS (needs a key and a network).

## Decisions

### D1. The clip list (`tools/list-clips.js`)
- Loads the app's data scripts in a Node `vm` context (classic scripts on `LR`, so no build step is
  needed).
- `LR.phrases` lives in `data/phrases.js`: every instruction and praise string, with `{w}` for a
  word or number. It is a dev-only list (not loaded by the app); the step code keeps its strings, and a test
  records everything said during `npm test` and fails if any of it can't be played from the list.
- Collects:
  - every unit's words, tricky words, story sentences, silly sentences, questions and answers;
  - each maths generator's full output space (number names 0 to 100, comparison phrases, money,
    shapes, days and months);
  - letter names, grapheme sounds, praise, and prompts from a `LR.phrases` table.
- Joined strings such as "Yes! come" are split at runtime into the clips "yes" and "come". Maths
  prompts are broken into their fixed pieces and numbers ("is greater than", "7").
- Writes `tools/clip-list.txt`: one normalised key and its file name per line, sorted and de-duplicated.
  `node tools/list-clips.js --check` (run by `npm test`) fails if the list is out of date.

### D2. Supplied clips and the importer (`tools/import-clips.js`, dev-only)
- `clip-list.txt` gives each string a file name (its slug), for example `come.mp3` and
  `the-frog-can-jump.mp3`. The owner supplies MP3 files (or WAV, which the importer converts with
  ffmpeg) under those names.
- The importer:
  - reports missing and extra files;
  - reads each clip's duration;
  - takes word timings from a `<slug>.json` next to the clip if the voice tool gave them, or else
    leaves them out, and the app spreads the words evenly over the clip;
  - removes clips from `audio/clips/` that are no longer in the folder or the list;
  - writes `audio/clips/` and `audio/manifest.js`.

### D2c. Neerja helper (`tools/make-clips-neerja.py`, dev-only, recommended)
- Heera clips sounded muffled to the owner, even after the format fixes. `make-clips-neerja.py` uses Microsoft's
  neural **en-IN-NeerjaNeural** voice through the `edge-tts` Python package (online, on the owner's PC only).
- It writes `audio/incoming/<slug>.mp3` (24 kHz mono MP3, as the service gives it) and `<slug>.json` from the
  WordBoundary events (offsets in 100 ns units, converted to ms), skips existing clips, retries with backoff, and
  can make a few clips first (`--only`) for a listening check.
- The owner found the default voice too "professional" for a child to follow. After comparing variants, they chose
  `--rate -10% --pitch +15Hz` (a little slower and higher, like child-directed speech), now the script's default.

### D2b. Optional Heera helper (`tools/make-clips.ps1`, dev-only)
- Runs on the owner's Windows PC with System.Speech and the **Microsoft Heera (en-IN)** voice.
- For each line of `clip-list.txt` it:
  - synthesises a WAV;
  - records `SpeakProgress` word offsets in ms;
  - (the importer encodes it with ffmpeg to MP3, 96 kbps, mono, at the voice's own sample rate; an
    earlier 48 kbps, 22.05 kHz setting sounded muffled).
- It writes `audio/incoming/<slug>.wav` and `<slug>.json`; the importer then converts and measures them
  and writes `audio/manifest.js`:
  `LR.clips = { "come": { f: "come.mp3", d: 480 }, "the frog can jump": { f: "...", d: 1300, t: [0, 140, 520, 760] } }`,
  where `d` is the length and `t` the start time in ms of each word.
- It skips strings whose clip already exists, so re-runs after small content changes are quick.

### D3. Playback in `speech.js`
- **`preload(text)`** creates `Audio` objects with `preload = 'auto'` for the next item's word,
  and keeps up to 40 in an LRU cache.
- **Lookup:** `say(text)` looks up the whole normalised text first. Failing that, it splits the text
  at sentence punctuation and covers each clause with the longest phrases that have clips (up to 8 words).
  If any part is missing, the tablet voice says the whole text.
- **Sequences** start each clip on the previous clip's `ended` event, so gaps stay under 150 ms.
- **`onWord(i)`** fires from timers started when the clip is `playing`, at `t[i]` divided by the
  playback rate; with `opts.parts`, words map onto the parts they start.
- **Watchdog:** each clip's `d / playbackRate + 1000 ms`. A `play()` rejection or an `error` falls back
  to the tablet voice for the whole text.
- **Rate:** the speed setting maps to `audio.playbackRate` (speed / 0.9, kept within 0.75 to 1.2).
- **Unlock:** nothing plays before the first touch, which also allows `play()`.
- **Clips switch:** with `clips: false`, speech skips the manifest and uses the tablet voice.
- **Captions:** hidden while a clip plays, unless Grown-ups "Show captions" is on. They always show
  when the tablet voice is used.

### D4. Spec upkeep
- This change's speech deltas are written as ADDED because the Phase 3 requirements they build on
  aren't archived yet. Before this change is applied, "Clip sentences" becomes a MODIFIED version of
  Phase 3's "One utterance per sentence", and "Joined clip sequences" a MODIFIED version of
  "Joined phrases", once those are in `openspec/specs/`.

## Risks / Trade-offs

- **Repo size** grows by 15 to 20 MB. That's acceptable on Pages, and clips are fetched only when
  needed.
- **Silk may not honour `preload`** on data-saver. The 600 ms first-play budget and the tablet voice
  cover it.
- **Heera timings** come from System.Speech offsets and may drift by 20 to 40 ms. That's fine for
  highlighting.
- **Only the owner can supply clips.** Missing clips are allowed: the tablet voice and caption cover
  them, and the importer names them.
