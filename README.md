# little-reader

A little web app to help a kindergartner read, spell, and compare numbers.

Live at **https://ireps.github.io/little-reader/**. Built for an old Fire HD 10 (Fire OS 5.7, Silk browser). No login, no server, no build step, no dependencies.

## Lessons

| Lesson | What it helps with |
| --- | --- |
| Word detective | Hear a word, find it among look-alikes that start the same way (*pots*, *pets*, *posts*). Words she has mixed up before come back as the distractors. Breaks the first-letter-guessing habit. |
| Heart words | One tricky word at a time. Letters that don't sound the way they look get a ♥. "Say, spell, say", "Find the ♥" (she taps the tricky letters), and a family of words with the same trick once she has heard the word. |
| Read the story | Warm up the tricky words, then read the week's paragraph one sentence per screen. "Together" reads along; "My turn" lets her read first, then listen and check. Tap any word to hear it. |
| Hungry crocodile | < and >: the mouth always opens toward the bigger number. Rounds mix tapping the bigger number, choosing the mouth, and choosing the words ("is greater than"). |
| Grown-ups | This week's words and paragraph, heart letters, voice and speed, the words she needed help with, and her Word detective mix-ups. Opens after a sum question (a child lock, not security). |

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

They open every screen at the Fire HD 10's size (1280 x 614 and 800 x 1094) with reduced motion on.

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
fonts/                   Andika (add the files, see fonts/README.md)
audio/                   empty unless the tablet can't speak
tools/device-check.html  Phase 0 test page
tests/run.js             browser checks (npm test)
openspec/                specs (npm run spec)
CLAUDE.md                context for Claude Code
```

Scripts are classic `<script>` tags sharing one global, `LR`, so they run on old browsers.

## Security

See [SECURITY.md](SECURITY.md).

## Licences

Andika is © SIL International, under the SIL Open Font License 1.1 (`fonts/OFL.txt`).
