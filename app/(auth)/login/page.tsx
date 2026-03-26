import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = { title: 'Logg inn — Pomp' };

export default function LoginPage() {
  return (
    <div className="min-h-svh flex items-center justify-center bg-bg-base px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-accent mb-1">pomp</h1>
          <p className="text-accent-muted text-sm">Treningslogg</p>
        </div>
        <div className="bg-bg-surface rounded-2xl border border-border-teal p-6 shadow-xl">
          <h2 className="text-text-primary font-semibold text-lg mb-6">Logg inn</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
