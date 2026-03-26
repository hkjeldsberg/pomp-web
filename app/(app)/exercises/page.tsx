import { createClient } from '@/lib/supabase/server';
import { getExercises } from '@/lib/db/exercises';
import { ExerciseList } from '@/components/exercises/ExerciseList';

export const metadata = { title: 'Exercises — Pomp' };

export default async function ExercisesPage() {
  const supabase = await createClient();
  const exercises = await getExercises(supabase);

  return (
    <div>
      <h1 className="text-text-primary text-2xl font-bold mb-6">Exercises</h1>
      <ExerciseList initialExercises={exercises} />
    </div>
  );
}
