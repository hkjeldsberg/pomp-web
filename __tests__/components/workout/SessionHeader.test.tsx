import { render, screen, act } from '@testing-library/react';
import { SessionHeader } from '@/components/workout/SessionHeader';

describe('SessionHeader', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('displays the routine name', () => {
    render(<SessionHeader routineName="Push A" startedAt={new Date().toISOString()} />);
    expect(screen.getByText('Push A')).toBeInTheDocument();
  });

  it('shows elapsed time starting at 0:00', () => {
    render(<SessionHeader routineName="Test" startedAt={new Date().toISOString()} />);
    expect(screen.getByText('0:00')).toBeInTheDocument();
  });

  it('increments elapsed time after 1 minute', () => {
    const start = new Date(Date.now() - 60_000).toISOString();
    render(<SessionHeader routineName="Test" startedAt={start} />);
    act(() => jest.advanceTimersByTime(1000));
    expect(screen.getByText(/1:0/)).toBeInTheDocument();
  });
});
