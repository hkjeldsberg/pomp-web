import { render, screen } from '@testing-library/react';
import { ActiveWorkout } from '@/components/workout/ActiveWorkout';
import type { RoutineWithExercises } from '@/lib/db/routines';
import { useRestTimer } from '@/lib/hooks/useRestTimer';

const mockUseRestTimer = useRestTimer as jest.Mock;

jest.mock('@/lib/hooks/useActiveWorkout', () => ({
  useActiveWorkout: () => ({
    sets: [],
    setSets: jest.fn(),
    logSet: jest.fn(),
    editSet: jest.fn(),
    toggleComplete: jest.fn(),
    deleteSets: jest.fn(),
    endSession: jest.fn(),
    cancelSession: jest.fn(),
    onError: null,
  }),
}));

jest.mock('@/lib/hooks/useRestTimer', () => ({
  useRestTimer: jest.fn().mockReturnValue({
    secondsRemaining: null,
    totalSeconds: null,
    isRunning: false,
    startTimer: jest.fn(),
    stopTimer: jest.fn(),
    resetTimer: jest.fn(),
  }),
}));

const routine: RoutineWithExercises = {
  id: 'r1',
  user_id: 'u1',
  name: 'Push A',
  created_at: '2025-01-01',
  exercises: [
    {
      order_index: 0,
      exercise: { id: 'e1', user_id: 'u1', name: 'Benkpress', category: 'bryst', created_at: '2025-01-01' },
    },
    {
      order_index: 1,
      exercise: { id: 'e2', user_id: 'u1', name: 'Skulderpress', category: 'skuldre', created_at: '2025-01-01' },
    },
  ],
};

describe('ActiveWorkout', () => {
  it('renders all exercises from the routine', () => {
    render(
      <ActiveWorkout
        workoutId="w1"
        routine={routine}
        startedAt="2025-01-01T10:00:00Z"
        previousSets={{}}
      />
    );
    expect(screen.getByText('Benkpress')).toBeInTheDocument();
    expect(screen.getByText('Skulderpress')).toBeInTheDocument();
  });

  it('renders 3 set rows by default per exercise', () => {
    render(
      <ActiveWorkout
        workoutId="w1"
        routine={routine}
        startedAt="2025-01-01T10:00:00Z"
        previousSets={{}}
      />
    );
    // 2 exercises × 3 default sets = 6 set-number elements showing "1", "2", "3"
    const ones = screen.getAllByText('1');
    expect(ones.length).toBeGreaterThanOrEqual(2);
  });
});

describe('ActiveWorkout — rest timer visible', () => {
  beforeEach(() => {
    mockUseRestTimer.mockReturnValue({
      secondsRemaining: 90,
      totalSeconds: 120,
      isRunning: true,
      startTimer: jest.fn(),
      stopTimer: jest.fn(),
      resetTimer: jest.fn(),
    });
  });

  afterEach(() => {
    mockUseRestTimer.mockReturnValue({
      secondsRemaining: null,
      totalSeconds: null,
      isRunning: false,
      startTimer: jest.fn(),
      stopTimer: jest.fn(),
      resetTimer: jest.fn(),
    });
  });

  it('shows rest timer pill with seconds', () => {
    render(
      <ActiveWorkout
        workoutId="w1"
        routine={routine}
        startedAt="2025-01-01T10:00:00Z"
        previousSets={{}}
      />
    );
    expect(screen.getByText(/rest 90s/i)).toBeInTheDocument();
  });

  it('shows dismiss button on rest timer', () => {
    render(
      <ActiveWorkout
        workoutId="w1"
        routine={routine}
        startedAt="2025-01-01T10:00:00Z"
        previousSets={{}}
      />
    );
    expect(screen.getByRole('button', { name: /dismiss rest timer/i })).toBeInTheDocument();
  });

  it('adds bottom padding to main container when timer is visible', () => {
    const { container } = render(
      <ActiveWorkout
        workoutId="w1"
        routine={routine}
        startedAt="2025-01-01T10:00:00Z"
        previousSets={{}}
      />
    );
    expect(container.firstChild).toHaveClass('pb-28');
  });
});
