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
        End workout
      </Button>
      <Button
        variant="ghost"
        onClick={() => setCancelOpen(true)}
      >
        Cancel
      </Button>

      <ConfirmModal
        open={endOpen}
        onClose={() => setEndOpen(false)}
        onConfirm={handleEnd}
        title="End workout"
        message="Done? The session will be saved."
        confirmLabel="End"
        loading={loading}
      />

      <ConfirmModal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
        title="Cancel workout"
        message="All sets in this session will be deleted. Are you sure?"
        confirmLabel="Cancel workout"
        confirmVariant="danger"
        loading={loading}
      />
    </div>
  );
}
