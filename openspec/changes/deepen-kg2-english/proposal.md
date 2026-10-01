# Proposal

## Why

Phase 8a, the first of three content phases (8a English, 8b school grammar and maths gaps, 8c "My world"/EVS), which the owner approved after a syllabus audit against the NCF-FS Balvatika outcomes and typical Indian UKG syllabi.

The course is thin where her problems are:
- **Few stories.** Each unit has 2 stories, and a unit lasts 1 to 2 weeks (every word must be right first time on 3 separate days), so each story is reread 4 to 7 times. Repeated reading helps fluency, but the gains level off after 3 or 4 readings (Therrien 2004). The volume of decodable reading matters too (Cheatham & Allor 2012).
- **One question per story,** always "who" or "what". NCF-FS asks a 5 to 6 year old to say what happened first and next in a story (IL 3.7) and to answer questions about stories (ECL2-5.4).
- **Tricky words.** Her worst problem is tricky words, yet *the, to, I, no, go, into, me, be, are* (Letters and Sounds Phases 2 and 3) are assumed known and never come back for review.
- **First-letter guessing** (*pots* read as *plants*). Find it uses distractors that share the first letter, but they are chosen at random from a general bank, not built around the words she is learning.
- **The course stops at Phase 5** (`p5-12`). After that, sessions are review only, with no next step for the rest of KG-2.

## What Changes

- **4 stories per unit instead of 2:** 42 new original stories, Indian settings, decodable for their unit and checked by `npm test`. New themes: family, home, school, festivals, seasons and safety.
- **3 questions per story instead of 1:** who, where or what, plus "What happened first?". Answers are words or short phrases she reads, with a picture where there is one. A session still asks 2, rotating so that rereads bring different questions.
- **Tricky-word review:** *the, to, I, no, go, into, me, be, are* go into spaced review from the start, like her known words, so they are checked and drop out once mastered.
- **Same-start sets:** each unit lists words that start the same but end differently (*pots / plants / plums*, *grow / green / grin*). Find it and Flash use them as distractors before the general bank.
- **6 new units after `p5-12`:** 2 mixed review units, then early Phase 6 suffixes: *-s/-es*, *-ing*, *-ed* (three sounds) and *-er/-est*, on roots that don't change spelling. The decodability check learns these suffixes.
- **Voice clips** for all the new text, made with the existing Neerja tools.
- Housekeeping: remove the duplicated comment in `js/progress.js`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `curriculum`:
  - Unit size: 4 stories, each with 3 questions, and a same-start set per unit.
  - Themes: the new themes are added.
  - Starting point: the base tricky words go into review.
  - Full sequence: mixed review units and Phase 6 suffix units after Phase 5.
  - Decodable guarantee: suffixes are covered.
- `english-kg2`:
  - Find it and Flash use the unit's same-start set first.
  - Sequence: Phase 6 suffix units come after Phase 5.
- `read-with-me`:
  - Story questions: 3 per story, including "What happened first?", 2 asked per session, rotating.

## Impact

- **Content:** `data/units.js`, `data/units-p5.js` and a new `data/units-p6.js`. A new script tag goes in `index.html` (`?v=` bumped).
- **Code:**
  - `js/words.js`: the suffix-aware `decodable()` and same-start sets in `lookalikes()`.
  - `js/progress.js`: the base tricky words go into review, and question rotation.
  - `js/session.js`: picking which 2 questions to ask.
  - `js/steps/q.js`: "What happened first?" with phrase answers.
- **Storage:** no new state fields. Review uses the existing `items`, and question rotation uses `stories`. No schema bump.
- **Voice:** `tools/clip-list.txt` grows by roughly 500 lines. `make-clips-neerja.py` makes only the missing clips, then `import-clips.js` runs.
- **Tests:** `tests/run.js` gets checks for unit counts, decodability with suffixes, same-start distractors, question rotation and base tricky-word review.
- **Docs:** CLAUDE.md gets the roadmap rows for 8a, 8b and 8c and the layout line for `units-p6.js`. README gets the course description.
- **On the tablet before 8b:** a week of sessions. Note whether she meets new stories, whether "What happened first?" needs explaining, whether same-start words still catch her (Grown-ups shows mix-ups), and whether sessions stay around 10 minutes.
