'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password || !confirm) {
      setError('Fyll inn alle feltene');
      return;
    }
    if (password !== confirm) {
      setError('Passordene stemmer ikke overens');
      return;
    }
    if (password.length < 6) {
      setError('Passordet må være minst 6 tegn');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push('/');
      router.refresh();
    }, 1500);
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <p className="text-accent text-lg font-semibold mb-2">Konto opprettet!</p>
        <p className="text-accent-muted text-sm">Sjekk e-posten din for bekreftelse.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        id="email"
        label="E-post"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="din@epost.no"
        required
      />
      <Input
        id="password"
        label="Passord"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
      />
      <Input
        id="confirm"
        label="Bekreft passord"
        type="password"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="••••••••"
        required
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button type="submit" loading={loading} className="w-full mt-2">
        Opprett konto
      </Button>
      <p className="text-center text-sm text-accent-muted">
        Har du konto?{' '}
        <Link href="/login" className="text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
          Logg inn
        </Link>
      </p>
    </form>
  );
}
