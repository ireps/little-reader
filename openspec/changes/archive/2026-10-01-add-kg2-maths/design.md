# Design: KG-2 maths

## Context

After Phase 4, the Maths step exists and runs croc rounds. The scheduler handles `m:<skill>`
items. Pictures must be inline SVG or Unicode 8 emoji, and all the child UX rules apply.

## Goals / Non-Goals

**Goals:**
- Cover the NCF-FS KG-2 numeracy outcomes, each with a representation she can tap.

**Non-Goals:**
- Writing numerals (Later: `add-letter-tracing`).
- Timed drills.

## Decisions

### D1. Skills and order (`LR.maths.SKILLS`)

Each skill has an id, a range that grows (level 1, then level 2) and a representation:

| # | Skill | Level 1 | Level 2 | NCF-FS |
| --- | --- | --- | --- | --- |
| 1 | Compare (croc < >) | 0–10, dots | 0–20, numerals | IL 3.13 / ILM 4.13 |
| 2 | Count objects | to 10 | to 20 | IL 3.9 / ILM 4.9 |
| 3 | Numeral ↔ quantity | to 9 | to 99, tens and ones | IL 3.11 / ILM 4.11 |
| 4 | Count on / back | from any n to 9 | to 20; in 2s and 10s | IL 3.10 / ILM 4.10 |
| 5 | Before / after / between | to 20 | to 100 | ILM 4.11 |
| 6 | Zero | none left | | IL 3.12 / ILM 4.12 |
| 7 | Add by combining | to 9 | facts to 18 | IL 3.14 / ILM 4.14 |
| 8 | Take away | within 9 | | IL 3.15 / ILM 4.15 |
| 9 | Number names | one–ten | eleven–twenty | IL 3.11 |
| 10 | Money: coins and notes | ₹1, 2, 5, 10 | amounts to ₹20 | IL 3.20 / ILM 4.20 |
| 11 | Measure | long/short, heavy/light | full/empty, hot/cold | IL 3.21–3.23 / ILM 4.24 |
| 12 | Shapes | circle, square, triangle, rectangle | faces of 3-D shapes | IL 3.25 |
| 13 | Halves | a half of a shape | | IL 3.26 |
| 14 | Patterns | AB | ABB, ABC | IL 3.27 |
| 15 | Days and months; time of day | days | months; morning / afternoon / night | IL 3.29 |

### D2. How skills unlock and level up
- A skill unlocks when the previous skill reaches box 2. Comparing is always open, since < and > are
  her known difficulty.
- Level 2 starts when the skill reaches box 3. The level is read from the box, so it isn't stored.
- The = variant of Compare is enabled by the Grown-ups switch. Rounds may then offer <, = and >, and
  about 1 in 4 uses equal amounts. With the switch off, equal amounts never appear.
- **State:** adds `equals: false` (boolean) to schema 2, checked in `validate()`. A missing field
  defaults, so no schema bump is needed.
- **Plan items:** a maths item is `{ t: 'math', s: skill, lv, seed }`. The question is regenerated
  from the seed (mulberry32), so a resumed session shows the same question and validation is simple.
  Comparing keeps its own `{ t: 'croc', a, b, m: 'more'|'mouth'|'eq', lv }`.

### D3. Generators
- `gen(skill, level, rnd)` returns `{ prompt, rep, options, answer }`.
- Options are always 3 (or 2 for < >, and 3 with =).
- The same numbers are never repeated in consecutive items of one skill.
- Distractors are near misses (±1, a reversed digit order for 2-digit numbers).

### D4. Representations
- **Dots:** always in dice or ten-frame layout, never scattered, for subitising.
- **Number line:** 0–20, with a highlighted hop.
- **Money:** simplified SVG coins and notes with the value numeral and ₹. They are not replicas.
- **Shapes and scenes:** inline SVG with `currentColor` fills and no inline styles.

### D5. Wrong answers
- After 2 misses (or 1, with only 2 choices), the right answer is shown. Where there is something to
  count (ten-frame dots, things to add, things left), each one lights in time with the spoken numbers,
  using the Phase 3 timing engine. Otherwise the answer is said. There is no red and no cross.
- Shapes level 2 asks for a property (no corners, 3 sides, 4 equal sides) rather than the faces of
  3-D shapes, which are hard to draw clearly at this size.
- Money uses the ₹ sign. Andika's Latin subset lacks it, so it comes from the tablet's own font; check
  it on the tablet.

## Risks / Trade-offs

- **Level jumps may be too steep.** The ranges live in one table and Grown-ups' "Where is she?" can
  step a skill back.
- **Money images:** simplified, clearly not currency replicas.
