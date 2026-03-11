'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { QRSlotCard } from '@/components/QRSlotCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Navbar } from '@/components/Navbar';
import { Sparkles, Library, Plus, Search, Trash2 } from 'lucide-react';

interface Slot {
  qrCode: string;
  yearLabel: number | null;
  hasAudio: boolean;
  audio: { title: string | null; durationSeconds: number | null } | null;
}

interface RecordingsResponse {
  totalSlots: number;
  recorded: number;
  slots: Slot[];
}

interface MeData {
  userId: string;
  email: string;
  childName: string | null;
}

export default function DashboardClient() {
  const router = useRouter();
  const [me, setMe] = useState<MeData | null>(null);
  const [data, setData] = useState<RecordingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState('');

  const reload = async () => {
    const [meData, rec] = await Promise.all([
      apiFetch<MeData>('/api/auth/me'),
      apiFetch<RecordingsResponse>('/api/user/recordings')
    ]);
    setMe(meData);
    setData(rec);
  };

  useEffect(() => {
    const run = async () => {
      try {
        await reload();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fehler');
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  const completion = useMemo(() => {
    if (!data || data.totalSlots === 0) return 0;
    return Math.round((data.recorded / data.totalSlots) * 100);
  }, [data]);

  const onLogout = async () => {
    await apiFetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const onDelete = async () => {
    if (!toDelete) return;
    await apiFetch(`/api/upload/${toDelete}`, { method: 'DELETE' });
    setToDelete(null);
    await reload();
  };

  const onAddCode = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = newCode.trim();
    if (!code) return;
    router.push(`/upload/${code}`);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar variant="dashboard" onLogout={() => void onLogout()} />
        <main className="container animate-fade-up" style={{ padding: '40px 0' }}>
          <div className="mk-skeleton" style={{ height: '200px', marginBottom: '40px' }} />
          <div className="mk-dashboard-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="mk-skeleton" style={{ height: '300px' }} />)}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar variant="dashboard" onLogout={() => void onLogout()} />

      <main style={{ padding: '32px 0', flex: 1 }}>
        <div className="container">
          {/* Welcome banner */}
          <section style={{
            marginBottom: '32px',
            background: 'var(--grad-hero)',
            color: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: 'min(32px, 5vw) min(40px, 6vw)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            boxShadow: 'var(--shadow-lg)'
          }} className="mk-banner">
            <div style={{ flex: 1, minWidth: '280px' }}>
              <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                Hallo, {me?.childName || 'Familie'}!
                <Sparkles size={28} style={{ color: 'var(--color-accent-light)' }} />
              </h1>
              <p style={{ opacity: 0.9, fontWeight: 500, fontSize: '0.95rem' }}>
                {data?.recorded} von {data?.totalSlots} Erinnerungen aufgenommen.
              </p>
              <div style={{ marginTop: '20px', maxWidth: '400px' }}>
                <p style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '6px' }}>Fortschritt: {completion}%</p>
                <ProgressBar value={data?.recorded || 0} max={data?.totalSlots || 18} />
              </div>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="w-full-mobile"
              style={{ background: 'white', color: 'var(--color-primary)', fontWeight: 700, gap: '8px', padding: '12px 24px' }}
            >
              <Plus size={18} />
              Neuer Sticker
            </Button>
          </section>

          {/* Sticker collection */}
          <section>
            <div className="mk-space-between" style={{ marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '4px' }}>Meine Stickersammlung</h2>
                <p className="muted" style={{ fontSize: '0.9rem' }}>Klicke auf einen Sticker, um aufzunehmen oder zu bearbeiten.</p>
              </div>
              <span className="mk-badge" style={{ whiteSpace: 'nowrap' }}>{data?.recorded ?? 0} / {data?.totalSlots ?? 18} aufgenommen</span>
            </div>

            {data?.slots.length === 0 ? (
              <div className="mk-card text-center" style={{ padding: '80px 40px' }}>
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ padding: '24px', background: 'var(--color-primary-soft)', borderRadius: '50%', color: 'var(--color-primary)' }}>
                    <Library size={48} />
                  </div>
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Noch keine Sticker vorhanden</h3>
                <p className="muted" style={{ marginBottom: '24px' }}>Gib den Code von deinem Aufkleber ein, um loszulegen.</p>
                <Button onClick={() => setShowAddModal(true)} style={{ gap: '8px' }}>
                  <Search size={18} />
                  QR-Code eingeben
                </Button>
              </div>
            ) : (
              <div className="mk-dashboard-grid">
                {data?.slots.map((slot) => (
                  <QRSlotCard key={slot.qrCode} slot={slot} onDelete={(code) => setToDelete(code)} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modals */}
      <Modal open={showAddModal} title="QR-Code eingeben" onClose={() => setShowAddModal(false)}>
        <form className="mk-form" onSubmit={onAddCode}>
          <div className="mk-input-group">
            <label className="mk-label">Sticker Code</label>
            <Input
              value={newCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCode(e.target.value)}
              placeholder="z.B. MK-2026-ABC123"
              required
            />
          </div>
          <div className="mk-actions">
            <Button type="submit">Fortfahren</Button>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Abbrechen</Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(toDelete)} title="Erinnerung löschen?" onClose={() => setToDelete(null)}>
        <p className="muted" style={{ marginBottom: '20px' }}>Soll diese wundervolle Erinnerung wirklich gelöscht werden?</p>
        <div className="mk-actions">
          <Button variant="danger" onClick={() => void onDelete()}>Ja, löschen</Button>
          <Button variant="secondary" onClick={() => setToDelete(null)}>Abbrechen</Button>
        </div>
      </Modal>
    </div>
  );
}
