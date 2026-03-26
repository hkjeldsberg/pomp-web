import { createClient } from '@/lib/supabase/server';
import { getWorkoutHistory } from '@/lib/db/workouts';
import { getRoutines } from '@/lib/db/routines';
import { HistoryList } from '@/components/history/HistoryList';

export const metadata = { title: 'History — Pomp' };

export default async function HomePage() {
  const supabase = await createClient();
  const [sessions, routines] = await Promise.all([
    getWorkoutHistory(supabase),
    getRoutines(supabase),
  ]);
  return <HistoryList sessions={sessions} routines={routines} />;
}
