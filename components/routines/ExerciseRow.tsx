'use client';

import type { Exercise } from '@/supabase/types';

interface ExerciseRowProps {
  exercise: Exercise;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export function ExerciseRow({ exercise, index, total, onMoveUp, onMoveDown, onRemove }: ExerciseRowProps) {
  return (
    <div className="flex items-center gap-2 py-2 border-b border-border-teal/30 last:border-0">
      <span className="text-accent-muted text-sm w-5 text-center shrink-0">{index + 1}</span>
      <span className="text-text-primary text-sm flex-1 truncate">{exercise.name}</span>
      <div className="flex gap-1 shrink-0">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          aria-label={`Flytt ${exercise.name} opp`}
          className="size-8 flex items-center justify-center rounded hover:bg-bg-card disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          ↑
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === total - 1}
          aria-label={`Flytt ${exercise.name} ned`}
          className="size-8 flex items-center justify-center rounded hover:bg-bg-card disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          ↓
        </button>
        <button
          onClick={onRemove}
          aria-label={`Fjern ${exercise.name}`}
          className="size-8 flex items-center justify-center rounded text-red-400 hover:bg-red-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
