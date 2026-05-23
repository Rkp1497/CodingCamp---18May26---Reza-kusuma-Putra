# Implementation Plan: Life Dashboard

## Overview

Implement a single-page, client-side productivity dashboard using plain HTML, CSS, and Vanilla JavaScript. The application is structured as one HTML file, one CSS file (`css/style.css`), and one JavaScript file (`js/app.js`) using the IIFE/factory pattern. Four independent widgets (Greeting, Focus Timer, To-Do List, Quick Links) share a common `Storage` utility backed by `localStorage`.

---

## Tasks

- [-] 1. Set up project structure and HTML skeleton
  - Create `index.html` with semantic sections for each widget: Greeting, Focus Timer, To-Do List, Quick Links
  - Create `css/style.css` with base reset, layout grid, and widget card styles
  - Create `js/app.js` with a top-level IIFE wrapper and placeholder factory stubs for `Storage`, `Greeting`, `Timer`, `Todo`, and `Links`
  - Wire `DOMContentLoaded` to call each widget's `init()` in sequence
  - _Requirements: NFR-1, TC-1, TC-3_

- [ ] 2. Implement Storage utility
  - [x] 2.1 Implement `Storage.load(key)` and `Storage.save(key, data)`
    - `load` wraps `JSON.parse` in `try/catch`; returns `[]` on missing key or invalid JSON
    - `save` calls `JSON.stringify` and writes to `localStorage`; wraps in `try/catch` for quota/security errors
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [-] 2.2 Write property test for Task serialization round-trip (Property 1)
    - **Property 1: Task serialization round-trip**
    - Use fast-check to generate random `Task[]` arrays (random id, text 1–200 chars, random boolean)
    - Assert `Storage.load` after `Storage.save` deep-equals the original array
    - Tag: `// Feature: life-dashboard, Property 1: Task serialization round-trip`
    - **Validates: Requirements 5.5**

  - [-] 2.3 Write property test for Link serialization round-trip (Property 2)
    - **Property 2: Link serialization round-trip**
    - Use fast-check to generate random `Link[]` arrays (random id, label 1–50 chars, valid url)
    - Assert `Storage.load` after `Storage.save` deep-equals the original array
    - Tag: `// Feature: life-dashboard, Property 2: Link serialization round-trip`
    - **Validates: Requirements 5.6**

  - [-] 2.4 Write unit tests for Storage utility
    - Test: missing key returns `[]`
    - Test: invalid JSON returns `[]`
    - Test: valid JSON returns parsed array
    - Test: save then load round-trip with a mock `localStorage`
    - _Requirements: 5.3, 5.4_

- [~] 3. Checkpoint — Storage layer complete
  - Ensure all Storage unit tests and property tests pass, ask the user if questions arise.

- [ ] 4. Implement Greeting Widget
  - [-] 4.1 Implement pure helper functions: `getGreeting(hour)`, `formatTime(date)`, `formatDate(date)`
    - `getGreeting`: hour 5–11 → "Good Morning", 12–17 → "Good Afternoon", 18–21 → "Good Evening", 22–23/0–4 → "Good Night"
    - `formatTime`: returns `"HH:MM"` in 24-hour format
    - `formatDate`: returns `"Weekday, DD Month YYYY"` (e.g., "Monday, 26 May 2025")
    - _Requirements: 1.1, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [~] 4.2 Implement `Greeting.init()` and `Greeting.render(date)`
    - `init` calls `render(new Date())` immediately, then schedules `setInterval` every 60 seconds
    - `render` updates the time, date, and greeting DOM elements
    - _Requirements: 1.1, 1.2_

  - [~] 4.3 Write property test for greeting exhaustiveness (Property 8)
    - **Property 8: Greeting covers all hours**
    - Use fast-check to generate integers 0–23
    - Assert result is one of the four greeting strings and no hour is unhandled
    - Tag: `// Feature: life-dashboard, Property 8: Greeting covers all hours`
    - **Validates: Requirements 1.4, 1.5, 1.6, 1.7**

  - [~] 4.4 Write unit tests for Greeting helper functions
    - Test `getGreeting` at all boundary values: 0, 4, 5, 11, 12, 17, 18, 21, 22, 23
    - Test `formatTime` at midnight, noon, single-digit hours/minutes
    - Test `formatDate` for weekday names and day/month zero-padding
    - _Requirements: 1.1, 1.3, 1.4, 1.5, 1.6, 1.7_

- [ ] 5. Implement Focus Timer Widget
  - [-] 5.1 Implement pure helper function `formatCountdown(seconds)`
    - Returns `"MM:SS"` with zero-padded minutes and seconds
    - _Requirements: 2.3_

  - [~] 5.2 Implement `Timer.init()`, `Timer.start()`, `Timer.stop()`, `Timer.reset()`, `Timer.tick()`
    - State: `remaining` (starts at 1500), `intervalId` (null when paused), `running` (boolean)
    - `start`: begins/resumes countdown via `setInterval(tick, 1000)`; disables start button
    - `stop`: clears interval, sets `running = false`; retains `remaining`
    - `reset`: calls `stop()`, restores `remaining = 1500`, updates display to "25:00", re-enables start button
    - `tick`: decrements `remaining`, updates DOM; when `remaining === 0` calls `stop()`, displays "Session complete!", plays Web Audio beep (wrapped in `try/catch`)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [~] 5.3 Write property test for countdown format (Property 9)
    - **Property 9: Countdown format is always MM:SS**
    - Use fast-check to generate integers 0–1500
    - Assert result matches `/^\d{2}:\d{2}$/`
    - Tag: `// Feature: life-dashboard, Property 9: Countdown format is always MM:SS`
    - **Validates: Requirements 2.3**

  - [~] 5.4 Write unit tests for Focus Timer
    - Test `formatCountdown` at 1500 (25:00), 0 (00:00), 59 (00:59), 600 (10:00)
    - Test `start` disables start button; `stop` retains remaining; `reset` restores 1500
    - Test session-complete behavior at `remaining === 0`
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6, 2.7, 2.8_

- [~] 6. Checkpoint — Timer and Greeting complete
  - Ensure all Greeting and Timer unit tests and property tests pass, ask the user if questions arise.

- [ ] 7. Implement To-Do List Widget
  - [~] 7.1 Implement pure helper function `isValidTaskText(text)`
    - Returns `true` iff `text.trim().length > 0 && text.trim().length <= 200`
    - _Requirements: 3.2, 3.3, 3.5, 3.6_

  - [~] 7.2 Write property test for whitespace task rejection (Property 3)
    - **Property 3: Task text validation rejects whitespace-only input**
    - Use fast-check to generate strings composed entirely of whitespace characters
    - Assert `isValidTaskText(s) === false`
    - Tag: `// Feature: life-dashboard, Property 3: Task text validation rejects whitespace-only input`
    - **Validates: Requirements 3.3, 3.6**

  - [~] 7.3 Write property test for valid task text acceptance (Property 4)
    - **Property 4: Valid task text is accepted**
    - Use fast-check to generate non-empty strings ≤ 200 chars with at least one non-whitespace character
    - Assert `isValidTaskText(s) === true`
    - Tag: `// Feature: life-dashboard, Property 4: Valid task text is accepted`
    - **Validates: Requirements 3.2, 3.5**

  - [~] 7.4 Implement `Todo.init(tasks)`, `Todo.addTask(text)`, `Todo.render()`, and `Todo.persist()`
    - `init`: stores tasks array in memory, calls `render()`
    - `addTask`: validates with `isValidTaskText`; on failure shows inline validation message (cleared on next `input` event); on success appends `{id, text, completed: false}`, calls `render()` and `persist()`
    - `render`: full re-render of task list DOM; completed tasks get strikethrough + 50% opacity
    - `persist`: calls `Storage.save("life-dashboard-tasks", tasks)`
    - _Requirements: 3.1, 3.2, 3.3, 3.8, 3.10, 5.1_

  - [~] 7.5 Implement `Todo.editTask(id, newText)`, `Todo.toggleTask(id)`, `Todo.deleteTask(id)`
    - `editTask`: replaces task `<li>` with pre-filled `<input>`; Enter confirms (validates, updates, persists), Escape cancels (restores original, removes keydown listener); rejects empty/whitespace edits per 3.6
    - `toggleTask`: flips `completed`, calls `render()` and `persist()`
    - `deleteTask`: removes task from array, calls `render()` and `persist()`
    - Use event delegation on list container with `data-action` attributes
    - _Requirements: 3.4, 3.5, 3.6, 3.7, 3.9, 3.11, 5.1_

  - [~] 7.6 Write property test for task toggle involution (Property 5)
    - **Property 5: Task toggle is an involution (round-trip)**
    - Use fast-check to generate a random task list and random task index
    - Assert toggling twice restores original `completed` value and list length is unchanged
    - Tag: `// Feature: life-dashboard, Property 5: Task toggle is an involution`
    - **Validates: Requirements 3.7**

  - [~] 7.7 Write unit tests for To-Do List widget
    - Test `isValidTaskText` at empty string, whitespace-only, 200-char boundary, 201-char
    - Test `addTask` / `editTask` / `toggleTask` / `deleteTask` verify in-memory state and `Storage.save` call count
    - Test Escape key cancels edit without persisting
    - _Requirements: 3.1–3.11, 5.1_

- [~] 8. Checkpoint — To-Do List complete
  - Ensure all To-Do List unit tests and property tests pass, ask the user if questions arise.

- [ ] 9. Implement Quick Links Widget
  - [~] 9.1 Implement pure helper functions `normalizeUrl(url)`, `isValidUrl(url)`, `isValidLabel(label)`
    - `normalizeUrl`: prepends `"https://"` if url does not start with `"http://"` or `"https://"`
    - `isValidUrl`: returns `true` iff normalized url starts with `http://` or `https://` followed by ≥1 non-whitespace char, and length ≤ 2048
    - `isValidLabel`: returns `true` iff `label.trim().length > 0 && label.trim().length <= 50`
    - _Requirements: 4.2, 4.3, 4.4_

  - [~] 9.2 Write property test for URL normalization idempotence (Property 6)
    - **Property 6: URL normalization idempotence**
    - Use fast-check to generate URLs already starting with `http://` or `https://`
    - Assert `normalizeUrl(url) === url`
    - Tag: `// Feature: life-dashboard, Property 6: URL normalization idempotence`
    - **Validates: Requirements 4.4**

  - [~] 9.3 Write property test for URL normalization prepends https (Property 7)
    - **Property 7: URL normalization prepends https**
    - Use fast-check to generate strings not starting with `http://` or `https://`
    - Assert `normalizeUrl(s).startsWith("https://")`
    - Tag: `// Feature: life-dashboard, Property 7: URL normalization prepends https`
    - **Validates: Requirements 4.4**

  - [~] 9.4 Write property test for label validation (Property 10)
    - **Property 10: Label validation rejects whitespace-only and oversized input**
    - Use fast-check to generate whitespace-only strings and strings with trimmed length > 50
    - Assert `isValidLabel(s) === false`
    - Tag: `// Feature: life-dashboard, Property 10: Label validation rejects whitespace-only and oversized input`
    - **Validates: Requirements 4.3**

  - [~] 9.5 Implement `Links.init(links)`, `Links.addLink(label, url)`, `Links.deleteLink(id)`, `Links.render()`, `Links.persist()`
    - `init`: stores links array in memory, calls `render()`
    - `addLink`: normalizes url, validates label and url; on failure shows inline validation message; on success appends `{id, label, url}`, calls `render()` and `persist()`
    - `deleteLink`: removes link from array, calls `render()` and `persist()`
    - `render`: renders shortcut buttons as `<a target="_blank" rel="noopener noreferrer">` tags; binds delete controls via event delegation
    - `persist`: calls `Storage.save("life-dashboard-links", links)`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 5.2_

  - [~] 9.6 Write unit tests for Quick Links widget
    - Test `normalizeUrl` for already-prefixed (idempotent), bare domain, empty string
    - Test `isValidUrl` for http/https prefixed, bare domain, empty, oversized
    - Test `isValidLabel` at empty, whitespace, 50-char boundary, 51-char
    - Test `addLink` / `deleteLink` verify in-memory state and `Storage.save` call count
    - _Requirements: 4.1–4.7, 5.2_

- [~] 10. Checkpoint — Quick Links complete
  - Ensure all Quick Links unit tests and property tests pass, ask the user if questions arise.

- [ ] 11. Wire everything together and apply visual styling
  - [~] 11.1 Complete `DOMContentLoaded` initialization in `js/app.js`
    - Call `Storage.load` for both keys, pass results to `Todo.init` and `Links.init`
    - Call `Greeting.init()` and `Timer.init()` in sequence
    - _Requirements: 5.3, 3.10, 4.7, 1.1_

  - [~] 11.2 Apply CSS layout and widget styles in `css/style.css`
    - Implement responsive grid layout for four widget cards
    - Style completed tasks with strikethrough and 50% opacity
    - Style inline validation messages adjacent to input fields
    - Ensure clean, minimal visual hierarchy per NFR-3
    - _Requirements: NFR-3, 3.8_

- [ ] 12. Write integration tests with Playwright
  - [~] 12.1 Write smoke test: all four widgets render without JS errors
    - Load `index.html` in headless browser; assert no console errors and all widget containers are visible
    - _Requirements: NFR-1, TC-3_

  - [~] 12.2 Write integration test: To-Do List localStorage round-trip
    - Add a task, reload the page, assert the task is still present
    - _Requirements: 3.10, 5.3, 5.5_

  - [~] 12.3 Write integration test: Quick Links localStorage round-trip
    - Add a link, reload the page, assert the shortcut button is still present
    - _Requirements: 4.7, 5.3, 5.6_

  - [~] 12.4 Write integration test: corrupt localStorage graceful degradation
    - Set `localStorage["life-dashboard-tasks"]` to `"not-json"`, reload, assert page loads without error and task list is empty
    - _Requirements: 5.4_

- [~] 13. Final checkpoint — Ensure all tests pass
  - Ensure all unit tests, property tests, and integration tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at each widget boundary
- Property tests use **fast-check** and run a minimum of 100 iterations each
- Unit tests use a mock `localStorage` object to avoid real browser dependency
- Integration tests use **Playwright** against the real `index.html` in a headless browser
- All `localStorage` and `AudioContext` calls are wrapped in `try/catch` for silent degradation

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1"] },
    { "id": 1, "tasks": ["2.2", "2.3", "2.4", "4.1", "5.1"] },
    { "id": 2, "tasks": ["4.2", "4.3", "4.4", "5.2", "7.1", "9.1"] },
    { "id": 3, "tasks": ["5.3", "5.4", "7.2", "7.3", "9.2", "9.3", "9.4"] },
    { "id": 4, "tasks": ["7.4", "9.5"] },
    { "id": 5, "tasks": ["7.5", "7.6", "9.6"] },
    { "id": 6, "tasks": ["7.7", "11.1"] },
    { "id": 7, "tasks": ["11.2"] },
    { "id": 8, "tasks": ["12.1", "12.2", "12.3", "12.4"] }
  ]
}
```
