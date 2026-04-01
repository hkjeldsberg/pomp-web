# Active Workout UX Fixes — Design Spec

**Date:** 2026-04-01
**Branch:** 005-dumbbell-favicon
**Files affected:** `components/workout/ExerciseSection.tsx`, `components/workout/SetRow.tsx`, `components/workout/ActiveWorkout.tsx`, `lib/hooks/useRestTimer.ts`

---

## Overview

9 UX improvements reported from mobile usage of the active workout screen. All changes are scoped to the workout session UI — no database or API changes required.

---

## 1. No extra set after completing all sets

**File:** `ExerciseSection.tsx`

**Problem:** When a user completes the 3rd of 3 sets, a 4th row appears automatically.

**Fix:** Change `totalRows` formula from:
```ts
Math.max(DEFAULT_SETS, loggedSets.length + (loggedSets.length < DEFAULT_SETS ? 0 : 1))
```
to:
```ts
Math.max(DEFAULT_SETS, loggedSets.length)
```

No extra slot is ever auto-appended.

---

## 2. Brighter pre-filled values

**File:** `SetRow.tsx`

**Problem:** Pre-filled (not-yet-edited) weight/reps values are too dim at `/40` opacity on mobile.

**Fix:** Change `text-text-primary/40` → `text-text-primary/65` for both weight and reps inputs when showing autofilled values.

---

## 3. Pre-filled values turn white after pressing done

**File:** `SetRow.tsx`

**Problem:** When a user presses the checkmark without editing the pre-filled values, the values stay grey.

**Fix:** In `handleCheck`, after successfully submitting with un-dirty values, call `setWeightDirty(true)` and `setRepsDirty(true)` so the text immediately switches to full white. This is done inside `submit()` after `onLog` resolves.

---

## 4. Close old rest timer and start new on each done press

**File:** `ActiveWorkout.tsx`, `useRestTimer.ts`

**Behaviour:** `startTimer` already calls `clearTick()` before starting a new interval, so re-pressing done mid-rest correctly restarts the timer. Verify this works for the `secondsRemaining === 0` ("Rest over!") state — `startTimer` sets `secondsRemaining` to the duration, which clears the "Rest over!" banner.

**Action:** Confirm no change needed; add note in code if needed.

---

## 5. Countdown bar on rest timer

**Files:** `useRestTimer.ts`, `ActiveWorkout.tsx`

**Problem:** The timer pill only shows text. User wants a visual draining bar.

**Changes to `useRestTimer`:**
- Add `totalSeconds: number | null` to return type.
- Track `totalSecondsRef` set when `startTimer` is called.
- Expose `totalSeconds` as state alongside `secondsRemaining`.

**Changes to `ActiveWorkout.tsx`:**
- Below the timer text row, add a thin `<div>` progress bar.
- Width = `(secondsRemaining / totalSeconds) * 100%`, transitioning smoothly.
- Bar colour: `bg-accent` (matches the timer pill accent).
- Height: `3px`, rounded, inside the pill below the text.
- Hidden when `secondsRemaining === 0` ("Rest over!" state shows no bar).

---

## 6. Overwrite pre-filled values on focus

**File:** `SetRow.tsx`

**Problem:** Tapping a pre-filled input places the cursor beside existing text instead of replacing it.

**Fix:** Add `onFocus={(e) => { if (!weightDirty) e.target.select(); }}` to the weight input, and equivalent for reps. This selects all text on focus when the value is not yet user-edited, so the first keystroke replaces it entirely.

---

## 7. More distinctive check icon — three states

**File:** `SetRow.tsx`

**Problem:** All three button states show `✓`, making it hard to distinguish "not logged", "logged", and "completed".

**States:**
| State | Icon | Style |
|---|---|---|
| Not logged | `○` | border-teal, text-accent-muted |
| Logged, not complete | `✓` | border-accent, text-accent |
| Completed | `✓` | bg-accent filled, text-bg-base |

The `○` circle makes the "not yet done" state clearly distinct from both logged states.

---

## 8. Larger close button on rest timer

**File:** `ActiveWorkout.tsx`

**Problem:** The `✕` dismiss button on the timer pill is small and hard to tap on mobile.

**Fix:**
- Change button from `text-xs` to `text-base` (larger `✕` character).
- Add `size-8` with `flex items-center justify-center` for a larger tap target.
- Remove `opacity-60` dimming — always full opacity for discoverability.

---

## 9. Avoid overlap between rest timer and End/Cancel buttons

**File:** `ActiveWorkout.tsx`

**Problem:** The fixed-position timer pill (`bottom-20`) can overlap the session footer buttons when content is short.

**Fix:** When the timer is visible (`isRunning || secondsRemaining === 0`), add `pb-28` to the main content wrapper `<div>` so the footer buttons are pushed above the timer pill.

Implementation: add conditional class `(isRunning || secondsRemaining === 0) ? 'pb-28' : ''` to the outer wrapper div.
