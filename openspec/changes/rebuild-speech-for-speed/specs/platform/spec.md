## MODIFIED Requirements

### Requirement: Tap target size
Child tap targets SHALL be at least 120x120 CSS px (about 2 cm on the tablet); Grown-ups controls SHALL be at least 64x64 CSS px.
(Previously: 64 px for answer targets, with some controls at 46 to 52 px.)

#### Scenario: Lesson buttons
- **WHEN** every child screen is measured at 1280x614 and 800x1094
- **THEN** every element with a data-act attribute is at least 120 px in both dimensions

#### Scenario: Grown-ups
- **WHEN** Grown-ups is measured
- **THEN** every control is at least 64 px in both dimensions

### Requirement: Same-site only
The app SHALL make no requests to any host other than its own, including for fonts.
(Previously: no fonts were loaded.)

#### Scenario: Request log
- **WHEN** every screen is opened
- **THEN** every request, including WOFF2 font files, goes to the page's own host
