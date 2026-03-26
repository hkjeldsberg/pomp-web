'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRoutine, updateRoutine } from '@/lib/db/routines';
import type { Exercise } from '@/supabase/types';
import type { RoutineWithExercises } from '@/lib/db/routines';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ExerciseRow } from './ExerciseRow';
import { ExercisePicker } from './ExercisePicker';

interface RoutineEditorProps {
  allExercises: Exercise[];
  initial?: RoutineWithExercises;
}

export function RoutineEditor({ allExercises, initial }: RoutineEditorProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? '');
  const [exercises, setExercises] = useState<Exercise[]>(
    initial?.exercises.map((e) => e.exercise) ?? []
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function moveUp(i: number) {
    if (i === 0) return;
    const next = [...exercises];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    setExercises(next);
  }

  function moveDown(i: number) {
    if (i === exercises.length - 1) return;
    const next = [...exercises];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    setExercises(next);
  }

  function remove(i: number) {
    setExercises((prev) => prev.filter((_, idx) => idx !== i));
  }

  function togglePicker(ex: Exercise) {
    setExercises((prev) =>
      prev.some((e) => e.id === ex.id)
        ? prev.filter((e) => e.id !== ex.id)
        : [...prev, ex]
    );
  }

  async function handleSave() {
    if (!name.trim()) { setNameError('Fyll inn navn på rutinen'); return; }
    setNameError(null);
    setSaving(true);
    setError(null);
    try {
      const exerciseIds = exercises.map((e) => e.id);
      if (initial) {
        await updateRoutine(initial.id, { name: name.trim(), exerciseIds });
      } else {
        await createRoutine({ name: name.trim(), exerciseIds });
      }
      router.push('/routines');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Klarte ikke lagre rutinen');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <Input
        id="routine-name"
        label="Navn på rutine"
        value={name}
        onChange={(e) => { setName(e.target.value); setNameError(null); }}
        placeholder="f.eks. Push A"
        errorText={nameError ?? undefined}
        autoFocus
      />

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-accent-muted">
            Øvelser ({exercises.length})
          </span>
          <Button variant="secondary" size="sm" onClick={() => setPickerOpen(true)}>
            + Legg til
          </Button>
        </div>
        {exercises.length === 0 ? (
          <p className="text-accent-muted text-sm py-4 text-center border border-dashed border-border-teal rounded-lg">
            Ingen øvelser enda
          </p>
        ) : (
          <div className="rounded-lg bg-bg-card border border-border-teal px-3 py-1">
            {exercises.map((ex, i) => (
              <ExerciseRow
                key={ex.id}
                exercise={ex}
                index={i}
                total={exercises.length}
                onMoveUp={() => moveUp(i)}
                onMoveDown={() => moveDown(i)}
                onRemove={() => remove(i)}
              />
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <Button onClick={handleSave} loading={saving} className="flex-1">
          {initial ? 'Lagre endringer' : 'Opprett rutine'}
        </Button>
        <Button variant="ghost" onClick={() => router.back()}>Avbryt</Button>
      </div>

      <Modal open={pickerOpen} onClose={() => setPickerOpen(false)} title="Velg øvelser">
        <div className="h-[60vh]">
          <ExercisePicker
            exercises={allExercises}
            selectedIds={exercises.map((e) => e.id)}
            onToggle={togglePicker}
            onConfirm={() => setPickerOpen(false)}
            onClose={() => setPickerOpen(false)}
          />
        </div>
      </Modal>
    </div>
  );
}
