'use client';

import Link from 'next/link';
import { Button } from './ui/Button';
import { useEffect, useState } from 'react';

interface NavbarProps {
    variant?: 'public' | 'dashboard' | 'admin' | 'playback';
    onLogout?: () => void;
    children?: React.ReactNode;
}

export function Navbar({ variant = 'public', onLogout, children }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Logo href depends on variant — dashboard stays inside, public goes to homepage
    const logoHref = variant === 'dashboard' ? '/dashboard' : variant === 'admin' ? '/admin/dashboard' : '/';

    return (
        <nav className={`mk-navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container mk-navbar-inner">

                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link href={logoHref} className="mk-logo">MalinKiddy</Link>
                    {variant === 'playback' && (
                        <span className="mk-badge mk-badge-accent" style={{ fontSize: '0.7rem' }}>
                            Hör-Modus
                        </span>
                    )}
                </div>

                {/* Desktop centre links */}
                <div className="mk-nav-links">
                    {variant === 'public' && (
                        <>
                            <Link href="/about" className="mk-nav-link">Über uns</Link>
                            <Link href="/contact" className="mk-nav-link">Kontakt</Link>
                        </>
                    )}

                    {variant === 'dashboard' && (
                        <>
                            <Link href="/dashboard" className="mk-nav-link">Meine Sticker</Link>
                            <Link href="/dashboard#help" className="mk-nav-link">Hilfe</Link>
                        </>
                    )}

                    {variant === 'admin' && (
                        <>
                            <Link href="/admin/dashboard" className="mk-nav-link">Übersicht</Link>
                            <Link href="/admin/generate" className="mk-nav-link">Generieren</Link>
                            <Link href="/admin/qr-codes" className="mk-nav-link">Katalog</Link>
                        </>
                    )}
                </div>

                {/* Right-side actions */}
                <div className="mk-nav-actions">
                    {children}

                    {variant === 'public' && (
                        <Link href="/login">
                            <Button style={{ padding: '10px 24px' }}>Einloggen</Button>
                        </Link>
                    )}


                    {variant === 'dashboard' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: 'var(--color-primary-soft)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1rem',
                                color: 'var(--color-primary)',
                                fontWeight: 700
                            }}>
                                👤
                            </div>
                            <Button variant="secondary" onClick={onLogout} style={{ padding: '8px 18px' }}>
                                Abmelden
                            </Button>
                        </div>
                    )}

                    {variant === 'admin' && (
                        <Button variant="secondary" onClick={onLogout}>
                            Abmelden
                        </Button>
                    )}

                    {/* Mobile toggle */}
                    <button
                        className="mk-mobile-toggle"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Menü öffnen"
                    >
                        {isMobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown */}
            {isMobileMenuOpen && (
                <div className="mk-mobile-menu animate-fade-up">
                    <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column' }}>
                        {variant === 'public' && (
                            <>
                                <Link href="/about" className="mk-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Über uns</Link>
                                <Link href="/contact" className="mk-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Kontakt</Link>
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button style={{ width: '100%' }}>Einloggen</Button>
                                </Link>
                            </>
                        )}
                        {variant === 'dashboard' && (
                            <>
                                <Link href="/dashboard" className="mk-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Meine Sticker</Link>
                                <Link href="/dashboard#help" className="mk-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Hilfe</Link>
                                <Button variant="secondary" onClick={() => { onLogout?.(); setIsMobileMenuOpen(false); }}>Abmelden</Button>
                            </>
                        )}
                        {variant === 'admin' && (
                            <>
                                <Link href="/admin/dashboard" className="mk-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Übersicht</Link>
                                <Link href="/admin/generate" className="mk-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Generieren</Link>
                                <Link href="/admin/qr-codes" className="mk-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Katalog</Link>
                                <Button variant="secondary" onClick={() => { onLogout?.(); setIsMobileMenuOpen(false); }}>Abmelden</Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
