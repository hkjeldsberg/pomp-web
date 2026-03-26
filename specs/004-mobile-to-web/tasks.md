# Tasks: Pomp Web — Platform Migration

**Input**: Design documents from `/specs/004-mobile-to-web/`
**Prerequisites**: plan.md ✅, spec.md ✅

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US5)
- All paths are relative to the repository root

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Scaffold the Next.js web project and configure all tooling

- [x] T001 Initialize Next.js 15 App Router project (replace Expo entry point): update `package.json`, create `next.config.ts`, remove `expo-router/entry` main entry
- [x] T002 Configure TypeScript strict mode for web in `tsconfig.json` (target `es2022`, `moduleResolution: bundler`, `strict: true`)
- [x] T003 [P] Extend Tailwind CSS config with Midnight Teal palette and responsive breakpoints (375/768/1280) in `tailwind.config.js`
- [x] T004 [P] Configure Jest + React Testing Library for Next.js in `jest.config.js` (use `next/jest` preset, jsdom environment)
- [x] T005 [P] Configure Playwright for e2e integration tests in `playwright.config.ts` (target localhost:3000, browsers: chromium, firefox, webkit)
- [x] T006 [P] Create `.env.local` schema and `lib/supabase/env.ts` for typed Supabase env vars (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before any user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Create Supabase browser client using `@supabase/ssr` in `lib/supabase/client.ts` (replaces `AsyncStorage`-based mobile client)
- [x] T008 Create Supabase server client for middleware and React Server Components in `lib/supabase/server.ts`
- [x] T009 [P] Audit and migrate `lib/db/` files to web (exercises.ts, routines.ts, sessions.ts, sets.ts, statistics.ts) — remove any React Native imports, ensure all return typed promises
- [x] T010 [P] Audit and migrate `lib/hooks/` files to web (useRoutines, useSession, useStatistics, useExercises) — replace RN-specific APIs with standard React; confirm no `expo-*` imports remain
- [x] T011 [P] Audit and copy `lib/utils/` files to web (format.ts, statistics.ts with IQR filter) — no changes expected, verify no RN imports
- [x] T012 Create Next.js auth middleware for route protection in `middleware.ts` (redirect unauthenticated requests to `/login`; allow `/login` and `/register` publicly)
- [x] T013 Create root layout with Supabase session provider in `app/layout.tsx` (fonts, global CSS, session context)
- [x] T014 Create shared UI component library in `components/ui/`: Button.tsx, Input.tsx, Modal.tsx, ContextMenu.tsx, Badge.tsx (all keyboard-accessible, 44px min touch targets, visible focus rings)
- [x] T015 [P] Create navigation shell layout components in `components/layout/`: Navbar.tsx (desktop top bar), BottomNav.tsx (mobile ≤768px fixed bottom), Sidebar.tsx (desktop ≥1024px optional)
- [x] T016 Create Shell layout wrapper in `components/layout/Shell.tsx` (max-width 1200px centered; switches between BottomNav on mobile and Navbar on desktop based on viewport)
- [x] T017 Create protected app layout in `app/(app)/layout.tsx` wrapping Shell with auth guard and primary navigation links (Home, Routines, Exercises, Statistics)

**Checkpoint**: Foundation ready — auth, routing, nav shell, UI primitives, and DB layer all in place

---

## Phase 3: User Story 1 — Account Access via Browser (Priority: P1) 🎯 MVP

**Goal**: Users can register, sign in, and maintain a persistent session entirely in the browser

**Independent Test**: Open the app in an incognito tab, register with a new email, close the tab, reopen the URL in a regular tab — session is restored and the user lands on the dashboard

### Tests for User Story 1

- [x] T018 [P] [US1] Write component tests for LoginForm (renders, submits, shows validation errors) in `__tests__/components/auth/LoginForm.test.tsx`
- [x] T019 [P] [US1] Write component tests for RegisterForm (renders, submits, shows error on duplicate email) in `__tests__/components/auth/RegisterForm.test.tsx`
- [x] T020 [US1] Write Playwright integration test for full auth flow (register → sign out → sign in → redirect) in `__tests__/integration/auth.spec.ts`

### Implementation for User Story 1

- [x] T021 [P] [US1] Create LoginForm component (email + password fields, submit, error display) in `components/auth/LoginForm.tsx`
- [x] T022 [P] [US1] Create RegisterForm component (email + password + confirm, submit, validation) in `components/auth/RegisterForm.tsx`
- [x] T023 [US1] Create sign-in page using LoginForm in `app/(auth)/login/page.tsx`
- [x] T024 [US1] Create register page using RegisterForm in `app/(auth)/register/page.tsx`
- [x] T025 [US1] Implement cookie-based Supabase session persistence: update `lib/supabase/client.ts` to use `createBrowserClient` and `lib/supabase/server.ts` to use `createServerClient` with cookie handling
- [x] T026 [US1] Implement sign-out action and redirect to `/login` (add to Navbar/BottomNav user menu) in `components/layout/Navbar.tsx`
- [x] T027 [US1] Verify auth redirect loop is guarded: unauthenticated → `/login`, authenticated visiting `/login` → `/` (update `middleware.ts`)

**Checkpoint**: User Story 1 complete — registration, sign-in, session persistence, and sign-out all work in browser

---

## Phase 4: User Story 2 — Logging a Workout Session (Priority: P1)

**Goal**: Users can start a session from a routine, log sets one-handed on a mobile browser, mark them complete, and end or abort — with the session resumable on page refresh

**Independent Test**: On a smartphone browser, start a session from a routine with 3 exercises (4 sets each), log all 12 sets with weight and reps, end the session — it appears at the top of the history list immediately

### Tests for User Story 2

- [x] T028 [P] [US2] Write component tests for SetRow (renders placeholder text, accepts input, toggles complete state, clears on user input) in `__tests__/components/workout/SetRow.test.tsx`
- [x] T029 [P] [US2] Write component tests for ActiveWorkout (renders all exercises and set rows from routine, shows previous session placeholder data) in `__tests__/components/workout/ActiveWorkout.test.tsx`
- [x] T030 [P] [US2] Write component tests for SessionHeader (renders elapsed timer, increments over time) in `__tests__/components/workout/SessionHeader.test.tsx`
- [x] T031 [US2] Write Playwright integration test for full session flow (start → log sets → end → history shows entry) in `__tests__/integration/session.spec.ts`

### Implementation for User Story 2

- [x] T032 [P] [US2] Create SessionHeader component (routine name, live elapsed timer using `useEffect` + `setInterval`) in `components/workout/SessionHeader.tsx`
- [x] T033 [P] [US2] Create SetRow component (weight input, reps input, complete toggle, greyed-out placeholder from previous session, note field) in `components/workout/SetRow.tsx`
- [x] T034 [P] [US2] Create ExerciseSection component (exercise name, muscle group badge, list of SetRows) in `components/workout/ExerciseSection.tsx`
- [x] T035 [US2] Create ActiveWorkout component (full scrollable routine layout with all ExerciseSections and SetRows pre-rendered; loads previous session data as placeholders) in `components/workout/ActiveWorkout.tsx`
- [x] T036 [US2] Create SessionFooter component with End session button (confirmation modal → save → redirect to home) and Abort button (confirmation modal → delete all sets and session → redirect to home) in `components/workout/SessionFooter.tsx`
- [x] T037 [US2] Implement session resume on page load: `lib/hooks/useActiveSession.ts` checks for an in-progress session for the current user and returns it; active workout page uses this to pre-fill state on refresh
- [x] T038 [US2] Create active workout page routing and data loading in `app/(app)/workout/[sessionId]/page.tsx` (load session + exercises + sets + previous session data)
- [x] T039 [US2] Implement beforeunload/popstate guard in `components/workout/ActiveWorkout.tsx` to warn user when navigating away mid-session (browser does not discard session on navigation)
- [x] T040 [US2] Create routine picker modal (selects from user's routines and starts a new session) in `components/routines/RoutinePickerModal.tsx`; wire up to home screen "+" button

**Checkpoint**: User Story 2 complete — full workout logging loop works on mobile browser with session persistence

---

## Phase 5: User Story 3 — Managing Routines and Exercises on Desktop (Priority: P2)

**Goal**: Users can create, edit, and delete routines and exercises using keyboard and mouse on a desktop browser; the layout uses available horizontal space at ≥1024px

**Independent Test**: On a 1280px-wide browser, create a routine with 5 exercises using only keyboard and mouse, reorder two exercises, rename the routine, save — all changes persist on page refresh

### Tests for User Story 3

- [x] T041 [P] [US3] Write component tests for RoutineCard (renders name + exercise count, shows delete/edit controls on hover, keyboard accessible) in `__tests__/components/routines/RoutineCard.test.tsx`
- [x] T042 [P] [US3] Write component tests for ExerciseForm (renders create/edit form, validates required fields, blocks duplicate names) in `__tests__/components/exercises/ExerciseForm.test.tsx`
- [x] T043 [P] [US3] Write component tests for ExerciseListItem (renders name + muscle group, shows edit/delete on hover, keyboard accessible) in `__tests__/components/exercises/ExerciseListItem.test.tsx`

### Implementation for User Story 3

- [x] T044 [P] [US3] Create RoutineCard component (routine name, exercise count, hover-revealed edit/delete buttons, keyboard accessible) in `components/routines/RoutineCard.tsx`
- [x] T045 [P] [US3] Create ExerciseRow component for routine editor (exercise name, muscle group, drag handle or up/down reorder buttons, remove button) in `components/routines/ExerciseRow.tsx`
- [x] T046 [US3] Create RoutineEditor component (routine name input, exercise list with reorder via drag-and-drop or up/down arrows, add exercise picker, save/cancel actions; Tab-navigable) in `components/routines/RoutineEditor.tsx`
- [x] T047 [US3] Create routines list page (grid layout on desktop ≥1024px, single column on mobile; "New routine" button; start workout button per routine card) in `app/(app)/routines/page.tsx`
- [x] T048 [US3] Create routine editor page for create/edit with RoutineEditor in `app/(app)/routines/[id]/page.tsx` (supports both new routine (id=new) and edit)
- [x] T049 [P] [US3] Create ExerciseListItem component (name, muscle group badge, hover-revealed edit/delete actions, keyboard accessible) in `components/exercises/ExerciseListItem.tsx`
- [x] T050 [P] [US3] Create ExerciseForm component (name input, muscle group select, save/cancel; validation for required fields and duplicate name) in `components/exercises/ExerciseForm.tsx`
- [x] T051 [US3] Create ExerciseList component (filter bar by muscle group, grouped by category, create button opening ExerciseForm inline or in modal) in `components/exercises/ExerciseList.tsx`
- [x] T052 [US3] Create exercise library page in `app/(app)/exercises/page.tsx`
- [x] T053 [US3] Implement exercise seed action in `lib/data/exerciseSeedData.ts` (reuse from 003 feature) and wire up "Seed exercises" button in exercise library page (idempotent — no duplicates on re-run)

**Checkpoint**: User Story 3 complete — full exercise and routine management works on desktop with keyboard navigation

---

## Phase 6: User Story 4 — History and Statistics on Any Device (Priority: P2)

**Goal**: History list and statistics charts are readable and usable on tablet (768px) and desktop (1280px) as well as mobile; charts scale to fill available width

**Independent Test**: With 10+ completed sessions on a 768px-wide tablet browser: history list renders in a productive layout, all statistics charts display without horizontal overflow, exercise picker is searchable

### Tests for User Story 4

- [x] T054 [P] [US4] Write component tests for SessionCard (renders date, routine name, duration, set count; navigates to detail on click) in `__tests__/components/history/SessionCard.test.tsx`
- [x] T055 [P] [US4] Write component tests for ExercisePickerModal (renders search input, filters exercises, selects and closes) in `__tests__/components/statistics/ExercisePickerModal.test.tsx`

### Implementation for User Story 4

- [x] T056 [P] [US4] Create SessionCard component (date, routine name, duration, set count; links to session detail) in `components/history/SessionCard.tsx`
- [x] T057 [P] [US4] Create HistoryList component (reverse-chronological list of SessionCards; empty state with prompt to start first workout) in `components/history/HistoryList.tsx`
- [x] T058 [US4] Create home/history page using HistoryList and "+" button to open RoutinePickerModal in `app/(app)/page.tsx`
- [x] T059 [P] [US4] Create SessionDetail component (all exercises with their logged sets; weight, reps, note per set) in `components/history/SessionDetail.tsx`
- [x] T060 [US4] Create session detail page in `app/(app)/history/[sessionId]/page.tsx`
- [x] T061 [P] [US4] Add Recharts dependency and create DurationChart (line chart of session duration over time, IQR-filtered) in `components/statistics/DurationChart.tsx`
- [x] T062 [P] [US4] Create VolumeChart (line chart of total volume kg×reps per session, IQR-filtered) in `components/statistics/VolumeChart.tsx`
- [x] T063 [P] [US4] Create ExerciseProgressionChart (highest weight per session + estimated 1RM line using Epley formula) in `components/statistics/ExerciseProgressionChart.tsx`
- [x] T064 [P] [US4] Create AggregateStats component (total sessions, sets, reps, volume with large-number formatting) in `components/statistics/AggregateStats.tsx`
- [x] T065 [P] [US4] Create ExercisePickerModal (searchable, keyboard-navigable picker of exercises for statistics) in `components/statistics/ExercisePickerModal.tsx`
- [x] T066 [US4] Create statistics page composing AggregateStats, DurationChart, VolumeChart, ExercisePickerModal, ExerciseProgressionChart in `app/(app)/statistics/page.tsx`
- [x] T067 [US4] Verify charts use `ResponsiveContainer` (or equivalent) to scale to full container width at all viewport sizes; verify no horizontal overflow on mobile at 375px

**Checkpoint**: User Story 4 complete — history and statistics are fully functional across all target viewport widths

---

## Phase 7: User Story 5 — Deep-linkable URLs and Browser Navigation (Priority: P3)

**Goal**: Every view has a stable, shareable URL; browser Back/Forward works naturally; page refresh renders the correct view

**Independent Test**: Navigate to a session detail page, copy the URL, open it in a new tab — the same session detail loads. Press Back — returns to the history list.

### Tests for User Story 5

- [x] T068 [US5] Write Playwright integration tests for deep linking (session detail URL loads in new tab) and browser Back navigation in `__tests__/integration/navigation.spec.ts`

### Implementation for User Story 5

- [x] T069 [P] [US5] Create route constants helper in `lib/utils/routes.ts` (type-safe URL builders: `routes.workout(id)`, `routes.historyDetail(id)`, etc.) and update all internal `<Link>` usages
- [x] T070 [US5] Audit all pages: confirm every major view (`/`, `/routines`, `/routines/[id]`, `/exercises`, `/workout/[sessionId]`, `/history/[sessionId]`, `/statistics`) loads correctly on hard refresh while authenticated
- [x] T071 [US5] Implement popstate / `beforeunload` guard during active workout to prevent accidental navigation loss (alert the user; do NOT discard the session): update `components/workout/ActiveWorkout.tsx`

**Checkpoint**: User Story 5 complete — all URLs are bookmarkable, shareable, and refresh-safe

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Web-native quality gates across all user stories

- [x] T072 [P] Keyboard navigation audit: confirm Tab order is logical on all pages; all buttons/inputs operable via Enter/Space; dropdowns navigable with arrow keys; add `tabIndex` and `onKeyDown` handlers where missing
- [x] T073 [P] Hover states: add Tailwind `hover:` utilities to all interactive elements (buttons, cards, list items, nav links) — verify no interactive element is hover-less on desktop
- [x] T074 [P] Focus indicators: add `focus-visible:ring-2 focus-visible:ring-teal-400` (or equivalent Midnight Teal token) to all focusable elements in `components/ui/` and update any element missing a focus ring
- [x] T075 [P] Responsive layout audit: manually test and fix layout at 375px, 600px, 768px, 1024px, 1280px, 1920px — no horizontal scrollbars, no broken grids, no text overflow
- [x] T076 [P] Content max-width: verify Shell applies `max-w-[1200px] mx-auto` at all viewports ≥1280px in `components/layout/Shell.tsx`
- [x] T077 Run Lighthouse audit on `/` (dashboard) and `/workout/[id]` (active workout) — accessibility score must reach ≥ 90; fix all flagged issues
- [x] T078 [P] Browser compatibility check: smoke-test critical flows (auth, start session, log set, end session) in Chrome, Firefox, and Safari
- [x] T079 [P] Run `tsc --noEmit` with zero errors; run full Jest test suite; run Playwright suite — all must pass
- [x] T080 Verify all constitution gates: layout ✅, types ✅, tests ✅, accessibility ✅, feature parity with specs 001–003 ✅

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2 — no story dependencies
- **US2 (Phase 4)**: Depends on Phase 2 — no story dependencies (can run parallel with US1 after Phase 2)
- **US3 (Phase 5)**: Depends on Phase 2 — no story dependencies (can run parallel with US1, US2)
- **US4 (Phase 6)**: Depends on Phase 2; depends on US2 for session data — start after US2 checkpoint
- **US5 (Phase 7)**: Depends on US1–US4 being complete (verifies all pages are deep-linkable)
- **Polish (Phase 8)**: Depends on all user stories complete

### User Story Dependencies

| Story | Depends On | Notes |
|-------|------------|-------|
| US1 | Phase 2 only | Independent — auth is self-contained |
| US2 | Phase 2 only | Requires RoutinePickerModal (US3 component) — build that component in US2 or US3 first |
| US3 | Phase 2 only | RoutinePickerModal.tsx can be built in US2 or US3 phase |
| US4 | Phase 2 + US2 | Session detail requires session data from US2 DB layer |
| US5 | US1–US4 | URL audit requires all pages to exist |

### Parallel Opportunities per Story

**Phase 1 — all parallel after T001:**
`T002, T003, T004, T005, T006` can all run in parallel

**Phase 2 — T007, T008 first, then:**
`T009, T010, T011` can run in parallel once T007/T008 done
`T015, T016` can run after T014

**Phase 3 (US1) — tests first, then parallel:**
`T018, T019` in parallel → then `T021, T022` in parallel → then `T023, T024` sequentially

**Phase 4 (US2) — tests first, then parallel components:**
`T028, T029, T030` in parallel → `T032, T033, T034` in parallel → `T035, T036, T037` sequentially

**Phase 5 (US3) — tests in parallel, implementation partially parallel:**
`T041, T042, T043` in parallel → `T044, T045, T049, T050` in parallel → `T046, T051` → `T047, T052, T053`

**Phase 6 (US4) — large parallel batch:**
`T054, T055` in parallel → `T056, T057, T061, T062, T063, T064, T065` all in parallel → `T058, T059, T060, T066, T067` sequentially

---

## Implementation Strategy

### MVP First (US1 + US2 only)

1. Complete Phase 1: Setup (T001–T006)
2. Complete Phase 2: Foundational (T007–T017) — **CRITICAL**
3. Complete Phase 3: US1 — auth works in browser
4. Complete Phase 4: US2 — workout logging works on mobile browser
5. **STOP and VALIDATE**: Register → start session → log sets → end → history entry visible
6. Deploy / demo

### Incremental Delivery

1. Phases 1 + 2 → Foundation ready
2. + Phase 3 (US1) → Users can sign in via browser (MVP auth)
3. + Phase 4 (US2) → Core workout logging works on mobile browser (MVP complete)
4. + Phase 5 (US3) → Routine and exercise management on desktop
5. + Phase 6 (US4) → History and statistics on all devices
6. + Phase 7 (US5) → Deep links and browser navigation polished
7. + Phase 8 → Web-quality polish shipped

### Summary

| Phase | Tasks | Parallel Tasks | Story |
|-------|-------|----------------|-------|
| Phase 1: Setup | T001–T006 | T002–T006 | — |
| Phase 2: Foundational | T007–T017 | T009–T011, T015–T016 | — |
| Phase 3: US1 Auth | T018–T027 | T018–T019, T021–T022 | US1 |
| Phase 4: US2 Session | T028–T040 | T028–T030, T032–T034 | US2 |
| Phase 5: US3 Routines/Exercises | T041–T053 | T041–T043, T044–T045, T049–T050 | US3 |
| Phase 6: US4 History/Stats | T054–T067 | T054–T055, T056–T057, T061–T065 | US4 |
| Phase 7: US5 Deep Links | T068–T071 | T069, T071 | US5 |
| Phase 8: Polish | T072–T080 | T072–T076, T078–T079 | — |
| **Total** | **80 tasks** | **~45 parallelizable** | |
