'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { createWorkout } from '@/lib/db/workouts';
import type { RoutineWithExercises } from '@/lib/db/routines';

interface RoutinePickerModalProps {
  open: boolean;
  onClose: () => void;
  routines: RoutineWithExercises[];
}

export function RoutinePickerModal({ open, onClose, routines }: RoutinePickerModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(routineId: string) {
    setLoading(routineId);
    setError(null);
    try {
      const workout = await createWorkout({ routineId });
      onClose();
      router.push(`/workout/${workout.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start workout');
      setLoading(null);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Select routine">
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      {routines.length === 0 ? (
        <p className="text-accent-muted text-sm">No routines yet. Create a routine first.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {routines.map((r) => (
            <li key={r.id}>
              <button
                onClick={() => handleSelect(r.id)}
                disabled={loading !== null}
                className="w-full text-left px-4 py-3 rounded-lg bg-bg-card border border-border-teal hover:border-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
              >
                <div className="text-text-primary font-medium">{r.name}</div>
                <div className="text-accent-muted text-sm">{r.exercises.length} exercises</div>
                {loading === r.id && <span className="text-xs text-accent">Starting…</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
