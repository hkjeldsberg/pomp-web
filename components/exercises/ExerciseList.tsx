'use client';

import { useState } from 'react';
import { deleteExercise } from '@/lib/db/exercises';
import type { Exercise } from '@/supabase/types';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ExerciseListItem } from './ExerciseListItem';
import { ExerciseForm } from './ExerciseForm';

const ALL_CATEGORIES = ['Rygg', 'Bryst', 'Bein', 'Skuldre', 'Biceps', 'Triceps', 'Kjerne'] as const;

interface ExerciseListProps {
  initialExercises: Exercise[];
}

export function ExerciseList({ initialExercises }: ExerciseListProps) {
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [filter, setFilter] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<Exercise | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Exercise | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = filter
    ? exercises.filter((e) => e.category === filter)
    : exercises;

  function handleSaved(saved: Exercise) {
    setExercises((prev) => {
      const idx = prev.findIndex((e) => e.id === saved.id);
      return idx >= 0 ? prev.map((e) => (e.id === saved.id ? saved : e)) : [...prev, saved];
    });
    setEditTarget(null);
    setCreateOpen(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteExercise(deleteTarget.id);
      setExercises((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter(null)}
          className={['px-3 py-1 rounded-full text-sm border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            filter === null ? 'bg-accent border-accent text-bg-base font-semibold' : 'border-border-teal text-accent-muted hover:border-accent'].join(' ')}
        >
          Alle
        </button>
        {ALL_CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat === filter ? null : cat)}
            className={['px-3 py-1 rounded-full text-sm border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              filter === cat ? 'bg-accent border-accent text-bg-base font-semibold' : 'border-border-teal text-accent-muted hover:border-accent'].join(' ')}>
            {cat}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="rounded-xl bg-bg-card border border-border-teal px-3 py-1 mb-4">
        {filtered.length === 0
          ? <p className="text-accent-muted text-sm py-6 text-center">Ingen øvelser funnet</p>
          : filtered.map((ex) => (
            <ExerciseListItem
              key={ex.id}
              exercise={ex}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
          ))}
      </div>

      <Button onClick={() => setCreateOpen(true)}>+ Ny øvelse</Button>

      {/* Create modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Ny øvelse">
        <ExerciseForm onSave={handleSaved} onCancel={() => setCreateOpen(false)} />
      </Modal>

      {/* Edit modal */}
      <Modal open={editTarget !== null} onClose={() => setEditTarget(null)} title="Rediger øvelse">
        {editTarget && (
          <ExerciseForm
            initialData={editTarget}
            onSave={handleSaved}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Slett øvelse"
        message={`Er du sikker på at du vil slette "${deleteTarget?.name}"?`}
        confirmLabel="Slett"
        confirmVariant="danger"
        loading={deleting}
      />
    </div>
  );
}
