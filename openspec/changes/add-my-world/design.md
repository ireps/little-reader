# Design

## Context

8b gave the app a shared shape for skill-like tasks:
- a generator returns `{ prompt, show, opts, answer, right, key }`;
- `LR.steps.math` draws it;
- `P.chain()` unlocks skills in order and keeps practised skills open;
- the runner records a box for items that carry a skill id (`g`).

The emoji allowed are limited to Unicode 6 (the tablet runs Android 5.1). That rules out, for example, the diya, kite, fox, carrot and the doctor emoji.

## Goals / Non-Goals

**Goals:**
- EVS as one more guided step, built entirely from the existing patterns.
- Teaching order, with practised topics staying open.
- No reading needed: the question is spoken and the answers are pictures.

**Non-Goals:**
- Festivals as a topic. They're covered in 8a's stories, and the emoji for them (diya, kite) are newer than Unicode 6.
- Writing, drawing and maps.
- A subject menu for her. The owner chose to keep it guided.

## Decisions

**1. `LR.world` in `js/world.js`.** It's data plus one generator.
- `TOPICS` lists `{ id, name }` in teaching order, with `OPEN = 2`.
- Each topic has a bank of questions. A question is `{ q: spoken question, yes: 'Yes! {w} …', a: [right items], d: [wrong items] }`, and items are `[emoji, 'a fish']`.
- `gen({ e, seed })` picks a question, one right item and 2 wrong items, and returns the shared shape. Option labels are the item names. The answer is said in the reveal, through `right` without "Yes!".
- Items are `{ t:'world', e, seed }`. `LR.steps.world` is the same object as `LR.steps.math`, which picks `LR.world.gen` for `t:'world'`.
- *Alternative considered:* a separate screen. Rejected: the choice screen already has every rule (100 ms feedback, errorless reveal, re-prompts).

**2. Recording.** `ctx.done` already records `g:` for `item.g`. That generalises to an id prefix: `item.e` records `e:`. `P.worldUnlocked()` is `chain(LR.world.ids, 'e:', OPEN)`.

**3. The step.** `plan()` adds `world` after `maths`, for day mode and for `only === 'world'`. It holds 2 items from the least recently practised open topics, chosen the same way as the language items. The path gets `{ id:'world', icon:'globe', label:'My world' }`. `STEP_IDS` includes `world`, and `cleanResume` keeps up to 7 steps.

**4. Teaching order of topics:** body parts, senses, family, fruit and vegetables, healthy food, plants, pet and wild animals, where animals live, animal sounds, baby animals, insects and birds, transport (land/water/air), helpers, weather and seasons, day and night, safety. This follows the usual UKG EVS sequence: Myself → My family → Food → Plants → Animals → Transport → Helpers → Seasons → Sky → Safety. Body parts come before senses because senses build on them.

**5. Items avoid ambiguity.**
- Fruit vs vegetable leaves out the tomato.
- "Pet or wild" uses clear cases.
- Helper questions ask about the vehicle or tool (fire engine, ambulance, police car).
- Safety uses an SVG traffic light for stop and go, and "Which one is hot? Don't touch it" uses fire.
- The test checks that no right item is also among the wrong items of the same question.

## Risks / Trade-offs

- **[Session length]** → 2 quick picture questions take about 30 s. The 12-minute budget still trims steps.
- **[Emoji look different on the tablet]** → Unicode 6 emoji are drawn by Android 5.1's font. The owner's Phase 5 check confirms that they show.
- **[Questions on animal sounds use speech, not recordings]** → The voice says "Which animal says moo?". No recordings of animals or people, in line with the project's rule.

## Migration Plan

- No stored-shape change. `e:` items appear as she practises.
- Resumed plans from before this change have 6 steps and still validate.
- Rollback: revert. Unknown `e:` items are ignored.
