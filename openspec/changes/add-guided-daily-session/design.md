# Design: Guided daily session

## Context

After Phase 3, speech is fast (joined utterances, highlights during speech, no waits), and feedback
layers, icons, Andika and 120 px targets exist. Speech still uses the tablet voice until Phase 7. This phase changes the flow and the data. All the Phase 3 rules still hold:
classic scripts, the `LR` global, CSP, `esc()`, `validate()`, `say()` / `stopAll()` / `gen`.

## Goals / Non-Goals

**Goals:**
- She can do a whole session with no one telling her what to tap.
- Nobody types anything, ever.
- The grown-up's only job is to listen during Read with me.

**Non-Goals:**
- Phase 5 activities (Flash, Picture match, Build it, Silly sentences content, help ladder).
- Full maths (Phase 6).
- Offline mode.

## Decisions

### D1. Design system
- **Tokens** (in `css/app.css` `:root`):

  | Token | Value |
  | --- | --- |
  | `--sun` (primary target) | `#FFC933`, 5 px outline `#5A3E00` |
  | `--leaf` (right) | `#3FA34D` |
  | `--mist` (dimmed) | `#BFC5CC` |
  | `--sky` | `#DDF1FF` |
  | `--soil` | `#7A5230` |
  | `--ink` | `#1E2430` |
  | `--paper` | `#FFFDF7` |

  Text contrast is at least 4.5:1.
- **Type:** Andika. Reading word 110 to 140 px, sentence 56 to 64 px, answer card 72 px, grown-up
  UI 18 to 22 px.
- **Components:**
  - `Target`, the only element using `--sun`;
  - `AnswerCard`;
  - `WordCard`;
  - `SentenceCard`, with per-word spans for highlighting;
  - `ProgressPath`: 6 step icons plus a seed row;
  - `Guide`, with 4 SVG poses;
  - `Garden`;
  - `HoldButton`, which fills a ring by colour steps with no motion needed and triggers at 1 s or 2 s.
- **Wireframes:**

  Landscape, 1280x614:
  ```
  +--------------------------------------------------------------+
  | [home-hold]  (o)(o)(*)( )( )( )  path       seeds: ● ● ○ ○ ○ |
  | [Guide]  "Find come"                              [speaker]  |
  |                                                              |
  |     +---------+     +---------+     +---------+              |
  |     |  come   |     |  cone   |     |  came   |   cards      |
  |     +---------+     +---------+     +---------+              |
  +--------------------------------------------------------------+
  ```

  Portrait, 800x1094: the guide and prompt on top, the word or sentence in the middle, and the
  answers in a 2x2 grid at the bottom.

  Read with me:
  ```
  | [Guide: listening]  "Read to your grown-up"                  |
  |   The   frog   can   jump   on   the   log.   (64 px)        |
  |                    [ ✓ ]  (Target, 160 px)                   |
  ```

### D2. Modules (classic scripts, in order after `ui.js`)
- `data/units/p4-01.js` and on each call `LR.units.push({...})`.
- `js/progress.js` holds the item store and scheduler.
- `js/session.js` plans the day, runs the steps, and handles resume, re-prompts and the target cue.
- `js/guide.js` and `js/garden.js` are SVG string builders.
- `js/steps/*.js` each register `LR.steps.<id> = { plan(day), run(item, done) }`.
- `js/lessons/grownups.js` is rewritten.

### D3. Scheduler (`LR.progress`)
- **Item ids:** `w:<word>` (tricky or decodable word), `g:<grapheme>`, `ss:<unit>` (silly-sentence
  set), `m:<skill>`.
- **Record:** `{ b: 0..5, d: 'YYYY-MM-DD' due, u: 'YYYY-MM-DD' last up-move, m: misses 0..999 }`.
- **Intervals:** `[0, 1, 2, 4, 7, 14]` days by box.
- **Up:** a first-try right answer moves the box up if `u !== today`. **Down:** a miss, help or
  "stumbled" mark moves it down one, with a floor of 0 and `d = today`.
- **Mastery:** `b >= 3`. The flower count equals the number of items that have ever reached box 3,
  stored in `flowers[]`, so it never shrinks.
- **Plan for Sounds and words:** the due items are sorted by box. The plan interleaves 1 weak item
  (box ≤ 1) for every 3 known ones (box ≥ 2), capped at 12 items. With fewer known items it fills in
  with mastered, not-due items, oldest first.
- **New words:** 2 when yesterday's first-try accuracy was at least 60%, 1 at 40 to 60%, 0 below 40%.
  The first session is 2.
- **Unit advance:** checked at the session's end. All unit items at box ≥ 3 and silly-sentence
  accuracy ≥ 80% open the next unit.
- **Dates:** the local date comes from `new Date()`. A date earlier than the last session is treated
  as the last session's date, so due dates clamp and nothing crashes.

### D4. Session runner
- **The plan** is built once per day and stored in `resume`: `{ date, steps: [{ id, items: [...] }],
  at: [step, item] }`.
- **Each item** renders one screen with one `Target` (after its prompt audio ends). The runner
  enforces the rules:
  - at most 3 items of one type in a row;
  - re-prompt at 8 s idle, up to 3 times, then "Tap to go on";
  - 2 misses → show the answer, say it, record a miss and advance.
- **Time budget:** at 12 min elapsed, the remaining steps are cut to their first item. Read with me
  is never cut below one story.
- **Resume:** leaving saves `at`. Reopening on the same date resumes; a new date re-plans, and
  unfinished items stay due.

### D5. Read with me
- The story is the unit's least-recently-read story (`stories[id] = lastDate`).
- The screen opens with a spoken "Read to your grown-up", then the sentence, with no audio before
  her attempt.
- A tap on a word speaks the word and marks `w:<word>` stumbled. This is the grown-up's control.
- ✓ reads the sentence aloud with highlighting and advances when it ends. ✓ is ignored during
  playback.
- Skipping the step needs a 2 s hold on a small "Not today" control, and the story is then offered
  first next time.

### D6. Schema 2
```
{ schema:2, unit:'p4-01', items:{ id:{b,d,u,m} }, flowers:[id], confusions:{ t:{ p:n } },
  stories:{ id:'YYYY-MM-DD' }, resume:{...}|null, days:[{ d, acc, mins }] (last 30),
  rate:0.9, warn:'' }
```
- **Limits:** items ≤ 2000, flowers ≤ 2000, confusions 200x10, stories ≤ 500, days ≤ 30. Ids match
  `^[a-z]{1,2}:[a-z0-9'-]{1,30}$`.
- **Migration from schema 1:**
  - `words` → `w:<word>` at box 1, due today;
  - `tricky` keys → box 0;
  - `confusions` are kept;
  - `story`, `hearts`, `storyMode` and `voice` are dropped;
  - `rate` is kept.
- Reading Garden goes readingGarden.v1 → schema 1 → schema 2.
- **Storage full:** `save()` catches the quota error, keeps the in-memory state, and sets `warn`,
  which Grown-ups shows.

### D7. Grown-ups
- **Gate:** "What is 7 + 5?" (sums of 11 to 18) on a 3x4 tap number pad. It's a child lock.
- **Screens:**
  - a progress card: unit, flowers, words to watch (most misses and mix-ups), last 7 days' minutes
    and accuracy;
  - the "Where is she?" unit list, tap to choose;
  - "Practise one game" (each step alone);
  - voice: speed, and a test button;
  - backup;
  - restore (a file input; rejected with a clear message on bad JSON, wrong app, newer schema, or
    over 1 MB);
  - reset (two taps, the second on a separate confirm screen).
- **Backup** is `Blob` → `URL.createObjectURL` → `<a download="YYYY-MM-DD.littlereader.json">`.
  It needs no CSP change: downloads are navigation, not fetch.

### D8. Prototype gate
- `tools/prototype.html` loads the real CSS and `LR.icons` / `LR.guide`, plus a dev-only
  `tools/prototype.js` that renders every screen and state from fixtures: home (first, returning,
  done), each step in waiting, right, wrong and help, Read with me, celebration, Grown-ups.
- `tests/prototype.js` screenshots them to `test-results/prototype/` at both sizes.
- The owner approves them before task group 3 starts.

## Risks / Trade-offs

- **Time-based re-prompts can nag.** They are capped at 3 and never scold.
- **Box-3 mastery may be generous.** Mastered items still come back every 14 days, and a miss drops
  them to box 2.
- **Unit content is authored by us, not Oxford.** It follows the Letters and Sounds order, and the
  owner skims each unit.
- **A migration bug could lose her progress.** Tests cover it with fixtures, and a backup is
  suggested before updating.
