'use client';

import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { QrCode, Trash2, Download } from 'lucide-react';

interface QRRow {
  code: string;
  batchId: string;
  isActive: boolean;
  assignedTo?: { email?: string } | null;
  createdAt: string;
}

interface Props {
  rows: QRRow[];
  onDelete: (code: string) => void;
  onShowQR: (code: string) => void;
  onDownload: (code: string) => void;
}

export function AdminQRTable({ rows, onDelete, onShowQR, onDownload }: Props) {
  return (
    <div className="mk-table-wrap" style={{ border: 'none', borderRadius: 0 }}>
      <table className="mk-table">
        <thead>
          <tr>
            <th style={{ width: '60px' }}>QR</th>
            <th>Sticker-Code</th>
            <th>Status</th>
            <th className="hidden-mobile">Zugehöriger User</th>
            <th className="hidden-mobile">Batch</th>
            <th>Aktion</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center muted" style={{ padding: '60px' }}>
                Keine Sticker in diesem Bereich gefunden.
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row.code}>
              <td>
                <button
                  onClick={() => onShowQR(row.code)}
                  style={{
                    background: 'var(--color-primary-soft)',
                    color: 'var(--color-primary)',
                    border: 'none',
                    borderRadius: '8px',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  className="mk-qr-btn"
                  title="QR-Code anzeigen"
                >
                  <QrCode size={18} />
                </button>
              </td>
              <td className="mono" style={{ fontWeight: 700 }}>{row.code}</td>
              <td>
                <Badge tone={row.assignedTo ? 'success' : 'muted'}>
                  {row.assignedTo ? 'Aktiviert' : 'Verfügbar'}
                </Badge>
              </td>
              <td className="hidden-mobile" style={{ fontSize: '0.9rem' }}>{row.assignedTo?.email ?? '—'}</td>
              <td className="mono muted hidden-mobile" style={{ fontSize: '0.8rem' }}>{row.batchId.slice(0, 12)}</td>
              <td style={{ verticalAlign: 'middle' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <button
                    onClick={() => onDownload(row.code)}
                    style={{
                      color: 'var(--color-success)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Einzel-Sticker Export (Bilder + CSV)"
                  >
                    <Download size={14} />
                    Download
                  </button>
                  <button
                    onClick={() => onDelete(row.code)}
                    style={{
                      color: 'var(--color-error)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={14} />
                    Löschen
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
