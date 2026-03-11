import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
    title: 'Über uns | MalinKiddy',
    description: 'Erfahre mehr über MalinKiddy – die Idee, das Team und die Leidenschaft hinter dem Erinnerungsbuch für Kinder.'
};

export default function AboutPage() {
    return (
        <div>
            <Navbar variant="public" />

            <main>
                {/* Hero */}
                <section style={{
                    background: 'var(--grad-hero)',
                    color: 'white',
                    padding: 'min(100px, 12vw) 0',
                    textAlign: 'center'
                }}>
                    <div className="container animate-fade-up" style={{ maxWidth: '800px' }}>
                        <div className="mk-badge mk-badge-accent" style={{ marginBottom: '20px', display: 'inline-flex' }}>
                            Unsere Geschichte
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '24px' }}>
                            Wir glauben an die Kraft von Erinnerungen
                        </h1>
                        <p style={{ fontSize: '1.2rem', opacity: 0.85, lineHeight: 1.7 }}>
                            MalinKiddy entstand aus einem einfachen Wunsch: die Stimme eines geliebten Menschen für immer zu bewahren.
                            Nicht als alte Aufnahme die jemand vergisst, sondern lebendig verflochten in die Seiten eines Kinderbuches.
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section style={{ padding: 'min(100px, 12vw) 0', background: 'var(--color-bg)' }}>
                    <div className="container">
                        <div className="mk-grid-2" style={{ alignItems: 'center' }}>
                            <div className="animate-fade-up">
                                <span style={{
                                    display: 'inline-block',
                                    width: '48px',
                                    height: '4px',
                                    background: 'var(--color-accent)',
                                    borderRadius: '4px',
                                    marginBottom: '24px'
                                }} />
                                <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '24px' }}>
                                    Unsere Mission
                                </h2>
                                <p className="muted" style={{ fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '20px' }}>
                                    Wir verbinden analoge Magie mit digitaler Technologie. Dein MalinKiddy Buch bekommt durch einen kleinen QR-Sticker eine Seele – deine Stimme, dein Lied, deine Botschaft.
                                </p>
                                <p className="muted" style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                                    Jede Generation hinterlässt eine Spur. Mit MalinKiddy sorgst du dafür, dass diese Spur hörbar, greifbar und unvergesslich bleibt.
                                </p>
                            </div>

                            <div style={{
                                background: 'var(--color-surface-warm)',
                                borderRadius: 'var(--radius-lg)',
                                padding: '60px 40px',
                                textAlign: 'center',
                                border: '1px solid var(--color-border)'
                            }}>
                                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎙️</div>
                                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '12px' }}>Kein App-Download</h3>
                                <p className="muted">Einfach QR-Code scannen und sofort abspielen.</p>
                                <div style={{ marginTop: '32px', fontSize: '4rem', marginBottom: '16px' }}>🔐</div>
                                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '12px' }}>100% Privatsphäre</h3>
                                <p className="muted">Deine Aufnahmen gehören nur dir – sicher in der Cloud gespeichert.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section style={{ padding: '80px 0', background: 'var(--color-surface-warm)' }}>
                    <div className="container">
                        <h2 className="text-center" style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '16px' }}>
                            Was uns antreibt
                        </h2>
                        <p className="text-center muted" style={{ marginBottom: '60px', fontSize: '1.1rem' }}>
                            Drei Werte, die alles prägen was wir tun.
                        </p>
                        <div className="mk-features">
                            <div className="mk-feature-card">
                                <span className="mk-feature-icon">💚</span>
                                <h3 style={{ marginBottom: '12px' }}>Liebe zum Detail</h3>
                                <p className="muted">Jede Funktion ist mit Bedacht gestaltet, damit die Nutzung sich wie ein Geschenk anfühlt – nicht wie Technologie.</p>
                            </div>
                            <div className="mk-feature-card">
                                <span className="mk-feature-icon">🌱</span>
                                <h3 style={{ marginBottom: '12px' }}>Wachstum</h3>
                                <p className="muted">Wir hören auf unsere Nutzer und bauen das Produkt gemeinsam mit den Familien, die MalinKiddy täglich nutzen.</p>
                            </div>
                            <div className="mk-feature-card">
                                <span className="mk-feature-icon">🔒</span>
                                <h3 style={{ marginBottom: '12px' }}>Vertrauen</h3>
                                <p className="muted">Familienmomente sind heilig. Wir behandeln jede Aufnahme mit dem Respekt, den persönliche Erinnerungen verdienen.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container" style={{ padding: '100px 0' }}>
                    <div className="mk-cta-box">
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Bereit, Deine Geschichte zu erzählen?</h2>
                        <p style={{ opacity: 0.85, fontSize: '1.1rem', marginBottom: '32px' }}>
                            Scanne deinen ersten QR-Sticker und mach den Anfang.
                        </p>
                        <Link href="/login">
                            <Button variant="secondary" style={{ padding: '14px 40px', fontSize: '1rem' }}>Jetzt starten</Button>
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
