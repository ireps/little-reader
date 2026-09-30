# grown-ups Specification

## Purpose

Describes the Grown-ups area where a parent enters the week's content and adjusts settings, as shipped in Phases 0 to 2.

## Requirements

### Requirement: Sum gate
The Grown-ups area SHALL open only after a typed answer to a two-digit sum.

#### Scenario: Right answer
- **WHEN** the right sum is typed and Open is tapped
- **THEN** the settings are shown

### Requirement: Weekly words and story
Grown-ups SHALL let a parent type this week's words and paragraph and save them.

#### Scenario: Save
- **WHEN** words and a paragraph are typed and Save is tapped
- **THEN** the lessons use them

### Requirement: Heart-letter editor
Grown-ups SHALL let a parent toggle heart letters on this week's words.

#### Scenario: Toggle
- **WHEN** a letter of a word is tapped
- **THEN** its heart mark toggles in every lesson

### Requirement: Voice and speed
Grown-ups SHALL let a parent choose the voice and a speed from 0.5 to 1.1, and test it.

#### Scenario: Speed
- **WHEN** the speed is changed
- **THEN** it is saved and used for all speech

### Requirement: Help words and mix-ups
Grown-ups SHALL list words she needed help with and her Word detective mix-ups, with a Clear list button.

#### Scenario: Clear
- **WHEN** Clear list is tapped
- **THEN** the help-word counts and the mix-ups are removed
