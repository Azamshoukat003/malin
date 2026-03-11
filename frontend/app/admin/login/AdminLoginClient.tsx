'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AdminLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiFetch('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Anmeldung fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }}>

      {/* Left: Dark brand panel */}
      <div style={{
        background: 'var(--grad-hero)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px',
        color: 'white',
      }} className="mk-login-brand">

        {/* Top: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.6rem',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.5px'
            }}>MalinKiddy</span>
          </Link>
          <span style={{
            padding: '3px 10px',
            background: 'rgba(255,255,255,0.12)',
            borderRadius: '99px',
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Admin
          </span>
        </div>

        {/* Centre: Feature highlights */}
        <div>
          <div style={{
            display: 'inline-block',
            padding: '6px 16px',
            background: 'rgba(212, 163, 115, 0.2)',
            borderRadius: '99px',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '24px',
            color: 'var(--color-accent)'
          }}>
            Systemzugang
          </div>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 2.5vw, 2.5rem)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            lineHeight: 1.25,
            marginBottom: '20px'
          }}>
            Willkommen im<br />Admin-Bereich.
          </h2>
          <p style={{ opacity: 0.7, lineHeight: 1.7, maxWidth: '340px', fontSize: '1rem' }}>
            Verwalte QR-Codes, überwache Uploads und behalte den Überblick über alle Nutzerdaten.
          </p>

          {/* Feature list */}
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '📊', text: 'Echtzeit-Statistiken' },
              { icon: '🖨️', text: 'QR-Batch Generierung' },
              { icon: '📁', text: 'Vollständiger Datenkatalog' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  width: '36px',
                  height: '36px',
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  flexShrink: 0
                }}>{icon}</span>
                <span style={{ opacity: 0.85, fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Security note */}
        <div style={{ opacity: 0.5, fontSize: '0.8rem' }}>
          🔒 Verschlüsselte Verbindung · Nur für autorisierte Personen
        </div>
      </div>

      {/* Right: Login form */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '64px 56px',
        background: 'var(--color-bg)',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }} className="animate-fade-up">

          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'var(--color-primary)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              marginBottom: '20px'
            }}>
              🛡️
            </div>
            <h1 style={{ fontSize: '1.9rem', color: 'var(--color-primary)', marginBottom: '8px' }}>
              Admin-Anmeldung
            </h1>
            <p className="muted" style={{ fontSize: '0.95rem' }}>
              Bitte melde dich mit deinen Admin-Zugangsdaten an.
            </p>
          </div>

          {/* Form */}
          <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => void onSubmit(e)}>
            <div>
              <label className="mk-label" htmlFor="admin-email" style={{ marginBottom: '8px', display: 'block' }}>
                Email-Adresse
              </label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@malinkiddy.com"
                required
              />
            </div>

            <div>
              <label className="mk-label" htmlFor="admin-password" style={{ marginBottom: '8px', display: 'block' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Input
                  id="admin-password"
                  type={showPassword ? 'text' : 'Password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                    lineHeight: 1,
                  }}
                  aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '12px 16px',
                background: 'rgba(230, 57, 70, 0.06)',
                border: '1px solid rgba(230, 57, 70, 0.2)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-error)',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ⚠️ {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              style={{ height: '50px', width: '100%', marginTop: '4px' }}
            >
              {loading ? 'Wird überprüft…' : 'Anmelden'}
            </Button>
          </form>

          {/* Footer */}
          <div style={{
            marginTop: '36px',
            paddingTop: '28px',
            borderTop: '1px solid var(--color-border)',
            textAlign: 'center'
          }}>
            <Link href="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
              ← Zurück zur Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
