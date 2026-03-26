'use client';

import { useState } from 'react';
import { createExercise, updateExercise } from '@/lib/db/exercises';
import type { Exercise } from '@/supabase/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const CATEGORIES = ['Rygg', 'Bryst', 'Bein', 'Skuldre', 'Biceps', 'Triceps', 'Kjerne'] as const;
type Category = typeof CATEGORIES[number];

interface ExerciseFormProps {
  initialData?: Pick<Exercise, 'id' | 'name' | 'category'>;
  onSave: (exercise: Exercise) => void;
  onCancel: () => void;
}

export function ExerciseForm({ initialData, onSave, onCancel }: ExerciseFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [category, setCategory] = useState<Category>(
    (initialData?.category as Category) ?? 'Bryst'
  );
  const [nameError, setNameError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) { setNameError('Fyll inn navn på øvelsen'); return; }
    setNameError(null);
    setSaving(true);
    setError(null);
    try {
      const result = initialData
        ? await updateExercise(initialData.id, { name: name.trim(), category })
        : await createExercise({ name: name.trim(), category });
      onSave(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Klarte ikke lagre øvelsen');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        id="exercise-name"
        label="Navn"
        value={name}
        onChange={(e) => { setName(e.target.value); setNameError(null); }}
        placeholder="f.eks. Benkpress"
        errorText={nameError ?? undefined}
        maxLength={80}
        autoFocus
      />

      <div>
        <label htmlFor="exercise-category" className="text-sm text-accent-muted font-medium block mb-2">
          Kategori
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={[
                'px-3.5 py-1.5 rounded-full text-sm border transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                category === cat
                  ? 'bg-accent border-accent text-bg-base font-semibold'
                  : 'border-border-teal text-accent-muted hover:border-accent hover:text-accent',
              ].join(' ')}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <Button onClick={handleSave} loading={saving} className="flex-1">Lagre</Button>
        <Button variant="ghost" onClick={onCancel}>Avbryt</Button>
      </div>
    </div>
  );
}
