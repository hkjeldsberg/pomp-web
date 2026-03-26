# Pomp Constitution

## Core Principles

### I. Web-First, Responsive by Default
Every new screen and component is designed and tested at three breakpoints: mobile (375px), tablet (768px), and desktop (1280px). No feature ships without passing a layout check at all three. Mobile-browser ergonomics (44×44px touch targets, thumb-zone reachability) are non-negotiable at the smallest breakpoint. Desktop views must use available horizontal space productively — no stretched single-column layouts above 1024px.

### II. Feature Parity with the Mobile App (NON-NEGOTIABLE)
The web version must deliver 100% of the features defined in specs 001-workout-log, 002-ux-improvements-backlog, and 003-exercise-stats-ux. No feature may be downgraded or omitted in the web port. When a mobile interaction pattern (long-press, swipe-to-delete, haptics) has no direct web equivalent, a functionally equivalent web-native pattern MUST be provided (hover+right-click, keyboard shortcut, or explicit delete button).

### III. TypeScript Strict Mode (NON-NEGOTIABLE)
All source files use TypeScript in strict mode. No `any` types. No implicit nulls. Files must remain under 300 lines; split by responsibility if larger. All exported functions and components have typed signatures.

### IV. Test Coverage Gates
Every interactive UI element (buttons, inputs, toggles, form controls) requires automated component-level tests before a user story can be marked complete. Critical flows — auth, session start, set logging, session end — require integration test coverage. Tests must run in CI without manual steps.

### V. Accessibility Baseline
All interactive elements are keyboard-focusable with visible focus indicators. Lighthouse Accessibility score ≥ 90 on dashboard and active workout views before any story ships. ARIA roles added wherever semantic HTML is insufficient.

### VI. URL-Native Navigation
Every major view has a unique, bookmarkable URL. The browser Back/Forward buttons work as users expect. Page refresh at any URL renders the correct authenticated view. Deep links are shareable without extra configuration.

### VII. Supabase Backend Unchanged
The existing Supabase schema (schema `pomp`), RLS policies, and auth configuration are not modified as part of the web migration. All data access goes through the existing `lib/db/` layer. Backend changes require a separate feature spec.

### VIII. Norwegian Language & Midnight Teal Theme
All user-facing text is in Norwegian (Bokmål). The dark Midnight Teal visual design is preserved. No English-language copy and no light-theme variant are introduced without a separate design decision.

## Quality Gates

| Gate | Requirement |
|------|-------------|
| Layout | Passes at 375px, 768px, 1280px before merge |
| Types | `tsc --noEmit` passes with zero errors |
| Tests | All component and integration tests pass in CI |
| Accessibility | Lighthouse ≥ 90 on dashboard + active workout |
| Feature parity | All 001–003 spec requirements verified on web |

## Governance
This constitution supersedes all other practices for the 004-mobile-to-web feature and all subsequent features in this repository. Amendments require a written justification added to the relevant feature spec. Any complexity that violates these principles must be documented in the plan's Complexity Tracking section with a clear rationale.

**Version**: 1.0.0 | **Ratified**: 2026-03-26 | **Last Amended**: 2026-03-26
