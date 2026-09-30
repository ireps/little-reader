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
| Not tested | `onboundary` events, Andika font | "Read it to me" points word by word with separate utterances |

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
- All sound goes through `LR.speech.say(text)`, which returns a Promise that always settles. It has a timeout, and it plays a clip from `LR.clips` if one exists.
- Before starting new speech or animation, call `LR.ui.stopAll()`. Guard async chains with `var g = LR.ui.gen; … if (g !== LR.ui.gen) return;`.
- Tap targets are at least 64 px. Feedback comes within about 200 ms of a tap. Wrong answers are never punished: no buzzer, no red cross.
- Keep words in the UI short and plain; she's 6. Grown-ups copy can be normal adult English.
- Don't add emoji newer than about Unicode 8, because the tablet's font is old.

## Layout

```
index.html               shell, CSP, script order
css/app.css              all styles, including the 614 px landscape query
data/default-week.js     starter words and paragraph (LR.defaultWeek)
js/words.js              heart-letter dictionary, word families, look-alike bank, letter names
js/store.js              LR.state, load/save/validate, migration from readingGarden.v1
js/speech.js             LR.speech: voice choice, clip hook, say(), cancel()
js/ui.js                 LR.ui helpers, letters and hearts, finger sweep, router, home screen
js/lessons/*.js          detective, hearts, story, croc, grownups (each registers LR.routes.<name>)
js/main.js               load state, start router
fonts/                   Andika (the owner adds the files; see fonts/README.md)
audio/                   empty; clips only if ever needed
tools/device-check.html  device test page
tests/run.js             Playwright browser checks
openspec/                specs: config.yaml, specs/ (shipped), changes/ (Phases 3 to 7)
.claude/                 OpenSpec skills and /opsx commands for Claude Code
```

## State (`localStorage` key `littleReader.v1`, schema 1)

```
{ schema, words: [..], story: "..", hearts: { word: [letter indexes] }, tricky: { word: count },
  confusions: { target: { pickedInstead: count } }, storyMode: "together"|"myturn", voice: "", rate: 0.8 }
```

Changing the shape means bumping `schema`, migrating in `store.js`, and extending `validate()`.

## Decisions made

- **Voice:** "any female voice". The tablet has only one voice, so `chooseVoice()` prefers a female one where there's a choice. If the tablet's voice isn't female, the owner can change it in the tablet's text-to-speech settings.
- **No recordings, ever.** If clips are ever needed, generate them from a computer voice.
- **Old words** keep coming back until she gets each one right first try on 3 separate days (box 3, mastered; Phase 4). After that they return about every 2 weeks, and a miss drops them one box.
- **Sound patterns:** yes, folded into Phase 5 (`add-kg2-english`).
- **No Amazon Kids profile** on the tablet.
- **The grown-ups gate** is a sum question. It's a child lock, not security.
- **Heart words:** "Find the ♥" replaced the planned "which one has the heart?" round.

## Roadmap

The rebuild is specified in OpenSpec under `openspec/` (see "How to work"). Each phase is one change
folder in `openspec/changes/`, one commit or pull request, and the owner tries it on the tablet before
the next phase starts.

Done: Phase 0 (device check), Phase 1 (foundation), Phase 2 (lesson improvements). Phase 2 still needs a try on the tablet.

| Phase | Change | What it delivers |
| --- | --- | --- |
| 3 | `rebuild-speech-for-speed` | With the tablet voice: one utterance per sentence, highlights during speech, no fixed waits, feedback under 100 ms, SVG icons, Andika, 120 px targets. Works on today's lessons. |
| 4 | `add-guided-daily-session` | Garden home with one Start, a self-advancing 10-minute session, spaced review, Read with me, first built-in units, tap-only Grown-ups with backup, restore and reset, schema 2. **It starts with prototype screenshots that the owner approves.** |
| 5 | `add-kg2-english` | Letters and Sounds Phase 3 to 5 units (including the old "sound patterns" plan), Flash, Picture match, Build it, Silly sentences, the help ladder, language tasks, story questions. |
| 6 | `add-kg2-maths` | The NCF-FS KG-2 numeracy skills, with the crocodile's = behind a Grown-ups switch (off by default). |
| 7 | `add-indian-voice-clips` | Indian English clips (Heera, generated on the owner's PC) for every string, with word timings, preloading and a coverage test. Last, because the full list of strings is only known once Phases 4 to 6 exist. |

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
  2. For UI changes, take screenshots at 1280x614 and 800x1094 with reduced motion on, and look at them. Nothing may scroll at 1280x614.
  3. No console errors or CSP violations, and no requests to other hosts.
  4. Nothing personal is committed: her name, voice, photos, school, backups or help-word data.
  5. README.md and SECURITY.md still match the behaviour.
- Add a test to `tests/run.js` for each new behaviour.

## Pending owner actions

- Phase 3: give the OK to download Andika from SIL (or add the files yourself).
- Phase 7: run `tools/make-clips.ps1` on a Windows PC with the Heera voice.

- Add the Andika files to `fonts/` (see fonts/README.md).
- Turn on GitHub Pages from `main` (root), with Enforce HTTPS on.
- Try Phase 2 on the tablet: every lesson, with her, once.
- Check whether the tablet's voice sounds female. If not, look in the tablet's text-to-speech settings.
