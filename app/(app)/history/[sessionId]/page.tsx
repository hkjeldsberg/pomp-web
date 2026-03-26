import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getWorkoutDetail } from '@/lib/db/workouts';
import { SessionDetail } from '@/components/history/SessionDetail';

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function SessionDetailPage({ params }: Props) {
  const { sessionId } = await params;

  let workout;
  try {
    workout = await getWorkoutDetail(sessionId);
  } catch {
    notFound();
  }

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-accent-muted hover:text-accent transition-colors mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
      >
        ← Tilbake
      </Link>
      <h1 className="text-text-primary text-2xl font-bold mb-2">
        {workout.exercises[0]?.exercise?.name ? 'Økt — ' + new Date(workout.started_at).toLocaleDateString('nb-NO') : 'Økt'}
      </h1>
      <SessionDetail workout={workout} />
    </div>
  );
}
