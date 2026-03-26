import { render, screen } from '@testing-library/react';
import { SessionCard } from '@/components/history/SessionCard';

const session = {
  id: 's1',
  started_at: '2025-03-01T10:00:00Z',
  ended_at: '2025-03-01T11:05:00Z',
  routine_name: 'Push A',
  set_count: 12,
  duration_minutes: 65,
};

describe('SessionCard', () => {
  it('renders routine name', () => {
    render(<SessionCard session={session} />);
    expect(screen.getByText('Push A')).toBeInTheDocument();
  });

  it('renders set count', () => {
    render(<SessionCard session={session} />);
    expect(screen.getByText(/12/)).toBeInTheDocument();
  });

  it('renders duration', () => {
    render(<SessionCard session={session} />);
    expect(screen.getByText(/65/)).toBeInTheDocument();
  });

  it('renders a link to the session detail', () => {
    render(<SessionCard session={session} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/history/s1');
  });
});
