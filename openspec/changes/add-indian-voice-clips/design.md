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
- Collects:
  - every unit's words, tricky words, story sentences, silly sentences, questions and answers;
  - each maths generator's full output space (number names 0 to 100, comparison phrases, money,
    shapes, days and months);
  - letter names, grapheme sounds, praise, and prompts from a `LR.phrases` table.
- Joined strings such as "Yes! come" are split at runtime into the clips "Yes!" and "come".
- Writes `tools/clip-list.txt`: one normalised string per line, sorted and de-duplicated.

### D2. Clip generation (`tools/make-clips.ps1`, dev-only)
- Runs on the owner's Windows PC with System.Speech and the **Microsoft Heera (en-IN)** voice.
- For each line of `clip-list.txt` it:
  - synthesises a WAV;
  - records `SpeakProgress` word offsets in ms;
  - encodes it with ffmpeg to MP3, 32 kbps, mono, 22.05 kHz.
- It writes `audio/clips/<slug>.mp3` and `audio/manifest.js`:
  `LR.clips = { "come": { f: "come.mp3", t: [0] }, "the frog can jump": { f: "...", t: [0, 140, 520, 760] } }`,
  where `t` holds the start time in ms of each word.
- It skips strings whose clip already exists, so re-runs after small content changes are quick.

### D3. Playback in `speech.js`
- **`preload(texts)`** creates `Audio` objects with `preload = 'auto'` for the next screen's clips,
  and keeps up to 40 in an LRU cache.
- **Lookup:** `say(text)` looks up the whole normalised text first. Failing that, it splits the text
  at sentence punctuation and `!` and plays the parts as a sequence if every part has a clip.
  Otherwise it falls back to the tablet voice for the whole text.
- **Sequences** start each clip on the previous clip's `ended` event, so gaps stay under 150 ms.
- **`onWord(i)`** fires from a `timeupdate` / `requestAnimationFrame` loop that compares
  `currentTime` against `t[i]`.
- **Watchdog:** `duration + 1000 ms`. A `play()` rejection falls back to the tablet voice.
- **Rate:** the speed setting maps to `audio.playbackRate`.
- **Unlock:** the first touch also plays a silent clip.
- **Clips switch:** with `clips: false`, speech skips the manifest and uses the tablet voice.

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
- **Only the owner can generate clips** (Windows). The coverage test names every missing string,
  and the tablet voice still covers them at runtime.
