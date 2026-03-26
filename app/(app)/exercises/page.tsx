import { getExercises } from '@/lib/db/exercises';
import { ExerciseList } from '@/components/exercises/ExerciseList';

export const metadata = { title: 'Øvelser — Pomp' };

export default async function ExercisesPage() {
  const exercises = await getExercises();

  return (
    <div>
      <h1 className="text-text-primary text-2xl font-bold mb-6">Øvelser</h1>
      <ExerciseList initialExercises={exercises} />
    </div>
  );
}
