'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from 'sonner';

interface RegisterResponse {
  message: string;
}

export function UserRegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [childName, setChildName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      const message = 'Die Passwörter stimmen nicht überein';
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiFetch<RegisterResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          childName: childName.trim() || undefined
        })
      });

      toast.success('Konto erfolgreich erstellt');
      router.push('/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registrierung fehlgeschlagen';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label className="mk-label" htmlFor="register-email" style={{ marginBottom: '8px', display: 'block' }}>
          E-Mail-Adresse
        </label>
        <Input
          id="register-email"
          type="email"
          required
          autoComplete="email"
          placeholder="deine@email.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="mk-label" htmlFor="register-child-name" style={{ marginBottom: '8px', display: 'block' }}>
          Name des Kindes (optional)
        </label>
        <Input
          id="register-child-name"
          type="text"
          placeholder="z. B. Mia"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
        />
      </div>

      <div>
        <label className="mk-label" htmlFor="register-password" style={{ marginBottom: '8px', display: 'block' }}>
          Passwort
        </label>
        <Input
          id="register-password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Mindestens 8 Zeichen"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <label className="mk-label" htmlFor="register-confirm-password" style={{ marginBottom: '8px', display: 'block' }}>
          Passwort bestätigen
        </label>
        <Input
          id="register-confirm-password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Passwort wiederholen"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {error && <p className="mk-error">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full-mobile"
        style={{
          padding: '12px 28px',
          fontSize: '1rem',
          minWidth: '160px',
          display: 'inline-flex',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '8px'
        }}
      >
        {loading ? (
          <>
            <Spinner />
            <span>Wird erstellt...</span>
          </>
        ) : (
          'Registrieren'
        )}
      </Button>

      <p className="muted" style={{ fontSize: '0.9rem' }}>
        Bereits registriert?{' '}
        <Link href="/login" style={{ color: 'var(--color-accent)', fontWeight: 700, textDecoration: 'none' }}>
          Hier anmelden
        </Link>
      </p>
    </form>
  );
}
