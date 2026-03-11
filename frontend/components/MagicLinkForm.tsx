'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Spinner } from './ui/Spinner';

export function MagicLinkForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiFetch<{ message: string }>('/api/auth/request-magic-link', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      router.push('/login/confirm');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label className="mk-label" htmlFor="email" style={{ marginBottom: '8px', display: 'block' }}>
          E-Mail-Adresse
        </label>
        <Input
          id="email"
          type="email"
          required
          placeholder="deine@email.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {error && <p className="mk-error">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        style={{ alignSelf: 'flex-start', padding: '11px 28px', fontSize: '0.95rem' }}
      >
        {loading ? <Spinner /> : 'Anmeldelink senden'}
      </Button>

      <p className="muted" style={{ fontSize: '0.85rem' }}>
        Wir schicken dir einen einmaligen, sicheren Link per E-Mail. Kein Passwort nötig.
      </p>
    </form>
  );
}
