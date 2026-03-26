'use client';

import type { RoutineWithExercises } from '@/lib/db/routines';
import { Button } from '@/components/ui/Button';

interface RoutineCardProps {
  routine: RoutineWithExercises;
  onStart: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RoutineCard({ routine, onStart, onEdit, onDelete }: RoutineCardProps) {
  return (
    <div className="rounded-xl bg-bg-card border border-border-teal p-4 flex flex-col gap-3 hover:border-accent/40 transition-colors group">
      <div>
        <h3 className="text-text-primary font-semibold text-base">{routine.name}</h3>
        <p className="text-accent-muted text-sm mt-0.5">
          {routine.exercises.length} øvelse{routine.exercises.length !== 1 ? 'r' : ''}
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button variant="primary" size="sm" onClick={() => onStart(routine.id)}>
          Start økt
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onEdit(routine.id)} aria-label="Rediger rutine">
          Rediger
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(routine.id)}
          aria-label="Slett rutine"
          className="text-red-400 hover:bg-red-900/20"
        >
          Slett
        </Button>
      </div>
    </div>
  );
}
