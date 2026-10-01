# Design

## Context

- **Maths:** skills are `LR.maths.SKILLS` (id, name, NCF code), with seeded generators in `GEN`. Each generator returns `{ prompt, show, opts: [{ v, html, label }], answer, right, key }`.
- `LR.steps.math` draws any such question and records `m:<skill>` with `P.right` and `P.miss`. `P.mathsUnlocked()` opens skills in order, and `P.mathsLevel()` switches to level 2 at box 3.
- `tools/list-clips.js` runs every generator over 4000 seeds per level to list the clips.
- **Language tasks** (`js/steps/lang.js`: rhyme, an, plural, pos, caps) are planned one a day by `langItem()`, rotating on `LR.state.days.length % 5`. `days` is capped at 30, so the rotation freezes after a month. Their results aren't recorded anywhere.
- Item ids must match `^[a-z]{1,2}:[a-z0-9'-]{1,30}$`, so `g:<skill>` already validates.

## Goals / Non-Goals

**Goals:**
- One pattern for every skill-like task: a box per skill, unlocking in order, least recently practised first, level 2 at box 3.
- New tasks reuse the existing screens (`LR.steps.math` for single-choice questions, the tile pattern of Build it for word order), so they inherit the 100 ms feedback, the help-free errorless finish and the re-prompts.
- Every prompt and answer has a clip, through the same generator sweep.

**Non-Goals:**
- Writing, tracing and dragging.
- Grammar terms she has to read. Prompts are spoken: "Find the doing word".
- EVS sorting (8c).

## Decisions

**1. `LR.grammar`, shaped like `LR.maths`.** A new `js/grammar.js` holds `SKILLS` (id, name) and `gen(item)` for the 12 new language skills, using the same seeded RNG (`LR.maths.rng`). Its questions have the maths shape, so `LR.steps.math` draws them. That step now picks the generator and id prefix from the item: `item.t === 'gram'` uses `LR.grammar.gen` and `g:`. `LR.steps.gram` is an alias of the same object.
- *Alternative considered:* one step file per skill, like `lang.js`. Rejected: 12 near-identical files, and their clips couldn't be listed by a sweep.

**2. One language schedule.** `LR.grammar.ORDER` lists the 5 existing tasks, which are always open, followed by the 12 new ones, which unlock in turn.
- `P.langUnlocked()` returns the 5, plus the first new skill, plus each next one whose predecessor is at box 2.
- `plan()` takes the 2 open skills with the oldest `g:` due dates (never-practised first) and makes one item each. The existing kinds use today's builders (rhyme pair, a/an word, plural, position, a capitals sentence). The new kinds become `{ t:'gram', g, lv, seed }`.
- Every language item carries `g`. `ctx.done(firstTry)` then records `P.right('g:'+g)` (growing a flower when that makes it box 3) or `P.miss('g:'+g)`. Existing steps need no change.
- The session's Sounds and words step ends with these 2 items, instead of 1. *Session length:* about +20 s. The time budget (12 min) still trims steps if needed.

**3. Teaching order, not appended (owner's request).**

*Language* follows the UKG term order, for **all** 17 skills (the owner: "the order should be for the entire app"), including the 5 old ones. The first 2 (capital/small letters, vowels) are open at the start. A learner with sessions already done gets the old 5 seeded as practised (box 1, in `seedKnown()`), so nothing she had disappears.
- First term: letters (capital-small), vowels, alphabet order, naming words, he/she/they, this/these, is/are.
- Second term: doing words, describing words, opposites, word order, sentence-picture.

*Maths:* each new skill is inserted where schools teach it, not after the clock. The full order is: compare, count, **size, odd one out**, numerals, count on and back, **order**, before/after, zero, add, take away, names, money, measure, **longest**, shapes, **solids**, halves, patterns, **data**, **skip counting**, time, **clock**.
- Pre-number ideas (size words, sorting) come before numbers.
- Ordering numbers comes with sequencing.
- 3D shapes come after 2D shapes.
- Skip counting and o'clock come with time, in the second term.

*Unlocking an inserted skill:* skills unlock as a chain, and an inserted skill could block one she already uses. So a skill whose `m:`/`g:` item already exists stays open whatever comes before it (`chain()` in `js/progress.js`).

**4. Word banks are fixed and decodable from Phase 3 graphemes.**
- Naming words: cat, dog, hat, bus, sun, pen, cup, bed, fish, duck.
- Doing words: run, jump, sit, hop, dig, swim, sing, kick, clap, nap.
- Describing words: big, red, hot, wet, sad, thin, soft, fast, pink, long.
- Opposite pairs: hot/cold, up/down, on/off, long/short, thick/thin, soft/hard, top/bottom, open/shut, fast/slow, big/small.
- *this/these* and *is/are* use the plural word list (with pictures).
- Pronoun sentences come from a small built-in list about Raj, Meena and "Raj and Meena".
- Word order uses the current unit's sense sentences (`silly` with `ok: true`) of 3 to 5 words, so its words are decodable for her unit. If the unit has none, it uses a built-in short list.
- Sentence-picture uses a built-in list of (sentence, picture word) pairs whose pictures exist in `LR.pictures`.

These banks are tested as decodable at the starting unit (p4-01), or at their unit for word order.

**5. Word order screen** (`js/steps/order.js`): slots above and word tiles below, with the Build it pattern.
- A tap on the right next tile moves it to the slot.
- A wrong tile gets `feedback(el, 'wrong')` and stays.
- After 2 misses, the next tile places itself, so it ends errorlessly like Build it.
- When complete, the sentence turns green and is spoken.
- Tiles are at least 120 px tall and 60 px wide (word-tile rule).

**6. New maths skills** are appended to `LR.maths.SKILLS` (with NCF codes): skip (ILM 4.27), order (IL 3.6), size (IL 3.5), longest (IL 3.21 and 3.23), solids (IL 3.25), odd (IL 3.5), data (IL 3.28), clock (IL 3.29).
- Pictures are inline SVG: bars and trees for size, the existing `pencil()`, containers of 3 widths, solids drawn with simple shading, a clock face with hands, and the existing `bead()`.
- Number names: `NAMES` grows to fifty (*twenty-one* … *fifty*), and level 2 draws from 11 to 50.

**7. Clips.** `tools/list-clips.js` adds a sweep over `LR.grammar` (same as maths), the word banks, and the word-order sentences (whole sentence). New phrases go in `data/phrases.js` ("Find the doing word", "{w} is a doing word.", …).

## Risks / Trade-offs

- **[More language tasks thin out each one]** → Unlocking is gradual (one new skill at a time, at box 2). With 2 a day, and once unlocked, each skill comes back within about a week. That's the same pacing as maths.
- **[An existing learner gets 6 skills open at once]** → The 5 existing ones were already in rotation. Only the first new skill opens straight away.
- **[Is "describing word" too abstract at 5 to 6?]** → It's on the school syllabus, and spoken examples come with the answer ("Yes! red is a describing word."). The owner's tablet week will show if it needs explaining.
- **[Word order on 800 px portrait]** → Tiles wrap to 2 rows. The screenshots at both sizes decide the final tile size.

## Migration Plan

- There are no stored-shape changes. `g:` items appear as she practises.
- Existing users see the new skills unlock gradually.
- Rollback: revert. Unknown `g:` items are ignored by older code. Their flowers stay in `flowers`, which older code shows as flowers.
