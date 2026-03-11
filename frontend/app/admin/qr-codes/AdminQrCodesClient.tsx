'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AdminQRTable } from '@/components/AdminQRTable';
import { Navbar } from '@/components/Navbar';
import { Modal } from '@/components/ui/Modal';
import { QRCodeSVG } from 'qrcode.react';
import { ChevronLeft, ChevronRight, FileSearch, Archive, Trash2 } from 'lucide-react';

interface ListResponse {
  codes: Array<{
    code: string;
    batchId: string;
    isActive: boolean;
    assignedTo?: { email?: string } | null;
    createdAt: string;
  }>;
  total: number;
  page: number;
  pages: number;
}

export default function AdminQrCodesClient() {
  const [status, setStatus] = useState<'assigned' | 'unassigned' | ''>('');
  const [batchId, setBatchId] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<string | null>(null);

  const load = async () => {
    const params = new URLSearchParams({ page: String(page), limit: '50' });
    if (batchId) params.set('batchId', batchId);
    if (status) params.set('status', status);
    const result = await apiFetch<ListResponse>(`/api/admin/qr/list?${params.toString()}`);
    setData(result);
  };

  useEffect(() => {
    load().catch((err: Error) => setError(err.message));
  }, [page, status]);

  const onDelete = (code: string) => {
    setToDelete(code);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await apiFetch(`/api/admin/qr/${toDelete}`, { method: 'DELETE' });
      setToDelete(null);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Löschen');
    }
  };

  const qrShareUrl = selectedCode
    ? typeof window !== 'undefined'
      ? `${window.location.origin}/play/${selectedCode}`
      : `http://localhost:3000/play/${selectedCode}`
    : '';

  const onExportZip = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const params = new URLSearchParams();
    if (batchId) params.set('batchId', batchId);
    window.location.href = `${apiUrl}/api/admin/qr/export-zip?${params.toString()}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar variant="admin" onLogout={() => window.location.href = '/login'} />

      <main className="container mk-admin-shell animate-fade-up" style={{ padding: '20px' }}>
        <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <FileSearch size={40} />
              QR-Code Katalog
            </h1>
            <p className="muted" style={{ marginTop: '8px' }}>Verwalte alle gedruckten und zugewiesenen Sticker einzeln.</p>
          </div>
          <Button onClick={onExportZip} className="w-full-mobile" style={{ background: 'var(--color-success)', gap: '8px', padding: '12px 24px' }}>
            <Archive size={20} />
            Druck-ZIP exportieren
          </Button>
        </header>

        <section className="mk-card" style={{ marginBottom: '32px' }}>
          <div className="mk-grid-2" style={{ alignItems: 'flex-end' }}>
            <div>
              <label className="mk-label">Nach Batch-ID suchen</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Input value={batchId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBatchId(e.target.value)} placeholder="z.B. batch_2026_03" />
                <Button onClick={() => void load()}>Suchen</Button>
              </div>
            </div>
            <div>
              <label className="mk-label">Filter: Status</label>
              <div className="mk-actions" style={{ gap: '4px', display: 'flex' }}>
                <Button variant={status === '' ? 'primary' : 'secondary'} style={{ height: '48px', flex: 1 }} onClick={() => setStatus('')}>Alle</Button>
                <Button variant={status === 'assigned' ? 'primary' : 'secondary'} style={{ height: '48px', flex: 1 }} onClick={() => setStatus('assigned')}>Belegt</Button>
                <Button variant={status === 'unassigned' ? 'primary' : 'secondary'} style={{ height: '48px', flex: 1 }} onClick={() => setStatus('unassigned')}>Frei</Button>
              </div>
            </div>
          </div>
        </section>

        {error && <p className="mk-error" style={{ marginBottom: '16px' }}>{error}</p>}

        <article className="mk-card" style={{ padding: '0', overflow: 'hidden' }}>
          {!data ? (
            <div className="mk-skeleton" style={{ height: '400px' }} />
          ) : (
            <>
              <AdminQRTable
                rows={data.codes}
                onDelete={(code) => void onDelete(code)}
                onShowQR={(code) => setSelectedCode(code)}
                onDownload={(code) => {
                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
                  window.location.href = `${apiUrl}/api/admin/qr/export-zip?code=${encodeURIComponent(code)}`;
                }}
              />

              <div className="mk-space-between" style={{ padding: '24px', background: 'var(--color-surface-warm)' }}>
                <p className="muted" style={{ fontWeight: '600' }}>
                  Eintrag {(data.page - 1) * 50 + 1} bis {Math.min(data.page * 50, data.total)} von {data.total}
                </p>
                <div className="mk-actions">
                  <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} style={{ gap: '8px' }}>
                    <ChevronLeft size={18} />
                    Vorherige
                  </Button>
                  <span className="mono" style={{ padding: '0 12px' }}>Seite {data.page} / {data.pages}</span>
                  <Button variant="secondary" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)} style={{ gap: '8px' }}>
                    Nächste
                    <ChevronRight size={18} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </article>
      </main>

      <Modal open={Boolean(selectedCode)} title="Vorschau: QR-Code" onClose={() => setSelectedCode(null)}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '10px' }}>
          <div style={{ padding: '24px', background: 'white', border: '1px solid var(--color-border)', borderRadius: '24px', marginBottom: '20px' }}>
            <QRCodeSVG
              value={qrShareUrl}
              size={220}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "/logo-small.png", // Attempting a logo if exists, else it just ignores
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          </div>
          <p className="mono" style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '4px' }}>
            {selectedCode}
          </p>
          <p className="muted" style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
            Scan-URL: {qrShareUrl}
          </p>
        </div>
      </Modal>

      <Modal open={Boolean(toDelete)} title="QR-Code löschen?" onClose={() => setToDelete(null)}>
        <div style={{ padding: '8px 0' }}>
          <p className="muted" style={{ marginBottom: '24px', lineHeight: '1.6' }}>
            Bist du sicher, dass du den Sticker-Code <strong style={{ color: 'var(--color-primary)' }}>{toDelete}</strong> unwiderruflich löschen möchtest?
            Falls ein Audio damit verknüpft ist, wird auch dieses gelöscht.
          </p>
          <div className="mk-actions" style={{ justifyContent: 'flex-end', gap: '12px' }}>
            <Button variant="secondary" onClick={() => setToDelete(null)}>Abbrechen</Button>
            <Button
              onClick={() => void confirmDelete()}
              style={{ background: 'var(--color-error)', gap: '8px' }}
            >
              <Trash2 size={18} />
              Unwiderruflich löschen
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
