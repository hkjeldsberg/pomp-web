'use client';

import type { Exercise } from '@/supabase/types';
import { Badge } from '@/components/ui/Badge';

interface ExerciseListItemProps {
  exercise: Exercise;
  onEdit: (exercise: Exercise) => void;
  onDelete: (exercise: Exercise) => void;
}

export function ExerciseListItem({ exercise, onEdit, onDelete }: ExerciseListItemProps) {
  return (
    <div className="flex items-center gap-3 py-3 px-2 border-b border-border-teal/30 last:border-0 hover:bg-bg-card/50 rounded-lg transition-colors group">
      <span className="flex-1 text-text-primary text-sm">{exercise.name}</span>
      <Badge label={exercise.category} />
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(exercise)}
          aria-label={`Rediger ${exercise.name}`}
          className="h-8 px-2 rounded text-sm text-accent-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Rediger
        </button>
        <button
          onClick={() => onDelete(exercise)}
          aria-label={`Slett ${exercise.name}`}
          className="h-8 px-2 rounded text-sm text-red-400 hover:bg-red-900/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          Slett
        </button>
      </div>
    </div>
  );
}
