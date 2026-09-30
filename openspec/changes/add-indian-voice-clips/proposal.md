# Proposal: Indian English voice clips (Phase 7)

## Why

The owner wants an Indian English voice, and the tablet has only one voice (en_US), which it also
starts slowly for each utterance. Pre-made clips from a computer voice fix both problems. The full
list of strings, though, is known only once every built-in word, sentence, story, question and
prompt exists, which is at the end of Phases 4 to 6. That is why this is the last phase. Generating
clips earlier would mean re-running the tool after every content change.

## What Changes

- **Pre-made clips in an Indian English female computer voice** (Microsoft Heera, en-IN), generated
  on the owner's Windows PC by a dev-only tool. Each clip comes with word timings.
- **A single clip list, derived from the app's own content:** every string `say()` can receive,
  including units, stories, silly sentences, questions, maths prompts, number names, letter names,
  praise and prompts.
- **Clips first, the tablet voice as fallback.** A missing or failing clip never breaks a session.
- **A preload** of the next screen's clips, so audio starts within 150 ms.
- **One clip per sentence,** with word highlighting driven by the clip's timings instead of the
  estimate.
- **Joined clip sequences** with gaps under 150 ms.
- **A coverage test** that fails when any string lacks a clip, from this phase onward.
- **A Grown-ups switch** turns clips on or off.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `speech`: clips first with the tablet voice as fallback; complete coverage; clip sentences with timings; joined clip sequences.
- `performance`: audio starts within 150 ms for a preloaded clip.
- `grown-ups`: the clips on or off switch.
- `platform`: clip files are served from the same site.

## Impact

- **New files:**
  - `tools/list-clips.js` (Node, dev-only);
  - `tools/make-clips.ps1` (Windows, dev-only);
  - `audio/clips/*.mp3` (about 1,500 clips, 15 to 20 MB);
  - `audio/manifest.js`.
- **Code:** `js/speech.js` (preload, clip playback, clip timings, sequences) and `index.html`
  (manifest script).
- **State:** adds `clips: true` to schema 2 in `validate()`.
- **Tests:** a coverage test, a preload latency test, and clip fallback and stall tests.
- **Docs:** README (voice, running the clip tool), SECURITY (clips come from a computer voice),
  CLAUDE.md.
- **Owner:** runs the tool on a Windows PC with the Heera voice installed, and commits the output
  (or sends it over).
- **Tablet try (owner, with her):** a few sessions. Is the voice right, and does it feel quicker?
