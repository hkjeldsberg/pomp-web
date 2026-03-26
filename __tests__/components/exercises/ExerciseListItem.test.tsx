import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExerciseListItem } from '@/components/exercises/ExerciseListItem';

const exercise = { id: 'e1', user_id: 'u1', name: 'Benkpress', category: 'bryst', created_at: '2025-01-01' };

describe('ExerciseListItem', () => {
  it('renders exercise name and category', () => {
    render(<ExerciseListItem exercise={exercise} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText('Benkpress')).toBeInTheDocument();
    expect(screen.getByText('bryst')).toBeInTheDocument();
  });

  it('renders edit and delete buttons (keyboard accessible)', () => {
    render(<ExerciseListItem exercise={exercise} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByRole('button', { name: /rediger/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /slett/i })).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    render(<ExerciseListItem exercise={exercise} onEdit={onEdit} onDelete={jest.fn()} />);
    await user.click(screen.getByRole('button', { name: /rediger/i }));
    expect(onEdit).toHaveBeenCalledWith(exercise);
  });
});
