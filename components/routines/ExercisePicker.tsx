'use client';

import { useState } from 'react';
import type { Exercise } from '@/supabase/types';
import { Button } from '@/components/ui/Button';

interface ExercisePickerProps {
  exercises: Exercise[];
  selectedIds: string[];
  onToggle: (exercise: Exercise) => void;
  onConfirm: (selectedIds: string[]) => void;
  onClose: () => void;
}

const CATEGORIES = ['Rygg', 'Bryst', 'Bein', 'Skuldre', 'Biceps', 'Triceps', 'Kjerne'] as const;

export function ExercisePicker({ exercises, selectedIds, onToggle, onConfirm, onClose }: ExercisePickerProps) {
  const [search, setSearch] = useState('');

  const filtered = exercises.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const sections: { title: string; data: Exercise[] }[] = CATEGORIES
    .map((cat) => ({ title: cat, data: filtered.filter((e) => e.category === cat) }))
    .filter((s) => s.data.length > 0);

  // Exercises not matching any category bucket
  const other = filtered.filter((e) => !(CATEGORIES as readonly string[]).includes(e.category));
  if (other.length > 0) sections.push({ title: 'Other', data: other });

  return (
    <div className="flex flex-col h-full">
      <input
        type="search"
        placeholder="Search exercises…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3 h-10 rounded-lg bg-bg-surface border border-border-teal px-3 text-text-primary placeholder:text-accent-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm"
        autoFocus
      />
      <div className="flex-1 overflow-y-auto min-h-0">
        {sections.map(({ title, data }) => (
          <div key={title}>
            <div className="sticky top-0 bg-bg-surface py-1.5">
              <span className="text-xs font-bold text-accent-muted uppercase tracking-wider">{title}</span>
            </div>
            {data.map((ex) => {
              const isSelected = selectedIds.includes(ex.id);
              return (
                <button
                  key={ex.id}
                  onClick={() => onToggle(ex)}
                  className={[
                    'w-full flex items-center justify-between py-3 px-2 border-b border-border-teal/40 text-sm',
                    'hover:bg-bg-card transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
                    isSelected ? 'bg-accent/5 text-accent' : 'text-text-primary',
                  ].join(' ')}
                >
                  <span>{ex.name}</span>
                  {isSelected && <span className="text-accent font-bold">✓</span>}
                </button>
              );
            })}
          </div>
        ))}
        {sections.length === 0 && (
          <p className="text-accent-muted text-sm py-8 text-center">No exercises found</p>
        )}
      </div>
      <div className="flex gap-2 pt-4 border-t border-border-teal mt-2">
        <Button onClick={() => onConfirm(selectedIds)} className="flex-1">
          Confirm ({selectedIds.length})
        </Button>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
}
