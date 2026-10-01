# platform Specification

## Purpose

Defines the device, layout, accessibility and code-loading rules every screen follows so the app runs well on the family's Fire HD 10 in Silk.

## Requirements

### Requirement: Fits the tablet without scrolling
Every screen SHALL fit 1280x614 and 800x1094 CSS px with no vertical scroll.

#### Scenario: Landscape
- **GIVEN** the viewport is 1280x614
- **WHEN** any screen is shown
- **THEN** the document scroll height is no more than the viewport height

#### Scenario: Portrait
- **GIVEN** the viewport is 800x1094
- **WHEN** any screen is shown
- **THEN** the document scroll height is no more than the viewport height

### Requirement: Non-motion cues
Every animated cue SHALL have a non-motion equivalent (colour, text or sound), because reduced motion is on.

#### Scenario: Reduced motion
- **GIVEN** prefers-reduced-motion is reduce
- **WHEN** a letter sweep or highlight runs
- **THEN** the current letter or word is shown by a colour change

### Requirement: Tap target size
Child tap targets SHALL be at least 120x120 CSS px (about 2 cm on the tablet), except words inside a sentence (at least 60 px tall) and letters inside a word (at least 120 px tall and 60 px wide); Grown-ups controls SHALL be at least 64x64 CSS px.
(Previously: 64 px for answer targets, with some controls at 46 to 52 px.)

#### Scenario: Lesson buttons
- **WHEN** every child screen is measured at 1280x614 and 800x1094
- **THEN** every element with a data-act attribute is at least 120 px in both dimensions, apart from the sentence-word and letter exceptions

#### Scenario: Grown-ups
- **WHEN** Grown-ups is measured
- **THEN** every control is at least 64 px in both dimensions

### Requirement: Content Security Policy
The page SHALL carry a CSP meta tag with no unsafe-inline or unsafe-eval, and markup SHALL contain no inline scripts, on...= handlers or style attributes.

#### Scenario: CSP violations
- **WHEN** every screen is opened
- **THEN** no CSP violation is reported in the console

### Requirement: Same-site only
The app SHALL make no requests to any host other than its own, including for fonts.
(Previously: no fonts were loaded.)

#### Scenario: Request log
- **WHEN** every screen is opened
- **THEN** every request, including WOFF2 font files, goes to the page's own host

### Requirement: Old-emoji safe
Emoji in the interface SHALL be from Unicode 8 or older.

#### Scenario: Emoji check
- **WHEN** the rendered markup is scanned
- **THEN** no emoji newer than Unicode 8 is present

### Requirement: Classic scripts
The app SHALL load as classic script tags in a fixed order sharing one global, LR, with no build step or runtime dependency.

#### Scenario: Load from GitHub Pages
- **WHEN** the repository root is served as static files
- **THEN** the app starts with no console errors

### Requirement: Clips served from the site
Voice clips SHALL be loaded only from the site's own audio folder, through audio elements.

#### Scenario: Request log
- **WHEN** a session plays clips
- **THEN** every MP3 request goes to the page's own host and no fetch or XHR is made
