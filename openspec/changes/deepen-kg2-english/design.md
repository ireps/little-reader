# Design

## Context

- The course is plain data. `data/units.js` holds the Phase 3 review units, Phase 4 units, `LR.startUnit` and `LR.knownTricky`. `data/units-p5.js` holds Phase 5.
- Each unit is `{ id, phase, theme, title, sounds, words, tricky, stories: [{ id, title, s, q: [{ q, a, opts }] }], silly }`.
- `LR.words.checkUnits()` checks every word she reads against `allowedFor(i)`: Phase 2 and 3 graphemes (`BASE`), the Phase 5 graphemes taught so far, `TRICKY_BASE`, story names and the unit tricky words so far. `npm test` fails on any problem.
- `TRICKY_BASE` already allows *the, to, I, no, go, into, me, be, are* in text, but only `LR.knownTricky` is put into review, by `seedKnown()` in `js/store.js` on a fresh or empty state.
- Find it and Flash call `W.lookalikes(target, pool, mixups, 2)`. It takes her mix-ups first, then scores the unit pool plus `BANK` by first letter, first two letters, length and last letter, with random jitter.
- `P.nextStory()` already picks the least recently read story from `LR.state.stories`. `plan()` adds up to 2 `q` items (`story.q.slice(0, 2)`).
- `tools/list-clips.js` reads the data files to build `tools/clip-list.txt`. `npm test` fails if the list is stale or if anything said can't be played from it.

## Goals / Non-Goals

**Goals:**
- More reading and better questions with no new screens: the existing Read with me and question steps carry the new content.
- No new state fields and no schema bump.
- Keep the checker strict: every new word is machine-checked, including suffixed words.

**Non-Goals:**
- Suffixes that change the root's spelling (doubling: *hopping*; dropping e: *making*; y to i: *happier*). They're Year 1 work and need a spelling-rule check.
- New activity types (8b) and EVS sorting (8c).
- Changing how many steps a session has, or the 10-minute target.

## Decisions

**1. Content files.** Phase 6 and the mixed review units go in a new `data/units-p6.js`, loaded after `units-p5.js` in `index.html` and `tools/list-clips.js`. The new stories for existing units go into their own unit objects in `units.js` and `units-p5.js`, so each unit stays readable in one place.
- *Alternative considered:* one big file of extra stories keyed by unit id. Rejected, because it splits a unit across two files and makes the decodability errors harder to trace.

**2. Story shape.** Each story gains `theme` (from the extended list) and its `q` grows to 3 entries. A "What happened first?" entry is `{ q: 'What happened first?', a: '<phrase>', opts: ['<phrase>', …], first: true }`. Its phrases are short (2 to 5 words), taken from the story's own events, and decodable for the unit. `first` lets `q.js` lay the phrases out as wide cards in a column, not word tiles. The existing answer logic (`LR.choice`) is unchanged. The caption shows the question only, never the options (`say(q, { caption })` as today).
- *Alternative considered:* a drag-to-order sequencing task. Rejected for now: dragging is hard for her, and NCF IL 3.7 is met by "what happened first", which needs only one tap.

**3. Question pairs by date.** `plan()` asks `q[k]` and `q[(k + 1) % 3]`, where `k = daysSince2000(today) % 3`. Dates are local `YYYY-MM-DD`, as in `LR.progress`. With 4 stories taking turns, a story is usually reread 4 days later, so its next reading starts on the next pair.
- *Alternatives considered:* store a per-story question offset (needs a new state field and a schema bump), or use `days.length` (capped at 30, so it would freeze after a month).

**4. Base tricky words in review.** Add `LR.baseReview = ['the','to','i','no','go','into','me','be','are']` in `data/units.js`. `seedKnown()` seeds `LR.knownTricky` and `LR.baseReview` at box 1. It already skips words that exist. `load()` calls it on every start, not only on a fresh state, so existing installs get the 9 words once and nothing else changes. The heart letters already exist in `HEARTS` for all 9 (*I* has none, being a single letter, so it shows plainly).
- *Alternative considered:* teach them as unit tricky words with the New tricky word step. Rejected: she has met them since Phase 2. Review checks them cheaply, and they drop out after 3 first-time-right days.

**5. Same-start sets.** Each unit gains `near: [['plants','plums','pots'], …]`, at least 3 groups of 3 or more decodable words. `lookalikes()` gets an optional `near` argument. After mix-ups, it takes the other words of the group containing the target (shuffled). If the target isn't in any group, it takes words from any group sharing the target's first two letters, then falls back to today's scoring. Find it and Flash pass `P.unit().near`. Group words that are in no unit word list are still checked for decodability, because she reads them as cards.
- *Alternative considered:* tune the scoring weights in `lookalikes()`. Rejected: random scoring can't guarantee the pairs she actually confuses (*pots/plants*). A curated set can.

**6. Suffixes in the checker.** Add `SUFFIX = { s: unit, es: unit, ing: unit, ed: unit, er: unit, est: unit }`, built from a new unit field `suffixes: ['ing']`. `decodable(w)` first tries the word as it is. If that fails, for each suffix taught so far (longest first) whose root is still 2 or more letters, it checks the root. A plain `-s` on a decodable root is already decodable letter by letter (*cats*), so the check only matters for *-es*, *-ing*, *-ed*, *-er* and *-est*. To stop these passing early, `allowedFor()` treats any word ending in those suffixes, whose root is decodable but whose suffix isn't taught yet, as not decodable. This is a small list check, not a grammar.
- `-ed` is one unit whose words cover all three sounds: t (*jumped*), d (*filled*) and id (*landed*). The clips say them correctly.
- `-er` already exists as a Phase 3 grapheme (*letter*). It counts as a suffix only when the root is a word (*taller*). Before the -er/-est unit, words like *faster* fail as intended.

**7. Mixed review units.** `p5-r1` and `p5-r2` reuse graphemes from across Phases 4 and 5. Their words are chosen from her likely trouble spots: adjacent consonants plus a Phase 5 grapheme, such as *spray*, *street*, *crown*. They have no new `sounds` and 1 tricky word each, from Letters and Sounds Phase 5 or the Year 1 common exception words not yet taught (*our*, *once*, *friend*, *school*, *put*, *push*, *pull*, *full*, *house*). `HEARTS` and `FAMILIES` are extended for any new tricky words.

**8. Units from p5-r1 to p6-04 get the same counts as all others** (10 words, 4 stories, 8 silly sentences), so the count test stays uniform. Unit advancement is unchanged.

**9. Voice clips.** After the content is written: `node tools/list-clips.js` (the list grows by roughly 500 lines), then `.venv/Scripts/python tools/make-clips-neerja.py` (only the missing clips), then `node tools/import-clips.js`. The importer aligns the word times and trims the end silence. The clips are committed with the content.

## Risks / Trade-offs

- **[Writing 54+ decodable stories is error-prone]** → `checkUnits()` names every failing word. Stories are written unit by unit, with `npm test` after each file.
- **[Phrase answers are longer to read than single words]** → Keep them to 2 to 5 decodable words from the story she has just read. The question is spoken, and the help ladder works on answer words as elsewhere.
- **[9 more review words make early sessions longer]** → They enter at box 1, mixed into normal review under the existing "mostly known" pacing. Most should master within the first week, and review then thins out.
- **[A same-start group can make an item too hard]** → The group's words must all be decodable for the unit. Errorless finish (after the second miss) still applies.
- **[The suffix rule could pass a word that isn't really root plus suffix]** (*bed* as b + ed) → The root must be 2 or more letters and itself decodable, and suffixes only apply from their unit on. Phase 6 unit word lists are reviewed by hand.
- **[More clips mean a larger download]** → About 500 clips at about 8 KB each is about 4 MB more. That's acceptable, since the clips load as they're needed.

## Migration Plan

- Existing progress keeps working: unit ids are unchanged, and new units are appended after `p5-12`. A child who had finished `p5-12` (review only) moves on to `p5-r1` once `p5-12` is done.
- The base tricky words are added once on load (Decision 4).
- Rollback: revert the PR. The extra review items are ordinary `items` entries that the older code also understands.
