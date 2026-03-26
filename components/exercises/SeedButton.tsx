'use client';

import { useState } from 'react';
import { seedExercises } from '@/lib/db/exercises';
import { Button } from '@/components/ui/Button';

export function SeedButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSeed() {
    setLoading(true);
    setResult(null);
    try {
      const { inserted } = await seedExercises();
      setResult(inserted > 0 ? `${inserted} øvelser lagt til` : 'Allerede oppdatert');
    } catch {
      setResult('Klarte ikke legge til øvelser');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="secondary" size="sm" onClick={handleSeed} loading={loading}>
        Fyll inn standardøvelser
      </Button>
      {result && <span className="text-sm text-accent-muted">{result}</span>}
    </div>
  );
}
