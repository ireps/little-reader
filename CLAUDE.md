# CLAUDE.md

Context for Claude Code. Read this before making changes. It replaces the planning chat and the plan doc, which Claude Code can't see.

## Project

Little Reader: a reading, spelling and number-comparison web app for the owner's daughter, a kindergartner (about 6). It is a static site on GitHub Pages at https://ireps.github.io/little-reader/ and runs in Silk on an Amazon Fire HD 10.

Where she is: past 3-letter word families, now on 4-letter words and her first paragraphs. Her main problems:

- **Tricky (sight) words** like *come*, *some*, *from*, which she forgets between sessions.
- **First-letter guessing:** she reads the start of a word and guesses the rest (*pots* read as *plants*, *grow* as *gome*, *come* as *coh*).
- **Mixing up < and >.** Her class teaches them; it's not known whether they use the crocodile idea.

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
- **Old words** keep coming back until she gets each one right 3 times in a row (Phase 3).
- **Sound patterns** lesson: yes (Phase 4).
- **No Amazon Kids profile** on the tablet.
- **The grown-ups gate** is a sum question. It's a child lock, not security.
- **Heart words:** "Find the ♥" replaced the planned "which one has the heart?" round.

## Roadmap

Done: Phase 0 (device check), Phase 1 (foundation), Phase 2 (lesson improvements). Phase 2 still needs a try on the tablet.

**Phase 3: weekly content.** Aim: loading a new week takes under 2 minutes, and nothing is lost if Silk's data is cleared.

- [ ] Save weeks, not one list: `weeks: [{ start, words, story }]`. "Start new week" archives the current one. Migrate the current `words`/`story` into the first week.
- [ ] Word detective draws about 70% from this week and 30% from older weeks. An old word retires after 3 correct in a row. Track a streak per word.
- [ ] Heart-letter editor: this week's words first, with story words under "More".
- [ ] Backup: "Save a backup" downloads `*.littlereader.json`, and "Restore" loads one through `validate()`, rejecting a bad file with a clear message.
- [ ] Reset everything, behind a second confirmation.
- [ ] Help-words list covers the last 2 weeks, with a per-word "She's got it" button.

**Phase 4: sound patterns lesson.** A fifth tile teaching letter pairs through whole words, so no isolated sounds are needed:

- Start with *ow*, *oi*, *or*, *ee*, *ai*, then *oa*, *ou*, *ar*, *sh*, *ch*, *th*.
- *ow* gets two families side by side: *grow* and *snow* against *cow* and *flower*.
- Rounds: she hears a word and taps the pair it uses; sorts words into pattern houses; builds words from tiles where a pair is one tile.
- Done when she finishes 8 rounds alone and a pair always moves as a single tile.

**Later:** offline mode with a service worker (supported on the tablet).

**Still open:** whether = is taught yet, and whether there's a weekly spelling test. Ask the owner before building for either.

## How to work

- Plan each phase and wait for the owner's approval before writing code. One commit or pull request per phase.
- The owner prefers cost-effective model use: a stronger model for planning and review, a cheaper one for routine implementation.
- Before every commit:
  1. `npm test` passes. First time: `npm install && npx playwright install chromium`.
  2. For UI changes, take screenshots at 1280x614 and 800x1094 with reduced motion on, and look at them. Nothing may scroll at 1280x614.
  3. No console errors or CSP violations, and no requests to other hosts.
  4. Nothing personal is committed: her name, voice, photos, school, backups or help-word data.
  5. README.md and SECURITY.md still match the behaviour.
- Add a test to `tests/run.js` for each new behaviour.

## Pending owner actions

- Add the Andika files to `fonts/` (see fonts/README.md).
- Turn on GitHub Pages from `main` (root), with Enforce HTTPS on.
- Try Phase 2 on the tablet: every lesson, with her, once.
- Check whether the tablet's voice sounds female. If not, look in the tablet's text-to-speech settings.
