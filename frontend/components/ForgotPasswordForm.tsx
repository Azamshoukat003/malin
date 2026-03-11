'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';

interface OtpRequestResponse {
  message: string;
}

interface ResetPasswordResponse {
  message: string;
}

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSendOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoadingSend(true);

    try {
      const result = await apiFetch<OtpRequestResponse>('/api/auth/forgot-password/request-otp', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      setOtpSent(true);
      toast.success(result.message);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Code konnte nicht gesendet werden';
      setError(message);
      toast.error(message);
    } finally {
      setLoadingSend(false);
    }
  };

  const onResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      const message = 'Passwoerter stimmen nicht ueberein';
      setError(message);
      toast.error(message);
      return;
    }

    setLoadingReset(true);
    try {
      const result = await apiFetch<ResetPasswordResponse>('/api/auth/forgot-password/reset', {
        method: 'POST',
        body: JSON.stringify({ email, otp, password })
      });

      toast.success(result.message);
      router.push('/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Passwort konnte nicht zurueckgesetzt werden';
      setError(message);
      toast.error(message);
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {!otpSent ? (
        <form onSubmit={onSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="mk-label" htmlFor="forgot-email" style={{ marginBottom: '8px', display: 'block' }}>
              E-Mail-Adresse
            </label>
            <Input
              id="forgot-email"
              type="email"
              required
              autoComplete="email"
              placeholder="deine@email.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={loadingSend}
            style={{
              alignSelf: 'flex-start',
              padding: '11px 28px',
              minWidth: '200px',
              display: 'inline-flex',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            {loadingSend ? (
              <>
                <Spinner />
                <span>Wird gesendet...</span>
              </>
            ) : (
              'OTP-Code anfordern'
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={onResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="mk-label" htmlFor="forgot-email-locked" style={{ marginBottom: '8px', display: 'block' }}>
              E-Mail-Adresse
            </label>
            <Input id="forgot-email-locked" type="email" value={email} disabled />
          </div>

          <div>
            <label className="mk-label" htmlFor="forgot-otp" style={{ marginBottom: '8px', display: 'block' }}>
              OTP-Code
            </label>
            <Input
              id="forgot-otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              title="Der OTP-Code muss genau 6 Ziffern lang sein (z.B. 123456)."
              minLength={6}
              maxLength={6}
              required
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
          </div>

          <div>
            <label className="mk-label" htmlFor="forgot-new-password" style={{ marginBottom: '8px', display: 'block' }}>
              Neues Passwort
            </label>
            <Input
              id="forgot-new-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              placeholder="Mindestens 8 Zeichen"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="mk-label" htmlFor="forgot-confirm-password" style={{ marginBottom: '8px', display: 'block' }}>
              Passwort bestätigen
            </label>
            <Input
              id="forgot-confirm-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              placeholder="Passwort wiederholen"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
            <Button
              type="submit"
              disabled={loadingReset}
              style={{
                padding: '11px 28px',
                minWidth: '200px',
                display: 'inline-flex',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              {loadingReset ? (
                <>
                  <Spinner />
                  <span>Wird gespeichert...</span>
                </>
              ) : (
                'Passwort speichern'
              )}
            </Button>

            <Button
              type="button"
              variant="secondary"
              disabled={loadingSend}
              onClick={() => {
                void apiFetch<OtpRequestResponse>('/api/auth/forgot-password/request-otp', {
                  method: 'POST',
                  body: JSON.stringify({ email })
                })
                  .then((result) => toast.success(result.message))
                  .catch((err: unknown) => {
                    const message = err instanceof Error ? err.message : 'Code konnte nicht gesendet werden';
                    toast.error(message);
                  });
              }}
            >
              Code erneut senden
            </Button>
          </div>
        </form>
      )}

      {error && <p className="mk-error">{error}</p>}

      <p className="muted" style={{ fontSize: '0.9rem' }}>
        Zurück zum{' '}
        <Link href="/login" style={{ color: 'var(--color-accent)', fontWeight: 700, textDecoration: 'none' }}>
          Einloggen
        </Link>
      </p>
    </div>
  );
}

