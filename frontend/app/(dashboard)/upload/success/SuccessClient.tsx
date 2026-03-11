'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function SuccessClient() {
  const search = useSearchParams();
  const code = search.get('code');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-surface-warm)', display: 'grid', placeItems: 'center', padding: '24px' }}>
      <main style={{ width: '100%', maxWidth: '600px' }} className="animate-fade-up">
        <article className="mk-card text-center" style={{ padding: '60px 40px' }}>
          <div style={{ fontSize: '5rem', marginBottom: '24px' }}>🎉</div>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '16px', color: 'var(--color-primary)' }}>
            Wunderbar!
          </h1>
          <p className="muted" style={{ marginBottom: '32px', fontSize: '1.2rem' }}>
            Deine Audio-Erinnerung wurde erfolgreich gespeichert und ist jetzt mit dem QR-Code verknüpft.
          </p>

          <div style={{
            padding: '24px',
            background: 'white',
            border: '2px solid var(--color-primary-soft)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '40px',
            textAlign: 'left'
          }}>
            <p className="mk-label" style={{ marginBottom: '4px' }}>Sticker Code</p>
            <p style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '16px' }}>{code ?? '-'}</p>

            <p className="mk-label" style={{ marginBottom: '4px' }}>Direkter Hör-Link</p>
            <p className="muted" style={{ fontSize: '0.9rem', wordBreak: 'break-all' }}>
              {code ? `${appUrl}/play/${code}` : '-'}
            </p>
          </div>

          <div className="mk-actions" style={{ justifyContent: 'center' }}>
            <Link href="/dashboard">
              <Button style={{ padding: '14px 40px' }}>Zurück zur Übersicht</Button>
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
