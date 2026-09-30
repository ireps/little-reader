# Proposal: KG-2 maths (Phase 6)

## Why

Until now the Maths step runs only the Hungry crocodile rounds (comparing 0 to 10). Oxford Advantage
follows NCF-FS 2022, and the KG-2 numeracy outcomes (IL 3.x / ILM 4.x) cover much more: counting,
numerals to 99, before, after and between, zero, comparing, adding and taking away, Indian money,
measurement, shapes, patterns, and days and months. She still mixes up < and >, which remains the
first maths skill to fix.

## What Changes

- **Maths skills**, generated fresh each time within ranges, spaced like words, and unlocked in
  order.
- **Representations:** dots, ten-frames, a number line, SVG Indian coins and notes, SVG shapes, and
  simple measurement scenes.
- **The crocodile gains =.** A Grown-ups switch, "Equals sign", defaults to off, because it isn't
  known yet whether her class teaches =. That stays an open question in CLAUDE.md.
- **4 to 5 maths items per session.**
- **Grown-ups progress** shows the maths skills.

## Capabilities

### New Capabilities
- `maths-kg2`: every numeracy skill, its range and representations, generation rules and skill order.

### Modified Capabilities
- `grown-ups`: adds the maths progress rows and the Equals sign switch.

## Impact

- **Code:** `js/steps/maths.js` (runner and generators), `js/maths/*.js` (one file per skill family)
  and `js/svg/money.js`, `shapes.js`, `frames.js`. The Phase 4 croc step is replaced.
- **Tests:** generator ranges, no immediate repeats, a right and a wrong scenario per skill,
  screenshots.
- **Docs:** README (maths) and CLAUDE.md (roadmap; the "= taught?" question becomes a setting).
- **Tablet try (owner, with her):** a week of sessions. Is the maths level right?
