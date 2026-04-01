import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SetRow } from '@/components/workout/SetRow';

const baseProps = {
  setNumber: 1,
  workoutId: 'w1',
  exerciseId: 'e1',
  completed: false,
  onLog: jest.fn().mockResolvedValue(undefined),
  onToggleComplete: jest.fn().mockResolvedValue(undefined),
};

describe('SetRow', () => {
  it('renders set number and inputs for weight and reps', () => {
    render(<SetRow {...baseProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/kg/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/reps/i)).toBeInTheDocument();
  });

  it('pre-fills inputs with previous session values as greyed text', () => {
    render(<SetRow {...baseProps} previousWeight={80} previousReps={5} />);
    expect((screen.getByLabelText(/weight set 1/i) as HTMLInputElement).value).toBe('80');
    expect((screen.getByLabelText(/reps set 1/i) as HTMLInputElement).value).toBe('5');
  });

  it('calls onLog when values are entered and checkmark button pressed', async () => {
    const user = userEvent.setup();
    const onLog = jest.fn().mockResolvedValue(undefined);
    render(<SetRow {...baseProps} onLog={onLog} />);

    await user.type(screen.getByPlaceholderText(/kg/i), '100');
    await user.type(screen.getByPlaceholderText(/reps/i), '5');
    await user.click(screen.getByRole('button', { name: /log set/i }));

    expect(onLog).toHaveBeenCalledWith({ weight: 100, reps: 5 });
  });

  it('calls onTimerStart after logging a set', async () => {
    const user = userEvent.setup();
    const onLog = jest.fn().mockResolvedValue(undefined);
    const onTimerStart = jest.fn();
    render(<SetRow {...baseProps} onLog={onLog} onTimerStart={onTimerStart} />);

    await user.type(screen.getByPlaceholderText(/kg/i), '100');
    await user.type(screen.getByPlaceholderText(/reps/i), '5');
    await user.click(screen.getByRole('button', { name: /log set/i }));

    expect(onTimerStart).toHaveBeenCalled();
  });

  it('applies completed styling when completed prop is true', () => {
    const { container } = render(<SetRow {...baseProps} completed={true} />);
    expect(container.firstChild).toHaveClass('opacity-50');
  });

  it('pre-filled weight input has at least 65% opacity class', () => {
    render(<SetRow {...baseProps} previousWeight={80} previousReps={5} />);
    const weightInput = screen.getByLabelText(/weight set 1/i);
    expect(weightInput.className).not.toMatch(/text-text-primary\/40/);
    expect(weightInput.className).toMatch(/text-text-primary\/65/);
  });

  it('selecting all text on focus when value is pre-filled (not dirty)', async () => {
    const user = userEvent.setup();
    render(<SetRow {...baseProps} previousWeight={80} previousReps={5} />);

    const weightInput = screen.getByLabelText(/weight set 1/i) as HTMLInputElement;
    await user.click(weightInput);
    expect(weightInput.value).toBe('80');
  });

  it('pre-filled values turn white (dirty) after pressing done without editing', async () => {
    const user = userEvent.setup();
    const onLog = jest.fn().mockResolvedValue(undefined);
    render(<SetRow {...baseProps} onLog={onLog} previousWeight={80} previousReps={5} />);

    await user.click(screen.getByRole('button', { name: /log set/i }));

    const weightInput = screen.getByLabelText(/weight set 1/i);
    const repsInput = screen.getByLabelText(/reps set 1/i);
    expect(weightInput.className).not.toMatch(/text-text-primary\/65/);
    expect(repsInput.className).not.toMatch(/text-text-primary\/65/);
  });
});
