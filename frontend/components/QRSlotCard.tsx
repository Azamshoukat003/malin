import Link from 'next/link';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { formatDuration } from '@/lib/utils';
import { Mic, Volume2, Pencil, Trash2 } from 'lucide-react';

interface Slot {
  qrCode: string;
  yearLabel: number | null;
  hasAudio: boolean;
  audio: { title: string | null; durationSeconds: number | null } | null;
}

interface Props {
  slot: Slot;
  onDelete: (code: string) => void;
}

export function QRSlotCard({ slot, onDelete }: Props) {
  return (
    <div className={`mk-sticker-card ${slot.hasAudio ? 'recorded' : ''}`}>

      {/* Status badge (top-right) */}
      <div style={{ position: 'absolute', top: '14px', right: '14px' }}>
        <Badge tone={slot.hasAudio ? 'success' : 'muted'}>
          {slot.hasAudio ? 'Aufgenommen' : 'Leer'}
        </Badge>
      </div>

      {/* Icon */}
      <div style={{ marginBottom: '12px', color: slot.hasAudio ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
        {slot.hasAudio ? <Volume2 size={32} /> : <Mic size={32} />}
      </div>

      {/* Label */}
      <div className="mk-sticker-year">
        {slot.yearLabel ? `Sticker ${slot.yearLabel}` : '— Sticker —'}
      </div>

      {/* Audio title or placeholder */}
      <p style={{
        fontWeight: 600,
        fontSize: '0.95rem',
        marginBottom: '4px',
        color: 'var(--color-text)',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        padding: '0 8px'
      }}>
        {slot.hasAudio ? (slot.audio?.title || 'Unbenannte Aufnahme') : 'Noch kein Inhalt'}
      </p>

      {/* Duration */}
      <p className="muted" style={{ fontSize: '0.8rem', marginBottom: '16px' }}>
        {slot.hasAudio
          ? formatDuration(slot.audio?.durationSeconds || 0)
          : 'Warte auf deine Stimme…'}
      </p>

      {/* Action buttons — positioned with z-index so they're always clickable */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Link href={`/upload/${slot.qrCode}`} style={{ textDecoration: 'none' }}>
          <Button
            variant={slot.hasAudio ? 'secondary' : 'primary'}
            style={{ padding: '8px 18px', fontSize: '0.85rem', gap: '8px' }}
          >
            {slot.hasAudio ? (
              <>
                <Pencil size={14} />
                Bearbeiten
              </>
            ) : (
              <>
                <Mic size={14} />
                Aufnehmen
              </>
            )}
          </Button>
        </Link>

        {slot.hasAudio && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(slot.qrCode);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-error)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Trash2 size={14} />
            Löschen
          </button>
        )}
      </div>

      {/* QR code label at bottom */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        fontSize: '0.65rem',
        color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.5px'
      }}>
        {slot.qrCode}
      </div>
    </div>
  );
}
