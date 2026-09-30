# little-reader

A little web app to help a kindergartner read, spell, and compare numbers.

Live at **https://ireps.github.io/little-reader/**. Built for an old Fire HD 10 (Fire OS 5.7, Silk browser). No login, no server, no build step, no dependencies.

## Lessons

| Lesson | What it helps with |
| --- | --- |
| Word detective | Hear a word, find it among look-alikes that start the same way (*pots*, *pets*, *posts*). Words she has mixed up before come back as the distractors. Breaks the first-letter-guessing habit. |
| Heart words | One tricky word at a time. Letters that don't sound the way they look get a ♥. "Say, spell, say", "Find the ♥" (she taps the tricky letters), and a family of words with the same trick once she has heard the word. |
| Read the story | Warm up the tricky words, then read the week's paragraph one sentence per screen. "Together" reads along; "My turn" lets her read first, then listen and check. "Read it to me" says the whole sentence and lights each word as it is spoken. Tap any word to hear it. |
| Hungry crocodile | < and >: the mouth always opens toward the bigger number. Rounds mix tapping the bigger number, choosing the mouth, and choosing the words ("is greater than"). The next round starts by itself once the answer has been spoken. |
| Grown-ups | This week's words and paragraph, heart letters, voice and speed, the words she needed help with, and her Word detective mix-ups. Opens after a sum question (a child lock, not security). |

## How it feels

- **Every tap answers at once:** a right answer turns green with a ✓ and a soft chime; a wrong one dims with a dot and a low, quiet tone. No red, no cross, no buzzer.
- **No waiting:** the app speaks as soon as it is tapped and moves on as soon as it has finished speaking. Letters and words light up while they are spoken, not before.
- **Captions:** everything the app says also shows at the top of the screen. It stands in for the planned Indian English voice clips (Phase 7); until then the tablet's own voice speaks.
- **Big targets:** at least 120 px (about 2 cm on the tablet) for everything she taps.
- **Font:** Andika, made for early readers (single-storey *a* and *g*).
- **Silent until touched:** nothing is spoken before the first tap.

## Each week

1. Open **Grown-ups** on the tablet.
2. Paste the school's word list and the paragraph, then tap **Save**.

Everything is saved in the tablet's browser only.

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
js/words.js              heart letters, families, look-alike bank
js/store.js              load/save with validation, migration
js/speech.js             clip first (if any), then the tablet's voice
js/ui.js                 router, letters and hearts, finger sweep, home
js/lessons/*.js          one file per lesson
js/main.js               start
data/default-week.js     starter words and paragraph
fonts/                   Andika (Regular and Bold, Latin), SIL OFL
js/icons.js              interface icons as inline SVG
js/kit.js, guide.js, garden.js  guided-session components (Phase 4, prototype only so far)
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
