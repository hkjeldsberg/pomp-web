import { getWorkoutHistory } from '@/lib/db/workouts';
import { getRoutines } from '@/lib/db/routines';
import { HistoryList } from '@/components/history/HistoryList';

export const metadata = { title: 'Historikk — Pomp' };

export default async function HomePage() {
  const [sessions, routines] = await Promise.all([getWorkoutHistory(), getRoutines()]);
  return <HistoryList sessions={sessions} routines={routines} />;
}
