import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getRoutines } from '@/lib/db/routines';
import { getOpenWorkout, getPreviousSessionSetDetails } from '@/lib/db/workouts';
import { ActiveWorkout } from '@/components/workout/ActiveWorkout';
import type { WorkoutSet } from '../../../../supabase/types';

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function WorkoutPage({ params }: Props) {
  const { sessionId } = await params;
  const supabase = await createClient();

  // Verify session exists and belongs to this user
  const { data: workout } = await supabase
    .from('workouts')
    .select('*')
    .eq('id', sessionId)
    .is('ended_at', null)
    .maybeSingle();

  if (!workout) notFound();

  const routines = await getRoutines();
  const routine = routines.find((r) => r.id === workout.routine_id);
  if (!routine) notFound();

  // Load existing sets for this workout
  const { data: existingSets } = await supabase
    .from('workout_sets')
    .select('*')
    .eq('workout_id', sessionId)
    .order('set_number', { ascending: true });

  // Load previous session sets for each exercise
  const previousSetsMap: Record<string, Awaited<ReturnType<typeof getPreviousSessionSetDetails>>> = {};
  if (workout.routine_id) {
    await Promise.all(
      routine.exercises.map(async ({ exercise }) => {
        previousSetsMap[exercise.id] = await getPreviousSessionSetDetails(
          workout.routine_id!,
          exercise.id
        );
      })
    );
  }

  const initialSets = ((existingSets ?? []) as unknown as WorkoutSet[]).map((s) => ({
    ...s,
    weight_kg: s.weight_kg as number,
    reps: s.reps as number,
  }));

  return (
    <ActiveWorkout
      workoutId={sessionId}
      routine={routine}
      startedAt={workout.started_at as string}
      previousSets={previousSetsMap}
      initialSets={initialSets}
    />
  );
}
