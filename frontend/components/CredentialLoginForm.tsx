'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from 'sonner';

interface LoginResponse {
  role: 'user' | 'admin';
}

export function CredentialLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await apiFetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      toast.success('Anmeldung erfolgreich');
      router.push(result.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Anmeldung fehlgeschlagen';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label className="mk-label" htmlFor="login-email" style={{ marginBottom: '8px', display: 'block' }}>
          E-Mail-Adresse
        </label>
        <Input
          id="login-email"
          type="email"
          required
          autoComplete="email"
          placeholder="deine@email.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="mk-label" htmlFor="login-password" style={{ marginBottom: '8px', display: 'block' }}>
          Passwort
        </label>
        <Input
          id="login-password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Link href="/forgot-password" style={{ color: 'var(--color-accent)', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
        Passwort vergessen?
      </Link>

      {error && <p className="mk-error">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full-mobile"
        style={{
          padding: '12px 28px',
          fontSize: '1rem',
          minWidth: '140px',
          display: 'inline-flex',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '8px'
        }}
      >
        {loading ? (
          <>
            <Spinner />
            <span>Wird angemeldet...</span>
          </>
        ) : (
          'Einloggen'
        )}
      </Button>

      <p className="muted" style={{ fontSize: '0.9rem' }}>
        Noch kein Konto?{' '}
        <Link href="/register" style={{ color: 'var(--color-accent)', fontWeight: 700, textDecoration: 'none' }}>
          Jetzt registrieren
        </Link>
      </p>
    </form>
  );
}
