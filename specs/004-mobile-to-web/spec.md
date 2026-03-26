# Feature Specification: Pomp Web — Platform Migration to Browser-Based App

**Feature Branch**: `004-mobile-to-web`
**Created**: 2026-03-26
**Status**: Draft
**Input**: User description: "Translate the Pomp gym workout tracker from a React Native/Expo mobile app to a web app."

## Purpose

Pomp currently runs exclusively as a native mobile app. This feature migrates the entire product to a web application accessible via any modern browser on desktop, tablet, and mobile — without requiring app store installation. All existing functionality is preserved; UX patterns are adapted to suit pointer, keyboard, and multi-viewport interactions.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Account Access via Browser (Priority: P1)

A user opens Pomp in a browser for the first time, registers with email and password, and is taken to the dashboard. A returning user visits the URL and is already signed in (session persisted across tab closes).

**Why this priority**: Authentication is the gateway to all data. Without it, nothing else can be demonstrated. Browser-based session persistence replaces the native app's automatic sign-in on reopen.

**Independent Test**: Open the app in an incognito browser tab, register a new account, close the tab, reopen the URL in a regular tab — confirm the user lands on the dashboard without signing in again (if a prior session exists), or is prompted to sign in if no session exists.

**Acceptance Scenarios**:

1. **Given** a visitor opens the web app URL, **When** the page loads, **Then** they see a sign-in screen with options to sign in or create an account.
2. **Given** a new user submits a valid email and password, **When** registration completes, **Then** they land on the main dashboard and a confirmation email is sent.
3. **Given** a signed-in user closes the browser and reopens the URL later, **When** the page loads, **Then** their session is restored and they land on the dashboard.
4. **Given** a user provides incorrect credentials, **When** they submit, **Then** a clear error message is displayed; no session data is exposed.
5. **Given** a signed-in user clicks sign out, **When** confirmed, **Then** the session ends and they are returned to the sign-in screen.

---

### User Story 2 — Logging a Workout Session at the Gym (Priority: P1)

A gym-goer opens Pomp on their phone's browser (or tablet), picks a routine, and logs each set with weight and reps in real time. The interface is usable one-handed while standing at a barbell.

**Why this priority**: Real-time workout logging is the core value of the app. Every other feature supports it. The web UI must be at least as fast and ergonomic as the native app on small touchscreens.

**Independent Test**: On a smartphone browser, start a session from a routine with 3 exercises and 4 sets each. Log all 12 sets including weights and reps, mark them complete, and end the session. Confirm the session appears immediately in history.

**Acceptance Scenarios**:

1. **Given** the user taps Start on a routine from any device, **When** the session opens, **Then** all exercises and set rows are visible immediately without additional taps, with previous session values shown as placeholder text.
2. **Given** the user taps a weight or reps field, **When** the keyboard opens (on mobile browser), **Then** the field is scrolled into view and entry is unobstructed.
3. **Given** a set is filled in and the user confirms it, **When** the set is marked complete, **Then** it is visually distinguished from pending sets immediately.
4. **Given** the user navigates away accidentally mid-session, **When** they return to the app URL, **Then** the in-progress session is shown and the user can resume logging.
5. **Given** the user taps End session and confirms, **When** the action completes, **Then** the session is saved and the user is returned to the home screen showing the new entry at the top.
6. **Given** the user wants to discard a session started by mistake, **When** they confirm the abort action, **Then** all sets and the session record are deleted with no trace in history.

---

### User Story 3 — Managing Routines and Exercises on Desktop (Priority: P2)

A user opens Pomp in a desktop browser to plan their training week. They create and edit routines using keyboard navigation and a mouse, which is faster than on a phone.

**Why this priority**: Desktop usage unlocks a broader audience and is ideal for setup tasks like building routines. It also validates the responsive layout at wide viewports.

**Independent Test**: On a 1280px-wide browser, create a routine with 5 exercises using only keyboard and mouse, reorder two exercises via drag-and-drop or equivalent pointer interaction, rename the routine, and save — confirm all changes persist.

**Acceptance Scenarios**:

1. **Given** a user on desktop views the routine list, **When** they click New routine, **Then** a form opens that is navigable by Tab and completable without a mouse.
2. **Given** the routine editor is open on a wide screen, **When** exercises are added, **Then** the layout uses available horizontal space efficiently (e.g., side-by-side panels or expanded columns rather than a single narrow column).
3. **Given** a user wants to reorder exercises in a routine, **When** they drag a row or use an up/down control, **Then** the order updates immediately.
4. **Given** a user hovers over an interactive element on desktop, **When** the cursor is positioned over it, **Then** a visible hover state confirms it is interactive.

---

### User Story 4 — Reviewing Workout History and Statistics on Any Device (Priority: P2)

A user opens the history list and statistics charts on a tablet or desktop after a training block to review progress. Charts and data tables display clearly at wider viewports.

**Why this priority**: History and statistics are the review layer that provides long-term value. They must be as readable on a 1024pt-wide tablet as on a 375pt phone screen.

**Independent Test**: With 10+ completed sessions, open statistics on a 768px-wide tablet browser — confirm all charts render, the exercise picker is usable, and aggregate stats are visible without horizontal scrolling.

**Acceptance Scenarios**:

1. **Given** a user opens the history list on a tablet, **When** the list renders, **Then** sessions are displayed in a layout that makes efficient use of the wider screen (e.g., multi-column or a master-detail pattern).
2. **Given** a user views statistics charts on a desktop, **When** charts render, **Then** they scale to fill the available width without distortion or overflow.
3. **Given** a user selects an exercise in the statistics exercise picker, **When** the picker opens, **Then** it is navigable by typing a search term with keyboard.
4. **Given** a user views the history detail for a session, **When** the detail is open, **Then** all exercises and sets are visible in a readable layout at any supported viewport width.

---

### User Story 5 — Deep-linkable URLs and Browser Navigation (Priority: P3)

A user can share or bookmark a specific page (e.g., history detail or statistics for an exercise), use the browser's back button naturally, and refresh the page without losing their view.

**Why this priority**: URL-based navigation is a web-native expectation. Without it, the app feels broken compared to native web standards, and power users can't bookmark or share deep links.

**Independent Test**: Navigate to a session detail page, copy the URL, open it in a new tab — confirm the same session detail loads. Press the browser Back button — confirm it returns to the history list.

**Acceptance Scenarios**:

1. **Given** a user is on the history detail page for a session, **When** they copy the URL and open it in a new browser tab, **Then** the same session detail is shown.
2. **Given** the user navigates forward several pages, **When** they press the browser Back button, **Then** they move back through the navigation history as expected.
3. **Given** a user is on any page and presses browser Refresh, **When** the page reloads, **Then** the same view renders (if the user is still authenticated).

---

### Edge Cases

- What happens if the user is on a phone browser and the virtual keyboard pushes the viewport up? The active input field must remain visible and the page must not overflow horizontally.
- What happens if the user opens the app on a very wide desktop viewport (>1400px)? Content areas are constrained to a maximum readable width; they do not stretch to fill the full screen.
- What happens if the user disables JavaScript in their browser? The app displays a clear message that JavaScript is required; no broken UI is shown.
- What happens if the user refreshes the page during an active workout session? The session is preserved and re-rendered from stored state.
- What happens when the browser's back button is pressed during an active workout session? A confirmation dialog warns that leaving will not discard the session (it remains resumable).
- What happens on a browser with no support for the required features (e.g., very old IE)? The app shows a clear browser compatibility warning.

---

## Requirements *(mandatory)*

### Functional Requirements

**Platform & Access**

- **FR-001**: The application MUST be accessible via a URL in any modern browser without installation.
- **FR-002**: The application MUST support the three major evergreen browsers: Chrome, Firefox, and Safari.
- **FR-003**: The application MUST function correctly on mobile browsers at viewport widths from 375px to 430px.
- **FR-004**: The application MUST function correctly on tablet browsers at viewport widths from 600px to 1024px.
- **FR-005**: The application MUST function correctly on desktop browsers at viewport widths from 1024px to 1920px.

**Authentication**

- **FR-006**: Users MUST be able to register, sign in, and sign out via the web interface (carrying over from FR-001–005 in 001-workout-log spec).
- **FR-007**: Authenticated sessions MUST persist across browser tab closes and page refreshes.
- **FR-008**: Unauthenticated users MUST be redirected to the sign-in page when accessing protected routes.

**Navigation & Routing**

- **FR-009**: Every major view (dashboard/home, routines, exercises, active workout, history, statistics) MUST have a unique, bookmarkable URL.
- **FR-010**: The browser Back and Forward buttons MUST navigate through view history as expected.
- **FR-011**: Refreshing the page at any URL MUST render the correct view (if the user is authenticated).
- **FR-012**: A primary navigation structure (e.g., top navigation bar or sidebar on desktop, bottom navigation bar on mobile) MUST be visible and accessible from all main views.

**Feature Parity with Mobile App**

- **FR-013**: All features defined in specs 001-workout-log, 002-ux-improvements-backlog, and 003-exercise-stats-ux MUST be available in the web version.
- **FR-014**: The active workout screen MUST show the full routine layout (all exercises and set rows) at all supported viewport widths, without requiring horizontal scrolling within the session view.
- **FR-015**: Users MUST be able to log sets, mark them complete, and end a session entirely from a mobile browser without requiring a native app.

**Responsive Layout**

- **FR-016**: On desktop viewports (≥1024px), the layout MUST make productive use of available horizontal space (e.g., side-by-side panels for routine editor, wider statistics charts).
- **FR-017**: On mobile viewports (<600px), the layout MUST mirror the clarity and ergonomics of the native mobile app — touch targets MUST be at minimum 44×44 CSS pixels.
- **FR-018**: Content areas MUST be constrained to a maximum width (e.g., 1200px) and centred on very wide viewports to maintain readability.

**Web-native Interaction Patterns**

- **FR-019**: Hover states MUST be present on all interactive elements when a pointing device is detected.
- **FR-020**: All interactive elements MUST be keyboard-focusable and operable via keyboard (Tab, Enter, Space, arrow keys where appropriate).
- **FR-021**: Focus indicators MUST be visible for all focusable elements to support keyboard navigation.
- **FR-022**: Destructive actions (delete routine, abort session, delete set) triggered by right-click context menu or dedicated button MUST replace mobile long-press patterns.

**Performance**

- **FR-023**: The initial page load (first paint of the sign-in or dashboard screen) MUST complete within 3 seconds on a standard broadband connection.
- **FR-024**: Navigating between views MUST feel instantaneous (no full page reload on internal navigation).

### Key Entities

*(Unchanged from spec 001-workout-log — User, Exercise, Routine, Session, SessionExercise, Set)*

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time user on a desktop browser can register, create a routine, and log their first set in under 4 minutes.
- **SC-002**: A returning user on a smartphone browser can start a workout session from the home screen within 2 taps and 5 seconds.
- **SC-003**: All major views render without layout breakage at 375px, 768px, and 1280px viewport widths.
- **SC-004**: The active workout screen on a mobile browser is fully operable with one hand — no element requires reaching beyond the thumb zone.
- **SC-005**: 100% of sessions explicitly ended by the user are persisted; no data loss occurs on page refresh or tab close.
- **SC-006**: History and statistics load within 2 seconds for users with up to 200 completed sessions.
- **SC-007**: All interactive elements meet a minimum touch/click target of 44×44 CSS pixels.
- **SC-008**: Keyboard users can complete the full core workflow (sign in → start session → log set → end session) without using a mouse.
- **SC-009**: The app achieves a Lighthouse Accessibility score of ≥ 90 on the dashboard and active workout views.
- **SC-010**: All user-facing text remains in Norwegian (Bokmål).

---

## Assumptions

- The Supabase backend (auth, database, RLS policies) is reused without changes; only the frontend platform changes.
- The existing data model (User, Exercise, Routine, Session, SessionExercise, Set) is not altered.
- An internet connection is required for all data operations; offline mode is out of scope.
- Only one session can be active per user at a time (unchanged from mobile spec).
- The dark theme (Midnight Teal) and Norwegian language are preserved in the web version.
- Landscape support on mobile browser is a nice-to-have but not a hard requirement for v1 web.
- Native mobile-specific features (push notifications, haptic feedback) are out of scope for the web version.
- The web app replaces (not supplements) the native mobile app — native app development is paused in favour of the web version.
- Weight is always expressed in kilograms (kg); unit switching remains out of scope.
