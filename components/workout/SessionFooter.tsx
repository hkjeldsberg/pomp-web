'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/Modal';

interface SessionFooterProps {
  workoutId: string;
  onEnd: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
}

export function SessionFooter({ workoutId, onEnd, onCancel }: SessionFooterProps) {
  const [endOpen, setEndOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleEnd() {
    setLoading(true);
    try { await onEnd(workoutId); } finally { setLoading(false); setEndOpen(false); }
  }

  async function handleCancel() {
    setLoading(true);
    try { await onCancel(workoutId); } finally { setLoading(false); setCancelOpen(false); }
  }

  return (
    <div className="flex gap-3 pb-4">
      <Button
        variant="primary"
        className="flex-1"
        onClick={() => setEndOpen(true)}
      >
        Avslutt økt
      </Button>
      <Button
        variant="ghost"
        onClick={() => setCancelOpen(true)}
      >
        Avbryt
      </Button>

      <ConfirmModal
        open={endOpen}
        onClose={() => setEndOpen(false)}
        onConfirm={handleEnd}
        title="Avslutt økt"
        message="Er du ferdig? Økten blir lagret."
        confirmLabel="Avslutt"
        loading={loading}
      />

      <ConfirmModal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
        title="Avbryt økt"
        message="Alle settene i denne økten blir slettet. Er du sikker?"
        confirmLabel="Avbryt økt"
        confirmVariant="danger"
        loading={loading}
      />
    </div>
  );
}
