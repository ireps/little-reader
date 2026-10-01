# Design: KG-2 English

## Context

After Phase 4, the session runner, scheduler, child UX system and Read with me exist. Activities
plug in as `LR.steps.<id>`. All the Phase 3 and 4 rules still hold: one primary target, try-first,
at most 6 spoken words per prompt, 120 px targets, instant feedback.

## Goals / Non-Goals

**Goals:**
- Cover the KG-2 English reading outcomes with activities she can do alone.
- Guarantee every sentence is decodable for its unit.

**Non-Goals:**
- Letter tracing and handwriting (Later: `add-letter-tracing`).
- Spelling tests; this stays an open question in CLAUDE.md.
- Speaking or recording her voice (never).

## Decisions

### D1. Grapheme table (`LR.words.GRAPHEMES`)
- An ordered list of `{ g: 'sh', phase: 3, unit: 'p3-r1', sound: 'sh', example: 'ship' }`.
- A word's grapheme split comes from a greedy longest-match over the taught graphemes, with an
  exceptions map for words like *the* (tricky) and split digraphs (`a_e` in *cake*, marked in data
  as `c|a_e|k`).
- *ow* has two entries, `ow1` (snow) and `ow2` (cow). The two families are taught side by side in
  Picture match and sorting.

### D2. Unit file format (`data/units.js`: Phase 3 review and Phase 4; `data/units-p5.js`: Phase 5)
```
LR.units.push({ id:'p4-02', phase:4, theme:'animals', graphemes:['st','nd'], tricky:['said'],
  words:['stop','hand','nest', ...8-12], pictures:{ nest:'🐦' ...},
  stories:[ { id:'p4-02a', title:'The frog', s:['The frog can jump.', ...4-6] }, {...} ],
  silly:[ { s:'A dog can sing.', ok:false }, ...8 ],
  questions:{ 'p4-02a':[ { q:'Who can jump?', a:'frog', opts:['frog','hen','cat'] } ] } });
```

### D3. Decodability test (`tests/decodable.js`, called from `tests/run.js`)
- For each unit, the allowed set is the Phase 2-3 graphemes, the Phase 5 graphemes of this and earlier
  units, the Phase 2-3 tricky words, her known words, and the tricky words of this and earlier units,
  plus a small list of names.
- Each word is first split the way it is really read (all graphemes, longest first; a split digraph
  needs exactly one consonant before the final e). Every part must be allowed. A known tricky word
  is never "decodable" by its letters: it must have been taught.
- Checked: `words`, story sentences, `silly`, and question answer choices. The questions themselves are
  spoken, so they are exempt. The check lives in `LR.words.checkUnits()` and runs in `npm test`.
- A failure names the unit, sentence and word.

### D4. Activities
- **Flash:** the word shows for 2 s (a timed class swap, not an animation), then a "?" card; there
  are 3 look-alike cards, and nothing is spoken until she answers.
- **Picture match:** the word card sits at the top with sound buttons, and 3 pictures sit below
  whose words share a grapheme.
- **Build it:**
  - she hears the word, then taps tiles that fill the slots left to right, so there is no dragging;
  - a digraph is one tile ("sh"), and a split digraph is one tile ("a–e");
  - there are 2 decoys, never a letter of a split digraph;
  - a wrong tile stays in the tray with a brief dim state and a soft tone;
  - the errorless finish comes after 2 wrong tiles;
  - tricky words aren't built (they use Find it or Flash).
- **Silly sentences:** she reads the sentence and taps 👍 or 👎 (SVG, not emoji); then it plays and
  the right answer is shown.
- **Rhyme:** she hears 1 word and picks the rhyming picture from 3.
- **Capitals:** she taps the letter that should be a capital (sentence start, a name).
- **a/an:** she picks a or an for a picture word.
- **Plurals:** she picks the picture for "cats" or "cat".
- **in/on/under:** SVG scenes (a box and a ball), and she picks the one that matches the phrase she
  reads.
- **Story questions:** after the last sentence, 1 or 2 who/what questions with picture answers.

### D5. Help ladder
- The first tap lights the word's hearts and plays a hint: "Like *some*", taken from a mastered word
  in the same family or rhyme.
- With no such word, it speaks the first grapheme's sound ("sh"), then the word, on the same tap.
- The second tap plays the word. Either tap marks a miss.

### D6. Step mix
- Sounds and words draws its items from Find it, Flash, Picture match and Build it, weighted by the
  item's box: box 0 to 1 favours Build it and Picture match (mapping), and box 2+ favours Flash
  (fluency).
- Silly sentences uses 3 items per session.
- The rhyme, capitals, a/an, plural and position tasks rotate as one "language" item a day, at the end
  of Sounds and words.
- **Pictures:** emoji from Unicode 6.0/6.1 only (Android 5.1's font), with a code-point check in the
  tests. A word without a picture never appears in a picture task, so no SVG pictures are needed yet.
- **Silly-sentence accuracy** is kept per unit in `state.silly` (`{ unit: [answered, right] }`). A unit
  opens the next one at 5+ answers and 80%+ right, as well as all its words mastered.

## Risks / Trade-offs

- **Content volume** (about 30 units, 60 stories). A cheaper model drafts to the template and the
  planner reviews. The decodability test catches most errors automatically.
- **Emoji pictures on an old font** may not match. Each unit's pictures are checked on the tablet in
  the Try group, and inline SVG replaces any that fail.
