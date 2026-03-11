'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { AdminStatsCard } from '@/components/AdminStatsCard';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/Navbar';
import { LayoutDashboard, History, PlusCircle, Search, Activity, ChevronRight, Server, Hash, Users, Mic, Database } from 'lucide-react';

interface Stats {
  totalQRCodes: number;
  totalUsers: number;
  totalRecordings: number;
  totalStorageMB: number;
  recentUploads: Array<{ code: string; email: string; uploadedAt: string }>;
}

export default function AdminDashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await apiFetch<Stats>('/api/admin/stats');
        setStats(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fehler');
      }
    };
    void run();
  }, []);

  if (!stats && !error) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
        <Navbar variant="admin" onLogout={() => window.location.href = '/login'} />
        <main className="container mk-admin-shell">
          <div className="mk-skeleton" style={{ height: '400px' }} />
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar variant="admin" onLogout={() => window.location.href = '/login'} />

      <main className="container mk-admin-shell animate-fade-up" style={{ padding: '20px' }}>
        <header style={{ marginBottom: '32px' }}>
          <h1 style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '16px', }}>
            <LayoutDashboard size={40} />
            System-Übersicht
          </h1>
          <p className="muted" style={{ marginTop: '8px' }}>Echtzeit-Statistiken der MalinKiddy Plattform.</p>
        </header>

        {error && (
          <div className="mk-card" style={{ marginBottom: '32px', borderColor: 'var(--color-error)' }}>
            <p className="mk-error">{error}</p>
          </div>
        )}

        {stats && (
          <>
            <section className="mk-stat-grid">
              <AdminStatsCard label="Aktive Sticker" value={stats.totalQRCodes} Icon={Hash} />
              <AdminStatsCard label="Eltern-Accounts" value={stats.totalUsers} Icon={Users} />
              <AdminStatsCard label="Audio-Memories" value={stats.totalRecordings} Icon={Mic} />
              <AdminStatsCard label="Speicher (MB)" value={stats.totalStorageMB} Icon={Database} />
            </section>

            <section className="mk-grid-2">
              <article className="mk-card">
                <div className="mk-space-between" style={{ marginBottom: '24px', flexWrap: 'wrap' }}>
                  <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <History size={20} />
                    Letzte Aktivitäten
                  </h2>
                  <Link href="/admin/qr-codes" className="mk-admin-link" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                    Alle ansehen <ChevronRight size={16} />
                  </Link>
                </div>

                <div className="mk-table-wrap">
                  <table className="mk-table">
                    <thead>
                      <tr>
                        <th>Sticker</th>
                        <th>Benutzer</th>
                        <th className="hidden-mobile">Zeit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentUploads.length === 0 && (
                        <tr><td colSpan={3} className="text-center muted">Keine Uploads heute.</td></tr>
                      )}
                      {stats.recentUploads.map((upload) => (
                        <tr key={`${upload.code}-${upload.uploadedAt}`}>
                          <td className="mono" style={{ fontWeight: '700' }}>{upload.code}</td>
                          <td>{upload.email}</td>
                          <td className="muted hidden-mobile">{new Date(upload.uploadedAt).toLocaleString('de-DE')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="mk-card" style={{ background: 'var(--color-surface-warm)' }}>
                <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <PlusCircle size={20} />
                  Schnellzugriff
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Link href="/admin/generate">
                    <Button style={{ width: '100%', justifyContent: 'flex-start', gap: '12px' }}>
                      <PlusCircle size={18} />
                      Neue Batch generieren
                    </Button>
                  </Link>
                  <Link href="/admin/qr-codes">
                    <Button variant="secondary" style={{ width: '100%', justifyContent: 'flex-start', gap: '12px' }}>
                      <Search size={18} />
                      Inventar prüfen
                    </Button>
                  </Link>
                </div>
                <div style={{ marginTop: '32px', padding: '20px', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Server size={16} />
                    System-Status
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-success)', fontWeight: '700' }}>
                    <div className="mk-status-dot active"></div>
                    AWS Stockholm Online
                  </div>
                </div>
              </article>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
