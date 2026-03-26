# Implementation Plan: Pomp Web — Platform Migration

**Branch**: `004-mobile-to-web` | **Date**: 2026-03-26 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/004-mobile-to-web/spec.md`

## Summary

Migrate Pomp from a React Native / Expo mobile app to a Next.js web application. The Supabase backend (auth, schema `pomp`, RLS) is reused without changes. All features from specs 001–003 are reimplemented using web-native HTML/CSS/React instead of React Native primitives. The UI is responsive across mobile (375px), tablet (768px), and desktop (1280px) viewports, keyboard-accessible, and ships with the same dark Midnight Teal theme.

## Technical Context

**Language/Version**: TypeScript 5.9.2 (strict mode)
**Primary Dependencies**: Next.js 15 (App Router), Tailwind CSS 3.x, Supabase JS 2.x, Recharts (or Victory) for statistics charts
**Storage**: Supabase PostgreSQL — schema `pomp` (no schema changes)
**Testing**: Jest + React Testing Library (web); Playwright for critical-flow integration tests
**Target Platform**: Evergreen browsers — Chrome, Firefox, Safari; mobile browsers at 375–430px; desktop at 1024–1920px
**Project Type**: Web application (Next.js App Router, SSR + client components)
**Performance Goals**: Initial page load < 3 s on broadband; internal navigation feels instant (client-side routing)
**Constraints**: No changes to Supabase schema or RLS; no new third-party auth providers; Norwegian Bokmål only
**Scale/Scope**: Single-user data model unchanged; statistics handle up to ~500 sessions client-side

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Web-First, Responsive (375/768/1280px) | ✅ PASS | Next.js + Tailwind CSS supports all three breakpoints natively |
| II. Feature Parity with 001–003 specs | ✅ PASS | All screens from the mobile app are being ported 1:1 |
| III. TypeScript strict mode, no `any`, <300 lines/file | ✅ PASS | Enforced via tsconfig; component split discipline maintained |
| IV. Test coverage gates (component + integration) | ✅ PASS | React Testing Library (unit) + Playwright (integration flows) |
| V. Accessibility ≥ 90 Lighthouse | ✅ PASS | Semantic HTML + ARIA; keyboard navigation designed from the start |
| VI. URL-native navigation | ✅ PASS | Next.js App Router provides file-based URL routing by default |
| VII. Supabase backend unchanged | ✅ PASS | Existing `lib/db/` layer reused; no schema migrations |
| VIII. Norwegian + Midnight Teal theme | ✅ PASS | Tailwind config carries over the existing colour palette |

**Post-design re-check**: No violations introduced.

## Migration Strategy

### Phase 0 — Research & Audit
- Inventory all React Native components and screens in the existing codebase
- Identify which `lib/db/`, `lib/hooks/`, and `lib/utils/` files are platform-agnostic and can be reused directly
- Map each mobile-specific pattern to its web equivalent:
  | Mobile Pattern | Web Equivalent |
  |----------------|----------------|
  | `TouchableOpacity` + long-press | `<button>` + right-click context menu or kebab menu |
  | Swipe-to-delete | Delete button revealed on hover, or keyboard Delete key |
  | Expo Router tabs (bottom nav) | Tailwind-styled tab bar (bottom on mobile, sidebar/topnav on desktop) |
  | `expo-haptics` | Omit (no web equivalent needed) |
  | `@shopify/react-native-skia` charts | Recharts (web-native SVG charts) |
  | `nativewind` + RN styles | Tailwind CSS utility classes on HTML elements |

### Phase 1 — Design & Structure
- Define Next.js App Router file structure (see Project Structure below)
- Create Tailwind config carrying over Midnight Teal palette from `tailwind.config.js`
- Define shared layout components: `Navbar`, `BottomNav` (mobile), `Sidebar` (desktop)
- Port Supabase client initialisation to Next.js environment (`createBrowserClient` / `createServerClient`)
- Design responsive grid and spacing tokens

### Phase 2 — Core Infrastructure
- Auth flow: sign-in, sign-up, sign-out pages; middleware-based route protection
- Supabase session persistence via cookies (not `AsyncStorage`)
- Shared layout with navigation that switches between bottom-bar (mobile) and sidebar (desktop) based on viewport

### Phase 3 — Feature Migration (in spec priority order)
Port each feature group as an independently deployable slice:

1. **Auth** (P1) — sign-in/up/out pages
2. **Active Workout Session** (P1) — start, log sets, mark complete, end/abort; resume on refresh
3. **Routines** (P2) — list, create, edit (reorder exercises), delete
4. **Exercise Library** (P2) — list, filter by muscle group, create, edit, delete, seed
5. **Workout History** (P2) — list (newest-first), session detail
6. **Statistics** (P3) — aggregate stats, duration/volume charts, exercise progression + 1RM, outlier filtering

### Phase 4 — Web-native Polish
- Keyboard navigation across all interactive elements
- Hover states on all clickable/interactive elements
- Focus indicators meeting WCAG AA
- Deep-linking: all pages bookmarkable and refreshable
- Responsive layout audit at 375px / 768px / 1280px / 1920px
- Lighthouse accessibility and performance audit

## Project Structure

### Documentation (this feature)

```text
specs/004-mobile-to-web/
├── plan.md              ✅ this file
├── research.md          (generated by /speckit.plan)
├── data-model.md        (generated by /speckit.plan — unchanged from mobile)
├── quickstart.md        (generated by /speckit.plan)
├── contracts/           (generated by /speckit.plan)
└── tasks.md             (generated by /speckit.tasks)
```

### Source Code (new Next.js project at repository root)

```text
app/                          # Next.js App Router
├── (auth)/
│   ├── login/page.tsx        # Sign-in page
│   └── register/page.tsx     # Registration page
├── (app)/                    # Protected routes (auth middleware)
│   ├── layout.tsx            # Shell with Navbar / BottomNav
│   ├── page.tsx              # Home — workout history list
│   ├── routines/
│   │   ├── page.tsx          # Routine list
│   │   └── [id]/page.tsx     # Routine editor
│   ├── exercises/
│   │   └── page.tsx          # Exercise library
│   ├── workout/
│   │   └── [sessionId]/page.tsx  # Active workout session
│   ├── history/
│   │   ├── page.tsx          # History list (same as home)
│   │   └── [sessionId]/page.tsx  # Session detail
│   └── statistics/
│       └── page.tsx          # Statistics & charts
├── layout.tsx                # Root layout (fonts, providers)
└── middleware.ts             # Auth route protection

components/
├── auth/                     # LoginForm, RegisterForm
├── layout/                   # Navbar, BottomNav, Sidebar, Shell
├── routines/                 # RoutineCard, RoutineEditor, ExerciseRow
├── exercises/                # ExerciseList, ExerciseForm, ExerciseListItem
├── workout/                  # ActiveWorkout, SetRow, SessionHeader, ElapsedTimer
├── history/                  # HistoryList, SessionCard, SessionDetail
├── statistics/               # AggregateStats, DurationChart, VolumeChart,
│                             #   ExerciseProgressionChart, ExercisePickerModal
└── ui/                       # Button, Input, Modal, ContextMenu, Badge (design system)

lib/
├── db/                       # Reused from mobile: exercises.ts, routines.ts,
│                             #   sessions.ts, sets.ts, statistics.ts
├── hooks/                    # Reused: useRoutines, useSession, useStatistics, etc.
├── utils/                    # Reused: format.ts, statistics.ts (IQR filter)
└── supabase/
    ├── client.ts             # Browser Supabase client
    └── server.ts             # Server Supabase client (for middleware/RSC)

__tests__/
├── components/               # React Testing Library unit tests
└── integration/              # Playwright e2e: auth, session start, set logging, end session
```

**Structure Decision**: Next.js App Router with a `(app)` route group for protected pages and an `(auth)` group for public auth pages. `lib/db/` and `lib/hooks/` are reused directly from the mobile app where they contain no React Native imports; any RN-specific hooks are rewritten using React standard APIs (no `useEffect` differences needed).

## Key Migration Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Web framework | Next.js 15 (App Router) | File-based routing satisfies FR-009–011; SSR improves initial load |
| Styling | Tailwind CSS (already in project) | Direct reuse of existing `tailwind.config.js` colour palette |
| Charts | Recharts | Web-native SVG, no canvas, accessible, tree-shakeable; replaces `victory-native` |
| Auth session | Supabase cookies (`@supabase/ssr`) | Enables SSR-safe auth; replaces `AsyncStorage` used in mobile app |
| Mobile long-press | Hover-reveal delete button + confirmation | Standard web pattern; no library dependency |
| Bottom nav (mobile) | Tailwind fixed bottom bar < 768px | Mirrors native tab bar; hidden on desktop in favour of sidebar/topnav |

## Complexity Tracking

No constitution violations. No complexity justification required.
