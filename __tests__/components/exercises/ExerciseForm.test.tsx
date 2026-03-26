import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExerciseForm } from '@/components/exercises/ExerciseForm';

jest.mock('@/lib/db/exercises', () => ({
  createExercise: jest.fn().mockResolvedValue({ id: 'e1', user_id: 'u1', name: 'Bench press', category: 'Bryst', created_at: '2025-01-01' }),
  updateExercise: jest.fn().mockResolvedValue({ id: 'e1', user_id: 'u1', name: 'Updated', category: 'Bryst', created_at: '2025-01-01' }),
}));

describe('ExerciseForm', () => {
  it('renders name input and category pill buttons', () => {
    render(<ExerciseForm onSave={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    // Category is rendered as pill buttons — verify at least one category is visible
    expect(screen.getByRole('button', { name: 'Bryst' })).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('shows error when name is empty on submit', async () => {
    const user = userEvent.setup();
    render(<ExerciseForm onSave={jest.fn()} onCancel={jest.fn()} />);
    await user.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => {
      expect(screen.getByText(/enter exercise name/i)).toBeInTheDocument();
    });
  });

  it('calls onSave after successful creation', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();
    render(<ExerciseForm onSave={onSave} onCancel={jest.fn()} />);
    await user.type(screen.getByLabelText(/name/i), 'Bench press');
    await user.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => expect(onSave).toHaveBeenCalled());
  });

  it('pre-fills name field when editing an existing exercise', () => {
    render(
      <ExerciseForm
        initialData={{ id: 'e1', name: 'Bench press', category: 'Bryst' }}
        onSave={jest.fn()}
        onCancel={jest.fn()}
      />
    );
    expect(screen.getByDisplayValue('Bench press')).toBeInTheDocument();
  });
});
