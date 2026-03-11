import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/Navbar';
import { Mic, PlayCircle, QrCode } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      <Navbar />

      <main>
        <section className="mk-hero-section ">
          <div className="container">
            <div className="mk-hero-content animate-fade-up">
              <div className="mk-badge mk-badge-accent" style={{ marginBottom: '20px' }}>
                Neu: QR-Audio Erinnerungen
              </div>
              <h1 className="mk-hero-title">Deine Stimme. Seine Geschichte. Ein Leben lang.</h1>
              <p className="mk-hero-lead">
                Verwandle dein MalinKiddy Erinnerungsbuch in ein lebendiges Album.
                Sichere die kostbarsten Momente mit Audio-Aufnahmen, die über QR-Codes jederzeit abrufbar sind.
              </p>
              <div className="mk-actions" style={{ justifyContent: 'center' }}>
                <Link href="/login">
                  <Button style={{ padding: '16px 40px', fontSize: '1.2rem' }}>Erinnerung aufnehmen</Button>
                </Link>
              </div>
            </div>

            <div className="mk-hero-image-wrap animate-fade-up">
              <div className="mk-hero-image"></div>
            </div>
          </div>
        </section>

        <section style={{ padding: '80px 0', background: 'var(--color-surface-warm)' }}>
          <div className="container">
            <h2 className="text-center" style={{ marginBottom: '48px', fontSize: '2.5rem', color: 'var(--color-primary)' }}>
              Wie es funktioniert
            </h2>
            <div className="mk-features">
              <div className="mk-feature-card">
                <span className="mk-feature-icon">
                  <QrCode size={30} strokeWidth={2.2} />
                </span>
                <h3>Scan & Anmeldung</h3>
                <p className="muted">Scanne den QR-Code in deinem Buch und logge dich sicher ein.</p>
              </div>
              <div className="mk-feature-card">
                <span className="mk-feature-icon">
                  <Mic size={30} strokeWidth={2.2} />
                </span>
                <h3>Aufnehmen</h3>
                <p className="muted">Lade ein Lied, eine Nachricht oder eine Geschichte direkt von deinem Handy hoch.</p>
              </div>
              <div className="mk-feature-card">
                <span className="mk-feature-icon">
                  <PlayCircle size={30} strokeWidth={2.2} />
                </span>
                <h3>Abspielen</h3>
                <p className="muted">Jeder kann den Code scannen und sofort deine Stimme hören, ganz ohne App.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="container " style={{ padding: '100px 0' }}>
          <div className="mk-cta-box sm:glass sm:rounded-lg outline-none border-none">
            <h2>Bereit, Erinnerungen zu schenken?</h2>
            <p className="muted" style={{ color: 'white' }}>
              Beginne noch heute damit, die Kindheit deiner Liebsten hörbar zu machen.
            </p>
            <Link href="/login" style={{ marginTop: '20px', display: 'inline-block' }}>
              <Button variant="secondary" style={{ padding: '14px 40px' }}>Jetzt ausprobieren</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer style={{ padding: '60px 0', borderTop: '1px solid var(--color-border)' }}>
        <div className="container mk-space-between">
          <span className="mk-logo" style={{ fontSize: '1.2rem' }}>MalinKiddy</span>
          <p className="muted">&copy; {new Date().getFullYear()} MalinKiddy. Mit Liebe gemacht.</p>
        </div>
      </footer>
    </div>
  );
}
