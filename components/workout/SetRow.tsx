'use client';

import { useState } from 'react';
import { ConfirmModal } from '@/components/ui/Modal';
import { validateSetInput } from '@/lib/validation';

interface SetRowProps {
  setNumber: number;
  workoutId: string;
  exerciseId: string;
  completed: boolean;
  previousWeight?: number;
  previousReps?: number;
  // For already-logged sets
  loggedSetId?: string;
  loggedWeight?: number;
  loggedReps?: number;
  onLog: (data: { weight: number; reps: number }) => Promise<void>;
  onToggleComplete?: (setId: string) => Promise<void>;
  onDelete?: (setId: string) => Promise<void>;
}

export function SetRow({
  setNumber, completed,
  previousWeight, previousReps,
  loggedSetId, loggedWeight, loggedReps,
  onLog, onToggleComplete, onDelete,
}: SetRowProps) {
  const [weight, setWeight] = useState(loggedWeight != null ? String(loggedWeight) : '');
  const [reps, setReps] = useState(loggedReps != null ? String(loggedReps) : '');
  const [error, setError] = useState<string | null>(null);
  const [confirmHighWeight, setConfirmHighWeight] = useState(false);
  const [pendingValues, setPendingValues] = useState<{ weight: number; reps: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleLog() {
    const w = weight ? parseFloat(weight) : null;
    const r = reps ? parseInt(reps, 10) : null;
    const result = validateSetInput(w, r);
    if (result.error) { setError(result.error); return; }
    if (result.requiresConfirmation) {
      setPendingValues({ weight: w!, reps: r! });
      setConfirmHighWeight(true);
      return;
    }
    await submit(w!, r!);
  }

  async function submit(w: number, r: number) {
    setSaving(true);
    setError(null);
    try { await onLog({ weight: w, reps: r }); } catch { setError('Klarte ikke lagre'); } finally { setSaving(false); }
  }

  function handleSame() {
    if (previousWeight != null && previousReps != null) {
      setWeight(String(previousWeight));
      setReps(String(previousReps));
    }
  }

  return (
    <div className={['flex items-center gap-2 py-1.5', completed ? 'opacity-60' : ''].join(' ')}>
      {/* Set number */}
      <span className="w-5 text-center text-xs text-accent-muted shrink-0">{setNumber}</span>

      {/* Weight */}
      <input
        type="number"
        inputMode="decimal"
        value={weight}
        onChange={(e) => { setWeight(e.target.value); setError(null); }}
        placeholder={previousWeight != null ? `${previousWeight} kg` : 'kg'}
        aria-label={`Vekt sett ${setNumber}`}
        className="flex-1 h-11 min-w-0 rounded-lg bg-bg-surface border border-border-teal px-3 text-text-primary text-sm placeholder:text-accent-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />

      {/* Reps */}
      <input
        type="number"
        inputMode="numeric"
        value={reps}
        onChange={(e) => { setReps(e.target.value); setError(null); }}
        placeholder={previousReps != null ? `${previousReps} reps` : 'reps'}
        aria-label={`Reps sett ${setNumber}`}
        className="flex-1 h-11 min-w-0 rounded-lg bg-bg-surface border border-border-teal px-3 text-text-primary text-sm placeholder:text-accent-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />

      {/* Log / toggle button */}
      {loggedSetId ? (
        <button
          onClick={() => onToggleComplete?.(loggedSetId)}
          aria-label={completed ? 'Merk som uferdig' : 'Merk som fullført'}
          className={[
            'size-11 shrink-0 rounded-lg border flex items-center justify-center transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            completed
              ? 'bg-accent border-accent text-bg-base'
              : 'border-accent text-accent',
          ].join(' ')}
        >
          ✓
        </button>
      ) : (
        <button
          onClick={handleLog}
          disabled={saving}
          aria-label="Logg sett"
          className="h-11 px-3 shrink-0 rounded-lg bg-accent text-bg-base font-semibold text-sm hover:bg-accent-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
        >
          {saving ? '…' : 'Logg'}
        </button>
      )}

      {/* Same as last time shortcut */}
      {!loggedSetId && previousWeight != null && (
        <button
          onClick={handleSame}
          aria-label="Samme som sist"
          title="Samme som sist"
          className="size-11 shrink-0 rounded-lg border border-border-teal text-accent-muted hover:text-accent hover:border-accent transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm"
        >
          ≡
        </button>
      )}

      {/* Delete (logged sets only) */}
      {loggedSetId && onDelete && (
        <button
          onClick={() => setDeleteOpen(true)}
          aria-label="Slett sett"
          className="size-11 shrink-0 rounded-lg text-red-400 hover:bg-red-900/20 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          ✕
        </button>
      )}

      {/* Validation error (shown below row in parent) */}
      {error && <span className="sr-only">{error}</span>}

      {/* High weight confirm modal */}
      <ConfirmModal
        open={confirmHighWeight}
        onClose={() => setConfirmHighWeight(false)}
        onConfirm={() => { setConfirmHighWeight(false); if (pendingValues) submit(pendingValues.weight, pendingValues.reps); }}
        title="Uvanlig høy vekt"
        message={`Du oppga ${pendingValues?.weight} kg — er det riktig?`}
        confirmLabel="Ja, logg"
      />

      {/* Delete confirm modal */}
      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => { setDeleteOpen(false); if (loggedSetId) onDelete?.(loggedSetId); }}
        title="Slett sett"
        message="Er du sikker på at du vil slette dette settet?"
        confirmLabel="Slett"
        confirmVariant="danger"
      />
    </div>
  );
}
