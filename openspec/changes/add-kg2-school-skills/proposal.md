# Proposal

## Why

Phase 8b, the second of the three content phases the owner approved after the syllabus audit. 8a deepened reading. 8b covers the school English grammar and maths topics the app doesn't teach yet, so she meets her UKG syllabus at home as well as at school.

**English, from Indian UKG syllabi:**
- naming, doing and describing words;
- opposites;
- *this/these*, *is/are*, *he/she/they*;
- putting words in order to make a sentence, and matching a sentence to a picture;
- vowels, letter order, and matching capital and small letters.

**Maths, from NCF-FS Balvatika outcomes IL 3.5 to 3.29 and school syllabi:**
- number names past 20;
- counting in 5s;
- ordering numbers;
- longest/shortest of three, and capacity;
- 3D shapes;
- sorting and the odd one out;
- reading a simple picture of data;
- o'clock;
- size words (tall/short, thick/thin, top/bottom).

**A bug to fix as well:** the daily language task rotates by `days.length % 5`, but `days` keeps only 30 days, so after a month she would get the same task every day.

## What Changes

- **Language skills work like the maths skills.** Each language task is a skill with a box (`g:<skill>` items). The 5 existing tasks (rhyme, *a/an*, plural, in/on/under, capitals) stay open. 12 new skills unlock one at a time, in school order, as each reaches box 2. Each session has **2 language items**, least recently practised first. This replaces the day-count rotation.
- **12 new language skills,** all tap-only and spoken:
  - capital to small letter;
  - which letter comes next;
  - find the vowel;
  - naming words, doing words and describing words;
  - opposites;
  - *this* or *these*;
  - *is* or *are*;
  - *he*, *she* or *they*;
  - word order (tap word tiles in order to build a sentence);
  - which picture matches a sentence.
- **8 new maths skills,** appended to the unlock order:
  - counting in 2s, 5s and 10s;
  - smallest and biggest of three numbers;
  - size words (taller, thicker, on top);
  - longest of three, and which holds the most;
  - 3D shapes (ball, box, tin, cone);
  - the odd one out (by colour, then by shape);
  - "Are there more pink or blue?";
  - o'clock (then half past at level 2).
- **Number names** level 2 goes up to fifty (it was twenty).
- **Voice clips** for every new prompt and answer, made with the Neerja tools.

## Capabilities

### New Capabilities

None. The new skills belong to the existing English and maths capabilities.

### Modified Capabilities

- `english-kg2`:
  - Language tasks become unlockable skills with boxes, 2 a session.
  - The 12 new skills are added.
- `maths-kg2`:
  - Skill order grows by 8 skills.
  - Number names go up to fifty.
  - Requirements are added for each new skill.

## Impact

- **Code:**
  - A new `js/grammar.js` (`LR.grammar`: skills in unlock order and seeded generators, like `LR.maths`).
  - `js/steps/math.js` draws grammar questions too.
  - A new `js/steps/order.js` for word-order tiles.
  - `js/maths.js` gets the 8 new skills and number names to 50.
  - `js/progress.js` gets the unlock rules for language skills.
  - `js/session.js` gets the language items, and results are recorded per skill.
  - `css/app.css` gets the new pictures (solids, clock, size bars).
- **Storage:** `g:` ids already pass the item id check. No new fields and no schema bump.
- **Voice:** `tools/list-clips.js` lists the grammar generators' prompts. New clips come from Neerja.
- **Tests:**
  - every new skill, right and wrong;
  - unlock order and 2 language items a session;
  - the rotation keeps working after 30 days;
  - ranges.
- **Docs:** the README activity tables and the CLAUDE.md layout and roadmap.
- **On the tablet before 8c:** a week of sessions. Note which new tasks needed explaining, whether word order is easy to use, and whether sessions stay around 10 minutes.
