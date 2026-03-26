import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/auth/LoginForm';

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({ error: null }),
    },
  }),
}));

// Mock next/navigation
const mockPush = jest.fn();
const mockRefresh = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

describe('LoginForm', () => {
  it('renders email and password fields and submit button', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/e-post/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/passord/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logg inn/i })).toBeInTheDocument();
  });

  it('shows validation error when submitted with empty fields', async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole('button', { name: /logg inn/i }));
    await waitFor(() => {
      expect(screen.getByText(/fyll inn/i)).toBeInTheDocument();
    });
  });

  it('calls signInWithPassword with entered credentials', async () => {
    const user = userEvent.setup();
    const { createClient } = require('@/lib/supabase/client');
    const mockSignIn = createClient().auth.signInWithPassword;

    render(<LoginForm />);
    await user.type(screen.getByLabelText(/e-post/i), 'test@test.com');
    await user.type(screen.getByLabelText(/passord/i), 'secret123');
    await user.click(screen.getByRole('button', { name: /logg inn/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'secret123',
      });
    });
  });

  it('displays error message on failed login', async () => {
    const user = userEvent.setup();
    const { createClient } = require('@/lib/supabase/client');
    createClient().auth.signInWithPassword.mockResolvedValueOnce({
      error: { message: 'Ugyldig e-post eller passord' },
    });

    render(<LoginForm />);
    await user.type(screen.getByLabelText(/e-post/i), 'bad@test.com');
    await user.type(screen.getByLabelText(/passord/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /logg inn/i }));

    await waitFor(() => {
      expect(screen.getByText(/ugyldig/i)).toBeInTheDocument();
    });
  });
});
