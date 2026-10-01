# privacy Specification

## Purpose

Keeps the child's data on the tablet and out of the public repository, with no tracking, accounts or recordings.

## Requirements

### Requirement: Data stays on the tablet
All app data SHALL be stored only in the tablet browser's localStorage and never sent anywhere.

#### Scenario: Network
- **WHEN** a full lesson is completed
- **THEN** no request carries app data and connect-src is 'none'

### Requirement: No personal data collected
The app SHALL NOT ask for or store a child's name, photo, voice, school or age.

#### Scenario: Grown-ups fields
- **WHEN** the Grown-ups screen is inspected
- **THEN** no field asks for personal details

### Requirement: No recordings
The app SHALL NOT record audio and SHALL use only computer-voice speech or computer-generated clips.

#### Scenario: Microphone
- **WHEN** any screen is used
- **THEN** no microphone permission is requested

### Requirement: Grown-ups child lock
The Grown-ups area SHALL be behind a sum question, which is a child lock and not security.

#### Scenario: Wrong answer
- **WHEN** a wrong sum is entered
- **THEN** the settings stay hidden and a gentle message is shown

### Requirement: Parent input is escaped
Text a parent typed SHALL reach the page only escaped or through textContent.

#### Scenario: Markup in a word
- **GIVEN** a word list containing "<img src=x>"
- **WHEN** a lesson renders it
- **THEN** no element is created from it
