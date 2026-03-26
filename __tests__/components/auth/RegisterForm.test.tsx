import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from '@/components/auth/RegisterForm';

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signUp: jest.fn().mockResolvedValue({ error: null }),
    },
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

describe('RegisterForm', () => {
  it('renders all form fields and submit button', () => {
    render(<RegisterForm />);
    expect(screen.getByLabelText(/e-post/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^passord$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bekreft passord/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /opprett konto/i })).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);
    await user.type(screen.getByLabelText(/e-post/i), 'test@test.com');
    await user.type(screen.getByLabelText(/^passord$/i), 'abc12345');
    await user.type(screen.getByLabelText(/bekreft passord/i), 'different');
    await user.click(screen.getByRole('button', { name: /opprett konto/i }));

    await waitFor(() => {
      expect(screen.getByText(/passordene stemmer ikke/i)).toBeInTheDocument();
    });
  });

  it('calls signUp on valid submission', async () => {
    const user = userEvent.setup();
    const { createClient } = require('@/lib/supabase/client');
    const mockSignUp = createClient().auth.signUp;

    render(<RegisterForm />);
    await user.type(screen.getByLabelText(/e-post/i), 'new@test.com');
    await user.type(screen.getByLabelText(/^passord$/i), 'secret123');
    await user.type(screen.getByLabelText(/bekreft passord/i), 'secret123');
    await user.click(screen.getByRole('button', { name: /opprett konto/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'new@test.com',
        password: 'secret123',
      });
    });
  });
});
