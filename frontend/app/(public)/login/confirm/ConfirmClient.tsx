'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function ConfirmClient() {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = window.setTimeout(() => setSeconds((v) => v - 1), 1000);
    return () => window.clearTimeout(id);
  }, [seconds]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-surface-warm)', display: 'grid', placeItems: 'center', padding: '24px' }}>
      <main style={{ width: '100%', maxWidth: '560px' }} className="animate-fade-up">
        <article className="mk-card text-center" style={{ padding: '60px 40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '24px' }}>✉️</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--color-primary)' }}>
            Post ist da!
          </h1>
          <p className="muted" style={{ marginBottom: '32px', fontSize: '1.1rem' }}>
            Wir haben dir einen sicheren Anmeldelink an dein Postfach geschickt. Bitte klicke darauf, um fortzufahren.
          </p>

          <div style={{
            padding: '16px',
            background: 'var(--color-surface-warm)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '32px'
          }}>
            <p className="muted" style={{ fontSize: '0.9rem' }}>
              Nichts erhalten? Schau im Spam-Ordner nach oder warte kurz.
            </p>
            <p style={{ marginTop: '8px', fontWeight: '700', color: 'var(--color-primary)' }}>
              {seconds > 0 ? `Neuer Link in ${seconds}s möglich` : 'Du kannst den Link jetzt erneut anfordern.'}
            </p>
          </div>

          <div className="mk-actions" style={{ justifyContent: 'center' }}>
            <Link href="/login">
              <Button variant="secondary">Zurück zur Anmeldung</Button>
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
