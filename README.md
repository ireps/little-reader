# little-reader

A little web app to help a KG-2 child read, learn tricky words, and compare numbers, about 10 minutes a day.

Live at **https://ireps.github.io/little-reader/**. Built for an old Fire HD 10 (Fire OS 5.7, Silk browser). No login, no server, no build step, no dependencies.

## Today's session

Home is her garden and one **Start**. A session takes about 10 minutes and moves on by itself; there is nothing to choose and no Next button.

| Step | What it helps with |
| --- | --- |
| Sounds and words (Find it) | She hears a word and finds it among look-alikes that start the same way (*jump* among *junk* and *jam*). Words she has mixed up before come back as the distractors. Breaks the first-letter-guessing habit. Words come back on a spaced schedule until she knows them. |
| New tricky word | One or two a day. The word is said and spelled with its letters lit, she taps the ♥ letters (the ones that don't sound the way they look), then sees its family (*said*, *again*, *says*). |
| Read with me | She reads a short story to her grown-up, one sentence at a time. Nothing is read to her first. The grown-up taps any word she stumbles on (it is said and noted), then the tick plays the sentence with each word lit. *Not today* (a 2 s hold) skips it. |
| Maths | The hungry crocodile: which is more, and which mouth fits (< or >). The mouth always opens toward the bigger number. |
| Garden | A flower for every word she has mastered (right on the first try on 3 separate days), and a sprout for every word she is learning. The garden only grows. |

After two misses the answer is shown and said, and the session moves on. If nothing is tapped for a while, the instruction is repeated (three times), then a single **Go on** appears. Leaving mid-session needs a 1 s hold on Home, and Start picks up where she left off. When today's session is done, Home says *See you tomorrow!* and Start offers a little extra practice.

## Grown-ups

Hold the lock on Home for 2 seconds, then answer a sum on the number pad (a child lock, not security). Nothing is typed.

- **Progress:** her unit, flowers, words to watch, mix-ups, and the last few days' minutes and first-try accuracy.
- **Where is she?** Tap a unit to start there next time. The app moves on by itself when a unit is mastered.
- **Practise one game:** any step on its own.
- **Voice:** speed and a test.
- **Backup:** *Save a backup* downloads `YYYY-MM-DD.littlereader.json`; *Restore* checks a backup and asks before replacing anything; *Reset everything* asks twice.

## The course

The words and stories are built in, so there is nothing to type or load each week. The first four units follow Letters and Sounds Phase 4 (adjacent consonants), the order Oxford's phonics uses; Phase 5 of this project adds the rest. All stories are original, written for this app.

## How it feels

- **Every tap answers at once:** a right answer turns green with a ✓ and a soft chime; a wrong one dims with a dot and a low, quiet tone. No red, no cross, no buzzer.
- **No waiting:** the app speaks as soon as it is tapped and moves on as soon as it has finished speaking. Letters and words light up while they are spoken, not before.
- **Captions:** everything the app says also shows at the top of the screen. It stands in for the planned Indian English voice clips (Phase 7); until then the tablet's own voice speaks.
- **Big targets:** at least 120 px (about 2 cm on the tablet) for everything she taps.
- **Font:** Andika, made for early readers (single-storey *a* and *g*).
- **Silent until touched:** nothing is spoken before the first tap.

## Where it is saved

Everything is saved in the tablet's browser only. Save a backup now and then, in case Silk's data is cleared.

## Run it locally

The Content Security Policy blocks pages opened straight from disk, so serve the folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Tests

Browser checks run in Playwright (dev only; the site has no dependencies):

```
npm install
npx playwright install chromium
npm test
```

They open every screen at the Fire HD 10's size (1280 x 614 and 800 x 1094) with reduced motion on, replace the tablet's speech engine with a stand-in that records what is said and when, and check the speed budgets with the CPU slowed 6x.

Screenshots of every screen and state, for review:

```
npm run screens
```

They go to `test-results/screens/`.

## Specs

The app's behaviour and the planned rebuild (Phases 3 to 7) are written up with [OpenSpec](https://github.com/Fission-AI/OpenSpec) in `openspec/`. `openspec/specs/` describes what ships today, and `openspec/changes/` holds one proposed change per phase. Check them with:

```
npm run spec
```

## Check a device

Open `/tools/device-check.html` on the tablet, tap each button, and copy the results box. It reports speech support, voices, audio, storage, fonts and browser features.

## Layout

```
index.html               shell, Content Security Policy, script order
css/app.css
data/units.js            the built-in course (words, tricky words, stories)
js/words.js              heart letters, families, look-alikes
js/progress.js           spaced review, flowers, unit progress
js/store.js              load/save with validation, migration, reset
js/speech.js             clip first (if any), then the tablet's voice; captions
js/icons.js              interface icons as inline SVG
js/ui.js                 router, letters and hearts, finger sweep, feedback
js/guide.js, garden.js   Tilly the tortoise, and her garden
js/kit.js                session screen components
js/session.js            Home, today's plan, the session runner
js/steps/*.js            find, tricky, read, maths
js/lessons/grownups.js   Grown-ups
js/main.js               start
fonts/                   Andika (Regular and Bold, Latin), SIL OFL
audio/                   empty unless the tablet can't speak
tools/device-check.html  Phase 0 test page
tools/prototype.html     Phase 4 prototype, every session screen (npm run prototype)
tests/run.js             browser checks (npm test)
tests/screens.js         screenshots for review (npm run screens)
openspec/                specs (npm run spec)
CLAUDE.md                context for Claude Code
```

Scripts are classic `<script>` tags sharing one global, `LR`, so they run on old browsers.

## Security

See [SECURITY.md](SECURITY.md).

## Licences

Andika is © SIL International, under the SIL Open Font License 1.1 (`fonts/OFL.txt`).

The words, stories and pictures are original to this project; Tilly the tortoise is drawn in SVG for it. No third-party teaching content is included.
