# Proposal

## Why

Phase 8c is the last of the three content phases the owner approved after the syllabus audit. The app covers literacy and numeracy, but not the third part of the KG-2 syllabus: knowing the world around her.

That part is EVS, or General Awareness, in Indian UKG syllabi, and NCF-FS Curricular Goal "involved learners", IL 3.1 to 3.8. Its topics are: myself (body parts, senses), family, food, plants, animals (pet and wild, where they live, sounds, young ones), birds and insects, transport, community helpers, weather and seasons, day and night, and safety.

The owner chose to keep the session guided: one Start and no subject choice for her. So "My world" becomes a step in the session.

## What Changes

- **A "My world" step** comes after Maths and before Garden, with **2 picture questions a day**. Each question is spoken, she taps one of 3 pictures, and there's nothing to read. A wrong answer dims, and after 2 misses the answer is shown and said. It works like every other choice screen.
- **16 EVS topics as skills** (`e:` items with boxes, like maths and language). They're in UKG teaching order, the first 2 are open, and each next one opens when the one before reaches box 2. A topic she has practised stays open. The 2 questions each day come from the least recently practised open topics.
- **Pictures** are emoji the tablet can draw (Unicode 6), plus an SVG traffic light.
- **Grown-ups > Practise one game** gains "My world".
- **Voice clips** for every question and answer.

## Capabilities

### New Capabilities

- `my-world`: the EVS picture questions, their topics in teaching order, and how they unlock.

### Modified Capabilities

- `daily-session`: Fixed step order gains My world, between Maths and Garden.

## Impact

- **Code:**
  - A new `js/world.js` (`LR.world`: topics, question banks and a generator in the shared question shape, drawn by `LR.steps.math`).
  - `js/progress.js` gets `worldUnlocked()`, reusing the chain.
  - `js/session.js` gets the new step, `e:` recording, and the practice route.
  - `js/kit.js` adds the step to the path, with a new globe icon in `js/icons.js`.
  - `js/store.js` gets the step id and item validation, and keeps 7 steps instead of 6.
- **Storage:** `e:` ids already pass the id check. No schema bump.
- **Session length:** about +30 s. The 12-minute budget still trims steps.
- **Tests:**
  - every topic's answers are unique, with exactly one right;
  - the emoji are Unicode 6;
  - the step order and unlock order;
  - a right and a wrong answer;
  - practice.
- **Docs:** README and CLAUDE.md.
- **On the tablet:** a week of sessions. Note which topics need explaining, and whether the session still feels about 10 minutes.
