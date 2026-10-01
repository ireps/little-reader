## MODIFIED Requirements

### Requirement: Data stays on the tablet
All app data SHALL be stored only in the tablet browser's localStorage, leaving it only as a backup file a grown-up chooses to save.
(Previously: there was no backup file.)

#### Scenario: Network
- **WHEN** a full session is completed
- **THEN** no request carries app data and connect-src is 'none'

#### Scenario: Backup
- **WHEN** a grown-up saves a backup
- **THEN** the file is created on the tablet with no network request

### Requirement: Grown-ups child lock
The Grown-ups area SHALL be behind a 2 s hold and a tapped sum, which is a child lock and not security.
(Previously: a typed sum.)

#### Scenario: Wrong answer
- **WHEN** a wrong sum is tapped
- **THEN** the settings stay hidden and a new sum is shown

### Requirement: Parent input is escaped
Text from a restored backup or built-in content SHALL reach the page only escaped or through textContent.
(Previously: this covered typed words and paragraphs.)

#### Scenario: Markup in a word
- **GIVEN** a backup containing a word "<img src=x>"
- **WHEN** it is restored and shown
- **THEN** the word is dropped by validation and no element is created from it

## ADDED Requirements

### Requirement: Backups stay private
Backup files SHALL contain progress only (no name or personal details) and SHALL never be committed to the repository.

#### Scenario: Backup contents
- **WHEN** a backup is inspected
- **THEN** it holds only the schema-2 fields and the app marker

#### Scenario: Git ignore
- **WHEN** a file named *.littlereader.json is in the working tree
- **THEN** git ignores it
