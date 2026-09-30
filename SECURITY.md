# Security and privacy

Little Reader is a static site with no server, no accounts, no analytics and no third-party code. The aim is to keep it that way.

## What is stored, and where

Only in the tablet's browser storage (`localStorage`, key `littleReader.v1`):

- her progress on each word (a review box, a due date and a count of misses)
- her garden (which words she has mastered) and her Word detective mix-ups
- which stories she has read, and today's session plan
- minutes and first-try accuracy for the last 30 days
- the speech speed

Nothing is sent anywhere. The app never asks for or stores a child's name, photo, voice, school or age. The words and stories are built in; nothing is typed.

### Backups

**Grown-ups → Save a backup** downloads the same data as a file, `YYYY-MM-DD.littlereader.json`, to the tablet. It holds progress only, no personal details, and is never sent anywhere. Restoring a backup checks it first (right app, not from a newer version, under 1 MB, valid JSON), passes it through the same validation as stored data, and asks before replacing anything.

### Wiping it

- **Grown-ups → Reset everything** (asks twice) deletes all progress on this tablet.
- Clearing site data for `ireps.github.io` in Silk's settings does the same.

## No third-party requests

The font is self-hosted. There are no CDNs, analytics, ads, trackers or external links on any screen a child uses. `index.html` sets this Content Security Policy:

```
default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:;
font-src 'self'; media-src 'self'; connect-src 'none'; object-src 'none';
base-uri 'none'; form-action 'none'
```

It also sets `referrer` to `no-referrer`.

Limits:

- GitHub Pages can't send custom headers, so `frame-ancestors` can't be set and the policy lives in a meta tag.
- No inline `<script>` or `style="…"` markup is allowed. Styles set from JavaScript are fine.

## Handling data that comes in

Nothing is typed any more, but stored data and backup files are still outside input.

- Everything loaded from storage or a backup passes `LR.store.validate()`, which rebuilds a clean state object with type and size limits (2,000 words, ids of letters only, 30 days, a 1 MB backup) and drops anything unexpected.
- Text reaches the page through `LR.ui.esc()` before `innerHTML`, or through `textContent`. New render code must do the same.
- Nothing is ever passed to `eval`, `new Function` or `setTimeout` with a string.

## The public repo

Never commit:

- a child's name, photos, voice, school or class details
- backup files (`*.littlereader.json` is in `.gitignore`)
- progress data from the tablet

Audio clips, if ever needed, are generated from a computer voice. No one's voice is recorded.

## Account

- Keep two-factor authentication on for the GitHub account.
- Keep **Enforce HTTPS** on in Settings → Pages.

## Reporting a problem

Open an issue on this repo. For anything sensitive, contact the repo owner directly rather than posting details publicly.
