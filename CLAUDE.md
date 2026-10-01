# CLAUDE.md

Context for Claude Code. Read this before making changes. It replaces the planning chat and the plan doc, which Claude Code can't see.

## Project

Little Reader: a reading and early-maths web app for the owner's daughter, in KG-2 (UKG) in India, about 5 to 6. Her school uses OUP India's Oxford Advantage (NCF-FS 2022); phonics follows the Letters and Sounds order. It is a static site on GitHub Pages at https://ireps.github.io/little-reader/ and runs in Silk on an Amazon Fire HD 10.

Where she is: past 3-letter word families, now on 4-letter words and her first paragraphs. Her main problems:

- **Tricky (sight) words** like *come*, *some*, *from*, which she forgets between sessions.
- **First-letter guessing:** she reads the start of a word and guesses the rest (*pots* read as *plants*, *grow* as *gome*, *come* as *coh*).
- **Mixing up < and >.** Her class teaches them; it's not known whether they use the crocodile idea.
- **Using read-aloud as a crutch,** and not knowing what to tap when a screen offers choices. She reads with a parent.

Owner constraints: grown-ups never type content (everything is built in), sessions are about 10 minutes, the voice is Indian English, and speed matters.

The owner is a developer. Public docs: README.md and SECURITY.md. Keep them accurate when behaviour changes.

## Target device (measured on the tablet)

| Check | Result | Consequence |
| --- | --- | --- |
| Browser | Silk 108.18.4, Chromium 108, Android 5.1.1 | Modern JS/CSS up to Chromium 108 is safe |
| Screen | 1280 x 614 CSS px landscape (Silk's toolbar takes the rest), pixel ratio 1.5 | Every screen must fit 614 px of height. `css/app.css` has a short-landscape media query |
| Speech | One voice only: "English United States", `en_US`, on-device. Test speech finished | Text-to-speech works. The app can't choose another voice |
| Reduced motion | On | Animations don't play. Every animated cue needs a non-motion cue too (colour, text or sound) |
| Service workers, localStorage, HTTPS | All yes | Offline mode is possible later |
| Not tested | `onboundary` events | `say()` lights words from boundary events if they arrive, else from a calibrated estimate |

Other facts:

- Android 5.1 doesn't trust Let's Encrypt's ISRG Root X1. Keep using the `github.io` address; no custom domain.
- `speechSynthesis.speak()` needs a prior user tap in the page.
- Voice `lang` comes as `en_US`, with an underscore. `speech.js` normalises it.

## Coding rules

- Classic `<script>` files in a fixed order (see `index.html`) sharing one global, `LR`. No ES modules, bundler, framework or build step.
- No runtime dependencies and no CDN links. Playwright is dev-only, for tests.
- The Content Security Policy meta tag in `index.html` stays, with no `unsafe-inline` or `unsafe-eval`. That means no inline `<script>`, no `on…=` handlers and no `style="…"` attributes in markup. Setting `el.style` from JS is fine.
- Anything a parent typed reaches the page only through `LR.ui.esc()` or `textContent`. Every new render function must follow this.
- Everything read from storage goes through `LR.store.validate()`. Add every new state field there, with type and size limits.
- All sound goes through `LR.speech.say(text, opts)`, which returns a Promise that always settles (a watchdog of start-up + estimated length + 1 s). It plays a clip from `LR.clips` if one exists, shows the text as a caption in the top bar (a placeholder until Phase 7's clips), and speaks nothing before the first touch. `opts.onStart(ms)` and `opts.onWord(i)` (with `opts.parts`) drive highlights *during* speech. Join phrases into one utterance (`'Yes! ' + w`); a sentence is one utterance.
- No fixed waits: advance when `say()` settles. The one exception is the pace beat: the runner holds a finished item on screen for `LR.ui.pace().beat` ms (Grown-ups > Pace; Calm by default, because the owner found the app too fast). Sweeps, Flash and animations scale by `LR.ui.pace().f`.
- Before starting new speech or animation, call `LR.ui.stopAll()`. Guard async chains with `var g = LR.ui.gen; … if (g !== LR.ui.gen) return;`.
- Child tap targets are at least 120 x 120 px (words in a sentence: 60 px tall; letters of a word: 120 px tall, 60 px wide). Grown-ups controls: 64 px.
- Call `LR.ui.feedback(el, 'right'|'wrong')` synchronously in the tap handler: a colour state, a mark and a WebAudio tone within 100 ms. Wrong answers are never punished: no buzzer, no red, no cross.
- Interface icons come from `LR.icons.get(name)` (inline SVG), never emoji.
- Session steps draw through the runner's `ctx` (`screen`, `prompt`, `done`, `miss`, `pose`, `live`); check `ctx.live()` in async chains rather than `LR.ui.gen`, since every tap bumps `gen`. Captions must never show an answer she is looking for (`say(w, { caption })`).
- Keep words in the UI short and plain; she's 6. Grown-ups copy can be normal adult English.
- Don't add emoji newer than about Unicode 8, because the tablet's font is old.

## Layout

```
index.html               shell, CSP, script order
css/app.css              all styles, including the 614 px landscape query
data/units.js            the course, part 1: LR.units (Phase 3 review, Phase 4), LR.startUnit, LR.knownTricky
data/units-p5.js         the course, part 2 (Phase 5). Every word must pass LR.words.checkUnits() (npm test)
data/phrases.js          LR.phrases: everything said besides the course, {w} for a word (dev-only, for tools/list-clips.js)
data/pictures.js         LR.pictures (emoji, Unicode 6 only) and LR.lang (rhymes, a/an, plurals, positions)
js/words.js              graphemes (Letters and Sounds), segment(), decodable(), checkUnits(), hearts, families, look-alikes
js/maths.js              LR.maths: the 15 KG-2 skills in unlock order, seeded question generators, ten-frames
js/progress.js           LR.progress: boxes, due dates, flowers, review plan, pacing, unit advance, dates
js/store.js              LR.state schema 2, load/save/validate, migration from schema 1 and readingGarden.v1, reset
js/speech.js             LR.speech: voice choice, clips (whole text or longest phrases, else the tablet voice), say() with timings and captions, cancel(), preload()
js/icons.js              LR.icons: interface icons as inline SVG
js/ui.js                 LR.ui helpers, letters and hearts, finger sweep, feedback, router
js/guide.js, garden.js   Tilly the tortoise (4 still poses) and her garden (flowers and sprouts)
js/kit.js                LR.kit: session screen components (path, seeds, target, cards, sentence, hold)
js/session.js            Home, today's plan, the runner (routes home, session, practice-<step>)
js/steps/*.js            find, flash, pic, build, tricky, silly, read, q, lang (rhyme, an, plural, pos, caps), maths (crocodile), math:
                         each registers LR.steps.<type> = { render, tap }; choice.js (shared answer logic), help.js (help ladder)
js/lessons/grownups.js   Grown-ups (route grownups)
js/main.js               load state, start router
fonts/                   Andika Regular and Bold (Latin subset, SIL OFL)
audio/                   manifest.js (LR.clips, written by tools/import-clips.js), clips/, README.md (how to supply clips)
tools/device-check.html  device test page
tools/list-clips.js      writes tools/clip-list.txt (npm test fails if it is stale)
tools/import-clips.js    supplied clips -> audio/clips/ + audio/manifest.js
tools/make-clips-neerja.py  Neerja (en-IN neural, via edge-tts, online, dev only) clips with word timings: the recommended voice
tools/make-clips.ps1     Windows helper: Heera en-IN clips with word timings (sounded muffled)
tools/prototype.html     Phase 4 prototype: every session screen and state from fixtures (dev only)
tests/run.js             Playwright browser checks (with a speech-engine stand-in)
tests/screens.js         screenshots of every screen and state (npm run screens)
tests/prototype.js       prototype screenshots, checks and contact sheets (npm run prototype)
openspec/                specs: config.yaml, specs/ (shipped), changes/ (Phases 3 to 7)
.claude/                 OpenSpec skills and /opsx commands for Claude Code
```

## State (`localStorage` key `littleReader.v1`, schema 2)

```
{ schema: 2, unit: "p4-01", items: { "w:come": { b: 0-5, d: due date, u: last up-move date, m: misses } },
  flowers: [item ids ever mastered], confusions: { target: { pickedInstead: count } },
  stories: { storyId: last read date }, silly: { unitId: [answered, right] }, resume: today's plan { date, steps: [{ id, items }], at: [step, item],
  done, started, fresh, right, answered, mode }, days: [{ d, n, r, mins }] (last 30), rate: 0.9, last: date, equals: false, clips: true, captions: false, pace: 'calm'|'normal'|'quick' }
```

Maths skills are items too (`m:compare`, `m:count`, …): their box drives unlocking (box 2 opens the next) and level (box 3 means level 2).

```
```

Dates are local `YYYY-MM-DD`; "today" never goes back past `last`. Schema 1 and Reading Garden data migrate on load. Backups wrap the state as `{ app: "little-reader", schema, saved, state }`.

Changing the shape means bumping `schema`, migrating in `store.js`, and extending `validate()`.

## Decisions made

- **Voice:** "any female voice". The tablet has only one voice, so `chooseVoice()` prefers a female one where there's a choice. If the tablet's voice isn't female, the owner can change it in the tablet's text-to-speech settings.
- **No recordings, ever.** If clips are ever needed, generate them from a computer voice.
- **Old words** keep coming back until she gets each one right first try on 3 separate days (box 3, mastered; Phase 4). After that they return about every 2 weeks, and a miss drops them one box.
- **Sound patterns:** yes, folded into Phase 5 (`add-kg2-english`).
- **No Amazon Kids profile** on the tablet.
- **The grown-ups gate** is a sum question. It's a child lock, not security.
- **Heart words:** "Find the ♥" replaced the planned "which one has the heart?" round.
- **Garden:** flowers for mastered words (never taken away), sprouts for words being learned, so progress shows from day one.
- **Pictures are emoji up to Unicode 6** (not 8), because the tablet runs Android 5.1. A word without one never appears in a picture task.
- **Course content is checked, not trusted:** every word she reads must pass the decodability check for its unit.
- **Choice screens have no primary target;** the sun-yellow target is only for single-action screens (Start, the tick, Go on, Done).

## Roadmap

The rebuild is specified in OpenSpec under `openspec/` (see "How to work"). Each phase is one change
folder in `openspec/changes/`, one commit or pull request, and the owner tries it on the tablet before
the next phase starts.

Done: Phase 0 (device check), Phase 1 (foundation), Phase 2 (lesson improvements). Phases 3 to 7 are built and merged to `main`, including Phase 7's clips; the owner archives them together after trying them (`openspec archive` for `rebuild-speech-for-speed`, `add-guided-daily-session`, `add-kg2-english`, `add-kg2-maths`, `add-indian-voice-clips`, in that order).

| Phase | Change | What it delivers |
| --- | --- | --- |
| 3 | `rebuild-speech-for-speed` | With the tablet voice and on-screen placeholder captions: one utterance per sentence, highlights during speech, no fixed waits, feedback under 100 ms, SVG icons, Andika, 120 px targets. Works on today's lessons. |
| 4 | `add-guided-daily-session` | Garden home with one Start, a self-advancing 10-minute session, spaced review, Read with me, first built-in units, tap-only Grown-ups with backup, restore and reset, schema 2. **It starts with prototype screenshots that the owner approves.** |
| 5 | `add-kg2-english` | Letters and Sounds Phase 3 to 5 units (including the old "sound patterns" plan), Flash, Picture match, Build it, Silly sentences, the help ladder, language tasks, story questions. |
| 6 | `add-kg2-maths` | The NCF-FS KG-2 numeracy skills, with the crocodile's = behind a Grown-ups switch (off by default). |
| 7 | `add-indian-voice-clips` (built, clips in) | Indian English clips supplied by the owner (matched to a generated list) for every string, with word timings, preloading and a coverage test. Last, because the full list of strings is only known once Phases 4 to 6 exist. |

**Superseded:** the old Phase 3 (typed weekly content). Its backup, restore and reset items moved to Phase 4.

**Later (not specified yet):** `add-letter-tracing`, `add-offline-mode` (service worker).

**Still open:** whether there's a weekly spelling test. Ask the owner before building for it. Whether = is taught is now a Grown-ups setting (Phase 6).

## How to work

- Plan each phase and wait for the owner's approval before writing code. One commit or pull request per phase.
- Specs use OpenSpec 1.13 (dev-only dependency). `openspec/config.yaml` holds the context and rules; `openspec/specs/` is what has shipped; `openspec/changes/<id>/` holds proposal, design, tasks and delta specs.
  The loop: propose (`/opsx:propose`), owner approves, apply (`/opsx:apply`, working through `tasks.md`), owner tries it on the tablet, archive (`/opsx:archive`).
  `npm run spec` (`openspec validate --all --strict`) must pass before every commit.
- The owner prefers cost-effective model use: a stronger model for planning and review, a cheaper one for routine implementation.
- Before every commit:
  1. `npm test` passes. First time: `npm install && npx playwright install chromium`.
  2. For UI changes, run `npm run screens` (1280x614 and 800x1094, reduced motion) and look at them. Nothing may scroll at 1280x614.
  3. No console errors or CSP violations, and no requests to other hosts.
  4. Nothing personal is committed: her name, voice, photos, school, backups or help-word data.
  5. README.md and SECURITY.md still match the behaviour.
  6. Bump the `?v=` number on every file in `index.html` when a release changes JS or CSS, so the tablet doesn't keep stale copies.
- Add a test to `tests/run.js` for each new behaviour.

## Pending owner actions

- Phase 6: check that the ₹ sign shows on the coins, and whether her class teaches = yet (the Equals sign switch).
- Phase 5: check that every picture shows on the tablet (emoji are Unicode 6, which Android 5.1 should draw), and note which new activities needed explaining over a week of sessions.
- Phases 3 and 4: run one full session with her on the tablet. Note stray taps, "what do I do?" moments, help taps and how long it takes (target: at most 2 moments, 10 ± 2 minutes). Does it feel instant? Do the highlights keep up with the voice?
- Phase 7: the clips are in: all 1398, in Neerja (en-IN neural) at `--rate -10% --pitch +15Hz`, chosen by the owner as clearer for a child than the default; every clip has word timings, and the importer cuts edge-tts's long end silence. Try them on the tablet: is every word clear, do the highlights keep up, and do joined sentences ("That says" + word) flow? To remake: `uv venv .venv`, `uv pip install --python .venv edge-tts`, `.venv\Scripts\python tools/make-clips-neerja.py`, then `node tools/import-clips.js`.
- Pace: try Calm (the default) on the tablet; Grown-ups > Pace has Normal and Quick.

- Turn on GitHub Pages from `main` (root), with Enforce HTTPS on.
- Check whether the tablet's voice sounds female. If not, look in the tablet's text-to-speech settings.
