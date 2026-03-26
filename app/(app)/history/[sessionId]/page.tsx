import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getWorkoutDetail } from '@/lib/db/workouts';
import { SessionDetail } from '@/components/history/SessionDetail';

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function SessionDetailPage({ params }: Props) {
  const { sessionId } = await params;
  const supabase = await createClient();

  let workout;
  try {
    workout = await getWorkoutDetail(sessionId, supabase);
  } catch {
    notFound();
  }

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-accent-muted hover:text-accent transition-colors mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
      >
        ← Back
      </Link>
      <h1 className="text-text-primary text-2xl font-bold mb-2">
        Session — {new Date(workout.started_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
      </h1>
      <SessionDetail workout={workout} />
    </div>
  );
}
