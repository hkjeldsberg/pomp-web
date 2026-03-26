import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExerciseForm } from '@/components/exercises/ExerciseForm';

jest.mock('@/lib/db/exercises', () => ({
  createExercise: jest.fn().mockResolvedValue({ id: 'e1', name: 'Ny øvelse', category: 'bryst' }),
  updateExercise: jest.fn().mockResolvedValue({ id: 'e1', name: 'Oppdatert', category: 'bryst' }),
}));

describe('ExerciseForm', () => {
  it('renders name input and category select', () => {
    render(<ExerciseForm onSave={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByLabelText(/navn/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/kategori/i)).toBeInTheDocument();
  });

  it('shows error when name is empty on submit', async () => {
    const user = userEvent.setup();
    render(<ExerciseForm onSave={jest.fn()} onCancel={jest.fn()} />);
    await user.click(screen.getByRole('button', { name: /lagre/i }));
    await waitFor(() => {
      expect(screen.getByText(/fyll inn navn/i)).toBeInTheDocument();
    });
  });

  it('calls onSave after successful creation', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();
    render(<ExerciseForm onSave={onSave} onCancel={jest.fn()} />);
    await user.type(screen.getByLabelText(/navn/i), 'Benkpress');
    await user.click(screen.getByRole('button', { name: /lagre/i }));
    await waitFor(() => expect(onSave).toHaveBeenCalled());
  });

  it('pre-fills fields when editing an existing exercise', () => {
    render(
      <ExerciseForm
        initialData={{ id: 'e1', name: 'Benkpress', category: 'bryst' }}
        onSave={jest.fn()}
        onCancel={jest.fn()}
      />
    );
    expect(screen.getByDisplayValue('Benkpress')).toBeInTheDocument();
  });
});
