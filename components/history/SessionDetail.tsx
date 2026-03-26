import type { WorkoutDetail } from '@/lib/db/workouts';
import { Badge } from '@/components/ui/Badge';

interface SessionDetailProps {
  workout: WorkoutDetail;
}

export function SessionDetail({ workout }: SessionDetailProps) {
  const startedAt = new Date(workout.started_at);
  const endedAt = workout.ended_at ? new Date(workout.ended_at) : null;
  const duration = endedAt
    ? Math.round((endedAt.getTime() - startedAt.getTime()) / 60000)
    : null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6 text-accent-muted text-sm">
        <span>{startedAt.toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        {duration !== null && <span>{duration} min</span>}
      </div>

      <div className="flex flex-col gap-4">
        {workout.exercises.map(({ exercise, sets }) => (
          <div key={exercise.id} className="rounded-xl bg-bg-card border border-border-teal p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-text-primary font-semibold">{exercise.name}</span>
              <Badge label={exercise.category} />
            </div>
            <div className="grid grid-cols-4 text-xs text-accent-muted mb-2 px-1">
              <span>Sett</span>
              <span>Vekt</span>
              <span>Reps</span>
              <span>Notat</span>
            </div>
            {sets
              .sort((a, b) => a.set_number - b.set_number)
              .map((s) => (
                <div
                  key={s.id}
                  className={['grid grid-cols-4 py-2 px-1 border-b border-border-teal/30 last:border-0 text-sm', s.completed ? 'text-text-primary' : 'text-text-primary/50'].join(' ')}
                >
                  <span>{s.set_number}</span>
                  <span>{s.weight_kg} kg</span>
                  <span>{s.reps}</span>
                  <span className="text-accent-muted truncate">{s.note ?? '—'}</span>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
