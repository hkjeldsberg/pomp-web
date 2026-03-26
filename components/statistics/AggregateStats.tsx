import { formatStatNumber } from '@/lib/utils/format';
import type { AggregateStats as AggStats } from '@/lib/db/statistics';

interface AggregateStatsProps {
  stats: AggStats;
}

const CELLS = [
  { key: 'totalSessions' as const, label: 'Sessions' },
  { key: 'totalSets' as const, label: 'Sets' },
  { key: 'totalReps' as const, label: 'Reps' },
  { key: 'totalVolumeKg' as const, label: 'Volume (kg)' },
];

export function AggregateStats({ stats }: AggregateStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {CELLS.map(({ key, label }) => (
        <div key={key} className="rounded-xl bg-bg-card border border-border-teal p-4 text-center">
          <p className="text-2xl font-bold text-accent tabular-nums">{formatStatNumber(stats[key])}</p>
          <p className="text-accent-muted text-sm mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}
