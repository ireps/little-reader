# Design: Rebuild speech for speed

## Context

The app runs on Silk 108 on Android 5.1. Android's TTS engine starts slowly for each utterance, and
`onboundary` has not been tested there. The CSP has `connect-src 'none'`, so audio is loaded through
`<audio>` or `Audio` elements (`media-src 'self'`), never through fetch or XHR. The site is static,
has no build step and uses classic scripts.

## Goals / Non-Goals

**Goals:**
- Sub-100 ms visible feedback and sub-150 ms audio start for preloaded clips.
- Clip coverage for every string the current lessons say.
- A tablet voice fallback that never stalls.

**Non-Goals:**
- New lessons or flow changes (those are Phase 4).
- Offline caching with a service worker (Later).

## Decisions

### D1. Clip generation: `tools/make-clips.ps1` (dev-only)
- Runs on the owner's Windows PC with System.Speech and the **Microsoft Heera (en-IN)** voice.
- Input is `tools/clip-list.txt`, generated from `LR.words`, the lessons' phrase tables and number
  names by `node tools/list-clips.js`.
- For each string it:
  - synthesises a WAV;
  - records `SpeakProgress` word offsets in ms;
  - encodes it with ffmpeg to MP3, 32 kbps, mono, 22.05 kHz.
- It writes `audio/clips/<slug>.mp3` and `audio/manifest.js`:
  `LR.clips = { "come": { f: "come.mp3", t: [0] }, "come from plants": { f: "...", t: [0, 310, 690] } }`,
  where `t` holds the start time in ms of each word.
- The slug is a lowercase ASCII key; a collision gets a numeric suffix.
- *Alternatives rejected:*
  - The tablet's TTS: US-only, slow to start, no timings.
  - Cloud TTS: needs a key and a network.
  - Recording a person: "no recordings, ever".

### D2. `speech.js`
- **`preload(texts)`** creates `Audio` objects for the next screen's clips, with `preload = 'auto'`,
  and keeps up to 40 in an LRU cache.
- **`say(textOrArray, opts)`**:
  - an array plays the clips back to back, starting each one on the previous clip's `ended`
    event, so gaps stay under 150 ms;
  - `opts.onWord(i)` fires from a `timeupdate` / `requestAnimationFrame` loop that compares
    `currentTime` against `t[i]`;
  - with no clip, it falls back to one tablet utterance for the whole text, and word highlighting
    uses `onboundary` if it fires, else times estimated from the text length and rate.
- **Watchdog.** Each play arms a timer for `duration + 1000 ms`, or `600 + 90 ms × characters`
  for TTS, which settles the promise. `play()` rejections settle at once, then the TTS fallback runs.
- **Rate.** The speed setting maps to `audio.playbackRate` (0.75 to 1.1) for clips and `u.rate`
  for TTS.
- The 80 ms post-cancel delay applies to TTS only.
- **Unlock.** The first `pointerdown` on the document plays a silent clip and a zero-volume
  utterance, so both paths are warm. Nothing plays before that.

### D3. Feedback layers (`LR.ui.feedback(el, 'right'|'wrong')`)
- Called synchronously in the tap handler, before any speech:
  - it adds a class to the tapped element;
  - it plays a WebAudio tone: right is two sine notes of 80 ms (C6, E6) at low gain; wrong is a
    single 110 ms note (A3) at lower gain.
- One `AudioContext` is created on the first touch and resumed on every touch.
- **Right** is leaf green with an SVG ✓. **Wrong** is grey at 45% opacity with a small dot. No red,
  no ✗.

### D4. Sweep during audio
- `sayWord` and `saySpellSay` start the audio first.
- Letter or word lighting is driven by the clip's time offsets. A single word lights its letters
  evenly across the clip's duration.
- Say-spell-say becomes one joined sequence: word, then the letter names, then the word.

### D5. Icons and font
- `js/icons.js` exports `LR.icons.home`, `speaker`, `check`, `star`, `flower`, `heart`, `arrow`
  and `dot` as inline SVG strings.
- Icons use `currentColor`, carry no inline styles, and have `aria-hidden` plus a label on the
  button.
- The emoji in interface chrome are replaced. Content emoji stay, limited to Unicode 8.
- Andika Regular and Bold are self-hosted as WOFF2 with `font-display: swap`, alongside `OFL.txt`.

### D6. Sizes
- Child targets have `min-width` and `min-height` of 120 px.
- The mode switch, previous and next, Hear it again and Home grow to 120 px.
- The 614 px landscape query is rebalanced so nothing scrolls: the word font drops before the
  targets shrink.

## Risks / Trade-offs

- **Repo size** grows by about 10 MB. That's acceptable on Pages, and clips are fetched only
  when needed.
- **Silk may not honour `preload`** on cellular or data-saver. The 600 ms first-play budget and the
  TTS fallback cover it.
- **Heera timings** come from System.Speech offsets, which may drift by 20 to 40 ms. That's fine
  for highlighting.
- **Only the owner can generate clips** (Windows). The coverage test fails fast when a string lacks
  a clip, and the tablet voice still covers it at runtime.
