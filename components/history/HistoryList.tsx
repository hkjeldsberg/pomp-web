'use client';

import { useState } from 'react';
import type { WorkoutSummary } from '@/lib/db/workouts';
import { SessionCard } from './SessionCard';
import { Button } from '@/components/ui/Button';
import { RoutinePickerModal } from '@/components/routines/RoutinePickerModal';
import type { RoutineWithExercises } from '@/lib/db/routines';

interface HistoryListProps {
  sessions: WorkoutSummary[];
  routines: RoutineWithExercises[];
}

export function HistoryList({ sessions, routines }: HistoryListProps) {
  const [startOpen, setStartOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-text-primary text-2xl font-bold">History</h1>
        <Button size="sm" onClick={() => setStartOpen(true)}>+ Start workout</Button>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-xl bg-bg-card border border-border-teal p-8 text-center">
          <p className="text-text-primary font-semibold mb-2">No sessions yet</p>
          <p className="text-accent-muted text-sm mb-4">Start your first workout session</p>
          <Button onClick={() => setStartOpen(true)}>+ Start workout</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((s) => <SessionCard key={s.id} session={s} />)}
        </div>
      )}

      <RoutinePickerModal open={startOpen} onClose={() => setStartOpen(false)} routines={routines} />
    </div>
  );
}
