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
  loggedSetId?: string;
  loggedWeight?: number;
  loggedReps?: number;
  onLog: (data: { weight: number; reps: number }) => Promise<void>;
  onToggleComplete?: (setId: string) => Promise<void>;
  onTimerStart?: () => void;
}

export function SetRow({
  setNumber, completed,
  previousWeight, previousReps,
  loggedSetId, loggedWeight, loggedReps,
  onLog, onToggleComplete, onTimerStart,
}: SetRowProps) {
  // Pre-fill from logged values first, then from previous session values
  const autofillWeight = loggedWeight != null ? String(loggedWeight) : (previousWeight != null ? String(previousWeight) : '');
  const autofillReps = loggedReps != null ? String(loggedReps) : (previousReps != null ? String(previousReps) : '');

  const [weight, setWeight] = useState(autofillWeight);
  const [reps, setReps] = useState(autofillReps);
  // Track whether the user has edited the autofilled values
  const [weightDirty, setWeightDirty] = useState(loggedWeight != null);
  const [repsDirty, setRepsDirty] = useState(loggedReps != null);
  const [error, setError] = useState<string | null>(null);
  const [confirmHighWeight, setConfirmHighWeight] = useState(false);
  const [pendingValues, setPendingValues] = useState<{ weight: number; reps: number } | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleCheck() {
    if (loggedSetId) {
      // Already logged — toggle complete/incomplete
      await onToggleComplete?.(loggedSetId);
      return;
    }

    // Not yet logged — validate and log
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
    try {
      await onLog({ weight: w, reps: r });
      setWeightDirty(true);
      setRepsDirty(true);
      onTimerStart?.();
    } catch {
      setError('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  // Text color: greyed out when showing autofilled (not user-edited) values
  const weightTextClass = weight && !weightDirty ? 'text-text-primary/65' : 'text-text-primary';
  const repsTextClass = reps && !repsDirty ? 'text-text-primary/65' : 'text-text-primary';

  return (
    <div className={['flex items-center gap-2 py-1.5', completed ? 'opacity-50' : ''].join(' ')}>
      {/* Set number */}
      <span className="w-5 text-center text-base text-accent-muted shrink-0">{setNumber}</span>

      {/* Weight */}
      <input
        type="number"
        inputMode="decimal"
        value={weight}
        onChange={(e) => { setWeight(e.target.value); setWeightDirty(true); setError(null); }}
        onFocus={(e) => { if (!weightDirty) e.target.select(); }}
        placeholder="kg"
        aria-label={`Weight set ${setNumber}`}
        className={['flex-1 h-11 min-w-0 rounded-lg bg-bg-surface border border-border-teal px-3 text-base placeholder:text-accent-muted/30',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent', weightTextClass].join(' ')}
      />

      {/* Reps */}
      <input
        type="number"
        inputMode="numeric"
        value={reps}
        onChange={(e) => { setReps(e.target.value); setRepsDirty(true); setError(null); }}
        onFocus={(e) => { if (!repsDirty) e.target.select(); }}
        placeholder="reps"
        aria-label={`Reps set ${setNumber}`}
        className={['flex-1 h-11 min-w-0 rounded-lg bg-bg-surface border border-border-teal px-3 text-base placeholder:text-accent-muted/30',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent', repsTextClass].join(' ')}
      />

      {/* Single checkmark button — logs set (first press) or toggles complete */}
      <button
        onClick={handleCheck}
        disabled={saving}
        aria-label={completed ? 'Mark as incomplete' : (loggedSetId ? 'Mark as complete' : 'Log set')}
        className={[
          'size-11 shrink-0 rounded-lg border flex items-center justify-center transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50',
          completed
            ? 'bg-accent border-accent text-bg-base'
            : loggedSetId
              ? 'border-accent text-accent'
              : 'border-border-teal text-accent-muted hover:border-accent hover:text-accent',
        ].join(' ')}
      >
        {saving ? '…' : (loggedSetId ? '✓' : '○')}
      </button>

      {/* Validation error (screen-reader only) */}
      {error && <span className="sr-only">{error}</span>}

      {/* High weight confirm modal */}
      <ConfirmModal
        open={confirmHighWeight}
        onClose={() => setConfirmHighWeight(false)}
        onConfirm={() => { setConfirmHighWeight(false); if (pendingValues) submit(pendingValues.weight, pendingValues.reps); }}
        title="Unusually high weight"
        message={`You entered ${pendingValues?.weight} kg — is that correct?`}
        confirmLabel="Yes, log it"
      />
    </div>
  );
}
