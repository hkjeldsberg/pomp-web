'use client';

import { useEffect, useState } from 'react';

interface SessionHeaderProps {
  routineName: string;
  startedAt: string;
}

function formatElapsed(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export function SessionHeader({ routineName, startedAt }: SessionHeaderProps) {
  const [elapsed, setElapsed] = useState(Date.now() - new Date(startedAt).getTime());

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Date.now() - new Date(startedAt).getTime());
    }, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-text-primary text-xl font-bold truncate">{routineName}</h1>
      <span className="text-accent font-mono text-lg tabular-nums" aria-label="Elapsed time">
        {formatElapsed(elapsed)}
      </span>
    </div>
  );
}
