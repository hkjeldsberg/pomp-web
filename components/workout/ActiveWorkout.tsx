'use client';

import { useEffect } from 'react';
import { useActiveWorkout, type ActiveSet } from '@/lib/hooks/useActiveWorkout';
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

  return (
    <div>
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
            />
          );
        })}
      </div>

      <SessionFooter
        workoutId={workoutId}
        onEnd={endSession}
        onCancel={cancelSession}
      />
    </div>
  );
}
