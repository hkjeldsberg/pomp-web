import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/auth/LoginForm';

// Module-level mock references (must start with "mock" to be hoisted with jest.mock)
const mockSignInWithPassword = jest.fn().mockResolvedValue({ error: null });
const mockSupabaseClient = { auth: { signInWithPassword: mockSignInWithPassword } };

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabaseClient,
}));

const mockRouterPush = jest.fn();
const mockRouterRefresh = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush, refresh: mockRouterRefresh }),
}));

beforeEach(() => {
  mockSignInWithPassword.mockReset();
  mockSignInWithPassword.mockResolvedValue({ error: null });
  mockRouterPush.mockReset();
});

describe('LoginForm', () => {
  it('renders email and password fields and submit button', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation error when submitted with empty fields', async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/please enter/i)).toBeInTheDocument();
    });
  });

  it('calls signInWithPassword with entered credentials', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.type(screen.getByLabelText(/email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/password/i), 'secret123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'secret123',
      });
    });
  });

  it('displays error message on failed login', async () => {
    const user = userEvent.setup();
    mockSignInWithPassword.mockResolvedValueOnce({
      error: { message: 'Invalid email or password' },
    });

    render(<LoginForm />);
    await user.type(screen.getByLabelText(/email/i), 'bad@test.com');
    await user.type(screen.getByLabelText(/password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid/i)).toBeInTheDocument();
    });
  });
});
