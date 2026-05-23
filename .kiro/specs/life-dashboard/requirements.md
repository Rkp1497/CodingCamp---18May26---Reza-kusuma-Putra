# Requirements Document

## Introduction

The Life Dashboard is a client-side web application that serves as a personal productivity hub. It combines a greeting widget, a focus timer, a to-do list, and a quick links panel into a single, clean interface. All data is persisted in the browser's Local Storage with no backend required. The application is built with plain HTML, CSS, and Vanilla JavaScript, and can be used as a standalone web page or browser extension.

## Glossary

- **Dashboard**: The single-page web application that hosts all widgets.
- **Greeting_Widget**: The UI component that displays the current time, date, and a time-based greeting message.
- **Focus_Timer**: The UI component that implements a 25-minute countdown timer with start, stop, and reset controls.
- **Todo_List**: The UI component that manages a collection of tasks with add, edit, complete, and delete operations.
- **Task**: A single to-do item containing a text description and a completion status.
- **Quick_Links**: The UI component that displays a set of user-defined shortcut buttons that open external URLs.
- **Link**: A single quick-link entry containing a label and a URL.
- **Storage**: The browser's Local Storage API used to persist all user data client-side.
- **User**: The person interacting with the Dashboard in a modern web browser.

---

## Technical Constraints

### TC-1: Technology Stack

1. THE Dashboard SHALL be implemented using HTML for structure, CSS for styling, and Vanilla JavaScript for behavior, with no external frameworks or libraries.

### TC-2: Data Storage

2. THE Storage SHALL persist all user-generated data (tasks and links) exclusively in the browser's Local Storage API with no server-side calls.

### TC-3: Browser Compatibility

3. THE Dashboard SHALL function correctly in the latest stable versions of Chrome, Firefox, Edge, and Safari.
4. THE Dashboard SHALL be usable as a standalone web page opened directly in a browser or packaged as a browser extension.

---

## Non-Functional Requirements

### NFR-1: Simplicity

5. THE Dashboard SHALL require no installation, account creation, or configuration before first use.
6. THE Dashboard SHALL be contained in a single HTML file, one CSS file inside `css/`, and one JavaScript file inside `js/`.

### NFR-2: Performance

7. THE Dashboard SHALL render its initial view within 1 second on a modern device with no network dependency.
8. WHEN the User performs any UI interaction (adding a task, clicking a button, etc.), THE Dashboard SHALL reflect the change within 100 milliseconds.

### NFR-3: Visual Design

9. THE Dashboard SHALL present a clean, minimal layout with clear visual hierarchy and readable typography.

---

## Requirements

### Requirement 1: Greeting Widget

**User Story:** As a User, I want to see the current time, date, and a personalized greeting when I open the Dashboard, so that I have immediate context about the time of day.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Greeting_Widget SHALL immediately display the current local time in HH:MM (24-hour) format.
2. WHEN a new minute begins, THE Greeting_Widget SHALL update the displayed time to reflect the current local time in HH:MM format.
3. THE Greeting_Widget SHALL display the current date in the format "Weekday, DD Month YYYY" (e.g., "Monday, 26 May 2025").
4. WHEN the local hour is greater than or equal to 5 and less than 12, THE Greeting_Widget SHALL display the message "Good Morning".
5. WHEN the local hour is greater than or equal to 12 and less than 18, THE Greeting_Widget SHALL display the message "Good Afternoon".
6. WHEN the local hour is greater than or equal to 18 and less than 22, THE Greeting_Widget SHALL display the message "Good Evening".
7. WHEN the local hour is greater than or equal to 22 or less than 5, THE Greeting_Widget SHALL display the message "Good Night".

---

### Requirement 2: Focus Timer

**User Story:** As a User, I want a 25-minute countdown timer with start, stop, and reset controls, so that I can use the Pomodoro technique to manage my focus sessions.

#### Acceptance Criteria

1. THE Focus_Timer SHALL initialize with a countdown value of 25 minutes and 00 seconds (25:00).
2. WHEN the User activates the start control, THE Focus_Timer SHALL begin counting down one second per second from the current displayed remaining time (supporting resume-from-pause).
3. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL display the remaining time in MM:SS format.
4. WHEN the User activates the stop control, THE Focus_Timer SHALL pause the countdown and retain the current remaining time.
5. WHEN the User activates the reset control, THE Focus_Timer SHALL stop any active countdown and restore the display to 25:00.
6. WHEN the countdown reaches 00:00, THE Focus_Timer SHALL stop automatically, display the text "Session complete!" in the timer area, and play a short audible beep to notify the User that the session has ended.
7. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL disable the start control to prevent duplicate timers.
8. WHEN the countdown reaches 00:00, THE Focus_Timer SHALL re-enable the start control so the User can begin a new session after reset.

---

### Requirement 3: To-Do List

**User Story:** As a User, I want to add, edit, complete, and delete tasks that persist across browser sessions, so that I can track my daily responsibilities without losing data on refresh.

#### Acceptance Criteria

1. THE Todo_List SHALL provide an input field and a submit control for the User to add a new Task.
2. WHEN the User submits a non-empty task description of 200 characters or fewer, THE Todo_List SHALL append the new Task to the list and persist it to Storage.
3. IF the User submits an empty or whitespace-only task description, THEN THE Todo_List SHALL reject the submission and display an inline validation message; the validation message SHALL be cleared on the User's next input event.
4. WHEN the User activates the edit control on a Task, THE Todo_List SHALL replace the task text with an editable input field pre-filled with the current task description.
5. WHEN the User confirms an edit with a non-empty description of 200 characters or fewer, THE Todo_List SHALL update the Task text and persist the change to Storage.
6. IF the User confirms an edit with an empty or whitespace-only description, THEN THE Todo_List SHALL reject the update and retain the original task description.
7. WHEN the User activates the complete control on a Task, THE Todo_List SHALL toggle the Task's completion status and persist the change to Storage.
8. WHEN a Task is marked as complete, THE Todo_List SHALL apply strikethrough text styling and reduce the task text opacity to 50% to differentiate it from incomplete tasks.
9. WHEN the User activates the delete control on a Task, THE Todo_List SHALL remove the Task from the list and from Storage.
10. WHEN the Dashboard loads, THE Todo_List SHALL restore all previously saved Tasks from Storage and render them in their last-known state.
11. WHEN the User presses the Escape key while an edit input field is active, THE Todo_List SHALL cancel the edit and restore the original task text without persisting any changes.

---

### Requirement 4: Quick Links

**User Story:** As a User, I want to save and manage shortcut buttons that open my favorite websites, so that I can navigate to frequently visited pages with a single click.

#### Acceptance Criteria

1. THE Quick_Links SHALL provide an input form for the User to enter a link label (maximum 50 characters) and a URL (maximum 2048 characters), and a submit control to save the Link.
2. WHEN the User submits a Link with a non-empty, non-whitespace label of 50 characters or fewer and a URL that, after normalization, begins with `http://` or `https://` followed by at least one non-whitespace character and is 2048 characters or fewer, THE Quick_Links SHALL add a new shortcut button and persist the Link to Storage.
3. IF the User submits a Link with an empty, whitespace-only, or oversized label, or an empty or whitespace-only URL, THEN THE Quick_Links SHALL reject the submission and display an inline validation message.
4. IF the User submits a non-empty URL that does not begin with `http://` or `https://`, THEN THE Quick_Links SHALL prepend `https://` to the URL before applying the validity check in criterion 2.
5. WHEN the User clicks a shortcut button, THE Quick_Links SHALL open the associated URL in a new browser tab.
6. WHEN the User activates the delete control on a Link, THE Quick_Links SHALL remove the shortcut button and delete the Link from Storage.
7. WHEN the Dashboard loads, THE Quick_Links SHALL restore all previously saved Links from Storage and render the corresponding shortcut buttons.

---

### Requirement 5: Data Persistence (Storage)

**User Story:** As a User, I want all my tasks and links to be automatically saved and restored, so that my data is never lost when I close or refresh the browser.

#### Acceptance Criteria

1. WHEN a Task is added, edited, completed, or deleted, THE Storage SHALL serialize the complete current list of Tasks as a JSON string and write it to the Local Storage key `"life-dashboard-tasks"`.
2. WHEN a Link is added or deleted, THE Storage SHALL serialize the complete current list of Links as a JSON string and write it to the Local Storage key `"life-dashboard-links"`.
3. WHEN the Dashboard loads, THE Storage SHALL read the value at `"life-dashboard-tasks"` and the value at `"life-dashboard-links"` from Local Storage, deserialize each JSON string, and provide the resulting arrays to the Todo_List and Quick_Links respectively.
4. IF the Local Storage entry at `"life-dashboard-tasks"` or `"life-dashboard-links"` is absent or contains a string that cannot be parsed as valid JSON, THEN THE Storage SHALL initialize the corresponding list as an empty array and THE Dashboard SHALL continue loading successfully without displaying an error state.
5. WHEN a Task list is serialized to `"life-dashboard-tasks"` and then deserialized from that key, THE resulting array SHALL contain the same number of Tasks in the same order, with each Task having identical `id`, `text`, and `completed` field values as the original.
6. WHEN a Link list is serialized to `"life-dashboard-links"` and then deserialized from that key, THE resulting array SHALL contain the same number of Links in the same order, with each Link having identical `id`, `label`, and `url` field values as the original.
