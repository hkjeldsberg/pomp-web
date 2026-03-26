import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExercisePickerModal } from '@/components/statistics/ExercisePickerModal';

const exercises = [
  { id: 'e1', user_id: 'u1', name: 'Bench press', category: 'bryst', created_at: '2025-01-01' },
  { id: 'e2', user_id: 'u1', name: 'Deadlift', category: 'rygg', created_at: '2025-01-01' },
  { id: 'e3', user_id: 'u1', name: 'Squat', category: 'bein', created_at: '2025-01-01' },
];

describe('ExercisePickerModal', () => {
  it('renders all exercises', () => {
    render(<ExercisePickerModal open exercises={exercises} onSelect={jest.fn()} onClose={jest.fn()} />);
    expect(screen.getByText('Bench press')).toBeInTheDocument();
    expect(screen.getByText('Deadlift')).toBeInTheDocument();
  });

  it('filters exercises by search input', async () => {
    const user = userEvent.setup();
    render(<ExercisePickerModal open exercises={exercises} onSelect={jest.fn()} onClose={jest.fn()} />);
    await user.type(screen.getByPlaceholderText(/search/i), 'Dead');
    expect(screen.getByText('Deadlift')).toBeInTheDocument();
    expect(screen.queryByText('Bench press')).not.toBeInTheDocument();
  });

  it('calls onSelect when an exercise is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    render(<ExercisePickerModal open exercises={exercises} onSelect={onSelect} onClose={jest.fn()} />);
    await user.click(screen.getByText('Bench press'));
    expect(onSelect).toHaveBeenCalledWith(exercises[0]);
  });

  it('does not render when open is false', () => {
    render(<ExercisePickerModal open={false} exercises={exercises} onSelect={jest.fn()} onClose={jest.fn()} />);
    expect(screen.queryByText('Bench press')).not.toBeInTheDocument();
  });
});
