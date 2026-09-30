# speech Specification

## Purpose

Defines how the app speaks: which voice it picks, the clip hook, and the guarantee that speech never blocks the app.

## Requirements

### Requirement: Clip first, else tablet voice
Speech SHALL play a clip listed in LR.clips when one exists, and otherwise use the tablet's text-to-speech.

#### Scenario: No clips
- **GIVEN** LR.clips is undefined
- **WHEN** a word is spoken
- **THEN** speechSynthesis speaks it

### Requirement: Voice choice
Without a saved choice, the app SHALL prefer a female English voice in the order en-IN, en-GB, en-US, then any English voice.

#### Scenario: One voice
- **GIVEN** the tablet has only "English United States" (en_US)
- **WHEN** a voice is chosen
- **THEN** that voice is used, with the lang normalised to en-US

### Requirement: Speech always settles
Every speech request SHALL resolve, whether it ends, errors or times out.

#### Scenario: End event never fires
- **GIVEN** the browser never fires onend
- **WHEN** a word is spoken
- **THEN** the promise resolves after the timeout and the lesson carries on

### Requirement: New action stops old speech
Starting a new action SHALL cancel speech and highlights from the previous one.

#### Scenario: Tap mid-sentence
- **WHEN** a word is tapped while a sentence is being read
- **THEN** the sentence stops and the word is spoken
