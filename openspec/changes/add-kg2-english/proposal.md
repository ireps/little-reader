# Proposal: KG-2 English (Phase 5)

## Why

Phase 4 gives her a guided session, but only with tricky words and Find it. That is enough to break
first-letter guessing, and no more. "Everything a KG-2 child needs" in English also means:

- decoding with Phase 4 and 5 graphemes, the Letters and Sounds order that Oxford's phonics follows;
- reading for meaning;
- rhyme, capitals, a/an, plurals and position words, the typical UKG syllabus and NCF-FS
  language outcomes.

This change also absorbs CLAUDE.md's planned "sound patterns" lesson (ow, oi, or, ee, ai, oa, ou,
ar, sh, ch, th).

## What Changes

- **Full sequence:** Phase 3 graphemes (review), then Phase 4 adjacent consonants, then Phase 5
  graphemes including split digraphs, with about 30 units in all.
- **New activities**, all fitted into the existing steps:
  - **Flash:** read a word shown for 2 s, then pick it from 3.
  - **Picture match:** read a word and pick its picture.
  - **Build it:** hear a word and build it from tiles, where a digraph is one tile.
  - **Silly sentences:** read and give a thumbs up or down.
  - **Rhyme; capitals; a/an; plural -s; in/on/under.**
  - **Story questions:** after Read with me.
- **Help ladder:** the first tap on a word gives a hint (hearts lit plus a known family or rhyme
  word), and the second tap gives the word.
- **Sound buttons** (Oxford-style dots and dashes) under graphemes in Picture match and Build it.
- **Story rotation:** 2 stories per unit, and the least recently read one comes first.
- **A decodability test** that fails on any word not yet taught.
- **Content drafting:** the unit engine and units p3-review to p4-06 are written by the planning
  model. A cheaper model drafts the rest to a strict template, and the planner reviews them (the
  CLAUDE.md model preference). The owner skims them and types nothing.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `english-kg2`: adds sequence, Flash, Picture match, Build it, sound buttons, help ladder, Silly sentences, rhyme, capitals, a/an, plurals, position words and story questions.
- `curriculum`: adds the unit size, themes and the full Phase 3 to 5 sequence.
- `read-with-me`: adds story rotation and story questions.

(These capabilities are created by Phase 4. If Phase 4 is archived first, the deltas apply to the
main specs as ADDED requirements.)

## Impact

- **Code:** `js/steps/*.js` (new activity renderers), `js/words.js` (grapheme table, families,
  rhymes), `data/units/*.js` (about 30 units) and `data/pictures.js`.
- **Clips:** the Phase 3 clip tool is re-run for the new words and sentences. The coverage test
  enforces it.
- **Tests:** decodability, unit counts, each activity's right and wrong scenarios, a Build it digraph
  tile, the help ladder.
- **Docs:** README (activities, content licence) and CLAUDE.md (roadmap).
- **Tablet try (owner, with her):** a week of sessions. Are the new activities understood with no
  help?
