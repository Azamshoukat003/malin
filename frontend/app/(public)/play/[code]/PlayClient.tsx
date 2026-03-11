'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { AudioPlayer } from '@/components/AudioPlayer';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { Sparkles, Mic, Heart, Lock, ArrowRight, Music, UserCheck, LogIn } from 'lucide-react';

interface PlayData {
  code: string;
  yearLabel: number | null;
  childName: string | null;
  isAssigned: boolean;
  audio: {
    presignedUrl: string;
    durationSeconds: number | null;
    title: string | null;
  } | null;
}

export default function PlayClient() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const [data, setData] = useState<PlayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const [res, me] = await Promise.allSettled([
          apiFetch<PlayData | null>(`/api/play/${code}`),
          apiFetch<any>('/api/auth/me')
        ]);

        if (res.status === 'fulfilled') setData(res.value);
        if (me.status === 'fulfilled') setIsLoggedIn(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fehler');
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [code]);

  const onClaim = async () => {
    setIsClaiming(true);
    try {
      await apiFetch('/api/user/claim-qr', {
        method: 'POST',
        body: JSON.stringify({ code })
      });
      toast.success('Sticker erfolgreich aktiviert!');
      router.push(`/upload/${code}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Aktivierung fehlgeschlagen');
    } finally {
      setIsClaiming(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
        <Navbar variant="playback" />
        <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
          <div className="mk-skeleton" style={{ width: '300px', height: '100px' }} />
        </div>
      </div>
    );
  }

  // State: Error or No Data
  if (!data || error) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
        <Navbar variant="playback" />
        <main className="container" style={{ padding: '80px 24px', flex: 1, display: 'grid', placeItems: 'center' }}>
          <article className="mk-card text-center" style={{ maxWidth: '500px', padding: '48px' }}>
            <h1 style={{ color: 'var(--color-error)', marginBottom: '16px' }}>Code nicht gefunden</h1>
            <p className="muted">Dieser QR-Code scheint nicht in unserem System zu existieren.</p>
            <Link href="/" style={{ marginTop: '30px', display: 'inline-block' }}>
              <Button variant="secondary">Zur Startseite</Button>
            </Link>
          </article>
        </main>
      </div>
    );
  }

  // State: Unassigned (New Sticker)
  if (!data.isAssigned) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
        <Navbar variant="playback" />
        <main className="container animate-fade-up" style={{ padding: '60px 24px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '700px' }}>
            <article className="mk-card text-center" style={{ padding: '48px', background: 'var(--grad-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{ padding: '20px', background: 'var(--color-accent-light)', borderRadius: '50%', color: 'var(--color-accent)' }}>
                  <Sparkles size={48} />
                </div>
              </div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', marginBottom: '16px', color: 'var(--color-primary)' }}>Willkommen bei MalinKiddy!</h1>
              <p className="muted" style={{ fontSize: '1.1rem', marginBottom: '32px' }}>
                Dieser Sticker ist bereit für deine erste wertvolle Audio-Erinnerung.
              </p>

              <div className="mk-stat-grid" style={{ gap: '16px', textAlign: 'left', marginBottom: '32px' }}>
                <div style={{ padding: '20px', background: 'white', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                  <Mic size={24} style={{ color: 'var(--color-primary)', marginBottom: '12px' }} />
                  <h4 style={{ marginBottom: '4px' }}>Deine Stimme</h4>
                  <p className="muted" style={{ fontSize: '0.85rem' }}>Nimm eine persönliche Nachricht für dein Kind auf.</p>
                </div>
                <div style={{ padding: '20px', background: 'white', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                  <Heart size={24} style={{ color: 'var(--color-error)', marginBottom: '12px' }} />
                  <h4 style={{ marginBottom: '4px' }}>Für immer</h4>
                  <p className="muted" style={{ fontSize: '0.85rem' }}>Ein Erbe, das über Generationen hinweg bleibt.</p>
                </div>
                <div style={{ padding: '20px', background: 'white', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                  <Lock size={24} style={{ color: 'var(--color-success)', marginBottom: '12px' }} />
                  <h4 style={{ marginBottom: '4px' }}>Sicher & Privat</h4>
                  <p className="muted" style={{ fontSize: '0.85rem' }}>Nur du entscheidest, wer mithören darf.</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                {isLoggedIn ? (
                  <Button
                    onClick={() => void onClaim()}
                    disabled={isClaiming}
                    style={{ padding: '16px 40px', fontSize: '1.1rem', gap: '12px', width: '100%', maxWidth: '400px' }}
                  >
                    {isClaiming ? 'Wird aktiviert...' : 'Direkt deinem Konto hinzufügen'}
                    <UserCheck size={20} />
                  </Button>
                ) : (
                  <>
                    <Link href={`/register?code=${code}`} style={{ textDecoration: 'none', width: '100%', maxWidth: '400px' }}>
                      <Button style={{ padding: '16px 40px', fontSize: '1.1rem', gap: '12px', width: '100%' }}>
                        Jetzt registrieren & aktivieren
                        <ArrowRight size={20} />
                      </Button>
                    </Link>
                    <Link href={`/login?redirect=/play/${code}`} style={{ textDecoration: 'none', width: '100%', maxWidth: '400px' }}>
                      <Button variant="secondary" style={{ padding: '12px 32px', gap: '8px', width: '100%' }}>
                        Bereits ein Konto? Einloggen
                        <LogIn size={18} />
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </article>
          </div>
        </main>
      </div>
    );
  }

  // State: Assigned but No Audio
  if (!data.audio) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
        <Navbar variant="playback" />
        <main className="container animate-fade-up" style={{ padding: '60px 24px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <article className="mk-card text-center" style={{ padding: '60px 40px', maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <div style={{ padding: '20px', background: 'var(--color-primary-soft)', borderRadius: '50%', color: 'var(--color-primary)' }}>
                <Music size={48} />
              </div>
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--color-primary)' }}>Stumm geschaltet</h1>
            <p className="muted" style={{ marginBottom: '32px' }}>
              Dieser Sticker wurde bereits aktiviert, aber es wurde noch keine Erinnerung hochgeladen.
              {data.childName ? ` Melde dich an, um eine Nachricht für ${data.childName} zu hinterlassen!` : ' Melde dich an, um loszulegen!'}
            </p>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" style={{ gap: '8px' }}>Zum Login</Button>
            </Link>
          </article>
        </main>
      </div>
    );
  }

  // State: Playback
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar variant="playback" />

      <main className="container animate-fade-up" style={{ padding: '60px 24px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <article style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="mk-badge mk-badge-accent" style={{ marginBottom: '16px' }}>
              Sticker {data.yearLabel ?? '-'}
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 8vw, 2.5rem)', color: 'var(--color-primary)', marginBottom: '8px' }}>
              {data.childName ? `${data.childName}s Geschichte` : 'Deine Audio-Erinnerung'}
            </h1>
            <p className="muted" style={{ fontSize: 'clamp(1rem, 4vw, 1.2rem)' }}>
              {data.audio.title || 'In Liebe aufgenommen'}
            </p>
          </article>

          <AudioPlayer src={data.audio.presignedUrl} />

          <p className="text-center muted" style={{ marginTop: '40px', fontSize: '0.9rem', fontStyle: 'italic' }}>
            "Die Stimme ist die kürzeste Brücke zwischen zwei Herzen."
          </p>
        </div>
      </main>

      <footer style={{ padding: '40px 0', textAlign: 'center' }}>
        <p className="muted" style={{ fontSize: '0.8rem' }}>
          Dieses Hör-Erlebnis wurde ermöglicht durch <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>MalinKiddy</span>.
        </p>
      </footer>
    </div>
  );
}
