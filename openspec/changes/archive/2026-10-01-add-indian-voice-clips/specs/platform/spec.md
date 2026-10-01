## ADDED Requirements

### Requirement: Clips served from the site
Voice clips SHALL be loaded only from the site's own audio folder, through audio elements.

#### Scenario: Request log
- **WHEN** a session plays clips
- **THEN** every MP3 request goes to the page's own host and no fetch or XHR is made
