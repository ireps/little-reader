# Design: Rebuild speech for speed

## Context

- The app runs on Silk 108 on Android 5.1, with one tablet voice (en_US). Android's TTS engine
  starts slowly for each utterance, so fewer utterances means less waiting.
- `onboundary` has not been tested on the tablet.
- The CSP has `connect-src 'none'`, and WebAudio oscillators need no network.
- The site is static, has no build step and uses classic scripts.

## Goals / Non-Goals

**Goals:**
- Visible feedback under 100 ms, and `speechSynthesis.speak()` called within 50 ms of a tap.
- The fewest utterances possible per action.
- No stalls, whatever the TTS engine does.

**Non-Goals:**
- Indian English clips (Phase 7).
- New lessons or flow changes (Phase 4).
- Offline mode (Later).

## Decisions

### D1. `say(text, opts)` in `speech.js`
- `text` is one string, so callers join phrases (`'Yes! ' + w`).
- `opts.words` is an array of the word spans to light, for sentences.
- `opts.onWord(i)` fires as each word starts:
  - from `onboundary` events (`charIndex` mapped to a word index) when the engine sends them;
  - otherwise from a timer schedule built from the calibration below.
- Once `onboundary` has fired on this device, `LR.speech.hasBoundary` stays true for the page's life,
  and the timer schedule is skipped.
- **Calibration:** after every utterance that ends normally, the app records
  `ms per character = duration / text.length` at the current rate. It keeps a moving average of the
  last 10, which starts at 75 ms at rate 1. The average stays in memory only (no storage).
- Each word's start time comes from the character offsets scaled by that average. The first word
  starts at 0 on `onstart`, or at `speak()` if `onstart` never fires.
- **Watchdog:** `estimate + 1000 ms` settles the promise, where `estimate` is the calibrated
  duration, or `600 + 90 ms × characters` before any calibration.
- The 80 ms post-cancel delay is kept only when the engine was actually speaking. With nothing
  speaking, `speak()` is called at once.
- The clip hook (`LR.clips`) is unchanged and unused.

### D1b. Placeholder captions
- `say()` writes its text with `textContent` into a fixed caption strip (`#caption`, `aria-live="polite"`)
  at the bottom edge, in the space kept clear of targets, and clears it when the promise settles or on
  `stopAll()`.
- The caption is a stand-in for the voice. Phase 7 hides it by default once clips exist.

### D2. Warm-up
- The first `pointerdown` on the document speaks a single-space utterance at volume 0, which loads
  the engine, and creates the `AudioContext`.
- Nothing speaks before that first touch.

### D3. Feedback layers (`LR.ui.feedback(el, 'right'|'wrong')`)
- Called synchronously in the tap handler, before any speech:
  - it adds a class to the tapped element;
  - it plays a WebAudio tone: right is two sine notes of 80 ms (C6, E6) at low gain; wrong is a
    single 110 ms note (A3) at lower gain.
- One `AudioContext` is created on the first touch and resumed on every touch.
- **Right** is leaf green with an SVG ✓. **Wrong** is grey at 45% opacity with a small dot. No red,
  no ✗.

### D4. Sweeps and sequences
- **`sayWord`** calls `say(word)` first. The letters light evenly across the estimated duration,
  starting from `onstart`.
- **`saySpellSay`** runs 3 utterances: the word, then the letter names joined with commas in one
  utterance with letters lit by boundary or estimate, then the word.
- **Story "Read it to me"** is one utterance with words lit via `onWord`. The word-by-word pass
  and the repeat are removed.
- **Waits:** detective, hearts, story and croc lose their fixed `setTimeout` waits and advance on
  `say()` settling.

### D5. Icons and font
- `js/icons.js` exports `LR.icons.home`, `speaker`, `check`, `star`, `flower`, `heart`, `arrow`
  and `dot` as inline SVG strings.
- Icons use `currentColor`, carry no inline styles, and have `aria-hidden` plus a label on the
  button.
- The emoji in interface chrome are replaced. Content emoji stay, limited to Unicode 8.
- Andika Regular and Bold are self-hosted as WOFF2 with `font-display: swap`, alongside `OFL.txt`.

### D6. Sizes
- Child targets have `min-width` and `min-height` of 120 px.
- The mode switch, previous and next, Hear it again, chips, number and mouth buttons grow to 120 px.
- Home grows to 88 px only. It isn't an answer target, a bigger one is easier to hit by accident,
  and Phase 4 turns it into a 1 s hold.
- Words in a sentence stay at text size (at least 60 px tall), and the letters of a word in Find the
  heart are 120 px tall and at least 60 px wide. Making them 120 px squares would break up the reading.
- The 614 px landscape query is rebalanced so nothing scrolls: the word font drops before the
  targets shrink.
- **Heart words** puts the previous and next arrows beside the word. **The story** puts previous,
  the modes, the read button and next on one row (in portrait the modes get a row of their own).
- **The crocodile** starts the next round once the answer has been spoken, so its Next button goes.

## Risks / Trade-offs

- **The tablet voice's own start-up time is out of our control.** We can only stop adding to it.
  Phase 7's preloaded clips remove it.
- **Estimated word timings may drift** on long sentences. Punctuation adds a fixed pause to the
  estimate, and the tablet try checks it.
- **The US voice stays** until Phase 7.
