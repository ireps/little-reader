# Voice clips

Until clips are added, the tablet's own voice speaks and the words show as captions. With clips, the app plays
Indian English recordings made by a **computer voice** instead. No human recordings, ever.

## What is needed

`tools/clip-list.txt` lists every clip, one per line: the text to say, a tab, and the file name. The app makes
any sentence from the longest clips it has: a whole sentence if there is a clip for it, otherwise its fixed
phrases and words in turn. For example, "That says cone." plays as `that-says.mp3` and then `cone.mp3`.
`npm test` fails if the course or the phrases change and the list wasn't regenerated with
`node tools/list-clips.js`, or if anything the app says can't be played from the list.

## Making and importing clips

1. **Make them.** On Windows with the English (India) voice "Heera" installed (Settings > Time & language >
   Speech > Add voices), run from the repo folder:

   ```
   powershell -ExecutionPolicy Bypass -File tools/make-clips.ps1
   ```

   This writes `audio/incoming/<name>.wav` and `<name>.json` (when each word starts, for the highlights).
   You can use any other computer voice instead: save one MP3 or WAV per line of the list in
   `audio/incoming/`, named as in the list. The `.json` files are optional.
2. **Import them.** `node tools/import-clips.js` checks the files against the list, converts WAV to MP3 with
   ffmpeg (needed only for WAV; on Windows: `winget install Gyan.FFmpeg`, then open a new terminal), measures each clip and writes `audio/clips/` and `audio/manifest.js`. Import the
   whole set each time: clips that aren't in the folder are removed. Missing clips are fine, because the tablet's voice says
   those and shows the caption.
3. Bump `?v=` in `index.html`, run `npm test`, and commit `audio/clips/` and `audio/manifest.js`.
   `audio/incoming/` is not committed.

## If the clips sound muffled

Listen to a WAV in `audio/incoming/` and to the same clip in `audio/clips/`.
- **Only the MP3 is muffled:** re-run `node tools/import-clips.js`. It now encodes at 96 kbps and keeps the WAV's own
  sample rate. Earlier versions used 48 kbps at 22.05 kHz.
- **The WAV is muffled too:** delete the WAVs and run `make-clips.ps1` again. It now records in the voice's own
  format. Earlier versions forced 22.05 kHz, which resampled the voice. If it still sounds dull, the voice itself is
  the limit: Heera is an older Windows voice.

## On the tablet

Grown-ups > Voice shows how many clips are installed. It has a switch to turn voice clips off, which goes back
to the tablet's voice, and a switch to show captions as well. The Speed slider also changes clip speed, from
0.75x to 1.2x.
