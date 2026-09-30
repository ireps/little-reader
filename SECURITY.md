# Security and privacy

Little Reader is a static site with no server, no accounts, no analytics and no third-party code. The aim is to keep it that way.

## What is stored, and where

Only in the tablet's browser storage (`localStorage`, key `littleReader.v1`):

- this week's words and paragraph
- heart-letter changes made in Grown-ups
- counts of words she tapped for help or missed
- the chosen voice and speed

Nothing is sent anywhere. The app never asks for or stores a child's name, photo, voice, school or age.

### Wiping it

- **Grown-ups → Clear list** clears the help-word counts.
- To remove everything, clear site data for `ireps.github.io` in Silk's settings.

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

## Handling what a parent types

Words and paragraphs are parent input that ends up on the page.

- Everything goes through `LR.ui.esc()` before it reaches `innerHTML`. New render code must do the same, or use `textContent`.
- Words are cut down to letters and apostrophes, at most 30 characters, 60 words.
- Paragraphs are capped at 2,000 characters.
- Everything loaded from storage passes `LR.store.validate()`, which rebuilds a clean state object and drops anything unexpected.
- Nothing is ever passed to `eval`, `new Function` or `setTimeout` with a string.

## The public repo

Never commit:

- a child's name, photos, voice, school or class details
- backup files (`*.littlereader.json` is in `.gitignore`)
- help-word data from the tablet

Audio clips, if ever needed, are generated from a computer voice. No one's voice is recorded.

## Account

- Keep two-factor authentication on for the GitHub account.
- Keep **Enforce HTTPS** on in Settings → Pages.

## Reporting a problem

Open an issue on this repo. For anything sensitive, contact the repo owner directly rather than posting details publicly.
