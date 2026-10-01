# Proposal

## Why

Phases 3 to 8c each added screens with their own versions of the same few elements. A review of all 118 screens at the tablet's size (1280x614, then 800x1094) found the drift. It matters for a 6-year-old who learns the app by its look and not by reading:

- **Sun yellow** is meant to mark only the one thing to tap (Start, the check, Go on, Done). But the current step on the path was the same yellow with the same thick outline, on every screen, including the choice screens that should have no target at all. This broke the "One primary target" requirement. The number line's "?" and the word being spoken in Read with me were solid yellow too.
- **The replay button** was below the answers on most screens, at the end of the tile row in Build it and Word order, and beside the mouths for the crocodile.
- **Answer cards** came in six minimum sizes (170 to 250 px wide, 126 to 170 px tall).
- **Words to read** were in Andika Regular in stories and Find it, but in bold in the language and maths cards, and some shared one bold sentence style.
- **The missing piece** was drawn four ways: an underline, a yellow dot, a dashed box, and a big green "?".
- **Flat and raised were mixed.** Words she only reads (the big word, the crocodile's numbers when she picks a mouth) had the thick bottom edge that answer cards use to say "tap me".

## What Changes

One design language for every child screen:

- **Sun yellow belongs to the one target.** The current path step is leaf green. A spoken word gets the same soft fill and sun underline as a lit letter.
- **Replay has one place:** under the guide's words (beside them in portrait), on every screen that has it.
- **One answer card:** 180 x 150 px minimum (140 px tall in short landscape), whatever is on it.
- **Reading text is Andika Regular** everywhere, including letters. Bold is for numbers.
- **Raised means tap, flat means read.** The big word, the crocodile's numbers when she picks a mouth, and a word or sentence in a question all sit flat on paper.
- **One missing-piece mark:** a dashed box with a "?". When she answers it fills in solid green, like a Build it slot.

No content, timing, speech or state changes.

## Capabilities

### Modified Capabilities

- `child-ux`: adds the consistent design language requirement.

## Impact

`css/app.css`, `js/kit.js` (`screen({ replay })`), `js/session.js` (`ctx.replay(on)`), the steps that showed replay, the gap markup in `js/maths.js`, `js/grammar.js` and `js/steps/lang.js`, and `tests/run.js`. On the tablet, the owner checks that she still finds the replay button and that the green path step doesn't draw her taps.
