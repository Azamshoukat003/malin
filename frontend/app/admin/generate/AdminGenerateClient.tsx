'use client';

import Link from 'next/link';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Navbar } from '@/components/Navbar';
import { Printer, Download, Settings, FileSpreadsheet, PlusCircle, Archive } from 'lucide-react';

interface GenerateResponse {
  batchId: string;
  count: number;
  codes: Array<{ code: string; publicUrl: string }>;
}

export default function AdminGenerateClient() {
  const [count, setCount] = useState(100);
  const [batchLabel, setBatchLabel] = useState(`Druck ${new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}`);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onGenerate = async () => {
    setError(null);
    setProgress(10);
    try {
      const generated = await apiFetch<GenerateResponse>('/api/admin/qr/generate', {
        method: 'POST',
        body: JSON.stringify({ count, batchLabel })
      });
      setResult(generated);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Generieren');
      setProgress(0);
    }
  };

  const onExport = () => {
    if (!result) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    window.location.href = `${apiUrl}/api/admin/qr/export?batchId=${encodeURIComponent(result.batchId)}`;
  };

  const onExportZip = () => {
    if (!result) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    window.location.href = `${apiUrl}/api/admin/qr/export-zip?batchId=${encodeURIComponent(result.batchId)}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar variant="admin" onLogout={() => window.location.href = '/login'} />

      <main className="container mk-admin-shell animate-fade-up" style={{ padding: '20px' }}>
        <header style={{ marginBottom: '32px' }}>
          <h1 style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '16px', }}>
            <PlusCircle size={40} />
            QR-Batch Erstellung
          </h1>
          <p className="muted" style={{ marginTop: '8px' }}>Erzeuge neue Sticker-Codes für die Produktion.</p>
        </header>

        <section className="mk-grid-2">
          <article className="mk-card">
            <h2 style={{ marginBottom: '24px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Settings size={20} />
              Batch Parameter
            </h2>
            <div className="mk-form">
              <div className="mk-input-group">
                <label className="mk-label">Anzahl der Sticker</label>
                <Input
                  type="number"
                  min={1}
                  max={5000}
                  value={count}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCount(Number(e.target.value))}
                />
                <p className="muted" style={{ fontSize: '0.8rem', marginTop: '4px' }}>Empfohlen: 100-500 pro Batch.</p>
              </div>

              <div className="mk-input-group">
                <label className="mk-label">Batch-Bezeichnung (für Archiv)</label>
                <Input value={batchLabel} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBatchLabel(e.target.value)} />
              </div>

              <div style={{ marginTop: '32px' }}>
                <Button onClick={() => void onGenerate()} style={{ width: '100%', height: '54px' }}>
                  Codes generieren & speichern
                </Button>
              </div>

              {progress > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <ProgressBar value={progress} max={100} />
                </div>
              )}
              {error && <p className="mk-error" style={{ marginTop: '16px' }}>{error}</p>}
            </div>
          </article>

          <article className="mk-card" style={{ background: 'var(--color-surface-warm)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', alignItems: 'center' }}>
            <div style={{ marginBottom: '16px', color: 'var(--color-primary)' }}>
              <Printer size={48} />
            </div>
            <h3>Produktions-Tipp</h3>
            <p className="muted" style={{ marginTop: '12px' }}>
              Nach der Generierung kannst du eine CSV-Datei exportieren.
              Diese ist optimiert für den Import in Druck-Software wie Avery oder Adobe InDesign.
            </p>
          </article>
        </section>

        {result && (
          <section className="mk-card animate-fade-up" style={{ marginTop: '32px' }}>
            <div className="mk-space-between" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '24px' }}>
              <div>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileSpreadsheet size={28} />
                  Batch erfolgreich erstellt
                </h2>
                <p className="muted" style={{ marginTop: '4px' }}>ID: <span className="mono">{result.batchId}</span> | {result.count} Sticker</p>
              </div>
              <div className="mk-actions w-full-mobile">
                <Button variant="secondary" onClick={onExport} style={{ flexGrow: 1, gap: '8px' }}>
                  <FileSpreadsheet size={18} />
                  CSV Daten
                </Button>
                <Button variant="primary" onClick={onExportZip} style={{ flexGrow: 1, background: 'var(--color-success)', gap: '8px' }}>
                  <Archive size={18} />
                  Druck-ZIP
                </Button>
              </div>
            </div>

            <div className="mk-table-wrap">
              <table className="mk-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Öffentliche URL</th>
                  </tr>
                </thead>
                <tbody>
                  {result.codes.slice(0, 10).map((row) => (
                    <tr key={row.code}>
                      <td className="mono" style={{ fontWeight: '700' }}>{row.code}</td>
                      <td className="mono">{row.publicUrl}</td>
                    </tr>
                  ))}
                  {result.codes.length > 10 && (
                    <tr>
                      <td colSpan={2} className="text-center muted" style={{ background: 'var(--color-bg)' }}>
                        ... und {result.count - 10} weitere Sticker.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
