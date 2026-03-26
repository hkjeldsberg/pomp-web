import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoutineCard } from '@/components/routines/RoutineCard';

const routine = {
  id: 'r1',
  user_id: 'u1',
  name: 'Push A',
  created_at: '2025-01-01',
  exercises: [
    { order_index: 0, exercise: { id: 'e1', user_id: 'u1', name: 'Bench press', category: 'bryst', created_at: '2025-01-01' } },
    { order_index: 1, exercise: { id: 'e2', user_id: 'u1', name: 'Shoulder press', category: 'skuldre', created_at: '2025-01-01' } },
  ],
};

describe('RoutineCard', () => {
  it('renders routine name and exercise count', () => {
    render(<RoutineCard routine={routine} onStart={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText('Push A')).toBeInTheDocument();
    expect(screen.getByText(/2 exercise/)).toBeInTheDocument();
  });

  it('calls onStart when Start button is clicked', async () => {
    const user = userEvent.setup();
    const onStart = jest.fn();
    render(<RoutineCard routine={routine} onStart={onStart} onEdit={jest.fn()} onDelete={jest.fn()} />);
    await user.click(screen.getByRole('button', { name: /start/i }));
    expect(onStart).toHaveBeenCalledWith('r1');
  });

  it('shows edit and delete buttons', async () => {
    const user = userEvent.setup();
    render(<RoutineCard routine={routine} onStart={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });
});
