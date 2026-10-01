# little-reader

A little web app to help a KG-2 child read, learn tricky words, and compare numbers, about 10 minutes a day.

Live at **https://ireps.github.io/little-reader/**. Built for an old Fire HD 10 (Fire OS 5.7, Silk browser). No login, no server, no build step, no dependencies.

## Today's session

Home is her garden and one **Start**. A session takes about 10 minutes and moves on by itself; there is nothing to choose and no Next button.

| Step | What it helps with |
| --- | --- |
| Sounds and words | Each word gets the activity that fits how well she knows it. New words: **Build it** (she hears the word and taps sound tiles into slots; *sh* or *a–e* is one tile) or **Picture match** (she reads the word, with Oxford-style sound buttons, and taps its picture). Known words: **Find it** (she hears a word and finds it among look-alikes that start the same way; her past mix-ups come back as the distractors, then built-in sets of words that start alike but end differently, such as *pots*, *plants*, *plums*, so she has to read the whole word) or **Flash** (the word shows for 2 seconds, then she picks it from the same kind of look-alikes). Words come back on a spaced schedule until she knows them. The step ends with one language task a day, in turn: rhyme, *a* or *an*, one or many, in/on/under, capital letters. |
| New tricky word | One or two a day. The word is said and spelled with its letters lit, she taps the ♥ letters (the ones that don't sound the way they look), then sees its family (*said*, *again*, *says*). |
| Silly sentences | She reads three sentences and gives each a thumbs up (makes sense) or a thumbs down (silly). The sentence is read only after she answers. |
| Read with me | She reads a short story to her grown-up, one sentence at a time. Nothing is read to her first. The grown-up taps any word she stumbles on: the first tap gives a hint (its ♥ letters light, and a word with the same trick or its first sound), the second says the word, and it is noted. Then the tick plays the sentence with each word lit. Two questions about the story follow: who, where or what, and *What happened first?* with short phrases from the story to choose from. A different pair comes each day, so a story read again brings the others. *Not today* (a 2 s hold) skips it. |
| Maths | Four or five questions from the skills she has unlocked, in the KG-2 (NCF-FS) order: comparing with the hungry crocodile (< and >; = once a grown-up switches it on), counting with ten-frames, numbers and amounts (then tens and ones), counting on and back, before/after/between on a number line, zero, adding, taking away, number names, Indian coins and notes, measuring, shapes, halves, patterns, and days, months and times of day. Each skill unlocks when the one before is going well, and moves to bigger numbers once mastered. After two misses the answer is shown, counting along where there is something to count. |
| Garden | A flower for every word she has mastered (right on the first try on 3 separate days), and a sprout for every word she is learning. The garden only grows. |

After two misses the answer is shown and said, and the session moves on. If nothing is tapped for a while, the instruction is repeated (three times), then a single **Go on** appears. Leaving mid-session needs a 1 s hold on Home, and Start picks up where she left off. When today's session is done, Home says *See you tomorrow!* and Start offers a little extra practice.

## Grown-ups

Hold the lock on Home for 2 seconds, then answer a sum on the number pad (a child lock, not security). Nothing is typed.

- **Progress:** her unit, flowers, words to watch, mix-ups, and the last few days' minutes and first-try accuracy.
- **Maths:** each skill she has unlocked, its level, and the **Equals sign** switch (off until her class teaches =).
- **Where is she?** Tap a unit to start there next time. The app moves on by itself when a unit is mastered.
- **Practise one game:** any step on its own.
- **Voice:** speed, a test, and **Pace** (Calm, Normal or Quick: how long each answer stays on screen before the next one, and how slowly things move; Calm by default). Once voice clips are installed: how many there are, a switch to turn them off, and a switch to keep captions on with them.
- **Backup:** *Save a backup* downloads `YYYY-MM-DD.littlereader.json`; *Restore* checks a backup and asks before replacing anything; *Reset everything* asks twice.

## The course

The words and stories are built in, so there is nothing to type or load each week. There are 27 units in the Letters and Sounds order that Oxford's phonics uses: a Phase 3 review, Phase 4 (adjacent consonants, where a new install starts), Phase 5 (*ay*, *ou*, *ie*, *ea*, *oy*, *ir*, *ue*, *ew*, *aw*, *wh*, *ph*, *au*, *oe*, the split digraphs *a_e* to *u_e*, *ow* as in *snow* and *cow*, *y* and *ey*), two mixed review units, then early Phase 6 endings: *-s* and *-es*, *-ing*, *-ed* and *-er*/*-est*. Each unit has 10 words, its tricky words, four stories (each with three questions), eight silly sentences and sets of look-alike words. Stories cover early-years themes with Indian settings: family, home, school, festivals (Diwali, Holi, Eid, Pongal, the kite festival), the seasons, safety, plants, animals, food and helpers. A check in the tests makes sure every word she reads uses only sounds, endings and tricky words taught by then. The next unit opens by itself when every word is mastered and silly sentences are 80% right. The Phase 2 and 3 tricky words she is assumed to know (*the*, *to*, *I*, *no*, *go*, *into*, *me*, *be*, *are*) are reviewed from the start, alongside her known words, and drop out once mastered.

All stories are original, written for this app. Pictures are emoji the tablet can draw (Unicode 6).

## How it feels

- **Every tap answers at once:** a right answer turns green with a ✓ and a soft chime; a wrong one dims with a dot and a low, quiet tone. No red, no cross, no buzzer.
- **Speaks at once, moves on calmly:** the app speaks as soon as it is tapped. After an answer, it stays on screen for a beat (set by Pace) before the next one. Letters and words light up while they are spoken, not before.
- **Voice and captions:** with Indian English voice clips installed (computer-made; see [audio/README.md](audio/README.md)), the app plays them, and the tablet's own voice says anything without a clip. Until clips are added, the tablet's voice speaks everything and it also shows as a caption.
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

The app's behaviour is written up with [OpenSpec](https://github.com/Fission-AI/OpenSpec) in `openspec/`. `openspec/specs/` describes what ships today, `openspec/changes/` holds any change in progress, and `openspec/changes/archive/` keeps the finished ones (the rebuild, Phases 3 to 7). Check them with:

```
npm run spec
```

## Check a device

Open `/tools/device-check.html` on the tablet, tap each button, and copy the results box. It reports speech support, voices, audio, storage, fonts and browser features.

## Layout

```
index.html               shell, Content Security Policy, script order
css/app.css
data/units.js            the course, Phase 3 review and Phase 4 (words, tricky words, stories, silly sentences)
data/units-p5.js         the course, Phase 5
data/units-p6.js         the course, mixed review and early Phase 6 endings (-s/-es, -ing, -ed, -er/-est)
data/pictures.js         pictures for words (emoji), rhymes, a/an, plurals, in/on/under
js/words.js              graphemes, splitting and decodability, heart letters, families, look-alikes
js/maths.js              the maths skills and their question generators
js/progress.js           spaced review, flowers, unit progress, maths unlocking
js/store.js              load/save with validation, migration, reset
js/speech.js             clip first (if any), then the tablet's voice; captions
js/icons.js              interface icons as inline SVG
js/ui.js                 router, letters and hearts, finger sweep, feedback
js/guide.js, garden.js   Tilly the tortoise, and her garden
js/kit.js                session screen components
js/session.js            Home, today's plan, the session runner
js/steps/*.js            find, flash, pic, build, tricky, silly, read, q, lang, maths, and the help ladder
js/lessons/grownups.js   Grown-ups
js/main.js               start
fonts/                   Andika (Regular and Bold, Latin), SIL OFL
data/phrases.js          everything the app says besides the course (for the clip list; not loaded by the app)
audio/                   manifest.js and clips/ (voice clips, once supplied); README.md says how
tools/list-clips.js      makes tools/clip-list.txt, the clips the app can need
tools/import-clips.js    checks supplied clips and writes audio/clips/ and audio/manifest.js
tools/make-clips-neerja.py  makes the clips with Microsoft's neural en-IN voice Neerja (recommended)
tools/make-clips.ps1     makes the clips with a Windows computer voice (Heera, en-IN)
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
