'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { ShieldCheck, X } from 'lucide-react';

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('mk_consent');
        if (!consent) {
            // Delay slightly for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const accept = () => {
        localStorage.setItem('mk_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '24px',
                left: '24px',
                right: '24px',
                zIndex: 5000,
                display: 'flex',
                justifyContent: 'center'
            }}
            className="animate-fade-up"
        >
            <div
                style={{
                    background: 'var(--color-surface)',
                    padding: '24px',
                    borderRadius: '24px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                    border: '1px solid var(--color-border)',
                    width: '100%',
                    maxWidth: '500px',
                    position: 'relative'
                }}
            >
                <button
                    onClick={() => setIsVisible(false)}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer'
                    }}
                >
                    <X size={20} />
                </button>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'var(--color-primary-soft)',
                        display: 'grid',
                        placeItems: 'center',
                        color: 'var(--color-primary)',
                        flexShrink: 0
                    }}>
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Datenschutz & Cookies</h4>
                        <p className="muted" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                            Wir speichern Audio-Erinnerungen und nutzen Cookies, um dir das beste Erlebnis zu bieten. Mit Klick auf "Akzeptieren" stimmst du der Speicherung zu.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button onClick={accept} style={{ flex: 1 }}>Akzeptieren</Button>
                    <Button variant="secondary" onClick={() => setIsVisible(false)} style={{ flex: 1 }}>Ablehnen</Button>
                </div>
            </div>
        </div>
    );
}
