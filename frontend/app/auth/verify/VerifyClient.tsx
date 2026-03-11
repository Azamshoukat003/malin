'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function VerifyClient() {
  const search = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = search.get('token');
    if (!token) {
      setError('Dieser Link ist abgelaufen oder ungueltig.');
      return;
    }
    const run = async () => {
      try {
        await apiFetch(`/api/auth/verify?token=${encodeURIComponent(token)}`);
        router.replace('/dashboard');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Dieser Link ist abgelaufen oder ungueltig.');
      }
    };
    void run();
  }, [router, search]);

  if (!error) {
    return (
      <main className="container">
        <article className="mk-card" style={{ maxWidth: 560, margin: '0 auto' }}>
          <h1 className="mk-page-title">Anmeldung wird geprueft</h1>
          <p className="mk-page-lead">Bitte einen Moment warten.</p>
          <div className="mk-skeleton" style={{ marginTop: 16 }} />
        </article>
      </main>
    );
  }

  return (
    <main className="container">
      <article className="mk-card" style={{ maxWidth: 560, margin: '0 auto' }}>
        <h1 className="mk-page-title">Link ungueltig</h1>
        <p className="mk-error" style={{ marginTop: 10 }}>
          {error}
        </p>
        <div className="mk-actions">
          <Link href="/login" className="mk-admin-link">
            Zur Anmeldung
          </Link>
        </div>
      </article>
    </main>
  );
}
