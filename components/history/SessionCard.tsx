import Link from 'next/link';
import type { WorkoutSummary } from '@/lib/db/workouts';

interface SessionCardProps {
  session: WorkoutSummary;
}

export function SessionCard({ session }: SessionCardProps) {
  const date = new Date(session.started_at);
  const dateStr = date.toLocaleDateString('nb-NO', { weekday: 'short', day: 'numeric', month: 'short' });
  const duration = Math.round(session.duration_minutes);

  return (
    <Link
      href={`/history/${session.id}`}
      className="block rounded-xl bg-bg-card border border-border-teal p-4 hover:border-accent/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-text-primary font-semibold text-base">
            {session.routine_name ?? 'Fri økt'}
          </p>
          <p className="text-accent-muted text-sm mt-0.5 capitalize">{dateStr}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-accent-muted text-sm">{session.set_count} sett</p>
          <p className="text-accent-muted text-sm">{duration} min</p>
        </div>
      </div>
    </Link>
  );
}
