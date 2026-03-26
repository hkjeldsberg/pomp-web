import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SetRow } from '@/components/workout/SetRow';

const baseProps = {
  setNumber: 1,
  workoutId: 'w1',
  exerciseId: 'e1',
  completed: false,
  onLog: jest.fn().mockResolvedValue(undefined),
  onToggleComplete: jest.fn().mockResolvedValue(undefined),
  onDelete: jest.fn().mockResolvedValue(undefined),
};

describe('SetRow', () => {
  it('renders set number and inputs for weight and reps', () => {
    render(<SetRow {...baseProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/kg/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/reps/i)).toBeInTheDocument();
  });

  it('shows previous session values as placeholder text', () => {
    render(<SetRow {...baseProps} previousWeight={80} previousReps={5} />);
    expect(screen.getByPlaceholderText('80 kg')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('5 reps')).toBeInTheDocument();
  });

  it('calls onLog when values are entered and log button pressed', async () => {
    const user = userEvent.setup();
    const onLog = jest.fn().mockResolvedValue(undefined);
    render(<SetRow {...baseProps} onLog={onLog} />);

    await user.type(screen.getByPlaceholderText(/kg/i), '100');
    await user.type(screen.getByPlaceholderText(/reps/i), '5');
    await user.click(screen.getByRole('button', { name: /logg/i }));

    expect(onLog).toHaveBeenCalledWith({ weight: 100, reps: 5 });
  });

  it('applies completed styling when completed prop is true', () => {
    const { container } = render(<SetRow {...baseProps} completed={true} />);
    expect(container.firstChild).toHaveClass('opacity-60');
  });
});
