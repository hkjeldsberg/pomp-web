'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRoutines, deleteRoutine, type RoutineWithExercises } from '@/lib/db/routines';
import { RoutineCard } from '@/components/routines/RoutineCard';
import { RoutinePickerModal } from '@/components/routines/RoutinePickerModal';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';

export default function RoutinesPage() {
  const router = useRouter();
  const [routines, setRoutines] = useState<RoutineWithExercises[]>([]);
  const [loading, setLoading] = useState(true);
  const [startOpen, setStartOpen] = useState(false);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoutineWithExercises | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getRoutines().then(setRoutines).finally(() => setLoading(false));
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteRoutine(deleteTarget.id);
      setRoutines((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  if (loading) return <div className="text-accent-muted text-sm py-8 text-center">Loading…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-text-primary text-2xl font-bold">Routines</h1>
        <Button size="sm" onClick={() => router.push('/routines/new')}>+ New routine</Button>
      </div>

      {routines.length === 0 ? (
        <EmptyState
          title="No routines yet"
          subtitle="Create your first workout routine to get started"
          action={{ label: '+ New routine', onClick: () => router.push('/routines/new') }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routines.map((r) => (
            <RoutineCard
              key={r.id}
              routine={r}
              onStart={(id) => { setSelectedRoutineId(id); setStartOpen(true); }}
              onEdit={(id) => router.push(`/routines/${id}`)}
              onDelete={(id) => setDeleteTarget(routines.find((r) => r.id === id) ?? null)}
            />
          ))}
        </div>
      )}

      <RoutinePickerModal
        open={startOpen}
        onClose={() => setStartOpen(false)}
        routines={selectedRoutineId ? routines.filter((r) => r.id === selectedRoutineId) : routines}
      />

      <ConfirmModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete routine"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={deleting}
      />
    </div>
  );
}
