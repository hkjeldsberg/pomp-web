'use client';

import type { ActiveSet } from '@/lib/hooks/useActiveWorkout';
import type { PreviousSetDetail } from '@/lib/db/workouts';
import { Badge } from '@/components/ui/Badge';
import { SetRow } from './SetRow';

const DEFAULT_SETS = 3;

interface ExerciseSectionProps {
  exerciseId: string;
  exerciseName: string;
  category: string;
  workoutId: string;
  loggedSets: ActiveSet[];
  previousSets: PreviousSetDetail[];
  onLog: (data: { exerciseId: string; setNumber: number; weightKg: number; reps: number }) => Promise<void>;
  onToggleComplete: (setId: string) => Promise<void>;
  onDeleteSet: (setId: string) => Promise<void>;
  onTimerStart?: () => void;
}

export function ExerciseSection({
  exerciseId, exerciseName, category, workoutId,
  loggedSets, previousSets, onLog, onToggleComplete, onDeleteSet, onTimerStart,
}: ExerciseSectionProps) {
  const totalRows = Math.max(DEFAULT_SETS, loggedSets.length + (loggedSets.length < DEFAULT_SETS ? 0 : 1));

  return (
    <div className="rounded-xl bg-bg-card border border-border-teal p-4 mb-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-text-primary font-bold text-base">{exerciseName}</span>
        <Badge label={category} />
      </div>
      <div className="flex flex-col gap-0.5">
        {Array.from({ length: totalRows }, (_, i) => {
          const setNumber = i + 1;
          const logged = loggedSets.find((s) => s.set_number === setNumber);
          const prev = previousSets.find((p) => p.set_number === setNumber);
          return (
            <SetRow
              key={setNumber}
              setNumber={setNumber}
              workoutId={workoutId}
              exerciseId={exerciseId}
              completed={logged?.completed ?? false}
              previousWeight={prev?.weight_kg}
              previousReps={prev?.reps}
              loggedSetId={logged?.id}
              loggedWeight={logged?.weight_kg}
              loggedReps={logged?.reps}
              onLog={({ weight, reps }) => onLog({ exerciseId, setNumber, weightKg: weight, reps })}
              onToggleComplete={onToggleComplete}
              onTimerStart={onTimerStart}
            />
          );
        })}
      </div>
    </div>
  );
}
