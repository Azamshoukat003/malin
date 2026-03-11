import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />

      <main>
        <section
          className="mk-hero-section"
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '110px 0 130px',
            background: 'linear-gradient(180deg, rgba(253, 252, 249, 0.95) 0%, rgba(250, 237, 205, 0.4) 55%, rgba(253, 252, 249, 1) 100%)'
          }}
        >
          <div className="container" style={{ position: 'relative' }}>
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: '-80px',
                left: '-120px',
                width: '280px',
                height: '280px',
                background: 'radial-gradient(circle, var(--color-primary-soft) 0%, transparent 70%)',
                opacity: 0.7,
                filter: 'blur(10px)',
                zIndex: 0
              }}
            />
            <div
              aria-hidden
              style={{
                position: 'absolute',
                bottom: '-140px',
                right: '-120px',
                width: '320px',
                height: '320px',
                background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
                opacity: 0.25,
                filter: 'blur(18px)',
                zIndex: 0
              }}
            />

            <div className="mk-hero-content animate-fade-up" style={{ maxWidth: '860px' }}>
              <span className="mk-badge mk-badge-accent" style={{ marginBottom: '18px' }}>
                404 - Seite nicht gefunden
              </span>
              <h1 className="mk-hero-title" style={{ marginBottom: '16px' }}>
                Diese Seite gibt es leider nicht.
              </h1>
              <p className="mk-hero-lead" style={{ marginBottom: '32px' }}>
                Vielleicht wurde der Link geaendert oder die Adresse ist nicht korrekt.
                Keine Sorge, wir bringen dich schnell zurueck auf den richtigen Weg.
              </p>

              <div className="mk-actions" style={{ justifyContent: 'center', marginBottom: '36px' }}>
                <Link href="/">
                  <Button style={{ padding: '14px 36px', fontSize: '1.05rem' }}>Zur Startseite</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="secondary" style={{ padding: '14px 30px', fontSize: '1.05rem' }}>Kontakt aufnehmen</Button>
                </Link>
              </div>

              <div
                className="mk-card"
                style={{
                  background: 'var(--grad-surface)',
                  border: '1px solid rgba(27, 67, 50, 0.08)',
                  boxShadow: 'var(--shadow-md)',
                  padding: '32px',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <p className="mk-label" style={{ marginBottom: '8px' }}>Schnellnavigation</p>
                    <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary)', marginBottom: '8px' }}>
                      Starte von hier aus neu.
                    </h2>
                    <p className="muted" style={{ marginBottom: '0' }}>
                      Die wichtigsten Bereiche sind nur einen Klick entfernt.
                    </p>
                  </div>
                  <span className="mk-badge" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                    Tipp
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '16px',
                    marginTop: '24px'
                  }}
                >
                  <Link href="/login" className="mk-card" style={{ padding: '20px', textDecoration: 'none', display: 'block' }}>
                    <p style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px' }}>Einloggen</p>
                    <p className="muted" style={{ fontSize: '0.9rem' }}>Zurueck zu deinem Konto.</p>
                  </Link>
                  <Link href="/about" className="mk-card" style={{ padding: '20px', textDecoration: 'none', display: 'block' }}>
                    <p style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px' }}>Ueber uns</p>
                    <p className="muted" style={{ fontSize: '0.9rem' }}>Mehr ueber MalinKiddy.</p>
                  </Link>
                  <Link href="/" className="mk-card" style={{ padding: '20px', textDecoration: 'none', display: 'block' }}>
                    <p style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px' }}>Startseite</p>
                    <p className="muted" style={{ fontSize: '0.9rem' }}>Zurueck zum Anfang.</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
