import { render, screen } from '@testing-library/react';
import { ExerciseSection } from '@/components/workout/ExerciseSection';
import type { ActiveSet } from '@/lib/hooks/useActiveWorkout';

const baseProps = {
  exerciseId: 'e1',
  exerciseName: 'Bench Press',
  category: 'chest',
  workoutId: 'w1',
  previousSets: [],
  onLog: jest.fn().mockResolvedValue(undefined),
  onToggleComplete: jest.fn().mockResolvedValue(undefined),
  onDeleteSet: jest.fn().mockResolvedValue(undefined),
};

function makeSet(setNumber: number): ActiveSet {
  return {
    id: `s${setNumber}`,
    workout_id: 'w1',
    exercise_id: 'e1',
    set_number: setNumber,
    weight_kg: 100,
    reps: 5,
    completed: true,
    logged_at: '2026-01-01T00:00:00Z',
  };
}

describe('ExerciseSection', () => {
  it('shows exactly 3 rows when 3 sets are logged (no extra row)', () => {
    const loggedSets: ActiveSet[] = [makeSet(1), makeSet(2), makeSet(3)];
    render(<ExerciseSection {...baseProps} loggedSets={loggedSets} />);
    // Each row has an aria-label like "Weight set N"
    const weightInputs = screen.getAllByLabelText(/weight set/i);
    expect(weightInputs).toHaveLength(3);
  });
});
