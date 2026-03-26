'use client';

import { useState } from 'react';
import type { Exercise } from '@/supabase/types';

interface ExercisePickerModalProps {
  open: boolean;
  exercises: Exercise[];
  selectedId?: string | null;
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
}

export function ExercisePickerModal({ open, exercises, selectedId, onSelect, onClose }: ExercisePickerModalProps) {
  const [query, setQuery] = useState('');

  if (!open) return null;

  const filtered = query.trim()
    ? exercises.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()))
    : exercises;

  function handleSelect(ex: Exercise) {
    onSelect(ex);
    setQuery('');
    onClose();
  }

  return (
    <div role="dialog" aria-modal="true" aria-label="Select exercise" className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-sm bg-bg-surface border border-border-teal rounded-2xl flex flex-col max-h-[80vh] shadow-xl">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <span className="text-text-primary font-semibold">Select exercise</span>
          <button onClick={onClose} className="text-accent-muted hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-2 py-1">
            Close
          </button>
        </div>
        <div className="px-4 pb-2">
          <input
            type="search"
            placeholder="Search exercises…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full h-10 rounded-lg bg-bg-card border border-border-teal px-3 text-text-primary placeholder:text-accent-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm"
          />
        </div>
        <div className="overflow-y-auto flex-1 px-2 pb-2">
          {filtered.length === 0 ? (
            <p className="text-accent-muted text-sm py-6 text-center">No exercises found</p>
          ) : filtered.map((ex) => (
            <button
              key={ex.id}
              onClick={() => handleSelect(ex)}
              className={[
                'w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm mb-0.5 transition-colors',
                'hover:bg-bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                ex.id === selectedId ? 'bg-accent/10 text-accent' : 'text-text-primary',
              ].join(' ')}
            >
              <span>{ex.name}</span>
              <span className="text-accent-muted text-xs">{ex.category}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
