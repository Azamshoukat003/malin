'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ContactPage() {
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        // Simulate a send (in production this would call an API route)
        await new Promise((r) => setTimeout(r, 1200));
        setStatus('sent');
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
            <Navbar variant="public" />

            <main>
                {/* Hero */}
                <section style={{
                    background: 'var(--grad-hero)',
                    color: 'white',
                    padding: 'min(100px, 12vw) 0',
                    textAlign: 'center'
                }}>
                    <div className="container animate-fade-up" style={{ maxWidth: '700px' }}>
                        <div className="mk-badge mk-badge-accent" style={{ marginBottom: '20px', display: 'inline-flex' }}>
                            Wir freuen uns von Dir zu hören
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', marginBottom: '20px' }}>
                            Kontaktiere uns
                        </h1>
                        <p style={{ fontSize: '1.15rem', opacity: 0.85, lineHeight: 1.7 }}>
                            Hast du eine Frage, ein Feedback oder möchtest du einfach Hallo sagen? Schreib uns gern!
                        </p>
                    </div>
                </section>

                {/* Contact Section */}
                <section style={{ padding: 'min(80px, 10vw) 0' }}>
                    <div className="container">
                        <div className="mk-grid-2" style={{ alignItems: 'flex-start' }}>

                            {/* Left: Info Cards */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <article style={{
                                    padding: '32px',
                                    background: 'var(--color-surface-warm)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid var(--color-border)',
                                    display: 'flex',
                                    gap: '20px',
                                    alignItems: 'flex-start'
                                }}>
                                    <span style={{ fontSize: '2rem' }}>✉️</span>
                                    <div>
                                        <h3 style={{ marginBottom: '6px', color: 'var(--color-primary)' }}>E-Mail</h3>
                                        <p className="muted">Wir antworten innerhalb von 24 Stunden.</p>
                                        <a href="mailto:hallo@malinkiddy.com" style={{ color: 'var(--color-accent)', fontWeight: 700, textDecoration: 'none', marginTop: '8px', display: 'block' }}>hallo@malinkiddy.com</a>
                                    </div>
                                </article>

                                <article style={{
                                    padding: '32px',
                                    background: 'var(--color-surface-warm)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid var(--color-border)',
                                    display: 'flex',
                                    gap: '20px',
                                    alignItems: 'flex-start'
                                }}>
                                    <span style={{ fontSize: '2rem' }}>🌍</span>
                                    <div>
                                        <h3 style={{ marginBottom: '6px', color: 'var(--color-primary)' }}>Standort</h3>
                                        <p className="muted">MalinKiddy GmbH</p>
                                        <p className="muted">Deutschland</p>
                                    </div>
                                </article>

                                <article style={{
                                    padding: '32px',
                                    background: 'var(--color-surface-warm)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid var(--color-border)',
                                    display: 'flex',
                                    gap: '20px',
                                    alignItems: 'flex-start'
                                }}>
                                    <span style={{ fontSize: '2rem' }}>⏱️</span>
                                    <div>
                                        <h3 style={{ marginBottom: '6px', color: 'var(--color-primary)' }}>Antwortzeiten</h3>
                                        <p className="muted">Mo – Fr: 9:00 – 18:00 Uhr</p>
                                        <p className="muted">Wochenende: kein Support</p>
                                    </div>
                                </article>
                            </div>

                            {/* Right: Contact Form */}
                            <article className="mk-card" style={{ padding: '48px' }}>
                                {status === 'sent' ? (
                                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
                                        <h2 style={{ color: 'var(--color-primary)', marginBottom: '12px' }}>Danke!</h2>
                                        <p className="muted">Wir haben deine Nachricht erhalten und melden uns so schnell wie möglich.</p>
                                    </div>
                                ) : (
                                    <form className="mk-form" onSubmit={(e) => void handleSubmit(e)}>
                                        <h2 style={{ fontSize: '1.8rem', marginBottom: '32px', color: 'var(--color-primary)' }}>
                                            Schreib uns
                                        </h2>

                                        <div className="mk-input-group">
                                            <label className="mk-label" htmlFor="contact-name">Dein Name</label>
                                            <Input
                                                id="contact-name"
                                                value={formState.name}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormState({ ...formState, name: e.target.value })}
                                                placeholder="Max Mustermann"
                                                required
                                            />
                                        </div>

                                        <div className="mk-input-group">
                                            <label className="mk-label" htmlFor="contact-email">Deine E-Mail</label>
                                            <Input
                                                id="contact-email"
                                                type="email"
                                                value={formState.email}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormState({ ...formState, email: e.target.value })}
                                                placeholder="max@beispiel.de"
                                                required
                                            />
                                        </div>

                                        <div className="mk-input-group">
                                            <label className="mk-label" htmlFor="contact-message">Deine Nachricht</label>
                                            <textarea
                                                id="contact-message"
                                                className="mk-input"
                                                value={formState.message}
                                                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                                placeholder="Wie können wir dir helfen?"
                                                rows={5}
                                                required
                                                style={{ resize: 'vertical' }}
                                            />
                                        </div>

                                        {status === 'error' && (
                                            <p className="mk-error" style={{ marginBottom: '16px' }}>Es ist ein Fehler aufgetreten. Bitte versuche es erneut.</p>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={status === 'sending'}
                                            style={{ width: '100%', height: '54px' }}
                                        >
                                            {status === 'sending' ? 'Wird gesendet...' : 'Nachricht senden'}
                                        </Button>
                                    </form>
                                )}
                            </article>
                        </div>
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
