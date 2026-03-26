import { notFound } from 'next/navigation';
import { getRoutines } from '@/lib/db/routines';
import { getExercises } from '@/lib/db/exercises';
import { RoutineEditor } from '@/components/routines/RoutineEditor';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RoutineEditorPage({ params }: Props) {
  const { id } = await params;
  const [allExercises, routines] = await Promise.all([getExercises(), getRoutines()]);

  if (id === 'new') {
    return (
      <div>
        <h1 className="text-text-primary text-2xl font-bold mb-6">Ny rutine</h1>
        <RoutineEditor allExercises={allExercises} />
      </div>
    );
  }

  const routine = routines.find((r) => r.id === id);
  if (!routine) notFound();

  return (
    <div>
      <h1 className="text-text-primary text-2xl font-bold mb-6">Rediger rutine</h1>
      <RoutineEditor allExercises={allExercises} initial={routine} />
    </div>
  );
}
