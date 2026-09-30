# Proposal: Guided daily session (Phase 4)

## Why

Watching her use Phases 0 to 2 showed the app asks a 5-year-old to do what she can't:

- **She doesn't know what to tap.** Home has 4 tiles, and the lessons are full of ◀ ▶, Next and
  several buttons.
- **She takes the easy route.** She flips Together / My turn on every sentence, and "Read it to me"
  is the biggest, greenest button, so the app does the reading.
- **Instructions are written,** and she can't read them yet.
- **Nobody will type content,** so an app that needs weekly words and a paragraph stops being useful.

## What Changes

- **Home is her garden plus one huge Start.** Grown-ups is a small corner link that needs a 2 s hold.
- **A guided session of about 10 minutes** that runs itself, in a fixed order: Sounds and words →
  New tricky word → Silly sentences → Read with me → Maths → Garden. Items advance with no Next
  button. Steps whose content arrives in a later phase are skipped until then; the maths step uses
  today's crocodile rounds until Phase 6.
- **She tries first.** Nothing she has to read is spoken before her attempt. There are no modes.
  After 2 misses the answer is shown and said, and the session moves on.
- **Spaced review** with boxes 0 to 5 and incremental rehearsal (1 weak item for every 3 known).
  Words are mastered at box 3; each one grows a flower.
- **Read with me:** she reads to the grown-up, one sentence per screen. A grown-up tap on a word helps
  and marks it; ✓ plays the sentence and moves on.
- **Built-in content:** the first Phase 4 (adjacent consonants) units, her known tricky words, and
  "Find it" (today's Word detective). Everything else comes in Phase 5.
- **Child UX system:**
  - an SVG guide character with static poses;
  - spoken prompts of at most 6 words;
  - one primary target at a time;
  - a progress path and a seed row;
  - fading hearts;
  - holds to leave;
  - a garden celebration.
- **Grown-ups, tap only:**
  - a number-pad gate;
  - a progress view;
  - a "Where is she?" unit picker;
  - "Practise one game";
  - speed and clips on or off;
  - backup, restore and reset.
- **BREAKING:** the four tiles, Together / My turn and the typing boxes are removed. Schema 1 data
  is migrated.
- **Prototype gate:** `tools/prototype.html` screenshots are approved by the owner before the
  session is built.

## Capabilities

### New Capabilities
- `daily-session`: home, step order, auto-advance, target cue, re-prompts, try-first, errorless finish, length, resume.
- `learning-progress`: boxes, intervals, mastery, incremental rehearsal, new-word pacing, unit advancement, dates.
- `read-with-me`: sentence-per-screen reading to a grown-up with grown-up marks.
- `english-kg2`: tricky words, heart letters and the Find it activity (Phase 5 adds the rest).
- `curriculum`: built-in, decodable, original units, and the starting point.
- `rewards`: garden, celebration, no negatives.

### Modified Capabilities
- `child-ux`: adds spoken prompts, no reading dependency, one primary target, space use, progress path, guide character, fading hearts, holds and celebration.
- `grown-ups`: tap-only gate, progress view, picker, practise one game, backup, restore, reset; typing removed.
- `storage`: schema 2, migration from schema 1, storage-full handling.
- `privacy`: backups hold progress only and stay out of the repo.
- `lessons`: removed, replaced by `daily-session`.

## Impact

- **New code:**
  - `js/progress.js` (scheduler), `js/session.js` (runner), `js/guide.js` (character) and
    `js/garden.js`;
  - `js/steps/*.js` (sounds-words, tricky, read-with-me, maths-croc);
  - `data/units/*.js` (first units);
  - `tools/prototype.html` (dev-only).
- **Rewritten:** `js/ui.js` (home), `js/store.js` (schema 2), `js/lessons/grownups.js`, `css/app.css`.
- **Removed:** the Together / My turn code in `js/lessons/story.js`, `data/default-week.js`, the typing
  UI, and the heart-letter editor.
- **Tests:** session flow, scheduler maths, migration, backup and restore, DOM rules (one primary
  target, no mode switch, sizes).
- **Docs:** README ("Each week" goes away), SECURITY (backups), CLAUDE.md (roadmap, state, layout).
- **Tablet try (owner, with her):** one full session. The target is at most 2 "what do I do?"
  moments and 10 ± 2 minutes.
