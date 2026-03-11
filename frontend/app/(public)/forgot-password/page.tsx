import type { Metadata } from 'next';
import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Passwort vergessen | MalinKiddy',
  description: 'Setze dein Passwort mit einem OTP-Code zurueck.'
};

export default function ForgotPasswordPage() {
  return (
    <div className="mk-auth-container">
      <div
        style={{
          background: 'var(--grad-hero)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 48px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
        className="mk-login-brand"
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.8rem',
                fontWeight: 800,
                color: 'white',
                letterSpacing: '-0.5px'
              }}
            >
              MalinKiddy
            </span>
          </Link>
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '99px',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.5px',
              marginBottom: '32px',
              backdropFilter: 'blur(10px)'
            }}
          >
            Sicherer Kontozugang
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: '24px'
            }}
          >
            Passwort
            <br />
            vergessen?
          </h1>
          <p style={{ opacity: 0.85, fontSize: '1.2rem', lineHeight: 1.6, maxWidth: '420px' }}>
            Keine Sorge, das passiert jedem mal. Wir schicken dir einen sicheren Code, um dein Konto wieder freizuschalten.
          </p>
        </div>

        <div
          style={{
            padding: '32px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(5px)',
            position: 'relative',
            zIndex: 2
          }}
        >
          <p style={{ opacity: 0.9, marginBottom: '16px', fontSize: '1rem' }}>
            Doch wieder eingefallen? Dann kannst du dich direkt mit deinen gewohnten Daten anmelden.
          </p>
          <Link href="/login" style={{
            color: 'white',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            Zurück zum Einloggen →
          </Link>
        </div>

        {/* Decorative element */}
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
          opacity: 0.2,
          filter: 'blur(40px)',
          zIndex: 1
        }} />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '64px 40px',
          background: 'var(--color-bg)'
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }} className="animate-fade-up">
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.4rem', color: 'var(--color-primary)', marginBottom: '12px' }}>
              Wiederherstellen
            </h2>
            <p className="muted">E-Mail eingeben und Code anfordern.</p>
          </div>

          <ForgotPasswordForm />

          <div
            style={{
              marginTop: '40px',
              paddingTop: '28px',
              borderTop: '1px solid var(--color-border)',
              textAlign: 'center'
            }}
          >
            <Link href="/" className="muted" style={{ fontSize: '0.9rem', display: 'inline-block', textDecoration: 'none' }}>
              ← Zurück zur Startseite
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

