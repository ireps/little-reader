# Andika font

Andika (by SIL) is made for early readers: a single-story *a* and *g*, and clearly different *b d p q*.

This folder holds:

- `Andika-Regular.woff2` and `Andika-Bold.woff2`: the Latin subset of Andika 6, taken from the
  [`@fontsource/andika`](https://www.npmjs.com/package/@fontsource/andika) npm package (version 5.3.0), which repackages SIL's release
- `OFL.txt`: the SIL Open Font License 1.1 that the fonts are released under

The Latin subset covers English letters, digits and common punctuation. Anything else (such as ♥) falls back to the tablet's own font.

To update, download from SIL (https://software.sil.org/andika/download/) or the npm package, and replace the two `.woff2` files.
