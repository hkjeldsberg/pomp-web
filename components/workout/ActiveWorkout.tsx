'use client';

import { useEffect } from 'react';
import { useActiveWorkout, type ActiveSet } from '@/lib/hooks/useActiveWorkout';
import { useRestTimer } from '@/lib/hooks/useRestTimer';
import type { RoutineWithExercises } from '@/lib/db/routines';
import type { PreviousSetDetail } from '@/lib/db/workouts';
import { SessionHeader } from './SessionHeader';
import { ExerciseSection } from './ExerciseSection';
import { SessionFooter } from './SessionFooter';

interface ActiveWorkoutProps {
  workoutId: string;
  routine: RoutineWithExercises;
  startedAt: string;
  previousSets: Record<string, PreviousSetDetail[]>; // exerciseId → sets
  initialSets?: ActiveSet[];
}

export function ActiveWorkout({ workoutId, routine, startedAt, previousSets, initialSets }: ActiveWorkoutProps) {
  const { sets, setSets, logSet, toggleComplete, deleteSets, endSession, cancelSession, onError } =
    useActiveWorkout(workoutId);

  const { secondsRemaining, totalSeconds, isRunning, startTimer, stopTimer } = useRestTimer({
    defaultSeconds: 120,
    enabled: true,
  });

  // Hydrate with server-fetched sets on mount
  useEffect(() => {
    if (initialSets && initialSets.length > 0) {
      setSets(initialSets);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Warn before tab close / browser navigation (session is NOT discarded)
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  const timerVisible = isRunning || secondsRemaining === 0;
  const progressPct =
    totalSeconds && secondsRemaining != null && secondsRemaining > 0
      ? (secondsRemaining / totalSeconds) * 100
      : 0;

  return (
    <div className={timerVisible ? 'pb-28' : ''}>
      <SessionHeader routineName={routine.name} startedAt={startedAt} />

      {onError && (
        <p className="text-red-400 text-sm mb-4 bg-red-900/20 px-4 py-2 rounded-lg">{onError}</p>
      )}

      <div className="mb-6">
        {routine.exercises.map(({ exercise }) => {
          const exerciseSets = sets.filter((s) => s.exercise_id === exercise.id);
          const prevSets = previousSets[exercise.id] ?? [];
          return (
            <ExerciseSection
              key={exercise.id}
              exerciseId={exercise.id}
              exerciseName={exercise.name}
              category={exercise.category}
              workoutId={workoutId}
              loggedSets={exerciseSets}
              previousSets={prevSets}
              onLog={({ exerciseId, setNumber, weightKg, reps }) =>
                logSet({ exerciseId, setNumber, weightKg, reps })
              }
              onToggleComplete={toggleComplete}
              onDeleteSet={deleteSets}
              onTimerStart={startTimer}
            />
          );
        })}
      </div>

      <SessionFooter
        workoutId={workoutId}
        onEnd={endSession}
        onCancel={cancelSession}
      />

      {/* Rest timer overlay */}
      {timerVisible && (
        <div className="fixed bottom-20 md:bottom-6 inset-x-0 flex justify-center z-30 pointer-events-none px-4">
          <div
            className={[
              'flex flex-col gap-1.5 px-5 py-3 rounded-2xl shadow-lg pointer-events-auto min-w-[180px]',
              'border text-sm font-semibold transition-colors',
              secondsRemaining === 0
                ? 'bg-accent border-accent text-bg-base'
                : 'bg-bg-surface border-border-teal text-text-primary',
            ].join(' ')}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="tabular-nums text-base">
                {secondsRemaining === 0 ? 'Rest over!' : `Rest ${secondsRemaining}s`}
              </span>
              <button
                onClick={stopTimer}
                aria-label="Dismiss rest timer"
                className="size-8 flex items-center justify-center text-base rounded-full hover:bg-black/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                ✕
              </button>
            </div>
            {secondsRemaining !== null && secondsRemaining > 0 && totalSeconds !== null && (
              <div className="h-[3px] w-full rounded-full bg-black/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
